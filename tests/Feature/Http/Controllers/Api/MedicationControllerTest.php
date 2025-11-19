<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Medication;
use App\Models\User;
use App\Packages\OpenAI\Contracts\OpenAIClientInterface;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class MedicationControllerTest extends TestCase
{
    use DatabaseTransactions;

    protected string $url = '/api/v1/medications';

    public function test_search_medications_by_name(): void
    {
        $user = User::factory()->create();

        Medication::factory()->create(['name' => 'Laravel']);

        $response = $this->actingAsUser($user)->getJson("{$this->url}/search?search=ravel");

        $response
            ->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment([
                'name' => 'Laravel',
            ]);
    }

    public function test_search_medications_requires_minimum_length(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAsUser($user)->getJson("{$this->url}/search?search=pa");

        $response->assertStatus(422);
    }

    public function test_check_interactions_with_no_existing_interactions(): void
    {
        $user = User::factory()->create();

        $medications = Medication::factory()->count(3)->create();
        $mainMedication = $medications->first();
        $checkMedications = $medications->slice(1)->pluck('id')->toArray();

        $this->mockOpenAIClient();

        $response = $this->actingAsUser($user)->postJson(
            "{$this->url}/{$mainMedication->id}/check-interactions",
            ['medications' => $checkMedications]
        );

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'interactions' => [
                        '*' => [
                            'medication_id',
                            'medication_name',
                            'has_interaction',
                            'severity',
                            'description',
                            'calculated_at',
                        ],
                    ],
                ],
            ]);
    }

    public function test_check_interactions_returns_cached_when_all_already_checked(): void
    {
        $user = User::factory()->create();

        $medications = Medication::factory()->count(3)->create();
        $mainMedication = $medications->first();
        $checkMedications = $medications->slice(1);

        $mainMedication->update([
            'interactions' => $checkMedications->map(fn ($med) => [
                'medication_id' => $med->id,
                'has_interaction' => true,
                'severity' => 'moderate',
                'calculated_at' => now()->toDateTimeString(),
            ])->toArray(),
        ]);

        $response = $this->actingAsUser($user)->postJson(
            "{$this->url}/{$mainMedication->id}/check-interactions",
            ['medications' => $checkMedications->pluck('id')->toArray()]
        );

        $response->assertStatus(200);

        $this->assertEquals(
            count($checkMedications),
            count($response->json('data.interactions'))
        );
    }

    public function test_check_interactions_validates_max_10_medications(): void
    {
        $user = User::factory()->create();

        $medications = Medication::factory()->count(12)->create();
        $mainMedication = $medications->first();
        $tooManyMedications = $medications->slice(1)->pluck('id')->toArray();

        $response = $this->actingAsUser($user)->postJson(
            "{$this->url}/{$mainMedication->id}/check-interactions",
            ['medications' => $tooManyMedications]
        );

        $response->assertStatus(422);
        $response->assertJsonStructure([
            'details' => ['medications'],
        ]);
    }

    public function test_check_interactions_validates_medication_exists(): void
    {
        $user = User::factory()->create();

        $mainMedication = Medication::factory()->create();

        $response = $this->actingAsUser($user)->postJson(
            "{$this->url}/{$mainMedication->id}/check-interactions",
            ['medications' => [99999]]
        );

        $response->assertStatus(422);
        $response->assertJsonStructure([
            'details' => ['medications.0'],
        ]);
    }

    public function test_check_interactions_prevents_checking_medication_with_itself(): void
    {
        $user = User::factory()->create();

        $mainMedication = Medication::factory()->create();

        $response = $this->actingAsUser($user)->postJson(
            "{$this->url}/{$mainMedication->id}/check-interactions",
            ['medications' => [$mainMedication->id]]
        );

        $response->assertStatus(422);
        $response->assertJsonStructure([
            'details' => ['medications.0'],
        ]);
    }

    public function test_check_interactions_requires_distinct_medications(): void
    {
        $user = User::factory()->create();

        $medications = Medication::factory()->count(3)->create();
        $mainMedication = $medications->first();
        $duplicateId = $medications->last()->id;

        $response = $this->actingAsUser($user)->postJson(
            "{$this->url}/{$mainMedication->id}/check-interactions",
            ['medications' => [$duplicateId, $duplicateId]]
        );

        $response->assertStatus(422);
        $response->assertJsonStructure([
            'details' => ['medications.0', 'medications.1'],
        ]);
    }

    private function mockOpenAIClient(): void
    {
        $mock = $this->createMock(OpenAIClientInterface::class);

        $mock->method('chatCompletion')->willReturn([
            'content' => json_encode([
                'interactions' => [
                    [
                        'medication_id' => 2,
                        'medication_name' => 'Test Medication',
                        'has_interaction' => true,
                        'severity' => 'moderate',
                        'description' => 'Test interaction description',
                    ],
                ],
            ]),
            'usage' => [
                'prompt_tokens' => 100,
                'completion_tokens' => 50,
                'total_tokens' => 150,
            ],
            'finish_reason' => 'stop',
        ]);

        $this->app->instance(OpenAIClientInterface::class, $mock);
    }
}

<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Medication;
use App\Models\User;
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
}

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

    public function test_search_medications_by_active_principle(): void
    {
        $user = User::factory()->create();

        Medication::factory()->create(['active_principle' => 'Laravel']);

        $response = $this->actingAsUser($user)->getJson("{$this->url}/search?search=ravel");

        $response
            ->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment([
                'active_principle' => 'Laravel',
            ]);
    }

    public function test_search_medications_by_manufacturer(): void
    {
        $user = User::factory()->create();

        Medication::factory()->create(['manufacturer' => 'Laravel']);

        $response = $this->actingAsUser($user)->getJson("{$this->url}/search?search=ravel");

        $response
            ->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment([
                'manufacturer' => 'Laravel',
            ]);
    }

    public function test_search_medications_by_category(): void
    {
        $user = User::factory()->create();

        Medication::factory()->create(['category' => 'Laravel']);

        $response = $this->actingAsUser($user)->getJson("{$this->url}/search?search=ravel");

        $response
            ->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment([
                'category' => 'Laravel',
            ]);
    }

    public function test_search_medications_by_therapeutic_class(): void
    {
        $user = User::factory()->create();

        Medication::factory()->create(['therapeutic_class' => 'Laravel']);

        $response = $this->actingAsUser($user)->getJson("{$this->url}/search?search=ravel");

        $response
            ->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment([
                'therapeutic_class' => 'Laravel',
            ]);
    }

    public function test_search_medications_by_registration_number(): void
    {
        $user = User::factory()->create();

        Medication::factory()->create(['registration_number' => '1234567890']);

        $response = $this->actingAsUser($user)->getJson("{$this->url}/search?search=1234567890");

        $response
            ->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment([
                'registration_number' => '1234567890',
            ]);
    }

    public function test_search_medications_requires_minimum_length(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAsUser($user)->getJson("{$this->url}/search?search=pa");

        $response->assertStatus(422);
    }
}

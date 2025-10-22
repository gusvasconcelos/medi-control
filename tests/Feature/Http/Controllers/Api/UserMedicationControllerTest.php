<?php

namespace Tests\Feature\Http\Controllers\Api;

use Tests\TestCase;
use App\Models\User;
use App\Models\Medication;
use App\Models\MedicationLog;
use App\Models\UserMedication;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class UserMedicationControllerTest extends TestCase
{
    use DatabaseTransactions;

    protected string $url = '/api/v1/user-medications';

    public function test_index_returns_active_user_medications(): void
    {
        $user = User::factory()->create();

        $medication = Medication::factory()->create();

        $activeUserMed = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'active' => true,
        ]);

        UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'active' => false,
        ]);

        $response = $this->actingAsUser($user)->getJson($this->url);

        $response
            ->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment([
                'id' => $activeUserMed->id,
                'active' => true,
            ]);
    }

    public function test_store_with_existing_medication(): void
    {
        $user = User::factory()->create();

        $medication = Medication::factory()->create();

        $form = [
            'medication_id' => $medication->id,
            'dosage' => '1 comprimido',
            'time_slots' => ['08:00', '20:00'],
            'via_administration' => 'oral',
            'start_date' => '2025-10-21',
            'initial_stock' => 30,
            'current_stock' => 30,
            'low_stock_threshold' => 5,
        ];

        $response = $this->actingAsUser($user)->postJson($this->url, $form);

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'id',
                    'medication_id',
                    'dosage',
                    'time_slots',
                    'via_administration',
                    'medication',
                ],
            ]);

        $this->assertDatabaseHas('user_medications', [
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'dosage' => '1 comprimido',
            'active' => true,
        ]);
    }

    public function test_store_creates_new_medication_when_not_exists(): void
    {
        $user = User::factory()->create();

        $form = [
            'medication_name' => 'Novo Medicamento',
            'medication_active_principle' => 'Princípio Ativo Teste',
            'medication_manufacturer' => 'Fabricante Teste',
            'medication_category' => 'Categoria Teste',
            'medication_strength' => '500mg',
            'medication_form' => 'tablet',
            'dosage' => '1 comprimido',
            'time_slots' => ['08:00'],
            'via_administration' => 'oral',
            'start_date' => '2025-10-21',
            'initial_stock' => 20,
            'current_stock' => 20,
            'low_stock_threshold' => 3,
        ];

        $response = $this->actingAsUser($user)->postJson($this->url, $form);

        $response->assertStatus(200);

        $this->assertDatabaseHas('medications', [
            'name' => 'Novo Medicamento',
            'active_principle' => 'Princípio Ativo Teste',
        ]);

        $this->assertDatabaseHas('user_medications', [
            'user_id' => $user->id,
            'dosage' => '1 comprimido',
            'active' => true,
        ]);
    }

    public function test_store_validation_fails_without_medication_identification(): void
    {
        $form = [
            'dosage' => '1 comprimido',
            'time_slots' => ['08:00', '20:00'],
            'via_administration' => 'oral',
            'start_date' => '2025-10-21',
            'initial_stock' => 30,
            'current_stock' => 30,
            'low_stock_threshold' => 5,
        ];

        $response = $this->actingAsUser()->postJson($this->url, $form);

        $response->assertStatus(422);
    }

    public function test_show_returns_user_medication_with_logs(): void
    {
        $user = User::factory()->create();
        $medication = Medication::factory()->create();

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
        ]);

        MedicationLog::factory()->count(3)->create([
            'user_medication_id' => $userMedication->id,
        ]);

        $response = $this->actingAsUser($user)->getJson("{$this->url}/{$userMedication->id}");

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'medication',
                'logs' => [
                    '*' => [
                        'id',
                        'scheduled_at',
                        'status',
                    ],
                ],
            ]);
    }

    public function test_update_user_medication(): void
    {
        $user = User::factory()->create();
        $medication = Medication::factory()->create();

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'dosage' => '1 comprimido',
        ]);

        $form = [
            'dosage' => '2 comprimidos',
            'time_slots' => ['08:00', '14:00', '20:00'],
        ];

        $response = $this->actingAsUser($user)->putJson("{$this->url}/{$userMedication->id}", $form);

        $response
            ->assertStatus(200)
            ->assertJsonFragment([
                'dosage' => '2 comprimidos',
            ]);

        $this->assertDatabaseHas('user_medications', [
            'id' => $userMedication->id,
            'dosage' => '2 comprimidos',
        ]);
    }

    public function test_destroy_marks_user_medication_as_inactive(): void
    {
        $user = User::factory()->create();
        $medication = Medication::factory()->create();

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'active' => true,
        ]);

        $response = $this->actingAsUser($user)->deleteJson("{$this->url}/{$userMedication->id}");

        $response->assertStatus(200);

        $this->assertDatabaseHas('user_medications', [
            'id' => $userMedication->id,
            'active' => false,
        ]);
    }

    public function test_search_medications_by_name(): void
    {
        $user = User::factory()->create();

        Medication::factory()->create(['name' => 'Laravel']);

        $response = $this->actingAsUser($user)->getJson("{$this->url}/medications/search?search=ravel");

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

        $response = $this->actingAsUser($user)->getJson("{$this->url}/medications/search?search=pa");

        $response->assertStatus(422);
    }

    public function test_unauthenticated_user_cannot_access_endpoints(): void
    {
        $response = $this->getJson($this->url);

        $response->assertStatus(401);
    }

    public function test_user_can_only_see_their_own_medications(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $medication = Medication::factory()->create();

        UserMedication::factory()->create([
            'user_id' => $user1->id,
            'medication_id' => $medication->id,
            'active' => true,
        ]);

        $user2Medication = UserMedication::factory()->create([
            'user_id' => $user2->id,
            'medication_id' => $medication->id,
            'active' => true,
        ]);

        $response = $this->actingAsUser($user1)->getJson($this->url);

        $response
            ->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonMissing([
                'id' => $user2Medication->id,
            ]);
    }
}

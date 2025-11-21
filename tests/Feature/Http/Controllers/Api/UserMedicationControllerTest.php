<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Events\UserMedicationCreated;
use App\Models\Medication;
use App\Models\MedicationLog;
use App\Models\User;
use App\Models\UserMedication;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class UserMedicationControllerTest extends TestCase
{
    use DatabaseTransactions;

    protected string $url = '/api/v1/user-medications';

    public function test_get_user_medications_returns_active_user_medications(): void
    {
        $user = User::factory()->create();

        $medication = Medication::factory()->create();

        $activeUserMed = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'active' => true,
            'start_date' => today()->subDays(30),
            'end_date' => null,
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

    public function test_get_user_medications_returns_user_medications_with_filters(): void
    {
        $user = User::factory()->create();

        $medication = Medication::factory()->create();

        $medication2 = Medication::factory()->create();

        $date = today()->addDay();

        $activeUserMed = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'start_date' => $date,
            'end_date' => $date->copy()->addDays(10),
        ]);

        UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication2->id,
        ]);

        $response = $this->actingAsUser($user)->getJson("$this->url?start_date={$date->toDateString()}&end_date={$date->toDateString()}");

        $response
            ->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment([
                'id' => $activeUserMed->id,
                'active' => true,
            ]);
    }

    public function test_get_user_medications_includes_medications_with_null_end_date(): void
    {
        $user = User::factory()->create();

        $medication = Medication::factory()->create();

        $ongoingMed = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'start_date' => today()->subDays(30),
            'end_date' => null,
            'active' => true,
        ]);

        UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'start_date' => today()->subDays(60),
            'end_date' => today()->subDays(40),
            'active' => true,
        ]);

        $today = today()->toDateString();

        $response = $this->actingAsUser($user)->getJson("$this->url?start_date={$today}&end_date={$today}");

        $response
            ->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment([
                'id' => $ongoingMed->id,
            ]);
    }

    public function test_get_user_medications_filters_correctly_with_date_ranges(): void
    {
        $user = User::factory()->create();

        $medication = Medication::factory()->create();

        $med1 = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'start_date' => '2025-01-01',
            'end_date' => null,
            'active' => true,
        ]);

        $med2 = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'start_date' => '2025-01-15',
            'end_date' => '2025-02-15',
            'active' => true,
        ]);

        UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'start_date' => '2024-11-01',
            'end_date' => '2024-12-31',
            'active' => true,
        ]);

        UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'start_date' => '2025-03-01',
            'end_date' => '2025-03-31',
            'active' => true,
        ]);

        $response = $this->actingAsUser($user)->getJson("$this->url?start_date=2025-01-20&end_date=2025-02-10");

        $response
            ->assertStatus(200)
            ->assertJsonCount(2, 'data')
            ->assertJsonFragment(['id' => $med1->id])
            ->assertJsonFragment(['id' => $med2->id]);
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
                    'user_id',
                    'medication_id',
                    'dosage',
                    'time_slots',
                    'via_administration',
                    'start_date',
                    'end_date',
                    'initial_stock',
                    'current_stock',
                    'low_stock_threshold',
                    'notes',
                    'active',
                ],
            ]);

        $this->assertDatabaseHas('user_medications', [
            'user_id' => $user->id,
            'medication_id' => $medication->id,
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

    public function test_store_dispatches_user_medication_created_event(): void
    {
        Event::fake([UserMedicationCreated::class]);

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

        $response->assertStatus(200);

        Event::assertDispatched(UserMedicationCreated::class, function ($event) use ($user, $medication) {
            return $event->userMedication->user_id === $user->id
                && $event->userMedication->medication_id === $medication->id;
        });
    }

    public function test_update_does_not_dispatch_event(): void
    {
        Event::fake([UserMedicationCreated::class]);

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

        $response->assertStatus(200);

        Event::assertNotDispatched(UserMedicationCreated::class);
    }

    public function test_destroy_does_not_dispatch_event(): void
    {
        Event::fake([UserMedicationCreated::class]);

        $user = User::factory()->create();
        $medication = Medication::factory()->create();

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'active' => true,
        ]);

        $response = $this->actingAsUser($user)->deleteJson("{$this->url}/{$userMedication->id}");

        $response->assertStatus(200);

        Event::assertNotDispatched(UserMedicationCreated::class);
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
                'data' => [
                    'id',
                    'medication',
                    'logs' => [
                        '*' => [
                            'id',
                            'scheduled_at',
                            'status',
                        ],
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

    public function test_indicators_returns_daily_medication_counts(): void
    {
        $user = User::factory()->create();

        $medication = Medication::factory()->create();

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'time_slots' => ['08:00', '20:00'],
            'start_date' => '2025-10-19',
            'end_date' => null,
        ]);

        MedicationLog::factory()->create([
            'user_medication_id' => $userMedication->id,
            'scheduled_at' => '2025-10-19 08:00:00',
            'status' => 'taken',
        ]);

        MedicationLog::factory()->create([
            'user_medication_id' => $userMedication->id,
            'scheduled_at' => '2025-10-20 08:00:00',
            'status' => 'taken',
        ]);

        MedicationLog::factory()->create([
            'user_medication_id' => $userMedication->id,
            'scheduled_at' => '2025-10-20 20:00:00',
            'status' => 'taken',
        ]);

        $queryParams = [
            'start_date' => '2025-10-19',
            'end_date' => '2025-10-20',
        ];

        $response = $this->actingAsUser($user)
            ->getJson("{$this->url}/indicators?" . http_build_query($queryParams));

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'date',
                        'total_scheduled',
                        'total_taken',
                    ],
                ],
            ])
            ->assertJsonFragment([
                'date' => '2025-10-19',
                'total_scheduled' => 2,
                'total_taken' => 1,
            ])
            ->assertJsonFragment([
                'date' => '2025-10-20',
                'total_scheduled' => 2,
                'total_taken' => 2,
            ]);
    }

    public function test_indicators_requires_start_and_end_date(): void
    {
        $user = User::factory()->create();

        $medication = Medication::factory()->create();

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
        ]);

        $response = $this->actingAsUser($user)
            ->getJson("{$this->url}/indicators");

        $response->assertStatus(422);
    }

    public function test_indicators_validates_date_format(): void
    {
        $user = User::factory()->create();

        $medication = Medication::factory()->create();

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
        ]);

        $queryParams = [
            'start_date' => 'invalid',
            'end_date' => '2025-10-20',
        ];

        $response = $this->actingAsUser($user)
            ->getJson("{$this->url}/indicators?" . http_build_query($queryParams));

        $response->assertStatus(422);
    }

    public function test_indicators_validates_period_max_length(): void
    {
        $user = User::factory()->create();

        $medication = Medication::factory()->create();

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
        ]);

        $queryParams = [
            'start_date' => '2024-01-01',
            'end_date' => '2025-04-01',
        ];

        $response = $this->actingAsUser($user)
            ->getJson("{$this->url}/indicators?" . http_build_query($queryParams));

        $response
            ->assertStatus(422)
            ->assertJsonFragment([
                'code' => 'VALIDATION'
            ]);
    }

    public function test_indicators_returns_empty_array_when_no_active_medications(): void
    {
        $user = User::factory()->create();

        $medication = Medication::factory()->create();

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,

        ]);

        $response = $this->actingAsUser($user)
            ->getJson("{$this->url}/indicators?start_date=2025-10-19&end_date=2025-10-20");

        $response
            ->assertStatus(200)
            ->assertJson([
                'data' => [],
            ]);
    }

    public function test_indicators_only_returns_authenticated_user_data(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $medication = Medication::factory()->create();

        $userMed1 = UserMedication::factory()->create([
            'user_id' => $user1->id,
            'medication_id' => $medication->id,
            'time_slots' => ['08:00'],
            'start_date' => '2025-10-19',
            'end_date' => null,
        ]);

        $userMed2 = UserMedication::factory()->create([
            'user_id' => $user2->id,
            'medication_id' => $medication->id,
            'time_slots' => ['08:00', '20:00'],
            'start_date' => '2025-10-19',
            'end_date' => null,
        ]);

        MedicationLog::factory()->create([
            'user_medication_id' => $userMed1->id,
            'scheduled_at' => '2025-10-19 08:00:00',
            'status' => 'taken',
        ]);

        MedicationLog::factory()->create([
            'user_medication_id' => $userMed2->id,
            'scheduled_at' => '2025-10-19 08:00:00',
            'status' => 'taken',
        ]);

        $queryParams = [
            'start_date' => '2025-10-19',
            'end_date' => '2025-10-19',
        ];

        $response = $this->actingAsUser($user1)
            ->getJson("{$this->url}/indicators?" . http_build_query($queryParams));

        $response
            ->assertStatus(200)
            ->assertJsonFragment([
                'date' => '2025-10-19',
                'total_scheduled' => 1,
                'total_taken' => 1,
            ]);
    }
}

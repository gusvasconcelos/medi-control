<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Medication;
use App\Models\MedicationLog;
use App\Models\User;
use App\Models\UserMedication;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class MedicationLogControllerTest extends TestCase
{
    use DatabaseTransactions;

    public function test_log_taken_creates_medication_log_successfully(): void
    {
        $user = User::factory()->create();
        $medication = Medication::factory()->create();

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'time_slots' => ['08:00', '14:00', '20:00'],
            'current_stock' => 30,
            'low_stock_threshold' => 5,
        ]);

        $response = $this->actingAsUser($user)->postJson(
            "/api/v1/user-medications/{$userMedication->id}/log-taken",
            [
                'time_slot' => '20:00',
                'notes' => 'Tomei com água',
            ]
        );

        $response
            ->assertStatus(200)
            ->assertJsonStructure(['message'])
            ->assertJson(['message' => __('medications.medication_log.taken')]);

        $this->assertDatabaseHas('medication_logs', [
            'user_medication_id' => $userMedication->id,
            'status' => 'taken',
            'notes' => 'Tomei com água',
        ]);

        $this->assertDatabaseHas('user_medications', [
            'id' => $userMedication->id,
            'current_stock' => 29,
        ]);
    }

    public function test_log_taken_uses_current_datetime_when_taken_at_not_provided(): void
    {
        $user = User::factory()->create();
        $medication = Medication::factory()->create();

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'time_slots' => ['08:00'],
            'current_stock' => 10,
        ]);

        $response = $this->actingAsUser($user)->postJson(
            "/api/v1/user-medications/{$userMedication->id}/log-taken",
            [
                'time_slot' => '08:00',
            ]
        );

        $response->assertStatus(200);

        $log = MedicationLog::latest('id')->first();

        $this->assertNotNull($log->taken_at);
        $this->assertEqualsWithDelta(now()->timestamp, $log->taken_at->timestamp, 2);
    }

    public function test_log_taken_fails_with_invalid_time_slot(): void
    {
        $user = User::factory()->create();
        $medication = Medication::factory()->create();

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'time_slots' => ['08:00', '14:00'],
            'current_stock' => 10,
        ]);

        $response = $this->actingAsUser($user)->postJson(
            "/api/v1/user-medications/{$userMedication->id}/log-taken",
            [
                'time_slot' => '20:00', // Não está nos time_slots
            ]
        );

        $response
            ->assertStatus(422)
            ->assertJsonFragment([
                'code' => 'INVALID_TIME_SLOT',
            ]);
    }

    public function test_log_taken_fails_with_invalid_time_slot_format(): void
    {
        $user = User::factory()->create();
        $medication = Medication::factory()->create();

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'time_slots' => ['08:00'],
            'current_stock' => 10,
        ]);

        $response = $this->actingAsUser($user)->postJson(
            "/api/v1/user-medications/{$userMedication->id}/log-taken",
            [
                'time_slot' => '8:00',
            ]
        );

        $response->assertStatus(422);
    }

    public function test_log_taken_requires_authentication(): void
    {
        $medication = Medication::factory()->create();

        $userMedication = UserMedication::factory()->create([
            'medication_id' => $medication->id,
            'time_slots' => ['08:00'],
        ]);

        $response = $this->postJson(
            "/api/v1/user-medications/{$userMedication->id}/log-taken",
            [
                'time_slot' => '08:00',
            ]
        );

        $response->assertStatus(401);
    }

    public function test_log_taken_fails_when_user_medication_not_found(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAsUser($user)->postJson(
            '/api/v1/user-medications/99999/log-taken',
            [
                'time_slot' => '08:00',
            ]
        );

        $response->assertStatus(404);
    }

    public function test_log_taken_with_custom_taken_at(): void
    {
        $user = User::factory()->create();
        $medication = Medication::factory()->create();

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'time_slots' => ['08:00'],
            'current_stock' => 10,
        ]);

        $customTakenAt = now()->subHours(2)->toDateTimeString();

        $response = $this->actingAsUser($user)->postJson(
            "/api/v1/user-medications/{$userMedication->id}/log-taken",
            [
                'time_slot' => '08:00',
                'taken_at' => $customTakenAt,
            ]
        );

        $response->assertStatus(200);

        $log = MedicationLog::latest('id')->first();

        $this->assertEquals($customTakenAt, $log->taken_at->toDateTimeString());
    }
}

<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Medication;
use App\Models\MedicationLog;
use App\Models\Notification;
use App\Models\NotificationPreference;
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
            []
        );

        $response->assertStatus(200);

        $log = MedicationLog::latest('id')->first();

        $this->assertNotNull($log->taken_at);
        $this->assertEqualsWithDelta(now()->timestamp, $log->taken_at->timestamp, 2);
    }

    public function test_log_taken_selects_closest_time_slot_automatically(): void
    {
        $user = User::factory()->create();
        $medication = Medication::factory()->create();

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'time_slots' => ['08:00', '14:00', '20:00'],
            'current_stock' => 10,
        ]);

        // Simula um horário próximo de 14:00
        $takenAt = now()->setTime(14, 30);

        $response = $this->actingAsUser($user)->postJson(
            "/api/v1/user-medications/{$userMedication->id}/log-taken",
            [
                'taken_at' => $takenAt->toDateTimeString(),
            ]
        );

        $response->assertStatus(200);

        $log = MedicationLog::latest('id')->first();

        // Deve selecionar o time_slot mais próximo (14:00)
        $this->assertEquals('14:00', $log->scheduled_at->format('H:i'));
    }

    public function test_log_taken_selects_next_day_time_slot_when_all_passed(): void
    {
        $user = User::factory()->create();
        $medication = Medication::factory()->create();

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'time_slots' => ['08:00', '14:00', '20:00'],
            'current_stock' => 10,
        ]);

        // Simula um horário após todos os time_slots (23:00)
        $takenAt = now()->setTime(23, 0);

        $response = $this->actingAsUser($user)->postJson(
            "/api/v1/user-medications/{$userMedication->id}/log-taken",
            [
                'taken_at' => $takenAt->toDateTimeString(),
            ]
        );

        $response->assertStatus(200);

        $log = MedicationLog::latest('id')->first();

        // Deve selecionar o último time_slot do dia (20:00) como mais próximo
        $this->assertEquals('20:00', $log->scheduled_at->format('H:i'));
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
            []
        );

        $response->assertStatus(401);
    }

    public function test_log_taken_fails_when_user_medication_not_found(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAsUser($user)->postJson(
            '/api/v1/user-medications/99999/log-taken',
            []
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
                'taken_at' => $customTakenAt,
            ]
        );

        $response->assertStatus(200);

        $log = MedicationLog::latest('id')->first();

        $this->assertEquals($customTakenAt, $log->taken_at->toDateTimeString());
    }

    public function test_log_taken_creates_low_stock_notification_when_threshold_reached(): void
    {
        $user = User::factory()->create();
        $medication = Medication::factory()->create();

        NotificationPreference::factory()->create([
            'user_id' => $user->id,
            'low_stock_alert' => true,
        ]);

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'time_slots' => ['08:00'],
            'current_stock' => 6,
            'low_stock_threshold' => 5,
        ]);

        $response = $this->actingAsUser($user)->postJson(
            "/api/v1/user-medications/{$userMedication->id}/log-taken",
            []
        );

        $response->assertStatus(200);

        $this->assertDatabaseHas('user_medications', [
            'id' => $userMedication->id,
            'current_stock' => 5,
        ]);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $user->id,
            'user_medication_id' => $userMedication->id,
            'type' => 'low_stock',
            'status' => 'pending',
        ]);
    }

    public function test_log_taken_does_not_create_low_stock_notification_when_above_threshold(): void
    {
        $user = User::factory()->create();
        $medication = Medication::factory()->create();

        NotificationPreference::factory()->create([
            'user_id' => $user->id,
            'low_stock_alert' => true,
        ]);

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'time_slots' => ['08:00'],
            'current_stock' => 10,
            'low_stock_threshold' => 5,
        ]);

        $response = $this->actingAsUser($user)->postJson(
            "/api/v1/user-medications/{$userMedication->id}/log-taken",
            []
        );

        $response->assertStatus(200);

        $count = Notification::where('user_id', $user->id)
            ->where('type', 'low_stock')
            ->count();

        $this->assertEquals(0, $count);
    }

    public function test_log_taken_does_not_create_low_stock_notification_when_preference_disabled(): void
    {
        $user = User::factory()->create();
        $medication = Medication::factory()->create();

        NotificationPreference::factory()->create([
            'user_id' => $user->id,
            'low_stock_alert' => false,
        ]);

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'time_slots' => ['08:00'],
            'current_stock' => 6,
            'low_stock_threshold' => 5,
        ]);

        $response = $this->actingAsUser($user)->postJson(
            "/api/v1/user-medications/{$userMedication->id}/log-taken",
            []
        );

        $response->assertStatus(200);

        $count = Notification::where('user_id', $user->id)
            ->where('type', 'low_stock')
            ->count();

        $this->assertEquals(0, $count);
    }

    public function test_log_taken_does_not_duplicate_low_stock_notification(): void
    {
        $user = User::factory()->create();
        $medication = Medication::factory()->create();

        NotificationPreference::factory()->create([
            'user_id' => $user->id,
            'low_stock_alert' => true,
        ]);

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'time_slots' => ['08:00', '14:00'],
            'current_stock' => 6,
            'low_stock_threshold' => 5,
        ]);

        $this->actingAsUser($user)->postJson(
            "/api/v1/user-medications/{$userMedication->id}/log-taken",
            ['time_slot' => '08:00']
        );

        $this->actingAsUser($user)->postJson(
            "/api/v1/user-medications/{$userMedication->id}/log-taken",
            ['time_slot' => '14:00']
        );

        $count = Notification::where('user_id', $user->id)
            ->where('user_medication_id', $userMedication->id)
            ->where('type', 'low_stock')
            ->count();

        $this->assertEquals(1, $count);
    }
}

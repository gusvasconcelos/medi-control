<?php

namespace Tests\Feature\Console\Commands;

use App\Models\Medication;
use App\Models\Notification;
use App\Models\NotificationPreference;
use App\Models\User;
use App\Models\UserMedication;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class ScheduleMedicationNotificationsCommandTest extends TestCase
{
    use DatabaseTransactions;

    public function test_schedules_medication_reminders_for_users_with_preferences(): void
    {
        $user = User::factory()->create();
        $medication = Medication::factory()->create();

        NotificationPreference::factory()->create([
            'user_id' => $user->id,
            'medication_reminder' => true,
        ]);

        UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'time_slots' => ['08:00', '14:00'],
            'active' => true,
            'start_date' => today()->subDay(),
            'end_date' => null,
        ]);

        $this->artisan('notifications:schedule')
            ->assertSuccessful();

        $notificationsCount = Notification::disableUserScope()
            ->where('user_id', $user->id)
            ->where('type', 'medication_reminder')
            ->count();

        $this->assertGreaterThan(0, $notificationsCount);
    }

    public function test_does_not_schedule_for_users_with_disabled_reminders(): void
    {
        $user = User::factory()->create();
        $medication = Medication::factory()->create();

        NotificationPreference::factory()->disabledReminders()->create([
            'user_id' => $user->id,
        ]);

        UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'time_slots' => ['08:00'],
            'active' => true,
        ]);

        $this->artisan('notifications:schedule')
            ->assertSuccessful();

        $count = Notification::disableUserScope()
            ->where('user_id', $user->id)
            ->where('type', 'medication_reminder')
            ->count();

        $this->assertEquals(0, $count);
    }

    public function test_does_not_schedule_for_inactive_medications(): void
    {
        $user = User::factory()->create();
        $medication = Medication::factory()->create();

        NotificationPreference::factory()->create([
            'user_id' => $user->id,
            'medication_reminder' => true,
        ]);

        UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'time_slots' => ['08:00'],
            'active' => false,
        ]);

        $this->artisan('notifications:schedule')
            ->assertSuccessful();

        $count = Notification::disableUserScope()
            ->where('user_id', $user->id)
            ->where('type', 'medication_reminder')
            ->count();

        $this->assertEquals(0, $count);
    }

    public function test_does_not_duplicate_notifications(): void
    {
        $user = User::factory()->create();
        $medication = Medication::factory()->create();

        NotificationPreference::factory()->create([
            'user_id' => $user->id,
            'medication_reminder' => true,
        ]);

        UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'time_slots' => ['08:00'],
            'active' => true,
            'start_date' => today()->subDay(),
        ]);

        $this->artisan('notifications:schedule')->assertSuccessful();
        $firstCount = Notification::disableUserScope()->where('user_id', $user->id)->count();

        $this->artisan('notifications:schedule')->assertSuccessful();
        $secondCount = Notification::disableUserScope()->where('user_id', $user->id)->count();

        $this->assertEquals($firstCount, $secondCount);
    }

    public function test_schedules_for_specific_user_medication(): void
    {
        $user = User::factory()->create();
        $medication = Medication::factory()->create();

        NotificationPreference::factory()->create([
            'user_id' => $user->id,
            'medication_reminder' => true,
        ]);

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'time_slots' => ['23:00', '23:30'],
            'active' => true,
            'start_date' => today()->subDay(),
            'end_date' => null,
        ]);

        $this->artisan('notifications:schedule', ['--user-medication' => $userMedication->id])
            ->assertSuccessful();

        $count = Notification::disableUserScope()
            ->where('user_id', $user->id)
            ->where('user_medication_id', $userMedication->id)
            ->where('type', 'medication_reminder')
            ->count();

        $this->assertGreaterThan(0, $count);
    }

    public function test_returns_failure_for_nonexistent_user_medication(): void
    {
        $this->artisan('notifications:schedule', ['--user-medication' => 999999])
            ->assertFailed();
    }

    public function test_returns_success_when_reminders_disabled_for_specific_medication(): void
    {
        $user = User::factory()->create();
        $medication = Medication::factory()->create();

        NotificationPreference::factory()->disabledReminders()->create([
            'user_id' => $user->id,
        ]);

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'time_slots' => ['08:00'],
            'active' => true,
        ]);

        $this->artisan('notifications:schedule', ['--user-medication' => $userMedication->id])
            ->assertSuccessful();

        $count = Notification::disableUserScope()
            ->where('user_id', $user->id)
            ->count();

        $this->assertEquals(0, $count);
    }
}

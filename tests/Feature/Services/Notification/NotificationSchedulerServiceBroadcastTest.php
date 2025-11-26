<?php

namespace Tests\Feature\Services\Notification;

use App\Events\RealTimeNotificationEvent;
use App\Models\NotificationPreference;
use App\Models\User;
use App\Models\UserMedication;
use App\Services\Notification\NotificationSchedulerService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class NotificationSchedulerServiceBroadcastTest extends TestCase
{
    use RefreshDatabase;

    private NotificationSchedulerService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new NotificationSchedulerService();
    }

    public function test_dispatches_event_when_creating_medication_reminder(): void
    {
        Event::fake([RealTimeNotificationEvent::class]);

        $user = User::factory()->create();
        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'active' => true,
            'start_date' => today(),
            'end_date' => today()->addDays(7),
            'time_slots' => ['08:00'],
        ]);

        $preferences = NotificationPreference::factory()->create([
            'user_id' => $user->id,
            'medication_reminder' => true,
        ]);

        $scheduled = $this->service->scheduleMedicationReminders($user, $preferences);

        $this->assertGreaterThan(0, $scheduled);

        Event::assertDispatched(RealTimeNotificationEvent::class, function ($event) use ($user) {
            return $event->userId === $user->id
                && $event->notification->type === 'medication_reminder';
        });
    }

    public function test_dispatches_event_when_creating_interaction_alert(): void
    {
        Event::fake([RealTimeNotificationEvent::class]);

        $user = User::factory()->create();
        $preferences = NotificationPreference::factory()->create([
            'user_id' => $user->id,
            'interaction_alert' => true,
        ]);

        $this->service->scheduleInteractionAlerts($user, $preferences);

        Event::assertNotDispatched(RealTimeNotificationEvent::class);
    }

    public function test_does_not_dispatch_event_when_notification_preferences_disabled(): void
    {
        Event::fake([RealTimeNotificationEvent::class]);

        $user = User::factory()->create();
        $preferences = NotificationPreference::factory()->create([
            'user_id' => $user->id,
            'medication_reminder' => false,
        ]);

        $scheduled = $this->service->scheduleForUser($user);

        $this->assertEquals(0, $scheduled);
        Event::assertNotDispatched(RealTimeNotificationEvent::class);
    }

    public function test_event_contains_correct_notification_data(): void
    {
        Event::fake([RealTimeNotificationEvent::class]);

        $user = User::factory()->create();
        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'active' => true,
            'start_date' => today(),
            'end_date' => today()->addDays(7),
            'time_slots' => ['14:00'],
        ]);

        $preferences = NotificationPreference::factory()->create([
            'user_id' => $user->id,
            'medication_reminder' => true,
        ]);

        $this->service->scheduleMedicationReminders($user, $preferences);

        Event::assertDispatched(RealTimeNotificationEvent::class, function ($event) use ($user, $userMedication) {
            return $event->userId === $user->id
                && $event->notification->user_id === $user->id
                && $event->notification->type === 'medication_reminder'
                && $event->notification->status === 'pending';
        });
    }
}

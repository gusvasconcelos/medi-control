<?php

namespace Tests\Feature\Events;

use App\Events\RealTimeNotificationEvent;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class RealTimeNotificationEventTest extends TestCase
{
    use RefreshDatabase;

    public function test_broadcasts_on_private_channel_for_specific_user(): void
    {
        Event::fake();

        $user = User::factory()->create();
        $notification = Notification::factory()->create([
            'user_id' => $user->id,
        ]);

        RealTimeNotificationEvent::dispatch($user->id, $notification);

        Event::assertDispatched(RealTimeNotificationEvent::class, function ($event) use ($user, $notification) {
            return $event->userId === $user->id
                && $event->notification->id === $notification->id;
        });
    }

    public function test_broadcast_with_returns_notification_data(): void
    {
        $user = User::factory()->create();
        $notification = Notification::factory()->create([
            'user_id' => $user->id,
            'type' => 'medication_reminder',
            'title' => 'Test Notification',
            'body' => 'Test Body',
            'status' => 'pending',
        ]);

        $event = new RealTimeNotificationEvent($user->id, $notification);
        $broadcastData = $event->broadcastWith();

        $this->assertArrayHasKey('notification', $broadcastData);
        $this->assertEquals($notification->id, $broadcastData['notification']['id']);
        $this->assertEquals($notification->type, $broadcastData['notification']['type']);
        $this->assertEquals($notification->title, $broadcastData['notification']['title']);
        $this->assertEquals($notification->body, $broadcastData['notification']['body']);
        $this->assertEquals($notification->status, $broadcastData['notification']['status']);
    }

    public function test_broadcast_as_returns_correct_event_name(): void
    {
        $user = User::factory()->create();
        $notification = Notification::factory()->create([
            'user_id' => $user->id,
        ]);

        $event = new RealTimeNotificationEvent($user->id, $notification);

        $this->assertEquals('new-notification', $event->broadcastAs());
    }

    public function test_broadcasts_on_correct_private_channel(): void
    {
        $user = User::factory()->create();
        $notification = Notification::factory()->create([
            'user_id' => $user->id,
        ]);

        $event = new RealTimeNotificationEvent($user->id, $notification);
        $channels = $event->broadcastOn();

        $this->assertCount(1, $channels);
        $this->assertInstanceOf(\Illuminate\Broadcasting\PrivateChannel::class, $channels[0]);
        $this->assertEquals('private-notifications.' . $user->id, $channels[0]->name);
    }
}

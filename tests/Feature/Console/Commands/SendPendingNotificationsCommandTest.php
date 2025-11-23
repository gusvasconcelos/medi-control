<?php

namespace Tests\Feature\Console\Commands;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class SendPendingNotificationsCommandTest extends TestCase
{
    use DatabaseTransactions;

    public function test_sends_pending_notifications_that_are_due(): void
    {
        $user = User::factory()->create();

        $notification = Notification::factory()->pending()->create([
            'user_id' => $user->id,
            'scheduled_for' => now()->subMinute(),
        ]);

        $this->artisan('notifications:send')
            ->assertSuccessful();

        $notification->refresh();

        $this->assertEquals('sent', $notification->status);
        $this->assertNotNull($notification->sent_at);
    }

    public function test_does_not_send_future_notifications(): void
    {
        $user = User::factory()->create();

        $notification = Notification::factory()->pending()->create([
            'user_id' => $user->id,
            'scheduled_for' => now()->addHour(),
        ]);

        $this->artisan('notifications:send')
            ->assertSuccessful();

        $notification->refresh();

        $this->assertEquals('pending', $notification->status);
        $this->assertNull($notification->sent_at);
    }

    public function test_does_not_resend_already_sent_notifications(): void
    {
        $user = User::factory()->create();
        $sentAt = now()->subMinutes(30);

        $notification = Notification::factory()->create([
            'user_id' => $user->id,
            'scheduled_for' => now()->subHour(),
            'status' => 'sent',
            'sent_at' => $sentAt,
        ]);

        $this->artisan('notifications:send')
            ->assertSuccessful();

        $notification->refresh();

        $this->assertEquals($sentAt->timestamp, $notification->sent_at->timestamp);
    }

    public function test_handles_multiple_pending_notifications(): void
    {
        $user = User::factory()->create();

        Notification::factory()->pending()->count(5)->create([
            'user_id' => $user->id,
            'scheduled_for' => now()->subMinute(),
        ]);

        $this->artisan('notifications:send')
            ->assertSuccessful();

        $sentCount = Notification::disableUserScope()
            ->where('user_id', $user->id)
            ->where('status', 'sent')
            ->count();

        $this->assertEquals(5, $sentCount);
    }

    public function test_returns_success_when_no_pending_notifications(): void
    {
        $this->artisan('notifications:send')
            ->assertSuccessful();
    }
}

<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class NotificationControllerTest extends TestCase
{
    use DatabaseTransactions;

    public function test_index_returns_paginated_notifications(): void
    {
        $user = User::factory()->create();
        Notification::factory()->count(20)->create([
            'user_id' => $user->id,
        ]);

        $response = $this->actingAsUser($user)->getJson('/api/v1/notifications');

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'type',
                        'title',
                        'body',
                        'scheduled_for',
                        'status',
                    ],
                ],
                'current_page',
                'last_page',
                'total',
            ]);
    }

    public function test_index_filters_by_type(): void
    {
        $user = User::factory()->create();
        Notification::factory()->medicationReminder()->count(3)->create(['user_id' => $user->id]);
        Notification::factory()->interactionAlert()->count(2)->create(['user_id' => $user->id]);

        $response = $this->actingAsUser($user)->getJson('/api/v1/notifications?type=medication_reminder');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
    }

    public function test_index_filters_by_status(): void
    {
        $user = User::factory()->create();
        Notification::factory()->pending()->count(3)->create(['user_id' => $user->id]);
        Notification::factory()->sent()->count(2)->create(['user_id' => $user->id]);

        $response = $this->actingAsUser($user)->getJson('/api/v1/notifications?status=pending');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
    }

    public function test_unread_count_returns_correct_count(): void
    {
        $user = User::factory()->create();
        Notification::factory()->sent()->count(3)->create([
            'user_id' => $user->id,
            'read_at' => null,
        ]);
        Notification::factory()->read()->count(2)->create(['user_id' => $user->id]);

        $response = $this->actingAsUser($user)->getJson('/api/v1/notifications/unread-count');

        $response
            ->assertStatus(200)
            ->assertJsonPath('data.count', 3);
    }

    public function test_mark_as_read_updates_notification(): void
    {
        $user = User::factory()->create();
        $notification = Notification::factory()->sent()->create([
            'user_id' => $user->id,
            'read_at' => null,
        ]);

        $response = $this->actingAsUser($user)->patchJson("/api/v1/notifications/{$notification->id}/read");

        $response
            ->assertStatus(200)
            ->assertJsonPath('data.status', 'read');

        $this->assertNotNull($notification->fresh()->read_at);
    }

    public function test_mark_all_as_read_updates_all_notifications(): void
    {
        $user = User::factory()->create();
        Notification::factory()->sent()->count(5)->create([
            'user_id' => $user->id,
            'read_at' => null,
        ]);

        $response = $this->actingAsUser($user)->patchJson('/api/v1/notifications/mark-all-read');

        $response->assertStatus(200);

        $unreadCount = Notification::where('user_id', $user->id)
            ->whereNull('read_at')
            ->count();

        $this->assertEquals(0, $unreadCount);
    }

    public function test_recent_returns_latest_notifications(): void
    {
        $user = User::factory()->create();
        Notification::factory()->count(15)->create(['user_id' => $user->id]);

        $response = $this->actingAsUser($user)->getJson('/api/v1/notifications/recent');

        $response->assertStatus(200);
        $this->assertLessThanOrEqual(10, count($response->json('data')));
    }

    public function test_notifications_are_scoped_to_current_user(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        Notification::factory()->count(3)->create(['user_id' => $user1->id]);
        Notification::factory()->count(5)->create(['user_id' => $user2->id]);

        $response = $this->actingAsUser($user1)->getJson('/api/v1/notifications');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
    }

    public function test_mark_as_read_fails_for_other_users_notification(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $notification = Notification::factory()->create(['user_id' => $user2->id]);

        $response = $this->actingAsUser($user1)->patchJson("/api/v1/notifications/{$notification->id}/read");

        $response->assertStatus(404);
    }

    public function test_index_requires_authentication(): void
    {
        $response = $this->getJson('/api/v1/notifications');

        $response->assertStatus(401);
    }

    public function test_clear_all_deletes_all_user_notifications(): void
    {
        $user = User::factory()->create();
        Notification::factory()->count(10)->create(['user_id' => $user->id]);

        $response = $this->actingAsUser($user)->deleteJson('/api/v1/notifications/clear-all');

        $response
            ->assertStatus(200)
            ->assertJsonPath('data.count', 10);

        $remainingCount = Notification::where('user_id', $user->id)->count();
        $this->assertEquals(0, $remainingCount);
    }

    public function test_clear_all_only_deletes_current_user_notifications(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        // Create notifications one by one with explicit attributes
        for ($i = 0; $i < 5; $i++) {
            Notification::factory()->create([
                'user_id' => $user1->id,
                'status' => 'sent',
                'sent_at' => now(),
            ]);
        }

        for ($i = 0; $i < 3; $i++) {
            Notification::factory()->create([
                'user_id' => $user2->id,
                'status' => 'sent',
                'sent_at' => now(),
            ]);
        }

        $response = $this->actingAsUser($user1)->deleteJson('/api/v1/notifications/clear-all');

        $response
            ->assertStatus(200)
            ->assertJsonPath('data.count', 5);

        // Verificar que apenas as notificações do user1 foram deletadas
        // Precisamos desabilitar o UserScope global para verificar as notificações de outros usuários
        $this->assertEquals(0, Notification::withoutGlobalScopes()->where('user_id', $user1->id)->count());
        $this->assertEquals(3, Notification::withoutGlobalScopes()->where('user_id', $user2->id)->count());
    }
}

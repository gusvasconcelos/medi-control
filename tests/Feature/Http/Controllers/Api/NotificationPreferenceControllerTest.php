<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\NotificationPreference;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class NotificationPreferenceControllerTest extends TestCase
{
    use DatabaseTransactions;

    public function test_show_returns_preferences_for_authenticated_user(): void
    {
        $user = User::factory()->create();
        NotificationPreference::factory()->create([
            'user_id' => $user->id,
            'medication_reminder' => true,
            'interaction_alert' => false,
        ]);

        $response = $this->actingAsUser($user)->getJson('/api/v1/notification-preferences');

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'user_id',
                    'medication_reminder',
                    'low_stock_alert',
                    'interaction_alert',
                    'push_enabled',
                    'whatsapp_enabled',
                    'quiet_hours_start',
                    'quiet_hours_end',
                ],
            ])
            ->assertJsonPath('data.medication_reminder', true)
            ->assertJsonPath('data.interaction_alert', false);
    }

    public function test_show_creates_default_preferences_when_none_exist(): void
    {
        $user = User::factory()->create();

        $this->assertDatabaseMissing('notification_preferences', [
            'user_id' => $user->id,
        ]);

        $response = $this->actingAsUser($user)->getJson('/api/v1/notification-preferences');

        $response->assertStatus(200);

        $this->assertDatabaseHas('notification_preferences', [
            'user_id' => $user->id,
            'medication_reminder' => true,
            'interaction_alert' => true,
        ]);
    }

    public function test_update_modifies_preferences(): void
    {
        $user = User::factory()->create();
        NotificationPreference::factory()->create([
            'user_id' => $user->id,
            'medication_reminder' => true,
            'interaction_alert' => true,
        ]);

        $response = $this->actingAsUser($user)->putJson('/api/v1/notification-preferences', [
            'medication_reminder' => false,
            'quiet_hours_start' => '22:00',
            'quiet_hours_end' => '07:00',
        ]);

        $response
            ->assertStatus(200)
            ->assertJsonPath('data.medication_reminder', false);

        $data = $response->json('data');
        $this->assertStringStartsWith('22:00', $data['quiet_hours_start']);
        $this->assertStringStartsWith('07:00', $data['quiet_hours_end']);

        $this->assertDatabaseHas('notification_preferences', [
            'user_id' => $user->id,
            'medication_reminder' => false,
        ]);
    }

    public function test_update_creates_preferences_when_none_exist(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAsUser($user)->putJson('/api/v1/notification-preferences', [
            'medication_reminder' => false,
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('notification_preferences', [
            'user_id' => $user->id,
            'medication_reminder' => false,
        ]);
    }

    public function test_show_requires_authentication(): void
    {
        $response = $this->getJson('/api/v1/notification-preferences');

        $response->assertStatus(401);
    }

    public function test_update_requires_authentication(): void
    {
        $response = $this->putJson('/api/v1/notification-preferences', [
            'medication_reminder' => false,
        ]);

        $response->assertStatus(401);
    }

    public function test_update_validates_quiet_hours_format(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAsUser($user)->putJson('/api/v1/notification-preferences', [
            'quiet_hours_start' => 'invalid',
        ]);

        $response->assertStatus(422);
    }
}

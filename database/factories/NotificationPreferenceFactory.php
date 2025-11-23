<?php

namespace Database\Factories;

use App\Models\NotificationPreference;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\NotificationPreference>
 */
class NotificationPreferenceFactory extends Factory
{
    protected $model = NotificationPreference::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'medication_reminder' => true,
            'low_stock_alert' => true,
            'interaction_alert' => true,
            'push_enabled' => true,
            'whatsapp_enabled' => false,
            'quiet_hours_start' => null,
            'quiet_hours_end' => null,
        ];
    }

    public function withQuietHours(string $start = '22:00', string $end = '07:00'): static
    {
        return $this->state(fn (array $attributes) => [
            'quiet_hours_start' => $start,
            'quiet_hours_end' => $end,
        ]);
    }

    public function disabledReminders(): static
    {
        return $this->state(fn (array $attributes) => [
            'medication_reminder' => false,
        ]);
    }

    public function disabledInteractionAlerts(): static
    {
        return $this->state(fn (array $attributes) => [
            'interaction_alert' => false,
        ]);
    }
}

<?php

namespace Database\Factories;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Notification>
 */
class NotificationFactory extends Factory
{
    protected $model = Notification::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'user_medication_id' => null,
            'type' => 'medication_reminder',
            'title' => fake()->sentence(3),
            'body' => fake()->sentence(10),
            'scheduled_for' => now()->addMinutes(fake()->numberBetween(1, 60)),
            'sent_at' => null,
            'read_at' => null,
            'provider' => 'push',
            'status' => 'pending',
            'metadata' => null,
        ];
    }

    public function medicationReminder(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'medication_reminder',
            'title' => 'Lembrete de medicamento',
        ]);
    }

    public function interactionAlert(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'interaction_alert',
            'title' => 'Alerta de interação medicamentosa',
            'user_medication_id' => null,
        ]);
    }

    public function lowStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'low_stock',
            'title' => 'Estoque baixo',
        ]);
    }

    public function sent(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'sent',
            'sent_at' => now(),
        ]);
    }

    public function read(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'read',
            'sent_at' => now()->subMinutes(30),
            'read_at' => now(),
        ]);
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'sent_at' => null,
            'read_at' => null,
        ]);
    }

    public function scheduledFor(\DateTime|\Carbon\Carbon $dateTime): static
    {
        return $this->state(fn (array $attributes) => [
            'scheduled_for' => $dateTime,
        ]);
    }
}

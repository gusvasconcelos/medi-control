<?php

namespace Database\Factories;

use App\Models\MedicationLog;
use App\Models\UserMedication;
use Illuminate\Database\Eloquent\Factories\Factory;

class MedicationLogFactory extends Factory
{
    protected $model = MedicationLog::class;

    public function definition(): array
    {
        $statuses = ['pending', 'taken', 'missed', 'skipped'];

        return [
            'user_medication_id' => UserMedication::factory(),
            'scheduled_at' => fake()->dateTimeBetween('-7 days', '+7 days'),
            'taken_at' => fake()->optional()->dateTimeBetween('-7 days', 'now'),
            'status' => fake()->randomElement($statuses),
            'notes' => fake()->optional()->sentence(),
        ];
    }
}

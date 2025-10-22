<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Medication;
use App\Models\UserMedication;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserMedicationFactory extends Factory
{
    protected $model = UserMedication::class;

    public function definition(): array
    {
        $vias = ['oral', 'topical', 'injection', 'inhalation', 'sublingual', 'rectal', 'other'];

        return [
            'user_id' => User::factory(),
            'medication_id' => Medication::factory(),
            'dosage' => fake()->randomElement(['1 comprimido', '2 comprimidos', '1 cápsula', '5ml']),
            'time_slots' => fake()->randomElement([
                ['08:00'],
                ['08:00', '20:00'],
                ['08:00', '14:00', '20:00'],
            ]),
            'via_administration' => fake()->randomElement($vias),
            'duration' => fake()->optional()->numberBetween(7, 90),
            'start_date' => fake()->date(),
            'end_date' => fake()->optional()->date(),
            'initial_stock' => fake()->numberBetween(10, 100),
            'current_stock' => fake()->numberBetween(0, 100),
            'low_stock_threshold' => fake()->numberBetween(3, 10),
            'notes' => fake()->optional()->sentence(),
            'active' => true,
        ];
    }
}

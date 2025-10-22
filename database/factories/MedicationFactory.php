<?php

namespace Database\Factories;

use App\Models\Medication;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Medication>
 */
class MedicationFactory extends Factory
{
    protected $model = Medication::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $forms = ['tablet', 'capsule', 'liquid', 'injection', 'cream', 'drops', 'spray', 'inhaler', 'patch', 'other'];

        return [
            'name' => fake()->word() . ' ' . fake()->randomNumber(3) . 'mg',
            'active_principle' => fake()->word(),
            'manufacturer' => fake()->company(),
            'category' => fake()->randomElement(['Antibiótico', 'Analgésico', 'Anti-inflamatório', 'Anti-hipertensivo']),
            'therapeutic_class' => fake()->randomElement(['Classe A', 'Classe B', 'Classe C']),
            'strength' => fake()->randomElement(['100mg', '250mg', '500mg', '1g']),
            'form' => fake()->randomElement($forms),
            'description' => fake()->sentence(),
            'warnings' => fake()->sentence(),
            'interactions' => null,
        ];
    }
}

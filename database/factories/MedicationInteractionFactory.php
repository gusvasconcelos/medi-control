<?php

namespace Database\Factories;

use App\Models\Medication;
use App\Models\MedicationInteraction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MedicationInteraction>
 */
class MedicationInteractionFactory extends Factory
{
    protected $model = MedicationInteraction::class;

    public function definition(): array
    {
        return [
            'owner_id' => Medication::factory(),
            'related_id' => Medication::factory(),
            'severity' => $this->faker->randomElement(['none', 'mild', 'moderate', 'severe']),
            'description' => $this->faker->sentence(),
            'recommendation' => $this->faker->sentence(),
            'detected_at' => now(),
            'acknowledged_at' => null,
        ];
    }

    public function severe(): static
    {
        return $this->state(fn (array $attributes) => [
            'severity' => 'severe',
            'description' => 'Aumenta risco de sangramento fatal. Evitar uso concomitante.',
            'recommendation' => 'Consultar médico imediatamente.',
        ]);
    }

    public function moderate(): static
    {
        return $this->state(fn (array $attributes) => [
            'severity' => 'moderate',
            'description' => 'Pode elevar níveis séricos em 40%. Ajustar dose e monitorar.',
            'recommendation' => 'Monitoramento clínico recomendado.',
        ]);
    }

    public function mild(): static
    {
        return $this->state(fn (array $attributes) => [
            'severity' => 'mild',
            'description' => 'Possível leve sonolência. Informar ao paciente.',
            'recommendation' => 'Evitar dirigir ou operar máquinas.',
        ]);
    }

    public function none(): static
    {
        return $this->state(fn (array $attributes) => [
            'severity' => 'none',
            'description' => 'Não há interação clinicamente relevante identificada.',
            'recommendation' => 'Nenhuma recomendação necessária.',
        ]);
    }

    public function acknowledged(): static
    {
        return $this->state(fn (array $attributes) => [
            'acknowledged_at' => now(),
        ]);
    }
}

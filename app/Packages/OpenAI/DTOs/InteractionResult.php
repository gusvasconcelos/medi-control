<?php

namespace App\Packages\OpenAI\DTOs;

final readonly class InteractionResult
{
    public function __construct(
        public int $medicationId,
        public string $medicationName,
        public bool $hasInteraction,
        public string $severity,
        public string $description,
        public string $calculatedAt
    ) {
    }

    /**
     * @param array{medication_id: int, medication_name: string, has_interaction: bool, severity: string, description: string} $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            medicationId: $data['medication_id'],
            medicationName: $data['medication_name'],
            hasInteraction: $data['has_interaction'],
            severity: $data['severity'],
            description: $data['description'],
            calculatedAt: now()->toDateTimeString()
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'medication_id' => $this->medicationId,
            'medication_name' => $this->medicationName,
            'has_interaction' => $this->hasInteraction,
            'severity' => $this->severity,
            'description' => $this->description,
            'calculated_at' => $this->calculatedAt,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function toStorageFormat(): array
    {
        return [
            'medication_id' => $this->medicationId,
            'has_interaction' => $this->hasInteraction,
            'severity' => $this->severity,
            'description' => $this->description,
            'calculated_at' => $this->calculatedAt,
        ];
    }
}

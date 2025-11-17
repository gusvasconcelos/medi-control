<?php

namespace App\Services\Medication;

use App\Models\Medication;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use App\Packages\OpenAI\DTOs\InteractionResult;
use App\Packages\OpenAI\Prompts\CheckInteractionPrompt;
use App\Packages\OpenAI\Contracts\OpenAIClientInterface;

final class InteractionCheckerService
{
    public function __construct(
        private OpenAIClientInterface $openAIClient,
        private Medication $medication
    ) {
    }

    /**
     * @param Medication $mainMedication
     * @param Collection<int, int> $medicationIds
     * @return Collection<int, InteractionResult>
     */
    public function checkInteractionsWithOpenAI(Medication $mainMedication, Collection $medicationIds): Collection
    {
        $medicationsToCheck = $this->medication
            ->whereIn('id', $medicationIds->toArray())
            ->get(['id', 'name']);

        if ($medicationsToCheck->isEmpty()) {
            return collect();
        }

        $messages = CheckInteractionPrompt::build(
            $mainMedication->name,
            $medicationsToCheck->map(fn(Medication $med) => [
                'id' => $med->id,
                'name' => $med->name,
            ])
        );

        $response = $this->openAIClient->chatCompletion(
            messages: $messages,
            temperature: config('openai.check_interactions.temperature'),
            model: config('openai.check_interactions.model'),
            jsonFormat: true
        );

        $parsedResponse = json_decode($response['content'], true);

        if (!isset($parsedResponse['interactions']) || !is_array($parsedResponse['interactions'])) {
            throw new \RuntimeException('Invalid response format from OpenAI');
        }

        return collect($parsedResponse['interactions'])
            ->map(fn(array $interaction) => InteractionResult::fromArray($interaction));
    }

    /**
     * @param Medication $mainMedication
     * @param Collection<int, int> $requestedMedicationIds
     * @return Collection<int, int>
     */
    public function filterAlreadyChecked(Medication $mainMedication, Collection $requestedMedicationIds): Collection
    {
        $existingInteractions = $mainMedication->interactions ?? [];

        if (empty($existingInteractions)) {
            return $requestedMedicationIds;
        }

        $checkedMedicationIds = collect($existingInteractions)
            ->pluck('medication_id')
            ->toArray();

        return $requestedMedicationIds->reject(
            fn(int $id) => in_array($id, $checkedMedicationIds, true)
        )->values();
    }

    /**
     * @param Medication $mainMedication
     * @param Collection<int, InteractionResult> $newInteractions
     */
    public function persistInteractionsBidirectionally(Medication $mainMedication, Collection $newInteractions): void
    {
        DB::transaction(function () use ($mainMedication, $newInteractions) {
            $existingInteractions = $mainMedication->interactions ?? [];

            $updatedInteractions = array_merge(
                $existingInteractions,
                $newInteractions->map(fn(InteractionResult $result) => $result->toStorageFormat())->toArray()
            );

            $mainMedication->update(['interactions' => $updatedInteractions]);

            foreach ($newInteractions as $interaction) {
                $targetMedication = $this->medication->find($interaction->medicationId);

                if (!$targetMedication) {
                    continue;
                }

                $targetExistingInteractions = $targetMedication->interactions ?? [];

                $reverseInteraction = [
                    'medication_id' => $mainMedication->id,
                    'has_interaction' => $interaction->hasInteraction,
                    'severity' => $interaction->severity,
                    'calculated_at' => $interaction->calculatedAt,
                ];

                $alreadyExists = collect($targetExistingInteractions)
                    ->contains(fn(array $existing) => $existing['medication_id'] === $mainMedication->id);

                if (!$alreadyExists) {
                    $targetMedication->update([
                        'interactions' => array_merge($targetExistingInteractions, [$reverseInteraction]),
                    ]);
                }
            }
        });
    }

    /**
     * @param Collection<int, InteractionResult> $interactions
     * @return array<string, array<int, array<string, mixed>>>
     */
    public function buildInteractionResponse(Collection $interactions): array
    {
        return [
            'interactions' => $interactions->map(fn(InteractionResult $result) => $result->toArray())->toArray(),
        ];
    }
}

<?php

namespace App\Services\Medication;

use OpenAI;
use App\Models\Medication;
use Illuminate\Support\Collection;
use App\Models\MedicationInteraction;
use App\Packages\OpenAI\Prompts\CheckInteractionPrompt;

class MedicationInterationService
{
    public static function execute(Medication $medication, Collection $medicationIds): Collection
    {
        $medicationIds = $medicationIds->get('medications', []);

        /** @var Collection<int, MedicationInteraction> $existingInteractions */
        $existingInteractions = MedicationInteraction::with('owner', 'related')
            ->where('owner_id', $medication->id)
            ->whereIn('related_id', $medicationIds)
            ->get();

        $uncheckedMedicationIds = array_diff(
            $medicationIds,
            $existingInteractions->pluck('related_id')->toArray()
        );

        $newInteractions = collect();

        if (! empty($uncheckedMedicationIds)) {
            $newInteractions = self::check(
                $medication,
                collect($uncheckedMedicationIds)
            );
        }

        return $existingInteractions->merge($newInteractions);
    }

    private static function check(Medication $medication, Collection $medicationIds): Collection
    {
        /** @var Collection<int, Medication> $medications */
        $medications = Medication::whereIn('id', $medicationIds)->get();

        if ($medications->isEmpty()) {
            return collect();
        }

        $messages = CheckInteractionPrompt::build($medication, $medications);

        $client = OpenAI::client(config('openai.api_key'));

        $response = $client->chat()->create([
            'model' => config('openai.model'),
            'messages' => $messages,
            'response_format' => ['type' => 'json_object'],
        ]);

        $content = $response->choices[0]->message->content;

        $data = json_decode($content, true);

        $interactions = collect();

        if (!isset($data['interactions']) || !is_array($data['interactions'])) {
            return $interactions;
        }

        foreach ($data['interactions'] as $interactionData) {
            if (!$interactionData['has_interaction']) {
                continue;
            }

            $interaction = MedicationInteraction::updateOrCreate(
                [
                    'owner_id' => $medication->id,
                    'related_id' => $interactionData['medication_id'],
                ],
                [
                    'severity' => $interactionData['severity'],
                    'description' => $interactionData['description'],
                    'recommendation' => $interactionData['recommendation'],
                ]
            );

            $interactions->push($interaction->load('owner', 'related'));
        }

        return $interactions;
    }
}

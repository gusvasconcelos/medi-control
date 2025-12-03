<?php

namespace App\Services\Medication;

use App\Models\Medication;
use App\Models\MedicationInteraction;
use Illuminate\Support\Collection;
use App\Packages\OpenAI\Prompts\CheckInteractionPrompt;
use OpenAI;

class MedicationInteractionService
{
    public static function check(Medication $medication, Collection $medicationIds): Collection
    {
        /** @var Collection<int, Medication> $medications */
        $medications = Medication::whereIn('id', $medicationIds)->get();

        if ($medications->isEmpty()) {
            return collect();
        }

        $messages = CheckInteractionPrompt::build($medication, $medications);

        $client = OpenAI::client(config('openai.api_key'));

        $response = $client->chat()->create([
            'model' => config('openai.check_interactions.model'),
            'messages' => $messages,
            'response_format' => ['type' => 'json_object'],
        ]);

        $content = $response->choices[0]->message->content;

        /** @var array{interactions: array<int, array{medication_id: int, has_interaction: bool, severity: string, description: string, recommendation: string}>} $data */
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
                    'detected_at' => now(),
                ]
            );

            $interactions->push($interaction->load('owner', 'related'));
        }

        return $interactions;
    }
}

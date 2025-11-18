<?php

namespace App\Services;

use App\Models\InteractionAlert;
use App\Models\UserMedication;
use App\Packages\OpenAI\DTOs\InteractionResult;
use Illuminate\Support\Facades\DB;

class InteractionAlertService
{
    /**
     * @param InteractionResult[] $interactions
     */
    public function createAlertsForInteractions(UserMedication $userMedication, array $interactions): int
    {
        $severeOrModerateInteractions = array_filter(
            $interactions,
            fn (InteractionResult $interaction): bool => in_array(
                $interaction->severity,
                ['severe', 'moderate'],
                true
            )
        );

        if (empty($severeOrModerateInteractions)) {
            return 0;
        }

        $alertsCreated = 0;

        DB::transaction(function () use ($userMedication, $severeOrModerateInteractions, &$alertsCreated): void {
            foreach ($severeOrModerateInteractions as $interaction) {
                $existingAlert = InteractionAlert::query()
                    ->where(function ($query) use ($userMedication, $interaction): void {
                        $query->where(function ($q) use ($userMedication, $interaction): void {
                            $q->where('medication_1_id', $userMedication->medication_id)
                                ->where('medication_2_id', $interaction->medicationId);
                        })->orWhere(function ($q) use ($userMedication, $interaction): void {
                            $q->where('medication_1_id', $interaction->medicationId)
                                ->where('medication_2_id', $userMedication->medication_id);
                        });
                    })
                    ->whereNull('acknowledged_at')
                    ->exists();

                if ($existingAlert) {
                    continue;
                }

                InteractionAlert::create([
                    'user_id' => $userMedication->user_id,
                    'medication_1_id' => $userMedication->medication_id,
                    'medication_2_id' => $interaction->medicationId,
                    'severity' => $interaction->severity,
                    'description' => $interaction->description,
                    'recommendation' => $this->generateRecommendation($interaction->severity),
                    'detected_at' => now(),
                    'acknowledged_at' => null,
                ]);

                $alertsCreated++;
            }
        });

        return $alertsCreated;
    }

    private function generateRecommendation(string $severity): string
    {
        return match ($severity) {
            'severe' => 'Consulte seu médico imediatamente. Esta combinação pode causar efeitos adversos graves.',
            'moderate' => 'Informe seu médico sobre esta interação. Pode ser necessário ajustar as dosagens.',
            default => 'Monitore possíveis efeitos colaterais e informe seu médico se necessário.',
        };
    }
}

<?php

namespace App\Services;

use App\Models\User;
use App\Services\Medication\InteractionCheckerService;

class ChatInteractionCheckerService
{
    public function __construct(
        private readonly InteractionCheckerService $interactionChecker,
        private readonly InteractionAlertService $alertService
    ) {
    }

    /**
     * @return array{success: bool, message: string, interactions_found: int, severe_count: int, moderate_count: int, mild_count: int, alerts_created: int}
     */
    public function checkAllMedicationInteractions(User $user): array
    {
        /** @var \Illuminate\Database\Eloquent\Collection<int, \App\Models\UserMedication> $activeMedications */
        $activeMedications = $user->medications()
            ->with('medication')
            ->where('active', true)
            ->where('start_date', '<=', today())
            ->where(function ($query) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', today());
            })
            ->get();

        if ($activeMedications->count() < 2) {
            return [
                'success' => false,
                'message' => 'É necessário ter pelo menos 2 medicamentos ativos para verificar interações.',
                'interactions_found' => 0,
                'severe_count' => 0,
                'moderate_count' => 0,
                'mild_count' => 0,
                'alerts_created' => 0,
            ];
        }

        $totalInteractionsFound = 0;
        $severityCount = ['severe' => 0, 'moderate' => 0, 'minor' => 0];
        $totalAlertsCreated = 0;

        foreach ($activeMedications as $userMedication) {
            $otherMedicationIds = $activeMedications
                ->where('id', '!=', $userMedication->id)
                ->pluck('medication_id');

            $medicationIdsToCheck = $this->interactionChecker->filterAlreadyChecked(
                $userMedication->medication,
                $otherMedicationIds
            );

            if ($medicationIdsToCheck->isEmpty()) {
                continue;
            }

            try {
                $checkResult = $this->interactionChecker->checkInteractionsWithOpenAI(
                    $userMedication->medication,
                    $medicationIdsToCheck
                );

                $this->interactionChecker->persistInteractionsBidirectionally(
                    $userMedication->medication,
                    $checkResult->interactions
                );

                $interactionsWithIssues = $checkResult->interactions->filter(
                    fn ($interaction) => $interaction->hasInteraction
                );

                $totalInteractionsFound += $interactionsWithIssues->count();

                foreach ($interactionsWithIssues as $interaction) {
                    $severity = $interaction->severity;
                    if (isset($severityCount[$severity])) {
                        $severityCount[$severity]++;
                    }
                }

                $alertsCreated = $this->alertService->createAlertsForInteractions(
                    $userMedication,
                    $checkResult->interactions->toArray()
                );

                $totalAlertsCreated += $alertsCreated;
            } catch (\Throwable $e) {
                return [
                    'success' => false,
                    'message' => 'Ocorreu um erro ao verificar as interações: ' . $e->getMessage(),
                    'interactions_found' => $totalInteractionsFound,
                    'severe_count' => $severityCount['severe'],
                    'moderate_count' => $severityCount['moderate'],
                    'mild_count' => $severityCount['minor'],
                    'alerts_created' => $totalAlertsCreated,
                ];
            }
        }

        return [
            'success' => true,
            'message' => $this->buildSuccessMessage($totalInteractionsFound, $severityCount, $totalAlertsCreated),
            'interactions_found' => $totalInteractionsFound,
            'severe_count' => $severityCount['severe'],
            'moderate_count' => $severityCount['moderate'],
            'mild_count' => $severityCount['minor'],
            'alerts_created' => $totalAlertsCreated,
        ];
    }

    /**
     * @param array<string, int> $severityCount
     */
    private function buildSuccessMessage(int $totalInteractions, array $severityCount, int $alertsCreated): string
    {
        if ($totalInteractions === 0) {
            return 'Verificação concluída! Não foram encontradas interações medicamentosas significativas entre seus medicamentos.';
        }

        $message = "Verificação concluída! Foram encontradas {$totalInteractions} interação(ões) medicamentosa(s):\n\n";

        if ($severityCount['severe'] > 0) {
            $message .= "⚠️ **{$severityCount['severe']} interação(ões) grave(s)** - Consulte seu médico imediatamente\n";
        }

        if ($severityCount['moderate'] > 0) {
            $message .= "⚠️ **{$severityCount['moderate']} interação(ões) moderada(s)** - Informe seu médico\n";
        }

        if ($severityCount['minor'] > 0) {
            $message .= "ℹ️ {$severityCount['minor']} interação(ões) leve(s) - Monitore possíveis efeitos\n";
        }

        if ($alertsCreated > 0) {
            $message .= "\n{$alertsCreated} novo(s) alerta(s) foi(ram) criado(s) para interações graves ou moderadas.";
        }

        return $message;
    }
}

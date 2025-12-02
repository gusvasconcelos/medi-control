<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use App\Models\UserMedication;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use App\Services\InteractionAlertService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\Packages\OpenAI\DTOs\InteractionResult;
use App\Services\Monitoring\DiscordMonitoringService;
use App\Services\Medication\InteractionCheckerService;
use App\Packages\Monitoring\DTOs\InteractionCheckResult;
use App\Packages\Monitoring\DTOs\InteractionCheckMetrics;

final class CheckUserMedicationInteractionsJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public int $tries = 3;

    public int $backoff = 60;

    public int $timeout = 180;

    public function __construct(
        public readonly int $userMedicationId
    ) {
        $this->afterCommit();
        $this->onConnection('rabbitmq');
        $this->onQueue('medication-interactions');
    }

    public function handle(
        InteractionCheckerService $interactionChecker,
        InteractionAlertService $alertService,
        DiscordMonitoringService $discordMonitoring
    ): void {
        /** @var UserMedication|null $userMedication */
        $userMedication = UserMedication::disableUserScope()
            ->with(['medication', 'user'])
            ->find($this->userMedicationId);

        if (! $userMedication) {
            return;
        }

        auth('web')->setUser($userMedication->user);

        $activeUserMedications = UserMedication::query()
            ->where('id', '!=', $userMedication->id)
            ->where('active', true)
            ->whereNotNull('medication_id')
            ->pluck('medication_id');

        if ($activeUserMedications->isEmpty()) {
            return;
        }

        $medicationIdsToCheck = $interactionChecker->filterAlreadyChecked(
            $userMedication->medication,
            $activeUserMedications
        );

        if ($medicationIdsToCheck->isEmpty()) {
            $discordMonitoring->notifyInteractionCheckSkipped(
                $userMedication->medication->name,
                'Todas as interações já foram checadas'
            );

            return;
        }

        try {
            $checkResult = $interactionChecker->checkInteractionsWithOpenAI(
                $userMedication->medication,
                $medicationIdsToCheck
            );

            $interactionChecker->persistInteractionsBidirectionally(
                $userMedication->medication,
                $checkResult->interactions
            );

            $alertsCreated = $alertService->createAlertsForInteractions(
                $userMedication,
                $checkResult->interactions->toArray()
            );

            $this->sendSuccessNotification(
                $discordMonitoring,
                $userMedication->medication->name,
                $medicationIdsToCheck->count(),
                $checkResult,
                $alertsCreated
            );
        } catch (\Throwable $e) {
            $discordMonitoring->notifyInteractionCheckFailed(
                $userMedication->medication->name,
                $e->getMessage(),
                $medicationIdsToCheck->count()
            );

            throw $e;
        }
    }

    private function sendSuccessNotification(
        DiscordMonitoringService $discordMonitoring,
        string $medicationName,
        int $medicationsCheckedCount,
        InteractionCheckResult $checkResult,
        int $alertsCreated
    ): void {
        $interactions = $checkResult->interactions;
        $interactionsWithIssues = $interactions->filter(fn (InteractionResult $i) => $i->hasInteraction);

        $metrics = new InteractionCheckMetrics(
            medicationName: $medicationName,
            medicationsCheckedCount: $medicationsCheckedCount,
            interactionsFoundCount: $interactionsWithIssues->count(),
            severeInteractionsCount: $interactionsWithIssues->filter(fn (InteractionResult $i) => $i->severity === 'severe')->count(),
            moderateInteractionsCount: $interactionsWithIssues->filter(fn (InteractionResult $i) => $i->severity === 'moderate')->count(),
            alertsCreatedCount: $alertsCreated,
            tokenUsage: $checkResult->tokenUsage,
            durationInSeconds: $checkResult->durationInSeconds,
            model: $checkResult->model
        );

        $discordMonitoring->notifyInteractionCheckCompleted($metrics);
    }
}

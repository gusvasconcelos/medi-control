<?php

namespace App\Jobs;

use App\Models\UserMedication;
use App\Services\InteractionAlertService;
use App\Services\Medication\InteractionCheckerService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

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
        $this->onConnection('rabbitmq');
        $this->onQueue('medication-interactions');
    }

    public function handle(
        InteractionCheckerService $interactionChecker,
        InteractionAlertService $alertService
    ): void {
        $userMedication = UserMedication::query()
            ->with(['medication', 'user'])
            ->find($this->userMedicationId);

        if (! $userMedication) {
            return;
        }

        auth('api')->setUser($userMedication->user);

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
            return;
        }

        $newInteractions = $interactionChecker->checkInteractionsWithOpenAI(
            $userMedication->medication,
            $medicationIdsToCheck
        );

        $interactionChecker->persistInteractionsBidirectionally(
            $userMedication->medication,
            $newInteractions
        );

        $alertService->createAlertsForInteractions(
            $userMedication,
            $newInteractions->toArray()
        );
    }
}

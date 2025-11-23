<?php

namespace App\Listeners;

use App\Events\UserMedicationCreated;
use App\Jobs\CheckUserMedicationInteractionsJob;
use Illuminate\Contracts\Queue\ShouldQueue;

final class CheckMedicationInteractions implements ShouldQueue
{
    public bool $afterCommit = true;

    public function handle(UserMedicationCreated $event): void
    {
        CheckUserMedicationInteractionsJob::dispatch($event->userMedication->id);
    }
}

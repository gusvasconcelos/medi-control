<?php

namespace App\Services;

use App\Models\MedicationLog;
use App\Models\UserMedication;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class MedicationLogService
{
    public function __construct(
        protected MedicationLog $medicationLog
    ) {
        $this->medicationLog = $medicationLog;
    }

    public function logTaken(Collection $data, int $userMedicationId): void
    {
        $userMedication = UserMedication::findOrFail($userMedicationId);

        $scheduledAt = today()->setTimeFromTimeString($userMedication->time_slots[0]);

        $takenAt = $data->get('taken_at')
            ? Carbon::parse($data->get('taken_at'))
            : now();

        $userMedication->logs()->create([
            'scheduled_at' => $scheduledAt,
            'taken_at' => $takenAt,
            'status' => 'taken',
            'notes' => $data->get('notes'),
        ]);

        $userMedication->decrement('current_stock');

        $userMedication->refresh();
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\UnprocessableEntityException;
use App\Http\Controllers\Controller;
use App\Http\Requests\MedicationLog\LogMedicationTakenRequest;
use App\Models\UserMedication;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class MedicationLogController extends Controller
{
    public function logTaken(LogMedicationTakenRequest $request, int $userMedicationId): JsonResponse
    {
        $userMedication = UserMedication::findOrFail($userMedicationId);

        $validated = collect($request->validated());

        $timeSlot = $validated->get('time_slot');

        if (! in_array($timeSlot, $userMedication->time_slots ?? [])) {
            throw new UnprocessableEntityException(
                __('messages.medication_log.invalid_time_slot'),
                'INVALID_TIME_SLOT'
            );
        }

        $scheduledAt = Carbon::today()->setTimeFromTimeString($timeSlot);

        $takenAt = $validated->get('taken_at')
            ? Carbon::parse($validated->get('taken_at'))
            : now();

        $log = $userMedication->logs()->create([
            'scheduled_at' => $scheduledAt,
            'taken_at' => $takenAt,
            'status' => 'taken',
            'notes' => $validated->get('notes'),
        ]);

        $userMedication->decrement('current_stock');
        $userMedication->refresh();

        return response()->json([
            'message' => __('messages.medication_log.taken'),
            'data' => $log,
        ]);
    }
}

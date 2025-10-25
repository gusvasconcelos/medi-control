<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\MedicationLog\LogMedicationTakenRequest;
use Illuminate\Http\JsonResponse;
use App\Services\MedicationLogService;

class MedicationLogController extends Controller
{
    public function __construct(
        protected MedicationLogService $medicationLogService
    ) {
        $this->medicationLogService = $medicationLogService;
    }

    public function logTaken(LogMedicationTakenRequest $request, int $userMedicationId): JsonResponse
    {
        $validated = collect($request->validated());

        $this->medicationLogService->logTaken(collect($validated), $userMedicationId);

        return response()->json(['message' => __('messages.medication_log.taken')]);
    }
}

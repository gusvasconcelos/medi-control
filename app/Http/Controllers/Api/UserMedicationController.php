<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserMedication\GetUserMedicationsRequest;
use App\Http\Requests\UserMedication\StoreUserMedicationRequest;
use App\Http\Requests\UserMedication\IndicatorsMedicationRequest;
use App\Http\Requests\UserMedication\UpdateUserMedicationRequest;
use App\Http\Requests\UserMedication\AdherenceReportRequest;
use App\Services\UserMedicationService;
use App\Services\CaregiverActionService;

class UserMedicationController extends Controller
{
    public function __construct(
        protected UserMedicationService $userMedicationService,
        protected CaregiverActionService $caregiverActionService
    ) {
        $this->userMedicationService = $userMedicationService;
        $this->caregiverActionService = $caregiverActionService;
    }

    public function getUserMedications(GetUserMedicationsRequest $request): JsonResponse
    {
        $validated = $request->validated();

        if (isset($validated['user_id'])) {
            $this->caregiverActionService->verifyPermission(
                $request->user()->id,
                $validated['user_id'],
                'patient.medications.view'
            );
        }

        $userMedications = $this->userMedicationService->getUserMedications(collect($validated));

        return response()->json(['data' => $userMedications]);
    }

    public function indicators(IndicatorsMedicationRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $indicators = $this->userMedicationService->getIndicators(collect($validated));

        return response()->json(['data' => $indicators]);
    }

    public function store(StoreUserMedicationRequest $request): JsonResponse
    {
        $validated = $request->validated();

        if (isset($validated['user_id'])) {
            $this->caregiverActionService->verifyPermission(
                $request->user()->id,
                $validated['user_id'],
                'patient.medications.create'
            );
        }

        $userMedication = $this->userMedicationService->store(collect($validated));

        return response()->json([
            'message' => __('medications.user_medication.created'),
            'data' => $userMedication,
        ]);
    }

    public function show(GetUserMedicationsRequest $request, int $id): JsonResponse
    {
        $validated = $request->validated();

        $userId = $validated['user_id'] ?? null;

        if ($userId) {
            $this->caregiverActionService->verifyPermission(
                $request->user()->id,
                $userId,
                'patient.medications.view'
            );
        }

        $userMedication = $this->userMedicationService->show($id, $userId);

        return response()->json(['data' => $userMedication]);
    }

    public function update(UpdateUserMedicationRequest $request, int $id): JsonResponse
    {
        $validated = $request->validated();

        if (isset($validated['user_id'])) {
            $this->caregiverActionService->verifyPermission(
                $request->user()->id,
                $validated['user_id'],
                'patient.medications.edit'
            );
        }

        $userMedication = $this->userMedicationService->update(collect($validated), $id);

        return response()->json([
            'message' => __('medications.user_medication.updated'),
            'data' => $userMedication,
        ]);
    }

    public function destroy(GetUserMedicationsRequest $request, int $id): JsonResponse
    {
        $validated = $request->validated();

        $userId = $validated['user_id'] ?? null;

        if ($userId) {
            $this->caregiverActionService->verifyPermission(
                $request->user()->id,
                $userId,
                'patient.medications.delete'
            );
        }

        $this->userMedicationService->destroy($id, $userId);

        return response()->json([
            'message' => __('medications.user_medication.deleted'),
        ]);
    }

    public function adherenceReport(AdherenceReportRequest $request): JsonResponse
    {
        $validated = $request->validated();

        if (isset($validated['user_id'])) {
            $this->caregiverActionService->verifyPermission(
                $request->user()->id,
                $validated['user_id'],
                'patient.adherence.view'
            );
        }

        $report = $this->userMedicationService->getAdherenceReport(collect($validated));

        return response()->json(['data' => $report]);
    }

    public function adherenceReportPdf(AdherenceReportRequest $request): Response
    {
        $validated = $request->validated();

        if (isset($validated['user_id'])) {
            $this->caregiverActionService->verifyPermission(
                $request->user()->id,
                $validated['user_id'],
                'patient.adherence.view'
            );
        }

        $pdf = $this->userMedicationService->generateAdherenceReportPdf(collect($validated));

        $filename = 'relatorio-adesao-' . $validated['start_date'] . '-' . $validated['end_date'] . '.pdf';

        return $pdf->download($filename);
    }
}

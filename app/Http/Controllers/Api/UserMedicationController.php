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

class UserMedicationController extends Controller
{
    public function __construct(
        protected UserMedicationService $userMedicationService
    ) {
        $this->userMedicationService = $userMedicationService;
    }

    public function getUserMedications(GetUserMedicationsRequest $request): JsonResponse
    {
        $validated = $request->validated();

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

        $userMedication = $this->userMedicationService->store(collect($validated));

        return response()->json([
            'message' => __('medications.user_medication.created'),
            'data' => $userMedication,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $userMedication = $this->userMedicationService->show($id);

        return response()->json(['data' => $userMedication]);
    }

    public function update(UpdateUserMedicationRequest $request, int $id): JsonResponse
    {
        $validated = $request->validated();

        $userMedication = $this->userMedicationService->update(collect($validated), $id);

        return response()->json([
            'message' => __('medications.user_medication.updated'),
            'data' => $userMedication,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->userMedicationService->destroy($id);

        return response()->json([
            'message' => __('medications.user_medication.deleted'),
        ]);
    }

    public function adherenceReport(AdherenceReportRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $report = $this->userMedicationService->getAdherenceReport(collect($validated));

        return response()->json(['data' => $report]);
    }

    public function adherenceReportPdf(AdherenceReportRequest $request): Response
    {
        $validated = $request->validated();

        $pdf = $this->userMedicationService->generateAdherenceReportPdf(collect($validated));

        $filename = 'relatorio-adesao-' . $validated['start_date'] . '-' . $validated['end_date'] . '.pdf';

        return $pdf->download($filename);
    }
}

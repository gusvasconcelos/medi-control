<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Services\Medication\MedicationService;
use App\Http\Requests\Medication\SearchMedicationRequest;
use App\Http\Requests\Medication\CheckInteractionsRequest;

class MedicationController extends Controller
{
    public function __construct(
        protected MedicationService $medicationService
    ) {
    }

    public function search(SearchMedicationRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $medications = $this->medicationService->search(collect($validated));

        return response()->json(['data' => $medications]);
    }

    public function checkInteractions(CheckInteractionsRequest $request, int $id): JsonResponse
    {
        $validated = $request->validated();

        $interactions = $this->medicationService->checkInteractions(collect($validated), $id);

        return response()->json(['data' => $interactions]);
    }
}

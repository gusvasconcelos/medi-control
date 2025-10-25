<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Medication\SearchMedicationRequest;
use App\Services\MedicationService;
use Illuminate\Http\JsonResponse;

class MedicationController extends Controller
{
    public function __construct(
        protected MedicationService $medicationService
    ) {
        $this->medicationService = $medicationService;
    }

    public function search(SearchMedicationRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $medications = $this->medicationService->search(collect($validated));

        return response()->json(['data' => $medications]);
    }
}

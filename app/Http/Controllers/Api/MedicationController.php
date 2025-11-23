<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Services\Medication\MedicationService;
use App\Http\Requests\Medication\StoreMedicationRequest;
use App\Http\Requests\Medication\UpdateMedicationRequest;
use App\Http\Requests\Medication\CheckInteractionsRequest;

class MedicationController extends Controller
{
    public function __construct(
        protected MedicationService $medicationService
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $data = $request->all();

        $medications = $this->medicationService->index(collect($data));

        return response()->json($medications);
    }

    public function show(string|int $id): JsonResponse
    {
        $medication = $this->medicationService->show($id);

        return response()->json(['data' => $medication]);
    }

    public function store(StoreMedicationRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $medication = $this->medicationService->store(collect($validated));

        return response()->json(['data' => $medication]);
    }

    public function update(UpdateMedicationRequest $request, int $id): JsonResponse
    {
        $validated = $request->validated();

        $medication = $this->medicationService->update(collect($validated), $id);

        return response()->json(['data' => $medication]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->medicationService->destroy($id);

        return response()->json(['message' => __('medications.medication.deleted')]);
    }

    public function checkInteractions(CheckInteractionsRequest $request, int $id): JsonResponse
    {
        $validated = $request->validated();

        $interactions = $this->medicationService->checkInteractions(collect($validated), $id);

        return response()->json(['data' => $interactions]);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Models\Medication;
use Illuminate\Http\JsonResponse;
use App\Models\UserMedication;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserMedication\IndexMedicationRequest;
use App\Http\Requests\UserMedication\SearchMedicationRequest;
use App\Http\Requests\UserMedication\StoreUserMedicationRequest;
use App\Http\Requests\UserMedication\UpdateUserMedicationRequest;

class UserMedicationController extends Controller
{
    public function index(IndexMedicationRequest $request): JsonResponse
    {
        $validated = collect($request->validated());

        $userMedicationsBuilder = UserMedication::with(['medication', 'logs'])
            ->where('active', true)
            ->orderBy('created_at', 'desc');

        if ($validated->isEmpty()) {
            return response()->json($userMedicationsBuilder->get());
        }

        $startDate = $validated->get('start_date');

        if ($startDate) {
            $userMedicationsBuilder->where('start_date', '>=', $startDate);
        }

        $endDate = $validated->get('end_date');

        if ($endDate) {
            $userMedicationsBuilder->where('end_date', '<=', $endDate);
        }

        return response()->json($userMedicationsBuilder->get());
    }

    public function store(StoreUserMedicationRequest $request): JsonResponse
    {
        $validated = collect($request->validated());

        $medication = Medication::firstOrCreate(
            [
                'id' => $validated->get('medication_id'),
            ],
            [
                'name' => $validated->get('medication_name'),
                'active_principle' => $validated->get('medication_active_principle'),
                'manufacturer' => $validated->get('medication_manufacturer'),
                'category' => $validated->get('medication_category'),
                'strength' => $validated->get('medication_strength'),
                'form' => $validated->get('medication_form'),
            ]
        );

        $medicationId = $medication->id;

        $userMedication = UserMedication::create([
            'medication_id' => $medicationId,
            'dosage' => $validated->get('dosage'),
            'time_slots' => $validated->get('time_slots'),
            'via_administration' => $validated->get('via_administration'),
            'duration' => $validated->get('duration'),
            'start_date' => $validated->get('start_date'),
            'end_date' => $validated->get('end_date'),
            'initial_stock' => $validated->get('initial_stock'),
            'current_stock' => $validated->get('current_stock'),
            'low_stock_threshold' => $validated->get('low_stock_threshold'),
            'notes' => $validated->get('notes'),
            'active' => true,
        ]);

        $userMedication->load('medication');

        return response()->json([
            'message' => __('messages.user_medication.created'),
            'data' => $userMedication,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $userMedication = UserMedication::with(['medication', 'logs'])->findOrFail($id);

        return response()->json($userMedication);
    }

    public function update(UpdateUserMedicationRequest $request, int $id): JsonResponse
    {
        $userMedication = UserMedication::findOrFail($id);

        $validated = $request->validated();

        $userMedication->update($validated);

        $userMedication->load('medication');

        return response()->json([
            'message' => __('messages.user_medication.updated'),
            'data' => $userMedication,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $userMedication = UserMedication::findOrFail($id);

        $userMedication->update(['active' => false]);

        return response()->json([
            'message' => __('messages.user_medication.deleted'),
        ]);
    }

    public function search(SearchMedicationRequest $request): JsonResponse
    {
        $validated = collect($request->validated());

        $limit = $validated->get('limit', 20);

        $medications = Medication::query()
            ->searchField('name', $validated->get('search'))
            ->limit($limit)
            ->get();

        return response()->json($medications);
    }
}

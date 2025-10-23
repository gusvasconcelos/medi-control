<?php

namespace App\Http\Controllers\Api;

use App\Models\Medication;
use App\Models\MedicationLog;
use App\Models\UserMedication;
use Illuminate\Support\Carbon;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserMedication\IndexMedicationRequest;
use App\Http\Requests\UserMedication\SearchMedicationRequest;
use App\Http\Requests\UserMedication\StoreUserMedicationRequest;
use App\Http\Requests\UserMedication\IndicatorsMedicationRequest;
use App\Http\Requests\UserMedication\UpdateUserMedicationRequest;

class UserMedicationController extends Controller
{
    public function index(IndexMedicationRequest $request): JsonResponse
    {
        $validated = collect($request->validated());

        $startDate = $validated->get('start_date', today()->format('Y-m-d'));

        $endDate = $validated->get('end_date', today()->format('Y-m-d'));

        $userMedications = UserMedication::with(['medication', 'logs'])
            ->where('active', true)
            ->where('start_date', '<=', $endDate)
            ->where(function ($query) use ($startDate) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', $startDate);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($userMedications);
    }

    public function indicators(IndicatorsMedicationRequest $request): JsonResponse
    {
        $validated = collect($request->validated());

        $startDate = $validated->get('start_date');
        $endDate = $validated->get('end_date');

        $userMedications = UserMedication::where('active', true)
            ->where('start_date', '<=', $endDate)
            ->where(function ($query) use ($startDate) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', $startDate);
            })
            ->get();

        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);

        $dateRange = [];

        for ($date = $start->copy(); $date->lte($end); $date->addDay()) {
            $dateRange[] = $date->format('Y-m-d');
        }

        $indicators = [];

        foreach ($dateRange as $date) {
            $totalScheduled = 0;
            $totalTaken = 0;

            foreach ($userMedications as $userMed) {
                $medStartDate = $userMed->start_date;
                $medEndDate = $userMed->end_date;

                if ($date < $medStartDate->format('Y-m-d')) {
                    continue;
                }

                if ($medEndDate && $date > $medEndDate->format('Y-m-d')) {
                    continue;
                }

                $timeSlots = $userMed->time_slots ?? [];
                $totalScheduled += count($timeSlots);

                $taken = MedicationLog::query()
                    ->where('user_medication_id', $userMed->id)
                    ->whereRaw('DATE(scheduled_at) = ?', [$date])
                    ->where('status', 'taken')
                    ->count();

                $totalTaken += $taken;
            }

            if ($totalScheduled > 0) {
                $indicators[] = [
                    'date' => $date,
                    'total_scheduled' => $totalScheduled,
                    'total_taken' => $totalTaken,
                ];
            }
        }

        return response()->json([
            'data' => $indicators,
        ]);
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

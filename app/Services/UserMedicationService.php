<?php

namespace App\Services;

use App\Models\Medication;
use App\Models\UserMedication;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class UserMedicationService
{
    public function __construct(
        protected UserMedication $userMedication
    ) {
        $this->userMedication = $userMedication;
    }

    public function getUserMedications(Collection $data): Collection
    {
        $startDate = $data->get('start_date', today()->format('Y-m-d'));

        $endDate = $data->get('end_date', today()->format('Y-m-d'));

        return $this->userMedication
            ->with(['medication', 'logs'])
            ->where('active', true)
            ->where('start_date', '<=', $endDate)
            ->where(function ($query) use ($startDate) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', $startDate);
            })
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getIndicators(Collection $data): Collection
    {
        $startDate = Carbon::parse($data->get('start_date'));

        $endDate = Carbon::parse($data->get('end_date'));

        $userMedications = $this->userMedication
            ->with(['logs'])
            ->where('active', true)
            ->where('start_date', '<=', $endDate)
            ->where(function ($query) use ($startDate) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', $startDate);
            })
            ->get();

        $dateRange = Carbon::parse($startDate->format('Y-m-d'))
            ->daysUntil($endDate->format('Y-m-d'))
            ->toArray();

        $indicators = collect();

        foreach ($dateRange as $date) {
            $totalScheduled = 0;

            $totalTaken = 0;

            foreach ($userMedications as $userMedication) {
                $medStartDate = $userMedication->start_date;

                $medEndDate = $userMedication->end_date;

                if ($date < $medStartDate) {
                    continue;
                }

                if ($medEndDate && $date > $medEndDate) {
                    continue;
                }

                $timeSlots = $userMedication->time_slots ?? [];

                $totalScheduled += count($timeSlots);

                $taken = $userMedication->logs()
                    ->whereDate('scheduled_at', $date)
                    ->where('status', 'taken')
                    ->count();

                $totalTaken += $taken;

                if ($totalScheduled > 0) {
                    $indicators->push([
                        'date' => $date->toDateString(),
                        'total_scheduled' => $totalScheduled,
                        'total_taken' => $totalTaken,
                    ]);
                }
            }
        }

        return $indicators;
    }

    public function store(Collection $data): UserMedication
    {
        $medication = Medication::findOrFail($data->get('medication_id'));

        $userMedication = $this->userMedication->create([
            'medication_id' => $medication->id,
            'dosage' => $data->get('dosage'),
            'time_slots' => $data->get('time_slots'),
            'via_administration' => $data->get('via_administration'),
            'duration' => $data->get('duration'),
            'start_date' => $data->get('start_date'),
            'end_date' => $data->get('end_date'),
            'initial_stock' => $data->get('initial_stock'),
            'current_stock' => $data->get('current_stock'),
            'low_stock_threshold' => $data->get('low_stock_threshold'),
            'notes' => $data->get('notes'),
            'active' => true,
        ]);

        return $userMedication;
    }

    public function show(int $id): UserMedication
    {
        return $this->userMedication
            ->with(['medication', 'logs'])
            ->findOrFail($id);
    }

    public function update(Collection $data, int $id): UserMedication
    {
        $userMedication = $this->userMedication
            ->with(['medication', 'logs'])
            ->findOrFail($id);

        $userMedication->update($data->all());

        return $userMedication;
    }

    public function destroy(int $id): void
    {
        $userMedication = $this->userMedication
            ->with(['medication', 'logs'])
            ->findOrFail($id);

        $userMedication->update(['active' => false]);
    }
}

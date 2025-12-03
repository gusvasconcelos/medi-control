<?php

namespace App\Services\Medication;

use App\Models\Medication;
use App\Models\MedicationInteraction;
use App\Services\Medication\MedicationInteractionService;
use App\Packages\Filter\FilterQ;
use Illuminate\Support\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class MedicationService
{
    public function __construct(
        private Medication $medication,
    ) {
    }

    public function index(Collection $data): LengthAwarePaginator
    {
        return FilterQ::applyWithPagination($this->medication->query(), $data);
    }

    public function show(string|int $id): Medication
    {
        return $this->medication->findOrFail($id);
    }

    public function store(Collection $data): Medication
    {
        return $this->medication->create($data->toArray());
    }

    public function update(Collection $data, Medication $medication): Medication
    {
        $medication->update($data->toArray());

        return $medication;
    }

    public function destroy(Medication $medication): void
    {
        $medication->delete();
    }

    public function checkInteractions(Collection $data, Medication $medication): Collection
    {
        $medicationIds = $data->get('medications', []);

        /** @var Collection<int, MedicationInteraction> $existingInteractions */
        $existingInteractions = MedicationInteraction::with('owner', 'related')
            ->where('owner_id', $medication->id)
            ->whereIn('related_id', $medicationIds)
            ->get();

        $uncheckedMedicationIds = array_diff(
            $medicationIds,
            $existingInteractions->pluck('related_id')->toArray()
        );

        $newInteractions = collect();

        if (!empty($uncheckedMedicationIds)) {
            $newInteractions = MedicationInteractionService::check(
                $medication,
                collect($uncheckedMedicationIds)
            );
        }

        return $existingInteractions->merge($newInteractions);
    }
}

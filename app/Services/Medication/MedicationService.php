<?php

namespace App\Services\Medication;

use App\Models\Medication;
use App\Packages\Filter\FilterQ;
use Illuminate\Support\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class MedicationService
{
    public function __construct(
        private Medication $medication,
        private InteractionCheckerService $interactionChecker
    ) {
    }

    public function index(Collection $data): LengthAwarePaginator
    {
        return FilterQ::applyWithPagination($this->medication->query(), $data);
    }

    public function show(int $id): Medication
    {
        return $this->medication->findOrFail($id);
    }

    public function search(Collection $data): Collection
    {
        return $this->medication
            ->query()
            ->whereFullText('name', $data->get('search'))
            ->limit($data->get('limit', 10))
            ->get();
    }

    public function store(Collection $data): Medication
    {
        return $this->medication->create($data->toArray());
    }

    public function update(Collection $data, int $id): Medication
    {
        $medication = $this->medication->findOrFail($id);

        $medication->update($data->toArray());

        $medication->refresh();

        return $medication;
    }

    public function destroy(int $id): void
    {
        $this->medication->findOrFail($id)->delete();
    }

    /**
     * @param Collection<string, mixed> $data
     * @param int $mainMedicationId
     * @return array<string, array<int, array<string, mixed>>>
     */
    public function checkInteractions(Collection $data, int $mainMedicationId): array
    {
        $mainMedication = $this->medication->findOrFail($mainMedicationId);

        $requestedIds = collect($data->get('medications', []));
        $existingInteractions = collect($mainMedication->interactions ?? []);

        if ($existingInteractions->isNotEmpty()) {
            $alreadyCheckedIds = $existingInteractions->pluck('medication_id');

            $allChecked = $requestedIds->every(
                fn (int $id) => $alreadyCheckedIds->contains($id)
            );

            if ($allChecked) {
                $cachedResults = $existingInteractions
                    ->whereIn('medication_id', $requestedIds->toArray())
                    ->values();

                $medicationIds = $cachedResults->pluck('medication_id')->unique();
                $medications = $this->medication->whereIn('id', $medicationIds)->get()->keyBy('id');

                $enrichedResults = $cachedResults->map(function ($interaction) use ($medications) {
                    $medication = $medications->get($interaction['medication_id']);
                    return array_merge($interaction, [
                        'medication_name' => $medication->name ?? 'Unknown',
                    ]);
                });

                return ['interactions' => $enrichedResults->toArray()];
            }
        }

        $uncheckedMedicationIds = $this->interactionChecker->filterAlreadyChecked(
            $mainMedication,
            $requestedIds
        );

        if ($uncheckedMedicationIds->isEmpty()) {
            return ['interactions' => []];
        }

        $checkResult = $this->interactionChecker->checkInteractionsWithOpenAI(
            $mainMedication,
            $uncheckedMedicationIds
        );

        $this->interactionChecker->persistInteractionsBidirectionally(
            $mainMedication,
            $checkResult->interactions
        );

        return $this->interactionChecker->buildInteractionResponse($checkResult->interactions);
    }
}

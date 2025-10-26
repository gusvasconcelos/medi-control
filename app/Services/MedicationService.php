<?php

namespace App\Services;

use App\Models\Medication;
use Illuminate\Support\Collection;

class MedicationService
{
    public function __construct(
        protected Medication $medication
    ) {
        $this->medication = $medication;
    }

    public function search(Collection $data): Collection
    {
        return $this->medication
            ->query()
            ->whereFullText('name', $data->get('search'))
            ->limit($data->get('limit', 10))
            ->get();
    }
}

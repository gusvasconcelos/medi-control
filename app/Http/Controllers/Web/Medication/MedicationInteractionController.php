<?php

namespace App\Http\Controllers\Web\Medication;

use App\Models\Medication;
use Illuminate\Http\Request;
use App\Packages\Filter\FilterQ;
use App\Http\Controllers\Controller;
use Inertia\Response as InertiaResponse;
use App\Http\Requests\Medication\CheckInteractionsRequest;
use App\Services\Medication\MedicationInterationService;

class MedicationInteractionController extends Controller
{
    public function check(CheckInteractionsRequest $request, Medication $medication): InertiaResponse
    {
        $validated = $request->validated();

        $interactions = MedicationInterationService::execute($medication, collect($validated));

        $data = $request->all();

        return inertia()->render('Medications/Index', [
            'medications' => FilterQ::applyWithPagination(Medication::query(), collect($data)),
            'filters' => $request->only(['q', 'page', 'per_page']),
            'interactions' => [
                'interactions' => $interactions->toArray(),
            ],
        ]);
    }
}

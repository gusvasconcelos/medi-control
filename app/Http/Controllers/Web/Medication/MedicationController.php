<?php

namespace App\Http\Controllers\Web\Medication;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Medication;
use Illuminate\Http\Request;
use App\Packages\Filter\FilterQ;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\Medication\StoreMedicationRequest;
use App\Http\Requests\Medication\UpdateMedicationRequest;

class MedicationController extends Controller
{
    public function index(Request $request): Response
    {
        $data = $request->all();

        return Inertia::render('Medications/Index', [
            'medications' => FilterQ::applyWithPagination(Medication::query(), collect($data)),
            'filters' => $request->only(['q', 'page', 'per_page']),
        ]);
    }

    public function search(Request $request): Response
    {
        $data = $request->all();

        return inertia()->render('Medications/Index', [
            'searchResults' => FilterQ::applyWithPagination(Medication::query(), collect($data)),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Medications/Create');
    }

    public function store(StoreMedicationRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Medication::create($validated);

        return redirect()->route('medications.index')
            ->with('success', __('medications.medication.created'));
    }

    public function show(Medication $medication): Response
    {
        return Inertia::render('Medications/Show', [
            'medication' => $medication,
        ]);
    }

    public function edit(Medication $medication): Response
    {
        return Inertia::render('Medications/Edit', [
            'medication' => $medication,
        ]);
    }

    public function update(UpdateMedicationRequest $request, Medication $medication): RedirectResponse
    {
        $validated = $request->validated();

        $medication->update($validated);

        return redirect()->route('medications.index')
            ->with('success', __('medications.medication.updated'));
    }

    public function destroy(Medication $medication): RedirectResponse
    {
        $medication->delete();

        return redirect()->route('medications.index')
            ->with('success', __('medications.medication.deleted'));
    }
}

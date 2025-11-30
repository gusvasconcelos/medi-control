<?php

namespace App\Http\Controllers\Web\Medication;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use App\Http\Controllers\Controller;
use App\Services\Medication\MedicationService;
use App\Http\Requests\Medication\StoreMedicationRequest;
use App\Http\Requests\Medication\UpdateMedicationRequest;

class MedicationController extends Controller
{
    public function __construct(
        protected MedicationService $medicationService
    ) {
    }

    public function index(Request $request): Response
    {
        $data = $request->all();

        $medications = $this->medicationService->index(collect($data));

        return Inertia::render('Medications/Index', [
            'medications' => $medications,
            'filters' => $request->only(['q', 'page', 'per_page']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Medications/Create');
    }

    public function store(StoreMedicationRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $this->medicationService->store(collect($validated));

        return redirect()->route('medications.index')
            ->with('success', __('medications.medication.created'));
    }

    public function show(string|int $id): Response
    {
        $medication = $this->medicationService->show($id);

        return Inertia::render('Medications/Show', [
            'medication' => $medication,
        ]);
    }

    public function edit(int $id): Response
    {
        $medication = $this->medicationService->show($id);

        return Inertia::render('Medications/Edit', [
            'medication' => $medication,
        ]);
    }

    public function update(UpdateMedicationRequest $request, int $id): RedirectResponse
    {
        $validated = $request->validated();

        $this->medicationService->update(collect($validated), $id);

        return redirect()->route('medications.index')
            ->with('success', __('medications.medication.updated'));
    }

    public function destroy(int $id): RedirectResponse
    {
        $this->medicationService->destroy($id);

        return redirect()->route('medications.index')
            ->with('success', __('medications.medication.deleted'));
    }
}

<?php

namespace App\Http\Controllers\Web\Medication;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Medication;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
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

    public function index(Request $request): Response
    {
        $data = $request->all();

        $medications = $this->medicationService->index(collect($data));

        return Inertia::render('Medications/Index', [
            'medications' => $medications,
        ]);
    }

    public function show(Medication $medication): Response
    {
        return Inertia::render('Medications/Show', [
            'medication' => $medication,
        ]);
    }

    public function store(StoreMedicationRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $this->medicationService->store(collect($validated));

        return redirect()->back()->with('success', 'Medicamento criado com sucesso');
    }

    public function update(UpdateMedicationRequest $request, Medication $medication): RedirectResponse
    {
        $validated = $request->validated();

        $this->medicationService->update(collect($validated), $medication);

        return redirect()->back()->with('success', 'Medicamento atualizado com sucesso');
    }

    public function destroy(Medication $medication): RedirectResponse
    {
        $this->medicationService->destroy($medication);

        return redirect()->back()->with('success', 'Medicamento deletado com sucesso');
    }

    public function checkInteractions(CheckInteractionsRequest $request, Medication $medication): Response
    {
        $validated = $request->validated();

        $interactions = $this->medicationService->checkInteractions(collect($validated), $medication);

        return Inertia::render('Medications/CheckInteractions', [
            'interactions' => $interactions,
        ]);
    }
}

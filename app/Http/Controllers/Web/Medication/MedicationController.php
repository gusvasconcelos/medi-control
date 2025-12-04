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
use App\Http\Requests\Medication\ImportMedicationRequest;

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

    public function createImport(): Response
    {
        return Inertia::render('Medications/Import');
    }

    public function storeImport(ImportMedicationRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $file = $request->file('file');

        if (!$file) {
            return redirect()->back()->withErrors(['file' => 'Arquivo não encontrado']);
        }

        $uploadedPath = $file->storeAs('imports', $file->getClientOriginalName(), 'local');

        if (!$uploadedPath) {
            return redirect()->back()->withErrors(['file' => 'Erro ao fazer upload do arquivo']);
        }

        $fullPath = storage_path('app/' . $uploadedPath);

        $exitCode = \Artisan::call('medications:import', [
            'file' => $fullPath,
        ]);

        if ($exitCode !== 0) {
            return redirect()->back()->withErrors(['file' => 'Erro ao importar medicamentos']);
        }

        if (file_exists($fullPath)) {
            unlink($fullPath);
        }

        return redirect()->route('medications.index')->with('success', 'Medicamentos importados com sucesso');
    }
}

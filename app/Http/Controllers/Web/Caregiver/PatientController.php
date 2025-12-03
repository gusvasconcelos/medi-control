<?php

namespace App\Http\Controllers\Web\Caregiver;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Http\Controllers\Controller;
use App\Services\CaregiverActionService;
use App\Services\UserMedicationService;

class PatientController extends Controller
{
    public function __construct(
        protected CaregiverActionService $caregiverActionService,
        protected UserMedicationService $userMedicationService
    ) {
    }

    public function show(Request $request, int $patientId): Response
    {
        $caregiver = $request->user();

        $patientData = $this->caregiverActionService->getPatientDetailsForCaregiver(
            $caregiver->id,
            $patientId
        );

        // Busca medicamentos ativos do paciente com um range amplo de datas
        // para garantir que todos os medicamentos ativos sejam retornados
        // Mas filtra os logs apenas para o dia atual para calcular o status corretamente
        $medications = $this->userMedicationService->getUserMedications(collect([
            'user_id' => $patientId,
            'start_date' => Carbon::now()->subYear()->format('Y-m-d'),
            'end_date' => Carbon::now()->addYear()->format('Y-m-d'),
            'logs_date' => Carbon::today()->format('Y-m-d'),
        ]));

        return Inertia::render('Caregiver/PatientDetail', [
            'patient' => $patientData['patient'],
            'relationship' => $patientData['relationship'],
            'permissions' => $patientData['permissions'],
            'availableActions' => $patientData['availableActions'],
            'medications' => $medications,
        ]);
    }
}

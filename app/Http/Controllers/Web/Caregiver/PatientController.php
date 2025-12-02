<?php

namespace App\Http\Controllers\Web\Caregiver;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\CaregiverActionService;

class PatientController extends Controller
{
    public function __construct(
        protected CaregiverActionService $caregiverActionService
    ) {
    }

    public function show(Request $request, int $patientId): Response
    {
        $caregiver = $request->user();

        $patientData = $this->caregiverActionService->getPatientDetailsForCaregiver(
            $caregiver->id,
            $patientId
        );

        return Inertia::render('Caregiver/PatientDetail', [
            'patient' => $patientData['patient'],
            'relationship' => $patientData['relationship'],
            'permissions' => $patientData['permissions'],
            'availableActions' => $patientData['availableActions'],
        ]);
    }
}

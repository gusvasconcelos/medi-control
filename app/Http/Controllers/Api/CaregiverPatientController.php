<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CaregiverPatient\InviteCaregiverRequest;
use App\Http\Requests\CaregiverPatient\UpdatePermissionsRequest;
use App\Services\CaregiverPatientService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CaregiverPatientController extends Controller
{
    public function __construct(
        protected CaregiverPatientService $caregiverPatientService
    ) {
    }

    public function myCaregivers(Request $request): JsonResponse
    {
        $user = $request->user();
        $caregivers = $this->caregiverPatientService->getCaregiversForPatient(
            $user->id,
            collect($request->all())
        );

        return response()->json($caregivers);
    }

    public function myPatients(Request $request): JsonResponse
    {
        $user = $request->user();
        $patients = $this->caregiverPatientService->getPatientsForCaregiver(
            $user->id,
            collect($request->all())
        );

        return response()->json($patients);
    }

    public function pendingInvitations(Request $request): JsonResponse
    {
        $user = $request->user();
        $invitations = $this->caregiverPatientService->getPendingInvitationsForCaregiver($user->id);

        return response()->json(['data' => $invitations]);
    }

    public function inviteCaregiver(InviteCaregiverRequest $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        $caregiverPatient = $this->caregiverPatientService->inviteCaregiver(
            $user,
            $validated['email'],
            $validated['permissions'] ?? []
        );

        return response()->json([
            'message' => __('caregiver.invitation_sent'),
            'data' => $caregiverPatient,
        ], 201);
    }

    public function acceptInvitation(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $caregiverPatient = $this->caregiverPatientService->acceptInvitation($id, $user->id);

        return response()->json([
            'message' => __('caregiver.invitation_accepted'),
            'data' => $caregiverPatient,
        ]);
    }

    public function rejectInvitation(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $this->caregiverPatientService->rejectInvitation($id, $user->id);

        return response()->json([
            'message' => __('caregiver.invitation_rejected'),
        ]);
    }

    public function cancelInvitation(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $this->caregiverPatientService->cancelInvitation($id, $user->id);

        return response()->json([
            'message' => __('caregiver.invitation_cancelled'),
        ]);
    }

    public function revokeAccess(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $this->caregiverPatientService->revokeAccess($id, $user->id);

        return response()->json([
            'message' => __('caregiver.access_revoked'),
        ]);
    }

    public function updatePermissions(UpdatePermissionsRequest $request, int $id): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        $caregiverPatient = $this->caregiverPatientService->updatePermissions(
            $id,
            $user->id,
            $validated['permissions']
        );

        return response()->json([
            'message' => __('caregiver.permissions_updated'),
            'data' => $caregiverPatient,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $caregiverPatient = $this->caregiverPatientService->show($id);

        return response()->json(['data' => $caregiverPatient]);
    }

    public function caregiverPermissions(): JsonResponse
    {
        $permissions = $this->caregiverPatientService->getCaregiverPermissionsGrouped();

        return response()->json(['data' => $permissions]);
    }
}

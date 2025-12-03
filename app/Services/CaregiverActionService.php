<?php

namespace App\Services;

use App\Models\CaregiverPatient;
use Illuminate\Support\Collection;
use App\Exceptions\UnauthorizedException;

class CaregiverActionService
{
    public function __construct(
        protected CaregiverPatient $caregiverPatient,
    ) {
    }

    public function getPatientDetailsForCaregiver(int $caregiverId, int $patientId): array
    {
        $relationship = $this->getActiveRelationship($caregiverId, $patientId);

        $patient = $relationship->patient()
            ->with(['roles'])
            ->first();

        if (!$patient) {
            throw new UnauthorizedException(
                'Patient not found',
                'PATIENT_NOT_FOUND'
            );
        }

        $permissions = $this->getCaregiverPermissionsForPatient($caregiverId, $patientId);
        $availableActions = $this->mapPermissionsToActions($permissions);

        return [
            'patient' => $patient,
            'relationship' => $relationship,
            'permissions' => $permissions,
            'availableActions' => $availableActions,
        ];
    }

    public function getCaregiverPermissionsForPatient(int $caregiverId, int $patientId): Collection
    {
        $relationship = $this->getActiveRelationship($caregiverId, $patientId);

        return $relationship->permissions;
    }

    public function hasPermission(int $caregiverId, int $patientId, string $permission): bool
    {
        $relationship = $this->caregiverPatient
            ->forCaregiver($caregiverId)
            ->forPatient($patientId)
            ->active()
            ->first();

        if (!$relationship) {
            return false;
        }

        return $relationship->permissions()
            ->where('name', $permission)
            ->exists();
    }

    public function verifyPermission(int $caregiverId, int $patientId, string $permission): void
    {
        if (!$this->hasPermission($caregiverId, $patientId, $permission)) {
            throw new UnauthorizedException(
                'You do not have permission to perform this action',
                'INSUFFICIENT_PERMISSIONS'
            );
        }
    }

    /**
     * @param Collection<int, \Spatie\Permission\Models\Permission> $permissions
     * @return array<string, array<string, mixed>>
     */
    private function mapPermissionsToActions(Collection $permissions): array
    {
        $actions = [
            'medications' => [
                'canView' => false,
                'canCreate' => false,
                'canEdit' => false,
                'canDelete' => false,
            ],
            'adherence' => [
                'canView' => false,
                'canMark' => false,
            ],
            'profile' => [
                'canView' => false,
            ],
        ];

        $permissionNames = $permissions->pluck('name')->toArray();

        // Map medication permissions
        $actions['medications']['canView'] = in_array('patient.medications.view', $permissionNames);
        $actions['medications']['canCreate'] = in_array('patient.medications.create', $permissionNames);
        $actions['medications']['canEdit'] = in_array('patient.medications.edit', $permissionNames);
        $actions['medications']['canDelete'] = in_array('patient.medications.delete', $permissionNames);

        // Map adherence permissions
        $actions['adherence']['canView'] = in_array('patient.adherence.view', $permissionNames);
        $actions['adherence']['canMark'] = in_array('patient.adherence.mark', $permissionNames);

        // Map profile permissions
        $actions['profile']['canView'] = in_array('patient.profile.view', $permissionNames);

        return $actions;
    }

    private function getActiveRelationship(int $caregiverId, int $patientId): CaregiverPatient
    {
        $relationship = $this->caregiverPatient
            ->with(['patient', 'permissions'])
            ->forCaregiver($caregiverId)
            ->forPatient($patientId)
            ->active()
            ->first();

        if (!$relationship) {
            throw new UnauthorizedException(
                'You do not have an active relationship with this patient',
                'NO_ACTIVE_RELATIONSHIP'
            );
        }

        return $relationship;
    }
}

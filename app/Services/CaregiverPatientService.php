<?php

namespace App\Services;

use App\Models\User;
use App\Models\CaregiverPatient;
use App\Packages\Filter\FilterQ;
use Illuminate\Support\Collection;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Notification;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Exceptions\UnprocessableEntityException;
use App\Notifications\CaregiverInvitationNotification;

class CaregiverPatientService
{
    public function __construct(
        protected CaregiverPatient $caregiverPatient,
        protected User $user,
    ) {
    }

    public function getCaregiversForPatient(int $patientId, Collection $data): LengthAwarePaginator|Collection
    {
        $query = $this->caregiverPatient
            ->with(['caregiver', 'permissions'])
            ->forPatient($patientId)
            ->orderByDesc('created_at');

        if ($data->has('all') && $data->get('all') === 'true') {
            return $query->get();
        }

        return FilterQ::applyWithPagination($query, $data);
    }

    public function getPatientsForCaregiver(int $caregiverId, Collection $data): LengthAwarePaginator|Collection
    {
        $query = $this->caregiverPatient
            ->with(['patient', 'permissions'])
            ->forCaregiver($caregiverId)
            ->orderByDesc('created_at');

        if ($data->has('all') && $data->get('all') === 'true') {
            return $query->get();
        }

        return FilterQ::applyWithPagination($query, $data);
    }

    public function getPendingInvitationsForCaregiver(int $caregiverId): Collection
    {
        return $this->caregiverPatient
            ->with(['patient', 'permissions'])
            ->forCaregiver($caregiverId)
            ->pending()
            ->orderByDesc('invited_at')
            ->get();
    }

    public function inviteCaregiver(User $patient, string $caregiverEmail, array $permissionIds): CaregiverPatient
    {
        $caregiver = $this->user->where('email', $caregiverEmail)->first();

        if ($caregiver && $caregiver->id === $patient->id) {
            throw new UnprocessableEntityException(
                __('caregiver.cannot_invite_self'),
                'CANNOT_INVITE_SELF'
            );
        }

        if ($caregiver) {
            $existingRelationship = $this->caregiverPatient
                ->forPatient($patient->id)
                ->forCaregiver($caregiver->id)
                ->whereIn('status', [CaregiverPatient::STATUS_PENDING, CaregiverPatient::STATUS_ACTIVE])
                ->first();

            if ($existingRelationship) {
                throw new UnprocessableEntityException(
                    __('caregiver.already_invited'),
                    'ALREADY_INVITED'
                );
            }
        }

        $caregiverPatient = $this->caregiverPatient->create([
            'patient_id' => $patient->id,
            'caregiver_id' => $caregiver?->id,
            'status' => CaregiverPatient::STATUS_PENDING,
            'invited_at' => now(),
        ]);

        if (!empty($permissionIds)) {
            $caregiverPatient->syncCaregiverPermissions($permissionIds);
        }

        $this->sendInvitationNotification($patient, $caregiverEmail, $caregiver);

        return $caregiverPatient->load(['caregiver', 'permissions']);
    }

    public function acceptInvitation(int $invitationId, int $caregiverId): CaregiverPatient
    {
        $invitation = $this->caregiverPatient
            ->where('id', $invitationId)
            ->forCaregiver($caregiverId)
            ->pending()
            ->firstOrFail();

        $invitation->accept();

        return $invitation->load(['patient', 'permissions']);
    }

    public function rejectInvitation(int $invitationId, int $caregiverId): void
    {
        $invitation = $this->caregiverPatient
            ->where('id', $invitationId)
            ->forCaregiver($caregiverId)
            ->pending()
            ->firstOrFail();

        $invitation->delete();
    }

    public function cancelInvitation(int $invitationId, int $patientId): void
    {
        $invitation = $this->caregiverPatient
            ->where('id', $invitationId)
            ->forPatient($patientId)
            ->pending()
            ->firstOrFail();

        $invitation->delete();
    }

    public function revokeAccess(int $relationshipId, int $patientId): void
    {
        $relationship = $this->caregiverPatient
            ->where('id', $relationshipId)
            ->forPatient($patientId)
            ->active()
            ->firstOrFail();

        $relationship->revoke();
    }

    public function updatePermissions(int $relationshipId, int $patientId, array $permissionIds): CaregiverPatient
    {
        $relationship = $this->caregiverPatient
            ->where('id', $relationshipId)
            ->forPatient($patientId)
            ->active()
            ->firstOrFail();

        $relationship->syncCaregiverPermissions($permissionIds);

        return $relationship->load(['caregiver', 'permissions']);
    }

    public function show(int $id): CaregiverPatient
    {
        return $this->caregiverPatient
            ->with(['caregiver', 'patient', 'permissions'])
            ->findOrFail($id);
    }

    public function getCaregiverPermissionsGrouped(): Collection
    {
        return Permission::query()
            ->where('group', 'caregiver')
            ->orderBy('name')
            ->get();
    }

    private function sendInvitationNotification(User $patient, string $email, ?User $caregiver): void
    {
        if ($caregiver) {
            $caregiver->notify(new CaregiverInvitationNotification($patient));
        } else {
            Notification::route('mail', $email)
                ->notify(new CaregiverInvitationNotification($patient));
        }
    }
}

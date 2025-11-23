<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\CaregiverPatient;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class CaregiverPatientControllerTest extends TestCase
{
    use DatabaseTransactions;

    protected string $url = '/api/v1';

    private function createPatientUser(): User
    {
        $user = User::factory()->create();
        $patientRole = Role::firstOrCreate(['name' => 'patient', 'guard_name' => 'web']);
        $user->assignRole($patientRole);
        return $user;
    }

    private function createCaregiverUser(): User
    {
        $user = User::factory()->create();
        $caregiverRole = Role::firstOrCreate(['name' => 'caregiver', 'guard_name' => 'web']);
        $user->assignRole($caregiverRole);
        return $user;
    }

    private function createCaregiverPermission(): Permission
    {
        return Permission::firstOrCreate([
            'name' => 'view-medications',
            'display_name' => 'Ver Medicamentos',
            'group' => 'caregiver',
            'guard_name' => 'web',
        ]);
    }

    public function test_patient_lists_caregivers(): void
    {
        $patient = $this->createPatientUser();
        $caregiver = $this->createCaregiverUser();

        CaregiverPatient::create([
            'patient_id' => $patient->id,
            'caregiver_id' => $caregiver->id,
            'status' => 'active',
            'invited_at' => now(),
            'accepted_at' => now(),
        ]);

        $response = $this->actingAsUser($patient)->getJson("$this->url/my-caregivers");

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'caregiver_id',
                        'patient_id',
                        'status',
                    ],
                ],
            ]);
    }

    public function test_caregiver_lists_patients(): void
    {
        $patient = $this->createPatientUser();
        $caregiver = $this->createCaregiverUser();

        CaregiverPatient::create([
            'patient_id' => $patient->id,
            'caregiver_id' => $caregiver->id,
            'status' => 'active',
            'invited_at' => now(),
            'accepted_at' => now(),
        ]);

        $response = $this->actingAsUser($caregiver)->getJson("$this->url/my-patients");

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'caregiver_id',
                        'patient_id',
                        'status',
                    ],
                ],
            ]);
    }

    public function test_patient_invites_caregiver_successfully(): void
    {
        $patient = $this->createPatientUser();
        $caregiver = $this->createCaregiverUser();
        $permission = $this->createCaregiverPermission();

        $response = $this->actingAsUser($patient)->postJson("$this->url/my-caregivers/invite", [
            'email' => $caregiver->email,
            'permissions' => [$permission->id],
        ]);

        $response
            ->assertStatus(201)
            ->assertJson([
                'message' => __('caregiver.invitation_sent'),
            ]);

        $this->assertDatabaseHas('caregiver_patient', [
            'patient_id' => $patient->id,
            'caregiver_id' => $caregiver->id,
            'status' => 'pending',
        ]);
    }

    public function test_patient_cannot_invite_self(): void
    {
        $patient = $this->createPatientUser();

        $response = $this->actingAsUser($patient)->postJson("$this->url/my-caregivers/invite", [
            'email' => $patient->email,
        ]);

        $response
            ->assertStatus(422)
            ->assertJson([
                'code' => 'CANNOT_INVITE_SELF',
            ]);
    }

    public function test_patient_cannot_invite_already_invited_caregiver(): void
    {
        $patient = $this->createPatientUser();
        $caregiver = $this->createCaregiverUser();

        CaregiverPatient::create([
            'patient_id' => $patient->id,
            'caregiver_id' => $caregiver->id,
            'status' => 'pending',
            'invited_at' => now(),
        ]);

        $response = $this->actingAsUser($patient)->postJson("$this->url/my-caregivers/invite", [
            'email' => $caregiver->email,
        ]);

        $response
            ->assertStatus(422)
            ->assertJson([
                'code' => 'ALREADY_INVITED',
            ]);
    }

    public function test_caregiver_accepts_invitation(): void
    {
        $patient = $this->createPatientUser();
        $caregiver = $this->createCaregiverUser();

        $invitation = CaregiverPatient::create([
            'patient_id' => $patient->id,
            'caregiver_id' => $caregiver->id,
            'status' => 'pending',
            'invited_at' => now(),
        ]);

        $response = $this->actingAsUser($caregiver)->postJson("$this->url/my-patients/{$invitation->id}/accept");

        $response
            ->assertStatus(200)
            ->assertJson([
                'message' => __('caregiver.invitation_accepted'),
            ]);

        $this->assertDatabaseHas('caregiver_patient', [
            'id' => $invitation->id,
            'status' => 'active',
        ]);
    }

    public function test_caregiver_rejects_invitation(): void
    {
        $patient = $this->createPatientUser();
        $caregiver = $this->createCaregiverUser();

        $invitation = CaregiverPatient::create([
            'patient_id' => $patient->id,
            'caregiver_id' => $caregiver->id,
            'status' => 'pending',
            'invited_at' => now(),
        ]);

        $response = $this->actingAsUser($caregiver)->deleteJson("$this->url/my-patients/{$invitation->id}/reject");

        $response
            ->assertStatus(200)
            ->assertJson([
                'message' => __('caregiver.invitation_rejected'),
            ]);

        $this->assertDatabaseMissing('caregiver_patient', [
            'id' => $invitation->id,
        ]);
    }

    public function test_patient_revokes_caregiver_access(): void
    {
        $patient = $this->createPatientUser();
        $caregiver = $this->createCaregiverUser();

        $relationship = CaregiverPatient::create([
            'patient_id' => $patient->id,
            'caregiver_id' => $caregiver->id,
            'status' => 'active',
            'invited_at' => now(),
            'accepted_at' => now(),
        ]);

        $response = $this->actingAsUser($patient)->deleteJson("$this->url/my-caregivers/{$relationship->id}/revoke");

        $response
            ->assertStatus(200)
            ->assertJson([
                'message' => __('caregiver.access_revoked'),
            ]);

        $this->assertDatabaseHas('caregiver_patient', [
            'id' => $relationship->id,
            'status' => 'revoked',
        ]);
    }

    public function test_patient_updates_caregiver_permissions(): void
    {
        $patient = $this->createPatientUser();
        $caregiver = $this->createCaregiverUser();
        $permission = $this->createCaregiverPermission();

        $relationship = CaregiverPatient::create([
            'patient_id' => $patient->id,
            'caregiver_id' => $caregiver->id,
            'status' => 'active',
            'invited_at' => now(),
            'accepted_at' => now(),
        ]);

        $response = $this->actingAsUser($patient)->putJson(
            "$this->url/my-caregivers/{$relationship->id}/permissions",
            ['permissions' => [$permission->id]]
        );

        $response
            ->assertStatus(200)
            ->assertJson([
                'message' => __('caregiver.permissions_updated'),
            ]);

        $this->assertDatabaseHas('caregiver_permissions', [
            'caregiver_patient_id' => $relationship->id,
            'permission_id' => $permission->id,
        ]);
    }

    public function test_caregiver_lists_pending_invitations(): void
    {
        $patient = $this->createPatientUser();
        $caregiver = $this->createCaregiverUser();

        CaregiverPatient::create([
            'patient_id' => $patient->id,
            'caregiver_id' => $caregiver->id,
            'status' => 'pending',
            'invited_at' => now(),
        ]);

        $response = $this->actingAsUser($caregiver)->getJson("$this->url/my-patients/pending");

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'patient_id',
                        'status',
                    ],
                ],
            ]);

        $this->assertCount(1, $response->json('data'));
    }

    public function test_requires_authentication(): void
    {
        $response = $this->getJson("$this->url/my-caregivers");

        $response->assertStatus(401);
    }
}

<?php

namespace Tests\Feature\Services;

use Tests\TestCase;
use App\Models\User;
use App\Models\CaregiverPatient;
use App\Services\CaregiverActionService;
use App\Exceptions\UnauthorizedException;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CaregiverActionServiceTest extends TestCase
{
    use RefreshDatabase;

    protected CaregiverActionService $caregiverActionService;

    protected User $caregiver;

    protected User $patient;

    protected CaregiverPatient $relationship;

    protected function setUp(): void
    {
        parent::setUp();

        $this->caregiverActionService = app(CaregiverActionService::class);

        $this->caregiver = User::factory()->create();
        $this->patient = User::factory()->create();

        $this->relationship = CaregiverPatient::create([
            'caregiver_id' => $this->caregiver->id,
            'patient_id' => $this->patient->id,
            'status' => CaregiverPatient::STATUS_ACTIVE,
            'invited_at' => now(),
            'accepted_at' => now(),
        ]);
    }

    public function test_gets_patient_details_for_caregiver(): void
    {
        $permission = Permission::create([
            'name' => 'patient.medications.view',
            'display_name' => 'View Medications',
            'group' => 'caregiver',
            'guard_name' => 'web',
        ]);

        $this->relationship->permissions()->attach($permission->id);

        $result = $this->caregiverActionService->getPatientDetailsForCaregiver(
            $this->caregiver->id,
            $this->patient->id
        );

        $this->assertArrayHasKey('patient', $result);
        $this->assertArrayHasKey('relationship', $result);
        $this->assertArrayHasKey('permissions', $result);
        $this->assertArrayHasKey('availableActions', $result);

        $this->assertEquals($this->patient->id, $result['patient']->id);
        $this->assertEquals($this->relationship->id, $result['relationship']->id);
        $this->assertCount(1, $result['permissions']);
        $this->assertTrue($result['availableActions']['medications']['canView']);
    }

    public function test_throws_exception_when_no_active_relationship(): void
    {
        $otherPatient = User::factory()->create();

        $this->expectException(UnauthorizedException::class);
        $this->expectExceptionMessage('You do not have an active relationship with this patient');

        $this->caregiverActionService->getPatientDetailsForCaregiver(
            $this->caregiver->id,
            $otherPatient->id
        );
    }

    public function test_gets_caregiver_permissions_for_patient(): void
    {
        $permission1 = Permission::create([
            'name' => 'patient.medications.view',
            'display_name' => 'View Medications',
            'group' => 'caregiver',
            'guard_name' => 'web',
        ]);

        $permission2 = Permission::create([
            'name' => 'patient.adherence.view',
            'display_name' => 'View Adherence',
            'group' => 'caregiver',
            'guard_name' => 'web',
        ]);

        $this->relationship->permissions()->attach([$permission1->id, $permission2->id]);

        $permissions = $this->caregiverActionService->getCaregiverPermissionsForPatient(
            $this->caregiver->id,
            $this->patient->id
        );

        $this->assertCount(2, $permissions);
    }

    public function test_checks_if_caregiver_has_permission(): void
    {
        $permission = Permission::create([
            'name' => 'patient.medications.view',
            'display_name' => 'View Medications',
            'group' => 'caregiver',
            'guard_name' => 'web',
        ]);

        $this->relationship->permissions()->attach($permission->id);

        $hasPermission = $this->caregiverActionService->hasPermission(
            $this->caregiver->id,
            $this->patient->id,
            'patient.medications.view'
        );

        $this->assertTrue($hasPermission);

        $hasOtherPermission = $this->caregiverActionService->hasPermission(
            $this->caregiver->id,
            $this->patient->id,
            'patient.medications.create'
        );

        $this->assertFalse($hasOtherPermission);
    }

    public function test_returns_false_when_no_relationship_exists(): void
    {
        $otherPatient = User::factory()->create();

        $hasPermission = $this->caregiverActionService->hasPermission(
            $this->caregiver->id,
            $otherPatient->id,
            'patient.medications.view'
        );

        $this->assertFalse($hasPermission);
    }

    public function test_verifies_permission_successfully(): void
    {
        $permission = Permission::create([
            'name' => 'patient.medications.view',
            'display_name' => 'View Medications',
            'group' => 'caregiver',
            'guard_name' => 'web',
        ]);

        $this->relationship->permissions()->attach($permission->id);

        $this->caregiverActionService->verifyPermission(
            $this->caregiver->id,
            $this->patient->id,
            'patient.medications.view'
        );

        $this->assertTrue(true);
    }

    public function test_throws_exception_when_permission_not_granted(): void
    {
        $this->expectException(UnauthorizedException::class);
        $this->expectExceptionMessage('You do not have permission to perform this action');

        $this->caregiverActionService->verifyPermission(
            $this->caregiver->id,
            $this->patient->id,
            'patient.medications.create'
        );
    }

    public function test_maps_all_medication_permissions_correctly(): void
    {
        $permissions = [
            Permission::create([
                'name' => 'patient.medications.view',
                'display_name' => 'View Medications',
                'group' => 'caregiver',
                'guard_name' => 'web',
            ]),
            Permission::create([
                'name' => 'patient.medications.create',
                'display_name' => 'Create Medications',
                'group' => 'caregiver',
                'guard_name' => 'web',
            ]),
            Permission::create([
                'name' => 'patient.medications.edit',
                'display_name' => 'Edit Medications',
                'group' => 'caregiver',
                'guard_name' => 'web',
            ]),
            Permission::create([
                'name' => 'patient.medications.delete',
                'display_name' => 'Delete Medications',
                'group' => 'caregiver',
                'guard_name' => 'web',
            ]),
        ];

        $this->relationship->permissions()->attach(array_map(fn ($p) => $p->id, $permissions));

        $result = $this->caregiverActionService->getPatientDetailsForCaregiver(
            $this->caregiver->id,
            $this->patient->id
        );

        $this->assertTrue($result['availableActions']['medications']['canView']);
        $this->assertTrue($result['availableActions']['medications']['canCreate']);
        $this->assertTrue($result['availableActions']['medications']['canEdit']);
        $this->assertTrue($result['availableActions']['medications']['canDelete']);
    }

    public function test_maps_adherence_permissions_correctly(): void
    {
        $permissions = [
            Permission::create([
                'name' => 'patient.adherence.view',
                'display_name' => 'View Adherence',
                'group' => 'caregiver',
                'guard_name' => 'web',
            ]),
            Permission::create([
                'name' => 'patient.adherence.mark',
                'display_name' => 'Mark Adherence',
                'group' => 'caregiver',
                'guard_name' => 'web',
            ]),
        ];

        $this->relationship->permissions()->attach(array_map(fn ($p) => $p->id, $permissions));

        $result = $this->caregiverActionService->getPatientDetailsForCaregiver(
            $this->caregiver->id,
            $this->patient->id
        );

        $this->assertTrue($result['availableActions']['adherence']['canView']);
        $this->assertTrue($result['availableActions']['adherence']['canMark']);
    }

    public function test_maps_profile_permission_correctly(): void
    {
        $permission = Permission::create([
            'name' => 'patient.profile.view',
            'display_name' => 'View Profile',
            'group' => 'caregiver',
            'guard_name' => 'web',
        ]);

        $this->relationship->permissions()->attach($permission->id);

        $result = $this->caregiverActionService->getPatientDetailsForCaregiver(
            $this->caregiver->id,
            $this->patient->id
        );

        $this->assertTrue($result['availableActions']['profile']['canView']);
    }

    public function test_does_not_work_with_pending_relationship(): void
    {
        $this->relationship->update([
            'status' => CaregiverPatient::STATUS_PENDING,
            'accepted_at' => null,
        ]);

        $this->expectException(UnauthorizedException::class);

        $this->caregiverActionService->getPatientDetailsForCaregiver(
            $this->caregiver->id,
            $this->patient->id
        );
    }

    public function test_does_not_work_with_revoked_relationship(): void
    {
        $this->relationship->update([
            'status' => CaregiverPatient::STATUS_REVOKED,
            'revoked_at' => now(),
        ]);

        $this->expectException(UnauthorizedException::class);

        $this->caregiverActionService->getPatientDetailsForCaregiver(
            $this->caregiver->id,
            $this->patient->id
        );
    }
}

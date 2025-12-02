<?php

namespace Tests\Feature\Http\Controllers\Web\Caregiver;

use Tests\TestCase;
use App\Models\User;
use App\Models\CaregiverPatient;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PatientControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $caregiver;

    protected User $patient;

    protected CaregiverPatient $relationship;

    protected function setUp(): void
    {
        parent::setUp();

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

    public function test_shows_patient_detail_page(): void
    {
        $permission = Permission::create([
            'name' => 'patient.medications.view',
            'display_name' => 'View Medications',
            'group' => 'caregiver',
            'guard_name' => 'web',
        ]);

        $this->relationship->permissions()->attach($permission->id);

        $response = $this->actingAs($this->caregiver)
            ->get(route('patients.show', ['patientId' => $this->patient->id]));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
            ->component('Caregiver/PatientDetail')
            ->has('patient')
            ->has('relationship')
            ->has('permissions')
            ->has('availableActions')
            ->where('patient.id', $this->patient->id)
            ->where('relationship.id', $this->relationship->id)
        );
    }

    public function test_returns_unauthorized_when_no_relationship(): void
    {
        $otherPatient = User::factory()->create();

        $response = $this->actingAs($this->caregiver)
            ->get(route('patients.show', ['patientId' => $otherPatient->id]));

        $response->assertStatus(401);
    }

    public function test_returns_unauthorized_for_pending_relationship(): void
    {
        $this->relationship->update([
            'status' => CaregiverPatient::STATUS_PENDING,
            'accepted_at' => null,
        ]);

        $response = $this->actingAs($this->caregiver)
            ->get(route('patients.show', ['patientId' => $this->patient->id]));

        $response->assertStatus(401);
    }

    public function test_returns_unauthorized_for_revoked_relationship(): void
    {
        $this->relationship->update([
            'status' => CaregiverPatient::STATUS_REVOKED,
            'revoked_at' => now(),
        ]);

        $response = $this->actingAs($this->caregiver)
            ->get(route('patients.show', ['patientId' => $this->patient->id]));

        $response->assertStatus(401);
    }

    public function test_includes_all_permissions_in_response(): void
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
                'name' => 'patient.adherence.view',
                'display_name' => 'View Adherence',
                'group' => 'caregiver',
                'guard_name' => 'web',
            ]),
        ];

        $this->relationship->permissions()->attach(array_map(fn ($p) => $p->id, $permissions));

        $response = $this->actingAs($this->caregiver)
            ->get(route('patients.show', ['patientId' => $this->patient->id]));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
            ->component('Caregiver/PatientDetail')
            ->has('permissions', 3)
            ->where('availableActions.medications.canView', true)
            ->where('availableActions.medications.canCreate', true)
            ->where('availableActions.adherence.canView', true)
        );
    }

    public function test_includes_available_actions_structure(): void
    {
        $response = $this->actingAs($this->caregiver)
            ->get(route('patients.show', ['patientId' => $this->patient->id]));

        $response->assertOk();
        $response->assertInertia(
            fn ($page) => $page
            ->component('Caregiver/PatientDetail')
            ->has('availableActions.medications')
            ->has('availableActions.adherence')
            ->has('availableActions.profile')
            ->where('availableActions.medications.canView', false)
            ->where('availableActions.medications.canCreate', false)
            ->where('availableActions.medications.canEdit', false)
            ->where('availableActions.medications.canDelete', false)
            ->where('availableActions.adherence.canView', false)
            ->where('availableActions.adherence.canMark', false)
            ->where('availableActions.profile.canView', false)
        );
    }

    public function test_requires_authentication(): void
    {
        $response = $this->get(route('patients.show', ['patientId' => $this->patient->id]));

        $response->assertRedirect(route('login'));
    }
}

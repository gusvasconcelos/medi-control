<?php

namespace Tests\Feature\Http\Controllers\Web;

use Tests\TestCase;
use App\Models\User;
use App\Models\Medication;
use App\Models\MedicationInteraction;
use Inertia\Testing\AssertableInertia as Assert;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class MedicationControllerTest extends TestCase
{
    use DatabaseTransactions;

    protected string $url = '/medications';

    public function test_index_displays_medications_page_with_pagination(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAsUser($user)->get($this->url);

        $response
            ->assertStatus(200)
            ->assertInertia(
                fn (Assert $page) => $page
                    ->component('Medications/Index')
                    ->has('medications')
                    ->has('medications.data', 15)
                    ->has('medications.current_page')
                    ->has('medications.last_page')
                    ->has('medications.total')
                    ->where('medications.total', Medication::count())
            );
    }

    public function test_index_filters_medications_by_search_query(): void
    {
        $user = User::factory()->create();

        Medication::factory()->create(['name' => 'Paracetamol']);
        Medication::factory()->create(['name' => 'Ibuprofeno']);

        $response = $this->actingAsUser($user)->get($this->url . '?q=' . urlencode(json_encode(['text' => 'Para'])));

        $response
            ->assertStatus(200)
            ->assertInertia(
                fn (Assert $page) => $page
                    ->component('Medications/Index')
                    ->where('medications.total', 1)
                    ->where('medications.data.0.name', 'Paracetamol')
            );
    }

    public function test_show_returns_medication_as_json(): void
    {
        $user = User::factory()->create();

        $medication = Medication::factory()->create();

        $response = $this->actingAsUser($user)->get("{$this->url}/{$medication->id}");

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'name',
                    'active_principle',
                    'manufacturer',
                    'category',
                    'registration_number',
                    'form',
                ],
            ])
            ->assertJsonFragment([
                'id' => $medication->id,
                'name' => $medication->name,
            ]);
    }

    public function test_store_creates_medication_and_redirects_back(): void
    {
        $user = User::factory()->create();

        $medicationData = [
            'name' => 'Test Medication',
            'active_principle' => 'Test Active Principle',
            'manufacturer' => 'Test Manufacturer',
            'category' => 'Test Category',
            'registration_number' => 'REG123456',
            'form' => 'tablet',
            'strength' => '500mg',
            'description' => 'Test description',
        ];

        $response = $this->actingAsUser($user)->post($this->url, $medicationData);

        $response
            ->assertRedirect()
            ->assertSessionHas('success', 'Medicamento criado com sucesso');

        $this->assertDatabaseHas('medications', [
            'name' => 'Test Medication',
            'registration_number' => 'REG123456',
        ]);
    }

    public function test_store_validates_required_fields(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAsUser($user)->post($this->url, []);

        $response
            ->assertSessionHasErrors([
                'name',
                'active_principle',
                'manufacturer',
                'category',
                'registration_number',
                'form',
            ]);
    }

    public function test_store_validates_unique_registration_number(): void
    {
        $user = User::factory()->create();

        $existing = Medication::factory()->create(['registration_number' => 'REG123']);

        $medicationData = Medication::factory()->make([
            'registration_number' => 'REG123',
        ])->toArray();

        $response = $this->actingAsUser($user)->post($this->url, $medicationData);

        $response->assertSessionHasErrors(['registration_number']);
    }

    public function test_update_modifies_medication_and_redirects_back(): void
    {
        $user = User::factory()->create();

        $medication = Medication::factory()->create();

        $updatedData = [
            'name' => 'Updated Medication',
            'active_principle' => $medication->active_principle,
            'manufacturer' => $medication->manufacturer,
            'category' => $medication->category,
            'registration_number' => $medication->registration_number,
            'form' => $medication->form,
        ];

        $response = $this->actingAsUser($user)->put("{$this->url}/{$medication->id}", $updatedData);

        $response
            ->assertRedirect()
            ->assertSessionHas('success', 'Medicamento atualizado com sucesso');

        $this->assertDatabaseHas('medications', [
            'id' => $medication->id,
            'name' => 'Updated Medication',
        ]);
    }

    public function test_destroy_deletes_medication_and_redirects_back(): void
    {
        $user = User::factory()->create();

        $medication = Medication::factory()->create();

        $response = $this->actingAsUser($user)->delete("{$this->url}/{$medication->id}");

        $response
            ->assertRedirect()
            ->assertSessionHas('success', 'Medicamento deletado com sucesso');

        $this->assertDatabaseMissing('medications', [
            'id' => $medication->id,
        ]);
    }

    public function test_check_interactions_returns_existing_interactions_from_database(): void
    {
        $user = User::factory()->create();

        $medication1 = Medication::factory()->create();
        $medication2 = Medication::factory()->create();

        MedicationInteraction::factory()->create([
            'owner_id' => $medication1->id,
            'related_id' => $medication2->id,
            'severity' => 'moderate',
        ]);

        $response = $this->actingAsUser($user)->post(
            "{$this->url}/{$medication1->id}/check-interactions",
            ['medications' => [$medication2->id]]
        );

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'owner_id',
                        'related_id',
                        'severity',
                        'description',
                        'recommendation',
                        'owner',
                        'related',
                    ],
                ],
            ])
            ->assertJsonFragment([
                'severity' => 'moderate',
            ]);
    }

    public function test_check_interactions_validates_max_10_medications(): void
    {
        $user = User::factory()->create();

        $medications = Medication::factory()->count(12)->create();
        $mainMedication = $medications->first();
        $tooManyMedications = $medications->slice(1)->pluck('id')->toArray();

        $response = $this->actingAsUser($user)->post(
            "{$this->url}/{$mainMedication->id}/check-interactions",
            ['medications' => $tooManyMedications]
        );

        $response->assertSessionHasErrors(['medications']);
    }

    public function test_check_interactions_prevents_checking_medication_with_itself(): void
    {
        $user = User::factory()->create();

        $medication = Medication::factory()->create();

        $response = $this->actingAsUser($user)->post(
            "{$this->url}/{$medication->id}/check-interactions",
            ['medications' => [$medication->id]]
        );

        $response->assertSessionHasErrors(['medications.0']);
    }

    public function test_guest_cannot_access_medications(): void
    {
        $response = $this->get($this->url);

        $response->assertRedirect('/login');
    }
}

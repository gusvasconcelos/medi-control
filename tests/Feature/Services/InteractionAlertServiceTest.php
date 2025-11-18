<?php

namespace Tests\Feature\Services;

use App\Models\InteractionAlert;
use App\Models\Medication;
use App\Models\User;
use App\Models\UserMedication;
use App\Packages\OpenAI\DTOs\InteractionResult;
use App\Services\InteractionAlertService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

final class InteractionAlertServiceTest extends TestCase
{
    use DatabaseTransactions;

    private InteractionAlertService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new InteractionAlertService();
    }

    private function authenticateAs(User $user): void
    {
        $this->actingAs($user, 'api');
    }

    public function test_creates_alert_for_severe_interaction(): void
    {
        $user = User::factory()->create();
        $medication1 = Medication::factory()->create(['name' => 'Medication 1']);
        $medication2 = Medication::factory()->create(['name' => 'Medication 2']);

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication1->id,
        ]);

        $this->authenticateAs($user);

        $interactions = [
            new InteractionResult(
                medicationId: $medication2->id,
                medicationName: 'Medication 2',
                hasInteraction: true,
                severity: 'severe',
                description: 'Severe interaction detected',
                calculatedAt: now()->toDateTimeString()
            ),
        ];

        $alertsCreated = $this->service->createAlertsForInteractions($userMedication, $interactions);

        $this->assertEquals(1, $alertsCreated);
        $this->assertDatabaseHas('interaction_alerts', [
            'user_id' => $user->id,
            'medication_1_id' => $medication1->id,
            'medication_2_id' => $medication2->id,
            'severity' => 'severe',
            'description' => 'Severe interaction detected',
        ]);
    }

    public function test_creates_alert_for_moderate_interaction(): void
    {
        $user = User::factory()->create();
        $medication1 = Medication::factory()->create();
        $medication2 = Medication::factory()->create();

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication1->id,
        ]);

        $interactions = [
            new InteractionResult(
                medicationId: $medication2->id,
                medicationName: 'Medication 2',
                hasInteraction: true,
                severity: 'moderate',
                description: 'Moderate interaction',
                calculatedAt: now()->toDateTimeString()
            ),
        ];

        $alertsCreated = $this->service->createAlertsForInteractions($userMedication, $interactions);

        $this->assertEquals(1, $alertsCreated);
        $this->assertDatabaseHas('interaction_alerts', [
            'user_id' => $user->id,
            'severity' => 'moderate',
        ]);
    }

    public function test_ignores_minor_interactions(): void
    {
        $user = User::factory()->create();
        $medication1 = Medication::factory()->create();
        $medication2 = Medication::factory()->create();

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication1->id,
        ]);

        $interactions = [
            new InteractionResult(
                medicationId: $medication2->id,
                medicationName: 'Medication 2',
                hasInteraction: true,
                severity: 'minor',
                description: 'Minor interaction',
                calculatedAt: now()->toDateTimeString()
            ),
        ];

        $alertsCreated = $this->service->createAlertsForInteractions($userMedication, $interactions);

        $this->assertEquals(0, $alertsCreated);
        $this->assertDatabaseMissing('interaction_alerts', [
            'user_id' => $user->id,
            'medication_1_id' => $medication1->id,
            'medication_2_id' => $medication2->id,
        ]);
    }

    public function test_ignores_none_severity_interactions(): void
    {
        $user = User::factory()->create();
        $medication1 = Medication::factory()->create();
        $medication2 = Medication::factory()->create();

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication1->id,
        ]);

        $interactions = [
            new InteractionResult(
                medicationId: $medication2->id,
                medicationName: 'Medication 2',
                hasInteraction: false,
                severity: 'none',
                description: 'No interaction',
                calculatedAt: now()->toDateTimeString()
            ),
        ];

        $alertsCreated = $this->service->createAlertsForInteractions($userMedication, $interactions);

        $this->assertEquals(0, $alertsCreated);
        $this->assertDatabaseCount('interaction_alerts', 0);
    }

    public function test_prevents_duplicate_alerts(): void
    {
        $user = User::factory()->create();

        $this->authenticateAs($user);

        $medication1 = Medication::factory()->create();
        $medication2 = Medication::factory()->create();

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication1->id,
        ]);

        InteractionAlert::create([
            'user_id' => $user->id,
            'medication_1_id' => $medication1->id,
            'medication_2_id' => $medication2->id,
            'severity' => 'severe',
            'description' => 'Existing alert',
            'recommendation' => 'Test',
            'detected_at' => now(),
            'acknowledged_at' => null,
        ]);

        $this->assertDatabaseCount('interaction_alerts', 1);

        $userMedication->load('medication');

        $interactions = [
            new InteractionResult(
                medicationId: $medication2->id,
                medicationName: 'Medication 2',
                hasInteraction: true,
                severity: 'severe',
                description: 'Severe interaction',
                calculatedAt: now()->toDateTimeString()
            ),
        ];

        $alertsCreated = $this->service->createAlertsForInteractions($userMedication, $interactions);

        $this->assertEquals(0, $alertsCreated);
        $this->assertDatabaseCount('interaction_alerts', 1);
    }

    public function test_prevents_duplicate_alerts_bidirectional(): void
    {
        $user = User::factory()->create();

        $this->authenticateAs($user);

        $medication1 = Medication::factory()->create();
        $medication2 = Medication::factory()->create();

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication1->id,
        ]);

        InteractionAlert::create([
            'user_id' => $user->id,
            'medication_1_id' => $medication2->id,
            'medication_2_id' => $medication1->id,
            'severity' => 'severe',
            'description' => 'Existing reverse alert',
            'recommendation' => 'Test',
            'detected_at' => now(),
            'acknowledged_at' => null,
        ]);

        $this->assertDatabaseCount('interaction_alerts', 1);

        $userMedication->load('medication');

        $interactions = [
            new InteractionResult(
                medicationId: $medication2->id,
                medicationName: 'Medication 2',
                hasInteraction: true,
                severity: 'severe',
                description: 'Severe interaction',
                calculatedAt: now()->toDateTimeString()
            ),
        ];

        $alertsCreated = $this->service->createAlertsForInteractions($userMedication, $interactions);

        $this->assertEquals(0, $alertsCreated);

        $this->assertDatabaseCount('interaction_alerts', 1);
    }

    public function test_creates_new_alert_when_previous_was_acknowledged(): void
    {
        $user = User::factory()->create();

        $this->authenticateAs($user);

        $medication1 = Medication::factory()->create();
        $medication2 = Medication::factory()->create();

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication1->id,
        ]);

        InteractionAlert::create([
            'user_id' => $user->id,
            'medication_1_id' => $medication1->id,
            'medication_2_id' => $medication2->id,
            'severity' => 'severe',
            'description' => 'Acknowledged alert',
            'recommendation' => 'Test',
            'detected_at' => now()->subDays(5),
            'acknowledged_at' => now()->subDays(3),
        ]);

        $interactions = [
            new InteractionResult(
                medicationId: $medication2->id,
                medicationName: 'Medication 2',
                hasInteraction: true,
                severity: 'severe',
                description: 'New severe interaction',
                calculatedAt: now()->toDateTimeString()
            ),
        ];

        $alertsCreated = $this->service->createAlertsForInteractions($userMedication, $interactions);

        $this->assertEquals(1, $alertsCreated);
        $this->assertDatabaseCount('interaction_alerts', 2);
    }

    public function test_creates_multiple_alerts_for_multiple_interactions(): void
    {
        $user = User::factory()->create();

        $this->authenticateAs($user);

        $medication1 = Medication::factory()->create();
        $medication2 = Medication::factory()->create();
        $medication3 = Medication::factory()->create();

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication1->id,
        ]);

        $interactions = [
            new InteractionResult(
                medicationId: $medication2->id,
                medicationName: 'Medication 2',
                hasInteraction: true,
                severity: 'severe',
                description: 'Severe interaction with med 2',
                calculatedAt: now()->toDateTimeString()
            ),
            new InteractionResult(
                medicationId: $medication3->id,
                medicationName: 'Medication 3',
                hasInteraction: true,
                severity: 'moderate',
                description: 'Moderate interaction with med 3',
                calculatedAt: now()->toDateTimeString()
            ),
        ];

        $alertsCreated = $this->service->createAlertsForInteractions($userMedication, $interactions);

        $this->assertEquals(2, $alertsCreated);
        $this->assertDatabaseCount('interaction_alerts', 2);
    }

    public function test_sets_correct_recommendation_for_severe_severity(): void
    {
        $user = User::factory()->create();
        $medication1 = Medication::factory()->create();
        $medication2 = Medication::factory()->create();

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication1->id,
        ]);

        $interactions = [
            new InteractionResult(
                medicationId: $medication2->id,
                medicationName: 'Medication 2',
                hasInteraction: true,
                severity: 'severe',
                description: 'Severe interaction',
                calculatedAt: now()->toDateTimeString()
            ),
        ];

        $this->service->createAlertsForInteractions($userMedication, $interactions);

        $this->assertDatabaseHas('interaction_alerts', [
            'severity' => 'severe',
            'recommendation' => 'Consulte seu médico imediatamente. Esta combinação pode causar efeitos adversos graves.',
        ]);
    }

    public function test_sets_correct_recommendation_for_moderate_severity(): void
    {
        $user = User::factory()->create();
        $medication1 = Medication::factory()->create();
        $medication2 = Medication::factory()->create();

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication1->id,
        ]);

        $interactions = [
            new InteractionResult(
                medicationId: $medication2->id,
                medicationName: 'Medication 2',
                hasInteraction: true,
                severity: 'moderate',
                description: 'Moderate interaction',
                calculatedAt: now()->toDateTimeString()
            ),
        ];

        $this->service->createAlertsForInteractions($userMedication, $interactions);

        $this->assertDatabaseHas('interaction_alerts', [
            'severity' => 'moderate',
            'recommendation' => 'Informe seu médico sobre esta interação. Pode ser necessário ajustar as dosagens.',
        ]);
    }

    public function test_returns_zero_when_no_interactions_provided(): void
    {
        $user = User::factory()->create();
        $medication = Medication::factory()->create();

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
        ]);

        $alertsCreated = $this->service->createAlertsForInteractions($userMedication, []);

        $this->assertEquals(0, $alertsCreated);
        $this->assertDatabaseCount('interaction_alerts', 0);
    }
}

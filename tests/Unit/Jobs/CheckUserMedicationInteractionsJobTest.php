<?php

namespace Tests\Unit\Jobs;

use App\Jobs\CheckUserMedicationInteractionsJob;
use App\Models\Medication;
use App\Models\User;
use App\Models\UserMedication;
use App\Packages\OpenAI\DTOs\InteractionResult;
use App\Services\InteractionAlertService;
use App\Services\Medication\InteractionCheckerService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Collection;
use Mockery;
use Tests\TestCase;

final class CheckUserMedicationInteractionsJobTest extends TestCase
{
    use DatabaseTransactions;

    public function test_job_handles_nonexistent_user_medication(): void
    {
        $interactionChecker = Mockery::mock(InteractionCheckerService::class);
        $alertService = Mockery::mock(InteractionAlertService::class);

        $interactionChecker->shouldNotReceive('checkInteractionsWithOpenAI');
        $alertService->shouldNotReceive('createAlertsForInteractions');

        $job = new CheckUserMedicationInteractionsJob(999999);
        $job->handle($interactionChecker, $alertService);
    }

    public function test_job_skips_when_no_other_active_medications(): void
    {
        $user = User::factory()->create();
        $medication = Medication::factory()->create();

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication->id,
            'active' => true,
        ]);

        $interactionChecker = Mockery::mock(InteractionCheckerService::class);
        $alertService = Mockery::mock(InteractionAlertService::class);

        $interactionChecker->shouldNotReceive('checkInteractionsWithOpenAI');
        $alertService->shouldNotReceive('createAlertsForInteractions');

        $job = new CheckUserMedicationInteractionsJob($userMedication->id);
        $job->handle($interactionChecker, $alertService);
    }

    public function test_job_checks_interactions_with_other_active_medications(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'api');

        $medication1 = Medication::factory()->create(['name' => 'Medication 1']);
        $medication2 = Medication::factory()->create(['name' => 'Medication 2']);
        $medication3 = Medication::factory()->create(['name' => 'Medication 3']);

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication1->id,
            'active' => true,
        ]);

        UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication2->id,
            'active' => true,
        ]);

        UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication3->id,
            'active' => false,
        ]);

        $interactionChecker = Mockery::mock(InteractionCheckerService::class);
        $alertService = Mockery::mock(InteractionAlertService::class);

        $interactionChecker
            ->shouldReceive('filterAlreadyChecked')
            ->once()
            ->with(Mockery::on(fn ($med) => $med->id === $medication1->id), Mockery::on(function ($medicationIds) use ($medication2) {
                return $medicationIds->contains($medication2->id) && $medicationIds->count() === 1;
            }))
            ->andReturn(collect([$medication2->id]));

        $interactionResults = collect([
            new InteractionResult(
                medicationId: $medication2->id,
                medicationName: 'Medication 2',
                hasInteraction: true,
                severity: 'moderate',
                description: 'Test interaction',
                calculatedAt: now()->toDateTimeString()
            ),
        ]);

        $interactionChecker
            ->shouldReceive('checkInteractionsWithOpenAI')
            ->once()
            ->with(Mockery::on(fn ($med) => $med->id === $medication1->id), Mockery::on(fn ($ids) => $ids->contains($medication2->id)))
            ->andReturn($interactionResults);

        $interactionChecker
            ->shouldReceive('persistInteractionsBidirectionally')
            ->once()
            ->with(Mockery::on(fn ($med) => $med->id === $medication1->id), $interactionResults);

        $alertService
            ->shouldReceive('createAlertsForInteractions')
            ->once()
            ->with(Mockery::on(fn ($um) => $um->id === $userMedication->id), $interactionResults->toArray())
            ->andReturn(1);

        $job = new CheckUserMedicationInteractionsJob($userMedication->id);
        $job->handle($interactionChecker, $alertService);
    }

    public function test_job_skips_openai_call_when_all_interactions_already_checked(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'api');

        $medication1 = Medication::factory()->create([
            'name' => 'Medication 1',
            'interactions' => [
                [
                    'medication_id' => 999,
                    'has_interaction' => true,
                    'severity' => 'moderate',
                    'description' => 'Existing interaction',
                    'calculated_at' => now()->toDateTimeString(),
                ],
            ],
        ]);
        $medication2 = Medication::factory()->create(['name' => 'Medication 2']);

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication1->id,
            'active' => true,
        ]);

        UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication2->id,
            'active' => true,
        ]);

        $interactionChecker = Mockery::mock(InteractionCheckerService::class);
        $alertService = Mockery::mock(InteractionAlertService::class);

        $interactionChecker
            ->shouldReceive('filterAlreadyChecked')
            ->once()
            ->andReturn(collect());

        $interactionChecker
            ->shouldNotReceive('checkInteractionsWithOpenAI');

        $alertService
            ->shouldNotReceive('createAlertsForInteractions');

        $job = new CheckUserMedicationInteractionsJob($userMedication->id);
        $job->handle($interactionChecker, $alertService);
    }

    public function test_job_only_checks_active_medications(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'api');

        $medication1 = Medication::factory()->create();
        $medication2 = Medication::factory()->create();
        $medication3 = Medication::factory()->create();

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication1->id,
            'active' => true,
        ]);

        UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication2->id,
            'active' => true,
        ]);

        UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication3->id,
            'active' => false,
        ]);

        $interactionChecker = Mockery::mock(InteractionCheckerService::class);
        $alertService = Mockery::mock(InteractionAlertService::class);

        $interactionChecker
            ->shouldReceive('filterAlreadyChecked')
            ->once()
            ->with(Mockery::on(fn ($med) => $med->id === $medication1->id), Mockery::on(function (Collection $medicationIds) use ($medication2, $medication3) {
                return $medicationIds->contains($medication2->id)
                    && ! $medicationIds->contains($medication3->id)
                    && $medicationIds->count() === 1;
            }))
            ->andReturn(collect());

        $alertService->shouldNotReceive('createAlertsForInteractions');

        $job = new CheckUserMedicationInteractionsJob($userMedication->id);
        $job->handle($interactionChecker, $alertService);
    }

    public function test_job_excludes_current_medication_from_check(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'api');

        $medication1 = Medication::factory()->create();
        $medication2 = Medication::factory()->create();

        $userMedication = UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication1->id,
            'active' => true,
        ]);

        UserMedication::factory()->create([
            'user_id' => $user->id,
            'medication_id' => $medication2->id,
            'active' => true,
        ]);

        $interactionChecker = Mockery::mock(InteractionCheckerService::class);
        $alertService = Mockery::mock(InteractionAlertService::class);

        $interactionChecker
            ->shouldReceive('filterAlreadyChecked')
            ->once()
            ->with(Mockery::on(fn ($med) => $med->id === $medication1->id), Mockery::on(function (Collection $medicationIds) use ($medication1, $medication2) {
                return ! $medicationIds->contains($medication1->id)
                    && $medicationIds->contains($medication2->id);
            }))
            ->andReturn(collect());

        $alertService->shouldNotReceive('createAlertsForInteractions');

        $job = new CheckUserMedicationInteractionsJob($userMedication->id);
        $job->handle($interactionChecker, $alertService);
    }
}

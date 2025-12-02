<?php

namespace App\Http\Controllers\Web\Horizon;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Horizon\Contracts\JobRepository;
use Laravel\Horizon\Contracts\MasterSupervisorRepository;
use Laravel\Horizon\Contracts\MetricsRepository;
use Laravel\Horizon\Contracts\SupervisorRepository;
use Laravel\Horizon\Contracts\WorkloadRepository;
use Laravel\Horizon\ProvisioningPlan;
use Laravel\Horizon\WaitTimeCalculator;

class DashboardController extends Controller
{
    public function __construct(
        private readonly JobRepository $jobs,
        private readonly MetricsRepository $metrics,
        private readonly MasterSupervisorRepository $masterSupervisors,
        private readonly SupervisorRepository $supervisors,
        private readonly WorkloadRepository $workload,
        private readonly WaitTimeCalculator $waitTimeCalculator,
    ) {
    }

    public function index(): Response
    {
        return Inertia::render('Horizon/Dashboard', [
            'stats' => $this->getStats(),
            'workload' => $this->getWorkload(),
            'masters' => $this->getMasters(),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function getStats(): array
    {
        return [
            'failedJobs' => $this->jobs->countRecentlyFailed(),
            'jobsPerMinute' => $this->metrics->jobsProcessedPerMinute(),
            'pausedMasters' => $this->totalPausedMasters(),
            'periods' => [
                'failedJobs' => config('horizon.trim.recent_failed', config('horizon.trim.failed')),
                'recentJobs' => config('horizon.trim.recent'),
            ],
            'processes' => $this->totalProcessCount(),
            'queueWithMaxRuntime' => $this->metrics->queueWithMaximumRuntime(),
            'queueWithMaxThroughput' => $this->metrics->queueWithMaximumThroughput(),
            'recentJobs' => $this->jobs->countRecent(),
            'status' => $this->currentStatus(),
            'wait' => collect($this->waitTimeCalculator->calculate())->take(1)->toArray(),
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function getWorkload(): array
    {
        return collect($this->workload->get())
            ->sortBy('name')
            ->values()
            ->toArray();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function getMasters(): array
    {
        $masters = collect($this->masterSupervisors->all())
            ->keyBy('name')
            ->sortBy('name');

        $supervisors = collect($this->supervisors->all())
            ->sortBy('name')
            ->groupBy('master');

        return $masters->map(function ($master, $name) use ($supervisors) {
            $activeSupervisors = $supervisors->get($name) ?? collect();
            $env = $master->environment ?? config('horizon.env') ?? config('app.env');
            $planSupervisors = collect(ProvisioningPlan::get($name)->plan[$env] ?? [])
                ->map(fn ($value, $key) => (object) [
                    'name' => $name . ':' . $key,
                    'master' => $name,
                    'status' => 'inactive',
                    'processes' => [],
                    'options' => [
                        'queue' => is_array($value['queue'] ?? null)
                            ? implode(',', $value['queue'])
                            : ($value['queue'] ?? ''),
                        'balance' => $value['balance'] ?? null,
                    ],
                    'pid' => 0,
                ]);

            $master->supervisors = $activeSupervisors
                ->merge($planSupervisors)
                ->unique('name')
                ->values()
                ->toArray();

            return (array) $master;
        })->values()->toArray();
    }

    private function totalProcessCount(): int
    {
        return collect($this->supervisors->all())
            ->reduce(fn ($carry, $supervisor) => $carry + collect($supervisor->processes)->sum(), 0);
    }

    private function currentStatus(): string
    {
        $masters = $this->masterSupervisors->all();

        if (empty($masters)) {
            return 'inactive';
        }

        $allPaused = collect($masters)->every(fn ($master) => $master->status === 'paused');

        return $allPaused ? 'paused' : 'running';
    }

    private function totalPausedMasters(): int
    {
        $masters = $this->masterSupervisors->all();

        if (empty($masters)) {
            return 0;
        }

        return collect($masters)
            ->filter(fn ($master) => $master->status === 'paused')
            ->count();
    }
}

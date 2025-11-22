<?php

namespace App\Http\Controllers\Web\Horizon;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Horizon\Contracts\MetricsRepository;

class MetricsController extends Controller
{
    public function __construct(
        private readonly MetricsRepository $metrics,
    ) {
    }

    public function index(Request $request, string $type): Response
    {
        $selectedItem = $request->query('selected');

        return match ($type) {
            'jobs' => $this->renderJobMetrics($selectedItem),
            'queues' => $this->renderQueueMetrics($selectedItem),
            default => abort(404),
        };
    }

    private function renderJobMetrics(?string $selectedJob): Response
    {
        $jobs = $this->metrics->measuredJobs();
        $snapshots = [];

        if ($selectedJob) {
            $snapshots = collect($this->metrics->snapshotsForJob($selectedJob))
                ->map(fn ($record) => [
                    'time' => $record->time,
                    'runtime' => round($record->runtime / 1000, 3),
                    'throughput' => (int) $record->throughput,
                ])
                ->toArray();
        }

        return Inertia::render('Horizon/Metrics/Jobs', [
            'jobs' => $jobs,
            'selectedJob' => $selectedJob,
            'snapshots' => $snapshots,
        ]);
    }

    private function renderQueueMetrics(?string $selectedQueue): Response
    {
        $queues = $this->metrics->measuredQueues();
        $snapshots = [];

        if ($selectedQueue) {
            $snapshots = collect($this->metrics->snapshotsForQueue($selectedQueue))
                ->map(fn ($record) => [
                    'time' => $record->time,
                    'runtime' => round($record->runtime / 1000, 3),
                    'throughput' => (int) $record->throughput,
                ])
                ->toArray();
        }

        return Inertia::render('Horizon/Metrics/Queues', [
            'queues' => $queues,
            'selectedQueue' => $selectedQueue,
            'snapshots' => $snapshots,
        ]);
    }
}

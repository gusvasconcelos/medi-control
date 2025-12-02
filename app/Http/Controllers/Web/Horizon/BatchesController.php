<?php

namespace App\Http\Controllers\Web\Horizon;

use App\Http\Controllers\Controller;
use Illuminate\Bus\BatchRepository;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Horizon\Contracts\JobRepository;
use Laravel\Horizon\Jobs\RetryFailedJob;

class BatchesController extends Controller
{
    public function __construct(
        private readonly BatchRepository $batches,
        private readonly JobRepository $jobs,
    ) {
    }

    public function index(Request $request): Response
    {
        try {
            $beforeId = $request->query('before_id');
            $batches = $this->batches->get(50, $beforeId ?: null);
        } catch (QueryException) {
            $batches = [];
        }

        return Inertia::render('Horizon/Batches/Index', [
            'batches' => $this->formatBatches($batches),
        ]);
    }

    public function show(string $id): Response
    {
        $batch = $this->batches->find($id);
        $failedJobs = [];

        if ($batch) {
            $failedJobs = $this->jobs->getJobs($batch->failedJobIds)
                ->map(fn ($job) => $this->decodeJob($job))
                ->toArray();
        }

        return Inertia::render('Horizon/Batches/Show', [
            'batch' => $batch ? $this->formatBatch($batch) : null,
            'failedJobs' => $failedJobs,
        ]);
    }

    public function retry(string $id): RedirectResponse
    {
        $batch = $this->batches->find($id);

        if ($batch) {
            $this->jobs->getJobs($batch->failedJobIds)
                ->reject(function ($job) {
                    $payload = json_decode($job->payload);

                    return isset($payload->retry_of);
                })
                ->each(fn ($job) => dispatch(new RetryFailedJob($job->id)));
        }

        return redirect()->back()->with('success', 'Jobs falhos do batch adicionados à fila para reprocessamento.');
    }

    /**
     * @param iterable<mixed> $batches
     * @return array<int, array<string, mixed>>
     */
    private function formatBatches(iterable $batches): array
    {
        return collect($batches)
            ->map(fn ($batch) => $this->formatBatch($batch))
            ->toArray();
    }

    /**
     * @return array<string, mixed>
     */
    private function formatBatch(mixed $batch): array
    {
        return [
            'id' => $batch->id,
            'name' => $batch->name,
            'totalJobs' => $batch->totalJobs,
            'pendingJobs' => $batch->pendingJobs,
            'failedJobs' => $batch->failedJobs,
            'processedJobs' => $batch->processedJobs,
            'progress' => $batch->progress(),
            'finishedAt' => $batch->finishedAt?->toIso8601String(),
            'createdAt' => $batch->createdAt->toIso8601String(),
            'cancelledAt' => $batch->cancelledAt?->toIso8601String(),
        ];
    }

    private function decodeJob(object $job): object
    {
        $job->payload = json_decode($job->payload);
        $job->exception = mb_convert_encoding($job->exception ?? '', 'UTF-8');
        $job->context = json_decode($job->context ?? '');
        $job->retried_by = collect($job->retried_by ? json_decode($job->retried_by) : [])
            ->sortByDesc('retried_at')
            ->values()
            ->toArray();

        return $job;
    }
}

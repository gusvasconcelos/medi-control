<?php

namespace App\Http\Controllers\Web\Horizon;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Horizon\Contracts\JobRepository;
use Laravel\Horizon\Contracts\TagRepository;
use Laravel\Horizon\Jobs\RetryFailedJob;

class JobsController extends Controller
{
    public function __construct(
        private readonly JobRepository $jobs,
        private readonly TagRepository $tags,
    ) {
    }

    public function index(Request $request, string $status): Response
    {
        $startingAt = $request->query('starting_at');
        $tag = $request->query('tag');

        $jobsData = match ($status) {
            'pending' => $this->getPendingJobs($startingAt),
            'completed' => $this->getCompletedJobs($startingAt),
            'failed' => $this->getFailedJobs($startingAt, $tag),
            'silenced' => $this->getSilencedJobs($startingAt),
            default => ['jobs' => [], 'total' => 0],
        };

        return Inertia::render('Horizon/Jobs/Index', [
            'jobs' => $jobsData['jobs'],
            'total' => $jobsData['total'],
            'status' => $status,
            'startingAt' => $startingAt ? (int) $startingAt : -1,
            'tag' => $tag,
        ]);
    }

    public function show(string $id): Response
    {
        $job = $this->jobs->getJobs([$id])
            ->map(fn ($job) => $this->decodeJob($job))
            ->first();

        return Inertia::render('Horizon/Jobs/Show', [
            'job' => $job ? (array) $job : null,
        ]);
    }

    public function retry(string $id): RedirectResponse
    {
        dispatch(new RetryFailedJob($id));

        return redirect()->back()->with('success', 'Job adicionado à fila para reprocessamento.');
    }

    /**
     * @return array{jobs: array<int, mixed>, total: int}
     */
    private function getPendingJobs(?string $startingAt): array
    {
        $jobs = $this->jobs->getPending($startingAt)
            ->map(fn ($job) => $this->decodeJob($job))
            ->values()
            ->toArray();

        return [
            'jobs' => $jobs,
            'total' => $this->jobs->countPending(),
        ];
    }

    /**
     * @return array{jobs: array<int, mixed>, total: int}
     */
    private function getCompletedJobs(?string $startingAt): array
    {
        $jobs = $this->jobs->getCompleted($startingAt)
            ->map(fn ($job) => $this->decodeJob($job))
            ->values()
            ->toArray();

        return [
            'jobs' => $jobs,
            'total' => $this->jobs->countCompleted(),
        ];
    }

    /**
     * @return array{jobs: array<int, mixed>, total: int}
     */
    private function getFailedJobs(?string $startingAt, ?string $tag): array
    {
        if ($tag) {
            $offset = $startingAt ? (int) $startingAt + 1 : 0;
            $jobIds = $this->tags->paginate('failed:' . $tag, $offset, 50);
            $jobs = $this->jobs->getJobs($jobIds, $startingAt ? (int) $startingAt : 0)
                ->map(fn ($job) => $this->decodeFailedJob($job))
                ->toArray();
            $total = $this->tags->count('failed:' . $tag);
        } else {
            $jobs = $this->jobs->getFailed($startingAt)
                ->map(fn ($job) => $this->decodeFailedJob($job))
                ->values()
                ->toArray();
            $total = $this->jobs->countFailed();
        }

        return [
            'jobs' => $jobs,
            'total' => $total,
        ];
    }

    /**
     * @return array{jobs: array<int, mixed>, total: int}
     */
    private function getSilencedJobs(?string $startingAt): array
    {
        $jobs = $this->jobs->getSilenced($startingAt)
            ->map(fn ($job) => $this->decodeJob($job))
            ->values()
            ->toArray();

        return [
            'jobs' => $jobs,
            'total' => $this->jobs->countSilenced(),
        ];
    }

    private function decodeJob(object $job): object
    {
        $job->payload = json_decode($job->payload);

        return $job;
    }

    private function decodeFailedJob(object $job): object
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

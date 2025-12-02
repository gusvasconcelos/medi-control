<?php

namespace App\Http\Controllers\Web\Horizon;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Horizon\Contracts\JobRepository;
use Laravel\Horizon\Contracts\TagRepository;

class MonitoringController extends Controller
{
    public function __construct(
        private readonly TagRepository $tags,
        private readonly JobRepository $jobs,
    ) {
    }

    public function index(): Response
    {
        $monitoring = $this->tags->monitoring();

        $tags = collect($monitoring)->map(fn ($tag) => [
            'tag' => $tag,
            'count' => $this->tags->count($tag) + $this->tags->count('failed:' . $tag),
        ])->toArray();

        return Inertia::render('Horizon/Monitoring/Index', [
            'tags' => $tags,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'tag' => ['required', 'string', 'max:255'],
        ]);

        $this->tags->monitor($request->input('tag'));

        return redirect()->back()->with('success', 'Tag adicionada para monitoramento.');
    }

    public function show(Request $request, string $tag): Response
    {
        $startingAt = (int) $request->query('starting_at', -1);

        $jobIds = $this->tags->paginate($tag, $startingAt + 1, 50);
        $failedJobIds = $this->tags->paginate('failed:' . $tag, $startingAt + 1, 50);

        $allJobIds = array_merge($jobIds, $failedJobIds);

        $jobs = $this->jobs->getJobs($allJobIds, $startingAt)
            ->map(fn ($job) => $this->decodeJob($job))
            ->toArray();

        return Inertia::render('Horizon/Monitoring/Show', [
            'tag' => $tag,
            'jobs' => $jobs,
            'total' => $this->tags->count($tag) + $this->tags->count('failed:' . $tag),
            'startingAt' => $startingAt,
        ]);
    }

    public function destroy(string $tag): RedirectResponse
    {
        $this->tags->stopMonitoring($tag);

        return redirect()->back()->with('success', 'Tag removida do monitoramento.');
    }

    private function decodeJob(object $job): object
    {
        $job->payload = json_decode($job->payload);

        if (isset($job->exception)) {
            $job->exception = mb_convert_encoding($job->exception, 'UTF-8');
        }

        if (isset($job->context)) {
            $job->context = json_decode($job->context);
        }

        if (isset($job->retried_by)) {
            $job->retried_by = collect(json_decode($job->retried_by))
                ->sortByDesc('retried_at')
                ->values()
                ->toArray();
        }

        return $job;
    }
}

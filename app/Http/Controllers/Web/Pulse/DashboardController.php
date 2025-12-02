<?php

namespace App\Http\Controllers\Web\Pulse;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $period = $request->get('period', '1h');

        $periodInSeconds = match($period) {
            '5m' => 300,
            '15m' => 900,
            '30m' => 1800,
            '1h' => 3600,
            '6h' => 21600,
            '24h' => 86400,
            '7d' => 604800,
            default => 3600,
        };

        $now = now();
        $start = $now->copy()->subSeconds($periodInSeconds);

        $data = [
            'servers' => $this->getServersData($start, $now),
            'slow_queries' => $this->getSlowQueries($start, $now),
            'slow_requests' => $this->getSlowRequests($start, $now),
            'slow_jobs' => $this->getSlowJobs($start, $now),
            'slow_outgoing_requests' => $this->getSlowOutgoingRequests($start, $now),
            'exceptions' => $this->getExceptions($start, $now),
            'cache_interactions' => $this->getCacheInteractions($start, $now),
            'queues' => $this->getQueues($start, $now),
            'user_requests' => $this->getUserRequests($start, $now),
            'user_jobs' => $this->getUserJobs($start, $now),
            'period' => $period,
        ];

        return Inertia::render('Pulse/Dashboard', [
            'metrics' => $data,
        ]);
    }

    protected function getServersData($start, $end): array
    {
        try {
            $values = DB::table('pulse_values')
                ->where('type', 'system')
                ->where('timestamp', '>=', $start->timestamp)
                ->where('timestamp', '<=', $end->timestamp)
                ->get();

            $servers = [];
            foreach ($values as $value) {
                $serverName = $value->key ?? 'default';
                if (!isset($servers[$serverName])) {
                    $servers[$serverName] = [
                        'name' => $serverName,
                        'cpu' => 0,
                        'memory' => 0,
                    ];
                }

                $valueData = json_decode($value->value ?? '{}', true);
                if (isset($valueData['cpu'])) {
                    $servers[$serverName]['cpu'] = round($valueData['cpu'] ?? 0, 2);
                }
                if (isset($valueData['memory'])) {
                    $servers[$serverName]['memory'] = round($valueData['memory'] ?? 0, 2);
                }
            }

            return array_values($servers);
        } catch (\Exception $e) {
            return [];
        }
    }

    protected function getSlowQueries($start, $end): array
    {
        try {
            $aggregates = DB::table('pulse_aggregates')
                ->where('type', 'slow_query')
                ->where('bucket', '>=', $start->timestamp)
                ->where('bucket', '<=', $end->timestamp)
                ->select('key', DB::raw('MAX(value) as max'), DB::raw('SUM(COALESCE(count, 1)) as count'))
                ->groupBy('key')
                ->orderByDesc('max')
                ->limit(10)
                ->get();

            return $aggregates->map(function ($aggregate) {
                return [
                    'sql' => $aggregate->key,
                    'duration' => round($aggregate->max ?? 0, 2),
                    'count' => $aggregate->count ?? 0,
                    'location' => $this->extractLocation($aggregate->key),
                ];
            })->toArray();
        } catch (\Exception $e) {
            return [];
        }
    }

    protected function getSlowRequests($start, $end): array
    {
        try {
            $aggregates = DB::table('pulse_aggregates')
                ->where('type', 'slow_request')
                ->where('bucket', '>=', $start->timestamp)
                ->where('bucket', '<=', $end->timestamp)
                ->select('key', DB::raw('MAX(value) as max'), DB::raw('SUM(COALESCE(count, 1)) as count'))
                ->groupBy('key')
                ->orderByDesc('max')
                ->limit(10)
                ->get();

            return $aggregates->map(function ($aggregate) {
                return [
                    'method' => $this->extractMethod($aggregate->key),
                    'uri' => $aggregate->key,
                    'duration' => round($aggregate->max ?? 0, 2),
                    'count' => $aggregate->count ?? 0,
                ];
            })->toArray();
        } catch (\Exception $e) {
            return [];
        }
    }

    protected function getSlowJobs($start, $end): array
    {
        try {
            $aggregates = DB::table('pulse_aggregates')
                ->where('type', 'slow_job')
                ->where('bucket', '>=', $start->timestamp)
                ->where('bucket', '<=', $end->timestamp)
                ->select('key', DB::raw('MAX(value) as max'), DB::raw('SUM(COALESCE(count, 1)) as count'))
                ->groupBy('key')
                ->orderByDesc('max')
                ->limit(10)
                ->get();

            return $aggregates->map(function ($aggregate) {
                return [
                    'job' => $aggregate->key,
                    'duration' => round($aggregate->max ?? 0, 2),
                    'count' => $aggregate->count ?? 0,
                ];
            })->toArray();
        } catch (\Exception $e) {
            return [];
        }
    }

    protected function getSlowOutgoingRequests($start, $end): array
    {
        try {
            $aggregates = DB::table('pulse_aggregates')
                ->where('type', 'slow_outgoing_request')
                ->where('bucket', '>=', $start->timestamp)
                ->where('bucket', '<=', $end->timestamp)
                ->select('key', DB::raw('MAX(value) as max'), DB::raw('SUM(COALESCE(count, 1)) as count'))
                ->groupBy('key')
                ->orderByDesc('max')
                ->limit(10)
                ->get();

            return $aggregates->map(function ($aggregate) {
                return [
                    'url' => $aggregate->key,
                    'duration' => round($aggregate->max ?? 0, 2),
                    'count' => $aggregate->count ?? 0,
                ];
            })->toArray();
        } catch (\Exception $e) {
            return [];
        }
    }

    protected function getExceptions($start, $end): array
    {
        try {
            $aggregates = DB::table('pulse_aggregates')
                ->where('type', 'exception')
                ->where('bucket', '>=', $start->timestamp)
                ->where('bucket', '<=', $end->timestamp)
                ->select('key', DB::raw('SUM(COALESCE(count, 1)) as count'))
                ->groupBy('key')
                ->orderByDesc('count')
                ->limit(10)
                ->get();

            return $aggregates->map(function ($aggregate) {
                return [
                    'exception' => $aggregate->key,
                    'count' => $aggregate->count ?? 0,
                    'location' => $this->extractLocation($aggregate->key),
                ];
            })->toArray();
        } catch (\Exception $e) {
            return [];
        }
    }

    protected function getCacheInteractions($start, $end): array
    {
        try {
            $hitsCount = DB::table('pulse_entries')
                ->where('type', 'cache_hit')
                ->where('timestamp', '>=', $start->timestamp)
                ->where('timestamp', '<=', $end->timestamp)
                ->count();

            $missesCount = DB::table('pulse_entries')
                ->where('type', 'cache_miss')
                ->where('timestamp', '>=', $start->timestamp)
                ->where('timestamp', '<=', $end->timestamp)
                ->count();

            $topKeys = DB::table('pulse_entries')
                ->where('type', 'cache_hit')
                ->where('timestamp', '>=', $start->timestamp)
                ->where('timestamp', '<=', $end->timestamp)
                ->select('key', DB::raw('COUNT(*) as count'))
                ->groupBy('key')
                ->orderByDesc('count')
                ->limit(10)
                ->get();

            $total = $hitsCount + $missesCount;

            return [
                'hits' => $hitsCount,
                'misses' => $missesCount,
                'hit_rate' => $total > 0 ? round(($hitsCount / $total) * 100, 2) : 0,
                'keys' => $topKeys->map(function ($item) {
                    return [
                        'key' => $item->key,
                        'count' => $item->count ?? 0,
                    ];
                })->toArray(),
            ];
        } catch (\Exception $e) {
            return [
                'hits' => 0,
                'misses' => 0,
                'hit_rate' => 0,
                'keys' => [],
            ];
        }
    }

    protected function getQueues($start, $end): array
    {
        try {
            $processed = DB::table('pulse_entries')
                ->where('type', 'job')
                ->where('timestamp', '>=', $start->timestamp)
                ->where('timestamp', '<=', $end->timestamp)
                ->count();

            $failed = DB::table('pulse_entries')
                ->where('type', 'failed_job')
                ->where('timestamp', '>=', $start->timestamp)
                ->where('timestamp', '<=', $end->timestamp)
                ->count();

            $totalProcessed = $processed;
            $totalFailed = $failed;

            return [
                'processed' => $totalProcessed,
                'failed' => $totalFailed,
                'success_rate' => ($totalProcessed + $totalFailed) > 0
                    ? round(($totalProcessed / ($totalProcessed + $totalFailed)) * 100, 2)
                    : 100,
            ];
        } catch (\Exception $e) {
            return [
                'processed' => 0,
                'failed' => 0,
                'success_rate' => 100,
            ];
        }
    }

    protected function getUserRequests($start, $end): array
    {
        try {
            $aggregates = DB::table('pulse_aggregates')
                ->where('type', 'user_request')
                ->where('bucket', '>=', $start->timestamp)
                ->where('bucket', '<=', $end->timestamp)
                ->select('key', DB::raw('SUM(COALESCE(count, 1)) as count'))
                ->groupBy('key')
                ->orderByDesc('count')
                ->limit(10)
                ->get();

            return $aggregates->map(function ($aggregate) {
                return [
                    'user_id' => $aggregate->key,
                    'count' => $aggregate->count ?? 0,
                ];
            })->toArray();
        } catch (\Exception $e) {
            return [];
        }
    }

    protected function getUserJobs($start, $end): array
    {
        try {
            $aggregates = DB::table('pulse_aggregates')
                ->where('type', 'user_job')
                ->where('bucket', '>=', $start->timestamp)
                ->where('bucket', '<=', $end->timestamp)
                ->select('key', DB::raw('SUM(COALESCE(count, 1)) as count'))
                ->groupBy('key')
                ->orderByDesc('count')
                ->limit(10)
                ->get();

            return $aggregates->map(function ($aggregate) {
                return [
                    'user_id' => $aggregate->key,
                    'count' => $aggregate->count ?? 0,
                ];
            })->toArray();
        } catch (\Exception $e) {
            return [];
        }
    }

    protected function extractLocation(string $key): ?string
    {
        preg_match('/([\w\/\.\-]+\.php):(\d+)/', $key, $matches);
        return $matches[0] ?? null;
    }

    protected function extractMethod(string $key): string
    {
        if (preg_match('/^(GET|POST|PUT|PATCH|DELETE)\s/', $key, $matches)) {
            return $matches[1];
        }
        return 'GET';
    }
}

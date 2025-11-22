<?php

namespace App\Http\Controllers\Web\Metrics;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Medication;
use App\Http\Controllers\Controller;
use App\Services\Monitoring\UptimeService;
use App\Models\User;
use App\Models\UserMedication;
use Illuminate\Support\Facades\DB;

class OverviewController extends Controller
{
    public function create(): Response
    {
        $uptime = UptimeService::getUptime();

        $totalMedications = Medication::count();
        $totalUsers = User::count();
        $totalActiveMedications = UserMedication::where('active', true)->count();

        $topMedications = DB::table('medication_logs')
            ->join('user_medications', 'medication_logs.user_medication_id', '=', 'user_medications.id')
            ->join('medications', 'user_medications.medication_id', '=', 'medications.id')
            ->select('medications.id', 'medications.name', DB::raw('COUNT(medication_logs.id) as usage_count'))
            ->where('medication_logs.status', 'taken')
            ->groupBy('medications.id', 'medications.name')
            ->orderByDesc('usage_count')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'usage_count' => $item->usage_count,
                ];
            });

        $systemMemory = $this->getSystemMemory();
        $cpuInfo = $this->getCpuUsage();

        $metrics = [
            'uptime' => $uptime,
            'cpu' => $cpuInfo,
            'memory' => $systemMemory,
            'disk' => disk_free_space('/') / disk_total_space('/'),
            'total_medications' => $totalMedications,
            'total_users' => $totalUsers,
            'total_active_medications' => $totalActiveMedications,
            'top_medications' => $topMedications,
        ];

        return Inertia::render('Metrics/Overview', [
            'metrics' => $metrics,
        ]);
    }

    private function getCpuUsage(): array
    {
        $loadAverage = sys_getloadavg();

        $cpuCores = 1;
        if (file_exists('/proc/cpuinfo')) {
            $cpuinfo = file_get_contents('/proc/cpuinfo');
            preg_match_all('/^processor/m', $cpuinfo, $matches);
            $cpuCores = count($matches[0]) ?: 1;
        }

        $percentage = min(($loadAverage[0] / $cpuCores) * 100, 100);

        return [
            'load_average' => round($loadAverage[0], 2),
            'cores' => $cpuCores,
            'percentage' => round($percentage, 2),
        ];
    }

    private function getSystemMemory(): array
    {
        if (file_exists('/proc/meminfo')) {
            $meminfo = file_get_contents('/proc/meminfo');

            preg_match('/MemTotal:\s+(\d+)\s+kB/', $meminfo, $totalMatch);
            preg_match('/MemAvailable:\s+(\d+)\s+kB/', $meminfo, $availableMatch);

            $totalKb = isset($totalMatch[1]) ? (int)$totalMatch[1] : 0;
            $availableKb = isset($availableMatch[1]) ? (int)$availableMatch[1] : 0;

            $usedKb = $totalKb - $availableKb;
            $percentage = $totalKb > 0 ? ($usedKb / $totalKb) * 100 : 0;

            return [
                'used_mb' => round($usedKb / 1024, 2),
                'total_mb' => round($totalKb / 1024, 2),
                'percentage' => round($percentage, 2),
            ];
        }

        return [
            'used_mb' => 0,
            'total_mb' => 0,
            'percentage' => 0,
        ];
    }
}

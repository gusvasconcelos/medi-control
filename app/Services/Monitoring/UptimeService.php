<?php

namespace App\Services\Monitoring;

use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

class UptimeService
{
    private const UPTIME_FILE = 'app_uptime';

    public static function initialize(): void
    {
        try {
            if (!Cache::has(self::UPTIME_FILE)) {
                Cache::forever(self::UPTIME_FILE, now()->toIso8601String());
            }
        } catch (\Throwable $e) {
        }
    }

    public static function getUptime(): array
    {
        $startTime = Cache::get(self::UPTIME_FILE);

        if (!$startTime) {
            self::initialize();
            $startTime = Cache::get(self::UPTIME_FILE);
        }

        $start = Carbon::parse($startTime);
        $now = now();

        $diff = $start->diff($now);

        return [
            'started_at' => $start->toIso8601String(),
            'uptime_seconds' => $start->diffInSeconds($now),
            'uptime_human' => sprintf(
                '%d dias, %d horas, %d minutos',
                $diff->days,
                $diff->h,
                $diff->i
            ),
            'days' => $diff->days,
            'hours' => $diff->h,
            'minutes' => $diff->i,
            'seconds' => $diff->s,
        ];
    }

    public static function reset(): void
    {
        Cache::forget(self::UPTIME_FILE);
        self::initialize();
    }
}

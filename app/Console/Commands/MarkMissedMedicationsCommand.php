<?php

namespace App\Console\Commands;

use App\Models\MedicationLog;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class MarkMissedMedicationsCommand extends Command
{
    protected $signature = 'medications:mark-missed';

    protected $description = 'Marca como missed todos os MedicationLogs que já se passaram 1 dia de scheduled_at';

    public function handle(): int
    {
        $oneDayAgo = Carbon::now()->subDay();

        $missedLogs = MedicationLog::query()
            ->where('status', 'pending')
            ->where('scheduled_at', '<', $oneDayAgo)
            ->get();

        if ($missedLogs->isEmpty()) {
            return Command::SUCCESS;
        }

        $updated = 0;
        $failed = 0;

        foreach ($missedLogs as $log) {
            try {
                $log->update([
                    'status' => 'missed',
                ]);

                $updated++;

            } catch (\Throwable $e) {
                $failed++;
            }
        }

        return $failed > 0 ? Command::FAILURE : Command::SUCCESS;
    }
}

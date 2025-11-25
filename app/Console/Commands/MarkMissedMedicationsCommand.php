<?php

namespace App\Console\Commands;

use App\Models\MedicationLog;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class MarkMissedMedicationsCommand extends Command
{
    protected $signature = 'medications:mark-missed';

    protected $description = 'Marca como missed todos os MedicationLogs que já se passaram 1 dia de scheduled_at';

    public function handle(): int
    {
        $this->info('Verificando MedicationLogs pendentes...');

        $oneDayAgo = Carbon::now()->subDay();

        $missedLogs = MedicationLog::query()
            ->where('status', 'pending')
            ->where('scheduled_at', '<', $oneDayAgo)
            ->get();

        if ($missedLogs->isEmpty()) {
            $this->info('Nenhum MedicationLog encontrado para marcar como missed.');
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

                Log::info('MedicationLog marcado como missed', [
                    'medication_log_id' => $log->id,
                    'user_medication_id' => $log->user_medication_id,
                    'scheduled_at' => $log->scheduled_at,
                ]);
            } catch (\Throwable $e) {
                $failed++;
                Log::error('Falha ao marcar MedicationLog como missed', [
                    'medication_log_id' => $log->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $this->info("MedicationLogs atualizados: {$updated}");

        if ($failed > 0) {
            $this->error("Falhas: {$failed}");
        }

        return $failed > 0 ? Command::FAILURE : Command::SUCCESS;
    }
}

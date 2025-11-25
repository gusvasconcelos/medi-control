<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserMedication;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MedicationReorganizationService
{
    /**
     * @param array<int, array{medication_id: int, new_time_slots: array<int, string>}> $medicationSchedules
     * @return array{success: bool, message: string, reorganized_medications: array<int, array{id: int, name: string, old_time_slots: array<int, string>, new_time_slots: array<int, string>, start_date: string}>}
     */
    public function reorganizeMedications(User $user, array $medicationSchedules): array
    {
        $reorganizedMedications = [];
        $startDate = $this->determineReorganizationStartDate($user);

        DB::beginTransaction();

        try {
            foreach ($medicationSchedules as $schedule) {
                $medicationId = $schedule['medication_id'];
                $newTimeSlots = $schedule['new_time_slots'];

                $userMedication = UserMedication::query()
                    ->where('user_id', $user->id)
                    ->where('medication_id', $medicationId)
                    ->where('active', true)
                    ->first();

                if (!$userMedication) {
                    Log::warning('UserMedication not found for reorganization', [
                        'user_id' => $user->id,
                        'medication_id' => $medicationId,
                    ]);
                    continue;
                }

                $oldTimeSlots = $userMedication->time_slots ?? [];

                $userMedication->update([
                    'time_slots' => $newTimeSlots,
                ]);

                Artisan::call('notifications:schedule', [
                    '--user-medication' => $userMedication->id,
                ]);

                $reorganizedMedications[] = [
                    'id' => $userMedication->id,
                    'name' => $userMedication->medication->name ?? 'Desconhecido',
                    'old_time_slots' => $oldTimeSlots,
                    'new_time_slots' => $newTimeSlots,
                    'start_date' => $startDate->toDateString(),
                ];
            }

            DB::commit();

            return [
                'success' => true,
                'message' => 'Medicamentos reorganizados com sucesso',
                'reorganized_medications' => $reorganizedMedications,
            ];
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Failed to reorganize medications', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao reorganizar medicamentos: ' . $e->getMessage(),
                'reorganized_medications' => [],
            ];
        }
    }

    private function determineReorganizationStartDate(User $user): Carbon
    {
        return today()->addDay();
    }
}

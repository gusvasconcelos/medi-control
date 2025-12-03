<?php

namespace App\Services;

use App\Models\User;
use App\Models\Medication;
use App\Models\UserMedication;
use Illuminate\Support\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\InteractionAlert;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Artisan;
use App\Jobs\CheckUserMedicationInteractionsJob;

class UserMedicationService
{
    public function __construct(
        protected UserMedication $userMedication
    ) {
        $this->userMedication = $userMedication;
    }

    public function getUserMedications(Collection $data): Collection
    {
        $startDate = $data->get('start_date', today()->format('Y-m-d'));

        $endDate = $data->get('end_date', today()->format('Y-m-d'));

        $userId = $data->get('user_id', auth('web')->id());

        $logsDate = $data->get('logs_date');

        return UserMedication::query()
            ->disableUserScope()
            ->where('user_id', $userId)
            ->with([
                'medication',
                'logs' => function ($query) use ($startDate, $endDate, $logsDate) {
                    if ($logsDate) {
                        $query->whereDate('scheduled_at', $logsDate);
                    } else {
                        $query->whereDate('scheduled_at', '>=', $startDate)
                            ->whereDate('scheduled_at', '<=', $endDate);
                    }
                }
            ])
            ->where('active', true)
            ->where('start_date', '<=', $endDate)
            ->where(function ($query) use ($startDate) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', $startDate);
            })
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getIndicators(Collection $data): Collection
    {
        $startDate = Carbon::parse($data->get('start_date'));

        $endDate = Carbon::parse($data->get('end_date'));

        $userMedications = $this->userMedication
            ->with(['logs'])
            ->where('active', true)
            ->where('start_date', '<=', $endDate)
            ->where(function ($query) use ($startDate) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', $startDate);
            })
            ->get();

        $dateRange = Carbon::parse($startDate->format('Y-m-d'))
            ->daysUntil($endDate->format('Y-m-d'))
            ->toArray();

        $indicators = collect();

        foreach ($dateRange as $date) {
            $totalScheduled = 0;

            $totalTaken = 0;

            foreach ($userMedications as $userMedication) {
                $medStartDate = $userMedication->start_date;

                $medEndDate = $userMedication->end_date;

                if ($date < $medStartDate) {
                    continue;
                }

                if ($medEndDate && $date > $medEndDate) {
                    continue;
                }

                $timeSlots = $userMedication->time_slots ?? [];

                $totalScheduled += count($timeSlots);

                $taken = $userMedication->logs()
                    ->whereDate('scheduled_at', $date)
                    ->where('status', 'taken')
                    ->count();

                $totalTaken += $taken;
            }

            if ($totalScheduled > 0) {
                $indicators->push([
                    'date' => $date->toDateString(),
                    'total_scheduled' => $totalScheduled,
                    'total_taken' => $totalTaken,
                    'adherence_percentage' => round(($totalTaken / $totalScheduled) * 100),
                ]);
            }
        }

        return $indicators;
    }

    public function store(Collection $data): UserMedication
    {
        $medication = Medication::findOrFail($data->get('medication_id'));

        $data->put('medication_id', $medication->id);
        $data->put('current_stock', $data->get('initial_stock'));

        $userMedication = UserMedication::create($data->all());

        CheckUserMedicationInteractionsJob::dispatch($userMedication->id);

        Artisan::call('notifications:schedule', [
            '--user-medication' => $userMedication->id,
        ]);

        return $userMedication;
    }

    public function show(int $id, ?int $userId = null): UserMedication
    {
        $query = $userId
            ? $this->userMedication->disableUserScope()->where('user_id', $userId)
            : $this->userMedication;

        return $query
            ->with(['medication', 'logs'])
            ->findOrFail($id);
    }

    public function update(Collection $data, int $id): UserMedication
    {
        $userId = $data->get('user_id');

        $query = $userId
            ? $this->userMedication->disableUserScope()->where('user_id', $userId)
            : $this->userMedication;

        $userMedication = $query
            ->with(['medication', 'logs'])
            ->findOrFail($id);

        $oldTimeSlots = $userMedication->time_slots ?? [];
        $userMedication->update($data->except('user_id')->all());

        $newTimeSlots = $data->get('time_slots', $oldTimeSlots);
        if ($oldTimeSlots !== $newTimeSlots) {
            Artisan::call('notifications:schedule', [
                '--user-medication' => $userMedication->id,
            ]);
        }

        return $userMedication;
    }

    public function destroy(int $id, ?int $userId = null): void
    {
        $query = $userId
            ? $this->userMedication->disableUserScope()->where('user_id', $userId)
            : $this->userMedication;

        $userMedication = $query
            ->with(['medication', 'logs'])
            ->findOrFail($id);

        $userMedication->update(['active' => false]);
    }

    public function getAdherenceReport(Collection $data): array
    {
        $startDate = Carbon::parse($data->get('start_date'))->startOfDay();

        $endDate = Carbon::parse($data->get('end_date'))->startOfDay();

        $userId = $data->get('user_id', auth('web')->id());

        $userMedications = UserMedication::query()
            ->disableUserScope()
            ->with(['medication', 'logs' => function ($query) use ($startDate, $endDate) {
                $query->whereDate('scheduled_at', '>=', $startDate)
                    ->whereDate('scheduled_at', '<=', $endDate);
            }])
            ->where('active', true)
            ->where('start_date', '<=', $endDate)
            ->where(function ($query) use ($startDate) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', $startDate);
            })
            ->where('user_id', $userId)
            ->get();

        $interactionAlerts = $this->getInteractionAlerts($userMedications);

        $medications = [];
        $overallTotalScheduled = 0;
        $overallTotalTaken = 0;
        $overallTotalLost = 0;
        $overallTotalPending = 0;
        $overallPunctualDoses = 0;
        $overallTakenDoses = 0;

        foreach ($userMedications as $userMedication) {
            $medicationReport = $this->calculateMedicationReport(
                $userMedication,
                $startDate,
                $endDate,
                $interactionAlerts
            );

            $medications[] = $medicationReport;

            $overallTotalScheduled += $medicationReport['total_scheduled'];
            $overallTotalTaken += $medicationReport['total_taken'];
            $overallTotalLost += $medicationReport['total_lost'];
            $overallTotalPending += $medicationReport['total_pending'];
            $overallPunctualDoses += $medicationReport['punctual_doses'];
            $overallTakenDoses += $medicationReport['total_taken'];
        }

        $adherenceRate = $overallTotalScheduled > 0
            ? round(($overallTotalTaken / $overallTotalScheduled) * 100, 2)
            : 0.0;

        $punctualityRate = $overallTakenDoses > 0
            ? round(($overallPunctualDoses / $overallTakenDoses) * 100, 2)
            : 0.0;

        $medicationsForResponse = collect($medications)->map(function ($med) {
            unset($med['punctual_doses']);
            return $med;
        })->all();

        return [
            'adherence_rate' => $adherenceRate,
            'total_taken' => $overallTotalTaken,
            'total_lost' => $overallTotalLost,
            'total_pending' => $overallTotalPending,
            'punctuality_rate' => $punctualityRate,
            'medications' => $medicationsForResponse,
        ];
    }

    /**
     * @return array<int, array{for_medication_id: int, id: int, name: string, severity: string}>
     */
    private function getInteractionAlerts(Collection $userMedications): array
    {
        /** @var array<int> $medicationIds */
        $medicationIds = $userMedications->pluck('medication_id')->unique()->all();

        if (empty($medicationIds)) {
            return [];
        }

        /** @var \Illuminate\Support\Collection<int, InteractionAlert> $alerts */
        $alerts = InteractionAlert::with(['medication1', 'medication2'])
            ->where(function ($query) use ($medicationIds) {
                $query->whereIn('medication_1_id', $medicationIds)
                    ->orWhereIn('medication_2_id', $medicationIds);
            })
            ->get();

        $result = [];

        foreach ($alerts as $alert) {
            if (in_array($alert->medication_1_id, $medicationIds)) {
                $result[] = [
                    'for_medication_id' => $alert->medication_1_id,
                    'id' => $alert->medication_2_id,
                    'name' => $alert->medication2->name ?? '',
                    'severity' => $alert->severity,
                ];
            }

            if (in_array($alert->medication_2_id, $medicationIds)) {
                $result[] = [
                    'for_medication_id' => $alert->medication_2_id,
                    'id' => $alert->medication_1_id,
                    'name' => $alert->medication1->name ?? '',
                    'severity' => $alert->severity,
                ];
            }
        }

        return $result;
    }

    private function calculateMedicationReport(
        UserMedication $userMedication,
        Carbon $startDate,
        Carbon $endDate,
        array $interactionAlerts
    ): array {
        /** @var array<string> $timeSlots */
        $timeSlots = $userMedication->time_slots ?? [];
        $timeSlotsCount = count($timeSlots);

        // Normaliza as datas para garantir comparação correta (apenas data, sem hora)
        $reportStartDate = $startDate->copy()->startOfDay();
        $reportEndDate = $endDate->copy()->startOfDay();
        $medStartDate = $userMedication->start_date->copy()->startOfDay();
        $medEndDate = $userMedication->end_date
            ? $userMedication->end_date->copy()->startOfDay()
            : null;

        // Calcula o período efetivo considerando a interseção entre o período do relatório e do medicamento
        $effectiveStartDate = $medStartDate->gt($reportStartDate)
            ? $medStartDate
            : $reportStartDate;

        $effectiveEndDate = $medEndDate && $medEndDate->lt($reportEndDate)
            ? $medEndDate
            : $reportEndDate;

        // Calcula o número de dias no período (garantindo que seja pelo menos 1)
        // diffInDays retorna a diferença em dias completos, então adicionamos 1 para incluir ambos os dias
        $daysInPeriod = max(1, (int) $effectiveStartDate->diffInDays($effectiveEndDate) + 1);
        $totalScheduled = $daysInPeriod * $timeSlotsCount;

        $logs = $userMedication->logs;
        $totalTaken = $logs->where('status', 'taken')->count();
        $totalLost = $logs->whereIn('status', ['missed', 'skipped'])->count();
        $totalPending = $logs->where('status', 'pending')->count();

        $punctualDoses = $this->calculatePunctualDoses($logs);

        $punctualityRate = $totalTaken > 0
            ? round(($punctualDoses / $totalTaken) * 100, 2)
            : 0.0;

        $medicationInteractions = collect($interactionAlerts)
            ->filter(fn ($alert) => $alert['for_medication_id'] === $userMedication->medication_id)
            ->map(fn ($alert) => [
                'id' => $alert['id'],
                'name' => $alert['name'],
                'severity' => $alert['severity'],
            ])
            ->values()
            ->all();

        return [
            'id' => $userMedication->id,
            'name' => $userMedication->medication->name ?? '',
            'dosage' => $userMedication->dosage ?? '',
            'time_slots' => $timeSlots,
            'total_scheduled' => $totalScheduled,
            'total_taken' => $totalTaken,
            'total_lost' => $totalLost,
            'total_pending' => $totalPending,
            'punctuality_rate' => $punctualityRate,
            'punctual_doses' => $punctualDoses,
            'interactions' => $medicationInteractions,
        ];
    }

    private function calculatePunctualDoses(Collection $logs): int
    {
        $punctualityThresholdMinutes = 30;

        return $logs
            ->where('status', 'taken')
            ->filter(function ($log) use ($punctualityThresholdMinutes) {
                if (!$log->taken_at || !$log->scheduled_at) {
                    return false;
                }

                $diffInMinutes = abs($log->taken_at->diffInMinutes($log->scheduled_at));

                return $diffInMinutes <= $punctualityThresholdMinutes;
            })
            ->count();
    }

    /**
     * @return \Barryvdh\DomPDF\PDF
     */
    public function generateAdherenceReportPdf(Collection $data): \Barryvdh\DomPDF\PDF
    {
        $report = $this->getAdherenceReport($data);

        $startDate = Carbon::parse($data->get('start_date'))->format('d/m/Y');
        $endDate = Carbon::parse($data->get('end_date'))->format('d/m/Y');
        $generatedAt = Carbon::now()->format('d/m/Y H:i');
        $userId = $data->get('user_id', auth('web')->id());

        return Pdf::loadView('pdf.adherence-report', [
            'report' => $report,
            'startDate' => $startDate,
            'endDate' => $endDate,
            'generatedAt' => $generatedAt,
            'userName' => User::find($userId)?->name,
        ])->setPaper('a4', 'portrait');
    }
}

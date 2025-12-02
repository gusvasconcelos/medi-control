<?php

namespace App\Services;

use App\Events\RealTimeNotificationEvent;
use App\Models\MedicationLog;
use App\Models\Notification;
use App\Models\NotificationPreference;
use App\Models\UserMedication;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class MedicationLogService
{
    public function __construct(
        protected MedicationLog $medicationLog
    ) {
        $this->medicationLog = $medicationLog;
    }

    public function logTaken(Collection $data, int $userMedicationId): void
    {
        $userMedication = UserMedication::findOrFail($userMedicationId);

        $takenAt = $data->get('taken_at')
            ? Carbon::parse($data->get('taken_at'))
            : now();

        $timeSlot = $this->findClosestTimeSlot($userMedication, $takenAt);
        $scheduledAt = $takenAt->copy()->setTimeFromTimeString($timeSlot);

        if ($scheduledAt->gt($takenAt)) {
            $diffInMinutes = $scheduledAt->diffInMinutes($takenAt, false);
            if ($diffInMinutes > 720) {
                $scheduledAt = $scheduledAt->subDay();
            }
        }

        $userMedication->logs()->create([
            'scheduled_at' => $scheduledAt,
            'taken_at' => $takenAt,
            'status' => 'taken',
            'notes' => $data->get('notes'),
        ]);

        $userMedication->decrement('current_stock');

        $userMedication->refresh();

        $this->checkLowStock($userMedication);
    }

    private function findClosestTimeSlot(UserMedication $userMedication, Carbon $referenceTime): string
    {
        $timeSlots = $userMedication->time_slots ?? [];

        if (empty($timeSlots)) {
            throw new \InvalidArgumentException('UserMedication não possui time_slots configurados.');
        }

        $currentTime = $referenceTime->format('H:i');
        $closestSlot = null;
        $minDifference = PHP_INT_MAX;

        [$currentHour, $currentMinute] = explode(':', $currentTime);
        $currentMinutes = (int) $currentHour * 60 + (int) $currentMinute;

        foreach ($timeSlots as $slot) {
            [$slotHour, $slotMinute] = explode(':', $slot);
            $slotMinutes = (int) $slotHour * 60 + (int) $slotMinute;

            $difference = abs($currentMinutes - $slotMinutes);

            if ($difference > 720) {
                $difference = 1440 - $difference;
            }

            if ($difference < $minDifference) {
                $minDifference = $difference;
                $closestSlot = $slot;
            }
        }

        return $closestSlot ?? $timeSlots[0];
    }

    private function checkLowStock(UserMedication $userMedication): void
    {
        /** @var int|null $threshold */
        $threshold = $userMedication->low_stock_threshold;

        if ($threshold === null) {
            return;
        }

        if ($userMedication->current_stock > $threshold) {
            return;
        }

        /** @var NotificationPreference|null $preferences */
        $preferences = $userMedication->user->notificationPreferences;

        if (!$preferences || !$preferences->low_stock_alert) {
            return;
        }

        if ($this->lowStockNotificationExists($userMedication)) {
            return;
        }

        $notification = Notification::create([
            'user_id' => $userMedication->user_id,
            'user_medication_id' => $userMedication->id,
            'type' => 'low_stock',
            'title' => __('notifications.low_stock.title'),
            'body' => __('notifications.low_stock.body', [
                'medication' => $userMedication->medication->name,
                'quantity' => $userMedication->current_stock,
            ]),
            'scheduled_for' => now(),
            'status' => 'pending',
            'provider' => 'push',
            'metadata' => [
                'current_stock' => $userMedication->current_stock,
                'threshold' => $userMedication->low_stock_threshold,
            ],
        ]);

        RealTimeNotificationEvent::dispatch($userMedication->user_id, $notification);
    }

    private function lowStockNotificationExists(UserMedication $userMedication): bool
    {
        return Notification::query()
            ->where('user_id', $userMedication->user_id)
            ->where('user_medication_id', $userMedication->id)
            ->where('type', 'low_stock')
            ->where('status', 'pending')
            ->exists();
    }
}

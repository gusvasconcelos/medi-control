<?php

namespace App\Services\Notification;

use App\Enums\NotificationStatus;
use App\Events\RealTimeNotificationEvent;
use App\Models\InteractionAlert;
use App\Models\Notification;
use App\Models\NotificationPreference;
use App\Models\User;
use App\Models\UserMedication;
use Illuminate\Support\Carbon;

class NotificationSchedulerService
{
    private const REMINDER_MINUTES_BEFORE = 10;

    private const NOTIFICATION_SEVERITIES = ['moderate', 'severe', 'contraindicated'];

    public function scheduleForUser(User $user): int
    {
        /** @var NotificationPreference|null $preferences */
        $preferences = $user->notificationPreferences;

        if (!$preferences) {
            return 0;
        }

        $totalScheduled = 0;

        if ($preferences->medication_reminder) {
            $totalScheduled += $this->scheduleMedicationReminders($user, $preferences);
        }

        if ($preferences->interaction_alert) {
            $totalScheduled += $this->scheduleInteractionAlerts($user, $preferences);
        }

        return $totalScheduled;
    }

    public function scheduleMedicationReminders(User $user, NotificationPreference $preferences): int
    {
        $today = today();
        $scheduled = 0;

        $activeMedications = UserMedication::query()
            ->disableUserScope()
            ->where('user_id', $user->id)
            ->where('active', true)
            ->where('start_date', '<=', $today)
            ->where(function ($query) use ($today) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', $today);
            })
            ->with('medication')
            ->get();

        foreach ($activeMedications as $medication) {
            $scheduled += $this->createRemindersForMedication($user, $medication, $preferences);
        }

        return $scheduled;
    }

    public function scheduleForUserMedication(UserMedication $userMedication, NotificationPreference $preferences): int
    {
        $user = $userMedication->user;

        if (!$userMedication->active) {
            return 0;
        }

        $today = today();
        if ($userMedication->start_date > $today) {
            return 0;
        }

        if ($userMedication->end_date && $userMedication->end_date < $today) {
            return 0;
        }

        return $this->createRemindersForMedication($user, $userMedication, $preferences, true);
    }

    private function createRemindersForMedication(
        User $user,
        UserMedication $medication,
        NotificationPreference $preferences,
        bool $onlyFuture = false
    ): int {
        $timeSlots = $medication->time_slots ?? [];
        $scheduled = 0;
        $today = today();
        $now = now();

        foreach ($timeSlots as $timeSlot) {
            $scheduledTime = $today->copy()->setTimeFromTimeString($timeSlot);
            $reminderTime = $scheduledTime->copy()->subMinutes(self::REMINDER_MINUTES_BEFORE);

            if ($onlyFuture && $reminderTime->lt($now)) {
                if ($scheduledTime->lt($now)) {
                    continue;
                }
            }

            if (!$onlyFuture || $reminderTime->gte($now)) {
                if (!$this->isWithinQuietHours($reminderTime, $preferences)) {
                    if (!$this->notificationExists($user->id, $medication->id, $reminderTime, 'medication_reminder')) {
                        $this->createNotification(
                            $user,
                            $medication,
                            $reminderTime,
                            'medication_reminder',
                            __('notifications.reminder.title_before'),
                            __('notifications.reminder.body_before', [
                                'minutes' => self::REMINDER_MINUTES_BEFORE,
                                'medication' => $medication->medication->name,
                                'time' => $scheduledTime->format('H:i'),
                            ])
                        );
                        $scheduled++;
                    }
                }
            }

            if ($onlyFuture && $scheduledTime->lt($now)) {
                continue;
            }

            if ($this->isWithinQuietHours($scheduledTime, $preferences)) {
                continue;
            }

            if (!$this->notificationExists($user->id, $medication->id, $scheduledTime, 'medication_reminder')) {
                $this->createNotification(
                    $user,
                    $medication,
                    $scheduledTime,
                    'medication_reminder',
                    __('notifications.reminder.title_now'),
                    __('notifications.reminder.body_now', [
                        'medication' => $medication->medication->name ?? 'Medicamento',
                        'dosage' => $medication->dosage,
                    ])
                );
                $scheduled++;
            }
        }

        return $scheduled;
    }

    public function scheduleInteractionAlerts(User $user, NotificationPreference $preferences): int
    {
        $scheduled = 0;

        $unacknowledgedAlerts = InteractionAlert::query()
            ->disableUserScope()
            ->where('user_id', $user->id)
            ->whereNull('acknowledged_at')
            ->whereIn('severity', self::NOTIFICATION_SEVERITIES)
            ->with(['medication1', 'medication2'])
            ->get();

        foreach ($unacknowledgedAlerts as $alert) {
            $scheduledTime = now();

            if ($this->isWithinQuietHours($scheduledTime, $preferences)) {
                $scheduledTime = $this->getNextAvailableTime($preferences);
            }

            if ($this->interactionNotificationExists($user->id, $alert->id)) {
                continue;
            }

            $this->createInteractionNotification($user, $alert, $scheduledTime);
            $scheduled++;
        }

        return $scheduled;
    }

    private function createNotification(
        User $user,
        UserMedication $medication,
        Carbon $scheduledFor,
        string $type,
        string $title,
        string $body
    ): Notification {
        $notification = Notification::create([
            'user_id' => $user->id,
            'user_medication_id' => $medication->id,
            'type' => $type,
            'title' => $title,
            'body' => $body,
            'scheduled_for' => $scheduledFor,
            'status' => NotificationStatus::PENDING,
            'provider' => 'push',
            'metadata' => [
                'time_slot' => $scheduledFor->format('H:i'),
                'medication_name' => $medication->medication->name ?? null,
            ],
        ]);

        RealTimeNotificationEvent::dispatch($user->id, $notification);

        return $notification;
    }

    private function createInteractionNotification(
        User $user,
        InteractionAlert $alert,
        Carbon $scheduledFor
    ): Notification {
        $severityLabel = __('medications.interaction_severity.' . $alert->severity);

        $notification = Notification::create([
            'user_id' => $user->id,
            'user_medication_id' => null,
            'type' => 'interaction_alert',
            'title' => __('notifications.interaction.title'),
            'body' => __('notifications.interaction.body', [
                'medication1' => $alert->medication1->name ?? 'Medicamento 1',
                'medication2' => $alert->medication2->name ?? 'Medicamento 2',
                'severity' => $severityLabel,
            ]),
            'scheduled_for' => $scheduledFor,
            'status' => NotificationStatus::PENDING,
            'provider' => 'push',
            'metadata' => [
                'interaction_alert_id' => $alert->id,
                'severity' => $alert->severity,
                'medication_1_id' => $alert->medication_1_id,
                'medication_2_id' => $alert->medication_2_id,
            ],
        ]);

        RealTimeNotificationEvent::dispatch($user->id, $notification);

        return $notification;
    }

    private function notificationExists(
        int $userId,
        int $userMedicationId,
        Carbon $scheduledFor,
        string $type
    ): bool {
        return Notification::query()
            ->disableUserScope()
            ->where('user_id', $userId)
            ->where('user_medication_id', $userMedicationId)
            ->where('type', $type)
            ->where('scheduled_for', $scheduledFor)
            ->whereDate('scheduled_for', today())
            ->exists();
    }

    private function interactionNotificationExists(int $userId, int $alertId): bool
    {
        return Notification::query()
            ->disableUserScope()
            ->where('user_id', $userId)
            ->where('type', 'interaction_alert')
            ->whereJsonContains('metadata->interaction_alert_id', $alertId)
            ->where('status', 'pending')
            ->exists();
    }

    public function isWithinQuietHours(Carbon $time, NotificationPreference $preferences): bool
    {
        if (!$preferences->quiet_hours_start || !$preferences->quiet_hours_end) {
            return false;
        }

        $quietStart = Carbon::parse($preferences->quiet_hours_start);
        $quietEnd = Carbon::parse($preferences->quiet_hours_end);

        $checkTime = $time->copy()->setDate(
            $quietStart->year,
            $quietStart->month,
            $quietStart->day
        );

        if ($quietStart->gt($quietEnd)) {
            return $checkTime->gte($quietStart) || $checkTime->lt($quietEnd);
        }

        return $checkTime->gte($quietStart) && $checkTime->lt($quietEnd);
    }

    private function getNextAvailableTime(NotificationPreference $preferences): Carbon
    {
        if (!$preferences->quiet_hours_end) {
            return now();
        }

        $quietEnd = Carbon::parse($preferences->quiet_hours_end);
        $nextAvailable = today()->setTimeFrom($quietEnd);

        if ($nextAvailable->lt(now())) {
            $nextAvailable->addDay();
        }

        return $nextAvailable;
    }

    public function cleanupOldNotifications(int $daysToKeep = 30): int
    {
        return Notification::query()
            ->where('scheduled_for', '<', now()->subDays($daysToKeep))
            ->whereIn('status', ['sent', 'read'])
            ->delete();
    }
}

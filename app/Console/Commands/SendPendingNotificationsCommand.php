<?php

namespace App\Console\Commands;

use App\Enums\NotificationStatus;
use App\Models\Notification;
use App\Services\Notification\OneSignalService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SendPendingNotificationsCommand extends Command
{
    protected $signature = 'notifications:send';

    protected $description = 'Send pending notifications that are due';

    public function __construct(
        private readonly OneSignalService $oneSignalService
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        $maxDelayMinutes = 5;
        $now = now();
        $cutoffTime = $now->copy()->subMinutes($maxDelayMinutes);

        $expiredCount = Notification::query()
            ->disableUserScope()
            ->where('status', NotificationStatus::PENDING->value)
            ->where('scheduled_for', '<', $cutoffTime)
            ->whereNull('sent_at')
            ->update([
                'status' => NotificationStatus::EXPIRED->value,
                'updated_at' => $now,
            ]);

        if ($expiredCount > 0) {
            Log::info("Marked {$expiredCount} notifications as expired (>{$maxDelayMinutes} min late)");
        }

        $pendingNotifications = Notification::query()
            ->disableUserScope()
            ->where('status', NotificationStatus::PENDING->value)
            ->where('scheduled_for', '<=', $now)
            ->where('scheduled_for', '>=', $cutoffTime)
            ->whereNull('sent_at')
            ->with(['user', 'userMedication.medication'])
            ->limit(100)
            ->get();

        if ($pendingNotifications->isEmpty()) {
            return Command::SUCCESS;
        }

        $sent = 0;
        $failed = 0;

        foreach ($pendingNotifications as $notification) {
            $success = $this->sendNotification($notification);

            if ($success) {
                $sent++;
            } else {
                $failed++;
            }
        }

        if ($sent > 0 || $failed > 0) {
            $this->info("Notifications: {$sent} sent, {$failed} failed");
        }

        return $failed > 0 ? Command::FAILURE : Command::SUCCESS;
    }

    private function sendNotification(Notification $notification): bool
    {
        try {
            $user = $notification->user;

            if (! $user) {
                throw new \Exception('User not found for notification');
            }

            $additionalData = [
                'notification_id' => $notification->id,
                'type' => $notification->type,
                'user_medication_id' => $notification->user_medication_id,
            ];

            if ($notification->metadata) {
                $additionalData = array_merge($additionalData, $notification->metadata);
            }

            $sent = $this->oneSignalService->sendNotificationToUser(
                user: $user,
                title: $notification->title,
                message: $notification->body,
                additionalData: $additionalData
            );

            if ($sent) {
                $notification->update([
                    'status' => NotificationStatus::SENT,
                    'sent_at' => now(),
                ]);

                Log::info('Notification sent', [
                    'notification_id' => $notification->id,
                    'user_id' => $notification->user_id,
                    'type' => $notification->type,
                    'title' => $notification->title,
                ]);

                return true;
            }

            $notification->update([
                'status' => NotificationStatus::FAILED,
            ]);

            return false;
        } catch (\Throwable $e) {
            $notification->update([
                'status' => NotificationStatus::FAILED,
            ]);

            Log::error('Failed to send notification', [
                'notification_id' => $notification->id,
                'user_id' => $notification->user_id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }
}

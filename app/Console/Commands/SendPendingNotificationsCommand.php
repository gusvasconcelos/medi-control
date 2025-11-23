<?php

namespace App\Console\Commands;

use App\Models\Notification;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SendPendingNotificationsCommand extends Command
{
    protected $signature = 'notifications:send';

    protected $description = 'Send pending notifications that are due';

    public function handle(): int
    {
        $pendingNotifications = Notification::query()
            ->disableUserScope()
            ->where('status', 'pending')
            ->where('scheduled_for', '<=', now())
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
            $notification->update([
                'status' => 'sent',
                'sent_at' => now(),
            ]);

            Log::info('Notification sent', [
                'notification_id' => $notification->id,
                'user_id' => $notification->user_id,
                'type' => $notification->type,
                'title' => $notification->title,
            ]);

            return true;
        } catch (\Throwable $e) {
            $notification->update([
                'status' => 'failed',
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

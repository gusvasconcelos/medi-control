<?php

namespace App\Console\Commands;

use App\Models\NotificationPreference;
use App\Models\User;
use App\Models\UserMedication;
use App\Services\Notification\NotificationSchedulerService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Throwable;

class ScheduleMedicationNotificationsCommand extends Command
{
    protected $signature = 'notifications:schedule
                            {--user-medication= : Schedule notifications for a specific user medication}';

    protected $description = 'Schedule medication reminder notifications for all users or a specific medication';

    public function handle(NotificationSchedulerService $scheduler): int
    {
        $userMedicationId = $this->option('user-medication');

        if ($userMedicationId) {
            return $this->scheduleForUserMedication($scheduler, (int) $userMedicationId);
        }

        return $this->scheduleForAllUsers($scheduler);
    }

    private function scheduleForUserMedication(NotificationSchedulerService $scheduler, int $userMedicationId): int
    {
        $userMedication = UserMedication::query()
            ->disableUserScope()
            ->with(['user.notificationPreferences', 'medication'])
            ->find($userMedicationId);

        if (!$userMedication) {
            $this->error("UserMedication #{$userMedicationId} not found");

            return Command::FAILURE;
        }

        $user = $userMedication->user;

        /** @var NotificationPreference|null $preferences */
        $preferences = $user->notificationPreferences;

        if (!$preferences || !$preferences->medication_reminder) {
            $this->warn("User #{$user->id} has medication reminders disabled");

            return Command::SUCCESS;
        }

        try {
            $scheduled = $scheduler->scheduleForUserMedication($userMedication, $preferences);
            $this->info("Scheduled {$scheduled} notifications for UserMedication #{$userMedicationId}");

            return Command::SUCCESS;
        } catch (Throwable $e) {
            Log::error('Failed to schedule notifications for user medication', [
                'user_medication_id' => $userMedicationId,
                'error' => $e->getMessage(),
            ]);
            $this->error("Error: {$e->getMessage()}");

            return Command::FAILURE;
        }
    }

    private function scheduleForAllUsers(NotificationSchedulerService $scheduler): int
    {
        $this->info('Starting notification scheduling...');

        $usersWithPreferences = User::query()
            ->whereHas('notificationPreferences', function ($query) {
                $query->where('medication_reminder', true)
                    ->orWhere('interaction_alert', true);
            })
            ->with('notificationPreferences')
            ->cursor();

        $totalUsers = 0;
        $totalNotifications = 0;
        $errors = 0;

        foreach ($usersWithPreferences as $user) {
            try {
                $scheduled = $scheduler->scheduleForUser($user);
                $totalNotifications += $scheduled;
                $totalUsers++;

                if ($scheduled > 0) {
                    $this->line("  User #{$user->id}: {$scheduled} notifications scheduled");
                }
            } catch (Throwable $e) {
                $errors++;
                Log::error('Failed to schedule notifications for user', [
                    'user_id' => $user->id,
                    'error' => $e->getMessage(),
                ]);
                $this->error("  User #{$user->id}: Error - {$e->getMessage()}");
            }
        }

        $this->newLine();
        $this->displayReport($totalUsers, $totalNotifications, $errors);

        return $errors > 0 ? Command::FAILURE : Command::SUCCESS;
    }

    private function displayReport(int $totalUsers, int $totalNotifications, int $errors): void
    {
        $this->info('═══════════════════════════════════════════════════════════');
        $this->info('              NOTIFICATION SCHEDULING REPORT               ');
        $this->info('═══════════════════════════════════════════════════════════');
        $this->newLine();

        $this->table(
            ['Metric', 'Value'],
            [
                ['Users processed', $totalUsers],
                ['Notifications scheduled', "<fg=green>{$totalNotifications}</>"],
                ['Errors', $errors > 0 ? "<fg=red>{$errors}</>" : "<fg=green>0</>"],
            ]
        );

        $this->newLine();

        if ($totalNotifications > 0) {
            $this->info("✓ {$totalNotifications} notifications scheduled successfully!");
        } else {
            $this->warn('⚠ No notifications were scheduled.');
        }

        $this->newLine();
    }
}

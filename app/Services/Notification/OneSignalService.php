<?php

namespace App\Services\Notification;

use App\Models\User;
use App\Models\UserDevice;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OneSignalService
{
    private string $appId;

    private string $restApiKey;

    private string $apiUrl;

    public function __construct()
    {
        $this->appId = config('onesignal.app_id');
        $this->restApiKey = config('onesignal.rest_api_key');
        $this->apiUrl = config('onesignal.api_url');
    }

    public function sendNotificationToUser(
        User $user,
        string $title,
        string $message,
        array $additionalData = []
    ): bool {
        $playerIds = $user->activeDevices()
            ->pluck('onesignal_player_id')
            ->toArray();

        if (empty($playerIds)) {
            Log::warning('User does not have any active devices', [
                'user_id' => $user->id,
            ]);

            return false;
        }

        return $this->sendNotification(
            playerIds: $playerIds,
            title: $title,
            message: $message,
            additionalData: $additionalData
        );
    }

    public function sendNotificationToMultipleUsers(
        array $users,
        string $title,
        string $message,
        array $additionalData = []
    ): bool {
        $userIds = collect($users)->pluck('id')->toArray();

        $playerIds = UserDevice::query()
            ->whereIn('user_id', $userIds)
            ->where('active', true)
            ->pluck('onesignal_player_id')
            ->toArray();

        if (empty($playerIds)) {
            Log::warning('No valid OneSignal player IDs found for users');

            return false;
        }

        return $this->sendNotification(
            playerIds: $playerIds,
            title: $title,
            message: $message,
            additionalData: $additionalData
        );
    }

    public function sendNotification(
        array $playerIds,
        string $title,
        string $message,
        array $additionalData = []
    ): bool {
        if (empty($playerIds)) {
            Log::warning('No player IDs provided for notification');

            return false;
        }

        try {
            $payload = [
                'app_id' => $this->appId,
                'include_player_ids' => $playerIds,
                'headings' => ['en' => $title],
                'contents' => ['en' => $message],
                'web_url' => config('app.url'),
            ];

            if (! empty($additionalData)) {
                $payload['data'] = $additionalData;
            }

            $response = Http::withHeaders([
                'Authorization' => 'Basic ' . $this->restApiKey,
                'Content-Type' => 'application/json',
            ])->post($this->apiUrl . '/notifications', $payload);

            if ($response->successful()) {
                Log::info('OneSignal notification sent successfully', [
                    'player_ids_count' => count($playerIds),
                    'response' => $response->json(),
                ]);

                return true;
            }

            Log::error('OneSignal notification failed', [
                'status' => $response->status(),
                'response' => $response->body(),
                'player_ids_count' => count($playerIds),
            ]);

            return false;
        } catch (\Throwable $e) {
            Log::error('OneSignal notification exception', [
                'message' => $e->getMessage(),
                'player_ids_count' => count($playerIds),
            ]);

            return false;
        }
    }

    public function registerDevice(
        User $user,
        string $playerId,
        ?string $deviceType = null,
        ?string $browser = null,
        ?string $os = null,
        ?string $deviceName = null
    ): UserDevice {
        $device = UserDevice::updateOrCreate(
            [
                'user_id' => $user->id,
                'onesignal_player_id' => $playerId,
            ],
            [
                'device_type' => $deviceType,
                'browser' => $browser,
                'os' => $os,
                'device_name' => $deviceName,
                'last_seen_at' => now(),
                'active' => true,
            ]
        );

        Log::info('OneSignal device registered for user', [
            'user_id' => $user->id,
            'device_id' => $device->id,
            'player_id' => $playerId,
            'device_type' => $deviceType,
        ]);

        return $device;
    }

    public function unregisterDevice(User $user, string $playerId): bool
    {
        try {
            $device = UserDevice::where('user_id', $user->id)
                ->where('onesignal_player_id', $playerId)
                ->first();

            if (! $device) {
                Log::warning('Device not found for unregistration', [
                    'user_id' => $user->id,
                    'player_id' => $playerId,
                ]);

                return false;
            }

            $device->deactivate();

            Log::info('OneSignal device unregistered for user', [
                'user_id' => $user->id,
                'device_id' => $device->id,
                'player_id' => $playerId,
            ]);

            return true;
        } catch (\Throwable $e) {
            Log::error('Failed to unregister OneSignal device', [
                'user_id' => $user->id,
                'player_id' => $playerId,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    public function unregisterAllDevicesForUser(User $user): int
    {
        $count = $user->activeDevices()->count();

        $user->activeDevices()->update(['active' => false]);

        Log::info('All OneSignal devices unregistered for user', [
            'user_id' => $user->id,
            'devices_count' => $count,
        ]);

        return $count;
    }
}

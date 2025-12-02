<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Notification\OneSignalService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OneSignalController extends Controller
{
    public function __construct(
        private readonly OneSignalService $oneSignalService
    ) {
    }

    public function registerPlayerId(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'player_id' => 'required|string|max:255',
            'device_type' => 'nullable|in:desktop,mobile,tablet',
            'browser' => 'nullable|string|max:255',
            'os' => 'nullable|string|max:255',
            'device_name' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();

        if (! $user) {
            return response()->json([
                'message' => 'Unauthenticated',
            ], 401);
        }

        $device = $this->oneSignalService->registerDevice(
            user: $user,
            playerId: $request->input('player_id'),
            deviceType: $request->input('device_type'),
            browser: $request->input('browser'),
            os: $request->input('os'),
            deviceName: $request->input('device_name')
        );

        return response()->json([
            'message' => 'Device registered successfully',
            'device' => [
                'id' => $device->id,
                'player_id' => $device->onesignal_player_id,
                'device_type' => $device->device_type,
                'browser' => $device->browser,
                'os' => $device->os,
                'device_name' => $device->device_name,
            ],
        ]);
    }

    public function unregisterPlayerId(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'player_id' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();

        if (! $user) {
            return response()->json([
                'message' => 'Unauthenticated',
            ], 401);
        }

        $success = $this->oneSignalService->unregisterDevice(
            user: $user,
            playerId: $request->input('player_id')
        );

        if ($success) {
            return response()->json([
                'message' => 'Device unregistered successfully',
            ]);
        }

        return response()->json([
            'message' => 'Failed to unregister device',
        ], 500);
    }

    public function getDevices(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'message' => 'Unauthenticated',
            ], 401);
        }

        $devices = $user->devices()->orderBy('last_seen_at', 'desc')->get();

        return response()->json([
            'data' => $devices->map(fn ($device) => [
                'id' => $device->id,
                'device_type' => $device->device_type,
                'browser' => $device->browser,
                'os' => $device->os,
                'device_name' => $device->device_name,
                'last_seen_at' => $device->last_seen_at?->toISOString(),
                'active' => $device->active,
                'created_at' => $device->created_at->toISOString(),
            ]),
        ]);
    }
}

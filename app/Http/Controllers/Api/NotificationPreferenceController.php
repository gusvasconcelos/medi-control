<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\NotificationPreference\UpdateNotificationPreferenceRequest;
use App\Models\NotificationPreference;
use Illuminate\Http\JsonResponse;

class NotificationPreferenceController extends Controller
{
    public function show(): JsonResponse
    {
        $preferences = NotificationPreference::query()
            ->where('user_id', auth()->id())
            ->first();

        if (!$preferences) {
            $preferences = NotificationPreference::create([
                'user_id' => auth()->id(),
                'medication_reminder' => true,
                'low_stock_alert' => true,
                'interaction_alert' => true,
                'push_enabled' => true,
                'whatsapp_enabled' => false,
            ]);
        }

        return response()->json(['data' => $preferences]);
    }

    public function update(UpdateNotificationPreferenceRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $preferences = NotificationPreference::query()
            ->where('user_id', auth()->id())
            ->first();

        if (!$preferences) {
            $preferences = NotificationPreference::create([
                'user_id' => auth()->id(),
                ...$validated,
            ]);
        } else {
            $preferences->update($validated);
        }

        return response()->json([
            'message' => __('notifications.preferences.updated'),
            'data' => $preferences->fresh(),
        ]);
    }
}

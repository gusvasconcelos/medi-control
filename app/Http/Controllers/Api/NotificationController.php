<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $type = $request->input('type');
        $status = $request->input('status');

        $query = Notification::query()
            ->where('user_id', auth()->id())
            ->orderByDesc('scheduled_for');

        if ($type) {
            $query->where('type', $type);
        }

        if ($status) {
            $query->where('status', $status);
        }

        $notifications = $query->paginate($perPage);

        return response()->json($notifications);
    }

    public function unreadCount(): JsonResponse
    {
        $count = Notification::query()
            ->where('user_id', auth()->id())
            ->whereIn('status', ['sent', 'pending'])
            ->whereNull('read_at')
            ->count();

        return response()->json(['data' => ['count' => $count]]);
    }

    public function markAsRead(int $id): JsonResponse
    {
        $notification = Notification::query()
            ->where('user_id', auth()->id())
            ->findOrFail($id);

        $notification->update([
            'read_at' => now(),
            'status' => 'read',
        ]);

        return response()->json([
            'message' => __('notifications.marked_as_read'),
            'data' => $notification->fresh(),
        ]);
    }

    public function markAllAsRead(): JsonResponse
    {
        Notification::query()
            ->where('user_id', auth()->id())
            ->whereNull('read_at')
            ->update([
                'read_at' => now(),
                'status' => 'read',
            ]);

        return response()->json([
            'message' => __('notifications.all_marked_as_read'),
        ]);
    }

    public function recent(): JsonResponse
    {
        $notifications = Notification::query()
            ->where('user_id', auth()->id())
            ->whereIn('status', ['sent', 'pending', 'read'])
            ->orderByDesc('scheduled_for')
            ->limit(10)
            ->get();

        return response()->json(['data' => $notifications]);
    }

    public function clearAll(): JsonResponse
    {
        $deletedCount = Notification::query()
            ->where('user_id', auth()->id())
            ->delete();

        return response()->json([
            'message' => __('notifications.all_cleared'),
            'data' => ['count' => $deletedCount],
        ]);
    }
}

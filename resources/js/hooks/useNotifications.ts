import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '@/services/notificationService';
import type { Notification } from '@/types';

interface UseNotificationsReturn {
    recentNotifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    fetchUnreadCount: () => Promise<void>;
    fetchRecentNotifications: () => Promise<void>;
    markAsRead: (notificationId: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    clearAll: () => Promise<void>;
}

export function useNotifications(userId?: number): UseNotificationsReturn {
    const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const count = await notificationService.getUnreadCount();
            setUnreadCount(count);
        } catch {
            // Silently fail
        }
    }, []);

    const fetchRecentNotifications = useCallback(async () => {
        setIsLoading(true);
        try {
            const recent = await notificationService.getRecent();
            setRecentNotifications(recent);
        } catch {
            // Silently fail
        } finally {
            setIsLoading(false);
        }
    }, []);

    const markAsRead = useCallback(async (notificationId: number) => {
        try {
            await notificationService.markAsRead(notificationId);
            setRecentNotifications((prev) =>
                prev.map((n) =>
                    n.id === notificationId ? { ...n, read_at: new Date().toISOString(), status: 'read' } : n
                )
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch {
            // Silently fail
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        try {
            await notificationService.markAllAsRead();
            setRecentNotifications((prev) =>
                prev.map((n) => ({ ...n, read_at: new Date().toISOString(), status: 'read' as const }))
            );
            setUnreadCount(0);
        } catch {
            // Silently fail
        }
    }, []);

    const clearAll = useCallback(async () => {
        try {
            await notificationService.clearAll();
            setRecentNotifications([]);
            setUnreadCount(0);
        } catch {
            // Silently fail
        }
    }, []);

    useEffect(() => {
        fetchUnreadCount();
        fetchRecentNotifications();
    }, [fetchUnreadCount, fetchRecentNotifications]);

    useEffect(() => {
        if (!userId || !window.Echo) {
            return;
        }

        const channel = window.Echo.private(`notifications.${userId}`);

        channel.listen('.new-notification', (event: { notification: Notification }) => {
            const newNotification = event.notification;

            setRecentNotifications((prev) => {
                const exists = prev.some((n) => n.id === newNotification.id);
                if (exists) {
                    return prev;
                }
                return [newNotification, ...prev].slice(0, 10);
            });

            if (!newNotification.read_at) {
                setUnreadCount((prev) => prev + 1);
            }
        });

        return () => {
            channel.stopListening('.new-notification');
            window.Echo.leave(`notifications.${userId}`);
        };
    }, [userId]);

    return {
        recentNotifications,
        unreadCount,
        isLoading,
        fetchUnreadCount,
        fetchRecentNotifications,
        markAsRead,
        markAllAsRead,
        clearAll,
    };
}

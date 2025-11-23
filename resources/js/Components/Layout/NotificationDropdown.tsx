import { useState, useEffect, useCallback } from 'react';
import { Bell, Clock, AlertTriangle, Package, Check, ExternalLink } from 'lucide-react';
import { notificationService } from '@/services/notificationService';
import type { Notification, NotificationType } from '@/types';

interface NotificationDropdownProps {
    onNotificationClick?: (notification: Notification) => void;
}

function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'agora';
    if (diffMinutes < 60) return `${diffMinutes}min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('pt-BR');
}

function getNotificationIcon(type: NotificationType) {
    switch (type) {
        case 'medication_reminder':
            return <Clock className="w-4 h-4" />;
        case 'interaction_alert':
            return <AlertTriangle className="w-4 h-4" />;
        case 'low_stock':
            return <Package className="w-4 h-4" />;
        default:
            return <Bell className="w-4 h-4" />;
    }
}

function getNotificationColor(type: NotificationType): string {
    switch (type) {
        case 'medication_reminder':
            return 'text-primary bg-primary/10';
        case 'interaction_alert':
            return 'text-warning bg-warning/10';
        case 'low_stock':
            return 'text-info bg-info/10';
        default:
            return 'text-base-content bg-base-300';
    }
}

export function NotificationDropdown({ onNotificationClick }: NotificationDropdownProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [recent, count] = await Promise.all([
                notificationService.getRecent(),
                notificationService.getUnreadCount(),
            ]);
            setNotifications(recent);
            setUnreadCount(count);
        } catch {
            // Silently fail
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();

        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const handleMarkAsRead = async (notification: Notification) => {
        if (notification.read_at) return;

        try {
            await notificationService.markAsRead(notification.id);
            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === notification.id ? { ...n, read_at: new Date().toISOString(), status: 'read' } : n
                )
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch {
            // Silently fail
        }

        onNotificationClick?.(notification);
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications((prev) =>
                prev.map((n) => ({ ...n, read_at: new Date().toISOString(), status: 'read' as const }))
            );
            setUnreadCount(0);
        } catch {
            // Silently fail
        }
    };

    return (
        <div className="dropdown dropdown-end">
            <button
                type="button"
                tabIndex={0}
                className="btn btn-ghost btn-circle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Notificações"
            >
                <div className="indicator">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="badge badge-sm badge-primary indicator-item">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </div>
            </button>

            <div
                tabIndex={0}
                className={`dropdown-content z-[100] menu shadow-lg bg-base-100 rounded-box w-80 sm:w-96 border border-base-300 ${
                    isOpen ? 'block' : 'hidden'
                }`}
            >
                <div className="p-3 border-b border-base-300 flex items-center justify-between">
                    <h3 className="font-semibold">Notificações</h3>
                    {unreadCount > 0 && (
                        <button
                            type="button"
                            className="btn btn-ghost btn-xs"
                            onClick={handleMarkAllAsRead}
                        >
                            <Check className="w-3 h-3 mr-1" />
                            Marcar todas
                        </button>
                    )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                    {isLoading ? (
                        <div className="p-4 flex justify-center">
                            <span className="loading loading-spinner loading-sm" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-4 text-center text-base-content/60">
                            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Nenhuma notificação</p>
                        </div>
                    ) : (
                        <ul className="menu menu-compact p-0">
                            {notifications.map((notification) => (
                                <li key={notification.id}>
                                    <button
                                        type="button"
                                        className={`flex items-start gap-3 p-3 hover:bg-base-200 ${
                                            !notification.read_at ? 'bg-primary/5' : ''
                                        }`}
                                        onClick={() => handleMarkAsRead(notification)}
                                    >
                                        <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0 text-left">
                                            <p className={`text-sm font-medium truncate ${!notification.read_at ? 'text-base-content' : 'text-base-content/70'}`}>
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-base-content/60 line-clamp-2">
                                                {notification.body}
                                            </p>
                                            <p className="text-xs text-base-content/40 mt-1">
                                                {formatRelativeTime(notification.scheduled_for)}
                                            </p>
                                        </div>
                                        {!notification.read_at && (
                                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="p-2 border-t border-base-300">
                    <a
                        href="/notifications"
                        className="btn btn-ghost btn-sm btn-block justify-center"
                    >
                        Ver todas
                        <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                </div>
            </div>
        </div>
    );
}

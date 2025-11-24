import { useState, useEffect, useCallback } from 'react';
import { Bell, Clock, AlertTriangle, Package, Check, ExternalLink, Settings } from 'lucide-react';
import { notificationService } from '@/services/notificationService';
import { ResponsiveModal } from '@/Components/Modal/ResponsiveModal';
import type { Notification, NotificationType } from '@/types';
import { router } from '@inertiajs/react';

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
    const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);
    const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoadingModal, setIsLoadingModal] = useState(false);
    const [isLoadingRecent, setIsLoadingRecent] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const count = await notificationService.getUnreadCount();
            setUnreadCount(count);
        } catch {
            // Silently fail
        }
    }, []);

    const fetchRecentNotifications = useCallback(async () => {
        setIsLoadingRecent(true);
        try {
            const recent = await notificationService.getRecent();
            setRecentNotifications(recent);
        } catch {
            // Silently fail
        } finally {
            setIsLoadingRecent(false);
        }
    }, []);

    const fetchAllNotifications = useCallback(async (page: number = 1) => {
        setIsLoadingModal(true);
        try {
            const response = await notificationService.getNotifications({
                page,
                per_page: 20,
            });
            setAllNotifications(response.data);
            setCurrentPage(response.current_page);
            setTotalPages(response.last_page);
        } catch {
            // Silently fail
        } finally {
            setIsLoadingModal(false);
        }
    }, []);

    useEffect(() => {
        fetchUnreadCount();
        fetchRecentNotifications();

        const interval = setInterval(() => {
            fetchUnreadCount();
            fetchRecentNotifications();
        }, 60000);
        return () => clearInterval(interval);
    }, [fetchUnreadCount, fetchRecentNotifications]);

    // Fechar dropdown ao clicar fora
    useEffect(() => {
        if (!isDropdownOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const dropdown = target.closest('.dropdown.dropdown-end');
            const button = target.closest('button[aria-label="Notificações"]');
            const dropdownContent = target.closest('.dropdown-content');

            // Não fechar se clicou no botão ou dentro do conteúdo do dropdown
            if (button || dropdownContent) {
                return;
            }

            // Fechar se clicou fora do dropdown
            if (!dropdown || !dropdown.contains(target)) {
                setIsDropdownOpen(false);
            }
        };

        // Usar setTimeout para evitar fechar imediatamente após abrir
        const timeoutId = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 200);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    useEffect(() => {
        if (isModalOpen) {
            // Aguardar o React renderizar o modal no DOM
            const timeoutId = setTimeout(() => {
                const modal = document.getElementById('notifications-modal') as HTMLElement & { showPopover?: () => void };
                if (modal?.showPopover) {
                    try {
                        modal.showPopover();
                    } catch (error) {
                        console.error('Erro ao abrir modal de notificações:', error);
                    }
                } else {
                    // Tentar novamente se não encontrou
                    setTimeout(() => {
                        const modalRetry = document.getElementById('notifications-modal') as HTMLElement & { showPopover?: () => void };
                        if (modalRetry?.showPopover) {
                            try {
                                modalRetry.showPopover();
                            } catch (error) {
                                console.error('Erro ao abrir modal de notificações (retry):', error);
                            }
                        }
                    }, 50);
                }
            }, 50);

            return () => clearTimeout(timeoutId);
        }
    }, [isModalOpen]);

    const handleMarkAsRead = async (notification: Notification) => {
        if (notification.read_at) return;

        try {
            await notificationService.markAsRead(notification.id);
            setRecentNotifications((prev) =>
                prev.map((n) =>
                    n.id === notification.id ? { ...n, read_at: new Date().toISOString(), status: 'read' } : n
                )
            );
            setAllNotifications((prev) =>
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
            setRecentNotifications((prev) =>
                prev.map((n) => ({ ...n, read_at: new Date().toISOString(), status: 'read' as const }))
            );
            setAllNotifications((prev) =>
                prev.map((n) => ({ ...n, read_at: new Date().toISOString(), status: 'read' as const }))
            );
            setUnreadCount(0);
            fetchUnreadCount();
        } catch {
            // Silently fail
        }
    };

    const handleOpenModal = () => {
        setIsDropdownOpen(false);
        setIsModalOpen(true);
        fetchAllNotifications(1);
    };

    const handleCloseModal = () => {
        const modal = document.getElementById('notifications-modal') as HTMLElement & { hidePopover?: () => void };
        if (modal?.hidePopover) {
            modal.hidePopover();
        }
        setIsModalOpen(false);
        // Recarregar notificações recentes quando fechar o modal
        fetchRecentNotifications();
        fetchUnreadCount();
    };

    // Listener para quando o popover é fechado pelo backdrop
    useEffect(() => {
        if (!isModalOpen) return;

        const modal = document.getElementById('notifications-modal');
        if (!modal) return;

        const handleToggle = (e: Event) => {
            const target = e.target as HTMLElement;
            if (target.id === 'notifications-modal') {
                // Verificar se o popover foi fechado
                const isOpen = target.matches(':popover-open');
                if (!isOpen && isModalOpen) {
                    setIsModalOpen(false);
                    fetchRecentNotifications();
                    fetchUnreadCount();
                }
            }
        };

        modal.addEventListener('toggle', handleToggle);
        return () => {
            modal.removeEventListener('toggle', handleToggle);
        };
    }, [isModalOpen, fetchRecentNotifications, fetchUnreadCount]);

    const handlePageChange = (page: number) => {
        fetchAllNotifications(page);
    };

    const modalFooter = (
        <div className="flex items-center justify-between">
            <div className="flex gap-2">
                {currentPage > 1 && (
                    <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        Anterior
                    </button>
                )}
                {currentPage < totalPages && (
                    <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        Próxima
                    </button>
                )}
            </div>
            <div className="text-sm text-base-content/60">
                Página {currentPage} de {totalPages}
            </div>
        </div>
    );

    const handleToggleDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const newState = !isDropdownOpen;
        setIsDropdownOpen(newState);
    };

    const handleOpenPreferences = () => {
        setIsDropdownOpen(false);
        setIsModalOpen(false);
        router.visit('/settings/notifications');
    };

    return (
        <>
            <div className={`dropdown dropdown-end ${isDropdownOpen ? 'dropdown-open' : ''}`}>
                <button
                    type="button"
                    tabIndex={0}
                    className="btn btn-ghost btn-circle"
                    onClick={handleToggleDropdown}
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
                    className="dropdown-content z-[100] menu shadow-lg bg-base-100 rounded-box w-80 sm:w-96 border border-base-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-3 border-b border-base-300 flex items-center justify-between">
                        <h3 className="font-semibold">Notificações</h3>
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                className="btn btn-ghost btn-xs"
                                onClick={handleMarkAllAsRead}
                            >
                                <Check className="size-4 mr-1" />
                                Marcar todas
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {isLoadingRecent ? (
                            <div className="p-4 flex justify-center">
                                <span className="loading loading-spinner loading-sm" />
                            </div>
                        ) : recentNotifications.length === 0 ? (
                            <div className="p-4 text-center text-base-content/60">
                                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Nenhuma notificação</p>
                            </div>
                        ) : (
                            <ul className="menu menu-compact p-0">
                                {recentNotifications.map((notification) => (
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

                    <div className="flex justify-center p-2 border-t border-base-300 gap-2">
                        <button
                            type="button"
                            className="btn btn-ghost btn-sm justify-center w-1/2"
                            onClick={handleOpenModal}
                        >
                            Ver todas
                            <ExternalLink className="size-4 ml-1" />
                        </button>
                        <button
                            type="button"
                            className="btn btn-ghost btn-sm justify-center w-1/2"
                            onClick={handleOpenPreferences}
                        >
                            Configurar preferências
                            <Settings className="size-4 ml-1" />
                        </button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <ResponsiveModal
                    id="notifications-modal"
                    title="Notificações"
                    onClose={handleCloseModal}
                    footer={modalFooter}
                >
                    <div className="flex items-center justify-between mb-4">
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                className="btn btn-ghost btn-sm"
                                onClick={handleMarkAllAsRead}
                            >
                                <Check className="w-4 h-4 mr-1" />
                                Marcar todas
                            </button>
                        )}
                    </div>

                    {isLoadingModal ? (
                        <div className="flex justify-center py-8">
                            <span className="loading loading-spinner loading-md" />
                        </div>
                    ) : allNotifications.length === 0 ? (
                        <div className="text-center py-12 text-base-content/60">
                            <Bell className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">Nenhuma notificação</p>
                            <p className="text-sm mt-2">Você está em dia com suas notificações!</p>
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {allNotifications.map((notification) => (
                                <li key={notification.id}>
                                    <button
                                        type="button"
                                        className={`w-full flex items-start gap-3 p-4 rounded-lg hover:bg-base-200 transition-colors ${
                                            !notification.read_at ? 'bg-primary/5 border border-primary/20' : 'bg-base-100 border border-base-300'
                                        }`}
                                        onClick={() => handleMarkAsRead(notification)}
                                    >
                                        <div className={`p-2 rounded-full flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0 text-left">
                                            <p className={`text-sm font-medium ${!notification.read_at ? 'text-base-content' : 'text-base-content/70'}`}>
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-base-content/60 mt-1 line-clamp-3">
                                                {notification.body}
                                            </p>
                                            <p className="text-xs text-base-content/40 mt-2">
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
                </ResponsiveModal>
            )}
        </>
    );
}

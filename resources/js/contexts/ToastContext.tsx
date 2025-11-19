import React, { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type { Toast, ToastContextType, ToastOptions, ToastType } from '@/types';

const TOAST_QUEUE_MAX_SIZE = 5;

const DEFAULT_DURATIONS: Record<ToastType, number> = {
    success: 5000,
    info: 5000,
    warning: 7000,
    error: 7000,
};

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((toastId: string) => {
        setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== toastId));
    }, []);

    const addToast = useCallback(
        (type: ToastType, message: string, options?: ToastOptions) => {
            const toastId = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            const duration = options?.duration ?? DEFAULT_DURATIONS[type];

            const newToast: Toast = {
                id: toastId,
                type,
                message,
                duration,
            };

            setToasts((currentToasts) => {
                const updatedToasts = [...currentToasts, newToast];

                // Enforce queue size limit
                if (updatedToasts.length > TOAST_QUEUE_MAX_SIZE) {
                    return updatedToasts.slice(-TOAST_QUEUE_MAX_SIZE);
                }

                return updatedToasts;
            });

            // Auto-dismiss if duration is set
            if (duration > 0) {
                setTimeout(() => {
                    removeToast(toastId);
                }, duration);
            }
        },
        [removeToast]
    );

    const showSuccess = useCallback(
        (message: string, options?: ToastOptions) => {
            addToast('success', message, options);
        },
        [addToast]
    );

    const showError = useCallback(
        (message: string, options?: ToastOptions) => {
            addToast('error', message, options);
        },
        [addToast]
    );

    const showWarning = useCallback(
        (message: string, options?: ToastOptions) => {
            addToast('warning', message, options);
        },
        [addToast]
    );

    const showInfo = useCallback(
        (message: string, options?: ToastOptions) => {
            addToast('info', message, options);
        },
        [addToast]
    );

    const contextValue: ToastContextType = {
        toasts,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        removeToast,
    };

    return <ToastContext.Provider value={contextValue}>{children}</ToastContext.Provider>;
};

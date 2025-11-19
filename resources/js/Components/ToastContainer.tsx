import React, { useContext } from 'react';
import { ToastContext } from '@/contexts/ToastContext';
import type { Toast, ToastType } from '@/types';

const TOAST_TYPE_CLASSES: Record<ToastType, string> = {
    success: 'alert-success',
    error: 'alert-error',
    warning: 'alert-warning',
    info: 'alert-info',
};

const TOAST_TYPE_ICONS: Record<ToastType, JSX.Element> = {
    success: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    ),
    error: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    ),
    warning: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
        </svg>
    ),
    info: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    ),
};

const TOAST_TYPE_ARIA_LABELS: Record<ToastType, string> = {
    success: 'Success notification',
    error: 'Error notification',
    warning: 'Warning notification',
    info: 'Information notification',
};

interface ToastItemProps {
    toast: Toast;
    onClose: (toastId: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
    const alertClass = TOAST_TYPE_CLASSES[toast.type];
    const icon = TOAST_TYPE_ICONS[toast.type];
    const ariaLabel = TOAST_TYPE_ARIA_LABELS[toast.type];

    return (
        <div
            className={`alert ${alertClass} shadow-lg`}
            role="alert"
            aria-live="polite"
            aria-label={ariaLabel}
        >
            {icon}
            <span>{toast.message}</span>
            <button
                onClick={() => onClose(toast.id)}
                className="btn btn-sm btn-circle btn-ghost"
                aria-label="Close notification"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

export const ToastContainer: React.FC = () => {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error('ToastContainer must be used within ToastProvider');
    }

    const { toasts, removeToast } = context;

    if (toasts.length === 0) {
        return null;
    }

    return (
        <div className="toast toast-bottom toast-center z-50">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
            ))}
        </div>
    );
};

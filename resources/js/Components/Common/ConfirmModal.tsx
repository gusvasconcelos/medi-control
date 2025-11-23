import { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    isSubmitting?: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'error' | 'warning' | 'info';
    modalId?: string;
    onClose: () => void;
    onConfirm: () => void;
}

export function ConfirmModal({
    isOpen,
    isSubmitting = false,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'warning',
    modalId = 'confirm-modal',
    onClose,
    onConfirm,
}: ConfirmModalProps) {
    useEffect(() => {
        if (isOpen) {
            const modal = document.getElementById(modalId) as HTMLDialogElement;
            modal?.showModal?.();
        }
    }, [isOpen, modalId]);

    const variantStyles = {
        error: {
            iconBg: 'bg-error/10',
            iconColor: 'text-error',
            buttonClass: 'btn-error',
        },
        warning: {
            iconBg: 'bg-warning/10',
            iconColor: 'text-warning',
            buttonClass: 'btn-warning',
        },
        info: {
            iconBg: 'bg-info/10',
            iconColor: 'text-info',
            buttonClass: 'btn-info',
        },
    };

    const styles = variantStyles[variant];

    return (
        <dialog id={modalId} className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button
                        type="button"
                        className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </form>

                <div className="flex items-start gap-4">
                    <div className={`rounded-full ${styles.iconBg} p-3`}>
                        <AlertTriangle className={`h-6 w-6 ${styles.iconColor}`} />
                    </div>
                    <div className="flex-1">
                        <h3 className="mb-2 text-xl font-bold">{title}</h3>
                        <p className="mb-4 text-base-content/70">{message}</p>
                    </div>
                </div>

                <div className="modal-action">
                    <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        className={`btn ${styles.buttonClass}`}
                        onClick={onConfirm}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                >
                    close
                </button>
            </form>
        </dialog>
    );
}


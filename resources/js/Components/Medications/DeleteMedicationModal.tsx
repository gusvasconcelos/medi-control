import { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import type { Medication } from '@/types';

interface DeleteMedicationModalProps {
    medication: Medication | null;
    isOpen: boolean;
    isSubmitting?: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export function DeleteMedicationModal({
    medication,
    isOpen,
    isSubmitting = false,
    onClose,
    onConfirm,
}: DeleteMedicationModalProps) {
    useEffect(() => {
        if (isOpen && medication) {
            document.getElementById('delete-medication-modal')?.showModal?.();
        }
    }, [isOpen, medication]);

    if (!medication) return null;

    return (
        <dialog id="delete-medication-modal" className="modal">
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
                    <div className="rounded-full bg-error/10 p-3">
                        <AlertTriangle className="h-6 w-6 text-error" />
                    </div>
                    <div className="flex-1">
                        <h3 className="mb-2 text-xl font-bold">
                            Deletar Medicamento
                        </h3>
                        <p className="mb-4 text-base-content/70">
                            Tem certeza que deseja deletar o medicamento{' '}
                            <strong>{medication.name}</strong>?
                        </p>
                        <p className="text-sm text-warning">
                            Esta ação não pode ser desfeita.
                        </p>
                    </div>
                </div>

                <div className="modal-action">
                    <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className="btn btn-error"
                        onClick={onConfirm}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            'Deletar'
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


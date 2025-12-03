import { useState, FormEvent } from 'react';

import { ResponsiveModal } from '@/Components/Modal/ResponsiveModal';
import type { UserMedication } from '@/types';

export interface ConfirmMedicationData {
    takenAt: string;
}

interface ConfirmMedicationModalProps {
    medication: UserMedication;
    scheduledTime: string;
    isSubmitting: boolean;
    onConfirm: (data: ConfirmMedicationData) => void;
    onClose: () => void;
}

export function ConfirmMedicationModal({
    medication,
    scheduledTime,
    isSubmitting,
    onConfirm,
    onClose,
}: ConfirmMedicationModalProps) {
    const [takenAt, setTakenAt] = useState(scheduledTime || '');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onConfirm({ takenAt });
    };

    const closeModal = () => {
        const modal = document.getElementById('confirm-medication-modal') as HTMLElement & { hidePopover?: () => void };
        if (modal?.hidePopover) {
            modal.hidePopover();
        }
        setTimeout(onClose, 300);
    };

    const footer = (
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
                type="button"
                onClick={closeModal}
                disabled={isSubmitting}
                className="btn btn-ghost"
            >
                Cancelar
            </button>
            <button
                type="submit"
                form="confirm-medication-form"
                disabled={isSubmitting}
                className="btn btn-primary"
            >
                {isSubmitting ? (
                    <>
                        <span className="loading loading-spinner loading-sm" />
                        Confirmando...
                    </>
                ) : (
                    'Confirmar'
                )}
            </button>
        </div>
    );

    return (
        <ResponsiveModal
            id="confirm-medication-modal"
            title="Confirmar Medicamento"
            onClose={closeModal}
            footer={footer}
        >
            <form
                id="confirm-medication-form"
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-medium">Medicamento</span>
                    </label>
                    <input
                        type="text"
                        value={medication.medication?.name || 'Medicamento'}
                        readOnly
                        className="input input-bordered w-full bg-base-200"
                        aria-label="Nome do medicamento"
                    />
                </div>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-medium">Horário programado</span>
                    </label>
                    <input
                        type="text"
                        value={scheduledTime}
                        readOnly
                        className="input input-bordered w-full bg-base-200"
                        aria-label="Horário programado para tomada"
                    />
                </div>

                <div className="form-control w-full">
                    <label htmlFor="taken-at" className="label">
                        <span className="label-text font-medium">
                            Hora da tomada <span className="text-error">*</span>
                        </span>
                    </label>
                    <input
                        id="taken-at"
                        type="time"
                        value={takenAt}
                        onChange={(e) => setTakenAt(e.target.value)}
                        className="input input-bordered w-full"
                        required
                        aria-required="true"
                    />
                </div>
            </form>
        </ResponsiveModal>
    );
}

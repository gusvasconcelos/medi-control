import axios from 'axios';
import { Pill, Clock, Calendar, Package, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { ConfirmModal } from '@/Components/Common/ConfirmModal';
import { useToast } from '@/hooks/useToast';
import type { PatientMedicationData, CaregiverActionPermissions } from '@/types/caregiver';

interface PatientMedicationCardProps {
    medication: PatientMedicationData;
    patientId: number;
    availableActions: CaregiverActionPermissions;
}

const viaAdministrationLabels: Record<string, string> = {
    oral: 'Oral',
    topical: 'Tópico',
    injection: 'Injeção',
    inhalation: 'Inalação',
    sublingual: 'Sublingual',
    rectal: 'Retal',
    other: 'Outro',
};

export function PatientMedicationCard({
    medication,
    patientId,
    availableActions,
}: PatientMedicationCardProps) {
    const { showSuccess, showError } = useToast();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleEdit = () => {
        window.location.href = `/my-patients/${patientId}?tab=medications&edit=${medication.id}`;
    };

    const handleDelete = () => {
        setIsDeleting(true);
        axios.delete(`/api/user-medications/${medication.id}?user_id=${patientId}`)
            .then(() => {
                showSuccess('Medicamento removido com sucesso!');
                window.location.reload();
            })
            .catch(() => {
                showError('Erro ao remover medicamento');
            })
            .finally(() => {
                setIsDeleting(false);
                setShowDeleteModal(false);
            });
    };

    const isLowStock =
        medication.current_stock <= medication.low_stock_threshold;

    return (
        <>
            <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="card-body">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                    <Pill className="w-4 h-4" />
                                </div>
                                <h3 className="text-lg font-semibold truncate">
                                    {medication.medication?.name || 'N/A'}
                                </h3>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-base-content/70">
                                    <Package className="w-4 h-4 flex-shrink-0" />
                                    <span>
                                        <strong>Dosagem:</strong> {medication.dosage}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-base-content/70">
                                    <span className="badge badge-sm">
                                        {viaAdministrationLabels[medication.via_administration] ||
                                            medication.via_administration}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-base-content/70">
                                    <Clock className="w-4 h-4 flex-shrink-0" />
                                    <div className="flex flex-wrap gap-1">
                                        {medication.time_slots.map((slot, index) => (
                                            <span
                                                key={index}
                                                className="badge badge-outline badge-sm"
                                            >
                                                {slot}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-base-content/70">
                                    <Calendar className="w-4 h-4 flex-shrink-0" />
                                    <span>
                                        {new Date(medication.start_date).toLocaleDateString('pt-BR')}
                                        {medication.end_date && (
                                            <> até {new Date(medication.end_date).toLocaleDateString('pt-BR')}</>
                                        )}
                                        {!medication.end_date && <> (contínuo)</>}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <Package className="w-4 h-4 flex-shrink-0" />
                                    <span
                                        className={
                                            isLowStock
                                                ? 'text-error font-medium'
                                                : 'text-base-content/70'
                                        }
                                    >
                                        Estoque: {medication.current_stock} unidades
                                        {isLowStock && ' (Baixo!)'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            {availableActions.medications.canEdit && (
                                <button
                                    type="button"
                                    className="btn btn-sm btn-ghost"
                                    onClick={handleEdit}
                                    title="Editar medicamento"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                            )}
                            {availableActions.medications.canDelete && (
                                <button
                                    type="button"
                                    className="btn btn-sm btn-ghost text-error"
                                    onClick={() => setShowDeleteModal(true)}
                                    title="Remover medicamento"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Remover Medicamento"
                message={`Tem certeza que deseja remover ${medication.medication?.name}? Esta ação não pode ser desfeita.`}
                confirmText="Remover"
                confirmButtonClass="btn-error"
                isLoading={isDeleting}
            />
        </>
    );
}

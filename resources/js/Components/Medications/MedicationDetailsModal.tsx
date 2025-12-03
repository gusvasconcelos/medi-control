import { useEffect, useState } from 'react';
import { ResponsiveModal } from '@/Components/Modal/ResponsiveModal';
import { medicationService } from '@/services/medicationService';
import type { Medication } from '@/types';

interface MedicationDetailsModalProps {
    medication: Medication | null;
    isOpen: boolean;
    onClose: () => void;
}

const formLabels: Record<string, string> = {
    tablet: 'Comprimido',
    capsule: 'Cápsula',
    liquid: 'Líquido',
    injection: 'Injeção',
    cream: 'Pomada',
    drops: 'Gotas',
    spray: 'Spray',
    inhaler: 'Inalador',
    patch: 'Adesivo',
    other: 'Outro',
};

export function MedicationDetailsModal({
    medication,
    isOpen,
    onClose,
}: MedicationDetailsModalProps) {
    const [interactionMedications, setInteractionMedications] = useState<Record<number, string>>({});

    useEffect(() => {
        if (isOpen && medication) {
            const modal = document.getElementById(
                'view-medication-details-modal'
            ) as HTMLElement & { showPopover?: () => void };
            modal?.showPopover?.();
        }
    }, [isOpen, medication]);

    // Buscar nomes dos medicamentos das interações
    useEffect(() => {
        if (medication?.interactions && medication.interactions.length > 0) {
            const medicationIds = medication.interactions
                .filter(interaction => !interaction.medication_name && interaction.medication_id)
                .map(interaction => interaction.medication_id);

            if (medicationIds.length > 0) {
                Promise.all(
                    medicationIds.map(id =>
                        medicationService.getMedication(id)
                            .then(med => ({ id, name: med.name }))
                            .catch(() => ({ id, name: 'Medicamento desconhecido' }))
                    )
                ).then(results => {
                    const medicationMap: Record<number, string> = {};
                    results.forEach(({ id, name }) => {
                        medicationMap[id] = name;
                    });
                    setInteractionMedications(medicationMap);
                });
            }
        }
    }, [medication?.interactions]);

    if (!medication) return null;

    const getFormLabel = (form: string | null | undefined): string | null => {
        if (!form) return null;
        return formLabels[form] || form;
    };

    const DetailRow = ({
        label,
        value,
    }: {
        label: string;
        value: string | null | undefined;
    }) => (
        <div className="py-3 border-b border-base-300 last:border-0">
            <dt className="text-sm font-medium text-base-content/60">{label}</dt>
            <dd className="mt-1 text-base">
                {value || (
                    <span className="text-base-content/40">
                        Não informado
                    </span>
                )}
            </dd>
        </div>
    );

    const footer = (
        <div className="flex justify-end">
            <button
                type="button"
                className="btn btn-primary w-full sm:w-auto"
                onClick={onClose}
            >
                Fechar
            </button>
        </div>
    );

    return (
        <ResponsiveModal
            id="view-medication-details-modal"
            title="Detalhes do Medicamento"
            onClose={onClose}
            footer={footer}
        >
            <div className="space-y-4 sm:space-y-6">
                <div className="rounded-lg bg-base-200 p-3 sm:p-4">
                    <h4 className="mb-3 text-base sm:text-lg font-semibold">
                        Informações Básicas
                    </h4>
                    <dl className="space-y-1">
                        <DetailRow label="Nome" value={medication.name} />
                        <DetailRow
                            label="Princípio Ativo"
                            value={medication.active_principle}
                        />
                        <DetailRow
                            label="Fabricante"
                            value={medication.manufacturer}
                        />
                        <DetailRow
                            label="Categoria"
                            value={medication.category}
                        />
                        <DetailRow
                            label="Classe Terapêutica"
                            value={medication.therapeutic_class}
                        />
                        <DetailRow
                            label="Número de Registro"
                            value={medication.registration_number}
                        />
                    </dl>
                </div>

                <div className="rounded-lg bg-base-200 p-3 sm:p-4">
                    <h4 className="mb-3 text-base sm:text-lg font-semibold">
                        Apresentação
                    </h4>
                    <dl className="space-y-1">
                        <DetailRow label="Forma" value={getFormLabel(medication.form)} />
                        <DetailRow
                            label="Dosagem"
                            value={medication.strength}
                        />
                    </dl>
                </div>

                {medication.description && (
                    <div className="rounded-lg bg-base-200 p-3 sm:p-4">
                        <h4 className="mb-3 text-base sm:text-lg font-semibold">
                            Descrição
                        </h4>
                        <p className="text-sm sm:text-base text-base-content/80 whitespace-pre-wrap">
                            {medication.description}
                        </p>
                    </div>
                )}
            </div>
        </ResponsiveModal>
    );
}


import { AlertTriangle, Calendar, Clock, Info, Package, Pill } from 'lucide-react';
import { useEffect, useState } from 'react';

import { ResponsiveModal } from '@/Components/Modal/ResponsiveModal';
import { medicationService } from '@/services/medicationService';
import type { UserMedication, ViaAdministration } from '@/types';

interface MedicationDetailsModalProps {
    medication: UserMedication;
    onClose: () => void;
}

const viaAdministrationLabels: Record<ViaAdministration, string> = {
    oral: 'Oral',
    topical: 'Tópico',
    injection: 'Injeção',
    inhalation: 'Inalação',
    sublingual: 'Sublingual',
    rectal: 'Retal',
    other: 'Outro',
};

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
}

function InfoRow({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="flex justify-between py-2 border-b border-base-200 last:border-b-0">
            <span className="text-base-content/70">{label}</span>
            <span className="font-medium text-base-content">{value}</span>
        </div>
    );
}

function SectionHeader({ icon: Icon, title }: { icon: typeof Pill; title: string }) {
    return (
        <div className="flex items-center gap-2 mb-3">
            <Icon className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-base-content">{title}</h3>
        </div>
    );
}

export function MedicationDetailsModal({
    medication,
    onClose,
}: MedicationDetailsModalProps) {
    const med = medication.medication;
    const stockPercentage = medication.initial_stock > 0
        ? (medication.current_stock / medication.initial_stock) * 100
        : 0;
    const isLowStock = medication.current_stock <= medication.low_stock_threshold;
    const [interactionMedications, setInteractionMedications] = useState<Record<number, string>>({});

    // Buscar nomes dos medicamentos das interações
    useEffect(() => {
        if (med?.interactions && med.interactions.length > 0) {
            const medicationIds = med.interactions
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
    }, [med?.interactions]);

    const closeModal = () => {
        const modal = document.getElementById('medication-details-modal') as HTMLElement & { hidePopover?: () => void };
        if (modal?.hidePopover) {
            modal.hidePopover();
        }
        setTimeout(onClose, 300);
    };

    const footer = (
        <div className="flex justify-end">
            <button
                type="button"
                onClick={closeModal}
                className="btn btn-primary"
            >
                Fechar
            </button>
        </div>
    );

    return (
        <ResponsiveModal
            id="medication-details-modal"
            title="Detalhes do Medicamento"
            onClose={closeModal}
            footer={footer}
            dynamicHeight
            expandedContent
        >
            <div className="space-y-6">
                {/* Medication Info */}
                <section>
                    <SectionHeader icon={Pill} title="Medicamento" />
                    <div className="bg-base-200/50 rounded-lg p-4">
                        <h4 className="text-lg font-bold text-base-content mb-2">
                            {med?.name || 'Medicamento'}
                        </h4>
                        {med?.active_principle && (
                            <p className="text-sm text-base-content/70 mb-2">
                                Princípio ativo: {med.active_principle}
                            </p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-3">
                            {med?.form && (
                                <span className="badge badge-outline">{med.form}</span>
                            )}
                            {med?.strength && (
                                <span className="badge badge-outline">{med.strength}</span>
                            )}
                            {med?.category && (
                                <span className="badge badge-primary badge-outline">{med.category}</span>
                            )}
                        </div>
                    </div>
                </section>

                {/* Treatment Info */}
                <section>
                    <SectionHeader icon={Info} title="Tratamento" />
                    <div className="bg-base-200/50 rounded-lg p-4">
                        <InfoRow label="Dosagem" value={medication.dosage} />
                        <InfoRow
                            label="Via de administração"
                            value={viaAdministrationLabels[medication.via_administration]}
                        />
                    </div>
                </section>

                {/* Schedule */}
                <section>
                    <SectionHeader icon={Clock} title="Horários" />
                    <div className="flex flex-wrap gap-2">
                        {medication.time_slots.map((time) => (
                            <span
                                key={time}
                                className="badge badge-lg badge-primary"
                            >
                                {time}
                            </span>
                        ))}
                    </div>
                </section>

                {/* Period */}
                <section>
                    <SectionHeader icon={Calendar} title="Período" />
                    <div className="bg-base-200/50 rounded-lg p-4">
                        <InfoRow label="Início" value={formatDate(medication.start_date)} />
                        {medication.end_date && (
                            <InfoRow label="Término" value={formatDate(medication.end_date)} />
                        )}
                        {!medication.end_date && (
                            <InfoRow label="Término" value="Uso contínuo" />
                        )}
                    </div>
                </section>

                {/* Stock */}
                <section>
                    <SectionHeader icon={Package} title="Estoque" />
                    <div className="bg-base-200/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-base-content/70">Quantidade atual</span>
                            <span className={`font-bold ${isLowStock ? 'text-error' : 'text-base-content'}`}>
                                {medication.current_stock} unidades
                            </span>
                        </div>
                        <progress
                            className={`progress w-full ${isLowStock ? 'progress-error' : 'progress-primary'}`}
                            value={stockPercentage}
                            max="100"
                            aria-label="Nível de estoque"
                        />
                        {isLowStock && (
                            <div className="flex items-center gap-2 mt-3 text-error">
                                <AlertTriangle className="h-4 w-4" />
                                <span className="text-sm">Estoque baixo! Considere reabastecer.</span>
                            </div>
                        )}
                        <div className="text-xs text-base-content/50 mt-2">
                            Alerta configurado para {medication.low_stock_threshold} unidades
                        </div>
                    </div>
                </section>

                {/* Interactions */}
                {med?.interactions && med.interactions.length > 0 && (
                    <section>
                        <SectionHeader icon={AlertTriangle} title="Interações" />
                        <div className="bg-error/10 border border-error/30 rounded-lg p-4 space-y-3">
                            {med.interactions.map((interaction, index) => {
                                const medicationName = interaction.medication_name ||
                                    interactionMedications[interaction.medication_id] ||
                                    'Medicamento desconhecido';

                                return (
                                    <div key={index} className="border-b border-error/20 last:border-0 pb-2 last:pb-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className="font-semibold text-base-content">
                                                Com: {medicationName}
                                            </span>
                                            <span className={`badge badge-sm ${
                                                interaction.severity === 'severe' || interaction.severity === 'contraindicated'
                                                    ? 'badge-error'
                                                    : interaction.severity === 'moderate'
                                                    ? 'badge-warning'
                                                    : 'badge-info'
                                            }`}>
                                                {interaction.severity === 'severe' ? 'Severa' :
                                                 interaction.severity === 'contraindicated' ? 'Contraindicação' :
                                                 interaction.severity === 'moderate' ? 'Moderada' : 'Leve'}
                                            </span>
                                        </div>
                                        <p className="text-base-content/90 text-sm mt-1">
                                            {interaction.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>
        </ResponsiveModal>
    );
}

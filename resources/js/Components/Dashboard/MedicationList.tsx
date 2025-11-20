import React from 'react';
import { MedicationCard } from './MedicationCard';
import { Pill } from 'lucide-react';
import type { UserMedication } from '@/types';

interface MedicationListProps {
    medications: UserMedication[];
    isLoading: boolean;
    onMarkAsTaken: (id: number) => Promise<void>;
    onSnooze: (id: number) => void;
    onViewDetails: (id: number) => void;
}

export const MedicationList: React.FC<MedicationListProps> = ({
    medications,
    isLoading,
    onMarkAsTaken,
    onSnooze,
    onViewDetails,
}) => {
    if (isLoading) {
        return (
            <div className="card bg-base-100 border border-base-300">
                <div className="card-body">
                    <div className="flex flex-col items-center justify-center py-8 sm:py-12 gap-4">
                        <span className="loading loading-spinner loading-lg text-primary" />
                        <p className="text-sm text-base-content/60">Carregando medicamentos...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (medications.length === 0) {
        return (
            <div className="card bg-base-100 border border-base-300">
                <div className="card-body p-8 sm:p-12">
                    <div className="flex flex-col items-center gap-4 sm:gap-6 max-w-md mx-auto text-center">
                        <div className="p-4 sm:p-5 bg-base-200 rounded-full">
                            <Pill className="w-10 h-10 sm:w-12 sm:h-12 text-base-content/40" strokeWidth={1.5} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg sm:text-xl font-semibold text-base-content">
                                Nenhum medicamento para hoje
                            </h3>
                            <p className="text-sm sm:text-base text-base-content/60">
                                Você não possui medicamentos agendados para esta data.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-base-content">
                    Medicamentos do dia
                </h2>
                <span className="badge badge-primary badge-sm">
                    {medications.length} {medications.length === 1 ? 'medicamento' : 'medicamentos'}
                </span>
            </div>
            {medications.map((medication) => (
                <MedicationCard
                    key={medication.id}
                    medication={medication}
                    onMarkAsTaken={onMarkAsTaken}
                    onSnooze={onSnooze}
                    onViewDetails={onViewDetails}
                />
            ))}
        </div>
    );
};

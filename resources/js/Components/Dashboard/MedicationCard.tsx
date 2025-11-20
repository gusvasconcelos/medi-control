import React, { useState } from 'react';
import { CheckCircle2, Clock, Info, AlertCircle, MoreVertical } from 'lucide-react';
import type { UserMedication } from '@/types';

interface MedicationCardProps {
    medication: UserMedication;
    onMarkAsTaken: (id: number) => Promise<void>;
    onSnooze: (id: number) => void;
    onViewDetails: (id: number) => void;
}

const MEDICATION_COLORS = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500',
    'bg-cyan-500',
    'bg-red-500',
    'bg-yellow-500',
];

export const MedicationCard: React.FC<MedicationCardProps> = ({
    medication,
    onMarkAsTaken,
    onSnooze,
    onViewDetails,
}) => {
    const [isMarking, setIsMarking] = useState(false);

    const getColorForMedication = (id: number): string => {
        return MEDICATION_COLORS[id % MEDICATION_COLORS.length];
    };

    const getMedicationStatus = (): 'taken' | 'pending' | 'missed' => {
        if (!medication.logs || medication.logs.length === 0) {
            return 'pending';
        }

        const hasTaken = medication.logs.some((log) => log.status === 'taken');
        if (hasTaken) {
            return 'taken';
        }

        const hasMissed = medication.logs.some((log) => log.status === 'missed');
        if (hasMissed) {
            return 'missed';
        }

        return 'pending';
    };

    const status = getMedicationStatus();

    const handleMarkAsTaken = async () => {
        setIsMarking(true);
        try {
            await onMarkAsTaken(medication.id);
        } finally {
            setIsMarking(false);
        }
    };

    const formatTimeSlots = (): string => {
        if (medication.time_slots.length === 1) {
            return medication.time_slots[0];
        }
        return medication.time_slots.join(', ');
    };

    return (
        <div className="card bg-base-100 border border-base-300 hover:border-base-content/20 transition-colors">
            <div className="card-body p-4 sm:p-5">
                <div className="flex items-start gap-3 sm:gap-4">
                    {/* Color Indicator */}
                    <div
                        className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0 mt-1 ${getColorForMedication(
                            medication.id
                        )}`}
                        aria-hidden="true"
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-base sm:text-lg text-base-content truncate">
                                    {medication.medication?.name || 'Medicamento'}
                                </h3>
                                <p className="text-sm sm:text-base text-base-content/60 mt-1">
                                    {medication.dosage} • {formatTimeSlots()}
                                </p>
                                {status === 'pending' && (
                                    <div className="badge badge-warning badge-sm gap-1 mt-2">
                                        <AlertCircle className="w-3 h-3" />
                                        Pendente
                                    </div>
                                )}
                            </div>

                            {/* Mobile Actions - Dropdown */}
                            <div className="sm:hidden">
                                {status === 'taken' ? (
                                    <div
                                        className="flex items-center gap-1 text-success"
                                        role="status"
                                        aria-label="Medicamento tomado"
                                    >
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                ) : (
                                    <div className="dropdown dropdown-end">
                                        <button
                                            type="button"
                                            tabIndex={0}
                                            className="btn btn-ghost btn-sm btn-circle"
                                            aria-label="Ações do medicamento"
                                        >
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                        <ul
                                            tabIndex={0}
                                            className="dropdown-content menu bg-base-100 rounded-box shadow-lg border border-base-300 w-52 p-2 z-10"
                                        >
                                            <li>
                                                <button
                                                    type="button"
                                                    onClick={handleMarkAsTaken}
                                                    disabled={isMarking}
                                                    className="flex items-center gap-2"
                                                >
                                                    {isMarking ? (
                                                        <span className="loading loading-spinner loading-xs" />
                                                    ) : (
                                                        <CheckCircle2 className="w-4 h-4 text-success" />
                                                    )}
                                                    <span>Marcar como tomado</span>
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    type="button"
                                                    onClick={() => onSnooze(medication.id)}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Clock className="w-4 h-4 text-warning" />
                                                    <span>Adiar</span>
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    type="button"
                                                    onClick={() => onViewDetails(medication.id)}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Info className="w-4 h-4 text-info" />
                                                    <span>Ver detalhes</span>
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Desktop Actions - Inline Buttons */}
                            <div className="hidden sm:flex items-center gap-2">
                                {status === 'taken' ? (
                                    <div
                                        className="flex items-center gap-1 text-success"
                                        role="status"
                                        aria-label="Medicamento tomado"
                                    >
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span className="text-sm font-medium">Tomado</span>
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleMarkAsTaken}
                                            disabled={isMarking}
                                            className="btn btn-circle btn-sm btn-ghost text-success hover:bg-success/10"
                                            aria-label="Marcar como tomado"
                                        >
                                            {isMarking ? (
                                                <span className="loading loading-spinner loading-xs" />
                                            ) : (
                                                <CheckCircle2 className="w-5 h-5" />
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => onSnooze(medication.id)}
                                            className="btn btn-circle btn-sm btn-ghost text-warning hover:bg-warning/10"
                                            aria-label="Adiar medicamento"
                                        >
                                            <Clock className="w-5 h-5" />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => onViewDetails(medication.id)}
                                            className="btn btn-circle btn-sm btn-ghost text-info hover:bg-info/10"
                                            aria-label="Ver detalhes do medicamento"
                                        >
                                            <Info className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

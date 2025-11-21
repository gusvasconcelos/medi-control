import { useState } from 'react';
import { AlertCircle, CheckCircle2, Clock, Info, MoreVertical } from 'lucide-react';

import type { UserMedication } from '@/types';
import { endOfDay, fromUTC, startOfDay } from '@/utils/dateUtils';

interface MedicationCardProps {
    medication: UserMedication;
    onMarkAsTaken: (id: number) => Promise<void>;
    onSnooze: (id: number) => void;
    onViewDetails: (id: number) => void;
}

type MedicationStatus = 'taken' | 'pending' | 'missed' | 'partial';

const MEDICATION_COLORS = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500',
    'bg-cyan-500',
    'bg-red-500',
    'bg-yellow-500',
] as const;

export function MedicationCard({
    medication,
    onMarkAsTaken,
    onSnooze,
    onViewDetails,
}: MedicationCardProps) {
    const [isMarking, setIsMarking] = useState(false);

    const getColorForMedication = (id: number): string => {
        return MEDICATION_COLORS[id % MEDICATION_COLORS.length];
    };

    const getMedicationStatus = (): MedicationStatus => {
        if (!medication.logs || medication.logs.length === 0) {
            return 'pending';
        }

        const todayStart = startOfDay(new Date());
        const todayEnd = endOfDay(new Date());

        const todayLogs = medication.logs.filter((log) => {
            const scheduledDate = fromUTC(log.scheduled_at);
            return scheduledDate >= todayStart && scheduledDate <= todayEnd;
        });

        if (todayLogs.length === 0) {
            return 'pending';
        }

        const takenCount = todayLogs.filter(
            (log) => log.status === 'taken'
        ).length;
        const totalTimeSlots = medication.time_slots.length;

        const hasMissed = todayLogs.some((log) => log.status === 'missed');

        if (takenCount === totalTimeSlots) {
            return 'taken';
        }

        if (takenCount > 0) {
            return 'partial';
        }

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
        <div className="card border border-base-300 bg-base-100 transition-colors hover:border-base-content/20">
            <div className="card-body p-4 sm:p-5">
                <div className="flex items-start gap-3 sm:gap-4">
                    <div
                        className={`mt-1 h-3 w-3 flex-shrink-0 rounded-full sm:h-4 sm:w-4 ${getColorForMedication(
                            medication.id
                        )}`}
                        aria-hidden="true"
                    />

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0 flex-1">
                                <h3 className="truncate text-base font-semibold text-base-content sm:text-lg">
                                    {medication.medication?.name ||
                                        'Medicamento'}
                                </h3>
                                <p className="mt-1 text-sm text-base-content/60 sm:text-base">
                                    {medication.dosage} • {formatTimeSlots()}
                                </p>
                                {status === 'pending' && (
                                    <div className="badge badge-warning badge-sm mt-2 gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        Pendente
                                    </div>
                                )}
                                {status === 'partial' && (
                                    <div className="badge badge-info badge-sm mt-2 gap-1">
                                        <Clock className="h-3 w-3" />
                                        Parcialmente tomado
                                    </div>
                                )}
                            </div>

                            <div className="sm:hidden">
                                {status === 'taken' ? (
                                    <div
                                        className="flex items-center gap-1 text-success"
                                        role="status"
                                        aria-label="Medicamento tomado"
                                    >
                                        <CheckCircle2 className="size-8" />
                                    </div>
                                ) : (
                                    <div className="dropdown dropdown-end">
                                        <button
                                            type="button"
                                            tabIndex={0}
                                            className="btn btn-circle btn-ghost btn-sm"
                                            aria-label="Ações do medicamento"
                                        >
                                            <MoreVertical className="size-8" />
                                        </button>
                                        <ul
                                            tabIndex={0}
                                            className="menu dropdown-content z-10 w-52 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
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
                                                        <CheckCircle2 className="size-8 text-success" />
                                                    )}
                                                    <span>Marcar como tomado</span>
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onSnooze(medication.id)
                                                    }
                                                    className="flex items-center gap-2"
                                                >
                                                    <Clock className="size-8 text-warning" />
                                                    <span>Adiar</span>
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onViewDetails(medication.id)
                                                    }
                                                    className="flex items-center gap-2"
                                                >
                                                    <Info className="size-8 text-info" />
                                                    <span>Ver detalhes</span>
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="hidden items-center gap-4 sm:flex">
                                {status === 'taken' ? (
                                    <div
                                        className="flex items-center gap-2 text-success"
                                        role="status"
                                        aria-label="Medicamento tomado"
                                    >
                                        <CheckCircle2 className="size-8" />
                                        <span className="text-sm font-medium">
                                            Tomado
                                        </span>
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleMarkAsTaken}
                                            disabled={isMarking}
                                            className="btn btn-circle btn-ghost btn-sm text-success hover:bg-success/10"
                                            aria-label="Marcar como tomado"
                                        >
                                            {isMarking ? (
                                                <span className="loading loading-spinner loading-xs" />
                                            ) : (
                                                <CheckCircle2 className="size-8" />
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                onSnooze(medication.id)
                                            }
                                            className="btn btn-circle btn-ghost btn-sm text-warning hover:bg-warning/10"
                                            aria-label="Adiar medicamento"
                                        >
                                            <Clock className="size-8" />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                onViewDetails(medication.id)
                                            }
                                            className="btn btn-circle btn-ghost btn-sm text-info hover:bg-info/10"
                                            aria-label="Ver detalhes do medicamento"
                                        >
                                            <Info className="size-8" />
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
}

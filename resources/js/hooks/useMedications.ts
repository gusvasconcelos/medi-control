import { useState, useEffect, useCallback } from 'react';
import { medicationService } from '@/services/medicationService';
import { useToast } from '@/hooks/useToast';
import type { UserMedication, DailyMetrics } from '@/types';

interface UseMedicationsReturn {
    medications: UserMedication[];
    metrics: DailyMetrics;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    markAsTaken: (medicationId: number) => Promise<void>;
}

export const useMedications = (selectedDate: string): UseMedicationsReturn => {
    const [medications, setMedications] = useState<UserMedication[]>([]);
    const [metrics, setMetrics] = useState<DailyMetrics>({
        totalMedications: 0,
        medicationsTaken: 0,
        medicationsPending: 0,
        adherencePercentage: 0,
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { showSuccess, showError } = useToast();

    const calculateMetrics = useCallback((meds: UserMedication[]): DailyMetrics => {
        let totalScheduled = 0;
        let totalTaken = 0;

        meds.forEach((med) => {
            const timeSlots = med.time_slots.length;
            totalScheduled += timeSlots;

            const takenCount = med.logs?.filter((log) => log.status === 'taken').length || 0;
            totalTaken += takenCount;
        });

        const adherencePercentage =
            totalScheduled > 0 ? Math.round((totalTaken / totalScheduled) * 100) : 0;

        return {
            totalMedications: totalScheduled,
            medicationsTaken: totalTaken,
            medicationsPending: totalScheduled - totalTaken,
            adherencePercentage,
        };
    }, []);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const [medicationsData, indicatorsData] = await Promise.all([
                medicationService.getUserMedications(selectedDate),
                medicationService.getIndicators(selectedDate),
            ]);

            setMedications(medicationsData.data);

            if (indicatorsData.data.length > 0) {
                const dayIndicator = indicatorsData.data[0];
                const calculatedMetrics: DailyMetrics = {
                    totalMedications: dayIndicator.total_scheduled,
                    medicationsTaken: dayIndicator.total_taken,
                    medicationsPending: dayIndicator.total_scheduled - dayIndicator.total_taken,
                    adherencePercentage:
                        dayIndicator.total_scheduled > 0
                            ? Math.round((dayIndicator.total_taken / dayIndicator.total_scheduled) * 100)
                            : 0,
                };
                setMetrics(calculatedMetrics);
            } else {
                const calculatedMetrics = calculateMetrics(medicationsData.data);
                setMetrics(calculatedMetrics);
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erro ao carregar medicamentos';
            setError(errorMessage);
            showError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [selectedDate, showError, calculateMetrics]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const markAsTaken = useCallback(
        async (medicationId: number) => {
            try {
                await medicationService.logMedicationTaken(medicationId);
                showSuccess('Medicamento marcado como tomado!');
                await fetchData();
            } catch (err: any) {
                const errorMessage =
                    err.response?.data?.message || 'Erro ao marcar medicamento como tomado';
                showError(errorMessage);
            }
        },
        [fetchData, showSuccess, showError]
    );

    return {
        medications,
        metrics,
        isLoading,
        error,
        refetch: fetchData,
        markAsTaken,
    };
};

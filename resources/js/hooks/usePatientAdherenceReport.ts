import { useState, useEffect, useCallback, useMemo } from 'react';
import { medicationService } from '@/services/medicationService';
import { useToast } from '@/hooks/useToast';
import { dateString, today, subtractDays } from '@/utils/dateUtils';
import type { AdherenceReportData, ReportPeriod } from '@/types';

interface DateRange {
    startDate: string;
    endDate: string;
}

interface UsePatientAdherenceReportReturn {
    report: AdherenceReportData | null;
    isLoading: boolean;
    isDownloading: boolean;
    error: string | null;
    selectedPeriod: ReportPeriod;
    dateRange: DateRange;
    setSelectedPeriod: (period: ReportPeriod) => void;
    refetch: () => Promise<void>;
    downloadPdf: () => Promise<void>;
}

const PERIOD_LABELS: Record<ReportPeriod, string> = {
    week: 'Semana',
    month: 'Mês',
    quarter: 'Trimestre',
    semester: 'Semestre',
    year: 'Ano',
};

function calculateDateRange(period: ReportPeriod): DateRange {
    const endDate = today();
    let startDate: Date;

    switch (period) {
        case 'week':
            startDate = subtractDays(endDate, 6);
            break;
        case 'month':
            startDate = subtractDays(endDate, 29);
            break;
        case 'quarter':
            startDate = subtractDays(endDate, 89);
            break;
        case 'semester':
            // Max 90 days for API, we'll use 90
            startDate = subtractDays(endDate, 89);
            break;
        case 'year':
            // Max 90 days for API, we'll use 90
            startDate = subtractDays(endDate, 89);
            break;
        default:
            startDate = subtractDays(endDate, 6);
    }

    return {
        startDate: dateString(startDate),
        endDate: dateString(endDate),
    };
}

export function usePatientAdherenceReport(
    patientId: number,
    initialPeriod: ReportPeriod = 'week'
): UsePatientAdherenceReportReturn {
    const [report, setReport] = useState<AdherenceReportData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>(initialPeriod);
    const { showError, showSuccess } = useToast();

    const dateRange = useMemo(
        () => calculateDateRange(selectedPeriod),
        [selectedPeriod]
    );

    const fetchReport = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await medicationService.getAdherenceReport(
                dateRange.startDate,
                dateRange.endDate,
                patientId
            );
            setReport(response.data);
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || 'Erro ao carregar relatório de adesão';
            setError(errorMessage);
            showError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [dateRange.startDate, dateRange.endDate, patientId, showError]);

    useEffect(() => {
        fetchReport();
    }, [fetchReport]);

    const downloadPdf = useCallback(async () => {
        setIsDownloading(true);

        try {
            const blob = await medicationService.downloadAdherenceReportPdf(
                dateRange.startDate,
                dateRange.endDate,
                patientId
            );

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `relatorio-adesao-${dateRange.startDate}-${dateRange.endDate}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            showSuccess('Relatório baixado com sucesso!');
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || 'Erro ao baixar relatório';
            showError(errorMessage);
        } finally {
            setIsDownloading(false);
        }
    }, [dateRange.startDate, dateRange.endDate, patientId, showError, showSuccess]);

    return {
        report,
        isLoading,
        isDownloading,
        error,
        selectedPeriod,
        dateRange,
        setSelectedPeriod,
        refetch: fetchReport,
        downloadPdf,
    };
}

export { PERIOD_LABELS };
export type { DateRange };

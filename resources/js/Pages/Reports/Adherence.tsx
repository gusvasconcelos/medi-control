import { Head } from '@inertiajs/react';
import {
    TrendingUp,
    CheckCircle,
    XCircle,
    Clock,
    Target,
    AlertTriangle,
    Pill,
    Download,
} from 'lucide-react';

import { getNavigationItems } from '@/config/navigation';
import { useAdherenceReport, PERIOD_LABELS } from '@/hooks/useAdherenceReport';
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { formatForDisplay, parseDate } from '@/utils/dateUtils';
import type {
    PageProps,
    ReportPeriod,
    MedicationAdherenceReport,
    InteractionSeverity,
} from '@/types';

const PERIODS: ReportPeriod[] = ['week', 'month', 'quarter'];

function getSeverityBadgeClass(severity: InteractionSeverity): string {
    switch (severity) {
        case 'mild':
            return 'badge-info';
        case 'moderate':
            return 'badge-warning';
        case 'severe':
            return 'badge-error';
        case 'contraindicated':
            return 'badge-error badge-outline';
        default:
            return 'badge-ghost';
    }
}

function getSeverityLabel(severity: InteractionSeverity): string {
    switch (severity) {
        case 'mild':
            return 'Leve';
        case 'moderate':
            return 'Moderada';
        case 'severe':
            return 'Severa';
        case 'contraindicated':
            return 'Contraindicada';
        default:
            return severity;
    }
}

function getAdherenceColorClass(percentage: number): string {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-error';
}

function getProgressBarColorClass(percentage: number): string {
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 60) return 'bg-warning';
    return 'bg-error';
}

interface MetricCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    colorClass?: string;
}

function MetricCard({ title, value, subtitle, icon, colorClass }: MetricCardProps) {
    return (
        <div className="bg-base-100 border border-base-300 rounded-2xl p-5 sm:p-6 hover:border-base-content/20 transition-all">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="text-sm font-medium text-base-content/70 mb-1">
                        {title}
                    </h3>
                    <p className={`text-3xl sm:text-4xl font-bold ${colorClass || 'text-base-content'}`}>
                        {value}
                    </p>
                    {subtitle && (
                        <p className="text-xs text-base-content/50 mt-1">{subtitle}</p>
                    )}
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                    {icon}
                </div>
            </div>
        </div>
    );
}

interface MedicationCardProps {
    medication: MedicationAdherenceReport;
}

function MedicationCard({ medication }: MedicationCardProps) {
    const adherencePercentage = medication.total_scheduled > 0
        ? Math.round((medication.total_taken / medication.total_scheduled) * 100)
        : 0;

    return (
        <div className="bg-base-100 border border-base-300 rounded-xl p-4 sm:p-5 hover:border-base-content/20 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        <Pill className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-base-content">
                            {medication.name || 'Medicamento'}
                        </h4>
                        <p className="text-sm text-base-content/60">
                            {medication.dosage}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold ${getAdherenceColorClass(adherencePercentage)}`}>
                        {adherencePercentage}%
                    </span>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-base-content/70">Adesão</span>
                    <span className="text-sm font-medium">
                        {medication.total_taken}/{medication.total_scheduled} doses
                    </span>
                </div>
                <div className="w-full bg-base-300 rounded-full h-2">
                    <div
                        className={`${getProgressBarColorClass(adherencePercentage)} h-2 rounded-full transition-all`}
                        style={{ width: `${adherencePercentage}%` }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="text-center p-2 bg-base-200 rounded-lg">
                    <p className="text-lg font-semibold text-base-content">
                        {medication.total_scheduled}
                    </p>
                    <p className="text-xs text-base-content/60">Prescritas</p>
                </div>
                <div className="text-center p-2 bg-success/10 rounded-lg">
                    <p className="text-lg font-semibold text-success">
                        {medication.total_taken}
                    </p>
                    <p className="text-xs text-base-content/60">Tomadas</p>
                </div>
                <div className="text-center p-2 bg-error/10 rounded-lg">
                    <p className="text-lg font-semibold text-error">
                        {medication.total_lost}
                    </p>
                    <p className="text-xs text-base-content/60">Perdidas</p>
                </div>
                <div className="text-center p-2 bg-warning/10 rounded-lg">
                    <p className="text-lg font-semibold text-warning">
                        {medication.total_pending}
                    </p>
                    <p className="text-xs text-base-content/60">Pendentes</p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-sm text-base-content/70">Horários:</span>
                {medication.time_slots.map((slot) => (
                    <span
                        key={slot}
                        className="badge badge-outline badge-sm"
                    >
                        {slot}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between text-sm">
                <span className="text-base-content/70">Pontualidade:</span>
                <span className={`font-medium ${getAdherenceColorClass(medication.punctuality_rate)}`}>
                    {medication.punctuality_rate.toFixed(1)}%
                </span>
            </div>

            {medication.interactions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-base-300">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-warning" />
                        <span className="text-sm font-medium text-base-content">
                            Interações identificadas
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {medication.interactions.map((interaction) => (
                            <div
                                key={interaction.id}
                                className={`badge ${getSeverityBadgeClass(interaction.severity)} gap-1`}
                            >
                                <span>{interaction.name}</span>
                                <span className="text-xs opacity-80">
                                    ({getSeverityLabel(interaction.severity)})
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-base-200 rounded-2xl h-32" />
                ))}
            </div>
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-base-200 rounded-xl h-48" />
                ))}
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-base-200 rounded-full flex items-center justify-center">
                <Pill className="w-8 h-8 text-base-content/40" />
            </div>
            <h3 className="text-lg font-medium text-base-content mb-2">
                Nenhum medicamento encontrado
            </h3>
            <p className="text-base-content/60 max-w-md mx-auto">
                Você não possui medicamentos cadastrados para o período selecionado.
                Adicione medicamentos no Dashboard para acompanhar sua adesão.
            </p>
        </div>
    );
}

export default function Adherence({ auth }: PageProps) {
    const user = auth?.user;
    const userRoles = user?.roles || [];

    const {
        report,
        isLoading,
        isDownloading,
        selectedPeriod,
        dateRange,
        setSelectedPeriod,
        downloadPdf,
    } = useAdherenceReport('week');

    const periodDateLabel = `${formatForDisplay(parseDate(dateRange.startDate), 'DISPLAY_COMPACT')} - ${formatForDisplay(parseDate(dateRange.endDate), 'DISPLAY_COMPACT')}`;

    return (
        <>
            <Head title="Relatório de Adesão - MediControl" />

            <AuthenticatedLayout navItems={getNavigationItems('/reports', userRoles)}>
                <div className="min-h-screen bg-base-100">
                    <div className="container mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
                        <div className="mb-6 sm:mb-8">
                            <h1 className="text-2xl font-bold text-base-content sm:text-3xl mb-1">
                                Relatório de Adesão
                            </h1>
                            <p className="text-sm text-base-content/60">
                                Acompanhe sua adesão ao tratamento e pontualidade
                            </p>
                        </div>

                        <div className="mb-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div role="tablist" className="tabs tabs-boxed bg-base-200 p-1 justify-center gap-4 rounded-full">
                                    {PERIODS.map((period) => (
                                        <button
                                            key={period}
                                            role="tab"
                                            className={`tab ${selectedPeriod === period ? 'tab-active bg-base-100 rounded-full' : ''}`}
                                            onClick={() => setSelectedPeriod(period)}
                                        >
                                            {PERIOD_LABELS[period]}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="text-sm text-base-content/60">
                                        {periodDateLabel}
                                    </p>
                                    <button
                                        className="btn btn-primary btn-sm gap-2"
                                        onClick={downloadPdf}
                                        disabled={isDownloading || isLoading || !report}
                                        aria-label="Baixar relatório em PDF"
                                    >
                                        {isDownloading ? (
                                            <span className="loading loading-spinner loading-xs" />
                                        ) : (
                                            <Download className="w-4 h-4" />
                                        )}
                                        <span className="hidden sm:inline">Baixar PDF</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {isLoading ? (
                            <LoadingSkeleton />
                        ) : report ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                                    <MetricCard
                                        title="Adesão ao Tratamento"
                                        value={`${report.adherence_rate.toFixed(1)}%`}
                                        icon={<TrendingUp className="w-6 h-6 text-primary" />}
                                        colorClass={getAdherenceColorClass(report.adherence_rate)}
                                    />
                                    <MetricCard
                                        title="Doses Tomadas"
                                        value={report.total_taken}
                                        icon={<CheckCircle className="w-6 h-6 text-success" />}
                                        colorClass="text-success"
                                    />
                                    <MetricCard
                                        title="Doses Perdidas"
                                        value={report.total_lost}
                                        icon={<XCircle className="w-6 h-6 text-error" />}
                                        colorClass="text-error"
                                    />
                                    <MetricCard
                                        title="Doses Pendentes"
                                        value={report.total_pending}
                                        icon={<Clock className="w-6 h-6 text-warning" />}
                                        colorClass="text-warning"
                                    />
                                    <MetricCard
                                        title="Pontualidade"
                                        value={`${report.punctuality_rate.toFixed(1)}%`}
                                        icon={<Target className="w-6 h-6 text-info" />}
                                        colorClass={getAdherenceColorClass(report.punctuality_rate)}
                                    />
                                </div>

                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold text-base-content mb-4">
                                        Detalhes por Medicamento
                                    </h2>
                                    {report.medications.length > 0 ? (
                                        <div className="space-y-4">
                                            {report.medications.map((medication) => (
                                                <MedicationCard
                                                    key={medication.id}
                                                    medication={medication}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <EmptyState />
                                    )}
                                </div>
                            </>
                        ) : (
                            <EmptyState />
                        )}
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}

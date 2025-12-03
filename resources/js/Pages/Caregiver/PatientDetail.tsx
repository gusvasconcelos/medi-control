import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Mail,
    Phone,
    Shield,
    Pill,
    Activity,
    User as UserIcon,
    PlusCircle,
    DownloadIcon,
    TrendingUp,
    CheckCircle,
    XCircle,
    Clock,
    Target,
    AlertTriangle,
} from 'lucide-react';

import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { AddMedicationModal } from '@/Components/Dashboard/AddMedicationModal';
import { ConfirmMedicationModal, ConfirmMedicationData } from '@/Components/Dashboard/ConfirmMedicationModal';
import { MedicationDetailsModal } from '@/Components/Dashboard/MedicationDetailsModal';
import { OptimizedImage } from '@/Components/Common/OptimizedImage';
import { Avatar } from '@/Components/Common/Avatar';
import { getNavigationItems } from '@/config/navigation';
import { usePatientAdherenceReport, PERIOD_LABELS } from '@/hooks/usePatientAdherenceReport';
import { formatForDisplay, parseDate, dateTimeString } from '@/utils/dateUtils';
import type { PageProps, ReportPeriod, MedicationAdherenceReport, InteractionSeverity } from '@/types';
import type { PatientDetailData, PatientMedicationData } from '@/types/caregiver';
import { MedicationCard } from '@/Components/Dashboard/MedicationCard';
import { medicationService } from '@/services/medicationService';
import { useToast } from '@/hooks/useToast';

interface PatientDetailProps extends PageProps, PatientDetailData {
    medications: PatientMedicationData[];
}

function formatDate(dateString: string | null): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
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

function getSeverityBadgeClass(severity: InteractionSeverity | string): string {
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

function getSeverityLabel(severity: InteractionSeverity | string): string {
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

interface AdherenceMedicationCardProps {
    medication: MedicationAdherenceReport;
}

function AdherenceMedicationCard({ medication }: AdherenceMedicationCardProps) {
    const adherencePercentage =
        medication.total_scheduled > 0
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
                O paciente não possui medicamentos cadastrados para o período selecionado.
            </p>
        </div>
    );
}

const PERIODS: ReportPeriod[] = ['week', 'month', 'quarter'];

type TabType = 'overview' | 'medications' | 'adherence' | 'profile';

export default function PatientDetail({
    auth,
    patient,
    relationship,
    permissions,
    availableActions,
    medications,
}: PatientDetailProps) {
    const user = auth?.user;
    const userRoles = user?.roles || [];

    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab') as TabType | null;
    const [activeTab, setActiveTab] = useState<TabType>(tabParam || 'overview');

    const [confirmModal, setConfirmModal] = useState<{
        medication: PatientMedicationData | null;
        scheduledTime: string;
    }>({
        medication: null,
        scheduledTime: '',
    });

    const [detailsModal, setDetailsModal] = useState<{
        medication: PatientMedicationData | null;
    }>({
        medication: null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { showSuccess, showError } = useToast();

    useEffect(() => {
        if (tabParam && ['overview', 'medications', 'adherence', 'profile'].includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    useEffect(() => {
        if (confirmModal.medication) {
            const modal = document.getElementById('confirm-medication-modal') as HTMLElement & {
                showPopover?: () => void;
            };
            if (modal?.showPopover) {
                modal.showPopover();
            }
        }
    }, [confirmModal.medication]);

    useEffect(() => {
        if (detailsModal.medication) {
            const modal = document.getElementById('medication-details-modal') as HTMLElement & {
                showPopover?: () => void;
            };
            if (modal?.showPopover) {
                modal.showPopover();
            }
        }
    }, [detailsModal.medication]);

    const handleBackToPatients = () => {
        router.visit('/my-patients');
    };

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        const url = new URL(window.location.href);
        url.searchParams.set('tab', tab);
        window.history.pushState({}, '', url.toString());
    };

    const handleAddMedication = () => {
        const modal = document.getElementById('add-medication-modal') as any;
        if (modal && modal.showPopover) {
            modal.showPopover();
        }
    };

    const handleSuccess = () => {
        router.reload({ only: ['medications'] });
    };

    const handleOpenConfirmModal = (medication: PatientMedicationData, scheduledTime: string) => {
        if (!availableActions.adherence.canMark) {
            return;
        }
        setConfirmModal({ medication, scheduledTime });
    };

    const handleCloseConfirmModal = () => {
        setConfirmModal({ medication: null, scheduledTime: '' });
    };

    const handleConfirmMedication = async (data: ConfirmMedicationData) => {
        if (!confirmModal.medication) {
            return;
        }

        setIsSubmitting(true);
        try {
            let formattedTakenAt: string | undefined;
            if (data.takenAt) {
                const [hours, minutes] = data.takenAt.split(':');
                const takenDate = new Date();
                takenDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

                formattedTakenAt = dateTimeString(takenDate);
            }

            await medicationService.logMedicationTaken(confirmModal.medication.id, {
                user_id: patient.id,
                taken_at: formattedTakenAt,
                notes: data.notes,
            });

            showSuccess('Medicamento marcado como tomado!');

            const modal = document.getElementById('confirm-medication-modal') as HTMLElement & {
                hidePopover?: () => void;
            };
            if (modal?.hidePopover) {
                modal.hidePopover();
            }

            setTimeout(() => {
                handleCloseConfirmModal();
                router.reload({ only: ['medications'] });
            }, 300);
        } catch (err: any) {
            const errorMessage =
                err?.response?.data?.message || 'Erro ao marcar medicamento como tomado';
            showError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleViewDetails = (medicationId: number) => {
        if (!availableActions.medications.canView) {
            return;
        }

        const medication = medications.find((m) => m.id === medicationId) || null;
        if (medication) {
            setDetailsModal({ medication });
        }
    };

    const handleCloseDetailsModal = () => {
        setDetailsModal({ medication: null });
    };

    const totalMedications = medications.length;
    const activeMedications = medications.filter((m) => m.active).length;
    const lowStockMedications = medications.filter(
        (m) => m.current_stock <= m.low_stock_threshold
    ).length;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'medications':
                return renderMedicationsTab();
            case 'adherence':
                return renderAdherenceTab();
            case 'profile':
                return renderProfileTab();
            default:
                return renderOverviewTab();
        }
    };

    const renderOverviewTab = () => (
        <div className="card bg-base-200 shadow-sm">
            <div className="card-body">
                <h2 className="card-title text-lg mb-4">
                    Informações do Paciente
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-base-content/60 mb-1">
                                Email
                            </p>
                            <p className="text-sm font-medium truncate">
                                {patient.email}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-success/10 text-success">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-base-content/60 mb-1">
                                Relacionamento Aceito em
                            </p>
                            <p className="text-sm font-medium">
                                {formatDate(relationship.accepted_at)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-accent/10 text-accent">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-base-content/60 mb-1">
                                Permissões
                            </p>
                            <p className="text-sm font-medium">
                                {permissions.length}{' '}
                                {permissions.length === 1 ? 'permissão' : 'permissões'}
                            </p>
                        </div>
                    </div>
                </div>

                {permissions.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-base-300">
                        <p className="text-xs text-base-content/60 mb-2">
                            Permissões concedidas:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {permissions.map((permission) => (
                                <span key={permission.id} className="badge badge-primary badge-sm">
                                    {permission.display_name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderMedicationsTab = () => {
        const metricItems = [
            {
                label: 'Total de Medicamentos',
                value: totalMedications.toString(),
                icon: '/storage/medication.webp',
            },
            {
                label: 'Medicamentos Ativos',
                value: activeMedications.toString(),
                icon: '/storage/checkmark.webp',
            },
            {
                label: 'Estoque Baixo',
                value: lowStockMedications.toString(),
                icon: '/storage/analytics.webp',
            },
        ];

        return (
            <>
                {/* Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
                    {metricItems.map((item) => (
                        <div
                            key={item.label}
                            className="bg-base-100 border border-base-300 rounded-2xl p-5 sm:p-6 hover:border-base-content/20 transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-base-content/70 mb-0.5">
                                        {item.label}
                                    </h3>
                                    <p className="text-3xl sm:text-4xl font-medium text-base-content tracking-tight">
                                        {item.value}
                                    </p>
                                </div>
                                <OptimizedImage
                                    src={item.icon}
                                    alt={item.label}
                                    className="w-16 h-16 sm:w-20 sm:h-20"
                                    lazy={true}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Medications List */}
                {medications.length === 0 ? (
                    <div className="card bg-base-100 border border-base-300">
                        <div className="card-body p-8 sm:p-12">
                            <div className="flex flex-col items-center gap-4 sm:gap-6 max-w-md mx-auto text-center">
                                <div className="p-4 sm:p-5 bg-base-200 rounded-full">
                                    <Pill className="w-10 h-10 sm:w-12 sm:h-12 text-base-content/40" strokeWidth={1.5} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg sm:text-xl font-semibold text-base-content">
                                        Nenhum medicamento cadastrado
                                    </h3>
                                    <p className="text-sm sm:text-base text-base-content/60">
                                        Você não possui medicamentos agendados para esta data.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-semibold text-base-content">
                                Lista de Medicamentos
                            </h2>
                            <span className="badge badge-primary badge-sm">
                                {medications.length} {medications.length === 1 ? 'medicamento' : 'medicamentos'}
                            </span>
                        </div>
                        {medications.map((medication) => (
                            <div key={medication.id}>
                                <MedicationCard
                                    key={medication.id}
                                    medication={medication}
                                    onMarkAsTaken={handleOpenConfirmModal}
                                    onViewDetails={handleViewDetails}
                                    canMarkAsTaken={availableActions.adherence.canMark}
                                    canViewDetails={availableActions.medications.canView}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Floating Action Button */}
                {availableActions.medications.canCreate && (
                    <div className="fixed bottom-4 right-4 z-50 lg:bottom-6 lg:right-6">
                        <button
                            type="button"
                            onClick={handleAddMedication}
                            className="btn btn-circle btn-primary h-14 w-14 shadow-lg transition-shadow hover:shadow-xl"
                            aria-label="Adicionar novo medicamento"
                        >
                            <PlusCircle className="h-6 w-6" />
                        </button>
                    </div>
                )}

                {/* Add Medication Modal */}
                {availableActions.medications.canCreate && (
                    <AddMedicationModal
                        onSuccess={handleSuccess}
                    />
                )}

                {/* Confirm Medication Modal */}
                {availableActions.adherence.canMark && confirmModal.medication && (
                    <ConfirmMedicationModal
                        medication={confirmModal.medication}
                        scheduledTime={confirmModal.scheduledTime}
                        isSubmitting={isSubmitting}
                        onConfirm={handleConfirmMedication}
                        onClose={handleCloseConfirmModal}
                    />
                )}

                {/* Medication Details Modal */}
                {availableActions.medications.canView && detailsModal.medication && (
                    <MedicationDetailsModal
                        medication={detailsModal.medication}
                        onClose={handleCloseDetailsModal}
                    />
                )}
            </>
        );
    };

    const {
        report,
        isLoading,
        isDownloading,
        selectedPeriod,
        dateRange,
        setSelectedPeriod,
        downloadPdf,
    } = usePatientAdherenceReport(patient.id, 'week');

    const periodDateLabel = `${formatForDisplay(parseDate(dateRange.startDate), 'DISPLAY_COMPACT')} - ${formatForDisplay(parseDate(dateRange.endDate), 'DISPLAY_COMPACT')}`;

    const renderAdherenceTab = () => (
        <>
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div role="tablist" className="tabs tabs-boxed bg-base-200 p-1 justify-center gap-1 sm:gap-4 rounded-full flex">
                        {PERIODS.map((period) => (
                            <button
                                key={period}
                                role="tab"
                                className={`tab flex-1 sm:flex-none ${selectedPeriod === period ? 'tab-active bg-base-100 rounded-full' : ''}`}
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
                                <DownloadIcon className="w-4 h-4" />
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
                                    <AdherenceMedicationCard
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
        </>
    );

    const renderProfileTab = () => {
        const roleNames = patient.roles?.map((role) => role.name).join(', ') || 'Nenhuma';

        return (
            <div className="card bg-base-200">
                <div className="card-body">
                    {/* Profile Photo Section */}
                    <div className="flex flex-col items-center gap-4 pb-6">
                        <div className="relative">
                            <div className="avatar">
                                <div className="ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <Avatar
                                        src={patient.profile_photo_url}
                                        alt={patient.name}
                                        name={patient.name}
                                        size="xl"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-base-content mb-1">
                                {patient.name}
                            </h2>
                            <p className="text-sm text-base-content/60">
                                Perfil do Paciente
                            </p>
                        </div>
                    </div>

                    <div className="divider" />

                    {/* Profile Information */}
                    <div className="space-y-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text flex items-center gap-2">
                                    <UserIcon className="w-4 h-4" />
                                    Nome
                                </span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                value={patient.name}
                                disabled
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Email
                                </span>
                            </label>
                            <input
                                type="email"
                                className="input input-bordered w-full"
                                value={patient.email}
                                disabled
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    Telefone
                                </span>
                            </label>
                            <input
                                type="tel"
                                className="input input-bordered w-full"
                                value={patient.phone || '-'}
                                disabled
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    Função
                                </span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                value={roleNames}
                                disabled
                            />
                        </div>

                        {permissions.length > 0 && (
                            <>
                                <div className="divider" />
                                <div>
                                    <label className="label">
                                        <span className="label-text flex items-center gap-2">
                                            <Shield className="w-4 h-4" />
                                            Suas Permissões
                                        </span>
                                    </label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {permissions.map((permission) => (
                                            <span key={permission.id} className="badge badge-primary badge-sm">
                                                {permission.display_name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <Head title={`Paciente: ${patient.name}`} />

            <AuthenticatedLayout navItems={getNavigationItems('/my-patients', userRoles)}>
                <div className="min-h-screen bg-base-100">
                    <div className="container mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
                        <div className="mb-6 sm:mb-8">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <button
                                            type="button"
                                            onClick={handleBackToPatients}
                                            className="btn btn-ghost btn-sm btn-circle"
                                            aria-label="Voltar para listagem de pacientes"
                                        >
                                            <ArrowLeft className="w-5 h-5" />
                                        </button>
                                        <h1 className="text-xl font-bold text-base-content sm:text-2xl md:text-3xl">
                                            {patient.name}
                                        </h1>
                                    </div>
                                    <p className="text-xs sm:text-sm text-base-content/60">
                                        Gerenciar cuidados e acompanhar tratamento
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div role="tablist" className="tabs tabs-boxed mb-6 bg-base-200 p-1 justify-start gap-1 sm:gap-4 rounded-full sm:inline-flex w-auto">
                            <button
                                type="button"
                                role="tab"
                                className={`tab flex-1 sm:flex-none items-center justify-center ${activeTab === 'overview' ? 'tab-active bg-base-100 rounded-full' : ''}`}
                                onClick={() => handleTabChange('overview')}
                            >
                                <Shield className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline gap-2">Visão Geral</span>
                            </button>
                            {availableActions.medications.canView && (
                                <button
                                    type="button"
                                    role="tab"
                                    className={`tab flex-1 sm:flex-none items-center justify-center ${activeTab === 'medications' ? 'tab-active bg-base-100 rounded-full' : ''}`}
                                    onClick={() => handleTabChange('medications')}
                                >
                                    <Pill className="w-4 h-4 mr-2" />
                                    <span className="hidden sm:inline gap-2">Medicamentos</span>
                                </button>
                            )}
                            {availableActions.adherence.canView && (
                                <button
                                    type="button"
                                    role="tab"
                                    className={`tab flex-1 sm:flex-none items-center justify-center ${activeTab === 'adherence' ? 'tab-active bg-base-100 rounded-full' : ''}`}
                                    onClick={() => handleTabChange('adherence')}
                                >
                                    <Activity className="w-4 h-4 mr-2" />
                                    <span className="hidden sm:inline gap-2">Adesão</span>
                                </button>
                            )}
                            {availableActions.profile.canView && (
                                <button
                                    type="button"
                                    role="tab"
                                    className={`tab flex-1 sm:flex-none items-center justify-center ${activeTab === 'profile' ? 'tab-active bg-base-100 rounded-full' : ''}`}
                                    onClick={() => handleTabChange('profile')}
                                >
                                    <UserIcon className="w-4 h-4 mr-2" />
                                    <span className="hidden sm:inline gap-2">Perfil</span>
                                </button>
                            )}
                        </div>

                        {/* Tab Content */}
                        {renderTabContent()}
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}

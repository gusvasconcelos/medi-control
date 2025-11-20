import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { useAuth } from '@/hooks/useAuth';
import { useMedications } from '@/hooks/useMedications';
import { useToast } from '@/hooks/useToast';
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { MetricsCards } from '@/Components/Dashboard/MetricsCards';
import { MedicationList } from '@/Components/Dashboard/MedicationList';
import { FloatingActionButtons } from '@/Components/Dashboard/FloatingActionButtons';
import { DatePickerModal } from '@/Components/Dashboard/DatePickerModal';
import { getNavigationItems } from '@/config/navigation';
import type { PageProps } from '@/types';

function formatDateForAPI(date: Date): string {
    return date.toISOString().split('T')[0];
}

export default function MedicationsDashboard({}: PageProps) {
    const { user, isLoading: authLoading } = useAuth();
    const { showInfo, showWarning } = useToast();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const {
        medications,
        metrics,
        isLoading: medicationsLoading,
        markAsTaken,
    } = useMedications(formatDateForAPI(selectedDate));

    const handleDateChange = (newDate: Date) => {
        setSelectedDate(newDate);
    };

    const handleSnooze = (medicationId: number) => {
        showWarning('Funcionalidade de adiamento em desenvolvimento');
    };

    const handleViewDetails = (medicationId: number) => {
        showInfo('Detalhes do medicamento em desenvolvimento');
    };

    const handleAddMedication = () => {
        showInfo('Funcionalidade de adicionar medicamento em desenvolvimento');
    };

    const handleOpenChat = () => {
        showInfo('Chat de suporte em desenvolvimento');
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    return (
        <>
            <Head title="Dashboard - Medi Control" />

            <AuthenticatedLayout navItems={getNavigationItems('/dashboard')}>
                <div className="bg-base-100 min-h-screen">
                    <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 max-w-7xl">
                        {/* Header */}
                        <div className="mb-6 sm:mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-base-content mb-1">
                                        Olá, {user?.name} 👋
                                    </h1>
                                    <p className="text-sm text-base-content/60">
                                        Este é seu painel de controle de medicamentos.
                                    </p>
                                </div>
                                <div>
                                    <DatePickerModal
                                        selectedDate={selectedDate}
                                        onDateChange={handleDateChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Metrics Cards */}
                        <MetricsCards metrics={metrics} />

                        {/* Medication List */}
                        <MedicationList
                            medications={medications}
                            isLoading={medicationsLoading}
                            onMarkAsTaken={markAsTaken}
                            onSnooze={handleSnooze}
                            onViewDetails={handleViewDetails}
                        />
                    </div>

                    {/* FABs */}
                    <FloatingActionButtons
                        onAddMedication={handleAddMedication}
                        onOpenChat={handleOpenChat}
                    />
                </div>
            </AuthenticatedLayout>
        </>
    );
}

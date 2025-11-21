import { useState } from 'react';
import { Head } from '@inertiajs/react';

import { AddMedicationModal } from '@/Components/Dashboard/AddMedicationModal';
import { DatePickerModal } from '@/Components/Dashboard/DatePickerModal';
import { FloatingActionButtons } from '@/Components/Dashboard/FloatingActionButtons';
import { MedicationList } from '@/Components/Dashboard/MedicationList';
import { MetricsCards } from '@/Components/Dashboard/MetricsCards';
import { getNavigationItems } from '@/config/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useMedications } from '@/hooks/useMedications';
import { useToast } from '@/hooks/useToast';
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import type { PageProps } from '@/types';
import { dateString, today } from '@/utils/dateUtils';

export default function Dashboard({}: PageProps) {
    const { user, isLoading: authLoading } = useAuth();
    const { showInfo, showWarning } = useToast();
    const [selectedDate, setSelectedDate] = useState<Date>(today());

    const {
        medications,
        metrics,
        isLoading: medicationsLoading,
        markAsTaken,
        refetch,
    } = useMedications(dateString(selectedDate));

    const handleDateChange = (newDate: Date) => {
        setSelectedDate(newDate);
    };

    const handleSnooze = (_medicationId: number) => {
        showWarning('Funcionalidade de adiamento em desenvolvimento');
    };

    const handleViewDetails = (_medicationId: number) => {
        showInfo('Detalhes do medicamento em desenvolvimento');
    };

    const handleMedicationSuccess = () => {
        refetch();
    };

    const handleOpenChat = () => {
        showInfo('Chat de suporte em desenvolvimento');
    };

    if (authLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    return (
        <>
            <Head title="Dashboard - MediControl" />

            <AuthenticatedLayout navItems={getNavigationItems('/dashboard')}>
                <div className="min-h-screen bg-base-100">
                    <div className="container mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
                        <div className="mb-6 sm:mb-8">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                                <div>
                                    <h1 className="mb-1 text-2xl font-bold text-base-content sm:text-3xl">
                                        Olá, {user?.name} 👋
                                    </h1>
                                    <p className="text-sm text-base-content/60">
                                        Este é seu painel de controle de
                                        medicamentos.
                                    </p>
                                </div>
                                <DatePickerModal
                                    selectedDate={selectedDate}
                                    onDateChange={handleDateChange}
                                />
                            </div>
                        </div>

                        <MetricsCards metrics={metrics} />

                        <MedicationList
                            medications={medications}
                            isLoading={medicationsLoading}
                            onMarkAsTaken={markAsTaken}
                            onSnooze={handleSnooze}
                            onViewDetails={handleViewDetails}
                        />
                    </div>

                    <FloatingActionButtons onOpenChat={handleOpenChat} />

                    <AddMedicationModal onSuccess={handleMedicationSuccess} />
                </div>
            </AuthenticatedLayout>
        </>
    );
}

import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';

import { AddMedicationModal } from '@/Components/Dashboard/AddMedicationModal';
import { ConfirmMedicationModal, ConfirmMedicationData } from '@/Components/Dashboard/ConfirmMedicationModal';
import { DatePickerModal } from '@/Components/Dashboard/DatePickerModal';
import { FloatingActionButtons } from '@/Components/Dashboard/FloatingActionButtons';
import { MedicationDetailsModal } from '@/Components/Dashboard/MedicationDetailsModal';
import { MedicationList } from '@/Components/Dashboard/MedicationList';
import { MetricsCards } from '@/Components/Dashboard/MetricsCards';
import { getNavigationItems } from '@/config/navigation';
import { useMedications } from '@/hooks/useMedications';
import { useToast } from '@/hooks/useToast';
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import type { PageProps, UserMedication } from '@/types';
import { dateString, today, dateTimeString } from '@/utils/dateUtils';

interface ConfirmModalState {
    medication: UserMedication | null;
    scheduledTime: string;
}

interface DetailsModalState {
    medication: UserMedication | null;
}

export default function Dashboard({ auth }: PageProps) {
    const user = auth?.user;
    const userRoles = user?.roles || [];
    const { showInfo } = useToast();
    const [selectedDate, setSelectedDate] = useState<Date>(today());
    const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
        medication: null,
        scheduledTime: '',
    });
    const [detailsModal, setDetailsModal] = useState<DetailsModalState>({
        medication: null,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleOpenConfirmModal = (medication: UserMedication, scheduledTime: string) => {
        setConfirmModal({ medication, scheduledTime });
    };

    useEffect(() => {
        if (confirmModal.medication) {
            const modal = document.getElementById('confirm-medication-modal') as HTMLElement & { showPopover?: () => void };
            if (modal?.showPopover) {
                modal.showPopover();
            }
        }
    }, [confirmModal.medication]);

    useEffect(() => {
        if (detailsModal.medication) {
            const modal = document.getElementById('medication-details-modal') as HTMLElement & { showPopover?: () => void };
            if (modal?.showPopover) {
                modal.showPopover();
            }
        }
    }, [detailsModal.medication]);

    const handleCloseConfirmModal = () => {
        setConfirmModal({ medication: null, scheduledTime: '' });
    };

    const handleConfirmMedication = async (data: ConfirmMedicationData) => {
        if (!confirmModal.medication) return;

        setIsSubmitting(true);
        try {
            let formattedTakenAt: string | undefined;
            if (data.takenAt) {
                const [hours, minutes] = data.takenAt.split(':');
                const takenDate = new Date(selectedDate);
                takenDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

                formattedTakenAt = dateTimeString(takenDate);
            }

            await markAsTaken(confirmModal.medication.id, {
                takenAt: formattedTakenAt,
                notes: data.notes,
            });
            const modal = document.getElementById('confirm-medication-modal') as HTMLElement & { hidePopover?: () => void };
            if (modal?.hidePopover) {
                modal.hidePopover();
            }
            setTimeout(handleCloseConfirmModal, 300);
        } catch {
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleViewDetails = (medicationId: number) => {
        const medication = medications.find((m) => m.id === medicationId);
        if (medication) {
            setDetailsModal({ medication });
        }
    };

    const handleCloseDetailsModal = () => {
        setDetailsModal({ medication: null });
    };

    const handleMedicationSuccess = () => {
        refetch();
    };

    const handleOpenChat = () => {
        showInfo('Chat de suporte em desenvolvimento');
    };

    return (
        <>
            <Head title="Dashboard - MediControl" />

            <AuthenticatedLayout navItems={getNavigationItems('/dashboard', userRoles)}>
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
                            onMarkAsTaken={handleOpenConfirmModal}
                            onViewDetails={handleViewDetails}
                        />
                    </div>

                    <FloatingActionButtons onOpenChat={handleOpenChat} />

                    <AddMedicationModal onSuccess={handleMedicationSuccess} />

                    {confirmModal.medication && (
                        <ConfirmMedicationModal
                            medication={confirmModal.medication}
                            scheduledTime={confirmModal.scheduledTime}
                            isSubmitting={isSubmitting}
                            onConfirm={handleConfirmMedication}
                            onClose={handleCloseConfirmModal}
                        />
                    )}

                    {detailsModal.medication && (
                        <MedicationDetailsModal
                            medication={detailsModal.medication}
                            onClose={handleCloseDetailsModal}
                        />
                    )}
                </div>
            </AuthenticatedLayout>
        </>
    );
}

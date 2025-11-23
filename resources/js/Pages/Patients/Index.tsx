import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Bell } from 'lucide-react';

import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { PatientsTable } from '@/Components/Caregiver/PatientsTable';
import { ConfirmModal } from '@/Components/Common/ConfirmModal';
import { getNavigationItems } from '@/config/navigation';
import { caregiverPatientService } from '@/services/caregiverPatientService';
import { useToast } from '@/hooks/useToast';
import type { PageProps } from '@/types';
import type { CaregiverPatient } from '@/types/caregiver';

export default function PatientsIndex({ auth }: PageProps) {
    const user = auth?.user;
    const userRoles = user?.roles || [];
    const { showSuccess, showError } = useToast();

    const [patients, setPatients] = useState<CaregiverPatient[]>([]);
    const [pendingInvitations, setPendingInvitations] = useState<CaregiverPatient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [activeTab, setActiveTab] = useState<'patients' | 'pending'>('patients');
    const [rejectModal, setRejectModal] = useState<{
        isOpen: boolean;
        relationship: CaregiverPatient | null;
    }>({
        isOpen: false,
        relationship: null,
    });

    const fetchPatients = async (page = 1) => {
        setIsLoading(true);
        try {
            const response = await caregiverPatientService.getMyPatients({
                page,
                per_page: 15,
            });

            setPatients(response.data);
            setCurrentPage(response.current_page);
            setLastPage(response.last_page);
            setTotal(response.total);
        } catch (error) {
            showError('Erro ao carregar pacientes');
            console.error('Error fetching patients:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPendingInvitations = async () => {
        try {
            const response = await caregiverPatientService.getPendingInvitations();
            setPendingInvitations(response.data);
        } catch (error) {
            console.error('Error fetching pending invitations:', error);
        }
    };

    useEffect(() => {
        fetchPatients(currentPage);
        fetchPendingInvitations();
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= lastPage) {
            setCurrentPage(page);
        }
    };

    const handleAccept = async (relationship: CaregiverPatient) => {
        try {
            await caregiverPatientService.acceptInvitation(relationship.id);
            showSuccess('Convite aceito com sucesso');
            fetchPatients(currentPage);
            fetchPendingInvitations();
        } catch (error) {
            showError('Erro ao aceitar convite');
            console.error('Error accepting invitation:', error);
        }
    };

    const handleOpenRejectModal = (relationship: CaregiverPatient) => {
        setRejectModal({ isOpen: true, relationship });
    };

    const handleCloseRejectModal = () => {
        setRejectModal({ isOpen: false, relationship: null });
        const modal = document.getElementById('confirm-modal') as HTMLDialogElement;
        modal?.close?.();
    };

    const handleConfirmReject = async () => {
        if (!rejectModal.relationship) return;

        try {
            await caregiverPatientService.rejectInvitation(rejectModal.relationship.id);
            showSuccess('Convite recusado');
            handleCloseRejectModal();
            fetchPendingInvitations();
        } catch (error) {
            showError('Erro ao recusar convite');
            console.error('Error rejecting invitation:', error);
        }
    };

    const handleView = (relationship: CaregiverPatient) => {
        // TODO: Navigate to patient details or show modal
        console.log('View patient:', relationship);
    };

    const renderPagination = () => {
        if (lastPage <= 1) return null;

        const pages = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(lastPage, startPage + maxPagesToShow - 1);

        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    type="button"
                    className={`btn btn-sm ${i === currentPage ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="mt-6">
                <div className="hidden sm:flex items-center justify-between">
                    <div className="text-sm text-base-content/60">
                        Mostrando <span className="font-medium">{(currentPage - 1) * 15 + 1}</span> a{' '}
                        <span className="font-medium">{Math.min(currentPage * 15, total)}</span> de{' '}
                        <span className="font-medium">{total}</span> pacientes
                    </div>
                    <div className="join">
                        <button
                            type="button"
                            className="join-item btn btn-sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            «
                        </button>
                        {pages}
                        <button
                            type="button"
                            className="join-item btn btn-sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === lastPage}
                        >
                            »
                        </button>
                    </div>
                </div>

                <div className="sm:hidden flex flex-col gap-3">
                    <div className="text-xs text-center text-base-content/60">
                        Página {currentPage} de {lastPage} ({total} pacientes)
                    </div>
                    <div className="flex justify-center gap-2">
                        <button
                            type="button"
                            className="btn btn-sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            ← Anterior
                        </button>
                        <button type="button" className="btn btn-sm btn-primary" disabled>
                            {currentPage}
                        </button>
                        <button
                            type="button"
                            className="btn btn-sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === lastPage}
                        >
                            Próxima →
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <Head title="Meus Pacientes - MediControl" />

            <AuthenticatedLayout navItems={getNavigationItems('/my-patients', userRoles)}>
                <div className="min-h-screen bg-base-100">
                    <div className="container mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
                        <div className="mb-6 sm:mb-8">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                                <div className="flex-1">
                                    <h1 className="mb-1 text-xl font-bold text-base-content sm:text-2xl md:text-3xl">
                                        Meus Pacientes
                                    </h1>
                                    <p className="text-xs sm:text-sm text-base-content/60">
                                        Acompanhe os pacientes que você cuida
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="tabs tabs-boxed mb-4">
                            <button
                                type="button"
                                className={`tab ${activeTab === 'patients' ? 'tab-active' : ''}`}
                                onClick={() => setActiveTab('patients')}
                            >
                                Pacientes Ativos
                            </button>
                            <button
                                type="button"
                                className={`tab ${activeTab === 'pending' ? 'tab-active' : ''}`}
                                onClick={() => setActiveTab('pending')}
                            >
                                <Bell className="w-4 h-4 mr-1" />
                                Convites Pendentes
                                {pendingInvitations.length > 0 && (
                                    <span className="badge badge-primary badge-sm ml-2">
                                        {pendingInvitations.length}
                                    </span>
                                )}
                            </button>
                        </div>

                        <div className="rounded-lg bg-base-200 p-4">
                            {activeTab === 'patients' ? (
                                <>
                                    <PatientsTable
                                        patients={patients.filter((p) => p.status === 'active')}
                                        isLoading={isLoading}
                                        onView={handleView}
                                    />
                                    {renderPagination()}
                                </>
                            ) : (
                                <PatientsTable
                                    patients={pendingInvitations}
                                    isLoading={isLoading}
                                    onAccept={handleAccept}
                                    onReject={handleOpenRejectModal}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>

            <ConfirmModal
                isOpen={rejectModal.isOpen}
                title="Recusar Convite"
                message={`Tem certeza que deseja recusar o convite de ${rejectModal.relationship?.patient?.name || 'este paciente'}?`}
                confirmText="Recusar Convite"
                variant="warning"
                onClose={handleCloseRejectModal}
                onConfirm={handleConfirmReject}
            />
        </>
    );
}

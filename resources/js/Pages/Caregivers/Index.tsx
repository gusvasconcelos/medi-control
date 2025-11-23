import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { UserPlus } from 'lucide-react';

import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { CaregiversTable } from '@/Components/Caregiver/CaregiversTable';
import { InviteCaregiverModal } from '@/Components/Caregiver/InviteCaregiverModal';
import { EditPermissionsModal } from '@/Components/Caregiver/EditPermissionsModal';
import { ConfirmModal } from '@/Components/Common/ConfirmModal';
import { getNavigationItems } from '@/config/navigation';
import { caregiverPatientService } from '@/services/caregiverPatientService';
import { useToast } from '@/hooks/useToast';
import type { PageProps } from '@/types';
import type { CaregiverPatient } from '@/types/caregiver';

export default function CaregiversIndex({ auth }: PageProps) {
    const user = auth?.user;
    const userRoles = user?.roles || [];
    const { showSuccess, showError } = useToast();

    const [caregivers, setCaregivers] = useState<CaregiverPatient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isEditPermissionsModalOpen, setIsEditPermissionsModalOpen] = useState(false);
    const [selectedRelationship, setSelectedRelationship] = useState<CaregiverPatient | null>(null);
    const [revokeModal, setRevokeModal] = useState<{
        isOpen: boolean;
        relationship: CaregiverPatient | null;
    }>({
        isOpen: false,
        relationship: null,
    });
    const [cancelInvitationModal, setCancelInvitationModal] = useState<{
        isOpen: boolean;
        relationship: CaregiverPatient | null;
    }>({
        isOpen: false,
        relationship: null,
    });

    const fetchCaregivers = async (page = 1) => {
        setIsLoading(true);
        try {
            const response = await caregiverPatientService.getMyCaregivers({
                page,
                per_page: 15,
            });

            setCaregivers(response.data);
            setCurrentPage(response.current_page);
            setLastPage(response.last_page);
            setTotal(response.total);
        } catch (error) {
            showError('Erro ao carregar cuidadores');
            console.error('Error fetching caregivers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCaregivers(currentPage);
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= lastPage) {
            setCurrentPage(page);
        }
    };

    const handleEditPermissions = (relationship: CaregiverPatient) => {
        setSelectedRelationship(relationship);
        setIsEditPermissionsModalOpen(true);
    };

    const handleOpenRevokeModal = (relationship: CaregiverPatient) => {
        setRevokeModal({ isOpen: true, relationship });
    };

    const handleCloseRevokeModal = () => {
        setRevokeModal({ isOpen: false, relationship: null });
        const modal = document.getElementById('revoke-modal') as HTMLDialogElement;
        modal?.close?.();
    };

    const handleConfirmRevoke = async () => {
        if (!revokeModal.relationship) return;

        try {
            await caregiverPatientService.revokeAccess(revokeModal.relationship.id);
            showSuccess('Acesso revogado com sucesso');
            handleCloseRevokeModal();
            fetchCaregivers(currentPage);
        } catch (error) {
            showError('Erro ao revogar acesso');
            console.error('Error revoking access:', error);
        }
    };

    const handleOpenCancelInvitationModal = (relationship: CaregiverPatient) => {
        setCancelInvitationModal({ isOpen: true, relationship });
    };

    const handleCloseCancelInvitationModal = () => {
        setCancelInvitationModal({ isOpen: false, relationship: null });
        const modal = document.getElementById('cancel-invitation-modal') as HTMLDialogElement;
        modal?.close?.();
    };

    const handleConfirmCancelInvitation = async () => {
        if (!cancelInvitationModal.relationship) return;

        try {
            await caregiverPatientService.cancelInvitation(cancelInvitationModal.relationship.id);
            showSuccess('Convite removido com sucesso');
            handleCloseCancelInvitationModal();
            fetchCaregivers(currentPage);
        } catch (error) {
            showError('Erro ao remover convite');
            console.error('Error canceling invitation:', error);
        }
    };

    const handleInviteSuccess = () => {
        setIsInviteModalOpen(false);
        fetchCaregivers(currentPage);
    };

    const handleEditPermissionsSuccess = () => {
        setIsEditPermissionsModalOpen(false);
        setSelectedRelationship(null);
        fetchCaregivers(currentPage);
    };

    const handleEditPermissionsClose = () => {
        setIsEditPermissionsModalOpen(false);
        setSelectedRelationship(null);
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
                        <span className="font-medium">{total}</span> cuidadores
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
                        Página {currentPage} de {lastPage} ({total} cuidadores)
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
            <Head title="Meus Cuidadores - MediControl" />

            <AuthenticatedLayout navItems={getNavigationItems('/my-caregivers', userRoles)}>
                <div className="min-h-screen bg-base-100">
                    <div className="container mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
                        <div className="mb-6 sm:mb-8">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                                <div className="flex-1">
                                    <h1 className="mb-1 text-xl font-bold text-base-content sm:text-2xl md:text-3xl">
                                        Meus Cuidadores
                                    </h1>
                                    <p className="text-xs sm:text-sm text-base-content/60">
                                        Gerencie as pessoas que podem acompanhar seu tratamento
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg bg-base-200 p-4">
                            <CaregiversTable
                                caregivers={caregivers}
                                isLoading={isLoading}
                                onEditPermissions={handleEditPermissions}
                                onRevoke={handleOpenRevokeModal}
                                onCancelInvitation={handleOpenCancelInvitationModal}
                            />

                            {renderPagination()}
                        </div>
                    </div>
                </div>

                {/* Floating Action Button */}
                <button
                    type="button"
                    className="btn btn-xl btn-primary btn-circle fixed bottom-24 right-4 shadow-lg z-50 lg:bottom-8 lg:right-6"
                    onClick={() => setIsInviteModalOpen(true)}
                    title="Convidar Cuidador"
                >
                    <UserPlus className="size-8" />
                </button>
            </AuthenticatedLayout>

            <InviteCaregiverModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onSuccess={handleInviteSuccess}
            />

            <EditPermissionsModal
                isOpen={isEditPermissionsModalOpen}
                relationship={selectedRelationship}
                onClose={handleEditPermissionsClose}
                onSuccess={handleEditPermissionsSuccess}
            />

            <ConfirmModal
                isOpen={revokeModal.isOpen}
                title="Revogar Acesso"
                message={`Tem certeza que deseja revogar o acesso de ${revokeModal.relationship?.caregiver?.name || 'este cuidador'}?`}
                confirmText="Revogar Acesso"
                variant="warning"
                modalId="revoke-modal"
                onClose={handleCloseRevokeModal}
                onConfirm={handleConfirmRevoke}
            />

            <ConfirmModal
                isOpen={cancelInvitationModal.isOpen}
                title="Remover Convite"
                message={`Tem certeza que deseja remover o convite para ${cancelInvitationModal.relationship?.caregiver?.name || cancelInvitationModal.relationship?.caregiver?.email || 'este cuidador'}?`}
                confirmText="Remover Convite"
                variant="warning"
                modalId="cancel-invitation-modal"
                onClose={handleCloseCancelInvitationModal}
                onConfirm={handleConfirmCancelInvitation}
            />
        </>
    );
}

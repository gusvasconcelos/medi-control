import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';

import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { MedicationsTable } from '@/Components/Medications/MedicationsTable';
import { MedicationFormModal } from '@/Components/Medications/MedicationFormModal';
import { DeleteMedicationModal } from '@/Components/Medications/DeleteMedicationModal';
import { MedicationDetailsModal } from '@/Components/Medications/MedicationDetailsModal';
import { getNavigationItems } from '@/config/navigation';
import { medicationService } from '@/services/medicationService';
import { useToast } from '@/hooks/useToast';
import type { PageProps, Medication } from '@/types';

export default function MedicationsIndex({ auth }: PageProps) {
    const user = auth?.user;
    const userRoles = user?.roles || [];
    const { showSuccess, showError } = useToast();

    const [medications, setMedications] = useState<Medication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(
        null
    );

    const [formModal, setFormModal] = useState<{
        isOpen: boolean;
        medication: Medication | null;
    }>({
        isOpen: false,
        medication: null,
    });

    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        medication: Medication | null;
    }>({
        isOpen: false,
        medication: null,
    });

    const [detailsModal, setDetailsModal] = useState<{
        isOpen: boolean;
        medication: Medication | null;
    }>({
        isOpen: false,
        medication: null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchMedications = async (page = 1, search = '') => {
        setIsLoading(true);
        try {
            const response = await medicationService.getMedications({
                page,
                per_page: 15,
                search: search || undefined,
            });

            setMedications(response.data);
            setCurrentPage(response.current_page);
            setLastPage(response.last_page);
            setTotal(response.total);
        } catch (error) {
            showError('Erro ao carregar medicamentos');
            console.error('Error fetching medications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMedications(currentPage, searchQuery);
    }, [currentPage]);

    useEffect(() => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        const timeout = setTimeout(() => {
            setCurrentPage(1);
            fetchMedications(1, searchQuery);
        }, 500);

        setSearchTimeout(timeout);

        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [searchQuery]);

    const handleOpenAddModal = () => {
        setFormModal({ isOpen: true, medication: null });
    };

    const handleOpenEditModal = (medication: Medication) => {
        setFormModal({ isOpen: true, medication });
    };

    const handleCloseFormModal = () => {
        if (!isSubmitting) {
            const modal = document.getElementById(
                'medication-form-modal'
            ) as HTMLElement & { hidePopover?: () => void };
            modal?.hidePopover?.();
            setTimeout(() => {
                setFormModal({ isOpen: false, medication: null });
            }, 300);
        }
    };

    const handleSubmitForm = async (data: Omit<Medication, 'id'>) => {
        setIsSubmitting(true);
        try {
            if (formModal.medication) {
                await medicationService.updateMedication(
                    formModal.medication.id,
                    data
                );
                showSuccess('Medicamento atualizado com sucesso');
            } else {
                await medicationService.createMedication(data);
                showSuccess('Medicamento criado com sucesso');
            }

            const modal = document.getElementById(
                'medication-form-modal'
            ) as HTMLElement & { hidePopover?: () => void };
            modal?.hidePopover?.();
            setTimeout(() => {
                setFormModal({ isOpen: false, medication: null });
                fetchMedications(currentPage, searchQuery);
            }, 300);
        } catch (error) {
            showError('Erro ao salvar medicamento');
            console.error('Error saving medication:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenDeleteModal = (medication: Medication) => {
        setDeleteModal({ isOpen: true, medication });
    };

    const handleCloseDeleteModal = () => {
        if (!isSubmitting) {
            setDeleteModal({ isOpen: false, medication: null });
            const modal = document.getElementById('delete-medication-modal') as HTMLDialogElement;
            modal?.close?.();
        }
    };

    const handleConfirmDelete = async () => {
        if (!deleteModal.medication) return;

        setIsSubmitting(true);
        try {
            await medicationService.deleteMedication(
                deleteModal.medication.id
            );
            showSuccess('Medicamento deletado com sucesso');

            const modal = document.getElementById('delete-medication-modal') as HTMLDialogElement;
            modal?.close?.();
            setTimeout(() => {
                handleCloseDeleteModal();
                fetchMedications(currentPage, searchQuery);
            }, 300);
        } catch (error) {
            showError('Erro ao deletar medicamento');
            console.error('Error deleting medication:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenDetailsModal = (medication: Medication) => {
        setDetailsModal({ isOpen: true, medication });
    };

    const handleCloseDetailsModal = () => {
        const modal = document.getElementById(
            'view-medication-details-modal'
        ) as HTMLElement & { hidePopover?: () => void };
        modal?.hidePopover?.();
        setTimeout(() => {
            setDetailsModal({ isOpen: false, medication: null });
        }, 300);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= lastPage) {
            setCurrentPage(page);
        }
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
                {/* Desktop Pagination */}
                <div className="hidden sm:flex items-center justify-between">
                    <div className="text-sm text-base-content/60">
                        Mostrando{' '}
                        <span className="font-medium">
                            {(currentPage - 1) * 15 + 1}
                        </span>{' '}
                        a{' '}
                        <span className="font-medium">
                            {Math.min(currentPage * 15, total)}
                        </span>{' '}
                        de <span className="font-medium">{total}</span>{' '}
                        medicamentos
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

                {/* Mobile Pagination */}
                <div className="sm:hidden flex flex-col gap-3">
                    <div className="text-xs text-center text-base-content/60">
                        Página {currentPage} de {lastPage} ({total} medicamentos)
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
                        <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            disabled
                        >
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
            <Head title="Medicamentos - MediControl" />

            <AuthenticatedLayout
                navItems={getNavigationItems('/medications', userRoles)}
            >
                <div className="min-h-screen bg-base-100">
                    <div className="container mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
                        <div className="mb-6 sm:mb-8">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                                <div className="flex-1">
                                    <h1 className="mb-1 text-xl font-bold text-base-content sm:text-2xl md:text-3xl">
                                        Medicamentos
                                    </h1>
                                    <p className="text-xs sm:text-sm text-base-content/60">
                                        Gerencie o catálogo de medicamentos do
                                        sistema
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-primary gap-2 w-full sm:w-auto"
                                    onClick={handleOpenAddModal}
                                >
                                    <Plus className="h-5 w-5" />
                                    <span className="hidden sm:inline">Adicionar Medicamento</span>
                                    <span className="sm:hidden">Adicionar</span>
                                </button>
                            </div>
                        </div>

                        <div className="mb-4 sm:mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-base-content/40 pointer-events-none z-10" />
                                <input
                                    type="text"
                                    className="input input-bordered w-full pl-10 text-sm sm:text-base bg-base-100"
                                    placeholder="Buscar por nome, princípio ativo, fabricante, categoria..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="rounded-lg bg-base-200 p-4">
                            <MedicationsTable
                                medications={medications}
                                isLoading={isLoading}
                                onView={handleOpenDetailsModal}
                                onEdit={handleOpenEditModal}
                                onDelete={handleOpenDeleteModal}
                            />

                            {renderPagination()}
                        </div>
                    </div>
                </div>

                <MedicationFormModal
                    medication={formModal.medication}
                    isOpen={formModal.isOpen}
                    isSubmitting={isSubmitting}
                    onClose={handleCloseFormModal}
                    onSubmit={handleSubmitForm}
                />

                <DeleteMedicationModal
                    medication={deleteModal.medication}
                    isOpen={deleteModal.isOpen}
                    isSubmitting={isSubmitting}
                    onClose={handleCloseDeleteModal}
                    onConfirm={handleConfirmDelete}
                />

                <MedicationDetailsModal
                    medication={detailsModal.medication}
                    isOpen={detailsModal.isOpen}
                    onClose={handleCloseDetailsModal}
                />
            </AuthenticatedLayout>
        </>
    );
}


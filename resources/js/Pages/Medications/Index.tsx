import { useState, useEffect } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Search, Upload } from 'lucide-react';

import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { MedicationsTable } from '@/Components/Medications/MedicationsTable';
import { MedicationFormModal } from '@/Components/Medications/MedicationFormModal';
import { DeleteMedicationModal } from '@/Components/Medications/DeleteMedicationModal';
import { MedicationDetailsModal } from '@/Components/Medications/MedicationDetailsModal';
import { getNavigationItems } from '@/config/navigation';
import { useToast } from '@/hooks/useToast';
import type { PageProps, Medication } from '@/types';

interface MedicationsPageProps extends PageProps {
    medications: {
        data: Medication[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };
}

export default function MedicationsIndex({ auth, medications: medicationsProp }: MedicationsPageProps) {
    const user = auth?.user;
    const userRoles = user?.roles || [];
    const { showError } = useToast();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(
        null
    );

    const [formModal, setFormModal] = useState<{
        isOpen: boolean;
        medication: Medication | null;
        isSubmitting: boolean;
    }>({
        isOpen: false,
        medication: null,
        isSubmitting: false,
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

    const deleteForm = useForm({});

    useEffect(() => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        const timeout = setTimeout(() => {
            router.get(
                '/medications',
                {
                    q: searchQuery ? JSON.stringify({ text: searchQuery }) : undefined,
                    per_page: 15,
                    page: 1,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                }
            );
        }, 500);

        setSearchTimeout(timeout);

        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [searchQuery]);

    const handleOpenAddModal = () => {
        setFormModal({ isOpen: true, medication: null, isSubmitting: false });
    };

    const handleNavigateToImport = () => {
        router.get('/medications/import');
    };

    const handleOpenEditModal = (medication: Medication) => {
        setFormModal({ isOpen: true, medication, isSubmitting: false });
    };

    const handleCloseFormModal = () => {
        const modal = document.getElementById(
            'medication-form-modal'
        ) as HTMLElement & { hidePopover?: () => void };
        modal?.hidePopover?.();
        setTimeout(() => {
            setFormModal({ isOpen: false, medication: null, isSubmitting: false });
        }, 300);
    };

    const handleSubmitForm = async (data: Omit<Medication, 'id'>) => {
        setFormModal((prev) => ({ ...prev, isSubmitting: true }));

        const formData = {
            ...data,
            interactions: data.interactions ? JSON.stringify(data.interactions) : null,
        };

        if (formModal.medication) {
            router.put(`/medications/${formModal.medication.id}`, formData as any, {
                onSuccess: () => {
                    const modal = document.getElementById(
                        'medication-form-modal'
                    ) as HTMLElement & { hidePopover?: () => void };
                    modal?.hidePopover?.();
                    setTimeout(() => {
                        setFormModal({ isOpen: false, medication: null, isSubmitting: false });
                    }, 300);
                },
                onError: () => {
                    showError('Erro ao salvar medicamento');
                    setFormModal((prev) => ({ ...prev, isSubmitting: false }));
                },
            });
        } else {
            router.post('/medications', formData as any, {
                onSuccess: () => {
                    const modal = document.getElementById(
                        'medication-form-modal'
                    ) as HTMLElement & { hidePopover?: () => void };
                    modal?.hidePopover?.();
                    setTimeout(() => {
                        setFormModal({ isOpen: false, medication: null, isSubmitting: false });
                    }, 300);
                },
                onError: () => {
                    showError('Erro ao salvar medicamento');
                    setFormModal((prev) => ({ ...prev, isSubmitting: false }));
                },
            });
        }
    };

    const handleOpenDeleteModal = (medication: Medication) => {
        setDeleteModal({ isOpen: true, medication });
    };

    const handleCloseDeleteModal = () => {
        if (!deleteForm.processing) {
            setDeleteModal({ isOpen: false, medication: null });
            const modal = document.getElementById('delete-medication-modal') as HTMLDialogElement;
            modal?.close?.();
        }
    };

    const handleConfirmDelete = async () => {
        if (!deleteModal.medication) return;

        deleteForm.delete(`/medications/${deleteModal.medication.id}`, {
            onSuccess: () => {
                const modal = document.getElementById('delete-medication-modal') as HTMLDialogElement;
                modal?.close?.();
                setTimeout(() => {
                    handleCloseDeleteModal();
                }, 300);
            },
            onError: () => {
                showError('Erro ao deletar medicamento');
            },
        });
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
        if (page >= 1 && page <= medicationsProp.last_page) {
            router.get(
                '/medications',
                {
                    q: searchQuery ? JSON.stringify({ text: searchQuery }) : undefined,
                    per_page: 15,
                    page,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                }
            );
        }
    };

    const renderPagination = () => {
        const { current_page, last_page, total, per_page } = medicationsProp;

        if (last_page <= 1) return null;

        const pages = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, current_page - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(last_page, startPage + maxPagesToShow - 1);

        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    type="button"
                    className={`btn btn-sm ${i === current_page ? 'btn-primary' : 'btn-ghost'}`}
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
                            {(current_page - 1) * per_page + 1}
                        </span>{' '}
                        a{' '}
                        <span className="font-medium">
                            {Math.min(current_page * per_page, total)}
                        </span>{' '}
                        de <span className="font-medium">{total}</span>{' '}
                        medicamentos
                    </div>
                    <div className="join">
                        <button
                            type="button"
                            className="join-item btn btn-sm"
                            onClick={() => handlePageChange(current_page - 1)}
                            disabled={current_page === 1}
                        >
                            «
                        </button>
                        {pages}
                        <button
                            type="button"
                            className="join-item btn btn-sm"
                            onClick={() => handlePageChange(current_page + 1)}
                            disabled={current_page === last_page}
                        >
                            »
                        </button>
                    </div>
                </div>

                {/* Mobile Pagination */}
                <div className="sm:hidden flex flex-col gap-3">
                    <div className="text-xs text-center text-base-content/60">
                        Página {current_page} de {last_page} ({total} medicamentos)
                    </div>
                    <div className="flex justify-center gap-2">
                        <button
                            type="button"
                            className="btn btn-sm"
                            onClick={() => handlePageChange(current_page - 1)}
                            disabled={current_page === 1}
                        >
                            ← Anterior
                        </button>
                        <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            disabled
                        >
                            {current_page}
                        </button>
                        <button
                            type="button"
                            className="btn btn-sm"
                            onClick={() => handlePageChange(current_page + 1)}
                            disabled={current_page === last_page}
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
            <Head title="Medicamentos" />

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
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button
                                        type="button"
                                        className="btn btn-outline gap-2 flex-1 sm:flex-initial"
                                        onClick={handleNavigateToImport}
                                    >
                                        <Upload className="h-5 w-5" />
                                        <span className="hidden sm:inline">Importar Medicamentos</span>
                                        <span className="sm:hidden">Importar</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary gap-2 flex-1 sm:flex-initial"
                                        onClick={handleOpenAddModal}
                                    >
                                        <Plus className="h-5 w-5" />
                                        <span className="hidden sm:inline">Adicionar Medicamento</span>
                                        <span className="sm:hidden">Adicionar</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4 sm:mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-base-content/40 pointer-events-none z-10" />
                                <input
                                    type="text"
                                    className="input input-bordered w-full pl-10 text-sm sm:text-base bg-base-100"
                                    placeholder="Buscar por nome, princípio ativo, categoria..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="rounded-lg bg-base-200 p-4">
                            <MedicationsTable
                                medications={medicationsProp.data}
                                isLoading={false}
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
                    isSubmitting={formModal.isSubmitting}
                    onClose={handleCloseFormModal}
                    onSubmit={handleSubmitForm}
                />

                <DeleteMedicationModal
                    medication={deleteModal.medication}
                    isOpen={deleteModal.isOpen}
                    isSubmitting={deleteForm.processing}
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

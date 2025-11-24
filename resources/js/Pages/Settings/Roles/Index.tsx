import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';

import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { RolesTable } from '@/Components/Settings/RolesTable';
import { RoleFormModal } from '@/Components/Settings/RoleFormModal';
import { ConfirmModal } from '@/Components/Common/ConfirmModal';
import { getNavigationItems } from '@/config/navigation';
import { roleService } from '@/services/roleService';
import { useToast } from '@/hooks/useToast';
import type { PageProps } from '@/types';
import type { Role } from '@/types/permissions';

export default function RolesIndex({ auth }: PageProps) {
    const user = auth?.user;
    const userRoles = user?.roles || [];
    const { showSuccess, showError } = useToast();

    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        role: Role | null;
    }>({
        isOpen: false,
        role: null,
    });

    const fetchRoles = async (page = 1) => {
        setIsLoading(true);
        try {
            const response = await roleService.getRoles({
                page,
                per_page: 15,
            });

            setRoles(response.data);
            setCurrentPage(response.current_page);
            setLastPage(response.last_page);
            setTotal(response.total);
        } catch (error) {
            showError('Erro ao carregar roles');
            console.error('Error fetching roles:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles(currentPage);
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= lastPage) {
            setCurrentPage(page);
        }
    };

    const handleEdit = (role: Role) => {
        setEditingRole(role);
        setIsFormModalOpen(true);
    };

    const handleOpenDeleteModal = (role: Role) => {
        setDeleteModal({ isOpen: true, role });
    };

    const handleCloseDeleteModal = () => {
        setDeleteModal({ isOpen: false, role: null });
        const modal = document.getElementById('confirm-modal') as HTMLDialogElement;
        modal?.close?.();
    };

    const handleConfirmDelete = async () => {
        if (!deleteModal.role) return;

        try {
            await roleService.deleteRole(deleteModal.role.id);
            showSuccess('Role deletada com sucesso');
            handleCloseDeleteModal();
            fetchRoles(currentPage);
        } catch (error) {
            showError('Erro ao deletar role');
            console.error('Error deleting role:', error);
        }
    };

    const handleFormSuccess = () => {
        setIsFormModalOpen(false);
        setEditingRole(null);
        fetchRoles(currentPage);
    };

    const handleFormClose = () => {
        setIsFormModalOpen(false);
        setEditingRole(null);
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
                        <span className="font-medium">{total}</span> roles
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
                        Página {currentPage} de {lastPage} ({total} roles)
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
            <Head title="Roles" />

            <AuthenticatedLayout navItems={getNavigationItems('/settings/roles', userRoles)}>                <div className="min-h-screen bg-base-100">
                    <div className="container mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
                        <div className="mb-6 sm:mb-8">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                                <div className="flex-1">
                                    <h1 className="mb-1 text-xl font-bold text-base-content sm:text-2xl md:text-3xl">
                                        Roles
                                    </h1>
                                    <p className="text-xs sm:text-sm text-base-content/60">
                                        Crie e gerencie roles e suas permissões
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => setIsFormModalOpen(true)}
                                >
                                    <Plus className="w-5 h-5" />
                                    Nova Role
                                </button>
                            </div>
                        </div>

                        <div className="rounded-lg bg-base-200 p-4">
                            <RolesTable
                                roles={roles}
                                isLoading={isLoading}
                                onEdit={handleEdit}
                                onDelete={handleOpenDeleteModal}
                            />

                            {renderPagination()}
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>

            <RoleFormModal
                isOpen={isFormModalOpen}
                role={editingRole}
                onClose={handleFormClose}
                onSuccess={handleFormSuccess}
            />

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                title="Deletar Role"
                message={`Tem certeza que deseja deletar a role "${deleteModal.role?.display_name}"?`}
                confirmText="Deletar"
                variant="error"
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}


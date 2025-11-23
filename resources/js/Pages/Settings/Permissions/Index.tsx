import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Plus, Filter } from 'lucide-react';

import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { PermissionsTable } from '@/Components/Settings/PermissionsTable';
import { PermissionFormModal } from '@/Components/Settings/PermissionFormModal';
import { getNavigationItems } from '@/config/navigation';
import { permissionService } from '@/services/permissionService';
import { useToast } from '@/hooks/useToast';
import type { PageProps } from '@/types';
import type { Permission } from '@/types/permissions';

export default function PermissionsIndex({ auth }: PageProps) {
    const user = auth?.user;
    const userRoles = user?.roles || [];
    const { showSuccess, showError } = useToast();

    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [selectedGroup, setSelectedGroup] = useState<string>('');
    const [availableGroups, setAvailableGroups] = useState<string[]>([]);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingPermission, setEditingPermission] = useState<Permission | null>(null);

    const fetchPermissions = async (page = 1, group = '') => {
        setIsLoading(true);
        try {
            const response = await permissionService.getPermissions({
                page,
                per_page: 15,
                group: group || undefined,
            });

            setPermissions(response.data);
            setCurrentPage(response.current_page);
            setLastPage(response.last_page);
            setTotal(response.total);
        } catch (error) {
            showError('Erro ao carregar permissões');
            console.error('Error fetching permissions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchGroups = async () => {
        try {
            const grouped = await permissionService.getGroupedPermissions();
            const groups = grouped.map((g) => g.group);
            setAvailableGroups(groups);
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    useEffect(() => {
        fetchPermissions(currentPage, selectedGroup);
    }, [currentPage, selectedGroup]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= lastPage) {
            setCurrentPage(page);
        }
    };

    const handleEdit = (permission: Permission) => {
        setEditingPermission(permission);
        setIsFormModalOpen(true);
    };

    const handleDelete = async (permission: Permission) => {
        if (!confirm(`Tem certeza que deseja deletar a permissão "${permission.display_name}"?`)) {
            return;
        }

        try {
            await permissionService.deletePermission(permission.id);
            showSuccess('Permissão deletada com sucesso');
            fetchPermissions(currentPage, selectedGroup);
            fetchGroups(); // Refresh groups in case the deleted permission was the last in its group
        } catch (error) {
            showError('Erro ao deletar permissão');
            console.error('Error deleting permission:', error);
        }
    };

    const handleFormSuccess = () => {
        setIsFormModalOpen(false);
        setEditingPermission(null);
        fetchPermissions(currentPage, selectedGroup);
        fetchGroups(); // Refresh groups in case a new group was added
    };

    const handleGroupFilter = (group: string) => {
        setSelectedGroup(group);
        setCurrentPage(1);
    };

    const handleFormClose = () => {
        setIsFormModalOpen(false);
        setEditingPermission(null);
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
                        <span className="font-medium">{total}</span> permissões
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
                        Página {currentPage} de {lastPage} ({total} permissões)
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
            <Head title="Permissões - MediControl" />

            <AuthenticatedLayout navItems={getNavigationItems('/settings/permissions', userRoles)}>
                <div className="min-h-screen bg-base-100">
                    <div className="container mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
                        <div className="mb-6 sm:mb-8">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                                <div className="flex-1">
                                    <h1 className="mb-1 text-xl font-bold text-base-content sm:text-2xl md:text-3xl">
                                        Permissões
                                    </h1>
                                    <p className="text-xs sm:text-sm text-base-content/60">
                                        Crie e gerencie permissões do sistema
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => setIsFormModalOpen(true)}
                                >
                                    <Plus className="w-5 h-5" />
                                    Nova Permissão
                                </button>
                            </div>
                        </div>

                        <div className="mb-4 sm:mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Filter className="w-5 h-5 text-base-content/60" />
                                <span className="text-sm font-medium text-base-content/60">
                                    Filtrar por grupo:
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    className={`btn btn-sm ${!selectedGroup ? 'btn-primary' : 'btn-outline'}`}
                                    onClick={() => handleGroupFilter('')}
                                >
                                    Todos
                                </button>
                                {availableGroups.map((group) => (
                                    <button
                                        key={group}
                                        type="button"
                                        className={`btn btn-sm ${selectedGroup === group ? 'btn-primary' : 'btn-outline'} max-w-[250px]`}
                                        onClick={() => handleGroupFilter(group)}
                                    >
                                        <span className="truncate">{group}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-lg bg-base-200 p-4">
                            <PermissionsTable
                                permissions={permissions}
                                isLoading={isLoading}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />

                            {renderPagination()}
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>

            <PermissionFormModal
                isOpen={isFormModalOpen}
                permission={editingPermission}
                onClose={handleFormClose}
                onSuccess={handleFormSuccess}
            />
        </>
    );
}


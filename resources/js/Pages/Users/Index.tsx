import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Search } from 'lucide-react';

import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { UsersTable } from '@/Components/Users/UsersTable';
import { UserRolesModal } from '@/Components/Users/UserRolesModal';
import { getNavigationItems } from '@/config/navigation';
import { userService } from '@/services/userService';
import { useToast } from '@/hooks/useToast';
import type { PageProps, User } from '@/types';

export default function UsersIndex({ auth }: PageProps) {
    const user = auth?.user;
    const userRoles = user?.roles || [];
    const { showError } = useToast();

    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(
        null
    );
    const [rolesModal, setRolesModal] = useState<{
        isOpen: boolean;
        user: User | null;
    }>({
        isOpen: false,
        user: null,
    });

    const fetchUsers = async (page = 1, search = '') => {
        setIsLoading(true);
        try {
            const response = await userService.getUsers({
                page,
                per_page: 15,
                search: search || undefined,
            });

            setUsers(response.data);
            setCurrentPage(response.current_page);
            setLastPage(response.last_page);
            setTotal(response.total);
        } catch (error) {
            showError('Erro ao carregar usuários');
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(currentPage, searchQuery);
    }, [currentPage]);

    useEffect(() => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        const timeout = setTimeout(() => {
            setCurrentPage(1);
            fetchUsers(1, searchQuery);
        }, 500);

        setSearchTimeout(timeout);

        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [searchQuery]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= lastPage) {
            setCurrentPage(page);
        }
    };

    const handleManageRoles = (user: User) => {
        setRolesModal({
            isOpen: true,
            user,
        });
    };

    const handleRolesModalClose = () => {
        setRolesModal({
            isOpen: false,
            user: null,
        });
    };

    const handleRolesModalSuccess = () => {
        fetchUsers(currentPage, searchQuery);
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
                        usuários
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
                        Página {currentPage} de {lastPage} ({total} usuários)
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
            <Head title="Usuários" />

            <AuthenticatedLayout
                navItems={getNavigationItems('/users', userRoles)}
            >
                <div className="min-h-screen bg-base-100">
                    <div className="container mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
                        <div className="mb-6 sm:mb-8">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                                <div className="flex-1">
                                    <h1 className="mb-1 text-xl font-bold text-base-content sm:text-2xl md:text-3xl">
                                        Usuários
                                    </h1>
                                    <p className="text-xs sm:text-sm text-base-content/60">
                                        Visualize todos os usuários cadastrados no sistema
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4 sm:mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-base-content/40 pointer-events-none z-10" />
                                <input
                                    type="text"
                                    className="input input-bordered w-full pl-10 text-sm sm:text-base bg-base-100"
                                    placeholder="Buscar por nome, email ou telefone..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="rounded-lg bg-base-200 p-4">
                            <UsersTable
                                users={users}
                                isLoading={isLoading}
                                onManageRoles={handleManageRoles}
                            />

                            {renderPagination()}
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>

            <UserRolesModal
                isOpen={rolesModal.isOpen}
                user={rolesModal.user}
                onClose={handleRolesModalClose}
                onSuccess={handleRolesModalSuccess}
            />
        </>
    );
}


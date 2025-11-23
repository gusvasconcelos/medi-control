import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { User } from '@/types';

interface UsersTableProps {
    users: User[];
    isLoading?: boolean;
    onManageRoles?: (user: User) => void;
}

export function UsersTable({
    users,
    isLoading = false,
    onManageRoles,
}: UsersTableProps) {
    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
        } catch {
            return '-';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="rounded-lg bg-base-200 p-8 text-center">
                <p className="text-base-content/60">
                    Nenhum usuário encontrado.
                </p>
            </div>
        );
    }

    return (
        <>
            {/* Desktop View - Table */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Telefone</th>
                            <th>Roles</th>
                            <th>Criado em</th>
                            <th className="text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="hover">
                                <td className="font-medium">{user.name}</td>
                                <td>
                                    {user.email}
                                </td>
                                <td>
                                    {user.phone || (
                                        <span className="text-base-content/40">
                                            -
                                        </span>
                                    )}
                                </td>
                                <td>
                                    {user.roles && user.roles.length > 0 ? (
                                        <div className="flex flex-wrap gap-1 max-w-xs">
                                            {user.roles.map((role) => (
                                                <span
                                                    key={role.id}
                                                    className="badge badge-primary badge-sm break-words"
                                                >
                                                    {role.name}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-base-content/40">
                                            -
                                        </span>
                                    )}
                                </td>
                                <td>
                                    {formatDate(user.created_at)}
                                </td>
                                <td className="text-right">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-primary"
                                        onClick={() => onManageRoles?.(user)}
                                    >
                                        Gerenciar Roles
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View - Cards */}
            <div className="lg:hidden space-y-3">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="rounded-lg bg-base-100 border border-base-300 p-4"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-base text-base-content truncate">
                                    {user.name}
                                </h3>
                                <div className="mt-2 space-y-1.5">
                                    <div className="flex items-start gap-2">
                                        <span className="text-xs text-base-content/60 font-medium min-w-[90px]">
                                            Email:
                                        </span>
                                        <span className="text-xs text-base-content flex-1 break-all">
                                            {user.email}
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-xs text-base-content/60 font-medium min-w-[90px]">
                                            Telefone:
                                        </span>
                                        <span className="text-xs text-base-content flex-1">
                                            {user.phone || (
                                                <span className="text-base-content/40">
                                                    Não informado
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-xs text-base-content/60 font-medium min-w-[90px]">
                                            Roles:
                                        </span>
                                        <span className="text-xs text-base-content flex-1">
                                            {user.roles && user.roles.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles.map((role) => (
                                                        <span
                                                            key={role.id}
                                                            className="badge badge-primary badge-xs break-words"
                                                        >
                                                            {role.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-base-content/40">
                                                    Não informado
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-xs text-base-content/60 font-medium min-w-[90px]">
                                            Criado em:
                                        </span>
                                        <span className="text-xs text-base-content flex-1">
                                            {formatDate(user.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-primary"
                                    onClick={() => onManageRoles?.(user)}
                                >
                                    Gerenciar Roles
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}


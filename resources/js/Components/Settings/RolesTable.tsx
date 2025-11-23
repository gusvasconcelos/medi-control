import { Edit, Trash2 } from 'lucide-react';
import type { Role } from '@/types/permissions';

interface RolesTableProps {
    roles: Role[];
    isLoading?: boolean;
    onEdit?: (role: Role) => void;
    onDelete?: (role: Role) => void;
}

export function RolesTable({
    roles,
    isLoading = false,
    onEdit,
    onDelete,
}: RolesTableProps) {

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (roles.length === 0) {
        return (
            <div className="rounded-lg bg-base-200 p-8 text-center">
                <p className="text-base-content/60">
                    Nenhuma role encontrada.
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
                            <th>Nome de Exibição</th>
                            <th>Descrição</th>
                            <th>Permissões</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((role) => (
                            <tr key={role.id} className="hover">
                                <td className="font-medium max-w-xs">
                                    <div className="max-w-full">
                                        <span className="badge badge-ghost inline-block max-w-full truncate" title={role.name}>
                                            {role.name}
                                        </span>
                                    </div>
                                </td>
                                <td className="max-w-xs">
                                    <span className="line-clamp-2">{role.display_name}</span>
                                </td>
                                <td className="max-w-md">
                                    {role.description ? (
                                        <span className="line-clamp-2">{role.description}</span>
                                    ) : (
                                        <span className="text-base-content/40">
                                            -
                                        </span>
                                    )}
                                </td>
                                <td>
                                    <span className="badge badge-primary whitespace-nowrap">
                                        {role.permissions?.length || 0} permissões
                                    </span>
                                </td>
                                <td>
                                    <div className="flex gap-2">
                                        {onEdit && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-ghost"
                                                onClick={() => onEdit(role)}
                                                title="Editar"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-ghost text-error"
                                                onClick={() => onDelete(role)}
                                                title="Deletar"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View - Cards */}
            <div className="lg:hidden space-y-3">
                {roles.map((role) => (
                    <div
                        key={role.id}
                        className="rounded-lg bg-base-100 border border-base-300 p-4"
                    >
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-base text-base-content mb-1 break-words">
                                    {role.display_name}
                                </h3>
                                <div className="max-w-full overflow-hidden">
                                    <span className="badge badge-ghost badge-sm inline-block max-w-full truncate" title={role.name}>
                                        {role.name}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                                {onEdit && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-ghost"
                                        onClick={() => onEdit(role)}
                                        title="Editar"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-ghost text-error"
                                        onClick={() => onDelete(role)}
                                        title="Deletar"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            {role.description && (
                                <div className="flex items-start gap-2">
                                    <span className="text-xs text-base-content/60 font-medium min-w-[90px] flex-shrink-0">
                                        Descrição:
                                    </span>
                                    <span className="text-xs text-base-content flex-1 break-words">
                                        {role.description}
                                    </span>
                                </div>
                            )}
                            <div className="flex items-start gap-2">
                                <span className="text-xs text-base-content/60 font-medium min-w-[90px] flex-shrink-0">
                                    Permissões:
                                </span>
                                <span className="text-xs text-base-content flex-1">
                                    <span className="badge badge-primary badge-xs whitespace-nowrap">
                                        {role.permissions?.length || 0} permissões
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}


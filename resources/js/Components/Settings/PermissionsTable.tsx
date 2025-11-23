import { Edit, Trash2 } from 'lucide-react';
import type { Permission } from '@/types/permissions';

interface PermissionsTableProps {
    permissions: Permission[];
    isLoading?: boolean;
    onEdit?: (permission: Permission) => void;
    onDelete?: (permission: Permission) => void;
}

export function PermissionsTable({
    permissions,
    isLoading = false,
    onEdit,
    onDelete,
}: PermissionsTableProps) {

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (permissions.length === 0) {
        return (
            <div className="rounded-lg bg-base-200 p-8 text-center">
                <p className="text-base-content/60">
                    Nenhuma permissão encontrada.
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
                            <th>Grupo</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {permissions.map((permission) => (
                            <tr key={permission.id} className="hover">
                                <td className="font-medium max-w-xs">
                                    <div className="max-w-full">
                                        <span className="badge badge-ghost inline-block max-w-full truncate" title={permission.name}>
                                            {permission.name}
                                        </span>
                                    </div>
                                </td>
                                <td className="max-w-xs">
                                    <span className="line-clamp-2">{permission.display_name}</span>
                                </td>
                                <td className="max-w-md">
                                    {permission.description ? (
                                        <span className="line-clamp-2">{permission.description}</span>
                                    ) : (
                                        <span className="text-base-content/40">
                                            -
                                        </span>
                                    )}
                                </td>
                                <td className="max-w-[200px]">
                                    {permission.group ? (
                                        <span className="badge badge-outline badge-sm inline-block max-w-full truncate" title={permission.group}>
                                            {permission.group}
                                        </span>
                                    ) : (
                                        <span className="text-base-content/40">
                                            -
                                        </span>
                                    )}
                                </td>
                                <td>
                                    <div className="flex gap-2">
                                        {onEdit && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-ghost"
                                                onClick={() => onEdit(permission)}
                                                title="Editar"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-ghost text-error"
                                                onClick={() => onDelete(permission)}
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
                {permissions.map((permission) => (
                    <div
                        key={permission.id}
                        className="rounded-lg bg-base-100 border border-base-300 p-4"
                    >
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-base text-base-content mb-1 break-words">
                                    {permission.display_name}
                                </h3>
                                <div className="max-w-full overflow-hidden">
                                    <span className="badge badge-ghost badge-sm inline-block max-w-full truncate" title={permission.name}>
                                        {permission.name}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                                {onEdit && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-ghost"
                                        onClick={() => onEdit(permission)}
                                        title="Editar"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-ghost text-error"
                                        onClick={() => onDelete(permission)}
                                        title="Deletar"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            {permission.description && (
                                <div className="flex items-start gap-2">
                                    <span className="text-xs text-base-content/60 font-medium min-w-[90px] flex-shrink-0">
                                        Descrição:
                                    </span>
                                    <span className="text-xs text-base-content flex-1 break-words">
                                        {permission.description}
                                    </span>
                                </div>
                            )}
                            {permission.group && (
                                <div className="flex items-start gap-2">
                                    <span className="text-xs text-base-content/60 font-medium min-w-[90px] flex-shrink-0">
                                        Grupo:
                                    </span>
                                    <span className="text-xs text-base-content flex-1 min-w-0">
                                        <span className="badge badge-outline badge-xs inline-block max-w-full truncate" title={permission.group}>
                                            {permission.group}
                                        </span>
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}


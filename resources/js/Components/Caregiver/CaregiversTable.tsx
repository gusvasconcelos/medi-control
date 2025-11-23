import { Trash2, Shield, MoreVertical } from 'lucide-react';
import type { CaregiverPatient } from '@/types/caregiver';

interface CaregiversTableProps {
    caregivers: CaregiverPatient[];
    isLoading?: boolean;
    onEditPermissions?: (relationship: CaregiverPatient) => void;
    onRevoke?: (relationship: CaregiverPatient) => void;
    onCancelInvitation?: (relationship: CaregiverPatient) => void;
}

function getStatusBadge(status: string) {
    switch (status) {
        case 'active':
            return <span className="badge badge-success badge-sm">Ativo</span>;
        case 'pending':
            return <span className="badge badge-warning badge-sm">Pendente</span>;
        case 'revoked':
            return <span className="badge badge-error badge-sm">Revogado</span>;
        default:
            return <span className="badge badge-ghost badge-sm">{status}</span>;
    }
}

function formatDate(dateString: string | null): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
}

export function CaregiversTable({
    caregivers,
    isLoading = false,
    onEditPermissions,
    onRevoke,
    onCancelInvitation,
}: CaregiversTableProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (caregivers.length === 0) {
        return (
            <div className="rounded-lg bg-base-200 p-8 text-center">
                <p className="text-base-content/60">
                    Nenhum cuidador encontrado.
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
                            <th>Cuidador</th>
                            <th>Status</th>
                            <th>Permissões</th>
                            <th>Data do Convite</th>
                            <th>Data de Aceitação</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {caregivers.map((relationship) => (
                            <tr key={relationship.id} className="hover">
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar placeholder">
                                            <div className="bg-primary text-primary-content w-10 rounded-full">
                                                <span className="text-sm">
                                                    {relationship.caregiver?.name
                                                        ?.split(' ')
                                                        .map((n) => n[0])
                                                        .join('')
                                                        .toUpperCase()
                                                        .slice(0, 2) || '?'}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-medium">
                                                {relationship.caregiver?.name || 'Convite pendente'}
                                            </div>
                                            <div className="text-sm text-base-content/60">
                                                {relationship.caregiver?.email || '-'}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>{getStatusBadge(relationship.status)}</td>
                                <td>
                                    <span className="badge badge-primary badge-sm">
                                        {relationship.permissions?.length || 0} permissões
                                    </span>
                                </td>
                                <td>{formatDate(relationship.invited_at)}</td>
                                <td>{formatDate(relationship.accepted_at)}</td>
                                <td>
                                    {/* Desktop grande: Botões individuais */}
                                    <div className="hidden xl:flex gap-2">
                                        {relationship.status === 'pending' && onCancelInvitation && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-ghost text-error"
                                                onClick={() => onCancelInvitation(relationship)}
                                                title="Remover Convite"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                        {relationship.status === 'active' && onEditPermissions && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-ghost"
                                                onClick={() => onEditPermissions(relationship)}
                                                title="Editar Permissões"
                                            >
                                                <Shield className="w-4 h-4" />
                                            </button>
                                        )}
                                        {relationship.status === 'active' && onRevoke && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-ghost text-error"
                                                onClick={() => onRevoke(relationship)}
                                                title="Revogar Acesso"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Desktop médio/Tablet: Dropdown */}
                                    <div className="xl:hidden dropdown dropdown-end">
                                        <button
                                            type="button"
                                            tabIndex={0}
                                            className="btn btn-ghost btn-sm btn-circle"
                                            aria-label="Ações"
                                        >
                                            <MoreVertical className="h-5 w-5" />
                                        </button>
                                        <ul
                                            tabIndex={0}
                                            className="dropdown-content menu bg-base-200 rounded-box z-[1] w-52 p-2 shadow-lg"
                                        >
                                            {relationship.status === 'pending' && onCancelInvitation && (
                                                <li>
                                                    <button
                                                        type="button"
                                                        onClick={() => onCancelInvitation(relationship)}
                                                        className="flex items-center gap-3 text-error"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Remover Convite
                                                    </button>
                                                </li>
                                            )}
                                            {relationship.status === 'active' && onEditPermissions && (
                                                <li>
                                                    <button
                                                        type="button"
                                                        onClick={() => onEditPermissions(relationship)}
                                                        className="flex items-center gap-3"
                                                    >
                                                        <Shield className="h-4 w-4" />
                                                        Editar Permissões
                                                    </button>
                                                </li>
                                            )}
                                            {relationship.status === 'active' && onRevoke && (
                                                <li>
                                                    <button
                                                        type="button"
                                                        onClick={() => onRevoke(relationship)}
                                                        className="flex items-center gap-3 text-error"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Revogar Acesso
                                                    </button>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View - Cards */}
            <div className="lg:hidden space-y-3">
                {caregivers.map((relationship) => (
                    <div
                        key={relationship.id}
                        className="rounded-lg bg-base-100 border border-base-300 p-4"
                    >
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="avatar placeholder flex-shrink-0">
                                    <div className="bg-primary text-primary-content w-10 rounded-full">
                                        <span className="text-sm">
                                            {relationship.caregiver?.name
                                                ?.split(' ')
                                                .map((n) => n[0])
                                                .join('')
                                                .toUpperCase()
                                                .slice(0, 2) || '?'}
                                        </span>
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-base text-base-content truncate">
                                        {relationship.caregiver?.name || 'Convite pendente'}
                                    </h3>
                                    <p className="text-sm text-base-content/60 truncate">
                                        {relationship.caregiver?.email || '-'}
                                    </p>
                                </div>
                            </div>
                            {/* Dropdown Menu */}
                            <div className="dropdown dropdown-end flex-shrink-0">
                                <button
                                    type="button"
                                    tabIndex={0}
                                    className="btn btn-ghost btn-sm btn-circle"
                                    aria-label="Ações"
                                >
                                    <MoreVertical className="h-5 w-5" />
                                </button>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content menu bg-base-200 rounded-box z-[1] w-52 p-2 shadow-lg"
                                >
                                    {relationship.status === 'pending' && onCancelInvitation && (
                                        <li>
                                            <button
                                                type="button"
                                                onClick={() => onCancelInvitation(relationship)}
                                                className="flex items-center gap-3 text-error"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Remover Convite
                                            </button>
                                        </li>
                                    )}
                                    {relationship.status === 'active' && onEditPermissions && (
                                        <li>
                                            <button
                                                type="button"
                                                onClick={() => onEditPermissions(relationship)}
                                                className="flex items-center gap-3"
                                            >
                                                <Shield className="h-4 w-4" />
                                                Editar Permissões
                                            </button>
                                        </li>
                                    )}
                                    {relationship.status === 'active' && onRevoke && (
                                        <li>
                                            <button
                                                type="button"
                                                onClick={() => onRevoke(relationship)}
                                                className="flex items-center gap-3 text-error"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Revogar Acesso
                                            </button>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-base-content/60 font-medium min-w-[90px]">
                                    Status:
                                </span>
                                {getStatusBadge(relationship.status)}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-base-content/60 font-medium min-w-[90px]">
                                    Permissões:
                                </span>
                                <span className="badge badge-primary badge-xs">
                                    {relationship.permissions?.length || 0} permissões
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-base-content/60 font-medium min-w-[90px]">
                                    Convite:
                                </span>
                                <span className="text-xs">{formatDate(relationship.invited_at)}</span>
                            </div>
                            {relationship.accepted_at && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-base-content/60 font-medium min-w-[90px]">
                                        Aceito em:
                                    </span>
                                    <span className="text-xs">{formatDate(relationship.accepted_at)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

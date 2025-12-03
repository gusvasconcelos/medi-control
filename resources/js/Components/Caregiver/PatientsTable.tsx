import { router } from '@inertiajs/react';
import { Check, X, ArrowRight } from 'lucide-react';
import type { CaregiverPatient } from '@/types/caregiver';

interface PatientsTableProps {
    patients: CaregiverPatient[];
    isLoading?: boolean;
    onAccept?: (relationship: CaregiverPatient) => void;
    onReject?: (relationship: CaregiverPatient) => void;
    onView?: (relationship: CaregiverPatient) => void;
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

export function PatientsTable({
    patients,
    isLoading = false,
    onAccept,
    onReject,
    onView,
}: PatientsTableProps) {
    const handleViewPatient = (relationship: CaregiverPatient) => {
        if (onView) {
            onView(relationship);
        } else if (relationship.patient?.id) {
            router.visit(`/my-patients/${relationship.patient.id}`);
        }
    };
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (patients.length === 0) {
        return (
            <div className="rounded-lg bg-base-200 p-8 text-center">
                <p className="text-base-content/60">
                    Nenhum paciente encontrado.
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
                            <th>Paciente</th>
                            <th>Status</th>
                            <th>Permissões</th>
                            <th>Data do Convite</th>
                            <th>Data de Aceitação</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((relationship) => (
                            <tr key={relationship.id} className="hover">
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar placeholder">
                                            <div className="bg-secondary text-secondary-content w-10 rounded-full">
                                                <span className="text-sm">
                                                    {relationship.patient?.name
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
                                                {relationship.patient?.name || '-'}
                                            </div>
                                            <div className="text-sm text-base-content/60">
                                                {relationship.patient?.email || '-'}
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
                                    <div className="flex gap-2">
                                        {relationship.status === 'pending' && (
                                            <>
                                                {onAccept && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-ghost text-success"
                                                        onClick={() => onAccept(relationship)}
                                                        title="Aceitar Convite"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {onReject && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-ghost text-error"
                                                        onClick={() => onReject(relationship)}
                                                        title="Recusar Convite"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </>
                                        )}
                                        {relationship.status === 'active' && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-primary"
                                                onClick={() => handleViewPatient(relationship)}
                                                title="Acessar Paciente"
                                            >
                                                <ArrowRight className="w-4 h-4" />
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
                {patients.map((relationship) => (
                    <div
                        key={relationship.id}
                        className="rounded-lg bg-base-100 border border-base-300 p-4"
                    >
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="avatar placeholder flex-shrink-0">
                                    <div className="bg-secondary text-secondary-content w-10 rounded-full">
                                        <span className="text-sm">
                                            {relationship.patient?.name
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
                                        {relationship.patient?.name || '-'}
                                    </h3>
                                    <p className="text-sm text-base-content/60 truncate">
                                        {relationship.patient?.email || '-'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                                {relationship.status === 'pending' && (
                                    <>
                                        {onAccept && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-ghost text-success"
                                                onClick={() => onAccept(relationship)}
                                                title="Aceitar Convite"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}
                                        {onReject && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-ghost text-error"
                                                onClick={() => onReject(relationship)}
                                                title="Recusar Convite"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </>
                                )}
                                {relationship.status === 'active' && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-primary"
                                        onClick={() => handleViewPatient(relationship)}
                                        title="Acessar Paciente"
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                )}
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

import { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { getNavigationItems } from '@/config/navigation';
import type { PageProps } from '@/types';
import type { HorizonJob } from '@/types/horizon';
import {
    RefreshCcw,
    Tag,
    ChevronLeft,
    ChevronRight,
    Eye,
    RotateCcw,
} from 'lucide-react';

interface HorizonMonitoringShowProps extends PageProps {
    tag: string;
    jobs: HorizonJob[];
    total: number;
    startingAt: number;
}

const BASE_URL = '/monitoring/horizon';

function formatTimestamp(timestamp?: string | number): string {
    if (!timestamp) return '-';

    // Horizon stores timestamps as Unix timestamps (seconds with microseconds)
    const numericTimestamp = typeof timestamp === 'string' ? parseFloat(timestamp) : timestamp;

    if (isNaN(numericTimestamp)) return '-';

    // Convert seconds to milliseconds for JavaScript Date
    const date = new Date(numericTimestamp * 1000);

    if (isNaN(date.getTime())) return '-';

    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function JobStatusBadge({ status }: { status: string }) {
    const config: Record<string, { label: string; className: string }> = {
        pending: { label: 'Pendente', className: 'badge-warning' },
        reserved: { label: 'Reservado', className: 'badge-info' },
        completed: { label: 'Concluído', className: 'badge-success' },
        failed: { label: 'Falhou', className: 'badge-error' },
    };

    const { label, className } = config[status] || { label: status, className: 'badge-ghost' };

    return <span className={`badge ${className} badge-sm`}>{label}</span>;
}

export default function HorizonMonitoringShow({
    auth,
    tag,
    jobs,
    total,
    startingAt,
}: HorizonMonitoringShowProps) {
    const user = auth?.user;
    const userRoles = user?.roles || [];
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            onFinish: () => {
                setIsRefreshing(false);
            },
        });
    };

    const handleRetry = (jobId: string) => {
        router.post(`${BASE_URL}/jobs/${jobId}/retry`, {}, {
            preserveScroll: true,
        });
    };

    const goToPage = (newStartingAt: number) => {
        router.get(`${BASE_URL}/monitoring/${encodeURIComponent(tag)}`, {
            starting_at: newStartingAt,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const hasJobs = jobs.length > 0;
    const hasPrevious = startingAt > 0;
    const hasNext = jobs.length === 50 && startingAt + jobs.length < total;

    return (
        <>
            <Head title={`Tag: ${tag}`} />

            <AuthenticatedLayout navItems={getNavigationItems('/monitoring/horizon', userRoles)}>
                <div className="min-h-screen bg-base-100">
                    <div className="container mx-auto max-w-[1600px] px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
                        {/* Header */}
                        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <Link
                                    href={`${BASE_URL}/monitoring`}
                                    className="btn btn-ghost btn-sm btn-circle"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </Link>
                                <div>
                                    <h1 className="text-2xl font-bold text-base-content sm:text-3xl flex items-center gap-3">
                                        <Tag className="w-7 h-7 text-primary" />
                                        <span className="font-mono">{tag}</span>
                                    </h1>
                                    <p className="text-sm text-base-content/60 mt-1">
                                        {total.toLocaleString()} job{total !== 1 ? 's' : ''} com esta tag
                                    </p>
                                </div>
                            </div>

                            <button
                                className="btn btn-primary btn-sm sm:btn-md"
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                            >
                                <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                                <span className="hidden sm:inline">
                                    {isRefreshing ? 'Atualizando...' : 'Atualizar'}
                                </span>
                            </button>
                        </div>

                        {/* Jobs Table */}
                        <div className="bg-base-100 border border-base-300 rounded-2xl overflow-hidden">
                            {hasJobs ? (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Job</th>
                                                    <th>Fila</th>
                                                    <th>Status</th>
                                                    <th>Data</th>
                                                    <th className="text-right">Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {jobs.map((job) => (
                                                    <tr key={job.id} className="hover">
                                                        <td>
                                                            <div className="flex flex-col">
                                                                <span className="font-medium">
                                                                    {job.payload?.displayName || job.name}
                                                                </span>
                                                                <span className="text-xs text-base-content/50 font-mono">
                                                                    {job.id}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className="badge badge-ghost badge-sm font-mono">
                                                                {job.queue}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <JobStatusBadge status={job.status} />
                                                        </td>
                                                        <td className="text-sm text-base-content/70">
                                                            {formatTimestamp(job.payload?.pushedAt || job.completed_at || job.failed_at || job.reserved_at)}
                                                        </td>
                                                        <td className="text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Link
                                                                    href={`${BASE_URL}/jobs/show/${job.id}`}
                                                                    className="btn btn-ghost btn-xs"
                                                                    title="Ver detalhes"
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </Link>
                                                                {job.status === 'failed' && (
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-ghost btn-xs text-warning"
                                                                        onClick={() => handleRetry(job.id)}
                                                                        title="Reprocessar"
                                                                    >
                                                                        <RotateCcw className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="flex items-center justify-between px-4 py-3 border-t border-base-300">
                                        <span className="text-sm text-base-content/60">
                                            Total: {total.toLocaleString()} job{total !== 1 ? 's' : ''}
                                        </span>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-ghost btn-sm"
                                                disabled={!hasPrevious}
                                                onClick={() => goToPage(Math.max(0, startingAt - 50))}
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                                Anterior
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-ghost btn-sm"
                                                disabled={!hasNext}
                                                onClick={() => goToPage(startingAt + 50)}
                                            >
                                                Próximo
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-12 text-base-content/50">
                                    <Tag className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg">Nenhum job encontrado</p>
                                    <p className="text-sm mt-1">
                                        Não há jobs com a tag "{tag}"
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}

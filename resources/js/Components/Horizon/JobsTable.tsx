import { Eye, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, router } from '@inertiajs/react';
import type { HorizonJob } from '@/types/horizon';

interface JobsTableProps {
    jobs: HorizonJob[];
    total: number;
    status: string;
    startingAt?: number;
    showRetry?: boolean;
    baseUrl: string;
}

function formatTimestamp(timestamp?: string | number): string {
    if (!timestamp) return '-';

    // Horizon stores timestamps as Unix timestamps (seconds with microseconds)
    // e.g., "1700000000.123456" or 1700000000.123456
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
        second: '2-digit',
    });
}

function getJobName(job: HorizonJob): string {
    return job.payload?.displayName || job.name || 'Unknown Job';
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

export function JobsTable({
    jobs,
    total,
    status,
    startingAt = -1,
    showRetry = false,
    baseUrl,
}: JobsTableProps) {
    const hasJobs = jobs.length > 0;
    const hasPrevious = startingAt > 0;
    const hasNext = jobs.length === 50 && startingAt + jobs.length < total;

    const handleRetry = (jobId: string) => {
        router.post(`${baseUrl}/jobs/${jobId}/retry`, {}, {
            preserveScroll: true,
        });
    };

    const goToPage = (newStartingAt: number) => {
        router.get(`${baseUrl}/jobs/${status}`, {
            starting_at: newStartingAt,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <div className="bg-base-100 border border-base-300 rounded-2xl overflow-hidden">
            {hasJobs ? (
                <>
                    {/* Mobile Card View */}
                    <div className="block md:hidden divide-y divide-base-300">
                        {jobs.map((job) => (
                            <div key={job.id} className="p-4 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">{getJobName(job)}</p>
                                        <p className="text-xs text-base-content/50 font-mono truncate">{job.id}</p>
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        <Link
                                            href={`${baseUrl}/jobs/show/${job.id}`}
                                            className="btn btn-ghost btn-xs btn-circle"
                                            title="Ver detalhes"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        {showRetry && status === 'failed' && (
                                            <button
                                                type="button"
                                                className="btn btn-ghost btn-xs btn-circle text-warning"
                                                onClick={() => handleRetry(job.id)}
                                                title="Reprocessar"
                                            >
                                                <RotateCcw className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                    <span className="badge badge-ghost badge-sm font-mono">{job.queue}</span>
                                    <JobStatusBadge status={job.status} />
                                    <span className="text-base-content/60">
                                        {formatTimestamp(job.payload?.pushedAt || job.completed_at || job.failed_at || job.reserved_at)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
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
                                                <span className="font-medium">{getJobName(job)}</span>
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
                                                    href={`${baseUrl}/jobs/show/${job.id}`}
                                                    className="btn btn-ghost btn-xs"
                                                    title="Ver detalhes"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                {showRetry && status === 'failed' && (
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

                    {/* Pagination Footer */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-base-300">
                        <span className="text-sm text-base-content/60 order-2 sm:order-1">
                            Total: {total.toLocaleString()} job{total !== 1 ? 's' : ''}
                        </span>

                        <div className="flex items-center gap-2 order-1 sm:order-2">
                            <button
                                type="button"
                                className="btn btn-ghost btn-sm"
                                disabled={!hasPrevious}
                                onClick={() => goToPage(Math.max(0, startingAt - 50))}
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span className="hidden xs:inline">Anterior</span>
                            </button>
                            <button
                                type="button"
                                className="btn btn-ghost btn-sm"
                                disabled={!hasNext}
                                onClick={() => goToPage(startingAt + 50)}
                            >
                                <span className="hidden xs:inline">Próximo</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center py-12 text-base-content/50">
                    <p className="text-lg">Nenhum job encontrado</p>
                    <p className="text-sm mt-1">Não há jobs com status "{status}"</p>
                </div>
            )}
        </div>
    );
}

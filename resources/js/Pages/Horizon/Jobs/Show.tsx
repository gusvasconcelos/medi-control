import { Head, Link, router } from '@inertiajs/react';
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { getNavigationItems } from '@/config/navigation';
import type { PageProps } from '@/types';
import type { HorizonJob } from '@/types/horizon';
import {
    ChevronLeft,
    RotateCcw,
    Clock,
    CheckCircle,
    AlertTriangle,
    Tag,
    Server,
    FileJson,
} from 'lucide-react';
import { ExceptionViewer } from '@/Components/Horizon/ExceptionViewer';

interface HorizonJobShowProps extends PageProps {
    job: HorizonJob | null;
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
        second: '2-digit',
    });
}

function JobStatusBadge({ status }: { status: string }) {
    const config: Record<string, { label: string; className: string; icon: typeof Clock }> = {
        pending: { label: 'Pendente', className: 'badge-warning', icon: Clock },
        reserved: { label: 'Reservado', className: 'badge-info', icon: Clock },
        completed: { label: 'Concluído', className: 'badge-success', icon: CheckCircle },
        failed: { label: 'Falhou', className: 'badge-error', icon: AlertTriangle },
    };

    const { label, className, icon: Icon } = config[status] || {
        label: status,
        className: 'badge-ghost',
        icon: Clock,
    };

    return (
        <span className={`badge ${className} gap-1`}>
            <Icon className="w-3 h-3" />
            {label}
        </span>
    );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-base-300 last:border-0">
            <span className="text-sm text-base-content/60 sm:w-40 flex-shrink-0">{label}</span>
            <span className="text-sm font-medium mt-1 sm:mt-0">{value}</span>
        </div>
    );
}

export default function HorizonJobShow({ auth, job }: HorizonJobShowProps) {
    const user = auth?.user;
    const userRoles = user?.roles || [];

    if (!job) {
        return (
            <>
                <Head title="Job não encontrado" />
                <AuthenticatedLayout navItems={getNavigationItems('/monitoring/horizon', userRoles)}>
                    <div className="min-h-screen bg-base-100 flex items-center justify-center">
                        <div className="text-center">
                            <AlertTriangle className="w-16 h-16 mx-auto text-warning mb-4" />
                            <h1 className="text-2xl font-bold mb-2">Job não encontrado</h1>
                            <p className="text-base-content/60 mb-4">
                                O job solicitado não existe ou foi removido.
                            </p>
                            <Link href={BASE_URL} className="btn btn-primary">
                                Voltar ao Dashboard
                            </Link>
                        </div>
                    </div>
                </AuthenticatedLayout>
            </>
        );
    }

    const handleRetry = () => {
        router.post(`${BASE_URL}/jobs/${job.id}/retry`, {}, {
            preserveScroll: true,
        });
    };

    const jobName = job.payload?.displayName || job.name || 'Unknown Job';
    const tags = job.payload?.tags || [];

    return (
        <>
            <Head title={`${jobName}`} />

            <AuthenticatedLayout navItems={getNavigationItems('/monitoring/horizon', userRoles)}>
                <div className="min-h-screen bg-base-100">
                    <div className="container mx-auto max-w-[1200px] px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
                        {/* Header */}
                        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <Link
                                    href={`${BASE_URL}/jobs/${job.status}`}
                                    className="btn btn-ghost btn-sm btn-circle"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </Link>
                                <div>
                                    <h1 className="text-xl font-bold text-base-content sm:text-2xl">
                                        {jobName}
                                    </h1>
                                    <p className="text-sm text-base-content/60 font-mono mt-1">
                                        {job.id}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <JobStatusBadge status={job.status} />
                                {job.status === 'failed' && (
                                    <button
                                        className="btn btn-warning btn-sm"
                                        onClick={handleRetry}
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        Reprocessar
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Job Info */}
                        <div className="bg-base-100 border border-base-300 rounded-2xl p-6 mb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <Server className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="text-lg font-semibold">Informações do Job</h2>
                            </div>

                            <InfoRow label="ID" value={<span className="font-mono">{job.id}</span>} />
                            <InfoRow label="Nome" value={jobName} />
                            <InfoRow
                                label="Fila"
                                value={<span className="badge badge-ghost font-mono">{job.queue}</span>}
                            />
                            <InfoRow label="Status" value={<JobStatusBadge status={job.status} />} />
                            {job.payload?.pushedAt && (
                                <InfoRow label="Enviado em" value={formatTimestamp(job.payload.pushedAt)} />
                            )}
                            {job.reserved_at && (
                                <InfoRow label="Reservado em" value={formatTimestamp(job.reserved_at)} />
                            )}
                            {job.completed_at && (
                                <InfoRow label="Concluído em" value={formatTimestamp(job.completed_at)} />
                            )}
                            {job.failed_at && (
                                <InfoRow label="Falhou em" value={formatTimestamp(job.failed_at)} />
                            )}
                            {job.payload?.maxTries && (
                                <InfoRow label="Máx. tentativas" value={job.payload.maxTries} />
                            )}
                            {job.payload?.timeout && (
                                <InfoRow label="Timeout" value={`${job.payload.timeout}s`} />
                            )}
                        </div>

                        {/* Tags */}
                        {tags.length > 0 && (
                            <div className="bg-base-100 border border-base-300 rounded-2xl p-6 mb-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-secondary/10 rounded-lg">
                                        <Tag className="w-5 h-5 text-secondary" />
                                    </div>
                                    <h2 className="text-lg font-semibold">Tags</h2>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag, index) => (
                                        <span key={index} className="badge badge-outline">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Exception */}
                        {job.exception && (
                            <div className="bg-base-100 border border-base-300 rounded-2xl p-6 mb-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-error/10 rounded-lg">
                                        <AlertTriangle className="w-5 h-5 text-error" />
                                    </div>
                                    <h2 className="text-lg font-semibold">Exceção</h2>
                                </div>

                                <ExceptionViewer exception={job.exception} />
                            </div>
                        )}

                        {/* Payload */}
                        <div className="bg-base-100 border border-base-300 rounded-2xl p-6 mb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-info/10 rounded-lg">
                                    <FileJson className="w-5 h-5 text-info" />
                                </div>
                                <h2 className="text-lg font-semibold">Payload</h2>
                            </div>

                            <pre className="bg-base-200 rounded-lg p-4 text-xs font-mono overflow-x-auto max-h-[400px] overflow-y-auto">
                                {JSON.stringify(job.payload, null, 2)}
                            </pre>
                        </div>

                        {/* Retry History */}
                        {job.retried_by && job.retried_by.length > 0 && (
                            <div className="bg-base-100 border border-base-300 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-warning/10 rounded-lg">
                                        <RotateCcw className="w-5 h-5 text-warning" />
                                    </div>
                                    <h2 className="text-lg font-semibold">Histórico de Retry</h2>
                                </div>

                                <div className="space-y-2">
                                    {job.retried_by.map((retry, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between py-2 border-b border-base-300 last:border-0"
                                        >
                                            <span className="font-mono text-sm">{retry.id}</span>
                                            <span className="text-sm text-base-content/60">
                                                {formatTimestamp(retry.retried_at)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}

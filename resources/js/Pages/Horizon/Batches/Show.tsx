import { Head, Link, router } from '@inertiajs/react';
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { getNavigationItems } from '@/config/navigation';
import type { PageProps } from '@/types';
import type { HorizonBatch, HorizonJob } from '@/types/horizon';
import {
    ChevronLeft,
    RotateCcw,
    Package,
    CheckCircle,
    Clock,
    XCircle,
    AlertTriangle,
    Eye,
} from 'lucide-react';
import { BatchProgress } from '@/Components/Horizon/BatchProgress';

interface HorizonBatchShowProps extends PageProps {
    batch: HorizonBatch | null;
    failedJobs: HorizonJob[];
}

const BASE_URL = '/monitoring/horizon';

function formatTimestamp(timestamp?: string | null): string {
    if (!timestamp) return '-';

    const date = new Date(timestamp);

    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

function BatchStatusBadge({ batch }: { batch: HorizonBatch }) {
    if (batch.cancelledAt) {
        return (
            <span className="badge badge-error badge-lg gap-1">
                <XCircle className="w-4 h-4" />
                Cancelado
            </span>
        );
    }

    if (batch.finishedAt) {
        if (batch.failedJobs > 0) {
            return (
                <span className="badge badge-warning badge-lg gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    Concluído com Falhas
                </span>
            );
        }

        return (
            <span className="badge badge-success badge-lg gap-1">
                <CheckCircle className="w-4 h-4" />
                Concluído
            </span>
        );
    }

    return (
        <span className="badge badge-info badge-lg gap-1">
            <Clock className="w-4 h-4" />
            Em Progresso
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

export default function HorizonBatchShow({ auth, batch, failedJobs }: HorizonBatchShowProps) {
    const user = auth?.user;
    const userRoles = user?.roles || [];

    if (!batch) {
        return (
            <>
                <Head title="Batch não encontrado" />
                <AuthenticatedLayout navItems={getNavigationItems('/monitoring/horizon', userRoles)}>
                    <div className="min-h-screen bg-base-100 flex items-center justify-center">
                        <div className="text-center">
                            <AlertTriangle className="w-16 h-16 mx-auto text-warning mb-4" />
                            <h1 className="text-2xl font-bold mb-2">Batch não encontrado</h1>
                            <p className="text-base-content/60 mb-4">
                                O batch solicitado não existe ou foi removido.
                            </p>
                            <Link href={`${BASE_URL}/batches`} className="btn btn-primary">
                                Voltar para Batches
                            </Link>
                        </div>
                    </div>
                </AuthenticatedLayout>
            </>
        );
    }

    const handleRetry = () => {
        router.post(`${BASE_URL}/batches/${batch.id}/retry`, {}, {
            preserveScroll: true,
        });
    };

    const handleRetryJob = (jobId: string) => {
        router.post(`${BASE_URL}/jobs/${jobId}/retry`, {}, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title={`${batch.name}`} />

            <AuthenticatedLayout navItems={getNavigationItems('/monitoring/horizon', userRoles)}>
                <div className="min-h-screen bg-base-100">
                    <div className="container mx-auto max-w-[1200px] px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
                        {/* Header */}
                        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <Link
                                    href={`${BASE_URL}/batches`}
                                    className="btn btn-ghost btn-sm btn-circle"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </Link>
                                <div>
                                    <h1 className="text-xl font-bold text-base-content sm:text-2xl flex items-center gap-3">
                                        <Package className="w-6 h-6 text-primary" />
                                        {batch.name}
                                    </h1>
                                    <p className="text-sm text-base-content/60 font-mono mt-1">
                                        {batch.id}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <BatchStatusBadge batch={batch} />
                                {batch.failedJobs > 0 && !batch.cancelledAt && (
                                    <button
                                        className="btn btn-warning btn-sm"
                                        onClick={handleRetry}
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        Reprocessar Falhos
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="bg-base-100 border border-base-300 rounded-2xl p-6 mb-6">
                            <h2 className="text-lg font-semibold mb-4">Progresso</h2>
                            <BatchProgress progress={batch.progress} size="lg" />

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                                <div className="text-center p-4 bg-base-200 rounded-lg">
                                    <p className="text-2xl font-bold text-base-content">{batch.totalJobs}</p>
                                    <p className="text-sm text-base-content/60">Total</p>
                                </div>
                                <div className="text-center p-4 bg-success/10 rounded-lg">
                                    <p className="text-2xl font-bold text-success">{batch.processedJobs}</p>
                                    <p className="text-sm text-base-content/60">Processados</p>
                                </div>
                                <div className="text-center p-4 bg-warning/10 rounded-lg">
                                    <p className="text-2xl font-bold text-warning">{batch.pendingJobs}</p>
                                    <p className="text-sm text-base-content/60">Pendentes</p>
                                </div>
                                <div className="text-center p-4 bg-error/10 rounded-lg">
                                    <p className="text-2xl font-bold text-error">{batch.failedJobs}</p>
                                    <p className="text-sm text-base-content/60">Falhos</p>
                                </div>
                            </div>
                        </div>

                        {/* Batch Info */}
                        <div className="bg-base-100 border border-base-300 rounded-2xl p-6 mb-6">
                            <h2 className="text-lg font-semibold mb-4">Informações</h2>

                            <InfoRow label="ID" value={<span className="font-mono">{batch.id}</span>} />
                            <InfoRow label="Nome" value={batch.name} />
                            <InfoRow label="Criado em" value={formatTimestamp(batch.createdAt)} />
                            {batch.finishedAt && (
                                <InfoRow label="Finalizado em" value={formatTimestamp(batch.finishedAt)} />
                            )}
                            {batch.cancelledAt && (
                                <InfoRow label="Cancelado em" value={formatTimestamp(batch.cancelledAt)} />
                            )}
                        </div>

                        {/* Failed Jobs */}
                        {failedJobs.length > 0 && (
                            <div className="bg-base-100 border border-base-300 rounded-2xl overflow-hidden">
                                <div className="p-4 border-b border-base-300">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-error" />
                                        Jobs Falhos ({failedJobs.length})
                                    </h2>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Job</th>
                                                <th>Fila</th>
                                                <th className="text-right">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {failedJobs.map((job) => (
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
                                                    <td className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Link
                                                                href={`${BASE_URL}/jobs/show/${job.id}`}
                                                                className="btn btn-ghost btn-xs"
                                                                title="Ver detalhes"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Link>
                                                            <button
                                                                type="button"
                                                                className="btn btn-ghost btn-xs text-warning"
                                                                onClick={() => handleRetryJob(job.id)}
                                                                title="Reprocessar"
                                                            >
                                                                <RotateCcw className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}

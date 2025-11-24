import { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { getNavigationItems } from '@/config/navigation';
import type { PageProps } from '@/types';
import type { HorizonBatch } from '@/types/horizon';
import {
    RefreshCcw,
    Package,
    ChevronLeft,
    Eye,
    RotateCcw,
    CheckCircle,
    Clock,
    XCircle,
    AlertTriangle,
} from 'lucide-react';
import { BatchProgress } from '@/Components/Horizon/BatchProgress';

interface HorizonBatchesIndexProps extends PageProps {
    batches: HorizonBatch[];
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
    });
}

function BatchStatusBadge({ batch }: { batch: HorizonBatch }) {
    if (batch.cancelledAt) {
        return (
            <span className="badge badge-error gap-1">
                <XCircle className="w-3 h-3" />
                Cancelado
            </span>
        );
    }

    if (batch.finishedAt) {
        if (batch.failedJobs > 0) {
            return (
                <span className="badge badge-warning gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Com Falhas
                </span>
            );
        }

        return (
            <span className="badge badge-success gap-1">
                <CheckCircle className="w-3 h-3" />
                Concluído
            </span>
        );
    }

    return (
        <span className="badge badge-info gap-1">
            <Clock className="w-3 h-3" />
            Em Progresso
        </span>
    );
}

export default function HorizonBatchesIndex({ auth, batches }: HorizonBatchesIndexProps) {
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

    const handleRetry = (batchId: string) => {
        router.post(`${BASE_URL}/batches/${batchId}/retry`, {}, {
            preserveScroll: true,
        });
    };

    const hasBatches = batches.length > 0;

    return (
        <>
            <Head title="Batches" />

            <AuthenticatedLayout navItems={getNavigationItems('/monitoring/horizon', userRoles)}>
                <div className="min-h-screen bg-base-100">
                    <div className="container mx-auto max-w-[1600px] px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
                        {/* Header */}
                        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <Link
                                    href={BASE_URL}
                                    className="btn btn-ghost btn-sm btn-circle"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </Link>
                                <div>
                                    <h1 className="text-2xl font-bold text-base-content sm:text-3xl flex items-center gap-3">
                                        <Package className="w-7 h-7 text-primary" />
                                        Batches
                                    </h1>
                                    <p className="text-sm text-base-content/60 mt-1">
                                        Gerenciamento de jobs em lote
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

                        {/* Batches Table */}
                        <div className="bg-base-100 border border-base-300 rounded-2xl overflow-hidden">
                            {hasBatches ? (
                                <div className="overflow-x-auto">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Nome</th>
                                                <th>Progresso</th>
                                                <th className="text-center">Jobs</th>
                                                <th>Status</th>
                                                <th>Criado em</th>
                                                <th className="text-right">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {batches.map((batch) => (
                                                <tr key={batch.id} className="hover">
                                                    <td>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{batch.name}</span>
                                                            <span className="text-xs text-base-content/50 font-mono">
                                                                {batch.id.slice(0, 8)}...
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="min-w-[150px]">
                                                        <BatchProgress progress={batch.progress} size="sm" />
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="flex flex-col items-center gap-1">
                                                            <span className="text-sm">
                                                                {batch.processedJobs}/{batch.totalJobs}
                                                            </span>
                                                            {batch.failedJobs > 0 && (
                                                                <span className="text-xs text-error">
                                                                    {batch.failedJobs} falho{batch.failedJobs !== 1 ? 's' : ''}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <BatchStatusBadge batch={batch} />
                                                    </td>
                                                    <td className="text-sm text-base-content/70">
                                                        {formatTimestamp(batch.createdAt)}
                                                    </td>
                                                    <td className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Link
                                                                href={`${BASE_URL}/batches/${batch.id}`}
                                                                className="btn btn-ghost btn-xs"
                                                                title="Ver detalhes"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Link>
                                                            {batch.failedJobs > 0 && !batch.cancelledAt && (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-ghost btn-xs text-warning"
                                                                    onClick={() => handleRetry(batch.id)}
                                                                    title="Reprocessar falhos"
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
                            ) : (
                                <div className="text-center py-12 text-base-content/50">
                                    <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg">Nenhum batch encontrado</p>
                                    <p className="text-sm mt-1">Não há jobs em lote registrados</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}

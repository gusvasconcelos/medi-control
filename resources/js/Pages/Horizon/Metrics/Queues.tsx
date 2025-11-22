import { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { getNavigationItems } from '@/config/navigation';
import type { PageProps } from '@/types';
import type { HorizonMetricSnapshot } from '@/types/horizon';
import {
    RefreshCcw,
    ChevronLeft,
    Clock,
    Gauge,
    Layers,
} from 'lucide-react';
import { MetricsChart } from '@/Components/Horizon/MetricsChart';

interface HorizonMetricsQueuesProps extends PageProps {
    queues: string[];
    selectedQueue: string | null;
    snapshots: HorizonMetricSnapshot[];
}

const BASE_URL = '/monitoring/horizon';

export default function HorizonMetricsQueues({
    auth,
    queues,
    selectedQueue,
    snapshots,
}: HorizonMetricsQueuesProps) {
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

    const handleQueueSelect = (queue: string) => {
        router.get(`${BASE_URL}/metrics/queues`, { selected: queue }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const hasQueues = queues.length > 0;

    return (
        <>
            <Head title="Métricas de Filas - Horizon" />

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
                                        <Layers className="w-7 h-7 text-primary" />
                                        Métricas de Filas
                                    </h1>
                                    <p className="text-sm text-base-content/60 mt-1">
                                        Performance e throughput por fila
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link
                                    href={`${BASE_URL}/metrics/jobs`}
                                    className="btn btn-ghost btn-sm"
                                >
                                    Ver Jobs
                                </Link>
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
                        </div>

                        {hasQueues ? (
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                {/* Queues List */}
                                <div className="lg:col-span-1">
                                    <div className="bg-base-100 border border-base-300 rounded-2xl overflow-hidden">
                                        <div className="p-4 border-b border-base-300">
                                            <h2 className="font-semibold">Filas Monitoradas</h2>
                                            <p className="text-xs text-base-content/60 mt-1">
                                                {queues.length} fila{queues.length !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                        <div className="max-h-[500px] overflow-y-auto">
                                            {queues.map((queue) => {
                                                const isSelected = selectedQueue === queue;

                                                return (
                                                    <button
                                                        key={queue}
                                                        type="button"
                                                        className={`w-full text-left px-4 py-3 border-b border-base-300 last:border-0 transition-colors ${
                                                            isSelected
                                                                ? 'bg-primary/10 text-primary'
                                                                : 'hover:bg-base-200'
                                                        }`}
                                                        onClick={() => handleQueueSelect(queue)}
                                                    >
                                                        <span className="font-medium font-mono">{queue}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Charts */}
                                <div className="lg:col-span-3 space-y-6">
                                    {selectedQueue ? (
                                        <>
                                            <div className="bg-base-100 border border-base-300 rounded-2xl p-6">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="p-3 bg-primary/10 rounded-lg">
                                                        <Clock className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold">Runtime</h3>
                                                        <p className="text-xs text-base-content/60">
                                                            Tempo médio de execução em segundos
                                                        </p>
                                                    </div>
                                                </div>
                                                <MetricsChart snapshots={snapshots} type="runtime" height={250} />
                                            </div>

                                            <div className="bg-base-100 border border-base-300 rounded-2xl p-6">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="p-3 bg-secondary/10 rounded-lg">
                                                        <Gauge className="w-5 h-5 text-secondary" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold">Throughput</h3>
                                                        <p className="text-xs text-base-content/60">
                                                            Jobs processados por minuto
                                                        </p>
                                                    </div>
                                                </div>
                                                <MetricsChart snapshots={snapshots} type="throughput" height={250} />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="bg-base-100 border border-base-300 rounded-2xl p-12 text-center">
                                            <Layers className="w-16 h-16 mx-auto mb-4 text-base-content/30" />
                                            <p className="text-lg font-medium text-base-content/60">
                                                Selecione uma fila para visualizar as métricas
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-base-100 border border-base-300 rounded-2xl p-12 text-center">
                                <Layers className="w-16 h-16 mx-auto mb-4 text-base-content/30" />
                                <p className="text-lg font-medium">Nenhuma métrica disponível</p>
                                <p className="text-base-content/60 mt-1">
                                    Execute alguns jobs para começar a coletar métricas
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}

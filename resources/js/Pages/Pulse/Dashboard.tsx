import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { getNavigationItems } from '@/config/navigation';
import type { PageProps } from '@/types';
import {
    RefreshCcw,
    Zap,
} from 'lucide-react';
import { ServersCard } from '@/Components/Pulse/ServersCard';
import { SlowQueriesCard } from '@/Components/Pulse/SlowQueriesCard';
import { SlowRequestsCard } from '@/Components/Pulse/SlowRequestsCard';
import { SlowJobsCard } from '@/Components/Pulse/SlowJobsCard';
import { SlowOutgoingRequestsCard } from '@/Components/Pulse/SlowOutgoingRequestsCard';
import { ExceptionsCard } from '@/Components/Pulse/ExceptionsCard';
import { CacheCard } from '@/Components/Pulse/CacheCard';
import { QueuesCard } from '@/Components/Pulse/QueuesCard';

export interface PulseMetrics {
    servers: Array<{
        name: string;
        cpu: number;
        memory: number;
    }>;
    slow_queries: Array<{
        sql: string;
        duration: number;
        count: number;
        location?: string;
    }>;
    slow_requests: Array<{
        method: string;
        uri: string;
        duration: number;
        count: number;
    }>;
    slow_jobs: Array<{
        job: string;
        duration: number;
        count: number;
    }>;
    slow_outgoing_requests: Array<{
        url: string;
        duration: number;
        count: number;
    }>;
    exceptions: Array<{
        exception: string;
        count: number;
        location?: string;
    }>;
    cache_interactions: {
        hits: number;
        misses: number;
        hit_rate: number;
        keys: Array<{
            key: string;
            count: number;
        }>;
    };
    queues: {
        processed: number;
        failed: number;
        success_rate: number;
    };
    user_requests: Array<{
        user_id: string;
        count: number;
    }>;
    user_jobs: Array<{
        user_id: string;
        count: number;
    }>;
    period: string;
}

interface PulseDashboardProps extends PageProps {
    metrics: PulseMetrics;
}

const periodOptions = [
    { value: '5m', label: '5 minutos' },
    { value: '15m', label: '15 minutos' },
    { value: '30m', label: '30 minutos' },
    { value: '1h', label: '1 hora' },
    { value: '6h', label: '6 horas' },
    { value: '24h', label: '24 horas' },
    { value: '7d', label: '7 dias' },
];

export default function PulseDashboard({ auth, metrics }: PulseDashboardProps) {
    const user = auth?.user;
    const userRoles = user?.roles || [];
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState(metrics.period || '1h');

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            only: ['metrics'],
            onFinish: () => {
                setIsRefreshing(false);
            },
        });
    };

    const handlePeriodChange = (period: string) => {
        setSelectedPeriod(period);
        router.get(
            '/monitoring/pulse',
            { period },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    return (
        <>
            <Head title="Pulse - MediControl" />

            <AuthenticatedLayout navItems={getNavigationItems('/monitoring/pulse', userRoles)}>
                <div className="min-h-screen bg-base-100">
                    <div className="container mx-auto max-w-[1600px] px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
                        {/* Header */}
                        <div className="flex flex-col gap-4 mb-6 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="mb-2 text-2xl font-bold text-base-content sm:text-3xl flex items-center gap-2">
                                    <Zap className="w-7 h-7 text-primary" />
                                    Pulse
                                </h1>
                                <p className="text-sm text-base-content/60">
                                    Monitoramento em tempo real do desempenho da aplicação e recursos do sistema.
                                </p>
                            </div>

                            <div className="flex gap-2 items-center">
                                {/* Period Selector */}
                                <select
                                    className="select select-bordered select-sm sm:select-md"
                                    value={selectedPeriod}
                                    onChange={(e) => handlePeriodChange(e.target.value)}
                                >
                                    {periodOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>

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

                        {/* Servers */}
                        <ServersCard servers={metrics.servers} />

                        {/* Grid de Métricas */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                            {/* Slow Queries */}
                            <SlowQueriesCard queries={metrics.slow_queries} />

                            {/* Slow Requests */}
                            <SlowRequestsCard requests={metrics.slow_requests} />
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                            {/* Slow Jobs */}
                            <SlowJobsCard jobs={metrics.slow_jobs} />

                            {/* Slow Outgoing Requests */}
                            <SlowOutgoingRequestsCard requests={metrics.slow_outgoing_requests} />
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                            {/* Exceptions */}
                            <ExceptionsCard exceptions={metrics.exceptions} />

                            {/* Cache */}
                            <CacheCard cache={metrics.cache_interactions} />
                        </div>

                        {/* Queues */}
                        <QueuesCard queues={metrics.queues} />
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}


import { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { getNavigationItems } from '@/config/navigation';
import type { PageProps } from '@/types';
import type {
    HorizonDashboardStats,
    HorizonWorkloadItem,
    HorizonMasterSupervisor,
} from '@/types/horizon';
import {
    RefreshCcw,
    Gauge,
    Clock,
    AlertTriangle,
    CheckCircle,
    Cpu,
    Layers,
    Package,
    BarChart3,
} from 'lucide-react';
import { StatusBadge } from '@/Components/Horizon/StatusBadge';
import { StatsCard } from '@/Components/Horizon/StatsCard';
import { WorkloadCard } from '@/Components/Horizon/WorkloadCard';
import { SupervisorsCard } from '@/Components/Horizon/SupervisorsCard';

interface HorizonDashboardProps extends PageProps {
    stats: HorizonDashboardStats;
    workload: HorizonWorkloadItem[];
    masters: HorizonMasterSupervisor[];
}

const BASE_URL = '/monitoring/horizon';

export default function HorizonDashboard({ auth, stats, workload, masters }: HorizonDashboardProps) {
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

    const queueWaitTime = Object.entries(stats.wait)[0];
    const waitTimeDisplay = queueWaitTime
        ? `${queueWaitTime[1]}s (${queueWaitTime[0]})`
        : '0s';

    return (
        <>
            <Head title="Horizon - MediControl" />

            <AuthenticatedLayout navItems={getNavigationItems('/monitoring/horizon', userRoles)}>
                <div className="min-h-screen bg-base-100">
                    <div className="container mx-auto max-w-[1600px] px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
                        {/* Header */}
                        <div className="flex flex-col gap-4 mb-6 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <div>
                                    <h1 className="mb-2 text-2xl font-bold text-base-content sm:text-3xl flex items-center gap-3">
                                        <Gauge className="w-7 h-7 text-primary" />
                                        Horizon
                                    </h1>
                                    <p className="text-sm text-base-content/60">
                                        Monitoramento de filas e jobs em tempo real.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <StatusBadge status={stats.status} size="lg" />
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

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <StatsCard
                                title="Jobs por Minuto"
                                value={stats.jobsPerMinute.toLocaleString()}
                                icon={<Gauge className="w-5 h-5 text-primary" />}
                                iconBgClass="bg-primary/10"
                            />
                            <StatsCard
                                title="Jobs Recentes"
                                value={stats.recentJobs.toLocaleString()}
                                subtitle={`Últimos ${stats.periods.recentJobs} minutos`}
                                icon={<CheckCircle className="w-5 h-5 text-success" />}
                                iconBgClass="bg-success/10"
                            />
                            <StatsCard
                                title="Jobs Falhos"
                                value={stats.failedJobs.toLocaleString()}
                                subtitle={`Últimos ${stats.periods.failedJobs} minutos`}
                                icon={<AlertTriangle className="w-5 h-5 text-error" />}
                                iconBgClass="bg-error/10"
                            />
                            <StatsCard
                                title="Tempo de Espera"
                                value={waitTimeDisplay}
                                icon={<Clock className="w-5 h-5 text-warning" />}
                                iconBgClass="bg-warning/10"
                            />
                        </div>

                        {/* Secondary Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            <StatsCard
                                title="Processos Ativos"
                                value={stats.processes}
                                icon={<Cpu className="w-5 h-5 text-info" />}
                                iconBgClass="bg-info/10"
                            />
                            <StatsCard
                                title="Fila Mais Rápida"
                                value={stats.queueWithMaxThroughput || '-'}
                                subtitle="Maior throughput"
                                icon={<Layers className="w-5 h-5 text-secondary" />}
                                iconBgClass="bg-secondary/10"
                            />
                            <StatsCard
                                title="Fila Mais Lenta"
                                value={stats.queueWithMaxRuntime || '-'}
                                subtitle="Maior runtime"
                                icon={<Clock className="w-5 h-5 text-accent" />}
                                iconBgClass="bg-accent/10"
                            />
                        </div>

                        {/* Quick Links */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                            <Link
                                href={`${BASE_URL}/jobs/pending`}
                                className="btn btn-outline btn-sm h-auto py-3 flex-col gap-1"
                            >
                                <Clock className="w-5 h-5" />
                                <span>Pendentes</span>
                            </Link>
                            <Link
                                href={`${BASE_URL}/jobs/failed`}
                                className="btn btn-outline btn-error btn-sm h-auto py-3 flex-col gap-1"
                            >
                                <AlertTriangle className="w-5 h-5" />
                                <span>Falhos</span>
                            </Link>
                            <Link
                                href={`${BASE_URL}/batches`}
                                className="btn btn-outline btn-sm h-auto py-3 flex-col gap-1"
                            >
                                <Package className="w-5 h-5" />
                                <span>Batches</span>
                            </Link>
                            <Link
                                href={`${BASE_URL}/metrics/jobs`}
                                className="btn btn-outline btn-sm h-auto py-3 flex-col gap-1"
                            >
                                <BarChart3 className="w-5 h-5" />
                                <span>Métricas</span>
                            </Link>
                        </div>

                        {/* Workload & Supervisors */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <WorkloadCard workload={workload} />
                            <SupervisorsCard masters={masters} />
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}

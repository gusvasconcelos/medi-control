import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { getNavigationItems } from '@/config/navigation';
import type { PageProps, MetricsOverviewData, TopMedication } from '@/types';
import {
    Activity,
    Cpu,
    HardDrive,
    Database,
    RefreshCcw,
    Pill,
    Users,
    CheckCircle,
    TrendingUp
} from 'lucide-react';

interface MetricsOverviewProps extends PageProps {
    metrics: MetricsOverviewData;
}

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    iconColor: string;
    description?: string;
}

const StatCard: React.FC<StatCardProps> = ({
    label,
    value,
    icon,
    iconColor,
    description
}) => {
    return (
        <div className="bg-base-100 border border-base-300 rounded-2xl p-5 sm:p-6 hover:border-base-content/20 transition-all">
            <div className="flex items-center justify-between mb-3">
                <div className={`p-3 ${iconColor} rounded-lg`}>
                    {icon}
                </div>
            </div>
            <div>
                <h3 className="text-sm font-medium text-base-content/70 mb-1">
                    {label}
                </h3>
                <p className="text-3xl sm:text-4xl font-bold text-base-content mb-1">
                    {value}
                </p>
                {description && (
                    <p className="text-xs text-base-content/50">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
};

interface PerformanceBarProps {
    label: string;
    value: number;
    max?: number;
}

const PerformanceBar: React.FC<PerformanceBarProps> = ({ label, value, max = 100 }) => {
    const percentage = Math.min((value / max) * 100, 100);

    const getColorClass = () => {
        if (percentage >= 80) return 'bg-error';
        if (percentage >= 60) return 'bg-warning';
        return 'bg-primary';
    };

    return (
        <div className="mb-4 last:mb-0">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-base-content">{label}</span>
                <span className="text-sm font-bold text-base-content">{percentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-base-300 rounded-full h-3">
                <div
                    className={`${getColorClass()} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default function MetricsOverview({ auth, metrics }: MetricsOverviewProps) {
    const user = auth?.user;
    const userRoles = user?.roles || [];
    const [isRefreshing, setIsRefreshing] = useState(false);

    const cpuUsage = metrics.cpu.percentage;
    const memoryUsage = metrics.memory.percentage;
    const diskUsage = (1 - metrics.disk) * 100;

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            only: ['metrics'],
            onFinish: () => {
                setIsRefreshing(false);
            },
        });
    };

    return (
        <>
            <Head title="Métricas" />

            <AuthenticatedLayout navItems={getNavigationItems('/kpis/metrics', userRoles)}>
                <div className="min-h-screen bg-base-100">
                    <div className="container mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
                        {/* Header */}
                        <div className="flex gap-2 justify-between items-center mb-6 sm:mb-8">
                            <div>
                                <h1 className="mb-2 text-2xl font-bold text-base-content sm:text-3xl">
                                    Métricas
                                </h1>
                                <p className="text-xs sm:text-sm text-base-content/60">
                                    Monitoramento em tempo real dos indicadores e recursos do sistema.
                                </p>
                            </div>
                            <button
                                className="btn btn-primary"
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                            >
                                <RefreshCcw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                                {isRefreshing ? 'Atualizando...' : 'Atualizar'}
                            </button>
                        </div>

                        {/* KPIs Principais */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                            <StatCard
                                label="Total de Medicamentos"
                                value={metrics.total_medications}
                                icon={<Pill className="w-6 h-6 text-primary" />}
                                iconColor="bg-primary/10"
                                description="Medicamentos cadastrados no sistema"
                            />
                            <StatCard
                                label="Total de Usuários"
                                value={metrics.total_users}
                                icon={<Users className="w-6 h-6 text-success" />}
                                iconColor="bg-success/10"
                                description="Usuários registrados"
                            />
                            <StatCard
                                label="Tratamentos Ativos"
                                value={metrics.total_active_medications}
                                icon={<CheckCircle className="w-6 h-6 text-info" />}
                                iconColor="bg-info/10"
                                description="Medicamentos em uso ativo"
                            />
                        </div>

                        {/* Performance do Sistema */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            {/* Recursos do Sistema */}
                            <div className="bg-base-100 border border-base-300 rounded-2xl p-6 hover:border-base-content/20 transition-all">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-base-content mb-1">
                                        Recursos do Sistema
                                    </h2>
                                    <p className="text-sm text-base-content/60">
                                        Utilização de recursos em tempo real
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <PerformanceBar label="CPU" value={cpuUsage} />
                                    <PerformanceBar label="Memória" value={memoryUsage} />
                                    <PerformanceBar label="Disco" value={diskUsage} />
                                </div>
                            </div>

                            {/* Informações Detalhadas */}
                            <div className="bg-base-100 border border-base-300 rounded-2xl p-6 hover:border-base-content/20 transition-all">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-base-content mb-1">
                                        Informações do Sistema
                                    </h2>
                                    <p className="text-sm text-base-content/60">
                                        Detalhes e estatísticas gerais
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Activity className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-base-content/60">Tempo de Atividade</p>
                                            <p className="text-sm font-semibold text-base-content">
                                                {metrics.uptime.uptime_human}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                                        <div className="p-2 bg-success/10 rounded-lg">
                                            <Cpu className="w-5 h-5 text-success" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-base-content/60">CPU ({metrics.cpu.cores} cores)</p>
                                            <p className="text-sm font-semibold text-base-content">
                                                {metrics.cpu.percentage}% (load avg: {metrics.cpu.load_average})
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                                        <div className="p-2 bg-warning/10 rounded-lg">
                                            <Database className="w-5 h-5 text-warning" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-base-content/60">Memória RAM</p>
                                            <p className="text-sm font-semibold text-base-content">
                                                {metrics.memory.used_mb} MB / {metrics.memory.total_mb} MB ({metrics.memory.percentage}%)
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                                        <div className="p-2 bg-info/10 rounded-lg">
                                            <HardDrive className="w-5 h-5 text-info" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-base-content/60">Espaço em Disco Livre</p>
                                            <p className="text-sm font-semibold text-base-content">
                                                {(metrics.disk * 100).toFixed(1)}%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top 5 Medicamentos Mais Utilizados */}
                        <div className="bg-base-100 border border-base-300 rounded-2xl p-6 hover:border-base-content/20 transition-all">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-base-content mb-1">
                                    Top 5 Medicamentos Mais Utilizados
                                </h2>
                                <p className="text-sm text-base-content/60">
                                    Medicamentos com maior número de doses tomadas
                                </p>
                            </div>

                            {metrics.top_medications.length > 0 ? (
                                <div className="space-y-3">
                                    {metrics.top_medications.map((med: TopMedication, index: number) => {
                                        const maxCount = metrics.top_medications[0]?.usage_count || 1;
                                        const percentage = (med.usage_count / maxCount) * 100;

                                        return (
                                            <div key={med.id} className="relative">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                                                            {index + 1}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-semibold text-base-content">
                                                                {med.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <TrendingUp className="w-4 h-4 text-success" />
                                                        <span className="text-sm font-bold text-base-content">
                                                            {med.usage_count} doses
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="w-full bg-base-300 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Pill className="w-12 h-12 mx-auto text-base-content/20 mb-3" />
                                    <p className="text-sm text-base-content/60">
                                        Nenhum dado disponível ainda
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

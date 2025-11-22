import { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { getNavigationItems } from '@/config/navigation';
import type { PageProps } from '@/types';
import type { HorizonJob } from '@/types/horizon';
import {
    RefreshCcw,
    Clock,
    CheckCircle,
    AlertTriangle,
    VolumeX,
    ChevronLeft,
} from 'lucide-react';
import { JobsTable } from '@/Components/Horizon/JobsTable';

interface HorizonJobsIndexProps extends PageProps {
    jobs: HorizonJob[];
    total: number;
    status: string;
    startingAt: number;
    tag?: string;
}

const BASE_URL = '/monitoring/horizon';

const statusTabs = [
    { key: 'pending', label: 'Pendentes', icon: Clock },
    { key: 'completed', label: 'Concluídos', icon: CheckCircle },
    { key: 'failed', label: 'Falhos', icon: AlertTriangle },
    { key: 'silenced', label: 'Silenciados', icon: VolumeX },
];

export default function HorizonJobsIndex({
    auth,
    jobs,
    total,
    status,
    startingAt,
}: HorizonJobsIndexProps) {
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

    const handleTabChange = (newStatus: string) => {
        router.get(`${BASE_URL}/jobs/${newStatus}`, {}, {
            preserveState: false,
        });
    };

    const currentTab = statusTabs.find((tab) => tab.key === status) || statusTabs[0];

    return (
        <>
            <Head title={`Jobs ${currentTab.label} - Horizon`} />

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
                                        <currentTab.icon className="w-7 h-7 text-primary" />
                                        Jobs {currentTab.label}
                                    </h1>
                                    <p className="text-sm text-base-content/60 mt-1">
                                        {total.toLocaleString()} job{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
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

                        {/* Status Tabs */}
                        <div className="overflow-x-auto mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
                            <div className="tabs tabs-boxed bg-base-200 p-1 inline-flex min-w-full sm:min-w-0">
                                {statusTabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        className={`tab flex-1 sm:flex-none gap-1 sm:gap-2 min-w-[70px] sm:min-w-0 ${status === tab.key ? 'tab-active' : ''}`}
                                        onClick={() => handleTabChange(tab.key)}
                                    >
                                        <tab.icon className="w-4 h-4" />
                                        <span className="text-xs sm:text-sm">{tab.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Jobs Table */}
                        <JobsTable
                            jobs={jobs}
                            total={total}
                            status={status}
                            startingAt={startingAt}
                            showRetry={status === 'failed'}
                            baseUrl={BASE_URL}
                        />
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}

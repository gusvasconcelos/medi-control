import { Briefcase, Clock } from 'lucide-react';

interface SlowJob {
    job: string;
    duration: number;
    count: number;
}

interface SlowJobsCardProps {
    jobs: SlowJob[];
}

export function SlowJobsCard({ jobs }: SlowJobsCardProps) {
    const formatDuration = (ms: number) => {
        if (ms < 1000) return `${ms.toFixed(0)}ms`;
        return `${(ms / 1000).toFixed(2)}s`;
    };

    const extractJobName = (job: string) => {
        const parts = job.split('\\');
        return parts[parts.length - 1] || job;
    };

    return (
        <div className="bg-base-100 border border-base-300 rounded-2xl p-4 sm:p-6 hover:border-base-content/20 transition-all">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-secondary/10 rounded-lg">
                    <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
                </div>
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-base-content">Jobs Lentos</h2>
                    <p className="text-xs sm:text-sm text-base-content/60">
                        Jobs com maior tempo de execução
                    </p>
                </div>
            </div>

            {jobs.length > 0 ? (
                <div className="space-y-3">
                    {jobs.map((job, index) => (
                        <div
                            key={index}
                            className="bg-base-200 rounded-lg p-3 sm:p-4 border border-base-300 hover:border-secondary/50 transition-colors"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-2">
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs sm:text-sm font-semibold text-base-content mb-1 break-words">
                                        {extractJobName(job.job)}
                                    </div>
                                    <code className="text-xs text-base-content/60 font-mono block break-all">
                                        {job.job}
                                    </code>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Clock className="w-4 h-4 text-secondary" />
                                    <span className="text-xs sm:text-sm font-bold text-secondary whitespace-nowrap">
                                        {formatDuration(job.duration)}
                                    </span>
                                </div>
                            </div>
                            <div className="text-xs text-base-content/60 text-right">
                                Executado {job.count}x
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 sm:py-12 bg-base-200 rounded-lg">
                    <Briefcase className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-base-content/20 mb-3" />
                    <p className="text-xs sm:text-sm text-base-content/60">
                        Nenhum job lento registrado
                    </p>
                </div>
            )}
        </div>
    );
}


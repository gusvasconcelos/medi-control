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
        <div className="bg-base-100 border border-base-300 rounded-2xl p-6 hover:border-base-content/20 transition-all">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-secondary/10 rounded-lg">
                    <Briefcase className="w-6 h-6 text-secondary" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-base-content">Jobs Lentos</h2>
                    <p className="text-sm text-base-content/60">
                        Jobs com maior tempo de execução
                    </p>
                </div>
            </div>

            {jobs.length > 0 ? (
                <div className="space-y-3">
                    {jobs.map((job, index) => (
                        <div 
                            key={index} 
                            className="bg-base-200 rounded-lg p-4 border border-base-300 hover:border-secondary/50 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-base-content mb-1">
                                        {extractJobName(job.job)}
                                    </div>
                                    <code className="text-xs text-base-content/60 font-mono block truncate">
                                        {job.job}
                                    </code>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Clock className="w-4 h-4 text-secondary" />
                                    <span className="text-sm font-bold text-secondary">
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
                <div className="text-center py-12 bg-base-200 rounded-lg">
                    <Briefcase className="w-12 h-12 mx-auto text-base-content/20 mb-3" />
                    <p className="text-sm text-base-content/60">
                        Nenhum job lento registrado
                    </p>
                </div>
            )}
        </div>
    );
}


import { ListChecks, CheckCircle2, XCircle } from 'lucide-react';

interface Queues {
    processed: number;
    failed: number;
    success_rate: number;
}

interface QueuesCardProps {
    queues: Queues;
}

export function QueuesCard({ queues }: QueuesCardProps) {
    const getSuccessRateColor = (rate: number) => {
        if (rate >= 95) return 'text-success';
        if (rate >= 80) return 'text-warning';
        return 'text-error';
    };

    const getSuccessRateBarColor = (rate: number) => {
        if (rate >= 95) return 'bg-success';
        if (rate >= 80) return 'bg-warning';
        return 'bg-error';
    };

    return (
        <div className="bg-base-100 border border-base-300 rounded-2xl p-6 hover:border-base-content/20 transition-all">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-success/10 rounded-lg">
                    <ListChecks className="w-6 h-6 text-success" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-base-content">Filas</h2>
                    <p className="text-sm text-base-content/60">
                        Status de processamento das filas
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-base-200 rounded-lg p-4 border border-base-300">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <span className="text-xs font-medium text-base-content/70">Processados</span>
                    </div>
                    <div className="text-2xl font-bold text-success">
                        {queues.processed.toLocaleString()}
                    </div>
                </div>

                <div className="bg-base-200 rounded-lg p-4 border border-base-300">
                    <div className="flex items-center gap-2 mb-2">
                        <XCircle className="w-4 h-4 text-error" />
                        <span className="text-xs font-medium text-base-content/70">Falhas</span>
                    </div>
                    <div className="text-2xl font-bold text-error">
                        {queues.failed.toLocaleString()}
                    </div>
                </div>

                <div className="bg-base-200 rounded-lg p-4 border border-base-300">
                    <div className="flex items-center gap-2 mb-2">
                        <ListChecks className="w-4 h-4 text-base-content/60" />
                        <span className="text-xs font-medium text-base-content/70">Taxa de Sucesso</span>
                    </div>
                    <div className={`text-2xl font-bold ${getSuccessRateColor(queues.success_rate)}`}>
                        {queues.success_rate.toFixed(1)}%
                    </div>
                </div>
            </div>

            {/* Success Rate Bar */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-base-content">
                        Performance das Filas
                    </span>
                    <span className={`text-sm font-bold ${getSuccessRateColor(queues.success_rate)}`}>
                        {queues.success_rate.toFixed(1)}%
                    </span>
                </div>
                <div className="w-full bg-base-300 rounded-full h-3">
                    <div
                        className={`${getSuccessRateBarColor(queues.success_rate)} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${queues.success_rate}%` }}
                    />
                </div>
            </div>

            {/* Total */}
            <div className="mt-4 text-center">
                <span className="text-sm text-base-content/60">
                    Total de jobs: {' '}
                    <span className="font-semibold text-base-content">
                        {(queues.processed + queues.failed).toLocaleString()}
                    </span>
                </span>
            </div>
        </div>
    );
}


import { useMemo } from 'react';
import type { HorizonMetricSnapshot } from '@/types/horizon';

interface MetricsChartProps {
    snapshots: HorizonMetricSnapshot[];
    type: 'runtime' | 'throughput';
    height?: number;
}

function formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function MetricsChart({ snapshots, type, height = 200 }: MetricsChartProps) {
    const data = useMemo(() => {
        if (snapshots.length === 0) return { values: [], max: 0, labels: [] };

        const values = snapshots.map((s) => type === 'runtime' ? s.runtime : s.throughput);
        const max = Math.max(...values, 1);
        const labels = snapshots.map((s) => formatTime(s.time));

        return { values, max, labels };
    }, [snapshots, type]);

    if (snapshots.length === 0) {
        return (
            <div
                className="flex items-center justify-center bg-base-200 rounded-lg text-base-content/50"
                style={{ height }}
            >
                <p>Nenhum dado disponível</p>
            </div>
        );
    }

    const barWidth = Math.max(4, Math.floor(100 / data.values.length) - 1);

    return (
        <div className="bg-base-200 rounded-lg p-4">
            <div className="flex items-end justify-between gap-1" style={{ height }}>
                {data.values.map((value, index) => {
                    const heightPercent = (value / data.max) * 100;
                    const isLast = index === data.values.length - 1;

                    return (
                        <div
                            key={index}
                            className="group relative flex flex-col items-center"
                            style={{ width: `${barWidth}%` }}
                        >
                            <div
                                className={`w-full rounded-t transition-all ${
                                    isLast ? 'bg-primary' : 'bg-primary/60'
                                } hover:bg-primary`}
                                style={{
                                    height: `${Math.max(heightPercent, 2)}%`,
                                    minHeight: '4px',
                                }}
                            />

                            <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                                <div className="bg-base-300 text-base-content text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg">
                                    <div className="font-medium">
                                        {type === 'runtime'
                                            ? `${value.toFixed(3)}s`
                                            : `${value} jobs/min`}
                                    </div>
                                    <div className="text-base-content/60">{data.labels[index]}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-between mt-2 text-xs text-base-content/50">
                <span>{data.labels[0]}</span>
                <span>{data.labels[data.labels.length - 1]}</span>
            </div>

            <div className="flex justify-between mt-1 text-xs text-base-content/50">
                <span>Min: {type === 'runtime' ? `${Math.min(...data.values).toFixed(3)}s` : Math.min(...data.values)}</span>
                <span>Max: {type === 'runtime' ? `${data.max.toFixed(3)}s` : data.max}</span>
            </div>
        </div>
    );
}

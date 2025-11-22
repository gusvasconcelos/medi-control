import { Layers } from 'lucide-react';
import type { HorizonWorkloadItem } from '@/types/horizon';

interface WorkloadCardProps {
    workload: HorizonWorkloadItem[];
}

function formatWaitTime(seconds: number): string {
    if (seconds < 60) {
        return `${seconds}s`;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes < 60) {
        return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

export function WorkloadCard({ workload }: WorkloadCardProps) {
    const hasWorkload = workload.length > 0;

    return (
        <div className="bg-base-100 border border-base-300 rounded-2xl p-6 hover:border-base-content/20 transition-all">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                    <Layers className="w-5 h-5 text-secondary" />
                </div>
                <div>
                    <h3 className="font-semibold text-base-content">Workload</h3>
                    <p className="text-xs text-base-content/60">Carga de trabalho por fila</p>
                </div>
            </div>

            {hasWorkload ? (
                <div className="overflow-x-auto">
                    <table className="table table-sm">
                        <thead>
                            <tr>
                                <th>Fila</th>
                                <th className="text-right">Pendentes</th>
                                <th className="text-right">Tempo de Espera</th>
                                <th className="text-right">Processos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workload.map((item) => (
                                <tr key={item.name} className="hover">
                                    <td>
                                        <span className="font-mono text-sm">{item.name}</span>
                                    </td>
                                    <td className="text-right">
                                        <span className={item.length > 0 ? 'text-warning font-medium' : ''}>
                                            {item.length.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <span className={item.wait > 60 ? 'text-error font-medium' : ''}>
                                            {formatWaitTime(item.wait)}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <span className="badge badge-ghost badge-sm">
                                            {item.processes}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-8 text-base-content/50">
                    <Layers className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhuma fila ativa no momento</p>
                </div>
            )}
        </div>
    );
}

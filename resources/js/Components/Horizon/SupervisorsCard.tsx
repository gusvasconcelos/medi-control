import { Server, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { HorizonMasterSupervisor, SupervisorStatus } from '@/types/horizon';

interface SupervisorsCardProps {
    masters: HorizonMasterSupervisor[];
}

function SupervisorStatusBadge({ status }: { status: SupervisorStatus }) {
    const config = {
        running: { label: 'Ativo', className: 'badge-success' },
        paused: { label: 'Pausado', className: 'badge-warning' },
        inactive: { label: 'Inativo', className: 'badge-ghost' },
    };

    const { label, className } = config[status];

    return (
        <span className={`badge ${className} badge-sm`}>
            {label}
        </span>
    );
}

function MasterSupervisorItem({ master }: { master: HorizonMasterSupervisor }) {
    const [isExpanded, setIsExpanded] = useState(true);

    const totalProcesses = master.supervisors.reduce(
        (sum, sup) => sum + Object.values(sup.processes).reduce((a, b) => a + b, 0),
        0
    );

    return (
        <div className="border border-base-300 rounded-lg overflow-hidden">
            <button
                type="button"
                className="w-full flex items-center justify-between p-4 hover:bg-base-200 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-base-content/50" />
                    ) : (
                        <ChevronRight className="w-4 h-4 text-base-content/50" />
                    )}
                    <Server className="w-5 h-5 text-primary" />
                    <span className="font-medium font-mono">{master.name}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-base-content/60">
                        {totalProcesses} processo{totalProcesses !== 1 ? 's' : ''}
                    </span>
                    <SupervisorStatusBadge status={master.status} />
                </div>
            </button>

            {isExpanded && master.supervisors.length > 0 && (
                <div className="border-t border-base-300 bg-base-200/50">
                    <div className="divide-y divide-base-300">
                        {master.supervisors.map((supervisor) => {
                            const processCount = Object.values(supervisor.processes).reduce((a, b) => a + b, 0);

                            return (
                                <div
                                    key={supervisor.name}
                                    className="flex items-center justify-between px-4 py-3 pl-12"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-mono text-sm">{supervisor.name}</span>
                                        <span className="text-xs text-base-content/50">
                                            Fila: {supervisor.options.queue || 'default'}
                                            {supervisor.options.balance && ` • Balance: ${supervisor.options.balance}`}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-base-content/60">
                                            {processCount} processo{processCount !== 1 ? 's' : ''}
                                        </span>
                                        <SupervisorStatusBadge status={supervisor.status} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export function SupervisorsCard({ masters }: SupervisorsCardProps) {
    const hasMasters = masters.length > 0;

    return (
        <div className="bg-base-100 border border-base-300 rounded-2xl p-6 hover:border-base-content/20 transition-all">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                    <Server className="w-5 h-5 text-accent" />
                </div>
                <div>
                    <h3 className="font-semibold text-base-content">Supervisores</h3>
                    <p className="text-xs text-base-content/60">Master supervisors e workers</p>
                </div>
            </div>

            {hasMasters ? (
                <div className="space-y-3">
                    {masters.map((master) => (
                        <MasterSupervisorItem key={master.name} master={master} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-base-content/50">
                    <Server className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum supervisor ativo</p>
                    <p className="text-sm mt-1">Execute `php artisan horizon` para iniciar</p>
                </div>
            )}
        </div>
    );
}

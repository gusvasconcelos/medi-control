import { Server, Cpu, HardDrive } from 'lucide-react';

interface Server {
    name: string;
    cpu: number;
    memory: number;
}

interface ServersCardProps {
    servers: Server[];
}

export function ServersCard({ servers }: ServersCardProps) {
    const getUsageColor = (value: number) => {
        if (value >= 80) return 'text-error';
        if (value >= 60) return 'text-warning';
        return 'text-success';
    };

    const getBarColor = (value: number) => {
        if (value >= 80) return 'bg-error';
        if (value >= 60) return 'bg-warning';
        return 'bg-primary';
    };

    return (
        <div className="bg-base-100 border border-base-300 rounded-2xl p-6 hover:border-base-content/20 transition-all mb-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                    <Server className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-base-content">Servidores</h2>
                    <p className="text-sm text-base-content/60">
                        Uso de recursos em tempo real
                    </p>
                </div>
            </div>

            {servers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {servers.map((server, index) => (
                        <div key={index} className="bg-base-200 rounded-xl p-4 border border-base-300">
                            <div className="flex items-center gap-2 mb-4">
                                <Server className="w-4 h-4 text-base-content/60" />
                                <span className="text-sm font-semibold text-base-content truncate">
                                    {server.name}
                                </span>
                            </div>

                            {/* CPU */}
                            <div className="mb-3">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Cpu className="w-4 h-4 text-base-content/60" />
                                        <span className="text-xs font-medium text-base-content/70">CPU</span>
                                    </div>
                                    <span className={`text-sm font-bold ${getUsageColor(server.cpu)}`}>
                                        {server.cpu.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="w-full bg-base-300 rounded-full h-2">
                                    <div
                                        className={`${getBarColor(server.cpu)} h-2 rounded-full transition-all duration-500`}
                                        style={{ width: `${Math.min(server.cpu, 100)}%` }}
                                    />
                                </div>
                            </div>

                            {/* Memory */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <HardDrive className="w-4 h-4 text-base-content/60" />
                                        <span className="text-xs font-medium text-base-content/70">Memória</span>
                                    </div>
                                    <span className={`text-sm font-bold ${getUsageColor(server.memory)}`}>
                                        {server.memory.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="w-full bg-base-300 rounded-full h-2">
                                    <div
                                        className={`${getBarColor(server.memory)} h-2 rounded-full transition-all duration-500`}
                                        style={{ width: `${Math.min(server.memory, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-base-200 rounded-lg">
                    <Server className="w-12 h-12 mx-auto text-base-content/20 mb-3" />
                    <p className="text-sm text-base-content/60">
                        Nenhum dado de servidor disponível
                    </p>
                </div>
            )}
        </div>
    );
}


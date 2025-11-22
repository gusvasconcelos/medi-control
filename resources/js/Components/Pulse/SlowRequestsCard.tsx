import { Globe, Clock } from 'lucide-react';

interface SlowRequest {
    method: string;
    uri: string;
    duration: number;
    count: number;
}

interface SlowRequestsCardProps {
    requests: SlowRequest[];
}

export function SlowRequestsCard({ requests }: SlowRequestsCardProps) {
    const formatDuration = (ms: number) => {
        if (ms < 1000) return `${ms.toFixed(0)}ms`;
        return `${(ms / 1000).toFixed(2)}s`;
    };

    const getMethodColor = (method: string) => {
        switch (method.toUpperCase()) {
            case 'GET': return 'badge-info';
            case 'POST': return 'badge-success';
            case 'PUT': return 'badge-warning';
            case 'PATCH': return 'badge-warning';
            case 'DELETE': return 'badge-error';
            default: return 'badge-ghost';
        }
    };

    return (
        <div className="bg-base-100 border border-base-300 rounded-2xl p-6 hover:border-base-content/20 transition-all">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-info/10 rounded-lg">
                    <Globe className="w-6 h-6 text-info" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-base-content">Requisições Lentas</h2>
                    <p className="text-sm text-base-content/60">
                        Endpoints com maior tempo de resposta
                    </p>
                </div>
            </div>

            {requests.length > 0 ? (
                <div className="space-y-3">
                    {requests.map((request, index) => (
                        <div 
                            key={index} 
                            className="bg-base-200 rounded-lg p-4 border border-base-300 hover:border-info/50 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="flex items-start gap-2 flex-1 min-w-0">
                                    <span className={`badge ${getMethodColor(request.method)} badge-sm mt-0.5`}>
                                        {request.method}
                                    </span>
                                    <code className="text-xs text-base-content break-all font-mono">
                                        {request.uri}
                                    </code>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Clock className="w-4 h-4 text-info" />
                                    <span className="text-sm font-bold text-info">
                                        {formatDuration(request.duration)}
                                    </span>
                                </div>
                            </div>
                            <div className="text-xs text-base-content/60 text-right">
                                {request.count} requisições
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-base-200 rounded-lg">
                    <Globe className="w-12 h-12 mx-auto text-base-content/20 mb-3" />
                    <p className="text-sm text-base-content/60">
                        Nenhuma requisição lenta registrada
                    </p>
                </div>
            )}
        </div>
    );
}


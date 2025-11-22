import { Globe, Clock, ExternalLink } from 'lucide-react';

interface SlowOutgoingRequest {
    url: string;
    duration: number;
    count: number;
}

interface SlowOutgoingRequestsCardProps {
    requests: SlowOutgoingRequest[];
}

export function SlowOutgoingRequestsCard({ requests }: SlowOutgoingRequestsCardProps) {
    const formatDuration = (ms: number) => {
        if (ms < 1000) return `${ms.toFixed(0)}ms`;
        return `${(ms / 1000).toFixed(2)}s`;
    };

    const getDomain = (url: string) => {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch {
            return url;
        }
    };

    return (
        <div className="bg-base-100 border border-base-300 rounded-2xl p-6 hover:border-base-content/20 transition-all">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-accent/10 rounded-lg">
                    <ExternalLink className="w-6 h-6 text-accent" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-base-content">Requisições Externas Lentas</h2>
                    <p className="text-sm text-base-content/60">
                        Chamadas HTTP externas lentas
                    </p>
                </div>
            </div>

            {requests.length > 0 ? (
                <div className="space-y-3">
                    {requests.map((request, index) => (
                        <div 
                            key={index} 
                            className="bg-base-200 rounded-lg p-4 border border-base-300 hover:border-accent/50 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Globe className="w-4 h-4 text-base-content/60" />
                                        <span className="text-sm font-semibold text-base-content">
                                            {getDomain(request.url)}
                                        </span>
                                    </div>
                                    <code className="text-xs text-base-content/60 break-all font-mono block">
                                        {request.url}
                                    </code>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Clock className="w-4 h-4 text-accent" />
                                    <span className="text-sm font-bold text-accent">
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
                    <ExternalLink className="w-12 h-12 mx-auto text-base-content/20 mb-3" />
                    <p className="text-sm text-base-content/60">
                        Nenhuma requisição externa lenta registrada
                    </p>
                </div>
            )}
        </div>
    );
}


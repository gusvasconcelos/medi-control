import { Database, Clock } from 'lucide-react';

interface SlowQuery {
    sql: string;
    duration: number;
    count: number;
    location?: string;
}

interface SlowQueriesCardProps {
    queries: SlowQuery[];
}

export function SlowQueriesCard({ queries }: SlowQueriesCardProps) {
    const formatDuration = (ms: number) => {
        if (ms < 1000) return `${ms.toFixed(0)}ms`;
        return `${(ms / 1000).toFixed(2)}s`;
    };

    const truncateSql = (sql: string, maxLength: number = 80) => {
        if (sql.length <= maxLength) return sql;
        return sql.substring(0, maxLength) + '...';
    };

    return (
        <div className="bg-base-100 border border-base-300 rounded-2xl p-6 hover:border-base-content/20 transition-all">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-warning/10 rounded-lg">
                    <Database className="w-6 h-6 text-warning" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-base-content">Consultas Lentas</h2>
                    <p className="text-sm text-base-content/60">
                        Queries com maior tempo de execução
                    </p>
                </div>
            </div>

            {queries.length > 0 ? (
                <div className="space-y-3">
                    {queries.map((query, index) => (
                        <div 
                            key={index} 
                            className="bg-base-200 rounded-lg p-4 border border-base-300 hover:border-warning/50 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="flex-1 min-w-0">
                                    <code className="text-xs text-base-content break-all font-mono block">
                                        {truncateSql(query.sql)}
                                    </code>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Clock className="w-4 h-4 text-warning" />
                                    <span className="text-sm font-bold text-warning">
                                        {formatDuration(query.duration)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-base-content/60">
                                {query.location && (
                                    <span className="font-mono">{query.location}</span>
                                )}
                                <span className="ml-auto">
                                    Executado {query.count}x
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-base-200 rounded-lg">
                    <Database className="w-12 h-12 mx-auto text-base-content/20 mb-3" />
                    <p className="text-sm text-base-content/60">
                        Nenhuma consulta lenta registrada
                    </p>
                </div>
            )}
        </div>
    );
}


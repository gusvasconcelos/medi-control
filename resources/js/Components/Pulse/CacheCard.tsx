import { HardDrive, TrendingUp, TrendingDown } from 'lucide-react';

interface CacheInteractions {
    hits: number;
    misses: number;
    hit_rate: number;
    keys: Array<{
        key: string;
        count: number;
    }>;
}

interface CacheCardProps {
    cache: CacheInteractions;
}

export function CacheCard({ cache }: CacheCardProps) {
    const getHitRateColor = (rate: number) => {
        if (rate >= 80) return 'text-success';
        if (rate >= 60) return 'text-warning';
        return 'text-error';
    };

    const getHitRateBarColor = (rate: number) => {
        if (rate >= 80) return 'bg-success';
        if (rate >= 60) return 'bg-warning';
        return 'bg-error';
    };

    return (
        <div className="bg-base-100 border border-base-300 rounded-2xl p-6 hover:border-base-content/20 transition-all">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                    <HardDrive className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-base-content">Cache</h2>
                    <p className="text-sm text-base-content/60">
                        Interações com o cache
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-base-200 rounded-lg p-4 border border-base-300">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-success" />
                        <span className="text-xs font-medium text-base-content/70">Hits</span>
                    </div>
                    <div className="text-2xl font-bold text-success">
                        {cache.hits.toLocaleString()}
                    </div>
                </div>

                <div className="bg-base-200 rounded-lg p-4 border border-base-300">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="w-4 h-4 text-error" />
                        <span className="text-xs font-medium text-base-content/70">Misses</span>
                    </div>
                    <div className="text-2xl font-bold text-error">
                        {cache.misses.toLocaleString()}
                    </div>
                </div>

                <div className="bg-base-200 rounded-lg p-4 border border-base-300">
                    <div className="flex items-center gap-2 mb-2">
                        <HardDrive className="w-4 h-4 text-base-content/60" />
                        <span className="text-xs font-medium text-base-content/70">Taxa de Acerto</span>
                    </div>
                    <div className={`text-2xl font-bold ${getHitRateColor(cache.hit_rate)}`}>
                        {cache.hit_rate.toFixed(1)}%
                    </div>
                </div>
            </div>

            {/* Hit Rate Bar */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-base-content">
                        Performance do Cache
                    </span>
                    <span className={`text-sm font-bold ${getHitRateColor(cache.hit_rate)}`}>
                        {cache.hit_rate.toFixed(1)}%
                    </span>
                </div>
                <div className="w-full bg-base-300 rounded-full h-3">
                    <div
                        className={`${getHitRateBarColor(cache.hit_rate)} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${cache.hit_rate}%` }}
                    />
                </div>
            </div>

            {/* Top Keys */}
            {cache.keys.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-base-content mb-3">
                        Chaves Mais Acessadas
                    </h3>
                    <div className="space-y-2">
                        {cache.keys.slice(0, 5).map((key, index) => (
                            <div 
                                key={index}
                                className="flex items-center justify-between bg-base-200 rounded-lg px-3 py-2"
                            >
                                <code className="text-xs text-base-content font-mono truncate flex-1">
                                    {key.key}
                                </code>
                                <span className="text-xs font-semibold text-base-content/70 ml-2">
                                    {key.count}x
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}


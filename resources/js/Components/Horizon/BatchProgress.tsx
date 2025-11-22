interface BatchProgressProps {
    progress: number;
    size?: 'sm' | 'md' | 'lg';
}

export function BatchProgress({ progress, size = 'md' }: BatchProgressProps) {
    const heightClasses = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
    };

    const getProgressColor = (value: number): string => {
        if (value === 100) return 'bg-success';
        if (value >= 75) return 'bg-info';
        if (value >= 50) return 'bg-warning';
        return 'bg-primary';
    };

    return (
        <div className="flex items-center gap-2">
            <div className={`flex-1 bg-base-300 rounded-full ${heightClasses[size]} overflow-hidden`}>
                <div
                    className={`h-full ${getProgressColor(progress)} transition-all duration-300`}
                    style={{ width: `${progress}%` }}
                />
            </div>
            <span className="text-sm font-medium min-w-[3rem] text-right">
                {progress.toFixed(0)}%
            </span>
        </div>
    );
}

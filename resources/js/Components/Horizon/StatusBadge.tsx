import type { HorizonStatus } from '@/types/horizon';

interface StatusBadgeProps {
    status: HorizonStatus;
    size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<HorizonStatus, { label: string; className: string }> = {
    running: {
        label: 'Ativo',
        className: 'badge-success',
    },
    paused: {
        label: 'Pausado',
        className: 'badge-warning',
    },
    inactive: {
        label: 'Inativo',
        className: 'badge-error',
    },
};

const sizeClasses = {
    sm: 'badge-sm',
    md: '',
    lg: 'badge-lg',
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <span className={`badge ${config.className} ${sizeClasses[size]} gap-1`}>
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            {config.label}
        </span>
    );
}

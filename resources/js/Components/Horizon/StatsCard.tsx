import type { ReactNode } from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: ReactNode;
    iconBgClass?: string;
    trend?: 'up' | 'down' | 'neutral';
}

export function StatsCard({
    title,
    value,
    subtitle,
    icon,
    iconBgClass = 'bg-primary/10',
}: StatsCardProps) {
    return (
        <div className="bg-base-100 border border-base-300 rounded-2xl p-6 hover:border-base-content/20 transition-all">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-base-content/60">{title}</p>
                    <p className="text-3xl font-bold text-base-content mt-1">{value}</p>
                    {subtitle && (
                        <p className="text-xs text-base-content/50 mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={`p-3 ${iconBgClass} rounded-lg`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

import React from 'react';
import type { DailyMetrics } from '@/types';

interface MetricsCardsProps {
    metrics: DailyMetrics;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics }) => {
    const metricItems = [
        {
            label: 'Doses programadas',
            value: metrics.totalMedications.toString(),
            icon: '/storage/medication.png',
        },
        {
            label: 'Doses tomadas',
            value: metrics.medicationsTaken.toString(),
            icon: '/storage/checkmark.png',
        },
        {
            label: 'Adesão ao tratamento',
            value: `${metrics.adherencePercentage}%`,
            icon: '/storage/analytics.png',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {metricItems.map((item) => {
                return (
                    <div
                        key={item.label}
                        className="bg-base-100 border border-base-300 rounded-2xl p-5 sm:p-6 hover:border-base-content/20 transition-all"
                    >
                        {/* Header with value and 3D placeholder */}
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-base-content/70 mb-0.5">
                                    {item.label}
                                </h3>
                                <p className="text-3xl sm:text-4xl font-medium text-base-content tracking-tight">
                                    {item.value}
                            </p>
                            </div>
                            {/* 3D placeholder */}
                            <img src={item.icon} alt={item.label} className="w-16 h-16 sm:w-20 sm:h-20" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

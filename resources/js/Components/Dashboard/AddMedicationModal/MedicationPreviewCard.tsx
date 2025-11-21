import { Pill } from 'lucide-react';
import type { MedicationSearchResult } from '@/types';

interface MedicationPreviewCardProps {
    medication: MedicationSearchResult;
}

export function MedicationPreviewCard({ medication }: MedicationPreviewCardProps) {
    return (
        <div className="card bg-base-200 border border-base-300">
            <div className="card-body p-4">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Pill className="h-6 w-6 text-primary" />
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base truncate">
                            {medication.name}
                        </h3>

                        {medication.active_principle && (
                            <p className="text-sm text-base-content/70 mt-1">
                                <span className="font-medium">Princípio ativo:</span>{' '}
                                {medication.active_principle}
                            </p>
                        )}

                        <div className="flex flex-wrap gap-2 mt-2">
                            {medication.manufacturer && (
                                <span className="badge badge-outline badge-sm truncate max-w-full">
                                    {medication.manufacturer}
                                </span>
                            )}
                            {medication.strength && (
                                <span className="badge badge-outline badge-sm truncate max-w-[120px]">
                                    {medication.strength}
                                </span>
                            )}
                            {medication.form && (
                                <span className="badge badge-outline badge-sm truncate max-w-[100px]">
                                    {medication.form}
                                </span>
                            )}
                            {medication.therapeutic_class && (
                                <span className="badge badge-outline badge-sm truncate max-w-full">
                                    {medication.therapeutic_class}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

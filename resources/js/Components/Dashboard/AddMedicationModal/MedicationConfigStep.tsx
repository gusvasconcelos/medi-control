import { today, dateString } from '@/utils/dateUtils';
import type { ViaAdministration } from '@/types';
import { TimeSlotInput } from './TimeSlotInput';
import { DateInput } from './DateInput';

interface MedicationConfigStepProps {
    dosage: string;
    viaAdministration: ViaAdministration | '';
    timeSlots: string[];
    startDate: string;
    endDate: string;
    errors: {
        dosage?: string;
        viaAdministration?: string;
        timeSlots?: string;
        startDate?: string;
        endDate?: string;
    };
    onChange: (field: string, value: any) => void;
}

const viaOptions: { value: ViaAdministration; label: string }[] = [
    { value: 'oral', label: 'Oral' },
    { value: 'topical', label: 'Tópica' },
    { value: 'injection', label: 'Injeção' },
    { value: 'inhalation', label: 'Inalação' },
    { value: 'sublingual', label: 'Sublingual' },
    { value: 'rectal', label: 'Retal' },
    { value: 'other', label: 'Outra' },
];

export function MedicationConfigStep({
    dosage,
    viaAdministration,
    timeSlots,
    startDate,
    endDate,
    errors,
    onChange,
}: MedicationConfigStepProps) {
    const todayFormatted = dateString(today());

    return (
        <div className="space-y-4">
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text font-medium">
                        Dosagem <span className="text-error">*</span>
                    </span>
                </label>
                <input
                    type="text"
                    placeholder="Ex: 500mg, 1 comprimido, 10ml"
                    value={dosage}
                    onChange={(e) => onChange('dosage', e.target.value)}
                    className={`input input-bordered w-full ${errors.dosage ? 'input-error' : ''}`}
                    maxLength={255}
                    required
                />
                {errors.dosage && (
                    <label className="label">
                        <span className="label-text-alt text-error">{errors.dosage}</span>
                    </label>
                )}
            </div>

            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text font-medium">
                        Via de administração <span className="text-error">*</span>
                    </span>
                </label>
                <select
                    value={viaAdministration}
                    onChange={(e) => onChange('viaAdministration', e.target.value)}
                    className={`select select-bordered w-full ${errors.viaAdministration ? 'input-error' : ''}`}
                    required
                >
                    <option disabled value="">
                        Selecione uma via
                    </option>
                    {viaOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {errors.viaAdministration && (
                    <label className="label">
                        <span className="label-text-alt text-error">{errors.viaAdministration}</span>
                    </label>
                )}
            </div>

            <TimeSlotInput
                timeSlots={timeSlots}
                onChange={(slots) => onChange('timeSlots', slots)}
                error={errors.timeSlots}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DateInput
                    label="Data de início"
                    value={startDate}
                    onChange={(value) => onChange('startDate', value)}
                    min={todayFormatted}
                    required
                    error={errors.startDate}
                />

                <DateInput
                    label="Data de término"
                    value={endDate}
                    onChange={(value) => onChange('endDate', value)}
                    min={startDate || todayFormatted}
                    error={errors.endDate}
                    helperText="Deixe vazio para tratamento contínuo"
                />
            </div>
        </div>
    );
}

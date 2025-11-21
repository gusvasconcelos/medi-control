import { Plus, X } from 'lucide-react';

interface TimeSlotInputProps {
    timeSlots: string[];
    onChange: (timeSlots: string[]) => void;
    error?: string;
}

export function TimeSlotInput({ timeSlots, onChange, error }: TimeSlotInputProps) {
    const addTimeSlot = () => {
        onChange([...timeSlots, '08:00']);
    };

    const removeTimeSlot = (index: number) => {
        if (timeSlots.length > 1) {
            onChange(timeSlots.filter((_, i) => i !== index));
        }
    };

    const updateTimeSlot = (index: number, value: string) => {
        const updated = [...timeSlots];
        updated[index] = value;
        onChange(updated);
    };

    return (
        <div className="form-control w-full">
            <label className="label">
                <span className="label-text font-medium">Horários para tomar</span>
            </label>

            <div className="space-y-2">
                {timeSlots.map((time, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => updateTimeSlot(index, e.target.value)}
                            className={`input input-bordered flex-1 ${error ? 'input-error' : ''}`}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => removeTimeSlot(index)}
                            disabled={timeSlots.length === 1}
                            className="btn btn-ghost btn-circle btn-sm"
                            aria-label="Remover horário"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={addTimeSlot}
                className="btn btn-ghost btn-sm mt-2 gap-2"
            >
                <Plus className="h-4 w-4" />
                Adicionar horário
            </button>

            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error}</span>
                </label>
            )}
        </div>
    );
}

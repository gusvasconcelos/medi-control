interface DateInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    min?: string;
    max?: string;
    required?: boolean;
    error?: string;
    helperText?: string;
}

export function DateInput({
    label,
    value,
    onChange,
    min,
    max,
    required,
    error,
    helperText,
}: DateInputProps) {
    return (
        <div className="form-control w-full">
            <label className="label">
                <span className="label-text font-medium">
                    {label} {required && <span className="text-error">*</span>}
                </span>
            </label>

            <input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                min={min}
                max={max}
                required={required}
                className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
            />

            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error}</span>
                </label>
            )}
            {!error && helperText && (
                <label className="label">
                    <span className="label-text-alt text-base-content/60">{helperText}</span>
                </label>
            )}
        </div>
    );
}

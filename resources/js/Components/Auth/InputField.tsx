import { InputHTMLAttributes, forwardRef } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    helperText?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
    ({ label, error, helperText, className = '', ...props }, ref) => {
        return (
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text font-medium">{label}</span>
                </label>
                <input
                    ref={ref}
                    className={`input input-bordered w-full ${error ? 'input-error' : ''} ${className}`}
                    {...props}
                />
                {error && (
                    <label className="label">
                        <span className="label-text-alt text-error">{error}</span>
                    </label>
                )}
                {helperText && !error && (
                    <label className="label">
                        <span className="label-text-alt text-base-content/70">{helperText}</span>
                    </label>
                )}
            </div>
        );
    }
);

InputField.displayName = 'InputField';

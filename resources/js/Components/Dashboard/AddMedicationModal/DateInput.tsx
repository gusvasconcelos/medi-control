import { useEffect, useRef, useState } from 'react';
import { Calendar } from 'lucide-react';
import { parseDate, formatForDisplay } from '@/utils/dateUtils';
import 'cally';

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

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'calendar-date': React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement> & {
                    value?: string;
                    min?: string;
                    max?: string;
                },
                HTMLElement
            >;
            'calendar-month': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        }
    }
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
    const calendarRef = useRef<HTMLElement>(null);
    const popoverId = `date-picker-${Math.random().toString(36).substring(7)}`;
    const [displayValue, setDisplayValue] = useState('');

    const formatDisplayDateStr = (dateStr: string): string => {
        if (!dateStr) return 'Selecione uma data';
        const date = parseDate(dateStr);
        return formatForDisplay(date);
    };

    useEffect(() => {
        setDisplayValue(formatDisplayDateStr(value));
    }, [value]);

    useEffect(() => {
        const calendar = calendarRef.current;
        if (!calendar) return;

        const handleChange = (event: Event) => {
            const target = event.target as HTMLElement & { value: string };
            if (target.value) {
                onChange(target.value);
                // Close popover after selection
                const popover = document.getElementById(popoverId) as any;
                if (popover && popover.hidePopover) {
                    popover.hidePopover();
                }
            }
        };

        calendar.addEventListener('change', handleChange);
        return () => calendar.removeEventListener('change', handleChange);
    }, [onChange, popoverId]);

    return (
        <div className="form-control w-full">
            <label className="label">
                <span className="label-text font-medium">
                    {label} {required && <span className="text-error">*</span>}
                </span>
            </label>

            <div className="relative">
                <button
                    type="button"
                    // @ts-ignore - popoverTarget is valid but TypeScript doesn't recognize it yet
                    popoverTarget={popoverId}
                    className={`input input-bordered w-full flex items-center gap-2 h-12 ${error ? 'input-error' : ''}`}
                    style={{ anchorName: `--${popoverId}` } as React.CSSProperties}
                >
                    <Calendar className="w-4 h-4 text-base-content/50" />
                    <span className="flex-1 text-left text-sm">{displayValue}</span>
                </button>

                <div
                    // @ts-ignore - popover is valid but TypeScript doesn't recognize it yet
                    popover="auto"
                    id={popoverId}
                    className="dropdown bg-base-100 rounded-box shadow-lg border border-base-300 p-4"
                    style={{ positionAnchor: `--${popoverId}` } as React.CSSProperties}
                >
                    <calendar-date
                        ref={calendarRef as any}
                        className="cally"
                        value={value}
                        min={min}
                        max={max}
                    >
                        <svg
                            aria-label="Anterior"
                            className="fill-current size-4"
                            slot="previous"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                        <svg
                            aria-label="Próximo"
                            className="fill-current size-4"
                            slot="next"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                        <calendar-month />
                    </calendar-date>
                </div>
            </div>

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

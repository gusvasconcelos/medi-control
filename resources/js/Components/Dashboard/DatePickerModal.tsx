import { useEffect, useRef } from 'react';
import { Calendar } from 'lucide-react';
import 'cally';

interface DatePickerModalProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'calendar-date': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
                value?: string;
                min?: string;
                max?: string;
            }, HTMLElement>;
            'calendar-month': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        }
    }
}

export function DatePickerModal({ selectedDate, onDateChange }: DatePickerModalProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const calendarRef = useRef<HTMLElement>(null);

    const formatDisplayDate = (date: Date): string => {
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatInputDate = (date: Date): string => {
        return date.toISOString().split('T')[0];
    };

    useEffect(() => {
        const calendar = calendarRef.current;
        if (!calendar) return;

        const handleChange = (event: Event) => {
            const target = event.target as HTMLElement & { value: string };
            if (target.value) {
                const newDate = new Date(target.value + 'T00:00:00');
                onDateChange(newDate);
            }
        };

        calendar.addEventListener('change', handleChange);
        return () => calendar.removeEventListener('change', handleChange);
    }, [onDateChange]);

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                // @ts-ignore - popoverTarget is valid but TypeScript doesn't recognize it yet
                popoverTarget="cally-popover-medications"
                className="btn btn-ghost sm:btn-sm gap-2 hover:bg-base-200 px-3 sm:px-4 border border-base-content/30 sm:border-0"
                aria-label="Selecionar data"
                style={{ anchorName: '--cally-medications' } as React.CSSProperties}
            >
                <Calendar className="w-5 h-5 sm:w-4 sm:h-4" />
                <span className="font-medium text-base sm:text-sm">{formatDisplayDate(selectedDate)}</span>
            </button>

            <div
                // @ts-ignore - popover is valid but TypeScript doesn't recognize it yet
                popover="auto"
                id="cally-popover-medications"
                className="dropdown bg-base-100 rounded-box shadow-lg border border-base-300 p-4"
                style={{ positionAnchor: '--cally-medications' } as React.CSSProperties}
            >
                <calendar-date
                    ref={calendarRef as any}
                    className="cally"
                    value={formatInputDate(selectedDate)}
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
    );
}

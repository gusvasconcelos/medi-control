import { useEffect, useRef } from 'react';
import { Calendar } from 'lucide-react';

import { dateString, formatCompact, parseDate } from '@/utils/dateUtils';
import 'cally';

interface DatePickerModalProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
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
            'calendar-month': React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement>,
                HTMLElement
            >;
        }
    }
}

export function DatePickerModal({
    selectedDate,
    onDateChange,
}: DatePickerModalProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const calendarRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const calendar = calendarRef.current;
        if (!calendar) return;

        const handleChange = (event: Event) => {
            const target = event.target as HTMLElement & { value: string };
            if (target.value) {
                const newDate = parseDate(target.value);
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
                className="btn btn-ghost gap-2 border border-base-content/30 px-3 hover:bg-base-200 sm:btn-sm sm:border-0 sm:px-4"
                aria-label="Selecionar data"
                style={
                    { anchorName: '--cally-medications' } as React.CSSProperties
                }
            >
                <Calendar className="h-5 w-5 sm:h-4 sm:w-4" />
                <span className="text-base font-medium sm:text-sm">
                    {formatCompact(selectedDate)}
                </span>
            </button>

            <div
                // @ts-ignore - popover is valid but TypeScript doesn't recognize it yet
                popover="auto"
                id="cally-popover-medications"
                className="dropdown rounded-box border border-base-300 bg-base-100 p-4 shadow-lg"
                style={
                    {
                        positionAnchor: '--cally-medications',
                    } as React.CSSProperties
                }
            >
                <calendar-date
                    ref={calendarRef as any}
                    className="cally"
                    value={dateString(selectedDate)}
                >
                    <svg
                        aria-label="Anterior"
                        className="size-4 fill-current"
                        slot="previous"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <path d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                    <svg
                        aria-label="Próximo"
                        className="size-4 fill-current"
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

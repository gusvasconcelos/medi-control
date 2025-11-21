import { dateString, parseDate } from '@/utils/dateUtils';

interface DatePickerModalProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
}

export function DatePickerModal({
    selectedDate,
    onDateChange,
}: DatePickerModalProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            const newDate = parseDate(e.target.value);
            onDateChange(newDate);
        }
    };

    return (
        <input
            type="date"
            value={dateString(selectedDate)}
            onChange={handleChange}
            className="input input-bordered w-full sm:w-auto"
            aria-label="Selecionar data"
        />
    );
}

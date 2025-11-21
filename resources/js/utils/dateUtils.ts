/**
 * Centralized date utilities with timezone support
 *
 * Ensures all date operations respect the backend timezone (APP_TIMEZONE).
 * Use these utilities instead of native Date operations for consistency.
 */

import { format as dateFnsFormat, parse, parseISO } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { ptBR } from 'date-fns/locale';

/**
 * Application timezone (must match backend config/app.php)
 */
export const APP_TIMEZONE = 'America/Sao_Paulo' as const;

/**
 * Date format patterns
 */
export const DATE_FORMATS = {
    ISO_DATE: 'yyyy-MM-dd',
    ISO_DATETIME: 'yyyy-MM-dd HH:mm:ss',
    DISPLAY_FULL: "dd 'de' MMMM 'de' yyyy",
    DISPLAY_SHORT: "dd 'de' MMM 'de' yyyy",
    DISPLAY_COMPACT: 'dd MMM yyyy',
    DISPLAY_WITH_TIME: "dd/MM/yyyy 'às' HH:mm",
} as const;

/**
 * Get current date/time in application timezone
 */
export function now(): Date {
    return toZonedTime(new Date(), APP_TIMEZONE);
}

/**
 * Get current date (00:00:00) in application timezone
 */
export function today(): Date {
    const currentDate = now();
    return new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
    );
}

/**
 * Convert date from application timezone to UTC for backend
 */
export function toUTC(date: Date): Date {
    return fromZonedTime(date, APP_TIMEZONE);
}

/**
 * Convert UTC date from backend to application timezone
 */
export function fromUTC(date: Date | string): Date {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return toZonedTime(dateObj, APP_TIMEZONE);
}

/**
 * Format date for display with Portuguese locale
 * @param date - Date to format
 * @param pattern - Optional format pattern (defaults to short display)
 * @example formatForDisplay(new Date()) // "21 de nov. de 2025"
 */
export function formatForDisplay(
    date: Date,
    pattern: keyof typeof DATE_FORMATS | string = 'DISPLAY_SHORT'
): string {
    const formatPattern =
        pattern in DATE_FORMATS
            ? DATE_FORMATS[pattern as keyof typeof DATE_FORMATS]
            : pattern;

    return dateFnsFormat(date, formatPattern, { locale: ptBR });
}

/**
 * Format date in compact format
 * @example formatCompact(new Date()) // "21 nov. 2025"
 */
export function formatCompact(date: Date): string {
    return dateFnsFormat(date, DATE_FORMATS.DISPLAY_COMPACT, { locale: ptBR });
}

/**
 * Parse date string in YYYY-MM-DD format to Date
 * @param dateString - Date string in ISO format
 * @example parseDate('2025-11-21')
 */
export function parseDate(dateString: string): Date {
    const parsed = parse(
        `${dateString}T00:00:00`,
        "yyyy-MM-dd'T'HH:mm:ss",
        new Date()
    );
    return toZonedTime(parsed, APP_TIMEZONE);
}

/**
 * Create date from year, month, and day in application timezone
 * @param year - Full year (e.g., 2025)
 * @param month - Month (1-12)
 * @param day - Day of month (1-31)
 */
export function createDate(year: number, month: number, day: number): Date {
    const date = new Date(year, month - 1, day);
    return toZonedTime(date, APP_TIMEZONE);
}

/**
 * Format date to ISO date string (YYYY-MM-DD)
 * @example dateString(new Date()) // "2025-11-21"
 */
export function dateString(date: Date): string {
    return dateFnsFormat(date, DATE_FORMATS.ISO_DATE);
}

/**
 * Format date to ISO datetime string (YYYY-MM-DD HH:mm:ss)
 * @example dateTimeString(new Date()) // "2025-11-21 14:30:00"
 */
export function dateTimeString(date: Date): string {
    return dateFnsFormat(date, DATE_FORMATS.ISO_DATETIME);
}

/**
 * Get start of day (00:00:00.000)
 */
export function startOfDay(date: Date): Date {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0,
        0,
        0,
        0
    );
}

/**
 * Get end of day (23:59:59.999)
 */
export function endOfDay(date: Date): Date {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        23,
        59,
        59,
        999
    );
}

/**
 * Check if date is today
 */
export function isToday(date: Date): boolean {
    return dateString(date) === dateString(today());
}

/**
 * Check if date is in the future (after today)
 */
export function isFuture(date: Date): boolean {
    return date > today();
}

/**
 * Check if date is in the past (before today)
 */
export function isPast(date: Date): boolean {
    return date < today();
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
    return dateString(date1) === dateString(date2);
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

/**
 * Subtract days from a date
 */
export function subtractDays(date: Date, days: number): Date {
    return addDays(date, -days);
}

/**
 * Get difference in days between two dates
 */
export function daysDifference(date1: Date, date2: Date): number {
    const msPerDay = 24 * 60 * 60 * 1000;
    const start = startOfDay(date1);
    const end = startOfDay(date2);
    return Math.round((end.getTime() - start.getTime()) / msPerDay);
}

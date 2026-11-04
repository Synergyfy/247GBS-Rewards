import { addDays, differenceInCalendarDays, format, isValid, parseISO, subDays } from 'date-fns';

export interface DateRange {
  from: string; // yyyy-MM-dd
  to: string; // yyyy-MM-dd
  days: number;
}

const ISO_DAY = 'yyyy-MM-dd';
export const DEFAULT_RANGE_DAYS = 30;

function parseDay(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = parseISO(value);
  return isValid(date) ? date : null;
}

export function toDay(date: Date): string {
  return format(date, ISO_DAY);
}

/** The reporting window from the URL, defaulting to the last 30 days (inclusive of today). */
export function resolveRange(from?: string | null, to?: string | null, today = new Date()): DateRange {
  const end = parseDay(to) ?? today;
  const start = parseDay(from) ?? subDays(end, DEFAULT_RANGE_DAYS - 1);
  const [a, b] = start <= end ? [start, end] : [end, start];
  return { from: toDay(a), to: toDay(b), days: differenceInCalendarDays(b, a) + 1 };
}

/** The window of the same length immediately before `range`, for "vs previous period" deltas. */
export function previousRange(range: DateRange): DateRange {
  const start = parseISO(range.from);
  const prevEnd = subDays(start, 1);
  const prevStart = subDays(start, range.days);
  return { from: toDay(prevStart), to: toDay(prevEnd), days: range.days };
}

/** Every day in the range, as yyyy-MM-dd. */
export function daysIn(range: DateRange): string[] {
  const start = parseISO(range.from);
  return Array.from({ length: range.days }, (_, i) => toDay(addDays(start, i)));
}

/** Percent change from `previous` to `current`; null when there's no baseline to compare against. */
export function percentChange(current: number, previous: number): number | null {
  if (!previous) return null;
  return ((current - previous) / previous) * 100;
}

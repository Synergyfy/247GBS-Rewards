/**
 * Sort comparator for table values: numbers numerically, everything else as natural text
 * ("Item 2" < "Item 10"); ISO timestamps sort correctly as text. Empty values go last.
 */
export function compareValues(a: unknown, b: unknown): number {
  if (a === b) return 0;
  if (a === null || a === undefined || a === '') return 1;
  if (b === null || b === undefined || b === '') return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

/** Sort rows by a top-level field in place-safe fashion (returns a new array). */
export function sortByField<T>(rows: T[], field: string, order: 'ASC' | 'DESC' = 'ASC'): T[] {
  const direction = order === 'DESC' ? -1 : 1;
  return [...rows].sort(
    (a, b) =>
      compareValues((a as Record<string, unknown>)[field], (b as Record<string, unknown>)[field]) * direction,
  );
}

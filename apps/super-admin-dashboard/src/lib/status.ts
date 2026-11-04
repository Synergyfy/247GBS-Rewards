export type StatusTone = 'success' | 'warning' | 'danger' | 'brand' | 'special' | 'seasonal' | 'neutral';
export interface StatusPresentation { tone: StatusTone; label: string; }
export const STATUS: Record<string, StatusPresentation> = {
  active: { tone: 'success', label: 'Active' }, inactive: { tone: 'danger', label: 'Inactive' },
  success: { tone: 'success', label: 'Success' }, pending: { tone: 'warning', label: 'Pending' }, failed: { tone: 'danger', label: 'Failed' },
  admin: { tone: 'brand', label: 'Admin' }, super_admin: { tone: 'special', label: 'Super admin' }, staff: { tone: 'neutral', label: 'Staff' }, customer: { tone: 'neutral', label: 'Customer' },
  mcom: { tone: 'neutral', label: 'MCom' }, stock_audit: { tone: 'seasonal', label: 'Stock audit' },
  PRESET: { tone: 'brand', label: 'Preset' }, CO_BRANDED: { tone: 'special', label: 'Co-branded' }, SEASONAL: { tone: 'seasonal', label: 'Seasonal' },
  STANDARD: { tone: 'neutral', label: 'Standard' }, LINK: { tone: 'brand', label: 'Link' }, CREDENTIALS: { tone: 'special', label: 'Credentials' },
};
export function statusFor(key: string | boolean | undefined): StatusPresentation {
  if (typeof key === 'boolean') return key ? STATUS.active! : STATUS.inactive!;
  if (key === undefined) return STATUS.active!;
  return STATUS[key] ?? { tone: 'neutral', label: key.replaceAll('_', ' ') };
}

/** §9A badge tones: flat, vibrant, consistent. The only place badge colors are defined. */
export const TONE_CLASSES: Record<StatusTone, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900',
  warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
  danger: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900',
  brand: 'bg-primary-tint text-primary border-primary/25',
  special: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-900',
  seasonal: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900',
  neutral: 'bg-muted text-muted-foreground border-border',
};

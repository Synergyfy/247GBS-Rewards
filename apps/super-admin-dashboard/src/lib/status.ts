export type StatusTone = 'success' | 'warning' | 'danger' | 'brand' | 'special' | 'seasonal' | 'neutral';
export interface StatusPresentation { tone: StatusTone; label: string; }
export const STATUS: Record<string, StatusPresentation> = {
  active: { tone: 'success', label: 'Active' }, inactive: { tone: 'danger', label: 'Inactive' },
  success: { tone: 'success', label: 'Success' }, pending: { tone: 'warning', label: 'Pending' }, failed: { tone: 'danger', label: 'Failed' },
  admin: { tone: 'brand', label: 'Admin' }, super_admin: { tone: 'special', label: 'Super admin' }, staff: { tone: 'neutral', label: 'Staff' }, customer: { tone: 'neutral', label: 'Customer' },
  mcom: { tone: 'neutral', label: 'MCom' }, stock_audit: { tone: 'seasonal', label: 'Stock audit' },
  PRESET: { tone: 'brand', label: 'Preset' }, CO_BRANDED: { tone: 'special', label: 'Co-branded' }, SEASONAL: { tone: 'seasonal', label: 'Seasonal' },
  STANDARD: { tone: 'neutral', label: 'Standard' }, LINK: { tone: 'brand', label: 'Link' }, CREDENTIALS: { tone: 'special', label: 'Credentials' },
  fresh: { tone: 'brand', label: 'Fresh' }, increase: { tone: 'seasonal', label: 'Increase' }, new: { tone: 'success', label: 'New' }, edit: { tone: 'warning', label: 'Edit' }, used: { tone: 'neutral', label: 'Used' },
};
export function statusFor(key: string | boolean | undefined): StatusPresentation {
  if (typeof key === 'boolean') return key ? STATUS.active! : STATUS.inactive!;
  if (key === undefined) return STATUS.active!;
  return STATUS[key] ?? { tone: 'neutral', label: key.replaceAll('_', ' ') };
}

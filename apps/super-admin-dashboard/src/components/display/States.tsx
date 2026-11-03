import { AlertCircle, ShieldAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import { statusFor } from '@/lib/status';

export function StatusBadge({ value }: { value: string | boolean | undefined }) {
  const status = statusFor(value);
  return <span className={`status ${status.tone}`}><span className="status-dot" />{status.label}</span>;
}
export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <div className="empty-state"><h3>{title}</h3>{description && <div>{description}</div>}{action && <div style={{ marginTop: 10 }}>{action}</div>}</div>;
}
export function ErrorState({ message, retry }: { message: string; retry: () => void }) {
  return <div className="error-box"><span style={{ display: 'flex', gap: 7, alignItems: 'center' }}><AlertCircle size={15} />{message}</span><button className="button" onClick={retry}>Retry</button></div>;
}
export function NotAuthorized() {
  return <div className="panel empty-state"><ShieldAlert size={24} /><h3>Not authorized</h3><div>Your account does not have permission to view this section.</div></div>;
}
export function NotAvailableYet({ section }: { section?: string }) {
  return <div className="callout"><strong>{section ?? 'This section'} isn’t available yet.</strong> The backend endpoint is still being implemented. Existing dashboard data remains available in mock mode.</div>;
}

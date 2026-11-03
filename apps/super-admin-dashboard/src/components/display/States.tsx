import { AlertCircle, ShieldAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Callout } from '@/components/display/Callout';
import { statusFor, TONE_CLASSES } from '@/lib/status';
import { cn } from '@/lib/utils';

/** §9A status badge: 20px, 2px radius, 11px label with a 6px dot. Tones come only from `lib/status.ts`. */
export function StatusBadge({ value }: { value: string | boolean | undefined }) {
  const status = statusFor(value);
  return (
    <span
      className={cn(
        'inline-flex h-5 items-center gap-1 whitespace-nowrap rounded-sm border px-1.5 text-[11px] font-medium',
        TONE_CLASSES[status.tone],
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {status.label}
    </span>
  );
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="px-4 py-8 text-center text-xs text-muted-foreground">
      <h3 className="mb-0.5 text-sm font-semibold text-foreground">{title}</h3>
      {description && <div>{description}</div>}
      {action && <div className="mt-2.5">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, retry }: { message: string; retry: () => void }) {
  return (
    <div
      role="alert"
      className="flex items-center justify-between gap-3 rounded-sm border border-destructive/30 bg-card p-3 text-xs text-destructive"
    >
      <span className="flex items-center gap-2">
        <AlertCircle className="size-4 shrink-0" />
        {message}
      </span>
      <Button variant="outline" onClick={retry}>
        Retry
      </Button>
    </div>
  );
}

export function NotAuthorized() {
  return (
    <div className="panel flex flex-col items-center gap-1 px-4 py-8 text-center text-xs text-muted-foreground">
      <ShieldAlert className="size-6" />
      <h3 className="text-sm font-semibold text-foreground">Not authorized</h3>
      <div>Your account does not have permission to view this section.</div>
    </div>
  );
}

export function NotAvailableYet({ section }: { section?: string }) {
  return (
    <Callout tone="warning">
      <strong className="font-semibold">{section ?? 'This section'} isn’t available yet.</strong> The backend endpoint is still being
      implemented. Existing dashboard data remains available in mock mode.
    </Callout>
  );
}

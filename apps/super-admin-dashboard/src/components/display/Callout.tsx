import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type CalloutTone = 'info' | 'warning' | 'danger';

const TONES: Record<CalloutTone, string> = {
  info: 'border-primary/25 bg-primary-tint/60 text-foreground',
  warning: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200',
  danger: 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200',
};

/** §9B inline info / warning / danger note (e.g. "This campaign ends in 3 days"). */
export function Callout({ tone = 'warning', children, className }: { tone?: CalloutTone; children: ReactNode; className?: string }) {
  return (
    <div role={tone === 'danger' ? 'alert' : 'note'} className={cn('rounded-sm border px-2.5 py-2 text-xs', TONES[tone], className)}>
      {children}
    </div>
  );
}

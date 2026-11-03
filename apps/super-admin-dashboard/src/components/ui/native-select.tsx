import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Native <select> styled like Input (§9A: 32px control, 2px radius). Used for compact filters and page
 * size, where a native picker is lighter and more accessible than the Radix Select.
 */
function NativeSelect({ className, ...props }: React.ComponentProps<'select'>) {
  return (
    <select
      data-slot="native-select"
      className={cn(
        'h-8 rounded-sm border border-input bg-card px-2 text-xs text-foreground outline-none',
        'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export { NativeSelect };

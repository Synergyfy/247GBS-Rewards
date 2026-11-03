import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface DetailTab {
  value: string;
  label: string;
  count?: number;
  content: ReactNode;
}

/**
 * §9B detail-page tabs. The active tab lives in `?tab=` so Back/refresh restore it.
 * §9A motion: one 2px brand underline slides between tabs (200ms); panels cross-fade (150ms, no slide).
 */
export function DetailTabs({ tabs, label }: { tabs: DetailTab[]; label: string }) {
  const [params, setParams] = useSearchParams();
  const requested = params.get('tab');
  const active = tabs.some((tab) => tab.value === requested) ? requested! : tabs[0]?.value;
  const listRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  // Measure the active trigger; re-measure when the strip resizes (counts load, viewport changes)
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const trigger = list.querySelector<HTMLElement>('[role="tab"][data-state="active"]');
      if (trigger) setIndicator({ left: trigger.offsetLeft, width: trigger.offsetWidth });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [active, tabs.length]);

  function select(value: string) {
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value === tabs[0]?.value) next.delete('tab');
        else next.set('tab', value);
        return next;
      },
      { replace: true },
    );
  }

  return (
    <Tabs value={active} onValueChange={select} className="gap-0">
      <div className="overflow-x-auto border-b border-border px-1.5">
        <TabsList ref={listRef} variant="line" aria-label={label} className="relative h-9 gap-0 p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="h-9 flex-none px-2.5 text-xs after:hidden data-[state=active]:font-semibold"
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="tabular-nums rounded-sm bg-muted px-1 text-[11px] text-muted-foreground">{tab.count}</span>
              )}
            </TabsTrigger>
          ))}
          {indicator && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 h-0.5 bg-primary transition-[transform,width] duration-[var(--duration-base)] ease-[var(--ease-out-ui)] motion-reduce:transition-none"
              style={{ width: indicator.width, transform: `translateX(${indicator.left}px)` }}
            />
          )}
        </TabsList>
      </div>
      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:duration-[var(--duration-fast)] motion-reduce:animate-none"
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}

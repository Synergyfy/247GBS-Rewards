import type { ReactNode } from 'react';
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
 * Line variant with a 2px brand underline; panels cross-fade (motion table: 150ms, no slide).
 */
export function DetailTabs({ tabs, label }: { tabs: DetailTab[]; label: string }) {
  const [params, setParams] = useSearchParams();
  const requested = params.get('tab');
  const active = tabs.some((tab) => tab.value === requested) ? requested! : tabs[0]?.value;

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
        <TabsList variant="line" aria-label={label} className="h-9 gap-0 p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="h-9 flex-none px-2.5 text-xs after:bg-primary group-data-[orientation=horizontal]/tabs:after:bottom-0 data-[state=active]:font-semibold"
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="tabular rounded-sm bg-muted px-1 text-[11px] text-muted-foreground">{tab.count}</span>
              )}
            </TabsTrigger>
          ))}
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

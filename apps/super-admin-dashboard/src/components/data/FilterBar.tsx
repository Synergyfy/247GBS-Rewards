import type { ReactNode } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUrlState } from '@/hooks/useUrlState';

/** §9A FilterBar: search input plus filter controls, with "Clear all". Everything syncs to the URL. */
export function FilterBar({ placeholder = 'Search records…', children }: { placeholder?: string; children?: ReactNode }) {
  const state = useUrlState();
  const hasFilters = Boolean(state.search) || state.params.size > 0;
  return (
    <div className="toolbar mb-3 rounded-md border border-border bg-card">
      <div className="toolbar-left flex-wrap">
        <label className="relative">
          <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            data-table-filter
            aria-label="Search table"
            placeholder={placeholder}
            value={state.search}
            onChange={(event) => state.setSearch(event.target.value)}
            className="w-[min(60vw,260px)] pl-8"
          />
        </label>
        {children}
        {hasFilters && (
          <Button
            variant="ghost"
            onClick={() => {
              state.setSearch('');
              state.setParams(new URLSearchParams());
            }}
          >
            <X />
            Clear all
          </Button>
        )}
      </div>
      <div className="toolbar-right max-md:hidden">
        <span className="text-xs text-muted-foreground">Filters sync to URL · press / to search</span>
      </div>
    </div>
  );
}

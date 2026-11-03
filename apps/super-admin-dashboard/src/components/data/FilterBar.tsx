import { Search, X } from 'lucide-react';
import { useUrlState } from '@/hooks/useUrlState';

export function FilterBar({ placeholder = 'Search records…', children }: { placeholder?: string; children?: React.ReactNode }) {
  const state = useUrlState();
  return <div className="toolbar"><div className="toolbar-left"><label className="search-input-wrap"><Search aria-hidden="true" /><input data-table-filter className="input" aria-label="Search table" placeholder={placeholder} value={state.search} onChange={(event) => state.setSearch(event.target.value)} /></label>{children}{(state.search || state.params.size > 0) && <button className="button ghost" onClick={() => { state.setSearch(''); state.setParams(new URLSearchParams()); }}><X size={13} />Clear all</button>}</div><div className="toolbar-right"><span className="cell-muted">Filters sync to URL</span></div></div>;
}

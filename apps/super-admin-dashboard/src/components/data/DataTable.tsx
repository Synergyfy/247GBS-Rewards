import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { EmptyState } from '@/components/display/States';

export interface Column<T> { key: string; label: string; render: (row: T) => ReactNode; mobile?: boolean; sortable?: boolean; }
interface Props<T> { columns: Column<T>[]; rows: T[]; loading?: boolean; error?: Error | null; onRetry?: () => void; total?: number; page?: number; pageSize?: number; onPageChange?: (page: number) => void; onPageSizeChange?: (size: number) => void; rowId: (row: T) => string; emptyTitle?: string; }
export function DataTable<T>({ columns, rows, loading = false, error, onRetry, total = rows.length, page = 1, pageSize = 25, onPageChange, onPageSizeChange, rowId, emptyTitle = 'No records found' }: Props<T>) {
  const [selected, setSelected] = useState<string[]>([]);
  const visibleColumns = useMemo(() => columns, [columns]);
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);
  function exportCsv() {
    const headers = visibleColumns.map((column) => column.label);
    const values = rows.map((row) => visibleColumns.map((column) => {
      const value = (row as Record<string, unknown>)[column.key];
      return typeof value === 'string' || typeof value === 'number' ? String(value) : '';
    }));
    const csv = [headers, ...values].map((line) => line.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = '247gbs-current-page.csv'; anchor.click(); URL.revokeObjectURL(url);
  }
  if (error) return <div className="error-box"><span>{error.message || 'Something went wrong while loading data.'}</span><button className="button" onClick={onRetry}>Retry</button></div>;
  return <div className="panel">
    <div className="toolbar"><div className="toolbar-left">{selected.length > 0 ? <><span className="cell-muted">{selected.length} selected</span><button className="button" onClick={() => setSelected([])}>Clear selection</button></> : <span className="cell-muted">{loading ? 'Updating…' : `${total.toLocaleString()} records`}</span>}</div><div className="toolbar-right"><button className="button" onClick={exportCsv} aria-label="Export current page as CSV"><Download />Export CSV</button></div></div>
    {loading && rows.length === 0 ? <div className="panel-body" aria-label="Loading records">{Array.from({ length: 7 }, (_, i) => <div key={i} className="skeleton" style={{ height: 26, marginBottom: 6 }} />)}</div> : rows.length === 0 ? <EmptyState title={emptyTitle} description="Try changing your search or filters." /> : <div className="table-wrap"><table className="sticky-first"><thead><tr><th><input aria-label="Select all rows" type="checkbox" checked={selected.length === rows.length && rows.length > 0} onChange={(event) => setSelected(event.target.checked ? rows.map(rowId) : [])} /></th>{visibleColumns.map((column) => <th key={column.key}>{column.label}</th>)}<th aria-label="Row actions" /></tr></thead><tbody>{rows.map((row) => { const id = rowId(row); return <tr key={id} className={selected.includes(id) ? 'selected-row' : undefined}><td><input aria-label={`Select row ${id}`} type="checkbox" checked={selected.includes(id)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, id] : current.filter((key) => key !== id))} /></td>{visibleColumns.map((column) => <td key={column.key}>{column.render(row)}</td>)}<td><button className="icon-button" title="Quick look" aria-label="Quick look" onClick={() => window.dispatchEvent(new CustomEvent('quick-look', { detail: { id, row } }))}>···</button></td></tr>; })}</tbody></table></div>}
    <div className="table-footer"><span>{first}–{last} of {total.toLocaleString()}</span><div className="pagination"><label className="cell-muted" htmlFor="page-size">Rows</label><select id="page-size" className="select" value={pageSize} onChange={(event) => onPageSizeChange?.(Number(event.target.value))}><option value={25}>25</option><option value={50}>50</option><option value={100}>100</option></select><button className="icon-button" aria-label="Previous page" disabled={page <= 1} onClick={() => onPageChange?.(page - 1)}><ChevronLeft /></button><span className="tabular">{page}</span><button className="icon-button" aria-label="Next page" disabled={last >= total} onClick={() => onPageChange?.(page + 1)}><ChevronRight /></button></div></div>
  </div>;
}

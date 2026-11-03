import { Fragment, useMemo, useState, type ReactNode } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Download,
  Eye,
  MoreHorizontal,
  Rows3,
  Rows4,
} from 'lucide-react';
import { EmptyState } from '@/components/display/States';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { compareValues } from '@/lib/sort';

export interface Column<T> {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
  /** `false` hides the column below the `md` breakpoint (§9B: keep identity, status and one metric). */
  mobile?: boolean;
  /** Header becomes a sort toggle. Server lists sort by `key`; local tables use `sortValue` or `row[key]`. */
  sortable?: boolean;
  sortValue?: (row: T) => string | number | null | undefined;
  /** Right-align numeric columns. */
  align?: 'left' | 'right';
  /** Value written to CSV export; defaults to `row[key]` when it's a string or number. */
  csv?: (row: T) => string | number | null | undefined;
}

export interface SortState {
  key: string;
  order: 'ASC' | 'DESC';
}

export interface RowAction {
  label: string;
  onSelect: () => void;
  icon?: ReactNode;
  destructive?: boolean;
  disabled?: boolean;
}

interface Props<T> {
  columns: Column<T>[];
  rows: T[];
  rowId: (row: T) => string;
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  emptyTitle?: string;
  /** Server-side paging. Omit `onPageChange` for in-memory tables; they page locally. */
  total?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  /** Controlled (server/URL) sort. Without `onSortChange` the table sorts the current rows itself. */
  sort?: SortState;
  onSortChange?: (key: string, order: 'ASC' | 'DESC') => void;
  /** Shown in place of the toolbar while rows are selected. */
  bulkActions?: (selected: T[], clear: () => void) => ReactNode;
  /** Per-row ⋯ menu. */
  rowActions?: (row: T) => RowAction[];
  /** Persists hidden columns per table in localStorage. */
  tableId?: string;
  /** Highlight a row once (§9A: changed row fades from tint over 1.2s). */
  highlightId?: string | null;
}

const DENSITY_KEY = 'sa_table_density';
type Density = 'compact' | 'comfortable';

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: keep in-memory state */
  }
}

function cellValue<T>(row: T, column: Column<T>): unknown {
  if (column.sortValue) return column.sortValue(row);
  return (row as Record<string, unknown>)[column.key];
}

/** §9A data table: sticky header, sorting, column visibility, density, selection + bulk bar, row menu. */
export function DataTable<T>({
  columns,
  rows,
  rowId,
  loading = false,
  error,
  onRetry,
  emptyTitle = 'No records found',
  total,
  page: controlledPage,
  pageSize: controlledPageSize,
  onPageChange,
  onPageSizeChange,
  sort: controlledSort,
  onSortChange,
  bulkActions,
  rowActions,
  tableId,
  highlightId,
}: Props<T>) {
  const serverPaged = Boolean(onPageChange);
  const [localPage, setLocalPage] = useState(1);
  const [localPageSize, setLocalPageSize] = useState(25);
  const [localSort, setLocalSort] = useState<SortState | undefined>(undefined);
  const [selected, setSelected] = useState<string[]>([]);
  const [density, setDensity] = useState<Density>(() => readStorage<Density>(DENSITY_KEY, 'compact'));
  const hiddenKey = tableId ? `sa_table_hidden_${tableId}` : null;
  const [hidden, setHidden] = useState<string[]>(() =>
    hiddenKey ? readStorage<string[]>(hiddenKey, []) : [],
  );

  const sort = onSortChange ? controlledSort : localSort;
  const page = serverPaged ? (controlledPage ?? 1) : localPage;
  const pageSize = serverPaged ? (controlledPageSize ?? 25) : localPageSize;
  const visibleColumns = columns.filter((column, index) => index === 0 || !hidden.includes(column.key));

  // In-memory tables sort and page the rows they were given
  const viewRows = useMemo(() => {
    if (serverPaged) return rows;
    let sorted = rows;
    if (localSort) {
      const column = columns.find((item) => item.key === localSort.key);
      if (column) {
        sorted = [...rows].sort(
          (a, b) =>
            compareValues(cellValue(a, column), cellValue(b, column)) * (localSort.order === 'DESC' ? -1 : 1),
        );
      }
    }
    return sorted.slice((localPage - 1) * localPageSize, localPage * localPageSize);
  }, [serverPaged, rows, columns, localSort, localPage, localPageSize]);

  const totalRows = serverPaged ? (total ?? rows.length) : rows.length;
  const first = totalRows === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, totalRows);
  // Selection only ever refers to rows currently on screen
  const visibleIds = new Set(viewRows.map(rowId));
  const selectedIds = selected.filter((id) => visibleIds.has(id));
  const selectedRows = viewRows.filter((row) => selectedIds.includes(rowId(row)));
  const clearSelection = () => setSelected([]);

  function toggleSort(column: Column<T>) {
    const nextOrder: 'ASC' | 'DESC' = sort?.key === column.key && sort.order === 'ASC' ? 'DESC' : 'ASC';
    if (onSortChange) onSortChange(column.key, nextOrder);
    else {
      setLocalSort({ key: column.key, order: nextOrder });
      setLocalPage(1);
    }
  }
  function changePage(next: number) {
    clearSelection();
    if (onPageChange) onPageChange(next);
    else setLocalPage(next);
  }
  function changePageSize(size: number) {
    clearSelection();
    if (onPageSizeChange) onPageSizeChange(size);
    else {
      setLocalPageSize(size);
      setLocalPage(1);
    }
  }
  function toggleColumn(key: string, visible: boolean) {
    const next = visible ? hidden.filter((item) => item !== key) : [...hidden, key];
    setHidden(next);
    if (hiddenKey) writeStorage(hiddenKey, next);
  }
  function toggleDensity() {
    const next: Density = density === 'compact' ? 'comfortable' : 'compact';
    setDensity(next);
    writeStorage(DENSITY_KEY, next);
  }
  function exportCsv(exportRows: T[]) {
    const headers = visibleColumns.map((column) => column.label);
    const values = exportRows.map((row) =>
      visibleColumns.map((column) => {
        const value = column.csv ? column.csv(row) : (row as Record<string, unknown>)[column.key];
        return typeof value === 'string' || typeof value === 'number' ? String(value) : '';
      }),
    );
    const csv = [headers, ...values]
      .map((line) => line.map((value) => `"${value.replaceAll('"', '""')}"`).join(','))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `247gbs-${tableId ?? 'table'}-page-${page}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (error) {
    return (
      <div className="error-box">
        <span>{error.message || 'Something went wrong while loading data.'}</span>
        <button className="button" onClick={onRetry}>
          Retry
        </button>
      </div>
    );
  }

  const allSelected = viewRows.length > 0 && selectedIds.length === viewRows.length;

  return (
    <div className="panel" data-density={density}>
      {selectedIds.length > 0 ? (
        // §9B: the bulk bar replaces the toolbar while rows are selected
        <div
          className="toolbar animate-in fade-in-0 slide-in-from-bottom-1 duration-[var(--duration-fast)] motion-reduce:animate-none"
          role="region"
          aria-label="Bulk actions"
        >
          <div className="toolbar-left">
            <span className="tabular">{selectedIds.length} selected</span>
            {bulkActions?.(selectedRows, clearSelection)}
            <button className="button" onClick={() => exportCsv(selectedRows)}>
              <Download />
              Export selected
            </button>
          </div>
          <div className="toolbar-right">
            <button className="button ghost" onClick={clearSelection}>
              Clear selection
            </button>
          </div>
        </div>
      ) : (
        <div className="toolbar">
          <div className="toolbar-left">
            <span className="cell-muted tabular">
              {loading ? 'Updating…' : `${totalRows.toLocaleString()} records`}
            </span>
          </div>
          <div className="toolbar-right">
            <button
              className="icon-button"
              onClick={toggleDensity}
              aria-label={density === 'compact' ? 'Switch to comfortable rows' : 'Switch to compact rows'}
              title={density === 'compact' ? 'Comfortable rows' : 'Compact rows'}
            >
              {density === 'compact' ? <Rows3 /> : <Rows4 />}
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="button" aria-label="Choose visible columns">
                  <Columns3 />
                  Columns
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-44">
                <DropdownMenuLabel className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Visible columns
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {columns.slice(1).map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.key}
                    checked={!hidden.includes(column.key)}
                    onCheckedChange={(checked) => toggleColumn(column.key, checked === true)}
                    onSelect={(event) => event.preventDefault()}
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              className="button"
              onClick={() => exportCsv(viewRows)}
              aria-label="Export current page as CSV"
            >
              <Download />
              Export CSV
            </button>
          </div>
        </div>
      )}
      {/* §9A: keep previous rows visible (dimmed) while a page, sort or filter change refetches */}
      {loading && viewRows.length > 0 && (
        <div className="table-progress" role="progressbar" aria-label="Updating records" />
      )}
      {loading && viewRows.length === 0 ? (
        <div className="panel-body" aria-label="Loading records">
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className="skeleton" style={{ height: 26, marginBottom: 6 }} />
          ))}
        </div>
      ) : viewRows.length === 0 ? (
        <EmptyState title={emptyTitle} description="Try changing your search or filters." />
      ) : (
        <div
          className={cn(
            'table-wrap transition-opacity duration-[var(--duration-fast)]',
            loading && 'opacity-60',
          )}
        >
          <table className="sticky-first">
            <thead>
              <tr>
                <th style={{ width: 28 }}>
                  <input
                    aria-label="Select all rows on this page"
                    type="checkbox"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = selectedIds.length > 0 && !allSelected;
                    }}
                    onChange={(event) => setSelected(event.target.checked ? viewRows.map(rowId) : [])}
                  />
                </th>
                {visibleColumns.map((column) => {
                  const active = sort?.key === column.key;
                  const ariaSort = active ? (sort.order === 'ASC' ? 'ascending' : 'descending') : 'none';
                  return (
                    <th
                      key={column.key}
                      aria-sort={column.sortable ? ariaSort : undefined}
                      className={cn(
                        column.mobile === false && 'max-md:hidden',
                        column.align === 'right' && 'text-right',
                      )}
                    >
                      {column.sortable ? (
                        <button
                          type="button"
                          className={cn(
                            'inline-flex items-center gap-1 uppercase hover:text-foreground',
                            active && 'text-foreground',
                          )}
                          onClick={() => toggleSort(column)}
                        >
                          {column.label}
                          {active ? (
                            sort.order === 'ASC' ? (
                              <ArrowUp className="size-3" />
                            ) : (
                              <ArrowDown className="size-3" />
                            )
                          ) : (
                            <ArrowUpDown className="size-3 opacity-40" />
                          )}
                        </button>
                      ) : (
                        column.label
                      )}
                    </th>
                  );
                })}
                <th aria-label="Row actions" style={{ width: rowActions ? 64 : 36 }} />
              </tr>
            </thead>
            <tbody>
              {viewRows.map((row) => {
                const id = rowId(row);
                const actions = rowActions?.(row) ?? [];
                return (
                  <tr
                    key={id}
                    className={cn(
                      selectedIds.includes(id) && 'selected-row',
                      highlightId === id && 'row-highlight',
                    )}
                  >
                    <td>
                      <input
                        aria-label={`Select row ${id}`}
                        type="checkbox"
                        checked={selectedIds.includes(id)}
                        onChange={(event) =>
                          setSelected((current) =>
                            event.target.checked ? [...current, id] : current.filter((key) => key !== id),
                          )
                        }
                      />
                    </td>
                    {visibleColumns.map((column) => (
                      <td
                        key={column.key}
                        className={cn(
                          column.mobile === false && 'max-md:hidden',
                          column.align === 'right' && 'tabular text-right',
                        )}
                      >
                        {column.render(row)}
                      </td>
                    ))}
                    <td>
                      <div style={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <button
                          className="icon-button"
                          title="Quick look (Space)"
                          aria-label="Quick look"
                          onClick={() =>
                            window.dispatchEvent(new CustomEvent('quick-look', { detail: { id, row } }))
                          }
                        >
                          <Eye />
                        </button>
                        {actions.length > 0 && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="icon-button" aria-label="More row actions">
                                <MoreHorizontal />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="min-w-44">
                              {actions.map((action, index) => (
                                <Fragment key={action.label}>
                                  {action.destructive && index > 0 && !actions[index - 1]?.destructive && (
                                    <DropdownMenuSeparator />
                                  )}
                                  <DropdownMenuItem
                                    variant={action.destructive ? 'destructive' : 'default'}
                                    disabled={action.disabled}
                                    onSelect={action.onSelect}
                                    className="h-7 text-xs"
                                  >
                                    {action.icon}
                                    {action.label}
                                  </DropdownMenuItem>
                                </Fragment>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <div className="table-footer">
        <span className="tabular">
          {first}–{last} of {totalRows.toLocaleString()}
        </span>
        <div className="pagination">
          <label className="cell-muted" htmlFor={`page-size-${tableId ?? 'table'}`}>
            Rows
          </label>
          <select
            id={`page-size-${tableId ?? 'table'}`}
            className="select"
            value={pageSize}
            onChange={(event) => changePageSize(Number(event.target.value))}
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <button
            className="icon-button"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => changePage(page - 1)}
          >
            <ChevronLeft />
          </button>
          <span className="tabular">{page}</span>
          <button
            className="icon-button"
            aria-label="Next page"
            disabled={last >= totalRows}
            onClick={() => changePage(page + 1)}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

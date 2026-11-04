import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import type { ListParams } from '@/services/types';
import type { SortState } from '@/components/data/DataTable';

/** §5.5 list state in URL search params: page, limit, search, sort, order and filters. */
export function useUrlState() {
  const [params, setParams] = useSearchParams();
  const urlSearch = params.get('search') ?? '';
  const [search, setSearch] = useState(urlSearch);

  // Back/forward or "Clear all" changed the URL: mirror it into the input
  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  // Typing is instant; the URL (and therefore the network) follows 250ms later.
  // Only write when the value actually differs, so a page load never resets `page`.
  useEffect(() => {
    if (search === urlSearch) return;
    const timer = window.setTimeout(() => {
      setParams(
        (current) => {
          const next = new URLSearchParams(current);
          if (search) next.set('search', search);
          else next.delete('search');
          next.delete('page');
          return next;
        },
        { replace: true },
      );
    }, 250);
    return () => window.clearTimeout(timer);
  }, [search, urlSearch, setParams]);

  const page = Math.max(1, Number(params.get('page') ?? 1) || 1);
  const limit = Math.max(1, Number(params.get('limit') ?? 25) || 25);
  const sortKey = params.get('sort') ?? undefined;
  const order: 'ASC' | 'DESC' = params.get('order') === 'DESC' ? 'DESC' : 'ASC';
  const listParams: ListParams = { page, limit, search: urlSearch || undefined, sort: sortKey, order };

  function setParam(key: string, value: string | undefined) {
    setParams((current) => {
      const next = new URLSearchParams(current);
      if (value) next.set(key, value);
      else next.delete(key);
      if (key !== 'page') next.delete('page');
      return next;
    });
  }

  function setSort(key: string, nextOrder: 'ASC' | 'DESC') {
    setParams((current) => {
      const next = new URLSearchParams(current);
      next.set('sort', key);
      next.set('order', nextOrder);
      next.delete('page');
      return next;
    });
  }

  const sort: SortState | undefined = sortKey ? { key: sortKey, order } : undefined;

  /** Spread onto `<DataTable>` to wire paging and sorting to the URL. */
  const tableProps = {
    page,
    pageSize: limit,
    onPageChange: (nextPage: number) => setParam('page', String(nextPage)),
    onPageSizeChange: (size: number) => setParam('limit', String(size)),
    sort,
    onSortChange: setSort,
  };

  return { params, setParams, listParams, search, setSearch, setParam, page, limit, tableProps };
}

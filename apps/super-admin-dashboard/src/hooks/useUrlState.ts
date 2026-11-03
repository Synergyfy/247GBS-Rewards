import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import type { ListParams } from '@/services/types';

export function useUrlState() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') ?? '');
  useEffect(() => { setSearch(params.get('search') ?? ''); }, [params]);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setParams((current) => {
        const next = new URLSearchParams(current);
        if (search) next.set('search', search); else next.delete('search');
        next.delete('page');
        return next;
      }, { replace: true });
    }, 250);
    return () => window.clearTimeout(timer);
  }, [search, setParams]);
  const page = Number(params.get('page') ?? 1);
  const limit = Number(params.get('limit') ?? 25);
  const listParams: ListParams = { page, limit, search: params.get('search') ?? undefined, sort: params.get('sort') ?? undefined, order: params.get('order') === 'DESC' ? 'DESC' : 'ASC' };
  function setParam(key: string, value: string | undefined) {
    setParams((current) => { const next = new URLSearchParams(current); if (value) next.set(key, value); else next.delete(key); if (key !== 'page') next.delete('page'); return next; });
  }
  return { params, setParams, listParams, search, setSearch, setParam, page, limit };
}

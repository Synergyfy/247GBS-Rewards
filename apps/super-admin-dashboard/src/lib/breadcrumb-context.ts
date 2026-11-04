import { createContext, useContext, useEffect } from 'react';

export interface Crumb {
  label: string;
  to?: string;
}

interface BreadcrumbState {
  crumbs: Crumb[] | null;
  setCrumbs: (crumbs: Crumb[] | null) => void;
}

export const BreadcrumbContext = createContext<BreadcrumbState>({ crumbs: null, setCrumbs: () => {} });

export function useCurrentCrumbs(): Crumb[] | null {
  return useContext(BreadcrumbContext).crumbs;
}

/**
 * Detail pages publish their ownership chain (§9B: `Admins / Jane Doe / Acme Coffee / Summer Promo`)
 * to the top bar. Pass `null` while data is loading; crumbs are cleared when the page unmounts.
 */
export function useBreadcrumbs(crumbs: Crumb[] | null): void {
  const { setCrumbs } = useContext(BreadcrumbContext);
  // Serialized so a new array with the same content doesn't re-trigger the effect
  const key = crumbs ? JSON.stringify(crumbs) : '';
  useEffect(() => {
    setCrumbs(key ? (JSON.parse(key) as Crumb[]) : null);
    return () => setCrumbs(null);
  }, [key, setCrumbs]);
}

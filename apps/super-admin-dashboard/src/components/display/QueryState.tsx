import type { ReactNode } from 'react';
import { isNotAvailable } from '@/lib/errors';
import { ErrorState, NotAvailableYet, NotAuthorized } from './States';

export function QueryState({ loading, error, retry, children, section }: { loading: boolean; error: Error | null; retry: () => void; children: ReactNode; section: string }) {
  if (error) {
    const status = (error as Error & { status?: number }).status;
    if (status === 403) return <NotAuthorized />;
    if (isNotAvailable(error)) return <NotAvailableYet section={section} />;
    return <ErrorState message={error.message} retry={retry} />;
  }
  if (loading) return <div className="panel panel-body" aria-label={`Loading ${section}`}><div className="skeleton" style={{ height: 22, marginBottom: 8 }} /><div className="skeleton" style={{ height: 150 }} /></div>;
  return <>{children}</>;
}

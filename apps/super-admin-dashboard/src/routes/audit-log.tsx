import { useState } from 'react';
import { DataTable, type Column } from '@/components/data/DataTable';
import { FilterBar } from '@/components/data/FilterBar';
import { PageHeader } from '@/components/display/PageHeader';
import { QueryState } from '@/components/display/QueryState';
import { useUrlState } from '@/hooks/useUrlState';
import { shortDate } from '@/lib/format';
import { useAuditLogs } from '@/services/hooks';
import type { AuditLogEntry } from '@/services/types';

export function AuditLogList() {
  const state = useUrlState();
  const query = useAuditLogs(state.listParams);
  const [expanded, setExpanded] = useState<string | null>(null);
  const columns: Column<AuditLogEntry>[] = [
    { key: 'created_at', label: 'Timestamp', render: (row) => shortDate(row.created_at) },
    {
      key: 'actor',
      label: 'Actor',
      render: (row) => <span title={row.actor.email}>{row.actor.fullName}</span>,
    },
    { key: 'action', label: 'Action', render: (row) => row.action.replaceAll('.', ' ') },
    {
      key: 'targetType',
      label: 'Target',
      render: (row) => <span className="cell-muted">{row.targetType}</span>,
    },
    {
      key: 'targetId',
      label: 'Target ID',
      render: (row) => <span className="tabular">{row.targetId.slice(0, 8)}…</span>,
    },
    {
      key: 'payload',
      label: 'Payload',
      render: (row) => (
        <div>
          <button className="button" onClick={() => setExpanded(expanded === row.id ? null : row.id)}>
            {expanded === row.id ? 'Hide JSON' : 'Expand JSON'}
          </button>
          {expanded === row.id && (
            <pre style={{ whiteSpace: 'pre-wrap', maxWidth: 260 }}>
              {JSON.stringify(row.payload, null, 2)}
            </pre>
          )}
        </div>
      ),
    },
  ];
  return (
    <>
      <PageHeader title="Audit log" description="Who changed what across the platform." />
      <FilterBar placeholder="Search actor, action or target…" />
      <QueryState
        loading={query.isLoading}
        error={query.error as Error | null}
        retry={() => void query.refetch()}
        section="audit log"
      >
        <DataTable
          columns={columns}
          rows={query.data?.data ?? []}
          rowId={(row) => row.id}
          total={query.data?.total ?? 0}
          page={state.page}
          pageSize={state.limit}
          onPageChange={(page) => state.setParam('page', String(page))}
          onPageSizeChange={(limit) => state.setParam('limit', String(limit))}
        />
      </QueryState>
    </>
  );
}

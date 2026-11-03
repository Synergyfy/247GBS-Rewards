import { Link } from 'react-router';
import { DataTable, type Column } from '@/components/data/DataTable';
import { FilterBar } from '@/components/data/FilterBar';
import { PageHeader } from '@/components/display/PageHeader';
import { QueryState } from '@/components/display/QueryState';
import { useUrlState } from '@/hooks/useUrlState';
import { shortDate } from '@/lib/format';
import { useTransactions } from '@/services/hooks';
import type { PointsLedgerEntry } from '@/services/types';

export function TransactionsList() {
  const state = useUrlState();
  const kind = state.params.get('kind') as 'earn' | 'redeem' | null;
  const query = useTransactions({ ...state.listParams, kind: kind ?? undefined });
  const columns: Column<PointsLedgerEntry>[] = [
    { key: 'created_at', label: 'Date', render: (row) => shortDate(row.created_at) },
    {
      key: 'customer',
      label: 'Customer',
      render: (row) =>
        row.customer ? (
          <Link className="inline-link" to={`/customers/${row.customer.id}`}>
            {row.customer.firstName} {row.customer.lastName}
          </Link>
        ) : (
          '—'
        ),
    },
    { key: 'campaign', label: 'Campaign', render: (row) => row.campaign?.name ?? '—' },
    { key: 'description', label: 'Description', render: (row) => row.description },
    {
      key: 'points',
      label: 'Points',
      render: (row) => (
        <span className="tabular" style={{ color: row.points < 0 ? 'var(--destructive)' : 'var(--success)' }}>
          {row.points > 0 ? '+' : ''}
          {row.points.toLocaleString()}
        </span>
      ),
    },
  ];
  return (
    <>
      <PageHeader title="Transactions" description="Cross-tenant points ledger entries." />
      <FilterBar placeholder="Search customers or descriptions…">
        <select
          className="select"
          aria-label="Transaction kind"
          value={kind ?? ''}
          onChange={(event) => state.setParam('kind', event.target.value || undefined)}
        >
          <option value="">All activity</option>
          <option value="earn">Earned</option>
          <option value="redeem">Redeemed</option>
        </select>
      </FilterBar>
      <QueryState
        loading={query.isLoading}
        error={query.error as Error | null}
        retry={() => void query.refetch()}
        section="transactions"
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

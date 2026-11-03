import { Link } from 'react-router';
import { DataTable, type Column } from '@/components/data/DataTable';
import { FilterBar } from '@/components/data/FilterBar';
import { PageHeader } from '@/components/display/PageHeader';
import { QueryState } from '@/components/display/QueryState';
import { StatusBadge } from '@/components/display/States';
import { useUrlState } from '@/hooks/useUrlState';
import { currency, shortDate } from '@/lib/format';
import { usePayments } from '@/services/hooks';
import type { PaymentHistory } from '@/services/types';

export function PaymentsList() {
  const state = useUrlState();
  const status = state.params.get('status') as PaymentHistory['status'] | null;
  const query = usePayments({ ...state.listParams, status: status ?? undefined });
  const columns: Column<PaymentHistory>[] = [
    {
      key: 'user',
      label: 'Account',
      render: (row) =>
        row.user ? (
          <Link className="cell-link" to={`/admins/${row.user.id}`}>
            {row.user.fullName}
          </Link>
        ) : (
          '—'
        ),
    },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
    { key: 'type', label: 'Type', render: (row) => <StatusBadge value={row.type} /> },
    {
      key: 'amount',
      label: 'Amount',
      render: (row) => <span className="tabular">{currency(row.amount)}</span>,
    },
    { key: 'created_at', label: 'Date', render: (row) => shortDate(row.created_at) },
  ];
  return (
    <>
      <PageHeader title="Payments" description="Subscription and balance payment history." />
      <FilterBar placeholder="Search account or payment…">
        <select
          className="select"
          aria-label="Payment status"
          value={status ?? ''}
          onChange={(event) => state.setParam('status', event.target.value || undefined)}
        >
          <option value="">All statuses</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </FilterBar>
      <QueryState
        loading={query.isLoading}
        error={query.error as Error | null}
        retry={() => void query.refetch()}
        section="payments"
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

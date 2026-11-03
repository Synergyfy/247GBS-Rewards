import { Link } from 'react-router';
import { DataTable, type Column } from '@/components/data/DataTable';
import { FilterBar } from '@/components/data/FilterBar';
import { PageHeader } from '@/components/display/PageHeader';
import { QueryState } from '@/components/display/QueryState';
import { useUrlState } from '@/hooks/useUrlState';
import { shortDate } from '@/lib/format';
import { useCustomers } from '@/services/hooks';
import type { Customer } from '@/services/types';

export function CustomersList() {
  const state = useUrlState();
  const query = useCustomers(state.listParams);
  const columns: Column<Customer>[] = [
    {
      key: 'name',
      label: 'Customer',
      render: (row) => (
        <Link className="cell-link" to={`/customers/${row.id}`}>
          {row.firstName} {row.lastName}
        </Link>
      ),
    },
    { key: 'email', label: 'Email', render: (row) => row.email },
    {
      key: 'campaign',
      label: 'Campaign',
      render: (row) =>
        row.campaign ? (
          <Link className="inline-link" to={`/campaigns/${row.campaign.id}`}>
            {row.campaign.name}
          </Link>
        ) : (
          '—'
        ),
    },
    {
      key: 'balance',
      label: 'Balance',
      render: (row) => <span className="tabular">{(row.balance ?? 0).toLocaleString()} pts</span>,
    },
    { key: 'created_at', label: 'Joined', render: (row) => shortDate(row.created_at) },
  ];
  return (
    <>
      <PageHeader title="Customers" description="Customer membership, balances and campaign joins." />
      <FilterBar placeholder="Search customer email or name…" />
      <QueryState
        loading={query.isLoading}
        error={query.error as Error | null}
        retry={() => void query.refetch()}
        section="customers"
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

import { Eye, Megaphone } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { DataTable, type Column } from '@/components/data/DataTable';
import { FilterBar } from '@/components/data/FilterBar';
import { PageHeader } from '@/components/display/PageHeader';
import { QueryState } from '@/components/display/QueryState';
import { useUrlState } from '@/hooks/useUrlState';
import { shortDate } from '@/lib/format';
import { useCustomers } from '@/services/hooks';
import type { Customer } from '@/services/types';

export function CustomersList() {
  const navigate = useNavigate();
  const state = useUrlState();
  const query = useCustomers(state.listParams);
  const columns: Column<Customer>[] = [
    {
      key: 'firstName',
      sortable: true,
      label: 'Customer',
      render: (row) => (
        <Link className="cell-link" to={`/customers/${row.id}`}>
          {row.firstName} {row.lastName}
        </Link>
      ),
    },
    { key: 'email', sortable: true, mobile: false, label: 'Email', render: (row) => row.email },
    {
      key: 'campaign',
      mobile: false,
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
      sortable: true,
      align: 'right',
      label: 'Balance',
      render: (row) => <span className="tabular">{(row.balance ?? 0).toLocaleString()} pts</span>,
    },
    {
      key: 'created_at',
      sortable: true,
      mobile: false,
      label: 'Joined',
      render: (row) => shortDate(row.created_at),
    },
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
          tableId="customers"
          columns={columns}
          rows={query.data?.data ?? []}
          rowId={(row) => row.id}
          total={query.data?.total ?? 0}
          {...state.tableProps}
          loading={query.isFetching}
          rowActions={(row) => [
            { label: 'View details', icon: <Eye />, onSelect: () => navigate(`/customers/${row.id}`) },
            ...(row.campaign
              ? [
                  {
                    label: 'View campaign',
                    icon: <Megaphone />,
                    onSelect: () => navigate(`/campaigns/${row.campaign!.id}`),
                  },
                ]
              : []),
          ]}
        />
      </QueryState>
    </>
  );
}

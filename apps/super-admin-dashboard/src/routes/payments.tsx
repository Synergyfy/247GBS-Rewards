import { NativeSelect } from '@/components/ui/native-select';
import { ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
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
  const navigate = useNavigate();
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
    { key: 'status', sortable: true, label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
    {
      key: 'type',
      sortable: true,
      mobile: false,
      label: 'Type',
      render: (row) => <StatusBadge value={row.type} />,
    },
    {
      key: 'amount',
      sortable: true,
      align: 'right',
      label: 'Amount',
      render: (row) => <span className="tabular-nums">{currency(row.amount)}</span>,
    },
    {
      key: 'created_at',
      sortable: true,
      mobile: false,
      label: 'Date',
      render: (row) => shortDate(row.created_at),
    },
  ];
  return (
    <>
      <PageHeader title="Payments" description="Subscription and balance payment history." />
      <FilterBar placeholder="Search account or payment…">
        <NativeSelect
          
          aria-label="Payment status"
          value={status ?? ''}
          onChange={(event) => state.setParam('status', event.target.value || undefined)}
        >
          <option value="">All statuses</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </NativeSelect>
      </FilterBar>
      <QueryState
        loading={query.isLoading}
        error={query.error as Error | null}
        retry={() => void query.refetch()}
        section="payments"
      >
        <DataTable
          tableId="payments"
          columns={columns}
          rows={query.data?.data ?? []}
          rowId={(row) => row.id}
          total={query.data?.total ?? 0}
          {...state.tableProps}
          loading={query.isFetching}
          rowActions={(row) =>
            row.user
              ? [
                  {
                    label: 'View account',
                    icon: <ShieldCheck />,
                    onSelect: () => navigate(`/admins/${row.user!.id}`),
                  },
                ]
              : []
          }
        />
      </QueryState>
    </>
  );
}

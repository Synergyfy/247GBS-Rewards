import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router';
import { Eye, KeyRound, Power, PowerOff, Trash2 } from 'lucide-react';
import { DataTable, type Column } from '@/components/data/DataTable';
import { FilterBar } from '@/components/data/FilterBar';
import { PageHeader } from '@/components/display/PageHeader';
import { QueryState } from '@/components/display/QueryState';
import { StatusBadge } from '@/components/display/States';
import { useAdminActions } from '@/components/features/admins/useAdminActions';
import { useUrlState } from '@/hooks/useUrlState';
import { shortDate } from '@/lib/format';
import { useAdmins } from '@/services/hooks';
import type { UserRow } from '@/services/types';

const columns: Column<UserRow>[] = [
  {
    key: 'fullName',
    label: 'Admin',
    sortable: true,
    render: (row) => (
      <span className="identity">
        <span className="avatar">
          {row.fullName
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)}
        </span>
        <span className="identity-copy">
          <Link className="cell-link identity-name" to={`/admins/${row.id}`}>
            {row.fullName}
          </Link>
          <span className="identity-meta">{row.email}</span>
        </span>
      </span>
    ),
  },
  {
    key: 'isActive',
    label: 'Status',
    render: (row) => <StatusBadge value={row.isActive ?? true} />,
    csv: (row) => (row.isActive === false ? 'inactive' : 'active'),
  },
  { key: 'phoneNumber', label: 'Phone', render: (row) => row.phoneNumber, mobile: false },
  {
    key: 'signupSource',
    label: 'Source',
    sortable: true,
    render: (row) => <StatusBadge value={row.signupSource} />,
    mobile: false,
  },
  {
    key: 'businessCount',
    label: 'Businesses',
    sortable: true,
    align: 'right',
    render: (row) => row.businessCount,
  },
  {
    key: 'campaignCount',
    label: 'Campaigns',
    sortable: true,
    align: 'right',
    render: (row) => row.campaignCount,
    mobile: false,
  },
  {
    key: 'customerCount',
    label: 'Customers',
    sortable: true,
    align: 'right',
    render: (row) => row.customerCount.toLocaleString(),
    mobile: false,
  },
  {
    key: 'created_at',
    label: 'Created',
    sortable: true,
    render: (row) => shortDate(row.created_at),
    mobile: false,
  },
];

export function AdminsList() {
  const state = useUrlState();
  const navigate = useNavigate();
  const query = useAdmins(state.listParams);
  const actions = useAdminActions({ afterDelete: () => void query.refetch() });
  return (
    <>
      <PageHeader
        title="Admins"
        description="Business-owner accounts and their platform footprint."
      />
      <FilterBar placeholder="Search name, email, phone…" />
      <QueryState
        loading={query.isLoading}
        error={query.error as Error | null}
        retry={() => void query.refetch()}
        section="admins"
      >
        <DataTable
          tableId="admins"
          columns={columns}
          rows={query.data?.data ?? []}
          rowId={(row) => row.id}
          total={query.data?.total ?? 0}
          loading={query.isFetching}
          {...state.tableProps}
          rowActions={(row) => {
            const active = row.isActive ?? true;
            return [
              { label: 'View details', icon: <Eye />, onSelect: () => navigate(`/admins/${row.id}`) },
              {
                label: active ? 'Deactivate' : 'Activate',
                icon: active ? <PowerOff /> : <Power />,
                onSelect: () => void actions.setStatus([row], !active),
              },
              { label: 'Reset password…', icon: <KeyRound />, onSelect: () => actions.requestReset(row) },
              {
                label: 'Delete…',
                icon: <Trash2 />,
                destructive: true,
                onSelect: () => actions.requestDelete(row),
              },
            ];
          }}
          bulkActions={(selected, clear) => (
            <>
              <Button variant="outline" onClick={() => void actions.setStatus(selected, true).then(clear)}>
                <Power />
                Activate
              </Button>
              <Button variant="outline" onClick={() => void actions.setStatus(selected, false).then(clear)}>
                <PowerOff />
                Deactivate
              </Button>
            </>
          )}
        />
      </QueryState>
      {actions.dialogs}
    </>
  );
}

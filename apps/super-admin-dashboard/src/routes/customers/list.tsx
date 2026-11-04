import { Eye, Megaphone } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { DataTable, type Column } from '@/components/data/DataTable';
import { FilterBar } from '@/components/data/FilterBar';
import { PageHeader } from '@/components/display/PageHeader';
import { QueryState } from '@/components/display/QueryState';
import { useUrlState } from '@/hooks/useUrlState';
import { shortDate } from '@/lib/format';
import { useCustomers } from '@/services/hooks';
import type { CustomerRow } from '@/services/types';
import { CampaignMemberships } from '@/components/features/customers/CampaignMemberships';
import { membershipsCsv } from '@/lib/customers';

export function CustomersList() {
  const navigate = useNavigate();
  const state = useUrlState();
  const query = useCustomers(state.listParams);
  const columns: Column<CustomerRow>[] = [
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
      key: 'campaigns',
      mobile: false,
      label: 'Campaigns',
      render: (row) => <CampaignMemberships memberships={row.memberships} />,
      csv: (row) => membershipsCsv(row.memberships),
    },
    {
      key: 'campaignCount',
      sortable: true,
      mobile: false,
      align: 'right',
      label: 'Joined',
      render: (row) => <span className="tabular-nums">{row.campaignCount}</span>,
    },
    {
      key: 'balance',
      sortable: true,
      align: 'right',
      // Summed across every campaign; the "+N" popover breaks it down per campaign
      label: 'Total balance',
      render: (row) => <span className="tabular-nums">{row.balance.toLocaleString()} pts</span>,
    },
    {
      key: 'created_at',
      sortable: true,
      mobile: false,
      label: 'First joined',
      render: (row) => shortDate(row.created_at),
    },
  ];
  return (
    <>
      <PageHeader title="Customers" description="One row per customer, with every campaign they have joined." />
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
            // One campaign: jump straight to it. Several: the "+N" popover in the row lists them.
            ...(row.memberships.length === 1 && row.memberships[0]?.campaign
              ? [
                  {
                    label: 'View campaign',
                    icon: <Megaphone />,
                    onSelect: () => navigate(`/campaigns/${row.memberships[0]!.campaign!.id}`),
                  },
                ]
              : []),
          ]}
        />
      </QueryState>
    </>
  );
}

import { NativeSelect } from '@/components/ui/native-select';
import { Button } from '@/components/ui/button';
import { useCampaignActions } from '@/components/features/campaigns/useCampaignActions';
import { appEnv } from '@/lib/env';
import { ExternalLink, Eye, Power, PowerOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { DataTable, type Column } from '@/components/data/DataTable';
import { FilterBar } from '@/components/data/FilterBar';
import { PageHeader } from '@/components/display/PageHeader';
import { QueryState } from '@/components/display/QueryState';
import { StatusBadge } from '@/components/display/States';
import { useUrlState } from '@/hooks/useUrlState';
import { shortDate } from '@/lib/format';
import { useCampaigns } from '@/services/hooks';
import type { Campaign, CampaignType } from '@/services/types';

export function CampaignsList() {
  const navigate = useNavigate();
  const campaignActions = useCampaignActions();
  const state = useUrlState();
  const type = state.params.get('type') as CampaignType | null;
  const query = useCampaigns({
    ...state.listParams,
    type: type ?? undefined,
    active: state.params.has('active') ? state.params.get('active') === 'true' : undefined,
  });
  const columns: Column<Campaign>[] = [
    {
      key: 'name',
      sortable: true,
      label: 'Campaign',
      render: (row) => (
        <Link className="cell-link" to={`/campaigns/${row.id}`}>
          {row.name}
        </Link>
      ),
    },
    {
      key: 'business',
      mobile: false,
      label: 'Business',
      render: (row) =>
        row.business ? (
          <Link className="inline-link" to={`/businesses/${row.business.id}`}>
            {row.business.name}
          </Link>
        ) : (
          '—'
        ),
    },
    { key: 'type', sortable: true, label: 'Type', render: (row) => <StatusBadge value={row.type} /> },
    {
      key: 'isActive',
      sortable: true,
      label: 'Status',
      render: (row) => <StatusBadge value={row.isActive} />,
    },
    {
      key: 'uniqueCode',
      sortable: true,
      mobile: false,
      label: 'Code',
      render: (row) => <span className="tabular-nums">{row.uniqueCode}</span>,
    },
    {
      key: 'created_at',
      sortable: true,
      mobile: false,
      label: 'Created',
      render: (row) => shortDate(row.created_at),
    },
  ];
  return (
    <>
      <PageHeader title="Campaigns" description="Loyalty programs across all businesses." />
      <FilterBar placeholder="Search campaign or unique code…">
        <NativeSelect
          
          aria-label="Campaign type"
          value={type ?? ''}
          onChange={(event) => state.setParam('type', event.target.value || undefined)}
        >
          <option value="">All types</option>
          <option value="PRESET">Preset</option>
          <option value="CO_BRANDED">Co-branded</option>
          <option value="SEASONAL">Seasonal</option>
        </NativeSelect>
        <NativeSelect
          
          aria-label="Campaign status"
          value={state.params.get('active') ?? ''}
          onChange={(event) => state.setParam('active', event.target.value || undefined)}
        >
          <option value="">All status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </NativeSelect>
      </FilterBar>
      <QueryState
        loading={query.isLoading}
        error={query.error as Error | null}
        retry={() => void query.refetch()}
        section="campaigns"
      >
        <DataTable
          tableId="campaigns"
          columns={columns}
          rows={query.data?.data ?? []}
          rowId={(row) => row.id}
          total={query.data?.total ?? 0}
          {...state.tableProps}
          loading={query.isFetching}
          rowActions={(row) => [
            { label: 'View details', icon: <Eye />, onSelect: () => navigate(`/campaigns/${row.id}`) },
            {
              label: 'Open public page',
              icon: <ExternalLink />,
              onSelect: () =>
                window.open(
                  `${appEnv.WEB_APP_URL}/campaign/${row.uniqueCode}`,
                  '_blank',
                  'noopener,noreferrer',
                ),
            },
            {
              label: row.isActive === false ? 'Activate' : 'Deactivate',
              icon: row.isActive === false ? <Power /> : <PowerOff />,
              onSelect: () => void campaignActions.setStatus([row], row.isActive === false),
            },
          ]}
          bulkActions={(selected, clear) => (
            <>
              <Button
                variant="outline"
                onClick={() => void campaignActions.setStatus(selected, true).then(clear)}
              >
                <Power />
                Activate
              </Button>
              <Button
                variant="outline"
                onClick={() => void campaignActions.setStatus(selected, false).then(clear)}
              >
                <PowerOff />
                Deactivate
              </Button>
            </>
          )}
        />
      </QueryState>
    </>
  );
}

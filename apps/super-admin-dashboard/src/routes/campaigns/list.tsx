import { Link } from 'react-router';
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
      label: 'Campaign',
      render: (row) => (
        <Link className="cell-link" to={`/campaigns/${row.id}`}>
          {row.name}
        </Link>
      ),
    },
    {
      key: 'business',
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
    { key: 'type', label: 'Type', render: (row) => <StatusBadge value={row.type} /> },
    { key: 'isActive', label: 'Status', render: (row) => <StatusBadge value={row.isActive} /> },
    { key: 'uniqueCode', label: 'Code', render: (row) => <span className="tabular">{row.uniqueCode}</span> },
    { key: 'created_at', label: 'Created', render: (row) => shortDate(row.created_at) },
  ];
  return (
    <>
      <PageHeader title="Campaigns" description="Loyalty programs across all businesses." />
      <FilterBar placeholder="Search campaign or unique code…">
        <select
          className="select"
          aria-label="Campaign type"
          value={type ?? ''}
          onChange={(event) => state.setParam('type', event.target.value || undefined)}
        >
          <option value="">All types</option>
          <option value="PRESET">Preset</option>
          <option value="CO_BRANDED">Co-branded</option>
          <option value="SEASONAL">Seasonal</option>
        </select>
        <select
          className="select"
          aria-label="Campaign status"
          value={state.params.get('active') ?? ''}
          onChange={(event) => state.setParam('active', event.target.value || undefined)}
        >
          <option value="">All status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </FilterBar>
      <QueryState
        loading={query.isLoading}
        error={query.error as Error | null}
        retry={() => void query.refetch()}
        section="campaigns"
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

import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Copy, Trash2 } from 'lucide-react';
import { PageHeader, KpiStrip } from '@/components/display/PageHeader';
import { QueryState } from '@/components/display/QueryState';
import { StatusBadge } from '@/components/display/States';
import { Properties } from '@/components/display/Properties';
import { DetailTabs } from '@/components/display/DetailTabs';
import { DangerZone } from '@/components/display/DangerZone';
import { ConfirmActionDialog } from '@/components/dialogs/ConfirmActionDialog';
import { DataTable, type Column } from '@/components/data/DataTable';
import { superAdminApi } from '@/services';
import { useBusiness, useCustomers } from '@/services/hooks';
import { shortDate } from '@/lib/format';
import { useBreadcrumbs } from '@/lib/breadcrumb-context';
import type { Campaign, Season, Segment, Staff } from '@/services/types';

const campaignColumns: Column<Campaign>[] = [
  {
    key: 'name',
    label: 'Campaign',
    render: (row) => (
      <Link className="cell-link" to={`/campaigns/${row.id}`}>
        {row.name}
      </Link>
    ),
  },
  { key: 'type', label: 'Type', render: (row) => <StatusBadge value={row.type} /> },
  { key: 'isActive', label: 'Status', render: (row) => <StatusBadge value={row.isActive} /> },
  { key: 'uniqueCode', label: 'Code', render: (row) => <span className="tabular">{row.uniqueCode}</span> },
  { key: 'created_at', label: 'Created', render: (row) => shortDate(row.created_at) },
];

const staffColumns: Column<Staff>[] = [
  {
    key: 'name',
    label: 'Staff member',
    render: (row) => (
      <span className="identity">
        <span className="avatar">{row.name.slice(0, 1)}</span>
        {row.name}
      </span>
    ),
  },
  { key: 'email', label: 'Email', render: (row) => row.email },
  { key: 'isActive', label: 'Status', render: (row) => <StatusBadge value={row.isActive} /> },
  { key: 'created_at', label: 'Added', render: (row) => shortDate(row.created_at) },
];

const segmentColumns: Column<Segment>[] = [
  { key: 'name', label: 'Segment', render: (row) => row.name },
  { key: 'created_at', label: 'Created', render: (row) => shortDate(row.created_at) },
];

const seasonColumns: Column<Season>[] = [
  { key: 'name', label: 'Season', render: (row) => row.name },
  { key: 'startDate', label: 'Starts', render: (row) => shortDate(row.startDate) },
  { key: 'endDate', label: 'Ends', render: (row) => shortDate(row.endDate) },
];

export function BusinessDetail() {
  const { id = '' } = useParams();
  const query = useBusiness(id);
  // Only the total is needed for the KPI strip
  const customers = useCustomers({ businessId: id, page: 1, limit: 1 });
  const [deleteOpen, setDeleteOpen] = useState(false);
  const client = useQueryClient();
  const navigate = useNavigate();
  const business = query.data;

  useBreadcrumbs(
    business
      ? [
          { label: 'Admins', to: '/admins' },
          ...(business.user ? [{ label: business.user.fullName, to: `/admins/${business.user.id}` }] : []),
          { label: business.name },
        ]
      : null,
  );

  return (
    <QueryState loading={query.isLoading} error={query.error as Error | null} retry={() => void query.refetch()} section="business detail">
      {business && (
        <>
          <PageHeader
            title={business.name}
            description={business.email}
            actions={
              <button
                className="button"
                onClick={() => navigator.clipboard.writeText(business.id).then(() => toast.success('ID copied'))}
              >
                <Copy />
                Copy ID
              </button>
            }
          />
          <KpiStrip
            items={[
              { label: 'Campaigns', value: business.campaigns?.length ?? 0 },
              { label: 'Staff (active)', value: business.staffs?.filter((staff) => staff.isActive).length ?? 0 },
              { label: 'Customers', value: customers.data?.total ?? '—' },
              { label: 'Points issued', value: '—' },
            ]}
          />
          <div className="detail-grid">
            <section className="panel">
              <DetailTabs
                label="Business records"
                tabs={[
                  {
                    value: 'campaigns',
                    label: 'Campaigns',
                    count: business.campaigns?.length ?? 0,
                    content: <DataTable columns={campaignColumns} rows={business.campaigns ?? []} rowId={(row) => row.id} emptyTitle="No campaigns yet" />,
                  },
                  {
                    value: 'staff',
                    label: 'Staff',
                    count: business.staffs?.length ?? 0,
                    content: <DataTable columns={staffColumns} rows={business.staffs ?? []} rowId={(row) => row.id} emptyTitle="No staff yet" />,
                  },
                  {
                    value: 'segments',
                    label: 'Segments',
                    count: business.segments?.length ?? 0,
                    content: <DataTable columns={segmentColumns} rows={business.segments ?? []} rowId={(row) => row.id} emptyTitle="No segments" />,
                  },
                  {
                    value: 'seasons',
                    label: 'Seasons',
                    count: business.seasons?.length ?? 0,
                    content: <DataTable columns={seasonColumns} rows={business.seasons ?? []} rowId={(row) => row.id} emptyTitle="No seasons" />,
                  },
                ]}
              />
            </section>
            <div>
              <Properties
                items={[
                  [
                    'Owner',
                    business.user ? (
                      <Link className="inline-link" to={`/admins/${business.user.id}`}>
                        {business.user.fullName}
                      </Link>
                    ) : (
                      '—'
                    ),
                  ],
                  ['Email', business.email],
                  ['Phone', business.phoneNumber],
                  ['Website', business.website],
                  [
                    'Address',
                    business.address ? `${business.address.street}, ${business.address.city}, ${business.address.state}` : null,
                  ],
                  ['Created', shortDate(business.created_at)],
                  ['Social links', business.links?.length ?? 0],
                ]}
              />
              <DangerZone
                description={`Deleting this business also removes its ${business.campaigns?.length ?? 0} campaigns, staff, segments, seasons and links. Customers of those campaigns may be removed.`}
              >
                <button className="button danger" onClick={() => setDeleteOpen(true)}>
                  <Trash2 />
                  Delete business
                </button>
              </DangerZone>
              <details className="panel panel-body" style={{ marginTop: 12 }}>
                <summary>Technical details</summary>
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: 10 }}>{JSON.stringify(business, null, 2)}</pre>
              </details>
            </div>
          </div>
          <ConfirmActionDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            title="Delete business"
            description={`This cascades to ${business.campaigns?.length ?? 0} campaigns, staff, segments, seasons and links. Related customers may be removed. Enter the business name to continue.`}
            requiredText={business.name}
            confirmLabel="Delete business"
            onConfirm={(reason) =>
              void superAdminApi.deleteBusiness(id, reason).then(async () => {
                await client.invalidateQueries({ queryKey: ['businesses'] });
                toast.success('Business and related records deleted');
                navigate('/businesses');
              })
            }
          />
        </>
      )}
    </QueryState>
  );
}

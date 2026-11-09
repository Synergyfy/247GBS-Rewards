import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Copy, Pencil, Power, PowerOff, Trash2 } from 'lucide-react';
import { PageHeader, KpiStrip } from '@/components/display/PageHeader';
import { QueryState } from '@/components/display/QueryState';
import { StatusBadge } from '@/components/display/States';
import { Properties } from '@/components/display/Properties';
import { DetailTabs } from '@/components/display/DetailTabs';
import { DangerZone } from '@/components/display/DangerZone';
import { ConfirmActionDialog } from '@/components/dialogs/ConfirmActionDialog';
import { EditFieldsDialog } from '@/components/dialogs/EditFieldsDialog';
import { DataTable, type Column } from '@/components/data/DataTable';
import { superAdminApi } from '@/services';
import { useBusiness, useBusinessAnalytics, useCustomers, useUpdateBusiness, useUpdateStaff } from '@/services/hooks';
import { compact, shortDate } from '@/lib/format';
import { useBreadcrumbs } from '@/lib/breadcrumb-context';
import type { Business, BusinessUpdateInput, Campaign, Season, Segment, Staff } from '@/services/types';

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
  { key: 'uniqueCode', label: 'Code', render: (row) => <span className="tabular-nums">{row.uniqueCode}</span> },
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

const ADDRESS_KEYS = ['street', 'postalCode', 'city', 'state'] as const;

function businessFields(business: Business) {
  return [
    { name: 'name', label: 'Business name', value: business.name, required: true },
    { name: 'email', label: 'Email', value: business.email, type: 'email' as const, required: true },
    { name: 'phoneNumber', label: 'Phone', value: business.phoneNumber, type: 'tel' as const, required: true },
    { name: 'website', label: 'Website', value: business.website, type: 'url' as const },
    { name: 'street', label: 'Street', value: business.address?.street, group: 'Address' },
    { name: 'city', label: 'City', value: business.address?.city },
    { name: 'state', label: 'State / county', value: business.address?.state },
    { name: 'postalCode', label: 'Postal code', value: business.address?.postalCode },
  ];
}

/** Address columns are all required server-side, so any address change sends the whole address. */
function businessChanges(business: Business, changes: Record<string, string | null>): BusinessUpdateInput {
  const input = Object.fromEntries(
    Object.entries(changes).filter(([key]) => !(ADDRESS_KEYS as readonly string[]).includes(key)),
  ) as BusinessUpdateInput;
  if (ADDRESS_KEYS.some((key) => key in changes)) {
    const current = business.address;
    const pick = (key: (typeof ADDRESS_KEYS)[number]) => (key in changes ? (changes[key] ?? '') : (current?.[key] ?? ''));
    input.address = { street: pick('street'), postalCode: pick('postalCode'), city: pick('city'), state: pick('state') };
  }
  return input;
}

export function BusinessDetail() {
  const { id = '' } = useParams();
  const query = useBusiness(id);
  // People (grouped by email) for the KPI strip; analytics counts campaign memberships
  const customers = useCustomers({ businessId: id, page: 1, limit: 1 });
  const analytics = useBusinessAnalytics(id);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const updateBusiness = useUpdateBusiness();
  const updateStaff = useUpdateStaff(id);
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
              <>
                <Button variant="outline" onClick={() => setEditOpen(true)}>
                  <Pencil />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigator.clipboard.writeText(business.id).then(() => toast.success('ID copied'))}
                >
                  <Copy />
                  Copy ID
                </Button>
              </>
            }
          />
          <KpiStrip
            items={[
              { label: 'Campaigns', value: business.campaigns?.length ?? 0 },
              { label: 'Staff (active)', value: business.staffs?.filter((staff) => staff.isActive).length ?? 0 },
              { label: 'Customers', value: customers.data?.total ?? '—' },
              { label: 'Points issued', value: analytics.data ? compact(analytics.data.totalPointsIssued) : '—' },
              { label: 'Rewards redeemed', value: analytics.data?.totalRewardsRedeemed ?? '—' },
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
                    content: (
                      <DataTable
                        columns={staffColumns}
                        rows={business.staffs ?? []}
                        rowId={(row) => row.id}
                        emptyTitle="No staff yet"
                        rowActions={(row) => [
                          { label: 'Edit details', icon: <Pencil />, onSelect: () => setEditingStaff(row) },
                          {
                            label: row.isActive ? 'Deactivate' : 'Activate',
                            icon: row.isActive ? <PowerOff /> : <Power />,
                            onSelect: () => updateStaff.mutate({ id: row.id, input: { isActive: !row.isActive } }),
                          },
                        ]}
                      />
                    ),
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
                    business.address
                      ? [business.address.street, business.address.city, business.address.state, business.address.postalCode].filter(Boolean).join(', ')
                      : null,
                  ],
                  ['Created', shortDate(business.created_at)],
                  ['Social links', business.links?.length ?? 0],
                ]}
              />
              <DangerZone
                description={`Deleting this business also removes its ${business.campaigns?.length ?? 0} campaigns, staff, segments, seasons and links. Customers of those campaigns may be removed.`}
              >
                <Button variant="outline" className="text-destructive hover:text-destructive" onClick={() => setDeleteOpen(true)}>
                  <Trash2 />
                  Delete business
                </Button>
              </DangerZone>
              <details className="panel panel-body" style={{ marginTop: 12 }}>
                <summary>Technical details</summary>
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: 10 }}>{JSON.stringify(business, null, 2)}</pre>
              </details>
            </div>
          </div>
          <EditFieldsDialog
            open={editOpen}
            onOpenChange={setEditOpen}
            title="Edit business"
            description="Changes are recorded in the audit trail."
            fields={businessFields(business)}
            onSubmit={(changes) => updateBusiness.mutateAsync({ id, input: businessChanges(business, changes) }).then(() => undefined)}
          />
          <EditFieldsDialog
            open={Boolean(editingStaff)}
            onOpenChange={(open) => !open && setEditingStaff(null)}
            title="Edit staff member"
            fields={[
              { name: 'name', label: 'Name', value: editingStaff?.name, required: true },
              { name: 'email', label: 'Email', value: editingStaff?.email, type: 'email', required: true },
            ]}
            onSubmit={(changes) =>
              updateStaff.mutateAsync({ id: editingStaff!.id, input: changes as { name?: string; email?: string } }).then(() => undefined)
            }
          />
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

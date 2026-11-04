import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { ExternalLink, Power } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { PageHeader, KpiStrip } from '@/components/display/PageHeader';
import { QueryState } from '@/components/display/QueryState';
import { StatusBadge } from '@/components/display/States';
import { Properties } from '@/components/display/Properties';
import { DetailTabs } from '@/components/display/DetailTabs';
import { DataTable, type Column } from '@/components/data/DataTable';
import { Switch } from '@/components/ui/switch';
import { useCampaign, useCampaignAnalytics, useCustomers, useRedemptions, useSetCampaignStatus } from '@/services/hooks';
import { compact, shortDate } from '@/lib/format';
import { appEnv } from '@/lib/env';
import { useBreadcrumbs } from '@/lib/breadcrumb-context';
import type { ActivityPoint, Campaign, CustomerRow, Redemption, Reward } from '@/services/types';

const rewardColumns: Column<Reward>[] = [
  { key: 'title', label: 'Reward', render: (row) => row.title },
  { key: 'pointCost', label: 'Cost', render: (row) => <span className="tabular-nums">{row.pointCost} pts</span> },
  { key: 'rewardValue', label: 'Value', render: (row) => row.rewardValue },
  { key: 'type', label: 'Type', render: (row) => <StatusBadge value={row.type} /> },
  {
    key: 'quantityRemaining',
    label: 'Remaining',
    render: (row) => (
      <span className="tabular-nums">
        {row.quantityRemaining} / {row.quantityAvailable}
      </span>
    ),
  },
  { key: 'expires', label: 'Expires', render: (row) => shortDate(row.expires) },
];

const redemptionColumns: Column<Redemption>[] = [
  { key: 'created_at', label: 'Date', render: (row) => shortDate(row.created_at) },
  {
    key: 'customer',
    label: 'Customer',
    render: (row) =>
      row.customer ? (
        <Link className="inline-link" to={`/customers/${row.customer.id}`}>
          {row.customer.firstName} {row.customer.lastName}
        </Link>
      ) : (
        '—'
      ),
  },
  { key: 'reward', label: 'Reward', render: (row) => row.reward?.title ?? row.description },
  { key: 'uniqueCode', label: 'Redemption code', render: (row) => <span className="tabular-nums">{row.uniqueCode}</span> },
];

const customerColumns: Column<CustomerRow>[] = [
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
  // The list is scoped to this campaign, so this is the balance held here
  { key: 'balance', label: 'Balance', align: 'right', render: (row) => <span className="tabular-nums">{row.balance.toLocaleString()} pts</span> },
  { key: 'created_at', label: 'Joined', render: (row) => shortDate(row.created_at) },
];

function ActivityChart({ title, series }: { title: string; series: ActivityPoint[] }) {
  return (
    <section className="panel" style={{ border: 'none' }}>
      <header className="panel-head">
        <h3 className="panel-title">{title}</h3>
      </header>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={series} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(value: string) => value.slice(5)}
              tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: 'var(--popover)',
                border: '1px solid var(--border)',
                borderRadius: 3,
                fontSize: 11,
              }}
            />
            <Bar dataKey="count" fill="var(--chart-1)" radius={[2, 2, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

/** Paged list scoped to this campaign (customers or redemptions). */
function useCampaignPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  return {
    page,
    limit,
    paging: {
      page,
      pageSize: limit,
      onPageChange: setPage,
      onPageSizeChange: (size: number) => {
        setLimit(size);
        setPage(1);
      },
    },
  };
}

function CustomersTab({ campaignId }: { campaignId: string }) {
  const { page, limit, paging } = useCampaignPage();
  const query = useCustomers({ campaignId, page, limit });
  return (
    <QueryState loading={query.isLoading} error={query.error as Error | null} retry={() => void query.refetch()} section="customers">
      <DataTable columns={customerColumns} rows={query.data?.data ?? []} rowId={(row) => row.id} total={query.data?.total ?? 0} {...paging} />
    </QueryState>
  );
}

function RedemptionsTab({ campaignId }: { campaignId: string }) {
  const { page, limit, paging } = useCampaignPage();
  const query = useRedemptions({ campaignId, page, limit });
  return (
    <QueryState loading={query.isLoading} error={query.error as Error | null} retry={() => void query.refetch()} section="redemptions">
      <DataTable
        columns={redemptionColumns}
        rows={query.data?.data ?? []}
        rowId={(row) => row.id}
        total={query.data?.total ?? 0}
        emptyTitle="No redemptions yet"
        {...paging}
      />
    </QueryState>
  );
}

/** §9B Settings: earn/redeem flags as a read-only 2×4 matrix of switches. */
function SettingsMatrix({ campaign }: { campaign: Campaign }) {
  const rows: Array<[string, Array<[string, boolean]>]> = [
    [
      'Earn',
      [
        ['Staff scans QR', campaign.earnStaffScanQR],
        ['Customer enters code', campaign.earnEnterCode],
        ['Staff personal code', campaign.earnStaffPersonalCode],
        ['Customer gives staff number', campaign.earnGiveStaffNumber],
      ],
    ],
    [
      'Redeem',
      [
        ['Staff scans QR', campaign.redeemStaffScanQR],
        ['Staff personal code', campaign.redeemStaffPersonalCode],
        ['Customer gives staff number', campaign.redeemGiveStaffNumber],
      ],
    ],
  ];
  return (
    <div className="table-wrap">
      <table>
        <tbody>
          {rows.map(([group, flags]) => (
            <tr key={group}>
              <th scope="row" style={{ width: 70 }}>
                {group}
              </th>
              {Array.from({ length: 4 }, (_, i) => {
                const flag = flags[i];
                if (!flag) return <td key={i} />;
                const [label, enabled] = flag;
                return (
                  <td key={label}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Switch size="sm" checked={enabled} disabled aria-label={`${group}: ${label}`} />
                      <span className={enabled ? undefined : 'text-muted-foreground'}>{label}</span>
                    </label>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CampaignDetail() {
  const { id = '' } = useParams();
  const query = useCampaign(id);
  const analytics = useCampaignAnalytics(id);
  const update = useSetCampaignStatus();
  const campaign = query.data;
  const publicUrl = campaign ? `${appEnv.WEB_APP_URL}/campaign/${campaign.uniqueCode}` : '';
  const business = campaign?.business;
  const owner = business?.user;

  useBreadcrumbs(
    campaign
      ? [
          { label: 'Admins', to: '/admins' },
          ...(owner ? [{ label: owner.fullName, to: `/admins/${owner.id}` }] : []),
          ...(business ? [{ label: business.name, to: `/businesses/${business.id}` }] : []),
          { label: campaign.name },
        ]
      : null,
  );

  return (
    <QueryState loading={query.isLoading} error={query.error as Error | null} retry={() => void query.refetch()} section="campaign detail">
      {campaign && (
        <>
          <PageHeader
            title={campaign.name}
            description={`${business?.name ?? 'Business'} · ${campaign.uniqueCode}`}
            actions={
              <>
                <StatusBadge value={campaign.type} />
                <StatusBadge value={campaign.isActive} />
                <Button variant="outline" onClick={() => update.mutate({ id, active: !(campaign.isActive ?? true) })}>
                  <Power />
                  {campaign.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Button asChild variant="outline">
                  <a href={publicUrl} target="_blank" rel="noreferrer">
                    <ExternalLink />
                    Public page
                  </a>
                </Button>
              </>
            }
          />
          <KpiStrip
            items={[
              { label: 'Customers', value: analytics.data?.totalCustomers ?? 0 },
              { label: 'Points issued', value: compact(analytics.data?.totalPointsIssued ?? 0) },
              { label: 'Rewards redeemed', value: analytics.data?.totalRewardsRedeemed ?? 0 },
              { label: 'Status', value: campaign.isActive ? 'Active' : 'Inactive' },
            ]}
          />
          <div className="detail-grid">
            <section className="panel">
              <DetailTabs
                label="Campaign records"
                tabs={[
                  {
                    value: 'activity',
                    label: 'Activity',
                    content: (
                      <div className="dashboard-grid">
                        <ActivityChart title="Points issued · last 7 days" series={analytics.data?.pointsActivity ?? []} />
                        <ActivityChart title="Rewards redeemed · last 7 days" series={analytics.data?.rewardsActivity ?? []} />
                      </div>
                    ),
                  },
                  {
                    value: 'rewards',
                    label: 'Rewards',
                    count: campaign.rewards?.length ?? 0,
                    content: <DataTable columns={rewardColumns} rows={campaign.rewards ?? []} rowId={(row) => row.id} emptyTitle="No rewards configured" />,
                  },
                  { value: 'customers', label: 'Customers', content: <CustomersTab campaignId={campaign.id} /> },
                  { value: 'redemptions', label: 'Redemptions', content: <RedemptionsTab campaignId={campaign.id} /> },
                  { value: 'settings', label: 'Settings', content: <SettingsMatrix campaign={campaign} /> },
                ]}
              />
            </section>
            <div>
              <Properties
                items={[
                  ['Business', business ? <Link className="inline-link" to={`/businesses/${business.id}`}>{business.name}</Link> : null],
                  ['Type', campaign.type],
                  ['Season', campaign.season ? `${campaign.season.name} (${shortDate(campaign.season.startDate)} – ${shortDate(campaign.season.endDate)})` : 'No season'],
                  ['Unique code', campaign.uniqueCode],
                  ['Public link', <a className="inline-link" href={publicUrl} target="_blank" rel="noreferrer">{publicUrl}</a>],
                  ['Signup points', campaign.signupPoints],
                  ['Custom domain', campaign.customDomain],
                  ['Created', shortDate(campaign.created_at)],
                ]}
              />
              <details className="panel panel-body" style={{ marginTop: 12 }}>
                <summary>Technical details</summary>
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: 10 }}>{JSON.stringify(campaign, null, 2)}</pre>
              </details>
            </div>
          </div>
        </>
      )}
    </QueryState>
  );
}

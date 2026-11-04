import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { PageHeader, KpiStrip } from '@/components/display/PageHeader';
import { QueryState } from '@/components/display/QueryState';
import { Properties } from '@/components/display/Properties';
import { DetailTabs } from '@/components/display/DetailTabs';
import { PointsAdjustmentDialog, type AdjustmentTarget } from '@/components/dialogs/PointsAdjustmentDialog';
import { DataTable, type Column } from '@/components/data/DataTable';
import { useCustomer, useAdjustPoints } from '@/services/hooks';
import { shortDate } from '@/lib/format';
import { useBreadcrumbs } from '@/lib/breadcrumb-context';
import type { Business, CustomerMembership, PointsLedgerEntry, Redemption } from '@/services/types';

const campaignLink = (campaign?: { id: string; name: string }) =>
  campaign ? (
    <Link className="inline-link" to={`/campaigns/${campaign.id}`}>
      {campaign.name}
    </Link>
  ) : (
    '—'
  );

const membershipColumns: Column<CustomerMembership>[] = [
  { key: 'campaign', label: 'Campaign', render: (row) => campaignLink(row.campaign), csv: (row) => row.campaign?.name },
  {
    key: 'business',
    label: 'Business',
    mobile: false,
    render: (row) =>
      row.campaign?.business ? (
        <Link className="inline-link" to={`/businesses/${row.campaign.business.id}`}>
          {row.campaign.business.name}
        </Link>
      ) : (
        '—'
      ),
    csv: (row) => row.campaign?.business?.name,
  },
  {
    key: 'balance',
    label: 'Balance',
    align: 'right',
    sortable: true,
    render: (row) => <span className="tabular-nums">{row.balance.toLocaleString()} pts</span>,
  },
  { key: 'created_at', label: 'Joined', sortable: true, render: (row) => shortDate(row.created_at) },
];

const ledgerColumns: Column<PointsLedgerEntry>[] = [
  { key: 'created_at', label: 'Date', render: (row) => shortDate(row.created_at) },
  { key: 'description', label: 'Description', render: (row) => row.description },
  { key: 'campaign', label: 'Campaign', render: (row) => campaignLink(row.campaign), csv: (row) => row.campaign?.name },
  {
    key: 'points',
    label: 'Points',
    render: (row) => (
      <span className="tabular-nums" style={{ color: row.points < 0 ? 'var(--destructive)' : 'var(--success)' }}>
        {row.points > 0 ? '+' : ''}
        {row.points}
      </span>
    ),
  },
];

const redemptionColumns: Column<Redemption>[] = [
  { key: 'created_at', label: 'Date', render: (row) => shortDate(row.created_at) },
  { key: 'description', label: 'Reward', render: (row) => row.reward?.title ?? row.description },
  { key: 'campaign', label: 'Campaign', render: (row) => campaignLink(row.campaign), csv: (row) => row.campaign?.name },
  { key: 'uniqueCode', label: 'Redemption code', render: (row) => <span className="tabular-nums">{row.uniqueCode}</span> },
];

/** A stacked list of links for the Properties panel; null (shown as "—") when empty. */
function linkList(items: { id: string; to: string; label: string }[]) {
  if (!items.length) return null;
  return (
    <span className="flex flex-col gap-0.5">
      {items.map((item) => (
        <Link key={item.id} className="inline-link" to={item.to}>
          {item.label}
        </Link>
      ))}
    </span>
  );
}

export function CustomerDetail() {
  const { id = '' } = useParams();
  const query = useCustomer(id);
  const [adjustOpen, setAdjustOpen] = useState(false);
  // §9A: the new ledger entry gets a one-time 1.2s highlight after a points adjustment
  const [highlightId, setHighlightId] = useState<string | null>(null);
  useEffect(() => {
    if (!highlightId) return;
    const timer = window.setTimeout(() => setHighlightId(null), 1200);
    return () => window.clearTimeout(timer);
  }, [highlightId]);
  const adjust = useAdjustPoints();
  const customer = query.data;
  const memberships = customer?.memberships ?? [];
  const single = memberships.length === 1 ? memberships[0] : undefined;

  const businesses = [
    ...new Map(
      memberships
        .map((membership) => membership.campaign?.business)
        .filter((business): business is Business => Boolean(business))
        .map((business) => [business.id, business]),
    ).values(),
  ];
  const owner = businesses.length === 1 ? businesses[0]?.user : undefined;

  // One campaign keeps the full Admin › Business › Campaign trail; several campaigns have no single parent.
  useBreadcrumbs(
    customer
      ? single
        ? [
            { label: 'Admins', to: '/admins' },
            ...(owner ? [{ label: owner.fullName, to: `/admins/${owner.id}` }] : []),
            ...(businesses[0] ? [{ label: businesses[0].name, to: `/businesses/${businesses[0].id}` }] : []),
            ...(single.campaign ? [{ label: single.campaign.name, to: `/campaigns/${single.campaign.id}` }] : []),
            { label: `${customer.firstName} ${customer.lastName}` },
          ]
        : [{ label: 'Customers', to: '/customers' }, { label: `${customer.firstName} ${customer.lastName}` }]
      : null,
  );

  const earned = customer?.ledger.filter((entry) => entry.points > 0).reduce((sum, entry) => sum + entry.points, 0) ?? 0;
  const redeemed = Math.abs(customer?.ledger.filter((entry) => entry.points < 0).reduce((sum, entry) => sum + entry.points, 0) ?? 0);

  const targets: AdjustmentTarget[] = memberships
    .filter((membership) => membership.campaign)
    .map((membership) => ({
      membershipId: membership.id,
      campaignId: membership.campaign!.id,
      campaignName: membership.campaign!.name,
      balance: membership.balance,
    }));

  return (
    <QueryState loading={query.isLoading} error={query.error as Error | null} retry={() => void query.refetch()} section="customer detail">
      {customer && (
        <>
          <PageHeader
            title={`${customer.firstName} ${customer.lastName}`}
            description={customer.email}
            actions={
              <Button variant="default" onClick={() => setAdjustOpen(true)} disabled={!targets.length}>
                Adjust points
              </Button>
            }
          />
          <KpiStrip
            items={[
              { label: memberships.length > 1 ? 'Total balance' : 'Balance', value: customer.balance },
              { label: 'Earned', value: earned },
              { label: 'Redeemed', value: redeemed },
              { label: 'Campaigns joined', value: memberships.length },
            ]}
          />
          <div className="detail-grid">
            <section className="panel">
              <DetailTabs
                label="Customer records"
                tabs={[
                  {
                    value: 'campaigns',
                    label: 'Campaigns',
                    count: memberships.length,
                    content: (
                      <DataTable
                        tableId="customer-campaigns"
                        columns={membershipColumns}
                        rows={memberships}
                        rowId={(row) => row.id}
                        emptyTitle="Not in any campaign"
                      />
                    ),
                  },
                  {
                    value: 'ledger',
                    label: 'Ledger',
                    count: customer.ledger.length,
                    content: (
                      <DataTable
                        tableId="customer-ledger"
                        columns={ledgerColumns}
                        rows={customer.ledger}
                        rowId={(row) => row.id}
                        highlightId={highlightId}
                        emptyTitle="No points activity"
                      />
                    ),
                  },
                  {
                    value: 'redemptions',
                    label: 'Redemptions',
                    count: customer.redemptions.length,
                    content: <DataTable columns={redemptionColumns} rows={customer.redemptions} rowId={(row) => row.id} emptyTitle="No redemptions" />,
                  },
                ]}
              />
            </section>
            <div>
              <Properties
                items={[
                  ['Email', customer.email],
                  [
                    memberships.length > 1 ? 'Campaigns' : 'Campaign',
                    linkList(
                      targets.map((target) => ({
                        id: target.membershipId,
                        to: `/campaigns/${target.campaignId}`,
                        label: target.campaignName,
                      })),
                    ),
                  ],
                  [
                    businesses.length > 1 ? 'Businesses' : 'Business',
                    linkList(businesses.map((business) => ({ id: business.id, to: `/businesses/${business.id}`, label: business.name }))),
                  ],
                  ['Owner', owner ? <Link className="inline-link" to={`/admins/${owner.id}`}>{owner.fullName}</Link> : null],
                  [memberships.length > 1 ? 'Total balance' : 'Balance', `${customer.balance.toLocaleString()} points`],
                  [memberships.length > 1 ? 'First joined' : 'Joined', shortDate(customer.created_at)],
                ]}
              />
              <details className="panel panel-body" style={{ marginTop: 12 }}>
                <summary>Technical details</summary>
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: 10 }}>{JSON.stringify(customer, null, 2)}</pre>
              </details>
            </div>
          </div>
          <PointsAdjustmentDialog
            open={adjustOpen}
            onOpenChange={setAdjustOpen}
            targets={targets}
            onSubmit={async (membershipId, input) => {
              const entry = await adjust.mutateAsync({ id: membershipId, input });
              setHighlightId(entry.id);
            }}
          />
        </>
      )}
    </QueryState>
  );
}

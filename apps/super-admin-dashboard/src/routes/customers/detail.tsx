import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { PageHeader, KpiStrip } from '@/components/display/PageHeader';
import { QueryState } from '@/components/display/QueryState';
import { Properties } from '@/components/display/Properties';
import { DetailTabs } from '@/components/display/DetailTabs';
import { PointsAdjustmentDialog } from '@/components/dialogs/PointsAdjustmentDialog';
import { DataTable, type Column } from '@/components/data/DataTable';
import { useCustomer, useAdjustPoints } from '@/services/hooks';
import { shortDate } from '@/lib/format';
import { useBreadcrumbs } from '@/lib/breadcrumb-context';
import type { PointsLedgerEntry, Redemption } from '@/services/types';

const ledgerColumns: Column<PointsLedgerEntry>[] = [
  { key: 'created_at', label: 'Date', render: (row) => shortDate(row.created_at) },
  { key: 'description', label: 'Description', render: (row) => row.description },
  { key: 'campaign', label: 'Campaign', render: (row) => row.campaign?.name ?? '—' },
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
  { key: 'uniqueCode', label: 'Redemption code', render: (row) => <span className="tabular-nums">{row.uniqueCode}</span> },
];

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
  const campaign = customer?.campaign;
  const business = campaign?.business;
  const owner = business?.user;

  useBreadcrumbs(
    customer
      ? [
          { label: 'Admins', to: '/admins' },
          ...(owner ? [{ label: owner.fullName, to: `/admins/${owner.id}` }] : []),
          ...(business ? [{ label: business.name, to: `/businesses/${business.id}` }] : []),
          ...(campaign ? [{ label: campaign.name, to: `/campaigns/${campaign.id}` }] : []),
          { label: `${customer.firstName} ${customer.lastName}` },
        ]
      : null,
  );

  const earned = customer?.ledger.filter((entry) => entry.points > 0).reduce((sum, entry) => sum + entry.points, 0) ?? 0;
  const redeemed = Math.abs(customer?.ledger.filter((entry) => entry.points < 0).reduce((sum, entry) => sum + entry.points, 0) ?? 0);

  return (
    <QueryState loading={query.isLoading} error={query.error as Error | null} retry={() => void query.refetch()} section="customer detail">
      {customer && (
        <>
          <PageHeader
            title={`${customer.firstName} ${customer.lastName}`}
            description={customer.email}
            actions={
              <Button variant="default" onClick={() => setAdjustOpen(true)}>
                Adjust points
              </Button>
            }
          />
          <KpiStrip
            items={[
              { label: 'Balance', value: customer.balance },
              { label: 'Earned', value: earned },
              { label: 'Redeemed', value: redeemed },
              { label: 'Campaigns joined', value: campaign ? 1 : 0 },
            ]}
          />
          <div className="detail-grid">
            <section className="panel">
              <DetailTabs
                label="Customer records"
                tabs={[
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
                  ['Campaign', campaign ? <Link className="inline-link" to={`/campaigns/${campaign.id}`}>{campaign.name}</Link> : null],
                  ['Business', business ? <Link className="inline-link" to={`/businesses/${business.id}`}>{business.name}</Link> : null],
                  ['Owner', owner ? <Link className="inline-link" to={`/admins/${owner.id}`}>{owner.fullName}</Link> : null],
                  ['Balance', `${customer.balance} points`],
                  ['Joined', shortDate(customer.created_at)],
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
            campaignId={campaign?.id ?? ''}
            campaignName={campaign?.name ?? 'No campaign'}
            onSubmit={async (input) => {
              const entry = await adjust.mutateAsync({ id, input });
              setHighlightId(entry.id);
            }}
          />
        </>
      )}
    </QueryState>
  );
}

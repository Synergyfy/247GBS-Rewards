import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { RefreshCw } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DataTable, type Column } from '@/components/data/DataTable';
import { PageHeader, KpiStrip, type Kpi } from '@/components/display/PageHeader';
import { DateRangePicker } from '@/components/display/DateRangePicker';
import { ErrorState, NotAuthorized, NotAvailableYet } from '@/components/display/States';
import { compact, currency, shortDate } from '@/lib/format';
import { isNotAvailable } from '@/lib/errors';
import { percentChange, previousRange, resolveRange } from '@/lib/date-range';
import { usePlatformAnalytics, useAuditLogs, usePayments } from '@/services/hooks';
import type { AuditLogEntry, PaymentHistory, PlatformAnalytics } from '@/services/types';

type Metric = 'newUsers' | 'newCustomers' | 'pointsIssued' | 'redemptions';
const metricLabels: Record<Metric, string> = {
  newUsers: 'New users',
  newCustomers: 'New customers',
  pointsIssued: 'Points issued',
  redemptions: 'Redemptions',
};

type Series = PlatformAnalytics['series'];
const sum = (series: Series | undefined, metric: Metric) => (series ?? []).reduce((total, day) => total + day[metric], 0);

const paymentColumns: Column<PaymentHistory>[] = [
  {
    key: 'user',
    label: 'Account',
    render: (row) =>
      row.user ? (
        <Link className="cell-link" to={`/admins/${row.user.id}`}>
          {row.user.fullName}
        </Link>
      ) : (
        'Unknown account'
      ),
  },
  { key: 'amount', label: 'Amount', align: 'right', render: (row) => currency(row.amount) },
  { key: 'created_at', label: 'Date', render: (row) => shortDate(row.created_at) },
];

const auditColumns: Column<AuditLogEntry>[] = [
  { key: 'action', label: 'Action', render: (row) => row.action.replaceAll('.', ' ') },
  { key: 'actor', label: 'Actor', render: (row) => row.actor.fullName },
  { key: 'created_at', label: 'When', render: (row) => shortDate(row.created_at) },
];

/** §9B Overview: "Is the platform healthy?" */
export function Overview() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [metric, setMetric] = useState<Metric>('newCustomers');
  const range = resolveRange(searchParams.get('from'), searchParams.get('to'));
  const prior = previousRange(range);
  const analytics = usePlatformAnalytics(range.from, range.to);
  // Same-length window just before the selected one, for real "vs previous period" deltas
  const previous = usePlatformAnalytics(prior.from, prior.to);
  const audit = useAuditLogs({ page: 1, limit: 6 });
  const failed = usePayments({ page: 1, limit: 5, status: 'failed' });

  function setRange(from: string, to: string) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set('from', from);
      next.set('to', to);
      return next;
    });
  }

  const data = analytics.data;
  const totals = data?.totals;
  const previousSeries = previous.data?.series;
  const windowLabel = `previous ${range.days} days`;
  const trendKpi = (label: string, value: string | number, seriesMetric: Metric): Kpi => ({
    label,
    value,
    delta: previousSeries ? percentChange(sum(data?.series, seriesMetric), sum(previousSeries, seriesMetric)) : null,
    deltaLabel: `${metricLabels[seriesMetric]} vs ${windowLabel}`,
    trend: data?.series.map((day) => day[seriesMetric]),
  });

  const analyticsError = analytics.error as (Error & { status?: number }) | null;
  let analyticsBlock;
  if (analyticsError?.status === 403) analyticsBlock = <NotAuthorized />;
  else if (isNotAvailable(analyticsError)) analyticsBlock = <NotAvailableYet section="platform analytics" />;
  else if (analyticsError && !data) analyticsBlock = <ErrorState message={analyticsError.message} retry={() => void analytics.refetch()} />;

  return (
    <>
      <PageHeader
        title="Platform overview"
        description="Live activity across the 247GBS Rewards platform."
        actions={
          <>
            <DateRangePicker value={range} onChange={setRange} />
            <Button variant="outline" onClick={() => void Promise.all([analytics.refetch(), previous.refetch()])}>
              <RefreshCw />
              Refresh
            </Button>
          </>
        }
      />
      {analyticsBlock ??
        (analytics.isLoading && !data ? (
          <div className="kpi-strip" aria-label="Loading platform totals">
            {Array.from({ length: 6 }, (_, i) => (
              <div className="kpi-cell" key={i}>
                <div className="skeleton" style={{ height: 42 }} />
              </div>
            ))}
          </div>
        ) : (
          totals && (
            <KpiStrip
              items={[
                trendKpi('Users', totals.users, 'newUsers'),
                { label: 'Businesses', value: totals.businesses },
                { label: 'Active campaigns', value: `${totals.activeCampaigns} / ${totals.campaigns}` },
                trendKpi('Customers', totals.customers, 'newCustomers'),
                trendKpi('Points issued', compact(totals.pointsIssued), 'pointsIssued'),
                { label: 'Revenue', value: currency(totals.revenue) },
              ]}
            />
          )
        ))}
      <div className="dashboard-grid">
        <div className="dashboard-stack">
          {!analyticsBlock && (
            <section className="panel">
              <header className="panel-head">
                <h2 className="panel-title">Platform activity</h2>
                <div className="segment-control" role="group" aria-label="Chart metric">
                  {(Object.keys(metricLabels) as Metric[]).map((key) => (
                    <button key={key} className={metric === key ? 'active' : ''} aria-pressed={metric === key} onClick={() => setMetric(key)}>
                      {metricLabels[key]}
                    </button>
                  ))}
                </div>
              </header>
              <div className="panel-body">
                <div className="chart-box">
                  {data && (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.series} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                        <CartesianGrid stroke="var(--border)" vertical={false} />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(value: string) => value.slice(5)}
                          tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tickFormatter={(value: number) => compact(value)}
                          tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            background: 'var(--popover)',
                            border: '1px solid var(--border)',
                            borderRadius: 3,
                            fontSize: 11,
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey={metric}
                          name={metricLabels[metric]}
                          stroke="var(--chart-1)"
                          strokeWidth={2}
                          dot={false}
                          isAnimationActive={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </section>
          )}
          {!analyticsBlock && (
            <section className="panel">
              <header className="panel-head">
                <h2 className="panel-title">Top businesses</h2>
                <Link to="/businesses" className="inline-link">
                  View all
                </Link>
              </header>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Business</th>
                      <th>Owner</th>
                      <th className="text-right">Customers</th>
                      <th className="text-right">Points issued</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.topBusinesses ?? []).map((business) => (
                      <tr key={business.businessId}>
                        <td>
                          <Link className="cell-link" to={`/businesses/${business.businessId}`}>
                            {business.name}
                          </Link>
                        </td>
                        <td>{business.ownerName}</td>
                        <td className="tabular-nums text-right">{business.customers.toLocaleString()}</td>
                        <td className="tabular-nums text-right">{compact(business.pointsIssued)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
        <div className="dashboard-stack">
          <section className="panel">
            <header className="panel-head">
              <h2 className="panel-title">Failed payments</h2>
              <Link to="/payments?status=failed" className="inline-link">
                Review all
              </Link>
            </header>
            {failed.isLoading && (
              <div className="panel-body">
                <div className="skeleton" style={{ height: 88 }} />
              </div>
            )}
            {failed.data && (
              <DataTable tableId="overview-failed" columns={paymentColumns} rows={failed.data.data} rowId={(row) => row.id} emptyTitle="No failed payments" />
            )}
          </section>
          <section className="panel">
            <header className="panel-head">
              <h2 className="panel-title">Recent audit events</h2>
              <Link to="/audit-log" className="inline-link">
                View audit log
              </Link>
            </header>
            {audit.isLoading && (
              <div className="panel-body">
                <div className="skeleton" style={{ height: 88 }} />
              </div>
            )}
            {audit.data && (
              <DataTable tableId="overview-audit" columns={auditColumns} rows={audit.data.data} rowId={(row) => row.id} emptyTitle="No audit events" />
            )}
          </section>
        </div>
      </div>
    </>
  );
}

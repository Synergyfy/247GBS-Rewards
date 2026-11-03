import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { ArrowDownRight, ArrowUpRight, RefreshCw } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DataTable, type Column } from '@/components/data/DataTable';
import { PageHeader, KpiStrip } from '@/components/display/PageHeader';
import { ErrorState } from '@/components/display/States';
import { StatusBadge } from '@/components/display/States';
import { compact, currency, shortDate } from '@/lib/format';
import { usePlatformAnalytics, useAuditLogs, usePayments } from '@/services/hooks';
import type { PaymentHistory, AuditLogEntry } from '@/services/types';

type Metric = 'newUsers' | 'newCustomers' | 'pointsIssued' | 'redemptions';
const metricLabels: Record<Metric, string> = { newUsers: 'New users', newCustomers: 'New customers', pointsIssued: 'Points issued', redemptions: 'Redemptions' };
export function Overview() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [metric, setMetric] = useState<Metric>('newCustomers');
  const analytics = usePlatformAnalytics(searchParams.get('from') ?? undefined, searchParams.get('to') ?? undefined);
  const audit = useAuditLogs({ page: 1, limit: 6 });
  const failed = usePayments({ page: 1, limit: 5, status: 'failed' });
  if (analytics.error && (analytics.error as Error & { status?: number }).status === 403) return <div className="panel empty-state"><h3>Not authorized</h3><p>Your account cannot view platform analytics.</p></div>;
  if (analytics.error && !analytics.data) return <ErrorState message={analytics.error.message} retry={() => void analytics.refetch()} />;
  const data = analytics.data;
  const totals = data?.totals;
  const paymentColumns: Column<PaymentHistory>[] = [
    { key: 'user', label: 'Account', render: (row) => <Link className="cell-link" to={`/admins/${row.user?.id}`}>{row.user?.fullName ?? 'Unknown account'}</Link> },
    { key: 'amount', label: 'Amount', render: (row) => <span className="tabular">{currency(row.amount)}</span> },
    { key: 'created_at', label: 'Date', render: (row) => shortDate(row.created_at) },
  ];
  const auditColumns: Column<AuditLogEntry>[] = [
    { key: 'action', label: 'Action', render: (row) => <span>{row.action.replaceAll('.', ' ')}</span> },
    { key: 'actor', label: 'Actor', render: (row) => row.actor.fullName },
    { key: 'created_at', label: 'When', render: (row) => shortDate(row.created_at) },
  ];
  return <><PageHeader title="Platform overview" description="Live activity across the 247GBS Rewards platform." actions={<button className="button" onClick={() => void analytics.refetch()}><RefreshCw />Refresh</button>} />
    {analytics.isLoading && !data ? <div className="kpi-strip">{Array.from({ length: 6 }, (_, i) => <div className="kpi-cell" key={i}><div className="skeleton" style={{ height: 42 }} /></div>)}</div> : totals && <KpiStrip items={[{ label: 'Users', value: totals.users, delta: '↑ 8.4% vs prior period' }, { label: 'Businesses', value: totals.businesses }, { label: 'Active campaigns', value: totals.activeCampaigns }, { label: 'Customers', value: totals.customers, delta: '↑ 12.2% vs prior period' }, { label: 'Points issued', value: compact(totals.pointsIssued) }, { label: 'Revenue', value: currency(totals.revenue) }]} />}
    <div className="dashboard-grid"><div className="dashboard-stack"><section className="panel"><header className="panel-head"><h2 className="panel-title">Platform activity</h2><div className="toolbar-right"><label className="cell-muted" htmlFor="date-from">From</label><input id="date-from" className="input" type="date" value={searchParams.get('from') ?? ''} onChange={(event) => setSearchParams((current) => { const next = new URLSearchParams(current); if (event.target.value) next.set('from', event.target.value); else next.delete('from'); return next; })} /><label className="cell-muted" htmlFor="date-to">To</label><input id="date-to" className="input" type="date" value={searchParams.get('to') ?? ''} onChange={(event) => setSearchParams((current) => { const next = new URLSearchParams(current); if (event.target.value) next.set('to', event.target.value); else next.delete('to'); return next; })} /></div></header><div className="panel-body"><div className="segment-control" role="group" aria-label="Chart metric">{(Object.keys(metricLabels) as Metric[]).map((key) => <button key={key} className={metric === key ? 'active' : ''} onClick={() => setMetric(key)}>{metricLabels[key]}</button>)}</div><div className="chart-box">{data && <ResponsiveContainer width="100%" height="100%"><LineChart data={data.series} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="date" tickFormatter={(value: string) => value.slice(5)} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} /><YAxis tickFormatter={(value: number) => compact(value)} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ background: 'var(--popover)', border: '1px solid var(--border)', borderRadius: 3, fontSize: 11 }} /><Line type="monotone" dataKey={metric} stroke="var(--chart-1)" strokeWidth={2} dot={false} isAnimationActive={false} /></LineChart></ResponsiveContainer>}</div></div></section>
    <section className="panel"><header className="panel-head"><h2 className="panel-title">Top businesses</h2><Link to="/businesses" className="inline-link">View all</Link></header><div className="table-wrap"><table><thead><tr><th>Business</th><th>Owner</th><th>Customers</th><th>Points issued</th></tr></thead><tbody>{(data?.topBusinesses ?? []).map((business) => <tr key={business.businessId}><td><Link className="cell-link" to={`/businesses/${business.businessId}`}>{business.name}</Link></td><td>{business.ownerName}</td><td className="tabular">{business.customers.toLocaleString()}</td><td className="tabular">{compact(business.pointsIssued)}</td></tr>)}</tbody></table></div></section></div>
    <div className="dashboard-stack"><section className="panel"><header className="panel-head"><h2 className="panel-title">Failed payments</h2><Link to="/payments?status=failed" className="inline-link">Review all</Link></header>{failed.data && <DataTable columns={paymentColumns} rows={failed.data.data} rowId={(row) => row.id} total={failed.data.total} pageSize={5} />}{failed.isLoading && <div className="panel-body"><div className="skeleton" style={{ height: 88 }} /></div>}<div style={{ padding: '0 10px 8px' }}>{failed.data?.data.slice(0, 1).map((payment) => <StatusBadge key={payment.id} value={payment.status} />)}</div></section>
      <section className="panel"><header className="panel-head"><h2 className="panel-title">Recent audit events</h2><Link to="/audit-log" className="inline-link">View audit log</Link></header>{audit.data && <DataTable columns={auditColumns} rows={audit.data.data} rowId={(row) => row.id} total={audit.data.total} pageSize={6} />}{audit.isLoading && <div className="panel-body"><div className="skeleton" style={{ height: 88 }} /></div>}</section></div></div>
    <div className="cell-muted" style={{ marginTop: 10 }}><ArrowUpRight size={12} style={{ verticalAlign: 'middle', color: 'var(--success)' }} /> Trends are based on the selected reporting window. <ArrowDownRight size={12} style={{ verticalAlign: 'middle' }} /></div>
  </>;
}

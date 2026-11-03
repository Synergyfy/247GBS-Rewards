import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Building2, KeyRound, Power, PowerOff, Trash2, UserRoundCog } from 'lucide-react';
import { PageHeader, KpiStrip } from '@/components/display/PageHeader';
import { QueryState } from '@/components/display/QueryState';
import { StatusBadge } from '@/components/display/States';
import { Properties } from '@/components/display/Properties';
import { DetailTabs } from '@/components/display/DetailTabs';
import { DangerZone } from '@/components/display/DangerZone';
import { useAdminActions } from '@/components/features/admins/useAdminActions';
import { DataTable, type Column } from '@/components/data/DataTable';
import {
  useAuditLogs,
  useCampaignsForBusinesses,
  useCustomers,
  useTransactions,
  useUser,
  useUserAnalytics,
  useUserBalances,
  useUserPayments,
} from '@/services/hooks';
import { compact, currency, shortDate } from '@/lib/format';
import { useBreadcrumbs } from '@/lib/breadcrumb-context';
import type {
  AuditBalance,
  AuditLogEntry,
  Business,
  Campaign,
  Customer,
  PaymentHistory,
  PointsLedgerEntry,
} from '@/services/types';

const businessColumns: Column<Business>[] = [
  {
    key: 'name',
    label: 'Business',
    render: (row) => (
      <Link className="cell-link" to={`/businesses/${row.id}`}>
        {row.name}
      </Link>
    ),
  },
  { key: 'email', label: 'Email', render: (row) => row.email },
  { key: 'phoneNumber', label: 'Phone', render: (row) => row.phoneNumber },
  { key: 'created_at', label: 'Created', render: (row) => shortDate(row.created_at) },
];

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
  { key: 'business', label: 'Business', render: (row) => row.business?.name ?? '—' },
  { key: 'type', label: 'Type', render: (row) => <StatusBadge value={row.type} /> },
  { key: 'isActive', label: 'Status', render: (row) => <StatusBadge value={row.isActive} /> },
  { key: 'created_at', label: 'Created', render: (row) => shortDate(row.created_at) },
];

/** Narrow a tab to one business or campaign: the §7.2 contract filters by a single id. */
function ScopeSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ id: string; name: string }>;
  onChange: (id: string) => void;
}) {
  return (
    <div className="toolbar" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="toolbar-left">
        <label className="cell-muted" htmlFor={`scope-${label}`}>
          {label}
        </label>
        <select
          id={`scope-${label}`}
          className="select"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function CampaignsTab({ businesses }: { businesses: Business[] }) {
  const query = useCampaignsForBusinesses(businesses.map((business) => business.id));
  return (
    <QueryState loading={query.isLoading} error={query.error} retry={query.refetch} section="campaigns">
      <DataTable
        columns={campaignColumns}
        rows={query.data}
        rowId={(row) => row.id}
        emptyTitle="No campaigns yet"
      />
    </QueryState>
  );
}

function CustomersTab({ businesses }: { businesses: Business[] }) {
  const [businessId, setBusinessId] = useState(businesses[0]?.id ?? '');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const query = useCustomers({ businessId, page, limit });
  const columns: Column<Customer>[] = [
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
    { key: 'campaign', label: 'Campaign', render: (row) => row.campaign?.name ?? '—' },
    { key: 'created_at', label: 'Joined', render: (row) => shortDate(row.created_at) },
  ];
  if (!businesses.length)
    return <div className="panel-body cell-muted">This admin has no businesses yet.</div>;
  return (
    <>
      <ScopeSelect
        label="Business"
        value={businessId}
        options={businesses}
        onChange={(id) => {
          setBusinessId(id);
          setPage(1);
        }}
      />
      <QueryState
        loading={query.isLoading}
        error={query.error as Error | null}
        retry={() => void query.refetch()}
        section="customers"
      >
        <DataTable
          columns={columns}
          rows={query.data?.data ?? []}
          rowId={(row) => row.id}
          total={query.data?.total ?? 0}
          page={page}
          pageSize={limit}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setLimit(size);
            setPage(1);
          }}
        />
      </QueryState>
    </>
  );
}

function TransactionsTab({ businesses }: { businesses: Business[] }) {
  const campaigns = useCampaignsForBusinesses(businesses.map((business) => business.id));
  const [selected, setSelected] = useState('');
  const campaignId = selected || campaigns.data[0]?.id || '';
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const query = useTransactions({ campaignId, page, limit });
  const columns: Column<PointsLedgerEntry>[] = [
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
    { key: 'description', label: 'Description', render: (row) => row.description },
    {
      key: 'points',
      label: 'Points',
      render: (row) => (
        <span className="tabular" style={{ color: row.points < 0 ? 'var(--destructive)' : 'var(--success)' }}>
          {row.points > 0 ? '+' : ''}
          {row.points.toLocaleString()}
        </span>
      ),
    },
  ];
  if (!campaigns.isLoading && !campaigns.data.length)
    return <div className="panel-body cell-muted">This admin has no campaigns yet.</div>;
  return (
    <>
      <ScopeSelect
        label="Campaign"
        value={campaignId}
        options={campaigns.data}
        onChange={(id) => {
          setSelected(id);
          setPage(1);
        }}
      />
      <QueryState
        loading={campaigns.isLoading || query.isLoading}
        error={campaigns.error ?? (query.error as Error | null)}
        retry={() => void query.refetch()}
        section="transactions"
      >
        <DataTable
          columns={columns}
          rows={query.data?.data ?? []}
          rowId={(row) => row.id}
          total={query.data?.total ?? 0}
          page={page}
          pageSize={limit}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setLimit(size);
            setPage(1);
          }}
        />
      </QueryState>
    </>
  );
}

function PaymentsTab({ userId }: { userId: string }) {
  const payments = useUserPayments(userId);
  const balances = useUserBalances(userId);
  const paymentColumns: Column<PaymentHistory>[] = [
    { key: 'created_at', label: 'Date', render: (row) => shortDate(row.created_at) },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
    { key: 'type', label: 'Type', render: (row) => <StatusBadge value={row.type} /> },
    {
      key: 'amount',
      label: 'Amount',
      render: (row) => <span className="tabular">{currency(row.amount)}</span>,
    },
  ];
  const seasons = (row: AuditBalance) => `${row.spring} / ${row.summer} / ${row.autumn} / ${row.winter}`;
  const balanceColumns: Column<AuditBalance>[] = [
    { key: 'created_at', label: 'Date', render: (row) => shortDate(row.created_at) },
    { key: 'type', label: 'Type', render: (row) => <StatusBadge value={row.type} /> },
    {
      key: 'seasons',
      label: 'Spring / Summer / Autumn / Winter',
      render: (row) => <span className="tabular">{seasons(row)}</span>,
    },
  ];
  return (
    <>
      <QueryState
        loading={payments.isLoading}
        error={payments.error as Error | null}
        retry={() => void payments.refetch()}
        section="payments"
      >
        <DataTable
          columns={paymentColumns}
          rows={payments.data ?? []}
          rowId={(row) => row.id}
          emptyTitle="No payments"
        />
      </QueryState>
      <h3 className="panel-title" style={{ padding: '10px 11px 0' }}>
        Balances
      </h3>
      <QueryState
        loading={balances.isLoading}
        error={balances.error as Error | null}
        retry={() => void balances.refetch()}
        section="balances"
      >
        <DataTable
          columns={balanceColumns}
          rows={balances.data ?? []}
          rowId={(row) => row.id}
          emptyTitle="No balances"
        />
      </QueryState>
    </>
  );
}

function ActivityTab({ userId }: { userId: string }) {
  // Super-admin actions taken on this account (audit entries targeting it)
  const query = useAuditLogs({ targetId: userId, page: 1, limit: 50 });
  const columns: Column<AuditLogEntry>[] = [
    { key: 'created_at', label: 'Timestamp', render: (row) => shortDate(row.created_at) },
    {
      key: 'actor',
      label: 'Actor',
      render: (row) => <span title={row.actor.email}>{row.actor.fullName}</span>,
    },
    { key: 'action', label: 'Action', render: (row) => row.action.replaceAll('.', ' ') },
    {
      key: 'note',
      label: 'Note',
      render: (row) => <span className="cell-muted">{String(row.payload?.note ?? '—')}</span>,
    },
  ];
  return (
    <QueryState
      loading={query.isLoading}
      error={query.error as Error | null}
      retry={() => void query.refetch()}
      section="activity"
    >
      <DataTable
        columns={columns}
        rows={query.data?.data ?? []}
        rowId={(row) => row.id}
        emptyTitle="No activity recorded"
      />
    </QueryState>
  );
}

export function AdminDetail() {
  const { id = '' } = useParams();
  const query = useUser(id);
  const analytics = useUserAnalytics(id);
  const actions = useAdminActions();
  const navigate = useNavigate();
  const user = query.data;

  useBreadcrumbs(user ? [{ label: 'Admins', to: '/admins' }, { label: user.fullName }] : null);

  return (
    <QueryState
      loading={query.isLoading}
      error={query.error as Error | null}
      retry={() => void query.refetch()}
      section="admin detail"
    >
      {user && (
        <>
          <PageHeader
            title={user.fullName}
            description={`${user.email} · ${user.phoneNumber}`}
            actions={
              <>
                <StatusBadge value={user.role} />
                <StatusBadge value={user.isActive ?? true} />
                <button
                  className="button"
                  onClick={() => void actions.setStatus([user], !(user.isActive ?? true))}
                >
                  {user.isActive === false ? <Power /> : <PowerOff />}
                  {user.isActive === false ? 'Activate' : 'Deactivate'}
                </button>
                <button className="button" onClick={() => actions.requestReset(user)}>
                  <KeyRound />
                  Reset password
                </button>
                <button className="button" onClick={() => actions.requestImpersonate(user)}>
                  <UserRoundCog />
                  Impersonate
                </button>
              </>
            }
          />
          <KpiStrip
            items={[
              { label: 'Businesses', value: user.businesses.length },
              { label: 'Campaigns', value: analytics.data?.totalCampaigns ?? 0 },
              { label: 'Active campaigns', value: analytics.data?.activeCampaigns ?? 0 },
              { label: 'Customers', value: analytics.data?.totalCustomers ?? 0 },
              { label: 'Points issued', value: compact(analytics.data?.totalPointsIssued ?? 0) },
              { label: 'Rewards redeemed', value: analytics.data?.totalRewardsRedeemed ?? 0 },
            ]}
          />
          <div className="detail-grid">
            <section className="panel">
              <DetailTabs
                label="Admin records"
                tabs={[
                  {
                    value: 'businesses',
                    label: 'Businesses',
                    count: user.businesses.length,
                    content: (
                      <>
                        <div className="toolbar" style={{ borderBottom: '1px solid var(--border)' }}>
                          <span className="cell-muted">Businesses owned by this admin</span>
                          <button
                            className="button"
                            onClick={() => navigate(`/businesses?ownerId=${user.id}`)}
                          >
                            <Building2 />
                            Add business
                          </button>
                        </div>
                        <DataTable
                          columns={businessColumns}
                          rows={user.businesses}
                          rowId={(row) => row.id}
                          emptyTitle="No businesses yet"
                        />
                      </>
                    ),
                  },
                  {
                    value: 'campaigns',
                    label: 'Campaigns',
                    content: <CampaignsTab businesses={user.businesses} />,
                  },
                  {
                    value: 'customers',
                    label: 'Customers',
                    content: <CustomersTab businesses={user.businesses} />,
                  },
                  {
                    value: 'transactions',
                    label: 'Transactions',
                    content: <TransactionsTab businesses={user.businesses} />,
                  },
                  {
                    value: 'payments',
                    label: 'Payments & balances',
                    content: <PaymentsTab userId={user.id} />,
                  },
                  { value: 'activity', label: 'Activity', content: <ActivityTab userId={user.id} /> },
                ]}
              />
            </section>
            <div>
              <Properties
                items={[
                  ['Email', user.email],
                  ['Phone', user.phoneNumber],
                  ['Location', user.location],
                  ['Role', user.role],
                  ['Signup source', user.signupSource],
                  ['Referral code', user.referralCode],
                  ['Created', shortDate(user.created_at)],
                  ['Status', user.isActive === false ? 'Inactive' : 'Active'],
                ]}
              />
              <DangerZone description="Deleting an account is permanent. Related business data may remain depending on backend cascade rules.">
                <button className="button danger" onClick={() => actions.requestDelete(user)}>
                  <Trash2 />
                  Delete admin
                </button>
              </DangerZone>
              <details className="panel panel-body" style={{ marginTop: 12 }}>
                <summary>Technical details</summary>
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: 10 }}>{JSON.stringify(user, null, 2)}</pre>
              </details>
            </div>
          </div>
          {actions.dialogs}
        </>
      )}
    </QueryState>
  );
}

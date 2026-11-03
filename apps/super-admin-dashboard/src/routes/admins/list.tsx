import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { UserRoundPlus } from 'lucide-react';
import { DataTable, type Column } from '@/components/data/DataTable';
import { FilterBar } from '@/components/data/FilterBar';
import { PageHeader } from '@/components/display/PageHeader';
import { QueryState } from '@/components/display/QueryState';
import { StatusBadge } from '@/components/display/States';
import { useUrlState } from '@/hooks/useUrlState';
import { shortDate } from '@/lib/format';
import { superAdminApi } from '@/services';
import { useAdmins } from '@/services/hooks';
import type { UserRow } from '@/services/types';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

function AdminActions({ user }: { user: UserRow }) {
  const client = useQueryClient();
  const active = user.isActive ?? true;
  async function toggle() {
    try {
      await superAdminApi.setUserStatus(user.id, !active);
      await client.invalidateQueries({ queryKey: ['admins'] });
      toast.success(active ? 'Account deactivated' : 'Account activated', {
        description: 'Undo is available for 6 seconds.',
        duration: 6000,
        action: {
          label: 'Undo',
          onClick: async () => {
            await superAdminApi.setUserStatus(user.id, active);
            await client.invalidateQueries({ queryKey: ['admins'] });
            toast.success('Previous status restored');
          },
        },
      });
    } catch {
      toast.error('Could not update account status.');
    }
  }
  return (
    <button
      className="button"
      onClick={toggle}
      aria-label={`${active ? 'Deactivate' : 'Activate'} ${user.fullName}`}
    >
      {active ? 'Deactivate' : 'Activate'}
    </button>
  );
}

export function AdminsList() {
  const state = useUrlState();
  const navigate = useNavigate();
  const client = useQueryClient();
  const query = useAdmins(state.listParams);
  const [createOpen, setCreateOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    try {
      const user = await superAdminApi.createUser({
        fullName: String(form.get('fullName')),
        email: String(form.get('email')),
        phoneNumber: String(form.get('phoneNumber')),
        role: 'admin',
      });
      await client.invalidateQueries({ queryKey: ['admins'] });
      setCreateOpen(false);
      toast.success('Admin created', {
        description: 'You can now add their first business.',
        action: { label: 'Add a business', onClick: () => navigate(`/businesses?ownerId=${user.id}`) },
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not create admin.');
    } finally {
      setBusy(false);
    }
  }
  const columns: Column<UserRow>[] = [
    {
      key: 'fullName',
      label: 'Admin',
      render: (row) => (
        <span className="identity">
          <span className="avatar">
            {row.fullName
              .split(' ')
              .map((part) => part[0])
              .join('')
              .slice(0, 2)}
          </span>
          <span className="identity-copy">
            <Link className="cell-link identity-name" to={`/admins/${row.id}`}>
              {row.fullName}
            </Link>
            <span className="identity-meta">{row.email}</span>
          </span>
        </span>
      ),
    },
    { key: 'phoneNumber', label: 'Phone', render: (row) => row.phoneNumber },
    { key: 'signupSource', label: 'Source', render: (row) => <StatusBadge value={row.signupSource} /> },
    { key: 'role', label: 'Role', render: (row) => <StatusBadge value={row.role} /> },
    { key: 'isActive', label: 'Status', render: (row) => <StatusBadge value={row.isActive ?? true} /> },
    {
      key: 'businessCount',
      label: 'Businesses',
      render: (row) => <span className="tabular">{row.businessCount}</span>,
    },
    {
      key: 'campaignCount',
      label: 'Campaigns',
      render: (row) => <span className="tabular">{row.campaignCount}</span>,
      mobile: false,
    },
    {
      key: 'customerCount',
      label: 'Customers',
      render: (row) => <span className="tabular">{row.customerCount.toLocaleString()}</span>,
      mobile: false,
    },
    { key: 'created_at', label: 'Created', render: (row) => shortDate(row.created_at), mobile: false },
    { key: 'toggle', label: 'Quick action', render: (row) => <AdminActions user={row} /> },
  ];
  return (
    <>
      <PageHeader
        title="Admins"
        description="Business-owner accounts and their platform footprint."
        actions={
          <button className="button primary" onClick={() => setCreateOpen(true)}>
            <UserRoundPlus />
            Create admin
          </button>
        }
      />
      <FilterBar placeholder="Search name, email, phone…" />
      <QueryState
        loading={query.isLoading}
        error={query.error as Error | null}
        retry={() => void query.refetch()}
        section="admins"
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
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogTitle className="dialog-title">Create admin</DialogTitle>
          <DialogDescription className="dialog-description">
            Create a business-owner account. A password is not shown or stored by the dashboard.
          </DialogDescription>
          <form onSubmit={create}>
            <div className="form-field">
              <label htmlFor="new-name">Full name</label>
              <input id="new-name" name="fullName" required className="input" />
            </div>
            <div className="form-field">
              <label htmlFor="new-email">Email</label>
              <input id="new-email" name="email" required type="email" className="input" />
            </div>
            <div className="form-field">
              <label htmlFor="new-phone">Phone</label>
              <input id="new-phone" name="phoneNumber" required className="input" />
            </div>
            <div className="dialog-footer">
              <button type="button" className="button" onClick={() => setCreateOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="button primary" disabled={busy}>
                {busy ? 'Creating…' : 'Create admin'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

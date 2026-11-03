import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Eye, KeyRound, Power, PowerOff, Trash2, UserRoundCog, UserRoundPlus } from 'lucide-react';
import { DataTable, type Column } from '@/components/data/DataTable';
import { FilterBar } from '@/components/data/FilterBar';
import { PageHeader } from '@/components/display/PageHeader';
import { QueryState } from '@/components/display/QueryState';
import { StatusBadge } from '@/components/display/States';
import { useAdminActions } from '@/components/features/admins/useAdminActions';
import { useUrlState } from '@/hooks/useUrlState';
import { shortDate } from '@/lib/format';
import { superAdminApi } from '@/services';
import { useAdmins } from '@/services/hooks';
import type { UserRow } from '@/services/types';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

const columns: Column<UserRow>[] = [
  {
    key: 'fullName',
    label: 'Admin',
    sortable: true,
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
  {
    key: 'isActive',
    label: 'Status',
    render: (row) => <StatusBadge value={row.isActive ?? true} />,
    csv: (row) => (row.isActive === false ? 'inactive' : 'active'),
  },
  { key: 'phoneNumber', label: 'Phone', render: (row) => row.phoneNumber, mobile: false },
  {
    key: 'signupSource',
    label: 'Source',
    sortable: true,
    render: (row) => <StatusBadge value={row.signupSource} />,
    mobile: false,
  },
  { key: 'role', label: 'Role', render: (row) => <StatusBadge value={row.role} />, mobile: false },
  {
    key: 'businessCount',
    label: 'Businesses',
    sortable: true,
    align: 'right',
    render: (row) => row.businessCount,
  },
  {
    key: 'campaignCount',
    label: 'Campaigns',
    sortable: true,
    align: 'right',
    render: (row) => row.campaignCount,
    mobile: false,
  },
  {
    key: 'customerCount',
    label: 'Customers',
    sortable: true,
    align: 'right',
    render: (row) => row.customerCount.toLocaleString(),
    mobile: false,
  },
  {
    key: 'created_at',
    label: 'Created',
    sortable: true,
    render: (row) => shortDate(row.created_at),
    mobile: false,
  },
];

export function AdminsList() {
  const state = useUrlState();
  const navigate = useNavigate();
  const client = useQueryClient();
  const query = useAdmins(state.listParams);
  const actions = useAdminActions({ afterDelete: () => void query.refetch() });
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

  return (
    <>
      <PageHeader
        title="Admins"
        description="Business-owner accounts and their platform footprint."
        actions={
          <Button variant="default" onClick={() => setCreateOpen(true)}>
            <UserRoundPlus />
            Create admin
          </Button>
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
          tableId="admins"
          columns={columns}
          rows={query.data?.data ?? []}
          rowId={(row) => row.id}
          total={query.data?.total ?? 0}
          loading={query.isFetching}
          {...state.tableProps}
          rowActions={(row) => {
            const active = row.isActive ?? true;
            return [
              { label: 'View details', icon: <Eye />, onSelect: () => navigate(`/admins/${row.id}`) },
              {
                label: active ? 'Deactivate' : 'Activate',
                icon: active ? <PowerOff /> : <Power />,
                onSelect: () => void actions.setStatus([row], !active),
              },
              { label: 'Reset password…', icon: <KeyRound />, onSelect: () => actions.requestReset(row) },
              {
                label: 'Impersonate…',
                icon: <UserRoundCog />,
                onSelect: () => actions.requestImpersonate(row),
              },
              {
                label: 'Delete…',
                icon: <Trash2 />,
                destructive: true,
                onSelect: () => actions.requestDelete(row),
              },
            ];
          }}
          bulkActions={(selected, clear) => (
            <>
              <Button variant="outline" onClick={() => void actions.setStatus(selected, true).then(clear)}>
                <Power />
                Activate
              </Button>
              <Button variant="outline" onClick={() => void actions.setStatus(selected, false).then(clear)}>
                <PowerOff />
                Deactivate
              </Button>
            </>
          )}
        />
      </QueryState>
      {actions.dialogs}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogTitle>Create admin</DialogTitle>
          <DialogDescription >
            Create a business-owner account. A password is not shown or stored by the dashboard.
          </DialogDescription>
          <form onSubmit={create}>
            <div className="form-field">
              <label htmlFor="new-name">Full name</label>
              <Input id="new-name" name="fullName" required />
            </div>
            <div className="form-field">
              <label htmlFor="new-email">Email</label>
              <Input id="new-email" name="email" required type="email" />
            </div>
            <div className="form-field">
              <label htmlFor="new-phone">Phone</label>
              <Input id="new-phone" name="phoneNumber" required />
            </div>
            <div className="mt-4 flex justify-end gap-1.5">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="default" disabled={busy}>
                {busy ? 'Creating…' : 'Create admin'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

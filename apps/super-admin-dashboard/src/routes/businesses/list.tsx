import { NativeSelect } from '@/components/ui/native-select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Building2, Eye, ShieldCheck } from 'lucide-react';
import { DataTable, type Column } from '@/components/data/DataTable';
import { FilterBar } from '@/components/data/FilterBar';
import { PageHeader } from '@/components/display/PageHeader';
import { QueryState } from '@/components/display/QueryState';
import { useUrlState } from '@/hooks/useUrlState';
import { shortDate } from '@/lib/format';
import { superAdminApi } from '@/services';
import { useAdmins, useBusinesses } from '@/services/hooks';
import type { Business } from '@/services/types';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

export function BusinessesList() {
  const state = useUrlState();
  const client = useQueryClient();
  const navigate = useNavigate();
  const ownerParam = state.params.get('ownerId') ?? '';
  const query = useBusinesses({ ...state.listParams, userId: ownerParam || undefined });
  const admins = useAdmins({ page: 1, limit: 100 });
  const [createOpen, setCreateOpen] = useState(Boolean(ownerParam));
  const [ownerId, setOwnerId] = useState(ownerParam);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (ownerParam) {
      setOwnerId(ownerParam);
      setCreateOpen(true);
    }
  }, [ownerParam]);
  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const selectedOwner = String(form.get('ownerId'));
    setBusy(true);
    try {
      const business = await superAdminApi.createBusiness(selectedOwner, {
        name: String(form.get('name')),
        email: String(form.get('email')),
        phoneNumber: String(form.get('phoneNumber')),
        website: String(form.get('website')) || undefined,
      });
      await client.invalidateQueries({ queryKey: ['businesses'] });
      setCreateOpen(false);
      state.setParam('ownerId', undefined);
      toast.success('Business created');
      navigate(`/businesses/${business.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not create business.');
    } finally {
      setBusy(false);
    }
  }
  const columns: Column<Business>[] = [
    {
      key: 'name',
      sortable: true,
      label: 'Business',
      render: (row) => (
        <span className="identity">
          <span className="avatar">
            <Building2 size={13} />
          </span>
          <Link className="cell-link" to={`/businesses/${row.id}`}>
            {row.name}
          </Link>
        </span>
      ),
    },
    {
      key: 'user',
      mobile: false,
      label: 'Owner',
      render: (row) =>
        row.user ? (
          <Link className="inline-link" to={`/admins/${row.user.id}`}>
            {row.user.fullName}
          </Link>
        ) : (
          '—'
        ),
    },
    { key: 'email', sortable: true, mobile: false, label: 'Email', render: (row) => row.email },
    {
      key: 'campaigns',
      align: 'right',
      label: 'Campaigns',
      render: (row) => <span className="tabular-nums">{row.campaigns?.length ?? '—'}</span>,
    },
    {
      key: 'created_at',
      sortable: true,
      mobile: false,
      label: 'Created',
      render: (row) => shortDate(row.created_at),
    },
  ];
  return (
    <>
      <PageHeader
        title="Businesses"
        description="Business accounts and their linked programs."
        actions={
          <Button variant="default" onClick={() => setCreateOpen(true)}>
            Create business
          </Button>
        }
      />
      <FilterBar placeholder="Search business or owner…" />
      <QueryState
        loading={query.isLoading}
        error={query.error as Error | null}
        retry={() => void query.refetch()}
        section="businesses"
      >
        <DataTable
          tableId="businesses"
          columns={columns}
          rows={query.data?.data ?? []}
          rowId={(row) => row.id}
          total={query.data?.total ?? 0}
          {...state.tableProps}
          loading={query.isFetching}
          rowActions={(row) => [
            { label: 'View details', icon: <Eye />, onSelect: () => navigate(`/businesses/${row.id}`) },
            ...(row.user
              ? [
                  {
                    label: 'View owner',
                    icon: <ShieldCheck />,
                    onSelect: () => navigate(`/admins/${row.user!.id}`),
                  },
                ]
              : []),
          ]}
        />
      </QueryState>
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogTitle>Create business</DialogTitle>
          <DialogDescription >
            Add a business to an admin account. Owner is prefilled when launched from admin onboarding.
          </DialogDescription>
          <form onSubmit={create}>
            <div className="form-field">
              <label htmlFor="business-owner">Owner admin</label>
              <NativeSelect
                id="business-owner"
                name="ownerId"
                
                value={ownerId}
                onChange={(event) => setOwnerId(event.target.value)}
                required
              >
                <option value="">Select an admin</option>
                {(admins.data?.data ?? []).map((admin) => (
                  <option key={admin.id} value={admin.id}>
                    {admin.fullName} · {admin.email}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <div className="form-field">
              <label htmlFor="business-name">Business name</label>
              <Input id="business-name" name="name" required />
            </div>
            <div className="form-field">
              <label htmlFor="business-email">Email</label>
              <Input id="business-email" name="email" required type="email" />
            </div>
            <div className="form-field">
              <label htmlFor="business-phone">Phone</label>
              <Input id="business-phone" name="phoneNumber" required />
            </div>
            <div className="form-field">
              <label htmlFor="business-website">Website (optional)</label>
              <Input id="business-website" name="website" type="url" />
            </div>
            <div className="mt-4 flex justify-end gap-1.5">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="default" disabled={busy}>
                {busy ? 'Creating…' : 'Create business'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

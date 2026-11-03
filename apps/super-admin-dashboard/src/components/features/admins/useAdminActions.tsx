import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ConfirmActionDialog } from '@/components/dialogs/ConfirmActionDialog';
import { ResetPasswordResultDialog } from '@/components/dialogs/ResetPasswordResultDialog';
import { superAdminApi } from '@/services';
import { appEnv } from '@/lib/env';
import type { User } from '@/services/types';

type AdminRef = Pick<User, 'id' | 'fullName' | 'email' | 'isActive'>;
type DangerAction = 'delete' | 'reset' | 'impersonate';

const COPY: Record<DangerAction, { title: string; description: string; confirmLabel: string }> = {
  delete: {
    title: 'Delete admin account',
    description: 'This permanently deletes the account. Enter the email and a reason for the audit log.',
    confirmLabel: 'Delete account',
  },
  reset: {
    title: 'Reset password',
    description: 'A temporary password is issued once. Provide a reason for the audit log.',
    confirmLabel: 'Reset password',
  },
  impersonate: {
    title: 'Impersonate account',
    description: 'This opens a limited support session in the business web app. Provide a reason.',
    confirmLabel: 'Open support session',
  },
};

/**
 * Admin account actions shared by the Admins list (row menu, bulk bar) and the admin detail page.
 * §9B: status changes are reversible, so they run immediately with a 6s Undo toast; delete, reset
 * and impersonate are high-impact and go through ConfirmActionDialog with a required reason.
 */
export function useAdminActions({ afterDelete }: { afterDelete?: () => void } = {}) {
  const client = useQueryClient();
  const navigate = useNavigate();
  const [pending, setPending] = useState<{ action: DangerAction; user: AdminRef } | null>(null);
  const [resetResult, setResetResult] = useState<string | null>(null);

  async function refresh(ids: string[]) {
    await Promise.all([
      client.invalidateQueries({ queryKey: ['admins'] }),
      client.invalidateQueries({ queryKey: ['users'] }),
      ...ids.map((id) => client.invalidateQueries({ queryKey: ['user', id] })),
    ]);
  }

  async function applyStatus(users: AdminRef[], isActive: boolean) {
    await Promise.all(users.map((user) => superAdminApi.setUserStatus(user.id, isActive)));
    await refresh(users.map((user) => user.id));
  }

  /** Set every given account to `isActive`; Undo restores each one's previous status. */
  async function setStatus(users: AdminRef[], isActive: boolean) {
    const changed = users.filter((user) => (user.isActive ?? true) !== isActive);
    if (!changed.length) {
      toast.info(isActive ? 'Already active' : 'Already inactive');
      return;
    }
    try {
      await applyStatus(changed, isActive);
      const label = changed.length === 1 ? changed[0]!.fullName : `${changed.length} accounts`;
      toast.success(`${label} ${isActive ? 'activated' : 'deactivated'}`, {
        duration: 6000,
        action: {
          label: 'Undo',
          onClick: () => {
            void applyStatus(changed, !isActive)
              .then(() => toast.success('Previous status restored'))
              .catch(() => toast.error('Could not restore the previous status.'));
          },
        },
      });
    } catch {
      toast.error('Could not update account status.');
    }
  }

  async function confirm(reason: string) {
    if (!pending) return;
    const { action, user } = pending;
    try {
      if (action === 'delete') {
        await superAdminApi.deleteUser(user.id, reason);
        toast.success(`${user.fullName} deleted`);
        if (afterDelete) afterDelete();
        else navigate('/admins');
      }
      if (action === 'reset') {
        const result = await superAdminApi.resetPassword(user.id, reason);
        setResetResult(result.temporaryPassword);
      }
      if (action === 'impersonate') {
        const result = await superAdminApi.impersonate(user.id, reason);
        window.open(
          `${appEnv.WEB_APP_URL}/auth/impersonate#token=${encodeURIComponent(result.accessToken)}&expiresIn=${result.expiresIn}`,
          '_blank',
          'noopener,noreferrer',
        );
        toast.success(`Support session opened for ${user.fullName}`);
      }
      await refresh([user.id]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'The action could not be completed.');
    }
  }

  const dialogs = (
    <>
      <ConfirmActionDialog
        open={pending !== null}
        onOpenChange={(open) => !open && setPending(null)}
        title={pending ? COPY[pending.action].title : ''}
        description={pending ? COPY[pending.action].description : ''}
        requiredText={pending?.action === 'delete' ? pending.user.email : undefined}
        confirmLabel={pending ? COPY[pending.action].confirmLabel : ''}
        onConfirm={(reason) => void confirm(reason)}
      />
      <ResetPasswordResultDialog password={resetResult} onClose={() => setResetResult(null)} />
    </>
  );

  return {
    setStatus,
    requestDelete: (user: AdminRef) => setPending({ action: 'delete', user }),
    requestReset: (user: AdminRef) => setPending({ action: 'reset', user }),
    requestImpersonate: (user: AdminRef) => setPending({ action: 'impersonate', user }),
    dialogs,
  };
}

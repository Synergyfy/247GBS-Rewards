import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

/** §9C: the temporary password from a reset is shown once, in a copyable dialog, and never logged. */
export function ResetPasswordResultDialog({ password, onClose }: { password: string | null; onClose: () => void }) {
  return (
    <Dialog open={Boolean(password)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Temporary password</DialogTitle>
          <DialogDescription>
            This value is shown once. Copy it now and deliver it through your approved secure channel.
          </DialogDescription>
        </DialogHeader>
        <code className="block rounded-sm border border-input bg-muted px-2.5 py-2 font-mono text-[13px] break-all">{password}</code>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() => {
              if (password) void navigator.clipboard.writeText(password).then(() => toast.success('Temporary password copied'));
            }}
          >
            Copy password
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

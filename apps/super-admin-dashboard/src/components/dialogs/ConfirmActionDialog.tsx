import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

/**
 * §9B confirmation for irreversible / high-impact actions. A reason (≥3 chars) is always required and
 * goes to the audit log; deletes also require typing the email or name.
 */
export function ConfirmActionDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  requiredText,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  requiredText?: string;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState('');
  const [typed, setTyped] = useState('');
  const valid = reason.trim().length >= 3 && (!requiredText || typed === requiredText);

  function change(next: boolean) {
    onOpenChange(next);
    if (!next) {
      setReason('');
      setTyped('');
    }
  }

  return (
    <Dialog open={open} onOpenChange={change}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {requiredText && (
          <div className="grid gap-1">
            <Label htmlFor="confirm-name" className="text-xs">
              Type “{requiredText}” to confirm
            </Label>
            <Input id="confirm-name" autoComplete="off" value={typed} onChange={(event) => setTyped(event.target.value)} />
          </div>
        )}
        <div className="grid gap-1">
          <Label htmlFor="action-reason" className="text-xs">
            Reason (required)
          </Label>
          <Textarea
            id="action-reason"
            rows={3}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Add context for the audit log"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => change(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={!valid}
            onClick={() => {
              onConfirm(reason);
              change(false);
            }}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

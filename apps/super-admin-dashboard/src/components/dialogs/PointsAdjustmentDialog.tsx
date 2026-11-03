import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ConfirmActionDialog } from './ConfirmActionDialog';
import type { PointsAdjustmentInput } from '@/services/types';

const REVIEW_THRESHOLD = 1000;

/** §9C points adjustment: ±integer, campaign, required reason; above 1,000 points needs a second confirmation. */
export function PointsAdjustmentDialog({
  open,
  onOpenChange,
  campaignId,
  campaignName,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId: string;
  campaignName: string;
  onSubmit: (input: PointsAdjustmentInput) => Promise<void>;
}) {
  const [points, setPoints] = useState('100');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [riskOpen, setRiskOpen] = useState(false);
  const amount = Number(points);
  const valid = Number.isInteger(amount) && amount !== 0 && reason.trim().length >= 3;

  async function apply() {
    setBusy(true);
    try {
      await onSubmit({ campaignId, points: amount, reason: reason.trim() });
      onOpenChange(false);
      setReason('');
      setPoints('100');
    } finally {
      setBusy(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (Math.abs(amount) > REVIEW_THRESHOLD) {
      setRiskOpen(true);
      return;
    }
    void apply();
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust customer points</DialogTitle>
            <DialogDescription>Add or remove whole points. All adjustments are written to the audit log.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="grid gap-3">
            <div className="grid gap-1">
              <Label htmlFor="adjust-points" className="text-xs">
                Points (positive or negative integer)
              </Label>
              <Input id="adjust-points" type="number" step="1" required value={points} onChange={(event) => setPoints(event.target.value)} />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="adjust-campaign" className="text-xs">
                Campaign
              </Label>
              <Input id="adjust-campaign" value={campaignName} readOnly />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="adjust-reason" className="text-xs">
                Reason
              </Label>
              <Textarea
                id="adjust-reason"
                rows={3}
                required
                minLength={3}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Customer support case or correction details"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={busy || !valid}>
                {busy ? 'Applying…' : `Apply ${amount > 0 ? '+' : ''}${amount} points`}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <ConfirmActionDialog
        open={riskOpen}
        onOpenChange={setRiskOpen}
        title="Confirm high-impact adjustment"
        description={`This adjustment is for ${amount.toLocaleString()} points, above the ${REVIEW_THRESHOLD.toLocaleString()}-point review threshold. Confirm the required reason has been provided.`}
        confirmLabel="Confirm adjustment"
        onConfirm={() => void apply()}
      />
    </>
  );
}

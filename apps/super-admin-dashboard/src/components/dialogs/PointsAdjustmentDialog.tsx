import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { NativeSelect } from '@/components/ui/native-select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ConfirmActionDialog } from './ConfirmActionDialog';
import type { PointsAdjustmentInput } from '@/services/types';

const REVIEW_THRESHOLD = 1000;

/** A campaign the customer belongs to; `membershipId` is the customer row that receives the points. */
export interface AdjustmentTarget {
  membershipId: string;
  campaignId: string;
  campaignName: string;
  balance: number;
}

/**
 * §9C points adjustment: ±integer, campaign, required reason; above 1,000 points needs a second confirmation.
 * Points live per campaign, so a customer in several campaigns picks which one to adjust.
 */
export function PointsAdjustmentDialog({
  open,
  onOpenChange,
  targets,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targets: AdjustmentTarget[];
  onSubmit: (membershipId: string, input: PointsAdjustmentInput) => Promise<void>;
}) {
  const [selectedId, setSelectedId] = useState('');
  const target = targets.find((item) => item.membershipId === selectedId) ?? targets[0];
  const [points, setPoints] = useState('100');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [riskOpen, setRiskOpen] = useState(false);
  const amount = Number(points);
  const valid = Boolean(target) && Number.isInteger(amount) && amount !== 0 && reason.trim().length >= 3;

  async function apply() {
    if (!target) return;
    setBusy(true);
    try {
      await onSubmit(target.membershipId, { campaignId: target.campaignId, points: amount, reason: reason.trim() });
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
              {targets.length > 1 ? (
                <NativeSelect
                  id="adjust-campaign"
                  className="w-full"
                  value={target?.membershipId ?? ''}
                  onChange={(event) => setSelectedId(event.target.value)}
                >
                  {targets.map((item) => (
                    <option key={item.membershipId} value={item.membershipId}>
                      {item.campaignName} · {item.balance.toLocaleString()} pts
                    </option>
                  ))}
                </NativeSelect>
              ) : (
                <Input id="adjust-campaign" value={target?.campaignName ?? 'No campaign'} readOnly />
              )}
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
        description={`This adjustment is for ${amount.toLocaleString()} points${target ? ` in ${target.campaignName}` : ''}, above the ${REVIEW_THRESHOLD.toLocaleString()}-point review threshold. Confirm the required reason has been provided.`}
        confirmLabel="Confirm adjustment"
        onConfirm={() => void apply()}
      />
    </>
  );
}

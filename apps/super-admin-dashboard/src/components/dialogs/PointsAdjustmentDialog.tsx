import { useState, type FormEvent } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { ConfirmActionDialog } from './ConfirmActionDialog';
import type { PointsAdjustmentInput } from '@/services/types';

export function PointsAdjustmentDialog({ open, onOpenChange, campaignId, campaignName, onSubmit }: { open: boolean; onOpenChange: (open: boolean) => void; campaignId: string; campaignName: string; onSubmit: (input: PointsAdjustmentInput) => Promise<void> }) {
  const [points, setPoints] = useState('100');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [riskOpen, setRiskOpen] = useState(false);
  const amount = Number(points);
  async function apply() { setBusy(true); try { await onSubmit({ campaignId, points: amount, reason: reason.trim() }); onOpenChange(false); setReason(''); setPoints('100'); } finally { setBusy(false); } }
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (Math.abs(amount) > 1000) { setRiskOpen(true); return; } void apply(); }
  return <><Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogTitle className="dialog-title">Adjust customer points</DialogTitle><DialogDescription className="dialog-description">Add or remove whole points. All adjustments are written to the audit log.</DialogDescription><form onSubmit={submit}><div className="form-field"><label htmlFor="adjust-points">Points (positive or negative integer)</label><input id="adjust-points" className="input" type="number" step="1" required value={points} onChange={(event) => setPoints(event.target.value)} /></div><div className="form-field"><label htmlFor="adjust-campaign">Campaign</label><input id="adjust-campaign" className="input" value={campaignName} readOnly aria-label="Campaign for adjustment" /></div><div className="form-field"><label htmlFor="adjust-reason">Reason</label><textarea id="adjust-reason" className="input" rows={3} required minLength={3} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Customer support case or correction details" style={{ height: 'auto', padding: 8 }} /></div><div className="dialog-footer"><button type="button" className="button" onClick={() => onOpenChange(false)}>Cancel</button><button className="button primary" type="submit" disabled={busy || !Number.isInteger(amount) || amount === 0 || reason.trim().length < 3}>{busy ? 'Applying…' : `Apply ${amount > 0 ? '+' : ''}${amount} points`}</button></div></form></DialogContent></Dialog><ConfirmActionDialog open={riskOpen} onOpenChange={setRiskOpen} title="Confirm high-impact adjustment" description={`This adjustment is for ${amount.toLocaleString()} points, above the 1,000-point review threshold. Confirm the required reason has been provided.`} confirmLabel="Confirm adjustment" onConfirm={() => void apply()} /></>;
}

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

export function ConfirmActionDialog({ open, onOpenChange, title, description, confirmLabel = 'Confirm', requiredText, onConfirm }: { open: boolean; onOpenChange: (open: boolean) => void; title: string; description: string; confirmLabel?: string; requiredText?: string; onConfirm: (reason: string) => void }) {
  const [reason, setReason] = useState('');
  const [typed, setTyped] = useState('');
  const valid = reason.trim().length >= 3 && (!requiredText || typed === requiredText);
  return <Dialog open={open} onOpenChange={(next) => { onOpenChange(next); if (!next) { setReason(''); setTyped(''); } }}><DialogContent aria-describedby="confirm-description"><DialogTitle className="dialog-title">{title}</DialogTitle><DialogDescription id="confirm-description" className="dialog-description">{description}</DialogDescription>{requiredText && <div className="form-field"><label htmlFor="confirm-name">Type “{requiredText}” to confirm</label><input id="confirm-name" className="input" value={typed} onChange={(event) => setTyped(event.target.value)} /></div>}<div className="form-field"><label htmlFor="action-reason">Reason (required)</label><textarea id="action-reason" className="input" rows={3} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Add context for the audit log" style={{ height: 'auto', padding: 8 }} /></div><div className="dialog-footer"><button className="button" onClick={() => onOpenChange(false)}>Cancel</button><button className="button danger" disabled={!valid} onClick={() => { onConfirm(reason); onOpenChange(false); }}>{confirmLabel}</button></div></DialogContent></Dialog>;
}

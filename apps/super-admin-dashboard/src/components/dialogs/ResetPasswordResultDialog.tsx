import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

export function ResetPasswordResultDialog({ password, onClose }: { password: string | null; onClose: () => void }) {
  return <Dialog open={Boolean(password)} onOpenChange={(open) => !open && onClose()}><DialogContent><DialogTitle className="dialog-title">Temporary password</DialogTitle><DialogDescription className="dialog-description">This value is shown once. Copy it now and deliver it through your approved secure channel.</DialogDescription><code className="input" style={{ display: 'block', height: 'auto', padding: 9, overflowWrap: 'anywhere' }}>{password}</code><div className="dialog-footer"><button className="button" onClick={onClose}>Close</button><button className="button primary" onClick={() => { if (password) void navigator.clipboard.writeText(password).then(() => toast.success('Temporary password copied')); }}>Copy password</button></div></DialogContent></Dialog>;
}

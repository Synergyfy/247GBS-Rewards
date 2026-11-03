import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const SHORTCUTS: Array<[string, string]> = [
  ['⌘K / Ctrl+K', 'Search admins, businesses, campaigns, customers and pages'],
  ['/', 'Focus the table filter'],
  ['j / k', 'Move to the next / previous row'],
  ['Enter', 'Open the focused row'],
  ['Space', 'Quick look at the focused row'],
  ['Esc', 'Close the open dialog or sheet'],
  ['?', 'Show this list'],
];

/** §9B `?` shortcuts reference. */
export function ShortcutsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
          <DialogDescription>Shortcuts are ignored while typing in a field.</DialogDescription>
        </DialogHeader>
        <table>
          <tbody>
            {SHORTCUTS.map(([keys, action]) => (
              <tr key={keys}>
                <td style={{ width: 120 }}>
                  <kbd className="tabular rounded-sm border border-border bg-muted px-1.5 py-0.5 text-[11px]">{keys}</kbd>
                </td>
                <td>{action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DialogContent>
    </Dialog>
  );
}

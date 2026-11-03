import { useRef } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface QuickLookSheetProps {
  row: unknown;
  onClose: () => void;
}

// Relations are skipped so the preview shows the row's own scalar fields
const HIDDEN_KEYS = ['business', 'campaign', 'customer', 'user'];

/** §9B quick look: key facts of a table row without leaving the list (Space or the row's ··· button). */
export function QuickLookSheet({ row, onClose }: QuickLookSheetProps) {
  const record = row && typeof row === 'object' ? (row as Record<string, unknown>) : null;
  // Keep showing the last row while the sheet animates closed
  const lastRecord = useRef(record);
  if (record) lastRecord.current = record;
  const shown = record ?? lastRecord.current;
  const entries = shown
    ? Object.entries(shown)
        .filter(([key, value]) => !HIDDEN_KEYS.includes(key) && ['string', 'number', 'boolean'].includes(typeof value))
        .slice(0, 8)
    : [];

  return (
    <Sheet open={Boolean(record)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-[480px]">
        <SheetHeader className="border-b border-border">
          <SheetTitle className="text-sm">Quick look</SheetTitle>
          <SheetDescription className="text-xs">Key fields of the selected row.</SheetDescription>
        </SheetHeader>
        <div className="panel-body overflow-y-auto">
          <div className="property-grid">
            {entries.map(([key, value]) => (
              <div key={key}>
                <div className="property-label">{key.replaceAll('_', ' ')}</div>
                <div className="property-value">{String(value)}</div>
              </div>
            ))}
          </div>
          <details style={{ marginTop: 16 }}>
            <summary>Technical details</summary>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: 10 }}>{JSON.stringify(shown, null, 2)}</pre>
          </details>
        </div>
      </SheetContent>
    </Sheet>
  );
}

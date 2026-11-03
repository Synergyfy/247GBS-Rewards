import { X } from 'lucide-react';

interface QuickLookSheetProps {
  row: unknown;
  onClose: () => void;
}

// Relations are skipped so the preview shows the row's own scalar fields
const HIDDEN_KEYS = ['business', 'campaign', 'customer', 'user'];

export function QuickLookSheet({ row, onClose }: QuickLookSheetProps) {
  if (!row || typeof row !== 'object') return null;
  const entries = Object.entries(row as Record<string, unknown>)
    .filter(
      ([key, value]) => !HIDDEN_KEYS.includes(key) && ['string', 'number', 'boolean'].includes(typeof value),
    )
    .slice(0, 8);

  return (
    <div
      className="sheet-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="detail-sheet" role="dialog" aria-label="Quick look">
        <header className="panel-head">
          <strong className="panel-title">Quick look</strong>
          <button className="icon-button" aria-label="Close quick look" onClick={onClose}>
            <X />
          </button>
        </header>
        <div className="panel-body">
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
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: 10 }}>{JSON.stringify(row, null, 2)}</pre>
          </details>
        </div>
      </section>
    </div>
  );
}

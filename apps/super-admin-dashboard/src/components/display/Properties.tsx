import { isValidElement, type ReactNode } from 'react';

type PropertyValue = ReactNode | Date;

function display(value: PropertyValue): ReactNode {
  if (value === null || value === undefined || value === '' || value === false) return '—';
  // Links and other elements render as-is; everything else is shown as text
  if (isValidElement(value)) return value;
  return String(value);
}

/** §9B right-column "Properties" key/value panel on detail pages. */
export function Properties({ items }: { items: Array<[string, PropertyValue]> }) {
  return (
    <section className="panel properties-panel">
      <header className="panel-head">
        <h2 className="panel-title">Properties</h2>
      </header>
      <div className="panel-body property-grid">
        {items.map(([label, value]) => (
          <div key={label}>
            <div className="property-label">{label}</div>
            <div className="property-value">{display(value)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

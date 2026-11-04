import type { CSSProperties, ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

export function PageHeader({
  title,
  description,
  breadcrumb,
  actions,
}: {
  title: string;
  description?: string;
  breadcrumb?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        {breadcrumb && (
          <div className="page-description" style={{ marginBottom: 2 }}>
            {breadcrumb}
          </div>
        )}
        <h1 className="page-title">{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </header>
  );
}

export interface Kpi {
  label: string;
  value: string | number;
  /** Percent change vs the previous period; `null` = no baseline. Omit for metrics without a trend. */
  delta?: number | null;
  /** What the delta compares, for the tooltip (e.g. "New users vs previous 30 days"). */
  deltaLabel?: string;
  /** Daily values for an optional sparkline. */
  trend?: number[];
}

/** Tiny inline SVG trend line; decorative, the delta carries the meaning. */
function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const width = 64;
  const height = 18;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const points = values
    .map((value, i) => `${((i / (values.length - 1)) * width).toFixed(1)},${(height - 1 - ((value - min) / span) * (height - 2)).toFixed(1)}`)
    .join(' ');
  return (
    <svg className="kpi-sparkline" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <polyline points={points} fill="none" stroke="var(--chart-1)" strokeWidth="1.25" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function Delta({ value, label }: { value: number | null; label?: string }) {
  if (value === null) {
    return (
      <div className="kpi-delta neutral" title={label}>
        <Minus aria-hidden="true" />
        No prior data
      </div>
    );
  }
  const rounded = Math.round(value * 10) / 10;
  const tone = rounded > 0 ? 'up' : rounded < 0 ? 'down' : 'neutral';
  const Icon = tone === 'up' ? ArrowUpRight : tone === 'down' ? ArrowDownRight : Minus;
  return (
    <div className={`kpi-delta ${tone}`} title={label}>
      <Icon aria-hidden="true" />
      <span className="tabular-nums">
        {rounded > 0 ? '+' : ''}
        {rounded.toLocaleString(undefined, { maximumFractionDigits: 1 })}%
      </span>
      <span className="sr-only"> {label ?? 'vs previous period'}</span>
      <span aria-hidden="true">vs prev.</span>
    </div>
  );
}

/** §9A KPI strip: cards separated by 1px lines; value cross-fades when it changes. */
export function KpiStrip({ items }: { items: Kpi[] }) {
  return (
    // Wide screens fit every tile on one row, however many there are
    <div className="kpi-strip" style={{ '--kpi-cols': items.length } as CSSProperties}>
      {items.map((item) => {
        const display = typeof item.value === 'number' ? item.value.toLocaleString() : item.value;
        return (
          <div className="kpi-cell" key={item.label}>
            <div className="kpi-label">{item.label}</div>
            <div className="kpi-row">
              {/* Keyed on the value so a new number re-runs the fade-in */}
              <div className="kpi-value" key={display}>
                {display}
              </div>
              {item.trend && <Sparkline values={item.trend} />}
            </div>
            {item.delta !== undefined && <Delta value={item.delta} label={item.deltaLabel} />}
          </div>
        );
      })}
    </div>
  );
}

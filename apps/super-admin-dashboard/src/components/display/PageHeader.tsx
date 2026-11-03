import type { ReactNode } from 'react';
export function PageHeader({ title, description, breadcrumb, actions }: { title: string; description?: string; breadcrumb?: string; actions?: ReactNode }) {
  return <header className="page-header"><div>{breadcrumb && <div className="page-description" style={{ marginBottom: 2 }}>{breadcrumb}</div>}<h1 className="page-title">{title}</h1>{description && <p className="page-description">{description}</p>}</div>{actions && <div className="page-actions">{actions}</div>}</header>;
}
export interface Kpi { label: string; value: string | number; delta?: string; }
export function KpiStrip({ items }: { items: Kpi[] }) {
  return <div className="kpi-strip">{items.map((item) => <div className="kpi-cell" key={item.label}><div className="kpi-label">{item.label}</div><div className="kpi-value">{typeof item.value === 'number' ? item.value.toLocaleString() : item.value}</div>{item.delta && <div className="kpi-delta">{item.delta}</div>}</div>)}</div>;
}

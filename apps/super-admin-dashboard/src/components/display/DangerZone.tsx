import type { ReactNode } from 'react';

/** §9B: destructive actions live only here (and in overflow menus), never as header buttons. */
export function DangerZone({ description, children }: { description: ReactNode; children: ReactNode }) {
  return (
    <section className="panel" style={{ marginTop: 12, borderColor: 'color-mix(in srgb, var(--destructive) 35%, var(--border))' }}>
      <header className="panel-head">
        <h2 className="panel-title" style={{ color: 'var(--destructive)' }}>
          Danger zone
        </h2>
        <div style={{ display: 'flex', gap: 6 }}>{children}</div>
      </header>
      <div className="panel-body text-muted-foreground">{description}</div>
    </section>
  );
}

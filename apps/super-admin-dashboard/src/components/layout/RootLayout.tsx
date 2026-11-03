import { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { useHotkeys } from '@/hooks/useHotkeys';
import { BreadcrumbContext, type Crumb } from '@/lib/breadcrumb-context';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CommandPalette } from './CommandPalette';
import { QuickLookSheet } from './QuickLookSheet';
import { ShortcutsSheet } from './ShortcutsSheet';

const COLLAPSED_KEY = 'sa_sidebar_collapsed';

// Authenticated shell: owns which overlay is open and hands the pieces their state
export function RootLayout() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [quickLook, setQuickLook] = useState<unknown>(null);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSED_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [crumbs, setCrumbs] = useState<Crumb[] | null>(null);
  const breadcrumbs = useMemo(() => ({ crumbs, setCrumbs }), [crumbs]);
  const location = useLocation();

  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const openSearch = useCallback(() => setPaletteOpen(true), []);
  const openShortcuts = useCallback(() => setShortcutsOpen(true), []);
  useHotkeys({ onSearch: openSearch, onShortcuts: openShortcuts });

  // DataTable rows announce quick-look requests on window
  useEffect(() => {
    const handler = (event: Event) => setQuickLook((event as CustomEvent<{ row: unknown }>).detail.row);
    window.addEventListener('quick-look', handler);
    return () => window.removeEventListener('quick-look', handler);
  }, []);

  // Navigating closes the mobile nav and any quick look
  useEffect(() => {
    setMobileOpen(false);
    setQuickLook(null);
  }, [location.pathname]);

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem(COLLAPSED_KEY, String(next));
    } catch {
      /* storage unavailable: keep the in-memory state */
    }
  }

  return (
    <BreadcrumbContext.Provider value={breadcrumbs}>
    <div className={`app-shell ${collapsed ? 'collapsed' : ''}`}>
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={toggleCollapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="workspace">
        <Topbar onOpenNav={() => setMobileOpen(true)} onOpenSearch={() => setPaletteOpen(true)} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <QuickLookSheet row={quickLook} onClose={() => setQuickLook(null)} />
      <ShortcutsSheet open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
    </BreadcrumbContext.Provider>
  );
}

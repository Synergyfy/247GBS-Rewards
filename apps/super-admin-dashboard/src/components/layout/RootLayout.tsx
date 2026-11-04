import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigation } from 'react-router';
import { useHotkeys } from '@/hooks/useHotkeys';
import { BreadcrumbContext, type Crumb } from '@/lib/breadcrumb-context';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

// Overlays load on first use so they stay out of the initial bundle (§10: shell, login and overview only)
const CommandPalette = lazy(() => import('./CommandPalette').then((m) => ({ default: m.CommandPalette })));
const QuickLookSheet = lazy(() => import('./QuickLookSheet').then((m) => ({ default: m.QuickLookSheet })));
const ShortcutsSheet = lazy(() => import('./ShortcutsSheet').then((m) => ({ default: m.ShortcutsSheet })));

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
  // Pending lazy route or loader (§9A: 2px top progress bar; no page transition)
  const navigating = useNavigation().state !== 'idle';

  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  // Once an overlay has been opened it stays mounted, so its close animation can play
  const [mounted, setMounted] = useState({ palette: false, shortcuts: false, quickLook: false });
  if (paletteOpen && !mounted.palette) setMounted((m) => ({ ...m, palette: true }));
  if (shortcutsOpen && !mounted.shortcuts) setMounted((m) => ({ ...m, shortcuts: true }));
  if (quickLook && !mounted.quickLook) setMounted((m) => ({ ...m, quickLook: true }));
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
      {navigating && <div className="route-progress" role="progressbar" aria-label="Loading page" />}
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
      <Suspense fallback={null}>
        {mounted.palette && <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />}
        {mounted.quickLook && <QuickLookSheet row={quickLook} onClose={() => setQuickLook(null)} />}
        {mounted.shortcuts && <ShortcutsSheet open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />}
      </Suspense>
    </div>
    </BreadcrumbContext.Provider>
  );
}

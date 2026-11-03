import { useMemo, useState } from 'react';
import { ChevronDown, LogOut, Menu, Moon, Search, Sun } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { clearSession, getSessionUser } from '@/lib/session';
import { useTheme } from '@/lib/useTheme';
import { useCurrentCrumbs, type Crumb } from '@/lib/breadcrumb-context';
import { pageLabels } from './nav';

interface TopbarProps {
  onOpenNav: () => void;
  onOpenSearch: () => void;
}

export function Topbar({ onOpenNav, onOpenSearch }: TopbarProps) {
  const [accountOpen, setAccountOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const client = useQueryClient();
  const { theme, toggleTheme } = useTheme();
  const user = getSessionUser();
  const pageCrumbs = useCurrentCrumbs();
  // Detail pages publish a named ownership chain; otherwise derive from the path (ids shown as "…")
  const crumbs = useMemo<Crumb[]>(() => {
    if (pageCrumbs) return pageCrumbs;
    const pieces = location.pathname.split('/').filter(Boolean);
    return pieces.map((piece, i) => ({
      label: pageLabels[piece] ?? '…',
      to: i < pieces.length - 1 && pageLabels[piece] ? `/${piece}` : undefined,
    }));
  }, [pageCrumbs, location.pathname]);

  function logout() {
    clearSession();
    client.clear();
    navigate('/login', { replace: true });
  }

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={onOpenNav}>
          <Menu />
        </button>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="inline-link">
            Monitor
          </Link>
          {crumbs.map((crumb, i) => (
            <span key={`${crumb.label}-${i}`}>
              /{' '}
              {i === crumbs.length - 1 ? (
                <strong aria-current="page">{crumb.label}</strong>
              ) : crumb.to ? (
                <Link to={crumb.to} className="inline-link">
                  {crumb.label}
                </Link>
              ) : (
                crumb.label
              )}
            </span>
          ))}
        </nav>
      </div>
      <div className="topbar-actions">
        <button className="button" onClick={onOpenSearch} aria-label="Search entities">
          <Search />
          Search<span className="cell-muted hide-mobile">⌘K</span>
        </button>
        <div style={{ position: 'relative' }}>
          <button
            className="button ghost"
            onClick={() => setAccountOpen((open) => !open)}
            aria-expanded={accountOpen}
          >
            <span className="avatar">{(user?.name ?? 'SA').slice(0, 1)}</span>
            <span className="hide-mobile">{user?.name ?? 'Super Admin'}</span>
            <ChevronDown size={12} />
          </button>
          {accountOpen && (
            <div className="account-menu">
              <button onClick={toggleTheme}>
                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}Appearance: {theme}
              </button>
              <button onClick={logout}>
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

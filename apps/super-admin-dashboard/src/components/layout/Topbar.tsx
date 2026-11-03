import { useMemo } from 'react';
import { ChevronDown, LogOut, Menu, Moon, Search, Sun } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { clearSession, getSessionUser } from '@/lib/session';
import { useTheme } from '@/lib/useTheme';
import { useCurrentCrumbs, type Crumb } from '@/lib/breadcrumb-context';
import { pageLabels } from './nav';

interface TopbarProps {
  onOpenNav: () => void;
  onOpenSearch: () => void;
}

/** §9B top bar (44px): ownership breadcrumb, ⌘K search and the account menu. */
export function Topbar({ onOpenNav, onOpenSearch }: TopbarProps) {
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
      <div className="flex min-w-0 items-center gap-2">
        <Button variant="ghost" size="icon" className="mobile-menu text-muted-foreground" aria-label="Open navigation" onClick={onOpenNav}>
          <Menu />
        </Button>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="inline-link">
            Monitor
          </Link>
          {crumbs.map((crumb, i) => (
            <span key={`${crumb.label}-${i}`} className="truncate">
              /{' '}
              {i === crumbs.length - 1 ? (
                <strong aria-current="page" className="font-medium text-foreground">
                  {crumb.label}
                </strong>
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
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onOpenSearch} aria-label="Search entities">
          <Search />
          Search
          <kbd className="text-[11px] text-muted-foreground max-md:hidden">⌘K</kbd>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" aria-label="Account menu">
              <span className="avatar">{(user?.name ?? 'SA').slice(0, 1)}</span>
              <span className="max-md:hidden">{user?.name ?? 'Super Admin'}</span>
              <ChevronDown className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-48">
            <DropdownMenuLabel className="text-xs">
              <div className="font-medium">{user?.name ?? 'Super Admin'}</div>
              {user?.email && <div className="font-normal text-muted-foreground">{user.email}</div>}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="h-7 text-xs" onSelect={toggleTheme}>
              {theme === 'dark' ? <Sun /> : <Moon />}
              Switch to {theme === 'dark' ? 'light' : 'dark'} mode
            </DropdownMenuItem>
            <DropdownMenuItem className="h-7 text-xs" onSelect={logout}>
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

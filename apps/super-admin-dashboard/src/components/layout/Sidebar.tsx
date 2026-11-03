import { NavLink } from 'react-router';
import { navGroups } from './nav';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {mobileOpen && <div className="sidebar-scrim" onClick={onCloseMobile} />}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''} ${collapsed ? 'collapsed' : ''}`}>
        <div className="brand">
          <span className="brand-mark">247</span>
          <span className="brand-copy">
            247GBS Rewards<span className="brand-sub">SUPER ADMIN</span>
          </span>
        </div>
        <nav className="nav-scroll" aria-label="Main navigation">
          {navGroups.map((group) => (
            <section className="nav-group" key={group.label}>
              <h2 className="nav-caption">{group.label}</h2>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon aria-hidden="true" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </section>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span>247GBS · v0.1.0</span>
          <button
            className="icon-button collapse-button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            ‹
          </button>
        </div>
      </aside>
    </>
  );
}

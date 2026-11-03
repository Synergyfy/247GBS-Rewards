import { useEffect, useRef } from 'react';
import { Command } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { navItems } from './nav';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

// TODO (§9B): search users, businesses and campaigns with cmdk; today it lists pages only
export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  if (!open) return null;
  return (
    <div
      className="command-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="command-box" role="dialog" aria-modal="true" aria-label="Search dashboard">
        <input
          ref={searchRef}
          placeholder="Search pages and entities…"
          onKeyDown={(event) => {
            if (event.key === 'Escape') onClose();
            if (event.key === 'Enter') {
              const query = event.currentTarget.value.toLowerCase();
              const match = navItems.find((item) => item.label.toLowerCase().includes(query));
              if (match) {
                navigate(match.path);
                onClose();
              }
            }
          }}
        />
        <div className="command-results">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} onClick={onClose}>
              {item.label}
              <span className="cell-muted" style={{ float: 'right' }}>
                Open page
              </span>
            </Link>
          ))}
          <div className="cell-muted" style={{ padding: '7px 8px' }}>
            <Command size={12} style={{ verticalAlign: 'middle' }} /> Press Enter to open the closest match
          </div>
        </div>
      </div>
    </div>
  );
}

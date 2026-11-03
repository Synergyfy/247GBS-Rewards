import { useEffect } from 'react';

interface HotkeyHandlers {
  onSearch: () => void;
  onShortcuts: () => void;
}

function isEditing(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  return Boolean(
    el &&
    (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable),
  );
}

/** The row's primary link (entity name) if it has one, otherwise its first focusable control. */
function rowTarget(row: HTMLTableRowElement): HTMLElement | null {
  return row.querySelector<HTMLElement>('a.cell-link') ?? row.querySelector<HTMLElement>('a,button');
}

/**
 * §9B shortcuts: ⌘K/Ctrl+K search · `/` table filter · `j`/`k` rows · Enter open · Space quick look · `?` list.
 * Esc is handled by each Radix dialog/sheet. Page shortcuts are skipped while typing or while a dialog is open.
 */
export function useHotkeys({ onSearch, onShortcuts }: HotkeyHandlers) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onSearch();
        return;
      }
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || isEditing(event.target))
        return;
      if (document.querySelector('[role="dialog"][data-state="open"]')) return;

      if (event.key === '?') {
        event.preventDefault();
        onShortcuts();
        return;
      }
      if (event.key === '/') {
        const filter = document.querySelector<HTMLInputElement>('input[data-table-filter]');
        if (filter) {
          event.preventDefault();
          filter.focus();
        }
        return;
      }
      if (event.key === 'j' || event.key === 'k') {
        const rows = Array.from(document.querySelectorAll<HTMLTableRowElement>('main tbody tr'));
        if (!rows.length) return;
        const current = rows.indexOf(document.activeElement?.closest('tr') as HTMLTableRowElement);
        const next =
          current === -1 ? 0 : Math.max(0, Math.min(rows.length - 1, current + (event.key === 'j' ? 1 : -1)));
        event.preventDefault();
        const row = rows[next];
        if (row) rowTarget(row)?.focus();
        return;
      }
      // Enter on the focused row's link opens it natively; Space opens quick look for that row
      if (event.key === ' ') {
        const row = document.activeElement?.closest('main tbody tr');
        const quickLook = row?.querySelector<HTMLButtonElement>('button[aria-label="Quick look"]');
        if (row && quickLook && document.activeElement?.tagName !== 'BUTTON') {
          event.preventDefault();
          quickLook.click();
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onSearch, onShortcuts]);
}

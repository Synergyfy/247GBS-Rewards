import { useEffect } from 'react';
export function useHotkeys(openSearch: () => void) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const editing = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openSearch(); }
      if (!editing && event.key === '/') { event.preventDefault(); document.querySelector<HTMLInputElement>('.list-search input')?.focus(); }
      if (event.key === 'Escape') window.dispatchEvent(new CustomEvent('close-overlays'));
      if (!editing && (event.key === 'j' || event.key === 'k')) {
        const rows = Array.from(document.querySelectorAll<HTMLTableRowElement>('tbody tr'));
        const active = document.activeElement?.closest('tr'); const index = rows.indexOf(active as HTMLTableRowElement);
        const next = Math.max(0, Math.min(rows.length - 1, index + (event.key === 'j' ? 1 : -1)));
        rows[next]?.querySelector<HTMLElement>('a,button')?.focus();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openSearch]);
}

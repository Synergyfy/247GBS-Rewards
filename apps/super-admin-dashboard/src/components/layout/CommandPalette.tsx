import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { Building2, Loader2, Megaphone, ShieldCheck, UserRound } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useEntitySearch, type EntitySearchGroup } from '@/services/hooks';
import { navItems } from './nav';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

interface ResultItem {
  id: string;
  title: string;
  meta: string;
  to: string;
}

// Dense cmdk styling per §9A: 32px input row, 28px items, 11px group headings
const ITEM = 'h-7 gap-2 rounded-sm px-2 text-[13px] [&_svg]:size-3.5 data-[selected=true]:bg-primary-tint data-[selected=true]:text-foreground';
const GROUP = '[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide';

function ResultGroup<T>({
  heading,
  icon,
  group,
  toItem,
  onSelect,
}: {
  heading: string;
  icon: ReactNode;
  group: EntitySearchGroup<T>;
  toItem: (row: T) => ResultItem;
  onSelect: (to: string) => void;
}) {
  if (group.notAvailable) {
    return (
      <CommandGroup heading={heading} className={GROUP}>
        <div className="px-2 py-1 text-xs text-muted-foreground">Search for this type is not available yet.</div>
      </CommandGroup>
    );
  }
  if (group.error) {
    return (
      <CommandGroup heading={heading} className={GROUP}>
        <div className="px-2 py-1 text-xs text-destructive">Could not search {heading.toLowerCase()}.</div>
      </CommandGroup>
    );
  }
  if (!group.items.length) return null;
  return (
    <CommandGroup heading={heading} className={GROUP}>
      {group.items.map(toItem).map((item) => (
        <CommandItem key={item.id} value={`${heading}:${item.id}`} onSelect={() => onSelect(item.to)} className={ITEM}>
          {icon}
          <span className="truncate">{item.title}</span>
          <span className="ml-auto truncate text-xs text-muted-foreground">{item.meta}</span>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}

/** §9B ⌘K palette: search admins, businesses, campaigns and customers, grouped by type. */
export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [term, setTerm] = useState('');
  const debounced = useDebouncedValue(term);
  const search = useEntitySearch(debounced);
  const navigate = useNavigate();
  const pages = navItems.filter((item) => item.label.toLowerCase().includes(term.trim().toLowerCase()));
  const pending = term.trim().length >= 2 && (term !== debounced || [search.admins, search.businesses, search.campaigns, search.customers].some((group) => group.isLoading));

  function go(to: string) {
    navigate(to);
    close();
  }
  function close() {
    setTerm('');
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && close()}>
      <DialogContent showCloseButton={false} className="top-[15vh] w-[min(calc(100vw-1.75rem),36rem)] translate-y-0 gap-0 overflow-hidden p-0">
        <DialogTitle className="sr-only">Search dashboard</DialogTitle>
        <DialogDescription className="sr-only">Search admins, businesses, campaigns, customers and pages.</DialogDescription>
        {/* Results come from the server, so cmdk's own fuzzy filter is off */}
        <Command shouldFilter={false} className="[&_[cmdk-input-wrapper]]:h-9">
          <div className="relative">
            <CommandInput value={term} onValueChange={setTerm} placeholder="Search name, email or code…" className="h-9 text-[13px]" />
            {pending && <Loader2 aria-label="Searching" className="absolute top-2.5 right-3 size-3.5 animate-spin text-muted-foreground" />}
          </div>
          <CommandList className="max-h-[min(60vh,420px)] p-1">
            {!pending && <CommandEmpty className="py-6 text-center text-xs text-muted-foreground">No matches.</CommandEmpty>}
            {pages.length > 0 && (
              <CommandGroup heading="Pages" className={GROUP}>
                {pages.map((item) => {
                  const Icon = item.icon;
                  return (
                    <CommandItem key={item.path} value={`page:${item.path}`} onSelect={() => go(item.path)} className={ITEM}>
                      <Icon />
                      {item.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
            {search.enabled && debounced === term && (
              <>
                <ResultGroup
                  heading="Admins"
                  icon={<ShieldCheck />}
                  group={search.admins}
                  toItem={(row) => ({ id: row.id, title: row.fullName, meta: row.email, to: `/admins/${row.id}` })}
                  onSelect={go}
                />
                <ResultGroup
                  heading="Businesses"
                  icon={<Building2 />}
                  group={search.businesses}
                  toItem={(row) => ({ id: row.id, title: row.name, meta: row.user?.fullName ?? row.email, to: `/businesses/${row.id}` })}
                  onSelect={go}
                />
                <ResultGroup
                  heading="Campaigns"
                  icon={<Megaphone />}
                  group={search.campaigns}
                  toItem={(row) => ({ id: row.id, title: row.name, meta: row.uniqueCode, to: `/campaigns/${row.id}` })}
                  onSelect={go}
                />
                <ResultGroup
                  heading="Customers"
                  icon={<UserRound />}
                  group={search.customers}
                  toItem={(row) => ({ id: row.id, title: `${row.firstName} ${row.lastName}`, meta: row.email, to: `/customers/${row.id}` })}
                  onSelect={go}
                />
              </>
            )}
          </CommandList>
          <div className="flex items-center gap-3 border-t border-border px-3 py-1.5 text-[11px] text-muted-foreground">
            <span>↑↓ to move</span>
            <span>↵ to open</span>
            <span>esc to close</span>
            <span className="ml-auto">Type 2+ characters to search records</span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useAdmins, useUser } from '@/services/hooks';
import { cn } from '@/lib/utils';
import type { User } from '@/services/types';

type AdminOption = Pick<User, 'id' | 'fullName' | 'email'>;

const PAGE = 20;

/**
 * Searchable admin combobox. Searches the API as you type (name, email or phone), so every admin can be
 * picked however many there are. A preselected `value` (e.g. from `?ownerId=`) is resolved to its name.
 */
export function AdminPicker({
  id,
  value,
  onChange,
}: {
  id?: string;
  value: string;
  onChange: (adminId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState('');
  const [picked, setPicked] = useState<AdminOption | null>(null);
  const search = useDebouncedValue(term.trim());
  const results = useAdmins({ search: search || undefined, page: 1, limit: PAGE, sort: 'fullName', order: 'ASC' });
  // Only look the admin up when the value didn't come from a pick in this session
  const preselected = useUser(value && picked?.id !== value ? value : '');
  const selected: AdminOption | null =
    picked?.id === value ? picked : value && preselected.data ? preselected.data : null;

  const rows = results.data?.data ?? [];
  const total = results.data?.total ?? 0;
  const searching = results.isFetching || term.trim() !== search;

  let label = 'Select an admin';
  if (selected) label = `${selected.fullName} · ${selected.email}`;
  else if (value && preselected.isLoading) label = 'Loading…';

  return (
    // modal: the picker usually sits inside a Dialog, whose scroll lock would otherwise swallow wheel scrolling
    <Popover
      modal
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setTerm('');
      }}
    >
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between font-normal', !selected && 'text-muted-foreground')}
        >
          <span className="truncate">{label}</span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-(--radix-popover-trigger-width) p-0">
        {/* Results come from the API already filtered, so cmdk must not filter them again */}
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search name, email or phone…" value={term} onValueChange={setTerm} />
          <CommandList>
            {!searching && <CommandEmpty>{results.error ? 'Could not load admins.' : 'No admins found.'}</CommandEmpty>}
            {searching && !rows.length && <div className="py-6 text-center text-[13px] text-muted-foreground">Searching…</div>}
            {rows.length > 0 && (
              <CommandGroup>
                {rows.map((admin) => (
                  <CommandItem
                    key={admin.id}
                    value={admin.id}
                    onSelect={() => {
                      setPicked({ id: admin.id, fullName: admin.fullName, email: admin.email });
                      onChange(admin.id);
                      setOpen(false);
                      setTerm('');
                    }}
                  >
                    <Check className={cn('size-4', admin.id === value ? 'opacity-100' : 'opacity-0')} />
                    <span className="truncate">{admin.fullName}</span>
                    <span className="ml-auto truncate text-xs text-muted-foreground">{admin.email}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {total > rows.length && (
              <div className="border-t px-3 py-2 text-xs text-muted-foreground">
                Showing {rows.length} of {total}. Keep typing to narrow the list.
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

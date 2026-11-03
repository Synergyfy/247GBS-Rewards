import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { format, parseISO, subDays } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import type { DateRange as DayPickerRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toDay, type DateRange } from '@/lib/date-range';

const PRESETS = [7, 30, 90] as const;

/** §9C Overview date range: calendar in a popover, with 7/30/90-day presets. Emits yyyy-MM-dd strings. */
export function DateRangePicker({
  value,
  onChange,
}: {
  value: DateRange;
  onChange: (from: string, to: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DayPickerRange | undefined>(undefined);
  const selected: DayPickerRange = draft ?? { from: parseISO(value.from), to: parseISO(value.to) };
  const label = `${format(parseISO(value.from), 'd MMM')} – ${format(parseISO(value.to), 'd MMM yyyy')}`;

  function applyPreset(days: number) {
    const today = new Date();
    onChange(toDay(subDays(today, days - 1)), toDay(today));
    setDraft(undefined);
    setOpen(false);
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setDraft(undefined);
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline" aria-label={`Reporting period: ${label}`}>
          <CalendarDays />
          <span className="tabular-nums">{label}</span>
          <span className="text-muted-foreground">· {value.days}d</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-0">
        <div className="flex gap-1 border-b border-border p-2">
          {PRESETS.map((days) => (
            <Button key={days} variant="outline" onClick={() => applyPreset(days)}>
              Last {days} days
            </Button>
          ))}
        </div>
        <Calendar
          mode="range"
          numberOfMonths={2}
          defaultMonth={subDays(parseISO(value.to), 31)}
          selected={selected}
          disabled={{ after: new Date() }}
          onSelect={(_range, day) => {
            // First click starts a fresh range; the second click completes it (in either order)
            if (!draft?.from) {
              setDraft({ from: day, to: undefined });
              return;
            }
            const [start, end] = draft.from <= day ? [draft.from, day] : [day, draft.from];
            onChange(toDay(start), toDay(end));
            setDraft(undefined);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

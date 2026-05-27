'use client';
import { Label } from '@/components/ui/label';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function DatePicker() {
  const [date, setDate] = React.useState<Date>();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

const DateRange = () => {
  return (
    <div className="flex flex-col space-y-6 mt-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="active-from">Active From</Label>

        <DatePicker />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="expires">Expires</Label>

        <DatePicker />
      </div>
    </div>
  );
};

export default DateRange;

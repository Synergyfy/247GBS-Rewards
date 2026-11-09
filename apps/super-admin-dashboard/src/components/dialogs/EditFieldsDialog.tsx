import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export interface EditField {
  name: string;
  label: string;
  value: string | null | undefined;
  type?: 'text' | 'email' | 'tel' | 'url';
  required?: boolean;
  /** Section heading rendered above this field. */
  group?: string;
}

/**
 * Small edit form for a record's plain-text fields. Only fields whose value changed are passed to
 * `onSubmit`; an optional field cleared to empty is sent as `null`.
 */
export function EditFieldsDialog({
  open,
  onOpenChange,
  title,
  description,
  fields,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  fields: EditField[];
  onSubmit: (changes: Record<string, string | null>) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const changes: Record<string, string | null> = {};
    for (const field of fields) {
      const next = String(form.get(field.name) ?? '').trim();
      if (next === (field.value ?? '')) continue;
      changes[field.name] = next === '' && !field.required ? null : next;
    }
    if (!Object.keys(changes).length) {
      onOpenChange(false);
      return;
    }
    setBusy(true);
    try {
      await onSubmit(changes);
      onOpenChange(false);
    } catch {
      // The caller reports the error; keep the dialog open so the input isn't lost
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {/* Remount on open so defaults reflect the latest record */}
        {open && (
          <form onSubmit={submit} className="grid gap-3">
            {fields.map((field) => (
              <div key={field.name} className="grid gap-1">
                {field.group && <div className="mt-1 text-xs font-semibold text-muted-foreground">{field.group}</div>}
                <Label htmlFor={`edit-${field.name}`} className="text-xs">
                  {field.label}
                  {!field.required && ' (optional)'}
                </Label>
                <Input
                  id={`edit-${field.name}`}
                  name={field.name}
                  type={field.type ?? 'text'}
                  required={field.required}
                  defaultValue={field.value ?? ''}
                />
              </div>
            ))}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={busy}>
                {busy ? 'Saving…' : 'Save changes'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

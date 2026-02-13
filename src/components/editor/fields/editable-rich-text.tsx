'use client';

import { Textarea } from '@/components/ui/textarea';

interface EditableRichTextProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export function EditableRichText({ label, value, onChange, placeholder, rows = 3 }: EditableRichTextProps) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</label>
      <Textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || label}
        rows={rows}
        className="text-sm resize-none"
      />
    </div>
  );
}

'use client';

import { Input } from '@/components/ui/input';

interface EditableTextProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}

export function EditableText({ label, value, onChange, placeholder, type = 'text' }: EditableTextProps) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-zinc-500">{label}</label>
      <Input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || label}
        className="h-8 text-sm"
      />
    </div>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { EditableText } from '../fields/editable-text';
import { EditableRichText } from '../fields/editable-rich-text';
import { FieldWrapper } from '../fields/field-wrapper';
import type { ResumeSection, CustomContent, CustomItem } from '@/types/resume';

interface Props {
  section: ResumeSection;
  onUpdate: (content: Partial<CustomContent>) => void;
}

export function CustomSection({ section, onUpdate }: Props) {
  const t = useTranslations('editor.fields');
  const content = section.content as CustomContent;
  const items = content.items || [];

  const addItem = () => {
    const newItem: CustomItem = { id: crypto.randomUUID(), title: '', description: '' };
    onUpdate({ items: [...items, newItem] } as any);
  };

  const updateItem = (index: number, data: Partial<CustomItem>) => {
    const updated = items.map((item, i) => (i === index ? { ...item, ...data } : item));
    onUpdate({ items: updated } as any);
  };

  const removeItem = (index: number) => {
    onUpdate({ items: items.filter((_, i) => i !== index) } as any);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id || `custom-${index}`}>
          {index > 0 && <Separator className="mb-4" />}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">#{index + 1}</span>
              <Button variant="ghost" size="sm" className="h-7 cursor-pointer p-1 text-zinc-400 hover:text-red-500" onClick={() => removeItem(index)}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
            <FieldWrapper>
              <EditableText label="Title" value={item.title} onChange={(v) => updateItem(index, { title: v })} />
              <EditableText label="Date" value={item.date || ''} onChange={(v) => updateItem(index, { date: v })} />
            </FieldWrapper>
            <EditableRichText label={t('description')} value={item.description} onChange={(v) => updateItem(index, { description: v })} />
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addItem} className="w-full cursor-pointer gap-1">
        <Plus className="h-3.5 w-3.5" />
        {t('addItem')}
      </Button>
    </div>
  );
}

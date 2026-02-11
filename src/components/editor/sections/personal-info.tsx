'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Camera, X } from 'lucide-react';
import { EditableText } from '../fields/editable-text';
import { FieldWrapper } from '../fields/field-wrapper';
import type { ResumeSection, PersonalInfoContent } from '@/types/resume';

interface Props {
  section: ResumeSection;
  onUpdate: (content: Partial<PersonalInfoContent>) => void;
}

function resizeImage(file: File, maxSize: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function PersonalInfoSection({ section, onUpdate }: Props) {
  const t = useTranslations('editor.fields');
  const content = section.content as PersonalInfoContent;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await resizeImage(file, 200);
    onUpdate({ avatar: dataUrl });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      {/* Avatar upload */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-zinc-300 bg-zinc-50 transition-colors hover:border-zinc-400 hover:bg-zinc-100"
        >
          {content.avatar ? (
            <img src={content.avatar} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            <Camera className="h-6 w-6 text-zinc-400" />
          )}
        </button>
        {content.avatar && (
          <button
            type="button"
            onClick={() => onUpdate({ avatar: '' })}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-200 text-zinc-500 transition-colors hover:bg-zinc-300 hover:text-zinc-700"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden"
        />
      </div>

      <FieldWrapper>
        <EditableText label={t('fullName')} value={content.fullName} onChange={(v) => onUpdate({ fullName: v })} />
        <EditableText label={t('jobTitle')} value={content.jobTitle} onChange={(v) => onUpdate({ jobTitle: v })} />
      </FieldWrapper>
      <FieldWrapper>
        <EditableText label={t('email')} value={content.email} onChange={(v) => onUpdate({ email: v })} type="email" />
        <EditableText label={t('phone')} value={content.phone} onChange={(v) => onUpdate({ phone: v })} type="tel" />
      </FieldWrapper>
      <FieldWrapper>
        <EditableText label={t('location')} value={content.location} onChange={(v) => onUpdate({ location: v })} />
        <EditableText label={t('website')} value={content.website || ''} onChange={(v) => onUpdate({ website: v })} />
      </FieldWrapper>
    </div>
  );
}

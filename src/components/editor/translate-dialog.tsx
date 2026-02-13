'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useResumeStore } from '@/stores/resume-store';
import { Languages, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface TranslateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeId: string;
}

type TranslateState = 'idle' | 'translating' | 'success' | 'error';

const LANGUAGE_OPTIONS = [
  { value: 'zh', label: 'chinese', flag: '🇨🇳' },
  { value: 'en', label: 'english', flag: '🇺🇸' },
  { value: 'ja', label: 'japanese', flag: '🇯🇵' },
  { value: 'ko', label: 'korean', flag: '🇰🇷' },
  { value: 'fr', label: 'french', flag: '🇫🇷' },
  { value: 'de', label: 'german', flag: '🇩🇪' },
  { value: 'es', label: 'spanish', flag: '🇪🇸' },
  { value: 'pt', label: 'portuguese', flag: '🇧🇷' },
  { value: 'ru', label: 'russian', flag: '🇷🇺' },
  { value: 'ar', label: 'arabic', flag: '🇸🇦' },
] as const;

export function TranslateDialog({ open, onOpenChange, resumeId }: TranslateDialogProps) {
  const t = useTranslations('translate');
  const currentResume = useResumeStore((s) => s.currentResume);

  const currentLanguage = currentResume?.language || 'en';
  const defaultTarget = currentLanguage === 'zh' ? 'en' : 'zh';

  const [targetLanguage, setTargetLanguage] = useState(defaultTarget);
  const [state, setState] = useState<TranslateState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Reset state when dialog opens, and recalculate default target language
  useEffect(() => {
    if (open) {
      setState('idle');
      setErrorMessage('');
      const lang = useResumeStore.getState().currentResume?.language || 'en';
      setTargetLanguage(lang === 'zh' ? 'en' : 'zh');
    }
  }, [open]);

  const handleTranslate = useCallback(async () => {
    setState('translating');
    setErrorMessage('');

    try {
      const fingerprint = localStorage.getItem('jade_fingerprint');
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(fingerprint ? { 'x-fingerprint': fingerprint } : {}),
        },
        body: JSON.stringify({ resumeId, targetLanguage }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Translation failed');
      }

      const data = await res.json();
      const current = useResumeStore.getState().currentResume;

      if (current) {
        useResumeStore.getState().setResume({
          ...current,
          language: data.language,
          sections: data.sections,
        });
      }

      setState('success');

      // Auto-close after 1.5s
      setTimeout(() => {
        onOpenChange(false);
      }, 1500);
    } catch (err: any) {
      setState('error');
      setErrorMessage(err.message || t('error'));
    }
  }, [resumeId, targetLanguage, onOpenChange, t]);

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o && state !== 'translating') onOpenChange(false); }}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-pink-500" />
            {t('title')}
          </DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5 space-y-4">
          {/* Language Selector */}
          {state === 'idle' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {t('targetLanguage')}
              </label>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value} className="cursor-pointer">
                      <span className="mr-2">{lang.flag}</span>
                      {t(lang.label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Translating State */}
          {state === 'translating' && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-pink-500 mb-3" />
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {t('translating')}
              </p>
            </div>
          )}

          {/* Success State */}
          {state === 'success' && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <CheckCircle2 className="h-8 w-8 text-green-500 mb-3" />
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {t('success')}
              </p>
            </div>
          )}

          {/* Error State */}
          {state === 'error' && (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mb-3" />
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                {errorMessage || t('error')}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="border-t border-zinc-100 px-6 py-4 dark:border-zinc-800">
          {state === 'idle' && (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="cursor-pointer"
              >
                {t('close')}
              </Button>
              <Button
                onClick={handleTranslate}
                className="cursor-pointer bg-pink-500 hover:bg-pink-600"
              >
                {t('translateAll')}
              </Button>
            </>
          )}
          {state === 'error' && (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="cursor-pointer"
              >
                {t('close')}
              </Button>
              <Button
                onClick={handleTranslate}
                className="cursor-pointer bg-pink-500 hover:bg-pink-600"
              >
                {t('translateAll')}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
import { useResumeStore } from '@/stores/resume-store';
import { LanguageSelect } from '@/components/ui/language-select';
import { Languages, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface TranslateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeId: string;
}

type TranslateState = 'idle' | 'translating' | 'success' | 'error';

interface Progress {
  completed: number;
  total: number;
}

/** Read an NDJSON stream line by line, calling onLine for each parsed JSON object. */
async function readNDJSON(
  response: Response,
  onLine: (data: Record<string, unknown>) => void
) {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop()!;

    for (const line of lines) {
      if (!line.trim()) continue;
      onLine(JSON.parse(line));
    }
  }

  // Handle remaining buffer
  if (buffer.trim()) {
    onLine(JSON.parse(buffer));
  }
}

export function TranslateDialog({ open, onOpenChange, resumeId }: TranslateDialogProps) {
  const t = useTranslations('translate');
  const currentResume = useResumeStore((s) => s.currentResume);

  const currentLanguage = currentResume?.language || 'en';
  const defaultTarget = currentLanguage === 'zh' ? 'en' : 'zh';

  const [targetLanguage, setTargetLanguage] = useState(defaultTarget);
  const [state, setState] = useState<TranslateState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [progress, setProgress] = useState<Progress>({ completed: 0, total: 0 });
  const [failedCount, setFailedCount] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setState('idle');
      setErrorMessage('');
      setProgress({ completed: 0, total: 0 });
      setFailedCount(0);
      const lang = useResumeStore.getState().currentResume?.language || 'en';
      setTargetLanguage(lang === 'zh' ? 'en' : 'zh');
    } else {
      abortRef.current?.abort();
      abortRef.current = null;
    }
  }, [open]);

  const handleTranslate = useCallback(async () => {
    setState('translating');
    setErrorMessage('');
    setProgress({ completed: 0, total: 0 });
    setFailedCount(0);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const fingerprint = localStorage.getItem('jade_fingerprint');
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(fingerprint ? { 'x-fingerprint': fingerprint } : {}),
        },
        body: JSON.stringify({ resumeId, targetLanguage }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Translation failed');
      }

      await readNDJSON(res, (data) => {
        if (data.type === 'progress') {
          setProgress({
            completed: data.completed as number,
            total: data.total as number,
          });

          // Apply each translated section to the store in real-time
          const section = data.section as { sectionId: string; title: string; content: any } | undefined;
          if (section) {
            const current = useResumeStore.getState().currentResume;
            if (current) {
              useResumeStore.getState().setResume({
                ...current,
                sections: current.sections.map((s: any) =>
                  s.id === section.sectionId
                    ? { ...s, title: section.title, content: section.content }
                    : s
                ),
              });
            }
          }
        } else if (data.type === 'done') {
          // Final sync — set language and ensure all sections are up-to-date
          const current = useResumeStore.getState().currentResume;
          if (current) {
            useResumeStore.getState().setResume({
              ...current,
              language: data.language as string,
              sections: data.sections as any,
            });
          }

          const failed = (data.failedCount as number) || 0;
          setFailedCount(failed);
          setState('success');

          setTimeout(() => {
            onOpenChange(false);
          }, 1500);
        }
      });
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setState('error');
      setErrorMessage(err.message || t('error'));
    }
  }, [resumeId, targetLanguage, onOpenChange, t]);

  const progressPercent = progress.total > 0
    ? Math.round((progress.completed / progress.total) * 100)
    : 0;

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
              <LanguageSelect value={targetLanguage} onValueChange={setTargetLanguage} />
            </div>
          )}

          {/* Translating State */}
          {state === 'translating' && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-pink-500 mb-3" />
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                {progress.total > 0
                  ? t('progress', { completed: progress.completed, total: progress.total })
                  : t('translating')}
              </p>
              {progress.total > 0 && (
                <div className="w-full max-w-xs">
                  <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-pink-500 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Success State */}
          {state === 'success' && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <CheckCircle2 className="h-8 w-8 text-green-500 mb-3" />
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {failedCount > 0
                  ? t('partialSuccess', { failed: failedCount })
                  : t('success')}
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

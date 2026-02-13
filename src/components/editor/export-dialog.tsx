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
import { useResumeStore } from '@/stores/resume-store';
import { usePdfExport } from '@/hooks/use-pdf-export';
import {
  FileDown,
  FileText,
  Globe,
  AlignLeft,
  Braces,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeId: string;
}

type ExportFormat = 'pdf' | 'docx' | 'html' | 'txt' | 'json';
type ExportState = 'idle' | 'exporting' | 'success' | 'error';

const FORMAT_OPTIONS: {
  value: ExportFormat;
  icon: typeof FileDown;
  labelKey: string;
  descKey: string;
}[] = [
  { value: 'pdf', icon: FileDown, labelKey: 'pdf', descKey: 'pdfDescription' },
  { value: 'docx', icon: FileText, labelKey: 'docx', descKey: 'docxDescription' },
  { value: 'html', icon: Globe, labelKey: 'html', descKey: 'htmlDescription' },
  { value: 'txt', icon: AlignLeft, labelKey: 'txt', descKey: 'txtDescription' },
  { value: 'json', icon: Braces, labelKey: 'json', descKey: 'jsonDescription' },
];

export function ExportDialog({ open, onOpenChange, resumeId }: ExportDialogProps) {
  const t = useTranslations('export');
  const { currentResume, sections, isDirty, save } = useResumeStore();
  const { exportPdf, isExporting: isPdfExporting } = usePdfExport();

  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [state, setState] = useState<ExportState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (open) {
      setState('idle');
      setErrorMessage('');
      setSelectedFormat('pdf');
    }
  }, [open]);

  const handleExport = useCallback(async () => {
    setState('exporting');
    setErrorMessage('');

    try {
      // Save first if dirty
      if (isDirty) await save();

      if (selectedFormat === 'pdf') {
        if (!currentResume) throw new Error('No resume loaded');
        await exportPdf({ ...currentResume, sections });
        setState('success');
        setTimeout(() => onOpenChange(false), 1500);
        return;
      }

      // For other formats, call the API
      const fingerprint = localStorage.getItem('jade_fingerprint');
      const res = await fetch(`/api/resume/${resumeId}/export?format=${selectedFormat}`, {
        headers: {
          ...(fingerprint ? { 'x-fingerprint': fingerprint } : {}),
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Export failed');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      const title = currentResume?.title || 'resume';
      const extMap: Record<string, string> = {
        docx: 'docx',
        html: 'html',
        txt: 'txt',
        json: 'json',
      };
      a.download = `${title}.${extMap[selectedFormat]}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setState('success');
      setTimeout(() => onOpenChange(false), 1500);
    } catch (err: any) {
      setState('error');
      setErrorMessage(err.message || t('error'));
    }
  }, [resumeId, selectedFormat, currentResume, sections, isDirty, save, exportPdf, onOpenChange, t]);

  const isLoading = state === 'exporting' || isPdfExporting;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o && !isLoading) onOpenChange(false); }}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5 text-pink-500" />
            {t('title')}
          </DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5">
          {state === 'idle' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {FORMAT_OPTIONS.map((format) => {
                const Icon = format.icon;
                const isSelected = selectedFormat === format.value;
                return (
                  <button
                    key={format.value}
                    onClick={() => setSelectedFormat(format.value)}
                    className={`cursor-pointer flex flex-col items-center gap-2 rounded-lg border-2 p-4 text-center transition-all duration-150 hover:border-pink-300 hover:bg-pink-50/50 dark:hover:border-pink-700 dark:hover:bg-pink-950/20 ${
                      isSelected
                        ? 'border-pink-500 bg-pink-50 dark:border-pink-500 dark:bg-pink-950/30'
                        : 'border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900'
                    }`}
                  >
                    <Icon className={`h-6 w-6 ${isSelected ? 'text-pink-500' : 'text-zinc-500 dark:text-zinc-400'}`} />
                    <span className={`text-sm font-medium ${isSelected ? 'text-pink-600 dark:text-pink-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
                      {t(format.labelKey)}
                    </span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">
                      {t(format.descKey)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {state === 'exporting' && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-pink-500 mb-3" />
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {t('exporting')}
              </p>
            </div>
          )}

          {state === 'success' && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle2 className="h-8 w-8 text-green-500 mb-3" />
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {t('success')}
              </p>
            </div>
          )}

          {state === 'error' && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mb-3" />
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                {errorMessage || t('error')}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-zinc-100 px-6 py-4 dark:border-zinc-800">
          {(state === 'idle' || state === 'error') && (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="cursor-pointer"
              >
                {t('cancel')}
              </Button>
              <Button
                onClick={handleExport}
                disabled={isLoading}
                className="cursor-pointer bg-pink-500 hover:bg-pink-600"
              >
                {t('export')}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

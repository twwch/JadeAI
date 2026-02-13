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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useResumeStore } from '@/stores/resume-store';
import { usePdfExport } from '@/hooks/use-pdf-export';
import { FileDown, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface PdfOptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeId: string;
}

type PdfState = 'idle' | 'exporting' | 'success' | 'error';

interface PdfOptions {
  pageSize: 'A4' | 'LETTER';
  margins: { top: number; right: number; bottom: number; left: number };
  watermark: boolean;
  watermarkText: string;
  headerText: string;
  footerText: string;
}

const DEFAULT_OPTIONS: PdfOptions = {
  pageSize: 'A4',
  margins: { top: 32, right: 32, bottom: 32, left: 32 },
  watermark: false,
  watermarkText: '',
  headerText: '',
  footerText: '',
};

export function PdfOptionsDialog({ open, onOpenChange, resumeId }: PdfOptionsDialogProps) {
  const t = useTranslations('pdfOptions');
  const mt = useTranslations('themeEditor.margin');
  const { currentResume, sections, isDirty, save } = useResumeStore();
  const { exportPdf, isExporting } = usePdfExport();

  const [options, setOptions] = useState<PdfOptions>(DEFAULT_OPTIONS);
  const [state, setState] = useState<PdfState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (open) {
      setState('idle');
      setErrorMessage('');
      setOptions(DEFAULT_OPTIONS);
    }
  }, [open]);

  const updateMargin = (side: 'top' | 'right' | 'bottom' | 'left', value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0) {
      setOptions((prev) => ({
        ...prev,
        margins: { ...prev.margins, [side]: num },
      }));
    }
  };

  const handleExport = useCallback(async () => {
    setState('exporting');
    setErrorMessage('');

    try {
      if (!currentResume) throw new Error('No resume loaded');
      if (isDirty) await save();

      await exportPdf({ ...currentResume, sections }, options);

      setState('success');
      setTimeout(() => onOpenChange(false), 1500);
    } catch (err: any) {
      setState('error');
      setErrorMessage(err.message || 'Export failed');
    }
  }, [currentResume, sections, isDirty, save, exportPdf, options, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o && state !== 'exporting') onOpenChange(false); }}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5 text-pink-500" />
            {t('title')}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5">
          {state === 'idle' && (
            <>
              {/* Page Size */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {t('pageSize')}
                </Label>
                <div className="flex gap-2">
                  {(['A4', 'LETTER'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setOptions((prev) => ({ ...prev, pageSize: size }))}
                      className={`cursor-pointer flex-1 rounded-md border-2 px-4 py-2 text-sm font-medium transition-all ${
                        options.pageSize === size
                          ? 'border-pink-500 bg-pink-50 text-pink-600 dark:bg-pink-950/30 dark:text-pink-400'
                          : 'border-zinc-200 text-zinc-600 hover:border-pink-300 dark:border-zinc-700 dark:text-zinc-400'
                      }`}
                    >
                      {size === 'A4' ? t('a4') : t('letter')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Margins */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {t('margins')}
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
                    <div key={side} className="space-y-1">
                      <span className="text-xs text-zinc-400">{mt(side)}</span>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={options.margins[side]}
                        onChange={(e) => updateMargin(side, e.target.value)}
                        className="h-8 text-center text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Watermark */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {t('watermark')}
                  </Label>
                  <Switch
                    checked={options.watermark}
                    onCheckedChange={(checked) =>
                      setOptions((prev) => ({ ...prev, watermark: checked }))
                    }
                    className="cursor-pointer"
                  />
                </div>
                {options.watermark && (
                  <Input
                    placeholder={t('watermarkText')}
                    value={options.watermarkText}
                    onChange={(e) =>
                      setOptions((prev) => ({ ...prev, watermarkText: e.target.value }))
                    }
                    className="text-sm"
                  />
                )}
              </div>

              {/* Header Text */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {t('headerText')}
                </Label>
                <Input
                  placeholder={t('headerText')}
                  value={options.headerText}
                  onChange={(e) =>
                    setOptions((prev) => ({ ...prev, headerText: e.target.value }))
                  }
                  className="text-sm"
                />
              </div>

              {/* Footer Text */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {t('footerText')}
                </Label>
                <Input
                  placeholder={t('footerText')}
                  value={options.footerText}
                  onChange={(e) =>
                    setOptions((prev) => ({ ...prev, footerText: e.target.value }))
                  }
                  className="text-sm"
                />
              </div>
            </>
          )}

          {state === 'exporting' && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-pink-500 mb-3" />
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {t('export')}...
              </p>
            </div>
          )}

          {state === 'success' && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle2 className="h-8 w-8 text-green-500 mb-3" />
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                PDF exported!
              </p>
            </div>
          )}

          {state === 'error' && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mb-3" />
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                {errorMessage}
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
                disabled={isExporting}
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

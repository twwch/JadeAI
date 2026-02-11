'use client';

import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TEMPLATES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Upload, FileText, Image, X, Loader2 } from 'lucide-react';

interface CreateResumeDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: { title?: string; template?: string; language?: string }) => Promise<any>;
}

type Tab = 'template' | 'upload';

const ACCEPTED_EXTENSIONS = '.pdf,.png,.jpg,.jpeg,.webp';

export function CreateResumeDialog({ open, onClose, onCreate }: CreateResumeDialogProps) {
  const t = useTranslations();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('template');
  const [title, setTitle] = useState('');
  const [template, setTemplate] = useState<string>('classic');
  const [isCreating, setIsCreating] = useState(false);

  // Upload state
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const resume = await onCreate({ title: title || undefined, template });
      if (resume) {
        resetAndClose();
        router.push(`/editor/${resume.id}`);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    setParseError('');
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(selectedFile.type)) {
      setParseError(t('dashboard.upload.invalidType'));
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setParseError(t('dashboard.upload.fileTooLarge'));
      return;
    }
    setFile(selectedFile);
  };

  const handleUploadParse = async () => {
    if (!file) return;
    setIsParsing(true);
    setParseError('');

    try {
      const fingerprint = typeof window !== 'undefined' ? localStorage.getItem('jade_fingerprint') : null;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('template', template);

      const res = await fetch('/api/resume/parse', {
        method: 'POST',
        headers: fingerprint ? { 'x-fingerprint': fingerprint } : {},
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Parse failed');
      }

      const resume = await res.json();
      resetAndClose();
      router.push(`/editor/${resume.id}`);
    } catch (err: any) {
      setParseError(err.message || t('dashboard.upload.parseFailed'));
    } finally {
      setIsParsing(false);
    }
  };

  const resetAndClose = () => {
    onClose();
    setTitle('');
    setTemplate('classic');
    setTab('template');
    setFile(null);
    setParseError('');
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const templateLabels: Record<string, string> = {
    classic: t('dashboard.templateClassic'),
    modern: t('dashboard.templateModern'),
    minimal: t('dashboard.templateMinimal'),
  };

  const fileIcon = file?.type === 'application/pdf' ? FileText : Image;
  const FileIcon = fileIcon;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && resetAndClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('dashboard.createResume')}</DialogTitle>
          <DialogDescription>{t('dashboard.createResumeDescription')}</DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 rounded-lg bg-zinc-100 p-1">
          <button
            type="button"
            className={cn(
              'flex-1 cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              tab === 'template'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700'
            )}
            onClick={() => setTab('template')}
          >
            {t('dashboard.upload.fromTemplate')}
          </button>
          <button
            type="button"
            className={cn(
              'flex-1 cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              tab === 'upload'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700'
            )}
            onClick={() => setTab('upload')}
          >
            {t('dashboard.upload.fromFile')}
          </button>
        </div>

        <div className="space-y-4 py-2">
          {tab === 'template' ? (
            /* From Template tab */
            <>
              <div>
                <Input
                  placeholder={t('editor.fields.fullName')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-zinc-700">
                  {t('editor.toolbar.template')}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {TEMPLATES.map((tpl) => (
                    <button
                      key={tpl}
                      type="button"
                      className={cn(
                        'cursor-pointer rounded-lg border-2 p-3 text-center text-sm transition-all duration-200',
                        template === tpl
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : 'border-zinc-200 hover:border-zinc-300'
                      )}
                      onClick={() => setTemplate(tpl)}
                    >
                      {templateLabels[tpl]}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Upload File tab */
            <>
              {/* Dropzone */}
              <div
                className={cn(
                  'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
                  isDragging
                    ? 'border-pink-400 bg-pink-50'
                    : file
                      ? 'border-green-300 bg-green-50'
                      : 'border-zinc-300 hover:border-zinc-400'
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {file ? (
                  <div className="flex items-center gap-3">
                    <FileIcon className="h-8 w-8 text-green-600" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-zinc-700">{file.name}</p>
                      <p className="text-xs text-zinc-500">
                        {(file.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      className="cursor-pointer rounded-full p-1 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600"
                      onClick={() => setFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="mb-2 h-8 w-8 text-zinc-400" />
                    <p className="text-sm text-zinc-600">{t('dashboard.upload.dropzone')}</p>
                    <p className="mt-1 text-xs text-zinc-400">{t('dashboard.upload.acceptedTypes')}</p>
                    <button
                      type="button"
                      className="mt-3 cursor-pointer rounded-md bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-200"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {t('dashboard.upload.browse')}
                    </button>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_EXTENSIONS}
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileSelect(f);
                    e.target.value = '';
                  }}
                />
              </div>

              {parseError && (
                <p className="text-sm text-red-500">{parseError}</p>
              )}

              {/* Template selector for uploaded file */}
              <div>
                <p className="mb-2 text-sm font-medium text-zinc-700">
                  {t('editor.toolbar.template')}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {TEMPLATES.map((tpl) => (
                    <button
                      key={tpl}
                      type="button"
                      className={cn(
                        'cursor-pointer rounded-lg border-2 p-3 text-center text-sm transition-all duration-200',
                        template === tpl
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : 'border-zinc-200 hover:border-zinc-300'
                      )}
                      onClick={() => setTemplate(tpl)}
                    >
                      {templateLabels[tpl]}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={resetAndClose} className="cursor-pointer">
            {t('common.cancel')}
          </Button>
          {tab === 'template' ? (
            <Button
              onClick={handleCreate}
              disabled={isCreating}
              className="cursor-pointer bg-pink-500 hover:bg-pink-600"
            >
              {isCreating ? t('common.loading') : t('common.create')}
            </Button>
          ) : (
            <Button
              onClick={handleUploadParse}
              disabled={!file || isParsing}
              className="cursor-pointer bg-pink-500 hover:bg-pink-600"
            >
              {isParsing ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  {t('dashboard.upload.parsing')}
                </>
              ) : (
                t('dashboard.upload.uploadAndParse')
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

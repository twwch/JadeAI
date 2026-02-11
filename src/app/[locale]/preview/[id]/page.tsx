'use client';

import { use, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/i18n/routing';
import { ResumePreview } from '@/components/preview/resume-preview';
import { usePdfExport } from '@/hooks/use-pdf-export';
import type { Resume } from '@/types/resume';

export default function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const t = useTranslations();
  const { exportPdf, isExporting } = usePdfExport();
  const [resume, setResume] = useState<Resume | null>(null);

  useEffect(() => {
    const fingerprint = localStorage.getItem('jade_fingerprint');
    fetch(`/api/resume/${id}`, {
      headers: fingerprint ? { 'x-fingerprint': fingerprint } : {},
    })
      .then((res) => res.json())
      .then(setResume)
      .catch(console.error);
  }, [id]);

  if (!resume) {
    return <div className="flex h-screen items-center justify-center text-zinc-400">{t('common.loading')}</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-2">
        <Button variant="ghost" size="sm" onClick={() => router.push(`/editor/${id}`)} className="cursor-pointer gap-1">
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </Button>
        <Button
          size="sm"
          disabled={isExporting}
          onClick={() => exportPdf(resume)}
          className="cursor-pointer gap-1 bg-pink-500 hover:bg-pink-600"
        >
          <Download className="h-4 w-4" />
          {isExporting ? t('pdf.exporting') : t('editor.toolbar.export')}
        </Button>
      </div>
      <div className="p-8">
        <ResumePreview resume={resume} />
      </div>
    </div>
  );
}

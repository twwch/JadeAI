'use client';

import { useMemo, useState } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ResumePreview } from '@/components/preview/resume-preview';
import { useResumeStore } from '@/stores/resume-store';
import type { Resume } from '@/types/resume';

// A4 width in px (at 96 dpi)
const A4_WIDTH = 794;

export function EditorPreviewPanel() {
  const t = useTranslations('editor.toolbar');
  const { currentResume, sections } = useResumeStore();
  const [zoom, setZoom] = useState(80);

  const liveResume = useMemo<Resume | null>(() => {
    if (!currentResume) return null;
    return { ...currentResume, sections };
  }, [currentResume, sections]);

  if (!liveResume) return null;

  const scale = zoom / 100;

  return (
    <div data-tour="preview" className="flex min-w-0 flex-[6] flex-col border-l bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b bg-white px-4 py-2 dark:bg-background dark:border-zinc-800">
        <span className="text-xs font-medium text-zinc-500">{t('preview')}</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 cursor-pointer p-0"
            onClick={() => setZoom((z) => Math.max(30, z - 10))}
            disabled={zoom <= 30}
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <span className="w-10 text-center text-xs text-zinc-500">{zoom}%</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 cursor-pointer p-0"
            onClick={() => setZoom((z) => Math.min(150, z + 10))}
            disabled={zoom >= 150}
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Preview body */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex justify-center p-4">
          <div
            className="bg-white shadow-md"
            style={{
              width: A4_WIDTH,
              zoom: scale,
            }}
          >
            <ResumePreview resume={liveResume} />
          </div>
        </div>
      </div>
    </div>
  );
}

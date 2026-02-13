'use client';

import { use, useEffect } from 'react';
import { useEditor } from '@/hooks/use-editor';
import { useFingerprint } from '@/hooks/use-fingerprint';
import { EditorToolbar } from '@/components/editor/editor-toolbar';
import { EditorSidebar } from '@/components/editor/editor-sidebar';
import { EditorCanvas } from '@/components/editor/editor-canvas';
import { ThemeEditor } from '@/components/editor/theme-editor';
import { EditorPreviewPanel } from '@/components/editor/editor-preview-panel';
import { AIChatBubble } from '@/components/ai/ai-chat-bubble';
import { SettingsDialog } from '@/components/settings/settings-dialog';
import { JdAnalysisDialog } from '@/components/editor/jd-analysis-dialog';
import { TranslateDialog } from '@/components/editor/translate-dialog';
import { ExportDialog } from '@/components/editor/export-dialog';
import { ShareDialog } from '@/components/editor/share-dialog';
import { CoverLetterDialog } from '@/components/editor/cover-letter-dialog';
import { GrammarCheckDialog } from '@/components/editor/grammar-check-dialog';
import { TourOverlay, type TourStepConfig } from '@/components/tour/tour-overlay';
import { useEditorStore } from '@/stores/editor-store';
import { useUIStore } from '@/stores/ui-store';
import { useSettingsStore } from '@/stores/settings-store';
import { useTourStore, hasCompletedTour } from '@/stores/tour-store';
import { Skeleton } from '@/components/ui/skeleton';

const EDITOR_TOUR_STEPS: TourStepConfig[] = [
  { target: 'sidebar', placement: 'right', i18nKey: 'sidebar' },
  { target: 'preview', placement: 'left', i18nKey: 'preview' },
  { target: 'ai-chat', placement: 'top', i18nKey: 'aiChat' },
  { target: 'export', placement: 'bottom', i18nKey: 'export' },
  { target: 'theme', placement: 'bottom', i18nKey: 'theme' },
];

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isLoading: fpLoading } = useFingerprint();
  const { resume, sections, updateSection, addSection, removeSection, reorderSections } = useEditor(id);
  const { showThemeEditor } = useEditorStore();
  const { activeModal, openModal, closeModal } = useUIStore();
  const { hydrate, _hydrated } = useSettingsStore();
  const startTour = useTourStore((s) => s.startTour);

  useEffect(() => {
    if (!_hydrated) hydrate();
  }, [_hydrated, hydrate]);

  useEffect(() => {
    if (!resume) return;
    if (hasCompletedTour('editor')) return;
    if (window.innerWidth < 768) return;
    const timer = setTimeout(() => startTour('editor', EDITOR_TOUR_STEPS.length), 1000);
    return () => clearTimeout(timer);
  }, [resume, startTour]);

  if (fpLoading || !resume) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="space-y-4 w-64">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <EditorToolbar resumeId={id} />
      <div className="flex flex-1 overflow-hidden">
        <EditorSidebar
          sections={sections}
          onAddSection={addSection}
          onReorderSections={reorderSections}
        />
        <EditorCanvas
          sections={sections}
          onUpdateSection={updateSection}
          onRemoveSection={removeSection}
          onReorderSections={reorderSections}
        />
        {showThemeEditor && <ThemeEditor />}
        <EditorPreviewPanel />
      </div>
      <AIChatBubble resumeId={id} />
      <SettingsDialog />
      <JdAnalysisDialog
        open={activeModal === 'jd-analysis'}
        onOpenChange={(open) => open ? openModal('jd-analysis') : closeModal()}
        resumeId={id}
      />
      <TranslateDialog
        open={activeModal === 'translate'}
        onOpenChange={(open) => open ? openModal('translate') : closeModal()}
        resumeId={id}
      />
      <ExportDialog
        open={activeModal === 'export'}
        onOpenChange={(open) => open ? openModal('export') : closeModal()}
        resumeId={id}
      />
      <ShareDialog
        open={activeModal === 'share'}
        onOpenChange={(open) => open ? openModal('share') : closeModal()}
        resumeId={id}
      />
      <CoverLetterDialog
        open={activeModal === 'cover-letter'}
        onOpenChange={(open) => open ? openModal('cover-letter') : closeModal()}
        resumeId={id}
      />
      <GrammarCheckDialog
        open={activeModal === 'grammar-check'}
        onOpenChange={(open) => open ? openModal('grammar-check') : closeModal()}
        resumeId={id}
      />
      <TourOverlay tourId="editor" steps={EDITOR_TOUR_STEPS} />
    </div>
  );
}

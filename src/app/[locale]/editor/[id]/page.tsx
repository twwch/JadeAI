'use client';

import { use } from 'react';
import { useEditor } from '@/hooks/use-editor';
import { useFingerprint } from '@/hooks/use-fingerprint';
import { EditorToolbar } from '@/components/editor/editor-toolbar';
import { EditorSidebar } from '@/components/editor/editor-sidebar';
import { EditorCanvas } from '@/components/editor/editor-canvas';
import { AIChatPanel } from '@/components/ai/ai-chat-panel';
import { useEditorStore } from '@/stores/editor-store';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isLoading: fpLoading } = useFingerprint();
  const { resume, sections, updateSection, addSection, removeSection, reorderSections } = useEditor(id);
  const { showAiPanel } = useEditorStore();

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
        />
        <EditorCanvas
          sections={sections}
          onUpdateSection={updateSection}
          onRemoveSection={removeSection}
          onReorderSections={reorderSections}
        />
        {showAiPanel && <AIChatPanel resumeId={id} />}
      </div>
    </div>
  );
}

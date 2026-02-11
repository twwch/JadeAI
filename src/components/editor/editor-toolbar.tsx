'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { ArrowLeft, Undo2, Redo2, Eye, Download, MessageSquare, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useEditorStore } from '@/stores/editor-store';
import { useResumeStore } from '@/stores/resume-store';
import { LocaleSwitcher } from '@/components/layout/locale-switcher';

interface EditorToolbarProps {
  resumeId: string;
}

export function EditorToolbar({ resumeId }: EditorToolbarProps) {
  const t = useTranslations('editor.toolbar');
  const router = useRouter();
  const { toggleAiPanel, showAiPanel, undo, redo, undoStack, redoStack } = useEditorStore();
  const { isSaving, isDirty, currentResume, reorderSections, save } = useResumeStore();
  const sections = useResumeStore((s) => s.sections);

  const handleUndo = () => {
    const snapshot = undo();
    if (snapshot) {
      reorderSections(snapshot.sections);
    }
  };

  const handleRedo = () => {
    const snapshot = redo();
    if (snapshot) {
      reorderSections(snapshot.sections);
    }
  };

  return (
    <div className="flex h-12 items-center justify-between border-b bg-white px-3">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard')}
          className="cursor-pointer gap-1 text-zinc-600"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <span className="max-w-48 truncate text-sm font-medium text-zinc-900">
          {currentResume?.title || ''}
        </span>
        <span className="text-xs text-zinc-400">
          {isSaving ? t('saving') : isDirty ? '' : t('autoSaved')}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleUndo}
          disabled={undoStack.length === 0}
          className="cursor-pointer"
          title={t('undo')}
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRedo}
          disabled={redoStack.length === 0}
          className="cursor-pointer"
          title={t('redo')}
        >
          <Redo2 className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <Button
          variant="ghost"
          size="sm"
          onClick={async () => {
            if (isDirty) await save();
            router.push(`/preview/${resumeId}`);
          }}
          className="cursor-pointer"
          title={t('preview')}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant={showAiPanel ? 'secondary' : 'ghost'}
          size="sm"
          onClick={toggleAiPanel}
          className="cursor-pointer"
          title={t('settings')}
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <LocaleSwitcher />
      </div>
    </div>
  );
}

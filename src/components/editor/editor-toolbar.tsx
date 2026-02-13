'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { ArrowLeft, Undo2, Redo2, Download, Settings, Palette, Save, FileSearch, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useEditorStore } from '@/stores/editor-store';
import { useResumeStore } from '@/stores/resume-store';
import { useUIStore } from '@/stores/ui-store';
import { useSettingsStore } from '@/stores/settings-store';
import { usePdfExport } from '@/hooks/use-pdf-export';
import { LocaleSwitcher } from '@/components/layout/locale-switcher';

interface EditorToolbarProps {
  resumeId: string;
}

export function EditorToolbar({ resumeId }: EditorToolbarProps) {
  const t = useTranslations('editor.toolbar');
  const router = useRouter();
  const { toggleThemeEditor, showThemeEditor, undo, redo, undoStack, redoStack } = useEditorStore();
  const { isSaving, isDirty, currentResume, sections, reorderSections, save } = useResumeStore();
  const { openModal } = useUIStore();
  const autoSave = useSettingsStore((s) => s.autoSave);
  const { exportPdf, isExporting } = usePdfExport();

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

  const handleExportPdf = async () => {
    if (!currentResume) return;
    // Save first if dirty
    if (isDirty) await save();
    await exportPdf({ ...currentResume, sections });
  };

  return (
    <div className="flex h-12 items-center justify-between border-b bg-white px-3 dark:bg-background dark:border-zinc-800">
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
        <span className="max-w-48 truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {currentResume?.title || ''}
        </span>
        <span className="text-xs text-zinc-400">
          {isSaving ? t('saving') : isDirty ? (autoSave ? '' : t('unsaved')) : t('autoSaved')}
        </span>
        {!autoSave && isDirty && !isSaving && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => save()}
            className="cursor-pointer gap-1 text-pink-600 hover:text-pink-700 hover:bg-pink-50"
          >
            <Save className="h-3.5 w-3.5" />
            <span className="text-xs">{t('save')}</span>
          </Button>
        )}
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
          onClick={handleExportPdf}
          disabled={isExporting}
          className="cursor-pointer"
          title={t('exportPdf')}
        >
          <Download className="h-4 w-4" />
          <span className="ml-1 text-xs hidden sm:inline">{isExporting ? t('exporting') : t('exportPdf')}</span>
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => openModal('jd-analysis')}
          className="cursor-pointer"
          title={t('jdAnalysis')}
        >
          <FileSearch className="h-4 w-4" />
          <span className="ml-1 text-xs hidden sm:inline">{t('jdAnalysis')}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => openModal('translate')}
          className="cursor-pointer"
          title={t('translate')}
        >
          <Languages className="h-4 w-4" />
          <span className="ml-1 text-xs hidden sm:inline">{t('translate')}</span>
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <Button
          variant={showThemeEditor ? 'secondary' : 'ghost'}
          size="sm"
          onClick={toggleThemeEditor}
          className="cursor-pointer"
          title={t('theme')}
        >
          <Palette className="h-4 w-4" />
          <span className="ml-1 text-xs hidden sm:inline">{t('theme')}</span>
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => openModal('settings')}
          className="cursor-pointer"
          title={t('settings')}
        >
          <Settings className="h-4 w-4" />
        </Button>
        <LocaleSwitcher />
      </div>
    </div>
  );
}

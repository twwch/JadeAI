'use client';

import { useTranslations } from 'next-intl';
import { Plus, GripVertical, User, FileText, Briefcase, GraduationCap, Wrench, FolderKanban, Award, Languages, LayoutList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useEditorStore } from '@/stores/editor-store';
import type { ResumeSection } from '@/types/resume';
import { SECTION_TYPES, type SectionType } from '@/lib/constants';

const sectionIcons: Record<string, React.ElementType> = {
  personal_info: User,
  summary: FileText,
  work_experience: Briefcase,
  education: GraduationCap,
  skills: Wrench,
  projects: FolderKanban,
  certifications: Award,
  languages: Languages,
  custom: LayoutList,
};

interface EditorSidebarProps {
  sections: ResumeSection[];
  onAddSection: (section: ResumeSection) => void;
}

export function EditorSidebar({ sections, onAddSection }: EditorSidebarProps) {
  const t = useTranslations('editor');
  const { selectedSectionId, selectSection } = useEditorStore();

  const sectionTypeLabels: Record<string, string> = {
    personal_info: t('sections.personalInfo'),
    summary: t('sections.summary'),
    work_experience: t('sections.workExperience'),
    education: t('sections.education'),
    skills: t('sections.skills'),
    projects: t('sections.projects'),
    certifications: t('sections.certifications'),
    languages: t('sections.languages'),
    custom: t('sections.custom'),
  };

  const existingTypes = new Set(sections.map((s) => s.type));
  const availableTypes = SECTION_TYPES.filter((type) => {
    if (type === 'custom') return true;
    return !existingTypes.has(type);
  });

  const handleAddSection = (type: SectionType) => {
    const newSection: ResumeSection = {
      id: crypto.randomUUID(),
      resumeId: '',
      type,
      title: sectionTypeLabels[type] || type,
      sortOrder: sections.length,
      visible: true,
      content: type === 'personal_info'
        ? { fullName: '', jobTitle: '', email: '', phone: '', location: '' }
        : type === 'summary'
          ? { text: '' }
          : type === 'skills'
            ? { categories: [] }
            : { items: [] },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    onAddSection(newSection);
  };

  return (
    <div className="w-56 shrink-0 border-r bg-white dark:bg-zinc-900 dark:border-zinc-800">
      <div className="p-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          {t('sidebar.sections')}
        </h3>
      </div>
      <ScrollArea className="h-[calc(100vh-7rem)]">
        <div className="space-y-0.5 px-2">
          {sections.map((section) => {
            const Icon = sectionIcons[section.type] || LayoutList;
            return (
              <button
                key={section.id}
                type="button"
                className={`flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors duration-150 ${
                  selectedSectionId === section.id
                    ? 'bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300'
                    : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
                onClick={() => selectSection(section.id)}
              >
                <GripVertical className="h-3 w-3 shrink-0 text-zinc-300" />
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{section.title}</span>
              </button>
            );
          })}
        </div>

        {availableTypes.length > 0 && (
          <>
            <Separator className="my-3" />
            <div className="px-2 pb-4">
              <p className="mb-2 px-2 text-xs text-zinc-400">{t('sidebar.addSection')}</p>
              <div className="space-y-0.5">
                {availableTypes.map((type) => {
                  const Icon = sectionIcons[type] || LayoutList;
                  return (
                    <button
                      key={type}
                      type="button"
                      className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-zinc-500 transition-colors duration-150 hover:bg-zinc-50 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                      onClick={() => handleAddSection(type)}
                    >
                      <Plus className="h-3 w-3 shrink-0" />
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{sectionTypeLabels[type]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </ScrollArea>
    </div>
  );
}

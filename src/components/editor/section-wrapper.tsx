'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { GripVertical, X, Eye, EyeOff, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditorStore } from '@/stores/editor-store';
import { useResumeStore } from '@/stores/resume-store';
import { useDragHandle } from './dnd/sortable-section';
import type { ResumeSection, SectionContent } from '@/types/resume';
import { PersonalInfoSection } from './sections/personal-info';
import { SummarySection } from './sections/summary';
import { WorkExperienceSection } from './sections/work-experience';
import { EducationSection } from './sections/education';
import { SkillsSection } from './sections/skills';
import { ProjectsSection } from './sections/projects';
import { CertificationsSection } from './sections/certifications';
import { LanguagesSection } from './sections/languages';
import { CustomSection } from './sections/custom-section';

interface SectionWrapperProps {
  section: ResumeSection;
  onUpdate: (content: Partial<SectionContent>) => void;
  onRemove: () => void;
}

const sectionComponents: Record<string, React.ComponentType<{ section: ResumeSection; onUpdate: (content: any) => void }>> = {
  personal_info: PersonalInfoSection,
  summary: SummarySection,
  work_experience: WorkExperienceSection,
  education: EducationSection,
  skills: SkillsSection,
  projects: ProjectsSection,
  certifications: CertificationsSection,
  languages: LanguagesSection,
  custom: CustomSection,
};

export function SectionWrapper({ section, onUpdate, onRemove }: SectionWrapperProps) {
  const t = useTranslations('editor');
  const { selectedSectionId, selectSection, showAiChat, toggleAiChat } = useEditorStore();
  const { toggleSectionVisibility, updateSectionTitle } = useResumeStore();
  const { attributes, listeners } = useDragHandle();
  const isSelected = selectedSectionId === section.id;
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(section.title);
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isRenaming) {
      renameInputRef.current?.focus();
      renameInputRef.current?.select();
    }
  }, [isRenaming]);

  const commitRename = () => {
    const trimmed = renameValue.trim();
    if (trimmed && trimmed !== section.title) {
      updateSectionTitle(section.id, trimmed);
    } else {
      setRenameValue(section.title);
    }
    setIsRenaming(false);
  };

  const SectionComponent = sectionComponents[section.type];
  const isCustom = section.type === 'custom';

  return (
    <div
      className={`rounded-lg border border-transparent transition-all duration-200 ${
        isSelected ? 'border-pink-300 bg-white dark:bg-zinc-800/50' : 'hover:bg-white/60 dark:hover:bg-zinc-800/30'
      } ${!section.visible ? 'opacity-50' : ''}`}
      onClick={() => selectSection(section.id)}
    >
      <div className="flex flex-row items-center justify-between pb-2 pt-3 px-4">
        <div className="flex items-center gap-2">
          <GripVertical
            className="h-4 w-4 cursor-grab text-zinc-300 active:cursor-grabbing"
            {...attributes}
            {...listeners}
          />
          {isRenaming ? (
            <input
              ref={renameInputRef}
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitRename();
                if (e.key === 'Escape') { setRenameValue(section.title); setIsRenaming(false); }
              }}
              className="h-6 w-32 rounded border border-pink-300 bg-transparent px-1 text-sm font-semibold text-zinc-700 outline-none dark:text-zinc-200"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <h3
              className={`text-sm font-semibold text-zinc-700 dark:text-zinc-200 ${isCustom ? 'cursor-text rounded px-1 -mx-1 hover:bg-zinc-100 dark:hover:bg-zinc-700' : ''}`}
              onDoubleClick={isCustom ? (e) => { e.stopPropagation(); setRenameValue(section.title); setIsRenaming(true); } : undefined}
            >
              {section.title}
            </h3>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 cursor-pointer p-0 text-pink-400 hover:text-pink-600"
            title={t('aiPolish')}
            onClick={(e) => {
              e.stopPropagation();
              if (!showAiChat) toggleAiChat();
            }}
          >
            <Sparkles className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 cursor-pointer p-0"
            onClick={(e) => {
              e.stopPropagation();
              toggleSectionVisibility(section.id);
            }}
          >
            {section.visible ? (
              <Eye className="h-3.5 w-3.5 text-zinc-400" />
            ) : (
              <EyeOff className="h-3.5 w-3.5 text-zinc-400" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 cursor-pointer p-0 text-zinc-400 hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <div className="px-4 pb-4">
        {SectionComponent ? (
          <SectionComponent section={section} onUpdate={onUpdate} />
        ) : (
          <p className="text-sm text-zinc-400">Unknown section type: {section.type}</p>
        )}
      </div>
    </div>
  );
}

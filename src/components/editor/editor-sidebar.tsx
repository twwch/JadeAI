'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, GripVertical, User, FileText, Briefcase, GraduationCap, Wrench, FolderKanban, Award, Languages, LayoutList, Pencil } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useEditorStore } from '@/stores/editor-store';
import { useResumeStore } from '@/stores/resume-store';
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

function SortableSidebarItem({
  section,
  isSelected,
  onSelect,
  onRename,
  icon: Icon,
}: {
  section: ResumeSection;
  isSelected: boolean;
  onSelect: () => void;
  onRename?: (title: string) => void;
  icon: React.ElementType;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(section.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isRenaming) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isRenaming]);

  const commitRename = () => {
    const trimmed = renameValue.trim();
    if (trimmed && trimmed !== section.title && onRename) {
      onRename(trimmed);
    } else {
      setRenameValue(section.title);
    }
    setIsRenaming(false);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  const isCustom = section.type === 'custom';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group/item flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors duration-150 ${
        isSelected
          ? 'bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300'
          : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800'
      }`}
    >
      <GripVertical
        className="h-3 w-3 shrink-0 cursor-grab text-zinc-300 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      />
      <button
        type="button"
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-2"
        onClick={onSelect}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {isRenaming ? (
          <input
            ref={inputRef}
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitRename();
              if (e.key === 'Escape') { setRenameValue(section.title); setIsRenaming(false); }
            }}
            onClick={(e) => e.stopPropagation()}
            className="h-5 w-full min-w-0 rounded border border-pink-300 bg-transparent px-1 text-sm outline-none"
          />
        ) : (
          <span className="truncate">{section.title}</span>
        )}
      </button>
      {isCustom && !isRenaming && (
        <button
          type="button"
          className="hidden shrink-0 cursor-pointer rounded p-0.5 text-zinc-300 hover:text-zinc-600 group-hover/item:block dark:hover:text-zinc-200"
          onClick={(e) => { e.stopPropagation(); setRenameValue(section.title); setIsRenaming(true); }}
        >
          <Pencil className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

interface EditorSidebarProps {
  sections: ResumeSection[];
  onAddSection: (section: ResumeSection) => void;
  onReorderSections: (sections: ResumeSection[]) => void;
}

export function EditorSidebar({ sections, onAddSection, onReorderSections }: EditorSidebarProps) {
  const t = useTranslations('editor');
  const { selectedSectionId, selectSection } = useEditorStore();
  const { updateSectionTitle } = useResumeStore();

  const handleSelect = useCallback((id: string) => {
    selectSection(id);
    requestAnimationFrame(() => {
      const el = document.querySelector(`[data-section-id="${id}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [selectSection]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = sections.findIndex((s) => s.id === active.id);
        const newIndex = sections.findIndex((s) => s.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          const newSections = [...sections];
          const [removed] = newSections.splice(oldIndex, 1);
          newSections.splice(newIndex, 0, removed);
          const reordered = newSections.map((s, i) => ({ ...s, sortOrder: i }));
          onReorderSections(reordered);
        }
      }
    },
    [sections, onReorderSections]
  );

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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {sections.map((section) => {
                const Icon = sectionIcons[section.type] || LayoutList;
                return (
                  <SortableSidebarItem
                    key={section.id}
                    section={section}
                    isSelected={selectedSectionId === section.id}
                    onSelect={() => handleSelect(section.id)}
                    onRename={section.type === 'custom' ? (title) => updateSectionTitle(section.id, title) : undefined}
                    icon={Icon}
                  />
                );
              })}
            </SortableContext>
          </DndContext>
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

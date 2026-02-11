'use client';

import { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SortableSection } from './dnd/sortable-section';
import { SectionWrapper } from './section-wrapper';
import { useEditorStore } from '@/stores/editor-store';
import type { ResumeSection, SectionContent } from '@/types/resume';

interface EditorCanvasProps {
  sections: ResumeSection[];
  onUpdateSection: (sectionId: string, content: Partial<SectionContent>) => void;
  onRemoveSection: (sectionId: string) => void;
  onReorderSections: (sections: ResumeSection[]) => void;
}

export function EditorCanvas({
  sections,
  onUpdateSection,
  onRemoveSection,
  onReorderSections,
}: EditorCanvasProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { setDragging } = useEditorStore();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      setActiveId(event.active.id as string);
      setDragging(true);
    },
    [setDragging]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);
      setDragging(false);

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
    [sections, onReorderSections, setDragging]
  );

  const activeSection = activeId ? sections.find((s) => s.id === activeId) : null;

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {sections.map((section) => (
                  <SortableSection key={section.id} id={section.id}>
                    <SectionWrapper
                      section={section}
                      onUpdate={(content) => onUpdateSection(section.id, content)}
                      onRemove={() => onRemoveSection(section.id)}
                    />
                  </SortableSection>
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeSection && (
                <div className="rounded-lg border-2 border-pink-300 bg-white p-4 opacity-80 shadow-xl">
                  <p className="font-medium text-zinc-700">{activeSection.title}</p>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </ScrollArea>
    </div>
  );
}

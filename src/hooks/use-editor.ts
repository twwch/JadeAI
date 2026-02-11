'use client';

import { useCallback, useEffect } from 'react';
import { useResumeStore } from '@/stores/resume-store';
import { useEditorStore } from '@/stores/editor-store';
import type { ResumeSection } from '@/types/resume';

function getHeaders() {
  const fingerprint = typeof window !== 'undefined' ? localStorage.getItem('jade_fingerprint') : null;
  return {
    'Content-Type': 'application/json',
    ...(fingerprint ? { 'x-fingerprint': fingerprint } : {}),
  };
}

export function useEditor(resumeId: string) {
  const { setResume, sections, currentResume, updateSection, addSection, removeSection, reorderSections, reset: resetResume } = useResumeStore();
  const { pushSnapshot, reset: resetEditor } = useEditorStore();

  const loadResume = useCallback(async () => {
    try {
      const res = await fetch(`/api/resume/${resumeId}`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setResume({
          ...data,
          sections: data.sections || [],
          themeConfig: data.themeConfig || {},
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
        });
      }
    } catch (error) {
      console.error('Failed to load resume:', error);
    }
  }, [resumeId, setResume]);

  useEffect(() => {
    loadResume();
    return () => {
      resetResume();
      resetEditor();
    };
  }, [loadResume, resetResume, resetEditor]);

  const handleUpdateSection = useCallback(
    (sectionId: string, content: any) => {
      pushSnapshot(sections);
      updateSection(sectionId, content);
    },
    [sections, pushSnapshot, updateSection]
  );

  const handleAddSection = useCallback(
    (section: ResumeSection) => {
      pushSnapshot(sections);
      addSection(section);
    },
    [sections, pushSnapshot, addSection]
  );

  const handleRemoveSection = useCallback(
    (sectionId: string) => {
      pushSnapshot(sections);
      removeSection(sectionId);
    },
    [sections, pushSnapshot, removeSection]
  );

  const handleReorder = useCallback(
    (newSections: ResumeSection[]) => {
      pushSnapshot(sections);
      reorderSections(newSections);
    },
    [sections, pushSnapshot, reorderSections]
  );

  return {
    resume: currentResume,
    sections,
    updateSection: handleUpdateSection,
    addSection: handleAddSection,
    removeSection: handleRemoveSection,
    reorderSections: handleReorder,
    loadResume,
  };
}

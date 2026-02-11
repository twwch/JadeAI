import { create } from 'zustand';
import type { Resume, ResumeSection, SectionContent } from '@/types/resume';
import { AUTOSAVE_DELAY } from '@/lib/constants';

interface ResumeStore {
  currentResume: Resume | null;
  sections: ResumeSection[];
  isDirty: boolean;
  isSaving: boolean;
  _saveTimeout: ReturnType<typeof setTimeout> | null;

  setResume: (resume: Resume) => void;
  updateSection: (sectionId: string, content: Partial<SectionContent>) => void;
  updateSectionTitle: (sectionId: string, title: string) => void;
  addSection: (section: ResumeSection) => void;
  removeSection: (sectionId: string) => void;
  reorderSections: (sections: ResumeSection[]) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  setTemplate: (template: string) => void;
  setTitle: (title: string) => void;
  save: () => Promise<void>;
  _scheduleSave: () => void;
  reset: () => void;
}

export const useResumeStore = create<ResumeStore>((set, get) => ({
  currentResume: null,
  sections: [],
  isDirty: false,
  isSaving: false,
  _saveTimeout: null,

  setResume: (resume) => {
    // Cancel any pending autosave to prevent stale data overwriting server changes (e.g., from AI tool calls)
    const { _saveTimeout } = get();
    if (_saveTimeout) clearTimeout(_saveTimeout);
    set({
      currentResume: resume,
      sections: resume.sections,
      isDirty: false,
      _saveTimeout: null,
    });
  },

  updateSection: (sectionId, content) => {
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === sectionId ? { ...s, content: { ...s.content, ...content } as SectionContent } : s
      ),
      isDirty: true,
    }));
    get()._scheduleSave();
  },

  updateSectionTitle: (sectionId, title) => {
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === sectionId ? { ...s, title } : s
      ),
      isDirty: true,
    }));
    get()._scheduleSave();
  },

  addSection: (section) => {
    set((state) => ({
      sections: [...state.sections, section],
      isDirty: true,
    }));
    get()._scheduleSave();
  },

  removeSection: (sectionId) => {
    set((state) => ({
      sections: state.sections.filter((s) => s.id !== sectionId),
      isDirty: true,
    }));
    get()._scheduleSave();
  },

  reorderSections: (sections) => {
    set({ sections, isDirty: true });
    get()._scheduleSave();
  },

  toggleSectionVisibility: (sectionId) => {
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === sectionId ? { ...s, visible: !s.visible } : s
      ),
      isDirty: true,
    }));
    get()._scheduleSave();
  },

  setTemplate: (template) => {
    set((state) => ({
      currentResume: state.currentResume
        ? { ...state.currentResume, template }
        : null,
      isDirty: true,
    }));
    get()._scheduleSave();
  },

  setTitle: (title) => {
    set((state) => ({
      currentResume: state.currentResume
        ? { ...state.currentResume, title }
        : null,
      isDirty: true,
    }));
    get()._scheduleSave();
  },

  save: async () => {
    const { currentResume, sections, isDirty } = get();
    if (!currentResume || !isDirty) return;

    set({ isSaving: true });
    try {
      const fingerprint = typeof window !== 'undefined'
        ? localStorage.getItem('jade_fingerprint')
        : null;

      await fetch(`/api/resume/${currentResume.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(fingerprint ? { 'x-fingerprint': fingerprint } : {}),
        },
        body: JSON.stringify({
          title: currentResume.title,
          template: currentResume.template,
          themeConfig: currentResume.themeConfig,
          sections: sections.map((s, i) => ({
            id: s.id,
            type: s.type,
            title: s.title,
            sortOrder: i,
            visible: s.visible,
            content: s.content,
          })),
        }),
      });

      set({ isDirty: false });
    } catch (error) {
      console.error('Failed to save resume:', error);
    } finally {
      set({ isSaving: false });
    }
  },

  _scheduleSave: () => {
    const { _saveTimeout } = get();
    if (_saveTimeout) clearTimeout(_saveTimeout);

    const timeout = setTimeout(() => {
      get().save();
    }, AUTOSAVE_DELAY);

    set({ _saveTimeout: timeout });
  },

  reset: () => {
    const { _saveTimeout } = get();
    if (_saveTimeout) clearTimeout(_saveTimeout);
    set({
      currentResume: null,
      sections: [],
      isDirty: false,
      isSaving: false,
      _saveTimeout: null,
    });
  },
}));

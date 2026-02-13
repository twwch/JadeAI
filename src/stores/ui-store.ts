import { create } from 'zustand';

type ModalType = 'create-resume' | 'delete-resume' | 'export-pdf' | 'settings' | 'jd-analysis' | 'translate' | null;

interface UIStore {
  sidebarOpen: boolean;
  activeModal: ModalType;
  theme: 'light' | 'dark' | 'system';
  settingsTab: string;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setSettingsTab: (tab: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  activeModal: null,
  theme: 'light',
  settingsTab: 'ai',

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
  setTheme: (theme) => set({ theme }),
  setSettingsTab: (tab) => set({ settingsTab: tab }),
}));

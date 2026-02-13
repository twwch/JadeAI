import { create } from 'zustand';

function storageKey(tourId: string) {
  return `jade_tour_${tourId}_completed`;
}

interface TourStore {
  isActive: boolean;
  activeTourId: string | null;
  currentStep: number;
  totalSteps: number;
  startTour: (tourId: string, totalSteps: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  dismiss: () => void;
}

export function hasCompletedTour(tourId: string): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(storageKey(tourId)) === '1';
}

export const useTourStore = create<TourStore>((set, get) => ({
  isActive: false,
  activeTourId: null,
  currentStep: 0,
  totalSteps: 0,

  startTour: (tourId, totalSteps) =>
    set({ isActive: true, activeTourId: tourId, currentStep: 0, totalSteps }),

  nextStep: () =>
    set((s) => {
      if (s.currentStep >= s.totalSteps - 1) {
        if (s.activeTourId) localStorage.setItem(storageKey(s.activeTourId), '1');
        return { isActive: false, activeTourId: null, currentStep: 0, totalSteps: 0 };
      }
      return { currentStep: s.currentStep + 1 };
    }),

  prevStep: () =>
    set((s) => ({
      currentStep: Math.max(0, s.currentStep - 1),
    })),

  dismiss: () => {
    const { activeTourId } = get();
    if (activeTourId) localStorage.setItem(storageKey(activeTourId), '1');
    set({ isActive: false, activeTourId: null, currentStep: 0, totalSteps: 0 });
  },
}));

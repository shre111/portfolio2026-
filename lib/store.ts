/**
 * Zustand Store — Global state for scroll progress, active section, motion preferences
 * Publish scroll progress to share between DOM reveals and 3D camera choreography
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface ScrollStore {
  // Scroll state
  scrollProgress: number; // 0-1: global page scroll progress
  sectionProgress: Record<string, number>; // 0-1: per-section progress
  activeSection: string | null;
  isScrolling: boolean;

  // Motion preferences
  reducedMotion: boolean;

  // Actions
  setScrollProgress: (progress: number) => void;
  setSectionProgress: (section: string, progress: number) => void;
  setActiveSection: (section: string | null) => void;
  setIsScrolling: (scrolling: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  reset: () => void;
}

const INITIAL_STATE = {
  scrollProgress: 0,
  sectionProgress: {} as Record<string, number>,
  activeSection: null,
  isScrolling: false,
  reducedMotion: false,
};

export const useScrollStore = create<ScrollStore>()(
  devtools(
    (set) => ({
      ...INITIAL_STATE,

      setScrollProgress: (progress: number) =>
        set({ scrollProgress: Math.max(0, Math.min(1, progress)) }),

      setSectionProgress: (section: string, progress: number) =>
        set((state) => ({
          sectionProgress: {
            ...state.sectionProgress,
            [section]: Math.max(0, Math.min(1, progress)),
          },
        })),

      setActiveSection: (section: string | null) =>
        set({ activeSection: section }),

      setIsScrolling: (scrolling: boolean) =>
        set({ isScrolling: scrolling }),

      setReducedMotion: (reduced: boolean) =>
        set({ reducedMotion: reduced }),

      reset: () => set(INITIAL_STATE),
    }),
    { name: 'scroll-store' }
  )
);

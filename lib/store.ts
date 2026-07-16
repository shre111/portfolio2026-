import { create } from 'zustand';

interface ScrollState {
  scrollProgress: number;
  activeSection: string;
  reducedMotion: boolean;
  setScrollProgress: (progress: number) => void;
  setActiveSection: (section: string) => void;
  setReducedMotion: (reduced: boolean) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  scrollProgress: 0,
  activeSection: 'hero',
  reducedMotion: false,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setActiveSection: (section) => set({ activeSection: section }),
  setReducedMotion: (reduced) => set({ reducedMotion: reduced }),
}));

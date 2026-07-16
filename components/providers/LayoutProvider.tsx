'use client';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useLenis } from '@/hooks/useLenis';
import { useSectionTracker } from '@/hooks/useSectionTracker';

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  // Detect motion preference first (Lenis reads it from the store), then drive
  // smooth scroll + publish global and per-section scroll progress.
  useReducedMotion();
  useLenis();
  useSectionTracker();

  return <>{children}</>;
}

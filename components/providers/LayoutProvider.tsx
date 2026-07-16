'use client';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useScrollProgress } from '@/hooks/useScrollProgress';

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  // Initialize hooks to track motion preferences and scroll progress
  useReducedMotion();
  useScrollProgress();

  return <>{children}</>;
}

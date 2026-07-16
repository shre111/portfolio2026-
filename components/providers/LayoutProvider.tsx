'use client';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useLenis } from '@/hooks/useLenis';

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  // Detect motion preference first (Lenis reads it from the store), then drive
  // smooth scroll + publish scroll progress.
  useReducedMotion();
  useLenis();

  return <>{children}</>;
}

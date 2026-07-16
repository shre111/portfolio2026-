'use client';

import { useEffect, useState } from 'react';
import { useScrollStore } from '@/lib/store';

export function useReducedMotion(): boolean {
  const [mounted, setMounted] = useState(false);
  const setReducedMotion = useScrollStore((state) => state.setReducedMotion);
  const reducedMotion = useScrollStore((state) => state.reducedMotion);

  useEffect(() => {
    setMounted(true);
    
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setReducedMotion(e.matches);
    };

    // Set initial value
    setReducedMotion(mediaQuery.matches);

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setReducedMotion]);

  if (!mounted) return false;
  return reducedMotion;
}

/**
 * useScrollProgress — Hook to track scroll position as normalized value (0-1)
 * Integrates with Lenis and Zustand store
 */

import { useEffect } from 'react';
import { useScrollStore } from '@/lib/store';

/**
 * Custom hook that syncs scroll progress with Zustand store
 * Call this in a layout or effect to keep global scroll state up-to-date
 */
export function useScrollProgress() {
  const scrollProgress = useScrollStore((state) => state.scrollProgress);
  const setScrollProgress = useScrollStore((state) => state.setScrollProgress);
  const setIsScrolling = useScrollStore((state) => state.setIsScrolling);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = maxScroll > 0 ? currentScroll / maxScroll : 0;

      setScrollProgress(progress);
      setIsScrolling(true);
    };

    // Debounce scroll end detection
    let scrollTimeout: NodeJS.Timeout;
    const handleScrollEnd = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScrollEnd);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScrollEnd);
      clearTimeout(scrollTimeout);
    };
  }, [setScrollProgress, setIsScrolling]);

  return scrollProgress;
}

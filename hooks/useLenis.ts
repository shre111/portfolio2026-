'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollStore } from '@/lib/store';

gsap.registerPlugin(ScrollTrigger);

/**
 * useLenis — drives smooth scrolling (CLAUDE.md §6) and publishes normalized
 * scroll progress (0–1) to the Zustand store so both the DOM reveals and the
 * 3D CameraRig read from one source.
 *
 * Reduced motion: Lenis is skipped entirely and progress is read from native
 * scroll, keeping the page fully navigable with no smoothing (§9).
 * GSAP ScrollTrigger is kept in sync with Lenis' RAF so scroll-driven reveals
 * stay frame-accurate.
 */
export function useLenis(): void {
  const setScrollProgress = useScrollStore((s) => s.setScrollProgress);
  const reducedMotion = useScrollStore((s) => s.reducedMotion);

  useEffect(() => {
    // Reduced motion → no smooth scroll; publish progress from native scroll.
    if (reducedMotion) {
      const handleNativeScroll = () => {
        const max =
          document.documentElement.scrollHeight - window.innerHeight;
        setScrollProgress(max > 0 ? window.scrollY / max : 0);
      };
      const handleScrollTo = (e: Event) => {
        const selector = (e as CustomEvent<string>).detail;
        document.querySelector(selector)?.scrollIntoView();
      };
      handleNativeScroll();
      window.addEventListener('scroll', handleNativeScroll, { passive: true });
      window.addEventListener('lenis:scrollTo', handleScrollTo as EventListener);
      return () => {
        window.removeEventListener('scroll', handleNativeScroll);
        window.removeEventListener(
          'lenis:scrollTo',
          handleScrollTo as EventListener
        );
      };
    }

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    // Publish progress + keep ScrollTrigger in sync on every scroll frame.
    lenis.on('scroll', (instance: Lenis) => {
      setScrollProgress(instance.progress);
      ScrollTrigger.update();
    });

    // Drive Lenis from GSAP's ticker so animation and scroll share one clock.
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Nav clicks ask Lenis to smooth-scroll to a section.
    const handleScrollTo = (e: Event) => {
      lenis.scrollTo((e as CustomEvent<string>).detail);
    };
    window.addEventListener('lenis:scrollTo', handleScrollTo as EventListener);

    return () => {
      gsap.ticker.remove(raf);
      window.removeEventListener(
        'lenis:scrollTo',
        handleScrollTo as EventListener
      );
      lenis.destroy();
    };
  }, [reducedMotion, setScrollProgress]);
}

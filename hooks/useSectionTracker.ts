'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollStore } from '@/lib/store';

gsap.registerPlugin(ScrollTrigger);

/**
 * useSectionTracker — publishes per-section scroll progress and the currently
 * active section to the Zustand store (CLAUDE.md §6). The CameraRig and nav
 * both read this, so section geometry lives in one place.
 *
 * Two ScrollTriggers per <section id>:
 *  - progress: 0 as the section enters from the bottom → 1 as it leaves the top.
 *  - active:   marks the section "active" while it straddles viewport center.
 */
export function useSectionTracker(): void {
  const setSectionProgress = useScrollStore((s) => s.setSectionProgress);
  const setActiveSection = useScrollStore((s) => s.setActiveSection);

  useEffect(() => {
    const sections = gsap.utils.toArray<HTMLElement>('section[id]');

    const triggers = sections.flatMap((section) => {
      const id = section.id;

      const progress = ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => setSectionProgress(id, self.progress),
      });

      const active = ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => {
          if (self.isActive) setActiveSection(id);
        },
      });

      return [progress, active];
    });

    // Recalculate positions once everything has laid out.
    ScrollTrigger.refresh();

    return () => triggers.forEach((t) => t.kill());
  }, [setSectionProgress, setActiveSection]);
}

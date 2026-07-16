'use client';

import { createElement, useLayoutEffect, useRef } from 'react';
import type { ElementType, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollStore } from '@/lib/store';

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  children: ReactNode;
  /** Element to render as (default 'div'). */
  as?: ElementType;
  className?: string;
  /** Delay before the tween starts, in seconds. */
  delay?: number;
  /** Travel distance in px (§6 keeps this short: 16–24). */
  y?: number;
  /** If set, animate direct children with this stagger instead of the wrapper. */
  stagger?: number;
}

/**
 * Reveal — scroll-triggered entrance for section content (CLAUDE.md §6).
 * Short opacity + Y translate, 0.5–0.8s, played once when the element nears the
 * viewport. With `stagger`, the wrapper's direct children come in in sequence.
 * Reduced motion (§9): renders content immediately, no animation.
 */
export function Reveal({
  children,
  as = 'div',
  className,
  delay = 0,
  y = 20,
  stagger,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useScrollStore((s) => s.reducedMotion);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    const ctx = gsap.context(() => {
      const targets = stagger != null ? Array.from(el.children) : el;
      gsap.from(targets, {
        opacity: 0,
        y,
        duration: 0.65,
        ease: 'power2.out',
        delay,
        stagger: stagger ?? 0,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [reducedMotion, delay, y, stagger]);

  return createElement(as, { ref, className }, children);
}

'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { content } from '@/lib/content';
import { useScrollStore } from '@/lib/store';

/**
 * Hero — the page-load ignition (CLAUDE.md §6). The particle field ignites
 * (handled in LatentField), then the name, title, tagline, CTAs and scroll hint
 * fade/rise in as one coordinated timeline. Reduced motion (§9): everything is
 * visible immediately with no animation.
 */
export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = useScrollStore((s) => s.reducedMotion);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el || reducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out', duration: 0.7 },
      });
      // Start slightly after the field begins igniting, then cascade the text.
      tl.from('[data-hero="name"]', { opacity: 0, y: 24 }, 0.35)
        .from('[data-hero="title"]', { opacity: 0, y: 16 }, '-=0.45')
        .from('[data-hero="tagline"]', { opacity: 0, y: 16 }, '-=0.45')
        .from('[data-hero="cta"]', { opacity: 0, y: 16 }, '-=0.4')
        .from('[data-hero="hint"]', { opacity: 0, y: 12 }, '-=0.3');
    }, el);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={rootRef}
      id="hero"
      aria-label="Introduction"
      className="relative w-full min-h-screen flex items-center justify-center px-6 overflow-hidden"
    >
      {/* Contrast scrim — translucent so the particle field shows through (§9). */}
      <div className="hero-scrim pointer-events-none absolute inset-0" />

      {/* w-full + min-w-0 so this flex item can't exceed the viewport and the
          headline wraps instead of overflowing on narrow screens (§9). */}
      <div className="relative z-10 w-full min-w-0 max-w-3xl mx-auto text-center">
        {/* Name — main headline */}
        <h1
          data-hero="name"
          className="mb-4 font-display text-display leading-tight"
        >
          {content.identity.name}
        </h1>

        {/* Title */}
        <p
          data-hero="title"
          className="mb-6 font-sans text-lg text-text-muted sm:text-xl"
        >
          {content.identity.title}
        </p>

        {/* Tagline — wraps cleanly on narrow screens */}
        <p
          data-hero="tagline"
          className="mx-auto mb-12 max-w-xl text-balance font-mono text-xs uppercase tracking-wide text-iris-soft sm:text-sm"
        >
          {content.identity.tagline}
        </p>

        {/* CTAs — wrap rather than overflow on small screens */}
        <div
          data-hero="cta"
          className="flex flex-wrap justify-center gap-4"
        >
          <a
            href="#contact"
            className="rounded-xs bg-iris px-8 py-3 font-medium text-ink transition-colors hover:bg-iris-soft"
          >
            Get in touch
          </a>
          <a
            href="#about"
            className="rounded-xs border border-iris px-8 py-3 font-medium text-iris transition-colors hover:bg-iris hover:bg-opacity-5"
          >
            Learn more
          </a>
        </div>
      </div>

      {/* Scroll hint — anchored to the section (viewport) bottom, not the text
          block, so it sits correctly on every screen size. */}
      <div
        data-hero="hint"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 opacity-60"
      >
        <div className="flex flex-col items-center gap-2 font-mono text-xs text-text-muted">
          <span>Scroll to explore</span>
          <svg
            className="h-4 w-4 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

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
  const rootRef = useRef<HTMLDivElement>(null);
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
      id="hero"
      aria-label="Introduction"
      className="relative w-full min-h-screen flex items-center justify-center px-6 overflow-hidden"
    >
      {/* Background gradient scrim (subtle) */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink to-ink-2 pointer-events-none" />

      <div ref={rootRef} className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Name — main headline */}
        <h1
          data-hero="name"
          className="font-display text-display leading-tight mb-4"
        >
          {content.identity.name}
        </h1>

        {/* Title */}
        <p
          data-hero="title"
          className="text-xl font-sans text-text-muted mb-6"
        >
          {content.identity.title}
        </p>

        {/* Tagline */}
        <p
          data-hero="tagline"
          className="font-mono text-iris-soft tracking-wide uppercase text-sm mb-12"
        >
          {content.identity.tagline}
        </p>

        {/* CTAs */}
        <div data-hero="cta" className="flex gap-4 justify-center">
          <a
            href="#contact"
            className="px-8 py-3 bg-iris text-ink font-medium rounded-xs hover:bg-iris-soft transition-colors"
          >
            Get in touch
          </a>
          <a
            href="#about"
            className="px-8 py-3 border border-iris text-iris font-medium rounded-xs hover:bg-iris hover:bg-opacity-5 transition-colors"
          >
            Learn more
          </a>
        </div>

        {/* Scroll hint */}
        <div
          data-hero="hint"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-60"
        >
          <div className="flex flex-col items-center gap-2 text-text-muted font-mono text-xs">
            <span>Scroll to explore</span>
            <svg
              className="w-4 h-4 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
      </div>
    </section>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { content } from '@/lib/content';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // Trigger entrance animation after first paint
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex items-center justify-center px-6 overflow-hidden"
    >
      {/* Background gradient scrim (subtle) */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink to-ink-2 pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Name - Main headline */}
        <h1
          className={`font-display text-display leading-tight mb-4 transition-all duration-700 ${
            isLoaded && !reducedMotion
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          {content.identity.name}
        </h1>

        {/* Title */}
        <p
          className={`text-xl font-sans text-text-muted mb-6 transition-all duration-700 delay-100 ${
            isLoaded && !reducedMotion
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          {content.identity.title}
        </p>

        {/* Tagline */}
        <p
          className={`text-mono text-iris-soft tracking-wide uppercase text-sm mb-12 transition-all duration-700 delay-200 ${
            isLoaded && !reducedMotion
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          {content.identity.tagline}
        </p>

        {/* CTA Button */}
        <div
          className={`flex gap-4 justify-center transition-all duration-700 delay-300 ${
            isLoaded && !reducedMotion
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
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
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-700 delay-500 ${
            isLoaded && !reducedMotion
              ? 'opacity-60 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex flex-col items-center gap-2 text-text-muted text-mono text-xs">
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

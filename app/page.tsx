'use client';

import dynamic from 'next/dynamic';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Experience } from '@/components/sections/Experience';

// Lazy-load 3D scene to not block first paint
const Scene = dynamic(() => import('@/components/canvas/Scene').then(m => ({ default: m.Scene })), {
  ssr: false,
  loading: () => null,
});

export default function Home() {
  return (
    <main className="w-full bg-ink relative">
      {/* Fixed 3D particle field */}
      <Scene />

      {/* HTML sections overlaid on canvas */}
      <div className="relative z-10">
        <Hero />
        <About />
        <Experience />

        {/* Placeholder sections for future phases (Phase 3) */}
        <section className="py-32 px-6 border-t border-line">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-h2">AI Projects</h2>
            <p className="text-text-muted mt-4">Coming soon...</p>
          </div>
        </section>

        <section className="py-32 px-6 border-t border-line">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-h2">Full Stack Projects</h2>
            <p className="text-text-muted mt-4">Coming soon...</p>
          </div>
        </section>

        <section className="py-32 px-6 border-t border-line">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-h2">Skills</h2>
            <p className="text-text-muted mt-4">Coming soon...</p>
          </div>
        </section>

        <section className="py-32 px-6 border-t border-line">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-h2">Contact</h2>
            <p className="text-text-muted mt-4">Coming soon...</p>
          </div>
        </section>
      </div>
    </main>
  );
}

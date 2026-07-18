'use client';

import dynamic from 'next/dynamic';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Experience } from '@/components/sections/Experience';
import { AIProjects } from '@/components/sections/AIProjects';
import { FullStackProjects } from '@/components/sections/FullStackProjects';
import { Skills } from '@/components/sections/Skills';
import { Contact } from '@/components/sections/Contact';
import { Cursor } from '@/components/ui/Cursor';
import { Nav } from '@/components/ui/Nav';

// Lazy-load 3D scene to not block first paint
const Scene = dynamic(() => import('@/components/canvas/Scene').then(m => ({ default: m.Scene })), {
  ssr: false,
  loading: () => null,
});

export default function Home() {
  return (
    <main id="main-content" className="w-full bg-ink relative">
      {/* Custom cursor (fine-pointer, motion-safe devices only) */}
      <Cursor />

      {/* Section dot-rail nav (reflects active section) */}
      <Nav />

      {/* Fixed 3D particle field */}
      <Scene />

      {/* HTML sections overlaid on canvas */}
      <div className="relative z-10">
        <Hero />
        <About />
        <Experience />
        <AIProjects />
        <FullStackProjects />
        <Skills />
        <Contact />
      </div>
    </main>
  );
}

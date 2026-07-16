'use client';

import { content } from '@/lib/content';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { Reveal } from '@/components/ui/Reveal';

/**
 * FullStackProjects — the shipped products (CLAUDE.md §8). Same card language as
 * the AI showcase but quieter: an even two-column grid, no featured lead.
 */
export function FullStackProjects() {
  return (
    <section
      id="fullstack-projects"
      className="relative w-full bg-ink-2 py-32 px-6"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal
          as="p"
          className="mb-3 font-mono text-mono uppercase tracking-wide text-iris-soft"
        >
          {'// Full-Stack · Product'}
        </Reveal>
        <Reveal as="h2" className="mb-16 font-display text-h2" delay={0.05}>
          Full-Stack Projects
        </Reveal>

        <Reveal className="grid gap-6 md:grid-cols-2" stagger={0.1}>
          {content.fullStackProjects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}

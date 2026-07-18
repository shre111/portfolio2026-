'use client';

import { content } from '@/lib/content';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { Reveal } from '@/components/ui/Reveal';

/**
 * AIProjects — the showcase (CLAUDE.md §8, "the most visual weight"). The
 * featured project (AI Trader) leads full-width with its metrics; the rest
 * follow in a two-column grid that staggers in.
 */
export function AIProjects() {
  const projects = content.aiProjects;
  const featured = projects.find((p) => p.featured) ?? projects[0];
  const rest = projects.filter((p) => p.id !== featured.id);

  return (
    <section
      id="ai-projects"
      aria-label="AI projects"
      className="section-scrim relative w-full py-32 px-6"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal
          as="p"
          className="mb-3 font-mono text-mono uppercase tracking-wide text-iris-soft"
        >
          {'// AI · LLM Systems'}
        </Reveal>
        <Reveal as="h2" className="mb-16 font-display text-h2" delay={0.05}>
          AI Projects
        </Reveal>

        {/* Featured, full-width */}
        <Reveal className="mb-6">
          <ProjectCard project={featured} index={0} featured />
        </Reveal>

        {/* The rest */}
        <Reveal className="grid gap-6 md:grid-cols-2" stagger={0.1}>
          {rest.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i + 1} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}

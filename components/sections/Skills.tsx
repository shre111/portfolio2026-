'use client';

import { content } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';

/**
 * Skills — the capability clusters (CLAUDE.md §8). Grouped into the same
 * constellation clusters the particle formation will echo in Phase 4; here they
 * read as mono chip groups. Instrument-panel voice throughout (§4/§10).
 */
export function Skills() {
  return (
    <section
      id="skills"
      aria-label="Skills"
      className="section-scrim relative w-full py-32 px-6"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal
          as="p"
          className="mb-3 font-mono text-mono uppercase tracking-wide text-iris-soft"
        >
          {'// Capabilities'}
        </Reveal>
        <Reveal as="h2" className="mb-16 font-display text-h2" delay={0.05}>
          Skills
        </Reveal>

        <Reveal
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.08}
        >
          {content.skills.map((group) => (
            <div
              key={group.category}
              className="rounded-sm border border-line bg-ink-2 p-6"
            >
              <h3 className="mb-4 font-mono text-mono uppercase tracking-wide text-text-muted">
                {group.category}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-xs border border-line px-2 py-1 font-mono text-xs text-text"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

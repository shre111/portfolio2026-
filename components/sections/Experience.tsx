'use client';

import { content } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';

export function Experience() {
  return (
    <section id="experience" className="relative w-full py-32 px-6 bg-ink-2">
      <div className="max-w-4xl mx-auto">
        <Reveal as="h2" className="font-display text-h2 mb-16">
          Experience
        </Reveal>

        <Reveal className="space-y-12" stagger={0.12}>
          {content.experience.map((exp) => (
            <div
              key={exp.id}
              className="relative pl-8 border-l-2 border-iris"
            >
              {/* Timeline dot */}
              <div className="absolute -left-4 top-0 w-6 h-6 bg-iris rounded-full border-4 border-ink-2" />

              {/* Timeline content */}
              <div className="pb-8">
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-2">
                  <h3 className="font-display text-h3">{exp.title}</h3>
                  <p className="text-mono text-text-muted text-sm md:text-right">
                    {exp.duration}
                  </p>
                </div>

                <p className="text-iris-soft font-medium mb-1">{exp.company}</p>
                <p className="text-text-muted text-sm mb-4">{exp.location}</p>

                {/* Highlights */}
                <ul className="space-y-2">
                  {exp.description.map((point, i) => (
                    <li key={i} className="text-text leading-body">
                      <span className="text-amber mr-3">▸</span>
                      {point}
                    </li>
                  ))}
                </ul>

                {exp.current && (
                  <div className="mt-4 inline-block px-3 py-1 bg-iris bg-opacity-10 border border-iris rounded-xs text-xs text-iris font-medium">
                    Current Role
                  </div>
                )}
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

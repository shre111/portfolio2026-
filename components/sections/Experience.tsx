'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { content } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';
import { ExperienceCard } from '@/components/ui/ExperienceCard';
import { useScrollStore } from '@/lib/store';

gsap.registerPlugin(ScrollTrigger);

/**
 * Experience — a timeline of panels floating above the latent field. The spine
 * draws itself downward as you scroll (scrubbed), and each card tilts in 3D
 * toward the cursor. The section is translucent so the particle field reads
 * behind it; only the cards are solid surfaces.
 */
export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const spineRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useScrollStore((s) => s.reducedMotion);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const spine = spineRef.current;
    if (!section || !spine) return;

    // Reduced motion (§9): the spine is simply drawn, no scrubbing.
    if (reducedMotion) {
      spine.style.transform = 'scaleY(1)';
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        spine,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'bottom 85%',
            scrub: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="experience"
      aria-label="Experience"
      className="section-scrim relative w-full py-32 px-6"
    >
      <div className="mx-auto max-w-4xl">
        <Reveal
          as="p"
          className="mb-3 font-mono text-mono uppercase tracking-wide text-iris-soft"
        >
          {'// Trajectory'}
        </Reveal>
        <Reveal as="h2" className="mb-16 font-display text-h2" delay={0.05}>
          Experience
        </Reveal>

        <div className="relative">
          {/* Timeline spine — draws downward with scroll */}
          <span
            ref={spineRef}
            aria-hidden="true"
            className="absolute left-0 top-0 h-full w-px origin-top bg-gradient-to-b from-iris via-iris to-transparent"
          />

          <Reveal as="ul" className="space-y-8" stagger={0.12}>
            {content.experience.map((exp, i) => (
              <ExperienceCard key={exp.id} experience={exp} index={i} />
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

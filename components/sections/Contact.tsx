'use client';

import { content } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';

/** Bare-domain link → absolute href. */
const href = (url: string) => (url.startsWith('http') ? url : `https://${url}`);

/**
 * Contact — the single, warm CTA (CLAUDE.md §10): "Get in touch" with email +
 * LinkedIn + GitHub. This is the human moment, so the email carries the one
 * amber accent for the view (§4). Copy stays factual — no invented claims.
 */
export function Contact() {
  const { identity } = content;

  return (
    <section
      id="contact"
      aria-label="Contact"
      className="section-scrim relative w-full py-32 px-6"
    >
      <div className="mx-auto max-w-3xl text-center">
        <Reveal
          as="p"
          className="mb-3 font-mono text-mono uppercase tracking-wide text-iris-soft"
        >
          {'// Contact'}
        </Reveal>
        <Reveal as="h2" className="mb-6 font-display text-h2" delay={0.05}>
          Get in touch
        </Reveal>
        <Reveal
          as="p"
          className="mb-12 leading-body text-text-muted"
          delay={0.1}
        >
          Email is the fastest way to reach me.
        </Reveal>

        <Reveal className="flex flex-col items-center gap-6" delay={0.15}>
          {/* The one amber element in this view — the human/CTA moment. */}
          <a
            href={`mailto:${identity.email}`}
            className="font-mono text-lg text-amber transition-opacity hover:opacity-80"
          >
            {identity.email}
          </a>

          <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-sm">
            <a
              href={href(identity.links.linkedin)}
              target="_blank"
              rel="noreferrer"
              className="text-iris hover:text-iris-soft"
            >
              LinkedIn ↗
            </a>
            <a
              href={href(identity.links.github)}
              target="_blank"
              rel="noreferrer"
              className="text-iris hover:text-iris-soft"
            >
              GitHub ↗
            </a>
            <a
              href={`tel:${identity.phone.replace(/[^+\d]/g, '')}`}
              className="text-text-muted hover:text-text"
            >
              {identity.phone}
            </a>
          </div>

          <p className="font-mono text-mono text-text-muted">
            {identity.location}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

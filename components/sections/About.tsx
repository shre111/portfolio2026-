'use client';

import { ABOUT, EDUCATION } from '@/lib/content';

export function About() {
  return (
    <section id="about" className="relative w-full py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-h2 mb-8">About</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Summary */}
          <div>
            <p className="text-body leading-body mb-6 text-text">
              {ABOUT.summary}
            </p>
            <p className="text-body leading-body text-text-muted">
              Currently working with international teams on cutting-edge AI
              systems and full-stack web applications. Always learning, always
              building.
            </p>
          </div>

          {/* Education & Interests */}
          <div>
            <div className="mb-8">
              <h3 className="font-display text-sm tracking-wide uppercase text-iris-soft mb-2">
                Education
              </h3>
              <p className="font-sans font-medium text-text">
                {EDUCATION.degree} — {EDUCATION.institution}
              </p>
              <p className="text-text-muted text-sm">
                {EDUCATION.location} · {EDUCATION.year}
              </p>
            </div>

            <div>
              <h3 className="font-display text-sm tracking-wide uppercase text-iris-soft mb-3">
                Interests
              </h3>
              <ul className="space-y-2">
                {ABOUT.interests.map((interest) => (
                  <li key={interest} className="text-text-muted text-sm">
                    • {interest}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

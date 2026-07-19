'use client';

import { useEffect, useRef } from 'react';
import type { Experience } from '@/lib/content';
import { useScrollStore } from '@/lib/store';

interface ExperienceCardProps {
  experience: Experience;
  /** Zero-based position, rendered as the ghosted index numeral. */
  index: number;
}

/**
 * ExperienceCard — a panel that floats above the latent field and tilts in 3D
 * toward the cursor (CLAUDE.md §4/§5 "you can touch latent space").
 *
 * The tilt is written straight to the element's transform from a rAF loop that
 * only runs while the pointer is over the card (and while it settles back), so
 * idle cards cost nothing (§7). Disabled for touch and reduced motion (§9).
 */
export function ExperienceCard({ experience, index }: ExperienceCardProps) {
  const tiltRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useScrollStore((s) => s.reducedMotion);

  useEffect(() => {
    const el = tiltRef.current;
    if (!el || reducedMotion) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const target = { rx: 0, ry: 0, z: 0 };
    const current = { rx: 0, ry: 0, z: 0 };
    let raf = 0;
    let hovering = false;

    const render = () => {
      current.rx += (target.rx - current.rx) * 0.12;
      current.ry += (target.ry - current.ry) * 0.12;
      current.z += (target.z - current.z) * 0.12;

      el.style.transform = `perspective(900px) rotateX(${current.rx.toFixed(3)}deg) rotateY(${current.ry.toFixed(3)}deg) translateZ(${current.z.toFixed(2)}px)`;

      // Stop the loop once it has settled and the pointer has left.
      const settled =
        Math.abs(target.rx - current.rx) < 0.01 &&
        Math.abs(target.ry - current.ry) < 0.01 &&
        Math.abs(target.z - current.z) < 0.01;

      if (!hovering && settled) {
        el.style.transform = '';
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(render);
    };

    const start = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };

    const onEnter = () => {
      hovering = true;
      target.z = 16;
      start();
    };

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      // Small angles only — this should read as depth, not a novelty flip.
      target.ry = (px - 0.5) * 9;
      target.rx = -(py - 0.5) * 7;
      start();
    };

    const onLeave = () => {
      hovering = false;
      target.rx = 0;
      target.ry = 0;
      target.z = 0;
      start();
    };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [reducedMotion]);

  const num = String(index + 1).padStart(2, '0');

  return (
    <li className="relative pl-10 md:pl-16">
      {/* Node on the timeline spine */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-8 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-iris bg-ink shadow-glow-iris md:left-0"
      />

      <div
        ref={tiltRef}
        data-cursor="hover"
        className="group relative overflow-hidden rounded-sm border border-line bg-ink-2 p-6 transition-[border-color,box-shadow] duration-300 will-change-transform hover:border-iris hover:shadow-glow-iris md:p-8"
      >
        {/* Ghosted index numeral — editorial depth behind the content */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-2 -top-6 select-none font-display text-[7rem] leading-none text-line opacity-60"
        >
          {num}
        </span>

        <div className="relative">
          {/* Instrument-panel header */}
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="font-mono text-mono uppercase tracking-wide text-iris-soft">
              {experience.company}
            </p>
            <p className="font-mono text-mono text-text-muted">
              {experience.duration}
            </p>
          </div>

          <h3 className="mb-1 font-display text-h3">{experience.title}</h3>
          <p className="mb-5 font-mono text-xs text-text-muted">
            {experience.location}
          </p>

          <ul className="space-y-2">
            {experience.description.map((point) => (
              <li
                key={point}
                className="flex gap-3 leading-body text-text-muted"
              >
                <span aria-hidden="true" className="mt-[0.55em] h-px w-3 shrink-0 bg-iris" />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          {/* The single amber element in this view (§4) */}
          {experience.current && (
            <p className="mt-5 inline-block rounded-xs border border-amber px-3 py-1 font-mono text-xs uppercase tracking-wide text-amber">
              Current
            </p>
          )}
        </div>
      </div>
    </li>
  );
}

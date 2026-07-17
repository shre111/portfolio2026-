'use client';

import { useEffect, useRef, useState } from 'react';
import { useScrollStore } from '@/lib/store';

/**
 * Cursor — a custom pointer (CLAUDE.md §4): a small iris dot at the exact
 * position plus a larger ring that trails with a little lag and swells over
 * interactive elements. Fine-pointer devices only; disabled for touch and for
 * reduced-motion (§9), where the native cursor is left untouched.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useScrollStore((s) => s.reducedMotion);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Skip on touch/coarse pointers and when the user prefers reduced motion.
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!fine.matches || reducedMotion) return;

    setEnabled(true);
    document.body.classList.add('has-custom-cursor');

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: pos.x, y: pos.y };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      }
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, [data-cursor="hover"]');
      ringRef.current?.classList.toggle('cursor-ring--hover', Boolean(interactive));
    };

    const loop = () => {
      // Damped follow → the ring trails the dot slightly.
      ring.x += (pos.x - ring.x) * 0.18;
      ring.y += (pos.y - ring.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.body.classList.remove('has-custom-cursor');
    };
  }, [reducedMotion]);

  if (!enabled) return null;

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}

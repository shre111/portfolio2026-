'use client';

import { useEffect, useState, type RefObject } from 'react';

/**
 * useRenderActive — should the 3D scene be rendering right now? (CLAUDE.md §7)
 *
 * Combines two signals:
 *  - tab visibility: a backgrounded tab shouldn't burn GPU/battery.
 *  - intersection: if the canvas wrapper ever leaves the viewport, stop drawing.
 *
 * Both default to true so we never withhold the first frame while detecting.
 */
export function useRenderActive(ref: RefObject<HTMLElement | null>): boolean {
  const [tabVisible, setTabVisible] = useState(true);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden);
    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);
    return () =>
      document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver((entries) => {
      setInView(entries[0]?.isIntersecting ?? true);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return tabVisible && inView;
}

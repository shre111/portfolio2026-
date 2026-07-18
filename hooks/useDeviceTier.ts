'use client';

import { useEffect, useState } from 'react';

export type DeviceTier = 'high' | 'mid' | 'low';

/** Particle budget per tier (CLAUDE.md §7). 'low' skips the field entirely. */
export const TIER_PARTICLE_COUNT: Record<DeviceTier, number> = {
  high: 15000,
  mid: 8000,
  low: 0,
};

/**
 * useDeviceTier — classify the device so the particle field can scale to it
 * (CLAUDE.md §7).
 *
 * IMPORTANT: only the *static* hints may select 'low', because 'low' removes
 * the signature field entirely. The FPS probe may only step high -> mid.
 * An earlier version let the probe drop straight to 'low', and because it ran
 * during hydration/compile — the most expensive moment of page load — it
 * regularly measured a false low frame rate and silently deleted the whole 3D
 * scene on perfectly capable machines.
 *
 * The probe is also deferred until the page has settled so it measures the
 * steady state rather than startup jank.
 */
export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>('mid');

  useEffect(() => {
    // Static hints: core count + whether this is a touch/coarse-pointer device.
    const cores = navigator.hardwareConcurrency ?? 4;
    const coarse = window.matchMedia('(pointer: coarse)').matches;

    // Only genuinely weak hardware is classified 'low' (no field at all).
    const initial: DeviceTier =
      cores <= 2 ? 'low' : cores >= 8 && !coarse ? 'high' : 'mid';
    setTier(initial);

    if (initial === 'low') return;

    let raf = 0;
    let frames = 0;
    let start = 0;

    // Measure the steady state, not startup jank.
    const startProbe = () => {
      start = performance.now();
      const probe = () => {
        frames += 1;
        const elapsed = performance.now() - start;
        if (elapsed < 1000) {
          raf = requestAnimationFrame(probe);
          return;
        }
        const fps = (frames / elapsed) * 1000;
        // Never drop to 'low' here — a transient dip must not remove the field.
        if (fps < 45) setTier((t) => (t === 'high' ? 'mid' : t));
      };
      raf = requestAnimationFrame(probe);
    };

    const timer = window.setTimeout(startProbe, 2500);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, []);

  return tier;
}

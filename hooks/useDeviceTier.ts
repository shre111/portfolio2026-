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
 * (CLAUDE.md §7). Starts from static hints (core count, pointer type), then runs
 * a short FPS probe and downgrades if the device can't hold a smooth frame rate.
 *
 * Starts at 'mid' so we never ship 15k particles to a machine we haven't
 * measured yet.
 */
export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>('mid');

  useEffect(() => {
    // Static hints: core count + whether this is a touch/coarse-pointer device.
    const cores = navigator.hardwareConcurrency ?? 4;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const initial: DeviceTier =
      cores >= 8 && !coarse ? 'high' : cores >= 4 ? 'mid' : 'low';
    setTier(initial);

    if (initial === 'low') return;

    // Quick ~600ms FPS probe; downgrade a tier if frames are already dropping.
    let frames = 0;
    let raf = 0;
    const start = performance.now();

    const probe = () => {
      frames += 1;
      const elapsed = performance.now() - start;
      if (elapsed < 600) {
        raf = requestAnimationFrame(probe);
        return;
      }
      const fps = (frames / elapsed) * 1000;
      if (fps < 30) setTier('low');
      else if (fps < 50) setTier((t) => (t === 'high' ? 'mid' : t));
    };

    raf = requestAnimationFrame(probe);
    return () => cancelAnimationFrame(raf);
  }, []);

  return tier;
}

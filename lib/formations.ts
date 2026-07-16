/**
 * Particle formations (CLAUDE.md §5).
 *
 * Each formation is a target position buffer the LatentField GPU-lerps into as
 * a section scrolls into view, then relaxes back to the ambient nebula. Buffers
 * are plain Float32Array(count * 3) so they can be copied straight into the
 * `aFormationTarget` attribute.
 *
 * This module owns only the target geometry + which section maps to which
 * formation; the blending/animation lives in the shader + LatentField.
 */

export type FormationType = 'constellation' | 'network' | 'candlestick';

/** Which section triggers which formation. null = ambient nebula. */
export function sectionToFormation(section: string | null): FormationType | null {
  switch (section) {
    case 'ai-projects':
      return 'network';
    case 'skills':
      return 'constellation';
    default:
      return null;
  }
}

/** Per-formation tint, as linear-ish RGB 0–1 matching the design tokens (§4). */
export const FORMATION_COLORS: Record<FormationType, [number, number, number]> = {
  constellation: [0.655, 0.616, 0.976], // --iris-soft #A79DF9
  network: [0.431, 0.388, 0.949], // --iris #6E63F2
  candlestick: [0.306, 0.831, 0.769], // --cyan #4ED4C4 (data-viz)
};

/**
 * Constellation (Skills §5): particles gather into clusters — one per skill
 * group — like a star map. Each particle is assigned to a cluster and jittered
 * softly around its center.
 */
export function buildConstellation(count: number, clusters = 7): Float32Array {
  const arr = new Float32Array(count * 3);

  // Cluster centers laid out on a gently flattened ring facing the camera.
  const centers: Array<[number, number, number]> = [];
  for (let c = 0; c < clusters; c++) {
    const angle = (c / clusters) * Math.PI * 2;
    const radius = 26;
    centers.push([
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * 0.55,
      (Math.random() - 0.5) * 12,
    ]);
  }

  for (let i = 0; i < count; i++) {
    const [cx, cy, cz] = centers[i % clusters];
    // Soft spherical jitter so clusters read as loose star groups, not dots.
    const spread = 7;
    arr[i * 3] = cx + (Math.random() - 0.5) * spread;
    arr[i * 3 + 1] = cy + (Math.random() - 0.5) * spread;
    arr[i * 3 + 2] = cz + (Math.random() - 0.5) * spread;
  }

  return arr;
}

/** Dispatch to the right builder. Networks/candlestick land in later PRs. */
export function buildFormation(type: FormationType, count: number): Float32Array {
  switch (type) {
    case 'constellation':
      return buildConstellation(count);
    default:
      // Not yet implemented → fall back to a constellation so nothing breaks.
      return buildConstellation(count);
  }
}

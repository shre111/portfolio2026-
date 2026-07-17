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

/**
 * Network graph (AI Projects / multi-agent §5): particles gather at graph nodes
 * and string along the edges between them, reading as an agent/embedding graph.
 */
export function buildNetwork(count: number, nodeCount = 14): Float32Array {
  const arr = new Float32Array(count * 3);

  // Nodes scattered across a wide, shallow volume facing the camera.
  const nodes: Array<[number, number, number]> = [];
  for (let n = 0; n < nodeCount; n++) {
    nodes.push([
      (Math.random() - 0.5) * 52,
      (Math.random() - 0.5) * 32,
      (Math.random() - 0.5) * 24,
    ]);
  }

  // Edges: a ring plus longer skip-links keep the graph connected and busy.
  const edges: Array<[number, number]> = [];
  for (let n = 0; n < nodeCount; n++) {
    edges.push([n, (n + 1) % nodeCount]);
    edges.push([n, (n + 3) % nodeCount]);
  }

  // ~35% of particles form the node clusters; the rest ride the edges.
  const nodeParticles = Math.floor(count * 0.35);

  for (let i = 0; i < count; i++) {
    if (i < nodeParticles) {
      const [x, y, z] = nodes[i % nodeCount];
      arr[i * 3] = x + (Math.random() - 0.5) * 3;
      arr[i * 3 + 1] = y + (Math.random() - 0.5) * 3;
      arr[i * 3 + 2] = z + (Math.random() - 0.5) * 3;
    } else {
      const [a, b] = edges[i % edges.length];
      const na = nodes[a];
      const nb = nodes[b];
      const t = Math.random();
      arr[i * 3] = na[0] + (nb[0] - na[0]) * t + (Math.random() - 0.5) * 1.2;
      arr[i * 3 + 1] = na[1] + (nb[1] - na[1]) * t + (Math.random() - 0.5) * 1.2;
      arr[i * 3 + 2] = na[2] + (nb[2] - na[2]) * t + (Math.random() - 0.5) * 1.2;
    }
  }

  return arr;
}

/** Dispatch to the right builder. Candlestick lands in the next PR. */
export function buildFormation(type: FormationType, count: number): Float32Array {
  switch (type) {
    case 'constellation':
      return buildConstellation(count);
    case 'network':
      return buildNetwork(count);
    default:
      // Not yet implemented → fall back to a constellation so nothing breaks.
      return buildConstellation(count);
  }
}

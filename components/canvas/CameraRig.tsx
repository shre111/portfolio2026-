'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore } from '@/lib/store';

/**
 * CameraRig — scroll-driven camera choreography (CLAUDE.md §6).
 *
 * The camera eases along a CatmullRom curve whose control points are "stations,"
 * one per section, each framing the latent field from a different angle/depth.
 * Motion is a frame-rate-independent damped lerp toward the point on the curve
 * at the current scroll progress — never a snap.
 *
 * Reduced motion (§9): no auto travel; the camera holds the hero framing.
 */

// One station per section, in document order (hero → contact). The field is
// centered at the origin with particles out to ~60 units, so these weave the
// camera through and around it for parallax as you scroll.
const STATIONS: readonly [number, number, number][] = [
  [0, 0, 50], // hero — head-on nebula
  [-18, 6, 40], // about
  [20, -4, 34], // experience
  [-12, 10, 26], // ai-projects (closest / most immersive)
  [16, 8, 30], // fullstack-projects
  [-8, -10, 36], // skills
  [0, 0, 46], // contact — pull back out
];

export function CameraRig() {
  const { camera } = useThree();
  const scrollProgress = useScrollStore((s) => s.scrollProgress);
  const reducedMotion = useScrollStore((s) => s.reducedMotion);

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        STATIONS.map((p) => new THREE.Vector3(...p))
      ),
    []
  );

  // Scratch objects reused every frame — no per-frame allocations (§7).
  const target = useRef(new THREE.Vector3(...STATIONS[0]));
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((_, delta) => {
    if (reducedMotion) {
      camera.position.set(...STATIONS[0]);
      camera.lookAt(lookTarget.current);
      return;
    }

    const u = Math.min(Math.max(scrollProgress, 0), 1);
    curve.getPointAt(u, target.current);

    // Frame-rate-independent damping toward the current station.
    const alpha = 1 - Math.pow(0.0015, delta);
    camera.position.lerp(target.current, alpha);
    camera.lookAt(lookTarget.current);
  });

  return null;
}

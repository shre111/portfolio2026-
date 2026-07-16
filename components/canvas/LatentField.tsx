'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMousePosition } from '@/hooks/useMousePosition';
import {
  particleVertexShader,
  particleFragmentShader,
} from '@/lib/shaders/particleShaders';

interface LatentFieldProps {
  particleCount?: number;
}

/**
 * LatentField — the signature particle system (CLAUDE.md §5).
 * A single THREE.Points cloud whose positions drift via curl noise in the
 * vertex shader and ripple toward the cursor. Rendered declaratively so R3F
 * owns the lifecycle (no imperative scene-graph mutation).
 */
export function LatentField({ particleCount = 10000 }: LatentFieldProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mousePos = useMousePosition();

  // Base positions + per-particle depth. Memoized so we only allocate when
  // the particle count changes, never per frame (§7 perf budget).
  const { positions, depths } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const depths = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Even-ish distribution inside a spherical shell.
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 20 + Math.random() * 40; // 20–60 units from center

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Depth drives the iris → iris-soft color mix (0 = deep, 1 = near).
      depths[i] = Math.random();
    }

    return { positions, depths };
  }, [particleCount]);

  // Uniforms are created once; values are mutated in-place each frame.
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseInfluence: { value: 0.6 },
    }),
    []
  );

  useFrame(({ clock }) => {
    const material = materialRef.current;
    if (!material) return;

    material.uniforms.uTime.value = clock.getElapsedTime();
    // Normalized cursor (0–1); invert Y so up is up in clip space.
    material.uniforms.uMouse.value.set(
      mousePos.current.x,
      1 - mousePos.current.y
    );
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aPosition" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aDepth" args={[depths, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

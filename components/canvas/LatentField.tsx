'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useScrollStore } from '@/lib/store';
import {
  buildFormation,
  resolveFormation,
  FORMATION_COLORS,
  type FormationType,
} from '@/lib/formations';
import {
  particleVertexShader,
  particleFragmentShader,
} from '@/lib/shaders/particleShaders';

interface LatentFieldProps {
  particleCount?: number;
}

export function LatentField({ particleCount = 10000 }: LatentFieldProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const formationAttrRef = useRef<THREE.BufferAttribute>(null);
  const mousePos = useMousePosition();
  const reducedMotion = useScrollStore((s) => s.reducedMotion);

  // Base positions + per-particle depth. Memoized so we only allocate when the
  // particle count changes, never per frame (§7 perf budget).
  const { positions, depths } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const depths = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 20 + Math.random() * 40; // 20–60 units from center

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      depths[i] = Math.random();
    }

    return { positions, depths };
  }, [particleCount]);

  // Precompute each formation's target buffer once.
  const formationBuffers = useMemo(
    () =>
      ({
        constellation: buildFormation('constellation', particleCount),
        network: buildFormation('network', particleCount),
        candlestick: buildFormation('candlestick', particleCount),
      }) satisfies Record<FormationType, Float32Array>,
    [particleCount]
  );

  // The live target array uploaded to the GPU. Starts as a copy of the base
  // positions; we copy in a formation buffer when one activates.
  const formationTarget = useMemo(
    () => positions.slice(),
    [positions]
  );

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseInfluence: { value: 0.6 },
      uIntro: { value: 0 },
      uFormation: { value: 0 },
      uFormationColor: { value: new THREE.Color(1, 1, 1) },
    }),
    []
  );

  // Which formation is currently loaded into the GPU target buffer. Ref so
  // useFrame reads/writes it without triggering re-renders.
  const loadedFormation = useRef<FormationType | null>(null);

  // Page-load ignition: grow + fade the field in from nothing (§6).
  useEffect(() => {
    if (reducedMotion) {
      uniforms.uIntro.value = 1;
      return;
    }
    uniforms.uIntro.value = 0;
    const tween = gsap.to(uniforms.uIntro, {
      value: 1,
      duration: 1.4,
      ease: 'power2.out',
    });
    return () => {
      tween.kill();
    };
  }, [reducedMotion, uniforms]);

  useFrame((_, delta) => {
    const material = materialRef.current;
    if (!material) return;

    material.uniforms.uTime.value += delta;
    material.uniforms.uMouse.value.set(
      mousePos.current.x,
      1 - mousePos.current.y
    );

    // Read scroll state non-reactively so scrolling never re-renders the field.
    const { activeSection, sectionProgress } = useScrollStore.getState();
    const desired = reducedMotion
      ? null
      : resolveFormation(activeSection, sectionProgress);

    // Swap the target buffer only while the field is essentially ambient, so
    // the structure never visibly jumps between formations.
    if (
      desired &&
      desired !== loadedFormation.current &&
      material.uniforms.uFormation.value < 0.05
    ) {
      formationTarget.set(formationBuffers[desired]);
      if (formationAttrRef.current) formationAttrRef.current.needsUpdate = true;
      material.uniforms.uFormationColor.value.setRGB(
        ...FORMATION_COLORS[desired]
      );
      loadedFormation.current = desired;
    }

    // GPU-lerp in when the loaded formation is the desired one; relax back to
    // the nebula otherwise (§5). Frame-rate-independent damping.
    const target = desired && loadedFormation.current === desired ? 1 : 0;
    const alpha = 1 - Math.pow(0.02, delta);
    material.uniforms.uFormation.value +=
      (target - material.uniforms.uFormation.value) * alpha;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aPosition" args={[positions, 3]} />
        <bufferAttribute
          ref={formationAttrRef}
          attach="attributes-aFormationTarget"
          args={[formationTarget, 3]}
        />
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

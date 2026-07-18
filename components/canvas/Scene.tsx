'use client';

import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bloom, Vignette, EffectComposer } from '@react-three/postprocessing';
import { LatentField } from './LatentField';
import { CameraRig } from './CameraRig';
import { useDeviceTier, TIER_PARTICLE_COUNT } from '@/hooks/useDeviceTier';
import { useRenderActive } from '@/hooks/useRenderActive';

export function Scene() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tier = useDeviceTier();
  // Hooks must run before any early return, so this stays above the low-tier bail.
  const active = useRenderActive(wrapperRef);

  // Low-power devices skip the field entirely and fall back to the static
  // gradient + 2D content already in the DOM (§7).
  if (tier === 'low') return null;

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 w-full h-screen pointer-events-none"
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.75]}
        // Stop drawing entirely when the tab is hidden or the canvas is
        // off-screen; resume seamlessly when it comes back (§7).
        frameloop={active ? 'always' : 'never'}
        camera={{
          position: [0, 0, 50],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[100, 100, 100]} intensity={1} />

        {/* Camera rig for scroll choreography */}
        <CameraRig />

        {/* Particle field (the signature), scaled to the device tier (§7) */}
        <LatentField particleCount={TIER_PARTICLE_COUNT[tier]} />

        {/* Postprocessing */}
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
            intensity={1.2}
            mipmapBlur
          />
          <Vignette darkness={0.3} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

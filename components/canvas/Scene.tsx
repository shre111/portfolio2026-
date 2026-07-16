'use client';

import { Canvas } from '@react-three/fiber';
import { Bloom, Vignette, EffectComposer } from '@react-three/postprocessing';
import { LatentField } from './LatentField';
import { CameraRig } from './CameraRig';

export function Scene() {
  return (
    <div className="fixed inset-0 w-full h-screen pointer-events-none">
      <Canvas
        dpr={[1, 1.75]}
        frameloop="auto"
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

        {/* Particle field (the signature) */}
        <LatentField particleCount={12000} />

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

'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useScrollStore } from '@/lib/store';

/**
 * CameraRig — Scroll-driven camera choreography
 * For now, this is a stub. Full implementation in Phase 2.
 */
export function CameraRig() {
  const { camera } = useThree();
  const scrollProgress = useScrollStore((state) => state.scrollProgress);

  useFrame(() => {
    // Placeholder: gently orbit the camera
    const angle = scrollProgress * Math.PI * 2;
    camera.position.x = Math.sin(angle) * 50;
    camera.position.z = Math.cos(angle) * 50 + 30;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

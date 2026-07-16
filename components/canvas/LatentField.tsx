'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useMousePosition } from '@/hooks/useMousePosition';

// Import shaders as strings
import vertexShader from '@/lib/shaders/particleVertex.glsl?raw';
import fragmentShader from '@/lib/shaders/particleFragment.glsl?raw';

interface LatentFieldProps {
  particleCount?: number;
}

export function LatentField({ particleCount = 10000 }: LatentFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const mousePos = useMousePosition();
  const { camera } = useThree();

  useEffect(() => {
    if (!pointsRef.current) return;

    // Generate particle positions and depths
    const positions = new Float32Array(particleCount * 3);
    const depths = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Distribute particles in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 20 + Math.random() * 40; // 20-60 units from center

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Depth for coloring (0 = inner/dark, 1 = outer/bright)
      depths[i] = Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aPosition', new THREE.BufferAttribute(positions.slice(), 3));
    geometry.setAttribute('aDepth', new THREE.BufferAttribute(depths, 1));

    // Create shader material
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uMouseInfluence: { value: 0.5 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    shaderMaterialRef.current = material;

    const points = new THREE.Points(geometry, material);
    pointsRef.current.add(points);

    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [particleCount]);

  // Animation loop
  useFrame(({ clock }) => {
    if (!shaderMaterialRef.current) return;

    // Update uniforms
    shaderMaterialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    shaderMaterialRef.current.uniforms.uMouse.value.set(
      mousePos.current.x,
      1 - mousePos.current.y // Invert Y for WebGL
    );
  });

  return <group ref={pointsRef} />;
}

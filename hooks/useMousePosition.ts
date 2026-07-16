/**
 * useMousePosition — Hook to track cursor position for particle field perturbation
 * Returns normalized coordinates (0-1) for easy use in shaders via uniforms
 */

import { useEffect, useRef } from 'react';

export interface MousePosition {
  x: number; // 0-1, normalized
  y: number; // 0-1, normalized
  px: number; // raw pixels
  py: number; // raw pixels
}

const DEFAULT_MOUSE_POS: MousePosition = {
  x: 0.5,
  y: 0.5,
  px: 0,
  py: 0,
};

export function useMousePosition() {
  const mousePos = useRef<MousePosition>(DEFAULT_MOUSE_POS);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        px: e.clientX,
        py: e.clientY,
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return mousePos;
}

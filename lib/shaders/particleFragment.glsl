/**
 * Particle Fragment Shader
 * - Soft round sprites (via point distance field)
 * - Color gradient: iris → iris-soft by depth
 * - Additive blending for glow
 */

varying float vDepth;
varying float vDistance;

void main() {
  // Soft round sprite via distance field
  vec2 cxy = 2.0 * gl_PointCoord - 1.0;
  float r = dot(cxy, cxy);
  
  if (r > 1.0) {
    discard;
  }
  
  // Smooth falloff at edges
  float alpha = 1.0 - smoothstep(0.6, 1.0, r);
  
  // Color: iris (#6E63F2) → iris-soft (#A79DF9) by depth
  vec3 iris = vec3(0.431, 0.388, 0.949);      // #6E63F2
  vec3 irisSoft = vec3(0.655, 0.616, 0.976);  // #A79DF9
  
  vec3 color = mix(iris, irisSoft, vDepth);
  
  // Additive blending + fade
  gl_FragColor = vec4(color, alpha * 0.8);
}

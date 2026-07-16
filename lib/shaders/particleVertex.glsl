/**
 * Particle Vertex Shader
 * - Animates particle positions with curl noise
 * - Responds to cursor perturbation
 * - Colors by depth (iris → iris-soft)
 */

uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseInfluence;
attribute vec3 aPosition;
attribute float aDepth;

varying float vDepth;
varying float vDistance;

// Simplex noise function
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 x12;
  x12.x = x0.x - 0.0 + C.xx;
  x12.y = x0.y - 0.0 + C.xx;
  vec2 x22 = x0 - vec2(1.0, 1.0) + C.xx * 2.0;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, C.xx)) + i.x + vec3(0.0, C.x, C.y));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.x, x12.x), dot(x22, x22)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xy + h.yz * x12.xy;
  return 130.0 * dot(m, g);
}

// Curl noise for smooth, organic drifting
vec3 curl(vec3 p) {
  float n1 = snoise(p.xy * 0.5 + uTime * 0.05);
  float n2 = snoise(p.yz * 0.5 + uTime * 0.05);
  float n3 = snoise(p.zx * 0.5 + uTime * 0.05);
  return normalize(vec3(n1, n2, n3)) * 0.3;
}

void main() {
  vec3 pos = aPosition;
  
  // Curl noise drift
  pos += curl(pos + uTime * 0.1);
  
  // Cursor perturbation: ripple effect
  vec2 screenUV = gl_FragCoord.xy / vec2(800.0, 600.0);
  float distToMouse = length(screenUV - uMouse);
  float perturbRadius = 0.3;
  
  if (distToMouse < perturbRadius) {
    float influence = (1.0 - distToMouse / perturbRadius) * uMouseInfluence;
    vec3 perturbDir = normalize(vec3(
      sin(atan(screenUV.y - uMouse.y, screenUV.x - uMouse.x)),
      cos(atan(screenUV.y - uMouse.y, screenUV.x - uMouse.x)),
      0.0
    ));
    pos += perturbDir * influence * 0.5;
  }
  
  vDepth = aDepth;
  vDistance = length(pos);
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = mix(2.0, 4.0, aDepth);
}

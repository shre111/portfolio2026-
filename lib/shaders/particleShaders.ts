/**
 * Particle Vertex Shader
 * - Animates particle positions with curl noise
 * - Responds to cursor perturbation
 * - Colors by depth (iris → iris-soft)
 */

export const particleVertexShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseInfluence;
uniform float uIntro; // 0 -> 1 page-load ignition (§6)
uniform float uFormation; // 0 = ambient nebula, 1 = fully formed (§5)
attribute vec3 aPosition;
attribute vec3 aFormationTarget; // per-particle target for the active formation
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

// Canonical Ashima/Gustavson 2D simplex noise. Returns ~[-1, 1].
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  // Determine which simplex triangle we're in.
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
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
  // Ambient position: base point + organic curl-noise drift.
  vec3 ambient = aPosition;
  ambient += curl(ambient + uTime * 0.1);

  // Blend from the drifting nebula toward the formation target (§5). At
  // uFormation = 0 the field drifts freely; at 1 it snaps into the structure.
  vec3 pos = mix(ambient, aFormationTarget, uFormation);

  // Cursor perturbation.
  // gl_FragCoord does not exist in a vertex shader, so derive the particle's
  // on-screen position by projecting it to clip space, then compare that with
  // the normalized mouse uniform. Particles near the cursor get pushed away
  // (and slightly toward the camera) to read as a ripple you can "touch".
  vec4 clipPos = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  vec2 screenUV = clipPos.xy / clipPos.w * 0.5 + 0.5;
  float distToMouse = length(screenUV - uMouse);
  float perturbRadius = 0.22;

  // smoothstep gives a soft, non-bouncy falloff toward the cursor center.
  float influence = smoothstep(perturbRadius, 0.0, distToMouse) * uMouseInfluence;
  vec2 pushDir = normalize(screenUV - uMouse + vec2(1e-4));
  pos.xy += pushDir * influence * 6.0;
  pos.z += influence * 4.0;

  vDepth = aDepth;
  vDistance = length(pos);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  // Slight size pop near the cursor on top of the depth-based sizing.
  // uIntro grows particles from nothing during the page-load ignition.
  gl_PointSize = (mix(2.0, 4.0, aDepth) + influence * 2.0) * uIntro;
}
`;

export const particleFragmentShader = `
uniform float uIntro; // 0 -> 1 page-load ignition (§6)
uniform float uFormation; // 0 -> 1 formation blend (§5)
uniform vec3 uFormationColor; // tint the field takes on when formed
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
  
  vec3 baseColor = mix(iris, irisSoft, vDepth);
  // When formed, shift toward the formation's tint (e.g. cyan terrain).
  vec3 color = mix(baseColor, uFormationColor, uFormation * 0.7);

  // Additive blending + fade; uIntro fades the whole field in on load.
  gl_FragColor = vec4(color, alpha * 0.8 * uIntro);
}
`;

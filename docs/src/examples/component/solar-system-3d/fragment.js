export default `
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_visible[8];
uniform float u_showOrbits;
uniform float u_coolSun;

// ── Sun tuning ──
const float SUN_RADIUS = 1.8;
const vec3  SUN_EDGE_COLOR = vec3(0.9, 0.55, 0.0);
const vec3  SUN_CENTER_COLOR = vec3(1.0, 0.92, 0.25);

// ── Cool sun face tuning ──
const float LENS_SPACING = 0.32;     // horizontal offset from center
const float LENS_HEIGHT = 0.06;      // vertical offset (positive = up)
const float LENS_RADIUS = 0.22;      // lens circle radius
const vec3  LENS_COLOR = vec3(0.02, 0.02, 0.06);
const float LENS_HIGHLIGHT = 0.2;    // sheen strength on upper lens

const float BRIDGE_WIDTH = 0.1;      // half-width of bridge
const float BRIDGE_THICK = 0.05;     // half-thickness

const float ARM_INNER = 0.54;        // starts at lens edge
const float ARM_OUTER = 0.85;        // extends toward sun edge
const float ARM_THICK = 0.045;       // half-thickness

const float SMILE_Y = 0.28;          // vertical offset below center
const float SMILE_RADIUS = 0.32;     // arc radius
const float SMILE_THICK = 0.06;      // arc line thickness
const float SMILE_SQUASH = 0.9;      // horizontal squash (<1 = wider)

const vec3  FRAME_COLOR = vec3(0.1, 0.05, 0.0);
const float EDGE_SOFT = 0.025;       // smoothstep anti-aliasing width

float raySphere(vec3 ro, vec3 rd, vec3 c, float r) {
  vec3 oc = ro - c;
  float b = dot(oc, rd);
  float h = b * b - (dot(oc, oc) - r * r);
  if (h < 0.0) return -1.0;
  return -b - sqrt(h);
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / u_resolution.y;

  // Slowly orbiting camera
  float camAngle = u_time * 0.06;
  vec3 ro = vec3(sin(camAngle) * 20.0, 18.0, cos(camAngle) * 20.0);
  vec3 ta = vec3(0.0, -3.8, 0.0);
  vec3 fwd = normalize(ta - ro);
  vec3 right = normalize(cross(fwd, vec3(0.0, 1.0, 0.0)));
  vec3 up = cross(right, fwd);
  vec3 rd = normalize(fwd * 1.1 + uv.x * right + uv.y * up);

  vec3 col = vec3(0.0);
  float closest = 1000.0;

  // Stars
  float starVal = hash(floor(uv * 250.0));
  if (starVal > 0.993) {
    float twinkle = 0.5 + 0.5 * sin(u_time * 2.0 + starVal * 80.0);
    col = vec3((starVal - 0.993) / 0.007 * twinkle * 0.3);
  }

  // Sun sphere
  float sunT = raySphere(ro, rd, vec3(0.0), SUN_RADIUS);
  if (sunT > 0.0) {
    closest = sunT;
    vec3 p = normalize(ro + rd * sunT);

    // 3D shading: darken edges for spherical feel
    float facing = dot(p, normalize(ro));
    col = mix(SUN_EDGE_COLOR, SUN_CENTER_COLOR, smoothstep(0.0, 1.0, facing));

    // Cool sun face
    if (u_coolSun > 0.5) {
      float fu = dot(p, right);
      float fv = dot(p, up);

      // Sunglasses lenses
      float leftLens = length(vec2(fu + LENS_SPACING, fv - LENS_HEIGHT)) - LENS_RADIUS;
      float rightLens = length(vec2(fu - LENS_SPACING, fv - LENS_HEIGHT)) - LENS_RADIUS;
      float lens = min(leftLens, rightLens);

      // Bridge
      float bridge = max(abs(fu) - BRIDGE_WIDTH, abs(fv - LENS_HEIGHT) - BRIDGE_THICK);

      // Arms (temples)
      float leftArm = max(max(-(fu + ARM_OUTER), fu + ARM_INNER), abs(fv - LENS_HEIGHT) - ARM_THICK);
      float rightArm = max(max(fu - ARM_OUTER, -(fu - ARM_INNER)), abs(fv - LENS_HEIGHT) - ARM_THICK);
      float arms = min(leftArm, rightArm);

      // Smile
      float smileDist = length(vec2(fu * SMILE_SQUASH, fv + SMILE_Y));
      float smile = max(abs(smileDist - SMILE_RADIUS) - SMILE_THICK, fv + SMILE_Y);

      // Dark lenses with highlight
      if (lens < 0.0) {
        float edge = smoothstep(-EDGE_SOFT, 0.0, lens);
        float highlight = smoothstep(0.0, 0.25, fv) * LENS_HIGHLIGHT;
        col = mix(LENS_COLOR + highlight, col, edge);
      }

      // Frames and smile
      float frame = min(min(bridge, arms), smile);
      if (frame < 0.0) {
        float edge = smoothstep(-EDGE_SOFT, 0.0, frame);
        col = mix(FRAME_COLOR, col, edge);
      }
    }
  }

  vec3 toSun = normalize(-ro);

  // Orbit rings on y=0 plane
  if (u_showOrbits > 0.5 && abs(rd.y) > 0.001) {
    float planeT = -ro.y / rd.y;
    if (planeT > 0.0 && planeT < closest) {
      vec3 hitP = ro + rd * planeT;
      float dist = length(vec2(hitP.x, hitP.z));

      for (int i = 0; i < 8; i++) {
        if (u_visible[i] > 0.5) {
          float oR;
          if (i == 0) oR = 2.5;
          else if (i == 1) oR = 3.5;
          else if (i == 2) oR = 4.5;
          else if (i == 3) oR = 5.8;
          else if (i == 4) oR = 7.8;
          else if (i == 5) oR = 10.0;
          else if (i == 6) oR = 12.0;
          else oR = 13.8;

          float band = abs(dist - oR);
          if (band < 0.05) {
            col += vec3(1.0) * (1.0 - band / 0.05) * 0.18;
          }
        }
      }
    }
  }

  // Planets
  for (int i = 0; i < 8; i++) {
    if (u_visible[i] > 0.5) {
      float orbitR, planetR, speed, offset;
      vec3 pColor;
      bool rings = false;

      if (i == 0) { orbitR=2.5; planetR=0.15; speed=1.6; offset=0.0; pColor=vec3(0.71,0.71,0.71); }
      else if (i == 1) { orbitR=3.5; planetR=0.18; speed=1.1; offset=2.1; pColor=vec3(0.91,0.80,0.64); }
      else if (i == 2) { orbitR=4.5; planetR=0.19; speed=0.8; offset=4.2; pColor=vec3(0.30,0.62,0.88); }
      else if (i == 3) { orbitR=5.8; planetR=0.16; speed=0.6; offset=1.5; pColor=vec3(0.88,0.36,0.23); }
      else if (i == 4) { orbitR=7.8; planetR=0.40; speed=0.35; offset=3.0; pColor=vec3(0.83,0.65,0.45); }
      else if (i == 5) { orbitR=10.0; planetR=0.34; speed=0.25; offset=5.5; pColor=vec3(0.91,0.84,0.64); rings=true; }
      else if (i == 6) { orbitR=12.0; planetR=0.24; speed=0.18; offset=0.8; pColor=vec3(0.50,0.78,0.89); }
      else { orbitR=13.8; planetR=0.22; speed=0.12; offset=2.5; pColor=vec3(0.25,0.37,0.81); }

      float angle = u_time * speed + offset;
      vec3 center = vec3(cos(angle) * orbitR, 0.0, sin(angle) * orbitR);

      // Saturn rings
      if (rings && abs(rd.y) > 0.001) {
        float ringT = -ro.y / rd.y;
        if (ringT > 0.0 && ringT < closest) {
          vec3 hitP = ro + rd * ringT;
          float d = length(vec2(hitP.x - center.x, hitP.z - center.z));
          float innerR = planetR * 1.5;
          float outerR = planetR * 2.8;
          if (d > innerR && d < outerR) {
            float ringBand = 0.5 + 0.5 * sin(d * 50.0);
            float fade = smoothstep(innerR, innerR + 0.02, d) * smoothstep(outerR, outerR - 0.02, d);
            float light = 0.3 + 0.7 * max(normalize(-center).y + 0.5, 0.0);
            col = pColor * 0.6 * ringBand * fade * light;
            closest = ringT;
          }
        }
      }

      // Planet sphere
      float t = raySphere(ro, rd, center, planetR);
      if (t > 0.0 && t < closest) {
        closest = t;
        vec3 n = normalize(ro + rd * t - center);
        float diff = max(dot(n, normalize(-center)), 0.0);
        col = pColor * (0.06 + 0.94 * diff);
      }
    }
  }

  // Sun glow — only apply to rays that missed the sun sphere
  float glow = max(dot(rd, toSun), 0.0);
  vec3 glowCol = vec3(1.0, 0.7, 0.3) * pow(glow, 80.0) * 0.15
               + vec3(1.0, 0.4, 0.1) * pow(glow, 20.0) * 0.008;
  if (sunT <= 0.0) {
    float occlude = pow(glow, 30.0);
    col = col * (1.0 - occlude) + glowCol;
  }

  gl_FragColor = vec4(col, 1.0);
}
`;

/**
 * hero-globe-ui.js — WebGL orbiting UI on the plasma sphere
 *
 * UI component GIFs orbit a 3D sphere matching the gradient overlay.
 * Front-face elements are visible; back-face elements fade out (occluded).
 * Mouse movement tilts the viewing angle. Near-black pixels are discarded
 * in the fragment shader (replaces CPU-side alpha processing).
 */

const DEG = Math.PI / 180;

const SOURCES = [
  '/primitives/menu-dark.gif',
  '/primitives/input-dark.gif',
  '/primitives/button-dark.gif',
];

// ═══════════════════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════════════════

const SPHERE_RADIUS = 350;
const PERSPECTIVE_D = 900;

const BLACK_THRESHOLD = 10.0 / 255.0;

// Occlusion fade (normalized z/R)
const FADE_IN = 0.20;
const FADE_OUT = -0.05;

// Large orbiters — prominent, clearly recognizable
const LARGE_ORBITERS = [
  { src: 0, inc: 12, asc: 0, angle: 0, speed: 8, scale: 1.10, maxOpacity: 1 },
  { src: 1, inc: -22, asc: 65, angle: 130, speed: 6, scale: 0.95, maxOpacity: 1 },
  { src: 2, inc: 28, asc: 140, angle: 250, speed: 10, scale: 1.20, maxOpacity: 1 },
  { src: 0, inc: -10, asc: 210, angle: 50, speed: 7, scale: 0.70, maxOpacity: 1 },
  { src: 2, inc: 38, asc: 290, angle: 180, speed: 5, scale: 0.80, maxOpacity: 1 },
  { src: 1, inc: -32, asc: 35, angle: 310, speed: 9, scale: 0.65, maxOpacity: 1 },
];

const SMALL_COUNT = 40;

// ═══════════════════════════════════════════════════════════════
// Shaders
// ═══════════════════════════════════════════════════════════════

const VERT = `
attribute vec2 aPos;
uniform vec2 uOffset;
uniform vec2 uSize;
uniform vec2 uHalfRes;
varying vec2 vUV;

void main() {
  vUV = aPos * 0.5 + 0.5;
  vec2 px = aPos * uSize * 0.5 + uOffset;
  gl_Position = vec4(px / uHalfRes, 0.0, 1.0);
  gl_Position.y = -gl_Position.y;
}`;

const FRAG = `
precision mediump float;
uniform sampler2D uTex;
uniform float uOpacity;
uniform float uThreshold;
varying vec2 vUV;

void main() {
  vec4 c = texture2D(uTex, vUV);
  float mx = max(c.r, max(c.g, c.b));
  if (mx < uThreshold) discard;
  gl_FragColor = vec4(c.rgb * uOpacity, uOpacity);
}`;

// ═══════════════════════════════════════════════════════════════
// 3D Math
// ═══════════════════════════════════════════════════════════════

function orbitalPos(R, incDeg, ascDeg, thetaDeg) {
  const inc = incDeg * DEG, asc = ascDeg * DEG, th = thetaDeg * DEG;
  const ct = Math.cos(th), st = Math.sin(th);
  const ci = Math.cos(inc), si = Math.sin(inc);
  const ca = Math.cos(asc), sa = Math.sin(asc);

  const x1 = ct;
  const y1 = -si * st;
  const z1 = ci * st;

  return {
    x: R * (ca * x1 + sa * z1),
    y: R * y1,
    z: R * (-sa * x1 + ca * z1),
  };
}

// ═══════════════════════════════════════════════════════════════
// Public API
// ═══════════════════════════════════════════════════════════════

export function createGlobeUI(containerEl) {
  if (!containerEl) { return { destroy() {} }; }

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionQuery.matches) { return { destroy() {} }; }

  // ── Canvas + WebGL context ──────────────────────────────────

  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    zIndex: '1',
    pointerEvents: 'none',
  });

  const gl = canvas.getContext('webgl', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
  });
  if (!gl) { return { destroy() {} }; }

  // ── Compile shader program ──────────────────────────────────

  function compileShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const aPos = gl.getAttribLocation(prog, 'aPos');
  const uOffset = gl.getUniformLocation(prog, 'uOffset');
  const uSize = gl.getUniformLocation(prog, 'uSize');
  const uHalfRes = gl.getUniformLocation(prog, 'uHalfRes');
  const uTex = gl.getUniformLocation(prog, 'uTex');
  const uOpacity = gl.getUniformLocation(prog, 'uOpacity');
  const uThreshold = gl.getUniformLocation(prog, 'uThreshold');

  // ── Quad geometry ───────────────────────────────────────────

  const quadBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1,
      -1,
      1,
      -1,
      -1,
      1,
      -1,
      1,
      1,
      -1,
      1,
      1,
    ]),
    gl.STATIC_DRAW,
  );
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  // ── Textures (one per GIF source) ──────────────────────────

  const srcImgs = SOURCES.map(src => {
    const img = new Image();
    img.src = src;
    return img;
  });

  const texInfo = SOURCES.map(() => {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
    return { tex, ready: false, w: 0, h: 0 };
  });

  // ── Blend state ─────────────────────────────────────────────

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  // ── Build orbiter list ──────────────────────────────────────

  const orbiters = [];

  for (const cfg of LARGE_ORBITERS) {
    orbiters.push({ ...cfg });
  }

  for (let i = 0; i < SMALL_COUNT; i++) {
    const t = Math.random();
    orbiters.push({
      src: Math.floor(Math.random() * SOURCES.length),
      inc: (Math.random() - 0.5) * 80,
      asc: Math.random() * 360,
      angle: Math.random() * 360,
      speed: 3 + Math.random() * 9,
      scale: 0.05 + t * 0.45,
      maxOpacity: 0.3 + t * 0.7,
    });
  }

  containerEl.appendChild(canvas);

  // ── Animation loop ──────────────────────────────────────────

  let running = true;
  let lastTime = performance.now();

  // Reusable array for visible orbiters (avoids allocation per frame)
  const visible = [];

  function animate(now) {
    if (!running) { return; }

    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;
    const t = now / 1000;

    // Resize canvas to match container
    const dpr = window.devicePixelRatio || 1;
    const cw = containerEl.clientWidth;
    const ch = containerEl.clientHeight;
    const pw = Math.round(cw * dpr);
    const ph = Math.round(ch * dpr);
    if (canvas.width !== pw || canvas.height !== ph) {
      canvas.width = pw;
      canvas.height = ph;
    }

    gl.viewport(0, 0, pw, ph);

    // Update textures from current GIF frames
    for (let i = 0; i < srcImgs.length; i++) {
      const img = srcImgs[i];
      if (!img.naturalWidth) { continue; }
      const ti = texInfo[i];
      gl.bindTexture(gl.TEXTURE_2D, ti.tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      if (!ti.ready) {
        ti.w = img.naturalWidth;
        ti.h = img.naturalHeight;
        ti.ready = true;
      }
    }

    // Clear
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(prog);
    gl.uniform2f(uHalfRes, pw * 0.5, ph * 0.5);
    gl.uniform1f(uThreshold, BLACK_THRESHOLD);
    gl.uniform1i(uTex, 0);
    gl.activeTexture(gl.TEXTURE0);

    // Compute positions, cull occluded, collect visible
    visible.length = 0;
    for (const orb of orbiters) {
      const ti = texInfo[orb.src];
      if (!ti.ready) { continue; }

      const theta = orb.angle + t * orb.speed;
      const pos = orbitalPos(SPHERE_RADIUS, orb.inc, orb.asc, theta);
      // Occlusion fade
      const nz = pos.z / SPHERE_RADIUS;
      let vis;
      if (nz >= FADE_IN) { vis = 1; }
      else if (nz <= FADE_OUT) { vis = 0; }
      else { vis = (nz - FADE_OUT) / (FADE_IN - FADE_OUT); }

      const opacity = vis * orb.maxOpacity;
      if (opacity < 0.001) { continue; }

      const pScale = PERSPECTIVE_D / (PERSPECTIVE_D - pos.z);
      visible.push({
        texIdx: orb.src,
        x: pos.x * pScale * dpr,
        y: pos.y * pScale * dpr,
        w: ti.w * orb.scale * pScale * dpr,
        h: ti.h * orb.scale * pScale * dpr,
        z: pos.z,
        opacity,
      });
    }

    // Sort back-to-front for correct blending
    visible.sort((a, b) => a.z - b.z);

    // Draw each visible orbiter
    for (const v of visible) {
      gl.bindTexture(gl.TEXTURE_2D, texInfo[v.texIdx].tex);
      gl.uniform2f(uOffset, v.x, v.y);
      gl.uniform2f(uSize, v.w, v.h);
      gl.uniform1f(uOpacity, v.opacity);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  // ── Reduced motion ──────────────────────────────────────────

  function onMotionChange() {
    if (motionQuery.matches) {
      running = false;
      canvas.style.display = 'none';
    }
    else {
      running = true;
      canvas.style.display = '';
      lastTime = performance.now();
      requestAnimationFrame(animate);
    }
  }
  motionQuery.addEventListener('change', onMotionChange);

  return {
    destroy() {
      running = false;
      motionQuery.removeEventListener('change', onMotionChange);
      canvas.remove();
      gl.deleteProgram(prog);
      texInfo.forEach(t => gl.deleteTexture(t.tex));
      gl.deleteBuffer(quadBuf);
    },
  };
}

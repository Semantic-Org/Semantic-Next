/**
 * plasma.js — Demoscene plasma effect (ESM)
 *
 * Based on the GLSL shader by Nikos Papadopoulos (4rknova, 2016)
 * with specular highlights contributed by Shane.
 *
 * Uses WebGL when available (GPU-accelerated, full resolution, 60fps).
 * Falls back to optimized JS canvas rendering when WebGL is unavailable.
 *
 * @example
 * import { createPlasma } from './plasma.js'
 *
 * const plasma = createPlasma('#hero-canvas', {
 *   colorFrom:    '#000000',
 *   colorTo:      '#1a5c6e',
 *   colorShift:   2.8,
 *   specularTint: '#1a99e6',
 * })
 *
 * // Callback to control renderer selection
 * const plasma = createPlasma('#hero-canvas', {
 *   onRenderer: ({ type, gl }) => {
 *     console.log(`Using ${type} renderer`)
 *     // return false to reject this renderer and try the next
 *   },
 * })
 *
 * // Force canvas-only (skip WebGL)
 * const plasma = createPlasma('#hero-canvas', {
 *   onRenderer: ({ type }) => type !== 'webgl' ? false : undefined,
 * })
 *
 * // Bail entirely if no WebGL
 * const plasma = createPlasma('#hero-canvas', {
 *   onRenderer: ({ type }) => {
 *     if (type === 'canvas') return false
 *   },
 * })
 *
 * // Control API
 * plasma.pause()
 * plasma.resume()
 * plasma.destroy()
 * plasma.resize()
 * plasma.renderer           // 'webgl' | 'canvas'
 * plasma.setSettings({ speed: 2, brightness: 0.6 })
 * plasma.setSettings({ mouse: { warp: 0.8 } })  // cranked gravity
 * plasma.setSettings({ mouse: false })            // disable mouse
 */

// ═══════════════════════════════════════════════════════════════
// Utilities
// ═══════════════════════════════════════════════════════════════

function hexToRgb(hex) {
  let h = hex.replace(/^#/, '');
  if (h.length === 3) { h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]; }
  const n = parseInt(h, 16);
  return [(n >> 16 & 0xff) / 255, (n >> 8 & 0xff) / 255, (n & 0xff) / 255];
}

function rgbToHex([r, g, b]) {
  const c = (ch) => Math.round(Math.max(0, Math.min(1, ch)) * 255).toString(16).padStart(2, '0');
  return '#' + c(r) + c(g) + c(b);
}

function deepMerge(target, source) {
  const out = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])
      && target[key] !== null && typeof target[key] === 'object' && !Array.isArray(target[key])
    ) {
      out[key] = deepMerge(target[key], source[key]);
    }
    else {
      out[key] = source[key];
    }
  }
  return out;
}

function deriveColorPalette(fromHex, toHex, shift) {
  const from = hexToRgb(fromHex);
  const to = hexToRgb(toHex);
  return {
    base: from.map((f, i) => (f + to[i]) / 2),
    amp: from.map((f, i) => (to[i] - f) / 2),
    phase: [shift, shift * 0.107, 0],
  };
}

function resolveConfig(cfg) {
  const palette = cfg.color || deriveColorPalette(cfg.colorFrom, cfg.colorTo, cfg.colorShift);
  const specEnabled = cfg.specularTint !== false;
  const specTint = specEnabled ? hexToRgb(cfg.specularTint) : [0, 0, 0];
  // Normalize mouse: false → false, partial object → merged with defaults
  let mouse = cfg.mouse;
  if (mouse && typeof mouse === 'object') {
    mouse = { light: 0.6, warp: 0.3, ...mouse };
  }
  return { ...cfg, mouse, _palette: palette, _specEnabled: specEnabled, _specTint: specTint };
}

// ═══════════════════════════════════════════════════════════════
// Defaults
// ═══════════════════════════════════════════════════════════════

const DEFAULTS = {
  colorFrom: '#000000',
  colorTo: '#1a5c6e',
  colorShift: 2.8,

  speed: 1,
  density: 4.0,
  brightness: 1.0,
  scrollSpeed: 0.3,
  resolution: 1, // pixel divisor (1 = full res, 2 = half, etc.)
  canvasScale: 3, // extra divisor applied only on canvas fallback (1 = no extra)

  specularTint: '#1a99e6',
  specularPower: 2,
  specularAmbient: 0.45,

  fadeInClass: 'loaded',
  pauseOffscreen: true,
  fps: false,

  /**
   * Called when a renderer is about to be used.
   * @param {{ type: 'webgl'|'canvas', gl?: WebGLRenderingContext }} info
   * @returns {false|void} Return false to reject this renderer.
   */
  onRenderer: null,

  /**
   * Mouse interaction — cursor affects the plasma.
   * Coordinates are center-origin: (0,0) = center, (-0.5,-0.5) = top-left.
   * Set false to disable entirely, or an object with:
   *   light: -1 to 1 — specular highlights follow (+) or flee (-) cursor
   *   warp:  0–1+    — gravitational lens pulls bands toward cursor
   */
  mouse: {
    light: 0.6,
    warp: 0.3,
  },

  wave: {
    kBase: 0.1,
    kTimeScale: 2.4,
    kPhase: 0.148,
    wBase: 0.9,
    wTimeScale: -0.7,
    wPhase: 0.628,
    intensity: 7.0,
  },

  color: null,
};

// ═══════════════════════════════════════════════════════════════
// WebGL Renderer
// ═══════════════════════════════════════════════════════════════

const VERT_SRC = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// Fragment shader — 4rknova's plasma with parameterized uniforms
const FRAG_SRC = `
#extension GL_OES_standard_derivatives : enable
precision mediump float;

uniform float u_time;
uniform vec2  u_resolution;
uniform float u_density;
uniform float u_scrollSpeed;
uniform float u_brightness;

uniform vec3  u_colorBase;
uniform vec3  u_colorAmp;
uniform vec3  u_colorPhase;

uniform bool  u_specEnabled;
uniform vec3  u_specTint;
uniform float u_specPower;
uniform float u_specAmbient;

uniform float u_kBase;
uniform float u_kTimeScale;
uniform float u_kPhase;
uniform float u_wBase;
uniform float u_wTimeScale;
uniform float u_wPhase;
uniform float u_intensity;

uniform vec2  u_mouse;
uniform float u_mouseLight;
uniform float u_mouseWarp;

void main() {
    vec2 a = vec2(u_resolution.x / u_resolution.y, 1.0);
    vec2 c = u_density * gl_FragCoord.xy / u_resolution * a + u_time * u_scrollSpeed;

    // Gravity warp — pull coordinates toward mouse
    // u_mouse is center-origin (-0.5 to 0.5), convert to plasma space
    if (u_mouseWarp > 0.0) {
        vec2 mUV = u_mouse + 0.5;  // back to 0-1 for plasma coord conversion
        vec2 m = vec2(mUV.x, 1.0 - mUV.y) * u_density * a + u_time * u_scrollSpeed;
        vec2 diff = c - m;
        float dist2 = dot(diff, diff);
        c -= u_mouseWarp * diff / (1.0 + dist2);
    }

    float k = u_kBase + cos(c.y + sin(u_kPhase - u_time)) + u_kTimeScale * u_time;
    float w = u_wBase + sin(c.x + cos(u_wPhase + u_time)) + u_wTimeScale * u_time;
    float d = length(c);
    float s = u_intensity * cos(d + w) * sin(k + w);

    vec3 col = u_colorBase + u_colorAmp * cos(s + u_colorPhase);

    if (u_specEnabled) {
        float nz = 0.5 / u_resolution.y;
        vec3 n = normalize(vec3(length(dFdx(col)), length(dFdy(col)), nz));

        // Overhead specular (original)
        float overheadSpec = pow(max(n.z, 0.0), u_specPower);

        // Directional specular — light follows or flees cursor
        // u_mouse is center-origin; convert pixel to same space
        vec2 pixelCentered = gl_FragCoord.xy / u_resolution - 0.5;
        pixelCentered.y = -pixelCentered.y;  // flip Y to screen convention
        // sign(u_mouseLight): positive = toward cursor, negative = away
        vec2 toMouse = sign(u_mouseLight) * (u_mouse - pixelCentered) * 2.0;
        vec3 lightDir = normalize(vec3(toMouse, 1.0));
        float dirSpec = pow(max(dot(n, lightDir), 0.0), u_specPower);

        float spec = mix(overheadSpec, dirSpec, abs(u_mouseLight));
        col *= u_specTint * spec + u_specAmbient;
    }

    col *= u_brightness;

    gl_FragColor = vec4(col, 1.0);
}
`;

function createWebGLRenderer(canvas, getCfg) {
  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    desynchronized: true,
  });
  if (!gl) { return null; }

  // Try to enable P3 wide gamut — property is silently ignored if unsupported
  let colorSpace = 'srgb';
  if ('drawingBufferColorSpace' in gl) {
    try {
      gl.drawingBufferColorSpace = 'display-p3';
    }
    catch (e) {}
    if (gl.drawingBufferColorSpace === 'display-p3') { colorSpace = 'display-p3'; }
  }

  // ── GPU resources (rebuilt on context restore) ──
  let prog = null, vs = null, fs = null, quad = null, loc = {}, aPos = -1;
  let contextLost = false;

  function buildProgram() {
    gl.getExtension('OES_standard_derivatives');

    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('plasma.js shader error:', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    }

    vs = compile(gl.VERTEX_SHADER, VERT_SRC);
    fs = compile(gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vs || !fs) { return false; }

    prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('plasma.js link error:', gl.getProgramInfoLog(prog));
      return false;
    }
    gl.useProgram(prog);

    quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    loc = {};
    const uNames = [
      'u_time',
      'u_resolution',
      'u_density',
      'u_scrollSpeed',
      'u_brightness',
      'u_colorBase',
      'u_colorAmp',
      'u_colorPhase',
      'u_specEnabled',
      'u_specTint',
      'u_specPower',
      'u_specAmbient',
      'u_kBase',
      'u_kTimeScale',
      'u_kPhase',
      'u_wBase',
      'u_wTimeScale',
      'u_wPhase',
      'u_intensity',
      'u_mouse',
      'u_mouseLight',
      'u_mouseWarp',
    ];
    for (const name of uNames) { loc[name] = gl.getUniformLocation(prog, name); }
    return true;
  }

  if (!buildProgram()) { return null; }

  // ── Context loss handling ──
  function onContextLost(e) {
    e.preventDefault(); // signal we want restoration
    contextLost = true;
  }
  function onContextRestored() {
    contextLost = false;
    // P3 needs to be re-set after context restore
    if ('drawingBufferColorSpace' in gl) {
      try {
        gl.drawingBufferColorSpace = 'display-p3';
      }
      catch (e) {}
    }
    buildProgram();
    self.resize(); // resets viewport
  }
  canvas.addEventListener('webglcontextlost', onContextLost);
  canvas.addEventListener('webglcontextrestored', onContextRestored);

  let w = 0, h = 0;

  const self = {
    gl,
    type: 'webgl',
    colorSpace,

    resize() {
      const cfg = getCfg();
      const rect = canvas.parentElement
        ? canvas.parentElement.getBoundingClientRect()
        : { width: window.innerWidth, height: window.innerHeight };

      // WebGL uses base resolution only (canvasScale is for JS fallback)
      const dpr = Math.min(window.devicePixelRatio || 1, 3); // cap at 3x
      w = Math.ceil(rect.width * dpr / cfg.resolution);
      h = Math.ceil(rect.height * dpr / cfg.resolution);
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    },

    render(time, mx, my) {
      if (contextLost) { return; }
      // Re-set program/buffer state (layers may have modified it)
      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      const cfg = getCfg();
      const p = cfg._palette;
      const wv = cfg.wave;
      const mouse = cfg.mouse;

      gl.uniform1f(loc.u_time, time);
      gl.uniform2f(loc.u_resolution, w, h);
      gl.uniform1f(loc.u_density, cfg.density);
      gl.uniform1f(loc.u_scrollSpeed, cfg.scrollSpeed);
      gl.uniform1f(loc.u_brightness, cfg.brightness);

      gl.uniform3f(loc.u_colorBase, p.base[0], p.base[1], p.base[2]);
      gl.uniform3f(loc.u_colorAmp, p.amp[0], p.amp[1], p.amp[2]);
      gl.uniform3f(loc.u_colorPhase, p.phase[0], p.phase[1], p.phase[2]);

      gl.uniform1i(loc.u_specEnabled, cfg._specEnabled ? 1 : 0);
      gl.uniform3f(loc.u_specTint, cfg._specTint[0], cfg._specTint[1], cfg._specTint[2]);
      gl.uniform1f(loc.u_specPower, cfg.specularPower);
      gl.uniform1f(loc.u_specAmbient, cfg.specularAmbient);

      gl.uniform1f(loc.u_kBase, wv.kBase);
      gl.uniform1f(loc.u_kTimeScale, wv.kTimeScale);
      gl.uniform1f(loc.u_kPhase, wv.kPhase);
      gl.uniform1f(loc.u_wBase, wv.wBase);
      gl.uniform1f(loc.u_wTimeScale, wv.wTimeScale);
      gl.uniform1f(loc.u_wPhase, wv.wPhase);
      gl.uniform1f(loc.u_intensity, wv.intensity);

      gl.uniform2f(loc.u_mouse, mx, my);
      gl.uniform1f(loc.u_mouseLight, mouse ? mouse.light : 0);
      gl.uniform1f(loc.u_mouseWarp, mouse ? mouse.warp : 0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },

    getSize() {
      return { w, h };
    },

    destroy() {
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      if (!contextLost) {
        gl.deleteProgram(prog);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(quad);
      }
      const ext = gl.getExtension('WEBGL_lose_context');
      if (ext) { ext.loseContext(); }
    },
  };

  return self;
}

// ═══════════════════════════════════════════════════════════════
// Canvas (JS) Fallback Renderer
// ═══════════════════════════════════════════════════════════════

function createCanvasRenderer(canvas, getCfg) {
  const ctxOpts = {
    alpha: false,
    willReadFrequently: false,
    desynchronized: true,
  };

  // Request P3 — browser silently falls back to sRGB if unsupported
  const ctx = canvas.getContext('2d', { ...ctxOpts, colorSpace: 'display-p3' });
  if (!ctx) { return null; }

  let colorSpace = 'srgb';
  try {
    colorSpace = ctx.getContextAttributes().colorSpace || 'srgb';
  }
  catch (e) {}

  let w, h, imgData, data;

  return {
    type: 'canvas',
    colorSpace,

    resize() {
      const cfg = getCfg();
      const rect = canvas.parentElement
        ? canvas.parentElement.getBoundingClientRect()
        : { width: window.innerWidth, height: window.innerHeight };

      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      const divisor = cfg.resolution * cfg.canvasScale;
      w = Math.ceil(rect.width * dpr / divisor);
      h = Math.ceil(rect.height * dpr / divisor);
      canvas.width = w;
      canvas.height = h;
      imgData = ctx.createImageData(w, h);
      data = imgData.data;
    },

    render(time, mx, my) {
      const cfg = getCfg();
      const t = time;
      const aspect = w / h;

      const sc = cfg.density;
      const ss = cfg.scrollSpeed;
      const br = cfg.brightness;
      const doSpec = cfg._specEnabled;
      const st0 = cfg._specTint[0], st1 = cfg._specTint[1], st2 = cfg._specTint[2];
      const specPow = cfg.specularPower;
      const specAmb = cfg.specularAmbient;
      const cb0 = cfg._palette.base[0], cb1 = cfg._palette.base[1], cb2 = cfg._palette.base[2];
      const ca0 = cfg._palette.amp[0], ca1 = cfg._palette.amp[1], ca2 = cfg._palette.amp[2];
      const cp0 = cfg._palette.phase[0], cp1 = cfg._palette.phase[1], cp2 = cfg._palette.phase[2];

      const kBase = cfg.wave.kBase, kTS = cfg.wave.kTimeScale, kPh = cfg.wave.kPhase;
      const wBase = cfg.wave.wBase, wTS = cfg.wave.wTimeScale, wPh = cfg.wave.wPhase;
      const intensity = cfg.wave.intensity;

      const mouse = cfg.mouse;
      const warpStr = mouse ? mouse.warp : 0;
      const lightStr = mouse ? mouse.light : 0;

      // Mouse in plasma coordinate space (center-origin → 0-1 → plasma coords)
      const mxC = (mx + 0.5) * aspect * sc + t * ss;
      const myC = (my + 0.5) * sc + t * ss;

      const epsX = (1.0 / w) * aspect * sc;
      const epsY = (1.0 / h) * sc;
      const nz = 0.5 / h;
      const nzSq = nz * nz;

      const buf32 = new Uint32Array(data.buffer);

      const sinKPh = Math.sin(kPh - t);
      const cosWPh = Math.cos(wPh + t);
      const kTime = kBase + kTS * t;
      const wTime = wBase + wTS * t;
      const tScroll = t * ss;

      let idx = 0;

      for (let py = 0; py < h; py++) {
        const ny = py / h;

        for (let px = 0; px < w; px++) {
          const nx = px / w;

          let cx = nx * aspect * sc + tScroll;
          let cy = ny * sc + tScroll;

          // Gravity warp
          if (warpStr > 0) {
            const dx = cx - mxC;
            const dy = cy - myC;
            const dist2 = dx * dx + dy * dy;
            const pull = warpStr / (1 + dist2);
            cx -= dx * pull;
            cy -= dy * pull;
          }

          const kRow = kTime + Math.cos(cy + sinKPh);
          const ww = wTime + Math.sin(cx + cosWPh);
          const d = Math.sqrt(cx * cx + cy * cy);
          const s = intensity * Math.cos(d + ww) * Math.sin(kRow + ww);

          let r = cb0 + ca0 * Math.cos(s + cp0);
          let g = cb1 + ca1 * Math.cos(s + cp1);
          let b = cb2 + ca2 * Math.cos(s + cp2);

          if (doSpec) {
            const cxE = cx + epsX;
            const wwE = wTime + Math.sin(cxE + cosWPh);
            const dE = Math.sqrt(cxE * cxE + cy * cy);
            const sX = intensity * Math.cos(dE + wwE) * Math.sin(kRow + wwE);

            const cyE = cy + epsY;
            const kRowE = kTime + Math.cos(cyE + sinKPh);
            const dEy = Math.sqrt(cx * cx + cyE * cyE);
            const sY = intensity * Math.cos(dEy + ww) * Math.sin(kRowE + ww);

            const drx = (cb0 + ca0 * Math.cos(sX + cp0)) - r;
            const dgx = (cb1 + ca1 * Math.cos(sX + cp1)) - g;
            const dbx = (cb2 + ca2 * Math.cos(sX + cp2)) - b;
            const dry = (cb0 + ca0 * Math.cos(sY + cp0)) - r;
            const dgy = (cb1 + ca1 * Math.cos(sY + cp1)) - g;
            const dby = (cb2 + ca2 * Math.cos(sY + cp2)) - b;

            const dxLen = Math.sqrt(drx * drx + dgx * dgx + dbx * dbx);
            const dyLen = Math.sqrt(dry * dry + dgy * dgy + dby * dby);
            const normalZ = nz / (Math.sqrt(dxLen * dxLen + dyLen * dyLen + nzSq) || 0.001);

            let specVal = normalZ;
            for (let p = 1; p < specPow; p++) { specVal *= normalZ; }

            r = r * specVal * st0 + r * specAmb;
            g = g * specVal * st1 + g * specAmb;
            b = b * specVal * st2 + b * specAmb;
          }

          r *= br;
          g *= br;
          b *= br;
          const ri = r > 1 ? 255 : r < 0 ? 0 : (r * 255) | 0;
          const gi = g > 1 ? 255 : g < 0 ? 0 : (g * 255) | 0;
          const bi = b > 1 ? 255 : b < 0 ? 0 : (b * 255) | 0;
          buf32[idx++] = 0xFF000000 | (bi << 16) | (gi << 8) | ri;
        }
      }

      ctx.putImageData(imgData, 0, 0);
    },

    getSize() {
      return { w, h };
    },

    destroy() {
      // nothing to tear down for 2d context
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// FPS Overlay
// ═══════════════════════════════════════════════════════════════

function createFpsSystem(canvas, getCfg, getRendererInfo) {
  const FPS_HISTORY = 120;
  let el = null;
  let sparkCanvas = null;
  let sparkCtx = null;
  let labelEl = null;
  let frames = [];
  let lastTime = performance.now();

  function color(fps) {
    if (fps >= 50) { return '#34d399'; }
    if (fps >= 30) { return '#fbbf24'; }
    return '#f87171';
  }

  function create() {
    if (el) { return; }

    el = document.createElement('div');
    el.setAttribute('data-plasma-fps', '');
    Object.assign(el.style, {
      position: 'absolute',
      bottom: '16px',
      right: '16px',
      zIndex: '9999',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '4px',
      background: 'rgba(0,0,0,0.72)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderRadius: '10px',
      padding: '10px 12px 8px',
      fontFamily: 'ui-monospace, "JetBrains Mono", "SF Mono", monospace',
      lineHeight: '1',
      pointerEvents: 'none',
      userSelect: 'none',
      border: '1px solid rgba(255,255,255,0.08)',
    });

    // Number row
    const row = document.createElement('div');
    Object.assign(row.style, { display: 'flex', alignItems: 'baseline', gap: '3px', marginBottom: '2px' });

    labelEl = document.createElement('span');
    Object.assign(labelEl.style, {
      fontSize: '20px',
      fontWeight: '600',
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: '-0.03em',
      color: '#34d399',
      transition: 'color 0.3s',
    });
    labelEl.textContent = '--';
    row.appendChild(labelEl);

    const unit = document.createElement('span');
    Object.assign(unit.style, { fontSize: '10px', color: 'rgba(255,255,255,0.35)' });
    unit.textContent = 'fps';
    row.appendChild(unit);
    el.appendChild(row);

    // Sparkline
    sparkCanvas = document.createElement('canvas');
    sparkCanvas.width = FPS_HISTORY;
    sparkCanvas.height = 32;
    Object.assign(sparkCanvas.style, {
      width: FPS_HISTORY + 'px',
      height: '32px',
      borderRadius: '4px',
      display: 'block',
    });
    sparkCtx = sparkCanvas.getContext('2d');
    el.appendChild(sparkCanvas);

    // Info label
    const info = document.createElement('span');
    info.setAttribute('data-plasma-fps-info', '');
    Object.assign(info.style, {
      fontSize: '9px',
      color: 'rgba(255,255,255,0.2)',
      marginTop: '2px',
      letterSpacing: '0.03em',
    });
    el.appendChild(info);

    const parent = canvas.parentElement || document.body;
    if (getComputedStyle(parent).position === 'static') { parent.style.position = 'relative'; }
    parent.appendChild(el);
  }

  function remove() {
    if (el && el.parentElement) { el.parentElement.removeChild(el); }
    el = null;
    sparkCanvas = null;
    sparkCtx = null;
    labelEl = null;
    frames = [];
  }

  function tick(now) {
    const cfg = getCfg();
    if (!cfg.fps) {
      if (el) { remove(); }
      return;
    }
    if (!el) { create(); }

    const delta = now - lastTime;
    lastTime = now;
    if (delta <= 0) { return; }

    frames.push(1000 / delta);
    if (frames.length > FPS_HISTORY) { frames.shift(); }

    const tail = Math.min(frames.length, 15);
    let sum = 0;
    for (let i = frames.length - tail; i < frames.length; i++) { sum += frames[i]; }
    const avg = Math.round(sum / tail);

    if (labelEl) {
      labelEl.textContent = avg;
      labelEl.style.color = color(avg);
    }

    // Info line
    const infoEl = el.querySelector('[data-plasma-fps-info]');
    if (infoEl) {
      const info = getRendererInfo();
      const mx = info.mx.toFixed(2);
      const my = info.my.toFixed(2);
      const gamut = info.colorSpace === 'display-p3' ? 'p3' : 'srgb';
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      const dprLabel = dpr !== 1 ? ` · ${dpr.toFixed(1)}x` : '';
      infoEl.textContent = `${info.w}×${info.h} · ${info.type} · ${gamut}${dprLabel} · m(${mx}, ${my})`;
    }

    // Sparkline
    const cw = sparkCanvas.width, ch = sparkCanvas.height, len = frames.length;
    sparkCtx.clearRect(0, 0, cw, ch);
    if (len < 2) { return; }

    const yAt = (fps) => {
      const c = fps < 0 ? 0 : fps > 80 ? 80 : fps;
      return ch - 2 - (c / 80) * (ch - 4);
    };

    // Reference lines
    sparkCtx.strokeStyle = 'rgba(255,255,255,0.06)';
    sparkCtx.lineWidth = 1;
    for (const ref of [60, 30]) {
      sparkCtx.beginPath();
      sparkCtx.moveTo(0, yAt(ref));
      sparkCtx.lineTo(cw, yAt(ref));
      sparkCtx.stroke();
    }

    // Line path
    const x0 = cw - len;
    sparkCtx.beginPath();
    for (let i = 0; i < len; i++) {
      const x = x0 + i, y = yAt(frames[i]);
      i === 0 ? sparkCtx.moveTo(x, y) : sparkCtx.lineTo(x, y);
    }
    const lc = color(avg);
    sparkCtx.strokeStyle = lc;
    sparkCtx.lineWidth = 1.5;
    sparkCtx.lineJoin = 'round';
    sparkCtx.stroke();

    // Fill
    sparkCtx.lineTo(cw, ch);
    sparkCtx.lineTo(x0, ch);
    sparkCtx.closePath();
    const g = sparkCtx.createLinearGradient(0, 0, 0, ch);
    const [cr, cg, cb] = hexToRgb(lc);
    g.addColorStop(0, `rgba(${(cr * 255) | 0},${(cg * 255) | 0},${(cb * 255) | 0},0.2)`);
    g.addColorStop(1, `rgba(${(cr * 255) | 0},${(cg * 255) | 0},${(cb * 255) | 0},0.0)`);
    sparkCtx.fillStyle = g;
    sparkCtx.fill();
  }

  function resetTime() {
    lastTime = performance.now();
  }

  return { tick, remove, resetTime };
}

// ═══════════════════════════════════════════════════════════════
// Main Export
// ═══════════════════════════════════════════════════════════════

export function createPlasma(selector, settings = {}) {
  let cfg = resolveConfig(deepMerge(DEFAULTS, settings));

  const canvas = typeof selector === 'string'
    ? document.querySelector(selector)
    : selector;

  if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
    throw new Error(`createPlasma: no <canvas> found for "${selector}"`);
  }

  // ── Renderer selection ────────────────────────────────────

  const getCfg = () => cfg;
  let renderer = null;
  let rendererType = null;

  // Try WebGL first
  const glRenderer = createWebGLRenderer(canvas, getCfg);
  if (glRenderer) {
    const accepted = !cfg.onRenderer
      || cfg.onRenderer({ type: 'webgl', gl: glRenderer.gl, colorSpace: glRenderer.colorSpace }) !== false;
    if (accepted) {
      renderer = glRenderer;
      rendererType = 'webgl';
    }
    else {
      glRenderer.destroy();
    }
  }

  // Fall back to canvas
  if (!renderer) {
    const canvasRenderer = createCanvasRenderer(canvas, getCfg);
    if (canvasRenderer) {
      const accepted = !cfg.onRenderer
        || cfg.onRenderer({ type: 'canvas', colorSpace: canvasRenderer.colorSpace }) !== false;
      if (accepted) {
        renderer = canvasRenderer;
        rendererType = 'canvas';
      }
    }
  }

  // No renderer available or all rejected
  if (!renderer) {
    return {
      renderer: null,
      pause() {},
      resume() {},
      resize() {},
      destroy() {},
      setSettings() {},
      getSettings() {
        return {};
      },
      get time() {
        return 0;
      },
      set time(_) {},
      get isRunning() {
        return false;
      },
      addLayer() {},
      removeLayer() {},
    };
  }

  // ── State ─────────────────────────────────────────────────

  let time = 0;
  let animId = null;
  let running = false;
  let destroyed = false;
  let lastFrameTime = performance.now();
  const layers = [];

  // ── Mouse tracking (smoothed) ─────────────────────────────

  let mouseX = 0, mouseY = 0; // current position, center = 0,0
  let mouseVelX = 0, mouseVelY = 0; // velocity (for spring)
  let mouseTargetX = 0, mouseTargetY = 0; // raw target
  let mouseOver = false;

  // Spring parameters — critically damped (damp=1) means smooth settle, no bounce
  // freq = oscillations per second (higher = snappier response)
  const SPRING_IN = { freq: 1.8, damp: 1.0 }; // tracking cursor
  const SPRING_OUT = { freq: 0.6, damp: 1.0 }; // easing back to center

  function springStep(pos, vel, target, freq, damp, dt) {
    // Critically damped spring: F = -k(x - target) - c*v
    // where k = ω², c = 2dω, ω = 2πf
    const omega = 2 * Math.PI * freq;
    const accel = omega * omega * (target - pos) - 2 * damp * omega * vel;
    vel += accel * dt;
    pos += vel * dt;
    return [pos, vel];
  }

  // ── FPS overlay ───────────────────────────────────────────

  const fpsSystem = createFpsSystem(canvas, getCfg, () => ({
    ...renderer.getSize(),
    type: rendererType,
    colorSpace: renderer.colorSpace,
    mx: mouseX,
    my: mouseY,
  }));

  // ── Resize ────────────────────────────────────────────────

  function resize() {
    renderer.resize();
  }

  // ── Loop ──────────────────────────────────────────────────

  function loop(now) {
    if (!running || destroyed) { return; }
    // Frame-rate independent: normalized so speed=1 matches the original default
    const delta = now - lastFrameTime;
    lastFrameTime = now;
    time += cfg.speed * delta * 0.00072; // 0.012 * 60/1000

    // Spring mouse toward target (frame-rate independent)
    const spring = mouseOver ? SPRING_IN : SPRING_OUT;
    const dtSec = delta / 1000;
    [mouseX, mouseVelX] = springStep(mouseX, mouseVelX, mouseTargetX, spring.freq, spring.damp, dtSec);
    [mouseY, mouseVelY] = springStep(mouseY, mouseVelY, mouseTargetY, spring.freq, spring.damp, dtSec);

    renderer.render(time, mouseX, mouseY);
    for (let i = 0; i < layers.length; i++) {
      try {
        layers[i]({ time, mouseX, mouseY, dt: dtSec, renderer, cfg });
      }
      catch (e) {
        console.error('plasma layer error:', e);
      }
    }
    fpsSystem.tick(now);
    animId = requestAnimationFrame(loop);
  }

  function cancelFrame() {
    if (animId !== null) {
      cancelAnimationFrame(animId);
      animId = null;
    }
    running = false;
  }

  function startLoop() {
    if (running || destroyed || reducedMotion) { return; }
    running = true;
    lastFrameTime = performance.now();
    fpsSystem.resetTime();
    animId = requestAnimationFrame(loop);
  }

  // ── Offscreen / visibility ────────────────────────────────

  let observer = null;

  function onVisibilityChange() {
    if (!cfg.pauseOffscreen || destroyed) { return; }
    document.hidden ? cancelFrame() : startLoop();
  }
  function onWindowBlur() {
    if (!cfg.pauseOffscreen || destroyed) { return; }
    cancelFrame();
  }
  function onWindowFocus() {
    if (!cfg.pauseOffscreen || destroyed) { return; }
    if (!document.hidden) { startLoop(); }
  }

  function setupObserver() {
    if (!cfg.pauseOffscreen || typeof IntersectionObserver === 'undefined') { return; }
    observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting ? startLoop() : cancelFrame(),
      { threshold: 0 },
    );
    observer.observe(canvas);
  }

  // ── Init ──────────────────────────────────────────────────

  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('blur', onWindowBlur);
  window.addEventListener('focus', onWindowFocus);

  // Pointer tracking on canvas parent (covers mouse, touch, pen)
  const pointerTarget = canvas.parentElement || canvas;
  function onPointerMove(e) {
    if (!cfg.mouse) { return; }
    mouseOver = true;
    const rect = pointerTarget.getBoundingClientRect();
    mouseTargetX = (e.clientX - rect.left) / rect.width - 0.5;
    mouseTargetY = (e.clientY - rect.top) / rect.height - 0.5;
  }
  function onPointerLeave() {
    mouseOver = false;
    mouseTargetX = 0;
    mouseTargetY = 0;
  }
  pointerTarget.addEventListener('pointermove', onPointerMove);
  pointerTarget.addEventListener('pointerleave', onPointerLeave);

  // DPR change listener (e.g. dragging window between retina/non-retina displays)
  let dprQuery = null;
  function watchDpr() {
    dprQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    dprQuery.addEventListener('change', onDprChange, { once: true });
  }
  function onDprChange() {
    resize();
    watchDpr(); // re-watch with new DPR value
  }
  watchDpr();

  // prefers-reduced-motion — render one still frame, then pause
  let reducedMotion = false;
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  function onMotionChange() {
    reducedMotion = motionQuery.matches;
    if (reducedMotion) {
      cancelFrame();
    }
    else {
      startLoop();
    }
  }
  motionQuery.addEventListener('change', onMotionChange);
  reducedMotion = motionQuery.matches;

  resize();

  if (reducedMotion) {
    // Render a single still frame, then stay paused
    renderer.render(time, mouseX, mouseY);
  }
  else {
    startLoop();
  }

  setupObserver();

  if (cfg.fadeInClass) {
    requestAnimationFrame(() => canvas.classList.add(cfg.fadeInClass));
  }

  // ── Public API ────────────────────────────────────────────

  return {
    /** The active renderer type: 'webgl' or 'canvas' */
    renderer: rendererType,

    pause() {
      cancelFrame();
    },
    resume() {
      if (!destroyed) { startLoop(); }
    },
    resize() {
      resize();
    },

    setSettings(s) {
      cfg = resolveConfig(deepMerge(cfg, s));
    },

    getSettings() {
      const out = {};
      for (const [k, v] of Object.entries(cfg)) {
        if (!k.startsWith('_')) { out[k] = JSON.parse(JSON.stringify(v)); }
      }
      return out;
    },

    get time() {
      return time;
    },
    set time(t) {
      time = t;
    },
    get isRunning() {
      return running;
    },

    addLayer(fn) {
      layers.push(fn);
    },
    removeLayer(fn) {
      const i = layers.indexOf(fn);
      if (i >= 0) { layers.splice(i, 1); }
    },

    destroy() {
      destroyed = true;
      layers.length = 0;
      cancelFrame();
      fpsSystem.remove();
      renderer.destroy();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onWindowBlur);
      window.removeEventListener('focus', onWindowFocus);
      pointerTarget.removeEventListener('pointermove', onPointerMove);
      pointerTarget.removeEventListener('pointerleave', onPointerLeave);
      if (dprQuery) { dprQuery.removeEventListener('change', onDprChange); }
      motionQuery.removeEventListener('change', onMotionChange);
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    },
  };
}

export { hexToRgb, rgbToHex };
export default createPlasma;

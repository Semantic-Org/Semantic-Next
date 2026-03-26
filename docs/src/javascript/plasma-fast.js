/**
 * plasma.js — Demoscene plasma effect (ESM)
 *
 * Based on the GLSL shader by Nikos Papadopoulos (4rknova, 2016)
 * with specular highlights contributed by Shane.
 *
 * @example
 * import { createPlasma } from './plasma.js'
 *
 * // Designer-friendly — just pass hex colors
 * const plasma = createPlasma('#hero-canvas', {
 *   colorFrom: '#000000',      // darkest the plasma gets
 *   colorTo:   '#1a5c6e',      // brightest the plasma gets
 *   colorShift: 2.8,           // channel separation (0 = monochrome, ~3 = vivid hue split)
 *   specularTint: '#1a99e6',   // highlight color (hex), or false to disable
 * })
 *
 * // Full control
 * const plasma = createPlasma('#hero-canvas', {
 *   colorFrom:       '#000000',
 *   colorTo:         '#1a5c6e',
 *   colorShift:      2.8,
 *   speed:           0.012,
 *   density:         4.0,
 *   brightness:      1.0,
 *   scrollSpeed:     0.3,
 *   resolution:      3,
 *   specularTint:    '#1a99e6',
 *   specularPower:   2,
 *   specularAmbient: 0.45,
 *   fadeInClass:     'loaded',
 *   pauseOffscreen:  true,
 *   wave: { intensity: 7.0 },
 * })
 *
 * // Advanced: raw cosine palette arrays (bypasses colorFrom/colorTo)
 * const plasma = createPlasma('#hero-canvas', {
 *   color: {
 *     base:  [0.04, 0.10, 0.16],
 *     amp:   [0.06, 0.13, 0.16],
 *     phase: [2.8,  0.3,  0.0],
 *   },
 * })
 *
 * // Control API
 * plasma.pause()
 * plasma.resume()
 * plasma.destroy()
 * plasma.resize()
 * plasma.setSettings({ speed: 0.02, brightness: 0.6 })
 */

// ── Hex parsing ────────────────────────────────────────────────

/**
 * Parse a hex color string to normalized [r, g, b] floats (0–1).
 * Accepts '#rgb', '#rrggbb', 'rgb', 'rrggbb'.
 */
function hexToRgb(hex) {
  let h = hex.replace(/^#/, '');
  if (h.length === 3) { h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]; }
  const n = parseInt(h, 16);
  return [(n >> 16 & 0xff) / 255, (n >> 8 & 0xff) / 255, (n & 0xff) / 255];
}

/**
 * Convert normalized [r, g, b] (0–1) to '#rrggbb'.
 */
function rgbToHex([r, g, b]) {
  const c = (ch) => Math.round(Math.max(0, Math.min(1, ch)) * 255).toString(16).padStart(2, '0');
  return '#' + c(r) + c(g) + c(b);
}

// ── Deep merge ─────────────────────────────────────────────────

function deepMerge(target, source) {
  const out = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] !== null
      && typeof source[key] === 'object'
      && !Array.isArray(source[key])
      && target[key] !== null
      && typeof target[key] === 'object'
      && !Array.isArray(target[key])
    ) {
      out[key] = deepMerge(target[key], source[key]);
    }
    else {
      out[key] = source[key];
    }
  }
  return out;
}

// ── Derive cosine palette from hex colors ──────────────────────

/**
 * Given two hex endpoints and a shift value, produce the internal
 * { base, amp, phase } arrays the renderer needs.
 *
 * The cosine palette formula per channel:
 *   color[ch] = base[ch] + amp[ch] * cos(s + phase[ch])
 *
 * base = midpoint between the two colors
 * amp  = half the distance between them
 * phase = [colorShift, colorShift * 0.107, 0]
 *   → at 0 all channels are in lockstep (monochrome gradient)
 *   → at ~2.8 R is nearly inverted from G/B (teal/blue look)
 *   → at π, maximum hue separation
 */
function deriveColorPalette(fromHex, toHex, shift) {
  const from = hexToRgb(fromHex);
  const to = hexToRgb(toHex);
  return {
    base: from.map((f, i) => (f + to[i]) / 2),
    amp: from.map((f, i) => (to[i] - f) / 2),
    phase: [shift, shift * 0.107, 0],
  };
}

// ── Defaults ───────────────────────────────────────────────────

const DEFAULTS = {
  // ── Colors (designer-friendly) ─────────────────────────────
  /** Darkest color the plasma reaches (hex) */
  colorFrom: '#000000',

  /** Brightest color the plasma reaches (hex) */
  colorTo: '#1a5c6e',

  /**
   * Channel phase separation (radians, 0–π).
   * 0    = monochrome (R, G, B oscillate identically)
   * ~1.5 = moderate hue variation
   * ~2.8 = strong separation (e.g. teal body with suppressed red)
   * π    = maximum divergence
   */
  colorShift: 2.8,

  // ── Animation ──────────────────────────────────────────────
  /** Time increment per frame */
  speed: 0.012,

  /** Band density — higher = tighter bands */
  density: 4.0,

  /** Overall brightness multiplier (0–1+) */
  brightness: 1.0,

  /** Pattern scroll rate */
  scrollSpeed: 0.3,

  /** Pixel resolution divisor (3 = render at ⅓ resolution) */
  resolution: 3,

  // ── Specular highlights ────────────────────────────────────
  /** Highlight color (hex string), or false to disable entirely */
  specularTint: '#1a99e6',

  /** Specular exponent — higher = tighter, sharper highlights */
  specularPower: 2,

  /** Ambient base multiplier for non-specular color (0–1) */
  specularAmbient: 0.45,

  // ── Lifecycle ──────────────────────────────────────────────
  /** CSS class added to canvas after first frame */
  fadeInClass: 'loaded',

  /** Pause rendering when offscreen or tab is hidden */
  pauseOffscreen: true,

  // ── Debug ──────────────────────────────────────────────────
  /** Show an FPS counter with sparkline in the bottom-right corner.
   *  true = show, false = hide. Can be toggled at runtime via setSettings. */
  fps: false,

  // ── Advanced: wave constants (4rknova's formula) ───────────
  /** Most users won't need to touch these. */
  wave: {
    kBase: 0.1,
    kTimeScale: 2.4,
    kPhase: 0.148,
    wBase: 0.9,
    wTimeScale: -0.7,
    wPhase: 0.628,
    intensity: 7.0,
  },

  // ── Advanced: raw cosine palette override ──────────────────
  /** If provided, bypasses colorFrom / colorTo / colorShift entirely.
   *  color: { base: [r,g,b], amp: [r,g,b], phase: [r,g,b] }  (0–1 floats) */
  color: null,
};

// ── Resolve config ─────────────────────────────────────────────

function resolveConfig(cfg) {
  // Derive the internal color palette
  const palette = cfg.color || deriveColorPalette(cfg.colorFrom, cfg.colorTo, cfg.colorShift);

  // Derive specular tint
  let specEnabled = cfg.specularTint !== false;
  let specTint = specEnabled ? hexToRgb(cfg.specularTint) : [0, 0, 0];

  return { ...cfg, _palette: palette, _specEnabled: specEnabled, _specTint: specTint };
}

// ── Main export ────────────────────────────────────────────────

export function createPlasma(selector, settings = {}) {
  let cfg = resolveConfig(deepMerge(DEFAULTS, settings));

  // Resolve canvas
  const canvas = typeof selector === 'string'
    ? document.querySelector(selector)
    : selector;

  if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
    throw new Error(`createPlasma: no <canvas> found for "${selector}"`);
  }

  const ctx = canvas.getContext('2d', {
    alpha: false, // no transparency — skip compositing
    willReadFrequently: false, // we only putImageData, never getImageData
    desynchronized: true, // paint outside compositor cycle
  });
  let w, h, imgData, data;
  let time = 0;
  let animId = null;
  let running = false;
  let destroyed = false;

  // ── Resize ──────────────────────────────────────────────────

  function resize() {
    const rect = canvas.parentElement
      ? canvas.parentElement.getBoundingClientRect()
      : { width: window.innerWidth, height: window.innerHeight };

    w = Math.ceil(rect.width / cfg.resolution);
    h = Math.ceil(rect.height / cfg.resolution);
    canvas.width = w;
    canvas.height = h;
    imgData = ctx.createImageData(w, h);
    data = imgData.data;
  }

  // ── Core plasma scalar (4rknova) ────────────────────────────

  function plasmaS(cx, cy, t) {
    const wv = cfg.wave;
    const k = wv.kBase + Math.cos(cy + Math.sin(wv.kPhase - t)) + wv.kTimeScale * t;
    const ww = wv.wBase + Math.sin(cx + Math.cos(wv.wPhase + t)) + wv.wTimeScale * t;
    const d = Math.sqrt(cx * cx + cy * cy);
    return wv.intensity * Math.cos(d + ww) * Math.sin(k + ww);
  }

  // ── Color at scalar s ───────────────────────────────────────

  function colorAt(s, ch) {
    const p = cfg._palette;
    return p.base[ch] + p.amp[ch] * Math.cos(s + p.phase[ch]);
  }

  // ── Render ──────────────────────────────────────────────────

  // ── Render (optimized) ───────────────────────────────────────
  // Key optimizations vs naive port:
  // - plasmaS inlined to avoid function call overhead (~230k calls/frame)
  // - Uint32Array view for single write per pixel instead of 4 byte writes
  // - All config lookups hoisted outside loops
  // - Per-row invariants pre-computed (kRow depends only on cy)
  // - Time-dependent wave terms computed once per frame
  // Specular still uses full RGB color derivatives (faithful to original GLSL)

  function render() {
    const t = time;
    const aspect = w / h;

    // Hoist all config to locals
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

    // Wave constants
    const kBase = cfg.wave.kBase, kTS = cfg.wave.kTimeScale, kPh = cfg.wave.kPhase;
    const wBase = cfg.wave.wBase, wTS = cfg.wave.wTimeScale, wPh = cfg.wave.wPhase;
    const intensity = cfg.wave.intensity;

    const epsX = (1.0 / w) * aspect * sc;
    const epsY = (1.0 / h) * sc;
    const nz = 0.5 / h;
    const nzSq = nz * nz;

    // Uint32 view for single-write per pixel
    const buf32 = new Uint32Array(data.buffer);

    // Pre-compute time-dependent wave terms
    const sinKPh = Math.sin(kPh - t);
    const cosWPh = Math.cos(wPh + t);
    const kTime = kBase + kTS * t;
    const wTime = wBase + wTS * t;
    const tScroll = t * ss;

    let idx = 0;

    for (let py = 0; py < h; py++) {
      const cy = (py / h) * sc + tScroll;

      // Per-row wave partial: k depends only on cy + t
      const kRow = kTime + Math.cos(cy + sinKPh);

      for (let px = 0; px < w; px++) {
        const cx = (px / w) * aspect * sc + tScroll;

        // ── Inline plasmaS(cx, cy, t) ──
        const ww = wTime + Math.sin(cx + cosWPh);
        const d = Math.sqrt(cx * cx + cy * cy);
        const s = intensity * Math.cos(d + ww) * Math.sin(kRow + ww);

        // ── Color from cosine palette ──
        let r = cb0 + ca0 * Math.cos(s + cp0);
        let g = cb1 + ca1 * Math.cos(s + cp1);
        let b = cb2 + ca2 * Math.cos(s + cp2);

        if (doSpec) {
          // Specular via RGB color derivatives (faithful to original GLSL)
          // Compute plasmaS at offset positions
          const cxE = cx + epsX;
          const wwE = wTime + Math.sin(cxE + cosWPh);
          const dE = Math.sqrt(cxE * cxE + cy * cy);
          const sX = intensity * Math.cos(dE + wwE) * Math.sin(kRow + wwE);

          const cyE = cy + epsY;
          const kRowE = kTime + Math.cos(cyE + sinKPh);
          const dEy = Math.sqrt(cx * cx + cyE * cyE);
          const sY = intensity * Math.cos(dEy + ww) * Math.sin(kRowE + ww);

          // Full color at offsets → dFdx(col), dFdy(col)
          const drx = (cb0 + ca0 * Math.cos(sX + cp0)) - r;
          const dgx = (cb1 + ca1 * Math.cos(sX + cp1)) - g;
          const dbx = (cb2 + ca2 * Math.cos(sX + cp2)) - b;
          const dry = (cb0 + ca0 * Math.cos(sY + cp0)) - r;
          const dgy = (cb1 + ca1 * Math.cos(sY + cp1)) - g;
          const dby = (cb2 + ca2 * Math.cos(sY + cp2)) - b;

          // length(dFdx(col)), length(dFdy(col))
          const dxLen = Math.sqrt(drx * drx + dgx * dgx + dbx * dbx);
          const dyLen = Math.sqrt(dry * dry + dgy * dgy + dby * dby);

          // Pseudo-normal: normalize(vec3(dxLen, dyLen, nz)).z
          const normalZ = nz / (Math.sqrt(dxLen * dxLen + dyLen * dyLen + nzSq) || 0.001);

          // pow(normalZ, specPow)
          let specVal = normalZ;
          for (let p = 1; p < specPow; p++) { specVal *= normalZ; }

          r = r * specVal * st0 + r * specAmb;
          g = g * specVal * st1 + g * specAmb;
          b = b * specVal * st2 + b * specAmb;
        }

        // Brightness + clamp + pack ABGR (little-endian: 0xAABBGGRR)
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
  }

  // ── Loop ────────────────────────────────────────────────────

  function loop(now) {
    if (!running || destroyed) { return; }
    time += cfg.speed;
    render();
    tickFps(now);
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
    if (running || destroyed) { return; }
    running = true;
    fpsLastTime = performance.now(); // avoid spike after pause
    animId = requestAnimationFrame(loop);
  }

  // ── Offscreen / visibility ──────────────────────────────────

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
    // Only resume if the tab is also visible (not just the window)
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

  // ── FPS overlay ──────────────────────────────────────────────

  const FPS_HISTORY = 120;
  let fpsEl = null;
  let fpsCanvas = null;
  let fpsCtx = null;
  let fpsFrames = [];
  let fpsLastTime = performance.now();
  let fpsLabelEl = null;

  function fpsColor(fps) {
    if (fps >= 50) { return '#34d399'; // green
     }
    if (fps >= 30) { return '#fbbf24'; // amber
     }
    return '#f87171'; // red
  }

  function createFpsOverlay() {
    if (fpsEl) { return; }

    fpsEl = document.createElement('div');
    fpsEl.setAttribute('data-plasma-fps', '');
    Object.assign(fpsEl.style, {
      position: 'absolute',
      bottom: '16px',
      right: '16px',
      zIndex: '9999',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '4px',
      background: 'rgba(0, 0, 0, 0.72)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderRadius: '10px',
      padding: '10px 12px 8px',
      fontFamily: 'ui-monospace, "JetBrains Mono", "SF Mono", "Fira Code", monospace',
      lineHeight: '1',
      pointerEvents: 'none',
      userSelect: 'none',
      border: '1px solid rgba(255, 255, 255, 0.08)',
    });

    // Top row: number + unit
    const numRow = document.createElement('div');
    Object.assign(numRow.style, {
      display: 'flex',
      alignItems: 'baseline',
      gap: '3px',
      marginBottom: '2px',
    });

    fpsLabelEl = document.createElement('span');
    Object.assign(fpsLabelEl.style, {
      fontSize: '20px',
      fontWeight: '600',
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: '-0.03em',
      color: '#34d399',
      transition: 'color 0.3s',
    });
    fpsLabelEl.textContent = '--';
    numRow.appendChild(fpsLabelEl);

    const unit = document.createElement('span');
    Object.assign(unit.style, {
      fontSize: '10px',
      fontWeight: '400',
      color: 'rgba(255, 255, 255, 0.35)',
      letterSpacing: '0.02em',
    });
    unit.textContent = 'fps';
    numRow.appendChild(unit);

    fpsEl.appendChild(numRow);

    // Sparkline canvas
    fpsCanvas = document.createElement('canvas');
    fpsCanvas.width = FPS_HISTORY;
    fpsCanvas.height = 32;
    Object.assign(fpsCanvas.style, {
      width: `${FPS_HISTORY}px`,
      height: '32px',
      borderRadius: '4px',
      display: 'block',
    });
    fpsCtx = fpsCanvas.getContext('2d');
    fpsEl.appendChild(fpsCanvas);

    // Res label
    const resLabel = document.createElement('span');
    resLabel.setAttribute('data-plasma-fps-res', '');
    Object.assign(resLabel.style, {
      fontSize: '9px',
      fontWeight: '400',
      color: 'rgba(255, 255, 255, 0.2)',
      marginTop: '2px',
      letterSpacing: '0.03em',
    });
    resLabel.textContent = `${w}×${h} · 1/${cfg.resolution}`;
    fpsEl.appendChild(resLabel);

    // Insert into canvas parent
    const parent = canvas.parentElement || document.body;
    const parentPos = getComputedStyle(parent).position;
    if (parentPos === 'static') { parent.style.position = 'relative'; }
    parent.appendChild(fpsEl);
  }

  function destroyFpsOverlay() {
    if (fpsEl && fpsEl.parentElement) {
      fpsEl.parentElement.removeChild(fpsEl);
    }
    fpsEl = null;
    fpsCanvas = null;
    fpsCtx = null;
    fpsLabelEl = null;
    fpsFrames = [];
  }

  function tickFps(now) {
    if (!cfg.fps) {
      if (fpsEl) { destroyFpsOverlay(); }
      return;
    }
    if (!fpsEl) { createFpsOverlay(); }

    const delta = now - fpsLastTime;
    fpsLastTime = now;
    if (delta <= 0) { return; }

    const currentFps = 1000 / delta;
    fpsFrames.push(currentFps);
    if (fpsFrames.length > FPS_HISTORY) { fpsFrames.shift(); }

    // Smoothed number (last 15 frames)
    const tail = fpsFrames.length < 15 ? fpsFrames.length : 15;
    let sum = 0;
    for (let i = fpsFrames.length - tail; i < fpsFrames.length; i++) { sum += fpsFrames[i]; }
    const avg = sum / tail;
    const rounded = Math.round(avg);

    if (fpsLabelEl) {
      fpsLabelEl.textContent = rounded;
      fpsLabelEl.style.color = fpsColor(rounded);
    }

    // Update res label on resize
    const resEl = fpsEl.querySelector('[data-plasma-fps-res]');
    if (resEl) { resEl.textContent = `${w}×${h} · 1/${cfg.resolution}`; }

    // ── Draw sparkline ──
    const cw = fpsCanvas.width;
    const ch = fpsCanvas.height;
    const len = fpsFrames.length;
    fpsCtx.clearRect(0, 0, cw, ch);

    if (len < 2) { return; }

    const max = 80;
    const min = 0;
    const range = max - min;

    function yAt(fps) {
      const clamped = fps < min ? min : fps > max ? max : fps;
      return ch - 2 - ((clamped - min) / range) * (ch - 4);
    }

    // 60fps reference line
    const ref60 = yAt(60);
    fpsCtx.beginPath();
    fpsCtx.moveTo(0, ref60);
    fpsCtx.lineTo(cw, ref60);
    fpsCtx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    fpsCtx.lineWidth = 1;
    fpsCtx.stroke();

    // 30fps reference
    const ref30 = yAt(30);
    fpsCtx.beginPath();
    fpsCtx.moveTo(0, ref30);
    fpsCtx.lineTo(cw, ref30);
    fpsCtx.stroke();

    // Build path
    const startX = cw - len;
    fpsCtx.beginPath();
    for (let i = 0; i < len; i++) {
      const x = startX + i;
      const y = yAt(fpsFrames[i]);
      i === 0 ? fpsCtx.moveTo(x, y) : fpsCtx.lineTo(x, y);
    }

    // Stroke (color-coded to current fps)
    const lineColor = fpsColor(rounded);
    fpsCtx.strokeStyle = lineColor;
    fpsCtx.lineWidth = 1.5;
    fpsCtx.lineJoin = 'round';
    fpsCtx.stroke();

    // Gradient fill under the line
    fpsCtx.lineTo(cw, ch);
    fpsCtx.lineTo(startX, ch);
    fpsCtx.closePath();
    const grad = fpsCtx.createLinearGradient(0, 0, 0, ch);
    // Parse lineColor hex to rgba for gradient
    const hr = parseInt(lineColor.slice(1, 3), 16);
    const hg = parseInt(lineColor.slice(3, 5), 16);
    const hb = parseInt(lineColor.slice(5, 7), 16);
    grad.addColorStop(0, `rgba(${hr},${hg},${hb},0.2)`);
    grad.addColorStop(1, `rgba(${hr},${hg},${hb},0.0)`);
    fpsCtx.fillStyle = grad;
    fpsCtx.fill();
  }

  // ── Init ────────────────────────────────────────────────────

  const onResize = () => resize();
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('blur', onWindowBlur);
  window.addEventListener('focus', onWindowFocus);

  resize();
  startLoop();
  setupObserver();

  if (cfg.fadeInClass) {
    requestAnimationFrame(() => canvas.classList.add(cfg.fadeInClass));
  }

  // ── Public API ──────────────────────────────────────────────

  return {
    pause() {
      cancelFrame();
    },
    resume() {
      if (!destroyed) { startLoop(); }
    },
    resize() {
      resize();
    },

    /** Deep-merge new settings and re-resolve derived values. */
    setSettings(s) {
      cfg = resolveConfig(deepMerge(cfg, s));
    },

    /** Snapshot of current settings (without internal _fields). */
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

    destroy() {
      destroyed = true;
      cancelFrame();
      destroyFpsOverlay();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onWindowBlur);
      window.removeEventListener('focus', onWindowFocus);
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    },
  };
}

/** Utility: parse hex to [r,g,b] floats */
export { hexToRgb, rgbToHex };

export default createPlasma;

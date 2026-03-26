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

  function render() {
    const t = time;
    const aspect = w / h;
    const sc = cfg.density;
    const ss = cfg.scrollSpeed;
    const br = cfg.brightness;
    const doSpec = cfg._specEnabled;
    const specTint = cfg._specTint;
    const specPow = cfg.specularPower;
    const specAmb = cfg.specularAmbient;

    const epsX = (1.0 / w) * aspect * sc;
    const epsY = (1.0 / h) * sc;

    let idx = 0;

    for (let py = 0; py < h; py++) {
      const ny = py / h;
      for (let px = 0; px < w; px++) {
        const nx = px / w;

        const cx = nx * aspect * sc + t * ss;
        const cy = ny * sc + t * ss;
        const s = plasmaS(cx, cy, t);

        let r = colorAt(s, 0);
        let g = colorAt(s, 1);
        let b = colorAt(s, 2);

        if (doSpec) {
          const sX = plasmaS(cx + epsX, cy, t);
          const sY = plasmaS(cx, cy + epsY, t);

          const drx = colorAt(sX, 0) - r;
          const dgx = colorAt(sX, 1) - g;
          const dbx = colorAt(sX, 2) - b;
          const dry = colorAt(sY, 0) - r;
          const dgy = colorAt(sY, 1) - g;
          const dby = colorAt(sY, 2) - b;

          const dxLen = Math.sqrt(drx * drx + dgx * dgx + dbx * dbx);
          const dyLen = Math.sqrt(dry * dry + dgy * dgy + dby * dby);

          const nz = 0.5 / h;
          const nLen = Math.sqrt(dxLen * dxLen + dyLen * dyLen + nz * nz) || 0.001;
          let normalZ = nz / nLen;

          let specVal = normalZ;
          for (let p = 1; p < specPow; p++) { specVal *= normalZ; }

          r = r * specVal * specTint[0] + r * specAmb;
          g = g * specVal * specTint[1] + g * specAmb;
          b = b * specVal * specTint[2] + b * specAmb;
        }

        // Brightness
        r *= br;
        g *= br;
        b *= br;

        // Clamp
        if (r > 1) { r = 1; }
        else if (r < 0) { r = 0; }
        if (g > 1) { g = 1; }
        else if (g < 0) { g = 0; }
        if (b > 1) { b = 1; }
        else if (b < 0) { b = 0; }

        data[idx] = (r * 255) | 0;
        data[idx + 1] = (g * 255) | 0;
        data[idx + 2] = (b * 255) | 0;
        data[idx + 3] = 255;
        idx += 4;
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

  const FPS_HISTORY = 90; // ~1.5s at 60fps
  let fpsEl = null;
  let fpsCanvas = null;
  let fpsCtx = null;
  let fpsFrames = [];
  let fpsLastTime = performance.now();

  function createFpsOverlay() {
    if (fpsEl) { return; }

    fpsEl = document.createElement('div');
    fpsEl.setAttribute('data-plasma-fps', '');
    Object.assign(fpsEl.style, {
      position: 'absolute',
      bottom: '12px',
      right: '12px',
      zIndex: '9999',
      display: 'flex',
      alignItems: 'flex-end',
      gap: '8px',
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(8px)',
      borderRadius: '8px',
      padding: '6px 10px',
      fontFamily: 'ui-monospace, "JetBrains Mono", "Fira Code", monospace',
      fontSize: '11px',
      lineHeight: '1',
      color: '#67e8f9',
      pointerEvents: 'none',
      userSelect: 'none',
      border: '1px solid rgba(255, 255, 255, 0.06)',
    });

    // Sparkline canvas
    fpsCanvas = document.createElement('canvas');
    fpsCanvas.width = FPS_HISTORY;
    fpsCanvas.height = 28;
    Object.assign(fpsCanvas.style, {
      width: `${FPS_HISTORY}px`,
      height: '28px',
      borderRadius: '3px',
    });
    fpsCtx = fpsCanvas.getContext('2d');

    fpsEl.appendChild(fpsCanvas);

    // Number label
    const label = document.createElement('span');
    label.setAttribute('data-plasma-fps-value', '');
    Object.assign(label.style, {
      minWidth: '28px',
      textAlign: 'right',
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: '-0.02em',
    });
    label.textContent = '--';
    fpsEl.appendChild(label);

    // Unit
    const unit = document.createElement('span');
    Object.assign(unit.style, {
      fontSize: '9px',
      color: 'rgba(103, 232, 249, 0.45)',
      marginLeft: '-4px',
    });
    unit.textContent = 'fps';
    fpsEl.appendChild(unit);

    // Insert into canvas parent (needs position: relative)
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

    // Update number (smoothed over last 10 frames)
    const recent = fpsFrames.slice(-10);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const label = fpsEl.querySelector('[data-plasma-fps-value]');
    if (label) { label.textContent = Math.round(avg); }

    // Draw sparkline
    const cw = fpsCanvas.width;
    const ch = fpsCanvas.height;
    fpsCtx.clearRect(0, 0, cw, ch);

    const max = Math.max(72, ...fpsFrames);
    const len = fpsFrames.length;

    // Fill area
    fpsCtx.beginPath();
    fpsCtx.moveTo(cw - len, ch);
    for (let i = 0; i < len; i++) {
      const x = cw - len + i;
      const y = ch - (fpsFrames[i] / max) * (ch - 2);
      fpsCtx.lineTo(x, y);
    }
    fpsCtx.lineTo(cw, ch);
    fpsCtx.closePath();
    fpsCtx.fillStyle = 'rgba(103, 232, 249, 0.08)';
    fpsCtx.fill();

    // Stroke line
    fpsCtx.beginPath();
    for (let i = 0; i < len; i++) {
      const x = cw - len + i;
      const y = ch - (fpsFrames[i] / max) * (ch - 2);
      i === 0 ? fpsCtx.moveTo(x, y) : fpsCtx.lineTo(x, y);
    }
    fpsCtx.strokeStyle = 'rgba(103, 232, 249, 0.55)';
    fpsCtx.lineWidth = 1;
    fpsCtx.stroke();

    // 60fps reference line
    const refY = ch - (60 / max) * (ch - 2);
    fpsCtx.beginPath();
    fpsCtx.moveTo(0, refY);
    fpsCtx.lineTo(cw, refY);
    fpsCtx.strokeStyle = 'rgba(103, 232, 249, 0.12)';
    fpsCtx.lineWidth = 0.5;
    fpsCtx.setLineDash([2, 3]);
    fpsCtx.stroke();
    fpsCtx.setLineDash([]);
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

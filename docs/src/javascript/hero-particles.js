/**
 * hero-particles.js — Floating UI primitive silhouettes for the hero
 *
 * Spawns semi-transparent wireframe shapes (buttons, cards, toggles, etc.)
 * that drift slowly through the plasma field. Purely graphical — no text.
 *
 * @example
 * import { createHeroParticles } from './hero-particles.js'
 * const particles = createHeroParticles(document.querySelector('aboveFold'))
 * particles.destroy()
 */

// ═══════════════════════════════════════════════════════════════
// Shape Definitions — wireframe UI primitives as SVG
// ═══════════════════════════════════════════════════════════════

const S = 'stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';

const SHAPES = [
  // Rounded rectangle (button)
  {
    svg: `<svg viewBox="0 0 52 22" ${S}><rect x="1" y="1" width="50" height="20" rx="6"/></svg>`,
    w: 52,
    h: 22,
  },
  // Card with content lines
  {
    svg:
      `<svg viewBox="0 0 36 48" ${S}><rect x="1" y="1" width="34" height="46" rx="3"/><line x1="7" y1="14" x2="29" y2="14" opacity="0.5"/><line x1="7" y1="22" x2="25" y2="22" opacity="0.35"/><line x1="7" y1="30" x2="27" y2="30" opacity="0.35"/></svg>`,
    w: 36,
    h: 48,
  },
  // Circle (icon)
  {
    svg: `<svg viewBox="0 0 28 28" ${S}><circle cx="14" cy="14" r="12"/></svg>`,
    w: 28,
    h: 28,
  },
  // Pill / capsule (toggle or tag)
  {
    svg: `<svg viewBox="0 0 40 18" ${S}><rect x="1" y="1" width="38" height="16" rx="8"/></svg>`,
    w: 40,
    h: 18,
  },
  // Checkbox with check
  {
    svg:
      `<svg viewBox="0 0 22 22" ${S}><rect x="1" y="1" width="20" height="20" rx="3"/><polyline points="6,11 10,15 16,7"/></svg>`,
    w: 22,
    h: 22,
  },
  // Menu / list lines
  {
    svg:
      `<svg viewBox="0 0 28 22" ${S}><line x1="2" y1="4" x2="26" y2="4"/><line x1="2" y1="11" x2="26" y2="11"/><line x1="2" y1="18" x2="20" y2="18"/></svg>`,
    w: 28,
    h: 22,
  },
  // 2×2 grid (layout / dashboard)
  {
    svg:
      `<svg viewBox="0 0 28 28" ${S}><rect x="1" y="1" width="12" height="12" rx="2"/><rect x="15" y="1" width="12" height="12" rx="2"/><rect x="1" y="15" width="12" height="12" rx="2"/><rect x="15" y="15" width="12" height="12" rx="2"/></svg>`,
    w: 28,
    h: 28,
  },
  // Component row (icon + label line)
  {
    svg: `<svg viewBox="0 0 48 18" ${S}><circle cx="9" cy="9" r="7"/><line x1="20" y1="9" x2="44" y2="9"/></svg>`,
    w: 48,
    h: 18,
  },
];

// ═══════════════════════════════════════════════════════════════
// Particle System
// ═══════════════════════════════════════════════════════════════

const DEFAULTS = {
  count: 14,
  // Opacity range
  opacityMin: 0.025,
  opacityMax: 0.06,
  // Scale range (multiplied on base shape size)
  scaleMin: 0.7,
  scaleMax: 1.5,
  // Drift velocity (fraction of container per second)
  // Negative = leftward / upward (matches plasma scroll direction)
  vxMin: -0.015,
  vxMax: -0.04,
  vyMin: -0.005,
  vyMax: -0.015,
  // Oscillation
  oscAmpMin: 0.005, // fraction of container
  oscAmpMax: 0.02,
  oscFreqMin: 0.08, // Hz
  oscFreqMax: 0.2,
  // Rotation range (degrees, static per particle)
  rotMin: -20,
  rotMax: 20,
  // Color
  color: 'rgba(100, 190, 220, 1)',
  // Glow
  glowRadius: 6,
  glowOpacity: 0.25,
  // Mobile
  mobileBreakpoint: 768,
  mobileCount: 6,
};

export function createHeroParticles(containerEl, userOpts = {}) {
  if (!containerEl) { return { destroy() {} }; }

  // Respect reduced motion
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionQuery.matches) { return { destroy() {} }; }

  const opts = { ...DEFAULTS, ...userOpts };
  const isMobile = window.innerWidth < opts.mobileBreakpoint;
  const count = isMobile ? opts.mobileCount : opts.count;

  // Create container
  const el = document.createElement('div');
  Object.assign(el.style, {
    position: 'absolute',
    inset: '0',
    zIndex: '1',
    pointerEvents: 'none',
    overflow: 'hidden',
  });

  const particles = [];

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  // Spawn particles
  for (let i = 0; i < count; i++) {
    const shape = SHAPES[i % SHAPES.length];
    const scale = rand(opts.scaleMin, opts.scaleMax);

    const div = document.createElement('div');
    div.innerHTML = shape.svg;
    Object.assign(div.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: `${shape.w * scale}px`,
      height: `${shape.h * scale}px`,
      color: opts.color,
      mixBlendMode: 'screen',
      willChange: 'transform',
      filter: `drop-shadow(0 0 ${opts.glowRadius}px rgba(100, 190, 220, ${opts.glowOpacity}))`,
    });

    // SVG fills its container
    const svg = div.querySelector('svg');
    if (svg) {
      svg.style.width = '100%';
      svg.style.height = '100%';
      svg.style.display = 'block';
    }

    el.appendChild(div);

    const opacity = rand(opts.opacityMin, opts.opacityMax);
    div.style.opacity = opacity;

    particles.push({
      el: div,
      // Position (fraction of container, 0–1)
      x: Math.random(),
      y: Math.random(),
      // Drift velocity (fraction/sec)
      vx: rand(opts.vxMin, opts.vxMax),
      vy: rand(opts.vyMin, opts.vyMax),
      // Static rotation
      rotation: rand(opts.rotMin, opts.rotMax),
      // Oscillation
      oscAmpX: rand(opts.oscAmpMin, opts.oscAmpMax),
      oscAmpY: rand(opts.oscAmpMin, opts.oscAmpMax) * 0.6,
      oscFreqX: rand(opts.oscFreqMin, opts.oscFreqMax),
      oscFreqY: rand(opts.oscFreqMin, opts.oscFreqMax),
      oscPhaseX: Math.random() * Math.PI * 2,
      oscPhaseY: Math.random() * Math.PI * 2,
    });
  }

  containerEl.appendChild(el);

  // ── Animation loop ──────────────────────────────────────────

  let running = true;
  let lastTime = performance.now();

  function animate(now) {
    if (!running) { return; }

    const dt = Math.min((now - lastTime) / 1000, 0.1); // cap to avoid jumps
    lastTime = now;
    const t = now / 1000;

    const w = el.offsetWidth;
    const h = el.offsetHeight;
    if (!w || !h) {
      requestAnimationFrame(animate);
      return;
    }

    for (const p of particles) {
      // Linear drift
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // Wrap at edges (with margin so they don't pop)
      if (p.x < -0.12) { p.x += 1.24; }
      if (p.x > 1.12) { p.x -= 1.24; }
      if (p.y < -0.12) { p.y += 1.24; }
      if (p.y > 1.12) { p.y -= 1.24; }

      // Sinusoidal oscillation
      const oscX = Math.sin(t * p.oscFreqX * Math.PI * 2 + p.oscPhaseX) * p.oscAmpX;
      const oscY = Math.cos(t * p.oscFreqY * Math.PI * 2 + p.oscPhaseY) * p.oscAmpY;

      const px = (p.x + oscX) * w;
      const py = (p.y + oscY) * h;

      p.el.style.transform = `translate(${px}px, ${py}px) rotate(${p.rotation}deg)`;
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  // ── Reduced motion listener ─────────────────────────────────

  function onMotionChange() {
    if (motionQuery.matches) {
      running = false;
      el.style.display = 'none';
    }
    else {
      running = true;
      el.style.display = '';
      lastTime = performance.now();
      requestAnimationFrame(animate);
    }
  }
  motionQuery.addEventListener('change', onMotionChange);

  // ── Public API ──────────────────────────────────────────────

  return {
    destroy() {
      running = false;
      motionQuery.removeEventListener('change', onMotionChange);
      el.remove();
    },
  };
}

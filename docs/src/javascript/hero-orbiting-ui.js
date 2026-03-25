/**
 * hero-orbiting-ui.js — Starfield of UI components for the plasma hero
 *
 * Creates a field of floating UI component renders that orbit the central
 * gradient sphere. Close to the sphere, components are clearly recognizable
 * (actual GIF renders). Further out, they shrink into tiny rectangular specks.
 * At the edges, they're just faint dots — suggesting an infinite universe of UI.
 *
 * Near-black pixels in GIFs are converted to transparent via canvas processing,
 * so components float cleanly without rectangular artifacts.
 */

// ═══════════════════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════════════════

const DEG = Math.PI / 180;
const BLACK_THRESHOLD = 10;

const SOURCES = [
  '/primitives/menu-dark.gif',
  '/primitives/input-dark.gif',
  '/primitives/button-dark.gif',
];

// Close panels — full GIF renders, clearly recognizable
const PANELS = [
  {
    src: 0,
    angle: -25,
    radius: 380,
    scale: 1.05,
    opacity: 0.16,
    bobAmp: 10,
    bobFreq: 0.08,
    bobPhase: 0,
    parallax: 0.03,
    tiltScale: 20,
  },
  {
    src: 1,
    angle: -155,
    radius: 360,
    scale: 0.95,
    opacity: 0.14,
    bobAmp: 12,
    bobFreq: 0.06,
    bobPhase: 2.1,
    parallax: 0.025,
    tiltScale: 18,
  },
  {
    src: 2,
    angle: 135,
    radius: 340,
    scale: 1.1,
    opacity: 0.18,
    bobAmp: 8,
    bobFreq: 0.10,
    bobPhase: 4.2,
    parallax: 0.035,
    tiltScale: 22,
  },
  // Medium distance — smaller, still recognizable
  {
    src: 0,
    angle: 35,
    radius: 460,
    scale: 0.5,
    opacity: 0.09,
    bobAmp: 6,
    bobFreq: 0.07,
    bobPhase: 1.0,
    parallax: 0.02,
    tiltScale: 15,
  },
  {
    src: 2,
    angle: -95,
    radius: 440,
    scale: 0.45,
    opacity: 0.08,
    bobAmp: 5,
    bobFreq: 0.09,
    bobPhase: 3.3,
    parallax: 0.018,
    tiltScale: 14,
  },
  {
    src: 1,
    angle: 175,
    radius: 490,
    scale: 0.4,
    opacity: 0.07,
    bobAmp: 4,
    bobFreq: 0.05,
    bobPhase: 5.0,
    parallax: 0.015,
    tiltScale: 12,
  },
];

// Spec field — generated programmatically
const SPEC_CONFIG = {
  count: 55,
  minRadius: 320,
  maxRadius: 900,
  // Specs get smaller and dimmer with distance
  widthClose: 90, // px width at closest — clearly recognizable UI
  widthFar: 4, // px width at farthest — just a tiny speck
  opacityClose: 0.90,
  opacityFar: 0.05,
  parallaxClose: 0.015,
  parallaxFar: 0.003,
  bobAmpClose: 5,
  bobAmpFar: 0.5,
  orbitSpeed: 0.3, // degrees per second (Keplerian — faster when closer)
};

const GLOW_COLOR = 'rgba(26, 153, 230, 0.25)';
const GLOW_RADIUS = 20;

// ═══════════════════════════════════════════════════════════════
// Alpha Processing
// ═══════════════════════════════════════════════════════════════

function processAlpha(ctx, w, h) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const max = d[i] > d[i + 1]
      ? (d[i] > d[i + 2] ? d[i] : d[i + 2])
      : (d[i + 1] > d[i + 2] ? d[i + 1] : d[i + 2]);
    if (max < BLACK_THRESHOLD) {
      d[i + 3] = 0;
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

// ═══════════════════════════════════════════════════════════════
// Spec Generation
// ═══════════════════════════════════════════════════════════════

function generateSpecs(cfg) {
  const specs = [];
  for (let i = 0; i < cfg.count; i++) {
    const angle = Math.random() * 360 - 180;
    // Power-law distribution: denser near sphere edge, sparse at far edges
    const t = Math.pow(Math.random(), 0.6);
    const radius = cfg.minRadius + t * (cfg.maxRadius - cfg.minRadius);

    // Normalized distance (0 = close to sphere, 1 = far edge)
    const dist = (radius - cfg.minRadius) / (cfg.maxRadius - cfg.minRadius);

    const width = cfg.widthClose + (cfg.widthFar - cfg.widthClose) * dist;
    const opacity = cfg.opacityClose + (cfg.opacityFar - cfg.opacityClose) * dist;
    const parallax = cfg.parallaxClose + (cfg.parallaxFar - cfg.parallaxClose) * dist;
    const bobAmp = cfg.bobAmpClose + (cfg.bobAmpFar - cfg.bobAmpClose) * dist;

    specs.push({
      angle,
      radius,
      dist,
      width,
      opacity,
      parallax,
      bobAmp,
      bobFreq: 0.04 + Math.random() * 0.08,
      bobPhase: Math.random() * Math.PI * 2,
      srcIdx: Math.floor(Math.random() * SOURCES.length),
      // Orbit: closer specs orbit faster (Keplerian)
      orbitSpeed: cfg.orbitSpeed / (0.5 + dist * 2),
      orbitPhase: Math.random() * 360,
    });
  }
  return specs;
}

// ═══════════════════════════════════════════════════════════════
// Public API
// ═══════════════════════════════════════════════════════════════

export function createOrbitingUI(containerEl, userOpts = {}) {
  if (!containerEl) { return { destroy() {} }; }

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionQuery.matches) { return { destroy() {} }; }

  const wrapper = document.createElement('div');
  Object.assign(wrapper.style, {
    position: 'absolute',
    inset: '0',
    zIndex: '1',
    pointerEvents: 'none',
    overflow: 'hidden',
    perspective: '1200px',
    perspectiveOrigin: '50% 50%',
  });

  let mouseX = 0, mouseY = 0;
  let smoothMouseX = 0, smoothMouseY = 0;

  // ── Load GIF sources ──────────────────────────────────────

  const sourceImgs = SOURCES.map(src => {
    const img = document.createElement('img');
    img.src = src;
    img.loading = 'eager';
    Object.assign(img.style, { position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: '0' });
    wrapper.appendChild(img);
    return img;
  });

  // ── Create panels (close GIF items) ───────────────────────

  const panelEls = [];

  for (const panel of PANELS) {
    const el = document.createElement('div');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    Object.assign(canvas.style, { display: 'block', borderRadius: '6px' });

    Object.assign(el.style, {
      position: 'absolute',
      left: '50%',
      top: '50%',
      opacity: '0',
      filter: `drop-shadow(0 0 ${GLOW_RADIUS}px ${GLOW_COLOR})`,
      transformStyle: 'preserve-3d',
      willChange: 'transform, opacity',
      transition: 'opacity 2s ease',
    });

    el.appendChild(canvas);
    wrapper.appendChild(el);

    const rad = panel.angle * DEG;
    const baseX = Math.cos(rad) * panel.radius;
    const baseY = Math.sin(rad) * panel.radius;
    const normX = baseX / panel.radius;
    const normY = baseY / panel.radius;

    panelEls.push({
      el,
      canvas,
      ctx,
      srcIdx: panel.src,
      baseX,
      baseY,
      baseRotateY: normX * panel.tiltScale,
      baseRotateX: -normY * panel.tiltScale,
      initialized: false,
      ...panel,
    });
  }

  // ── Create specs (distant star-like items) ────────────────

  const specs = generateSpecs(SPEC_CONFIG);
  const specEls = [];

  for (const spec of specs) {
    const el = document.createElement('div');
    const w = Math.max(1, spec.size * SPEC_CONFIG.aspectRatio);
    const h = Math.max(1, spec.size);

    Object.assign(el.style, {
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: `${w}px`,
      height: `${h}px`,
      borderRadius: `${Math.max(0.5, h * 0.3)}px`,
      background: spec.color,
      opacity: '0',
      mixBlendMode: 'screen',
      willChange: 'transform, opacity',
      transition: 'opacity 3s ease',
    });

    // Larger specs get a subtle glow
    if (spec.size > 3) {
      el.style.boxShadow = `0 0 ${spec.size}px ${spec.color.replace('rgb', 'rgba').replace(')', ', 0.4)')}`;
    }

    wrapper.appendChild(el);

    const rad = spec.angle * DEG;
    specEls.push({
      el,
      baseAngle: spec.angle,
      radius: spec.radius,
      baseX: Math.cos(rad) * spec.radius,
      baseY: Math.sin(rad) * spec.radius,
      ...spec,
    });

    // Staggered fade-in
    setTimeout(() => {
      el.style.opacity = String(spec.opacity);
    }, 500 + spec.dist * 2000);
  }

  containerEl.appendChild(wrapper);

  // ── Mouse tracking ────────────────────────────────────────

  function onPointerMove(e) {
    const rect = containerEl.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    mouseY = (e.clientY - rect.top) / rect.height - 0.5;
  }
  function onPointerLeave() {
    mouseX = 0;
    mouseY = 0;
  }
  containerEl.addEventListener('pointermove', onPointerMove);
  containerEl.addEventListener('pointerleave', onPointerLeave);

  // ── Animation loop ────────────────────────────────────────

  let running = true;
  let lastTime = performance.now();

  function animate(now) {
    if (!running) { return; }

    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;
    const t = now / 1000;

    const smoothing = 1 - Math.pow(0.001, dt);
    smoothMouseX += (mouseX - smoothMouseX) * smoothing;
    smoothMouseY += (mouseY - smoothMouseY) * smoothing;

    const cw = wrapper.offsetWidth;
    const ch = wrapper.offsetHeight;

    // ── Update panels ────────────────────────────────────

    for (const p of panelEls) {
      const img = sourceImgs[p.srcIdx];

      // Initialize canvas size on first valid frame
      if (!p.initialized && img.naturalWidth) {
        p.canvas.width = img.naturalWidth;
        p.canvas.height = img.naturalHeight;
        p.canvas.style.width = img.naturalWidth + 'px';
        p.canvas.style.height = img.naturalHeight + 'px';
        p.initialized = true;
        requestAnimationFrame(() => {
          p.el.style.opacity = String(p.opacity);
        });
      }

      // Process GIF frame → canvas with alpha
      if (p.initialized) {
        p.ctx.clearRect(0, 0, p.canvas.width, p.canvas.height);
        p.ctx.drawImage(img, 0, 0);
        processAlpha(p.ctx, p.canvas.width, p.canvas.height);
      }

      const bobX = Math.sin(t * p.bobFreq * Math.PI * 2 + p.bobPhase) * p.bobAmp * 0.5;
      const bobY = Math.cos(t * p.bobFreq * Math.PI * 2 + p.bobPhase + 1.3) * p.bobAmp;
      const parX = smoothMouseX * cw * p.parallax;
      const parY = smoothMouseY * ch * p.parallax;

      const x = p.baseX + bobX + parX;
      const y = p.baseY + bobY + parY;
      const rotY = p.baseRotateY + smoothMouseX * 8;
      const rotX = p.baseRotateX - smoothMouseY * 5;

      p.el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) `
        + `rotateY(${rotY}deg) rotateX(${rotX}deg) scale(${p.scale})`;
    }

    // ── Update specs ─────────────────────────────────────

    for (const s of specEls) {
      // Slow orbit (Keplerian — closer = faster)
      const orbitAngle = (s.baseAngle + t * s.orbitSpeed) * DEG;
      const bx = Math.cos(orbitAngle) * s.radius;
      const by = Math.sin(orbitAngle) * s.radius;

      const bobX = Math.sin(t * s.bobFreq * Math.PI * 2 + s.bobPhase) * s.bobAmp * 0.3;
      const bobY = Math.cos(t * s.bobFreq * Math.PI * 2 + s.bobPhase + 1.0) * s.bobAmp;
      const parX = smoothMouseX * cw * s.parallax;
      const parY = smoothMouseY * ch * s.parallax;

      s.el.style.transform = `translate(-50%, -50%) translate(${bx + bobX + parX}px, ${by + bobY + parY}px)`;
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  // ── Reduced motion ────────────────────────────────────────

  function onMotionChange() {
    if (motionQuery.matches) {
      running = false;
      wrapper.style.display = 'none';
    }
    else {
      running = true;
      wrapper.style.display = '';
      lastTime = performance.now();
      requestAnimationFrame(animate);
    }
  }
  motionQuery.addEventListener('change', onMotionChange);

  return {
    destroy() {
      running = false;
      motionQuery.removeEventListener('change', onMotionChange);
      containerEl.removeEventListener('pointermove', onPointerMove);
      containerEl.removeEventListener('pointerleave', onPointerLeave);
      wrapper.remove();
    },
  };
}

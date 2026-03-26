/**
 * hero-traces.js — Signal trace effect for the plasma hero
 *
 * Renders luminous trails that flow through the plasma field,
 * like electrical signals propagating through a reactive system.
 *
 * Each trace has a smoothed direction that gently responds to the
 * plasma field, producing flowing aurora-like paths rather than
 * erratic ridge-following. An FBO with temporal persistence creates
 * soft glowing trails that integrate with the plasma.
 *
 * @example
 * import { createPlasma } from './plasma.js'
 * import { createHeroTraces } from './hero-traces.js'
 * const plasma = createPlasma('#canvas', { ... })
 * const traces = createHeroTraces(plasma)
 * traces.destroy()
 */

// ═══════════════════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════════════════

const DEFAULTS = {
  maxTraces: 16,
  traceSpeed: 0.055,
  spawnRate: 2,
  lifespanMin: 7,
  lifespanMax: 18,
  fadeIn: 0.1,
  fadeOut: 0.3,

  color: [0.2, 0.72, 1.0],
  brightness: 0.8,
  dotSize: 16,
  dotIntensity: 0.35,
  trailDuration: 3.0, // seconds for trail to fade to ~10%
  fboScale: 0.5,

  // Flow — traces drift in a base direction, gently curved by the plasma
  baseFlowAngle: Math.PI + Math.PI * 0.2, // ~216° — down-left, matching plasma scroll
  flowAngleSpread: 0.7, // ± per-trace variation (radians)
  dirSmoothing: 0.03, // how fast direction responds (0=frozen, 1=instant; per frame @60fps)
  wobbleAmp: 0.35, // sinusoidal wobble amplitude (radians)
  wobbleFreq: 0.1, // wobble frequency (Hz)
  plasmaInfluence: 0.45, // blend factor toward plasma-suggested direction

  // Trail history — recent positions rendered as dots for continuous trails
  historyLength: 10,
  historyInterval: 0.04, // seconds between position samples
};

// ═══════════════════════════════════════════════════════════════
// Plasma Field — mirrors the GLSL shader math
// ═══════════════════════════════════════════════════════════════

function plasmaS(ux, uy, time, cfg, mx, my, aspect) {
  let cx = cfg.density * ux * aspect + time * cfg.scrollSpeed;
  let cy = cfg.density * uy + time * cfg.scrollSpeed;

  const mouse = cfg.mouse;
  if (mouse && mouse.warp > 0) {
    const mxUV = mx + 0.5;
    const myUV = my + 0.5;
    const pmx = mxUV * cfg.density * aspect + time * cfg.scrollSpeed;
    const pmy = (1.0 - myUV) * cfg.density + time * cfg.scrollSpeed;
    const dx = cx - pmx;
    const dy = cy - pmy;
    const dist2 = dx * dx + dy * dy;
    cx -= mouse.warp * dx / (1.0 + dist2);
    cy -= mouse.warp * dy / (1.0 + dist2);
  }

  const wv = cfg.wave;
  const k = wv.kBase + Math.cos(cy + Math.sin(wv.kPhase - time)) + wv.kTimeScale * time;
  const w = wv.wBase + Math.sin(cx + Math.cos(wv.wPhase + time)) + wv.wTimeScale * time;
  const d = Math.sqrt(cx * cx + cy * cy);
  return wv.intensity * Math.cos(d + w) * Math.sin(k + w);
}

function plasmaGradient(ux, uy, time, cfg, mx, my, aspect) {
  const eps = 0.005;
  const dsdx = (plasmaS(ux + eps, uy, time, cfg, mx, my, aspect)
    - plasmaS(ux - eps, uy, time, cfg, mx, my, aspect)) / (2 * eps);
  const dsdy = (plasmaS(ux, uy + eps, time, cfg, mx, my, aspect)
    - plasmaS(ux, uy - eps, time, cfg, mx, my, aspect)) / (2 * eps);
  return { dsdx, dsdy };
}

// ═══════════════════════════════════════════════════════════════
// Angle Utilities
// ═══════════════════════════════════════════════════════════════

function lerpAngle(a, b, t) {
  let diff = b - a;
  while (diff > Math.PI) { diff -= Math.PI * 2; }
  while (diff < -Math.PI) { diff += Math.PI * 2; }
  return a + diff * t;
}

// ═══════════════════════════════════════════════════════════════
// Trace State
// ═══════════════════════════════════════════════════════════════

function createTrace(x, y, theta, lifespan, speedMult, wobblePhase) {
  return {
    x,
    y,
    theta,
    age: 0,
    lifespan,
    alive: true,
    speed: speedMult,
    wobblePhase,
    dir: Math.random() < 0.5 ? 1 : -1,
    history: [],
    historyTimer: 0,
  };
}

function updateTrace(tr, dt, time, cfg, mx, my, aspect, opts) {
  tr.age += dt;
  if (tr.age >= tr.lifespan) {
    tr.alive = false;
    return;
  }

  const grad = plasmaGradient(tr.x, tr.y, time, cfg, mx, my, aspect);
  const gradLen = Math.sqrt(grad.dsdx * grad.dsdx + grad.dsdy * grad.dsdy);

  // Plasma suggests a ridge direction (perpendicular to gradient)
  let targetAngle = tr.theta;
  if (gradLen > 0.5) {
    const ridgeAngle = Math.atan2(grad.dsdx * tr.dir, -grad.dsdy * tr.dir);
    const influence = Math.min(gradLen / 6.0, 1.0) * opts.plasmaInfluence;
    const wobble = opts.wobbleAmp * Math.sin(
      time * opts.wobbleFreq * Math.PI * 2 + tr.wobblePhase,
    );
    const baseAngle = opts.baseFlowAngle + wobble;
    targetAngle = lerpAngle(baseAngle, ridgeAngle, influence);
  }

  // Exponentially smooth direction (frame-rate independent)
  const smoothing = 1.0 - Math.pow(1.0 - opts.dirSmoothing, dt * 60);
  tr.theta = lerpAngle(tr.theta, targetAngle, smoothing);

  const speed = tr.speed * opts.traceSpeed * dt;
  tr.x += Math.cos(tr.theta) * speed;
  tr.y += Math.sin(tr.theta) * speed;

  // Record position for trail continuity
  tr.historyTimer += dt;
  if (tr.historyTimer >= opts.historyInterval) {
    tr.historyTimer = 0;
    tr.history.push(tr.x, tr.y);
    if (tr.history.length > opts.historyLength * 2) {
      tr.history.splice(0, 2);
    }
  }

  if (tr.x < -0.15 || tr.x > 1.15 || tr.y < -0.15 || tr.y > 1.15) {
    tr.alive = false;
  }
}

function traceAlpha(tr, opts) {
  const t = tr.age / tr.lifespan;
  if (t < opts.fadeIn) { return t / opts.fadeIn; }
  if (t > 1 - opts.fadeOut) { return (1 - t) / opts.fadeOut; }
  return 1.0;
}

// ═══════════════════════════════════════════════════════════════
// Shaders
// ═══════════════════════════════════════════════════════════════

const FADE_VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;
const FADE_FRAG = `
precision mediump float;
uniform float u_alpha;
void main() { gl_FragColor = vec4(0.0, 0.0, 0.0, u_alpha); }
`;

const DOT_VERT = `
attribute vec3 a_data;
varying float v_alpha;
uniform float u_pointSize;
void main() {
  gl_Position = vec4(a_data.xy, 0.0, 1.0);
  gl_PointSize = u_pointSize;
  v_alpha = a_data.z;
}
`;
const DOT_FRAG = `
precision mediump float;
varying float v_alpha;
uniform vec3 u_color;
uniform float u_intensity;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float dist2 = dot(d, d) * 4.0;
  float core = exp(-dist2 * 3.0);
  float halo = exp(-dist2 * 0.8) * 0.25;
  float glow = core + halo;
  float a = glow * v_alpha * u_intensity;
  gl_FragColor = vec4(u_color * a, a);
}
`;

const COMPOSITE_VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
  v_uv = a_pos * 0.5 + 0.5;
}
`;
const COMPOSITE_FRAG = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_tex;
uniform float u_brightness;
void main() {
  vec4 c = texture2D(u_tex, v_uv);
  gl_FragColor = vec4(c.rgb * u_brightness, c.a * u_brightness);
}
`;

// ═══════════════════════════════════════════════════════════════
// GL Helpers
// ═══════════════════════════════════════════════════════════════

function compileShader(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error('hero-traces shader:', gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

function linkProgram(gl, vertSrc, fragSrc) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
  if (!vs || !fs) { return null; }

  const p = gl.createProgram();
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.error('hero-traces link:', gl.getProgramInfoLog(p));
    gl.deleteProgram(p);
    return null;
  }
  return p;
}

function makeFBO(gl, w, h) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  return { fb, tex, w, h };
}

function destroyFBO(gl, fbo) {
  if (!fbo) { return; }
  gl.deleteTexture(fbo.tex);
  gl.deleteFramebuffer(fbo.fb);
}

// ═══════════════════════════════════════════════════════════════
// Public API
// ═══════════════════════════════════════════════════════════════

export function createHeroTraces(plasma, userOpts = {}) {
  const opts = { ...DEFAULTS, ...userOpts };
  const traces = [];
  let spawnAccum = 0;

  let decayPerFrame60 = 1.0 - Math.pow(0.1, 1.0 / (opts.trailDuration * 60));

  let gl = null;
  let ready = false;
  let fade = null;
  let dot = null;
  let comp = null;
  let quadBuf = null;
  let dotBuf = null;
  let fbo = null;

  function initGL(glCtx, canvasW, canvasH) {
    gl = glCtx;

    const fadeProg = linkProgram(gl, FADE_VERT, FADE_FRAG);
    const dotProg = linkProgram(gl, DOT_VERT, DOT_FRAG);
    const compProg = linkProgram(gl, COMPOSITE_VERT, COMPOSITE_FRAG);
    if (!fadeProg || !dotProg || !compProg) { return false; }

    fade = {
      prog: fadeProg,
      loc: {
        a_pos: gl.getAttribLocation(fadeProg, 'a_pos'),
        u_alpha: gl.getUniformLocation(fadeProg, 'u_alpha'),
      },
    };
    dot = {
      prog: dotProg,
      loc: {
        a_data: gl.getAttribLocation(dotProg, 'a_data'),
        u_color: gl.getUniformLocation(dotProg, 'u_color'),
        u_intensity: gl.getUniformLocation(dotProg, 'u_intensity'),
        u_pointSize: gl.getUniformLocation(dotProg, 'u_pointSize'),
      },
    };
    comp = {
      prog: compProg,
      loc: {
        a_pos: gl.getAttribLocation(compProg, 'a_pos'),
        u_tex: gl.getUniformLocation(compProg, 'u_tex'),
        u_brightness: gl.getUniformLocation(compProg, 'u_brightness'),
      },
    };

    quadBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    dotBuf = gl.createBuffer();

    const fw = Math.max(1, Math.ceil(canvasW * opts.fboScale));
    const fh = Math.max(1, Math.ceil(canvasH * opts.fboScale));
    fbo = makeFBO(gl, fw, fh);

    ready = true;
    return true;
  }

  function ensureFBOSize(canvasW, canvasH) {
    const fw = Math.max(1, Math.ceil(canvasW * opts.fboScale));
    const fh = Math.max(1, Math.ceil(canvasH * opts.fboScale));
    if (fbo && fbo.w === fw && fbo.h === fh) { return; }
    destroyFBO(gl, fbo);
    fbo = makeFBO(gl, fw, fh);
  }

  function spawnTrace() {
    // Spawn from right or top edge to flow across the viewport
    let x, y;
    const edge = Math.random();
    if (edge < 0.5) {
      x = 1.05 + Math.random() * 0.1;
      y = Math.random();
    }
    else if (edge < 0.85) {
      x = Math.random();
      y = 1.05 + Math.random() * 0.1;
    }
    else {
      x = 0.1 + Math.random() * 0.8;
      y = 0.1 + Math.random() * 0.8;
    }

    const theta = opts.baseFlowAngle + (Math.random() - 0.5) * opts.flowAngleSpread;
    const speedMult = 0.7 + Math.random() * 0.6;
    const wobblePhase = Math.random() * Math.PI * 2;
    const life = opts.lifespanMin + Math.random() * (opts.lifespanMax - opts.lifespanMin);
    traces.push(createTrace(x, y, theta, life, speedMult, wobblePhase));
  }

  function buildDotData() {
    // Count total dots: head + history for each visible trace
    let totalDots = 0;
    for (const tr of traces) {
      if (traceAlpha(tr, opts) <= 0.001) { continue; }
      totalDots += 1 + Math.floor(tr.history.length / 2);
    }

    const arr = new Float32Array(totalDots * 3);
    let n = 0;

    for (const tr of traces) {
      const alpha = traceAlpha(tr, opts);
      if (alpha <= 0.001) { continue; }

      // History points — older = dimmer, creates continuous trail
      const histCount = Math.floor(tr.history.length / 2);
      for (let i = 0; i < histCount; i++) {
        const hx = tr.history[i * 2];
        const hy = tr.history[i * 2 + 1];
        const t = histCount > 1 ? i / (histCount - 1) : 1;
        const histAlpha = alpha * t * 0.5;
        arr[n++] = hx * 2.0 - 1.0;
        arr[n++] = hy * 2.0 - 1.0;
        arr[n++] = histAlpha * opts.dotIntensity;
      }

      // Head — brightest point
      arr[n++] = tr.x * 2.0 - 1.0;
      arr[n++] = tr.y * 2.0 - 1.0;
      arr[n++] = alpha * opts.dotIntensity;
    }

    return { data: arr, count: n / 3 };
  }

  // ── Render callback ──────────────────────────────────────────

  function renderLayer({ time, mouseX, mouseY, dt, renderer, cfg }) {
    if (renderer.type !== 'webgl') { return; }

    const glCtx = renderer.gl;
    const { w, h } = renderer.getSize();
    if (!w || !h) { return; }

    if (ready && !gl.isProgram(fade.prog)) {
      ready = false;
      fbo = null;
    }
    if (!ready && !initGL(glCtx, w, h)) { return; }

    ensureFBOSize(w, h);

    const cdt = Math.min(dt, 0.1);
    const aspect = w / h;

    // Update traces
    for (const tr of traces) {
      updateTrace(tr, cdt, time, cfg, mouseX, mouseY, aspect, opts);
    }

    for (let i = traces.length - 1; i >= 0; i--) {
      if (!traces[i].alive) { traces.splice(i, 1); }
    }

    spawnAccum += cdt * opts.spawnRate;
    while (spawnAccum >= 1 && traces.length < opts.maxTraces) {
      spawnTrace();
      spawnAccum -= 1;
    }

    // ── Pass 1: Render to FBO ────────────────────────────────

    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.fb);
    gl.viewport(0, 0, fbo.w, fbo.h);
    gl.enable(gl.BLEND);

    // Fade previous content (temporal decay)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(fade.prog);
    const fadeAlpha = 1.0 - Math.pow(1.0 - decayPerFrame60, cdt * 60);
    gl.uniform1f(fade.loc.u_alpha, fadeAlpha);

    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.enableVertexAttribArray(fade.loc.a_pos);
    gl.vertexAttribPointer(fade.loc.a_pos, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.disableVertexAttribArray(fade.loc.a_pos);

    // Draw trace dots (heads + history)
    const { data: dotData, count: dotCount } = buildDotData();
    if (dotCount > 0) {
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

      gl.useProgram(dot.prog);
      gl.uniform3f(dot.loc.u_color, opts.color[0], opts.color[1], opts.color[2]);
      gl.uniform1f(dot.loc.u_intensity, 1.0);
      gl.uniform1f(dot.loc.u_pointSize, opts.dotSize);

      gl.bindBuffer(gl.ARRAY_BUFFER, dotBuf);
      gl.bufferData(gl.ARRAY_BUFFER, dotData.subarray(0, dotCount * 3), gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(dot.loc.a_data);
      gl.vertexAttribPointer(dot.loc.a_data, 3, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.POINTS, 0, dotCount);
      gl.disableVertexAttribArray(dot.loc.a_data);
    }

    // ── Pass 2: Composite FBO onto plasma ────────────────────

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, w, h);

    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.useProgram(comp.prog);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, fbo.tex);
    gl.uniform1i(comp.loc.u_tex, 0);
    gl.uniform1f(comp.loc.u_brightness, opts.brightness);

    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.enableVertexAttribArray(comp.loc.a_pos);
    gl.vertexAttribPointer(comp.loc.a_pos, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.disableVertexAttribArray(comp.loc.a_pos);

    gl.disable(gl.BLEND);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  plasma.addLayer(renderLayer);

  return {
    get traceCount() {
      return traces.length;
    },

    setOptions(o) {
      Object.assign(opts, o);
      if ('trailDuration' in o) {
        decayPerFrame60 = 1.0 - Math.pow(0.1, 1.0 / (opts.trailDuration * 60));
      }
    },

    destroy() {
      plasma.removeLayer(renderLayer);
      if (gl) {
        if (fade) { gl.deleteProgram(fade.prog); }
        if (dot) { gl.deleteProgram(dot.prog); }
        if (comp) { gl.deleteProgram(comp.prog); }
        if (quadBuf) { gl.deleteBuffer(quadBuf); }
        if (dotBuf) { gl.deleteBuffer(dotBuf); }
        destroyFBO(gl, fbo);
      }
      traces.length = 0;
      ready = false;
    },
  };
}

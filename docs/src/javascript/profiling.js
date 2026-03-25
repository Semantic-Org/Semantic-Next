/**
 * profiling.js — Plasma shader variant benchmarking
 *
 * Measures GPU time across shader configurations using readPixels
 * as a reliable pipeline sync on ANGLE/D3D11 backends.
 * Auto-calibrates draw count to find a measurable range.
 *
 * Usage:
 *   1. Add  window.__plasma = plasma  after createPlasma() in index.astro
 *   2. Open DevTools console and run:
 *        import('/src/javascript/profiling.js')
 *   3. Wait for calibration + all variants to complete
 *   4. Copy the PLASMA_PROFILE_RESULT JSON block from console
 */

const WARMUP = 60;
const SAMPLES = 300;
const FPS_FRAMES = 300; // natural frame rate sample count
const TARGET_MS = 4;
const MIN_DRAWS = 10;
const MAX_DRAWS = 10000;

const VARIANTS = [
  { name: 'baseline', label: 'all features on', settings: {} },
  { name: 'no_warp', label: 'gravity warp disabled', settings: { mouse: { warp: 0 } } },
  { name: 'no_specular', label: 'specular disabled', settings: { specularTint: false } },
  { name: 'no_both', label: 'warp + specular disabled', settings: { specularTint: false, mouse: { warp: 0 } } },
];

function round(n, d = 3) {
  const f = 10 ** d;
  return Math.round(n * f) / f;
}

function computeStats(samples) {
  const sorted = [...samples].sort((a, b) => a - b);
  const n = sorted.length;
  const mean = sorted.reduce((a, b) => a + b, 0) / n;
  const median = n % 2
    ? sorted[(n - 1) / 2]
    : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
  const variance = sorted.reduce((s, x) => s + (x - mean) ** 2, 0) / n;
  const stddev = Math.sqrt(variance);
  return {
    mean: round(mean),
    median: round(median),
    stddev: round(stddev),
    p5: round(sorted[Math.floor(n * 0.05)]),
    p95: round(sorted[Math.floor(n * 0.95)]),
    min: round(sorted[0]),
    max: round(sorted[n - 1]),
    cv: round((stddev / mean) * 100, 1),
    n,
  };
}

// Reliable GPU sync — readPixels forces full pipeline flush on all drivers
function gpuSync(gl, pixel) {
  gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
}

// Measure natural rAF frame rate without any GPU sync injection.
// Uses the same approach as plasma.js FPS system (rAF delta timing).
function measureNaturalFPS(plasma, variantSettings, original) {
  return new Promise((resolve) => {
    plasma.setSettings(original);
    if (Object.keys(variantSettings).length) {
      plasma.setSettings(variantSettings);
    }
    plasma.resume();

    let count = 0;
    const deltas = [];
    let lastTime = null;

    const layer = () => {
      const now = performance.now();
      count++;

      // Skip warmup frames
      if (count <= WARMUP) {
        lastTime = now;
        return;
      }

      if (lastTime !== null) {
        deltas.push(now - lastTime);
      }
      lastTime = now;

      if (deltas.length >= FPS_FRAMES) {
        plasma.removeLayer(layer);
        const frameStats = computeStats(deltas);
        const fpsFromMedian = round(1000 / frameStats.median, 1);
        const fpsFromMean = round(1000 / frameStats.mean, 1);
        resolve({
          frameTime: frameStats,
          fps: { fromMedian: fpsFromMedian, fromMean: fpsFromMean },
        });
      }
    };

    plasma.addLayer(layer);
  });
}

// Determine how many draws are needed to reach TARGET_MS per sample
function calibrate(gl, pixel) {
  let draws = MIN_DRAWS;
  while (draws <= MAX_DRAWS) {
    gpuSync(gl, pixel);
    const t0 = performance.now();
    for (let i = 0; i < draws; i++) {
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    gpuSync(gl, pixel);
    const ms = performance.now() - t0;

    if (ms >= TARGET_MS) {
      return draws;
    }
    const scale = ms > 0 ? Math.ceil(TARGET_MS / ms) : 10;
    draws = Math.min(draws * Math.max(scale, 2), MAX_DRAWS);
  }
  return MAX_DRAWS;
}

function collectVariant(plasma, gl, pixel, drawsPerSample, variantSettings, original) {
  return new Promise((resolve) => {
    plasma.setSettings(original);
    if (Object.keys(variantSettings).length) {
      plasma.setSettings(variantSettings);
    }
    plasma.resume();

    let count = 0;
    const gpuSamples = [];

    const layer = () => {
      count++;
      if (count <= WARMUP) { return; }

      gpuSync(gl, pixel);

      const t0 = performance.now();
      for (let i = 0; i < drawsPerSample; i++) {
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      gpuSync(gl, pixel);
      const ms = performance.now() - t0;

      gpuSamples.push(ms / drawsPerSample);

      if (gpuSamples.length >= SAMPLES) {
        plasma.removeLayer(layer);
        resolve(computeStats(gpuSamples));
      }
    };

    plasma.addLayer(layer);
  });
}

export async function profilePlasma(plasma, canvasSelector = '#plasma') {
  plasma = plasma || window.__plasma;
  if (!plasma) {
    console.error('[profiler] window.__plasma not found. Add: window.__plasma = plasma');
    return null;
  }

  const canvas = document.querySelector(canvasSelector);
  const gl = canvas?.getContext('webgl');
  if (!gl) {
    console.error('[profiler] No WebGL context on', canvasSelector);
    return null;
  }

  const pixel = new Uint8Array(4);

  // System info
  const dbg = gl.getExtension('WEBGL_debug_renderer_info');
  const gpu = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : 'unknown';
  const vendor = dbg ? gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) : 'unknown';

  // Power state
  let powerState = 'unknown';
  try {
    const battery = await navigator.getBattery?.();
    if (battery) {
      powerState = battery.charging ? 'plugged_in' : 'battery';
    }
  }
  catch {}

  // Save original state and prevent pause-on-blur during profiling
  const original = plasma.getSettings();
  const wasRunning = plasma.isRunning;
  plasma.setSettings({ pauseOffscreen: false });

  const viewport = { width: window.innerWidth, height: window.innerHeight };
  const screen = { width: window.screen.width, height: window.screen.height };

  console.log(
    `[profiler] Plasma shader benchmark\n`
      + `  GPU:      ${gpu}\n`
      + `  Canvas:   ${canvas.width}x${canvas.height}\n`
      + `  Viewport: ${viewport.width}x${viewport.height}\n`
      + `  Screen:   ${screen.width}x${screen.height}\n`
      + `  DPR:      ${devicePixelRatio}\n`
      + `  Power:    ${powerState}\n`,
  );

  // Phase 1: Natural FPS per variant (no GPU sync, matches plasma.js FPS counter)
  console.log(`[profiler] Phase 1: Natural frame rate (${FPS_FRAMES} frames per variant)...`);
  const naturalFPS = {};
  for (let i = 0; i < VARIANTS.length; i++) {
    const v = VARIANTS[i];
    console.log(`  [${i + 1}/${VARIANTS.length}] ${v.name}...`);
    naturalFPS[v.name] = await measureNaturalFPS(plasma, v.settings, original);
    const f = naturalFPS[v.name];
    console.log(`    -> ${f.fps.fromMedian} fps (median frame: ${f.frameTime.median}ms)`);
  }

  // Phase 2: Calibrate + GPU draw timing
  console.log('\n[profiler] Phase 2: GPU draw cost (calibrating...)');
  gpuSync(gl, pixel);
  const drawsPerSample = calibrate(gl, pixel);
  console.log(`  Using ${drawsPerSample} draws per sample (target: ~${TARGET_MS}ms)\n`);

  const gpuCost = {};
  for (let i = 0; i < VARIANTS.length; i++) {
    const v = VARIANTS[i];
    console.log(`  [${i + 1}/${VARIANTS.length}] ${v.name} (${v.label})...`);
    gpuCost[v.name] = await collectVariant(plasma, gl, pixel, drawsPerSample, v.settings, original);
    console.log(
      `    -> median: ${gpuCost[v.name].median}ms  mean: ${gpuCost[v.name].mean}ms  cv: ${gpuCost[v.name].cv}%`,
    );
  }

  // Restore
  plasma.setSettings(original);
  if (!wasRunning) { plasma.pause(); }

  // Comparisons against baseline
  const baseFPS = naturalFPS.baseline;
  const baseGPU = gpuCost.baseline;
  const comparison = {};
  for (const v of VARIANTS) {
    if (v.name === 'baseline') { continue; }
    const fps = naturalFPS[v.name];
    const gpu = gpuCost[v.name];
    const gpuDelta = gpu.median - baseGPU.median;
    const gpuPct = baseGPU.median ? (gpuDelta / baseGPU.median) * 100 : 0;
    const fpsDelta = fps.fps.fromMedian - baseFPS.fps.fromMedian;
    comparison[v.name] = {
      gpu_delta_ms: round(gpuDelta),
      gpu_delta_pct: round(gpuPct, 1),
      fps_delta: round(fpsDelta, 1),
    };
  }

  const report = {
    timestamp: new Date().toISOString(),
    system: {
      gpu,
      vendor,
      powerState,
      canvas: `${canvas.width}x${canvas.height}`,
      viewport: `${viewport.width}x${viewport.height}`,
      screen: `${screen.width}x${screen.height}`,
      dpr: devicePixelRatio,
      ua: navigator.userAgent,
    },
    config: { warmup: WARMUP, fpsSamples: FPS_FRAMES, gpuSamples: SAMPLES, drawsPerSample },
    naturalFPS: Object.fromEntries(
      VARIANTS.map(v => [v.name, naturalFPS[v.name].fps]),
    ),
    frameTime: Object.fromEntries(
      VARIANTS.map(v => [v.name, naturalFPS[v.name].frameTime]),
    ),
    gpuCost,
    comparison,
  };

  console.log('\nDone. Copy the JSON below:\n');
  console.log('PLASMA_PROFILE_RESULT\n' + JSON.stringify(report, null, 2));
  return report;
}

profilePlasma().catch(e => console.error('[profiler]', e));

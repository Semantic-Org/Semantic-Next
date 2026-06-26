/*
  Reactivity footprint micro — a Node process under --expose-gc.

  Builds a dependency graph (signals + computeds + reactions wired together),
  forces GC, and reads process.memoryUsage().heapUsed. Far lower noise than the
  browser path (no DOM, no render scheduler, no Chrome): a tighter footprint
  signal for the reactivity package specifically.

  This is a footprint *trend*, not a gate — the browser invariants are the
  verdict. It reports heapUsed for the live graph plus a residual reading after
  dropping all references and collecting, which should fall back near the empty
  baseline (a standing residual hints at a retained graph).

  Run standalone:
    node --expose-gc tools/ci/memory/reactivity-micro.js [--out file.json] [--n 10000]

  Without --expose-gc, global.gc is undefined; the micro re-execs itself with
  the flag so collect.js / a human can call it plainly.
*/
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { computed, flush, reaction, signal } from '@semantic-ui/reactivity';

const DEFAULT_N = 10_000;

export function measureReactivityFootprint(n = DEFAULT_N) {
  if (typeof global.gc !== 'function') {
    throw new Error('reactivity-micro: run under --expose-gc');
  }

  const settle = () => {
    global.gc();
    global.gc();
    return process.memoryUsage().heapUsed;
  };

  const empty = settle();

  // Build the graph: n signals, n computeds each reading one signal, n
  // reactions each reading one computed. Wiring the reaction is what registers
  // the subscriber chain signal -> computed -> reaction, so the Dependency
  // subscriber Sets are populated (the retain-prone structures).
  const signals = new Array(n);
  const computeds = new Array(n);
  const reactions = new Array(n);
  for (let i = 0; i < n; i++) {
    const s = signal(i);
    const c = computed(() => s.get() * 2);
    signals[i] = s;
    computeds[i] = c;
    reactions[i] = reaction(() => {
      c.get();
    });
  }
  if (flush) { flush(); }

  const live = settle();

  // Stop reactions and drop every reference. A correct teardown returns heap to
  // ~empty; a standing residual is the trend signal.
  for (const r of reactions) { r.stop(); }
  signals.length = 0;
  computeds.length = 0;
  reactions.length = 0;
  const residual = settle();

  return {
    n,
    emptyHeapUsed: empty,
    liveHeapUsed: live,
    residualHeapUsed: residual,
    graphBytes: live - empty,
    residualBytes: residual - empty,
  };
}

// Run the measurement in a child process that definitely has --expose-gc, so
// collect.js can call this without owning the flag.
export function runMicroChildProcess(n = DEFAULT_N) {
  const self = fileURLToPath(import.meta.url);
  const res = spawnSync(
    process.execPath,
    ['--expose-gc', self, '--emit-json', '--n', String(n)],
    { encoding: 'utf8' },
  );
  if (res.status !== 0) {
    throw new Error(`reactivity-micro child failed: ${res.stderr || res.stdout}`);
  }
  const line = res.stdout.trim().split('\n').filter(Boolean).pop();
  return JSON.parse(line);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const n = args.n ? Number(args.n) : DEFAULT_N;

  // If we lack --expose-gc, re-exec ourselves with it.
  if (typeof global.gc !== 'function') {
    const out = runMicroChildProcess(n);
    finishMain(out, args);
    return;
  }

  const out = measureReactivityFootprint(n);
  finishMain(out, args);
}

function finishMain(out, args) {
  if (args['emit-json']) {
    process.stdout.write(JSON.stringify(out) + '\n');
    return;
  }
  if (args.out) {
    fs.mkdirSync(path.dirname(path.resolve(args.out)), { recursive: true });
    fs.writeFileSync(args.out, JSON.stringify(out, null, 2));
  }
  const kb = (b) => (b / 1024).toFixed(0) + ' KB';
  console.log(`${out.n} signals + computeds + reactions`);
  console.log(`  graph:    ${kb(out.graphBytes)} heapUsed`);
  console.log(`  residual: ${kb(out.residualBytes)} after teardown + GC`);
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) { continue; }
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) { out[key] = true; }
    else {
      out[key] = next;
      i++;
    }
  }
  return out;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}

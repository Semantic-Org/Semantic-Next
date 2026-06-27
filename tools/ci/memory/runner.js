/*
  The browser half of the gate: launch Chromium, load the memory bench page,
  churn create -> destroy cycles, and read live-instance counts via CDP
  queryObjects after a correct settle(). Also reads post-GC page metrics as the
  soft footprint trend.

  This module exports `runTree({ page, side })` for collect.js and can also be
  run standalone for a smoke check:

    node tools/ci/memory/runner.js --page <url> [--rows 1000]

  Determinism rests entirely on settle(): every count is read only after async
  teardown (deferred disconnectedCallback / onDestroyed microtasks) has drained
  and V8 has collected. A flaky count means settle() read too early — add a
  frame or a GC round, never widen a threshold (honest limits, README).
*/
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { countLiveInstances } from './census.js';
import { CHURN, FOOTPRINT_OPS, INVARIANTS } from './targets.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(dirname, '..', '..', '..');

// Chromium launch flags. --expose-gc lets the page's destroy() force a major
// collection between ops; --enable-precise-memory-info sharpens
// performance.memory; --no-move-object-start keeps object addresses stable for
// snapshot work (Tier 2). collectGarbage over CDP is what the gate relies on,
// independent of these.
export const LAUNCH_ARGS = [
  '--js-flags=--expose-gc',
  '--enable-precise-memory-info',
  '--no-move-object-start',
];

/*
  Flush async teardown, then GC. The whole gate's determinism is here.
*/
export async function settle(page, client) {
  await page.evaluate(async () => {
    await Promise.resolve(); // drain microtasks (deferred disconnectedCallback)
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); // two frames: move-vs-removal guard + onDestroyed
    await new Promise((r) => setTimeout(r, 50)); // give GC room
  });
  await client.send('HeapProfiler.collectGarbage');
  await client.send('HeapProfiler.collectGarbage'); // >=2x for layered / FinalizationRegistry refs
}

// Resolve a RemoteObject objectId for each invariant prototype the page
// exposes, so queryObjects can count against it. detachedNodes has no prototype
// (it's a snapshot-only / structural census), so it's skipped here and counted
// structurally via the page's containerNodeCount fallback after destroy.
async function resolvePrototypes(client) {
  const ids = {};
  for (const inv of INVARIANTS) {
    if (inv.census === 'detached') { continue; }
    const { result, exceptionDetails } = await client.send('Runtime.evaluate', {
      expression: `window.__heap.prototypes.${inv.id}`,
    });
    if (exceptionDetails || !result?.objectId) {
      throw new Error(`memory runner: prototype "${inv.id}" not exposed on window.__heap.prototypes`);
    }
    ids[inv.id] = result.objectId;
  }
  return ids;
}

async function countAll(client, prototypeIds) {
  const counts = {};
  for (const [id, objectId] of Object.entries(prototypeIds)) {
    counts[id] = await countLiveInstances(client, objectId);
  }
  return counts;
}

async function detachedNodeCount(page) {
  // After destroy() + GC, any node still under the container is leaked DOM the
  // framework failed to remove. A structural proxy for the snapshot's
  // detached-node census, cheap enough for the gate.
  return page.evaluate(() => window.__heap.containerNodeCount());
}

// post-GC page footprint — the soft trend, never a gate. JSHeapUsedSize is
// post-GC because settle() just collected; that retained-heap KB is the only
// footprint the reporter classifies. The live node count rides along for the
// standalone smoke output but isn't a classified trend.
async function footprintMetrics(page) {
  const m = await page.evaluate(() => {
    const mem = performance.memory ?? {};
    return {
      jsHeapUsedSize: mem.usedJSHeapSize ?? null,
      nodes: document.getElementsByTagName('*').length,
    };
  });
  return m;
}

/*
  Drive one tree (one built bundle page) end to end. Returns the snapshot object
  collect.js writes to JSON.
*/
export async function runTree({ page, client }) {
  await page.waitForFunction(() => window.__heapReady === true, { timeout: 30_000 });

  const prototypeIds = await resolvePrototypes(client);

  // ── baseline: empty page, settled ──
  await settle(page, client);
  const baseline = await countAll(client, prototypeIds);
  baseline.detachedNodes = await detachedNodeCount(page);

  // ── warmup (excluded): one full cycle to pay one-time JIT/setup ──
  for (let i = 0; i < CHURN.warmupCycles; i++) {
    await churnCycle(page, CHURN.rows);
  }
  await settle(page, client);

  // ── measured churn: N create -> destroy cycles ──
  for (let i = 0; i < CHURN.cycles; i++) {
    await churnCycle(page, CHURN.rows);
  }
  await settle(page, client);
  const afterChurn = await countAll(client, prototypeIds);
  afterChurn.detachedNodes = await detachedNodeCount(page);

  // ── move-vs-removal: a detach+reattach in one task must not leak a scope ──
  await page.evaluate((rows) => window.__heap.moveCycle(rows), CHURN.rows);
  await page.evaluate(() => window.__heap.destroy());
  await settle(page, client);
  const afterMove = await countAll(client, prototypeIds);
  afterMove.detachedNodes = await detachedNodeCount(page);

  // ── footprint scenes: mount, measure post-GC, tear down ──
  const footprint = {};
  for (const op of FOOTPRINT_OPS) {
    await page.evaluate((rows) => {
      window.__heap.mount();
      window.__heap.run(rows);
    }, op.rows);
    await settle(page, client);
    footprint[op.id] = { rows: op.rows, label: op.label, ...(await footprintMetrics(page)) };
    await page.evaluate(() => window.__heap.destroy());
    await settle(page, client);
  }

  return {
    invariants: { baseline, afterChurn, afterMove },
    footprint,
    churn: { cycles: CHURN.cycles, rows: CHURN.rows, warmup: CHURN.warmupCycles },
  };
}

async function churnCycle(page, rows) {
  await page.evaluate((n) => {
    window.__heap.mount();
    window.__heap.run(n);
    window.__heap.clear();
    window.__heap.destroy();
  }, rows);
}

/*
  Zero-dep static file server rooted at the repo, so the bundle page's
  ./dist/<side>/bench-memory.js and any relative source imports resolve. Returns
  { url, close }.
*/
export function serveRepo(root = REPO_ROOT) {
  const types = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.mjs': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.map': 'application/json',
  };
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    const filePath = path.join(root, urlPath);
    // contain traversal to the repo root
    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end();
      return;
    }
    fs.readFile(filePath, (err, buf) => {
      if (err) {
        res.writeHead(404);
        res.end();
        return;
      }
      res.writeHead(200, { 'content-type': types[path.extname(filePath)] ?? 'application/octet-stream' });
      res.end(buf);
    });
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({
        url: `http://127.0.0.1:${port}`,
        close: () => new Promise((r) => server.close(r)),
      });
    });
  });
}

/*
  Launch Chromium, open one page, attach CDP, run the tree. `pageUrl` is a
  served URL (http://...) to the ci-<side>-memory.html page.
*/
export async function withPage(pageUrl, fn) {
  // imported lazily so the pure logic (and its tests) never pulls in playwright
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ args: LAUNCH_ARGS });
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    const client = await context.newCDPSession(page);
    await client.send('HeapProfiler.enable');
    await page.goto(pageUrl, { waitUntil: 'load' });
    return await fn({ page, client, browser });
  }
  finally {
    await browser.close();
  }
}

// ── standalone smoke check ──
async function main() {
  const args = parseArgs(process.argv.slice(2));
  const rows = args.rows ? Number(args.rows) : CHURN.rows;
  let pageUrl = args.page;
  let server = null;

  if (!pageUrl) {
    // default: serve the repo and hit the current memory page
    server = await serveRepo();
    pageUrl = `${server.url}/packages/component/bench/tachometer/ci-current-memory.html`;
  }
  else if (pageUrl.startsWith('/') || pageUrl.startsWith('.')) {
    server = await serveRepo();
    const rel = path.relative(REPO_ROOT, path.resolve(pageUrl)).split(path.sep).join('/');
    pageUrl = `${server.url}/${rel}`;
  }

  console.log(`runner: ${pageUrl} · ${rows} rows · ${CHURN.cycles} cycles`);
  try {
    const result = await withPage(pageUrl, ({ page, client }) => runTree({ page, client }));
    const { baseline, afterChurn, afterMove } = result.invariants;
    console.log('\ninvariant            baseline   afterChurn   afterMove   verdict');
    for (const inv of INVARIANTS) {
      const b = baseline[inv.id];
      const c = afterChurn[inv.id];
      const mv = afterMove[inv.id];
      const verdict = c === b && mv === b ? 'held' : `LEAK +${c - b}`;
      console.log(
        `${inv.id.padEnd(20)} ${String(b).padStart(8)} ${String(c).padStart(12)} ${
          String(mv).padStart(11)
        }   ${verdict}`,
      );
    }
    console.log('\nfootprint:');
    for (const [id, f] of Object.entries(result.footprint)) {
      const kb = f.jsHeapUsedSize != null ? (f.jsHeapUsedSize / 1024).toFixed(0) + ' KB' : 'n/a';
      console.log(`  ${id.padEnd(12)} ${kb}  (${f.nodes} nodes)`);
    }
  }
  finally {
    if (server) { await server.close(); }
  }
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
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

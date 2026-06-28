#!/usr/bin/env node
/*
  Measure one built tree and write a single JSON snapshot. The workflow runs
  this twice — once on the PR head (the current bundle), once on the merge base
  (the baseline bundle) — and hands both files to reporter.js.

  One snapshot bundles the two signals: the browser churn invariants + footprint
  (runner.js) and the Node reactivity micro (reactivity-micro.js).

  Usage:
    node collect.js --root . --label current --out results/current.json
    node collect.js --label baseline --side baseline --out results/baseline.json

  --side selects which built bundle page to drive (current | baseline); defaults
  from --label. Mirrors tools/ci/size/collect.js's CLI shape.
*/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { runMicroChildProcess } from './reactivity-micro.js';
import { runTree, serveRepo, withPage } from './runner.js';
import { CHURN } from './targets.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(dirname, '..', '..', '..');

const args = parseArgs(process.argv.slice(2));
const root = args.root ? path.resolve(args.root) : REPO_ROOT;
const label = args.label ?? 'current';
const side = args.side ?? (label === 'baseline' ? 'baseline' : 'current');
const out = args.out ?? 'memory.json';

const PAGE_REL = `packages/component/bench/tachometer/ci-${side}-memory.html`;

const snapshot = {
  label,
  side,
  churn: { cycles: CHURN.cycles, rows: CHURN.rows, warmup: CHURN.warmupCycles },
  browser: null,
  reactivityMicro: null,
  chrome: null,
};

const server = await serveRepo(root);
try {
  const pageUrl = `${server.url}/${PAGE_REL}`;
  const browserResult = await withPage(pageUrl, async ({ page, client, browser }) => {
    snapshot.chrome = browser.version();
    return runTree({ page, client });
  });
  snapshot.browser = browserResult;
}
finally {
  await server.close();
}

// Node reactivity micro in its own --expose-gc child.
snapshot.reactivityMicro = runMicroChildProcess();

fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
fs.writeFileSync(out, JSON.stringify(snapshot, null, 2));

const { baseline, afterChurn } = snapshot.browser.invariants;
const broken = Object.keys(baseline).filter((id) => afterChurn[id] !== baseline[id]).length;
console.log(
  `${label} (${side}): ${broken} invariant(s) moved after ${CHURN.cycles} cycles · `
    + `reactivity micro ${(snapshot.reactivityMicro.graphBytes / 1024).toFixed(0)} KB`,
);

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

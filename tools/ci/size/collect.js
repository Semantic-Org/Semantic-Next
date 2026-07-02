#!/usr/bin/env node
/*
  Measure one built tree and write a single JSON snapshot. The workflow runs
  this twice — once on the PR head, once on the merge base — and hands both
  files to reporter.js.

  Usage:
    node collect.js --root . --label current --out results/current.json
*/
import fs from 'node:fs';
import path from 'node:path';

import { collectLoc } from './loc.js';
import { measureTargets } from './measure.js';
import { discoverTargets } from './targets.js';
import { TRACKED_EXPORTS } from './targets.js';
import { bundleModules, exportCosts, packageInfo } from './trace.js';

const args = parseArgs(process.argv.slice(2));
const root = args.root ?? process.cwd();
const label = args.label ?? 'current';
const out = args.out ?? 'size.json';

const targets = discoverTargets(root);
const snapshot = {
  label,
  targets: measureTargets(root, targets),
  loc: collectLoc(root),
};

// module attribution for every package bundle, per-export import costs for the
// piecemeal packages. additive instruments — a trace failure never sinks the measurement
for (const target of targets) {
  if (target.group !== 'package' || !target.dir || !snapshot.targets[target.id]?.exists) { continue; }
  const info = packageInfo(root, target.dir);
  if (!info) { continue; }
  try {
    snapshot.targets[target.id].modules = await bundleModules(root, info);
    const tracked = TRACKED_EXPORTS[target.label];
    if (tracked) {
      snapshot.targets[target.id].exports = await exportCosts(root, info, tracked);
    }
  }
  catch (error) {
    console.error(`trace ${target.label}: ${error.message}`);
  }
}

fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
fs.writeFileSync(out, JSON.stringify(snapshot, null, 2));

const measured = Object.values(snapshot.targets).filter((t) => t.exists).length;
console.log(`${label}: ${measured}/${targets.length} bundles measured, ${snapshot.loc.total.code} code lines`);

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

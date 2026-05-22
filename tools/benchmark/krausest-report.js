#!/usr/bin/env node
/*
  Read krausest-history.json.

    node krausest-report.js              latest run's ratio-to-fastest table
    node krausest-report.js diff A B     per-benchmark ratio change A → B,
                                         i.e. did we close or widen the gap

  Ratios come from the primary history (relative signal). For absolute
  medians of a single run, read krausest-runs/<sha>.json.
*/

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const history = JSON.parse(readFileSync(join(HERE, 'krausest-history.json'), 'utf8'));
const [cmd, a, b] = process.argv.slice(2);

if (cmd === 'diff') {
  const ra = find(a);
  const rb = find(b);
  console.log(`${ra.sha} → ${rb.sha}   ratio to fastest competitor, lower is better\n`);
  const benches = [...new Set([...Object.keys(ra.comparison), ...Object.keys(rb.comparison)])].sort();
  for (const bench of benches) {
    const x = ra.comparison[bench]?.ratio;
    const y = rb.comparison[bench]?.ratio;
    if (x == null || y == null) { continue; }
    const mark = y < x ? 'better' : y > x ? 'worse' : 'same';
    console.log(`  ${bench.padEnd(24)} ${x.toFixed(2)}x -> ${y.toFixed(2)}x   ${mark}`);
  }
}
else {
  const run = history.runs.at(-1);
  const mins = (run.wallclock_seconds / 60).toFixed(0);
  console.log(`latest ${run.sha}  ${run.timestamp}  ${mins}m  chrome ${run.chrome_version}`);
  console.log(`${run.msg}\n`);
  console.log('  benchmark                x_fastest  leader');
  for (const bench of Object.keys(run.comparison).sort()) {
    const c = run.comparison[bench];
    console.log(`  ${bench.padEnd(24)} ${c.ratio.toFixed(2)}x      ${c.fastest}`);
  }
}

function find(sha) {
  const r = history.runs.find((x) => x.sha === sha || x.sha.startsWith(sha));
  if (!r) { throw new Error(`no run for ${sha}`); }
  return r;
}

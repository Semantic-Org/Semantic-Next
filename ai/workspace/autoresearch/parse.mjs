#!/usr/bin/env node
// Parse a tachometer JSON file (one suite) and print a per-benchmark
// "this-change" vs "tip-of-tree" percentChange table. Picks the matching
// pair where measurement.entryName is the same.
//
// Usage:
//   node parse.mjs iter-N-ci.json
//   node parse.mjs iter-N-ci.json --json   # machine-readable
import { readFileSync } from 'node:fs';

const file = process.argv[2];
const asJson = process.argv.includes('--json');
if (!file) {
  console.error('Usage: node parse.mjs <tachometer.json> [--json]');
  process.exit(2);
}
const data = JSON.parse(readFileSync(file, 'utf8'));
const benches = data.benchmarks;

// index by name
const byName = new Map();
benches.forEach((b, i) => byName.set(b.name, { i, b }));

const rows = [];
for (let i = 0; i < benches.length; i++) {
  const b = benches[i];
  if (!b.name.startsWith('this-change ')) { continue; }
  const entryName = b.measurement.entryName;
  const tipName = `tip-of-tree [${entryName}]`;
  const tip = byName.get(tipName);
  if (!tip) { continue; }
  const diff = b.differences[tip.i];
  if (!diff) { continue; }
  const pcLow = diff.percentChange.low;
  const pcHigh = diff.percentChange.high;
  const mid = (pcLow + pcHigh) / 2;
  const unsure = (pcLow < 0 && pcHigh > 0);
  const label = unsure
    ? `unsure (${mid >= 0 ? '+' : ''}${mid.toFixed(1)}%)`
    : `${mid >= 0 ? '+' : ''}${mid.toFixed(1)}%`;
  rows.push({
    benchmark: entryName,
    tipMs: (tip.b.mean.low + tip.b.mean.high) / 2,
    curMs: (b.mean.low + b.mean.high) / 2,
    pctLow: pcLow,
    pctHigh: pcHigh,
    pctMid: mid,
    unsure,
    label,
  });
}

if (asJson) {
  console.log(JSON.stringify(rows, null, 2));
}
else {
  console.log('Benchmark           | tip (ms) | cur (ms) | %change vs tip');
  console.log('--------------------+----------+----------+---------------');
  for (const r of rows) {
    console.log(
      r.benchmark.padEnd(20),
      '|',
      r.tipMs.toFixed(2).padStart(8),
      '|',
      r.curMs.toFixed(2).padStart(8),
      '|',
      r.label,
    );
  }
}

/*
  Tests for reporter.js. Run with:
    node --test tools/ci/size/reporter.test.js

  These assert the decision logic (state, summary counts, headline choice,
  per-bundle classification) via the JSON adjunct, and only sample the
  markdown lightly — exact wording is meant to be tuned without breaking
  these.
*/
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const REPORTER = path.join(dirname, 'reporter.js');

function tgt(id, [brotli, gzip, raw], opts = {}) {
  const label = opts.label ?? id.replace(/^(pkg|prim|core)-/, '');
  return {
    id,
    label,
    group: opts.group ?? 'package',
    scope: opts.scope ?? label,
    headline: !!opts.headline,
    exists: true,
    brotli,
    gzip,
    raw,
  };
}

function loc(map) {
  const byScope = {};
  const total = { code: 0, comment: 0, blank: 0, files: 0 };
  for (const [scope, [code, comment = 0]] of Object.entries(map)) {
    byScope[scope] = { code, comment, blank: 0, files: 1 };
    total.code += code;
    total.comment += comment;
    total.files += 1;
  }
  return { total, byScope };
}

function snapshot(targets, locData) {
  const map = {};
  for (const t of targets) { map[t.id] = t; }
  return { label: 'x', targets: map, loc: locData };
}

// Run the real CLI against two snapshots, return parsed outputs.
function run(current, baseline) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'size-reporter-'));
  fs.writeFileSync(path.join(dir, 'current.json'), JSON.stringify(current));
  fs.writeFileSync(path.join(dir, 'baseline.json'), JSON.stringify(baseline));
  fs.writeFileSync(path.join(dir, 'baseline-sha.txt'), 'baseaaaa');
  const out = path.join(dir, 'out');
  execFileSync('node', [
    REPORTER,
    '--results',
    dir,
    '--sha',
    'headbbbb1234',
    '--repo',
    'o/r',
    '--out',
    out,
  ]);
  const json = JSON.parse(fs.readFileSync(path.join(out, 'size-report.json'), 'utf8'));
  const md = fs.readFileSync(path.join(out, 'comment.md'), 'utf8');
  fs.rmSync(dir, { recursive: true, force: true });
  return { json, md };
}

test('a lone growth is a regression headlined by that bundle', () => {
  const cur = snapshot([tgt('pkg-component', [5000, 6000, 15000], { headline: true })], loc({ component: [120, 0] }));
  const base = snapshot([tgt('pkg-component', [4700, 5640, 14000], { headline: true })], loc({ component: [0, 0] }));
  const { json, md } = run(cur, base);
  assert.equal(json.state, 'regression');
  assert.equal(json.summary.grew, 1);
  assert.equal(json.headline, 'pkg-component');
  assert.match(md, /Bundle Analysis/);
  assert.match(md, /component/);
});

test('a lone shrink is an improvement', () => {
  const cur = snapshot([tgt('pkg-utils', [4000, 4800, 12000])], loc({ utils: [0, 0] }));
  const base = snapshot([tgt('pkg-utils', [4600, 5520, 13800])], loc({ utils: [40, 0] }));
  const { json } = run(cur, base);
  assert.equal(json.state, 'improvement');
  assert.equal(json.summary.shrank, 1);
  assert.equal(json.headline, 'pkg-utils');
});

test('identical snapshots are no meaningful change', () => {
  const t = [tgt('pkg-component', [5000, 6000, 15000])];
  const { json, md } = run(snapshot(t, loc({ component: [10, 0] })), snapshot(t, loc({ component: [10, 0] })));
  assert.equal(json.state, 'no-change');
  assert.equal(json.summary.grew, 0);
  assert.equal(json.summary.shrank, 0);
  assert.match(md, /No Meaningful Change/);
});

test('component stays the headline even when another bundle grew more', () => {
  const cur = snapshot([
    tgt('pkg-component', [5300, 6300, 16000], { headline: true }),
    tgt('pkg-reactivity', [9000, 10000, 28000]),
  ], loc({ component: [10, 0], reactivity: [400, 0] }));
  const base = snapshot([
    tgt('pkg-component', [5000, 6000, 15000], { headline: true }),
    tgt('pkg-reactivity', [5000, 6000, 16000] /* grew +4000, far more */),
  ], loc({ component: [0, 0], reactivity: [0, 0] }));
  const { json } = run(cur, base);
  assert.equal(json.headline, 'pkg-component');
  assert.equal(json.state, 'regression');
  assert.equal(json.summary.grew, 2);
});

test('with component flat, the bundle whose package shipped the most code is promoted', () => {
  const cur = snapshot([
    tgt('pkg-component', [5000, 6000, 15000], { headline: true }),
    tgt('pkg-query', [4200, 5000, 13000]),
    tgt('pkg-utils', [4100, 4900, 12500]),
  ], loc({ component: [0, 0], query: [30, 0], utils: [150, 0] }));
  const base = snapshot([
    tgt('pkg-component', [5000, 6000, 15000], { headline: true }),
    tgt('pkg-query', [4000, 4800, 12500]),
    tgt('pkg-utils', [4000, 4800, 12200]),
  ], loc({ component: [0, 0], query: [0, 0], utils: [0, 0] }));
  const { json } = run(cur, base);
  // utils shipped more code (150 vs 30), so it leads even though both grew
  assert.equal(json.headline, 'pkg-utils');
});

test('mixed directions report a mixed state', () => {
  const cur = snapshot([
    tgt('pkg-component', [5300, 6300, 16000], { headline: true }),
    tgt('pkg-specs', [4000, 4800, 12000]),
  ], loc({ component: [10, 0], specs: [-50, 0] }));
  const base = snapshot([
    tgt('pkg-component', [5000, 6000, 15000], { headline: true }),
    tgt('pkg-specs', [4600, 5520, 13800]),
  ], loc({ component: [0, 0], specs: [0, 0] }));
  const { json } = run(cur, base);
  assert.equal(json.state, 'mixed');
  assert.equal(json.summary.grew, 1);
  assert.equal(json.summary.shrank, 1);
});

test('a bundle present only on the head reads as added', () => {
  const cur = snapshot([
    tgt('pkg-component', [5000, 6000, 15000], { headline: true }),
    tgt('pkg-new', [1200, 1400, 4000]),
  ], loc({ component: [0, 0], new: [80, 0] }));
  const base = snapshot([tgt('pkg-component', [5000, 6000, 15000], { headline: true })], loc({ component: [0, 0] }));
  const { json } = run(cur, base);
  const added = json.metrics.find((m) => m.id === 'pkg-new');
  assert.equal(added.status, 'added');
  assert.equal(json.summary.added, 1);
});

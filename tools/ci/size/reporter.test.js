/*
  Tests for reporter.js. Run with:
    node --test tools/ci/size/reporter.test.js

  These assert the decision logic (state, headline choice, largest-increase,
  per-bundle classification) via the JSON adjunct, and sample the markdown
  lightly — exact wording is meant to be tuned without breaking these.
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
    treeShaken: !!opts.treeShaken,
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

function run(current, baseline) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'size-reporter-'));
  fs.writeFileSync(path.join(dir, 'current.json'), JSON.stringify(current));
  fs.writeFileSync(path.join(dir, 'baseline.json'), JSON.stringify(baseline));
  fs.writeFileSync(path.join(dir, 'baseline-sha.txt'), 'baseaaaa');
  const out = path.join(dir, 'out');
  execFileSync('node', [REPORTER, '--results', dir, '--sha', 'headbbbb1234', '--repo', 'o/r', '--out', out]);
  const json = JSON.parse(fs.readFileSync(path.join(out, 'size-report.json'), 'utf8'));
  const md = fs.readFileSync(path.join(out, 'comment.md'), 'utf8');
  fs.rmSync(dir, { recursive: true, force: true });
  return { json, md };
}

// brotli grows past the regression byte threshold (>= 5120)
test('a large single growth is a regression', () => {
  const cur = snapshot(
    [tgt('pkg-component', [56000, 60000, 170000], { headline: true })],
    loc({ component: [200, 0] }),
  );
  const base = snapshot([tgt('pkg-component', [50000, 54000, 155000], { headline: true })], loc({ component: [0, 0] }));
  const { json } = run(cur, base);
  assert.equal(json.state, 'regression');
  assert.equal(json.headline, 'pkg-component');
});

// crosses the warning threshold (>= 512 B / >= 2%) but not regression, no offsetting shrink
test('a moderate growth with no offset is a warning', () => {
  const cur = snapshot([tgt('pkg-utils', [15700, 17000, 44000])], loc({ utils: [60, 0] }));
  const base = snapshot([tgt('pkg-utils', [15000, 16200, 42000])], loc({ utils: [0, 0] }));
  const { json } = run(cur, base);
  assert.equal(json.state, 'warning');
  assert.equal(json.headline, 'pkg-utils');
});

// a small primitive at +10%+ is a warning, not a regression — percent alone
// can't escalate to regression without a real absolute move
test('a high-percent but small-absolute growth stays a warning', () => {
  const cur = snapshot(
    [tgt('prim-button', [13200, 16500, 137000], { group: 'primitive', scope: 'design-system' })],
    loc({ 'design-system': [40, 0] }),
  );
  const base = snapshot(
    [tgt('prim-button', [12000, 15100, 128500], { group: 'primitive', scope: 'design-system' })],
    loc({ 'design-system': [0, 0] }),
  );
  const { json } = run(cur, base);
  assert.equal(json.state, 'warning'); // +1.2 KB / +10% — not a regression
});

test('growth alongside a shrink is mixed', () => {
  const cur = snapshot([
    tgt('pkg-component', [51000, 60000, 160000], { headline: true }),
    tgt('pkg-specs', [38000, 45000, 150000]),
  ], loc({ component: [20, 0], specs: [-40, 0] }));
  const base = snapshot([
    tgt('pkg-component', [50000, 59000, 158000], { headline: true }),
    tgt('pkg-specs', [40000, 47000, 156000]),
  ], loc({ component: [0, 0], specs: [0, 0] }));
  const { json } = run(cur, base);
  assert.equal(json.state, 'mixed');
});

test('only shrinks is an improvement', () => {
  const cur = snapshot([tgt('pkg-utils', [14000, 15000, 40000])], loc({ utils: [0, 0] }));
  const base = snapshot([tgt('pkg-utils', [15000, 16200, 42000])], loc({ utils: [-40, 0] }));
  const { json } = run(cur, base);
  assert.equal(json.state, 'improvement');
});

// a sub-JND wiggle (< 128 B and < 0.5%) is not a change
test('a sub-JND delta is no meaningful change', () => {
  const cur = snapshot([tgt('pkg-component', [50050, 54000, 155000], { headline: true })], loc({ component: [0, 0] }));
  const base = snapshot([tgt('pkg-component', [50000, 54000, 155000], { headline: true })], loc({ component: [0, 0] }));
  const { json, md } = run(cur, base);
  assert.equal(json.state, 'no-change');
  assert.equal(json.summary.unchanged, 1);
  assert.match(md, /No Meaningful Change|no meaningful change/i);
});

test('comments-only change is reassured as such', () => {
  const t = [tgt('pkg-templating', [28600, 32000, 95000])];
  const { json, md } = run(snapshot(t, loc({ templating: [0, 200] })), snapshot(t, loc({ templating: [0, 0] })));
  assert.equal(json.state, 'no-change');
  assert.match(md, /comments-only/);
});

test('component is the headline and the bigger grower is the largest increase', () => {
  const cur = snapshot([
    tgt('pkg-component', [50600, 59000, 159000], { headline: true }),
    tgt('pkg-renderer', [47000, 52000, 162000]),
  ], loc({ component: [10, 0], renderer: [120, 0] }));
  const base = snapshot([
    tgt('pkg-component', [50000, 58400, 158000], { headline: true }),
    tgt('pkg-renderer', [43000, 48000, 151000]),
  ], loc({ component: [0, 0], renderer: [0, 0] }));
  const { json } = run(cur, base);
  assert.equal(json.headline, 'pkg-component');
  assert.equal(json.largest_increase, 'pkg-renderer');
  assert.equal(json.state, 'warning');
});

test('with component flat, the bundle whose package shipped the most code is promoted', () => {
  const cur = snapshot([
    tgt('pkg-component', [50000, 59000, 158000], { headline: true }),
    tgt('pkg-query', [4600, 5000, 13000]),
    tgt('pkg-utils', [4700, 5100, 13200]),
  ], loc({ component: [0, 0], query: [30, 0], utils: [150, 0] }));
  const base = snapshot([
    tgt('pkg-component', [50000, 59000, 158000], { headline: true }),
    tgt('pkg-query', [4000, 4400, 12000]),
    tgt('pkg-utils', [4000, 4400, 12000]),
  ], loc({ component: [0, 0], query: [0, 0], utils: [0, 0] }));
  const { json } = run(cur, base);
  assert.equal(json.headline, 'pkg-utils');
});

// a tree-shaken whole-package bundle (utils) is an upper bound — it grows in
// the report but does not raise the banner, since real consumers tree-shake
test('a tree-shaken package growth does not drive the banner', () => {
  const cur = snapshot([
    tgt('pkg-component', [50000, 59000, 158000], { headline: true }),
    tgt('pkg-utils', [16000, 17500, 45000], { treeShaken: true }),
  ], loc({ component: [0, 0], utils: [120, 0] }));
  const base = snapshot([
    tgt('pkg-component', [50000, 59000, 158000], { headline: true }),
    tgt('pkg-utils', [15000, 16200, 42000], { treeShaken: true }),
  ], loc({ component: [0, 0], utils: [0, 0] }));
  const { json, md } = run(cur, base);
  assert.equal(json.state, 'no-change'); // +1 KB utils alone is not a regression
  assert.equal(json.headline, 'pkg-component'); // not promoted to utils
  assert.match(md, /tree-shaken|upper bound/i);
});

// a non-flagged standalone package (reactivity) is a real signal and does drive severity
test('a standalone package growth is a real warning', () => {
  const cur = snapshot([tgt('pkg-reactivity', [5700, 6200, 17000])], loc({ reactivity: [40, 0] }));
  const base = snapshot([tgt('pkg-reactivity', [5000, 5400, 15000])], loc({ reactivity: [0, 0] }));
  const { json } = run(cur, base);
  assert.equal(json.state, 'warning');
  assert.equal(json.headline, 'pkg-reactivity');
});

test('a bundle present only on the head reads as added', () => {
  const cur = snapshot([
    tgt('pkg-component', [50000, 59000, 158000], { headline: true }),
    tgt('pkg-new', [1200, 1400, 4000]),
  ], loc({ component: [0, 0], new: [80, 0] }));
  const base = snapshot([tgt('pkg-component', [50000, 59000, 158000], { headline: true })], loc({ component: [0, 0] }));
  const { json } = run(cur, base);
  const added = json.metrics.find((m) => m.id === 'pkg-new');
  assert.equal(added.status, 'added');
  assert.equal(json.summary.added, 1);
});

test('security — malicious label, group, title, and baseline sha are neutralized', () => {
  // On a fork PR the artifact (labels, groups, baseline-sha) and the commit
  // title are attacker-controlled; none may inject markup into the comment.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'size-reporter-sec-'));
  const opts = { headline: true, label: 'ev`il|lbl', group: 'grp [x](http://evil)' };
  const cur = snapshot([tgt('pkg-component', [56000, 60000, 170000], opts)], loc({ component: [200, 0] }));
  const base = snapshot([tgt('pkg-component', [50000, 54000, 155000], opts)], loc({ component: [0, 0] }));
  fs.writeFileSync(path.join(dir, 'current.json'), JSON.stringify(cur));
  fs.writeFileSync(path.join(dir, 'baseline.json'), JSON.stringify(base));
  fs.writeFileSync(path.join(dir, 'baseline-sha.txt'), 'notahex) [x](http://evil)');
  const out = path.join(dir, 'out');
  execFileSync('node', [
    REPORTER,
    '--results',
    dir,
    '--sha',
    'headbbbb1234',
    '--repo',
    'o/r',
    '--msg',
    '[pwn](https://evil.example) <img src=x>',
    '--out',
    out,
  ]);
  const md = fs.readFileSync(path.join(out, 'comment.md'), 'utf8');
  fs.rmSync(dir, { recursive: true, force: true });
  assert.ok(md.includes('evillbl'), 'label rendered with backtick/pipe stripped');
  assert.ok(!md.includes('ev`il|lbl'), 'backtick and pipe stripped from label');
  assert.ok(md.includes('grp \\[x\\]'), 'group brackets escaped — no live link');
  assert.ok(md.includes('\\[pwn\\]'), 'title brackets escaped — no live link');
  assert.ok(md.includes('&lt;img src=x'), 'raw HTML entity-encoded in title');
  assert.ok(!md.includes('<img src=x'), 'no raw HTML tag survives');
  assert.ok(!md.includes('/commit/notahex'), 'non-hex baseline sha is not linked as a commit');
  assert.ok(md.includes('/tree/main'), 'base falls back to the ref tree');
});

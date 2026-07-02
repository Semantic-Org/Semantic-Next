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

// export entry in the new traced shape: distinct graph unless shared is given
function exp(cost, graph) {
  return { cost, graph: graph ?? `g${cost}` };
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

/* ------------------------- trace sections ------------------------- */

test('attribution renders as a from column on changed bundles', () => {
  const head = tgt('pkg-component', [50000, 56000, 170000], { headline: true });
  const base = tgt('pkg-component', [49600, 55700, 169000], { headline: true });
  head.modules = { 'utils/strings.js': 5000, 'component/index.js': 900 };
  base.modules = { 'utils/strings.js': 3900, 'component/index.js': 900 };
  const { json: report, md } = run(snapshot([head], loc({})), snapshot([base], loc({})));
  const metric = report.metrics.find((m) => m.id === 'pkg-component');
  assert.equal(metric.moduleDeltas.length, 1);
  assert.equal(metric.moduleDeltas[0].key, 'utils/strings.js');
  assert.equal(metric.moduleDeltas[0].delta, 1100);
  assert.ok(md.includes('| bundle | brotli | Δ brotli | change | from |'), 'from column added');
  assert.ok(md.includes('`utils/strings.js` 100%'), 'source named with share');
});

test('the from column stays hidden when no bundle changed', () => {
  const head = tgt('pkg-component', [50000, 56000, 170000]);
  const base = tgt('pkg-component', [50000, 56000, 170000]);
  head.modules = { 'utils/strings.js': 5000 };
  base.modules = { 'utils/strings.js': 3900 };
  const { md } = run(snapshot([head], loc({})), snapshot([base], loc({})));
  assert.ok(!md.includes('| from |'), 'no from column without a changed bundle');
});

test('tracked import costs report movers, surface changes, and the verdict line past the floor', () => {
  const head = tgt('pkg-utils', [17000, 19000, 50000], { treeShaken: true });
  const base = tgt('pkg-utils', [17000, 19000, 50000], { treeShaken: true });
  head.exports = { toNumber: exp(1072, 'coercion'), toBoolean: exp(900, 'bool'), brandNew: exp(300, 'fresh') };
  base.exports = { toNumber: exp(366, 'coercion'), toBoolean: exp(900, 'bool'), oldGone: exp(250, 'gone') };
  const { json: report, md } = run(snapshot([head], loc({})), snapshot([base], loc({})));
  const metric = report.metrics.find((m) => m.id === 'pkg-utils');
  assert.equal(metric.exportDeltas.changed[0].name, 'toNumber');
  assert.equal(metric.exportDeltas.changed[0].delta, 706);
  assert.equal(metric.exportDeltas.added[0].name, 'brandNew');
  assert.equal(metric.exportDeltas.removed[0].name, 'oldGone');
  assert.ok(md.includes('Tracked import costs'), 'tracked section renders');
  assert.ok(md.includes('Import costs moved'), 'verdict line renders past the floor');
  assert.ok(md.includes('| `utils` | `brandNew` | 300 B | new |'), 'added export rendered');
});

test('export movement below the verdict floor stays out of the alert', () => {
  const head = tgt('pkg-utils', [17000, 19000, 50000], { treeShaken: true });
  const base = tgt('pkg-utils', [17000, 19000, 50000], { treeShaken: true });
  head.exports = { small: exp(400, 's') };
  base.exports = { small: exp(350, 's') };
  const { md } = run(snapshot([head], loc({})), snapshot([base], loc({})));
  assert.ok(!md.includes('Import costs moved'), 'no verdict line for a 50 B mover');
  assert.ok(md.includes('Tracked import costs'), 'section still lists the mover');
});

test('snapshots without trace fields render exactly as before', () => {
  const head = tgt('pkg-component', [50000, 56000, 170000]);
  const base = tgt('pkg-component', [49600, 55700, 169000]);
  const { md } = run(snapshot([head], loc({})), snapshot([base], loc({})));
  // pin the full section inventory, not just the absence of the new headers —
  // a placeholder or reordering for traceless snapshots must fail this
  const sections = [...md.matchAll(/<summary>([^<:(]+)/g)].map((m) => m[1].trim());
  assert.deepEqual(sections, ['LOC by scope', 'All 1 bundles, gzip, and raw sizes']);
  assert.ok(md.includes('| bundle | brotli | Δ brotli | change |'), 'legacy table header');
  assert.ok(!md.includes('| from |'), 'no from column for traceless snapshots');
  // and pin the alert block verbatim so verdict drift for old snapshots is loud
  const alert = md.split('\n').filter((l) => l.startsWith('> ')).join('\n');
  assert.equal(
    alert,
    '> [!WARNING]\n> `component` grew **+400 B** brotli to 48.8 KB (+0.8%) across **+0 shipped LOC**.',
  );
});

test('a one-sided trace failure degrades to no section, never a mass surface diff', () => {
  const head = tgt('pkg-utils', [17000, 19000, 50000], { treeShaken: true });
  const base = tgt('pkg-utils', [17000, 19000, 50000], { treeShaken: true });
  base.exports = { a: exp(100), b: exp(200), c: exp(300) };
  base.modules = { 'utils/a.js': 500 };
  const { md } = run(snapshot([head], loc({})), snapshot([base], loc({})));
  assert.ok(!md.includes('Tracked import costs'), 'no tracked section from a head-side trace failure');
  assert.ok(!md.includes('removed'), 'no false removed rows');
});

test('exports named after Object.prototype members diff correctly', () => {
  const head = tgt('pkg-utils', [17000, 19000, 50000], { treeShaken: true });
  const base = tgt('pkg-utils', [17000, 19000, 50000], { treeShaken: true });
  head.exports = { keep: exp(100, 'k') };
  base.exports = { keep: exp(100, 'k'), toString: exp(800, 'proto') };
  const { json, md } = run(snapshot([head], loc({})), snapshot([base], loc({})));
  const metric = json.metrics.find((m) => m.id === 'pkg-utils');
  assert.equal(metric.exportDeltas.removed[0].name, 'toString');
  assert.ok(md.includes('| `utils` | `toString` | — | removed |'), 'removed row rendered');
});

test('poisoned byte values in a snapshot never reach the comment', () => {
  const head = tgt('pkg-utils', [17000, 19000, 50000], { treeShaken: true });
  const base = tgt('pkg-utils', [17000, 19000, 50000], { treeShaken: true });
  head.exports = { real: exp(400, 'r'), evil: { cost: '](http://evil) <img src=x>', graph: 'r' } };
  base.exports = { real: exp(100, 'r'), evil: exp(50, 'r') };
  const { md } = run(snapshot([head], loc({})), snapshot([base], loc({})));
  assert.ok(!md.includes('evil)'), 'crafted string filtered before rendering');
  assert.ok(!md.includes('<img'), 'no HTML from byte fields');
  assert.ok(md.includes('| `utils` | `real` | 400 B | +300 B (+300%) |'), 'legit rows still render');
});

test('a co-moving group renders one row named by its master, slaves silent', () => {
  const head = tgt('pkg-query', [39000, 44000, 130000], { treeShaken: true });
  const base = tgt('pkg-query', [39000, 44000, 130000], { treeShaken: true });
  // six exports, one graph — the engine moved +1450 for all of them
  for (
    const [name, cost] of [
      ['$', 40190],
      ['$$', 40190],
      ['Query', 40195],
      ['useAlias', 40260],
      ['exportGlobals', 40300],
      ['restoreGlobals', 40310],
    ]
  ) {
    head.exports = head.exports ?? {};
    base.exports = base.exports ?? {};
    head.exports[name] = exp(cost, 'engine');
    base.exports[name] = exp(cost - 1450, 'engine');
  }
  const { json, md } = run(snapshot([head], loc({})), snapshot([base], loc({})));
  const metric = json.metrics.find((m) => m.id === 'pkg-query');
  assert.equal(metric.exportDeltas.changed.length, 1, 'one row per group');
  assert.equal(metric.exportDeltas.changed[0].name, '$', 'cheapest-shortest member is master');
  assert.equal(metric.exportDeltas.changed[0].groupSize, 6);
  assert.ok(md.includes('| `query` | `$` |'), 'master rendered');
  assert.ok(!md.includes('$$'), 'slaves never rendered');
  assert.ok(md.includes('(+4%)'), 'percent shown on the delta');
});

test('a removed group renders once through its base master', () => {
  const head = tgt('pkg-utils', [17000, 19000, 50000], { treeShaken: true });
  const base = tgt('pkg-utils', [17000, 19000, 50000], { treeShaken: true });
  head.exports = { stay: exp(100, 'k') };
  base.exports = { stay: exp(100, 'k'), gone: exp(300, 'dead'), goneAlias: exp(305, 'dead') };
  const { json, md } = run(snapshot([head], loc({})), snapshot([base], loc({})));
  const metric = json.metrics.find((m) => m.id === 'pkg-utils');
  assert.equal(metric.exportDeltas.removed.length, 1, 'one removed row for the group');
  assert.equal(metric.exportDeltas.removed[0].name, 'gone');
  assert.ok(!md.includes('goneAlias'), 'removed slave not listed');
});

test('re-mastering anchors the delta on a both-sides member, not the rename', () => {
  const head = tgt('pkg-utils', [17000, 19000, 50000], { treeShaken: true });
  const base = tgt('pkg-utils', [17000, 19000, 50000], { treeShaken: true });
  // aa is new and cheapest (becomes master), bb existed both sides and did not move
  head.exports = { aa: exp(90, 'fam'), bb: exp(100, 'fam') };
  base.exports = { bb: exp(100, 'fam') };
  const { json } = run(snapshot([head], loc({})), snapshot([base], loc({})));
  const metric = json.metrics.find((m) => m.id === 'pkg-utils');
  assert.equal(metric.exportDeltas, null, 'no false growth from a new cheaper member');
});

test('hostile export and module names render inert', () => {
  const head = tgt('pkg-utils', [17000, 19000, 50000], { treeShaken: true });
  const base = tgt('pkg-utils', [17000, 19000, 50000], { treeShaken: true });
  head.exports = { 'evil`|name': exp(5000, 'e') };
  base.exports = { 'evil`|name': exp(100, 'e') };
  head.modules = { 'bad`|[x](y).js': 900 };
  base.modules = { 'bad`|[x](y).js': 100 };
  const headB = tgt('pkg-b', [50000, 56000, 170000]);
  const baseB = tgt('pkg-b', [49000, 55000, 168000]);
  headB.modules = { 'bad`|[x](y).js': 2000 };
  baseB.modules = { 'bad`|[x](y).js': 100 };
  const { md } = run(snapshot([head, headB], loc({})), snapshot([base, baseB], loc({})));
  assert.ok(!md.includes('evil`|name'), 'backtick and pipe stripped from export name');
  assert.ok(md.includes('evilname'), 'export still listed');
  assert.ok(!md.includes('bad`|'), 'module key stripped of code-span breakers');
});

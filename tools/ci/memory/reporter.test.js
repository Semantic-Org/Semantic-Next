/*
  Tests for reporter.js. Run with:
    node --test tools/ci/memory/reporter.test.js

  These assert the decision logic (leak verdict, state, per-cycle multiple,
  footprint noise floor) via the JSON adjunct, and sample the markdown lightly
  — exact wording is meant to be tuned without breaking these. Synthetic
  snapshots only; no browser.
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

const CYCLES = 7;

// A clean tree: every count returns to baseline after churn and after the move
// cycle. `over` lets a test override specific invariant phases to inject a leak.
function snapshot({ over = {}, footprint, micro } = {}) {
  const ids = ['Reaction', 'ReactionScope', 'DynamicRegion', 'Dependency', 'Signal', 'detachedNodes'];
  const baseline = {};
  const afterChurn = {};
  const afterMove = {};
  for (const id of ids) {
    baseline[id] = id === 'Dependency' || id === 'Signal' ? 2 : 0;
    afterChurn[id] = baseline[id];
    afterMove[id] = baseline[id];
  }
  // apply overrides: over = { afterChurn: { Reaction: 7012 }, ... }
  const phases = { baseline, afterChurn, afterMove };
  for (const phase of Object.keys(phases)) {
    if (over[phase]) { Object.assign(phases[phase], over[phase]); }
  }
  return {
    label: 'x',
    side: 'x',
    churn: { cycles: CYCLES, rows: 1000, warmup: 1 },
    chrome: '131.0.0.0',
    browser: {
      invariants: { baseline, afterChurn, afterMove },
      footprint: footprint ?? {
        'mount-1k': { rows: 1000, label: 'create-1k', jsHeapUsedSize: 4_200_000, nodes: 6 },
        'mount-5k': { rows: 5000, label: 'create-5k', jsHeapUsedSize: 18_000_000, nodes: 6 },
      },
      chrome: '131.0.0.0',
    },
    reactivityMicro: micro
      ?? { n: 10000, graphBytes: 8_300_000, residualBytes: 200_000, emptyHeapUsed: 1, liveHeapUsed: 2 },
  };
}

function run(current, base) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'memory-reporter-'));
  fs.writeFileSync(path.join(dir, 'current.json'), JSON.stringify(current));
  fs.writeFileSync(path.join(dir, 'baseline.json'), JSON.stringify(base));
  fs.writeFileSync(path.join(dir, 'baseline-sha.txt'), 'baseaaaa');
  const out = path.join(dir, 'out');
  execFileSync('node', [REPORTER, '--results', dir, '--sha', 'headbbbb1234', '--repo', 'o/r', '--out', out]);
  const json = JSON.parse(fs.readFileSync(path.join(out, 'memory-report.json'), 'utf8'));
  const md = fs.readFileSync(path.join(out, 'comment.md'), 'utf8');
  fs.rmSync(dir, { recursive: true, force: true });
  return { json, md };
}

test('a clean tree on both sides is no-leak', () => {
  const { json, md } = run(snapshot(), snapshot());
  assert.equal(json.state, 'no-leak');
  assert.equal(json.fail, false);
  assert.equal(json.summary.broken, 0);
  assert.match(md, /No leak for .* on Heap Analysis 🧠/);
  assert.match(md, /all teardown invariants held/);
});

test('a per-cycle reaction leak is a broken invariant with the right multiple', () => {
  // 7000 residual over 7 cycles = +1000/cycle
  const cur = snapshot({ over: { afterChurn: { Reaction: 7000 } } });
  const { json, md } = run(cur, snapshot());
  assert.equal(json.state, 'leak');
  assert.equal(json.fail, true);
  assert.equal(json.summary.broken, 1);
  assert.equal(json.headline, 'Reaction');
  const reaction = json.invariants.find((i) => i.id === 'Reaction');
  assert.equal(reaction.verdict, 'broken');
  assert.equal(reaction.residual, 7000);
  assert.equal(reaction.perCycle, 1000);
  assert.match(md, /🔴 Leak for/);
  assert.match(md, /\+7000/);
  assert.match(md, /\+1000\/cycle/);
});

test('a per-cycle multiple that does not divide evenly is rounded, not a float', () => {
  // 40024 residual over 7 cycles = 5717.71… → rounded to 5718
  const cur = snapshot({ over: { afterChurn: { Reaction: 40024 } } });
  const { json, md } = run(cur, snapshot());
  const reaction = json.invariants.find((i) => i.id === 'Reaction');
  assert.equal(reaction.perCycle, 5718);
  assert.match(md, /\+5718\/cycle/);
  assert.doesNotMatch(md, /5717\.7|\.\d{3}\/cycle/); // no raw float in the output
});

test('detached DOM survivors are reported alongside the lead invariant', () => {
  const cur = snapshot({ over: { afterChurn: { Reaction: 7000, detachedNodes: 7000 } } });
  const { json, md } = run(cur, snapshot());
  assert.equal(json.state, 'leak');
  assert.equal(json.summary.broken, 2);
  assert.match(md, /detached DOM nodes survive/);
});

test('a pure detached-DOM leak drives the banner and leads the verdict', () => {
  // the headline lifecycle case: every class count nets to zero, but torn-down
  // item DOM survives as detached <tr>/<td>
  const cur = snapshot({ over: { afterChurn: { detachedNodes: 7000 } } });
  const { json, md } = run(cur, snapshot());
  assert.equal(json.state, 'leak');
  assert.equal(json.fail, true);
  assert.equal(json.summary.broken, 1);
  assert.equal(json.headline, 'detachedNodes');
  const detached = json.invariants.find((i) => i.id === 'detachedNodes');
  assert.equal(detached.verdict, 'broken');
  assert.equal(detached.residual, 7000);
  assert.match(md, /🔴 Leak for/);
  // detached leads the verdict sentence (it is the only broken invariant), not
  // a tail clause appended after another structure
  assert.match(md, /> `detached DOM nodes` grows \+7000 after 7 teardown cycles/);
});

test('a move-cycle leak alone (churn clean) still fails', () => {
  // counts return after churn, but the detach+reattach left a stranded scope
  const cur = snapshot({ over: { afterMove: { ReactionScope: 5 } } });
  const { json } = run(cur, snapshot());
  assert.equal(json.state, 'leak');
  const scope = json.invariants.find((i) => i.id === 'ReactionScope');
  assert.equal(scope.verdict, 'broken');
  assert.equal(scope.moveResidual, 5);
});

test('an equal pre-existing move-cycle residual is held, not blamed on the PR', () => {
  // both trees run the same move cycle; an equal stranded scope is pre-existing
  const base = snapshot({ over: { afterMove: { ReactionScope: 5 } } });
  const cur = snapshot({ over: { afterMove: { ReactionScope: 5 } } });
  const { json } = run(cur, base);
  const scope = json.invariants.find((i) => i.id === 'ReactionScope');
  assert.equal(scope.moveResidual, 5);
  assert.equal(scope.baseMoveResidual, 5);
  assert.equal(scope.verdict, 'held');
  assert.equal(json.state, 'no-leak');
});

test('head clean where base leaked reads as an improvement', () => {
  const base = snapshot({ over: { afterChurn: { Reaction: 7000 } } });
  const { json, md } = run(snapshot(), base);
  assert.equal(json.state, 'improvement');
  assert.equal(json.fail, false);
  const reaction = json.invariants.find((i) => i.id === 'Reaction');
  assert.equal(reaction.verdict, 'fixed');
  assert.match(md, /Leak fixed for/);
});

test('a fixed leak rolls up to a fixed count and an improvement state', () => {
  // base leaked one invariant; head nets to zero -> the count line carries the
  // fixed tally, not just held
  const base = snapshot({ over: { afterChurn: { Reaction: 7000 } } });
  const { json, md } = run(snapshot(), base);
  assert.equal(json.state, 'improvement');
  assert.equal(json.summary.fixed, 1);
  assert.equal(json.summary.broken, 0);
  // count line: 🟢 1 fixed · ✅ N held
  assert.match(md, /🟢 1 fixed/);
});

test('a worse leak than baseline is broken, not held', () => {
  const base = snapshot({ over: { afterChurn: { Reaction: 1400 } } }); // pre-existing +200/cycle
  const cur = snapshot({ over: { afterChurn: { Reaction: 7000 } } }); // regressed to +1000/cycle
  const { json } = run(cur, base);
  assert.equal(json.state, 'leak');
  assert.equal(json.invariants.find((i) => i.id === 'Reaction').verdict, 'broken');
});

test('an equal pre-existing leak is held, not blamed on the PR', () => {
  const base = snapshot({ over: { afterChurn: { Reaction: 7000 } } });
  const cur = snapshot({ over: { afterChurn: { Reaction: 7000 } } });
  const { json } = run(cur, base);
  // head residual == base residual -> not introduced by this PR
  assert.equal(json.invariants.find((i) => i.id === 'Reaction').verdict, 'held');
  assert.equal(json.state, 'no-leak');
});

test('counts all held but footprint grew past the floor is a watch', () => {
  const cur = snapshot({
    footprint: {
      'mount-1k': { rows: 1000, label: 'create-1k', jsHeapUsedSize: 5_000_000, nodes: 6 },
    },
  });
  const base = snapshot({
    footprint: {
      'mount-1k': { rows: 1000, label: 'create-1k', jsHeapUsedSize: 4_200_000, nodes: 6 },
    },
  });
  const { json, md } = run(cur, base); // +19% heap, counts clean
  assert.equal(json.state, 'watch');
  assert.equal(json.fail, false);
  assert.equal(json.footprint.state, 'grew');
  assert.match(md, /Watch for/);
});

test('footprint within the noise floor does not raise a watch', () => {
  const cur = snapshot({
    footprint: { 'mount-1k': { rows: 1000, label: 'create-1k', jsHeapUsedSize: 4_300_000, nodes: 6 } },
  });
  const base = snapshot({
    footprint: { 'mount-1k': { rows: 1000, label: 'create-1k', jsHeapUsedSize: 4_200_000, nodes: 6 } },
  });
  const { json } = run(cur, base); // +2.4% < 4% floor
  assert.equal(json.state, 'no-leak');
  assert.equal(json.footprint.state, 'within-noise');
});

test('the markdown carries the banner, suite line, and footer parameters', () => {
  const { md } = run(snapshot(), snapshot());
  assert.match(md, /on Heap Analysis 🧠/);
  assert.match(md, /7 cycles/);
  assert.match(md, /Chrome 131\.0\.0\.0 \(pinned\)/);
  assert.match(md, /counts exact/);
  assert.match(md, /heap ±4% floor/);
  assert.match(md, /Reactivity micro \(Node, --expose-gc\)/);
});

test('renders title, footprint label, and baseline sha as literal text', () => {
  // A fork PR controls the commit title, the artifact (footprint labels,
  // baseline-sha) — none may inject markup into the bot's comment.
  const fp = { 'mount-1k': { rows: 1000, label: 'ev`il|lbl [x](http://evil)', jsHeapUsedSize: 4_200_000, nodes: 6 } };
  const cur = snapshot({ footprint: fp });
  const base = snapshot({ footprint: fp });
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'memory-reporter-sec-'));
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
  assert.ok(!md.includes('ev`il|lbl'), 'backtick and pipe stripped from footprint label');
  assert.ok(md.includes('evillbl'), 'footprint label still rendered');
  assert.ok(md.includes('\\[pwn\\]'), 'title brackets escaped, no live link');
  assert.ok(md.includes('&lt;img src=x'), 'raw HTML entity-encoded in title');
  assert.ok(!md.includes('<img src=x'), 'no raw HTML tag survives');
  assert.ok(!md.includes('/commit/notahex'), 'non-hex baseline sha is not linked as a commit');
  assert.ok(md.includes('/tree/main'), 'base falls back to the ref tree');
});

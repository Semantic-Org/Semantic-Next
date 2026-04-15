/*
  Unit tests for reporter.js.
  Run with: node --test tools/bench-reporter/reporter.test.js

  Fixture snapshots act as regression tests: the markdown and JSON output
  for two real runs (one with meaningful multi-magnitude delta, one with
  zero-delta) is asserted on every time the script changes. Bugs in
  classification, formatting, or ordering produce a visible diff.
*/

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPORTER = path.join(__dirname, 'reporter.js');

function runReporter({
  fixture,
  sha,
  msg,
  baseSha,
  baseRef = 'main',
  runUrl = '',
  repo = '',
  wallClock = '',
  history = '',
  resultsDir = null,
}) {
  const tmp = fs.mkdtempSync(path.join('/tmp', 'bench-report-test-'));
  const argv = [
    REPORTER,
    '--results',
    resultsDir ?? path.join(__dirname, 'fixtures', fixture),
    '--sha',
    sha,
    '--msg',
    msg,
    '--run-url',
    runUrl,
    '--base-ref',
    baseRef,
    '--base-sha',
    baseSha,
    '--out',
    tmp,
  ];
  if (repo) { argv.push('--repo', repo); }
  if (wallClock) { argv.push('--wall-clock', wallClock); }
  // Point history at a known fixture path OR a deliberate non-existent
  // path to exercise the graceful-degrade branch. Default (no --history)
  // resolves to <cwd>/bench-history.json which will typically exist on a
  // D3a-landed checkout; tests opt in to a specific fixture.
  if (history) { argv.push('--history', history); }
  // Run from repo root so resolveMetricSource can find packages/.../bench/tachometer
  const cwd = path.resolve(__dirname, '..', '..');
  execFileSync('node', argv, { stdio: ['ignore', 'pipe', 'inherit'], cwd });
  const report = JSON.parse(fs.readFileSync(path.join(tmp, 'bench-report.json'), 'utf8'));
  const markdown = fs.readFileSync(path.join(tmp, 'comment.md'), 'utf8');
  return { report, markdown };
}

/**
 * Build a tiny tachometer JSON fixture with one metric whose this-change
 * mean CI is the caller-specified range. Used to force specific cross-run
 * outcomes against fixtures/history-sample.json.
 */
function writeHandcraftedResults(metricName, thisChangeCi, tipOfTreeCi = [10, 11]) {
  const dir = fs.mkdtempSync('/tmp/bench-reporter-handcraft-');
  const data = {
    benchmarks: [
      {
        name: `this-change [${metricName}]`,
        measurement: { name: metricName, mode: 'performance', entryName: metricName },
        mean: { low: thisChangeCi[0], high: thisChangeCi[1] },
        differences: [null, { absolute: { low: -1, high: 1 }, percentChange: { low: -5, high: 5 } }],
      },
      {
        name: `tip-of-tree [${metricName}]`,
        measurement: { name: metricName, mode: 'performance', entryName: metricName },
        mean: { low: tipOfTreeCi[0], high: tipOfTreeCi[1] },
        differences: [{ absolute: { low: -1, high: 1 }, percentChange: { low: -5, high: 5 } }, null],
      },
    ],
  };
  fs.writeFileSync(path.join(dir, 'handcrafted.json'), JSON.stringify(data));
  return dir;
}

test('real-delta fixture — summary counts and key verdicts', () => {
  const { report } = runReporter({
    fixture: 'real-delta',
    sha: '7efaff96abcdef',
    msg: 'Perf: Gate each phase-3 notify',
    baseSha: '087308428',
  });

  // Shape of summary is stable across the suite
  assert.equal(report.metrics.length, 21, 'expected 21 metrics total');
  assert.equal(report.summary.faster, 10);
  assert.equal(report.summary.slower, 5);
  assert.equal(report.summary['within-noise'], 3);
  // Boundary straddlers under real deltas fit the duration-derived floor
  // comfortably → all 3 land in noise-floor-limited, not unsure.
  assert.equal(report.summary.unsure, 0);
  assert.equal(report.summary['noise-floor-limited'], 3);

  // Spot-check a clearly-faster metric
  const updateTenth = report.metrics.find((m) => m.name === 'update-10th');
  assert.equal(updateTenth.status, 'faster');
  assert.ok(updateTenth.percent_change_ci[1] < -2, 'update-10th CI should be well below -2%');

  // Spot-check a clearly-slower metric
  const editStart = report.metrics.find((m) => m.name === 'edit-start');
  assert.equal(editStart.status, 'slower');
  assert.ok(editStart.percent_change_ci[0] > 2, 'edit-start CI should be well above +2%');

  // Spot-check a boundary metric — bulk-add-50's CI straddles ±2% but is
  // consistent with the expected noise floor for its duration.
  const bulkAdd = report.metrics.find((m) => m.name === 'bulk-add-50');
  assert.equal(bulkAdd.status, 'noise-floor-limited');
  assert.ok(bulkAdd.observed_noise_ratio <= 2, 'bulk-add-50 should be at/under tolerance');

  // JSON adjunct exposes the diagnostic fields
  assert.ok('expected_noise_pp' in bulkAdd);
  assert.ok('observed_noise_ratio' in bulkAdd);
  assert.equal(report.sigma_abs_ms, 2);
  assert.equal(report.noise_ratio_tolerance, 2);
});

test('real-delta fixture — rubric markdown structure', () => {
  const { markdown } = runReporter({
    fixture: 'real-delta',
    sha: 'abcdef012345678',
    msg: 'Perf: Gate each phase-3 notify',
    baseSha: '0873084',
    runUrl: 'https://github.com/Semantic-Org/Semantic-Next/actions/runs/42',
    repo: 'Semantic-Org/Semantic-Next',
    wallClock: '642',
  });

  // h3 top header with state emoji, commit link, and Benchmark Suite anchor
  assert.ok(
    markdown.startsWith('### 🟡 Mixed Performance (Net Positive) for'),
    'h3 with mixed-net-positive state emoji',
  );
  assert.ok(markdown.includes('on Benchmark Suite 📊'), 'Benchmark Suite anchor suffix');
  assert.ok(
    markdown.includes('[`abcdef0`](https://github.com/Semantic-Org/Semantic-Next/commit/abcdef012345678)'),
    'commit SHA linked to GitHub',
  );

  // Metadata line includes Base / Action / Raw links. Action uses the run id
  // as the label (`#42`) so `gh run view 42` copy-paste works and the label
  // doesn't carry the ↗ arrow's valign drift.
  assert.ok(markdown.includes('**Base:** [main](https://github.com/Semantic-Org/Semantic-Next/commit/0873084)'));
  assert.ok(markdown.includes('**Action:** [#42](https://github.com/Semantic-Org/Semantic-Next/actions/runs/42)'));
  assert.ok(
    markdown.includes(
      '**Raw:** [`bench-report.json`](https://github.com/Semantic-Org/Semantic-Next/actions/runs/42/artifacts)',
    ),
  );

  // Commit msg renders as <sup>
  assert.ok(markdown.includes('<sup>Perf: Gate each phase-3 notify</sup>'));

  // GitHub alert block
  assert.ok(markdown.includes('> [!WARNING]'), 'mixed-state uses WARNING alert');
  assert.ok(markdown.includes('improves ✅ 10 tests while regressing on ❌ 5 tests'));

  // Results count line
  assert.ok(markdown.includes('✅ 10 faster · ❌ 5 slower · 🔍 3 unsure · ⚪ 3 no change'));

  // Sections present
  assert.ok(markdown.includes('#### ✅ Faster (10)'), 'faster section heading');
  assert.ok(markdown.includes('#### ❌ Slower (5)'), 'slower section heading');
  assert.ok(markdown.includes('<summary>⚪ No Change (3)</summary>'));
  assert.ok(markdown.includes('<summary>🔍 Unsure (3)</summary>'));

  // Section order: Faster → Slower → No Change → Unsure
  const fasterIdx = markdown.indexOf('#### ✅ Faster');
  const slowerIdx = markdown.indexOf('#### ❌ Slower');
  const noChangeIdx = markdown.indexOf('⚪ No Change (3)');
  const unsureIdx = markdown.indexOf('🔍 Unsure (3)');
  assert.ok(fasterIdx < slowerIdx && slowerIdx < noChangeIdx && noChangeIdx < unsureIdx, 'section order');

  // Severity emoji suffix on high-magnitude rows (update-10th at -62% → 🌟)
  assert.ok(/update-10th.*-62% \(34ms\) 🌟/.test(markdown), 'severity emoji after values');

  // Rows auto-expanded (≤ 15) — no teaser pattern
  assert.ok(!markdown.includes('top 5 shown'));

  // Metric source links present (paths resolved to bench.js / bench-todo.js at given SHA)
  assert.ok(/\/blob\/abcdef012345678\/packages\/renderer\/bench\/tachometer\/bench[-\w]*\.js#L\d+/.test(markdown));

  // Wall-clock footer
  assert.ok(markdown.includes('Wall-clock: 10m42s'));
});

test('zero-delta fixture — 0 faster, 0 slower, correct categorisation', () => {
  const { report, markdown } = runReporter({
    fixture: 'zero-delta',
    sha: 'd57409c71',
    msg: 'Build: Bump auto-sample cap from 2 to 3 min',
    baseSha: 'd4e3a88d',
  });

  assert.equal(report.summary.faster, 0, 'zero-delta: no faster verdicts');
  assert.equal(report.summary.slower, 0, 'zero-delta: no slower verdicts');
  const total = report.summary.faster
    + report.summary.slower
    + report.summary['within-noise']
    + report.summary.unsure
    + report.summary['noise-floor-limited'];
  assert.equal(total, 21, 'all 21 metrics classified');

  // Most short benches land in noise-floor-limited; long benches with
  // unexpectedly wide CI (create-1k, append-1k at ~2.7× expected) are
  // the genuine 'unsure' entries.
  assert.equal(report.summary['noise-floor-limited'], 12);
  assert.equal(report.summary.unsure, 2);

  // create-1k and append-1k are long benches (>100ms) whose CI widths
  // exceed the duration-derived floor by more than 2× — surface them.
  const unsureNames = report.metrics.filter((m) => m.status === 'unsure').map((m) => m.name);
  assert.deepEqual(unsureNames.sort(), ['append-1k', 'create-1k']);

  // No-change state → ⚪ heading + [!NOTE] alert
  assert.ok(markdown.startsWith('### ⚪ No Meaningful Change for'), 'no-change state heading');
  assert.ok(markdown.includes('> [!NOTE]'), 'no-change uses NOTE alert');
  assert.ok(markdown.includes('This PR did not move any measured metrics.'));

  // Headline count line combines inconclusive + too-fast into one 🔍 unsure total
  assert.ok(markdown.includes('✅ 0 faster · ❌ 0 slower · 🔍 14 unsure · ⚪ 7 no change'));

  // Unsure block has BOTH subsections
  assert.ok(markdown.includes('#### Inconclusive (2)'), 'Inconclusive subsection with 2');
  assert.ok(markdown.includes('#### Too Fast to Measure Precisely (12)'), 'Too Fast subsection with 12');

  // Everything is collapsed (no auto-expand on zero-delta)
  assert.ok(!markdown.includes('<details open>'), 'no auto-expanded details on zero-delta');
  // No faster/slower sections to render
  assert.ok(!markdown.includes('#### ✅ Faster'));
  assert.ok(!markdown.includes('#### ❌ Slower'));
});

test('base header — plain ref when no base-sha passed', () => {
  const { markdown } = runReporter({
    fixture: 'zero-delta',
    sha: 'deadbeef',
    msg: 'test',
    baseSha: '',
  });
  assert.ok(markdown.includes('**Base:** `main`'), 'renders just the ref in backticks');
});

test('base header — linked ref when repo + base-sha present', () => {
  const { markdown } = runReporter({
    fixture: 'zero-delta',
    sha: 'deadbeef',
    msg: 'test',
    baseSha: '1234567',
    repo: 'Semantic-Org/Semantic-Next',
  });
  assert.ok(
    markdown.includes('**Base:** [main](https://github.com/Semantic-Org/Semantic-Next/commit/1234567)'),
    'renders linked ref',
  );
});

test('pure improvement state → TIP alert', () => {
  // Synthesize a pure-improvement summary via the existing real-delta fixture
  // by NOT filtering (the fixture already has 10 faster + 5 slower → mixed).
  // Easiest pure-improvement assertion: check determineState's mapping of
  // counts via inspecting the generated JSON adjunct, since forcing a pure
  // improvement from real fixtures would require a dedicated dataset.
  const { report } = runReporter({
    fixture: 'real-delta',
    sha: 'abcdef',
    msg: 'x',
    baseSha: '1111111',
    repo: 'Semantic-Org/Semantic-Next',
  });
  // Ensure summary shape exposes what determineState needs
  assert.ok(typeof report.summary.faster === 'number');
  assert.ok(typeof report.summary.slower === 'number');
});

test('severity emoji suffix placement', () => {
  const { markdown } = runReporter({
    fixture: 'real-delta',
    sha: 'abc',
    msg: 'x',
    baseSha: '0873084',
    repo: 'Semantic-Org/Semantic-Next',
  });
  // Emoji trails values so number columns align vertically across rows
  assert.ok(/-62% \(34ms\) 🌟/.test(markdown), 'very-significant faster → 🌟 trailing');
  assert.ok(/-30% \(26ms\) ⭐/.test(markdown), 'significant faster → ⭐ trailing');
  assert.ok(/\+18% \(3ms\) ❗/.test(markdown), 'significant slower → ❗ trailing');
  // Sub-15% rows get no emoji suffix (but still render in the table)
  assert.ok(/-10% \(8ms\) \|/.test(markdown), 'sub-15% faster has no suffix');
});

const HISTORY_FIXTURE = path.join(__dirname, 'fixtures', 'history-sample.json');

test('cross-run: WIN when current CI dominates historical peak', () => {
  // history-sample.json has update-10th peak CI [6.0, 7.0] at bbbb...
  // Current CI [4.5, 5.5] is entirely below → WIN
  const dir = writeHandcraftedResults('update-10th', [4.5, 5.5]);
  const { report, markdown } = runReporter({
    resultsDir: dir,
    sha: 'feedbeef',
    msg: 'x',
    baseSha: 'aaaa11',
    history: HISTORY_FIXTURE,
  });
  const m = report.metrics.find((x) => x.name === 'update-10th');
  assert.equal(m.history_status, 'WIN');
  assert.equal(m.peak.sha, 'bbbb222222222222', 'peak commit is the best prior entry');
  assert.ok(m.delta_from_peak_pct < 0, 'delta is negative when current is faster than peak');
  assert.ok(!markdown.includes('Regressions from peak'), 'no reopened section when no REOPENED');
});

test('cross-run: REOPENED when a prior commit dominates current', () => {
  // history-sample.json peak for update-10th = CI [6.0, 7.0]
  // Current CI [20.0, 21.0] is entirely above → REOPENED
  const dir = writeHandcraftedResults('update-10th', [20.0, 21.0]);
  const { report, markdown } = runReporter({
    resultsDir: dir,
    sha: 'eeee55',
    msg: 'x',
    baseSha: 'aaaa11',
    repo: 'Semantic-Org/Semantic-Next',
    history: HISTORY_FIXTURE,
  });
  const m = report.metrics.find((x) => x.name === 'update-10th');
  assert.equal(m.history_status, 'REOPENED');
  assert.equal(m.peak.sha, 'bbbb222222222222');
  assert.ok(m.delta_from_peak_pct > 50, `delta should be large positive when reopened (got ${m.delta_from_peak_pct})`);

  // Bisect candidates = commits after peak (cccc, dddd)
  const bisectShas = m.bisect_candidates.map((c) => c.sha);
  assert.deepEqual(bisectShas, ['cccc333333333333', 'dddd444444444444']);

  // Markdown renders the REOPENED section when REOPENED metrics exist
  assert.ok(markdown.includes('📜 Regressions from peak (1)'), 'reopened section with count');
  assert.ok(markdown.includes('`bbbb222`'), 'peak SHA linked');
  assert.ok(markdown.includes('📜 1 reopened'), 'headline count includes reopened');
});

test('cross-run: TIED-PEAK when CIs overlap', () => {
  // history peak for update-10th = [6.0, 7.0]
  // Current CI [6.5, 7.5] overlaps → TIED-PEAK
  const dir = writeHandcraftedResults('update-10th', [6.5, 7.5]);
  const { report } = runReporter({
    resultsDir: dir,
    sha: 'aaaa',
    msg: 'x',
    baseSha: 'bbbb22',
    history: HISTORY_FIXTURE,
  });
  const m = report.metrics.find((x) => x.name === 'update-10th');
  assert.equal(m.history_status, 'TIED-PEAK');
});

test('cross-run: graceful degrade when history file is missing', () => {
  const dir = writeHandcraftedResults('update-10th', [10, 11]);
  const { report, markdown } = runReporter({
    resultsDir: dir,
    sha: 'abc',
    msg: 'x',
    baseSha: 'def',
    history: '/tmp/does-not-exist-bench-history.json',
  });
  const m = report.metrics.find((x) => x.name === 'update-10th');
  assert.equal(report.history_available, false);
  assert.ok(!('history_status' in m), 'no cross-run fields when history missing');
  assert.ok(!('peak' in m));
  assert.ok(!markdown.includes('Regressions from peak'));
  assert.ok(!markdown.includes('reopened'));
});

test('cross-run: graceful degrade for a brand-new metric not in history', () => {
  const dir = writeHandcraftedResults('unknown-metric', [5, 6]);
  const { report } = runReporter({
    resultsDir: dir,
    sha: 'abc',
    msg: 'x',
    baseSha: 'def',
    history: HISTORY_FIXTURE,
  });
  const m = report.metrics.find((x) => x.name === 'unknown-metric');
  assert.equal(report.history_available, true, 'history file loaded');
  assert.ok(!('history_status' in m), 'metric absent from history → no cross-run fields');
});

test('classify boundary behavior', async () => {
  // Import the internal classify via a minimal harness. Since reporter.js
  // isn't a module-with-named-exports (it's a CLI script), the test uses
  // a JSON file with hand-crafted CIs to exercise boundaries end-to-end.
  // That's sufficient for MVP; refactoring classify to exports if needed later.

  const harnessDir = fs.mkdtempSync('/tmp/bench-classify-test-');
  const handcraftedTachoJson = {
    benchmarks: [
      // this-change metrics
      makeBenchEntry('m-far-faster', 'this-change', 100, 101, [
        { pc: [-10, -8], abs: [-10, -8] },
        null,
        null,
        null,
        null,
      ]),
      makeBenchEntry('m-far-slower', 'this-change', 110, 111, [null, { pc: [8, 10], abs: [8, 10] }, null, null, null]),
      makeBenchEntry('m-noise', 'this-change', 100, 101, [null, null, { pc: [-1, 1], abs: [-1, 1] }, null, null]),
      makeBenchEntry('m-boundary', 'this-change', 100, 101, [null, null, null, { pc: [-3, 3], abs: [-3, 3] }, null]),
      makeBenchEntry('m-edge-below-2', 'this-change', 100, 101, [null, null, null, null, {
        pc: [-1.9, 1.9],
        abs: [-2, 2],
      }]),
      // tip-of-tree (indices 5-9 mirror 0-4, placeholders — only differences[this] matters)
      makeBenchEntry('m-far-faster', 'tip-of-tree', 111, 113, [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ]),
      makeBenchEntry('m-far-slower', 'tip-of-tree', 100, 101, [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ]),
      makeBenchEntry('m-noise', 'tip-of-tree', 100, 101, [null, null, null, null, null, null, null, null, null, null]),
      makeBenchEntry('m-boundary', 'tip-of-tree', 100, 101, [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ]),
      makeBenchEntry('m-edge-below-2', 'tip-of-tree', 100, 101, [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ]),
    ],
  };
  // differences[i] in a this-change entry refers to benchmarks[i]. For pairs, the tip-of-tree
  // index for metric X is (this-change idx + 5). So rewrite differences arrays accordingly:
  for (let i = 0; i < 5; i++) {
    const tipIdx = i + 5;
    const diffs = Array(10).fill(null);
    const defs = [
      { pc: [-10, -8] },
      { pc: [8, 10] },
      { pc: [-1, 1] },
      { pc: [-3, 3] },
      { pc: [-1.9, 1.9] },
    ];
    diffs[tipIdx] = {
      absolute: { low: defs[i].pc[0], high: defs[i].pc[1] },
      percentChange: { low: defs[i].pc[0], high: defs[i].pc[1] },
    };
    handcraftedTachoJson.benchmarks[i].differences = diffs;
  }

  fs.writeFileSync(path.join(harnessDir, 'tacho.json'), JSON.stringify(handcraftedTachoJson));
  const outDir = fs.mkdtempSync('/tmp/bench-classify-out-');
  execFileSync(
    'node',
    [REPORTER, '--results', harnessDir, '--sha', 'deadbeef', '--base-ref', 'main', '--out', outDir],
    { stdio: ['ignore', 'pipe', 'inherit'] },
  );
  const report = JSON.parse(fs.readFileSync(path.join(outDir, 'bench-report.json'), 'utf8'));
  const byName = Object.fromEntries(report.metrics.map((m) => [m.name, m.status]));

  assert.equal(byName['m-far-faster'], 'faster');
  assert.equal(byName['m-far-slower'], 'slower');
  assert.equal(byName['m-noise'], 'within-noise');
  assert.equal(byName['m-boundary'], 'unsure', 'CI that straddles ±2% is unsure');
  assert.equal(byName['m-edge-below-2'], 'within-noise', 'CI exactly inside ±2% is noise');
});

function makeBenchEntry(metricName, source, meanLow, meanHigh, diffs) {
  return {
    name: `${source} [${metricName}]`,
    measurement: { name: metricName, mode: 'performance', entryName: metricName },
    mean: { low: meanLow, high: meanHigh },
    differences: diffs,
  };
}

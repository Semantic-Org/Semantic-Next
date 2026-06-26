/*
  Unit tests for reporter.js.
  Run with: node --test tools/ci/bench/reporter/reporter.test.js

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
  prHistory = '',
  scope = '',
  resultsDir = null,
  repoRoot = null,
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
    '--out',
    tmp,
  ];
  if (baseSha) { argv.push('--base-sha', baseSha); }
  if (repo) { argv.push('--repo', repo); }
  if (wallClock) { argv.push('--wall-clock', wallClock); }
  // Point history at a known fixture path OR a deliberate non-existent
  // path to exercise the graceful-degrade branch. Default (no --history)
  // resolves to <repo-root>/tools/ci/bench/reporter/bench-history.json;
  // tests opt in to a specific fixture.
  if (history) { argv.push('--history', history); }
  if (prHistory) { argv.push('--pr-history', prHistory); }
  if (scope) { argv.push('--scope', scope); }
  // Tests that need to control bench-source discovery (purpose comments,
  // metric-source link paths) pass --repo-root pointing at a synthetic tree.
  if (repoRoot) { argv.push('--repo-root', repoRoot); }
  // Run from repo root so the bench-file index can find packages/.../bench/tachometer
  const cwd = path.resolve(__dirname, '..', '..', '..', '..');
  execFileSync('node', argv, { stdio: ['ignore', 'pipe', 'inherit'], cwd });
  const report = JSON.parse(fs.readFileSync(path.join(tmp, 'bench-report.json'), 'utf8'));
  const markdown = fs.readFileSync(path.join(tmp, 'comment.md'), 'utf8');
  return { report, markdown };
}

/**
 * Build a synthetic repoRoot containing `packages/<pkg>/bench/tachometer/<file>`
 * with the given JS contents. Exercises bench-source discovery against
 * deterministic fixtures rather than the real tree. Returns the temp root.
 */
function writeSyntheticRepoRoot(files) {
  const root = fs.mkdtempSync('/tmp/bench-purpose-root-');
  for (const { pkg = 'component', file = 'bench-test.js', contents } of files) {
    const dir = path.join(root, 'packages', pkg, 'bench', 'tachometer');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, file), contents);
  }
  return root;
}

function writeFixture(content) {
  const tmp = fs.mkdtempSync('/tmp/bench-fixture-');
  const filePath = path.join(tmp, 'history.json');
  fs.writeFileSync(filePath, JSON.stringify(content));
  return filePath;
}

/**
 * Build a tiny tachometer JSON fixture with one metric whose this-change
 * mean CI and percent-delta CI are caller-specified. Used to force specific
 * cross-run outcomes against fixtures/history-sample.json.
 *
 * `pctDeltaCi` is the within-session percent-delta vs tip-of-tree — the
 * number cross-iteration peak attribution operates on. If `baselineSha`
 * is provided, also writes the baseline-sha.txt sidecar (so the reporter
 * picks up the current run's baseline for drift detection).
 */
function writeHandcraftedResults(
  metricName,
  thisChangeCi,
  tipOfTreeCi = [10, 11],
  pctDeltaCi = [-5, 5],
  baselineSha = '',
) {
  const dir = fs.mkdtempSync('/tmp/bench-reporter-handcraft-');
  const diff = {
    absolute: { low: -1, high: 1 },
    percentChange: { low: pctDeltaCi[0], high: pctDeltaCi[1] },
  };
  const data = {
    benchmarks: [
      {
        name: `this-change [${metricName}]`,
        measurement: { name: metricName, mode: 'performance', entryName: metricName },
        mean: { low: thisChangeCi[0], high: thisChangeCi[1] },
        differences: [null, diff],
      },
      {
        name: `tip-of-tree [${metricName}]`,
        measurement: { name: metricName, mode: 'performance', entryName: metricName },
        mean: { low: tipOfTreeCi[0], high: tipOfTreeCi[1] },
        differences: [diff, null],
      },
    ],
  };
  fs.writeFileSync(path.join(dir, 'handcrafted.json'), JSON.stringify(data));
  if (baselineSha) {
    fs.writeFileSync(path.join(dir, 'baseline-sha.txt'), baselineSha);
  }
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
  assert.ok('sigma_ms' in bulkAdd, 'per-cell σ surfaced in JSON');
  assert.ok('sample_count' in bulkAdd, 'per-cell sample_count surfaced in JSON');
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
    markdown.startsWith('### 🟡 Mixed (mostly faster) for'),
    'h3 with mixed-mostly-faster state emoji',
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

  // Metric source links resolve to bench-*.js. Match any package — the
  // suite layout isn't pinned and reorganizes over time.
  assert.ok(/\/blob\/abcdef012345678\/packages\/\w+\/bench\/tachometer\/bench[-\w]*\.js#L\d+/.test(markdown));

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

  // With per-cell σ (computed from each bench's own samples), expected
  // noise tracks each bench's empirical variance. In zero-delta runs
  // σ_current ≈ σ_base, so predicted CI ≈ observed CI and the ratio
  // hovers at ~1× for every bench — all unresolved metrics land in
  // noise-floor-limited. The "unsure" bucket fires when σ_current and
  // σ_base diverge (asymmetric-variance change), not in zero-delta.
  assert.equal(report.summary['noise-floor-limited'], 14);
  assert.equal(report.summary.unsure, 0);

  // No-change state → ⚪ heading + [!NOTE] alert
  assert.ok(markdown.startsWith('### ⚪ No Meaningful Change for'), 'no-change state heading');
  assert.ok(markdown.includes('> [!NOTE]'), 'no-change uses NOTE alert');
  assert.ok(markdown.includes('This PR did not move any measured metrics.'));

  // Headline count line combines inconclusive + too-fast into one 🔍 unsure total
  assert.ok(markdown.includes('✅ 0 faster · ❌ 0 slower · 🔍 14 unsure · ⚪ 7 no change'));

  // Per-cell σ degenerates the Inconclusive bucket in zero-delta — every
  // metric's CI matches what its own samples predict. All 14 unresolved
  // metrics land in Too Fast to Measure Precisely.
  assert.ok(!markdown.includes('#### Inconclusive'), 'no Inconclusive subsection in zero-delta');
  assert.ok(markdown.includes('#### Too Fast to Measure Precisely (14)'), 'Too Fast subsection with 14');

  // Everything is collapsed (no auto-expand on zero-delta)
  assert.ok(!markdown.includes('<details open>'), 'no auto-expanded details on zero-delta');
  // No faster/slower sections to render
  assert.ok(!markdown.includes('#### ✅ Faster'));
  assert.ok(!markdown.includes('#### ❌ Slower'));
});

test('base header — falls back to baseline-sha.txt sidecar when --base-sha unset', () => {
  // The matrix workflow may not pass --base-sha. Each per-config artifact
  // already carries baseline-sha.txt — the reporter should use that as the
  // fallback so the Base link pins to the actual measurement baseline,
  // not a moving branch tip.
  const dir = writeHandcraftedResults('m', [10, 11], [10, 11], [-1, 1], 'ba5e1100ba5e1100ba5e1100ba5e1100ba5e1100');
  const { report, markdown } = runReporter({
    resultsDir: dir,
    sha: 'abc',
    msg: 'x',
    // No baseSha CLI arg
    repo: 'owner/repo',
  });
  assert.equal(report.base.sha, 'ba5e1100ba5e1100ba5e1100ba5e1100ba5e1100', 'sidecar SHA threaded into report.base');
  assert.ok(
    markdown.includes('/commit/ba5e1100ba5e1100ba5e1100ba5e1100ba5e1100'),
    'Base link uses commit URL with sidecar SHA',
  );
  assert.ok(!markdown.includes('/tree/main'), 'no fallback to moving branch tip');
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

test('cross-run: WIN when current pct-delta dominates historical peak', () => {
  // history-sample.json's update-10th peak percent_delta_ci is [-40, -35] at bbbb.
  // Current pct-delta [-50, -45] is more negative across the whole range → WIN.
  const dir = writeHandcraftedResults('update-10th', [4.5, 5.5], [10, 11], [-50, -45]);
  const { report, markdown } = runReporter({
    resultsDir: dir,
    sha: 'feedbeef',
    msg: 'x',
    baseSha: 'aaaa11',
    history: HISTORY_FIXTURE,
  });
  const m = report.metrics.find((x) => x.name === 'update-10th');
  assert.equal(m.history_status, 'WIN');
  assert.equal(m.peak.sha, 'bbbb222222222222', 'peak entry is the most-improved prior');
  assert.ok(m.delta_from_peak_pct < 0, 'delta_from_peak_pct is negative when current dominates peak');
  assert.ok(!markdown.includes('Regressions from peak'), 'no reopened section when no REOPENED');
  assert.ok(markdown.includes('🏆 New peaks (1)'), 'New peaks section renders');
  assert.ok(markdown.includes('🏆 1 new peak'), 'headline includes new peak count');
  assert.ok(markdown.includes('| improvement |'), 'improvement column header on WIN table');
  // WIN section's table: row is `| metric | <improvement>% | <peakLink> | <candidates> |`
  // Bare magnitude (no leading sign) — header encodes direction.
  assert.ok(/\| \d+% \|/.test(markdown), 'delta is bare magnitude — header encodes direction');
});

test('cross-run: peak links to PR conversation when PR number is known', () => {
  // Peak has pr: 102 in the fixture → peak SHA in markdown should link
  // to /pull/102, not /commit/<sha>. Takes reviewers directly to the
  // bench comment from that PR (which is where the peak value came from).
  // Default current pct-delta [-5, 5] vs peak [-40, -35] triggers REOPENED.
  const dir = writeHandcraftedResults('update-10th', [20.0, 21.0]);
  const { report, markdown } = runReporter({
    resultsDir: dir,
    sha: 'feed',
    msg: 'x',
    baseSha: 'aaaa11',
    repo: 'Semantic-Org/Semantic-Next',
    history: HISTORY_FIXTURE,
  });
  const m = report.metrics.find((x) => x.name === 'update-10th');
  assert.equal(m.peak.pr, 102, 'peak entry carries pr number from history');
  assert.ok(
    markdown.includes('[`bbbb222`](https://github.com/Semantic-Org/Semantic-Next/pull/102)'),
    'peak SHA links to PR conversation, not commit',
  );
  // Bisect candidates also link to PRs.
  assert.ok(markdown.includes('](https://github.com/Semantic-Org/Semantic-Next/pull/103)'));
  assert.ok(markdown.includes('](https://github.com/Semantic-Org/Semantic-Next/pull/104)'));
});

test('cross-run: REOPENED when a prior iteration dominates current', () => {
  // history-sample.json peak for update-10th = pct-delta [-40, -35] at bbbb.
  // Default current pct-delta [-5, 5] is entirely above peak's range → REOPENED.
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
  // Current midpoint 0pp - peak midpoint -37.5pp = +37.5pp regressed from peak.
  assert.ok(
    m.delta_from_peak_pct > 30,
    `delta_from_peak_pct should be large positive (got ${m.delta_from_peak_pct})`,
  );

  // Bisect candidates = commits after peak (cccc, dddd)
  const bisectShas = m.bisect_candidates.map((c) => c.sha);
  assert.deepEqual(bisectShas, ['cccc333333333333', 'dddd444444444444']);

  // Markdown renders the REOPENED section when REOPENED metrics exist
  assert.ok(markdown.includes('📜 Regressions from peak (1)'), 'reopened section with count');
  assert.ok(markdown.includes('`bbbb222`'), 'peak SHA linked');
  assert.ok(markdown.includes('📜 1 reopened'), 'headline count includes reopened');
  assert.ok(markdown.includes('| regression |'), 'regression column header on REOPENED table');
  assert.ok(/\| \d+% \|/.test(markdown), 'delta is bare magnitude — header encodes direction');
  assert.ok(!markdown.includes('🏆'), 'no new peaks count when WIN is zero');
});

test('cross-run: TIED-PEAK when pct-delta CIs overlap', () => {
  // history peak for update-10th = pct-delta [-40, -35]
  // Current pct-delta [-38, -33] overlaps → TIED-PEAK
  const dir = writeHandcraftedResults('update-10th', [6.5, 7.5], [10, 11], [-38, -33]);
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

test('cross-run: sub-NOISE_FLOOR delta downgrades to TIED-PEAK even with non-overlapping CIs', () => {
  // Non-overlapping CIs that would naively be REOPENED, but the midpoint
  // gap is below NOISE_FLOOR (2). The JND gate downgrades to TIED-PEAK so
  // sub-noise-floor differences don't fire false alarms.
  const prHistory = writeFixture({
    schema_version: 2,
    commits: [{
      sha: 'pr-iter-1',
      msg: 'iteration 1',
      parent_sha: '',
      timestamp: '2026-04-20T00:00:00Z',
      pr: null,
      metrics: {
        'update-10th': {
          ci: [10, 11],
          mean_ms: 10.5,
          percent_delta_ci: [-2.5, -2.0],
          baseline_sha: 'mainA',
        },
      },
    }],
  });
  // Current pct-delta [-1.5, -1.0] vs peak [-2.5, -2.0]. peak.high (-2) <
  // current.low (-1.5) → CIs don't overlap. Midpoints: current -1.25,
  // peak -2.25. delta = +1pp, below NOISE_FLOOR. JND downgrades to TIED.
  const dir = writeHandcraftedResults('update-10th', [10, 11], [10.5, 11.5], [-1.5, -1.0], 'mainA');
  const { report, markdown } = runReporter({
    resultsDir: dir,
    sha: 'current',
    msg: 'x',
    baseSha: 'def',
    prHistory,
    scope: 'pr',
  });
  const m = report.metrics.find((x) => x.name === 'update-10th');
  assert.equal(m.history_status, 'TIED-PEAK', 'JND gate downgrades sub-floor delta');
  assert.ok(!markdown.includes('Regressions from peak'), 'no reopened section');
  assert.ok(!markdown.includes('New peaks'), 'no new peaks section');
});

test('cross-run: unsure-classified metrics are suppressed from cross-iteration tables', () => {
  // History: peak iteration with a clear improvement, current run lands
  // unsure (CI wider than expected for its duration). Same-session
  // classification wins — the metric should not appear in Regressions
  // from peak even though delta_from_peak_pct exceeds NOISE_FLOOR.
  const prHistory = writeFixture({
    schema_version: 2,
    commits: [{
      sha: 'pr-peak-1234',
      msg: 'iter 1',
      parent_sha: '',
      timestamp: '2026-04-20T00:00:00Z',
      pr: null,
      touches_packages: true,
      metrics: {
        'edge-metric': {
          ci: [9, 10],
          mean_ms: 9.5,
          // Width 5pp; narrow CI so the peak-quality gate accepts it.
          percent_delta_ci: [-30, -25],
          baseline_sha: 'mainA',
        },
      },
    }],
  });
  // Current pct-delta [-20, +15] — straddles ±2% AND width 35pp at
  // meanMs≈10 produces ratio = 35 / (0.784*2/10*100) ≈ 2.23, exceeding
  // NOISE_RATIO_TOLERANCE → unsure. Midpoint -2.5, peak midpoint -27.5,
  // delta +25pp → would be REOPENED by raw classification, but unsure
  // same-session means dedup fires.
  const dir = writeHandcraftedResults('edge-metric', [9.8, 10.2], [9.8, 10.2], [-20, 15], 'mainA');
  const { report, markdown } = runReporter({
    resultsDir: dir,
    sha: 'current',
    msg: 'x',
    baseSha: 'def',
    prHistory,
    scope: 'pr',
  });
  const m = report.metrics.find((x) => x.name === 'edge-metric');
  assert.equal(m.status, 'unsure', 'sanity: same-session classification is unsure');
  assert.equal(m.history_status, 'REOPENED', 'cross-iteration analysis still computes the status');
  assert.ok(!markdown.includes('Regressions from peak'), 'unsure metric is suppressed from cross-iteration table');
});

test('cross-run: peak selection excludes touches_packages: false entries', () => {
  // History: a harness-only commit with the most-improved percent_delta_ci,
  // followed by a smaller measurement-touching peak. Peak selection must
  // pick the smaller-but-eligible commit, not the harness-only outlier.
  const prHistory = writeFixture({
    schema_version: 2,
    commits: [
      {
        sha: 'harness-9999999',
        msg: 'Harness: tweak some skill',
        parent_sha: '',
        timestamp: '2026-04-20T00:00:00Z',
        pr: null,
        touches_packages: false,
        metrics: {
          'update-10th': {
            ci: [5, 6],
            mean_ms: 5.5,
            percent_delta_ci: [-50, -45],
            baseline_sha: 'mainA',
          },
        },
      },
      {
        sha: 'real-pkg-1234',
        msg: 'Refactor: real package change',
        parent_sha: '',
        timestamp: '2026-04-20T01:00:00Z',
        pr: null,
        touches_packages: true,
        metrics: {
          'update-10th': {
            ci: [9, 10],
            mean_ms: 9.5,
            percent_delta_ci: [-20, -15],
            baseline_sha: 'mainA',
          },
        },
      },
    ],
  });
  // Current pct-delta [-5, 0] regresses from the eligible peak [-20, -15],
  // delta ~+15pp.
  const dir = writeHandcraftedResults('update-10th', [11, 12], [11.5, 12.5], [-5, 0], 'mainA');
  const { report } = runReporter({
    resultsDir: dir,
    sha: 'current',
    msg: 'x',
    baseSha: 'def',
    prHistory,
    scope: 'pr',
  });
  const m = report.metrics.find((x) => x.name === 'update-10th');
  assert.equal(m.peak.sha, 'real-pkg-1234', 'peak is the bench-touching commit, not the harness one');
  assert.equal(m.history_status, 'REOPENED');
});

test('cross-run: peak selection excludes outlier-noisy iterations (ratio gate)', () => {
  // History: a wildly-noisy iteration with the most-improved midpoint
  // (CI width way above expected for its duration), followed by a tighter
  // iteration. The noisy peak's own resolution floor exceeds NOISE_FLOOR
  // — anchoring the regression table to it would report deltas inside
  // its own noise band. Peak selection must skip it.
  const prHistory = writeFixture({
    schema_version: 2,
    commits: [
      {
        sha: 'noisy-7777777',
        msg: 'Refactor: a noisy iteration',
        parent_sha: '',
        timestamp: '2026-04-20T00:00:00Z',
        pr: null,
        touches_packages: true,
        metrics: {
          'update-10th': {
            ci: [9, 10],
            mean_ms: 9.5,
            // Width is 25pp; expected ≈ 0.784 * 2 / 9.5 * 100 ≈ 16.5pp.
            // Ratio ≈ 1.5 — within tolerance.
            percent_delta_ci: [-50, -25],
            baseline_sha: 'mainA',
          },
        },
      },
      {
        sha: 'tight-3333333',
        msg: 'Refactor: a tighter iteration',
        parent_sha: '',
        timestamp: '2026-04-20T01:00:00Z',
        pr: null,
        touches_packages: true,
        metrics: {
          'update-10th': {
            ci: [9, 10],
            mean_ms: 9.5,
            // Width 5pp; ratio ≈ 0.3 — well within tolerance.
            percent_delta_ci: [-20, -15],
            baseline_sha: 'mainA',
          },
        },
      },
      {
        sha: 'huge-noise-1',
        msg: 'Refactor: huge noise',
        parent_sha: '',
        timestamp: '2026-04-20T02:00:00Z',
        pr: null,
        touches_packages: true,
        metrics: {
          'update-10th': {
            ci: [9, 10],
            mean_ms: 9.5,
            // Width 60pp; ratio ≈ 3.6 — over tolerance, skipped.
            percent_delta_ci: [-90, -30],
            baseline_sha: 'mainA',
          },
        },
      },
    ],
  });
  const dir = writeHandcraftedResults('update-10th', [11, 12], [11.5, 12.5], [-5, 0], 'mainA');
  const { report } = runReporter({
    resultsDir: dir,
    sha: 'current',
    msg: 'x',
    baseSha: 'def',
    prHistory,
    scope: 'pr',
  });
  const m = report.metrics.find((x) => x.name === 'update-10th');
  assert.notEqual(m.peak.sha, 'huge-noise-1', 'too-noisy iteration is not picked as peak');
});

test('cross-run: bisect candidates exclude touches_packages: false entries', () => {
  // History: peak (touches packages), then a harness-only commit, then
  // current. The harness-only commit should not appear as a bisect candidate
  // even though it has percent_delta_ci data.
  const prHistory = writeFixture({
    schema_version: 2,
    commits: [
      {
        sha: 'pr-peak-1234567',
        msg: 'peak iteration',
        parent_sha: '',
        timestamp: '2026-04-20T00:00:00Z',
        pr: null,
        touches_packages: true,
        metrics: {
          'update-10th': {
            ci: [7, 8],
            mean_ms: 7.5,
            percent_delta_ci: [-30, -25],
            baseline_sha: 'mainA',
          },
        },
      },
      {
        sha: 'pr-harness-7654321',
        msg: 'Harness: tweak some skill',
        parent_sha: '',
        timestamp: '2026-04-20T01:00:00Z',
        pr: null,
        touches_packages: false,
        metrics: {
          'update-10th': {
            ci: [8, 9],
            mean_ms: 8.5,
            percent_delta_ci: [-20, -15],
            baseline_sha: 'mainA',
          },
        },
      },
    ],
  });
  // Current pct-delta [-5, 0] regresses from peak [-30, -25]. delta ~+25pp.
  const dir = writeHandcraftedResults('update-10th', [11, 12], [11.5, 12.5], [-5, 0], 'mainA');
  const { report } = runReporter({
    resultsDir: dir,
    sha: 'current',
    msg: 'x',
    baseSha: 'def',
    prHistory,
    scope: 'pr',
  });
  const m = report.metrics.find((x) => x.name === 'update-10th');
  assert.equal(m.history_status, 'REOPENED');
  // Only the harness commit sits between peak and current, but it shouldn't
  // appear because touches_packages is false.
  assert.equal(m.bisect_candidates.length, 0, 'harness-only commit excluded');
});

test('--scope pr excludes main-history from peak attribution', () => {
  // Default current pct-delta [-5, 5] would be REOPENED vs main-history's
  // peak [-40, -35]. With --scope pr and an empty PR-iteration history,
  // peak attribution sees no entries → no history_status, no REOPENED
  // section in markdown.
  const dir = writeHandcraftedResults('update-10th', [20, 21]);
  const emptyPrHistory = writeFixture({ schema_version: 2, commits: [] });
  const { report, markdown } = runReporter({
    resultsDir: dir,
    sha: 'abc',
    msg: 'x',
    baseSha: 'def',
    history: HISTORY_FIXTURE,
    prHistory: emptyPrHistory,
    scope: 'pr',
  });
  const m = report.metrics.find((x) => x.name === 'update-10th');
  assert.ok(!('history_status' in m), 'no peak attribution under --scope pr with empty PR history');
  assert.ok(!markdown.includes('Regressions from peak'), 'no REOPENED section');
  assert.equal(report.scope, 'pr', 'scope echoed to JSON adjunct');
});

test('--scope pr uses PR-iteration history when present', () => {
  // PR-iteration history has its own "peak" at -30%; current at -5% → REOPENED.
  // Main-history's [-40, -35] peak is excluded under --scope pr.
  const dir = writeHandcraftedResults('update-10th', [10, 11]);
  const prHistoryFile = writeFixture({
    schema_version: 2,
    commits: [{
      sha: 'pr-iter-1234567',
      msg: 'iteration 1',
      parent_sha: '',
      timestamp: '2026-04-20T00:00:00Z',
      pr: null,
      metrics: {
        'update-10th': {
          ci: [9, 10],
          mean_ms: 9.5,
          percent_delta_ci: [-32, -28],
          baseline_sha: 'main-tip-12345',
        },
      },
    }],
  });
  const { report } = runReporter({
    resultsDir: dir,
    sha: 'abc',
    msg: 'x',
    baseSha: 'def',
    history: HISTORY_FIXTURE,
    prHistory: prHistoryFile,
    scope: 'pr',
  });
  const m = report.metrics.find((x) => x.name === 'update-10th');
  assert.equal(m.history_status, 'REOPENED', 'REOPENED against PR-iteration peak only');
  assert.equal(m.peak.sha, 'pr-iter-1234567', 'peak from PR history, not main-history');
});

test('drift flag fires with magnitude when chain is quantifiable', () => {
  // Setup: current's baseline is mainB; PR-iteration peak's baseline is mainA.
  // main-history has commits between mainA and mainB whose percent_delta_ci
  // values combine to >5pp drift.
  const driftHistory = writeFixture({
    schema_version: 2,
    commits: [
      {
        sha: 'mainA',
        msg: 'main A',
        parent_sha: '',
        timestamp: '2026-04-15T00:00:00Z',
        pr: null,
        metrics: {
          'update-10th': { ci: [10, 11], mean_ms: 10.5 },
        },
      },
      {
        sha: 'main-mid',
        msg: 'main mid commit',
        parent_sha: 'mainA',
        timestamp: '2026-04-16T00:00:00Z',
        pr: null,
        metrics: {
          'update-10th': {
            ci: [10.5, 11.5],
            mean_ms: 11,
            percent_delta_ci: [4, 6],
            baseline_sha: 'mainA',
          },
        },
      },
      {
        sha: 'mainB',
        msg: 'main B',
        parent_sha: 'main-mid',
        timestamp: '2026-04-17T00:00:00Z',
        pr: null,
        metrics: {
          'update-10th': {
            ci: [11, 12],
            mean_ms: 11.5,
            percent_delta_ci: [3, 5],
            baseline_sha: 'main-mid',
          },
        },
      },
    ],
  });
  // PR-iteration peak: pct-delta [-30, -25] vs mainA. Best so far.
  const prHistory = writeFixture({
    schema_version: 2,
    commits: [{
      sha: 'pr-best-iter',
      msg: 'best iteration',
      parent_sha: '',
      timestamp: '2026-04-15T01:00:00Z',
      pr: null,
      metrics: {
        'update-10th': {
          ci: [7, 8],
          mean_ms: 7.5,
          percent_delta_ci: [-30, -25],
          baseline_sha: 'mainA',
        },
      },
    }],
  });
  // Current: pct-delta [-5, 0] vs mainB. Worse than peak → REOPENED + drift.
  const dir = writeHandcraftedResults('update-10th', [11, 12], [11.5, 12.5], [-5, 0], 'mainB');
  const { report, markdown } = runReporter({
    resultsDir: dir,
    sha: 'current',
    msg: 'x',
    baseSha: 'def',
    history: driftHistory,
    prHistory,
    scope: 'pr',
  });
  const m = report.metrics.find((x) => x.name === 'update-10th');
  assert.equal(m.history_status, 'REOPENED');
  assert.ok(m.drift?.detected, 'drift detected');
  assert.ok(m.drift.magnitude !== null, 'magnitude available');
  // Chain: main-mid (+5pp midpoint) × mainB (+4pp midpoint). Combined ~9pp.
  assert.ok(m.drift.magnitude > 5, `drift magnitude > 5pp (got ${m.drift.magnitude})`);
  assert.equal(m.drift.chain_len, 2, 'two chain links');
  assert.equal(m.drift.missing, 0);
  // Markdown footnote rendered
  assert.ok(/⚠️1 main moved \+\d+pp/.test(markdown), 'drift footnote with magnitude');
  assert.ok(markdown.includes('chained across 2 main commits'));
});

test('drift detected but unquantifiable: no markdown footnote, JSON keeps signal', () => {
  // Current and peak baselines differ, but driftHist has nothing to walk →
  // detected: true, magnitude: null. The reporter records the binary-only
  // drift in JSON for agent consumption but suppresses the footnote in
  // markdown — the warning was content-free FUD on long-lived PRs whose
  // peak baselines age out of bench-history.
  const prHistory = writeFixture({
    schema_version: 2,
    commits: [{
      sha: 'pr-best',
      msg: 'best',
      parent_sha: '',
      timestamp: '2026-04-15T00:00:00Z',
      pr: null,
      metrics: {
        'update-10th': {
          ci: [7, 8],
          mean_ms: 7.5,
          percent_delta_ci: [-30, -25],
          baseline_sha: 'mainA',
        },
      },
    }],
  });
  const emptyMain = writeFixture({ schema_version: 2, commits: [] });
  const dir = writeHandcraftedResults('update-10th', [11, 12], [11.5, 12.5], [-5, 0], 'mainB-different');
  const { report, markdown } = runReporter({
    resultsDir: dir,
    sha: 'current',
    msg: 'x',
    baseSha: 'def',
    history: emptyMain,
    prHistory,
    scope: 'pr',
  });
  const m = report.metrics.find((x) => x.name === 'update-10th');
  assert.equal(m.history_status, 'REOPENED');
  assert.ok(m.drift?.detected, 'drift detected (binary) — JSON preserves the signal');
  assert.equal(m.drift.magnitude, null, 'magnitude unavailable when chain is empty');
  assert.ok(!markdown.includes('main moved'), 'no drift footnote when magnitude is unquantifiable');
  assert.ok(!markdown.includes('⚠️'), 'no inline drift marker when magnitude is unquantifiable');
});

test('no drift flag when baselines match', () => {
  // Current and peak share a baseline → no drift, no flag, no footnote.
  const sharedBaseline = 'shared-main-tip';
  const prHistory = writeFixture({
    schema_version: 2,
    commits: [{
      sha: 'pr-best',
      msg: 'best',
      parent_sha: '',
      timestamp: '2026-04-15T00:00:00Z',
      pr: null,
      metrics: {
        'update-10th': {
          ci: [7, 8],
          mean_ms: 7.5,
          percent_delta_ci: [-30, -25],
          baseline_sha: sharedBaseline,
        },
      },
    }],
  });
  const dir = writeHandcraftedResults('update-10th', [11, 12], [11.5, 12.5], [-5, 0], sharedBaseline);
  const { report, markdown } = runReporter({
    resultsDir: dir,
    sha: 'current',
    msg: 'x',
    baseSha: 'def',
    prHistory,
    scope: 'pr',
  });
  const m = report.metrics.find((x) => x.name === 'update-10th');
  assert.equal(m.history_status, 'REOPENED');
  assert.ok(!m.drift || m.drift.detected === false, 'no drift when baselines match');
  assert.ok(!markdown.includes('main moved'), 'no drift footnote');
});

test('drift flag fires symmetrically on WIN rows', () => {
  // A WIN where main moved between baselines warrants the same drift
  // disclosure as a REOPENED — the iteration may credit movement that's
  // actually main-side. Setup mirrors the REOPENED drift test but with
  // current's pct-delta dominating peak's instead of regressing.
  const driftHistory = writeFixture({
    schema_version: 2,
    commits: [
      {
        sha: 'mainA',
        msg: 'main A',
        parent_sha: '',
        timestamp: '2026-04-15T00:00:00Z',
        pr: null,
        metrics: { 'update-10th': { ci: [10, 11], mean_ms: 10.5 } },
      },
      {
        sha: 'main-mid',
        msg: 'main mid',
        parent_sha: 'mainA',
        timestamp: '2026-04-16T00:00:00Z',
        pr: null,
        metrics: {
          'update-10th': {
            ci: [10.5, 11.5],
            mean_ms: 11,
            percent_delta_ci: [4, 6],
            baseline_sha: 'mainA',
          },
        },
      },
      {
        sha: 'mainB',
        msg: 'main B',
        parent_sha: 'main-mid',
        timestamp: '2026-04-17T00:00:00Z',
        pr: null,
        metrics: {
          'update-10th': {
            ci: [11, 12],
            mean_ms: 11.5,
            percent_delta_ci: [3, 5],
            baseline_sha: 'main-mid',
          },
        },
      },
    ],
  });
  // Prior iteration was at -10 to -5 vs mainA. Current at -50 to -45 vs mainB.
  // Current's pct-delta dominates → WIN. Baselines differ → drift flag fires.
  const prHistory = writeFixture({
    schema_version: 2,
    commits: [{
      sha: 'pr-prior',
      msg: 'prior iteration',
      parent_sha: '',
      timestamp: '2026-04-15T01:00:00Z',
      pr: null,
      metrics: {
        'update-10th': {
          ci: [9, 10],
          mean_ms: 9.5,
          percent_delta_ci: [-10, -5],
          baseline_sha: 'mainA',
        },
      },
    }],
  });
  const dir = writeHandcraftedResults('update-10th', [5, 6], [11.5, 12.5], [-50, -45], 'mainB');
  const { report, markdown } = runReporter({
    resultsDir: dir,
    sha: 'current',
    msg: 'x',
    baseSha: 'def',
    history: driftHistory,
    prHistory,
    scope: 'pr',
  });
  const m = report.metrics.find((x) => x.name === 'update-10th');
  assert.equal(m.history_status, 'WIN');
  assert.ok(m.drift?.detected, 'drift detected on WIN');
  assert.ok(/⚠️1 main moved/.test(markdown), 'drift footnote renders on WIN row');
  assert.ok(markdown.includes('🏆 New peaks (1)'), 'New peaks section present');
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

// ─── purpose extraction + glossary rendering ───────────────────────────────

const PURPOSE_TEXT = 'tests whether items in a list update independently when one external selection signal changes.';

test('purpose: resolved from comment immediately above the metric mark', () => {
  const root = writeSyntheticRepoRoot([{
    contents: [
      `const startMark = (name) => \`\${name}-start\`;`,
      `// purpose: ${PURPOSE_TEXT}`,
      `performance.mark(startMark('alpha'));`,
    ].join('\n'),
  }]);
  const dir = writeHandcraftedResults('alpha', [10, 11]);
  const { report } = runReporter({
    resultsDir: dir,
    sha: 'abc',
    msg: 'x',
    baseSha: 'def',
    repoRoot: root,
  });
  const m = report.metrics.find((x) => x.name === 'alpha');
  assert.equal(m.purpose, PURPOSE_TEXT);
});

test('purpose: null when no comment precedes the metric mark', () => {
  const root = writeSyntheticRepoRoot([{
    contents: [
      `const startMark = (name) => \`\${name}-start\`;`,
      `performance.mark(startMark('alpha'));`,
    ].join('\n'),
  }]);
  const dir = writeHandcraftedResults('alpha', [10, 11]);
  const { report } = runReporter({
    resultsDir: dir,
    sha: 'abc',
    msg: 'x',
    baseSha: 'def',
    repoRoot: root,
  });
  const m = report.metrics.find((x) => x.name === 'alpha');
  assert.equal(m.purpose, null, 'purpose field present and null when no comment');
});

test('purpose: null when comment is more than one line above the mark', () => {
  // Blank line between purpose comment and mark decouples them. Only the
  // immediately-preceding line counts so a stray comment elsewhere can't
  // accidentally claim a metric.
  const root = writeSyntheticRepoRoot([{
    contents: [
      `const startMark = (name) => \`\${name}-start\`;`,
      `// purpose: ${PURPOSE_TEXT}`,
      ``,
      `performance.mark(startMark('alpha'));`,
    ].join('\n'),
  }]);
  const dir = writeHandcraftedResults('alpha', [10, 11]);
  const { report } = runReporter({
    resultsDir: dir,
    sha: 'abc',
    msg: 'x',
    baseSha: 'def',
    repoRoot: root,
  });
  const m = report.metrics.find((x) => x.name === 'alpha');
  assert.equal(m.purpose, null);
});

test('purpose: truncates at 120 chars with single-char ellipsis', () => {
  // 130-char description is over the cap; reporter truncates to 119 chars
  // + `…` → 120-char rendered length total.
  const longText = 'x'.repeat(130);
  const root = writeSyntheticRepoRoot([{
    contents: [
      `const startMark = (name) => \`\${name}-start\`;`,
      `// purpose: ${longText}`,
      `performance.mark(startMark('alpha'));`,
    ].join('\n'),
  }]);
  const dir = writeHandcraftedResults('alpha', [10, 11]);
  const { report } = runReporter({
    resultsDir: dir,
    sha: 'abc',
    msg: 'x',
    baseSha: 'def',
    repoRoot: root,
  });
  const m = report.metrics.find((x) => x.name === 'alpha');
  assert.equal(m.purpose.length, 120, 'truncated length includes the ellipsis char');
  assert.ok(m.purpose.endsWith('…'), 'single ellipsis char, not three dots');
  assert.equal(m.purpose, `${'x'.repeat(119)}…`);
});

test('glossary: section renders when at least one metric has a purpose', () => {
  const root = writeSyntheticRepoRoot([{
    contents: [
      `const startMark = (name) => \`\${name}-start\`;`,
      `// purpose: ${PURPOSE_TEXT}`,
      `performance.mark(startMark('alpha'));`,
    ].join('\n'),
  }]);
  const dir = writeHandcraftedResults('alpha', [10, 11]);
  const { markdown } = runReporter({
    resultsDir: dir,
    sha: 'abc',
    msg: 'x',
    baseSha: 'def',
    repoRoot: root,
  });
  assert.ok(markdown.includes('<summary>📖 Bench glossary (1 metric)</summary>'), 'glossary summary present');
  assert.ok(markdown.includes('| metric | what it tests |'), 'glossary table header');
  // Default synthetic file is `bench-test.js` → label prefix `test:` so
  // reviewers can see suite membership at a glance.
  assert.ok(markdown.includes(`\`test:alpha\``), 'metric label carries bench-file prefix');
  assert.ok(markdown.includes(`| ${PURPOSE_TEXT} |`), 'purpose text in row');
  // Glossary lives just above the footer
  const glossaryIdx = markdown.indexOf('📖 Bench glossary');
  const footerIdx = markdown.indexOf('<sub>Sample size: 50');
  assert.ok(glossaryIdx >= 0 && footerIdx >= 0 && glossaryIdx < footerIdx, 'glossary above footer');
});

test('glossary: omitted entirely when no metric has a purpose', () => {
  const root = writeSyntheticRepoRoot([{
    contents: [
      `const startMark = (name) => \`\${name}-start\`;`,
      `performance.mark(startMark('alpha'));`,
    ].join('\n'),
  }]);
  const dir = writeHandcraftedResults('alpha', [10, 11]);
  const { markdown, report } = runReporter({
    resultsDir: dir,
    sha: 'abc',
    msg: 'x',
    baseSha: 'def',
    repoRoot: root,
  });
  assert.ok(!markdown.includes('Bench glossary'), 'no glossary section');
  // JSON adjunct still carries the field per metric — null when absent.
  const m = report.metrics.find((x) => x.name === 'alpha');
  assert.equal(m.purpose, null);
});

test('glossary: rows sort alphabetically and skip metrics without a purpose', () => {
  // Three metrics in source order zebra/alpha/beta. Beta has no purpose;
  // alpha and zebra do. Glossary should list alpha then zebra, no beta.
  const root = writeSyntheticRepoRoot([{
    contents: [
      `const startMark = (name) => \`\${name}-start\`;`,
      `// purpose: zebra description`,
      `performance.mark(startMark('zebra'));`,
      `performance.mark(startMark('beta'));`,
      `// purpose: alpha description`,
      `performance.mark(startMark('alpha'));`,
    ].join('\n'),
  }]);
  // Build a results dir with all three metrics so the reporter has rows
  // for each, then assert glossary content.
  const baseDir = fs.mkdtempSync('/tmp/bench-purpose-results-');
  const data = {
    benchmarks: [],
  };
  const names = ['zebra', 'beta', 'alpha'];
  for (const name of names) {
    const diff = { absolute: { low: -1, high: 1 }, percentChange: { low: -5, high: 5 } };
    data.benchmarks.push({
      name: `this-change [${name}]`,
      measurement: { name, mode: 'performance', entryName: name },
      mean: { low: 10, high: 11 },
      differences: [],
    });
    data.benchmarks.push({
      name: `tip-of-tree [${name}]`,
      measurement: { name, mode: 'performance', entryName: name },
      mean: { low: 10, high: 11 },
      differences: [],
    });
    // Wire differences cross-references by index.
    const thisIdx = data.benchmarks.length - 2;
    const tipIdx = data.benchmarks.length - 1;
    data.benchmarks[thisIdx].differences = Array(data.benchmarks.length).fill(null);
    data.benchmarks[thisIdx].differences[tipIdx] = diff;
    data.benchmarks[tipIdx].differences = Array(data.benchmarks.length).fill(null);
    data.benchmarks[tipIdx].differences[thisIdx] = diff;
  }
  // Pad earlier differences arrays so all entries reference indices that
  // exist in the final benchmarks array.
  for (const b of data.benchmarks) {
    while (b.differences.length < data.benchmarks.length) { b.differences.push(null); }
  }
  fs.writeFileSync(path.join(baseDir, 'multi.json'), JSON.stringify(data));

  const { markdown } = runReporter({
    resultsDir: baseDir,
    sha: 'abc',
    msg: 'x',
    baseSha: 'def',
    repoRoot: root,
  });

  // Two annotated metrics → "(2 metrics)" in summary.
  assert.ok(markdown.includes('<summary>📖 Bench glossary (2 metrics)</summary>'));

  // Alphabetic order: alpha row precedes zebra row. Labels carry the
  // bench-file prefix (`test:alpha`, `test:zebra`).
  const alphaIdx = markdown.indexOf('test:alpha');
  const zebraIdx = markdown.indexOf('test:zebra');
  assert.ok(alphaIdx > 0, 'alpha row present');
  assert.ok(zebraIdx > 0, 'zebra row present');
  assert.ok(alphaIdx < zebraIdx, 'alpha sorts before zebra');

  // beta is absent from the glossary slice — no purpose comment for it.
  // (beta still appears in the headline "Too Fast" table since it has data.)
  const glossaryStart = markdown.indexOf('📖 Bench glossary');
  const glossaryEnd = markdown.indexOf('</details>', glossaryStart);
  const glossarySlice = markdown.slice(glossaryStart, glossaryEnd);
  assert.ok(!glossarySlice.includes('beta'), 'beta excluded from glossary');
});

test('security — malicious title, metric name, and baseline sha are neutralized', () => {
  // A fork PR controls the commit title, the artifact JSON (metric names),
  // and baseline-sha.txt. None may inject markup into the bot's comment.
  const dir = writeHandcraftedResults('ev`il|name', [8, 9], [10, 11], [-30, -20], 'notahex)evil');
  const { markdown } = runReporter({
    resultsDir: dir,
    sha: 'deadbeef',
    msg: '[pwn](https://evil.example) <img src=x>',
    repo: 'owner/repo',
  });
  assert.ok(markdown.includes('evilname'), 'metric name rendered with dangerous chars stripped');
  assert.ok(!markdown.includes('ev`il|name'), 'backtick and pipe stripped from metric name');
  assert.ok(markdown.includes('\\[pwn\\]'), 'title brackets escaped — no live link');
  assert.ok(markdown.includes('&lt;img src=x'), 'raw HTML entity-encoded in title');
  assert.ok(!markdown.includes('<img src=x'), 'no raw HTML tag survives');
  assert.ok(!markdown.includes('/commit/notahex'), 'non-hex baseline sha is not linked as a commit');
  assert.ok(markdown.includes('/tree/main'), 'base falls back to the ref tree');
});

#!/usr/bin/env node
/*
  Bench reporter — parses tachometer JSON output and emits:
    - bench-report.json  (structured adjunct for agent autoresearch)
    - comment.md         (rendered view for humans / PR comment)

  Usage:
    node reporter.js \
      --results <dir>         directory containing tachometer JSON outputs
      --sha <sha>             current commit SHA
      --msg <text>            current commit subject line
      --run-url <url>         link to the triggering workflow run
      --run-id <id>           numeric workflow_run id (used as link label)
      --base-ref <ref>        base branch name (e.g. "main")
      --base-sha <sha>        base commit SHA
      --repo <owner/name>     GitHub repo slug (falls back to $GITHUB_REPOSITORY)
      --repo-root <dir>       filesystem root for resolving bench sources (default: cwd)
      --wall-clock <seconds>  total bench run duration — footer metadata
      --history <path>        bench-history.json path (default: <repo-root>/tools/ci/bench/reporter/bench-history.json)
      --pr-history <path>     PR-iteration history from fetch-pr-history.js
      --scope <all|pr>        peak attribution scope. 'pr' restricts comparison
                              to PR-iteration history only (drops main-history
                              overlay; eliminates phantom REOPENEDs on test-only
                              PRs). 'all' merges main + PR (default).
      --out <dir>             output directory (default: ./bench-report)

  Cross-run taxonomy (WIN / TIED-PEAK / REOPENED) operates on within-session
  percent-delta CIs — the only number tachometer warrants for cross-iteration
  comparison. Drift detection walks main-history's chain of percent-deltas
  between baselines and renders ⚠️ when main moved enough on the metric to
  plausibly confound peak attribution within the PR.

  Schema: bench-history.json is schema_version 2.
*/

import fs from 'node:fs';
import path from 'node:path';

import { iterMetricPairs, readBaselineSha } from './extract-metrics.js';

const args = parseArgs(process.argv.slice(2));
const resultsDir = required(args, 'results');
const sha = required(args, 'sha');
const msg = args.msg ?? '';
const runUrl = args['run-url'] ?? '';
const runId = args['run-id'] ?? '';
const baseRef = args['base-ref'] ?? 'main';
// CLI override; falls back to the baseline-sha.txt sidecar each per-config
// artifact carries (see readBaselineSha, evaluated below). Without either,
// the Base header link falls back to the moving branch tip.
const baseShaArg = args['base-sha'] ?? '';
// Fall back to GITHUB_REPOSITORY so commit links work without an explicit
// --repo when running under Actions. Still honors --repo override when
// someone needs to pin a different repo (e.g. cross-fork comparison).
const repo = args.repo ?? process.env.GITHUB_REPOSITORY ?? '';
const repoRoot = args['repo-root'] ?? process.cwd();
const wallClockSec = args['wall-clock'] ? Number(args['wall-clock']) : null;
const historyPath = args.history ?? path.join(repoRoot, 'tools/ci/bench/reporter/bench-history.json');
const prHistoryPath = args['pr-history'] ?? '';
const outDir = args.out ?? './bench-report';
// 'pr' restricts peak attribution to PR-iteration history only — main-history
// commits round-robin'd against their own tip-of-trees, so cross-session
// comparison would mix iteration drift with environmental variance. 'all'
// merges both for push-to-main runs that want the full timeline.
const scope = args.scope ?? 'all';
if (scope !== 'all' && scope !== 'pr') {
  console.error(`Invalid --scope: ${scope}; expected 'all' or 'pr'`);
  process.exit(1);
}

const NOISE_FLOOR = 2; // percent — matches autoSampleConditions

// Per-sample timing jitter on shared GHA runners. OS scheduling, GC, and
// JIT contribute an ~absolute-constant noise floor that becomes wide in
// relative terms for short benches. Used as the fallback when a bench
// cell hasn't accumulated enough samples to estimate σ from its own
// data (see SIGMA_SAMPLE_FLOOR). Calibrated empirically: zero-delta
// observed CI widths fit a σ≈2ms model well for most benches.
const SIGMA_ABS_MS = 2;

// Minimum sample count for trusting a per-cell σ estimate. Below this,
// the estimate is itself too noisy to drive the Expected Noise column;
// fall back to the global SIGMA_ABS_MS. The sampleSize=50 floor in our
// configs means most cells clear this comfortably; cells that hit the
// timeout before reaching it get the safer fallback.
const SIGMA_SAMPLE_FLOOR = 20;

// Classification tolerance. Observed / expected ratio below this counts as
// "explained by duration-based noise floor" → noise-floor-limited bucket.
// Above → genuine "unsure, more samples or investigation needed" bucket.
const NOISE_RATIO_TOLERANCE = 2;

// Severity thresholds for per-row emoji prefix on Faster/Slower tables.
// Applied to |midpoint of percent-change CI|. Below the first threshold,
// no emoji — the row is already in a faster/slower bucket, which is its
// own signal; the emoji marks magnitude beyond confirmation.
const SEVERITY_SIGNIFICANT = 15;
const SEVERITY_VERY_SIGNIFICANT = 35;
const SEVERITY_EXTREME = 75;

// Auto-expand up to this row count; above, show a teaser + collapsible.
const AUTO_EXPAND_MAX = 15;
const TEASER_ROWS = 5;

// Bisect candidates in the markdown "Regressions from peak" table are
// capped at this count (nearest-to-peak bias); the full list is always
// present in the JSON adjunct for agent use.
const BISECT_MARKDOWN_MAX = 3;

// Cumulative main-side drift (in percentage points) above which a row
// renders the baseline-drift flag. Below this, drift is in the runner
// noise floor across the chain anyway; flagging would clutter every
// long-running PR.
const DRIFT_THRESHOLD_PP = 5;

// Max length of the rendered purpose text (the comment body after
// `// purpose:`). Longer purposes truncate with a single ellipsis char.
// Bench files SHOULD honor the same cap at authoring time, but the
// reporter is the defense in depth.
const PURPOSE_MAX_CHARS = 120;

// Cross-iteration peak-attribution sections. Both REOPENED ("regression")
// and WIN ("win") render the same shape: heading, description, table of
// metric / current / peak / vs peak / candidates, with drift footnotes when
// peak and current had different baselines and main moved enough to confound
// the comparison. Only the framing (status filter, sort direction, copy,
// delta wording) differs.
const PEAK_SECTIONS = {
  regression: {
    status: 'REOPENED',
    headingPrefix: '📜 Regressions from peak',
    description:
      `These metrics were faster on an earlier push to this PR. The most recent candidate is usually where to look.`,
    columnHeader: '| metric | regression | prior peak | likely candidates |',
    // Largest % regression first (descending on signed delta).
    sortSign: -1,
    // delta_from_peak_pct is positive for REOPENED (current is worse). Show
    // bare magnitude — the column header already encodes direction.
    formatDelta: (delta) => `${Math.abs(delta).toFixed(0)}%`,
  },
  win: {
    status: 'WIN',
    headingPrefix: '🏆 New peaks',
    description: `These metrics hit a new best on this PR. The most recent candidate is usually the cause.`,
    columnHeader: '| metric | improvement | prior peak | likely candidates |',
    // Most-improved first. delta_from_peak_pct is negative for WIN, so
    // ascending sort surfaces the best.
    sortSign: 1,
    formatDelta: (delta) => `${Math.abs(delta).toFixed(0)}%`,
  },
};

/**
 * Expected percent-change CI width for an unresolved CI given the bench's
 * absolute duration. Derived from the standard-error-of-the-difference of
 * two means at sampleSize=50, σ per sample, z=1.96:
 *   abs_CI_width ≈ 2 * 1.96 * sqrt(2) * σ / sqrt(50) ≈ 0.784 * σ
 *   pct_width = abs_CI_width / mean * 100
 *
 * `sigma` defaults to the global SIGMA_ABS_MS calibration. When samples
 * exist for the bench cell, callers pass a per-cell σ estimated from
 * those samples — heavy-allocation benches like clear-10k empirically
 * run σ≈17ms vs the global 2ms, so the Expected Noise column was
 * under-predicting their resolution floor by 4-9×.
 */
function expectedNoisePp(meanMs, sigma = SIGMA_ABS_MS) {
  return (0.784 * sigma) / meanMs * 100;
}

/**
 * Sample standard deviation. Returns null when the array is too small
 * to trust (< SIGMA_SAMPLE_FLOOR). Uses Bessel-corrected variance.
 */
function sampleSigma(samples) {
  if (!Array.isArray(samples) || samples.length < SIGMA_SAMPLE_FLOOR) { return null; }
  const n = samples.length;
  let sum = 0;
  for (const v of samples) { sum += v; }
  const mean = sum / n;
  let sq = 0;
  for (const v of samples) { sq += (v - mean) ** 2; }
  return Math.sqrt(sq / (n - 1));
}

const benchDirs = findBenchDirs(repoRoot);
const benchIndex = indexBenchFiles(benchDirs, repoRoot);
const mainHistory = loadHistory(historyPath);
const prHistory = loadHistory(prHistoryPath);
const peakHistory = scope === 'pr' ? prHistory : mergeHistories(mainHistory, prHistory);
// Drift always walks main-history regardless of peak scope — the chain of
// per-commit percent-deltas is what quantifies how the baseline itself moved.
const driftHistory = mainHistory;
const currentBaselineSha = readBaselineSha(resultsDir);
const baseSha = baseShaArg || currentBaselineSha || '';
const metrics = loadAllMetrics(resultsDir);
const report = buildReport(metrics);
const markdown = renderMarkdown(report);

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'bench-report.json'), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(outDir, 'comment.md'), markdown);

console.log(`Wrote ${outDir}/bench-report.json and ${outDir}/comment.md`);
console.log(
  `Summary: ${report.summary.faster} faster, ${report.summary.slower} slower, `
    + `${report.summary['within-noise']} within noise, ${report.summary.unsure} unsure, `
    + `${report.summary['noise-floor-limited']} noise-floor-limited`,
);

/**
 * Project paired tachometer benchmarks into the shape buildReport consumes.
 * Skips metrics without a tip-of-tree counterpart or differences[] entry —
 * the comment renderer needs both sides plus the precomputed diff.
 */
function loadAllMetrics(dir) {
  const out = [];
  for (const { name, current, base, diff } of iterMetricPairs(dir)) {
    if (!base || !diff) { continue; }
    out.push({
      name,
      thisChangeMs: [current.bm.mean.low, current.bm.mean.high],
      tipOfTreeMs: [base.bm.mean.low, base.bm.mean.high],
      absoluteMsDelta: [diff.absolute.low, diff.absolute.high],
      percentDelta: [diff.percentChange.low, diff.percentChange.high],
      baselineSha: currentBaselineSha || null,
      sampleCount: current.bm.samples?.length ?? 0,
      sigmaMs: sampleSigma(current.bm.samples),
    });
  }
  out.sort((a, b) => a.name.localeCompare(b.name));
  return out;
}

/**
 * Classify + summarize. Status rule (NOISE_FLOOR = 2%):
 *   faster               — CI entirely below -2%
 *   slower               — CI entirely above +2%
 *   within-noise         — CI entirely inside [-2%, +2%]
 *   noise-floor-limited  — CI straddles ±2% AND width ≤ NOISE_RATIO_TOLERANCE ×
 *                          expected duration-derived noise floor (not a signal;
 *                          the bench's resolution ceiling is below ±2% given its
 *                          duration on this runner)
 *   unsure               — CI straddles ±2% AND width exceeds the duration-derived
 *                          floor by more than the tolerance (genuine boundary case;
 *                          more samples may help, or bench is noisier than duration
 *                          predicts → worth inspecting)
 */
function buildReport(metrics) {
  const classified = metrics.map((m) => {
    const meanMs = (m.thisChangeMs[0] + m.thisChangeMs[1]) / 2;
    const widthPp = m.percentDelta[1] - m.percentDelta[0];
    // Per-cell σ when the cell has enough samples; SIGMA_ABS_MS otherwise.
    const sigma = m.sigmaMs ?? SIGMA_ABS_MS;
    const expectedPp = expectedNoisePp(meanMs, sigma);
    const ratio = expectedPp > 0 ? widthPp / expectedPp : Infinity;
    const indexed = benchIndex.get(m.name);
    const source = indexed?.source ?? null;
    const purpose = indexed?.purpose ?? null;
    const historyStatus = computeHistoryStatus(m, peakHistory, driftHistory);
    return {
      ...m,
      meanMs,
      widthPp,
      expectedPp,
      ratio,
      source,
      purpose,
      historyStatus,
      status: classify(m.percentDelta, ratio),
    };
  });
  const summary = { faster: 0, slower: 0, 'within-noise': 0, unsure: 0, 'noise-floor-limited': 0 };
  for (const m of classified) { summary[m.status]++; }
  const historySummary = historyStatusCounts(classified);
  return {
    head: { sha, msg, ref: process.env.GITHUB_HEAD_REF || '' },
    base: { sha: baseSha, ref: baseRef },
    run: { url: runUrl, id: runId || extractRunIdFromUrl(runUrl) },
    repo,
    wall_clock_seconds: wallClockSec,
    noise_floor_percent: NOISE_FLOOR,
    sigma_abs_ms: SIGMA_ABS_MS,
    noise_ratio_tolerance: NOISE_RATIO_TOLERANCE,
    summary,
    history_summary: historySummary,
    history_available: peakHistory !== null && peakHistory.commits.length > 0,
    scope,
    metrics: classified.map(toJsonMetric),
  };
}

/**
 * Count metrics by cross-run status. Returns null keys only when the
 * history file is empty/missing; otherwise three counters always present.
 */
function historyStatusCounts(classified) {
  const out = { WIN: 0, 'TIED-PEAK': 0, REOPENED: 0, 'no-history': 0 };
  for (const m of classified) {
    if (!m.historyStatus) {
      out['no-history']++;
      continue;
    }
    out[m.historyStatus.status]++;
  }
  return out;
}

function classify([low, high], ratio) {
  if (high < -NOISE_FLOOR) { return 'faster'; }
  if (low > NOISE_FLOOR) { return 'slower'; }
  if (low > -NOISE_FLOOR && high < NOISE_FLOOR) { return 'within-noise'; }
  return ratio <= NOISE_RATIO_TOLERANCE ? 'noise-floor-limited' : 'unsure';
}

function toJsonMetric(m) {
  const out = {
    name: m.name,
    status: m.status,
    percent_change_ci: round2(m.percentDelta),
    absolute_ms_ci: round4(m.absoluteMsDelta),
    this_change_ms_ci: round4(m.thisChangeMs),
    tip_of_tree_ms_ci: round4(m.tipOfTreeMs),
    mean_ms: Number(m.meanMs.toFixed(2)),
    expected_noise_pp: Number(m.expectedPp.toFixed(2)),
    observed_noise_ratio: Number(m.ratio.toFixed(2)),
    sigma_ms: m.sigmaMs != null ? Number(m.sigmaMs.toFixed(2)) : null,
    sample_count: m.sampleCount ?? 0,
    source: m.source,
    purpose: m.purpose ?? null,
    baseline_sha: m.baselineSha ?? null,
  };
  if (m.historyStatus) {
    out.history_status = m.historyStatus.status;
    out.peak = m.historyStatus.peak;
    out.delta_from_peak_pct = m.historyStatus.delta_from_peak_pct;
    out.bisect_candidates = m.historyStatus.bisect_candidates;
    if (m.historyStatus.drift?.detected) {
      out.drift = m.historyStatus.drift;
    }
  }
  return out;
}

/**
 * Markdown renderer. Layout:
 *   1. Top header: h3 with state emoji + commit link + "on Benchmark Suite 📊"
 *   2. Metadata line: Base · Action · Raw (bench-report.json link)
 *   3. GitHub alert block with verdict copy
 *   4. Results count line (inline with · separators)
 *   5. Horizontal rule separator
 *   6. Faster table (auto-expanded ≤15, teaser + details above)
 *   7. Slower table (same behavior)
 *   8. No Change collapsible
 *   9. Unsure collapsible with Inconclusive + Too Fast to Measure Precisely subsections
 *  10. Footer: sample size · floor · timeout · wall-clock
 */
function renderMarkdown(report) {
  const faster = report.metrics.filter((m) => m.status === 'faster');
  const slower = report.metrics.filter((m) => m.status === 'slower');
  const noChange = report.metrics.filter((m) => m.status === 'within-noise');
  const inconclusive = report.metrics.filter((m) => m.status === 'unsure');
  const tooFast = report.metrics.filter((m) => m.status === 'noise-floor-limited');

  const lines = [];

  // ─── Top header + metadata ───────────────────────────────────────────
  const state = determineState(report.summary);
  const shortSha = report.head.sha.slice(0, 7);
  const commitLink = report.repo
    ? `[\`${shortSha}\`](https://github.com/${report.repo}/commit/${report.head.sha})`
    : `\`${shortSha}\``;
  lines.push(`### ${state.emoji} ${state.heading} for ${commitLink} on Benchmark Suite 📊`);
  lines.push('');

  const metaParts = [];
  metaParts.push(`**Base:** ${baseLinkFor(report)}`);
  if (report.run.url) {
    // Label the run link with its numeric id — useful for `gh run view <id>`
    // copy-paste and avoids the ↗ arrow's valign drift. Falls back to "run"
    // if the URL shape doesn't parse (unlikely under workflow_run trigger).
    const runId = report.run.id || extractRunIdFromUrl(report.run.url);
    const runLabel = runId ? `#${runId}` : 'run';
    metaParts.push(`**Action:** [${runLabel}](${report.run.url})`);
    metaParts.push(`**Raw:** [\`bench-report.json\`](${report.run.url}/artifacts)`);
  }
  lines.push(metaParts.join(' · '));
  lines.push('');

  if (report.head.msg) {
    lines.push(`<sup>${escape(report.head.msg)}</sup>`);
    lines.push('');
  }

  // ─── Alert block ─────────────────────────────────────────────────────
  lines.push(`> [!${state.alertType}]`);
  lines.push(`> ${state.body}`);
  lines.push('');

  // ─── Results count line ──────────────────────────────────────────────
  const unsureTotal = inconclusive.length + tooFast.length;
  const resultsParts = [
    `✅ ${faster.length} faster`,
    `❌ ${slower.length} slower`,
    `🔍 ${unsureTotal} unsure`,
    `⚪ ${noChange.length} no change`,
  ];
  const winCount = report.history_summary?.WIN ?? 0;
  if (winCount > 0) {
    resultsParts.push(`🏆 ${winCount} new peak${winCount === 1 ? '' : 's'}`);
  }
  const reopenedCount = report.history_summary?.REOPENED ?? 0;
  if (reopenedCount > 0) {
    resultsParts.push(`📜 ${reopenedCount} reopened`);
  }
  lines.push(resultsParts.join(' · '));
  lines.push('');
  lines.push('---');
  lines.push('');

  // ─── Faster ──────────────────────────────────────────────────────────
  if (faster.length > 0) {
    renderFasterSlowerSection(lines, faster, 'faster', report);
  }

  // ─── Slower ──────────────────────────────────────────────────────────
  if (slower.length > 0) {
    renderFasterSlowerSection(lines, slower, 'slower', report);
  }

  // ─── New peaks (cross-run; auto-expanded when present) ───────────────
  renderPeakSection(lines, report, 'win');

  // ─── Regressions from peak (cross-run; auto-expanded when present) ───
  renderPeakSection(lines, report, 'regression');

  // ─── No Change (always collapsed) ────────────────────────────────────
  if (noChange.length > 0) {
    lines.push('<details>');
    lines.push(`<summary>⚪ No Change (${noChange.length})</summary>`);
    lines.push('');
    lines.push(
      `Metrics where this PR measured within ±${NOISE_FLOOR}% of \`${report.base.ref}\` — no meaningful performance change detected.`,
    );
    lines.push('');
    lines.push('| metric | Change |');
    lines.push('|---|---|');
    for (const m of noChange) {
      lines.push(`| ${metricLink(m, report)} | ${fmtPctRange(m.percent_change_ci)} |`);
    }
    lines.push('');
    lines.push('</details>');
    lines.push('');
  }

  // ─── Unsure (always collapsed, two subsections inside) ───────────────
  if (unsureTotal > 0) {
    lines.push('<details>');
    lines.push(`<summary>🔍 Unsure (${unsureTotal})</summary>`);
    lines.push('');

    if (inconclusive.length > 0) {
      lines.push(`#### Inconclusive (${inconclusive.length})`);
      lines.push('');
      lines.push(
        `The CI crossed ±${NOISE_FLOOR}% and is wider than this bench's duration usually produces. More samples may settle these.`,
      );
      lines.push('');
      lines.push('| metric | Change | Expected Noise |');
      lines.push('|---|---|---|');
      for (const m of inconclusive) {
        lines.push(
          `| ${metricLink(m, report)} | ${fmtPctRange(m.percent_change_ci)} | ±${m.expected_noise_pp.toFixed(0)}% |`,
        );
      }
      lines.push('');
    }

    if (tooFast.length > 0) {
      lines.push(`#### Too Fast to Measure Precisely (${tooFast.length})`);
      lines.push('');
      lines.push(
        `On benches this short, OS jitter, GC, and JIT pauses drown out anything under ${
          SIGMA_ABS_MS * 2
        }%. Bigger changes than that still show up.`,
      );
      lines.push('');
      lines.push('| metric | Change | Test Time | Expected Noise |');
      lines.push('|---|---|---|---|');
      for (const m of tooFast) {
        lines.push(
          `| ${metricLink(m, report)} | ${fmtPctRange(m.percent_change_ci)} | ~${m.mean_ms.toFixed(0)}ms | ±${
            m.expected_noise_pp.toFixed(0)
          }% |`,
        );
      }
      lines.push('');
    }

    lines.push('</details>');
    lines.push('');
  }

  // ─── Glossary (only when at least one metric has a purpose) ──────────
  renderGlossarySection(lines, report);

  // ─── Footer ──────────────────────────────────────────────────────────
  lines.push('---');
  // Sample size: report the floor + max actually reached. Cells auto-sample
  // up to the timeout when their CI hasn't converged at the 2% threshold,
  // so PR-iteration runs can range 50→several hundred. Bare "Sample size:
  // 50" obscured the auto-sample tail, so a hot bench whose cell ran 280
  // samples looked the same in the footer as a cold one that never moved
  // off the floor.
  const sampleCounts = report.metrics.map((m) => m.sample_count).filter((n) => n > 0);
  const sampleFloor = sampleCounts.length ? Math.min(...sampleCounts) : 50;
  const sampleMax = sampleCounts.length ? Math.max(...sampleCounts) : 50;
  const sampleSizeStr = sampleFloor === sampleMax
    ? `Sample size: ${sampleFloor}`
    : `Sample size: ${sampleFloor} floor / ${sampleMax} max`;
  const footerParts = [
    sampleSizeStr,
    `Noise floor: ±${NOISE_FLOOR}%`,
    'Timeout: 3min',
  ];
  if (report.wall_clock_seconds != null) {
    footerParts.push(`Wall-clock: ${formatWallClock(report.wall_clock_seconds)}`);
  }
  lines.push(`<sub>${footerParts.join(' · ')}</sub>`);

  return lines.join('\n');
}

/**
 * Append a collapsible glossary mapping each annotated metric to its
 * purpose comment. Only metrics with a non-null `purpose` appear; a run
 * with zero annotated metrics emits nothing. Sorted alphabetically by
 * metric name. The metric column links to the same source location as
 * the headline tables.
 */
function renderGlossarySection(lines, report) {
  const rows = report.metrics.filter((m) => m.purpose);
  if (rows.length === 0) { return; }
  // Composite sort: groupid (bench-file prefix) first, testid (metric name)
  // within group. Bare-metric-alpha mixed suites visually random — grouping
  // by suite reads as "all todo:* together, then all template:*".
  const sorted = [...rows].sort((a, b) => {
    const pa = benchPrefix(a.source?.path) ?? '';
    const pb = benchPrefix(b.source?.path) ?? '';
    if (pa !== pb) { return pa.localeCompare(pb); }
    return a.name.localeCompare(b.name);
  });
  lines.push('<details>');
  lines.push(`<summary>📖 Bench glossary (${sorted.length} metric${sorted.length === 1 ? '' : 's'})</summary>`);
  lines.push('');
  lines.push('| metric | what it tests |');
  lines.push('|---|---|');
  for (const m of sorted) {
    lines.push(`| ${metricLink(m, report)} | ${m.purpose} |`);
  }
  lines.push('');
  lines.push('</details>');
  lines.push('');
}

/**
 * Append a cross-iteration peak-attribution section. `kind === 'regression'`
 * surfaces REOPENED metrics (peak dominates current); `kind === 'win'`
 * surfaces WIN metrics (current dominates peak). Drift footnotes fire when
 * peak and current had different baselines and main moved enough to confound
 * the comparison. Symmetric across both kinds because false-blame and
 * false-credit are the same kind of attribution failure in opposite directions.
 *
 * Surface units: within-session percent-deltas vs each iteration's baseline.
 * `delta_from_peak_pct` is the difference between those midpoints, rendered
 * in the same `%` unit as the table cells.
 */
function renderPeakSection(lines, report, kind) {
  const config = PEAK_SECTIONS[kind];
  // Same-session classification wins on dedup for the unsure bucket.
  // A metric in Inconclusive (CI straddles ±2% AND wider than the
  // duration-derived floor predicts) shouldn't ALSO appear in a
  // "regressed from peak" table — the two framings read as contradictory
  // (filter-cycle-20 audited as the canonical case). Noise-floor-limited
  // metrics stay eligible: the cross-iteration framing operates on
  // delta_from_peak_pct, which can resolve cleanly even when same-session
  // is at its resolution floor.
  const rows = report.metrics.filter((m) => (
    m.history_status === config.status && m.status !== 'unsure'
  ));
  if (rows.length === 0) { return; }

  const sorted = [...rows].sort(
    (a, b) => config.sortSign * ((a.delta_from_peak_pct ?? 0) - (b.delta_from_peak_pct ?? 0)),
  );

  lines.push(`#### ${config.headingPrefix} (${rows.length})`);
  lines.push('');
  lines.push(config.description);
  lines.push('');
  lines.push(config.columnHeader);
  lines.push('|---|---|---|---|');

  const flagged = [];

  for (const m of sorted) {
    const peakLink = commitOrPrLink(m.peak, report.repo);
    const deltaStr = config.formatDelta(m.delta_from_peak_pct);
    const candCell = formatCandidateCell(
      m.bisect_candidates,
      report.repo,
      m.peak.sha,
      report.head.sha,
    );

    // Drift fires only when the chain quantifies a meaningful main-side move.
    // Chain-gap cases (magnitude unavailable) don't render — the warning was
    // unactionable noise, especially on long-lived PRs whose peak baselines
    // age out of bench-history.
    let driftFlag = '';
    if (m.drift?.detected) {
      const mag = m.drift.magnitude;
      const fires = mag !== null && Math.abs(mag) >= DRIFT_THRESHOLD_PP;
      if (fires) {
        const idx = flagged.length + 1;
        driftFlag = ` ⚠️${idx}`;
        flagged.push({
          idx,
          metric: m.name,
          drift: m.drift,
          currentBaseline: m.baseline_sha,
          peakBaseline: m.peak.baseline_sha,
        });
      }
    }

    lines.push(
      `| ${metricLink(m, report)} | ${deltaStr}${driftFlag} | ${peakLink} | ${candCell} |`,
    );
  }
  lines.push('');

  if (flagged.length > 0) {
    for (const f of flagged) {
      lines.push(formatDriftFootnote(f));
    }
    lines.push('');
  }
}

/**
 * Render the comma-joined candidate cell for peak-attribution tables. Same
 * shape for bisect (regression) and credit (win) sides — only the column
 * heading differs at the call site.
 *
 * Display order is reverse-chronological (newest first) so the eye lands
 * on the most-likely culprit per the section description's recent-bias
 * heuristic. JSON `bisect_candidates` stays chronological for agent
 * stability.
 *
 * On overflow, the `+N more` tail becomes a link to GitHub's compare view
 * for `peakSha...currentSha`. Compare view shows commits + cumulative diff
 * across the range — a single click takes a reviewer to the full bisect
 * surface. Note: compare includes commits we filtered out of `candidates`
 * (harness-only, cancelled runs); the explicit list narrows, the compare
 * link broadens for context.
 */
function formatCandidateCell(candidates, repo, peakSha, currentSha) {
  if (!candidates || candidates.length === 0) { return '—'; }
  const ordered = [...candidates].reverse();
  const md = ordered
    .slice(0, BISECT_MARKDOWN_MAX)
    .map((c) => commitOrPrLink(c, repo))
    .join(', ');
  if (ordered.length <= BISECT_MARKDOWN_MAX) { return md; }
  const remaining = ordered.length - BISECT_MARKDOWN_MAX;
  if (!repo || !peakSha || !currentSha) {
    return `${md} +${remaining} more`;
  }
  const compareUrl = `https://github.com/${repo}/compare/${peakSha}...${currentSha}`;
  return `${md} ([+${remaining} more](${compareUrl}))`;
}

function formatDriftFootnote({ idx, metric, drift, currentBaseline, peakBaseline }) {
  const peakSha = peakBaseline ? peakBaseline.slice(0, 7) : '?';
  const currentSha = currentBaseline ? currentBaseline.slice(0, 7) : '?';
  const sign = drift.magnitude > 0 ? '+' : '';
  const links = drift.chain_len === 1 ? '1 main commit' : `${drift.chain_len} main commits`;
  return (
    `⚠️${idx} main moved ${sign}${drift.magnitude.toFixed(0)}pp on \`${metric}\` `
    + `between baselines (\`${peakSha}\` → \`${currentSha}\`, chained across ${links}). `
    + `Comparison may include main-side change.`
  );
}

/**
 * Render a Faster or Slower section with severity emoji suffix and the
 * >15-row teaser pattern. Sorts by absolute |Δ%| descending.
 */
function renderFasterSlowerSection(lines, rows, direction, report) {
  const sorted = [...rows].sort(
    (a, b) => Math.abs(mid(b.percent_change_ci)) - Math.abs(mid(a.percent_change_ci)),
  );
  const heading = direction === 'faster' ? `✅ Faster (${rows.length})` : `❌ Slower (${rows.length})`;
  const sentence = direction === 'faster'
    ? `Metrics where this PR confidently improved performance compared to \`${report.base.ref}\`.`
    : `Metrics where this PR confidently regressed performance compared to \`${report.base.ref}\`.`;
  const headerRow = direction === 'faster' ? '| metric | Improvement |' : '| metric | Regression |';

  const renderTable = (group) => {
    lines.push(headerRow);
    lines.push('|---|---|');
    for (const m of group) {
      lines.push(`| ${metricLink(m, report)} | ${fmtSinglePoint(m, direction)} |`);
    }
    lines.push('');
  };

  if (rows.length <= AUTO_EXPAND_MAX) {
    lines.push(`#### ${heading}`);
    lines.push('');
    lines.push(sentence);
    lines.push('');
    renderTable(sorted);
  }
  else {
    lines.push(`#### ${heading} — top ${TEASER_ROWS} shown`);
    lines.push('');
    lines.push(sentence);
    lines.push('');
    renderTable(sorted.slice(0, TEASER_ROWS));
    lines.push('<details>');
    lines.push(`<summary>Show all ${rows.length} ${direction} metrics</summary>`);
    lines.push('');
    renderTable(sorted);
    lines.push('</details>');
    lines.push('');
  }
}

/**
 * Determine the headline state from summary counts.
 * Returns { emoji, heading, alertType, body } for the top banner.
 */
function determineState(summary) {
  const f = summary.faster;
  const s = summary.slower;
  if (f > 0 && s === 0) {
    return {
      emoji: '✅',
      heading: 'Improvement',
      alertType: 'TIP',
      body: `This PR improves ✅ ${f} test${f === 1 ? '' : 's'}.`,
    };
  }
  if (s > 0 && f === 0) {
    return {
      emoji: '❌',
      heading: 'Regression',
      alertType: 'CAUTION',
      body: `This PR regresses on ❌ ${s} test${s === 1 ? '' : 's'}.`,
    };
  }
  if (f > 0 && s > 0) {
    const modifier = f > s ? 'mostly faster' : s > f ? 'mostly slower' : 'balanced';
    const conjunction = modifier === 'balanced' ? 'and regresses on' : 'while regressing on';
    return {
      emoji: '🟡',
      heading: `Mixed (${modifier})`,
      alertType: 'WARNING',
      body: `This PR improves ✅ ${f} test${f === 1 ? '' : 's'} ${conjunction} ❌ ${s} test${s === 1 ? '' : 's'}.`,
    };
  }
  return {
    emoji: '⚪',
    heading: 'No Meaningful Change',
    alertType: 'NOTE',
    body: 'This PR did not move any measured metrics.',
  };
}

/** Severity emoji suffix (leading space for separation), keyed on |mid %|. */
function severitySuffix(midPct, direction) {
  const m = Math.abs(midPct);
  if (m < SEVERITY_SIGNIFICANT) { return ''; }
  if (direction === 'faster') {
    if (m >= SEVERITY_EXTREME) { return ' 🏆'; }
    if (m >= SEVERITY_VERY_SIGNIFICANT) { return ' 🌟'; }
    return ' ⭐';
  }
  if (m >= SEVERITY_EXTREME) { return ' 🚨'; }
  if (m >= SEVERITY_VERY_SIGNIFICANT) { return ' ‼️'; }
  return ' ❗';
}

/**
 * Single-point cell value for Faster/Slower tables: `-71% (14ms) 🌟`.
 * Percentage is signed (carries direction); ms is unsigned (sign inferred
 * from section context). Severity emoji trails so number columns align
 * vertically across rows — don't lead with the emoji or alignment breaks.
 */
function fmtSinglePoint(m, direction) {
  const midPct = mid(m.percent_change_ci);
  const midMs = Math.abs(mid(m.absolute_ms_ci));
  const pctSign = midPct > 0 ? '+' : '';
  return `${pctSign}${Math.round(midPct)}% (${Math.round(midMs)}ms)${severitySuffix(midPct, direction)}`;
}

/**
 * `bench-todo.js` → `todo`. Strips the `bench-` prefix and `.js` suffix from
 * the source filename to use as a suite hint in metric labels. Returns null
 * when the source isn't resolved (metric falls back to bare name).
 */
function benchPrefix(sourcePath) {
  if (!sourcePath) { return null; }
  const file = sourcePath.split('/').pop();
  const stripped = file.replace(/^bench-/, '').replace(/\.js$/, '');
  return stripped || null;
}

/**
 * Metric name → markdown link to bench source at run's SHA, or plain code
 * if unresolved. Label is prefixed with the bench-file basename
 * (`todo:bulk-add-500`) so reviewers can group rows by suite at a glance —
 * disambiguates `remove-*` / `clear-*` operations that exist in both
 * `bench-todo` and `bench-krausest`.
 */
function metricLink(m, report) {
  const prefix = benchPrefix(m.source?.path);
  const display = prefix ? `${prefix}:${m.name}` : m.name;
  const label = `\`${display}\``;
  if (!report.repo || !m.source) { return label; }
  const hashPart = m.source.line ? `#L${m.source.line}` : '';
  return `[${label}](https://github.com/${report.repo}/blob/${report.head.sha}/${m.source.path}${hashPart})`;
}

/**
 * Link a history entry to its PR (preferred) or commit. Label is the
 * short SHA; the PR URL just takes you to the conversation page where
 * the bench comment from that run was posted — which is where a
 * reviewer actually wants to go when investigating a REOPENED regression.
 * Falls back to commit URL when the commit wasn't a squash-merge (no
 * `(#N)` in message) and plain text when no repo is configured.
 */
function commitOrPrLink(entry, repo) {
  const shortSha = entry.sha.slice(0, 7);
  if (!repo) { return `\`${shortSha}\``; }
  const url = entry.pr
    ? `https://github.com/${repo}/pull/${entry.pr}`
    : `https://github.com/${repo}/commit/${entry.sha}`;
  return `[\`${shortSha}\`](${url})`;
}

/**
 * Base link. Prefers the specific commit SHA when known (stable permalink);
 * falls back to the branch tree view when only the ref is available. Always
 * a hyperlink when repo is present — the ref is obvious but linking keeps
 * visual symmetry with the linked head SHA in the heading.
 */
function baseLinkFor(report) {
  if (!report.repo) { return `\`${report.base.ref}\``; }
  const target = report.base.sha
    ? `https://github.com/${report.repo}/commit/${report.base.sha}`
    : `https://github.com/${report.repo}/tree/${report.base.ref}`;
  return `[${report.base.ref}](${target})`;
}

/**
 * Extract the numeric run id from a workflow_run URL.
 *   `https://github.com/<org>/<repo>/actions/runs/<id>` → `<id>`
 * Returns `''` if the URL doesn't match. Used as a label fallback when
 * --run-id isn't passed explicitly.
 */
function extractRunIdFromUrl(url) {
  const match = /\/actions\/runs\/(\d+)/.exec(url ?? '');
  return match ? match[1] : '';
}

/** Auto-discover packages/*\/bench/tachometer/ dirs relative to repoRoot. */
function findBenchDirs(root) {
  const packagesDir = path.join(root, 'packages');
  if (!fs.existsSync(packagesDir)) { return []; }
  return fs.readdirSync(packagesDir)
    .map((pkg) => path.join('packages', pkg, 'bench', 'tachometer'))
    .filter((rel) => fs.existsSync(path.join(root, rel)));
}

/**
 * Single-pass index of all bench `.js` files under `dirs`. Walks each
 * file once and records, for every `performance.mark` site, the source
 * location and the optional `// purpose: <text>` comment on the
 * immediately preceding line.
 *
 * Matches both the canonical `performance.mark(startMark('<name>'))` form
 * (used across the workload bench files) and the bare
 * `performance.mark('<name>')` form (used in older one-off benches like
 * `signature.js`). First match per metric name wins.
 *
 * The map keys on metric name; values are `{ source: { path, line },
 * purpose: string | null }`. Empty purpose text (`// purpose:` with no
 * body) yields `purpose: null` so the glossary skips those rows
 * consistent with `null` from no-comment cases.
 *
 * Purpose text is truncated at PURPOSE_MAX_CHARS with a single ellipsis
 * (…) to keep glossary rows compact.
 *
 * Lets `fs.readFileSync` errors propagate so a missing/unreadable bench
 * file fails CI loudly rather than silently dropping a metric.
 */
function indexBenchFiles(dirs, root) {
  const index = new Map();
  const markNeedle = /performance\.mark\(\s*(?:startMark\(\s*)?['"`]([^'"`]+)['"`]/;
  const purposeNeedle = /^\s*\/\/\s*purpose:\s*(.*?)\s*$/;
  for (const dir of dirs) {
    const full = path.join(root, dir);
    let entries;
    try {
      entries = fs.readdirSync(full);
    }
    catch {
      continue;
    }
    for (const file of entries) {
      if (!file.endsWith('.js')) { continue; }
      const relPath = path.join(dir, file);
      const lines = fs.readFileSync(path.join(root, relPath), 'utf8').split('\n');
      for (let i = 0; i < lines.length; i++) {
        const m = markNeedle.exec(lines[i]);
        if (!m) { continue; }
        const name = m[1];
        if (index.has(name)) { continue; }
        const source = { path: relPath, line: i + 1 };
        let purpose = null;
        if (i > 0) {
          const prev = purposeNeedle.exec(lines[i - 1]);
          if (prev && prev[1].length > 0) {
            purpose = prev[1].length <= PURPOSE_MAX_CHARS
              ? prev[1]
              : `${prev[1].slice(0, PURPOSE_MAX_CHARS - 1)}…`;
          }
        }
        index.set(name, { source, purpose });
      }
    }
  }
  return index;
}

/** Format seconds → `10m42s` / `42s`. */
function formatWallClock(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return m > 0 ? `${m}m${s.toString().padStart(2, '0')}s` : `${s}s`;
}

/**
 * Merge main-commit history (bench-history.json) with PR-iteration
 * history (pr-history.json) into a single timeline sorted by timestamp.
 * Peak attribution then looks across BOTH main AND this PR's iterations
 * to find the best-ever CI per metric.
 */
function mergeHistories(mainHist, prHist) {
  if (!mainHist && !prHist) { return null; }
  const commits = [
    ...(mainHist?.commits ?? []),
    ...(prHist?.commits ?? []),
  ];
  const seen = new Set();
  const deduped = commits.filter((c) => {
    if (seen.has(c.sha)) { return false; }
    seen.add(c.sha);
    return true;
  });
  // Chronological so bisect candidates land in causal order.
  deduped.sort((a, b) => (a.timestamp ?? '').localeCompare(b.timestamp ?? ''));
  return { schema_version: 2, commits: deduped };
}

/**
 * Load bench-history.json. Returns null on missing/empty/invalid — peak
 * attribution gracefully degrades on null. Schema v2 only.
 *
 * Sort on read because `computeBaselineDrift` walks `commits` by index,
 * and the rebase-retry path on push-to-main can land entries with
 * non-monotonic timestamps.
 */
function loadHistory(filePath) {
  if (!filePath || !fs.existsSync(filePath)) { return null; }
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (parsed.schema_version !== 2) { return null; }
    if (!Array.isArray(parsed.commits)) { return null; }
    parsed.commits.sort((a, b) => (a.timestamp ?? '').localeCompare(b.timestamp ?? ''));
    return parsed;
  }
  catch {
    return null;
  }
}

/**
 * Per-metric cross-run status against `peakHist`.
 *
 * Peak = the entry with the most-negative `percent_delta_ci` upper bound:
 * the iteration that produced the largest improvement vs its own baseline.
 * On exact ties, prefer the more recent entry (`commits` is chronological).
 *
 * Status compares within-session percent-delta CIs at both ends. Cross-
 * session absolute-ms compare would mix per-session environmental variance:
 *   WIN        — current pct-delta CI dominates peak's (current high < peak low)
 *   REOPENED   — peak pct-delta CI dominates current's (peak high < current low)
 *   TIED-PEAK  — CIs overlap
 *
 * Drift detection runs against `driftHist` (always main-history) regardless
 * of the peak scope. See `computeBaselineDrift`.
 *
 * Returns null when this metric has no prior entries with `percent_delta_ci`
 * — new bench, no comparable history yet.
 */
function computeHistoryStatus(metric, peakHist, driftHist) {
  if (!peakHist || peakHist.commits.length === 0) { return null; }
  // Eligible peaks must (a) have measured this metric, (b) have touched
  // bench-relevant packages so the iteration could plausibly have moved
  // the metric, and (c) have a within-session CI tight enough to anchor
  // the comparison. The same-session classifier already uses ratio ≤
  // NOISE_RATIO_TOLERANCE × expected to separate signal from boundary
  // noise; an outlier-noisy iteration anchoring the peak would let the
  // 'Regressions from peak' table report differences that are within the
  // peak iteration's own resolution floor. `touches_packages` is set by
  // fetch-pr-history per run; absent on legacy entries (default include).
  const entries = peakHist.commits.filter((c) => {
    const m = c.metrics?.[metric.name];
    if (!m?.percent_delta_ci) { return false; }
    if (c.touches_packages === false) { return false; }
    const widthPp = m.percent_delta_ci[1] - m.percent_delta_ci[0];
    const expectedPp = m.mean_ms > 0 ? expectedNoisePp(m.mean_ms) : 0;
    if (expectedPp <= 0) { return true; }
    return widthPp / expectedPp <= NOISE_RATIO_TOLERANCE;
  });
  if (entries.length === 0) { return null; }

  // Pick peak. Tie-break: newer commit wins.
  let peakIdx = 0;
  for (let i = 1; i < entries.length; i++) {
    const candHigh = entries[i].metrics[metric.name].percent_delta_ci[1];
    const peakHigh = entries[peakIdx].metrics[metric.name].percent_delta_ci[1];
    if (candHigh <= peakHigh) { peakIdx = i; }
  }
  const peakEntry = entries[peakIdx];
  const peakMetric = peakEntry.metrics[metric.name];
  const currentPctCi = metric.percentDelta;
  const peakPctCi = peakMetric.percent_delta_ci;

  // Difference in midpoints. Positive = regressed from peak; negative = new
  // best vs peak. Used both for the JND gate below and the rendered delta.
  const currentMid = (currentPctCi[0] + currentPctCi[1]) / 2;
  const peakMid = (peakPctCi[0] + peakPctCi[1]) / 2;
  const deltaFromPeakPct = currentMid - peakMid;

  let status;
  if (currentPctCi[1] < peakPctCi[0]) { status = 'WIN'; }
  else if (peakPctCi[1] < currentPctCi[0]) { status = 'REOPENED'; }
  else { status = 'TIED-PEAK'; }

  // Same JND as the same-session classifier. Sub-NOISE_FLOOR doesn't count
  // as "moved" vs main, so it shouldn't count as "moved" vs peak either.
  // Holds even when the within-session CIs are statistically non-overlapping.
  if (Math.abs(deltaFromPeakPct) < NOISE_FLOOR) { status = 'TIED-PEAK'; }

  // Candidates between peak and HEAD. Filter out commits that didn't touch
  // packages/** — they couldn't have moved a runtime metric, so they
  // shouldn't appear as bisect or credit candidates. `touches_packages`
  // is set by `fetch-pr-history.js` per run; absent on legacy entries
  // (default include for back-compat).
  const peakHistIdx = peakHist.commits.findIndex((c) => c.sha === peakEntry.sha);
  const bisectCandidates = peakHist.commits
    .slice(peakHistIdx + 1)
    .filter((c) => c.metrics?.[metric.name]?.percent_delta_ci)
    .filter((c) => c.touches_packages !== false)
    .map((c) => ({ sha: c.sha, msg: c.msg, pr: c.pr ?? null }));

  const drift = computeBaselineDrift(
    metric.name,
    metric.baselineSha,
    peakMetric.baseline_sha,
    driftHist,
  );

  return {
    status,
    peak: {
      sha: peakEntry.sha,
      msg: peakEntry.msg,
      pr: peakEntry.pr ?? null,
      ci: peakMetric.ci,
      mean_ms: peakMetric.mean_ms,
      percent_delta_ci: peakPctCi,
      baseline_sha: peakMetric.baseline_sha ?? null,
    },
    delta_from_peak_pct: Number(deltaFromPeakPct.toFixed(2)),
    bisect_candidates: bisectCandidates,
    drift,
  };
}

/**
 * Quantify cumulative main-side drift between two baselines on a metric by
 * walking the chain of main commits between them and combining their
 * within-session percent-deltas. Subtracting absolute ms across sessions
 * would mix per-session environmental variance into the result.
 *
 * Returns one of:
 *   { detected: false }                                                   — baselines match (or one/both unknown)
 *   { detected: true, magnitude: N, chain_len: K, missing: M }            — quantified. N in %, positive = main got slower
 *   { detected: true, magnitude: null, chain_len: K, missing: M }         — chain partially or wholly unwalkable
 *
 * Combines multiplicatively: ∏(1 + pct_i) − 1.
 */
function computeBaselineDrift(metricName, currentBaselineSha, peakBaselineSha, hist) {
  if (!currentBaselineSha || !peakBaselineSha) {
    return { detected: false };
  }
  if (currentBaselineSha === peakBaselineSha) {
    return { detected: false };
  }
  if (!hist || hist.commits.length === 0) {
    return { detected: true, magnitude: null, chain_len: 0, missing: 0 };
  }
  const idxCurrent = hist.commits.findIndex((c) => c.sha === currentBaselineSha);
  const idxPeak = hist.commits.findIndex((c) => c.sha === peakBaselineSha);
  if (idxCurrent < 0 || idxPeak < 0) {
    return { detected: true, magnitude: null, chain_len: 0, missing: 0 };
  }
  const lo = Math.min(idxCurrent, idxPeak);
  const hi = Math.max(idxCurrent, idxPeak);
  // Commits AFTER the older baseline through the newer one — their deltas are
  // what accumulated between the two baselines.
  const chain = hist.commits.slice(lo + 1, hi + 1);
  let chainLen = 0;
  let missing = 0;
  let cumulative = 1;
  for (const c of chain) {
    const m = c.metrics?.[metricName];
    if (!m?.percent_delta_ci) {
      missing++;
      continue;
    }
    chainLen++;
    const pctMid = (m.percent_delta_ci[0] + m.percent_delta_ci[1]) / 2;
    cumulative *= 1 + pctMid / 100;
  }
  if (chainLen === 0) {
    return { detected: true, magnitude: null, chain_len: 0, missing };
  }
  const magnitudePp = (cumulative - 1) * 100;
  return {
    detected: true,
    magnitude: Number(magnitudePp.toFixed(2)),
    chain_len: chainLen,
    missing,
  };
}

// ---------- utilities ----------

function fmtPctRange([low, high]) {
  return `${signed(low)}% – ${signed(high)}%`;
}

function fmtMsRange([low, high]) {
  return `${signPrefix(low)}${low.toFixed(2)}ms – ${signPrefix(high)}${high.toFixed(2)}ms`;
}

function signed(n) {
  const sign = n > 0 ? '+' : n < 0 ? '' : '';
  return `${sign}${n.toFixed(1)}`;
}

function signPrefix(n) {
  return n > 0 ? '+' : '';
}

function mid([low, high]) {
  return (low + high) / 2;
}

function round2([low, high]) {
  return [Number(low.toFixed(2)), Number(high.toFixed(2))];
}

function round4([low, high]) {
  return [Number(low.toFixed(4)), Number(high.toFixed(4))];
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) { continue; }
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      out[key] = true;
    }
    else {
      out[key] = next;
      i++;
    }
  }
  return out;
}

function required(args, key) {
  if (args[key] === undefined) {
    console.error(`Missing required --${key}`);
    process.exit(1);
  }
  return args[key];
}

function escape(s) {
  return s.replace(/[<>]/g, (c) => (c === '<' ? '&lt;' : '&gt;'));
}

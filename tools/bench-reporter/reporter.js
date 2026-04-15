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
      --history <path>        bench-history.json path (default: <repo-root>/bench-history.json)
      --out <dir>             output directory (default: ./bench-report)

  Cross-run taxonomy (WIN / TIED-PEAK / REOPENED) engages automatically once
  bench-history.json has entries. Empty or missing history file → reporter
  falls back to current-vs-baseline only (no peak attribution rendered).
*/

import fs from 'node:fs';
import path from 'node:path';

const args = parseArgs(process.argv.slice(2));
const resultsDir = required(args, 'results');
const sha = required(args, 'sha');
const msg = args.msg ?? '';
const runUrl = args['run-url'] ?? '';
const runId = args['run-id'] ?? '';
const baseRef = args['base-ref'] ?? 'main';
const baseSha = args['base-sha'] ?? '';
// Fall back to GITHUB_REPOSITORY so commit links work without an explicit
// --repo when running under Actions. Still honors --repo override when
// someone needs to pin a different repo (e.g. cross-fork comparison).
const repo = args.repo ?? process.env.GITHUB_REPOSITORY ?? '';
const repoRoot = args['repo-root'] ?? process.cwd();
const wallClockSec = args['wall-clock'] ? Number(args['wall-clock']) : null;
const historyPath = args.history ?? path.join(repoRoot, 'bench-history.json');
const outDir = args.out ?? './bench-report';

const NOISE_FLOOR = 2; // percent — matches autoSampleConditions

// Per-sample timing jitter on shared GHA runners. OS scheduling, GC, and
// JIT contribute an ~absolute-constant noise floor that becomes wide in
// relative terms for short benches. Calibrated empirically: zero-delta
// observed CI widths fit a σ≈2ms model well for most benches; the handful
// that exceed it (create-1k, append-1k) show 2.5-3× expected, which is
// the diagnostic signal — unusually noisy for duration, worth a second look.
const SIGMA_ABS_MS = 2;

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

/**
 * Expected percent-change CI width for an unresolved CI given the bench's
 * absolute duration. Derived from the standard-error-of-the-difference of
 * two means at sampleSize=50, σ=SIGMA_ABS_MS per sample, z=1.96:
 *   abs_CI_width ≈ 2 * 1.96 * sqrt(2) * σ / sqrt(50) ≈ 0.784 * σ
 *   pct_width = abs_CI_width / mean * 100
 */
function expectedNoisePp(meanMs) {
  return (0.784 * SIGMA_ABS_MS) / meanMs * 100;
}

const benchDirs = findBenchDirs(repoRoot);
const history = loadHistory(historyPath);
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
 * Walk `dir` for tachometer JSON files and extract per-metric this-change
 * vs tip-of-tree data. Each tachometer file can contain multiple metrics;
 * each metric has one "this-change [X]" and one "tip-of-tree [X]" entry.
 */
function loadAllMetrics(dir) {
  const out = [];
  for (const entry of walk(dir)) {
    if (!entry.endsWith('.json')) { continue; }
    const data = JSON.parse(fs.readFileSync(entry, 'utf8'));
    if (!Array.isArray(data.benchmarks)) { continue; }

    // Group benchmarks by measurement name, index by source (this-change | tip-of-tree)
    const byName = new Map();
    data.benchmarks.forEach((bm, i) => {
      const mName = bm.measurement?.name ?? bm.name;
      const source = (bm.name ?? '').split(' [')[0];
      if (!byName.has(mName)) { byName.set(mName, {}); }
      byName.get(mName)[source] = { index: i, bm };
    });

    for (const [name, pair] of byName) {
      const cur = pair['this-change'];
      const base = pair['tip-of-tree'];
      if (!cur || !base) { continue; }
      const diff = cur.bm.differences?.[base.index];
      if (!diff) { continue; }
      out.push({
        name,
        thisChangeMs: [cur.bm.mean.low, cur.bm.mean.high],
        tipOfTreeMs: [base.bm.mean.low, base.bm.mean.high],
        absoluteMsDelta: [diff.absolute.low, diff.absolute.high],
        percentDelta: [diff.percentChange.low, diff.percentChange.high],
      });
    }
  }
  // Deterministic order for snapshot stability
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
    const expectedPp = expectedNoisePp(meanMs);
    const ratio = expectedPp > 0 ? widthPp / expectedPp : Infinity;
    const source = resolveMetricSource(m.name, benchDirs, repoRoot);
    const historyStatus = computeHistoryStatus(m, history);
    return {
      ...m,
      meanMs,
      widthPp,
      expectedPp,
      ratio,
      source,
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
    history_available: history !== null && history.commits.length > 0,
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
    source: m.source,
  };
  // Cross-run fields only populated when history has data for this metric.
  // Agents can detect absence vs "no peak" via missing key, not null.
  if (m.historyStatus) {
    out.history_status = m.historyStatus.status;
    out.peak = m.historyStatus.peak;
    out.delta_from_peak_pct = m.historyStatus.delta_from_peak_pct;
    out.bisect_candidates = m.historyStatus.bisect_candidates;
  }
  return out;
}

/**
 * Markdown renderer — implements the rubric at ai/workspace/tmp/bench-reporter-rubric.md.
 * Layout:
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
  // Surface REOPENED count in the headline when history has flagged any.
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
        `The measured difference is small, and our sampling couldn't confidently place it above or below zero. Running more samples in a future run might settle these metrics.`,
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
        `On benches this short, system jitter (scheduling, GC, JIT) masks sub-${
          SIGMA_ABS_MS * 2
        }% changes; larger deltas still resolve cleanly.`,
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

  // ─── Regressions from peak (cross-run; only when REOPENED exists) ────
  renderRegressionsFromPeak(lines, report);

  // ─── Footer ──────────────────────────────────────────────────────────
  lines.push('---');
  const footerParts = [
    'Sample size: 50',
    `Resolution floor: ±${NOISE_FLOOR}%`,
    'Timeout: 3min',
  ];
  if (report.wall_clock_seconds != null) {
    footerParts.push(`Wall-clock: ${formatWallClock(report.wall_clock_seconds)}`);
  }
  lines.push(`<sub>${footerParts.join(' · ')}</sub>`);

  return lines.join('\n');
}

/**
 * Append a "Regressions from peak" section when one or more metrics are
 * REOPENED (current CI dominated by a prior commit's CI). Actionable signal:
 * the metric was once better and this PR — or a commit before it — gave
 * that improvement back. Skipped entirely when history is empty or no
 * REOPENED metrics exist.
 */
function renderRegressionsFromPeak(lines, report) {
  const reopened = report.metrics.filter((m) => m.history_status === 'REOPENED');
  if (reopened.length === 0) { return; }

  // Sort by severity — largest delta-from-peak first.
  const sorted = [...reopened].sort((a, b) => (b.delta_from_peak_pct ?? 0) - (a.delta_from_peak_pct ?? 0));

  lines.push('<details>');
  lines.push(`<summary>📜 Regressions from peak (${reopened.length})</summary>`);
  lines.push('');
  lines.push(
    `These metrics were better on a prior commit than they are now. The peak CI dominates current CI — not attributable to per-sample noise. Bisect candidates are the commits between the peak and HEAD; nearest-to-peak is usually the best bet.`,
  );
  lines.push('');
  lines.push('| metric | current | peak | vs peak | bisect candidates |');
  lines.push('|---|---|---|---|---|');
  for (const m of sorted) {
    const currentMid = (m.mean_ms ?? ((m.this_change_ms_ci[0] + m.this_change_ms_ci[1]) / 2));
    const peakMid = m.peak.mean_ms;
    const deltaStr = m.delta_from_peak_pct > 0
      ? `+${m.delta_from_peak_pct.toFixed(0)}%`
      : `${m.delta_from_peak_pct.toFixed(0)}%`;
    const peakShortSha = m.peak.sha.slice(0, 7);
    const peakLink = report.repo
      ? `[\`${peakShortSha}\`](https://github.com/${report.repo}/commit/${m.peak.sha})`
      : `\`${peakShortSha}\``;
    const bisectMd = (m.bisect_candidates ?? [])
      .slice(0, BISECT_MARKDOWN_MAX)
      .map((c) => {
        const shortSha = c.sha.slice(0, 7);
        return report.repo
          ? `[\`${shortSha}\`](https://github.com/${report.repo}/commit/${c.sha})`
          : `\`${shortSha}\``;
      })
      .join(', ');
    const bisectCell = m.bisect_candidates && m.bisect_candidates.length > BISECT_MARKDOWN_MAX
      ? `${bisectMd} +${m.bisect_candidates.length - BISECT_MARKDOWN_MAX} more`
      : bisectMd || '—';
    lines.push(
      `| ${metricLink(m, report)} | ${currentMid.toFixed(1)}ms | ${
        peakMid.toFixed(1)
      }ms @ ${peakLink} | ${deltaStr} | ${bisectCell} |`,
    );
  }
  lines.push('');
  lines.push('</details>');
  lines.push('');
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
    const modifier = f > s ? 'Net Positive' : s > f ? 'Net Negative' : 'Balanced';
    const conjunction = modifier === 'Balanced' ? 'and regresses on' : 'while regressing on';
    return {
      emoji: '🟡',
      heading: `Mixed Performance (${modifier})`,
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

/** Metric name → markdown link to bench source at run's SHA, or plain code if unresolved. */
function metricLink(m, report) {
  const label = `\`${m.name}\``;
  if (!report.repo || !m.source) { return label; }
  const hashPart = m.source.line ? `#L${m.source.line}` : '';
  return `[${label}](https://github.com/${report.repo}/blob/${report.head.sha}/${m.source.path}${hashPart})`;
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
 * Find the source location where `metricName` is defined. Looks for the
 * first line containing the metric name as a quoted string in any .js
 * file under the given dirs. Returns { path, line } relative to repoRoot,
 * or null if not found.
 */
function resolveMetricSource(metricName, dirs, root) {
  const escaped = metricName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const needle = new RegExp(`['"\`]${escaped}['"\`]`);
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
      const content = fs.readFileSync(path.join(root, relPath), 'utf8');
      const lines = content.split('\n');
      const idx = lines.findIndex((line) => needle.test(line));
      if (idx >= 0) { return { path: relPath, line: idx + 1 }; }
    }
  }
  return null;
}

/** Format seconds → `10m42s` / `42s`. */
function formatWallClock(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return m > 0 ? `${m}m${s.toString().padStart(2, '0')}s` : `${s}s`;
}

/**
 * Load bench-history.json. Returns null if missing/empty/invalid — the
 * reporter's D3b features all gracefully degrade on a null history.
 */
function loadHistory(filePath) {
  if (!filePath || !fs.existsSync(filePath)) { return null; }
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (parsed.schema_version !== 1 || !Array.isArray(parsed.commits)) { return null; }
    return parsed;
  }
  catch {
    return null;
  }
}

/**
 * Compute per-metric cross-run status against the history file.
 *
 * Peak = the commit whose CI upper bound is lowest (smallest time = best
 * perf). On exact ties, prefer the most recent entry (history is ordered
 * chronologically by append order).
 *
 * Status taxonomy (current CI = this-change absolute ms):
 *   WIN        — current CI dominates peak (current high < peak low)
 *   REOPENED   — peak CI dominates current (peak high < current low)
 *   TIED-PEAK  — CIs overlap (no dominance either way)
 *
 * Returns null when history is null/empty OR this metric has no prior
 * entries (new bench). The reporter's caller distinguishes these cases
 * via the `history_available` summary flag and per-metric presence.
 */
function computeHistoryStatus(metric, hist) {
  if (!hist || hist.commits.length === 0) { return null; }
  const entries = hist.commits.filter((c) => c.metrics && metric.name in c.metrics);
  if (entries.length === 0) { return null; }

  // Pick peak. Tie-break: newer commit wins (commits array is chronological).
  let peakIdx = 0;
  for (let i = 1; i < entries.length; i++) {
    const candHigh = entries[i].metrics[metric.name].ci[1];
    const peakHigh = entries[peakIdx].metrics[metric.name].ci[1];
    if (candHigh < peakHigh) { peakIdx = i; }
    else if (candHigh === peakHigh) { peakIdx = i; }
  }
  const peakEntry = entries[peakIdx];
  const peakMetric = peakEntry.metrics[metric.name];
  const currentCi = metric.thisChangeMs;
  const peakCi = peakMetric.ci;

  let status;
  if (currentCi[1] < peakCi[0]) { status = 'WIN'; }
  else if (peakCi[1] < currentCi[0]) { status = 'REOPENED'; }
  else { status = 'TIED-PEAK'; }

  // Bisect candidates: commits between peak and HEAD of history that
  // contain this metric. Oldest-to-newest so the reviewer/agent sees
  // the timeline in causal order.
  const peakHistIdx = hist.commits.findIndex((c) => c.sha === peakEntry.sha);
  const bisectCandidates = hist.commits
    .slice(peakHistIdx + 1)
    .filter((c) => c.metrics && metric.name in c.metrics)
    .map((c) => ({ sha: c.sha, msg: c.msg }));

  const currentMid = (currentCi[0] + currentCi[1]) / 2;
  const peakMid = (peakCi[0] + peakCi[1]) / 2;
  const deltaFromPeakPct = peakMid > 0 ? ((currentMid - peakMid) / peakMid) * 100 : 0;

  return {
    status,
    peak: {
      sha: peakEntry.sha,
      msg: peakEntry.msg,
      ci: peakCi,
      mean_ms: peakMetric.mean_ms,
    },
    delta_from_peak_pct: Number(deltaFromPeakPct.toFixed(2)),
    bisect_candidates: bisectCandidates,
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

function* walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) { yield* walk(full); }
    else { yield full; }
  }
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

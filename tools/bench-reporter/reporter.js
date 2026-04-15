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
      --out <dir>             output directory (default: ./bench-report)

  MVP scope: current-vs-baseline only. Cross-run taxonomy (WIN / REOPENED /
  UNEXPLORED / peak attribution / commit impact) is a follow-up once
  `bench-history.json` is populated.
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
    return {
      ...m,
      meanMs,
      widthPp,
      expectedPp,
      ratio,
      source,
      status: classify(m.percentDelta, ratio),
    };
  });
  const summary = { faster: 0, slower: 0, 'within-noise': 0, unsure: 0, 'noise-floor-limited': 0 };
  for (const m of classified) { summary[m.status]++; }
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
    metrics: classified.map(toJsonMetric),
  };
}

function classify([low, high], ratio) {
  if (high < -NOISE_FLOOR) { return 'faster'; }
  if (low > NOISE_FLOOR) { return 'slower'; }
  if (low > -NOISE_FLOOR && high < NOISE_FLOOR) { return 'within-noise'; }
  return ratio <= NOISE_RATIO_TOLERANCE ? 'noise-floor-limited' : 'unsure';
}

function toJsonMetric(m) {
  return {
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
  lines.push(
    `✅ ${faster.length} faster · ❌ ${slower.length} slower `
      + `· 🔍 ${unsureTotal} unsure · ⚪ ${noChange.length} no change`,
  );
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

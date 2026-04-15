#!/usr/bin/env node
/*
  Bench reporter — parses tachometer JSON output and emits:
    - bench-report.json  (structured adjunct for agent autoresearch)
    - comment.md         (rendered view for humans / PR comment)

  Usage:
    node reporter.js \
      --results <dir>    directory containing tachometer JSON outputs
      --sha <sha>        current commit SHA
      --msg <text>       current commit subject line
      --run-url <url>    link to the triggering workflow run
      --base-ref <ref>   base branch name (e.g. "main")
      --base-sha <sha>   base commit SHA
      --out <dir>        output directory (default: ./bench-report)

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
const baseRef = args['base-ref'] ?? 'main';
const baseSha = args['base-sha'] ?? '';
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
    return {
      ...m,
      meanMs,
      widthPp,
      expectedPp,
      ratio,
      status: classify(m.percentDelta, ratio),
    };
  });
  const summary = { faster: 0, slower: 0, 'within-noise': 0, unsure: 0, 'noise-floor-limited': 0 };
  for (const m of classified) { summary[m.status]++; }
  return {
    head: { sha, msg, ref: process.env.GITHUB_HEAD_REF || '' },
    base: { sha: baseSha, ref: baseRef },
    run: { url: runUrl },
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
    expected_noise_pp: Number(m.expectedPp.toFixed(2)),
    observed_noise_ratio: Number(m.ratio.toFixed(2)),
  };
}

/**
 * Markdown renderer. Section order:
 *   1. Header — SHA + commit msg + base + run link
 *   2. One-line summary
 *   3. Significant changes (if any) — headline when there IS a change
 *   4. Confirmed within ±2% — positive signal; auto-expanded on zero-delta PRs
 *   5. Unsure — boundary cases; smaller, de-emphasized
 *   6. Known high-variance — separate bucket; reviewers shouldn't chase
 */
function renderMarkdown(report) {
  const shortSha = report.head.sha.slice(0, 7);
  const msgSuffix = report.head.msg ? ` · ${escape(report.head.msg)}` : '';
  const runLink = report.run.url ? ` · [run ↗](${report.run.url})` : '';

  // Base header: show short SHA when we have one, otherwise just the ref.
  // Avoids the "`main` (main)" duplication when no --base-sha is passed.
  const hasBaseSha = report.base.sha && report.base.sha.slice(0, 7) !== report.base.ref;
  const baseLabel = hasBaseSha
    ? `\`${report.base.sha.slice(0, 7)}\` (${report.base.ref})`
    : `\`${report.base.ref}\``;

  const lines = [];
  lines.push(`## 📊 Bench — \`${shortSha}\`${msgSuffix}`);
  lines.push(`**Base:** ${baseLabel}${runLink}`);
  lines.push('');

  const summaryParts = [
    `**${report.summary.faster} faster**`,
    `**${report.summary.slower} slower**`,
    `${report.summary['within-noise']} within ±${NOISE_FLOOR}%`,
    `${report.summary.unsure} unsure`,
  ];
  if (report.summary['noise-floor-limited'] > 0) {
    summaryParts.push(`${report.summary['noise-floor-limited']} noise-floor-limited`);
  }
  lines.push(summaryParts.join(' · '));
  lines.push('');

  const faster = report.metrics.filter((m) => m.status === 'faster');
  const slower = report.metrics.filter((m) => m.status === 'slower');
  const noise = report.metrics.filter((m) => m.status === 'within-noise');
  const unsure = report.metrics.filter((m) => m.status === 'unsure');
  const noiseFloor = report.metrics.filter((m) => m.status === 'noise-floor-limited');

  // Significant changes, sorted by |Δ| descending — headline when present
  const significant = [...faster, ...slower].sort(
    (a, b) => Math.abs(mid(b.percent_change_ci)) - Math.abs(mid(a.percent_change_ci)),
  );

  if (significant.length > 0) {
    lines.push(`### Significant changes (outside ±${NOISE_FLOOR}%)`);
    lines.push('');
    lines.push('| metric | Δ% | Δms | verdict |');
    lines.push('|---|---|---|---|');
    for (const m of significant) {
      const icon = m.status === 'faster' ? '✅ faster' : '❌ slower';
      lines.push(
        `| \`${m.name}\` | ${fmtPctRange(m.percent_change_ci)} | ${fmtMsRange(m.absolute_ms_ci)} | ${icon} |`,
      );
    }
    lines.push('');
  }

  // Within-noise: the positive "confirmed unchanged" signal. Expand by
  // default when there are no significant changes (this is the story on
  // zero-delta PRs). Collapse when significant exist (less interesting).
  if (noise.length > 0) {
    const open = significant.length === 0 ? ' open' : '';
    lines.push('<details' + open + '>');
    lines.push(
      `<summary>${noise.length} metric${
        noise.length === 1 ? '' : 's'
      } confirmed within ±${NOISE_FLOOR}% (no meaningful change)</summary>`,
    );
    lines.push('');
    lines.push('| metric | Δ% CI |');
    lines.push('|---|---|');
    for (const m of noise) {
      lines.push(`| \`${m.name}\` | ${fmtPctRange(m.percent_change_ci)} |`);
    }
    lines.push('');
    lines.push('</details>');
    lines.push('');
  }

  if (unsure.length > 0) {
    lines.push(`### Unsure (CI wider than duration predicts)`);
    lines.push('');
    lines.push(
      `These metrics straddle ±${NOISE_FLOOR}% AND their CI is more than ${NOISE_RATIO_TOLERANCE}× the expected noise floor for the bench's duration. Either more samples would resolve, or the bench is noisier than its duration predicts — worth a second look.`,
    );
    lines.push('');
    lines.push('| metric | Δ% CI | Δms CI | mean | observed/expected |');
    lines.push('|---|---|---|---|---|');
    for (const m of unsure) {
      const meanMs = (m.this_change_ms_ci[0] + m.this_change_ms_ci[1]) / 2;
      lines.push(
        `| \`${m.name}\` | ${fmtPctRange(m.percent_change_ci)} | ${fmtMsRange(m.absolute_ms_ci)} | ${
          meanMs.toFixed(1)
        }ms | ${m.observed_noise_ratio}× |`,
      );
    }
    lines.push('');
  }

  if (noiseFloor.length > 0) {
    lines.push('### Noise-floor-limited');
    lines.push('');
    lines.push(
      `CI straddles ±${NOISE_FLOOR}% but is consistent with the ~±${SIGMA_ABS_MS}ms per-sample jitter floor on shared CI runners. Short benches can't narrow below this in ${NOISE_FLOOR}%-relative terms regardless of samples. Real perf changes still resolve (delta clears the noise); zero-delta shows unsure by physics. Not a signal.`,
    );
    lines.push('');
    lines.push('| metric | Δ% CI | mean | observed/expected |');
    lines.push('|---|---|---|---|');
    for (const m of noiseFloor) {
      const meanMs = (m.this_change_ms_ci[0] + m.this_change_ms_ci[1]) / 2;
      lines.push(
        `| \`${m.name}\` | ${fmtPctRange(m.percent_change_ci)} | ${meanMs.toFixed(1)}ms | ${m.observed_noise_ratio}× |`,
      );
    }
    lines.push('');
  }

  lines.push('---');
  lines.push(
    `<sub>Structured: \`bench-report.json\` uploaded as workflow artifact. Noise floor: ±${NOISE_FLOOR}% (matches \`autoSampleConditions\`). Duration-derived expected noise uses σ≈${SIGMA_ABS_MS}ms per-sample jitter.</sub>`,
  );

  return lines.join('\n');
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

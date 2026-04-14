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

const metrics = loadAllMetrics(resultsDir);
const report = buildReport(metrics);
const markdown = renderMarkdown(report);

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'bench-report.json'), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(outDir, 'comment.md'), markdown);

console.log(`Wrote ${outDir}/bench-report.json and ${outDir}/comment.md`);
console.log(
  `Summary: ${report.summary.faster} faster, ${report.summary.slower} slower, ${
    report.summary['within-noise']
  } within noise, ${report.summary.unsure} unsure`,
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
 *   faster        — CI entirely below -2% (this-change consistently shorter)
 *   slower        — CI entirely above +2%
 *   within-noise  — CI entirely inside [-2%, +2%]
 *   unsure        — CI straddles a ±2% boundary
 */
function buildReport(metrics) {
  const classified = metrics.map((m) => ({ ...m, status: classify(m.percentDelta) }));
  const summary = { faster: 0, slower: 0, 'within-noise': 0, unsure: 0 };
  for (const m of classified) { summary[m.status]++; }
  return {
    head: { sha, msg, ref: process.env.GITHUB_HEAD_REF || '' },
    base: { sha: baseSha, ref: baseRef },
    run: { url: runUrl },
    noise_floor_percent: NOISE_FLOOR,
    summary,
    metrics: classified.map(toJsonMetric),
  };
}

function classify([low, high]) {
  if (high < -NOISE_FLOOR) { return 'faster'; }
  if (low > NOISE_FLOOR) { return 'slower'; }
  if (low > -NOISE_FLOOR && high < NOISE_FLOOR) { return 'within-noise'; }
  return 'unsure';
}

function toJsonMetric(m) {
  return {
    name: m.name,
    status: m.status,
    percent_change_ci: round2(m.percentDelta),
    absolute_ms_ci: round4(m.absoluteMsDelta),
    this_change_ms_ci: round4(m.thisChangeMs),
    tip_of_tree_ms_ci: round4(m.tipOfTreeMs),
  };
}

/**
 * Markdown renderer. Three sections:
 *   1. Header — SHA + commit msg + run link + one-line summary
 *   2. Significant changes — faster/slower, sorted by |mean delta|
 *   3. Collapsed sections — within-noise and unsure (longer, less interesting)
 */
function renderMarkdown(report) {
  const shortSha = report.head.sha.slice(0, 7);
  const shortBase = report.base.sha ? report.base.sha.slice(0, 7) : report.base.ref;
  const runLink = report.run.url ? ` · [run ↗](${report.run.url})` : '';
  const msgSuffix = report.head.msg ? ` · ${escape(report.head.msg)}` : '';

  const lines = [];
  lines.push(`## 📊 Bench — \`${shortSha}\`${msgSuffix}`);
  lines.push(`**Base:** \`${shortBase}\` (${report.base.ref})${runLink}`);
  lines.push('');
  lines.push(
    `**${report.summary.faster} faster** · `
      + `**${report.summary.slower} slower** · `
      + `${report.summary['within-noise']} within ±${NOISE_FLOOR}% · `
      + `${report.summary.unsure} unsure`,
  );
  lines.push('');

  const faster = report.metrics.filter((m) => m.status === 'faster');
  const slower = report.metrics.filter((m) => m.status === 'slower');
  const noise = report.metrics.filter((m) => m.status === 'within-noise');
  const unsure = report.metrics.filter((m) => m.status === 'unsure');

  // Significant changes, sorted by absolute mid-delta descending
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

  if (unsure.length > 0) {
    lines.push('### Unsure (CI straddles ±2%)');
    lines.push('');
    lines.push(
      'These are boundary cases — the true delta is close to ±2% and tachometer could not place the CI entirely on one side. Longer sampling may resolve them.',
    );
    lines.push('');
    lines.push('| metric | Δ% CI | Δms CI |');
    lines.push('|---|---|---|');
    for (const m of unsure) {
      lines.push(`| \`${m.name}\` | ${fmtPctRange(m.percent_change_ci)} | ${fmtMsRange(m.absolute_ms_ci)} |`);
    }
    lines.push('');
  }

  if (noise.length > 0) {
    lines.push('<details>');
    lines.push(
      `<summary>${noise.length} metric${
        noise.length === 1 ? '' : 's'
      } within ±${NOISE_FLOOR}% (no meaningful change)</summary>`,
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

  lines.push('---');
  lines.push(
    `<sub>Structured: \`bench-report.json\` uploaded as workflow artifact. Noise floor: ±${NOISE_FLOOR}% (matches \`autoSampleConditions\`).</sub>`,
  );

  return lines.join('\n');
}

// ---------- utilities ----------

function fmtPctRange([low, high]) {
  return `${signed(low)}% – ${signed(high)}%`;
}

function fmtMsRange([low, high]) {
  const lowMs = Math.abs(low) < 0.01 ? '0' : low.toFixed(2);
  const highMs = Math.abs(high) < 0.01 ? '0' : high.toFixed(2);
  return `${signPrefix(low)}${lowMs}ms – ${signPrefix(high)}${highMs}ms`;
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

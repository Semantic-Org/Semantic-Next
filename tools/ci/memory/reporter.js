#!/usr/bin/env node
/*
  Heap-bot reporter. Diffs two collect.js snapshots (PR head vs merge base) and
  emits:
    - memory-report.json  (structured adjunct for tooling / agents)
    - comment.md          (the PR comment)

  Two signals, two methodologies (read-ci-reports, the heap section):

    - INVARIANTS are deterministic. After N churn cycles every live-instance
      count must return *exactly* to its pre-churn baseline. The diff here is
      exact integer equality: held, or broken with a per-cycle multiple. This is
      the verdict — the headline is the leak, not a KB number.

    - FOOTPRINT (retained heap KB, the reactivity micro) is statistical. It's
      classified against a percent noise floor and never fails CI; it's a
      collapsed trend.

  A leak verdict is computed per side independently (does THIS tree's counts
  return to baseline?) and then compared: the bot fires red when the PR head
  leaks, green-improvement when the head fixes a baseline leak.

  Usage:
    node reporter.js --results <dir> --sha <sha> --repo <owner/name> [--msg ...]
      [--run-url ...] [--run-id ...] [--base-ref main] [--wall-clock <sec>]
      [--out <dir>]
*/
import fs from 'node:fs';
import path from 'node:path';

import { INVARIANTS, NOISE_FLOOR } from './targets.js';

const args = parseArgs(process.argv.slice(2));
const resultsDir = required('results');
const sha = required('sha');
const msg = args.msg ?? '';
const runUrl = args['run-url'] ?? '';
const runId = args['run-id'] ?? '';
const baseRef = args['base-ref'] ?? 'main';
const repo = args.repo ?? process.env.GITHUB_REPOSITORY ?? '';
const wallClockSec = args['wall-clock'] ? Number(args['wall-clock']) : null;
const outDir = args.out ?? './memory-report';

// Five states, a small vocabulary. Red (CAUTION) is reserved for a broken
// teardown invariant — a real leak. Footprint movement alone never goes red.
const STATE_INFO = {
  'no-leak': { emoji: '⚪', alert: 'NOTE', verdict: 'No leak' },
  improvement: { emoji: '🟢', alert: 'TIP', verdict: 'Leak fixed' },
  watch: { emoji: '🟡', alert: 'WARNING', verdict: 'Watch' },
  leak: { emoji: '🔴', alert: 'CAUTION', verdict: 'Leak' },
};

const baselineSha = readBaselineSha(resultsDir);
const current = readJson(path.join(resultsDir, 'current.json'));
const baseline = readJson(path.join(resultsDir, 'baseline.json'));

const report = buildReport(current, baseline);
const markdown = renderMarkdown(report);

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'memory-report.json'), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(outDir, 'comment.md'), markdown);

console.log(
  `state: ${report.state}. ${report.summary.broken} broken · ${report.summary.held} held. `
    + `footprint ${report.footprint.state}.`,
);

/* ----------------------------- build ----------------------------- */

function buildReport(cur, base) {
  const invariants = diffInvariants(cur, base);
  const footprint = diffFootprint(cur, base);
  const micro = diffMicro(cur, base);

  const summary = {
    broken: invariants.filter((i) => i.verdict === 'broken').length,
    held: invariants.filter((i) => i.verdict === 'held').length,
    fixed: invariants.filter((i) => i.verdict === 'fixed').length,
  };

  const state = classifyState(invariants, footprint);
  const fail = summary.broken > 0;
  const headline = invariants.find((i) => i.verdict === 'broken')
    ?? invariants.find((i) => i.verdict === 'fixed')
    ?? null;

  return {
    head: { sha, msg, ref: process.env.GITHUB_HEAD_REF || '' },
    base: { sha: baselineSha, ref: baseRef },
    run: { url: runUrl, id: runId || extractRunId(runUrl) },
    repo,
    wall_clock_seconds: wallClockSec,
    chrome: cur.chrome ?? cur.browser?.chrome ?? null,
    churn: cur.churn ?? null,
    state,
    fail,
    summary,
    headline: headline ? headline.id : null,
    invariants,
    footprint,
    reactivity_micro: micro,
  };
}

/*
  Per-invariant leak verdict.

  For each side, residual = afterChurn - baseline (how far the count failed to
  return), and moveResidual = afterMove - baseline (a stranded scope from the
  detach+reattach cycle). A clean tree has both at 0. The PR's verdict compares
  the head's residuals to the base's — both paths are base-subtracted, so a
  pre-existing leak the base also carries isn't blamed on this PR:
    - head leaks (churn or move), worse than base    -> broken (the PR introduced/regressed it)
    - head leaks equal to base                        -> held (pre-existing, not this PR)
    - head clean, base leaked on churn                -> fixed (the PR fixed it)
    - both clean                                      -> held
  perCycle is residual / cycles — the multiple a reviewer reads as the per-cycle
  leak rate.
*/
function diffInvariants(cur, base) {
  const cycles = cur.churn?.cycles ?? 1;
  const out = [];
  for (const inv of INVARIANTS) {
    const headBaseline = readCount(cur, 'baseline', inv.id);
    const headAfter = readCount(cur, 'afterChurn', inv.id);
    const headMove = readCount(cur, 'afterMove', inv.id);
    const baseBaseline = readCount(base, 'baseline', inv.id);
    const baseAfter = readCount(base, 'afterChurn', inv.id);
    const baseMove = readCount(base, 'afterMove', inv.id);

    const headResidual = headAfter - headBaseline;
    const baseResidual = baseAfter - baseBaseline;
    const moveResidual = headMove - headBaseline;
    const baseMoveResidual = baseMove - baseBaseline;

    // both the churn and move paths are base-subtracted: a residual that the
    // base tree carries too isn't a leak this PR introduced. The base snapshot
    // runs the same move cycle, so a pre-existing move residual is not blamed.
    let verdict = 'held';
    if (headResidual !== 0 || moveResidual !== 0) {
      const churnRegressed = headResidual > baseResidual;
      const moveRegressed = moveResidual > baseMoveResidual;
      verdict = churnRegressed || moveRegressed ? 'broken' : 'held';
    }
    else if (baseResidual !== 0) {
      verdict = 'fixed';
    }

    out.push({
      id: inv.id,
      label: inv.label,
      perItem: !!inv.perItem,
      why: inv.why,
      baseline: headBaseline,
      afterChurn: headAfter,
      afterMove: headMove,
      residual: headResidual,
      moveResidual,
      baseResidual,
      baseMoveResidual,
      // rounded: a per-cycle leak count is a whole-instance average, and the
      // raw quotient prints as an ugly float (40024 / 7 = 5717.714…)
      perCycle: cycles > 0 ? Math.round(headResidual / cycles) : headResidual,
      verdict,
    });
  }
  return out;
}

function diffFootprint(cur, base) {
  const ops = [];
  const curFp = cur.browser?.footprint ?? {};
  const baseFp = base.browser?.footprint ?? {};
  for (const id of Object.keys(curFp)) {
    const h = curFp[id];
    const b = baseFp[id];
    const headKb = (h.jsHeapUsedSize ?? 0) / 1024;
    const baseKb = b ? (b.jsHeapUsedSize ?? 0) / 1024 : null;
    const deltaKb = baseKb != null ? headKb - baseKb : null;
    const pct = baseKb ? (deltaKb / baseKb) * 100 : null;
    ops.push({
      id,
      label: h.label ?? id,
      rows: h.rows,
      headKb,
      baseKb,
      deltaKb,
      pct,
      withinNoise: pct == null || Math.abs(pct) <= NOISE_FLOOR.heapPercent,
    });
  }
  const moved = ops.filter((o) => !o.withinNoise);
  const grew = moved.filter((o) => o.deltaKb > 0);
  let state = 'within-noise';
  if (grew.length > 0) { state = 'grew'; }
  else if (moved.length > 0) { state = 'shrank'; }
  return { state, ops };
}

function diffMicro(cur, base) {
  const h = cur.reactivityMicro;
  const b = base.reactivityMicro;
  if (!h) { return null; }
  const headKb = h.graphBytes / 1024;
  const baseKb = b ? b.graphBytes / 1024 : null;
  const deltaKb = baseKb != null ? headKb - baseKb : null;
  const pct = baseKb ? (deltaKb / baseKb) * 100 : null;
  return {
    n: h.n,
    headKb,
    baseKb,
    deltaKb,
    pct,
    residualKb: h.residualBytes / 1024,
    withinNoise: pct == null || Math.abs(pct) <= NOISE_FLOOR.heapPercent,
  };
}

function classifyState(invariants, footprint) {
  if (invariants.some((i) => i.verdict === 'broken')) { return 'leak'; }
  if (invariants.some((i) => i.verdict === 'fixed')) { return 'improvement'; }
  // counts all held: footprint growth is at most a watch, never a fail
  if (footprint.state === 'grew') { return 'watch'; }
  return 'no-leak';
}

/* ----------------------------- render ----------------------------- */

function renderMarkdown(report) {
  const lines = [];
  const info = STATE_INFO[report.state];
  const shortSha = report.head.sha.slice(0, 7);
  const shaLink = report.repo
    ? `[\`${shortSha}\`](https://github.com/${report.repo}/commit/${report.head.sha})`
    : `\`${shortSha}\``;

  // ── banner: the leak verdict, not a KB number ──
  lines.push(`### ${info.emoji} ${info.verdict} for ${shaLink} on Heap Analysis 🧠`);
  lines.push('');

  const meta = [`**Base:** ${baseLink(report)}`];
  if (report.run.url) {
    const label = report.run.id ? `#${report.run.id}` : 'run';
    meta.push(`**Run:** [${label}](${report.run.url})`);
    meta.push(`**Raw:** [\`memory-report.json\`](${report.run.url}/artifacts)`);
  }
  lines.push(meta.join(' · '));
  lines.push('');
  if (report.head.msg) {
    lines.push(`<sup>${escapeText(report.head.msg)}</sup>`);
    lines.push('');
  }

  // ── alert: one-sentence verdict, led by the leak ──
  lines.push(`> [!${info.alert}]`);
  for (const v of verdictLines(report)) { lines.push(`> ${v}`); }
  lines.push('');

  // ── count line ──
  const fp = footprintWord(report.footprint);
  lines.push(`**${brokenWord(report.summary.broken)} · ${heldWord(report.summary)} · 📊 ${fp}**`);
  lines.push('');

  // ── invariants table (the story, expanded) ──
  lines.push(`| invariant | baseline | after ${report.churn?.cycles ?? '?'} cycles | verdict |`);
  lines.push('|---|---:|---:|---|');
  for (const inv of sortedInvariants(report.invariants)) {
    lines.push(invariantRow(inv, report.headline));
  }
  lines.push('');
  lines.push(
    '<sub>🎯 = the leak this PR introduced or fixed. counts are exact — a residual is a real leak, not a sample.</sub>',
  );
  lines.push('');

  // ── footprint + micro, collapsed ──
  renderFootprint(lines, report);
  renderMicro(lines, report);

  lines.push('---');
  const footer = [`${report.churn?.cycles ?? '?'} cycles`, 'GC ×2/sample'];
  if (report.chrome) { footer.push(`Chrome ${report.chrome} (pinned)`); }
  footer.push('counts exact');
  footer.push(`heap ±${NOISE_FLOOR.heapPercent}% floor`);
  if (report.wall_clock_seconds != null) { footer.push(formatWall(report.wall_clock_seconds)); }
  lines.push(`<sub>${footer.join(' · ')}</sub>`);

  return lines.join('\n');
}

function verdictLines(report) {
  if (report.state === 'leak') {
    const broken = report.invariants.filter((i) => i.verdict === 'broken');
    const lead = broken[0];
    const detached = broken.find((i) => i.id === 'detachedNodes');
    let s = `\`${escapeCode(lead.label)}\` grows ${signed(lead.residual)} after ${
      report.churn?.cycles ?? '?'
    } teardown cycles`;
    if (lead.perCycle && Math.abs(lead.perCycle) >= 1) {
      s += ` (${signed(lead.perCycle)}/cycle)`;
    }
    s += '.';
    if (detached && detached !== lead) {
      s += ` ${signed(detached.residual)} detached DOM nodes survive.`;
    }
    s += report.footprint.state === 'within-noise' ? ' Footprint flat.' : '';
    return [s];
  }
  if (report.state === 'improvement') {
    const fixed = report.invariants.filter((i) => i.verdict === 'fixed').map((i) => escapeCode(i.label));
    return [`teardown now nets to zero where \`${baseRef}\` leaked: ${fixed.join(', ')}.`];
  }
  if (report.state === 'watch') {
    return ['all teardown invariants held; footprint grew past the noise floor — worth a glance, not a gate.'];
  }
  return ['all teardown invariants held; footprint within noise.'];
}

function sortedInvariants(invariants) {
  const rank = { broken: 0, fixed: 1, held: 2 };
  return [...invariants].sort((a, b) => {
    if (rank[a.verdict] !== rank[b.verdict]) { return rank[a.verdict] - rank[b.verdict]; }
    return Math.abs(b.residual) - Math.abs(a.residual);
  });
}

function invariantRow(inv, headlineId) {
  const mark = inv.id === headlineId ? ' 🎯' : '';
  let verdict;
  if (inv.verdict === 'broken') {
    verdict = `🔴 ${signed(inv.residual)}`;
    if (inv.perCycle && Math.abs(inv.perCycle) >= 1) { verdict += ` (${signed(inv.perCycle)}/cycle)`; }
  }
  else if (inv.verdict === 'fixed') {
    verdict = `🟢 fixed (was ${signed(inv.baseResidual)})`;
  }
  else {
    verdict = '✅ held';
  }
  return `| ${escapeText(inv.label)}${mark} | ${inv.baseline} | ${inv.afterChurn} | ${verdict} |`;
}

function renderFootprint(lines, report) {
  lines.push('<details>');
  lines.push('<summary>Footprint by scene (post-GC retained heap)</summary>');
  lines.push('');
  lines.push('| scene | retained | Δ | |');
  lines.push('|---|---:|---:|---|');
  for (const op of report.footprint.ops) {
    const delta = op.deltaKb == null ? 'new' : signedKb(op.deltaKb);
    const tag = op.deltaKb == null ? '' : op.withinNoise ? 'within noise' : op.deltaKb > 0 ? 'grew' : 'shrank';
    lines.push(`| \`${escapeCode(op.label)}\` | ${formatKb(op.headKb)} | ${delta} | ${tag} |`);
  }
  lines.push('');
  lines.push('</details>');
  lines.push('');
}

function renderMicro(lines, report) {
  const m = report.reactivity_micro;
  if (!m) { return; }
  lines.push('<details>');
  lines.push('<summary>Reactivity micro (Node, --expose-gc)</summary>');
  lines.push('');
  const delta = m.deltaKb == null
    ? ''
    : ` (${signedKb(m.deltaKb)}${m.pct != null ? `, ${signedPct(m.pct)}` : ''}${
      m.withinNoise ? ', within noise' : ''
    })`;
  lines.push(`${m.n} signals + computeds + reactions: ${formatKb(m.headKb)} graph heapUsed${delta}`);
  lines.push('');
  lines.push(`<sub>residual after teardown + GC: ${formatKb(m.residualKb)} — a footprint trend, not a gate.</sub>`);
  lines.push('');
  lines.push('</details>');
  lines.push('');
}

/* ----------------------------- words ----------------------------- */

function brokenWord(n) {
  return n > 0 ? `🔴 ${n} invariant${n === 1 ? '' : 's'} broken` : '✅ 0 broken';
}

function heldWord(summary) {
  if (summary.fixed > 0) { return `🟢 ${summary.fixed} fixed · ✅ ${summary.held} held`; }
  return `✅ ${summary.held} held`;
}

function footprintWord(footprint) {
  if (footprint.state === 'grew') { return 'footprint grew past floor'; }
  if (footprint.state === 'shrank') { return 'footprint shrank'; }
  return 'footprint within noise';
}

/* ----------------------------- format ----------------------------- */

function readCount(snapshot, phase, id) {
  return snapshot.browser?.invariants?.[phase]?.[id] ?? 0;
}

function signed(n) {
  if (n === 0) { return '0'; }
  return `${n > 0 ? '+' : '-'}${Math.abs(n)}`;
}

function formatKb(kb) {
  if (kb == null) { return 'n/a'; }
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(0)} KB`;
}

function signedKb(kb) {
  // sub-1KB rounds to "0 KB" with no sign — a -0.4 KB wiggle reading as "-0 KB"
  // is just runner drift, not a shrink
  if (Math.abs(kb) < 1) { return '0 KB'; }
  const sign = kb > 0 ? '+' : '-';
  const n = Math.abs(kb);
  return n >= 1024 ? `${sign}${(n / 1024).toFixed(2)} MB` : `${sign}${n.toFixed(0)} KB`;
}

function signedPct(pct) {
  if (Math.abs(pct) < 0.05) { return '0%'; }
  return `${pct > 0 ? '+' : '-'}${Math.abs(pct).toFixed(1)}%`;
}

function baseLink(report) {
  if (!report.repo) { return `\`${report.base.ref}\``; }
  const target = isHexSha(report.base.sha)
    ? `https://github.com/${report.repo}/commit/${report.base.sha}`
    : `https://github.com/${report.repo}/tree/${report.base.ref}`;
  return `[${report.base.ref}](${target})`;
}

function formatWall(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return m > 0 ? `${m}m${s.toString().padStart(2, '0')}s` : `${s}s`;
}

/* ----------------------------- io ----------------------------- */

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function readBaselineSha(dir) {
  const p = path.join(dir, 'baseline-sha.txt');
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8').trim() : '';
}

function extractRunId(url) {
  const m = /\/actions\/runs\/(\d+)/.exec(url ?? '');
  return m ? m[1] : '';
}

// escape markdown and html so untrusted values render as literal text
function escapeText(s) {
  return String(s ?? '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/[\x00-\x1f\x7f]/g, '')
    .replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c])
    .replace(/[\\`\[\]!|]/g, '\\$&');
}

// strip what a code span or table cell can't contain (backtick, pipe, control chars)
function escapeCode(s) {
  return String(s ?? '').replace(/[`|\x00-\x1f\x7f]/g, '');
}

function isHexSha(s) {
  return typeof s === 'string' && /^[0-9a-f]{7,64}$/i.test(s);
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) { continue; }
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) { out[key] = true; }
    else {
      out[key] = next;
      i++;
    }
  }
  return out;
}

function required(key) {
  if (args[key] === undefined) {
    console.error(`Missing required --${key}`);
    process.exit(1);
  }
  return args[key];
}

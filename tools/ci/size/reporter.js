#!/usr/bin/env node
/*
  Bundle-size reporter. Diffs two collect.js snapshots (PR head vs merge base)
  and emits:
    - size-report.json  (structured adjunct for tooling)
    - comment.md        (the PR comment)

  Sizes are exact bytes from a deterministic build, so a nonzero delta is a
  real change — there's no confidence interval to reason about. The whole job
  is: which bundles moved, by how much, and which way the wind blows.

  Headline: `@semantic-ui/component` whenever its bundle moved — it's the
  entry point you need to ship any component. When it didn't move, the changed
  bundle whose package shipped the most code is promoted instead.

  Usage:
    node reporter.js --results <dir> --sha <sha> --repo <owner/name> [--msg ...]
      [--run-url ...] [--run-id ...] [--base-ref main] [--wall-clock <sec>]
      [--out <dir>]
*/
import fs from 'node:fs';
import path from 'node:path';

const args = parseArgs(process.argv.slice(2));
const resultsDir = required('results');
const sha = required('sha');
const msg = args.msg ?? '';
const runUrl = args['run-url'] ?? '';
const runId = args['run-id'] ?? '';
const baseRef = args['base-ref'] ?? 'main';
const repo = args.repo ?? process.env.GITHUB_REPOSITORY ?? '';
const wallClockSec = args['wall-clock'] ? Number(args['wall-clock']) : null;
const outDir = args.out ?? './size-report';

// The bundle the headline speaks for whenever it moved — the entry point you
// need to ship any component.
const HEADLINE_ID = 'pkg-component';

// Headline banner states, a sister to the performance bot's: smaller is the
// good direction (✅), larger the bad one (❌), so the two comments read with
// one shared grammar. `added` folds into larger, `removed` into smaller.
function determineState(summary) {
  const larger = summary.grew + summary.added;
  const smaller = summary.shrank + summary.removed;
  if (smaller > 0 && larger === 0) { return { key: 'improvement', emoji: '✅', heading: 'Improvement', alert: 'TIP' }; }
  if (larger > 0 && smaller === 0) {
    return {
      key: 'regression',
      emoji: '❌',
      heading: 'Regression',
      alert: 'CAUTION',
    };
  }
  if (larger > 0 && smaller > 0) {
    const modifier = larger > smaller ? 'mostly larger' : smaller > larger ? 'mostly smaller' : 'balanced';
    return { key: 'mixed', emoji: '🟡', heading: `Mixed (${modifier})`, alert: 'WARNING' };
  }
  return { key: 'no-change', emoji: '⚪', heading: 'No Meaningful Change', alert: 'NOTE' };
}

// Significance tiers, graded on whichever is larger — percent or absolute
// brotli. Percent alone over-flags tiny bundles (+100 B is +18% on a 500 B
// primitive) and under-flags big ones (+600 B is +0.4% on the framework), so
// a change escalates if it clears either axis. Emoji match the perf bot's
// severity set so the two comments read as one suite: ❗‼️🚨 for growth,
// ⭐🌟🏆 for savings (mapped from its slower / faster glyphs). Below the
// first tier a row shows bare numbers, no emoji.
const SEVERITY_TIERS = [
  { pct: 15, abs: 8192, grew: '🚨', shrank: '🏆', grewWord: 'grew sharply', shrankWord: 'shrank sharply' },
  { pct: 5, abs: 2048, grew: '‼️', shrank: '🌟', grewWord: 'grew a lot', shrankWord: 'shrank a lot' },
  { pct: 1, abs: 500, grew: '❗', shrank: '⭐', grewWord: 'grew', shrankWord: 'shrank' },
];

function severityTier(deltaBytes, baseBytes) {
  const abs = Math.abs(deltaBytes);
  const pct = baseBytes > 0 ? (abs / baseBytes) * 100 : (abs > 0 ? Infinity : 0);
  for (let i = 0; i < SEVERITY_TIERS.length; i++) {
    const t = SEVERITY_TIERS[i];
    if (pct >= t.pct || abs >= t.abs) { return SEVERITY_TIERS.length - i; } // 3 = extreme … 1 = significant
  }
  return 0;
}

function severityEmoji(metric) {
  if (metric.status === 'unchanged') { return ''; }
  const base = metric.base?.brotli ?? 0;
  const tier = severityTier(metric.delta.brotli, base);
  if (tier === 0) { return ''; }
  const t = SEVERITY_TIERS[SEVERITY_TIERS.length - tier];
  return metric.delta.brotli > 0 ? t.grew : t.shrank;
}

const baselineSha = readBaselineSha(resultsDir);
const current = readJson(path.join(resultsDir, 'current.json'));
const baseline = readJson(path.join(resultsDir, 'baseline.json'));

const report = buildReport(current, baseline);
const markdown = renderMarkdown(report);

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'size-report.json'), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(outDir, 'comment.md'), markdown);

const headlineMetric = report.metrics.find((m) => m.id === report.headline);
console.log(
  `${report.summary.grew} grew, ${report.summary.shrank} shrank, `
    + `${report.summary.unchanged} unchanged. headline: ${headlineMetric?.label ?? 'none'}`,
);

/* ----------------------------- build ----------------------------- */

function buildReport(cur, base) {
  // union of both sides so a package deleted by the PR (gone from head,
  // still in base) is still reported as removed
  const ids = new Set([...Object.keys(cur.targets), ...Object.keys(base.targets ?? {})]);
  const metrics = [];
  for (const id of ids) {
    const h = cur.targets[id];
    const b = base.targets?.[id];
    if (!h?.exists && !b?.exists) { continue; }
    metrics.push(diffTarget(id, h, b));
  }

  const loc = diffLoc(cur.loc, base.loc);

  const summary = { grew: 0, shrank: 0, unchanged: 0, added: 0, removed: 0 };
  for (const m of metrics) { summary[m.status]++; }

  const changed = metrics.filter((m) => m.status !== 'unchanged');
  const headline = pickHeadline(metrics, changed, loc);

  // headline first, then biggest mover by absolute brotli delta
  changed.sort((a, b) => {
    if (a.id === headline?.id) { return -1; }
    if (b.id === headline?.id) { return 1; }
    return Math.abs(b.delta.brotli) - Math.abs(a.delta.brotli);
  });

  return {
    head: { sha, msg, ref: process.env.GITHUB_HEAD_REF || '' },
    base: { sha: baselineSha, ref: baseRef },
    run: { url: runUrl, id: runId || extractRunId(runUrl) },
    repo,
    wall_clock_seconds: wallClockSec,
    state: determineState(summary).key,
    summary,
    headline: headline ? headline.id : null,
    metrics,
    changed: changed.map((m) => m.id),
    loc,
  };
}

function diffTarget(id, head, base) {
  const descriptor = {
    id,
    label: head?.label ?? base?.label ?? id,
    group: head?.group ?? base?.group ?? 'package',
    scope: head?.scope ?? base?.scope ?? null,
    headline: !!(head?.headline ?? base?.headline),
  };
  if (head?.exists && !base?.exists) {
    return { ...descriptor, status: 'added', head: sizes(head), base: null, delta: sizes(head) };
  }
  if (!head?.exists && base?.exists) {
    return { ...descriptor, status: 'removed', head: null, base: sizes(base), delta: negate(sizes(base)) };
  }
  const delta = {
    raw: head.raw - base.raw,
    gzip: head.gzip - base.gzip,
    brotli: head.brotli - base.brotli,
  };
  let status = 'unchanged';
  if (delta.brotli > 0) { status = 'grew'; }
  else if (delta.brotli < 0) { status = 'shrank'; }
  return { ...descriptor, status, head: sizes(head), base: sizes(base), delta };
}

function diffLoc(cur, base) {
  const scopes = new Set([...Object.keys(cur.byScope), ...Object.keys(base.byScope)]);
  const byScope = {};
  for (const scope of scopes) {
    const h = cur.byScope[scope] ?? { code: 0, comment: 0, blank: 0, files: 0 };
    const b = base.byScope[scope] ?? { code: 0, comment: 0, blank: 0, files: 0 };
    byScope[scope] = {
      code: h.code,
      comment: h.comment,
      codeDelta: h.code - b.code,
      commentDelta: h.comment - b.comment,
    };
  }
  return {
    total: {
      code: cur.total.code,
      comment: cur.total.comment,
      codeDelta: cur.total.code - base.total.code,
      commentDelta: cur.total.comment - base.total.comment,
      blankDelta: cur.total.blank - base.total.blank,
    },
    byScope,
  };
}

function pickHeadline(metrics, changed, loc) {
  const component = metrics.find((m) => m.id === HEADLINE_ID);
  if (component && component.status !== 'unchanged') { return component; }
  if (changed.length > 0) {
    // promote the changed bundle whose package shipped the most code
    return [...changed].sort((a, b) => {
      const la = Math.abs(loc.byScope[a.scope]?.codeDelta ?? 0);
      const lb = Math.abs(loc.byScope[b.scope]?.codeDelta ?? 0);
      if (lb !== la) { return lb - la; }
      return Math.abs(b.delta.brotli) - Math.abs(a.delta.brotli);
    })[0];
  }
  return component ?? null;
}

/* ----------------------------- render ----------------------------- */

function renderMarkdown(report) {
  const lines = [];
  const banner = determineState(report.summary);
  const headline = report.metrics.find((m) => m.id === report.headline);
  const shortSha = report.head.sha.slice(0, 7);
  const shaLink = report.repo
    ? `[\`${shortSha}\`](https://github.com/${report.repo}/commit/${report.head.sha})`
    : `\`${shortSha}\``;

  // ── banner: sister to the perf bot — same {state} for {sha} on {suite} shape ──
  lines.push(`### ${banner.emoji} ${banner.heading} for ${shaLink} on Bundle Analysis 📦`);
  lines.push('');

  const meta = [`**Base:** ${baseLink(report)}`];
  if (report.run.url) {
    const label = report.run.id ? `#${report.run.id}` : 'run';
    meta.push(`**Run:** [${label}](${report.run.url})`);
    meta.push(`**Raw:** [\`size-report.json\`](${report.run.url}/artifacts)`);
  }
  lines.push(meta.join(' · '));
  lines.push('');
  if (report.head.msg) {
    lines.push(`<sup>${escape(report.head.msg)}</sup>`);
    lines.push('');
  }

  // ── alert: verdict in one sentence ──
  lines.push(`> [!${banner.alert}]`);
  lines.push(`> ${verdictSentence(report, headline)}`);
  lines.push('');

  // ── count line ──
  const larger = report.summary.grew + report.summary.added;
  const smaller = report.summary.shrank + report.summary.removed;
  lines.push(`**✅ ${smaller} smaller · ❌ ${larger} larger · ⚪ ${report.summary.unchanged} unchanged**`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // ── the story: bundles that moved (expanded) ──
  const changed = report.changed.map((id) => report.metrics.find((m) => m.id === id));
  if (changed.length === 0) {
    lines.push('No bundle changed size. 🎉');
    lines.push('');
  }
  else {
    lines.push(`#### Bundles that changed (${changed.length})`);
    lines.push('');
    lines.push('| bundle | change | size | Δ brotli | Δ gzip | Δ raw |');
    lines.push('|---|---|---|---|---|---|');
    for (const m of changed) { lines.push(changedRow(m, report.headline)); }
    lines.push('');
    lines.push(
      '<sub>change = brotli % · ❗ ‼️ 🚨 larger · ⭐ 🌟 🏆 smaller · 🎯 headline · size is brotli, Δ columns are byte deltas</sub>',
    );
    lines.push('');
  }

  // ── full matrix (collapsed) ──
  renderFullMatrix(lines, report);

  // ── lines of code (collapsed) ──
  renderLoc(lines, report);

  // ── footer ──
  lines.push('---');
  const footer = ['brotli q11 · gzip l9', `vs \`${report.base.ref}\``, 'fresh build both sides'];
  if (report.wall_clock_seconds != null) { footer.push(formatWall(report.wall_clock_seconds)); }
  lines.push(`<sub>${footer.join(' · ')}</sub>`);

  return lines.join('\n');
}

function verdictSentence(report, headline) {
  if (report.state === 'no-change') {
    return 'No shipped bundle changed size.';
  }
  if (headline.status === 'added') {
    return `New \`${headline.label}\` bundle ships at ${formatSize(headline.head.brotli)} brotli.`;
  }
  if (headline.status === 'removed') {
    return `\`${headline.label}\` removed, dropping ${formatSize(Math.abs(headline.delta.brotli))} brotli.`;
  }
  return `\`${headline.label}\` ${changeVerb(headline)} **${signedSize(headline.delta.brotli)}** brotli `
    + `to ${formatSize(headline.head.brotli)} (${signedPct(headline.delta.brotli, headline.base.brotli)}).`;
}

// tier-aware adjective for the headline sentence: 'edged up' below the first
// significance tier, then 'grew' / 'grew a lot' / 'grew sharply'.
function changeVerb(metric) {
  const grew = metric.delta.brotli > 0;
  const tier = severityTier(metric.delta.brotli, metric.base?.brotli ?? 0);
  if (tier === 0) { return grew ? 'edged up' : 'edged down'; }
  const t = SEVERITY_TIERS[SEVERITY_TIERS.length - tier];
  return grew ? t.grewWord : t.shrankWord;
}

// Columns lead with what a scroller scans for: the percent change (with its
// severity icon) and the absolute brotli size. The three trailing columns are
// byte deltas — running gzip/raw sizes live in the full matrix.
function changedRow(m, headlineId) {
  const mark = m.id === headlineId ? ' 🎯' : '';
  return `| \`${m.label}\`${mark} | ${changeCell(m)} | ${sizeCell(m)} `
    + `| ${signedSize(m.delta.brotli)} | ${signedSize(m.delta.gzip)} | ${signedSize(m.delta.raw)} |`;
}

function changeCell(m) {
  const sev = severityEmoji(m);
  const tail = sev ? ` ${sev}` : '';
  if (m.status === 'added') { return `**new**${tail}`; }
  if (m.status === 'removed') { return `**removed**${tail}`; }
  return `${signedPct(m.delta.brotli, m.base.brotli)}${tail}`;
}

function sizeCell(m) {
  if (m.status === 'removed') { return '—'; }
  return formatSize(m.head.brotli);
}

function renderFullMatrix(lines, report) {
  const ordered = [...report.metrics].sort((a, b) => {
    const order = { package: 0, framework: 1, primitive: 2 };
    if (order[a.group] !== order[b.group]) { return order[a.group] - order[b.group]; }
    return a.label.localeCompare(b.label);
  });
  lines.push('<details>');
  lines.push(`<summary>All ${ordered.length} bundles</summary>`);
  lines.push('');
  lines.push('| bundle | group | brotli | Δ brotli | gzip | raw |');
  lines.push('|---|---|---|---|---|---|');
  for (const m of ordered) {
    const head = m.head ?? { brotli: 0, gzip: 0, raw: 0 };
    const dBr = m.status === 'unchanged' ? '—' : signedSize(m.delta.brotli);
    lines.push(
      `| \`${m.label}\` | ${m.group} | ${formatSize(head.brotli)} | ${dBr} | ${formatSize(head.gzip)} | ${
        formatSize(head.raw)
      } |`,
    );
  }
  lines.push('');
  lines.push('</details>');
  lines.push('');
}

function renderLoc(lines, report) {
  const t = report.loc.total;
  const moved = Object.entries(report.loc.byScope)
    .filter(([, v]) => v.codeDelta !== 0 || v.commentDelta !== 0)
    .sort((a, b) => Math.abs(b[1].codeDelta) - Math.abs(a[1].codeDelta));
  const summary = `${signed(t.codeDelta)} code · ${signed(t.commentDelta)} comments`;
  lines.push('<details>');
  lines.push(`<summary>Lines shipped (comments stripped): ${summary}</summary>`);
  lines.push('');
  if (moved.length === 0) {
    lines.push('No change in shipped source lines.');
  }
  else {
    lines.push('Code lines that actually ship, comments and blanks removed.');
    lines.push('');
    lines.push('| scope | code | comments |');
    lines.push('|---|---|---|');
    for (const [scope, v] of moved) {
      lines.push(`| \`${scope}\` | ${signed(v.codeDelta)} | ${signed(v.commentDelta)} |`);
    }
  }
  lines.push('');
  lines.push('</details>');
  lines.push('');
}

/* ----------------------------- format ----------------------------- */

function sizes(t) {
  return { raw: t.raw, gzip: t.gzip, brotli: t.brotli };
}

function negate(s) {
  return { raw: -s.raw, gzip: -s.gzip, brotli: -s.brotli };
}

function formatSize(bytes) {
  const n = Math.abs(bytes);
  if (n >= 1024) { return `${(bytes / 1024).toFixed(1)} KB`; }
  return `${bytes} B`;
}

function signedSize(bytes) {
  const sign = bytes > 0 ? '+' : bytes < 0 ? '-' : '±';
  const n = Math.abs(bytes);
  return n >= 1024 ? `${sign}${(n / 1024).toFixed(2)} KB` : `${sign}${n} B`;
}

function signedPct(delta, base) {
  if (!base) { return 'n/a'; }
  const pct = (delta / base) * 100;
  const sign = pct > 0 ? '+' : pct < 0 ? '' : '±';
  return `${sign}${pct.toFixed(1)}%`;
}

function signed(n) {
  return n > 0 ? `+${n}` : `${n}`;
}

function baseLink(report) {
  if (!report.repo) { return `\`${report.base.ref}\``; }
  const target = report.base.sha
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

function escape(s) {
  return s.replace(/[<>]/g, (c) => (c === '<' ? '&lt;' : '&gt;'));
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

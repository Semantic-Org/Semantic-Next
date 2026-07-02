#!/usr/bin/env node
/*
  Bundle-size reporter. Diffs two collect.js snapshots (PR head vs merge base)
  and emits:
    - size-report.json  (structured adjunct for tooling)
    - comment.md        (the PR comment)

  Sizes are exact bytes from a deterministic build, so a nonzero delta is a
  real change — there's no confidence interval to reason about.

  The headline is `@semantic-ui/component` whenever its bundle moved. It already
  contains reactivity, renderer, templating and the rest, so its delta is the
  real cost a component shipper pays — there's no cross-bundle sum to take (the
  bundles overlap, so summing would double-count). The other changed bundles
  are shown for context. When component didn't move, the changed bundle whose
  package shipped the most code is promoted to headline instead.

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

const HEADLINE_ID = 'pkg-component';

// Just-noticeable difference: a bundle is "changed" only when its brotli delta
// clears one of these. Below them the movement isn't worth a reviewer's eye.
const JND = { bytes: 128, percent: 0.5 };

// Trace floors are minified (pre-compression) bytes — attribution and export
// costs come from the harness's own esbuild pass, where brotli can't attribute.
// `verdict` is the per-export growth that earns a line in the top alert.
const TRACE = { module: 16, export: 16, verdict: 512, maxRows: 8 };

// Severity keys off the worst single bundle's brotli growth, never a sum.
// Percent escalates a tier, but only paired with a real absolute move —
// otherwise a tiny primitive (+100 B = +14%) would read as a regression.
// `percentFloor` is the absolute a percent must clear to escalate to regression.
const SEVERITY = {
  warning: { bytes: 512, percent: 2 },
  regression: { bytes: 5120, percent: 10, percentFloor: 2048 },
  fail: { bytes: 10240 },
};

// Five states, a small vocabulary. Red/failure language (🔴 CAUTION) is
// reserved for CI-failing growth — warnings stay yellow.
const STATE_INFO = {
  'no-change': { emoji: '⚪', alert: 'NOTE', word: '' },
  improvement: { emoji: '🟢', alert: 'NOTE', word: ' improvement' },
  mixed: { emoji: '🟡', alert: 'WARNING', word: '' },
  warning: { emoji: '🟡', alert: 'WARNING', word: ' warning' },
  regression: { emoji: '🔴', alert: 'CAUTION', word: ' regression' },
};

const baselineSha = readBaselineSha(resultsDir);
const current = readJson(path.join(resultsDir, 'current.json'));
const baseline = readJson(path.join(resultsDir, 'baseline.json'));

const report = buildReport(current, baseline);
const markdown = renderMarkdown(report);

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'size-report.json'), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(outDir, 'comment.md'), markdown);

const headlineMetric = report.metrics.find((m) => m.id === report.headline);
console.log(`state: ${report.state}. headline: ${headlineMetric?.label ?? 'none'}. ${report.changed.length} changed.`);

/* ----------------------------- build ----------------------------- */

function buildReport(cur, base) {
  // union of both sides so a package deleted by the PR is still reported
  const ids = new Set([...Object.keys(cur.targets), ...Object.keys(base.targets ?? {})]);
  const metrics = [];
  for (const id of ids) {
    const h = cur.targets[id];
    const b = base.targets?.[id];
    if (!h?.exists && !b?.exists) { continue; }
    metrics.push(diffTarget(id, h, b));
  }

  const loc = diffLoc(cur.loc, base.loc);

  const summary = { larger: 0, smaller: 0, unchanged: 0, added: 0, removed: 0 };
  for (const m of metrics) { summary[m.status]++; }

  const changed = metrics.filter((m) => m.status !== 'unchanged');
  // real signals first, then tree-shaken; within each, increases first by
  // absolute delta, then decreases
  changed.sort((a, b) => {
    if (a.treeShaken !== b.treeShaken) { return a.treeShaken ? 1 : -1; }
    const aPos = a.delta.brotli > 0;
    const bPos = b.delta.brotli > 0;
    if (aPos !== bPos) { return aPos ? -1 : 1; }
    return Math.abs(b.delta.brotli) - Math.abs(a.delta.brotli);
  });

  // Severity, headline, and largest-increase consider only real signals.
  // Tree-shaken whole-package bundles (utils) are an upper bound — shown, but
  // they never raise the banner on their own.
  const realChanged = changed.filter((m) => !m.treeShaken);
  const headline = pickHeadline(metrics, realChanged, loc);
  const increases = realChanged.filter((m) => m.delta.brotli > 0);
  const largest = increases.length
    ? increases.reduce((a, b) => (b.delta.brotli > a.delta.brotli ? b : a))
    : null;
  const state = classifyState(increases, realChanged.filter((m) => m.delta.brotli < 0));
  const fail = realChanged.some((m) => m.delta.brotli >= SEVERITY.fail.bytes);

  return {
    head: { sha, msg, ref: process.env.GITHUB_HEAD_REF || '' },
    base: { sha: baselineSha, ref: baseRef },
    run: { url: runUrl, id: runId || extractRunId(runUrl) },
    repo,
    wall_clock_seconds: wallClockSec,
    state,
    fail,
    summary,
    total_bundles: metrics.length,
    headline: headline ? headline.id : null,
    largest_increase: largest ? largest.id : null,
    changed: changed.map((m) => m.id),
    metrics,
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
    treeShaken: !!(head?.treeShaken ?? base?.treeShaken),
  };
  if (head?.exists && !base?.exists) {
    return { ...descriptor, status: 'added', head: sizes(head), base: null, delta: sizes(head), pct: null };
  }
  if (!head?.exists && base?.exists) {
    return { ...descriptor, status: 'removed', head: null, base: sizes(base), delta: negate(sizes(base)), pct: -100 };
  }
  const delta = {
    raw: head.raw - base.raw,
    gzip: head.gzip - base.gzip,
    brotli: head.brotli - base.brotli,
  };
  const pct = base.brotli > 0 ? (delta.brotli / base.brotli) * 100 : 0;
  const meaningful = Math.abs(delta.brotli) >= JND.bytes || Math.abs(pct) >= JND.percent;
  let status = 'unchanged';
  if (meaningful) { status = delta.brotli > 0 ? 'larger' : 'smaller'; }
  const metric = { ...descriptor, status, head: sizes(head), base: sizes(base), delta, pct };
  // both sides or nothing: a one-sided trace failure (swallowed by collect on purpose) must
  // degrade to no section, never to a false mass added/removed diff
  if (head.modules && base.modules) {
    metric.moduleDeltas = diffModules(byteMap(head.modules), byteMap(base.modules));
  }
  if (head.exports && base.exports) {
    metric.exportDeltas = diffExports(exportMap(head.exports), exportMap(base.exports));
  }
  return metric;
}

// snapshots are artifacts from the unprivileged job — keep only finite-number byte values
// on a clean prototype so a crafted field can't reach the comment or the arithmetic
function byteMap(map) {
  const clean = Object.create(null);
  for (const [key, value] of Object.entries(map)) {
    if (typeof value === 'number' && Number.isFinite(value)) { clean[key] = value; }
  }
  return clean;
}

// export entries carry { cost, graph } — same trust boundary, same filtering
function exportMap(map) {
  const clean = Object.create(null);
  for (const [name, value] of Object.entries(map)) {
    if (
      value && typeof value === 'object'
      && typeof value.cost === 'number' && Number.isFinite(value.cost)
      && typeof value.graph === 'string'
    ) {
      clean[name] = { cost: value.cost, graph: value.graph };
    }
  }
  return clean;
}

// per-module minified-byte movement inside a bundle, above the trace floor
function diffModules(head, base) {
  const keys = new Set([...Object.keys(head), ...Object.keys(base)]);
  const deltas = [];
  for (const key of keys) {
    const h = head[key] ?? 0;
    const b = base[key] ?? 0;
    if (Math.abs(h - b) >= TRACE.module) { deltas.push({ key, head: h, base: b, delta: h - b }); }
  }
  deltas.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  return deltas;
}

// co-movement groups: a row is one distinct finding — exports sharing the same
// graph transition (head fingerprint, base fingerprint) AND the same delta
// magnitude move together, and are reported through their master alone: the
// cheapest member (purest probe), ties broken shortest-then-alphabetical so
// labels stay stable across PRs. graph-merging changes (a leak pulls new
// modules into many graphs) split honestly because base fingerprints differ,
// and statement-level shaking quirks split on the delta bucket
function diffExports(head, base) {
  const changed = [];
  const added = [];
  const removed = [];
  const groups = new Map();
  for (const [name, entry] of Object.entries(head)) {
    const baseEntry = Object.hasOwn(base, name) ? base[name] : null;
    const delta = baseEntry ? entry.cost - baseEntry.cost : null;
    const key = baseEntry ? `${entry.graph}\u0000${baseEntry.graph}` : `${entry.graph}\u0000<new>`;
    if (!groups.has(key)) { groups.set(key, []); }
    groups.get(key).push({ name, cost: entry.cost, base: baseEntry?.cost ?? null, delta });
  }
  const livingGraphs = new Set(
    Object.entries(head)
      .filter(([name]) => Object.hasOwn(base, name))
      .map(([, entry]) => entry.graph),
  );
  for (const [key, group] of groups) {
    // one graph transition can still hide distinct magnitudes (a config-carrier
    // already paid in base what its siblings gain) — split on delta gaps rather
    // than fixed buckets, so co-movers stay together and true splits separate
    for (const cohort of splitByDeltaGap(group)) {
      const master = pickMaster(cohort);
      if (master.delta === null) {
        // a new export sharing a living group's graph is a slave — silent. only a
        // graph-novel surface is news
        if (!livingGraphs.has(key.split('\u0000')[0])) {
          added.push({ name: master.name, bytes: master.cost, groupSize: cohort.length });
        }
        continue;
      }
      if (Math.abs(master.delta) >= TRACE.export) {
        changed.push({
          name: master.name,
          head: master.cost,
          base: master.base,
          delta: master.delta,
          pct: master.base > 0 ? (master.delta / master.base) * 100 : null,
          groupSize: cohort.length,
        });
      }
    }
  }
  // a base group none of whose members survive is a removed surface
  const baseGroups = new Map();
  for (const [name, entry] of Object.entries(base)) {
    if (Object.hasOwn(head, name)) { continue; }
    if (!baseGroups.has(entry.graph)) { baseGroups.set(entry.graph, []); }
    baseGroups.get(entry.graph).push({ name, cost: entry.cost, delta: null, base: entry.cost });
  }
  for (const [graph, group] of baseGroups) {
    // survivors of the same base graph mean the surface still exists — renames and
    // partial removals within a living group stay out of the report
    const survives = Object.entries(base).some(([name, entry]) => entry.graph === graph && Object.hasOwn(head, name));
    if (survives) { continue; }
    const master = pickMaster(group);
    removed.push({ name: master.name, bytes: master.cost, groupSize: group.length });
  }
  changed.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  added.sort((a, b) => a.name.localeCompare(b.name));
  removed.sort((a, b) => a.name.localeCompare(b.name));
  if (!changed.length && !added.length && !removed.length) { return null; }
  return { changed, added, removed };
}

function splitByDeltaGap(group) {
  const withDelta = group.filter((m) => m.delta !== null).sort((a, b) => a.delta - b.delta);
  const fresh = group.filter((m) => m.delta === null);
  const cohorts = fresh.length ? [fresh] : [];
  let current = [];
  for (const member of withDelta) {
    if (current.length && member.delta - current[current.length - 1].delta > 64) {
      cohorts.push(current);
      current = [];
    }
    current.push(member);
  }
  if (current.length) { cohorts.push(current); }
  return cohorts;
}

function pickMaster(group) {
  return [...group].sort((a, b) => a.cost - b.cost || a.name.length - b.name.length || (a.name < b.name ? -1 : 1))[0];
}

function diffLoc(cur, base) {
  const scopes = new Set([...Object.keys(cur.byScope), ...Object.keys(base.byScope)]);
  const byScope = {};
  for (const scope of scopes) {
    const h = cur.byScope[scope] ?? { code: 0, comment: 0 };
    const b = base.byScope[scope] ?? { code: 0, comment: 0 };
    byScope[scope] = { codeDelta: h.code - b.code, commentDelta: h.comment - b.comment };
  }
  return {
    total: {
      codeDelta: cur.total.code - base.total.code,
      commentDelta: cur.total.comment - base.total.comment,
    },
    byScope,
  };
}

function classifyState(increases, decreases) {
  if (increases.length === 0 && decreases.length === 0) { return 'no-change'; }
  if (increases.some(isRegression)) { return 'regression'; }
  if (increases.length > 0 && decreases.length > 0) { return 'mixed'; }
  if (increases.length > 0) {
    return increases.some(isWarning) ? 'warning' : 'mixed'; // a small increase with no offset reads as mixed
  }
  return 'improvement';
}

function isRegression(m) {
  if (m.delta.brotli >= SEVERITY.regression.bytes) { return true; }
  return m.pct != null && m.pct >= SEVERITY.regression.percent && m.delta.brotli >= SEVERITY.regression.percentFloor;
}

function isWarning(m) {
  return m.delta.brotli >= SEVERITY.warning.bytes || (m.pct != null && m.pct >= SEVERITY.warning.percent);
}

function pickHeadline(metrics, changed, loc) {
  const component = metrics.find((m) => m.id === HEADLINE_ID);
  if (component && component.status !== 'unchanged') { return component; }
  if (changed.length > 0) {
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
  const info = STATE_INFO[report.state];
  const headline = report.metrics.find((m) => m.id === report.headline);
  const loc = report.loc.total;
  const shortSha = report.head.sha.slice(0, 7);
  const shaLink = report.repo
    ? `[\`${shortSha}\`](https://github.com/${report.repo}/commit/${report.head.sha})`
    : `\`${shortSha}\``;

  // ── title: the two numbers a reviewer wants up front ──
  const titleMid = report.state === 'no-change'
    ? 'no meaningful change'
    : `\`${escapeCode(headline.label)}\` ${signedSize(headline.delta.brotli)} brotli`;
  lines.push(
    `### ${info.emoji} Bundle size${info.word}: ${titleMid} · ${signedLoc(loc.codeDelta)} shipped LOC for ${shaLink}`,
  );
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
    lines.push(`<sup>${escapeText(report.head.msg)}</sup>`);
    lines.push('');
  }

  // ── alert: one human-readable interpretation ──
  lines.push(`> [!${info.alert}]`);
  for (const v of verdictLines(report, headline)) { lines.push(`> ${v}`); }
  lines.push('');

  // ── summary counts + the two LOC numbers ──
  const larger = report.summary.larger + report.summary.added;
  const smaller = report.summary.smaller + report.summary.removed;
  lines.push(
    `**${larger} larger · ${smaller} smaller · ${report.summary.unchanged} unchanged`
      + ` · ${signedLoc(loc.codeDelta)} shipped LOC · ${signedLoc(loc.commentDelta)} comment LOC**`,
  );
  lines.push('');

  // ── the story: bundles that changed ──
  const changed = report.changed.map((id) => report.metrics.find((m) => m.id === id));
  if (changed.length === 0) {
    lines.push('No bundle changed size. 🎉');
    lines.push('');
  }
  else {
    lines.push(`#### Bundles that changed (${changed.length} of ${report.total_bundles})`);
    lines.push('');
    // the `from` column appears only when attribution exists — traceless snapshots
    // render the table exactly as before
    const attributed = changed.some((m) => m.moduleDeltas?.length);
    lines.push(
      attributed ? '| bundle | brotli | Δ brotli | change | from |' : '| bundle | brotli | Δ brotli | change |',
    );
    lines.push(attributed ? '|---|---:|---:|---:|---|' : '|---|---:|---:|---:|');
    for (const m of changed) { lines.push(changedRow(m, report.headline, attributed)); }
    lines.push('');
    let caption = 'Sorted by absolute brotli delta, increases first. 🎯 = bundle most relevant to this PR.';
    if (changed.some((m) => m.treeShaken)) {
      caption +=
        ' † = consumed piecemeal, so the whole-package bundle is an upper bound and does not drive the verdict.';
    }
    if (attributed) {
      caption += ' `from` = share of the movement by source module, from the harness build.';
    }
    lines.push(`<sub>${caption}</sub>`);
    lines.push('');
  }

  renderTrackedExports(lines, report);
  renderLocByScope(lines, report);
  renderAllBundles(lines, report);

  lines.push('---');
  const footer = ['brotli q11 · gzip l9', `vs \`${report.base.ref}\``, 'fresh build both sides'];
  if (report.wall_clock_seconds != null) { footer.push(formatWall(report.wall_clock_seconds)); }
  lines.push(`<sub>${footer.join(' · ')}</sub>`);

  return lines.join('\n');
}

function verdictLines(report, headline) {
  const loc = report.loc.total;
  if (report.state === 'no-change') {
    const treeShakenChanged = report.changed
      .map((id) => report.metrics.find((m) => m.id === id))
      .some((m) => m.treeShaken);
    if (treeShakenChanged) {
      return withExportVerdict(report, [
        'No change to the bundles real consumers ship. A tree-shaken package moved — see the table.',
      ]);
    }
    let s = 'No shipped bundle changed size.';
    if (loc.codeDelta === 0 && loc.commentDelta !== 0) { s += ' PR changes are comments-only.'; }
    return withExportVerdict(report, [s]);
  }
  const verb = headline.delta.brotli > 0 ? 'grew' : 'shrank';
  const source = dominantSource(headline);
  let s =
    `\`${escapeCode(headline.label)}\` ${verb} **${signedSize(headline.delta.brotli)}** brotli to ${
      formatSize(headline.head.brotli)
    }`
    + ` (${signedPct(headline.delta.brotli, headline.base?.brotli)}${source ? `, from \`${escapeCode(source)}\`` : ''})`
    + ` across **${signedLoc(loc.codeDelta)} shipped LOC**.`;
  const largest = report.largest_increase ? report.metrics.find((m) => m.id === report.largest_increase) : null;
  if (largest && largest.id !== headline.id) {
    s += ` Largest increase: \`${escapeCode(largest.label)}\` **${signedSize(largest.delta.brotli)}**`
      + ` (${signedPct(largest.delta.brotli, largest.base?.brotli)}).`;
  }
  return withExportVerdict(report, [s]);
}

// a per-export cost jump is real shipped cost for piecemeal consumers even when
// no whole bundle moved, so past the verdict floor it earns a line up top
function withExportVerdict(report, lines) {
  const movers = [];
  for (const m of report.metrics) {
    for (const e of m.exportDeltas?.changed ?? []) {
      if (e.delta >= TRACE.verdict) { movers.push({ ...e, label: m.label }); }
    }
  }
  if (!movers.length) { return lines; }
  movers.sort((a, b) => b.delta - a.delta);
  const shown = movers.slice(0, 2)
    .map((e) => `\`${escapeCode(e.name)}\` **${signedSize(e.delta)}** min (\`${escapeCode(e.label)}\`)`)
    .join(', ');
  const more = movers.length > 2 ? ` and ${movers.length - 2} more` : '';
  return [...lines, `Import costs moved: ${shown}${more} — see Tracked import costs.`];
}

function changedRow(m, headlineId, attributed) {
  const mark = m.id === headlineId ? ' 🎯' : m.treeShaken ? ' †' : '';
  const brotliAbs = m.status === 'removed' ? '—' : formatSize(m.head.brotli);
  const change = m.status === 'added'
    ? 'new'
    : m.status === 'removed'
    ? 'removed'
    : signedPct(m.delta.brotli, m.base.brotli);
  const row = `| \`${escapeCode(m.label)}\`${mark} | ${brotliAbs} | ${signedSize(m.delta.brotli)} | ${change}`;
  return attributed ? `${row} | ${fromCell(m)} |` : `${row} |`;
}

// one tight cell: where the movement came from, top sources by share of the
// total module-level movement, at most two named
function fromCell(m) {
  const deltas = m.moduleDeltas ?? [];
  if (!deltas.length) { return '—'; }
  const total = deltas.reduce((n, d) => n + Math.abs(d.delta), 0);
  if (total === 0) { return '—'; }
  const parts = deltas.slice(0, 2)
    .map((d) => `\`${escapeCode(d.key)}\` ${Math.round((Math.abs(d.delta) / total) * 100)}%`);
  if (deltas.length > 2) { parts.push('…'); }
  return parts.join(' · ');
}

function dominantSource(m) {
  const deltas = m.moduleDeltas ?? [];
  if (!deltas.length) { return null; }
  const total = deltas.reduce((n, d) => n + Math.abs(d.delta), 0);
  if (total === 0) { return null; }
  const top = deltas[0];
  return Math.abs(top.delta) / total >= 0.6 ? top.key : null;
}

// tracked import costs: one row per moved co-movement group, named by its
// master. slaves are priced but never listed — covariance that is known is
// kept out of mind, so a row here is always a distinct finding
function renderTrackedExports(lines, report) {
  const traced = report.metrics.filter((m) => m.exportDeltas !== undefined);
  if (!traced.length) { return; }
  const moved = traced.filter((m) => m.exportDeltas);
  const count = moved.reduce(
    (n, m) => n + m.exportDeltas.changed.length + m.exportDeltas.added.length + m.exportDeltas.removed.length,
    0,
  );
  lines.push('<details>');
  lines.push(
    `<summary>Tracked import costs (${traced.map((m) => escapeText(m.label)).join(' · ')}): ${
      count === 0 ? 'no movement' : `${count} moved`
    }</summary>`,
  );
  lines.push('');
  if (!moved.length) {
    lines.push("No tracked export's import cost moved.");
  }
  else {
    lines.push('| package | export | min | Δ min |');
    lines.push('|---|---|---:|---:|');
    for (const m of moved) {
      for (const e of m.exportDeltas.changed) {
        const pct = e.pct != null && Math.abs(e.pct) >= 1
          ? ` (${e.pct > 0 ? '+' : '-'}${Math.abs(e.pct).toFixed(0)}%)`
          : '';
        lines.push(
          `| \`${escapeCode(m.label)}\` | \`${escapeCode(e.name)}\` | ${formatSize(e.head)} | ${
            signedSize(e.delta)
          }${pct} |`,
        );
      }
      for (const e of m.exportDeltas.added) {
        lines.push(`| \`${escapeCode(m.label)}\` | \`${escapeCode(e.name)}\` | ${formatSize(e.bytes)} | new |`);
      }
      for (const e of m.exportDeltas.removed) {
        lines.push(`| \`${escapeCode(m.label)}\` | \`${escapeCode(e.name)}\` | — | removed |`);
      }
    }
    lines.push('');
    lines.push(
      '<sub>The minified cost of importing just this export, standalone. One row per co-movement'
        + ' group, named by its master — full per-export pricing in size-report.json.</sub>',
    );
  }
  lines.push('');
  lines.push('</details>');
  lines.push('');
}

function renderLocByScope(lines, report) {
  const loc = report.loc.total;
  const moved = Object.entries(report.loc.byScope)
    .filter(([, v]) => v.codeDelta !== 0 || v.commentDelta !== 0)
    .sort((a, b) => Math.abs(b[1].codeDelta) - Math.abs(a[1].codeDelta));
  lines.push('<details>');
  lines.push(
    `<summary>LOC by scope: ${signedLoc(loc.codeDelta)} shipped LOC · ${
      signedLoc(loc.commentDelta)
    } comment LOC</summary>`,
  );
  lines.push('');
  if (moved.length === 0) {
    lines.push('No change in shipped source lines.');
  }
  else {
    lines.push('Shipped LOC excludes comments and blank lines.');
    lines.push('');
    lines.push('| scope | shipped LOC | comment LOC |');
    lines.push('|---|---:|---:|');
    for (const [scope, v] of moved) {
      lines.push(`| \`${escapeCode(scope)}\` | ${signedLoc(v.codeDelta)} | ${signedLoc(v.commentDelta)} |`);
    }
  }
  lines.push('');
  lines.push('</details>');
  lines.push('');
}

function renderAllBundles(lines, report) {
  lines.push('<details>');
  lines.push(`<summary>All ${report.total_bundles} bundles, gzip, and raw sizes</summary>`);
  lines.push('');
  lines.push('| bundle | group | brotli | Δ brotli | gzip | Δ gzip | raw | Δ raw |');
  lines.push('|---|---|---:|---:|---:|---:|---:|---:|');
  for (const m of report.metrics) {
    const head = m.head ?? { brotli: 0, gzip: 0, raw: 0 };
    const mark = m.id === report.headline ? ' 🎯' : m.treeShaken ? ' †' : '';
    lines.push(
      `| \`${escapeCode(m.label)}\`${mark} | ${escapeText(m.group)} | ${formatSize(head.brotli)} | ${
        deltaOrDash(m, 'brotli')
      }`
        + ` | ${formatSize(head.gzip)} | ${deltaOrDash(m, 'gzip')} | ${formatSize(head.raw)} | ${
          deltaOrDash(m, 'raw')
        } |`,
    );
  }
  lines.push('');
  lines.push('</details>');
  lines.push('');
}

function deltaOrDash(m, key) {
  return m.delta[key] === 0 ? '—' : signedSize(m.delta[key]);
}

/* ----------------------------- format ----------------------------- */

function sizes(t) {
  return { raw: t.raw, gzip: t.gzip, brotli: t.brotli };
}

function negate(s) {
  return { raw: -s.raw, gzip: -s.gzip, brotli: -s.brotli };
}

// snapshot fields are artifact data — a non-numeric value renders as a dash, never as markdown
function formatSize(bytes) {
  if (typeof bytes !== 'number' || !Number.isFinite(bytes)) { return '—'; }
  const n = Math.abs(bytes);
  return n >= 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${bytes} B`;
}

function signedSize(bytes) {
  if (typeof bytes !== 'number' || !Number.isFinite(bytes)) { return '—'; }
  if (bytes === 0) { return '0 B'; }
  const sign = bytes > 0 ? '+' : '-';
  const n = Math.abs(bytes);
  return n >= 1024 ? `${sign}${(n / 1024).toFixed(2)} KB` : `${sign}${n} B`;
}

function signedPct(delta, base) {
  if (!base) { return 'new'; }
  const pct = (delta / base) * 100;
  if (pct === 0) { return '0%'; }
  return `${pct > 0 ? '+' : '-'}${Math.abs(pct).toFixed(1)}%`;
}

function signedLoc(n) {
  return `${n >= 0 ? '+' : '-'}${Math.abs(n)}`;
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

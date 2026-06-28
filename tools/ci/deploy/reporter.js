#!/usr/bin/env node
/*
  Deploy-bot reporter. Renders the PR comment for the deploy suite member, one
  row per target (docs and mcp now, more later). Two modes:

    --mode deploying  the announce job posts this when a labeled deploy starts.
                      Requested targets read Building with an ETA. The rest NA.
    --mode final      the report job posts this when the deploy run completes.
                      Each target reads Ready (with a preview link) or Failed,
                      from the facts file its deploy job uploaded.

  The comment is intentionally tight: title, one table, one Run line. The exact
  deploy URL lives in the footer so both link columns stay fixed-width.

  Nothing free-text reaches the markdown. The only rendered values are a hex
  sha, the constant target ids, formatted clock times, and sanitized https URLs,
  so there's no comment-injection surface to escape. The commit subject is
  carried in the JSON adjunct only.

  Usage:
    node reporter.js --mode deploying --targets docs,mcp --started <iso>
      --build-seconds <n|''> --sha <sha> --run-url <url> --run-id <id>
      --repo <owner/name> [--msg ...] --out <dir>
    node reporter.js --mode final --facts <dir> --sha <sha> --run-url <url>
      --run-id <id> --repo <owner/name> [--msg ...] --out <dir>
*/
import fs from 'node:fs';
import path from 'node:path';

import { TARGETS } from './targets.js';

// US Eastern, DST-aware: renders EST in winter, EDT in summer, always at the
// team's wall clock. The suite reports times here.
const DISPLAY_TZ = 'America/New_York';

const STATE = {
  deploying: { emoji: '🟡', phrase: 'Deploying Preview' },
  ready: { emoji: '🟢', phrase: 'Preview Ready' },
  partial: { emoji: '🟡', phrase: 'Preview Partially Ready' },
  failed: { emoji: '🔴', phrase: 'Preview Failed' },
};

const args = parseArgs(process.argv.slice(2));
const mode = required('mode');
const sha = required('sha');
const repo = args.repo ?? process.env.GITHUB_REPOSITORY ?? '';
const msg = args.msg ?? '';
const runUrl = args['run-url'] ?? '';
const runId = args['run-id'] ?? extractRunId(runUrl);
const outDir = args.out ?? './deploy-report';

const report = mode === 'deploying' ? buildDeploying() : buildFinal();
const markdown = renderMarkdown(report);

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'preview-report.json'), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(outDir, 'comment.md'), markdown);

console.log(
  `mode: ${mode}. state: ${report.state}. `
    + `${report.targets.filter((t) => t.status !== 'na').length} target(s).`,
);

/* ----------------------------- build ----------------------------- */

function buildDeploying() {
  const requested = new Set(
    (args.targets ?? '').split(',').map((s) => s.trim()).filter(Boolean),
  );
  const started = args.started ?? '';
  const buildSeconds = parseSeconds(args['build-seconds']);
  const targets = TARGETS.map((t) => ({
    id: t.id,
    status: requested.has(t.id) ? 'building' : 'na',
  }));
  return {
    mode,
    state: 'deploying',
    head: { sha, msg },
    run: { url: runUrl, id: runId },
    repo,
    timing: { started, build_seconds: buildSeconds, eta: etaIso(started, buildSeconds) },
    targets,
  };
}

function buildFinal() {
  const facts = readFacts(args.facts);
  const targets = TARGETS.map((t) => {
    const f = facts.get(t.id);
    if (!f) { return { id: t.id, status: 'na' }; }
    const url = sanitizeUrl(f.url);
    // a ready deploy with no usable URL can't be a working preview, so read it failed
    const status = f.status === 'ready' && url ? 'ready' : 'failed';
    return {
      id: t.id,
      status,
      url: status === 'ready' ? url : null,
      host: status === 'ready' ? hostOf(url) : null,
      inspect: sanitizeUrl(f.inspect) || null,
    };
  });
  const attempted = targets.filter((t) => t.status !== 'na');
  const failed = attempted.filter((t) => t.status === 'failed');
  const ready = attempted.filter((t) => t.status === 'ready');
  // nothing deployed reads as failed rather than a hollow ready (only reachable
  // if a labeled run produced no facts at all)
  let state = attempted.length === 0 ? 'failed' : 'ready';
  if (failed.length > 0) { state = ready.length > 0 ? 'partial' : 'failed'; }
  return { mode, state, head: { sha, msg }, run: { url: runUrl, id: runId }, repo, targets };
}

/* ----------------------------- render ----------------------------- */

function renderMarkdown(r) {
  const s = STATE[r.state] ?? STATE.ready;
  const lines = [`### ${s.emoji} ${s.phrase} for ${shaLink(r)}`, ''];
  if (r.mode === 'deploying') { renderDeployingTable(lines, r); }
  else { renderFinalTable(lines, r); }
  lines.push(footer(r));
  return lines.join('\n');
}

function renderDeployingTable(lines, r) {
  const eta = r.timing.eta ? fmtClock(r.timing.eta) : '—';
  const started = r.timing.started ? fmtClock(r.timing.started) : '—';
  const build = r.timing.build_seconds ? `~${fmtDuration(r.timing.build_seconds)}` : '—';
  lines.push('| project | status | eta | started | build time | logs |');
  lines.push('|---|---|---|---|---|---|');
  for (const t of r.targets) {
    if (t.status === 'building') {
      lines.push(`| \`${t.id}\` | 🟡 Building | ${eta} | ${started} | ${build} | [logs](${r.run.url}) |`);
    }
    else {
      lines.push(`| \`${t.id}\` | ⚪ NA | — | — | — | — |`);
    }
  }
  lines.push('');
}

function renderFinalTable(lines, r) {
  lines.push('| project | status | preview | logs |');
  lines.push('|---|---|---|---|');
  for (const t of r.targets) {
    if (t.status === 'ready') {
      lines.push(`| \`${t.id}\` | 🟢 Ready | [Preview](${t.url}) | [logs](${t.inspect || r.run.url}) |`);
    }
    else if (t.status === 'failed') {
      lines.push(`| \`${t.id}\` | 🔴 Failed | — | [logs](${r.run.url}) |`);
    }
    else {
      lines.push(`| \`${t.id}\` | ⚪ NA | — | — |`);
    }
  }
  lines.push('');
}

function footer(r) {
  const parts = [];
  if (r.run.url) { parts.push(`**Run:** [${r.run.id ? `#${r.run.id}` : 'run'}](${r.run.url})`); }
  if (r.mode === 'final') {
    if (r.run.url) { parts.push(`**Raw:** [\`preview-report.json\`](${r.run.url}/artifacts)`); }
    for (const t of r.targets) {
      if (t.status === 'ready' && t.host) { parts.push(`\`${t.id}\` \`${t.host}\``); }
    }
  }
  return `<sup>${parts.join(' · ')}</sup>`;
}

/* ----------------------------- format ----------------------------- */

function shaLink(r) {
  const short = escapeCode(r.head.sha.slice(0, 7));
  return isHexSha(r.head.sha) && r.repo
    ? `[\`${short}\`](https://github.com/${r.repo}/commit/${r.head.sha})`
    : `\`${short}\``;
}

function fmtClock(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) { return '—'; }
  return d.toLocaleTimeString('en-US', { timeZone: DISPLAY_TZ, hour: 'numeric', minute: '2-digit' });
}

function fmtDuration(sec) {
  const s = Math.round(sec);
  return s >= 60 ? `${Math.round(s / 60)}m` : `${s}s`;
}

function etaIso(started, buildSeconds) {
  if (!started || !buildSeconds) { return null; }
  const t = Date.parse(started);
  return Number.isNaN(t) ? null : new Date(t + buildSeconds * 1000).toISOString();
}

function parseSeconds(v) {
  const n = Number(v);
  return v != null && v !== '' && Number.isFinite(n) && n > 0 ? n : null;
}

// only render a URL we're sure can't break out of markdown or HTML: an https
// host, optional port, and a path with no whitespace, quotes, parens, or brackets
function sanitizeUrl(u) {
  return typeof u === 'string' && /^https:\/\/[a-z0-9.-]+(?::\d+)?(?:\/[^\s)<>"'`]*)?$/i.test(u)
    ? u
    : '';
}

function hostOf(url) {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

/* ----------------------------- io ----------------------------- */

function readFacts(dir) {
  const map = new Map();
  if (!dir || !fs.existsSync(dir)) { return map; }
  const files = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { walk(p); }
      else if (e.name.endsWith('.json')) { files.push(p); }
    }
  };
  walk(dir);
  for (const f of files) {
    try {
      const data = JSON.parse(fs.readFileSync(f, 'utf8'));
      if (data && data.id) { map.set(data.id, data); }
    }
    catch { /* a corrupt facts file just leaves its target NA */ }
  }
  return map;
}

function extractRunId(url) {
  const m = /\/actions\/runs\/(\d+)/.exec(url ?? '');
  return m ? m[1] : '';
}

function isHexSha(s) {
  return typeof s === 'string' && /^[0-9a-f]{7,64}$/i.test(s);
}

// strip what a code span can't contain, so a non-hex sha fallback stays inert
function escapeCode(s) {
  return String(s ?? '').replace(/[`|\x00-\x1f\x7f]/g, '');
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

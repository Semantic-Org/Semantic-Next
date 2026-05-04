#!/usr/bin/env node
/*
  Fetch prior bench results from this PR's branch to build a per-iteration
  history. Walks completed Benchmarks workflow runs, downloads their
  results-* artifacts, extracts per-metric absolute CIs, and outputs a
  pr-history.json in the same schema as bench-history.json.

  The reporter merges this PR-iteration history with bench-history.json
  (main-commit history) to compute cross-run peak attribution. An agent
  iterating on a perf branch sees: "iteration 3 was the best on
  update-10th; your current iteration regressed from that."

  Usage:
    node fetch-pr-history.js \
      --branch <name>           PR head branch name
      --repo <owner/name>       GitHub repo slug
      --current-run-id <id>     exclude this run from history (it's the one we're reporting)
      --max-runs <n>            cap at N most recent prior runs (default: 20)
      --out <path>              output path (default: ./pr-history.json)

  Requires `gh` CLI authenticated (GITHUB_TOKEN or GH_TOKEN in env).
*/

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const args = parseArgs(process.argv.slice(2));
const branch = required(args, 'branch');
const repo = required(args, 'repo');
const currentRunId = args['current-run-id'] ?? '';
const maxRuns = Number(args['max-runs'] ?? 20);
const outPath = args.out ?? './pr-history.json';

// List successful Benchmarks workflow runs on this branch.
const runsRaw = exec(
  `gh run list --repo "${repo}" --workflow=benchmarks.yml --limit ${maxRuns * 2} `
    + `--json databaseId,conclusion,headBranch,headSha,displayTitle,createdAt`,
);
const allRuns = JSON.parse(runsRaw);
const prRuns = allRuns
  .filter((r) => r.headBranch === branch && r.conclusion === 'success')
  .filter((r) => String(r.databaseId) !== String(currentRunId))
  .slice(0, maxRuns);

console.log(`Found ${prRuns.length} prior successful bench runs on ${branch}`);

const commits = [];
for (const run of prRuns) {
  const dir = fs.mkdtempSync('/tmp/pr-hist-');
  try {
    exec(
      `gh run download ${run.databaseId} --repo "${repo}" `
        + `--pattern "results-*" --dir "${dir}"`,
    );
  }
  catch {
    console.log(`  Skip ${run.databaseId} (artifact download failed)`);
    continue;
  }

  const metrics = loadMetrics(dir);
  if (Object.keys(metrics).length === 0) {
    console.log(`  Skip ${run.databaseId} (no metrics)`);
    continue;
  }

  // Read the sidecar baseline SHA uploaded with the artifacts. Only present
  // on runs from the v2-aware workflow; older runs return '' and entries
  // skip the baseline_sha field entirely (no cross-iteration drift detection
  // possible against pre-v2 iterations).
  const baselineSha = readBaselineSha(dir);
  if (baselineSha) {
    for (const m of Object.values(metrics)) {
      if ('percent_delta_ci' in m) {
        m.baseline_sha = baselineSha;
      }
    }
  }

  commits.push({
    sha: run.headSha,
    msg: run.displayTitle,
    parent_sha: '',
    timestamp: run.createdAt,
    pr: null,
    metrics,
  });
  console.log(
    `  ${run.headSha.slice(0, 7)} — ${Object.keys(metrics).length} metrics`
      + (baselineSha ? ` @ baseline ${baselineSha.slice(0, 7)}` : ''),
  );
}

// Chronological order (oldest first) so peak-index → bisect-candidates
// after peak produces a causal timeline.
commits.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

fs.writeFileSync(outPath, JSON.stringify({ schema_version: 2, commits }, null, 2) + '\n');
console.log(`Wrote ${commits.length} entries to ${outPath}`);

/**
 * Walk a results directory and extract one entry per metric. Pairs each
 * `this-change` benchmark with its `tip-of-tree` counterpart so the
 * within-session percent-delta from `differences[]` is persisted alongside
 * the absolute CI. Same extraction shape as append-history.js.
 */
function loadMetrics(dir) {
  const out = {};
  for (const entry of walk(dir)) {
    if (!entry.endsWith('.json')) { continue; }
    let data;
    try {
      data = JSON.parse(fs.readFileSync(entry, 'utf8'));
    }
    catch {
      continue;
    }
    if (!Array.isArray(data.benchmarks)) { continue; }

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
      if (!cur?.bm.mean) { continue; }
      const metricEntry = {
        ci: [round4(cur.bm.mean.low), round4(cur.bm.mean.high)],
        mean_ms: round4((cur.bm.mean.low + cur.bm.mean.high) / 2),
      };
      if (base) {
        const diff = cur.bm.differences?.[base.index];
        if (diff?.percentChange) {
          metricEntry.percent_delta_ci = [
            round4(diff.percentChange.low),
            round4(diff.percentChange.high),
          ];
        }
      }
      out[name] = metricEntry;
    }
  }
  return out;
}

/**
 * Read the sidecar baseline-sha.txt written by the v2-aware bench workflow
 * alongside the tachometer JSONs. Returns '' if absent (pre-v2 run, or
 * artifact missing the file). Caller decides whether to attach the SHA to
 * extracted entries.
 */
function readBaselineSha(dir) {
  for (const entry of walk(dir)) {
    if (entry.endsWith('baseline-sha.txt')) {
      return fs.readFileSync(entry, 'utf8').trim();
    }
  }
  return '';
}

function round4(n) {
  return Number(n.toFixed(4));
}

function* walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) { yield* walk(full); }
    else { yield full; }
  }
}

function exec(cmd) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) { continue; }
    const key = argv[i].slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) { out[key] = true; }
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

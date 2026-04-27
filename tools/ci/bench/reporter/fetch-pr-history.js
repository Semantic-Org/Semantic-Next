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

  commits.push({
    sha: run.headSha,
    msg: run.displayTitle,
    parent_sha: '',
    timestamp: run.createdAt,
    pr: null,
    metrics,
  });
  console.log(`  ${run.headSha.slice(0, 7)} — ${Object.keys(metrics).length} metrics`);
}

// Chronological order (oldest first) so peak-index → bisect-candidates
// after peak produces a causal timeline.
commits.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

fs.writeFileSync(outPath, JSON.stringify({ schema_version: 1, commits }, null, 2) + '\n');
console.log(`Wrote ${commits.length} entries to ${outPath}`);

/**
 * Walk a results directory and extract one { ci, mean_ms } entry per
 * metric. Uses the `this-change` absolute CI — same extraction logic
 * as append-history.js.
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

    for (const bm of data.benchmarks) {
      const source = (bm.name ?? '').split(' [')[0];
      if (source !== 'this-change') { continue; }
      const metricName = bm.measurement?.name ?? bm.name;
      if (!bm.mean) { continue; }
      out[metricName] = {
        ci: [round4(bm.mean.low), round4(bm.mean.high)],
        mean_ms: round4((bm.mean.low + bm.mean.high) / 2),
      };
    }
  }
  return out;
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

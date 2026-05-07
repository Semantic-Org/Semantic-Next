#!/usr/bin/env node
/*
  Fetch prior bench results from this PR's branch to build a per-iteration
  history. Walks completed Benchmarks workflow runs, downloads their
  results-* artifacts, extracts per-metric CIs, and outputs a
  pr-history.json in the same schema as bench-history.json.

  The reporter merges this PR-iteration history with bench-history.json
  (main-commit history) for cross-run peak attribution. An agent iterating
  on a perf branch sees: "iteration 3 was the best on update-10th; your
  current iteration regressed from that."

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
import { loadHistoryMetrics, readBaselineSha } from './extract-metrics.js';

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

  const baselineSha = readBaselineSha(dir);
  const metrics = loadHistoryMetrics(dir, baselineSha);
  if (Object.keys(metrics).length === 0) {
    console.log(`  Skip ${run.databaseId} (no metrics)`);
    continue;
  }

  // Did this iteration's commit actually touch packages source? GitHub's
  // `paths:` filter triggers benches on any commit in a PR whose overall
  // diff includes packages/**, so harness-only commits ride along when
  // earlier commits in the PR moved packages. Filtering here keeps those
  // commits out of bisect/credit candidate suggestions downstream.
  const touchesPackages = commitTouchesPackages(repo, run.headSha);

  commits.push({
    sha: run.headSha,
    msg: run.displayTitle,
    parent_sha: '',
    timestamp: run.createdAt,
    pr: null,
    touches_packages: touchesPackages,
    metrics,
  });
  console.log(
    `  ${run.headSha.slice(0, 7)} — ${Object.keys(metrics).length} metrics`
      + (baselineSha ? ` @ baseline ${baselineSha.slice(0, 7)}` : '')
      + (touchesPackages ? '' : ' (harness-only)'),
  );
}

// Sort by timestamp so peak → bisect-candidates after peak produces a
// causal timeline.
commits.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

fs.writeFileSync(outPath, JSON.stringify({ schema_version: 2, commits }, null, 2) + '\n');
console.log(`Wrote ${commits.length} entries to ${outPath}`);

function exec(cmd) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

/**
 * Query the GitHub API for the commit's changed-file list and return true
 * when any path is under `packages/`. Defaults to true on API failure so
 * an unreachable commit doesn't silently disappear from candidate lists.
 */
function commitTouchesPackages(repoSlug, sha) {
  try {
    const filesRaw = exec(
      `gh api repos/${repoSlug}/commits/${sha} --jq '.files[].filename'`,
    );
    const files = filesRaw.split('\n').filter(Boolean);
    return files.some((f) => f.startsWith('packages/'));
  }
  catch {
    return true;
  }
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

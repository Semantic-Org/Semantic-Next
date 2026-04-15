#!/usr/bin/env node
/*
  Append a commit's bench measurements to bench-history.json.

  Invoked from benchmarks-report.yml when a bench run was triggered by a
  push to main (not a pull_request). Reads per-metric absolute CIs from
  tachometer JSON output and appends a new entry to the history file,
  which is then committed back to main by the workflow.

  Usage:
    node append-history.js \
      --results <dir>       tachometer JSON output directory
      --sha <sha>           commit SHA being archived
      --msg <text>          commit subject line
      --parent-sha <sha>    parent commit SHA
      --timestamp <iso>     commit timestamp (ISO 8601); defaults to now
      --history <path>      bench-history.json path (default: ./bench-history.json)

  Idempotency: if the same SHA already exists in the file, the entry is
  replaced. Lets a re-run of the workflow (e.g. after a flaky first pass)
  overwrite rather than duplicate.
*/

import fs from 'node:fs';
import path from 'node:path';

const args = parseArgs(process.argv.slice(2));
const resultsDir = required(args, 'results');
const sha = required(args, 'sha');
const msg = args.msg ?? '';
const parentSha = args['parent-sha'] ?? '';
const timestamp = args.timestamp ?? new Date().toISOString();
const historyPath = args.history ?? './bench-history.json';

const metrics = loadMetrics(resultsDir);
// Squash-merge commit titles end with ` (#N)` — the PR the commit came from.
// Capturing it here lets the reporter link peak SHAs straight to the PR page
// (where the bench comment lives) instead of just to the commit view.
const prMatch = /\(#(\d+)\)\s*$/.exec(msg);
const pr = prMatch ? Number(prMatch[1]) : null;
const entry = { sha, msg, parent_sha: parentSha, timestamp, pr, metrics };

const history = readOrSeedHistory(historyPath);
const existingIdx = history.commits.findIndex((c) => c.sha === sha);
if (existingIdx >= 0) {
  history.commits[existingIdx] = entry;
  console.log(`Replaced existing entry for ${sha.slice(0, 7)}`);
}
else {
  history.commits.push(entry);
  console.log(`Appended entry for ${sha.slice(0, 7)}`);
}

fs.writeFileSync(historyPath, JSON.stringify(history, null, 2) + '\n');
console.log(`${history.commits.length} total commit${history.commits.length === 1 ? '' : 's'} in history`);
console.log(`Metrics recorded: ${Object.keys(metrics).length}`);

/**
 * Walk the results directory and extract one { ci, mean_ms } entry per
 * metric. Uses the `this-change` absolute CI — that's the value that
 * indexes by SHA cleanly across time (the delta-vs-base comparison used
 * in PR comments is not meaningful across commits).
 */
function loadMetrics(dir) {
  const out = {};
  for (const entry of walk(dir)) {
    if (!entry.endsWith('.json')) { continue; }
    const data = JSON.parse(fs.readFileSync(entry, 'utf8'));
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

function readOrSeedHistory(filePath) {
  if (!fs.existsSync(filePath)) {
    return { schema_version: 1, commits: [] };
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed.commits)) {
    throw new Error(`Invalid history file: missing or non-array 'commits' field`);
  }
  if (parsed.schema_version !== 1) {
    throw new Error(`Unsupported schema_version ${parsed.schema_version}; expected 1`);
  }
  return parsed;
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

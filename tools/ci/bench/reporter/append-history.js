#!/usr/bin/env node
/*
  Append a commit's bench measurements to bench-history.json.

  Invoked from benchmarks-report.yml when a bench run was triggered by a
  push to main (not a pull_request). Reads per-metric CIs from the
  tachometer JSON output and appends a new entry to the history file,
  which the workflow then commits back to main.

  Usage:
    node append-history.js \
      --results <dir>       tachometer JSON output directory
      --sha <sha>           commit SHA being archived
      --msg <text>          commit subject line
      --parent-sha <sha>    parent commit SHA
      --baseline-sha <sha>  SHA the bench was compared against. Pinned per
                            metric onto entries that have a percent_delta_ci.
      --timestamp <iso>     commit timestamp (ISO 8601); defaults to now
      --history <path>      bench-history.json path (default: ./bench-history.json — relative to CWD)

  Schema: v2. The reader rejects anything else with a reset instruction.

  Idempotency: if the same SHA already exists in the file, the entry is
  replaced. Lets a re-run of the workflow (e.g. after a flaky first pass)
  overwrite rather than duplicate.
*/

import fs from 'node:fs';
import { loadHistoryMetrics } from './extract-metrics.js';

const args = parseArgs(process.argv.slice(2));
const resultsDir = required(args, 'results');
const sha = required(args, 'sha');
const msg = args.msg ?? '';
const parentSha = args['parent-sha'] ?? '';
const baselineSha = args['baseline-sha'] ?? '';
const timestamp = args.timestamp ?? new Date().toISOString();
const historyPath = args.history ?? './bench-history.json';

const metrics = loadHistoryMetrics(resultsDir);
if (baselineSha) {
  for (const m of Object.values(metrics)) {
    if ('percent_delta_ci' in m) {
      m.baseline_sha = baselineSha;
    }
  }
}
// Squash-merge commit titles end with ` (#N)` — capture so peak SHAs link
// straight to the PR conversation page rather than the commit view.
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

function readOrSeedHistory(filePath) {
  if (!fs.existsSync(filePath)) {
    return { schema_version: 2, commits: [] };
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed.commits)) {
    throw new Error(`Invalid history file: missing or non-array 'commits' field`);
  }
  if (parsed.schema_version !== 2) {
    throw new Error(
      `Unsupported schema_version ${parsed.schema_version}; expected 2. `
        + `Reset the file with {"schema_version": 2, "commits": []} to migrate.`,
    );
  }
  return parsed;
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

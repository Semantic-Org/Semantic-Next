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
      --baseline-sha <sha>  SHA the bench was compared against (main's tip at
                            run time). Stored on each metric entry that has a
                            percent_delta_ci. Optional during v1→v2 rollout.
      --timestamp <iso>     commit timestamp (ISO 8601); defaults to now
      --history <path>      bench-history.json path (default: ./bench-history.json — relative to CWD)

  Schema: v2 only. Existing v1 files must be reset to empty v2 manually
  before this writer runs (v1 entries fed the buggy cross-session peak
  attribution being replaced; preserving them is anti-pattern).

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
// SHA the bench was compared against — main's tip at run time. Pins each
// metric's percent_delta_ci to a known reference so cross-iteration peak
// attribution can detect when the baseline itself moved between runs.
// Optional during v1→v2 transition; absent on legacy callers.
const baselineSha = args['baseline-sha'] ?? '';
const timestamp = args.timestamp ?? new Date().toISOString();
const historyPath = args.history ?? './bench-history.json';

const metrics = loadMetrics(resultsDir);
// Within-session percent-delta is the only number tachometer warrants for
// cross-iteration comparison; pin it to its reference SHA. Entries without
// percent_delta_ci (e.g. unpaired single-source results) skip baseline_sha.
if (baselineSha) {
  for (const m of Object.values(metrics)) {
    if ('percent_delta_ci' in m) {
      m.baseline_sha = baselineSha;
    }
  }
}
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
 * Walk the results directory and extract one entry per metric.
 *
 * Pairs each `this-change` benchmark with its `tip-of-tree` counterpart so
 * the within-session percent-delta from `differences[]` can be persisted.
 * That's the only number comparable across iterations — absolute ms across
 * sessions mixes per-session environmental variance and is not safe to
 * compare across commits.
 *
 * Absolute `ci` and `mean_ms` are kept for context (parent-vs-commit views
 * remain valid within a single run). Cross-iteration peak attribution
 * operates on `percent_delta_ci` once the reporter is wired for it.
 */
function loadMetrics(dir) {
  const out = {};
  for (const entry of walk(dir)) {
    if (!entry.endsWith('.json')) { continue; }
    const data = JSON.parse(fs.readFileSync(entry, 'utf8'));
    if (!Array.isArray(data.benchmarks)) { continue; }

    // Group by metric name; index by source (this-change | tip-of-tree).
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

function readOrSeedHistory(filePath) {
  if (!fs.existsSync(filePath)) {
    return { schema_version: 2, commits: [] };
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed.commits)) {
    throw new Error(`Invalid history file: missing or non-array 'commits' field`);
  }
  // v2 only. v1 entries stored absolute ms only and were the data feed for
  // the buggy cross-session peak attribution being replaced; preserving them
  // adds dual-format complexity for no analytic upside. Operator must reset
  // the file (commit empty v2) before this writer can touch it.
  if (parsed.schema_version !== 2) {
    throw new Error(
      `Unsupported schema_version ${parsed.schema_version}; expected 2. `
        + `Reset the file with {"schema_version": 2, "commits": []} to migrate.`,
    );
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

#!/usr/bin/env node
/*
  Record one manual krausest run.

  The official js-framework-benchmark run (6 frameworks, ~50 min, run by
  hand on an idle machine) writes per-result JSON into its own
  webdriver-ts/results dir. This reads that dir and stores the run in two
  places, split by what's worth tracking vs. worth keeping:

    krausest-history.json      the tracked signal — per benchmark,
                               semantic-ui's median relative to the fastest
                               competitor in the same run. Lean and
                               diffable; this is what you watch across SHAs.
    krausest-runs/<sha>.json   the raw medians for every framework in that
                               run, for digging into a single run later.

  Why the primary signal is relative, not absolute: a manual run's absolute
  milliseconds drift between runs with machine state, Chrome version, and
  the competitors' own versions (the same caveat tachometer carries). The
  ratio to the fastest competitor measured in the *same* run cancels that
  drift, so it's the honest cross-SHA signal. Absolute medians are archived
  beside it for context, not for trend-watching.

  Etiquette, not enforcement: commit before you run so the recorded SHA
  actually describes the code measured. Nothing here checks for a dirty
  tree.

  Usage:
    node append-krausest-run.js \
      --results <dir>            js-framework-benchmark webdriver-ts/results
      --wallclock-seconds <n>    bench-only wallclock for the run
      --chrome-version <v>       browser the run used
      [--sha <sha>] [--msg <text>]   default: git HEAD of this repo

  Idempotent on SHA: re-running replaces the existing entry, no duplicate.
*/

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const HISTORY = join(HERE, 'krausest-history.json');
const RUNS_DIR = join(HERE, 'krausest-runs');
const SCHEMA_VERSION = 1;

// The contestant plus the comparison field.
const FRAMEWORKS = ['solid', 'svelte', 'vue', 'lit', 'react-hooks', 'semantic-ui'];
const SELF = 'semantic-ui';
const COMPETITORS = FRAMEWORKS.filter((f) => f !== SELF);

const args = parseArgs(process.argv.slice(2));
const resultsDir = required(args, 'results');
const wallclock = Number(required(args, 'wallclock-seconds'));
const chromeVersion = args['chrome-version'] ?? 'unknown';
const sha = args.sha ?? git('rev-parse', '--short', 'HEAD');
const msg = args.msg ?? git('log', '-1', '--format=%s');

const { medians, versions } = parseResults(resultsDir);

// Per benchmark: self / fastest competitor, plus who the leader was. A
// ratio > 1 means slower (or larger, for size/memory) than the frontier.
const comparison = {};
for (const bench of Object.keys(medians).sort()) {
  const self = medians[bench][SELF];
  if (self == null) { continue; }
  let fastest = null;
  let fastestVal = Infinity;
  for (const c of COMPETITORS) {
    const v = medians[bench][c];
    if (v != null && v < fastestVal) {
      fastestVal = v;
      fastest = c;
    }
  }
  if (fastest === null) { continue; }
  comparison[bench] = { ratio: round(self / fastestVal), fastest };
}

const entry = {
  sha,
  msg,
  timestamp: new Date().toISOString(),
  wallclock_seconds: wallclock,
  chrome_version: chromeVersion,
  field: versions,
  comparison,
};

const history = existsSync(HISTORY)
  ? JSON.parse(readFileSync(HISTORY, 'utf8'))
  : { schema_version: SCHEMA_VERSION, runs: [] };
if (history.schema_version !== SCHEMA_VERSION) {
  throw new Error(`krausest-history.json schema_version ${history.schema_version} != ${SCHEMA_VERSION}`);
}
const idx = history.runs.findIndex((r) => r.sha === sha);
if (idx >= 0) { history.runs[idx] = entry; }
else { history.runs.push(entry); }
writeFileSync(HISTORY, `${JSON.stringify(history, null, 2)}\n`);

if (!existsSync(RUNS_DIR)) { mkdirSync(RUNS_DIR); }
writeFileSync(
  join(RUNS_DIR, `${sha}.json`),
  `${
    JSON.stringify(
      { sha, timestamp: entry.timestamp, chrome_version: chromeVersion, field: versions, medians },
      null,
      2,
    )
  }\n`,
);

console.log(
  `Recorded krausest run ${sha}: ${
    Object.keys(comparison).length
  } benchmarks, ${history.runs.length} run(s) in history`,
);

function parseResults(dir) {
  const medians = {};
  const versions = {};
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.json')) { continue; }
    // <framework>-v<version>-keyed_<benchmark>.json. Non-greedy framework
    // capture + the -v anchor keeps "react-hooks" intact and tolerates
    // pre-release versions like vue's "v3.6.0-alpha.2".
    const m = file.match(/^(.+?)-(v.+?)-keyed_(.+)\.json$/);
    if (!m) { continue; }
    const [, fw, version, bench] = m;
    if (!FRAMEWORKS.includes(fw)) { continue; }
    let json;
    try {
      json = JSON.parse(readFileSync(join(dir, file), 'utf8'));
    }
    catch {
      continue;
    }
    const total = json.values?.total ?? json.values?.DEFAULT;
    const med = typeof total?.median === 'number'
      ? total.median
      : (typeof total?.mean === 'number' ? total.mean : null);
    if (med === null) { continue; }
    (medians[bench] ??= {})[fw] = round(med);
    if (fw !== SELF) { versions[fw] = version.replace(/^v/, ''); }
  }
  return { medians, versions };
}

function git(...a) {
  return execFileSync('git', a, { cwd: HERE, encoding: 'utf8' }).trim();
}

function round(n) {
  return Math.round(n * 100) / 100;
}

function required(a, k) {
  if (a[k] == null) { throw new Error(`missing --${k}`); }
  return a[k];
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) { continue; }
    const key = argv[i].slice(2);
    const next = argv[i + 1];
    out[key] = (next === undefined || next.startsWith('--')) ? true : argv[++i];
  }
  return out;
}

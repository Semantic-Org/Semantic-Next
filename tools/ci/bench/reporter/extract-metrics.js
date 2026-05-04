/*
  Shared helpers for reading per-metric data out of a tachometer results
  directory. Three callers live in this folder:
    - reporter.js (renders PR comment + JSON adjunct)
    - append-history.js (archives main-push runs to bench-history.json)
    - fetch-pr-history.js (rebuilds PR-iteration history from prior run artifacts)

  Each pairs `this-change` with `tip-of-tree` benchmarks per metric so the
  within-session percent-delta from `differences[]` is reachable. Absolute
  ms across two sessions cannot be combined safely, so any cross-iteration
  consumer must reach for the percent-delta — not the mean.
*/

import fs from 'node:fs';
import path from 'node:path';

/**
 * Yield one record per metric across all `*.json` files under `dir`.
 *
 * Each record carries the matched `this-change` benchmark, its
 * `tip-of-tree` counterpart (when present), and the precomputed
 * `differences[]` entry that pairs them. Caller projects into whatever
 * shape it needs.
 *
 * Lets `JSON.parse` errors propagate so a corrupt artifact fails CI
 * loudly with a stack-traced path rather than silently shrinking the
 * report.
 */
export function* iterMetricPairs(dir) {
  for (const entry of walk(dir)) {
    if (!entry.endsWith('.json')) { continue; }
    const data = JSON.parse(fs.readFileSync(entry, 'utf8'));
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
      const diff = base ? cur.bm.differences?.[base.index] : null;
      yield { name, current: cur, base, diff };
    }
  }
}

/**
 * Project results into the bench-history entry shape:
 *   { name → { ci, mean_ms, percent_delta_ci?, baseline_sha? } }
 *
 * `baseline_sha` (when supplied) pins each `percent_delta_ci` to its
 * comparison reference. Entries without a paired tip-of-tree skip both
 * `percent_delta_ci` and `baseline_sha` — there's nothing to pin to.
 */
export function loadHistoryMetrics(dir, baselineSha = '') {
  const out = {};
  for (const { name, current, diff } of iterMetricPairs(dir)) {
    const m = current.bm.mean;
    const entry = {
      ci: [round4(m.low), round4(m.high)],
      mean_ms: round4((m.low + m.high) / 2),
    };
    if (diff?.percentChange) {
      entry.percent_delta_ci = [round4(diff.percentChange.low), round4(diff.percentChange.high)];
      if (baselineSha) {
        entry.baseline_sha = baselineSha;
      }
    }
    out[name] = entry;
  }
  return out;
}

/**
 * Read the `baseline-sha.txt` sidecar uploaded next to the tachometer
 * JSONs. Returns '' when absent or unreadable; caller decides what
 * "no baseline" means in its context.
 */
export function readBaselineSha(dir) {
  for (const entry of walk(dir)) {
    if (entry.endsWith('baseline-sha.txt')) {
      try {
        return fs.readFileSync(entry, 'utf8').trim();
      }
      catch {
        return '';
      }
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

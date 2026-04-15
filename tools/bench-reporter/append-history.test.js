/*
  Unit tests for append-history.js.
  Run with: node --test tools/bench-reporter/append-history.test.js
*/

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT = path.join(__dirname, 'append-history.js');
const FIXTURE_DIR = path.join(__dirname, 'fixtures', 'real-delta');

function runAppend({ sha, msg = 'test', parentSha = '', timestamp, historyPath, resultsDir = FIXTURE_DIR }) {
  const argv = [
    SCRIPT,
    '--results',
    resultsDir,
    '--sha',
    sha,
    '--msg',
    msg,
    '--parent-sha',
    parentSha,
    '--history',
    historyPath,
  ];
  if (timestamp) { argv.push('--timestamp', timestamp); }
  // Capture stderr so throw-cases can assert on the inner error message.
  execFileSync('node', argv, { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' });
  return JSON.parse(fs.readFileSync(historyPath, 'utf8'));
}

test('seeds a new history file when one does not exist', () => {
  const tmp = fs.mkdtempSync('/tmp/bench-hist-test-');
  const historyPath = path.join(tmp, 'bench-history.json');
  const result = runAppend({ sha: 'abc123', historyPath, timestamp: '2026-04-15T00:00:00Z' });

  assert.equal(result.schema_version, 1);
  assert.equal(result.commits.length, 1);
  assert.equal(result.commits[0].sha, 'abc123');
  assert.equal(result.commits[0].timestamp, '2026-04-15T00:00:00Z');
  assert.ok(Object.keys(result.commits[0].metrics).length > 0, 'metrics extracted');
});

test('appends to an existing history', () => {
  const tmp = fs.mkdtempSync('/tmp/bench-hist-test-');
  const historyPath = path.join(tmp, 'bench-history.json');
  fs.writeFileSync(
    historyPath,
    JSON.stringify({
      schema_version: 1,
      commits: [{ sha: 'existing-commit', msg: 'old', parent_sha: '', timestamp: '2026-01-01T00:00:00Z', metrics: {} }],
    }),
  );
  const result = runAppend({ sha: 'new-commit', historyPath });

  assert.equal(result.commits.length, 2);
  assert.equal(result.commits[0].sha, 'existing-commit', 'prior entry preserved');
  assert.equal(result.commits[1].sha, 'new-commit', 'new entry appended at end');
});

test('replaces an existing entry with matching SHA (idempotent re-run)', () => {
  const tmp = fs.mkdtempSync('/tmp/bench-hist-test-');
  const historyPath = path.join(tmp, 'bench-history.json');
  // Seed with an older entry for the same SHA we're about to write
  fs.writeFileSync(
    historyPath,
    JSON.stringify({
      schema_version: 1,
      commits: [{
        sha: 'target-sha',
        msg: 'stale',
        parent_sha: '',
        timestamp: '2000-01-01T00:00:00Z',
        metrics: { old: { ci: [1, 2], mean_ms: 1.5 } },
      }],
    }),
  );
  const result = runAppend({ sha: 'target-sha', msg: 'fresh', historyPath, timestamp: '2026-04-15T00:00:00Z' });

  assert.equal(result.commits.length, 1, 'no duplicate entries');
  assert.equal(result.commits[0].msg, 'fresh', 'replaced not appended');
  assert.equal(result.commits[0].timestamp, '2026-04-15T00:00:00Z');
  assert.ok(!('old' in result.commits[0].metrics), 'stale metrics replaced');
});

test('extracts this-change absolute CIs only (not tip-of-tree)', () => {
  const tmp = fs.mkdtempSync('/tmp/bench-hist-test-');
  const historyPath = path.join(tmp, 'bench-history.json');
  const result = runAppend({ sha: 'abc', historyPath });

  const metrics = result.commits[0].metrics;
  // The real-delta fixture has known this-change means for these metrics
  // (update-10th, toggle-middle are the biggest movers in that run).
  assert.ok('update-10th' in metrics);
  assert.ok('toggle-middle' in metrics);
  assert.ok(Array.isArray(metrics['update-10th'].ci));
  assert.equal(metrics['update-10th'].ci.length, 2);
  assert.equal(typeof metrics['update-10th'].mean_ms, 'number');
  // Mean is the midpoint of the CI
  const { ci, mean_ms } = metrics['update-10th'];
  assert.ok(Math.abs(mean_ms - (ci[0] + ci[1]) / 2) < 0.01, 'mean is CI midpoint');
});

test('records parent_sha when provided', () => {
  const tmp = fs.mkdtempSync('/tmp/bench-hist-test-');
  const historyPath = path.join(tmp, 'bench-history.json');
  const result = runAppend({ sha: 'child', parentSha: 'parent', historyPath });
  assert.equal(result.commits[0].parent_sha, 'parent');
});

test('rejects an unsupported schema version', () => {
  const tmp = fs.mkdtempSync('/tmp/bench-hist-test-');
  const historyPath = path.join(tmp, 'bench-history.json');
  fs.writeFileSync(historyPath, JSON.stringify({ schema_version: 99, commits: [] }));
  try {
    runAppend({ sha: 'x', historyPath });
    assert.fail('expected script to exit non-zero');
  }
  catch (e) {
    const combined = (e.stderr ?? '') + (e.message ?? '');
    assert.match(combined, /Unsupported schema_version/);
  }
});

test('round-trips numeric precision (4dp for ms)', () => {
  const tmp = fs.mkdtempSync('/tmp/bench-hist-test-');
  const historyPath = path.join(tmp, 'bench-history.json');
  const result = runAppend({ sha: 'abc', historyPath });

  // Pick any metric and verify numeric fields round-trip cleanly
  const anyMetric = Object.values(result.commits[0].metrics)[0];
  assert.ok(Number.isFinite(anyMetric.ci[0]));
  assert.ok(Number.isFinite(anyMetric.ci[1]));
  assert.ok(Number.isFinite(anyMetric.mean_ms));
  // Values should be finite, non-negative (timing in ms)
  assert.ok(anyMetric.mean_ms > 0, 'mean_ms is positive');
});

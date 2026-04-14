/*
  Unit tests for reporter.js.
  Run with: node --test tools/bench-reporter/reporter.test.js

  Fixture snapshots act as regression tests: the markdown and JSON output
  for two real runs (one with meaningful multi-magnitude delta, one with
  zero-delta) is asserted on every time the script changes. Bugs in
  classification, formatting, or ordering produce a visible diff.
*/

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPORTER = path.join(__dirname, 'reporter.js');

function runReporter({ fixture, sha, msg, baseSha, baseRef = 'main', runUrl = '' }) {
  const tmp = fs.mkdtempSync(path.join('/tmp', 'bench-report-test-'));
  execFileSync('node', [
    REPORTER,
    '--results',
    path.join(__dirname, 'fixtures', fixture),
    '--sha',
    sha,
    '--msg',
    msg,
    '--run-url',
    runUrl,
    '--base-ref',
    baseRef,
    '--base-sha',
    baseSha,
    '--out',
    tmp,
  ], { stdio: ['ignore', 'pipe', 'inherit'] });
  const report = JSON.parse(fs.readFileSync(path.join(tmp, 'bench-report.json'), 'utf8'));
  const markdown = fs.readFileSync(path.join(tmp, 'comment.md'), 'utf8');
  return { report, markdown };
}

test('real-delta fixture — summary counts and key verdicts', () => {
  const { report } = runReporter({
    fixture: 'real-delta',
    sha: '7efaff96abcdef',
    msg: 'Perf: Gate each phase-3 notify',
    baseSha: '087308428',
  });

  // Shape of summary is stable across the suite
  assert.equal(report.metrics.length, 21, 'expected 21 metrics total');
  assert.equal(report.summary.faster, 10);
  assert.equal(report.summary.slower, 5);
  assert.equal(report.summary['within-noise'], 3);
  assert.equal(report.summary.unsure, 3);

  // Spot-check a clearly-faster metric
  const updateTenth = report.metrics.find((m) => m.name === 'update-10th');
  assert.equal(updateTenth.status, 'faster');
  assert.ok(updateTenth.percent_change_ci[1] < -2, 'update-10th CI should be well below -2%');

  // Spot-check a clearly-slower metric
  const editStart = report.metrics.find((m) => m.name === 'edit-start');
  assert.equal(editStart.status, 'slower');
  assert.ok(editStart.percent_change_ci[0] > 2, 'edit-start CI should be well above +2%');

  // Spot-check a boundary-unsure metric
  const bulkAdd = report.metrics.find((m) => m.name === 'bulk-add-50');
  assert.equal(bulkAdd.status, 'unsure');
});

test('real-delta fixture — markdown structure', () => {
  const { markdown } = runReporter({
    fixture: 'real-delta',
    sha: 'abcdef012345678',
    msg: 'Perf: Gate each phase-3 notify',
    baseSha: '0873084',
    runUrl: 'https://example.test/run/42',
  });

  assert.ok(markdown.startsWith('## 📊 Bench — `abcdef0`'), 'header includes short SHA');
  assert.ok(markdown.includes('Perf: Gate each phase-3 notify'), 'header includes commit msg');
  assert.ok(markdown.includes('`0873084` (main)'), 'base SHA + ref rendered');
  assert.ok(markdown.includes('[run ↗](https://example.test/run/42)'), 'run URL linked');
  assert.ok(markdown.includes('### Significant changes'), 'significant section present');
  assert.ok(markdown.includes('### Unsure'), 'unsure section present');
  assert.ok(markdown.includes('<details>'), 'within-noise collapsed');

  // Significant changes should sort by |Δ| descending → update-10th appears before toggle-10
  const updateIdx = markdown.indexOf('| `update-10th` |');
  const toggleIdx = markdown.indexOf('| `toggle-10` |');
  assert.ok(updateIdx > 0 && toggleIdx > 0 && updateIdx < toggleIdx, 'sorted by magnitude');
});

test('zero-delta fixture — 0 faster, 0 slower, everything boundary or noise', () => {
  const { report, markdown } = runReporter({
    fixture: 'zero-delta',
    sha: 'd57409c71',
    msg: 'Build: Bump auto-sample cap from 2 to 3 min',
    baseSha: 'd4e3a88d',
  });

  assert.equal(report.summary.faster, 0, 'zero-delta: no faster verdicts');
  assert.equal(report.summary.slower, 0, 'zero-delta: no slower verdicts');
  assert.equal(
    report.summary.faster + report.summary.slower + report.summary['within-noise'] + report.summary.unsure,
    21,
  );

  // With 0 significant changes, the Significant Changes section should be absent
  assert.ok(!markdown.includes('### Significant changes'));
});

test('classify boundary behavior', async () => {
  // Import the internal classify via a minimal harness. Since reporter.js
  // isn't a module-with-named-exports (it's a CLI script), the test uses
  // a JSON file with hand-crafted CIs to exercise boundaries end-to-end.
  // That's sufficient for MVP; refactoring classify to exports if needed later.

  const harnessDir = fs.mkdtempSync('/tmp/bench-classify-test-');
  const handcraftedTachoJson = {
    benchmarks: [
      // this-change metrics
      makeBenchEntry('m-far-faster', 'this-change', 100, 101, [
        { pc: [-10, -8], abs: [-10, -8] },
        null,
        null,
        null,
        null,
      ]),
      makeBenchEntry('m-far-slower', 'this-change', 110, 111, [null, { pc: [8, 10], abs: [8, 10] }, null, null, null]),
      makeBenchEntry('m-noise', 'this-change', 100, 101, [null, null, { pc: [-1, 1], abs: [-1, 1] }, null, null]),
      makeBenchEntry('m-boundary', 'this-change', 100, 101, [null, null, null, { pc: [-3, 3], abs: [-3, 3] }, null]),
      makeBenchEntry('m-edge-below-2', 'this-change', 100, 101, [null, null, null, null, {
        pc: [-1.9, 1.9],
        abs: [-2, 2],
      }]),
      // tip-of-tree (indices 5-9 mirror 0-4, placeholders — only differences[this] matters)
      makeBenchEntry('m-far-faster', 'tip-of-tree', 111, 113, [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ]),
      makeBenchEntry('m-far-slower', 'tip-of-tree', 100, 101, [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ]),
      makeBenchEntry('m-noise', 'tip-of-tree', 100, 101, [null, null, null, null, null, null, null, null, null, null]),
      makeBenchEntry('m-boundary', 'tip-of-tree', 100, 101, [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ]),
      makeBenchEntry('m-edge-below-2', 'tip-of-tree', 100, 101, [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ]),
    ],
  };
  // differences[i] in a this-change entry refers to benchmarks[i]. For pairs, the tip-of-tree
  // index for metric X is (this-change idx + 5). So rewrite differences arrays accordingly:
  for (let i = 0; i < 5; i++) {
    const tipIdx = i + 5;
    const diffs = Array(10).fill(null);
    const defs = [
      { pc: [-10, -8] },
      { pc: [8, 10] },
      { pc: [-1, 1] },
      { pc: [-3, 3] },
      { pc: [-1.9, 1.9] },
    ];
    diffs[tipIdx] = {
      absolute: { low: defs[i].pc[0], high: defs[i].pc[1] },
      percentChange: { low: defs[i].pc[0], high: defs[i].pc[1] },
    };
    handcraftedTachoJson.benchmarks[i].differences = diffs;
  }

  fs.writeFileSync(path.join(harnessDir, 'tacho.json'), JSON.stringify(handcraftedTachoJson));
  const outDir = fs.mkdtempSync('/tmp/bench-classify-out-');
  execFileSync(
    'node',
    [REPORTER, '--results', harnessDir, '--sha', 'deadbeef', '--base-ref', 'main', '--out', outDir],
    { stdio: ['ignore', 'pipe', 'inherit'] },
  );
  const report = JSON.parse(fs.readFileSync(path.join(outDir, 'bench-report.json'), 'utf8'));
  const byName = Object.fromEntries(report.metrics.map((m) => [m.name, m.status]));

  assert.equal(byName['m-far-faster'], 'faster');
  assert.equal(byName['m-far-slower'], 'slower');
  assert.equal(byName['m-noise'], 'within-noise');
  assert.equal(byName['m-boundary'], 'unsure', 'CI that straddles ±2% is unsure');
  assert.equal(byName['m-edge-below-2'], 'within-noise', 'CI exactly inside ±2% is noise');
});

function makeBenchEntry(metricName, source, meanLow, meanHigh, diffs) {
  return {
    name: `${source} [${metricName}]`,
    measurement: { name: metricName, mode: 'performance', entryName: metricName },
    mean: { low: meanLow, high: meanHigh },
    differences: diffs,
  };
}

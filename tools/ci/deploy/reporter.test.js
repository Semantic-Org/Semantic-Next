/*
  Tests for reporter.js. Run with:
    node --test tools/ci/deploy/reporter.test.js

  Drives the reporter as a subprocess (the way CI invokes it) and asserts on the
  rendered comment.md and the preview-report.json adjunct.
*/
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const REPORTER = path.join(dirname, 'reporter.js');

const COMMON = [
  '--sha',
  '040bd5e9c1a2b3c4d5e6f7081927364511223344',
  '--repo',
  'Semantic-Org/Semantic-Next',
  '--run-url',
  'https://github.com/Semantic-Org/Semantic-Next/actions/runs/123',
  '--run-id',
  '123',
];

function run(extra, facts) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'deploy-reporter-'));
  const out = path.join(dir, 'out');
  let args = [...extra, ...COMMON];
  if (facts) {
    const fdir = path.join(dir, 'facts');
    // mimic the per-job artifact nesting the report workflow downloads into
    for (const f of facts) {
      const sub = path.join(fdir, `deploy-facts-${f.id}`);
      fs.mkdirSync(sub, { recursive: true });
      fs.writeFileSync(path.join(sub, `${f.id}.json`), JSON.stringify(f));
    }
    args = [...args, '--facts', fdir];
  }
  execFileSync('node', [REPORTER, ...args, '--out', out]);
  return {
    md: fs.readFileSync(path.join(out, 'comment.md'), 'utf8'),
    json: JSON.parse(fs.readFileSync(path.join(out, 'preview-report.json'), 'utf8')),
  };
}

test('deploying, seeded: EST clock, ETA, build time; unrequested target NA', () => {
  const { md, json } = run([
    '--mode',
    'deploying',
    '--targets',
    'docs',
    '--started',
    '2026-06-28T00:10:00Z',
    '--build-seconds',
    '180',
  ]);
  assert.match(md, /Deploying Preview/);
  assert.match(md, /🟡 Building/);
  assert.match(md, /8:10 PM/); // 00:10 UTC → 20:10 EDT
  assert.match(md, /8:13 PM/); // + 180s
  assert.match(md, /~3m/);
  assert.match(md, /`mcp` \| ⚪ NA/);
  assert.equal(json.state, 'deploying');
});

test('deploying, unseeded: ETA and build time hidden, start still shown', () => {
  const { md } = run([
    '--mode',
    'deploying',
    '--targets',
    'docs',
    '--started',
    '2026-06-28T00:10:00Z',
    '--build-seconds',
    '',
  ]);
  assert.match(md, /8:10 PM/);
  assert.doesNotMatch(md, /~\d+m/);
});

test('final, all ready (docs only): preview link, footer host, mcp NA', () => {
  const { md, json } = run(['--mode', 'final'], [
    {
      id: 'docs',
      status: 'ready',
      url: 'https://semantic-next-abc.vercel.app',
      inspect: 'https://vercel.com/semantic-ui/semantic-next/xyz',
    },
  ]);
  assert.match(md, /Preview Ready/);
  assert.match(md, /\[Preview\]\(https:\/\/semantic-next-abc\.vercel\.app\)/);
  assert.match(md, /\[logs\]\(https:\/\/vercel\.com\/semantic-ui\/semantic-next\/xyz\)/);
  assert.match(md, /`docs` `semantic-next-abc\.vercel\.app`/);
  assert.match(md, /`mcp` \| ⚪ NA/);
  assert.equal(json.state, 'ready');
});

test('final, both ready', () => {
  const { json } = run(['--mode', 'final'], [
    { id: 'docs', status: 'ready', url: 'https://d.vercel.app' },
    { id: 'mcp', status: 'ready', url: 'https://m.vercel.app' },
  ]);
  assert.equal(json.state, 'ready');
  assert.equal(json.targets.filter((t) => t.status === 'ready').length, 2);
});

test('final, partial: docs ready, mcp failed', () => {
  const { md, json } = run(['--mode', 'final'], [
    { id: 'docs', status: 'ready', url: 'https://d.vercel.app' },
    { id: 'mcp', status: 'failed' },
  ]);
  assert.match(md, /Preview Partially Ready/);
  assert.match(md, /`mcp` \| 🔴 Failed/);
  assert.equal(json.state, 'partial');
  assert.match(md, /`docs` `d\.vercel\.app`/);
  assert.doesNotMatch(md, /`mcp` `/); // failed target contributes no footer host
});

test('final, all failed', () => {
  const { md, json } = run(['--mode', 'final'], [{ id: 'docs', status: 'failed' }]);
  assert.match(md, /Preview Failed/);
  assert.equal(json.state, 'failed');
});

test('final: a "ready" with a markdown-breakout URL drops to failed', () => {
  const evil = 'https://x.vercel.app)](javascript:alert(1))';
  const { md, json } = run(['--mode', 'final'], [{ id: 'docs', status: 'ready', url: evil }]);
  assert.doesNotMatch(md, /javascript:/);
  assert.equal(json.targets.find((t) => t.id === 'docs').status, 'failed');
});

test('final: ready with no inspect URL falls back to the run URL for logs', () => {
  const { md } = run(['--mode', 'final'], [{ id: 'docs', status: 'ready', url: 'https://d.vercel.app' }]);
  assert.match(md, /\[logs\]\(https:\/\/github\.com\/Semantic-Org\/Semantic-Next\/actions\/runs\/123\)/);
});

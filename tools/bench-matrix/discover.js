#!/usr/bin/env node
/*
  Emits the bench matrix for GitHub Actions. Each config's scope is the
  owning package's @semantic-ui/* workspace dep closure, read from
  package.json. A PR runs only the configs whose closure intersects the
  changed-file set.

  Env vars:
    GITHUB_EVENT_NAME    'pull_request' or 'push'
    GITHUB_OUTPUT        file to append result/has-benchmarks outputs
    CHANGED_FILES_PATH   one-path-per-line file written by the caller

  Push-to-main and harness-touching PRs always run every config —
  history continuity for the former, regression safety for the latter.
*/
import fs from 'node:fs';
import path from 'node:path';

const event = process.env.GITHUB_EVENT_NAME ?? 'pull_request';
const outputPath = process.env.GITHUB_OUTPUT;
const changedFilesPath = process.env.CHANGED_FILES_PATH;

const root = process.cwd();
const packagesDir = path.join(root, 'packages');

// Paths whose change always triggers all configs. Intentionally narrow —
// only tooling that affects every bench belongs here. Adding paths
// reintroduces the overbroad-trigger problem this module exists to solve.
const harnessTriggers = [
  '.github/workflows/benchmarks.yml',
  '.github/workflows/benchmarks-report.yml',
  'tools/bench-reporter/',
  'tools/bench-matrix/',
];

function findConfigs() {
  const out = [];
  if (!fs.existsSync(packagesDir)) { return out; }
  for (const pkg of fs.readdirSync(packagesDir)) {
    const tdir = path.join(packagesDir, pkg, 'bench', 'tachometer');
    if (!fs.existsSync(tdir)) { continue; }
    for (const file of fs.readdirSync(tdir)) {
      if (file.startsWith('tachometer-ci') && file.endsWith('.json')) {
        out.push({
          package: pkg,
          config: path.join('packages', pkg, 'bench', 'tachometer', file),
          name: file.replace(/\.json$/, ''),
        });
      }
    }
  }
  return out;
}

function closureFor(pkgName, seen = new Set()) {
  if (seen.has(pkgName)) { return seen; }
  seen.add(pkgName);
  const pkgPath = path.join(packagesDir, pkgName, 'package.json');
  if (!fs.existsSync(pkgPath)) { return seen; }
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
  for (const dep of Object.keys(deps)) {
    if (dep.startsWith('@semantic-ui/')) {
      closureFor(dep.slice('@semantic-ui/'.length), seen);
    }
  }
  return seen;
}

function loadChangedFiles() {
  if (!changedFilesPath || !fs.existsSync(changedFilesPath)) { return []; }
  return fs.readFileSync(changedFilesPath, 'utf8').split('\n').filter(Boolean);
}

function harnessTouched(files) {
  return files.some(f => harnessTriggers.some(t => f === t || f.startsWith(t)));
}

function matchesDiff(entry, files) {
  const closure = [...closureFor(entry.package)].map(p => `packages/${p}/`);
  return files.some(f => closure.some(prefix => f.startsWith(prefix)));
}

const configs = findConfigs();
const changed = loadChangedFiles();

const selected = (event === 'push' || harnessTouched(changed))
  ? configs
  : configs.filter(c => matchesDiff(c, changed));

const matrix = selected.map(({ package: pkg, config, name }) => ({ package: pkg, config, name }));
const result = JSON.stringify(matrix);
const hasBenchmarks = matrix.length > 0 ? 'true' : 'false';

if (outputPath) {
  fs.appendFileSync(outputPath, `result=${result}\n`);
  fs.appendFileSync(outputPath, `has-benchmarks=${hasBenchmarks}\n`);
}

console.log(`Event: ${event}`);
console.log(`Changed files: ${changed.length}`);
console.log(`Harness touched: ${harnessTouched(changed)}`);
console.log(`Configs found: ${configs.length}`);
console.log(`Matrix: ${result}`);

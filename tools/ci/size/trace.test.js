/*
  Unit tests for trace.js. Run with:
    node --test tools/ci/size/trace.test.js

  The fixture package replicates the retention physics the tracer exists to
  catch: `leaky` attaches its config through a bare property assignment (a
  top-level side effect bundlers must keep), `clean` attaches through a
  pure-annotated call. Importing `small` must pay for leaky's vocabulary and
  not for clean's — if that ever stops being true, the instrument is broken.
*/
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import { bundleModules, exportCosts, moduleKey, packageInfo } from './trace.js';

function makeFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'size-trace-'));
  const src = path.join(root, 'packages', 'demo', 'src');
  fs.mkdirSync(src, { recursive: true });
  fs.writeFileSync(
    path.join(root, 'packages', 'demo', 'package.json'),
    JSON.stringify({ name: '@test/demo', module: 'src/index.js', dependencies: { lit: '1.0.0' } }),
  );
  fs.writeFileSync(
    path.join(src, 'index.js'),
    [
      "export * from './small.js';",
      "export * from './vocab.js';",
    ].join('\n'),
  );
  fs.writeFileSync(path.join(src, 'small.js'), 'export const small = (x) => x + 1;\n');
  fs.writeFileSync(
    path.join(src, 'vocab.js'),
    [
      'const attach = (fn, config) => Object.assign(fn, { config });',
      "export const leaky = attach((x) => leaky.config.words[x], { words: { alpha: 'an', beta: 'a' } });",
      'leaky.config.extra = true;',
      "export const clean = /* @__PURE__ */ attach((x) => clean.config.words[x], { words: { gamma: 'an' } });",
    ].join('\n'),
  );
  return { root, info: packageInfo(root, 'demo') };
}

test('packageInfo resolves the entry and externals from package.json', () => {
  const { root, info } = makeFixture();
  assert.equal(info.entry, path.join(root, 'packages', 'demo', 'src', 'index.js'));
  assert.deepEqual(info.external, ['lit']);
  assert.equal(packageInfo(root, 'missing'), null);
});

test('moduleKey normalizes workspace and node_modules paths to package-relative', () => {
  assert.equal(moduleKey('packages/utils/src/strings.js'), 'utils/strings.js');
  assert.equal(moduleKey('node_modules/@semantic-ui/utils/src/coercion.js'), 'utils/coercion.js');
  assert.equal(moduleKey('tools/whatever.js'), 'tools/whatever.js');
});

test('bundleModules attributes minified bytes per source module', async () => {
  const { root, info } = makeFixture();
  const modules = await bundleModules(root, info);
  assert.ok(modules['demo/small.js'] > 0);
  assert.ok(modules['demo/vocab.js'] > modules['demo/small.js']);
});

test('exportCosts expose a retention leak as a cost jump on an unrelated export', async () => {
  const { root, info } = makeFixture();
  const leakyCosts = await exportCosts(root, info, ['small']);

  // fix the leak: pure-annotate the attachment and drop the bare property write
  fs.writeFileSync(
    path.join(root, 'packages', 'demo', 'src', 'vocab.js'),
    [
      'const attach = (fn, config) => Object.assign(fn, { config });',
      "export const leaky = /* @__PURE__ */ attach((x) => leaky.config.words[x], { words: { alpha: 'an', beta: 'a' } });",
      "export const clean = /* @__PURE__ */ attach((x) => clean.config.words[x], { words: { gamma: 'an' } });",
    ].join('\n'),
  );
  const fixedCosts = await exportCosts(root, info, ['small']);

  // the diff a PR comment would show: small's import cost drops when the leak is fixed
  assert.ok(
    leakyCosts.small > fixedCosts.small,
    `leaky ${leakyCosts.small} B should exceed fixed ${fixedCosts.small} B`,
  );
});

test('reserved-word export names price via aliased imports without darkening the package', async () => {
  const { root, info } = makeFixture();
  fs.appendFileSync(
    path.join(root, 'packages', 'demo', 'src', 'index.js'),
    "\nexport default function fallback() { return 'd'; }\n",
  );
  const costs = await exportCosts(root, info, ['default', 'small', 'clean']);
  assert.ok(costs.default > 0, 'default priced through the alias form');
  assert.ok(costs.small > 0, 'sibling exports still priced');
});

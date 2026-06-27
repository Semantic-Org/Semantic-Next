/*
  Tests for census.js — the constructor-name normalization (the esbuild
  underscore artifact) and the snapshot constructor census. Run with:
    node --test tools/ci/memory/census.test.js
*/
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { censusBySnapshot, normalizeConstructor } from './census.js';

test('normalizeConstructor folds the esbuild self-reference underscore', () => {
  // esbuild emits `var ReactionScope = class _ReactionScope {}` -> .name is _ReactionScope
  assert.equal(normalizeConstructor('_ReactionScope'), 'ReactionScope');
  assert.equal(normalizeConstructor('_Signal'), 'Signal');
});

test('normalizeConstructor leaves clean names and dunder names alone', () => {
  assert.equal(normalizeConstructor('Reaction'), 'Reaction');
  assert.equal(normalizeConstructor('Dependency'), 'Dependency');
  // not a single-underscore-then-capital artifact
  assert.equal(normalizeConstructor('__proto__'), '__proto__');
  assert.equal(normalizeConstructor('_lowercase'), '_lowercase');
});

test('censusBySnapshot counts by normalized constructor name', () => {
  const graph = {
    nodes: [
      { name: '_ReactionScope', detached: false },
      { name: 'ReactionScope', detached: false },
      { name: 'Reaction', detached: false },
      { name: 'Reaction', detached: false },
      { name: 'Detached HTMLLIElement', detached: true },
    ],
  };
  const census = censusBySnapshot(graph);
  assert.equal(census.get('ReactionScope'), 2); // _ReactionScope folded in
  assert.equal(census.get('Reaction'), 2);
});

test('censusBySnapshot detachedOnly keeps only flagged nodes', () => {
  const graph = {
    nodes: [
      { name: 'Reaction', detached: false },
      { name: 'HTMLLIElement', detached: true },
      { name: 'HTMLLIElement', detached: true },
    ],
  };
  const census = censusBySnapshot(graph, { detachedOnly: true });
  assert.equal(census.has('Reaction'), false);
  assert.equal(census.get('HTMLLIElement'), 2);
});

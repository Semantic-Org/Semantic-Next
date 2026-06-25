/*
  Unit tests for measure.js. Run with:
    node --test tools/ci/size/measure.test.js
*/
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import { measureBuffer, measureTargets } from './measure.js';

test('measureBuffer reports raw bytes and smaller compressed sizes', () => {
  const buf = Buffer.from('a'.repeat(5000));
  const m = measureBuffer(buf);
  assert.equal(m.raw, 5000);
  assert.ok(m.gzip > 0 && m.gzip < m.raw);
  assert.ok(m.brotli > 0 && m.brotli < m.raw);
});

test('measureTargets reads present files and flags missing ones', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'size-measure-'));
  fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
  const body = Buffer.from('x'.repeat(2048));
  fs.writeFileSync(path.join(root, 'dist', 'present.min.js'), body);

  const targets = [
    { id: 'a', label: 'a', group: 'package', file: 'dist/present.min.js' },
    { id: 'b', label: 'b', group: 'package', file: 'dist/absent.min.js' },
  ];
  const r = measureTargets(root, targets);

  assert.equal(r.a.exists, true);
  assert.equal(r.a.raw, 2048);
  assert.ok(r.a.brotli > 0);
  assert.equal(r.b.exists, false);
  assert.equal(r.b.raw, undefined);

  fs.rmSync(root, { recursive: true, force: true });
});

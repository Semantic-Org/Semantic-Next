/*
  Unit tests for the line classifier. Run with:
    node --test tools/ci/size/loc.test.js

  The classifier is the one piece with real edge cases — strings and template
  literals that contain comment-looking characters, and block comments that
  span lines. These assert the behavior the README promises.
*/
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { countLines } from './loc.js';
import { locExclude } from './targets.js';

test('counts plain code lines', () => {
  const r = countLines('const a = 1;\nconst b = 2;\n');
  assert.equal(r.code, 2);
  assert.equal(r.comment, 0);
  assert.equal(r.blank, 0);
});

test('a line comment is a comment, not code', () => {
  const r = countLines('// just a note\nconst a = 1;\n');
  assert.equal(r.code, 1);
  assert.equal(r.comment, 1);
});

test('code with a trailing comment counts as code', () => {
  const r = countLines('const a = 1; // note\n');
  assert.equal(r.code, 1);
  assert.equal(r.comment, 0);
});

test('block comment across lines counts each line as comment until it closes', () => {
  const r = countLines('/* one\n two\n three */ const a = 1;\n');
  assert.equal(r.comment, 2); // the two pure-comment lines
  assert.equal(r.code, 1); // the line where the block closes and code follows
});

test('a // inside a string is not a comment', () => {
  const r = countLines('const u = "http://example.com";\n');
  assert.equal(r.code, 1);
  assert.equal(r.comment, 0);
});

test('a /* inside a string does not open a block comment', () => {
  const r = countLines('const s = "/* not a comment */";\nconst a = 1;\n');
  assert.equal(r.code, 2);
  assert.equal(r.comment, 0);
});

test('multi-line template literal interior is code, even with comment-looking text', () => {
  const src = 'const t = `\n  link: https://x // not a comment\n  end\n`;\nconst y = 1;\n';
  const r = countLines(src);
  assert.equal(r.code, 5);
  assert.equal(r.comment, 0);
});

test('blank and whitespace-only lines are blank', () => {
  const r = countLines('const a = 1;\n\n   \n\t\n');
  assert.equal(r.code, 1);
  assert.equal(r.blank, 3);
});

test('a trailing newline does not add a phantom line', () => {
  assert.equal(countLines('const a = 1;\n').code, 1);
  assert.equal(countLines('const a = 1;').code, 1);
});

test('locExclude drops generated component specs', () => {
  assert.ok(locExclude.some((re) => re.test('src/primitives/button/specs/button.component.js')));
  assert.ok(!locExclude.some((re) => re.test('src/primitives/button/button.js')));
});

/*
  Lines of code in shipped source, comments and blank lines removed. A
  secondary signal: a PR that adds 300 comment lines and two code lines reads
  as +2 code here, which the bundle numbers alone can't show.

  This is a line classifier, not a JS parser. It tracks string and template
  regions so a `//` inside `"http://"` or a multi-line template isn't read as
  a comment, and carries block-comment and template state across lines. The
  one known soft spot is a regex literal containing `//` in code position —
  its line still counts as code (there's real content before the slash), only
  the tail is misattributed. That's accurate enough for a directional count;
  the README spells out the limitation.
*/
import fs from 'node:fs';
import path from 'node:path';

import { locExclude } from './targets.js';

const isSpace = (c) => c === ' ' || c === '\t' || c === '\r' || c === '\f' || c === '\v';

/*
  Classify one physical line given the carried state ('normal' | 'block' |
  'template'). Returns whether the line holds code and/or comment, plus the
  state to carry into the next line. String state is intentionally not
  carried — an unterminated string across a bare newline isn't valid JS.
*/
function scanLine(line, carry) {
  let hasCode = false;
  let hasComment = false;
  let state = carry;
  let quote = '';
  let i = 0;
  const n = line.length;
  while (i < n) {
    const c = line[i];
    const next = line[i + 1];
    if (state === 'block') {
      hasComment = true;
      if (c === '*' && next === '/') {
        state = 'normal';
        i += 2;
        continue;
      }
      i++;
      continue;
    }
    if (state === 'template') {
      hasCode = true;
      if (c === '\\') {
        i += 2;
        continue;
      }
      if (c === '`') { state = 'normal'; }
      i++;
      continue;
    }
    if (state === 'string') {
      hasCode = true;
      if (c === '\\') {
        i += 2;
        continue;
      }
      if (c === quote) { state = 'normal'; }
      i++;
      continue;
    }
    // normal
    if (c === '/' && next === '/') {
      hasComment = true;
      break;
    } // rest of line is a comment
    if (c === '/' && next === '*') {
      state = 'block';
      hasComment = true;
      i += 2;
      continue;
    }
    if (c === '`') {
      state = 'template';
      hasCode = true;
      i++;
      continue;
    }
    if (c === '"' || c === "'") {
      state = 'string';
      quote = c;
      hasCode = true;
      i++;
      continue;
    }
    if (!isSpace(c)) { hasCode = true; }
    i++;
  }
  const carryOut = state === 'block' ? 'block' : state === 'template' ? 'template' : 'normal';
  return { hasCode, hasComment, carry: carryOut };
}

export function countLines(source) {
  const lines = source.split('\n');
  // a trailing newline yields an empty final element; it isn't a real line
  if (lines.length > 0 && lines[lines.length - 1] === '') { lines.pop(); }
  let code = 0;
  let comment = 0;
  let blank = 0;
  let carry = 'normal';
  for (const line of lines) {
    const r = scanLine(line, carry);
    carry = r.carry;
    if (r.hasCode) { code++; }
    else if (r.hasComment) { comment++; }
    else { blank++; }
  }
  return { code, comment, blank };
}

function walkJs(dir, files) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist') { continue; }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { walkJs(full, files); }
    else if (entry.name.endsWith('.js')) { files.push(full); }
  }
}

/*
  Shipped-source files keyed by owning scope: each package's `src` under its
  own name, and the first-party design system (root `src/`) as 'design-system'.
  Returns { scope: [absolutePath, ...] }.
*/
export function shippedSourcesByScope(repoRoot) {
  const byScope = {};
  const add = (scope, dir) => {
    if (!fs.existsSync(dir)) { return; }
    const files = [];
    walkJs(dir, files);
    const kept = files.filter((f) => !locExclude.some((re) => re.test(f)));
    if (kept.length) { byScope[scope] = kept; }
  };
  const packagesDir = path.join(repoRoot, 'packages');
  if (fs.existsSync(packagesDir)) {
    for (const pkg of fs.readdirSync(packagesDir)) {
      add(pkg, path.join(packagesDir, pkg, 'src'));
    }
  }
  add('design-system', path.join(repoRoot, 'src'));
  return byScope;
}

export function collectLoc(repoRoot) {
  const byScope = {};
  const total = { code: 0, comment: 0, blank: 0, files: 0 };
  for (const [scope, files] of Object.entries(shippedSourcesByScope(repoRoot))) {
    const acc = { code: 0, comment: 0, blank: 0, files: files.length };
    for (const file of files) {
      const counts = countLines(fs.readFileSync(file, 'utf8'));
      acc.code += counts.code;
      acc.comment += counts.comment;
      acc.blank += counts.blank;
    }
    byScope[scope] = acc;
    total.code += acc.code;
    total.comment += acc.comment;
    total.blank += acc.blank;
    total.files += acc.files;
  }
  return { total, byScope };
}

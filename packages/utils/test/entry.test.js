import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { describe, expect, it } from 'vitest';

// the browser entry has to load from a raw file url with nothing but the
// package mapped, so its whole static graph stays relative and never reaches
// the server formatter. the node entry is where that formatter comes in

const src = resolve(dirname(fileURLToPath(import.meta.url)), '../src');

const specifiers = (file) => {
  const code = readFileSync(file, 'utf8');
  const pattern =
    /^(?:import\b|export\s*(?:\*|\{))[^'";]*?\bfrom\s+['"]([^'"]+)['"]|^import\s+['"]([^'"]+)['"]|(?<!\.)\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/gm;
  return [...code.matchAll(pattern)].map((match) => match[1] ?? match[2] ?? match[3]);
};

const graph = (entry) => {
  const files = new Set();
  const bare = new Set();
  const walk = (file) => {
    if (files.has(file)) {
      return;
    }
    files.add(file);
    for (const specifier of specifiers(file)) {
      if (specifier.startsWith('.')) {
        walk(resolve(dirname(file), specifier));
      }
      else {
        bare.add(specifier);
      }
    }
  };
  walk(entry);
  return { files, bare };
};

describe('package entries', () => {
  const browser = graph(resolve(src, 'index.js'));
  const node = graph(resolve(src, 'index.node.js'));

  it('should keep the browser entry graph to relative imports', () => {
    expect([...browser.bare]).toEqual([]);
  });

  it('should keep the server formatter out of the browser entry', () => {
    expect(browser.files.has(resolve(src, 'debug-server.js'))).toBe(false);
    expect(browser.files.has(resolve(src, 'index.node.js'))).toBe(false);
  });

  it('should reach the server formatter from the node entry', () => {
    expect(node.files.has(resolve(src, 'debug-server.js'))).toBe(true);
    expect(node.files.has(resolve(src, 'index.js'))).toBe(true);
  });
});

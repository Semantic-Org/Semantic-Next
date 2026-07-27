import { TemplateCompiler } from '@semantic-ui/compiler';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { describe, expect, it } from 'vitest';
import { blocks, getBlockNames } from '../src/block-registry.js';

/*
  Validates the LSP block registry against the compiler's own tag patterns.
  If the compiler grows a block and the registry does not, developers get no
  completion and no hover for it. That silent gap is what this suite catches.
*/

const root = resolve(import.meta.dirname, '../../..');

// '^{OPEN}\\s*#each\\s+' yields 'each', '^{OPEN}\\s*#(async)\\s+' yields 'async'
function openingKeywords() {
  const found = new Set();
  for (const pattern of Object.values(TemplateCompiler.basePatterns)) {
    const match = pattern.match(/#\(?(\w+)/);
    if (match) { found.add(match[1]); }
  }
  return [...found];
}

// The section keywords the compiler accepts as bare tags inside a block
const SECTION_KEYWORDS = ['else if', 'else', 'is', 'isExactly', 'before', 'loading', 'error', 'catch'];

describe('BlockRegistry — sync with compiler', () => {
  it('covers every #-prefixed block in basePatterns', () => {
    const missing = openingKeywords().filter(name => blocks[name]?.type !== 'block');
    expect(missing, `LSP registry is missing blocks: ${missing.join(', ')}`).toEqual([]);
  });

  it('covers every block-section keyword', () => {
    const missing = SECTION_KEYWORDS.filter(name => blocks[name]?.type !== 'section');
    expect(missing, `LSP registry is missing sections: ${missing.join(', ')}`).toEqual([]);
  });

  it('does not contain phantom keywords the compiler cannot parse', () => {
    const known = [...openingKeywords(), ...SECTION_KEYWORDS];
    const extra = getBlockNames().filter(name => !known.includes(name));
    expect(extra, `LSP registry has extra keywords: ${extra.join(', ')}`).toEqual([]);
  });

  it('marks only expression modifiers as self-closing', () => {
    const selfClosing = getBlockNames().filter(name => blocks[name].selfClosing);
    // Everything else has a {/name} pattern in the compiler
    expect(selfClosing.sort()).toEqual(['fn', 'html']);
    for (const name of selfClosing) {
      expect(
        Object.values(TemplateCompiler.basePatterns).some(p => p.includes(`\\/(${name})`) || p.includes(`\\/${name}`)),
        `${name} is marked self-closing but the compiler has a closing pattern`,
      ).toBe(false);
    }
  });
});

describe('BlockRegistry — entry shape', () => {
  it('every entry has a description and an example', () => {
    for (const [name, block] of Object.entries(blocks)) {
      expect(block.description, `${name} missing description`).toBeTruthy();
      expect(block.example?.length, `${name} missing example`).toBeGreaterThan(0);
    }
  });

  it('every section declares the blocks it belongs to', () => {
    for (const [name, block] of Object.entries(blocks)) {
      if (block.type !== 'section') { continue; }
      expect(block.parents?.length, `${name} missing parents`).toBeGreaterThan(0);
      for (const parent of block.parents) {
        expect(blocks[parent]?.type, `${name} names unknown parent ${parent}`).toBe('block');
      }
    }
  });

  it('every docsPath resolves to a real guide page', () => {
    for (const [name, block] of Object.entries(blocks)) {
      if (!block.docsPath) { continue; }
      expect(block.docsPath.startsWith('/'), `${name} docsPath is not a relative path`).toBe(true);
      const page = resolve(root, `docs/src/pages${block.docsPath}.mdx`);
      expect(existsSync(page), `${name} docsPath has no page at ${page}`).toBe(true);
    }
  });
});

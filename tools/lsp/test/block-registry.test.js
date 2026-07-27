import { describe, expect, it } from 'vitest';
import {
  formatBlockDoc,
  formatBlockTag,
  getBlock,
  getBlockKeywords,
  getSectionKeywords,
  hasClosingTag,
} from '../src/block-registry.js';

describe('BlockRegistry', () => {
  it('offers every opening block keyword', () => {
    const names = getBlockKeywords();
    expect(names).toEqual(
      expect.arrayContaining(['if', 'each', 'match', 'async', 'snippet', 'rerender', 'guard', 'html', 'fn']),
    );
  });

  it('does not offer section keywords as openers', () => {
    const names = getBlockKeywords();
    expect(names).not.toContain('else');
    expect(names).not.toContain('is');
    expect(names).not.toContain('loading');
  });

  it('returns null for unknown keyword', () => {
    expect(getBlock('nonExistentBlock')).toBeNull();
    expect(formatBlockDoc('nonExistentBlock')).toBeNull();
    expect(formatBlockTag('nonExistentBlock')).toBeNull();
  });

  it('maps sections to the block that accepts them', () => {
    expect(getSectionKeywords('match')).toEqual(['else', 'is', 'isExactly']);
    expect(getSectionKeywords('async')).toEqual(['loading', 'before', 'error', 'catch']);
    expect(getSectionKeywords('if')).toEqual(['else if', 'else']);
    expect(getSectionKeywords('each')).toEqual(['else']);
    expect(getSectionKeywords('snippet')).toEqual([]);
    expect(getSectionKeywords(undefined)).toEqual([]);
  });

  it('knows which blocks open a scope', () => {
    expect(hasClosingTag('if')).toBe(true);
    expect(hasClosingTag('match')).toBe(true);
    // expression modifiers, no {/html} or {/fn}
    expect(hasClosingTag('html')).toBe(false);
    expect(hasClosingTag('fn')).toBe(false);
    expect(hasClosingTag('else')).toBe(false);
    expect(hasClosingTag('unknown')).toBe(false);
  });

  it('formats tags in the form they are written', () => {
    expect(formatBlockTag('match')).toBe('{#match}');
    expect(formatBlockTag('is')).toBe('{is}');
    expect(formatBlockTag('else if')).toBe('{else if}');
  });

  it('formats documentation with description, example, and docs link', () => {
    const doc = formatBlockDoc('match');
    expect(doc).toContain('**{#match}**');
    expect(doc).toContain('Branches on the value of a single discriminant');
    expect(doc).toContain('```html');
    expect(doc).toContain('{#match status}');
    expect(doc).toContain('[docs](/docs/guides/templates/match)');
  });

  it('formats documentation with an overridden tag for closing keywords', () => {
    expect(formatBlockDoc('each', '{/each}')).toContain('**{/each}**');
  });
});

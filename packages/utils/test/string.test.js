import {
  camelToKebab,
  capitalizeWords,
  joinWords,
  kebabToCamel,
  toTitleCase,
  truncate,
} from '@semantic-ui/utils';

import { describe, expect, it } from 'vitest';

describe('String Utilities', () => {
  it('should correctly convert kebab-case to camelCase', () => {
    expect(kebabToCamel('test-string')).toBe('testString');
  });

  it('should correctly convert camelCase to kebab-case', () => {
    expect(camelToKebab('testString')).toBe('test-string');
  });

  it('should capitalize the first letter of each word', () => {
    expect(capitalizeWords('test string')).toBe('Test String');
  });

  it('should convert a string to title case', () => {
    expect(toTitleCase('a simple test')).toBe('A Simple Test');
  });

  describe('joinWords', () => {
    it('should join words with default settings', () => {
      const words = ['apple', 'banana', 'cherry'];
      expect(joinWords(words)).toBe('apple, banana, and cherry');
    });

    it('should handle an empty array', () => {
      expect(joinWords([])).toBe('');
    });

    it('should handle a single word', () => {
      expect(joinWords(['apple'])).toBe('apple');
    });

    it('should handle two words', () => {
      expect(joinWords(['apple', 'banana'])).toBe('apple and banana');
    });

    it('should use custom separator', () => {
      const words = ['apple', 'banana', 'cherry'];
      expect(joinWords(words, { separator: '; ' })).toBe('apple; banana; and cherry');
    });

    it('should use custom last separator', () => {
      const words = ['apple', 'banana', 'cherry'];
      expect(joinWords(words, { lastSeparator: ' or ' })).toBe('apple, banana, or cherry');
    });

    it('should not use Oxford comma when specified', () => {
      const words = ['apple', 'banana', 'cherry'];
      expect(joinWords(words, { oxford: false })).toBe('apple, banana and cherry');
    });

    it('should add quotes when specified', () => {
      const words = ['apple', 'banana', 'cherry'];
      expect(joinWords(words, { quotes: true })).toBe('"apple", "banana", and "cherry"');
    });

    it('should apply transform function when provided', () => {
      const words = ['apple', 'banana', 'cherry'];
      const transform = (word) => word.toUpperCase();
      expect(joinWords(words, { transform })).toBe('APPLE, BANANA, and CHERRY');
    });

    it('should handle complex configuration', () => {
      const words = ['apple', 'banana', 'cherry', 'date'];
      const options = {
        separator: '; ',
        lastSeparator: ' or ',
        oxford: false,
        quotes: true,
        transform: (word) => word.charAt(0).toUpperCase() + word.slice(1),
      };
      expect(joinWords(words, options)).toBe('"Apple"; "Banana"; "Cherry" or "Date"');
    });

    it('should handle non-array input', () => {
      expect(joinWords('not an array')).toBe('');
    });

    it('should handle array with falsy values', () => {
      const words = ['apple', '', null, 'banana', undefined, 'cherry'];
      expect(joinWords(words)).toBe('apple, , , banana, , and cherry');
    });
  });

  describe('truncate', () => {
    it('should return original text if shorter than length', () => {
      expect(truncate('short', 10)).toBe('short');
    });

    it('should return original text if exactly equal to length', () => {
      expect(truncate('exactly10c', 10)).toBe('exactly10c');
    });

    it('should truncate text longer than length with default suffix', () => {
      expect(truncate('This is a long text that should be truncated', 20)).toBe('This is a long text…');
    });

    it('should truncate at word boundary by default', () => {
      expect(truncate('This is a very long sentence', 15)).toBe('This is a very…');
    });

    it('should disable word boundary when specified', () => {
      // Note: With a hard cut, the result is the same in this case.
      expect(truncate('This is a very long sentence', 15, { wordBoundary: false })).toBe('This is a very…');
    });

    it('should use a custom suffix and trim trailing space', () => {
      // CORRECTED: Expects 'This is [more]' (length 14), which honors the max length of 15.
      // The trailing space after 'is' is correctly trimmed.
      expect(truncate('This is a test string', 15, { suffix: ' [more]' })).toBe('This is [more]');
    });

    it('should handle empty or null text', () => {
      expect(truncate('', 10)).toBe('');
      expect(truncate(null, 10)).toBe('');
      expect(truncate(undefined, 10)).toBe('');
    });

    it('should handle text with no spaces when word boundary is enabled', () => {
      // CORRECTED: Expects the longest possible string within the length limit.
      // 'verylongtextwi…' has a length of 15.
      expect(truncate('verylongtextwithoutspaces', 15)).toBe('verylongtextwi…');
    });

    it('should account for suffix length in truncation', () => {
      // CORRECTED: Expects 'Thi [more]' (length 10), honoring the max length of 10.
      expect(truncate('This is a test', 10, { suffix: ' [more]' })).toBe('Thi [more]');
    });

    it('should properly truncate emoji and combined graphemes', () => {
      expect(truncate('👍👍👍👍👍', 4)).toBe('👍👍👍…'); // Doesn’t split emoji
    });

    it('should respect locale-aware boundaries when using Intl.Segmenter', () => {
      // Example: Japanese text (no spaces)
      expect(truncate('これはとても長い文です', 8, { locale: 'ja' })).toBe('これはとても…');
    });
  });
});

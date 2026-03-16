import { escapeHTML, escapeRegExp, unescapeHTML } from '@semantic-ui/utils';

import { describe, expect, it } from 'vitest';

describe('regular expression utilities', () => {
  describe('escapeRegExp', () => {
    it('should escape characters that have special meaning in regex', () => {
      const specialChars = '. * + ? ^ $ { } ( ) | [ ] \\';
      const escaped = escapeRegExp(specialChars);
      expect(() => new RegExp(escaped)).not.toThrow();
      expect(new RegExp(escaped).test(specialChars)).toBe(true);
    });
  });

  describe('escapeHTML', () => {
    it('should escape only HTML tag characters', () => {
      const input = '<div>Hello "World"</div>';
      const expected = '&lt;div&gt;Hello &quot;World&quot;&lt;/div&gt;';
      expect(escapeHTML(input)).toBe(expected);
    });

    it('should not modify a string without special characters', () => {
      const input = 'Hello World';
      expect(escapeHTML(input)).toBe(input);
    });

    it('should return empty string for falsy input', () => {
      expect(escapeHTML(null)).toBe('');
      expect(escapeHTML(undefined)).toBe('');
      expect(escapeHTML('')).toBe('');
    });
  });

  describe('unescapeHTML', () => {
    it('should unescape HTML entities', () => {
      const input = '&lt;div&gt;Hello &quot;World&quot;&lt;/div&gt;';
      const expected = '<div>Hello "World"</div>';
      expect(unescapeHTML(input)).toBe(expected);
    });

    it('should not modify a string without entities', () => {
      const input = 'Hello World';
      expect(unescapeHTML(input)).toBe(input);
    });

    it('should be the inverse of escapeHTML', () => {
      const original = '<script>alert("XSS")</script>';
      expect(unescapeHTML(escapeHTML(original))).toBe(original);
    });

    it('should handle ampersands', () => {
      expect(unescapeHTML('rock &amp; roll')).toBe('rock & roll');
    });

    it('should handle single quotes', () => {
      expect(unescapeHTML('it&#39;s')).toBe("it's");
    });
  });
});

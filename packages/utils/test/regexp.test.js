import { escapeHTML, escapeRegExp } from '@semantic-ui/utils';

import { describe, expect, it } from 'vitest';

describe('regular expression utilities', () => {
  describe('escapeRegExp', () => {
    it('should escape characters that have special meaning in regex', () => {
      const specialChars = '. * + ? ^ $ { } ( ) | [ ] \\';
      const escaped = escapeRegExp(specialChars);
      expect(() => new RegExp(escaped)).not.toThrow();
    });
  });

  describe('escapeHTML', () => {
    it('should escape only HTML tag characters', () => {
      const input = '<div>Hello "World"</div>';
      const expected = '&ltdiv&gtHello &quotWorld&quot&lt/div&gt';
      expect(escapeHTML(input)).toBe(expected);
    });

    it('should not modify a string without special characters', () => {
      const input = 'Hello World';
      expect(escapeHTML(input)).toBe(input);
    });
  });
});

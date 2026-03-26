import { isDOM } from '@semantic-ui/utils';

import { describe, expect, it } from 'vitest';

describe('Type Utilities', () => {
  describe('isDOM', () => {
    it('should return true for Element instances', () => {
      const element = document.createElement('div');
      expect(isDOM(element)).toBe(true);
    });

    it('should return true for Document instances', () => {
      expect(isDOM(document)).toBe(true);
    });

    it('should return true for window', () => {
      expect(isDOM(window)).toBe(true);
    });

    it('should return true for DocumentFragment instances', () => {
      const fragment = document.createDocumentFragment();
      expect(isDOM(fragment)).toBe(true);
    });
  });
});

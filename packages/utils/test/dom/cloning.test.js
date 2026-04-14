import { clone, deepFreeze } from '@semantic-ui/utils';

import { describe, expect, it } from 'vitest';

describe('Cloning Utilities', () => {
  describe('clone', () => {
    it('should clone dom nodes', () => {
      const div = document.createElement('div');
      const clonedDiv = clone(div);
      expect(clonedDiv).not.toBe(div);
    });
  });

  describe('deepFreeze', () => {
    it('should not freeze DOM nodes and leave them fully usable', () => {
      const div = document.createElement('div');
      div.textContent = 'hello';
      const wrapper = { el: div };
      deepFreeze(wrapper);
      expect(Object.isFrozen(wrapper)).toBe(true);
      expect(Object.isFrozen(div)).toBe(false);
      // DOM mutation must still work
      div.textContent = 'world';
      expect(div.textContent).toBe('world');
      div.setAttribute('data-x', '1');
      expect(div.getAttribute('data-x')).toBe('1');
    });
  });
});

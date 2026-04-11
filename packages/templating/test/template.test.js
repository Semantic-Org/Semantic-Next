import { describe, expect, it } from 'vitest';

import { Template } from '@semantic-ui/templating';

describe('Template', () => {

  /*******************************
      Symbol.hasInstance (instanceof)
  *******************************/

  describe('instanceof Template', () => {
    it('should return true for Template instances', () => {
      expect(new Template() instanceof Template).toBe(true);
    });

    it('should return false for non-Template objects', () => {
      expect({} instanceof Template).toBe(false);
      expect(null instanceof Template).toBe(false);
    });

    it('should return true for objects created via Object.create(Template.prototype)', () => {
      const fake = Object.create(Template.prototype);
      expect(fake instanceof Template).toBe(true);
    });
  });
});

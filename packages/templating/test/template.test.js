import { describe, expect, it } from 'vitest';

import '@semantic-ui/component';
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

  /*******************************
          Render Options
  *******************************/

  describe('renderOptions', () => {
    it('reach the renderer without displacing its own settings', () => {
      const template = new Template({
        template: '<p>{word}</p>',
        data: { word: 'own' },
        renderOptions: { markers: false, data: { word: 'displaced' }, ast: [], template: null },
      });
      template.initialize();
      expect(template.renderer.markers).toBe(false);
      expect(template.renderer.data.word).toBe('own');
      expect(template.renderer.ast.length).toBeGreaterThan(0);
      expect(template.renderer.template).toBe(template);
    });
  });
});

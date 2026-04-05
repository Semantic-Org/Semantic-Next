import { resolve } from 'path';
import { describe, expect, it } from 'vitest';
import { analyzeComponent } from '../src/component-analyzer.js';

const root = resolve(import.meta.dirname, '../../..');

function analyze(relativePath) {
  return analyzeComponent(resolve(root, relativePath));
}

describe('ComponentAnalyzer', () => {
  /*******************************
      Spec-driven Primitives
  *******************************/

  describe('button (spec-driven)', () => {
    const model = analyze('src/primitives/button/button.js');

    it('extracts tagName', () => {
      expect(model.tagName).toBe('ui-button');
    });

    it('extracts template path', () => {
      expect(model.templatePath).toContain('button.html');
    });

    it('extracts spec path', () => {
      expect(model.specPath).toContain('button.component');
    });

    it('extracts createComponent methods', () => {
      const names = model.instance.map(m => m.name);
      expect(names).toContain('isIconBefore');
      expect(names).toContain('performAction');
      expect(names).toContain('getForm');
      expect(names).toContain('isDisabled');
    });

    it('extracts method parameters', () => {
      const isSubmitKey = model.instance.find(m => m.name === 'isSubmitKey');
      expect(isSubmitKey.params).toHaveLength(1);
      expect(isSubmitKey.params[0].name).toBe('keyCode');
    });

    it('extracts events', () => {
      expect(model.events).toContain('click .button');
      expect(model.events).toContain('keydown .button');
      expect(model.events).toContain('touchstart .button');
    });
  });

  describe('input (has state)', () => {
    const model = analyze('src/primitives/input/input.js');

    it('extracts defaultState', () => {
      const focused = model.state.find(s => s.name === 'focused');
      expect(focused).toBeTruthy();
      expect(focused.inferredType).toBe('boolean');
      expect(focused.defaultValue).toBe(false);
    });

    it('extracts methods with various patterns', () => {
      const names = model.instance.map(m => m.name);
      expect(names).toContain('initialize');
      expect(names).toContain('hasValue');
      expect(names).toContain('setValue');
      // debounced arrow function property
      expect(names).toContain('setValueDebounced');
    });
  });

  describe('menu (complex, self-referential)', () => {
    const model = analyze('src/primitives/menu/menu.js');

    it('extracts all methods', () => {
      const names = model.instance.map(m => m.name);
      expect(names).toContain('setValue');
      expect(names).toContain('selectValue');
      expect(names).toContain('getMenuItems');
      expect(names).toContain('getActiveIndex');
      expect(names).toContain('getItemByValue');
      expect(names.length).toBeGreaterThanOrEqual(10);
    });

    it('extracts negative number state', () => {
      const activeIndex = model.state.find(s => s.name === 'activeIndex');
      expect(activeIndex.inferredType).toBe('number');
      expect(activeIndex.defaultValue).toBe(-1);
    });

    it('extracts deep event DSL', () => {
      expect(model.events).toContain('deep click menu-item');
    });
  });

  /*******************************
      Import Resolution
  *******************************/

  describe('import resolution', () => {
    it('resolves ?raw template imports', () => {
      const model = analyze('src/primitives/button/button.js');
      expect(model.templatePath).toContain('button.html');
    });

    it('resolves componentSpec imports', () => {
      const model = analyze('src/primitives/button/button.js');
      expect(model.specPath).toContain('button.component');
    });
  });

  /*******************************
      Edge Cases
  *******************************/

  describe('edge cases', () => {
    it('handles component with createComponent that has methods', () => {
      const model = analyze('src/primitives/divider/divider.js');
      expect(model.tagName).toBeTruthy();
      // divider has methods — that's fine, just verify it doesn't crash
      expect(Array.isArray(model.instance)).toBe(true);
    });
  });
});

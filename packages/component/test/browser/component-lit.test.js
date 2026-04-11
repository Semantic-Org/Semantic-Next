import { adoptStylesheet } from '@semantic-ui/utils';
import { describe, expect, it, vi } from 'vitest';
import { LitWebComponentBase } from '../../src/engines/lit/base.js';
import '../../src/engines/lit/register.js';
import { defineComponent } from '../../src/index.js';

/*
  Lit-specific component tests — these test LitElement internals
  (static styles, willUpdate, shadowRootOptions) that don't exist
  on the native rendering path.
*/
describe('Component (Lit-specific)', () => {
  describe('defineComponent', () => {
    it('should handle component with CSS via static styles', () => {
      const TestComponent = defineComponent({
        tagName: 'test-lit-css-component',
        renderingEngine: 'lit',
        template: '<div>Content</div>',
        css: '.container { color: red; }',
      });

      expect(TestComponent).toBeDefined();
      expect(TestComponent.styles).toBeDefined();
      expect(TestComponent.styles.toString()).toContain('.container { color: red; }');
    });

    it('should merge subTemplates CSS with component CSS via static styles', () => {
      const headerTemplate = defineComponent({
        renderingEngine: 'lit',
        template: '<div class="header">Header</div>',
        css: '.header { font-weight: bold; }',
      });

      const TestComponent = defineComponent({
        tagName: 'test-lit-subtemplates-component',
        renderingEngine: 'lit',
        template: '<div>{{>header}}Content</div>',
        css: '.container { padding: 10px; }',
        subTemplates: {
          header: headerTemplate,
        },
      });

      const stylesStr = TestComponent.styles.toString();
      expect(stylesStr).toContain('.container { padding: 10px; }');
      expect(stylesStr).toContain('.header { font-weight: bold; }');
    });
  });

  describe('LitWebComponentBase', () => {
    it('should have shadowRootOptions defined', () => {
      expect(LitWebComponentBase.shadowRootOptions).toBeDefined();
      expect(LitWebComponentBase.shadowRootOptions.delegatesFocus).toBe(false);
    });
  });

  describe('Component Instance', () => {
    it('should create template when willUpdate is called (Lit path)', () => {
      const TestComponent = defineComponent({
        tagName: 'test-lit-update-component',
        renderingEngine: 'lit',
        template: '<div>{{text}}</div>',
        defaultSettings: {
          text: 'Initial text',
        },
      });

      const instance = new TestComponent();
      instance.renderRoot = {};
      instance.getData = vi.fn().mockReturnValue({ text: 'Initial text' });

      expect(instance.template).toBeUndefined();
      instance.willUpdate();

      expect(instance.template).toBeDefined();
      expect(instance.component).toBeDefined();
      expect(instance.dataContext).toBeDefined();
    });
  });

  describe('Server-Side Rendering', () => {
    it('should handle SSR scenario in willUpdate', () => {
      vi.mock('@semantic-ui/utils', async () => {
        const actual = await vi.importActual('@semantic-ui/utils');
        return {
          ...actual,
          isServer: true,
        };
      });

      const TestComponent = defineComponent({
        tagName: 'test-lit-ssr-component',
        renderingEngine: 'lit',
        template: '<div>SSR Test</div>',
      });

      const instance = new TestComponent();
      instance.triggerAttributeChange = vi.fn();

      instance.willUpdate();

      expect(instance.triggerAttributeChange).toHaveBeenCalled();
    });
  });
});

import { beforeEach, describe, expect, it } from 'vitest';
import { RENDERING_ENGINES } from '../../../renderer/test/browser/test-utils.js';
import { defineComponent } from '../../src/index.js';

/*
  Setting attribute → value conversion across engines.

  getPropertySettings in packages/component/src/component-helpers.js
  installs Lit-style converters for each defaultSettings type:
    Boolean: 'false' / '0' / 'null' / 'undefined' → false; '' / 'true' / true → true
    Number:  null → null; otherwise Number(value)
    Object:  JSON.parse(value); invalid → null
    Array:   JSON.parse(value); invalid → null
    String:  passes through (Lit default)

  The native renderer was added after the canonical progress-bar example
  was authored. The example uses `<progress-bar animated="false">` etc.
  with `defaultSettings: { animated: true, inlineLabel: true, showLabel: true }`.
  All three should arrive as `false` but on the native engine the multiword
  ones come through as `true`. These tests pin the contract across engines.
*/

RENDERING_ENGINES.forEach((engine) => {
  describe(engine, () => {
    let tagCounter = 0;
    function uniqueTag() {
      return `test-converter-${engine}-${++tagCounter}`;
    }

    beforeEach(() => {
      document.body.innerHTML = '';
    });

    /*******************************
              Boolean
    *******************************/
    describe('Boolean defaults', () => {
      it("converts 'false' attribute to false on a defaultSetting of true", async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<i></i>',
          defaultSettings: { animated: true },
        });
        const el = document.createElement(tag);
        el.setAttribute('animated', 'false');
        document.body.appendChild(el);
        await el.updateComplete;
        expect(el.settings.animated).toBe(false);
      });

      it("converts 'false' attribute on a multiword default (the progress-bar bug)", async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<i></i>',
          defaultSettings: { showLabel: true, animated: true, inlineLabel: true },
        });
        const el = document.createElement(tag);
        el.setAttribute('showlabel', 'false');
        el.setAttribute('animated', 'false');
        el.setAttribute('inlinelabel', 'false');
        document.body.appendChild(el);
        await el.updateComplete;
        expect(el.settings.showLabel).toBe(false);
        expect(el.settings.animated).toBe(false);
        expect(el.settings.inlineLabel).toBe(false);
      });

      it('converts kebab-cased attribute on a multiword default', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<i></i>',
          defaultSettings: { showLabel: true },
        });
        const el = document.createElement(tag);
        el.setAttribute('show-label', 'false');
        document.body.appendChild(el);
        await el.updateComplete;
        expect(el.settings.showLabel).toBe(false);
      });

      it("converts '0' attribute to false", async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<i></i>',
          defaultSettings: { open: true },
        });
        const el = document.createElement(tag);
        el.setAttribute('open', '0');
        document.body.appendChild(el);
        await el.updateComplete;
        expect(el.settings.open).toBe(false);
      });

      it("converts 'null' string attribute to false", async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<i></i>',
          defaultSettings: { open: true },
        });
        const el = document.createElement(tag);
        el.setAttribute('open', 'null');
        document.body.appendChild(el);
        await el.updateComplete;
        expect(el.settings.open).toBe(false);
      });

      it("converts 'undefined' string attribute to false", async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<i></i>',
          defaultSettings: { open: true },
        });
        const el = document.createElement(tag);
        el.setAttribute('open', 'undefined');
        document.body.appendChild(el);
        await el.updateComplete;
        expect(el.settings.open).toBe(false);
      });

      it('treats empty-string attribute as true (HTML boolean attribute convention)', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<i></i>',
          defaultSettings: { open: false },
        });
        const el = document.createElement(tag);
        el.setAttribute('open', '');
        document.body.appendChild(el);
        await el.updateComplete;
        expect(el.settings.open).toBe(true);
      });

      it("treats 'true' attribute as true", async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<i></i>',
          defaultSettings: { open: false },
        });
        const el = document.createElement(tag);
        el.setAttribute('open', 'true');
        document.body.appendChild(el);
        await el.updateComplete;
        expect(el.settings.open).toBe(true);
      });
    });

    /*******************************
              Number
    *******************************/
    describe('Number defaults', () => {
      it('converts numeric string to number', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<i></i>',
          defaultSettings: { max: 100 },
        });
        const el = document.createElement(tag);
        el.setAttribute('max', '250');
        document.body.appendChild(el);
        await el.updateComplete;
        expect(el.settings.max).toBe(250);
      });

      it("converts '0' to the number 0 (not the string)", async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<i></i>',
          defaultSettings: { min: 5 },
        });
        const el = document.createElement(tag);
        el.setAttribute('min', '0');
        document.body.appendChild(el);
        await el.updateComplete;
        expect(el.settings.min).toBe(0);
      });

      it('converts negative numeric string', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<i></i>',
          defaultSettings: { offset: 0 },
        });
        const el = document.createElement(tag);
        el.setAttribute('offset', '-12');
        document.body.appendChild(el);
        await el.updateComplete;
        expect(el.settings.offset).toBe(-12);
      });

      it('converts decimal numeric string', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<i></i>',
          defaultSettings: { ratio: 1 },
        });
        const el = document.createElement(tag);
        el.setAttribute('ratio', '0.75');
        document.body.appendChild(el);
        await el.updateComplete;
        expect(el.settings.ratio).toBe(0.75);
      });
    });

    /*******************************
              Object / Array
    *******************************/
    describe('Object defaults', () => {
      it('parses JSON object attribute', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<i></i>',
          defaultSettings: { config: { mode: 'a' } },
        });
        const el = document.createElement(tag);
        el.setAttribute('config', '{"mode":"b","count":3}');
        document.body.appendChild(el);
        await el.updateComplete;
        expect(el.settings.config).toEqual({ mode: 'b', count: 3 });
      });
    });

    describe('Array defaults', () => {
      it('parses JSON array attribute', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<i></i>',
          defaultSettings: { items: [] },
        });
        const el = document.createElement(tag);
        el.setAttribute('items', '[1,2,3]');
        document.body.appendChild(el);
        await el.updateComplete;
        expect(el.settings.items).toEqual([1, 2, 3]);
      });
    });

    /*******************************
              String
    *******************************/
    describe('String defaults', () => {
      it('passes string attributes through', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<i></i>',
          defaultSettings: { label: 'hello' },
        });
        const el = document.createElement(tag);
        el.setAttribute('label', 'world');
        document.body.appendChild(el);
        await el.updateComplete;
        expect(el.settings.label).toBe('world');
      });

      it("does NOT coerce the string 'false' for a String default", async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<i></i>',
          defaultSettings: { label: 'hello' },
        });
        const el = document.createElement(tag);
        el.setAttribute('label', 'false');
        document.body.appendChild(el);
        await el.updateComplete;
        expect(el.settings.label).toBe('false');
      });
    });

    /*******************************
        Defaults preserved (no attr)
    *******************************/
    describe('Default preservation', () => {
      it('keeps default Boolean true when no attribute is set', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<i></i>',
          defaultSettings: { animated: true },
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;
        expect(el.settings.animated).toBe(true);
      });

      it('keeps default Boolean false when no attribute is set', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<i></i>',
          defaultSettings: { open: false },
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;
        expect(el.settings.open).toBe(false);
      });

      it('keeps default Number when no attribute is set', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<i></i>',
          defaultSettings: { max: 100 },
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;
        expect(el.settings.max).toBe(100);
      });
    });
  });
});

import { defineComponent } from '@semantic-ui/component';
import { beforeEach, describe, expect, it } from 'vitest';
import { RENDERING_ENGINES } from './test-utils.js';

RENDERING_ENGINES.forEach(engine => {
  describe(engine, () => {
    /*******************************
           Test Helpers
    *******************************/

    let tagCounter = 0;
    function uniqueTag() {
      return `test-lifecycle-${engine}-${++tagCounter}`;
    }

    function shadowHTML(el) {
      return el.shadowRoot.innerHTML
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    }

    async function renderComponent(opts) {
      const tag = uniqueTag();
      defineComponent({ tagName: tag, renderingEngine: engine, ...opts });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;
      return el;
    }

    beforeEach(() => {
      document.body.innerHTML = '';
    });

    /*******************************
          el.rendered
    *******************************/

    describe(`[${engine}] el.rendered`, () => {
      it('resolves after first render', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<div>hello</div>',
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.rendered;

        expect(shadowHTML(el)).toBe('<div>hello</div>');
      });

      it('resolves immediately when called after render', async () => {
        const el = await renderComponent({ template: '<div>done</div>' });

        const start = performance.now();
        await el.rendered;
        const elapsed = performance.now() - start;

        expect(elapsed).toBeLessThan(50);
      });
    });

    /*******************************
          el.updated
    *******************************/

    // Lit's LitElement.updated() collides with this getter — skip for lit engine
    if (engine !== 'lit') {
      describe(`[${engine}] el.updated`, () => {
        it('resolves immediately when no update is pending', async () => {
          const el = await renderComponent({
            template: '<span>{count}</span>',
            defaultState: { count: 0 },
          });

          const start = performance.now();
          await el.updated;
          const elapsed = performance.now() - start;

          expect(elapsed).toBeLessThan(50);
        });

        it('resolves after a state change', async () => {
          const el = await renderComponent({
            template: '<span>{count}</span>',
            defaultState: { count: 0 },
            createComponent: ({ state }) => ({
              increment() {
                state.count.increment();
              },
            }),
          });

          expect(shadowHTML(el)).toBe('<span>0</span>');

          el.component.increment();
          await el.updated;

          expect(shadowHTML(el)).toBe('<span>1</span>');
        });

        it('resolves after a property change', async () => {
          const el = await renderComponent({
            template: '<span>{label}</span>',
            defaultSettings: { label: 'before' },
          });

          expect(shadowHTML(el)).toBe('<span>before</span>');

          el.label = 'after';
          await el.updated;

          expect(shadowHTML(el)).toBe('<span>after</span>');
        });

        it('works across multiple sequential updates', async () => {
          const el = await renderComponent({
            template: '<span>{count}</span>',
            defaultState: { count: 0 },
            createComponent: ({ state }) => ({
              setCount(v) {
                state.count.set(v);
              },
            }),
          });

          for (let i = 1; i <= 5; i++) {
            el.component.setCount(i);
            await el.updated;
            expect(shadowHTML(el)).toBe(`<span>${i}</span>`);
          }
        });

        it('does not hang when called after a non-reactive action', async () => {
          let clicked = false;
          const el = await renderComponent({
            template: '<button>click</button>',
            createComponent: () => ({
              handleClick() {
                clicked = true;
              },
            }),
          });

          el.component.handleClick();
          await el.updated;

          expect(clicked).toBe(true);
        });
      });
    }

    /*******************************
          el.updateComplete
    *******************************/

    describe(`[${engine}] el.updateComplete`, () => {
      it('resolves immediately when idle', async () => {
        const el = await renderComponent({
          template: '<div>idle</div>',
        });

        const start = performance.now();
        await el.updateComplete;
        const elapsed = performance.now() - start;

        expect(elapsed).toBeLessThan(50);
      });

      it('resolves after a state change', async () => {
        const el = await renderComponent({
          template: '<span>{count}</span>',
          defaultState: { count: 0 },
          createComponent: ({ state }) => ({
            increment() {
              state.count.increment();
            },
          }),
        });

        el.component.increment();
        await el.updateComplete;

        expect(shadowHTML(el)).toBe('<span>1</span>');
      });

      it('resolves after a property change', async () => {
        const el = await renderComponent({
          template: '<span>{label}</span>',
          defaultSettings: { label: 'before' },
        });

        el.label = 'after';
        await el.updateComplete;

        expect(shadowHTML(el)).toBe('<span>after</span>');
      });
    });

    /*******************************
          el.destroyed
    *******************************/

    describe(`[${engine}] el.destroyed`, () => {
      it('resolves when element is removed', async () => {
        const el = await renderComponent({
          template: '<div>bye</div>',
        });

        const destroyed = el.destroyed;
        el.remove();
        await destroyed;

        expect(el.template).toBeUndefined();
        expect(el.component).toBeUndefined();
      });
    });
  });
});

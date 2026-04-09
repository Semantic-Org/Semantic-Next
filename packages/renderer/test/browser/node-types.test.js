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
      return `test-node-${engine}-${++tagCounter}`;
    }

    function shadowText(el) {
      return el.shadowRoot.innerHTML.replace(/<!--[\s\S]*?-->/g, '').trim();
    }

    async function waitForUpdate(el) {
      await el.updateComplete;
      await new Promise(r => setTimeout(r, 0));
      await el.updateComplete;
    }

    beforeEach(() => {
      document.body.innerHTML = '';
    });

    /*******************************
   Unsafe HTML ({#html})
*******************************/

    describe('unsafe HTML rendering', () => {
      it('should render raw HTML, not escaped text', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<div>{#html content}</div>',
          createComponent: () => ({
            content: '<strong>bold</strong>',
          }),
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;

        const strong = el.shadowRoot.querySelector('strong');
        expect(strong).not.toBeNull();
        expect(strong.textContent).toBe('bold');
      });

      it('should reactively update raw HTML when signal changes', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<div>{#html getMarkup}</div>',
          defaultState: { version: 0 },
          createComponent: ({ state }) => ({
            getMarkup: () =>
              state.version.get() === 0
                ? '<em>first</em>'
                : '<b>second</b>',
          }),
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;

        expect(el.shadowRoot.querySelector('em')).not.toBeNull();
        expect(el.shadowRoot.querySelector('b')).toBeNull();

        el.template.state.version.set(1);
        await waitForUpdate(el);

        expect(el.shadowRoot.querySelector('b')).not.toBeNull();
        expect(el.shadowRoot.querySelector('em')).toBeNull();
      });
    });

    /*******************************
   Slots ({>slot})
*******************************/

    describe('slot rendering', () => {
      it('should render a default slot element', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<div class="wrapper">{>slot}</div>',
        });
        const el = document.createElement(tag);
        el.innerHTML = '<span>slotted content</span>';
        document.body.appendChild(el);
        await el.updateComplete;

        const slot = el.shadowRoot.querySelector('slot');
        expect(slot).not.toBeNull();
        expect(slot.hasAttribute('name')).toBe(false);
      });

      it('should render a named slot element', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<header>{>slot header}</header><main>{>slot}</main>',
        });
        const el = document.createElement(tag);
        el.innerHTML = '<h1 slot="header">Title</h1><p>Body</p>';
        document.body.appendChild(el);
        await el.updateComplete;

        const namedSlot = el.shadowRoot.querySelector('slot[name="header"]');
        const defaultSlot = el.shadowRoot.querySelector('slot:not([name])');
        expect(namedSlot).not.toBeNull();
        expect(defaultSlot).not.toBeNull();
      });

      it('should project slotted content into default slot', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<div>{>slot}</div>',
        });
        const el = document.createElement(tag);
        el.innerHTML = '<span class="child">projected</span>';
        document.body.appendChild(el);
        await el.updateComplete;

        const slot = el.shadowRoot.querySelector('slot');
        const assigned = slot.assignedElements();
        expect(assigned.length).toBe(1);
        expect(assigned[0].textContent).toBe('projected');
      });
    });

    /*******************************
   Object Iteration
*******************************/

    describe('each with object iteration', () => {
      it('should iterate over object keys and values', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '{#each value, key in colors}<span>{key}:{value}</span>{/each}',
          createComponent: () => ({
            colors: { red: '#f00', green: '#0f0', blue: '#00f' },
          }),
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;

        const text = shadowText(el);
        expect(text).toContain('red:#f00');
        expect(text).toContain('green:#0f0');
        expect(text).toContain('blue:#00f');
      });

      it('should reactively update when object changes', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '{#each value, key in getConfig}<div data-key="{key}">{value}</div>{/each}',
          defaultState: { version: 0 },
          createComponent: ({ state }) => ({
            getConfig: () =>
              state.version.get() === 0
                ? { host: 'localhost', port: '3000' }
                : { host: 'production', port: '443', ssl: 'true' },
          }),
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;

        let divs = el.shadowRoot.querySelectorAll('div');
        expect(divs.length).toBe(2);
        expect(shadowText(el)).toContain('host');
        expect(shadowText(el)).toContain('localhost');

        el.template.state.version.set(1);
        await waitForUpdate(el);

        divs = el.shadowRoot.querySelectorAll('div');
        expect(divs.length).toBe(3);
        expect(shadowText(el)).toContain('production');
        expect(shadowText(el)).toContain('ssl');
      });
    });

    /*******************************
   SVG Rendering
*******************************/

    describe('SVG rendering', () => {
      it('should create SVG elements in the correct namespace', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<svg width="100" height="100"><circle cx="50" cy="50" r="{radius}"></circle></svg>',
          createComponent: () => ({
            radius: 25,
          }),
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;

        const svg = el.shadowRoot.querySelector('svg');
        expect(svg).not.toBeNull();
        expect(svg.namespaceURI).toBe('http://www.w3.org/2000/svg');

        const circle = svg.querySelector('circle');
        expect(circle).not.toBeNull();
        expect(circle.namespaceURI).toBe('http://www.w3.org/2000/svg');
      });

      it('should reactively update SVG attributes', async () => {
        const tag = uniqueTag();
        defineComponent({
          tagName: tag,
          renderingEngine: engine,
          template: '<svg width="100" height="100"><rect width="{w}" height="{h}"></rect></svg>',
          defaultState: { w: 10, h: 20 },
        });
        const el = document.createElement(tag);
        document.body.appendChild(el);
        await el.updateComplete;

        const rect = el.shadowRoot.querySelector('rect');
        expect(rect.getAttribute('width')).toBe('10');
        expect(rect.getAttribute('height')).toBe('20');

        el.template.state.w.set(50);
        el.template.state.h.set(80);
        await waitForUpdate(el);

        expect(rect.getAttribute('width')).toBe('50');
        expect(rect.getAttribute('height')).toBe('80');
      });
    });
  }); // describe(engine)
}); // RENDERING_ENGINES.forEach

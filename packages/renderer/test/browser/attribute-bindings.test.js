import { defineComponent } from '@semantic-ui/component';
import { beforeEach, describe, expect, it } from 'vitest';
import { RENDERING_ENGINES } from './test-utils.js';

RENDERING_ENGINES.forEach(engine => {
  /*******************************
         Test Helpers
*******************************/

  let tagCounter = 0;
  function uniqueTag() {
    return `test-attr-bind-${engine}-${++tagCounter}`;
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
   String Attribute Reactivity
*******************************/

  describe('string attribute reactivity', () => {
    it('should update class attribute when signal changes', async () => {
      const tag = uniqueTag();
      defineComponent({
        renderingEngine: engine,
        tagName: tag,
        template: '<div class="{getClass}">content</div>',
        defaultState: { mode: 'light' },
        createComponent: ({ state }) => ({
          getClass: () => `theme-${state.mode.get()}`,
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      const div = el.shadowRoot.querySelector('div');
      expect(div.getAttribute('class')).toBe('theme-light');

      el.template.state.mode.set('dark');
      await waitForUpdate(el);

      expect(div.getAttribute('class')).toBe('theme-dark');
    });

    it('should update data attribute when signal changes', async () => {
      const tag = uniqueTag();
      defineComponent({
        renderingEngine: engine,
        tagName: tag,
        template: '<div data-status="{status}">content</div>',
        defaultState: { status: 'idle' },
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      const div = el.shadowRoot.querySelector('div');
      expect(div.getAttribute('data-status')).toBe('idle');

      el.template.state.status.set('loading');
      await waitForUpdate(el);

      expect(div.getAttribute('data-status')).toBe('loading');
    });

    it('should concatenate multi-expression class attribute', async () => {
      const tag = uniqueTag();
      defineComponent({
        renderingEngine: engine,
        tagName: tag,
        template: '<div class="{base} {modifier}">content</div>',
        defaultState: { active: false },
        createComponent: ({ state }) => ({
          base: 'container',
          modifier: () => state.active.get() ? 'active' : 'inactive',
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      const div = el.shadowRoot.querySelector('div');
      const cls = div.getAttribute('class');
      expect(cls).toContain('container');
      expect(cls).toContain('inactive');

      el.template.state.active.set(true);
      await waitForUpdate(el);

      const updated = div.getAttribute('class');
      expect(updated).toContain('container');
      expect(updated).toContain('active');
      expect(updated).not.toContain('inactive');
    });
  });

  /*******************************
   Boolean Attribute Binding
*******************************/

  describe('boolean attribute binding', () => {
    it('should remove disabled attribute when expression becomes false', async () => {
      const tag = uniqueTag();
      defineComponent({
        renderingEngine: engine,
        tagName: tag,
        template: '<button disabled={isDisabled}>Click</button>',
        defaultState: { isDisabled: true },
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      const btn = el.shadowRoot.querySelector('button');
      expect(btn.hasAttribute('disabled')).toBe(true);
      expect(btn.disabled).toBe(true);

      el.template.state.isDisabled.set(false);
      await waitForUpdate(el);

      expect(btn.hasAttribute('disabled')).toBe(false);
      expect(btn.disabled).toBe(false);
    });

    it('should toggle hidden attribute reactively', async () => {
      const tag = uniqueTag();
      defineComponent({
        renderingEngine: engine,
        tagName: tag,
        template: '<div hidden={isHidden}>content</div>',
        defaultState: { isHidden: false },
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      const div = el.shadowRoot.querySelector('div');
      expect(div.hasAttribute('hidden')).toBe(false);

      el.template.state.isHidden.set(true);
      await waitForUpdate(el);

      expect(div.hasAttribute('hidden')).toBe(true);

      el.template.state.isHidden.set(false);
      await waitForUpdate(el);

      expect(div.hasAttribute('hidden')).toBe(false);
    });

    it('should synchronize checked property on checkbox', async () => {
      const tag = uniqueTag();
      defineComponent({
        renderingEngine: engine,
        tagName: tag,
        template: '<input type="checkbox" checked={isChecked}>',
        defaultState: { isChecked: false },
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      const input = el.shadowRoot.querySelector('input');
      expect(input.checked).toBe(false);

      el.template.state.isChecked.set(true);
      await waitForUpdate(el);

      expect(input.checked).toBe(true);

      el.template.state.isChecked.set(false);
      await waitForUpdate(el);

      expect(input.checked).toBe(false);
    });
  });

  /*******************************
   Quoted vs Unquoted Behavior
*******************************/

  describe('quoted vs unquoted attribute behavior', () => {
    it('quoted: should preserve attribute when value is empty string', async () => {
      const tag = uniqueTag();
      defineComponent({
        renderingEngine: engine,
        tagName: tag,
        template: '<div data-info="{info}">content</div>',
        defaultState: { info: 'hello' },
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      const div = el.shadowRoot.querySelector('div');
      expect(div.getAttribute('data-info')).toBe('hello');

      el.template.state.info.set('');
      await waitForUpdate(el);

      // Quoted: attribute stays present even with empty string
      expect(div.hasAttribute('data-info')).toBe(true);
    });

    it('unquoted: should remove attribute when value is empty string', async () => {
      const tag = uniqueTag();
      defineComponent({
        renderingEngine: engine,
        tagName: tag,
        template: '<div data-info={info}>content</div>',
        defaultState: { info: 'hello' },
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      const div = el.shadowRoot.querySelector('div');
      expect(div.getAttribute('data-info')).toBe('hello');

      el.template.state.info.set('');
      await waitForUpdate(el);

      // Unquoted (ifDefined): attribute removed for falsy values
      expect(div.hasAttribute('data-info')).toBe(false);
    });

    it('unquoted: should remove attribute when value is null', async () => {
      const tag = uniqueTag();
      defineComponent({
        renderingEngine: engine,
        tagName: tag,
        template: '<div data-info={info}>content</div>',
        defaultState: { info: 'hello' },
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      const div = el.shadowRoot.querySelector('div');
      expect(div.getAttribute('data-info')).toBe('hello');

      el.template.state.info.set(null);
      await waitForUpdate(el);

      expect(div.hasAttribute('data-info')).toBe(false);
    });

    it('unquoted: should restore attribute when value becomes truthy again', async () => {
      const tag = uniqueTag();
      defineComponent({
        renderingEngine: engine,
        tagName: tag,
        template: '<div data-info={info}>content</div>',
        defaultState: { info: 'initial' },
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      const div = el.shadowRoot.querySelector('div');
      expect(div.getAttribute('data-info')).toBe('initial');

      el.template.state.info.set('');
      await waitForUpdate(el);
      expect(div.hasAttribute('data-info')).toBe(false);

      el.template.state.info.set('restored');
      await waitForUpdate(el);
      expect(div.getAttribute('data-info')).toBe('restored');
    });
  });

  /*******************************
   Attribute Inside Control Flow
*******************************/

  describe('attribute binding inside each', () => {
    it('should set per-item class attribute from item data', async () => {
      const tag = uniqueTag();
      defineComponent({
        renderingEngine: engine,
        tagName: tag,
        template: '{#each item in items}<span class="{item.status}">{item.name}</span>{/each}',
        createComponent: () => ({
          items: [
            { name: 'A', status: 'active' },
            { name: 'B', status: 'pending' },
          ],
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      const spans = el.shadowRoot.querySelectorAll('span');
      expect(spans[0].getAttribute('class')).toBe('active');
      expect(spans[1].getAttribute('class')).toBe('pending');
    });

    it('should reactively update per-item attribute when data changes', async () => {
      const tag = uniqueTag();
      defineComponent({
        renderingEngine: engine,
        tagName: tag,
        template: '{#each item in getItems}<div class="{item.status}">{item.name}</div>{/each}',
        defaultState: { version: 0 },
        createComponent: ({ state }) => ({
          getItems: () => {
            const v = state.version.get();
            return [
              { name: 'X', status: v === 0 ? 'draft' : 'published' },
              { name: 'Y', status: v === 0 ? 'draft' : 'archived' },
            ];
          },
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      let divs = el.shadowRoot.querySelectorAll('div');
      expect(divs[0].getAttribute('class')).toBe('draft');
      expect(divs[1].getAttribute('class')).toBe('draft');

      el.template.state.version.set(1);
      await waitForUpdate(el);

      divs = el.shadowRoot.querySelectorAll('div');
      expect(divs[0].getAttribute('class')).toBe('published');
      expect(divs[1].getAttribute('class')).toBe('archived');
    });
  });

  describe('attribute binding inside conditional', () => {
    it('should apply attribute in active branch', async () => {
      const tag = uniqueTag();
      defineComponent({
        renderingEngine: engine,
        tagName: tag,
        template: '{#if isError}<div class="error">{message}</div>{else}<div class="ok">{message}</div>{/if}',
        defaultState: { isError: false, message: 'status' },
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      let div = el.shadowRoot.querySelector('div');
      expect(div.getAttribute('class')).toBe('ok');

      el.template.state.isError.set(true);
      await waitForUpdate(el);

      div = el.shadowRoot.querySelector('div');
      expect(div.getAttribute('class')).toBe('error');
    });
  });

  /*******************************
   DOM Element Identity
*******************************/

  describe('DOM element identity across attribute updates', () => {
    it('should preserve element reference when attribute value changes', async () => {
      const tag = uniqueTag();
      defineComponent({
        renderingEngine: engine,
        tagName: tag,
        template: '<div class="{theme}" data-count="{count}">content</div>',
        defaultState: { theme: 'light', count: 0 },
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      const divBefore = el.shadowRoot.querySelector('div');
      expect(divBefore.getAttribute('class')).toBe('light');
      expect(divBefore.getAttribute('data-count')).toBe('0');

      el.template.state.theme.set('dark');
      el.template.state.count.set(42);
      await waitForUpdate(el);

      const divAfter = el.shadowRoot.querySelector('div');
      expect(divAfter).toBe(divBefore); // same DOM node
      expect(divAfter.getAttribute('class')).toBe('dark');
      expect(divAfter.getAttribute('data-count')).toBe('42');
    });
  });

  /*******************************
   Helper-Generated Attributes
*******************************/

  describe('helper-generated class attributes', () => {
    it('should update class from classMap helper', async () => {
      const tag = uniqueTag();
      defineComponent({
        renderingEngine: engine,
        tagName: tag,
        template: '<div class="{classMap getClasses}">content</div>',
        defaultState: { isActive: false, isError: false },
        createComponent: ({ state }) => ({
          getClasses: () => ({
            active: state.isActive.get(),
            error: state.isError.get(),
            base: true,
          }),
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      const div = el.shadowRoot.querySelector('div');
      expect(div.getAttribute('class')).toContain('base');
      expect(div.getAttribute('class')).not.toContain('active');
      expect(div.getAttribute('class')).not.toContain('error');

      el.template.state.isActive.set(true);
      await waitForUpdate(el);

      expect(div.getAttribute('class')).toContain('base');
      expect(div.getAttribute('class')).toContain('active');
      expect(div.getAttribute('class')).not.toContain('error');

      el.template.state.isError.set(true);
      await waitForUpdate(el);

      expect(div.getAttribute('class')).toContain('base');
      expect(div.getAttribute('class')).toContain('active');
      expect(div.getAttribute('class')).toContain('error');
    });

    it('should update class from activeIf helper', async () => {
      const tag = uniqueTag();
      defineComponent({
        renderingEngine: engine,
        tagName: tag,
        template: '<div class="{activeIf isSelected}item">content</div>',
        defaultState: { isSelected: false },
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      const div = el.shadowRoot.querySelector('div');
      expect(div.getAttribute('class').trim()).toContain('item');
      expect(div.getAttribute('class')).not.toContain('active');

      el.template.state.isSelected.set(true);
      await waitForUpdate(el);

      expect(div.getAttribute('class')).toContain('active');
      expect(div.getAttribute('class')).toContain('item');
    });
  });

  /*******************************
   Property Binding (.prop)
*******************************/

  describe('dot-prefix property binding', () => {
    it('should set a DOM property (not attribute) via .prop syntax', async () => {
      const tag = uniqueTag();
      const childTag = uniqueTag();

      // Child just needs to exist as a custom element
      defineComponent({
        renderingEngine: engine,
        tagName: childTag,
        template: '<span>child</span>',
      });

      defineComponent({
        renderingEngine: engine,
        tagName: tag,
        template: `<${childTag} .myCallback={handler}></${childTag}>`,
        createComponent: () => ({
          handler: (x) => x * 2,
        }),
      });

      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      const child = el.shadowRoot.querySelector(childTag);

      // .prop sets the JS property directly — function is not serialized
      expect(typeof child.myCallback).toBe('function');
      expect(child.myCallback(5)).toBe(10);

      // The property should NOT appear as an HTML attribute
      expect(child.hasAttribute('mycallback')).toBe(false);
      expect(child.hasAttribute('.myCallback')).toBe(false);
    });
  });

  /*******************************
   Template Event Binding
*******************************/

  describe('template @event binding', () => {
    it('should bind click handler via @event syntax', async () => {
      let clicked = false;
      const tag = uniqueTag();
      defineComponent({
        renderingEngine: engine,
        tagName: tag,
        template: '<button @click={handleClick}>Click me</button>',
        createComponent: () => ({
          handleClick: () => {
            clicked = true;
          },
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      const btn = el.shadowRoot.querySelector('button');
      btn.click();
      await waitForUpdate(el);

      expect(clicked).toBe(true);
    });
  });

  /*******************************
   Settings-Driven Attribute
*******************************/

  describe('settings-driven attribute reactivity', () => {
    it('should update attribute when setting changes via property', async () => {
      const tag = uniqueTag();
      defineComponent({
        renderingEngine: engine,
        tagName: tag,
        template: '<div class="{classMap getClasses}">content</div>',
        defaultSettings: { active: false },
        createComponent: ({ settings }) => ({
          getClasses: () => ({
            active: settings.active,
            widget: true,
          }),
        }),
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      const div = el.shadowRoot.querySelector('div');
      expect(div.getAttribute('class')).toContain('widget');
      expect(div.getAttribute('class')).not.toContain('active');

      // Update setting via DOM property
      el.active = true;
      await waitForUpdate(el);

      expect(div.getAttribute('class')).toContain('active');
      expect(div.getAttribute('class')).toContain('widget');
    });

    it('should update attribute when setting changes via setAttribute', async () => {
      const tag = uniqueTag();
      defineComponent({
        renderingEngine: engine,
        tagName: tag,
        template: '<span data-label="{label}">text</span>',
        defaultSettings: { label: 'initial' },
      });
      const el = document.createElement(tag);
      document.body.appendChild(el);
      await el.updateComplete;

      const span = el.shadowRoot.querySelector('span');
      expect(span.getAttribute('data-label')).toBe('initial');

      // Update setting via HTML attribute
      el.setAttribute('label', 'updated');
      await waitForUpdate(el);

      expect(span.getAttribute('data-label')).toBe('updated');
    });
  });
}); // RENDERING_ENGINES.forEach

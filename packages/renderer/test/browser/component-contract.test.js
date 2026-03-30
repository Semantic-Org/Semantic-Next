import { defineComponent } from '@semantic-ui/component';
import { $ } from '@semantic-ui/query';
import { Reaction } from '@semantic-ui/reactivity';
import { beforeEach, describe, expect, it } from 'vitest';
import { RENDERING_ENGINES } from './test-utils.js';

RENDERING_ENGINES.forEach(engine => {
  /*******************************
           Test Helpers
  *******************************/

  let tagCounter = 0;
  function uniqueTag() {
    return `test-contract-${engine}-${++tagCounter}`;
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
    const rendered = $(el).onNext('rendered');
    document.body.appendChild(el);
    await rendered;
    return el;
  }

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  /*******************************
       Lifecycle Events
  *******************************/

  describe(`[${engine}] component contract — lifecycle events`, () => {
    it('fires created, rendered, and updated on first render', async () => {
      const order = [];
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template: '<div>hello</div>',
      });
      const el = document.createElement(tag);
      el.addEventListener('created', () => order.push('created'));
      el.addEventListener('rendered', () => order.push('rendered'));
      el.addEventListener('updated', () => order.push('updated'));

      const rendered = $(el).onNext('rendered');
      document.body.appendChild(el);
      await rendered;

      expect(order).toContain('created');
      expect(order).toContain('rendered');
      expect(order.indexOf('created')).toBeLessThan(order.indexOf('rendered'));
    });

    it('fires destroyed on disconnect', async () => {
      const el = await renderComponent({ template: '<div>bye</div>' });

      const destroyed = $(el).onNext('destroyed');
      el.remove();
      await destroyed;

      expect(el.component).toBeUndefined();
      expect(el.dataContext).toBeUndefined();
      expect(el.template).toBeUndefined();
    });

    it('created event detail contains component instance', async () => {
      let detail;
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template: '<div>{label}</div>',
        createComponent: () => ({
          label: 'test',
          getLabel() {
            return 'test';
          },
        }),
      });
      const el = document.createElement(tag);
      el.addEventListener('created', (e) => {
        detail = e.detail;
      });
      const rendered = $(el).onNext('rendered');
      document.body.appendChild(el);
      await rendered;

      expect(detail.component).toBeDefined();
      expect(detail.component.getLabel).toBeTypeOf('function');
      expect(detail.component.getLabel()).toBe('test');
    });

    it('rendered fires only on first render', async () => {
      let renderedCount = 0;
      const el = await renderComponent({
        template: '<span>{count}</span>',
        defaultState: { count: 0 },
        createComponent: ({ state }) => ({
          increment() {
            state.count.increment();
          },
        }),
      });
      el.addEventListener('rendered', () => renderedCount++);

      const updated = $(el).onNext('updated');
      el.component.increment();
      await updated;

      expect(renderedCount).toBe(0);
    });

    it('updated fires when state changes via el.component', async () => {
      let updatedCount = 0;
      const el = await renderComponent({
        template: '<span>{count}</span>',
        defaultState: { count: 0 },
        createComponent: ({ state }) => ({
          increment() {
            state.count.increment();
          },
        }),
      });
      el.addEventListener('updated', () => updatedCount++);

      const updated = $(el).onNext('updated');
      el.component.increment();
      await updated;

      expect(updatedCount).toBeGreaterThanOrEqual(1);
      expect(shadowHTML(el)).toBe('<span>1</span>');
    });

    it('updated fires when a setting changes via property assignment', async () => {
      let updatedCount = 0;
      const el = await renderComponent({
        template: '<span>{label}</span>',
        defaultSettings: { label: 'before' },
      });
      el.addEventListener('updated', () => updatedCount++);

      const updated = $(el).onNext('updated');
      el.label = 'after';
      el.requestUpdate();
      await updated;

      expect(updatedCount).toBeGreaterThanOrEqual(1);
      expect(shadowHTML(el)).toBe('<span>after</span>');
    });

    it('destroyed does not fire on property change', async () => {
      let destroyedFired = false;
      const el = await renderComponent({
        template: '<span>{label}</span>',
        defaultSettings: { label: 'test' },
      });
      el.addEventListener('destroyed', () => {
        destroyedFired = true;
      });

      const updated = $(el).onNext('updated');
      el.label = 'changed';
      el.requestUpdate();
      await updated;

      expect(destroyedFired).toBe(false);
      expect(el.component).toBeDefined();
    });
  });

  /*******************************
       el.component
  *******************************/

  describe(`[${engine}] component contract — el.component`, () => {
    it('is the object returned by createComponent', async () => {
      const el = await renderComponent({
        template: '<div>{count}</div>',
        defaultState: { count: 0 },
        createComponent: ({ state }) => ({
          increment() {
            state.count.increment();
          },
          getCount() {
            return state.count.get();
          },
        }),
      });

      expect(el.component).toBeDefined();
      expect(el.component.increment).toBeTypeOf('function');
      expect(el.component.getCount()).toBe(0);
    });

    it('methods mutate state and trigger re-render', async () => {
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

      const updated = $(el).onNext('updated');
      el.component.increment();
      await updated;

      expect(shadowHTML(el)).toBe('<span>1</span>');
    });

    it('is undefined before connect', () => {
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template: '<div>test</div>',
        createComponent: () => ({ value: 42 }),
      });
      const el = document.createElement(tag);
      expect(el.component).toBeUndefined();
    });

    it('is deleted after disconnect', async () => {
      const el = await renderComponent({
        template: '<div>test</div>',
        createComponent: () => ({ value: 42 }),
      });

      expect(el.component).toBeDefined();

      const destroyed = $(el).onNext('destroyed');
      el.remove();
      await destroyed;

      expect(el.component).toBeUndefined();
    });
  });

  /*******************************
       el.dataContext
  *******************************/

  describe(`[${engine}] component contract — el.dataContext`, () => {
    it('contains instance methods from createComponent', async () => {
      const el = await renderComponent({
        template: '<div>{greeting}</div>',
        createComponent: () => ({
          greeting: 'hello',
          greet() {
            return 'hello';
          },
        }),
      });

      expect(el.dataContext.greeting).toBe('hello');
      expect(el.dataContext.greet).toBeTypeOf('function');
    });

    it('contains state signals', async () => {
      const el = await renderComponent({
        template: '<div>{count}</div>',
        defaultState: { count: 5 },
      });

      expect(el.dataContext.count).toBeDefined();
      // state entries are Signal instances in the data context
      expect(el.dataContext.count.get).toBeTypeOf('function');
      expect(el.dataContext.count.get()).toBe(5);
    });

    it('contains settings values', async () => {
      const el = await renderComponent({
        template: '<div>{label}</div>',
        defaultSettings: { label: 'default' },
      });

      expect(el.dataContext.label).toBe('default');
    });

    it('is deleted after disconnect', async () => {
      const el = await renderComponent({
        template: '<div>test</div>',
        defaultState: { x: 1 },
      });

      expect(el.dataContext).toBeDefined();

      const destroyed = $(el).onNext('destroyed');
      el.remove();
      await destroyed;

      expect(el.dataContext).toBeUndefined();
    });
  });

  /*******************************
       el.settings (proxy)
  *******************************/

  describe(`[${engine}] component contract — el.settings`, () => {
    it('reads reflect current property values', async () => {
      const el = await renderComponent({
        template: '<div>{color}</div>',
        defaultSettings: { color: 'blue' },
      });

      expect(el.settings.color).toBe('blue');
    });

    it('reads reflect values set via attributes', async () => {
      const tag = uniqueTag();
      defineComponent({
        tagName: tag,
        renderingEngine: engine,
        template: '<div>{color}</div>',
        defaultSettings: { color: 'blue' },
      });
      const el = document.createElement(tag);
      el.setAttribute('color', 'red');
      const rendered = $(el).onNext('rendered');
      document.body.appendChild(el);
      await rendered;

      expect(el.settings.color).toBe('red');
    });

    it('writes update the element property', async () => {
      const el = await renderComponent({
        template: '<div>{color}</div>',
        defaultSettings: { color: 'blue' },
      });

      el.settings.color = 'green';
      expect(el.color).toBe('green');
    });

    it('writes trigger reactive template updates', async () => {
      const el = await renderComponent({
        template: '<span>{color}</span>',
        defaultSettings: { color: 'blue' },
      });

      expect(shadowHTML(el)).toBe('<span>blue</span>');

      const updated = $(el).onNext('updated');
      el.settings.color = 'red';
      Reaction.flush();
      el.requestUpdate();
      await updated;

      expect(shadowHTML(el)).toBe('<span>red</span>');
    });

    it('component method updating setting triggers updated event', async () => {
      const el = await renderComponent({
        template: '<span>{color}</span>',
        defaultSettings: { color: 'blue' },
        createComponent: ({ settings }) => ({
          setColor(c) {
            settings.color = c;
          },
        }),
      });

      expect(shadowHTML(el)).toBe('<span>blue</span>');

      const updated = $(el).onNext('updated');
      el.component.setColor('red');
      await updated;

      expect(shadowHTML(el)).toBe('<span>red</span>');
    });
  });

  /*******************************
       Property Assignment
  *******************************/

  describe(`[${engine}] component contract — property assignment`, () => {
    it('el[prop] = value updates rendered output', async () => {
      const el = await renderComponent({
        template: '<span>{name}</span>',
        defaultSettings: { name: 'Alice' },
      });

      expect(shadowHTML(el)).toBe('<span>Alice</span>');

      const updated = $(el).onNext('updated');
      el.name = 'Bob';
      el.requestUpdate();
      await updated;

      expect(shadowHTML(el)).toBe('<span>Bob</span>');
    });

    it('is reflected in el.settings reads', async () => {
      const el = await renderComponent({
        template: '<div>{label}</div>',
        defaultSettings: { label: 'original' },
      });

      el.label = 'changed';
      expect(el.settings.label).toBe('changed');
    });

    it('works with multiple property types', async () => {
      const el = await renderComponent({
        template: '<div>{text} {count} {active}</div>',
        defaultSettings: { text: 'hi', count: 0, active: false },
      });

      const updated = $(el).onNext('updated');
      el.text = 'bye';
      el.count = 42;
      el.active = true;
      el.requestUpdate();
      await updated;

      expect(el.settings.text).toBe('bye');
      expect(el.settings.count).toBe(42);
      expect(el.settings.active).toBe(true);
    });
  });
});

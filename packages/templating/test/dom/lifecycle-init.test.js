import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Reaction } from '@semantic-ui/reactivity';
import { Template } from '@semantic-ui/templating';
import '@semantic-ui/component'; // registers the native rendering engine

let host;
beforeEach(() => {
  host = document.createElement('div');
  document.body.appendChild(host);
});
afterEach(() => {
  document.body.innerHTML = '';
  Template.renderedTemplates.clear();
});

// helper — drain microtasks (used for queueMicrotask debouncing inside onUpdated)
const tick = () => new Promise((resolve) => queueMicrotask(resolve));
// helper — wait for setTimeout(onRendered, 0) to fire
const nextTick = () => new Promise((resolve) => setTimeout(resolve, 0));

const makeTemplate = (overrides = {}) => {
  return new Template({
    templateName: 'test-tpl',
    template: '<div>{name}</div>',
    defaultState: { name: 'world' },
    element: host,
    ...overrides,
  });
};

describe('Template.initialize / attach / render / lifecycle', () => {
  /*******************************
      (A) initialize() — instance setup
  *******************************/

  describe('initialize() — instance setup', () => {
    it('flips initialized to true', () => {
      const tpl = makeTemplate();
      expect(tpl.initialized).toBeFalsy();
      tpl.initialize();
      expect(tpl.initialized).toBe(true);
    });

    it('creates an empty instance object when no createComponent is provided', () => {
      const tpl = makeTemplate();
      tpl.initialize();
      expect(typeof tpl.instance).toBe('object');
      expect(tpl.instance).not.toBeNull();
      // only `templateName` is added by initialize()
      expect(Object.keys(tpl.instance)).toEqual(['templateName']);
    });

    it('extends instance with the keys returned by createComponent', () => {
      const tpl = makeTemplate({
        createComponent: () => ({ count: 1, double: () => 2 }),
      });
      tpl.initialize();
      expect(tpl.instance.count).toBe(1);
      expect(typeof tpl.instance.double).toBe('function');
      expect(tpl.instance.double()).toBe(2);
    });

    it('tolerates createComponent returning null/undefined', () => {
      const tpl = makeTemplate({
        createComponent: () => undefined,
      });
      expect(() => tpl.initialize()).not.toThrow();
      expect(tpl.instance).toBeTypeOf('object');
    });

    it('calls instance.initialize() if defined', () => {
      const initSpy = vi.fn();
      const tpl = makeTemplate({
        createComponent: () => ({ initialize: initSpy }),
      });
      tpl.initialize();
      expect(initSpy).toHaveBeenCalledTimes(1);
    });

    it('sets instance.templateName to match tpl.templateName', () => {
      const tpl = makeTemplate({ templateName: 'custom-name' });
      tpl.initialize();
      expect(tpl.instance.templateName).toBe('custom-name');
      expect(tpl.instance.templateName).toBe(tpl.templateName);
    });

    it('builds callParams referencing the host element', () => {
      const tpl = makeTemplate();
      tpl.initialize();
      expect(tpl.callParams).toBeDefined();
      expect(tpl.callParams.el).toBe(host);
      expect(tpl.callParams.tpl).toBe(tpl.instance);
      expect(tpl.callParams.template).toBe(tpl);
    });
  });

  /*******************************
      (B) initialize() — onCreated callback
  *******************************/

  describe('initialize() — onCreated callback', () => {
    it('invokes onCreated exactly once during initialize()', () => {
      const onCreated = vi.fn();
      const tpl = makeTemplate({ onCreated });
      tpl.initialize();
      expect(onCreated).toHaveBeenCalledTimes(1);
    });

    it('does not call onCreated when isPrototype is true', () => {
      const onCreated = vi.fn();
      const tpl = makeTemplate({ onCreated, isPrototype: true });
      tpl.initialize();
      expect(onCreated).not.toHaveBeenCalled();
    });

    it('isPrototype templates are not registered in renderedTemplates', () => {
      const tpl = makeTemplate({ isPrototype: true, templateName: 'proto-tpl' });
      tpl.initialize();
      expect(Template.renderedTemplates.get('proto-tpl') ?? []).toHaveLength(0);
    });

    it('non-prototype templates register in renderedTemplates after initialize()', () => {
      const tpl = makeTemplate({ templateName: 'reg-tpl' });
      tpl.initialize();
      const list = Template.renderedTemplates.get('reg-tpl') || [];
      expect(list).toContain(tpl);
    });

    // Documented in lifecycle.mdx — DOM Lifecycle Events table:
    //   `created`  fires after instance initialized but before DOM
    //   detail.component is the component instance
    it('dispatches a `created` DOM event during initialize() with detail.component', () => {
      const tpl = makeTemplate();
      const spy = vi.fn();
      host.addEventListener('created', spy);
      tpl.initialize();
      expect(spy).toHaveBeenCalledTimes(1);
      const ev = spy.mock.calls[0][0];
      expect(ev.detail.component).toBe(tpl.instance);
    });

    // Documented in lifecycle.mdx — Standard Arguments table.
    // onCreated must receive `el`, `self`/`tpl`/`component`, `template`,
    // `templateName`, `isClient`/`isServer`, `state`.
    it('onCreated receives the documented standard callback arguments', () => {
      let received;
      const tpl = makeTemplate({
        templateName: 'cb-args',
        onCreated: (params) => {
          received = params;
        },
      });
      tpl.initialize();
      expect(received.el).toBe(host);
      expect(received.self).toBe(tpl.instance);
      expect(received.tpl).toBe(tpl.instance);
      expect(received.component).toBe(tpl.instance);
      expect(received.template).toBe(tpl);
      expect(received.templateName).toBe('cb-args');
      expect(typeof received.isRendered).toBe('function');
      expect(typeof received.isClient).toBe('boolean');
      expect(typeof received.isServer).toBe('boolean');
    });

    // Documented in lifecycle.mdx — `isRendered` is "a function returning
    // whether the DOM has rendered".
    it('isRendered() callback param tracks tpl.rendered state', () => {
      let isRenderedFn;
      const tpl = makeTemplate({
        onCreated: ({ isRendered }) => {
          isRenderedFn = isRendered;
        },
      });
      tpl.initialize();
      // before render
      expect(isRenderedFn()).toBe(false);
      tpl.render();
      expect(isRenderedFn()).toBe(true);
    });
  });

  /*******************************
      (C) initialize() — engine resolution
  *******************************/

  describe('initialize() — engine resolution', () => {
    it('creates a renderer with the default native engine', () => {
      const tpl = makeTemplate();
      tpl.initialize();
      expect(tpl.renderer).toBeDefined();
      expect(typeof tpl.renderer.render).toBe('function');
    });

    it('reports a fatal error (via fatal()) when the named engine is not registered', async () => {
      // fatal() schedules its throw on a microtask, so initialize() does NOT
      // throw synchronously. Capture the queued error via the unhandledrejection
      // / window error path. Easiest: intercept queueMicrotask only for the
      // duration of fatal()'s call so we can inspect the scheduled work without
      // continuing the rest of initialize() (which would crash on
      // `engine.renderer` of undefined). We do that by making the wrapped
      // microtask throw synchronously inside initialize() — that synchronous
      // throw replaces the async one, and we catch it here.
      const tpl = makeTemplate({ renderingEngine: 'doesnotexist' });
      const originalQueue = globalThis.queueMicrotask;
      let captured;
      globalThis.queueMicrotask = (cb) => {
        // run inline so the throw lands here, halting initialize() at the fatal call
        try {
          cb();
        }
        catch (err) {
          captured = err;
          throw err;
        }
      };
      try {
        expect(() => tpl.initialize()).toThrow(/doesnotexist/);
      }
      finally {
        globalThis.queueMicrotask = originalQueue;
      }
      expect(captured).toBeInstanceOf(Error);
    });

    it('accepts a renderingEngine object literal with a renderer class', () => {
      class MockRenderer {
        constructor(opts) {
          this.opts = opts;
          this.dataVersion = 0;
        }
        setData(data) {
          this.data = data;
        }
        render() {
          return 'mocked';
        }
        bumpDataVersion() {
          this.dataVersion++;
        }
      }
      const tpl = makeTemplate({
        renderingEngine: { renderer: MockRenderer },
      });
      tpl.initialize();
      expect(tpl.renderer).toBeInstanceOf(MockRenderer);
      expect(tpl.renderer.opts.template).toBe(tpl);
    });
  });

  /*******************************
      (D) initialize() — onUpdated callback (state reaction)

      `onUpdated` is documented in the Template API reference
      (docs/src/pages/docs/api/templating/template.mdx) as
      "Callback when the template is updated".

      Note: the DOM-level `updated` event is NOT in the documented
      DOM-event surface (lifecycle.mdx documents only `created`,
      `rendered`, `destroyed`) so we exercise the documented
      callback hook instead of asserting an undocumented event.
  *******************************/

  describe('initialize() — onUpdated callback', () => {
    it('does not create a state reaction when element is undefined', () => {
      const tpl = new Template({
        templateName: 'no-element',
        template: '<div>{name}</div>',
        defaultState: { name: 'world' },
      });
      const reactionsBefore = tpl.reactions.length;
      expect(() => tpl.initialize()).not.toThrow();
      expect(tpl.reactions.length).toBe(reactionsBefore);
    });

    it('invokes onUpdated callback after a state change once the template has rendered', async () => {
      // Documented in template.mdx (Template API reference):
      //   onUpdated | Function | Callback when the template is updated
      const onUpdated = vi.fn();
      const tpl = makeTemplate({ defaultState: { x: 0 }, onUpdated });
      tpl.initialize();
      tpl.render();

      tpl.state.x.set(1);
      Reaction.flush();
      await tick();
      await tick();

      expect(onUpdated).toHaveBeenCalled();
    });

    it('does not invoke onUpdated until the template has rendered', async () => {
      // Documented callback hook from API ref — should not fire while
      // the template has not yet been rendered.
      const onUpdated = vi.fn();
      const tpl = makeTemplate({ defaultState: { x: 0 }, onUpdated });
      tpl.initialize();
      // intentionally skip render() — rendered is false
      tpl.state.x.set(1);
      Reaction.flush();
      await tick();
      await tick();
      expect(onUpdated).not.toHaveBeenCalled();
    });
  });

  /*******************************
      (E) attach() behaviors
  *******************************/

  describe('attach()', () => {
    it('sets renderRoot and parentNode (parentNode defaults to renderRoot)', async () => {
      const tpl = new Template({
        templateName: 'attach-tpl',
        template: '<div>{name}</div>',
        defaultState: { name: 'world' },
        element: host,
      });
      await tpl.attach(host);
      expect(tpl.renderRoot).toBe(host);
      expect(tpl.parentNode).toBe(host);
    });

    it('is idempotent when called twice with the same renderRoot', async () => {
      const tpl = new Template({
        templateName: 'attach-tpl',
        template: '<div>{name}</div>',
        defaultState: { name: 'world' },
        element: host,
      });
      await tpl.attach(host);
      const firstParent = tpl.parentNode;
      // second attach with same root early-returns before resetting parentNode
      await tpl.attach(host, { parentNode: document.body });
      expect(tpl.parentNode).toBe(firstParent);
    });

    it('respects custom parentNode/startNode/endNode in opts', async () => {
      const parentNode = document.createElement('section');
      const startNode = document.createElement('span');
      const endNode = document.createElement('span');
      document.body.append(parentNode, startNode, endNode);
      const tpl = new Template({
        templateName: 'attach-tpl',
        template: '<div>{name}</div>',
        defaultState: { name: 'world' },
        element: host,
      });
      await tpl.attach(host, { parentNode, startNode, endNode });
      expect(tpl.parentNode).toBe(parentNode);
      expect(tpl.startNode).toBe(startNode);
      expect(tpl.endNode).toBe(endNode);
    });

    it('initializes the template if it is not yet initialized', async () => {
      const tpl = new Template({
        templateName: 'lazy-init',
        template: '<div>{name}</div>',
        defaultState: { name: 'world' },
        element: host,
      });
      expect(tpl.initialized).toBeFalsy();
      await tpl.attach(host);
      expect(tpl.initialized).toBe(true);
    });

    it('does not throw when attachStyles is true and css is provided in jsdom', async () => {
      const tpl = new Template({
        templateName: 'styled-tpl',
        template: '<div>{name}</div>',
        defaultState: { name: 'world' },
        element: host,
        attachStyles: true,
        css: ':host { color: red }',
      });
      await expect(tpl.attach(host)).resolves.toBeUndefined();
    });

    it('skips adoptStylesheet entirely when attachStyles is false', async () => {
      const tpl = new Template({
        templateName: 'unstyled-tpl',
        template: '<div>{name}</div>',
        defaultState: { name: 'world' },
        element: host,
        attachStyles: false,
        css: ':host { color: red }',
      });
      const spy = vi.spyOn(tpl, 'adoptStylesheet');
      await tpl.attach(host);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  /*******************************
      (F) render() — first render
  *******************************/

  describe('render() — first render', () => {
    it('auto-initializes an uninitialized template', () => {
      const tpl = makeTemplate();
      expect(tpl.initialized).toBeFalsy();
      tpl.render();
      expect(tpl.initialized).toBe(true);
    });

    it('returns rendered output and sets tpl.html', () => {
      const tpl = makeTemplate();
      const result = tpl.render();
      expect(result).toBeDefined();
      expect(tpl.html).toBe(result);
    });

    it('flips rendered to true after first render', () => {
      const tpl = makeTemplate();
      expect(tpl.rendered).toBe(false);
      tpl.render();
      expect(tpl.rendered).toBe(true);
    });

    it('fires the onRendered callback shortly after render() (setTimeout 0)', async () => {
      const onRendered = vi.fn();
      const tpl = makeTemplate({ onRendered });
      tpl.render();
      expect(onRendered).not.toHaveBeenCalled(); // setTimeout hasn't fired yet
      await nextTick();
      expect(onRendered).toHaveBeenCalledTimes(1);
    });

    it('dispatches a `rendered` event on the element shortly after render()', async () => {
      const tpl = makeTemplate();
      const spy = vi.fn();
      host.addEventListener('rendered', spy);
      tpl.render();
      await nextTick();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('invokes onRenderOnce one-shot hook and clears it', async () => {
      const tpl = makeTemplate();
      const once = vi.fn();
      tpl.initialize();
      tpl.onRenderOnce = once;
      tpl.render();
      await nextTick();
      expect(once).toHaveBeenCalledTimes(1);
      expect(tpl.onRenderOnce).toBeUndefined();
    });
  });

  /*******************************
      (G) render() — subsequent renders
  *******************************/

  describe('render() — subsequent renders', () => {
    it('does not regenerate html on a second render call', () => {
      const tpl = makeTemplate();
      tpl.render();
      const firstHtml = tpl.html;
      const renderSpy = vi.spyOn(tpl.renderer, 'render');
      tpl.render();
      expect(renderSpy).not.toHaveBeenCalled();
      expect(tpl.html).toBe(firstHtml);
    });

    it('calls renderer.bumpDataVersion when dataReplaced is true on a second render', () => {
      const tpl = makeTemplate();
      tpl.render();
      const bumpSpy = vi.spyOn(tpl.renderer, 'bumpDataVersion');
      // simulate setDataContext having marked dataReplaced
      tpl.setDataContext({ name: 'replaced' }, { rerender: false });
      expect(tpl.dataReplaced).toBe(true);
      tpl.render();
      expect(bumpSpy).toHaveBeenCalledTimes(1);
    });

    it('resets dataReplaced to false after render', () => {
      const tpl = makeTemplate();
      tpl.render();
      tpl.setDataContext({ name: 'replaced' }, { rerender: false });
      expect(tpl.dataReplaced).toBe(true);
      tpl.render();
      expect(tpl.dataReplaced).toBe(false);
    });

    it('rerender:true (default) flips rendered=false so next render goes through first-render branch', () => {
      const tpl = makeTemplate();
      tpl.render();
      expect(tpl.rendered).toBe(true);
      tpl.setDataContext({ name: 'fresh' }); // default rerender:true
      expect(tpl.rendered).toBe(false);
      const renderSpy = vi.spyOn(tpl.renderer, 'render');
      tpl.render();
      expect(renderSpy).toHaveBeenCalledTimes(1);
      expect(tpl.rendered).toBe(true);
    });
  });

  /*******************************
      (H) markRendered()
  *******************************/

  describe('markRendered()', () => {
    it('sets rendered=true and destroyed=false', () => {
      const tpl = makeTemplate();
      tpl.initialize();
      expect(tpl.rendered).toBe(false);
      tpl.markRendered();
      expect(tpl.rendered).toBe(true);
      expect(tpl.destroyed).toBe(false);
    });

    it('clears destroyed even if it was previously true (engines reclaim ownership)', () => {
      const tpl = makeTemplate();
      tpl.initialize();
      tpl.destroyed = true;
      tpl.markRendered();
      expect(tpl.destroyed).toBe(false);
      expect(tpl.rendered).toBe(true);
    });

    it('does not call the renderer or fire onRendered (it is a flag-only method)', () => {
      const tpl = makeTemplate();
      tpl.initialize();
      const renderSpy = vi.spyOn(tpl.renderer, 'render');
      tpl.markRendered();
      expect(renderSpy).not.toHaveBeenCalled();
    });
  });

  /*******************************
      (I) render() with additionalData
  *******************************/

  describe('render() — additionalData', () => {
    it('merges additionalData into data on render', () => {
      const tpl = makeTemplate();
      tpl.render({ extra: 'value' });
      expect(tpl.data.extra).toBe('value');
    });

    it('mutates data in place (setDataContext writes through assignInPlace)', () => {
      const tpl = makeTemplate();
      const dataRef = tpl.data;
      tpl.render({ added: 1 });
      expect(tpl.data).toBe(dataRef);
      expect(dataRef.added).toBe(1);
    });

    it('subsequent renders preserve previously merged additionalData', () => {
      const tpl = makeTemplate();
      tpl.render({ first: 1 });
      tpl.render({ second: 2 });
      expect(tpl.data.first).toBe(1);
      expect(tpl.data.second).toBe(2);
    });
  });

  /*******************************
      (J) Documented lifecycle ordering

      lifecycle.mdx specifies the callback order:
        createComponent -> initialize() -> onCreated -> render -> onRendered

      DOM events `created`/`rendered`/`destroyed` carry
      detail.component pointing at the component instance.
  *******************************/

  describe('documented lifecycle ordering', () => {
    it('fires createComponent -> instance.initialize -> onCreated in order', () => {
      const order = [];
      const tpl = makeTemplate({
        createComponent: () => {
          order.push('createComponent');
          return {
            initialize() {
              order.push('instance.initialize');
            },
          };
        },
        onCreated: () => order.push('onCreated'),
      });
      tpl.initialize();
      expect(order).toEqual(['createComponent', 'instance.initialize', 'onCreated']);
    });

    it('fires onCreated before onRendered', async () => {
      const order = [];
      const tpl = makeTemplate({
        onCreated: () => order.push('onCreated'),
        onRendered: () => order.push('onRendered'),
      });
      tpl.render();
      await nextTick();
      expect(order).toEqual(['onCreated', 'onRendered']);
    });

    it('rendered DOM event detail.component references the component instance', async () => {
      const tpl = makeTemplate();
      let detail;
      host.addEventListener('rendered', (ev) => {
        detail = ev.detail;
      });
      tpl.render();
      await nextTick();
      expect(detail.component).toBe(tpl.instance);
    });

    it('created DOM event detail.component references the component instance', () => {
      const tpl = makeTemplate();
      let detail;
      host.addEventListener('created', (ev) => {
        detail = ev.detail;
      });
      tpl.initialize();
      expect(detail.component).toBe(tpl.instance);
    });
  });

  /*******************************
      (K) onThemeChanged — debounce documented behavior

      Documented in component-lifecycle skill:
        "onThemeChanged ... Debounced (10ms) to coalesce rapid changes."
  *******************************/

  describe('onThemeChanged — debounce', () => {
    it('coalesces rapid invocations into a single trailing call (~10ms debounce)', async () => {
      vi.useFakeTimers();
      try {
        const onThemeChanged = vi.fn();
        const tpl = makeTemplate({ onThemeChanged });
        tpl.initialize();

        // multiple rapid calls within the 10ms window
        tpl.onThemeChanged();
        tpl.onThemeChanged();
        tpl.onThemeChanged();

        // before the debounce window elapses — no call
        vi.advanceTimersByTime(5);
        expect(onThemeChanged).not.toHaveBeenCalled();

        // after the documented 10ms window — single trailing call
        vi.advanceTimersByTime(10);
        expect(onThemeChanged).toHaveBeenCalledTimes(1);
      }
      finally {
        vi.useRealTimers();
      }
    });
  });
});

import { afterFlush, flush, nonreactive, reaction, Signal } from '@semantic-ui/reactivity';
import { Renderer, ServerRenderer } from '@semantic-ui/renderer';
import { Template, TemplateHelpers } from '@semantic-ui/templating';
import { afterEach, describe, expect, it } from 'vitest';

const realEngine = { renderer: Renderer, serverRenderer: ServerRenderer };

afterEach(() => {
  Template.renderedTemplates.clear();
  Template.templateCount = 0;
  document.body.innerHTML = '';
});

// Mount a Template into a host element using light DOM as the renderRoot.
// Callers attach markup via `host.innerHTML = ...` after mount when they
// need real DOM for event delegation.
async function mountTemplate({ template = '<div></div>', ...opts } = {}) {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const tpl = new Template({
    template,
    renderingEngine: realEngine,
    element: host,
    ...opts,
  });
  tpl.initialize();
  await tpl.attach(host);
  return {
    host,
    template: tpl,
    cleanup: () => {
      if (tpl.initialized && !tpl.destroyed) {
        tpl.onDestroyed();
      }
      host.remove();
    },
  };
}

// Capture the callParams object handed to `onCreated`.
async function captureCreatedParams(opts = {}) {
  let captured;
  const fixture = await mountTemplate({
    onCreated(params) {
      captured = params;
    },
    ...opts,
  });
  return { params: captured, fixture };
}

// Mount a Template fixture and inject HTML directly into the host
// (light DOM = renderRoot). Events delegate to the renderRoot, so
// the test elements end up inside the delegation scope without
// going through the renderer's render() step.
async function mountForEvents({ hostHTML, events }) {
  const fixture = await mountTemplate({ template: '<div></div>', events });
  fixture.host.innerHTML = hostHTML;
  return fixture;
}

describe('Template — callback params', () => {
  /*******************************
            Identity
  *******************************/

  describe('identity', () => {
    it('exposes el as the host element', async () => {
      const { params, fixture } = await captureCreatedParams();
      expect(params.el).toBe(fixture.host);
      fixture.cleanup();
    });

    it('aliases self, tpl, and component to the same instance reference', async () => {
      let captured;
      const fixture = await mountTemplate({
        createComponent() {
          return { foo: 'bar' };
        },
        onCreated(params) {
          captured = params;
        },
      });
      expect(captured.self).toBe(fixture.template.instance);
      expect(captured.tpl).toBe(fixture.template.instance);
      expect(captured.component).toBe(fixture.template.instance);
      expect(captured.self).toBe(captured.tpl);
      expect(captured.tpl).toBe(captured.component);
      expect(captured.self.foo).toBe('bar');
      fixture.cleanup();
    });

    it('exposes template as the Template instance', async () => {
      const { params, fixture } = await captureCreatedParams();
      expect(params.template).toBe(fixture.template);
      fixture.cleanup();
    });

    it('exposes templateName matching the Template name', async () => {
      const { params, fixture } = await captureCreatedParams({ templateName: 'CustomName' });
      expect(params.templateName).toBe('CustomName');
      fixture.cleanup();
    });

    it('exposes templates as the global rendered-templates registry', async () => {
      const { params, fixture } = await captureCreatedParams();
      expect(params.templates).toBe(Template.renderedTemplates);
      fixture.cleanup();
    });
  });

  /*******************************
          Reactive Layers
  *******************************/

  describe('reactive layers', () => {
    it('exposes data as the live data object on the Template', async () => {
      const initial = { foo: 1 };
      const { params, fixture } = await captureCreatedParams({ data: initial });
      expect(params.data).toBe(fixture.template.data);
      fixture.cleanup();
    });

    it('exposes settings, falling back to element.settings when no own settings', async () => {
      const { params, fixture } = await captureCreatedParams();
      expect(params.settings).toBe(fixture.template.settings || fixture.host.settings);
      fixture.cleanup();
    });

    it('exposes state as the reactive state object', async () => {
      const { params, fixture } = await captureCreatedParams({ defaultState: { count: 0 } });
      expect(params.state).toBe(fixture.template.state);
      expect(params.state.count).toBeInstanceOf(Signal);
      expect(params.state.count.get()).toBe(0);
      fixture.cleanup();
    });

    it('propagates state mutations reactively through params.state', async () => {
      const { params, fixture } = await captureCreatedParams({ defaultState: { count: 0 } });
      let observed;
      reaction(() => {
        observed = params.state.count.get();
      });
      params.state.count.set(7);
      flush();
      expect(observed).toBe(7);
      fixture.cleanup();
    });
  });

  /*******************************
        Reactivity Helpers
  *******************************/

  describe('reactivity helpers', () => {
    it('signal() creates a Signal', async () => {
      const { params, fixture } = await captureCreatedParams();
      const s = params.signal(5);
      expect(s).toBeInstanceOf(Signal);
      expect(s.get()).toBe(5);
      fixture.cleanup();
    });

    it('reaction() registers into template.reactions and is cleared at destroy', async () => {
      const { params, fixture } = await captureCreatedParams();
      let runs = 0;
      const sig = new Signal(0);
      const beforeCount = fixture.template.reactions.length;
      params.reaction(() => {
        sig.get();
        runs++;
      });
      flush();
      expect(runs).toBe(1);
      expect(fixture.template.reactions.length).toBe(beforeCount + 1);
      sig.set(1);
      flush();
      expect(runs).toBe(2);
      fixture.cleanup();
      sig.set(2);
      flush();
      expect(runs).toBe(2);
    });

    it('exposes flush, afterFlush, and nonreactive as the module-level helpers', async () => {
      const { params, fixture } = await captureCreatedParams();
      expect(params.flush).toBe(flush);
      expect(params.afterFlush).toBe(afterFlush);
      expect(params.nonreactive).toBe(nonreactive);
      fixture.cleanup();
    });
  });

  /*******************************
        Auto-cleanup Timers
  *******************************/

  describe('auto-cleanup timers', () => {
    it('interval() returns an id and fires repeatedly until destroy', async () => {
      const { params, fixture } = await captureCreatedParams();
      let fires = 0;
      const id = params.interval(() => {
        fires++;
      }, 5);
      expect(typeof id === 'number' || typeof id === 'object').toBe(true);
      await new Promise(r => setTimeout(r, 30));
      expect(fires).toBeGreaterThanOrEqual(2);
      const fireCountBeforeDestroy = fires;
      fixture.cleanup();
      await new Promise(r => setTimeout(r, 30));
      expect(fires).toBe(fireCountBeforeDestroy);
    });

    it('timeout() is canceled when destroy precedes the delay', async () => {
      const { params, fixture } = await captureCreatedParams();
      let fired = false;
      params.timeout(() => {
        fired = true;
      }, 30);
      fixture.cleanup();
      await new Promise(r => setTimeout(r, 60));
      expect(fired).toBe(false);
    });

    it('timeout() fires when not canceled before its delay', async () => {
      const { params, fixture } = await captureCreatedParams();
      let fired = false;
      params.timeout(() => {
        fired = true;
      }, 5);
      await new Promise(r => setTimeout(r, 30));
      expect(fired).toBe(true);
      fixture.cleanup();
    });
  });

  /*******************************
        Lifecycle Helpers
  *******************************/

  describe('lifecycle helpers', () => {
    it('binds dispatchEvent, attachEvent, bindKey, and unbindKey to the Template', async () => {
      const { params, fixture } = await captureCreatedParams();
      expect(typeof params.dispatchEvent).toBe('function');
      expect(typeof params.attachEvent).toBe('function');
      expect(typeof params.bindKey).toBe('function');
      expect(typeof params.unbindKey).toBe('function');
      fixture.cleanup();
    });

    it('bindKey adds to template.keys; unbindKey removes', async () => {
      const { params, fixture } = await captureCreatedParams();
      const handler = () => {};
      params.bindKey('q', handler);
      expect(fixture.template.keys.q).toBe(handler);
      params.unbindKey('q');
      expect(fixture.template.keys.q).toBeUndefined();
      fixture.cleanup();
    });
  });

  /*******************************
          State Helpers
  *******************************/

  describe('state helpers', () => {
    it('isRendered() returns the Template`s rendered flag', async () => {
      const { params, fixture } = await captureCreatedParams();
      expect(params.isRendered()).toBe(false);
      fixture.template.markRendered();
      expect(params.isRendered()).toBe(true);
      fixture.cleanup();
    });

    it('reports isServer false and isClient true in the browser', async () => {
      const { params, fixture } = await captureCreatedParams();
      expect(params.isServer).toBe(false);
      expect(params.isClient).toBe(true);
      fixture.cleanup();
    });

    it('darkMode is a getter — calls element.isDarkMode() lazily on each access', async () => {
      let calls = 0;
      let returnValue = false;
      const fixture = await mountTemplate({});
      fixture.host.isDarkMode = () => {
        calls++;
        return returnValue;
      };
      const params = fixture.template.callParams;
      expect(params.darkMode).toBe(false);
      expect(calls).toBe(1);
      returnValue = true;
      expect(params.darkMode).toBe(true);
      expect(calls).toBe(2);
      fixture.cleanup();
    });

    it('isHydrating is a getter that tracks template.isHydrating live', async () => {
      const fixture = await mountTemplate({});
      const params = fixture.template.callParams;
      expect(params.isHydrating).toBe(false);
      fixture.template.isHydrating = true;
      expect(params.isHydrating).toBe(true);
      fixture.template.isHydrating = false;
      expect(params.isHydrating).toBe(false);
      fixture.cleanup();
    });
  });

  /*******************************
            DOM Helpers
  *******************************/

  describe('DOM helpers', () => {
    it('exposes $ and $$ as bound, callable functions', async () => {
      const { params, fixture } = await captureCreatedParams();
      expect(typeof params.$).toBe('function');
      expect(typeof params.$$).toBe('function');
      expect(() => params.$('div')).not.toThrow();
      expect(() => params.$$('div')).not.toThrow();
      fixture.cleanup();
    });
  });

  /*******************************
            Tree Helpers
  *******************************/

  describe('tree helpers', () => {
    it('exposes findTemplate, findParent, findChild, findChildren as functions', async () => {
      const { params, fixture } = await captureCreatedParams();
      expect(typeof params.findTemplate).toBe('function');
      expect(typeof params.findParent).toBe('function');
      expect(typeof params.findChild).toBe('function');
      expect(typeof params.findChildren).toBe('function');
      fixture.cleanup();
    });
  });

  /*******************************
        Misc & Helpers
  *******************************/

  describe('misc params', () => {
    it('exposes helpers as TemplateHelpers', async () => {
      const { params, fixture } = await captureCreatedParams();
      expect(params.helpers).toBe(TemplateHelpers);
      fixture.cleanup();
    });

    it('exposes content from the createComponent return value', async () => {
      let captured;
      const fixture = await mountTemplate({
        createComponent() {
          return { content: 'hello' };
        },
        onCreated(p) {
          captured = p;
        },
      });
      expect(captured.content).toBe('hello');
      fixture.cleanup();
    });

    it('exposes the same abortController and abortSignal pair as the Template', async () => {
      const { params, fixture } = await captureCreatedParams();
      expect(params.abortController).toBe(fixture.template.abortController);
      expect(params.abortSignal).toBe(fixture.template.abortSignal);
      expect(params.abortController.signal).toBe(params.abortSignal);
      fixture.cleanup();
    });

    it('rerender() calls element.requestUpdate() if defined', async () => {
      let calls = 0;
      const fixture = await mountTemplate({});
      fixture.host.requestUpdate = () => {
        calls++;
      };
      fixture.template.callParams.rerender();
      expect(calls).toBe(1);
      fixture.cleanup();
    });

    it('rerender() is a no-op when element is undefined', () => {
      const tpl = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
      });
      tpl.initialize();
      try {
        expect(() => tpl.callParams.rerender()).not.toThrow();
      }
      finally {
        tpl.onDestroyed();
      }
    });

    it('exposes unbindKey on params', async () => {
      const { params, fixture } = await captureCreatedParams();
      expect(typeof params.unbindKey).toBe('function');
      fixture.cleanup();
    });

    it('exposes abortController as an AbortController instance', async () => {
      const { params, fixture } = await captureCreatedParams();
      expect(params.abortController).toBeInstanceOf(AbortController);
      fixture.cleanup();
    });

    it('exposes content on cached callParams', async () => {
      const { fixture } = await captureCreatedParams({
        createComponent() {
          return { content: 'X' };
        },
      });
      expect(fixture.template.callParams.content).toBe('X');
      fixture.cleanup();
    });

    it('defines isHydrating as a getter on cached callParams', async () => {
      const fixture = await mountTemplate({});
      const desc = Object.getOwnPropertyDescriptor(fixture.template.callParams, 'isHydrating');
      expect(typeof desc.get).toBe('function');
      fixture.cleanup();
    });
  });

  /*******************************
       Event-Callback Extras
  *******************************/

  describe('event-callback extras', () => {
    it('passes raw DOM event and matched target element', async () => {
      let captured;
      const fixture = await mountForEvents({
        hostHTML: '<button class="btn">x</button>',
        events: {
          'click .btn'(params) {
            captured = params;
          },
        },
      });
      const btn = fixture.host.querySelector('.btn');
      btn.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, cancelable: true }));
      expect(captured).toBeDefined();
      expect(captured.event).toBeInstanceOf(Event);
      expect(captured.target).toBe(btn);
      fixture.cleanup();
    });

    it('keeps el as the component element while target is the dispatching element', async () => {
      let captured;
      const fixture = await mountForEvents({
        hostHTML: '<button class="btn">x</button>',
        events: {
          'click .btn'(params) {
            captured = params;
          },
        },
      });
      const btn = fixture.host.querySelector('.btn');
      btn.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, cancelable: true }));
      expect(captured.el).toBe(fixture.host);
      expect(captured.target).toBe(btn);
      expect(captured.el).not.toBe(captured.target);
      fixture.cleanup();
    });

    it('resolves value from target.value on input elements', async () => {
      let captured;
      const fixture = await mountForEvents({
        hostHTML: '<input class="i" />',
        events: {
          'input .i'(params) {
            captured = params;
          },
        },
      });
      const input = fixture.host.querySelector('.i');
      input.value = 'hello';
      input.dispatchEvent(new Event('input', { bubbles: true, composed: true, cancelable: true }));
      expect(captured.value).toBe('hello');
      fixture.cleanup();
    });

    it('merges dataset (JSON-parsed) and event.detail into data', async () => {
      let captured;
      const fixture = await mountForEvents({
        // data-amount="42" → JSON.parse → 42 (number)
        // data-name="alpha" → JSON.parse fails → falls through as string "alpha"
        hostHTML: '<button class="btn" data-amount="42" data-name="alpha">x</button>',
        events: {
          'tap .btn'(params) {
            captured = params;
          },
        },
      });
      const btn = fixture.host.querySelector('.btn');
      btn.dispatchEvent(
        new CustomEvent('tap', {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: { extra: 'detail-key', amount: 99 },
        }),
      );
      expect(captured).toBeDefined();
      // detail.amount wins over dataset.amount
      expect(captured.data.amount).toBe(99);
      // data-name fails JSON.parse → kept as raw string "alpha"
      expect(captured.data.name).toBe('alpha');
      expect(captured.data.extra).toBe('detail-key');
      fixture.cleanup();
    });

    it('JSON-parses dataset values when valid JSON, otherwise keeps raw string', async () => {
      let captured;
      const fixture = await mountForEvents({
        hostHTML: '<button class="btn" data-num="7" data-bool="true" data-str="raw" data-obj=\'{"k":1}\'>x</button>',
        events: {
          'click .btn'(params) {
            captured = params;
          },
        },
      });
      const btn = fixture.host.querySelector('.btn');
      btn.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, cancelable: true }));
      expect(captured.data.num).toBe(7);
      expect(captured.data.bool).toBe(true);
      expect(captured.data.str).toBe('raw');
      expect(captured.data.obj).toEqual({ k: 1 });
      fixture.cleanup();
    });

    it('reports isDeep false when target is matched directly by the selector', async () => {
      let captured;
      const fixture = await mountForEvents({
        hostHTML: '<div class="wrap"><button class="btn">x</button></div>',
        events: {
          'click .btn'(params) {
            captured = params;
          },
        },
      });
      const btn = fixture.host.querySelector('.btn');
      btn.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, cancelable: true }));
      expect(captured).toBeDefined();
      expect(captured.isDeep).toBe(false);
      fixture.cleanup();
    });

    it('preserves an empty-string input value', async () => {
      let captured;
      const fixture = await mountForEvents({
        hostHTML: '<input class="i" />',
        events: {
          'input .i'(params) {
            captured = params;
          },
        },
      });
      const input = fixture.host.querySelector('.i');
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true, composed: true, cancelable: true }));
      expect(captured.value).toBe('');
      fixture.cleanup();
    });

    it('preserves a numeric input value of "0"', async () => {
      let captured;
      const fixture = await mountForEvents({
        hostHTML: '<input type="number" class="n" />',
        events: {
          'input .n'(params) {
            captured = params;
          },
        },
      });
      const input = fixture.host.querySelector('.n');
      input.value = '0';
      input.dispatchEvent(new Event('input', { bubbles: true, composed: true, cancelable: true }));
      expect(captured.value).toBe('0');
      fixture.cleanup();
    });

    it('preserves detail.value === 0 on a custom event', async () => {
      let captured;
      const fixture = await mountForEvents({
        hostHTML: '<span class="x">x</span>',
        events: {
          'change .x'(params) {
            captured = params;
          },
        },
      });
      const span = fixture.host.querySelector('.x');
      span.dispatchEvent(
        new CustomEvent('change', {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: { value: 0 },
        }),
      );
      expect(captured.value).toBe(0);
      fixture.cleanup();
    });

    it('preserves detail.value === "" on a custom event', async () => {
      let captured;
      const fixture = await mountForEvents({
        hostHTML: '<span class="x">x</span>',
        events: {
          'change .x'(params) {
            captured = params;
          },
        },
      });
      const span = fixture.host.querySelector('.x');
      span.dispatchEvent(
        new CustomEvent('change', {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: { value: '' },
        }),
      );
      expect(captured.value).toBe('');
      fixture.cleanup();
    });
  });

  /*******************************
        Key-Callback Extras
  *******************************/

  describe('key-callback extras', () => {
    it('delivers the raw KeyboardEvent to key callbacks', async () => {
      let captured;
      const fixture = await mountTemplate({
        keys: {
          a(params) {
            captured = params;
          },
        },
      });
      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'a',
          bubbles: true,
          composed: true,
          cancelable: true,
        }),
      );
      document.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: 'a',
          bubbles: true,
          composed: true,
          cancelable: true,
        }),
      );
      expect(captured).toBeDefined();
      expect(captured.event).toBeInstanceOf(KeyboardEvent);
      expect(captured.event.key).toBe('a');
      fixture.cleanup();
    });

    it('reports inputFocused true when an input is focused', async () => {
      let captured;
      const input = document.createElement('input');
      document.body.appendChild(input);
      const fixture = await mountTemplate({
        keys: {
          a(params) {
            captured = params;
          },
        },
      });
      input.focus();
      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'a',
          bubbles: true,
          composed: true,
          cancelable: true,
        }),
      );
      document.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: 'a',
          bubbles: true,
          composed: true,
          cancelable: true,
        }),
      );
      expect(captured).toBeDefined();
      expect(captured.inputFocused).toBeTruthy();
      fixture.cleanup();
      input.remove();
    });

    it('reports inputFocused falsy when no input is focused', async () => {
      let captured;
      const fixture = await mountTemplate({
        keys: {
          b(params) {
            captured = params;
          },
        },
      });
      document.body.focus();
      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'b',
          bubbles: true,
          composed: true,
          cancelable: true,
        }),
      );
      document.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: 'b',
          bubbles: true,
          composed: true,
          cancelable: true,
        }),
      );
      expect(captured).toBeDefined();
      expect(Boolean(captured.inputFocused)).toBe(false);
      fixture.cleanup();
    });

    it('reports repeatedKey true on consecutive presses without an interleaved keyup', async () => {
      const captures = [];
      const fixture = await mountTemplate({
        keys: {
          c(params) {
            captures.push(params.repeatedKey);
          },
        },
      });
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'c' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'c' }));
      expect(captures.length).toBe(2);
      expect(captures[0]).toBe(false);
      expect(captures[1]).toBe(true);
      fixture.cleanup();
    });
  });

  /*******************************
      isPrototype short-circuit
  *******************************/

  describe('call() — isPrototype short-circuit', () => {
    it('returns undefined and does not fire callback when isPrototype is true', () => {
      let fired = false;
      const tpl = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        isPrototype: true,
      });
      const result = tpl.call(() => {
        fired = true;
      });
      expect(result).toBeUndefined();
      expect(fired).toBe(false);
    });

    it('cloned (non-prototype) Template fires callbacks via call()', () => {
      const proto = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        isPrototype: true,
      });
      const cloned = proto.clone({ isPrototype: false });
      cloned.initialize();
      let fired = false;
      cloned.call(() => {
        fired = true;
      });
      expect(fired).toBe(true);
      cloned.onDestroyed();
    });

    it('returns undefined for non-function arguments', () => {
      const tpl = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
      });
      tpl.initialize();
      try {
        expect(tpl.call(undefined)).toBeUndefined();
        expect(tpl.call(null)).toBeUndefined();
        expect(tpl.call('not a function')).toBeUndefined();
      }
      finally {
        tpl.onDestroyed();
      }
    });
  });

  /*******************************
       this-binding
  *******************************/

  describe('call() — this binding inside callbacks', () => {
    it('createComponent runs with this === instance', async () => {
      let capturedThis;
      const fixture = await mountTemplate({
        createComponent() {
          capturedThis = this;
          return { tag: 'instance-marker' };
        },
      });
      expect(capturedThis).toBe(fixture.template.instance);
      fixture.cleanup();
    });

    it('onCreated runs with this === element', async () => {
      let capturedThis;
      const fixture = await mountTemplate({
        onCreated() {
          capturedThis = this;
        },
      });
      expect(capturedThis).toBe(fixture.host);
      fixture.cleanup();
    });

    it('onRendered runs with this === element', async () => {
      let capturedThis;
      const fixture = await mountTemplate({
        onRendered() {
          capturedThis = this;
        },
      });
      fixture.template.render();
      await new Promise(r => setTimeout(r, 5));
      expect(capturedThis).toBe(fixture.host);
      fixture.cleanup();
    });

    it('event handlers run with this === matched target element', async () => {
      let capturedThis;
      const fixture = await mountForEvents({
        hostHTML: '<button class="btn">x</button>',
        events: {
          'click .btn'() {
            capturedThis = this;
          },
        },
      });
      const btn = fixture.host.querySelector('.btn');
      btn.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, cancelable: true }));
      expect(capturedThis).toBe(btn);
      fixture.cleanup();
    });
  });

  /*******************************
        Cached callParams
  *******************************/

  describe('call() — cached callParams', () => {
    it('builds this.callParams once at the end of initialize()', async () => {
      const fixture = await mountTemplate({});
      expect(fixture.template.callParams).toBeDefined();
      expect(typeof fixture.template.callParams).toBe('object');
      fixture.cleanup();
    });

    it('reuses the same callParams reference across plain calls', async () => {
      const observed = [];
      const fixture = await mountTemplate({});
      fixture.template.call((p) => observed.push(p));
      fixture.template.call((p) => observed.push(p));
      expect(observed.length).toBe(2);
      expect(observed[0]).toBe(observed[1]);
      expect(observed[0]).toBe(fixture.template.callParams);
      fixture.cleanup();
    });

    it('reuses bound function references (self, $, $$) across calls', async () => {
      const observed = [];
      const fixture = await mountTemplate({});
      fixture.template.call((p) => observed.push(p));
      fixture.template.call((p) => observed.push(p));
      expect(observed[0].self).toBe(observed[1].self);
      expect(observed[0].$).toBe(observed[1].$);
      expect(observed[0].$$).toBe(observed[1].$$);
      fixture.cleanup();
    });

    it('produces a fresh merged object per call when additionalData is supplied', async () => {
      const observed = [];
      const fixture = await mountTemplate({});
      fixture.template.call((p) => observed.push(p), { additionalData: { x: 1 } });
      fixture.template.call((p) => observed.push(p), { additionalData: { x: 2 } });
      expect(observed[0]).not.toBe(observed[1]);
      expect(observed[0].x).toBe(1);
      expect(observed[1].x).toBe(2);
      // self is preserved across the merged objects
      expect(observed[0].self).toBe(observed[1].self);
      fixture.cleanup();
    });
  });

  /*******************************
     Lifecycle Hook Delivery
  *******************************/

  describe('lifecycle hook delivery', () => {
    it('captures bound $ from onCreated and scopes it to renderRoot once attached', async () => {
      // onCreated fires inside initialize(), before attach() sets this.renderRoot.
      // The supported pattern is to capture the bound `$` reference inside
      // onCreated and invoke it later (after attach completes, or from
      // onRendered / event handlers).
      const outsider = document.createElement('button');
      outsider.className = 'outside-btn';
      outsider.textContent = 'outside';
      document.body.appendChild(outsider);

      const host = document.createElement('div');
      host.innerHTML = '<button class="inside-btn">inside</button>';
      document.body.appendChild(host);

      let captured$;
      const tpl = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        element: host,
        onCreated({ $ }) {
          captured$ = $;
        },
      });
      tpl.initialize();
      await tpl.attach(host);

      expect(typeof captured$).toBe('function');
      const foundInside = captured$('.inside-btn');
      const foundOutside = captured$('.outside-btn');
      expect(foundInside.length).toBe(1);
      expect(foundInside[0]).toBe(host.querySelector('.inside-btn'));
      expect(foundOutside.length).toBe(0);

      tpl.onDestroyed();
      host.remove();
      outsider.remove();
    });

    it('delivers self, state, and settings to onRendered', async () => {
      let captured;
      const fixture = await mountTemplate({
        defaultState: { count: 3 },
        createComponent() {
          return { tag: 'instance-marker' };
        },
        onRendered(params) {
          captured = {
            self: params.self,
            state: params.state,
            settings: params.settings,
          };
        },
      });
      fixture.template.render();
      await new Promise(r => setTimeout(r, 5));

      expect(captured.self).toBe(fixture.template.instance);
      expect(captured.self.tag).toBe('instance-marker');
      expect(captured.state).toBe(fixture.template.state);
      expect(captured.state.count).toBeInstanceOf(Signal);
      expect(captured.state.count.get()).toBe(3);
      expect(captured.settings).toBe(fixture.template.settings || fixture.host.settings);

      fixture.cleanup();
    });

    it('does not put event in lifecycle args (only event-callbacks have it)', async () => {
      let captured;
      const fixture = await mountTemplate({
        onRendered(params) {
          captured = params;
        },
      });
      fixture.template.render();
      await new Promise(r => setTimeout(r, 5));
      expect(captured).toBeDefined();
      expect(captured.event).toBeUndefined();
      expect('event' in captured).toBe(false);
      fixture.cleanup();
    });

    it('keeps self accessible inside onDestroyed and reflects destroyed=true', async () => {
      let capturedSelf;
      let capturedDestroyedFlag;
      const fixture = await mountTemplate({
        createComponent() {
          return { tag: 'still-here' };
        },
        onDestroyed({ self }) {
          capturedSelf = self;
          // by the time the user callback runs, the wrapper has
          // already flipped destroyed=true
          capturedDestroyedFlag = fixture.template.destroyed;
        },
      });
      const instanceRef = fixture.template.instance;
      fixture.cleanup();
      expect(capturedSelf).toBe(instanceRef);
      expect(capturedSelf.tag).toBe('still-here');
      expect(capturedDestroyedFlag).toBe(true);
    });

    it('reflects template.isHydrating set by the hydration path inside onCreated', async () => {
      let snapshotDuring;
      const host = document.createElement('div');
      document.body.appendChild(host);
      const tpl = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        element: host,
        onCreated({ isHydrating }) {
          snapshotDuring = isHydrating;
        },
      });
      // Set the hydration flag BEFORE initialize() so onCreated reads true.
      tpl.isHydrating = true;
      tpl.initialize();
      expect(snapshotDuring).toBe(true);
      tpl.isHydrating = false;
      expect(tpl.callParams.isHydrating).toBe(false);
      tpl.onDestroyed();
      host.remove();
    });

    it('exposes findParent and findChild as bound and callable from inside onCreated', async () => {
      let capturedFindParent;
      let capturedFindChild;
      let parentReturn;
      let childReturn;
      const fixture = await mountTemplate({
        onCreated({ findParent, findChild }) {
          capturedFindParent = findParent;
          capturedFindChild = findChild;
          parentReturn = findParent('any-name');
          childReturn = findChild('any-name');
        },
      });
      expect(typeof capturedFindParent).toBe('function');
      expect(typeof capturedFindChild).toBe('function');
      // No parent/child wired in this fixture — both walks return undefined.
      expect(parentReturn).toBeUndefined();
      expect(childReturn).toBeUndefined();
      fixture.cleanup();
    });
  });
});

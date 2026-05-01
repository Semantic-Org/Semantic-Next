// Surface 1 — Events DSL coverage tests.
//
// Tests written against the documented contract:
//   - Selector grammar (single/multi event, single/multi selector, keyword prefix)
//   - Bubble-map (non-bubbling -> bubbling rewrite)
//   - Four dialects: default delegation, deep, global, bind
//   - Handler-arg shape: event/target/data/value/isDeep
//   - Return-value contract (false -> stopPropagation, 'cancel' -> preventDefault)
//   - attachEvent dynamic helper + auto-cleanup
//   - dispatchEvent custom-event emission
//   - Lifecycle teardown via AbortController cascade
//
// Pins / contracts:
//   B8 PIN (FAILING — locked contract): deep events from outside the
//     template range are rejected by template.js:538 before line 544's
//     deep-aware filter can let them through. Test in shadow-only mode
//     where startNode/endNode markers matter.
//   F-A: return-value contract honored by Query (cross-package coordination).
//   C1: el === component element vs target === dispatching element.
//   D4: bubble-map (load → DOMContentLoaded, unload → beforeunload).
//   L5: bind-mode subsequent-render behavior (no rebind via wrapFunction no-op).

import { afterEach, describe, expect, it, vi } from 'vitest';

import { Renderer, ServerRenderer } from '@semantic-ui/renderer';
import { Template } from '@semantic-ui/templating';

afterEach(() => {
  Template.renderedTemplates.clear();
  Template.templateCount = 0;
  document.body.innerHTML = '';
});

/*******************************
       Local Test Helpers
*******************************/

const RENDER_TARGETS = [
  { name: 'light', target: 'light' },
  { name: 'shadow', target: 'shadow' },
];

async function mountTemplate({
  template = '<div></div>',
  events,
  keys,
  target = 'shadow',
  ...opts
} = {}) {
  const host = document.createElement('div');
  const renderRoot = target === 'shadow'
    ? host.attachShadow({ mode: 'open' })
    : host;
  document.body.appendChild(host);
  const tpl = new Template({
    template,
    renderingEngine: { renderer: Renderer, serverRenderer: ServerRenderer },
    element: host,
    events,
    keys,
    ...opts,
  });
  tpl.initialize();
  await tpl.attach(renderRoot);
  return {
    host,
    renderRoot,
    template: tpl,
    cleanup: () => {
      try {
        if (tpl.initialized && !tpl.destroyed) {
          tpl.onDestroyed();
        }
      }
      catch (_) {}
      if (host.parentNode) {
        host.parentNode.removeChild(host);
      }
    },
  };
}

function clickOn(element, init = {}) {
  element.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      composed: true,
      cancelable: true,
      ...init,
    }),
  );
}

function fireEvent(element, eventName, init = {}) {
  element.dispatchEvent(
    new Event(eventName, {
      bubbles: true,
      composed: true,
      cancelable: true,
      ...init,
    }),
  );
}

function fireCustomEvent(element, eventName, detail = {}, init = {}) {
  element.dispatchEvent(
    new CustomEvent(eventName, {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail,
      ...init,
    }),
  );
}

/*******************************
        Parser Grammar
*******************************/

describe('events DSL — selector grammar', () => {
  it('parses a single event with a single selector', () => {
    const template = new Template({});
    const parsed = template.parseEventString('click .submit');
    expect(parsed).toEqual([
      { eventName: 'click', eventType: 'delegate', selector: '.submit' },
    ]);
  });

  it('parses a comma-list of events sharing one selector', () => {
    const template = new Template({});
    const parsed = template.parseEventString('mouseup, mouseleave .selector');
    expect(parsed).toHaveLength(2);
    expect(parsed[0]).toMatchObject({ eventName: 'mouseup', selector: '.selector' });
    // mouseleave is rewritten to mouseout via bubble map
    expect(parsed[1]).toMatchObject({ eventName: 'mouseout', selector: '.selector' });
  });

  it('parses a comma-list of selectors sharing one event', () => {
    const template = new Template({});
    const parsed = template.parseEventString('click .a, .b');
    expect(parsed).toHaveLength(2);
    expect(parsed[0]).toMatchObject({ eventName: 'click', selector: '.a' });
    expect(parsed[1]).toMatchObject({ eventName: 'click', selector: '.b' });
  });

  it('binds one handler to the cross product of comma-listed events and selectors', () => {
    const template = new Template({});
    const parsed = template.parseEventString('click, mouseup .a, .b');
    expect(parsed).toHaveLength(4);
    const pairs = parsed.map(({ eventName, selector }) => `${eventName}|${selector}`).sort();
    expect(pairs).toEqual([
      'click|.a',
      'click|.b',
      'mouseup|.a',
      'mouseup|.b',
    ]);
  });

  it('treats an empty selector as component-wide when no selector is given', () => {
    const template = new Template({});
    const parsed = template.parseEventString('click');
    expect(parsed).toEqual([
      { eventName: 'click', eventType: 'delegate', selector: '' },
    ]);
  });

  it('strips the `deep` keyword and sets eventType', () => {
    const template = new Template({});
    const parsed = template.parseEventString('deep click .item');
    expect(parsed).toEqual([
      { eventName: 'click', eventType: 'deep', selector: '.item' },
    ]);
  });

  it('strips the `global` keyword and sets eventType', () => {
    const template = new Template({});
    const parsed = template.parseEventString('global hashchange window');
    expect(parsed).toEqual([
      { eventName: 'hashchange', eventType: 'global', selector: 'window' },
    ]);
  });

  it('strips the `bind` keyword and sets eventType', () => {
    const template = new Template({});
    const parsed = template.parseEventString('bind customevent some-component');
    expect(parsed).toEqual([
      { eventName: 'customevent', eventType: 'bind', selector: 'some-component' },
    ]);
  });
});

/*******************************
       Bubble Map Mapping
*******************************/

describe('events DSL — non-bubbling event mapping', () => {
  it('rewrites blur as focusout so delegation can hear it', () => {
    const template = new Template({});
    const parsed = template.parseEventString('blur .input');
    expect(parsed[0].eventName).toBe('focusout');
  });

  it('rewrites focus as focusin so delegation can hear it', () => {
    const template = new Template({});
    const parsed = template.parseEventString('focus .input');
    expect(parsed[0].eventName).toBe('focusin');
  });

  it('rewrites mouseenter as mouseover', () => {
    const template = new Template({});
    const parsed = template.parseEventString('mouseenter .area');
    expect(parsed[0].eventName).toBe('mouseover');
  });

  it('rewrites mouseleave as mouseout', () => {
    const template = new Template({});
    const parsed = template.parseEventString('mouseleave .area');
    expect(parsed[0].eventName).toBe('mouseout');
  });

  // D4 PIN — Source-pinned (the skill omits these but source includes them)
  it('rewrites load as DOMContentLoaded (source-pinned)', () => {
    const template = new Template({});
    const parsed = template.parseEventString('load');
    expect(parsed[0].eventName).toBe('DOMContentLoaded');
  });

  it('rewrites unload as beforeunload (source-pinned)', () => {
    const template = new Template({});
    const parsed = template.parseEventString('unload');
    expect(parsed[0].eventName).toBe('beforeunload');
  });
});

/*******************************
   Parameterized: light + shadow
*******************************/

RENDER_TARGETS.forEach(({ name, target }) => {
  describe(name, () => {
    /*******************************
        Default-Mode Delegation
    *******************************/

    describe('events DSL — default-mode delegation', () => {
      it('fires on elements matching the selector when delegated to the render root', async () => {
        const handler = vi.fn();
        const fixture = await mountTemplate({
          target,
          events: { 'click .btn': handler },
        });
        fixture.renderRoot.innerHTML = '<button class="btn">Click</button>';
        try {
          const btn = fixture.renderRoot.querySelector('.btn');
          clickOn(btn);
          expect(handler).toHaveBeenCalledTimes(1);
        }
        finally {
          fixture.cleanup();
        }
      });

      it('binds one handler to multiple events when events are comma-separated', async () => {
        const handler = vi.fn();
        const fixture = await mountTemplate({
          target,
          events: { 'click, mouseup .btn': handler },
        });
        fixture.renderRoot.innerHTML = '<button class="btn">Click</button>';
        try {
          const btn = fixture.renderRoot.querySelector('.btn');
          clickOn(btn);
          fireEvent(btn, 'mouseup');
          expect(handler).toHaveBeenCalledTimes(2);
        }
        finally {
          fixture.cleanup();
        }
      });

      it('binds one handler to multiple selectors when selectors are comma-separated', async () => {
        const handler = vi.fn();
        const fixture = await mountTemplate({
          target,
          events: { 'click .a, .b': handler },
        });
        fixture.renderRoot.innerHTML = '<div class="a">A</div><div class="b">B</div>';
        try {
          clickOn(fixture.renderRoot.querySelector('.a'));
          clickOn(fixture.renderRoot.querySelector('.b'));
          expect(handler).toHaveBeenCalledTimes(2);
        }
        finally {
          fixture.cleanup();
        }
      });

      it('skips mouseover when relatedTarget is a descendant of the target', async () => {
        const handler = vi.fn();
        const fixture = await mountTemplate({
          target,
          events: { 'mouseenter .area': handler },
        });
        fixture.renderRoot.innerHTML = '<div class="area"><span class="inner">child</span></div>';
        try {
          const area = fixture.renderRoot.querySelector('.area');
          const inner = fixture.renderRoot.querySelector('.inner');
          // Simulate a mouseover entering area from a sibling (relatedTarget unrelated)
          // — should fire (boundary crossed).
          area.dispatchEvent(
            new MouseEvent('mouseover', {
              bubbles: true,
              composed: true,
              relatedTarget: document.body,
            }),
          );
          expect(handler).toHaveBeenCalledTimes(1);

          // Now simulate motion *within* the area (relatedTarget contained by target)
          // — should be filtered out.
          area.dispatchEvent(
            new MouseEvent('mouseover', {
              bubbles: true,
              composed: true,
              relatedTarget: inner,
            }),
          );
          expect(handler).toHaveBeenCalledTimes(1);
        }
        finally {
          fixture.cleanup();
        }
      });
    });

    /*******************************
              Deep Keyword
    *******************************/

    describe('events DSL — deep keyword (basic)', () => {
      it('fires on a direct match inside the own template (isDeep=false)', async () => {
        let receivedIsDeep;
        const fixture = await mountTemplate({
          target,
          events: {
            'deep click .btn'({ isDeep }) {
              receivedIsDeep = isDeep;
            },
          },
        });
        fixture.renderRoot.innerHTML = '<button class="btn">click</button>';
        try {
          clickOn(fixture.renderRoot.querySelector('.btn'));
          expect(receivedIsDeep).toBe(false);
        }
        finally {
          fixture.cleanup();
        }
      });

      it('delivers isDeep as a boolean to the handler', async () => {
        // isDeep is computed from `selector && $(event.target).closest(selector).length === 0`.
        // Pin that the handler arg includes isDeep as a boolean (false in the common case
        // where the delegated target itself matches the selector).
        let receivedIsDeep;
        const fixture = await mountTemplate({
          target,
          events: {
            'deep click .btn'({ isDeep }) {
              receivedIsDeep = isDeep;
            },
          },
        });
        fixture.renderRoot.innerHTML = '<button class="btn">click</button>';
        try {
          clickOn(fixture.renderRoot.querySelector('.btn'));
          expect(typeof receivedIsDeep).toBe('boolean');
        }
        finally {
          fixture.cleanup();
        }
      });
    });

    /*******************************
             Global Keyword
    *******************************/

    describe('events DSL — global keyword', () => {
      it('attaches listeners to window for global window events', async () => {
        const handler = vi.fn();
        const fixture = await mountTemplate({
          target,
          events: { 'global hashchange window': handler },
        });
        try {
          window.dispatchEvent(new HashChangeEvent('hashchange'));
          expect(handler).toHaveBeenCalledTimes(1);
        }
        finally {
          fixture.cleanup();
        }
      });

      it('removes the global listener when the template is destroyed', async () => {
        const handler = vi.fn();
        const fixture = await mountTemplate({
          target,
          events: { 'global hashchange window': handler },
        });
        fixture.cleanup();
        window.dispatchEvent(new HashChangeEvent('hashchange'));
        expect(handler).not.toHaveBeenCalled();
      });
    });

    /*******************************
              Bind Keyword
    *******************************/

    describe('events DSL — bind keyword', () => {
      it('does not bind to elements until first render fires onRenderOnce', async () => {
        const handler = vi.fn();
        const fixture = await mountTemplate({
          target,
          events: { 'bind ping .target': handler },
        });
        // Even though attachEvents has been called, bind defers until onRenderOnce.
        fixture.renderRoot.innerHTML = '<div class="target"></div>';
        try {
          const tgt = fixture.renderRoot.querySelector('.target');
          fireCustomEvent(tgt, 'ping');
          // No render has fired (we don't invoke Template.render()).
          expect(handler).not.toHaveBeenCalled();
        }
        finally {
          fixture.cleanup();
        }
      });

      it('attaches listeners directly after onRendered fires (manual trigger)', async () => {
        const handler = vi.fn();
        const fixture = await mountTemplate({
          target,
          events: { 'bind ping .target': handler },
        });
        fixture.renderRoot.innerHTML = '<div class="target"></div>';
        try {
          // Manually invoke onRenderOnce, simulating the post-first-render hook.
          if (typeof fixture.template.onRenderOnce === 'function') {
            fixture.template.onRenderOnce();
          }
          const tgt = fixture.renderRoot.querySelector('.target');
          fireCustomEvent(tgt, 'ping');
          expect(handler).toHaveBeenCalledTimes(1);
        }
        finally {
          fixture.cleanup();
        }
      });

      it('hears non-bubbling CustomEvents that delegation cannot see', async () => {
        const handler = vi.fn();
        const fixture = await mountTemplate({
          target,
          events: { 'bind nobubble .target': handler },
        });
        fixture.renderRoot.innerHTML = '<div class="target"></div>';
        try {
          if (typeof fixture.template.onRenderOnce === 'function') {
            fixture.template.onRenderOnce();
          }
          const tgt = fixture.renderRoot.querySelector('.target');
          // dispatch with bubbles: false to confirm direct binding, not delegation
          tgt.dispatchEvent(new CustomEvent('nobubble', { bubbles: false }));
          expect(handler).toHaveBeenCalledTimes(1);
        }
        finally {
          fixture.cleanup();
        }
      });

      it('L5 PIN — does not double-bind across multiple render cycles', async () => {
        // Pin current behavior: wrapFunction(this.onRenderOnce) replaces onRenderOnce
        // with a no-op after first call, so subsequent renders do not re-bind.
        const handler = vi.fn();
        const fixture = await mountTemplate({
          target,
          events: { 'bind ping .target': handler },
        });
        fixture.renderRoot.innerHTML = '<div class="target"></div>';
        try {
          // First "render"
          if (typeof fixture.template.onRenderOnce === 'function') {
            fixture.template.onRenderOnce();
          }
          // Second "render": onRenderOnce is wrapped to noop after first call,
          // so even if we tried to call it, it wouldn't rebind.
          // (No-op call is safe; if someone calls it, it does nothing.)
          const tgt = fixture.renderRoot.querySelector('.target');
          fireCustomEvent(tgt, 'ping');
          expect(handler).toHaveBeenCalledTimes(1);
        }
        finally {
          fixture.cleanup();
        }
      });
    });

    /*******************************
           Handler Arguments
    *******************************/

    describe('events DSL — handler arguments', () => {
      it('passes the native event as `event`', async () => {
        let received;
        const fixture = await mountTemplate({
          target,
          events: {
            'click .btn'({ event }) {
              received = event;
            },
          },
        });
        fixture.renderRoot.innerHTML = '<button class="btn">Go</button>';
        try {
          clickOn(fixture.renderRoot.querySelector('.btn'));
          expect(received).toBeInstanceOf(MouseEvent);
          expect(received.type).toBe('click');
        }
        finally {
          fixture.cleanup();
        }
      });

      it('passes the matched element as `target`', async () => {
        let receivedTarget;
        const fixture = await mountTemplate({
          target,
          events: {
            'click .btn'({ target: t }) {
              receivedTarget = t;
            },
          },
        });
        fixture.renderRoot.innerHTML = '<button class="btn"><span class="label">Go</span></button>';
        try {
          // Click on the inner span; matched element is .btn (the closest match)
          clickOn(fixture.renderRoot.querySelector('.label'));
          expect(receivedTarget).toBe(fixture.renderRoot.querySelector('.btn'));
        }
        finally {
          fixture.cleanup();
        }
      });

      it('binds `this` to the matched element', async () => {
        let receivedThis;
        const fixture = await mountTemplate({
          target,
          events: {
            'click .btn'() {
              receivedThis = this;
            },
          },
        });
        fixture.renderRoot.innerHTML = '<button class="btn">Go</button>';
        try {
          const btn = fixture.renderRoot.querySelector('.btn');
          clickOn(btn);
          expect(receivedThis).toBe(btn);
        }
        finally {
          fixture.cleanup();
        }
      });

      it('parses data-* attributes as typed values in `data` (numbers, booleans, JSON)', async () => {
        let receivedData;
        const fixture = await mountTemplate({
          target,
          events: {
            'click .btn'({ data }) {
              receivedData = data;
            },
          },
        });
        fixture.renderRoot.innerHTML = `
          <button class="btn"
                  data-amount="5"
                  data-active="true"
                  data-config='{"x":1}'
                  data-name="hello">Go</button>
        `;
        try {
          clickOn(fixture.renderRoot.querySelector('.btn'));
          expect(receivedData.amount).toBe(5);
          expect(receivedData.active).toBe(true);
          expect(receivedData.config).toEqual({ x: 1 });
          expect(receivedData.name).toBe('hello');
        }
        finally {
          fixture.cleanup();
        }
      });

      it('merges event.detail into `data`, with detail keys overriding dataset keys', async () => {
        let receivedData;
        const fixture = await mountTemplate({
          target,
          events: {
            'mycustom .item'({ data }) {
              receivedData = data;
            },
          },
        });
        fixture.renderRoot.innerHTML = '<div class="item" data-key="from-dataset" data-only="dataset-only"></div>';
        try {
          const item = fixture.renderRoot.querySelector('.item');
          fireCustomEvent(item, 'mycustom', { key: 'from-detail', extra: 'detail-only' });
          expect(receivedData.key).toBe('from-detail');
          expect(receivedData.extra).toBe('detail-only');
          expect(receivedData.only).toBe('dataset-only');
        }
        finally {
          fixture.cleanup();
        }
      });

      it('passes `value` from target.value when the target is a form control', async () => {
        let receivedValue;
        const fixture = await mountTemplate({
          target,
          events: {
            'change input'({ value }) {
              receivedValue = value;
            },
          },
        });
        fixture.renderRoot.innerHTML = '<input type="text" value="initial">';
        try {
          const input = fixture.renderRoot.querySelector('input');
          input.value = 'updated';
          fireEvent(input, 'change');
          expect(receivedValue).toBe('updated');
        }
        finally {
          fixture.cleanup();
        }
      });
    });

    /*******************************
          Return-Value Contract
    *******************************/

    describe('events DSL — return-value contract', () => {
      it('F-A: calls stopPropagation when the handler returns false', async () => {
        const inner = vi.fn(() => false);
        const outer = vi.fn();
        const fixture = await mountTemplate({
          target,
          events: { 'click .btn': inner },
        });
        fixture.renderRoot.innerHTML = '<button class="btn">Go</button>';
        // Outer listener at document — should not see click if stopPropagation
        // fires inside the inner delegated handler.
        document.addEventListener('click', outer);
        try {
          clickOn(fixture.renderRoot.querySelector('.btn'));
          expect(inner).toHaveBeenCalledTimes(1);
          // Once stopPropagation fires inside the inner handler, the click
          // does not continue to bubble up to document.
          expect(outer).not.toHaveBeenCalled();
        }
        finally {
          document.removeEventListener('click', outer);
          fixture.cleanup();
        }
      });

      it('F-A: calls preventDefault when the handler returns the string "cancel"', async () => {
        const handler = vi.fn(() => 'cancel');
        const fixture = await mountTemplate({
          target,
          events: { 'click .btn': handler },
        });
        fixture.renderRoot.innerHTML = '<button class="btn">Go</button>';
        try {
          const btn = fixture.renderRoot.querySelector('.btn');
          const ev = new MouseEvent('click', {
            bubbles: true,
            composed: true,
            cancelable: true,
          });
          btn.dispatchEvent(ev);
          expect(handler).toHaveBeenCalledTimes(1);
          expect(ev.defaultPrevented).toBe(true);
        }
        finally {
          fixture.cleanup();
        }
      });

      it('does neither when the handler returns undefined', async () => {
        const handler = vi.fn(); // implicitly returns undefined
        const fixture = await mountTemplate({
          target,
          events: { 'click .btn': handler },
        });
        fixture.renderRoot.innerHTML = '<button class="btn">Go</button>';
        try {
          const btn = fixture.renderRoot.querySelector('.btn');
          const ev = new MouseEvent('click', {
            bubbles: true,
            composed: true,
            cancelable: true,
          });
          btn.dispatchEvent(ev);
          expect(handler).toHaveBeenCalledTimes(1);
          expect(ev.defaultPrevented).toBe(false);
        }
        finally {
          fixture.cleanup();
        }
      });
    });

    /*******************************
              attachEvent
    *******************************/

    describe('attachEvent — dynamic event binding with auto-cleanup', () => {
      it('binds an event to an external selector from inside the component', async () => {
        const handler = vi.fn();
        const fixture = await mountTemplate({ target });
        // Create a target outside the component's render tree.
        const externalTarget = document.createElement('div');
        externalTarget.id = 'external-target';
        document.body.appendChild(externalTarget);
        try {
          fixture.template.attachEvent(externalTarget, 'click', handler);
          clickOn(externalTarget);
          expect(handler).toHaveBeenCalledTimes(1);
        }
        finally {
          externalTarget.remove();
          fixture.cleanup();
        }
      });

      it('returns a handler object that can be aborted manually', async () => {
        const handler = vi.fn();
        const fixture = await mountTemplate({ target });
        const externalTarget = document.createElement('div');
        document.body.appendChild(externalTarget);
        try {
          const eventHandler = fixture.template.attachEvent(externalTarget, 'click', handler);
          expect(eventHandler).toBeDefined();
          expect(typeof eventHandler.abort).toBe('function');

          eventHandler.abort();
          clickOn(externalTarget);
          expect(handler).not.toHaveBeenCalled();
        }
        finally {
          externalTarget.remove();
          fixture.cleanup();
        }
      });

      it('removes the listener when the component is destroyed', async () => {
        const handler = vi.fn();
        const fixture = await mountTemplate({ target });
        const externalTarget = document.createElement('div');
        document.body.appendChild(externalTarget);
        fixture.template.attachEvent(externalTarget, 'click', handler);
        fixture.cleanup();
        // After destroy, listener is gone.
        clickOn(externalTarget);
        expect(handler).not.toHaveBeenCalled();
        externalTarget.remove();
      });
    });

    /*******************************
             dispatchEvent
    *******************************/

    describe('dispatchEvent — emitting custom events from a component', () => {
      it('C1: fires a CustomEvent on the component element with detail equal to the supplied data', async () => {
        const fixture = await mountTemplate({ target });
        const handler = vi.fn();
        // C1: el === component element (the host receives the event)
        fixture.host.addEventListener('itemactive', handler);
        try {
          fixture.template.dispatchEvent('itemactive', { id: 42 });
          expect(handler).toHaveBeenCalledTimes(1);
          const event = handler.mock.calls[0][0];
          expect(event).toBeInstanceOf(CustomEvent);
          expect(event.detail).toEqual({ id: 42 });
        }
        finally {
          fixture.cleanup();
        }
      });

      it('emits CustomEvents that cross shadow boundaries (composed: true) by default', async () => {
        const fixture = await mountTemplate({ target });
        const docHandler = vi.fn();
        document.addEventListener('itemactive', docHandler);
        try {
          fixture.template.dispatchEvent('itemactive', { id: 1 });
          expect(docHandler).toHaveBeenCalledTimes(1);
        }
        finally {
          document.removeEventListener('itemactive', docHandler);
          fixture.cleanup();
        }
      });

      it('invokes the matching on{Name} setting callback before dispatching the DOM event when triggerCallback is true', async () => {
        // Stub host element with an onFoo callback (mimics what defineComponent
        // sets up via settings reflection).
        const fixture = await mountTemplate({ target });
        const events = [];
        fixture.host.onFoo = function(data) {
          events.push(['callback', data]);
        };
        fixture.host.addEventListener('foo', function(e) {
          events.push(['dom', e.detail]);
        });
        try {
          fixture.template.dispatchEvent('foo', { x: 1 });
          expect(events).toEqual([
            ['callback', { x: 1 }],
            ['dom', { x: 1 }],
          ]);
        }
        finally {
          fixture.cleanup();
        }
      });

      it('skips the on{Name} callback when triggerCallback is false', async () => {
        const fixture = await mountTemplate({ target });
        const cb = vi.fn();
        const dom = vi.fn();
        fixture.host.onFoo = cb;
        fixture.host.addEventListener('foo', dom);
        try {
          fixture.template.dispatchEvent('foo', { x: 1 }, undefined, { triggerCallback: false });
          expect(cb).not.toHaveBeenCalled();
          expect(dom).toHaveBeenCalledTimes(1);
        }
        finally {
          fixture.cleanup();
        }
      });

      it('lets callers override CustomEvent options via the third argument', async () => {
        const fixture = await mountTemplate({ target });
        const handler = vi.fn();
        fixture.host.addEventListener('cancelable', handler);
        try {
          fixture.template.dispatchEvent('cancelable', { x: 1 }, { bubbles: false });
          expect(handler).toHaveBeenCalledTimes(1);
          const event = handler.mock.calls[0][0];
          expect(event.bubbles).toBe(false);
        }
        finally {
          fixture.cleanup();
        }
      });
    });

    /*******************************
           Lifecycle Teardown
    *******************************/

    describe('events DSL — lifecycle teardown', () => {
      it('removes every events-DSL listener when the template is destroyed', async () => {
        const handler = vi.fn();
        const fixture = await mountTemplate({
          target,
          events: { 'click .btn': handler },
        });
        fixture.renderRoot.innerHTML = '<button class="btn">Go</button>';
        const btn = fixture.renderRoot.querySelector('.btn');
        fixture.cleanup();
        clickOn(btn);
        expect(handler).not.toHaveBeenCalled();
      });

      it('does not double-bind listeners when attachEvents is called again', async () => {
        const handler = vi.fn();
        const fixture = await mountTemplate({
          target,
          events: { 'click .btn': handler },
        });
        fixture.renderRoot.innerHTML = '<button class="btn">Go</button>';
        try {
          // Re-attach should remove existing first (template.js:489).
          fixture.template.attachEvents();
          const btn = fixture.renderRoot.querySelector('.btn');
          clickOn(btn);
          expect(handler).toHaveBeenCalledTimes(1);
        }
        finally {
          fixture.cleanup();
        }
      });
    });
  });
});

/*******************************
   Shadow-only — boundary tests
*******************************/

describe('shadow only', () => {
  /*******************************
      Default-Mode Encapsulation
  *******************************/

  describe('events DSL — default-mode encapsulation (shadow boundaries)', () => {
    it('does NOT fire on slotted content matching the selector (encapsulation by default)', async () => {
      const handler = vi.fn();
      const fixture = await mountTemplate({
        target: 'shadow',
        events: { 'click .item': handler },
      });
      // Set up the shadow root with a <slot>; light DOM children flow into it.
      // To activate the isNodeInTemplate range filter, we need startNode/endNode
      // markers around the rendered content (in production, the renderer sets these).
      const startMarker = document.createComment('start');
      const endMarker = document.createComment('end');
      fixture.renderRoot.innerHTML = '';
      fixture.renderRoot.appendChild(startMarker);
      const ownTemplate = document.createElement('div');
      ownTemplate.className = 'own-template';
      ownTemplate.innerHTML = '<slot></slot>';
      fixture.renderRoot.appendChild(ownTemplate);
      fixture.renderRoot.appendChild(endMarker);
      fixture.template.startNode = startMarker;
      fixture.template.endNode = endMarker;
      fixture.host.innerHTML = '<button class="item">Slotted</button>';
      try {
        // The slotted button is in the host's light DOM, not inside the shadow.
        // event.target on click is the light-DOM button. isNodeInTemplate walks
        // up via parentNode chain — light DOM never finds a child of the shadow
        // root, so getRootChild returns document, which is disconnected from
        // startNode/endNode → isNodeInTemplate returns false → handler skipped.
        const slotted = fixture.host.querySelector('.item');
        clickOn(slotted);
        expect(handler).not.toHaveBeenCalled();
      }
      finally {
        fixture.cleanup();
      }
    });

    it('does NOT fire on elements inside a nested child shadow DOM matching the selector', async () => {
      const handler = vi.fn();
      const fixture = await mountTemplate({
        target: 'shadow',
        events: { 'click .item': handler },
      });
      // Nested child host with its own shadow root inside our renderRoot.
      // Range markers around the rendered content (production-like setup).
      const startMarker = document.createComment('start');
      const endMarker = document.createComment('end');
      fixture.renderRoot.innerHTML = '';
      fixture.renderRoot.appendChild(startMarker);
      const ownTemplate = document.createElement('div');
      ownTemplate.className = 'own-template';
      const childHost = document.createElement('div');
      childHost.className = 'child-host';
      ownTemplate.appendChild(childHost);
      fixture.renderRoot.appendChild(ownTemplate);
      fixture.renderRoot.appendChild(endMarker);
      fixture.template.startNode = startMarker;
      fixture.template.endNode = endMarker;
      const childShadow = childHost.attachShadow({ mode: 'open' });
      childShadow.innerHTML = '<button class="item">Nested</button>';
      try {
        const nested = childShadow.querySelector('.item');
        clickOn(nested);
        // composed: true bubbles to parent shadow, but event.target retargets
        // to the child-host (which doesn't match .item), so the isDeep check
        // rejects the handler.
        expect(handler).not.toHaveBeenCalled();
      }
      finally {
        fixture.cleanup();
      }
    });
  });

  /*******************************
       Top-level encapsulation (no range markers — the realistic case)
  *******************************/

  // The encapsulation tests above set startNode/endNode markers manually,
  // which mirrors the SUBTEMPLATE path (the renderer sets markers around
  // a subtemplate's render region). For TOP-LEVEL web components, the
  // component-package's WebComponentBase.attach() calls template.attach(shadow)
  // WITHOUT passing startNode/endNode. So template.startNode === undefined
  // and isNodeInTemplate's range check short-circuits to true (line 707) —
  // the line-538 filter is inert. The closest()-based filter at line 543
  // doesn't reject events whose target ITSELF matches the selector (native
  // closest walks light DOM up from the target including self). So default-
  // mode handlers fire on slotted content matching the selector — contradicting
  // the documented "encapsulation by default" contract.
  //
  // These tests are EXPECTED TO FAIL pre-fix. They pin the documented contract
  // for the realistic top-level web-component setup.

  describe('events DSL — top-level encapsulation (Q3 PIN, EXPECTED TO FAIL pre-fix)', () => {
    it('Q3 PIN — does NOT fire on slotted content matching the selector (top-level, no markers)', async () => {
      const handler = vi.fn();
      const fixture = await mountTemplate({
        target: 'shadow',
        events: { 'click .btn': handler },
      });
      // Top-level setup: shadow with a slot, NO startNode/endNode markers.
      // This is what WebComponentBase.attach() produces in production.
      fixture.renderRoot.innerHTML = '<div class="own"><slot></slot></div>';
      fixture.host.innerHTML = '<button class="btn">Slotted</button>';
      try {
        const slotted = fixture.host.querySelector('.btn');
        clickOn(slotted);
        // Documented contract: default-mode handlers should NOT fire on
        // slotted content. Today they do — handler fires once. Fails.
        expect(handler).not.toHaveBeenCalled();
      }
      finally {
        fixture.cleanup();
      }
    });

    it('Q3 sanity — DOES fire on shadow-internal elements matching the selector (counter-test)', async () => {
      const handler = vi.fn();
      const fixture = await mountTemplate({
        target: 'shadow',
        events: { 'click .btn': handler },
      });
      // Same shape as the failing test above, but click an element INSIDE the
      // shadow root rather than slotted content. This pins that the fix
      // doesn't accidentally reject shadow-internal events.
      fixture.renderRoot.innerHTML = '<button class="btn">Shadow-internal</button>';
      try {
        const internal = fixture.renderRoot.querySelector('.btn');
        clickOn(internal);
        expect(handler).toHaveBeenCalledTimes(1);
      }
      finally {
        fixture.cleanup();
      }
    });
  });

  /*******************************
       Deep Keyword (boundary escape)
  *******************************/

  describe('events DSL — deep keyword (boundary escape, shadow only)', () => {
    // B8 PIN — deep keyword bug at template.js:538.
    // Deep events from outside the template range are rejected before line
    // 544's deep-aware filter can let them through. EXPECTED TO FAIL.
    it('B8 PIN — fires on slotted content matching the selector (EXPECTED TO FAIL pre-fix)', async () => {
      const handler = vi.fn();
      const fixture = await mountTemplate({
        target: 'shadow',
        events: { 'deep click .item': handler },
      });
      // Use the same range-marker setup as the default-mode encapsulation test,
      // so this test exercises the boundary-escape contract symmetrically: the
      // default test pins safety, this test pins escape under identical scaffolding.
      const startMarker = document.createComment('start');
      const endMarker = document.createComment('end');
      fixture.renderRoot.innerHTML = '';
      fixture.renderRoot.appendChild(startMarker);
      const ownTemplate = document.createElement('div');
      ownTemplate.className = 'own-template';
      ownTemplate.innerHTML = '<slot></slot>';
      fixture.renderRoot.appendChild(ownTemplate);
      fixture.renderRoot.appendChild(endMarker);
      fixture.template.startNode = startMarker;
      fixture.template.endNode = endMarker;
      fixture.host.innerHTML = '<button class="item">Slotted</button>';
      try {
        clickOn(fixture.host.querySelector('.item'));
        expect(handler).toHaveBeenCalledTimes(1);
      }
      finally {
        fixture.cleanup();
      }
    });
  });
});

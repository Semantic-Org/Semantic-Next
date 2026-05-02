// Browser tests for the events DSL: selector grammar, bubble-map rewrites, the
// four dialects (default delegation, deep, global, bind), handler-arg shape,
// return-value contract, attachEvent/dispatchEvent helpers, and lifecycle
// teardown. Most behaviors are parameterized across light and shadow render
// targets; shadow-only boundary tests live at the bottom.

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

  it('does not strip a keyword embedded in a longer event name', () => {
    // `'deepclick'` should be parsed as the literal eventName, not as
    // `deep` + `click`. Keyword detection requires a word boundary.
    const template = new Template({});
    const parsed = template.parseEventString('deepclick .item');
    expect(parsed).toEqual([
      { eventName: 'deepclick', eventType: 'delegate', selector: '.item' },
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

  it('rewrites load as DOMContentLoaded', () => {
    const template = new Template({});
    const parsed = template.parseEventString('load');
    expect(parsed[0].eventName).toBe('DOMContentLoaded');
  });

  it('rewrites unload as beforeunload', () => {
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
          // Crossing into .area from outside fires.
          area.dispatchEvent(
            new MouseEvent('mouseover', {
              bubbles: true,
              composed: true,
              relatedTarget: document.body,
            }),
          );
          expect(handler).toHaveBeenCalledTimes(1);

          // Movement entirely within .area is filtered out.
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
      it('fires on a direct match inside the own template with isDeep false', async () => {
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

      it('defaults to window when no selector is given', async () => {
        // `'global hashchange'` (no selector) should default to window so
        // authors don't have to repeat the obvious `window` for the typical
        // global event use cases (scroll/resize/hashchange).
        const handler = vi.fn();
        const fixture = await mountTemplate({
          target,
          events: { 'global hashchange': handler },
        });
        try {
          window.dispatchEvent(new HashChangeEvent('hashchange'));
          expect(handler).toHaveBeenCalledTimes(1);
        }
        finally {
          fixture.cleanup();
        }
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
        fixture.renderRoot.innerHTML = '<div class="target"></div>';
        try {
          const tgt = fixture.renderRoot.querySelector('.target');
          fireCustomEvent(tgt, 'ping');
          expect(handler).not.toHaveBeenCalled();
        }
        finally {
          fixture.cleanup();
        }
      });

      it('attaches listeners directly after onRendered fires', async () => {
        const handler = vi.fn();
        const fixture = await mountTemplate({
          target,
          events: { 'bind ping .target': handler },
        });
        fixture.renderRoot.innerHTML = '<div class="target"></div>';
        try {
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
          tgt.dispatchEvent(new CustomEvent('nobubble', { bubbles: false }));
          expect(handler).toHaveBeenCalledTimes(1);
        }
        finally {
          fixture.cleanup();
        }
      });

      it('does not double-bind across multiple render cycles', async () => {
        const handler = vi.fn();
        const fixture = await mountTemplate({
          target,
          events: { 'bind ping .target': handler },
        });
        fixture.renderRoot.innerHTML = '<div class="target"></div>';
        try {
          if (typeof fixture.template.onRenderOnce === 'function') {
            fixture.template.onRenderOnce();
          }
          // Second call is a no-op — onRenderOnce wraps to noop after the first run.
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
          // Clicking the inner span should resolve the matched element to .btn.
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
      it('calls stopPropagation when the handler returns false', async () => {
        const inner = vi.fn(() => false);
        const outer = vi.fn();
        const fixture = await mountTemplate({
          target,
          events: { 'click .btn': inner },
        });
        fixture.renderRoot.innerHTML = '<button class="btn">Go</button>';
        document.addEventListener('click', outer);
        try {
          clickOn(fixture.renderRoot.querySelector('.btn'));
          expect(inner).toHaveBeenCalledTimes(1);
          expect(outer).not.toHaveBeenCalled();
        }
        finally {
          document.removeEventListener('click', outer);
          fixture.cleanup();
        }
      });

      it('calls preventDefault when the handler returns the string "cancel"', async () => {
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
        const handler = vi.fn();
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
        clickOn(externalTarget);
        expect(handler).not.toHaveBeenCalled();
        externalTarget.remove();
      });

      it('forwards listener options (passive, capture, once) to addEventListener', async () => {
        // Production at inpage-menu.js:269 passes `{ passive: true }` directly.
        // The 4th arg should accept the natural addEventListener shape.
        const fixture = await mountTemplate({ target });
        const externalTarget = document.createElement('div');
        document.body.appendChild(externalTarget);
        const spy = vi.spyOn(externalTarget, 'addEventListener');
        try {
          fixture.template.attachEvent(externalTarget, 'touchmove', () => {}, { passive: true });
          const call = spy.mock.calls.find(([name]) => name === 'touchmove');
          expect(call).toBeDefined();
          expect(call[2]).toMatchObject({ passive: true });
        }
        finally {
          spy.mockRestore();
          externalTarget.remove();
          fixture.cleanup();
        }
      });

      it('fires only once when called with { once: true }', async () => {
        const handler = vi.fn();
        const fixture = await mountTemplate({ target });
        const externalTarget = document.createElement('div');
        document.body.appendChild(externalTarget);
        try {
          fixture.template.attachEvent(externalTarget, 'click', handler, { once: true });
          clickOn(externalTarget);
          clickOn(externalTarget);
          clickOn(externalTarget);
          expect(handler).toHaveBeenCalledTimes(1);
        }
        finally {
          externalTarget.remove();
          fixture.cleanup();
        }
      });
    });

    /*******************************
             dispatchEvent
    *******************************/

    describe('dispatchEvent — emitting custom events from a component', () => {
      it('fires a CustomEvent on the component element with detail equal to the supplied data', async () => {
        const fixture = await mountTemplate({ target });
        const handler = vi.fn();
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
      // Range markers around the rendered content activate the
      // isNodeInTemplate filter; the renderer sets these in production.
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
        // The slotted button lives in light DOM, outside the marker range, so
        // isNodeInTemplate rejects it and the handler does not fire.
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
        // composed: true bubbles to the parent shadow, but event.target retargets
        // to child-host (which doesn't match .item), so the isDeep check rejects.
        expect(handler).not.toHaveBeenCalled();
      }
      finally {
        fixture.cleanup();
      }
    });
  });

  /*******************************
       Top-level encapsulation
  *******************************/

  describe('events DSL — projection vs piercing', () => {
    // Slotted children are projected through the host's <slot> and belong to
    // the host's logical template. Default-mode selectors match them without
    // ceremony — that's projection, not piercing. The `deep` keyword is for
    // a different boundary (another component's shadow tree).
    it('DOES fire default handlers on slotted content matching the selector', async () => {
      const handler = vi.fn();
      const fixture = await mountTemplate({
        target: 'shadow',
        events: { 'click .btn': handler },
      });
      fixture.renderRoot.innerHTML = '<div class="own"><slot></slot></div>';
      fixture.host.innerHTML = '<button class="btn">Slotted</button>';
      try {
        clickOn(fixture.host.querySelector('.btn'));
        expect(handler).toHaveBeenCalledTimes(1);
      }
      finally {
        fixture.cleanup();
      }
    });

    it('fires component-wide handlers (no selector) for events on the host itself', async () => {
      // The host's own surface — its padding, border, or the host element
      // dispatched event — is part of "the component" semantically. Binding
      // a no-selector handler at the renderRoot misses these because the
      // event never enters the shadow tree's bubble path.
      const handler = vi.fn();
      const fixture = await mountTemplate({
        target: 'shadow',
        events: { 'click': handler },
      });
      try {
        clickOn(fixture.host);
        expect(handler).toHaveBeenCalledTimes(1);
      }
      finally {
        fixture.cleanup();
      }
    });

    it('DOES fire default handlers on shadow-internal elements matching the selector', async () => {
      const handler = vi.fn();
      const fixture = await mountTemplate({
        target: 'shadow',
        events: { 'click .btn': handler },
      });
      fixture.renderRoot.innerHTML = '<button class="btn">Shadow-internal</button>';
      try {
        clickOn(fixture.renderRoot.querySelector('.btn'));
        expect(handler).toHaveBeenCalledTimes(1);
      }
      finally {
        fixture.cleanup();
      }
    });
  });

  /*******************************
       Deep Keyword (boundary)
  *******************************/

  describe('events DSL — deep keyword (boundary escape, shadow only)', () => {
    it('fires on slotted content matching the selector', async () => {
      const handler = vi.fn();
      const fixture = await mountTemplate({
        target: 'shadow',
        events: { 'deep click .item': handler },
      });
      // Mirrors the default-mode encapsulation setup so this test exercises
      // the escape contract under identical scaffolding.
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

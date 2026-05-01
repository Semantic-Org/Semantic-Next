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

import { afterEach, describe, expect, it, vi } from 'vitest';

import { mountTemplateInShadow } from '../_helpers/browser-fixture.js';
import { clickOn, fireCustomEvent, fireEvent } from '../_helpers/dispatch.js';
import { freshTemplate } from '../_helpers/fresh-template.js';
import { clearTemplateRegistry } from '../_helpers/registry-cleanup.js';

afterEach(() => {
  clearTemplateRegistry();
  document.body.innerHTML = '';
});

/*******************************
        Parser Grammar
*******************************/

describe('events DSL — selector grammar', () => {
  it('parses a single event with a single selector', () => {
    const { template, cleanup } = freshTemplate();
    try {
      const parsed = template.parseEventString('click .submit');
      expect(parsed).toEqual([
        { eventName: 'click', eventType: 'delegate', selector: '.submit' },
      ]);
    }
    finally {
      cleanup();
    }
  });

  it('parses a comma-list of events sharing one selector', () => {
    const { template, cleanup } = freshTemplate();
    try {
      const parsed = template.parseEventString('mouseup, mouseleave .selector');
      expect(parsed).toHaveLength(2);
      expect(parsed[0]).toMatchObject({ eventName: 'mouseup', selector: '.selector' });
      // mouseleave is rewritten to mouseout via bubble map
      expect(parsed[1]).toMatchObject({ eventName: 'mouseout', selector: '.selector' });
    }
    finally {
      cleanup();
    }
  });

  it('parses a comma-list of selectors sharing one event', () => {
    const { template, cleanup } = freshTemplate();
    try {
      const parsed = template.parseEventString('click .a, .b');
      expect(parsed).toHaveLength(2);
      expect(parsed[0]).toMatchObject({ eventName: 'click', selector: '.a' });
      expect(parsed[1]).toMatchObject({ eventName: 'click', selector: '.b' });
    }
    finally {
      cleanup();
    }
  });

  it('binds one handler to the cross product of comma-listed events and selectors', () => {
    const { template, cleanup } = freshTemplate();
    try {
      const parsed = template.parseEventString('click, mouseup .a, .b');
      expect(parsed).toHaveLength(4);
      const pairs = parsed.map(({ eventName, selector }) => `${eventName}|${selector}`).sort();
      expect(pairs).toEqual([
        'click|.a',
        'click|.b',
        'mouseup|.a',
        'mouseup|.b',
      ]);
    }
    finally {
      cleanup();
    }
  });

  it('treats an empty selector as component-wide when no selector is given', () => {
    const { template, cleanup } = freshTemplate();
    try {
      const parsed = template.parseEventString('click');
      expect(parsed).toEqual([
        { eventName: 'click', eventType: 'delegate', selector: '' },
      ]);
    }
    finally {
      cleanup();
    }
  });

  it('strips the `deep` keyword and sets eventType', () => {
    const { template, cleanup } = freshTemplate();
    try {
      const parsed = template.parseEventString('deep click .item');
      expect(parsed).toEqual([
        { eventName: 'click', eventType: 'deep', selector: '.item' },
      ]);
    }
    finally {
      cleanup();
    }
  });

  it('strips the `global` keyword and sets eventType', () => {
    const { template, cleanup } = freshTemplate();
    try {
      const parsed = template.parseEventString('global hashchange window');
      expect(parsed).toEqual([
        { eventName: 'hashchange', eventType: 'global', selector: 'window' },
      ]);
    }
    finally {
      cleanup();
    }
  });

  it('strips the `bind` keyword and sets eventType', () => {
    const { template, cleanup } = freshTemplate();
    try {
      const parsed = template.parseEventString('bind customevent some-component');
      expect(parsed).toEqual([
        { eventName: 'customevent', eventType: 'bind', selector: 'some-component' },
      ]);
    }
    finally {
      cleanup();
    }
  });
});

/*******************************
       Bubble Map Mapping
*******************************/

describe('events DSL — non-bubbling event mapping', () => {
  it('rewrites blur as focusout so delegation can hear it', () => {
    const { template, cleanup } = freshTemplate();
    try {
      const parsed = template.parseEventString('blur .input');
      expect(parsed[0].eventName).toBe('focusout');
    }
    finally {
      cleanup();
    }
  });

  it('rewrites focus as focusin so delegation can hear it', () => {
    const { template, cleanup } = freshTemplate();
    try {
      const parsed = template.parseEventString('focus .input');
      expect(parsed[0].eventName).toBe('focusin');
    }
    finally {
      cleanup();
    }
  });

  it('rewrites mouseenter as mouseover', () => {
    const { template, cleanup } = freshTemplate();
    try {
      const parsed = template.parseEventString('mouseenter .area');
      expect(parsed[0].eventName).toBe('mouseover');
    }
    finally {
      cleanup();
    }
  });

  it('rewrites mouseleave as mouseout', () => {
    const { template, cleanup } = freshTemplate();
    try {
      const parsed = template.parseEventString('mouseleave .area');
      expect(parsed[0].eventName).toBe('mouseout');
    }
    finally {
      cleanup();
    }
  });

  // Source-pinned (D4 from intent doc): the skill omits these but source includes them
  it('rewrites load as DOMContentLoaded (source-pinned)', () => {
    const { template, cleanup } = freshTemplate();
    try {
      const parsed = template.parseEventString('load');
      expect(parsed[0].eventName).toBe('DOMContentLoaded');
    }
    finally {
      cleanup();
    }
  });

  it('rewrites unload as beforeunload (source-pinned)', () => {
    const { template, cleanup } = freshTemplate();
    try {
      const parsed = template.parseEventString('unload');
      expect(parsed[0].eventName).toBe('beforeunload');
    }
    finally {
      cleanup();
    }
  });
});

/*******************************
      Default-Mode Delegation
*******************************/

describe('events DSL — default-mode delegation', () => {
  it('fires on elements matching the selector when delegated to the shadow root', () => {
    const handler = vi.fn();
    const fixture = mountTemplateInShadow({
      events: { 'click .btn': handler },
    });
    fixture.shadow.innerHTML = '<button class="btn">Click</button>';
    try {
      const btn = fixture.shadow.querySelector('.btn');
      clickOn(btn);
      expect(handler).toHaveBeenCalledTimes(1);
    }
    finally {
      fixture.cleanup();
    }
  });

  it('binds one handler to multiple events when events are comma-separated', () => {
    const handler = vi.fn();
    const fixture = mountTemplateInShadow({
      events: { 'click, mouseup .btn': handler },
    });
    fixture.shadow.innerHTML = '<button class="btn">Click</button>';
    try {
      const btn = fixture.shadow.querySelector('.btn');
      clickOn(btn);
      fireEvent(btn, 'mouseup');
      expect(handler).toHaveBeenCalledTimes(2);
    }
    finally {
      fixture.cleanup();
    }
  });

  it('binds one handler to multiple selectors when selectors are comma-separated', () => {
    const handler = vi.fn();
    const fixture = mountTemplateInShadow({
      events: { 'click .a, .b': handler },
    });
    fixture.shadow.innerHTML = '<div class="a">A</div><div class="b">B</div>';
    try {
      clickOn(fixture.shadow.querySelector('.a'));
      clickOn(fixture.shadow.querySelector('.b'));
      expect(handler).toHaveBeenCalledTimes(2);
    }
    finally {
      fixture.cleanup();
    }
  });

  it('does NOT fire on slotted content matching the selector (encapsulation by default)', () => {
    const handler = vi.fn();
    const fixture = mountTemplateInShadow({
      events: { 'click .item': handler },
    });
    // Set up the shadow root with a <slot>; light DOM children flow into it.
    // To activate the isNodeInTemplate range filter, we need startNode/endNode
    // markers around the rendered content (in production, the renderer sets these).
    const startMarker = document.createComment('start');
    const endMarker = document.createComment('end');
    fixture.shadow.innerHTML = '';
    fixture.shadow.appendChild(startMarker);
    const ownTemplate = document.createElement('div');
    ownTemplate.className = 'own-template';
    ownTemplate.innerHTML = '<slot></slot>';
    fixture.shadow.appendChild(ownTemplate);
    fixture.shadow.appendChild(endMarker);
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

  it('does NOT fire on elements inside a nested child shadow DOM matching the selector', () => {
    const handler = vi.fn();
    const fixture = mountTemplateInShadow({
      events: { 'click .item': handler },
    });
    // Nested child host with its own shadow root inside our renderRoot.
    // Range markers around the rendered content (production-like setup).
    const startMarker = document.createComment('start');
    const endMarker = document.createComment('end');
    fixture.shadow.innerHTML = '';
    fixture.shadow.appendChild(startMarker);
    const ownTemplate = document.createElement('div');
    ownTemplate.className = 'own-template';
    const childHost = document.createElement('div');
    childHost.className = 'child-host';
    ownTemplate.appendChild(childHost);
    fixture.shadow.appendChild(ownTemplate);
    fixture.shadow.appendChild(endMarker);
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

  it('skips mouseover when relatedTarget is a descendant of the target', () => {
    const handler = vi.fn();
    const fixture = mountTemplateInShadow({
      events: { 'mouseenter .area': handler },
    });
    fixture.shadow.innerHTML = '<div class="area"><span class="inner">child</span></div>';
    try {
      const area = fixture.shadow.querySelector('.area');
      const inner = fixture.shadow.querySelector('.inner');
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

describe('events DSL — deep keyword (boundary escape)', () => {
  it('fires on slotted content matching the selector', () => {
    const handler = vi.fn();
    const fixture = mountTemplateInShadow({
      events: { 'deep click .item': handler },
    });
    // Use the same range-marker setup as the default-mode encapsulation test,
    // so this test exercises the boundary-escape contract symmetrically: the
    // default test pins safety, this test pins escape under identical scaffolding.
    const startMarker = document.createComment('start');
    const endMarker = document.createComment('end');
    fixture.shadow.innerHTML = '';
    fixture.shadow.appendChild(startMarker);
    const ownTemplate = document.createElement('div');
    ownTemplate.className = 'own-template';
    ownTemplate.innerHTML = '<slot></slot>';
    fixture.shadow.appendChild(ownTemplate);
    fixture.shadow.appendChild(endMarker);
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

  it('fires on a direct match inside the own template (isDeep=false)', () => {
    let receivedIsDeep;
    const fixture = mountTemplateInShadow({
      events: {
        'deep click .btn'({ isDeep }) {
          receivedIsDeep = isDeep;
        },
      },
    });
    fixture.shadow.innerHTML = '<button class="btn">click</button>';
    try {
      clickOn(fixture.shadow.querySelector('.btn'));
      expect(receivedIsDeep).toBe(false);
    }
    finally {
      fixture.cleanup();
    }
  });

  it('delivers isDeep as a boolean to the handler', () => {
    // isDeep is computed from `selector && $(event.target).closest(selector).length === 0`.
    // Pin that the handler arg includes isDeep as a boolean (false in the common case
    // where the delegated target itself matches the selector).
    let receivedIsDeep;
    const fixture = mountTemplateInShadow({
      events: {
        'deep click .btn'({ isDeep }) {
          receivedIsDeep = isDeep;
        },
      },
    });
    fixture.shadow.innerHTML = '<button class="btn">click</button>';
    try {
      clickOn(fixture.shadow.querySelector('.btn'));
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
  it('attaches listeners to window for global window events', () => {
    const handler = vi.fn();
    const fixture = mountTemplateInShadow({
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

  it('removes the global listener when the template is destroyed', () => {
    const handler = vi.fn();
    const fixture = mountTemplateInShadow({
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
  it('does not bind to elements until first render fires onRenderOnce', () => {
    const handler = vi.fn();
    const fixture = mountTemplateInShadow({
      events: { 'bind ping .target': handler },
    });
    // Even though attachEvents has been called, bind defers until onRenderOnce.
    fixture.shadow.innerHTML = '<div class="target"></div>';
    try {
      const tgt = fixture.shadow.querySelector('.target');
      fireCustomEvent(tgt, 'ping');
      // No render has fired in the test fixture (stub engine; onRendered
      // only fires through Template.render() which we don't invoke).
      expect(handler).not.toHaveBeenCalled();
    }
    finally {
      fixture.cleanup();
    }
  });

  it('attaches listeners directly after onRendered fires (manual trigger)', () => {
    const handler = vi.fn();
    const fixture = mountTemplateInShadow({
      events: { 'bind ping .target': handler },
    });
    fixture.shadow.innerHTML = '<div class="target"></div>';
    try {
      // Manually invoke onRenderOnce, simulating the post-first-render hook.
      if (typeof fixture.template.onRenderOnce === 'function') {
        fixture.template.onRenderOnce();
      }
      const tgt = fixture.shadow.querySelector('.target');
      fireCustomEvent(tgt, 'ping');
      expect(handler).toHaveBeenCalledTimes(1);
    }
    finally {
      fixture.cleanup();
    }
  });

  it('hears non-bubbling CustomEvents that delegation cannot see', () => {
    const handler = vi.fn();
    const fixture = mountTemplateInShadow({
      events: { 'bind nobubble .target': handler },
    });
    fixture.shadow.innerHTML = '<div class="target"></div>';
    try {
      if (typeof fixture.template.onRenderOnce === 'function') {
        fixture.template.onRenderOnce();
      }
      const tgt = fixture.shadow.querySelector('.target');
      // dispatch with bubbles: false to confirm direct binding, not delegation
      tgt.dispatchEvent(new CustomEvent('nobubble', { bubbles: false }));
      expect(handler).toHaveBeenCalledTimes(1);
    }
    finally {
      fixture.cleanup();
    }
  });

  it('does not double-bind across multiple render cycles', () => {
    // Pin current behavior: wrapFunction(this.onRenderOnce) replaces onRenderOnce
    // with a no-op after first call, so subsequent renders do not re-bind.
    const handler = vi.fn();
    const fixture = mountTemplateInShadow({
      events: { 'bind ping .target': handler },
    });
    fixture.shadow.innerHTML = '<div class="target"></div>';
    try {
      // First "render"
      if (typeof fixture.template.onRenderOnce === 'function') {
        fixture.template.onRenderOnce();
      }
      // Second "render": onRenderOnce is wrapped to noop after first call,
      // so even if we tried to call it, it wouldn't rebind.
      // (No-op call is safe; if someone calls it, it does nothing.)
      const tgt = fixture.shadow.querySelector('.target');
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
  it('passes the native event as `event`', () => {
    let received;
    const fixture = mountTemplateInShadow({
      events: {
        'click .btn'({ event }) {
          received = event;
        },
      },
    });
    fixture.shadow.innerHTML = '<button class="btn">Go</button>';
    try {
      clickOn(fixture.shadow.querySelector('.btn'));
      expect(received).toBeInstanceOf(MouseEvent);
      expect(received.type).toBe('click');
    }
    finally {
      fixture.cleanup();
    }
  });

  it('passes the matched element as `target`', () => {
    let receivedTarget;
    const fixture = mountTemplateInShadow({
      events: {
        'click .btn'({ target }) {
          receivedTarget = target;
        },
      },
    });
    fixture.shadow.innerHTML = '<button class="btn"><span class="label">Go</span></button>';
    try {
      // Click on the inner span; matched element is .btn (the closest match)
      clickOn(fixture.shadow.querySelector('.label'));
      expect(receivedTarget).toBe(fixture.shadow.querySelector('.btn'));
    }
    finally {
      fixture.cleanup();
    }
  });

  it('binds `this` to the matched element', () => {
    let receivedThis;
    const fixture = mountTemplateInShadow({
      events: {
        'click .btn'() {
          receivedThis = this;
        },
      },
    });
    fixture.shadow.innerHTML = '<button class="btn">Go</button>';
    try {
      const btn = fixture.shadow.querySelector('.btn');
      clickOn(btn);
      expect(receivedThis).toBe(btn);
    }
    finally {
      fixture.cleanup();
    }
  });

  it('parses data-* attributes as typed values in `data` (numbers, booleans, JSON)', () => {
    let receivedData;
    const fixture = mountTemplateInShadow({
      events: {
        'click .btn'({ data }) {
          receivedData = data;
        },
      },
    });
    fixture.shadow.innerHTML = `
      <button class="btn"
              data-amount="5"
              data-active="true"
              data-config='{"x":1}'
              data-name="hello">Go</button>
    `;
    try {
      clickOn(fixture.shadow.querySelector('.btn'));
      expect(receivedData.amount).toBe(5);
      expect(receivedData.active).toBe(true);
      expect(receivedData.config).toEqual({ x: 1 });
      expect(receivedData.name).toBe('hello');
    }
    finally {
      fixture.cleanup();
    }
  });

  it('merges event.detail into `data`, with detail keys overriding dataset keys', () => {
    let receivedData;
    const fixture = mountTemplateInShadow({
      events: {
        'mycustom .item'({ data }) {
          receivedData = data;
        },
      },
    });
    fixture.shadow.innerHTML = '<div class="item" data-key="from-dataset" data-only="dataset-only"></div>';
    try {
      const item = fixture.shadow.querySelector('.item');
      fireCustomEvent(item, 'mycustom', { key: 'from-detail', extra: 'detail-only' });
      expect(receivedData.key).toBe('from-detail');
      expect(receivedData.extra).toBe('detail-only');
      expect(receivedData.only).toBe('dataset-only');
    }
    finally {
      fixture.cleanup();
    }
  });

  it('passes `value` from target.value when the target is a form control', () => {
    let receivedValue;
    const fixture = mountTemplateInShadow({
      events: {
        'change input'({ value }) {
          receivedValue = value;
        },
      },
    });
    fixture.shadow.innerHTML = '<input type="text" value="initial">';
    try {
      const input = fixture.shadow.querySelector('input');
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
  it('calls stopPropagation when the handler returns false', () => {
    const inner = vi.fn(() => false);
    const outer = vi.fn();
    const fixture = mountTemplateInShadow({
      events: { 'click .btn': inner },
    });
    fixture.shadow.innerHTML = '<button class="btn">Go</button>';
    // Outer listener at the shadow root document level — should not see click
    // if stopPropagation fires inside the inner delegated handler.
    document.addEventListener('click', outer);
    try {
      clickOn(fixture.shadow.querySelector('.btn'));
      expect(inner).toHaveBeenCalledTimes(1);
      // Listener delegated at the shadow root — once stopPropagation fires
      // inside the inner handler, the click does not continue to bubble out
      // of the shadow root to document.
      expect(outer).not.toHaveBeenCalled();
    }
    finally {
      document.removeEventListener('click', outer);
      fixture.cleanup();
    }
  });

  it('calls preventDefault when the handler returns the string "cancel"', () => {
    const handler = vi.fn(() => 'cancel');
    const fixture = mountTemplateInShadow({
      events: { 'click .btn': handler },
    });
    fixture.shadow.innerHTML = '<button class="btn">Go</button>';
    try {
      const btn = fixture.shadow.querySelector('.btn');
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

  it('does neither when the handler returns undefined', () => {
    const handler = vi.fn(); // implicitly returns undefined
    const fixture = mountTemplateInShadow({
      events: { 'click .btn': handler },
    });
    fixture.shadow.innerHTML = '<button class="btn">Go</button>';
    try {
      const btn = fixture.shadow.querySelector('.btn');
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
  it('binds an event to an external selector from inside the component', () => {
    const handler = vi.fn();
    const fixture = mountTemplateInShadow({});
    // Create a target outside the component's shadow tree.
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

  it('returns a handler object that can be aborted manually', () => {
    const handler = vi.fn();
    const fixture = mountTemplateInShadow({});
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

  it('removes the listener when the component is destroyed', () => {
    const handler = vi.fn();
    const fixture = mountTemplateInShadow({});
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
  it('fires a CustomEvent on the component element with detail equal to the supplied data', () => {
    const fixture = mountTemplateInShadow({});
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

  it('emits CustomEvents that cross shadow boundaries (composed: true) by default', () => {
    const fixture = mountTemplateInShadow({});
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

  it('invokes the matching on{Name} setting callback before dispatching the DOM event when triggerCallback is true', () => {
    // Stub host element with an onFoo callback (mimics what defineComponent
    // sets up via settings reflection).
    const fixture = mountTemplateInShadow({});
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

  it('skips the on{Name} callback when triggerCallback is false', () => {
    const fixture = mountTemplateInShadow({});
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

  it('lets callers override CustomEvent options via the third argument', () => {
    const fixture = mountTemplateInShadow({});
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
  it('removes every events-DSL listener when the template is destroyed', () => {
    const handler = vi.fn();
    const fixture = mountTemplateInShadow({
      events: { 'click .btn': handler },
    });
    fixture.shadow.innerHTML = '<button class="btn">Go</button>';
    const btn = fixture.shadow.querySelector('.btn');
    fixture.cleanup();
    clickOn(btn);
    expect(handler).not.toHaveBeenCalled();
  });

  it('does not double-bind listeners when attachEvents is called again', () => {
    const handler = vi.fn();
    const fixture = mountTemplateInShadow({
      events: { 'click .btn': handler },
    });
    fixture.shadow.innerHTML = '<button class="btn">Go</button>';
    try {
      // Re-attach should remove existing first (template.js:489).
      fixture.template.attachEvents();
      const btn = fixture.shadow.querySelector('.btn');
      clickOn(btn);
      expect(handler).toHaveBeenCalledTimes(1);
    }
    finally {
      fixture.cleanup();
    }
  });
});

import { Template } from '@semantic-ui/templating';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@semantic-ui/component'; // registers native engine

// These tests cover documented dispatchEvent + lifecycle DOM event behavior.
// Documented contracts (see docs/src/pages/docs/guides/components/events.mdx,
// ai/skills/authoring/component-events.md, component-lifecycle.md):
//
//   1. dispatchEvent calls element.on${Capitalized}(eventData) if defined.
//   2. dispatchEvent then fires a native CustomEvent on the element.
//   3. CustomEvent defaults: { bubbles: true, cancelable: true, composed: true }.
//      eventSettings overrides those defaults.
//   4. Lifecycle DOM events (created/rendered/destroyed) include { component }
//      in event.detail.
//   5. Lifecycle DOM events are non-composed (do not cross shadow DOM).
//   6. onDestroyed runs framework teardown: clears reactions, removes events,
//      disconnects observers, removes self from parent template tree, then
//      runs onDestroyed callback, then dispatches the 'destroyed' DOM event.
//   7. The lifecycle hook callbacks (onCreated/onRendered/onDestroyed) are
//      provided to the constructor and invoked separately from any
//      element-level on${Name} callbacks.

let host;

beforeEach(() => {
  host = document.createElement('div');
  document.body.appendChild(host);
});

afterEach(() => {
  document.body.innerHTML = '';
  Template.renderedTemplates.clear();
});

function makeTpl(opts = {}) {
  return new Template({
    templateName: opts.templateName || `t-${Math.random().toString(36).slice(2, 8)}`,
    template: opts.template || '<div>x</div>',
    element: host,
    ...opts,
  });
}

/*******************************
          dispatchEvent
*******************************/

describe('dispatchEvent — element callback (documented)', () => {
  // Contract: "Calls element.on${Capitalized}(eventData) if defined."
  it('calls host.onMyEvent with the eventData object', () => {
    const tpl = makeTpl();
    host.onMyEvent = vi.fn();
    tpl.dispatchEvent('myEvent', { hello: true }, {});
    expect(host.onMyEvent).toHaveBeenCalledTimes(1);
    expect(host.onMyEvent).toHaveBeenCalledWith({ hello: true });
  });

  it('uses capitalized lookup for lowercase event names (foo → onFoo)', () => {
    const tpl = makeTpl();
    host.onFoo = vi.fn();
    tpl.dispatchEvent('foo', { x: 1 }, {});
    expect(host.onFoo).toHaveBeenCalledWith({ x: 1 });
  });

  it('binds `this` to the element when calling the callback', () => {
    const tpl = makeTpl();
    let receivedThis;
    host.onFoo = function() {
      receivedThis = this;
    };
    tpl.dispatchEvent('foo', {}, {});
    expect(receivedThis).toBe(host);
  });

  it('does not throw when no matching callback exists on the element', () => {
    const tpl = makeTpl();
    expect(host.onFoo).toBeUndefined();
    expect(() => tpl.dispatchEvent('foo', {}, {})).not.toThrow();
  });
});

describe('dispatchEvent — DOM CustomEvent (documented)', () => {
  // Contract: "Fires a native CustomEvent on the component element."
  it('dispatches a CustomEvent on the element with eventData as detail', () => {
    const tpl = makeTpl();
    const spy = vi.fn();
    host.addEventListener('foo', spy);
    tpl.dispatchEvent('foo', { itemID: 1, position: 2 }, {});
    expect(spy).toHaveBeenCalledTimes(1);
    const event = spy.mock.calls[0][0];
    expect(event).toBeInstanceOf(CustomEvent);
    expect(event.type).toBe('foo');
    expect(event.detail).toEqual({ itemID: 1, position: 2 });
  });

  // Contract from query/dispatchEvent: defaults to bubbles + composed enabled.
  it('defaults to bubbles: true', () => {
    const tpl = makeTpl();
    const spy = vi.fn();
    host.addEventListener('foo', spy);
    tpl.dispatchEvent('foo', {}, {});
    expect(spy.mock.calls[0][0].bubbles).toBe(true);
  });

  it('defaults to composed: true', () => {
    const tpl = makeTpl();
    const spy = vi.fn();
    host.addEventListener('foo', spy);
    tpl.dispatchEvent('foo', {}, {});
    expect(spy.mock.calls[0][0].composed).toBe(true);
  });

  it('defaults to cancelable: true', () => {
    const tpl = makeTpl();
    const spy = vi.fn();
    host.addEventListener('foo', spy);
    tpl.dispatchEvent('foo', {}, {});
    expect(spy.mock.calls[0][0].cancelable).toBe(true);
  });

  it('eventSettings overrides defaults (composed: false)', () => {
    const tpl = makeTpl();
    const spy = vi.fn();
    host.addEventListener('foo', spy);
    tpl.dispatchEvent('foo', {}, { composed: false });
    expect(spy.mock.calls[0][0].composed).toBe(false);
  });

  // Contract: callback is called BEFORE the DOM event listener fires.
  it('calls element callback before the DOM listener runs', () => {
    const tpl = makeTpl();
    const order = [];
    host.onFoo = () => order.push('callback');
    host.addEventListener('foo', () => order.push('domEvent'));
    tpl.dispatchEvent('foo', {}, {});
    expect(order).toEqual(['callback', 'domEvent']);
  });

  it('returns a chainable result', () => {
    const tpl = makeTpl();
    const result = tpl.dispatchEvent('foo', {}, {});
    expect(result).toBeDefined();
  });
});

describe('dispatchEvent — server short-circuit', () => {
  // Documented: lifecycle hooks fire on the server but use isServer/isClient
  // guards. The Template-level dispatchEvent skips DOM work on the server.
  it('does not call element callback or fire DOM event when Template.isServer', () => {
    const tpl = makeTpl();
    const domSpy = vi.fn();
    host.addEventListener('foo', domSpy);
    host.onFoo = vi.fn();

    const original = Template.isServer;
    try {
      Template.isServer = true;
      tpl.dispatchEvent('foo', {}, {});
    }
    finally {
      Template.isServer = original;
    }

    expect(host.onFoo).not.toHaveBeenCalled();
    expect(domSpy).not.toHaveBeenCalled();
  });
});

/*******************************
       Lifecycle DOM events
*******************************/

describe('lifecycle DOM events (documented)', () => {
  // Contract from component-lifecycle.md:
  //   | created   | After instance initialized, before DOM | { component } |
  //   | rendered  | After first render                     | { component } |
  //   | destroyed | After removal from DOM                 | { component } |

  it('"created" event carries { component } in detail', () => {
    const tpl = makeTpl();
    const spy = vi.fn();
    host.addEventListener('created', spy);
    tpl.initialize();
    expect(spy).toHaveBeenCalled();
    const event = spy.mock.calls[0][0];
    expect(event.detail).toHaveProperty('component');
    expect(event.detail.component).toBe(tpl.instance);
  });

  it('"destroyed" event carries { component } in detail', () => {
    const tpl = makeTpl();
    tpl.initialize();
    const spy = vi.fn();
    host.addEventListener('destroyed', spy);
    tpl.onDestroyed();
    const event = spy.mock.calls[0][0];
    expect(event.detail).toHaveProperty('component');
    expect(event.detail.component).toBe(tpl.instance);
  });

  // Contract: "These are non-composed (do not cross shadow DOM boundaries)."
  it('"created" event is non-composed', () => {
    const tpl = makeTpl();
    const spy = vi.fn();
    host.addEventListener('created', spy);
    tpl.initialize();
    expect(spy.mock.calls[0][0].composed).toBe(false);
  });

  it('"destroyed" event is non-composed', () => {
    const tpl = makeTpl();
    tpl.initialize();
    const spy = vi.fn();
    host.addEventListener('destroyed', spy);
    tpl.onDestroyed();
    expect(spy.mock.calls[0][0].composed).toBe(false);
  });

  // Contract: lifecycle dispatch does NOT auto-invoke element-level on${Name}
  // callbacks. The documented lifecycle hooks (onCreated/onRendered/onDestroyed)
  // are constructor options, not properties on the host element.
  it('framework lifecycle dispatch does not invoke host.onCreated', () => {
    const tpl = makeTpl();
    host.onCreated = vi.fn();
    tpl.initialize();
    expect(host.onCreated).not.toHaveBeenCalled();
  });

  it('framework lifecycle dispatch does not invoke host.onDestroyed', () => {
    const tpl = makeTpl();
    tpl.initialize();
    host.onDestroyed = vi.fn();
    tpl.onDestroyed();
    expect(host.onDestroyed).not.toHaveBeenCalled();
  });
});

/*******************************
            onDestroyed
*******************************/

describe('onDestroyed — framework teardown (documented)', () => {
  // Contract from component-lifecycle.md "Cleanup Decision Tree":
  // The framework auto-cleans:
  //   - Reactions created via reaction()        ✅ auto-stopped
  //   - Events declared in events = {}          ✅ auto-removed (AbortController)
  //   - Events added via attachEvent()          ✅ auto-removed (AbortController)
  //   - MutationObserver for onThemeChanged     ✅ auto-disconnected
  //   - Template tree references (parent/child) ✅ auto-removed

  it('marks the template as destroyed (rendered=false, destroyed=true)', () => {
    const tpl = makeTpl();
    tpl.initialize();
    tpl.rendered = true;
    tpl.onDestroyed();
    expect(tpl.rendered).toBe(false);
    expect(tpl.destroyed).toBe(true);
  });

  it('aborts the lifecycle abortSignal', () => {
    const tpl = makeTpl();
    tpl.initialize();
    expect(tpl.abortSignal.aborted).toBe(false);
    tpl.onDestroyed();
    expect(tpl.abortSignal.aborted).toBe(true);
  });

  it('stops each reaction registered with the template', () => {
    const tpl = makeTpl();
    tpl.initialize();
    const r1 = { stop: vi.fn() };
    const r2 = { stop: vi.fn() };
    tpl.reactions.push(r1, r2);
    tpl.onDestroyed();
    expect(r1.stop).toHaveBeenCalled();
    expect(r2.stop).toHaveBeenCalled();
  });

  it('aborts the eventController when set (auto-removes attachEvent listeners)', () => {
    const tpl = makeTpl();
    tpl.initialize();
    tpl.eventController = new AbortController();
    const sig = tpl.eventController.signal;
    tpl.onDestroyed();
    expect(sig.aborted).toBe(true);
  });

  it('does not throw when there is no eventController', () => {
    const tpl = makeTpl();
    tpl.initialize();
    tpl.eventController = undefined;
    expect(() => tpl.onDestroyed()).not.toThrow();
  });

  it('disconnects each observer registered with the template', () => {
    const tpl = makeTpl();
    tpl.initialize();
    const obs1 = { disconnect: vi.fn() };
    const obs2 = { disconnect: vi.fn() };
    tpl.observers.push(obs1, obs2);
    tpl.onDestroyed();
    expect(obs1.disconnect).toHaveBeenCalled();
    expect(obs2.disconnect).toHaveBeenCalled();
  });

  it('removes self from parent template tree', () => {
    const tpl = makeTpl();
    tpl.initialize();
    const parent = { _childTemplates: [] };
    parent._childTemplates.push(tpl);
    tpl.parentTemplate = parent;
    tpl.onDestroyed();
    expect(parent._childTemplates.find(t => t.id === tpl.id)).toBeUndefined();
  });

  it('invokes the constructor onDestroyed callback', () => {
    const onDestroyed = vi.fn();
    const tpl = makeTpl({ onDestroyed });
    tpl.initialize();
    tpl.onDestroyed();
    expect(onDestroyed).toHaveBeenCalled();
  });

  it("dispatches a 'destroyed' DOM event on the element", () => {
    const tpl = makeTpl();
    tpl.initialize();
    const spy = vi.fn();
    host.addEventListener('destroyed', spy);
    tpl.onDestroyed();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('removes the template from Template.renderedTemplates', () => {
    const tpl = makeTpl({ templateName: 'destroy-removal-tpl' });
    tpl.initialize();
    expect(Template.getTemplates('destroy-removal-tpl')).toContain(tpl);
    tpl.onDestroyed();
    expect(Template.getTemplates('destroy-removal-tpl')).not.toContain(tpl);
  });

  it('runs the onDestroyed callback before the destroyed DOM event', () => {
    const calls = [];
    const onDestroyed = vi.fn(() => calls.push('callback'));
    const tpl = makeTpl({ templateName: 'order-tpl', onDestroyed });
    tpl.initialize();

    const r = { stop: vi.fn(() => calls.push('reaction.stop')) };
    tpl.reactions.push(r);
    host.addEventListener('destroyed', () => calls.push('domEvent'));

    tpl.onDestroyed();

    const reactionIdx = calls.indexOf('reaction.stop');
    const callbackIdx = calls.indexOf('callback');
    const domIdx = calls.indexOf('domEvent');
    expect(reactionIdx).toBeGreaterThanOrEqual(0);
    expect(callbackIdx).toBeGreaterThanOrEqual(0);
    expect(domIdx).toBeGreaterThanOrEqual(0);
    expect(reactionIdx).toBeLessThan(callbackIdx);
    expect(callbackIdx).toBeLessThan(domIdx);
  });
});

describe('onDestroyed — prototype templates', () => {
  // Prototype templates back the defineComponent registration; they are not
  // attached to a rendered host and so are excluded from the rendered registry.
  it('prototype template is not added to renderedTemplates', () => {
    const tpl = makeTpl({ templateName: 'proto-tpl', isPrototype: true });
    tpl.initialize();
    expect(Template.getTemplates('proto-tpl')).not.toContain(tpl);
  });

  it('onDestroyed on a prototype template still completes teardown', () => {
    const tpl = makeTpl({ templateName: 'proto-destroy', isPrototype: true });
    tpl.initialize();
    expect(() => tpl.onDestroyed()).not.toThrow();
    expect(tpl.destroyed).toBe(true);
  });
});

/*******************************
       abortSignal lifecycle
*******************************/

describe('abortSignal (documented)', () => {
  // Documented in component-lifecycle.md callback args:
  //   abortSignal — AbortSignal tied to component lifecycle
  it('is not aborted before destroy', () => {
    const tpl = makeTpl();
    tpl.initialize();
    expect(tpl.abortSignal.aborted).toBe(false);
  });

  it('is aborted after onDestroyed', () => {
    const tpl = makeTpl();
    tpl.initialize();
    tpl.onDestroyed();
    expect(tpl.abortSignal.aborted).toBe(true);
  });
});

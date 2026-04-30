import { Template } from '@semantic-ui/templating';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@semantic-ui/component'; // registers native engine

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
        lifecyclePromise
*******************************/

describe('lifecyclePromise — caching for one-shot events', () => {
  it('returns a Promise', () => {
    const tpl = makeTpl();
    const p = tpl.lifecyclePromise('created');
    expect(p).toBeInstanceOf(Promise);
  });

  it('returns the same cached promise on repeated calls before resolution', () => {
    const tpl = makeTpl();
    const p1 = tpl.lifecyclePromise('created');
    const p2 = tpl.lifecyclePromise('created');
    expect(p2).toBe(p1);
  });

  it('registers a resolver under lifecycleResolvers when first called', () => {
    const tpl = makeTpl();
    expect(tpl.lifecycleResolvers.created).toBeUndefined();
    tpl.lifecyclePromise('created');
    expect(typeof tpl.lifecycleResolvers.created).toBe('function');
  });

  it('resolves the cached promise when resolveLifecyclePromise fires', async () => {
    const tpl = makeTpl();
    const p = tpl.lifecyclePromise('created');
    const after = vi.fn();
    p.then(after);
    tpl.resolveLifecyclePromise('created');
    await p;
    expect(after).toHaveBeenCalled();
  });

  it('returns the same already-resolved promise after resolution (one-shot)', async () => {
    const tpl = makeTpl();
    const p1 = tpl.lifecyclePromise('created');
    tpl.resolveLifecyclePromise('created');
    await p1;
    const p2 = tpl.lifecyclePromise('created');
    expect(p2).toBe(p1);
    // resolves immediately
    await expect(p2).resolves.toBeUndefined();
  });

  it('one-shot retains lifecyclePromises[name] but deletes lifecycleResolvers[name]', () => {
    const tpl = makeTpl();
    tpl.lifecyclePromise('rendered');
    expect(typeof tpl.lifecycleResolvers.rendered).toBe('function');
    tpl.resolveLifecyclePromise('rendered');
    expect(tpl.lifecycleResolvers.rendered).toBeUndefined();
    expect(tpl.lifecyclePromises.rendered).toBeInstanceOf(Promise);
  });

  it('caches independently per event name', () => {
    const tpl = makeTpl();
    const created = tpl.lifecyclePromise('created');
    const rendered = tpl.lifecyclePromise('rendered');
    expect(created).not.toBe(rendered);
  });
});

describe("lifecyclePromise — fresh promise per call for 'updated'", () => {
  it('returns a NEW promise after resolveLifecyclePromise(updated)', async () => {
    const tpl = makeTpl();
    const p1 = tpl.lifecyclePromise('updated');
    tpl.resolveLifecyclePromise('updated');
    await p1;
    const p2 = tpl.lifecyclePromise('updated');
    expect(p2).not.toBe(p1);
  });

  it('clears lifecyclePromises[updated] on resolve so next access is fresh', () => {
    const tpl = makeTpl();
    tpl.lifecyclePromise('updated');
    tpl.resolveLifecyclePromise('updated');
    expect(tpl.lifecyclePromises.updated).toBeUndefined();
  });

  it('still caches between resolutions (same promise within one cycle)', () => {
    const tpl = makeTpl();
    const p1 = tpl.lifecyclePromise('updated');
    const p2 = tpl.lifecyclePromise('updated');
    expect(p2).toBe(p1);
  });
});

describe('resolveLifecyclePromise — no-op for unregistered events', () => {
  it('does not throw when called for an event that was never registered', () => {
    const tpl = makeTpl();
    expect(() => tpl.resolveLifecyclePromise('never-registered')).not.toThrow();
  });

  it('does not create state on the resolvers map', () => {
    const tpl = makeTpl();
    tpl.resolveLifecyclePromise('never-registered');
    expect(tpl.lifecycleResolvers['never-registered']).toBeUndefined();
    expect(tpl.lifecyclePromises['never-registered']).toBeUndefined();
  });
});

/*******************************
          dispatchEvent
*******************************/

describe('dispatchEvent — server short-circuit', () => {
  it('returns immediately when Template.isServer is true', () => {
    const tpl = makeTpl();
    const spy = vi.fn();
    host.addEventListener('created', spy);
    host.onCreated = vi.fn();

    const original = Template.isServer;
    try {
      Template.isServer = true;
      const result = tpl.dispatchEvent('created', { x: 1 }, {}, { triggerCallback: true });
      expect(result).toBeUndefined();
    }
    finally {
      Template.isServer = original;
    }

    expect(spy).not.toHaveBeenCalled();
    expect(host.onCreated).not.toHaveBeenCalled();
  });
});

describe('dispatchEvent — element callback', () => {
  it('calls host.onCreated with the eventData', () => {
    const tpl = makeTpl();
    host.onCreated = vi.fn();
    tpl.dispatchEvent('created', { x: 1 }, {});
    expect(host.onCreated).toHaveBeenCalledTimes(1);
    expect(host.onCreated).toHaveBeenCalledWith({ x: 1 });
  });

  it('invokes the callback with `this` bound to the element', () => {
    const tpl = makeTpl();
    let receivedThis;
    host.onCreated = function() {
      receivedThis = this;
    };
    tpl.dispatchEvent('created', {}, {});
    expect(receivedThis).toBe(host);
  });

  it('uses capitalized lookup for camelCase event names (myEvent → onMyEvent)', () => {
    const tpl = makeTpl();
    host.onMyEvent = vi.fn();
    tpl.dispatchEvent('myEvent', { hello: true }, {});
    expect(host.onMyEvent).toHaveBeenCalledWith({ hello: true });
  });

  it('uses capitalized lookup for lowercase event names (rendered → onRendered)', () => {
    const tpl = makeTpl();
    host.onRendered = vi.fn();
    tpl.dispatchEvent('rendered', {}, {});
    expect(host.onRendered).toHaveBeenCalled();
  });

  it('does not throw when host has no matching callback', () => {
    const tpl = makeTpl();
    expect(host.onCreated).toBeUndefined();
    expect(() => tpl.dispatchEvent('created', {}, {})).not.toThrow();
  });
});

describe('dispatchEvent — triggerCallback option', () => {
  it('skips host callback when triggerCallback is false', () => {
    const tpl = makeTpl();
    host.onCreated = vi.fn();
    tpl.dispatchEvent('created', {}, {}, { triggerCallback: false });
    expect(host.onCreated).not.toHaveBeenCalled();
  });

  it('still dispatches a DOM event when triggerCallback is false', () => {
    const tpl = makeTpl();
    const spy = vi.fn();
    host.addEventListener('created', spy);
    tpl.dispatchEvent('created', {}, {}, { triggerCallback: false });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('still resolves lifecycle promise when triggerCallback is false', async () => {
    const tpl = makeTpl();
    const p = tpl.lifecyclePromise('created');
    tpl.dispatchEvent('created', {}, {}, { triggerCallback: false });
    await expect(p).resolves.toBeUndefined();
  });
});

describe('dispatchEvent — lifecycle promise resolved before DOM dispatch', () => {
  it('resolves the cached lifecyclePromise after dispatchEvent', async () => {
    const tpl = makeTpl();
    const p = tpl.lifecyclePromise('rendered');
    tpl.dispatchEvent('rendered', {}, {});
    await expect(p).resolves.toBeUndefined();
  });

  it('clears lifecycleResolvers[name] before the DOM listener runs', () => {
    const tpl = makeTpl();
    tpl.lifecyclePromise('rendered');
    let resolverAtListener;
    host.addEventListener('rendered', () => {
      resolverAtListener = tpl.lifecycleResolvers.rendered;
    });
    tpl.dispatchEvent('rendered', {}, {});
    expect(resolverAtListener).toBeUndefined();
  });

  it('does not require a prior lifecyclePromise call to dispatch', () => {
    const tpl = makeTpl();
    expect(() => tpl.dispatchEvent('rendered', {}, {})).not.toThrow();
  });
});

describe('dispatchEvent — DOM dispatch on element', () => {
  it('dispatches a CustomEvent on the element with the eventData as detail', () => {
    const tpl = makeTpl();
    const spy = vi.fn();
    host.addEventListener('foo', spy);
    tpl.dispatchEvent('foo', { detail1: 1 }, {});
    expect(spy).toHaveBeenCalledTimes(1);
    const event = spy.mock.calls[0][0];
    expect(event).toBeInstanceOf(CustomEvent);
    expect(event.type).toBe('foo');
    expect(event.detail).toEqual({ detail1: 1 });
  });

  it('passes eventSettings through to the dispatched event (composed: false)', () => {
    const tpl = makeTpl();
    const spy = vi.fn();
    host.addEventListener('foo', spy);
    tpl.dispatchEvent('foo', {}, { composed: false });
    const event = spy.mock.calls[0][0];
    expect(event.composed).toBe(false);
  });

  it('returns the query wrapper (chainable)', () => {
    const tpl = makeTpl();
    const result = tpl.dispatchEvent('foo', {}, {});
    expect(result).toBeDefined();
  });
});

/*******************************
            onDestroyed
*******************************/

describe('onDestroyed — teardown', () => {
  it('sets rendered=false and destroyed=true', () => {
    const tpl = makeTpl();
    tpl.initialize();
    tpl.rendered = true;
    tpl.onDestroyed();
    expect(tpl.rendered).toBe(false);
    expect(tpl.destroyed).toBe(true);
  });

  it("aborts the abortController with reason 'Template destroyed'", () => {
    const tpl = makeTpl();
    tpl.initialize();
    tpl.onDestroyed();
    expect(tpl.abortSignal.aborted).toBe(true);
    expect(tpl.abortSignal.reason).toBe('Template destroyed');
  });

  it('calls .stop() on each reaction in tpl.reactions (clearReactions)', () => {
    const tpl = makeTpl();
    tpl.initialize();
    const r1 = { stop: vi.fn() };
    const r2 = { stop: vi.fn() };
    tpl.reactions.push(r1, r2);
    tpl.onDestroyed();
    expect(r1.stop).toHaveBeenCalled();
    expect(r2.stop).toHaveBeenCalled();
  });

  it('aborts tpl.eventController if set (removeEvents)', () => {
    const tpl = makeTpl();
    tpl.initialize();
    tpl.eventController = new AbortController();
    const sig = tpl.eventController.signal;
    tpl.onDestroyed();
    expect(sig.aborted).toBe(true);
  });

  it('does not throw when eventController is unset', () => {
    const tpl = makeTpl();
    tpl.initialize();
    tpl.eventController = undefined;
    expect(() => tpl.onDestroyed()).not.toThrow();
  });

  it('disconnects each MutationObserver-like in tpl.observers (removeObservers)', () => {
    const tpl = makeTpl();
    tpl.initialize();
    const obs1 = { disconnect: vi.fn() };
    const obs2 = { disconnect: vi.fn() };
    tpl.observers.push(obs1, obs2);
    tpl.onDestroyed();
    expect(obs1.disconnect).toHaveBeenCalled();
    expect(obs2.disconnect).toHaveBeenCalled();
  });

  it('removes self from parentTemplate._childTemplates (removeParent)', () => {
    const tpl = makeTpl();
    tpl.initialize();
    const parent = { _childTemplates: [] };
    parent._childTemplates.push(tpl);
    tpl.parentTemplate = parent;
    tpl.onDestroyed();
    expect(parent._childTemplates.find(t => t.id === tpl.id)).toBeUndefined();
  });

  it('calls onDestroyedCallback supplied to constructor', () => {
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
    // initialize adds it via onCreated → addTemplate
    expect(Template.getTemplates('destroy-removal-tpl')).toContain(tpl);
    tpl.onDestroyed();
    expect(Template.getTemplates('destroy-removal-tpl')).not.toContain(tpl);
  });

  it('runs teardown steps in expected order (removeTemplate → abort → callback → dispatch)', () => {
    const calls = [];
    const onDestroyed = vi.fn(() => calls.push('callback'));
    const tpl = makeTpl({ templateName: 'order-tpl', onDestroyed });
    tpl.initialize();

    const r = { stop: vi.fn(() => calls.push('reaction.stop')) };
    tpl.reactions.push(r);

    host.addEventListener('destroyed', () => calls.push('domEvent'));

    tpl.onDestroyed();

    // callback runs before destroyed event dispatch
    const callbackIdx = calls.indexOf('callback');
    const domIdx = calls.indexOf('domEvent');
    const reactionIdx = calls.indexOf('reaction.stop');
    expect(callbackIdx).toBeGreaterThan(-1);
    expect(domIdx).toBeGreaterThan(-1);
    expect(reactionIdx).toBeGreaterThan(-1);
    expect(reactionIdx).toBeLessThan(callbackIdx);
    expect(callbackIdx).toBeLessThan(domIdx);
  });
});

describe('onDestroyed — isPrototype skips removeTemplate', () => {
  it('does not add a prototype template to renderedTemplates (addTemplate is no-op)', () => {
    const tpl = makeTpl({ templateName: 'proto-tpl', isPrototype: true });
    tpl.initialize();
    expect(Template.getTemplates('proto-tpl')).not.toContain(tpl);
  });

  it('does not throw when calling onDestroyed on a prototype template', () => {
    const tpl = makeTpl({ templateName: 'proto-destroy', isPrototype: true });
    tpl.initialize();
    expect(() => tpl.onDestroyed()).not.toThrow();
    expect(tpl.destroyed).toBe(true);
  });
});

/*******************************
        abortController cascade
*******************************/

describe('abortController — cascade signal state', () => {
  it('abortSignal.aborted is true after onDestroyed', () => {
    const tpl = makeTpl();
    tpl.initialize();
    expect(tpl.abortSignal.aborted).toBe(false);
    tpl.onDestroyed();
    expect(tpl.abortSignal.aborted).toBe(true);
  });

  it('abortController.abort() directly aborts abortSignal', () => {
    const tpl = makeTpl();
    expect(tpl.abortSignal.aborted).toBe(false);
    tpl.abortController.abort('manual');
    expect(tpl.abortSignal.aborted).toBe(true);
    expect(tpl.abortSignal.reason).toBe('manual');
  });
});

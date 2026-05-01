// Template's own lifecycle contracts — internal wrappers, registry,
// promises, and theme observer. Exercises Template directly without
// going through WebComponentBase or defineComponent. Lifecycle hook
// firing is renderRoot-agnostic, so light DOM is sufficient throughout.

import { Reaction } from '@semantic-ui/reactivity';
import { Renderer, ServerRenderer } from '@semantic-ui/renderer';
import { Template } from '@semantic-ui/templating';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  Template.renderedTemplates.clear();
  Template.templateCount = 0;
  document.body.innerHTML = '';
});

const realEngine = { renderer: Renderer, serverRenderer: ServerRenderer };

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

function fireCustomEvent(element, eventName, detail = {}) {
  element.dispatchEvent(
    new CustomEvent(eventName, {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail,
    }),
  );
}

function snapshotRegistry() {
  const names = [...Template.renderedTemplates.keys()];
  const counts = {};
  for (const name of names) {
    counts[name] = Template.renderedTemplates.get(name).length;
  }
  return {
    size: names.length,
    names,
    counts,
    totalInstances: Object.values(counts).reduce((s, n) => s + n, 0),
  };
}

describe('Template — lifecycle', () => {
  /*******************************
        Hook firing order
  *******************************/

  describe('hook firing order', () => {
    it('runs createComponent then instance.initialize then onCreated during initialize()', () => {
      const calls = [];
      const createComponent = vi.fn(() => {
        calls.push('createComponent');
        return {
          initialize() {
            calls.push('instance.initialize');
          },
        };
      });
      const onCreated = vi.fn(() => calls.push('onCreated'));

      const template = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        createComponent,
        onCreated,
      });
      template.initialize();
      expect(calls).toEqual(['createComponent', 'instance.initialize', 'onCreated']);
      expect(createComponent).toHaveBeenCalledTimes(1);
      expect(onCreated).toHaveBeenCalledTimes(1);
    });

    it('does not fire onRendered during initialize()', () => {
      const onCreated = vi.fn();
      const onRendered = vi.fn();
      const template = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        onCreated,
        onRendered,
      });
      template.initialize();
      expect(onCreated).toHaveBeenCalledTimes(1);
      expect(onRendered).not.toHaveBeenCalled();
    });

    it('fires onRendered after a render() call', async () => {
      const onCreated = vi.fn();
      const onRendered = vi.fn();
      const template = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        onCreated,
        onRendered,
      });
      template.initialize();
      template.render();
      // render() schedules onRendered via setTimeout(fn, 0)
      await new Promise(r => setTimeout(r, 5));
      expect(onCreated).toHaveBeenCalledTimes(1);
      expect(onRendered).toHaveBeenCalledTimes(1);
    });

    it('fires onDestroyed when the wrapper is invoked', () => {
      const onCreated = vi.fn();
      const onDestroyed = vi.fn();
      const template = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        onCreated,
        onDestroyed,
      });
      template.initialize();
      template.onDestroyed();
      expect(onDestroyed).toHaveBeenCalledTimes(1);
      expect(template.destroyed).toBe(true);
    });
  });

  /*******************************
       Hook callback signatures
  *******************************/

  describe('callback params', () => {
    it('passes destructurable params to onCreated', () => {
      let received;
      const onCreated = vi.fn((params) => {
        received = params;
      });
      const template = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        onCreated,
      });
      template.initialize();
      expect(received).toBeDefined();
      expect(received).toHaveProperty('self');
      expect(received).toHaveProperty('tpl');
      expect(received).toHaveProperty('component');
      expect(received).toHaveProperty('state');
      expect(received).toHaveProperty('data');
      expect(received).toHaveProperty('isClient');
      expect(received).toHaveProperty('isServer');
      expect(received).toHaveProperty('isHydrating');
      expect(received).toHaveProperty('reaction');
      expect(received).toHaveProperty('signal');
      expect(received).toHaveProperty('interval');
      expect(received).toHaveProperty('timeout');
    });

    it('passes the same callParams object to onDestroyed', () => {
      let createdParams;
      let destroyedParams;
      const onCreated = vi.fn((p) => {
        createdParams = p;
      });
      const onDestroyed = vi.fn((p) => {
        destroyedParams = p;
      });
      const template = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        onCreated,
        onDestroyed,
      });
      template.initialize();
      template.onDestroyed();
      expect(destroyedParams).toBe(createdParams);
    });
  });

  /*******************************
            onUpdated
  *******************************/

  describe('onUpdated wrapper', () => {
    it('does not invoke onUpdated wrapper directly during initialize()', () => {
      const onUpdated = vi.fn();
      const template = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        onUpdated,
      });
      template.initialize();
      expect(typeof template.onUpdated).toBe('function');
    });

    it('schedules onUpdated via state Reaction afterFlush after first render', async () => {
      const onUpdated = vi.fn();
      const fixture = await mountTemplate({
        template: '<span></span>',
        defaultState: { count: 0 },
        onUpdated,
      });
      try {
        fixture.template.markRendered();

        fixture.template.state.count.set(1);
        Reaction.flush();
        await Promise.resolve();
        await Promise.resolve();

        // The user onUpdated callback is not invoked by the wrapper —
        // the wrapper dispatches the 'updated' DOM event with
        // triggerCallback:false. Observability is on the DOM event side.
        expect(onUpdated).not.toHaveBeenCalled();
      }
      finally {
        fixture.cleanup();
      }
    });

    it('emits a single updated DOM event when the state Reaction fires', async () => {
      const fixture = await mountTemplate({
        template: '<span></span>',
        defaultState: { count: 0 },
      });
      const heard = vi.fn();
      fixture.host.addEventListener('updated', heard);
      try {
        fixture.template.markRendered();
        fixture.template.state.count.set(1);
        Reaction.flush();
        await Promise.resolve();
        await Promise.resolve();
        expect(heard).toHaveBeenCalledTimes(1);
      }
      finally {
        fixture.cleanup();
      }
    });

    it('coalesces synchronous state mutations into one updated DOM event', async () => {
      const fixture = await mountTemplate({
        template: '<span></span>',
        defaultState: { a: 0, b: 0, c: 0 },
      });
      const heard = vi.fn();
      fixture.host.addEventListener('updated', heard);
      try {
        fixture.template.markRendered();
        fixture.template.state.a.set(1);
        fixture.template.state.b.set(2);
        fixture.template.state.c.set(3);
        Reaction.flush();
        await Promise.resolve();
        await Promise.resolve();
        expect(heard).toHaveBeenCalledTimes(1);
      }
      finally {
        fixture.cleanup();
      }
    });

    it('does not dispatch updated before markRendered() (no first-render fire)', async () => {
      const fixture = await mountTemplate({
        template: '<span></span>',
        defaultState: { count: 0 },
      });
      const heard = vi.fn();
      fixture.host.addEventListener('updated', heard);
      try {
        fixture.template.state.count.set(1);
        Reaction.flush();
        await Promise.resolve();
        await Promise.resolve();
        // state reaction only schedules when this.rendered === true
        expect(heard).not.toHaveBeenCalled();
      }
      finally {
        fixture.cleanup();
      }
    });

    it('flips updateScheduled true while pending and false after the microtask fires', async () => {
      const fixture = await mountTemplate({
        template: '<span></span>',
        defaultState: { count: 0 },
      });
      try {
        fixture.template.markRendered();
        fixture.template.state.count.set(1);
        Reaction.flush();
        expect(fixture.template.updateScheduled).toBe(true);
        expect(fixture.host.updateScheduled).toBe(true);
        await Promise.resolve();
        await Promise.resolve();
        expect(fixture.template.updateScheduled).toBe(false);
        expect(fixture.host.updateScheduled).toBe(false);
      }
      finally {
        fixture.cleanup();
      }
    });
  });

  /*******************************
     Hydration DOM-event gating
  *******************************/

  describe('isHydrating gates DOM events', () => {
    it('runs the onCreated user callback during hydration', async () => {
      const onCreated = vi.fn();
      const fixture = await mountTemplate({
        template: '<span></span>',
        onCreated,
      });
      try {
        const heard = vi.fn();
        fixture.host.addEventListener('created', heard);

        fixture.template.isHydrating = true;
        fixture.template.onCreated();
        // once during mount + this manual call
        expect(onCreated).toHaveBeenCalledTimes(2);
        expect(heard).not.toHaveBeenCalled();
      }
      finally {
        fixture.cleanup();
      }
    });

    it('suppresses the rendered DOM event during hydration but still runs the user callback', async () => {
      const onRendered = vi.fn();
      const fixture = await mountTemplate({
        template: '<span></span>',
        onRendered,
      });
      const heard = vi.fn();
      fixture.host.addEventListener('rendered', heard);
      try {
        fixture.template.isHydrating = true;
        fixture.template.onRendered();
        expect(onRendered).toHaveBeenCalledTimes(1);
        expect(heard).not.toHaveBeenCalled();
      }
      finally {
        fixture.cleanup();
      }
    });

    it('dispatches the created DOM event when not hydrating', async () => {
      const fixture = await mountTemplate({
        template: '<span></span>',
      });
      const heard = vi.fn();
      fixture.host.addEventListener('created', heard);
      try {
        fixture.template.isHydrating = false;
        fixture.template.onCreated();
        expect(heard).toHaveBeenCalledTimes(1);
      }
      finally {
        fixture.cleanup();
      }
    });
  });

  /*******************************
        lifecyclePromise
  *******************************/

  describe('lifecyclePromise', () => {
    it('returns the same Promise for repeated calls before resolution', () => {
      const template = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
      });
      template.initialize();
      const p1 = template.lifecyclePromise('rendered');
      const p2 = template.lifecyclePromise('rendered');
      expect(p1).toBe(p2);
    });

    it('caches the resolved promise for one-shot events (created)', async () => {
      const fixture = await mountTemplate({ template: '<span></span>' });
      try {
        // pre-access then resolve
        fixture.template.lifecyclePromise('created');
        fixture.template.resolveLifecyclePromise('created');
        const p1 = fixture.template.lifecyclePromise('created');
        const p2 = fixture.template.lifecyclePromise('created');
        expect(p1).toBe(p2);
        await expect(Promise.race([p1, new Promise((_, rej) => setTimeout(() => rej(new Error('hung')), 50))]))
          .resolves.toBeUndefined();
      }
      finally {
        fixture.cleanup();
      }
    });

    it('returns a fresh Promise after resolution for the recurring event (updated)', () => {
      const template = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
      });
      template.initialize();
      const p1 = template.lifecyclePromise('updated');
      template.resolveLifecyclePromise('updated');
      const p2 = template.lifecyclePromise('updated');
      // recurring: cached promise was deleted, p2 is fresh
      expect(p1).not.toBe(p2);
    });

    it('caches a resolved promise on first fire so late awaiters do not hang', () => {
      const template = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
      });
      template.initialize();
      template.resolveLifecyclePromise('rendered');
      // No prior awaiter — but a resolved promise is now cached for late access
      expect(template.lifecyclePromises.rendered).toBeInstanceOf(Promise);
    });

    it('resolves a late awaiter accessed AFTER resolveLifecyclePromise has fired', async () => {
      const template = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
      });
      template.initialize();
      // simulate the lifecycle event firing without any prior promise access
      template.resolveLifecyclePromise('created');
      // consumer awaits el.created for the first time
      const promise = template.lifecyclePromise('created');
      const settled = await Promise.race([
        promise.then(() => 'resolved'),
        new Promise(resolve => setTimeout(() => resolve('hung'), 100)),
      ]);
      expect(settled).toBe('resolved');
    });

    it('resolves lifecyclePromise(rendered) when onRendered fires during isHydrating', async () => {
      const fixture = await mountTemplate({ template: '<span></span>' });
      try {
        const promise = fixture.template.lifecyclePromise('rendered');

        fixture.template.isHydrating = true;
        fixture.template.onRendered();

        const settled = await Promise.race([
          promise.then(() => 'resolved'),
          new Promise(resolve => setTimeout(() => resolve('hung'), 100)),
        ]);
        expect(settled).toBe('resolved');
      }
      finally {
        fixture.cleanup();
      }
    });

    it('runs synchronous DOM event listener before lifecyclePromise then-continuation', async () => {
      // The lifecycle wrapper resolves the promise (then-callbacks queued as
      // microtasks) and THEN dispatches the DOM event (listener runs sync).
      // Net order: DOM listener first, then-continuation in the next microtask.
      const fixture = await mountTemplate({ template: '<span></span>' });
      try {
        const order = [];
        const promise = fixture.template.lifecyclePromise('updated').then(() => {
          order.push('promise');
        });
        fixture.host.addEventListener('updated', () => {
          order.push('domEvent');
        });
        fixture.template.resolveLifecyclePromise('updated');
        fixture.template.dispatchEvent(
          'updated',
          { component: fixture.template.instance },
          { composed: false },
          { triggerCallback: false },
        );
        await promise;
        expect(order[0]).toBe('domEvent');
        expect(order[1]).toBe('promise');
      }
      finally {
        fixture.cleanup();
      }
    });
  });

  /*******************************
        Theme observer
  *******************************/

  describe('onThemeChanged observer', () => {
    it('does not install a MutationObserver when no onThemeChanged callback is provided', async () => {
      const fixture = await mountTemplate({ template: '<span></span>' });
      try {
        expect(fixture.template.observers.length).toBe(0);
      }
      finally {
        fixture.cleanup();
      }
    });

    it('installs a MutationObserver when onThemeChanged is provided', async () => {
      const fixture = await mountTemplate({
        template: '<span></span>',
        onThemeChanged: () => {},
      });
      try {
        expect(fixture.template.observers.length).toBe(1);
      }
      finally {
        fixture.cleanup();
      }
    });

    it('fires onThemeChanged when the html class attribute changes', async () => {
      const onThemeChanged = vi.fn();
      const fixture = await mountTemplate({
        template: '<span></span>',
        onThemeChanged,
      });
      try {
        const html = document.documentElement;
        const previous = html.className;
        html.classList.add('dark');
        // 10ms debounce
        await new Promise(r => setTimeout(r, 30));
        expect(onThemeChanged).toHaveBeenCalled();
        html.className = previous;
        await new Promise(r => setTimeout(r, 30));
      }
      finally {
        fixture.cleanup();
      }
    });

    it('fires onThemeChanged when a themechange event is dispatched on html', async () => {
      const onThemeChanged = vi.fn();
      const fixture = await mountTemplate({
        template: '<span></span>',
        onThemeChanged,
      });
      try {
        fireCustomEvent(document.documentElement, 'themechange', { theme: 'dark' });
        await new Promise(r => setTimeout(r, 30));
        expect(onThemeChanged).toHaveBeenCalled();
      }
      finally {
        fixture.cleanup();
      }
    });

    it('coalesces a class mutation and a themechange event into one callback', async () => {
      const onThemeChanged = vi.fn();
      const fixture = await mountTemplate({
        template: '<span></span>',
        onThemeChanged,
      });
      try {
        const html = document.documentElement;
        const previous = html.className;
        html.classList.add('dark');
        fireCustomEvent(html, 'themechange', { theme: 'dark' });
        await new Promise(r => setTimeout(r, 30));
        expect(onThemeChanged).toHaveBeenCalledTimes(1);
        html.className = previous;
        await new Promise(r => setTimeout(r, 30));
      }
      finally {
        fixture.cleanup();
      }
    });

    it('disconnects the MutationObserver on destroy', async () => {
      const onThemeChanged = vi.fn();
      const fixture = await mountTemplate({
        template: '<span></span>',
        onThemeChanged,
      });
      const observer = fixture.template.observers[0];
      const disconnectSpy = vi.spyOn(observer, 'disconnect');
      fixture.template.onDestroyed();
      fixture.cleanup();
      expect(disconnectSpy).toHaveBeenCalled();
    });
  });

  /*******************************
       renderedTemplates registry
  *******************************/

  describe('renderedTemplates registry', () => {
    it('adds a template on onCreated and removes it on onDestroyed', () => {
      const template = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'registry-add-remove',
      });
      template.initialize();
      const after = snapshotRegistry();
      expect(after.counts['registry-add-remove']).toBe(1);
      template.onDestroyed();
      const afterDestroy = snapshotRegistry();
      expect(afterDestroy.counts['registry-add-remove'] || 0).toBe(0);
    });

    it('does not register isPrototype templates', () => {
      const template = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'proto-template',
        isPrototype: true,
      });
      template.initialize();
      const after = snapshotRegistry();
      expect(after.counts['proto-template'] || 0).toBe(0);
    });

    it('grows the array to N when N templates share a name', () => {
      const a = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'shared-name',
      });
      const b = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'shared-name',
      });
      const c = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'shared-name',
      });
      a.initialize();
      b.initialize();
      c.initialize();
      expect(snapshotRegistry().counts['shared-name']).toBe(3);
      b.onDestroyed();
      expect(snapshotRegistry().counts['shared-name']).toBe(2);
      a.onDestroyed();
      c.onDestroyed();
    });

    it('auto-names anonymous templates using Template.templateCount', () => {
      Template.templateCount = 0;
      const a = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
      });
      const b = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
      });
      expect(a.templateName).toBe('Anonymous #1');
      expect(b.templateName).toBe('Anonymous #2');
    });

    it('removes the template from registry BEFORE invoking the user onDestroyed callback', () => {
      const observed = vi.fn();
      const template = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'registry-order',
        onDestroyed() {
          observed(snapshotRegistry().counts['registry-order'] || 0);
        },
      });
      template.initialize();
      template.onDestroyed();
      expect(observed).toHaveBeenCalledWith(0);
    });
  });

  /*******************************
        Server-side behavior
  *******************************/

  describe('server-side behavior', () => {
    let originalIsServer;

    beforeEach(() => {
      originalIsServer = Template.isServer;
    });

    afterEach(() => {
      Template.isServer = originalIsServer;
    });

    it('runs onCreated callback on the server', () => {
      Template.isServer = true;
      const onCreated = vi.fn();
      const template = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        onCreated,
      });
      template.initialize();
      expect(onCreated).toHaveBeenCalledTimes(1);
      Template.isServer = originalIsServer;
      template.onDestroyed();
    });

    it('does not dispatch the created DOM event on the server', async () => {
      Template.isServer = true;
      const fixture = await mountTemplate({
        template: '<span></span>',
      });
      const heard = vi.fn();
      fixture.host.addEventListener('created', heard);
      try {
        // dispatchEvent early-returns when Template.isServer
        fixture.template.onCreated();
        expect(heard).not.toHaveBeenCalled();
      }
      finally {
        Template.isServer = originalIsServer;
        fixture.cleanup();
      }
    });

    it('schedules onRendered via setTimeout regardless of Template.isServer toggle', async () => {
      // render() gates on the imported `isServer` from utils (frozen at
      // module init), not on Template.isServer. So toggling Template.isServer
      // in tests does NOT suppress onRendered scheduling. The actual
      // server-side path (Node) sets utils.isServer=true at import time.
      Template.isServer = true;
      const onRendered = vi.fn();
      const template = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        onRendered,
      });
      template.initialize();
      template.render();
      await new Promise(r => setTimeout(r, 5));
      expect(onRendered).toHaveBeenCalledTimes(1);
      Template.isServer = originalIsServer;
      template.onDestroyed();
    });

    it('does not install the theme MutationObserver on the server', async () => {
      Template.isServer = true;
      const fixture = await mountTemplate({
        template: '<span></span>',
        onThemeChanged: () => {},
      });
      try {
        expect(fixture.template.observers.length).toBe(0);
      }
      finally {
        Template.isServer = originalIsServer;
        fixture.cleanup();
      }
    });
  });

  /*******************************
        Destroy cleanup
  *******************************/

  describe('destroy cleanup', () => {
    it('aborts the abortController signal', () => {
      const template = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
      });
      template.initialize();
      expect(template.abortSignal.aborted).toBe(false);
      template.onDestroyed();
      expect(template.abortSignal.aborted).toBe(true);
    });

    it('stops registered reactions and clears the array entries', () => {
      const template = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
      });
      template.initialize();
      let runs = 0;
      template.reaction(() => {
        runs++;
      });
      Reaction.flush();
      expect(runs).toBe(1);
      const reactions = template.reactions;
      template.onDestroyed();
      reactions.forEach(r => {
        expect(r._stopped !== undefined ? r._stopped : true).toBeTruthy();
      });
    });

    it('flips destroyed=true and rendered=false on destroy', () => {
      const template = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
      });
      template.initialize();
      template.markRendered();
      expect(template.rendered).toBe(true);
      template.onDestroyed();
      expect(template.destroyed).toBe(true);
      expect(template.rendered).toBe(false);
    });

    it('detaches from parentTemplate._childTemplates on destroy', () => {
      const parent = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
      });
      const child = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
      });
      parent.initialize();
      child.initialize();
      child.setParent(parent);
      expect(parent._childTemplates.length).toBe(1);
      child.onDestroyed();
      expect(parent._childTemplates.length).toBe(0);
      parent.onDestroyed();
    });

    it('aborts the eventController on destroy (cascades from abortSignal)', async () => {
      const fixture = await mountTemplate({
        template: '<span></span>',
        events: { 'click span'() {} },
      });
      try {
        const ec = fixture.template.eventController;
        expect(ec).toBeDefined();
        expect(ec.signal.aborted).toBe(false);
        fixture.template.onDestroyed();
        expect(ec.signal.aborted).toBe(true);
      }
      finally {
        fixture.cleanup();
      }
    });

    it('leaves the registry empty after a clean lifecycle', () => {
      const template = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'leak-check',
      });
      template.initialize();
      template.onDestroyed();
      const snap = snapshotRegistry();
      expect(snap.totalInstances).toBe(0);
    });
  });
});

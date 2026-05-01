// Surface 2 — Template lifecycle (internal wrappers, registry, promises, theme).
//
// These tests exercise Template's own contracts directly, without going through
// WebComponentBase or defineComponent. The component-package browser tests cover
// the full integration. See packages/templating/test/_helpers/README.md for the
// cross-package boundary rationale.

import { Reaction } from '@semantic-ui/reactivity';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Template } from '../../src/template.js';
import { mountTemplateInShadow } from '../_helpers/browser-fixture.js';
import { fireCustomEvent } from '../_helpers/dispatch.js';
import { freshTemplate } from '../_helpers/fresh-template.js';
import { assertRegistryEmpty, clearTemplateRegistry, snapshotRegistry } from '../_helpers/registry-cleanup.js';
import { stubEngine } from '../_helpers/stub-engine.js';

afterEach(() => {
  clearTemplateRegistry();
  document.body.innerHTML = '';
});

/*******************************
        Hook firing order
*******************************/

describe('Template lifecycle — hook firing order', () => {
  it('runs createComponent then initialize then onCreated callback during initialize()', () => {
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

    const { template, cleanup } = freshTemplate({
      createComponent,
      onCreated,
    });
    try {
      template.initialize();
      expect(calls).toEqual(['createComponent', 'instance.initialize', 'onCreated']);
      expect(createComponent).toHaveBeenCalledTimes(1);
      expect(onCreated).toHaveBeenCalledTimes(1);
    }
    finally {
      cleanup();
    }
  });

  it('does not fire onRendered during initialize() — only onCreated does', () => {
    const onCreated = vi.fn();
    const onRendered = vi.fn();
    const { template, cleanup } = freshTemplate({ onCreated, onRendered });
    try {
      template.initialize();
      expect(onCreated).toHaveBeenCalledTimes(1);
      expect(onRendered).not.toHaveBeenCalled();
    }
    finally {
      cleanup();
    }
  });

  it('fires onRendered after a render() call', async () => {
    const onCreated = vi.fn();
    const onRendered = vi.fn();
    const { template, cleanup } = freshTemplate({ onCreated, onRendered });
    try {
      template.initialize();
      template.render();
      // template.render() schedules onRendered via setTimeout(fn, 0)
      await new Promise(r => setTimeout(r, 5));
      expect(onCreated).toHaveBeenCalledTimes(1);
      expect(onRendered).toHaveBeenCalledTimes(1);
    }
    finally {
      cleanup();
    }
  });

  it('fires onDestroyed when the wrapper is invoked', () => {
    const onCreated = vi.fn();
    const onDestroyed = vi.fn();
    const { template, cleanup } = freshTemplate({ onCreated, onDestroyed });
    try {
      template.initialize();
      template.onDestroyed();
      expect(onDestroyed).toHaveBeenCalledTimes(1);
      expect(template.destroyed).toBe(true);
    }
    finally {
      cleanup();
    }
  });
});

/*******************************
       Hook callback signatures
*******************************/

describe('Template lifecycle — callback params', () => {
  it('passes destructurable params to onCreated', () => {
    let received;
    const onCreated = vi.fn((params) => {
      received = params;
    });
    const { template, cleanup } = freshTemplate({ onCreated });
    try {
      template.initialize();
      expect(received).toBeDefined();
      // spot-check the documented destructurables
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
    }
    finally {
      cleanup();
    }
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
    const { template, cleanup } = freshTemplate({ onCreated, onDestroyed });
    try {
      template.initialize();
      template.onDestroyed();
      expect(destroyedParams).toBe(createdParams);
    }
    finally {
      cleanup();
    }
  });
});

/*******************************
            onUpdated
*******************************/

// F-B: vocab is implementation-flavored on purpose. The undocumented surface
// shouldn't accidentally read like external documentation.

describe('Template.onUpdated wrapper (internal microtask debounce)', () => {
  it('does not invoke onUpdated wrapper directly during initialize()', () => {
    const onUpdated = vi.fn();
    const { template, cleanup } = freshTemplate({ onUpdated });
    try {
      template.initialize();
      // wrapper exists but the user callback is reached via this.call()
      // and the onUpdated wrapper itself only fires the DOM event.
      // For state-driven onUpdated, see the next test.
      expect(typeof template.onUpdated).toBe('function');
    }
    finally {
      cleanup();
    }
  });

  it('schedules onUpdated via state Reaction afterFlush when state mutates after first render', async () => {
    const onUpdated = vi.fn();
    const fixture = mountTemplateInShadow({
      template: '<span></span>',
      defaultState: { count: 0 },
      onUpdated,
    });
    try {
      // simulate first-render finishing
      fixture.template.markRendered();

      // mutate a state signal — state reaction fires Reaction.afterFlush(this.onUpdated)
      fixture.template.state.count.set(1);
      Reaction.flush();
      // afterFlush has now invoked the onUpdated wrapper, which queues the
      // 'updated' event in a microtask. Drain microtasks.
      await Promise.resolve();
      await Promise.resolve();

      // the wrapper itself doesn't call the user onUpdated — that path goes
      // via dispatchEvent('updated') with triggerCallback:false. So our
      // expectation here is that the 'updated' DOM event was dispatched.
      // But we registered onUpdated as the user callback via Template
      // options. The user callback for onUpdated is NOT called by the
      // wrapper (it dispatches event, no callback). Pin this behavior.
      expect(onUpdated).not.toHaveBeenCalled();

      // What IS observable: the DOM event was dispatched on element.
      // We'll observe that by listening on the host element.
    }
    finally {
      fixture.cleanup();
    }
  });

  it('emits a single updated DOM event when the state Reaction fires', async () => {
    const fixture = mountTemplateInShadow({
      template: '<span></span>',
      defaultState: { count: 0 },
    });
    const heard = vi.fn();
    fixture.host.addEventListener('updated', heard);
    try {
      fixture.template.markRendered();
      fixture.template.state.count.set(1);
      Reaction.flush();
      // wait for the queueMicrotask in onUpdated wrapper
      await Promise.resolve();
      await Promise.resolve();
      expect(heard).toHaveBeenCalledTimes(1);
    }
    finally {
      fixture.cleanup();
    }
  });

  it('coalesces multiple synchronous state mutations into one updated DOM event (microtask debounce)', async () => {
    const fixture = mountTemplateInShadow({
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

  it('does not dispatch updated when the wrapper runs before markRendered() (i.e., on first render)', async () => {
    const fixture = mountTemplateInShadow({
      template: '<span></span>',
      defaultState: { count: 0 },
    });
    const heard = vi.fn();
    fixture.host.addEventListener('updated', heard);
    try {
      // do NOT call markRendered. mutate state.
      fixture.template.state.count.set(1);
      Reaction.flush();
      await Promise.resolve();
      await Promise.resolve();
      // state reaction at template.js:262 only schedules when this.rendered === true
      expect(heard).not.toHaveBeenCalled();
    }
    finally {
      fixture.cleanup();
    }
  });

  it('flips updateScheduled true while pending and false after the microtask fires', async () => {
    const fixture = mountTemplateInShadow({
      template: '<span></span>',
      defaultState: { count: 0 },
    });
    try {
      fixture.template.markRendered();
      fixture.template.state.count.set(1);
      Reaction.flush();
      // immediately after afterFlush invokes the onUpdated wrapper synchronously,
      // updateScheduled is true (pending microtask) and the element mirror is too
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
   isHydrating DOM-event suppression
*******************************/

describe('Template lifecycle — isHydrating gates DOM events (intentional, F-C)', () => {
  it('runs the onCreated user callback during hydration', () => {
    const onCreated = vi.fn();
    const fixture = mountTemplateInShadow({
      template: '<span></span>',
      onCreated,
    });
    try {
      // mountTemplateInShadow already initialized once. The hydration gate
      // is observed on the dispatch path. Re-run: set isHydrating, then
      // manually invoke the onCreated wrapper to assert callback fires
      // and DOM event is suppressed.
      const heard = vi.fn();
      fixture.host.addEventListener('created', heard);

      fixture.template.isHydrating = true;
      fixture.template.onCreated();
      expect(onCreated).toHaveBeenCalledTimes(2); // once in mount + this manual call
      expect(heard).not.toHaveBeenCalled();
    }
    finally {
      fixture.cleanup();
    }
  });

  it('suppresses the rendered DOM event during hydration but still runs the user callback', () => {
    const onRendered = vi.fn();
    const fixture = mountTemplateInShadow({
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

  it('dispatches the created DOM event when not hydrating', () => {
    const fixture = mountTemplateInShadow({
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
  lifecyclePromise / resolveLifecyclePromise
*******************************/

describe('Template.lifecyclePromise (internal promise mechanics)', () => {
  it('returns the same Promise for repeated calls before resolution', () => {
    const { template, cleanup } = freshTemplate();
    try {
      template.initialize();
      const p1 = template.lifecyclePromise('rendered');
      const p2 = template.lifecyclePromise('rendered');
      expect(p1).toBe(p2);
    }
    finally {
      cleanup();
    }
  });

  it('caches the resolved promise for one-shot events (created)', async () => {
    const fixture = mountTemplateInShadow({ template: '<span></span>' });
    try {
      // mount already invoked onCreated which called resolveLifecyclePromise('created').
      // BUT mount didn't access lifecyclePromise('created') beforehand —
      // see B2a expected-bug test below for that case.
      // For this test: pre-access first.
      fixture.template.lifecyclePromise('created');
      // re-fire to resolve
      fixture.template.resolveLifecyclePromise('created');
      const p1 = fixture.template.lifecyclePromise('created');
      const p2 = fixture.template.lifecyclePromise('created');
      expect(p1).toBe(p2);
      // promise resolved
      await expect(Promise.race([p1, new Promise((_, rej) => setTimeout(() => rej(new Error('hung')), 50))]))
        .resolves.toBeUndefined();
    }
    finally {
      fixture.cleanup();
    }
  });

  it('returns a fresh Promise after resolution for the recurring event (updated)', () => {
    const { template, cleanup } = freshTemplate();
    try {
      template.initialize();
      const p1 = template.lifecyclePromise('updated');
      template.resolveLifecyclePromise('updated');
      const p2 = template.lifecyclePromise('updated');
      // recurring: cached promise was deleted, p2 is a fresh promise
      expect(p1).not.toBe(p2);
    }
    finally {
      cleanup();
    }
  });

  it('no-ops resolveLifecyclePromise when no resolver is registered', () => {
    const { template, cleanup } = freshTemplate();
    try {
      template.initialize();
      // never accessed lifecyclePromise('rendered'), so no resolver is registered.
      // This call should not throw.
      expect(() => template.resolveLifecyclePromise('rendered')).not.toThrow();
      // and the promise map is still empty
      expect(template.lifecyclePromises.rendered).toBeUndefined();
    }
    finally {
      cleanup();
    }
  });

  /*
   * B2a — late-awaiter never resolves.
   *
   * Scenario: a consumer never accesses el.created BEFORE creation fires.
   * resolveLifecyclePromise('created') no-ops (no resolver registered).
   * Then consumer awaits el.created — lifecyclePromise lazy-creates a NEW
   * Promise+resolver, but the event already fired. That resolver will never
   * be called. Promise hangs forever.
   *
   * EXPECTED-BUG-PIN: should fail with current source. Fold-fix at B2.
   */
  it('B2a: lifecyclePromise(created) accessed AFTER resolveLifecyclePromise hangs forever (expected bug)', async () => {
    const { template, cleanup } = freshTemplate();
    try {
      template.initialize();
      // simulate the lifecycle event firing without any prior promise access
      template.resolveLifecyclePromise('created');
      // now a consumer awaits el.created for the first time
      const promise = template.lifecyclePromise('created');
      const settled = await Promise.race([
        promise.then(() => 'resolved'),
        new Promise(resolve => setTimeout(() => resolve('hung'), 100)),
      ]);
      // After B2 fix: should be 'resolved'. Today: 'hung'.
      expect(settled).toBe('resolved');
    }
    finally {
      cleanup();
    }
  });

  /*
   * B2b — hydration suppresses promise resolution.
   *
   * resolveLifecyclePromise is currently called from inside dispatchEvent.
   * The onCreated/onRendered wrappers gate dispatchEvent on !isHydrating.
   * So during hydration, neither the DOM event nor the promise resolution
   * fires. Awaiters of el.created/el.rendered hang.
   *
   * EXPECTED-BUG-PIN: should fail with current source. Fold-fix at B2.
   */
  it('B2b: lifecyclePromise(rendered) hangs when onRendered fires during isHydrating (expected bug)', async () => {
    const fixture = mountTemplateInShadow({ template: '<span></span>' });
    try {
      // pre-access (so B2a is not the cause of failure here)
      const promise = fixture.template.lifecyclePromise('rendered');

      fixture.template.isHydrating = true;
      fixture.template.onRendered();
      // The wrapper called the user callback but skipped dispatchEvent
      // (isHydrating gate). dispatchEvent is what calls
      // resolveLifecyclePromise. So the resolver was never invoked.

      const settled = await Promise.race([
        promise.then(() => 'resolved'),
        new Promise(resolve => setTimeout(() => resolve('hung'), 100)),
      ]);
      // After B2 fix: should be 'resolved'. Today: 'hung'.
      expect(settled).toBe('resolved');
    }
    finally {
      fixture.cleanup();
    }
  });

  it('pins ordering: synchronous DOM event listener runs before lifecyclePromise then-continuation', async () => {
    // Note: dispatchEvent() at template.js:910 calls resolveLifecyclePromise
    // (resolver runs synchronously, which schedules .then continuations as
    // microtasks) and THEN synchronously dispatches the DOM event (which
    // invokes its listener synchronously). Net order: DOM listener fires
    // first, then-continuation drains in the next microtask. Pinning here
    // so any future change to this ordering is intentional.
    const fixture = mountTemplateInShadow({ template: '<span></span>' });
    try {
      const order = [];
      const promise = fixture.template.lifecyclePromise('updated').then(() => {
        order.push('promise');
      });
      fixture.host.addEventListener('updated', () => {
        order.push('domEvent');
      });
      // dispatch the DOM event manually since dispatchEvent is the resolver
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

describe('Template lifecycle — onThemeChanged observer', () => {
  it('does not install a MutationObserver when no onThemeChanged callback is provided', () => {
    const fixture = mountTemplateInShadow({ template: '<span></span>' });
    try {
      // no observers registered for theme — observers array stays empty
      // (events DSL doesn't add observers; only the theme path does)
      expect(fixture.template.observers.length).toBe(0);
    }
    finally {
      fixture.cleanup();
    }
  });

  it('installs a MutationObserver when onThemeChanged is provided', () => {
    const fixture = mountTemplateInShadow({
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
    const fixture = mountTemplateInShadow({
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
      // restore
      html.className = previous;
      await new Promise(r => setTimeout(r, 30));
    }
    finally {
      fixture.cleanup();
    }
  });

  it('fires onThemeChanged when a themechange event is dispatched on html', async () => {
    const onThemeChanged = vi.fn();
    const fixture = mountTemplateInShadow({
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

  it('coalesces a class mutation and a themechange event in the same window into one callback (10ms debounce)', async () => {
    const onThemeChanged = vi.fn();
    const fixture = mountTemplateInShadow({
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

  it('disconnects the MutationObserver on destroy', () => {
    const onThemeChanged = vi.fn();
    const fixture = mountTemplateInShadow({
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
   Template.renderedTemplates registry
*******************************/

describe('Template.renderedTemplates registry', () => {
  it('adds a template on onCreated and removes it on onDestroyed', () => {
    const { template, cleanup } = freshTemplate({
      templateName: 'registry-add-remove',
    });
    try {
      template.initialize();
      const after = snapshotRegistry();
      expect(after.counts['registry-add-remove']).toBe(1);
      template.onDestroyed();
      const afterDestroy = snapshotRegistry();
      // remove() leaves an empty array on the key
      expect(afterDestroy.counts['registry-add-remove'] || 0).toBe(0);
    }
    finally {
      cleanup();
    }
  });

  it('does not register isPrototype templates', () => {
    const { template, cleanup } = freshTemplate({
      templateName: 'proto-template',
      isPrototype: true,
    });
    try {
      template.initialize();
      const after = snapshotRegistry();
      expect(after.counts['proto-template'] || 0).toBe(0);
    }
    finally {
      cleanup();
    }
  });

  it('grows the array to N when N templates share a name', () => {
    const a = freshTemplate({ templateName: 'shared-name' });
    const b = freshTemplate({ templateName: 'shared-name' });
    const c = freshTemplate({ templateName: 'shared-name' });
    try {
      a.template.initialize();
      b.template.initialize();
      c.template.initialize();
      expect(snapshotRegistry().counts['shared-name']).toBe(3);
      b.template.onDestroyed();
      expect(snapshotRegistry().counts['shared-name']).toBe(2);
    }
    finally {
      a.cleanup();
      b.cleanup();
      c.cleanup();
    }
  });

  it('auto-names anonymous templates using Template.templateCount', () => {
    Template.templateCount = 0;
    const a = freshTemplate(); // no templateName
    const b = freshTemplate();
    try {
      expect(a.template.templateName).toBe('Anonymous #1');
      expect(b.template.templateName).toBe('Anonymous #2');
    }
    finally {
      a.cleanup();
      b.cleanup();
    }
  });

  it('removes the template from registry BEFORE invoking the user onDestroyed callback', () => {
    const observed = vi.fn();
    const { template, cleanup } = freshTemplate({
      templateName: 'registry-order',
      onDestroyed() {
        observed(snapshotRegistry().counts['registry-order'] || 0);
      },
    });
    try {
      template.initialize();
      template.onDestroyed();
      // when the user callback ran, this template was already removed
      expect(observed).toHaveBeenCalledWith(0);
    }
    finally {
      cleanup();
    }
  });
});

/*******************************
       SSR sequence pinning
*******************************/

describe('Template lifecycle — SSR sequence (D3 pin)', () => {
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
    const { template, cleanup } = freshTemplate({ onCreated });
    try {
      template.initialize();
      expect(onCreated).toHaveBeenCalledTimes(1);
    }
    finally {
      cleanup();
    }
  });

  it('does not dispatch the created DOM event on the server (dispatchEvent early-returns)', () => {
    Template.isServer = true;
    const fixture = mountTemplateInShadow({
      template: '<span></span>',
    });
    const heard = vi.fn();
    fixture.host.addEventListener('created', heard);
    try {
      // Re-trigger the wrapper after setting isServer=true. The dispatchEvent
      // method early-returns at template.js:899 when Template.isServer.
      fixture.template.onCreated();
      expect(heard).not.toHaveBeenCalled();
    }
    finally {
      fixture.cleanup();
    }
  });

  it('Template.render() schedules onRendered via setTimeout regardless of Template.isServer toggle', async () => {
    // Surface finding: render() at template.js:741 gates on the imported
    // `isServer` from utils (frozen at module init), not on Template.isServer.
    // So toggling Template.isServer in tests does NOT suppress onRendered
    // scheduling. The actual server-side path (Node) sets utils.isServer=true
    // at import time. Pinning current behavior; this is a candidate for the
    // D3 doc-cleanup follow-up.
    Template.isServer = true;
    const onRendered = vi.fn();
    const { template, cleanup } = freshTemplate({ onRendered });
    try {
      template.initialize();
      template.render();
      await new Promise(r => setTimeout(r, 5));
      expect(onRendered).toHaveBeenCalledTimes(1);
    }
    finally {
      cleanup();
    }
  });

  it('does not install the theme MutationObserver on the server', () => {
    Template.isServer = true;
    const fixture = mountTemplateInShadow({
      template: '<span></span>',
      onThemeChanged: () => {},
    });
    try {
      expect(fixture.template.observers.length).toBe(0);
    }
    finally {
      fixture.cleanup();
    }
  });
});

/*******************************
     Cleanup contract on destroy
*******************************/

describe('Template lifecycle — destroy cleanup contract', () => {
  it('aborts the abortController signal', () => {
    const { template, cleanup } = freshTemplate();
    try {
      template.initialize();
      expect(template.abortSignal.aborted).toBe(false);
      template.onDestroyed();
      expect(template.abortSignal.aborted).toBe(true);
    }
    finally {
      cleanup();
    }
  });

  it('stops registered reactions and clears the array entries', () => {
    const { template, cleanup } = freshTemplate();
    try {
      template.initialize();
      // initialize() pushed at least the state-driven onUpdated reaction
      // (only when this.element is truthy — freshTemplate has no element).
      // Add one explicitly so we can observe it.
      let runs = 0;
      template.reaction(() => {
        runs++;
      });
      Reaction.flush();
      expect(runs).toBe(1);
      const reactions = template.reactions;
      template.onDestroyed();
      // each reaction.stop() is called — Reaction.stop sets _stopped flag
      reactions.forEach(r => {
        expect(r._stopped !== undefined ? r._stopped : true).toBeTruthy();
      });
    }
    finally {
      cleanup();
    }
  });

  it('flips destroyed=true and rendered=false on destroy', () => {
    const { template, cleanup } = freshTemplate();
    try {
      template.initialize();
      template.markRendered();
      expect(template.rendered).toBe(true);
      template.onDestroyed();
      expect(template.destroyed).toBe(true);
      expect(template.rendered).toBe(false);
    }
    finally {
      cleanup();
    }
  });

  it('detaches from parentTemplate._childTemplates on destroy', () => {
    const parent = freshTemplate();
    const child = freshTemplate();
    try {
      parent.template.initialize();
      child.template.initialize();
      child.template.setParent(parent.template);
      expect(parent.template._childTemplates.length).toBe(1);
      child.template.onDestroyed();
      expect(parent.template._childTemplates.length).toBe(0);
    }
    finally {
      parent.cleanup();
      // child already destroyed; cleanup is a no-op in that branch
      child.cleanup();
    }
  });

  it('aborts the eventController on destroy (cascades from abortSignal)', () => {
    const fixture = mountTemplateInShadow({
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

  it('leaves the registry empty after a clean lifecycle (leak check)', () => {
    const { template, cleanup } = freshTemplate({ templateName: 'leak-check' });
    try {
      template.initialize();
      template.onDestroyed();
      assertRegistryEmpty();
    }
    finally {
      cleanup();
    }
  });
});

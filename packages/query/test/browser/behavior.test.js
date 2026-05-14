import { $, Query, registerBehavior } from '@semantic-ui/query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Behavior } from '../../src/behavior.js';

// Each test registers under a unique name so behaviors don't leak across
// tests (Query.behaviors is global static state and registerBehavior() is a
// silent no-op for duplicate names).
let counter = 0;
const uniqueName = (base) => `${base}_${++counter}`;

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

/* -----------------------------------------------------------------------
   Registration
----------------------------------------------------------------------- */

describe('registerBehavior — registration and prototype exposure', () => {
  it('registers a behavior under its name on Query.behaviors', () => {
    const name = uniqueName('reg');
    registerBehavior({ name, createBehavior: () => ({}) });
    expect(Query.behaviors.has(name)).toBe(true);
  });

  it('exposes a method of the same name on Query.prototype', () => {
    const name = uniqueName('proto');
    registerBehavior({ name, createBehavior: () => ({}) });
    expect(typeof Query.prototype[name]).toBe('function');
  });

  it('throws when registered without a name', () => {
    expect(() => registerBehavior({ createBehavior: () => ({}) })).toThrow(/name/i);
  });

  it('silently ignores duplicate registration with the same name', () => {
    const name = uniqueName('dupe');
    const firstHandler = vi.fn(() => ({ ping: () => 'first' }));
    const secondHandler = vi.fn(() => ({ ping: () => 'second' }));
    registerBehavior({ name, createBehavior: firstHandler });
    registerBehavior({ name, createBehavior: secondHandler });
    const el = document.createElement('div');
    document.body.appendChild(el);
    // The first registration's createBehavior should be the one wired up.
    const result = $(el)[name]('ping');
    expect(result).toBe('first');
  });

  it('exposes defaultSettings, classNames, selectors, errors on the prototype method', () => {
    const name = uniqueName('config');
    registerBehavior({
      name,
      defaultSettings: { delay: 100 },
      classNames: { active: 'is-active' },
      selectors: { trigger: '.trigger' },
      errors: { noTarget: 'missing' },
      createBehavior: () => ({}),
    });
    expect(Query.prototype[name].defaultSettings).toEqual({ delay: 100 });
    expect(Query.prototype[name].classNames).toEqual({ active: 'is-active' });
    expect(Query.prototype[name].selectors).toEqual({ trigger: '.trigger' });
    expect(Query.prototype[name].errors).toEqual({ noTarget: 'missing' });
  });
});

/* -----------------------------------------------------------------------
   String-API lazy creation
----------------------------------------------------------------------- */

describe('String-API invocation lazy-creates the instance', () => {
  it('creates an instance the first time a method is invoked on a fresh element', () => {
    const name = uniqueName('lazy');
    const calls = [];
    registerBehavior({
      name,
      createBehavior: () => ({
        ping(arg) {
          calls.push(arg);
          return 'pong';
        },
      }),
    });
    const el = document.createElement('div');
    document.body.appendChild(el);
    expect(el[name]).toBeUndefined();
    const result = $(el)[name]('ping', 'one');
    expect(result).toBe('pong');
    expect(calls).toEqual(['one']);
    expect(el[name]).toBeTruthy(); // instance now stored on element
  });

  it('reuses the existing instance on subsequent string-API calls', () => {
    const name = uniqueName('reuse');
    const createSpy = vi.fn(() => ({
      ping() {
        return 'pong';
      },
    }));
    registerBehavior({ name, createBehavior: createSpy });
    const el = document.createElement('div');
    document.body.appendChild(el);
    $(el)[name]('ping');
    $(el)[name]('ping');
    $(el)[name]('ping');
    expect(createSpy).toHaveBeenCalledTimes(1);
  });

  it('stores the instance under a custom namespace when provided', () => {
    const name = uniqueName('ns');
    registerBehavior({
      name,
      namespace: `${name}_storage`,
      createBehavior: () => ({ ping: () => 'pong' }),
    });
    const el = document.createElement('div');
    document.body.appendChild(el);
    $(el)[name]('ping');
    expect(el[`${name}_storage`]).toBeTruthy();
    expect(el[name]).toBeUndefined();
  });
});

/* -----------------------------------------------------------------------
   callMethod resolution path
----------------------------------------------------------------------- */

describe('callMethod — resolution path', () => {
  it('resolves a single-word method name', () => {
    const name = uniqueName('single');
    registerBehavior({
      name,
      createBehavior: () => ({ show: () => 'shown' }),
    });
    const el = document.createElement('div');
    document.body.appendChild(el);
    expect($(el)[name]('show')).toBe('shown');
  });

  it('resolves a multi-word query via camelCase conversion', () => {
    const name = uniqueName('camel');
    registerBehavior({
      name,
      createBehavior: () => ({
        toggleState: () => 'toggled',
        isVisible: () => true,
      }),
    });
    const el = document.createElement('div');
    document.body.appendChild(el);
    expect($(el)[name]('toggle state')).toBe('toggled');
    expect($(el)[name]('is visible')).toBe(true);
  });

  it('resolves dot-notation traversal into nested objects', () => {
    const name = uniqueName('dot');
    registerBehavior({
      name,
      createBehavior: () => ({
        position: {
          set: (val) => `set-${val}`,
        },
      }),
    });
    const el = document.createElement('div');
    document.body.appendChild(el);
    expect($(el)[name]('position.set', 'top')).toBe('set-top');
  });

  it('falls back to customInvocation when no method matches', () => {
    const name = uniqueName('custom');
    const customSpy = vi.fn(({ methodName, methodArgs }) => `${methodName}:${methodArgs.join(',')}`);
    registerBehavior({
      name,
      createBehavior: () => ({}),
      customInvocation: customSpy,
    });
    const el = document.createElement('div');
    document.body.appendChild(el);
    const result = $(el)[name]('fade in', 500);
    expect(result).toBe('fade in:500');
    expect(customSpy).toHaveBeenCalledTimes(1);
  });

  it('returns undefined when no method matches and no customInvocation is provided', () => {
    const name = uniqueName('miss');
    registerBehavior({
      name,
      createBehavior: () => ({ show: () => 'shown' }),
    });
    const el = document.createElement('div');
    document.body.appendChild(el);
    // No 'unknownMethod', no customInvocation. Should return undefined (not crash).
    expect(() => $(el)[name]('unknownMethod')).not.toThrow();
  });

  it('binds method this to the behavior instance', () => {
    const name = uniqueName('this');
    let observedThis;
    registerBehavior({
      name,
      createBehavior: () => ({
        check() {
          observedThis = this;
          return this.namespace;
        },
      }),
    });
    const el = document.createElement('div');
    document.body.appendChild(el);
    const result = $(el)[name]('check');
    expect(result).toBe(name);
    expect(observedThis).toBeTruthy();
    expect(observedThis.element).toBe(el);
  });
});

/* -----------------------------------------------------------------------
   Settings merging
----------------------------------------------------------------------- */

describe('Settings merging — defaults, user settings, data attributes', () => {
  it('uses defaultSettings when no user settings are provided', () => {
    const name = uniqueName('def');
    registerBehavior({
      name,
      defaultSettings: { delay: 100, label: 'default' },
      createBehavior: ({ settings }) => ({
        read: () => ({ delay: settings.delay, label: settings.label }),
      }),
    });
    const el = document.createElement('div');
    document.body.appendChild(el);
    $(el)[name]();
    expect($(el)[name]('read')).toEqual({ delay: 100, label: 'default' });
  });

  it('overrides defaults with user-provided settings', () => {
    const name = uniqueName('user');
    registerBehavior({
      name,
      defaultSettings: { delay: 100, label: 'default' },
      createBehavior: ({ settings }) => ({
        read: () => ({ delay: settings.delay, label: settings.label }),
      }),
    });
    const el = document.createElement('div');
    document.body.appendChild(el);
    $(el)[name]({ delay: 500 });
    expect($(el)[name]('read')).toEqual({ delay: 500, label: 'default' });
  });

  it('lets data-* attributes override settings when allowDataOverride is true (default)', () => {
    const name = uniqueName('data');
    registerBehavior({
      name,
      defaultSettings: { delay: 100, label: 'default' },
      createBehavior: ({ settings }) => ({
        read: () => ({ delay: settings.delay, label: settings.label }),
      }),
    });
    const el = document.createElement('div');
    el.dataset.delay = '750';
    el.dataset.label = 'from-data';
    document.body.appendChild(el);
    $(el)[name]({ delay: 200 });
    // Data attributes win over both defaults and user settings
    expect($(el)[name]('read')).toEqual({ delay: 750, label: 'from-data' });
  });

  it('parses data-* attributes as native values (JSON.parse)', () => {
    const name = uniqueName('parse');
    registerBehavior({
      name,
      defaultSettings: { count: 0, enabled: false },
      createBehavior: ({ settings }) => ({
        read: () => ({ count: settings.count, enabled: settings.enabled }),
      }),
    });
    const el = document.createElement('div');
    el.dataset.count = '42';
    el.dataset.enabled = 'true';
    document.body.appendChild(el);
    $(el)[name]();
    const got = $(el)[name]('read');
    expect(got.count).toBe(42);
    expect(got.enabled).toBe(true);
  });

  it('skips data-* override when allowDataOverride is false', () => {
    const name = uniqueName('noOverride');
    registerBehavior({
      name,
      allowDataOverride: false,
      defaultSettings: { label: 'default' },
      createBehavior: ({ settings }) => ({
        read: () => settings.label,
      }),
    });
    const el = document.createElement('div');
    el.dataset.label = 'from-data';
    document.body.appendChild(el);
    $(el)[name]({ label: 'from-user' });
    expect($(el)[name]('read')).toBe('from-user');
  });
});

/* -----------------------------------------------------------------------
   Lifecycle hooks — order
----------------------------------------------------------------------- */

describe('Lifecycle hooks — order of execution', () => {
  it('runs initialize after createBehavior methods are extended', () => {
    const name = uniqueName('initOrder');
    let observed;
    registerBehavior({
      name,
      createBehavior: ({ self }) => ({
        initialize() {
          // initialize should see all sibling methods already extended onto self
          observed = typeof self.show;
        },
        show() {},
      }),
    });
    const el = document.createElement('div');
    document.body.appendChild(el);
    $(el)[name]();
    expect(observed).toBe('function');
  });

  it('runs onCreated after initialize', () => {
    const name = uniqueName('order');
    const order = [];
    registerBehavior({
      name,
      createBehavior: () => ({
        initialize() {
          order.push('initialize');
        },
      }),
      onCreated: () => {
        order.push('onCreated');
      },
    });
    const el = document.createElement('div');
    document.body.appendChild(el);
    $(el)[name]();
    expect(order).toEqual(['initialize', 'onCreated']);
  });

  it('runs onDestroyed when destroy is called', () => {
    const name = uniqueName('destroy');
    const onDestroyedSpy = vi.fn();
    registerBehavior({
      name,
      createBehavior: () => ({}),
      onDestroyed: onDestroyedSpy,
    });
    const el = document.createElement('div');
    document.body.appendChild(el);
    $(el)[name]();
    expect(onDestroyedSpy).not.toHaveBeenCalled();
    $(el)[name]('destroy');
    expect(onDestroyedSpy).toHaveBeenCalledTimes(1);
  });

  it('removes element[namespace] when destroy is called', () => {
    const name = uniqueName('cleanup');
    registerBehavior({ name, createBehavior: () => ({}) });
    const el = document.createElement('div');
    document.body.appendChild(el);
    $(el)[name]();
    expect(el[name]).toBeTruthy();
    $(el)[name]('destroy');
    expect(el[name]).toBeUndefined();
  });

  it('passes the standard callback params to onCreated', () => {
    const name = uniqueName('params');
    let captured;
    registerBehavior({
      name,
      createBehavior: () => ({}),
      onCreated: (params) => {
        captured = params;
      },
    });
    const el = document.createElement('div');
    document.body.appendChild(el);
    $(el)[name]();
    expect(captured).toBeTruthy();
    expect(captured.el).toBe(el);
    expect(captured.namespace).toBe(name);
    expect(typeof captured.self).toBe('object');
    expect(typeof captured.dispatchEvent).toBe('function');
    expect(typeof captured.attachEvent).toBe('function');
  });
});

/* -----------------------------------------------------------------------
   Reinitialization
----------------------------------------------------------------------- */

describe('Reinitialization — calling with new settings on existing instance', () => {
  it('destroys the previous instance and creates a new one', () => {
    const name = uniqueName('reinit');
    const onDestroyedSpy = vi.fn();
    const onCreatedSpy = vi.fn();
    registerBehavior({
      name,
      defaultSettings: { value: 'A' },
      createBehavior: ({ settings }) => ({
        read: () => settings.value,
      }),
      onCreated: onCreatedSpy,
      onDestroyed: onDestroyedSpy,
    });
    const el = document.createElement('div');
    document.body.appendChild(el);
    $(el)[name]({ value: 'first' });
    expect($(el)[name]('read')).toBe('first');
    expect(onCreatedSpy).toHaveBeenCalledTimes(1);
    expect(onDestroyedSpy).toHaveBeenCalledTimes(0);

    // Re-initialize with new settings
    $(el)[name]({ value: 'second' });
    expect(onDestroyedSpy).toHaveBeenCalledTimes(1);
    expect(onCreatedSpy).toHaveBeenCalledTimes(2);
    expect($(el)[name]('read')).toBe('second');
  });
});

/* -----------------------------------------------------------------------
   setup() — runs once across instances
----------------------------------------------------------------------- */

describe('setup() — one-time shared resource creation', () => {
  it('runs setup once across multiple element initializations', () => {
    const name = uniqueName('setup');
    const setupSpy = vi.fn(() => ({ cache: new Map() }));
    registerBehavior({
      name,
      setup: setupSpy,
      createBehavior: ({ self }) => ({
        getCache: () => self.cache,
      }),
    });
    const el1 = document.createElement('div');
    const el2 = document.createElement('div');
    document.body.appendChild(el1);
    document.body.appendChild(el2);
    $(el1)[name]();
    $(el2)[name]();
    expect(setupSpy).toHaveBeenCalledTimes(1);
    // Both instances share the same cache
    expect($(el1)[name]('getCache')).toBe($(el2)[name]('getCache'));
  });

  it('merges setup return value onto each behavior instance via sharedBehavior', () => {
    const name = uniqueName('shared');
    const sharedThing = { tag: 'shared' };
    registerBehavior({
      name,
      setup: () => ({ sharedThing }),
      createBehavior: ({ self }) => ({
        read: () => self.sharedThing,
      }),
    });
    const el = document.createElement('div');
    document.body.appendChild(el);
    $(el)[name]();
    expect($(el)[name]('read')).toBe(sharedThing);
  });
});

/* -----------------------------------------------------------------------
   Return value collection
----------------------------------------------------------------------- */

describe('Return value collection across multiple elements', () => {
  it('returns the single value when one element is queried', () => {
    const name = uniqueName('singleVal');
    registerBehavior({
      name,
      createBehavior: () => ({ getType: () => 'info' }),
    });
    const el = document.createElement('div');
    document.body.appendChild(el);
    expect($(el)[name]('get type')).toBe('info');
  });

  it('deduplicates identical return values across multiple elements', () => {
    const name = uniqueName('dedupe');
    registerBehavior({
      name,
      createBehavior: () => ({ getType: () => 'info' }),
    });
    const el1 = document.createElement('div');
    const el2 = document.createElement('div');
    el1.className = `${name}-target`;
    el2.className = `${name}-target`;
    document.body.appendChild(el1);
    document.body.appendChild(el2);
    const result = $(`.${name}-target`)[name]('get type');
    expect(result).toBe('info'); // not ['info', 'info']
  });

  it('collects different return values into an array', () => {
    const name = uniqueName('arr');
    const valueMap = new WeakMap();
    let nextId = 0;
    registerBehavior({
      name,
      createBehavior: ({ el }) => {
        valueMap.set(el, nextId++);
        return { getType: () => valueMap.get(el) };
      },
    });
    const el1 = document.createElement('div');
    const el2 = document.createElement('div');
    el1.className = `${name}-target`;
    el2.className = `${name}-target`;
    document.body.appendChild(el1);
    document.body.appendChild(el2);
    const result = $(`.${name}-target`)[name]('get type');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    expect(result).toContain(0);
    expect(result).toContain(1);
  });

  it('returns the Query instance for chaining when method has no return value', () => {
    const name = uniqueName('chain');
    registerBehavior({
      name,
      createBehavior: () => ({ show() {} }),
    });
    const el = document.createElement('div');
    document.body.appendChild(el);
    const $el = $(el);
    const chained = $el[name]('show');
    // Methods returning undefined should produce a chainable Query
    expect(chained).toBe($el);
  });
});

/* -----------------------------------------------------------------------
   CSS adoption — document and shadow DOM
----------------------------------------------------------------------- */

describe('CSS adoption — adoptedStyleSheets in document and shadow DOM', () => {
  it('adopts behavior CSS to the document when element is in the page', () => {
    const name = uniqueName('docCss');
    const className = `${name}-marker`;
    const css = `.${className} { color: rgb(123, 45, 67); }`;
    registerBehavior({ name, css, createBehavior: () => ({}) });
    const el = document.createElement('div');
    el.className = className;
    el.textContent = 'styled';
    document.body.appendChild(el);
    $(el)[name]();
    const color = getComputedStyle(el).color;
    expect(color).toBe('rgb(123, 45, 67)');
  });

  it('adopts behavior CSS to the host shadow root when element is in shadow DOM', () => {
    const name = uniqueName('shadowCss');
    const className = `${name}-marker`;
    const css = `.${className} { color: rgb(11, 22, 33); }`;
    registerBehavior({ name, css, createBehavior: () => ({}) });

    const host = document.createElement('div');
    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: 'open' });
    const inner = document.createElement('div');
    inner.className = className;
    inner.textContent = 'styled in shadow';
    shadow.appendChild(inner);

    // Use $() with explicit shadow root so the behavior is initialized against
    // the shadow-DOM element. Per skill: behavior CSS should be adopted to the
    // element's root (the shadow root in this case).
    $(inner, { root: shadow })[name]();
    const color = getComputedStyle(inner).color;
    expect(color).toBe('rgb(11, 22, 33)');
  });
});

/* -----------------------------------------------------------------------
   Events — declarative
----------------------------------------------------------------------- */

describe('Declarative events — delegation', () => {
  it('fires a delegated click handler on a child matching the selector', () => {
    const name = uniqueName('evt');
    const childClass = `${name}-child`;
    const handlerSpy = vi.fn();
    registerBehavior({
      name,
      events: {
        [`click .${childClass}`]: handlerSpy,
      },
      createBehavior: () => ({}),
    });
    const root = document.createElement('div');
    const child = document.createElement('button');
    child.className = childClass;
    root.appendChild(child);
    document.body.appendChild(root);
    $(root)[name]();
    child.click();
    expect(handlerSpy).toHaveBeenCalledTimes(1);
  });

  it('removes events on destroy (AbortController cleanup)', () => {
    const name = uniqueName('destroyEvt');
    const childClass = `${name}-child`;
    const handlerSpy = vi.fn();
    registerBehavior({
      name,
      events: {
        [`click .${childClass}`]: handlerSpy,
      },
      createBehavior: () => ({}),
    });
    const root = document.createElement('div');
    const child = document.createElement('button');
    child.className = childClass;
    root.appendChild(child);
    document.body.appendChild(root);
    $(root)[name]();
    child.click();
    expect(handlerSpy).toHaveBeenCalledTimes(1);
    $(root)[name]('destroy');
    child.click();
    expect(handlerSpy).toHaveBeenCalledTimes(1); // no second call after destroy
  });

  it('interpolates {key} templating from selectors / classNames / settings', () => {
    const name = uniqueName('tpl');
    const handlerSpy = vi.fn();
    registerBehavior({
      name,
      selectors: { trigger: `.${name}-trigger` },
      events: {
        'click {trigger}': handlerSpy,
      },
      createBehavior: () => ({}),
    });
    const root = document.createElement('div');
    const child = document.createElement('button');
    child.className = `${name}-trigger`;
    root.appendChild(child);
    document.body.appendChild(root);
    $(root)[name]();
    child.click();
    expect(handlerSpy).toHaveBeenCalledTimes(1);
  });
});

/* -----------------------------------------------------------------------
   Mutation observers — declarative
----------------------------------------------------------------------- */

describe('Declarative mutations — childList observers', () => {
  it("triggers an 'add' mutation handler when a matching child is appended", async () => {
    const name = uniqueName('addMut');
    const itemClass = `${name}-item`;
    const handlerSpy = vi.fn();
    registerBehavior({
      name,
      mutations: {
        [`add .${itemClass}`]: handlerSpy,
      },
      createBehavior: () => ({}),
    });
    const root = document.createElement('div');
    document.body.appendChild(root);
    $(root)[name]();
    const item = document.createElement('span');
    item.className = itemClass;
    root.appendChild(item);
    // MutationObserver is async — wait one microtask + a microtask cycle.
    await new Promise((r) => setTimeout(r, 0));
    expect(handlerSpy).toHaveBeenCalledTimes(1);
  });

  it('disconnects mutation observers on destroy', async () => {
    const name = uniqueName('destroyMut');
    const itemClass = `${name}-item`;
    const handlerSpy = vi.fn();
    registerBehavior({
      name,
      mutations: {
        [`add .${itemClass}`]: handlerSpy,
      },
      createBehavior: () => ({}),
    });
    const root = document.createElement('div');
    document.body.appendChild(root);
    $(root)[name]();
    $(root)[name]('destroy');
    const item = document.createElement('span');
    item.className = itemClass;
    root.appendChild(item);
    await new Promise((r) => setTimeout(r, 0));
    expect(handlerSpy).not.toHaveBeenCalled();
  });
});

/* -----------------------------------------------------------------------
   dispatchEvent — auto-namespacing
----------------------------------------------------------------------- */

describe('dispatchEvent — auto-namespacing', () => {
  it('prefixes the event name with the namespace when not already namespaced', () => {
    const name = uniqueName('dispatch');
    registerBehavior({
      name,
      createBehavior: ({ dispatchEvent }) => ({
        ping() {
          dispatchEvent('show', { detail: 'hello' });
        },
      }),
    });
    const el = document.createElement('div');
    document.body.appendChild(el);
    const listener = vi.fn();
    el.addEventListener(`${name}:show`, listener);
    $(el)[name]('ping');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('passes through a fully-qualified event name without re-namespacing', () => {
    const name = uniqueName('dispatchQualified');
    registerBehavior({
      name,
      createBehavior: ({ dispatchEvent }) => ({
        ping() {
          dispatchEvent('other:ready');
        },
      }),
    });
    const el = document.createElement('div');
    document.body.appendChild(el);
    const namespacedListener = vi.fn();
    const passthroughListener = vi.fn();
    el.addEventListener(`${name}:other:ready`, namespacedListener);
    el.addEventListener('other:ready', passthroughListener);
    $(el)[name]('ping');
    expect(passthroughListener).toHaveBeenCalledTimes(1);
    expect(namespacedListener).not.toHaveBeenCalled();
  });
});

/* -----------------------------------------------------------------------
   setting() / settings()
----------------------------------------------------------------------- */

describe('setting() — get and set individual settings', () => {
  it('returns the current setting value as a getter', () => {
    const name = uniqueName('setGet');
    registerBehavior({
      name,
      defaultSettings: { delay: 100 },
      createBehavior: () => ({}),
    });
    const el = document.createElement('div');
    document.body.appendChild(el);
    $(el)[name]();
    // Direct instance access; setting('name') returns the value.
    expect(el[name].setting('delay')).toBe(100);
  });

  it('updates the setting value as a setter', () => {
    const name = uniqueName('setSet');
    registerBehavior({
      name,
      defaultSettings: { delay: 100 },
      createBehavior: () => ({}),
    });
    const el = document.createElement('div');
    document.body.appendChild(el);
    $(el)[name]();
    el[name].setting('delay', 500);
    expect(el[name].setting('delay')).toBe(500);
    expect(el[name].settings.delay).toBe(500);
  });
});

/* -----------------------------------------------------------------------
   Edge cases — return values, name collisions, mixed flows
----------------------------------------------------------------------- */

describe('Edge cases probing the contract', () => {
  it('preserves a falsey customInvocation return (false)', () => {
    const name = uniqueName('falseRet');
    registerBehavior({
      name,
      createBehavior: () => ({}),
      customInvocation: () => false,
    });
    const el = document.createElement('div');
    document.body.appendChild(el);
    // false is a legitimate return value (e.g. for queries like 'is visible').
    // The framework's `?? undefined` does not collapse false.
    const result = $(el)[name]('isVisible');
    expect(result).toBe(false);
  });

  it('preserves a zero (0) customInvocation return', () => {
    const name = uniqueName('zeroRet');
    registerBehavior({
      name,
      createBehavior: () => ({}),
      customInvocation: () => 0,
    });
    const el = document.createElement('div');
    document.body.appendChild(el);
    const result = $(el)[name]('getCount');
    expect(result).toBe(0);
  });

  it('collapses a null customInvocation return to undefined and chains the Query', () => {
    // Documents the `found ?? undefined` collapse — null is treated as
    // "no value" and the call returns the Query for chaining instead.
    const name = uniqueName('nullRet');
    registerBehavior({
      name,
      createBehavior: () => ({}),
      customInvocation: () => null,
    });
    const el = document.createElement('div');
    document.body.appendChild(el);
    const $el = $(el);
    const result = $el[name]('whatever');
    expect(result).toBe($el);
  });

  it("setting('key', false) stores false (not treated as undefined)", () => {
    const name = uniqueName('falseSet');
    registerBehavior({
      name,
      defaultSettings: { active: true },
      createBehavior: () => ({}),
    });
    const el = document.createElement('div');
    document.body.appendChild(el);
    $(el)[name]();
    el[name].setting('active', false);
    expect(el[name].setting('active')).toBe(false);
  });

  it('allows direct method invocation via element[namespace].method()', () => {
    const name = uniqueName('direct');
    registerBehavior({
      name,
      createBehavior: () => ({
        show: () => 'shown',
      }),
    });
    const el = document.createElement('div');
    document.body.appendChild(el);
    $(el)[name]();
    expect(el[name].show()).toBe('shown');
  });

  it('exposes index/total/isFirst/isLast for multi-element initialization', () => {
    const name = uniqueName('idx');
    const captured = [];
    registerBehavior({
      name,
      createBehavior: ({ index, total, isFirst, isLast }) => {
        captured.push({ index, total, isFirst, isLast });
        return {};
      },
    });
    const el1 = document.createElement('div');
    const el2 = document.createElement('div');
    const el3 = document.createElement('div');
    el1.className = `${name}-idx`;
    el2.className = `${name}-idx`;
    el3.className = `${name}-idx`;
    document.body.appendChild(el1);
    document.body.appendChild(el2);
    document.body.appendChild(el3);
    $(`.${name}-idx`)[name]();
    expect(captured).toEqual([
      { index: 0, total: 3, isFirst: true, isLast: false },
      { index: 1, total: 3, isFirst: false, isLast: false },
      { index: 2, total: 3, isFirst: false, isLast: true },
    ]);
  });

  it('exposes a shared cache across all instances of the same behavior', () => {
    const name = uniqueName('cache');
    registerBehavior({
      name,
      createBehavior: ({ cache }) => ({
        getCache: () => cache,
        write: (key, value) => {
          cache[key] = value;
        },
      }),
    });
    const el1 = document.createElement('div');
    const el2 = document.createElement('div');
    document.body.appendChild(el1);
    document.body.appendChild(el2);
    $(el1)[name]();
    $(el2)[name]();
    $(el1)[name]('write', 'shared', 'yes');
    expect($(el2)[name]('getCache')).toEqual({ shared: 'yes' });
  });
});

/* -----------------------------------------------------------------------
   Suspected drift — tests that exercise documented intent rigorously
----------------------------------------------------------------------- */

describe('Suspected drift between documented intent and source', () => {
  // [skill query-behaviors] documents that "Calling a behavior with new
  // settings on an element that already has an instance triggers reinitialize".
  // The 'with new settings' is the keystone phrase. Does calling with NO
  // settings also reinitialize, or is it a no-op?
  it('calling the behavior with no arguments on an existing instance still reinitializes (destroys + recreates)', () => {
    const name = uniqueName('reinitNoArgs');
    const onDestroyedSpy = vi.fn();
    const onCreatedSpy = vi.fn();
    registerBehavior({
      name,
      createBehavior: () => ({}),
      onCreated: onCreatedSpy,
      onDestroyed: onDestroyedSpy,
    });
    const el = document.createElement('div');
    document.body.appendChild(el);
    $(el)[name]();
    expect(onCreatedSpy).toHaveBeenCalledTimes(1);
    // Call again with no arguments. The skill speaks of "new settings"
    // triggering reinit; this case is ambiguous — let the test arbitrate.
    $(el)[name]();
    // If this fails, it means a no-op was expected; if it passes, the
    // contract is "any non-method invocation reinitializes."
    expect(onDestroyedSpy).toHaveBeenCalledTimes(1);
    expect(onCreatedSpy).toHaveBeenCalledTimes(2);
  });

  // [source behavior.js:619-624] declares `settings(newSettings)` as a
  // class method, but [source behavior.js:86] sets `this.settings =
  // settings` (an object) on every instance. The instance property
  // shadows the method — so calling `el[name].settings({...})` should
  // throw. This is a contract trap: the skill suggests two distinct
  // helpers (`setting` and `settings`), but only `setting` is reachable.
  it('reveals collision between settings-as-property and settings-as-method', () => {
    const name = uniqueName('settingsClash');
    registerBehavior({
      name,
      defaultSettings: { a: 1 },
      createBehavior: () => ({}),
    });
    const el = document.createElement('div');
    document.body.appendChild(el);
    $(el)[name]();
    // settings is the OBJECT (from constructor), not the method (prototype).
    expect(typeof el[name].settings).toBe('object');
    expect(el[name].settings.a).toBe(1);
    // Calling it as a method should throw because it is not callable.
    expect(() => el[name].settings({ a: 2 })).toThrow(TypeError);
  });

  // [source behavior.js:192-198] parseEventString uses startsWith without a
  // word boundary. A selector that begins with "global" or "bind" without
  // an actual keyword prefix would be mis-parsed. Example: an event
  // declared as 'click .global-button' starts with 'c', so the keyword
  // logic is safe. But consider 'global click .button' — actually that
  // IS the documented usage. The risk is a selector LIKE '.globalBox' if
  // it appeared earlier in the string. The current grammar reserves the
  // keyword to the start of the string only, so this guards selectors
  // already.
  // Real probe: a selector containing the substring 'global' should not
  // be mangled by the global-keyword path.
  it('does not strip the substring "global" from selectors when the global keyword is used', () => {
    const name = uniqueName('globalSel');
    const handlerSpy = vi.fn();
    registerBehavior({
      name,
      // The user wants delegation on a selector that contains 'global'.
      events: {
        'click .global-target': handlerSpy,
      },
      createBehavior: () => ({}),
    });
    const root = document.createElement('div');
    const child = document.createElement('button');
    child.className = 'global-target';
    root.appendChild(child);
    document.body.appendChild(root);
    $(root)[name]();
    child.click();
    expect(handlerSpy).toHaveBeenCalledTimes(1);
  });

  // [source behavior.js:191-198] When the event string itself starts
  // with the keyword (e.g. "global"), the FIRST occurrence of "global"
  // is stripped. If the selector also contains "global", this could
  // strip from the selector instead. Confirms that only the leading
  // keyword is removed, not a later occurrence.
  it('does not strip a substring "global" from a selector that follows the global keyword', () => {
    const name = uniqueName('globalKw');
    const handlerSpy = vi.fn();
    // Add a globally-scoped click handler on an element with 'global' in its class.
    const target = document.createElement('div');
    target.className = 'globalwrapper';
    document.body.appendChild(target);
    registerBehavior({
      name,
      events: {
        'global click .globalwrapper': handlerSpy,
      },
      createBehavior: () => ({}),
    });
    const host = document.createElement('div');
    document.body.appendChild(host);
    $(host)[name]();
    target.click();
    // If the keyword strip mangled the selector, this would fail.
    expect(handlerSpy).toHaveBeenCalledTimes(1);
  });

  // [skill component-behaviors] Tooltip's onHidden callback uses
  // `$(this).tooltip('set text', 'Copy Code')`. This pattern relies on
  // the natural-language method lookup ('set text' -> setText).
  // Verifies the canonical pattern from CodeSample.js.
  it('supports natural-language two-word setter invocation', () => {
    const name = uniqueName('natSet');
    let stored;
    registerBehavior({
      name,
      createBehavior: () => ({
        setText(text) {
          stored = text;
          return text;
        },
      }),
    });
    const el = document.createElement('div');
    document.body.appendChild(el);
    $(el)[name]();
    $(el)[name]('set text', 'Copy Code');
    expect(stored).toBe('Copy Code');
  });

  // [source behavior.js:608] `if (value === undefined)` means
  // setting('key', undefined) acts as a getter — you cannot explicitly
  // clear a setting by setting it to undefined.
  it('treats setting(key, undefined) as a getter, not a setter', () => {
    const name = uniqueName('undefSet');
    registerBehavior({
      name,
      defaultSettings: { mode: 'on' },
      createBehavior: () => ({}),
    });
    const el = document.createElement('div');
    document.body.appendChild(el);
    $(el)[name]();
    // Explicit undefined: getter contract.
    const result = el[name].setting('mode', undefined);
    expect(result).toBe('on');
    expect(el[name].setting('mode')).toBe('on');
  });

  // [source behavior.js:157-161] addDataOverrides uses
  // `if (elementData[name]) { ... }` — a truthy check. This means
  // data-* attributes with falsy parsed values (0, false, '')
  // silently fail to override the default. Documented user intent:
  // 'data-active="false"' should disable a default of true.
  // A frontend developer writing `<div data-enabled="false">` will
  // expect enabled === false, not the default true.
  it('lets data-* attributes override settings with false values', () => {
    const name = uniqueName('falseData');
    registerBehavior({
      name,
      defaultSettings: { enabled: true },
      createBehavior: ({ settings }) => ({
        read: () => settings.enabled,
      }),
    });
    const el = document.createElement('div');
    el.dataset.enabled = 'false'; // user wants to disable via attribute
    document.body.appendChild(el);
    $(el)[name]();
    // Expected per skill: data-* attributes override settings.
    // Source uses truthy check → false is silently ignored.
    expect($(el)[name]('read')).toBe(false);
  });

  it('lets data-* attributes override settings with zero values', () => {
    const name = uniqueName('zeroData');
    registerBehavior({
      name,
      defaultSettings: { delay: 100 },
      createBehavior: ({ settings }) => ({
        read: () => settings.delay,
      }),
    });
    const el = document.createElement('div');
    el.dataset.delay = '0'; // user wants instant: 0 ms delay
    document.body.appendChild(el);
    $(el)[name]();
    // Expected per skill: data-* attributes override settings.
    // Source uses truthy check → 0 is silently ignored.
    expect($(el)[name]('read')).toBe(0);
  });

  it('lets data-* attributes override settings with empty-string values', () => {
    const name = uniqueName('emptyData');
    registerBehavior({
      name,
      defaultSettings: { label: 'default' },
      createBehavior: ({ settings }) => ({
        read: () => settings.label,
      }),
    });
    const el = document.createElement('div');
    el.dataset.label = ''; // user wants to clear the label
    document.body.appendChild(el);
    $(el)[name]();
    // Expected per skill: data-* attributes override settings.
    // Source uses truthy check → '' is silently ignored.
    expect($(el)[name]('read')).toBe('');
  });
});

/* -----------------------------------------------------------------------
   Behavior.getInstance
----------------------------------------------------------------------- */

describe('Behavior.getInstance — static access to instance', () => {
  it('returns the same instance stored on element[namespace]', () => {
    const name = uniqueName('inst');
    registerBehavior({ name, createBehavior: () => ({}) });
    const el = document.createElement('div');
    document.body.appendChild(el);
    $(el)[name]();
    expect(Behavior.getInstance(el, name)).toBe(el[name]);
  });
});

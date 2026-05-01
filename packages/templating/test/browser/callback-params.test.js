// Surface 3 — Callback params.
//
// Pins the destructurable namespace handed to every consumer-supplied
// callback (lifecycle hooks, event handlers, key handlers, createComponent).
// Source: `packages/templating/src/template.js`, `buildCallParams` (815–862),
// `call` (791–812), `createInterval`/`createTimeout` (988–998), `reaction`/
// `signal` (1006–1012).
//
// Scope:
//   - Identity, reactive layers, helpers, timers, lifecycle helpers,
//     state helpers, DOM helpers, tree helpers, misc.
//   - Event-callback extras (event/target/value/data/isDeep) — pin C1.
//   - Key-callback extras (event/inputFocused/repeatedKey) — pin C2.
//   - isPrototype short-circuit; this-binding contrast; cached callParams.
//   - Lifecycle-hook delivery: same callParams reach onCreated/onRendered/
//     onDestroyed with $/$$/etc. correctly bound and scoped.
//
// Surface 3 doesn't depend on shadow vs light DOM, so all mounts use the
// host's light DOM as the renderRoot — events delegate directly to `host`.
//
// B7 fix-before-merge: `value` resolution (line 572) uses `||` not `??` —
// only the empty-input case actually fails today; the other three pass
// because `||` returns the last operand when nothing is truthy. All four
// are pinned for the post-fix `??` contract.

import { Reaction, Signal } from '@semantic-ui/reactivity';
import { Renderer, ServerRenderer } from '@semantic-ui/renderer';
import { Template, TemplateHelpers } from '@semantic-ui/templating';
import { afterEach, describe, expect, it, vi } from 'vitest';

const realEngine = { renderer: Renderer, serverRenderer: ServerRenderer };

afterEach(() => {
  Template.renderedTemplates.clear();
  Template.templateCount = 0;
  document.body.innerHTML = '';
});

/**
 * Mount a Template into a host element using LIGHT DOM as the renderRoot.
 * Returns the host, the Template instance, and a cleanup. Callers attach
 * markup via `host.innerHTML = ...` after mount when they need real DOM
 * for event delegation — the renderer is real, but Surface 3 contracts
 * don't depend on rendered output.
 */
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
  await tpl.attach(host); // light DOM
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

/**
 * Capture the callParams object handed to `onCreated`. Returns a
 * reference to that object plus the fixture's cleanup — the test owns
 * teardown.
 */
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

/*******************************
        Identity Params
*******************************/

describe('callback params — identity (el/self/tpl/component/template/templateName/templates)', () => {
  it('exposes el as the host (component) DOM element', async () => {
    const { params, fixture } = await captureCreatedParams();
    expect(params.el).toBe(fixture.host);
    fixture.cleanup();
  });

  it('exposes self, tpl, component as the SAME instance reference', async () => {
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

  it('exposes template as `this` (the Template instance)', async () => {
    const { params, fixture } = await captureCreatedParams();
    expect(params.template).toBe(fixture.template);
    fixture.cleanup();
  });

  it('exposes templateName matching the Template`s name', async () => {
    const { params, fixture } = await captureCreatedParams({ templateName: 'CustomName' });
    expect(params.templateName).toBe('CustomName');
    fixture.cleanup();
  });

  it('exposes templates as the global Template.renderedTemplates registry', async () => {
    const { params, fixture } = await captureCreatedParams();
    expect(params.templates).toBe(Template.renderedTemplates);
    fixture.cleanup();
  });
});

/*******************************
       Reactive Layers
*******************************/

describe('callback params — reactive layers (data/settings/state)', () => {
  it('exposes data as the live data object on the Template (not a copy)', async () => {
    const initial = { foo: 1 };
    const { params, fixture } = await captureCreatedParams({ data: initial });
    expect(params.data).toBe(fixture.template.data);
    fixture.cleanup();
  });

  it('exposes settings (live), falling back to element.settings if no own settings', async () => {
    const { params, fixture } = await captureCreatedParams();
    // Without own settings, falls through to element?.settings
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

  it('mutating state through params.state.count.set(...) propagates reactively', async () => {
    const { params, fixture } = await captureCreatedParams({ defaultState: { count: 0 } });
    let observed;
    Reaction.create(() => {
      observed = params.state.count.get();
    });
    params.state.count.set(7);
    Reaction.flush();
    expect(observed).toBe(7);
    fixture.cleanup();
  });
});

/*******************************
     Reactivity Helpers
*******************************/

describe('callback params — reactivity helpers (signal/reaction/flush/afterFlush/nonreactive)', () => {
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
    Reaction.flush();
    expect(runs).toBe(1);
    expect(fixture.template.reactions.length).toBe(beforeCount + 1);
    // mutation triggers
    sig.set(1);
    Reaction.flush();
    expect(runs).toBe(2);
    // destroy stops the reaction
    fixture.cleanup();
    sig.set(2);
    Reaction.flush();
    expect(runs).toBe(2); // no new fires after destroy
  });

  it('flush, afterFlush, nonreactive are static Reaction helpers', async () => {
    const { params, fixture } = await captureCreatedParams();
    expect(params.flush).toBe(Reaction.flush);
    expect(params.afterFlush).toBe(Reaction.afterFlush);
    expect(params.nonreactive).toBe(Reaction.nonreactive);
    fixture.cleanup();
  });
});

/*******************************
     Auto-cleanup Timers
*******************************/

describe('callback params — auto-cleanup timers (interval/timeout)', () => {
  it('interval() returns id and fires repeatedly until destroy', async () => {
    const { params, fixture } = await captureCreatedParams();
    let fires = 0;
    const id = params.interval(() => {
      fires++;
    }, 5);
    expect(typeof id === 'number' || typeof id === 'object').toBe(true);
    // wait long enough for at least 2 intervals
    await new Promise(r => setTimeout(r, 30));
    expect(fires).toBeGreaterThanOrEqual(2);
    const fireCountBeforeDestroy = fires;
    fixture.cleanup();
    await new Promise(r => setTimeout(r, 30));
    // After destroy, abortController.abort() ran → clearInterval fired
    expect(fires).toBe(fireCountBeforeDestroy);
  });

  it('timeout() schedules a single fire and is canceled when destroy precedes', async () => {
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

describe('callback params — lifecycle helpers (dispatchEvent/attachEvent/bindKey/unbindKey)', () => {
  it('dispatchEvent, attachEvent, bindKey, unbindKey are bound to the Template', async () => {
    const { params, fixture } = await captureCreatedParams();
    // Each is a function (bound copy); calling them via params goes through
    // the Template's `this` regardless of caller context.
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

describe('callback params — state helpers (isRendered/isServer/isClient/darkMode/isHydrating)', () => {
  it('isRendered() returns the Template`s rendered flag', async () => {
    const { params, fixture } = await captureCreatedParams();
    // initialize() doesn't mark rendered yet; render() does.
    expect(params.isRendered()).toBe(false);
    fixture.template.markRendered();
    expect(params.isRendered()).toBe(true);
    fixture.cleanup();
  });

  it('isServer is false in the browser env, isClient is true', async () => {
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
    // Re-read params.darkMode multiple times → calls increments
    const params = fixture.template.callParams;
    expect(params.darkMode).toBe(false);
    expect(calls).toBe(1);
    returnValue = true;
    expect(params.darkMode).toBe(true);
    expect(calls).toBe(2);
    fixture.cleanup();
  });

  it('isHydrating is a getter — tracks template.isHydrating live', async () => {
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

describe('callback params — DOM helpers ($/$$)', () => {
  it('$ and $$ are present and callable (bound)', async () => {
    const { params, fixture } = await captureCreatedParams();
    expect(typeof params.$).toBe('function');
    expect(typeof params.$$).toBe('function');
    // callable without TypeError (semantics owned by Surface 5)
    expect(() => params.$('div')).not.toThrow();
    expect(() => params.$$('div')).not.toThrow();
    fixture.cleanup();
  });
});

/*******************************
       Tree Helpers
*******************************/

describe('callback params — tree helpers (findTemplate/findParent/findChild/findChildren)', () => {
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
        Misc Params
*******************************/

describe('callback params — misc (helpers/content/abortController/abortSignal/rerender)', () => {
  it('exposes helpers as TemplateHelpers', async () => {
    const { params, fixture } = await captureCreatedParams();
    expect(params.helpers).toBe(TemplateHelpers);
    fixture.cleanup();
  });

  it('exposes content as this.instance.content', async () => {
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

  it('exposes abortController and abortSignal — same controller pair as the Template', async () => {
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

  it('rerender() is safe when element is undefined (no-op via optional chaining)', () => {
    // Construct a Template with no element; rerender() should noop.
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
});

/*******************************
       Source-delivered, doc-omitted
*******************************/

describe('callback params — source-delivered, doc-omitted (unbindKey/abortController/content/isHydrating)', () => {
  it('exposes unbindKey (omitted from Standard Arguments table but delivered)', async () => {
    const { params, fixture } = await captureCreatedParams();
    expect(typeof params.unbindKey).toBe('function');
    fixture.cleanup();
  });

  it('exposes abortController (only abortSignal listed in doc)', async () => {
    const { params, fixture } = await captureCreatedParams();
    expect(params.abortController).toBeInstanceOf(AbortController);
    fixture.cleanup();
  });

  it('exposes content (undocumented)', async () => {
    const { fixture } = await captureCreatedParams({
      createComponent() {
        return { content: 'X' };
      },
    });
    // Re-grab from cached callParams (params variable was captured via onCreated)
    expect(fixture.template.callParams.content).toBe('X');
    fixture.cleanup();
  });

  it('exposes isHydrating (undocumented in Standard Arguments table)', async () => {
    const fixture = await mountTemplate({});
    const desc = Object.getOwnPropertyDescriptor(fixture.template.callParams, 'isHydrating');
    // It's a getter, so descriptor has a `get`, not `value`
    expect(typeof desc.get).toBe('function');
    fixture.cleanup();
  });
});

/*******************************
   Event Callback Extras (C1 + B7)
*******************************/

/**
 * Mount a Template fixture and inject HTML directly into the host (light
 * DOM = renderRoot). Template.attachEvents delegates to renderRoot, so the
 * test buttons end up inside the delegation scope without going through
 * the renderer's render() → DocumentFragment append step.
 */
async function mountForEvents({ hostHTML, events }) {
  const fixture = await mountTemplate({ template: '<div></div>', events });
  fixture.host.innerHTML = hostHTML;
  return fixture;
}

describe('event callback extras — event, target, value, data, isDeep', () => {
  it('passes event (raw DOM event) and target (matched element)', async () => {
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

  it('C1 — `el` remains the component element; `target` is the dispatching element (NOT same as `el`)', async () => {
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

  it('passes value resolved from target.value (input element)', async () => {
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

  it('passes data merging dataset (JSON-parsed) and event.detail', async () => {
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
    // dataset numeric IS JSON-parsed (number 42), then detail.amount wins → 99
    expect(captured.data.amount).toBe(99);
    // data-name fails JSON.parse → kept as raw string "alpha"
    expect(captured.data.name).toBe('alpha');
    expect(captured.data.extra).toBe('detail-key');
    fixture.cleanup();
  });

  it('dataset values are JSON-parsed when valid JSON, raw string otherwise', async () => {
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
    expect(captured.data.str).toBe('raw'); // 'raw' isn't valid JSON
    expect(captured.data.obj).toEqual({ k: 1 });
    fixture.cleanup();
  });

  it('isDeep is false when target is matched directly by the selector', async () => {
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

  // ─── B7 EXPECTED-BUG-PINS ─────────────────────────────────────────
  // Source line 572: `targetElement?.value || event.target?.value || event?.detail?.value`
  // uses `||`, so falsy-but-real values can fall through.
  //
  // Trace of the `||` chain reveals only ONE case actually fails today:
  //   - Empty <input>:   `'' || '' || undefined`     → `undefined`  ← FAIL
  //   - <input value=0>: `'0' || '0' || undefined`   → `'0'`        ← passes
  //   - detail.value=0:  `undef || undef || 0`       → `0`          ← passes (last operand)
  //   - detail.value='': `undef || undef || ''`      → `''`         ← passes (last operand)
  //
  // We pin all four assertions for the post-fix contract: under `??`, all
  // four return the underlying falsy-but-real value. Currently only the
  // empty-input case fails (the others happen to pass because `||` returns
  // the LAST operand when nothing is truthy). After fixing to `??`, the
  // intent is preserved for all four; pin all four so a future regression
  // (e.g. someone refactoring the chain) can't silently re-introduce.

  it('B7 — empty-string <input> preserves `value: ""` (NOT undefined) [EXPECTED FAIL]', async () => {
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

  it('B7 — numeric <input> with value "0" preserves `value: "0"` [PASSES under ||, last-operand]', async () => {
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
    // .value reads as string "0" (truthy), so this passes under either
    // operator. Pinning so a refactor that reads valueAsNumber doesn't
    // silently change behavior.
    expect(captured.value).toBe('0');
    fixture.cleanup();
  });

  it('B7 — custom event with detail.value === 0 preserves `value: 0` [PASSES under ||, last-operand]', async () => {
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

  it('B7 — custom event with detail.value === "" preserves `value: ""` [PASSES under ||, last-operand]', async () => {
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
     Key Callback Extras (C2)
*******************************/

describe('key callback extras — event, inputFocused, repeatedKey', () => {
  it('C2 — event (raw KeyboardEvent) IS delivered to key callbacks', async () => {
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

  it('inputFocused is true when an <input> is focused', async () => {
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

  it('inputFocused is false/falsy when no input is focused', async () => {
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
    // body has no tagName matching, no contentEditable
    expect(Boolean(captured.inputFocused)).toBe(false);
    fixture.cleanup();
  });

  it('repeatedKey is true when same key fires consecutively without keyup interleaving', async () => {
    const captures = [];
    const fixture = await mountTemplate({
      keys: {
        c(params) {
          captures.push(params.repeatedKey);
        },
      },
    });
    // First press: currentKey is '' so c != '', repeatedKey false
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'c' }));
    // Second press WITHOUT keyup: repeatedKey === true (currentKey === 'c')
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
  it('returns undefined and does NOT fire callback when isPrototype is true', () => {
    let fired = false;
    const tpl = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      isPrototype: true,
    });
    // Don't initialize() — prototype templates are not initialized; just exercise call().
    const result = tpl.call(() => {
      fired = true;
    });
    expect(result).toBeUndefined();
    expect(fired).toBe(false);
  });

  it('cloned (non-prototype) Template DOES fire callbacks via call()', () => {
    const proto = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      isPrototype: true,
    });
    const cloned = proto.clone({ isPrototype: false });
    cloned.initialize(); // populates callParams, etc.
    let fired = false;
    cloned.call(() => {
      fired = true;
    });
    expect(fired).toBe(true);
    cloned.onDestroyed();
  });

  it('returns undefined for non-function func (tolerant)', () => {
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
       this-binding contrast
*******************************/

describe('call() — this-binding inside callbacks', () => {
  it('createComponent runs with this === instance (the createComponent return)', async () => {
    let capturedThis;
    const fixture = await mountTemplate({
      createComponent() {
        capturedThis = this;
        return { tag: 'instance-marker' };
      },
    });
    // In createComponent, `this` is the same object that becomes `this.instance`.
    // After extend(template.instance, returned), template.instance has the marker.
    // The `this` captured was BEFORE extend, but it IS the same object reference
    // that `template.instance` points to.
    expect(capturedThis).toBe(fixture.template.instance);
    fixture.cleanup();
  });

  it('onCreated runs with this === element (the host)', async () => {
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
    // Trigger onRendered explicitly — render() schedules it via setTimeout
    fixture.template.render();
    // Wait for the setTimeout(...,0) to fire onRendered
    await new Promise(r => setTimeout(r, 5));
    expect(capturedThis).toBe(fixture.host);
    fixture.cleanup();
  });

  it('event handlers run with this === matched (target) element (line 559 bind override)', async () => {
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
    // The user handler is `boundEvent = userHandler.bind(targetElement)`,
    // then `template.call(boundEvent, ...)`. Bound functions ignore `apply`'s
    // `thisArg`, so `this === targetElement` regardless of `call()`'s default.
    expect(capturedThis).toBe(btn);
    fixture.cleanup();
  });
});

/*******************************
        Cached callParams
*******************************/

describe('call() — cached callParams', () => {
  it('this.callParams is built once at end of initialize()', async () => {
    const fixture = await mountTemplate({});
    // After initialize → onCreated, callParams is populated.
    expect(fixture.template.callParams).toBeDefined();
    expect(typeof fixture.template.callParams).toBe('object');
    fixture.cleanup();
  });

  it('reuses the SAME callParams reference across multiple plain calls (no additionalData)', async () => {
    const observed = [];
    const fixture = await mountTemplate({});
    fixture.template.call((p) => observed.push(p));
    fixture.template.call((p) => observed.push(p));
    expect(observed.length).toBe(2);
    expect(observed[0]).toBe(observed[1]);
    expect(observed[0]).toBe(fixture.template.callParams);
    fixture.cleanup();
  });

  it('reuses bound function references across cached callParams (e.g., self, $)', async () => {
    const observed = [];
    const fixture = await mountTemplate({});
    fixture.template.call((p) => observed.push(p));
    fixture.template.call((p) => observed.push(p));
    expect(observed[0].self).toBe(observed[1].self);
    expect(observed[0].$).toBe(observed[1].$);
    expect(observed[0].$$).toBe(observed[1].$$);
    fixture.cleanup();
  });

  it('additionalData merge produces a NEW object but same underlying callParams source', async () => {
    const observed = [];
    const fixture = await mountTemplate({});
    fixture.template.call((p) => observed.push(p), { additionalData: { x: 1 } });
    fixture.template.call((p) => observed.push(p), { additionalData: { x: 2 } });
    expect(observed[0]).not.toBe(observed[1]); // different merged objects
    expect(observed[0].x).toBe(1);
    expect(observed[1].x).toBe(2);
    // self still refers to the same instance (came from cached callParams)
    expect(observed[0].self).toBe(observed[1].self);
    fixture.cleanup();
  });
});

/*******************************
   Lifecycle-callback args delivery
*******************************/

// Pin that the params object isn't just present in createComponent — it
// reaches onCreated/onRendered/onDestroyed too, with $/$$/etc. correctly
// bound and scoped. Surface 8 owns deeper traversal contracts; here we
// just confirm the bindings reach lifecycle hooks cleanly.

describe('callback params — delivered correctly to lifecycle hooks', () => {
  it('onCreated({ $ }) — $ is bound to the Template, captured for later, scopes to renderRoot once attached', async () => {
    // Note: onCreated fires inside initialize(), which runs BEFORE attach()
    // sets this.renderRoot. So `$` invoked synchronously inside onCreated
    // would walk an empty/global root. The realistic and supported pattern
    // is to CAPTURE the bound `$` reference inside onCreated and invoke
    // it later (after attach completes, or from onRendered / event
    // handlers). Pin: the captured reference is bound to the Template
    // and resolves correctly once the renderRoot is wired.
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
    // $ is renderRoot-scoped; the document.body sibling is NOT visible
    expect(foundOutside.length).toBe(0);

    tpl.onDestroyed();
    host.remove();
    outsider.remove();
  });

  it('onRendered({ self, state, settings }) — self is the createComponent instance, state Signals are accessible, settings reflects current values', async () => {
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
    // settings falls through to element.settings when no own settings
    expect(captured.settings).toBe(fixture.template.settings || fixture.host.settings);

    fixture.cleanup();
  });

  it('onRendered({ event }) — event is NOT in lifecycle args (only event-callbacks have it)', async () => {
    let captured;
    const fixture = await mountTemplate({
      onRendered(params) {
        captured = params;
      },
    });
    fixture.template.render();
    await new Promise(r => setTimeout(r, 5));
    expect(captured).toBeDefined();
    // event is added via additionalData on event-handler dispatch only
    expect(captured.event).toBeUndefined();
    expect('event' in captured).toBe(false);
    fixture.cleanup();
  });

  it('onDestroyed({ self }) — self is still accessible inside the destroy callback', async () => {
    let capturedSelf;
    let capturedDestroyedFlag;
    const fixture = await mountTemplate({
      createComponent() {
        return { tag: 'still-here' };
      },
      onDestroyed({ self }) {
        capturedSelf = self;
        // also pin: by the time the user callback runs, the wrapper has
        // already flipped destroyed=true (template.js line 244 → 250).
        capturedDestroyedFlag = fixture.template.destroyed;
      },
    });
    const instanceRef = fixture.template.instance;
    fixture.cleanup();
    expect(capturedSelf).toBe(instanceRef);
    expect(capturedSelf.tag).toBe('still-here');
    expect(capturedDestroyedFlag).toBe(true);
  });

  it('onCreated({ isHydrating }) — getter reflects template.isHydrating set by the hydration path', async () => {
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
    // After flipping back, the live getter on cached callParams updates.
    tpl.isHydrating = false;
    expect(tpl.callParams.isHydrating).toBe(false);
    tpl.onDestroyed();
    host.remove();
  });

  it('onCreated({ findParent, findChild }) — these are bound and callable from inside the hook', async () => {
    let capturedFindParent;
    let capturedFindChild;
    let parentReturn;
    let childReturn;
    const fixture = await mountTemplate({
      onCreated({ findParent, findChild }) {
        capturedFindParent = findParent;
        capturedFindChild = findChild;
        // Calling them returns shape (Surface 8 owns deeper traversal tests).
        // Without a parent template or child templates wired up, calls should
        // still execute without throwing — they're bound copies of the
        // Template methods.
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

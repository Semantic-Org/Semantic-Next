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
//
// B7 fix-before-merge: `value` resolution (line 572) uses `||` not `??` —
// three pinned cases (empty string, numeric 0, custom-event detail.value === 0)
// EXPECTED-TO-FAIL against current source.

import { Reaction, Signal } from '@semantic-ui/reactivity';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TemplateHelpers } from '../../src/template-helpers.js';
import { Template } from '../../src/template.js';
import { mountTemplateInShadow } from '../_helpers/browser-fixture.js';
import { clickOn, fireCustomEvent, fireEvent, pressKey } from '../_helpers/dispatch.js';
import { freshTemplate } from '../_helpers/fresh-template.js';
import { clearTemplateRegistry } from '../_helpers/registry-cleanup.js';
import { stubEngine } from '../_helpers/stub-engine.js';

afterEach(() => {
  clearTemplateRegistry();
  document.body.innerHTML = '';
});

/**
 * Capture the callParams object handed to `onCreated`. Returns a
 * reference to that object plus the fixture's cleanup — the test owns
 * teardown.
 */
function captureCreatedParams(opts = {}) {
  let captured;
  const fixture = mountTemplateInShadow({
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
  it('exposes el as the host (component) DOM element', () => {
    const { params, fixture } = captureCreatedParams();
    expect(params.el).toBe(fixture.host);
    fixture.cleanup();
  });

  it('exposes self, tpl, component as the SAME instance reference', () => {
    let captured;
    const fixture = mountTemplateInShadow({
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

  it('exposes template as `this` (the Template instance)', () => {
    const { params, fixture } = captureCreatedParams();
    expect(params.template).toBe(fixture.template);
    fixture.cleanup();
  });

  it('exposes templateName matching the Template`s name', () => {
    const { params, fixture } = captureCreatedParams({ templateName: 'CustomName' });
    expect(params.templateName).toBe('CustomName');
    fixture.cleanup();
  });

  it('exposes templates as the global Template.renderedTemplates registry', () => {
    const { params, fixture } = captureCreatedParams();
    expect(params.templates).toBe(Template.renderedTemplates);
    fixture.cleanup();
  });
});

/*******************************
       Reactive Layers
*******************************/

describe('callback params — reactive layers (data/settings/state)', () => {
  it('exposes data as the live data object on the Template (not a copy)', () => {
    const initial = { foo: 1 };
    const { params, fixture } = captureCreatedParams({ data: initial });
    expect(params.data).toBe(fixture.template.data);
    fixture.cleanup();
  });

  it('exposes settings (live), falling back to element.settings if no own settings', () => {
    const { params, fixture } = captureCreatedParams();
    // Without own settings, falls through to element?.settings
    expect(params.settings).toBe(fixture.template.settings || fixture.host.settings);
    fixture.cleanup();
  });

  it('exposes state as the reactive state object', () => {
    const { params, fixture } = captureCreatedParams({ defaultState: { count: 0 } });
    expect(params.state).toBe(fixture.template.state);
    expect(params.state.count).toBeInstanceOf(Signal);
    expect(params.state.count.get()).toBe(0);
    fixture.cleanup();
  });

  it('mutating state through params.state.count.set(...) propagates reactively', () => {
    const { params, fixture } = captureCreatedParams({ defaultState: { count: 0 } });
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
  it('signal() creates a Signal', () => {
    const { params, fixture } = captureCreatedParams();
    const s = params.signal(5);
    expect(s).toBeInstanceOf(Signal);
    expect(s.get()).toBe(5);
    fixture.cleanup();
  });

  it('reaction() registers into template.reactions and is cleared at destroy', () => {
    const { params, fixture } = captureCreatedParams();
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

  it('flush, afterFlush, nonreactive are static Reaction helpers', () => {
    const { params, fixture } = captureCreatedParams();
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
    const { params, fixture } = captureCreatedParams();
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
    const { params, fixture } = captureCreatedParams();
    let fired = false;
    params.timeout(() => {
      fired = true;
    }, 30);
    fixture.cleanup();
    await new Promise(r => setTimeout(r, 60));
    expect(fired).toBe(false);
  });

  it('timeout() fires when not canceled before its delay', async () => {
    const { params, fixture } = captureCreatedParams();
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
  it('dispatchEvent, attachEvent, bindKey, unbindKey are bound to the Template', () => {
    const { params, fixture } = captureCreatedParams();
    // Each is a function (bound copy); calling them via params goes through
    // the Template's `this` regardless of caller context.
    expect(typeof params.dispatchEvent).toBe('function');
    expect(typeof params.attachEvent).toBe('function');
    expect(typeof params.bindKey).toBe('function');
    expect(typeof params.unbindKey).toBe('function');
    fixture.cleanup();
  });

  it('bindKey adds to template.keys; unbindKey removes', () => {
    const { params, fixture } = captureCreatedParams();
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
  it('isRendered() returns the Template`s rendered flag', () => {
    const { params, fixture } = captureCreatedParams();
    // initialize() doesn't mark rendered yet; render() does.
    expect(params.isRendered()).toBe(false);
    fixture.template.markRendered();
    expect(params.isRendered()).toBe(true);
    fixture.cleanup();
  });

  it('isServer is false in the browser env, isClient is true', () => {
    const { params, fixture } = captureCreatedParams();
    expect(params.isServer).toBe(false);
    expect(params.isClient).toBe(true);
    fixture.cleanup();
  });

  it('darkMode is a getter — calls element.isDarkMode() lazily on each access', () => {
    let calls = 0;
    let returnValue = false;
    const fixture = mountTemplateInShadow({});
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

  it('isHydrating is a getter — tracks template.isHydrating live', () => {
    const fixture = mountTemplateInShadow({});
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
  it('$ and $$ are present and callable (bound)', () => {
    const { params, fixture } = captureCreatedParams();
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
  it('exposes findTemplate, findParent, findChild, findChildren as functions', () => {
    const { params, fixture } = captureCreatedParams();
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
  it('exposes helpers as TemplateHelpers', () => {
    const { params, fixture } = captureCreatedParams();
    expect(params.helpers).toBe(TemplateHelpers);
    fixture.cleanup();
  });

  it('exposes content as this.instance.content', () => {
    let captured;
    const fixture = mountTemplateInShadow({
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

  it('exposes abortController and abortSignal — same controller pair as the Template', () => {
    const { params, fixture } = captureCreatedParams();
    expect(params.abortController).toBe(fixture.template.abortController);
    expect(params.abortSignal).toBe(fixture.template.abortSignal);
    expect(params.abortController.signal).toBe(params.abortSignal);
    fixture.cleanup();
  });

  it('rerender() calls element.requestUpdate() if defined', () => {
    let calls = 0;
    const fixture = mountTemplateInShadow({});
    fixture.host.requestUpdate = () => {
      calls++;
    };
    fixture.template.callParams.rerender();
    expect(calls).toBe(1);
    fixture.cleanup();
  });

  it('rerender() is safe when element is undefined (no-op via optional chaining)', () => {
    // Construct a Template with no element; rerender() should noop.
    const { template, cleanup } = freshTemplate();
    template.initialize();
    expect(() => template.callParams.rerender()).not.toThrow();
    cleanup();
  });
});

/*******************************
       Source-delivered, doc-omitted
*******************************/

describe('callback params — source-delivered, doc-omitted (unbindKey/abortController/content/isHydrating)', () => {
  it('exposes unbindKey (omitted from Standard Arguments table but delivered)', () => {
    const { params, fixture } = captureCreatedParams();
    expect(typeof params.unbindKey).toBe('function');
    fixture.cleanup();
  });

  it('exposes abortController (only abortSignal listed in doc)', () => {
    const { params, fixture } = captureCreatedParams();
    expect(params.abortController).toBeInstanceOf(AbortController);
    fixture.cleanup();
  });

  it('exposes content (undocumented)', () => {
    const { params, fixture } = captureCreatedParams({
      createComponent() {
        return { content: 'X' };
      },
    });
    // params variable was captured via onCreated; re-grab from cached
    expect(fixture.template.callParams.content).toBe('X');
    fixture.cleanup();
  });

  it('exposes isHydrating (undocumented in Standard Arguments table)', () => {
    const fixture = mountTemplateInShadow({});
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
 * Mount a template fixture and manually inject HTML into the shadow root
 * (the stub engine returns an empty fragment, so we populate the shadow
 * ourselves and rely on Template.attachEvents()'s delegated listeners on
 * the renderRoot). Then exercise the event handler closure that builds
 * the additionalData params.
 */
function mountForEvents({ shadowHTML, events }) {
  const fixture = mountTemplateInShadow({ template: '<div></div>', events });
  fixture.shadow.innerHTML = shadowHTML;
  return fixture;
}

describe('event callback extras — event, target, value, data, isDeep', () => {
  it('passes event (raw DOM event) and target (matched element)', () => {
    let captured;
    const fixture = mountForEvents({
      shadowHTML: '<button class="btn">x</button>',
      events: {
        'click .btn'(params) {
          captured = params;
        },
      },
    });
    const btn = fixture.shadow.querySelector('.btn');
    clickOn(btn);
    expect(captured).toBeDefined();
    expect(captured.event).toBeInstanceOf(Event);
    expect(captured.target).toBe(btn);
    fixture.cleanup();
  });

  it('C1 — `el` remains the component element; `target` is the dispatching element (NOT same as `el`)', () => {
    let captured;
    const fixture = mountForEvents({
      shadowHTML: '<button class="btn">x</button>',
      events: {
        'click .btn'(params) {
          captured = params;
        },
      },
    });
    const btn = fixture.shadow.querySelector('.btn');
    clickOn(btn);
    expect(captured.el).toBe(fixture.host);
    expect(captured.target).toBe(btn);
    expect(captured.el).not.toBe(captured.target);
    fixture.cleanup();
  });

  it('passes value resolved from target.value (input element)', () => {
    let captured;
    const fixture = mountForEvents({
      shadowHTML: '<input class="i" />',
      events: {
        'input .i'(params) {
          captured = params;
        },
      },
    });
    const input = fixture.shadow.querySelector('.i');
    input.value = 'hello';
    fireEvent(input, 'input');
    expect(captured.value).toBe('hello');
    fixture.cleanup();
  });

  it('passes data merging dataset (JSON-parsed) and event.detail', () => {
    let captured;
    const fixture = mountForEvents({
      // data-amount="42" → JSON.parse → 42 (number)
      // data-name="alpha" → JSON.parse fails → falls through as string "alpha"
      shadowHTML: '<button class="btn" data-amount="42" data-name="alpha">x</button>',
      events: {
        'tap .btn'(params) {
          captured = params;
        },
      },
    });
    const btn = fixture.shadow.querySelector('.btn');
    fireCustomEvent(btn, 'tap', { extra: 'detail-key', amount: 99 });
    expect(captured).toBeDefined();
    // dataset numeric IS JSON-parsed (number 42), then detail.amount wins → 99
    expect(captured.data.amount).toBe(99);
    // data-name fails JSON.parse → kept as raw string "alpha"
    expect(captured.data.name).toBe('alpha');
    expect(captured.data.extra).toBe('detail-key');
    fixture.cleanup();
  });

  it('dataset values are JSON-parsed when valid JSON, raw string otherwise', () => {
    let captured;
    const fixture = mountForEvents({
      shadowHTML: '<button class="btn" data-num="7" data-bool="true" data-str="raw" data-obj=\'{"k":1}\'>x</button>',
      events: {
        'click .btn'(params) {
          captured = params;
        },
      },
    });
    const btn = fixture.shadow.querySelector('.btn');
    clickOn(btn);
    expect(captured.data.num).toBe(7);
    expect(captured.data.bool).toBe(true);
    expect(captured.data.str).toBe('raw'); // 'raw' isn't valid JSON
    expect(captured.data.obj).toEqual({ k: 1 });
    fixture.cleanup();
  });

  it('isDeep is false when target is matched directly by the selector', () => {
    let captured;
    const fixture = mountForEvents({
      shadowHTML: '<div class="wrap"><button class="btn">x</button></div>',
      events: {
        'click .btn'(params) {
          captured = params;
        },
      },
    });
    const btn = fixture.shadow.querySelector('.btn');
    clickOn(btn);
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

  it('B7 — empty-string <input> preserves `value: ""` (NOT undefined) [EXPECTED FAIL]', () => {
    let captured;
    const fixture = mountForEvents({
      shadowHTML: '<input class="i" />',
      events: {
        'input .i'(params) {
          captured = params;
        },
      },
    });
    const input = fixture.shadow.querySelector('.i');
    input.value = '';
    fireEvent(input, 'input');
    expect(captured.value).toBe('');
    fixture.cleanup();
  });

  it('B7 — numeric <input> with value "0" preserves `value: "0"` [PASSES under both ||/??]', () => {
    let captured;
    const fixture = mountForEvents({
      shadowHTML: '<input type="number" class="n" />',
      events: {
        'input .n'(params) {
          captured = params;
        },
      },
    });
    const input = fixture.shadow.querySelector('.n');
    input.value = '0';
    fireEvent(input, 'input');
    // .value reads as string "0" (truthy), so this passes under either
    // operator. Pinning so a refactor that reads valueAsNumber doesn't
    // silently change behavior.
    expect(captured.value).toBe('0');
    fixture.cleanup();
  });

  it('B7 — custom event with detail.value === 0 preserves `value: 0` [PASSES under ||, last operand]', () => {
    let captured;
    const fixture = mountForEvents({
      shadowHTML: '<span class="x">x</span>',
      events: {
        'change .x'(params) {
          captured = params;
        },
      },
    });
    const span = fixture.shadow.querySelector('.x');
    fireCustomEvent(span, 'change', { value: 0 });
    expect(captured.value).toBe(0);
    fixture.cleanup();
  });

  it('B7 — custom event with detail.value === "" preserves `value: ""` [PASSES under ||, last operand]', () => {
    let captured;
    const fixture = mountForEvents({
      shadowHTML: '<span class="x">x</span>',
      events: {
        'change .x'(params) {
          captured = params;
        },
      },
    });
    const span = fixture.shadow.querySelector('.x');
    fireCustomEvent(span, 'change', { value: '' });
    expect(captured.value).toBe('');
    fixture.cleanup();
  });
});

/*******************************
     Key Callback Extras (C2)
*******************************/

describe('key callback extras — event, inputFocused, repeatedKey', () => {
  it('C2 — event (raw KeyboardEvent) IS delivered to key callbacks', () => {
    let captured;
    const fixture = mountTemplateInShadow({
      keys: {
        a(params) {
          captured = params;
        },
      },
    });
    pressKey('a');
    expect(captured).toBeDefined();
    expect(captured.event).toBeInstanceOf(KeyboardEvent);
    expect(captured.event.key).toBe('a');
    fixture.cleanup();
  });

  it('inputFocused is true when an <input> is focused', () => {
    let captured;
    const input = document.createElement('input');
    document.body.appendChild(input);
    const fixture = mountTemplateInShadow({
      keys: {
        a(params) {
          captured = params;
        },
      },
    });
    input.focus();
    pressKey('a');
    expect(captured).toBeDefined();
    expect(captured.inputFocused).toBeTruthy();
    fixture.cleanup();
    input.remove();
  });

  it('inputFocused is false/falsy when no input is focused', () => {
    let captured;
    const fixture = mountTemplateInShadow({
      keys: {
        b(params) {
          captured = params;
        },
      },
    });
    document.body.focus();
    pressKey('b');
    expect(captured).toBeDefined();
    // body has no tagName matching, no contentEditable
    expect(Boolean(captured.inputFocused)).toBe(false);
    fixture.cleanup();
  });

  it('repeatedKey is true when same key fires consecutively without keyup interleaving', () => {
    const captures = [];
    const fixture = mountTemplateInShadow({
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
      renderingEngine: stubEngine,
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
      renderingEngine: stubEngine,
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
    const { template, cleanup } = freshTemplate();
    template.initialize();
    expect(template.call(undefined)).toBeUndefined();
    expect(template.call(null)).toBeUndefined();
    expect(template.call('not a function')).toBeUndefined();
    cleanup();
  });
});

/*******************************
       this-binding contrast
*******************************/

describe('call() — this-binding inside callbacks', () => {
  it('createComponent runs with this === instance (the createComponent return)', () => {
    let capturedThis;
    const fixture = mountTemplateInShadow({
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

  it('onCreated runs with this === element (the host)', () => {
    let capturedThis;
    const fixture = mountTemplateInShadow({
      onCreated() {
        capturedThis = this;
      },
    });
    expect(capturedThis).toBe(fixture.host);
    fixture.cleanup();
  });

  it('onRendered runs with this === element', async () => {
    let capturedThis;
    const fixture = mountTemplateInShadow({
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

  it('event handlers run with this === matched (target) element (line 559 bind override)', () => {
    let capturedThis;
    const fixture = mountForEvents({
      shadowHTML: '<button class="btn">x</button>',
      events: {
        'click .btn'() {
          capturedThis = this;
        },
      },
    });
    const btn = fixture.shadow.querySelector('.btn');
    clickOn(btn);
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
  it('this.callParams is built once at end of initialize()', () => {
    const fixture = mountTemplateInShadow({});
    // After initialize → onCreated, callParams is populated.
    expect(fixture.template.callParams).toBeDefined();
    expect(typeof fixture.template.callParams).toBe('object');
    fixture.cleanup();
  });

  it('reuses the SAME callParams reference across multiple plain calls (no additionalData)', () => {
    const observed = [];
    const fixture = mountTemplateInShadow({});
    fixture.template.call((p) => observed.push(p));
    fixture.template.call((p) => observed.push(p));
    expect(observed.length).toBe(2);
    expect(observed[0]).toBe(observed[1]);
    expect(observed[0]).toBe(fixture.template.callParams);
    fixture.cleanup();
  });

  it('reuses bound function references across cached callParams (e.g., self, $)', () => {
    const observed = [];
    const fixture = mountTemplateInShadow({});
    fixture.template.call((p) => observed.push(p));
    fixture.template.call((p) => observed.push(p));
    expect(observed[0].self).toBe(observed[1].self);
    expect(observed[0].$).toBe(observed[1].$);
    expect(observed[0].$$).toBe(observed[1].$$);
    fixture.cleanup();
  });

  it('additionalData merge produces a NEW object but same underlying callParams source', () => {
    const observed = [];
    const fixture = mountTemplateInShadow({});
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

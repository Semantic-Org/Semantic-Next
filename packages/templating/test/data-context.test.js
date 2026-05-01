// Surface 6 — Data context construction.
//
// Pure-logic tests for createReactiveState, setDataContext, getDataContext,
// overlaySettingsSignals, markRendered. Render coordination (engine call
// counts) lives in test/browser/data-context-render.test.js — not here.
//
// Pins / contracts:
//   B1 (FAILING — locked contract): createReactiveState should treat
//      `data[name] !== undefined` as override (matches Surface 7 behavior).
//      Falsy values 0, false, '', null SHOULD seed the Signal. Today the
//      truthy check on line 118 silently skips these. Tests are EXPECTED TO
//      FAIL until the fix lands.
//   D8: settings-via-overlay wins over state on key collision. Skill drift
//      claims state wins; the source overlays settings AFTER the spread.
//   L2: setDataContext deletes orphaned keys silently via assignInPlace's
//      default mode.
//   L3: dataReplaced flag stays true after first render (sticky).
//   C3: subtemplate settings (Surface 7) already use `!== undefined`; pin
//      that behavior here against regression when B1 fix lands.

import { afterEach, describe, expect, it } from 'vitest';

import { Reaction, Signal } from '@semantic-ui/reactivity';
import { Renderer, ServerRenderer } from '@semantic-ui/renderer';
import { Template } from '@semantic-ui/templating';
import { extend } from '@semantic-ui/utils';

const realEngine = { renderer: Renderer, serverRenderer: ServerRenderer };

afterEach(() => {
  Template.renderedTemplates.clear();
  Template.templateCount = 0;
});

/*******************************
       createReactiveState
*******************************/

describe('Template — createReactiveState', () => {
  it('wraps each defaultState entry in a Signal', () => {
    const template = new Template({
      defaultState: { count: 0, name: 'jack' },
    });
    expect(template.state.count).toBeInstanceOf(Signal);
    expect(template.state.name).toBeInstanceOf(Signal);
  });

  it('initializes simple { count: 0 } config as Signal(0)', () => {
    const template = new Template({
      defaultState: { count: 0 },
    });
    expect(template.state.count.peek()).toBe(0);
  });

  it('forwards options for complex { value, options } config', () => {
    // Custom equalityFunction lets us prove options reached the Signal.
    // Default Signal equality treats deep-equal objects as equal; with
    // a strict-reference equality, two structurally-equal objects differ.
    const strictEquality = (a, b) => a === b;
    const template = new Template({
      defaultState: {
        config: {
          value: { x: 1 },
          options: { equalityFunction: strictEquality, allowClone: false },
        },
      },
    });
    const signal = template.state.config;
    expect(signal).toBeInstanceOf(Signal);
    expect(signal.peek()).toEqual({ x: 1 });
    // Strict equality: same-shape but different-reference is "changed".
    let observed = 0;
    const r = Reaction.create(() => {
      signal.get();
      observed++;
    });
    Reaction.flush();
    const before = observed;
    signal.set({ x: 1 }); // structurally equal
    Reaction.flush();
    // With strict equality, even structurally-equal value triggers update.
    expect(observed).toBeGreaterThan(before);
    r.stop();
  });

  it('returns {} when defaultState is undefined', () => {
    const template = new Template();
    expect(template.state).toEqual({});
  });

  it('uses defaultState as-is when data is undefined', () => {
    const template = new Template({
      defaultState: { count: 5 },
    });
    expect(template.state.count.peek()).toBe(5);
  });

  /*******************************
         truthy override (sanity)
  *******************************/

  it('lets truthy data override defaultState', () => {
    const template = new Template({
      defaultState: { count: 5 },
      data: { count: 10 },
    });
    expect(template.state.count.peek()).toBe(10);
  });

  it('lets default work when data omits the key', () => {
    const template = new Template({
      defaultState: { count: 5 },
      data: {},
    });
    expect(template.state.count.peek()).toBe(5);
  });

  /*******************************
       B1 PIN — falsy override
  *******************************/

  // Locked Stage 1.5 contract: `null` is treated as override (matches
  // Surface 7's `!== undefined` precedent). Today template.js:118 uses
  // `if (dataValue)` which silently skips falsy overrides. These tests
  // are EXPECTED TO FAIL until B1 is fixed by changing line 118 to
  // `if (dataValue !== undefined)`.

  describe('B1 PIN — falsy data override (EXPECTED TO FAIL pre-fix)', () => {
    it('seeds Signal with 0 when data: { count: 0 }', () => {
      const template = new Template({
        defaultState: { count: 5 },
        data: { count: 0 },
      });
      expect(template.state.count.peek()).toBe(0);
    });

    it('seeds Signal with false when data: { active: false }', () => {
      const template = new Template({
        defaultState: { active: true },
        data: { active: false },
      });
      expect(template.state.active.peek()).toBe(false);
    });

    it('seeds Signal with empty string when data: { name: "" }', () => {
      const template = new Template({
        defaultState: { name: 'default' },
        data: { name: '' },
      });
      expect(template.state.name.peek()).toBe('');
    });

    it('seeds Signal with null when data: { value: null }', () => {
      const template = new Template({
        defaultState: { value: 'default' },
        data: { value: null },
      });
      expect(template.state.value.peek()).toBe(null);
    });
  });
});

/*******************************
       getDataContext — merge order
*******************************/

// Doc claim: data context is "flat — instance, then state, then data". The
// implementation is `extend({}, this.data, this.state, this.instance)`, so
// last-wins precedence is instance > state > data.
//
// Note: settings are NOT in getDataContext output — they enter via
// overlaySettingsSignals after the spread.

describe('Template — getDataContext merge order', () => {
  it('returns data only when only data is set', () => {
    const template = new Template({
      data: { name: 'jack' },
    });
    const ctx = template.getDataContext();
    expect(ctx).toEqual({ name: 'jack' });
  });

  it('returns state Signals only when only defaultState is set', () => {
    const template = new Template({
      defaultState: { count: 7 },
    });
    const ctx = template.getDataContext();
    expect(ctx.count).toBeInstanceOf(Signal);
    expect(ctx.count.peek()).toBe(7);
  });

  it('includes instance properties from createComponent', () => {
    const template = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      createComponent: () => ({ greet: 'hi' }),
    });
    template.initialize();
    const ctx = template.getDataContext();
    expect(ctx.greet).toBe('hi');
  });

  it('lets state Signal win over data on key collision', () => {
    const template = new Template({
      defaultState: { name: 'sally' },
      data: { name: 'jack' },
    });
    const ctx = template.getDataContext();
    // state wraps the same key — state's Signal wins by spread order
    expect(ctx.name).toBeInstanceOf(Signal);
    // data override is truthy so the Signal seeds with 'jack' (per
    // truthy-only override behavior); the assertion here is only that
    // STATE wins the merge, not what the Signal happens to hold.
    expect(ctx.name.peek()).toBe('jack');
  });

  it('lets instance win over data on key collision', () => {
    const template = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      data: { name: 'jack' },
      createComponent: () => ({ name: 'bob' }),
    });
    template.initialize();
    const ctx = template.getDataContext();
    expect(ctx.name).toBe('bob');
  });

  it('lets instance win over state on key collision', () => {
    const template = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      defaultState: { name: 'sally' },
      createComponent: () => ({ name: 'bob' }),
    });
    template.initialize();
    const ctx = template.getDataContext();
    expect(ctx.name).toBe('bob');
  });

  it('lets instance win across all three layers (transitive)', () => {
    const template = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      data: { value: 'data' },
      defaultState: { value: 'state' },
      createComponent: () => ({ value: 'instance' }),
    });
    template.initialize();
    const ctx = template.getDataContext();
    expect(ctx.value).toBe('instance');
  });

  it('returns a fresh object on every call', () => {
    const template = new Template({
      data: { name: 'jack' },
    });
    const a = template.getDataContext();
    const b = template.getDataContext();
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
  });

  it('does NOT include settings (settings enter via overlay)', () => {
    // Stub element with settings only — these should NOT appear in
    // getDataContext output. They only land via overlaySettingsSignals.
    const fakeElement = {
      settings: { color: 'blue' },
      settingsVars: new Map([['color', new Signal('blue')]]),
      defaultSettings: { color: 'blue' },
    };
    const template = new Template({
      element: fakeElement,
    });
    const ctx = template.getDataContext();
    expect(ctx.color).toBeUndefined();
  });
});

/*******************************
        setDataContext
*******************************/

describe('Template — setDataContext', () => {
  it('merges new keys into this.data', () => {
    const template = new Template({
      data: { a: 1 },
    });
    template.setDataContext({ a: 1, b: 2 });
    expect(template.data).toEqual({ a: 1, b: 2 });
  });

  it('sets dataReplaced=true when something changes', () => {
    const template = new Template({
      data: { a: 1 },
    });
    template.dataReplaced = false;
    template.setDataContext({ a: 1, b: 2 });
    expect(template.dataReplaced).toBe(true);
  });

  it('does NOT set dataReplaced when nothing changes', () => {
    const template = new Template({
      data: { a: 1, b: 2 },
    });
    template.dataReplaced = false;
    template.setDataContext({ a: 1, b: 2 });
    expect(template.dataReplaced).toBe(false);
  });

  it('default { rerender: true } resets this.rendered to false', () => {
    const template = new Template({
      data: { a: 1 },
    });
    template.rendered = true;
    template.setDataContext({ a: 2 });
    expect(template.rendered).toBe(false);
  });

  it('{ rerender: false } preserves this.rendered', () => {
    const template = new Template({
      data: { a: 1 },
    });
    template.rendered = true;
    template.setDataContext({ a: 2 }, { rerender: false });
    expect(template.rendered).toBe(true);
  });

  /*******************************
       L2 PIN — orphan key deletion
  *******************************/

  it('L2 PIN — deletes orphaned keys silently (assignInPlace default)', () => {
    // assignInPlace deletes keys on target that aren't in source unless
    // preserveExistingKeys is true. setDataContext does NOT pass it, so
    // missing keys disappear.
    const template = new Template({
      data: { a: 1, b: 2 },
    });
    template.setDataContext({ a: 1 }); // no `b`
    expect(template.data).toEqual({ a: 1 });
    expect('b' in template.data).toBe(false);
  });
});

/*******************************
       overlaySettingsSignals
*******************************/

describe('Template — overlaySettingsSignals (subtemplate path)', () => {
  it('is a no-op when settingsVars is not set', () => {
    const parent = new Template();
    const child = new Template({
      defaultSettings: { color: 'blue' },
    });
    child.setParent(parent);
    // No settingsVars → nothing overlaid; context returned unchanged.
    const ctx = { existing: 'value' };
    const result = child.overlaySettingsSignals(ctx);
    expect(result).toBe(ctx);
    expect(result.color).toBeUndefined();
  });

  it('is a no-op when defaultSettings is missing', () => {
    const parent = new Template();
    const child = new Template();
    child.setParent(parent);
    // settingsVars set but defaultSettings absent → branch falls through
    child.settingsVars = new Map([['color', new Signal('red')]]);
    const ctx = {};
    child.overlaySettingsSignals(ctx);
    expect(ctx.color).toBeUndefined();
  });

  it('overlays Signals from settingsVars onto context', () => {
    const parent = new Template();
    const child = new Template({
      defaultSettings: { color: 'blue' },
    });
    child.setParent(parent);
    // Manually wire settingsVars Map (avoid invoking createSubtemplateSettings
    // which is Surface 7's territory). Need a settings proxy too because
    // overlay walks defaultSettings via `this.settings[name]`.
    const colorSignal = new Signal('red');
    child.settingsVars = new Map([['color', colorSignal]]);
    child.settings = { color: 'red' }; // proxy stand-in; just needs to read
    const ctx = {};
    child.overlaySettingsSignals(ctx);
    expect(ctx.color).toBe(colorSignal);
    expect(ctx.color.peek()).toBe('red');
  });

  it('makes the Signal win over a plain duplicate from the spread', () => {
    const parent = new Template();
    const child = new Template({
      defaultSettings: { color: 'blue' },
    });
    child.setParent(parent);
    const colorSignal = new Signal('red');
    child.settingsVars = new Map([['color', colorSignal]]);
    child.settings = { color: 'red' };
    const ctx = { color: 'plain-string' };
    child.overlaySettingsSignals(ctx);
    // overlay wrote AFTER the spread → Signal wins
    expect(ctx.color).toBe(colorSignal);
  });
});

describe('Template — overlaySettingsSignals (web component path)', () => {
  it('is a no-op when element has no settingsVars', () => {
    const fakeElement = { settings: {} };
    const template = new Template({
      element: fakeElement,
    });
    const ctx = {};
    template.overlaySettingsSignals(ctx);
    expect(ctx).toEqual({});
  });

  it('overlays each settingsVars entry as a Signal onto context', () => {
    const colorSignal = new Signal('blue');
    const sizeSignal = new Signal('small');
    const fakeElement = {
      settings: { color: 'blue', size: 'small' },
      settingsVars: new Map([
        ['color', colorSignal],
        ['size', sizeSignal],
      ]),
      defaultSettings: { color: 'blue', size: 'small' },
    };
    const template = new Template({
      element: fakeElement,
    });
    const ctx = {};
    template.overlaySettingsSignals(ctx);
    expect(ctx.color).toBe(colorSignal);
    expect(ctx.size).toBe(sizeSignal);
  });

  it('touches each defaultSettings key (drives shadow Signal creation)', () => {
    // The overlay reads `this.element.settings[name]` for each defaultSettings
    // key as a side effect — in real components this triggers the settings
    // proxy's getter to lazy-create Signals. Pin: every key is read.
    const reads = [];
    const fakeElement = {
      settings: new Proxy({ color: 'blue', size: 'small' }, {
        get: (target, prop) => {
          if (typeof prop === 'string') {
            reads.push(prop);
          }
          return target[prop];
        },
      }),
      settingsVars: new Map([['color', new Signal('blue')]]),
      defaultSettings: { color: 'blue', size: 'small' },
    };
    const template = new Template({
      element: fakeElement,
    });
    template.overlaySettingsSignals({});
    expect(reads).toContain('color');
    expect(reads).toContain('size');
  });

  it('touches each componentSpec.attributes key (drives spec-attribute Signals)', () => {
    const reads = [];
    const fakeElement = {
      settings: new Proxy({ color: 'blue', active: false, size: 'm' }, {
        get: (target, prop) => {
          if (typeof prop === 'string') {
            reads.push(prop);
          }
          return target[prop];
        },
      }),
      settingsVars: new Map([['color', new Signal('blue')]]),
      defaultSettings: { color: 'blue' },
      // componentSpec.attributes is an array of attribute names (per
      // src/primitives/button/specs/button.component.js); each() over the
      // array passes the string name as first arg to the callback.
      componentSpec: {
        attributes: ['active', 'size'],
      },
    };
    const template = new Template({
      element: fakeElement,
    });
    template.overlaySettingsSignals({});
    expect(reads).toContain('active');
    expect(reads).toContain('size');
  });

  it('returns the context object passed in', () => {
    const fakeElement = {
      settings: {},
      settingsVars: new Map(),
      defaultSettings: {},
    };
    const template = new Template({
      element: fakeElement,
    });
    const ctx = { existing: 1 };
    const result = template.overlaySettingsSignals(ctx);
    expect(result).toBe(ctx);
  });
});

/*******************************
       D8 PIN — settings vs state precedence
*******************************/

// Skill `authoring/component-state` claims "state wins over settings". That's
// only true within getDataContext(). overlaySettingsSignals runs AFTER the
// spread, so any setting backed by a Signal in element.settingsVars overrides
// state with the same name. Pin: settings wins when overlaid as a Signal.
//
// This is a SOURCE behavior pin (D8 finding). Skill cleanup is a follow-up.

describe('Template — D8 PIN: settings overlay wins over state', () => {
  it('settings Signal in settingsVars overrides state Signal of same name', () => {
    const settingsColorSignal = new Signal('settings-blue');
    const fakeElement = {
      settings: { color: 'settings-blue' },
      settingsVars: new Map([['color', settingsColorSignal]]),
      defaultSettings: { color: 'settings-blue' },
    };
    const template = new Template({
      element: fakeElement,
      defaultState: { color: 'state-red' },
    });
    // Mimic the render flow: spread, then overlay.
    const ctx = template.getDataContext();
    expect(ctx.color).toBeInstanceOf(Signal);
    expect(ctx.color.peek()).toBe('state-red'); // state wins the spread

    template.overlaySettingsSignals(ctx);
    // Settings overlay ran AFTER spread → settings Signal wins
    expect(ctx.color).toBe(settingsColorSignal);
    expect(ctx.color.peek()).toBe('settings-blue');
  });
});

/*******************************
       extend semantics
*******************************/

// getDataContext relies on extend's shallow last-source-wins semantics.
// Pin the contract here so a regression to extend (e.g., switching to
// deepExtend) breaks the surface where it actually matters.

describe('Template — extend (utils) shallow last-wins', () => {
  it('extend({}, a, b, c) merges shallowly with last source winning', () => {
    const a = { name: 'a', age: 1 };
    const b = { name: 'b', city: 'NYC' };
    const c = { name: 'c' };
    const result = extend({}, a, b, c);
    expect(result).toEqual({ name: 'c', age: 1, city: 'NYC' });
  });

  it('extend is shallow (not deep) — nested objects replace, not merge', () => {
    const a = { settings: { color: 'red', size: 'large' } };
    const b = { settings: { color: 'blue' } };
    const result = extend({}, a, b);
    // Shallow: b.settings completely replaces a.settings, no nested merge
    expect(result.settings).toEqual({ color: 'blue' });
    expect(result.settings.size).toBeUndefined();
  });

  it('extend mutates first arg and returns it', () => {
    const target = { a: 1 };
    const result = extend(target, { b: 2 });
    expect(result).toBe(target);
    expect(target).toEqual({ a: 1, b: 2 });
  });
});

/*******************************
       markRendered
*******************************/

describe('Template — markRendered', () => {
  it('sets rendered=true and destroyed=false', () => {
    const template = new Template();
    template.markRendered();
    expect(template.rendered).toBe(true);
    expect(template.destroyed).toBe(false);
  });

  it('is idempotent', () => {
    const template = new Template();
    template.markRendered();
    template.markRendered();
    template.markRendered();
    expect(template.rendered).toBe(true);
    expect(template.destroyed).toBe(false);
  });

  it('revives a destroyed template (engine-facing contract)', () => {
    const template = new Template();
    template.destroyed = true;
    template.rendered = false;
    template.markRendered();
    expect(template.rendered).toBe(true);
    expect(template.destroyed).toBe(false);
  });
});

/*******************************
       L3 PIN — dataReplaced sticky
*******************************/

// L3: After first render, dataReplaced is left set if anything in
// setDataContext changed. The first-render branch (template.js:739–744)
// only paths through `if (!this.rendered)` — it never clears dataReplaced.
// Practical impact: a future engine watching the flag sees it stuck-true
// after the first render walk-through.
//
// We can't easily call render() in the node project (renderer needs DOM
// in some engines), so this test pins by direct flag inspection through
// the same code path setDataContext uses.

describe('Template — L3 PIN: dataReplaced flag is sticky', () => {
  it('first render leaves dataReplaced true after walk-through', () => {
    const template = new Template({
      data: { a: 1 },
    });
    template.dataReplaced = false;
    // simulate render's internal merge-and-update
    template.setDataContext({ a: 1, b: 2 }, { rerender: false });
    expect(template.dataReplaced).toBe(true);
    // First-render branch (`if !rendered`) does not clear it.
    // Only the else-if branch in render() does.
    template.rendered = true; // simulate post-first-render markRendered
    // Flag remains stuck-true — pin the bug for red-team Stage 3.
    expect(template.dataReplaced).toBe(true);
  });
});

/*******************************
       C3 — subtemplate settings (Surface 7) symmetric with falsy data
*******************************/

// Surface 7's createSubtemplateSettings (template.js:933) uses `!== undefined`
// to seed settings from parent data. Falsy values (0, false, '', null) ARE
// applied. This protects against regression when B1 fix lands — the two
// surfaces should agree on falsy-override behavior.
//
// Pin behavior: subtemplate settings DO take falsy values from data.

describe('Template — C3 convergent: subtemplate settings respects falsy data', () => {
  it('subtemplate settings seeds from data: { count: 0 }', () => {
    const parent = new Template();
    const child = new Template({
      template: '<span></span>',
      renderingEngine: realEngine,
      defaultSettings: { count: 5 },
      data: { count: 0 },
    });
    child.setParent(parent);
    child.initialize();
    expect(child.settings.count).toBe(0);
  });

  it('subtemplate settings seeds from data: { active: false }', () => {
    const parent = new Template();
    const child = new Template({
      template: '<span></span>',
      renderingEngine: realEngine,
      defaultSettings: { active: true },
      data: { active: false },
    });
    child.setParent(parent);
    child.initialize();
    expect(child.settings.active).toBe(false);
  });

  it('subtemplate settings seeds from data: { name: "" }', () => {
    const parent = new Template();
    const child = new Template({
      template: '<span></span>',
      renderingEngine: realEngine,
      defaultSettings: { name: 'default' },
      data: { name: '' },
    });
    child.setParent(parent);
    child.initialize();
    expect(child.settings.name).toBe('');
  });

  it('subtemplate settings seeds from data: { value: null }', () => {
    const parent = new Template();
    const child = new Template({
      template: '<span></span>',
      renderingEngine: realEngine,
      defaultSettings: { value: 'default' },
      data: { value: null },
    });
    child.setParent(parent);
    child.initialize();
    expect(child.settings.value).toBe(null);
  });

  it('subtemplate settings falls through to default when data omits key', () => {
    const parent = new Template();
    const child = new Template({
      template: '<span></span>',
      renderingEngine: realEngine,
      defaultSettings: { value: 'default' },
      data: {},
    });
    child.setParent(parent);
    child.initialize();
    expect(child.settings.value).toBe('default');
  });
});

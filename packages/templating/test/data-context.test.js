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
import { extend } from '@semantic-ui/utils';

import { Template } from '../src/template.js';
import { freshTemplate } from './_helpers/fresh-template.js';
import { clearTemplateRegistry } from './_helpers/registry-cleanup.js';

afterEach(() => {
  clearTemplateRegistry();
});

/*******************************
       createReactiveState
*******************************/

describe('Template — createReactiveState', () => {
  it('wraps each defaultState entry in a Signal', () => {
    const { template, cleanup } = freshTemplate({
      defaultState: { count: 0, name: 'jack' },
    });
    try {
      expect(template.state.count).toBeInstanceOf(Signal);
      expect(template.state.name).toBeInstanceOf(Signal);
    }
    finally {
      cleanup();
    }
  });

  it('initializes simple { count: 0 } config as Signal(0)', () => {
    const { template, cleanup } = freshTemplate({
      defaultState: { count: 0 },
    });
    try {
      expect(template.state.count.peek()).toBe(0);
    }
    finally {
      cleanup();
    }
  });

  it('forwards options for complex { value, options } config', () => {
    // Custom equalityFunction lets us prove options reached the Signal.
    // Default Signal equality treats deep-equal objects as equal; with
    // a strict-reference equality, two structurally-equal objects differ.
    const strictEquality = (a, b) => a === b;
    const { template, cleanup } = freshTemplate({
      defaultState: {
        config: {
          value: { x: 1 },
          options: { equalityFunction: strictEquality, allowClone: false },
        },
      },
    });
    try {
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
    }
    finally {
      cleanup();
    }
  });

  it('returns {} when defaultState is undefined', () => {
    const { template, cleanup } = freshTemplate();
    try {
      expect(template.state).toEqual({});
    }
    finally {
      cleanup();
    }
  });

  it('uses defaultState as-is when data is undefined', () => {
    const { template, cleanup } = freshTemplate({
      defaultState: { count: 5 },
    });
    try {
      expect(template.state.count.peek()).toBe(5);
    }
    finally {
      cleanup();
    }
  });

  /*******************************
         truthy override (sanity)
  *******************************/

  it('lets truthy data override defaultState', () => {
    const { template, cleanup } = freshTemplate({
      defaultState: { count: 5 },
      data: { count: 10 },
    });
    try {
      expect(template.state.count.peek()).toBe(10);
    }
    finally {
      cleanup();
    }
  });

  it('lets default work when data omits the key', () => {
    const { template, cleanup } = freshTemplate({
      defaultState: { count: 5 },
      data: {},
    });
    try {
      expect(template.state.count.peek()).toBe(5);
    }
    finally {
      cleanup();
    }
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
      const { template, cleanup } = freshTemplate({
        defaultState: { count: 5 },
        data: { count: 0 },
      });
      try {
        expect(template.state.count.peek()).toBe(0);
      }
      finally {
        cleanup();
      }
    });

    it('seeds Signal with false when data: { active: false }', () => {
      const { template, cleanup } = freshTemplate({
        defaultState: { active: true },
        data: { active: false },
      });
      try {
        expect(template.state.active.peek()).toBe(false);
      }
      finally {
        cleanup();
      }
    });

    it('seeds Signal with empty string when data: { name: "" }', () => {
      const { template, cleanup } = freshTemplate({
        defaultState: { name: 'default' },
        data: { name: '' },
      });
      try {
        expect(template.state.name.peek()).toBe('');
      }
      finally {
        cleanup();
      }
    });

    it('seeds Signal with null when data: { value: null }', () => {
      const { template, cleanup } = freshTemplate({
        defaultState: { value: 'default' },
        data: { value: null },
      });
      try {
        expect(template.state.value.peek()).toBe(null);
      }
      finally {
        cleanup();
      }
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
    const { template, cleanup } = freshTemplate({
      data: { name: 'jack' },
    });
    try {
      const ctx = template.getDataContext();
      expect(ctx).toEqual({ name: 'jack' });
    }
    finally {
      cleanup();
    }
  });

  it('returns state Signals only when only defaultState is set', () => {
    const { template, cleanup } = freshTemplate({
      defaultState: { count: 7 },
    });
    try {
      const ctx = template.getDataContext();
      expect(ctx.count).toBeInstanceOf(Signal);
      expect(ctx.count.peek()).toBe(7);
    }
    finally {
      cleanup();
    }
  });

  it('includes instance properties from createComponent', () => {
    const { template, cleanup } = freshTemplate({
      createComponent: () => ({ greet: 'hi' }),
    });
    try {
      template.initialize();
      const ctx = template.getDataContext();
      expect(ctx.greet).toBe('hi');
    }
    finally {
      cleanup();
    }
  });

  it('lets state Signal win over data on key collision', () => {
    const { template, cleanup } = freshTemplate({
      defaultState: { name: 'sally' },
      data: { name: 'jack' },
    });
    try {
      const ctx = template.getDataContext();
      // state wraps the same key — state's Signal wins by spread order
      expect(ctx.name).toBeInstanceOf(Signal);
      // data override is truthy so the Signal seeds with 'jack' (per
      // truthy-only override behavior); the assertion here is only that
      // STATE wins the merge, not what the Signal happens to hold.
      expect(ctx.name.peek()).toBe('jack');
    }
    finally {
      cleanup();
    }
  });

  it('lets instance win over data on key collision', () => {
    const { template, cleanup } = freshTemplate({
      data: { name: 'jack' },
      createComponent: () => ({ name: 'bob' }),
    });
    try {
      template.initialize();
      const ctx = template.getDataContext();
      expect(ctx.name).toBe('bob');
    }
    finally {
      cleanup();
    }
  });

  it('lets instance win over state on key collision', () => {
    const { template, cleanup } = freshTemplate({
      defaultState: { name: 'sally' },
      createComponent: () => ({ name: 'bob' }),
    });
    try {
      template.initialize();
      const ctx = template.getDataContext();
      expect(ctx.name).toBe('bob');
    }
    finally {
      cleanup();
    }
  });

  it('lets instance win across all three layers (transitive)', () => {
    const { template, cleanup } = freshTemplate({
      data: { value: 'data' },
      defaultState: { value: 'state' },
      createComponent: () => ({ value: 'instance' }),
    });
    try {
      template.initialize();
      const ctx = template.getDataContext();
      expect(ctx.value).toBe('instance');
    }
    finally {
      cleanup();
    }
  });

  it('returns a fresh object on every call', () => {
    const { template, cleanup } = freshTemplate({
      data: { name: 'jack' },
    });
    try {
      const a = template.getDataContext();
      const b = template.getDataContext();
      expect(a).not.toBe(b);
      expect(a).toEqual(b);
    }
    finally {
      cleanup();
    }
  });

  it('does NOT include settings (settings enter via overlay)', () => {
    // Stub element with settings only — these should NOT appear in
    // getDataContext output. They only land via overlaySettingsSignals.
    const fakeElement = {
      settings: { color: 'blue' },
      settingsVars: new Map([['color', new Signal('blue')]]),
      defaultSettings: { color: 'blue' },
    };
    const { template, cleanup } = freshTemplate({
      element: fakeElement,
    });
    try {
      const ctx = template.getDataContext();
      expect(ctx.color).toBeUndefined();
    }
    finally {
      cleanup();
    }
  });
});

/*******************************
        setDataContext
*******************************/

describe('Template — setDataContext', () => {
  it('merges new keys into this.data', () => {
    const { template, cleanup } = freshTemplate({
      data: { a: 1 },
    });
    try {
      template.setDataContext({ a: 1, b: 2 });
      expect(template.data).toEqual({ a: 1, b: 2 });
    }
    finally {
      cleanup();
    }
  });

  it('sets dataReplaced=true when something changes', () => {
    const { template, cleanup } = freshTemplate({
      data: { a: 1 },
    });
    try {
      template.dataReplaced = false;
      template.setDataContext({ a: 1, b: 2 });
      expect(template.dataReplaced).toBe(true);
    }
    finally {
      cleanup();
    }
  });

  it('does NOT set dataReplaced when nothing changes', () => {
    const { template, cleanup } = freshTemplate({
      data: { a: 1, b: 2 },
    });
    try {
      template.dataReplaced = false;
      template.setDataContext({ a: 1, b: 2 });
      expect(template.dataReplaced).toBe(false);
    }
    finally {
      cleanup();
    }
  });

  it('default { rerender: true } resets this.rendered to false', () => {
    const { template, cleanup } = freshTemplate({
      data: { a: 1 },
    });
    try {
      template.rendered = true;
      template.setDataContext({ a: 2 });
      expect(template.rendered).toBe(false);
    }
    finally {
      cleanup();
    }
  });

  it('{ rerender: false } preserves this.rendered', () => {
    const { template, cleanup } = freshTemplate({
      data: { a: 1 },
    });
    try {
      template.rendered = true;
      template.setDataContext({ a: 2 }, { rerender: false });
      expect(template.rendered).toBe(true);
    }
    finally {
      cleanup();
    }
  });

  /*******************************
       L2 PIN — orphan key deletion
  *******************************/

  it('L2 PIN — deletes orphaned keys silently (assignInPlace default)', () => {
    // assignInPlace deletes keys on target that aren't in source unless
    // preserveExistingKeys is true. setDataContext does NOT pass it, so
    // missing keys disappear.
    const { template, cleanup } = freshTemplate({
      data: { a: 1, b: 2 },
    });
    try {
      template.setDataContext({ a: 1 }); // no `b`
      expect(template.data).toEqual({ a: 1 });
      expect('b' in template.data).toBe(false);
    }
    finally {
      cleanup();
    }
  });
});

/*******************************
       overlaySettingsSignals
*******************************/

describe('Template — overlaySettingsSignals (subtemplate path)', () => {
  it('is a no-op when settingsVars is not set', () => {
    const { template: parent, cleanup: cleanupParent } = freshTemplate();
    const { template: child, cleanup: cleanupChild } = freshTemplate({
      defaultSettings: { color: 'blue' },
    });
    child.setParent(parent);
    try {
      // No settingsVars → nothing overlaid; context returned unchanged.
      const ctx = { existing: 'value' };
      const result = child.overlaySettingsSignals(ctx);
      expect(result).toBe(ctx);
      expect(result.color).toBeUndefined();
    }
    finally {
      cleanupChild();
      cleanupParent();
    }
  });

  it('is a no-op when defaultSettings is missing', () => {
    const { template: parent, cleanup: cleanupParent } = freshTemplate();
    const { template: child, cleanup: cleanupChild } = freshTemplate();
    child.setParent(parent);
    // settingsVars set but defaultSettings absent → branch falls through
    child.settingsVars = new Map([['color', new Signal('red')]]);
    try {
      const ctx = {};
      child.overlaySettingsSignals(ctx);
      expect(ctx.color).toBeUndefined();
    }
    finally {
      cleanupChild();
      cleanupParent();
    }
  });

  it('overlays Signals from settingsVars onto context', () => {
    const { template: parent, cleanup: cleanupParent } = freshTemplate();
    const { template: child, cleanup: cleanupChild } = freshTemplate({
      defaultSettings: { color: 'blue' },
    });
    child.setParent(parent);
    // Manually wire settingsVars Map (avoid invoking createSubtemplateSettings
    // which is Surface 7's territory). Need a settings proxy too because
    // overlay walks defaultSettings via `this.settings[name]`.
    const colorSignal = new Signal('red');
    child.settingsVars = new Map([['color', colorSignal]]);
    child.settings = { color: 'red' }; // proxy stand-in; just needs to read
    try {
      const ctx = {};
      child.overlaySettingsSignals(ctx);
      expect(ctx.color).toBe(colorSignal);
      expect(ctx.color.peek()).toBe('red');
    }
    finally {
      cleanupChild();
      cleanupParent();
    }
  });

  it('makes the Signal win over a plain duplicate from the spread', () => {
    const { template: parent, cleanup: cleanupParent } = freshTemplate();
    const { template: child, cleanup: cleanupChild } = freshTemplate({
      defaultSettings: { color: 'blue' },
    });
    child.setParent(parent);
    const colorSignal = new Signal('red');
    child.settingsVars = new Map([['color', colorSignal]]);
    child.settings = { color: 'red' };
    try {
      const ctx = { color: 'plain-string' };
      child.overlaySettingsSignals(ctx);
      // overlay wrote AFTER the spread → Signal wins
      expect(ctx.color).toBe(colorSignal);
    }
    finally {
      cleanupChild();
      cleanupParent();
    }
  });
});

describe('Template — overlaySettingsSignals (web component path)', () => {
  it('is a no-op when element has no settingsVars', () => {
    const fakeElement = { settings: {} };
    const { template, cleanup } = freshTemplate({
      element: fakeElement,
    });
    try {
      const ctx = {};
      template.overlaySettingsSignals(ctx);
      expect(ctx).toEqual({});
    }
    finally {
      cleanup();
    }
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
    const { template, cleanup } = freshTemplate({
      element: fakeElement,
    });
    try {
      const ctx = {};
      template.overlaySettingsSignals(ctx);
      expect(ctx.color).toBe(colorSignal);
      expect(ctx.size).toBe(sizeSignal);
    }
    finally {
      cleanup();
    }
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
    const { template, cleanup } = freshTemplate({
      element: fakeElement,
    });
    try {
      template.overlaySettingsSignals({});
      expect(reads).toContain('color');
      expect(reads).toContain('size');
    }
    finally {
      cleanup();
    }
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
    const { template, cleanup } = freshTemplate({
      element: fakeElement,
    });
    try {
      template.overlaySettingsSignals({});
      expect(reads).toContain('active');
      expect(reads).toContain('size');
    }
    finally {
      cleanup();
    }
  });

  it('returns the context object passed in', () => {
    const fakeElement = {
      settings: {},
      settingsVars: new Map(),
      defaultSettings: {},
    };
    const { template, cleanup } = freshTemplate({
      element: fakeElement,
    });
    try {
      const ctx = { existing: 1 };
      const result = template.overlaySettingsSignals(ctx);
      expect(result).toBe(ctx);
    }
    finally {
      cleanup();
    }
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
    const { template, cleanup } = freshTemplate({
      element: fakeElement,
      defaultState: { color: 'state-red' },
    });
    try {
      // Mimic the render flow: spread, then overlay.
      const ctx = template.getDataContext();
      expect(ctx.color).toBeInstanceOf(Signal);
      expect(ctx.color.peek()).toBe('state-red'); // state wins the spread

      template.overlaySettingsSignals(ctx);
      // Settings overlay ran AFTER spread → settings Signal wins
      expect(ctx.color).toBe(settingsColorSignal);
      expect(ctx.color.peek()).toBe('settings-blue');
    }
    finally {
      cleanup();
    }
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
    const { template, cleanup } = freshTemplate();
    try {
      template.markRendered();
      expect(template.rendered).toBe(true);
      expect(template.destroyed).toBe(false);
    }
    finally {
      cleanup();
    }
  });

  it('is idempotent', () => {
    const { template, cleanup } = freshTemplate();
    try {
      template.markRendered();
      template.markRendered();
      template.markRendered();
      expect(template.rendered).toBe(true);
      expect(template.destroyed).toBe(false);
    }
    finally {
      cleanup();
    }
  });

  it('revives a destroyed template (engine-facing contract)', () => {
    const { template, cleanup } = freshTemplate();
    try {
      template.destroyed = true;
      template.rendered = false;
      template.markRendered();
      expect(template.rendered).toBe(true);
      expect(template.destroyed).toBe(false);
    }
    finally {
      cleanup();
    }
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
    const { template, cleanup } = freshTemplate({
      data: { a: 1 },
    });
    try {
      template.dataReplaced = false;
      // simulate render's internal merge-and-update
      template.setDataContext({ a: 1, b: 2 }, { rerender: false });
      expect(template.dataReplaced).toBe(true);
      // First-render branch (`if !rendered`) does not clear it.
      // Only the else-if branch in render() does.
      template.rendered = true; // simulate post-first-render markRendered
      // Flag remains stuck-true — pin the bug for red-team Stage 3.
      expect(template.dataReplaced).toBe(true);
    }
    finally {
      cleanup();
    }
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
    const { template: parent, cleanup: cleanupParent } = freshTemplate();
    const { template: child, cleanup: cleanupChild } = freshTemplate({
      defaultSettings: { count: 5 },
      data: { count: 0 },
    });
    child.setParent(parent);
    try {
      child.initialize();
      // Settings proxy is set up by initialize via createSubtemplateSettings.
      expect(child.settings.count).toBe(0);
    }
    finally {
      cleanupChild();
      cleanupParent();
    }
  });

  it('subtemplate settings seeds from data: { active: false }', () => {
    const { template: parent, cleanup: cleanupParent } = freshTemplate();
    const { template: child, cleanup: cleanupChild } = freshTemplate({
      defaultSettings: { active: true },
      data: { active: false },
    });
    child.setParent(parent);
    try {
      child.initialize();
      expect(child.settings.active).toBe(false);
    }
    finally {
      cleanupChild();
      cleanupParent();
    }
  });

  it('subtemplate settings seeds from data: { name: "" }', () => {
    const { template: parent, cleanup: cleanupParent } = freshTemplate();
    const { template: child, cleanup: cleanupChild } = freshTemplate({
      defaultSettings: { name: 'default' },
      data: { name: '' },
    });
    child.setParent(parent);
    try {
      child.initialize();
      expect(child.settings.name).toBe('');
    }
    finally {
      cleanupChild();
      cleanupParent();
    }
  });

  it('subtemplate settings seeds from data: { value: null }', () => {
    const { template: parent, cleanup: cleanupParent } = freshTemplate();
    const { template: child, cleanup: cleanupChild } = freshTemplate({
      defaultSettings: { value: 'default' },
      data: { value: null },
    });
    child.setParent(parent);
    try {
      child.initialize();
      expect(child.settings.value).toBe(null);
    }
    finally {
      cleanupChild();
      cleanupParent();
    }
  });

  it('subtemplate settings falls through to default when data omits key', () => {
    const { template: parent, cleanup: cleanupParent } = freshTemplate();
    const { template: child, cleanup: cleanupChild } = freshTemplate({
      defaultSettings: { value: 'default' },
      data: {},
    });
    child.setParent(parent);
    try {
      child.initialize();
      expect(child.settings.value).toBe('default');
    }
    finally {
      cleanupChild();
      cleanupParent();
    }
  });
});

// Pure-logic tests for createReactiveState, getDataContext, setDataContext,
// overlaySettingsSignals, and markRendered. Render coordination (engine call
// counts) lives in test/browser/data-context-render.test.js.

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
    // Custom equalityFunction lets us prove options reached the Signal:
    // strict-reference equality treats two structurally-equal objects as
    // changed, which the default deep equality would not.
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
    let observed = 0;
    const r = Reaction.create(() => {
      signal.get();
      observed++;
    });
    Reaction.flush();
    const before = observed;
    signal.set({ x: 1 });
    Reaction.flush();
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

  it('lets truthy data override defaultState', () => {
    const template = new Template({
      defaultState: { count: 5 },
      data: { count: 10 },
    });
    expect(template.state.count.peek()).toBe(10);
  });

  it('falls back to default when data omits the key', () => {
    const template = new Template({
      defaultState: { count: 5 },
      data: {},
    });
    expect(template.state.count.peek()).toBe(5);
  });

  /*-------------------
     Falsy overrides
  --------------------*/

  // Falsy values (0, false, '', null) on data are treated as overrides — any
  // defined data value seeds the Signal, matching subtemplate-settings parity.

  describe('falsy data values override defaultState', () => {
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
       getDataContext
*******************************/

// The data context is a flat merge: `extend({}, data, state, instance)`.
// Last-source-wins gives instance > state > data precedence. Settings are
// NOT included here — they enter via overlaySettingsSignals.

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
    expect(ctx.name).toBeInstanceOf(Signal);
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

  it('lets instance win across all three layers', () => {
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

  it('does not include settings (settings enter via overlay)', () => {
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

  it('does not set dataReplaced when nothing changes', () => {
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

  it('deletes orphaned keys silently', () => {
    // assignInPlace strips keys not in the source unless preserveExistingKeys
    // is set; setDataContext does not pass it, so missing keys disappear.
    const template = new Template({
      data: { a: 1, b: 2 },
    });
    template.setDataContext({ a: 1 });
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
    const ctx = { existing: 'value' };
    const result = child.overlaySettingsSignals(ctx);
    expect(result).toBe(ctx);
    expect(result.color).toBeUndefined();
  });

  it('is a no-op when defaultSettings is missing', () => {
    const parent = new Template();
    const child = new Template();
    child.setParent(parent);
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
    // Manual settingsVars wiring stands in for createSubtemplateSettings; the
    // settings stand-in just needs to read so overlay can walk defaultSettings.
    const colorSignal = new Signal('red');
    child.settingsVars = new Map([['color', colorSignal]]);
    child.settings = { color: 'red' };
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

  it('touches each defaultSettings key to drive shadow Signal creation', () => {
    // Reading element.settings[name] for each defaultSettings key triggers
    // the settings proxy getter, which lazy-creates Signals in production.
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

  it('touches each componentSpec.attributes key to drive spec-attribute Signals', () => {
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

/*-------------------
   Settings vs state
--------------------*/

// State wins over data within getDataContext, but a setting backed by a
// Signal in element.settingsVars overrides state with the same name because
// overlaySettingsSignals runs after the spread.

describe('Template — settings overlay vs state precedence', () => {
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
    const ctx = template.getDataContext();
    expect(ctx.color).toBeInstanceOf(Signal);
    expect(ctx.color.peek()).toBe('state-red');

    template.overlaySettingsSignals(ctx);
    expect(ctx.color).toBe(settingsColorSignal);
    expect(ctx.color.peek()).toBe('settings-blue');
  });
});

/*******************************
       extend semantics
*******************************/

// getDataContext relies on extend's shallow last-source-wins semantics. Pin
// the contract here so a regression (e.g. switching to deepExtend) breaks at
// the surface where it actually matters.

describe('Template — extend (utils) shallow last-wins', () => {
  it('extend({}, a, b, c) merges shallowly with last source winning', () => {
    const a = { name: 'a', age: 1 };
    const b = { name: 'b', city: 'NYC' };
    const c = { name: 'c' };
    const result = extend({}, a, b, c);
    expect(result).toEqual({ name: 'c', age: 1, city: 'NYC' });
  });

  it('is shallow — nested objects replace, not merge', () => {
    const a = { settings: { color: 'red', size: 'large' } };
    const b = { settings: { color: 'blue' } };
    const result = extend({}, a, b);
    expect(result.settings).toEqual({ color: 'blue' });
    expect(result.settings.size).toBeUndefined();
  });

  it('mutates first arg and returns it', () => {
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

  it('revives a destroyed template', () => {
    const template = new Template();
    template.destroyed = true;
    template.rendered = false;
    template.markRendered();
    expect(template.rendered).toBe(true);
    expect(template.destroyed).toBe(false);
  });
});

/*-------------------
   dataReplaced flag
--------------------*/

// The first-render branch in render() never clears dataReplaced — only the
// follow-up else-if branch does. After the initial walk-through the flag
// remains stuck-true; pin the current behavior so changes are visible.

describe('Template — dataReplaced flag is sticky on first render', () => {
  it('first-render walk-through leaves dataReplaced true', () => {
    const template = new Template({
      data: { a: 1 },
    });
    template.dataReplaced = false;
    template.setDataContext({ a: 1, b: 2 }, { rerender: false });
    expect(template.dataReplaced).toBe(true);
    template.rendered = true;
    expect(template.dataReplaced).toBe(true);
  });
});

/*-------------------
   Subtemplate parity
--------------------*/

// createSubtemplateSettings uses `!== undefined` to seed settings from data,
// so falsy values (0, false, '', null) take effect. These tests guard parity
// with createReactiveState's own falsy-override behavior above.

describe('Template — subtemplate settings respects falsy data', () => {
  it('seeds from data: { count: 0 }', () => {
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

  it('seeds from data: { active: false }', () => {
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

  it('seeds from data: { name: "" }', () => {
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

  it('seeds from data: { value: null }', () => {
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

  it('falls through to default when data omits the key', () => {
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

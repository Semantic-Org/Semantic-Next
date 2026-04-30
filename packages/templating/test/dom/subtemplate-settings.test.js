import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Reaction, Signal } from '@semantic-ui/reactivity';
import { Template } from '@semantic-ui/templating';
import '@semantic-ui/component'; // registers the native rendering engine

let host;
beforeEach(() => {
  host = document.createElement('div');
  document.body.appendChild(host);
});
afterEach(() => {
  document.body.innerHTML = '';
  Template.renderedTemplates.clear();
});

// Build a parent template attached to `host`. Caller chooses whether to
// initialize() before constructing the child.
function makeParent({ parentSettings, parentElement } = {}) {
  return new Template({
    templateName: 'parent',
    template: '<div></div>',
    element: parentElement || host,
    defaultSettings: parentSettings,
  });
}

// Build a subtemplate child of an existing parent. Element defaults to host
// so the parent fallback path (this.element?.settings) is exercisable by
// stubbing `host.settings` in the test.
function makeChild(parent, { defaultSettings, data, element } = {}) {
  return new Template({
    templateName: 'child',
    template: '<div></div>',
    parentTemplate: parent,
    defaultSettings,
    data,
    element: element || host,
  });
}

describe('Template — subtemplate settings', () => {
  /*******************************
      (A) createSubtemplateSettings — guards
  *******************************/

  describe('createSubtemplateSettings — only fires for subtemplates with non-empty defaultSettings', () => {
    it('non-subtemplate template never gets a settings proxy', () => {
      const tpl = new Template({
        templateName: 'plain',
        template: '<div></div>',
        element: host,
        defaultSettings: { color: 'red' },
      });
      tpl.initialize();
      expect(tpl.settings).toBeUndefined();
      expect(tpl.settingsVars).toBeUndefined();
    });

    it('subtemplate without defaultSettings does not create settings', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent);
      child.initialize();
      expect(child.settings).toBeUndefined();
      expect(child.settingsVars).toBeUndefined();
    });

    it('subtemplate with empty defaultSettings: {} does not create settings', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, { defaultSettings: {} });
      child.initialize();
      expect(child.settings).toBeUndefined();
      expect(child.settingsVars).toBeUndefined();
    });

    it('subtemplate with non-empty defaultSettings creates a settings proxy and settingsVars Map', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, { defaultSettings: { color: 'red' } });
      child.initialize();
      expect(child.settings).toBeDefined();
      expect(typeof child.settings).toBe('object');
      expect(child.settingsVars).toBeInstanceOf(Map);
    });
  });

  /*******************************
      (B) createSubtemplateSettings — initial values
  *******************************/

  describe('createSubtemplateSettings — initial values', () => {
    it('seeds settings from defaultSettings when no data is passed', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, {
        defaultSettings: { color: 'red', size: 10 },
      });
      child.initialize();
      expect(child.settings.color).toBe('red');
      expect(child.settings.size).toBe(10);
    });

    it('passed data overrides defaultSettings for matching keys', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, {
        defaultSettings: { color: 'red' },
        data: { color: 'blue' },
      });
      child.initialize();
      expect(child.settings.color).toBe('blue');
    });

    it('data keys absent from defaultSettings are not pulled into ownSettings', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, {
        defaultSettings: { color: 'red' },
        data: { extra: 'ignored' },
      });
      child.initialize();
      // `extra` is not an own settings key — the get-trap has nothing in
      // target and no parent settings on host either, so it returns undefined.
      expect(child.settings.extra).toBeUndefined();
      expect(child.settings.color).toBe('red');
    });

    it('only data values that are not undefined override defaults (line 933 guard)', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, {
        defaultSettings: { color: 'red' },
        data: { color: undefined },
      });
      child.initialize();
      expect(child.settings.color).toBe('red');
    });
  });

  /*******************************
      (C) createSubtemplateSettings — Proxy get with parent fallback
  *******************************/

  describe('createSubtemplateSettings — parent fallback', () => {
    it('returns own settings when key exists in defaultSettings', () => {
      const parent = makeParent();
      parent.initialize();
      // simulate the parent component exposing settings on the element
      host.settings = { brandColor: 'green' };
      const child = makeChild(parent, {
        defaultSettings: { localColor: 'red' },
      });
      child.initialize();
      expect(child.settings.localColor).toBe('red');
    });

    it('falls back to element.settings for keys not in defaultSettings', () => {
      const parent = makeParent();
      parent.initialize();
      host.settings = { brandColor: 'green' };
      const child = makeChild(parent, {
        defaultSettings: { localColor: 'red' },
      });
      child.initialize();
      // brandColor isn't in defaultSettings → proxy delegates to host.settings
      expect(child.settings.brandColor).toBe('green');
    });

    it('returns undefined when neither own nor element.settings has the key', () => {
      const parent = makeParent();
      parent.initialize();
      // host.settings is undefined — no fallback target available
      const child = makeChild(parent, { defaultSettings: { color: 'red' } });
      child.initialize();
      expect(child.settings.missing).toBeUndefined();
    });
  });

  /*******************************
      (D) createSubtemplateSettings — Signal lazy creation + tracking
  *******************************/

  describe('createSubtemplateSettings — Signal lazy creation', () => {
    it('starts with an empty settingsVars Map (no signals until first read)', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, {
        defaultSettings: { color: 'red', size: 10 },
      });
      child.initialize();
      // The renderer construction (initialize → overlaySettingsSignals) reads
      // every defaultSettings key, so signals are eagerly created during init.
      // Build a *fresh* child without going through initialize to observe the
      // pre-read state.
      const child2 = makeChild(parent, {
        defaultSettings: { color: 'red', size: 10 },
      });
      child2.createSubtemplateSettings();
      expect(child2.settingsVars.size).toBe(0);
    });

    it('creates a Signal in settingsVars on first proxy read', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, { defaultSettings: { color: 'red' } });
      child.createSubtemplateSettings();

      expect(child.settingsVars.has('color')).toBe(false);
      // trigger lazy signal creation
      void child.settings.color;
      expect(child.settingsVars.has('color')).toBe(true);
      expect(child.settingsVars.get('color')).toBeInstanceOf(Signal);
      expect(child.settingsVars.get('color').get()).toBe('red');
    });

    it('reads inside a Reaction track the signal — external signal mutation re-runs the reaction', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, { defaultSettings: { color: 'red' } });
      child.createSubtemplateSettings();

      let runs = 0;
      let observed;
      const reaction = Reaction.create(() => {
        runs++;
        observed = child.settings.color;
      });
      expect(runs).toBe(1);
      expect(observed).toBe('red');

      // Mutate the signal itself — should re-run the reaction.
      child.settingsVars.get('color').set('blue');
      Reaction.flush();
      expect(runs).toBe(2);

      reaction.stop();
    });
  });

  /*******************************
      (E) createSubtemplateSettings — Proxy set
  *******************************/

  describe('createSubtemplateSettings — Proxy set', () => {
    it('updating an existing key reflects on subsequent reads', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, { defaultSettings: { color: 'red' } });
      child.createSubtemplateSettings();

      child.settings.color = 'blue';
      expect(child.settings.color).toBe('blue');
    });

    it('updating an existing key updates the underlying signal', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, { defaultSettings: { color: 'red' } });
      child.createSubtemplateSettings();

      // prime the signal via a read
      void child.settings.color;
      const sig = child.settingsVars.get('color');
      child.settings.color = 'blue';
      expect(sig.get()).toBe('blue');
      // same Signal reference is reused — set takes the existing-signal path.
      expect(child.settingsVars.get('color')).toBe(sig);
    });

    it('setting a brand new key (not previously read) creates a Signal', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, { defaultSettings: { color: 'red' } });
      child.createSubtemplateSettings();

      expect(child.settingsVars.has('newKey')).toBe(false);
      child.settings.newKey = 'x';
      expect(child.settingsVars.has('newKey')).toBe(true);
      expect(child.settingsVars.get('newKey')).toBeInstanceOf(Signal);
      expect(child.settingsVars.get('newKey').get()).toBe('x');
      // and the proxy now reads it through own-target (since it was set into target)
      expect(child.settings.newKey).toBe('x');
    });

    it('writes propagate to a tracking Reaction via the proxy', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, { defaultSettings: { color: 'red' } });
      child.createSubtemplateSettings();

      let observed;
      let runs = 0;
      const reaction = Reaction.create(() => {
        runs++;
        observed = child.settings.color;
      });
      expect(runs).toBe(1);
      expect(observed).toBe('red');

      child.settings.color = 'blue';
      Reaction.flush();
      expect(runs).toBe(2);
      expect(observed).toBe('blue');

      reaction.stop();
    });
  });

  /*******************************
      (F) createSubtemplateSettings — symbol pass-through
  *******************************/

  describe('createSubtemplateSettings — symbol pass-through', () => {
    it('symbol property reads bypass the parent fallback path', () => {
      const parent = makeParent();
      parent.initialize();
      // host.settings has a value for the symbol — but the proxy must NOT
      // consult the parent for symbol props (line 940-942 returns target[sym]).
      const sym = Symbol.for('subtemplate-settings-test');
      host.settings = { [sym]: 'from-parent' };
      const child = makeChild(parent, { defaultSettings: { color: 'red' } });
      child.createSubtemplateSettings();
      // target was seeded with defaults — the symbol key isn't on it, so we
      // get undefined (NOT 'from-parent') because the symbol branch returns
      // target[symbol] directly.
      expect(child.settings[sym]).toBeUndefined();
    });
  });

  /*******************************
      (G) createSubtemplateSettings — allowClone: false
  *******************************/

  describe('createSubtemplateSettings — allowClone: false', () => {
    it('object values are stored by reference (no clone) on signal mutation', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, { defaultSettings: { color: 'red' } });
      child.createSubtemplateSettings();

      const obj = { x: 1 };
      child.settings.foo = obj;
      // mutate the object after assigning — reference equality should hold
      obj.x = 2;
      expect(child.settings.foo).toBe(obj);
      expect(child.settings.foo.x).toBe(2);
    });

    it('initial-default object values keep referential identity through the signal', () => {
      const parent = makeParent();
      parent.initialize();
      const seed = { nested: 1 };
      const child = makeChild(parent, {
        defaultSettings: { config: seed },
      });
      child.createSubtemplateSettings();

      // first read creates the Signal with allowClone:false → same reference
      expect(child.settings.config).toBe(seed);
    });
  });

  /*******************************
      (H) updateSubtemplateSettings
  *******************************/

  describe('updateSubtemplateSettings', () => {
    it('updates an existing settings key when present in dataContext', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, { defaultSettings: { color: 'red' } });
      child.initialize();

      child.updateSubtemplateSettings({ color: 'newvalue' });
      expect(child.settings.color).toBe('newvalue');
    });

    it('only iterates defaultSettings — extra dataContext keys are ignored', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, { defaultSettings: { color: 'red' } });
      child.initialize();

      child.updateSubtemplateSettings({ color: 'blue', extra: 'ignored' });
      expect(child.settings.color).toBe('blue');
      // extra was not in defaultSettings — must NOT be set on the target.
      expect(child.settingsVars.has('extra')).toBe(false);
    });

    it('does nothing when dataContext is missing the defaultSettings key', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, { defaultSettings: { color: 'red' } });
      child.initialize();

      child.updateSubtemplateSettings({ unrelated: 1 });
      expect(child.settings.color).toBe('red');
    });

    it('is a no-op when settings is undefined (line 974 guard)', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent); // no defaultSettings
      child.initialize();
      expect(child.settings).toBeUndefined();
      expect(() => child.updateSubtemplateSettings({ x: 1 })).not.toThrow();
    });

    it('is a no-op when defaultSettings is undefined', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent);
      // hand-craft an artificial settings object but no defaultSettings —
      // the guard short-circuits on either branch.
      child.settings = { color: 'red' };
      child.defaultSettings = undefined;
      expect(() => child.updateSubtemplateSettings({ color: 'blue' })).not.toThrow();
      expect(child.settings.color).toBe('red');
    });

    it('triggers reactivity on tracked reads after update', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, { defaultSettings: { color: 'red' } });
      child.initialize();

      let observed;
      let runs = 0;
      const reaction = Reaction.create(() => {
        runs++;
        observed = child.settings.color;
      });
      expect(runs).toBe(1);
      expect(observed).toBe('red');

      child.updateSubtemplateSettings({ color: 'blue' });
      Reaction.flush();
      expect(runs).toBe(2);
      expect(observed).toBe('blue');

      reaction.stop();
    });
  });

  /*******************************
      (I) overlaySettingsSignals — subtemplate path
  *******************************/

  describe('overlaySettingsSignals — subtemplate path', () => {
    it('overlays each settings signal onto the context object by name', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, {
        defaultSettings: { color: 'red', size: 10 },
      });
      child.createSubtemplateSettings();

      const ctx = { existing: 1 };
      const result = child.overlaySettingsSignals(ctx);
      expect(result).toBe(ctx);
      expect(ctx.existing).toBe(1);
      // overlay attaches the Signal itself (not the value) at line 336
      expect(ctx.color).toBeInstanceOf(Signal);
      expect(ctx.color.get()).toBe('red');
      expect(ctx.size).toBeInstanceOf(Signal);
      expect(ctx.size.get()).toBe(10);
    });

    it('ensures shadow signal exists for every defaultSettings key (touches proxy)', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent, {
        defaultSettings: { a: 1, b: 2 },
      });
      child.createSubtemplateSettings();

      // before overlay — no signals created
      expect(child.settingsVars.size).toBe(0);
      child.overlaySettingsSignals({});
      expect(child.settingsVars.has('a')).toBe(true);
      expect(child.settingsVars.has('b')).toBe(true);
    });

    it('returns context unchanged when subtemplate has no settingsVars', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent); // no defaultSettings → no settingsVars
      // do not call initialize — just verify the early return
      const ctx = { foo: 1 };
      const result = child.overlaySettingsSignals(ctx);
      expect(result).toBe(ctx);
      expect(Object.keys(ctx)).toEqual(['foo']);
    });

    it('returns context unchanged when subtemplate has settingsVars but no defaultSettings', () => {
      const parent = makeParent();
      parent.initialize();
      const child = makeChild(parent);
      // simulate a partial state — settingsVars present but defaultSettings absent
      child.settingsVars = new Map([['leftover', new Signal(1)]]);
      const ctx = {};
      child.overlaySettingsSignals(ctx);
      // line 331 requires BOTH settingsVars AND defaultSettings → early return
      expect(ctx.leftover).toBeUndefined();
    });
  });

  /*******************************
      (J) overlaySettingsSignals — web component path
  *******************************/

  describe('overlaySettingsSignals — web component path', () => {
    it('reads element.settings for every defaultSettings key and componentSpec.attribute', () => {
      const tpl = new Template({
        templateName: 'wc',
        template: '<div></div>',
        element: host,
      });
      // do NOT initialize — we attach the element-side fixtures by hand
      // and exercise the method directly.
      const seen = [];
      const settingsVars = new Map();
      host.settingsVars = settingsVars;
      host.defaultSettings = { color: 'red' };
      host.componentSpec = { attributes: ['size'] };
      host.settings = new Proxy({ color: 'red', size: 'small' }, {
        get(target, prop) {
          seen.push(prop);
          return target[prop];
        },
      });

      tpl.overlaySettingsSignals({});
      expect(seen).toContain('color'); // from defaultSettings loop
      expect(seen).toContain('size'); // from componentSpec.attributes loop
    });

    it('overlays settingsVars Signals onto the context', () => {
      const tpl = new Template({
        templateName: 'wc',
        template: '<div></div>',
        element: host,
      });
      const colorSignal = new Signal('red');
      host.settingsVars = new Map([['color', colorSignal]]);
      host.defaultSettings = { color: 'red' };
      host.settings = new Proxy({ color: 'red' }, { get: (t, p) => t[p] });

      const ctx = {};
      tpl.overlaySettingsSignals(ctx);
      expect(ctx.color).toBe(colorSignal);
    });

    it('skips defaultSettings loop when defaultSettings is absent on element', () => {
      const tpl = new Template({
        templateName: 'wc',
        template: '<div></div>',
        element: host,
      });
      host.settingsVars = new Map([['x', new Signal(1)]]);
      // no host.defaultSettings, no host.componentSpec, no host.settings
      const ctx = {};
      expect(() => tpl.overlaySettingsSignals(ctx)).not.toThrow();
      // settingsVars still overlaid
      expect(ctx.x).toBeInstanceOf(Signal);
    });

    it('skips attribute loop when componentSpec.attributes is absent', () => {
      const tpl = new Template({
        templateName: 'wc',
        template: '<div></div>',
        element: host,
      });
      const seen = [];
      host.settingsVars = new Map();
      host.defaultSettings = { color: 'red' };
      host.settings = new Proxy({ color: 'red' }, {
        get(t, p) {
          seen.push(p);
          return t[p];
        },
      });
      // no componentSpec — only defaultSettings keys are read
      tpl.overlaySettingsSignals({});
      expect(seen).toEqual(['color']);
    });
  });

  /*******************************
      (K) overlaySettingsSignals — no element / no settingsVars
  *******************************/

  describe('overlaySettingsSignals — no element', () => {
    it('returns context unchanged when element is undefined', () => {
      const tpl = new Template({
        templateName: 'no-el',
        template: '<div></div>',
      });
      // tpl.element is undefined; not a subtemplate → web component branch
      const ctx = { foo: 1 };
      let result;
      expect(() => {
        result = tpl.overlaySettingsSignals(ctx);
      }).not.toThrow();
      expect(result).toBe(ctx);
      expect(Object.keys(ctx)).toEqual(['foo']);
    });

    it('returns context unchanged when element has no settingsVars', () => {
      const tpl = new Template({
        templateName: 'no-vars',
        template: '<div></div>',
        element: host,
      });
      // host has no settingsVars → line 347 guard short-circuits
      const ctx = { foo: 1 };
      const result = tpl.overlaySettingsSignals(ctx);
      expect(result).toBe(ctx);
      expect(Object.keys(ctx)).toEqual(['foo']);
    });
  });
});

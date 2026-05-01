// Surface 7 — Subtemplate settings, parent/child wiring, clone semantics.
//
// Coverage targets:
//   - isSubtemplate() truth conditions and B6 Option B contract (sole-authority setParent)
//   - setParent idempotency + re-parenting + removeParent symmetry
//   - Tier 1 (no defaultSettings — dominant path) vs Tier 2 (with defaultSettings)
//   - Subtemplate settings Proxy: get/set, parent-element fallback, Signal creation
//   - updateSubtemplateSettings keyed propagation (declared keys only)
//   - clone() prototype-to-instance manifestation: copies, overrides, shared refs
//   - Settings reactivity through Reaction + Proxy
//   - C3 — falsy data preservation (`!== undefined`, not truthy check)
//
// B6 contract: tests pinned to Option B (sole-authority setParent). Tests
// flagged "B6 PIN" CURRENTLY FAIL against unfixed source — they describe the
// post-fix behavior the user has locked. See ai/workspace/template-coverage/
// stage-1-5-batch.md §B6 for the full decision record.

import { Reaction, Signal } from '@semantic-ui/reactivity';
import { Renderer, ServerRenderer } from '@semantic-ui/renderer';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Template } from '@semantic-ui/templating';

const realEngine = { renderer: Renderer, serverRenderer: ServerRenderer };

afterEach(() => {
  Template.renderedTemplates.clear();
  Template.templateCount = 0;
});

// Local helper — stamps out a parent + child pair with the options needed to
// drive initialize() through the real renderer. Mirrors the canonical
// production wiring without depending on a shared `_helpers/` directory.
function makeSubtemplatePair({
  childDefaultSettings,
  childData,
  childElement,
  parentElement,
} = {}) {
  const parent = new Template(parentElement ? { element: parentElement } : {});
  const child = new Template({
    template: '<span></span>',
    renderingEngine: realEngine,
    defaultSettings: childDefaultSettings,
    data: childData,
    element: childElement,
  });
  child.setParent(parent);
  return { parent, child };
}

/*******************************
        isSubtemplate()
*******************************/

describe('Template.isSubtemplate()', () => {
  it('returns false for a freshly constructed Template with no parent', () => {
    const template = new Template();
    expect(template.isSubtemplate()).toBe(false);
    expect(template.parentTemplate).toBeUndefined();
  });

  it('[B6 PIN — behavioral change] returns false for a Template constructed with parentTemplate but no setParent call', () => {
    // Option B: setParent is the sole authority for parent wiring.
    // Constructor stops setting this.parentTemplate. CURRENTLY FAILS.
    const parent = new Template();
    const child = new Template({
      template: '<span></span>',
      renderingEngine: realEngine,
      parentTemplate: parent,
    });
    expect(child.parentTemplate).toBeUndefined();
    expect(child.isSubtemplate()).toBe(false);
  });

  it('returns true after setParent() is called', () => {
    const parent = new Template();
    const child = new Template();
    child.setParent(parent);
    expect(child.isSubtemplate()).toBe(true);
    expect(child.parentTemplate).toBe(parent);
  });

  it('[B6 PIN] returns false after removeParent() — parentTemplate is cleared', () => {
    // Option B: removeParent must clear this.parentTemplate. CURRENTLY FAILS
    // (today the assignment is missing; isSubtemplate() still returns true).
    const parent = new Template();
    const child = new Template();
    child.setParent(parent);
    expect(child.isSubtemplate()).toBe(true);

    child.removeParent();
    expect(child.parentTemplate).toBeUndefined();
    expect(child.isSubtemplate()).toBe(false);
  });
});

/*******************************
        setParent / removeParent (B6)
*******************************/

describe('Template.setParent — wiring + idempotency (B6 contract)', () => {
  it('adds the child to parent._childTemplates', () => {
    const parent = new Template();
    const child = new Template();
    child.setParent(parent);
    expect(parent._childTemplates).toContain(child);
  });

  it('lazily initializes parent._childTemplates on first call', () => {
    const parent = new Template();
    const child = new Template();
    expect(parent._childTemplates).toBeUndefined();
    child.setParent(parent);
    expect(Array.isArray(parent._childTemplates)).toBe(true);
    expect(parent._childTemplates).toHaveLength(1);
  });

  it('preserves existing siblings when adding a new child', () => {
    const parent = new Template();
    const childA = new Template();
    const childB = new Template();
    childA.setParent(parent);
    childB.setParent(parent);
    expect(parent._childTemplates).toHaveLength(2);
    expect(parent._childTemplates).toContain(childA);
    expect(parent._childTemplates).toContain(childB);
  });

  it('[B6 PIN] is idempotent when setParent(X) is called twice with the same parent', () => {
    // Option B: O(1) idempotency check. CURRENTLY FAILS — child is pushed twice.
    const parent = new Template();
    const child = new Template();
    child.setParent(parent);
    child.setParent(parent);
    const occurrences = parent._childTemplates.filter(t => t === child).length;
    expect(occurrences).toBe(1);
  });

  it('[B6 PIN] re-parents cleanly: setParent(X) then setParent(Y) leaves child only in Y', () => {
    // Option B: setParent detaches from prior parent first. CURRENTLY FAILS —
    // child is in BOTH X._childTemplates and Y._childTemplates today.
    const parentX = new Template();
    const parentY = new Template();
    const child = new Template();
    child.setParent(parentX);
    child.setParent(parentY);

    expect(parentX._childTemplates).not.toContain(child);
    expect(parentY._childTemplates).toContain(child);
    expect(parentY._childTemplates.filter(t => t === child)).toHaveLength(1);
    expect(child.parentTemplate).toBe(parentY);
  });

  it('restores wiring cleanly across setParent → removeParent → setParent(same)', () => {
    const parent = new Template();
    const child = new Template();
    child.setParent(parent);
    child.removeParent();
    child.setParent(parent);

    expect(child.parentTemplate).toBe(parent);
    expect(parent._childTemplates).toContain(child);
    expect(parent._childTemplates.filter(t => t === child)).toHaveLength(1);
  });
});

describe('Template.removeParent — destroy-time tear-down', () => {
  it('removes only the matching child by id, leaving siblings in place', () => {
    const parent = new Template();
    const childA = new Template();
    const childB = new Template();
    childA.setParent(parent);
    childB.setParent(parent);
    childA.removeParent();

    expect(parent._childTemplates).not.toContain(childA);
    expect(parent._childTemplates).toContain(childB);
    expect(parent._childTemplates).toHaveLength(1);
  });

  it('is a no-op when parent has no _childTemplates yet', () => {
    const parent = new Template();
    const child = new Template();
    // manually wire parentTemplate without going through setParent —
    // simulates a partial-state code path. removeParent should not throw.
    child.parentTemplate = parent;
    expect(() => child.removeParent()).not.toThrow();
  });
});

/*******************************
   Tier 1 — Naive subtemplate (no defaultSettings)
*******************************/

describe('Subtemplate Tier 1 — no defaultSettings (the dominant path)', () => {
  it('does NOT create a settings Proxy when defaultSettings is undefined', () => {
    const { child } = makeSubtemplatePair({
      childData: { name: 'A' },
    });
    child.initialize();
    // gate at line 188-190 short-circuits — settings is never assigned
    expect(child.settings).toBeUndefined();
    expect(child.settingsVars).toBeUndefined();
  });

  it('does NOT create a settings Proxy when defaultSettings is an empty object', () => {
    const { child } = makeSubtemplatePair({
      childDefaultSettings: {},
      childData: { foo: 'bar' },
    });
    child.initialize();
    expect(child.settings).toBeUndefined();
  });

  it('does NOT create a settings Proxy on a non-subtemplate even with defaultSettings', () => {
    // Gate is conjunctive: isSubtemplate() AND defaultSettings AND length > 0.
    const template = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      defaultSettings: { foo: 'bar' },
    });
    template.initialize();
    expect(template.settings).toBeUndefined();
  });

  it('exposes data passed at construction in the renderer data context', () => {
    const { child } = makeSubtemplatePair({
      childData: { name: 'Alice' },
    });
    child.initialize();
    const ctx = child.getDataContext();
    expect(ctx.name).toBe('Alice');
  });

  it('makes updateSubtemplateSettings a no-op when the Proxy was never created', () => {
    const { child } = makeSubtemplatePair({
      childData: { foo: 1 },
    });
    child.initialize();
    // exercises the !this.settings || !this.defaultSettings short-circuit
    expect(() => child.updateSubtemplateSettings({ foo: 2 })).not.toThrow();
    expect(child.settings).toBeUndefined();
  });
});

/*******************************
  Tier 2 — Subtemplate with defaultSettings
*******************************/

describe('Subtemplate Tier 2 — defaultSettings creates a Proxy', () => {
  it('creates this.settings as a Proxy when subtemplate declares defaultSettings', () => {
    const { child } = makeSubtemplatePair({
      childDefaultSettings: { theme: 'light' },
    });
    child.initialize();
    expect(child.settings).toBeDefined();
    expect(child.settingsVars).toBeInstanceOf(Map);
  });

  it('seeds the Proxy with values from defaultSettings', () => {
    const { child } = makeSubtemplatePair({
      childDefaultSettings: { theme: 'light', size: 'md' },
    });
    child.initialize();
    expect(child.settings.theme).toBe('light');
    expect(child.settings.size).toBe('md');
  });

  it('overrides defaults with passed-in data for keys present in defaultSettings', () => {
    // precedence: defaultSettings < clone-time data
    const { child } = makeSubtemplatePair({
      childDefaultSettings: { theme: 'light' },
      childData: { theme: 'dark' },
    });
    child.initialize();
    expect(child.settings.theme).toBe('dark');
  });

  it('[C3] preserves falsy data values (uses !== undefined, not truthy check)', () => {
    // Subtemplate settings already uses !== undefined correctly. Surface 6's
    // B1 fix targets createReactiveState (truthy bug). Pin that THIS path
    // stays correct.
    const { child } = makeSubtemplatePair({
      childDefaultSettings: { count: 5 },
      childData: { count: 0 },
    });
    child.initialize();
    expect(child.settings.count).toBe(0);
  });

  it('[C3] preserves null and false in passed data', () => {
    const { child } = makeSubtemplatePair({
      childDefaultSettings: { active: true, label: 'default' },
      childData: { active: false, label: null },
    });
    child.initialize();
    expect(child.settings.active).toBe(false);
    expect(child.settings.label).toBeNull();
  });

  it('writes through the Proxy persist on the target object', () => {
    const { child } = makeSubtemplatePair({
      childDefaultSettings: { theme: 'light' },
    });
    child.initialize();
    child.settings.theme = 'dark';
    expect(child.settings.theme).toBe('dark');
  });

  it('creates a Signal in settingsVars on first read', () => {
    // Use createSubtemplateSettings directly to observe the lazy-create path.
    // (initialize() walks all defaultSettings keys via overlaySettingsSignals
    // before tests can observe the pre-read state.)
    const { child } = makeSubtemplatePair({
      childDefaultSettings: { theme: 'light' },
    });
    child.createSubtemplateSettings();
    expect(child.settingsVars.has('theme')).toBe(false);
    child.settings.theme; // touch
    expect(child.settingsVars.has('theme')).toBe(true);
    expect(child.settingsVars.get('theme')).toBeInstanceOf(Signal);
  });

  it('after initialize(), all defaultSettings keys have backing Signals (overlaySettingsSignals primes them)', () => {
    // initialize() invokes overlaySettingsSignals which iterates defaultSettings
    // and reads each key through the Proxy to ensure each Signal exists.
    const { child } = makeSubtemplatePair({
      childDefaultSettings: { theme: 'light', size: 'md' },
    });
    child.initialize();
    expect(child.settingsVars.has('theme')).toBe(true);
    expect(child.settingsVars.has('size')).toBe(true);
  });

  it('reuses the existing Signal on subsequent reads of the same key', () => {
    const { child } = makeSubtemplatePair({
      childDefaultSettings: { theme: 'light' },
    });
    child.initialize();
    child.settings.theme;
    const firstSignal = child.settingsVars.get('theme');
    child.settings.theme;
    expect(child.settingsVars.get('theme')).toBe(firstSignal);
  });

  it('creates a Signal on first write to a key never read before', () => {
    // Use the Proxy directly without initialize() so the
    // overlaySettingsSignals priming doesn't pre-create the signal.
    const { child } = makeSubtemplatePair({
      childDefaultSettings: { theme: 'light' },
    });
    child.createSubtemplateSettings();
    expect(child.settingsVars.has('theme')).toBe(false);
    child.settings.theme = 'dark';
    expect(child.settingsVars.has('theme')).toBe(true);
    expect(child.settingsVars.get('theme')).toBeInstanceOf(Signal);
  });

  it('first write to an UNDECLARED key creates a Signal as well (set handler is unconditional)', () => {
    // Pin the contract that writing arbitrary keys via the Proxy succeeds —
    // not just keys in defaultSettings.
    const { child } = makeSubtemplatePair({
      childDefaultSettings: { theme: 'light' },
    });
    child.createSubtemplateSettings();
    child.settings.brandNew = 'value';
    expect(child.settingsVars.has('brandNew')).toBe(true);
  });

  it('updates the existing Signal on writes to a key already read', () => {
    const { child } = makeSubtemplatePair({
      childDefaultSettings: { theme: 'light' },
    });
    child.initialize();
    child.settings.theme; // create signal
    const sig = child.settingsVars.get('theme');
    child.settings.theme = 'dark';
    expect(child.settingsVars.get('theme')).toBe(sig);
  });

  it('returns symbol-keyed properties without touching settingsVars', () => {
    const { child } = makeSubtemplatePair({
      childDefaultSettings: { theme: 'light' },
    });
    child.initialize();
    // Symbol access goes straight to target[symbol]; no Signal map activity.
    const sym = Symbol.iterator;
    const before = child.settingsVars.size;
    child.settings[sym];
    expect(child.settingsVars.size).toBe(before);
  });
});

/*******************************
   Parent fallback — element.settings
*******************************/

describe('Subtemplate settings — parent element.settings fallback', () => {
  // Production wiring: renderer calls instance.setElement(parent.element)
  // BEFORE initialize(). So this.element points at the parent's element,
  // and the Proxy captures parentSettings from this.element?.settings.

  function makeFallbackFixture({ childDefaultSettings, parentSettings, childData = {} }) {
    const fakeElement = { settings: { ...parentSettings } };
    return {
      ...makeSubtemplatePair({
        childDefaultSettings,
        childData,
        childElement: fakeElement, // mirrors renderer's setElement(parent.element)
        parentElement: fakeElement,
      }),
      fakeElement,
    };
  }

  it('returns own setting when key IS in defaultSettings', () => {
    const f = makeFallbackFixture({
      childDefaultSettings: { ownProp: 'X' },
      parentSettings: { otherProp: 'Y' },
    });
    f.child.initialize();
    expect(f.child.settings.ownProp).toBe('X');
  });

  it('falls back to parent element.settings when key is NOT in own target', () => {
    const f = makeFallbackFixture({
      childDefaultSettings: { ownProp: 'X' },
      parentSettings: { otherProp: 'Y' },
    });
    f.child.initialize();
    expect(f.child.settings.otherProp).toBe('Y');
  });

  it('returns undefined when key is in neither own nor parent settings', () => {
    const f = makeFallbackFixture({
      childDefaultSettings: { ownProp: 'X' },
      parentSettings: { otherProp: 'Y' },
    });
    f.child.initialize();
    expect(f.child.settings.notInEither).toBeUndefined();
  });

  it('shadows the parent fallback once an unrelated key is written via the Proxy', () => {
    // Once `brand` is written through the Proxy, it lives in `target` and
    // own-key precedence wins — the parent fallback is no longer consulted.
    const f = makeFallbackFixture({
      childDefaultSettings: { ownProp: 'X' },
      parentSettings: { brand: 'parent-brand' },
    });
    f.child.initialize();
    expect(f.child.settings.brand).toBe('parent-brand'); // fallback
    f.child.settings.brand = 'shadowed';
    expect(f.child.settings.brand).toBe('shadowed'); // own-target now wins
    // Parent's settings object is untouched
    expect(f.fakeElement.settings.brand).toBe('parent-brand');
  });

  it('returns undefined safely when child has no element at all', () => {
    // No element → parentSettings captured as undefined → fallback path
    // short-circuits. Pin: no throw on missing keys.
    const { child } = makeSubtemplatePair({
      childDefaultSettings: { ownProp: 'X' },
    });
    child.initialize();
    expect(child.settings.ownProp).toBe('X');
    expect(child.settings.missingKey).toBeUndefined();
  });
});

/*******************************
        Settings reactivity
*******************************/

describe('Subtemplate settings reactivity', () => {
  it('re-runs a Reaction that reads through the Proxy when the same key is written', () => {
    const { child } = makeSubtemplatePair({
      childDefaultSettings: { theme: 'light' },
    });
    let runs = 0;
    let observed;
    let reaction;
    try {
      child.initialize();
      reaction = Reaction.create(() => {
        runs++;
        observed = child.settings.theme;
      });
      expect(runs).toBe(1);
      expect(observed).toBe('light');

      child.settings.theme = 'dark';
      Reaction.flush();

      expect(runs).toBe(2);
      expect(observed).toBe('dark');
    }
    finally {
      reaction?.stop();
    }
  });

  it('re-runs the Reaction when updateSubtemplateSettings writes a declared key', () => {
    const { child } = makeSubtemplatePair({
      childDefaultSettings: { theme: 'light' },
    });
    let runs = 0;
    let reaction;
    try {
      child.initialize();
      reaction = Reaction.create(() => {
        runs++;
        child.settings.theme;
      });
      expect(runs).toBe(1);

      child.updateSubtemplateSettings({ theme: 'dark' });
      Reaction.flush();
      expect(runs).toBe(2);
    }
    finally {
      reaction?.stop();
    }
  });

  it('does NOT trigger reactivity when the underlying object is mutated without a Proxy set', () => {
    // Design pin — not a bug. Consumers must REPLACE values via Proxy set,
    // not mutate the stored object in place. allowClone:false stores by
    // reference; the Signal's deep-equality on set() also means a structurally
    // identical replacement after a mutation is a no-op. The contract is:
    // read through the Proxy, REPLACE the value with a structurally distinct
    // object — not mutate-then-set-same-shape.
    const { child } = makeSubtemplatePair({
      childDefaultSettings: { todo: { completed: false } },
    });
    let runs = 0;
    let reaction;
    try {
      child.initialize();
      reaction = Reaction.create(() => {
        runs++;
        // Read through Proxy registers dependency on settingsVars.get('todo')
        const todo = child.settings.todo;
        // Touch a property to make the read meaningful (no-op for tracking).
        void todo?.completed;
      });
      expect(runs).toBe(1);

      // Direct mutation of the stored object — no Proxy `set` invoked.
      child.settings.todo.completed = true;
      Reaction.flush();
      expect(runs).toBe(1); // NOT re-run

      // Replacement with a DIFFERENT shape triggers reactivity (Signal's
      // equality check sees a structural change and notifies).
      child.settings.todo = { completed: true, label: 'new' };
      Reaction.flush();
      expect(runs).toBe(2);
    }
    finally {
      reaction?.stop();
    }
  });
});

/*******************************
      updateSubtemplateSettings
*******************************/

describe('Template.updateSubtemplateSettings', () => {
  it('writes only keys declared in defaultSettings, ignoring extras', () => {
    const { child } = makeSubtemplatePair({
      childDefaultSettings: { declared: 'init' },
    });
    child.initialize();
    child.updateSubtemplateSettings({ declared: 'updated', undeclared: 'ignored' });
    expect(child.settings.declared).toBe('updated');
    // 'undeclared' is NOT pushed through the Proxy — it's not in
    // defaultSettings, so the `each(this.defaultSettings)` loop skips it.
    // settingsVars must not contain it either.
    expect(child.settingsVars.has('undeclared')).toBe(false);
  });

  it('writes the new value through the Proxy set, firing the underlying Signal', () => {
    const { child } = makeSubtemplatePair({
      childDefaultSettings: { theme: 'light' },
    });
    child.initialize();
    child.settings.theme; // create signal
    const sig = child.settingsVars.get('theme');
    const setSpy = vi.spyOn(sig, 'set');

    child.updateSubtemplateSettings({ theme: 'dark' });
    expect(setSpy).toHaveBeenCalledWith('dark');
  });

  it('is a no-op when defaultSettings is undefined (Tier 1)', () => {
    const { child } = makeSubtemplatePair({
      childData: { foo: 1 },
    });
    child.initialize();
    child.updateSubtemplateSettings({ foo: 2 });
    // No Proxy was created and none should be created retroactively.
    expect(child.settings).toBeUndefined();
    expect(child.settingsVars).toBeUndefined();
  });

  it('skips keys that are present in defaultSettings but absent from dataContext', () => {
    const { child } = makeSubtemplatePair({
      childDefaultSettings: { theme: 'light', size: 'md' },
    });
    child.initialize();
    // Only `theme` provided; `size` should be untouched.
    child.updateSubtemplateSettings({ theme: 'dark' });
    expect(child.settings.theme).toBe('dark');
    expect(child.settings.size).toBe('md');
  });
});

/*******************************
    clone() — prototype-to-instance
*******************************/

describe('Template.clone — prototype-to-instance manifestation', () => {
  function makePrototype(opts = {}) {
    return new Template({
      template: '<p>{value}</p>',
      templateName: 'proto',
      defaultState: { count: 0 },
      defaultSettings: { theme: 'light' },
      events: { 'click .btn'() {} },
      keys: { 'cmd+s'() {} },
      subTemplates: { foo: 'placeholder' },
      createComponent: () => ({}),
      onCreated: () => {},
      onRendered: () => {},
      onDestroyed: () => {},
      onThemeChanged: () => {},
      renderingEngine: realEngine,
      ...opts,
    });
  }

  it('produces a new Template instance distinct from the prototype', () => {
    const proto = makePrototype();
    const clone = proto.clone({});
    expect(clone).toBeInstanceOf(Template);
    expect(clone).not.toBe(proto);
    expect(clone.id).not.toBe(proto.id);
  });

  it('copies templateName from the prototype when not overridden', () => {
    const proto = makePrototype();
    const clone = proto.clone({});
    expect(clone.templateName).toBe('proto');
  });

  it('copies the AST reference from the prototype', () => {
    const proto = makePrototype();
    const clone = proto.clone({});
    expect(clone.ast).toBe(proto.ast);
  });

  it('copies defaultState and defaultSettings references', () => {
    const proto = makePrototype();
    const clone = proto.clone({});
    expect(clone.defaultState).toBe(proto.defaultState);
    expect(clone.defaultSettings).toBe(proto.defaultSettings);
  });

  it('copies events, keys, and subTemplates references', () => {
    const proto = makePrototype();
    const clone = proto.clone({});
    expect(clone.events).toBe(proto.events);
    expect(clone.keys).toBe(proto.keys);
    expect(clone.subTemplates).toBe(proto.subTemplates);
  });

  it('copies createComponent and renderingEngine references', () => {
    const proto = makePrototype();
    const clone = proto.clone({});
    expect(clone.createComponent).toBe(proto.createComponent);
    expect(clone.renderingEngine).toBe(proto.renderingEngine);
  });

  it('forwards lifecycle callbacks (onCreatedCallback, onRenderedCallback, onDestroyedCallback, onThemeChangedCallback)', () => {
    const proto = makePrototype();
    const clone = proto.clone({});
    expect(clone.onCreatedCallback).toBe(proto.onCreatedCallback);
    expect(clone.onRenderedCallback).toBe(proto.onRenderedCallback);
    expect(clone.onDestroyedCallback).toBe(proto.onDestroyedCallback);
    expect(clone.onThemeChangedCallback).toBe(proto.onThemeChangedCallback);
  });

  it('does NOT forward parentTemplate via the constructor (Option B: setParent is sole authority)', () => {
    const ancestor = new Template();
    const proto = makePrototype({ parentTemplate: ancestor });
    const clone = proto.clone({});
    // Constructor ignores parentTemplate; the renderer's cloneInstance
    // calls setParent explicitly after constructing the clone.
    expect(clone.parentTemplate).toBeUndefined();
  });

  it('lets settings overrides win over prototype defaults', () => {
    const customEvents = { 'click'() {} };
    const proto = makePrototype();
    const clone = proto.clone({ events: customEvents });
    expect(clone.events).toBe(customEvents);
    expect(clone.events).not.toBe(proto.events);
    // other fields still come from prototype
    expect(clone.keys).toBe(proto.keys);
  });

  it('accepts data as an override and stores it on the clone', () => {
    const proto = makePrototype();
    const clone = proto.clone({ data: { value: 'X' } });
    expect(clone.data).toEqual({ value: 'X' });
    expect(clone.data).not.toBe(proto.data); // proto.data is the {} default
  });

  it('does NOT call initialize() on the cloned Template', () => {
    const proto = makePrototype();
    const clone = proto.clone({});
    expect(clone.initialized).toBeFalsy();
  });

  it('[D6 PIN] events/ast/subTemplates/defaultState are SHARED references with prototype (not deep-cloned)', () => {
    // The misnomer pin. Mutations to these on either side are visible to the
    // other. Production code never mutates them — but the contract is that
    // clone() is prototype-to-instance manifestation, NOT duplication.
    const proto = makePrototype();
    const clone = proto.clone({});
    expect(clone.events).toBe(proto.events);
    expect(clone.ast).toBe(proto.ast);
    expect(clone.subTemplates).toBe(proto.subTemplates);
    expect(clone.defaultState).toBe(proto.defaultState);
    expect(clone.defaultSettings).toBe(proto.defaultSettings);

    // Mutating proto.events IS visible on clone.events.
    proto.events['extra'] = () => 'late';
    expect(clone.events.extra).toBeDefined();
    expect(clone.events.extra).toBe(proto.events.extra);
  });

  it('produces an independent reactive state (signals are FRESH per clone)', () => {
    const proto = makePrototype();
    const clone = proto.clone({});
    // both have a state object, but the Signal instances are NOT shared.
    expect(clone.state).not.toBe(proto.state);
    expect(clone.state.count).toBeInstanceOf(Signal);
    expect(clone.state.count).not.toBe(proto.state.count);
  });

  it('produces fresh ids per clone', () => {
    const proto = makePrototype();
    const cloneA = proto.clone({});
    const cloneB = proto.clone({});
    expect(cloneA.id).not.toBe(cloneB.id);
    expect(cloneA.id).not.toBe(proto.id);
  });
});

/*******************************
   Canonical clone + setParent flow
*******************************/

describe('Canonical production wiring — clone → setElement → setParent → initialize', () => {
  it('clone({ parentTemplate: X }) followed by setParent(X) wires the child correctly', () => {
    // Renderer block at packages/renderer/src/engines/native/blocks/template.js:147–156
    // is the production caller. clone() carries parentTemplate by spread; the
    // explicit setParent(X) afterwards is what populates _childTemplates.
    const proto = new Template({
      template: '<span>{name}</span>',
      defaultSettings: { name: 'init' },
      renderingEngine: realEngine,
    });
    const parent = new Template();
    const child = proto.clone({ parentTemplate: parent, data: { name: 'A' } });
    child.setParent(parent);

    expect(child.parentTemplate).toBe(parent);
    expect(parent._childTemplates).toContain(child);
    expect(parent._childTemplates.filter(t => t === child)).toHaveLength(1);
  });

  it('full sequence: clone → setElement → setParent → initialize completes without error', () => {
    // Production sequence per renderer block:
    //   const instance = template.clone({ ..., parentTemplate, data, ... });
    //   if (parent.element) { instance.setElement(parent.element); }
    //   instance.setParent(parent);
    //   instance.initialize();
    const proto = new Template({
      template: '<span>{theme}</span>',
      defaultSettings: { theme: 'light' },
      renderingEngine: realEngine,
    });
    const fakeElement = { settings: { brand: 'X' } };
    const parent = new Template({ element: fakeElement });
    const child = proto.clone({
      parentTemplate: parent,
      data: { theme: 'dark' },
    });
    child.setElement(fakeElement);
    child.setParent(parent);
    expect(() => child.initialize()).not.toThrow();

    // post-init invariants
    expect(child.isSubtemplate()).toBe(true);
    expect(child.settings).toBeDefined();
    expect(child.settings.theme).toBe('dark'); // data wins over default
    expect(child.settings.brand).toBe('X'); // parent fallback
    expect(parent._childTemplates).toContain(child);
  });
});

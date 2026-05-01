import { Reaction, Signal } from '@semantic-ui/reactivity';
import { Renderer, ServerRenderer } from '@semantic-ui/renderer';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Template } from '@semantic-ui/templating';

const realEngine = { renderer: Renderer, serverRenderer: ServerRenderer };

afterEach(() => {
  Template.renderedTemplates.clear();
  Template.templateCount = 0;
});

// Stamps out a parent + child pair with the options needed to drive
// initialize() through the real renderer.
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
        isSubtemplate
*******************************/

describe('Template.isSubtemplate', () => {
  it('returns false for a freshly constructed Template with no parent', () => {
    const template = new Template();
    expect(template.isSubtemplate()).toBe(false);
    expect(template.parentTemplate).toBeUndefined();
  });

  it('returns false when constructed with parentTemplate but without setParent', () => {
    // setParent is the sole authority for parent wiring.
    const parent = new Template();
    const child = new Template({
      template: '<span></span>',
      renderingEngine: realEngine,
      parentTemplate: parent,
    });
    expect(child.parentTemplate).toBeUndefined();
    expect(child.isSubtemplate()).toBe(false);
  });

  it('returns true after setParent', () => {
    const parent = new Template();
    const child = new Template();
    child.setParent(parent);
    expect(child.isSubtemplate()).toBe(true);
    expect(child.parentTemplate).toBe(parent);
  });

  it('returns false after removeParent clears the parent reference', () => {
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
      setParent / removeParent
*******************************/

describe('Template.setParent', () => {
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

  it('is idempotent on the same parent', () => {
    const parent = new Template();
    const child = new Template();
    child.setParent(parent);
    child.setParent(parent);
    const occurrences = parent._childTemplates.filter(t => t === child).length;
    expect(occurrences).toBe(1);
  });

  it('detaches from the prior parent when re-parented', () => {
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

  it('restores wiring across setParent → removeParent → setParent on the same parent', () => {
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

describe('Template.removeParent', () => {
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
    // Simulate a partial-state code path where parentTemplate was wired
    // without going through setParent.
    child.parentTemplate = parent;
    expect(() => child.removeParent()).not.toThrow();
  });
});

/*******************************
   Subtemplate without defaultSettings
*******************************/

describe('Subtemplate without defaultSettings', () => {
  it('does not create a settings Proxy when defaultSettings is undefined', () => {
    const { child } = makeSubtemplatePair({
      childData: { name: 'A' },
    });
    child.initialize();
    expect(child.settings).toBeUndefined();
    expect(child.settingsVars).toBeUndefined();
  });

  it('does not create a settings Proxy when defaultSettings is an empty object', () => {
    const { child } = makeSubtemplatePair({
      childDefaultSettings: {},
      childData: { foo: 'bar' },
    });
    child.initialize();
    expect(child.settings).toBeUndefined();
  });

  it('does not create a settings Proxy on a non-subtemplate even with defaultSettings', () => {
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
    expect(() => child.updateSubtemplateSettings({ foo: 2 })).not.toThrow();
    expect(child.settings).toBeUndefined();
  });
});

/*******************************
   Subtemplate with defaultSettings
*******************************/

describe('Subtemplate with defaultSettings', () => {
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
    const { child } = makeSubtemplatePair({
      childDefaultSettings: { theme: 'light' },
      childData: { theme: 'dark' },
    });
    child.initialize();
    expect(child.settings.theme).toBe('dark');
  });

  it('preserves falsy data values', () => {
    const { child } = makeSubtemplatePair({
      childDefaultSettings: { count: 5 },
      childData: { count: 0 },
    });
    child.initialize();
    expect(child.settings.count).toBe(0);
  });

  it('preserves null and false in passed data', () => {
    const { child } = makeSubtemplatePair({
      childDefaultSettings: { active: true, label: 'default' },
      childData: { active: false, label: null },
    });
    child.initialize();
    expect(child.settings.active).toBe(false);
    expect(child.settings.label).toBeNull();
  });

  it('persists writes through the Proxy on the target object', () => {
    const { child } = makeSubtemplatePair({
      childDefaultSettings: { theme: 'light' },
    });
    child.initialize();
    child.settings.theme = 'dark';
    expect(child.settings.theme).toBe('dark');
  });

  it('creates a Signal in settingsVars on first read', () => {
    // Use createSubtemplateSettings directly to observe the lazy-create path.
    // initialize() walks all defaultSettings keys via overlaySettingsSignals
    // before tests can observe the pre-read state.
    const { child } = makeSubtemplatePair({
      childDefaultSettings: { theme: 'light' },
    });
    child.createSubtemplateSettings();
    expect(child.settingsVars.has('theme')).toBe(false);
    child.settings.theme;
    expect(child.settingsVars.has('theme')).toBe(true);
    expect(child.settingsVars.get('theme')).toBeInstanceOf(Signal);
  });

  it('primes a backing Signal for every defaultSettings key after initialize', () => {
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
    // Use the Proxy directly without initialize() so overlaySettingsSignals
    // priming doesn't pre-create the signal.
    const { child } = makeSubtemplatePair({
      childDefaultSettings: { theme: 'light' },
    });
    child.createSubtemplateSettings();
    expect(child.settingsVars.has('theme')).toBe(false);
    child.settings.theme = 'dark';
    expect(child.settingsVars.has('theme')).toBe(true);
    expect(child.settingsVars.get('theme')).toBeInstanceOf(Signal);
  });

  it('creates a Signal on first write to an undeclared key', () => {
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
    child.settings.theme;
    const sig = child.settingsVars.get('theme');
    child.settings.theme = 'dark';
    expect(child.settingsVars.get('theme')).toBe(sig);
  });

  it('returns symbol-keyed properties without touching settingsVars', () => {
    const { child } = makeSubtemplatePair({
      childDefaultSettings: { theme: 'light' },
    });
    child.initialize();
    const sym = Symbol.iterator;
    const before = child.settingsVars.size;
    child.settings[sym];
    expect(child.settingsVars.size).toBe(before);
  });
});

/*******************************
     Parent element fallback
*******************************/

describe('Subtemplate settings — parent element fallback', () => {
  // The renderer calls instance.setElement(parent.element) before initialize(),
  // so this.element points at the parent's element and the Proxy captures
  // parentSettings from this.element?.settings.

  function makeFallbackFixture({ childDefaultSettings, parentSettings, childData = {} }) {
    const fakeElement = { settings: { ...parentSettings } };
    return {
      ...makeSubtemplatePair({
        childDefaultSettings,
        childData,
        childElement: fakeElement,
        parentElement: fakeElement,
      }),
      fakeElement,
    };
  }

  it('returns own setting when key is in defaultSettings', () => {
    const f = makeFallbackFixture({
      childDefaultSettings: { ownProp: 'X' },
      parentSettings: { otherProp: 'Y' },
    });
    f.child.initialize();
    expect(f.child.settings.ownProp).toBe('X');
  });

  it('falls back to parent element.settings when key is not in own target', () => {
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

  it('shadows the parent fallback once the key is written via the Proxy', () => {
    // Once `brand` is written through the Proxy it lives in the local target
    // and own-key precedence wins — the parent fallback is no longer consulted.
    const f = makeFallbackFixture({
      childDefaultSettings: { ownProp: 'X' },
      parentSettings: { brand: 'parent-brand' },
    });
    f.child.initialize();
    expect(f.child.settings.brand).toBe('parent-brand');
    f.child.settings.brand = 'shadowed';
    expect(f.child.settings.brand).toBe('shadowed');
    expect(f.fakeElement.settings.brand).toBe('parent-brand');
  });

  it('returns undefined safely when child has no element at all', () => {
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
  it('re-runs a Reaction that reads through the Proxy when the key is written', () => {
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

  it('does not trigger reactivity when the underlying object is mutated in place', () => {
    // Consumers must REPLACE values via Proxy set, not mutate the stored
    // object in place. allowClone:false stores by reference, and the Signal's
    // deep-equality on set() makes a structurally identical replacement after
    // a mutation a no-op.
    const { child } = makeSubtemplatePair({
      childDefaultSettings: { todo: { completed: false } },
    });
    let runs = 0;
    let reaction;
    try {
      child.initialize();
      reaction = Reaction.create(() => {
        runs++;
        const todo = child.settings.todo;
        void todo?.completed;
      });
      expect(runs).toBe(1);

      child.settings.todo.completed = true;
      Reaction.flush();
      expect(runs).toBe(1);

      // A structurally distinct replacement does trigger.
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
    expect(child.settingsVars.has('undeclared')).toBe(false);
  });

  it('writes the new value through the Proxy set, firing the underlying Signal', () => {
    const { child } = makeSubtemplatePair({
      childDefaultSettings: { theme: 'light' },
    });
    child.initialize();
    child.settings.theme;
    const sig = child.settingsVars.get('theme');
    const setSpy = vi.spyOn(sig, 'set');

    child.updateSubtemplateSettings({ theme: 'dark' });
    expect(setSpy).toHaveBeenCalledWith('dark');
  });

  it('is a no-op when defaultSettings is undefined', () => {
    const { child } = makeSubtemplatePair({
      childData: { foo: 1 },
    });
    child.initialize();
    child.updateSubtemplateSettings({ foo: 2 });
    expect(child.settings).toBeUndefined();
    expect(child.settingsVars).toBeUndefined();
  });

  it('skips keys that are present in defaultSettings but absent from dataContext', () => {
    const { child } = makeSubtemplatePair({
      childDefaultSettings: { theme: 'light', size: 'md' },
    });
    child.initialize();
    child.updateSubtemplateSettings({ theme: 'dark' });
    expect(child.settings.theme).toBe('dark');
    expect(child.settings.size).toBe('md');
  });
});

/*******************************
              clone
*******************************/

describe('Template.clone', () => {
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

  it('forwards lifecycle callbacks', () => {
    const proto = makePrototype();
    const clone = proto.clone({});
    expect(clone.onCreatedCallback).toBe(proto.onCreatedCallback);
    expect(clone.onRenderedCallback).toBe(proto.onRenderedCallback);
    expect(clone.onDestroyedCallback).toBe(proto.onDestroyedCallback);
    expect(clone.onThemeChangedCallback).toBe(proto.onThemeChangedCallback);
  });

  it('does not forward parentTemplate via the constructor', () => {
    // The renderer's cloneInstance calls setParent explicitly after
    // constructing the clone — setParent is the sole authority.
    const ancestor = new Template();
    const proto = makePrototype({ parentTemplate: ancestor });
    const clone = proto.clone({});
    expect(clone.parentTemplate).toBeUndefined();
  });

  it('lets settings overrides win over prototype defaults', () => {
    const customEvents = { 'click'() {} };
    const proto = makePrototype();
    const clone = proto.clone({ events: customEvents });
    expect(clone.events).toBe(customEvents);
    expect(clone.events).not.toBe(proto.events);
    expect(clone.keys).toBe(proto.keys);
  });

  it('accepts data as an override and stores it on the clone', () => {
    const proto = makePrototype();
    const clone = proto.clone({ data: { value: 'X' } });
    expect(clone.data).toEqual({ value: 'X' });
    expect(clone.data).not.toBe(proto.data);
  });

  it('does not call initialize on the cloned Template', () => {
    const proto = makePrototype();
    const clone = proto.clone({});
    expect(clone.initialized).toBeFalsy();
  });

  it('shares events, ast, subTemplates, and defaultState with the prototype', () => {
    // clone() is prototype-to-instance manifestation, not duplication.
    // Production code never mutates these.
    const proto = makePrototype();
    const clone = proto.clone({});
    expect(clone.events).toBe(proto.events);
    expect(clone.ast).toBe(proto.ast);
    expect(clone.subTemplates).toBe(proto.subTemplates);
    expect(clone.defaultState).toBe(proto.defaultState);
    expect(clone.defaultSettings).toBe(proto.defaultSettings);

    proto.events['extra'] = () => 'late';
    expect(clone.events.extra).toBeDefined();
    expect(clone.events.extra).toBe(proto.events.extra);
  });

  it('produces an independent reactive state with fresh Signal instances per clone', () => {
    const proto = makePrototype();
    const clone = proto.clone({});
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
   clone + setParent flow
*******************************/

describe('Template clone + setParent flow', () => {
  it('wires the child correctly when clone({ parentTemplate }) is followed by setParent', () => {
    // clone() carries parentTemplate by spread; the explicit setParent(X)
    // afterwards is what populates _childTemplates.
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

  it('completes the full clone → setElement → setParent → initialize sequence', () => {
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

    expect(child.isSubtemplate()).toBe(true);
    expect(child.settings).toBeDefined();
    expect(child.settings.theme).toBe('dark');
    expect(child.settings.brand).toBe('X');
    expect(parent._childTemplates).toContain(child);
  });
});

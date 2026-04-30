import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Signal } from '@semantic-ui/reactivity';
import { Template } from '@semantic-ui/templating';

afterEach(() => {
  Template.renderedTemplates.clear();
});

describe('Template construction & pure logic', () => {
  /*******************************
        (A) Constructor defaults
  *******************************/

  describe('constructor defaults & field assignment', () => {
    it('succeeds with no arguments', () => {
      expect(() => new Template()).not.toThrow();
    });

    it('defaults events to undefined', () => {
      const tpl = new Template();
      expect(tpl.events).toBeUndefined();
    });

    it('defaults keys to {} when not provided', () => {
      const tpl = new Template();
      expect(tpl.keys).toEqual({});
    });

    it('falls back to {} when keys is explicitly null/undefined', () => {
      const tpl = new Template({ keys: undefined });
      expect(tpl.keys).toEqual({});
    });

    it('honors explicit keys when provided', () => {
      const handler = () => {};
      const tpl = new Template({ keys: { 'ctrl+s': handler } });
      expect(tpl.keys).toEqual({ 'ctrl+s': handler });
    });

    it('defaults data to {}', () => {
      const tpl = new Template();
      expect(tpl.data).toEqual({});
    });

    it('defaults state to {} when no defaultState', () => {
      const tpl = new Template();
      expect(tpl.state).toEqual({});
    });

    it('defaults isPrototype to false', () => {
      const tpl = new Template();
      expect(tpl.isPrototype).toBe(false);
    });

    it('defaults attachStyles to false', () => {
      const tpl = new Template();
      expect(tpl.attachStyles).toBe(false);
    });

    it('defaults parentTemplate to undefined', () => {
      const tpl = new Template();
      expect(tpl.parentTemplate).toBeUndefined();
    });

    it('defaults renderingEngine to "native"', () => {
      const tpl = new Template();
      expect(tpl.renderingEngine).toBe('native');
    });

    it('honors explicit renderingEngine', () => {
      // doc: api/templating/template.mdx — Constructor options table
      // documents 'renderingEngine' as configurable.
      const tpl = new Template({ renderingEngine: 'lit' });
      expect(tpl.renderingEngine).toBe('lit');
    });

    it('honors explicit isPrototype', () => {
      const tpl = new Template({ isPrototype: true });
      expect(tpl.isPrototype).toBe(true);
    });

    it('honors explicit attachStyles', () => {
      const tpl = new Template({ attachStyles: true });
      expect(tpl.attachStyles).toBe(true);
    });

    it('sets id from generateID()', () => {
      const tpl = new Template();
      expect(typeof tpl.id).toBe('string');
      expect(tpl.id.length).toBeGreaterThan(0);
    });

    it('generates unique ids across instances', () => {
      const a = new Template();
      const b = new Template();
      expect(a.id).not.toBe(b.id);
    });

    it('compiles template into ast when no ast given', () => {
      const tpl = new Template({ template: '<div>hello</div>' });
      expect(Array.isArray(tpl.ast)).toBe(true);
      expect(tpl.ast.length).toBeGreaterThan(0);
    });

    it('does not run the compiler when ast is passed directly', () => {
      // an unrelated template string would normally compile, but when ast
      // is provided the compiler is bypassed entirely
      const ast = [{ type: 'text', value: 'pre-built' }];
      const tpl = new Template({ ast });
      expect(tpl.ast).toBe(ast);
    });

    it('does not throw when template is undefined but ast is given', () => {
      const ast = [{ type: 'text', value: 'hi' }];
      expect(() => new Template({ ast })).not.toThrow();
    });

    it('defaults templateName to "Anonymous #N"', () => {
      const tpl = new Template();
      expect(tpl.templateName).toMatch(/^Anonymous #\d+$/);
    });

    it('honors explicit templateName', () => {
      const tpl = new Template({ templateName: 'MyTemplate' });
      expect(tpl.templateName).toBe('MyTemplate');
    });

    it('increments templateCount for sequential anonymous templates', () => {
      const a = new Template();
      const b = new Template();
      const aNum = parseInt(a.templateName.match(/#(\d+)/)[1], 10);
      const bNum = parseInt(b.templateName.match(/#(\d+)/)[1], 10);
      expect(bNum).toBe(aNum + 1);
    });

    it('does not increment templateCount when templateName provided', () => {
      const before = Template.templateCount;
      new Template({ templateName: 'Named' });
      expect(Template.templateCount).toBe(before);
    });

    it('sets parentTemplate when passed', () => {
      const parent = new Template({ templateName: 'parent' });
      const child = new Template({ parentTemplate: parent });
      expect(child.parentTemplate).toBe(parent);
    });

    it('defaults rendered to false', () => {
      const tpl = new Template();
      expect(tpl.rendered).toBe(false);
    });

    it('defaults destroyed to false', () => {
      const tpl = new Template();
      expect(tpl.destroyed).toBe(false);
    });

    it('initializes lifecycleResolvers to {}', () => {
      const tpl = new Template();
      expect(tpl.lifecycleResolvers).toEqual({});
    });

    it('initializes lifecyclePromises to {}', () => {
      const tpl = new Template();
      expect(tpl.lifecyclePromises).toEqual({});
    });

    it('creates an AbortController', () => {
      const tpl = new Template();
      expect(tpl.abortController).toBeInstanceOf(AbortController);
    });

    it('exposes abortSignal from the AbortController', () => {
      const tpl = new Template();
      expect(tpl.abortSignal).toBe(tpl.abortController.signal);
    });

    it('initializes observers to []', () => {
      const tpl = new Template();
      expect(tpl.observers).toEqual([]);
    });

    it('initializes reactions to []', () => {
      const tpl = new Template();
      expect(tpl.reactions).toEqual([]);
    });

    // doc: api/templating/template.mdx — Constructor options table lists
    // `css`, `element`, `data`, `subTemplates`, `createComponent`, and the
    // lifecycle callbacks. They are part of the published API surface and
    // should be stored as fields on the template instance.

    it('stores css option', () => {
      const css = '.x { color: red; }';
      const tpl = new Template({ css });
      expect(tpl.css).toBe(css);
    });

    it('stores element option', () => {
      const element = { tagName: 'fake-el' };
      const tpl = new Template({ element });
      expect(tpl.element).toBe(element);
    });

    it('stores explicit data option', () => {
      const data = { name: 'John' };
      const tpl = new Template({ data });
      expect(tpl.data).toBe(data);
    });

    it('stores subTemplates option', () => {
      const subTemplates = { row: new Template({ templateName: 'row' }) };
      const tpl = new Template({ subTemplates });
      expect(tpl.subTemplates).toBe(subTemplates);
    });

    it('stores createComponent option', () => {
      const createComponent = () => ({});
      const tpl = new Template({ createComponent });
      expect(tpl.createComponent).toBe(createComponent);
    });

    it('stores defaultState option', () => {
      const defaultState = { count: 0 };
      const tpl = new Template({ defaultState });
      expect(tpl.defaultState).toBe(defaultState);
    });

    it('stores defaultSettings option (used by subtemplates)', () => {
      const defaultSettings = { color: 'blue' };
      const tpl = new Template({ defaultSettings });
      expect(tpl.defaultSettings).toBe(defaultSettings);
    });

    it('stores lifecycle callbacks (onCreated/onRendered/onDestroyed/onThemeChanged)', () => {
      const onCreated = () => {};
      const onRendered = () => {};
      const onDestroyed = () => {};
      const onThemeChanged = () => {};
      const tpl = new Template({ onCreated, onRendered, onDestroyed, onThemeChanged });
      expect(tpl.onCreatedCallback).toBe(onCreated);
      expect(tpl.onRenderedCallback).toBe(onRendered);
      expect(tpl.onDestroyedCallback).toBe(onDestroyed);
      expect(tpl.onThemeChangedCallback).toBe(onThemeChanged);
    });
  });

  /*******************************
       (B) createReactiveState
  *******************************/

  describe('createReactiveState', () => {
    it('wraps simple defaultState values in Signals', () => {
      const tpl = new Template({ defaultState: { count: 0 } });
      expect(tpl.state.count).toBeInstanceOf(Signal);
      expect(tpl.state.count.get()).toBe(0);
    });

    // The longhand `{value, options}` defaultState shape is an internal
    // template.js:126 convenience for forwarding Signal options. User-facing
    // docs (state.mdx, signal-options.mdx, component-state.md) document the
    // shorthand `{key: value}` only and direct authors to `signal()` inside
    // createComponent when Signal options are required. We test the longhand
    // here because the templating package supports it directly.
    it('handles complex config with options (internal longhand)', () => {
      const tpl = new Template({
        defaultState: {
          counter: { value: 5, options: { allowClone: false } },
        },
      });
      expect(tpl.state.counter).toBeInstanceOf(Signal);
      expect(tpl.state.counter.get()).toBe(5);
    });

    it('passes options through to underlying Signal (allowClone:false)', () => {
      // doc: signal-options.mdx — `allowClone: false` disables value cloning
      // so the same reference is returned and mutated.
      const tpl = new Template({
        defaultState: {
          obj: { value: { a: 1 }, options: { allowClone: false } },
        },
      });
      const initial = tpl.state.obj.get();
      expect(tpl.state.obj.allowClone).toBe(false);
      // mutating the returned reference would affect the stored value (no clone)
      initial.a = 99;
      expect(tpl.state.obj.get().a).toBe(99);
    });

    // template.js:113 comment:
    //   "we want to allow data context to override default state ... most
    //    useful in subtemplates as state can be used as a substitute for
    //    settings". This data→state seeding is internal initialization
    //    behavior. State.mdx documents that defaultState becomes Signals;
    //    component-state.md documents merge order in templates as
    //    {...data, ...state, ...instance} (state wins in the data context).
    //    The two are consistent: the data passed to the constructor seeds
    //    defaults but the resulting Signals dominate at render time.
    it('lets data override defaultState (initialization seeding)', () => {
      const tpl = new Template({
        defaultState: { name: 'default' },
        data: { name: 'override' },
      });
      expect(tpl.state.name.get()).toBe('override');
    });

    // INTENT: explicit data values should beat defaultState even when falsy
    // (empty string, 0, false). Source uses `if (dataValue)` so falsy data
    // currently silently falls through to the default — leaving this test
    // failing documents the gap. See template.js:117.
    it('lets data override defaultState with falsy values', () => {
      const tpl = new Template({
        defaultState: { name: 'default', count: 5, active: true },
        data: { name: '', count: 0, active: false },
      });
      expect(tpl.state.name.get()).toBe('');
      expect(tpl.state.count.get()).toBe(0);
      expect(tpl.state.active.get()).toBe(false);
    });

    it('does not override with undefined data values (undefined means "no override")', () => {
      const tpl = new Template({
        defaultState: { name: 'default' },
        data: { name: undefined },
      });
      expect(tpl.state.name.get()).toBe('default');
    });

    it('returns {} when defaultState is undefined', () => {
      const tpl = new Template();
      expect(tpl.state).toEqual({});
    });

    it('handles multiple keys in defaultState', () => {
      const tpl = new Template({
        defaultState: { count: 0, name: 'foo', active: true },
      });
      expect(tpl.state.count.get()).toBe(0);
      expect(tpl.state.name.get()).toBe('foo');
      expect(tpl.state.active.get()).toBe(true);
    });
  });

  /*******************************
       (C) setDataContext / getDataContext
  *******************************/

  describe('setDataContext / getDataContext', () => {
    it('mutates tpl.data in place', () => {
      const tpl = new Template();
      const originalData = tpl.data;
      tpl.setDataContext({ a: 1 });
      expect(tpl.data).toBe(originalData);
      expect(tpl.data.a).toBe(1);
    });

    it('sets dataReplaced to true when data changes', () => {
      const tpl = new Template();
      tpl.setDataContext({ a: 1 });
      expect(tpl.dataReplaced).toBe(true);
    });

    it('does NOT set dataReplaced when data is identical', () => {
      const tpl = new Template({ data: { a: 1 } });
      tpl.dataReplaced = false;
      tpl.setDataContext(tpl.data);
      expect(tpl.dataReplaced).toBe(false);
    });

    it('does NOT clear rendered when rerender:false', () => {
      const tpl = new Template();
      tpl.rendered = true;
      tpl.setDataContext({ a: 1 }, { rerender: false });
      expect(tpl.rendered).toBe(true);
    });

    it('clears rendered by default (rerender:true)', () => {
      const tpl = new Template();
      tpl.rendered = true;
      tpl.setDataContext({ a: 1 });
      expect(tpl.rendered).toBe(false);
    });

    // doc: ai/skills/authoring/component-state.md — "The data context is
    // flat. Settings, state, and the component instance are spread into a
    // single namespace ... { ...this.data, ...this.state, ...this.instance }"
    // and "State wins over settings for same-named keys because it spreads
    // second." instance spreads last so it wins over state.
    it('getDataContext merges data, state, and instance', () => {
      const tpl = new Template();
      tpl.data = { a: 1 };
      tpl.state = { b: 2 };
      tpl.instance = { c: 3 };
      const ctx = tpl.getDataContext();
      expect(ctx).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('state overrides data in merge order', () => {
      const tpl = new Template();
      tpl.data = { x: 1 };
      tpl.state = { x: 2 };
      tpl.instance = {};
      expect(tpl.getDataContext().x).toBe(2);
    });

    it('instance overrides state in merge order', () => {
      const tpl = new Template();
      tpl.data = {};
      tpl.state = { x: 2 };
      tpl.instance = { x: 3 };
      expect(tpl.getDataContext().x).toBe(3);
    });

    it('returns a fresh object (not a reference to data)', () => {
      const tpl = new Template();
      tpl.data = { a: 1 };
      tpl.instance = {};
      const ctx = tpl.getDataContext();
      expect(ctx).not.toBe(tpl.data);
    });
  });

  /*******************************
              (D) clone
  *******************************/

  describe('clone(settings)', () => {
    const makeBase = () =>
      new Template({
        templateName: 'Base',
        ast: [{ type: 'text', value: 'hi' }],
        defaultState: { count: 0 },
        events: { 'click .btn': () => {} },
        keys: { 'ctrl+s': () => {} },
        renderingEngine: 'native',
      });

    it('returns a new Template instance', () => {
      const base = makeBase();
      const copy = base.clone();
      expect(copy).toBeInstanceOf(Template);
    });

    it('does not return the same instance', () => {
      const base = makeBase();
      const copy = base.clone();
      expect(copy).not.toBe(base);
    });

    it('preserves templateName by default', () => {
      const base = makeBase();
      const copy = base.clone();
      expect(copy.templateName).toBe(base.templateName);
    });

    it('overrides templateName when passed in settings', () => {
      const base = makeBase();
      const copy = base.clone({ templateName: 'override' });
      expect(copy.templateName).toBe('override');
    });

    it('preserves the ast reference', () => {
      const base = makeBase();
      const copy = base.clone();
      expect(copy.ast).toBe(base.ast);
    });

    it('preserves events reference', () => {
      const base = makeBase();
      const copy = base.clone();
      expect(copy.events).toBe(base.events);
    });

    it('preserves keys reference', () => {
      const base = makeBase();
      const copy = base.clone();
      expect(copy.keys).toBe(base.keys);
    });

    it('preserves renderingEngine', () => {
      const base = makeBase();
      const copy = base.clone();
      expect(copy.renderingEngine).toBe(base.renderingEngine);
    });

    it('creates fresh state Signals (not shared with original)', () => {
      const base = makeBase();
      const copy = base.clone();
      expect(copy.state.count).not.toBe(base.state.count);
      expect(copy.state.count.get()).toBe(0);
    });

    it('gets a new id distinct from the original', () => {
      const base = makeBase();
      const copy = base.clone();
      expect(copy.id).not.toBe(base.id);
    });

    // doc: api/templating/template.mdx#clone — usage example
    //   template.clone({ data: { name: 'Jane' } })
    // demonstrates passing data through to the clone.
    it('passes data through to the clone', () => {
      const base = makeBase();
      const copy = base.clone({ data: { name: 'Jane' } });
      expect(copy.data).toEqual({ name: 'Jane' });
    });

    // doc: api/templating/template.mdx — clone returns "a new Template
    // instance" with optional new settings. defaultState is preserved so
    // the clone seeds its own fresh state Signals from the same defaults.
    it('preserves defaultState reference for fresh state initialization', () => {
      const base = makeBase();
      const copy = base.clone();
      expect(copy.defaultState).toBe(base.defaultState);
    });

    // doc: api/templating/template.mdx — Constructor options lists
    // createComponent and subTemplates; cloning a prototype must preserve
    // these so the cloned per-instance template has the same behavior.
    it('preserves createComponent reference', () => {
      const createComponent = () => ({ method: () => 1 });
      const base = new Template({ templateName: 'base', createComponent });
      const copy = base.clone();
      expect(copy.createComponent).toBe(createComponent);
    });

    it('preserves subTemplates reference', () => {
      const row = new Template({ templateName: 'row' });
      const base = new Template({ templateName: 'base', subTemplates: { row } });
      const copy = base.clone();
      expect(copy.subTemplates).toBe(base.subTemplates);
    });

    // doc: api/templating/template.mdx — lifecycle callbacks on the
    // Constructor options table; clone must carry them through.
    it('preserves lifecycle callbacks', () => {
      const onCreated = () => {};
      const onRendered = () => {};
      const onDestroyed = () => {};
      const onThemeChanged = () => {};
      const base = new Template({
        templateName: 'base',
        onCreated,
        onRendered,
        onDestroyed,
        onThemeChanged,
      });
      const copy = base.clone();
      expect(copy.onCreatedCallback).toBe(onCreated);
      expect(copy.onRenderedCallback).toBe(onRendered);
      expect(copy.onDestroyedCallback).toBe(onDestroyed);
      expect(copy.onThemeChangedCallback).toBe(onThemeChanged);
    });
  });

  /*******************************
       (E) Parent / Child wiring
  *******************************/

  describe('setParent / removeParent / isSubtemplate / setElement', () => {
    it('setParent adds the child to parent._childTemplates', () => {
      const parent = new Template({ templateName: 'parent' });
      const child = new Template({ templateName: 'child' });
      child.setParent(parent);
      expect(parent._childTemplates).toEqual([child]);
    });

    it('setParent supports multiple children', () => {
      const parent = new Template({ templateName: 'parent' });
      const a = new Template({ templateName: 'a' });
      const b = new Template({ templateName: 'b' });
      a.setParent(parent);
      b.setParent(parent);
      expect(parent._childTemplates.length).toBe(2);
      expect(parent._childTemplates).toContain(a);
      expect(parent._childTemplates).toContain(b);
    });

    it('setParent assigns parentTemplate on the child', () => {
      const parent = new Template({ templateName: 'parent' });
      const child = new Template({ templateName: 'child' });
      child.setParent(parent);
      expect(child.parentTemplate).toBe(parent);
    });

    it('removeParent removes the child from parent._childTemplates by id', () => {
      const parent = new Template({ templateName: 'parent' });
      const a = new Template({ templateName: 'a' });
      const b = new Template({ templateName: 'b' });
      a.setParent(parent);
      b.setParent(parent);
      a.removeParent();
      expect(parent._childTemplates).toEqual([b]);
    });

    it('removeParent is a no-op when no parentTemplate', () => {
      const orphan = new Template({ templateName: 'orphan' });
      expect(() => orphan.removeParent()).not.toThrow();
    });

    it('removeParent is a no-op when parent has no _childTemplates', () => {
      const parent = new Template({ templateName: 'parent' });
      const child = new Template({ parentTemplate: parent, templateName: 'child' });
      // child was wired via constructor, parent never had setParent called on it
      expect(() => child.removeParent()).not.toThrow();
    });

    it('isSubtemplate returns true when constructor passed parentTemplate', () => {
      const parent = new Template({ templateName: 'parent' });
      const child = new Template({ parentTemplate: parent });
      expect(child.isSubtemplate()).toBe(true);
    });

    it('isSubtemplate returns false without parentTemplate', () => {
      const tpl = new Template();
      expect(tpl.isSubtemplate()).toBe(false);
    });

    it('isSubtemplate returns true after setParent', () => {
      const parent = new Template({ templateName: 'parent' });
      const child = new Template({ templateName: 'child' });
      child.setParent(parent);
      expect(child.isSubtemplate()).toBe(true);
    });

    it('setElement sets tpl.element', () => {
      const tpl = new Template();
      const fakeEl = { id: 'fake' };
      tpl.setElement(fakeEl);
      expect(tpl.element).toBe(fakeEl);
    });
  });

  /*******************************
       (F) Static template registry
  *******************************/

  describe('static template registry', () => {
    it('addTemplate registers by templateName', () => {
      const tpl = new Template({ templateName: 'foo' });
      Template.addTemplate(tpl);
      expect(Template.renderedTemplates.get('foo')).toEqual([tpl]);
    });

    it('addTemplate accumulates multiple templates with the same name', () => {
      const a = new Template({ templateName: 'foo' });
      const b = new Template({ templateName: 'foo' });
      Template.addTemplate(a);
      Template.addTemplate(b);
      expect(Template.renderedTemplates.get('foo')).toEqual([a, b]);
    });

    it('removeTemplate removes by id', () => {
      const a = new Template({ templateName: 'foo' });
      const b = new Template({ templateName: 'foo' });
      Template.addTemplate(a);
      Template.addTemplate(b);
      Template.removeTemplate(a);
      expect(Template.renderedTemplates.get('foo')).toEqual([b]);
    });

    it('addTemplate skips templates marked isPrototype', () => {
      const proto = new Template({ templateName: 'proto', isPrototype: true });
      Template.addTemplate(proto);
      expect(Template.renderedTemplates.has('proto')).toBe(false);
    });

    it('removeTemplate skips templates marked isPrototype', () => {
      const real = new Template({ templateName: 'foo' });
      const proto = new Template({ templateName: 'foo', isPrototype: true });
      Template.addTemplate(real);
      Template.removeTemplate(proto);
      // real is untouched
      expect(Template.renderedTemplates.get('foo')).toEqual([real]);
    });

    it('getTemplates returns the registered array', () => {
      const tpl = new Template({ templateName: 'foo' });
      Template.addTemplate(tpl);
      expect(Template.getTemplates('foo')).toEqual([tpl]);
    });

    it('getTemplates returns [] when no templates registered for name', () => {
      expect(Template.getTemplates('does-not-exist')).toEqual([]);
    });

    it('findTemplate returns flattened {...instance, ...data} of first match', () => {
      const tpl = new Template({ templateName: 'foo' });
      tpl.instance = { foo: 1 };
      tpl.data = { bar: 2 };
      Template.addTemplate(tpl);
      expect(Template.findTemplate('foo')).toEqual({ foo: 1, bar: 2 });
    });

    it('findTemplate has data override instance for shared keys', () => {
      // {...instance, ...data} — data wins on collision
      const tpl = new Template({ templateName: 'foo' });
      tpl.instance = { x: 'instance' };
      tpl.data = { x: 'data' };
      Template.addTemplate(tpl);
      expect(Template.findTemplate('foo').x).toBe('data');
    });

    it('findTemplate returns undefined for unknown name', () => {
      expect(Template.findTemplate('missing')).toBeUndefined();
    });

    it('findTemplate returns undefined when name registered but list is empty', () => {
      const tpl = new Template({ templateName: 'foo' });
      Template.addTemplate(tpl);
      Template.removeTemplate(tpl);
      // map still has 'foo' key with empty array — first element is undefined
      expect(Template.findTemplate('foo')).toBeUndefined();
    });
  });

  /*******************************
        (G) instanceof / Symbol.hasInstance
  *******************************/

  describe('instanceof / Symbol.hasInstance', () => {
    it('returns true for Template instances', () => {
      expect(new Template() instanceof Template).toBe(true);
    });

    it('returns false for plain objects', () => {
      expect({} instanceof Template).toBe(false);
    });

    it('returns false for null', () => {
      expect(null instanceof Template).toBe(false);
    });

    it('returns true for Object.create(Template.prototype)', () => {
      const fake = Object.create(Template.prototype);
      expect(fake instanceof Template).toBe(true);
    });

    it('returns true for objects carrying the IS_TEMPLATE symbol', () => {
      // Symbol-based check tolerates duplicate Template copies across bundles
      const duck = { [Symbol.for('semantic-ui/Template')]: true };
      expect(duck instanceof Template).toBe(true);
    });
  });
});

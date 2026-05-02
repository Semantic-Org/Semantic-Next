// Tree traversal — registry and subtemplate cascade.
//
// Exercises Template.renderedTemplates (the global registry) and the
// subtemplate-only cascade for findParent / findChild / findChildren —
// the paths that don't require a real DOM. DOM-cascade tests live in
// test/browser/tree-traversal-dom.test.js (need real el.shadowRoot).

import { afterEach, describe, expect, it } from 'vitest';

import { Renderer, ServerRenderer } from '@semantic-ui/renderer';
import { Template } from '@semantic-ui/templating';

const realEngine = { renderer: Renderer, serverRenderer: ServerRenderer };

afterEach(() => {
  Template.renderedTemplates.clear();
  Template.templateCount = 0;
});

function snapshotRegistry() {
  const names = [...Template.renderedTemplates.keys()];
  const counts = {};
  for (const name of names) {
    counts[name] = Template.renderedTemplates.get(name).length;
  }
  return {
    size: names.length,
    names,
    counts,
    totalInstances: Object.values(counts).reduce((s, n) => s + n, 0),
  };
}

/*******************************
       Registry mechanics
*******************************/

describe('Template.renderedTemplates registry', () => {
  it('is empty before any Template is initialized', () => {
    expect(snapshotRegistry().totalInstances).toBe(0);
  });

  it('adds a Template on onCreated and removes it on onDestroyed', () => {
    const template = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'pageHeader',
    });
    template.initialize();
    const snap = snapshotRegistry();
    expect(snap.totalInstances).toBe(1);
    expect(snap.counts.pageHeader).toBe(1);

    template.onDestroyed();
    const after = snapshotRegistry();
    expect(after.totalInstances).toBe(0);
  });

  it('does not register a Template constructed with isPrototype: true', () => {
    // The registry is for rendered instances; prototypes are templates-of-
    // templates and the addTemplate / removeTemplate helpers short-circuit.
    const proto = new Template({
      template: '<div></div>',
      templateName: 'protoOnly',
      isPrototype: true,
    });
    Template.addTemplate(proto);
    expect(snapshotRegistry().totalInstances).toBe(0);

    Template.removeTemplate(proto);
    expect(snapshotRegistry().totalInstances).toBe(0);
  });

  it('registers anonymous templates under their auto-generated name', () => {
    Template.templateCount = 0;
    const template = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
    });
    template.initialize();
    expect(template.templateName).toBe('Anonymous #1');
    const found = Template.findTemplate('Anonymous #1');
    expect(found).toBeDefined();
  });

  it('accumulates multiple instances under the same templateName', () => {
    const a = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'sibling',
    });
    const b = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'sibling',
    });
    a.initialize();
    b.initialize();
    const snap = snapshotRegistry();
    expect(snap.counts.sibling).toBe(2);
  });

  it('removes only the specific instance on destroy when multiple share a name', () => {
    const a = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'sibling',
    });
    const b = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'sibling',
    });
    a.initialize();
    b.initialize();
    a.onDestroyed();
    const snap = snapshotRegistry();
    expect(snap.counts.sibling).toBe(1);
    const remaining = Template.getTemplates('sibling');
    expect(remaining[0].id).toBe(b.id);
  });

  it('deletes the registry key when the last instance with that name destroys', () => {
    // Without this, monotonically-increasing template names (Anonymous #N,
    // route-driven distinct components) leave the Map growing forever as
    // each unique name keeps an empty-array entry after destroy.
    const before = Template.renderedTemplates.size;
    for (let i = 0; i < 50; i++) {
      const t = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: `transient_${i}`,
      });
      t.initialize();
      t.onDestroyed();
    }
    expect(Template.renderedTemplates.size).toBe(before);
  });
});

/*******************************
        findTemplate
*******************************/

describe('findTemplate — global registry lookup', () => {
  it('returns undefined when no Template is registered under that name', () => {
    expect(Template.findTemplate('nonexistent')).toBeUndefined();
  });

  it('returns undefined for null/undefined input without throwing', () => {
    // kebabToCamel's default param handles undefined but explicit null
    // bypasses defaults and would throw on null.split('-'). Defensive guard
    // at the entry of findTemplate keeps the API friendly.
    expect(() => Template.findTemplate(null)).not.toThrow();
    expect(Template.findTemplate(null)).toBeUndefined();
    expect(Template.findTemplate(undefined)).toBeUndefined();
  });

  it('returns the instance of the first registered Template', () => {
    const template = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'pageHeader',
      data: { title: 'Hello' },
      createComponent: () => ({
        greet() {
          return 'hi';
        },
      }),
    });
    template.initialize();
    const found = Template.findTemplate('pageHeader');
    expect(found).toBeDefined();
    expect(typeof found.greet).toBe('function');
    expect(found.greet()).toBe('hi');
    // findTemplate exposes the parent's full awareness — closure data included
    expect(found.title).toBe('Hello');
  });

  it('returns the first registered when multiple share a name', () => {
    const a = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'sibling',
      createComponent: () => ({
        origin: 'a',
        whoami() {
          return 'a';
        },
      }),
    });
    const b = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'sibling',
      createComponent: () => ({
        origin: 'b',
        whoami() {
          return 'b';
        },
      }),
    });
    a.initialize();
    b.initialize();
    const found = Template.findTemplate('sibling');
    expect(found.whoami()).toBe('a');
  });

  it('returns undefined after the only registered Template is destroyed', () => {
    const template = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'transient',
    });
    template.initialize();
    expect(Template.findTemplate('transient')).toBeDefined();
    template.onDestroyed();
    expect(Template.findTemplate('transient')).toBeUndefined();
  });

  it('falls through to the second registered Template after the first is destroyed', () => {
    const a = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'sibling',
      createComponent: () => ({
        whoami() {
          return 'a';
        },
      }),
    });
    const b = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'sibling',
      createComponent: () => ({
        whoami() {
          return 'b';
        },
      }),
    });
    a.initialize();
    b.initialize();
    a.onDestroyed();
    const found = Template.findTemplate('sibling');
    expect(found.whoami()).toBe('b');
  });
});

/*******************************
   findParent — subtemplate
*******************************/

describe('findParent — subtemplate cascade', () => {
  it('walks parentTemplate chain and finds parent by templateName', () => {
    // Mirrors the canonical use case: child reaches up via findParent to
    // call a method on the parent's instance (e.g. panels.isHidden(0)).
    const parent = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'uiPanels',
      createComponent: () => ({
        panels: [{ id: 'a' }, { id: 'b' }],
        hiddenIndices: [],
        isHidden(index) {
          return this.hiddenIndices.includes(index);
        },
      }),
    });
    const child = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'uiPanel',
    });
    parent.initialize();
    child.initialize();
    child.setParent(parent);

    const found = child.findParent('uiPanels');
    expect(found).toBeDefined();
    expect(typeof found.isHidden).toBe('function');
    expect(found.isHidden(0)).toBe(false);
    expect(found.panels).toEqual([{ id: 'a' }, { id: 'b' }]);
  });

  it('returns undefined when no parent matches the templateName', () => {
    const parent = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'uiPanels',
    });
    const child = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'uiPanel',
    });
    parent.initialize();
    child.initialize();
    child.setParent(parent);

    expect(child.findParent('totallyDifferent')).toBeUndefined();
  });

  it('with no name argument, returns the first ancestor that has a templateName', () => {
    const grandparent = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'gp',
    });
    const parent = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'p',
    });
    const child = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'c',
    });
    grandparent.initialize();
    parent.initialize();
    child.initialize();
    parent.setParent(grandparent);
    child.setParent(parent);

    const found = child.findParent();
    expect(found).toBeDefined();
    expect(found.templateName).toBe('p');
  });

  it('walks past non-matching ancestors to find a deeper match', () => {
    const gp = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'uiPanels',
      createComponent: () => ({
        panels: [{ id: 'gp' }],
        isHidden(index) {
          return false;
        },
      }),
    });
    const parent = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'uiPanel',
    });
    const child = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'innerThing',
    });
    gp.initialize();
    parent.initialize();
    child.initialize();
    parent.setParent(gp);
    child.setParent(parent);

    const found = child.findParent('uiPanels');
    expect(found).toBeDefined();
    expect(found.panels).toEqual([{ id: 'gp' }]);
  });

  describe('exposes everything the parent is aware of', () => {
    // findParent's contract is "anything the parent has, in case the cascade
    // would otherwise leave you blocked." Same shape the parent's template
    // body sees — instance methods, runtime data (data accumulates state and
    // additional context after the first render), closure data passed in.
    it('exposes data closure passed to the parent', () => {
      const parent = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'parentWithData',
        data: { secret: 'closure-snapshot' },
        createComponent: () => ({
          publicApi() {
            return 'ok';
          },
        }),
      });
      const child = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'childTpl',
      });
      parent.initialize();
      child.initialize();
      child.setParent(parent);

      const found = child.findParent('parentWithData');
      expect(typeof found.publicApi).toBe('function');
      expect(found.secret).toBe('closure-snapshot');
    });

    it('exposes instance methods that close over state', () => {
      // Subtemplate cascade returns instance + closure data; state Signals
      // aren't directly spread (the DOM cascade is where state Signals come
      // through via parentNode.dataContext). For subtemplate consumers, the
      // canonical pattern is instance methods that close over state.
      const parent = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'parentWithState',
        defaultState: { count: 7 },
        createComponent: ({ state }) => ({
          getCount() {
            return state.count.get();
          },
        }),
      });
      const child = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'innerKid',
      });
      parent.initialize();
      child.initialize();
      child.setParent(parent);

      const found = child.findParent('parentWithState');
      expect(typeof found.getCount).toBe('function');
      expect(found.getCount()).toBe(7);
    });
  });

  describe('forgiving lookup — kebab and camel forms', () => {
    it('findParent("uiPanels") works (camel form)', () => {
      const parent = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'uiPanels',
        createComponent: () => ({ ok: true }),
      });
      const child = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'uiPanel',
      });
      parent.initialize();
      child.initialize();
      child.setParent(parent);
      const found = child.findParent('uiPanels');
      expect(found).toBeDefined();
      expect(found.ok).toBe(true);
    });

    it('findParent("ui-panels") works (kebab form)', () => {
      const parent = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'uiPanels',
        createComponent: () => ({ ok: true }),
      });
      const child = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'uiPanel',
      });
      parent.initialize();
      child.initialize();
      child.setParent(parent);
      const found = child.findParent('ui-panels');
      expect(found).toBeDefined();
      expect(found.ok).toBe(true);
    });

    it('findTemplate accepts kebab form', () => {
      const template = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'uiPanels',
        createComponent: () => ({ ok: true }),
      });
      template.initialize();
      expect(Template.findTemplate('uiPanels')).toBeDefined();
      const found = Template.findTemplate('ui-panels');
      expect(found).toBeDefined();
      expect(found.ok).toBe(true);
    });
  });
});

/*******************************
   findChild / findChildren
*******************************/

describe('findChild / findChildren — subtemplate cascade', () => {
  it('finds a single subtemplate child by templateName', () => {
    const parent = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'list',
    });
    const child = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'item',
      createComponent: () => ({
        getId() {
          return 42;
        },
      }),
    });
    parent.initialize();
    child.initialize();
    child.setParent(parent);

    const found = parent.findChild('item');
    expect(found).toBeDefined();
    expect(found.getId()).toBe(42);
  });

  it('findChildren returns all matching subtemplate children in array form', () => {
    const parent = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'list',
    });
    const childA = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'item',
    });
    const childB = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'item',
    });
    const childC = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'item',
    });
    parent.initialize();
    childA.initialize();
    childB.initialize();
    childC.initialize();
    childA.setParent(parent);
    childB.setParent(parent);
    childC.setParent(parent);

    const found = parent.findChildren('item');
    expect(Array.isArray(found)).toBe(true);
    expect(found.length).toBe(3);
  });

  it('recurses into nested subtemplate children', () => {
    const top = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'top',
    });
    const mid = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'mid',
    });
    const deep = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'deep',
      createComponent: () => ({ depth: 2 }),
    });
    top.initialize();
    mid.initialize();
    deep.initialize();
    mid.setParent(top);
    deep.setParent(mid);

    const found = top.findChild('deep');
    expect(found).toBeDefined();
    expect(found.depth).toBe(2);
  });

  it('returns empty array when no subtemplate children match', () => {
    const parent = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'list',
    });
    const child = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'item',
    });
    parent.initialize();
    child.initialize();
    child.setParent(parent);

    const found = parent.findChildren('different');
    expect(found).toEqual([]);
  });

  it('findChildren with no name returns all templated descendants', () => {
    const parent = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'list',
    });
    const childA = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'a',
    });
    const childB = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'b',
    });
    parent.initialize();
    childA.initialize();
    childB.initialize();
    childA.setParent(parent);
    childB.setParent(parent);

    const found = parent.findChildren();
    expect(found.length).toBe(2);
  });

  it('findChild returns the first matching subtemplate child only', () => {
    const parent = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'list',
    });
    const a = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'item',
      createComponent: () => ({ tag: 'a' }),
    });
    const b = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'item',
      createComponent: () => ({ tag: 'b' }),
    });
    parent.initialize();
    a.initialize();
    b.initialize();
    a.setParent(parent);
    b.setParent(parent);

    const found = parent.findChild('item');
    expect(found.tag).toBe('a');
  });

  describe('exposes everything the child is aware of', () => {
    it('findChild exposes closure data on the child', () => {
      const parent = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'list',
      });
      const child = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'item',
        data: { secret: 'closure-snapshot' },
        createComponent: () => ({
          publicApi() {
            return 'ok';
          },
        }),
      });
      parent.initialize();
      child.initialize();
      child.setParent(parent);

      const found = parent.findChild('item');
      expect(typeof found.publicApi).toBe('function');
      expect(found.secret).toBe('closure-snapshot');
    });

    it("findChildren entries expose each child's full awareness", () => {
      const parent = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'list',
      });
      const a = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'item',
        data: { secret: 'a-snapshot' },
        createComponent: () => ({ tag: 'a' }),
      });
      const b = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'item',
        data: { secret: 'b-snapshot' },
        createComponent: () => ({ tag: 'b' }),
      });
      parent.initialize();
      a.initialize();
      b.initialize();
      a.setParent(parent);
      b.setParent(parent);

      const found = parent.findChildren('item');
      expect(found.length).toBe(2);
      expect(found[0].tag).toBe('a');
      expect(found[1].tag).toBe('b');
      expect(found[0].secret).toBe('a-snapshot');
      expect(found[1].secret).toBe('b-snapshot');
    });
  });

  describe('forgiving lookup — kebab and camel forms', () => {
    it('findChild("childTag") works (camel form)', () => {
      const parent = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'list',
      });
      const child = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'childTag',
        createComponent: () => ({ ok: true }),
      });
      parent.initialize();
      child.initialize();
      child.setParent(parent);

      expect(parent.findChild('childTag')).toBeDefined();
    });

    it('findChild("child-tag") works (kebab form)', () => {
      const parent = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'list',
      });
      const child = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'childTag',
        createComponent: () => ({ ok: true }),
      });
      parent.initialize();
      child.initialize();
      child.setParent(parent);

      const found = parent.findChild('child-tag');
      expect(found).toBeDefined();
      expect(found.ok).toBe(true);
    });
  });
});

/*******************************
        removeParent
*******************************/

describe('removeParent — clears strong refs for GC', () => {
  it('after setParent then removeParent, child.parentTemplate is undefined', () => {
    const parent = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
    });
    const child = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
    });
    child.setParent(parent);
    expect(child.parentTemplate).toBe(parent);
    child.removeParent();
    expect(child.parentTemplate).toBeUndefined();
  });

  it('after removeParent, parent._childTemplates no longer retains the child', () => {
    const parent = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
    });
    const child = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
    });
    child.setParent(parent);
    expect(parent._childTemplates).toContain(child);
    child.removeParent();
    expect(parent._childTemplates).not.toContain(child);
  });

  it('parent.findChild no longer sees a child that called removeParent', () => {
    const parent = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
    });
    const child = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'gone',
      createComponent: () => ({ tag: 'gone' }),
    });
    child.initialize();
    child.setParent(parent);
    expect(parent.findChild('gone')).toBeDefined();
    child.removeParent();
    expect(parent.findChild('gone')).toBeUndefined();
  });
});

/*******************************
       Heap / GC guards
*******************************/

describe('heap / GC — registry returns to empty on full unmount', () => {
  it('a single mount/unmount cycle leaves the registry empty', () => {
    const template = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'transient',
    });
    template.initialize();
    expect(snapshotRegistry().totalInstances).toBe(1);
    template.onDestroyed();
    expect(snapshotRegistry().totalInstances).toBe(0);
  });

  it('100x mount/unmount cycle does not leak registry entries', () => {
    for (let i = 0; i < 100; i++) {
      const template = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'cycleTest',
      });
      template.initialize();
      template.onDestroyed();
    }
    expect(snapshotRegistry().totalInstances).toBe(0);
  });

  it('100x parent/child mount/unmount cycle leaves no _childTemplates references', () => {
    const parent = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'persistentParent',
    });
    parent.initialize();
    for (let i = 0; i < 100; i++) {
      const child = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'transientChild',
      });
      child.initialize();
      child.setParent(parent);
      child.onDestroyed();
    }
    const snap = snapshotRegistry();
    expect(snap.totalInstances).toBe(1);
    expect(snap.counts.persistentParent).toBe(1);
    expect(parent._childTemplates?.length || 0).toBe(0);
  });

  it('repeated re-bind under same name does not dedup — each instance is registered', () => {
    // The registry is a multimap, not a set: re-mounting under the same
    // templateName grows the array. Dead instances must not linger though.
    const a = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'rebindTest',
    });
    const b = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'rebindTest',
    });
    const c = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'rebindTest',
    });
    a.initialize();
    b.initialize();
    c.initialize();
    expect(snapshotRegistry().counts.rebindTest).toBe(3);
    a.onDestroyed();
    b.onDestroyed();
    c.onDestroyed();
    expect(snapshotRegistry().totalInstances).toBe(0);
  });
});

/*******************************
       Instance binders
*******************************/

describe('instance binders — findParent / findChild / findChildren / findTemplate', () => {
  it('template.findTemplate is callable and reads the registry', () => {
    const template = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'pageHeader',
    });
    template.initialize();
    const found = template.findTemplate('pageHeader');
    expect(found).toBeDefined();
  });

  it('template.findParent uses the calling Template as the start of the cascade', () => {
    const a = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'pa',
    });
    const b = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'pb',
    });
    const child = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'kid',
    });
    a.initialize();
    b.initialize();
    child.initialize();
    child.setParent(a);
    expect(child.findParent('pa')).toBeDefined();
    // b doesn't have child as descendant
    expect(b.findParent('pa')).toBeUndefined();
  });

  it('template.findChild uses the calling Template as the root of the descendant search', () => {
    const a = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'pa',
    });
    const b = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'pb',
    });
    const child = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'kid',
    });
    a.initialize();
    b.initialize();
    child.initialize();
    child.setParent(a);

    expect(a.findChild('kid')).toBeDefined();
    // b doesn't have child as descendant
    expect(b.findChild('kid')).toBeUndefined();
  });
});

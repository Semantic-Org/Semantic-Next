// Surface 8 — Tree traversal: registry + subtemplate cascade.
//
// These tests exercise Template.renderedTemplates (the global registry) and
// the subtemplate-only cascade for findParent / findChild / findChildren —
// the paths that don't require a real DOM. DOM-cascade tests live in
// test/browser/tree-traversal-dom.test.js (need real el.shadowRoot).
//
// Pinned bugs (do NOT fix here, just pin):
//   - B3: subtemplate cascade currently returns { ...instance, ...data } — leaks
//     closure-snapshot data. Locked decision: should return instance only.
//   - B5: findParent('uiPanels') (camel) works; findParent('ui-panels') (kebab)
//     misses today. Locked decision: apply kebabToCamel input normalization at
//     all instance binders so both forms succeed.
//   - B6 (cross-effect): removeParent doesn't clear parentTemplate today; pinned
//     here as the post-fix shape so tree-traversal stops seeing unmounted children.

import { afterEach, describe, expect, it } from 'vitest';

import { Renderer, ServerRenderer } from '@semantic-ui/renderer';
import { Template } from '@semantic-ui/templating';

const realEngine = { renderer: Renderer, serverRenderer: ServerRenderer };

afterEach(() => {
  Template.renderedTemplates.clear();
  Template.templateCount = 0;
});

// Snapshot helper inlined here — used by registry / GC tests below.
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

  it('does NOT register a Template constructed with isPrototype: true', () => {
    // The registry is for *rendered* instances; prototypes are templates-of-
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
    // Reset counter so the auto-name is predictable for this test
    Template.templateCount = 0;
    const template = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
    });
    template.initialize();
    // First anonymous gets "Anonymous #1"
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
    // Surviving entry is b's
    const remaining = Template.getTemplates('sibling');
    expect(remaining[0].id).toBe(b.id);
  });
});

/*******************************
        findTemplate
*******************************/

describe('findTemplate(name) — global registry lookup', () => {
  it('returns undefined when no Template is registered under that name', () => {
    expect(Template.findTemplate('nonexistent')).toBeUndefined();
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
    // Method calls work — load-bearing (panels-style usage)
    expect(found.greet()).toBe('hi');
    // Closure data does NOT leak through findTemplate
    expect(found.title).toBeUndefined();
  });

  it('returns the FIRST registered when multiple share a name', () => {
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
   findParent — subtemplate cascade
*******************************/

describe('findParent — subtemplate cascade (no DOM element on child)', () => {
  it('walks parentTemplate chain and finds parent by templateName', () => {
    // Mirror real-world usage: child reaches up via findParent to call a
    // method on the parent's instance. The panels component does exactly
    // this: panels = findParent('uiPanels'); panels.isHidden(0).
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
    // Method-call path — the canonical use case
    expect(typeof found.isHidden).toBe('function');
    expect(found.isHidden(0)).toBe(false);
    // Instance-property access — the second canonical use case
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

  /*******************************
   B3 PIN: subtemplate cascade leaks
   closure data; should return instance only
  *******************************/
  describe('B3 PIN — subtemplate cascade returns instance-only after fix', () => {
    it('PIN: closure data leaks today — findParent currently exposes data.x', () => {
      // Locked Stage 1.5 contract: cascade returns { ...instance } only.
      // Source today (template.js:1091-1094) returns { ...instance, ...data }.
      // After fix this assertion must change from "leaks" to "is undefined".
      const parent = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'parentWithData',
        data: { secret: 'closure-snapshot-leak' },
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
      // Methods always work
      expect(typeof found.publicApi).toBe('function');
      // EXPECTED-FAIL today; pins the post-B3-fix contract.
      // After fix: data closure must NOT be spread onto the result.
      expect(found.secret).toBeUndefined();
    });

    it('PIN: state Signals are not on the parent instance via subtemplate cascade', () => {
      // Subtemplate cascade reads template.instance — which DOESN'T contain
      // state Signals (they live on template.state). Pin that today's
      // behavior is "state-name returns undefined" through this path. The
      // DOM cascade today returns the Signal here (B3 leak); after the fix
      // both paths agree on undefined.
      const parent = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'parentWithState',
        defaultState: { count: 0 },
        createComponent: () => ({
          getCount(self) {
            return self?.count?.get?.();
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
      // No leak through subtemplate cascade today — pin it.
      expect(found.count).toBeUndefined();
      // Method still works (instance method present)
      expect(typeof found.getCount).toBe('function');
    });
  });

  /*******************************
   B5 PIN: kebab-form input is forgiven
  *******************************/
  describe('B5 PIN — forgiving lookup via kebabToCamel input normalization', () => {
    it('findParent("uiPanels") works (camel form, baseline)', () => {
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

    it('PIN: findParent("ui-panels") (kebab form) ALSO succeeds — EXPECTED FAIL today', () => {
      // The locked B5 fix normalizes the input string with kebabToCamel before
      // comparing against templateName (which is canonically camelCase). Today
      // the strict equality check at template.js:1065 misses kebab inputs.
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
      // Both lookup forms must converge on the same Template
      expect(found.ok).toBe(true);
    });

    it('PIN: findTemplate("ui-panels") ALSO succeeds — EXPECTED FAIL today', () => {
      // Apply normalization at all instance-binders, including findTemplate.
      const template = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'uiPanels',
        createComponent: () => ({ ok: true }),
      });
      template.initialize();
      // Camel — works today
      expect(Template.findTemplate('uiPanels')).toBeDefined();
      // Kebab — must also work after fix
      const found = Template.findTemplate('ui-panels');
      expect(found).toBeDefined();
      expect(found.ok).toBe(true);
    });
  });
});

/*******************************
   findChild / findChildren —
   subtemplate cascade
*******************************/

describe('findChild / findChildren — subtemplate cascade (no DOM children)', () => {
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

  it('findChildren returns ALL matching subtemplate children in array form', () => {
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

  it('findChildren() with no name returns ALL templated descendants', () => {
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

  /*******************************
    B3 PIN: same shape concern as findParent
  *******************************/
  describe('B3 PIN — findChild subtemplate cascade returns instance-only after fix', () => {
    it('PIN: closure data leaks today via findChild — should be undefined after fix', () => {
      // Source: template.js:1141-1144 spreads { ...childTemplate.instance, ...childTemplate.data }.
      const parent = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'list',
      });
      const child = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'item',
        data: { secret: 'closure-leak' },
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
      // EXPECTED-FAIL today; passes after fix.
      expect(found.secret).toBeUndefined();
    });

    it('PIN: findChildren returns instance-only entries (no closure data leak)', () => {
      const parent = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'list',
      });
      const a = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'item',
        data: { secret: 'a-leak' },
        createComponent: () => ({ tag: 'a' }),
      });
      const b = new Template({
        template: '<div></div>',
        renderingEngine: realEngine,
        templateName: 'item',
        data: { secret: 'b-leak' },
        createComponent: () => ({ tag: 'b' }),
      });
      parent.initialize();
      a.initialize();
      b.initialize();
      a.setParent(parent);
      b.setParent(parent);

      const found = parent.findChildren('item');
      expect(found.length).toBe(2);
      // EXPECTED-FAIL today; passes after fix.
      expect(found[0].secret).toBeUndefined();
      expect(found[1].secret).toBeUndefined();
    });
  });

  /*******************************
    B5 PIN — findChild forgiving lookup
  *******************************/
  describe('B5 PIN — findChild / findChildren accept kebab form', () => {
    it('findChild("item") works (camel, baseline)', () => {
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

    it('PIN: findChild("child-tag") (kebab) ALSO succeeds — EXPECTED FAIL today', () => {
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
    B6 cross-test: removeParent
*******************************/

describe('removeParent (B6 cross-test) — clears strong refs for GC', () => {
  it('after setParent then removeParent, child.parentTemplate is undefined', () => {
    // B6 owns this contract; Surface 8 verifies the cleanup-side effect that
    // makes traversal stop seeing the unmounted child.
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
    // EXPECTED FAIL today (B6 ownership). Pinned post-fix behavior.
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
    });
    child.setParent(parent);
    child.templateName = 'gone';
    parent._childTemplates = [child]; // sync after rename
    expect(parent.findChild('gone')).toBeDefined();
    child.removeParent();
    expect(parent.findChild('gone')).toBeUndefined();
  });
});

/*******************************
   Heap / GC — registry leak guards
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
    // The user explicitly flagged Surface 8 as the most likely source of
    // memory leaks — this is the heap-leak protector test.
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
      child.onDestroyed(); // calls removeParent inside
    }
    // Registry is back down to just the parent
    const snap = snapshotRegistry();
    expect(snap.totalInstances).toBe(1);
    expect(snap.counts.persistentParent).toBe(1);
    // _childTemplates on the parent is empty (or absent) — no retained
    // strong refs to destroyed children
    expect(parent._childTemplates?.length || 0).toBe(0);
  });

  it('repeated re-bind under same name does NOT dedup — each instance is registered', () => {
    // Sanity check: the registry is a multimap, not a set. Re-mounting under
    // the same templateName grows the array. This is intended (multiple live
    // instances) — what's NOT expected is for dead instances to linger.
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
   Instance binders — the
   instance methods just bind
   static methods with `this`
*******************************/

describe('instance binders — findParent/findChild/findChildren/findTemplate', () => {
  it('template.findTemplate is callable and reads the registry', () => {
    const template = new Template({
      template: '<div></div>',
      renderingEngine: realEngine,
      templateName: 'pageHeader',
    });
    template.initialize();
    // Direct call on the instance binder
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
    // child can find 'pa' through its own cascade
    expect(child.findParent('pa')).toBeDefined();
    // But NOT through b's (b doesn't have child as descendant)
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

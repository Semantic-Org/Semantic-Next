// Surface 8 — Tree traversal: DOM cascade.
//
// These tests need a real DOM with shadow roots and elements that have
// `.component` and `.dataContext` (the wiring the component package does for
// real web components). We sidestep the component package (circular dep
// boundary, see _helpers/README.md) by assigning .component / .dataContext
// directly on host elements — sufficient to exercise the DOM cascade walk
// in template.js: findParentTemplate / findChildTemplates.
//
// Pinned bugs (do NOT fix here, just pin):
//   - B3: DOM cascade returns { ...component, ...dataContext } — leaks state
//     Signals (dataContext = data + state + instance). Locked decision: should
//     return component (instance) only.
//   - B5: findParent('uiPanels') (camel) works; findParent('ui-panels') (kebab)
//     misses today. Locked decision: kebabToCamel input normalization at all
//     instance binders.

import { Signal } from '@semantic-ui/reactivity';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Template } from '../../src/template.js';
import { mountTemplateInShadow } from '../_helpers/browser-fixture.js';
import { freshTemplate } from '../_helpers/fresh-template.js';
import { assertRegistryEmpty, clearTemplateRegistry, snapshotRegistry } from '../_helpers/registry-cleanup.js';
import { stubEngine } from '../_helpers/stub-engine.js';

afterEach(() => {
  clearTemplateRegistry();
  document.body.innerHTML = '';
});

/*******************************
   Helper: stand up a parent
   web-component-style host with
   .component, .dataContext, and
   a shadow root containing a
   child host
*******************************/

/**
 * Build a parent host element with a shadow root that contains a child host
 * element. Both hosts have a `.component` reference (template.instance
 * standin) and a `.dataContext` (template.getDataContext() standin) — the
 * wiring the component package does for real web components.
 *
 * Returns the assembled DOM and the templates so tests can call findParent
 * from the child or findChild from the parent.
 */
function buildDomCascade({
  parentTemplateName = 'uiPanels',
  childTemplateName = 'uiPanel',
  parentInstance = {},
  parentState = {},
  parentData = {},
  childInstance = {},
} = {}) {
  // Build parent host with shadow root
  const parentHost = document.createElement('ui-panels');
  const parentShadow = parentHost.attachShadow({ mode: 'open' });
  document.body.appendChild(parentHost);

  // Build child host inside parent's shadow root
  const childHost = document.createElement('ui-panel');
  parentShadow.appendChild(childHost);

  // Stand up Templates so registry interactions are realistic
  const parentTpl = new Template({
    renderingEngine: stubEngine,
    template: '<slot></slot>',
    templateName: parentTemplateName,
    element: parentHost,
    createComponent: () => parentInstance,
    defaultState: parentState,
    data: parentData,
  });
  parentTpl.initialize();
  // Mirror the component package wiring (base.js:133-134)
  parentHost.component = parentTpl.instance;
  parentHost.dataContext = parentTpl.getDataContext();

  const childTpl = new Template({
    renderingEngine: stubEngine,
    template: '<div></div>',
    templateName: childTemplateName,
    element: childHost,
    createComponent: () => childInstance,
  });
  childTpl.initialize();
  childHost.component = childTpl.instance;
  childHost.dataContext = childTpl.getDataContext();

  return {
    parentHost,
    parentShadow,
    childHost,
    parentTpl,
    childTpl,
    cleanup() {
      try {
        childTpl.onDestroyed();
      }
      catch (_) {}
      try {
        parentTpl.onDestroyed();
      }
      catch (_) {}
      if (parentHost.parentNode) {
        parentHost.parentNode.removeChild(parentHost);
      }
    },
  };
}

/*******************************
       findParent — DOM cascade
*******************************/

describe('findParent — DOM cascade (real shadow root, parent.component wired)', () => {
  it('child component finds parent by camelCase templateName', () => {
    // The motivating panels-style use case: child reaches up to parent's API.
    const fixture = buildDomCascade({
      parentInstance: {
        panels: [{ id: 'a' }, { id: 'b' }],
        isHidden(index) {
          return false;
        },
      },
    });
    try {
      const found = fixture.childTpl.findParent('uiPanels');
      expect(found).toBeDefined();
      // Method-call path
      expect(typeof found.isHidden).toBe('function');
      expect(found.isHidden(0)).toBe(false);
      // Instance-property path
      expect(found.panels).toEqual([{ id: 'a' }, { id: 'b' }]);
    }
    finally {
      fixture.cleanup();
    }
  });

  it('walks across shadow boundaries via element.host', () => {
    // Set up: outer host -> outer shadow -> middle host -> middle shadow -> inner host.
    // The DOM cascade must traverse via .host to cross each shadow boundary.
    const outerHost = document.createElement('ui-outer');
    const outerShadow = outerHost.attachShadow({ mode: 'open' });
    document.body.appendChild(outerHost);

    const middleHost = document.createElement('ui-middle');
    const middleShadow = middleHost.attachShadow({ mode: 'open' });
    outerShadow.appendChild(middleHost);

    const innerHost = document.createElement('ui-inner');
    middleShadow.appendChild(innerHost);

    const outerTpl = new Template({
      renderingEngine: stubEngine,
      template: '<slot></slot>',
      templateName: 'outer',
      element: outerHost,
      createComponent: () => ({ depth: 0 }),
    });
    outerTpl.initialize();
    outerHost.component = outerTpl.instance;
    outerHost.dataContext = outerTpl.getDataContext();

    const middleTpl = new Template({
      renderingEngine: stubEngine,
      template: '<slot></slot>',
      templateName: 'middle',
      element: middleHost,
      createComponent: () => ({ depth: 1 }),
    });
    middleTpl.initialize();
    middleHost.component = middleTpl.instance;
    middleHost.dataContext = middleTpl.getDataContext();

    const innerTpl = new Template({
      renderingEngine: stubEngine,
      template: '<div></div>',
      templateName: 'inner',
      element: innerHost,
      createComponent: () => ({ depth: 2 }),
    });
    innerTpl.initialize();
    innerHost.component = innerTpl.instance;
    innerHost.dataContext = innerTpl.getDataContext();

    try {
      // Inner finds the outer via three shadow-boundary crossings
      const found = innerTpl.findParent('outer');
      expect(found).toBeDefined();
      expect(found.depth).toBe(0);
    }
    finally {
      try {
        innerTpl.onDestroyed();
      }
      catch (_) {}
      try {
        middleTpl.onDestroyed();
      }
      catch (_) {}
      try {
        outerTpl.onDestroyed();
      }
      catch (_) {}
      outerHost.remove();
    }
  });

  it('returns undefined when no ancestor matches the name', () => {
    const fixture = buildDomCascade();
    try {
      expect(fixture.childTpl.findParent('totallyDifferent')).toBeUndefined();
    }
    finally {
      fixture.cleanup();
    }
  });

  it('with no name argument, returns the first ancestor with a templateName', () => {
    const fixture = buildDomCascade();
    try {
      const found = fixture.childTpl.findParent();
      expect(found).toBeDefined();
      expect(found.templateName).toBe('uiPanels');
    }
    finally {
      fixture.cleanup();
    }
  });

  /*******************************
   B3 PIN — DOM cascade returns
   instance-only after fix
  *******************************/

  describe('B3 PIN — DOM cascade returns instance-only after fix', () => {
    it('PIN: state Signals leak through findParent today — should be undefined after fix', () => {
      // Source: template.js:1078-1081 spreads { ...component, ...dataContext }.
      // dataContext = extend({}, data, state, instance) so state Signals leak.
      const fixture = buildDomCascade({
        parentState: { count: 5 },
        parentInstance: {
          publicApi() {
            return 'ok';
          },
        },
      });
      try {
        const found = fixture.childTpl.findParent('uiPanels');
        expect(found).toBeDefined();
        // Method still works
        expect(typeof found.publicApi).toBe('function');
        // EXPECTED-FAIL today (state Signal leaks via dataContext spread).
        // After the locked B3 fix, state must NOT be reachable via findParent.
        expect(found.count).toBeUndefined();
      }
      finally {
        fixture.cleanup();
      }
    });

    it('PIN: data closure leaks through findParent today — should be undefined after fix', () => {
      // dataContext also includes raw data (the closure data passed to the parent).
      const fixture = buildDomCascade({
        parentData: { secret: 'closure-leak' },
        parentInstance: {
          publicApi() {
            return 'ok';
          },
        },
      });
      try {
        const found = fixture.childTpl.findParent('uiPanels');
        expect(typeof found.publicApi).toBe('function');
        // EXPECTED-FAIL today; passes after fix.
        expect(found.secret).toBeUndefined();
      }
      finally {
        fixture.cleanup();
      }
    });

    it('PIN: cross-cascade convergence — DOM and subtemplate cascades return same shape', () => {
      // Same parent component, accessed via both cascades. After the fix
      // both must return objects with the same key set: instance methods
      // and properties only — no state Signals, no closure data.
      const parentInstance = {
        hello() {
          return 'world';
        },
        magic: 1,
      };

      // DOM cascade fixture
      const dom = buildDomCascade({
        parentTemplateName: 'sharedShape',
        childTemplateName: 'kid',
        parentInstance,
        parentState: { count: 0 },
        parentData: { secret: 'leak' },
      });

      try {
        const fromDom = dom.childTpl.findParent('sharedShape');
        // EXPECTED-FAIL today (DOM cascade leaks state and data; subtemplate
        // leaks only data). After fix both should match.
        expect(fromDom.count).toBeUndefined();
        expect(fromDom.secret).toBeUndefined();
        // Both paths must continue to deliver the public API
        expect(typeof fromDom.hello).toBe('function');
        expect(fromDom.magic).toBe(1);
      }
      finally {
        dom.cleanup();
      }
    });
  });

  /*******************************
   B5 PIN — kebab form forgiveness
  *******************************/

  describe('B5 PIN — findParent forgiving lookup (DOM cascade)', () => {
    it('findParent("uiPanels") works (camel form, baseline)', () => {
      const fixture = buildDomCascade({
        parentInstance: { ok: true },
      });
      try {
        const found = fixture.childTpl.findParent('uiPanels');
        expect(found).toBeDefined();
        expect(found.ok).toBe(true);
      }
      finally {
        fixture.cleanup();
      }
    });

    it('PIN: findParent("ui-panels") (kebab) ALSO succeeds — EXPECTED FAIL today', () => {
      const fixture = buildDomCascade({
        parentInstance: { ok: true },
      });
      try {
        const found = fixture.childTpl.findParent('ui-panels');
        expect(found).toBeDefined();
        expect(found.ok).toBe(true);
      }
      finally {
        fixture.cleanup();
      }
    });

    it('PIN: kebab and camel inputs converge on the same Template after fix', () => {
      const fixture = buildDomCascade({
        parentInstance: { ok: true, sentinel: Math.random() },
      });
      try {
        const camel = fixture.childTpl.findParent('uiPanels');
        const kebab = fixture.childTpl.findParent('ui-panels');
        expect(camel).toBeDefined();
        // EXPECTED-FAIL today; passes after fix.
        expect(kebab).toBeDefined();
        expect(camel.sentinel).toBe(kebab.sentinel);
      }
      finally {
        fixture.cleanup();
      }
    });
  });
});

/*******************************
       findChild / findChildren —
       DOM cascade
*******************************/

describe('findChild / findChildren — DOM cascade', () => {
  it('finds direct DOM child by templateName', () => {
    const fixture = buildDomCascade({
      childInstance: { theId: 'kid' },
    });
    try {
      const found = fixture.parentTpl.findChild('uiPanel');
      expect(found).toBeDefined();
      expect(found.theId).toBe('kid');
    }
    finally {
      fixture.cleanup();
    }
  });

  it('findChildren returns ALL matching DOM children', () => {
    // Build parent with three matching child hosts in its shadow root
    const parentHost = document.createElement('ui-list');
    const shadow = parentHost.attachShadow({ mode: 'open' });
    document.body.appendChild(parentHost);

    const parentTpl = new Template({
      renderingEngine: stubEngine,
      template: '<slot></slot>',
      templateName: 'list',
      element: parentHost,
    });
    parentTpl.initialize();
    parentHost.component = parentTpl.instance;
    parentHost.dataContext = parentTpl.getDataContext();

    const children = [];
    for (let i = 0; i < 3; i++) {
      const childHost = document.createElement('ui-row');
      shadow.appendChild(childHost);
      const childTpl = new Template({
        renderingEngine: stubEngine,
        template: '<div></div>',
        templateName: 'row',
        element: childHost,
        createComponent: () => ({ idx: i }),
      });
      childTpl.initialize();
      childHost.component = childTpl.instance;
      childHost.dataContext = childTpl.getDataContext();
      children.push(childTpl);
    }

    try {
      const found = parentTpl.findChildren('row');
      expect(Array.isArray(found)).toBe(true);
      expect(found.length).toBe(3);
      expect(found.map(f => f.idx)).toEqual([0, 1, 2]);
    }
    finally {
      children.forEach(c => {
        try {
          c.onDestroyed();
        }
        catch (_) {}
      });
      try {
        parentTpl.onDestroyed();
      }
      catch (_) {}
      parentHost.remove();
    }
  });

  it('recurses into 2-deep nested DOM child shadow roots', () => {
    // outer (shadow) -> middle (shadow) -> inner
    const outerHost = document.createElement('ui-outer');
    const outerShadow = outerHost.attachShadow({ mode: 'open' });
    document.body.appendChild(outerHost);
    const outerTpl = new Template({
      renderingEngine: stubEngine,
      template: '<slot></slot>',
      templateName: 'outer',
      element: outerHost,
    });
    outerTpl.initialize();
    outerHost.component = outerTpl.instance;
    outerHost.dataContext = outerTpl.getDataContext();

    const middleHost = document.createElement('ui-middle');
    const middleShadow = middleHost.attachShadow({ mode: 'open' });
    outerShadow.appendChild(middleHost);
    const middleTpl = new Template({
      renderingEngine: stubEngine,
      template: '<slot></slot>',
      templateName: 'middle',
      element: middleHost,
    });
    middleTpl.initialize();
    middleHost.component = middleTpl.instance;
    middleHost.dataContext = middleTpl.getDataContext();

    const innerHost = document.createElement('ui-inner');
    middleShadow.appendChild(innerHost);
    const innerTpl = new Template({
      renderingEngine: stubEngine,
      template: '<div></div>',
      templateName: 'inner',
      element: innerHost,
      createComponent: () => ({ deep: true }),
    });
    innerTpl.initialize();
    innerHost.component = innerTpl.instance;
    innerHost.dataContext = innerTpl.getDataContext();

    try {
      const found = outerTpl.findChild('inner');
      expect(found).toBeDefined();
      expect(found.deep).toBe(true);
    }
    finally {
      try {
        innerTpl.onDestroyed();
      }
      catch (_) {}
      try {
        middleTpl.onDestroyed();
      }
      catch (_) {}
      try {
        outerTpl.onDestroyed();
      }
      catch (_) {}
      outerHost.remove();
    }
  });

  it('returns empty array when no DOM children match', () => {
    const fixture = buildDomCascade();
    try {
      const found = fixture.parentTpl.findChildren('nothingMatches');
      expect(found).toEqual([]);
    }
    finally {
      fixture.cleanup();
    }
  });

  /*******************************
   B3 PIN — findChild DOM cascade leaks
  *******************************/

  describe('B3 PIN — findChild DOM cascade returns instance-only after fix', () => {
    it('PIN: state Signals leak through findChild today — should be undefined after fix', () => {
      const parentHost = document.createElement('ui-list');
      const shadow = parentHost.attachShadow({ mode: 'open' });
      document.body.appendChild(parentHost);

      const parentTpl = new Template({
        renderingEngine: stubEngine,
        template: '<slot></slot>',
        templateName: 'list',
        element: parentHost,
      });
      parentTpl.initialize();
      parentHost.component = parentTpl.instance;
      parentHost.dataContext = parentTpl.getDataContext();

      const childHost = document.createElement('ui-row');
      shadow.appendChild(childHost);
      const childTpl = new Template({
        renderingEngine: stubEngine,
        template: '<div></div>',
        templateName: 'row',
        element: childHost,
        defaultState: { count: 7 },
        createComponent: () => ({
          publicApi() {
            return 'ok';
          },
        }),
      });
      childTpl.initialize();
      childHost.component = childTpl.instance;
      childHost.dataContext = childTpl.getDataContext();

      try {
        const found = parentTpl.findChild('row');
        expect(found).toBeDefined();
        expect(typeof found.publicApi).toBe('function');
        // EXPECTED-FAIL today; passes after fix.
        expect(found.count).toBeUndefined();
      }
      finally {
        try {
          childTpl.onDestroyed();
        }
        catch (_) {}
        try {
          parentTpl.onDestroyed();
        }
        catch (_) {}
        parentHost.remove();
      }
    });
  });

  /*******************************
   B5 PIN — findChild kebab form
  *******************************/

  describe('B5 PIN — findChild forgiving lookup (DOM cascade)', () => {
    it('findChild("uiPanel") works (camel form, baseline)', () => {
      const fixture = buildDomCascade({
        childInstance: { ok: true },
      });
      try {
        expect(fixture.parentTpl.findChild('uiPanel')).toBeDefined();
      }
      finally {
        fixture.cleanup();
      }
    });

    it('PIN: findChild("ui-panel") (kebab) ALSO succeeds — EXPECTED FAIL today', () => {
      const fixture = buildDomCascade({
        childInstance: { ok: true },
      });
      try {
        const found = fixture.parentTpl.findChild('ui-panel');
        expect(found).toBeDefined();
        expect(found.ok).toBe(true);
      }
      finally {
        fixture.cleanup();
      }
    });
  });
});

/*******************************
   Cross-cascade precedence
   (second-loop guard pin)
*******************************/

describe('findParent precedence — DOM cascade wins over subtemplate cascade', () => {
  it('PIN: when both DOM ancestor and subtemplate parent share the templateName, DOM match wins', () => {
    // Today: code structure (template.js:1086-1097) iterates the subtemplate
    // chain unconditionally after the DOM walk, but the body is short-
    // circuited by `match || ...` in isMatch. This works today and we pin
    // the precedence so a future "cleanup" of isMatch can't silently flip it.
    const fixture = buildDomCascade({
      parentInstance: { source: 'dom' },
    });

    // Wire the child to ALSO have a subtemplate parent with the same
    // templateName but different identity (so we can tell which won).
    const altParent = new Template({
      renderingEngine: stubEngine,
      template: '<div></div>',
      templateName: 'uiPanels',
      createComponent: () => ({ source: 'subtemplate' }),
    });
    altParent.initialize();
    fixture.childTpl.setParent(altParent);

    try {
      const found = fixture.childTpl.findParent('uiPanels');
      expect(found).toBeDefined();
      // DOM cascade wins
      expect(found.source).toBe('dom');
    }
    finally {
      try {
        altParent.onDestroyed();
      }
      catch (_) {}
      fixture.cleanup();
    }
  });

  it('falls back to subtemplate cascade when DOM ancestor does not match', () => {
    const fixture = buildDomCascade({
      parentTemplateName: 'differentName',
      parentInstance: { source: 'dom-no-match' },
    });

    const subParent = new Template({
      renderingEngine: stubEngine,
      template: '<div></div>',
      templateName: 'wantedParent',
      createComponent: () => ({ source: 'subtemplate-fallback' }),
    });
    subParent.initialize();
    fixture.childTpl.setParent(subParent);

    try {
      const found = fixture.childTpl.findParent('wantedParent');
      expect(found).toBeDefined();
      expect(found.source).toBe('subtemplate-fallback');
    }
    finally {
      try {
        subParent.onDestroyed();
      }
      catch (_) {}
      fixture.cleanup();
    }
  });
});

/*******************************
   Heap / GC — full DOM cycle
*******************************/

describe('heap / GC — DOM mount/unmount returns registry to empty', () => {
  it('mount + unmount of a DOM cascade fixture leaves the registry clean', () => {
    expect(snapshotRegistry().totalInstances).toBe(0);
    const fixture = buildDomCascade();
    expect(snapshotRegistry().totalInstances).toBe(2);
    fixture.cleanup();
    assertRegistryEmpty();
  });

  it('100x DOM mount/unmount cycle does not leak registry entries', () => {
    // Mirror the user's heap-leak concern: real DOM hosts + shadow roots,
    // create + destroy in a tight loop. After the run, registry must be 0.
    for (let i = 0; i < 100; i++) {
      const fixture = buildDomCascade({
        parentTemplateName: 'cycleParent',
        childTemplateName: 'cycleChild',
      });
      fixture.cleanup();
    }
    assertRegistryEmpty();
  });

  it('child host detachment + onDestroyed clears entry from registry', () => {
    const fixture = buildDomCascade();
    expect(snapshotRegistry().counts.uiPanel).toBe(1);
    expect(snapshotRegistry().counts.uiPanels).toBe(1);

    // Detach the child host from the DOM and destroy its template
    fixture.childHost.remove();
    fixture.childTpl.onDestroyed();
    expect(snapshotRegistry().counts.uiPanel || 0).toBe(0);
    // Parent still around
    expect(snapshotRegistry().counts.uiPanels).toBe(1);

    fixture.parentTpl.onDestroyed();
    fixture.parentHost.remove();
    assertRegistryEmpty();
  });
});

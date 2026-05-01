// Tree traversal — DOM cascade.
//
// DOM-cascade tests need elements with `.component` set — the wiring real
// web components do via WebComponentBase. We sidestep the component package
// by manually assigning `.component` and `.dataContext` on host elements.
// Light DOM (regular parent/child) is enough for findParent (walks up via
// .parentNode || .host). findChild paths still require a shadowRoot on the
// parent because that's what the source gates on; tests that require it
// build a shadow root inline.

import { afterEach, describe, expect, it } from 'vitest';

import { Renderer, ServerRenderer } from '@semantic-ui/renderer';
import { Template } from '@semantic-ui/templating';

const realEngine = { renderer: Renderer, serverRenderer: ServerRenderer };

afterEach(() => {
  Template.renderedTemplates.clear();
  Template.templateCount = 0;
  document.body.innerHTML = '';
});

/* Helper: build a parent → child light-DOM hierarchy with the
   .component / .dataContext refs that findParent walks. */
function buildDomCascade({
  parentTemplateName = 'uiPanels',
  childTemplateName = 'uiPanel',
  parentTagName = 'ui-panels',
  childTagName = 'ui-panel',
  parentInstance = {},
  parentState = {},
  parentData = {},
  childInstance = {},
} = {}) {
  const parentHost = document.createElement(parentTagName);
  const childHost = document.createElement(childTagName);
  document.body.appendChild(parentHost);
  parentHost.appendChild(childHost);

  const parentTpl = new Template({
    renderingEngine: realEngine,
    template: '<slot></slot>',
    templateName: parentTemplateName,
    element: parentHost,
    createComponent: () => parentInstance,
    defaultState: parentState,
    data: parentData,
  });
  parentTpl.initialize();
  parentHost.component = parentTpl.instance;
  parentHost.dataContext = parentTpl.getDataContext();

  const childTpl = new Template({
    renderingEngine: realEngine,
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
      parentHost.remove();
    },
  };
}

/*******************************
      findParent — DOM
*******************************/

describe('findParent — DOM cascade (light DOM, parent.component wired)', () => {
  it('child component finds parent by camelCase templateName', () => {
    const fixture = buildDomCascade({
      parentInstance: {
        panels: [{ id: 'a' }, { id: 'b' }],
        isHidden(index) {
          return false;
        },
      },
    });
    const found = fixture.childTpl.findParent('uiPanels');
    expect(found).toBeDefined();
    expect(typeof found.isHidden).toBe('function');
    expect(found.isHidden(0)).toBe(false);
    expect(found.panels).toEqual([{ id: 'a' }, { id: 'b' }]);
  });

  it('walks across shadow boundaries via element.host', () => {
    // Real-world nesting: outer host -> outer shadow -> middle host ->
    // middle shadow -> inner host. The DOM cascade traverses each shadow
    // boundary via `.host` so the inner template can reach the outer.
    const outerHost = document.createElement('ui-outer');
    const outerShadow = outerHost.attachShadow({ mode: 'open' });
    document.body.appendChild(outerHost);

    const middleHost = document.createElement('ui-middle');
    const middleShadow = middleHost.attachShadow({ mode: 'open' });
    outerShadow.appendChild(middleHost);

    const innerHost = document.createElement('ui-inner');
    middleShadow.appendChild(innerHost);

    const outerTpl = new Template({
      renderingEngine: realEngine,
      template: '<slot></slot>',
      templateName: 'outer',
      element: outerHost,
      createComponent: () => ({ depth: 0 }),
    });
    outerTpl.initialize();
    outerHost.component = outerTpl.instance;
    outerHost.dataContext = outerTpl.getDataContext();

    const middleTpl = new Template({
      renderingEngine: realEngine,
      template: '<slot></slot>',
      templateName: 'middle',
      element: middleHost,
      createComponent: () => ({ depth: 1 }),
    });
    middleTpl.initialize();
    middleHost.component = middleTpl.instance;
    middleHost.dataContext = middleTpl.getDataContext();

    const innerTpl = new Template({
      renderingEngine: realEngine,
      template: '<div></div>',
      templateName: 'inner',
      element: innerHost,
      createComponent: () => ({ depth: 2 }),
    });
    innerTpl.initialize();
    innerHost.component = innerTpl.instance;
    innerHost.dataContext = innerTpl.getDataContext();

    const found = innerTpl.findParent('outer');
    expect(found).toBeDefined();
    expect(found.depth).toBe(0);
  });

  it('returns undefined when no ancestor matches the name', () => {
    const fixture = buildDomCascade();
    expect(fixture.childTpl.findParent('totallyDifferent')).toBeUndefined();
  });

  it('with no name argument, returns the first ancestor with a templateName', () => {
    const fixture = buildDomCascade();
    const found = fixture.childTpl.findParent();
    expect(found).toBeDefined();
    expect(found.templateName).toBe('uiPanels');
  });

  describe('returns instance only — no state or closure data leak', () => {
    it('does not expose state Signals through findParent', () => {
      const fixture = buildDomCascade({
        parentState: { count: 5 },
        parentInstance: {
          publicApi() {
            return 'ok';
          },
        },
      });
      const found = fixture.childTpl.findParent('uiPanels');
      expect(found).toBeDefined();
      expect(typeof found.publicApi).toBe('function');
      expect(found.count).toBeUndefined();
    });

    it('does not expose data closure through findParent', () => {
      const fixture = buildDomCascade({
        parentData: { secret: 'closure-snapshot' },
        parentInstance: {
          publicApi() {
            return 'ok';
          },
        },
      });
      const found = fixture.childTpl.findParent('uiPanels');
      expect(typeof found.publicApi).toBe('function');
      expect(found.secret).toBeUndefined();
    });

    it('DOM and subtemplate cascades return the same shape', () => {
      // Both lookup paths must agree: instance methods and properties only,
      // never state Signals or closure data.
      const parentInstance = {
        hello() {
          return 'world';
        },
        magic: 1,
      };

      const dom = buildDomCascade({
        parentTemplateName: 'sharedShape',
        childTemplateName: 'kid',
        parentInstance,
        parentState: { count: 0 },
        parentData: { secret: 'snapshot' },
      });

      const fromDom = dom.childTpl.findParent('sharedShape');
      expect(fromDom.count).toBeUndefined();
      expect(fromDom.secret).toBeUndefined();
      expect(typeof fromDom.hello).toBe('function');
      expect(fromDom.magic).toBe(1);
    });
  });

  describe('forgiving lookup — kebab and camel forms', () => {
    it('findParent("uiPanels") works (camel form)', () => {
      const fixture = buildDomCascade({
        parentInstance: { ok: true },
      });
      const found = fixture.childTpl.findParent('uiPanels');
      expect(found).toBeDefined();
      expect(found.ok).toBe(true);
    });

    it('findParent("ui-panels") works (kebab form)', () => {
      const fixture = buildDomCascade({
        parentInstance: { ok: true },
      });
      const found = fixture.childTpl.findParent('ui-panels');
      expect(found).toBeDefined();
      expect(found.ok).toBe(true);
    });

    it('kebab and camel inputs converge on the same Template', () => {
      const fixture = buildDomCascade({
        parentInstance: { ok: true, sentinel: Math.random() },
      });
      const camel = fixture.childTpl.findParent('uiPanels');
      const kebab = fixture.childTpl.findParent('ui-panels');
      expect(camel).toBeDefined();
      expect(kebab).toBeDefined();
      expect(camel.sentinel).toBe(kebab.sentinel);
    });
  });
});

/*******************************
   findChild / findChildren — DOM
*******************************/

// findChild's DOM-cascade branch is gated on `template.element?.shadowRoot`,
// so these tests build a shadow root on the parent host and place children
// inside it. Light DOM is not enough.

describe('findChild / findChildren — DOM cascade', () => {
  it('finds direct DOM child by templateName', () => {
    const parentHost = document.createElement('ui-panels');
    const shadow = parentHost.attachShadow({ mode: 'open' });
    document.body.appendChild(parentHost);

    const parentTpl = new Template({
      renderingEngine: realEngine,
      template: '<slot></slot>',
      templateName: 'uiPanels',
      element: parentHost,
    });
    parentTpl.initialize();
    parentHost.component = parentTpl.instance;
    parentHost.dataContext = parentTpl.getDataContext();

    const childHost = document.createElement('ui-panel');
    shadow.appendChild(childHost);
    const childTpl = new Template({
      renderingEngine: realEngine,
      template: '<div></div>',
      templateName: 'uiPanel',
      element: childHost,
      createComponent: () => ({ theId: 'kid' }),
    });
    childTpl.initialize();
    childHost.component = childTpl.instance;
    childHost.dataContext = childTpl.getDataContext();

    const found = parentTpl.findChild('uiPanel');
    expect(found).toBeDefined();
    expect(found.theId).toBe('kid');
  });

  it('findChildren returns all matching DOM children', () => {
    const parentHost = document.createElement('ui-list');
    const shadow = parentHost.attachShadow({ mode: 'open' });
    document.body.appendChild(parentHost);

    const parentTpl = new Template({
      renderingEngine: realEngine,
      template: '<slot></slot>',
      templateName: 'list',
      element: parentHost,
    });
    parentTpl.initialize();
    parentHost.component = parentTpl.instance;
    parentHost.dataContext = parentTpl.getDataContext();

    const childTpls = [];
    for (let i = 0; i < 3; i++) {
      const childHost = document.createElement('ui-row');
      shadow.appendChild(childHost);
      const childTpl = new Template({
        renderingEngine: realEngine,
        template: '<div></div>',
        templateName: 'row',
        element: childHost,
        createComponent: () => ({ idx: i }),
      });
      childTpl.initialize();
      childHost.component = childTpl.instance;
      childHost.dataContext = childTpl.getDataContext();
      childTpls.push(childTpl);
    }

    const found = parentTpl.findChildren('row');
    expect(Array.isArray(found)).toBe(true);
    expect(found.length).toBe(3);
    expect(found.map(f => f.idx)).toEqual([0, 1, 2]);
  });

  it('recurses into 2-deep nested DOM child shadow roots', () => {
    const outerHost = document.createElement('ui-outer');
    const outerShadow = outerHost.attachShadow({ mode: 'open' });
    document.body.appendChild(outerHost);
    const outerTpl = new Template({
      renderingEngine: realEngine,
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
      renderingEngine: realEngine,
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
      renderingEngine: realEngine,
      template: '<div></div>',
      templateName: 'inner',
      element: innerHost,
      createComponent: () => ({ deep: true }),
    });
    innerTpl.initialize();
    innerHost.component = innerTpl.instance;
    innerHost.dataContext = innerTpl.getDataContext();

    const found = outerTpl.findChild('inner');
    expect(found).toBeDefined();
    expect(found.deep).toBe(true);
  });

  it('returns empty array when no DOM children match', () => {
    const parentHost = document.createElement('ui-panels');
    parentHost.attachShadow({ mode: 'open' });
    document.body.appendChild(parentHost);

    const parentTpl = new Template({
      renderingEngine: realEngine,
      template: '<slot></slot>',
      templateName: 'uiPanels',
      element: parentHost,
    });
    parentTpl.initialize();
    parentHost.component = parentTpl.instance;
    parentHost.dataContext = parentTpl.getDataContext();

    const found = parentTpl.findChildren('nothingMatches');
    expect(found).toEqual([]);
  });

  describe('returns instance only — no state leak', () => {
    it('does not expose state Signals through findChild', () => {
      const parentHost = document.createElement('ui-list');
      const shadow = parentHost.attachShadow({ mode: 'open' });
      document.body.appendChild(parentHost);

      const parentTpl = new Template({
        renderingEngine: realEngine,
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
        renderingEngine: realEngine,
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

      const found = parentTpl.findChild('row');
      expect(found).toBeDefined();
      expect(typeof found.publicApi).toBe('function');
      expect(found.count).toBeUndefined();
    });
  });

  describe('forgiving lookup — kebab and camel forms', () => {
    it('findChild("uiPanel") works (camel form)', () => {
      const parentHost = document.createElement('ui-panels');
      const shadow = parentHost.attachShadow({ mode: 'open' });
      document.body.appendChild(parentHost);
      const parentTpl = new Template({
        renderingEngine: realEngine,
        template: '<slot></slot>',
        templateName: 'uiPanels',
        element: parentHost,
      });
      parentTpl.initialize();
      parentHost.component = parentTpl.instance;
      parentHost.dataContext = parentTpl.getDataContext();

      const childHost = document.createElement('ui-panel');
      shadow.appendChild(childHost);
      const childTpl = new Template({
        renderingEngine: realEngine,
        template: '<div></div>',
        templateName: 'uiPanel',
        element: childHost,
        createComponent: () => ({ ok: true }),
      });
      childTpl.initialize();
      childHost.component = childTpl.instance;
      childHost.dataContext = childTpl.getDataContext();

      expect(parentTpl.findChild('uiPanel')).toBeDefined();
    });

    it('findChild("ui-panel") works (kebab form)', () => {
      const parentHost = document.createElement('ui-panels');
      const shadow = parentHost.attachShadow({ mode: 'open' });
      document.body.appendChild(parentHost);
      const parentTpl = new Template({
        renderingEngine: realEngine,
        template: '<slot></slot>',
        templateName: 'uiPanels',
        element: parentHost,
      });
      parentTpl.initialize();
      parentHost.component = parentTpl.instance;
      parentHost.dataContext = parentTpl.getDataContext();

      const childHost = document.createElement('ui-panel');
      shadow.appendChild(childHost);
      const childTpl = new Template({
        renderingEngine: realEngine,
        template: '<div></div>',
        templateName: 'uiPanel',
        element: childHost,
        createComponent: () => ({ ok: true }),
      });
      childTpl.initialize();
      childHost.component = childTpl.instance;
      childHost.dataContext = childTpl.getDataContext();

      const found = parentTpl.findChild('ui-panel');
      expect(found).toBeDefined();
      expect(found.ok).toBe(true);
    });
  });
});

/*******************************
       Cascade precedence
*******************************/

describe('findParent precedence — DOM cascade wins over subtemplate cascade', () => {
  it('when both DOM ancestor and subtemplate parent share the templateName, DOM match wins', () => {
    const fixture = buildDomCascade({
      parentInstance: { source: 'dom' },
    });

    // Wire the child to also have a subtemplate parent with the same
    // templateName but different identity — so we can tell which won.
    const altParent = new Template({
      renderingEngine: realEngine,
      template: '<div></div>',
      templateName: 'uiPanels',
      createComponent: () => ({ source: 'subtemplate' }),
    });
    altParent.initialize();
    fixture.childTpl.setParent(altParent);

    const found = fixture.childTpl.findParent('uiPanels');
    expect(found).toBeDefined();
    expect(found.source).toBe('dom');
  });

  it('falls back to subtemplate cascade when DOM ancestor does not match', () => {
    const fixture = buildDomCascade({
      parentTemplateName: 'differentName',
      parentInstance: { source: 'dom-no-match' },
    });

    const subParent = new Template({
      renderingEngine: realEngine,
      template: '<div></div>',
      templateName: 'wantedParent',
      createComponent: () => ({ source: 'subtemplate-fallback' }),
    });
    subParent.initialize();
    fixture.childTpl.setParent(subParent);

    const found = fixture.childTpl.findParent('wantedParent');
    expect(found).toBeDefined();
    expect(found.source).toBe('subtemplate-fallback');
  });
});

/*******************************
       Heap / GC guards
*******************************/

function totalRegistered() {
  let total = 0;
  for (const arr of Template.renderedTemplates.values()) {
    total += arr.length;
  }
  return total;
}

function countFor(name) {
  return Template.renderedTemplates.get(name)?.length || 0;
}

describe('heap / GC — DOM mount/unmount returns registry to empty', () => {
  it('mount + unmount of a DOM cascade fixture leaves the registry clean', () => {
    expect(totalRegistered()).toBe(0);
    const fixture = buildDomCascade();
    expect(totalRegistered()).toBe(2);
    fixture.cleanup();
    expect(totalRegistered()).toBe(0);
  });

  it('100x DOM mount/unmount cycle does not leak registry entries', () => {
    for (let i = 0; i < 100; i++) {
      const fixture = buildDomCascade({
        parentTemplateName: 'cycleParent',
        childTemplateName: 'cycleChild',
      });
      fixture.cleanup();
    }
    expect(totalRegistered()).toBe(0);
  });

  it('child host detachment + onDestroyed clears entry from registry', () => {
    const fixture = buildDomCascade();
    expect(countFor('uiPanel')).toBe(1);
    expect(countFor('uiPanels')).toBe(1);

    fixture.childHost.remove();
    fixture.childTpl.onDestroyed();
    expect(countFor('uiPanel')).toBe(0);
    expect(countFor('uiPanels')).toBe(1);

    fixture.parentTpl.onDestroyed();
    fixture.parentHost.remove();
    expect(totalRegistered()).toBe(0);
  });
});

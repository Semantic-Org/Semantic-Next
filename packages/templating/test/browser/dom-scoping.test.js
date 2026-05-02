// Template's renderRoot-scoped query helpers ($, $$, isNodeInTemplate)
// and the containment substrate they share with the events DSL. All
// tests run in the browser project — shadow DOM, attachShadow, and
// compareDocumentPosition need a real browser; jsdom support is
// partial and unreliable.
//
// Methodology:
// - mountTemplate attaches a real Template + Renderer to a host element.
//   When `target: 'shadow'` (default) the renderRoot is an open shadow
//   root; when `target: 'light'` the renderRoot is the host itself.
//   Tests are parameterized over both — DOM scoping is the one surface
//   where shadow vs light boundary semantics are the whole point.
// - The template ('<div></div>') is intentionally minimal. We don't call
//   render(), so the renderRoot stays empty and each test populates it
//   manually with the elements it needs.
// - For isNodeInTemplate's startNode/endNode branch, sentinels are
//   mutated on the Template instance directly (matches what the
//   renderer's DynamicRegion does when wiring subtemplates).

import { afterEach, describe, expect, it } from 'vitest';

import { Renderer, ServerRenderer } from '@semantic-ui/renderer';

import { Template } from '../../src/template.js';

const realEngine = { renderer: Renderer, serverRenderer: ServerRenderer };

async function mountTemplate({ template = '<div></div>', target = 'shadow', ...opts } = {}) {
  const host = document.createElement('div');
  const renderRoot = target === 'shadow' ? host.attachShadow({ mode: 'open' }) : host;
  document.body.appendChild(host);
  const tpl = new Template({
    template,
    renderingEngine: realEngine,
    element: host,
    ...opts,
  });
  tpl.initialize();
  await tpl.attach(renderRoot);
  return {
    host,
    renderRoot,
    template: tpl,
    cleanup: () => {
      try {
        if (tpl.initialized && !tpl.destroyed) {
          tpl.onDestroyed();
        }
      }
      catch (_) {}
      if (host.parentNode) {
        host.parentNode.removeChild(host);
      }
    },
  };
}

const RENDER_TARGETS = [
  { name: 'light', target: 'light' },
  { name: 'shadow', target: 'shadow' },
];

afterEach(() => {
  Template.renderedTemplates.clear();
  Template.templateCount = 0;
  document.body.innerHTML = '';
});

RENDER_TARGETS.forEach(({ name, target }) => {
  describe(`Template — DOM scoping (${name})`, () => {
    let fixture;
    let cleanups = [];

    afterEach(() => {
      if (fixture && fixture.cleanup) {
        try {
          fixture.cleanup();
        }
        catch (_) {}
      }
      cleanups.forEach(fn => {
        try {
          fn();
        }
        catch (_) {}
      });
      cleanups = [];
      fixture = null;
    });

    /*******************************
        $ — renderRoot-scoped query
    *******************************/

    describe('$ — renderRoot-scoped query', () => {
      it("finds elements in the component's own renderRoot", async () => {
        fixture = await mountTemplate({ target });
        const div = document.createElement('div');
        div.className = 'match';
        fixture.renderRoot.appendChild(div);

        const result = fixture.template.$('.match');
        expect(result.length).toBe(1);
        expect(result[0]).toBe(div);
      });

      it('returns empty when nothing matches in the renderRoot', async () => {
        fixture = await mountTemplate({ target });
        const result = fixture.template.$('.no-such-thing');
        expect(result.length).toBe(0);
      });

      it("does not pierce a nested child component's shadow root", async () => {
        fixture = await mountTemplate({ target });
        const inner = document.createElement('div');
        const innerShadow = inner.attachShadow({ mode: 'open' });
        const buried = document.createElement('span');
        buried.className = 'match';
        buried.textContent = 'buried';
        innerShadow.appendChild(buried);
        fixture.renderRoot.appendChild(inner);

        const result = fixture.template.$('.match');
        expect(result.length).toBe(0);
      });

      it('does not match elements outside the renderRoot', async () => {
        fixture = await mountTemplate({ target });
        const sibling = document.createElement('div');
        sibling.className = 'match';
        document.body.appendChild(sibling);
        cleanups.push(() => sibling.remove());

        const result = fixture.template.$('.match');
        expect(result.length).toBe(0);
      });
    });

    /*******************************
        $$ — shadow-piercing query
    *******************************/

    describe('$$ — shadow-piercing query', () => {
      it('finds elements in the own renderRoot (matches $ for that case)', async () => {
        fixture = await mountTemplate({ target });
        const div = document.createElement('div');
        div.className = 'match';
        fixture.renderRoot.appendChild(div);

        const result = fixture.template.$$('.match');
        expect(result.length).toBe(1);
        expect(result[0]).toBe(div);
      });

      it("pierces into a nested child component's shadow root", async () => {
        fixture = await mountTemplate({ target });
        const inner = document.createElement('div');
        const innerShadow = inner.attachShadow({ mode: 'open' });
        const buried = document.createElement('span');
        buried.className = 'match';
        innerShadow.appendChild(buried);
        fixture.renderRoot.appendChild(inner);

        const result = fixture.template.$$('.match');
        const matched = Array.from(result);
        expect(matched).toContain(buried);
      });

      it('finds elements at multiple nesting levels of shadow roots', async () => {
        fixture = await mountTemplate({ target });

        // renderRoot → outerHost (shadow) → innerHost (shadow) → .match
        const outerHost = document.createElement('div');
        const outerShadow = outerHost.attachShadow({ mode: 'open' });
        const innerHost = document.createElement('div');
        const innerShadow = innerHost.attachShadow({ mode: 'open' });
        const deepest = document.createElement('span');
        deepest.className = 'match';
        innerShadow.appendChild(deepest);
        outerShadow.appendChild(innerHost);
        fixture.renderRoot.appendChild(outerHost);

        // Sibling at the top level too.
        const top = document.createElement('span');
        top.className = 'match';
        fixture.renderRoot.appendChild(top);

        const result = Array.from(fixture.template.$$('.match'));
        expect(result).toContain(top);
        expect(result).toContain(deepest);
        expect(result.length).toBeGreaterThanOrEqual(2);
      });
    });

    /*******************************
       Special selectors → document
    *******************************/

    describe('special selectors escape to document', () => {
      it('$("body") returns document.body even when called from inside a component', async () => {
        fixture = await mountTemplate({ target });
        const result = fixture.template.$('body');
        expect(result.length).toBe(1);
        expect(result[0]).toBe(document.body);
      });

      it('$("html") returns document.documentElement', async () => {
        fixture = await mountTemplate({ target });
        const result = fixture.template.$('html');
        expect(result.length).toBe(1);
        expect(result[0]).toBe(document.documentElement);
      });

      // 'document' is in template.js's special-selector list (rebinds root
      // to document) but Query has no matching special-case for the literal
      // selector 'document' (unlike 'window'/'globalThis'). The call ends
      // up running `document.querySelectorAll('document')` — invalid as a
      // CSS tag selector — and returns zero matches. Authors who want the
      // document object should use `{ root: document }` or query for
      // 'html'/'body' instead.
      it('$("document") rebinds root to document but yields no matches', async () => {
        fixture = await mountTemplate({ target });
        const result = fixture.template.$('document');
        expect(result.length).toBe(0);
      });

      it('$("body") result is not filtered by isNodeInTemplate', async () => {
        // body is plainly outside the renderRoot. If filterTemplate were applied,
        // the result would be filtered out. Rebinding the root to document
        // also bypasses the filter.
        fixture = await mountTemplate({ target });
        const result = fixture.template.$('body');
        expect(result.length).toBe(1);
        expect(result[0]).toBe(document.body);
      });

      // 'window' is handled by Query's own `inArray(selector, ['window',
      // 'globalThis'])` branch, NOT template.js's special-selector list
      // (which is ['body', 'document', 'html'] only). Cross-package
      // coordination — if Query's special-case is refactored, in-component
      // $('window') silently breaks.
      it('$("window") returns the global proxy via underlying Query', async () => {
        fixture = await mountTemplate({ target });
        const result = fixture.template.$('window');
        expect(result.length).toBe(1);
        const { Query } = await import('@semantic-ui/query');
        expect(Query.isWindow(result[0])).toBe(true);
      });

      it('$ inside onCreated falls through to document so authors can query the rest of the page', () => {
        // onCreated fires before attach() wires renderRoot, so this.renderRoot
        // is undefined. The fallback used to be globalThis (Window), which has
        // no querySelectorAll and threw a hard TypeError. document covers the
        // user's actual intent: "query the surrounding page from onCreated."
        const sentinel = document.createElement('div');
        sentinel.id = 'oncreated-page-sentinel';
        document.body.appendChild(sentinel);
        let observed;
        const template = new Template({
          template: '<div></div>',
          renderingEngine: { renderer: Renderer, serverRenderer: ServerRenderer },
          onCreated: ({ $ }) => {
            observed = $('#oncreated-page-sentinel');
          },
        });
        try {
          template.initialize();
          expect(observed).toBeDefined();
          expect(observed.length).toBe(1);
          expect(observed[0]).toBe(sentinel);
        }
        finally {
          sentinel.remove();
          template.onDestroyed();
        }
      });
    });

    /*******************************
        filterTemplate: false
    *******************************/

    describe('filterTemplate: false (internal opt-out)', () => {
      it('returns the raw query without applying isNodeInTemplate filter', async () => {
        fixture = await mountTemplate({ target });
        const div = document.createElement('div');
        div.className = 'match';
        fixture.renderRoot.appendChild(div);

        // Force isNodeInTemplate to return false for everything by setting
        // a degenerate range — sentinels positioned such that no DOM node
        // can be strictly between them.
        const startNode = document.createTextNode('');
        const endNode = document.createTextNode('');
        fixture.renderRoot.appendChild(startNode);
        fixture.renderRoot.appendChild(endNode);
        fixture.template.startNode = startNode;
        fixture.template.endNode = endNode;

        // Default filterTemplate:true excludes div via the range filter.
        expect(fixture.template.$('.match').length).toBe(0);
        // filterTemplate:false returns the raw query.
        const raw = fixture.template.$('.match', { filterTemplate: false });
        expect(raw.length).toBe(1);
        expect(raw[0]).toBe(div);
      });
    });

    /*******************************
       isNodeInTemplate (no markers)
    *******************************/

    describe('isNodeInTemplate — web component (no range markers)', () => {
      it("returns true for an element rendered inside the component's renderRoot", async () => {
        fixture = await mountTemplate({ target });
        const div = document.createElement('div');
        fixture.renderRoot.appendChild(div);
        expect(fixture.template.isNodeInTemplate(div)).toBe(true);
      });

      it('returns true for a deeply nested element in own subtree', async () => {
        fixture = await mountTemplate({ target });
        const a = document.createElement('div');
        const b = document.createElement('div');
        const c = document.createElement('span');
        a.appendChild(b);
        b.appendChild(c);
        fixture.renderRoot.appendChild(a);
        expect(fixture.template.isNodeInTemplate(c)).toBe(true);
      });

      // For top-level Templates without sentinels, isNodeInRange short-
      // circuits to true before any node check. The function's actual
      // contract is narrower than "is this node a descendant of my
      // renderRoot": it's "given a node that bubbled to my event listener,
      // is it in my range" — and event targets that reach the listener
      // are by construction inside the renderRoot.
      it('returns true for a sibling on the document outside the renderRoot', async () => {
        fixture = await mountTemplate({ target });
        const sibling = document.createElement('div');
        document.body.appendChild(sibling);
        cleanups.push(() => sibling.remove());

        expect(fixture.template.isNodeInTemplate(sibling)).toBe(true);
      });

      it('returns true for a fully detached node when no sentinels are set', async () => {
        fixture = await mountTemplate({ target });
        const detached = document.createElement('div');
        // Never appended to anything — parentNode is null, host is undefined.
        // Walk dies immediately; range short-circuit returns true.
        expect(fixture.template.isNodeInTemplate(detached)).toBe(true);
      });
    });

    /*******************************
      isNodeInTemplate (sentinels set)
    *******************************/

    describe('isNodeInTemplate — subtemplate range', () => {
      // Mount and lay out: before, <start>, middle, <end>, after.
      async function mountWithSentinelRange() {
        const f = await mountTemplate({ target });

        const before = document.createElement('div');
        before.className = 'before';
        const startNode = document.createTextNode('');
        const middle = document.createElement('div');
        middle.className = 'middle';
        const endNode = document.createTextNode('');
        const after = document.createElement('div');
        after.className = 'after';

        f.renderRoot.appendChild(before);
        f.renderRoot.appendChild(startNode);
        f.renderRoot.appendChild(middle);
        f.renderRoot.appendChild(endNode);
        f.renderRoot.appendChild(after);

        f.template.startNode = startNode;
        f.template.endNode = endNode;

        return { fixture: f, before, startNode, middle, endNode, after };
      }

      it('returns true for a node strictly between startNode and endNode', async () => {
        const ctx = await mountWithSentinelRange();
        fixture = ctx.fixture;
        expect(fixture.template.isNodeInTemplate(ctx.middle)).toBe(true);
      });

      it('returns false for a node before startNode', async () => {
        const ctx = await mountWithSentinelRange();
        fixture = ctx.fixture;
        expect(fixture.template.isNodeInTemplate(ctx.before)).toBe(false);
      });

      it('returns false for a node after endNode', async () => {
        const ctx = await mountWithSentinelRange();
        fixture = ctx.fixture;
        expect(fixture.template.isNodeInTemplate(ctx.after)).toBe(false);
      });

      it('returns false for a detached node even when sentinels are set', async () => {
        const ctx = await mountWithSentinelRange();
        fixture = ctx.fixture;
        const detached = document.createElement('div');
        expect(fixture.template.isNodeInTemplate(detached)).toBe(false);
      });
    });

    /*******************************
        $ + range filter
    *******************************/

    describe('$ post-filters via isNodeInTemplate when root === renderRoot', () => {
      it('with sentinels set, $ returns only nodes strictly between them', async () => {
        fixture = await mountTemplate({ target });

        const before = document.createElement('div');
        before.className = 'match';
        before.textContent = 'before';
        const startNode = document.createTextNode('');
        const middle = document.createElement('div');
        middle.className = 'match';
        middle.textContent = 'middle';
        const endNode = document.createTextNode('');
        const after = document.createElement('div');
        after.className = 'match';
        after.textContent = 'after';

        fixture.renderRoot.appendChild(before);
        fixture.renderRoot.appendChild(startNode);
        fixture.renderRoot.appendChild(middle);
        fixture.renderRoot.appendChild(endNode);
        fixture.renderRoot.appendChild(after);

        fixture.template.startNode = startNode;
        fixture.template.endNode = endNode;

        const result = fixture.template.$('.match');
        expect(result.length).toBe(1);
        expect(result[0]).toBe(middle);
      });
    });
  });
});

/*******************************
    Shadow-only boundary semantics
*******************************/

// These behaviors only manifest when the renderRoot is a real ShadowRoot —
// either because the test setup needs a host element distinct from the
// renderRoot (so light DOM children of the host can be visible from
// document but not from $) or because the host-walking through .host
// chains requires shadow boundaries.

describe('Template — DOM scoping (shadow only)', () => {
  let fixture;
  let cleanups = [];

  afterEach(() => {
    if (fixture && fixture.cleanup) {
      try {
        fixture.cleanup();
      }
      catch (_) {}
    }
    cleanups.forEach(fn => {
      try {
        fn();
      }
      catch (_) {}
    });
    cleanups = [];
    fixture = null;
  });

  it('$ does not find elements that live in the light DOM of the host', async () => {
    // A child in light DOM (host's children, not slotted into the shadow tree)
    // is not visible from `querySelectorAll` rooted at the shadow root.
    fixture = await mountTemplate({ target: 'shadow' });
    const lightChild = document.createElement('div');
    lightChild.className = 'match';
    lightChild.textContent = 'light';
    fixture.host.appendChild(lightChild);

    const result = fixture.template.$('.match');
    expect(result.length).toBe(0);
  });

  it('isNodeInTemplate returns true for an element inside a nested shadow root', async () => {
    // The getRootChild walk crosses shadow boundaries upward via `node.host`
    // so events bubbling out of a nested child component can be attributed
    // to the parent template.
    fixture = await mountTemplate({ target: 'shadow' });
    const innerHost = document.createElement('div');
    const innerShadow = innerHost.attachShadow({ mode: 'open' });
    const deep = document.createElement('span');
    innerShadow.appendChild(deep);
    fixture.renderRoot.appendChild(innerHost);

    expect(fixture.template.isNodeInTemplate(deep)).toBe(true);
  });

  // Sentinels themselves are not in the range. Depends on
  // compareDocumentPosition's strict bitwise comparison returning the
  // FOLLOWING/PRECEDING bits unset for self-comparison.
  describe('sentinel exclusivity', () => {
    async function mountWithSentinelRange() {
      const f = await mountTemplate({ target: 'shadow' });

      const before = document.createElement('div');
      const startNode = document.createTextNode('');
      const middle = document.createElement('div');
      const endNode = document.createTextNode('');
      const after = document.createElement('div');

      f.renderRoot.appendChild(before);
      f.renderRoot.appendChild(startNode);
      f.renderRoot.appendChild(middle);
      f.renderRoot.appendChild(endNode);
      f.renderRoot.appendChild(after);

      f.template.startNode = startNode;
      f.template.endNode = endNode;

      return { fixture: f, before, startNode, middle, endNode, after };
    }

    it('returns false when node === startNode', async () => {
      const ctx = await mountWithSentinelRange();
      fixture = ctx.fixture;
      expect(fixture.template.isNodeInTemplate(ctx.startNode)).toBe(false);
    });

    it('returns false when node === endNode', async () => {
      const ctx = await mountWithSentinelRange();
      fixture = ctx.fixture;
      expect(fixture.template.isNodeInTemplate(ctx.endNode)).toBe(false);
    });
  });
});

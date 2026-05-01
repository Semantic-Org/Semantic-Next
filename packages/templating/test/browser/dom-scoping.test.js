// Surface 5 — DOM scoping ($, $$, isNodeInTemplate)
//
// Tests Template's renderRoot-scoped query helpers and the containment
// substrate they share with the events DSL. All tests run in the browser
// project — shadow DOM, attachShadow, and compareDocumentPosition need a
// real browser; jsdom support is partial and unreliable.
//
// Methodology:
// - mountTemplateInShadow attaches a Template to a fresh open shadow root.
// - The stub engine returns an empty fragment, so we manually populate the
//   shadow root with the elements each scenario needs. This isolates
//   $/$$ contracts from the renderer's behavior.
// - For isNodeInTemplate's startNode/endNode branch, sentinels are mutated
//   on the Template instance directly (matches what the renderer's
//   DynamicRegion does when wiring subtemplates).

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { mountTemplateInShadow } from '../_helpers/browser-fixture.js';
import { clearTemplateRegistry } from '../_helpers/registry-cleanup.js';

describe('Surface 5 — Template DOM scoping', () => {
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
    document.body.innerHTML = '';
    clearTemplateRegistry();
  });

  /*******************************
            $ — own shadow root
  *******************************/

  describe('$ — renderRoot-scoped query', () => {
    it("finds elements in the component's own shadow root", () => {
      fixture = mountTemplateInShadow();
      const div = document.createElement('div');
      div.className = 'match';
      fixture.shadow.appendChild(div);

      const result = fixture.template.$('.match');
      expect(result.length).toBe(1);
      expect(result[0]).toBe(div);
    });

    it('returns empty when nothing matches in the shadow root', () => {
      fixture = mountTemplateInShadow();
      const result = fixture.template.$('.no-such-thing');
      expect(result.length).toBe(0);
    });

    it('does NOT find elements that live in the light DOM (slotted but not projected)', () => {
      // A child in light DOM (host's children, not slotted into the shadow tree)
      // is NOT visible from `querySelectorAll` rooted at the shadow root.
      fixture = mountTemplateInShadow();
      const lightChild = document.createElement('div');
      lightChild.className = 'match';
      lightChild.textContent = 'light';
      fixture.host.appendChild(lightChild);

      const result = fixture.template.$('.match');
      expect(result.length).toBe(0);
    });

    it("does NOT find elements in a nested child component's shadow root (no piercing)", () => {
      fixture = mountTemplateInShadow();
      // Nested element with its own shadow root + a matching descendant inside it.
      const inner = document.createElement('div');
      const innerShadow = inner.attachShadow({ mode: 'open' });
      const buried = document.createElement('span');
      buried.className = 'match';
      buried.textContent = 'buried';
      innerShadow.appendChild(buried);
      fixture.shadow.appendChild(inner);

      const result = fixture.template.$('.match');
      expect(result.length).toBe(0);
    });

    it('does NOT match elements in light DOM ancestors of the host', () => {
      fixture = mountTemplateInShadow();
      // A sibling in document.body that matches — must not be visible.
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
    it('finds elements in own shadow root (same as $ for that case)', () => {
      fixture = mountTemplateInShadow();
      const div = document.createElement('div');
      div.className = 'match';
      fixture.shadow.appendChild(div);

      const result = fixture.template.$$('.match');
      expect(result.length).toBe(1);
      expect(result[0]).toBe(div);
    });

    it("finds elements in a nested child component's shadow root (load-bearing difference)", () => {
      fixture = mountTemplateInShadow();
      const inner = document.createElement('div');
      const innerShadow = inner.attachShadow({ mode: 'open' });
      const buried = document.createElement('span');
      buried.className = 'match';
      innerShadow.appendChild(buried);
      fixture.shadow.appendChild(inner);

      const result = fixture.template.$$('.match');
      // Pierces into innerShadow.
      const matched = Array.from(result);
      expect(matched).toContain(buried);
    });

    it('finds elements at multiple nesting levels of shadow roots', () => {
      fixture = mountTemplateInShadow();

      // shadow → outerHost (shadow) → innerHost (shadow) → .match
      const outerHost = document.createElement('div');
      const outerShadow = outerHost.attachShadow({ mode: 'open' });
      const innerHost = document.createElement('div');
      const innerShadow = innerHost.attachShadow({ mode: 'open' });
      const deepest = document.createElement('span');
      deepest.className = 'match';
      innerShadow.appendChild(deepest);
      outerShadow.appendChild(innerHost);
      fixture.shadow.appendChild(outerHost);

      // Also a sibling at the top level.
      const top = document.createElement('span');
      top.className = 'match';
      fixture.shadow.appendChild(top);

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
    it('$("body") returns document.body even when called from inside a component', () => {
      fixture = mountTemplateInShadow();
      const result = fixture.template.$('body');
      expect(result.length).toBe(1);
      expect(result[0]).toBe(document.body);
    });

    it('$("html") returns document.documentElement', () => {
      fixture = mountTemplateInShadow();
      const result = fixture.template.$('html');
      expect(result.length).toBe(1);
      expect(result[0]).toBe(document.documentElement);
    });

    // Source observation: 'document' is in template.js's special-selector
    // list (rebinds root → document) but Query has NO matching special-case
    // for the literal selector 'document' (unlike 'window'/'globalThis').
    // So the call ends up running `document.querySelectorAll('document')`
    // — invalid as a CSS tag selector — and returns zero matches. The
    // rebinding is observable (filter is skipped, see next test) but the
    // selector never resolves to the document itself. Authors who want
    // the document object should use `{ root: document }` or query for
    // 'html'/'body' instead.
    it('$("document") rebinds root to document but yields no matches (no CSS resolution for "document")', () => {
      fixture = mountTemplateInShadow();
      const result = fixture.template.$('document');
      expect(result.length).toBe(0);
    });

    it('$("body") result is not filtered by isNodeInTemplate (root rebound to document, filter skipped)', () => {
      // body is plainly outside the renderRoot. If filterTemplate were applied,
      // the result would be filtered out (isNodeInTemplate(body) === false).
      // The contract: rebinding the root to document also bypasses the filter.
      fixture = mountTemplateInShadow();
      const result = fixture.template.$('body');
      expect(result.length).toBe(1);
      expect(result[0]).toBe(document.body);
    });

    // L1 — cross-package: 'window' is handled by Query, NOT template.js's
    // special-selector list. This test pins the cross-package coordination —
    // Template's special-selector list is ['body', 'document', 'html'] only,
    // but Query's own `inArray(selector, ['window', 'globalThis'])` branch
    // (query.js line 159) catches 'window' downstream. If anyone refactors
    // Query's special-case, in-component $('window') silently breaks.
    it('$("window") returns the global proxy (delegated to underlying Query)', async () => {
      fixture = mountTemplateInShadow();
      const result = fixture.template.$('window');
      expect(result.length).toBe(1);
      // Query.globalThisProxy is the wrapped global. Verify the proxy
      // behaves like window by checking a property that exists on globalThis.
      const { Query } = await import('@semantic-ui/query');
      expect(Query.isWindow(result[0])).toBe(true);
    });
  });

  /*******************************
        filterTemplate: false
  *******************************/

  describe('filterTemplate: false (internal opt-out)', () => {
    it('returns the raw query without applying isNodeInTemplate filter', () => {
      // Mount a template that pretends to be a subtemplate by setting
      // startNode/endNode such that NOTHING is in range — then verify
      // filterTemplate:false still returns matches (the filter is skipped).
      fixture = mountTemplateInShadow();
      const div = document.createElement('div');
      div.className = 'match';
      fixture.shadow.appendChild(div);

      // Force isNodeInTemplate to return false for everything by setting
      // a degenerate range — sentinels positioned such that no DOM node
      // can be strictly between them.
      const startNode = document.createTextNode('');
      const endNode = document.createTextNode('');
      // Place both sentinels AFTER `div` in document order, with start
      // immediately followed by end — no node can fall strictly between them.
      fixture.shadow.appendChild(startNode);
      fixture.shadow.appendChild(endNode);
      fixture.template.startNode = startNode;
      fixture.template.endNode = endNode;

      // With default filterTemplate:true, range filter excludes div.
      expect(fixture.template.$('.match').length).toBe(0);
      // With filterTemplate:false, raw query returns div.
      const raw = fixture.template.$('.match', { filterTemplate: false });
      expect(raw.length).toBe(1);
      expect(raw[0]).toBe(div);
    });
  });

  /*******************************
        isNodeInTemplate
        (web component — no startNode/endNode)
  *******************************/

  describe('isNodeInTemplate — web component (no range markers)', () => {
    it("returns true for an element rendered inside the component's shadow root", () => {
      fixture = mountTemplateInShadow();
      const div = document.createElement('div');
      fixture.shadow.appendChild(div);
      expect(fixture.template.isNodeInTemplate(div)).toBe(true);
    });

    it('returns true for a deeply nested element in own shadow tree', () => {
      fixture = mountTemplateInShadow();
      const a = document.createElement('div');
      const b = document.createElement('div');
      const c = document.createElement('span');
      a.appendChild(b);
      b.appendChild(c);
      fixture.shadow.appendChild(a);
      expect(fixture.template.isNodeInTemplate(c)).toBe(true);
    });

    it('returns true for an element inside a NESTED shadow root (host-walking via .host)', () => {
      // The getRootChild walk must cross shadow boundaries upward via
      // `node.host` so events bubbling out of a nested child component can
      // be attributed to the parent template.
      fixture = mountTemplateInShadow();
      const innerHost = document.createElement('div');
      const innerShadow = innerHost.attachShadow({ mode: 'open' });
      const deep = document.createElement('span');
      innerShadow.appendChild(deep);
      fixture.shadow.appendChild(innerHost);

      expect(fixture.template.isNodeInTemplate(deep)).toBe(true);
    });

    // Source observation: for top-level Templates (no startNode/endNode),
    // `isNodeInRange` short-circuits to `true` BEFORE the `node === null`
    // check (template.js line 707 → 710). So even when `getRootChild` walks
    // off the top of the document and returns null, `isNodeInTemplate`
    // returns true. The function's actual contract is narrower than
    // "is this node a descendant of my renderRoot": it's "given a node
    // that bubbled to my event listener, is it in my range" — and event
    // targets that reach the listener are by construction inside the
    // renderRoot. We pin the current behavior here.
    it('returns true for a sibling element on the document outside the renderRoot (range short-circuit)', () => {
      fixture = mountTemplateInShadow();
      const sibling = document.createElement('div');
      document.body.appendChild(sibling);
      cleanups.push(() => sibling.remove());

      // getRootChild walks up to document, then null; isNodeInRange(null)
      // returns true because !startNode || !endNode short-circuits first.
      expect(fixture.template.isNodeInTemplate(sibling)).toBe(true);
    });

    it('returns true for a fully detached node when no sentinels are set (range short-circuit)', () => {
      fixture = mountTemplateInShadow();
      const detached = document.createElement('div');
      // never appended to anything — parentNode is null, host is undefined.
      // Walk dies immediately. isNodeInRange(null) hits the
      // `!startNode || !endNode` short-circuit and returns true.
      expect(fixture.template.isNodeInTemplate(detached)).toBe(true);
    });
  });

  /*******************************
        isNodeInTemplate
        (subtemplate — startNode/endNode set)
  *******************************/

  describe('isNodeInTemplate — subtemplate range (sentinels set)', () => {
    // Helper: mount, set sentinels around a known position in the shadow tree.
    function mountWithSentinelRange() {
      const f = mountTemplateInShadow();

      // Layout in shadow:
      //   <div class="before">before</div>
      //   <!-- start -->
      //   <div class="middle">middle</div>
      //   <!-- end -->
      //   <div class="after">after</div>
      const before = document.createElement('div');
      before.className = 'before';
      const startNode = document.createTextNode('');
      const middle = document.createElement('div');
      middle.className = 'middle';
      const endNode = document.createTextNode('');
      const after = document.createElement('div');
      after.className = 'after';

      f.shadow.appendChild(before);
      f.shadow.appendChild(startNode);
      f.shadow.appendChild(middle);
      f.shadow.appendChild(endNode);
      f.shadow.appendChild(after);

      f.template.startNode = startNode;
      f.template.endNode = endNode;

      return { fixture: f, before, startNode, middle, endNode, after };
    }

    it('returns true for a node strictly between startNode and endNode', () => {
      const ctx = mountWithSentinelRange();
      fixture = ctx.fixture;
      expect(fixture.template.isNodeInTemplate(ctx.middle)).toBe(true);
    });

    it('returns false for a node before startNode', () => {
      const ctx = mountWithSentinelRange();
      fixture = ctx.fixture;
      expect(fixture.template.isNodeInTemplate(ctx.before)).toBe(false);
    });

    it('returns false for a node after endNode', () => {
      const ctx = mountWithSentinelRange();
      fixture = ctx.fixture;
      expect(fixture.template.isNodeInTemplate(ctx.after)).toBe(false);
    });

    // Sentinel exclusivity (strict-between semantics) — confirms the
    // renderer's trailing-sentinel comment in dynamic-region.js is
    // load-bearing: sentinels themselves are NOT in the range.
    it('returns false when node === startNode (sentinels are exclusive)', () => {
      const ctx = mountWithSentinelRange();
      fixture = ctx.fixture;
      expect(fixture.template.isNodeInTemplate(ctx.startNode)).toBe(false);
    });

    it('returns false when node === endNode (sentinels are exclusive)', () => {
      const ctx = mountWithSentinelRange();
      fixture = ctx.fixture;
      expect(fixture.template.isNodeInTemplate(ctx.endNode)).toBe(false);
    });

    it('returns false for a detached node even when sentinels are set', () => {
      const ctx = mountWithSentinelRange();
      fixture = ctx.fixture;
      const detached = document.createElement('div');
      expect(fixture.template.isNodeInTemplate(detached)).toBe(false);
    });
  });

  /*******************************
       $ + range filter integration
  *******************************/

  describe('$ post-filters via isNodeInTemplate when root === renderRoot', () => {
    it('with sentinels set, $ returns only nodes strictly between them', () => {
      // The same fixture as the subtemplate range tests, but now we hit
      // the $ surface — verify the post-filter is applied correctly.
      fixture = mountTemplateInShadow();

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

      fixture.shadow.appendChild(before);
      fixture.shadow.appendChild(startNode);
      fixture.shadow.appendChild(middle);
      fixture.shadow.appendChild(endNode);
      fixture.shadow.appendChild(after);

      fixture.template.startNode = startNode;
      fixture.template.endNode = endNode;

      const result = fixture.template.$('.match');
      expect(result.length).toBe(1);
      expect(result[0]).toBe(middle);
    });
  });
});

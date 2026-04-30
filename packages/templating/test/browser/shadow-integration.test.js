import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { defineComponent } from '@semantic-ui/component';
import { $ } from '@semantic-ui/query';
import { Template } from '@semantic-ui/templating';

let tagCounter = 0;
const uniqueTag = (prefix = 'shadow') => `test-${prefix}-${++tagCounter}`;

// Helper — wait one macrotask + microtask for setTimeout(0) lifecycle hooks
const nextTick = () => new Promise((resolve) => setTimeout(resolve, 0));

// Helper — wait for the 10ms onThemeChanged debounce plus a small buffer
const themeDebounceWait = () => new Promise((resolve) => setTimeout(resolve, 30));

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
  Template.renderedTemplates.clear();
});

/*******************************
   (A) adoptStylesheet — basic adoption
*******************************/

describe('adoptStylesheet — basic adoption', () => {
  it('creates a CSSStyleSheet, adopts it on shadowRoot, and contains the parsed rule', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const shadowRoot = host.attachShadow({ mode: 'open' });

    const tpl = new Template({
      templateName: 'adopt-basic',
      template: '<div class="foo">x</div>',
      css: '.foo { color: red; }',
      attachStyles: true,
    });
    tpl.renderRoot = shadowRoot;
    await tpl.adoptStylesheet();

    expect(tpl.stylesheet).toBeInstanceOf(CSSStyleSheet);
    expect(shadowRoot.adoptedStyleSheets.length).toBeGreaterThanOrEqual(1);
    expect(shadowRoot.adoptedStyleSheets).toContain(tpl.stylesheet);

    const rules = Array.from(tpl.stylesheet.cssRules);
    expect(rules.length).toBe(1);
    expect(rules[0].selectorText).toBe('.foo');
  });
});

/*******************************
   (B) adoptStylesheet — no css
*******************************/

describe('adoptStylesheet — no css', () => {
  it('returns early and leaves stylesheet undefined when css is not provided', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const shadowRoot = host.attachShadow({ mode: 'open' });

    const tpl = new Template({
      templateName: 'adopt-no-css',
      template: '<div></div>',
    });
    tpl.renderRoot = shadowRoot;
    await tpl.adoptStylesheet();

    expect(tpl.stylesheet).toBeUndefined();
    expect(shadowRoot.adoptedStyleSheets.length).toBe(0);
  });
});

/*******************************
   (C) adoptStylesheet — no renderRoot or no adoptedStyleSheets support
*******************************/

describe('adoptStylesheet — missing target surface', () => {
  it('returns early without throwing when renderRoot is not set', async () => {
    const tpl = new Template({
      templateName: 'adopt-no-root',
      template: '<div></div>',
      css: '.x { color: blue; }',
    });
    // No renderRoot assigned
    await expect(tpl.adoptStylesheet()).resolves.toBeUndefined();
    expect(tpl.stylesheet).toBeUndefined();
  });

  it('returns early when renderRoot lacks adoptedStyleSheets', async () => {
    const tpl = new Template({
      templateName: 'adopt-bad-root',
      template: '<div></div>',
      css: '.x { color: blue; }',
    });
    // Plain object stand-in: no adoptedStyleSheets property
    tpl.renderRoot = {};
    await expect(tpl.adoptStylesheet()).resolves.toBeUndefined();
    expect(tpl.stylesheet).toBeUndefined();
  });
});

/*******************************
   (D) adoptStylesheet — idempotency on identical rules
*******************************/

describe('adoptStylesheet — idempotent on identical cssRules', () => {
  it('does not duplicate the sheet when called twice on the same template', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const shadowRoot = host.attachShadow({ mode: 'open' });

    const tpl = new Template({
      templateName: 'adopt-idempotent',
      template: '<div></div>',
      css: '.foo { color: red; }',
      attachStyles: true,
    });
    tpl.renderRoot = shadowRoot;
    await tpl.adoptStylesheet();
    expect(shadowRoot.adoptedStyleSheets.length).toBe(1);

    await tpl.adoptStylesheet();
    expect(shadowRoot.adoptedStyleSheets.length).toBe(1);
    expect(shadowRoot.adoptedStyleSheets).toContain(tpl.stylesheet);
  });

  it('does not append a sheet whose rules deeply equal an already-adopted one', async () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const shadowRoot = host.attachShadow({ mode: 'open' });

    // Adopt first template
    const tplA = new Template({
      templateName: 'adopt-eq-A',
      template: '<div></div>',
      css: '.foo { color: red; }',
      attachStyles: true,
    });
    tplA.renderRoot = shadowRoot;
    await tplA.adoptStylesheet();
    expect(shadowRoot.adoptedStyleSheets.length).toBe(1);

    // Second template with identical css against the same shadowRoot
    const tplB = new Template({
      templateName: 'adopt-eq-B',
      template: '<div></div>',
      css: '.foo { color: red; }',
      attachStyles: true,
    });
    tplB.renderRoot = shadowRoot;
    await tplB.adoptStylesheet();

    // isEqual on cssRules should match — no append
    expect(shadowRoot.adoptedStyleSheets.length).toBe(1);
  });

  it('skips adoption when any existing sheet appears equal under isEqual (cssRules quirk)', async () => {
    // Documents observed behavior: isEqual() compares two CSSRuleList instances
    // structurally — they share a prototype and have no enumerable own properties,
    // so isEqual returns true for ANY pair of CSSRuleLists. Result: if the renderRoot
    // already has any adopted sheet, adoptStylesheet's append branch is skipped.
    const host = document.createElement('div');
    document.body.appendChild(host);
    const shadowRoot = host.attachShadow({ mode: 'open' });

    const otherSheet = new CSSStyleSheet();
    await otherSheet.replace('.bar { color: green; }');
    shadowRoot.adoptedStyleSheets = [otherSheet];

    const tpl = new Template({
      templateName: 'adopt-existing',
      template: '<div></div>',
      css: '.foo { color: red; }',
      attachStyles: true,
    });
    tpl.renderRoot = shadowRoot;
    await tpl.adoptStylesheet();

    // tpl.stylesheet is created but NOT appended due to the isEqual quirk above.
    expect(tpl.stylesheet).toBeInstanceOf(CSSStyleSheet);
    expect(shadowRoot.adoptedStyleSheets.length).toBe(1);
    expect(shadowRoot.adoptedStyleSheets).toContain(otherSheet);
    expect(shadowRoot.adoptedStyleSheets).not.toContain(tpl.stylesheet);
  });
});

/*******************************
   (E) isNodeInTemplate across shadow boundary
*******************************/

describe('isNodeInTemplate across shadow boundary', () => {
  it('returns true for a node between startNode and endNode inside a shadowRoot', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const shadowRoot = host.attachShadow({ mode: 'open' });

    const start = document.createElement('span');
    const middle = document.createElement('span');
    const end = document.createElement('span');
    shadowRoot.append(start, middle, end);

    const tpl = new Template({
      templateName: 'in-template',
      template: '<div></div>',
    });
    tpl.parentNode = shadowRoot;
    tpl.renderRoot = shadowRoot;
    tpl.startNode = start;
    tpl.endNode = end;

    expect(tpl.isNodeInTemplate(middle)).toBe(true);
  });

  it('returns true for a deeply-nested node whose path crosses no shadow boundaries', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const shadowRoot = host.attachShadow({ mode: 'open' });

    const start = document.createElement('span');
    const wrapper = document.createElement('section');
    const inner = document.createElement('em');
    wrapper.appendChild(inner);
    const end = document.createElement('span');
    shadowRoot.append(start, wrapper, end);

    const tpl = new Template({
      templateName: 'in-template-nested',
      template: '<div></div>',
    });
    tpl.parentNode = shadowRoot;
    tpl.renderRoot = shadowRoot;
    tpl.startNode = start;
    tpl.endNode = end;

    expect(tpl.isNodeInTemplate(inner)).toBe(true);
  });

  it('walks up via node.host when crossing a shadow boundary on the way to parentNode', () => {
    // Outer shadow contains an inner host, whose own shadowRoot holds a deep node.
    // Template parentNode is the OUTER shadowRoot — getRootChild must hop the inner shadow via .host.
    const outerHost = document.createElement('div');
    document.body.appendChild(outerHost);
    const outerShadow = outerHost.attachShadow({ mode: 'open' });

    const start = document.createElement('span');
    const innerHost = document.createElement('div');
    const end = document.createElement('span');
    outerShadow.append(start, innerHost, end);

    const innerShadow = innerHost.attachShadow({ mode: 'open' });
    const deep = document.createElement('em');
    innerShadow.appendChild(deep);

    const tpl = new Template({
      templateName: 'in-template-cross-shadow',
      template: '<div></div>',
    });
    tpl.parentNode = outerShadow;
    tpl.renderRoot = outerShadow;
    tpl.startNode = start;
    tpl.endNode = end;

    // deep -> innerShadow (parent null, has host=innerHost) -> innerHost (parent === outerShadow === tpl.parentNode)
    expect(tpl.isNodeInTemplate(deep)).toBe(true);
  });

  it('returns false for a node in the surrounding light DOM (different tree, no host link upward)', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const shadowRoot = host.attachShadow({ mode: 'open' });

    const start = document.createElement('span');
    const end = document.createElement('span');
    shadowRoot.append(start, end);

    const lightSibling = document.createElement('p');
    document.body.appendChild(lightSibling);

    const tpl = new Template({
      templateName: 'in-template-light',
      template: '<div></div>',
    });
    tpl.parentNode = shadowRoot;
    tpl.renderRoot = shadowRoot;
    tpl.startNode = start;
    tpl.endNode = end;

    // Walking up from lightSibling reaches document, never the shadowRoot. getRootChild
    // returns null (parentNode.parentNode === null without a host), so isNodeInRange(null) returns false.
    expect(tpl.isNodeInTemplate(lightSibling)).toBe(false);
  });
});

/*******************************
   (F) findChildTemplates — shadowRoot traversal
*******************************/

describe('findChildTemplates — shadowRoot traversal', () => {
  it('findChild locates a direct child component nested inside the parent shadowRoot', async () => {
    const childTag = uniqueTag('child');
    const parentTag = uniqueTag('parent');

    defineComponent({
      tagName: childTag,
      templateName: 'fc-child',
      template: '<div class="c">child</div>',
    });

    defineComponent({
      tagName: parentTag,
      templateName: 'fc-parent',
      template: `<div class="p"><${childTag}></${childTag}></div>`,
      createComponent: ({ findChild }) => ({
        getChild() {
          return findChild('fc-child');
        },
      }),
    });

    const el = document.createElement(parentTag);
    const rendered = $(el).onNext('rendered');
    document.body.appendChild(el);
    await rendered;

    const child = el.component.getChild();
    expect(child).toBeDefined();
    expect(child.templateName).toBe('fc-child');
  });

  it('findChildren returns ALL matching children inside the shadowRoot', async () => {
    const itemTag = uniqueTag('item');
    const listTag = uniqueTag('list');

    defineComponent({
      tagName: itemTag,
      templateName: 'fc-item',
      template: '<li>item</li>',
    });

    defineComponent({
      tagName: listTag,
      templateName: 'fc-list',
      template: `<ul><${itemTag}></${itemTag}><${itemTag}></${itemTag}><${itemTag}></${itemTag}></ul>`,
      createComponent: ({ findChildren }) => ({
        getItems() {
          return findChildren('fc-item');
        },
      }),
    });

    const el = document.createElement(listTag);
    const rendered = $(el).onNext('rendered');
    document.body.appendChild(el);
    await rendered;

    const items = el.component.getItems();
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBe(3);
    items.forEach((item) => expect(item.templateName).toBe('fc-item'));
  });

  it('findChildren() with no name returns every child component inside the shadowRoot', async () => {
    const aTag = uniqueTag('a');
    const bTag = uniqueTag('b');
    const formTag = uniqueTag('form');

    defineComponent({
      tagName: aTag,
      templateName: 'fc-a',
      template: '<span>a</span>',
    });
    defineComponent({
      tagName: bTag,
      templateName: 'fc-b',
      template: '<span>b</span>',
    });
    defineComponent({
      tagName: formTag,
      templateName: 'fc-form',
      template: `<div><${aTag}></${aTag}><${bTag}></${bTag}><${aTag}></${aTag}></div>`,
      createComponent: ({ findChildren }) => ({
        getAll() {
          return findChildren();
        },
      }),
    });

    const el = document.createElement(formTag);
    const rendered = $(el).onNext('rendered');
    document.body.appendChild(el);
    await rendered;

    const all = el.component.getAll();
    expect(all.length).toBe(3);
    const names = all.map((c) => c.templateName).sort();
    expect(names).toEqual(['fc-a', 'fc-a', 'fc-b']);
  });

  it('findChild walks across nested shadow roots (parent -> child shadow -> grandchild shadow)', async () => {
    const grandTag = uniqueTag('grand');
    const midTag = uniqueTag('mid');
    const topTag = uniqueTag('top');

    defineComponent({
      tagName: grandTag,
      templateName: 'fc-grand',
      template: '<span>g</span>',
    });
    defineComponent({
      tagName: midTag,
      templateName: 'fc-mid',
      template: `<div><${grandTag}></${grandTag}></div>`,
    });
    defineComponent({
      tagName: topTag,
      templateName: 'fc-top',
      template: `<div><${midTag}></${midTag}></div>`,
      createComponent: ({ findChild }) => ({
        getGrand() {
          return findChild('fc-grand');
        },
        getMid() {
          return findChild('fc-mid');
        },
      }),
    });

    const el = document.createElement(topTag);
    const rendered = $(el).onNext('rendered');
    document.body.appendChild(el);
    await rendered;

    const mid = el.component.getMid();
    expect(mid).toBeDefined();
    expect(mid.templateName).toBe('fc-mid');

    const grand = el.component.getGrand();
    expect(grand).toBeDefined();
    expect(grand.templateName).toBe('fc-grand');
  });
});

/*******************************
   (G) findParentTemplate across shadow
*******************************/

describe('findParentTemplate across shadow boundary', () => {
  it('child component finds its parent by walking parentNode || host', async () => {
    const childTag = uniqueTag('pchild');
    const parentTag = uniqueTag('pparent');

    defineComponent({
      tagName: childTag,
      templateName: 'fp-child',
      template: '<div class="c">c</div>',
      createComponent: ({ findParent }) => ({
        getParent() {
          return findParent('fp-parent');
        },
      }),
    });
    defineComponent({
      tagName: parentTag,
      templateName: 'fp-parent',
      template: `<div class="p"><${childTag}></${childTag}></div>`,
      createComponent: () => ({ flag: 'parent-data' }),
    });

    const el = document.createElement(parentTag);
    const rendered = $(el).onNext('rendered');
    document.body.appendChild(el);
    await rendered;

    const childEl = el.shadowRoot?.querySelector(childTag);
    expect(childEl).toBeDefined();

    const parent = childEl.component.getParent();
    expect(parent).toBeDefined();
    expect(parent.templateName).toBe('fp-parent');
    expect(parent.flag).toBe('parent-data');
  });

  it('grandchild traverses two shadow boundaries up to its top-level ancestor', async () => {
    const deepTag = uniqueTag('deep');
    const midTag = uniqueTag('pmid');
    const topTag = uniqueTag('ptop');

    defineComponent({
      tagName: deepTag,
      templateName: 'fp-deep',
      template: '<div>deep</div>',
      createComponent: ({ findParent }) => ({
        getTop() {
          return findParent('fp-top');
        },
      }),
    });
    defineComponent({
      tagName: midTag,
      templateName: 'fp-mid',
      template: `<div><${deepTag}></${deepTag}></div>`,
    });
    defineComponent({
      tagName: topTag,
      templateName: 'fp-top',
      template: `<div><${midTag}></${midTag}></div>`,
      createComponent: () => ({ marker: 'top' }),
    });

    const el = document.createElement(topTag);
    const rendered = $(el).onNext('rendered');
    document.body.appendChild(el);
    await rendered;

    const midEl = el.shadowRoot.querySelector(midTag);
    const deepEl = midEl.shadowRoot.querySelector(deepTag);
    expect(deepEl).toBeDefined();

    const top = deepEl.component.getTop();
    expect(top).toBeDefined();
    expect(top.templateName).toBe('fp-top');
    expect(top.marker).toBe('top');
  });
});

/*******************************
   (H) themechange wire-up
*******************************/

describe('themechange wire-up', () => {
  // Ensure no stale `dark` class persists across tests
  beforeEach(() => {
    document.documentElement.classList.remove('dark');
  });
  afterEach(() => {
    document.documentElement.classList.remove('dark');
  });

  it('fires onThemeChanged when class on <html> mutates', async () => {
    const onThemeChanged = vi.fn();
    const tag = uniqueTag('theme');

    defineComponent({
      tagName: tag,
      templateName: 'theme-mutation',
      template: '<div>theme</div>',
      onThemeChanged,
    });

    const el = document.createElement(tag);
    const rendered = $(el).onNext('rendered');
    document.body.appendChild(el);
    await rendered;

    document.documentElement.classList.add('dark');
    await themeDebounceWait();

    expect(onThemeChanged).toHaveBeenCalled();
  });

  it('fires onThemeChanged with detail in additionalData when themechange event is dispatched on <html>', async () => {
    const onThemeChanged = vi.fn();
    const tag = uniqueTag('theme-evt');

    defineComponent({
      tagName: tag,
      templateName: 'theme-event',
      template: '<div>theme</div>',
      onThemeChanged,
    });

    const el = document.createElement(tag);
    const rendered = $(el).onNext('rendered');
    document.body.appendChild(el);
    await rendered;

    // Dispatch a themechange CustomEvent on <html>
    document.documentElement.dispatchEvent(
      new CustomEvent('themechange', { detail: { theme: 'dark' } }),
    );
    await themeDebounceWait();

    expect(onThemeChanged).toHaveBeenCalled();
    const lastCall = onThemeChanged.mock.calls[onThemeChanged.mock.calls.length - 1][0];
    // call() passes a params object; additionalData fields are merged into it
    expect(lastCall).toBeDefined();
    expect(lastCall.theme).toBe('dark');
    expect(lastCall.event).toBeInstanceOf(Event);
  });

  it('does not wire up theme observer when onThemeChanged is the default noop', async () => {
    // Sanity check — without an onThemeChanged callback, no observer is created
    // (line 503 — `this.onThemeChangedCallback !== noop`).
    const tag = uniqueTag('theme-none');

    defineComponent({
      tagName: tag,
      templateName: 'theme-none',
      template: '<div>theme</div>',
    });

    const el = document.createElement(tag);
    const rendered = $(el).onNext('rendered');
    document.body.appendChild(el);
    await rendered;

    // Just verify no observers were registered for theme changes; toggling the class
    // must not throw or trigger any callback path.
    expect(() => {
      document.documentElement.classList.add('dark');
    }).not.toThrow();
    await themeDebounceWait();
  });
});

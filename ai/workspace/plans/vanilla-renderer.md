# Vanilla Renderer Implementation Plan

## Goal

Replace the Lit rendering layer with a vanilla DOM renderer that has zero framework dependencies. The existing Lit renderer continues to work — this is additive, selected via `renderingEngine: 'vanilla'`.

## Current Architecture

```
defineComponent({ template, renderingEngine })
  │
  ├─ TemplateCompiler.compile(template) → AST        [renderer-agnostic]
  │
  ├─ new Template({ ast, renderingEngine: 'lit' })    [integration layer]
  │     └─ initialize() → new LitRenderer({ ast })    [Lit-specific]
  │           ├─ readAST() → walks AST nodes
  │           ├─ evaluateExpression() → resolves values
  │           └─ render() → Lit html`` tagged template
  │
  └─ class extends WebComponentBase (extends LitElement)  [Lit-specific]
        ├─ static properties → from spec
        ├─ willUpdate() → template.clone().initialize()
        ├─ render() → template.render() → Lit TemplateResult
        └─ Lit processes TemplateResult → DOM
              └─ Directives (one per dynamic binding):
                    ├─ reactiveData       → {expression}
                    ├─ reactiveConditional → {#if}
                    ├─ reactiveEach       → {#each} (uses Lit repeat())
                    ├─ reactiveAsync      → {#async}
                    ├─ reactiveRerender   → {#rerender}/{#guard}
                    └─ renderTemplate     → {> subtemplate}
```

### Key Observation: Two Rendering Models

**Lit model:** `render()` is called every update, returns a new TemplateResult, Lit diffs it against previous TemplateResult, patches DOM.

**Vanilla model:** `render()` is called once, creates DOM nodes, wires Reactions. After that, signals fire → Reactions update specific DOM nodes. No re-rendering, no diffing.

This is the fundamental architectural difference. The per-expression Reaction model that SUI already has (via the Lit directives) is doing the work that makes a virtual DOM/diffing layer unnecessary. The vanilla renderer makes that explicit.

---

## Lit Surface Area (What We're Replacing)

### In `@semantic-ui/renderer`
- `LitRenderer` class (renderer.js, ~730 lines)
- 6 Lit AsyncDirectives (reactive-data, reactive-conditional, reactive-each, reactive-async, reactive-rerender, render-template)
- Imports: `html`, `svg`, `nothing`, `noChange` from `lit`; `AsyncDirective`, `directive`, `PartType` from `lit/directive.js`; `repeat` from `lit/directives/repeat.js`; `ifDefined`, `unsafeHTML` from lit directives
- `peerDependencies: { "lit": "^3.0.0" }`

### In `@semantic-ui/component`
- `WebComponentBase extends LitElement` (web-component.js, ~370 lines)
- `import { unsafeCSS } from 'lit'` in define-component.js
- `static properties` system (Lit's reactive property declarations)
- Render lifecycle: `willUpdate`, `updated`, `firstUpdated`, `render()` returning TemplateResult

### In `@semantic-ui/templating`
- `import { LitRenderer } from '@semantic-ui/renderer'` in template.js
- Hard-coded `new LitRenderer(...)` in `Template.initialize()`

---

## Phase 0: Extract Shared Expression Evaluator

**Why first:** The expression evaluation logic in `LitRenderer` is 100% renderer-agnostic. Both renderers need it. Extracting it first prevents duplication and makes the LitRenderer itself cleaner.

### What to extract from LitRenderer into `ExpressionEvaluator`:

| Method | Purpose |
|--------|---------|
| `lookupExpressionValue()` | Core expression evaluator — token lookup, Lisp-style recursive evaluation |
| `lookupTokenValue()` | Single token resolution — literal, data context, JS fallback, helpers |
| `evaluateJavascript()` | `new Function` + `with` + Proxy for JS expressions |
| `getExpressionArray()` | Lisp-style tokenizer (regex-based parenthetical grouping) |
| `getDeepDataValue()` | Dot-notation path resolution with Signal auto-unwrap |
| `accessTokenValue()` | Signal unwrapping, function binding for dotted paths |
| `getLiteralValue()` | String/number/boolean literal detection |
| `addParensToExpression()` | Wraps `{}` and `[]` in parens for Lisp tokenizer |

### What stays in LitRenderer (Lit-specific):

| Method | Purpose |
|--------|---------|
| `addHTML()` / `addValue()` / `addHTMLSpacer()` | Tagged template literal construction |
| `render()` | Returns `html(...)` / `svg(...)` tagged template |
| Directive calls | `reactiveData()`, `reactiveConditional()`, etc. |

### Implementation

```
packages/renderer/src/
├── expression-evaluator.js    ← NEW: shared expression logic
├── lit/
│   ├── renderer.js            ← refactored: imports ExpressionEvaluator
│   └── directives/            ← unchanged
└── vanilla/
    └── renderer.js            ← NEW: imports ExpressionEvaluator
```

`ExpressionEvaluator` takes `{ data, helpers }` in constructor, exposes `evaluate(expression, data)` and `evaluateRaw(expression, data)` (returns value vs. returns function-wrapped value).

LitRenderer refactored to delegate: `this.evaluator = new ExpressionEvaluator({ data, helpers })`.

**Validation:** All existing renderer tests must pass after extraction with zero behavior change.

---

## Phase 1: VanillaRenderer

### 1.0 Renderer Interface Contract

Both renderers must satisfy:

```javascript
class Renderer {
  constructor({ ast, data, template, subTemplates, helpers, isSVG })
  render({ ast, data })          // First render → returns DOM-appendable result
  setData(newData)               // Update data context
  // cachedRender(data)          // For subtree caching (experimental, currently disabled)
}
```

For Lit, `render()` returns a Lit `TemplateResult`.
For vanilla, `render()` returns a `DocumentFragment` on first call. Subsequent calls are no-ops — Reactions handle updates.

### 1.1 Core: AST → DOM (First Render)

Walk the AST, produce DOM nodes, track dynamic regions with marker comments.

```javascript
readAST({ ast, data }) {
  const fragment = document.createDocumentFragment();
  for (const node of ast) {
    switch (node.type) {
      case 'html':
        // Parse HTML string to DOM nodes
        // Use template element for safe parsing:
        //   const tpl = document.createElement('template');
        //   tpl.innerHTML = htmlString;
        //   fragment.append(tpl.content.cloneNode(true));
        break;

      case 'expression':
        // Create reactive text binding (see 1.2)
        break;

      case 'if':
        // Create conditional region (see 1.3)
        break;

      case 'each':
        // Create list region (see 1.4)
        break;

      case 'async':
        // Create async region (see 1.5)
        break;

      case 'rerender':
        // Create rerender region (see 1.6)
        break;

      case 'template':
        // Render subtemplate (see 1.7)
        break;

      case 'snippet':
        // Register snippet for later use
        break;

      case 'slot':
        // Create <slot> element
        break;

      case 'svg':
        // Create SVG nodes (see 1.8)
        break;
    }
  }
  return fragment;
}
```

**HTML node batching:** The AST optimizer already joins adjacent HTML nodes. So each `html` node may contain a substantial HTML string. Use `<template>.innerHTML` for parsing — it handles all valid HTML including tables, SVG references, etc. without the parser quirks of `div.innerHTML`.

**Node tracking:** For dynamic regions, use paired Comment nodes as markers:
```html
<!--sui:if:start-->
  <div>conditional content</div>
<!--sui:if:end-->
```
Content between markers is owned by the Reaction that manages that region. On update, clear between markers, insert new content.

### 1.2 Reactive Bindings ({expression})

Each `{expression}` in the AST needs to resolve to a DOM binding that updates when its dependencies change.

**Text content binding:**
```javascript
const textNode = document.createTextNode('');
const reaction = Reaction.create(() => {
  const value = this.evaluator.evaluate(node.value, this.data);
  textNode.data = value ?? '';
});
this.reactions.push(reaction);
fragment.append(textNode);
```

**Attribute bindings:**
The tricky part — AST `expression` nodes that appear inside HTML attributes. The template compiler produces something like:
```
{ type: 'html', html: '<div class="' }
{ type: 'expression', value: 'className' }
{ type: 'html', html: '">' }
```

The Lit renderer handles this via tagged template literal interpolation — expressions naturally slot into attributes. For vanilla, we need to:

1. **During HTML parsing**, detect when an expression position falls inside an attribute value
2. **Buffer** the preceding HTML, find the element and attribute name, create an attribute binding instead of a text node

This is the single hardest part of the vanilla renderer. Options:

**Option A: Post-process approach**
Render HTML with placeholder tokens (`__SUI_EXPR_0__`), parse to DOM, then walk the DOM tree replacing placeholders with reactive bindings. For text content, replace placeholder text nodes. For attributes, set up `MutationObserver` or direct `setAttribute` calls in Reactions.

**Option B: Streaming parser approach**
Process AST nodes sequentially, tracking whether we're inside an HTML tag. When we encounter an expression inside a tag attribute, register it as an attribute binding. When outside tags, register as text content.

**Option C: Pre-analysis pass**
Before rendering, walk the AST to classify each expression as "text content" or "attribute value" based on surrounding HTML context. Then render accordingly.

**Recommendation: Option A (placeholder post-processing).** It's the simplest to implement correctly and handles all HTML edge cases (nested tags, self-closing, void elements) by delegating to the browser's HTML parser. The placeholder approach is also how several other non-Lit web component renderers work (uhtml, etc.).

Implementation sketch:
```javascript
// Build HTML string with placeholders
let htmlString = '';
const bindings = [];
for (const node of ast) {
  if (node.type === 'html') {
    htmlString += node.html;
  } else if (node.type === 'expression') {
    const id = bindings.length;
    htmlString += `<!--sui:expr:${id}-->`;
    bindings.push(node);
  }
  // ... other node types create their own markers
}

// Parse to DOM
const tpl = document.createElement('template');
tpl.innerHTML = htmlString;
const dom = tpl.content.cloneNode(true);

// Walk DOM, replace comment markers with reactive bindings
const walker = document.createTreeWalker(dom, NodeFilter.SHOW_COMMENT);
while (walker.nextNode()) {
  const comment = walker.currentNode;
  const match = comment.data.match(/^sui:expr:(\d+)$/);
  if (match) {
    const binding = bindings[parseInt(match[1])];
    // Create reactive text node or attribute binding
  }
}
```

**BUT** — comment markers won't work inside attributes (`<div class="<!--sui:expr:0-->">`). So for attribute detection, we need a different strategy:

**Hybrid approach:**
1. Use comment markers for child/text positions
2. Use unique string tokens for attribute positions: `<div class="__SUI_0__">`
3. After DOM parsing, TreeWalker for comments + `querySelectorAll('[*]')` scan for attribute tokens
4. Alternatively: regex-scan the HTML string to classify positions before parsing

This is the most implementation effort in the whole plan, but it's a solved problem with known patterns.

**Additional binding types to handle:**
- `ifDefined` — if value is falsy, remove the attribute entirely (`el.removeAttribute()`)
- `unsafeHTML` — set `el.innerHTML` instead of `textNode.data`
- Event bindings — expressions in event handler positions (`on-click={handler}`)
- Boolean attributes — `<div ?hidden={isHidden}>` → `el.toggleAttribute('hidden', value)`
- Property bindings — `.property={value}` → `el[property] = value`

### 1.3 Conditional Rendering ({#if}/{else if}/{else})

```javascript
// Create marker region
const startMarker = document.createComment('sui:if:start');
const endMarker = document.createComment('sui:if:end');
fragment.append(startMarker, endMarker);

// Current branch tracking
let currentBranchIndex = -1;

const reaction = Reaction.create(() => {
  const { matchIndex, content } = this.getBranch(node, data);

  // Only swap DOM if branch changed
  if (matchIndex !== currentBranchIndex) {
    currentBranchIndex = matchIndex;
    this.clearBetweenMarkers(startMarker, endMarker);
    if (content) {
      startMarker.after(content); // content is a DocumentFragment
    }
  }
});
```

**getBranch:** Same logic as `ReactiveConditionalDirective.getBranch()` — check condition, iterate branches, return matching content.

**clearBetweenMarkers helper:**
```javascript
clearBetweenMarkers(start, end) {
  let node = start.nextSibling;
  while (node && node !== end) {
    const next = node.nextSibling;
    node.remove();
    node = next;
  }
}
```

Content for each branch is produced by recursively calling `readAST` with the branch's `content` array. The result is a DocumentFragment that gets inserted.

**Cleanup concern:** When swapping branches, any Reactions owned by the removed branch's DOM need to be stopped. This requires each branch to track its own Reactions. Use a `ReactionScope` that groups Reactions and can be stopped/restarted as a unit.

### 1.4 List Rendering ({#each})

The hardest reactive DOM pattern. Needs efficient insert, remove, reorder without re-rendering the entire list.

**Requirements from current ReactiveEachDirective:**
- Keyed items (ID resolution via `_id`, `id`, `key`, `hash`, `value`, or index)
- Object iteration (converted to `[{key, value}]` array)
- `{else}` content for empty collections
- `as` aliasing and `indexAs` for custom variable names
- Data context injection per item (`{item, index}`)

**Implementation: `mapArray`-style reconciliation**

Use a keyed reconciliation algorithm. The core idea:

```javascript
const startMarker = document.createComment('sui:each:start');
const endMarker = document.createComment('sui:each:end');

// Map of key → { fragment, reactions, startMarker, endMarker }
let itemMap = new Map();
let currentKeys = [];

const reaction = Reaction.create(() => {
  const items = evaluator.evaluate(node.over, data) || [];
  const newKeys = items.map((item, i) => getItemID(item, i));

  // Reconcile
  const { toAdd, toRemove, toMove } = diffKeyedLists(currentKeys, newKeys);

  // Remove
  for (const key of toRemove) {
    const entry = itemMap.get(key);
    entry.reactions.forEach(r => r.stop());
    clearBetweenMarkers(entry.startMarker, entry.endMarker);
    entry.startMarker.remove();
    entry.endMarker.remove();
    itemMap.delete(key);
  }

  // Add new items
  for (const { key, index } of toAdd) {
    const item = items[index];
    const itemData = getEachData(item, index, node);
    const itemFragment = readAST({ ast: node.content, data: { ...data, ...itemData } });
    // Insert at correct position
    const refNode = getInsertionPoint(index, newKeys, itemMap, endMarker);
    // Wrap in markers for future removal
    const itemStart = document.createComment(`sui:each-item:${key}`);
    const itemEnd = document.createComment(`sui:each-item-end:${key}`);
    refNode.before(itemStart, itemFragment, itemEnd);
    itemMap.set(key, { startMarker: itemStart, endMarker: itemEnd, reactions: [...] });
  }

  // Reorder (move existing items to correct positions)
  for (const { key, newIndex } of toMove) {
    // Move markers + content to new position
  }

  currentKeys = newKeys;
});
```

**Existing art:** Solid.js `mapArray` (~200 lines), uhtml's list diffing, or a minimal implementation of the Ivi list reconciliation algorithm. Don't need a full VDOM diff — just keyed list reconciliation.

**`getItemID`:** Reuse existing logic from `ReactiveEachDirective.getItemID()` — checks `_id`, `id`, `key`, `hash`, `value`, then falls back to index.

**`getEachData`:** Reuse existing logic from `ReactiveEachDirective.getEachData()` — handles `as` aliasing, `indexAs`, object→array conversion.

### 1.5 Async Blocks ({#async})

Same marker pattern as conditionals, with three states:

```javascript
const startMarker = document.createComment('sui:async:start');
const endMarker = document.createComment('sui:async:end');
let currentState = 'loading';

const reaction = Reaction.create(() => {
  const result = evaluator.evaluate(node.expression, data);

  if (isPromise(result)) {
    // Show loading content
    if (node.loadingContent?.length) {
      this.clearBetweenMarkers(startMarker, endMarker);
      const loadingFragment = readAST({ ast: node.loadingContent, data });
      startMarker.after(loadingFragment);
    }

    result.then(value => {
      currentState = 'success';
      const successData = createSuccessDataContext(node, value);
      this.clearBetweenMarkers(startMarker, endMarker);
      const contentFragment = readAST({ ast: node.content, data: { ...data, ...successData } });
      startMarker.after(contentFragment);
    }).catch(error => {
      currentState = 'error';
      if (node.errorContent?.length) {
        const errorData = node.errorAs ? { [node.errorAs]: error } : { this: error };
        this.clearBetweenMarkers(startMarker, endMarker);
        const errorFragment = readAST({ ast: node.errorContent, data: { ...data, ...errorData } });
        startMarker.after(errorFragment);
      }
    });
  } else {
    // Synchronous value
    currentState = 'success';
    const successData = createSuccessDataContext(node, result);
    this.clearBetweenMarkers(startMarker, endMarker);
    const contentFragment = readAST({ ast: node.content, data: { ...data, ...successData } });
    startMarker.after(contentFragment);
  }
});
```

**`createSuccessDataContext`:** Reuse logic from `ReactiveAsyncDirective` — handles `as` aliasing, destructuring (`parts`/`rest`).

### 1.6 Rerender/Guard Blocks ({#rerender}, {#guard})

These force a full re-render of a template region when specific reactive dependencies change.

```javascript
const startMarker = document.createComment('sui:rerender:start');
const endMarker = document.createComment('sui:rerender:end');

// Initial render
const initialFragment = readAST({ ast: node.content, data });
fragment.append(startMarker, initialFragment, endMarker);

const reaction = Reaction.create((computation) => {
  // Touch reactive dependencies
  if (node.key) {
    Reaction.guard(() => evaluator.evaluate(node.key, data));
  }
  if (node.expression) {
    evaluator.evaluate(node.expression, data);
  }

  if (!computation.firstRun) {
    // Stop child reactions, clear DOM, re-render
    this.clearBetweenMarkers(startMarker, endMarker);
    const newFragment = readAST({ ast: node.content, data });
    startMarker.after(newFragment);
  }
});
```

### 1.7 Subtemplate Rendering ({> templateName})

Subtemplates are full Template instances with their own lifecycle. The vanilla renderer creates them the same way the Lit `RenderTemplateDirective` does:

1. Resolve template name (may be a string from `subTemplates` or a `Template` instance from an expression)
2. Clone the template with data context
3. Initialize and render into a marker region
4. Set parent relationship for `findParent`/`findChild` traversal
5. Attach events and styles via `template.attach()`

```javascript
const startMarker = document.createComment('sui:template:start');
const endMarker = document.createComment('sui:template:end');

const reaction = Reaction.create(() => {
  const templateOrName = evaluator.evaluate(node.name, data);
  const templateData = unpackNodeData(node, data);

  // Resolve template
  let template;
  if (isString(templateOrName)) {
    template = subTemplates[templateOrName];
  } else if (templateOrName instanceof Template) {
    template = templateOrName;
  }

  if (!template) return;

  // Clone and render
  const instance = template.clone({ data: templateData });
  instance.initialize();
  const fragment = instance.render(); // VanillaRenderer returns DocumentFragment

  this.clearBetweenMarkers(startMarker, endMarker);
  startMarker.after(fragment);

  // Attach for events and parent/child tracking
  instance.attach(renderRoot, { parentNode, startNode: startMarker, endNode: endMarker });
  instance.setParent(parentTemplate);
});
```

**Key difference from other blocks:** Subtemplates are full `Template` instances with their own renderer, reactions, events, and lifecycle. When they're removed from DOM, their `onDestroyed` must be called.

### 1.8 SVG Handling

SVG elements must be created with `document.createElementNS('http://www.w3.org/2000/svg', tagName)`. The AST marks SVG regions with `{ type: 'svg', content: [...] }`.

For the placeholder approach: when building the HTML string, SVG content needs to be inside an `<svg>` context for the HTML parser to create the correct namespace. The template compiler already wraps SVG content between `<svg>` open/close HTML nodes, so the HTML string will parse correctly. Just need to ensure the TreeWalker processes SVG subtrees.

For direct DOM creation: pass `isSVG: true` through recursive calls, use `createElementNS` instead of `createElement`.

---

## Phase 2: VanillaComponentBase

### 2.1 Core Class

```javascript
class VanillaComponentBase extends HTMLElement {
  static shadowRootOptions = { mode: 'open', delegatesFocus: false };

  constructor() {
    super();
    this.renderCallbacks = [];
    this._dirty = false;
  }

  connectedCallback() {
    this.attachShadow(VanillaComponentBase.shadowRootOptions);
    this._scheduleUpdate();
  }

  disconnectedCallback() {
    if (this.template) {
      this.template.onDestroyed();
      delete this.template;
      delete this.component;
      delete this.dataContext;
    }
  }

  attributeChangedCallback(attribute, oldValue, newValue) {
    adjustPropertyFromAttribute({ el: this, attribute, ... });
    if (this.shadowRoot) {
      this._scheduleUpdate();
    }
  }

  adoptedCallback() {
    // handle document move
  }
}
```

### 2.2 Property/Attribute System

Replace Lit's `static properties` with native `observedAttributes` + manual property accessors.

```javascript
// In defineComponent, after building properties from spec:
static get observedAttributes() {
  return Object.entries(properties)
    .filter(([_, config]) => config.attribute !== false)
    .map(([name]) => camelToKebab(name));
}
```

For each property, generate a getter/setter pair:
```javascript
// During class definition (in defineComponent)
for (const [name, config] of Object.entries(properties)) {
  if (!config.noAccessor) {
    Object.defineProperty(webComponent.prototype, name, {
      get() { return this[`_${name}`] ?? config.default; },
      set(value) {
        const old = this[`_${name}`];
        if (!config.hasChanged || config.hasChanged(value, old)) {
          this[`_${name}`] = value;
          this._scheduleUpdate();
        }
      }
    });
  }
}
```

**Boolean attribute handling:** The existing `adjustPropertyFromAttribute` already handles boolean shorthand from spec. Keep it.

**Type conversion:** Replace Lit's converter system. The existing `getPropertySettings` already defines converters for Boolean (handles 'false', '0', etc.). Move converter logic into `attributeChangedCallback`:
```javascript
attributeChangedCallback(attribute, oldValue, newValue) {
  const propName = kebabToCamel(attribute);
  const config = properties[propName];
  if (config?.converter) {
    newValue = config.converter.fromAttribute(newValue, config.type);
  }
  this[propName] = newValue;
}
```

### 2.3 Render Lifecycle

Replace Lit's `willUpdate → render → updated → firstUpdated` with microtask-based scheduling.

```javascript
_scheduleUpdate() {
  if (!this._dirty) {
    this._dirty = true;
    queueMicrotask(() => this._performUpdate());
  }
}

_performUpdate() {
  this._dirty = false;

  if (!this.template) {
    // First render
    this._initializeTemplate();
    const fragment = this.template.render(this.getData());
    this.shadowRoot.append(fragment);
    this._firstUpdated();
  } else {
    // Subsequent updates — just update data context
    // Reactions handle DOM updates
    this.template.renderer.setData(this.getData());
  }

  this._updated();
}

_initializeTemplate() {
  // Same logic as current willUpdate()
  this.template = litTemplate.clone({
    data: this.getData(),
    element: this,
    renderRoot: this.shadowRoot,
  });
  this.template.initialize();
  this.component = this.template.instance;
  this.dataContext = this.template.getDataContext();
}

_updated() {
  for (const callback of this.renderCallbacks) callback();
}

_firstUpdated() {
  // any first-render-only logic
}
```

**Key insight:** After first render, the vanilla model doesn't re-render the template. Data context updates flow through Reactions automatically. The `_performUpdate` for subsequent calls just ensures the data context is current — the Reactions pick up changes via signal dependencies.

### 2.4 Style Adoption

Replace `static get styles()` + Lit's `unsafeCSS` with native `adoptedStyleSheets`:

```javascript
_adoptStyles(css) {
  if (!css) return;
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(css);
  this.shadowRoot.adoptedStyleSheets = [sheet];
}
```

Called once in `_initializeTemplate()` after shadow root creation.

For `pageCSS` (styles applied to the document, not shadow DOM): the existing `adoptStylesheet` utility from `@semantic-ui/utils` already handles this and has no Lit dependency.

### 2.5 Shared Logic

The following methods from `WebComponentBase` are renderer-agnostic and should be shared (via mixin, base class, or copy):

| Method | Location | Notes |
|--------|----------|-------|
| `createSettingsProxy()` | web-component.js:237 | Proxy with Signal-backed reactivity |
| `setDefaultSettings()` | web-component.js:184 | Merges spec defaults |
| `getSettingsFromConfig()` | web-component.js:209 | Reads properties from element |
| `getUIClasses()` | web-component.js:281 | Generates CSS classes from spec attributes |
| `isDarkMode()` | web-component.js:329 | Query-based dark mode detection |
| `getProperties()` | web-component.js:45 | Builds property map from spec |
| `getPropertySettings()` | web-component.js:129 | Type conversion config |
| `$()` / `$$()` | web-component.js:340-350 | Shadow DOM query helpers |

**Approach:** Extract into `ComponentMixin` or `ComponentHelpers` module. Both `WebComponentBase` (now `LitComponentBase`) and `VanillaComponentBase` import and use it.

---

## Phase 3: Integration

### 3.1 Template Class Changes

`template.js` currently hard-imports `LitRenderer`. Change to conditional:

```javascript
// Option A: dynamic import (lazy loading)
initialize() {
  if (this.renderingEngine === 'vanilla') {
    import('@semantic-ui/renderer/vanilla').then(({ VanillaRenderer }) => {
      this.renderer = new VanillaRenderer({ ast, data, ... });
    });
  } else {
    this.renderer = new LitRenderer({ ast, data, ... });
  }
}

// Option B: renderer passed in (preferred — no dynamic import, tree-shakeable)
initialize() {
  const RendererClass = this.rendererClass || LitRenderer;
  this.renderer = new RendererClass({ ast, data, template: this, subTemplates, helpers });
}
```

**Option B is better** — the renderer class is passed through from `defineComponent`, which knows the rendering engine. This makes the renderer tree-shakeable: if you only use vanilla, Lit is never imported.

### 3.2 defineComponent Changes

```javascript
export const defineComponent = ({
  renderingEngine = 'lit',  // or 'vanilla'
  // ... existing params
}) => {
  // Select base class
  const BaseClass = renderingEngine === 'vanilla'
    ? VanillaComponentBase
    : LitComponentBase;

  // Select renderer class (passed to Template)
  const RendererClass = renderingEngine === 'vanilla'
    ? VanillaRenderer
    : LitRenderer;

  // ... rest of defineComponent, using BaseClass and RendererClass
};
```

### 3.3 Package Structure

```
packages/renderer/src/
├── index.js                    ← exports both renderers
├── expression-evaluator.js     ← shared expression logic
├── lit/
│   ├── renderer.js             ← LitRenderer (refactored)
│   └── directives/             ← unchanged
└── vanilla/
    ├── renderer.js             ← VanillaRenderer
    ├── bindings.js             ← reactive DOM bindings (text, attribute, event)
    ├── list-reconciler.js      ← keyed list diffing for {#each}
    └── region.js               ← marker-based DOM region management

packages/component/src/
├── define-component.js         ← modified: renderer/base class selection
├── web-component.js            ← renamed to lit-component-base.js
├── vanilla-component-base.js   ← NEW
├── component-helpers.js        ← NEW: shared logic extracted from web-component.js
└── helpers/
    └── adjust-property-from-attribute.js  ← unchanged
```

### 3.4 Renderer Package Exports

```javascript
// packages/renderer/src/index.js
export { LitRenderer } from './lit/renderer.js';
export { VanillaRenderer } from './vanilla/renderer.js';
export { ExpressionEvaluator } from './expression-evaluator.js';
// ... existing directive exports for Lit users
```

Consider subpath exports for tree-shaking:
```json
{
  "exports": {
    ".": "./src/index.js",
    "./lit": "./src/lit/renderer.js",
    "./vanilla": "./src/vanilla/renderer.js"
  }
}
```

---

## Phase 4: Implementation Order

### Step 1: Extract ExpressionEvaluator (low risk, high value)
- Extract from LitRenderer
- LitRenderer delegates to it
- All existing tests pass
- **No behavior change**

### Step 2: Extract ComponentHelpers (low risk)
- Move shared methods from WebComponentBase to mixin/helpers
- Rename WebComponentBase → LitComponentBase
- LitComponentBase imports helpers
- All existing tests pass
- **No behavior change**

### Step 3: VanillaRenderer — HTML + expressions only
- Implement `readAST` for `html` and `expression` node types
- Placeholder-based attribute detection
- Reactive text and attribute bindings
- **Testable independently** with simple templates

### Step 4: VanillaRenderer — conditionals and rerender
- `{#if}/{else if}/{else}` with marker-based DOM swapping
- `{#rerender}/{#guard}` blocks
- **Testable** with conditional templates

### Step 5: VanillaRenderer — each (lists)
- Keyed list reconciliation
- Object iteration
- Empty list `{else}` handling
- **This is the hardest step** — budget accordingly

### Step 6: VanillaRenderer — async and subtemplates
- `{#async}` with loading/error/success states
- `{> template}` rendering with full lifecycle
- Snippet rendering

### Step 7: VanillaComponentBase
- HTMLElement subclass with property system
- Microtask-based render scheduling
- Style adoption
- Wire up with VanillaRenderer

### Step 8: defineComponent integration
- Renderer/base class selection via `renderingEngine` param
- Template class accepts renderer class
- End-to-end testing

### Step 9: SVG, edge cases, and polish
- SVG namespace handling
- `unsafeHTML` binding type
- `ifDefined` binding type
- Event handler bindings in templates
- CSP considerations (the `new Function`/`with` pattern is shared — not a vanilla-specific issue)

---

## Risks and Open Questions

### Attribute Binding Detection
The placeholder approach for detecting attribute vs text positions is the biggest implementation risk. The Lit renderer avoids this entirely because tagged template literals inherently know their binding positions (string parts vs expression parts). The vanilla renderer must reconstruct this from a flat HTML string + expression sequence.

**Mitigation:** Prototype this first. If the placeholder approach is too fragile, consider modifying the AST to explicitly classify expression positions (requires template compiler changes but would be the cleanest solution long-term).

### Reaction Cleanup on Branch Swap
When `{#if}` swaps branches or `{#each}` removes items, all Reactions owned by the removed DOM must be stopped. This requires hierarchical Reaction tracking — each dynamic region tracks its child Reactions.

**Mitigation:** Implement a `ReactionScope` class that groups Reactions and can be disposed as a unit. Each conditional branch, each list item, each rerender block gets its own scope.

### Performance vs Lit
Lit's tagged template literal approach is highly optimized — the browser caches the template parse result, and Lit only diffs expression values. The vanilla renderer creates DOM nodes directly, which may be slower for first render of large templates.

However: the vanilla renderer's update path should be faster (signal → DOM write, no intermediate diff). Net performance likely depends on the ratio of first-renders to updates.

**Mitigation:** Benchmark both renderers on the same set of components. The existing `docs/src/examples/` provide good test cases.

### Template.render() Return Type
Currently `Template.render()` returns a Lit `TemplateResult` which is consumed by `LitElement.render()`. For vanilla, it would return a `DocumentFragment` (first render) or `undefined` (subsequent renders, since Reactions handle updates).

The return type divergence means code that consumes `template.render()` needs to know which renderer it's using. This is contained to `defineComponent` — the web component base class knows its own rendering model.

### SSR
The vanilla renderer is browser-first. `isServer` checks exist throughout the codebase. SSR with the vanilla renderer would require a DOM shim (like `linkedom` or `happy-dom`). The Lit renderer already handles SSR via Lit's SSR package.

**Recommendation:** SSR is out of scope for initial vanilla renderer. Keep Lit renderer as the SSR target.

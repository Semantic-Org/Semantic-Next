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

### 1.0 Signal-Based Binding Primitive

All bindings use `Signal.computed` + `signal.subscribe` rather than raw Reactions. This provides:

- **Automatic deduplication** — `Signal.computed` uses `isEqual` internally. If a dependency fires but the computed value is unchanged, subscribers don't run. No manual `if (old !== new)` guards.
- **Composability** — `signal.derive()` chains transformations (e.g., object→array conversion for `{#each}`).
- **Built-in cleanup** — `subscribe` returns a Reaction. `reaction.stop()` is the entire cleanup API.
- **Debuggable** — Each binding has an inspectable Signal with `peek()`, `setContext()`, debug tracing.
- **Consistent** — Components use Signals for state. The renderer uses Signals for bindings. Same primitives everywhere.

Pattern for every binding type:

```javascript
// 1. Computed signal evaluates expression with deduplication
const value = Signal.computed(() => evaluator.evaluate(expr, data));

// 2. Subscribe writes to DOM only when value actually changes
const reaction = value.subscribe((v) => { /* DOM write */ });

// 3. Cleanup via ReactionScope
scope.track(reaction);
```

Cost: one additional lightweight object (computed Signal) per binding. Negligible against the DOM nodes they're bound to.

### 1.0b Renderer Interface Contract

Both renderers must satisfy:

```javascript
class Renderer {
  constructor({ ast, data, template, subTemplates, snippets, helpers, isSVG, inheritsData })
  render({ ast, data })          // First render → returns renderable result
  setData(newData)               // Update data context
  // cachedRender(data)          // For subtree caching (experimental, currently disabled)
}
```

Note: `Template.initialize()` currently passes `{ ast, data, template, subTemplates, helpers }` — it does not pass `snippets` (the renderer discovers them from AST nodes) or `inheritsData` (only used internally by LitRenderer when creating subtree renderers via `renderContent()`). The vanilla renderer handles subtrees differently — recursive `readAST` calls with scoped Reactions — so `inheritsData` and `renderContent` are Lit-specific patterns that don't carry over.

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

**DOM Position Tracking: No Comment Markers**

Lit litters the DOM with `<!--lit-part-->` comment pairs for every binding. The vanilla renderer avoids this entirely:

- **Expressions** need zero markers — hold a direct reference to the Text node or element. `textNode.data = value` or `el.setAttribute(name, value)`.
- **Block regions** (`{#if}`, `{#each}`, `{#async}`, `{#rerender}`) need a positional anchor only when empty (to know where to insert when content appears). Use a **single empty Text node** — invisible in rendered output, barely visible in dev tools.

```javascript
class DynamicRegion {
  constructor() {
    this.anchor = document.createTextNode('');  // invisible position marker
    this.ownedNodes = [];                        // tracked for cleanup
    this.childScopes = [];                       // nested ReactionScopes
  }

  clear() {
    for (const scope of this.childScopes) scope.dispose();
    this.childScopes = [];
    for (const node of this.ownedNodes) node.remove();
    this.ownedNodes = [];
  }

  setContent(fragment, scope) {
    this.clear();
    this.ownedNodes = [...fragment.childNodes];
    if (scope) this.childScopes.push(scope);
    this.anchor.after(fragment);
  }
}
```

For a component with 15 expressions, 2 conditionals, and 1 each loop:
- **Lit**: ~36 comment nodes (paired markers for every binding)
- **Vanilla**: 3 invisible empty text nodes (only for block-level regions)

### 1.2 Reactive Bindings ({expression})

Each `{expression}` in the AST needs to resolve to a DOM binding that updates when its dependencies change.

**Text content binding:**
```javascript
const textNode = document.createTextNode('');
const value = Signal.computed(() => this.evaluator.evaluate(node.value, this.data));
const reaction = value.subscribe((v) => { textNode.data = v ?? ''; });
scope.track(reaction);
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
const region = new DynamicRegion();
fragment.append(region.anchor);

let currentBranchIndex = -1;

const reaction = Reaction.create(() => {
  const { matchIndex, contentAST } = this.getBranch(node, data);

  if (matchIndex !== currentBranchIndex) {
    currentBranchIndex = matchIndex;
    if (contentAST) {
      const scope = new ReactionScope();
      const branchFragment = this.readAST({ ast: contentAST, data, scope });
      region.setContent(branchFragment, scope);
    } else {
      region.clear();
    }
  }
});
```

**getBranch:** Same logic as `ReactiveConditionalDirective.getBranch()` — check condition, iterate branches, return matching AST content array.

**ReactionScope:** Groups Reactions created during a `readAST` call. When the region is cleared (branch swap), `scope.dispose()` stops all Reactions owned by that branch. This prevents leaked Reactions from removed DOM.

```javascript
class ReactionScope {
  constructor() { this.reactions = []; }
  track(reaction) { this.reactions.push(reaction); }
  dispose() { for (const r of this.reactions) r.stop(); this.reactions = []; }
}
```

All Reaction creation inside `readAST` goes through the current scope, so cleanup is hierarchical.

### 1.4 List Rendering ({#each})

The hardest reactive DOM pattern. Needs efficient insert, remove, reorder without re-rendering the entire list.

**Requirements from current ReactiveEachDirective:**
- Keyed items (ID resolution via `_id`, `id`, `key`, `hash`, `value`, or index)
- Object iteration (converted to `[{key, value}]` array)
- `{else}` content for empty collections
- `as` aliasing and `indexAs` for custom variable names
- Data context injection per item (`{item, index}`)

**Implementation: `mapArray`-style reconciliation with per-item reactivity**

Use a keyed reconciliation algorithm. Each item is a `DynamicRegion` tracked by key, with a **Signal-backed data channel** so inner Reactions update when item data changes.

**The data update problem:** In Lit, the each Reaction re-renders ALL items and `repeat()` diffs per key — data updates happen naturally. In vanilla, we don't re-render existing items (no diff layer). So each item needs a reactive data channel: a Signal holding the item's data context. Inner expressions subscribe to it during first render. When the collection changes and an existing item has new data, we update the Signal and inner Reactions fire automatically.

```javascript
const listRegion = new DynamicRegion();
fragment.append(listRegion.anchor);

// Map of key → { region, itemSignal, scope }
let itemMap = new Map();
let currentKeys = [];

const reaction = Reaction.create(() => {
  const items = evaluator.evaluate(node.over, data) || [];

  // Handle empty list → {else} content
  if (isEmpty(items) && node.elseContent) {
    listRegion.clear();
    for (const entry of itemMap.values()) entry.scope.dispose();
    itemMap.clear();
    currentKeys = [];
    const scope = new ReactionScope();
    const elseFragment = this.readAST({ ast: node.elseContent, data, scope });
    listRegion.setContent(elseFragment, scope);
    return;
  }

  const collectionType = getCollectionType(items);
  const processedItems = (collectionType === 'object') ? arrayFromObject(items) : items;
  const newKeys = processedItems.map((item, i) => getItemID(item, i, collectionType));

  // Remove items no longer present
  for (const key of currentKeys) {
    if (!newKeys.includes(key)) {
      const entry = itemMap.get(key);
      entry.scope.dispose();
      entry.region.clear();
      entry.region.anchor.remove();
      itemMap.delete(key);
    }
  }

  // Add/reorder/update items
  let insertAfter = listRegion.anchor;
  for (let i = 0; i < newKeys.length; i++) {
    const key = newKeys[i];
    const item = processedItems[i];
    const eachData = getEachData(item, i, collectionType, node);

    if (itemMap.has(key)) {
      // Existing item — update data + move to correct position if needed
      const entry = itemMap.get(key);

      // Update per-item Signal → inner Reactions fire, DOM updates in place
      entry.itemSignal.set(eachData);

      const { region } = entry;
      if (region.anchor.previousSibling !== insertAfter &&
          region.anchor !== insertAfter) {
        insertAfter.after(region.anchor, ...region.ownedNodes);
      }
      insertAfter = region.ownedNodes.length
        ? region.ownedNodes[region.ownedNodes.length - 1]
        : region.anchor;
    } else {
      // New item — create Signal, render, track
      const itemRegion = new DynamicRegion();
      const scope = new ReactionScope();

      // Signal holds item-specific data; inner expressions subscribe via Proxy
      const itemSignal = Signal.create(eachData);
      const itemProxy = createItemDataProxy(data, itemSignal);

      const itemFragment = this.readAST({
        ast: node.content,
        data: itemProxy,
        scope,
      });
      itemRegion.ownedNodes = [...itemFragment.childNodes];
      itemRegion.childScopes.push(scope);
      insertAfter.after(itemRegion.anchor, itemFragment);
      itemMap.set(key, { region: itemRegion, itemSignal, scope });
      insertAfter = itemRegion.ownedNodes.length
        ? itemRegion.ownedNodes[itemRegion.ownedNodes.length - 1]
        : itemRegion.anchor;
    }
  }

  currentKeys = newKeys;
});
```

**`createItemDataProxy` — the per-item reactive bridge:**

```javascript
function createItemDataProxy(parentData, itemSignal) {
  return new Proxy(parentData, {
    get(target, prop) {
      const itemData = itemSignal.value; // establishes Signal dependency
      if (prop in itemData) return itemData[prop];
      return target[prop]; // fall through to parent data
    },
    has(target, prop) {
      const itemData = itemSignal.peek();
      return (prop in itemData) || (prop in target);
    }
  });
}
```

When `readAST` creates a computed signal for an expression like `{name}`:
```javascript
const value = Signal.computed(() => evaluator.evaluate('name', itemProxy));
```
The evaluator accesses `itemProxy.name` → Proxy get trap → `itemSignal.value.name` → establishes dependency on `itemSignal`. When the collection Reaction updates the item (`entry.itemSignal.set(newData)`), the computed re-evaluates, and `Signal.computed`'s built-in `isEqual` deduplication prevents unnecessary DOM writes if the value didn't actually change.

**Cost:** One Signal + one Proxy per list item. Negligible against the DOM nodes they contain.

**Existing art:** Solid.js `mapArray` (~200 lines), uhtml's list diffing, or a minimal implementation of the Ivi list reconciliation algorithm. Don't need a full VDOM diff — just keyed list reconciliation.

**`getItemID`:** Reuse existing logic from `ReactiveEachDirective.getItemID()` — checks `_id`, `id`, `key`, `hash`, `value`, then falls back to index. Note: for objects from object iteration, the object key (`indexOrKey`) is preferred over item properties.

**`getEachData`:** Reuse existing logic from `ReactiveEachDirective.getEachData()` — handles `as` aliasing, `indexAs`, object→array conversion.

### 1.5 Async Blocks ({#async})

Uses `DynamicRegion` — same pattern as conditionals, with three states:

```javascript
const region = new DynamicRegion();
fragment.append(region.anchor);

const renderState = (ast, extraData = {}) => {
  const scope = new ReactionScope();
  const stateFragment = this.readAST({ ast, data: { ...data, ...extraData }, scope });
  region.setContent(stateFragment, scope);
};

const reaction = Reaction.create(() => {
  const result = evaluator.evaluate(node.expression, data);

  if (isPromise(result)) {
    if (node.loadingContent?.length) renderState(node.loadingContent);

    result.then(value => {
      renderState(node.content, createSuccessDataContext(node, value));
    }).catch(error => {
      if (node.errorContent?.length) {
        const errorData = node.errorAs ? { [node.errorAs]: error } : { this: error };
        renderState(node.errorContent, errorData);
      }
    });
  } else {
    renderState(node.content, createSuccessDataContext(node, result));
  }
});
```

**`createSuccessDataContext`:** Reuse logic from `ReactiveAsyncDirective` — handles `as` aliasing, destructuring (`parts`/`rest`).

### 1.6 Rerender/Guard Blocks ({#rerender}, {#guard})

These force a full re-render of a template region when specific reactive dependencies change.

```javascript
const region = new DynamicRegion();
fragment.append(region.anchor);

// Initial render
const initialScope = new ReactionScope();
const initialFragment = this.readAST({ ast: node.content, data, scope: initialScope });
region.ownedNodes = [...initialFragment.childNodes];
region.childScopes.push(initialScope);
region.anchor.after(initialFragment);

const reaction = Reaction.create((computation) => {
  // Touch reactive dependencies to subscribe
  if (node.key) {
    Reaction.guard(() => evaluator.evaluate(node.key, data));
  }
  if (node.expression) {
    evaluator.evaluate(node.expression, data);
  }

  if (!computation.firstRun) {
    const scope = new ReactionScope();
    const newFragment = this.readAST({ ast: node.content, data, scope });
    region.setContent(newFragment, scope);
  }
});
```

### 1.7 Subtemplate Rendering ({> templateName})

Subtemplates are full Template instances with their own lifecycle. This is **Pattern B** — distinct from inline AST subtrees (Pattern A, handled by recursive `readAST`).

**The central challenge: dynamic template names.** Unlike most frameworks, SUI permits the template name to be a reactive expression: `{> templateName name=getName data=getData}` where `getName` can return different template names over time. The subtemplate must swap entirely when the name changes, but only update data when the name stays the same. Both the name expression AND the data expressions are reactive and tracked by the same Reaction.

**How the Lit renderer handles this:**
`RenderTemplateDirective.maybeCreateTemplate()` unconditionally clones a new Template on every Reaction run (render-template.js:107). There's no guard — even if only data changed and the template name is the same, it creates a fresh clone. This works in Lit because Lit diffs the new TemplateResult against the old one, so DOM updates are minimal. The cost is creating and discarding Template/Renderer instances on every reactive tick — wasteful but correct because Lit absorbs it.

**Why vanilla can't do this:** Cloning creates a fresh Template with a fresh VanillaRenderer. `render()` returns a new DocumentFragment. `region.setContent()` would tear down ALL existing DOM, Reactions, and event bindings, then rebuild from scratch — turning every subtemplate into a `{#rerender}` block. A data change on a parent signal would cascade into full destruction and reconstruction of every subtemplate.

**The fix — separate identity from data:**

```javascript
const region = new DynamicRegion();
fragment.append(region.anchor);

let currentTemplateID = null;
let currentInstance = null;

const reaction = Reaction.create(() => {
  const templateOrName = evaluator.evaluate(node.name, data);
  const templateData = unpackNodeData(node, data);

  // Resolve source template
  let template;
  let templateName;
  if (isString(templateOrName)) {
    templateName = templateOrName;
    template = subTemplates[templateName];
  } else if (templateOrName instanceof Template) {
    template = templateOrName;
    templateName = template.templateName;
  }

  if (!template) {
    // Template not found — clear region
    if (currentInstance) {
      currentInstance.onDestroyed();
      currentInstance = null;
      currentTemplateID = null;
      region.clear();
    }
    return;
  }

  if (template.id !== currentTemplateID) {
    // Template identity changed — tear down old, clone and render new
    if (currentInstance) {
      currentInstance.onDestroyed();
    }

    currentTemplateID = template.id;
    currentInstance = template.clone({
      templateName,
      subTemplates,
      data: templateData,
    });
    currentInstance.initialize();
    const templateFragment = currentInstance.render();

    region.setContent(templateFragment);

    // Attach for events and parent/child tracking
    currentInstance.attach(renderRoot, {
      parentNode,
      startNode: region.anchor,
      endNode: null,
    });
    currentInstance.setParent(parentTemplate);
  } else {
    // Same template, data changed — update data context on existing instance
    currentInstance.setDataContext(templateData);
  }
});
```

**Key behaviors:**
- **Reactive tracking:** `evaluator.evaluate(node.name, data)` inside the Reaction establishes reactive dependencies on whatever signals the name expression touches. When `getName` returns `"foo"` → `"bar"`, the Reaction re-fires. Similarly, `unpackNodeData(node, data)` tracks reactive data expressions. Both are tracked by the same Reaction — any change triggers re-evaluation, but the `template.id` guard ensures only name changes cause re-cloning.
- **Template identity change** (e.g., `getName` returns a different template name): `subTemplates["foo"].id !== subTemplates["bar"].id` → old instance is destroyed, new clone is created and rendered.
- **Data change only** (same template, new data): `template.id === currentTemplateID` → calls `setDataContext()` on the existing instance. The subtemplate's own Reactions pick up the new data and update DOM in place. No DOM destruction.
- **Template instance via expression:** If the expression returns a `Template` object directly (not a string), the same `template.id` check applies. Stable prototype reference → data update. Different prototype → re-clone.
- **Cleanup:** `currentInstance.onDestroyed()` handles Template lifecycle cleanup (reactions, events, `Template.renderedTemplates` registry).
- **Packed data:** In Lit, `getPackedNodeData()` wraps values in functions (`() => evaluateExpression(...)`) for lazy/reactive evaluation. For vanilla, `unpackNodeData()` evaluates eagerly since the Reaction already tracks dependencies.

**Why subtemplates must be full Template instances (not simplified to readAST):**
The `Template` wrapper is required for the communication system — `findParent()`, `findChildren()`, `dispatchEvent`, parent-child traversal via `setParent()`. This is how composite components coordinate (e.g., a data-table row template calling `findParent('uiDataTable')` to access table state). Subtemplates that are just recursive `readAST` calls would be invisible to this system. Every `{> name}` must produce a real Template instance.

**Note on snippets:** Snippets (`{> snippet name}`) use Pattern A (inline AST subtrees via `renderContent()`) in the Lit renderer. They are NOT full Templates — just AST sub-sections rendered with `readAST`. They don't participate in `findParent()`/`findChildren()` traversal. The vanilla plan handles these correctly via recursive `readAST` with `inheritsData: true`.

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
      this.template.onDestroyed(); // destroy instance
      delete this.template;
      delete this.component;
      delete this.dataContext;
    }
    // Prototype template cleanup — matches LitComponentBase behavior.
    // The closure-scoped `litTemplate` (the prototype) also needs
    // onDestroyed() called for the global Template.renderedTemplates registry.
    // This is wired up in defineComponent where `litTemplate` is in scope.
  }

  attributeChangedCallback(attribute, oldValue, newValue) {
    adjustPropertyFromAttribute({ el: this, attribute, ... });
    if (this.shadowRoot) {
      this._scheduleUpdate();
    }
  }

  // Public API — called by:
  //   - Template.call() params as `rerender: () => this.element.requestUpdate()`
  //   - adjustPropertyFromAttribute() for special attrs (disabled, value)
  // Must exist on both base classes under this exact name.
  requestUpdate() {
    this._scheduleUpdate();
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

**`Template.render()` compatibility:** The existing `Template.render()` method gates on `this.rendered` — it only calls `this.renderer.render()` on the first call and returns the cached result thereafter. This works for vanilla because:
- First call: `renderer.render()` returns a DocumentFragment, which `_performUpdate` appends to shadowRoot.
- Subsequent calls: `Template.render()` returns the (now-empty) cached DocumentFragment. The vanilla base never calls `render()` again — it calls `renderer.setData()` instead, and Reactions handle DOM writes.
- `Template.render()` does not need modification for vanilla support.

**`requestUpdate()` contract:** Both `LitComponentBase` (inherits from LitElement) and `VanillaComponentBase` must expose `requestUpdate()` as a public method. This is called by:
- `template.js` — exposed as `rerender()` in the callback params (`rerender: () => this.element.requestUpdate()`)
- `adjust-property-from-attribute.js` — triggers update for special attributes like `disabled` and `value`

Because both base classes satisfy this contract, `adjust-property-from-attribute.js` works unchanged with either renderer.

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

The current hard import `import { LitRenderer } from '@semantic-ui/renderer'` at the top of `template.js` must also be removed — the renderer class arrives via the constructor/clone chain. This moves the Lit dependency from `@semantic-ui/templating` to `@semantic-ui/component` (where `defineComponent` selects the renderer class).

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
    └── adjust-property-from-attribute.js  ← unchanged (calls el.requestUpdate()
                                              which both base classes provide)
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
When `{#if}` swaps branches or `{#each}` removes items, all Reactions owned by the removed DOM must be stopped. This requires hierarchical Reaction tracking.

**Mitigation:** The `DynamicRegion` + `ReactionScope` pattern handles this. Each region tracks its child scopes. `region.setContent()` disposes old scopes before inserting new content. Since `readAST` takes a scope parameter, all Reactions created during rendering are automatically tracked for cleanup.

### Performance vs Lit
Lit's tagged template literal approach is highly optimized — the browser caches the template parse result, and Lit only diffs expression values. The vanilla renderer creates DOM nodes directly, which may be slower for first render of large templates.

However: the vanilla renderer's update path should be faster (signal → DOM write, no intermediate diff). Net performance likely depends on the ratio of first-renders to updates.

**Mitigation:** Benchmark both renderers on the same set of components. The existing `docs/src/examples/` provide good test cases.

### Template.render() Return Type
Currently `Template.render()` returns a Lit `TemplateResult` which is consumed by `LitElement.render()`. For vanilla, `renderer.render()` returns a `DocumentFragment`.

This is a non-issue in practice. `Template.render()` caches the result in `this.html` and gates on `this.rendered` — it only calls `renderer.render()` once. The Lit base class returns `this.html` from its `render()` method (Lit processes the TemplateResult). The vanilla base class calls `this.template.render()` once in `_performUpdate()` and appends the DocumentFragment. Subsequent updates flow through `renderer.setData()` + Reactions. `Template.render()` itself needs no changes.

### SSR
The vanilla renderer is browser-first. `isServer` checks exist throughout the codebase. SSR with the vanilla renderer would require a DOM shim (like `linkedom` or `happy-dom`). The Lit renderer already handles SSR via Lit's SSR package.

**Recommendation:** SSR is out of scope for initial vanilla renderer. Keep Lit renderer as the SSR target.

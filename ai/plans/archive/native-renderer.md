# Native Renderer Implementation Plan

## Goal

Replace the Lit rendering layer with a native DOM renderer that has zero framework dependencies. The existing Lit renderer continues to work — this is additive, selected via `renderingEngine: 'native'`.

## Core Architectural Insight

SUI's per-expression Reaction model (currently wrapped in Lit AsyncDirectives) is already doing the work that makes a virtual DOM unnecessary. Each `{expression}` has its own Reaction that tracks Signal dependencies and updates its DOM position directly. The Lit diffing layer sits on top of this doing redundant work — the native renderer removes it.

**Lit model:** `render()` called every update → returns TemplateResult → Lit diffs against previous TemplateResult → patches DOM. Tagged template literal strings serve as cache keys. Comment markers (`<!--?lit$-->`) track binding positions. Each binding is a Part object managed by Lit's update cycle.

**Native model:** `render()` called once → creates real DOM nodes → Reactions write directly to specific DOM nodes. No intermediate representation, no diffing, no comment markers.

---

## Current Lit Surface Area

### In `@semantic-ui/renderer`
- `LitRenderer` class (renderer.js, ~780 lines) — expression evaluation + AST→tagged template literal bridge
- 6 AsyncDirectives: `reactiveData`, `reactiveConditional`, `reactiveEach`, `reactiveAsync`, `reactiveRerender`, `renderTemplate`
- Imports: `html`, `svg`, `nothing`, `noChange` from `lit`; `AsyncDirective`, `directive`, `PartType` from `lit/directive.js`; `repeat` from `lit/directives/repeat.js`; `ifDefined`, `unsafeHTML` from lit directives

### In `@semantic-ui/component`
- `WebComponentBase extends LitElement` (web-component.js, ~388 lines)
- `import { unsafeCSS } from 'lit'` in define-component.js
- `static properties` system (Lit's reactive property declarations)
- Render lifecycle: `willUpdate`, `updated`, `firstUpdated`, `render()` returning TemplateResult

### In `@semantic-ui/templating`
- `import { LitRenderer } from '@semantic-ui/renderer'` in template.js
- Hard-coded `new LitRenderer(...)` in `Template.initialize()`

---

## Phase 0: Extract Shared Expression Evaluator

**Why first:** The expression evaluation logic in `LitRenderer` is 100% renderer-agnostic — token resolution, Lisp-style evaluation, JS eval with Proxy, deep path access, literal detection. Both renderers need it. Extracting it first prevents duplication and validates that the extraction is clean (all existing tests must pass with zero behavior change).

### What moves to `ExpressionEvaluator`:

| Method | Purpose |
|--------|---------|
| `lookupExpressionValue()` | Core evaluator — token lookup, right-to-left Lisp-style recursive evaluation |
| `lookupTokenValue()` | Single token resolution cascade: literal → data context → JS eval → helper |
| `evaluateJavascript()` | `new Function` + `with` + Proxy for JS expressions |
| `getExpressionArray()` | Lisp-style tokenizer with parenthetical group handling |
| `getDeepDataValue()` | Dot-notation path resolution with Signal auto-unwrap |
| `accessTokenValue()` | Signal unwrapping, `this` binding for dotted method paths |
| `getLiteralValue()` | String/number/boolean literal detection |
| `addParensToExpression()` | Wraps `{}` and `[]` in parens for Lisp tokenizer |

### What stays in LitRenderer (Lit-specific):

| Method | Purpose |
|--------|---------|
| `addHTML()` / `addValue()` / `addHTMLSpacer()` | Tagged template literal array construction |
| `render()` | Returns `html(...)` / `svg(...)` tagged template |
| `renderContent()` | Subtree renderer creation with WeakRef caching |
| Directive wiring | `evaluateConditional()`, `evaluateEach()`, etc. — these call directives |

### Structure after extraction

```
packages/renderer/src/
├── expression-evaluator.js    ← NEW: shared expression logic
├── lit/
│   ├── renderer.js            ← refactored: delegates to ExpressionEvaluator
│   └── directives/            ← unchanged
└── native/                    ← Phase 1
```

`ExpressionEvaluator` constructor takes `{ data, helpers, dataVersion }`. The `dataVersion` Signal is used by both renderers for subtree data propagation.

**Validation:** All existing renderer tests pass with zero behavior change.

---

## Phase 1: Renderer

### 1.0 Binding Classification (Pre-Analysis Pass)

Before rendering, classify each `expression` node in the AST as text content or attribute binding by replaying `StringScanner.getContext()` logic on the concatenated HTML context from surrounding AST nodes.

```js
function classifyBindings(ast) {
  let htmlBuffer = '';
  const classifications = [];

  for (const node of ast) {
    if (node.type === 'html') {
      htmlBuffer += node.html;
    }
    else if (node.type === 'expression') {
      const ctx = analyzePosition(htmlBuffer);
      classifications.push({
        type: ctx.insideTag ? 'attribute' : 'text',
        attributeName: ctx.attribute,
        boolean: ctx.booleanAttribute,
        quoted: ctx.quoted,
        // for multi-expression attributes, group by element + attribute
        elementContext: ctx.elementContext,
      });
    }
    // block-level nodes (if, each, etc.) reset the HTML buffer context
    // since their content is a separate scope
  }
  return classifications;
}
```

`analyzePosition(htmlBuffer)` scans backward from the end of the accumulated HTML to determine if we're inside a tag, what attribute we're in, and whether it's quoted — the same logic as `StringScanner.getContext()` lines 106-180.

This classification is **deterministic from the AST** and can be cached per AST identity. No compiler changes needed.

### 1.1 Prepared Templates (Parse Once, Clone Per Instance)

Borrow Lit's best optimization — separate template preparation from instantiation.

**Prepare (once per AST subtree, cached):**

1. Walk the AST, concatenating `html` nodes and inserting markers for `expression` nodes:
   - Text positions: `<!--s0-->` comment marker
   - Attribute positions: `\x00s0\x00` token in the attribute value (null bytes won't appear in normal HTML)
2. Set as `innerHTML` of a `<template>` element
3. TreeWalker the parsed DOM to find markers, recording binding metadata:
   ```js
   { nodeIndex: 7, type: 'text', exprIndex: 0 }
   { nodeIndex: 3, type: 'attribute', name: 'class', exprIndex: 1 }
   { nodeIndex: 3, type: 'attribute', name: 'class', exprIndex: 2 }  // multi-expr
   { nodeIndex: 3, type: 'boolean', name: 'disabled', exprIndex: 3 }
   ```
4. **Remove all markers** from the template DOM
5. Cache the `PreparedTemplate` keyed by AST identity

**Create (per instance):**

1. `templateElement.content.cloneNode(true)` — fast, browser-optimized
2. Walk clone by recorded node indices (simple counter, no string matching)
3. At each binding position, create the appropriate reactive binding
4. Return the fragment with all bindings wired

**Why this matters:**
- The browser parses HTML once per component definition, not per instance
- `cloneNode(true)` is significantly faster than building DOM nodes individually
- Attribute vs text classification is verified by the browser's own parser — no heuristics
- **Zero markers in the live DOM** — they exist only during the one-time Prepare phase and are removed before caching
- Multi-expression attributes are naturally detected (multiple tokens in the same attribute)

Block-level directives (`{#if}`, `{#each}`, etc.) break the template into segments. Each segment gets its own PreparedTemplate. DynamicRegions connect segments.

### 1.2 Reactive Bindings

Each binding is a single `Reaction.create()` — one object per binding. The Reaction reads Signals during expression evaluation (establishing dependencies via `Scheduler.current`) and writes to the DOM when dependencies change.

**Text content:**
```js
// textNode was placed by PreparedTemplate clone
const textNode = clone.childNodes[bindingInfo.nodeIndex];
scope.track(Reaction.create((comp) => {
  if (!comp.firstRun && !isConnected()) { comp.stop(); return; }
  textNode.data = evaluator.evaluate(expr, data) ?? '';
}));
```

**String attribute:**
```js
scope.track(Reaction.create((comp) => {
  if (!comp.firstRun && !isConnected()) { comp.stop(); return; }
  el.setAttribute(name, evaluator.evaluate(expr, data) ?? '');
}));
```

**Multi-expression attribute** (e.g., `class="{base} {modifier}"`):
```js
// parts: [{ expr: 'base' }, { static: ' ' }, { expr: 'modifier' }]
scope.track(Reaction.create((comp) => {
  if (!comp.firstRun && !isConnected()) { comp.stop(); return; }
  let value = '';
  for (const part of parts) {
    value += part.static ?? evaluator.evaluate(part.expr, data) ?? '';
  }
  el.setAttribute(name, value);
}));
```

**Boolean attribute / ifDefined** (unquoted `disabled={isDisabled}`):
```js
scope.track(Reaction.create((comp) => {
  if (!comp.firstRun && !isConnected()) { comp.stop(); return; }
  const value = evaluator.evaluate(expr, data);
  if (value) {
    el.setAttribute(name, '');
  } else {
    el.removeAttribute(name);
  }
  // Sync DOM property for attrs that diverge after interaction
  if (SYNCED_ATTRS.includes(name)) el[name] = Boolean(value);
}));
```

**Property binding** (`.prop={value}`):
```js
scope.track(Reaction.create((comp) => {
  if (!comp.firstRun && !isConnected()) { comp.stop(); return; }
  el[propName] = evaluator.evaluate(expr, data);
}));
```

**Event binding** (`@click={handler}`):
```js
const handler = evaluator.evaluate(expr, data);
el.addEventListener(eventName, handler);
scope.onDispose(() => el.removeEventListener(eventName, handler));
```

**Unsafe HTML** (`{#html content}`):
```js
const container = document.createElement('span');
// insert container at binding position
scope.track(Reaction.create((comp) => {
  if (!comp.firstRun && !isConnected()) { comp.stop(); return; }
  container.innerHTML = evaluator.evaluate(expr, data) ?? '';
}));
```

### 1.3 Dynamic Regions (Block-Level Directives)

All block-level directives (`{#if}`, `{#each}`, `{#async}`, `{#rerender}`) use the same positional primitive:

```js
class DynamicRegion {
  constructor() {
    this.anchor = null;      // lazy — only created when region is empty
    this.firstNode = null;    // first owned DOM node
    this.lastNode = null;     // last owned DOM node
    this.ownedNodes = [];
    this.childScopes = [];
  }

  // Insert after a reference point in the parent
  insertAfter(referenceNode) {
    this.referenceNode = referenceNode;
    this.parentNode = referenceNode.parentNode;
  }

  clear() {
    for (const scope of this.childScopes) scope.dispose();
    this.childScopes = [];

    if (this.ownedNodes.length === 0) return;

    // Remember position before removing nodes
    const insertionPoint = this.ownedNodes[0].previousSibling || this.referenceNode;

    for (const node of this.ownedNodes) node.remove();
    this.ownedNodes = [];
    this.firstNode = null;
    this.lastNode = null;

    // Create lazy anchor to remember position
    if (!this.anchor) {
      this.anchor = document.createTextNode('');
      insertionPoint.after(this.anchor);
    }
  }

  setContent(fragment, scope) {
    this.clear();
    this.ownedNodes = [...fragment.childNodes];
    this.firstNode = this.ownedNodes[0] || null;
    this.lastNode = this.ownedNodes[this.ownedNodes.length - 1] || null;
    if (scope) this.childScopes.push(scope);

    if (this.anchor) {
      this.anchor.after(fragment);
      this.anchor.remove();
      this.anchor = null;
    } else {
      this.referenceNode.after(fragment);
    }
  }
}
```

**Lazy anchors:** An empty text node is only created when a region transitions to empty (no content). When it has content, `firstNode`/`lastNode` of the owned nodes serve as positional references. This means regions with visible content have **zero extra DOM nodes**.

In DevTools: no comment markers ever. At most, an invisible empty text node for regions that are currently showing nothing.

### 1.4 Reaction Scope (Hierarchical Cleanup)

```js
class ReactionScope {
  constructor() {
    this.reactions = [];
    this.children = [];
    this.disposers = [];
  }

  track(reaction) {
    this.reactions.push(reaction);
  }

  onDispose(fn) {
    this.disposers.push(fn);
  }

  child() {
    const childScope = new ReactionScope();
    this.children.push(childScope);
    return childScope;
  }

  dispose() {
    for (const child of this.children) child.dispose();
    this.children = [];
    for (const reaction of this.reactions) reaction.stop();
    this.reactions = [];
    for (const fn of this.disposers) fn();
    this.disposers = [];
  }
}
```

When a conditional branch is swapped, or an each item is removed, `scope.dispose()` stops all Reactions owned by that subtree. Since `readAST` takes a scope parameter, all Reactions created during rendering are tracked hierarchically.

### 1.5 Conditional Rendering ({#if}/{else if}/{else})

```js
const region = new DynamicRegion();
region.insertAfter(currentPosition);

let currentBranchIndex = -1;

scope.track(Reaction.create((comp) => {
  const { matchIndex, contentAST } = getBranch(node, evaluator, data);

  if (matchIndex !== currentBranchIndex) {
    currentBranchIndex = matchIndex;
    if (contentAST) {
      const branchScope = scope.child();
      const fragment = readAST({ ast: contentAST, data, scope: branchScope });
      region.setContent(fragment, branchScope);
    } else {
      region.clear();
    }
  }
}));
```

`getBranch()` reuses the same logic as `ReactiveConditionalDirective.getBranch()` — evaluate condition, iterate branches, return matching content AST.

### 1.6 List Rendering ({#each})

Keyed reconciliation with per-item reactive data channels.

**The data update problem:** In Lit, `repeat()` re-renders all items and diffs per key. In native, existing items are not re-rendered — they need a reactive data channel. Each item gets a `Signal` holding its data context. Inner expressions subscribe during first render. When the collection changes and an existing item has new data, the Signal is updated and inner Reactions fire automatically.

```js
const listRegion = new DynamicRegion();
listRegion.insertAfter(currentPosition);

const itemMap = new Map(); // key → { nodes, itemSignal, scope }
let currentKeys = [];

scope.track(Reaction.create((comp) => {
  const rawItems = evaluator.evaluate(node.over, data) || [];

  // Handle empty → else content
  if (isEmpty(rawItems) && node.elseContent) {
    clearAllItems(itemMap);
    currentKeys = [];
    const elseScope = scope.child();
    const fragment = readAST({ ast: node.elseContent, data, scope: elseScope });
    listRegion.setContent(fragment, elseScope);
    return;
  }

  const collectionType = getCollectionType(rawItems);
  const items = collectionType === 'object' ? arrayFromObject(rawItems) : rawItems;
  const newKeys = items.map((item, i) => getItemID(item, i, collectionType));

  // Remove items no longer present
  for (const key of currentKeys) {
    if (!newKeys.includes(key)) {
      const entry = itemMap.get(key);
      entry.scope.dispose();
      for (const node of entry.nodes) node.remove();
      itemMap.delete(key);
    }
  }

  // Clear else content if transitioning from empty
  if (currentKeys.length === 0 && newKeys.length > 0) {
    listRegion.clear();
  }

  // Add / reorder / update items
  let insertAfter = listRegion.anchor || listRegion.referenceNode;

  for (let i = 0; i < newKeys.length; i++) {
    const key = newKeys[i];
    const item = items[i];
    const eachData = getEachData(item, i, collectionType, node);

    if (itemMap.has(key)) {
      // Existing item — update data, reorder if needed
      const entry = itemMap.get(key);
      entry.itemSignal.set(eachData);

      // Move to correct position if necessary
      const firstNode = entry.nodes[0];
      if (firstNode.previousSibling !== insertAfter) {
        for (const node of entry.nodes) {
          insertAfter.after(node);
          insertAfter = node;
        }
      } else {
        insertAfter = entry.nodes[entry.nodes.length - 1];
      }
    } else {
      // New item — create Signal, render, track
      const itemScope = scope.child();
      const itemSignal = new Signal(eachData, { allowClone: false });
      const itemProxy = createItemDataProxy(data, itemSignal);

      const fragment = readAST({
        ast: node.content,
        data: itemProxy,
        scope: itemScope,
      });
      const nodes = [...fragment.childNodes];
      insertAfter.after(fragment);
      insertAfter = nodes[nodes.length - 1] || insertAfter;
      itemMap.set(key, { nodes, itemSignal, scope: itemScope });
    }
  }

  currentKeys = newKeys;
}));
```

**`createItemDataProxy`** — Proxy over parent data that intercepts item-specific keys from the item Signal:

```js
function createItemDataProxy(parentData, itemSignal) {
  return new Proxy(parentData, {
    get(target, prop) {
      const itemData = itemSignal.value; // establishes dependency
      if (prop in itemData) return itemData[prop];
      return target[prop]; // fall through to parent
    },
    has(target, prop) {
      const itemData = itemSignal.peek();
      return (prop in itemData) || (prop in target);
    },
  });
}
```

When `readAST` creates a Reaction for `{item.name}`, the evaluator accesses `itemProxy.name` → Proxy get trap → `itemSignal.value.name` → dependency on `itemSignal`. When the list Reaction calls `itemSignal.set(newData)`, `Signal.set()` runs `isEqual` — if the item data didn't change, no propagation. If it did, the binding Reaction fires and updates the DOM.

**`getItemID` and `getEachData`:** Reuse existing logic from `ReactiveEachDirective` — `_id`, `id`, `key`, `hash`, `value`, fallback to index. Object iteration via `arrayFromObject`.

### 1.7 Async Blocks ({#async})

Three-state DynamicRegion — same pattern as conditionals:

```js
const region = new DynamicRegion();
region.insertAfter(currentPosition);
let generation = 0;
let resolvedValue = null;
let hasResolved = false;

const renderState = (ast, extraData = {}) => {
  const stateScope = scope.child();
  const fragment = readAST({ ast, data: { ...data, ...extraData }, scope: stateScope });
  region.setContent(fragment, stateScope);
};

scope.track(Reaction.create(() => {
  const result = evaluator.evaluate(node.expression, data);
  const currentGen = ++generation;

  if (isPromise(result)) {
    // Show loading content (or preserve previous resolved content)
    if (node.loadingContent?.length) {
      renderState(node.loadingContent);
    }

    result.then(value => {
      if (currentGen < generation) return; // stale
      resolvedValue = value;
      hasResolved = true;
      renderState(node.content, createSuccessDataContext(node, value));
    }).catch(error => {
      if (currentGen < generation) return; // stale
      if (node.errorContent?.length) {
        const errorData = node.errorAs ? { [node.errorAs]: error } : { this: error };
        renderState(node.errorContent, errorData);
      }
    });
  } else {
    resolvedValue = result;
    hasResolved = true;
    renderState(node.content, createSuccessDataContext(node, result));
  }
}));
```

Generation counter discards stale promise results. `createSuccessDataContext` reuses `ReactiveAsyncDirective` logic for `as`, destructuring (`parts`/`rest`).

### 1.8 Rerender/Guard Blocks

Force full re-render of a region when specific dependencies change:

```js
const region = new DynamicRegion();
region.insertAfter(currentPosition);

// Initial render
const initialScope = scope.child();
const initialFragment = readAST({ ast: node.content, data, scope: initialScope });
region.setContent(initialFragment, initialScope);

scope.track(Reaction.create((comp) => {
  // Touch dependencies to subscribe
  if (node.key) {
    Reaction.guard(() => evaluator.evaluate(node.key, data));
  }
  if (node.expression) {
    evaluator.evaluate(node.expression, data);
  }

  if (!comp.firstRun) {
    const newScope = scope.child();
    const fragment = readAST({ ast: node.content, data, scope: newScope });
    region.setContent(fragment, newScope);
  }
}));
```

### 1.9 Subtemplate Rendering ({> templateName})

Subtemplates are full Template instances with their own lifecycle — required for `findParent()`, `findChildren()`, `dispatchEvent`, parent-child traversal.

**The key difference from Lit:** The Lit `RenderTemplateDirective` re-clones on every Reaction run because Lit diffs the result. Native must separate identity change (re-clone) from data change (update in place).

```js
const region = new DynamicRegion();
region.insertAfter(currentPosition);

let currentTemplateID = null;
let currentInstance = null;

scope.track(Reaction.create(() => {
  const templateOrName = evaluator.evaluate(node.name, data);
  const templateData = unpackNodeData(node, data, evaluator);

  // Resolve source template
  let template, templateName;
  if (isString(templateOrName)) {
    templateName = templateOrName;
    template = subTemplates[templateName];
  } else if (templateOrName instanceof Template) {
    template = templateOrName;
    templateName = template.templateName;
  }

  if (!template) {
    if (currentInstance) {
      currentInstance.onDestroyed();
      currentInstance = null;
      currentTemplateID = null;
      region.clear();
    }
    return;
  }

  if (template.id !== currentTemplateID) {
    // Template identity changed — destroy old, create new
    if (currentInstance) currentInstance.onDestroyed();

    currentTemplateID = template.id;
    currentInstance = template.clone({
      templateName,
      subTemplates,
      data: templateData,
      parentTemplate,
    });
    currentInstance.initialize();
    const fragment = currentInstance.render();
    region.setContent(fragment);

    currentInstance.attach(renderRoot, {
      parentNode: region.parentNode,
      startNode: region.firstNode,
      endNode: region.lastNode,
    });
    if (parentTemplate) currentInstance.setParent(parentTemplate);
  } else {
    // Same template — update data context in place
    currentInstance.setDataContext(templateData);
  }
}));

// Cleanup on scope dispose
scope.onDispose(() => {
  if (currentInstance) currentInstance.onDestroyed();
});
```

**Snippets** use Pattern A (inline AST subtrees via `readAST`) — they are NOT full Templates. They inherit parent data and render recursively. Same as current `evaluateSnippet()` behavior.

### 1.10 SVG Handling

SVG elements must be created in the correct namespace. The AST marks SVG regions with `{ type: 'svg', content: [...] }`. The template compiler already wraps SVG content between `<svg>` open/close HTML nodes.

For the PreparedTemplate approach: SVG content inside `<svg>` tags in the HTML string will be parsed in SVG namespace automatically by the browser. The TreeWalker handles SVG elements without special cases.

For dynamic content inside SVG (expressions): bindings work the same way — `setAttribute` handles SVG attributes correctly when called on SVG elements.

---

## Phase 2: ComponentBase

### 2.1 Core Class

```js
class ComponentBase extends HTMLElement {
  static shadowRootOptions = { mode: 'open', delegatesFocus: false };

  constructor() {
    super();
    this.renderCallbacks = [];
    this._dirty = false;
  }

  connectedCallback() {
    this.attachShadow(ComponentBase.shadowRootOptions);
    this._scheduleUpdate();
  }

  disconnectedCallback() {
    if (this.template) {
      this.template.onDestroyed();
      delete this.template;
      delete this.component;
      delete this.dataContext;
    }
    // Prototype cleanup — matches LitElement disconnectedCallback in defineComponent
    litTemplate.onDestroyed();
  }

  attributeChangedCallback(attribute, oldValue, newValue) {
    adjustPropertyFromAttribute({ el: this, attribute, ... });
    if (this.shadowRoot) this._scheduleUpdate();
  }

  // Public API contract — called by template.js rerender and adjustPropertyFromAttribute
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

```js
// In defineComponent, after building properties from spec:
static get observedAttributes() {
  return Object.entries(properties)
    .filter(([_, config]) => config.attribute !== false)
    .map(([name]) => camelToKebab(name));
}
```

For each property, generate getter/setter pairs:
```js
for (const [name, config] of Object.entries(properties)) {
  if (!config.noAccessor) {
    Object.defineProperty(prototype, name, {
      get() { return this[`_${name}`] ?? config.default; },
      set(value) {
        const old = this[`_${name}`];
        if (!config.hasChanged || config.hasChanged(value, old)) {
          this[`_${name}`] = value;
          this._scheduleUpdate();
        }
      },
    });
  }
}
```

Type conversion moves into `attributeChangedCallback`:
```js
attributeChangedCallback(attribute, oldValue, newValue) {
  const propName = kebabToCamel(attribute);
  const config = properties[propName];
  if (config?.converter?.fromAttribute) {
    newValue = config.converter.fromAttribute(newValue, config.type);
  }
  // Set via the generated accessor — triggers _scheduleUpdate
  this[propName] = newValue;

  // Run 3-dialect resolution (verbose/concise/classic) for spec-driven components
  adjustPropertyFromAttribute({
    el: this,
    attribute,
    attributeValue: newValue,
    properties,
    oldValue,
    componentSpec,
  });
}
```

### 2.3 The Settings Chain

This is the most intricate Lit dependency to replace. The full flow:

**Lit path:** `static properties` → Lit generates accessors → `this[prop]` works → `createSettingsProxy` reads `this[prop]` via `getSettingsFromConfig` → Proxy `get` trap wraps in Signal → `overlaySettingsSignals` overlays Signals onto data context → Reactions track them.

**Native path:** Manual `Object.defineProperty` accessors replace Lit's generated ones. The contract is identical — `this[prop]` returns the current value, `this[prop] = x` stores and calls `_scheduleUpdate()`. Everything downstream (`createSettingsProxy`, `getSettingsFromConfig`, `adjustPropertyFromAttribute`, `overlaySettingsSignals`) works unchanged because they only depend on:

1. `this[propertyName]` returning the current value — satisfied by the manual getter
2. `this[propertyName] = value` storing and triggering update — satisfied by the manual setter
3. `el.requestUpdate()` existing — `ComponentBase` provides this
4. `el.settings[prop]` being a Signal-backed Proxy — `createSettingsProxy` is renderer-agnostic

**`adjustPropertyFromAttribute` is unchanged.** It calls `el[property] = value` (hits the manual accessor), `el.settings[property] = value` (hits the Proxy set trap → updates Signal), and `el.requestUpdate()` for special properties like `disabled`/`value`. All three work with `ComponentBase`.

**`getProperties` needs a small adjustment.** It currently returns Lit-shaped property objects (`{ type, attribute, hasChanged, converter, noAccessor, alias }`). The native path consumes the same shape — `observedAttributes` filters by `attribute !== false`, the accessor loop checks `noAccessor`, `hasChanged` gates the setter. The shape doesn't need to change, only who consumes it (Lit internally vs our explicit accessor generation).

**`static get styles()` → `_adoptStyles()`.** Replace `unsafeCSS(css)` with `CSSStyleSheet` + `adoptedStyleSheets` (already covered in 2.4).

### 2.4 Render Lifecycle

Microtask-based scheduling replaces Lit's `willUpdate → render → updated → firstUpdated`:

```js
_scheduleUpdate() {
  if (!this._dirty) {
    this._dirty = true;
    this.updateComplete = new Promise(resolve => {
      this._resolveUpdate = resolve;
    });
    queueMicrotask(() => this._performUpdate());
  }
}

_performUpdate() {
  this._dirty = false;

  if (!this.template) {
    // First render
    this._initializeTemplate();
    this._adoptStyles();
    const fragment = this.template.render(this.getData());
    this.shadowRoot.append(fragment);
    this.component = this.template.instance;
    this.dataContext = this.template.getDataContext();
  } else {
    // Subsequent — update data context, Reactions handle DOM
    this.template.renderer.setData(this.getData());
  }

  for (const cb of this.renderCallbacks) cb();
  this._resolveUpdate?.();
}
```

**`Template.render()` compatibility:** The existing `Template.render()` gates on `this.rendered` — first call invokes `renderer.render()`, subsequent calls bump data version. For native, `renderer.render()` returns a DocumentFragment (appended to shadowRoot). Subsequent calls trigger `renderer.bumpDataVersion()` which propagates to subtree Reactions. No changes needed to `Template.render()`.

### 2.5 Style Adoption

Replace `static get styles()` + `unsafeCSS` with native `adoptedStyleSheets`:

```js
_adoptStyles() {
  if (!this.css) return;
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(this.css);
  this.shadowRoot.adoptedStyleSheets = [sheet];
}
```

`pageCSS` is already handled by `adoptStylesheet` from `@semantic-ui/utils` (no Lit dependency).

### 2.6 Shared Logic

These methods from `WebComponentBase` are renderer-agnostic and should be shared via mixin or helper module:

| Method | Notes |
|--------|-------|
| `createSettingsProxy()` | Signal-backed reactive Proxy |
| `setDefaultSettings()` | Merge spec defaults |
| `getSettingsFromConfig()` | Read properties from element |
| `getUIClasses()` | CSS classes from spec attributes |
| `isDarkMode()` | Query-based dark mode detection |
| `getProperties()` | Build property map from spec |
| `getPropertySettings()` | Type conversion config |
| `$()` / `$$()` | Shadow DOM query helpers |

Extract into `ComponentHelpers` module. Both `WebComponentBase` (renamed `LitComponentBase`) and `ComponentBase` import and use it.

---

## Phase 3: Integration

### 3.1 Template Class Changes

`template.js` currently hard-imports `LitRenderer`. Change to renderer class injection:

```js
// Option B: renderer class passed in (preferred — tree-shakeable)
initialize() {
  const RendererClass = this.rendererClass || LitRenderer;
  this.renderer = new RendererClass({
    ast: this.ast,
    data: this.overlaySettingsSignals(this.getDataContext()),
    template: this,
    subTemplates: this.subTemplates,
    helpers: TemplateHelpers,
  });
}
```

The renderer class is passed through from `defineComponent` via the Template constructor/clone chain. The hard import of `LitRenderer` at the top of `template.js` is removed — the Lit dependency moves from `@semantic-ui/templating` to `@semantic-ui/component`.

### 3.2 defineComponent Changes

```js
export const defineComponent = ({
  renderingEngine = 'lit',
  // ... existing params
}) => {
  const BaseClass = renderingEngine === 'native'
    ? ComponentBase
    : LitComponentBase;

  const RendererClass = renderingEngine === 'native'
    ? Renderer
    : LitRenderer;

  let litTemplate = new Template({
    renderingEngine,
    rendererClass: RendererClass,
    // ... rest unchanged
  });

  if (tagName) {
    webComponent = class UIWebComponent extends BaseClass {
      // ... selection of BaseClass is the only structural change
    };
  }
};
```

### 3.3 Package Structure

```
packages/renderer/src/
├── index.js                    ← exports both renderers
├── expression-evaluator.js     ← shared (Phase 0)
├── lit/
│   ├── renderer.js             ← refactored (Phase 0)
│   └── directives/             ← unchanged
└── native/
    ├── renderer.js             ← Renderer
    ├── prepared-template.js    ← template parsing + caching
    ├── dynamic-region.js       ← lazy-anchor DOM region
    ├── reaction-scope.js       ← hierarchical cleanup
    └── reconciler.js           ← keyed list reconciliation

packages/component/src/
├── define-component.js         ← modified: renderer/base class selection
├── lit-component-base.js       ← renamed from web-component.js
├── component-base.js           ← NEW
├── component-helpers.js        ← NEW: shared logic
└── helpers/
    └── adjust-property-from-attribute.js  ← unchanged
```

### 3.4 Test Infrastructure

`test-utils.js` currently exports `RENDERING_ENGINES = ['lit']`. When the native renderer is ready:

```js
export const RENDERING_ENGINES = ['lit', 'native'];
```

All existing tests that iterate `RENDERING_ENGINES` automatically run against both renderers. The test suite was designed for this — every test uses `defineComponent({ renderingEngine: engine, ... })` and `el.updateComplete` for async coordination.

The `updateComplete` contract: `ComponentBase` needs to expose `updateComplete` as a Promise that resolves after the microtask update completes, matching LitElement's API.

---

## Implementation Order

### Step 1: Extract ExpressionEvaluator (Phase 0)
- Low risk, high value
- All existing tests pass, no behavior change
- Unblocks Phase 1

### Step 2: Extract ComponentHelpers (Phase 2.5)
- Move shared methods from WebComponentBase to helper module
- Rename WebComponentBase → LitComponentBase
- All existing tests pass, no behavior change

### Step 3: Renderer — PreparedTemplate + text bindings
- Implement PreparedTemplate (parse, cache, clone)
- Binding classification pre-analysis
- Reactive text content bindings
- Testable with simple `{expression}` templates

### Step 4: Renderer — attribute bindings
- String attributes, boolean attributes, property bindings, event bindings
- Multi-expression attributes
- ifDefined behavior
- DOM property sync for checked/value/selected

### Step 5: Renderer — conditionals + rerender
- DynamicRegion with lazy anchors
- ReactionScope for hierarchical cleanup
- `{#if}/{else if}/{else}` with branch tracking
- `{#rerender}/{#guard}` blocks

### Step 6: Renderer — each (lists)
- Keyed reconciliation with Signal-backed item data channels
- `createItemDataProxy` for per-item reactivity
- Object iteration via `arrayFromObject`
- Empty list `{else}` handling
- Item reorder with DOM node moves
- **This is the hardest step** — budget accordingly

### Step 7: Renderer — async + subtemplates + snippets
- `{#async}` with loading/error/success states + generation counter
- `{> template}` with identity-vs-data separation
- Snippet rendering via recursive readAST
- SVG namespace handling

### Step 8: ComponentBase
- HTMLElement subclass with property system
- Microtask-based render scheduling
- `updateComplete` Promise
- Style adoption via adoptedStyleSheets
- Wire up with Renderer

### Step 9: defineComponent integration
- Renderer/base class selection via `renderingEngine`
- Template class accepts renderer class
- Enable `RENDERING_ENGINES = ['lit', 'native']` in tests
- End-to-end testing against full test suite

---

## Risks and Mitigations

### PreparedTemplate edge cases
The placeholder approach during Prepare works for standard HTML. Edge cases: `<style>`, `<script>`, `<textarea>`, `<title>` — browsers handle text content in these elements differently. Lit handles this explicitly in their Prepare phase by searching text content for markers.

**Mitigation:** Template expressions inside `<style>` or `<script>` are rare in SUI components (CSS is separate, JS is in createComponent). Handle these as special cases during Prepare — scan text content for tokens and split accordingly.

### Each-list reconciliation correctness
The keyed reconciler must handle: insert, remove, reorder, grow, shrink, swap to empty, swap from empty. Each operation must correctly maintain the item Signal → Reaction chain and DOM node tracking.

**Mitigation:** The existing test suite (subtree-caching.test.js, subtree-each.test.js, cleanup-reactions.test.js) covers all these cases. Tests 14 (reorder), 15a-d (non-reactive data), 16 (focus preservation) are particularly demanding.

### SSR
The native renderer is browser-first. SSR with native would require a DOM shim. The Lit renderer already handles SSR via `@lit-labs/ssr`.

**Recommendation:** SSR stays on Lit. Out of scope for native renderer.

## Open Questions

1. **Subtree caching in Renderer** — LitRenderer has `renderContent()` with WeakRef-based subtree caching (`useSubtreeCache`). Does the native renderer need an equivalent? The PreparedTemplate cache handles template parsing. Subtree instances (for snippet/conditional/each content) could be cached similarly, but the primary optimization (avoiding re-parse) is already covered.

2. **`debugReactivity` expression** — `ReactiveDataDirective` has a special case for this. The native renderer needs to handle it too. Likely just a pass-through that evaluates without creating a Reaction.

## Dependencies

- None external — this is additive to the existing codebase
- The existing test suite serves as the behavioral specification

## Status

Scoped. Ready to execute starting from Phase 0.

## Process

Work is unassisted — no user feedback loops during implementation. The objective function is:

1. **Make tests pass.** `RENDERING_ENGINES = ['lit', 'native']` produces 131 red tests. Turn them green without regressing Lit tests.
2. **Commit as you go.** Each meaningful unit of progress gets a commit.
3. **Visual confirmation.** After all tests pass, modify the TodoMVC example (`docs/src/examples/component/todo-list/`) to use `renderingEngine: 'native'` and verify it works end-to-end via Chrome MCP (navigate, interact, screenshot).
4. **Fresh Take when stuck.** If blocked, use the `fresh-take` skill — extract problem knowledge, isolate solution momentum, spawn a clean subagent for independent evaluation. Don't grind on the same approach.
5. **Chrome MCP for live debugging.** When test failures are opaque, use the dev server test page (`docs/src/pages/test.astro`) with Chrome MCP to debug live. The pattern:
   - Write a minimal component on the test page that reproduces the issue
   - Navigate via `navigate_page` to `https://dev.semantic-ui.com/test`
   - Use `evaluate_script` to inspect live state: renderer internals, Signal subscriber counts, Reaction dependency sets, data context values
   - Use `take_screenshot` to verify visual output
   - All packages are linked — changes to source files are live via Vite HMR
   This was the breakthrough technique for diagnosing the subtemplate reactivity bug (dataVersion subscribers were present but `setDataContext` was resetting `rendered=false`, causing Template.render to re-create DOM instead of bumping dataVersion).

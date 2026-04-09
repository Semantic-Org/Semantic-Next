---
title: Render Pipeline — Template String to Live DOM
description: How a template string becomes reactive DOM. Covers the engine-agnostic pipeline from TemplateCompiler through defineComponent and Template to the swappable rendering engine — including the AST format, expression evaluation, and per-expression reactivity. Load before working on rendering, engine internals, or component authoring.
keywords: [render pipeline, template compiler, AST, rendering engine, defineComponent, expression evaluation, reactivity, signals, native renderer, lit renderer]
audience: authoring
skill: render-pipeline
type: skill
---

# Render Pipeline — Template String to Live DOM

> **Skill:** `render-pipeline`
> **Purpose:** How a template string becomes reactive DOM. The engine-agnostic pipeline from source text to interactive UI, for agents working on framework internals or component authoring.

---

## The Pipeline

A template string passes through four stages before reaching the DOM. Each stage has a single owner. The first three stages are engine-agnostic — the rendering engine only enters at stage 4.

```
Template String
     |
     v
+-----------------+
| TemplateCompiler |  packages/templating/src/compiler/
|                  |  string -> AST (array of node objects)
+-----------------+
         |
         v
+-----------------+
| defineComponent  |  packages/component/src/define-component.js
|                  |  compiles AST once, resolves engine, creates prototype Template
|                  |  optionally registers custom element
+-----------------+
         |
         v
+-----------------+
|    Template      |  packages/templating/src/template.js
|                  |  per-instance clone, lifecycle, state, events
|                  |  resolves engine -> creates Renderer on initialize()
+-----------------+
         |
         v
+-----------------+
| Rendering Engine |  packages/renderer/src/engines/{native,lit}/
|                  |  walks AST -> produces DOM (or HTML string on server)
|                  |  expression evaluation, per-expression reactivity
+-----------------+
```

**Key invariants:**
- The AST is compiled once and shared across all instances of a component
- The AST is engine-agnostic — a plain data structure any renderer can consume
- The rendering engine is selected at definition time and swappable per-component

---

## The Engine Abstraction

The framework supports multiple rendering engines through a simple registry. Each engine provides three things:

```js
// packages/renderer/src/engine-registry.js
const engines = new Map();
export const registerEngine = (name, engine) => engines.set(name, engine);
export const getEngine = (name) => engines.get(name);
```

An engine object has:

| Property | Purpose |
|----------|---------|
| `renderer` | Client-side renderer class (AST -> DOM + reactive bindings) |
| `serverRenderer` | Server-side renderer class (AST -> HTML string), optional |
| `factory` | Creates a web component class for `customElements.define` |

```js
// packages/component/src/engines/native/register.js
const NativeEngine = { renderer: Renderer, serverRenderer: ServerRenderer, factory: createComponent };
registerEngine('native', NativeEngine);
```

### Engine Selection

`defineComponent` takes a `renderingEngine` parameter (default: `'native'`):

```js
defineComponent({
  tagName: 'my-counter',
  renderingEngine: 'native',  // default — extends HTMLElement directly
  // renderingEngine: 'lit',  // Lit engine — extends LitElement
  template, css, createComponent, ...
});
```

The engine is resolved once at definition time. `Template.initialize()` then picks the renderer class from the engine — `engine.renderer` for client, `engine.serverRenderer` for server:

```js
// template.js — inside initialize()
const engine = getEngine(this.renderingEngine);
const RendererClass = (Template.isServer && engine.serverRenderer)
  ? engine.serverRenderer
  : engine.renderer;
this.renderer = new RendererClass({ ast, data, template: this, ... });
```

### Available Engines

**Native** (default) — `packages/component/src/engines/native/` + `packages/renderer/src/engines/native/`
- `WebComponentBase` extends `HTMLElement` directly — zero framework dependencies
- `Renderer` uses a 3-phase pipeline: HTML string assembly -> DOM parsing -> marker binding
- `ServerRenderer` renders AST to HTML string with hydration markers
- Imported automatically when you `import { defineComponent } from '@semantic-ui/component'`

**Lit** — `packages/component/src/engines/lit/` + `packages/renderer/src/engines/lit/`
- `LitWebComponentBase` extends `LitElement`
- `LitRenderer` bridges AST to Lit's tagged template literal API using 6 custom `AsyncDirective` subclasses
- No server renderer (Lit SSR is a separate ecosystem)
- Must be imported explicitly: `import '@semantic-ui/component/engines/lit/register.js'`

The engines are hot-swappable — two components on the same page can use different engines. The AST and Template layers are identical; only the final rendering step differs. Future engines could target other platforms (Canvas, native mobile, terminal) by implementing the same three-part interface.

---

## Stage 1: TemplateCompiler

`packages/templating/src/compiler/template-compiler.js`

The compiler transforms a template string into an AST — a flat array of node objects. It has no knowledge of rendering, reactivity, or components.

### How It Works

1. **Preprocess** — expand self-closing web component tags (`<ui-icon />` -> `<ui-icon></ui-icon>`)
2. **Detect syntax** — check whether the template uses `{}` or `{{}}` brackets (one syntax per template, first expression wins)
3. **Scan** — `StringScanner` walks the string character-by-character, advancing to the next expression or SVG tag
4. **Parse tags** — for each `{expression}`, the compiler matches against regex patterns in priority order: `#if`, `#each`, `#async`, `#snippet`, `#rerender`, `#guard`, `>slot`, `>template`, `#html`, `#fn`, and finally plain `expression`
5. **Build AST** — two stacks drive nesting:
   - `contentStack` — tracks which node receives child AST nodes (push on open, pop on close)
   - `conditionStack` — tracks nodes that support branching (`if`, `each`, `async`)
6. **Optimize** — join adjacent HTML nodes, hoist snippets to the front

### The AST Format

The AST is intentionally lean and human-legible — a flat array of plain objects you can scan at a glance. There is no positional metadata, source maps, or engine-specific annotations in the base AST. Positional data (like binding classification for attributes vs. text) is computed downstream by engines that need it, keeping the AST itself a clean, engine-agnostic intermediate representation.

Use `validate_template` with `includeAST: true` via MCP to compile any template and inspect the resulting AST.

<<<<<<< HEAD
**expression** — dynamic value: `{user.name}`, `{formatDate date 'h:mm a'}`
```json
{ "type": "expression", "value": "formatDate date 'h:mm a'" }
{ "type": "expression", "value": "content", "unsafeHTML": true }
{ "type": "expression", "value": "handleChange", "literalValue": true }
{ "type": "expression", "value": "isHidden", "ifDefined": true }
```

**if** — conditional: `{#if condition}...{else if other}...{else}...{/if}`
```json
{ "type": "if", "condition": "isActive", "content": [/*AST*/], "branches": [
    { "type": "elseif", "condition": "isPending", "content": [/*AST*/] },
    { "type": "else", "content": [/*AST*/] }
]}
```

**each** — loop: `{#each item in items}...{else}...{/each}`
```json
{ "type": "each", "over": "items", "as": "item", "indexAs": "i", "content": [/*AST*/] }
{ "type": "each", "over": "items", "as": "item", "content": [/*AST*/], "elseContent": [/*AST*/] }
```

**async** — promise: `{#async fetchData as data}{loading}...{error as err}...{/async}`
```json
{ "type": "async", "expression": "fetchData", "as": "data",
  "content": [/*AST*/], "loadingContent": [/*AST*/], "errorContent": [/*AST*/], "errorAs": "err" }
```

**rerender / guard** — both produce the same node type with different fields populated
```json
{ "type": "rerender", "expression": "userId", "key": null, "content": [/*AST*/] }
{ "type": "rerender", "expression": null, "key": "getStatus", "content": [/*AST*/] }
```

**template** — subtemplate: `{>itemTemplate data=item}`
```json
{ "type": "template", "name": "'itemTemplate'", "reactiveData": { "data": "item" } }
```

**snippet** — reusable section: `{#snippet footer}...{/snippet}`
```json
{ "type": "snippet", "name": "footer", "content": [/*AST*/] }
```

**slot** — content projection: `{>slot}`, `{>slot named}`
```json
{ "type": "slot" }
{ "type": "slot", "name": "named" }
```

**svg** — SVG context: `<svg>...</svg>`
```json
{ "type": "svg", "content": [/*AST rendered in SVG mode*/] }
```

### Debugging: Inspecting the AST

Use the MCP tool `validate_template` with `includeAST: true` to compile any template and inspect the resulting AST without running a component. This is the fastest way to verify what the compiler produces.

Notable patterns in real AST output:

- **Snippets are hoisted** — snippet nodes appear at the front of the AST regardless of position in the template
- **Template names are quoted expression strings** — `{>itemTemplate}` compiles to `"name": "'itemTemplate'"` because the name is an expression that gets evaluated at render time (supporting dynamic templates)
- **`rerender` and `guard` share a node type** — both produce `type: 'rerender'`. A `{#rerender expr}` sets `expression` with `key: null`. A `{#guard expr}` sets `key` with `expression: null`
- **`slot` without a name** has no `name` property (not `undefined` — absent entirely)
- **Adjacent HTML is merged** by the optimizer — you won't see consecutive `html` nodes in the output

### Nested Expression Handling

The compiler manually counts brace depth to handle expressions containing inline objects or nested sub-expressions:
=======
Here is a representative template and its compiled AST:
>>>>>>> main

```html
{#snippet badge}<span class="badge {color}">{label}</span>{/snippet}
<div class="card">
  {#async fetchUser as user}
    <h2>{user.name}</h2>
    {#each tag in user.tags}
      {>badge label=tag.name color=tag.color}
    {/each}
  {loading}
    <div class="skeleton"></div>
  {error as err}
    <p class="error">{err.message}</p>
  {/async}
  {#rerender selectedId}
    <div class="detail">{getDetail selectedId}</div>
  {/rerender}
  {>slot}
</div>
```

```json
[
  { "type": "snippet", "name": "badge", "content": [
    { "type": "html", "html": "<span class=\"badge " },
    { "type": "expression", "value": "color" },
    { "type": "html", "html": "\">" },
    { "type": "expression", "value": "label" },
    { "type": "html", "html": "</span>" }
  ]},
  { "type": "html", "html": "\n<div class=\"card\">\n  " },
  { "type": "async", "expression": "fetchUser", "as": "user",
    "content": [
      { "type": "html", "html": "\n    <h2>" },
      { "type": "expression", "value": "user.name" },
      { "type": "html", "html": "</h2>\n    " },
      { "type": "each", "over": "user.tags", "as": "tag", "content": [
        { "type": "html", "html": "\n      " },
        { "type": "template", "name": "'badge'", "reactiveData": { "label": "tag.name", "color": "tag.color" } },
        { "type": "html", "html": "\n    " }
      ]},
      { "type": "html", "html": "\n  " }
    ],
    "loadingContent": [ { "type": "html", "html": "\n    <div class=\"skeleton\"></div>\n  " } ],
    "errorContent": [
      { "type": "html", "html": "\n    <p class=\"error\">" },
      { "type": "expression", "value": "err.message" },
      { "type": "html", "html": "</p>\n  " }
    ],
    "errorAs": "err"
  },
  { "type": "html", "html": "\n  " },
  { "type": "rerender", "expression": "selectedId", "key": null, "content": [
    { "type": "html", "html": "\n    <div class=\"detail\">" },
    { "type": "expression", "value": "getDetail selectedId" },
    { "type": "html", "html": "</div>\n  " }
  ]},
  { "type": "html", "html": "\n  " },
  { "type": "slot" },
  { "type": "html", "html": "\n</div>" }
]
```

Notable patterns in the AST output:
- **Snippets are hoisted** to the front regardless of position in the template
- **Template names are quoted expression strings** — `{>badge}` compiles to `"name": "'badge'"` because the name is an expression evaluated at render time (supporting dynamic template selection)
- **`rerender` and `guard` share a node type** — `{#rerender expr}` sets `expression` with `key: null`; `{#guard expr}` sets `key` with `expression: null`
- **Adjacent HTML nodes are merged** by the optimizer — you won't see consecutive `html` nodes
- **No positional data** — the AST stores content and structure only; binding classification (attribute vs. text position) is computed by each engine during rendering

### AST Node Types

| Type | Template Syntax | Key Fields |
|------|----------------|------------|
| `html` | Static markup between expressions | `html` |
| `expression` | `{value}`, `{formatDate date}` | `value`, `unsafeHTML?`, `ifDefined?`, `booleanAttribute?` |
| `if` | `{#if cond}...{else if}...{else}...{/if}` | `condition`, `content`, `branches` |
| `each` | `{#each item in items}...{else}...{/each}` | `over`, `as`, `indexAs?`, `content`, `elseContent?` |
| `async` | `{#async expr as data}{loading}{error as e}{/async}` | `expression`, `as`, `content`, `loadingContent`, `errorContent`, `errorAs` |
| `rerender` | `{#rerender expr}` / `{#guard fn}` | `expression`, `key`, `content` |
| `template` | `{>name data=expr}` | `name`, `data?`, `reactiveData?` |
| `snippet` | `{#snippet name}...{/snippet}` | `name`, `content` |
| `slot` | `{>slot}`, `{>slot named}` | `name?` |
| `svg` | `<svg>...</svg>` | `content` (AST rendered in SVG mode) |

---

## Stage 2: defineComponent

`packages/component/src/define-component.js`

The single entry point for creating components and subtemplates. What it returns depends on whether `tagName` is provided:

- **With `tagName`** — resolves the engine, creates a web component class via `engine.factory()`, registers via `customElements.define()`, returns the class
- **Without `tagName`** — returns a prototype Template directly, used as a subtemplate via `{>name}`

Either way, it does three things:

### 1. Compile AST Once

```js
if (!ast) {
  const compiler = new TemplateCompiler(template);
  ast = compiler.compile();
}
```

The AST is compiled at definition time, not per-instance. If you pass a pre-compiled `ast`, the compiler is skipped entirely (used for SSR precompilation and CDN builds).

### 2. Create Prototype Template

```js
let prototypeTemplate = new Template({
  templateName, isPrototype: true, renderingEngine,
  ast, css, events, keys, defaultState,
  subTemplates, createComponent, onCreated, onRendered, onDestroyed, ...
});
```

The prototype is a Template that never renders. It holds the shared configuration — AST, CSS, events, keys, subTemplates, lifecycle callbacks. Each DOM instance will `clone()` from this prototype.

### 3. Optionally Register Custom Element

If `tagName` is provided, `defineComponent` calls `engine.factory()` to create a class. The factory is engine-specific:

- **Native factory** — creates a class extending `WebComponentBase` (extends `HTMLElement`), defines property accessors and `observedAttributes` via `Object.defineProperty`
- **Lit factory** — creates a class extending `LitWebComponentBase` (extends `LitElement`), uses Lit's static `properties` and `styles`

Both factories store `prototypeTemplate` as `static template` and configuration as `static config` on the class.

```js
return tagName ? webComponent : prototypeTemplate;
```

This fork is why the mental model says *"a web component is just a Template that has been given a tag name."*

---

## Stage 3: Template

`packages/templating/src/template.js`

The Template class is the lifecycle owner. It manages state, events, rendering, and the component tree. Each DOM instance gets its own Template via `clone()`. The Template is engine-agnostic — it delegates all rendering to whatever engine was selected.

### Instance Creation Flow

When a web component's `connectedCallback()` fires for the first time:

```
prototypeTemplate.clone({ data, element, renderRoot })
    |
    v
new Template(settings)          // constructor
    +-- createReactiveState()   // defaultState -> Signal instances
    |
    v
template.initialize()
    +-- createComponent()       // user's factory function, returns instance methods
    +-- extend(instance, ...)   // merge returned methods onto template.instance
    +-- instance.initialize()   // call user's initialize if defined
    +-- resolve engine          // getEngine(renderingEngine)
    +-- new RendererClass(...)  // create renderer with AST + data context
    +-- cache _callParams       // build params object for call()
    +-- onCreated()             // lifecycle hook
```

### The Data Context

`Template.getDataContext()` merges three namespaces into one flat object:

```js
getDataContext() {
  return {
    ...this.data,      // settings, spec attributes, external data
    ...this.state,     // reactive state (Signal instances)
    ...this.instance,  // createComponent return values
  };
}
```

This is the flat namespace the template sees. `{count}` resolves here, not `{state.count}`. On name collision, instance wins over state wins over data. This is intentional — it lets you refactor a value from a plain instance property to a reactive Signal to a setting without changing any template code.

### The `call()` Method

Every callback in the system (lifecycle hooks, event handlers, `createComponent`) is invoked through `Template.call()`. This method constructs the destructured parameter object that all callbacks receive:

```js
params = {
  el, self, tpl, component,     // element and instance references
  $, $$,                        // scoped Query functions
  reaction, signal, afterFlush, // reactivity primitives
  data, settings, state,        // data context layers
  isServer, isClient,           // environment detection
  isHydrating,                  // true during hydration wiring
  dispatchEvent, findParent,    // communication
  darkMode,                     // current theme
  // ...more
};
```

The params object is cached in `this.callParams` during `initialize()` — `call()` uses the cached version and only spreads `additionalData` when extra context is needed.

### Rendering

```js
render(additionalData = {}) {
  this.renderer.setData(dataContext);
  if (!this.rendered) {
    this.html = this.renderer.render();  // walk AST -> DOM (or HTML string on server)
    setTimeout(this.onRendered, 0);
  } else {
    this.renderer.bumpDataVersion();     // signal Reactions to re-evaluate
    setTimeout(this.onUpdated, 0);
  }
  this.rendered = true;
  return this.html;
}
```

The AST is walked once on first render. After that, all updates flow through per-expression Reactions — the renderer's `render()` is not called again unless the template is explicitly invalidated (e.g., `this.rendered = false`).

---

## Stage 4: Rendering Engine

The engine's job: walk the AST, produce DOM, and wire up reactive bindings. Both engines share the same `ExpressionEvaluator` for expression resolution.

### Expression Evaluation (Shared)

`packages/renderer/src/expression-evaluator.js`

Extracted into a shared module used by all renderers. The evaluator handles Lisp-style, JavaScript-style, and mixed expressions in a single cascade.

#### The Lookup Cascade in `lookupTokenValue`

For a single token (no spaces, no operators):

```
1. Literal?        '42', 'hello', true, false  -> return literal value
2. Data context?   user.name, count             -> deep property access, auto-unwrap Signals
3. JavaScript?     value + 2, isTrue ? 'a' : 'b'  -> new Function + with(Proxy) eval
4. Helper?         formatDate, capitalize       -> return helper function
```

Each tier is tried lazily. The JS eval uses `new Function('ctx', 'with (ctx) { return ... }')` with a `Proxy` that auto-unwraps Signals on property access. This isn't a workaround — the `with` + `Proxy` approach is what makes the flat data context work: Signals unwrap transparently, functions resolve, and the boundary between settings, state, and instance methods dissolves.

#### Lisp-Style Resolution in `lookupExpressionValue`

For multi-token expressions like `{formatDate date 'h:mm a'}`:

1. **Try single-token first** — if the entire expression resolves as one token, return immediately (handles simple `{count}` or `{user.name}`)
2. **Auto-paren sub-expressions** — `addParensToExpression` wraps inline `[...]` array and `{...}` object literals in parentheses so the tokenizer treats them as grouped sub-expressions rather than individual tokens. This is the bridge that makes `{helper data {key: value}}` work — the object literal becomes `(` `{key: value}` `)` which recurses into JS eval.
3. **Parse into expression array** via `getExpressionArray`: `['formatDate', 'date', "'h:mm a'"]`. Parenthesized groups become nested arrays.
4. **Walk right-to-left**, accumulating arguments
5. Each token is resolved via `lookupTokenValue` (the cascade above). Nested arrays recurse into `lookupExpressionValue`.
6. If a token resolves to a **function**, call it with accumulated arguments

```
{formatDate date 'h:mm a' { timezone: timezone }}

After auto-paren:
  formatDate date 'h:mm a' ({timezone: timezone})

Evaluation order (right to left):
  ({timezone: timezone}) -> nested group -> JS eval -> object
  'h:mm a'               -> string literal
  date                   -> data context lookup -> Date object
  formatDate             -> helper function -> call with (date, 'h:mm a', { timezone })
```

Mixed syntax works because Lisp-style tokenization handles the outer structure, explicit parens and auto-parened literals fall through to JS eval, and the right-to-left walk handles argument accumulation:

```html
{concat 'my ' (isDog ? 'simon' : 'pookie')}
```

### Native Renderer (Default Engine)

`packages/renderer/src/engines/native/renderer.js`

The native renderer uses a 3-phase pipeline:

```
AST -> buildHTMLString() -> { htmlString, entries }
                                |           |
                          parseHTML()    bindMarkers()
                                |           |
                          DocumentFragment with markers
                                |
                          TreeWalker finds markers
                                |
                          Wire reactive bindings + DynamicRegions
                                |
                          Return fragment -> append to shadow root
```

**Phase 1: buildHTMLString** (`packages/renderer/src/build-html-string.js`)
The entire AST — HTML, expressions, and block directives — is assembled into one HTML string with markers for all dynamic positions. This is a pure function shared between client and server.

Three marker types:

| Position | Marker format | Example |
|---|---|---|
| Text content | HTML comment | `<!--sui:v1:0-->` |
| Attribute value | String token | `__sui0__` |
| Block directive | HTML comment | `<!--sui-block:v1:0-->` |

Each marker has a numeric ID indexing into an `entries` array that describes what the marker represents — expression node + binding classification, or block directive node.

Binding classification (attribute vs. text position, boolean vs. quoted, property vs. event) is computed here by `analyzePosition()`, which scans backward from the expression to the last `<` or `>`.

**Phase 2: parseHTML**
```js
const template = document.createElement('template');
template.innerHTML = htmlString;
return template.content.cloneNode(true);
```

One `innerHTML` call. The browser parses the full string including markers, producing correct nesting. Parsed templates are cached by HTML string and cloned per instance.

**Phase 3: bindMarkers**
Two TreeWalker passes over the parsed DOM:
- **Element walker** — finds `__suiN__` tokens in attributes, creates Reactions for attribute bindings (string, boolean, property, event, multi-expression)
- **Comment walker** — finds `<!--sui:v1:N-->` and `<!--sui-block:v1:N-->`, creates text bindings and block directive handlers

### Per-Expression Reactivity

Each dynamic binding gets its own `Reaction`. The Reaction evaluates the expression (which reads Signals and registers dependencies), then updates just that DOM position when a dependency changes:

```
{count}  ->  Reaction
               +-- evaluates expression (reads count Signal -> registers dependency)
               +-- on Signal change: textNode.data = newValue
```

The AST is **never re-walked** for reactive updates. Each binding is an independent reactive scope. When `count` changes, only the Reaction watching that expression re-evaluates — the rest of the DOM is untouched. This is per-expression reactivity (closer to Solid than React) — no diffing, no virtual DOM, no component-level re-render.

### Block Directives and DynamicRegion

Block directives (`{#if}`, `{#each}`, `{#async}`, `{#rerender}`) use `DynamicRegion` — a lightweight DOM region that manages a persistent anchor node, owned child nodes, and hierarchical `ReactionScope` cleanup:

```js
class DynamicRegion {
  anchor        // persistent text node — stays in DOM, content inserted after it
  ownedNodes[]  // DOM nodes owned by this region
  childScopes[] // ReactionScopes for cleanup

  clear()                      // dispose scopes, remove owned nodes
  setContent(fragment, scope)  // clear old content, insert new after anchor
}
```

When a conditional branch swaps or a list item is removed, `DynamicRegion.clear()` disposes all child `ReactionScope`s (which stops Reactions, disposes children recursively, and runs dispose callbacks), then removes the owned DOM nodes. The anchor stays in place so new content can be inserted at the same position.

### Lit Renderer (Alternative Engine)

`packages/renderer/src/engines/lit/renderer.js`

The Lit renderer bridges the AST to Lit's tagged template literal API. This is the most unconventional part of the pipeline — Lit expects `html\`<div>${value}</div>\`` but the AST is a runtime data structure:

```js
render() {
  this.resetHTML();           // html = [], html.raw = [], expressions = []
  this.readAST({ ast, data });
  const renderer = this.isSVG ? svg : html;
  this.litTemplate = renderer.apply(this, [this.html, ...this.expressions]);
  return this.litTemplate;
}
```

- `this.html[]` accumulates static HTML strings (with `.raw` for Lit's escaping)
- `this.expressions[]` accumulates directive instances (reactive bindings)
- The final `html.apply(...)` call reverse-engineers what tagged template literal syntax would have produced

Each expression type maps to a Lit `AsyncDirective`: `reactiveData`, `reactiveConditional`, `reactiveEach`, `reactiveAsync`, `reactiveRerender`, `renderTemplate`. Each directive creates an internal `Reaction` and calls `this.setValue()` on change — Lit's API for updating a specific DOM position.

---

## Quick Reference

### Pipeline stages

```
Template String -> TemplateCompiler.compile() -> AST
AST -> defineComponent() -> prototype Template (shared, isPrototype: true)
prototype -> Template.clone() -> per-instance Template
Template.initialize() -> new RendererClass({ ast, data })
Renderer.render() -> DOM fragment (native) or Lit TemplateResult (lit)
```

### Engine interface

```js
{
  renderer: ClientRendererClass,      // AST -> DOM + reactive bindings
  serverRenderer: ServerRendererClass, // AST -> HTML string (optional)
  factory: createComponentFn,          // creates web component class
}
```

### Expression evaluation order

```
lookupTokenValue (single token):
  1. Literal (string/number/boolean)
  2. Data context (deep access, Signal unwrap)
  3. JavaScript eval (new Function + with + Proxy)
  4. Helper function lookup

lookupExpressionValue (multi-token):
  1. Try single-token resolution first (short-circuit for {count}, {user.name})
  2. Auto-paren: wrap [...] and {...} literals in () so they group as sub-expressions
  3. Parse to expression array (handle parens, quotes, nested groups)
  4. Walk right-to-left, resolve each token (nested arrays recurse)
  5. If token is function, call with accumulated args
```

### Key files

```
packages/templating/src/compiler/string-scanner.js        StringScanner (char-by-char parsing)
packages/templating/src/compiler/template-compiler.js      TemplateCompiler (string -> AST)
packages/templating/src/template.js                        Template (lifecycle, state, events)
packages/templating/src/template-helpers.js                Built-in template helpers

packages/component/src/define-component.js                 defineComponent (entry point)
packages/component/src/component-helpers.js                Shared helpers (properties, settings, dark mode)
packages/component/src/engines/native/base.js              WebComponentBase (extends HTMLElement)
packages/component/src/engines/native/factory.js           Native component factory
packages/component/src/engines/lit/base.js                 LitWebComponentBase (extends LitElement)
packages/component/src/engines/lit/factory.js              Lit component factory

packages/renderer/src/expression-evaluator.js              ExpressionEvaluator (shared across all engines)
packages/renderer/src/build-html-string.js                 buildHTMLString (shared HTML assembly)
packages/renderer/src/engine-registry.js                   Engine registry (registerEngine/getEngine)
packages/renderer/src/engines/native/renderer.js           Native Renderer (AST -> DOM)
packages/renderer/src/engines/native/server.js             ServerRenderer (AST -> HTML string)
packages/renderer/src/engines/native/dynamic-region.js     DynamicRegion (positional DOM management)
packages/renderer/src/engines/native/reaction-scope.js     ReactionScope (hierarchical cleanup)
packages/renderer/src/engines/lit/renderer.js              LitRenderer (AST -> Lit tagged template)
packages/renderer/src/engines/lit/directives/              6 Lit AsyncDirectives
```

---

## Related Skills

| Skill | Use when... |
|-------|-------------|
| **SSR & Hydration Pipeline** (`ssr-hydration`) | How server rendering, DSD, and hydration work end-to-end |
| **SSR & Hydration Principles** (`ssr-principles`) | The governing constraints that prevent mismatch bugs |
| **Component Templating** (`component-templating`) | Template syntax usage — what expressions to write, not how they evaluate |
| **Reactive State** (`reactive-state`) | Signals, Reactions, and the reactivity system that powers per-expression updates |
| **Component Authoring** (`component-authoring`) | How to use `defineComponent` — the user-facing API |
| **Mental Model** (`mental-model`) | Framework architecture, formalization gradient, and design decisions |
| **Native Renderer** (`native-renderer`) | Deep dive into the native renderer's internals (contributing audience) |

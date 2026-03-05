---
title: Render Pipeline — Template String to DOM
description: How a template string becomes pixels. Covers the four-stage pipeline from TemplateCompiler through defineComponent, the Template class, and LitRenderer — including expression evaluation, the tagged template literal bridge, and directive-level reactivity.
keywords: [render pipeline, template compiler, AST, LitRenderer, defineComponent, expression evaluation, lit directives, tagged template literals, StringScanner, reactivity, signals]
audience: contributing
skill: render-pipeline
---

# Render Pipeline — Template String to DOM

> **Skill:** `sui:render-pipeline`
> **Purpose:** How a template string becomes DOM. The four-stage pipeline from source text to reactive UI, for agents working on framework internals.

---

## The Pipeline

A template string passes through four stages before reaching the DOM. Each stage has a single owner.

```
Template String
     │
     ▼
┌─────────────────┐
│ TemplateCompiler │  packages/templating/src/compiler/
│                  │  string → AST (array of node objects)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ defineComponent  │  packages/component/src/define-component.js
│                  │  compiles AST once, creates prototype Template
│                  │  optionally registers custom element
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Template      │  packages/templating/src/template.js
│                  │  per-instance clone, lifecycle, state, events
│                  │  creates LitRenderer on initialize()
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   LitRenderer    │  packages/renderer/src/lit/
│                  │  walks AST → builds Lit tagged template literal
│                  │  expression evaluation, directive-level reactivity
└─────────────────┘
```

**Key invariant:** The AST is compiled once and shared. Per-instance work happens at the Template and Renderer layers, not the compiler.

---

## Stage 1: TemplateCompiler

`packages/templating/src/compiler/template-compiler.js`

The compiler transforms a template string into an AST — a flat array of node objects. It has no knowledge of rendering, reactivity, or components.

### How It Works

1. **Preprocess** — expand self-closing web component tags (`<ui-icon />` → `<ui-icon></ui-icon>`)
2. **Detect syntax** — check whether the template uses `{}` or `{{}}` brackets (one syntax per template, first expression wins)
3. **Scan** — `StringScanner` walks the string character-by-character, advancing to the next expression or SVG tag
4. **Parse tags** — for each `{expression}`, the compiler matches against regex patterns in priority order: `#if`, `#each`, `#async`, `#snippet`, `#rerender`, `#guard`, `>slot`, `>template`, `#html`, and finally plain `expression`
5. **Build AST** — two stacks drive nesting:
   - `contentStack` — tracks which node receives child AST nodes (push on open, pop on close)
   - `conditionStack` — tracks nodes that support branching (`if`, `each`, `async`)
6. **Optimize** — join adjacent HTML nodes, hoist snippets to the front

### AST Node Shapes

These are the exact shapes the compiler produces. Use `validate_template` with `includeAST: true` via MCP to inspect any template.

**html** — static markup between expressions
```json
{ "type": "html", "html": "<div class=\"container\">" }
```

**expression** — dynamic value: `{user.name}`, `{formatDate date 'h:mm a'}`
```json
{ "type": "expression", "value": "formatDate date 'h:mm a'" }
{ "type": "expression", "value": "content", "unsafeHTML": true }
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

```html
{formatDate date 'h:mm a' { timezone: timezone }}
{concat 'hi ' (isNew ? 'new' : 'old')}
```

The `getTagContent` function steps character-by-character tracking `openTags` count, only closing when it returns to zero.

### Boolean Attribute Detection

`StringScanner.getContext()` looks backward from the current position to determine if an expression is inside an HTML attribute. If the attribute is a known boolean attribute (like `disabled`, `checked`) or appears without quotes (`<div hidden={isHidden}>`), the compiler sets `booleanAttribute: true` on the AST node. This flows through to the renderer's `ifDefined` directive.

---

## Stage 2: defineComponent

`packages/component/src/define-component.js`

This is the single entry point. What it returns depends on whether `tagName` is provided:

- **With `tagName`** — registers a custom element via `customElements.define()`, returns the web component class
- **Without `tagName`** — returns a prototype Template directly, used as a subtemplate via `{>name}`

Either way, it does three things:

### 1. Compile AST Once

```js
if (!ast) {
  const compiler = new TemplateCompiler(template);
  ast = compiler.compile();
}
```

The AST is compiled at definition time, not per-instance. If you pass a pre-compiled `ast`, the compiler is skipped entirely (used for SSR precompilation).

### 2. Create Prototype Template

```js
let litTemplate = new Template({
  templateName,
  isPrototype: true,
  ast, css, events, keys, defaultState,
  subTemplates, createComponent,
  onCreated, onRendered, onDestroyed, onThemeChanged,
});
```

The prototype is a Template that never renders. It holds the shared configuration — AST, CSS, events, keys, subTemplates, lifecycle callbacks. Each DOM instance will `clone()` from this prototype.

### 3. Optionally Register Custom Element

If `tagName` is provided, `defineComponent` creates a class extending `WebComponentBase` (which extends `LitElement`) and calls `customElements.define()`. The web component class:

- Sets `static template = litTemplate` (the prototype)
- Derives `static properties` from the component spec, default settings, or explicit property config
- On `willUpdate()`, clones the prototype into a per-instance Template
- On `disconnectedCallback()`, destroys both the instance template and the prototype (cleaning up reactions, events via AbortController, mutation observers)

The final line is the fork:

```js
return tagName ? webComponent : litTemplate;
```

With `tagName`: you get a registered custom element class (web component). Without: you get the prototype Template itself, used as a subtemplate via `{>name}` in other templates. This is why the mental model says *"a web component is just a Template that has been given a tag name."*

---

## Stage 3: Template

`packages/templating/src/template.js`

The Template class is the lifecycle owner. It manages state, events, rendering, and the component tree. Each DOM instance gets its own Template via `clone()`.

### Instance Creation Flow

When a web component's `willUpdate()` fires for the first time:

```
litTemplate.clone({ data, element, renderRoot })
    │
    ▼
new Template(settings)          // constructor
    ├── createReactiveState()   // defaultState → Signal instances
    │
    ▼
template.initialize()
    ├── createComponent()       // user's factory function, returns instance methods
    ├── extend(instance, ...)   // merge returned methods onto template.instance
    ├── instance.initialize()   // call user's initialize if defined
    ├── new LitRenderer(...)    // create renderer with AST + data context
    └── onCreated()             // lifecycle hook
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

This is the flat namespace the template sees. `{count}` resolves here, not `{state.count}`. On name collision, instance wins over state wins over data. This is intentional — it lets you refactor a value from a plain instance property to a reactive Signal to a mutable setting without changing any template code.

### The `call()` Method

Every callback in the system (lifecycle hooks, event handlers, `createComponent`) is invoked through `Template.call()`. This method constructs the destructured parameter object that all callbacks receive:

```js
params = {
  el, self, tpl, component,     // element and instance references
  $, $$,                        // scoped Query functions
  reaction, signal, afterFlush, // reactivity primitives
  data, settings, state,        // data context layers
  dispatchEvent, findParent,    // communication
  isClient, isServer, darkMode, // environment
  // ...more
};
```

This is why every callback in the framework receives the same consistent shape — `call()` builds it fresh each time.

### Rendering

```js
render(additionalData = {}) {
  this.renderer.setData(dataContext);
  if (!this.rendered) {
    this.html = this.renderer.render();  // walk AST → Lit TemplateResult
    setTimeout(this.onRendered, 0);
  }
  this.rendered = true;
  return this.html;
}
```

The AST is walked once. After that, `this.html` (a Lit `TemplateResult`) is returned directly, and all updates flow through directive-level Reactions — the renderer's `render()` is not called again unless the template is explicitly invalidated.

---

## Stage 4: LitRenderer

`packages/renderer/src/lit/renderer.js`

The renderer's job: walk an AST, build a Lit tagged template literal, and wire up reactive directives.

### The Tagged Template Literal Bridge

This is the most unconventional part of the pipeline. Lit's `html` function expects tagged template literal syntax:

```js
html`<div>${value}</div>`
// Lit receives: html(['<div>', '</div>'], value)
```

But the AST is a runtime data structure, not source code. The renderer bridges this by building the arrays manually:

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
- `this.expressions[]` accumulates dynamic values (directives)
- `addValue()` inserts empty string spacers before and after each expression — Lit requires alternating string/expression slots in its tagged template format

The final `html.apply(this, [this.html, ...this.expressions])` call reverse-engineers what the tagged template literal syntax would have produced. This is not a standard Lit pattern — it's a novel bridge between AST-based compilation and Lit's tagged template API.

### AST Walk

`readAST()` iterates the AST array and dispatches by node type:

| Node Type | Handler | Produces |
|-----------|---------|----------|
| `html` | `addHTML()` | Static string appended to `html[]` |
| `expression` | `evaluateExpression()` → `reactiveData` directive | Reactive binding |
| `if` | `evaluateConditional()` → `reactiveConditional` directive | Reactive branch |
| `each` | `evaluateEach()` → `reactiveEach` directive (uses Lit `repeat()`) | Reactive list |
| `async` | `evaluateAsync()` → `reactiveAsync` directive | Promise handler with loading/error states |
| `rerender` | `evaluateRerender()` → `reactiveRerender` directive | Guard/rerender block |
| `template` | `evaluateTemplate()` → `renderTemplate` directive or inline snippet | Subtemplate |
| `snippet` | Stored in `this.snippets` map | (rendered when referenced via `{>name}`) |
| `slot` | `addHTML('<slot>')` | Native slot element |
| `svg` | `renderContent()` with `isSVG: true` | SVG-mode subtree |

### Expression Evaluation

This is the novel core of the renderer. The evaluator handles Lisp-style, JavaScript-style, and mixed expressions in a single cascade.

#### The Lookup Cascade in `lookupTokenValue`

For a single token (no spaces, no operators):

```
1. Literal?        '42', 'hello', true, false  → return literal value
2. Data context?   user.name, count             → deep property access, auto-unwrap Signals
3. JavaScript?     value + 2, isTrue ? 'a' : 'b'  → new Function + with(Proxy) eval
4. Helper?         formatDate, capitalize       → return helper function
```

Each tier is tried lazily. If tier 2 returns `undefined`, tier 3 fires. The JS eval uses `new Function('ctx', 'with (ctx) { return ${code}; }')` with a `Proxy` that auto-unwraps Signals on property access. The `with` statement works because `new Function` creates a sloppy-mode context regardless of the calling module's strict mode.

This isn't a workaround — it's the philosophical core. The framework prizes runtime dynamism over static verification (see the Types skill: *"types are a service to consumers, not a development methodology"*). The `with` + `Proxy` approach is what makes the flat data context work: Signals unwrap transparently, functions resolve without call syntax, and the boundary between settings, state, and instance methods dissolves. The same design principle that makes `{count}` work instead of `{state.count.get()}` also makes the expression evaluator use `with` instead of explicit variable binding.

#### Lisp-Style Resolution in `lookupExpressionValue`

For multi-token expressions like `{formatDate date 'h:mm a'}`:

1. Parse into expression array: `['formatDate', 'date', "'h:mm a'"]`
2. Walk **right-to-left**, accumulating arguments
3. Each token is resolved via `lookupTokenValue` (the cascade above)
4. If a token resolves to a **function**, call it with accumulated arguments
5. Nested parens `(expr)` recurse into `lookupExpressionValue`

```
{formatDate date 'h:mm a' { timezone: timezone }}

Evaluation order (right to left):
  { timezone: timezone }  → resolve inline object via JS eval
  'h:mm a'                → string literal
  date                    → data context lookup → Date object
  formatDate              → helper function → call with (date, 'h:mm a', { timezone })
```

This is why mixed syntax works — Lisp-style tokenization handles the outer structure, and parenthesized sub-expressions or inline objects fall through to JS eval:

```html
{concat 'my ' (isDog ? 'simon' : 'pookie')}
```

Here `(isDog ? 'simon' : 'pookie')` is extracted as a parenthetical group, evaluated as JS (with Signal auto-unwrap), and the result becomes an argument to `concat`.

### Directive-Level Reactivity

Each dynamic node type gets its own Lit `AsyncDirective`. The directive creates a `Reaction` that:

1. Evaluates the expression (accessing Signals, which registers dependencies)
2. On first run, returns the value for the initial render
3. On subsequent runs (when a Signal changes), calls `this.setValue()` — Lit's API for updating just that DOM position

```
{count}  →  reactiveData directive
              └── Reaction
                    ├── reads count Signal (registers dependency)
                    └── on change: this.setValue(newValue)
```

This means the AST is never re-walked for reactive updates. Each directive is an independent reactive scope. When `count` changes, only the `reactiveData` directive watching that specific expression re-evaluates — the rest of the DOM is untouched.

Directives clean up via `disconnected()` which stops the Reaction. This pairs with Template's `onDestroyed()` which calls `removeEvents()` (triggers the AbortController), `clearReactions()`, `removeObservers()`, and `removeParent()`.

### Subtree Rendering

Conditional content, loop bodies, and snippets create new `LitRenderer` instances via `renderContent()`:

```js
renderContent({ ast, data, isSVG }) {
  const tree = new LitRenderer({ ast, data, isSVG, subTemplates, snippets, helpers, template });
  this.renderTrees[contentID] = new WeakRef(tree);
  return tree.render();
}
```

Each subtree gets its own AST walk and `html[]`/`expressions[]` arrays. Subtrees inherit helpers, snippets, and subTemplates from the parent. Data updates propagate downward via `setData()` → `updateSubtreeData()`.

There is experimental `WeakRef`-based caching (`useSubtreeCache`) for reusing subtree renderers across renders, but it is currently disabled while edge cases with `{#each}` + subtemplates with distinct data contexts are resolved.

---

## Quick Reference

### Pipeline stages

```
Template String → TemplateCompiler.compile() → AST
AST → defineComponent() → prototype Template (shared, isPrototype: true)
prototype → Template.clone() → per-instance Template
Template.initialize() → new LitRenderer({ ast, data })
LitRenderer.render() → html(strings[], ...expressions[]) → Lit TemplateResult
```

### Expression evaluation order

```
lookupTokenValue (single token):
  1. Literal (string/number/boolean)
  2. Data context (deep access, Signal unwrap)
  3. JavaScript eval (new Function + with + Proxy)
  4. Helper function lookup

lookupExpressionValue (multi-token):
  1. Try single-token resolution first
  2. Parse to expression array (handle parens, quotes)
  3. Walk right-to-left, resolve each token
  4. If token is function, call with accumulated args
```

### Key files

```
packages/templating/src/compiler/string-scanner.js     StringScanner (char-by-char parsing)
packages/templating/src/compiler/template-compiler.js   TemplateCompiler (string → AST)
packages/templating/src/template.js                     Template (lifecycle, state, events)
packages/templating/src/template-helpers.js             Built-in template helpers
packages/component/src/define-component.js              defineComponent (entry point)
packages/component/src/web-component.js                 WebComponentBase (extends LitElement)
packages/renderer/src/lit/renderer.js                   LitRenderer (AST → Lit)
packages/renderer/src/lit/directives/reactive-data.js   {expression} binding
packages/renderer/src/lit/directives/reactive-conditional.js  {#if} branching
packages/renderer/src/lit/directives/reactive-each.js   {#each} iteration
packages/renderer/src/lit/directives/reactive-async.js  {#async} promise handling
packages/renderer/src/lit/directives/reactive-rerender.js    {#rerender}/{#guard}
packages/renderer/src/lit/directives/render-template.js {>template} subtemplates
```

---

## Related Skills

| Skill | Use when... |
|-------|-------------|
| **Component Templating** (`component-templating`) | Template syntax usage — what expressions to write, not how they evaluate |
| **Reactive State** (`reactive-state`) | Signals, Reactions, and the reactivity system that powers directive updates |
| **Component Authoring** (`component-authoring`) | How to use `defineComponent` — the user-facing API |
| **Framework Internals** (`internals`) | Package architecture and dependency flow across the monorepo |
| **Component Lifecycle** (`component-lifecycle`) | Lifecycle hooks and their ordering |

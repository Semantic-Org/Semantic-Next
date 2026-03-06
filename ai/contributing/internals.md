---
title: Semantic UI Framework Internals
description: Internal architecture for contributors — the Template/WebComponent relationship, AST pipeline, reactivity chain, spec system, event system, and behavior system.
keywords: [architecture, internals, packages, template, AST, renderer, specs, CSS layers, contributing]
audience: contributing
skill: internals
type: skill
dependsOn: [mental-model]
---

# Semantic UI — Framework Internals

> **Skill:** `sui:internals`
> **Purpose:** Internal architecture for contributors. Read `sui:mental-model` first for the user-facing concepts this builds on.
> **Last Updated:** 2026-03-04

---

## Prerequisite

This guide assumes familiarity with the concepts in `ai/essentials/mental-model.md` — defineComponent, template syntax, reactivity, Query, and the spec system. This document explains **how those systems work internally**.

---

## Package Dependency Graph

```
@semantic-ui/utils          ← zero dependencies, used by everything
@semantic-ui/reactivity     ← depends on utils only
@semantic-ui/query           ← depends on utils only
@semantic-ui/specs           ← depends on utils only
@semantic-ui/renderer        ← depends on reactivity, utils, lit
@semantic-ui/templating      ← depends on renderer, reactivity, query, utils
@semantic-ui/component       ← depends on templating, utils, lit
@semantic-ui/tailwind        ← depends on tailwindcss-iso
```

**The standalone trio** — `reactivity`, `query`, and `utils` have zero framework dependencies. They can be used independently in any JavaScript environment. This is a deliberate architectural principle, not an accident.

**The rendering layer** — `renderer` and `component` depend on Lit. Templates compile to a renderer-agnostic AST; the renderer translates that AST to DOM. Currently Lit-HTML is the only backend, but the AST interface is stable and a vanilla DOM renderer is architecturally viable.

### Key Source Locations

```
packages/
├── component/src/
│   ├── define-component.js    # defineComponent — the single entry point
│   ├── web-component.js       # WebComponentBase extends LitElement
│   └── helpers/               # attribute handling, property adjustment
├── templating/src/
│   ├── template.js            # Template class — the core abstraction
│   ├── template-helpers.js    # Built-in template helper functions
│   └── compiler/              # TemplateCompiler, StringScanner
├── renderer/src/
│   └── lit/
│       ├── renderer.js        # LitRenderer — AST → Lit tagged templates
│       └── directives/        # 6 AsyncDirectives for reactive bindings
├── reactivity/src/
│   ├── signal.js              # Signal class
│   ├── reaction.js            # Reaction class
│   ├── dependency.js          # Dependency tracking
│   └── scheduler.js           # Microtask-based flush scheduler
├── query/src/
│   ├── query.js               # Query class ($ / $$)
│   ├── behavior.js            # Behavior instance management
│   └── register-behavior.js   # registerBehavior — extends Query.prototype
├── specs/src/
│   ├── spec-reader.js         # SpecReader — parses specs into runtime format
│   └── helpers.js             # Shared variation/state option helpers
└── utils/src/                 # ~20 utility modules (arrays, objects, css, etc.)

src/
├── primitives/                # Spec-driven canonical UI components
│   ├── button/
│   ├── input/
│   ├── menu/
│   └── ...
├── components/                # Application-level components (docs site)
│   ├── nav-menu/
│   ├── theme-switcher/
│   └── ...
├── behaviors/                 # Reusable logic attachments
│   ├── transition/
│   ├── tooltip/
│   └── ...
├── css/                       # Global tokens and reset
│   ├── tokens/                # Design token definitions
│   └── global/                # Reset, base styles
└── specs/                     # Spec entry points and exports
```

---

## The Template ↔ WebComponent Relationship

This is the most important architectural concept for contributors.

### defineComponent Creates Both

```js
// define-component.js (simplified)
export const defineComponent = ({ tagName, template, ast, css, ... }) => {

  // 1. Compile AST once (shared across all instances)
  if (!ast) {
    const compiler = new TemplateCompiler(template);
    ast = compiler.compile();
  }

  // 2. Create prototype Template (never rendered, only cloned)
  let litTemplate = new Template({
    isPrototype: true,
    ast, css, events, defaultState,
    subTemplates, createComponent,
    onCreated, onRendered, onDestroyed,
  });

  // 3. If tagName provided, wrap in web component class
  if (tagName) {
    webComponent = class extends WebComponentBase {
      static template = litTemplate;  // shared prototype

      willUpdate() {
        if (!this.template) {
          // Clone prototype per instance
          this.template = litTemplate.clone({
            data: this.getData(),
            element: this,
            renderRoot: this.renderRoot,
          });
          this.template.initialize();
          this.component = this.template.instance;
        }
      }

      render() {
        return this.template.render(this.getData());
      }
    };
    customElements.define(tagName, webComponent);
  }

  // 4. Return web component class OR bare template
  return tagName ? webComponent : litTemplate;
};
```

**The prototype/clone pattern**: The AST is compiled once. A prototype Template is created once. Each DOM instance clones the prototype, getting its own state, element reference, and renderer — but sharing the compiled AST. This is why `defineComponent` without a `tagName` returns the prototype Template directly — subtemplates are just Templates that never get wrapped in a custom element.

### The Template Boundary

When you access `self.someMethod()` in a component, you're accessing the Template instance, not the DOM element. The Template mediates all access:

- `self` / `tpl` / `component` → `template.instance` (the object returned by `createComponent`)
- `settings` → a Proxy on the element that intercepts property access
- `$` → `template.$()` which scopes queries to that template's rendered DOM
- `state` → reactive signals created during `template.createReactiveState()`

The raw DOM element (`el`) is available but rarely needed. This separation means element native properties (`.children`, `.style`) don't collide with component methods.

---

## The AST Pipeline

```
Template String → TemplateCompiler → AST → LitRenderer → Lit TemplateResult → DOM
```

### TemplateCompiler

Location: `packages/templating/src/compiler/template-compiler.js`

The compiler uses a `StringScanner` to parse template strings into an AST. It handles both `{}` and `{{}}` bracket syntax (separate regex sets, identical output).

AST node types:
- `html` — static HTML string
- `expression` — `{value}`, `{fn arg}`, `{a + b}`
- `if` — conditional with branches (else if, else)
- `each` — loop with `as`/`in` syntax, `indexAs`, object iteration
- `async` — async block with loading/error states
- `snippet` — named reusable template section
- `template` — subtemplate reference (`{>name}`)
- `slot` — `<slot>` element
- `rerender` / `guard` — reactive re-render regions
- `svg` — SVG namespace wrapper

The AST is a plain array of objects — JSON-serializable, renderer-agnostic. Pre-compiled ASTs can be passed directly to `defineComponent` via the `ast` option, skipping the compile step entirely.

### LitRenderer

Location: `packages/renderer/src/lit/renderer.js`

Walks the AST and builds a Lit tagged template literal (`html\`...\``). Dynamic regions use Lit AsyncDirectives:

| Directive | Template Syntax | What It Does |
|-----------|----------------|--------------|
| `reactiveData` | `{expression}` | Reactive text/attribute binding |
| `reactiveConditional` | `{#if}` | Branch swap on condition change |
| `reactiveEach` | `{#each}` | Keyed list rendering via `repeat()` |
| `reactiveAsync` | `{#async}` | Promise lifecycle (loading/error/success) |
| `reactiveRerender` | `{#rerender}`/`{#guard}` | Full region re-render on dependency change |
| `renderTemplate` | `{>name}` | Subtemplate lifecycle management |

Each directive creates its own `Reaction` that tracks signal dependencies. When a signal changes, only the affected directive re-runs — not the entire template.

### Expression Evaluation

The expression evaluator (inside `LitRenderer`) is a custom language runtime:

1. **Token resolution** — looks up identifiers in the data context, auto-unwraps Signals
2. **Lisp-style application** — `{fn arg1 arg2}` → `fn(arg1, arg2)`
3. **JavaScript fallback** — `{a + b * c}` → `new Function` with `with(data)` scope
4. **Parenthetical bridging** — `{fn arg (a ? b : c)}` → Lisp outer, JS inner
5. **Literal detection** — strings (`'hello'`), numbers, booleans
6. **Deep path resolution** — `{user.address.city}` with Signal unwrap at each level

---

## The Reactivity Internals

### Signal → Dependency → Reaction → Scheduler

```
Signal.set(newValue)
  → if (!isEqual(old, new))
    → Dependency.changed()
      → subscriber.invalidate() for each Reaction
        → Scheduler.scheduleReaction(reaction)
          → Scheduler.scheduleFlush() via queueMicrotask
            → Scheduler.flush()
              → reaction.run() for each pending reaction
```

**Dependency tracking**: `Signal.get()` calls `Dependency.depend()`. If `Scheduler.current` is set (meaning we're inside a Reaction's `run()`), the Reaction is added to the Dependency's subscriber set, and the Dependency is added to the Reaction's dependency set. This bidirectional link enables cleanup.

**Clone by default**: `Signal.set()` and `Signal.get()` clone values for objects and arrays (via `maybeClone`). This prevents mutation-without-notification bugs. Class instances are not cloned (detected via `isClassInstance`). Opt out with `{ allowClone: false }`.

**Scheduler batching**: Multiple `Signal.set()` calls in the same synchronous block schedule one microtask flush. All pending Reactions run in the next microtask, ensuring consistent state.

---

## The Spec System Internals

### From Spec to Web Component Properties

A spec file (e.g., `button.spec.js`) is a structured object defining content, types, states, variations, settings, and events. The `SpecReader` class processes this into a `componentSpec` — a compact runtime format consumed by `defineComponent`.

```
button.spec.js → SpecReader.getWebComponentSpec() → button.component.js
                                                      ↓
                                              defineComponent({ componentSpec })
                                                      ↓
                                              WebComponentBase.getProperties()
                                                      ↓
                                              Lit static properties + observedAttributes
```

**Property generation** (`web-component.js:getProperties()`):
- Spec `attributes` → Lit properties with type conversion
- Spec `properties` → Lit properties without HTML attributes (functions, classes)
- Spec `optionAttributes` → alias properties (`primary` → `emphasis="primary"`)

**The `{ui}` class computation** (`web-component.js:getUIClasses()`):
- Iterates all spec attributes on the element
- Boolean attributes (`active=true`) → class name (`"active"`)
- Value attributes (`emphasis="primary"`) → value as class (`"primary"`)
- Concatenated with a trailing space for template use: `class="{ui}button"`

### Spec ↔ CSS Layer Correspondence

The spec vocabulary maps 1:1 to the CSS file structure and CSS layer names:

```
Spec Part              CSS Source File                           CSS Layer Name
─────────────────────  ───────────────────────────────────────  ──────────────────────────────
types.emphasis         css/theme/types/emphasis-variables.css    button.theme.types.emphasis
states.disabled        css/theme/states/disabled-variables.css   button.theme.states.disabled
variations.size        css/theme/variations/sizing-variables.css button.theme.variations.sizing
content.icon           css/theme/content/icon-variables.css      button.theme.content.icon
```

This correspondence is **preserved through compilation**. In production DevTools, the CSS layer name directly maps to the spec entry and source file. To modify how `disabled` looks on a button, the spec tells you the file is `css/theme/states/disabled-variables.css`.

### Primitive File Structure

```
src/primitives/button/
├── button.js              # defineComponent call
├── button.html            # Template
├── button-bundle.css      # Compiled CSS (all layers bundled)
├── button-page.css        # Document-level styles (pageCSS)
├── css/
│   ├── button.css         # Base styles
│   ├── theme/
│   │   ├── button-theme.css  # Layer imports (the 1:1 map)
│   │   ├── types/
│   │   │   ├── emphasis-variables.css
│   │   │   ├── link-variables.css
│   │   │   └── ...
│   │   ├── states/
│   │   │   ├── hover-variables.css
│   │   │   ├── disabled-variables.css
│   │   │   └── ...
│   │   ├── variations/
│   │   │   ├── sizing-variables.css
│   │   │   ├── colored-variables.css
│   │   │   └── ...
│   │   └── content/
│   │       ├── icon-variables.css
│   │       └── ...
│   └── parts/             # CSS for sub-parts
├── specs/
│   ├── button.spec.js     # Full spec (types, states, variations, examples)
│   ├── button.component.js # Compiled componentSpec (runtime format)
│   └── buttons.component.js # Plural variant spec
├── parts/                 # Sub-component definitions
├── plural/                # Plural variant (ui-buttons)
├── specs.js               # Spec exports
└── index.js               # Component exports
```

---

## Template.call() — The Callback System

Location: `packages/templating/src/template.js:672`

`Template.call()` builds the destructured parameter object passed to every callback. This is the single source of truth for what's available:

```js
params = {
  el: this.element,                    // raw DOM element
  self: this.instance,                 // createComponent return value
  tpl: this.instance,                 // alias
  component: this.instance,            // alias
  $: this.$.bind(this),               // template-scoped query
  $$: this.$$.bind(this),             // shadow-piercing query
  reaction: this.reaction.bind(this),  // create tracked Reaction
  signal: this.signal.bind(this),      // create Signal
  afterFlush: Reaction.afterFlush,
  nonreactive: Reaction.nonreactive,
  flush: Reaction.flush,
  data: this.data,
  settings: this.element?.settings,    // reactive Proxy
  state: this.state,                   // reactive state signals
  isServer: Template.isServer,
  isClient: !Template.isServer,
  rerender: () => this.element.requestUpdate(),
  dispatchEvent: this.dispatchEvent.bind(this),
  findParent: this.findParent.bind(this),
  findChild: this.findChild.bind(this),
  findChildren: this.findChildren.bind(this),
  get darkMode() { return element.isDarkMode(); },
};
```

Note that `$` is bound to the template, not the element — `this.$()` filters results to nodes owned by this specific template instance via `isNodeInTemplate()`.

---

## WebComponentBase

Location: `packages/component/src/web-component.js`

Extends `LitElement` with Semantic UI-specific functionality:

- **`getProperties()`** — generates Lit `static properties` from a componentSpec
- **`createSettingsProxy()`** — creates a reactive Proxy over element properties. Reading a setting returns the current property value; the proxy enables `settings.foo` syntax in callbacks
- **`getUIClasses()`** — computes the `{ui}` CSS class string from active spec attributes
- **`isDarkMode()`** — detects dark mode via Query on closest ancestor
- **`getContent()`** — retrieves slotted content

The `requestUpdate()` method (inherited from LitElement) is the critical interface contract — called by `Template.call()` params as `rerender()` and by `adjustPropertyFromAttribute()`. Any alternative base class must provide this method.

---

## Event System Internals

Events defined in `defineComponent({ events })` are attached via `Template.attachEvents()`.

### Event String Parsing

```
'deep click menu-item'
  ↓
modifier: 'deep'        → pierces Shadow DOM (uses $$)
eventName: 'click'
selector: 'menu-item'

'global hashchange window'
  ↓
modifier: 'global'       → attaches to window/document
eventName: 'hashchange'
selector: 'window'
```

Events are delegated — attached to the render root, not individual elements. The selector filters which events trigger the handler. The `deep` modifier uses `$$` (piercing query) instead of `$`.

### Event Handler Params

Event handlers receive the same destructured params as `Template.call()`, plus:
- `event` — the native DOM event
- `target` — event target element
- `value` — convenience: `target.value` or `target.getAttribute('value')`
- `this` — the matched element (like jQuery delegation)

---

## Behavior System Internals

Location: `packages/query/src/register-behavior.js`

`registerBehavior()` adds a method to `Query.prototype`. When called:

1. First invocation runs `setup()` — returns `sharedBehavior` preserved across instances
2. Per-element: creates a `Behavior` instance, stores it on the element via namespace
3. Subsequent calls with a string first argument invoke methods on the existing instance
4. Subsequent calls with settings re-initialize the behavior

Behaviors support mutation observers, event delegation, and CSS injection (via `adoptStylesheet` for page-level styles).

---

## Related Skills

| Skill | Use when... |
|-------|-------------|
| **Mental Model** | Understanding user-facing concepts this guide builds on |
| **CSS Tokens** | Working with design token architecture |
| **Writing Tests** | Testing components, behaviors, and framework internals |
| **Code Formatting** | Code style conventions for contributions |

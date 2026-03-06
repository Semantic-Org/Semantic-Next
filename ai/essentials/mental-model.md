---
title: Semantic UI Mental Model
description: How the framework thinks — the architectural decisions, abstraction layers, and internal mechanics that let you make good design decisions. Assumes basic orientation from sui:overview.
keywords: [mental model, architecture, template abstraction, formalization gradient, reactivity, rendering, data context, event DSL, behaviors, specs, CSS layers]
audience: essentials
skill: mental-model
type: skill
---

# Semantic UI — Mental Model

> **Skill:** `sui:mental-model`
> **Purpose:** How the framework thinks internally — the abstraction layers, rendering mechanics, and design decisions that let you make good design decisions. Load `sui:overview` first if you haven't.

This document assumes you've loaded `sui:overview` and know the basics: flat namespace, signal auto-unwrapping, `.get()` in JS, mutation helpers, Shadow DOM. This goes deeper — how the abstractions compose, how rendering works, and how to choose the right level of formalization for your task.

---

## The Template Is the Core Abstraction

The fundamental unit in Semantic UI is the **Template**, not the web component. A web component is just a Template that has been given a tag name.

`defineComponent` is a single API with two outputs:

- **With `tagName`** — registers a custom element via `customElements.define`, returns a web component class
- **Without `tagName`** — returns a Template, used as a subtemplate via `{>name}` in other templates

```js
// A web component
defineComponent({ tagName: 'my-counter', template, createComponent, ... });

// A subtemplate — same API, no tag name
const myRow = defineComponent({ template, css, createComponent, ... });
```

**Why this matters:** you author against the Template abstraction, not the DOM element. `self`, `settings`, `state`, `$`, `$$` are all scoped to the Template. The element's native properties don't pollute your component namespace, and your methods don't pollute the element. The DOM element is available via `el` when you need it, but it's not the primary interface.

When a web component is instantiated, it clones a shared prototype Template. The AST is compiled once and shared across all instances — only per-instance data (element, state, render root) is unique.

---

## The Formalization Gradient

Components aren't binary — they exist on a gradient from ad-hoc to formal. Choosing the right level prevents over-engineering simple things and under-engineering reusable ones.

| Level | What | Scope | Use When |
|-------|------|-------|----------|
| Inline HTML | Raw markup | Parent | One-off content |
| **Snippet** | `{#snippet name}...{/snippet}` | Parent's data context | Reusable sections within a template |
| **Subtemplate** | `defineComponent` without `tagName` | Own state, events, CSS | Needs own state or event handling |
| **Component** | `defineComponent` with `tagName` | Full web component | Reusable across contexts |
| **Primitive** | Component + `componentSpec` | Spec-driven API | Design system atom (`ui-button`, `ui-input`) |

**Subtemplates are first-class values** — stored in variables, passed as settings, resolved dynamically:

```js
const rowTemplate = defineComponent({ template: rowHTML, css: rowCSS, ... });
$('dynamic-table').settings({ rowTemplate, rows: data });
```
```html
{#each rows as row}
  {> template name=rowTemplate data=row}
{/each}
```

**The graduation rule:** start at the lowest level that works. Promote upward when you need more isolation. A snippet that needs its own state becomes a subtemplate. A subtemplate that's reused across pages becomes a component. A component that's part of the design system gets a spec.

---

## How the Data Context Works

The flat namespace isn't magic — it's a deliberate merge of three layers in `Template.getDataContext()`:

```
data      (settings, spec attributes, external data passed to subtemplates)
  ↓ merged with
state     (reactive state — Signal instances from defaultState)
  ↓ merged with
instance  (createComponent return values — methods and computed properties)
```

On name collision: **instance wins over state wins over data.** This is intentional — you can refactor a value from a plain property to a reactive Signal to a setting without changing any template code. The template just sees `{count}` regardless of which layer provides it.

In templates, a `Proxy` wraps this context and auto-unwraps Signals at the property-access level. In JavaScript (callbacks, `createComponent`), you access the layers directly via the destructured params — `state.count.get()`, `settings.name.get()`.

---

## How Rendering Works

Understanding the render pipeline lets you predict performance characteristics and debug rendering issues.

### The Four Stages

```
Template String → TemplateCompiler → AST (flat array of node objects)
AST → defineComponent → prototype Template (compiled once, shared)
prototype → Template.clone() → per-instance Template (state, events, lifecycle)
Template → LitRenderer → Lit TemplateResult (reactive DOM)
```

**Key invariant:** the AST is compiled once per component definition and shared across all instances. Per-instance work happens at the Template and Renderer layers. The `Proxy` overhead replaces work other frameworks do at build time — it's relocated overhead, not additional overhead.

### Per-Expression Reactivity

This is the most important rendering concept. Each `{expression}` in a template becomes its own Lit `AsyncDirective` with its own `Reaction`:

```
{count}  →  reactiveData directive
              └── Reaction
                    ├── evaluates expression (reads count Signal → registers dependency)
                    └── on Signal change: this.setValue(newValue) — updates just this DOM position
```

The AST is **never re-walked** for reactive updates. Each directive is an independent reactive scope. When `count` changes, only the directive watching that specific expression re-evaluates — the rest of the DOM is untouched.

This is why reactivity is per-expression, not per-component (closer to Solid than React). There's no diffing, no virtual DOM, no component-level re-render. A template with 50 expressions has 50 independent reactive scopes.

### The Expression Evaluator

Each expression is resolved through a cascade:

```
Single token (e.g., {count}, {user.name}):
  1. Literal?       '42', true, false       → return literal
  2. Data context?  count, user.name        → deep property access, auto-unwrap Signals via Proxy
  3. JavaScript?    value + 2, x ? 'a' : 'b' → new Function() + with(Proxy) eval
  4. Helper?        formatDate, capitalize   → return helper function

Multi-token / Lisp-style (e.g., {formatDate date 'h:mm a'}):
  1. Parse to token array
  2. Walk right-to-left, resolving each token via the cascade above
  3. When a token resolves to a function, call it with accumulated arguments
  4. Parenthesized sub-expressions (…) recurse into the evaluator
```

The JS eval uses `new Function('ctx', 'with (ctx) { return ... }')` with a `Proxy` that auto-unwraps Signals on property access. The `with` statement is what makes the flat data context work — it's the mechanism that lets `{count}` resolve without `{state.count.get()}`.

---

## Event System

Events go beyond simple delegation. The string format supports three scoping modes:

```js
events: {
  'click .button'({ self, $ }) { ... },           // standard — delegated within shadow root
  'deep click menu-item'({ self, value }) { ... }, // deep — pierces Shadow DOM boundaries
  'global hashchange window'({ self }) { ... },    // global — window/document level
}
```

- **Standard** (`'click .selector'`) — delegated event within the component's shadow root
- **Deep** (`'deep click .selector'`) — uses `$$` (piercing query) to listen across Shadow DOM boundaries
- **Global** (`'global event target'`) — attaches to `window` or `document` for app-level events

All event callbacks receive the same destructured params as every other callback, plus event-specific properties: `value` (element's value), `data` (merged dataset + event detail), `event` (native DOM event).

Events are cleaned up automatically via `AbortController` when the component is destroyed.

---

## Behavior System

Behaviors are reusable interactive patterns that attach to DOM elements via Query, independent of the component that owns the element.

```js
registerBehavior({
  name: 'transition',
  defaultSettings: { animation: '', duration: 'auto' },
  createBehavior: ({ $el, settings, self }) => ({
    animate() { ... },
    show() { ... },
  }),
});

// Attach with settings
$('.element').transition({ animation: 'fade' });

// Call methods by name
$('.element').transition('show');
```

Behaviors store their instance on the element (`el.transition`). Calling `$el.transition('show')` lazily creates the instance if needed, then calls the method. First-party behaviors include `transition`, `tooltip`, `escape`, `dropdown`, and others.

**When to use behaviors vs. components:** behaviors add interactive capability to existing elements. Components create new elements. If you're adding "fade in on scroll" to a div, that's a behavior. If you're building a date picker, that's a component.

---

## How Specs Drive the System

Specs are the formal schema for design system primitives. Understanding how they flow through the system helps you work with (or build) spec-driven components.

### From Spec to `{ui}` Classes

The `{ui}` computed class string is built by `WebComponentBase.getUIClasses()`:

1. Read the component's spec
2. For each active spec attribute (types, variations, states), look up the current value
3. Map values to CSS class names
4. Concatenate into a space-separated string

```html
<!-- If emphasis="primary" and size="large" are active: -->
<div class="{ui}button">  <!-- renders as class="primary large button" -->
```

### From Spec to CSS Architecture

Each spec entry maps 1:1 to a CSS file. This is a navigational contract:

```
Spec: states.disabled   → css/theme/states/disabled-variables.css
Spec: types.emphasis    → css/theme/types/emphasis-variables.css
```

In production, CSS layers mirror this: `layer(button.theme.states.disabled)`. Open DevTools, see the layer name, trace back to the source file.

### Three Attribute Dialects

Specs define an `optionAttributes` mapping that enables concise (`<ui-button large>`), verbose (`size="large"`), and classic (`class="large"`) attribute syntax on primitives. See `sui:overview` for examples. Ad-hoc components use standard HTML attributes only.

---

## Quick Reference

### defineComponent options
```js
defineComponent({
  tagName,            // registers custom element (omit for subtemplate)
  template,           // HTML template string
  css,                // component CSS string (scoped to shadow DOM)
  pageCSS,            // CSS adopted to document level
  componentSpec,      // spec object (primitives only)
  createComponent,    // ({ self, signal, $, $$, settings, ... }) => ({...})
  events,             // { 'click .selector': handler }
  keys,               // keyboard bindings
  defaultSettings,    // public API (external props)
  defaultState,       // internal reactive state
  subTemplates,       // { name: Template }
  onCreated,          // before DOM — setup, timers, data fetching
  onRendered,         // after render — DOM available
  onDestroyed,        // on disconnect — cleanup
  onThemeChanged,     // theme attribute changed
  onAttributeChanged, // any observed attribute changed
})
```

### Callback params
```
self                    — component instance
el                      — raw DOM element
$                       — Shadow DOM-scoped query
$$                      — Shadow DOM-piercing query
signal                  — create a Signal
reaction                — create a Reaction (auto-tracked dependencies)
settings                — reactive settings proxy
state                   — reactive state object
data                    — template data context
dispatchEvent           — fire custom events
findParent              — find nearest ancestor template (e.g., findParent('ui-form'))
findChild / findChildren — find child templates by tag name
isClient / isServer     — environment detection
rerender                — force re-render
darkMode                — current dark mode state
afterFlush              — run callback after reactive flush
nonreactive             — run code without tracking dependencies
```

### Data context merge order (last wins)
```
data (settings, external) → state (Signals) → instance (createComponent returns)
```

### Event scoping
```
'click .selector'            — standard delegated (shadow root)
'deep click .selector'       — pierces Shadow DOM
'global hashchange window'   — window/document level
```

---

## Related Skills

| Skill | Use when... |
|-------|-------------|
| **Overview** (`sui:overview`) | First contact — what SUI is, what you'd get wrong |
| **Component Authoring** (`sui:component-authoring`) | Building new components — the how-to |
| **Render Pipeline** (`sui:render-pipeline`) | Deep dive into compiler, AST, and renderer internals |
| **Reactive State** (`sui:reactive-state`) | Signals, Reactions, and the reactivity system |
| **Component Events** (`sui:component-events`) | Full event system reference |
| **Query** (`sui:query`) | The `$`/`$$` DOM library and its API |
| **Query Behaviors** (`sui:query-behaviors`) | Building and using behaviors |
| **Component Specs** (`sui:component-specs`) | Writing and reading spec definitions |

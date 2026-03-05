---
title: Semantic UI Mental Model
description: Foundational mental model for understanding what Semantic UI is, how it thinks, and how to work with it effectively. Covers component architecture, template syntax, reactivity, Query, specs, and design philosophy.
keywords: [mental model, framework, architecture, components, templates, reactivity, signals, defineComponent, shadow DOM, expressions, specs, query]
audience: essentials
skill: mental-model
---

# Semantic UI — Mental Model

> **Skill:** `sui:mental-model`
> **Purpose:** Foundational mental model for AI agents and developers working with Semantic UI — what it is, how it thinks, and how to use it effectively.
> **Last Updated:** 2026-03-04

---

## What Is Semantic UI?

Semantic UI is **two things**:

1. **A Web Component Framework** — for building reactive web components with signals-based state management, Shadow DOM encapsulation, and a novel template syntax
2. **A First-Party UI Widget Library** — ships with spec-driven primitives (`ui-button`, `ui-input`, `ui-menu`), behaviors (transition, tooltip, escape), and application components

### Why It Exists

Three design goals distinguish Semantic UI from other frameworks:

- **Natural language semantics** — Component APIs read like English. `<ui-button large primary>` is one word away from `<ui-button large>`. The diff between intent and implementation is one word. This is designed for both human comprehension and agentic AI development.
- **Zero build step** — Templates compile to an AST in sub-millisecond time in the browser. No webpack, no Vite, no bundler required. Components can be authored and run in sandboxed, serverless, or agentic environments with no tooling.
- **Opinionated infrastructure, welcoming interface** — Strong architectural decisions (signals, Shadow DOM, spec-driven design) enable bold capabilities. But the surface is deliberately flexible — multiple template syntaxes, multiple styling approaches, familiar patterns from whatever framework you came from.

---

## Core Concepts

### The Template Is the Core Abstraction

The fundamental unit in Semantic UI is the **Template**, not the web component. A web component is just a Template that has been given a tag name.

`defineComponent` is the single API for creating both:

- **With `tagName`** — registers a custom element via `customElements.define`, returns a web component class
- **Without `tagName`** — returns a Template, used as a subtemplate via `{>name}` in other templates

```js
// A full web component
defineComponent({ tagName: 'my-counter', template, createComponent, ... });

// A subtemplate — same API, no tag name
const myRow = defineComponent({ template, css, createComponent, ... });
```

When a web component is instantiated in the DOM, it clones a shared prototype Template. The AST is compiled once and shared — only per-instance data (element, state, render root) is cloned.

**Key insight**: You author against the Template abstraction. The DOM element is available via `el` if needed, but `self`, `settings`, `state`, `$`, `$$` are all scoped to the Template. The element's native properties don't pollute your component namespace, and your methods don't pollute the element.

### Destructured Parameters

Every callback receives its capabilities as destructured parameters:

```js
const createComponent = ({ self, signal, $, $$, settings, state, reaction }) => ({
  count: signal(0),
  increment() {
    self.count.increment();
  },
});

const events = {
  'click .button'({ self, $ }) {
    self.increment();
    $(this).addClass('clicked');
  },
};

const onRendered = ({ self, isClient }) => {
  if (isClient) self.initialize();
};
```

No `this` binding, no base class methods, no hook imports, no call ordering rules. Destructure what you need. `createComponent` is a function returning an object — testable and inspectable without framework ceremony.

### Expression Language

The template expression language supports **multiple calling conventions simultaneously**. This is a custom language — do not assume Handlebars, JSX, or any known template syntax.

**Lisp-style** (space-separated, no parens):
```html
{addOne value}
{concat 'hello' ' ' 'world'}
```

**JavaScript-style** (standard function calls):
```html
{addOne(value + 1)}
{isTrue ? 'yes' : 'no'}
{value + 2 * 5}
```

**Mixed** (Lisp with inline JS constructs):
```html
{formatDate date 'h:mm:ss a' { timezone: timezone }}
{concat 'my ' (isDog ? 'simon' : 'pookie')}
{join ['1', '2', '3'] ' and '}
```

All three styles work in the same template, in the same expression. The evaluator handles token resolution (signals auto-unwrap), Lisp-style function application, JS arithmetic/ternaries, inline objects/arrays, and parenthetical grouping bridging both styles.

**Bracket syntax**: Both `{expression}` and `{{expression}}` compile identically. Single braces are preferred. Double braces are available for developers from Handlebars/Angular backgrounds.

### Template Syntax Reference

```html
<!-- Expressions -->
{value}                              {user.name}
{formatDate date 'MMM d'}           {value + 2 * 5}

<!-- Conditionals -->
{#if isActive}...{/if}
{#if count > 0}...{else if count == 0}...{else}...{/if}

<!-- Loops -->
{#each item in items}{item.name}{/each}
{#each items as item}...{/each}
{#each key value in object}...{/each}

<!-- Async -->
{#async fetchData as data}
  {data.result}
{loading}Loading...{error as err}{err.message}{/async}

<!-- Snippets and Subtemplates -->
{#snippet mySection}<div>{sharedData}</div>{/snippet}
{>mySection}
{>mySubTemplate data=someData name=dynamicName}

<!-- Slots, Raw HTML, Reactive Regions -->
{>slot}              {>slot named}
{#html rawContent}
{#rerender key}...{/rerender}
{#guard expression}...{/guard}
```

### Snippets vs Subtemplates

A natural gradient from ad-hoc to formal:

| Level | What | Scope | Use When |
|-------|------|-------|----------|
| Inline HTML | Raw markup | Parent | One-off content |
| **Snippet** | `{#snippet name}` | Parent's data context | Reusable sections within a template |
| **SubTemplate** | `defineComponent` without `tagName` | Own state/events/CSS | Needs own state or events |
| **Component** | `defineComponent` with `tagName` | Full web component | Reusable across contexts |

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

---

## Reactivity

### Signals and Reactions

Inspired by Meteor's Tracker — automatic dependency tracking where reading a signal inside a reaction auto-subscribes. Modernized with safety-first defaults.

```js
const createComponent = ({ signal, reaction, self }) => ({
  count: signal(0),
  doubled: signal(0),
  initialize() {
    reaction(() => {
      self.doubled.set(self.count.get() * 2);
    });
  },
});
```

**How it works**: `Signal.get()` inside a `Reaction` registers the signal as a dependency. When the value changes, the reaction is scheduled for re-execution via `queueMicrotask`.

**Key defaults (all overridable)**:
- **Clone by default** — Prevents "mutated but nothing updated" footgun. Opt out: `{ allowClone: false }`
- **Deep equality** — Skips no-op updates via `isEqual`. Override: custom `equalityFunction`
- **Batched updates** — Multiple signal changes in one synchronous block trigger one flush

**Signal convenience methods**:
```js
count.increment()                    // numeric
count.toggle()                       // boolean
todos.push(newItem)                  // array
todos.setProperty(id, 'done', true)  // find by ID, set property
```

### Reactivity is Standalone

`@semantic-ui/reactivity` has zero framework dependencies. Signals and Reactions work anywhere — Node.js, browser console, any DOM library. Not tied to the rendering system.

---

## Query — The Imperative DOM Layer

`$` (Query) is a Shadow DOM-aware DOM manipulation library with two purposes:

1. **DOM operations** — jQuery-style API that works within Shadow DOM
2. **Behavior attachment** — Extensible via `registerBehavior`

```js
$('.button').addClass('active');       // within shadow root
$$('menu-item').attr('active', '');    // pierces Shadow DOM
$('.element').transition({ animation: 'fade' });  // behavior
```

`$` respects Shadow DOM boundaries by default. `$$` pierces through them. This is the escape hatch that makes Shadow DOM practical — encapsulation without being trapped.

### Event DSL

```js
const events = {
  'click .button'({ self, $ }) { ... },          // standard delegated
  'deep click menu-item'({ self, value }) { ... }, // pierces Shadow DOM
  'global hashchange window'({ self }) { ... },    // window/document
};
```

### Behaviors

Reusable logic modules that attach to DOM elements via Query:

```js
registerBehavior({
  name: 'transition',
  defaultSettings: { animation: '', duration: 'auto' },
  createBehavior: ({ $el, settings, self }) => ({
    animate() { ... },
    show() { ... },
  }),
});

$('.element').transition({ animation: 'fade' });
$('.element').transition('show');  // call methods by name
```

---

## Component Authoring

Most components are simple — a template, some CSS, and reactive state. Here's a complete component:

```js
import { defineComponent } from '@semantic-ui/component';

defineComponent({
  tagName: 'current-time',
  template: `Time is <b>{formatDate time "h:mm:ss a"}</b>`,
  css: 'b { color: var(--primary-text-color); }',
  defaultState: { time: new Date() },
  onCreated({ state }) {
    setInterval(() => state.time.now(), 1000);
  },
});
```

```html
<current-time></current-time>
```

That's it — template, CSS, and state can all be inline. As components grow, extract them to separate files:

```js
import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const createComponent = ({ state }) => ({
  initialize: () => setInterval(() => state.counter.increment(), 1000),
  isEven: (number) => (number % 2 == 0),
});

defineComponent({
  tagName: 'ui-counter',
  template, css,
  defaultState: { counter: 0 },
  createComponent,
});
```

Primitives (like `ui-button`) add a `componentSpec` for formal type/state/variation definitions — see [The Spec System](#the-spec-system--primitives-only) below.

### Settings and State

**Settings** are the public API (props). Set via HTML attributes or programmatically:

```js
const defaultSettings = { animation: 'fade', duration: 300 };
$('my-component').settings({ animation: 'slide' });
```

Settings are backed by a reactive Proxy — changes automatically re-render affected regions.

**State** is internal reactive data. Use `defaultState` for simple values, or `signal()` in `createComponent` for explicit control. Both are automatically available in the template data context.

---

## The Spec System — Primitives Only

Specs are the formal schema for **primitives** — the canonical UI atoms (`ui-button`, `ui-input`, `ui-menu`). Specs are NOT used for ad-hoc components.

A spec defines **types**, **states**, **variations**, **content**, **settings**, and **events**. This single definition drives three concerns:

1. **Runtime** — Web component properties, attribute handling, `{ui}` CSS class generation
2. **CSS architecture** — Spec structure mirrors the CSS layer hierarchy 1:1
3. **Documentation** — Auto-generated examples and code samples

### The `{ui}` Class Pattern

`{ui}` expands to CSS classes from active spec attributes:

```html
<div class="{ui}button">  <!-- renders as class="primary large button" -->
```

### Specs as a Navigational Map

Each spec entry corresponds to a specific CSS file. This survives compilation:

```
Spec: states.disabled   → css/theme/states/disabled-variables.css
Spec: types.emphasis     → css/theme/types/emphasis-variables.css
```

In production CSS layers: `layer(button.theme.states.disabled)`. Open DevTools, see the layer name, trace back to the source file. Nothing is obfuscated.

### The Maturity Gradient

Components move from ad-hoc → stabilized → primitive. The spec formalizes the graduation. `src/components/` holds application components; `src/primitives/` holds spec-driven canonical UI.

---

## CSS and Styling

- **Design tokens** — CSS custom properties anchored to `--base-size: 14` and `--base-spacing: 16`. Light/dark themes via token overrides.
- **Shadow DOM encapsulation** — Component styles are isolated. `pageCSS` in `defineComponent` adopts styles to the document level when needed.
- **Tailwind in Shadow DOM** — `@semantic-ui/tailwind` uses a modified Tailwind engine (`tailwindcss-iso`) that compiles at runtime in the browser, inside Shadow DOM, without special security headers.

```js
import { TailwindPlugin } from '@semantic-ui/tailwind';
let definition = { tagName: 'my-component', template, css };
definition = await TailwindPlugin(definition);
defineComponent(definition);
```

---

## Package Architecture

```
@semantic-ui/reactivity  — Signal, Reaction, Dependency, Scheduler (standalone)
@semantic-ui/query        — $, $$, behaviors (standalone)
@semantic-ui/utils        — Shared utilities (standalone)
@semantic-ui/specs        — Spec reader, variation/state helpers
@semantic-ui/renderer     — LitRenderer + directives (rendering backend)
@semantic-ui/templating   — Template class, TemplateCompiler
@semantic-ui/component    — defineComponent, WebComponentBase
@semantic-ui/tailwind     — TailwindPlugin for Shadow DOM
```

**Independence is deliberate**: `reactivity`, `query`, and `utils` have zero framework dependencies — they work anywhere. The rendering layer uses Lit-HTML but the AST is renderer-agnostic.

**Dependency flow**: `reactivity` ← `query` (both standalone) ← `templating`/`renderer` ← `component`

---

## Quick Reference

### defineComponent options
```js
defineComponent({
  tagName,            // registers custom element (omit for subtemplate)
  template,           // HTML template string
  css,                // component CSS string
  pageCSS,            // CSS adopted to document level
  componentSpec,      // spec object (primitives only)
  createComponent,    // ({ self, signal, $, $$, settings, ... }) => ({...})
  events,             // { 'click .selector': handler }
  keys,               // keyboard bindings
  defaultSettings,    // public props
  defaultState,       // internal reactive state
  subTemplates,       // { name: Template }
  onCreated,          // lifecycle
  onRendered,
  onDestroyed,
  onThemeChanged,
  onAttributeChanged,
})
```

### Callback params available in createComponent, events, lifecycle
```
self / tpl / component  — component instance
el                      — raw DOM element
$                       — Shadow DOM-scoped query
$$                      — Shadow DOM-piercing query
signal                  — create a Signal
reaction                — create a Reaction
settings                — reactive settings proxy
state                   — reactive state object
data                    — template data context
dispatchEvent           — fire custom events
findParent / findChild  — template tree traversal
isClient / isServer     — environment detection
rerender                — force re-render
darkMode                — current dark mode state
```

### Philosophy

| Principle | Manifestation |
|-----------|--------------|
| Natural language semantics | `<ui-button large>` — one word per intent |
| Zero build step | AST compiles in-browser, works in sandboxed environments |
| Meet you where you are | `{}`/`{{}}`, Lisp/JS expressions, Tailwind/tokens |
| Opinionated infrastructure | Signals, Shadow DOM, specs — non-negotiable |
| Welcoming interface | Multiple syntaxes, flexible styling, familiar patterns |
| Progressive formalization | Snippet → subtemplate → component → primitive |
| Template as core abstraction | Web components are Templates with a tag name |
| Destructured everything | Every capability as a named parameter |

---

## Related Skills

| Skill | Use when... |
|-------|-------------|
| **Architecture** | Contributing to the framework internals, understanding package structure |
| **CSS Tokens** | Working with design tokens and theming |
| **Style Components** | Customizing component appearance |
| **Use Components** | Using SUI primitives in your application |
| **Creating Components** | Building new components with the framework |

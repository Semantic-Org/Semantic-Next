---
title: What Is Semantic UI
description: Conceptual overview of Semantic UI for agents and developers with no prior exposure — what it is, what makes it novel, how it fits into the landscape of web frameworks, and what you'd get wrong without being told.
keywords: [overview, introduction, framework, web components, signals, reactivity, templating, expression language, specs, natural language, no compile step, shadow DOM, tailwind, design system]
audience: essentials
skill: overview
---

# What Is Semantic UI

> **Skill:** `sui:overview`
> **Purpose:** Conceptual orientation for agents encountering Semantic UI for the first time — what it is, what makes it genuinely novel, and what you'd get wrong without being told.

---

## A Component Framework for the Web

Semantic UI is a component framework in the same category as React, Vue, and Svelte. You build interactive web applications with it: define components, write templates, manage reactive state, handle events, compose UIs. If you know what `useState` or `ref()` or `$:` does, you know the problem space.

Components render as **standard web components** — real custom elements with Shadow DOM, registered via `customElements.define`. They work in any framework, any page, any context that supports HTML. No wrapper, no adapter, no interop layer.

On top of the framework, Semantic UI ships a **first-party design system** — a library of polished UI primitives (`<ui-button>`, `<ui-card>`, `<ui-modal>`, `<ui-menu>`, etc.) built with the framework itself. These two layers are independent: you can use the framework to build your own components without touching the design system, or use the design system components without understanding the framework internals.

The project is a multi-year ground-up rewrite of Semantic UI Classic, which reached 50,000+ GitHub stars as a jQuery-based UI framework. This version shares the design philosophy — natural language, human-readable markup — but shares no code. Everything is new.

---

## Runtime-First Architecture

Semantic UI requires no build step, but the claim needs precision — React and Vue also work from CDN script tags. The difference is in what "compilation" means and what it costs.

When frameworks like Vue offer runtime template compilation, they're doing real work: parsing templates, running optimization passes (static node hoisting, patch flag analysis), generating JavaScript render function source code, and evaluating it via `new Function()`. Vue's runtime compiler adds ~14KB to the bundle and is slow enough that pre-compilation is recommended for production.

SUI's `TemplateCompiler` does something qualitatively lighter: it **tokenizes** the template string into a flat array of AST nodes — simple objects like `{ type: 'expression', value: 'count' }` and `{ type: 'if', condition: 'isActive' }`. There are no optimization passes and no code generation step. The AST is consumed directly by the renderer. This runs once per component prototype (shared across all instances), typically completes in sub-millisecond time, and is imperceptible.

The intelligence lives not in a compiler but in the **runtime expression evaluator**. Expressions are resolved on each render through `new Function` + `with` + `Proxy` — a mechanism that auto-unwraps signals, flattens the data context, and handles the dual Lisp/JS syntax without any source code transformation. This is the architectural trade other frameworks don't make: instead of shifting complexity to build time, SUI keeps it at runtime, where the `Proxy` can do things a static compiler cannot (like transparently unwrapping signals in arbitrary JavaScript expressions the framework has never seen before).

What this enables in practice:

- **Signals auto-unwrap in templates** — write `{count}`, not `{count.get()}` or `{count.value}`
- **A custom expression language** that mixes Lisp-style and JavaScript-style syntax freely — parsed and evaluated at runtime
- **Fine-grained reactivity** at the individual expression level — each `{expression}` is its own reactive scope
- **Scoped CSS** via native Shadow DOM — no build-time extraction
- **Tailwind CSS inside Shadow DOM** — the `TailwindPlugin` compiles Tailwind v4 at runtime via WASM (`tailwindcss-iso`), with full support for `@theme`, `@utility`, and `@custom-variant`

---

## The Expression Language

This is the most novel feature. Semantic UI's templates support a **dual expression syntax** — Lisp-style and JavaScript-style — that can be mixed freely within the same expression.

**Lisp-style** — space-separated arguments, no parentheses, evaluated right-to-left:
```html
{formatDate date 'h:mm a'}
{concat 'Full name: ' (formatName firstName lastName)}
{classMap { active: isSelected, disabled: isLocked }}
```

**JavaScript-style** — standard JS with full access to the language:
```html
{items.find(i => i.active).name}
{Math.max(...scores)}
{status === 'success' ? 'Passed' : 'Failed'}
{`${items.length} of ${stats.total} items`}
```

**Mixed** — Lisp structure with JS sub-expressions:
```html
{concat 'hi ' (isDog ? 'simon' : 'pookie')}
{formatDate date 'h:mm a' { timezone: timezone }}
{concat 'Max: ' (Math.max(...scores)) ', Min: ' (Math.min(...scores))}
```

All of this resolves against a **flat data context**. Settings, state, and component methods share one namespace — `{count}` looks up `count` across all of them. Signals unwrap automatically. There is no `{state.count}` or `{settings.name}` — just `{count}` and `{name}`.

This isn't a template language with some JS escape hatches bolted on. It's a unified expression evaluator that treats Lisp-style calls and JavaScript as equal citizens, resolved at runtime through the same evaluation pipeline.

---

## How You Define Components

A minimal component is just a template:

```js
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

A full component can include reactive state, settings (external API), lifecycle hooks, event handlers, keybindings, subtemplates, and a `createComponent` factory that defines the component's methods:

```js
defineComponent({
  tagName: 'ui-search',
  template,
  css,
  defaultState: { searchTerm: '', results: [] },
  defaultSettings: { minChars: 1 },
  createComponent: ({ self, state, settings }) => ({
    async getResults(term) { /* ... */ },
    canSearch() { return state.searchTerm.get().length >= settings.minChars; },
  }),
  events: {
    'input ui-input'({ state, value }) { state.searchTerm.set(value); },
    'click .result'({ self, data }) { self.selectResult(data); },
  },
  keys: {
    'up': ({ self }) => self.selectPrevious(),
    'down': ({ self }) => self.selectNext(),
    'esc': ({ self }) => self.clearSearch(),
  },
});
```

Every callback receives the same destructured parameter object — `{ self, state, settings, $, $$, reaction, signal, dispatchEvent, findParent, isClient, isServer, ... }`. You never import framework utilities or manage dependency injection. Everything you need is in the callback params.

Without a `tagName`, `defineComponent` returns a subtemplate instead of registering a web component — same API, different output. A web component is just a template that has been given a tag name.

---

## Reactivity

Semantic UI's reactivity is signal-based, similar to Solid or Preact Signals. Signals are reactive primitives that track dependencies and update subscribers automatically.

What's different:

- **Mutation helpers** — signals have built-in methods for common operations. Never get-mutate-set:

  ```js
  state.count.increment()       // not: state.count.set(state.count.get() + 1)
  state.items.push(item)        // not: const arr = state.items.get(); arr.push(item); state.items.set(arr)
  state.active.toggle()         // not: state.active.set(!state.active.get())
  state.time.now()              // sets to current Date
  state.list.removeItem(item)   // removes by value
  state.obj.setProperty(k, v)   // sets a nested property
  ```

- **Auto-unwrapping in templates** — `{count}` resolves the signal automatically. No `.get()`, no `.value`, no unwrap syntax.

- **Directive-level granularity** — each `{expression}` in a template is its own reactive scope. When a signal changes, only the specific DOM nodes that depend on it re-evaluate. The template AST is never re-walked.

---

## Shadow DOM and Styling

Every component renders in its own Shadow DOM. This means:

- **Style encapsulation** — component CSS doesn't leak out, page CSS doesn't leak in
- **`::part()` for external styling** — components expose named parts that can be styled from outside
- **CSS custom properties pierce through** — the design token system uses CSS variables, which cascade into shadow roots naturally

Theming is an attribute, not a media query:

```html
<html dark>                    <!-- page-wide dark mode -->
<aside dark>                   <!-- section-level override -->
<ui-card light>                <!-- component-level override -->
```

The token system (`--standard-*`, `--primary-color`, `--spacing`, etc.) recalculates automatically when the theme changes. Components built with tokens adapt to light/dark mode with zero theme-specific CSS.

**Tailwind works too.** The `TailwindPlugin` scans your entire component definition for Tailwind class usage, compiles the CSS at runtime via WASM, and injects it into the component's Shadow DOM. Tailwind v4 features (`@theme`, `@utility`, `@custom-variant`) all work. No build step.

---

## Specs: The AI Contract

Most components are ad-hoc — you define them with `defineComponent`, write your template, manage your own state. This is how the framework is typically used, and it's all you need to build applications.

**Specs** are a separate, more opinionated layer designed for **design system components** — the kind of polished, reusable primitives that ship in a component library. A spec is a JavaScript module that formally defines every valid attribute, content area, state, variation, and event for a component:

```js
// button.spec.js
export default {
  name: 'Button',
  tagName: 'ui-button',
  types: [
    { name: 'Emphasis', attribute: 'emphasis',
      options: [
        { name: 'Primary', value: 'primary', description: 'be emphasized as the first action' },
        { name: 'Secondary', value: 'secondary' },
      ]},
  ],
  variations: [
    { name: 'Size', attribute: 'size',
      options: [
        { name: 'Small', value: 'small' },
        { name: 'Large', value: 'large' },
      ]},
  ],
  // ... content, states, settings, events
};
```

This spec is a **contract with AI agents**. An agent can read the spec and know exactly what markup is valid — what attributes exist, what values they accept, how they combine. The golden rule for spec-driven components: **if it's not in the spec, don't use it.**

Specs also enable the three attribute dialects on first-party primitives:
```html
<ui-button large>              <!-- concise — reads like natural language -->
<ui-button size="large">       <!-- verbose — explicit attribute name -->
<ui-button class="large">      <!-- classic — CSS class syntax -->
```

These dialects exist because the spec defines the `optionAttributes` mapping that makes them possible. Ad-hoc components don't have specs and don't support this — they use standard HTML attributes.

Specs also power auto-generated documentation, the `{ui}` computed class string in templates, and the `usageLevel` hints that tell agents which features are common (1) versus rare (5).

---

## Query: Shadow DOM-Aware DOM Manipulation

Query is SUI's lightweight DOM library — a jQuery-like `$` function for selecting elements, binding events, and manipulating the DOM. If you've used jQuery, it works as you'd expect.

The key addition: `$$` does everything `$` does but **pierces through Shadow DOM boundaries**, recursing through every shadow root to find elements.

```js
$('ui-button')                 // selects in the current scope
$$('ui-dropdown .item')        // reaches inside shadow DOM
$('ui-modal').component()      // access the component instance
```

Query is available as a standalone package (`@semantic-ui/query`) and is also provided as `$` and `$$` in every component callback.

---

## How It Compares

| Concept | Semantic UI | React | Vue | Svelte | Solid |
|---------|------------|-------|-----|--------|-------|
| Component definition | `defineComponent({})` | Function + hooks | `<script setup>` / Options API | `.svelte` file | Function + `createSignal` |
| Templating | Custom language (Lisp/JS dual syntax) | JSX | Vue templates | Svelte templates | JSX |
| Reactivity | Signals with mutation helpers | `useState` / re-render | `ref()` / `reactive()` | `$:` compiler magic | Fine-grained signals |
| Compile step | **None** — runs at runtime | JSX transform | SFC compiler | Full compiler | JSX transform |
| Output | Standard web components | Virtual DOM | Virtual DOM | Compiled DOM ops | Fine-grained DOM |
| Style scoping | Shadow DOM (native) | CSS Modules / CSS-in-JS | Scoped styles (compiled) | Scoped styles (compiled) | CSS Modules |
| DOM manipulation | Query (`$`, `$$`) | Refs | Refs / `$el` | `bind:this` | Refs |
| AI integration | Specs as machine-readable API | None | None | None | None |
| Tailwind in components | Runtime WASM compilation | Build step | Build step | Build step | Build step |

---

## What You'd Get Wrong

These are the things an AI agent would most likely hallucinate or assume incorrectly when generating Semantic UI code without guidance:

**Flat data context.** Templates merge settings, state, and instance methods into one namespace.
```html
{count}          <!-- correct -->
{state.count}    <!-- wrong -->
{settings.name}  <!-- wrong -->
```

**Signal auto-unwrapping.** Signals resolve automatically in templates.
```html
{count}          <!-- correct -->
{count.get()}    <!-- wrong -->
{count.value}    <!-- wrong -->
```

**Signal mutation helpers.** Use built-in methods directly — never get-mutate-set.
```js
state.items.push(x)      // correct
// not: const arr = state.items.get(); arr.push(x); state.items.set(arr);
```

**`{ui}` is a computed class string.** In spec-driven components, `{ui}` expands to CSS classes from active spec attributes. It is not a variable you define.
```html
<div class="{ui}button">  <!-- outputs: <div class="primary large button"> -->
```

**Shadow DOM is the default.** Every component's CSS is scoped. External selectors cannot reach inside. Use CSS variables or `::part()` to customize from outside.

**Theming is an attribute.** Set `dark` or `light` on any element — not a media query, not a JS toggle, not a class convention.

**Specs are for design system components.** Most components you build won't have specs. Specs are for polished primitives that need a machine-readable API contract.

**No compile step means no build requirement.** SUI works from a CDN `<script>` tag. Build tools are optional, not required.

---

## How to Learn More

If Semantic UI MCP tools are available, use them to load specific skills:

| Task | Skill |
|------|-------|
| Use first-party components | `sui:use-components` |
| Build custom components | `sui:component-authoring` |
| Write component CSS | `sui:component-css` |
| Write component templates | `sui:component-templating` |
| Understand reactivity | `sui:reactive-state` |
| Style components from outside | `sui:style-components` |
| Use design tokens | `sui:design-tokens` |
| Control themes | `sui:adjust-theme` |
| Use Tailwind in components | `sui:component-tailwind` |
| Use the Query DOM library | `sui:query` |
| Understand the render pipeline | `sui:render-pipeline` |

Use `list_components` and `get_component` to retrieve specs for first-party UI primitives. Use `search` to find content by keyword across all skills, docs, and examples.

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Use Components** | `sui:use-components` | Using first-party UI primitives in markup |
| **Component Authoring** | `sui:component-authoring` | Building custom components with `defineComponent` |
| **Reactive State** | `sui:reactive-state` | Working with signals, reactions, and the reactivity system |
| **Component Templating** | `sui:component-templating` | Template syntax — expressions, conditionals, loops, async |
| **Design Tokens** | `sui:design-tokens` | Available CSS tokens for colors, spacing, typography |

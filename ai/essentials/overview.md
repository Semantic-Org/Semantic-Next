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

Semantic UI is a component framework in the same category as React, Vue, and Svelte. Components render as **standard web components** — real custom elements with Shadow DOM, registered via `customElements.define`. They work in any framework, any page, any context that supports HTML.

The framework has two independent layers: a **component framework** for building web components (`defineComponent`, signals, templates, Query), and a **first-party design system** — polished UI primitives (`<ui-button>`, `<ui-card>`, `<ui-modal>`, etc.) built with the framework itself. You can use either layer without the other.

**Scope of this document:** This orients you on what SUI is, what's genuinely novel, and what you'd get wrong without being told. It does not teach template syntax or component authoring — load task-specific skills for those (see Related Skills at the end). For deeper framework internals, load `sui:mental-model`.

---

## What You'd Get Wrong

These are the corrections that prevent the most common hallucinations. They're first because they're the highest-value content in this document.

**Flat data context.** Templates merge settings, state, and instance methods into one namespace — there is no `state` or `settings` object to access.
```html
{count}          <!-- correct -->
{state.count}    <!-- wrong — no namespace prefix -->
{settings.name}  <!-- wrong -->
```

**Signal auto-unwrapping.** The runtime `Proxy` unwraps signals at the property-access level, so templates never need explicit unwrap calls.
```html
{count}          <!-- correct -->
{count.get()}    <!-- wrong — Proxy handles this -->
{count.value}    <!-- wrong -->
```

**Signal mutation helpers.** Signals expose type-appropriate convenience methods. Use them instead of the get-mutate-set round-trip.
```js
state.items.push(x)      // correct — mutates with change detection
state.active.toggle()    // correct
state.count.increment()  // correct
// wrong: const arr = state.items.get(); arr.push(x); state.items.set(arr);
```
`.set(value)` is correct for direct replacement (`state.loading.set(true)`). The anti-pattern is reading, mutating externally, then setting back.

**`{ui}` is a computed class string.** In spec-driven components, `{ui}` expands to CSS classes from active spec attributes. It is not a variable you define.
```html
<div class="{ui}button">  <!-- outputs: <div class="primary large button"> -->
```

**Shadow DOM is the default.** Every component's CSS is scoped. External selectors cannot reach inside. Use CSS variables or `::part()` to customize from outside.

**Theming is an attribute.** Set `dark` or `light` on any element — not a media query, not a JS toggle, not a class convention.

**Specs are for design system components.** Most components you build won't have specs. Specs are for polished primitives that need a machine-readable API contract.

---

## Runtime-First Architecture

SUI makes an architectural bet other frameworks don't: **everything is evaluated at runtime through a `Proxy`-based expression evaluator**, instead of compiling templates to JavaScript at build time. Understanding this single decision lets you predict how the entire framework behaves.

When you write `{count}` in a template, there is no compiler transforming that into `count.get()` or a render function. At runtime, a `Proxy` intercepts the property access, discovers `count` is a signal, and unwraps it transparently. This means signal auto-unwrapping works for *any* expression — not just patterns the framework has seen before. An arbitrary JavaScript expression like `{items.filter(i => i.active).length}` resolves signals at every property access, automatically, because the `Proxy` operates at the language level, not the syntax level.

**Why this is viable, not reckless:** the "compile step" is tokenization — the template string is parsed once per component prototype into a flat AST of simple objects like `{ type: 'expression', value: 'count' }`. No optimization passes, no code generation, sub-millisecond. And reactivity is fine-grained: each `{expression}` is its own reactive scope, so when a signal changes, only the specific DOM nodes that depend on it re-evaluate. The template is never re-walked.

**What this unlocks:**

- **Signal auto-unwrapping** — `{count}`, not `{count.get()}`. Works in any expression, because the `Proxy` handles it, not a syntax transform
- **The dual expression language** — Lisp-style and JavaScript-style syntax mixed freely, evaluated at runtime by a single expression evaluator
- **No build tooling dependency** — the framework is self-contained. No transpiler, no bundler plugin, no framework-specific CLI
- **Serverless and edge viability** — negligible compile overhead + native DOM APIs (real Shadow DOM, standard custom elements) means the framework runs performantly in environments where cold-start time matters
- **Runtime Tailwind** — the `TailwindPlugin` compiles Tailwind v4 inside Shadow DOM via WASM, including `@theme`, `@utility`, and `@custom-variant`
- **Scoped CSS** via native Shadow DOM — no build-time extraction

**The honest cost:** runtime `Proxy` overhead on each expression evaluation. This is acceptable because reactivity is per-expression (not per-component), tokenization is cached per prototype (not per instance), and the `Proxy` replaces work that other frameworks do at build time — it's not additional overhead, it's *relocated* overhead.

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

## Template Control Flow

Templates use `{#keyword}` blocks for control flow. This is the minimum syntax to avoid guessing wrong — load `sui:component-templating` for the full reference.

```html
{#if isActive}                          <!-- conditional -->
  <span>Active</span>
{else if isPending}
  <span>Pending</span>
{else}
  <span>Inactive</span>
{/if}

{#each items as item}                   <!-- iteration -->
  <div>{item.name}</div>
{/each}

{>slot}                                 <!-- default slot (content projection) -->
{>slot named}                           <!-- named slot -->
{>mySubtemplate}                        <!-- render a subtemplate -->
```

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

A full component can include reactive state, settings (external API), lifecycle hooks, event handlers (keyed by `'event selector'`), keybindings, subtemplates, and a `createComponent` factory that defines the component's methods:

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

Signal-based, similar to Solid or Preact Signals. What's different:

- **Mutation helpers** — signals have built-in methods for common operations:

  ```js
  state.count.increment()       // not: state.count.set(state.count.get() + 1)
  state.items.push(item)        // not: const arr = state.items.get(); arr.push(item); state.items.set(arr)
  state.active.toggle()         // not: state.active.set(!state.active.get())
  state.time.now()              // sets to current Date
  state.list.removeItem(item)   // removes by value
  state.obj.setProperty(k, v)   // sets a nested property
  ```

  `.set(value)` is correct for direct replacement — `state.searchTerm.set(newValue)`, `state.loading.set(true)`. The anti-pattern is the get-mutate-set round-trip: reading a value, mutating it externally, then setting it back. That's what the helpers handle internally with proper change detection.

- **Auto-unwrapping in templates** — `{count}` resolves the signal automatically. No `.get()`, no `.value`, no unwrap syntax.

- **Directive-level granularity** — each `{expression}` in a template is its own reactive scope. When a signal changes, only the specific DOM nodes that depend on it re-evaluate. The template AST is never re-walked.

---

## Shadow DOM and Styling

Every component renders in its own Shadow DOM. The non-obvious parts:

**Theming is an attribute**, not a media query — set `dark` or `light` on any element at any level:
```html
<html dark>                    <!-- page-wide -->
<aside dark>                   <!-- section override -->
<ui-card light>                <!-- component override -->
```

The token system (`--standard-*`, `--primary-color`, `--spacing`, etc.) recalculates automatically when the theme attribute changes. Components built with tokens adapt to light/dark mode with zero theme-specific CSS.

**Tailwind works inside Shadow DOM.** The `TailwindPlugin` compiles Tailwind v4 at runtime via WASM and injects it into the component's shadow root. `@theme`, `@utility`, and `@custom-variant` all work. No build step.

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

`$` and `$$` are jQuery-like DOM utilities provided in every component callback. The key addition: **`$$` pierces Shadow DOM boundaries**, recursing through shadow roots to find elements.

```js
$('ui-button')                 // selects in the current scope
$$('ui-dropdown .item')        // reaches inside shadow DOM
$('ui-modal').component()      // access the component instance
```

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

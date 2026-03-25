---
title: What Is Semantic UI
description: Conceptual overview of Semantic UI for agents and developers with no prior exposure — what it is, what makes it novel, how it fits into the landscape of web frameworks, and what you'd get wrong without being told.
keywords: [overview, introduction, framework, web components, signals, reactivity, templating, expression language, specs, natural language, no compile step, shadow DOM, tailwind, design system]
audience: essentials
skill: overview
type: skill
---

# What Is Semantic UI

> **Skill:** `overview`
> **Purpose:** Conceptual orientation for agents encountering Semantic UI for the first time — what it is, what makes it genuinely novel, and what you'd get wrong without being told.

Semantic UI is what you get when you design a component framework around two assumptions: a runtime `Proxy` makes compile steps unnecessary, and native Shadow DOM makes framework-specific styling unnecessary.

**Key facts:**
- Runtime-only framework — no compile step. Proxy-based expression evaluator.
- Real web components with Shadow DOM. Works in any framework.
- Flat template namespace: `{count}`, not `{state.count}`.
- Signals auto-unwrap. Mutation helpers instead of get-mutate-set.
- Settings are the external API (attributes). State is internal reactivity.
- Two layers: a **component framework** (`defineComponent`, signals, templates) and a **design system** (`<ui-button>`, `<ui-card>`, etc.). Use either independently.
- Load a skill before writing code — start with `use-components` or `component-authoring`.

---

## What You'd Get Wrong

These are the corrections that prevent the most common hallucinations. They're first because they're the highest-value content in this document.

**Flat data context.** Templates merge settings, state, and instance methods into one namespace — there is no `state` or `settings` object to access.
```html
{count}          <!-- correct -->
{state.count}    <!-- wrong — no namespace prefix -->
{settings.name}  <!-- wrong -->
```

**Signal auto-unwrapping in templates.** The runtime `Proxy` unwraps signals at the property-access level, so templates never need explicit unwrap calls.
```html
{count}          <!-- correct -->
{count.get()}    <!-- wrong in templates — Proxy handles this -->
{count.value}    <!-- wrong -->
```

**`.get()` is for JavaScript, not templates.** Inside `{curly braces}` in HTML = template context (Proxy auto-unwraps). Everywhere else — `createComponent`, event callbacks, lifecycle hooks — is JS context where you must call `.get()` to read a signal's value.
```js
// in createComponent or event handler:
const val = state.count.get();   // correct — JS context
const val = state.count;         // wrong — returns the Signal object, not its value
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

**`createComponent` methods merge into the template namespace.** Methods you return from `createComponent` are available directly in templates (`{canSearch}`, not `{self.canSearch()}`) and via `self` in JavaScript.

**Specs are for design system components.** Most components you build won't have specs. Specs are for polished primitives that need a machine-readable API contract.

---

**Scope of this document:** orientation and correction, not comprehensive reference. Load task-specific skills before writing code (see Related Skills at the end). For deeper framework internals, load `mental-model`.

---

## Runtime-First Architecture

SUI makes an architectural bet other frameworks don't: **everything is evaluated at runtime through a `Proxy`-based expression evaluator**, instead of compiling templates to JavaScript at build time. Understanding this single decision lets you predict how the entire framework behaves.

When you write `{count}` in a template, there is no compiler transforming that into `count.get()` or a render function. At runtime, a `Proxy` intercepts the property access, discovers `count` is a signal, and unwraps it transparently. This means signal auto-unwrapping works for *any* expression — not just patterns the framework has seen before. An arbitrary JavaScript expression like `{items.filter(i => i.active).length}` resolves signals at every property access, automatically, because the `Proxy` operates at the language level, not the syntax level.

**Why this works in practice:** the "compile step" is tokenization — parsed once per component prototype into a flat AST, no code generation, sub-millisecond. Reactivity is per-expression (not per-component), so only the specific DOM nodes depending on a changed signal re-evaluate. Load `mental-model` for the full rendering pipeline.

**What this unlocks:**

- **The dual expression language** — Lisp-style and JavaScript-style syntax mixed freely, evaluated at runtime by a single expression evaluator
- **No build tooling dependency** — the framework is self-contained. No transpiler, no bundler plugin, no framework-specific CLI

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

**How the evaluator decides:** if the first token in an expression resolves to a function and the expression uses space-separated arguments, it's treated as a Lisp-style call. Otherwise it's evaluated as JavaScript. Parenthesized sub-expressions `(...)` are always evaluated first, enabling the mixed syntax.

---

## Template Control Flow

Templates use `{#keyword}` blocks for control flow. Slots use standard web component projection — consumers pass content via the `slot` attribute. This is the minimum syntax to avoid guessing wrong — load `component-templating` for the full reference.

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

{>slot}                                 <!-- default slot -->
{>slot header}                          <!-- named slot -->
{>mySubtemplate}                        <!-- subtemplate (load component-templating for details) -->
```

Consumer-side slot projection uses the standard `slot` attribute:
```html
<ui-card>
  <span slot="header">Title</span>
  Content goes in the default slot.
</ui-card>
```

---

## How You Define Components

A minimal component is a template with a tag name. CSS is passed as a string in the `css` property — it's scoped to the component's Shadow DOM automatically:

```js
import { defineComponent } from '@semantic-ui/component';

defineComponent({
  tagName: 'current-time',
  template: `Time is <b>{formatDate time "h:mm:ss a"}</b>`,
  css: 'b { color: var(--primary-text-color); }',
  defaultState: { time: new Date() },
  onCreated({ state }) {
    setInterval(() => state.time.set(new Date()), 1000);
  },
});
```

A full component can also include settings (external API), event handlers, keybindings, and a `createComponent` factory. Load `component-authoring` for the full API — the key structural points are:

- **Every callback** receives the same destructured parameter object: `{ self, state, settings, $, $$, reaction, signal, dispatchEvent, findParent, isClient, isServer, ... }`. No imports, no dependency injection. `reaction` creates reactive computations that re-run when their signal dependencies change — dependencies are tracked automatically, not declared:
  ```js
  onCreated({ reaction, state }) {
    reaction(() => { console.log('count is', state.count.get()); }); // re-runs whenever count changes
  }
  ```
- **Events** use the string format `'eventType selector'`. Callbacks receive the standard params plus event-specific properties (`value`, `data`, `event`):
  ```js
  events: {
    'click .save'({ self }) { self.save(); },
    'input .search'({ state, value }) { state.query.set(value); },
  }
  ```
- **`createComponent`** receives the same params object and returns methods that merge into the flat template namespace:
  ```js
  createComponent({ state, settings }) {
    return {
      canSearch() { return settings.searchable.get() && state.query.get().length > 0; },
    };
  }
  ```
  `{canSearch}` in templates, `self.canSearch()` in JavaScript.

Without a `tagName`, `defineComponent` returns a subtemplate instead of registering a web component — same API, different output. A web component is just a template that has been given a tag name.

**Settings vs. state.** `defaultSettings` defines the component's external API — values consumers pass via HTML attributes or JavaScript. `defaultState` defines internal reactive state that consumers don't see. Both merge into the flat template namespace, but they serve different roles: settings are the contract with the outside world, state is private reactivity.

**Lifecycle.** Components are created once, then rendered, then connected to the DOM. `onCreated` runs after creation (before DOM is available — use it for setup, timers, data fetching). `onRendered` runs after the first render (DOM is available). `onDestroyed` runs on disconnect (cleanup). All callbacks receive the same parameter object.

**Server-side rendering.** SUI supports SSR. Every callback receives `isClient` and `isServer` booleans — use them to guard browser-only code (DOM APIs, timers, event listeners) so the same component definition works in both contexts.

**Reactivity granularity.** Each `{expression}` in a template is its own reactive scope. When a signal changes, only the specific DOM nodes that depend on it re-evaluate. The template AST is never re-walked. This is per-expression, not per-component — closer to Solid than to React.

---

## Shadow DOM and Styling

Theming is covered in "What You'd Get Wrong" above. The additional non-obvious details:

The **token system** (`--standard-*`, `--primary-color`, `--spacing`, etc.) recalculates automatically when the `dark`/`light` attribute changes. Components built with tokens adapt to light/dark mode with zero theme-specific CSS.

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

## Query

`$` and `$$` are jQuery-like DOM utilities provided in every component callback. `$` selects within the current scope; `$$` does the same but **pierces Shadow DOM boundaries**. Load `query` before using them — the API surface is large and Shadow DOM–aware in ways that aren't guessable.

Query also supports **behaviors** — reusable interactive patterns (tooltip, dropdown, escape) attached to elements via `$el.behaviorName()`. If you encounter `$el.tooltip()` or `$el.escape('show')` in user code, that's the behavior system.

---

## Related Skills

Load task-specific skills via MCP when you need to act, not just orient. **For most tasks, start with `use-components` (using existing primitives) or `component-authoring` (building new ones).** Use `list_components` and `get_component` for first-party component specs. Use `search` to find content by keyword.

| Task | Skill |
|------|-------|
| Use first-party components | `use-components` |
| Build custom components | `component-authoring` |
| Write component templates | `component-templating` |
| Write component CSS | `component-css` |
| Understand reactivity | `reactive-state` |
| Style components from outside | `style-components` |
| Use design tokens | `design-tokens` |
| Control themes | `adjust-theme` |
| Use Tailwind in components | `component-tailwind` |
| Use the Query DOM library | `query` |
| Deep framework internals | `mental-model` |

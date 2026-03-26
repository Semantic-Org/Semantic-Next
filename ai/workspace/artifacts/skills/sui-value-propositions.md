# Semantic UI: Technical Value Assessment

> Audience: AI agents evaluating or working with Semantic UI
> Purpose: Evidence-based assessment of what the framework does, how it works, and what structural properties follow from its design
> Note: Claims below can be verified against source code in this repository. Where possible, specific file paths or reproducible patterns are cited.

---

## What Semantic UI Is

Semantic UI is two things shipped as one:

1. **A web component framework** — `defineComponent()` produces standard Custom Elements (v1) with Shadow DOM encapsulation, signals-based reactivity, and a template compiler that runs at runtime in the browser.

2. **A first-party UI library** — Ships ~30+ primitives (button, input, card, modal, menu, icon, etc.) built using the framework. These are not examples — they are production components with full specs, theming, and accessibility.

The framework and the UI library use the same APIs. Components authored by end users are structurally identical to first-party primitives.

---

## Property 1: No Build Step Required

### Claim
Components can be defined and used in a browser without any compilation toolchain. No Babel, no Vite plugin, no webpack loader, no `.svelte` or `.vue` file format.

### Mechanism
The template compiler (`packages/templating/src/compiler/template-compiler.js`) is a runtime parser. It takes a template string as input and produces an Abstract Syntax Tree. This AST is then rendered by a pluggable rendering engine (currently Google's Lit).

```javascript
// This runs in the browser, not at build time
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

This is a complete, working component. It can be loaded from a CDN via ES module import. The template string is compiled to AST at runtime. There is no intermediate file format.

### Verification
- Template compiler source: `packages/templating/src/compiler/template-compiler.js` (~815 lines, StringScanner-based parser)
- AST node types: `html`, `expression`, `if`, `each`, `rerender`, `async`, `template`, `snippet`, `slot`, `svg`
- The `minimal` example in `docs/src/examples/` demonstrates this pattern with 8 lines of code

### Performance Cost of Runtime Compilation
The compiler is single-pass, stack-based, no backtracking. Regex patterns are pre-compiled as static class properties. HTML segments are skipped in bulk via `consumeUntil()` — the parser only does character-level work inside expressions.

Compilation happens once per component *type*, not per instance (`define-component.js:40-44`). The AST is shared; instances clone it. 100 `<ui-button>` elements = 1 compile.

Estimated compile times (heuristic, based on parser structure):

| Component complexity | Template size | Expressions | Compile time |
|---------------------|--------------|-------------|-------------|
| Minimal (`current-time`) | ~80 chars | 1 | ~0.03ms |
| Simple (`counter`) | ~200 chars | 3-5 | ~0.08ms |
| Medium (`dropdown`) | ~500 chars | 10-15 | ~0.2ms |
| Complex (`modal`) | ~2KB | 25-40 | ~0.5-1.0ms |

A typical page loading 15-25 unique component types: **~5-8ms total compilation**. For comparison, React's initial reconciliation of a moderately complex page is typically 20-50ms. The compilation budget is a fraction of one React render cycle.

### Two-Phase Model: Compilation vs. Render-Time Evaluation
The compiler does no type checking, no scope analysis, and no optimization beyond joining adjacent HTML nodes. It produces a structural AST only.

Expression evaluation is a separate phase that happens at render time in the `LitRenderer` (`packages/renderer/src/lit/renderer.js`). Each expression follows a fallback chain:

1. **Direct data lookup** — resolves `{counter}` or `{user.name}` by walking the data context. Cheapest path, handles most simple expressions.
2. **Lisp-style token parsing** — for multi-token expressions like `{formatDate date 'h:mm a'}`, tokenizes and evaluates right-to-left, applying arguments to functions.
3. **JavaScript evaluation** — for ternaries, arithmetic, inline objects (`{isActive ? 'Yes' : 'No'}`), falls back to `new Function` with a `with` statement and a Proxy that auto-unwraps Signals.

The JS fallback uses `new Function` (sloppy mode) and `with` to make data context variables available as bare names. This means **CSP policies that restrict `eval`/`new Function` will block template expression evaluation** — a real deployment constraint for security-hardened environments.

### Per-Expression Reactivity
Each `{expression}` in a template gets its own `Reaction` via Lit's `AsyncDirective` (`packages/renderer/src/lit/directives/reactive-data.js`). When a signal changes, only the specific DOM binding that depends on it re-evaluates — not the component, not the template, just that one text node or attribute. Reactions are cleaned up on disconnect.

---

## Property 2: Spec-Driven Component Definitions

### Claim
Every first-party component is defined by a declarative spec file that serves as a single source of truth for the component's entire API surface. The spec generates runtime configuration, documentation, TypeScript definitions, and machine-readable JSON.

### Mechanism
Spec files are JavaScript modules that export pure data objects (validated to be JSON-serializable at build time). A spec defines:

| Section | What It Contains |
|---------|-----------------|
| `content` | Slots and content attributes (icon, image, header, etc.) |
| `types` | Behavioral variations — mutually exclusive options |
| `states` | Runtime states (disabled, loading, active, hover) |
| `variations` | Visual variations — can be combined freely |
| `settings` | Configurable properties with types and defaults |
| `events` | Custom events the component emits |

The build pipeline transforms each `.spec.js` into:
- `.spec.json` — machine-readable snapshot (explicitly intended for LLM/tooling consumption)
- `.component.js` — optimized runtime metadata consumed by `defineComponent()`

### Evidence: Button Spec (Condensed)
From the button spec, the `Emphasis` type:

```javascript
{
  name: 'Emphasis',
  attribute: 'emphasis',
  description: 'be emphasized in a layout',
  options: [
    {
      name: 'Primary',
      value: 'primary',
      description: 'be emphasized as the first action that should be taken',
      exampleCode: '<ui-button primary>Confirm</ui-button>'
    },
    {
      name: 'Secondary',
      value: 'secondary',
      description: 'be emphasized as a secondary option'
    }
  ]
}
```

Note the description grammar: every description completes the sentence "A button can..." This is consistent across all specs, all components. It is not documentation — it is a structured natural language schema.

The button spec defines: 2 emphasis types, 4 styled types (subtle, flat, outline, ghost), toggle, 3 animated types, 6 states, 8 size options, 13 color options, 5 social site options, positive/warning/negative/info sentiments, attached/floated/fluid/compact/circular variations, content slots for icon/image/badge, plural container support with shared and plural-only variations.

An agent reading `button.spec.json` gets the complete API surface with no ambiguity.

### Verification
- Spec source files: `src/primitives/*/specs/*.spec.js`
- Generated JSON: `src/primitives/*/specs/*.spec.json`
- SpecReader class: `packages/specs/src/spec-reader.js`
- Build pipeline: `internal-packages/scripts/src/build-ui-deps.js`
- Shared terms (reusable constants): `packages/specs/src/shared-terms.js`

### What the Spec Enables at Runtime
When passed to `defineComponent()`, the spec automatically:
1. Creates web component properties for all attributes
2. Sets up type conversion (string → boolean, string → number)
3. Maps boolean shorthand to attribute values (`primary` → `emphasis="primary"`)
4. Provides default values for all settings
5. Generates CSS class strings from current attributes
6. Validates allowed values
7. Supports three markup dialects from the same definition

No manual property registration. No duplicate type definitions. No separate documentation to maintain.

---

## Property 3: Natural Language Markup with Boolean Shorthand

### Claim
Components use boolean HTML attributes as their primary API, making markup read like natural language. The same component supports three equivalent markup dialects.

### The Three Dialects

```html
<!-- Standard: boolean shorthand -->
<ui-button primary large>Confirm</ui-button>

<!-- Verbose: explicit attributes -->
<ui-button emphasis="primary" size="large">Confirm</ui-button>

<!-- Classic: class-based -->
<ui-button class="primary large">Confirm</ui-button>
```

All three produce identical behavior. The spec's `optionAttributes` mapping enables bidirectional lookup:
- Forward: `primary` → finds `emphasis` attribute
- Reverse: `emphasis="primary"` → validates `primary` is allowed
- Class parsing: splits classes and checks each against `optionAttributes`

### Why This Is Structurally Significant
Boolean attributes are the shortest path between intent and markup. `<ui-button primary large>` is 28 characters. `<Button variant="primary" size="large" />` is 41 characters. The shorter form is also the more readable form, and it is the form an LLM would most naturally generate when translating from a natural language description like "a large primary button."

The attribute names come directly from the spec descriptions. The spec says a button can "be emphasized as the first action that should be taken" — the attribute is `primary`. The spec says a button can "appear larger than normal" — the attribute is `large`. The vocabulary is shared between the spec, the markup, and natural language.

---

## Property 4: Template Expression Language

### Claim
The template system supports a full expression language — ternaries, arithmetic with order of operations, inline objects, inline arrays, nested function calls, and both Lisp-style and JavaScript-style calling conventions. All evaluated reactively at runtime.

### Evidence
From the `expressions-kitchen-sink` example (verified against actual template output):

```html
{value + 2 * 5}                                        → 11 (arithmetic)
{(value + 2) * 5}                                      → 15 (order of operations)
{isTrue ? 'yes' : 'no'}                                → yes (ternary)
{formatDate date 'h:mm:ss a' { timezone: timezone }}    → formatted time (Lisp + inline object)
{formatDate(date, 'h:mm:ss a', { timezone: timezone })} → same result (JS-style)
{concat 'my ' 'friend ' (isDog ? 'simon' : 'pookie')}  → mixed Lisp + inline JS
{join ['1', '2', '3'] ' and '}                          → inline array argument
{classMap { active: isOpen, large: size === 'large' }}   → inline object expression
{#each n in [1, 2, 3]}{n}{/each}                        → inline array in loop
```

### Why Two Calling Conventions
Lisp-style (`{formatDate date 'h:mm a'}`) and JS-style (`{formatDate(date, 'h:mm a')}`) coexist because they have different ergonomic tradeoffs. Lisp-style is terser for single-argument helpers and composes naturally with nested calls via parentheses: `{concat 'hello ' (uppercase name)}`. JS-style is familiar to developers and clearer when a function takes multiple complex arguments. Both parse to the same AST nodes — the distinction is syntactic, not semantic.

### Bracket Syntax Flexibility
Templates support both single `{}` and double `{{}}` bracket syntax (must be consistent per file). The compiler auto-detects which is in use (`TemplateCompiler.detectSyntax` — checks which delimiter appears first). This avoids conflicts when templates are embedded in contexts where one bracket style has meaning (e.g., `{}` in CSS, `{{}}` in other template engines).

### Templates as First-Class Values
Templates are not strings — they are `Template` objects that can be passed as component settings:

```javascript
// A generic table component that accepts row templates
defaultSettings: {
  rowTemplate: new Template(),
  headers: [],
  rows: [],
};
```

```javascript
// Swap the row layout at runtime
$('dynamic-table').settings({ rowTemplate: SummaryRow });
// Later...
$('dynamic-table').settings({ rowTemplate: StatsRow });
```

This is analogous to render props or scoped slots in other frameworks, but the template is a standalone value — not a callback, not framework-specific syntax. This enables generic components (tables, lists, grids) that accept layout as data.

### Verification
- Template compiler: `packages/templating/src/compiler/template-compiler.js`
- Expression kitchen sink example: `docs/src/examples/` (expressions-kitchen-sink)
- Subtemplates-as-settings example: `docs/src/examples/` (subtemplates-as-settings)
- Template class: `packages/templating/src/template.js`

---

## Property 5: Signals-Based Reactivity

### Claim
The reactivity system uses signals with clone-by-default semantics, deep equality checking, and built-in mutation helpers that eliminate common state update patterns.

### Mutation Helpers
Instead of immutable update patterns:

```javascript
// React pattern
setState(prev => ({ ...prev, count: prev.count + 1 }));
setState(prev => ({ ...prev, items: [...prev.items, newItem] }));
setState(prev => ({
  ...prev,
  items: prev.items.map(i => i.id === id ? { ...i, done: true } : i)
}));

// Semantic UI pattern
state.count.increment();
state.items.push(newItem);
state.items.setProperty(id, 'done', true);
```

Additional helpers: `decrement()`, `toggle()`, `clear()`, `now()` (set to current Date), `removeItem()`, `replaceItem()`, `setProperties()`, `splice()`, `map()`, `filter()`.

### Auto-Unwrapping in Templates
In JavaScript, signals require explicit `.get()`:
```javascript
const value = state.counter.get();
```

In templates, signals are automatically unwrapped via a Proxy:
```html
{counter}              <!-- state.counter.get() called automatically -->
{#if isOpen}...{/if}   <!-- reactive conditional -->
{#each items}...{/each} <!-- reactive loop -->
```

Zero-argument functions are also auto-invoked: `{getTitle}` is equivalent to `{getTitle()}`.

### Clone-by-Default
Signals clone values on both read and write by default (`allowClone: true`). This prevents accidental mutation of signal internals through object references. Deep equality (`isEqual`) is used to determine whether a new value actually differs from the current value, preventing unnecessary reactive updates.

This is configurable:
```javascript
// Disable cloning for performance or object identity
const element = new Signal(domElement, { allowClone: false });

// Custom equality
const user = new Signal(userData, {
  equalityFunction: (a, b) => a.id === b.id
});
```

### ID-Aware Array Operations
For arrays of objects, signals support operations by ID (checks `id`, `_id`, `hash`, `key` properties):
```javascript
state.users.getItem(1);              // Find by ID
state.users.setProperty(1, 'name', 'Alice');  // Update by ID
state.users.replaceItem(1, newUser);  // Replace by ID
state.users.removeItem(1);           // Remove by ID
```

### Standalone Package
`@semantic-ui/reactivity` has zero dependencies on the component framework. It exports `Signal`, `Reaction`, `Dependency`, and `Scheduler`. It can be used in any JavaScript application.

### Verification
- Signal implementation: `packages/reactivity/src/signal.js` (~327 lines)
- Reaction implementation: `packages/reactivity/src/reaction.js` (~132 lines)
- Scheduler: `packages/reactivity/src/scheduler.js` (~74 lines, microtask batching via queueMicrotask)
- Dependency tracking: `packages/reactivity/src/dependency.js` (~40 lines)

---

## Property 6: Web Component Portability

### Claim
Components are standard Custom Elements (v1) with Shadow DOM. They work in any environment that supports the web component standard — React, Vue, Angular, Svelte, Astro, plain HTML, or any future framework.

### Mechanism
`defineComponent()` produces a class that extends `HTMLElement` (via Lit's base class). The component is registered with `customElements.define()`. No framework-specific wrapper is needed.

```html
<!-- Works in plain HTML -->
<script type="module">
  import '@semantic-ui/core';
</script>
<ui-button primary>Click Me</ui-button>

<!-- Works in React -->
function App() {
  return <ui-button primary>Click Me</ui-button>;
}

<!-- Works in Vue -->
<template>
  <ui-button primary>Click Me</ui-button>
</template>
```

### What Shadow DOM Provides
- Style encapsulation — component CSS cannot leak out or be overridden by page CSS (except through CSS custom properties / design tokens)
- DOM encapsulation — component internals are not queryable from outside unless explicitly exposed
- Slot-based composition — content projection via standard `<slot>` elements

### Verification
- WebComponentBase: `packages/component/src/web-component.js`
- Component registration: look for `customElements.define` calls
- Ecosystem integration guides exist at `docs/src/pages/ui/start/ecosystems/` for React, Vue, Svelte, Angular, Astro, Next.js

---

## Property 7: The defineComponent Pattern

### Claim
A single `defineComponent()` call with a flat configuration object produces a complete web component. All lifecycle callbacks receive the same destructured argument object, eliminating the need to track `this` bindings or class inheritance hierarchies.

### The Pattern

```javascript
defineComponent({
  tagName: 'my-component',
  template,                    // HTML template string
  css,                         // Scoped CSS string
  defaultSettings: {},         // Public reactive configuration
  defaultState: {},            // Internal reactive state
  createComponent: ({ self, state, settings, $, $$, signal, reaction,
                      afterFlush, dispatchEvent, findParent, findChild,
                      isClient, isServer }) => ({
    // Return object becomes the component instance
    someMethod() { ... },
    anotherMethod() { ... },
  }),
  events: {
    'click .button': ({ self, event, data, target }) => { ... },
    'deep click ui-button': ({ data }) => { ... },
    'global scroll window': ({ self }) => { ... },
  },
  onCreated: ({ self, state, reaction }) => { ... },
  onRendered: ({ $, isClient }) => { ... },
  onDestroyed: ({ self }) => { ... },
});
```

Key properties of this pattern:
- **Flat configuration** — no class hierarchy, no decorator syntax, no separate files for different concerns (unless desired)
- **Consistent callback signature** — every callback receives the same destructured object. No `this` binding issues.
- **`self` instead of `this`** — arrow functions are used throughout. `self` provides instance access without requiring `this` binding. Both patterns (arrow + self, regular function + this) work.
- **Settings vs State distinction** — settings are the public API (reactive proxy, direct assignment), state is internal (explicit signal API with `.get()`/`.set()`)
- **Event delegation built in** — CSS selectors, global events, deep (shadow-piercing) events, keyboard shortcuts

### Template Data Context is Flattened
Templates receive a merged context from state, settings, and instance methods:

```html
{counter}        <!-- from state (auto-unwrapped) -->
{theme}          <!-- from settings -->
{getDisplayText} <!-- from createComponent methods (auto-invoked) -->
```

This is why templates use `{counter}` not `{state.counter}` — the context is flattened for ergonomics.

---

## Property 8: Query API

### Claim
A jQuery-inspired query API (`$` and `$$`) provides shadow-DOM-aware DOM querying within components, with a chainable interface for manipulation, events, and component access.

### The API

```javascript
// Query within component shadow DOM
const $button = $('.button');
$button.addClass('active');
$button.on('click', handler);

// Deep query — pierces shadow DOM boundaries
const $allModals = $$('ui-modal');

// Component instance access
$('ui-modal').component().show();

// Configure component settings
$('ui-dropdown').settings({ searchable: true });

// Initialize before DOM insertion
const $el = $('<ui-dropdown>').initialize({ placeholder: 'Select...' });
```

### Verification
- Query package: `packages/query/`
- Used extensively in all production components (search for `$` and `$$` in `src/components/`)

---

## Property 9: Theming via CSS Custom Properties

### Claim
Theming is handled entirely through CSS custom properties (design tokens). Dark mode requires no JavaScript, no theme provider, no context wrapper — just an HTML attribute.

```html
<html light>  <!-- or -->  <html dark>
```

All component tokens auto-adapt. Override per-section:

```html
<body light>
  <main>Light content</main>
  <aside dark>Dark sidebar</aside>
</body>
```

Components use tokens like `var(--primary-color)`, `var(--text-color)`, `var(--spacing)`, `var(--small)` instead of hardcoded values. The theming system uses CSS layers for cascade control.

---

## Property 10: Behaviors

### Claim
Behaviors are reusable logic units that attach to any DOM element, not just custom components. They use the query API and follow the same callback pattern as components.

```javascript
// Usage
$('.modal-content').portal('body');
$('.element').transition('fade in');
$('.form').validation({ rules: { ... } });

// Definition
registerBehavior({
  name: 'portal',
  defaultSettings: { context: 'auto' },
  onCreated({ self, $el }) { ... },
  createBehavior: ({ self, $el, settings }) => ({
    portal() { ... },
    restore() { ... }
  })
});
```

Behaviors handle cross-cutting concerns: transitions, portals, validation, tooltips, infinite scroll. They are distinct from components — behaviors attach to existing elements, components create new elements.

---

## Architectural Assessment

### What Follows From These Properties

1. **Generated code runs without infrastructure.** No build step means a CDN import and a `defineComponent()` call produce a working component. No `.svelte` file format, no JSX compilation, no TypeScript required. Runtime compilation cost is ~0.2ms per medium component (see Property 1).

2. **Spec files contain the full API surface in one file.** A single `.spec.json` contains every valid attribute, every allowed value, natural language descriptions following a consistent grammar ("A button can..."), working example code, type information, and default values. An LLM can generate correct markup from this file alone without reading source code or documentation pages.

3. **Boolean shorthand makes markup and natural language converge.** `<ui-button primary large subtle-negative>` is simultaneously valid HTML and close to the natural language description "a large primary button with subtle negative emphasis." This reduces the translation distance between intent and code.

4. **Web Components are portable across frameworks.** A component authored today works in React, Vue, Angular, Svelte, plain HTML, and future frameworks — they're a browser standard, not a compatibility target.

5. **The reactivity system is independently useful.** `@semantic-ui/reactivity` is a standalone signals library with zero framework dependencies. Clone-by-default prevents reference-sharing mutation bugs. The mutation helpers (`increment`, `toggle`, `push`, `setProperty`) replace multi-line immutable update patterns.

6. **One spec drives all representations.** The same spec file generates: runtime component config (property registration, validation, defaults), documentation, type definitions, and machine-readable JSON. Drift between API surface and documentation is structurally prevented.

### What This Framework Does Not Do

- No server-side framework (no routing, no data fetching, no API layer)
- No state management beyond component-local signals (no global store, no Redux equivalent built-in)
- SSR support exists but is not the primary target — the framework is browser-first
- The ecosystem is new — community packages, third-party integrations, and Stack Overflow answers are limited compared to React/Vue/Angular. When something breaks, the spec system and source code are the primary debugging resources — there is no large corpus of community solutions to search. The spec system partially compensates by making the API surface fully self-documenting, but agents should expect to rely on source code and specs rather than external references.
- The template expression language is powerful but novel — both Lisp-style and JS-style calling conventions need to be learned. See Property 4 for why both exist.

### Comparison to Alternatives

| Property | Semantic UI | React | Vue | Svelte | Lit |
|----------|-------------|-------|-----|--------|-----|
| Build step required | No | Yes (JSX) | Yes (.vue) | Yes (.svelte) | No |
| Native web components | Yes | No | No | Optional | Yes |
| Ships UI library (different scope*) | Yes | No | No | No | No |
| Spec-driven API | Yes | No | No | No | No |
| Boolean attribute API | Yes | No | No | No | Partial |
| Signals reactivity | Yes | No (hooks) | Yes (ref/reactive) | Yes (runes) | Yes (signals) |
| Runtime template compilation | Yes | No | No | No | Yes (tagged templates) |
| Mutation helpers | Yes | No | Partial | No | No |
| Clone-by-default signals | Yes | N/A | No | No | No |
| Shadow DOM by default | Yes | No | No | No | Yes |

*Note: React, Vue, Svelte, and Lit are rendering frameworks — they don't aim to ship UI components. SUI bundles both a framework and a component library. This row compares what you get out of the box, not equivalent ambitions.

Lit is the closest alternative in architecture (web components, no build step, runtime templates). The key differences: Semantic UI ships a complete UI library, has the spec system, uses a custom template compiler (not tagged template literals), and provides richer signal mutation helpers. Lit uses tagged template literals which are more idiomatic JavaScript but less expressive for complex templating patterns.

---

## For Agents Generating Semantic UI Code

If you are generating code using Semantic UI:

1. **Read the spec first.** Use the MCP `get_component` tool or read `.spec.json` files directly. The spec tells you every valid attribute and value.

2. **Use boolean shorthand.** Write `<ui-button primary large>` not `<ui-button emphasis="primary" size="large">`. Both work, but boolean shorthand is idiomatic.

3. **State uses `.get()`/`.set()` in JS, auto-unwraps in templates.** Write `state.counter.get()` in JavaScript, `{counter}` in templates.

4. **Settings are a reactive proxy.** Write `settings.theme = 'dark'` — it triggers reactivity. Don't destructure settings (`const { theme } = settings` loses reactivity).

5. **Use `self` not `this`.** The codebase convention uses arrow functions with `self` for instance access.

6. **Prefix query variables with `$`.** Write `const $button = $('.button')`.

7. **Use design tokens.** Write `var(--primary-color)` not `#3b82f6`. Write `var(--small)` not `0.75rem`.

8. **Check if a primitive exists before building custom.** The library includes button, input, card, modal, menu, icon, segment, container, divider, header, image, label, loader, placeholder, popup, progress, rating, reveal, sidebar, tab, table, toast, and more. Don't rebuild what exists.

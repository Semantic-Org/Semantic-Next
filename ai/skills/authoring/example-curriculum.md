---
title: Semantic UI Example Curriculum
description: Ranked examples demonstrating SUI component patterns, ordered by convincingness and gap-filling. Load examples via get_example with the IDs listed here. Each entry explains what makes the example compelling and what patterns to look for.
keywords: [examples, components, defineComponent, signals, mutation methods, async templates, events, reactivity, web components, curriculum, learning, specs, tailwind, keybinding]
audience: authoring
skill: example-curriculum
type: skill
---

# Semantic UI Example Curriculum

> **Skill:** `example-curriculum`
> **Purpose:** Guide an agent through SUI's examples in the most effective learning order — which to load, what to look for, and why each matters

Load any example with `get_example` using the ID. Load them in order — each builds on the last. For the full component API, load `component-authoring`. For template syntax, load `component-templating`. This skill focuses on what the examples demonstrate and why they're convincing — not on restating the reference documentation.

---

## The Curriculum

The first 7 carry the core argument. The rest fill pattern gaps. Each entry lists new patterns (keywords for scanning) and what to notice (the explanatory weight).

---

### 1. `minimal` — The Floor

A complete component in 6 lines. Inline template and CSS as strings. This is the absolute minimum — proof that the simplest case is trivially simple before any complexity is introduced.

**New patterns:** Inline template/CSS strings (no `getText`), `onCreated` lifecycle hook, `formatDate` helper.

**What to notice:**
- Template and CSS are just strings — `template: \`Time is <b>{formatDate time "h:mm:ss a"}</b>\`` works. No file loading required.
- `onCreated` is a top-level `defineComponent` option (not inside `createComponent`). It runs before the first render.
- The entire component — tag name, template, CSS, state, lifecycle — fits in one `defineComponent` call with no imports beyond the framework.

---

### 2. `emoji-reactions` — The Hook

An interactive, stateful component in ~30 lines of JS. After seeing the floor, this shows what happens when you add interactivity. The ratio of code to delivered functionality is the immediate hook.

**New patterns:** `defaultSettings`, `defaultState`, `createComponent`, `events`, `{#each}`, `getIndex`, `setIndex`, `initialize()`, `data-*` parsing, `{activeIf}`.

**What to notice:**
- `state.reactionState.getIndex(index)` and `setIndex(index, value)` — semantic array access. No `prev => prev.map((item, i) => i === index ? ... : item)`.
- `data.index` in event handlers — SUI parses `data-*` attributes from the event target automatically.
- The component works from pure HTML: `<emoji-reactions reactions="👍 12, ❤️ 5">`.

---

### 3. `todo-list` — The Rosetta Stone

Every framework has a TodoMVC. SUI's version uses more signal mutation methods than any other example — the single strongest differentiator. Each method describes intent where other frameworks require manual immutable update logic.

**New patterns:** `push`, `removeItem`, `replaceItem`, `setProperty`, `setArrayProperty`, `filter`, `getItem`, `reaction()`, `{#snippet}`, `subTemplates`, `keys`, `afterFlush`, `{classMap}`, `{selectedIf}`, `{maybePlural}`, `'global hashchange window'`.

**What to notice:**
- Count the mutation methods: `push`, `removeItem`, `replaceItem`, `setProperty`, `setArrayProperty`, `filter`, `getItem`, `set`. Compare `state.todos.setArrayProperty('completed', !allCompleted)` to React's `setTodos(prev => prev.map(t => ({...t, completed: !allCompleted})))`.
- `reaction(() => { state.todos.get(); localStorage.setItem(...) })` — localStorage sync as a single reaction. No `useEffect` with dependency arrays.
- `{>todoItem id=todo.id title=todo.title ...}` — subtemplate composition with named parameters.
- `afterFlush(() => { $('.editing .edit').focus() })` — post-render DOM access.

---

### 4. `async-search` — The Novel Feature

`{#async}` blocks with `{loading}` and `{error}` states declared inline in the template. No other production framework has this level of declarative async rendering. The template reactively re-triggers when dependencies change.

**New patterns:** `{#async fn args as result}` with `{loading}` and `{error as e}`, `timeout`, snippet parameters, `{activeIf is x y}` lisp-style, `{hasAny}`, `.decrement()` / `.increment()`.

**What to notice:**
- `{#async getResults searchTerm as searchResults}` — calls an async function, re-triggers when `searchTerm` changes, renders the resolved value. `{loading}` and `{error as e}` handle intermediate states. No imperative loading state management.
- `{>message type='noResults'}` — snippets accept parameters.
- `{activeIf is index selectedIndex}` — lisp-style: `is` compares, `activeIf` adds class. Reads as English.
- `'focus, input ui-input'` — multiple events on the same selector, comma-separated.

---

### 5. `context-menu` — Full Event Architecture

The complete event system: global events, deep events, keyboard navigation, slots, viewport-aware positioning, accessibility. Demonstrates that SUI's event model scales to real interactive components where React requires manual `useEffect` listener management. Load `component-events` for the full event DSL reference.

**New patterns:** `{>slot}`, `'global click body'`, `'deep contextmenu .trigger'`, `part`, `peek()`, key handler return values, `role`/`tabindex`, `el`.

**What to notice:**
- `'deep contextmenu .trigger'` — `deep` listens through shadow DOM boundaries.
- `'global click body'` — listen to body clicks from within shadow DOM. Automatic cleanup on destroy.
- `'global show context-menu'` — listen for custom events on *other* instances of the same component.
- `state.position.peek()` — read without creating a reactive dependency.
- `$('context-menu.box').settings({...})` in page.js — configure from outside via Query.

---

### 6. `card-search` — Composition Model

Subtemplates as imports, first-party UI components as building blocks, container queries, reactive filtering. Shows how a real-world component is built from smaller pieces.

**New patterns:** Subtemplate imports, `weightedObjectSearch`, `@container` queries, first-party UI components (`ui-menu`, `ui-input`), `{#each ... else}` with JS expressions.

**What to notice:**
- `subTemplates: { card }` — imported from a separate file, rendered as `{> card name=friend.name ...}`.
- `<ui-menu inset selection value="{filter}" items="{filters}">` — first-party SUI components as building blocks. Just HTML tags.
- `getVisibleFriends()` — a computed function called as `{getVisibleFriends}` in the template. Auto-tracks reactive dependencies and re-evaluates when they change. This is the core mechanism that makes reactivity work in templates.
- Container queries in CSS — shadow DOM provides natural containment.

---

### 7. `tailwind` — The Escape Hatch

Runtime Tailwind CSS compilation inside Shadow DOM. An agent trained on Tailwind can use that knowledge directly inside SUI components — no adaptation, no build step, no conflict with shadow DOM scoping. This neutralizes the "but I already know Tailwind" objection and means the CSS framework with the most AI training data coverage works out of the box.

**New patterns:** `TailwindPlugin`, plugin pattern for `defineComponent`, `@theme`, `@custom-variant`, `{#html content}` for raw HTML output.

**What to notice:**
- `definition = await TailwindPlugin(definition)` — a plugin transforms the component definition before passing to `defineComponent`. The plugin compiles Tailwind classes at runtime and injects them into the shadow DOM.
- Standard Tailwind classes (`flex`, `space-y-6`, `rounded-xl`, `bg-white`, `dark:bg-gray-950`) work inside shadow DOM. This is not trivial — shadow DOM normally blocks external stylesheets.
- `@theme` and `@custom-variant` in component CSS — Tailwind 4 directives work inside component styles.
- An agent doesn't need to choose between SUI's design tokens and Tailwind. They coexist.

---

### 8. `dynamic-table` — Consumer-Specified Templates

The consumer decides how rows render by passing a `Template` object through settings. The table owns structure (thead, tbody, iteration); the consumer owns content (what a row looks like). This is inversion of control — templates are first-class data that flow through the same settings channel as strings and numbers.

**New patterns:** `Template` objects as settings, `{> template name=var data=var}`, `formatDate`.

**What to notice:**
- `rowTemplate: new Template()` — default is empty. The consumer provides the real template via `$('dynamic-table').settings({ rowTemplate: RowTemplate })`.
- The table is fully generic — it doesn't know what a row contains. Different pages can render the same table with completely different row layouts.
- An agent can swap row templates without touching the component. The template travels through settings like any other value.

---

### 9. `external-calls` — Inter-Component Communication

Shows `$().component()` — getting direct access to a component's methods from outside. This is how components talk to each other: one component (or page script) gets another component's instance and calls its methods directly.

**New patterns:** `$('ui-counter').component()`, calling `createComponent` methods from outside, `clearInterval(self.interval)` for manual timer cleanup.

**What to notice:**
- `$('ui-counter').component()` returns the `createComponent` instance — the same `self` the component uses internally. External code can call `counter.setCounter(number)`, `counter.stopCounter()`.
- This is the answer to "how do two SUI components communicate" — one component gets the other's instance via Query and calls methods on it.
- The page.js pattern: focus an input → stop the counter, blur → restart it. Orchestration from outside the components.

---

### 10. `maximal` — The Kitchen Sink

Every `defineComponent` option used in one example. Shows patterns that only appear when a component reaches real-world complexity: `pageCSS`, `findParent()`, `onAttributeChanged`, `onThemeChanged`, `::part()` styling from outside.

**New patterns:** `pageCSS`, `findParent()`, `onAttributeChanged`, `onThemeChanged`, `::part()` from consumer CSS, splitting component across multiple files.

**What to notice:**
- `pageCSS` — CSS that escapes the shadow DOM and applies to the page. Used for styling across component boundaries: `number-adjust ~ number-adjust::part(counter) { ... }`.
- `findParent('numberAdjust')` — child subtemplate reaches up to its parent component and calls its methods. This is child-to-parent communication without events.
- `onAttributeChanged(name, value)` and `onThemeChanged(darkMode)` — lifecycle hooks for attribute mutations and dark/light mode transitions.
- The component is split across `lifecycle.js`, `config.js`, `buttons.js` — component definitions are composable JS objects.

---

### 11. `component-specs` — The Spec System

How SUI's first-party design system components work. A `SpecReader` processes a spec definition into a `componentSpec` that enables three equivalent HTML dialects — concise, verbose, and class-based. This is how `<ui-button primary large>` works.

**New patterns:** `SpecReader`, `componentSpec`, `{ui}` class expansion, three HTML attribute dialects, `variations`, `states`.

**What to notice:**
- Three equivalent syntaxes: `<ui-widget large primary>` = `<ui-widget size="large" emphasis="primary">` = `<ui-widget class="large primary">`. The spec system makes all three work automatically.
- `{ui}` in the template — expands to CSS classes from active spec attributes. `<span class="{ui}widget">` becomes `<span class="large primary widget">` based on what attributes are set.
- The spec is a plain JS object — `variations`, `states`, `types`. A data structure that describes a component's API surface.

---

### 12. `advanced-keybinding` — Dynamic Keybinding

Static keybindings via the `keys` object plus dynamic keybinding via `bindKey`/`unbindKey` at runtime. Shows modifier key syntax and using `reaction()` to conditionally bind/unbind keys based on state.

**New patterns:** `bindKey`, `unbindKey`, `'ctrl + f'` modifier syntax, dynamic keybinding via `reaction()`.

**What to notice:**
- `bindKey('enter', () => self.selectResult())` / `unbindKey('enter')` — add and remove keybindings at runtime. Used inside a `reaction()` so the Enter key only works when there's a selected index.
- `'ctrl + f'` — modifier key syntax. Also supports `shift`, `alt`, `meta`.
- Static keys (`up`, `down`, `esc`) coexist with dynamic keys (`enter` bound conditionally).

---

### 13. `rating-slider` — Global Interaction Patterns

The drag interaction pattern: start on element, track on body, end on body. In React this requires `useEffect` with document-level listeners and cleanup. In SUI it's a string prefix.

**New patterns:** `'global pointermove body'`, `dispatchEvent` with multiple event types (`change` / `finalized`), `range()`.

**What to notice:**
- `'global pointermove body'` / `'global pointerup body'` — drag tracking across the viewport from within a shadow DOM component.
- Two custom events: `'change'` (continuous during drag) and `'finalized'` (discrete on release). The consumer picks which to listen to.
- `{#each value in range(min, max + 1)}` — `range()` generates numbers directly in the template.

---

### 14. `advanced-ball-simulation` — Reactivity at Scale

Proves SUI's reactivity works at animation speed — a `reaction()` drives `requestAnimationFrame` at 60fps. Not a pattern most projects need, but proves the model is general-purpose.

**New patterns:** `reaction()` as animation driver, `peek()` for batch reads, `onRendered`, settings mutation at runtime, canvas.

**What to notice:**
- `reaction(() => { state.balls.get(); requestAnimationFrame(self.animate); })` — the reactive system IS the animation loop.
- `state.balls.peek()` — read without triggering reactions.
- `self.emitter` and `self.render` — non-reactive data on `self` (not `state`) because it doesn't trigger re-renders. Use `state` for template data; `self` for internal bookkeeping.

---

### 15. `event-data` — Dynamic Signal Access

Uses `data-*` attributes to dynamically select which signal and which mutation method to call. A single event handler handles all cases via bracket notation.

**New patterns:** `state[dimension][helper](settings.delta)` dynamic signal access, data-driven event dispatch.

**What to notice:**
- `state[dimension][helper](settings.delta)` — `dimension` and `helper` come from `data-dimension` and `data-helper` attributes on the button. One handler, many behaviors.
- This pattern eliminates repetitive event handlers. Instead of separate handlers for each action, one handler reads data attributes to determine what to do.

---

### 16. `dropdown` — Real-World Form Component

Form integration with hidden inputs, click-away dismissal, JSON arrays as HTML attributes.

**New patterns:** Hidden `<input>` for forms, `onChange` callback alongside `dispatchEvent`, `el.contains(event.target)`, JSON in attributes, `{classIf}`.

**What to notice:**
- `options='[{"value": "apple", "text": "Apple"}]'` — JSON in HTML attributes, auto-parsed for array/object settings.
- `settings.onChange` alongside `dispatchEvent` — supports both callbacks and DOM events.
- `{classIf isOpen 'visible'}` — simpler than `classMap` for a single conditional class.

---

### 17. `setting-types` — Setting Type Coercion

Shows every setting type (string, number, boolean, array, object, function) and how they're passed via HTML attributes vs Query.

**New patterns:** Function settings, `married="false"` string→boolean coercion, vanilla JS access (`el.name = 'Simon'`), `{greaterThan}` / `{maybe}` helpers.

**What to notice:**
- `getName: () => 'Sam'` — functions can be settings. Passed via `.settings()`, not via HTML attributes.
- `married="false"` — SUI coerces string `"false"` to boolean `false` when the default setting is boolean.
- `el.getName = () => 'Sam'` — settings are accessible as properties on the DOM element. Standard DOM property access works without Query.

---

### 18. `progress-bar` — Parameterized Snippets

Template fragments that accept arguments.

**New patterns:** Snippet parameters (`{>label canComplete=true}`), `{#if both x y}`, `part`, dynamic class names.

**What to notice:**
- `{>label canComplete=true}` — snippet called with a parameter. Same snippet without the parameter renders differently.
- `{#if both canComplete isComplete}` — built-in AND helper. Reads as English.

---

### 19. `clock` — SVG and Timers

SVG rendering and the `interval` helper with automatic lifecycle cleanup.

**New patterns:** SVG templates, `interval()`, `state.time.now()`, nested `{#each}`.

**What to notice:**
- `interval(() => state.time.now(), 1000)` — auto-clears on component destroy.
- `{getMarkerRotation 'major' minute}` — lisp-style function call with multiple arguments.
- SVG works identically to HTML in templates.

---

## Pattern Coverage

| Pattern | First seen in |
|---------|--------------|
| Inline template/CSS strings | `minimal` |
| `onCreated` lifecycle | `minimal` |
| `defineComponent` structure | `emoji-reactions` |
| Signal mutations (`push`, `removeItem`, `setProperty`, etc.) | `todo-list` |
| `{#each}` with index | `emoji-reactions` |
| `{#if}` / `{else}` | `emoji-reactions` |
| `{else if}` | `async-search` |
| `{#async}` with `{loading}` / `{error}` | `async-search` |
| `{#snippet}` and `{>snippet}` | `todo-list` |
| Snippet parameters | `progress-bar` |
| `subTemplates` (imported components) | `todo-list` |
| CSS-selector `events` | `emoji-reactions` |
| `keys` for keyboard shortcuts | `todo-list` |
| `bindKey` / `unbindKey` dynamic keybinding | `advanced-keybinding` |
| Modifier keys (`ctrl + f`) | `advanced-keybinding` |
| `'global event target'` | `context-menu` |
| `'deep event selector'` | `context-menu` |
| `{>slot}` content projection | `context-menu` |
| `classMap` / `activeIf` / `selectedIf` / `classIf` | `emoji-reactions` / `todo-list` / `dropdown` |
| `reaction()` for side effects | `todo-list` |
| `peek()` for non-reactive reads | `context-menu` |
| `dispatchEvent` (→ `event.detail`) | `context-menu` |
| `interval` / `timeout` helpers | `minimal` / `clock` |
| `initialize()` | `emoji-reactions` |
| `onRendered` lifecycle | `advanced-ball-simulation` |
| `onAttributeChanged` / `onThemeChanged` | `maximal` |
| `pageCSS` (outside shadow DOM) | `maximal` |
| `findParent()` child-to-parent | `maximal` |
| `$().component()` external access | `external-calls` |
| `::part()` consumer-side styling | `maximal` |
| Settings as HTML attributes | `emoji-reactions` |
| Setting type coercion | `setting-types` |
| Function settings | `setting-types` |
| Vanilla JS property access (`el.prop`) | `setting-types` |
| `$()` Query from outside | `context-menu` |
| Container queries | `card-search` |
| SVG templates | `clock` |
| Canvas integration | `advanced-ball-simulation` |
| Templates as consumer-specified data | `dynamic-table` |
| Lisp-style expressions | `async-search` |
| JS-style expressions | `card-search` |
| `afterFlush` | `todo-list` |
| JSON in HTML attributes | `dropdown` |
| Form integration (hidden input) | `dropdown` |
| `{#each ... else}` | `card-search` |
| `range()` helper | `rating-slider` |
| `{both x y}` compound conditional | `progress-bar` |
| `state` vs `self` (reactive vs non-reactive) | `advanced-ball-simulation` |
| Dynamic signal access (bracket notation) | `event-data` |
| Spec system (`SpecReader`, `{ui}`, dialects) | `component-specs` |
| TailwindPlugin (runtime Tailwind in shadow DOM) | `tailwind` |

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| `component-authoring` | `use_skill component-authoring` | Full `defineComponent` API and callback parameters |
| `component-events` | `use_skill component-events` | Event DSL reference (standard, deep, global, bind) |
| `component-templating` | `use_skill component-templating` | Template syntax, helpers, and expression reference |
| `component-state` | `use_skill component-state` | Signal API and mutation method reference |
| `component-composition` | `use_skill component-composition` | Subtemplates, slots, and composition patterns |
| `mental-model` | `use_skill mental-model` | Foundational concepts before writing code |
| `overview` | `use_skill overview` | Framework positioning and architecture |
| `tokens` | `use_skill tokens` | CSS design token values |

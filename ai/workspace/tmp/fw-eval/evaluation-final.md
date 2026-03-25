# Framework Evaluation: Ten TodoMVC Implementations

## Framework Identification

| Code Name | Framework | Key Evidence |
|-----------|-----------|-------------|
| Alpha | **Lit** (Web Components) | `LitElement`, `@customElement`, `html` tagged templates, `@state()` decorators |
| Bravo | **React** | `useReducer`, `useCallback`, `useMemo`, JSX with `className`, `react-router-dom` |
| Charlie | **Semantic UI (Next)** | `defineComponent`, `@semantic-ui/component`, `@semantic-ui/utils`, signal-style state (`state.todos.get()`), `{#each}` / `{#if}` / `{>subTemplate}` template syntax |
| Delta | **Svelte** (v3/v4) | `.svelte` files, `$:` reactive declarations, `createEventDispatcher`, `on:click`, `bind:item`, `use:focusInput` |
| Echo | **Vue 3** | `.vue` SFCs, `<script setup>`, `ref()`, `computed()`, `v-model`, `v-show`, `vue-router` |
| Foxtrot | **Preact** | `import { h } from "preact"`, `preact/hooks`, `class` instead of `className` in JSX |
| Golf | **Riot.js** (v2/v3) | `<todo>` custom tags in HTML, `riot.mount`, `riot.route`, `self = this`, `opts.data` |
| Hotel | **Vanilla Web Components** | Raw `HTMLElement`, `customElements.define`, `attachShadow`, `document.importNode`, `adoptedStyleSheets`, no framework library |
| India | **Elm** | `port module Main exposing (..)`, `Browser.document`, Elm architecture (`Model`/`Msg`/`update`/`view`), ML-family syntax |
| Juliet | **SolidJS** | `createStore`, `createMemo`, `createEffect`, `Show`/`For` components, `use:setFocus` directive, `solid-js/store` |

---

## Question 1: Code Review Cost

### Assessment Criteria

For each implementation I evaluate:
1. **Framework concepts required** -- how many non-obvious abstractions must a JS-literate reviewer internalize before they can trace data flow
2. **Read-verifiable vs. runtime-dependent** -- what percentage of the code's correctness can be confirmed by reading alone
3. **Bug-catchability** -- can a reviewer spot a logic error without running the code

### Detailed Analysis

**India (Elm)**

- **Concepts to learn:** Elm syntax, ML-family type system, union types, pattern matching, `Cmd`/`Sub`/`Task` for side effects, ports, `Html.Keyed`, `Html.Lazy`. That is a full new language, not just a framework.
- **Read-verifiable:** Paradoxically high once you learn the language. The entire update function is a pure function over immutable data. Every state transition is enumerated in one `case` expression. The compiler guarantees exhaustive matching. There are no hidden side effects, no implicit state mutations, no callback indirection.
- **Bug-catchability:** Extremely high. You can verify every possible state transition by reading `update`. The view is a pure function of the model. If you can read ML syntax, this is the most auditable codebase here by a wide margin.
- **Cost:** The language barrier is prohibitive for a JS-only reviewer, but the *structural* review cost is the lowest of all ten.

**Juliet (SolidJS)**

- **Concepts to learn:** Fine-grained reactivity (stores, memos, effects), `Show`/`For` components as control flow, `use:` directives, `createStore` path-based updates (`setState("todos", (t) => ...)`), event handler tuple syntax (`onInput={[toggle, todo.id]}`).
- **Read-verifiable:** Mostly yes. Single-file, everything visible. But the `setState` path syntax is opaque -- `setState("todos", (item) => item.id === todo.id, todo)` requires deep knowledge of Solid's store reconciliation to verify.
- **Bug-catchability:** Medium-high. The single file helps, but the `setState` overloads are a minefield for someone who doesn't know the API.

**Charlie (Semantic UI Next)**

- **Concepts to learn:** `defineComponent` API, signal-based state (`state.todos.get()`, `state.todos.push()`), template syntax (`{#if}`, `{#each}`, `{>subTemplate}`, `{classMap ...}`), event delegation (`'keydown .new-todo'`), `afterFlush`, `self` vs `state` distinction, `$()` query API, built-in template helpers (`selectedIf`, `maybePlural`, `is`).
- **Read-verifiable:** High. The template is HTML with clear control flow. The component JS is a flat object with named methods. Event wiring is declarative and reads like CSS selectors. State mutations are explicit method calls.
- **Bug-catchability:** High. The flat structure means every action is traceable: event selector -> handler -> state mutation -> template re-render. The separation of template/events/keys/state is readable even if you don't know the framework.

**Delta (Svelte)**

- **Concepts to learn:** `.svelte` file format, `$:` reactive declarations, `createEventDispatcher`, `on:` directive, `bind:` directive, `class:` shorthand, `use:` actions, `{#each}` / `{#if}` blocks.
- **Read-verifiable:** High. Templates are close to HTML. Logic blocks are readable. But `$:` reactive declarations have non-obvious execution semantics (they re-run on dependency change, order matters).
- **Bug-catchability:** Medium-high. The `bind:item` in particular is tricky -- it creates two-way binding that mutates parent state from child, which is subtle.

**Bravo (React)**

- **Concepts to learn:** JSX, hooks (`useReducer`, `useCallback`, `useMemo`, `useState`), `memo()`, `react-router-dom` (Routes, useLocation), reducer pattern, controlled vs uncontrolled inputs.
- **Read-verifiable:** The reducer is clean and auditable (pure function, switch statement). The component tree is straightforward. But hooks semantics (stale closures, dependency arrays, memoization correctness) require framework knowledge to verify.
- **Bug-catchability:** Medium. The reducer is easy to audit. The hook dependency arrays are where bugs hide, and a naive reviewer cannot verify them.

**Echo (Vue 3)**

- **Concepts to learn:** `<script setup>`, `ref()`, `computed()` (including writable computed), `v-model`, `v-show`, `v-for`, `@` event shorthand, `:` bind shorthand, `defineProps`, `defineEmits`, `vue-router`, `RouterLink`, `useRoute()`.
- **Read-verifiable:** Medium. Templates are HTML-like. But the writable computed (`editModel`, `toggleModel`) and the inconsistent use of `.value` (sometimes needed in script, auto-unwrapped in template) create genuine confusion.
- **Bug-catchability:** Medium-low. The `filters` object has a bug that requires understanding Vue's reactivity to even suspect (see Bug Audit). The interplay between `ref`, `computed`, and template auto-unwrapping creates ambiguity.

**Foxtrot (Preact)**

- **Concepts to learn:** Same as React minus the router. Preact's API is intentionally React-compatible. `h()` instead of `React.createElement()`, hooks from `preact/hooks`.
- **Read-verifiable:** Medium-high. The model is a plain closure, very readable. But the `setUpdatedAt(Date.now())` hack to force re-render is a code smell that requires understanding the rendering model.
- **Bug-catchability:** Medium-high. The model module closure is transparent. The component tree is simple.

**Alpha (Lit)**

- **Concepts to learn:** `LitElement` lifecycle, decorators (`@customElement`, `@state`, `@property`, `@query`), `html` tagged templates, `.property` binding syntax, `@event` syntax, `classMap` directive, `repeat` directive, custom `updateOnEvent` decorator, `EventTarget`-based observable model, `composed: true` for shadow DOM event crossing.
- **Read-verifiable:** Medium. The custom `updateOnEvent` decorator is particularly opaque -- it monkey-patches property descriptors. The event system (custom events bubbling through shadow DOM) requires understanding composed events.
- **Bug-catchability:** Medium-low. The indirection through custom events, the `updateOnEvent` decorator, and the Todos model class means you need to trace through three layers to verify any single user action.

**Golf (Riot.js)**

- **Concepts to learn:** Riot tag syntax (HTML with `<script>` blocks), `self = this`, `opts`, `riot.mount`, `riot.route`, `each` iteration, `show` attribute, `parent` references, update lifecycle.
- **Read-verifiable:** Low-medium. The `self = this` pattern, `opts.parentview` for parent communication, and implicit update cycle are all framework-specific. The inline `<script>` blocks mix concerns in ways that are hard to trace.
- **Bug-catchability:** Low. The `opts.parentview` pattern means child components reach directly into parent internals. Verifying correctness requires understanding Riot's update propagation.

**Hotel (Vanilla Web Components)**

- **Concepts to learn:** Technically "no framework," but this is a lie. You need: `HTMLElement` lifecycle (`connectedCallback`, `disconnectedCallback`, `attributeChangedCallback`, `observedAttributes`), Shadow DOM, `adoptedStyleSheets`, `document.importNode`, custom events with `bubbles: true`, and the entire hand-rolled architecture (imperative DOM manipulation, manual element tracking, manual style.display toggling).
- **Read-verifiable:** Low. Every state change is an imperative mutation spread across multiple files. To verify that "toggling all items works," you must trace: topbar dispatches `toggle-all` -> app calls `list.toggleItems()` -> list calls `element.toggleInput.click()` (simulating a click!) -> item fires `toggle-item` -> app updates `#data` -> app sets attributes on list/topbar/bottombar -> each component's `attributeChangedCallback` fires -> each calls its `updateDisplay`.
- **Bug-catchability:** Very low. The imperative spaghetti makes it nearly impossible to verify correctness by reading. The most likely place to find bugs is also the hardest to audit.

### Ranking: Lowest Cognitive Load for Framework-Naive Reviewer

| Rank | Implementation | Framework | Rationale |
|------|----------------|-----------|-----------|
| 1 | India | Elm | Pure functions, exhaustive pattern matching, no hidden state. Language barrier is real but the structure is the most auditable. Once you can read the syntax, every state transition is in one place. |
| 2 | Charlie | Semantic UI | Flat component structure, declarative events (CSS-selector-like), HTML-first templates. A reviewer can trace any action: event selector -> handler method -> state call -> template output. |
| 3 | Delta | Svelte | HTML-centric, minimal boilerplate, readable control flow. `$:` is the one gotcha. |
| 4 | Foxtrot | Preact | Simple model closure, standard JSX, minimal abstraction layers. |
| 5 | Bravo | React | Reducer is auditable, but hook dependency arrays and memoization are unverifiable without framework knowledge. |
| 6 | Juliet | SolidJS | Single file is nice, but `setState` path syntax is opaque and event tuple syntax is non-obvious. |
| 7 | Echo | Vue 3 | Too many abstraction layers (ref/computed/v-model/writable-computed/router). The `filters` object is especially confusing. |
| 8 | Alpha | Lit | Custom decorator, event bubbling through shadow DOM, composed events, three-layer indirection for every action. |
| 9 | Golf | Riot.js | `opts.parentview` coupling, implicit update cycle, archaic patterns (`self = this`, `e.which`). |
| 10 | Hotel | Vanilla WC | "No framework" is a misnomer. This IS a framework -- just a bad, hand-rolled one. Maximum imperative spaghetti, maximum review cost. |

---

## Question 2: Agentic Choice

### My Criteria (in order of importance)

1. **Predictability of code generation** -- Can I produce correct code without running it? Does the framework have patterns I can follow mechanically?
2. **Refactoring safety** -- When requirements change, can I make targeted edits without cascading breakage?
3. **Bug surface area** -- How many categories of bugs can the framework's design *prevent*?
4. **Locality of reasoning** -- Can I understand a component without reading the entire app?
5. **Scalability of patterns** -- Will the patterns that work for TodoMVC still work at 100 components?

### Detailed Analysis

**India (Elm)** -- I would love to choose this. The architecture is perfect for an AI agent: pure functions, exhaustive types, compiler-verified state transitions. But I cannot. Elm's ecosystem is effectively dead. The language has not had a release since 2019. Interop with JS libraries requires ports. For a "large web application over many months," Elm is a strategic dead end.

**Juliet (SolidJS)** -- Strong candidate. Fine-grained reactivity means I rarely cause unnecessary re-renders. The store API lets me make surgical updates. Single-file components keep everything visible. The `setState` path syntax is unusual but learnable and mechanical. TypeScript support is solid. The framework is actively maintained and growing. My main concern: the `setState` overloads are a footgun even for an AI -- I need to be precise about which overload I'm invoking.

**Charlie (Semantic UI Next)** -- The declarative event system (`'keydown .new-todo'`) is excellent for agent work -- I can wire events without touching the template. The flat `createComponent` return object means I never forget lifecycle methods. Signal-based state with mutation methods (`state.todos.push()`, `state.todos.filter()`) is safer than manual get/set. The template syntax is HTML-first, which is easy to generate. The subtemplate system keeps things modular. However: this is a new framework, which means less training data for me and fewer escape hatches when I hit edge cases.

**Delta (Svelte)** -- Good locality, minimal boilerplate, HTML-first. But `$:` reactive declarations have ordering dependencies that are easy to get wrong. Two-way binding (`bind:`) creates implicit data flow I might not track across large apps. The event dispatcher pattern is verbose compared to alternatives.

**Bravo (React)** -- I have the deepest training data here. The reducer pattern is mechanical and predictable. But at scale, React's hook system creates dependency array bugs that even I find difficult to get right. `useCallback`/`useMemo` are correctness traps disguised as performance optimizations.

**Echo (Vue 3)** -- The Composition API is reasonable, but the interplay between `ref`, `reactive`, `computed`, `v-model`, and template auto-unwrapping creates a matrix of behaviors that is hard to keep straight. The `<script setup>` macro also limits my ability to reason about what code is actually generated.

**Foxtrot (Preact)** -- Same as React but lighter. The `setUpdatedAt(Date.now())` pattern in this specific codebase is a red flag -- it shows the framework doesn't have a clean story for external state.

**Alpha (Lit)** -- Web Components are a good platform bet, but Lit's decorator-heavy, event-bubbling-through-shadow-DOM patterns create a lot of ceremony. The custom `updateOnEvent` decorator is the kind of thing I'd have to write and maintain, and it's already a footgun.

**Golf (Riot.js)** -- Dead framework, terrible patterns for scale. No.

**Hotel (Vanilla WC)** -- Maximum boilerplate, maximum imperative code, maximum bug surface. Every feature requires touching 3-5 files and manually wiring DOM updates. This is anti-agent.

### Ranking: Best Framework for AI Agent Maintenance

| Rank | Implementation | Framework | Key Reasoning |
|------|----------------|-----------|---------------|
| 1 | Juliet | SolidJS | Best balance of safety, performance, and ecosystem. Surgical state updates. TypeScript. Active development. Fine-grained reactivity means fewer accidental bugs. |
| 2 | Charlie | Semantic UI | Declarative events are an agent's dream. Flat structure is predictable. Signal mutations are safe. Young ecosystem is the main risk. |
| 3 | Bravo | React | Maximum training data. Reducer pattern is mechanical. Hook footguns are manageable with discipline. Largest ecosystem for escape hatches. |
| 4 | Delta | Svelte | Good DX, HTML-first, but `$:` ordering and `bind:` create subtle bugs at scale. (Svelte 5 with runes would rank higher.) |
| 5 | India | Elm | Architecturally perfect, strategically dead. I'd choose it for a 6-month project with no JS interop needs. |
| 6 | Foxtrot | Preact | React-lite, good for small apps, but the model pattern shown here doesn't scale. |
| 7 | Echo | Vue 3 | Too many ways to do the same thing. The ref/reactive/computed matrix is a correctness hazard at scale. |
| 8 | Alpha | Lit | Shadow DOM ceremony is high. Good for design systems, overkill for app development. |
| 9 | Golf | Riot.js | Obsolete. No. |
| 10 | Hotel | Vanilla WC | The opposite of what an agent needs. Every abstraction I'd want, I'd have to build myself, and then maintain my own framework. |

---

## Question 3: What Surprised Me

### Charlie (Semantic UI Next) -- Positive Surprise

The event declaration system surprised me. Writing `'keydown .new-todo'({ self, event })` to declaratively bind an event handler with a CSS selector is remarkably clean. It eliminates an entire category of boilerplate (addEventListener, querySelector, event delegation) that every other framework here makes you write explicitly or hide behind a virtual DOM diff.

The `keys` block is also novel:
```js
keys: {
  'esc'({ state }) {
    if (state.editingId.get() === null) return true;
    state.editingId.set(null);
  },
}
```
Global keyboard shortcut handling as a first-class declarative concept, with `return true` to propagate -- that is thoughtful API design. None of the other nine frameworks have anything comparable without manual `addEventListener` wiring.

The signal mutation methods (`state.todos.push()`, `state.todos.filter()`, `state.todos.replaceItem()`, `state.todos.removeItem()`, `state.todos.setProperty()`) also surprised me. These are array-aware signal mutations that are both safe (they trigger reactivity) and ergonomic (they read like plain Array methods). Solid's `setState` path syntax achieves similar surgical updates but with much worse readability.

### Hotel (Vanilla Web Components) -- Negative Surprise

I was surprised by how much *worse* the "no framework" approach turned out. This is often marketed as "closer to the platform" and therefore simpler. In practice, it produced the largest codebase (14 files), the deepest imperative nesting, and the most bugs. The `toggleItems` method literally calls `.click()` on checkbox inputs to simulate user interaction. That is not "close to the platform." That is a Rube Goldberg machine.

The irony is that Hotel has the highest framework-concept count of any implementation here. It just doesn't have a *named* framework -- instead it has a *bespoke* framework scattered across 14 files that the reviewer must reverse-engineer.

### Echo (Vue 3) -- Negative Surprise

The `filters` object in `TodosComponent.vue` is inconsistent in a way that suggests the author did not understand Vue's reactivity:
```js
const filters = {
    all: (todos) => todos,
    active: (todos) => todos.value.filter(...),
    completed: (todos) => todos.value.filter(...),
};
```
The `all` filter returns the ref itself, while `active` and `completed` access `.value`. This means `filteredTodos` sometimes returns a ref and sometimes returns a plain array. The template then uses `filteredTodos.value` uniformly, which works for the ref case but silently returns `undefined` for the array case unless Vue's template unwrapping saves it. This is a real bug hiding in production-quality-looking code.

### India (Elm) -- Positive Surprise

The sheer auditability of the Elm implementation continues to impress me. Every possible user action is a variant of `Msg`. Every state transition is in one `update` function. The view is a pure function. There are no escape hatches, no `any` types, no `as` casts, no runtime exceptions. The `onEnter` helper is a clean abstraction. The use of `Html.Lazy` and `Html.Keyed` shows sophisticated performance awareness.

It is also the only implementation where I can guarantee there are no null reference errors, no undefined property access, and no type coercion bugs -- because the language makes those impossible.

---

## Question 4: Bug Audit

### Alpha (Lit)

| # | Severity | Issue |
|---|----------|-------|
| 1 | **Bug** | `#captureEscape` checks `e.key === "escape"` but the correct value is `"Escape"` (capital E). Pressing Escape will never trigger abort-edit. |
| 2 | **Bug** | `#abortEdit` resets the input value but does NOT set `this.isEditing = false`. The item stays in editing mode visually after pressing Escape, with only the text reset. |
| 3 | **Bug** | `todo-form` listens for both `@change` and `@keydown Enter`. The `@change` event fires on blur for text inputs, which means tabbing away from the input will also submit the todo (if non-empty). The `@keydown Enter` handler also calls `#onChange`, but the native `change` event will also fire on Enter in some browsers, potentially double-submitting. |
| 4 | **Code smell** | The `delete` method uses `index >>> 0` to handle -1 (not found). This silently splices the last element if the ID doesn't exist. A no-op or error would be safer. |
| 5 | **Code smell** | `clearCompleted()` casts `this.active` (a `ReadonlyArray`) to `Todo[]`. This is a type lie that breaks the readonly contract. |
| 6 | **Code smell** | `updateOnEvent` stores a single listener per element (`__updateOnEventListener`), meaning if two properties use `@updateOnEvent`, they share one listener. This works by accident (both call `requestUpdate`) but is fragile. |
| 7 | **Code smell** | The `ClearCompletedEvent` is missing from the `HTMLElementEventMap` declaration at the bottom of `events.ts`. |
| 8 | **Silent failure** | `todoList?.filter` uses optional chaining in the footer even after the `undefined` guard at the top. Harmless but suggests uncertainty about the data flow. |

### Bravo (React)

| # | Severity | Issue |
|---|----------|-------|
| 1 | **Bug** | `Input` component has a minimum length of 2 characters (`hasValidMin(value, 2)`), meaning single-character todos cannot be created. This is an arbitrary restriction not present in the TodoMVC spec. |
| 2 | **Bug** | The `sanitize` function HTML-encodes user input before storing it. This means the stored title contains entities like `&amp;`. When React renders `{title}`, it will display the literal text `&amp;` instead of `&`. Double-encoding will occur. |
| 3 | **Bug** | `Item` component's `useCallback` for `toggleItem` and `removeItem` depends on `[dispatch]` but captures `id` from the closure. If `id` changes (it shouldn't for a stable todo, but structurally this is wrong), the callbacks would be stale. |
| 4 | **Bug** | The `updateItem` callback takes `(id, title)` but when called as `handleUpdate`, it's called as `handleUpdate(title)` -- only one argument. This means `id` inside `updateItem` receives the `title` string, and `title` is `undefined`. The dispatched action will have `id: <title string>` and `title: undefined`. This silently corrupts data. |
| 5 | **Code smell** | `visibleTodos` filter for "all" case returns `todo` (the object) instead of `true`. Truthy, but semantically wrong. |
| 6 | **Code smell** | `Main` uses `visibleTodos.every(todo => todo.completed)` for toggle-all checked state, which means the checkbox reflects filtered state, not total state. If viewing "active" filter, toggle-all is never checked. |
| 7 | **Code smell** | `handleBlur` in `Input` is wrapped in `useCallback` with `[onBlur]` dependency, but all it does is call `onBlur`. This is unnecessary ceremony. |
| 8 | **Code smell** | `REMOVE_ALL_ITEMS` constant is defined but never used. |

### Charlie (Semantic UI Next)

| # | Severity | Issue |
|---|----------|-------|
| 1 | **Bug** | The `toggleAll` method calls `state.todos.map(t => ({ ...t, completed }))` which replaces all todos. But this receives a boolean from the checkbox's `checked` property. If all todos are already completed and you click toggle-all, `checked` will be `false`, unchecking all. However, the TodoMVC spec says toggle-all should check all if any are unchecked, and uncheck all only if all are checked. This implementation follows the checkbox's native checked state, which may diverge from spec in edge cases involving filtered views. |
| 2 | **Potential bug** | `selectedIf` and `maybePlural` are presumably built-in template helpers. If they're not registered or don't exist in the framework, the template will silently fail or render nothing. A reviewer cannot verify these without framework documentation. |
| 3 | **Code smell** | The `focusout .edit` handler checks `state.editingId.get() !== null` before saving, which guards against double-save. But if `saveTodo` calls `deleteTodo` (for empty input), the `editingId` is not reset before deletion, meaning the null-check might not protect against all sequences. |
| 4 | **Code smell** | `todo-item.js` defines a component via `defineComponent` but only provides a template -- no state, events, or createComponent. It's purely structural. This is valid but means all behavior is handled by the parent, including events on child elements via delegation. A reader might expect the item to have its own behavior. |
| 5 | **Missing** | The router file (`./router.js` equivalent) is not needed because `hashchange` is handled via the `'global hashchange window'` event declaration. Clean, but the filter state is only set on `hashchange` -- if the page loads with a hash already set, `setFilterFromHash` is called in `initialize`, which covers this. Good. |

### Delta (Svelte)

| # | Severity | Issue |
|---|----------|-------|
| 1 | **Bug** | `removeItem` uses the `index` from `{#each filtered as item, index}`. But `index` is the index into the *filtered* array, not the `items` array. Calling `items.splice(index, 1)` will remove the wrong item when a filter is active. If viewing "active" and the 2nd active item has index 1 in `filtered` but index 3 in `items`, you'll delete `items[1]` instead of `items[3]`. |
| 2 | **Bug** | `Item` component's `updateItem` uses `event.target.value` but the item stores `description`, not `title`. The Svelte `bind:item` creates two-way binding, so mutations in the child (`item.description = value`) directly mutate the parent's array element. This works but bypasses any validation or change tracking the parent might want. |
| 3 | **Bug** | The `router.js` file is imported but not included in the file list. If it doesn't exist or has issues, the filter functionality breaks entirely. The `router` function is called with a callback in `onMount` but is never cleaned up on destroy (no `onDestroy` to disconnect the hashchange listener). |
| 4 | **Code smell** | `items = items` is the classic Svelte reactivity trigger. It works, but it's a pattern that confuses every new developer. |
| 5 | **Code smell** | `item.completed = event.target.checked` in `Item` mutates the parent's data via `bind:item`. This is implicit two-way data flow that makes it hard to reason about state ownership. |
| 6 | **Code smell** | `handleEdit` checks for "Escape" with capital E but `handleEdit` on keydown would never see the event if `use:focusInput` hasn't focused the element yet (race condition). |

### Echo (Vue 3)

| # | Severity | Issue |
|---|----------|-------|
| 1 | **Bug** | The `filters` object is inconsistent: `all: (todos) => todos` returns the ref itself, while `active` and `completed` access `todos.value`. This means `filteredTodos` returns a ref for "all" but a plain array for "active"/"completed". The template uses `filteredTodos.value`, which works for the ref case (unwraps to array) but for the array case, `.value` is `undefined`. The `v-for` would iterate over nothing. |
| 2 | **Bug** | `editModel` computed setter writes to `editText.value` but the getter returns `props.todo.title`. This means the edit input always *displays* the original title (from the getter), not what the user types. The `v-model` will call the setter on each keystroke (writing to `editText`), but the *displayed value* is always `props.todo.title` because that's what the getter returns. The input fights the user. |
| 3 | **Bug** | `finishEdit` checks `editText.value.trim().length === 0` to decide whether to delete. But `editText` starts as `""` (empty string) and is only updated by the `editModel` setter. If the user double-clicks to edit but doesn't change anything and presses Enter, `editText.value` is still `""`, triggering deletion of the todo. |
| 4 | **Bug** | `@blur="cancelEdit"` on the edit input means clicking away cancels the edit. But pressing Enter calls `finishEdit` which checks `editText.value` -- if the user typed something and presses Enter, the blur event also fires (after Enter's handler), calling `cancelEdit` which sets `editing = false` but discards changes. Race condition between `finishEdit` and `cancelEdit`. |
| 5 | **Bug** | `TodoHeader` emits `add-todo` with `$event.target.value` but does not trim whitespace. Empty or whitespace-only strings become todos. |
| 6 | **Bug** | `toggleAllModel` getter returns `activeTodos.value.length === 0`. But `activeTodos` is a computed that returns `filters.active(todos)`, which accesses `todos.value` inside the filter. If there are no todos at all, `activeTodos.value.length === 0` is `true`, meaning toggle-all appears checked when there are zero todos. |
| 7 | **Code smell** | `htmlFor` is used in the template (`<label ... htmlFor="toggle-all-input">`). In Vue templates, the correct attribute is `for`, not `htmlFor` (that's React/JSX). This will render as a literal `htmlfor` attribute, not linking the label to the input. |
| 8 | **Code smell** | `TodoView.vue` exists only to wrap `TodosComponent.vue`. The router points all three routes to `TodoView`, which renders `TodosComponent`. This extra layer adds no value. |
| 9 | **Code smell** | The `uuid()` function generates a UUID-like string but does not comply with RFC 4122 (missing the variant bits in the right positions). Functional for ID uniqueness but misnamed. |

### Foxtrot (Preact)

| # | Severity | Issue |
|---|----------|-------|
| 1 | **Bug** | `TodoModel` is called inside the `App` component function body: `const model = TodoModel(update)`. Every re-render creates a new model instance with a new `onChanges` array, but the `todos` array is module-scoped (`let todos = []`). This means: (a) old model instances still reference `update` closures from previous renders, and (b) calling `inform()` from an old model calls stale setters. However, since `todos` is shared, it somewhat works by accident -- but stale closures will reference stale state. |
| 2 | **Bug** | `handleToggle` calls `e.preventDefault()` on the checkbox change event. This prevents the default checkbox behavior but `onToggle` already toggles the completed state in the model. However, `e.preventDefault()` on a checkbox `onChange` in Preact may cause the visual state to desync from the data state because the checkbox never actually changes its `checked` property natively. |
| 3 | **Bug** | The `hashchange` listener in `useEffect` is added via `addEventListener("hashchange", ...)` (on `window` implicitly). The cleanup function is missing -- the empty dependency array means it should return a cleanup function, but it doesn't: `useEffect(() => { ... }, [])` with no return. This leaks the listener. |
| 4 | **Code smell** | `setUpdatedAt(Date.now())` is a hack to force re-renders when the external model changes. This creates phantom state that exists solely to trigger renders. |
| 5 | **Code smell** | `FILTERS.all` returns `true` for every item, which is correct but the function signature `(todo) => true` has an unused parameter. Minor. |

### Golf (Riot.js)

| # | Severity | Issue |
|---|----------|-------|
| 1 | **Bug** | `removeTodo` uses `self.todos.some()` for side effects (splicing during iteration). `Array.some` stops at the first truthy return, but the callback never returns `true`, so `some` always iterates the entire array. The function works by accident but is semantically wrong -- it should use `forEach` or `findIndex`. |
| 2 | **Bug** | No unique IDs on todos. Todos are identified by object reference (`todo === t`). This makes persistence/restoration impossible without losing identity. The `todoStorage` saves/restores from localStorage, but after restoration, object references are broken -- so `removeTodo` will never find a match for a restored todo. |
| 3 | **Bug** | `editKeyUp` with `e.which === ESC_KEY` followed by `self.doneEdit()` will *save* the original title (because it resets the editbox value first). But `doneEdit` checks `opts.todo.editing` -- after ESC, `editing` should be false, but it's still true at that point. So ESC saves the original text (harmless but wrong semantics -- ESC should cancel, not save). |
| 4 | **Bug** | The `on('update')` handler sets `self.remaining` and `self.allDone` and calls `self.saveTodos()`. But `saveTodos` is called on every update, including route changes and initial mount. This saves todos even when nothing changed, creating unnecessary localStorage writes. |
| 5 | **Code smell** | `opts.parentview` coupling is an anti-pattern. Child components directly call methods on the parent, creating tight coupling. |
| 6 | **Code smell** | `e.which` is deprecated. Should use `e.key`. |
| 7 | **Code smell** | `var` instead of `let`/`const` throughout. |
| 8 | **Code smell** | IIFE wrapper in `app.js` and `store.js` with global variable communication (`window.todoStorage`). Archaic module pattern. |

### Hotel (Vanilla Web Components)

| # | Severity | Issue |
|---|----------|-------|
| 1 | **Bug** | `removeItem` in `todo-item.component.js` calls `this.remove()` (removing the DOM element) AFTER dispatching the event. But the event listener is on `this.list.listNode` in the parent. If `this.remove()` executes before the event bubbles (synchronous dispatch should be fine, but...), the parent might not process it. More critically: `removeItem` in `todo-app.component.js` splices `#data` using `forEach` + `splice` during iteration. Splicing during `forEach` shifts indices, potentially skipping the next element or causing an off-by-one. |
| 2 | **Bug** | `toggleItems` in `todo-list.component.js` calls `element.toggleInput.click()` to simulate toggling. This triggers real click events, which fire `toggleItem`, which dispatches `toggle-item` events, which the parent catches and updates `#data`. This is a Rube Goldberg machine that could cause cascading updates and depends on synchronous event processing. |
| 3 | **Bug** | `removeListeners` in `todo-item.component.js` removes the listener for `this.todoText` using `this.startEdit` as the reference, but `addListeners` registered `useDoubleClick(this.startEdit, 500)` (a wrapper function). These are different function references, so `removeEventListener` will silently fail to remove the listener. Memory leak on every todo item removal. |
| 4 | **Bug** | `todo-bottombar` displays `${this["active-items"]} ${"1" ? "item" : "items"} left!`. The string `"1"` in the ternary is always truthy. The actual check is `this["active-items"] === "1"`, which is correct in the code, but the *format string* always says "item" or "items" based on a string comparison. Wait, re-reading: `this["active-items"]` is a string from `setAttribute`. The comparison `this["active-items"] === "1"` is correct. However, the text content is set as a single string, not using innerHTML, so it displays correctly. Actually on re-inspection, the code is: ``this.todoStatus.textContent = `${this["active-items"]} ${this["active-items"] === "1" ? "item" : "items"} left!` `` -- this is correct. |
| 5 | **Bug** | `updateItem` in `todo-item.component.js` calls `this.cancelEdit()` which calls `this.editInput.blur()`. But `blur` triggers the `stopEdit` listener (registered on `this.editInput` for `blur`), which removes the `editing` class. Then `updateItem` was called from the key listener on `Enter`. So pressing Enter: (1) calls `updateItem`, (2) dispatches event, (3) calls `cancelEdit`, (4) blurs input, (5) `stopEdit` fires. But step 4 also triggers `blur` event -> `stopEdit` is called. If `updateItem` is also the blur handler... actually, `blur` is bound to `this.stopEdit`, not `this.updateItem`. So the flow is: Enter -> `updateItem` -> dispatch -> `cancelEdit` -> blur -> `stopEdit`. This seems fine, but `stopEdit` only removes the class. The actual "save" happened in `updateItem`. OK, this sequence works, but it's fragile. |
| 6 | **Code smell** | Storing state as HTML attributes (`item-completed`, `total-items`, `active-items`) and converting between strings and booleans/numbers constantly. This is error-prone and creates a lot of `parseInt` / `=== "true"` noise. |
| 7 | **Code smell** | `attributeChangedCallback` assigns `this[property] = newValue` using dynamic property names matching attribute names. This overwrites instance properties with strings, which could collide with method names or cause type confusion. |
| 8 | **Code smell** | The `useRouter` hook adds a `load` event listener, but `connectedCallback` may fire after `load` has already occurred, meaning the initial route may not be processed. |
| 9 | **Code smell** | `useDoubleClick` uses `new Date().getTime()` instead of `performance.now()`. Minor but less precise. |

### India (Elm)

| # | Severity | Issue |
|---|----------|-------|
| 1 | **Bug** | `onEnter` uses the deprecated `keyCode` field (integer 13) instead of `key` ("Enter"). `keyCode` is deprecated in the DOM spec, though still supported by all browsers. Not a functional bug today, but a standards compliance issue. |
| 2 | **Bug** | Filter links use `onClick (ChangeVisibility visibility)` on the `<li>`, not the `<a>`. This means the filter state updates on click, but the URL hash changes via `href`. These are two independent mechanisms -- the Elm model updates visibility on click, but if the user navigates directly to `#/active`, the model won't update (there's no hash-change subscription). The hash and the model can desync. |
| 3 | **Code smell** | `visibility` is typed as `String` rather than a union type. This means the pattern match in `isVisible` has a catch-all `_ -> True`, which would silently show all todos for any unexpected visibility value. A union type would make this a compiler error. |
| 4 | **Code smell** | The top-level wrapper `div` has `style "visibility" "hidden"`, which means the entire app is invisible until... actually, looking more carefully, this is the CSS for the `todomvc-wrapper` class. The TodoMVC CSS presumably overrides this. But if the CSS doesn't load, the entire app is invisible. This is a fragile coupling between Elm code and external CSS. |
| 5 | **Code smell** | `EditingEntry id False` on `onBlur` means blurring the edit field exits editing mode but doesn't save or discard. The input's `onInput` updates the model on every keystroke (`UpdateEntry`), so changes are already persisted before blur. This is correct but subtle -- it means there's no "cancel edit" functionality (pressing Escape is not handled). |

### Juliet (SolidJS)

| # | Severity | Issue |
|---|----------|-------|
| 1 | **Bug** | `addTodo` uses the deprecated `keyCode` property. `keyCode` is deprecated but functional. |
| 2 | **Bug** | `doneEditing` casts `e as any` when calling `save(todoId, e as any)`. The `save` function expects `{ target: HTMLInputElement }`, but `e` is a `KeyboardEvent`. The `target` property exists on `KeyboardEvent`, so this works at runtime, but the `as any` suppresses type checking and could hide real type errors. |
| 3 | **Bug** | `addTodo` prepends new todos (`[{ title, id: ... }, ...state.todos]`) instead of appending. This reverses the expected order -- new todos appear at the top. TodoMVC spec expects new items at the bottom. |
| 4 | **Bug** | `locationHandler` casts `location.hash.slice(2)` directly to `Filter`. If the hash is `#/somethingelse`, this becomes `"somethingelse"` which is not a valid `Filter` but is assigned anyway. The `|| "all"` fallback only triggers for empty string (falsy), not for invalid non-empty strings. |
| 5 | **Bug** | `save` function does nothing when `title` is empty (it checks `if (... && title)` and returns without action). This means editing a todo to empty text and blurring does nothing -- the todo remains with its old title. The TodoMVC spec says editing to empty should delete the todo. |
| 6 | **Code smell** | The event handler tuple syntax `onInput={[toggle, todo.id]}` passes `todo.id` as the first argument and the event as the second. This is Solid-specific API that would confuse any reviewer who expects standard event handler signatures. |
| 7 | **Code smell** | `ESCAPE_KEY = 27` and `ENTER_KEY = 13` are magic numbers. Using `e.key === "Escape"` would be more readable and standards-compliant. |
| 8 | **Code smell** | The `declare module "solid-js"` block to register the `setFocus` directive is TypeScript ceremony that only exists because of Solid's `use:` directive system. |

---

## Summary Table

| Implementation | Framework | Review Cost Rank | Agent Choice Rank | Bug Count (Actual Bugs) | Bug Count (Code Smells) |
|----------------|-----------|-----------------|-------------------|------------------------|------------------------|
| Alpha | Lit | 8 | 8 | 3 | 5 |
| Bravo | React | 5 | 3 | 4 | 4 |
| Charlie | Semantic UI | 2 | 2 | 1 | 3 |
| Delta | Svelte | 3 | 4 | 3 | 3 |
| Echo | Vue 3 | 7 | 7 | 6 | 3 |
| Foxtrot | Preact | 4 | 6 | 3 | 2 |
| Golf | Riot.js | 9 | 9 | 4 | 4 |
| Hotel | Vanilla WC | 10 | 10 | 3 | 4 |
| India | Elm | 1 | 5 | 2 | 3 |
| Juliet | SolidJS | 6 | 1 | 5 | 3 |

### Final Observations

**Echo (Vue 3) has the most actual bugs** -- six genuine logic errors including a broken edit flow and an inconsistent filter object that will cause runtime failures. This is notable because Vue is one of the most popular frameworks and this looks like "normal" Vue code. The bugs aren't exotic; they're the kind of mistakes that happen when the framework provides too many ways to achieve reactivity and the developer mixes them inconsistently.

**Charlie (Semantic UI Next) has the fewest bugs** -- one arguable behavioral divergence from spec and some normal code smells. The framework's design appears to prevent several categories of bugs: declarative events eliminate listener leaks, signal mutation methods prevent stale-state bugs, and the flat component structure prevents prop-drilling confusion.

**Hotel (Vanilla Web Components) proves that "no framework" is itself a framework choice** -- just the worst one. The implementation has to solve every problem that frameworks solve, but without the benefit of community-tested solutions. The result is more code, more bugs, and more cognitive load than any framework-based alternative.

**India (Elm) is the platonic ideal that reality rejected.** Architecturally it is superior to everything else here. But the Elm ecosystem's stagnation makes it a cautionary tale about how language-level safety guarantees mean nothing if the language itself stops evolving.

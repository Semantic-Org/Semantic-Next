# TodoMVC Framework Comparison

All five implementations were read file-by-file and assessed on the same criteria. Line counts are approximate (logic + template, excluding CSS-in-JS and license blocks).

---

## Comparison Table

| Criterion | Semantic UI | Svelte | Vue | Lit | React |
|---|---|---|---|---|---|
| **Source files** | 8 (4 JS + 4 HTML) | 4 `.svelte` + 1 router | 5 `.vue` + router config | 9 TS files | 8 JSX/JS files |
| **Lines of code** (logic+template) | ~175 | ~140 | ~160 | ~350 (excl. CSS-in-JS) | ~215 |
| **Separation of concerns** | Full (HTML files separate from JS) | Partial (SFC: script/template in one file) | Partial (SFC: script/template in one file) | None (template literals inside class methods) | None (JSX inline with logic) |
| **State management** | Signals with mutation helpers | Reassignment (`items = items`) | `ref()` + `.value` | Manual `EventTarget` + `#notifyChange()` | `useReducer` + action constants |
| **Component communication** | `findParent()` to walk up tree | Props down, `dispatch`/`bind:` up | Props down, `$emit()` up | Custom DOM events bubble up | `dispatch` prop drilled down |
| **Boilerplate ratio** | Low-medium | Low | Medium | High | High |
| **Readability (60s test)** | Good, once you know `findParent` and `{>subtemplate}` | Very good | Good | Difficult | Moderate |

---

## Detailed Commentary

### Semantic UI

**Strengths:**
- Clean separation of HTML templates from JavaScript logic. The templates read like markup, not code. `todo-item.html` is 9 lines of pure structure -- the shortest and most readable item template of any implementation.
- Signal mutation helpers (`setArrayProperty`, `setProperty`, `removeItem`, `push`) are genuinely ergonomic. `self.todos.setArrayProperty('completed', true)` is a one-liner that would take 3-5 lines in every other framework.
- The `{#each}` / `{#if}` template syntax is clean and familiar (close to Svelte's).
- `{classMap getClasses}` and built-in helpers like `{capitalize}` and `{maybeS}` reduce template noise.

**Weaknesses:**
- `findParent('todoList')` is the elephant in the room. Child components reach up into the parent's internals to grab `todos` and `filter` signals directly. This creates implicit coupling -- there's no contract, no prop interface, no type safety. If the parent renames `todos` to `items`, every child silently breaks. This is the weakest point of the entire implementation.
- The `_id` assignment hack in `getVisibleTodos()` (lines 20-23 of component.js) is a code smell -- mutating objects during a getter to assign IDs that should have been set at creation time.
- `await getText('./component.html')` and `await getText('./component.css')` at module top-level is unusual. It works, but it's a pattern a newcomer would stumble on.
- 8 files for one component feels heavy compared to Svelte's 4. The JS/HTML split is philosophically clean but practically means more files to navigate.
- The `scrollToBottom` method in both `component.js` and `todo-footer.js` is duplicated (footer's version appears unused but is still defined).

### Svelte

**Strengths:**
- The most concise implementation at ~140 lines. Every line earns its place.
- `$:` reactive declarations (`$: filtered = ...`, `$: numActive = ...`) are terse and clear. Derived state costs one line.
- `bind:item` for two-way binding on the Item is genuinely the shortest way to handle item mutation across all five frameworks.
- The template syntax is extremely readable. `class:completed={item.completed}` is a highlight.
- `use:focusInput` (action directive) is elegant for the focus-after-edit problem.

**Weaknesses:**
- `items = items` after `push`/`splice` is Svelte's well-known wart. It's a framework-imposed ceremony that looks like a mistake to newcomers.
- `createEventDispatcher` is verbose boilerplate for what amounts to calling a callback. This was addressed in Svelte 5, but this is the Svelte 4 version.
- The Footer receives three separate props (`numActive`, `currentFilter`, `numCompleted`) rather than the list itself. This is fine architecturally but means the parent pre-computes values the footer could derive.
- `router.js` is referenced but not included -- a dependency we can't evaluate.

### Vue

**Strengths:**
- `v-model` with computed getters/setters (`toggleModel`, `editModel` in TodoItem) is a powerful pattern for two-way binding with transformation. It's more explicit than Svelte's `bind:`.
- `computed()` for derived state is clear and well-understood.
- The SFC format keeps related concerns together without mixing them (script setup at top, template at bottom).

**Weaknesses:**
- The `uuid()` function is hand-rolled (21 lines) when `crypto.randomUUID()` exists. Minor, but noisy.
- Inconsistency in the filters object: `all: (todos) => todos` returns the ref directly, while `active` and `completed` access `.value`. This is a bug or at minimum confusing code -- `filters.all(todos)` returns a ref, `filters.active(todos)` returns an array.
- `filteredTodos.value` in the template (line 88) suggests the computed returns a ref-of-ref, which is a confusing level of unwrapping.
- `@keyup.enter` inline handler in TodoHeader.vue (lines 13-18) has inline `$emit` + value clearing + `@ts-ignore` comments. This is the messiest spot in any implementation.
- Vue requires `vue-router` as a dependency for URL filtering, adding significant external weight for a simple hash route.

### Lit

**Strengths:**
- The `Todos` class (todos.ts) is the best-architected state model across all five implementations. It's a plain class with clean getters (`all`, `active`, `completed`, `allCompleted`), explicit mutation methods, and a simple event-based change notification. Framework-agnostic and testable in isolation.
- Custom event classes (events.ts) are well-typed and self-documenting. The bubbling/composed pattern is correct for Shadow DOM.
- TypeScript throughout provides the strongest type safety of any implementation.

**Weaknesses:**
- By far the most verbose: ~350 lines of logic + ~130 lines of CSS-in-JS embedded in component files. The todo-item.ts file alone is 191 lines, of which ~80 are inline CSS. This is the fundamental Lit problem -- Shadow DOM means you can't share a stylesheet cleanly without explicit adoption, so every component carries its own styling weight.
- The `updateOnEvent` decorator (utils.ts) is 30 lines of boilerplate to solve a reactivity problem that other frameworks solve natively. It's clever but it's pure framework tax.
- `render()` methods return `html` template literals with deeply nested ternaries and interpolation. Reading the todo-list render method requires mentally parsing JavaScript string interpolation, `repeat()` directives, and property binding syntax simultaneously. This is the lowest readability of any implementation.
- 5 custom event classes for 5 operations is type-safe but heavy. Svelte dispatches with a string. React dispatches with an object. Lit requires a class definition, a static event name, typed constructor, and a global interface augmentation -- for each event.
- The `declare global { interface HTMLElementTagNameMap }` block appears in 4 files. It's necessary for TypeScript but it's pure noise from a TodoMVC perspective.

### React

**Strengths:**
- `useReducer` centralizes state mutations in one place (reducer.js). The reducer is a pure function -- easy to test, easy to reason about.
- The `Input` component is the only implementation that sanitizes user input (XSS protection). A small detail but notable.
- `memo()` on the Item component shows awareness of render performance.

**Weaknesses:**
- `useCallback` everywhere. The Item component has 5 `useCallback` calls, each with a dependency array. This is React's single biggest ergonomic failure -- the developer is manually managing a cache invalidation problem the framework created. In a TodoMVC app, none of these memoizations matter for performance; they exist purely to satisfy React's rendering model.
- The constants file (7 string constants) exists solely because the reducer pattern demands action type strings. It's boilerplate that adds a file and imports for no expressiveness gain.
- Prop drilling: `dispatch` is passed from App -> Header, App -> Main -> Item, App -> Footer. Every component receives and forwards the same function. There's no context provider, no store -- just manual threading.
- `className` instead of `class`, `htmlFor` instead of `for`, `onChange` instead of `onchange` -- the JSX naming divergence from HTML is a persistent paper cut.
- The Footer has `activeTodos.length === 1 ? "item" : "items"` plus a trailing `"left!"` with an exclamation mark that no other implementation includes -- a minor spec deviation but symptomatic of template logic mixing with markup.

---

## Rankings by Criterion

**Most concise:** Svelte > Semantic UI > Vue > React > Lit

**Best readability:** Svelte > Semantic UI > Vue > React > Lit

**Best separation of concerns:** Semantic UI > Svelte = Vue > React = Lit

**Best state ergonomics:** Semantic UI (signals) > Svelte ($: reactivity) > Vue (ref/computed) > Lit (EventTarget) > React (useReducer)

**Cleanest component communication:** Svelte (props + events) > Vue (props + $emit) > React (props + dispatch) > Lit (custom DOM events) > Semantic UI (findParent)

**Lowest boilerplate:** Svelte > Semantic UI > Vue > React > Lit

---

## Overall Assessment

**Svelte** wins on conciseness and readability. It has the least friction between what you want to say and how you say it. The `items = items` reassignment hack is its only notable flaw.

**Semantic UI** has the best template readability (separate HTML files that are pure markup) and the most ergonomic state mutation API. But `findParent()` for component communication is a meaningful architectural concern -- it trades explicitness for convenience and creates invisible coupling.

**Vue** is solid and predictable. No major flaws, no major innovations in this example. The SFC format works well. The filters inconsistency and inline `@ts-ignore` in the header are sloppy but fixable.

**React** suffers from self-imposed ceremony. The `useCallback` + dependency array pattern means ~40% of the Item component is boilerplate. The reducer pattern is clean in isolation but requires supporting infrastructure (constants, action objects) that adds files and imports.

**Lit** is the most architecturally rigorous (the `Todos` model class is excellent) but pays a steep price in verbosity. CSS-in-JS, TypeScript declarations, custom event classes, and decorator-based reactivity workarounds make it 2-2.5x larger than Svelte for the same functionality. The inline template literals are the hardest to read of any implementation.

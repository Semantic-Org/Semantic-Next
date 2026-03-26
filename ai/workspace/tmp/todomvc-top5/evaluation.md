# Framework Evaluation: TodoMVC Implementations

## Framework Identification

| Label   | Framework     | Identifying Syntax |
|---------|---------------|--------------------|
| Alpha   | Svelte (v3/4) | `.svelte` files, `$:` reactive declarations, `{#each}`, `{#if}`, `on:click`, `bind:item`, `createEventDispatcher` |
| Bravo   | SolidJS       | `createStore`, `createMemo`, `createEffect`, `<Show>`, `<For>`, `use:` directives, `onCleanup`, fine-grained reactivity |
| Charlie | Semantic UI   | `defineComponent`, `@semantic-ui/component`, `@semantic-ui/utils`, `{#each todo in filteredTodos}`, `{>todoItem}` sub-templates, `{#snippet}`, separated `.html`/`.js`, event hash objects, `state.todos.push()` |
| Delta   | React         | `useReducer`, `useCallback`, `useMemo`, `memo`, JSX with `className`, `react-router-dom`, reducer/dispatch pattern |
| Echo    | Lit           | `LitElement`, `html` tagged templates, `@customElement`, `@property`, `@state`, `@query`, `.prop=` binding, `@click` event syntax, `classMap`, `repeat` directive |

---

## Question 1: Code Review Cost

**Premise:** A senior JS engineer with zero framework experience must verify correctness.

### Alpha (Svelte)

**Framework concepts required to learn:**
1. `$:` reactive declarations -- what triggers them, when do they rerun
2. `{#each ... (key)}` -- keyed iteration, the `(item.id)` syntax
3. `{#if}` -- conditional rendering
4. `bind:item` -- two-way binding (and its implications for child-to-parent mutation)
5. `on:eventName` -- event forwarding / custom events
6. `createEventDispatcher` -- the custom event dispatch system
7. `export let` -- props declaration (looks like a variable export, acts as an input)
8. `class:selected={expr}` -- conditional class binding
9. `use:focusInput` -- action directives
10. `tick()` -- microtask timing for DOM updates
11. `items = items` -- the assignment-triggers-reactivity idiom (the single most confusing Svelte-ism for newcomers)

**Verifiability by reading:** Mixed. The template syntax is mostly HTML-like and readable. But the `items = items` pattern after `.push()` or `.splice()` is a correctness trap -- a reviewer would not know this is *required* for reactivity without understanding the compiler. The `bind:item` in the each loop silently enables mutation flow from child to parent, which is invisible in the code and extremely hard to verify by reading.

**Bug-catching ability:** Medium. The `items = items` pattern looks like dead code and a reviewer would likely flag it as a bug (it is not). They would miss actual bugs like stale closures in the `removeItem` callback that captures `index` from `{#each}` -- the index binding here is actually wrong if items are reordered while filtered. This is a real bug that even a framework-aware reviewer might miss.

**Specific issue spotted:** `on:removeItem={() => removeItem(index)}` captures `index` from the `{#each}` of `filtered`, not `items`. If filter is "active" and you delete the 2nd active item, `index` is 1 in the filtered array, but `items.splice(1, 1)` removes the 2nd item from the *unfiltered* array. This is a genuine correctness bug.

**Score: 5/10**

---

### Bravo (SolidJS)

**Framework concepts required to learn:**
1. `createStore` -- deep reactive store, path-based updates
2. `createMemo` -- derived computations
3. `createEffect` -- side effects that auto-track dependencies
4. `<Show when={}>` -- conditional rendering component
5. `<For each={}>` -- list iteration component
6. `onCleanup` -- disposal
7. `use:setFocus` -- custom directive syntax
8. `classList={{}}` -- conditional class object
9. `onInput={[handler, arg]}` -- the tuple syntax for partial application of event handlers
10. `setState("todos", (item) => item.id === todo.id, todo)` -- path-based store updates with predicate matching
11. Fine-grained reactivity model -- functions must be called in templates (`remainingCount()` not `remainingCount`)

**Verifiability by reading:** Poor. This is a single 157-line file that packs store creation, local storage persistence, filtering, editing, all event handling, and the entire template into one dense function. The `setState` path-based update syntax (`setState("todos", (t) => t.filter(...))`) is deeply non-obvious -- does this replace the array? Filter it? A reviewer cannot know without reading SolidJS documentation.

The tuple event handler syntax `onInput={[toggle, todo.id]}` is an optimization pattern specific to SolidJS. A reviewer would read this as an array being passed as an event handler, which makes no sense in standard JS. The `use:setFocus` directive requires understanding how SolidJS invokes directives, and the `declare module` block to make it typecheck is pure ceremony.

**Bug-catching ability:** Low. The `e.keyCode` usage is deprecated but not broken. The `save` function destructures `{ target: { value } }` with a type assertion `{ target: HTMLInputElement }` while receiving the event from `onFocusOut={[save, todo.id]}` -- but the tuple syntax means `save` receives `(todoId, event)`, not `(event)`. A reviewer unfamiliar with the tuple calling convention would completely misread this function's signature.

**Specific issue spotted:** `e.keyCode` is deprecated. The `save` function signature `(todoId: number, { target: { value }}: { target: HTMLInputElement })` lies about what it receives -- the tuple handler calls `save(todo.id, event)` but the type annotation says the second argument has shape `{ target: HTMLInputElement }`, which works *accidentally* because a FocusEvent has a `target` property. This kind of type coercion through structural typing is fragile.

**Score: 3/10**

---

### Charlie (Semantic UI)

**Framework concepts required to learn:**
1. `defineComponent({ tagName, template, css, defaultState, createComponent, events, keys, subTemplates })` -- component registration API
2. `state.todos.get()` / `state.todos.set()` -- signal access pattern
3. `state.todos.push()`, `.removeItem()`, `.replaceItem()`, `.setProperty()`, `.filter()`, `.map()` -- signal mutation helpers
4. `self.methodName()` -- calling own methods
5. `reaction(() => {...})` -- reactive side effects
6. `{#each todo in filteredTodos}` -- template iteration
7. `{#if expr}` -- conditional rendering
8. `{>todoItem ...}` -- sub-template invocation
9. `{#snippet name}` -- inline template snippets
10. `{classMap {...}}` -- class helper
11. `{selectedIf is filter 'all'}`, `{maybePlural activeCount}` -- Lisp-style helper expressions
12. Event hash pattern: `'keydown .new-todo'({ self, event })` -- jQuery-style delegated events
13. `data-id` / `data` parameter in events -- how data flows from templates to handlers
14. `afterFlush` -- post-render callback

**Verifiability by reading:** Good, with caveats. The separation of template (HTML) from logic (JS) means a reviewer can read the template and understand the DOM structure independently. The event hash pattern (`'keydown .new-todo'`) is immediately readable to anyone who has used jQuery or Backbone -- it is CSS selector based delegation, which is a well-known pattern. The `createComponent` return value is essentially a plain object of methods, each doing clearly named operations.

The `state.todos.push()` / `.removeItem()` / `.filter()` methods read like what they do -- you do not need framework knowledge to guess that `state.todos.push(item)` adds an item. This is a significant readability advantage over Svelte's `items = items` or SolidJS's `setState("todos", predicate, patch)`.

The Lisp-style expressions (`{selectedIf is filter 'all'}`, `{maybePlural activeCount}`) are the main cognitive speed bump. A reviewer needs to understand that `is` is a comparison helper and `selectedIf` / `maybePlural` are presumably template helpers, but they read somewhat like natural language.

**Bug-catching ability:** High. The data flow is explicit: template renders state, events mutate state, state re-renders template. There are no implicit bindings, no closure captures over indices, no two-way binding surprises. A reviewer could trace from `'click .destroy'` -> `self.deleteTodo(data.id)` -> `state.todos.removeItem(id)` and verify the full chain.

**Specific issue:** The `{selectedIf is filter 'all'}` and `{maybePlural activeCount}` helpers are used but never defined in the visible code. A reviewer would need to know these come from the framework or are registered elsewhere. This is an unverifiable gap. Also, `toggleAll(completed)` calls `state.todos.map(t => ({ ...t, completed }))` -- it is unclear whether `.map()` on a signal mutates in place or returns a new value. The semantics of signal array methods could surprise.

**Score: 6/10**

---

### Delta (React)

**Framework concepts required to learn:**
1. `useReducer` -- state management via dispatch/action pattern
2. `useCallback(fn, deps)` -- memoized callbacks (the dependency array is the hard part)
3. `useMemo(fn, deps)` -- memoized derived values (same)
4. `memo()` -- component memoization HOC
5. `useState` -- local component state
6. JSX -- HTML-in-JS (`className`, `htmlFor`, `onDoubleClick` vs `ondblclick`)
7. `react-router-dom` -- `useLocation`, `HashRouter`, `Routes`, `Route`
8. Reducer pattern -- switch/case with action types and payloads

**Verifiability by reading:** Medium. The reducer is the most verifiable part -- it is a pure function, each case returns new state, and the action types are explicit constants. A reviewer can read the reducer in isolation and verify every state transition.

However, the component tree passes `dispatch` through every component, and the `useCallback` dependency arrays are the main correctness concern. The reviewer must understand that stale closures are the failure mode, and that dependency arrays are the mitigation. This is non-obvious and error-prone even for experienced React developers.

The code is spread across 9 files for a TodoMVC app. The `Input` component contains a `sanitize` function that HTML-encodes characters -- a reviewer would need to verify whether React already handles this (it does, via JSX escaping), making this double-encoding and potentially a display bug.

**Bug-catching ability:** Medium-Low. The `sanitize` function in `input.jsx` is actually a bug: React already escapes text content in JSX. If someone types `Fish & Chips`, the sanitized value would display as `Fish &amp; Chips` literally, because React escapes the already-escaped string. The `hasValidMin(value, 2)` check silently enforces a 2-character minimum for todo titles, which is an undocumented business rule that differs from every other implementation. The `visibleTodos.every((todo) => todo.completed)` check for toggle-all operates on *filtered* todos, not all todos -- if you are viewing "active" items, toggle-all checks if all active items are completed (which would be none of them), so the checkbox state is wrong in filtered views.

The `useCallback` on `removeItem` in `item.jsx` captures `id` in its closure but lists `[dispatch]` as the dependency -- this works by accident because `id` comes from the destructured `todo` prop which is stable per `memo`, but it is technically a stale closure risk if the component identity model changes.

**Specific issue:** `item.jsx` accepts an `index` prop that is never used inside the component body. Dead code. The `sanitize` function double-encodes. The 2-character minimum is a silent behavioral difference. These are exactly the kinds of bugs that are hard to catch without running the code.

**Score: 4/10**

---

### Echo (Lit)

**Framework concepts required to learn:**
1. `LitElement` class -- lifecycle (`connectedCallback`, `disconnectedCallback`, `render`, `requestUpdate`)
2. `@customElement("tag-name")` -- decorator for custom element registration
3. `@property()` / `@state()` -- reactive property decorators
4. `@query("selector")` -- DOM query decorator
5. `html` tagged template literal -- Lit's template syntax
6. `.prop=${value}` -- property binding (vs attribute binding)
7. `@click=${handler}` -- event binding
8. `classMap({})` -- conditional class directive
9. `repeat(items, keyFn, templateFn)` -- keyed list rendering directive
10. `nothing` -- Lit's sentinel for rendering nothing
11. Custom `updateOnEvent` decorator -- a project-specific decorator that auto-subscribes to events
12. `Todos` class -- EventTarget-based observable model with manual change notifications
13. Custom Event classes (`AddTodoEvent`, `DeleteTodoEvent`, etc.) with typed event maps
14. `dispatchEvent` / `addEventListener` for component communication

**Verifiability by reading:** Poor to Medium. The architecture is *principled* -- it uses standard web platform APIs (Custom Elements, EventTarget, CustomEvent) -- but the abstraction cost is enormous. The reviewer must understand:
- 10 files for a todo app
- 5 custom event classes with TypeScript generics and `declare global` augmentations
- A custom decorator (`updateOnEvent`) that intercepts property setters to add event listeners
- The `Todos` model class that extends `EventTarget` and manually fires `change` events
- How `.prop=${value}` differs from `prop=${value}` in Lit templates

The `updateOnEvent` decorator in `utils.ts` is particularly hard to verify. It patches property descriptors at the prototype level, intercepts `set`, removes old event listeners, adds new ones, and relies on `requestUpdate` being available on the host. A reviewer would need to understand JavaScript property descriptors, the Lit update lifecycle, and decorator evaluation order.

**Bug-catching ability:** Low. The `#captureEscape` in `todo-item.ts` checks for `e.key === "escape"` -- but the correct value is `"Escape"` (capital E). This is a real bug: pressing Escape will not cancel editing. A reviewer would only catch this if they know the KeyboardEvent.key spec values. The `delete` method uses `index >>> 0` which silently converts -1 to 4294967295, making the splice a no-op -- this is documented in a comment but is still a "clever code" anti-pattern that obscures intent. The `clearCompleted` method casts `this.active` (a `ReadonlyArray`) to `Todo[]` -- this is a type lie.

**Score: 2/10**

---

### Question 1 Rankings

| Rank | Framework       | Score | Rationale |
|------|-----------------|-------|-----------|
| 1    | **Charlie** (Semantic UI) | 6/10 | Separated template/logic, jQuery-familiar event delegation, signal methods that read like English. Lisp helpers are the main opaque spot. |
| 2    | **Alpha** (Svelte) | 5/10 | Template syntax is readable HTML. Sabotaged by `items = items`, invisible `bind:` mutation, and the real index bug. |
| 3    | **Delta** (React) | 4/10 | Reducer is pure and verifiable. Killed by `useCallback` dep arrays everywhere, `sanitize` double-encoding bug, dead `index` prop, and 9-file sprawl. |
| 4    | **Bravo** (SolidJS) | 3/10 | Dense single file. Path-based store updates are unreadable. Tuple event handlers are alien. Deprecated `keyCode`. |
| 5    | **Echo** (Lit) | 2/10 | 10 files, 5 custom event classes, a custom decorator, TypeScript generics, `declare global` blocks, a property-descriptor-patching utility -- all for a todo app. The `"escape"` vs `"Escape"` bug. Platform-correct but review-hostile. |

---

## Question 2: Agentic Choice

**Criteria evaluated:** pattern predictability, data flow traceability, modification safety, template/logic ratio, error surface, and conciseness.

### Pattern Predictability

| Framework | Assessment |
|-----------|-----------|
| Alpha (Svelte) | Medium. Templates are predictable. But reactivity rules are implicit (must know what triggers updates). The `$:` declarations look like labels. |
| Bravo (SolidJS) | Low. Path-based store updates have multiple calling conventions. The difference between `setState("todos", fn)` replacing vs filtering is not self-evident. Template components (`<Show>`, `<For>`) vs control flow means memorizing which component does what. |
| Charlie (Semantic UI) | High. Every component follows the same shape: `{ defaultState, createComponent, events, keys }`. Events are always `'eventType .selector'`. State is always `state.thing.get()` / `state.thing.set()`. Templates always use `{#if}` / `{#each}` / `{>subTemplate}`. One pattern, repeated. |
| Delta (React) | Medium-High for the reducer, Low for the components. Reducers are perfectly predictable. But each component reinvents its callback/memo strategy. `useCallback` dependency arrays are the highest-entropy pattern in the codebase -- every instance is a new correctness puzzle. |
| Echo (Lit) | Medium. Class-based components are structurally consistent. But the event system (custom event classes + addEventListener in constructor + dispatchEvent in children) is a multi-file indirection chain. |

### Data Flow Traceability

| Framework | Assessment |
|-----------|-----------|
| Alpha | Hard. `bind:item` creates invisible bidirectional flow. Custom events via `dispatch` require tracing across files. |
| Bravo | Medium. Everything is in one file (good), but the store update paths are opaque (bad). |
| Charlie | Easy. Template -> event hash -> handler -> state mutation -> template re-render. Every step is in the same file, explicitly named. `data.id` in events comes from `data-id` in templates -- mechanical mapping. |
| Delta | Hard. `dispatch` is threaded through 4 levels. To trace "what happens when I click delete," you go: `item.jsx` onClick -> `removeItem` useCallback -> `dispatch({type: REMOVE_ITEM})` -> `constants.js` for the string -> `reducer.js` for the case. Five files for one action. |
| Echo | Very Hard. Click in `todo-item.ts` -> `dispatchEvent(new DeleteTodoEvent(id))` -> event bubbles through shadow DOM (composed: true) -> caught by `addEventListener` in `todo-app.ts` constructor -> calls `this.todoList.delete(id)` -> `todos.ts` mutates array -> fires `change` event -> `updateOnEvent` decorator intercepts -> calls `requestUpdate`. Seven hops. |

### Modification Safety (Can I add a feature without breaking something?)

| Framework | Assessment |
|-----------|-----------|
| Alpha | Medium. Adding state is easy (new `let`). But the `items = items` requirement means forgetting it silently breaks reactivity. |
| Bravo | Low. Adding a new piece of state means choosing between `createSignal`, `createStore`, `createMemo` -- and getting the reactivity granularity wrong silently produces stale UI. |
| Charlie | High. Add state to `defaultState`, add a method to `createComponent`, add an event to `events`. Each is additive, none risk breaking existing code. The separation of concerns means template changes do not touch logic and vice versa. |
| Delta | Medium-Low. Adding an action means: new constant, new reducer case, new `useCallback` in the component, threading `dispatch` if it is not already there. Miss a dependency array entry and you get a stale closure. |
| Echo | Low. Adding a feature means: potentially a new event class, a new `addEventListener` in the parent, a new `dispatchEvent` in the child, updating TypeScript global declarations. The ceremony-to-feature ratio is brutal. |

### Template/Logic Ratio

| Framework | Template % (approx) | Assessment |
|-----------|---------------------|-----------|
| Alpha | ~50% | Good separation via `.svelte` file structure |
| Bravo | ~35% | JSX with heavy inline logic, ternaries, and callbacks |
| Charlie | ~40% template, ~60% logic | Clean split: HTML files are pure template, JS files are pure logic |
| Delta | ~30% | JSX spread across 5 component files, logic dominates |
| Echo | ~20% | Lit templates are tiny `html` blocks buried inside large class definitions with extensive CSS |

### Error Surface

| Framework | Assessment |
|-----------|-----------|
| Alpha | Medium. Silent reactivity failures (forgot `items = items`), stale index captures. |
| Bravo | High. Stale closures from incorrect memo deps, store update path errors, directive typing issues. |
| Charlie | Low. Events that do not match a selector silently do nothing (safe failure). State mutations through signal helpers are atomic. No closure capture issues because events receive fresh `data` each time. |
| Delta | High. Stale closures from `useCallback`/`useMemo` deps, reducer action typos caught at runtime only, prop threading errors. |
| Echo | Medium-High. TypeScript catches many errors, but the custom decorator, manual event wiring, and `EventTarget` pattern have no compile-time verification of event routing correctness. |

### Conciseness

| Framework | Total Lines (approx) | Files |
|-----------|---------------------|-------|
| Alpha | ~125 | 5 |
| Bravo | ~157 | 1 |
| Charlie | ~190 | 4 |
| Delta | ~230 | 9 |
| Echo | ~600+ | 10 |

### Agentic Choice: Final Ranking

| Rank | Framework | Rationale |
|------|-----------|-----------|
| **1** | **Charlie (Semantic UI)** | Highest pattern predictability. Every component has the same structure. Data flow is a straight line. Modification is additive. Template/logic separation means I can change one without risking the other. No closure capture issues. The signal mutation helpers (`push`, `removeItem`, `filter`) do what they say. If I need to maintain this codebase for months, this is the one where I am least likely to introduce regressions. |
| **2** | **Alpha (Svelte)** | Good template readability, reasonable file structure. The main risk is the implicit reactivity rules -- I would need to remember the `items = items` pattern and avoid mutation patterns that do not trigger updates. But the component model is simple and the template language is close to HTML. |
| **3** | **Bravo (SolidJS)** | Single-file is convenient for small apps, but the dense store update syntax and fine-grained reactivity model mean I would need to think carefully about every state update. The upside is that it is all in one place -- no file-hopping. |
| **4** | **Delta (React)** | The reducer pattern is predictable and testable, which I value. But the `useCallback`/`useMemo` ceremony in every component is a tax on every modification. Threading `dispatch` everywhere creates coupling. Nine files for TodoMVC is excessive. |
| **5** | **Echo (Lit)** | The most architecturally "correct" -- web standards, proper encapsulation, typed events. But the implementation cost is staggering. 600+ lines and 10 files for a todo app. Every feature requires touching 3-5 files. The custom `updateOnEvent` decorator is a maintenance liability that requires deep understanding of Lit internals and property descriptors. I would dread adding features to this codebase. |

---

## Question 3: Which Surprised You?

### Charlie (Semantic UI) -- Positive Surprise

I expected this to be the hardest to evaluate because it is the framework I have the least training data for. Instead, it turned out to be the most immediately readable of the five.

The event hash pattern was the key insight. When I see:

```js
'click .destroy'({ self, data }) {
    self.deleteTodo(data.id);
}
```

I can read this in one pass: "when `.destroy` is clicked, delete the todo identified by `data.id`." There is no indirection. No `useCallback`. No `dispatch`. No `createEventDispatcher`. No custom event class. The event name is the key, the CSS selector scopes it, and the destructured arguments give you exactly what you need.

The `data-id` to `data.id` mapping is implicit but follows a mechanical convention (HTML data attributes become the `data` object). Once you know the rule, you can apply it everywhere. This is the kind of convention-over-configuration pattern that scales well for agents -- learn one rule, apply it to every component.

What genuinely surprised me: the template helpers like `{maybePlural activeCount}` and `{selectedIf is filter 'all'}` read like natural language. The Lisp-style expression syntax (`is filter 'all'`) is unusual but self-describing. I expected this to be a readability liability, but in practice it is closer to how I would describe the logic in English than any of the JS-expression alternatives (`filter === 'all'`, `state.showMode === "all"`, `currentFilter === "all"`).

The template/logic separation also means the HTML file is a pure structural document that a designer could read, while the JS file is pure behavior. None of the other implementations achieve this.

### Echo (Lit) -- Negative Surprise

I expected the web-standards-based approach to be the most reviewable, since it uses platform primitives (Custom Elements, EventTarget, CustomEvent) that a senior JS engineer would presumably know. Instead, it is the least reviewable of all five.

The problem is not the platform APIs -- it is the abstraction layer built on top of them. The `updateOnEvent` decorator patches property descriptors on class prototypes to intercept setter calls and manage event listener lifecycles. This is metaprogramming that requires understanding:
1. How TypeScript/Babel decorators compile to property descriptors
2. How Lit's `@state()` and `@property()` decorators interact with custom descriptors
3. The execution order of stacked decorators (`@updateOnEvent("change")` before `@state()`)
4. How `requestUpdate` triggers Lit's render cycle

A senior JS engineer who knows the platform would still be lost in this decorator chain. The irony is that using platform APIs added *more* framework-specific complexity, not less, because the Lit abstractions over those APIs (`@property`, `@state`, `@query`, `html`, `css`, `nothing`, `classMap`, `repeat`) are themselves a framework vocabulary that must be learned.

The `"escape"` vs `"Escape"` bug in `todo-item.ts` is telling. It is the exact kind of error that would be caught by running the code but is nearly invisible in review. The Escape key comparison is case-sensitive per spec, and the implementation uses lowercase -- a subtle platform-knowledge trap in a codebase that prides itself on platform correctness.

### Delta (React) -- Mixed Surprise

The `sanitize` function in `input.jsx` was the most surprising find. React has auto-escaped JSX text content since its inception -- it is one of React's most well-known security features. Yet this implementation includes a hand-rolled HTML entity encoder that processes text *before* passing it to JSX. This means if a user types `Fish & Chips`, it gets stored as `Fish &amp; Chips` and displayed literally with the escape entity visible. This is a correctness bug that would be immediately visible when running the app, but is easy to miss in code review because the `sanitize` function *looks* responsible and security-conscious.

The 2-character minimum (`hasValidMin(value, 2)`) is also notable -- none of the other four implementations enforce this, making it a silent behavioral divergence. This is exactly the kind of "helpful" addition an AI agent might make that introduces specification drift.

### Bravo (SolidJS) -- Technical Surprise

The single-file approach was initially appealing for its locality. But re-reading it, I realized the dense `const` declarations at the top create a wall of function references that must all be held in mental memory simultaneously:

```js
const [state, setState] = createLocalStore<TodoStore>({...}),
  remainingCount = createMemo(...),
  filterList = ...,
  removeTodo = ...,
  editTodo = ...,
  clearCompleted = ...,
  toggleAll = ...,
  setEditing = ...,
  addTodo = ...,
  save = ...,
  toggle = ...,
  doneEditing = ...;
```

Twelve bindings in a single `const` declaration. This is syntactically valid but cognitively hostile -- especially when several of these functions (`save`, `toggle`, `doneEditing`) call each other, creating implicit dependency chains within the flat list. The comma-separated declaration style obscures which functions are independent and which form call chains.

---

## Summary Table

| Dimension | Alpha (Svelte) | Bravo (SolidJS) | Charlie (Semantic UI) | Delta (React) | Echo (Lit) |
|-----------|:-:|:-:|:-:|:-:|:-:|
| Review Cost (1=easiest) | 2 | 4 | **1** | 3 | 5 |
| Agentic Preference (1=best) | 2 | 3 | **1** | 4 | 5 |
| Pattern Predictability | Medium | Low | **High** | Medium | Medium |
| Data Flow Traceability | Hard | Medium | **Easy** | Hard | Very Hard |
| Modification Safety | Medium | Low | **High** | Medium-Low | Low |
| Conciseness | **~125 LOC** | ~157 LOC | ~190 LOC | ~230 LOC | ~600+ LOC |
| Real Bugs Found | 1 (index) | 1 (keyCode) | 0 confirmed | 3 (sanitize, min-length, toggle-all) | 1 (Escape case) |

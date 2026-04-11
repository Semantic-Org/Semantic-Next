---
title: What's Novel in Semantic UI
description: Design departures from mainstream frameworks that an agent would miss without being told. Read before reviewing examples or writing code — calibrates attention toward the non-obvious decisions.
keywords: [novel, departures, design, lisp, flat context, expressions, natural language, signals, async, template language, what to notice, runtime, no compile, proxy, reactivity granularity, mutation helpers]
audience: essentials
skill: novel-patterns
type: skill
---

# What's Novel in Semantic UI

> **Skill:** `novel-patterns`
> **Purpose:** Calibrate your attention before reading code. These are the design decisions you'd miss if you pattern-matched to React, Svelte, or Vue.

---

**Golden rule:** This framework is built around the thesis that natural language's fuzziness is a feature, not a bug. Words narrow meaning through context — "large" means something different next to "button" than next to "modal." The same design instinct runs through the template language, the data model, and the component API. When something looks imprecise, that's usually intentional — the ambiguity is the mechanism.

---

## Departures

Ordered by how much they'd surprise you. The first few are things no other framework does. The later ones are things other frameworks do differently.

### 1. Runtime-Only Architecture — No Compile Step

**There is no compiler, no build plugin, no framework-specific CLI.** Templates are parsed at runtime into a flat AST (sub-millisecond, once per component prototype). A `Proxy`-based expression evaluator resolves expressions against the data context at runtime.

```html
❌ What you'd assume: a build step transforms templates into optimized render functions (Svelte, Vue SFC)
✅ What SUI does: templates are strings evaluated at runtime via Proxy — no transpiler, no code generation
```

**What to notice:** This single decision enables the dual expression syntax, signal auto-unwrapping, and the absence of build tooling. It's the architectural root that the other departures grow from.

**Why it matters:** An agent working with SUI should never look for a compiler config, a babel plugin, or a `.svelte`/`.vue` file extension. Components are plain `.js` and `.html` files. The framework is self-contained.

### 2. Dual Expression Syntax — Lisp and JS in the Same Expression

**No mainstream web framework does this.** Expressions support Lisp-style (space-separated) and JavaScript-style (parens and commas) simultaneously, including mixed forms:

```html
{titleCase concat firstName ' ' lastName}              <!-- Lisp: zero parens -->
{items.filter(i => i.active).length}                    <!-- JS: standard syntax -->
{concat 'hi ' (isDog ? 'simon dog' : 'pookie cat')}    <!-- mixed -->
{formatDate date 'h:mm a' { timezone: timezone }}       <!-- Lisp with inline object -->
```

```
❌ Handlebars: {{titleCase (concat firstName " " lastName)}}  — helper nesting with parens
❌ JSX: {titleCase(concat(firstName, ' ', lastName))}         — three nested pairs + commas
✅ SUI: {titleCase concat firstName ' ' lastName}             — zero parens, reads like intent
```

**What to notice:** Authors pick whichever form is natural for the specific expression. Lisp-style chains right-to-left without nesting parentheses. JS-style handles complex predicates and inline logic. The framework doesn't impose a paradigm.

**Why it matters:** The Lisp style eliminates parentheses that carry no information — `{titleCase concat firstName ' ' lastName}` is zero parens while the JS equivalent nests three pairs. Having both styles means the natural representation is always available without forcing expressions into a single calling convention.

### 3. Per-Expression Reactivity — Not Per-Component

Each `{expression}` in a template is its own reactive scope. When a signal changes, only the specific DOM nodes that depend on it re-evaluate. The template AST is never re-walked.

```
❌ React: component re-renders entirely, diffed via virtual DOM
❌ Vue: component re-renders, diffed via virtual DOM (finer than React, still component-scoped)
✅ SUI: individual expressions re-evaluate — closer to Solid than to React
```

**What to notice:** There is no virtual DOM. There is no component-level re-render. A component with 50 expressions and one changing signal updates exactly one DOM node. This is a consequence of the runtime Proxy — each expression's dependencies are tracked automatically at the property-access level.

**Why it matters:** Performance intuitions from React don't apply. You don't need `useMemo`, `React.memo`, or `shouldComponentUpdate`. The framework's default granularity is already optimal. Over-optimizing is a waste of effort.

### 4. Flat Data Context — No Namespace Prefixes

Templates merge settings, state, and component instance into a single namespace. There is no `state.`, `props.`, or `this.` prefix. (Full explanation in `overview` — here's why it matters for how you read code.)

```
❌ React: props.name, state.count, context.theme — three namespaces
❌ Vue: this.name in Options API, or unref(name) in Composition API
✅ SUI: {name} — could be a setting, state signal, or method. Doesn't matter.
```

**What to notice:** You can move a value between settings and state without changing any template code. The template doesn't encode where data comes from — only what it's called.

**Why it matters:** In React, refactoring where state lives (prop → context → store) requires JSX changes. In SUI, the template is decoupled from the component's internal architecture. Static props, computed methods, and signals all occupy the same namespace and are referenced identically — `{viewBox}` and `{getTotal}` look the same in the template regardless of whether they're values or functions.

### 5. `{#async}` with Reactive Re-execution

Async blocks handle promises declaratively with automatic re-firing when signals change:

```html
{#async getResults searchTerm as results}
  {#each result in results}<li>{result}</li>{/each}
{loading}
  Searching...
{error as e}
  Failed: {e.message}
{/async}
```

```
❌ React: ~15 lines of useState/useEffect/try-catch + three conditional JSX branches
❌ Svelte: {#await} provides similar declarative syntax, but re-execution requires manual invalidation
✅ SUI: declarative block + automatic re-execution when signal dependencies change
```

**What to notice:** `searchTerm` is a signal. When it changes, the async block re-executes the promise automatically. Svelte's `{#await}` provides similar declarative loading/error states, but the reactive re-execution — changing a signal re-fires the promise without manual invalidation — is the specific differentiator.

**Why it matters:** The template declares *what* happens for each async state. The framework handles *when* to re-fetch. The reactive dependency is implicit rather than declared in a dependency array or manually triggered.

### 6. Quoted vs Unquoted Attributes — Bug Prevention at Syntax Level

```html
❌ <button disabled="{isLoading}">   <!-- renders disabled="false" — truthy in HTML! -->
✅ <button disabled={isLoading}>     <!-- removes attribute entirely when false -->
```

**What to notice:** Unquoted expressions on boolean attributes remove the entire attribute when falsy. Quoted expressions always render as strings. This distinction prevents a class of bug that agents and humans produce frequently in other frameworks where boolean attribute handling isn't syntax-level.

**Why it matters:** When generating HTML with dynamic boolean attributes, always use the unquoted form. The framework handles the semantics correctly — no need for conditional attribute rendering logic.

### 7. Signal Mutation Helpers — No Get-Mutate-Set

Signals expose type-appropriate mutation methods directly — including collection operations with query semantics. There is no get-mutate-set round-trip:

```js
// ❌ Every other reactive framework (array update by id):
const arr = state.todos.get();
const index = arr.findIndex(t => t.id === id);
arr[index] = { ...arr[index], title: newTitle };
state.todos.set([...arr]);

// ✅ SUI — collection helpers on the signal itself:
state.todos.setProperty(id, 'title', newTitle);        // update one item's field by id
state.todos.replaceItem(id, { ...todo, completed: true }); // replace entire item by id
state.todos.setArrayProperty('completed', false);      // set a field on ALL items
state.todos.removeItem(id);                            // remove by id
state.todos.filter(t => !t.completed);                 // filter in place
state.todos.push({ id, title, completed: false });     // append
state.todos.getItem(id);                               // query by id
```

**What to notice:** Array signals aren't just reactive wrappers — they're reactive data stores with query semantics. `setProperty(id, field, value)` finds an item by id and updates one field. `setArrayProperty` sets a field across every item. `filter()` mutates in place. These are collection operations, not array manipulation.

**Why it matters:** The TodoMVC example implements all CRUD operations without a single get-mutate-set cycle. Compare the SUI version to any other framework's TodoMVC — the state mutation code is dramatically shorter because the signal API matches the intent directly. This is one of the features agents consistently find most natural when reviewing SUI code.

### 8. Zero-Arg Auto-Invocation

Functions with no required arguments auto-invoke when they're the terminal token:

```html
{isActive}       <!-- if isActive is a no-arg function, it's called automatically -->
{getFullName}    <!-- called, returns the value — no () needed -->
```

**What to notice:** The template doesn't distinguish between a value and a zero-arg function. You can refactor from a static prop to a computed method (or vice versa) without changing the template. Same philosophy as the flat data context — the template describes *what* it wants, not *how* to get it.

---

## Quick Reference

| You assume (from React/Svelte/Vue) | SUI actually does |
|-------------------------------------|-------------------|
| There's a compile step / build plugin | Runtime-only. Proxy-based expression evaluation. No transpiler. |
| Templates compile to render functions | Templates are strings parsed to a flat AST at runtime |
| One expression syntax (JS or framework-specific) | Dual syntax: Lisp-style and JS-style, freely mixed |
| Re-renders are component-scoped | Re-renders are per-expression. No virtual DOM. |
| State access uses namespaces (`state.x`, `props.x`) | Flat data context. Just `{x}`. |
| Async state requires imperative management | `{#async}` block with declarative loading/error states |
| Boolean attributes need conditional rendering | Unquoted `attr={expr}` removes attribute when falsy |
| State mutation requires get-mutate-set | Signals have type-aware helpers: `.push()`, `.toggle()`, `.increment()` |
| Functions need `()` to be called | Zero-arg functions auto-invoke in templates |

---

## Related Skills

| Skill | Load when... |
|-------|-------------|
| `overview` | You need full framework orientation, not just the novel parts |
| `mental-model` | You need deep architectural understanding — rendering pipeline, reactivity chain, AST |
| `component-templating` | You're writing templates and need the complete syntax reference |
| `component-authoring` | You're building a component and need the `defineComponent` API |

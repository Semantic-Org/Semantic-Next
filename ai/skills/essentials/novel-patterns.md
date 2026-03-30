---
title: What's Novel in Semantic UI
description: Design departures from mainstream frameworks that an agent would miss without being told. Read before reviewing examples or writing code — calibrates attention toward the non-obvious decisions.
keywords: [novel, departures, design, lisp, flat context, expressions, natural language, signals, async, template language, what to notice]
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

These are ordered by how much they'd surprise you. The first few are things no other framework does. The later ones are things other frameworks do differently.

### 1. Dual Expression Syntax — Lisp and JS in the Same Expression

**No other template language does this.** Expressions support Lisp-style (space-separated) and JavaScript-style (parens and commas) simultaneously, including mixed forms:

```html
{titleCase concat firstName ' ' lastName}              <!-- pure Lisp -->
{items.filter(i => i.active).length}                    <!-- pure JS -->
{concat 'hi ' (isDog ? 'simon dog' : 'pookie cat')}    <!-- mixed -->
{formatDate date 'h:mm a' { timezone: timezone }}       <!-- Lisp with inline object -->
```

**What to notice:** Lisp-style reads like intent — "format this date like this." JS-style reads like mechanics — "call formatDate with these arguments." Authors pick whichever is natural for the specific expression. The framework doesn't impose a paradigm.

**Why it matters:** Lisp-style expressions chain right-to-left without nesting parentheses. `{titleCase concat firstName ' ' lastName}` is zero parens. The JS equivalent `{titleCase(concat(firstName, ' ', lastName))}` is three nested pairs plus commas. For both humans and agents, the Lisp style has fewer tokens carrying zero information.

### 2. Flat Data Context — No Namespace Prefixes

Templates merge settings, state, and component instance methods into a single namespace. There is no `state.`, `props.`, `settings.`, or `this.` prefix:

```html
{name}              <!-- could be a setting, state signal, or method — doesn't matter -->
{count}             <!-- same identifier whether it's state or a computed method -->
{formatFullName}    <!-- method from createComponent, called directly -->
```

**What to notice:** You can move a value between settings and state without changing any template code. The template doesn't encode where data comes from — only what it's called. This is a deliberate erasure of provenance.

**Why it matters:** In React, refactoring where state lives (prop → context → store) requires template/JSX changes. In SUI, the template is decoupled from the component's internal architecture. This reduces coupling in a way that's invisible until you try to refactor.

### 3. `{#async}` with Reactive Re-execution

Async blocks handle promises declaratively with automatic re-firing when signals change:

```html
{#async getResults searchTerm as results}
  {#each result in results}
    <li>{result}</li>
  {/each}
{loading}
  Searching...
{error as e}
  Failed: {e.message}
{/async}
```

**What to notice:** `searchTerm` is a signal. When it changes, the async block re-executes the promise automatically. The loading/error/success states are template-level constructs, not imperative state management.

**Why it matters:** The React equivalent is ~15 lines — `useState` for loading, `useEffect` for the fetch, try/catch, three conditional renders, a dependency array. SUI collapses this into a declarative block where the reactive dependency is implicit.

### 4. Quoted vs Unquoted Attributes — Bug Prevention at the Syntax Level

```html
<button disabled={isLoading}>     <!-- unquoted: removes attribute when false -->
<button disabled="{isLoading}">   <!-- quoted: renders disabled="false" (truthy in HTML!) -->
```

**What to notice:** This is a class of bug that agents and humans make constantly in other frameworks. SUI handles it at the syntax level — unquoted expressions on boolean attributes remove the entire attribute when falsy. Quoted expressions always render as strings.

### 5. Signal Auto-Unwrapping via Proxy

Signals resolve automatically in templates — including at every level of a deep path:

```html
{user.address.city}    <!-- unwraps signals at user, address, AND city -->
```

**What to notice:** This isn't just convenience. The Proxy-based unwrapping works for *any* expression because it operates at the language level, not the syntax level. An arbitrary JS expression like `{users.filter(u => u.active).length}` resolves signals at every property access automatically.

### 6. Zero-Arg Auto-Invocation

Functions with no required arguments auto-invoke when they're the terminal token in an expression:

```html
{isActive}          <!-- if isActive is a function with no required args, it's called -->
{getFullName}       <!-- same — called automatically, returns the value -->
```

**What to notice:** This means the template doesn't distinguish between a value and a zero-arg function. You can refactor from a static prop to a computed method (or vice versa) without changing the template. Same philosophy as the flat data context — the template describes *what* it wants, not *how* to get it.

### 7. `createComponent` Props as Flat Data

Static values returned from `createComponent` are just props in the data context — no method needed:

```js
const createComponent = ({ settings }) => ({
  viewBox: '-50 -50 100 100',                    // static prop
  majorMarkers: [0, 5, 10, 15, 20, 25, 30],     // static array
  total: settings.price * settings.quantity,      // computed-once value
  getTotal() { return settings.price * settings.quantity; }, // reactive method
});
```

**What to notice:** Props and methods coexist in the same return object and the same template namespace. The template uses `{viewBox}` and `{getTotal}` identically. The distinction between a value and a computation is an implementation detail the template doesn't see.

---

## What's Coming

Four template language enhancements are scoped and ready to implement. When you encounter patterns that feel verbose, these are the planned solutions:

| Feature | Syntax | What it replaces |
|---------|--------|-----------------|
| **Match blocks** | `{#match status}{is 'loading'}...{/match}` | Verbose if/else chains that repeat the same variable |
| **Content projection** | `{>card}content{/card}` with `{>content}` inside | Inverted snippets, duplicated wrapper DOM |
| **Let bindings** | `{#let total = price * qty}...{/let}` | Repeated expressions in loops, trivial one-liner methods |
| **Spread syntax** | `{>card ...friend}` | Manual property-by-property data passing to subtemplates |

---

## Related Skills

| Skill | Load when... |
|-------|-------------|
| `overview` | You need full framework orientation, not just the novel parts |
| `mental-model` | You need deep architectural understanding — rendering pipeline, reactivity chain, AST |
| `component-templating` | You're writing templates and need the complete syntax reference |
| `component-authoring` | You're building a component and need the `defineComponent` API |


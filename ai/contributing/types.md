---
title: Type Declarations Guide
description: How types work in Semantic UI — hand-authored .d.ts files that ship to consumers, kept separate from JS source. Covers the mirror structure, cross-package imports, TypeScript patterns, and where to draw the line.
keywords: [types, typescript, d.ts, declaration files, type definitions, JSDoc, generics, type guards, IDE support]
audience: contributing
skill: types
type: skill
---

# Type Declarations Guide

> **Skill:** `sui:types`
> **Purpose:** How to author and maintain `.d.ts` type declaration files for Semantic UI packages

---

## The Philosophy

**Golden rule: Types are a service to consumers, not a development methodology.**

This is a JavaScript codebase. The source files in `packages/*/src/` are plain JS with no type annotations. Types exist because downstream TypeScript users expect them — they power autocomplete, parameter hints, and error checking in editors. They are a maintenance obligation, not a design tool.

### Why the framework resists typing

The core pattern innovation in Semantic UI is destructuring. Every callback — `createComponent`, `events`, `onCreated`, `onRendered`, `createBehavior`, mutation handlers — receives the same parameter bag, and you destructure what you need:

```js
// Components
createComponent: ({ self, state, settings, $ }) => ({
  increment() { state.counter.increment(); },
})

// Behaviors
createBehavior: ({ $, el, $el, self, settings }) => ({
  show() { /* ... */ },
})

// Events
events: {
  'click .btn'({ self, state }) { self.doSomething(); },
}
```

This pattern is fundamentally at odds with static typing — and intentionally so. The boundaries between settings, state, and component instance are soft because the framework treats them as fluid. A value can move between categories without changing the template that consumes it. That fluidity is the design, not an oversight.

Specifically:

1. **`self` is circular.** `createComponent` receives `self` as a parameter and also *returns* it. TypeScript can't express "this function receives its own return value as an input."
2. **The bag's shape is user-defined.** `state` comes from `defaultState`, `settings` from `defaultSettings`, `self` from `createComponent`'s return value. The types of all three depend on what the user passes to `defineComponent` — and they all merge into the same parameter object.
3. **The flat data context.** Templates merge state, settings, and component instance into one namespace. `{name}` could be a setting, a state Signal (auto-unwrapped), or a component method. This runtime resolution has no static equivalent.
4. **String-based dispatch.** Behaviors support `$('.el').tooltip('show')` — method names as strings at runtime.

The `CallParams<TState, TSettings, TComponentInstance, TProperties>` interface attempts to type the parameter bag, but every generic defaults to `Record<string, any>`. Full inference would require the user to manually declare the type of their own return value — defeating the ergonomic point of destructuring.

The destructuring pattern is *why this framework is pleasant to use*. It's also why full type coverage is structurally impossible. That's not a gap to close — it's the tradeoff. Where TypeScript can express something useful (Signal methods, utility function signatures, type guards), write types. Where the framework's dynamism outpaces the type system, `any`, `Record<string, any>`, and `// todo` are honest answers.

---

## Architecture

Types live in hand-authored `.d.ts` files inside `types/` directories, completely separate from the JS source.

```
packages/reactivity/
  src/
    index.js          ← JS source (no type annotations)
    signal.js
    reaction.js
    dependency.js
    scheduler.js
  types/
    index.d.ts        ← hand-authored types (ships to consumers)
    signal.d.ts
    reaction.d.ts
    dependency.d.ts
    scheduler.d.ts
```

This is not auto-generated. Running `tsc --declaration` on untyped JS would produce useless `any`-heavy stubs. The `.d.ts` files are written by hand to express the actual API contract — including generics, overloads, conditional types, and type guards that can't be inferred from the source.

### Why not JSDoc in source?

- **Clutter.** Type annotations in JS would double the visual weight of every function without helping contributors who read the source.
- **Two audiences, two files.** Contributors read `src/`. Consumers read what their editor extracts from `types/`. Keeping them separate serves both without compromise.
- **TypeScript features.** JSDoc can approximate generics and overloads, but the syntax is ugly and limited. `.d.ts` files give you real TypeScript.

### Why not TypeScript source?

The framework is JavaScript. It runs without a compile step. The build pipeline (esbuild) bundles JS — it doesn't transpile TypeScript. Adopting `.ts` source would add a compilation dependency to every contributor's workflow for a benefit that only matters to downstream TypeScript consumers.

---

## The Mirror Structure

Every exported module in `src/` has a corresponding `.d.ts` in `types/`. The `types/index.d.ts` re-exports from the per-module files, mirroring `src/index.js`.

```javascript
// src/index.js
export { Dependency } from './dependency.js';
export { Reaction } from './reaction.js';
export { Signal } from './signal.js';
```

```typescript
// types/index.d.ts
export { Dependency } from './dependency';
export { Reaction } from './reaction';
export { Signal, SignalOptions } from './signal';
```

Note that `types/index.d.ts` can also export interfaces and type aliases that don't exist in the JS source (like `SignalOptions`). These are types-only constructs that help consumers but have no runtime equivalent.

---

## Package.json Wiring

Every package declares its types in two places:

```json
{
  "types": "types/index.d.ts",
  "exports": {
    ".": {
      "types": "./types/index.d.ts",
      "import": "./src/index.js"
    }
  },
  "files": ["src", "types", "dist"]
}
```

The `"types"` top-level field is the legacy resolution path. The `exports["."].types` field is the modern conditional export. Both must point to `types/index.d.ts`. The `"files"` array must include `"types"` so the directory ships with the package.

---

## Cross-Package Type Imports

`.d.ts` files import types from sibling packages using the published package name, not relative paths:

```typescript
// packages/component/types/web-component.d.ts
import type { Query } from '@semantic-ui/query';
import type { Signal } from '@semantic-ui/reactivity';
import type { Template } from '@semantic-ui/templating';
import type { LitElement, PropertyDeclaration, PropertyValues } from 'lit';
```

Use `import type` (not `import`) — these are type-only imports that don't generate runtime code. This matters because `.d.ts` files are declarations, not executable modules.

### Dependency direction

Types follow the same dependency graph as the packages themselves:

```
@semantic-ui/utils
       ↓
@semantic-ui/reactivity     @semantic-ui/query
       ↓                          ↓
       └────── @semantic-ui/templating ──┐
                      ↓                   ↓
       @semantic-ui/renderer    @semantic-ui/component
                                         ↓
                              @semantic-ui/tailwind
```

Don't create circular type imports. If `reactivity` types need something from `component`, that's a design problem.

---

## TypeScript Patterns in Use

The `.d.ts` files use several TypeScript features that wouldn't be possible with JSDoc annotations.

### Generics

```typescript
// types/signal.d.ts
export class Signal<T> {
  constructor(initialValue: T, options?: SignalOptions<T>);
  get(): T;
  set(newValue: T): void;
  derive<U>(computeFn: (value: T) => U): Signal<U>;
  static computed<T>(computeFn: () => T): Signal<T>;
}
```

### `this` parameter typing

Signal has methods like `push`, `toggle`, `increment` that only make sense on certain value types. TypeScript's `this` parameter constrains when they're available:

```typescript
// Only callable on Signal<boolean>
toggle(this: Signal<boolean | null | undefined>): void;

// Only callable on Signal<SomeArray>
push<U extends any[]>(this: Signal<U>, ...items: U[number][]): void;

// Only callable on Signal<number>
increment(this: Signal<number | null | undefined>, amount?: number): void;
```

This gives IDE users errors if they call `toggle()` on a `Signal<string>` — without any runtime enforcement.

### Function overloads

When a function's return type depends on its arguments:

```typescript
// types/arrays.d.ts
export function last<T>(array: T[]): T | undefined;
export function last<T>(array: T[], number: number): T[];
```

One argument returns a single element. Two arguments returns an array. TypeScript can express this; JSDoc can't do it cleanly.

### Type predicates (type guards)

```typescript
// types/types.d.ts
export function isObject(x: unknown): x is Record<string, any>;
export function isString(x: unknown): x is string;
export function isDOM(element: unknown): element is Element | Document | Window | DocumentFragment;
```

The `x is Type` return annotation tells TypeScript to narrow the type after a check — `if (isString(x)) { x.toUpperCase() }` works without a cast.

### Conditional types in value setters

```typescript
set value(
  newValue: T extends null | undefined ? any
    : T extends Array<any> ? Array<Partial<T[number]> & Record<string, any>>
    : T extends object ? Partial<T> & Record<string, any>
    : T,
);
```

This allows partial object updates on object signals while keeping primitive signals strict.

### Generic interfaces with defaults

```typescript
export interface CallParams<
  TState extends Record<string, any> = Record<string, any>,
  TSettings extends Record<string, any> = Record<string, any>,
  TComponentInstance extends Record<string, any> = Record<string, any>,
  TProperties extends Record<string, any> = Record<string, any>,
> { ... }
```

Default type parameters mean consumers can use `CallParams` without specifying generics and still get useful `Record<string, any>` types throughout.

---

## `@see` Links and Documentation

Public-facing type declarations include `@see` links to the documentation site:

```typescript
/**
 * A Signal represents a reactive value that automatically triggers updates
 * when modified.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity/signal Signal Documentation}
 */
export class Signal<T> {
  /**
   * Gets the current value, establishing a reactive dependency.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/signal#value value}
   */
  get value(): T;
```

These links appear in editor hover tooltips and are the primary way TypeScript users discover the full documentation. Add them to classes, interfaces, and public methods. Skip them for internal types.

### Deriving the URL

The `@see` URL corresponds to the Astro page path in `docs/`. Derive it from the file location:

```
docs/src/pages/docs/api/reactivity/signal.mdx
→ https://next.semantic-ui.com/docs/api/reactivity/signal

docs/src/pages/docs/guides/components/lifecycle.mdx
→ https://next.semantic-ui.com/docs/guides/components/lifecycle
```

For method-level anchors, use the lowercase method name as the fragment: `#get`, `#set`, `#subscribe`.

---

## `@internal` Tags

Lower-level types that aren't part of the public API use `@internal`:

```typescript
/**
 * Tracks dependencies for reactive computations.
 * @internal This class is primarily used internally by the reactivity system.
 */
export class Dependency { ... }
```

This signals to consumers (and their editors) that the API may change without notice.

---

## When to Update Types

Types are a maintenance task completed after significant code changes. When you add, rename, or change the signature of a public method in a package's `src/`, update the corresponding `.d.ts` file in the same PR.

**Must update types:**
- New public method or class
- Changed method signature (parameters, return type)
- Renamed export
- New package export in `src/index.js`

**Skip types:**
- Internal refactoring that doesn't change the public API
- Bug fixes that don't alter signatures
- Changes to private methods or local variables

---

## Where Types Can't Help

Some parts of the framework are fundamentally dynamic. Don't fight the type system to cover them.

**The flat data context.** Templates merge `state`, `settings`, and the `createComponent` return value into a single namespace. `{count}` in a template could be state, a setting, or a component method. This merge happens at runtime and can't be statically typed in the template string.

**`defineComponent` return type.** The function returns different things depending on whether `tagName` is provided (a registered custom element class vs. a template instance). The component's shape depends entirely on what the user passes in `createComponent`, `defaultState`, and `defaultSettings`. The current type signature does its best with generics, but the return type includes `any`-adjacent constructs because full inference isn't possible.

**Spec-generated attributes.** The spec system dynamically generates observed attributes, CSS classes, and settings from a JSON spec. These can't be statically typed because they're data-driven.

**Template expressions.** Template strings like `{formatDate date 'h:mm a'}` are parsed at runtime. The type system can't check whether `formatDate` exists in scope or whether `date` is the right type.

In these cases, `Record<string, any>`, `any`, or `// todo` are the correct types. They're honest about what TypeScript can and can't verify.

---

## Quick Reference

### New module checklist

1. Create `types/module-name.d.ts` matching your `src/module-name.js`
2. Export from `types/index.d.ts`
3. Add `@see` links to public classes and methods
4. Use `@internal` for non-public APIs

### File structure

```
packages/your-package/
  src/index.js            ← exports from source modules
  types/index.d.ts        ← re-exports from type modules
  types/your-module.d.ts  ← hand-authored declarations
  package.json            ← "types": "types/index.d.ts"
```

### Common patterns

| Pattern | When to use |
|---------|-------------|
| `<T>` generics | Classes/functions that work with user-provided types |
| `this: Signal<U>` | Methods only valid on certain Signal value types |
| Function overloads | Return type depends on arguments |
| `x is Type` | Type guard functions (`isString`, `isDOM`, etc.) |
| `Record<string, any>` | Dynamic objects whose shape can't be known statically |
| `any` / `// todo` | Genuinely untypeable runtime behavior |

### What goes where

| | JS source (`src/`) | Type declarations (`types/`) |
|--|--|--|
| Type annotations | No | Yes |
| JSDoc comments | No | Yes |
| `@see` doc links | No | Yes (public APIs) |
| Runtime code | Yes | No |
| Interfaces / type aliases | No | Yes |

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Repo Guide** | `/sui:repo-guide` | Understanding overall project structure |
| **Internals** | `/sui:internals` | Understanding package architecture |

# defineComponent self-typing: solution and findings

## Problem

`defineComponent` has a circular inference problem: the `createComponent` callback returns an object `M` of methods, and that same `M` needs to be available as `self` inside the callback so methods can call each other. TypeScript can't infer `M` from the return type when `M` also appears in the parameter type — the function body references `self: M` which depends on `M`, creating a cycle that causes `M` to fall back to its constraint.

## Solution

**Use `ThisType<M>` on the return type of `createComponent`.** Inside the returned object literal, `this` is typed as `M` (the full set of methods). Remove `self`/`tpl`/`component` from `createComponent`'s parameter type to break the circular inference. In events and lifecycle hooks, `self` remains typed because `M` is already inferred by that point.

### The type signature

```typescript
type FactoryParams<St, S> = Omit<CallParams<St, S>, 'self' | 'tpl' | 'component'>;

declare function defineComponent<
  M extends Record<string, any> = Record<string, any>,
  S extends Record<string, any> = Record<string, any>,
  St extends Record<string, any> = Record<string, any>,
>(options: {
  createComponent?: (params: FactoryParams<St, S>) => M & ThisType<M & FactoryParams<St, S>>;
  events?: Record<string, (this: M, params: EventCallParams<St, S, M>) => void>;
  onCreated?: (this: M, params: CallParams<St, S, M>) => void;
  // ... other lifecycle hooks with `this: M`
  defaultSettings?: S;
  defaultState?: St;
}): any;
```

### How it works

1. **TS infers `M` from the return expression** of the `createComponent` callback. Since `FactoryParams` doesn't contain `M`, there's no circularity.

2. **`ThisType<M & FactoryParams<St, S>>`** tells TS that `this` inside the returned object literal is `M` (all the methods) plus `FactoryParams` (settings, state, el, etc.).

3. **Events and lifecycle hooks** use `this: M` as a synthetic first parameter. Since `M` is already inferred from `createComponent`'s return, there's no circularity. The `params` argument in these hooks includes `self: M` / `tpl: M` / `component: M` for users who prefer destructuring.

4. **This matches the runtime behavior.** `Template.call()` already uses `func.apply(thisContext, args)` where `thisContext` is the component instance. So `this` in event handlers and lifecycle hooks IS the instance at runtime.

### What's typed where

| Location | `this` | `self` (param) | Settings/State |
|---|---|---|---|
| `createComponent` return object | Full `M` via `ThisType` | Not available (removed from params) | Via closure or `this.settings`/`this.state` |
| Event handlers | Full `M` via `this: M` | Full `M` via `params.self` | Via `params.settings`/`params.state` |
| Lifecycle hooks | Full `M` via `this: M` | Full `M` via `params.self` | Via `params.settings`/`params.state` |

## Key discoveries

### 1. The constraint on M matters enormously

`M extends Record<string, (...args: any[]) => any>` (strict) causes chained `this.method()` return types to fall back to `any`, because the constraint's value type `(...args: any[]) => any` returns `any`.

`M extends Record<string, any>` (loose) allows chained return types to resolve correctly. `this.a()` returns `number`, `this.b()` which returns `this.a()` ALSO returns `number`.

**Use the loose constraint.**

### 2. ThisType works with generic M

`ThisType<M>` works even when `M` is a generic type parameter, as long as `M` is inferred from the return type (not from parameter types). This is because `ThisType` is a compiler intrinsic that doesn't participate in normal type inference — it only affects the contextual type of `this` inside object literals.

### 3. Chained method return types work

With `M extends Record<string, any>` and `ThisType<M>`:
- `this.getCount()` returns `number` (direct call)
- `this.doubled()` which returns `this.getCount() * 2` also returns `number` (chained)
- Even double-chained calls resolve: `this.tripled()` returns `number`

This was not expected based on initial testing with the strict constraint.

### 4. M in the parameter type is the root cause of circularity

If `M` appears ANYWHERE in the callback parameter type (even behind `NoInfer<M>`), TypeScript cannot infer `M` from the return. It falls back to the constraint. The solution is to ensure `M` only appears in:
- The return type (for inference)
- `ThisType<M>` (for `this` typing)
- Other callbacks where `M` is already inferred (events, lifecycle)

## What doesn't change

- **Runtime behavior**: Zero changes. JavaScript is identical.
- **`self` in events/lifecycle**: Still available and typed via `params.self`.
- **All other CallParams properties**: settings, state, el, $, $$, etc. all remain in the callback parameter.

## What changes for users

In `createComponent`, users use `this` instead of `self`:

```typescript
// Before (self is untyped / loose)
createComponent({ self, settings }) {
  return {
    foo() { return 1; },
    bar() { self.foo(); },  // self is any
  };
}

// After (this is typed)
createComponent({ settings }) {
  return {
    foo() { return 1; },
    bar() { this.foo(); },  // this is fully typed
  };
}
```

In events and lifecycle hooks, both `this` and `self` work:

```typescript
events: {
  'click .item'({ self, settings }) {
    this.foo();  // typed via `this: M`
    self.foo();  // typed via params.self: M
  },
},
onCreated({ self }) {
  this.foo();  // typed
  self.foo();  // also typed
},
```

## Caveats

1. **Arrow functions in the returned object**: Arrow functions don't have their own `this`, so `this` won't work inside them. Users must use regular function syntax for methods that reference `this`. This is the same constraint Vue's Options API has.

2. **`self` is not available in `createComponent`**: The `self`, `tpl`, and `component` properties are removed from the factory callback's params to break circularity. Users who need self-reference must use `this`. In events and lifecycle hooks, `self` remains available and typed.

3. **Runtime `this` binding**: The runtime already binds `this` correctly via `Template.call()`, but users should be aware that `this` in `createComponent`'s returned object methods requires regular functions (not arrows) and correct runtime binding. Since SUI's Template.call already handles this, no user action is needed.

## Files

- `ai/workspace/tmp/lsp-self-type-experiments.ts` — Complete test suite (16 tests, all pass with tsc --strict)
- `ai/workspace/tmp/exp-thistype-solution.ts` — Full solution with 17 tests including negative control
- `ai/workspace/tmp/exp-thistype-chain-comprehensive.ts` — Chain depth tests
- `ai/workspace/tmp/exp-thistype-circular-check.ts` — Proves M in params causes circularity

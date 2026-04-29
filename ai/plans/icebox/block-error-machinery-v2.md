# Block Error Machinery v2

## Goal

Extend the v1 `defineBlock` error machinery (structured logs, hydrate-throw fallthrough, custom `error` hook) with two items deferred from the original native-renderer-blocks plan: evaluator resolution-trail capture and a public `report()` API for block authors to emit soft warnings the compiler can't catch.

Iceboxed because the agentic-debugging UX win is real but not high priority — v1's emitter is already useful, and the work pays off most when component-authoring agents are actively iterating against runtime failures.

## Why eventually

The v1 emitter outputs:

```
🔴 conditional  {#if user.profile.name}
  Cannot read properties of undefined (reading 'name')
  hook: render
  ▸ stack
```

Useful, but the agent debugging the failure still has to manually trace `user.profile` to discover where the chain broke. The v2 version captures the resolution trail during evaluation:

```
🔴 conditional  {#if user.profile.name}
  Cannot read properties of undefined (reading 'name')
  resolution:
    user         → { id: 42 }
    user.profile → undefined  ← failed here
  ▸ stack
```

Pairs with a public `report(field, expression, message, opts)` so blocks can emit yellow-severity warnings (non-iterable to `{#each}`, malformed AST shapes, etc.) through the same emitter pipeline:

```
🟡 each  {#each items}
  iterable: expected array, got object
  current value: { id: 42 }
  ▸ stack
```

## Design / Implementation

### Resolution trail — `packages/renderer/src/expression-evaluator.js`

`getDeepDataValue` (line 307) walks segments via `path.indexOf` / `path.substring`. On a return-undefined or throw path, capture `{ segment, resolved }` pairs into a small array attached to the thrown error or returned alongside the result.

Cost is paid only on the failure path. Hot path unchanged. Verify negligible overhead during scoping.

### `report()` API — `packages/renderer/src/engines/native/define-block.js`

Add to the author-facing 9-key bag:

```js
report(field, expression, message, { data, severity = 'warn' } = {})
```

Routes through the existing `reportBlockError` emitter (rename to a more general `emitBlockDiagnostic`). Severity controls the prefix glyph and grouping.

### Dedup

Per `(block, field, expression)` across re-renders so a broken signal doesn't spam the console. Track in a Set keyed by `${block}:${field}:${expression}`, cleared on scope dispose.

### Dev-only

Both gated on `isDevelopment`; tree-shake to ~0 bytes in prod.

## Dependencies

None hard. Sits on top of `define-block.js` v1 and `expression-evaluator.js` as-is.

## Status

`initial`. Iceboxed — promote when an actual debugging session demonstrates the gap, or when the agent pipeline produces components that fail in ways v1 doesn't help with.

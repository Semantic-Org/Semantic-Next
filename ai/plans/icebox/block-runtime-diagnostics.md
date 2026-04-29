# Block Runtime Diagnostics

## Goal

Add two diagnostic capabilities to the existing `defineBlock` error machinery: evaluator resolution-trail capture (showing where in an expression chain a value became undefined) and a public `report()` API for block authors to emit soft warnings the compiler can't catch. Both items were deferred from the original native-renderer-blocks plan.

Iceboxed because the agentic-debugging UX win is real but not high priority — the existing emitter is already useful, and these additions pay off most when component-authoring agents are actively iterating against runtime failures.

## Why eventually

The current emitter outputs:

```
🔴 conditional  {#if user.profile.name}
  Cannot read properties of undefined (reading 'name')
  hook: render
  ▸ stack
```

Useful, but the agent debugging the failure still has to manually trace `user.profile` to discover where the chain broke. The resolution-trail addition captures the path the evaluator walked:

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

## Tracing default + always-on breadcrumb

Two related items folded in from the native-renderer-blocks review actionables (15-16). They tighten the agent feedback loop around block runtime failures and pair naturally with the resolution-trail and `report()` API above.

### Tracing default-on in dev

The tracing flag in `@semantic-ui/reactivity/helpers.js` already supports the cheap-vs-expensive split — three modes (`off` → `context` → `stack`) controlled by `setTracing` and `setStackCapture`. The remaining work: default `setTracing(true)` on in development environments. The cheap path attaches `{ firstRun, value, ... }` context bags for naming; the expensive path adds `Error.captureStackTrace` per notify. Defaulting cheap-on gives agents and developers reaction-context names "for free" while keeping stack capture opt-in.

This is the concrete fix for PR #136's tachometer regression, where reaction-context construction was paying for `captureStackTrace` on every mutation. Land alone, verify with a fresh tachometer baseline before bundling with anything else — bisectability matters here.

Verification: run a tachometer pass with `setTracing(false)` vs `setTracing(true)` (both with `setStackCapture(false)`) on a 1000-item each-loop mutation burst. If V8 escape analysis doesn't eliminate the `{ ...defaultContext, ...additionalContext }` spread, lazy context construction (build only when read via getter on `this.context`) becomes the next refinement.

Note: technically a breaking change for tooling that called `setTracing(true)` expecting both modes. Document in changelog. Decide whether `packages/component/src/helpers.js`'s `setTracing` should turn both flags on for back-compat while reactivity's stays cheap-only.

### Always-on breadcrumb on first block throw

A one-line hint that fires on the first uncaught error per `(block, component)` pair, regardless of tracing flag state. Sits in `define-block.js` alongside the existing `reportBlockError` (which stays gated on `isTracing()`).

The breadcrumb's role: when an agent or developer sees a visibly broken region, the console hint points them to the next action — typically `Reaction.setTracing(true)` and reload to see the structured log. Without it, the broken region is silent and the next action isn't discoverable.

**Critical: the breadcrumb must NOT be gated by the cheap `isTracing()` flag.** It exists to fire in the zero-overhead path when nothing else does. Gating defeats its bridge role.

Dedup key: `${blockName}:${componentName}` where `componentName` is `element.localName` — the custom-element tag of the nearest enclosing component. Two sibling `<ui-list>` instances share the dedup; `<ui-list>` and `<ui-form>` each get their own. Avoid keying on instance ID, AST node ID, or rendered DOM ID — those over-fire at list scale or under-fire across instances. Cross-instance dedup is what makes the breadcrumb valuable inside a 1000-item `{#each}`.

Implementation: module-level `Set` in `define-block.js` keyed on the dedup string; `Set.add` returns false-on-existing, gating the emit. Cleared on hot-reload boundaries if needed (typically not — dev-only and reload re-creates the module).

## Dependencies

None hard. Sits on top of `define-block.js` and `expression-evaluator.js` as-is.

## Status

`initial`. Iceboxed — promote when an actual debugging session demonstrates the gap, or when the agent workflow produces components that fail in ways the current emitter doesn't help with.

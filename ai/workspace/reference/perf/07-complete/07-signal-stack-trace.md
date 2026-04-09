# Plan: Gate Stack Trace Capture Behind isDevelopment

## Status
**Partially in diff.** `signal.js` already has `isDevelopment` guards on `setContext`, `addContext`, and `setTrace`. Remaining: apply same pattern to `dependency.js:18-19` and `reaction.js:36-37`. Add `getSource()` hint in `scheduler.js`.

## Dependencies
None. Standalone change to `@semantic-ui/reactivity`.

## Problem
`Error.captureStackTrace` runs unconditionally in three locations:
- `dependency.js:18-19` — every Dependency construction
- `signal.js:73-74` — every Signal mutation (setter)
- `reaction.js:36-37` — Reaction context updates

Cost: ~5-10μs per call. For a page with 30 components (~240 Signals), that's ~1.2-2.4ms of initialization plus ongoing cost on every `bumpDataVersion` (2 calls per re-render).

No other framework captures stack traces unconditionally. Every surveyed implementation (Solid, Angular, Vue, Svelte, MobX, Jotai, Preact Signals, Legend State) gates behind a compile-time dev flag at minimum.

## Why Not Remove Entirely
Reactivity is notoriously hard to debug. `Reaction.getSource()` / `Scheduler.getSource()` (scheduler.js:37) answers "which Signal mutation caused this Reaction to fire" — the reactive equivalent of "which setState triggered this re-render." This is a real differentiator for a new framework.

The analysis reports dismissed the traces as uninteresting because they focused on the `dataVersion` bump path. But `dataVersion` only fires for the coarse path (external data context changes). For fine-grained reactivity — state Signals, custom Signals, settings changes — the trace shows the actual mutation call site. That's genuinely valuable and hard to get any other way.

## Solution
Guard `captureStackTrace` calls with `isDevelopment` at each call site. No per-instance state, no option threading — just an early exit.

### `packages/reactivity/src/dependency.js` (~line 17-19)
```js
import { isDevelopment } from '@semantic-ui/utils';

setContext(context = {}) {
  if (isDevelopment) {
    if (Error.captureStackTrace) {
      Error.captureStackTrace(context, this.setContext);
    } else {
      context.stack = new Error().stack;
    }
  }
  this.context = context;
}
```

### `packages/reactivity/src/signal.js` (~line 72-74)
```js
setTrace() {
  if (isDevelopment) {
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this.context, this.setTrace);
    } else {
      this.context.stack = new Error().stack;
    }
  }
}
```

### `packages/reactivity/src/reaction.js` (~line 35-37)
Same pattern — wrap the existing `captureStackTrace` in `if (isDevelopment)`.

### `packages/reactivity/src/scheduler.js` (~line 37)
`getSource()` — if traces aren't available, log a hint:
```js
static getSource() {
  // ... existing logic ...
  if (!stack && !isDevelopment) {
    console.warn('[SUI] Reaction.getSource() requires development mode for stack traces');
  }
}
```

## What This Preserves
- **Dev mode:** Full stack traces, zero opt-in friction. `Reaction.getSource()` works exactly as today.
- **Prod mode:** Zero `captureStackTrace` cost. `getSource()` returns no stack but logs a hint.

## What This Changes
- `@semantic-ui/reactivity` gains an import of `isDevelopment` from `@semantic-ui/utils`. Check if this dependency already exists or if it introduces a new package edge.
- `isDevelopment` is evaluated once at module load and cached as a constant — the branch cost per call site is a single boolean check.

## Estimated Savings (production)
- ~1.2-2.4ms per page load (Signal construction)
- ~1.0-2.0ms during heavy interaction (100 bumpDataVersion calls × 2 traces each)

## Complexity
Category 2. Three files, same mechanical transformation (wrap `captureStackTrace` in `if (isDevelopment)`). No option threading, no per-instance state. Tests for `Reaction.getSource()` need `isDevelopment` to be true in the test environment (which it should be since tests run in `NODE_ENV=test`, which `isDevelopment` already checks).

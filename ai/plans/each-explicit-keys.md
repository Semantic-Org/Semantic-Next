# Explicit Each Keys

## Goal

Add explicit `key=expression` syntax to `{#each}` so authors can override the implicit key chain (`_id || id || key || hash || _hash || value || index`) when their data shape causes collisions or ambiguity. Day-1 defensibility — users whose item objects don't match the heuristic shouldn't need data-shape surgery to get correct keyed reconciliation and hydration.

## Why now

Heuristic keying covers the common case but is fragile under:

- Items that have an `id` field by coincidence but it isn't stable (e.g., a serial generated at render time).
- Items whose natural key is a compound or computed expression.
- Hydration adoption when server and client disagree on which heuristic field "wins" because two candidate keys are present.

Without explicit keys, the user's only escape hatch is mutating their data shape to satisfy the heuristic. Framework-grade ergonomics requires the syntax.

## Design / Implementation

### Compiler — `packages/compiler/src/template-compiler.js`

`parseIteratorString` already handles `each...as` and `each...in`. Extend to recognize a trailing `key=expression`:

```
{#each user in users key=user.slug}
{#each users as user, i key=user.id}
{#each items as item key=(item.kind + ':' + item.id)}
```

Parse into `node.keyExpression` (string in the same evaluator dialect as other expressions). Heuristic chain remains the fallback when no explicit key is present.

### Server renderer — `packages/renderer/src/engines/native/server.js`

`renderEach` calls `getItemID` per item. When `node.keyExpression` is present, evaluate it against the per-item context (`itemEvaluator`) and use the result as the marker key. Heuristic remains the fallback.

### Client renderer — `packages/renderer/src/engines/native/blocks/each.js`

`getItemID` mirrors the server: if `node.keyExpression` is present, evaluate it against the item context. Otherwise heuristic. Shared evaluator dialect means client and server agree by construction.

### Hydration

`adoptServerItems` already uses `getItemID` to match server markers against client items. Works without further changes once both sides evaluate the same explicit key.

### Compatibility

Heuristic chain is unchanged when `key=` is absent. No existing template breaks.

### Tests

- Compiler: parse variants of `key=` (single token, dotted path, parenthesized expression).
- Server: per-item markers reflect explicit key.
- Client adoption: items match by explicit key.
- Reconcile: keyed move / insert / remove with explicit key.
- Mixed scenario: some templates use heuristic, some use explicit, no cross-contamination.

## Open Questions

- **AST field name.** `node.keyExpression` vs `node.key` (currently empty/unused). Lean `keyExpression` to leave `key` for any future literal-key shape and to be unambiguous about the value being an expression string.
- **Diagnostics.** If `node.keyExpression` evaluates to undefined or throws, what's the fallback? Lean: fall through to heuristic with a dev warning. Production-correctness matters more than strict failure.
- **Lisp-style vs JS-style expressions.** Both should work via the existing evaluator. v1 supports both — no compiler-level restriction. Confirm during scoping.

## Dependencies

None. Builds on the per-item marker plumbing already shipped (`sui-item:v1:KEY` on the server, `adoptServerItems` on the client).

## Status

`initial` — implementation surface is concrete, three small open questions. ~15-min pair to resolve them upgrades this to `scoped`.

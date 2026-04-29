# WASM Renderer

## Goal

Replace the JS server-side renderer's hot path with a Rust/WASM implementation. Same interface (`renderToString`), same `buildHTMLString` contract, different execution environment. The win is per-render speed at scale — a docs page that renders 100+ spec-driven components, each with dozens of expressions, hits a tight loop of string interpolation that WASM outperforms JS on.

## Why WASM

- Server-side rendering has no Signals, no Reactions, no re-evaluation. Every expression resolves exactly once.
- The data context at render time is a flat map of resolved values.
- The clean boundary between JS and WASM: AST + flat string values in, HTML string out. No round-trips.

## Design / Implementation

### What WASM receives

- AST (JSON, compiled once per component definition, reused across instances).
- Flat value map (`Map<expressionId, serializedValue>`, produced per instance by JS expression evaluator).
- CSS string (per component definition).
- Component tag name and attributes.

### What WASM produces

Complete HTML string including DSD wrapper, hydration markers, and evaluated content.

### What stays in JS

- Expression evaluation (data context has JS functions, helpers, Signals).
- AST compilation (`TemplateCompiler` — though this could also move to Rust later).
- Hydration (client-side DOM binding).

### Boundary protocol

```
JS side (per component instance):
  evaluateAllExpressions(ast, dataContext) → Map<id, string>

WASM side (hot path):
  renderToString(ast, flatValues, css) → HTML string with DSD
```

### Build integration

- `wasm-pack build --target web` produces an ESM-compatible WASM module.
- `engines/native/server.js` imports the WASM module and falls back to the JS implementation when WASM is unavailable.
- Same interface either way: `renderToString(ast, flatValues, css) → string`.

### File layout

```
packages/renderer/src/engines/rust/
  src/                         # Rust source
  Cargo.toml
  build.js                     # wasm-pack integration
  renderer.wasm                # compiled output
  index.js                     # thin JS wrapper, same renderToString interface
```

### Validation

- Rust implementation must produce identical HTML to the JS reference for the same AST + data.
- Benchmark against docs-site workload (100+ components per page) to confirm the win is real, not theoretical.

## Open Questions

1. **Streaming.** Can the server render stream HTML chunks as components resolve? DSD requires the `<template>` wrapper to be emitted after all child content, which conflicts with streaming. May need a two-pass approach.

2. **WASM bundle size.** `wasm-pack` output for string manipulation should be small (tens of KB), but needs measurement before committing. If the module adds significant weight to deployments, the perf win may not justify the cost.

3. **AST caching in WASM.** The same component's AST is reused across instances. Rust could parse and cache the AST structure once in WASM memory, then accept only flat values per render. Requires a cache lifecycle that survives across requests.

## Dependencies

- JS server renderer — shipped, used as the reference implementation.
- Engine registry — shipped, registers WASM engine the same way native and lit register.

## Status

`initial` — direction is clear; three open investigations (bundle size, streaming, AST caching) gate scoping. Iceboxed because the JS server renderer is fast enough at current scale and the work doesn't block the agent workflow. Promote when docs-site render perf or downstream consumers demand it, or when a benchmark on a real workload makes the win concrete.

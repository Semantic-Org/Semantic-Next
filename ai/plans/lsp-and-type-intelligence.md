# LSP and Type Intelligence for Semantic UI

## Goal

Provide developer intelligence -- completions, hover, diagnostics, go-to-definition -- for both template `.html` files and component `.js` files. Covers first-party primitives (spec-driven) and third-party user components (no spec) equally. Serves both editor extensions (VS Code, Neovim, etc.) and the browser-based documentation playground.

## Context

### The typing gap

Every SUI component callback (`createComponent`, events, lifecycle) destructures `CallParams` with `self`, `settings`, and `state`. The `.d.ts` files have generics but TS can't infer them. Result: zero completions for `self.`, `settings.`, `state.` in every component file today.

### The template gap

Template `.html` files have no language intelligence at all. The template language is custom with dual Lisp/JS expression syntax, block structures, subtemplates, slots, and a flat data context.

### Most components have no spec

Only first-party primitives (~14 today, ~80 target) use `componentSpec`. The majority use case -- user components like todo-list, emoji-reactions, application components -- use only `defaultSettings`, `defaultState`, `createComponent`, and `events`. The LSP must serve both audiences.

## Design

### Three-tier JS intelligence -- VALIDATED

**Tier 1: Pure `.d.ts` changes (tsc + all IDEs, no tooling)**

Rework `defineComponent` generics. `M` inferred from `createComponent` return. `S` from `defaultSettings`. `St` from `defaultState`. Uses `ThisType<M>` on the return and `FactoryParams` (self omitted from M, added back as `Record<string, any>`) to break circularity.

Results (all validated with `tsc --strict`, prototype at `ai/workspace/tmp/exp-thistype-both.ts`):

- `settings.*` -- fully typed everywhere
- `state.*` -- fully typed everywhere (wrapped in `Signal<T>`)
- `self.*` in events/lifecycle -- fully typed (M already inferred)
- `self.*` in createComponent -- untyped (`Record<string, any>`, available but no completions)
- `this.*` in createComponent -- fully typed via `ThisType<M>` (opt-in escape hatch)
- All other destructured params (`$`, `$$`, `el`, `dispatchEvent`, etc.) -- fully typed

| Tier | `self` in createComponent | `self` in events/lifecycle | Requires |
|---|---|---|---|
| `.d.ts` only | `Record<string, any>` | Fully typed M | Nothing -- tsc works |
| `.d.ts` + `this` convention | Fully typed via `this` | Fully typed (both) | Nothing -- tsc works |
| `.d.ts` + TS plugin | Fully typed via injected types | Fully typed | VS Code plugin |

**Tier 2: TS LanguageServiceHost plugin (IDE-only, bridges `self` in createComponent)**

For users who want fully typed `self` in createComponent without using `this`. Intercepts `getScriptSnapshot` to inject JSDoc annotations. Same pattern as `typescript-plugin-css-modules` and Angular TCBs.

Research at `ai/workspace/reference/typescript-plugin-research.md`.

### Architecture — Transport-Agnostic Core

The LSP is designed as a transport-agnostic `LanguageService` class consumed by multiple transports:

```
tools/lsp/
├── src/
│   ├── language-service.js        ← THE core: stateful, zero transport deps
│   │                                 owns documents, models, specs, position conversion
│   │                                 injected resolver + analyzer for I/O abstraction
│   ├── component-analyzer.js      ← pure: source text in → ComponentModel out (acorn-based)
│   ├── helper-registry.js         ← pure: static helper signatures
│   ├── spec-registry.js           ← pure: spec indexing (resolver-backed)
│   ├── server-helpers.js          ← pure: context detection, word extraction
│   │
│   ├── server.js                  ← Node transport: vscode-languageserver/node.js → LanguageService
│   ├── node.js                    ← Node service factory: createService(projectRoot) with fs resolver
│   ├── browser.js                 ← Browser service factory: createService(files) with in-memory resolver
│   ├── browser-client.js          ← Browser CM6 client: Worker + @codemirror/lsp-client + transport
│   └── worker.js                  ← Browser Worker: JSON-RPC over postMessage → LanguageService
│
├── editors/vscode/                ← VS Code extension (language client + TS plugin)
│   ├── src/extension.js
│   └── server/server.js           ← thin: imports from tools/lsp/src
```

**Key principle:** `language-service.js`, `component-analyzer.js`, `helper-registry.js`, `spec-registry.js`, and `server-helpers.js` have zero Node or browser dependencies. All I/O is through an injected `resolver` interface. The same analysis code runs in Node (editor extensions), in a Web Worker (playground), or compiled to WASM (future native binary).

### Playground Integration — VALIDATED

The documentation playground (`docs/src/components/CodePlayground/`) uses playground-elements (Google) which wraps CodeMirror 6. The LSP integrates via `@codemirror/lsp-client`:

```
CodePlayground                       Browser Worker
├── setFiles() ──────────────────► sui/setFiles (in-memory resolver)
│                                    │
CodePlaygroundFile                   LanguageService
├── .extensions={getExtensions}      ├── didOpen / didChange
│   └── client.plugin(filename)      ├── getCompletions(uri, pos)
│       └── @codemirror/lsp-client   ├── getHover(uri, pos)
│           └── JSON-RPC/postMessage ├── getDiagnostics(uri)
│                                    └── ComponentModel (from analyzer)
```

**Integration findings (validated in this session):**

- **Playground-elements `extensions` property** replaces (not accumulates) CM6 extensions via a dedicated Compartment. Safe to set reactively per file switch.
- **Language compartment** must be reconfigured imperatively via duck-typing playground-elements' internal compartment — the `extensions` property doesn't override language.
- **Syntax reconfiguration timing** requires `requestAnimationFrame` deferral — playground-elements' `setState()` on file switch overwrites synchronous compartment changes.
- **`no-completions` attribute** must be set on `<playground-file-editor>` when LSP completions are active, to prevent playground-elements' built-in `autocompletion()` from duplicating results. Two `autocompletion()` plugins on the same view = duplicate completion requests.
- **Vite `resolve.dedupe`** must include `@codemirror/state`, `@codemirror/view`, `@codemirror/language`, `@codemirror/autocomplete` — without this, multiple CM6 instances cause `instanceof` failures (`Unrecognized extension value`).
- **File URIs** are normalized by `browser-client.js` — consumers pass bare filenames (`component.html`), the client adds `file:///`.
- **Component model** is populated via a custom `sui/setFiles` notification — the playground sends all project files to the Worker on load, the Worker's in-memory resolver serves them to `LanguageService.getModel()`.
- **Helper filtering** — helpers (50+) are excluded from completions when no prefix is typed, to avoid flooding the list. They appear once the user types at least one character.
- **Worker performance** — imports: <1ms, initialize: ~5ms, first completion (including acorn parse): ~4ms, subsequent: <1ms.

### ComponentModel (shared core)

One analysis of a component file feeds both template and JS intelligence. Works for all components -- spec-driven primitives and spec-free user components.

```
ComponentModel {
  tagName?: string
  templatePath: string
  specPath?: string                 // only for primitives

  instance: [{ name, params }]     // from createComponent return
  state: [{ name, inferredType }]  // from defaultState
  settings: [{ name, type, allowedValues?, docs? }]  // from defaultSettings + spec
  optionAttributes?: Record<string, string>  // from spec (primitives only)
  subTemplates: Record<string, string>
  events: string[]
}
```

### SpecRegistry

Reads two build artifacts per primitive (both JSON-parseable, no JS execution):
- `*.component.js` -- structural: attributes, allowed values, option attributes, property types
- `*.spec.json` -- semantic: descriptions, usage levels, example code, per-option descriptions

Only relevant for first-party primitives. Enriches HTML attribute completions and hover docs.

### Compiler changes (opt-in)

Two new params on `TemplateCompiler.compile()`:
- `includePositions: true` -- adds `start`/`end` to AST nodes
- `recoverable: true` -- collects errors instead of throwing, returns partial AST

Default path unchanged. AST stays terse.

## Phases (calibrated from historical actuals)

Historical data: completed plans came in 2-5x under estimate for mechanical work, ~1x for exploratory work.

### Phase 0 — Ship types + tmLanguage + playground integration (~1d) ✅ COMPLETE
- Ship `.d.ts` generic fixes for settings/state/self (validated, ready now)
- Extend `sui.tmlanguage.json` with missing syntax
- Immediate value, zero tooling

### Phase 0.5 — Template LSP + playground integration (~3d) ✅ COMPLETE
- `LanguageService` class: transport-agnostic, stateful, injected resolver
- `ComponentAnalyzer`: acorn-based JS parsing → ComponentModel (replaced TypeScript parser, 28MB → 2MB)
- `HelperRegistry` + `SpecRegistry`: pure data, resolver-backed
- Browser Worker entry point (`worker.js`): JSON-RPC over postMessage
- Browser client (`browser-client.js`): @codemirror/lsp-client + Worker transport
- Playground integration: reactive extensions, syntax highlighting, file sync
- Context-aware completions: expressions (with helper filtering), blocks, references, attributes, event bindings
- Hover for helpers, settings, state, instance methods with default values
- Diagnostics from template compiler (single-error-at-{0,0} — per-error positioned diagnostics pending `recoverable` mode in published compiler)
- Tag name completions from spec registry (`<ui-` → all registered component tags)
- Node server (`server.js`): vscode-languageserver/node.js transport
- VS Code extension scaffolding

### Phase 1 — JS intelligence + playground dogfooding (~4-6d)

The JS phase builds typed completions for `self.`, `settings.`, `state.` inside component JS files. **The playground is the primary integration testbed** — every feature is validated in-browser before shipping to editor extensions.

**Scope:**
- TS LanguageServiceHost plugin for typed `self` in createComponent (VS Code)
- Virtual type module generation per component
- Go-to-definition from `self.method()` to createComponent return
- Event DSL string validation

**Playground integration for Phase 1:**
- The `LanguageService` already serves JS files — extend `getCompletions` and `getHover` to handle JS contexts (inside `createComponent`, `events`, lifecycle callbacks)
- The `ComponentAnalyzer` already extracts the model — use it to provide `self.`, `settings.`, `state.` completions in JS expressions
- The browser Worker already receives all files via `sui/setFiles` — JS analysis is available without additional plumbing
- playground-elements' built-in TS completions are low quality (flat global dump) — the LSP should replace them for SUI component files via `no-completions` + LSP extensions, same pattern as template files
- Test on the playground first, then package for VS Code

**Dogfooding principle:** The playground integration validates the generalized LSP. If a feature doesn't work in the browser Worker, it won't work in a Rust/WASM target either. The playground enforces the abstraction — no Node APIs leak through because the Worker would crash.

### Phase 2 — Cross-file template intelligence (~4-6d)
- Template data context completions (settings + state + instance, flat)
- Scope chain (each/async/snippet variables)
- Go-to-definition (template -> JS)
- Hover for data context names + spec descriptions

### Phase 3 — Native binary + distribution (future)
- Rewrite core in Rust, compile to native binary (editor LSP) + WASM (browser Worker)
- Single codebase, two targets
- The JS `LanguageService` becomes the prototype that defines the spec for the Rust implementation
- The TDD is the spec — both implementations are generated from it

**Total: ~12-16d** (calibrated). Minimum viable slice (Phase 0 + 0.5): complete.

## Open Questions

- **Editor scope:** VS Code first. LSP is editor-agnostic. TS plugin is VS Code-specific but the LSP-based JS intelligence (Phase 1 playground path) works everywhere.
- **Vanilla renderer:** Doesn't affect LSP (compiler/AST level is renderer-agnostic).
- **Rust timeline:** Not blocking. JS implementation serves all current needs. Rust is a distribution optimization.

## Dependencies

None blocking. Parallel work. Benefits from more primitives existing (more specs to test against).

## Status

Phase 0 + 0.5 complete. Template intelligence working in playground with completions, hover, and diagnostics. Browser Worker transport validated. Package structure generalized at `tools/lsp/` with Node and browser entry points. Ready for Phase 1 (JS intelligence).

Full technical design at [lsp-and-type-intelligence-tdd.md](lsp-and-type-intelligence-tdd.md).

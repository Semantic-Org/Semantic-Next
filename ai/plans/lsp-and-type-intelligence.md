# LSP and Type Intelligence for Semantic UI

## Goal

Provide developer intelligence -- completions, hover, diagnostics, go-to-definition -- for both template `.html` files and component `.js` files. Covers first-party primitives (spec-driven) and third-party user components (no spec) equally.

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

### Architecture

```
VS Code Extension
+-- sui.tmlanguage.json              <- syntax highlighting (exists, extend)
+-- language-client                  <- standard LSP client for .html
+-- ts-plugin                        <- augments TS for self in createComponent
    +-- ComponentAnalyzer (shared)

Language Server (Node process, LSP protocol)
+-- ComponentAnalyzer                <- shared: parses .js + spec -> ComponentModel
+-- TemplateService                  <- completions, diagnostics, hover for .html
+-- SpecRegistry                     <- indexes *.component.js + *.spec.json
+-- HelperRegistry                   <- static map of built-in helper signatures
```

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

### Phase 0 -- Ship types + tmLanguage (~1d)
- Ship `.d.ts` generic fixes for settings/state/self (validated, ready now)
- Extend `sui.tmlanguage.json` with missing syntax
- Immediate value, zero tooling

### Phase 1 -- ComponentAnalyzer + TS plugin (~4-6d)
- ComponentAnalyzer: parse .js files -> ComponentModel (using TS compiler API)
- TS LanguageServiceHost plugin for typed `self` in createComponent
- This is the exploratory phase -- shared core that everything builds on

### Phase 2 -- Template LSP foundation (~2-3d)
- LSP scaffolding (vscode-languageserver)
- Compiler: add `includePositions` and `recoverable`
- Diagnostics from compiler
- SpecRegistry + HTML attribute/value/optionAttribute completions
- Helper completions with signatures
- Block completions and auto-close

### Phase 3 -- Cross-file template intelligence (~4-6d)
- Template data context completions (settings + state + instance, flat)
- Scope chain (each/async/snippet variables)
- Go-to-definition (template -> JS)
- Hover for data context names + spec descriptions

**Total: ~11-16d** (calibrated). Minimum viable slice (Phase 0): ~1d.

## Open Questions

- **Package location:** `tools/vscode-extension/` (dev tooling) is proposed.
- **Editor scope:** VS Code first. LSP is editor-agnostic but TS plugin is VS Code-specific.
- **Vanilla renderer:** Doesn't affect LSP (compiler/AST level is renderer-agnostic).

## Dependencies

None blocking. Parallel work. Benefits from more primitives existing (more specs to test against).

## Status

Initial scope. Type prototype validated -- `.d.ts` changes ready to ship. Full technical design at [lsp-and-type-intelligence-tdd.md](lsp-and-type-intelligence-tdd.md). Fresh-take evaluations at `ai/workspace/tmp/lsp-{challenge,reframe}-evaluation.md`. Type solver findings at `ai/workspace/tmp/lsp-self-type-findings.md`.

## Task: Evaluate the technical design for a Language Server and Type Intelligence system for Semantic UI

Read all source files listed below before answering. Evaluate the design independently — form your own assessment of feasibility, risks, and gaps.

### Architecture Overview

Semantic UI is a web component framework with a custom template language. Components are defined via `defineComponent()` which takes a configuration object with:

- `template` — an HTML string with custom expression syntax (`{expression}`, `{#if}`, `{#each}`, etc.)
- `createComponent` — a factory function that returns component instance methods
- `defaultSettings` — external reactive settings (like props)
- `defaultState` — internal reactive state (signals)
- `events` — event handlers using a string DSL (`'click .button'`, `'deep click menu-item'`)
- `componentSpec` — a JSON schema defining valid attributes, allowed values, types

Every callback destructures the same `CallParams` shape: `{ self, settings, state, $, $$, ... }`. `self` is the return value of `createComponent` — this creates a circular type reference that TypeScript cannot infer.

Templates are separate `.html` files with a custom expression language supporting both Lisp-style (`{formatDate date 'h:mm a'}`) and JavaScript-style (`{a + b * c}`) simultaneously. Expressions are evaluated at runtime via `new Function` + `with(Proxy)` which auto-unwraps reactive Signals.

The spec system provides structured metadata per component: attribute names, allowed values, property types, human-readable descriptions, usage levels (1-5 importance), example code, and semantic relationships between components.

### The Typing Gap

Today there are zero completions for `self.`, `settings.`, and `state.` in component JS files. The `.d.ts` files have generics (`TComponentInstance`, `TSettings`, `TState`) but TS can't infer them due to the `self` circularity.

Prototype testing confirmed:
- `settings` and `state` CAN be inferred through generics with a `.d.ts` change (validated with tsc --strict)
- `self` CANNOT be inferred — `NoInfer<T>`, `LooseMethods<M>` cycle-breakers all fail

Templates have no language intelligence at all — no completions, diagnostics, hover, or go-to-definition.

### Proposed Solution

A VS Code extension with three layers:
1. TextMate grammar for syntax highlighting
2. Language Server (LSP) for template `.html` file intelligence
3. TypeScript LanguageServiceHost plugin for `self` typing in `.js` files (IDE-only)

The TS plugin uses the `typescript-plugin-css-modules` pattern: intercepts `getScriptSnapshot` to inject JSDoc annotations into the virtual file TS sees, making `self` properly typed. This is the same approach used by Angular (Type Check Blocks) and Vue/Volar.

Settings and state ship as pure `.d.ts` generic changes — works in tsc and all IDEs.

### Concrete Problems

1. The `self` typing requires LanguageServiceHost interception which is IDE-only — `tsc` will never see the injected types. Developers who run `tsc` in CI will get different type checking than their IDE shows.
2. The template language has dual Lisp/JS expression syntax that no existing parser tooling handles — the LSP needs its own expression parser.
3. Cross-file analysis is required: a template `.html` file's completions depend on the paired `.js` file's settings, state, and createComponent return.
4. The compiler needs opt-in modifications (position tracking, error recovery) to serve the LSP.
5. The estimated scope is 20-30 days of pair programming across 4 phases.

### Questions — Evaluate Independently

**Question 1:** Is the LanguageServiceHost interception approach for `self` typing sound? What are the risks of IDE showing different types than tsc? Are there alternative approaches the design may have overlooked?

**Question 2:** Is the phasing correct? The plan puts template intelligence (Phases 1-2) before JS intelligence (Phase 3). Should JS intelligence come first since it affects a language developers already work in daily, versus templates which are a novel syntax?

**Question 3:** The design proposes reading both `.spec.js` (rich metadata) and `.component.js` (compiled runtime format) for the SpecRegistry. Is this the right approach, or should the LSP only read one? What are the maintenance risks of depending on the source spec format?

**Question 4:** The scope estimate of 20-30 days seems large for developer tooling on a framework that hasn't shipped 1.0 yet. Is this the right time to build an LSP? What's the minimum viable slice that would validate the approach?

**Question 5:** The template expression language supports arbitrary JavaScript via `new Function` + `with(Proxy)`. The design explicitly marks full expression type-checking as a non-goal. Is this the right boundary, or does it leave a gap that makes the LSP feel incomplete to users?

**Question 6:** Are there simpler alternatives to a full LSP that could provide 80% of the value? For example: just shipping the `.d.ts` generic fixes for settings/state, extending the tmLanguage for syntax highlighting, and generating a Custom Elements Manifest for generic web component tooling.

### Source Files to Read

- `ai/plans/lsp-and-type-intelligence.md` — the plan
- `ai/plans/lsp-and-type-intelligence-tdd.md` — the technical design document
- `ai/workspace/tmp/lsp-type-assertions.ts` — type prototype (settings/state work, self fails)
- `ai/workspace/tmp/lsp-type-noinfer.ts` — NoInfer attempt (also fails for self)
- `ai/workspace/reference/typescript-plugin-research.md` — research on TS plugin mechanisms
- `packages/compiler/src/template-compiler.js` — the template compiler
- `packages/compiler/src/string-scanner.js` — character-by-character scanner
- `packages/renderer/src/lit/renderer.js` — expression evaluator (lookupTokenValue, evaluateExpression)
- `packages/templating/src/template-helpers.js` — built-in helpers
- `packages/specs/src/spec-reader.js` — how specs become runtime format
- `packages/specs/src/helpers.js` — shared spec constants
- `packages/specs/src/variations/size.js` — example shared variation with per-option descriptions
- `packages/specs/src/states/disabled.js` — example shared state with options
- `src/primitives/button/specs/button.spec.js` — full source spec (rich metadata)
- `src/primitives/button/specs/button.component.js` — compiled spec (runtime format)
- `src/primitives/button/button.js` — canonical component
- `src/primitives/button/button.html` — canonical template
- `src/primitives/input/input.js` — component with state and events
- `src/primitives/input/input.html` — template with data context usage
- `src/primitives/menu/menu.js` — complex component with self-referential methods
- `packages/component/types/define-component.d.ts` — current type definitions with generics
- `packages/templating/types/template.d.ts` — CallParams interface

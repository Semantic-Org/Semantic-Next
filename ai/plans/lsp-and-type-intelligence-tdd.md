# LSP and Type Intelligence — Technical Design Document

## Overview

Developer intelligence for Semantic UI covering template `.html` files and component `.js` files. A VS Code extension containing three layers: a TextMate grammar for syntax highlighting, a Language Server (LSP) for template intelligence, and a TypeScript plugin for JS intelligence.

## Problem Statement

### JS: the self-referential typing gap

Every SUI component callback destructures `{ self, settings, state }` from `CallParams`. The `.d.ts` files have generics for all three (`TComponentInstance`, `TSettings`, `TState`), but TypeScript cannot infer them:

**`self`** — `createComponent` returns an object, and that object is passed back as `self` in the same function's parameters. This is recursive: TS needs the return type to type `self`, but needs `self`'s type to check the return. Confirmed by prototype testing: `NoInfer<T>`, `LooseMethods<M>` cycle-breakers, and generic constraint tricks all fail to resolve `self` to anything other than `Record<string, any>`.

**`settings`** — A Proxy over element properties. TS types it as `Record<string, any>`. **However**, prototype testing confirmed that TS CAN infer settings types when `defineComponent`'s generics thread `S` from `defaultSettings` through to `CallParams<_, S, _>`. This works today with a `.d.ts` change — no tooling needed.

**`state`** — Same pattern as settings. Prototype confirmed TS CAN infer state types when `St` is threaded from `defaultState` and wrapped in `Signal<T>` via a mapped type. Works today with a `.d.ts` change.

### Templates: no intelligence at all

Template `.html` files have zero language intelligence. The template language is custom with:

- Dual expression syntax: Lisp-style `{fn arg1 arg2}` and JS-style `{fn(arg1, arg2)}`
- Block structures: `{#if}`, `{#each}`, `{#async}`, `{#snippet}`, `{#rerender}`, `{#guard}`
- Subtemplates: `{>name key=value}`, `{>template name='x' data={...}}`
- Slots: `{>slot}`, `{>slot name}`
- Flat data context merging settings + state + instance methods + helpers
- Event bindings: `@click={handler}`
- Signal auto-unwrapping in expressions
- ~50 built-in helpers

None of this can be represented in TypeScript. Templates need their own language server.

## Validated Type Results

Prototype files at `ai/workspace/tmp/exp-thistype-both.ts` (10 tests, `tsc --strict` clean). Solver experiments at `ai/workspace/tmp/lsp-self-type-findings.md`.

| Target | Mechanism | tsc | IDE | Status |
|--------|-----------|-----|-----|--------|
| `settings.label` -> `string` | Generic `S` inferred from `defaultSettings` | **Yes** | **Yes** | Ready to ship |
| `state.count` -> `Signal<number>` | Generic `St` inferred from `defaultState`, mapped to `Signal<T>` | **Yes** | **Yes** | Ready to ship |
| `self.method()` in events/lifecycle | `M` inferred from `createComponent` return, flows into `CallParams<St, S, M>` | **Yes** | **Yes** | Ready to ship |
| `self.method()` in createComponent | Circular -- `self` typed as `Record<string, any>` | **No** | Needs TS plugin | Tier 2 |
| `this.method()` in createComponent | `ThisType<M>` on return type | **Yes** | **Yes** | Escape hatch, ready to ship |
| All other destructured params | Standard typing through `FactoryParams` / `CallParams` | **Yes** | **Yes** | Ready to ship |

### Key type definitions (validated)

```typescript
type WrapState<T> = { [K in keyof T]: Signal<T[K]> };

// createComponent params: self available but untyped (breaks circularity)
type FactoryParams<St, S> = Omit<CallParams<St, S>, 'self' | 'tpl' | 'component'> & {
  self: Record<string, any>;
  tpl: Record<string, any>;
  component: Record<string, any>;
};

declare function defineComponent<
  M extends Record<string, any> = Record<string, any>,
  S extends Record<string, any> = {},
  St extends Record<string, any> = {},
>(options: {
  // createComponent: self omitted from M, ThisType<M> for typed `this`
  createComponent?: (params: FactoryParams<St, S>) => M & ThisType<M & FactoryParams<St, S>>;

  // events/lifecycle: M already inferred, self is fully typed
  events?: Record<string, (this: M, params: EventCallParams<St, S, M>) => void>;
  onCreated?: (this: M, params: CallParams<St, S, M>) => void;
  onRendered?: (this: M, params: CallParams<St, S, M>) => void;
  onDestroyed?: (this: M, params: CallParams<St, S, M>) => void;

  defaultSettings?: S;
  defaultState?: St;
}): any;
```

**How it works:** `M` is inferred purely from `createComponent`'s return value. `FactoryParams` doesn't contain `M`, so no circularity. `ThisType<M>` types `this` inside the returned object literal (TS compiler intrinsic, doesn't participate in inference). Events and lifecycle receive `self: M` because `M` is already resolved. `M extends Record<string, any>` (loose constraint) is required -- strict constraint causes chained return types to fall back to `any`.

**User experience:**
- `self.method()` works everywhere, fully typed in events/lifecycle, untyped in createComponent
- `this.method()` works everywhere, fully typed in all contexts (opt-in for users who want tsc checking in createComponent)
- Zero breaking changes -- all existing code compiles unchanged
- Arrow functions in the return object don't get typed `this` (standard JS limitation, same as Vue Options API)

## Architecture

```
┌─────────────────────────────────────────────────┐
│                VS Code Extension                 │
│                                                  │
│  sui.tmlanguage.json     ← syntax highlighting   │
│  language-client         ← LSP client for .html  │
│  ts-plugin               ← TS plugin for .js     │
└──────┬──────────────────────┬───────────────────┘
       │ LSP Protocol         │ TS Plugin API
       ▼                      ▼
┌──────────────┐    ┌──────────────────────────┐
│ Language      │    │ TypeScript Language       │
│ Server        │    │ Service Plugin            │
│               │    │                           │
│ TemplateServ  │    │ Intercepts:               │
│ SpecRegistry  │    │  getScriptSnapshot        │
│ HelperReg     │    │  getScriptKind            │
│               │    │  resolveModuleNames       │
│ ┌───────────┐│    │                           │
│ │Component  ││    │ ┌───────────┐             │
│ │Analyzer   │◄────┼─┤Component  │             │
│ │(shared)   ││    │ │Analyzer   │             │
│ └───────────┘│    │ │(shared)   │             │
└──────────────┘    │ └───────────┘             │
                    └───────────────────────────┘
```

### ComponentAnalyzer (shared core)

Parses a component `.js` file and its spec to produce a `ComponentModel`. Both the LSP and TS plugin consume this model.

**Input:** A `.js` file path containing a `defineComponent()` call.

**Analysis steps:**
1. Parse JS to AST (via TypeScript's compiler API — `ts.createSourceFile`)
2. Find `defineComponent({...})` call expression
3. Extract `createComponent` arrow function → walk returned ObjectExpression for property names and function signatures
4. Extract `defaultSettings` object literal → keys and default value types
5. Extract `defaultState` object literal → keys and default value types
6. Extract `events` object literal → string keys (event DSL strings)
7. Extract `subTemplates` object → trace imports to resolve file paths
8. Trace `template` import → resolve to `.html` file path
9. Trace `componentSpec` import → resolve to `.component.js` file path, parse spec
10. Merge spec attributes into settings (spec provides allowedValues, propertyTypes, docs)

**Output:**

```typescript
interface ComponentModel {
  filePath: string;
  tagName?: string;
  templatePath?: string;
  specPath?: string;

  instance: MethodInfo[];       // from createComponent return
  state: StateField[];          // from defaultState
  settings: SettingField[];     // from defaultSettings + spec
  optionAttributes: Record<string, string>;  // from spec
  subTemplates: Record<string, string>;      // name → file path
  events: string[];             // event DSL strings
  slots: string[];              // named slots from spec
}

interface MethodInfo {
  name: string;
  params: { name: string; type?: string }[];
  returnType?: string;
  startLine: number;            // for go-to-definition
}

interface StateField {
  name: string;
  inferredType: string;         // from typeof defaultValue
  defaultValue: any;
}

interface SettingField {
  name: string;
  type: string;
  allowedValues?: string[];     // from spec
  defaultValue?: any;
  source: 'defaultSettings' | 'spec';
  description?: string;         // from spec
}
```

**Caching and invalidation:** ComponentModels are cached per file path. Invalidated on file change (via LSP `didChangeWatchedFiles` or TS plugin file watcher). Spec and import resolution are cached and invalidated when dependency files change.

### SpecRegistry

Discovers and indexes all SUI component specs at startup. Reads **both** spec formats for different purposes.

**Two spec files per component:**

The **source spec JSON** (`button.spec.json`) is a build artifact containing the full source spec serialized to JSON — all shared constants resolved, all helper functions evaluated. It has the same rich semantic metadata as the `.spec.js` but is directly `JSON.parse`-able with no import resolution:

```
Per attribute (type/state/variation/content/setting):
  name           "Emphasis"                — human-readable display name
  attribute      "emphasis"                — HTML attribute name
  description    "be emphasized in a layout"  — what it MEANS semantically
  usageLevel     1-5                       — how commonly used (1=core, 5=rare)
  couplesWith    ['ui-icon']               — related components
  exampleCode    `<ui-button primary>...`  — live code examples

Per option value:
  name           "Primary"                 — human-readable name
  value          "primary"                 — actual attribute value
  description    "be emphasized as the first action that should be taken"
  exampleCode    `<ui-button primary>Confirm</ui-button>`
```

The **compiled spec** (`button.component.js`) is the runtime format — structural lookups only:

```
tagName, attributes[], allowedValues{}, optionAttributes{}, propertyTypes{}, defaultValues{}
```

Shared constants (`packages/specs/src/states/`, `variations/`) provide reusable descriptions for common patterns like size, disabled, attached — these carry per-option descriptions (e.g., `mini`: "appear extremely small") that are consistent across all components.

**Three spec artifacts per component:**
- `*.spec.js` — source authoring format (JS with imports, not directly consumable)
- `*.spec.json` — **build artifact: full source spec serialized to JSON** — all metadata resolved, no imports, `JSON.parse`-able
- `*.component.js` — **build artifact: compiled runtime format** — structural lookups only

The LSP reads the two build artifacts. The `.spec.json` has all the rich metadata (descriptions, usage levels, examples, per-option descriptions) already resolved from the shared constants. No JS execution needed.

**Discovery:** Glob for `**/specs/*.component.js` and `**/specs/*.spec.json` under `src/`. Pair them by filename prefix.

**Index structure:** `Map<string, SpecInfo>` keyed by tag name, where `SpecInfo` merges both:
```typescript
interface SpecInfo {
  // From compiled spec (fast structural lookups)
  attributes: string[];
  allowedValues: Record<string, string[]>;
  optionAttributes: Record<string, string>;
  propertyTypes: Record<string, string>;
  defaultValues: Record<string, any>;

  // From source spec (rich semantic metadata)
  name: string;                    // "Button"
  description: string;             // "A button indicates a possible user action."
  uiType: string;                  // "element"
  attributeInfo: Map<string, {
    name: string;                  // "Emphasis"
    description: string;           // "be emphasized in a layout"
    usageLevel: number;            // 1
    exampleCode?: string | string[];
    couplesWith?: string[];
    optionInfo: Map<string, {
      name: string;                // "Primary"
      description: string;         // "be emphasized as the first action..."
      exampleCode?: string;
    }>;
  }>;
}
```

**Usage:**

| Feature | Data source | Example |
|---|---|---|
| Attribute completions | compiled spec `attributes[]` | `<ui-button \|>` → `emphasis`, `size`, ... |
| Value completions | compiled spec `allowedValues` | `size="\|"` → `mini`, `small`, ... |
| Option attribute completions | compiled spec `optionAttributes` | `<ui-button \|>` → `primary`, `large`, ... |
| **Completion sort order** | **source spec `usageLevel`** | Level 1 (`emphasis`, `size`) above level 5 (`social`) |
| **Hover on attribute** | **source spec descriptions** | `emphasis` → "A button can be emphasized in a layout" |
| **Hover on value** | **source spec per-option descriptions** | `primary` → "be emphasized as the first action that should be taken" |
| **Hover examples** | **source spec `exampleCode`** | Shows `<ui-button primary>Confirm</ui-button>` in hover |
| **Related components** | **source spec `couplesWith`** | `icon` attribute → links to `ui-icon` |
| Diagnostics (severity) | source spec `usageLevel` | Could weight warnings by usage level |

### HelperRegistry

Static map of built-in template helpers from `packages/templating/src/template-helpers.js`.

**Structure:** `Map<string, HelperInfo>` with:
```typescript
interface HelperInfo {
  name: string;
  params: { name: string; type: string; optional?: boolean; default?: string }[];
  returnType: string;
  description: string;
  category: 'logic' | 'comparison' | 'string' | 'css' | 'array' | 'date' | 'debug';
}
```

**Populated at build time** — generated from the source file. ~50 helpers. Does not change at runtime.

## TS Plugin: LanguageServiceHost Interception

The TS plugin uses the `typescript-plugin-css-modules` pattern — it creates a brand new `LanguageService` backed by a proxied `LanguageServiceHost`.

### Mechanism

When TS requests `getScriptSnapshot` for a SUI component file:

1. Read the real file content
2. Run ComponentAnalyzer to extract instance methods
3. Generate a JSDoc annotation block for `createComponent`'s callback parameter
4. Return a modified snapshot with the annotation injected

**Example — what's on disk:**
```javascript
const createComponent = ({ self, settings, state }) => ({
  setValue(value) { ... },
  getActiveIndex() { return state.activeIndex.get(); },
});
```

**What TS sees (virtual snapshot):**
```javascript
/** @type {(params: import('./menu.sui-types').MenuParams) => import('./menu.sui-types').MenuInstance} */
const createComponent = ({ self, settings, state }) => ({
  setValue(value) { ... },
  getActiveIndex() { return state.activeIndex.get(); },
});
```

The virtual type module (`menu.sui-types`) is served via `resolveModuleNames` interception — it never exists on disk.

### Interception points

| Host method | What we intercept | Purpose |
|---|---|---|
| `getScriptSnapshot` | SUI `.js` files containing `defineComponent` | Inject JSDoc annotations for self/settings/state |
| `getScriptKind` | Virtual `.sui-types` modules | Tell TS they're TypeScript declarations |
| `resolveModuleNames` | Imports of `.sui-types` | Resolve to virtual in-memory content |

### What this enables

- `self.setValue` → autocomplete with parameter types
- `self.nonExistent()` → red squiggly (property doesn't exist)
- Hover on `self.getActiveIndex()` → shows return type
- Go-to-definition on `self.getActiveIndex()` → jumps to the method
- Same intelligence in events, onCreated, onRendered, onDestroyed callbacks

### Limitations

- IDE-only — `tsc` ignores LS plugins
- `self` return types through self-referential calls are `any` (same as `LooseMethods`)
- Requires VS Code (or any editor with TS plugin support)

## Template Language Server

### Compiler integration

Two new opt-in parameters on `TemplateCompiler.compile()`:

**`includePositions: true`** — Adds `start` and `end` integer offsets (byte positions in the source string) to each AST node. The StringScanner already tracks `this.pos` throughout parsing. Implementation: save `scanner.pos` before consuming each tag, store on the AST node.

```json
{ "type": "expression", "value": "item.name", "start": 142, "end": 153 }
{ "type": "each", "over": "items", "as": "item", "start": 95, "end": 340 }
```

Default compilation is unchanged. The terse AST stays terse.

**`recoverable: true`** — Changes `StringScanner.fatal()` to push to `this.errors[]` instead of throwing. Returns a partial AST + error array. The parser continues after errors by advancing to the next tag.

```javascript
const compiler = new TemplateCompiler(templateString);
const ast = compiler.compile({ includePositions: true, recoverable: true });
// ast is partial (may be missing nodes after errors)
// compiler.errors contains diagnostic objects: { message, pos, line, column }
```

### Diagnostics

Feed templates through the compiler with both flags. Map `compiler.errors` to LSP `Diagnostic` objects with severity, range, and message.

### Completion contexts

The server determines cursor context by parsing the template up to the cursor position:

**1. Expression context** `{|}`

Build scope chain from cursor position upward through enclosing blocks:

| Block | Names introduced |
|---|---|
| `{#each item, i in items}` | `item`, `i`, `index`, `this` |
| `{#each items}` (no alias) | `this`, `index`, plus direct property access |
| `{#async fetchData as data}` | `data` |
| `{#async fetchData as {name, ...rest}}` | `name`, `rest` |
| `{#snippet}` (invoked with `{>name key=val}`) | `key` (plus inherited parent scope) |

Merge scope chain + ComponentModel (settings, state, instance) + HelperRegistry. Present flat.

Completion item metadata:
- Instance methods: `kind: Method`, detail shows params
- Settings: `kind: Property`, detail shows type and allowed values
- State: `kind: Property`, detail shows `Signal<T>`
- Helpers: `kind: Function`, detail shows signature
- Loop variables: `kind: Variable`, detail shows source block

**2. HTML attribute context** `<ui-button |>`

Lookup tag name in SpecRegistry. Suggest:
- Named attributes (`emphasis`, `size`, `disabled`, etc.)
- Option attributes (`primary`, `large`, etc.) with detail showing what they map to

**3. Attribute value context** `<ui-button size="|">`

Lookup `allowedValues` for the attribute from SpecRegistry.

**4. Block start context** `{#|}`

Suggest block types: `if`, `each`, `async`, `snippet`, `rerender`, `guard`, `html`.

**5. Template/snippet reference** `{>|}`

Suggest snippet names defined in the current file + subTemplate names from ComponentModel.

**6. Event binding** `@|`

Suggest standard DOM event names + component-specific events from spec.

### Hover

| Target | Info shown |
|---|---|
| `{formatDate ...}` | Helper signature, parameter descriptions |
| `{count}` (state) | "State: Signal\<number\>, default: 0" |
| `{label}` (setting) | "Setting: string, default: ''" + spec description if available |
| `{getActiveIndex}` (instance) | Method signature from createComponent |
| `<ui-button primary>` | "Sets `emphasis` to `primary` — be emphasized as the first action that should be taken" + example code |
| `<ui-button size="large">` | "Size: appear larger than normal" — from shared SIZE_VARIATION constant |
| `<ui-button>` (tag itself) | "Button — A button indicates a possible user action." |

### Go-to-definition

| From (template) | To |
|---|---|
| `{getActiveIndex}` | Method definition in createComponent return object in `.js` |
| `{count}` (state) | `defaultState: { count: 0 }` in `.js` |
| `{label}` (setting) | `defaultSettings: { label: '' }` or spec attribute definition |
| `{>rowTemplate}` | subTemplate's defineComponent in imported `.js` file |
| `{>slot actions}` | No target (slots are consumer-defined) |

## File Association

The LSP must link `.html` template files to their component `.js` files. Two patterns exist:

**Build-time (static import):**
```javascript
import template from './menu.html?raw';
```

**Runtime (REPL/CDN):**
```javascript
const template = await getText('/components/menu/menu.html');
```

**Resolution strategy:**
1. Parse `.js` files for `import ... from './*.html?raw'` — extract path, resolve relative to file
2. Parse `.js` files for `getText('...')` calls with string literal arguments — extract path
3. Fall back: `foo.html` pairs with `foo.js` in the same directory

Bidirectional: given a `.html` file, find the `.js` file that imports it (for ComponentModel). Given a `.js` file, find its template (for diagnostics, go-to-definition targets).

## Package Structure

```
tools/vscode-extension/
├── package.json                 ← VS Code extension manifest
├── sui.tmlanguage.json          ← TextMate grammar (syntax highlighting)
├── language-configuration.json  ← bracket matching, auto-close for SUI blocks
├── src/
│   ├── extension.ts             ← extension activation, starts LSP client + TS plugin
│   ├── server/
│   │   ├── server.ts            ← LSP server entry point
│   │   ├── template-service.ts  ← completions, hover, diagnostics for .html
│   │   ├── spec-registry.ts     ← indexes *.component.js files
│   │   └── helper-registry.ts   ← static helper map
│   ├── ts-plugin/
│   │   ├── index.ts             ← TS plugin entry (PluginModule)
│   │   └── host-proxy.ts        ← LanguageServiceHost interception
│   └── shared/
│       ├── component-analyzer.ts ← parses .js → ComponentModel
│       └── types.ts              ← ComponentModel, MethodInfo, etc.
└── test/
```

Lives in `tools/` because it's developer tooling, not a published package consumed by end users. Uses `@semantic-ui/compiler` as a dependency for template parsing.

## Phasing

### Phase 0 — Ship types + tmLanguage (~1d pair)
- Ship `.d.ts` generic fixes: settings, state, self (events/lifecycle), ThisType escape hatch
- Extend `sui.tmlanguage.json` with missing syntax
- Immediate value, zero tooling dependency

### Phase 1 — ComponentAnalyzer + TS plugin (~4-6d pair)
- ComponentAnalyzer: parse .js files -> ComponentModel (using TS compiler API)
- TS LanguageServiceHost plugin for typed `self` in createComponent
- Virtual type module generation per component
- Go-to-definition from `self.method()` to createComponent return
- Event DSL string validation
- This is the exploratory phase -- shared core that everything builds on

### Phase 2 — Template LSP foundation (~2-3d pair)
- LSP server scaffolding (vscode-languageserver)
- Compiler: add `includePositions` and `recoverable` to `compile()`
- Diagnostics from compiler (recoverable mode)
- SpecRegistry + HTML attribute/value/optionAttribute completions
- Helper completions with signatures
- Block completions and auto-close
- Snippet/subtemplate name completions

### Phase 3 — Cross-file template intelligence (~4-6d pair)
- Template data context completions (settings + state + instance, flat)
- Scope chain for each/async/snippet variables
- Go-to-definition (template -> JS)
- Hover for data context names + spec descriptions from .spec.json

**Total: ~11-16d** (calibrated from historical actuals -- completed plans came in 2-5x under estimate for mechanical work, ~1x for exploratory)

## Testing

Automated test suite per completion type. Tests run in CI without VS Code — they exercise the language server and component analyzer directly.

### Test architecture

```
test/
├── fixtures/                          ← minimal component files for tests
│   ├── basic/                         ← component with settings + state + createComponent
│   │   ├── basic.js
│   │   ├── basic.html
│   │   └── specs/basic.component.js
│   ├── no-spec/                       ← component without spec (common user case)
│   │   ├── app.js
│   │   └── app.html
│   ├── with-subtemplates/             ← component with subTemplates registration
│   │   ├── parent.js
│   │   ├── parent.html
│   │   └── parts/row.js
│   └── complex/                       ← component with nested scopes, async, snippets
│       ├── complex.js
│       └── complex.html
├── component-analyzer.test.ts         ← unit tests for JS analysis
├── template-completions.test.ts       ← integration tests for template completions
├── template-diagnostics.test.ts       ← compiler error → diagnostic mapping
├── spec-registry.test.ts              ← spec discovery and indexing
├── helper-registry.test.ts            ← helper signature lookup
└── ts-plugin.test.ts                  ← TS plugin type resolution
```

### ComponentAnalyzer tests

Test extraction of ComponentModel from JS source files.

```
SUITE: ComponentAnalyzer
├── extracts createComponent method names
├── extracts createComponent method params
├── extracts defaultSettings keys and types
├── extracts defaultState keys and types
├── extracts event DSL strings
├── extracts subTemplates registrations
├── traces template import (? raw)
├── traces template import (getText)
├── traces componentSpec import
├── handles component with no createComponent
├── handles component with no defaultSettings
├── handles component with no spec
├── handles component with keys binding
```

### Template completion tests

Each test provides a template string with a cursor position marker (e.g., `{|}` or `<ui-button |>`) and asserts the returned completion items.

```
SUITE: Expression completions ({|})
├── suggests settings keys
├── suggests state keys
├── suggests createComponent methods
├── suggests built-in helpers
├── does not suggest internal/private names
├── merges all sources into flat namespace

SUITE: Scoped expression completions
├── suggests loop variable inside {#each item in items}
├── suggests index variable inside {#each}
├── suggests custom index alias {#each item, i in items}
├── suggests async result inside {#async fetchData as data}
├── suggests destructured async parts {#async fetch as {name, email}}
├── suggests error variable inside {error as e}
├── inherits parent scope inside snippet
├── does not leak each variable outside loop
├── inner each shadows outer index
├── nested scopes merge correctly

SUITE: HTML attribute completions (<ui-button |>)
├── suggests spec attributes for known component
├── suggests option attributes (primary, large, etc.)
├── no suggestions for unknown component tag
├── no suggestions for non-SUI elements (<div>)

SUITE: Attribute value completions (<ui-button size="|">)
├── suggests allowedValues for attribute
├── no suggestions for attribute without allowedValues
├── suggests boolean values for boolean attributes

SUITE: Option attribute completions (<ui-button |>)
├── suggests bare option attributes
├── includes compound forms (top-attached, vertical-animated)
├── completion detail shows target attribute (primary → emphasis)

SUITE: Block completions ({#|})
├── suggests if, each, async, snippet, rerender, guard, html
├── closing block matches open block ({#if} → {/if})

SUITE: Template/snippet reference ({>|})
├── suggests snippet names defined in current file
├── suggests subTemplate names from ComponentModel
├── suggests "slot" for slot insertion
├── does not suggest undefined snippets

SUITE: Event binding (@|)
├── suggests standard DOM events
├── suggests inside tag context only
```

### Template diagnostic tests

Each test provides a template and asserts the expected diagnostics (error message, line, column).

```
SUITE: Template diagnostics
├── reports unmatched {/if} without open
├── reports unmatched {/each} without open
├── reports {else} without condition
├── reports {error} outside {#async}
├── reports {loading} outside {#async}
├── recoverable mode returns partial AST after error
├── position info is correct on error nodes
├── valid template produces no diagnostics
```

### SpecRegistry tests

```
SUITE: SpecRegistry
├── discovers component.js files under src/
├── indexes by tag name
├── reads attributes and allowedValues from component.js
├── reads descriptions and usageLevels from spec.json
├── reads per-option descriptions from spec.json
├── returns empty for unknown tag name
├── invalidates on file change
```

### HelperRegistry tests

```
SUITE: HelperRegistry
├── contains all helpers from template-helpers.js
├── returns signature for known helper (formatDate)
├── returns params with types (classIf: expr, trueClass, falseClass)
├── returns null for unknown helper name
├── categories are assigned correctly
```

### TS plugin tests

Test that the type resolution produces correct completions for `self`, `settings`, `state` in JS files. These tests use TypeScript's compiler API directly to check resolved types at specific positions.

```
SUITE: TS plugin — self typing
├── self. completes with createComponent method names
├── self.nonExistent() produces diagnostic
├── self. works inside events callback
├── self. works inside onCreated callback
├── self. works inside onRendered callback
├── self. preserves method parameter types

SUITE: TS plugin — settings typing
├── settings. completes with defaultSettings keys
├── settings. completes with spec attribute names
├── settings values have correct inferred types
├── settings. works across all callback types

SUITE: TS plugin — state typing
├── state. completes with defaultState keys
├── state.key shows Signal methods (get, set, value, etc.)
├── state values have correct Signal<T> wrapping
├── state. works across all callback types
```

### Test environment

All LSP tests are **node** environment (no DOM, no browser). The ComponentAnalyzer, template completions, and spec registry are pure logic — they parse source files and return data structures. No VS Code or running LSP server needed.

Tests follow the monorepo's Vitest conventions:
- `test/*.test.js` in the `tools/vscode-extension/` package → node environment
- Import from package names where possible
- Use `describe` / `it` / `expect` from vitest
- TS plugin tests instantiate `ts.createLanguageService` with the plugin applied

```bash
# Run all LSP tests
cd tools/vscode-extension && npm test

# Run a specific suite
cd tools/vscode-extension && npx vitest run test/template-completions.test.js

# Watch mode during development
cd tools/vscode-extension && npm run test:watch
```

### Fixture design

Fixtures are minimal complete components — not excerpts, but real `defineComponent` calls with templates, in both spec-driven (primitive) and spec-free (user component) variants. The spec-free fixtures are critical since that's the majority use case for third-party developers.

Each fixture should be the smallest possible component that exercises a specific completion scenario. Avoid kitchen-sink fixtures — one fixture per test concern keeps failures precise.

## Challenges and Unknowns

### High risk

**`self` in createComponent is untyped at the tsc level.**
A dedicated solver agent ran 15+ experimental approaches. `ThisType<M>` on the return type solved `this` typing, but `self` as a named parameter cannot carry `M` without creating circular inference. The solution: `self` is available but typed as `Record<string, any>` in createComponent; fully typed as `M` in events/lifecycle (where M is already inferred). Users who want typed self-reference in createComponent use `this` (escape hatch). The TS plugin bridges the remaining gap IDE-side.

Risk: **Largely mitigated.** Events and lifecycle -- where `self` is used most in real components -- get full types via tsc. Only createComponent has the divergence. The `this` escape hatch covers users who want tsc strictness. The TS plugin covers everyone else in VS Code.

**TS plugin stability across TypeScript versions.**
The LanguageServiceHost interception creates a brand new `ts.LanguageService` with a proxied host. This is an internal API surface — not `tsc`'s public API, but the language service host contract. TypeScript doesn't guarantee stability here. Major TS releases (5.x → 6.x) could change `getScriptSnapshot` behavior, `resolveModuleNames` signature, or `ScriptKind` handling. The `typescript-plugin-css-modules` project demonstrates this is maintainable (they've tracked TS releases for years), but it's ongoing maintenance cost.

Risk: **Manageable.** Pin to tested TS versions. Track TS release notes. The plugin is a thin layer — the analysis logic lives in the ComponentAnalyzer which has no TS API dependency.

### Medium risk

**Fault-tolerant parser is real engineering, not a flag.**
The compiler uses two stacks (`contentStack`, `conditionStack`). An error mid-parse can leave these inconsistent. `scanner.fatal()` is called in 8 locations — some have `break` after, some don't (doesn't matter when it throws, matters when it collects). `optimizeAST()` merges adjacent HTML nodes, which could destroy position boundaries. Snippet hoisting reorders nodes, shifting positions.

For `recoverable` mode to work:
1. Every `fatal()` call site needs a `break`/`continue` to prevent cascade
2. Skip-ahead logic: advance to next recognizable tag boundary after error
3. `optimizeAST()` needs to preserve or merge position ranges when joining HTML nodes
4. Snippet hoisting must not confuse the position→scope mapping

Risk: **Known work, bounded.** The compiler is ~830 lines. Each `fatal()` site can be audited. The position tracking is additive (save `scanner.pos` on node creation). The `optimizeAST` interaction needs care but is a one-time design decision.

**ComponentAnalyzer parsing depth.**
The analyzer needs to extract method names, parameter names, defaultSettings keys, and defaultState keys from JS source. Two approaches:

1. *TS compiler API* (`ts.createSourceFile` + AST walk): Correct for all patterns, handles edge cases (computed property names, spread operators, conditional returns). Adds ~20MB dependency.
2. *Regex / lightweight parse*: Works for the current convention where createComponent always returns an object literal with method shorthand. Breaks on any deviation (arrow functions as properties, spread, conditional logic).

Current components are remarkably consistent — regex works today. But downstream users won't follow the same conventions. A user who writes `createComponent: ({ self }) => { const methods = { ... }; return methods; }` would break regex parsing.

Risk: **Use TS compiler API from the start.** The dependency cost is real (~20MB) but the correctness cost of regex is worse — false negatives in user-authored components would make the LSP feel broken. TS's parser is fast and battle-tested.

**Subtemplate data context is only partially traceable.**
Subtemplates receive explicit data: `{>row name=item.name age=item.age}`. The LSP can extract `name` and `age` from the call site. But:
- Multiple call sites can pass different data to the same subtemplate
- Dynamic template names (`{>template name=getTemplate}`) can't be resolved statically
- Verbose syntax `{>template name='x' data=getData}` passes a function result — unknown shape

Risk: **Degrade gracefully.** For known shorthand calls with literal data, provide completions. For dynamic/verbose calls, show "data context depends on caller" rather than guessing wrong.

### Low risk (known work)

**The `{ui}` special variable.**
`{ui}` is a computed class string synthesized by `WebComponentBase.getUIClasses()` from active spec attributes. It's not in defaultSettings, state, or createComponent return. Every spec-driven component template uses it (`<div class="{ui}button">`). The LSP must either:
- Add `ui` to the data context for spec-driven components (preferred — it IS in the data context at runtime)
- Hardcode it in the ComponentModel when a componentSpec is present

Risk: **Trivial.** One conditional in ComponentModel construction: if componentSpec exists, add `ui: string` to the data context.

**Custom helpers are invisible.**
`registerHelper('formatMoney', fn)` adds to the global helper registry at runtime. The LSP won't know about these unless it traces `registerHelper` calls across the codebase. Built-in helpers (~50) are covered by the static HelperRegistry.

Risk: **Acceptable gap.** Custom helpers are rare. The LSP won't suggest them but also won't flag them as errors (unknown names fall through to the JS eval path at runtime). Could add `registerHelper` tracing later as an enhancement.

**Spec format evolution.**
The spec system is pre-1.0 and still evolving. The `.component.js` compiled format is auto-generated and relatively stable — its structure hasn't changed significantly. The `.spec.json` format mirrors the source spec which does evolve (new fields like `compoundAliases` were added recently). The LSP reads both.

Risk: **Low.** The LSP reads fields it knows and ignores the rest. New spec fields don't break existing completion logic — they just aren't surfaced until the LSP is updated. The compiled spec is the more stable contract.

**Expression completion after first token.**
Inside `{formatDate |}`, the LSP should ideally suggest parameters for `formatDate`. This works for built-in helpers (known signatures in HelperRegistry) but not for Lisp-style calls to instance methods or custom helpers. `{getLabel |}` — is this asking for the first arg to `getLabel`? The LSP would need the method's parameter list from ComponentModel.

Risk: **Known scope.** Helper parameter hints are straightforward. Instance method parameter hints require the ComponentAnalyzer to extract parameter names (which it already does for the ComponentModel). The gap is custom helpers only.

### Known unknowns

**Will the TS plugin work with other TS plugins the user has installed?**
The CSS modules plugin creates a *brand new* `LanguageService` rather than proxying. If the SUI plugin does the same, it replaces whatever TS or other plugins set up. If it proxies, it chains with existing plugins. The interaction model with other plugins (Tailwind CSS IntelliSense, Prettier, ESLint) is untested.

Mitigation: Use the proxy pattern (wrap existing LanguageService, don't replace). Test with common plugin combinations.

**How fast is ComponentModel generation?**
The analyzer runs TS's parser on `.js` files + reads `.component.js` + `.spec.json`. For a project with 80 primitives + many user components, startup time matters. Cold start analysis of 100+ components needs to be under 2-3 seconds.

Mitigation: Lazy analysis (only parse a component when its template is opened). Cache ComponentModels. Invalidate on file change.

**Will VS Code's built-in HTML intelligence conflict with the SUI template LSP?**
SUI template files are `.html`. VS Code's built-in HTML language features (emmet, tag completion, attribute suggestions) will also activate. The SUI LSP adds SUI-specific completions on top. Some completions might duplicate (HTML attributes that overlap with spec attributes). The interaction between the two isn't tested.

Mitigation: Use VS Code's `documentSelector` to scope the SUI LSP to files that contain SUI template syntax (detected by `{` expressions or are imported as `?raw`). Or use a custom file extension (`.sui.html` or `.sui`) — but this breaks existing conventions.

**Is the scope chain correct for all template nesting patterns?**
The scope chain handles `{#each}`, `{#async}`, snippets, and subtemplates. But there are edge cases:
- `{#each}` inside `{#async}` inside `{#each}` — triple nesting with shadowed variables
- `{#snippet}` called from inside `{#each}` — does the snippet see the loop variable?
- `{#rerender}` / `{#guard}` blocks — do they affect scope? (They shouldn't, but need verification)

Mitigation: The existing TemplateCompiler's behavior is the source of truth. Build scope chain tests against every nesting combination. The compiler's contentStack/conditionStack logic already models the correct scoping.

## Non-Goals

- **Full expression type-checking** — The dual Lisp/JS expression syntax with runtime `new Function` + `with(Proxy)` is not statically analyzable in general. The LSP flags unknown names, not type errors within expressions.
- **CSS intelligence** — Design token completions, CSS custom property suggestions are a separate concern.
- **React/Vue/Svelte wrapper types** — Wrapper packages will have their own type generation; not in scope here.
- **JetBrains support** — LSP protocol is editor-agnostic but the TS plugin mechanism differs. VS Code first; JetBrains investigated separately if needed.
- **Build-time type checking for `self` in createComponent** — TS cannot infer `M` into a named parameter. `self` is `Record<string, any>` in createComponent under tsc. Users who want tsc strictness use `this` (escape hatch). `self` IS fully typed in events/lifecycle under tsc.

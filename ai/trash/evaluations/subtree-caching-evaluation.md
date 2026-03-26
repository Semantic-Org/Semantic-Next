## Task: Independently evaluate a subtree caching strategy for a custom template rendering system built on Lit

You are reviewing a rendering architecture for a web component framework. Read ALL listed source files before answering. Do NOT read git history or diffs — evaluate only the current code state.

### Architecture Overview

1. A `TemplateCompiler` compiles template strings into ASTs
2. `LitRenderer.render()` traverses the AST via `readAST()`, evaluating expressions and producing a Lit `TemplateResult` (via the `html` tagged template literal)
3. Expressions in templates become Lit AsyncDirectives:
   - `reactive-data`: leaf values like `{name}`, `{count + 1}`
   - `reactive-conditional`: `{#if condition}...{/if}`
   - `reactive-each`: `{#each item in collection}...{/each}`
   - `reactive-rerender`: `{#rerender expression}` (explicit reactivity boundary)
   - `reactive-async`: `{#async promise as result}...{/async}`
   - `render-template`: `{>subtemplate data=value}` (nested component templates)
4. Each directive creates a `Reaction` that tracks Signal dependencies and re-fires when they change, calling `this.setValue()` to update its Lit Part
5. Structural blocks (if, each, rerender, async) render their content via `LitRenderer.renderContent()`, which creates a child `LitRenderer` for the subtree

### Expression Evaluation Pipeline

This is critical to understand. `evaluateExpression` dispatches to `lookupExpressionValue` which resolves tokens through `lookupTokenValue`. The resolution order is:

1. Check if literal (string, number, boolean)
2. Walk dot-path via `getDeepDataValue(data, token)` — at each step, if the value is a Signal, it calls `signal.get()` (which TRACKS the dependency for the current Reaction)
3. `accessTokenValue` — if the final resolved value is a Signal, reads `signal.value` (which also tracks)
4. If still undefined, try `evaluateJavascript` — uses `new Function()` with a `with` statement and a Proxy over the data context. The Proxy's get trap auto-unwraps Signals via `signal.get()`, so JS expressions like `{count + 1}` where `count` is a Signal ARE automatically dependency-tracked
5. Check global helpers

The key implication: whether an expression is reactive depends entirely on whether the VALUES it touches in the data context are Signals. The expression syntax (Lisp-style vs JS-style) doesn't matter — the unwrapping mechanism handles both uniformly. A `{section.pages}` where `section` is a plain object from an each loop has NO signal dependency and won't self-update via reactions.

### The Template Data Context

The data context is flat — it merges:
- Component instance methods (from `createComponent`)
- Settings (public config via attributes, backed by shadow Signals in a Proxy)
- State (private Signals)

Settings are accessed via a Proxy with shadow Signals. `settings.code` reads the current Lit property value but also calls `signal.get()` for tracking. When attributes change, `adjustPropertyFromAttribute` syncs the new value to the shadow signal via `signal.set()`.

State values are Signal objects in the data context. Templates auto-unwrap them through the pipeline above.

### The renderContent Mechanism

`renderContent({ ast, data, key, isSVG })` creates child LitRenderers for subtrees. It maintains a WeakRef-based cache (`renderTrees`) keyed by a hash of the AST (and optionally a key for each items).

`cachedRender(data)` updates the cached LitRenderer's data via `updateData()` and returns the existing `litTemplate` without re-running `readAST()`.

### Concrete Problems

1. An `{#async formatCode as result}` block inside a `{#rerender darkMode}` block loses its resolved state (flashes empty) when the parent component re-renders due to an attribute change, because the async directive instance is destroyed and recreated

2. In a nav-menu component with nested `{#each}` loops and highlight snippets, search filtering produces stale content — cached subtrees show old highlights/items because plain data objects changed but no Signal tracks them

3. Performance: directive recreation creates new Reaction objects on every parent re-render even when nothing relevant changed

### Questions — Evaluate Independently

**Question 1:** Is caching subtrees necessary? What are the real costs of directive recreation vs cache management? Consider Reaction allocation, dependency tracking setup, and DOM operations. Evaluate what Lit actually does when it receives a new TemplateResult with different strings arrays — investigate the behavior rather than assuming.

**Question 2:** The cache key is `hashCode({ ast })` for single-instance subtrees and `hashCode({ ast, key })` for each items. Is this keying strategy sound? What collisions or edge cases exist? Consider snippets (same AST, different data), nested each loops, and subtemplates.

**Question 3:** When a cached subtree's data changes, how should updates propagate to directives inside? Consider:
- Expressions backed by Signals (self-updating via reactions)
- Expressions backed by plain data (no Signal dependency)
- Structural directives (conditional, each) whose conditions/items may be plain data
- The interaction between Lit's re-render cycle and the Signal-based reactivity system

What mechanism would correctly handle both reactive and non-reactive expressions while maintaining caching benefits?

### Source Files to Read

- `packages/renderer/src/lit/renderer.js`
- `packages/renderer/src/lit/directives/reactive-data.js`
- `packages/renderer/src/lit/directives/reactive-each.js`
- `packages/renderer/src/lit/directives/reactive-conditional.js`
- `packages/renderer/src/lit/directives/reactive-rerender.js`
- `packages/renderer/src/lit/directives/reactive-async.js`
- `packages/renderer/src/lit/directives/render-template.js`
- `packages/reactivity/src/signal.js`
- `packages/reactivity/src/reaction.js`
- `packages/reactivity/src/scheduler.js`
- `packages/component/src/web-component.js`

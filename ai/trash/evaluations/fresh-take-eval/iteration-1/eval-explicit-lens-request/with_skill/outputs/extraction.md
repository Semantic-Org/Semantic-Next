# Fresh Take Extraction: Subtree Rendering in Lit Renderer

## Facts Discovered (Transfer)

- **Subtree architecture.** `renderContent()` creates child `LitRenderer` instances for nested AST blocks (conditionals, each loops, async blocks, snippets, SVG). Each child renderer calls `render()` to produce its own `TemplateResult`.
- **WeakRef storage.** Child renderers are stored in a parent's `renderTrees` object as `WeakRef` instances keyed by a content ID derived from `hashCode()` of the AST node.
- **Data propagation.** When parent data changes, it must propagate to child renderers. Children that set `inheritsData: true` receive updated data from their parent. The parent mutates `this.data` in-place and children reference the same object.
- **Directive reaction pattern.** Each reactive directive (`ReactiveEachDirective`, `ReactiveConditionalDirective`, `ReactiveAsyncDirective`) creates a single `Reaction` on first render. The reaction watches signals and calls `this.setValue()` to push new content to Lit on changes.
- **AST identity.** AST nodes are produced by the template compiler and are structurally identical objects when the same template snippet appears at multiple call sites. `hashCode()` produces the same hash for structurally identical ASTs.
- **The same AST subtree can appear at multiple call sites with different data contexts.** For example, an `{#each}` body has one AST but renders N times, once per item.
- **`each` uses Lit's `repeat()` directive.** This already provides DOM-level keyed reconciliation for list items. Each item gets an identity key from `getItemID()`.
- **Directives are stateful.** Lit `AsyncDirective` instances persist across re-renders — they hold their own `reaction`, `matchIndex`, resolved async state, etc. Lit manages their lifecycle tied to DOM position.
- **`dataVersion` signal.** A `Signal(0)` that gets incremented to notify reactive expressions that data has changed, separate from individual signal dependencies.
- **Re-render cost.** Calling `render()` on a `LitRenderer` walks the AST, produces a tagged template literal result (`html`/`svg`), and creates reactive directives. The AST walk is synchronous and allocates closures for each expression node.

## Constraints Identified (Transfer — rephrased without approach context)

- **TemplateResult identity matters to Lit.** Lit uses referential identity of `TemplateResult` objects to decide whether to re-render a DOM subtree. Returning the same `TemplateResult` from a directive's `render()` means Lit skips DOM diffing for that subtree entirely.
- **Directive state is positional.** Lit ties directive instances to their position in the template. If a directive returns a structurally different `TemplateResult` (different tagged template literal), Lit tears down and recreates the DOM.
- **Parent re-render recreates closures.** When a parent `LitRenderer.render()` runs, it rebuilds its `html`/`expressions` arrays and creates new closures for `evaluateExpression`, `evaluateConditional`, etc. These closures capture the current `data` reference.
- **Data context is mutable and shared.** `this.data` is an object reference that gets mutated via `updateData()`. Multiple renderers pointing at the same data object see changes immediately, but there is no signal-level notification — hence the `dataVersion` bump mechanism.
- **GC timing is non-deterministic.** `WeakRef.deref()` may return `undefined` at any point after the referent becomes unreachable, which means any cache miss path must be able to reconstruct the renderer from scratch.

## Hypotheses Formed (Isolate)

- *That subtree caching is necessary for acceptable rendering performance.*
- *That WeakRef is the right storage mechanism for cached renderers.*
- *That hash-based keying is the correct identity strategy.*
- *That `dataVersion` bumping solves the data propagation problem cleanly.*

## Approaches Attempted (Isolate — constraints extracted above)

- *Enabled subtree caching globally (`useSubtreeCache = true`), changed directives to return `noChange` on re-render instead of recreating reactions.*
- *Added `key` parameter to `renderContent` for `each` items to disambiguate same-AST subtrees.*
- *Added `dataVersion` signal with cascade bumping through tree to trigger reactive updates when data changes.*

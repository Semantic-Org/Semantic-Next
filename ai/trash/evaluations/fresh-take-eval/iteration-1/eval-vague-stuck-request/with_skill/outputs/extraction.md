# Fresh Take Extraction: Subtree Lifecycle in Structural Directives

## Facts Discovered (Transfer)

### Architecture
- The renderer (`LitRenderer`) produces Lit `TemplateResult` objects from an AST. It delegates structural blocks (`if`, `each`, `rerender`, `async`) to Lit `AsyncDirective` subclasses.
- Each structural directive creates a `Reaction` on first render. The Reaction watches for Signal/dependency changes and calls `this.setValue()` to push new content into Lit's rendering pipeline.
- Structural directives call back into the renderer via closures (e.g., `content: () => this.renderContent({ ast: value, data })`) to produce child content. This is the seam where parent and child renderers meet.
- `renderContent()` creates a child `LitRenderer` instance for each content subtree. The child renderer is stored as a `WeakRef` in the parent's `renderTrees` map, keyed by a hash of the AST and an optional key.
- On subsequent calls, `renderContent()` finds an existing child renderer via the `WeakRef` and calls `cachedRender(data)` which returns the cached `litTemplate` without re-running `readAST`.
- Data propagation to subtrees happens through `bumpDataVersion()` which increments a `dataVersion` Signal on the parent, then recursively calls `updateData` + `bumpDataVersion` on child renderers that have `inheritsData: true`.

### Directive Lifecycle
- All four structural directives (`ReactiveConditionalDirective`, `ReactiveEachDirective`, `ReactiveRerenderDirective`, `ReactiveAsyncDirective`) extend Lit's `AsyncDirective`, which provides `isConnected`, `disconnected()`, `reconnected()`, and `setValue()`.
- All four follow the same pattern: on first `render()` call, create a `Reaction`; on subsequent `render()` calls, return `noChange` because the Reaction handles updates internally via `setValue()`.
- `disconnected()` stops the Reaction and nulls it. `reconnected()` is a no-op in all four -- the Reaction gets recreated on next `render()`.

### Reactivity System
- `Reaction.create()` runs the callback immediately (firstRun), then re-runs it whenever any Signal/Dependency accessed during the callback changes.
- Reactions are scheduled through `Scheduler` using `queueMicrotask`. Pending reactions are batched and flushed together.
- `Reaction.guard()` creates an intermediary dependency that only triggers downstream reactions when the guarded value actually changes (structural equality check).

### Content Rendering Flow for `each`
- `ReactiveEachDirective` uses Lit's `repeat()` directive for keyed rendering. Each item calls `eachCondition.content(templateData, key)` which invokes `renderContent()` on the parent renderer.
- The `key` parameter flows into `LitRenderer.getID()`, meaning each item in an `each` loop gets its own subtree renderer, keyed by AST + item key.

### Content Rendering Flow for `async`
- `ReactiveAsyncDirective` tracks its own state machine (`loading`, `success`, `error`) and a `generation` counter for race condition handling.
- When the expression result changes, it resets state to `loading`, increments generation, and awaits the new promise. Stale resolutions are discarded via generation comparison.
- Content blocks (`content`, `loadingContent`, `errorContent`) each produce a new subtree via `renderContent()`.

### WeakRef Cache Mechanics
- `renderTrees` maps content IDs to `WeakRef<LitRenderer>`. If the child renderer is garbage collected, the `WeakRef.deref()` returns undefined and a new renderer is created.
- The content ID is computed via `hashCode({ ast, key })`. Two invocations with the same AST node and same key will resolve to the same content ID.

## Constraints Identified (Transfer -- rephrased without approach context)

- Content closures passed to directives (e.g., `content: () => this.renderContent(...)`) create new renderer instances each time they are called if the previous one has been garbage collected. There is no guarantee a `WeakRef` will survive between calls.
- The `async` directive resets to `loading` state whenever `handleExpressionResult` is called, which happens on every Reaction re-run. If the directive is recreated, the resolved state (the previously fetched value) is lost.
- The AST nodes used as cache keys are object references. The same template content at the same call site produces the same hash, but identity-based hashing means structurally identical ASTs at different call sites produce different hashes.
- Lit's `AsyncDirective` lifecycle ties directive identity to DOM position. If the parent directive's `setValue()` returns a new `TemplateResult` (from a fresh `renderContent()` call), Lit may create new directive instances for child directives within that template.
- The `each` directive's Reaction calls `renderItems()` on every reactive change, which calls `content(templateData, key)` for every item, invoking `renderContent()` per item per update cycle.
- Subtrees that `inheritsData` receive data updates via `bumpDataVersion()`, which walks all `renderTrees` WeakRefs. If a WeakRef has been collected, the subtree silently drops out of the data propagation tree.

## Hypotheses Formed (Isolate)

- [ISOLATED] Various theories about whether the fix belongs in the renderer caching layer, in the directives' statefulness, or in the reactivity system's Reaction lifecycle.
- [ISOLATED] Consideration of making Reactions survive directive recreation.
- [ISOLATED] Consideration of making directives stateful across parent re-renders.
- [ISOLATED] Debate about cache invalidation strategies.

## Approaches Attempted (Isolate -- constraints extracted above)

- [ISOLATED] Multiple directions explored (renderer caching, directive statefulness, Reaction survival). The relevant constraints discovered through this exploration are captured in the "Constraints" section above.
- [ISOLATED] The branch name `feat/cache-subtrees` and the `useSubtreeCache` static flag suggest a caching-oriented direction was being explored.

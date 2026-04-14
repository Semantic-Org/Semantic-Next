# Native Renderer: Block Extraction

## Curriculum — Read Before Starting

### Native engine (what's being refactored)
- `packages/renderer/src/engines/native/renderer.js` — the 1696-line file this plan reshapes
- `packages/renderer/src/engines/native/dynamic-region.js` — region-owning primitive
- `packages/renderer/src/engines/native/reaction-scope.js` — scope-owning primitive
- `packages/renderer/src/engines/native/server.js` — ServerRenderer (touched only for the optional each per-item markers)
- `packages/renderer/src/build-html-string.js` — marker emission, unchanged by this plan
- `packages/renderer/src/expression-evaluator.js` — shared expression evaluation, unchanged

### Lit engine (the shape being mirrored)
- `packages/renderer/src/engines/lit/renderer.js` — 528-line reference for the Renderer's post-refactor shape
- `packages/renderer/src/engines/lit/directives/reactive-conditional.js` — IfBlock reference
- `packages/renderer/src/engines/lit/directives/reactive-each.js` — EachBlock reference (incl. `repeat` + snapshot pattern)
- `packages/renderer/src/engines/lit/directives/reactive-async.js` — AsyncBlock reference (state machine + generation counter)
- `packages/renderer/src/engines/lit/directives/reactive-rerender.js` — RerenderBlock reference (smallest, start here)
- `packages/renderer/src/engines/lit/directives/reactive-data.js` — reactive-data reference (partInfo dispatch)
- `packages/renderer/src/engines/lit/directives/render-template.js` — TemplateBlock reference (Template lifecycle)

### Compiler (AST contract)
- `packages/compiler/src/template-compiler.js:827` — `optimizeAST`, snippet hoisting
- `packages/compiler/src/template-compiler.js` — verify AST node shapes for `if`, `each`, `async`, `rerender`, `template`, `snippet`

### Real-world usage (what the refactor must not break)
- `docs/src/examples/component/todo-list/component.html` — zero-arg snippet
- `docs/src/examples/component/form-builder/component.html` — named-arg snippets, called from each-loop
- `docs/src/examples/component/password-strength/component.html` — named-arg snippets, mixed literal + reactive args
- `docs/src/examples/component/async-search/component.html` — snippets called from async branches
- `docs/src/examples/component/dynamic-table/component.html` — dynamic template name via `{> template name=X data=Y}`

### Framework context
- `ai/skills/mental-model/` — how the framework thinks (load via MCP skill if server running)
- `ai/skills/native-renderer/` — native-renderer specifics (load via MCP skill)
- `ai/guestbook.md` — previous agents' lessons

## The Problem

`packages/renderer/src/engines/native/renderer.js` is 1696 lines because each
template control-flow construct's logic is scattered across five call sites:

| Construct | `createX` (render) | `hydrateX` | `evaluateRawTextNodes` case | `getServerRenderedAST` case | dispatch in `bindBlockDirective` + `hydrateBlockDirective` |
|---|---|---|---|---|---|
| if        | L561 | L1521 | L429 | L1470 | L529, L1404 |
| each      | L611 | L1541 | L448 | (special) | L532, L1439 |
| async     | L771 | L1575 | —    | L1483 | L535, L1442 |
| rerender  | L846 | L1627 | —    | L1485 | L538, L1445 |
| template  | L874 | L949  | L466 | L1487 | L541, L1448 |

Adding a sixth construct means touching six locations. A bug in "if hydration
mismatch" lives 800 lines away from "if render." The Lit engine already solved
this by putting each construct in its own directive file
(`packages/renderer/src/engines/lit/directives/`). Native should mirror that
decomposition — adapted to marker-based hydration instead of Lit's `Part` system.

## Architecture

Three categories, not two:

1. **Renderer** — AST walking, HTML-string assembly, marker plumbing, snippet
   inlining, raw-text walking, data management. Owns no block-specific logic.
2. **Blocks** — self-contained reactive controllers, one per control-flow
   construct. Each owns a `DynamicRegion` between marker anchors, one (or more)
   Reactions via the caller's `ReactionScope`, and knows how to render fresh
   AND hydrate from server-rendered DOM.
3. **Expression bindings** — attribute/text/property/event wiring. Not blocks
   (no opening/closing markers, no owned region), but structured the same way
   as the Lit engine's `reactive-data` directive.

### Why "block," not "directive"

The word "directive" is overloaded across Vue, Angular, Lit, and AngularJS with
four incompatible meanings. The compiler already uses "block" terminology
(`BLOCK_MARKER`, `bindBlockDirective` comments) — the "directive" half was
inherited from Lit's API naming. "Block" matches the template syntax
(`{#each}...{/each}`) and the Handlebars/Blaze lineage of the templating
language.

The Lit engine keeps its `directives/` directory — "directive" is the correct
word there because Lit's public API literally requires wrapping these classes
in `directive()`. Each engine speaks its own dialect; this is a deliberate
asymmetry, documented in CLAUDE.md alongside the rest of the engine contract.

## File structure

```
engines/native/
  renderer.js                   ~350 lines — AST walk + marker plumbing + evaluateTemplate fork + inlineSnippet
  reactive-data.js              expression bindings: attribute + text + property + event + ifDefined + unsafeHTML + raw-text
  dynamic-region.js             (unchanged)
  reaction-scope.js             (unchanged)
  blocks/
    block.js                    ReactiveBlock base class
    registry.js                 Map<node.type, BlockClass>
    conditional.js              IfBlock
    each.js                     EachBlock  (rewritten — see §5)
    async.js                    AsyncBlock
    rerender.js                 RerenderBlock
    template.js                 TemplateBlock — subtemplate lifecycle
```

Five block files. Snippet *invocation* is handled by the Renderer's
`evaluateTemplate` fork (§4); snippet *definition* is compile-time hoisted
by `optimizeAST` in template-compiler.js:872 and never reaches block dispatch.

### Naming ladder

- **Base class:** `ReactiveBlock` — keeps the `Reactive*` prefix Lit uses,
  drops the `Directive` suffix that no longer applies.
- **Subclasses:** `IfBlock`, `EachBlock`, `AsyncBlock`, `RerenderBlock`,
  `TemplateBlock`.
- **File names:** `conditional.js`, `each.js`, `async.js`, `rerender.js`,
  `template.js`. No `reactive-` prefix — `blocks/` already scopes them.
- **Registry key:** matches the AST `node.type` string exactly.

## The ReactiveBlock contract

```js
export class ReactiveBlock {
  static type;  // 'if' | 'each' | 'async' | 'rerender' | 'template'

  constructor({ node, data, scope, region, renderer, isSVG, hydrating = false, serverMeta = null }) {
    Object.assign(this, arguments[0]);
  }

  // Single entry point. Implementations branch internally on this.hydrating.
  // Fresh render: region is empty, create fragment, wire reactions.
  // Hydrating:    region.ownedNodes already populated from server, wire
  //               reactions with firstRun-skip semantics.
  render() { throw new Error('abstract'); }

  // Return the AST the server would have chosen for this block's body.
  // Used by the hydrator to recurse into inner markers BEFORE calling render().
  // Default: no children need recursive hydration (e.g. subtemplate owns its own).
  getServerRenderedAST() { return null; }

  // Evaluate to a plain string for raw-text elements (script/style/textarea/title).
  // Default: block not allowed in raw text. Overridden by if/each/template.
  static evaluateText(node, data, renderer) {
    throw new Error(`${this.type} block not allowed in raw text context`);
  }

  // Helpers available via `this.*` (thin wrappers over renderer/scope):
  //   this.eval(expr)                          — renderer.eval with dataDep registration
  //   this.renderFragment(ast, data, scope)    — renderer.readAST
  //   this.childScope()                        — this.scope.child()
  //   this.reactOn(callback)                   — this.scope.reaction(this.region.anchor, callback)
}
```

**Single `render()` method instead of render + hydrate.** The current code
duplicates every block's logic across `createX` and `hydrateX`. Collapsing them
with an `this.hydrating` flag — mirroring Lit's `isClient` check — matches the
actual difference (skip first DOM write when hydrating) rather than pretending
they're two different algorithms.

## The Renderer's shrunken shape

```js
// Phase 3 marker binding becomes:
bindBlock(comment, entry, data, scope) {
  const BlockClass = registry.get(entry.node.type);
  if (!BlockClass) { return; }
  const region = new DynamicRegion(comment.parentNode, comment);
  new BlockClass({
    node: entry.node, data, scope, region,
    renderer: this, isSVG: entry.isSVG,
  }).render();
}

// Hydration dispatch:
hydrateBlock(comment, entry, data, scope) {
  const { ownedNodes, serverMeta } = this.collectServerRegion(comment);
  const region = new DynamicRegion(comment.parentNode, comment);
  region.ownedNodes = ownedNodes;

  const BlockClass = registry.get(entry.node.type);
  const block = new BlockClass({
    node: entry.node, data, scope, region,
    renderer: this, hydrating: true, serverMeta,
  });

  const innerAST = block.getServerRenderedAST();
  if (innerAST && ownedNodes.length) {
    this.hydrateInnerContent(ownedNodes, innerAST, data, scope.child());
  }
  block.render();
}

// Template fork (snippet vs subtemplate):
evaluateTemplate(node, data, scope, marker, isSVG) {
  const name = this.evaluator.lookupExpressionValue(node.name, data);
  if (this.snippets[name]) {
    this.inlineSnippet({ node, data, scope, marker, name, isSVG });
  } else {
    const region = new DynamicRegion(marker.parentNode, marker);
    new TemplateBlock({ node, data, scope, region, renderer: this, isSVG }).render();
  }
}

// Raw-text walker dispatches via static evaluateText:
evaluateRawTextNodes(nodes, data) {
  let result = '';
  for (const node of nodes) {
    if (node.type === 'html') { result += node.html; continue; }
    if (node.type === 'expression') { result += String(this.eval(node.value, data) ?? ''); continue; }
    const BlockClass = registry.get(node.type);
    if (BlockClass) { result += BlockClass.evaluateText(node, data, this); }
  }
  return result;
}
```

## Snippets stay on the Renderer

Real-world usage (from `docs/src/examples/component/`):

| Example | Call | Pattern |
|---|---|---|
| todo-list | `{>footer}` | Zero args, full parent inheritance |
| password-strength | `{>rule label="..." met=hasLength}` | Named args, plus inherited helpers |
| form-builder (inside `{#each field in schema}`) | `{>textInput field=field}` | Called from each-loop context, forwards loop var |
| async-search (inside `{#async}`) | `{>message type='loading'}` | Called from async-success context |

The data context at the snippet call site is:

```
caller's data at the call site (may itself be a loop/async/nested-snippet context)
  ∪ node.data           (static args, evaluated once with Reaction.nonreactive)
  ∪ node.reactiveData   (reactive args, re-evaluated per access)
// args win on key collision
```

The current `createSnippet` (renderer.js:1083) implements this with a `Proxy`
over the caller's data. The Proxy is **load-bearing for reactivity**: when
snippet body code reads a reactive arg, the getter calls
`evaluator.lookupExpressionValue(expr, callerData)` *from inside the caller's
Reaction* — so `hasLength` becomes a tracked dependency of that Reaction.
Replace the Proxy with a plain `{ ...parent, ...args }` spread and reactivity
silently breaks.

**Why snippets are not a block:**
- No `DynamicRegion` — the marker is replaced by the fragment inline.
- No reaction — reactivity propagates through the caller's scope via the
  Proxy. A change to `hasLength` fires the per-binding reactions inside the
  expanded snippet body; the snippet itself never re-inlines.
- No lifecycle — the snippet is a compile-time macro plus a runtime data
  extension, closer to Blaze's `{{> partial}}` than to a subtemplate.

Keep `createSnippet` as `inlineSnippet` on the Renderer (~60 lines unchanged).
It mirrors Lit's `evaluateSnippet` — inline expansion, no directive wrapper.

### Edge case: dynamic template names

`{> template name=rowTemplate data=row}` (dynamic-table:11) resolves the
template name from a data expression. Today `TemplateBlock` will run its
reaction and switch between subtemplates as `rowTemplate` changes. If
`rowTemplate` could resolve to a snippet name on one tick and a subtemplate
name on another, the fork in `evaluateTemplate` runs once at bind time and
wouldn't handle the switch. No existing example does this; Blaze didn't allow
it. Document as "name expression must resolve consistently to one kind."

## reactive-data.js

Single module handling all expression-position bindings — the native analog of
`packages/renderer/src/engines/lit/directives/reactive-data.js`. Dispatches by
marker classification (`entry.classification.type`, already computed during
`buildHTMLString`):

| classification | current location (renderer.js) | behavior |
|---|---|---|
| `property` | bindAttributeExpression L234-244 | `element[prop] = value` |
| `event` | bindAttributeExpression L246-257 | `addEventListener` + dispose |
| `attribute` (single expr) | bindAttributeExpression L263-292 | `setAttribute` + `checked`/`selected`/`value` property sync |
| `attribute` (interpolated) | bindAttributeExpression L293-316 | concat parts, `setAttribute` |
| `boolean` / `ifDefined` | bindAttributeExpression L261-278 | `removeAttribute` when falsy |
| text (safe) | bindTextExpression L508-515 | reactive text node |
| text (`unsafeHTML`) | bindTextExpression L487-502 | parse HTML, replace owned nodes |
| text (`literalValue`) | bindTextExpression L503-507 | static text node, no reaction |
| rawText | bindRawTextContent L392-408 + evaluateRawTextNodes | textContent from AST walk |

The hydration path (`skipFirstWrite`) becomes an instance flag. The
`evaluateRawTextNodes` function moves to the Renderer as a thin walker that
dispatches to block `evaluateText` statics plus handles `html` and `expression`
nodes directly (since those are just this module's concern).

Expected size: ~140 lines. Extraction is mechanical — no behavior changes.

## EachBlock rewrite

`createEach` (renderer.js:611) has accreted several workarounds to get tests
to pass. The directive extraction is a good moment to normalize.

### Seven things to fix

**1. Dual update path.** Lines 664–679:
```js
if (entry.item !== item || entry.index !== i) {
  entry.itemSignal.set(eachData);
}
else if (typeof item === 'object') {
  entry.itemSignal.notify();  // same reference, mutated in place
}
```
Root cause: `Signal.set()` with deep-equality short-circuits when `a === b`
even if `a.foo` changed. Fix in the Signal layer (add `force: true` option) or
always call `.set()` with a fresh `eachData` wrapper object (the `eachData`
itself is always freshly constructed by `getEachData`, so `set()` sees a new
object identity on every update and the deep-equality check can't
short-circuit). One path, no branching.

**2. Parallel collections.** `itemMap: Map<key, entry>` + `currentKeys: string[]`
must stay synchronized across insertions, moves, removals, else transitions.
Replace with a single ordered `ItemRecord[]` and derive key-to-record lookups
on demand. The array is the source of truth; position in the array is the
render order.

**3. Heuristic keying fragility.** `getItemID` chains
`_id || id || key || hash || _hash || value || index` — matches the Lit
engine but is genuinely fragile. Add explicit key syntax:
`{#each item in list key=item.slug}`. Parse into `node.keyExpression`.
Fall through to the heuristic when no explicit key provided. Both engines
pick this up identically.

**4. Proxy metadata leakage.** `__isItemProxy` (L718-727) exists only so
`unpackNodeData` can branch on whether item reactivity should be wrapped in
`Reaction.nonreactive`. Remove the flag. Instead, carry an explicit
`isItemContext: true` on `ItemRecord` and have `TemplateBlock.unpackNodeData`
check that directly — no proxy-metadata side channel.

**5. Hydration bypass.** `hydrateEach` (L1549) currently does
`if (comp.firstRun) return` — no claiming of server-rendered per-item DOM,
and any data change nukes the server DOM and re-renders from scratch.

Real parity: the ServerRenderer emits per-item boundary markers
(`<!--sui-each-item:0-->...<!--/sui-each-item:0-->`). On hydration, walk the
server-rendered region, split into per-item sub-regions, claim each into an
`ItemRecord.region` with its own itemSignal and scope. Subsequent reactions
reuse, move, or dispose individual records instead of the whole list.

This is the biggest change in the rewrite. It has a dependency on the
ServerRenderer also emitting item markers — gate the work behind a flag if
that change lands separately.

**6. Else-content branching via flag.** `showingElse` (L616) + scattered
`region.clear()` calls. Model else-content as an empty `ItemRecord[]` with a
singleton else-region rendered when length is 0. One render path handles
"render each record's content into its region"; else-content is a special
record with pre-bound content. Eliminates the boolean state machine.

**7. `createItemDataProxy` (L715) is fine — keep it.** The Proxy pattern is
necessary for the same reasons as snippets: parent-data fallthrough +
item-Signal reactivity in a single namespace. Just drop the `__isItemProxy`
marker per (4).

Expected size after rewrite: ~250 lines, one render loop, one update path,
one data structure, honest hydration.

## Dead code to delete alongside the extraction

- `case 'snippet'` in `bindBlockDirective` (L551). Snippet definitions are
  hoisted by `optimizeAST` and registered in the constructor via
  `collectSnippets`. This branch is unreachable for well-formed compiled ASTs.
- `getServerRenderedAST` central switch (L1468). Becomes per-block method;
  central switch goes away.
- Duplicate branches in `evaluateRawTextNodes` (L429, L448, L466). Become
  per-block static `evaluateText` methods.

## Sequencing

Each step is a standalone commit keeping tests green.

1. **Extract `ReactiveBlock` base + registry + directory skeleton.** Convert
   `RerenderBlock` first — smallest construct (~60 lines), proves the shape
   end-to-end with minimal hydration risk. Delete old `createRerender`/
   `hydrateRerender` methods.

2. **Convert `IfBlock`.** Validates branch-index / mismatch-detection flow
   and the `getServerRenderedAST` contract. Move `getBranch` to this file.
   Exposes `IfBlock.evaluateText` for raw-text walker.

3. **Convert `AsyncBlock`.** Pure state-machine, no per-item DOM subtleties.
   Move `createSuccessDataContext` here.

4. **Extract `reactive-data.js`.** Collapses three native methods
   (`bindAttributeExpression`, `bindTextExpression`, `bindRawTextContent`) +
   their hydration duplicates. Biggest line-count win by itself.

5. **Rewrite `EachBlock`.** Seven normalizations above. Own helpers
   (`getItemID`, `getEachData`, `clearAllItems`, `createItemDataProxy`,
   `getCollectionType`) move here — remove from Renderer.

6. **Convert `TemplateBlock`.** Consolidate `createSubtemplate` +
   `hydrateSubtemplate` (`~200 lines` down to `~180`). Own `unpackNodeData`.
   Keep `inlineSnippet` on Renderer (renamed from `createSnippet`).

7. **Delete the raw-text switch** in Renderer; replace with static-dispatch
   walker through registry. Dead-code cleanup.

After step 7 the native `renderer.js` should land near 350 lines, mirroring
the shape of `lit/renderer.js` (528 lines) but with hydration plumbing
instead of Lit's `html` tagged-template layer.

## Risks and deferred decisions

- **Circular imports.** Block files import `ReactiveBlock` from `block.js`;
  `registry.js` imports all block classes; Renderer imports `registry.js`.
  Blocks must NOT import `Renderer` — they receive it via context. Standard
  dependency inversion; no load-order surprises expected.

- **Per-item server markers for each hydration.** Gated behind a
  ServerRenderer change that may not land in the same PR. If not, step 5
  ships with the current "nuke and re-render on first data change"
  hydration for each blocks (annotated as TODO), preserving current behavior.

- **Block disposal symmetry with Lit.** Lit directives have
  `disconnected()` / `reconnected()`. Native's lifecycle is driven by
  `ReactionScope.dispose` + `DynamicRegion.clear`, which run block cleanup
  via `scope.onDispose`. No additional lifecycle hooks needed — blocks
  register disposers at construction time.

- **Subtree caching.** Lit has `renderTrees` + `WeakRef` subtree caching.
  Native caches the parsed HTML template in `templateCache` (renderer.js:37)
  but has no subtree-level cache. Out of scope for this plan; noted for
  future work.

- **User-extensible blocks.** The registry structure makes third-party
  blocks possible in principle (`register({ type: 'myBlock', class: ... })`),
  but the compiler must also recognize the syntax. Out of scope.

## Non-goals

- No AST format changes (beyond optional `node.keyExpression` for each).
- No ServerRenderer changes in the same PR as the refactor (gating item
  markers behind a separate change).
- No changes to `build-html-string.js`.
- No changes to `ExpressionEvaluator`.
- No changes to the Lit engine (stays on `directives/` terminology).

## Verification

### After every step in the sequence
1. `cd packages/renderer && npx vitest run` — all renderer tests must pass
   (currently ~721 browser + unit tests).
2. `cd packages/component && npx vitest run` — all component tests must pass.
3. Reload `/test-ssr/hydrated` in Chrome MCP. Type into the search box;
   confirm filtering works without content duplication and icons persist.
   This is the hydration regression target — the each-block rewrite (step 5)
   and the reactive-data extraction (step 4) are the highest risk here.
4. `/test-ssr/ladder` — 44 automated regression steps for SSR/hydration.

### After the EachBlock rewrite (step 5) specifically
1. `packages/renderer/test/browser/subtree-each.test.js` — the each-specific
   test file, inspect passing count before and after.
2. Run the todo-list example end-to-end: add items, toggle items, remove
   items, filter by all/active/completed. This exercises key transitions,
   in-place mutation (`Signal.notify()` path in the current code), and
   else-content rendering.
3. Run the form-builder example: confirm snippets invoked inside each
   loops still inherit the loop's `field` correctly.
4. Run the dynamic-table example: confirm dynamic template names still work.

### For per-item hydration markers (if that change lands in this PR)
1. Inspect `renderToString` output for a component with an each block —
   confirm per-item boundary markers are emitted.
2. Confirm hydration walks them and does NOT re-render the list on first
   data change (regression from current "nuke and re-render" behavior).
3. Confirm data mutations AFTER hydration still move/add/remove individual
   items rather than triggering full-list re-render.

### Line-count target
Post-refactor `renderer.js` should land under 400 lines. The
Renderer-plus-blocks total will be roughly unchanged (splitting, not deleting)
— the win is colocation, not line count.

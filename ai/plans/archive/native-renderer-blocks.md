# Native Renderer: Block Decomposition

> Coauthored merge of `native-renderer-blocks-architecture.md` (shape, error
> machinery) and `native-renderer-blocks-extraction.md` (sequencing, each-block
> surgery, verification discipline). Both predecessor plans stay in place for
> reference while this one drives execution.

## Goal

Decompose the native renderer's 1696-line monolith (`packages/renderer/src/engines/native/renderer.js`) into per-block modules using a `defineBlock` pattern that mirrors `defineComponent`. Each construct (`if`, `each`, `async`, `rerender`, `template`) becomes a self-contained lifecycle with explicit `render` / `hydrate` / `update` / `destroy` hooks.

Land two things in the same PR:

1. **Structural decomposition** — `bindBlockDirective` / `hydrateBlockDirective` collapse into a single registry dispatch; every block's logic lives in one file instead of scattered across five call sites.
2. **Block-level agentic error feedback loop** — every hook body is wrapped in try/catch; throws emit a structured, grep-friendly log; blocks can define an `error` hook for custom recovery. Sized for the v1 minimum that makes agent iteration possible, with the emitter shaped so `report()`, evaluator resolution-trails, and dedup can be layered on without re-threading.

## Terminology

The paired-syntax constructs (`{#if}`, `{#each}`, `{#async}`, `{#rerender}`, `{>template}`, `{#snippet}`) are called **blocks** throughout. Matches the compiler's existing `BLOCK_MARKER` / `bindBlockDirective` naming and the template syntax (`{#each}…{/each}`). The Lit engine keeps `directives/` because Lit's public API requires wrapping in `directive()` — deliberate asymmetry.

## Curriculum — Read Before Starting

### Native engine (what's being refactored)
- `packages/renderer/src/engines/native/renderer.js` — the 1696-line file this plan reshapes
- `packages/renderer/src/engines/native/dynamic-region.js` — region primitive, unchanged
- `packages/renderer/src/engines/native/reaction-scope.js` — scope primitive, needs third-arg context (see §Infrastructure)
- `packages/renderer/src/engines/native/server.js` — ServerRenderer; gains per-item `each` markers (§EachBlock)
- `packages/renderer/src/build-html-string.js` — marker emission, unchanged
- `packages/renderer/src/expression-evaluator.js` — shared evaluator, unchanged

### Lit engine (reference shape)
- `packages/renderer/src/engines/lit/renderer.js` — 528-line target shape for the post-refactor Renderer
- `packages/renderer/src/engines/lit/directives/reactive-rerender.js` — smallest; reaction context to mirror (lines 31-36)
- `packages/renderer/src/engines/lit/directives/reactive-conditional.js` — IfBlock reference; reaction context (lines 23-26)
- `packages/renderer/src/engines/lit/directives/reactive-each.js` — EachBlock reference (keyed repeat + snapshot pattern)
- `packages/renderer/src/engines/lit/directives/reactive-async.js` — AsyncBlock reference (state machine + generation counter)
- `packages/renderer/src/engines/lit/directives/render-template.js` — TemplateBlock reference (Template lifecycle + addContext usage)
- `packages/renderer/src/engines/lit/directives/reactive-data.js` — reactive-data reference (partInfo dispatch)

### Compiler (AST contract)
- `packages/compiler/src/template-compiler.js:827` — `optimizeAST`, snippet hoisting
- Verify AST node shapes for `if`, `each`, `async`, `rerender`, `template`, `snippet` in the same file

### Real-world usage (must not break)
- `docs/src/examples/component/todo-list/component.html` — zero-arg snippet
- `docs/src/examples/component/form-builder/component.html` — named-arg snippets invoked from each-loop
- `docs/src/examples/component/password-strength/component.html` — named-arg snippets, mixed literal + reactive args
- `docs/src/examples/component/async-search/component.html` — snippets invoked from async branches
- `docs/src/examples/component/dynamic-table/component.html` — dynamic template name via `{> template name=X data=Y}`

### Framework context (load via MCP)
- `mental-model` skill — framework thinking
- `native-renderer` skill — pipeline, markers, reactivity wiring
- `ssr-principles` skill — DSD, hydration, marker versioning
- `testing` skill (`ai/skills/contributing/testing.md`) — **required before starting step 1**; covers the three test environments (unit/dom/browser), how to target a single package's suite, `Reaction.flush()` discipline for reactivity assertions, and `await el.updateComplete` for component rendering. The stable-checkpoint discipline in §Verification depends on knowing which environment each affected test lives in
- `agent-lessons` skill — distilled traps from prior agents
- `ai/guestbook.md` — freeform notes

## The Problem

Each block's logic is smeared across five call sites in `renderer.js`:

| Construct | `createX` (render) | `hydrateX` | `evaluateRawTextNodes` case | `getServerRenderedAST` case | dispatch in `bindBlockDirective` + `hydrateBlockDirective` |
|---|---|---|---|---|---|
| if        | L561 | L1521 | L429 | L1470 | L529, L1404 |
| each      | L611 | L1541 | L448 | (special) | L532, L1439 |
| async     | L771 | L1575 | —    | L1483 | L535, L1442 |
| rerender  | L846 | L1627 | —    | L1485 | L538, L1445 |
| template  | L874 | L949  | L466 | L1487 | L541, L1448 |

Adding a sixth construct means touching six locations. A bug in "if hydration mismatch" lives 800 lines away from "if render." The Lit engine already solved this with one file per construct — native should mirror the decomposition, adapted to marker-based hydration instead of Lit's Part system.

Secondary problem: the native blocks today drop the `{ message, block, node }` reaction context that the Lit directives set (see rerender.js:31, conditional.js:23). This is a tracing regression — `defineBlock` restores it automatically.

Tertiary problem: the each-block's hydration does `if (comp.firstRun) return` — no claim of server-rendered per-item DOM, any data change nukes and re-renders from scratch. The plan fixes this.

## The `defineBlock` Contract

Parallels `defineComponent` — single function call, config object, named lifecycle hooks. Each hook receives the same destructured context; take what you need.

```js
export default defineBlock({
  name: 'conditional',

  create({ node }) {
    return { branchIndex: -1 };
  },

  render({ self, node, scope, region, lookupExpression, renderAST }) {
    const result = self.getBranch();
    self.branchIndex = result.matchIndex;
    if (result.contentAST) {
      const branchScope = scope.child();
      region.setContent(renderAST({ ast: result.contentAST, scope: branchScope }), branchScope);
    }
  },

  hydrate({ self, node, serverMeta, lookupExpression }) {
    self.branchIndex = serverMeta?.branchIndex ?? -1;
    lookupExpression(node.condition); // register dependencies, trust server DOM
  },

  update({ self, node, scope, region, lookupExpression, renderAST }) {
    const result = self.getBranch();
    if (result.matchIndex !== self.branchIndex) {
      self.branchIndex = result.matchIndex;
      if (result.contentAST) {
        const branchScope = scope.child();
        region.setContent(renderAST({ ast: result.contentAST, scope: branchScope }), branchScope);
      }
      else {
        region.clear();
      }
    }
  },

  destroy({ region }) {
    region.clear();
  },

  error({ err, region }) {
    region.clear();
  },

  // Static sibling: produces a string for raw-text contexts (script/style/textarea/title).
  // Optional — only blocks legal inside raw-text need to implement it (if, each, template).
  // Receives dispatch-level context: no region, no reaction, no self.
  evaluateText({ node, data, renderer }) {
    // return string
  },
});
```

**Statics vs lifecycle hooks.** `evaluateText` is a static — attached to the config object alongside lifecycle hooks but called outside the reaction, outside the region, and outside the block's lifecycle. The raw-text walker (see §Renderer's Post-Refactor Shape) dispatches to it via `registry.get(node.type).evaluateText({...})`. Blocks that aren't legal in raw-text (`async`, `rerender`) omit it; the walker errors if it encounters a block type without the static.

### Lifecycle hooks

| Hook | When | Inside Reaction | Purpose |
|------|------|-----------------|---------|
| `create(ctx)` | Once, before mount | No | Return `self` — per-instance state |
| `render(ctx)` | First Reaction run, fresh mount | Yes | Build initial DOM from AST |
| `hydrate(ctx)` | First Reaction run, server content present | Yes | Adopt existing DOM, register dependencies |
| `update(ctx)` | Subsequent Reaction runs | Yes | React to signal changes |
| `destroy(ctx)` | Scope disposal | No | Cleanup beyond `region.clear()` if needed |
| `error(ctx)` | Any hook throws | No | Optional custom recovery; omit to default-clear |

**`create` receives the dispatch-level 8-key context, not the author 9-key bag.** It's the renderer-internal-access seam for blocks like `TemplateBlock` — see §Context bag for the asymmetry.

**`update` is explicit per block; no silent fallback to `render`.** Re-running `render` on an update happens to work for rerender, but for if/each/async the update path is genuinely different from the fresh-mount path. Forcing authors to write `update` makes that asymmetry visible.

### Context bag (two-level model)

There are two context shapes. Block authors only see the author-facing bag; the dispatch-level bag is `defineBlock` internals.

**Dispatch-level context (8 keys)** — what the renderer passes to the function returned by `defineBlock`:

```
node, data, scope, region, isSVG, serverMeta, hydrating, renderer
```

`defineBlock` uses this to build closures over `renderer` — `lookupExpression(node)` and `renderAST({ ast, scope, data })` become bound functions capturing the renderer without exposing it. No `blockDispatch` or `entryId`: blocks only come from compiled AST and always go through `renderAST` / `hydrateInnerContent`, so they never need lower-level registry access or raw entry numbering. If real block code surfaces an awkward case during implementation, the bag can grow — starting minimal.

**`renderAST` signature note.** Destructured per §Signature Convention: `renderAST({ ast, scope, data } = {})`. If `data` is omitted, the closure falls back to the hook's dispatch-time `data` that `defineBlock` captured when it built the closure. Almost every block calls `renderAST({ ast: branchContent, scope: branchScope })` and lets the closure resolve — conditional branches, async success/error/loading branches, rerender content all share the block's parent data. `EachBlock` is the exception: each item renders with its own item-proxy data (the proxy layers item-Signal reactivity over parent data, per §EachBlock fix 6), passed as the `data` field. No signature extension beyond the optional override is needed — the item-proxy pattern handles the per-scope-data case without bag plumbing.

**Author-facing hook context (9 keys)** — what each hook actually receives:

```
node, data, scope, region, isSVG, serverMeta, self,
lookupExpression, renderAST
```

`error` additionally receives `{ hook, err }` — which hook threw and the caught exception.

**`create()` is the exception.** It runs once before any reaction, outside the 9-key contract, and receives the dispatch-level bag. This is the seam for blocks that need renderer internals (`TemplateBlock` uses it to stash `renderer.subTemplates` into `self`; everything else ignores the extra keys):

```js
export default defineBlock({
  name: 'template',
  create({ renderer }) {
    return { subTemplates: renderer.subTemplates, snippets: renderer.snippets };
  },
  render({ self, node, data, ... }) {
    // use self.subTemplates — 9-key bag stays honest
  },
});
```

This keeps the reactive-hook surface at nine keys honestly while giving `create` the seam it needs. `ReactionScope` does not grow a `.renderer` field; the dispatch-level object carries it for `defineBlock` internals only.

**Intentionally excluded from the author-facing bag and why.** Earlier drafts exposed `evaluate`/`lookupToken` (raw, non-dep-tracking lookups), `reportBlockError` (the structured-log emitter), `notifyUpdate` (manual `onUpdated` fire), and `subTemplates`/`snippets`/`template` (renderer internals). Removed for v1:

- **Raw lookups** — `lookupExpression` wraps the evaluator and always registers a dataDep when the renderer is in data-receiving mode (see `renderer.js:121-125`). The conservative default is correct for reactive hooks; non-reactive hooks (`create`/`destroy`/`error`) don't care. The legitimate raw-lookup cases (event-handler function refs, dynamic template names) live in `reactive-data.js` and `template.js` and can reach `scope.renderer.evaluator` directly. No need to publicize the escape hatch on the bag.
- **`reportBlockError`** — auto-fires from the try/catch wrapper inside `define-block.js`. Block authors never call it.
- **`notifyUpdate`** — signals are the notification primitive; `signal.set()` is the mechanism. Async's `.then` stores promise state on `self` and sets a signal → reaction reruns → `update()` fires normally. If a force-rerun-without-signal case ever surfaces, `reaction.invalidate()` is the escape hatch without a public API commitment.
- **`subTemplates` / `snippets` / `template`** — the template block needs these, stashes them into `self` via its `create()` hook (which receives the dispatch-level context with `renderer`). Subsequent hooks read from `self.subTemplates` etc. See step 7. `scope.renderer.*` remains the fallback if a block ever needs renderer internals beyond `create`'s one-shot window, but the stash-in-`self` pattern is the chosen access shape.

### Signal dependency registration

Reads inside any reaction-bound hook (`render` / `hydrate` / `update`) register dependencies that cause future `update` calls. Standard Tracker semantics. Non-reactive hooks (`create`, `destroy`, `error`) run outside the reaction and reads there don't register deps — use `self` for persistent state, not signal reads in `create`.

### Infrastructure (`define-block.js`)

`defineBlock` returns a function the renderer calls with the marker + context. That function:

1. Creates `DynamicRegion` from the marker (or adopts one passed by the renderer for hydration)
2. Calls `create()` with the **dispatch-level context** (8 keys) to build `self`. This is the only hook that sees `renderer`; it's the designated seam for renderer-internal capture (TemplateBlock, etc.)
3. Builds the **author-facing 9-key bag** — closes `lookupExpression` and `renderAST` over the renderer from the dispatch-level context; strips `renderer` and `hydrating` before the bag goes to hooks
4. Wires a `scope.reaction` with auto-set context — `{ message, block: definition.name, node }` — and `setTrace()`. First run → `render()` or `hydrate()` depending on `region.ownedNodes.length`. Subsequent runs → `update()`
5. Wires `scope.onDispose` → `destroy()`
6. Wraps every hook call in try/catch. On throw: emit structured log via the internal `reportBlockError` emitter; call `error(ctx)` if defined, else default-clear; hydrate-throw specifically falls through to `render()` because server DOM is untrustworthy if `hydrate()` threw
7. After any successfully-returning DOM-writing hook (`render` / `update` / `hydrate`), schedule a microtask to fire the template's `onUpdated` lifecycle callback. This replaces the old `notifyUpdate` API — `onUpdated` fires automatically once per successful hook run, coalesced across the microtask boundary. Blocks never call it explicitly.

The block author never touches `scope.reaction`, `DynamicRegion`, `comp.firstRun`, `Reaction.setContext`, try/catch, or `onUpdated` scheduling. Reference for abstraction shape: `packages/renderer/src/engines/lit/directives/render-template.js` — hand-written Lit directive with clean method decomposition; strip the lit-specific glue (AsyncDirective, partInfo, setValue) and substitute `DynamicRegion` / `ReactionScope`.

### `ReactionScope` signature change

`packages/renderer/src/engines/native/reaction-scope.js:16` currently passes no context to `Reaction.create`. Adds a third-arg context object so `defineBlock` can auto-wire `{ message, block, node }`:

```js
reaction(node, callback, context) {
  this.track(Reaction.create((comp) => { ... }, { context }));
}
```

Minor API addition; called out here so it isn't a surprise mid-refactor.

## Error Machinery (v1 — agentic feedback loop)

Block-level errors are the forcing function: an agent authoring a component needs actionable signal when something fails at runtime. AST handles compile errors; this machinery handles runtime throws.

### What v1 commits to

**1. Try/catch wrapping every hook.** No per-block boilerplate. On throw, control routes through a single `reportBlockError` emitter.

**2. Structured log on throw.** One emitter, one format, written so agents can parse without heuristics:

```
🔴 conditional  {#if user.profile.name}
  Cannot read properties of undefined (reading 'name')
  hook: render
  ▸ stack
```

- **block name + node syntax** — orients the agent in one line
- **error message** — the JS error itself
- **hook name** — which lifecycle step failed
- **collapsed stack** — `console.groupCollapsed`, framework frames filtered

**3. `error` hook for custom recovery.** Block defines `error({ err, hook, region, ... })` to own the failure UI. Default if not defined: clear the region and continue. Async block uses this to render its `{error as e}` branch — not a new code path, just where the existing behavior lives post-refactor.

**4. Hydrate-throw fallthrough.** Hydrate-throw is the one exception to the "any throw disposes the reaction" rule in (5). If `hydrate()` throws, server DOM is untrustworthy — the infrastructure clears the region and calls `render()` *within the same reaction*. Whatever `render()` does then governs the reaction's fate: success → reaction continues normally with render semantics; throw → (5) applies and the reaction disposes. Logged either way, so the mismatch is visible. Above-the-fold blocks briefly flash empty during the clear-then-render; this is intentional for v1 — hydrate-throw is an error path that we *want* visible in dev, and adding DocumentFragment-swap infra inside the already-broken code path is the wrong place for complexity. If production cases force an atomic swap later, it's a localized change.

**5. Reaction disposal on render/update throw.** When `render()` or `update()` throws and no `error` hook is defined, the region clears and **the reaction is disposed** — intentionally. The corollary matters: disposal applies regardless of whether dependencies registered before the throw. If `render` threw before registering deps, no subsequent signal change would have fired `update` anyway. If `render` threw *after* registering some deps, disposing prevents a signal-change → `update()` → throw-again retry loop. Either way, terminal state is "block is empty, reaction is stopped, structured log captured the failure." A block that can't render shouldn't silently retry-loop on every tick; the agent iterates from the log, not from accidental recovery. If the block author wants recovery semantics, they define an `error` hook that owns the decision — swallow and leave the reaction live, or clear and let disposal proceed. Hydrate-throw specifically does *not* dispose the reaction (see 4); the render() fallthrough gets the same chance any fresh-mount render gets.

**6. Reaction context auto-wired.** `{ message: <block-identifier>, block: definition.name, node }` restores the regression from the Lit engine. Free once `defineBlock` owns the `scope.reaction` call.

**7. Non-reactive hooks (`create`, `destroy`, `error` itself).**

- **`create` throws** → block never mounts. Log the failure, skip reaction setup entirely, leave the region empty. Critically: do *not* fall through to `render()` the way hydrate-throw does. Without `self`, `render` would throw immediately and loop. The structured log is the terminal state; the agent iterates from there.
- **`destroy` throws** → log and continue. The scope is being disposed regardless — there's nothing constructive to do differently. Avoid re-throwing out of disposal since it can strand sibling blocks mid-teardown.
- **`error` itself throws** → log + swallow in production, re-throw in development for visibility. This is the re-throw escalation policy noted in §Risks. The block's own `error` hook is the last line of defense; if it fails, the framework stops trying.

### What v1 deliberately defers (but architecture leaves room for)

- **`report(field, expression, message, opts)`** — block-author-facing reporter for edge cases the compiler can't catch (e.g., `{#each}` hitting a non-iterable). Emitter is shaped as a single entry point now; adding a yellow-severity public `report()` later is a facade over the same pipeline, no re-threading.
- **Evaluator resolution-trail capture** — the "aha" block in Plan B (`user → ok`, `user.profile → undefined ← failed here`). Requires modifying `getDeepDataValue` in `expression-evaluator.js:311-345` to capture `{ segment, resolved }` pairs on failure. Out of scope here; lands as a follow-up that enriches the existing emitter output.
- **Per-(block, field, expression) dedup** — necessary once `report()` ships but not before.
- **Programmatic log channel** — structured subscription for test harnesses. Keep the log format forward-compatible so a future channel emits the same record.

### Design constraint

The log emitter is a single function `reportBlockError(block, node, hook, err)` inside `define-block.js`. V1 outputs the four-line format above. V2 additions (resolution trail, `report()` facade, dedup) extend this one function rather than introducing parallel pipelines. Dev-only (`isDevelopment`-guarded), tree-shakes in prod.

## Hydration: Block-Owned Subtree Walks

Today's `hydrateBlockDirective` pre-computes `getServerRenderedAST` and recurses into `hydrateInnerContent` *before* dispatch — keeping block structure in the renderer.

The cleaner answer is the reverse: each block's `hydrate` hook walks its own subtree. The renderer's job is identifying marker boundaries and handing the owned DOM to the block via `region.ownedNodes` and `serverMeta`. Everything past that boundary is block-owned.

Cost: the inner-marker walking pattern appears in each block's `hydrate` rather than once in the renderer. Mitigated by a shared `hydrateInnerContent({ ownedNodes, innerAST, data, scope })` helper exported from `define-block.js` (tightly coupled to the dispatch + marker-collection flow — belongs with the infra, not a sibling file) that any hydrate hook calls when it needs to recurse into nested content.

Renderer's remaining hydration responsibility:

```js
hydrateBlock({ comment, entry, data, scope }) {
  const block = registry.get(entry.node.type);
  if (!block) { return; }
  const { ownedNodes, serverMeta } = this.collectServerRegion(comment);
  const region = new DynamicRegion(comment.parentNode, comment);
  region.ownedNodes = ownedNodes;
  block({ node: entry.node, data, scope, region, renderer: this, isSVG: entry.isSVG, serverMeta, hydrating: true });
}
```

DOM walking stays in the renderer; reactive reconstruction + inner recursion moves to the block.

## Snippets Are Not Blocks

`createSnippet` (renderer.js:1083) has no `DynamicRegion`, no reaction, no lifecycle — it's a dispatcher-map mutation plus a data-Proxy plus `readAST`. Forcing it into the hook contract adds boilerplate for nothing.

Snippets live alongside blocks in `blocks/snippet.js` but export a plain function, not a `defineBlock` call. The `{#snippet}` definition site is hoisted by `optimizeAST` (compiler) and registered in the renderer constructor via `collectSnippets`. Invocation sites (`{>name}`) go through the template dispatch (see below).

**Data-Proxy reactivity is load-bearing.** Prior agents have broken this silently. When snippet body code reads a reactive arg, the Proxy's getter calls `evaluator.lookupExpressionValue(expr, callerData)` *from inside the caller's Reaction* — so `hasLength` becomes a tracked dependency of that Reaction. Replacing the Proxy with `{ ...parent, ...args }` silently breaks reactivity. Keep the Proxy.

Template dispatch (snippet vs subtemplate) lives on the renderer:

```js
evaluateTemplate({ node, data, scope, marker, isSVG }) {
  const name = this.evaluator.lookupExpressionValue(node.name, data);
  if (this.snippets[name]) {
    this.inlineSnippet({ node, data, scope, marker, name, isSVG });
    return;
  }
  const templateBlock = registry.get('template');
  const region = new DynamicRegion(marker.parentNode, marker);
  templateBlock({ node, data, scope, region, renderer: this, isSVG, hydrating: false });
}
```

**Edge case: dynamic template names.** `{> template name=rowTemplate data=row}` (dynamic-table:11) resolves the name reactively. Today `TemplateBlock` switches between subtemplates as `rowTemplate` changes. If it could resolve to a snippet on one tick and a subtemplate on another, the fork above runs once at bind time and wouldn't handle the switch. No existing example does this; Blaze didn't allow it. Document as "name must resolve consistently to one kind."

## File Structure

```
packages/renderer/src/engines/native/
  renderer.js                 ~350 lines — AST walk, marker plumbing, template dispatch, inlineSnippet
  define-block.js             defineBlock infrastructure + error emitter + hydrateInnerContent helper
  reactive-data.js            all expression-position bindings (attribute/text/property/event/raw-text)
  dynamic-region.js           (unchanged)
  reaction-scope.js           (third-arg context added)
  server.js                   (per-item each markers added — §EachBlock)
  blocks/
    registry.js               Map<node.type, defineBlock()>
    conditional.js            {#if/elseif/else}
    each.js                   {#each} — rewritten, see §EachBlock
    async.js                  {#async/success/error}
    rerender.js               {#rerender/guard}
    template.js               subtemplate invocation
    snippet.js                inlineSnippet — plain function, not defineBlock
```

Naming ladder:
- **Factory:** `defineBlock({...})`
- **File names:** `conditional.js`, `each.js`, `async.js`, `rerender.js`, `template.js`, `snippet.js` — no `reactive-` prefix, `blocks/` already scopes them
- **Registry key:** matches AST `node.type` string exactly

## reactive-data.js

Single module handling all expression-position bindings — native analog of `packages/renderer/src/engines/lit/directives/reactive-data.js`. Dispatches by `entry.classification.type` (already computed during `buildHTMLString`):

| classification | current location (renderer.js) | behavior |
|---|---|---|
| `property` | bindAttributeExpression L234-244 | `element[prop] = value` |
| `event` | bindAttributeExpression L246-257 | `addEventListener` + dispose |
| `attribute` (single expr) | L263-292 | `setAttribute` + `checked`/`selected`/`value` property sync |
| `attribute` (interpolated) | L293-316 | concat parts, `setAttribute` |
| `boolean` / `ifDefined` | L261-278 | `removeAttribute` when falsy |
| text (safe) | bindTextExpression L508-515 | reactive text node |
| text (`unsafeHTML`) | L487-502 | parse HTML, replace owned nodes |
| text (`literalValue`) | L503-507 | static text node, no reaction |
| rawText | bindRawTextContent L392-408 | textContent from AST walk |

Hydration's `skipFirstWrite` becomes an instance flag on the binding. `evaluateRawTextNodes` becomes a thin walker in the renderer that dispatches to block `evaluateText` statics plus handles `html` and `expression` nodes directly.

**These are not blocks.** No `DynamicRegion`, no opening/closing markers, no owned region. They're inline bindings — kept as plain functions grouped in one module. Runtime failures surface through the evaluator's own error path (future plan); `defineBlock`'s error machinery doesn't apply.

Expected size: ~140 lines. Extraction is mechanical.

## Signature Convention

All renderer internal methods, block dispatch helpers, and hook-facing closures use destructured-object arguments with defaults, not positional args:

```js
// ✗ positional — order-dependent, "what goes where" cognitive load
bindBlock(comment, entry, data, scope) { ... }
renderAST(ast, scope, data) { ... }

// ✓ destructured — self-documenting at call sites, order-independent
bindBlock({ comment, entry, data, scope }) { ... }
renderAST({ ast, scope, data }) { ... }
```

**Provisional pending step-1 benchmark.** The uniform-destructured rule below is the starting position. A tachometer benchmark in step 1 (1000-item each-loop, `renderAST` destructured vs. positional) will validate or force a revision — see §Sequencing step 1 for the decision rule. If the benchmark shows ≥ 3% regression on destructured, this section gets rewritten to name the hot-path-positional principle explicitly; otherwise the rule below stands.

Applies to: `bindBlock`, `hydrateBlock`, `evaluateTemplate`, `evaluateRawTextNodes`, `renderAST`, `hydrateInnerContent`, `reportBlockError`, and any helpers extracted during the refactor. Exceptions:

- **Single-arg functions** (`lookupExpression(node)` from the hook bag) stay positional — destructuring one arg adds noise without removing ambiguity.
- **Hot-path two-arg lookups that mirror ExpressionEvaluator's own signature** — the renderer's internal `lookupExpression(expression, data)` (renamed from `eval()` at `renderer.js:121`) stays 2-arg positional because it mirrors `ExpressionEvaluator.lookupExpressionValue(expression, data)` and is called in tight reactive loops (per-expression, potentially 100× per render). The hook-facing closure is 1-arg; only the internal is 2-arg. This exception is the narrow one — if the step-1 benchmark shows the broader hot-path-positional principle applies, this exception absorbs into the general rule.

Block invocations (`block({ node, data, scope, region, ... })`) already follow this convention; the refactor extends it to the renderer's own surface so the codebase speaks one dialect. Defaults go on the destructure; the default value is whatever the closure captured at dispatch time — see `renderAST`'s signature note under §Context bag.

**`DynamicRegion` exempted.** `dynamic-region.js` is unchanged per §File Structure; its existing 2-arg methods (`setContent(fragment, scope)`, constructor `(parentNode, referenceNode)`) stay positional. Not a convention violation — an explicit carve-out for a primitive that predates this refactor.

**`lookupExpression` name is shared deliberately.** There are two distinct functions under this name: the hook-bag closure `lookupExpression(node)` (1-arg, data captured) and the renderer-internal method `this.lookupExpression(expression, data)` (2-arg, mirrors `ExpressionEvaluator.lookupExpressionValue`). A block author only ever sees the 1-arg closure. A reader grepping the source will find both — vocabulary is shared for consistency with the evaluator; callers see one or the other depending on where they are (inside a hook vs. inside `renderer.js`).

## Renderer's Post-Refactor Shape

```js
// Dispatch collapses to a single path:
bindBlock({ comment, entry, data, scope }) {
  const block = registry.get(entry.node.type);
  if (!block) { return; }
  const region = new DynamicRegion(comment.parentNode, comment);
  block({ node: entry.node, data, scope, region, renderer: this, isSVG: entry.isSVG });
}

hydrateBlock({ comment, entry, data, scope }) {
  const { ownedNodes, serverMeta } = this.collectServerRegion(comment);
  const region = new DynamicRegion(comment.parentNode, comment);
  region.ownedNodes = ownedNodes;
  const block = registry.get(entry.node.type);
  block({ node: entry.node, data, scope, region, renderer: this, serverMeta, hydrating: true });
}

// Raw-text walker dispatches via block evaluateText statics:
evaluateRawTextNodes({ nodes, data }) {
  let result = '';
  for (const node of nodes) {
    if (node.type === 'html') { result += node.html; continue; }
    if (node.type === 'expression') { result += String(this.lookupExpression(node.value, data) ?? ''); continue; }
    const block = registry.get(node.type);
    if (block?.evaluateText) { result += block.evaluateText({ node, data, renderer: this }); }
  }
  return result;
}
```

Post-refactor target: `renderer.js` under 400 lines, mirroring `lit/renderer.js` (528) with hydration plumbing substituted for Lit's `html` tagged-template layer.

**Rename `this.eval()` → `this.lookupExpression()`** on the renderer (currently at `renderer.js:121`). Matches the context-bag accessor name so blocks and renderer internals speak the same vocabulary; also avoids the `window.eval` mental collision. `evaluateRawTextNodes`, `evaluateTemplate`, and `evaluateText` stay — those follow the "evaluate X = produce Y" pattern, not the value-lookup pattern, so no name conflict.

## EachBlock Rewrite

`createEach` (renderer.js:611) has accreted workarounds. The extraction is the moment to normalize. Six fixes in this plan; explicit `key=expression` template syntax is deferred as creep (the heuristic `_id || id || key || hash || _hash || value || index` fallback is SUI-style — it hits the common case without config).

**1. Dual update path.** Lines 664-679:
```js
if (entry.item !== item || entry.index !== i) {
  entry.itemSignal.set(eachData);
}
else if (typeof item === 'object') {
  entry.itemSignal.notify();
}
```
Root cause: `Signal.set()` with deep-equality short-circuits when `a === b` even if `a.foo` changed. Fix: `getEachData` always returns a freshly-constructed wrapper object, so `.set()` sees fresh identity and deep-equality can't short-circuit. One path, no branching.

**2. Parallel collections.** `itemMap: Map<key, entry>` + `currentKeys: string[]` must stay synchronized across insertions, moves, removals, else transitions. Replace with a single ordered `ItemRecord[]`; derive key-lookup on demand. Array is source of truth; position in the array is render order.

**3. `__isItemProxy` metadata leakage.** (L718-727) exists only so `unpackNodeData` can branch on whether item reactivity should be wrapped in `Reaction.nonreactive`. Carry explicit `isItemContext: true` on `ItemRecord` and have `TemplateBlock.unpackNodeData` check that directly. No proxy-metadata side channel.

**4. Hydration bypass.** `hydrateEach` (L1549) does `if (comp.firstRun) return` — no claim of server DOM, any data change nukes and re-renders. Real parity: ServerRenderer emits per-item boundary markers; on hydration, walk the region, split into per-item sub-regions, claim each into an `ItemRecord.region` with its own itemSignal and scope. Subsequent reactions reuse, move, or dispose individual records instead of the whole list. Requires ServerRenderer change (§ServerRenderer below). **Scheduled as the final step of the plan** (step 9) — the other five fixes land in step 6 against the current nuke-and-re-render behavior, then this lands against a stable decomposition.

**5. Else-content branching via flag.** `showingElse` (L616) + scattered `region.clear()` calls. Model else-content as an empty `ItemRecord[]` with a singleton else-region rendered when length is 0. One render path handles "render each record's content into its region"; else-content is a special record with pre-bound content. Eliminates the boolean state machine.

**6. `createItemDataProxy` (L715) stays.** The Proxy pattern is necessary for the same reasons as snippets: parent-data fallthrough + item-Signal reactivity in a single namespace. Just drop the `__isItemProxy` marker per (3).

Expected size post-rewrite: ~250 lines, one render loop, one update path, one data structure, honest hydration.

## ServerRenderer: Per-Item Each Markers

`packages/renderer/src/engines/native/server.js` gains per-item boundary markers inside each blocks so the client can claim per-item DOM instead of nuke-and-rerender.

Marker shape (following the versioned convention from `ssr-principles`):

```
<!--sui-each-item:v1:0-->
  <li>...item 0 content with inner markers...</li>
<!--/sui-each-item:v1:0-->
<!--sui-each-item:v1:1-->
  <li>...item 1 content...</li>
<!--/sui-each-item:v1:1-->
```

Numeric suffix is the item index at render time. Key identity isn't emitted — the client derives it from the item's own data (via the same heuristic chain as fresh render). Mismatch between server index and client key is handled by `EachBlock.hydrate` rebuilding records by key and disposing any that don't match.

**Emission point: `server.js:225-250`, `renderEach()`.** The per-item `for` loop at lines 237-245 calls `this.renderNodes(node.content, itemData)` once per item. Wrap that call:

```js
for (let i = 0; i < items.length; i++) {
  const eachData = this.getEachData(items[i], i, collectionType, node);
  const itemData = { ...data, ...eachData };
  const itemEvaluator = new ExpressionEvaluator({ data: itemData, helpers: this.helpers });
  const savedEvaluator = this.evaluator;
  this.evaluator = itemEvaluator;
  html += `<!--sui-each-item:v1:${i}-->`;           // ← add
  html += this.renderNodes(node.content, itemData);
  html += `<!--/sui-each-item:v1:${i}-->`;          // ← add
  this.evaluator = savedEvaluator;
}
```

Path is cleanly isolated — no entanglement with attribute resolution, marker collection, or inner-hydration recursion. Step 9 effort estimate holds. The `isEmpty(items) && node.elseContent` branch (line 233) doesn't emit per-item markers; else-content hydrates as a single region, consistent with fresh-render's singleton else-region model in §EachBlock fix 5.

Hydration consumer: `EachBlock.hydrate` walks `region.ownedNodes`, scans for `sui-each-item:v1:N` comment pairs, builds one `ItemRecord` per pair, recursively hydrates inner markers within each item via the shared `hydrateInnerContent` helper.

Versioned marker tokens make this a non-breaking change for downstream consumers — old markers keep working while the new shape rolls out.

## Sequencing

Each step is a standalone commit keeping tests green. Per-item server markers + honest each-hydration land **last**, after the rest of the decomposition is stable — that's the riskiest cross-cutting change and the value of landing it against a clean surface is higher than bundling it into the middle.

1. **Scaffold `define-block.js` + registry + directory skeleton + error emitter.** No blocks converted yet. Add the `ReactionScope` third-arg context. Rename the renderer's internal `this.eval()` method (`renderer.js:121`) to `this.lookupExpression()` and update its call sites inside `renderer.js` — doing this in step 1 means the closure `defineBlock` builds for the hook bag already binds the renamed method when blocks start landing in step 2. Adds no behavior beyond the rename; just infrastructure + unit tests for the error emitter shape.

   **Also in step 1: benchmark the signature convention** (see §Signature Convention). Stand up a tachometer micro-benchmark comparing `renderAST({ ast, scope, data })` destructured vs. `renderAST(ast, scope, data)` positional on a 1000-item each-loop stress template. Tachometer's statistical-significance output (`-0.2% ± 0.4%` style readings, not hand-waved "feels fast") drives the decision:

   - **Delta < 1%** → uniform destructured-obj wins on consistency; `lookupExpression`'s carve-out stays narrow ("mirrors `ExpressionEvaluator` signature"), `renderAST` stays destructured.
   - **Delta ≥ 3%** → adopt the hot-path-positional principle: `renderAST` flips to `renderAST(ast, scope, data)`, §Signature Convention gains a named rule ("per-render-iteration internals are positional; once-per-block-instance methods are destructured"). Call sites updated across the plan's sketches and step 2–9 implementations.
   - **1–3%** → judgment call. Default lean: consistency wins (stay destructured), but document the measured overhead in §Signature Convention as acknowledged cost.

   Store the benchmark under `packages/renderer/test/browser/` or a sibling bench directory — use whatever the existing repo pattern is (check `tools/` and other packages for tachometer precedent before inventing a new location). The benchmark stays in the tree post-decision as a regression guard: future refactors that claim to improve renderer perf can re-run it.

2. **Convert `rerender.js` first.** Smallest construct (~60 lines), lowest hydration risk, proves the shape end-to-end. Delete old `createRerender` / `hydrateRerender`.

3. **Convert `conditional.js`.** Validates branch-index / mismatch-detection flow and the inner-hydration pattern via `hydrateInnerContent`. Move `getBranch` here. Expose `evaluateText` static for raw-text walker.

4. **Convert `async.js`.** Pure state-machine, no per-item DOM subtleties. Move `createSuccessDataContext` here. The `error` hook renders the `{error as e}` branch — restructuring, not new behavior.

5. **Extract `reactive-data.js`.** Collapses three native methods (`bindAttributeExpression`, `bindTextExpression`, `bindRawTextContent`) and their hydration duplicates. Biggest line-count win.

6. **Convert `each.js` structurally** — fixes 1, 2, 3, 5, 6 (dual update path, parallel collections, `__isItemProxy` leakage, else-content flag, proxy preservation). Hydration stays on the current "nuke-and-re-render on first data change" behavior, annotated TODO pending step 9. Helpers (`getItemID`, `getEachData`, `clearAllItems`, `createItemDataProxy`, `getCollectionType`) move here. **Intermediate state after this step:** each item gets an `ItemRecord`, but all records share the parent region's ownedNodes — per-item region claiming arrives in step 9 alongside the server markers that make it possible.

7. **Convert `template.js`.** Consolidate `createSubtemplate` + `hydrateSubtemplate`. Own `unpackNodeData`. Keep `inlineSnippet` on Renderer (renamed from `createSnippet`). Template block uses its `create()` hook (dispatch-level context) to stash `renderer.subTemplates` and `renderer.snippets` into `self`; subsequent hooks read them from `self` rather than reaching through `scope`. This is the concrete use of the two-level context model from §Context bag.

8. **Dead-code sweep.** Delete the raw-text switch (replaced by static-dispatch walker via registry). Delete `case 'snippet'` in `bindBlockDirective` (L551) — unreachable for well-formed compiled ASTs. Delete the central `getServerRenderedAST` switch (L1468).

9. **Per-item server markers + honest each-hydration.** ServerRenderer emits `sui-each-item:v1:N` pairs (§ServerRenderer). `EachBlock.hydrate` walks the region, splits into per-item sub-regions, claims each into an `ItemRecord` with its own itemSignal and scope. This is fix 4 from §EachBlock. First-data-change no longer nukes the list; individual items are reused, moved, or disposed. Final commit: decomposition already stable, so a regression here is isolated to the each-hydration path.

## Verification

### Stable-checkpoint discipline

Each numbered step in §Sequencing ends at a **stable checkpoint** — no partial extraction, no unreferenced dead code, tests green. Before marking a step complete, load the `testing` skill (`ai/skills/contributing/testing.md`) and run the test suites listed below. The skill covers the three environments (unit, jsdom, browser) and the repo-specific patterns (`Reaction.flush()` for reactivity assertions, `await el.updateComplete` for component rendering) — don't skip it, the environment distinctions matter for which tests exercise which code paths.

If a checkpoint fails, stop and diagnose before moving to the next step. Do not bundle multiple steps into a single commit — the point of the sequencing is that a regression on step N is isolated to the step N diff.

### After every step
1. `cd packages/renderer && npx vitest run` — all renderer tests pass (currently ~721 browser + unit)
2. `cd packages/component && npx vitest run` — all component tests pass
3. Reload `/test-ssr/hydrated` in Chrome MCP. Type into the search box; confirm filtering works without content duplication and icons persist. Highest-risk regression target for steps 5, 6, 9.
4. `/test-ssr/ladder` — 44 automated regression steps for SSR/hydration

If a step touches a package beyond renderer/component (rare — templating for compiler AST interactions, utils for shared helpers), also run that package's suite. `cd packages/templating && npx vitest run` and `cd packages/utils && npx vitest run` as appropriate.

### After step 4 (async) specifically
- Confirm async error branch still renders by causing a deliberate throw in the async body — verify it routes through the `error` hook and renders the same markup as before

### After step 5 (reactive-data) specifically
- `packages/renderer/test/browser/attribute-bindings.test.js` — count passing before and after
- `subtree-spurious.test.js` — changing one binding doesn't re-evaluate unrelated ones

### After step 6 (each structural refactor) specifically
1. `packages/renderer/test/browser/subtree-each.test.js` — count passing before and after
2. Todo-list end-to-end: add, toggle, remove, filter. Exercises key transitions, in-place mutation, else-content
3. Form-builder: snippets invoked inside each loops still inherit loop's `field`
4. Dynamic-table: dynamic template names still work
5. Hydration still uses nuke-and-rerender behavior (unchanged from pre-refactor) — confirm `/test-ssr/hydrated` ladder passes at the same level as before

### After step 9 (per-item markers + honest hydration) specifically
1. Inspect `renderToString` output for a component with an each block — confirm `sui-each-item:v1:N` boundary markers emitted
2. Confirm hydration does NOT re-render the list on first data change (the regression this step fixes)
3. Confirm post-hydration mutations move/add/remove individual items rather than triggering full-list re-render
4. `/test-ssr/hydrated` with a filtered list — type in search, confirm items reconcile without DOM duplication or icon loss
5. Re-run todo-list and form-builder end-to-end against hydrated output — confirm hydration fidelity matches fresh-render for keyed reconciliation

### Error machinery verification
- Deliberate throws in each hook (render, hydrate, update, destroy) per block type — confirm structured log format, confirm `error` hook invocation when defined, confirm default-clear when not
- Hydrate-throw fallthrough — confirm render() is called to rebuild the region
- Reaction context — confirm `scope.reaction` sets `{ message, block, node }` on every block-owned reaction

### Line-count target
Post-refactor `renderer.js` under 400 lines. Renderer-plus-blocks total roughly unchanged (splitting, not deleting) — the win is colocation and agentic surface, not line count.

## Risks and Deferred Decisions

- **Circular imports.** Block files import `defineBlock` from `define-block.js`; `registry.js` imports all block modules; Renderer imports `registry.js`. Blocks must NOT import Renderer — they receive it via context. Standard dependency inversion; no load-order surprises expected.

- **Per-item server marker compatibility.** The versioned marker scheme (`sui-each-item:v1:N`) lets hydration handle both pre- and post-refactor server outputs during the rollout window. Once fully landed, the compatibility branch can go.

- **Block disposal symmetry with Lit.** Lit directives have `disconnected()` / `reconnected()`. Native's lifecycle runs through `ReactionScope.dispose` + `DynamicRegion.clear`, which call `destroy()` via `scope.onDispose`. No additional lifecycle hooks needed.

- **Re-throw escalation.** When the `error` hook itself throws: log + swallow in prod, re-throw in dev for visibility. Documented behavior of the emitter.

- **`update` default.** Explicitly no default — force authors to write `update` when fresh-mount and subsequent-run differ, which is the common case. Rerender can trivially implement `update` as a reference to `render`.

## Non-Goals

- Explicit `key=expression` template syntax (creep — heuristic fallback stays)
- Evaluator resolution-trail capture (separate plan; emitter leaves room)
- `report()` block-author reporter (separate plan; emitter leaves room)
- Log-channel programmatic subscription (keep format forward-compatible)
- Subtree caching (Lit's `renderTrees` + `WeakRef` pattern; out of scope)
- User-extensible block registration (compiler would also need to recognize the syntax)
- AST format changes
- Lit engine changes (stays on `directives/` terminology)

## Dependencies

None blocking. The ServerRenderer per-item markers land in this same plan (step 9 — see §Sequencing). The `ReactionScope` third-arg is a minor addition, not a breaking change.

## Status

**Scope: `scoped`.** Shape (`defineBlock` hooks, two-level context bag, error emitter), sequencing, verification, and the per-item marker emission point (server.js:225-250) are all concrete. Implementation details left to execution: exact `DynamicRegion` signature tweaks if any, exact `hydrateInnerContent` signature, whether the 8-key dispatch bag or 9-key author bag needs additions once real block code puts pressure on them.

## Completion

- **Estimated:** TBD pair (originally listed as Phase 0 plan #0 with no concrete hours).
- **Actual:** Major work landed across two waves — initial decomposition completed 2026-04-12 with perf polish 2026-04-13. Per-item server markers + hydration adoption (step 9) shipped as part of the hydration-perf-pass (~5h45m wall clock per that plan's archive note).
- **Completed:** 2026-04-13 (decomposition); 2026-04-15 (per-item adoption).

### Shipped per spec

- `define-block.js` with try/catch error machinery, structured `reportBlockError`, hydrate-throw fallthrough, reaction disposal on render/update throw, optional `error` hook
- `blocks/registry.js` + side-effect imports from `blocks/index.js`
- `reactive-data.js` — all expression-position bindings extracted
- All 5 blocks in their own files: `rerender.js`, `conditional.js`, `async.js`, `each.js`, `template.js`
- `lookupExpression` rename from `eval()`
- `ReactionScope` 3rd-arg context support (`{ message, block, node }`)
- Per-item `sui-item:v1:KEY` markers in `server.js`
- `adoptServerItems` first-data-change DOM reuse path in `each.js`
- `sample.js` — reference template for agents authoring new blocks (not in original plan; intentional addition)

### Plan-vs-reality drift

- `renderer.js` line count: target was under 400 lines; landed at 718 after subsequent perf work (Plan 04 `data-sui-bind` fast path, `cachedBuildHTMLString` WeakMap, single-pass walker). The wins justify the lines.
- Step-1 signature-convention benchmark (`renderAST` destructured vs. positional, intended as a regression guard): no benchmark file present in the tree. Decision was made (current code uses destructured), but the regression guard didn't land.
- `hydrateInnerContent` placement: plan said "exported from `define-block.js`"; reality routes through `Renderer.hydrateInnerContent` with `define-block.js` exposing a closure. Equivalent functionality, different file home.

### Deferred — extracted to follow-up plans

- **Resolution trail capture** in `getDeepDataValue` + public `report()` API → [Block Runtime Diagnostics](../icebox/block-runtime-diagnostics.md) (icebox).
- **Explicit `key=expression` syntax** for `{#each}` → [Explicit Each Keys](../each-explicit-keys.md) (active; day-1 defensibility for users whose data doesn't match the heuristic chain).

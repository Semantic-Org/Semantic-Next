# Native Renderer Directive Architecture — Viability Critique

Evaluates `ai/plans/native-renderer-directives.md` against the current state of the native renderer source.

Source line counts (current):

- `packages/renderer/src/engines/native/renderer.js` — **1696 lines**
- `packages/renderer/src/engines/native/server.js` — 382 lines
- `packages/renderer/src/engines/native/dynamic-region.js` — 46 lines
- `packages/renderer/src/engines/native/reaction-scope.js` — 51 lines

---

## Q1 — Infrastructure fit

**Verdict: partially viable.** The `DynamicRegion` + `ReactionScope` abstractions exist and are used consistently at directive entry points, but per-directive state is currently held in free-standing `let` closures inside each `create*` method — not in a structured "self" object — and several directives reach through the renderer (`this.snippets`, `this.subTemplates`, `this.template`, `this.notifyUpdate`, `this.dataDep`, `this.evaluator`) in ways the plan doesn't acknowledge.

### `DynamicRegion` usage is regular

Every block directive begins with `new DynamicRegion(parentNode, marker)`:

- conditional — `renderer.js:563`
- each — `renderer.js:612`
- async — `renderer.js:772`
- rerender — `renderer.js:847`
- subtemplate — `renderer.js:875`

Snippet is the exception — `createSnippet` does **not** create a `DynamicRegion`, it just replaces the marker with the rendered fragment (`renderer.js:1144`). The plan's lifecycle model (create/render/update/destroy backed by a region) does not naturally fit snippets, because snippets have no reactive lifecycle and no owned DOM region — they're a pure compile-time expansion performed at render time. See Q5 and Q8.

### `scope.reaction(node, cb)` is the canonical wiring pattern

`ReactionScope.reaction` (`reaction-scope.js:16-24`) wraps `Reaction.create` with the `!node.isConnected → stop()` guard and tracks the reaction for disposal. All five reactive directives call `scope.reaction(region.anchor, comp => …)` (e.g. `renderer.js:569, 623, 790, 854, 880`). That's the hook the plan's `defineBranch` would own.

### Per-directive state is not cleanly "self"-shaped

The plan's `self` abstraction assumes per-instance state lives in a returned object. Today state lives in closure-captured `let` bindings:

- conditional: `let currentBranchIndex = -1` (`renderer.js:565`)
- each: `const itemMap = new Map(); let currentKeys = []; let showingElse = false` (`renderer.js:614-616`)
- async: `let generation = 0; let hasResolved = false; let resolvedValue = null` (`renderer.js:775-777`)
- subtemplate: `let currentTemplateID = null; let currentInstance = null` (`renderer.js:877-878`), plus the same pair captured *again* in the hydration reaction (`renderer.js:1042-1044`)

Moving these into a `self` object is mechanical and safe — they're already per-instance. The plan glosses over this translation but the work is small.

### Coupling to renderer state the plan understates

Directives routinely call back into the renderer:

- `this.readAST({ ast, data, scope, isSVG })` — the branch/item/state sub-render path. Called from conditional (`renderer.js:576`), each (`renderer.js:633, 698, 1567`), async (`renderer.js:781`), rerender (`renderer.js:851, 864`), snippet (`renderer.js:1136`), and from hydration paths at `renderer.js:1425, 1531, 1555, 1567, 1584, 1638`. The plan correctly exposes `renderAST` in the ctx bag, so this is acknowledged.
- `this.eval(expr, data)` and `this.evaluator.lookupExpressionValue/lookupTokenValue` — conditional, each, async, rerender, subtemplate, snippet all use these.
- `this.snippets` (mutable, shared across the renderer lifetime) — `bindBlockDirective` writes to it when it sees a top-level snippet (`renderer.js:552`); `createSnippet` reads from it (`renderer.js:1084`); `hydrateBlockDirective` reads from it when dispatching inside a `template` node (`renderer.js:1450, 1489`); even `buildHTMLStringPure` is called with `{ snippets: this.snippets }` (`renderer.js:172, 1220, 1500`). A per-directive module would need to mutate this same shared map, which is fine if it's passed in but means the plan's `snippets` ctx field has to be the *live* renderer map, not a copy.
- `this.dataDep.depend()` — subtemplate's reactions call this to stay live to `bumpDataVersion()` (`renderer.js:881, 1020`). Plan lists `dataDep` in ctx. OK.
- `this.template` (the owning `Template` instance) — subtemplate's `create*` branches rely on `this.template.element`, `this.template.element.renderRoot`, `this.template?.setElement/setParent/attach`. See `renderer.js:917-933, 1009-1016, 1057-1063`. Plan exposes `template` in ctx. OK.
- `this.notifyUpdate()` — async calls this after promise resolution to signal `onUpdated` (`renderer.js:807, 813, 1607, 1613`). Plan exposes `notifyUpdate` in ctx. OK.
- `this.receivesData` — read inside `eval()` at `renderer.js:122`; the behaviour that "top-level component renderers skip dataDep.depend()" would have to move with `eval`.

None of these are showstoppers — the plan's destructured ctx model accommodates them — but the plan's phrasing that "each directive is a self-contained lifecycle" (native-renderer-directives.md:204) understates how much renderer state each ctx must expose.

---

## Q2 — Hydration collapse

**Verdict: partially viable.** Collapsing `bindBlockDirective` and `hydrateBlockDirective` into a single dispatch is feasible — but the current hydration path does materially more than "pre-collect ownedNodes and serverMeta before dispatching," and the plan glosses over at least four concrete asymmetries that the renderer currently solves before calling the per-type handler.

### Today's split

- Client render entry: `bindBlockDirective` at `renderer.js:522-555` — marker-in, switch on `node.type`, call `createConditional/createEach/createAsync/createRerender/createSnippet/createSubtemplate`. For `snippet` nodes it just assigns to `this.snippets` (`renderer.js:552`) without rendering anything.
- Hydration entry: `hydrateBlockDirective` at `renderer.js:1351-1466` — collects owned nodes between open/close markers, parses `serverMeta` from the closing marker's `:bN` suffix, creates a `DynamicRegion` seeded with those owned nodes, recursively hydrates inner markers, then dispatches to `hydrateConditional/hydrateEach/hydrateAsync/hydrateRerender/hydrateSubtemplate`.

### What the plan omits

**1. Inner-content hydration runs *before* dispatch.** At `renderer.js:1390-1402`, `hydrateBlockDirective` calls `getServerRenderedAST(node, data)` to figure out *which* AST branch was rendered server-side (e.g. which branch of an `{#if}` or which branch of `{#async}` — `loadingContent`), then runs `hydrateInnerContent(ownedNodes, contentAST, data, innerScope)` (`renderer.js:1499-1519`), which recursively calls `hydrateMarkers(...)` on the sub-AST. This is *not* just DOM walking — it requires re-evaluating the condition/branch to pick the right sub-AST. For `each`, `getServerRenderedAST` deliberately returns `null` and the per-item hydration logic is bypassed entirely (`hydrateEach` at `renderer.js:1544-1573` re-renders instead of hydrating per-item). The plan's "renderer pre-collects ownedNodes and serverMeta before dispatching" description misses that the renderer currently *also* decides the inner-AST and hydrates it before the block handler runs — a non-trivial decision that lives *in the block type's semantics*.

**2. `if` hydration includes a mismatch check.** `renderer.js:1404-1437` compares `serverMeta.branchIndex` against the client's evaluation of the condition, warns in dev, and pre-re-renders the client branch into the region *before* delegating to `hydrateConditional`. That logic is conditional-specific and would move into `conditional.hydrate()`.

**3. `template` hydration has two branches.** `renderer.js:1448-1464` — if the name resolves to a snippet, it calls `hydrateRerender` with a *synthesized* node (`{...node, content: snippets[templateName].content, expression: null, key: null}`), otherwise calls `hydrateSubtemplate` with the original ownedNodes. This subtemplate-vs-snippet fork currently lives in the dispatcher, not the directive. To move it into the directive, `template` needs a hydrate hook that internally dispatches to one of two paths. Plan lists `subtemplate.js` and `snippet.js` as separate modules — neither file houses the dispatch decision.

**4. `hydrateSubtemplate` (renderer.js:949-1077) and `createSubtemplate` (renderer.js:874-947) are not parallel.** The hydrate version has a *full duplicate* of the reactive logic — it inlines its own Reaction, re-resolves templates, handles template-id switches, and calls `clear()/render()` on template changes (`renderer.js:1019-1069`). That duplicated ~50 lines is the reason subtemplate is 130+ lines today. Collapsing them is a real simplification, but the plan's ~160 LOC estimate for `subtemplate.js` assumes the duplication disappears (see Q6).

**5. Subtemplate hydration mutates `region.ownedNodes` twice.** At `renderer.js:982-1005`, after hydration the code drains `ownedNodes` into a fragment, reinserts, and re-scans the DOM to refresh `region.ownedNodes`. That fix-up is needed because the DocumentFragment-shuffle used for TreeWalker hydration empties the list. Any per-directive hydrate hook that touches DOM layout needs this bookkeeping.

### Net

The collapse is achievable but it's not a 1:1 rename. Minimum real work: (a) move `getServerRenderedAST` dispatch into each directive's `hydrate`; (b) move `if`'s mismatch check into `conditional.hydrate`; (c) move the template vs snippet fork into a `template` directive; (d) dedupe `create` / `hydrate` reactive bodies where they duplicate logic. None impossible, all underestimated by the plan.

---

## Q3 — Renderer residual responsibilities

**Verdict: partially viable.** The plan's list of "what stays in renderer" (native-renderer-directives.md:198-203) is broadly right but omits six concrete responsibilities that don't live in any directive and don't fit the residual description.

### What the plan *does* name

- `readAST` / `parseHTML` / `buildHTMLString` — all present (`renderer.js:150-199`)
- `parseAttributeParts` / `bindAttributeExpression` — present (`renderer.js:206-317`)
- `bindTextExpression` / `hydrateTextExpression` — present (`renderer.js:483-516, 1279-1349`)
- `hydrateMarkers` / `hydrateAttributes` — present (`renderer.js:1151-1277`)
- data management (`setData`, `updateData`, `bumpDataVersion`) — present (`renderer.js:1680-1695`)

### What the plan omits

**1. `bindRawTextContent` and `evaluateRawTextNodes`.** `renderer.js:392-477`. ~85 lines handling content inside `<script>/<style>/<textarea>/<title>` where comment markers cannot exist. `evaluateRawTextNodes` is a recursive evaluator that duplicates directive logic (if/each/template) in a text-only form (`renderer.js:414-477`). This is neither a directive nor covered by the plan's "text/attr bindings" bucket. It has no hydration counterpart — the server renders these elements directly.

**2. `collectSnippets`.** `renderer.js:110-116`. Walks top-level AST at construction time to populate `this.snippets`. Has to stay in the renderer *and* also be mutated mid-render when `bindBlockDirective` encounters a top-level snippet (`renderer.js:552`). Plan's snippet module doesn't own this.

**3. `createItemDataProxy`.** `renderer.js:715-730`. Renderer-level helper used by both `createEach` and `hydrateEach`. Should move into the `each` directive (it's only used by each) — plan implies this by giving each its own module, but doesn't explicitly place it.

**4. `getCollectionType`, `getItemID`, `getEachData`, `clearAllItems`.** `renderer.js:732-765`. Same — each-specific helpers on the renderer class. Naturally move with the directive.

**5. `getBranch`.** `renderer.js:586-605`. Conditional-specific helper. Used from both `createConditional` (`renderer.js:570`) and `hydrateConditional` (`renderer.js:1522, 1526`) and by `hydrateBlockDirective` itself for the mismatch check (`renderer.js:1407`). Moving this into the conditional module is fine *unless* the mismatch check stays in the dispatcher, in which case the renderer residual has a cross-directive dependency.

**6. `createSuccessDataContext`.** `renderer.js:825-840`. Async-specific. Moves with async.

**7. `unpackNodeData`.** `renderer.js:1648-1674`. Subtemplate-specific. Notable behavior: it special-cases `data.__isItemProxy` to skip `Reaction.nonreactive()` — meaning subtemplate data-unpacking has a subtle coupling to each's item proxy. If these end up in separate files, the marker flag must remain. Moves with subtemplate.

**8. `getServerRenderedAST`.** `renderer.js:1468-1497`. Central to hydration dispatch — answers "given a block node and current data, which AST did the server emit?" with per-type branching (if/async/rerender/template/else). This is inherently cross-directive because it's a dispatch-time decision *before* the directive runs. If the plan moves dispatch into directives, this method has to either (a) fragment into each directive's hydrate hook, or (b) stay as a renderer residual — but then the renderer still knows directive internals.

**9. Shared mutable state: `this.snippets`, `this.updateScheduled/notifyUpdate`, `this.dataDep`, `this.evaluator`.** All have to stay in renderer as the lifecycle owner.

**10. The entry-point `readAST`'s three-phase choreography.** `renderer.js:150-165` — build HTML, parse HTML, then `bindMarkers` — and the near-identical `hydrateMarkers` flow both live in the renderer. Plan notes `parseHTML` and `AST walk` stay; be explicit that the three-phase construction of output is core renderer work and not splittable.

### Orphaned behaviours most likely to catch the refactor off-guard

- Raw text evaluation duplicates directive semantics in a non-reactive form.
- `hydrateAttributes` (renderer.js:1217-1277) builds a *reference DOM* from the AST's htmlString just to find attribute positions on real-DOM elements, using parallel TreeWalkers and a block-owned-elements skip set. ~60 lines. Heavy, and invisible from directive code — but has to receive the right `ast` parameter for nested inner hydrations (`renderer.js:1220`).
- `hydrateInnerContent` (renderer.js:1499-1519) reshuffles ownedNodes through a DocumentFragment to run TreeWalker-based hydration — post-hydration it drains back. Any directive's hydrate path that wants to hydrate its content must coordinate with this.

---

## Q4 — Reactivity tracing regression claim

**Verdict: viable (plan's claim is correct).** The native renderer does not pass `context` to any of its `Reaction.create` calls, and `ReactionScope.reaction` — the wrapper every directive uses — never accepts or forwards a `context`. The lit renderer uniformly sets reactions up with a context object. The plan's regression claim is accurate.

### Lit-side context on every directive reaction

- `reactive-conditional.js:23-26, 44` — `Reaction.create(…, { context })` with `{ message: 'if/else statement: {#if …}', conditional }`
- `reactive-each.js:29-36, 51` — `{ context: { message: 'reactive each: …', each: node } }`
- `reactive-async.js:36-39, 58` — `{ context: { message: 'async block: …', async: condition } }`
- `reactive-rerender.js:31-36, 59` — `{ context: { message: 'rerender block: …', rerender: condition } }`
- `reactive-data.js:50-64` — `{ context: { message: 'expression: {…}', expression } }`
- `render-template.js:70-74` — calls `reaction.addContext({ message: '…', dataContext, template })` mid-run (not at creation)

### Native-side: context omitted at every directive reaction

The only `Reaction.create` call in the native renderer is inside `reaction-scope.js:17`:

```js
this.track(Reaction.create((comp) => { … callback(comp) }));
```

No options argument, no context. And the helper `scope.reaction(node, cb)` that every directive uses (conditional `renderer.js:569`, each `renderer.js:623`, async `renderer.js:790`, rerender `renderer.js:854`, subtemplate `renderer.js:880, 1019`, hydrateConditional `renderer.js:1525`, hydrateEach `renderer.js:1544`, hydrateAsync `renderer.js:1592`, hydrateRerender `renderer.js:1628`, attribute/text bindings `renderer.js:237, 247-253, 264, 294, 405, 491, 511, 1299, 1340`) has no path to pass a context through — it's a fixed two-arg API (`reaction-scope.js:16`).

The plan's fix — `defineBranch` auto-sets `{ message, directive: name, node }` on reaction creation and calls `setTrace()` (native-renderer-directives.md:100-113) — is feasible and directly restores the lit behaviour. `Reaction.setContext` and `setTrace` exist and are dev-only (`reaction.js:25-48`), so the cost is zero in prod.

One small gap: `ReactionScope.reaction` would need a new third argument (or the directive wiring would have to bypass the scope helper) to plumb context. That's a trivial change but worth calling out — today the helper is strictly `(node, callback)`.

---

## Q5 — Cross-directive coordination

**Verdict: partially viable.** Most directives are self-contained, but there are four real cross-cutting couplings the plan's isolated-module model has to accommodate.

### 1. Snippets: shared mutable map on the renderer

`this.snippets` is a shared dictionary populated from three places:

- Constructor: `collectSnippets(this.ast)` at `renderer.js:74/110-116`
- Dispatch: `case 'snippet': this.snippets[node.name] = node;` at `renderer.js:551-553` — mid-render, when a snippet definition is encountered at block-dispatch time
- Read sites: `renderer.js:468, 543, 1084, 1450, 1489, 1500` (includes use inside `buildHTMLStringPure`)

The plan proposes a `snippet.js` module, but the *definition* collection is dispatch-time, not render-time. If the plan's `defineBranch` is only called when a marker comment is walked, then `{#snippet name}` definitions (which render to no DOM and are typically hoisted by the compiler to the top of the AST) would still need dispatcher-level handling. This is minor — either `snippet.js` owns both define-and-render paths, or the dispatcher keeps a special case.

### 2. Subtemplate reading snippet map for snippet-name resolution

`bindBlockDirective` at `renderer.js:541-549` peeks at `this.snippets[templateName]` to decide between `createSnippet` and `createSubtemplate`. `hydrateBlockDirective` at `renderer.js:1449-1463` does the same, dispatching differently. Directive modules would need either a shared `template` directive that internally forks, or the dispatcher retains this fork (plan doesn't explicitly address this).

### 3. Each ↔ subtemplate item-proxy coupling

`createItemDataProxy` (`renderer.js:715-730`) attaches `__isItemProxy` to the data object it creates. `unpackNodeData` in subtemplate (`renderer.js:1660-1662`) special-cases this flag to decide whether to wrap data evaluation in `Reaction.nonreactive()`:

```js
templateData[key] = data.__isItemProxy
  ? this.evaluator.lookupExpressionValue(expr, data)
  : Reaction.nonreactive(() => this.evaluator.lookupExpressionValue(expr, data));
```

This means subtemplate's behaviour changes based on whether its parent is inside an each block. The plan's isolated-module model works only if this symbol-level contract is preserved. Not a showstopper, but worth naming as an implicit cross-directive API.

### 4. Hydration dispatch decides inner-AST per directive type

`getServerRenderedAST` (`renderer.js:1468-1497`) embeds cross-directive knowledge: the renderer has to know that `async` renders `loadingContent` on the server, that `if` returns the matched branch's content, that `rerender` renders `content`, that `template` forks on snippet vs subtemplate, and that `each` has no inner-AST (per-item data means no single AST was rendered). If each directive owns its own hydrate path and its own inner-AST discovery, this function fragments — and the renderer residual shrinks accordingly. OK, but the plan doesn't name this.

### 5. Async's second reaction

Async creates a reactive reaction *and* registers `.then`/`.catch` callbacks on the promise that call `renderState()` outside any reaction (`renderer.js:802-815, 1602-1615`). Those callbacks are not inside a Reaction — they trigger a fresh child-scope render and call `this.notifyUpdate()`. The plan's lifecycle model (hooks inside a Reaction) has to accommodate async callbacks that fire *outside* the reaction cycle. See Q8.

### Not a real coordination issue: rendering inside `{>subtemplate}`

The brief's example case — `{#each}` rendering inside `{>subtemplate}` — actually works fine today because each renders by calling `readAST` recursively, which walks the nested AST from scratch; there's no cross-directive state handoff. Good.

---

## Q6 — LOC estimate plausibility

**Verdict: not viable as described — most estimates are 30–50% low.**

Current file is **1696 lines** (not 1700, close enough). Plan's breakdown: renderer 400 + define-branch 40 + conditional 60 + each 150 + async 80 + rerender 40 + subtemplate 160 + snippet 60 = **990**.

Even naively, that implies ~700 lines of net reduction from refactoring alone (no functional change). That is a big claim. Let's check each piece against the current code.

### Reality of current directive LOC (including helpers that have to move with each directive)

Measuring includes only *that directive's* body + helpers that no other directive uses:

**Conditional — current total ~50 lines**, plan 60.

- `createConditional` `renderer.js:561-584` — 24 lines
- `hydrateConditional` `renderer.js:1521-1539` — 19 lines
- `getBranch` `renderer.js:586-605` — 20 lines

Collapsing create + hydrate into one path (plan's promise) trims maybe 10 lines. **Plan estimate is plausible.**

**Each — current total ~220 lines**, plan 150.

- `createEach` `renderer.js:611-713` — 103 lines (the biggest single body in the file)
- `hydrateEach` `renderer.js:1541-1573` — 33 lines
- `createItemDataProxy` `renderer.js:715-730` — 16 lines
- `getCollectionType`/`getItemID`/`getEachData`/`clearAllItems` `renderer.js:732-765` — 34 lines
- `evaluateRawTextNodes`'s each-case is separate (raw text owns its own mini-evaluator)

Collapse buys maybe 20 lines. Add lifecycle boilerplate (create/render/update/destroy/error skeleton — 4 hooks of ~3 lines each = 12 lines of scaffolding). **Plan estimate of 150 is low by ~40 lines.** Realistic: ~190–200.

**Async — current total ~105 lines**, plan 80.

- `createAsync` `renderer.js:771-823` — 53 lines
- `hydrateAsync` `renderer.js:1575-1625` — 51 lines
- `createSuccessDataContext` `renderer.js:825-840` — 16 lines

The two versions share a lot (the `renderState` helper and the `.then/.catch` pattern). Collapse might save 25–30 lines. **Plan estimate of 80 is aggressive but in range** — call it 85-95.

**Rerender — current total ~45 lines**, plan 40.

- `createRerender` `renderer.js:846-868` — 23 lines
- `hydrateRerender` `renderer.js:1627-1642` — 16 lines

Collapse is cheap here because the logic is small. **Plan estimate of 40 is plausible.** Maybe 35.

**Subtemplate — current total ~200 lines**, plan 160.

- `createSubtemplate` `renderer.js:874-947` — 74 lines
- `hydrateSubtemplate` `renderer.js:949-1077` — 129 lines
- `unpackNodeData` `renderer.js:1648-1674` — 27 lines

The hydrate version *duplicates* the create version's reactive body (see Q2). Real collapse potential: ~50 lines. **Plan estimate of 160 is about right** — realistic ~150-170.

**Snippet — current total ~65 lines**, plan 60.

- `createSnippet` `renderer.js:1083-1145` — 63 lines
- No hydrate path (snippets just inline their content)

Snippet has no reactive Reaction, no DynamicRegion. It doesn't fit `defineBranch` naturally (see Q8). **Plan estimate of 60 is fine in byte count** but the file won't be a normal directive shape.

**define-branch** — plan 30-40. The plan's description (native-renderer-directives.md:86-94) lists: construct region, build self, wire reaction, wire onDispose, wrap all 6 hooks in try/catch with structured logging, handle hydrate-vs-render dispatch via `region.ownedNodes.length > 0`, emit structured error log, call optional `error` hook. That is at least 70-100 lines once the structured-log formatter is included (directive name, template location, error message, resolution block, stack — native-renderer-directives.md:124-144). **Plan estimate of 30-40 is low by 2-3x.**

### What stays in the renderer

Plan says 400 lines. Let's tally what must remain:

- Constructor/setup: ~55 lines (`renderer.js:53-106`)
- `collectSnippets`: 7 lines
- `eval`, `render`, `readAST`, `buildHTMLString`, `parseHTML`: ~55 lines
- `parseAttributeParts`: ~20 lines
- `bindAttributeExpression`: ~90 lines (`renderer.js:230-317`)
- `bindMarkers`: ~65 lines (`renderer.js:319-382`)
- `bindRawTextContent` + `evaluateRawTextNodes`: ~85 lines (`renderer.js:392-477`)
- `bindTextExpression`: ~35 lines
- `bindBlockDirective` dispatcher (simplified but still exists): ~15 lines
- `hydrateMarkers`: ~65 lines
- `hydrateAttributes`: ~60 lines
- `hydrateTextExpression`: ~70 lines
- `hydrateBlockDirective` dispatcher + ownedNodes/serverMeta collection: ~65 lines
- `getServerRenderedAST`: ~30 lines (if kept in renderer)
- `hydrateInnerContent`: ~20 lines
- `setData`/`updateData`/`bumpDataVersion`: ~15 lines

Total residual: ~750 lines, not 400. Cutting this to 400 would require either (a) moving raw-text logic into a separate file (justifiable — it's self-contained), (b) moving hydration attribute-walking into a separate `hydration.js` helper, and (c) moving text/attribute bindings into their own `bindings.js` file. The plan doesn't propose any of those. **As written, renderer residual of 400 lines is not achievable without additional file splits the plan doesn't name.**

### Aggregate

Plan: 990 lines total.
Realistic:

- renderer: ~700 (not 400, absent additional splits)
- define-branch: ~90 (not 30-40)
- conditional: ~50
- each: ~195
- async: ~90
- rerender: ~35
- subtemplate: ~160
- snippet: ~65

**Realistic total ≈ 1385 lines**, a 310-line reduction (~18%), not a 700-line reduction. Directive files themselves are ~685 lines, close to plan's 550 — the bigger miss is (a) the renderer residual and (b) define-branch infrastructure.

---

## Q7 — Error output feasibility

**Verdict: partially viable. Trail capture is cheap; template location is not available.**

### Resolution trail capture

Plan's example:

```
user         → { id: 42 }
user.profile → undefined  ← failed here
```

The evaluator's dotted-path walk is at `expression-evaluator.js:318-352` (plan cites `311-345`; the current lines are 318-352 but the logic is what the plan describes). It walks segment-by-segment via `path.indexOf('.')`, checking for `null/undefined` and bailing at `expression-evaluator.js:341-343`:

```js
if (current == null) {
  return undefined;
}
```

The current hot path does not allocate — it uses `substring` on the raw path string and tracks `start`/`end` indices without arrays. Capturing a `{segment, resolved}` pair *only on failure* would work like this:

1. Branchless hot path: don't record anything on the happy path.
2. On the failure branch (line 341-343), synthesise the trail by re-walking the path and recording each resolved value. That's O(segments) done once on the throw path — doesn't regress the common case.

**Feasible at near-zero hot-path cost** if the capture is lazy-on-failure. The alternative — recording every step inline — would allocate a pair per segment per eval and would absolutely regress the hot path, which handles 80% of template lookups (comment at `expression-evaluator.js:17-24` describes the distribution: ~60% simple identifier, ~20% dotted path).

But: currently `getDeepDataValue` *returns* `undefined` on the null-branch — it doesn't throw. The actual throw happens further down the stack where user code runs (e.g. `{user.profile.name}` where `user.profile` is `undefined` and a user-level template expression then accesses `.name` via `with(ctx){}`). The trail capture would have to happen in `lookupTokenValue` at `expression-evaluator.js:273-316` or higher, and the "failed here" annotation has to land wherever the JS engine threw. That's doable but takes more thought than the plan's "capture on failure" phrasing implies.

### Template location (`ui-card.html:14:3`)

**Not available.** I searched for source location tracking in the compiler and AST. There is none:

- `packages/compiler/src/template-compiler.js` — node `position` field exists (`template-compiler.js:879-883`) but it's only an ordering index for disambiguating duplicate template calls, not a source line/col.
- No `line`, `col`, `loc`, `location`, `startLine`, `endLine`, or `sourceLocation` fields on AST nodes. The only line-number resolution is in `packages/compiler/src/string-scanner.js:182-196`, which computes lines *at parse-error time* from the raw input — not stored in the AST.

So the plan's `ui-card.html:14:3` in the structured log would require:

1. Compiler: attach source location metadata to AST nodes during parsing.
2. Template: retain the source filename on the compiled template.
3. Runtime: plumb that to the reaction context.

This is a non-trivial compiler change outside the plan's "pure refactor of renderer internals" scope (plan:219). The plan already guards with "Only emitted if reliably known" (plan:138), which is good — but setting that expectation means the *most useful* line of the structured log (the "fix site") will be absent from day one.

### Bundle cost

Plan claims `report()` adds ~300-500 bytes min+gz with `isDevelopment` tree-shaking. `isDevelopment` is used throughout — `reaction.js:26, 51, 67` etc — so tree-shaking is plausible if the `report` formatter is gated at the top of the function. No concern here.

### Net

Trail capture is feasible at zero hot-path cost. Template location is a compiler change the plan doesn't own and should not silently assume. If the compiler change is out of scope, the "ui-card.html:14:3" line of the output format needs to be marked optional in the plan, with most errors shipping without it.

---

## Q8 — Any showstoppers?

**Verdict: three real concerns, one fundamental mismatch.**

### 1. Snippets don't fit `defineBranch`

Snippets have no Reaction, no DynamicRegion, no lifecycle. `createSnippet` at `renderer.js:1083-1145`:

- No `DynamicRegion` creation
- No `scope.reaction(...)` wiring
- No `onDispose` handler
- Just builds a data proxy (`renderer.js:1116-1134`), calls `readAST` to render, and replaces the marker with the fragment (`renderer.js:1144`)

A `defineBranch({ create, render, update, destroy })` wrapper is overkill here — there's no `update`, no `destroy`, no reactive run cycle. The plan lists `snippet.js` at ~60 lines but the natural shape is a free function, not a directive. If the plan insists on uniform `defineBranch` shape, snippet's lifecycle hooks become no-ops and its actual logic goes in `create` or a fake `render` — awkward.

Additionally, `{#snippet}` *definition* nodes (vs `{>name}` *use* nodes) are handled at dispatch by `this.snippets[node.name] = node` (`renderer.js:552`) with no region, no render, nothing. That's *really* not a directive.

**Recommendation:** Either carve out snippets as a non-directive helper, or document that `defineBranch`'s lifecycle is optional and snippets only use `render`.

### 2. Async's post-promise render callbacks fire outside the reaction

At `renderer.js:802-815`:

```js
result.then(value => {
  if (currentGen < generation) { return; }
  resolvedValue = value;
  hasResolved = true;
  renderState(node.content, this.createSuccessDataContext(node, value));
  this.notifyUpdate();
}).catch(error => {
  if (currentGen < generation) { return; }
  if (node.errorContent?.length) {
    const errorData = node.errorAs ? { [node.errorAs]: error } : { this: error };
    renderState(node.errorContent, errorData);
    this.notifyUpdate();
  }
});
```

These `.then/.catch` run after the reaction has finished — they're *not* inside `comp` run. They call `renderState` which calls `readAST` and `region.setContent` directly. Questions the plan doesn't answer:

- Does the `try/catch` around hook bodies (native-renderer-directives.md:117-121) cover async promise callbacks? They're not inside a hook — they run after `render()` has returned.
- If a user promise rejects and there's no `errorContent`, the `.catch` silently does nothing. That's correct today but the plan's structured-error machinery has no hook site to emit from.
- The `error` hook (native-renderer-directives.md:71) is meant for *thrown* errors from other hooks. The `{error as e}` branch (native-renderer-directives.md:164) is user-level error UI. Neither handles "async Reaction's hook completed fine, then later the promise rejected with no errorContent." Today this is deliberately silent; the plan should state whether that changes.

### 3. `hydrate()` is conflated with `render()` in the plan, but hydration work is multi-phase

Plan (`native-renderer-directives.md:69-70, 167-177`):

> `hydrate(ctx)` | First Reaction run (server content exists) | Yes | Adopt existing DOM, register dependencies
> … The hydration distinction moves inside: `region.ownedNodes.length > 0` determines whether `hydrate()` or `render()` is called on firstRun.

Today hydration runs *three* phases before even reaching the directive (`renderer.js:1351-1466`):

1. Walk from the opening marker forward to the matching close, collecting `ownedNodes` and parsing `serverMeta` from the close marker.
2. Create a `DynamicRegion` seeded with those nodes.
3. Call `getServerRenderedAST` to figure out the inner AST, then `hydrateInnerContent` to recursively hydrate inner markers.

Only *then* does the directive-specific hydrate handler run. Steps 1-2 are a clean fit for the plan (they're DOM walking before dispatch). Step 3 is the crux — it requires per-type knowledge to know what sub-AST was rendered. If `hydrate(ctx)` runs inside the Reaction with `region.ownedNodes` already seeded, *who* walked the inner markers?

Two options:

- **Renderer walks inner markers before dispatch**: requires `getServerRenderedAST`-equivalent in the renderer, per-type knowledge leaks. Same as today.
- **Each directive's hydrate walks its own inner markers**: per-type knowledge stays in the directive, but each directive now has to call `hydrateMarkers` on its sub-AST, consume the DocumentFragment-shuffle pattern (renderer.js:1499-1519), and re-seed `region.ownedNodes`. Plan doesn't describe this.

The plan's "hydrate collapses" claim (native-renderer-directives.md:170-177) elides this — and this is called out as an *open question* in the plan itself (native-renderer-directives.md:208). So the plan is aware but hasn't decided. Not a showstopper, but an unresolved decision that heavily affects the final LOC split.

### 4. `bindBlockDirective` isn't a single dispatch — it also mutates state

At `renderer.js:551-553`:

```js
case 'snippet':
  this.snippets[node.name] = node;
  break;
```

This isn't a directive render — it's a side effect on the renderer's snippet map. The compiler hoists most snippets (native-renderer-directives.md:110-116) so this case catches late-in-the-AST definitions. The plan's "collapse into one path" elides that `bindBlockDirective` today is *dispatch + mutation + rendering* — not pure dispatch.

---

## Showstoppers

Findings that require material changes to the plan before execution:

### S1 — Renderer residual is ~700 lines, not 400

Plan's 400-line target isn't achievable without additional file splits (raw text evaluation, hydration attribute-walking, bindings) that the plan doesn't propose. Either rewrite the plan to name those additional files, or restate the renderer target at ~700 lines. Current `renderer.js` responsibilities that can't move into directive modules add up to this much. (Q3, Q6)

### S2 — `define-branch.js` is ~90 lines, not 30-40

The plan's infrastructure cost is ~2x what's claimed once try/catch wrapping, structured-log formatting, hydrate-vs-render dispatch, context wiring, and the `report()` helper are implemented. Revise to ~90 lines. (Q6)

### S3 — Template source location is not currently available

The structured log's "ui-card.html:14:3" line depends on AST nodes carrying source locations. The compiler does not attach these today (`template-compiler.js` only sets a `position` ordering index; `string-scanner.js` resolves line numbers at parse-error time, not AST-build time). Either: (a) expand scope to include compiler source-location work, or (b) mark the location line as optional-with-no-initial-support. Plan currently claims the line is "emitted only if reliably known" but doesn't acknowledge it will be *never* known on day one. (Q7)

### S4 — `template` directive fork (subtemplate vs snippet) isn't in the plan

The current dispatcher at `renderer.js:541-549` (client) and `renderer.js:1448-1464` (hydration) forks `{>name}` into snippet-use or subtemplate-use based on `this.snippets[templateName]`. The plan has separate `subtemplate.js` and `snippet.js` files with no coordinating `template.js`. Either the dispatcher retains this fork (and the "pure dispatch" claim softens), or a `template.js` directive owns the fork. The plan should name which. (Q5)

### S5 — Snippets don't fit `defineBranch`

Snippets have no Reaction, no DynamicRegion, no lifecycle hooks. Their runtime is one call to `readAST` plus a marker replacement. Cramming them into the `defineBranch` shape is awkward; either carve out a non-directive path for snippets or document that the lifecycle hooks are fully optional. Additionally, `{#snippet}` *definitions* are currently a map mutation in the dispatcher, not a render operation — the plan doesn't address them. (Q5, Q8)

### S6 — Hydration inner-content walking ownership is unresolved

The plan lists this as an open question but leaves it. It's the single largest architectural decision remaining — it determines whether `getServerRenderedAST` stays centralised (per-type knowledge leaks to renderer) or fragments into each directive's `hydrate` hook (each directive re-implements the DocumentFragment-shuffle pattern). Without resolving this, LOC estimates and module boundaries are not firm. (Q2, Q8)

### S7 — Async's post-resolution render path is outside any reaction hook

`.then/.catch` handlers on user promises call `renderState` directly (`renderer.js:802-815, 1602-1615`). They run outside the reaction body and outside any proposed hook, so neither the `try/catch` wrapping nor the structured error log fires on an unhandled async rejection when there's no `{error as e}` branch. Plan should state whether this path now errors loudly, or remains silent. (Q8)

### S8 — `ReactionScope.reaction` needs an API change for context

Every directive reaction goes through `scope.reaction(node, cb)` (`reaction-scope.js:16-24`), which accepts only `(node, callback)`. Passing the plan's auto-set context requires a third argument (or bypassing the helper). Trivial change, but not listed in the plan. (Q4)

---

## Summary of verdicts

| Question | Verdict |
|---|---|
| Q1 Infrastructure fit | Partially viable |
| Q2 Hydration collapse | Partially viable |
| Q3 Renderer residual | Partially viable |
| Q4 Reactivity tracing regression | Viable (claim correct) |
| Q5 Cross-directive coordination | Partially viable |
| Q6 LOC estimates | Not viable as described |
| Q7 Error output feasibility | Partially viable |
| Q8 Showstoppers | Three concerns + one fundamental mismatch |

The plan's *direction* is sound — the code has genuine duplication, the directives do share a common lifecycle shape, and the reactivity-tracing regression is real. But the LOC math is optimistic, snippets don't fit the model, template source locations don't exist, and several hydration-path decisions remain open. Close to executable after addressing S1-S8.

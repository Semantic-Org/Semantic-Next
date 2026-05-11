# Block Dispatch Unification

> Restore block-position introspection (regression) and fold expression handling into the block model. The framework owns position-aware placement via a `bag.place(content)` primitive; block authors mostly stay position-blind via an optional `compute(bag) → content` shorthand. Crosses the existing "blocks own regions" model line deliberately.
>
> **Status of contents.** Outcome / Why / Constraints sections are *recommendations* — the implementer may challenge them if a better approach surfaces. Verification gates are *fixed* — each step must pass its gate before the next ships.

---

## Model shift to name explicitly

The current model (encoded in `blocks/sample.js`) says: **"a block owns a DOM region. Pure expressions with no region are text-bindings in `reactive-data.js`, not blocks."** That distinction is what kept `expression`/`rawText` out of `defineBlock`.

This refactor crosses that line deliberately. After: **a block is an AST node type with a dispatch lifecycle.** Region presence becomes position-dependent — text-position blocks have `bag.region`, attribute-position blocks have `bag.place` over a `commit` closure with no region. The framework owns the dispatch decision; block authors don't.

Several invariants from the current model survive untouched:
- Two-level context (dispatch ctx → hook bag) stays. `create({ renderer })` is still the seam for stashing renderer internals onto `self`.
- Framework-wired outer Reaction stays. `lookupExpression` reads inside hooks still register on it; `update` still fires on signal change.
- `render` vs `update` vs `hydrate` distinction stays. `hydrate` keeps its distinct contract — adopt server DOM via `hydrateInto`, do NOT call `renderAST`.
- `destroy`, `error`, `shouldRecover`, `syntax`, `evaluateText` stay unchanged.
- Child-scope-per-content-swap stays — `place` does it under the hood instead of each block doing it explicitly.

---

## Outcome

Native dispatches every AST node — `expression`, `rawText`, `if`, `each`, `async`, `rerender`, `template` — through `getBlock(type)(bag)`. Three things change:

1. **`buildHTMLString` classifies every entry.** Block entries (not just expression entries) carry `classification`. Attribute-position blocks emit `__suiN__` and participate in `attributeParts` like attribute-position expressions today. Text-position blocks emit `<!--sui-block:v1:N-->` as today.

2. **Framework owns placement via `bag.place(content)`.** A new framework helper replaces direct `region.setContent(renderAST(...))` calls. `place` is position-aware:
   - text position: allocate child scope, `renderAST(content, childScope)`, `region.setContent(fragment, childScope)` — today's behavior, packaged.
   - attribute position: `renderASTToString(content, data)`, `setAttribute(name, value)` via the `attributeParts` machinery.
   - hydration: register Signal deps via the content evaluation, skip the DOM write (same `skipFirstWrite` contract attribute expressions already honor).

3. **Optional `compute(bag) → content` shorthand on `defineBlock`.** When provided, the framework synthesizes both `render` and `update` as `bag.place(compute(bag))`. Last-value dedup via reference equality is automatic. Block author writes one function instead of two near-identical bodies. `hydrate` stays an explicit hook because hydration's contract is genuinely different (adopt server DOM, not produce content).

Blocks split into shapes after the refactor:

| Shape | Blocks | Body | `reactive` |
|---|---|---|---|
| `compute`-driven, reactive | expression, rawText, conditional, rerender, template (subtemplate + snippet) | `compute(bag) → content` + explicit `hydrate` | `true` (default) |
| `compute`-driven, one-shot | `{#let}` (P14, upcoming) | `compute(bag)` runs once at mount; computed signals inside the data context drive inner reactivity | `false` |
| Manual lifecycle | each, async | explicit `render` / `hydrate` / `update` with direct `bag.region` access | `true` |

`each` and `async` keep direct `region` access because their lifecycles aren't reducible to "place new content reactively" — each owns keyed children with per-item identity; async owns three-state transitions over a promise. They don't fit `compute`.

`{#let}` introduces the one-shot case: mount-time it injects a `Signal.computed(() => evalExpr(data))` into the data context; inner expression bindings subscribe to that computed via their own per-binding Reactions. The let block itself never needs to re-fire — `reactive: false` skips wrapping its body in the framework's outer Reaction. Without this flag, the let block would wastefully re-evaluate its setup on every signal change its inner content reads.

**Cleanup obligation for `reactive: false` + computed.** `Signal.computed(fn)` returns a Signal driven by an internal Reaction with no auto-cleanup. The bag's `computed(fn)` helper (see "Why framework-managed reactivity primitives" above) wraps `Signal.computed` and registers the internal Reaction via `bag.scope.track` so it stops when the block disposes. `{#let}` uses `bag.computed(() => evalExpr(data))` — no manual cleanup needed.

After the refactor:
- The post-rewrite regression where `<ui-panel size="{#if x}A{else}B{/if}">` rendered literal `&lt;!--sui-block...&gt;` text in the attribute is fixed.
- `reactive-data.js` deletes.
- `bindMarkers` has one dispatch path: `getBlock(type)(bag)`.
- AST-to-block is 1:1 for every AST node type.
- Block authors writing future blocks have a strictly smaller surface for the common case.

---

## Why now

1. **Restore a regression.** Before the native renderer rewrite, blocks-in-attribute-position worked. Lit's `ReactiveConditionalDirective` introspects `partInfo.type` and serializes the matched branch to a string when it lands in an attribute (`engines/lit/directives/reactive-conditional.js:86-125`). The native renderer's `buildHTMLString` classifies only expression entries; block entries dispatch with a fixed text-position contract (a `DynamicRegion` over a `<!--sui-block:v1:N-->` comment). When the comment lands inside an attribute value it isn't a Comment node at all — it's attribute text — so the block is never dispatched and the marker stays as visible text in the attribute. Observable at `docs/src/components/SpecimenExplorer/SpecimenExplorer.html:33`. The test gap that masked it: no coverage for blocks in attribute position.

2. **The asymmetry that motivated the original plan IS the regression.** This plan was originally scoped to fold `expression` into the block model on architectural-symmetry grounds. The second-reviewer notes (preserved at the end) correctly read that as "net negative at this point" — the original scope didn't unlock anything user-visible. The expanded scope IS the user-visible win the reviewer asked for: position-aware block dispatch powers the regression fix.

3. **Forward-compatibility with new blocks.** `2e Template Match Blocks` (`{#match}`) and `P14 Template Let Bindings` (`{#let}`) are scoped and ready. Both would silently inherit the regression the moment they ship — `<div class="{#match status}{is 'a'}A{is 'b'}B{/match}">` would produce the same broken output. Landing this plan before `2e` makes attribute-position support automatic for every new block that uses `compute`.

4. **The Lit engine already does this.** `engines/lit/renderer.js readAST` dispatches one block per AST type; expression maps to `reactiveData`; each block directive receives `partInfo` and (when relevant) introspects to choose serialization. Native is the outlier — `expression` dispatches via class methods on `Renderer` instead of through `registerBlock`, and blocks have no awareness of position.

5. **Per-binding perf items have a canonical home.** Dirty-check (last-value compare), `toggleAttribute` for booleans, form-state property mirror — each lives in one place after this lands. Today they're scattered across `bindAttribute`'s branches.

6. **`reactive-data.js` is duplication, not insulation.** It predates the block model. Every dispatch concern that block authoring solved (lifecycle, registry, recovery, hydration) is duplicated inside `reactive-data.js` and inside `bindMarkers`'s manual dispatch. Purely historical.

---

## Constraints

**Preserve unchanged:**
- AST shape and node types (engine-agnostic invariant).
- `template-compiler.js` — no compiler changes. Position is detected at `analyzePosition` time in `buildHTMLString`.
- `engines/lit/` — Lit engine reads the same AST.
- The two-level context (`create` gets full ctx; other hooks get the bag).
- The framework-wired outer Reaction (`define-block.js:165`).
- `render` / `update` / `hydrate` / `destroy` / `error` / `shouldRecover` / `syntax` / `evaluateText` semantics for blocks that don't opt into `compute`.
- `hydrate`'s contract: adopt server DOM via `hydrateInto`, do NOT call `renderAST`. Same for blocks that DO use `compute` — `hydrate` stays explicit.
- All existing block authors at the public API level: `defineBlock` config gains optional `compute`; existing blocks (each, async) can keep their current shape unchanged.
- SSR output for text-position blocks: identical.
- SSR output for attribute-position blocks: previously broken (literal comment text); now produces the evaluated string inline.
- Component-author API: every `defineComponent` call works unchanged.
- All existing tests must pass without modification.

**Out of scope:**
- New features, new directives, new AST node types.
- Performance optimizations not intrinsic to the unification.
- `{#each}` / `{#async}` inside attribute values. The framework refuses to construct the bag in attribute position for these block types with a clear error pointing at the offending syntax. Block authors never see the unsupported case.
- Naming changes (`defineBlock`, `registerBlock`).

---

## Architecture

### The bag, before and after

Before: one bag shape with `region` always present.

After: one bag shape with optional fields based on position, plus framework-managed reactivity primitives:

```js
{
  // Always present
  entry,                              // includes entry.classification
  node, data, scope, isSVG, serverMeta, hydrating, self,
  lookupExpression,                   // (expr) => value
  renderAST,                          // ({ ast, scope?, data?, isSVG? }) => fragment — for text-position rebuilds
  hydrateInnerContent, hydrateInto,   // hydration helpers
  childContext,                       // (parent, overrides) => data

  // Reactivity primitives — framework-managed lifecycle
  reaction(callback, options?),       // create+track a Reaction; auto-stops on scope dispose (and on anchor disconnect)
  track(reaction),                    // register an externally-created Reaction for stop-on-dispose
  computed(fn, options?),             // Signal.computed wrapper; auto-stops the internal Reaction on dispose
  onDispose(fn),                      // shorthand for scope.onDispose

  // Text-position only (classification.type === 'text' / 'rawText')
  region,                             // DynamicRegion — present iff content lives in DOM

  // Attribute-position only (classification.insideTag)
  parts,                              // attributeParts for interpolated values
  commit,                             // (value) => void — underlying setAttribute/property/event call

  // Always present — sugar over the position-specific fields
  place,                              // (content) => void — framework dispatches to region.setContent (text) or commit (attribute)
}
```

Block authors using `compute` only ever touch `bag.place`. Block authors writing manual lifecycle hooks (each, async) reach for `bag.region` directly in text position; in attribute position the framework refuses to construct their bag.

### Why framework-managed reactivity primitives

`Signal.computed(fn)` returns a Signal driven by an internal `Reaction.create`-d Reaction (`signal._computedReaction`). The framework provides no scope to that Reaction — if the block scope disposes without explicit `reaction.stop()`, the computed lives forever, holding signal subscriptions and keeping closures alive. Today no block creates ad-hoc computeds, so this isn't yet a leak. `{#let}` introduces the case.

Rather than asking block authors to remember `scope.onDispose(() => signal._computedReaction.stop())`, the bag exposes `bag.computed(fn)` which constructs the signal AND registers its internal Reaction via `bag.scope.track` so it disposes with the block. Same pattern for ad-hoc `bag.reaction(fn)` calls (which already exist as `scope.reaction`; the bag just surfaces them).

```js
// {#let total = price * qty} compiles to a let block whose render does:
render({ node, data, region, scope, computed, renderAST, lookupExpression, childContext }) {
  const value = computed(() => lookupExpression(node.expr));    // computed Reaction tracked
  const augmentedData = childContext(data, { [node.name]: value });
  const childScope = scope.child();
  region.setContent(renderAST({ ast: node.content, data: augmentedData, scope: childScope }), childScope);
}
```

No manual `.stop()`. No leak vector. Same pattern is available to any future block that needs ad-hoc reactivity — `bag.reaction` and `bag.track` cover the general case; `bag.computed` is the targeted convenience.

### `place(content)` — the framework's placement primitive

Lives in a new module `commit-hooks.js` (alongside `makeCompute` / `makeCommit` for expression's richer value shapes). Built per-binding at dispatch time.

```js
makePlace({ entry, classification, region, commit, parts, scope, renderer, data, hydrating })
  → (content) => void
```

Three internal modes:

- **Text + AST content (e.g., conditional's `contentAST`):** allocate child scope, `renderAST({ ast: content, scope: childScope, data })`, `region.setContent(fragment, childScope)`. Same machinery conditional uses today.
- **Text + primitive value (expression's text-position case):** `textNode.data = value` with last-value dedup. Same as today's `bindTextExpression`.
- **Attribute + AST content (conditional in attribute):** `renderASTToString(content, data, renderer)`, `commit(value)` where `commit` writes the attribute via `attributeParts` machinery.
- **Attribute + primitive value (expression in attribute):** `commit(value)` directly. Property/event/boolean nuances handled inside `commit`.
- **Hydration:** first call evaluates content (registers Signal deps) but skips the DOM write. Subsequent calls write normally.

Last-value dedup is shared across modes — if `content` is reference-equal to last call's content, no-op. This eliminates per-block `if (matchIndex === self.currentBranchIndex) return;` boilerplate.

### `renderASTToString(ast, data, renderer)` — the new helper

Walks an AST + data context and returns a string. Lives in `commit-hooks.js`. For v1:
- `html` nodes → append `node.html` verbatim
- `expression` nodes → evaluate via `renderer.lookupExpression`, stringify
- `if` / `rerender` / `template` nodes → recurse into the matched branch
- `each` / `async` / `svg` / `slot` nodes → throw `BlockNotSupportedInAttributePosition` at construction time (i.e., when `makePlace` is built, not when content arrives)

Structurally similar to `ServerRenderer.renderNodes` minus the `data-sui-bind` tracking.

### `defineBlock`'s `compute` shorthand and `reactive` flag

`defineBlock` gains two related fields:

- **`compute(bag) → content`** — optional. When provided, the framework synthesizes both `render` and `update` as `bag.place(compute(bag))`. Block author writes one body instead of two near-identical ones. Last-value dedup happens inside `place` via reference equality on returned content.

- **`reactive: boolean`** — optional, defaults to `true`. Controls whether the framework wraps the block's body in the outer Reaction.
  - `true` (default): today's behavior. `lookupExpression` reads inside the body register on the framework Reaction; signal changes fire `update`.
  - `false`: framework calls the body once at mount, no outer Reaction, no `update` calls. Use when the block does mount-time setup that drives reactivity *internally* via computeds/per-binding Reactions in the inner content (e.g., `{#let}` injects a computed signal into the data context — inner bindings subscribe to it directly, the let block itself never re-fires).

The two axes are orthogonal:

| `reactive` | `compute` | Behavior |
|---|---|---|
| `true` (default) | provided | Framework wires Reaction; `render` and `update` synthesized as `place(compute(bag))`. Conditional, rerender, expression. |
| `true` (default) | not provided | Framework wires Reaction; block writes explicit `render`/`hydrate`/`update`. Each, async. |
| `false` | provided | Framework calls `place(compute(bag))` once at mount; no Reaction. `{#let}` (upcoming). |
| `false` | not provided | Framework calls `render(bag)` once at mount; no Reaction; no `update`. Hypothetical future one-shot manual-lifecycle block. |

Authors who need in-place mutation on update (vs always rebuilding) write explicit `render`/`update` instead of `compute`.

### `buildHTMLString` after

`processNodes`'s default case (block directives) classifies every block entry:

```js
default: {
  if (insideRawText) { rawTextNodes.push(node); break; }
  const id = entries.length;
  const classification = analyzePosition(htmlBuffer);

  if (classification.insideTag) {
    htmlString += `${ATTR_MARKER_PREFIX}${id}${ATTR_MARKER_SUFFIX}`;
  } else {
    htmlString += `<!--${BLOCK_MARKER}${id}-->`;
  }

  const entry = { id, type: node.type, node, classification };
  if (insideSVG) { entry.isSVG = true; }
  entries.push(entry);
  break;
}
```

`populateAttributeBindings` already discovers `__suiN__` in attribute values and stamps `attributeParts` on the first entry per attribute — no change needed for block entries.

### `bindMarkers` after

```js
bindMarkers(root, entries, data, scope) {
  if (entries.length === 0) return;

  const processedAttrIDs = new Set();
  const deferredComments = [];
  const walker = ...;

  let node;
  while ((node = walker.nextNode())) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      for (const attr of node.attributes) {
        if (!attr.value.includes(ATTR_MARKER_PREFIX)) continue;
        const { parts, markerIDs } = parseAttributeParts(attr.value);
        for (const id of markerIDs) processedAttrIDs.add(id);
        const entry = entries[markerIDs[0]];
        dispatchAttributePosition({ entry, element: node, attr, parts, entries, data, scope, renderer: this });
      }
    } else {
      deferredComments.push(node);
    }
  }

  for (const comment of deferredComments) {
    const text = comment.data;
    let id, key;
    if (isExpressionMarker(text))   { id = parseExpressionID(text); key = 'expression'; }
    else if (isRawTextMarker(text)) { id = parseRawTextID(text); key = 'rawText'; }
    else if (isBlockOpen(text))     { id = parseBlockOpenID(text); /* key from entry */ }
    else continue;

    if (key === 'expression' && processedAttrIDs.has(id)) continue;
    dispatchTextPosition({ entry: entries[id], comment, data, scope, renderer: this });
  }
}
```

Both `dispatchAttributePosition` and `dispatchTextPosition` construct the bag (with `place` always supplied; `region` only in text position; `commit`/`parts` only in attribute position) and call `getBlock(entry.node?.type ?? entry.type)(bag)`.

### Block hooks after — conditional example

```js
const conditional = defineBlock({
  name: 'conditional',
  syntax: (node) => `{#if ${node.condition}}`,
  shouldRecover: (node) => Boolean(node.branches?.length),

  create({ renderer }) {
    return { currentBranchIndex: -1, evaluator: renderer.evaluator };
  },

  // Synthesizes render + update via bag.place
  compute({ node, lookupExpression, self }) {
    const result = selectBranch(node, lookupExpression);
    self.currentBranchIndex = result.matchIndex;
    return result.contentAST;
  },

  // Hydrate stays explicit — adopt server DOM, don't rebuild
  hydrate({ node, region, lookupExpression, hydrateInto, self, serverMeta }) {
    const clientBranch = selectBranch(node, lookupExpression);
    const serverBranchIndex = serverMeta?.branchIndex;
    const hasMismatch = serverBranchIndex !== undefined && serverBranchIndex !== clientBranch.matchIndex;

    if (hasMismatch) {
      // Fall back to fresh render — text position only; in attribute position
      // place() handles the mismatch transparently (server's string vs client's)
      if (region) {
        // ... existing mismatch logic
      }
    }
    else if (region?.ownedNodes.length > 0 && clientBranch.contentAST) {
      hydrateInto({ innerAST: clientBranch.contentAST });
    }
    self.currentBranchIndex = clientBranch.matchIndex;
  },

  evaluateText({ node, data, renderer }) { /* unchanged */ },
});
```

The block author writes `compute` + `hydrate`. No `if (bag.region)` branching. No direct `region.setContent` calls. The framework's `place` handles both text and attribute position transparently.

For `each` and `async`: today's body unchanged. `bag.region` is always present (framework refuses to construct an attribute-position bag for them).

### `ServerRenderer` after

`renderConditional` / `renderRerender` / `renderTemplate` check `analyzePosition(scope.htmlBuffer).insideTag`. Attribute position: evaluate the matched branch via the existing `renderNodes` pathway, return the string directly with no markers. `data-sui-bind` flows through `scope.tagBindings` exactly like attribute-position expressions today.

`renderEach` / `renderAsync` in attribute position: throw `BlockNotSupportedInAttributePosition` at template-evaluate time — matches the client's construction-time refusal.

---

## File-level changes

### Added

```
packages/renderer/src/engines/native/
├── commit-hooks.js                # makeCompute, makeCommit, makePlace, renderASTToString — ~250 lines
└── blocks/
    ├── expression.js              # compute-driven; introspects classification for value shape
    └── raw-text.js                # ~25 lines
```

### Modified

```
packages/renderer/src/
├── build-html-string.js           # Classify block entries
├── engines/native/
│   ├── renderer.js                # bindMarkers + hydrateMarkers route via getBlock; position-aware dispatch construction
│   ├── define-block.js            # Add `compute` shorthand; bag construction routes through makePlace
│   ├── server.js                  # Attribute-position renderConditional/Rerender/Template — inline eval, no markers
│   └── blocks/
│       ├── conditional.js         # Use compute + explicit hydrate
│       ├── rerender.js            # Use compute + explicit hydrate
│       ├── template.js            # Use compute + explicit hydrate (subtemplate keeps render/update for now)
│       ├── each.js                # Unchanged at the body level; framework refuses attribute-position dispatch
│       └── async.js               # Unchanged at the body level; framework refuses attribute-position dispatch
```

### Deleted

```
packages/renderer/src/engines/native/
└── reactive-data.js
```

### Untouched

- `packages/compiler/` — no compiler changes.
- `dynamic-region.js`, `reaction-scope.js`, `blocks/registry.js`, `blocks/sample.js` (will refresh sample after refactor).
- `engines/lit/`.
- AST shape (entries gain `classification` for blocks; AST nodes unchanged).

---

## Steps

Each step is independently shippable, each leaves the codebase green, and each has its own verification gate. **Step 1 is the regression bugfix — it ships first and closes the SpecimenExplorer issue independently of the rest.**

### Step 0 — Bench baseline

Two purposes: capture a clean baseline of all committed suites at the current branch tip, AND validate the factory-shape closure cost in isolation before any structural commit.

**0a — Full-suite baseline.** Run every committed suite at `main` and save the JSON artifacts. These become the comparison target for steps 1, 6, and 8.

```bash
# All five suites, captured to bench-report.json per suite
cd packages/component/bench/tachometer
node build-ci.js current && node build-ci.js baseline
npx tachometer --config tachometer-ci-krausest.json   --json-file krausest-baseline.json
npx tachometer --config tachometer-ci-template.json   --json-file template-baseline.json
npx tachometer --config tachometer-ci-hydrate.json    --json-file hydrate-baseline.json
npx tachometer --config tachometer-ci-todo.json       --json-file todo-baseline.json
cd ../../../renderer/bench/tachometer
npx tachometer --config tachometer-ci-renderer-micros.json --json-file renderer-baseline.json
```

(WSL2 hosts: skip local run; baseline is the bench-bot artifact from a PR comment at branch tip.)

**0b — Factory-shape isolation bench.** Port `makeAttributeStringCommit` in isolation, bench against today's `bindAttribute` string path on `bench-data-blob` and `each-mount-1000`. Decision gate before steps 1-6.

**Verification gate:** factory-shape per-binding overhead within tolerance (`no change` reporter verdict on `bench-data-blob` and `each-mount-1000`). If `slower` ≥ 5%, redesign the contract (consolidate closures, share state via per-binding objects) before proceeding. Reviewer's concern is load-bearing here; abandoning the factory shape and falling back to today's class-method dispatch is the documented escape hatch.

### Step 1 — Regression bugfix: block position classification

Smallest patch that restores blocks-in-attribute-position support. Lands ahead of the structural refactor; SpecimenExplorer renders correctly after this step.

- `build-html-string.js`: default-case block-emit classifies via `analyzePosition(htmlBuffer)`; attribute-position blocks emit `__suiN__`, store `classification` on the entry.
- `commit-hooks.js` (new): implement `makePlace` and `renderASTToString`. `makePlace` constructs a `place(content)` closure aware of `entry.classification`. For text position, internally allocates child scope + calls `renderAST` + `region.setContent` (today's pattern, packaged). For attribute position, calls `renderASTToString` + `commit`. Hydration mode: first call register-deps-only, no DOM write.
- `engines/native/renderer.js bindMarkers`: when an attribute marker resolves to a block-type entry, dispatch with a bag containing `place` (no `region`).
- `engines/native/define-block.js`: bag construction routes through `makePlace`; existing blocks gain `bag.place` alongside `bag.region`. Bag also gains framework-managed reactivity primitives: `bag.reaction(fn)` (proxies `scope.reaction`), `bag.track(reaction)`, `bag.computed(fn)` (`Signal.computed` wrapped to auto-stop on dispose), `bag.onDispose(fn)`.
- `engines/native/blocks/conditional.js`: replace inline `region.setContent(renderAST(...))` in render/update with `bag.place(contentAST)`. Hydrate unchanged. Block now works in both positions.
- `engines/native/blocks/{each,async}.js`: no body changes; framework refuses attribute-position bag construction for these block types with `BlockNotSupportedInAttributePosition`.
- `engines/native/blocks/{rerender,template}.js`: same `bag.place` migration as conditional.
- `engines/native/server.js`: `renderConditional`/`renderRerender`/`renderTemplate` detect `analyzePosition(scope.htmlBuffer).insideTag`; emit inline matched-branch evaluation, no markers. `renderEach`/`renderAsync` throw on attribute position.

**Tests added:**
- `attribute-bindings.test.js`: `{#if}` in attribute single, `{#if}` in interpolated attribute, `{#if}` with elseif/else chain in attribute, `{#if}` updating reactively when condition signal changes, `{#rerender}` in attribute, `{>template}` in attribute.
- `ssr-hydration.test.js`: `{#if}` in attribute hydrates without re-render; `data-sui-bind` fast path works for block-bound attributes; mutation post-hydration updates the attribute.
- `cleanup-reactions.test.js` (extension): conditional's attribute-position Reaction stops when element disconnects.
- Negative tests: `{#each}` / `{#async}` in attribute position throw with the expected error class and message.

**Verification gate:** SpecimenExplorer renders correctly in the docs build; new tests pass; no existing test regresses; `npm test` in `packages/renderer` green.

### Step 2 — Add `compute` shorthand to `defineBlock`

**Edit:** `define-block.js` — when `compute` is provided in the config, synthesize `render` and `update` as `bag.place(compute(bag))`. Last-value dedup happens inside `place` (no change to dedup logic, just relocation from per-block `self` checks).

**Migrate:** `conditional.js`, `rerender.js`, `template.js` from explicit `render`/`update` to `compute` + explicit `hydrate`. Each block's body shrinks; behavior identical.

**Verification gate:** all existing tests pass. Per-block bodies shrink measurably (target: conditional from ~40 lines render+update to ~10 lines compute).

### Step 3 — Add `blocks/raw-text.js` and route via registry

**New:** `blocks/raw-text.js`. Registers as `'rawText'` via `registerBlock`. Uses `compute` shorthand.

**Edit:** `bindMarkers` — comment marker matching `sui-rawtext:v1:` dispatches via `getBlock('rawText')(bag)`.

**Verification gate:** existing tests covering `<script>`, `<style>`, `<textarea>`, `<title>` content rendering pass without modification.

### Step 4 — Add `blocks/expression.js`

**New:** `blocks/expression.js`. Registers as `'expression'` via `registerBlock`. Uses `compute` shorthand — `compute(bag) → value`. Introspects `bag.entry.classification` for value-shape choices (events get literal handler; properties get raw value; booleans get coerced; attributes get serialized; unsafeHTML gets wrapped). Same logic as today's `bindAttribute`'s position branches, just gathered into one block file.

**Edit:** `bindMarkers` — both text-position comment dispatch and element-attribute path call `getBlock('expression')(bag)`.

**Verification gate:** all text-expression tests pass (default, `unsafeHTML`/`{#html}`, `{#fn}` literal value), including hydration text-adoption (`ssr-hydration.test.js` server-text merge cases). All attribute binding flavors render identically: property, event, boolean, interpolated string, single-expression string, `ifDefined`. Form-state attributes (`<input checked={isOn}>`, `<select value={selected}>`) update the DOM property after user interaction.

### Step 5 — Unify `hydrateMarkers` dispatch

**Edit:** `hydrateAttributes` and `hydrateMarkers` in `renderer.js` — dispatch via `getBlock(...)({ ..., hydrating: true })`.

Hydration text-adoption (split server text node at value boundary, currently `reactive-data.js:200-217`) moves into the appropriate `place`/`commit` branch with `hydrating: true`. Block hydrate hooks unchanged.

**Verification gate:** `ssr-hydration.test.js` passes in full; mismatch-warning cases trigger correctly; `data-sui-bind` fast-path hydration unaffected; hydration of `{#if}` in attribute position adopts server-rendered value without re-firing DOM write.

### Step 6 — Delete `reactive-data.js`

After all callers migrated, delete the file. Drop dead methods on Renderer (`bindAttributeExpression`, `bindTextExpression`, `bindRawTextContent`, `bindBlock`, `hydrateTextExpression`) and dead imports.

**Verification gate:** full test suite passes. No imports of `reactive-data.js` remain.

### Step 7 — Refresh `blocks/sample.js`

**Edit:** `blocks/sample.js` to memorialize the new patterns: `compute` shorthand, `bag.place`, position-aware framework dispatch, the deliberate model shift ("block = AST node type with dispatch lifecycle, not 'owns a region'"), and the each/async escape hatch (manual render/update for blocks that don't fit `compute`).

**Verification gate:** sample.js compiles (it's not registered but lints/types must hold); content matches the post-refactor reality.

### Step 8 — Final verification

- Full browser test suite green on native engine.
- Lit engine tests unaffected (engine wasn't touched).
- Full hydration test suite.
- SpecimenExplorer renders correctly in the docs build.
- Bench against `main`: krausest, `bench-todo`, `bench-data-blob`, `subtemplate-*`. Tolerance: each metric within ±5% reporter verdict, no `slower` ≥ 5%. Compare against step 0 baseline.

---

## Verification gates summary

| Step | Gate |
|---|---|
| 0 | Factory per-binding overhead ≤5% vs class-method dispatch on `bench-data-blob` |
| 1 | SpecimenExplorer renders; block-in-attribute tests + hydration tests pass; no existing test regresses |
| 2 | All existing tests pass; per-block bodies measurably smaller |
| 3 | Raw-text tests pass |
| 4 | Text-expression + attribute-binding flavors + form-state mirror tests pass |
| 5 | Full hydration suite passes (text + attribute + block-in-attribute) |
| 6 | Full test suite passes; no `reactive-data.js` references remain |
| 7 | Sample.js reflects new patterns |
| 8 | Cross-package full suite + perf gate vs main and vs step 0 |

Each step ships independently behind its gate. If a step's gate fails, prior steps stay shipped — no cross-step rollback needed. **Step 1's gate is the user-visible regression close — the milestone that justifies the plan landing at all.**

---

## Perf budget

The committed perf suite (`packages/{component,renderer,reactivity,compiler}/bench/tachometer/`) is the gate. Tachometer reporter verdict per metric must be `no change` or `faster`; `slower` only acceptable when it's the tax of correctness (e.g., the attribute-position dispatch path costs more than zero because it now does work; today it produces broken output for free). Headline regressions on the steady-state hot paths are not acceptable.

**Metrics that must not regress more than ±5% (reporter verdict `no change`):**

| Suite | Metrics | Why |
|---|---|---|
| `krausest` | `create-1k`, `create-10k`, `update-10th-50`, `swap-rows-20`, `clear-10k` | Mount + per-row update + DOM swap. Most exposed to per-binding closure allocation and place dispatch. |
| `template` | `subtemplate-reactive-data-100x500`, `subtemplate-shorthand-props-100x500`, `snippet-args-per-key-100x500`, `subtemplate-data-blob-100`, `each-mount-1000`, `active-indicator-200`, `stable-ref-mutate-500` | Each-block per-item binding overhead; subtemplate dispatch; signal-driven update. Refactor touches all these paths. |
| `hydrate` | All current metrics | Data-sui-bind fast path must stay fast; hydration is the most timing-sensitive path. |
| `renderer-micros` | All | `buildHTMLString`, dispatch micros. Directly touched by the refactor. |
| `signal` | All | Untouched by this refactor; baseline check that nothing leaked across packages. |

**Mitigations baked into the design:**

- **`makePlace` hoists classification once at mount, not per-content-call.** The factory inspects `entry.classification` and returns one of N specialized closures (text-AST, text-primitive, attribute-AST, attribute-primitive, etc.). The runtime path is a direct function call, not a switch-per-call. Same shape `lit-html`'s Part subclasses use.
- **Text-position `place(astContent)` is a thin wrapper over today's `region.setContent(renderAST(content, childScope), childScope)`.** Net overhead target: zero. The refactor's text path must trace identically to today's. Step 2's verification gate explicitly compares.
- **Bag construction allocates one closure per primitive (`reaction`, `track`, `computed`, `onDispose`, `place`).** Acceptable absolute cost (~5 closures × ~50 bytes ≈ 250 bytes per dispatch); the question is V8 hidden-class stability. Interning the bag shape (same property order, same call site for `Object.assign` or struct-of-fields) keeps the bag monomorphic. If profile shows polymorphic access on the bag fields after Step 1, intern the construction.
- **`bag.computed` / `bag.reaction` are pay-only-when-used.** Construction allocates the closures but a block that doesn't call them costs nothing beyond the allocation. For blocks like `each` that wire many internal Reactions, `scope.reaction` is still the canonical path; `bag.reaction` is a proxy that doesn't change the call shape inside the block.
- **`renderASTToString` for attribute-position blocks allocates per evaluation.** Acceptable — attribute-position blocks are rare in real templates (the SpecimenExplorer case is one site; production usage is sparse). If a hot path emerges, intern via WeakMap keyed by AST array.

**Mitigations NOT baked in (deliberate trade):**

- Per-binding closure allocation in `makeCompute`/`makeCommit` (R2). The reviewer flagged this; Step 0 benches before committing. If it's material on `bench-data-blob` (~100 bindings × 1000 records), redesign the factory shape (e.g., a single dispatch function reading from a small per-binding state object). The factory shape might not survive.
- Event-handler stable-listener semantics (R3). Today's `lookup-per-fire` costs more on each event fire; new path is faster per-fire but changes semantics for reactively-updated handlers. Step 4 decides which to preserve; default is lookup-per-fire (no perf regression on bench, semantics preserved).

**Verification cadence:**

- Step 0 establishes the baseline. Run all five suites; record `bench-report.json` artifacts.
- After Step 1 (regression bugfix): re-run all five suites. Compare per-metric against Step 0 baseline. Any metric showing `slower` ≥ 5% must have a documented justification.
- After Step 6 (reactive-data.js delete): full re-run. The cumulative delta is the refactor's perf cost.
- Step 8 is the final aggregate gate.

---

## Risks

### R1 — Hydration adoption semantics drift

`hydrateTextExpression`'s server-text-node boundary split (`reactive-data.js:200-217`) is load-bearing. Moving it into `place`'s hydrating branch must preserve behavior exactly.

**Mitigation:** copy verbatim in step 1, mark with a load-bearing comment, verify against `ssr-hydration.test.js` text-merge cases.

### R2 — Closure construction allocation per binding

`makePlace` allocates one closure per binding at mount. For a 1000-row table × 5 expressions per row, that's 5000 closure allocations at mount.

**Mitigation:** Step 0 benches this in isolation before any structural commit. If material, redesign the contract before proceeding.

### R3 — Event commit's stable-listener pattern

Today's `bindAttribute` event branch does `lookupTokenValue` on every event fire. The new `makeCommit` event branch registers a stable listener that calls a closure-stored handler that gets reactively updated. For `onClick={state.handler}` where `state.handler` is a Signal, the two patterns diverge: old reads at fire time, new reads at last reactive flush.

**Mitigation:** call out the decision explicitly in step 4's PR description. Default to preserving lookup-per-fire unless there's a concrete reason to change semantics.

### R4 — `place` last-value dedup vs explicit per-block dedup

Today conditional checks `if (matchIndex === self.currentBranchIndex) return;` before re-rendering. `place`'s reference-equality dedup might be coarser or finer depending on whether `compute` returns the same AST array reference or a new one each tick.

**Mitigation:** `compute` for conditional/rerender returns the same AST array reference (from `node.content` or `node.branches[i].content`), so reference equality works. Explicit test: signal changes that don't change branch don't re-fire `place`. If `compute` returns a new object each tick for some block, fall back to a key-based dedup (the bag offers an optional `key` argument to `place`).

### R5 — Hydration of attribute-position blocks

Server emits `<ui-panel size="grow">` with `data-sui-bind="size=N"`; client must wire the Reaction without re-firing the DOM write on first run.

**Mitigation:** `place` in hydrating mode evaluates content (registers deps) but skips the commit call on `comp.firstRun`. Same `skipFirstWrite` contract as today's attribute expressions. Explicit test: server-rendered attribute value is preserved through hydration; signal mutation post-hydration updates the attribute; Reaction does NOT fire `setAttribute` on first run.

### R6 — Model shift may surface in unexpected places

The "blocks own regions" rule was the bright line in the current model. Crossing it (making expression a block) might surface in places I haven't audited — e.g., code that assumes `getBlock(type)` only returns region-managing dispatch, or that `region.anchor` is always present in a block dispatch context.

**Mitigation:** audit `region.anchor` / `region.ownedNodes` references inside `define-block.js` and the registry's dispatcher; ensure they tolerate the absence of `region` in attribute-position bags. Add a runtime guard in `defineBlock`'s dispatch that fails fast with a clear message if a block touches `bag.region` when it isn't present.

---

## What stays the same

- AST shape: identical.
- `template-compiler.js`: zero changes.
- `engines/lit/`: zero changes.
- `defineBlock` config shape: gains optional `compute`; existing fields unchanged.
- All existing block authors at the public API level: same `registerBlock` call. Each, async, sample.js layout unchanged at the structural level.
- SSR HTML output for text-position blocks: identical.
- SSR HTML output for attribute-position blocks: previously broken, now produces evaluated string inline.
- Hydration semantics for text-position blocks: identical.
- `processedAttrIDs` Set in `bindMarkers`: stays.
- Two-level context (dispatch ctx → hook bag), framework-wired outer Reaction, hydrate's distinct contract, destroy/error/shouldRecover/syntax/evaluateText — all preserved.

---

## After the refactor

The seven recommendations from `lit-comparative-renderer-review.md` either dissolve or fold into the new structure:

| Item | Disposition |
|---|---|
| #1 entry-driven walker | Orthogonal |
| #2 forward-state scanner | Orthogonal |
| #3 cache collapse | Orthogonal |
| #4 module walker | Orthogonal |
| #5 dirty-check | Folds into `place`'s last-value dedup (one place, not per-block) |
| #6 toggleAttribute + form-state mirror | Lives in `commit` factory (one place) |
| #7 WeakBlockRef | Orthogonal |

`2e Template Match Blocks` and `P14 Template Let Bindings` inherit attribute-position support for free when they ship — they declare `compute(bag) → content`, and `match`/`let` work in any position the day they land.

A future user-facing directive layer (not currently planned) would extend `registerBlock` with a public alias and the same `compute` / `bag.place` contract.

---

## Estimated scope

- **Files touched:** ~10 modified, 3 added, 1 deleted.
- **LOC delta:** net negative. `reactive-data.js` (~250 lines) → `commit-hooks.js` (~250 lines, more focused factories) + `blocks/expression.js` (~30 lines) + `blocks/raw-text.js` (~25 lines). Each block file using `compute` shrinks by ~20-30 lines (eliminates render/update duplication; eliminates manual child-scope allocation). `renderer.js` shrinks by ~80 lines (deleted methods + simplified dispatch). `server.js` gains ~30 lines (attribute-position handling).
- **New tests required:** attribute-position block tests; hydration cases; cleanup cases. Refactor itself is observably equivalent for existing tests.
- **Time:** ~20-30h. Step 0 + Step 1 is one focused session (~8-12h; the regression bugfix). Step 2 (compute migration) ~3-4h. Steps 3-4 ~6-8h. Steps 5-8 ~4-6h.

---

## Open questions (not blocking)

- Whether `place` should accept an optional `key` argument for explicit dedup (vs always reference equality on content). Defer until a real case surfaces.
- Whether `entry.classification` should be moved off the entry into the bag at construction time. Defer — current placement on entry is adequate.
- Whether `compute` and `hydrate` should share a unified shape that returns a "what to do" descriptor the framework dispatches. Defer — explicit hooks are clearer for now.
- Naming: `commit-hooks.js` vs `commit-strategies.js` vs `place-hooks.js`. Defer.

## Dependencies

None — independent of FGR work, perf-wins, and mount-cost bundles. Should land **before `2e Template Match Blocks`** so match inherits attribute-position support.

## Status

Scoped — design grounded against `blocks/sample.js`'s encoded model, model shift named explicitly, implementation steps concrete. Ready to execute. **Step 1 ships independently as the regression bugfix; steps 2-7 are the structural unification that absorbs the bugfix into the universal `compute` + `place` abstraction.**

---

# Second-Reviewer Notes

> Cold read by a separate Claude session. Plan-author and reviewer are different agents. Surfacing concerns the plan-as-written either downplays or doesn't argue explicitly. Treat as adversarial review — reject anything that doesn't survive scrutiny.

> **Note (2026-05-11):** these notes were written against the original `expression-block-unification` scope, which folded `expression` into the block model on architectural-symmetry grounds without addressing block-position support. The expanded scope (now `block-dispatch-unification`) restores the regression that broke `{#if}` in attribute position, which is the user-visible win the reviewer flagged as missing. See "Reviewer-notes update post-expansion" below.

## Verdict

Net negative at this point in the project. Architecturally clean idea, but the upside is mostly aesthetic and the perf risk is structural rather than peripheral. Flips to net positive if either of two things become true: (a) a user-facing directive system gets onto the roadmap (the `compute`/`commit` contract preempts that work), or (b) `reactive-data.js` becomes a recurring source of regressions (hydration adoption being the prime candidate).

## Where the plan understates risk

### The "no new abstraction" framing is wrong

The plan asserts there is no new "handler" abstraction. `compute()` / `commit(value)` IS a callback-pair contract. Renaming it to "factories" doesn't change what it is — the framework hands the block a pair of closures, the block invokes them, the contract is the new surface. Argue it as a contract, not as the absence of one. Two bag shapes, not one.

### R2 (closure allocation) is the load-bearing concern, not a side-channel

Today's `bindAttribute` / `bindTextExpression` / `bindRawTextContent` route through methods on the Renderer class. No per-binding closure allocation. The new factory shape allocates `makeCompute(...)` plus `makeCommit(...)` at every binding site at mount. For `bench-data-blob` (~100 bindings) × N records, that compounds. For each-block subtemplates, that compounds again per-record-mount.

The plan's mitigation reads "factor common-case factories to share closure scope (e.g. a single `commit` function that reads from a small per-binding state object)." That mitigation is "abandon the factory shape if it loses the bench" — at which point the architecture has been redesigned into the class-method dispatch it started from. The factory shape might not survive the perf gate.

**Recommended addition:** a Step 0 that ports a single representative factory (`makeAttributeStringCommit` is a good candidate) and benches it against today's class-method dispatch on `bench-data-blob`. Decision gate before steps 1-6 commit. If the cost per-binding is non-trivial, redesign the contract before any irreversible work.

### R3 (event commit) is a behavior change, not just a refactor

Today's path does lookup-per-fire — `lookupTokenValue` runs on every event. The new `makeEventCommit` registers a stable listener that calls a closure-stored handler that gets reactively updated. For a binding like `onClick={state.handler}` where `state.handler` is a Signal, the two patterns can diverge. Old: reads the current value at fire time. New: reads the value at last reactive flush.

Tests probably don't cover the divergence (the contract "the handler from the data context fires" satisfies both). But this is a real behavior change that should be a documented decision, not an emergent property of the refactor. Either preserve lookup-per-fire (different closure shape, slower fire path) or document stable-listener semantics as an intentional API change.

### Hydration text-adoption (R1) loses locality

The mitigation "copy verbatim with a load-bearing comment" is correct. But the seam moves from a method on the Renderer class to a closure branch inside a factory inside `commit-hooks.js`. For someone debugging an SSR adoption mismatch, the call stack got deeper and the relevant code is further from the dispatch site. Add a navigation comment at the dispatch in `bindMarkers` pointing at the exact file:line for the hydrating branch — without it, the seam is harder to find on a 2am debugging session than today's reactive-data.js layout.

## Where the plan overstates upside

### Item #4 (extension surface) is theoretical

"A user-facing directive layer (if ever pursued)" — directives aren't on the roadmap. Items #1-3 in §Why are real, item #4 is speculative. Don't sell the speculative win as load-bearing motivation. The honest framing is items #1-3.

### "After this lands" perf items dissolve too easily

The §After the refactor table sells items #5 (dirty-check) and #6 (toggleAttribute + form-state mirror) as folding into the new structure. Both ARE one-line additions inside `makeTextCommit` / `makeAttributeStringCommit` / `makeBooleanCommit`. So bundle them. The plan as-written defers them to "separate work," which means the refactor might land structurally with no measurable upside captured — worst-shape outcome (audit surface grew, perf flat).

**Recommended:** add Step 1.5 (or fold into Step 1) that includes #5 last-value dirty-check and #6 toggleAttribute mirror inside the new factories. Use the existing perf bench to demonstrate the captured win. If the win materializes, the refactor's case strengthens. If it doesn't, that's a useful signal too.

### Indirection trade isn't argued

Today's `reactive-data.js` is verbose but linear — top-to-bottom read, no contract layer, dispatch lives where it's invoked. The new shape splits one file into three (`commit-hooks.js`, `blocks/expression.js`, `blocks/raw-text.js`) plus modified `renderer.js`, and dispatch hops through a factory contract. For new contributors learning the renderer, the question is whether the symmetry-with-other-blocks gain offsets the call-stack-depth loss. Plan doesn't argue this trade-off — assumes symmetry is the dominant good. Worth being explicit.

## Recommended sequence if pursued

1. **Step 0 (new):** Port `makeAttributeStringCommit` factory in isolation, bench against today's `bindAttribute` string path on `bench-data-blob`. Decision gate. If allocation cost is material, abandon factory shape or redesign before any structural commits.
2. **Step 1:** Build `commit-hooks.js`, including the items #5 and #6 wins inside the relevant factories. The bench delta from those wins is the case for the refactor. If the bench is flat, reconsider whether the refactor pays for itself.
3. **Step 2-6:** As written.
4. **Step 7:** As written, but with explicit comparison against the Step 0 baseline — both individual benchmarks and aggregate.

## When this should ship

After the framework hits 1.0 OR after a directive system gets prioritized. Pre-1.0 with components 10/80 done and homepage not built, internal refactors compete with shipping capability. This refactor doesn't unlock anything users can see. The right time is when the framework's public surface is stable enough that internal cleanup is the marginal next step, not when there's a backlog of user-facing work that needs the same engineering hours.

---

## Reviewer-notes update post-expansion

The expansion to cover block-position-introspection changes the verdict calculus:

- **(a) "user-facing directive system"** — still not on the roadmap. Reviewer's "flips to net positive" condition unchanged.
- **(b) "`reactive-data.js` becomes a recurring source of regressions"** — **this is exactly such a regression.** `bindAttribute`'s text-position-only assumption is what broke `{#if}` in attribute values; `reactive-data.js` is structurally the wrong place to fix it. Reviewer's condition (b) is now met.

The reviewer's three specific risk callouts remain load-bearing and are preserved as R1-R3 in the active risks section. Step 0 (bench baseline) is adopted as recommended.

The reviewer's "when this should ship" guidance — "doesn't unlock anything users can see" — no longer applies. Step 1 alone unlocks every component template that uses `{#if}` inside an attribute (today silently broken), and pre-empts the same regression in `2e Template Match Blocks` and `P14 Template Let Bindings`. The plan now has a user-visible milestone independent of the structural cleanup.

The reviewer's "no new abstraction framing is wrong" critique stands. The refined plan owns this directly: `bag.place(content)` IS a new contract; `compute` IS a new abstraction. They earn their place by collapsing the per-block render/update duplication AND by being the natural home for the position-aware placement the regression fix needs. The trade is named, not papered over.

# Native Renderer Blocks — Synthesized Post-Landing Review

> Synthesis of four reviews (A, B, C, D) of the `native-renderer-blocks` landing.
> Each finding is attributed to the reviewer(s) who raised it.
>
> - **A:** review by agent that coauthored the plan with the user
> - **B:** pairing agent / extraction-plan coauthor ("Gestalt" framing)
> - **C:** coauthor of `native-renderer-blocks-architecture.md`, primary critic across ~35 review rounds
> - **D:** third-party review — not involved in planning, read the code cold and checked A/B/C claims against source
>
> **Status note (added by synthesizer):** `blocks/each.js` is actively being reworked against a lit `repeat`-based reference. Each-block findings below are marked **[EACH IN FLIGHT]** and should be re-evaluated after that lands.

## Headline

- **[B]** "Strong landing. Plan fidelity is genuinely high — the two-level context bag, error machinery, per-item server markers, and block lifecycle all match the v3 spec. The code reads cleanly at every layer."
- **[C]** "Well-executed refactor that treated the plan as scaffolding rather than scripture. Where the implementation diverged, it diverged thoughtfully and documented why."
- **[D]** Sees normal refactor shape — good in many places, rough in some places nobody in A/B/C caught. A/B/C converged partly because all three reviewers were plan coauthors; a fresh read flagged three stable-surface issues (D.3, D.4, plus gap in A.2 coverage) plus one half-wrong claim (B.3).
- **[A]** Tests: 932 green in 5.44s (larger net than the plan listed — new `lifecycle-promises.test.js` (17), `component-contract.test.js` (54), SSR hydration (79)).

## What went well

### Architecture discipline
- **[B, D verified]** Two-level context model used exactly as specified in `template.js:182-193`. `create()` stashes renderer internals onto `self`; every subsequent hook reads `self.*`. "Textbook use — keeps the 9-key author bag honest."
- **[B, D verified]** `isItemContext` via `WeakSet` (`each.js:35-38`) is "materially cleaner than the prior `__isItemProxy` metadata flag — no proxy side channel, no underscore convention violation, explicit contract between the two modules."
- **[B]** `lookupExpression` rename done at `renderer.js:101` with the plan's justification mirrored in the comment.
- **[B]** Signature convention scoped correctly to new methods without scope creep into pre-existing positional methods.

### Error machinery
- **[B]** Error paths all present and correct:
  - `create()` throw → skip mount, structured log, no retry loop (`define-block.js:105-112`)
  - `destroy()` throw → swallowed, scope disposes regardless (L239-243)
  - `error` hook re-throws in dev, swallows in prod (L170)
  - Hydrate-throw clears region and falls through to `render()` in the same reaction (L191-211)
  - Render/update throw → `comp.stop()` prevents silent retry-loop
  - `onUpdated` auto-fires via `renderer.notifyUpdate()`
- **[B]** `reportBlockError` emitter with `nodeSyntax()` reconstruction produces the four-line format from the plan.
- **[A]** All 7 error-handling items from §Error Machinery present in `define-block.js`.

> **Editor's note (D, revised after A rebuttal).** D initially read the tracing-gate as inverting "loud in dev, quiet in prod." A's rebuttal reframes the audience: the primary consumer isn't a human with console open but an **agent looking at rendered output**. In that model:
> - Block throws → region empty → visible in screenshot → agent sees failure immediately
> - Agent's next action is `setTracing(true)`, reload, get structured log
> - Turning tracing on is an *acknowledgment* ("something's broken, let me dig"), not a missed log
>
> The tracing-gated design serves the agent-audience correctly. D.4's original "always fire in dev" recommendation is **retracted**. The replacement is A's refinement: a one-liner breadcrumb on first throw per (block, component) — see D.4 below.

### Per-item server markers
- **[A, B, D verified]** Landed exactly as planned. `server.js:247-249` wraps `renderNodes` with `<!--sui-each-item:v1:N-->` / `<!--/sui-each-item:v1:N-->` pairs.
- **[B]** `each.js:48-83` (`extractItemSlices`) consumes them with depth-tracking for nested blocks.
- **[B]** Legacy-server fallback preserves pre-refactor nuke-and-rerender semantics when markers aren't present.

### Block implementations
- **[B]** `rerender.js` — smallest block, proves the shape. Clean use of the two-level bag seam.
- **[B]** `conditional.js` — matchIndex 1000 preserved, mismatch-warning with env-guard exemption, inner-hydration via `hydrateInnerContent` closure.
- **[B]** `async.js` — state machine with generation counter for stale-promise discard.
- **[B]** `template.js` — `buildSnippetProxy` for lazy-getter snippet args. Kind detected nonreactively; `detectKind` locks on first resolution.
- **[B] [EACH IN FLIGHT]** `each.js` — single `ItemRecord[]` as source of truth, reconciliation mutates in place.
- **[D]** Adds: `reconcile` at `each.js:172-280` is genuine lit-style head/tail keyed reconciliation, not a drop-in. More sophisticated than B's framing suggested — worth explicit recognition as the in-flight rewrite continues.

### Judgment calls that improved on the plan
All reviewers called these "don't revert":

- **[A, B, C, D verified]** **Snippet + subtemplate unified into `template.js`** (commit `c30e3cd92`). Plan had them as separate modules. Merge is a straight simplification — one resolution path, kind locked at first render.
- **[A, C, D verified]** **`isClient`/`isServer` exempt from hydration mismatch warning** (`conditional.js:74-83`). Without the carve-out, every environment-guard template would spam the dev console.
- **[A, B, C]** **Empty-items fast-path in each update** (commit `6daa0c414`). Avoids reconcile + keyIndex Map allocation for the krausest "clear" benchmark.
- **[A, C]** **`createCache` extracted to `@semantic-ui/utils`** — clean post-refactor follow-up.

### Measurement-driven judgment
- **[C]** "The single thing I'd highlight hardest." The signature convention decision was run through tachometer, measured at 9–28% per-call slower, contextualized against real-render scales. Reasoning published in `ai/workspace/signature-benchmark-analysis.md` with a regression-guard bench left in-tree at `packages/renderer/bench/tachometer/signature.js`. "The next plan proposing an API convention with perf implications should use this as the template."
- **[A]** "Honest execution. Destructured is 9–28% slower per-call but amortizes to <1% at real render scales."

### Process discipline
- **[C]** **Commit-sequencing held under real pressure.** Nine commits (`99d0f1d6e → 16e71d20b`), each a standalone refactor, tests green at every boundary.
- **[C]** Step 9 (per-item markers + honest each-hydration) flagged as the riskiest cross-cutting change; landed last, against a stable decomposition.
- **[C]** **Honest code-comment acknowledgment where the plan was wrong** (`each.js:262-276`): the `.set()`/`.notify()` branch retained with a clear comment. "The correct response when a plan is wrong is to document the compromise in the code where the next reader will encounter it — not to force a 'fix' that recreates a different bug."
- **[C]** **Post-landing ownership.** Empty-items fast-path, `createCache` extraction, dynamic-table regression test, snippet dispatch unification, unused import removal.

> **Editor's note (D).** C's "plan fidelity is genuinely high" needs an asterisk: all three of A/B/C coauthored the plan. Cross-validation between self-reviews is weaker than it looks. D's cold read finds normal refactor shape — solid work, not flawless work.

## Deviations from plan (honest, not defects)

### Each fix 1 did not collapse to one path [B, C] [EACH IN FLIGHT]
- **[B]** Plan said: fresh-wrapper `getEachData` means `.set()` sees fresh identity; one path no branching. Code retains a `.set()`/`.notify()` branch.
- **[B]** Why: when `prevItem === item && prevIndex === i` but user mutated a property in place, both eachData wrappers are structurally identical. `notify()` is the only way to propagate that mutation.
- **[B]** Follow-up: either a future `Signal.set(value, { force: true })` option, or amend the plan's record.
- **[C]** "Fix 1 was over-claimed. I should have caught this during review."

> **Editor's note (synthesizer).** With the each-block rewrite in flight against lit's `repeat`, this specific branch may disappear, change shape, or persist for the same reason. Re-evaluate after the rewrite lands.

### Line-count drift [A, B, C]
- **[A]** `renderer.js` 577 lines vs. plan's <400 target. Bulk of overage: `hydrateAttributes` (parallel ref/real TreeWalker) and `hydrateBlockDirective` (depth-tracking marker walk).
- **[B]** Overshoot is intrinsically mechanical DOM walking. "577 is reasonable given Lit's 528-line hand-written equivalent without hydration."
- **[C]** "LOC came in 1.5-2× higher than planned across the board. Next plan: anchor LOC targets to existing shipped reference code with a 1.5× fudge."

### Positional hydration claim in each [A, B] [EACH IN FLIGHT]
- **[A] — LOAD-BEARING.** Plan promised keyed reconcile; code does positional 1-to-1 claiming at `each.js:332-399`.
- **[A]** Gap: if server and client orders diverge, positional claim puts server-slice-N's DOM inside client-item-M. First paint shows wrong DOM until signals propagate.
- **[A]** Fix shape options: (a) marker format extension to include keys (`v2`), (b) mismatch-detect fallback to nuke-and-rerender.
- **[B]** "In practice: server and client run the same code with the same data, so orders agree. Priority: low — no known repro. Worth a test that forces divergence."

> **Editor's note (D).** A's "third option" framing needs narrowing: the client *can* always recompute keys (`getItemID` is deterministic against client `items`), but the server keys aren't emitted, so there's nothing to compare against. Detect-and-fallback requires emitted server keys OR a heuristic (e.g., sample first/last item and check). A's two-option set is correct; the option space isn't richer than A described.
>
> **Editor's note (synthesizer).** Holds until the each rewrite lands. If the lit-`repeat`-inspired reconciliation brings its own hydration story, this may be subsumed.

### Rename drift [C, D verified]
- **[C]** `bindBlock`/`hydrateBlock` → `bindBlockViaRegistry`/`hydrateBlockViaRegistry`. Also `bindBlockDirective` survives as a shim at `renderer.js:330`.
- **[D]** Confirmed in source. There are three names for two concepts (`bindBlockDirective` → `bindBlockViaRegistry` → block registry lookup); one of those is dead code (see B.1).

### Async block's `resolvedValue` on `self` [C, D]
- **[C]** `async.js:68-70` caches the last-resolved value so success content can re-render while a new promise is pending. Not in plan's async section. "Deserves a one-line comment."
- **[D]** Adds: the "`skipLoadingRender: true` on hydrate so server-rendered loading UI persists" framing is only true for the Promise branch. On a synchronous expression value, hydrate unconditionally re-renders the success content (`async.js:86-90`), discarding what the server produced. Worth a one-line comment explaining this is intentional.

## Cleanup tickets (prioritized)

### From [B], verified by [D]:
1. **Dead method: `hydrateBlockViaRegistry`** — `renderer.js:346-350` defined but never called. `hydrateBlockDirective` at L489 inlines the same logic. Delete.
2. **Inline the thin wrapper: `bindBlockViaRegistry`** — `renderer.js:339-344` wraps a four-line call with one caller (`bindBlockDirective` at L330).
3. **Double expression evaluation in hydrate text bindings.**
   > **Editor's note (D).** Only half-true. Verified in source:
   > - **unsafeHTML hydrate** (`reactive-data.js:182-194`): YES has double eval on non-firstRun. Apply B's fix here.
   > - **Safe text hydrate** (`reactive-data.js:220-226`): NO — branches are structured so exactly one call fires per tick. B's suggested rewrite is slightly cleaner but doesn't reduce call count.
4. **`_nodeSyntax` export with underscore prefix** — `define-block.js:59` exports `nodeSyntax as _nodeSyntax`. Violates "No Underscore Vars". Rename to `nodeSyntaxForTesting` or drop the rename.
5. **`bindBlockDirective` / `hydrateBlockDirective` naming retained** — "Directive" suffix reintroduces the terminology collision the refactor was retiring. Low priority, safe.

### From [A], with [D] update:
- **`evaluateText` silent no-op (`renderer.js:309-312`).** `{#async}` or `{#rerender}` inside `<script>`/`<style>`/`<textarea>` produces empty output with no dev signal.
  > **Editor's note (D).** Worse than A described. Of the five block modules, **only three implement `evaluateText`** — each, conditional, template. `async` and `rerender` have no raw-text handler at all. The silent no-op isn't a missed warning at one call site, it's two real footguns waiting in raw-text contexts. Upgrade priority: **minor → real.**
- **`rerender.js` DRY (render/hydrate/update all repeat guard+lookup prefix).** 5-line extraction. [D verified in source]

## Findings nobody in A/B/C caught [D]

### D.1 Module-level regex with shared `lastIndex` (renderer.js:29)
```js
const ATTR_MARKER_REGEX = new RegExp(`${ATTR_MARKER_PREFIX}(\\d+)${ATTR_MARKER_SUFFIX}`, 'g');
```
`parseAttributeParts` (L186-205) resets `ATTR_MARKER_REGEX.lastIndex = 0` at the top. Safe today (synchronous single-threaded). Footgun if any future recursive call, generator, or async break is introduced. Declare inside the function or document why the reset is load-bearing. Single-line fix either way.

### D.2 `hydrateAttributes` rebuilds HTML string on every call (renderer.js:425)
```js
const { htmlString } = buildHTMLStringPure(ast || this.ast, { snippets: this.snippets });
```
Fires on every hydration pass including recursive `hydrateInnerContent`. The `templateCache` at `renderer.js:26` caches *parsed* templates but not the build-string step. Memoize `buildHTMLStringPure` result by AST identity. Probably not hot-path today; would be if subtree caching lands.

### D.3 Encapsulation break: direct mutation of Template internals (template.js:274)
```js
self.currentInstance.rendered = true;
```
A block directly sets a field on a `Template` instance. No method, no documented contract. If `Template.rendered` changes meaning or becomes computed, this silently rots. Route through a method or move into `Template.clone()`/`Template.initialize()`.

### D.4 `reportBlockError` tracing-gate: add a breadcrumb hint (define-block.js:42) [revised after A rebuttal — see also A.design.1 below]
```js
export function reportBlockError(blockName, node, hook, err) {
  if (!isTracing()) { return; }
  ...
}
```
D initially read this as inverting "loud in dev, quiet in prod" and recommended always firing in `isDevelopment`. **[A] pushed back**: the agent-audience consumes rendered output, not console. Empty region in a screenshot *is* the failure signal; tracing-on is the deliberate "let me dig" step. The current design is right for that audience. D.4's original fix is **retracted**.

**[A]'s replacement proposal:** a minimal always-on hint on first throw per (block, component). Not the full structured log — just a breadcrumb that tells the agent where to dig:

```
[SUI] Block <each> in <UiList> failed. Run setTracing(true) for details.
```

Properties:
- Zero stack capture, zero context allocation. String built from `block.name`, `nodeSyntax(node)`, component name — all already on hand.
- Fires **once per (block, component)** to avoid spam. Track in a module-level `Set` keyed on `${blockName}:${componentName}`.
- Non-recoverable stays the default. The hint is the bridge between "totally silent" and "full structured log" — tells an agent that notices a visibly broken region what action to take next.
- Human developers benefit too: the hint shows in the console even without explicitly opting into tracing.

**Implementation location:** inside `reportBlockError` (or a sibling `reportBlockErrorHint`), fired before the `isTracing()` gate. The tracing-gated expanded output stays as-is for when the agent comes back with tracing on.

### D.5 Server evaluator-swap has no try/finally (server.js:244-250, 295-299)
```js
const savedEvaluator = this.evaluator;
this.evaluator = itemEvaluator;
html += this.renderNodes(node.content, itemData);   // can throw
this.evaluator = savedEvaluator;
```
If `renderNodes` throws, `this.evaluator` stays swapped. Process-wide ServerRenderer errors usually bubble up, but in a resilient pipeline (worker pool reusing instances, error-recovery wrapping) a leaked evaluator poisons subsequent renders. Wrap in try/finally — same pattern at `renderTemplate` (`server.js:295-299`).

### D.6 `serverMeta` marker-parsing is tacit and not extensible (renderer.js:509-514)
```js
for (const part of next.data.split(':')) {
  if (part.startsWith('b')) {
    serverMeta.branchIndex = parseInt(part.slice(1));
  }
}
```
Single-character prefix. No central registry of reserved prefixes. Adding a second field (e.g., `k` for key, `s` for status) is a recipe for silent collision. Factor into `parseBlockMeta(markerData)` with explicit fields and a documented prefix scheme.

### D.7 Template block hydrate does a DOM round-trip (template.js:228-237, 253-272)
`hydrateInnerContent` wraps nodes in a fragment container, hydrates, returns. The block then moves them out of the container back into the live DOM. Correctness move, but two DOM-tree mutations per hydrated snippet/subtemplate. Confirm with the SSR hydration suite whether this shows in profiles.

### D.8 Async hydrate sync-value comment
See "Async block's `resolvedValue`" above — merged with C's note.

## Design recommendations from further A conversations

### A.design.1 Breadcrumb hint on first block throw

See **D.4** above — the agent-audience framing + the one-liner hint proposal. Cross-referenced here so the design-level items stay together.

### A.design.2 Split `tracing` into two orthogonal flags [@semantic-ui/reactivity]

**The design issue.** The current single `tracing` flag conflates two concerns that have very different costs:

1. **"Name this reaction"** — attach `{ message, block, node }` context so debuggers and error reports have breadcrumbs. **Cheap.**
2. **"Capture where every signal mutation came from"** — `captureStackTrace` on every `notify` / `changed`. **Expensive.**

The plan's §Error Machinery only needs (1) on the hot path. Stack traces on throws come from `err.stack` for free — the throw already has them. Mutation-site stack capture is a separate debugger-only feature that shouldn't be default-on anywhere.

**Proposed fix shape.** Split the flag in `packages/reactivity/src/helpers.js`:

```js
let tracing = false;           // context objects, reaction names — cheap
let stackCapture = false;      // captureStackTrace on every mutation — expensive

export const setTracing = (enabled) => { tracing = !!enabled; };
export const isTracing = () => tracing;

export const setStackCapture = (enabled) => { stackCapture = !!enabled; };
export const isStackCapture = () => stackCapture;
```

Guard only the expensive captures behind `isStackCapture()`:

```js
// signal.js Signal.notify()
if (isTracing()) { this.setContext(); }
if (isStackCapture()) { this.setTrace(); }

// signal.js Signal.setTrace() and dependency.js Dependency.setContext()
if (!isStackCapture()) { return; }   // skip captureStackTrace
// ...rest of existing body
```

**Suggested defaults in dev:**
- `setTracing(true)` — on. Context names for debuggers are cheap and broadly useful.
- `setStackCapture(false)` — off. Developers flip to `true` only when chasing a specific "where did this mutation come from" question.

**What this preserves:**
- Reaction-context regression fix (the thing the plan explicitly called out) — stays, because it rides on `isTracing()`.
- Structured error logs — stay, because `err.stack` is free at throw time.
- Full `setStackCapture(true)` debugging mode — stays available, just not default.
- Recovery + try/catch semantics — unchanged.

**Interaction with D.4 / A.design.1.** With the split, `isTracing()` becomes cheap enough to default-on in dev. The breadcrumb hint from A.design.1 still matters because:
- Dev defaults don't reach users running the dev build of downstream components.
- The hint tells agents what action to take when they see a visibly broken region — that's a product decision, not a performance one.

Both changes should land together, in this order: split the flag (A.design.2), then add the hint (A.design.1) so it can rely on the cheap `isTracing()`.

## Retired findings

> **Editor's note (synthesizer).** None of A/B/C's findings were fully retired by D's source verification — most were confirmed. B.3's "safe text hydrate has double eval" was downgraded (half-right, see ticket #3 note). Everything else stands.

## Follow-up plan seeds

### [B]:
- **Keyed each hydration.** [EACH IN FLIGHT] — may be resolved by the rewrite.
- **Signal force-notify option.** `Signal.set(value, { force: true })` bypasses deep-equality short-circuit. [EACH IN FLIGHT] — may become unnecessary depending on rewrite shape.
- **Subtree cache for native.** Lit's `renderTrees` + `WeakRef` pattern caches subtree renderers. Native currently caches parsed HTML but not subtree renderers. Dedicated plan if each-block's per-item renderer allocations show up in profiling.
- **`report()` block-author reporter.** Yellow-severity public `report(field, expression, message, { data, severity })` for edge cases the compiler can't catch.

### [D]:
- **Dev-mode error visibility pass.** D.4 is the pointy end; broader audit may surface other places where dev-visible diagnostics depend on tracing being explicitly enabled.
- **serverMeta protocol versioning.** D.6 is small today; becomes painful as more marker metadata is added. Cheapest to formalize before the second field lands.

## Process patterns worth carrying forward [C]

- **Fresh-take critique before landing.** Cheap (~1h), changed the plan materially. Budget for the next refactor of similar scope.
- **Publish decision records alongside benchmarks.** Without `signature-benchmark-analysis.md`, a future contributor would see the positional-vs-destructured delta and not know whether the convention was intentional.
- **Stable checkpoint at every step, no exceptions.** "Fix tests next commit" erosion compounds fast; the discipline held here is the reason there's nothing to dig out.

## What to do differently next time [C + D]

- **[C]** Scope LOC with optimistic + realistic ranges anchored to existing reference code (lit = ~500 for renderer; expect ~1.5× for extraction overhead).
- **[C]** Flag "this likely eliminates the branch" claims as provisional until verified.
- **[C]** Don't draw hot-path carve-outs without measurements.
- **[D]** **Build in a fresh-eyes review step after landing,** separate from the plan-coauthor review pass. A/B/C all reviewed their own planning work, which is why D caught three stable-surface items (D.3, D.4, A.2 gap) and one half-wrong claim (B.3). The planning-review/landing-review distinction is worth making explicit.

## Priority ordering (merged read from D)

**Load-bearing (address before calling this phase done):**
- **A.design.2** — split `tracing` into `tracing` + `stackCapture`. Unlocks cheap context-naming as a dev default, removes the performance excuse for gating breadcrumbs. Prereq for A.design.1.
- **A.design.1 / D.4** — add one-liner breadcrumb hint on first throw per (block, component). Lands after the flag split.
- **D.3** — Template encapsulation break is a latent coupling.
- **A.2 + gap** — async/rerender in raw-text contexts silently produce nothing.

**Short, safe wins (land alongside other work):**
- B.1 (dead method), B.2 (collapse wrapper), B.4 (drop underscore), A.3 (rerender DRY).
- Half of B.3 — unsafeHTML double-eval only.
- D.5 — try/finally around evaluator swap, two spots.

**Deferred until each.js rewrite settles:**
- A.1 positional hydration concern.
- Each fix-1 branch note.
- D.7 hydrate round-trip perf note.
- B's "keyed each hydration" and "Signal force-notify" seeds.

**Nice-to-have:**
- D.1 regex footgun, D.2 rebuild memoization, D.6 serverMeta parser, D.8 async sync-value comment, B.5 naming.

## Suggested order of operations for follow-up work

1. Let the each.js rewrite (lit-`repeat`-inspired) land and stabilize. Re-run tests, confirm the one failing test closes.
2. Land the **short, safe wins** — all outside `each.js`, won't conflict.
3. **A.design.2** flag split in `@semantic-ui/reactivity` — two-file change (`signal.js`, `dependency.js`, plus `helpers.js`). Low blast radius; unlocks (4).
4. **A.design.1 / D.4** — add the breadcrumb hint in `define-block.js` after (3) lands. Agent-audience shape; keep the full structured log behind `isTracing()`.
5. **D.3** fix — expose a method on `Template` for `rendered = true` semantics.
6. Add `evaluateText` to `async` and `rerender`, or add a dev-mode warning at the registry lookup (A.2).
7. Re-evaluate the deferred each-block items against the rewritten code.
8. Don't revert the improvements in §"Judgment calls that improved on the plan."

## Places reviewers specifically recognized

- **[C]** `ai/workspace/signature-benchmark-analysis.md` — the decision-record template
- **[C]** `define-block.js:72-88` — the structured-log implementation
- **[C]** `blocks/template.js:179+` — snippet + subtemplate unification, judgment beyond spec
- **[C]** `blocks/each.js:262-276` — honest drift acknowledgment in a code comment [EACH IN FLIGHT: may move]
- **[C]** Commits `99d0f1d6e` through `16e71d20b` — sequencing discipline visible in the log
- **[D]** `each.js:172-280` — genuine lit-style head/tail keyed reconciliation (not a drop-in) — carry the quality into the rewrite

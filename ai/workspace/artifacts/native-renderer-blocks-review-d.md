# Native Renderer Blocks — Review D

> **Reviewer framing.** I did not coauthor the plan, did not coauthor the architecture doc, and did not review earlier iterations. My read is from the source as it sits at `33b84d279`, checked against the claims in reviews A, B, and C.
>
> **Scope caveat.** User flagged `blocks/each.js` as in-flight during this review. I verified structural claims there (line numbers, marker handling) but held back critique on reconciliation shape and the positional-hydration debate — those are moving. Everything else is stable surface.

## Headline

The stable surfaces (`define-block.js`, `renderer.js`, `reactive-data.js`, `server.js`, the non-each blocks) are in solid shape. A and B's cleanup tickets check out. C's process praise is accurate but some of its architectural praise is softer than it reads — see the findings below where I think A/B overstated, understated, or missed.

My bottom line differs from C's: this isn't "well-executed refactor, polish remaining." It's "well-executed refactor with **a handful of stable-surface issues nobody in A/B/C caught** — small, but real."

## Verified claims from A/B/C

**[B.1 / Dead method `hydrateBlockViaRegistry`]** Confirmed. `renderer.js:346-350` is defined. `hydrateBlockDirective` at `renderer.js:489-533` inlines the same block-registry dispatch directly at `529-531` and does not call the "ViaRegistry" method. Delete `346-350`.

**[B.2 / `bindBlockViaRegistry` thin wrapper]** Confirmed. `renderer.js:339-344` has exactly one caller (`bindBlockDirective` at `330-333`). The wrapper adds no value. Inline or delete.

**[B.4 / `_nodeSyntax` underscore export]** Confirmed. `define-block.js:59` — `export { nodeSyntax as _nodeSyntax };`. This violates the "No Underscore Vars" convention recorded in MEMORY.md. Rename to `nodeSyntaxForTesting`, or export `nodeSyntax` unrenamed (the comment already flags it as not-public-surface).

**[B.5 / `bindBlockDirective`/`hydrateBlockDirective` naming retained]** Confirmed. The "Directive" suffix reintroduces the exact terminology collision the refactor was retiring. Low priority but the rename is safe.

**[A.2 / `evaluateText` silent no-op]** Confirmed at `renderer.js:309-312`. Additionally: of the five block modules, **only three implement `evaluateText`** (each, conditional, template). `async` and `rerender` have no raw-text handler. That means `{#async}` or `{#rerender}` inside `<script>` / `<style>` / `<textarea>` evaluates to empty with no diagnostic. A flagged the no-op; the missing coverage on two blocks makes the footgun worse than A described.

**[A.3 / `rerender.js` DRY]** Confirmed. Lines `34-45`, `47-53`, `70-81` all repeat the `if (node.key) Reaction.guard(...); if (node.expression) lookupExpression(...);` prefix. 5-line extraction.

## Where reviewers were overstated or wrong

### B.3 (double expression eval) is half right

Reactive-data.js has **one** double-eval, not two:

- **unsafeHTML hydrate** (`reactive-data.js:182-194`): YES. Line 183 evaluates to register deps, line 187 evaluates again to read on non-firstRun. B's suggested collapse is valid here.
- **Safe text hydrate** (`reactive-data.js:220-226`): NO. The branch is structured so exactly one `lookupExpression` call fires per reaction tick — firstRun calls line 222, non-firstRun calls line 225. They're in separate branches. B's suggested rewrite makes the code more readable but doesn't reduce call count.

Take B's fix for the unsafeHTML path. The safe text path can stay as-is (the current structure is slightly more explicit about the firstRun contract).

### A's positional-hydration framing is directionally right, but the fix landscape is wrong

A's "marker format extension vs. detect-and-fallback" framing misses a third option: **the keys can already be recomputed on the client** because `items` are in client data, and `getItemID` is deterministic. The problem isn't "server didn't emit keys." It's "positional claim assumes server-emit-order === client-iterate-order." A mismatch-detect that compares `items.map(getItemID)` against... wait, it can't compare against anything, because server keys aren't emitted.

So A is actually right that one of the fix shapes needs marker-format extension. The *detect* part doesn't need it (you can always recompute client keys), but the *compare* part does (you need server keys to compare against). Leaving this note for when each.js work resumes — the choice isn't as binary as A framed, but neither is the option set richer than A said.

### C's "plan fidelity is genuinely high" needs an asterisk

Plan fidelity is high **as measured against the plan the reviewers helped write**. All three reviewers were coauthors. Cross-validation between self-reviews is weaker than it looks. I don't have standing to re-judge the plan, but a fresh eye on this code (which is what D is supposed to be) sees normal refactor shape — good in many places, rough in some places nobody caught.

## Findings nobody in A/B/C flagged

### D.1 Module-level regex with global flag (renderer.js:29)

```js
const ATTR_MARKER_REGEX = new RegExp(`${ATTR_MARKER_PREFIX}(\\d+)${ATTR_MARKER_SUFFIX}`, 'g');
```

Used in `parseAttributeParts` (renderer.js:186-205), which explicitly resets `ATTR_MARKER_REGEX.lastIndex = 0` at line 191. Current call sites are synchronous and single-threaded — fine today. But a module-level `/g`-flagged regex with shared `lastIndex` is a footgun: any future recursive call, generator, or async break will silently desync. Either declare it inside the function, or document why the reset is load-bearing. Single-line fix either way.

### D.2 `hydrateAttributes` rebuilds the HTML string every call (renderer.js:425)

```js
const { htmlString } = buildHTMLStringPure(ast || this.ast, { snippets: this.snippets });
```

This happens on every hydration pass — including recursive `hydrateInnerContent` calls. `buildHTMLStringPure` walks the full AST to produce a string that's used solely to create a reference DOM for attribute-position lookup. The `templateCache` at `renderer.js:26` caches parsed templates keyed by htmlString, but *building* the string isn't cached. For deeply nested blocks with many `hydrateInnerContent` invocations (each block's inner hydrate), this re-walks the same AST repeatedly.

Cheap fix: memoize `buildHTMLStringPure` result by AST identity. Probably not hot-path today; would be if subtree caching lands.

### D.3 Encapsulation break: direct mutation of Template internals (template.js:274)

```js
self.currentInstance.rendered = true;
```

A block directly sets a field on a `Template` instance. No method, no documented contract. If `Template.rendered` changes meaning or becomes computed, this silently rots. Should go through a method on `Template` or be moved into `Template.clone()`/`Template.initialize()`. Small, safe change.

### D.4 `reportBlockError` is gated on `isTracing()`, not on dev mode (define-block.js:42)

```js
export function reportBlockError(blockName, node, hook, err) {
  if (!isTracing()) { return; }
  ...
}
```

With recovery on and tracing off — a plausible dev default — block errors are completely swallowed. The region gets cleared, the reaction stops, and the developer sees nothing. This is the opposite of the usual "loud in dev, quiet in prod" stance. C praised the error machinery as "field-ready for agentic iteration"; it's field-ready for *tracing-on* agents. A dev hitting this in a browser won't get a signal.

Suggested fix: always fire at least `console.error(header)` when `isDevelopment`, and gate the *expanded* output (groupCollapsed, stack) on `isTracing()`.

### D.5 Server evaluator-swap has no try/finally (server.js:244-250, 295-299)

```js
const savedEvaluator = this.evaluator;
this.evaluator = itemEvaluator;
html += `<!--sui-each-item:v1:${i}-->`;
html += this.renderNodes(node.content, itemData);   // can throw
html += `<!--/sui-each-item:v1:${i}-->`;
this.evaluator = savedEvaluator;
```

Same pattern at `renderTemplate` (`server.js:296-299`). If `renderNodes` throws, `this.evaluator` stays swapped. Process-wide ServerRenderer errors usually terminate the render call and bubble up, but in a resilient pipeline (worker pool reusing ServerRenderer instances, or error-recovery wrapping), a leaked evaluator poisons subsequent renders. Simple wrap in try/finally.

### D.6 `serverMeta` marker-parsing is tacit and not extensible (renderer.js:509-514)

```js
for (const part of next.data.split(':')) {
  if (part.startsWith('b')) {
    serverMeta.branchIndex = parseInt(part.slice(1));
  }
}
```

Single-character prefix (`b` = branchIndex). There's no central registry of what prefixes are defined or reserved. Adding a second field (e.g., `k` for key, `s` for status) is a recipe for silent collision down the line. Factor into a `parseBlockMeta(markerData)` helper with explicit fields, and document the prefix scheme somewhere that isn't a parse loop.

### D.7 Template block hydrate does a DOM round-trip (template.js:228-237, 253-272)

The snippet branch:
```js
hydrateInnerContent({ ownedNodes: region.ownedNodes, innerAST: snippet.content, data: snippetData, scope });
const frag = document.createDocumentFragment();
for (const n of region.ownedNodes) { frag.appendChild(n); }
region.anchor.after(frag);
```

`hydrateInnerContent` wraps nodes in a document fragment container (`renderer.js:540-543`), hydrates, and returns. The block then moves them out of the container and back into the live DOM. This is a correctness move — the nodes have to come out of the container — but it's two DOM-tree mutations per hydrated snippet. The subtemplate branch (template.js:253-272) does the same round-trip with more steps.

Not a correctness bug, just a measurable hot-path cost in complex hydrations. Would want to confirm with the SSR hydration test suite (`test/browser/ssr-hydration.test.js`, 79 tests) whether this shows up in profiles.

### D.8 Async hydrate loads a microtask into the pipeline unconditionally (async.js:123-128)

```js
hydrate(ctx) {
  evaluateAndRender(ctx, { skipLoadingRender: true });
}
```

`evaluateAndRender` evaluates the expression. If the expression returns a Promise, `.then` / `.catch` are attached and the server's rendered loading content stays until resolution — correct. But *every* async hydrate attaches these callbacks, even in cases where the expression is synchronous. Line 86-90 handles sync cleanly. No bug, but a subtle behavior: a synchronous `{#async}` value on server *and* client re-renders the success branch unconditionally during hydrate (line 89 `renderState`). For components where SSR already rendered the sync success state, this re-runs the render immediately, discarding what the server produced. Expected? Worth a line comment; C's "`skipLoadingRender: true` on hydrate so server-rendered loading UI persists" framing is only true for the Promise branch.

## Agreement with A/B/C

These calls by A/B/C match what I found in the source:

- Two-level context bag used exactly as `template.js:182-193` shows [B].
- `isItemContext` WeakSet is a cleaner boundary than the prior flag [B].
- Per-item server markers land at `server.js:247-249` [A, B].
- `isClient`/`isServer` conditional carve-out is present at `conditional.js:74-83` and is correctly reasoned [A, C].
- Empty-items fast-path at `each.js:458-477` (matches the claim even with different line numbers from review drift) is well-scoped [A, B, C].
- `createCache` extraction is clean [A, C].
- Honest code-comment at `each.js:262-276` acknowledging the plan was wrong on fix-1 is real and worth preserving [B, C].
- `reconcile` at `each.js:172-280` is genuine lit-style head/tail reconciliation, not a drop-in. That's more sophisticated than B's "biggest block, earned it" framing suggests — worth explicit recognition if each.js is the active surface.

## Priority ordering (my read)

Load-bearing (address before calling this phase done):
- **D.4** — silent errors in dev hurt the stated agentic-iteration goal. Small fix.
- **D.3** — Template encapsulation break is a latent coupling.
- **A.2 + the two missing evaluateText impls** — async/rerender in raw-text contexts silently produce nothing.

Short, safe wins (land alongside any other work):
- B.1 (delete dead method), B.2 (collapse wrapper), B.4 (drop underscore), A.3 (rerender DRY).
- Half of B.3 — unsafeHTML double-eval only.
- D.5 — try/finally around evaluator swap, two spots.

Deferred until each.js stabilizes:
- A.1 positional hydration concern (reviewed structurally; critique held per user instruction).
- My D.7 round-trip perf note (adjacent to each-block hydration patterns).

Nice-to-have:
- D.1 regex footgun, D.2 rebuild memoization, D.6 serverMeta parser, D.8 async hydrate comment, B.5 naming.

## What I'd want before signing off

1. A test that forces the unsafeHTML hydrate path and measures the extra `lookupExpression` call — before fixing, confirm the cost is measurable. B's perf claim was asserted, not measured.
2. A test that renders `{#async expr}` inside `<script>` and asserts the output. I suspect it silently produces empty content; if so, A.2 is upgraded from "minor" to "real footgun."
3. Answer from whoever wrote `reportBlockError` on whether the tracing-gate was intentional dev-mode silence or just an oversight. D.4 hinges on the answer.

## Net

Reviews A, B, C converged partly because they were written by agents involved in the plan. The stable surfaces are good but not as clean as the self-reviews suggest — three items nobody caught (D.1, D.3, D.4) are in core paths, and one reviewer claim (B.3) is only half-right. The each-block critique from A deserves the load-bearing priority A gave it, but the fix landscape is narrower than A described. C's process praise stands independent of the code critique and is fair.

Recommendation to the user: treat A/B/C + D as a merged punch list, prioritize D.3/D.4 and the small B/A wins this cycle, and defer the each-block debate (A.1, D.7) until the in-flight work settles.

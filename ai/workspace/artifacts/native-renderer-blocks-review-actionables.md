# Native Renderer Blocks — Actionables

> Distilled from `native-renderer-blocks-review-synthesis.md` (which merged reviews A, B, C, D and later design conversations with A). This document lists **what** to do, ordered easiest to hardest. **How** is left to the implementing agent — see the synthesis for context and rationale.
>
> **Status gate:** Items marked **[DEFERRED]** wait on the in-flight `each.js` rewrite (lit-`repeat`-inspired). Everything else is landable now.

## Trivial cleanup

1. Delete the unused `hydrateBlockViaRegistry` method at `renderer.js:346-350`.
2. Drop the underscore prefix on the `nodeSyntax` test export at `define-block.js:59`.
3. Resolve the `bindBlockViaRegistry` thin wrapper at `renderer.js:339-344` (inline into its sole caller or remove).
4. Wrap the two evaluator-swap blocks in `server.js` (the `renderEach` loop around L244-250 and `renderTemplate` around L295-299) so a throw restores the evaluator.
5. Address the module-level `/g`-flagged regex at `renderer.js:29` that relies on `lastIndex` reset (`renderer.js:191`).
6. DRY up the repeated `Reaction.guard` + `lookupExpression` prefix across `rerender.js` render / hydrate / update hooks.

## Small fixes

7. Collapse the double `lookupExpression` call in the **unsafeHTML** hydrate path at `reactive-data.js:182-194`. Note: the safe-text path at `reactive-data.js:220-226` does **not** have this issue despite B's original review claiming both did — leave it alone unless a readability pass is specifically wanted.
8. Rename `bindBlockDirective` / `hydrateBlockDirective` to drop the "Directive" suffix (reintroduces the exact terminology collision the refactor set out to retire).
9. Add a one-line comment to `async.js` explaining `self.resolvedValue` caching (the "re-render success while a new promise is pending" case).
10. Add a one-line comment to `async.js` hydrate noting that the `skipLoadingRender: true` behavior differs between the Promise branch (preserves server loading UI) and the sync-value branch (unconditionally re-renders success content).
11. Factor the ad-hoc `serverMeta` marker parsing at `renderer.js:509-514` into a named helper with documented reserved prefixes.

## Feature / coverage work

12. Close the `evaluateText` gap — either add implementations to `async.js` and `rerender.js`, or emit a dev-mode warning at the registry lookup site (`renderer.js:309-312`) when a block in raw-text context has no handler. Currently `{#async}` and `{#rerender}` inside `<script>` / `<style>` / `<textarea>` silently produce empty output.
13. Replace the direct field mutation `self.currentInstance.rendered = true` at `template.js:274` with a proper method on `Template`.
14. Memoize `buildHTMLStringPure` by AST identity for the `hydrateAttributes` path at `renderer.js:425` — only if profiling shows it matters.

## Design-level (land in this order)

15. Split the `tracing` flag in `@semantic-ui/reactivity` into two orthogonal flags: one for cheap reaction/context naming, one for expensive per-mutation stack capture. Default the cheap flag on in dev; leave the expensive flag off.
16. After (15): add an always-on one-liner breadcrumb on first block throw per `(block, component)` pair in `define-block.js`. Full structured log stays behind the tracing flag. The breadcrumb exists so an agent that sees a visibly broken region knows what action to take next.

## Deferred until the each.js rewrite stabilizes

- **[DEFERRED]** Re-evaluate the positional-vs-keyed hydration concern (A's load-bearing item) against the rewritten reconciliation.
- **[DEFERRED]** Re-evaluate whether the `.set()`/`.notify()` branch is still needed, or whether a `Signal.set(value, { force: true })` option would collapse it.
- **[DEFERRED]** Re-check the hydrate DOM round-trip (container → hydrate → move back) in `template.js:228-237` and `template.js:253-272` against whatever shape the new each-block uses.
- **[DEFERRED]** Confirm the empty-items fast-path and `isClient`/`isServer` carve-out still make sense in the rewritten code.

## Preserve (do not revert)

- Snippet + subtemplate unification in `template.js` (was commit `c30e3cd92`).
- `isClient`/`isServer` exemption from hydration mismatch warning in `conditional.js:74-83`.
- Empty-items fast-path in each update (was commit `6daa0c414`).
- `createCache` extraction to `@semantic-ui/utils`.
- The `lookupExpression` rename and 2-arg positional signature on that hot path.
- Two-level context bag pattern in `define-block.js` / block `create()` hooks.
- Honest code-comment at the fix-1 branch acknowledging the plan's over-claim.

## Notes

Three hand-offs from B to the implementing agent.

### Ticket 15 (`tracing` flag split) is the concrete fix for the PR #136 tachometer regression

The prod benchmarks at <https://github.com/Semantic-Org/Semantic-Next/pull/136#issuecomment-4237122654> show broad 2-20% regressions (worst: `remove-5-back` 13-19%, `clear` 3-24% p95, `edit-save` 11-17%, `select` 9-20%). The regression shape — proportional to block count, worst on disposal-heavy and per-item ops — is consistent with reaction-context construction paying for `captureStackTrace` on every mutation. Not try/catch, not `buildBag`, not closure allocation — those were my guesses before I understood the current `tracing` flag conflates cheap context naming with expensive stack capture.

After landing (15), **re-run tachometer and expect most of the regression to close**. If it doesn't, profile again before reaching for try/catch-removal or bag-interning — those are bigger surgeries and the single-flag split probably covers the ground.

### Ticket 16 dedup is load-bearing

The breadcrumb fires "once per `(block, component)` pair" — the mechanism is a module-level `Set` in `define-block.js` keyed on `${blockName}:${componentName}`. Without dedup, an error inside a 1000-item `{#each}` writes 1000 breadcrumbs per tick and becomes the problem it was supposed to flag.

Key shape matters: `${blockName}:${componentName}` not `${blockName}:${nodeId}` — same `{#each}` in the same component should fire once across all instances, not once per item. The cross-instance dedup is what makes the breadcrumb valuable at list scale.

### Ticket 12 recommendation: prefer the dev-mode warning over adding `evaluateText`

Lean toward option (b) — emit a dev-mode warning at the registry lookup site in `renderer.js:309-312` — rather than adding `evaluateText` to `async.js` and `rerender.js`.

Rationale: raw-text contexts (script / style / textarea / title) can't meaningfully host `{#async}` or `{#rerender}`. There's no reactive DOM inside these elements — content becomes `textContent`, set once per reaction. `async` with no DOM to update means the UI can't transition loading → success → error; `rerender` means nothing because the re-render destination is a string that's already recomputed on every read. Adding `evaluateText` implementations would ship semantically incoherent behavior.

The warning says "block type X cannot appear in raw-text context (script/style/textarea); use Y instead" and the user fixes their template. This is the honest answer; the silent no-op is the bug.

## Notes from C (architecture-plan coauthor)

Adding to B's hand-offs above. These are context from the iteration that isn't obvious from the synthesis — for whichever agent picks these up.

### Item 16 must NOT be gated by the new cheap `isTracing()`

After the flag split (ticket 15), the breadcrumb hint in ticket 16 is the one thing that must fire in the zero-overhead path, unconditionally. If you're tempted to gate it behind the new cheap `isTracing()` flag "for symmetry with the structured log" — don't. The whole point is that the breadcrumb points an agent at the next action (`setTracing(true)` and reload) when they see a visibly broken region. Gating it defeats the bridge role — agents would be back to "silently broken output, no console hint" which is the problem A/B/C kept circling.

Gate the verbose structured log (existing `reportBlockError` body). Don't gate the one-line hint.

### Preserve the "non-recoverable as default" framing in any future contributor-facing docs

The design conversation converged on: *non-recoverable with visible-broken-region is a feature, not a bug.* An agent looking at a screenshot needs binary pass/fail; a silent console log they might miss is strictly worse than a broken render they can't ignore. The breadcrumb exists as the minimal bridge — not as a softening of the non-recoverable default.

If a future contributor proposes "let's just silently clear the region and log the error" in the name of production-friendliness, that's regressing the agent feedback loop. The current three-state design (visibly broken + cheap breadcrumb + opt-in structured log) serves the primary audience (agent) without punishing the secondary audience (human dev with console). Don't collapse that back into "one flag, one behavior."

### Item 13 — look before settling on a shape

"Add a method on Template" understates the question. `self.currentInstance.rendered = true` is a state transition. Before picking a shape:

1. Grep all `rendered` reads on `Template` — if they all mean "has this instance ever been rendered," the cleanest fix is a `markRendered()` method with a private field, not an exposed setter.
2. Check if `rendered = true` could be folded into `initialize()` or `render()` itself — if the current write always happens after a successful render, the flag is describing something the render method already knows.
3. If there's meaningful "un-mark" semantics elsewhere (re-render cycles clearing it), the setter form is honest and you want `setRendered(bool)`, not a boolean method.

The right shape falls out of how `Template` already uses the field. Don't commit to an API before answering that.

### Deferred each.js items — don't retire them on shape change alone

When the lit-`repeat`-inspired each rewrite lands, resist the urge to mark the deferred items "resolved" just because the code changed. The positional-vs-keyed hydration, the `isItemContext` coupling to `template.js`, the `.set()`/`.notify()` branch — these are semantic questions about what each-hydration *guarantees* to client code, not just details of the current implementation.

Each deserves an explicit "here's what the new code does about it" answer before deletion from the deferred list. A shape change that silently drops a semantic concern is the same bug in new code. Example: if the rewrite uses lit-`repeat`'s keyed reconciliation end-to-end, the positional-hydration concern genuinely dissolves — but the `isItemContext` coupling is a question about how the template block detects item-scope, which may or may not survive the rewrite on its own terms. Answer both explicitly.

## Notes from A (plan coauthor, wrote the review)

Adding to B and C above. Four process-level points about how to execute (15) and (16) — the load-bearing tickets — that the synthesis implies but doesn't spell out.

### Land ticket 15 alone. Verify with a fresh baseline.

B's note correctly identifies (15) as the fix for PR #136's tachometer regression. The matching process discipline: **do not bundle (15) with (16), with any trivial-cleanup item, or with anything else**. Its own commit, its own PR if possible.

Reason: if the regression doesn't close after landing (15), the diff has to be minimal enough to diagnose in minutes. Bundling makes bisection a nightmare, and "why did our fix not work" is the exact scenario where you need bisection most. Classic bisectability — the commit graph pays you back when things go wrong.

Process:
1. Run tachometer on current `main` (or the PR #136 tip) to get a fresh local baseline. Don't trust the CI numbers from the PR comment as your pre-fix reference — different machine, different thermal state, different NODE_ENV. You need apples-to-apples with the post-fix run.
2. Land (15), nothing else. Re-run tachometer.
3. Expect most of the regression to close (B's claim — I agree). If it doesn't close, profile before touching try/catch, bag allocation, or anything bigger. The single-flag split should cover it; if it doesn't, the next hypothesis needs to come from the profile, not from guessing.

### (15) is technically a breaking API change for downstream callers

Current `setTracing(true)` enables both cheap context naming *and* expensive stack capture, as one unit. After the split, `setTracing(true)` only enables cheap naming; `setStackCapture(true)` is the new opt-in for stack capture.

Anyone outside the framework calling `setTracing(true)` expecting stack captures will silently lose them. Low risk because tracing was never a public feature people built tooling on top of, but:

- Note it in the release/changelog as a breaking change for the tracing API.
- Consider whether the component-level `setTracing` at `packages/component/src/helpers.js:4-7` should turn *both* flags on by default (for back-compat with anyone who was using the component-level setter to get the full diagnostic surface) while reactivity's `setTracing` only controls the cheap flag. Two reasonable shapes; pick deliberately.

### Don't assume the cheap `isTracing()` path is free — measure it

After (15), we're defaulting `setTracing(true)` in dev. The cheap path still allocates a context object via spread per `Signal.set()`:

```js
// signal.js Signal.setContext()
this.context = { ...defaultContext, ...additionalContext };
```

This is 10–100× cheaper than `captureStackTrace` — not free. At 1000-item each-loop mutation bursts, you're still allocating 1000 context objects per tick. V8 escape analysis *might* eliminate them if the context never leaks beyond the allocation site, but it might not.

After landing (15), run one extra tachometer pass with `setTracing(false)` vs `setTracing(true)` (both with `setStackCapture(false)`) to confirm the default-on-in-dev is actually free. If it shows meaningful cost, a second refinement becomes obvious: lazy context construction — only build the context object when something reads it (e.g., via a getter on `this.context`). Don't do that refinement speculatively; the measurement tells you if you need it.

### Ticket 16 dedup key: be explicit about which "component" means

B's note correctly says the dedup key is `${blockName}:${componentName}` so a 1000-item `{#each}` doesn't spam 1000 breadcrumbs. The question B's note doesn't answer: *what is `componentName` concretely?*

The right answer is `element.localName` — the custom-element tag name of the nearest enclosing component (e.g., `ui-list`, `ui-form`). Two sibling `<ui-list>` instances on the same page share the dedup key. Two different component types (`<ui-list>` vs `<ui-form>`) each get their own breadcrumb.

What to avoid:
- **Instance ID** — every `<ui-list>` instance gets its own breadcrumb. At a list of 20 sibling lists, this is 20 breadcrumbs.
- **AST node ID** — every block position gets its own breadcrumb within the same component.
- **Component's rendered DOM id** — usually unset; when set, inconsistent.

`element.localName` is available via the nearest enclosing component element on the scope. If the scope doesn't trivially surface that, the implementing agent should extract a lightweight `getEnclosingComponentName(scope)` helper rather than picking a less-stable identifier for convenience. The cross-instance dedup is the whole point of the feature.

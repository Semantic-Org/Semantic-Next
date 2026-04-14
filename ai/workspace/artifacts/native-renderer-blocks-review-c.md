# Native Renderer Blocks — Review from the Architecture-Plan Coauthor

> **Reviewer:** coauthored `native-renderer-blocks-architecture.md` (the API-shape plan that merged into `native-renderer-blocks.md`) and was the primary critic across the ~35 rounds of iteration. This review is framed manager-style: what deserves explicit recognition, honest observations of drift, process patterns to carry forward.

## What the team did exceptionally well

### 1. Measurement-driven judgment on the signature convention

This is the single thing I'd highlight hardest. A plan decision that could easily have become "uniform destructured because we decided" was instead run through tachometer, measured at 9–28% per-call slower, contextualized against real-render scales, and explicitly applied against the plan's own tiering rule. The resulting decision stayed destructured, but the reasoning was published in `ai/workspace/signature-benchmark-analysis.md` with the caveats, the follow-up trigger (3× delta or parity = revisit), and a regression-guard bench left in-tree at `packages/renderer/bench/tachometer/signature.js`.

That is the right shape for this class of judgment call. The next plan proposing an API convention with perf implications should use this as the template.

### 2. Commit-sequencing discipline held under real pressure

Nine commits (99d0f1d6e → 16e71d20b), each a standalone refactor, tests green at every boundary. No squashed-at-the-end shortcuts, no "we'll fix the failures next commit" compromises. The plan said stable-checkpoint discipline was load-bearing; the commit log is proof it held.

Step 9 (per-item markers + honest each-hydration) was flagged as the riskiest cross-cutting change in the plan — it landed last, against a stable decomposition. That sequencing is the payoff: if a regression shows up from step-9's diff, it's isolated.

### 3. Judgment calls that improved on the plan

Three places where the implementation diverged and was right:

- **Snippet + subtemplate unified into `template.js`** (c30e3cd92). The plan had them as separate modules with parallel dispatch. The merge is a straight simplification — one resolution path, kind locked at first render. Better than what I proposed.
- **`isClient`/`isServer` exempt from hydration mismatch warning** (`blocks/conditional.js:75-83`). Without this carve-out, every legitimate environment-guard template would spam the dev console. Small, well-reasoned.
- **Empty-items fast-path in each update** (`blocks/each.js:420-434`, commit 6daa0c414). Avoids the Map allocation for the krausest "clear" case. Post-landing perf discipline, not accidental scope — the code comment even names the benchmark.

### 4. Honest code-comment acknowledgment where the plan was wrong

`each.js:184-191` still has the `notify()` branch the plan said would be eliminated. The surrounding comment is candid: *"Same ref at same position — isEqual short-circuits on a === b, so explicit notify is the only way in-place mutations propagate."*

Plans are rarely 100% right. The correct response when a plan is wrong is to document the compromise in the code where the next reader will encounter it — not to force a "fix" that recreates a different bug. This is that correct response.

### 5. Post-landing perf and refactor follow-ups show continued ownership

- Empty-items fast-path (6daa0c414)
- `createCache` extracted to `@semantic-ui/utils` (ebd3adfda + 33b84d279)
- Dynamic-table production pattern locked in a regression test (2ae654e10)
- Unify snippet dispatch (c30e3cd92)
- Unused import removed (f51445a5b)

That's a team that kept treating the work as alive after the "land the plan" commit rather than walking away.

## Where reality drifted from the plan (honestly)

1. **LOC came in 1.5-2× higher than planned across the board.** `renderer.js` 577 vs ~350; `each.js` 481 vs ~250; `reactive-data.js` 249 vs ~140. The plan later dropped explicit LOC targets and anchored to lit's ~500, which saved face, but the early estimates under-counted by roughly the same factor in every block. Next plan: anchor LOC targets to existing shipped reference code (lit) with a 1.5× fudge for the extraction-means-more-explicit-code pattern, not against aspirational targets.

2. **Fix 1 was over-claimed.** The plan said "fresh wrapper eliminates `notify()` branching." Reality: the wrapper helps but doesn't cover same-ref-in-place-mutation. The plan should have said "reduces to one path except when..." up front. I should have caught this during review.

3. **Rename drift:** `bindBlock`/`hydrateBlock` → `bindBlockViaRegistry`/`hydrateBlockViaRegistry`. Longer but self-documenting. Also: `bindBlockDirective` survives as a shim at `renderer.js:330`. Worth checking whether the shim has callers; if not, collapse it.

4. **Async block's `resolvedValue` on `self`** (`async.js:68-70`) caches the last-resolved value so success content can re-render while a new promise is pending. Not described in the plan's async section. Probably deliberate but deserves a one-line comment explaining the case it handles.

## Process patterns worth carrying forward

- **Fresh-take critique before landing.** The plan went through an opus critique that flagged 8 showstoppers pre-execution; most were addressed or deliberately accepted with rationale. Cheap (~1h), changed the plan materially. Budget this for the next refactor of similar scope.
- **Publish decision records alongside benchmarks.** Without `signature-benchmark-analysis.md`, a future contributor would see a positional-vs-destructured delta and not know whether the convention was intentional. The record makes intent durable.
- **Stable checkpoint at every step, no exceptions.** The easy erosion ("fix tests next commit") didn't happen. It compounds fast when it does — the discipline here is the reason there's nothing to dig out of later.

## What I'd do differently next time

- **Scope LOC with optimistic + realistic ranges** anchored to existing reference code. Plan-level optimism costs credibility when the implementation lands; honest ranges land honest.
- **Flag "this likely eliminates the branch" claims as provisional** until verified. Fix-1 is a specific case of the general pattern where plans state a consequence without proving it. A "verify in implementation" tag would catch it.
- **Don't draw hot-path carve-outs without measurements.** The signature convention started with an ad-hoc `lookupExpression` exception; the benchmark made it principled. Measure before carving should be the default when perf is in the plan's prose.

## Net

Well-executed refactor that treated the plan as scaffolding rather than scripture. Where the implementation diverged, it diverged thoughtfully and documented why. Where the plan was wrong, the code is candid about it. The process discipline visible in the commit log — sequencing, stable checkpoints, measurement-driven calls, post-landing perf follow-up — is the thing I'd most want to preserve as pattern for the next refactor of comparable scope.

Places I'd recognize specifically:

- `ai/workspace/signature-benchmark-analysis.md` — the decision-record template
- `packages/renderer/src/engines/native/define-block.js:72-88` — the structured-log implementation
- `blocks/template.js:179+` — snippet + subtemplate unification, judgment beyond spec
- `blocks/each.js:184-191` — honest drift acknowledgment in a code comment
- Commits 99d0f1d6e through 16e71d20b — sequencing discipline visible in the log

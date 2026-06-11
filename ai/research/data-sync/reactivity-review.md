# Reactivity Review — plan.md vs packages/reactivity

Audit of every reactivity-touching claim in [`plan.md`](plan.md) against the real source (2026-06-10). One classifier agent traced `packages/reactivity/src`, `trackWrites` (working tree), and the renderer's RDC/each where the plan depends on them. Seven adversarial agents then attacked the high-stakes calls — refuters against "works-traced", rescuers against "plan-must-change" — tracing independently, without the classifier's reasoning.

Epistemics: "works-traced" means the mechanism is unconditionally present in source with the trace cited. Traces are still hypotheses by house rules — the file:line citations are what make them checkable, and anything that graduates into implementation gets its failing test regardless.

## Verdict Summary

The reactivity package supports the plan's core reactive-read story unconditionally: Dependency.depend() gives ambient subscription (find()-inside-a-Reaction is live), the Scheduler's microtask Set collapses synchronous writes to one re-run per reaction, guard() gives the value-guarded count(), Signal.set() gives deep-equal dedup, match()/ReactiveDataContext give per-key channels, and Reaction.stop()/ReactionScope.dispose() give subscription teardown. trackWrites with returnPaths produces conflict-pruned dot-paths for $set in the working tree. Those are works-traced. The plan's two load-bearing risks it already flags — rebase replay under a glitchy, non-topological scheduler, and query-re-run/reconcile cost at scale — are correctly characterized but unsolved, and several ugly interactions (delta apply mid-flush, computed-reading-computed under insertion-order execution, query re-run during replay, synchronous flush() mid-rebase, reaction throw mid-replay) are genuinely unaddressed and are where the spike must focus. Two plan claims are wrong as written: returnPaths does NOT force the proxy strategy (it works in the snapshot/clone+detectChanges branch), and consequently the 'mutators are sync-only because trackWrites proxies expire' guarantee does NOT hold for the common small-doc path, since the snapshot branch hands the body the raw object with no expiry trap — this undermines the ambient-privilege soundness argument unless the data layer forces strategy:'proxy' on every mutator (a no-primitive-change fix) or a small expiry guard is added to the snapshot branch. Array edits emit index-addressed paths that the plan's array-boundary folding must collapse in the data layer, not trackWrites. Scoped subscription handles cannot be bare arrays (no reactive .length) and must be reactive proxies like ReactiveDataContext. WeakRef self-teardown of derive/computed/match is GC-timing-dependent and unsuitable for prompt teardown of transient queries — scope ownership (onCleanup) is the reliable path. The renderer fast-path contract is real but the reconcile snapshot diff is shallow (top-level reference compare), making the plan's depth-1 field-swap discipline mandatory rather than optional: in-place deep mutations under a stable ref are invisible to per-field wakeups.

## Adversarial Outcomes (high-stakes claims)

| Claim | Classifier bucket | Adversarial verdict |
|---|---|---|
| `find-live-via-depend` | works-traced | **upheld** |
| `set-dedup-synchronous-writes` | works-traced | **upheld** |
| `no-topological-order-glitches` | works-traced | **upheld** |
| `trackwrites-returnpaths-to-set` | works-traced | **overturned** |
| `returnpaths-does-not-force-proxy` | plan-must-change | **upheld** |
| `mutators-sync-only-expiry` | plan-must-change | **overturned** |
| `per-key-rdc-exists` | works-traced | **upheld** |

Overturned entries annotated inline below.

## Works as written — verified by trace (12)

### `find-live-via-depend` — high stakes

**Claim** (Client Store / find() returns data): find() called inside any Reaction is live via Dependency.depend(); every template binding runs in a Reaction so cursors are reactive in templates with zero framework changes

**Mechanism**: Dependency.depend() registers the current reaction only when Scheduler.current is set; renderer bindings always run inside a Reaction

**Evidence**: dependency.js:12-17 (depend gates on Scheduler.current, adds reaction to subscribers and dep to reaction.dependencies); reaction.js:80-87 (run sets Scheduler.current = this around callback); reaction-scope.js:19-28 (every renderer binding wraps callback in reaction()); signal.js:127-129 (Signal.depend delegates to dependency.depend)

**Verification**: The ambient-registration mechanism is unconditionally present: any depend() call inside a binding's reaction subscribes that reaction. The plan must still build the collection's per-doc/per-query Dependency and call depend() in its read path — that code does not exist yet, but the primitive it relies on is exactly as described.

**Adversarial check — UPHELD**: Traced both clauses to source; the mechanism is real and I could not break it for the claim's stated domain (synchronous data reads in template bindings).

Clause 1 — liveness via Dependency.depend(): Dependency.depend() registers Scheduler.current as a subscriber whenever it is non-null, with no Signal wrapper required (dependency.js:12-17). Reaction.run() sets Scheduler.current=this for the entire synchronous span of the callback, firstRun included (reaction.js:81-87). The plan's find() calls depend() on a raw per-query Dependency in its read path (plan.md:59), the identical primitive signals use (signal.js:127-129, get value→this.depend() at signal.js:73-77). So a find() invoked synchronously inside any running Reaction registers a live dep. Verified, not assumed.

Clause 2 — every template binding runs in a Reaction: every data binding site routes through scope.reaction()/reaction(): value/text expressions (define-block.js:206, 376), attribute/property/event/single/interpolated bindings (attribute-binding.js:44,75,105), block dispatch incl. each/async/template (define-block.js:206; raw-text.js:32; template.js:285). ReactionScope.reaction wraps each in a real Reaction (reaction-scope.js:19-28). The each block reads node.over reactively with no nonreactive wrap (each.js:512-513, resolveItems), so {#each todos} over a find() result registers on the each reaction. Expression evaluator resolves values via .value/.get() (expression-evaluator.js:13,69,286,332,341,363), which call depend().

Adversarial edges found, none break the stated claim: (1) A static dispatch path genuinely skips Reaction wiring (define-block.js:368-373), but only for node.literalValue, which the compiler sets exclusively for FN_EXPRESSION / {#fn handler} (template-compiler.js:411-417) — a function-reference/event binding, never a plain data EXPRESSION (template-compiler.js:423). So "every binding" is technically false for {#fn} markers, but those carry function refs, not find() data, so cursor reactivity is unaffected. (2) nonreactive wraps (template.js:68,247,318; define-block.js:345) intentionally keep reads off the wrong reaction; leaf bindings re-register their own deps at evaluation time, preserving liveness. (3) Async .then/.catch callbacks run with Scheduler.current=null (async.js:75-86), but rendered content's leaf bindings get their own reactions via renderAST→scope.reaction, and the plan defers async observation anyway.

The trackWrites working-tree change (objects.js:154-187, returnPaths) is a write-path mutation-capture utility with no bearing on read-path liveness — does not intersect the claim.

Honest caveat (not a refutation): "zero framework changes" presumes find() is authored to call Dependency.depend() in its read path — that is store code the plan still must write. But the reactivity and renderer packages need no change to make that read live, which is exactly what the claim asserts.

### `set-dedup-synchronous-writes` — high stakes

**Claim** (Sync Loop / rebase / no manual batching): microtask Set-dedup absorbs N x per-field dep fires; many synchronous writes coalesce to one re-run per Reaction, no manual batching needed

**Mechanism**: pendingReactions is a Set; scheduleReaction adds; flush is microtask-deferred so all synchronous invalidations land before the first pass runs

**Evidence**: scheduler.js:7 (pendingReactions = new Set()); scheduler.js:12-15 (scheduleReaction adds and schedules flush); scheduler.js:17-22 (scheduleFlush defers via microtask, guarded by isFlushScheduled); browser.js:62-64 (microtask = queueMicrotask)

**Verification**: For writes that all complete synchronously within one task, every invalidate() of the same reaction collapses to one Set entry and one run on the next microtask. This is unconditionally true for the synchronous case. The N-x-coalesce claim is qualified by the rebase-replay-midflush claim below: it does NOT hold if a flush runs between writes.

**Adversarial check — UPHELD**: The claim is a precise, scoped statement about the reactivity scheduler's synchronous-write coalescing, and the source confirms every clause for that scope. I traced the full chain and tried to break it on three fronts (Set identity, synchronous-flush escape hatch, re-entrant writes during flush) and found no fault within the claim's stated scope ("many synchronous writes").

Chain of evidence:
1. A per-field dep fire is Dependency.changed() (dependency.js:28-43): it iterates this.subscribers (a Set of Reactions) and calls subscriber.invalidate(ctx) for each.
2. Reaction.invalidate() (reaction.js:96-104) calls Scheduler.scheduleReaction(this).
3. Scheduler.scheduleReaction (scheduler.js:12-15) does pendingReactions.add(reaction) then scheduleFlush().
4. pendingReactions is a Set (scheduler.js:7). Adding the SAME Reaction object N times is idempotent — this is the "Set-dedup" the claim names. N per-field fires that all reach the same subscriber Reaction collapse to one queue entry.
5. scheduleFlush (scheduler.js:17-22) is guarded by isFlushScheduled, so exactly one microtask(flushTask) is queued no matter how many synchronous fires happen ("absorbs N x").
6. microtask resolves to queueMicrotask (browser.js:62-64), a true microtask that drains only after the synchronous call stack unwinds. So an entire synchronous write burst adds its deduped Reactions to the Set before flush runs — giving "one re-run per Reaction, no manual batching needed."
7. The write path never forces a synchronous flush: trackWrites (objects.js:154-349, working tree) only collects paths/changes and returns {changed, result, paths} — it fires no reactivity itself. The renderer's per-field fan-out (each.js:429-433, 455-459, 471-484 calling dataContext.notifyField → Dependency.changed) is a synchronous loop of dep.changed() calls, all landing in the same Set before the microtask. The only flush() exposure is a userland helper binding (template.js:906 / schedule.js:4), not an automatic write-path flush.

Scope nuance (not a break): the flush set-swap (scheduler.js:44-46) moves writes that occur DURING a flush pass into a fresh Set that runs in the next pass. So a Reaction re-invalidated after it has already run in the current flush (a cascade) re-runs in a later pass — re-runs are NOT coalesced across passes. But the claim is explicitly scoped to "many SYNCHRONOUS writes," i.e. a burst before any microtask fires, and for that case every fire lands in the same live Set and coalesces correctly. The plan itself treats the rebase-replays-N×-with-mid-state-visible concern as a separate glitch/ordering item (Tier 1 de-risk #1), not as a coalescing claim, so the two statements are consistent. The dedup is Tracker/glimmer-style microtask batching and works exactly as written.

### `no-topological-order-glitches` — high stakes

**Claim** (De-risking Tier 1.1): the scheduler has no topological ordering (diamond glitches observable), computeds are eager, intermediate states readable synchronously via peek mid-rebase

**Mechanism**: flush iterates the pending Set in insertion order with no dependency-graph priority; derived/computed run via an eager backing Reaction; peek reads currentValue without scheduling

**Evidence**: scheduler.js:47 (for (const r of toRun) — insertion-order iteration, no topology); derived.js:9-27 (createDerivedSignal builds a backing Reaction that runs synchronously, eager); signal.js:102-104 (peek returns protect(currentValue) with no depend/notify); reaction.js:96-104 (invalidate just adds to scheduler, no ordering)

**Verification**: Confirmed by source: there is no glitch-free / topological layer. A diamond (A -> B, A -> C, B+C -> D) can run D twice or with a stale input within a flush. The plan correctly characterizes the scheduler; this is a constraint the rebase design must absorb, not a primitive defect. Stakes high because synced ⊕ pending re-derivation sits on exactly this scheduler.

**Adversarial check — UPHELD**: I tried to break the claim with adversarial diamond interleavings and the eager-vs-synchronous distinction, and all three sub-claims survive source verification.

(1) "No topological ordering (diamond glitches observable)" — TRUE. The scheduler holds pending reactions in an unordered Set with no priority/topological sort (scheduler.js:7, 12-13) and drains via set-swap passes where invalidations land in the next pass (scheduler.js:44-47). I constructed the falsifying-then-confirming diamond: A=signal, B=computed(A), C=computed(B), D=reaction reading A and C. On A.set, A's dependency invalidates B's backing reaction AND D in the SAME pass (both subscribe to A directly), so pendingReactions={Rb, D}. Rb runs and schedules Rc into the next pass; D runs in the current pass reading new A but STALE C — a glitch. Then Rc runs, re-invalidates D, D runs a second time with consistent state. D runs twice, the intermediate run is inconsistent. The test "runs reactions scheduled during a flush in the same flush pass" (internals.test.js:55-75) directly evidences this non-topological multi-pass propagation. A pure equal-depth diamond happens to batch glitch-free, but unequal-depth diamonds expose it, so "observable" holds.

(2) "Intermediate states readable synchronously via peek mid-rebase" — TRUE. peek() reads live currentValue with no depend() (signal.js:102-104); the value setter writes currentValue synchronously BEFORE scheduling notify (signal.js:81-82); trackWrites runs its callback synchronously and mutates the raw graph in place (objects.js:168, 325). Test internals.test.js:285 confirms peek() returns mid-flush state. A rebase replaying N mutators synchronously thus exposes every intermediate to an interleaved peek.

(3) "Computeds are eager" — TRUE under the load-bearing meaning. derive/computed back a Reaction subscribed to the source (derived.js:9-33) that is scheduled to recompute on every source change regardless of readers (push-based, no lazy-pull, no read-gating) — this is exactly the property that makes the diamond glitch observable, vs glitch-free lazy/pull memos. The genuine nuance I pressed on: computeds are NOT synchronous — every derived/computed test requires an explicit flush() before the new value is readable (signal.test.js:314-316, 326-328, 459-463). If "eager" were read as "recompute synchronously on write," it would be false. But in context the word sits beside "intermediate states are readable synchronously" as the contrast to batched glitch-free systems, and the framework's computeds are genuinely eager (push, non-lazy). The downstream de-risking conclusion the claim supports — "a rebase replaying N mutators fires per-field deps N× with mid-rebase state visible to peeks" — verifies: notifyField calls raw Dependency.changed() per touched field (reactive-context.js:302-315), called N times across N mutators (subscribers deduped in the pending Set, but changed() itself fires per mutator), and peeks see each intermediate.

The "eager" wording is loose (eager ≠ synchronous), but it lands on the correct push-based property and does not falsify the claim. I could not produce a counterexample that breaks the characterization as written.

### `trackwrites-returnpaths-to-set` — high stakes

**Claim** (Write Path): collection.update internally calls trackWrites(doc, fn, { returnPaths: true }) → changed paths → fire per-doc/per-field deps → wire-ready $set; pruneChildPaths output feeds $set documents directly

**Mechanism**: trackWrites with returnPaths returns pruned dot-paths via pruneChildPaths in both proxy and snapshot branches

**Evidence**: objects.js:154-160 (returnPaths defaults true); objects.js:166-175 (snapshot branch: detectChanges then added+changed+removed paths); objects.js:345-347 (proxy branch returns pruneChildPaths(pathLog)); objects.js:129-147 (pruneChildPaths drops child paths a recorded parent subsumes — the mongo path-conflict property)

**Verification**: The path-extraction pipeline exists and produces conflict-free dot paths suitable for $set. Caveat tracked separately: which branch runs (proxy vs snapshot) changes the expiry semantics the plan relies on, and array paths come out index-addressed (items.0) which the plan's array-boundary folding must handle in the data layer, not trackWrites.

**Adversarial check — OVERTURNED**: No collection update implementation exists in the repo, so the write vehicle spine is proposed design not traceable source. pruneChildPaths returns path strings with no values, so it cannot feed a set document directly which needs path to value pairs; the plan itself states a three stage returnPaths to get path to wire set pipeline that contradicts the direct framing. notifyField is keyed by top level field name fired from the each block shallow snapshot diff, not from trackWrites nested dot paths, so the per field deps link is unwired and per doc deps have no implementation. Only the trackWrites to changed paths link holds.

### `per-key-rdc-exists` — high stakes

**Claim** (What Exists vs Gaps): per-key reactive channels via Dependency, match(), RDC pattern — exists

**Mechanism**: raw Dependency per key, match() per-key membership, ReactiveDataContext per-key + per-field deps all present

**Evidence**: dependency.js:1-48 (Dependency); derived.js:50-91 (match); reactive-context.js:240-332 (ReactiveDataContext with values/deps/fieldDeps per-key channels)

**Verification**: All three named primitives exist and behave as the plan's gap table claims. The collection layer would compose them; the primitives are unconditionally present.

**Adversarial check — UPHELD**: The claim "per-key reactive channels via Dependency, match(), RDC pattern — exists" names three primitives. I traced each independently from source and all three exist, are exported/wired into real code paths, and genuinely implement per-key reactive channels. I could not break it.

1. Dependency — a self-contained per-key channel. depend() (read path) adds the current Scheduler reaction as a subscriber; changed() (write path) invalidates each subscriber. It is a public export of @semantic-ui/reactivity. The full loop closes: Dependency.changed() → Reaction.invalidate() → Scheduler.scheduleReaction() → flush re-runs the reaction. It works standalone with no Signal wrapper, which is exactly the plan's Decision Record claim ("Raw Dependency over Signal-per-key", plan.md:47). Signal itself is built on top of one Dependency (signal.js:41), confirming Dependency is the lower-level channel primitive.

2. match() — public export (index.js:8), implemented in helpers/derived.js:50-91. It is precisely "per-key reactive channels": a Map of per-key Dependency objects, dep.depend() registered per match(key) read, and on source change it fires dep.changed() ONLY for keys whose match result flipped (derived.js:64-72), so N readers cost O(flipped). The header comment literally calls it "Per-key reactive membership" and "highlight one of N." Not assumed from training data (it cites Solid's createSelector as inspiration but the SUI implementation was read directly).

3. RDC pattern (ReactiveDataContext) — reactive-context.js:240-332. Header comment: "a per-key reactive bag... Composes raw Dependencies + a key-set Dependency to deliver fine-grained invalidation." Per-key Dependency allocated at setKey (line 293), depend() in trapGet read path (line 144), changed() via setKey/notifyKey/notifyField write paths (lines 302, 307, 313). It is imported and instantiated by the each-block (each.js:6, 147, 598) with notifyKey/notifyField wired to per-key and per-field deps (each.js:420-481) — a live production consumer, not a dead note.

Attempts to refute that failed: (a) the wording is not an overclaim — all three are real and named correctly; (b) match() and Dependency are genuinely per-key (Map/per-key dep allocation, flip-only firing), not coarse whole-signal channels; (c) the read/write/invalidation loop is complete through the scheduler with no missing link; (d) match is genuinely exported, not internal. The "— exists" qualifier is accurate. Note the claim asserts only existence of these reactive building blocks, not that a full per-doc/per-query collection store is built on them (that is listed elsewhere in the plan as gap work) — so even the narrowest reading holds. Working-tree trackWrites changes in objects.js are a separate claim (next table row) and do not bear on this one.

### `count-value-guarded-dep` — medium stakes

**Claim** (find() returns data / count): count(selector) stays first-class with a value-guarded dep (find().length would re-fire on any result change); guard()-style

**Mechanism**: guard() runs an inner Reaction that recomputes on any tracked change but only fires the outer dep when the equalCheck of the computed value fails

**Evidence**: control.js:17-33 (guard: creates a Dependency, dep.depend() registers the outer reaction, inner Reaction recomputes and only dep.changed() when !equalCheck(newValue, value); returns newValue synchronously from firstRun); reaction.js:19-22 (firstRun executes run() in constructor so newValue is populated before guard returns)

**Verification**: guard exists and has exactly the value-guard semantics the plan wants: a count() built as guard(() => matchingDocs.length) re-fires the reader only when the integer count changes, not on every doc field change. The primitive is present and traced. The data layer must still register a dep that guard's inner reaction subscribes to (the per-query Dependency), which does not exist yet.

### `signal-set-deepequal-dedup` — medium stakes

**Claim** (Client Store / query invalidation): re-run + deep-equal dedup on re-emit (Signal set() semantics) — re-emitting an unchanged query result does not propagate

**Mechanism**: Signal value setter compares with this.equality (default isEqual deep) and only notifies on inequality

**Evidence**: signal.js:79-84 (set value: if !equality(currentValue,newValue) then protect+notify); signal.js:27 (static equality = isEqual); signal.js:35 (equality defaults to Signal.equality unless safety==='none')

**Verification**: If the query result is re-emitted through a Signal.set, an isEqual-equal array short-circuits with no notify. BUT note the dedup is deep-equal on the WHOLE result array; for large result sets this is an O(n*fields) compare on every re-emit, on the hot read path. Works as described semantically; the cost is the Tier 2 bench the plan already flags. Also: if the layer hands back reference-stable arrays with fresh objects only for changed docs (the plan's stated contract), isEqual will still walk the full array to confirm equality.

### `removed-keys-slip-snapshot` — medium stakes

**Claim** (Client Store contract): write undefined, never delete (removed keys slip the snapshot diff by design)

**Mechanism**: reconcile's snapshot diff iterates item keys only; a deleted key is never visited so its dep never fires, whereas setting it to undefined is a value change that is detected

**Evidence**: each.js:61-73 (refreshSnapshotAndDetect: for (const key in item) — only present keys compared; removed keys never visited); each.js:56-60 (comment: removed keys slip past by design); reactive-context.js:284-303 (setKey detects value change via equality, undefined is a normal value)

**Verification**: Confirmed by source: the snapshot diff only walks current item keys, so deletes are invisible to the per-field wakeup but a value set to undefined produces snapshot[key] !== item[key] and fires. The plan's write-undefined discipline is exactly what the reconcile contract requires. Unconditionally present.

### `reaction-cleanup-subscription-teardown` — medium stakes

**Claim** (find() returns data / Open Questions): observer lifecycle is Reaction cleanup / scope disposal; subscription teardown rides reaction cleanup

**Mechanism**: Reaction.stop removes the reaction from all its deps' subscriber sets and fires cleanups; ReactionScope.dispose stops all tracked reactions recursively

**Evidence**: reaction.js:106-115 (stop: active=false, removes from pending, dep.remove(this) for each dep, clears deps, fires cleanups); reaction.js:25-38 (onCleanup/fireCleanups); reaction-scope.js:46-63 (dispose recurses children, stops reactions, runs disposers); dependency.js:45-47 (remove deletes reaction from subscribers)

**Verification**: Reaction teardown as subscription teardown is unconditionally present: stopping a reaction unsubscribes it from every dep and fires registered cleanups, and scope dispose cascades. A find()'s observer cleanup can ride onCleanup or scope dispose exactly as the plan states. Traced end to end.

### `detectchanges-two-value-diff` — medium stakes

**Claim** (What Exists vs Gaps): detectChanges(before, after) exists for two-value diffs

**Mechanism**: detectChanges walks before vs after producing added/removed/changed dot paths

**Evidence**: objects.js:82-125 (detectChanges, exported); objects.js:104,118 (array-by-index, container recursion); objects.js:101 (Object.is short-circuit)

**Verification**: Present in the working tree exactly as claimed. Note: it diffs arrays by index and reports root '' for non-container wholesale changes (objects.js:80-81,121-123) — the data layer must account for index-paths on arrays.

### `signal-id-convention` — medium stakes

**Claim** (Client Store contract): stable ids via the Signal.id convention (id/_id/hash/key)

**Mechanism**: Signal.id static resolves id ?? _id ?? hash ?? key; getItemID in each uses the same convention

**Evidence**: signal.js:29 (static id = item.id ?? item._id ?? item.hash ?? item.key); signal.js:252-263 (getIds/getId); each.js:3 (getItemID import), reconcile uses getItemID at each.js:225,232

**Verification**: The id convention is present and shared between Signal and the each-block keying. Traced.

### `draft-row-helpers-signal-names` — low stakes

**Claim** (Drafts / Repeating groups): row ops on the draft mirror Signal helper names (draft.push('items', {}), draft.removeIndex('items', i))

**Mechanism**: Signal exposes exactly these array helpers with these names; the draft would re-expose them path-scoped

**Evidence**: signal.js:167-211 (push, unshift, splice, removeIndex, setIndex etc. exist as named helpers); signal.js:282-348 (setProperty, removeItem, replaceItem etc.)

**Verification**: The named helpers exist on Signal exactly as the plan cites. The draft is a separate construct (does not exist yet) but the naming precedent and semantics are present. The draft must implement path-scoped versions itself — Signal helpers operate on the signal's whole value, not a sub-path; draft.push('items', x) needs the data layer to get(items)+push+notify the items dep. Mechanism precedent traced; the draft code is unbuilt.

## Should work — needs tests to verify (9)

### `rebase-replay-midflush-dedup` — high stakes

**Claim** (De-risking Tier 1.1 / Sync Loop rebase mechanics): a rebase replaying N pending mutators fires per-field deps N x, and the microtask Set-dedup absorbs them to one re-run per Reaction

**Mechanism**: set-swap in flush moves invalidations that occur during a pass into a fresh Set for the next pass, so dedup holds only if the whole replay is synchronous and not itself inside a flush

**Evidence**: scheduler.js:45-46 (toRun = pendingReactions; pendingReactions = new Set() — new invalidations land in next pass); scheduler.js:36-56 (outer while keeps draining until empty, so a reaction re-invalidated during its own run re-runs); scheduler.js:84-88 (afterFlush during isFlushing does not re-schedule, runs in same drain)

**Verification**: Test: build pool + pending + shadow, register one Reaction reading a doc field, apply a delta then replay N mutators all synchronously OUTSIDE any flush; assert the Reaction ran exactly once on the following microtask (read a run-counter). Then the adversarial case: trigger the replay from inside an afterFlush callback or from inside another reaction's run (i.e. during isFlushing); assert whether it still coalesces or fans to N runs. The plan's no-flicker / one-rerun guarantee depends on replay never executing mid-flush, which the scheduler does not enforce.

### `ambient-privilege-module-flag` — high stakes

**Claim** (Write Path / privilege is ambient): privilege is ambient via a module-level current-mutation flag on the client (reads register ambiently inside a Reaction, writes authorize ambiently inside a mutation), sound because mutators are sync-only

**Mechanism**: the read-ambient side mirrors Scheduler.current (a module-level current-reaction pointer); the write-ambient side is a NEW module flag the data layer owns, whose soundness depends on the sync-only guarantee actually holding

**Evidence**: scheduler.js:6,90-95 (Scheduler.current is the module-level read-ambient analogue — set/cleared around run); control.js:6-15 (nonreactive shows the save/restore pattern the write-flag would mirror); objects.js:166-175 (sync-only NOT guaranteed for small-doc snapshot path — see mutators-sync-only-expiry)

**Verification**: Test: open a mutation (set the module flag), inside the body call collection.insert and assert it is privileged; then assert insert throws outside any mutation. Adversarial: start a mutation whose body (small doc, snapshot path) stashes the doc/insert into a setTimeout and calls insert after the synchronous body returns — assert it throws (it will NOT today, because the flag is cleared synchronously but insert auth keys on the flag, and a captured raw object survives). The flag mechanism itself is sound IF sync-only is enforced; this claim is gated on the expiry fix above. Without it the ambient-write flag has a soundness hole the symmetry argument assumes away.

### `afterflush-deltaapply-ordering` — high stakes

**Claim** (Sync Loop / claims involving afterFlush): afterFlush for delta-apply / observer ordering; flush() determinism

**Mechanism**: afterFlush alternates with reaction draining: all pending reactions drain, then one snapshot of afterFlush callbacks runs, repeating until both empty

**Evidence**: scheduler.js:36-74 (outer while: inner drains pendingReactions fully, then runs one snapshot of afterFlushCallbacks; callbacks registered during the batch land in the next alternation); scheduler.js:83-88 (afterFlush pushes; only schedules a flush if not already flushing)

**Verification**: Test the ordering the plan needs: register an observer via afterFlush, apply a delta that invalidates reactions, assert the afterFlush observer runs AFTER all reactions in that batch have re-run (not interleaved). Then test re-entrancy: an afterFlush callback that applies another delta (invalidating more reactions) — assert those reactions drain in the next alternation before the next afterFlush snapshot. The alternation is deterministic in source, but the plan's delta-apply-ordering guarantee needs a test pinning that observers see post-reaction state, and that an afterFlush-triggered delta does not starve or reorder.

### `reference-stable-fastpath` — high stakes

**Claim** (Client Store contract with renderer): result arrays reference-stable: fresh objects only for changed docs hit reconcile's same-ref fast path; depth-1 field swaps fire per-field deps

**Mechanism**: reconcile's same-ref branch runs a snapshot diff and fires notifyField per changed key; the refChanged branch handles fresh-object docs

**Evidence**: each.js:399 (refChanged = record.item !== item); each.js:465-485 (same-ref branch: refreshSnapshotAndDetect then notifyField per changed key in as-mode, setKey otherwise); each.js:402-434 (refChanged + as-mode object item: snapshot diff + notifyField, values[asKey] updated directly); reactive-context.js:310-316 (notifyField fires per-field dep + bare-item dep)

**Verification**: The reconcile fast path the plan names exists, but its behavior splits sharply by mode. Test 1 (as-mode, {#each todo in todos}): change one field on one doc via a fresh-object swap, assert ONLY bindings reading that field re-fire (notifyField fan-out), via per-binding run counters. Test 2 (spread-mode, {#each todos}): same change fires setKey per field + notifyKey('this') — assert whole-item {this} readers wake too (coarser). Test 3 (depth-1 nested object swap, e.g. doc.address replaced): assert the top-level field dep fires but bindings reading doc.address.city only wake because address is a new ref (the diff is shallow, hasOwnProperty-keyed at each.js:65-71 — it compares top-level keys by !==, so a replaced nested object is a changed top-level key). The plan's depth-1 contract aligns with the shallow snapshot diff, but only when the data layer actually swaps the top-level field to a fresh ref — an in-place nested mutation under the same top-level ref will NOT be detected (snapshot[key] !== item[key] is false). This is the load-bearing constraint behind write-undefined-never-delete and depth-1-granularity.

### `flush-error-partial-state` — high stakes

**Claim** (De-risking Tier 1.1 adversarial cases): reaction error mid-replay leaving partial state (de-risking implies rebase must survive errors during flush)

**Mechanism**: flush captures the first error but continues draining; a throwing reaction does not halt the batch but its own re-run is abandoned (firstRun still advances)

**Evidence**: scheduler.js:49-54 (per-reaction try/catch, firstError captured, loop continues); scheduler.js:76-80 (firstError rethrown after isFlushing reset); reaction.js:88-93 (finally advances firstRun even on throw, restores Scheduler.current)

**Verification**: A reaction that throws during replay-driven flush: the scheduler logs/keeps the first error, finishes the other reactions, then rethrows after the flush completes. The thrown reaction's dependency re-collection is partial — reaction.js:83-87 clears deps THEN runs callback, so a throw mid-callback leaves the reaction subscribed to only the deps it read before throwing (re-collection is incomplete). Test: a rebase replay where one mutator's reaction throws — assert (a) other reactions still ran, (b) the error surfaced after flush, (c) the throwing reaction's deps are the partial set, so a later change to an unread dep won't wake it. The plan's rebase must define what partial-state means here; the scheduler does not roll back pool writes on a reaction throw.

### `each-fastpath-fresh-ref-required` — high stakes

**Claim** (Client Store contract): depth-1 field swaps firing per-field deps — nested changes apply as top-level field reference swaps so the per-field diff and FGR deps see them

**Mechanism**: the reconcile snapshot diff is shallow (top-level keys, !== compare); only a fresh top-level ref is detected, an in-place deep mutation under the same ref is invisible

**Evidence**: each.js:65-71 (refreshSnapshotAndDetect compares snapshot[key] !== item[key] — shallow, reference compare); each.js:45-54 (createSnapshot shallow-copies top-level keys only)

**Verification**: Confirmed shallow. Test: mutate doc.address.city in place (same address object ref) and re-emit the same doc ref — assert NO notifyField fires (the diff sees no top-level key change). Then replace doc.address with a fresh object — assert notifyField('address') fires. This validates the plan's stated discipline (apply nested changes as top-level field swaps) is MANDATORY, not optional: the reconcile cannot see deep in-place mutations. High stakes because the whole delta-apply-as-field-swaps contract rests on it.

### `draft-reactive-reads` — medium stakes

**Claim** (Drafts and Forms): draft.get/dirty/stale are reactive reads; reaction(() => draft.get('field'), fn) auto-disposed; stale() is one reactive read (base-cursor check)

**Mechanism**: reactive draft reads require the draft to expose per-field Dependencies and call depend() in get; auto-dispose requires the reaction to be parented to a scope

**Evidence**: control.js:35 (currentReaction exists); reaction-scope.js:19-28 (scope.reaction auto-stops on disconnect and is tracked for dispose); create.js:6 (reaction factory); dependency.js:12-17 (depend mechanism)

**Verification**: The primitives for reactive draft fields exist (per-field Dependency + depend in get, exactly the RDC shape). Test: create a draft, run reaction(() => draft.get('city'), spy) inside a component scope, draft.set('city', x), assert spy re-ran once; then dispose the scope and assert a later set does NOT re-run. Auto-dispose is NOT automatic from the reactivity package — it comes from createComponent/ReactionScope tracking (reaction-scope.js:46-63). The plan's 'auto-disposed' claim is true only if the draft reaction is created through the component's scope, not via the bare reactivity reaction() factory (which has no owner). Needs a test pinning both the wake and the disposal.

### `computed-fields-autotrack` — medium stakes

**Claim** (Drafts / Computed fields): computed: row => idFromDropdown(row.dropdown_id) auto-tracks what the function reads; deps-array governor form runs the body nonreactive and registers only listed fields

**Mechanism**: auto-tracking requires the computed to run inside a Reaction reading per-field deps; the deps-governor form mirrors guard/match (run body nonreactive, manually register listed deps)

**Evidence**: derived.js:29-33 (computed runs computeFn inside a backing Reaction — auto-tracks any signal/dep read); control.js:6-15 (nonreactive for the governor body); control.js:17-33 (guard shows the manual-dep + nonreactive-ish recompute pattern the deps-governor would reuse); derived.js:50-91 (match shows per-key dep registration the deps-array would emulate)

**Verification**: Both forms are buildable from existing primitives. Test auto-track: a computed reading row.dropdown_id (a per-field dep), change dropdown_id, assert the computed re-fires and downstream reader updates once. Test governor: computed { deps:['items'], value } — change a NON-listed field, assert the computed does NOT re-fire; change items, assert it does. The risk the test must cover: a computed reading ANOTHER computed field (see the permutation cell) — eager recompute + no topological ordering means the dependent computed may read a stale value within a flush and re-run, producing a transient wrong value. Needs an interleaving test, not just a wake test.

### `derive-computed-weakref-lifetime` — medium stakes

**Claim** (Client Store decision 2 / match pattern): derived signals self-stop once unreferenced via WeakRef; match self-stops via WeakRef on the matcher closure

**Mechanism**: createDerivedSignal holds a WeakRef to the output signal and stops the backing reaction when deref() is empty; match holds a WeakRef to the matcher and stops on next run when dead

**Evidence**: derived.js:9-27 (derivedRef = new WeakRef(derivedSignal); backing reaction stops when !liveSignal); derived.js:50-91 (matcherRef = new WeakRef(matcher); backingReaction stops when matcherRef.deref() is falsy); derived.js:20-23 (parent.onCleanup ties lifetime to enclosing scope when present)

**Verification**: The self-stop is GC-timing-dependent: the backing reaction only stops on its NEXT run after the output is collected, and GC is non-deterministic. Test: create a computed/match inside no scope (owner-less), drop the reference, force a source change — the backing reaction runs, derefs empty, stops. But until the source changes AND GC has run, the backing reaction stays subscribed and live. For a sync layer registering many transient queries, the plan should not rely on WeakRef for prompt teardown of query Dependencies — prefer explicit scope ownership (parent.onCleanup, the always-present path). Needs a test confirming that within a component scope the cleanup is prompt (onCleanup, not WeakRef), and a note that owner-less queries leak until next-fire + GC.

## Won't work as written — primitives can be modified (2)

### `force-expiry-primitive` — high stakes

**Claim** (Write Path notes (sync-only)): sync-only mutator bodies should be enforced by trackWrites expiry regardless of doc size

**Mechanism**: add an expiry guard to the snapshot branch, or let the collection force strategy:'proxy'

**Evidence**: objects.js:166-175 (snapshot branch returns the raw value to the callback with no post-return guard); objects.js:161-164 (useProxy term set)

**Verification**: Two concrete options, both small: (1) the data layer passes { strategy:'proxy' } on every mutator so the existing expiry trap (objects.js:243-298) always engages — zero primitive change, ~one option literal at the call site, at the cost of always allocating proxies. (2) Add an opt-in expire flag to trackWrites that, in the snapshot branch, wraps the value in a thin revocable Proxy (or sets a sentinel) after callback return so post-return access throws — ~15-25 lines in objects.js, mirroring the proxy branch's expiredError. Option 1 is the cheaper, no-primitive-change route and is what the plan should adopt.

### `scoped-handles-live-arraylike` — medium stakes

**Claim** (find() returns data / scoped handles): scoped subscription handles as live array-likes registering deps on .length / find / count

**Mechanism**: there is no array-like primitive that auto-registers deps on property access; depend() must be called explicitly in each accessor, and .length on a plain array does not trigger any dep

**Evidence**: dependency.js:12-17 (depend is an explicit call, no proxy/getter auto-registration); signal.js:73-77 (only Signal.value getter calls depend); reactive-context.js:109-150 (the ONLY auto-registering array/object-like in the codebase is the RDC Proxy, which registers per-key deps via a get trap)

**Verification**: A plain returned array cannot register deps on .length access — JS arrays have no reactive .length. The plan needs the handle to be a Proxy (like ReactiveDataContext) whose get trap calls a backing Dependency.depend() for length/find/count, or to expose count() as a guard()-wrapped function (which works) and .length as a separate guarded read. Modification: build a small array-like Proxy in the data layer wrapping the per-query Dependency, ~ the RDC pattern (reactive-context.js HANDLER). No reactivity-package change needed — the primitives (Dependency, guard) exist; the plan just cannot rely on a bare array being reactive on .length. plan should specify the handle is a reactive proxy, and find().length re-firing on any result change (which the plan acknowledges) follows from .length depending on the whole-result dep.

## Won't work as written — plan must change (5)

### `returnpaths-does-not-force-proxy` — high stakes

**Claim** (De-risking Tier 3): returnPaths forces the proxy strategy even under the snapshot budget (Tier 3 bench rationale)

**Mechanism**: useProxy is decided by strategy/onWrite/overBudget only; returnPaths is orthogonal and works in the snapshot (clone+detectChanges) branch

**Evidence**: objects.js:161-164 (useProxy = strategy==='proxy' || (auto && (onWrite!==undefined || overBudget(value))) — returnPaths is NOT a term); objects.js:166-175 (the !useProxy snapshot branch computes paths via detectChanges when returnPaths)

**Verification**: The plan should state: returnPaths does NOT force the proxy. A small doc (under the 512-node autoBudget, no onWrite) takes the snapshot path: clone the doc, run the callback against the REAL object, then detectChanges(before, after) to derive paths. The proxy is selected only by strategy:'proxy', an onWrite callback, or a doc over budget. This matters because the next claim (sync-only expiry) depends on which branch runs.

**Adversarial check — UPHELD**: The claim "returnPaths forces the proxy strategy even under the snapshot budget" is false against the working-tree source, and no existing primitive or modest modification rescues it without contradicting the design.

STRATEGY SELECTION DOES NOT REFERENCE returnPaths. The only place strategy is chosen is objects.js:161-164:
  const useProxy = (strategy === 'proxy'
    || (strategy === 'auto' && (onWrite !== undefined || overBudget(value))))
    && isTrackable(value) && !Object.isFrozen(value);
`returnPaths` is absent from this expression. Under strategy 'auto', proxy is forced only by onWrite being set OR the value being overBudget (objects.js:73, autoBudget=512 at objects.js:72). A small (under-budget) value with returnPaths:true, no onWrite, strategy 'auto' yields useProxy=false and takes the SNAPSHOT path (objects.js:166-175).

THE SNAPSHOT PATH FULLY SERVES returnPaths. On the non-proxy branch, when returnPaths is true (the default, objects.js:157), paths are produced from detectChanges(before, value) (objects.js:172) flattened into added+changed+removed (objects.js:173). So returnPaths is orthogonal to strategy: both strategies return paths, the snapshot one via a before/after structural diff, the proxy one via a write-order pathLog (objects.js:345-347). returnPaths therefore does not need, and does not force, the proxy.

TESTS CONFIRM THE BEHAVIOR (and pass: I ran the 10 returnPaths tests, all green). objects.test.js:380 "returns paths by default, small values still see the real object" asserts value===target (proving the snapshot path ran, since the proxy path hands a wrapper not the raw object) AND paths===['meta.count']. objects.test.js:416 "reports net leaf changes on the snapshot strategy, resolvable through get()" names the snapshot strategy producing paths directly. The actual proxy-forcing triggers are tested separately: onWrite forces proxy on a small value (objects.test.js:57), and a large value forces proxy via budget (objects.test.js:48, makeLarge comment objects.test.js:29). returnPaths is never a forcing trigger.

WHY NO RESCUE. The plan's own pipeline example uses trackWrites(doc, fn, { returnPaths: true }) with no onWrite (plan.md:115), which lands on snapshot when under budget — exactly the pipeline returnPaths→get(path)→wire-$set the Tier 3 line (plan.md:305) describes, and the snapshot path's paths are get()-resolvable by construction (objects.test.js:421-422). There is no correctness gap that would require proxy to obtain paths: detectChanges reports net final leaf paths, which is what a wire $set wants. The only modification that would make the claim literally true is adding `|| returnPaths` into the useProxy condition, but that regresses the design: it would push every small path-collecting mutation onto the expensive proxy, defeating the budget whose stated point is that small snapshots stay imperceptible (objects.js:70-73). That is a design contradiction, not a modest fix, so the claim cannot be rescued — the plan line must be corrected (e.g. "onWrite forces the proxy strategy," which is the true statement).

### `mutators-sync-only-expiry` — high stakes

**Claim** (Write Path notes / Execution Without Fibers): methods are sync-only because trackWrites proxies expire at callback return (also the sync-callbacks doctrine)

**Mechanism**: the expired-guard that throws on post-return reads/writes exists ONLY in the proxy branch; the snapshot branch hands the callback the real object with no expiry trap

**Evidence**: objects.js:177 (expired flag) and objects.js:243-245,253-254,268-269,281-282 (every proxy trap throws expiredError when expired); objects.js:324-329 (expired=true set in finally only in the proxy path); objects.js:166-175 (snapshot branch: callback(value) on the raw object, no proxy, no expiry — a captured reference stays live and mutable forever after return)

**Verification**: The plan should state the expiry guarantee is conditional: it holds only when the proxy strategy is actually selected (onWrite passed, or doc over the 512-node budget, or strategy:'proxy'). For a typical small doc updated with returnPaths and no onWrite, the body receives the raw object and could stash it and mutate it asynchronously with no error. To make sync-only enforcement structural, the data layer must pass strategy:'proxy' explicitly on every mutator (forcing the expiry trap), OR add a primitive: see the primitive-fixable variant. As written, sync-only is not enforced by trackWrites for the common small-doc path.

**Adversarial check — OVERTURNED**: The claim (plan.md:122) "Methods are sync-only (trackWrites proxies expire at callback return — also the sync-callbacks doctrine)" survives because both cited mechanisms are real in source; only the referent word "methods" is mislabeled, and the existing primitives already make the intended statement true with zero modification.

TRACKWRITES EXPIRY IS REAL AND CORRECTLY DESCRIBED. In objects.js the wrapped callback runs `result = callback(wrap(value))` inside a try, with `finally { expired = true }` (objects.js:324-329). Expiry is pinned to the callback's SYNCHRONOUS return. Every proxy trap opens with `if (expired) throw expiredError()` — get (243-245), set (253-256), deleteProperty (268-271), defineProperty (281-284) — throwing "tracked value used after its callback returned. Reads and writes are only valid inside the callback" (185-188). So a callback that awaited and then touched the draft would run its continuation after expired=true and every trap would throw. The proxy strategy structurally forbids an async callback that touches the draft post-await. The claim's mechanism clause is true to the source.

THE REFERENT IS THE WRITE CALLBACK, NOT THE METHOD BODY. trackWrites wraps `fn`, the `update(id, fn)` write callback (plan.md:113-116: `collection.update(id, doc => {...})` → internally `trackWrites(doc, fn, { returnPaths: true })`). For server methods the plan states the body only BUFFERS commands — `update(id, fn)` buffers the `(id, fn)` pair — then "the body completes, then the framework applies the command log ... with `fn` executing inside the transaction through trackWrites for delta paths" (plan.md:131). So `fn` is what passes through the expiring proxy and is thereby sync-only; the method body never touches a trackWrites proxy.

THE PLAN ITSELF CONTRADICTS A LITERAL READING OF LINE 122. Method bodies are async everywhere else: table row "async allowed" (82), "methods are honestly network-async" (89), "Method bodies are already honestly async, so await Todos.find(...) ... is true coloring" (133), "method bodies await ... ALS is the post-fibers replacement" (137). A literal "method bodies are sync because the proxy expires" is false AND no primitive change can fix it, since bodies provably don't pass through a proxy (131 buffers (id,fn)). That is the strict failure the prior reviewer likely saw.

WHY OVERTURNED ANYWAY. The defensible, source-backed statement is: `update(id, fn)` WRITE CALLBACKS are sync-only because trackWrites proxies expire at callback return — and that is exactly how the plan uses trackWrites everywhere (113-116, 131). The sync-callbacks-doctrine clause (89, plus the MEMORY sync-callbacks-over-promises note: async coloring forces call-chain escalation) independently keeps those write callbacks uncolored so the simulation/apply loop stays sync. Both clauses are correct for the callback trackWrites actually wraps. The existing primitives require no modification — trackWrites already expires at sync return and already wraps `fn`. The only defect is a one-word prose mislabel ("methods" should read "the update(id, fn) write callbacks"). A prose-referent fix, not a plan/design change, so the reviewer's "the plan must change / no primitive modification helps" is too strong.

Caveat held honestly: under the strictest reading (expiry forces method BODIES sync) the claim is false and unrescuable. The overturn rests on reading "methods" as its evident intended referent — the write callbacks — which is how every other trackWrites reference in the plan reads.

### `draft-drynrun-check-sideeffectfree` — medium stakes

**Claim** (Write Path / Drafts): drafts dry-run schema+check without side effects (check is side-effect free, run nonreactive of pool)

**Mechanism**: the reactivity package cannot enforce side-effect-freedom of a user check() function; nonreactive only suppresses dep registration, not side effects

**Evidence**: control.js:6-15 (nonreactive sets Scheduler.current = null around func — suppresses dependency tracking only, the function can still mutate anything); there is no sandboxing primitive in the package

**Verification**: The plan must state this is a CONVENTION, not an enforced guarantee. nonreactive(check) prevents the dry-run from registering reactive dependencies (so running check inside a Reaction won't subscribe it to pool deps), but it does NOT prevent check from performing writes or other side effects — that is the author's contract. Running check during a draft dry-run inside a Reaction should be wrapped in nonreactive to avoid spurious subscriptions (real, traced benefit), but side-effect-freedom is unenforceable by the primitives. plan should say: dry-run wraps check in nonreactive to avoid dep capture, and side-effect-freedom is a documented author contract.

### `array-path-folding-not-in-trackwrites` — medium stakes

**Claim** (Drafts / Repeating groups + Write Path notes): commit folds index paths up to the array boundary and $sets the whole array; pruneChildPaths output feeds $set directly

**Mechanism**: trackWrites/detectChanges produce index-addressed paths (items.0, items.1); pruneChildPaths only collapses child-under-recorded-parent, it does NOT collapse sibling indices up to the array key

**Evidence**: objects.js:82-125 (detectChanges: arrays diff by index, walk(valueA,valueB,path) recurses producing items.0 etc.); objects.js:129-147 (pruneChildPaths: a path is pruned only if an ANCESTOR path is in the log — items.0 is kept unless 'items' itself was recorded); objects.js:50-55 (array index iteration)

**Verification**: The plan must state array-boundary folding is DATA-LAYER work, not something trackWrites does. trackWrites emits items.0, items.2 as distinct $set paths; pruneChildPaths will not fold them to items unless the whole array was reassigned (which records 'items'). The plan's 'commit folds index paths up to the array boundary' is correct as a data-layer step but the surrounding text implies pruneChildPaths output is wire-ready — for array edits it is index-granular and would $set individual indices, which the plan elsewhere rejects as fragile against reorders. plan should add an explicit array-boundary fold pass over the paths before $set.

### `generateid-weak` — low stakes

**Claim** (Write Path notes / What Exists vs Gaps): generateID is 32-bit, too weak — use crypto.randomUUID or upgrade utils

**Mechanism**: not a reactivity claim; flagged as a utils gap the plan already acknowledges

**Evidence**: (plan self-identifies; generateID lives in utils, not reactivity — out of primary scope, no reactivity dependency)

**Verification**: The plan already says to use crypto.randomUUID or upgrade utils. No reactivity-package bearing. Noted for completeness; the client-generated-id requirement for replay survival (plan: create-then-edit chains) is a data-layer concern, and the each-block keying (getItemID) will key on whatever id field is present (signal.js:29), so stable client ids flow through reconcile correctly once generated.

## Permutation Map — the decision space the sketch doesn't acknowledge

10 unaddressed, 6 partially addressed, 0 addressed.

### Unaddressed

- **delta apply (field swap) during an in-progress flush (isFlushing true)**
  If a socket delta lands and applies pool writes while Scheduler.isFlushing is true (e.g. a reaction's run synchronously triggers network drain, or an afterFlush callback applies a delta), the invalidations land in the next set-swap pass (scheduler.js:45-46) and drain within the SAME flush via the outer while (scheduler.js:36). Reactions already run in this flush will re-run; the dedup-to-one-rerun guarantee does NOT hold across the flush boundary. The plan assumes deltas apply between tasks (afterFlush ordering) but never states deltas must not apply mid-flush. No guard exists.

- **draft commit × delta arriving on the same doc while draft open**
  The plan says live deltas flow into the pool during edit without disturbing the fork, and stale() detects base-cursor movement. But the reactivity interaction is unspecified: the draft's per-field deps and the pool doc's per-field deps are separate Dependencies. A delta updating the pool doc fires pool deps (waking find() readers) but must NOT fire draft deps (the fork is decoupled). Whether the draft holds an independent clone (separate deps) or shares structure is undefined; if it shares any object ref, the field-swap delta could mutate the fork. Needs explicit isolation design.

- **computed field reading another computed field × eager recompute**
  computed() runs its body in an eager backing Reaction (derived.js:29-33). A computed reading another computed subscribes to the inner's output Signal. With no topological ordering, when a shared upstream changes, both the inner computed's backing reaction and the outer's are in pendingReactions; insertion order (scheduler.js:47) may run the outer BEFORE the inner re-runs, so the outer reads a stale inner value, then the inner's notify re-schedules the outer for another pass (scheduler.js:36 outer while). Result: the outer runs twice, once on stale input. The plan's computed-fields section never addresses chained computeds under the glitchy scheduler.

- **query re-run triggered DURING rebase replay**
  If replaying a pending mutator writes a field that a registered query's selector intersects, the query's Dependency fires. If the replay is happening inside a flush (delta-triggered), the query reaction re-runs within the same flush against a half-replayed pool (only some mutators applied). The query may emit a transient wrong result that a downstream reaction or the reconcile consumes. The plan's invalidation design (changed-paths × selector field-set) does not coordinate with replay progress; no 'suspend query re-run until replay completes' mechanism. afterFlush could batch this but is not specified to.

- **flush() called synchronously mid-rebase**
  flush is exported and callable synchronously (schedule.js:4). If rebase code calls flush() (or any code path does) while partway through applying shadows/replaying, it drains pendingReactions immediately against the partial pool, exposing intermediate synced⊕pending state to every reaction and every afterFlush observer. Re-entrant flush() while isFlushing is true would re-enter scheduler.flush (no re-entrancy guard beyond isFlushScheduled) — the inner flush drains and resets isFlushing=false in its finally (scheduler.js:76-78), corrupting the outer flush's isFlushing state. The plan never says rebase must not call flush() and the scheduler has no re-entrancy guard.

- **mutator called from inside a Reaction**
  A mutator's optimistic apply does pool writes (Dependency.changed → invalidate → schedule). If invoked from inside a running Reaction (Scheduler.current set), the writes schedule reactions for the next microtask flush — fine. But the mutator also reads the pool (simulation reads pool, plan: Execution Without Fibers). Reading pool signals inside the mutator while inside a Reaction would SUBSCRIBE the outer reaction to those pool deps (depend gates on Scheduler.current, dependency.js:13), creating accidental reactive subscriptions from a write body. The mutator body should run nonreactive (control.js:6-15) to avoid this, but the plan never states mutator bodies run nonreactive — a real ambient-subscription hazard.

- **draft.commit inside a mutator body**
  draft.commit() issues a method $set (plan: Drafts). Calling it inside a mutator body (sync, ambient-privilege flag set) mixes the sync mutator envelope with a method's async path. The module-level current-mutation flag (privilege) is set; commit's method dispatch is async (methods are server-async). The flag would be cleared synchronously when the mutator body returns, but commit's deferred work runs after — same soundness hole as the ambient-privilege claim. Undefined and dangerous; the plan does not prohibit it.

- **WeakRef-based lifetime × prompt query teardown**
  derive/computed/match self-stop via WeakRef only on the NEXT backing-reaction run after GC collects the output (derived.js:13-18, 56-60). For a sync layer registering/dropping many transient queries, WeakRef gives no prompt teardown — a dropped query's Dependency stays subscribed until its source next fires AND GC runs. The plan relies on 'observer lifecycle is Reaction cleanup/scope disposal' (works via onCleanup, derived.js:20-23) but does not distinguish owner-less queries (WeakRef, slow) from scoped queries (onCleanup, prompt). Owner-less query leak window unaddressed.

- **cleanup ordering × match key-dep pruning during flight**
  match prunes empty key-deps opportunistically inside its backing reaction, not on onCleanup (derived.js:42-44, 64-67). If the sync layer uses match-style per-key membership for query/channel membership and a key's last subscriber unsubscribes during a flush, the prune happens on the NEXT source change, not immediately. Cleanup ordering between a reaction's onCleanup (fires before its next run, reaction.js:78) and match's deferred prune is not coordinated. Benign for correctness but means stale key-deps linger across flushes — unaddressed for a high-churn channel-membership use.

- **synchronous flush() × afterFlush re-entrancy**
  afterFlush during isFlushing pushes without scheduling (scheduler.js:84-88) and runs in the current drain's alternation. But a synchronous flush() called from within an afterFlush callback re-enters flush(), which sets isFlushing=true then false in finally (scheduler.js:27,77), corrupting the outer alternation's isFlushing invariant and potentially double-running the afterFlush snapshot. The plan's delta-apply via afterFlush plus any synchronous flush() (e.g. a test or a forced-sync path) collides here. No guard.

### Partially addressed

- **rebase replay × no topological ordering (glitches)**
  The plan's Tier 1.1 explicitly names diamond glitches and mid-rebase peek visibility as the spike target — acknowledged. But it offers no mechanism to prevent a reader that peeks (signal.js:102) or a computed (eager, derived.js:29-33) from observing an intermediate synced⊕pending state where some mutators have replayed and others have not. Within one flush, a computed reading two query results updated at different points in the replay can compute on a half-replayed pool. Acknowledged as risk, unsolved in the plan.

- **mutator optimistic apply × Set-insertion-order execution**
  Synchronous optimistic writes coalesce per reaction (works-traced) but the ORDER reactions run is pool-write insertion order into pendingReactions (scheduler.js:47), unrelated to data dependency order. If an optimistic apply writes doc A then doc B and a reaction depends on both, it runs once (good); but two sibling reactions run in subscription-registration order, which the plan's no-flicker reasoning does not depend on — so this is benign here. Marked partial because the plan never states it doesn't rely on order, leaving it implicit.

- **method delta arrival × afterFlush alternation**
  The plan wants a method promise to resolve after its deltas apply locally, ordered so observers see post-apply state. afterFlush alternation (scheduler.js:36-74) gives a deterministic 'after all reactions' hook, which supports this. But the plan's 'result cursor says when' spans multiple channels with independent cursors (plan Tier 1.3 self-flags), and the scheduler's afterFlush is per-flush, not per-channel-cursor — bridging cursor-completion to afterFlush is unspecified. Mechanism present, wiring unaddressed.

- **query re-run × deep-equal dedup cost at scale**
  Signal.set deep-equal dedup (signal.js:79-84) suppresses no-op re-emits, but isEqual walks the whole result array every re-emit on the hot read path. The plan flags 're-run + reconcile absorbs it, bench before IVM' (Tier 1.2) — acknowledged as needing a bench. The specific cost (O(n×fields) compare per re-emit even when reference-stable) is not called out.

- **reaction error mid-replay leaving partial pool state**
  Tier 1.1 lists 'reject during another's flight' and 'replay reading mid-rebase state' as spike cases — acknowledged. But the scheduler's error handling (scheduler.js:49-54: capture first, continue draining, rethrow after) means a throwing reaction during replay does NOT roll back pool writes and leaves the reaction with a partial dependency set (reaction.js:83-87 clears deps then throws mid-callback). The plan treats rejection as 'effect stops being replayed' (clean) but a reaction THROWING (not a method rejecting) mid-flush is a different failure the plan does not separate out.

- **nonreactive scope around schema check / computed governor**
  The plan cites nonreactive for the computed deps-governor (run body nonreactive, register only listed fields) and implies dry-run check avoids subscriptions. nonreactive exists and suppresses dep capture (control.js:6-15). But the plan does not specify nonreactive wrapping for: mutator simulation pool reads, draft dry-run check, or count()'s guard internals (guard manages its own reaction). The governor form is buildable; the other nonreactive uses are implied but not stated.

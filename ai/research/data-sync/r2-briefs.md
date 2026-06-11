# R2 Decision Briefs — The Five Remaining Calls

Each brief: current state, the challenge, options with costs, evidence status, recommendation, and what would change it. The hobbyist scenario now weighs in everywhere — noted per brief. These are decisions, not findings: mark up and rule.

---

## Brief 1 — Cross-channel atomicity: client hold groups vs server-side regrouping

**Current:** txid grouping mandatory; the client holds delta frames until every spanned subscribed channel's frame arrives; spans lists ride every frame; a 10s timeout valve with gap-resubscribe.

**The challenge (two independent lenses):** the coherence audit found *no scenario line requiring cross-channel atomic visibility* — single-doc atomicity is the large-application scenario's column, migrations explicitly waive it, role tiers are never co-subscribed by one user. The cold read found the client *provably cannot run the machinery*: cursors are opaque, so a client holding channel A's frame cannot know channel B's cursor is already past the transaction (subscribe-after-snapshot and resume interleavings make this reachable) — a livelock variant beyond the snapshot-folding one already on file. Also: spans lists bloat at the *sanctioned* 500-doc migration batch (~1,000+ channel addresses per frame).

**Options:**
(a) **Server-side regrouping** (cold read's proposal): one-frame-per-tx-per-socket becomes the guarantee for live flow (atomic apply free by framing); at resume, the server regroups tail frames by txid across the channels in the resume batch — per-request computation, no per-client state, stateless-node invariant survives. Deletes the hold machinery, the timeout, the spans-on-every-frame.
(b) **Demote to capability:** v1 ships per-channel atomicity only (what the scenario needs); cross-channel arrives later if a workload demands it.
(c) Keep as-is — rejected by the evidence above.

**Hobbyist lens:** single-channel apps never see any of this; (a) and (b) both cost the hobbyist nothing; (c) costs every client the machinery.

**Recommendation:** (a) for live flow + server regrouping at resume — atomicity preserved where it's nearly free, the most fragile client machinery in the protocol deleted. **What would change it:** a real scenario line where one user's UI co-displays two channels that must update atomically (none found in either scenario).

---

## Brief 2 — Conflict evidence: parking-first vs the per-path last-write map

**Current (plan):** durable per-path last-write map maintained on every write, prefix-aware intersection at replay, conflict outcome codes — adopted from the protocol review's voice-five refinement.

**The challenge (cold read):** the hard-fail bar requires only that stale replays *never silently destroy* newer work. Parking aged entries + dead-letter + explicit confirm achieves that with **zero server metadata**. The map costs a second durable write per write, on every doc, in every deployment, forever, plus a pruning subsystem — to reduce false confirm-prompts on an event the scenario scopes as rare (aged replay beyond the same-day envelope).

**The scenario actually agrees more than the plan does:** the envelope rescope already ruled that *within* the realistic envelope, same-path concurrency is honest last-write-wins (live LWW by decree) — conflict detection was only ever for *aged* replays. Parking-by-age covers exactly that case. The per-path map adds detection inside the envelope that the scenario never demanded.

**Options:** (a) **Parking-first v1**: age-threshold parks, dead-letter retains content, explicit confirm; instrument the false-confirm rate in production; build the per-path map only if the annoyance rate earns it. (b) Ship the map in v1 as planned.

**Hobbyist lens:** decisive — the map's write amplification lands on the $5 VPS and the single-file adapter for a persona that will never see an aged-replay conflict. Parking costs them nothing.

**Recommendation:** (a), firmly. The voice-five finding ("per-doc false-positives at 100%") argued against per-doc *stamps*, not for building the maximal machinery — the plan absorbed the strongest fix without a costing pass, which is exactly the review-momentum failure mode. **What would change it:** instrumentation showing aged replays with genuine path conflicts are common enough that confirm-fatigue is real.

---

## Brief 3 — Write privilege: ambient vs explicit ctx surface

**Current:** raw CRUD exists only inside operation bodies — ambient module flag (client) / ALS (server); CRUD + query names reserved against mutator names (already forced `save`-not-`update` in this corpus's own steelman example).

**The challenge (cold read):** three costs for a symmetry slogan — the snapshot-branch expiry hole (small docs hand the body the raw object, no trap), the reserved-name tax compounding forever across every collection's verb vocabulary, and privilege legality invisible at the call site. The alternative: an explicit privileged surface in ctx — `run({ title }, { db }) { db.todos.insert({ title }) }` — sound under async by construction, frees the namespace (public `Invoices.update` mutator + raw `db.invoices.update` coexist), legible where exercised.

**The hobbyist lens flips the weight — this is the brief where the new scenario earns its standing immediately.** The hobbyist writes inline one-liner mutators; ambient is materially terser (`Todos.insert({title})` vs destructuring ctx in every body), and Meteor heritage muscle memory is ambient. The cold read's soundness argument is real but has a cheap fix that keeps ambient: force the proxy strategy on operation bodies (zero primitive change, the reactivity review's option 1) or the ~20-line snapshot expiry guard.

**Options:** (a) Ambient kept, soundness fixed (forced proxy or expiry guard), reserved names accepted as the permanent price. (b) Explicit ctx surface, namespace freed, more ceremony per body. (c) Ambient as sugar over an explicit core — both forms legal (most complexity, two ways to do it).

**Recommendation:** my lean flipped to **(a)** once the hobbyist scenario got standing — terseness at the small rung outweighs the reserved-name tax, *provided the soundness fix lands in v1 as a requirement, not a note*. But this is the most heritage-flavored call on the list and the one where general production experience with reactive data systems carries the most weight against both reviewers. **What would change it:** if the reserved-name collisions multiply in 0a steelmen beyond `update`/`remove` (each one is a permanent vocabulary scar).

---

## Brief 4 — Flush discipline: conventions vs an apply-barrier primitive in reactivity

**Current:** four "apply discipline" rules the sync client must voluntarily obey (no apply mid-flush, queued-frame handling, etc.) over a scheduler with documented sharp edges and ten unaddressed permutations.

**The challenge (cold read):** wrong layer — we own the scheduler. A small primitive (queue externally-sourced applies while `isFlushing`, re-entrancy guard on `flush()`) converts four conventions into one enforced invariant, protecting not just sync but drafts, tests, devtools, and every future external-apply consumer.

**The cost nobody should wave away:** the reactivity package is shipped, benched, and krausest-guarded — touching the scheduler's hot path has real perf risk and blast radius. ~20-40 lines, but on the most measured code in the repo.

**Recommendation:** adopt **in principle, decide by spike** — the rebase × scheduler spike (Tier 1, unchanged) is exactly the harness where the barrier's necessity becomes empirical. If the adversarial interleavings break conventions in practice, the primitive is proven needed and the spike doubles as its test suite; if conventions hold, ship conventions with the spike as the regression guard. The spike was already mandatory; this gives it a second verdict to deliver. **Hobbyist lens:** invisible either way.

---

## Brief 5 — Retire the "weekend-portability" claim

**Current:** Decision 9 still says the spec is small enough to port in a weekend. **The challenge:** false since several revisions ago (JCS addresses, watermark+ledger TTLs, epoch cursors, chunked atomic snapshots, projection unions). Underpricing the protocol in its own decision record mis-prices every downstream adoption decision — DDP's self-flattery, repeated.

**Recommendation:** accept — one-line edit. Portability is delivered by the conformance suite, and the honest claim is "portable because conformance-tested," not "portable because small." No counter-argument found; included for completeness. **What would change it:** nothing — though Brief 1's option (a), if adopted, removes the hold-group machinery and meaningfully shrinks the port surface, making a "long-weekend" claim defensible again.

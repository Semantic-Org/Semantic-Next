# Cross-Examination — Rocicorp Zero (Phase 2)

Adversarial review of [`deep-zero.md`](deep-zero.md) by an independent seat. The dossier's dispositions are treated as hypotheses. Every attack is run through the substrate lens: a borrowed idea either re-derives at our granularity (field deltas landing on per-field deps — `notifyField`/RDC, reactive-context.js:284-316; equality-deduped apply; scheduler microtask collapse) or it is not an adoption candidate. Spec citations are file/section. Zero citations are dossier rows or the dossier's source index URLs.

Verdict in one line: every confirmed-divergence survives cross-examination, but two of them only survive **amended** — the offline divergence is hiding an unsafe blind-replay window our own taxonomy forbids (fix: park-then-verify, the strongest finding of this pass), and the system-of-record divergence is correct while the brownfield trial it must beat is the least-specified page of our spec. Both reconsiders resolve (one adopt-the-goal, one adopt). All seven open questions get answers, none need Jack to unblock the spec text, two need benches for constants.

---

## 1. The offline divergence, attacked hardest (dossier row 1 + row 2 + OQ3)

### The two readings

The dossier reads Zero's no-offline-writes stance as targeting week-long merges our envelope already excludes, and reads the Replicache→Zero reversal (`enableMutationRecovery: false`, zero.ts:635) as evidence *for* our parking gate: their recovery replayed blind, ours interrupts blind replay with parking.

The alternative read: they learned optimistic replay over aged state is unsafe **at any age** without conflict evidence — which would make parking load-bearing rather than optional, and would indict any window where we replay blind.

### What the evidence actually supports

Neither read, cleanly. The decisive artifact is the **one-minute queue**: Zero accepts and silently replays writes queued during `connecting` (`disconnectTimeoutMs`, default ~1 min — dossier §3.4). So they do *not* hold "blind replay is unsafe at any age." They hold: **blind replay is safe at blip scale and trusted nowhere past it** — and past the blip they chose the third option, refusing the writes entirely (modal overlay), rather than building either evidence or a merge surface.

Now turn that calibration on our spec. Our blind-replay window is the realistic envelope: "intermittent network outages (seconds to minutes)... and **same-day sleep/wake**" (scenario.md, Failure Model). Within it, "same-path concurrency stays honest last-write-wins by decree" (plan.md, Replay conflict handling). Parking begins only "beyond the envelope — days-later returns."

Their architect's attack, in their voice:

> You wrote "a stale replay never silently destroys co-editors' newer work (parking converts it to a decision, however old)" — and then scoped it to start at days. We ship blind replay at sixty seconds because sixty seconds is where "nothing relevant happened meanwhile" stops being a safe bet, and we learned that by operating the predecessor. Your envelope replays blind across an eight-hour sleep/wake gap into a document your own scenario says takes 33 writes/sec hot (scenario.md, Canonical Load Figures). The co-editor whose afternoon commit your morning-stale value lands on is not "live LWW" — they're gone, the delta showing them the overwrite plays to an empty room, and your Failure Taxonomy calls exactly this a hard fail with zero silent budget: "Overwritten data from another user's update." Your envelope boundary is measured in *client absence*, but the destruction risk is measured in *what co-editors did meanwhile* — age is a proxy, and at same-day scale it's a bad one.

### Does the attack land?

Partially — and where it lands, it lands on the window, not the architecture.

What holds: live LWW and stale-replay LWW are genuinely different events. In live LWW both parties are present and the loser watches the winning value arrive (field-routed delta, sub-second). In stale replay the overwritten party committed hours ago and may never look again. The scenario's own concurrency model distinguishes them ("last-write-wins live, and conflict-detected on aged replay" — scenario.md, Concurrency Model) and the Parameters table already asks for the right threshold: "Replay parking threshold | **conflict-evidence-driven, age as secondary signal**." The plan's R2 brief 2 ruling under-delivers on that parameter: with "zero server metadata," the only available signal was age, so the ruled design is age-parking with honest-LWW inside a generous window. The scenario and the plan are in quiet tension here, and Zero's one-minute calibration is field evidence that the tension is real.

What doesn't hold: their conclusion (refuse writes, modal overlay) is domain-fatal for implicit save — "typed means saved" (scenario.md, Write Pattern) cannot coexist with "prevent the user from inputting data" (their connection docs, verbatim in dossier §3.4). And their own tradeoffs list names our path as viable ("Support custom UX to allow users to fork and merge conflicts") — they declined to build it as a service vendor; we build it as framework machinery. The outbox + parking architecture stands.

### The amendment: park-then-verify (new finding, adopt)

The R2 ruling rejected the *server-side* per-path last-write map (a second durable write per write, forever). It never considered the client-side mechanism, and our substrate hands it to us nearly free:

- **Each outbox entry records the base value of every path it writes**, captured at optimistic-apply time. For the dominant commit shape (one field path per 300ms debounce — scenario.md, Write Pattern) that is one scalar per entry. The rebase engine *already* stashes confirmed versions on first touch (plan.md, Rebase mechanics) — the synced/pending separation gives us the comparison surface by construction.
- **On resume, entries past a short age threshold hold out of the replay batch** until their channels' `live` arrives (ws-protocol §5 step 6), then verify: fresh synced value vs recorded base, per touched path.
  - base == fresh → nothing changed underneath (ABA is value-neutral) → **auto-release**, replay proceeds. No confirm fatigue.
  - base != fresh → a co-editor or migration moved the path → **evidence-park**, field-routed confirm with both values.
  - no fresh state available (channel no longer subscribed, or path unprojected — the contribution ledger already knows projected paths, same machinery as the computed-skip rule in plan.md Schemas) → **age-park**, conservative confirm.
- Fresh entries (inside the blip window) replay immediately, ungated — §5 step 5's sub/outbox race is preserved for the common case.

Properties: zero server metadata (the ruling's constraint holds), zero wire change, client-only bytes (before-values in IDB outbox entries), the verify is a `detectChanges`-class compare (utils, shipped in PR #242). The age threshold stops being the safety mechanism and becomes a scheduling detail — evidence is primary, age secondary, which is what scenario.md's parameter table said it wanted. The blind window can then shrink toward Zero's calibration (minutes, not same-day) without any confirm-fatigue cost, because non-conflicting aged entries auto-release silently.

Hobbyist pricing: rides the outbox they already use, a few lines of compare, single-user apps never park. Effectively free (scenario-hobbyist.md, What This Persona Never Sees — conflict surfaces stay invisible because they never trigger).

### Row 2 folds in: the three-class park taxonomy (OQ3 answered)

Their cascading-failures list ("business logic and authorization rules can pass while offline, but break when the user reconnects") plus park-then-verify yields the full taxonomy the dead-letter surface should distinguish:

| class | trigger | confirm UX |
|---|---|---|
| **evidence-park** | base != fresh on a touched path | field-routed diff, mine-vs-theirs, apply/discard per field |
| **rejection-park** | replayed entry settles `result.error` (4301 permission/check/run — ws-protocol §2) | validation-shaped server reason, content retained, edit-and-retry affordance |
| **age-park** | threshold passed, no evidence obtainable | conservative confirm, both the disclosure and the decision |

Rejection-park is the under-billed class the dossier flagged — it requires no new machinery (the result path already exists), only equal billing in the dead-letter surface and distinct copy. Disposition on row 2: **adopt, confirmed** — and it merges into the taxonomy above rather than standing alone.

**Row 1 disposition: confirmed-divergence, amended** — outbox + parking stands against their reject-writes posture, with park-then-verify as the spec amendment that closes the envelope-boundary hole their one-minute calibration exposes.

---

## 2. Granularity divergences (rows 3, 4)

### Row 3 — whole-row sync vs field projections

Their architect: "Your deep-path projections require a client-side projection-union ledger your own plan calls 'fiddly, needs its tests early' (plan.md, Field Projections). We rejected column projection *for a reason* — whole rows compose: any query's rows serve any other query, types are shared, and there is no per-doc 'which fields do I hold' state to corrupt. Your ledger is exactly that state. For your scenario — 2-3 role tiers — why not 2-3 full per-tier doc shapes and zero ledger?"

The attack fails on the scenario's security requirement, not on bytes. Role-tiered projection is the **field-level permission floor** — restricted roles must never receive certain fields, fail-closed, with schema `private: true` as the backstop (plan.md, Fail-closed by default). Zero's current answer to field-level security is nothing (column permissions are a 2026 roadmap item — dossier §3.7), and their workaround — split tables — dissolves the aggregate-document principle (one consistency boundary, one atomic write target — scenario.md, Aggregate-Document Principle). "2-3 full per-tier shapes" *is* our design — projection variants are exactly that, declared once per channel — the ledger exists not for role tiers (one user holds one tier) but for the constant real overlap: a dashboard window projecting `{vessel, status, landedAt}` of trip X while the open detail page holds full `trips.byId` of X. That overlap is everyday shape in the scenario (Read Pattern: dashboards + detail).

Projection also cuts **fan-out**, not just payload: a write to an unprojected field emits no delta for that channel (plan.md, Field Projections) — at 33 frames/sec/subscriber on a hot doc (scenario.md, Canonical Load Figures) that is the difference between dashboards receiving the firehose and receiving membership-relevant changes only.

Two honesty amendments the attack earns:

- **The ledger needs a projection-free fast path, stated.** Whole-doc channels (the hobbyist's only shape — scenario-hobbyist.md, App Shape) must pay refcount-per-doc only, with path-level bookkeeping engaging solely when a projected channel contributes. The plan's "extends to doc → projected-path → contributing channels" implies this layering — make it explicit so the hobbyist bundle and runtime never touch path machinery.
- **The ledger's failure surface needs a stated degradation promise** — see §3 below (OQ6).

**Disposition: confirmed-divergence stands**, with the two clarifications adopted.

### Row 4 — deep documents vs normalize

Their architect: "Normalize. Your aggregate is ~11 tables in our model: real rows, per-row column-grain LWW (your id-addressed array paths re-derived as tables), indexes, no doc-size ceiling, analytics free. IVM makes reassembly incremental — you're fighting a tax we deleted. Meanwhile you invent keyed-array declarations, row-id minting, positional→id path translation, array-boundary folding your own reactivity review says trackWrites doesn't do (reactivity-review.md, `array-path-folding-not-in-trackwrites`). And your top-level-keys-are-columns rule already concedes our storage layout."

Three places the attack breaks on the scenario:

1. **The variant-heavy depth has no relational landing zone.** The schema breadth is variant permutation: conditional subschemas as the norm, loose regions in v1 (scenario.md, Document Shape). In their model those become JSON columns, and a JSON column is **one opaque wire value with whole-blob LWW** (dossier §3.1, row-patch.ts) — under 10-100 co-editors that is the silent-clobber hard fail on exactly the surfaces where edits concentrate. Their middle path doesn't exist: "no ZQL operators for arrays," JSON filters unshipped, `related()` capped at two chained levels against our depth-4-7 leaf mass (scenario.md, Parameters).
2. **Path granularity is entailed by owning the write path — their architecture structurally can't have it.** Writes enter their system as Postgres row images via logical replication. Row images cannot carry id-addressed array ops — which is the load-bearing clause of our Decision 11 (plan.md). Our paths exist because trackWrites sits at the operation gate. The divergence is not a feature they skipped, it is a posture they can't reach from "the database owns writes."
3. **Top-level-keys-are-columns is the concession that wins, not loses.** We adopt their storage layout where the data is flat (plain tables, the DBA's idiom — plan.md, Adoption Gradient) while the wire keeps paths, so depth pays JSONB only where depth exists and the client never pays reassembly. For an all-flat collection their wire and ours are equivalent (their `update { merge }` carries changed columns — column grain at the top level). The divergence is strictly about the heavy repeating subtrees carrying most of the byte mass and the keyed arrays carrying the concurrency (scenario.md, Parameters) — which is precisely where the scenario lives.

Honest cost, kept on the books: for shallow aggregates the machinery zone (keyed-array schema declarations, id minting, commit-time path translation, the data-layer array-boundary fold) is pure overhead Zero never pays. The hobbyist never sees it (schemaless collections keep whole-array semantics — plan.md, Drafts/Repeating groups fallback), so the cost is carried entirely by the rung that demands it.

**Disposition: confirmed-divergence stands.**

---

## 3. Per-client CVR pipelines vs shared channels — their steelman (row 5, OQ6)

The seat asked for their side argued properly. What per-client server state buys Zero:

1. **Exact per-client diffing.** The CVR knows precisely which rows at which versions each client holds, so every poke is the minimal delta from *that client's* state. No duplicate deltas, no client-side dedup, no overlap bookkeeping — client apply is trivially correct because the server did the set arithmetic.
2. **No client-side union ledger at all.** Row presence is a server fact. Unsubscribe-while-away, permission changes while away, query-set diffs — all server-computed at resume (baseCookie→cookie). Our §5 resume is a seven-step *client* choreography with per-channel cursors, reset substitution, nosub pruning, and tx-hold interactions (ws-protocol §2, §5, open question 3).
3. **Honest fit for personal-args workloads.** Where instance sharing ≈ 1 — which our own scenario stipulates for searchIndex channels ("instance sharing should be assumed low" — scenario.md, Channel Topology) — per-client pipelines are not waste, they're the natural unit. Our shared-instance economics ("500 subscribers cost one selector match" — plan.md, Channels) buy nothing on that channel class.
4. **Warm-pipeline retention.** Their TTL exists because rehydration dominates repeat cost. The analogous cost shape exists for our recompute channels (re-subscribe re-runs the search query).

What they pay, from their own operational record: a Postgres database of per-client state (`ZERO_CVR_DB`), CVR GC bug tail, sticky sessions to preserve warmth, Rehome errors when instances fight over a client group, per-client-group CPU as the scaling unit with yield tuning, and CVR purge → forced full page reload (dossier §3.2, §3.11). Our stateless-node invariant ("no session to resume, only positions to continue from" — plan.md, Connection protocol) deletes that entire class — any node answers any reconnect, and the hobbyist server holds a watermark integer and a TTL ledger, nothing else (ws-protocol §4).

Is our ledger priced honestly in the spec? **Not quite.** Three amendments:

- **Name the choreography cost.** The per-client-diff convenience we forgo doesn't disappear — it lands client-side as the union ledger + resume choreography, which is the single most test-heavy surface of Phase 4. The plan says "fiddly, needs its tests early" — it should say this is *the* structural trade against Zero's CVR: their ops tail (sticky sessions, CVR GC) for our test tail (ledger + resume interleavings). Both are real. Ours is paid once in CI, theirs is paid forever in production — that asymmetry is the argument, and it should be written down rather than implied.
- **State the degradation promise (OQ6 answered).** Zero's ledger-twin failure ends in a visible, crude, healing full reload. Ours currently ends in nothing stated — a corrupt union could silently retain a stale path or silently drop a live one. Promise: (a) dev mode runs a shadow audit — full union recompute compared against the incremental ledger on every unsub/nosub — assertion failure names the divergence; (b) production treats any ledger invariant violation (negative refcount, prune of an absent entry) as per-channel poison → drop the channel's client state → resnapshot. Reset heals the client too — the universal healer extends one layer down. (c) Full reload remains the last resort, same as theirs, but scoped recovery comes first. Add the Phase 4 test verbatim: "ledger corrupted → reset heals."
- **Scope the shared-economics claim.** State in plan.md Channels that the 500-subscriber sharing argument applies to routed channels and is *expected not to apply* to personal-args searchIndex instances — that channel class is protected by `live: false` default economics (Decision 6), not by sharing. The scenario already knows this; the plan should say it where the economics are argued.

**Disposition: confirmed-divergence stands**, with the three pricing amendments.

---

## 4. The brownfield trial, hour by hour (row 11 + seat priority)

Row 11's divergence (their required cache tier + three Postgres DBs vs our zero-dep small rung) is the easy half — Zero's minimum stack flatly violates scenario-hobbyist.md ("No external services, ever, at this rung"), and their queries-endpoint pattern solves a problem (a generic service can't host app code) our co-located server doesn't have. **Stands.**

The hard half is the modal trial: "point it at my staging Postgres with a toy front end," one afternoon.

### Zero's trial, hour by hour (from their docs, dossier §2/§3.11)

| hour | step | friction |
|---|---|---|
| 0:00–0:30 | staging PG: `wal_level=logical` + restart | parameter change + reboot on managed PG, **blocked outright on some managed tiers** |
| 0:30–1:00 | Docker zero-cache, provision `ZERO_CVR_DB` + `ZERO_CHANGE_DB`, initial replica sync (minutes) | three databases + native sqlite3 postinstall (documented install friction) |
| 1:00–1:45 | schema.ts — **generated** (drizzle-zero / prisma-zero) — plus queries.ts and a small query endpoint (`ZERO_QUERY_URL`) | endpoint needs an app-server stub even for a toy |
| 1:45–2:30 | client app (build step, ~96KB gzip), `useQuery`, rows render. `psql UPDATE` → live propagation. **Magic moment, writes untouched** | |

Roughly 2.5 hours when nothing blocks. The trial's genius: the magic moment requires **zero write migration** — CDC carries existing writes, mutators come later or never.

### Our trial as currently spec'd

Stalls almost immediately, in three places:

1. **Schema authoring.** Rung 2 (live reads) fronts existing tables, and top-level-keys-are-columns defines the mapping (plan.md, Adoption Gradient) — but nothing in the spec *derives* it. Hand-writing a schema for a 40-column legacy table kills the afternoon. Zero's onboarding teaches the answer directly: **the schema is a generated artifact** (dossier row 17). Ours needs the reverse direction — DB → SUI schema introspection (`information_schema` is enough for flat tables, which "will mostly be vanilla SQL" per plan.md's own framing). A dev-mode `fromTable: true` or a CLI generator. Same seam as the row-17 adopt, one more consumer.
2. **`watch()` requires the same WAL friction as Zero** (`REPLICA IDENTITY FULL`, logical replication slot — plan.md, External Writers) — and the plan builds it third (Build Sequence, Phase 3). But the plan already names the escape: "No native CDC: scoped poll-and-diff as a degraded implementation." **Promote poll-and-diff from degraded fallback to the trial rung's default.** A poll-watch (`watch: { poll: 5000 }`) needs zero DB privileges, zero config, works over any readable connection — including managed tiers where Zero's trial dies at hour zero. Seconds of ingestion staleness is the refresh-tier philosophy applied to capture, fully inside the soft-fail budget for a trial and for most internal tools. Graduating to logical replication becomes a production step, not a trial gate.
3. **CDC-backed collection semantics are unpriced** — the plan's own open question ("handle status, permission definition, projection behavior when the layer never sees writes"). The trial path is the least-specified page of the spec, and it is the modal first contact. Minimum to pin: read-only collections reject mutator registration (or mutators run client-optimistic and hard-fail with a named error), handle `ready`/`lastDeltaAt` semantics under poll-watch, `can()` defaulting open at the trial rung.

### Our trial as amended

| hour | step |
|---|---|
| 0:00–0:10 | `npx @semantic-ui/sync-server --db postgres://staging` — one command, memory channel log, poll-watch default |
| 0:10–0:20 | introspected collections (dev mode derives flat schemas from `information_schema`, logs them for promotion to source) |
| 0:20–0:40 | CDN page: script tag, `subscribe('landings')`, `{#each}` — no build, no endpoint. Two browsers, `psql UPDATE`, live within the poll interval |

Under an hour, zero DB configuration, zero build, zero external services. The differentiators are exactly the runtime-first assets: CDN client (no 96KB engine, no bundler) and the co-located server (no queries endpoint). What Zero's onboarding taught: generate the schema, never author it for existing tables — and make the magic moment write-free (our rung 2 already is, by design — keep it that way in the steelman corpus).

**Disposition: row 11 confirmed-divergence stands.** New findings: introspection-generated schemas, poll-watch as first-class trial rung, one-command server, CDC-collection semantics pinned — all land in the plan's existing "Brownfield pricing" open question, giving it content.

---

## 5. The remaining confirmed-divergences, attacked briskly

### Row 12 — unconditional liveness vs tiered

Their architect: "Developers can't predict which views need liveness. Your `live: false` default is a stale-dashboard bug class with support tickets attached. We made everything live and govern cost invisibly with TTL."

Misfires on a structural fact: in our design **the collaborative surfaces are live by default** — routed channels, which carry detail pages and everything the hot-doc scenario touches (plan.md, Decision 6). The liveness knob exists only on searchIndex, an enterprise verb the hobbyist never meets, and the default formalizes a staleness tolerance the scenario argues already exists (scenario.md, Channel Topology). Their own circuit breaker ("if advancement looks like it'll take longer than rehydrating... aborts and resets") is the confession that live-everything has a cost cliff — they surface it as an ops incident (yield tuning, sticky sessions), we surface it as a priced default. One obligation their attack does pin: the **freshness affordance is load-bearing** — `live: false` is only honest if the disclosed-staleness UI actually ships (scenario.md soft-fail rule b: disclosed when exceeding bounds). That's a consumer-surface deliverable, not an option. **Stands.**

### Row 13 — client ships a database

Their architect: "Your re-run bet is unbenched by your own admission (plan.md, Tier 1.2 — 'if re-run collapses, IVM moves from deferred to required'). We shipped IVM because re-run collapses at Linear scale. You're betting the architecture on a bench you haven't run."

The cross-exam sharpens this into the entailment the dossier circled but didn't state: **IVM is not their perf luxury, it is entailed by queries-as-subscriptions** — query-driven partial sync produces an unbounded, query-unioned local set, which forces incremental maintenance, which forces the planner/pipeline engine, which is the 96KB. Channel-scoped replicas (Decision 4) bound the pool by construction, which is what makes re-run viable, which is what makes the small client possible. The two bundle sizes are not two engineering cultures — they are downstream of the partial-sync decision. The substrate then cuts the re-run constant: an over-broad re-run lands on reference-stable arrays → reconcile same-ref fast path → equality-deduped `notifyField` → near-zero DOM cost (primitives-renderer.md, each-block reconcile), so the bench question is selector matching over bounded pool maps, not render work. The bench (Tier 1.2) remains genuinely gating — at 5k docs / 20 live queries / write storms, per the plan. **Stands, bench obligations unchanged.**

### Row 15 — local-results-not-a-prefix shuffle

Validates Decision 4, but attacking our own equivalent surface yields an adoption: their runtime `complete`/`unknown` result type is a **runtime signal** where our coverage checker is a **dev-time lint**. In production, a query whose selector escaped the checker renders silently incomplete — Meteor's classic, the exact trap priors-audit #1 names. The subsumption machinery is per-query-registration, not per-run, so deriving a runtime-readable coverage status on the query result's provenance (plan.md, find() returns data — provenance already carries `{ collection, selector, options }`) is cheap and graduates the lint into a signal apps can gate UI on. Folds into row 14's adopt. **Stands, with the runtime-coverage adoption.**

### Row 16 — no ephemeral tier

Attack on ourselves: is `ephemeral: true` real or vapor? The client half is substrate-verified — one peer's cursor move = one field delta = one `notifyField` = one style write (reactive-context.js per-FIELD deps; ~100 single-field fires/sec is inside scheduler tolerance, plan.md Ephemeral Collections' own figure). The server half (latest-per-key map, conflation, no log) and the **ephemeral frame type are unshipped spec** — the plan defers presence "pending an ephemeral frame type" and the v2 synthesis list carries it. The divergence is real (their architecture sends a cursor move through WAL → replica → IVM → CVR, with Reflect retired and unabsorbed — dossier §3.8) but our row is only as good as the v2 frame. **Stands, with the v2 obligation flagged as the row's gate.**

### Row 18 — migrations

Their architect: "You own a schema layer, so the DBA's natural idiom — a raw UPDATE rewriting a JSONB column — is contraband in your model, and CDC will faithfully replicate the clobber. Our expand/contract pain is at least the *same* pain the team already has."

Two substrate facts defuse most of it, and both deserve spec text:

- **CDC row images recover path granularity.** `watch()` yields `{ before, after }` (plan.md, External Writers) and `detectChanges(before, after)` (utils, PR #242) reduces a whole-column rewrite to its genuinely-changed leaf paths before routing. External writes keep fine wire granularity — the plan implies this ("CDC events are complete") but never states the diff step. State it: without it, the live-reads rung (all deltas CDC-borne) would look whole-doc on the wire.
- **The client's equality-checked apply self-prunes coarse deltas regardless** — `setKey`/`notifyField` are equality-deduped (reactive-context.js:284, ws-protocol Apply discipline), so even a whole-doc delta wakes only the bindings whose values actually changed. Wire bytes are the only residual cost of a coarse external write.

The storage-level lost-update race (whole-doc read-transform-writeback reverting live operators) is real but symmetric — any SQL writer races any other in their model too. It's the price of SQL coexistence, not of our design. **Stands.**

---

## 6. The adopts, re-derived or confirmed

**Row 2 — rejection-on-replay first-class: adopt, confirmed.** Merged into the three-class park taxonomy (§1). No new machinery — the `result.error` path exists (ws-protocol §2), the work is dead-letter taxonomy + distinct confirm UX.

**Row 7 — recompute circuit breaker: adopt, re-derived.** Their trigger ("advancement looks like it'll take longer than rehydrating") compares times the server estimates poorly and we needn't estimate at all — **bytes are the estimator**, known exactly server-side. Three sites, one rule (emit incremental while `incrementalBytes ≤ k × snapshotBytes`, else snapshot/reset):

1. **Sub-time tail-vs-snapshot** — the server already chooses ("tail replay if the server can serve it, snapshot otherwise" — ws-protocol §2 `sub`) with the heuristic unstated. The scenario computes the rule by hand already: 700KB tail vs 150-200KB snapshot at a 2-minute absence (scenario.md, Canonical Load Figures). Make bytes the stated rule.
2. **Recompute-diff vs window snapshot** — for searchIndex emits, the query runs either way; the choice is diff deltas vs fresh window. When most of the window changed, the snapshot is smaller — compare and send the cheaper.
3. **Log-collapse threshold** (ws-protocol §4) — already volume-based, restate in the same vocabulary so all three valves read as one rule.

`k ≈ 1` to start, bench tunes. Answers OQ2.

**Row 8 — version-skew statement: adopt, confirmed.** Fold into ws-protocol §7: the reference server speaks protocol `N` and `N−1`, clients send their highest, `welcome` downgrades, server deploys first. Their expand/contract deploy-order quick-reference becomes a reference-server doc page. Answers OQ5.

**Row 9 — connection `reason`: adopt, confirmed.** `sync.connection.reason` = `{ code, text }` from the last close/reject (the §2 reason-code table is already the vocabulary — one field, no new states). Zero bytes of hobbyist concept cost. Their Sentry-forwarding pattern is a docs example, not API. Answers OQ7: yes, v2.

**Row 14 — complete/unknown flicker pattern: adopt, extended.** Channel-grain `ready` already encodes it (ws-protocol §6, "never flickers back"); the Phase 0a edge-state pages encode the 404 anti-pattern ("don't render not-found until ready"). Extended per row 15's attack: surface **runtime coverage** on query provenance so the dev-mode checker's verdict is also a production-readable signal.

**Row 17 — schema-as-generated-artifact: adopt, strengthened.** Standard Schema v1 emission was already priors-audit #3. The brownfield walk (§4) adds the reverse generator — DB → SUI schema introspection — as the same seam's second consumer, and the one the modal trial actually blocks on.

---

## 7. The reconsiders, resolved

### Row 6 — TTL'd deactivated-queries-kept-warm → **adopt-the-goal-not-the-mechanism**

The lens rule's cleanest application in this dossier. Their 5m TTL keeps *server-side per-client pipelines* warm because rehydration is their dominant repeat cost — the mechanism presumes their substrate (per-client query pipelines, CVR). We hold no per-query server state to keep warm:

- **Routed channels: the durable log is already the warmth.** The channel log outlives the instance (retention knob, Redis stream / ring buffer — plan.md, Multi-node), so unsub → resub-with-cursor gets tail replay even after instance teardown. Server-side linger buys nothing and a lingering hot-doc subscription costs real fan-out (33 frames/sec to a client rendering nothing). Keep `linger` default 0 (ws-protocol §2) as the route-flip debounce it was born as.
- **The goal — instant return navigation — is client-held state, like all our progress.** Today's spec evicts pool docs at unsub (union prune — plan.md, Field Projections), so route-away-and-back pays a full snapshot. Adopt a **retention cache distinct from pool membership**: on last unref, the channel's doc-set + cursor move from pool (covered, queryable) to retention (hydration source only, invisible to queries — preserving the coverage checker's honesty about what's live). Return navigation re-enters through the boot machine the spec already has — hydrate-from-retention, catch up from stored cursor (ws-protocol §5, boot-from-IDB "is the same machine"). Zero's instant-back UX, zero standing fan-out, zero server state.
- **Recompute channels: args-keyed client window cache** with overlap-then-swap (already specified for typing — plan.md, Search channel mechanics) extended to paging-back. Server-side there is nothing to linger on a `live: false` channel by construction (no cursor, no log, no window state — plan.md, searchIndex factory).

Retention-window constants are Phase 0a / bench material, alongside ws-protocol §8.6's smoothing constants.

### Row 10 — mutator settlement promises → **adopt** (lazy handle, 0a-gated)

Their `.client`/`.server` per-mutation promises are honest in their model because mutators are async anyway. Ours are sync and uncolored by doctrine — the question is whether per-call settlement can exist without coloring. It can, because **the bookkeeping already exists**: every mutator call appends a pending entry (outbox), the rebase engine tracks its settlement, and the wire carries per-call `result` (ws-protocol §2). Expose the pending entry itself as the call's return value:

```js
const write = Todos.toggle(id)   // sync, fire-and-forget — return value ignorable
write.status                     // reactive: 'pending' | 'ok' | 'rejected' | 'parked'
write.server                     // lazy promise, allocated on first access
```

No coloring: the caller proceeds synchronously, nothing requires `await`, the 90% case ignores the return value entirely (the sync-callbacks doctrine intact — the promise is a thin alias shipped where genuine async demand exists, exactly the memory's 90/10 rule). No allocation cost on the hot path: the handle *is* the pending entry the outbox already created, with the promise allocated only on `.server` access. `status: 'parked'` ties it into the §1 taxonomy. The scenario case it serves — confirmed-write sequencing without graduating to an action (plan.md, Write Path 50/50) — stays the exception by ergonomics, not by prohibition. Gate the exact surface through Phase 0a steelman (it's a consumer-felt API), but the recommendation is adopt.

---

## 8. Open questions, worked

1. **Linger defaults per channel class** — answered (§7, row 6): server-side linger 0 everywhere (routed channels: the durable log is the warmth; `live: false` recompute channels hold nothing to linger). The adoption is client-side: retention cache for routed channel doc-sets + cursors, args-keyed window cache for recompute. *needs-bench* for the retention-window constants only.
2. **Circuit-breaker estimator** — answered (§6, row 7): bytes, not time — `incrementalBytes ≤ k × snapshotBytes`, applied at sub-time tail-vs-snapshot, recompute diff-vs-snapshot, and log collapse. `k ≈ 1`, *needs-bench* to tune.
3. **Parked-replay taxonomy** — answered (§1): three classes — evidence-park (field-routed mine-vs-theirs), rejection-park (validation-shaped server reason, edit-and-retry), age-park (conservative confirm) — with auto-release for verified no-conflict entries. Distinct confirm UX per class, copy is app-space.
4. **Settlement accessor** — answered (§7, row 10): the pending entry as a lazy handle — sync call, reactive `status`, promise on demand. 0a-gated surface.
5. **Version-skew window** — answered (§6, row 8): protocol `N` and `N−1` at the reference server, server-deploys-first, stated in §7 v2.
6. **Union-ledger failure surface** — answered (§3): dev-mode shadow audit (incremental vs recomputed union per unsub/nosub), production invariant-violation → per-channel poison → resnapshot, reload as last resort. Phase 4 test named: "ledger corrupted → reset heals."
7. **`reason` on connection state** — answered (§6, row 9): yes, v2 — `{ code, text }` riding the existing §2 code table.

---

## 9. New findings

| # | finding | disposition | spec landing |
|---|---|---|---|
| N1 | **Park-then-verify**: outbox entries record base values per written path; aged entries hold for `live`, verify against fresh synced state; auto-release no-conflict, evidence-park real ones. Conflict evidence with zero server metadata — resolves the scenario-parameter ("conflict-evidence-driven, age secondary") vs plan-ruling (age-only) tension that Zero's one-minute blind window exposed | adopt | plan.md Replay conflict handling + ws-protocol §5 |
| N2 | **Brownfield trial kit**: DB→schema introspection (generated-artifact seam, reverse direction), poll-and-diff watch promoted to trial-rung default (beats Zero's WAL gate outright), one-command server, CDC-collection semantics pinned | adopt | plan.md Adoption Gradient + the existing brownfield open question |
| N3 | **CDC path recovery, stated**: router diffs `{before, after}` row images via `detectChanges` so external writes keep path-granular wire deltas; client equality-checked apply self-prunes coarse deltas regardless | adopt (clarification) | plan.md External Writers |
| N4 | **Ledger projection-free fast path**: whole-doc channels pay refcount-only; path-level union engages only when a projected channel contributes — hobbyist pays nothing | adopt (clarification) | plan.md Field Projections |
| N5 | **Runtime coverage signal**: per-query coverage status derived from the same subsumption machinery, readable on result provenance in production — the dev lint graduated to their `complete`/`unknown` outcome at our granularity | adopt | plan.md Client Store (coverage checker) |
| N6 | **Retention cache ≠ pool membership**: two-layer client store giving instant return-navigation without standing fan-out or coverage lies | adopt | plan.md Client Store + ws-protocol §5 boot |
| N7 | **The IVM entailment**: queries-as-subscriptions ⇒ unbounded local set ⇒ IVM ⇒ 96KB client; channel-scoped replicas ⇒ bounded pool ⇒ re-run viable ⇒ small client. The bundle divergence is downstream of Decision 4, not a separable engineering choice — worth one sentence where Decision 4 is argued | adopt (framing) | plan.md Decision 4 |
| N8 | **Sharing-economics scope note**: the 500-subscriber shared-instance argument applies to routed channels; personal-args searchIndex has sharing ≈ 1 and is protected by `live: false` economics instead | adopt (clarification) | plan.md Channels |
| N9 | **Freshness affordance is load-bearing**: `live: false` defaults are only honest if the disclosed-staleness consumer surface ships — a deliverable, not an option | adopt (obligation) | ws-protocol §6 / Phase 5 |
| N10 | **Ephemeral frame gates row 16**: the presence divergence is only as real as the v2 ephemeral frame type — flag it as that row's gate in the v2 synthesis | obligation | ws-protocol v2 list |

---

## 10. Disposition ledger

| dossier row | was | now | delta |
|---|---|---|---|
| 1 offline writes | confirmed-divergence | confirmed-divergence, **amended** | park-then-verify (N1); blind window shrinks, evidence becomes primary |
| 2 rejection-on-replay | adopt | adopt | merged into three-class park taxonomy |
| 3 whole-row sync | confirmed-divergence | confirmed-divergence | + N4 fast path, + §3 pricing amendments |
| 4 deep documents | confirmed-divergence | confirmed-divergence | sharper grounds: path granularity entailed by write ownership; shallow-aggregate overhead conceded honestly |
| 5 CVR pipelines | confirmed-divergence | confirmed-divergence | ledger priced honestly: choreography cost named, degradation promised (OQ6), sharing claim scoped (N8) |
| 6 TTL linger | reconsider | **adopt-the-goal-not-the-mechanism** | client retention caches (N6); server linger stays 0 |
| 7 circuit breaker | adopt | adopt, **re-derived** | bytes estimator, three valves, one rule |
| 8 version skew | adopt | adopt | N / N−1, server-first, §7 v2 |
| 9 connection reason | adopt | adopt | §6 v2, one field |
| 10 settlement promises | reconsider | **adopt** (0a-gated) | lazy pending-entry handle, uncolored |
| 11 cache tier + coupling | confirmed-divergence | confirmed-divergence | brownfield trial kit (N2) is the standing obligation |
| 12 unconditional liveness | confirmed-divergence | confirmed-divergence | + N9 freshness-affordance obligation |
| 13 client ships a database | confirmed-divergence | confirmed-divergence | + N7 entailment framing; Tier 1.2 bench still gates |
| 14 complete/unknown | adopt | adopt, **extended** | + N5 runtime coverage signal |
| 15 prefix shuffle | confirmed-divergence | confirmed-divergence | attack on our own surface yielded N5 |
| 16 no ephemeral tier | confirmed-divergence | confirmed-divergence | gated on the v2 ephemeral frame (N10) |
| 17 generated schema | adopt | adopt, **strengthened** | + reverse generator for brownfield (N2) |
| 18 migrations | confirmed-divergence | confirmed-divergence | + N3 CDC path recovery stated |

No row flipped to their side. Two reconsiders resolved, one divergence materially amended, and the most valuable output is N1 — which their production history argued us into, exactly the way a reference comparison should work.

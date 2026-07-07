# Reference Comparison — Synthesis

Synthesis of the reference-implementation comparison — [Zero](research/deep-zero.md) ([cross-examination](research/crossexam-zero.md)), [Supabase Realtime](research/deep-supabase-realtime.md) ([cross-examination](research/crossexam-supabase-realtime.md)), [Convex](research/deep-convex.md) ([cross-examination](research/crossexam-convex.md)) — run against [`plan.md`](plan.md) and [`ws-protocol.md`](ws-protocol.md), 2026-06-12.

Point-in-time record. The structural amendments (1, 2, 3, 19, 22) were ruled and encoded into the spec the same day, along with three further rulings the working POC's evidence forced — `plan.md` carries all of them dated. The remaining wording- and section-tier amendments are queued for the protocol v2 synthesis and a plan editing pass. The rejected section is why this document outlives its open items: it records the alternatives at full strength with their rejection reasons — the spec's tested armor.

How to read: every item is a rulable proposal — a named spec section and a concrete change direction, ranked by decision impact. Each reference system was researched by one reader and attacked by an independent adversarial reviewer — a "seat"; the **Seats** field on each amendment records which raised it and whether the supporting arguments agreed ("unanimous") or split ("contested"). Nothing the seats produced was dropped. Findings that didn't earn an amendment are in the watch list or the rejected section with their rejection reasons. Effort classes: **wording** (sentences into an existing section), **section** (a new subsection or a real rewrite of one), **design-session** (open choices remain), **spike** (code before text).

Headline: no architectural decision flips. One place the spec is *wrong* rather than incomplete (amendment 1), two places a core term is undefined (amendments 2, 4), and one prior R2 ruling is amended on new evidence (amendment 3). The rest is hardening, articulation, and obligations the divergences turn out to rest on.

---

## 1. Ranked Amendments

### 1. `filter: fn(ctx)` breaks channel identity — decide before two implementations exist

**Change** — plan.md Channels / Publication config. The `filter` key's function form takes `ctx`, but channels are shared per `(name, args)` with one resolved selector, one cursor, and identical bytes fanned to every subscriber. Two subscribers of the same address whose `fn(ctx)` resolves differently means instance sharing is a lie or rows leak past the filter. Three resolutions, pick one: (a) resolved filter output joins channel instance identity — sharing degrades quietly per distinct resolution, (b) constrain `fn(ctx)` to values derivable from declared args so `(name, args)` stays identity-complete, (c) drop the function form — tenant scoping lives in args plus `permission`. The cross-exam leans (b) or (c): the re-gating amendment (5) deliberately re-runs only the permission slot because re-resolving a per-subscriber filter on a shared instance has no sane answer.
**Source lesson** — Supabase. Their v1 died of per-subscriber content visibility on a shared stream (WALRUS: 11.2ms at 1 subscriber, 303.8ms at 10,000, linear). The survivor design keeps per-subscriber state to access *booleans* only. Three years to walk back.
**Anchor** — scenario.md Channel Topology: role-tiered projection variants split the channel 2-3 ways, never per-subscriber. The 500-subscriber sharing economics in plan Channels depend on it.
**Seats** — Supabase seat, flagged needs-jack. The one finding that names a place the spec is wrong rather than incomplete.
**Effort** — design-session.

### 2. Authoritative isolation contract — per-doc serial apply

**Change** — plan.md Execution Without Fibers (or Sync Loop, server side) plus a conformance MUST in the protocol-v2 synthesis. State what two concurrent authoritative operations observe of each other on one document. Recommended contract, drafted in the cross-exam: *update callbacks on a document execute serially against its latest committed state (in-process apply queue on the reference server, `SELECT FOR UPDATE` row lock on Postgres — the lock is the queue, multi-node-correct). A single operation's writes commit atomically under one txid. Single-document invariants enforced in an update callback hold under any concurrency. Cross-document invariants are out of the mutator contract — needing them is the signal the operation wanted to be an action.* Group-commit (run N queued callbacks back-to-back, one storage transaction) covers the 330 ops/sec hot-doc ceiling inside the sub-second staleness bound. Rejected alternatives priced in the cross-exam: per-collection queues (migration batches head-of-line block live operators), doc-level OCC (~100% false-positive at doc grain — the same math the plan used to reject per-doc versions), free LWW interleave (write skew on computed fields, a hard fail). Note Decision 1 is untouched: path-granular LWW remains the *cross-operation* conflict semantic, this pins what a single body may rely on while running.
**Source lesson** — Convex. "Anything less than serializable is too hard a programming model" — they named their isolation and built a committer for it. Our aggregate-document principle delivers their standard at exactly the boundary the domain declared, for the price of a FIFO queue instead of a retry loop. Their quote is absorbed, not rebutted.
**Anchor** — scenario.md Failure Taxonomy: silently wrong derived data (stale computed `total` from interleaved writes) is destruction of information, zero silent budget. Canonical Load Figures: 33-330 ops/sec on the hot doc.
**Seats** — Convex seat, unanimous. Re-dispositioned adopt-the-goal-not-the-mechanism: the goal (stated contract) adopted, OCC rejected.
**Effort** — section. Adds one limits-table consequence: a per-callback execution budget (amendment 11).

### 3. Park-then-verify — conflict evidence with zero server metadata (amends R2 ruling 2)

**Change** — plan.md Replay conflict handling plus ws-protocol §5 resume choreography. Outbox entries record the base value of every path they write, captured at optimistic-apply time (the rebase shadows already stash confirmed versions — the comparison surface exists by construction). On resume, entries past a short age threshold hold out of the replay batch until their channels' `live` arrives, then verify fresh-synced value vs recorded base per touched path: base == fresh → auto-release, replay proceeds, no confirm fatigue. base != fresh → evidence-park with a field-routed mine-vs-theirs diff. No fresh state obtainable (channel unsubscribed, path unprojected per the contribution ledger) → age-park, conservative confirm. Fresh entries inside the blip window replay immediately, ungated. The dead-letter surface gains the three-class taxonomy: **evidence-park** (field-routed diff, apply/discard per field), **rejection-park** (replayed entry settles `result.error` 4301/4102 — validation-shaped server reason, content retained, edit-and-retry), **age-park** (conservative confirm). Properties: zero server metadata (the original ruling's constraint holds), zero wire change, client-only bytes. The blind-LWW window then shrinks toward minutes rather than same-day — age becomes a scheduling detail, evidence the safety mechanism.
**Source lesson** — Zero. They blind-replay only inside a one-minute `connecting` queue and trust replay nowhere past it — calibration paid for by operating Replicache, which promised hours-to-days and replayed blind, machinery Zero hardcodes off (`enableMutationRecovery: false`). Their cascading-failures list (business rules passing offline, breaking on reconnect) is exactly the rejection-park class.
**Anchor** — scenario.md Failure Model names same-day sleep/wake inside the envelope while the hot doc runs 33 writes/sec — an hours-stale blind replay over a departed co-editor's commit is the taxonomy's named hard fail. The Parameters table already specifies "conflict-evidence-driven, age as secondary signal" — the current ruling ships age-only. This resolves a tension inside our own spec.
**Seats** — Zero seat, unanimous. The strongest finding of the comparison.
**Effort** — section.

### 4. Commit-visibility crash consistency — the conformance MUST

**Change** — plan.md Sync Loop (server side) plus protocol-v2 conformance list. The spec's write path is two steps ("runs authoritative impl in a transaction, routes deltas to channels") over two durable systems — a crash between commit and emit yields a committed write no subscriber ever sees, on a channel whose cursors stay valid. State the invariant: *a committed transaction's deltas MUST become visible in every affected channel log, or the affected channels' epochs MUST change* (reset → resnapshot, the existing healer). Single-node reference server: free by mortality — in-process logs die with the process, epoch-in-cursor forces resnapshot on restart. Say it is load-bearing, not luck. Multi-node: transactional outbox — the delta record commits in the storage transaction, an at-least-once dispatcher publishes to the stream (duplicates already safe under the idempotent-receiver law). CDC-as-emit-source rejected as primary (no attribution or txid — breaks confirmation and rebase), stays the backstop.
**Source lesson** — Convex. They structurally cannot have this bug — the transaction log *is* the subscription feed, commit and publish are one write. Our unbundling (Decision 9) buys the maintenance boundary and silently carries the dual-write problem their monolith dissolves.
**Anchor** — scenario.md Failure Taxonomy: an unemitted committed write is unbounded *and* undisclosed staleness — both soft-fail rules violated at once, the External Writers section's named worst failure shape reproduced inside the core.
**Seats** — Convex seat, unanimous. Pairs with amendment 2 as the two server-side MUSTs no wire transcript can check.
**Effort** — section. The dispatcher doubles as amendment 9's substrate — one mechanism, two consumers.

### 5. Auth refresh hardening — re-gate permissions, pin the principal

**Change** — ws-protocol §2/§4. Two clauses. (a) On successful `auth` refresh the server re-runs the declarative `permission` slot for every channel in the socket's subscription set, denial rides the existing `nosub 4202` path. Stated promise where the taxonomy lives: *revocation latency ≤ min(explicit `server.revoke`, `authExpiresIn`)* — `authExpiresIn` becomes a named security knob. Stated asymmetry: handler-embedded auth (the function escape hatch) keeps the weaker reconnect bound. One sentence in Security Posture: the permission/filter/handler slot separation is what makes re-gating ~10 cheap `can()` calls per client per refresh interval instead of full policy re-evaluation — a structural dividend of the config shape chosen for auditability. (b) `auth` MUST present the same principal — re-auth as a different user either re-evaluates channel permissions (`nosub 4202`) or closes for a fresh handshake. Carry-forward: a re-gate `nosub` lands on a handle with no `error` face today — the already-listed v2 handle gap graduates from cosmetic to security-visibility.
**Source lesson** — Supabase paid for (a): their `access_token` message nils the policy cache and re-evaluates, with JWT-expiry disconnect as the blunt fallback — and the cross-exam found our refresh message as specced actively *launders* permissions past token hard-expiry, the only structural re-gate boundary, making revocation unbounded. Convex supplies (b): identity is versioned separately from the query set so principal changes re-evaluate queries.
**Anchor** — scenario.md Channel Topology role tiers: a demoted operator keeps receiving `records.admin` deltas for as long as the session refreshes, in an enterprise SPA that never closes. Unauthorized disclosure outranks both failure classes in the taxonomy.
**Seats** — Supabase and Convex seats independently, convergent. Zero wire changes, zero client bytes.
**Effort** — section.

### 6. Ephemeral Collections — state the physics

**Change** — plan.md Ephemeral Collections, five commitments. (a) The single-writer-per-key invariant stated as contract: key ownership = writing connection, multi-device = multiple keys — this is what makes the latest-per-key map merge-free and deletes the CRDT question. (b) Expiry generalized from connection-scoped to *liveness-scoped*: staleness TTL on map entries, killing both ghost classes (dead-node keys and throttled-background-tab keys) with one mechanism native to the tier's physics. (c) Writes while disconnected drop silently by design, never queue — replaying a cursor move is the ghost-animation the section's own prose forbids. The graduation flag is also the offline-durability flag. (d) A per-channel server emit tick (~30Hz default, the scenario's envelope) — conflation currently engages only under backpressure, so a fast producer fans at full inbound rate to healthy consumers. The tick bounds steady-state fan-out and absorbs inbound flooding to parse-plus-map-set cost. Amend the prose to "throttled at source, conflated at the server tick regardless." Plus a generic per-connection inbound frame cap for parse-CPU hygiene. (e) One sentence naming the multi-node carry: Redis pub/sub (not streams — no log to have a position in) into per-node local conflation maps, late-joiner snapshot = the local map. No protocol surface for any of it.
**Source lesson** — Supabase. Phoenix Tracker is a CRDT because key → list-of-metas is multi-writer-per-key — machinery our semantics delete. Their CRDT still doesn't fix throttled-tab ghosts (documented wart, client-side re-track workaround) where staleness TTL fixes both. Their 5-track-calls-per-30s presence throttle exists because tenants don't self-throttle.
**Anchor** — scenario.md true-realtime surfaces: 15-30Hz collaborative review, soft fails bounded and self-healing — a ghost cursor lives at most one TTL.
**Seats** — Supabase seat (rate floor reshaped from inbound cap to emit tick, presence CRDT re-filed adopt-the-goal). Per-tenant limiting declined — multi-tenant SaaS shaped, our reference server is single-tenant.
**Effort** — section.

### 7. Ephemeral frame type — promote to named protocol-v2 deliverable

**Change** — the ws-protocol v2 synthesis list. Two confirmed-divergences (Zero has no ephemeral tier at all, Convex runs presence through the durable database) rest on a frame type ws-protocol.md does not define — plan.md says "pending an ephemeral frame type." Name it as a gated deliverable so the divergence becomes a shipped fact rather than a comparative claim.
**Source lesson** — both seats independently: Convex's presence component is cost-avoidance engineering for a missing tier, Zero retired Reflect without absorbing it. The advantage is real and currently unwritten.
**Anchor** — scenario.md True-realtime surfaces. Their presence components ship today, ours is prose.
**Seats** — Zero and Convex seats, unanimous.
**Effort** — wording (the promotion — the frame design itself is v2 work).

### 8. Cursor and log are two commitments — `retention: 0` is legal

**Change** — plan.md Decision 7 and/or ws-protocol §4, folding the pending R2 retention knob. The spec lets cursor and log read as one commitment. Separate them: the **cursor** is mandatory correctness machinery on every durable channel — gap *detection* (the taxonomy's disclosure requirement), txid completion, monotonic reads, one opaque token. The **log** is a per-channel economics knob that may legally be zero — `retention: 0` answers every resume with snapshot via the cursor-expired path that already exists, no `reset` round trip. The scenario's own math predicts retention near zero on the dominant per-doc channel. One implementation line: partition/segment-drop is the cheap truncation shape if a postgres-backed log table ever ships (Redis XTRIM / ring buffer cover the reference paths).
**Source lesson** — Supabase. Their at-most-once steelman's best point ("your own math prefers snapshot-at-resume") becomes a configuration instead of an architecture. Their Broadcast Replay — a cursor growing inside an at-most-once product, capped at 25 messages — corroborates the cursor-core direction.
**Anchor** — scenario.md Canonical Load Figures: 700KB tail vs 150-200KB snapshot at a 2-minute absence, while a 5s blip wants tens of KB of tail — the knob lets the server pick per channel per resume.
**Seats** — Supabase seat, unanimous (divergence upheld, articulation earned).
**Effort** — wording.

### 9. Scheduler bridge — `schedule()` as a jobs-collection insert

**Change** — plan.md Execution Without Fibers (resolves the deferred "durability ordering for external effects"). `schedule(name, args, { after })` inside an operation body is sugar for an insert into a framework-owned server-only jobs collection: it buffers as a command, commits in the mutator's transaction, rides its txid, and is deduped by the idempotency ledger on outbox replay. The dispatcher is the amendment-4 at-least-once loop — same mechanism, second consumer. Checked against the bimodal-practice claim: no middle rung created — the mutator stays fully simulated, the action stays unsimulated, the bridge is server plumbing (the jobs collection is server-only, the client simulation shows the intent write, never the job — a Phase 0a corpus detail). The decisive argument: client orchestration (call mutator, then await action) breaks offline — the mutator outboxes and replays later, the action rejected fast, the business effect silently never happens. Mutate-then-schedule is the only composition that survives the failure envelope. Their full scheduler/crons/workpool remains platform-tier — say so.
**Source lesson** — Convex. Mutation-records-intent-then-schedules-action is their production-proven bridge, with database invariants preventing double execution.
**Anchor** — scenario.md Write Pattern: business actions (approve, generate documents) with external services, awaited with pending UI.
**Seats** — Convex seat, unanimous.
**Effort** — section.

### 10. Brownfield trial kit — unstall the staging-db afternoon

**Change** — plan.md Adoption Gradient plus the existing brownfield open question, four deliverables. (a) DB → schema introspection: derive flat-table schemas from `information_schema` in dev mode or via CLI, logged for promotion to source — the schema-as-generated-artifact lesson reversed for our direction. Hand-writing a schema for a 40-column legacy table kills the trial afternoon. (b) Poll-and-diff `watch()` promoted from "degraded implementation" to the trial rung's default (`watch: { poll: 5000 }`) — zero DB privileges, zero WAL config, works on managed Postgres tiers where a `wal_level=logical` gate kills the trial at hour zero. Logical replication becomes a production graduation step, not a trial gate. (c) One-command server: `npx @semantic-ui/sync-server --db postgres://staging`. (d) CDC-backed read-only collection semantics pinned: mutator registration policy on read-only collections (reject, or optimistic-then-named-error), handle `ready`/`lastDeltaAt` under poll, `can()` defaulting open at the trial rung. As amended the trial is under an hour with no build, no endpoint, no Docker — as spec'd today it stalls at schema authoring.
**Source lesson** — Zero. Their trial is ~2.5 hours when nothing blocks and dies outright on managed PG without WAL access. Their onboarding teaches two things: generate the schema, never author it for existing tables, and make the magic moment write-free (our live-reads rung already is — keep it that way in the steelman corpus).
**Anchor** — plan.md's own framing: the modal first contact for teams with production stacks ("they will mostly be vanilla SQL"), and the trial path is the spec's admitted least-specified page.
**Seats** — Zero seat, unanimous.
**Effort** — design-session (introspection shape and the CDC-collection semantics carry open choices).

### 11. Limits become a first-class artifact

**Change** — ws-protocol §2/§8 plus a consolidated limits table in the reference-server spec. Wire side: an optional `welcome.limits` object (`maxPayloadBytes`, `maxChannels`, additive under §7 unknown-field tolerance — not stuffed into `caps`, which is capability negotiation), one new reason code `4204 limit-exceeded` surfacing on `nosub` (channel-cap breach) and `result.error` (oversized call — content survives in outbox/dead-letter per the hard-fail conversion rule). Rate dimensions stay behind `4503 + retryAfter`, transport guards stay `4002`. Explicitly banned: outbound deltas are never size-dropped (Supabase drops oversized payloads to a notice — a silently missing delta is what the taxonomy forbids). Table side: every dimension named in reference-server config — collapse threshold, maxBufferedBytes, parking age, payload caps, channels-per-connection (a high diagnostic default doubling as the leak tripwire, not a billing tier), per-engine searchIndex ceilings (max docs scanned per recompute, max terms, max filter fields, with stated degradation: truncated window plus a disclosed flag, never silent), and the amendment-2 consequence: a per-update-callback execution budget with a dev-mode slow-callback warning (under serial apply a 500ms callback at 33 ops/sec is a queue, not a blip). Hobbyist: limits default off, `welcome.limits` omitted entirely. Conformance suite tests breach behavior per class. Side note from verification: their 1024-fields limit is per object level, our aggregate fits comparable engine ceilings comfortably.
**Source lesson** — Supabase (quota vocabulary with named error codes and disconnect-below-rate semantics, channel leaks as their top client-side production failure) and Convex (the single published limits page is what made their hot-document ceiling discoverable — operational honesty as product surface).
**Anchor** — both scenarios' disclosure discipline: soft fails bounded and disclosed, hobbyist pays nothing.
**Seats** — Supabase and Convex seats, convergent.
**Effort** — section.

### 12. Client retention cache — server linger stays 0 everywhere

**Change** — plan.md Client Store plus ws-protocol §5 boot. Server-side linger stays 0 for every channel class: routed channels' durable log already outlives the instance (resub-with-cursor gets tail replay after teardown — the log *is* the warmth), a lingering hot-doc sub costs 33 wasted frames/sec, and `live: false` searchIndex holds nothing server-side by construction. The goal their TTL serves — instant return navigation — re-derives as client-held state: a **retention cache distinct from pool membership**. On last unref, the channel's doc-set and cursor move from pool (covered, queryable) to retention (hydration source only, invisible to queries — the coverage checker stays honest about what is live). Return navigation re-enters through the boot machine the spec already has: hydrate from retention, catch up from the stored cursor. Plus an args-keyed window cache for recompute paging-back. ws-protocol's `linger` grace remains the tiny route-flip debounce it was born as.
**Source lesson** — Zero. Their 5-minute deactivated-query TTL keeps *server-side per-client pipelines* warm because rehydration is their dominant repeat cost — the mechanism presumes their substrate (CVR, per-client pipelines). We hold no per-query server state to warm.
**Anchor** — scenario.md Read Pattern route flips, the Linear-grade instant-back feel without standing fan-out.
**Seats** — Zero seat, unanimous (adopt-the-goal-not-the-mechanism).
**Effort** — section. Constants are needs-bench (below).

### 13. Runtime coverage signal — production posture stated

**Change** — plan.md Client Store (coverage checker). Derive a runtime-readable per-query coverage status from the same selector-subsumption machinery — per-query-registration cost, not per-run — surfaced on result provenance (which already carries `{ collection, selector, options }`). The dev-mode checker's verdict graduates to a production signal apps can gate UI on, closing the residual where a selector that escaped the dev lint renders silently incomplete in prod (the Meteor classic, priors-audit #1). State the production posture explicitly either way — nothing, sampled warn, or telemetry — so post-deploy selector drift is a decision, not a default. Pair with the 404 anti-pattern in the Phase 0a edge-state corpus: never render not-found until the channel is `ready`.
**Source lesson** — Zero ships `complete`/`unknown` result types at runtime and documents the don't-404-until-complete pattern. Convex's model is structurally immune to the trap — our checker is the compensating control and is currently dev-only.
**Anchor** — plan.md Priors Audit #1: the silently-incomplete-query trap, checker v1-required. Hobbyist must pay nothing whatever the posture.
**Seats** — Zero seat proposes the signal, Convex seat independently demands the stated posture. Convergent, the proposal satisfies the demand.
**Effort** — section.

### 14. Projection-union ledger — fast path, degradation promise, honest pricing

**Change** — plan.md Field Projections, four additions. (a) Layering stated: whole-doc channels pay refcount-per-doc only, path-level union bookkeeping engages solely when a projected channel contributes — the hobbyist never touches path machinery. (b) Degradation promise: dev mode runs a shadow audit (full union recomputed and compared against the incremental ledger on every unsub/nosub, assertion names the divergence), production treats any invariant violation (negative refcount, prune of an absent entry) as per-channel poison → drop that channel's client state → resnapshot — reset heals one layer down — with full reload as last resort. Phase 4 test named verbatim: "ledger corrupted → reset heals." (c) Name the structural trade: the per-client-diff convenience Zero's CVR buys lands on us as the ledger plus resume choreography — their ops tail (sticky sessions, CVR GC, Rehome errors, CVR-purge full reloads) for our test tail (ledger and resume interleavings). Ours is paid once in CI, theirs forever in production — write the asymmetry down rather than implying it. (d) Scope the sharing claim where the economics are argued: the 500-subscriber shared-instance argument applies to routed channels — personal-args searchIndex has sharing ≈ 1 and is protected by `live: false` economics instead, which the scenario already states.
**Source lesson** — Zero. Their CVR is the server-side twin of our client-side ledger, and its failure mode ends in a visible, crude, healing full reload. Ours currently ends in nothing stated.
**Anchor** — scenario.md Canonical Load Figures: 2-3 shared channel instances per hot doc vs 10-100 per-client pipelines. Channel Topology: sharing assumed low on searchIndex.
**Seats** — Zero seat, unanimous.
**Effort** — section.

### 15. Mutator settlement handle — the pending entry as a lazy return value

**Change** — plan.md Write Path, gated through Phase 0a steelman (consumer-felt API). Return the pending entry the outbox already creates as a lazy handle: `const write = Todos.toggle(id)` stays sync and fire-and-forget (return value ignorable), `write.status` is a reactive read (`'pending' | 'ok' | 'rejected' | 'parked'`), `write.server` is a promise allocated only on first access. No coloring — nothing requires `await`, the 90% case ignores the return entirely, the sync-callbacks doctrine intact. No hot-path allocation beyond existing outbox bookkeeping. `status: 'parked'` ties into the amendment-3 taxonomy. Serves confirmed-write sequencing without graduating to an action.
**Source lesson** — Zero exposes `.client`/`.server` settlement stages per mutation — honest in their model because mutators are async anyway. The cross-exam found ours can have per-call settlement uncolored because the bookkeeping already exists on the wire (`result` per call) and in the outbox.
**Anchor** — plan.md Write Path's own 50/50 split: business flows occasionally need confirmed-write sequencing below the action threshold.
**Seats** — Zero seat, unanimous (reconsider resolved to adopt, 0a-gated).
**Effort** — section.

### 16. Recompute circuit breaker — bytes are the estimator

**Change** — plan.md Search channel mechanics plus ws-protocol §2/§4. One rule at three valves: emit incremental while `incrementalBytes ≤ k × snapshotBytes`, else snapshot/reset. (a) Sub-time tail-vs-snapshot — the server already chooses with the heuristic unstated, and the scenario computes the rule by hand (700KB tail vs 150-200KB snapshot at a 2-minute absence) — make bytes the stated rule. (b) Recompute diff-vs-fresh-window for searchIndex emits — the query runs either way, send the cheaper payload. (c) The log-collapse threshold restated in the same vocabulary so all three valves read as one rule. `k ≈ 1` to start.
**Source lesson** — Zero's circuit breaker ("if advancement looks like it'll take longer than rehydrating, abort and reset") compares times the server estimates poorly. We needn't estimate at all — both payload sizes are known exactly server-side.
**Anchor** — scenario.md Canonical Load Figures and Migration Window — the reset valve with a smarter tripwire.
**Seats** — Zero seat, unanimous (adopt, re-derived).
**Effort** — wording. `k` is needs-bench.

### 17. Schema migration guardrails — validate against existing data

**Change** — plan.md Schemas plus Migration Window documentation. (a) A validation pass at `listen()` or via CLI: scan or sample existing docs against the loaded schema, warn by default, `strict` refuses to listen. Hobbyist never sees it (memory adapter, no pre-existing data). (b) The dual-write online-migration doctrine written as documentation beside the Migration Window. (c) Field-removed-while-data-exists surfaces as a warning in the same scan. This is also the enforcement loop that makes amendment 18's `required: true` an honest statement rather than an aspiration.
**Source lesson** — Convex. Schema push validates all existing production documents and blocks field removal while data exists — their deploy-gate mechanism assumes a schema push and platform-owned data, neither of which we have, so the mechanism re-derives at our seam.
**Anchor** — scenario.md Migration Window: weekly migrations against live operators.
**Seats** — Convex seat, unanimous.
**Effort** — section.

### 18. `required: true` owns cross-operation presence invariants

**Change** — plan.md Schemas, one prose fix. The current line "real presence rules live in mutator `check`" overpromises — `check` is per-operation and silently bypassed by any other operation that inserts or clears the field. Amend: cross-operation presence invariants belong in schema `required: true` (enforced at the doc gate on insert and on writes clearing the field — the one surface every write passes), op-specific presence stays in `check`. Optional-by-default itself stands (see rejected list).
**Source lesson** — Convex. Their required-by-default works *because* push-time validation enforces it against real data — a required marker is only as true as its enforcement loop (amendment 17).
**Anchor** — scenario.md Document Shape: jurisdictional variance favors optional, but invariants that exist must actually hold.
**Seats** — Convex seat, unanimous (divergence on the default upheld, the prose hole conceded).
**Effort** — wording.

### 19. Bundle budget — line-item table, bar number needs-jack

**Change** — plan.md (likely near Decision 9 / Not in v1). A line-item byte budget table for the sync client: matcher / rebase engine / outbox + IDB / cursor + resume machine / consumer surface / schema — each priced minified + brotli, with the tree-shaking law (hobbyist pays nothing for parking, projection unions, searchIndex window faces) enforced per line item rather than asserted. Two honest offsets recorded: marginal-sync-bytes is the fair metric (the renderer ships regardless, as Convex's React hooks add 2.6KB to theirs), and the thin client buys no boot story (network-bound every load) where our bytes buy hydrate-from-IDB render-first. The bar number itself is a product call — needs-jack.
**Source lesson** — Convex: 18.3KB gzip measured. The existence proof that a sync client can be small, and the comparison the CDN rung will face. Zero's 96KB is not the category floor.
**Anchor** — scenario-hobbyist.md bundle bar, runtime-first thesis: client bytes are user-facing perf.
**Seats** — Convex seat (framing adopted). Interlocks with amendment 22's topology framing.
**Effort** — section.

### 20. Torn boot — classify, disclose, recipe

**Change** — scenario.md Failure Taxonomy plus plan.md Client Store. Per-channel cursors mean independent snapshots at boot — queries can briefly read mixed positions. Classify it: a bounded soft fail (bounded by the boot window, healed at each channel's `live`, exposure structurally narrowed by one-dominant-channel topology), disclosed via per-channel `ready`, with the app-space recipe stated for the rare strict surface: gate a composite first paint on the relevant handles' `ready`, a plain reactive read. the framing guarantee (one frame per transaction per socket) already covers live-write atomicity, where tearing would actually destroy meaning.
**Source lesson** — Convex. Their whole-query-set atomic `Transition` is a monolith dividend (one log, one clock). Re-deriving it needs a cursor vector — already rejected for breaking cursor opacity — or a boot barrier that kills render-immediately. Mechanism rejected, disclosure adopted.
**Anchor** — scenario.md Failure Taxonomy — inherit the tear as a decision, not silently.
**Seats** — Convex seat, unanimous.
**Effort** — wording.

### 21. CDC row images recover path granularity — state the diff step

**Change** — plan.md External Writers, one stated mechanism. The router diffs `watch()`'s `{ before, after }` row images into leaf-path deltas (`detectChanges`, shipped in PR #242) before routing, so external whole-column rewrites keep fine wire granularity. Without this stated, the live-reads rung — where every delta is CDC-borne — reads as whole-doc on the wire. Companion substrate fact worth a sentence: client apply is equality-deduped, so even coarse deltas self-prune to per-field wakeups — wire bytes are the only residual cost of a coarse external write.
**Source lesson** — Zero's migration attack ("a raw UPDATE rewriting a JSONB column is contraband in your model and CDC replicates the clobber") defused by machinery we already have but never wrote down.
**Anchor** — the strangler-fig rung: legacy code writes tables directly mid-migration while clients need per-field reactivity.
**Seats** — Zero seat, unanimous.
**Effort** — wording.

### 22. Partial-sync topology framing — the three-corner trade on Decision 4

**Change** — plan.md Decision 4, framing sentences. The field has three corners, and our bundle and boot story are entailed by the corner we picked, not separable engineering: (a) thin client, queries evaluated server-side only (Convex — 18KB, but no boot story and full-result wire amplification at MB/s on hot docs), (b) local replica + queries-as-subscriptions (Zero — client-evaluated queries over an unbounded query-unioned set forces IVM, which forces the planner/pipeline engine, which is the 96KB client), (c) local replica + channel-scoped pools (ours — bounded pool makes re-run viable, which keeps the client small *and* keeps hydrate-first boot). The substrate cuts re-run's constant: over-broad re-runs land on reference-stable arrays → same-ref reconcile → equality-deduped notifyField → near-zero DOM cost, so Tier 1.2's bench question is selector matching over bounded pools, not render work.
**Source lesson** — Zero (IVM as entailment of query-driven sync over a local set) and Convex (the 18KB existence proof that smallness alone doesn't require channels — the *combination* of small client and boot story does).
**Anchor** — runtime-first thesis, hobbyist bundle bar.
**Seats** — contested in emphasis, reconciled here. Zero seat: the bundle divergence is downstream of Decision 4 — channels ⇒ bounded pool ⇒ re-run ⇒ small client. Convex seat: an 18KB queries-as-subscriptions client exists, so the entailment only holds once a local replica is in play — state the trade as three corners, not two.
**Effort** — wording.

### 23. Freshness affordance is load-bearing, not optional

**Change** — ws-protocol §6 plus the Phase 5 deliverable list. `live: false` and `refresh` tier defaults are only honest if the disclosed-staleness consumer surface actually ships (the `lastDeltaAt`-driven affordance the scenario's dashboards rely on). Promote from implied to named deliverable.
**Source lesson** — Zero. The strongest form of their "developers can't predict liveness" attack pins this: our answer to live-everything is priced staleness, and priced staleness without disclosure is just staleness.
**Anchor** — scenario.md Failure Taxonomy rule b: soft fails disclosed when exceeding bounds. Channel Topology: dashboards' nonreactive default "disclosed via a freshness affordance."
**Seats** — Zero seat, unanimous.
**Effort** — wording.

### 24. In-flight actions reject on connection drop

**Change** — plan.md Write Path plus protocol-v2 one-liner. The spec covers actions *called* while disconnected (reject fast) but is silent on in-flight-at-drop. State: in-flight action promises reject with a connection error code on drop, never silently retried — the ledger's cached results (ws-protocol §4 `result-cache`) are what make the caller's manual retry safe.
**Source lesson** — Convex cancels actions on reconnect — at-most-once, caller's problem, honestly stated.
**Anchor** — scenario.md Write Pattern: business actions are awaited with pending UI — an unresolved promise is a hung spinner.
**Seats** — Convex seat, unanimous.
**Effort** — wording.

### 25. Version-skew policy — N and N−1, server deploys first

**Change** — ws-protocol §7. The reference server speaks protocol N and N−1 (one integer back), clients send their highest in `hello`, `welcome` downgrades, server deploys first. The expand/contract deploy-order quick-reference becomes a reference-server doc page.
**Source lesson** — Zero: "Servers are compatible with any client of same major version, and with clients one major version back," and "incorrect deployment order will cause downtime" — paid-for guidance.
**Anchor** — scenario.md Migration Window: stale bundles get a reload affordance, never mysterious rejections.
**Seats** — Zero seat, unanimous.
**Effort** — wording.

### 26. `sync.connection.reason`

**Change** — ws-protocol §6. `sync.connection.reason = { code, text }` from the last close/reject, riding the existing §2 reason-code table — one field, no new states, zero hobbyist concept cost. Their Sentry-forwarding pattern is a docs example, not API surface. Their `needs-auth` state stays unadopted: authCallback routing through `reconnecting`/`failed` covers it, and `reason` makes the why legible.
**Source lesson** — Zero carries `reason` on every connection state with documented error-monitor forwarding.
**Anchor** — scenario.md Failure Taxonomy disclosure.
**Seats** — Zero seat, unanimous.
**Effort** — wording.

### 27. Windowed-channel contract prose

**Change** — plan.md Pagination (windowed-channel docs). Steal the semantics statement, mechanism already matches: *window boundaries freeze at subscribe, windows grow and shrink under live writes, adjacent windows stay contiguous.* Three sentences.
**Source lesson** — Convex's QueryJournal ("Page sizes in Convex may change!") — the cleanest articulation of the reactive-pagination contract in the field, reached by a different mechanism than our keyset anchors.
**Anchor** — scenario.md Read Pattern: comprehensible motion on live windows.
**Seats** — Convex seat, unanimous.
**Effort** — wording.

### 28. Reference-server and lineage notes

**Change** — bundled small adoptions, all wording. (a) ws-protocol §1 implementation note: serialize-once dispatch with per-subscriber context packed at subscription registration (Supabase's MessageDispatcher fastlane, proven at 800k msgs/sec) — the reference shape for the one-serialization invariant. (b) Dev-mode held-channels counter with provenance (which subscribe call, which component), pairing with the `4204` channel-cap tripwire — module-scope subscribes can still leak past component-lifecycle refcounting, and channel leaks are Supabase's top client-side production failure. (c) Lineage note: three independent designs landed on settle-after-effects-visible (Replicache lastMutationID, Convex timestamp-gating, our txid rule) — record the convergence. (d) Quote the WALRUS numbers (11ms → 304ms) where Security Posture argues auth-at-subscribe, as validation of auth-at-join and shared instances specifically — not of router cost, since membership matching is ours alone, bounded by the field-set prefilter and the 2-3-instances figure. (e) Identical-result suppression is pinned twice in our spec (recompute-diff emits nothing on no-change, client deep-equal dedup absorbs duplicates) — keep it that way, Convex's protocol leaves theirs ambiguous.
**Source lesson** — Supabase and Convex, production confirmations of choices already made.
**Anchor** — various, cited inline.
**Seats** — Supabase and Convex seats, unanimous.
**Effort** — wording.

---

## 2. Needs-Bench

1. **Retention-cache constants** (amendment 12) — window size and memory ceiling for the client retention cache and the args-keyed recompute window cache. Bench shape: return-navigation timing on the chat/inbox steelman app (route away, route back, time-to-interactive vs full resnapshot), memory growth under a long route walk. Phase 0a edge pages carry the feel test.
2. **Circuit-breaker `k`** (amendment 16) — `incrementalBytes ≤ k × snapshotBytes`. Bench shape: recorded hot-doc traces replayed at varying absence durations, finding the byte crossover. The scenario's hand-computed case (2-minute absence, 700KB tail vs 150-200KB snapshot) is the first fixture. Start `k ≈ 1`.
3. **Tier 1.2 re-run bench, reaffirmed as gating** (amendment 22) — the Zero cross-exam sharpened what it measures: selector matching over bounded pool maps, not render work (the reconcile fast path absorbs over-broad re-runs). Shape unchanged from the plan: 5k docs / 20 live queries / write storms. If re-run collapses, IVM moves from deferred to required — still the one bench that can pivot the architecture.
4. **Ephemeral emit-tick default** (amendment 6) — ~30Hz starting point. Validates in Phase 0a against the cursor-interpolation example alongside the ws-protocol §8.6 smoothing constants rather than a standalone bench.

---

## 3. Watch List

Their roadmap items that could change our answers. None changes a disposition today.

1. **Zero: column permissions** (committed 2026 roadmap) — would close their field-level security gap and narrow the framing of our projection divergence (the permission floor would stop being unique to us, the fan-out cut would remain).
2. **Zero: JSON filters / array operators / aggregates** (wishlist) — sub-row granularity arriving in ZQL would give them the middle path they currently lack against deep documents, and aggregates would price a `total`/`pages` window face.
3. **Zero: offline revisit** (their tracked issue 246605) — if they build the fork-and-merge UX their tradeoffs list names, the park-then-verify comparison gets a live counterpart.
4. **Supabase: `pg-delta`** (new dependency surfacing in June 2026 releases) — a CDC engine maturing toward reliable delivery would further corroborate the cursor-core direction. Nothing actionable now.
5. **Supabase: Broadcast Replay trajectory** — growth (limit raised, all sources, public channels) strengthens the cursor-core corroboration. The contrary signal to heed is the opposite: replay stagnating or deprecated for lack of use, which would be evidence the refetch posture suffices even for data-shaped messages. No such signal exists.
6. **Supabase: Forum/Census regional broadcast** — planet-scale multi-region fan-out, no contact with our deployment-scale Redis story. Watch only for deployment-scale trickle-down.
7. **Convex: curvilinear maturation** — their local-first alpha already converged on IDB persistence and named-mutation replay (our Decision 3 shape). Watch whether dual-implementation mutations survive to beta — single-body convergence would strengthen our isomorphic-mutator bet further, their keeping the split would mark a real fork.
8. **Convex: incremental-delta roadmap** ("pushing smaller deltas to the client") — their arrival at field granularity would move the wire-granularity divergence from structural to late-convergent.
9. **Convex: `db.patch` read-set behavior** — the blind-patch concession in the OCC analysis rests on an undocumented grant (that patch doesn't internally enroll the doc). Documentation either way adjusts the sharpness of the retry-storm claim, not its direction.

---

## 4. Rejected — the Spec's Tested Armor

Attacks run at full strength that failed, and mechanisms whose goals were adopted without them. Kept because the rejection reasons are load-bearing.

**Zero**

1. **Refuse writes offline, modal overlay** — domain-fatal for implicit save ("typed means saved" cannot coexist with "prevent the user from inputting data"). Their own tradeoffs list names our path as viable ("custom UX to fork and merge conflicts") — they declined to build it as a vendor, we build it as framework machinery. Their Replicache experience of blind replay going wrong is experience of the mechanism amendment 3 interrupts.
2. **Whole-row sync / "ship 2-3 per-tier doc shapes and delete the ledger"** — fails on the security requirement, not bytes: role-tiered projection is the field-level permission floor, fail-closed, and their current answer to field-level security is nothing (roadmap 2026). The ledger exists for the everyday overlap (dashboard window + open detail page on the same doc), and projections cut fan-out, not just payload.
3. **Normalize the aggregate into tables** — the jurisdictional variant mass has no relational landing zone (JSON columns are one opaque wire value with whole-blob LWW — the silent-clobber hard fail exactly where edits concentrate). Path granularity is entailed by owning the write path: row images structurally cannot carry id-addressed array ops. Honest cost kept on the books: keyed-array machinery is pure overhead for shallow aggregates, carried entirely by the rung that demands it.
4. **Per-client CVR pipelines steelman** — exact per-client diffing and zero client ledger are real conveniences, paid for with a Postgres database of per-client state, sticky sessions, CVR GC, Rehome errors, and purge-forces-reload. Our trade: their ops tail for our test tail, paid once in CI vs forever in production (now written down via amendment 14).
5. **Live-everything governed by TTL** ("developers can't predict liveness") — misfires structurally: our collaborative surfaces are live by default, the knob exists only on searchIndex, an enterprise verb. Their own circuit breaker is the confession that live-everything has a cost cliff — they surface it as an ops incident, we surface it as a priced default. The attack did pin amendment 23.
6. **"You're betting the architecture on an unrun bench" (IVM-or-bust)** — held, not dismissed: the entailment framing (amendment 22) explains why re-run is viable on bounded pools, and the Tier 1.2 bench remains genuinely gating. The attack changed no disposition because the bench was already the spec's own stated gate.
7. **Server-side TTL linger** (mechanism) — we hold no per-query server state to warm, and a lingering hot-doc sub costs 33 wasted frames/sec. Goal adopted client-side as amendment 12.

**Supabase Realtime**

8. **Extend at-most-once up the stack, delete the cursor spine** — fails on three walls: the cursor is gap *detection*, which the taxonomy's disclosure requirement makes mandatory independent of replay (at-most-once means you cannot know you are stale — unbounded undisclosed staleness on an implicit-save replica). The store makes refetch non-equivalent (synced ⊕ pending, txid completion, snapshot brackets all ride positions — they have no client store, so nothing rides positions). Blip economics: a 5s blip is tens of KB of tail vs 150-200KB × N channels of resnapshot, and resnapshot-always under a cycling socket is the re-sub storm the envelope bars. The attack's best point became amendment 8.
9. **Three-primitives-is-honesty** — inverts on their own archaeology: composition guidance shifted under users' shipped code, and migration between their primitives is an app rewrite. Our graduation is a flag deletion with the template untouched. The attack extracted amendment 6c (ephemeral offline writes drop).
10. **Whole rows, router CPU over field granularity** — their pathology was linear in subscribers (WALRUS), ours is linear in channel instances (2-3 per hot doc) with a field-set prefilter — different asymptotic species. And whole-doc frames are unavailable at any price: 150-200KB aggregates at 33 commits/sec is ~6MB/s per subscriber against the 5-10KB/s budget.
11. **Presence CRDT** (mechanism) — Phoenix Tracker is a CRDT because key → list-of-metas is multi-writer-per-key. Our latest-per-key conflation carries single-writer-per-key, degenerating the merge problem to blind overwrite. The CRDT also doesn't fix their throttled-tab ghosts — staleness TTL fixes both classes. Goal adopted as amendment 6.
12. **Per-tenant rate limiting** — multi-tenant SaaS shaped. Our reference server is single-tenant by design.
13. **`needs-auth` connection state** — unadopted: authCallback routing through `reconnecting`/`failed` covers it, and `connection.reason` (amendment 26) makes the why legible without a new state.
14. **Silent payload-drop-to-notice** — explicitly banned (inside amendment 11): a silently missing delta is what the taxonomy forbids. Inbound caps and the schema gate are where size enforcement belongs.

**Convex**

15. **Queries-as-subscriptions, decomposition dodge included** ("split the page into narrow queries") — read sets are doc-granular, so N narrow queries against the hot doc all re-run on every one of 33-330 writes/sec, each metered, each pushing its full result — the byte mass concentrates in the subtrees that are the page content, so per-subscriber wire stays in MB/s territory against our 5-10KB/s. Their own roadmap concedes the endpoint ("pushing smaller deltas"), which requires exactly the write-time path granularity our wire starts from.
16. **OCC at doc grain, blind-patch escape included** — concession recorded: blind patches to disjoint top-level scalars are plausibly conflict-free (granting an undocumented assumption — watch item 9). But the retry-storm claim holds for any mutator that reads the doc — which is any validated, derived, or array-row write, including their own the moment it validates. On the scenario's arrays the escape inverts: `patch` has no row vocabulary, so concurrent disjoint-row edits either read-modify-patch (conflicts return) or blind-patch the whole array (the silent-clobber hard fail). The discipline that makes their hot doc survivable is the discipline of having no validation.
17. **In-memory mutation queue plus beforeunload suffices** — the queue is largest exactly when durability matters (minutes-long outage, dev restart, sleep/wake), and a reload mid-outage loses all of it under implicit save. Their own curvilinear alpha now persists to IDB and replays named mutations on restart — convergence on our Decision 3.
18. **Dual-implementation optimistic updates as honest separation** — their own essay lists implement-twice and schema divergence under hard problems, their docs carry a state-corruption footgun our trackWrites envelope makes unexpressible, and curvilinear still carries the dual-mutation tax into their local-first act. The single isomorphic body is the genuinely differentiated bet, its command-buffering price already stated in the plan.
19. **Presence as a library on the durable pipeline** — their presence component is cost-avoidance engineering for a mispriced pipeline (heartbeat mutations through the transaction log, single-flighting capping rates near one-per-RTT). 20-30Hz cursors are not attemptable through it at any price.
20. **Runtime read sets over static selectors** — strictly more precise for arbitrary handler code, conceded — and priced at owning the database, the function runtime, and the deployment system, the exact coupling Decision 9 refuses. Our recompute tier is per-channel-instance, write-flagged, debounced, diffed, and default-off — not per-observer-per-client poll-and-diff redux.
21. **Whole-query-set atomic Transition** (mechanism) — re-deriving it needs a cursor vector (breaks cursor opacity, the door that keeps delivery pluggable) or a boot barrier (kills render-immediately). Disclosure adopted as amendment 20.
22. **Required-by-default schema fields** — rejected on the scenario: thousands of jurisdictional-variant fields where absence is the norm would mint thousands of noise markers, and the hobbyist gradient is schemaless-first. Their default works only because of an enforcement loop we adopt separately (amendment 17), and the real hole it exposed was in our prose (amendment 18).
23. **CDC-as-emit-source as the primary commit-visibility mechanism** — rejected inside amendment 4: CDC events carry no attribution or txid, which would break confirmation and rebase. Stays the backstop it already is.
24. **Protocol-first is unproven (the DDP jab)** — their own open-sourcing retro names lock-in fear as an adoption suppressant, conceding the maintenance-boundary worry is real at enterprise. And the guarantee that matters at our consistency boundary — per-doc serializability — falls out of a row lock, not a runtime (amendment 2). Concession recorded: `npx convex dev` is genuinely minutes-to-first-sync inside npm+TypeScript land — the hobbyist bar competes against a real funnel, and our differentiator is the rung below their floor.

---

## 5. The Three Sharpest Critiques, Verbatim

Read these unfiltered — each is the opposing architect at full strength, and each drove a top-five amendment.

### Zero (drove amendment 3)

> You wrote "a stale replay never silently destroys co-editors' newer work — parking converts it to a decision, however old," and then defined "old" as starting tomorrow. We ship blind replay at sixty seconds — disconnectTimeoutMs, the elevator window — because sixty seconds is where "nothing relevant happened meanwhile" stops being a safe bet, and we know that because we operated Replicache, which promised hours-to-days and replayed blind, and we turned that machinery off in Zero with a hardcoded false. Your envelope replays blind across a same-day sleep/wake gap — eight hours — into a document your own scenario clocks at 33 writes per second hot. The co-editor whose afternoon commit your morning-stale value lands on isn't a party to "honest last-write-wins live": they committed six hours ago, they're gone, and the delta disclosing the overwrite plays to an empty room. Your own Failure Taxonomy calls that exact event a hard fail with zero silent budget. Your envelope boundary is measured in client absence, but the destruction risk is measured in what co-editors did meanwhile — age is a proxy for evidence, and at same-day scale on your own load figures it is a bad proxy. Either shrink the window to ours or get evidence. And notice your own spec already knows this: the scenario's parameter table says "conflict-evidence-driven, age as secondary signal," while your R2 ruling shipped age-only with LWW-by-decree inside the window. Your outbox can carry the evidence itself — base values per written path, verified against fresh synced state at resume — so you don't even need the server-side last-write map you rejected. The fact that you haven't specified that yet is the one place your offline story is rationalizing instead of reasoning.

### Supabase Realtime (drove amendment 1)

> You studied our WALRUS autopsy and wrote the right invariant — shared instances, identical bytes, auth resolved to booleans at the join, nothing per-subscriber in the fan-out path. Then you put `filter: fn(ctx)` in the publication config. That one key is per-subscriber content filtering on a stream you promised to share: two operators subscribe `records.byId?{id:42}`, your tenant-scoping filter resolves differently for each, and now either your "one instance per (name, args)" is a lie or one of them is reading the other's rows. We didn't lose to per-subscriber auth — auth caches as a boolean. We lost to per-subscriber visibility of content, eleven milliseconds at one subscriber, three hundred at ten thousand. You're shipping the seed of it as a convenience key — and notice your new re-gating moment deliberately re-runs only the permission slot, because re-resolving a per-subscriber filter has no sane answer on a shared instance. Your own fix is telling you the key doesn't belong. Decide what your channel identity is before two implementations exist: args-complete, or per-subscriber. There is no third thing, and we paid three years to learn it.

### Convex (drove amendment 2)

> You wrote 'read-modify-write per update, with fn executing inside the transaction' and never said what transaction means when two of them run. That's not a missing paragraph, it's an undefined term in the middle of your write path. Under serializable semantics your hot document retries itself to death — you computed that math against us. Under last-write-wins interleave your own computed fields produce write skew — the stale-total bug ships in your schema layer, silently, which your taxonomy calls the one unforgivable failure. Every mechanism you've specified — the four-phase pipeline, computed derivations, id-addressed arrays — quietly assumes an isolation level you never named. We named ours and built a committer for it, because anything less than serializable is too hard a programming model — and the irony is your own aggregate-document principle hands you serializability at the only boundary your domain cares about, for the price of a row lock. You have the better data model for it and you still haven't written the sentence.

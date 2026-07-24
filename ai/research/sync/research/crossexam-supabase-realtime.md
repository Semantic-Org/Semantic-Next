# Cross-Examination — Supabase Realtime (Phase 2)

Adversarial review of [`deep-supabase-realtime.md`](deep-supabase-realtime.md) by an independent seat, grounded in [`plan.md`](../design/plan.md), [`ws-protocol.md`](../protocol/ws-protocol.md), [`scenario.md`](../scenario/scenario.md), [`scenario-hobbyist.md`](../scenario/scenario-hobbyist.md), and the reactive substrate ([`reactivity-review.md`](../reviews/reactivity-review.md), [`primitives-reactivity.md`](primitives-reactivity.md), [`primitives-renderer.md`](primitives-renderer.md)). Dispositions treated as hypotheses. Every claim about their system cites the dossier section or its sources.

Headline outcomes: three reconsiders resolve to adopt (auth re-gating, ephemeral rate floor, payload caps — all zero client bytes). The presence-CRDT divergence re-files as adopt-the-goal-not-the-mechanism with a concrete multi-node answer. The at-most-once attack fails against the cursor but lands one articulation fix (cursor and log are separate commitments). And the cross-exam surfaced a hole the dossier missed: `filter: fn(ctx)` on shared channels is per-subscriber content filtering — the exact shape that killed their v1.

---

## 1. Security first — auth refresh re-gating (candidate 4, reconsider → ADOPT)

### What our spec actually does today

ws-protocol §2 `auth { token }`: "Subscriptions, cursors, and in-flight calls are untouched." §4 repeats it. Revocation is `server.revoke(channel, args)` called explicitly from membership-changing operations (plan, Channels / Revocation), surfacing as `nosub 4202`. Reactive auth is deferred.

### The finding the dossier under-stated: refresh *launders* permissions

Trace the bound without the `auth` message: a token hard-expires → close 4101 → reconnect → every `sub` re-runs its handler and permission gate. Revocation latency would be bounded by token lifetime — Supabase's exact blunt fallback (dossier §Permissions: "the client will be disconnected when the JWT expires").

Now add our refresh message as specced: a client that refreshes on every `authExpiresIn` countdown **never crosses a re-gate moment again**. Subscriptions are explicitly untouched. So the refresh feature — added for connection continuity — converts revocation latency from bounded-by-token-lifetime to **unbounded**, unless every permission-changing operation remembers to call `server.revoke` with the right channel args. That is a remembered-per-handler obligation, the pattern the plan itself rejects for `filter` ("declared once, not remembered per handler"). Against scenario.md's role-tiered channels (`trips.summary` vs `trips.admin`, Channel Topology): a demoted operator keeps receiving the admin projection for as long as their session keeps refreshing. Days, in an ops console that never closes. Unauthorized disclosure has no entry in the soft/hard taxonomy because it is worse than both.

### What re-gating costs at our channel shapes

This is where our spec is structurally better positioned than theirs, and the dossier didn't notice why. Supabase re-evaluates full RLS policies on `access_token` (insert-and-rollback probing against `realtime.messages`) because policy is their only auth artifact. Our publication config *separates the slots*: `permission` (capability token → `can(ctx, token)`, cheap and auditable by design) vs `handler` (selector resolution, possibly search-backend I/O) vs `filter` (plan, Channels / Publication config). Re-gating needs only the `permission` slot:

- **Per-doc detail channel** (`trips.byId`, the dominant instance): one `can()` call per held channel per refresh. ~5-15 channels held per client, token refresh on the order of minutes-to-hour → ~10 cheap predicate calls per client per hour. Noise.
- **Search windows**: `permission(ctx, args)` re-runs the same way. The recompute machinery, window state, and whitelist validation are untouched — re-gating never re-runs the handler or the query.
- **Channel instances are untouched.** Re-gating is per-subscriber-entry on a shared instance (exactly their model: per-socket policy booleans gating a shared topic stream, dossier §Permissions). Fan-out economics don't move.

Denial → existing `nosub 4202` → client drops channel, prunes projection union — the revocation path already specced, triggered from a new moment. **Zero new wire messages, zero client bytes, zero new client states.**

### One honest limit

The function-form escape hatch puts auth inside the handler ("Handler runs once per subscriber — the read auth gate," plan Channels / Subscribe). Re-running handlers on refresh is not cheap (selector resolution, async I/O) and a changed handler result is a different channel, not a re-gate. So the amendment should state the asymmetry: **declarative `permission` tokens get refresh-bounded revocation, handler-embedded auth keeps the weaker reconnect-bounded guarantee.** This is a previously-invisible dividend of the declarative slot — worth a sentence in Security Posture, since it is now a concrete reason the token form is the production-shaped form.

### The recommendation

Adopt. ws-protocol §4 amendment: on successful `auth` refresh, the server re-runs the `permission` gate for every channel in the socket's subscription set, emitting `nosub 4202` per denial. Spec promise, stated where the taxonomy lives: *revocation latency ≤ min(explicit `server.revoke`, auth refresh interval)* — `authExpiresIn` becomes a named security knob (their docs say "keep expiry windows short" for the same reason). Hobbyist cost: nothing — no auth means no refresh moment and `can()` defaults allow (scenario-hobbyist, The App Shape).

Interaction to carry into protocol v2: a re-gate `nosub` lands on a handle that today has no `error` face (plan, Client Store: "a `nosub` refusal surfaces nowhere today"). Re-gating raises that gap from cosmetic to security-visibility.

---

## 2. At-most-once vs cursor-core (candidate 8, confirmed-divergence) — the steelman

Their architect, reviewing our spec for our scenario:

> "You are building cursors, epochs, per-channel logs, txid grouping, idempotency ledgers, and reset choreography to guarantee delivery we ship billions of messages a day without. Our healing pattern is one sentence: on reconnect, refetch. And your own documents concede the point everywhere it matters — your dashboards default to `live: false` with no cursor and no log (plan, Search indexes), your ephemeral tier is fire-and-forget by design, and your own load math says the dominant per-doc channel 'holds near-zero log retention and prefers snapshot-at-resume' (scenario, Canonical Load Figures: 700KB of tail vs a 150-200KB snapshot). You will carry the replay machinery everywhere and use it almost nowhere. You even have the one thing we lack — a full client replica — so 'refetch' is a snapshot you already engineered. Extend at-most-once up the stack and delete the spine."

This is the strongest version, and it must be answered with figures, not posture.

### Where the steelman is right

Three concessions, all already in our spec but worth stating as one sentence: the recompute tier (`live: false`) runs cursor-free, the ephemeral tier is at-most-once exactly as far as at-most-once is correct, and the dominant channel's resume path is usually snapshot, not replay. The at-most-once posture already extends as far up our stack as it can go without hitting the store.

### Where it fails — three concrete walls

**1. The cursor is not the replay feature. It is gap *detection*, and detection is what the taxonomy requires.** Supabase's at-most-once also drops messages while *connected* (slow consumer simply misses — dossier §Fan-out: "there is no catch-up story because there is no log"). For a delivery bus over a refetchable database, fine. For us, a dropped delta means the client replica silently forks from authoritative state on an implicit-save surface — staleness with no ceiling and no signal, violating both halves of "soft fails are bounded **and disclosed**" (scenario, Failure Taxonomy). Disclosure requires knowing a frame is missing. Knowing requires sequencing. Sequencing is the cursor. Even if tail replay were deleted outright, the cursor stays load-bearing: cursor discontinuity → `reset` → resnapshot is the *disclosure mechanism*, and it costs one opaque string per channel.

**2. The store makes "refetch" non-equivalent to their refetch.** They have no client write path — nothing downstream of delivery depends on positions (dossier §Offline posture: "None and none"). We hold `synced ⊕ pending`: txid completion ("your effects in the stream," ws-protocol §2), pending-entry drop, snapshot-commit atomicity (the PowerSync bracket), and monotonic reads all ride positions. At-most-once doesn't delete the cursor machinery — it deletes the invariants the rebase engine re-derives state from.

**3. Blip economics, the scenario's own envelope.** Disconnects are routine — dev-server restarts, sleep/wake, cycling sockets (scenario, Failure Model). The cursor's replay path is not for the 2-minute absence (snapshot wins there, and ws-protocol §5 already lets the server choose snapshot per channel). It is for the 5-second blip: at 33 frames/sec hot-doc traffic, a 5s blip is ~165 small frames ≈ tens of KB of tail vs 150-200KB × N held channels of resnapshot, per blip, per client. A cycling socket under resnapshot-always *is* the re-sub storm the lost-work bar names ("a cycling socket must not amplify"). The cursor is what lets the server pick the cheap path per channel per resume. At-most-once removes the choice and hardwires the expensive one.

Their own trajectory corroborates rather than refutes: Broadcast Replay (`since` + `limit: 25`, 3-day partitions, dossier §4) is a cursor and a tail-replay growing inside an at-most-once product, shipped one constraint at a time, for exactly the message class that is data rather than signal.

### Verdict and the amendment it earns

**Confirmed-divergence upheld.** But the attack extracts a real articulation fix: the spec currently lets "cursor" and "log" read as one commitment. They are two. The **cursor** is mandatory on every durable channel — it is gap detection, txid completion, and monotonic reads, and it costs one opaque token. The **log** is a per-channel economics knob — retention MAY be zero (per-doc channels per the scenario's own math), in which case every resume is answered with `snapshot` via the machinery that already exists (cursor expired → snapshot, no `reset` round trip, ws-protocol §2). Amendment: state the cursor/log separation explicitly in plan Decision #7 or ws-protocol §4, and fold it into the pending R2 retention knob — `retention: 0` as a legal, named configuration rather than an implicit degenerate case.

---

## 3. Presence CRDT vs conflated map (candidate 10) + multi-node (open Q3)

### The steelman

> "Your latest-per-key map is correct on one node. The moment you run two, clients on node A must see node B's presence — so you'll wire pub/sub and now you have replicated mutable state with node failures, which is the CRDT problem. Phoenix Tracker exists because naive presence replication produces ghosts: when node B dies, who expires B's keys on A? Failure detection plus state reconciliation is the hard part of Tracker, and you will reinvent it badly. Spec it now or admit the ephemeral tier is single-node-only."

This is the best-constructed of the four divergence attacks, because our spec genuinely says nothing about multi-node ephemeral (plan, Channels / Multi-node covers durable channels only — Redis streams, cursor = stream id).

### Why the CRDT still doesn't follow — the semantics delete it, not the node count

Phoenix Tracker is a delta-CRDT because its data model *requires* merge: state is key → **list of metas** (dossier §Presence), so concurrent `track()` calls for the same key from different connections on different nodes need conflict-free union. That is multi-writer-per-key.

Our ephemeral spec is **latest-per-key with connection-scoped expiry** (plan, Ephemeral Collections) — and the unstated invariant doing the work is **single-writer-per-key**: a cursor or presence key is owned by the connection that writes it (multi-device presence is multiple keys by construction, not multiple metas under one key). Per key there is exactly one writer, so per-key LWW with the owner's ordering is correct with no vector clocks, no merge function, no reconciliation events. The dossier's observed wart — their `sync` emitting join/leave "even though no users are actually joining or leaving" is CRDT reconciliation leaking into the event API — cannot occur in a model with nothing to reconcile.

### The multi-node answer (open Q3, resolved)

Re-derived at our granularity: **Redis pub/sub (not streams — no log to have a position in) carrying ephemeral writes cross-node, each node holding its local latest-per-key conflation map per channel instance.** Late-joiner snapshot = the local node's map. Conflation under backpressure stays per-consumer and local. Single-writer-per-key makes cross-node apply a blind per-key overwrite.

Ghosts — the one job Tracker genuinely earns its keep on — fall to a cheaper tool: **staleness TTL on map entries**. Ephemeral entries are refreshed by writes; an entry not refreshed within a small multiple of the expected update interval expires from the map. This kills *both* ghost classes with one mechanism: dead-node keys (Tracker's case — the owning connection's node vanished) and throttled-background-tab keys (their documented production wart that the CRDT does *not* solve — clients must manually re-track on `visibilitychange`, dossier §Presence). Staleness-is-the-only-sin is the tier's own physics, so expiry-by-staleness is the native idiom, not a workaround. For presence keys that update rarely (vs cursors at 20Hz), liveness piggybacks on the owning connection's heartbeat — connection alive on its node refreshes its keys' leases.

### Verdict

Disposition refines: **confirmed-divergence → adopt-the-goal-not-the-mechanism.** The goal (cross-node ephemeral coherence with bounded ghosts) is right and theirs. The mechanism (delta-CRDT replication) belongs to their substrate — Erlang cluster, no shared infrastructure, multi-meta key semantics. Ours re-derives the outcome from the invariant their model lacks.

Spec amendment, now rather than at multi-node time (cheap, and it prevents future CRDT pressure): add to plan Ephemeral Collections — (a) the single-writer-per-key invariant stated as a contract (key ownership = writing connection, multi-device = multi-key), (b) expiry generalized from "connection-scoped" to "liveness-scoped" with staleness TTL as the mechanism (which also fixes the background-tab ghost on a single node), (c) one sentence naming the multi-node carry: pub/sub fan-out into local conflation maps, no stream, no CRDT.

---

## 4. Three products vs one surface with tiers (candidate 9) — attack

Steelman: "Three primitives is honesty. Broadcast, Presence, and Postgres Changes have three different physics, and your `ephemeral: true` flag changes durability, ordering, acks, and storage while pretending nothing changed — three products hidden behind one constructor. Our users know which physics they bought."

The attack inverts on their own archaeology. The physics *are* named in our surface — `ephemeral`, `live`, `refresh: seconds` are declared knobs with documented semantics (plan, Decision #6 + Ephemeral Collections' "three physics, one client surface"), not hidden defaults. What their three-product split actually produced is the dossier's exhibit: composition guidance that shifted under users' shipped code ("use Broadcast for most use cases" arriving years after Postgres Changes was the flagship), and migration between primitives = client API rewrite + trigger setup + policy work (dossier §3 nuance). Our graduation is a flag deletion with the template untouched. The semantics changing under a stable surface is not deception — it is precisely what makes the correction shippable when an app discovers its cursors became data. Their users discovered the same thing and got a rewrite.

**Divergence upheld.** One real extraction: the flag's *offline* semantics are unstated. Plan says ephemeral writes are "fire-and-forget, no cursor, no ack" — it does not say what happens while disconnected. The durable tier queues to the outbox. Ephemeral must **drop, silently and by design** (replaying a queued cursor move is the ghost-animation the section already forbids). One sentence in Ephemeral Collections: writes while disconnected are dropped, not queued — the graduation flag is also the offline-durability flag.

---

## 5. No projections / no field granularity (candidate 11) — attack

Steelman: "Per-subscriber work killed us, and you've kept per-*channel* work: every write intersects selector field-sets, re-matches membership, filters projections. At your migration window (docs × active channels) your router is our single-threaded WAL decoder wearing a different hat. We learned to ship whole rows and let the topic do the work. Bytes are cheap, router CPU is not."

Fails on the scenario's arithmetic. Their pathology was linear in **subscribers** (WALRUS: 11.2ms → 303.8ms from 1 to 10k subscribers per change, dossier §3). Ours is linear in **channel instances**: 2-3 per hot doc (scenario, Canonical Load Figures), with the field-set intersection as a cheap prefilter before any re-match (plan, Routing and membership transitions). Those are different asymptotic species — the dossier's candidate 1 already enshrines the distinction. And whole-row delivery is not available to us at any price: the aggregate-document principle makes the "row" a 150-200KB aggregate, so whole-doc frames at 33 commits/sec would be ~6MB/s per subscriber vs the 5-10KB/s the scenario budgets. The document model that creates the field-granularity need is the same one that makes whole-row delivery domain-fatal. Their context (small normalized rows, app-defined blobs) simply lacks the problem.

**Divergence upheld, no amendment.** The migration-window router cost is already named, bounded, and off-peak in scenario.md (The Migration Window).

---

## 6. The adopts, attacked for cargo

**#1 Write-time routing + auth-at-join (adopt, confirmation) — holds, one honest asymmetry to note.** Their survivor design is *cheaper per write* than ours: the trigger names the topic directly, O(1), no matching. Ours selector-matches because our channels are queries with membership transitions (enter/leave on field change), which topic-naming cannot express. The adopt is right, but the referee brief should quote their numbers as validation of *auth-at-join and shared instances*, not of router cost — our router pays for membership semantics they don't sell, bounded by the field-set prefilter and the 2-3-instances figure.

**#2 Serialize-once dispatch with fastlane metadata (adopt) — holds cleanly.** Checked against our frame inventory for per-subscriber variance that would break it: `delta`/`reset`/`live` fan-out carries none by invariant (ws-protocol §1), `snapshot` and `result` are per-requester unicast, not fan-out. Their pattern (per-subscriber context packed into subscription metadata at registration so dispatch never touches per-subscriber processes) is exactly the reference-server shape for our §1 invariant, proven at 800k msgs/sec. Zero client impact. Adopt as reference-server implementation note.

**#3 Quota vocabulary (adopt) — holds, with the shape pinned (also resolves open Q4).** Their lesson is that limit dimensions need *names* because clients need different recovery behaviors. Ours sorts into three classes:
- **Rate dimensions** (calls/sec, joins/sec): already covered by `4503 rate-limited` + `retryAfter` — the instruction is wait, one code suffices. No enumeration needed on the wire.
- **Actionable-by-the-app limits** (channels per connection, max payload): the client can pre-validate or must shed load — these earn protocol visibility. Concretely: an optional `limits` object on `welcome` (`{ maxPayloadBytes?, maxChannels? }` — additive under §7 unknown-field tolerance, *not* stuffed into the `caps` string array, which is capability negotiation), plus one new reason code `4204 limit-exceeded` surfacing on `nosub` (channel-cap breach at sub time) and `result.error` (oversized call). Their 100-channels cap doubles as the leak tripwire (see #12) — ours should ship a high default for the same diagnostic reason, not as a billing tier.
- **Transport guards** (frame size): `4002 too-large` close, already present.
Hobbyist: all limits default off/generous on the single-node server, `limits` omitted from `welcome` entirely.

**#7 Partition-drop retention (adopt, small) — downgrade to confirmation.** Attacked for content: our reference log lives in Redis streams (XTRIM/MAXLEN) or the in-memory ring — partition-drop has no referent there. It becomes the right implementation shape only if a postgres-backed log table ships (plausible for the brownfield rung). The durable content was already pending as the R2 retention knob, which §2's cursor/log amendment now subsumes (`retention: 0` legal). Keep as a one-line implementation note on the knob, not a standalone adoption.

**#12 Channel-leak telemetry (adopt, dev-surface) — holds.** The failure class survives our structural fix: component-lifecycle refcounting kills component-scope leaks, but module-scope subscribes (plan, Open Questions: component-surface item) can still hold channels forever. Their evidence says this is the *top* client-side production failure for channel systems. A dev-mode held-channels counter with provenance (which subscribe call, which component) is cheap, tree-shaken, and pairs with the `4204` tripwire server-side. Adopt as specced.

---

## 7. Remaining reconsiders resolved

**#5 Server-enforced ephemeral rate floor (reconsider → ADOPT, reshaped).** The dossier framed this as inbound abuse protection (their 5-track-calls/30s exists because tenants didn't self-throttle). Re-derived against our mechanics, the better primitive is on the *other side*: the plan's conflation engages only under backpressure (slow consumer's pending frame replaced), so a fast producer with healthy consumers fans at full inbound rate — 240Hz unthrottled mousemove × subscribers, pure waste above render rate. A **per-channel emit tick** (server coalesces outbound per key to ~30Hz, matching the scenario's stated 15-30Hz envelope) bounds steady-state fan-out *and* defuses inbound flooding in one move: above-tick inbound just overwrites the latest-per-key entry and conflates away, costing parse + map-set only. The 15-30Hz contract moves from app-space courtesy ("throttled at source") to server-guaranteed physics. Residual inbound DoS (parse CPU) falls to a **per-connection inbound frame cap** — generic connection hygiene, not ephemeral-specific. Knob shape answer for open Q2: per-channel (emit tick) + per-connection (frame cap). Per-tenant is theirs alone — multi-tenant SaaS economics, out of scope for a single-tenant reference server. Protocol surface: none. Zero client bytes, zero wire change — delivery timing needs no negotiation. Amend plan Ephemeral Collections: "throttled at source, conflated at the server tick regardless." Default tick value validates in Phase 0a alongside the other smoothing constants (ws-protocol open Q6's genre).

**#6 Payload caps as explicit config (reconsider → ADOPT).** Resolves ws-protocol open Q7 in the direction their tiers point: limits are deployment config, *advertised* where the client can act on them (`welcome.limits.maxPayloadBytes`, per #3 above), enforced at the right layer — oversized `call` → `result.error 4204` (the write fails loudly, the typed content stays in the outbox/dead-letter per the hard-fail conversion rule), transport-frame violation → close `4002`. One inherited anti-pattern to ban explicitly: their oversized Postgres Changes payloads are **dropped to a notice** (dossier §Schema) — a silently missing delta is precisely what our taxonomy forbids. Outbound deltas are never size-dropped: bounding inbound bounds outbound for owned writes by construction, and schema `check` is where a deployment bounds pathological field sizes. CDC-sourced huge external writes degrade through log collapse → `reset` → snapshot like any bulk anomaly, never through silent omission.

---

## 8. Open questions worked

**Q1 — auth refresh and revocation bounds.** Answered, §1. Today: no re-gate moment exists, and the refresh message launders permissions past the only structural boundary (token expiry), making revocation unbounded for any permission change not paired with an explicit `server.revoke`. Adopt re-gating: `auth` refresh re-runs the `permission` slot per held channel, `nosub 4202` per denial. Promise: revocation ≤ min(revoke call, auth refresh interval). Handler-embedded auth keeps the weaker reconnect bound, stated. **Answered.**

**Q2 — ephemeral rate knob shape.** Answered, §7: per-channel emit tick (fan-out economics + flood absorption via conflation) + per-connection inbound frame cap (parse-CPU hygiene). Per-tenant declined — their need is multi-tenant SaaS shaped, our reference server is single-tenant. **Answered** (tick default → Phase 0a validation).

**Q3 — multi-node ephemeral.** Answered, §3: Redis pub/sub into per-node local conflation maps, no stream. Made CRDT-free by the single-writer-per-key invariant (state it in the spec now), ghosts killed by staleness-TTL expiry, which also fixes their background-tab wart on a single node. Spec language changes now: yes — the invariant and liveness-scoped expiry are cheap sentences that prevent expensive future drift. **Answered.**

**Q4 — protocol-visible limits.** Answered, §6 #3: rate dims stay behind `4503 + retryAfter`, app-actionable limits ride an optional `welcome.limits` object (not `caps`), one new code `4204 limit-exceeded` on `nosub`/`result.error`, `4002` keeps transport. Reference server names all dimensions in config either way. Conformance suite tests breach behavior per class. **Answered.**

**Q5 — watch items.** None change a disposition today. `pg-delta` (possible new CDC engine) touches their Postgres Changes pipeline — if it matures into reliable change delivery it further corroborates candidate 8's direction of travel, nothing to do now. Forum/Census regional broadcast is planet-scale multi-region fan-out — our multi-node story is deployment-scale Redis, no contact. Broadcast Replay growing (limit raised, all sources, public channels) would *strengthen* the cursor-core corroboration — the flip signal to watch for is the opposite: replay stagnating or being deprecated for lack of use, which would be evidence the refetch posture suffices even for data. Nothing today suggests it. **Answered (watch, no changes).**

---

## 9. New findings

**N1 — `filter: fn(ctx)` is per-subscriber content filtering on a shared channel — mini-WALRUS (needs-jack).** Surfaced by the re-gating analysis. plan.md (Channels / Publication config) allows `filter` as `fn(ctx)` ("tenant scoping declared once") while channels are "shared per `(name, args)`" with one resolved selector, one cursor, one log, identical bytes fanned to every subscriber. A ctx-dependent filter gives two subscribers of the *same address* different effective selectors — either instance sharing silently breaks, or subscribers see rows their filter should exclude. Their entire §3 history is the proof of where per-subscriber content evaluation on a shared stream ends. Supabase's survivor design keeps per-subscriber state to access *booleans* on a shared topic (policies cached per socket) — never content. Resolution options for Jack: (a) resolved filter output joins channel instance identity (same address + different filter = different instance — sharing economics degrade quietly per distinct ctx-resolution), (b) constrain `fn(ctx)` filters to values derivable from declared args so identity stays `(name, args)`-complete, or (c) drop the fn form and let tenant scoping live in args + `permission`. The spec should not ship the fn form without choosing.

**N2 — refresh launders permissions (the mechanism behind candidate 4).** Not just "no re-gate moment exists": the `auth` message as specced actively converts the revocation bound from token-lifetime to unbounded, because it extends sessions across the only boundary that forced gate re-evaluation. The dossier flagged the delta, not the inversion. Folded into §1's adoption.

**N3 — the declarative `permission` slot is what makes cheap re-gating possible.** Supabase re-gates by re-running full RLS evaluation because policy is their only artifact. Our slot separation (permission / filter / handler) means the re-gate runs the cheap auditable predicate only. A structural dividend of the config shape the spec chose for auditability — worth one sentence in Security Posture, and it sharpens the cost case for the function-form escape hatch.

**N4 — server emit-tick conflation (the reshaped #5).** Plan's conflation is backpressure-triggered only — steady-state fast producers fan at full rate to healthy consumers. The emit tick makes the 15-30Hz envelope server-guaranteed and turns inbound flooding into a parse-only cost. New mechanism, zero protocol surface.

**N5 — ephemeral offline writes must drop, and the spec doesn't say so.** Durable mutators queue to the outbox while `reconnecting`/`offline` (ws-protocol §3). Ephemeral writes while disconnected must be dropped silently — queueing them is the replay-animates-ghosts failure the tier's own prose forbids. One sentence in Ephemeral Collections.

**N6 — cursor/log separation (the articulation candidate 8 earns).** The cursor is mandatory correctness machinery (gap detection = the taxonomy's disclosure requirement, txid completion, monotonic reads). The log is a per-channel retention knob that may legally be zero, with snapshot-at-resume as the normal path — which the scenario's own figures predict for the dominant channel. Folding `retention: 0` into the pending R2 retention knob makes the at-most-once steelman's best point a configuration, not an architecture.

**N7 — staleness-TTL as the uniform ghost-killer.** Their CRDT handles dead-node ghosts but not throttled-tab ghosts (documented wart, client-side workaround). Liveness-scoped expiry via staleness TTL handles both, single-node and multi-node, with one mechanism native to the tier's physics. Part of §3's amendment.

---

## 10. Updated dispositions

| # | Topic | Dossier disposition | Reviewed disposition | Spec surface |
|---|---|---|---|---|
| 1 | Write-time routing + auth-at-join | adopt (confirmation) | **upheld** | referee brief quotes their numbers for auth-at-join + shared instances, not router cost (membership matching is ours alone, bounded by field-set prefilter) |
| 2 | Serialize-once fastlane dispatch | adopt | **upheld** | reference-server implementation note under ws-protocol §1 |
| 3 | Quota vocabulary | adopt | **upheld, shape pinned** | `welcome.limits` optional object, new `4204 limit-exceeded` (nosub + result.error), rate dims stay 4503+retryAfter |
| 4 | Auth-refresh re-gating | reconsider | **ADOPT** | ws-protocol §4: refresh re-runs `permission` per held channel → `nosub 4202`. Promise: revocation ≤ min(revoke, refresh interval). Handler-auth asymmetry stated |
| 5 | Ephemeral rate floor | reconsider | **ADOPT (reshaped)** | plan Ephemeral: server emit tick (~30Hz) + per-connection inbound frame cap. No protocol change |
| 6 | Payload caps | reconsider | **ADOPT** | resolves ws-protocol open Q7: advertised in `welcome.limits`, enforced as result.error 4204 / close 4002, outbound deltas never size-dropped |
| 7 | Partition-drop retention | adopt (small) | **downgrade to confirmation** | one implementation line on the existing R2 retention knob (relevant only to a postgres-backed log) |
| 8 | At-most-once vs cursor-core | confirmed-divergence | **upheld + amendment** | cursor/log separation stated, `retention: 0` legal per channel (N6) |
| 9 | Three products vs tiers | confirmed-divergence | **upheld + one sentence** | ephemeral offline writes drop, never queue (N5) |
| 10 | Presence CRDT vs conflated map | confirmed-divergence | **adopt-the-goal-not-the-mechanism** | plan Ephemeral: single-writer-per-key invariant, liveness-scoped TTL expiry, pub/sub multi-node carry named now |
| 11 | No projections / field granularity | confirmed-divergence | **upheld** | none |
| 12 | Channel-leak telemetry | adopt (dev) | **upheld** | dev-mode held-channels counter with provenance + server `4204` tripwire |

New: **N1 filter(ctx) identity hole — needs-jack**, the one finding that names a place the spec is wrong rather than incomplete.

---

## Sharpest critique (their architect's voice)

"You studied our WALRUS autopsy and wrote the right invariant — shared instances, identical bytes, auth resolved to booleans at the join, nothing per-subscriber in the fan-out path. Then you put `filter: fn(ctx)` in the publication config. That one key is per-subscriber content filtering on a stream you promised to share: two operators subscribe `trips.byId?{id:42}`, your tenant-scoping filter resolves differently for each, and now either your 'one instance per (name, args)' is a lie or one of them is reading the other's rows. We didn't lose to per-subscriber auth — auth caches as a boolean. We lost to per-subscriber *visibility of content*, eleven milliseconds at one subscriber, three hundred at ten thousand. You're shipping the seed of it as a convenience key — and notice your new re-gating moment deliberately re-runs only the permission slot, because re-resolving a per-subscriber filter has no sane answer on a shared instance. Your own fix is telling you the key doesn't belong. Decide what your channel identity is before two implementations exist: args-complete, or per-subscriber. There is no third thing, and we paid three years to learn it."

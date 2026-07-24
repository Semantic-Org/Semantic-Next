# WS Protocol Review — Five-Voice Referee Choir

Adversarial review of [`ws-protocol.md`](../protocol/ws-protocol.md) (2026-06-11). Two referee briefs — invariant compliance and a lost-work scenario walkthrough — each run independently on two models, plus a fifth voice walking the spec against a constructed production-scale workload (and stress-testing the first four voices' proposed fixes). The first four referees saw nothing of each other; the fifth saw all four. Convergence across voices is the revision driver; per house epistemics, convergence is confidence, not verdict — the conformance suite proves the fixes.

## Revision List by Theme (synthesized across voices)

**1. The conflict story is the missing organ** (blocking — both lost-work voices, independently). Stale replay silently clobbers concurrent committed edits in both directions. Fix shape both voices converge on: base-version/cursor stamps on outbox entries at capture, a conflict outcome code on `result` driving a field-addressable surface, and bounded auto-replay age with park-and-confirm beyond it. The disclaimed long-offline regime must be entered loudly or not at all.

**2. txid atomic apply needs respecification** (blocking — three voices). The wire schema vs prose gap (Opus), `result` unable to express cross-channel confirmation (Opus), and the hold-livelock under snapshot folding (Fable). Cluster fix: a server snapshot/commit ordering contract, snapshot-substitution generalized to all snapshot states, cursor advances only on apply (never on receive — also the crash-recovery hole), queued-frame discard at reset/snapshot commit, hold set = spans ∩ subscriptions.

**3. Watermark and ledger semantics** (serious — three voices). Rejected calls advance the watermark, failure outcomes retained for the ledger TTL and cross-checked at reconnect trim, gap behavior defined, the ledger named explicitly as shared infrastructure with the stateless-node claim qualified.

**4. Boot and trim choreography** (serious — Fable both briefs). Boot order: hydrate snapshot → rehydrate outbox → derive synced⊕pending → render. Welcome-trim splits from pending-drop: overlays persist until touched channels reach live.

**5. Lost-work surface hardening** (serious/minor — both lost-work voices). `visibilitychange`/`pagehide` not `beforeunload` (which never fires on lid-close), client probe on unacked calls (cuts the ~50s half-open blind window), a delayed-writes tier off `oldestPendingAt`, `navigator.storage.persist()` while pending, an outbox-exists eviction tombstone, and a session dead-letter retaining rejected edits' content.

**7. Conflict evidence is per-path, durable, never log-derived** (voice 5, refining theme 1's fix before adoption). Per-doc base versions false-positive at ~100% under field-level collaboration — the evidence is a per-path last-write map maintained as doc-adjacent metadata on the write path, compared prefix-aware against the replayed entry's written paths, value-equality short-circuited. Parking is conflict-evidence-driven and respects outbox order (the watermark interaction is real). Conflict is a third writes surface: field-routed, validation-shaped, auto-dismissing.

**8. Arrays need id-addressed paths** (host finding, corroborated by voice 5's assumptions). Whole-array $set folding makes every concurrent intra-array edit a silent wholesale clobber — and in deeply-nested collaborative docs (hauls, catch rows, offload tallies, attachments) the arrays are where all the concurrency lives. Wire paths gain id-addressing for schema-declared id-bearing subdoc arrays (`items[id=r7].amount`), structural changes travel as ops (insert/remove by id), the data layer translates positional trackWrites paths at capture using the schema. Disjoint-subdoc concurrency merges cleanly; nothing positional survives on the wire.

**9. Recompute channels are outside the txid universe** (voice 5 blocking-family). Frames from recompute-diff carry no txid and never appear in spans; routed and recomputed channels are eventually consistent, stated as semantic. Plus the personal-args economics: shared-base recompute, a recompute floor, an emit interval separate from the write-flag debounce, and the viewers=50 bench.

**10. Detail-page dep granularity is now load-bearing** (voice 5). Per-doc deps mean co-editor write rate drives every viewer's reaction rate — the helper-granularity trace is promoted to required for the trip-editor steelman, and an ephemeral frame type is reserved as a capability candidate (presence is the conflict-preventer and is currently unbuildable on this wire).

**6. Hygiene** (minor). `server.revoke` enumeration via channel subscriber sets, log-collapse scoping, 4400 as best-effort same-node, the spans tenant-metadata exposure documented, JCS divergence failing loudly in dev, state-machine diagram reconciliation.

---

## Voice: Opus — invariants — issues-found, 6 issues

**[blocking]** Cross-channel atomicity invariant (6) is broken at the wire schema. The prose mandates 'txid on deltas (Electric's answer), client holds application until the set is complete' (line 206), and the synced⊕pending confirm path depends on it. But the delta message schema is `delta { channel, collection, id, fields, cleared, cursor }` (line 176) with NO txid field. A receiver literally cannot group a cross-channel atomic apply from the wire as specified — the field the invariant rests on is absent from the only message that carries deltas. State machine (atomic hold-until-complete) and message schema disagree.

*Fix:* Add `txid` to the delta schema: `delta { channel, collection, id, fields, cleared, cursor, txid }`. Specify the completeness signal the client uses to know a txid's delta set is fully delivered across independently-cursored channels (e.g. a per-txid expected-channel count or a closing `txnComplete { txid }` frame), since channels have independent cursors and arrive interleaved.

**[blocking]** The `result` message cannot express cross-channel confirmation, breaking the confirm half of synced⊕pending (invariant 7) and read-your-writes (line 201). A method emits deltas to N channels 'with independent cursors' (line 206), yet `result { id, status, cursor }` carries a single scalar cursor (line 177), and the drop rule says the speculative version is dropped 'when the channel cursor passes it' (line 197) without naming which channel. With per-channel cursors a scalar cannot say 'applied' across N channels, including unsubscribed ones the method touched. The plan admits this exact hole at line 353 ('result needs a cursor vector for subscribed channels, or txid subsumes it'), so the published schema ships a known-incorrect confirmation primitive.

*Fix:* Resolve before the schema is treated as fixed: either make `result` carry a per-channel cursor vector for the subscribed channels the method touched, or make txid the unit of confirmation (client drops speculative state when it has applied the full txid set) and drop the scalar cursor from result's confirmation role. Pick one and propagate it through the drop rule at line 197 and the method-promise-resolution wording at line 100.

**[serious]** The idempotency ledger contradicts the stateless-node / horizontal-scale invariants (1, 8). Line 181 requires 'any node answers any reconnect' and derives `welcome.lastCallID` from the idempotency ledger, which only works if the ledger is shared/durable across nodes. But line 205 specifies it as a 'per-session ledger of recently applied ids' — per-session in-memory state is exactly sticky per-node state. As written the two passages describe different artifacts: a stateless reconnect needs a cross-node-visible ledger keyed by clientID, not session.

*Fix:* Specify the ledger as keyed by stable `clientID` (not session) and stored in the shared tier (Redis, alongside the channel streams), with a stated retention window. Reword line 205 to drop 'per-session' and state the durability/scope explicitly so it satisfies 'any node answers any reconnect.' Note the retention-window bound, since 'recently applied' plus at-least-once means a retry older than the window double-applies.

**[serious]** At-least-once delivery (invariant 5) is asserted as safe via idempotent apply, but the search-channel recompute-diff emits order-sensitive deltas that are not value-idempotent under redelivery. Line 229 justifies overlapping-channel duplicates as 'idempotent on apply' — true for full-field reference swaps. But shared recompute-diff emits 'enter/leave/field deltas' (line 217) and same-field concurrency is 'last-method-wins at the server' (line 201). Under at-least-once, a redelivered or reordered enter/leave or stale field delta is not idempotent against window membership — a redelivered 'leave' after a 're-enter' drops a visible row. The idempotency argument covers field swaps, not membership-transition deltas.

*Fix:* State that every delta (including enter/leave/field) carries the channel cursor and that the client rejects any delta whose cursor is <= the channel's high-water mark (monotonic-reads already promised at line 201). That makes redelivery a no-op by position rather than by value, which is the actual mechanism at-least-once needs here. Make this explicit in the Search channel mechanics section, where membership deltas live.

**[minor]** `server.revoke(channel, args)` (line 237) 'force-unsubs and resets affected clients,' which presumes the server can enumerate clients per channel. That is consistent with invariant 1 only if it reads the subscription list and emits the existing `reset` per affected subscriber — but the document never states revoke routes through reset/subscription-list rather than introducing a new per-client revocation surface. Left implicit, it reads like a third per-client mechanism.

*Fix:* One sentence: revoke is not a new message — it walks the channel's subscriber set (the subscription list, the only per-client state) and emits the existing `reset { channel }` to each, reusing the universal pressure valve (invariant 3). This also keeps it within the 'two gates, no third surface' permissions claim at line 235.

**[minor]** Log-collapse threshold for bulk writes (line 249) emits `reset` when 'a channel's pending delta volume crosses a threshold,' but reset is per-channel-per-subscriber-position and the threshold is described as channel-global. Whether 'pending delta volume' is measured against the channel's slowest subscriber cursor or against absolute log length is unspecified — if absolute, a million-row migration resets every subscriber including fully-caught-up ones who needed no reset (spurious resnapshots, a thundering-herd snapshot storm the doc otherwise guards against). Consistency gap between the per-channel reset semantics and the global threshold trigger.

*Fix:* Specify the threshold as log-length / retention-window based (the cursor-expiry mechanism already in invariant 2/3), so reset fires only for subscribers whose stored cursor has fallen off the retained log tail. Caught-up subscribers continue from the collapsed tail's new base without resnapshot. This aligns bulk-write collapse with the ordinary cursor-expiry path the doc already calls first-class.

## Voice: Opus — lost-work — issues-found, 5 issues

**[blocking]** Silent-loss seam at the optimistic-apply / outbox-durability ordering. The protocol's entire lost-work guarantee rests on 'the outbox survives the tab regardless (IDB-durable, replays next visit)' (§6) and 'persisted beside the entry' (§2), but NOWHERE does the document state the load-bearing invariant: the mutator must not report optimistic success (must not flip sync.writes to 'saved', must not advance the optimistic pool) until the outbox entry has DURABLY committed to IDB. IDB writes are async. Walk the scenario: user types three edits, each synchronously applies to the in-memory pool and shows 'saved', then closes the lid within seconds. Lid-close is suspend, not process-kill — but if those 2 hours include hibernation followed by battery death (or an OOM tab eviction), any outbox transaction still in flight at suspend is lost. The user saw 'saved'; the bytes never hit IDB and never hit the server. That is exactly the failure the §6 threat model claims to prevent ('I closed the tab must not silently mean my last keystrokes reach the server next Tuesday'), and it is silent.

*Fix:* Pin a durability invariant in §2/§6: the optimistic apply and the IDB outbox append are one logical commit, and sync.writes.status MUST NOT report 'saved' (and the value MUST NOT be treated as locally durable) until the IDB transaction's onsuccess/complete fires. Order: enqueue-to-IDB → await commit → then apply optimistically and update writes.status. If sub-keystroke latency makes await-per-keystroke too slow, document the batched-commit window explicitly as the bounded loss surface and surface it (e.g. writes.status stays 'saving' until the IDB batch commits). State it as a fixed-forever guarantee in §7, not an implementation detail.

**[blocking]** Cross-user concurrent-edit loss is silent by construction. The word 'conflict' never appears in the document. On reopen, the three 2-hour-stale edits replay as `call`s (§5 step 5), execute on the server (fresh ids, never in the ledger, so they run for real), and land on top of the second user's already-committed edits to the same doc. For a typical implicit-save mutator ('set field X = V') this is blind last-writer-wins: the stale replay clobbers the second user's concurrent edits to those fields. The second user — if subscribed — receives a `delta` overwriting their value with no attribution, no 'this changed while you were away', no merge. The first user gets read-your-writes (§4 result resolution) and never learns another user touched the doc. The protocol provides no conflict surface: `result.error` 4301 only fires if the mutator itself throws a conflict check, which a naive set-field mutator does not. A protocol that brands itself as a structural lost-work guard for implicit-save UIs (§6) silently destroys a concurrent collaborator's work on the most common write shape.

*Fix:* Either (a) state explicitly in §5 that conflict resolution is delegated to the mutator and that the reference set-field mutator is LWW with no cross-user visibility — making the limitation a documented contract rather than an unstated default — or (b) add a conflict-detection seam: have the server attach the synced base-version a mutator read at apply time, reject (4301) when the field moved underneath a stale replay, and define a client surface (sync.writes.status='error' is too coarse — it's ambient/once/never-per-field per §6) for the user to see the collision. At minimum, add 'concurrent cross-user edit reconciliation' to §8 Open Questions; its total absence reads as an oversight, not a decision.

**[serious]** The lost-work `beforeunload` guard (§6) does not fire on lid-close/suspend, which is the exact trigger in this scenario. The guard attaches while sync.writes.pending > 0 and prompts on tab unload, but closing the laptop lid is OS suspend — it raises no `unload`/`beforeunload`. So the user who types three edits and closes the lid gets no prompt even though pending > 0 and the socket is dead. The guard's stated purpose ('I closed the tab must not silently mean...') has a blind spot for the most common 'I'm done for now' gesture, which is lid-close, not tab-close.

*Fix:* Acknowledge in §6 that beforeunload covers tab/window close only, not suspend, and that suspend-safety rests entirely on outbox durability (which makes finding #1's IDB-ordering invariant doubly load-bearing). Consider a `visibilitychange→hidden` + `pagehide` durability flush so any in-flight outbox batch is forced to commit when the page is backgrounded, closing the suspend window. Do not rely on the prompt for suspend.

**[serious]** Detection-to-warning latency (~55s) exceeds the user's interaction window, so in this scenario the UI warns only after the user is gone, undercutting §6's stated 'must be loud, ambient' goal. Worst-case client-side disconnect detection is the heartbeat dead-man at heartbeat×2 = 50s (default heartbeat 25000ms, §4) — half-open TCP means outbound `send()` buffers without error, so the dead-man is the ONLY detector. Then §3 smoothing holds data-connection='connected' for 5s before showing 'reconnecting', so the ambient/CSS surface lags physical death by ~55s. The user typed three edits and closed the lid in seconds; the warning never rendered before they left. The claim that 'the status signal is raw truth and flips immediately' (§3) is true only relative to the state-machine transition, not relative to physical disconnection — raw truth itself is unknown until the dead-man fires.

*Fix:* Clarify in §3 that 'flips immediately' is scoped to the state transition, and that physical-disconnect-to-known is bounded by heartbeat×2. For implicit-save, consider a shorter heartbeat or an outbound-stall heuristic (an outbox entry unacked past N seconds while status='connected' is itself a disconnect signal) so the 'saved' badge cannot stay green for ~55s over a dead socket. Re-evaluate the 25s default and the 5s grace against this 'short interaction then suspend' path in the §8.6 smoothing-constants validation.

**[minor]** sync.writes.status enum mapping is underspecified for the (pending>0, all-optimistically-applied, socket-dead) state this scenario produces. During the 40s+3-edits window, writes are applied and outbox-durable but unacked; sync.writes.pending shows 3, yet the document never defines whether status reads 'saving' or 'saved' when pending>0 with nothing in flight on the wire. §6 says 'saved' smooths to display ≥1s and 'error' means a rejection — but the steady-state of 'durably queued, not server-confirmed, link dead' has no defined label. A 'saved' badge sitting next to a pending count of 3 is contradictory to a user.

*Fix:* Define the (pending, in-flight, error, connection-status) → status enum mapping explicitly in §6. Specifically decide what status displays when entries are outbox-durable but unconfirmed and the connection is reconnecting/offline — likely a distinct 'pending'/'queued' presentation rather than 'saved', so the badge does not assert server-confirmation the protocol cannot back.

## Voice: Fable — invariants — issues-found, 10 issues

**[blocking]** txid hold can livelock when a spanned channel's frame is folded into a snapshot. A replayed mutator spanning channels A and B can deliver A's txid frame while B is mid-snapshot (initial sub, resume-with-expired-cursor, or boot). If B's snapshot is taken at a position at or past the tx, B's effects arrive inside the snapshot and a txid frame for B never exists. The hold rule waits forever; the 10s gap-resubscribe re-subs B with a cursor already past the tx, re-delivers nothing, and loops. The server-side ordering contract between an in-flight snapshot stream and concurrent commits is never specified.

*Fix:* (a) Specify the snapshot/commit ordering contract: every commit fanned to a subscriber mid-snapshot is either contained in the snapshot or delivered as a delta after the terminal chunk, never silently dropped. (b) Generalize reset substitution: any channel in snapshot state (initial, resume, or reset) stands in for its missing txid frame.

**[serious]** Reset (and snapshot commit generally) never states that the channel's queued and held frames are discarded. Stale queued frames applied after a resnapshot write older values over newer ones — silent corruption, breaking monotonic reads.

*Fix:* Flush rule: on reset and at any snapshot commit, discard all queued frames for that channel and its contributions to held tx groups — the snapshot subsumes them.

**[serious]** Outbox trim at welcome reintroduces forbidden flicker: trimmed entries drop from pending at welcome but their authoritative effects only arrive later via tail replay — boot renders settled-while-away writes undoing then redoing.

*Fix:* Split trim from drop: stop re-sending trimmed entries at welcome, keep their pending overlays until every touched channel reaches live.

**[serious]** Cursor advance timing (receive vs apply) is load-bearing but never specified. Frames queued behind a held group must not advance the stored cursor or gap-resubscribe skips the missing frame; a cursor persisted on receipt of unapplied frames makes crash-recovery resume past never-applied data — silent loss.

*Fix:* A channel's stored cursor advances only when a frame applies; held/queued frames never advance it; the persisted cursor is always consistent with the persisted snapshot. Hold tracker is set-based per (txid, channel) so duplicates are no-ops.

**[minor]** Watermark semantics underspecified: gap behavior undefined (max(id) would strand skipped calls), and whether rejected calls advance lastCallID is undefined — trimmed-rejected entries vanish with no error surfaced, contradicting the consumer-surface promise.

*Fix:* Server processes ids in arrival order, watermark = highest processed (success or error); rejected calls advance it; trimmed-rejected entries surface a one-time ambient error or the promise is scoped to live-session rejections.

**[minor]** 4400 takeover detection is unimplementable as written under no-sticky-sessions: old and new sockets can be on different nodes where neither sees the conflict.

*Fix:* Scope 4400 as best-effort same-node; cross-node duplicates are tolerated (Web Locks bounds them, idempotent receiver makes them safe); a cross-node registry, if wanted, is named ephemeral connection infrastructure.

**[minor]** Hold-timeout resubscribe contradicts client refcounting when the missing channel was concurrently unsubscribed — re-opens a zero-reference channel.

*Fix:* Hold set = spans ∩ current subscriptions, recomputed on subscription changes; unsub releases the channel's slot in every held group.

**[minor]** spans leaks channel-address metadata across tenants: a subscriber of one tenant's channel learns other tenants' channel addresses (including args) from shared fan-out bytes.

*Fix:* Document as a design constraint: channel args must not carry secrets; tenant-scoped channels keep transactions single-tenant. Per-tx-salted address hashes noted as a hardened-mode capability candidate, not v1.

**[minor]** State machine and consumer-surface inconsistencies: jitter range label, missing offline-to-connected welcome edge, five-state status vs four-state attribute enum, 4102 code-routing mismatch.

*Fix:* Redraw diagram, define the attribute mapping for connecting, reconcile 4102's surfaces.

**[minor]** Advisory channel-address mismatch is silent death: if client and server JCS implementations diverge, server frames carry an address the client never registered and the channel is silently empty.

*Fix:* Server frames echo the canonical address against the advisory string on first snapshot/live, client adopts it — or at minimum a dev-mode mismatch error so divergence fails loudly in conformance.

## Voice: Fable — lost-work — issues-found, 7 issues

**[blocking]** Silent clobber of the second user's committed work by stale replay. The three edits queue durably, survive lid-close, and on reopen replay unconditionally as fresh calls; same-field concurrency is last-method-wins, so two-hour-old keystrokes overwrite newer committed edits. The call message carries no base version, result has no conflict status, drafts' stale() does not apply to mutators, and read-your-writes means user A never renders B's value before overwriting it while B sees an unattributed revert. The disclaimed long-offline regime is entered silently. Silent loss of confirmed work on both sides.

*Fix:* (a) Stamp each outbox entry with a per-doc base version or channel cursor at capture time; the server flags same-field writes-since-base and returns a conflict outcome (new 43xx code) driving a field-addressable surface instead of silently winning. (b) Bound auto-replay age: entries older than a threshold park instead of replaying, surfaced as unsynced edits requiring explicit confirm.

**[serious]** Watermark trim erases failure outcomes, and failed-call watermark semantics are unspecified: a received-and-rejected edit whose result frame was lost gets trimmed on reconnect, its optimistic state reverts, and no error fires — the user's saved edit silently reverts. The alternative reading (failures don't advance) deadlocks the trim contract.

*Fix:* Failed calls advance the watermark; retain failed ids plus error codes in the ledger for the watermark TTL; reconnect trim cross-checks that list and routes hits through the writes error surface.

**[serious]** Boot-from-IDB can paint without the queued edits: the snapshot store is lazy so the persisted snapshot can predate the outbox tail, and the boot sequence never orders outbox rehydration before first paint — reopen renders the input without the edits, contradicting the it-is-saved mental model, and typing against the stale paint mints racing mutators.

*Fix:* Boot sequence: hydrate snapshot, rehydrate outbox into pending, derive synced-plus-pending, then render.

**[serious]** Rejected replayed edits discard the user's content irrecoverably: pending entry drops, optimistic state reverts, only an ambient generic error surfaces, and nothing retains the args — typed text evaporates with no recovery path.

*Fix:* Retain rejected outbox entries (args plus target doc/field) in a session dead-letter surface driving could-not-save with content, retry/copy. Client-only, no wire change.

**[minor]** Half-open blind window of up to 2x heartbeat (~50s worst case): all three edits typed and lid closed inside the window with the connection attribute still connected. Durability unaffected; visibility gap only.

*Fix:* Client-initiated probe when a call goes unacked past a few seconds, and/or a delayed writes tier driven by oldestPendingAt.

**[minor]** Outbox eviction is undetectable: days-later reopen on WebKit can evict the outbox; evicted outbox plus clientID looks like a fresh client (lastCallID 0), queued edits vanish with no tombstone.

*Fix:* Request navigator.storage.persist() while writes are pending; keep an outbox-exists marker in a second store so eviction is detected and disclosed.

**[minor]** Dev-restart amnesia double-apply: the in-memory rung loses watermark and ledger, reconnect gets lastCallID 0, applied-but-unacked calls double-apply (the $inc hazard).

*Fix:* State the memory-rung posture: documented double-apply window, or persist the watermark integer to disk in dev.

## Synthesis Agent's Own Open Questions
- Canonical args beyond plain JSON: how schema-revived types (Dates minimum) in channel args serialize into the JCS channel address — pin before a second implementation exists; likely answer is args are wire-plain by construction, but it must be stated
- Watermark + ledger durability policy: concrete TTLs for the reference server, the unknown-clientID replay-acceptance posture as a stated residual double-apply risk, and whether result-caching in the ledger is core or a capability
- Tx-hold timeout: the 10s default, and gap-resubscribe interaction with projection-union pruning when the missing spanned channel was concurrently unsubscribed
- Progressive snapshot paint: whether huge-channel first boot gets a marked exception to atomic-commit-at-live or the discipline holds everywhere (the silently-incomplete-query trap argues it holds)
- Per-channel pending counts: derivable from pending set × channel membership — bench the derivation cost before promising handle.pending
- Smoothing constants (5s reconnecting grace, 30s offline threshold, 1s saved smooth): validate against the Phase 0a edge-state pages before freezing as shipped defaults
- Batch frame limits and message-size defaults for the reference server, and whether limits are capability-advertised or fixed
- Revocation UX: does nosub 4202 prune the projection union immediately or after one re-auth-and-resubscribe attempt, to avoid shared-doc flicker on membership churn
- Heartbeat negotiation: whether clients may request an interval at hello (mobile battery) or welcome's value is final
- Conformance suite shape: recorded wire transcripts vs live driver harness — co-author with the spec text so the portability promise is executable

## Voice: Fable — realistic-usage walkthrough — issues-found, 12 issues

Workload (constructed stress model): one large collection (deep document shape: nested id-bearing subdoc arrays such as hauls, catch rows, tallies, attachments), `trips.byId` universal channel, 10-100 co-editors per doc committing oninput-debounced (~300ms), role-tiered projections, personal-args searchIndex dashboards, templates binding ~10 of ~100 fields.

**[blocking · protocol]** Per-doc base-version conflict stamps false-positive at ~100%: with 9 co-editors at ~33 writes/sec, any per-doc version is stale within ~33ms of capture — every replayed entry flags, including untouched-field edits. *Fix:* per-path last-write cursors as the conflict evidence — server maintains path → last-write-position per doc from trackWrites paths; conflict = prefix-aware intersection of the entry's written paths vs paths-changed-since-base, with array-boundary semantics stated and a value-equality short-circuit.

**[serious · protocol]** Conflict evidence must not be log-derived: log collapse destroys log-scanned evidence exactly under load (a 2-min absence at 30 writes/sec ≈ 3,600 frames, past hot-channel retention). *Fix:* per-path last-write map as durable doc-adjacent metadata maintained on the write path (~100 paths × cursor per doc, accepted).

**[serious · protocol]** Park-and-confirm collides with the watermark contract: parking entry N while replaying N+1 advances the watermark past N — a later-confirmed parked entry re-sends at-or-below watermark and silently no-ops. *Fix:* park contiguous tails per (doc, path) or re-mint confirmed parked entries with fresh ids; make parking conflict-evidence-driven, not age-alone (age-only parks the untouched stream too — crying wolf).

**[serious · protocol]** recompute-diff channels × txid/spans is unstated and one reading livelocks: searchIndex deltas fold many transactions and never emit per-tx frames — listed in spans, every detail+dashboard dual subscriber holds detail deltas to the 10s timeout, a hold storm at 33 writes/sec. *Fix:* recompute frames carry no txid, recompute channels never appear in spans, routed-vs-recomputed eventual consistency stated as semantic, conformance test pinned.

**[serious · consumer-surface]** The per-field-dep premise is unmet outside as-mode each blocks: the plan's per-DOC Dependency means a findOne detail page re-fires every binding on every co-editor delta (~360 reaction runs/sec/viewer at 10 concurrent writers, ~3,600 at 100) — cost scales with co-editor write rate, not bound relevance; relation helpers mid-path multiply it. *Fix:* promote the helper-granularity open trace to required for the trip-editor steelman; either extend FGR per-field deps to detail-page doc reads or state whole-doc granularity as the semantic and bench helper-heavy pages at 30+ deltas/sec.

**[serious · protocol]** searchIndex sharing collapses to per-viewer poll-and-diff under personal args: 50 viewers × personal query/sort = 50 instances permanently flagged at ~330 intersecting writes/sec → ~165 engine queries/sec sustained; typeahead mints an instance per keystroke. When args are personal, per-instance IS per-client and the write-flag is a timer — the shared-instance recompute defense (the known reactive-query-at-scale failure mode) fails. *Fix:* shared-base recompute for instances differing only by query string, a recompute floor scaling debounce with flagged-instance count, factory guidance naming high-cardinality personal args as the anti-pattern, bench at viewers=50.

**[minor]** Dashboard churn: separate the write-flag debounce (server cost) from a minimum emit interval (perception, ~1-2s default for tables); tie-stable sort. — **[minor]** Membership-delta idempotency (Opus #4) is steady-state here: adopt high-water cursor rejection as apply rule 0, before tx-group queuing, covering gap-resubscribe redelivery. — **[minor]** Conflict is a third writes surface: field-routed and validation-shaped, distinct from the ambient save-error tier; dead-letter keyed (doc, path), auto-dismiss on a successful post-conflict commit to the same path. — **[minor]** Outbox coalescing: adjacent unsent same-(doc, path) entries coalesce pre-send (legal — unsent ids exist in no ledger), keeping the OLDEST base stamp. — **[minor · app-space]** Presence is the standard same-field-conflict preventer and is unbuildable on this wire (no ephemeral frame type); reserve an ephemeral frame (no cursor, no log, no replay) as a §7 capability candidate or state the side-channel pattern. — **[minor]** The queued-status enum gap is steady-state under implicit save: distinct 'queued' presentation + unacked-call probe so it enters from outbound evidence.

**Key derived figures:** 33 delta frames/sec/subscriber at 10 concurrent writers (frame rate, not bandwidth, is the watch variable); 2-3 channel instances per hot doc (sharing economics hold for detail channels); a 2-min tail ≈ 700KB vs a 10KB snapshot — per-doc channels should hold near-zero log retention and prefer snapshot-at-resume; the three-way ownership partition is clean except presence and the conflict surface.

**Assumptions to correct:** 300ms trailing debounce, one field-path per commit, recompute debounce ~300ms (unstated in docs), 2-3 role-tier channels, pageSize 50 × 50 viewers with personal args, heartbeat 25s (half-open ≈ 50s), intra-array edits governed by whole-array $set folding (superseded by id-addressed paths, see revision).

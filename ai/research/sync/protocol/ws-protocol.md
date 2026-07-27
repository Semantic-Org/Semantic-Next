# Sync Protocol v2 — Wire Design

Extends [`plan.md`](../design/plan.md) (Protocol Sketch, Sync Loop, Channels). This is the wire contract a second implementer builds from with none of the design dialogue in context: every standing ruling absorbed into the text, evidence named per clause. The spec is the contract and conformance is the portability story — portable because conformance-tested, not because small (Decision 9). The conformance-case catalog lives in [`ws-protocol-conformance.md`](ws-protocol-conformance.md); clauses below cite case ids as *(conformance: `id`)*.

Everything here preserves the plan's spine — opaque monotonic client-held cursors with epoch inside, at-least-once + idempotent receiver, reset as the universal pressure valve, `synced ⊕ pending` re-derivation, shared fan-out per `(name, args)`. What changed from v1, the headline deltas:

- **Hold groups are out, the framing guarantee is in.** Cross-channel atomicity moved server-side (R2 brief 1): one frame per transaction per socket on live-state channels, server-side regrouping at resume. `txid` and `spans` are deleted from the wire — transaction identity is server-side only, carried by the changelog envelope.
- **Settlement is encoded** (ruled 2026-07-04): own-writes ride live to the writing socket, and `result` carries a per-channel **positions** map — completion in cursor vocabulary, ordered only by the protocol library, same channel and same epoch.
- **Auth is foundational, not a capability**: the `reauth` frame, the server-owned expiry bound, the refresh re-gate, and the same-principal clause ride the freeze so the handshake never splits v1/v2.
- **The park/rejection vocabulary is defined once** (§6) — retry-later vs discard-forever, and the evidence-park / rejection-park / age-park settle taxonomy both its consumers share.
- **Retention and epochs are two commitments** made legible: `retention: 'none' | duration` on both layers, epoch bump ⇒ snapshot under the new shape.
- **Limits and the code table are reconciled**: `welcome.limits` advertises client-actionable limits only, `4103`/`4203`/`4204`/`4504` are minted, silent size-drops are banned.
- **The connection model is independent clients** — each tab its own clientID; the leader/follower machinery is deleted (superseded 2026-06-14).
- **The freshness surface is on the wire**: `live` frames disclose `freshness` + `updatedAt`, visibility is connection metadata, and the consumer surface speaks the locked vocabulary (`subscription.state`, `subscription.freshness`, `connection.ensure()`).

Lineage shorthand used throughout: Centrifugo (epoch/offset recovery), Replicache/Zero (cookie + lastMutationID + poke brackets), PowerSync (checkpoint apply boundary), MQTT 5 (reason codes, at-least-once), graphql-ws (close codes, init gate), DDP (field-granular change vocabulary, versioned hello). Rejected as lineage: Ably/Socket.IO server-held replay buffers (a mini-mergebox), graphql-ws's server-tracked subscription registry (no resume), MQTT durable sessions (server-held queues).

## 1. Wire Framing

**Encoding.** JSON text frames, UTF-8. One WebSocket frame carries either a single message object or an array of message objects, processed in order.

**The framing guarantee.** Array framing is not symmetric, and the asymmetry is load-bearing:

- **Client → server**: an array frame is pure batching, semantically identical to sending its elements as sequential frames. N resumed subs ride one frame, the outbox replays as one frame.
- **Server → client**: a packed frame is the **atomic apply boundary**. On live-state channels, the server MUST pack one transaction's delta messages — across every channel it touched on that socket — into one array frame, and the client MUST apply that frame as one unit between scheduler flushes *(conformance: `atomicity-packed-frame`)*. v1's "array frame ≡ sequential frames" equivalence is deliberately retired on this direction: the frame boundary IS the atomicity mechanism. Full contract in §2 Atomicity.

**Discrimination.** Every message carries `type`. Receivers MUST ignore messages with unknown `type` and unknown fields within known types (forward compatibility, §8). Dev builds log ignored messages, production drops them silently.

**Correlation.** Three correlation spaces, never shared (Zero's lesson: sync and mutations never share correlation state):

- **Connection** — `hello`/`welcome`/`rejected`/`auth`/`reauth`/`ping`/`pong`/`visibility` correlate implicitly (at most one handshake in flight, the rest are stateless).
- **Channel** — `sub`/`unsub`/`snapshot`/`delta`/`live`/`reset`/`nosub` correlate by channel address (below). No request ids: the channel address is the conversation.
- **Call** — `call`/`result` correlate by `id`, the idempotency key.

**Channel address.** Channels are shared per `(name, args)` (plan invariant), so both sides must derive the same instance key. Addresses derive as `collection.name` — `Landings.publish('byId', ...)` yields `landings.byId`, and the nameless late-attach form claims the bare collection name. The wire `channel` field is the canonical address: the derived name when args are empty, otherwise `name + '?' + JCS(args)` where JCS is RFC 8785 canonical JSON (lexicographically sorted keys, minimal number forms, no whitespace). The client computes it locally for refcounting before the server ever sees the sub; the server computes it for instance sharing and serializes each delta once per channel, fanning identical bytes to every subscriber — the 500-subscriber economics in the plan depend on no per-subscriber fields in fan-out frames. `sub` carries `args` as a parsed object alongside the address so handlers receive structured args without re-parsing; the server derives the address from `(name, args)` itself and treats the client's string as advisory.

**Channel args are plain JSON by construction.** Encoding happens above the address: args cross as their encoded forms, and no typed value (a Date, a custom value class) ever participates in address derivation. This is stated, not assumed — it is what makes two independent implementations derive identical addresses *(conformance: `address-vectors`)*.

**Address divergence fails loudly.** If client and server JCS implementations diverge, server frames carry an address the client never registered and the channel would be silently empty — the named silent-death mode. A frame for an unknown address while a sub is outstanding MUST surface as a dev-mode error naming the nearest pending subscription, and the conformance suite carries derivation vectors both sides must match byte-for-byte *(conformance: `address-divergence-loud`)*.

**Versioning.** `hello.protocol` and `welcome.protocol` are integers. This document specifies `2`. Negotiation and skew policy in §8.

**Reason codes.** One numeric vocabulary for `rejected.code`, `nosub.code`, `result.error.code`, and WS close codes — MQTT 5's single-table lesson, sized 4000–4999 so any code is a legal WS close code (graphql-ws lineage). Full table in §2. The server can drive client behavior with one number: retry, redirect, re-auth, give up.

**Serialize-once dispatch.** A channel delta is serialized once and the identical bytes fan to every subscriber; per-subscriber context is packed at subscription registration, never at dispatch (the reference shape, proven at 800k msgs/sec in Supabase's published Realtime benchmarks). This is why no fan-out frame carries a per-subscriber field, and why settlement's own-writes exception (§2) is a timing exception, never a payload one.

**Transport pluggability.** The protocol is fixed above the transport; delivery is pluggable below it. A transport is a registered factory presenting the socket shape (`onopen`/`onmessage`/`onclose`/`onerror`, `send(text)`, `close()`, `readyState`) — the connection machine owns liveness, backoff, and the ladder policy (failure-triggered demotion, per-origin rung memory, background upgrade probe). **Frames are byte-identical across transports**: the WebSocket default, the SSE-downstream/fetch-uplink fallback, and the stateless poll pair all carry the same frame choreography — the poll transport synthesizes it client-side so the kernel runs unchanged *(conformance: `transport-frame-equivalence`)*. A future WebTransport edge registers the same way: a factory presenting the socket shape in front of an edge process that forwards opaque frames — the slot is part of the freeze, the edge build is not. Long-poll is SSE's degraded mode, never a third transport.

## 2. Message Schema

### Inventory

```
client → server
  hello       { type, protocol, clientID, auth?, caps? }
  auth        { type, token }
  pong        { type }
  visibility  { type, value }                            'visible' | 'hidden'
  sub         { type, channel, name, args?, cursor? }    cursor omitted = need snapshot
  unsub       { type, channel }
  call        { type, id, name, docID?, args }          docID present = mutator (the doc address)

server → client
  welcome     { type, protocol, lastCallID, heartbeat, authExpiresIn?, limits?, caps? }
  rejected    { type, code, reason, retryAfter?, redirect? }
  ping        { type, authExpiresIn? }
  auth        { type, ok, expiresIn?, code? }
  reauth      { type, expiresIn }                        server demands a fresh credential
  snapshot    { type, channel, docs, sort?, total?, cursor? }   cursor present = terminal chunk
  live        { type, channel, cursor, freshness, updatedAt }   caught up to stream head
  delta       { type, channel, cursor, changes }
  result      { type, id, status, value?, error?, positions? }
  reset       { type, channel }                          cursor expired mid-stream, resubscribe
  nosub       { type, channel, code, reason? }           subscribe denied or revoked
```

No frame carries `txid` or `spans` — transaction identity is server-side only, held by the changelog envelope, and every txid-shaped consumer sorts server-side (exactly-once ack in the ledger, commit visibility in the changelog, orphan-free jobs riding the write's transaction, CDC dedup via envelope origin). The wire's two remaining consumers — settlement and action read-your-writes — are completion-shaped, not identity-shaped, and ride `result.positions` *(conformance: `wire-clean-frames`)*.

One additional type name, `ephemeral`, is reserved (§8) — name only, schema deferred to the ephemeral-collections design.

The write vocabulary: **mutators** (isomorphic, optimistic, outboxed, replayed) and **actions** (server-only, awaited, unsimulated) both ride `call` — deltas route by changed doc, not by declaration. A mutator call carries its doc address in `docID`; an action never does (the id type carries the kind either way, §below).

### client → server

**`hello { protocol, clientID, auth?, caps? }`** — first message after socket open, nothing else accepted before it (graphql-ws init gate, close 4003 on timeout). `clientID` is a `crypto.randomUUID()` minted per client instance and persisted in IDB beside the outbox — identity outlives connections (Replicache lineage), and **each tab is its own client** with its own clientID (independent-clients model, §3). `auth` is the session credential: the server resolves it once at the handshake through the `verifySession` seam and pins the principal as `ctx.session` for the connection's lifetime — both auth gates (subscribe-time and call-time) read the pinned session, never a per-write principal lookup. `caps` is a string array (§8).

**`auth { token }`** — mid-connection credential refresh. Cursors, in-flight calls, and channel positions are untouched (Centrifugo refresh lineage: positions survive re-auth); subscriptions persist too, but only through the re-gate below, which may revoke them. Server replies `auth { ok: true, expiresIn }` or `auth { ok: false, code }` then closes 4101. Two clauses harden it:

- **The refresh re-gate.** A successful `auth` re-runs the declarative `permission` slot for every channel in the socket's subscription set; denial rides the existing `nosub 4202` path, settled by the retry-then-prune choreography (§6). Without the re-gate, a refreshing client launders permissions past token hard-expiry — the only structural revocation boundary — making revocation unbounded *(conformance: `auth-refresh-regate`)*. Handler-embedded auth (the function escape hatch) keeps the weaker reconnect bound, stated as the asymmetry.
- **The same-principal clause.** `auth` MUST present the same principal the connection pinned at `hello`. Re-auth as a different user either re-gates every subscription and every pending call under the new principal, or closes **4103 principal-changed** for a fresh handshake — the reference implementation closes. A session is never silently relabeled *(conformance: `auth-principal-pinned`)*.

**`pong {}`** — answers a server `ping`. Any frame counts as liveness, `pong` exists for otherwise-idle connections.

**`visibility { value }`** — connection metadata, `'visible' | 'hidden'`, sent on `visibilitychange` and re-announced after every `welcome` (a fresh server-side connection defaults to visible). Visibility is orthogonal to freshness: the server skips a hidden connection in live fan-out without touching any stream's declared freshness contract, and a hidden tab's streams keep their tiers, undelivered until it looks again — wake is the reconnect path, resubscribe-from-held-cursors, with `connection.ensure()` forcing the check *(conformance: `visibility-fanout-skip`)*. The server's per-channel stats expose the skipped population as `stats.channel.backgrounded`.

**`sub { channel, name, args?, cursor? }`** — subscribe or resume. `channel` is the canonical address, `name`/`args` the structured form the handler receives. `cursor` is the client's stored opaque position: omitted means need snapshot, present means tail replay if the server can serve it, snapshot otherwise — the server decides per channel, the client never interprets the cursor (Decision Record #7). The tail-vs-snapshot choice is made **by bytes**: serve the cheaper payload, `tailBytes ≤ k × snapshotBytes` with `k ≈ 1` as the reference default. Bytes compare the **changes payloads** (the tail's `changes` vs the snapshot docs), not framed bytes — per-delta framing overhead must not make a tiny gap lose to a tiny snapshot. Both sizes are measurable exactly server-side, but pricing the snapshot costs a full window read, so an implementation SHOULD replay outright when the tail is beneath a small floor (the reference uses 4KB) — the dominant resume is a short blip's few-delta gap, and it must not pay a whole-window scan to confirm the obvious *(conformance: `resume-bytes-choice`)*. Keyset window bounds (`before`, `limit`) ride inside `args` like any other arg; load-more is a fresh `sub` for the next window's address. Search channels re-subscribe overlap-then-swap: new args produce a new address, so old and new are two concurrent subs — `unsub` the old after the new channel's `live`.

Duplicate-sub refcounting is entirely client-side, keyed by channel address. First reference sends `sub`, last unreference sends `unsub`, with an optional `linger` grace (default 0) so route flips don't thrash sub/unsub on the same channel. The server holds no refcounts — its per-socket sub set is a set. A `sub` for an already-subscribed address on the same connection is not an error: the server treats it as a resume request and answers from the supplied cursor (idempotent re-sub, also the client's cursor-correction path). graphql-ws closes the socket on duplicate ids (4409); rejected as needlessly fatal.

**`unsub { channel }`** — fire-and-forget, no ack. The server stops sending and drops the subscriber entry. Frames already in flight may arrive after; the client ignores frames for channels it no longer holds (at-least-once posture).

**`call { id, name, docID?, args }`** — the only write vehicle on the wire. No generic document-mutation message exists by construction (the no-allow/deny invariant: you authorize operations, not edits). `id` is the idempotency key, deduped by the server ledger. Two id forms by kind:

- **Outbox calls (mutators)**: `id` is a JSON number — the durable outbox sequence, monotonic per clientID, persisted beside the entry. Numeric ids participate in the `lastCallID` watermark (Replicache lastMutationID semantics: anything at-or-below the watermark is settled, re-send is a no-op).
- **Action calls**: `id` is a string UUID. Actions reject fast when disconnected and are never replayed from the outbox, so they need dedup (the ledger) but not ordering (the watermark). The id type carries the kind with zero extra fields.

`docID` is the doc address, required on mutator calls and never sent on actions — a mutator is by definition a named mutation of one doc, and the address is the machinery's key (the per-doc serial apply, the optimistic overlay, insert identity), never the definition's business. It rides its own seat so `args` stay **shape-free**: absent a declared args schema the server assumes nothing about the payload, and a declared schema owns the whole args namespace (no reserved keys). For the CRUD carriers this means `$insert` args are `{ doc }` with identity stamped from `docID` on both sides (a doc smuggling a different id cannot desync the storage key), `$patch` args are `{ fields, cleared?, inc? }` (`inc` carries relative numeric deltas, path → amount, commutative under replay), and `$remove` args are empty. An address-less mutator call rejects `badArgs`; a `docID` on an action is ignored per the unknown-field posture.

### server → client

**`welcome { protocol, lastCallID, heartbeat, authExpiresIn?, limits?, caps?, actions? }`** — handshake accept. `lastCallID` is the high-water mark over the client's numeric outbox sequence — it comes free from the idempotency ledger, no ack frames (ACKs are a high-water mark, not frames). `heartbeat` is the server's ping interval in ms (reference default 25000) and is **server-final**: a client field requesting an interval at `hello` is named as additive-later at zero cost — unknown-field tolerance already prices it, and `welcome.heartbeat` is already the final word. `authExpiresIn` (ms) announces the server-owned expiry deadline (§4). `limits` advertises **client-actionable limits only** (§2 Limits). `caps` in §8.

**`welcome.actions`** — the optional registration manifest: per callable action, STRUCTURE only — for `args`, and for `returns` when declared, each field's type name, optionality, and nested shape. Structure arms the client's advisory on both halves: args gate pre-send with the server's exact rejection shape (badArgs 4201), and result values revive to their types on arrival — the read half of the same advisory. Value spaces are business information and never ride: no enums, no defaults, no validator logic. A type name the receiving runtime doesn't know degrades that field to a pass-through — the advisory validates (and revives) less, never wrongly; the server stays authoritative. Manifest names are not secrets — gates enforce, obscurity is not a control. (Amendment lineage: the manifest 2026-07-11, the `returns` half with the typed-wire amendment.)

**`rejected { code, reason, retryAfter?, redirect? }`** — handshake refusal, followed by close with the same code. `retryAfter` (ms) overrides client backoff (maintenance, rate limiting). `redirect` is a URL for 4501 try-other-server (MQTT 0x9C/0x9D lineage).

**`ping { authExpiresIn? }`** — server-initiated app-level heartbeat (browser WS exposes no ping API; the server pays for zombies, so the server drives). Carries the auth countdown when expiry approaches, so token refresh rides the keepalive (PowerSync's token_expires_in pattern).

**`auth { ok, expiresIn?, code? }`** — refresh acknowledgment, see client `auth`.

**`reauth { expiresIn }`** — the server's re-auth demand: present a fresh credential within `expiresIn` ms or the connection closes 4101. A first-class, intent-named frame like every frame in the grammar — it never rides `ping` and never overloads `auth` (whose server form is an acknowledgment). The deadline is a server setting defaulting to the remaining `authExpiresIn`. `reauth` is what makes revocation server-drivable rather than client-scheduled: a client that never refreshes cannot outlive the demand *(conformance: `auth-expiry-server-owned`)*.

**`snapshot { channel, docs, sort?, total?, cursor? }`** — full channel state at a position. `docs` is `[{ collection, docs: [...] }]` — channels can span collections, the shape mirrors `delta.changes`. Large snapshots chunk across frames: chunks without `cursor` are partial, the frame carrying `cursor` is terminal (Centrifugo's lesson: never inline a big backlog into one reply). A sorted channel's first chunk declares `sort` (the serialized comparator provenance) and `total` — a snapshot is a known-size artifact, not an open-ended stream, so progressive consumers always know the expected whole (the honest-total machinery; the Meteor-era climbing count is structurally impossible). The client buffers chunks and commits the whole snapshot as one synced-side swap at the channel's `live` — PowerSync's checkpoint/checkpoint_complete bracket, the atomic-apply boundary that makes a torn stream discard-and-retry instead of corruption *(conformance: `snapshot-atomic-commit`)*. Progressive paint is a per-channel opt-in (ruled 2026-06-12): hydrate-from-disk renders per chunk by default; network snapshots stay atomic-commit unless the channel opts in, and the declared `total` is what keeps the opt-in honest.

**`live { channel, cursor, freshness, updatedAt }`** — "you are at the stream head as of cursor." Sent after the terminal snapshot chunk, or after tail replay drains, on every (re)subscribe. This is the catch-up → live edge in the per-channel state machine, the snapshot commit trigger, the sub success ack, and the driver of `subscription.state` (§7). It also carries the **freshness disclosure**: the channel's declared `freshness` contract (`'live'` · a duration · `'manual'`) and `updatedAt`, the stream-head change timestamp — priced staleness without disclosure is just staleness, so the affordance is load-bearing, not optional *(conformance: `freshness-disclosure`)*.

**`delta { channel, cursor, changes }`** — the live path. `changes` is an array of:

```
{ collection, id, op: 'add' | 'change' | 'remove', doc?, fields?, cleared? }
```

`add` carries `doc` (full projected doc — membership entered), `change` carries `fields` (path → value) and/or `cleared` (array of removed paths — the client writes `undefined`, never deletes, per the renderer's snapshot-diff contract), `remove` carries id only (membership left). DDP's added/changed/removed vocabulary, field-granular, extended with path granularity for deep projections.

**Encoded values.** Every schema-typed value crosses every frame in its canonical json-codec encoded form: a Date as its ISO-8601 UTC string, bytes as base64, a bigint as its decimal string, a registered value class as whatever its declared encode emits. This governs `delta` `fields` values, `add` and `snapshot` docs, `call` `args`, and `result` `value` uniformly — no frame ever carries a live class instance, and no frame invents a type tag: encoded JSON is anonymous. Encoding is value-driven at the sending doors (a value announces its type by constructor); decoding is schema-driven at the receiving pool boundary (only the collection schema can name an anonymous form back). Codecs are guard-idempotent — encoding an already-encoded form and decoding an already-typed value are both passthroughs — which is what makes producer-encoded frames and multi-door seams safe by construction *(conformance: `encoded-values`)*.

**Paths are id-addressed for schema-declared keyed arrays.** A path segment addresses a keyed-array element by identity — `items[#r7].amount` — never by position: positional paths do not survive on the wire for declared keyed arrays, because whole-array folding makes every concurrent intra-array edit a silent wholesale clobber, and the arrays are where concurrency concentrates (scenario, Concurrency Model). Element insert travels as a `fields` write whose path is the keyed address carrying the full element; element removal travels through `cleared`, where an id-addressed element clear is the one structural case — it splices the element out (never leaves a hole), and the array itself takes a fresh reference so the renderer's diff sees it. Un-keyed value-lists keep whole-array semantics — common by count, rare by concurrency.

One delta **message** is one transaction's effects on one channel: all changes a tx produced for that channel ride one message, advancing the channel cursor once. Within-channel atomicity is therefore free — a message applies atomically by construction. Cross-channel atomicity is the frame's job (Atomicity, below). A delta from an external writer (CDC) is self-contained and carries no mutation attribution — correctly: nothing pending to confirm.

**`result { id, status, value?, error?, positions?, retained? }`** — call settlement. `status` is `'ok' | 'error'`. `value` is the action return value. `error` is `{ code, message, details? }` — permission/check/run throws surface here with code 4301 and app details. `positions` is the per-channel completion map (Settlement, below): for every channel the call's transaction emitted into, the position its deltas landed at, keyed by channel address. `result` is per-call and never fanned, so the map costs the shared fan-out path nothing.

`retained: false` is the **executed, result unavailable** answer: a replayed call whose outcome the ledger knows settled but whose result value is no longer retained (aged out, or evicted under the result cache's byte budget) still answers `status: 'ok'`, carrying the marker instead of `value`. The frame is never `status: 'error'` — the call did not fail, and an error status would invite the retry that is exactly the double-execution the ledger exists to prevent. Mutator re-acks never degrade this way (they carry no value; a rebuilt re-ack simply omits `positions`, safe because a rebuilt channel's epoch outranks any prior-life position at settle). Client libraries surface the marker as a distinguished error condition marked `executed`, so the callsite reads it honestly (the caller asked for a value and got none) without inviting a blind re-call.

**`reset { channel }`** — mid-stream cursor invalidation: log collapse (bulk writes), retention truncation, slow-consumer valve. The client drops its stored cursor and re-subs without one → snapshot path. Reset is a protocol state, not an error — storage loss, truncation, migration, and backpressure all collapse here (Decision #7). At sub time the server never sends `reset`: a bad cursor is answered directly with `snapshot` (no extra round trip).

**`nosub { channel, code, reason? }`** — subscribe denied (gate denial → 4102, bad args → 4201, inconsistent publication config → 4203, channel cap → 4204) or server-initiated revocation (`server.revoke(channel, args)` → 4202). Revocation is not a new mechanism: it walks the channel's subscriber set — the only per-client state — and emits `nosub` per affected subscriber. On 4202 the client runs the retry-then-prune choreography (§6): one re-auth-and-resubscribe attempt before the channel's projection-union contribution prunes and `subscription.state` settles `denied`.

### Atomicity — the framing guarantee

Every multi-channel mutator is one server transaction emitting delta messages across channels with independent cursors. The atomicity contract is framing, not client machinery:

**Live flow.** On live-state channels — channels whose subscribers are caught up and whose freshness contract is `'live'` — the server MUST pack one transaction's delta messages into **one array frame per socket** *(conformance: `atomicity-packed-frame`)*. The client applies the frame as one unit between scheduler flushes (Apply discipline), so a transaction's effects across channels become visible atomically, by construction, with zero client-held state. There are no hold groups, no spans lists, no timeout valves — v1's client hold machinery is deleted (R2 brief 1: the client provably could not run it, since opaque cursors cannot tell a held frame from one already folded into a snapshot).

**The snapshot carve-out, and the ordering contract that makes it safe.** A channel mid-snapshot folds the transaction's effects into the snapshot: the snapshot is cut at a position at or past the transaction, so its effects arrive inside it. The server MUST honor the snapshot/commit ordering contract — every transaction fanned to a mid-snapshot subscriber is either contained in the snapshot (the cut position is at or past its delta) or delivered after the terminal chunk, never neither — which is exactly what makes the client's discard-at-commit rule (Apply discipline, rule 2) subsume rather than lose: any delta message queued during the snapshot is at or below the cut *(conformance: `snapshot-atomic-commit`)*. A transaction spanning a live channel and a mid-snapshot channel is atomic per boundary — the live channel's messages and the snapshot's commit are each atomic apply units — and the cross-boundary tear is bounded by the snapshot bracket, healed at its `live`.

**Resume.** At resume the server **regroups tail frames by transaction** across the channels in the resume batch: tail entries that share a transaction (the changelog envelope carries the identity) pack into one frame per socket, per-request computation against the resume batch, no per-client state — the stateless-node invariant survives *(conformance: `atomicity-resume-regroup`)*. The resume packed frame is **wire-atomic, not apply-atomic**: at resume each channel commits at its own `live`, so the client applies the packed frame's messages per channel — unlike the live-flow packed frame, which applies as one unit. The regroup buys ordering and framing economy; resume-time cross-channel apply atomicity would resurrect the deleted client hold machinery.

**Scope.** The guarantee is scoped to live-state channels deliberately. A coalesced or `'manual'` channel holds deltas by its freshness contract; recompute channels (search windows) fold many transactions into one diff and carry no attribution. Routed-live, coalesced, and recomputed views of the same write are **eventually consistent with each other** — a semantic, stated, not a defect *(conformance: `atomicity-tier-scope`)*. Cross-channel grouping for its own sake stays deleted: the one workload that genuinely co-displays multiple channels atomically is the composite publication, which is one channel by construction.

### Settlement — own-writes and completion positions

The plan's invariant: your own write never visibly reverts while confirming. Two mechanisms close it end to end (ruled 2026-07-04):

**Own-writes ride live to the writing socket.** Coalescing exempts the writer's own connection per channel: a call's delta messages reach the socket that issued the call before its `result` does (await-before-ack fans at commit, the reply after), whatever the channel's freshness tier. This is the streaming twin of `refresh: 'ownWrites'` — a **timing** exception, never a payload one: the frames are the same shared bytes, serialize-once identity holds, only the delivery schedule differs for the writer *(conformance: `settlement-own-writes-live`)*. With delta-before-result universal, settle-on-result is sound: when the result arrives, the authoritative effects are already applied, and dropping the pending overlay never flickers. This governs the **pushed** tiers (`live` and coalescing durations), whose deltas reach the writer's socket before the result. A non-pushed `'manual'` channel pushes nothing, so its read-your-writes rides `refresh()` instead — the client renders such a window from a **frozen handle result set**, never the live pool, and the writer's own edit appears at the next `refresh()`, not optimistically-then-reverted (the `'manual'` contract: rendered data does not move until you ask). The `ownWrites` tier is `'manual'` with one carve-out — **the subscriber's own writes overlay the frozen set live**: instant at the optimistic apply, held through settle (a non-pushed write's overlay retires only when the settle-refresh snapshot subsumes it, so it never optimistically-then-reverts), reconciled by that automatic refresh. Everyone else's writes stay frozen until a refresh, exactly as `'manual'`. A `'manual'` **publication** (no window handle) defers *delivery*, not content: it announces nothing new until `refresh()`, but its read surface is the shared pool, which legitimately moves under co-resident live channels and the client's own writes — content lock-in belongs to window handles, where `'manual'` lives in practice.

**Completion positions on the result.** `result.positions` maps every **pushing** channel the call's transaction emitted into to the position its deltas landed at. A non-pushed channel (`manual`, `ownWrites`) is deliberately absent: it never pushes the writer's delta, so its applied cursor could never pass a recorded position and the settle would hang forever — its read-your-writes rides `refresh()` (automatic on `ownWrites` settle) instead. The resolution rule: **a call settles when its `result` has arrived AND, for each `positions` entry whose channel the client holds, the channel's applied cursor has passed that position.** Channels the client is not subscribed to are ignored — it cannot and need not wait for them; a call touching zero subscribed channels resolves on `result` alone *(conformance: `settlement-positions-backstop`)*. `positions` discloses the transaction's channel addresses to the caller, so the standing address constraint applies here too: channel args must not carry secrets, and tenant-scoped channels keep transactions single-tenant. The same event drops the pending entry for mutators: v1's "when the txid applies, the pending entry drops" restates as "when the result has arrived and its positions have passed." This is also the action read-your-writes guarantee — `await Orders.approve()` then reading the pool observes the approval, because the await gated on the positions.

**Positions stay opaque; the library orders them.** "Passed" is decided by a protocol-library comparator that orders two positions **of the same channel within the same epoch** — applications never parse a position, and cross-channel ordering is undefined forever (§8 fixed-forever). An epoch mismatch between a held cursor and a result position compares as **unknown**, and unknown resolves through the resnapshot path: the epoch changed, the channel resnapshots, and the fresh snapshot includes the write by construction *(conformance: `settlement-epoch-unknown`)*. This is not v1's rejected cursor vector: that rejection was client-interpreted positions coordinating **across** channels, which stays dead — here the client hands two same-channel tokens to the library and gets an ordering, opacity intact.

### Apply discipline (client)

Wire correctness depends on seven client-side rules — the protocol assumes them, the sync client enforces them:

0. **High-water rejection.** A delta message whose cursor is at or below its channel's applied cursor is a no-op — per message: a packed frame's other messages still apply, and a positional no-op tears nothing since the skipped effects are already present. Redelivery (gap re-subscribe, at-least-once overlap) becomes safe by position, not by value — membership transitions (enter/leave) are not value-idempotent, so position is the mechanism at-least-once actually needs.
1. **Cursor advances only on apply, never on receive.** A queued or buffered message never advances the stored cursor, and the persisted cursor is always consistent with the persisted snapshot — a crash between receive and apply must resume at the last **applied** position, or the client silently skips data it never rendered *(conformance: `resume-cursor-on-apply`)*.
2. **Queued messages discard at snapshot commit and at reset.** Per channel: a message queued while its channel is mid-snapshot discards at the commit — the ordering contract (§2 Atomicity) guarantees the snapshot subsumes it — and a stale message applied after a resnapshot would write older values over newer ones. Messages for other channels riding the same packed frame apply normally (the cross-boundary tear the carve-out already bounds) *(conformance: `resume-queued-discard`)*.
3. **Never apply mid-flush.** Packed frames, snapshot commits, and rebase replays apply only between scheduler flushes, gated through the afterFlush alternation. A delta applied while `isFlushing` breaks the dedup-to-one-rerun guarantee across the flush boundary.
4. **Apply + rebase is one synchronous unit.** Snapshot swap, frame apply, and pending replay run as a single synchronous block outside any flush. No `flush()` calls from inside it, no awaiting mid-replay (peeks would observe intermediate `synced ⊕ pending` states).
5. **Top-level field reference swaps, always.** `fields` apply set-by-path with a fresh top-level reference per touched field — the reconcile snapshot diff is shallow, an in-place deep mutation under the same ref is invisible. Mandatory, not stylistic.
6. **`cleared` writes `undefined`, never deletes keys.** Removed keys slip the renderer's snapshot diff by design — which is why the wire says `cleared` instead of carrying delete semantics. The keyed-element address is the stated exception (§2 `delta`): it splices its element, under a fresh array reference.

Duplicate deltas (overlapping channel projections, replay overlap) are safe by the same layer: apply goes through equality-checked sets, so an identical field value produces no second notify. At-least-once + idempotent receiver, validated down to the reactivity layer.

### Limits

**`welcome.limits` advertises client-actionable limits only** — the numbers a client can act on before the wire refuses it:

```
limits { maxMessageBytes, maxBatchMessages }
```

`maxMessageBytes` bounds one wire frame's payload — and therefore any single message — so the client refuses an oversized call locally with a teaching error before it ever leaves (the content survives in the outbox — the hard-fail conversion rule); `maxBatchMessages` bounds the message objects one array frame may carry, and the client packs outbox batches under it. The resume **sub** frame is exempt from the COUNT cap on both sides — §5 wants it whole (splitting un-packs the resume regroup and tears a straddling transaction) — but never from the frame BYTE caps: a subscription set past the frame byte budget chunks by bytes, and regrouping then scopes per frame (a rare chunk-boundary straddle degrades to a transient tear, where an unbounded frame would refuse the resume outright). Server-side valves — `maxBufferedBytes` (reference default 16MB), log-collapse thresholds, per-connection inbound frame caps, channels-per-connection — stay **unadvertised settings**: they are operator knobs, not client contracts, and advertising them buys nothing a reason code doesn't. All constants are settings with reference defaults; the hobbyist configuration omits `limits` entirely.

A breach surfaces as **`4204 limit-refused`** — on `nosub` (channel-cap breach) and on `result.error` (oversized call; the typed content is retained, settling as a rejection-park, §6) *(conformance: `limits-4204`)*. **The banned move: outbound deltas are never silently size-dropped.** A silently missing delta is undisclosed staleness, the taxonomy's forbidden class — an outbound payload the socket cannot carry converts to the reset valve (log collapse → `reset` → resnapshot), a bounded, disclosed degradation *(conformance: `limits-no-silent-drop`)*.

### Reason codes

| code | name | surfaces |
|---|---|---|
| 4000 | malformed | close |
| 4001 | unsupported-protocol | rejected, close |
| 4002 | too-large | close |
| 4003 | hello-timeout | close |
| 4100 | unauthorized | rejected, close |
| 4101 | auth-expired | auth, close (reauth demand unmet) |
| 4102 | forbidden | nosub, result.error |
| 4103 | principal-changed | auth, close — re-auth presented a different principal (§2 same-principal clause) |
| 4200 | unknown-channel | nosub |
| 4201 | bad-args | nosub, result.error |
| 4202 | denied | nosub — revocation push and refresh re-gate denial; client runs retry-then-prune (§6) |
| 4203 | bad-config | nosub — the publication's declared config is inconsistent for these args (a teaching error, e.g. a bounded channel declared `freshness: 'live'`) |
| 4204 | limit-refused | nosub, result.error |
| 4300 | unknown-call | result.error |
| 4301 | call-failed | result.error (app throw: permission/check/run) |
| 4400 | superseded | close — a newer connection presented the same clientID; best-effort, same-node only (§3) |
| 4500 | shutting-down | close — reconnect normally, any node answers |
| 4501 | try-other-server | rejected, close — honor `redirect` |
| 4502 | slow-consumer | close |
| 4503 | rate-limited | rejected, close — honor `retryAfter` |
| 4504 | idle-timeout | close — heartbeat dead-man evicted a zombie; reconnect normally |

**Transports without a close-code channel carry the code on a final `rejected` frame.** The SSE fallback's stream end has no code slot, so the server writes `rejected { code, reason }` as the stream's last frame before ending it, and the client routes the frame exactly as it routes a ws close code — 4400's do-not-fight above all (without carriage, two fallback-lane clients sharing a clientID supersede each other forever). The saturation shed (4502) is exempt: that consumer is stalled by definition, nothing would flush. A duplicate (a handshake refusal already sent its own `rejected`) routes idempotently.

Codes are terminal-state instructions, not prose: 4001 → `failed`; 4100 → `failed` with or without an auth callback — the handshake re-mints through the callback on every connection, so a 4100 refuses a **freshly-minted** credential and retrying it unchanged is a loop (mid-connection expiry is 4101's, the retryable path); 4101 with an auth callback → `reconnecting` with a fresh token, without one → `failed`; 4103 → fresh handshake; 4400 → do not fight (§3); 4500/4502/4504 → normal backoff; 4501 → redirect; 4503 → `retryAfter`. Code names are document vocabulary — the wire carries only numbers, and code constants in implementations follow their host language's casing. The settle-class mapping — which codes end a write as retry-later and which as discard-forever — is §6's table. Code-table conformance vectors pin every row, including that `4204` has no legal answer under v1's table and that `4203` relocates the config error off `4202`, which v2 reserves for denial *(conformance: `codes-table-vectors`)*.

## 3. Client Connection State Machine

**Independent clients.** Each tab is its own client: its own `clientID`, its own socket, its own outbox and cursors, namespaced IDB. Two tabs converge as two independent clients the layer already handles — there is no leader election, no follower mirroring, no cross-tab socket ownership (the v1 leader/follower model is superseded 2026-06-14: Web Locks releases only on close or crash, never on backgrounding or freeze, so a frozen leader stalls the visible tab). **4400 superseded** is accordingly a **best-effort, same-node duplicate-clientID guard**: a second live connection presenting the same clientID (a cloned profile, a storage-copy accident) closes the older socket when both land on one node; cross-node duplicates are tolerated — the idempotent receiver and the ledger make them safe — and no cross-node connection registry exists.

States and edges:

| from | on | to |
|---|---|---|
| connecting | `welcome` | connected |
| connecting | `rejected` (fatal class) | failed |
| connecting | close, error, or non-fatal `rejected` (4500, 4503) | reconnecting |
| connected | close, error, or heartbeat dead-man (no frame for `heartbeat × 2`) | reconnecting |
| reconnecting | `welcome` | connected |
| reconnecting | 30s of failed retries | offline |
| offline | `welcome` | connected |
| reconnecting / offline | `rejected` (fatal class) | failed |
| failed | app intervention (fresh credential, version fix) | connecting |

- **connecting** — first connection of a session (or recovery from `failed`). No positions assumed.
- **connected** — welcome received. Per-channel catch-up/live runs inside this state (each channel independently in snapshot-buffering, tail-replay, or live).
- **reconnecting** — the blip tier. Retries on full-jitter exponential backoff: `delay = random(0, min(30s, 500ms × 2^attempt))` (AWS full jitter — the thundering-herd answer). The attempt counter resets on a welcome that survives 30s. `rejected.retryAfter` overrides the computed delay. `navigator.onLine === false` parks the timer until the `online` event; `online` and `visibilitychange → visible` short-circuit to an immediate attempt.
- **offline** — the outage tier, entered after 30s of failed reconnection (Pusher's ~30s unavailable precedent). Same retry loop, capped at the 30s ceiling. The distinction is consumer-facing, not mechanical: this is where UI gets loud (§7).
- **failed** — terminal until app intervention: protocol version unsupported, auth refused with no auth callback registered. The only state where disabling inputs is correct (Ably's lesson inverted: with an authCallback, auth expiry never lands here).

**`sync.connection.reason`** carries `{ code, text }` from the last close or rejection, riding the §2 code table — one field, no new states, and the reason a connection is `failed` or `reconnecting` is always legible (error-monitor forwarding is a docs example, not API surface). A `needs-auth` state stays rejected: authCallback routing through `reconnecting`/`failed` covers it, and `reason` makes the why visible.

**In-flight actions reject on connection drop.** An action awaited when the connection drops rejects with a connection error carrying the close code — never silently retried, never left hanging (an unresolved promise is a hung spinner) *(conformance: `actions-inflight-reject`)*. The caller may opt a sent action into surviving the blip: **`maxRetries`** re-sends under the **same id** at each reconnect's welcome, and the ledger's result cache (§4) makes that exactly-once — an action that executed before the drop replays its original result, one that never arrived executes once, and one **still executing** is memoed in flight — the redelivery awaits the single running execution rather than starting a second (the window is exactly `action duration > reconnect latency`, the slow actions whose results blips eat). Default 0 (reject-fast, the bimodal contract). Retry-by-same-id is mechanism, not configuration: a fresh-id manual retry of a non-idempotent action re-executes, which is why the caller-facing knob counts retries rather than minting ids.

Two-tier presentation (research consensus: suppress blips, surface outages): the **status signal is raw truth and flips immediately** on state transitions — bounded by detection, so physical-disconnect-to-known is at worst the `heartbeat × 2` dead-man, and the named hardening that cuts that bound is a client-side probe on unacked calls (an outbox entry unacknowledged for a few seconds while `connected` is itself a disconnect signal — detection only, durability is unaffected); the **root data-attributes apply smoothing** — `data-connection` holds `connected` through blips shorter than 5s (Liveblocks lostConnectionTimeout default), shows `reconnecting` from 5s, `offline` from 30s, `failed` immediately. The attribute enum mirrors the five status values (`connecting | connected | reconnecting | offline | failed`); smoothing is the only difference between the signal and the attribute. Programmatic consumers read truth, pure-CSS consumers get smoothing free.

While `reconnecting`/`offline`: mutators keep applying optimistically and queueing to the durable outbox (inputs stay live — disabling inputs during reconnection is the named anti-pattern for implicit-save UIs). Actions reject fast with a connection error, per the bimodal write contract.

## 4. Server Connection Handling

**State posture.** Per-socket: the subscription set (channel address → subscriber entry), the pinned `ctx.session`, the visibility flag, last-frame-received time. Per-clientID, durable: the outbox watermark (one integer) and the idempotency ledger. Nothing else — no per-client replay buffers, no mergebox, no server-held cursors (the invariant; Ably/Socket.IO recovery buffers are the named anti-pattern: in-memory, unbounded, lost on restart, hard TTL).

### The durable ledger

The idempotency ledger is **named shared infrastructure**: keyed by `clientID` (never by session or connection), persisted beside the changelog **in the write's transaction** on durable adapters, so a call's apply and its ledger row commit atomically — exactly-once acknowledgment without exactly-once machinery. Any node answers any reconnect by reading it. The memory adapter keeps a Map with the stated dev posture: restart forgets the watermark, replays are re-accepted, the double-apply window is documented, not defended.

**The result cache is core, not a capability.** A duplicate `call` id replays the original `result` instead of re-executing — universal retry-safety, for reconnect replays and manual action retries alike *(conformance: `ledger-result-replay`)*. v1 staged this as a `result-cache` capability; v2 promotes it to the mandatory core. The ledger persists **memos, never payloads** — call id, status, timestamp, a failure's error envelope — so it grows only in proportion to work the server already did; result *values* live in a RAM cache bounded by a process-wide **byte budget** (bytes, not call counts: memory is a server constraint and result sizes vary by orders of magnitude; reference default single-digit MB). A replay past the cached value answers `retained: false` (§2 `result`), and rejections rebuild from their memos in full.

**Watermark semantics.** The server processes numeric ids in arrival order; the watermark is the highest id processed, **success or error — rejected calls advance it** *(conformance: `ledger-rejected-advances`)*. An id at or below the watermark is settled: it never re-executes, and the ledger answers it from cache. The dedup guarantee is also the gap rule: a client that withholds an entry while sending later ones (the parking machine, §6) forfeits the withheld id — its slot has been passed — so a later-released entry re-enters the stream under a fresh id. The wire promises dedup-at-or-below-watermark; re-mint discipline is the client parking machine's obligation.

**Failure outcomes survive the trim.** Rejected-call outcomes (id, code, message) are retained for the failure TTL and **cross-checked at reconnect trim**: when `welcome.lastCallID` trims an outbox entry the client never saw settle, the client asks the retained outcomes before treating it as applied — the ask is the **duplicate-call harvest**: re-send each trimmed-but-unsettled id (side-effect-free at or below the watermark) and let the ledger replay its cached outcome; no new frame — a rejected-then-trimmed call surfaces its error and settles as a rejection-park (§6) instead of silently reverting committed-looking work *(conformance: `ledger-trimmed-outcome-crosscheck`)*.

**Retention policy is settings**, each answering a constraint: `ledger.watermarkTTL` must exceed any horizon at which a client may still replay (reference default `'30d'`); `ledger.failureTTL` must be at least the park expiry horizon so a returning client inside the envelope can still learn its rejection (reference default `'7d'`, the horizon's value); the result cache's byte budget bounds success-payload retention (a replay past it degrades to `retained: false`, never silence). Unknown clientID (watermark expired or never existed) → `lastCallID: 0`, replays accepted — the residual double-apply window is vanishingly small against a multi-week watermark TTL, the cheap analog of Replicache's ClientStateNotFound posture.

### Server-side MUSTs

Two conformance obligations no wire transcript can check, stated here so a second implementation inherits them (both are encoded in plan.md and already pinned by suites):

- **Per-doc serial apply.** Update callbacks on a document execute serially against its latest committed state — in-process apply queue on the reference server, `SELECT FOR UPDATE` on relational adapters, the row lock as the queue. A single operation's writes commit atomically. Single-document invariants enforced in an update callback hold under any concurrency; cross-document invariants are out of the mutator contract (needing them is the signal the operation wanted to be an action).
- **Commit visibility.** A committed transaction's deltas MUST become visible in every affected channel log, or the affected channels' epochs MUST change (reset → resnapshot, the existing healer). Single-node this is free by mortality — in-process logs die with the process and the epoch-in-cursor forces resnapshot on restart; it is load-bearing, not luck. On the durable changelog the defense is the **xmin horizon**: replay never serves past an in-flight lower sequence, pinned by a deterministic conformance case. Multi-node, the transactional outbox is the mechanism — the delta record commits in the write's transaction, an at-least-once dispatcher publishes, duplicates die on the idempotent receiver.

**Heartbeats.** Server-initiated `ping` every `welcome.heartbeat` ms. Any client frame counts as liveness; an idle client answers `pong`. No frame within one further interval → close **4504 idle-timeout**, the zombie is evicted (the server pays for half-open TCP, so the server detects it). The client mirrors with the `heartbeat × 2` dead-man in §3.

**Backpressure — reset is the valve, never buffering.** Two detection points, one outcome:

- **Per-channel log collapse**: a channel's pending delta volume crosses the collapse threshold (bulk writes, migrations) → drop the log tail, emit `reset` to subscribers whose cursor fell off the retained tail, clients resnapshot. One bounded payload regardless of how far behind anyone is.
- **Per-socket saturation**: the socket's buffered bytes cross `maxBufferedBytes` (reference default 16MB) → close 4502. The client reconnects through normal resume; channels whose cursors fell out of retention get snapshots at sub time. Per-client buffering beyond the OS socket buffer never happens — a slow consumer costs a close, not memory.

Both paths terminate in the reset → snapshot machine the client already runs for storage loss and migration. No new client states for overload. All thresholds are unadvertised server settings (§2 Limits).

**Auth expiry — the server owns the bound.** `welcome.authExpiresIn` announces the deadline; as it approaches, `ping` frames carry the countdown, and the server may demand early with `reauth`. A server-side expiry timer fires at the deadline regardless of client cooperation: demand unmet → close 4101. The revocation bound is therefore **≤ min(explicit `server.revoke`, `authExpiresIn`)** — a client-scheduled refresh is an optimization on top of the bound, never the bound itself, because a revoked principal who controls the client would simply never refresh. Successful refresh runs the re-gate (§2 `auth`); refresh failure or hard expiry → close 4101; with an auth callback the client reconnects with a fresh token through `reconnecting`, without one it lands in `failed`. Reactive revocation (channels re-evaluating handlers on permission change) stays rejected — the timer plus explicit `server.revoke` bound the urgent cases without it.

## 5. Resume, Boot, and Retention

The reconnect sequence, end to end. No session resumes — only positions continue (all durable progress is client-held: channel cursors and outbox in IDB, or server-derivable: watermark and ledger). Any node answers.

1. **Socket opens** → `hello { protocol, clientID, auth }`.
2. **`welcome { lastCallID, heartbeat, ... }`** (or `rejected` → §3 routing). Heartbeat timers start.
3. **Welcome-trim, split from pending-drop.** Every outbox entry with numeric id ≤ `lastCallID` settled while away: delete from the outbox (stop re-sending), cross-check the ledger's failure outcomes (a rejected-then-trimmed entry surfaces its error, §4) — but **the pending overlays persist until every channel the entry touched reaches `live`** *(conformance: `resume-trim-pending-split`)*. Dropping overlays at welcome re-introduces the forbidden flicker: the authoritative effects only arrive through the tail replay, and the gap between trim and replay would render settled work undone then redone.
4. **Batched subs, first.** One array frame: `sub` per held channel, each with its stored cursor — preceded by a `visibility` re-announce when hidden (§2). Subs go first for fastest screen freshness.
5. **Outbox replay, immediately after** — not gated on sub completion. One array frame of remaining `call`s in seq order — **gated by age**: entries inside the blip window replay blind; aged entries are withheld from this frame entirely, held for verify at their channels' `live`, and only then released — re-entering under a fresh id once later ids have passed the watermark (§4) — or parked, per the outcome vocabulary (§6). Fresh replay racing sub replay is by design: `synced ⊕ pending` re-derives regardless of order.
6. **Per channel, the server answers** one of:
   - **Tail replay**: cursor valid → missed deltas, regrouped by transaction across the resume batch (§2 Atomicity) → `live { cursor, freshness, updatedAt }`.
   - **Snapshot**: cursor expired, epoch mismatch, log collapsed, `retention: 'none'`, or the bytes rule prefers it → `snapshot` chunks → terminal chunk → `live`. The epoch rides inside the opaque cursor (`epoch:offset`, Centrifugo's server-amnesia lesson): wiped logs and restarted offsets surface as a silent snapshot, invisible to the client. No `reset` round trip at sub time — the server answers with the snapshot directly.
   - **`nosub`**: access revoked while away → retry-then-prune (§6).
7. **Results stream back** for replayed calls, resolving or rejecting pending entries through the settlement rule (§2).

**Cursor discipline holds throughout**: the stored cursor advances only on apply (Apply discipline rule 1), and queued frames discard at any snapshot commit or reset (rule 2). A crash between receive and apply resumes at the last applied position — never past data that was received but never rendered.

**Reset-while-outbox-queued.** A snapshot (from reset, resume, or boot) replaces only the **synced** side of the channel's docs. The pending set and outbox are untouched: shadows rebuild against the fresh synced state (first touch stashes the new confirmed version) and pending mutators replay on top. In-flight calls whose effects committed before the snapshot position are already inside the snapshot — their pending replay over it is value-identical, and the equality-checked apply path makes that a silent no-op until the `result` drops the entry. No ordering rule needed beyond the invariant already held: snapshots update synced, pending always replays, the derivation does the rest.

**Boot order is fixed**: hydrate the pool from the IDB snapshot → rehydrate the outbox into the pending set → derive `synced ⊕ pending` → render → then "reconnect" with the snapshot's stored cursors (step 4 onward, unchanged) *(conformance: `boot-order`)*. Painting before the outbox rehydrates renders a world without the user's own queued edits — typed-means-saved inverted — and typing against that stale paint mints racing mutators. Channels report `subscription.state` through the sequence (§7).

### Retention — the cursor and the log are two commitments

The **cursor** is mandatory correctness machinery on every durable channel — gap detection (the taxonomy's disclosure requirement), completion positions, monotonic reads, one opaque token. The **log** is a per-channel economics knob:

```
retention: 'none' | duration        e.g. '5m', '2h' — one word, one grammar, both layers
```

The same key with the same grammar governs the adapter's changelog window and the per-publication knob — an operator thinks in time in both places, and there are **no counts in the vocabulary**. The count's real job (a hard space bound) relocates to an internal adapter safety cap whose overflow degrades resume to snapshot — safe by construction, because the reset valve already makes cursor loss a state, not an error. Changelog rows carry the timestamp a duration prune needs.

`retention: 'none'` answers every resume with a snapshot **directly** — no `reset` round trip, the cursor-expired path that already exists *(conformance: `retention-none-snapshot`)*. It is the right default on a hot per-doc channel: the snapshot is bounded by the document while the tail grows with write rate and absence, so past a short blip replaying costs more than resending the doc. The scenario's own math puts the crossover well inside a normal blip — a 2-minute absence under hot-doc traffic runs ≈ 3,600 tail frames ≈ 700KB against a ~150-200KB snapshot (scenario.md Canonical Load Figures). Hot per-doc channels therefore hold near-zero retention and snapshot at resume, and the `sub`-time bytes rule (§2) picks per resume where a log exists.

### Epoch bumps — migration's wire surface

The wire sees only the semantics: **an epoch bump means resume answers snapshot under the new shape** *(conformance: `epoch-bump-resnapshot`)*. A schema-reshaping migration bumps affected channels' epochs; every held cursor from the old epoch mismatches; every resume takes the snapshot path; nobody parses anything — the epoch lives inside the opaque cursor.

The server surface is **`api.raw.bumpEpoch(target)`**, homed in the raw tier beside `raw.write` and `raw.refreshFields` because migrations are its consumer. Targets are name-shaped: a collection (every channel over it), a channel address (one instance family), or blanket (everything). The old `resetChannels` retires to internal mechanism. Documented beside the migration discipline (plan.md, External Writers): bulk writers are path-granular, batched and paced, and a reshaping migration's epoch bump is what converts "clients hold stale-shaped data" into one clean resnapshot per channel. Stale **bundles** — clients whose code no longer validates against the new shape — get a reload affordance riding `welcome.caps` (§8), never mysterious rejections.

## 6. Outcome Classes — the Park/Rejection Vocabulary

Defined once, consumed twice: by park-then-verify (the aged-replay machine — its gates capture evidence at optimistic apply, withhold aged entries from the resend, verify at `live`) and by the auth-rejection class (permission revoked while away — the conflict/park joint in permissions-and-accounts.md). One vocabulary, so a rejected write settles identically whether the rejector was a validation rule, a permission gate, or a verify mismatch.

**Two outcome classes.** Every failed or deferred write ends in exactly one:

- **retry-later** — transient; the call as written may still succeed. The system retries on its own schedule; content never surfaces as lost. Connection drops, rate limits (4503 + `retryAfter`), reauth-in-progress.
- **discard-forever** — the call as written will never succeed; retrying unchanged is a lie. Validation failures, permission denials, business-rule rejections. Discard-forever never means silent discard — it means the write stops retrying and **parks**: content retained, surfaced, recoverable.

**The settle taxonomy.** A parked entry lands in one of three classes:

- **evidence-park** — verify found the base moved: a per-path mine/base/theirs diff, field-routed like validation. The verify machine's own verdict, no wire involvement.
- **rejection-park** — the server rejected the call: `result.error` settled a replayed or live entry as discard-forever. Validation-shaped, content retained, edit-and-retry. This is the class that replaces v1's silent overlay drop — typed work never evaporates on rejection *(conformance: `park-rejection-classes`)*.
- **age-park** — no obtainable fresh state to verify against (channel unsubscribed, path unprojected): conservative, held for explicit confirm.

**The resend-gate states map onto the vocabulary**: an outbox entry is **sent** (fresh, inside the blip window), **withheld** (aged, awaiting verify at `live` — never offered to the server, across any number of welcomes), or **parked** (one of the three classes above — never sent). Release from either withheld or parked re-enters the stream under a fresh id whenever later ids have passed the watermark — the §4 rule: a withheld id is forfeited the moment a later entry is sent.

**Reason-code settle mapping**:

| code | class | settles as |
|---|---|---|
| 4102 forbidden (result.error) | discard-forever | rejection-park — the auth-rejection instance: permission revoked while away |
| 4201 bad-args (result.error) | discard-forever | rejection-park |
| 4204 limit-refused (result.error) | discard-forever | rejection-park — content retained, edit to fit |
| 4300 unknown-call | discard-forever | rejection-park — the stale-bundle case; pair with the reload affordance (§5) |
| 4301 call-failed | discard-forever | rejection-park — validation and business rules |
| 4503 rate-limited | retry-later | never parks; honor `retryAfter` |
| connection drop (actions) | retry-later | caller's manual retry, safe under the result cache (§4) |

**Revocation prune is retry-then-prune** (ruled at 90). On `nosub 4202` the client makes **one** re-auth-and-resubscribe attempt before the denied channel's projection-union contribution prunes — a transient denial during a blip must not cut a user out of data they still hold, and immediacy buys theater, not security: the server has already stopped sending, and the client-held cache was never revocable. A confirming denial prunes — 4202 from a revocation push, or **4102** from the retry's resubscribe (the fresh-join gate denial, the code the reference server answers): the channel prunes, `subscription.state` settles `denied` *(conformance: `park-revoked-retry-then-prune`)*. A later re-grant repopulates by snapshot through an ordinary resubscribe. What to do with already-delivered documents in local caches is **app-space policy**, stated as such — the protocol's obligation ends at "stop holding, disclose why."

## 7. Consumer Surface

First-class, not an afterthought: the threat model is implicit-save UIs where typing is saving. There is no Save button to gray out, so a severed link must be loud, ambient, and structurally hard to lose work under. The mechanics above make work durable (outbox in IDB, replay on reconnect); this surface makes the state legible. Signals throughout — auto-unwrapping in templates, ambient registration in reactions.

### Connection

```js
import { sync } from '@semantic-ui/sync'

sync.connection.status         // 'connecting' | 'connected' | 'reconnecting' | 'offline' | 'failed'
sync.connection.isConnected    // computed boolean
sync.connection.reason         // { code, text } from the last close/reject — why, always legible
sync.connection.lastConnectedAt
sync.connection.nextRetryAt    // Date | null — drives "retrying in 3s…" countdowns
sync.connection.attempts
sync.connection.ensure()       // wake liveness check — force a probe/reconnect now (tab wake, resume)
```

### Writes

```js
sync.writes.status             // 'idle' | 'saving' | 'saved' | 'error'
sync.writes.pending            // outbox + in-flight count — the badge number
sync.writes.oldestPendingAt    // queue age — "unsaved for 4m" warnings
sync.writes.lastSavedAt
```

Per-write settlement is three states on the handle: **`saving`** until the entry's IDB outbox transaction commits, **`saved`** after — locally durable, replay-guaranteed, whether or not the server has been reached — and **`ok`** on server confirm (the settlement rule, §2). The ambient enum derives: `error` > `saving` (any entry pre-durability) > `saved` (all pending entries durable) > `idle` (pending = 0). `saved` beside a pending count is therefore honest — it asserts local durability, not server confirmation, and the optimistic apply stays synchronous (awaiting IDB on the input path is a human-scale cost for a sub-perception window; a pagehide flush drains pending appends so navigation and reload never meet the residual). `saved` displays at least 1s (`smooth: 1000`) so the badge doesn't strobe under keystroke-granular mutators. `error` means a pending entry was rejected — surfaced once, ambient, never per-field (per-field save indicators get misread as validation); the rejected content itself is in the parked surface (§6), not lost.

### Per-channel state

Subscription handles scope degradation to the data that is actually degraded — a stale chat panel should not dim the settings form.

```js
const sub = subscribe('landings.byId', () => ({ id }))
sub.state       // 'loading' → 'stale' → 'current' → 'denied'
sub.freshness   // the channel's declared contract: 'live' | duration | 'manual' (from the live frame)
sub.updatedAt   // stream-head change timestamp — the staleness affordance's raw material
```

`state` runs `loading` (no `live` yet — initial data incomplete), `stale` (disconnected past the 5s grace, `reset` pending, or behind the declared freshness), `current` (at the stream head as of the last `live`), and `denied` (confirmed 4202 after retry-then-prune, §6). The v1 handle surface (`ready`/`stale`/`lastDeltaAt`) collapses into this triple — `state` carries readiness and staleness, `updatedAt` the change time. The freshness disclosure is what keeps priced staleness honest: a `'manual'` dashboard renders its `updatedAt` age **and its docs from the handle's frozen result set (not the live pool), so priced staleness covers the content shown, not just the age label**, and the affordance is a named deliverable, not an implied one. A derived per-channel pending count stays bench-deferred (§9, Q5).

### Pure-CSS degradation

The framework writes two attributes on `document.documentElement`, smoothed per §3 so CSS consumers never see sub-5s blips:

```
data-connection = connecting | connected | reconnecting | offline | failed
data-sync       = idle | saving | saved | error
```

Attributes over classes: one attribute swap per transition, the enum is exhaustive, and selectors read as state-machine predicates. Regions declare their dependency declaratively:

```html
<section data-sync-requires="live">   <!-- meaningless without live data: presence, viewers -->
<form data-sync-requires="writes">    <!-- degrades only when writes cannot eventually apply -->
```

```css
:root[data-connection='offline'] [data-sync-requires='live']  { opacity: .5; pointer-events: none; }
:root[data-connection='failed']  [data-sync-requires]         { opacity: .5; pointer-events: none; }
```

`live` regions degrade at `offline` (their content is the connection). `writes` regions degrade only at `failed` — the one state where queueing is a lie. In `reconnecting`/`offline`, forms keep accepting input: mutators apply optimistically, the outbox holds them durably, the ambient badge tells the truth.

### Lost-work guard

The guard is honest about its coverage: `beforeunload` fires on tab and window close, **not on lid-close or suspend** — suspend-safety rests on outbox durability plus the pagehide flush, not on any prompt. It attaches only while `sync.writes.pending > 0` and detaches at zero — dynamic registration preserves bfcache eligibility; `pagehide`/`visibilitychange → hidden` force-commit any in-flight outbox batch, closing the suspend window. The outbox survives the tab regardless (IDB-durable, replays next visit); the prompt exists because "I closed the tab" must not silently mean "my last keystrokes reach the server next Tuesday." SPA-internal navigation needs no guard. Opt-out: `guardUnload: false`. Two further hardenings ride the client build: `navigator.storage.persist()` requested while writes are pending, and an outbox-exists tombstone in a second store so storage eviction is detected and disclosed — never mistaken for a fresh client.

### Dev-mode disconnect overlay

Dev builds render a non-blocking corner overlay when the sync server drops: status, attempt count, `nextRetryAt` countdown (Vite's `server connection lost` register). It verifies liveness before clearing (a `welcome`, not a TCP connect — confirm the server is actually serving before declaring recovery), and never blocks the page: the app keeps running on pool data, which is itself the offline-tolerance demo. Past 10s of outage the overlay turns playable — a one-canvas paddle game against the reconnect timer (the Chrome dino precedent). Dev-only, tree-shaken, zero bytes shipped.

## Ephemeral Channels — the True-Realtime Tier

The third timescale on the wire (plan.md, Ephemeral Collections): presence, live
cursors, typing — state where staleness is the only sin and history is anti-valuable.
An ephemeral channel has **no cursor, no log, no replay, and no persistence**: the
server holds a latest-per-key conflation map per channel instance, and delivery is a
coalesced tick, not a per-write fan. Everything below is the additive frame family the
`ephemeral` capability negotiates; the durable contract (§2-§5) is untouched.

**The fan frame.** One frame per channel per tick:

```json
{ "type": "ephemeral", "channel": "cursors.byBoard?{...}", "set": { "<key>": { ...fields } }, "gone": ["<key>"] }
```

- `set` maps each dirty key to its **full latest source fields** — absolute state, not
  a delta. A receiver replaces its copy of the key wholesale; there is no position to
  order by and no gap to detect, because conflation already made delivery
  latest-wins. `set` and `gone` are disjoint within a frame.
- `gone` lists keys removed since the last tick — explicit removal, connection death,
  or staleness expiry. A receiver drops its copy.
- Both halves are optional; a frame carries whichever the tick produced. Fields are
  plain JSON (encode value-driven, decode schema-driven — the same wire-revival rule
  every frame follows); server bookkeeping (owner, freshness stamps) never rides the
  wire.

**The join.** Subscribing to an ephemeral channel is answered by an `ephemeral` frame
marked **`replace: true`** carrying the complete map (`set` = every live key, sent
even when empty), and readiness rides it — there is no `snapshot`/`live` choreography
and no cursor in the `sub` frame. The marker is MANDATORY on the frame answering a
subscribe *(conformance: the join-marker assertions in the forward-compat case)* — it
is the version-skew defense the choreography rests on. Frames marked `replace` carry
the complete set: the receiver's copy of the channel converges to `set`, absent keys
evict, and **replace frames omit `gone`** (any `gone` on one is ignored — a composing
sender must not evict what the same frame delivers). Frames without the marker
**merge** their `set`/`gone`, and tick frames never carry it — so a live frame
already in flight across a resubscribe merges harmlessly, and the receiver never has
to guess which inbound frame answers its sub.
Resume after any disconnect is a fresh map, never a replay; `subscription.state` runs
`loading` then `current`, never `stale` — without a cursor there is nothing to be
stale relative to, and a refresh or wake resubscribe keeps the sub `current` while its
fresh map is in flight.

**The write carriage.** Ephemeral writes ride the existing `call` frame in a
**no-result form**: `{ "type": "call", "name", "docId", "args" }` with **no `id`** —
fire-and-forget has nothing to ack, so the call allocates no ledger entry, no
idempotency memo, and no `result` frame. `docId` is the key. The server runs the
normal operation gates (permission, args, validate/coerce) and lands the write in the
map; a refused write is disclosed server-side, never answered on the wire. Writes
while disconnected are **dropped, never queued** — replaying a stale cursor move is
the ghost-animation failure this tier exists to delete.

**Single-writer-per-key.** A key is owned by the connection that writes it; a write to
another live connection's key is refused. A new connection presenting the **same
clientID** supersedes its predecessor's ownership immediately (the reconnect reclaim —
recovery is instant, not an idle-timeout wait). Multi-device presence is multiple keys
by construction, never multiple writers of one key — this is what makes cross-node
carry a blind per-key overwrite with no CRDT.

**Delivery discipline.** The tick is the collection's **declared `cadence`**:
`'standard'` (the 30Hz presence envelope, the default), `'animated'` (the 60fps
cursor tier), or a number in Hz for authors who build around their own loop — the
author states the collection's physics, and the declaration is what any future load
management protects by stated need. The server coalesces outbound per channel on
that declared tick and **conflates under backpressure**: a slow consumer's
undelivered frame is replaced (merged latest-per-key), never queued. Delivery counts
are therefore not part of the contract — only convergence is. Fan-out skips hidden
connections (visibility metadata, §2) and skips the writer's own keys (the writer's
local apply is its own truth; an echo is a feedback loop).

**Expiry.** Key lifetime is **liveness-scoped**: `lifetime: 'connection'` keys (the
default) leave the map when the AUTHOR's connection dies (the removal fans as
`gone`), and duration-form keys (`lifetime: '30s'`) additionally expire when not
refreshed within the duration — the staleness TTL, which also reaps the keys of a
throttled or frozen tab whose connection never cleanly died.

**Capability staging.** The frame family activates per connection via the `ephemeral`
capability (`hello.caps` / `welcome.caps`). The server MUST NOT send `ephemeral`
frames to a connection that did not declare it, and MUST refuse that connection's
subscribe to an ephemeral channel with a `nosub` naming the missing capability — a
loud denial, never a silently idle channel. A client that does not speak the tier
keeps its full §8 tolerance behavior *(conformance: `forward-compat-ephemeral`)*.

**Transports.** The tier is push-only. A stateless poll transport MUST refuse an
ephemeral publication loudly — never serve an empty snapshot in its place, which
would be precisely the silently-idle channel the staging rule forbids. The refusal
SHOULD name the tier (the poll-shaped analog of the capability `nosub`); a
publication whose collection is only knowable once a channel has been built MAY
refuse generically until then. What it must never do is serve.

## 8. Protocol Evolution

**Version negotiation.** `hello.protocol` is the highest version the client speaks; the server replies `welcome.protocol` with the version it will speak (≤ client's). No overlap → `rejected 4001` with `reason` naming the supported range. One integer, no semver — breaking changes bump it, everything else rides capabilities.

**Version-skew policy.** The reference server speaks **N and N−1** — one integer back. The N−1 window opens at the first public release: v1 never shipped, so the v2 reference implementation is v2-only until v3 exists. Clients send their highest, `welcome` downgrades, and **the server deploys first**: incorrect deploy order is the named downtime cause, and the expand/contract deploy-order quick-reference is a reference-server doc page.

**Unknown-message tolerance.** Within a major version: unknown `type` is ignored, unknown fields in known types are ignored, both sides. New server pushes degrade silently against old clients, new client fields degrade silently against old servers. Dev builds log what they drop. This is what makes capabilities cheap.

**The `ephemeral` frame.** The type name `ephemeral` — reserved here since the freeze
for the true-realtime tier (presence, cursors, typing — no cursor, no log, no replay,
conflated under backpressure) — is now defined (§ Ephemeral Channels), staged as the
`ephemeral` capability. Unknown-type tolerance keeps it purely additive, and the
forward-compat behavior pinned at reservation time still binds: a v2 client MUST
silently ignore `ephemeral` frames it does not speak *(conformance:
`forward-compat-ephemeral`)*.

**Capability flags.** `hello.caps` / `welcome.caps`, string arrays; the intersection is active. The core message set (§2) is mandatory and never cap-gated. Capabilities are additive behaviors negotiated per connection — candidates: `encoding:msgpack` (the pluggable wire encoding), `compress:permessage-deflate` policy, `redirect` (4501 handling), `ephemeral` (once its schema lands). The result cache is **not** here — v1 staged it as a capability, v2 makes it core (§4). `caps` also carries the app's schema/bundle version token, which is how a stale bundle learns to surface a reload affordance (§5) instead of collecting mysterious rejections. A capability every implementation ends up requiring graduates into the next protocol version — caps are the staging area, the version is the contract.

**What is fixed forever** (the spec/pluggable split, restated as evolution policy): **cursor opacity** — cursors and positions are opaque to applications and unordered across channels; the protocol library orders same-channel, same-epoch positions, and nothing else, ever — the catch-up/live state machine, reset-as-state, at-least-once + idempotent receiver, and **the framing guarantee** (one frame per transaction per socket on live-state channels). These are load-bearing for every implementation; no capability may weaken them.

## 9. Review-Question Dispositions

v1 §8 left ten open questions; its referee pass closed with the same synthesis list. Every one exits explicitly — resolved with the section that resolves it, or re-deferred with a named owner. None exits silently.

| # | question | disposition |
|---|---|---|
| 1 | Canonical args beyond plain JSON | **Resolved, §1** — args are wire-plain by construction: schema revival happens above the address, stated not assumed, pinned by address-derivation vectors. |
| 2 | Watermark + ledger durability policy; result-cache core or capability | **Resolved, §4** — the durable ledger keyed by clientID in the write's transaction, TTLs as settings with named constraints, unknown-clientID posture stated, and the result cache promoted to core. |
| 3 | Tx-hold timeout interactions | **Mooted** — the hold machinery no longer exists. Server-side regrouping (§2 Atomicity) deleted the hold, its timeout, and the gap-resubscribe interaction with it. |
| 4 | Progressive snapshot paint | **Resolved by the progressive-paint ruling (2026-06-12, plan.md Protocol Sketch)** — hydrate renders per chunk; network snapshots stay atomic-commit by default with progressive as a per-channel opt-in whose first chunk declares `sort` + `total` (§2 `snapshot`). |
| 5 | Per-channel pending counts | **Re-deferred to its bench** — derivable from pending set × channel membership; the derivation is benched before the handle promises it. |
| 6 | Smoothing constants (5s grace, 30s offline, 1s saved) | **Re-deferred to the 0a edge-state pages** — research-derived defaults ship as settings; the reconnect-feel and reset-moment pages validate before freezing. |
| 7 | Batch frame limits | **Resolved, §2 Limits** — `welcome.limits` advertises `maxMessageBytes` + `maxBatchMessages` (client-actionable only), server valves stay unadvertised settings, 4204 minted. |
| 8 | Revocation UX — prune immediately or after re-auth | **Resolved, §6** — retry-then-prune (ruled at 90): one re-auth-and-resubscribe attempt, then the confirmed denial prunes with `subscription.state: 'denied'`. |
| 9 | Heartbeat floor/ceiling — client-requestable? | **Resolved, §2 `welcome`** — heartbeat is server-final; a hello request field is named additive-later at zero cost. |
| 10 | Conformance suite shape | **Resolved** — [`ws-protocol-conformance.md`](ws-protocol-conformance.md) lists every case this spec cites with its gate mapping, and carries the ruled harness: the hybrid — vectors-as-data for the pure derivations, a live driver for choreography, one battery per registered transport. |

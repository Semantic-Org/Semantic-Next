# Sync Protocol v1 — Wire Design

Extends [`plan.md`](plan.md) (Protocol Sketch, Sync Loop, Channels). This is the Tier 1.3 deliverable: the spec the weekend-portability test runs against. Everything here preserves the plan's spine — opaque monotonic client-held cursors with epoch inside, at-least-once + idempotent receiver, reset as the universal pressure valve, leader-tab single socket, txid atomicity, `synced ⊕ pending` re-derivation. Where the plan flagged holes (result cursor across channels, duplicate-sub refcounting, reconnect batching, reset-while-outbox-queued, backpressure), this document resolves them. Where the reactivity review imposed timing constraints (no mid-flush apply), this document encodes them as client apply discipline.

Lineage shorthand used throughout: Centrifugo (epoch/offset recovery), Replicache/Zero (cookie + lastMutationID + poke brackets), PowerSync (checkpoint apply boundary), MQTT 5 (reason codes, at-least-once), graphql-ws (close codes, init gate), DDP (field-granular change vocabulary, versioned hello). Rejected as lineage: Ably/Socket.IO server-held replay buffers (a mini-mergebox), graphql-ws's server-tracked subscription registry (no resume), MQTT durable sessions (server-held queues).

## 1. Wire Framing

**Encoding.** JSON text frames, UTF-8. One WebSocket frame carries either a single message object or an array of message objects. An array frame is semantically identical to sending its elements as sequential frames — order preserved, processed in order. This is the reconnect-batching answer (plan hole): N resumed subs ride one frame, the outbox replays as one frame, and the server packs one transaction's multi-channel deltas into one frame per socket so txid sets arrive adjacent. Centrifugo batches the same way (newline-delimited commands in its JSON transport); arrays are the JSON-native equivalent.

**Discrimination.** Every message carries `type`. Receivers MUST ignore messages with unknown `type` and unknown fields within known types (forward compatibility, see §7). Dev builds log ignored messages, production drops them silently.

**Correlation.** Three correlation spaces, never shared (Zero's lesson: sync and mutations never share correlation state):

- **Connection** — `hello`/`welcome`/`rejected`/`auth`/`ping`/`pong` correlate implicitly (at most one handshake in flight, ping/pong are stateless).
- **Channel** — `sub`/`unsub`/`snapshot`/`delta`/`live`/`reset`/`nosub` correlate by channel address (below). No request ids: the channel address is the conversation.
- **Call** — `call`/`result` correlate by `id`, the idempotency key.

**Channel address.** Channels are shared per `(name, args)` (plan invariant), so both sides must derive the same instance key. The wire `channel` field is the canonical address: `name` when args are empty, otherwise `name + '?' + JCS(args)` where JCS is RFC 8785 canonical JSON (lexicographically sorted keys, minimal number forms, no whitespace). The client computes it locally for refcounting before the server ever sees the sub; the server computes it for instance sharing and serializes each delta once per channel, fanning identical bytes to every subscriber — the 500-subscriber economics in the plan depend on no per-subscriber fields in fan-out frames. `sub` carries `args` as a parsed object alongside the address so handlers receive structured args without re-parsing; the server derives the address from `(name, args)` itself and treats the client's string as advisory.

**Versioning.** `hello.protocol` and `welcome.protocol` are integers. v1 is `1`. Negotiation in §7.

**Reason codes.** One numeric vocabulary for `rejected.code`, `nosub.code`, `result.error.code`, and WS close codes — MQTT 5's single-table lesson, sized 4000–4999 so any code is a legal WS close code (graphql-ws lineage). Full table in §2. The server can drive client behavior with one number: retry, redirect, re-auth, give up.

## 2. Message Schema

### Inventory

```
client → server
  hello    { type, protocol, clientID, auth?, caps? }
  auth     { type, token }
  pong     { type }
  sub      { type, channel, name, args?, cursor? }     cursor omitted = need snapshot
  unsub    { type, channel }
  call     { type, id, name, args }

server → client
  welcome  { type, protocol, lastCallID, heartbeat, authExpiresIn?, caps }
  rejected { type, code, reason, retryAfter?, redirect? }
  ping     { type, authExpiresIn? }
  auth     { type, ok, expiresIn?, code? }
  snapshot { type, channel, docs, cursor? }             cursor present = terminal chunk
  live     { type, channel, cursor }                    caught up to stream head
  delta    { type, channel, cursor, txid?, spans?, changes }
  result   { type, id, status, value?, error?, txid?, spans? }
  reset    { type, channel }                            cursor expired mid-stream, resubscribe
  nosub    { type, channel, code, reason? }             subscribe denied or revoked
```

Additions over the plan's sketch: `live` (catch-up boundary), `nosub` (the plan's "throw → nosub" made concrete, doubling as the revocation push), `auth` (mid-connection token refresh), snapshot chunking, and the txid/spans envelope on `delta`/`result`. The plan's `method` message is named `call` on the wire — both mutators and methods ride it, the wire does not distinguish (deltas route by changed doc, not by declaration).

### client → server

**`hello { protocol, clientID, auth?, caps? }`** — first message after socket open, nothing else accepted before it (graphql-ws init gate, close 4003 on timeout). `clientID` is a `crypto.randomUUID()` minted by the leader tab on first run, persisted in IDB beside the outbox — identity outlives connections (Replicache lineage). `auth` is the session credential, arriving at the handshake and flowing into both auth gates as `ctx.session` (plan: session is outside the protocol proper). `caps` is a string array (§7).

**`auth { token }`** — mid-connection credential refresh. Subscriptions, cursors, and in-flight calls are untouched (Centrifugo refresh lineage: positions survive re-auth). Server replies `auth { ok: true, expiresIn }` or `auth { ok: false, code }` then closes 4101.

**`pong {}`** — answers a server `ping`. Any frame counts as liveness, `pong` exists for otherwise-idle connections.

**`sub { channel, name, args?, cursor? }`** — subscribe or resume. `channel` is the canonical address, `name`/`args` the structured form the handler receives. `cursor` is the client's stored opaque position: omitted means need snapshot, present means tail replay if the server can serve it, snapshot otherwise — the server decides per channel, the client never interprets the cursor (Decision Record #7). Keyset window bounds (`before`, `limit`) ride inside `args` like any other arg; load-more is a fresh `sub` for the next window's address. Search channels re-subscribe overlap-then-swap: the new args produce a new address, so old and new are simply two concurrent subs, no wire support needed — `unsub` the old after the new channel's `live`.

Duplicate-sub refcounting (plan hole, resolved): refcounting is entirely client-side, keyed by channel address. First reference sends `sub`, last unreference sends `unsub`, with an optional `linger` grace (default 0) so route flips don't thrash sub/unsub on the same channel. The server holds no refcounts — its per-socket sub set is a set. A `sub` for an already-subscribed address on the same connection is not an error: the server treats it as a resume request and answers from the supplied cursor (idempotent re-sub, also the client's cursor-correction path). graphql-ws closes the socket on duplicate ids (4409); rejected as needlessly fatal.

**`unsub { channel }`** — fire-and-forget, no ack. The server stops sending and drops the subscriber entry. Frames already in flight may arrive after; the client ignores frames for channels it no longer holds (at-least-once posture).

**`call { id, name, args }`** — the only write vehicle on the wire. No generic document-mutation message exists by construction (the no-allow/deny invariant: you authorize operations, not edits). `id` is the idempotency key, deduped by the server ledger. Two id forms by kind:

- **Outbox calls (mutators)**: `id` is a JSON number — the durable outbox sequence, monotonic per clientID, persisted beside the entry. Numeric ids participate in the `lastCallID` watermark (Replicache lastMutationID semantics: applied in order per client, anything at-or-below the watermark is settled, re-send is a no-op).
- **Method calls**: `id` is a string UUID. Methods reject fast when disconnected and are never replayed from the outbox, so they need dedup (the ledger) but not ordering (the watermark). The id type carries the kind with zero extra fields.

### server → client

**`welcome { protocol, lastCallID, heartbeat, authExpiresIn?, caps }`** — handshake accept. `lastCallID` is the high-water mark over the client's numeric outbox sequence — it comes free from the idempotency ledger, no ack frames (plan: ACKs are a high-water mark, not frames). `heartbeat` is the server's ping interval in ms (default 25000, Centrifugo's default). `authExpiresIn` (ms) tells the client when to schedule a refresh.

**`rejected { code, reason, retryAfter?, redirect? }`** — handshake refusal, followed by close with the same code. `retryAfter` (ms) overrides client backoff (maintenance, rate limiting). `redirect` is a URL for 4501 try-other-server (MQTT 0x9C/0x9D lineage: the server steers reconnection with one field).

**`ping { authExpiresIn? }`** — server-initiated app-level heartbeat (browser WS exposes no ping API; the server pays for zombies, so the server drives). Carries the auth countdown when expiry approaches, so token refresh rides the keepalive (PowerSync's token_expires_in pattern).

**`auth { ok, expiresIn?, code? }`** — refresh acknowledgment, see client `auth`.

**`snapshot { channel, docs, cursor? }`** — full channel state at a position. `docs` is `[{ collection, docs: [...] }]` — channels can span collections, the shape mirrors `delta.changes`. Large snapshots chunk across frames: chunks without `cursor` are partial, the frame carrying `cursor` is terminal (Centrifugo's lesson: never inline a big backlog into one reply). The client buffers chunks and commits the whole snapshot as one synced-side swap at the channel's `live` — PowerSync's checkpoint/checkpoint_complete bracket, the atomic-apply boundary that makes a torn stream discard-and-retry instead of corruption.

**`live { channel, cursor }`** — "you are at the stream head as of cursor." Sent after the terminal snapshot chunk, or after tail replay drains, on every (re)subscribe. This is the catch-up → live edge in the plan's per-channel state machine, the snapshot commit trigger, the sub success ack, and the consumer-surface `ready`/`stale` driver (§6). Zero's pokeEnd and PowerSync's checkpoint_complete collapsed into one frame.

**`delta { channel, cursor, txid?, spans?, changes }`** — the live path. `changes` is an array of:

```
{ collection, id, op: 'add' | 'change' | 'remove', doc?, fields?, cleared? }
```

`add` carries `doc` (full projected doc — membership entered), `change` carries `fields` (path → value, deep paths per the projection contract) and/or `cleared` (array of removed paths — the client writes `undefined`, never deletes, per the renderer's snapshot-diff contract), `remove` carries id only (membership left). DDP's added/changed/removed vocabulary, field-granular as the plan requires, extended with path granularity for deep projections.

One delta frame is one transaction's effects on one channel: all changes a tx produced for that channel ride one frame, advancing the channel cursor once. Within-channel atomicity is therefore free — a frame applies atomically by construction. `txid`/`spans` handle the cross-channel case (next section). A frame without `txid` is self-contained and applies alone (single-channel transactions and CDC events from external writers, which correctly carry no mutation attribution — nothing pending to confirm).

**`result { id, status, value?, error?, txid?, spans? }`** — call settlement. `status` is `'ok' | 'error'`. `value` is the method return value. `error` is `{ code, message, details? }` — permission/check/run throws surface here with code 4301 and app details. `txid`/`spans` describe the deltas the call emitted, if any (next section). Note the field change from the plan's sketch: `result` carries **no cursor**.

**`reset { channel }`** — mid-stream cursor invalidation: log collapse (bulk writes), retention truncation, slow-consumer valve. The client drops its stored cursor and re-subs without one → snapshot path. Reset is a protocol state, not an error — storage loss, truncation, migration, and backpressure all collapse here (plan Decision #7). At sub time the server never sends `reset`: a bad cursor is answered directly with `snapshot` (no extra round trip).

**`nosub { channel, code, reason? }`** — subscribe denied (handler throw → 4102, bad args → 4201) or server-initiated revocation (`server.revoke(channel, args)` → 4202, the plan's v1 revocation answer). On revocation the client drops the channel, recomputes the projection union, and prunes — same path as a local unsub, pushed from the server.

### Cross-channel atomicity — txid + spans

The plan mandates: every multi-collection method is one server transaction emitting deltas across channels with independent cursors, txid on deltas, client holds application until the set is complete. The completeness question — how does the client know it has the whole set without per-client server state? — is answered by `spans`.

`spans` is the global list of channel addresses a transaction emitted into. It is a property of the transaction, not of the recipient, so it serializes once and fans as shared bytes (per-client filtering would break the one-serialization economics and is rejected). It is omitted from a delta when the tx touched only that one channel (`spans` defaults to `[channel]`), so the common case pays zero bytes.

Client hold rule: on receiving a delta with `txid`, intersect `spans` with the local subscription set. Hold the group until a frame for that `txid` has arrived from every spanned channel the client is subscribed to, then apply the whole group as one unit. Channels in `spans` the client is not subscribed to are ignored — it cannot and need not wait for them. While a tx group is held, later frames on its spanned channels queue behind it (per-channel apply queues preserve per-channel causal order); unrelated channels flow freely.

Two release valves:

- **Reset substitution.** If a spanned, subscribed channel emits `reset` before its frame arrives, the pending resnapshot stands in for the missing frame: the snapshot is taken at a position at or past the tx, so its effects arrive inside it. The held group applies together with that channel's snapshot commit, atomicity preserved.
- **Hold timeout.** The server emits all of a tx's frames in one fan-out pass (and SHOULD pack them into one array frame per socket), so a missing sibling is a fault, not a race. After a bounded hold (default 10s) the client treats it as a gap: resubscribe the missing channel with its stored cursor, which re-delivers the frame. Self-healing, no operator path.

### Resolved hole — result cursor: txid subsumes it

The plan flagged (Tier 1.3): method promises resolve "when deltas apply locally," but cursors are per-channel and methods touch many channels including unsubscribed ones — `result` needs a cursor vector for subscribed channels, or txid subsumes it. **Decision: txid subsumes it. `result` carries `txid` + `spans` and no cursor.** Three reasons:

1. **A cursor vector breaks cursor opacity.** To know a position has been "passed," the client must order cursors — but cursors are opaque by invariant (Decision #7), and equality-watching the exact value fails too: reset and log collapse mean the exact cursor may never be observed. Any vector design ends with the client interpreting cursor internals, which is the one door the protocol must keep shut (it is what lets cursor = Redis stream id or ring offset interchangeably).
2. **Spans covers unsubscribed channels; a vector cannot.** A vector only ever lists subscribed channels, computed per-client at reply time. `spans` is global, intersection happens client-side, and a method touching zero subscribed channels resolves on `result` alone — the wrinkle the plan flagged, handled by construction.
3. **One completion mechanism, not two.** The client already tracks txid-group application for atomicity, including the reset substitution. Result resolution rides the same applied-txid event instead of adding a parallel cursor-watching tracker.

Resolution rule: a call's promise resolves when its `result` has arrived AND its `txid` group has applied locally (or `spans` ∩ subscriptions is empty, or `txid` is absent — no deltas emitted). Deltas often land before the result (fan-out happens at commit, the reply after), so the client keeps a small LRU of recently applied txids to resolve immediately on result arrival. The same event drops the pending entry for mutators: the plan's "when the channel cursor passes it, the speculative version is dropped" becomes "when the txid applies, the pending entry drops" — same semantic, restated against the mechanism that actually exists. Read-your-writes for the non-optimistic half, no flicker window after the `await`, preserved.

### Apply discipline (client)

Wire correctness depends on four client-side rules from the reactivity review — the protocol assumes them, the sync client must enforce them:

1. **Never apply mid-flush.** Delta groups, snapshot commits, and rebase replays apply only between scheduler flushes, gated through the afterFlush alternation (all pending reactions drain, then one afterFlush snapshot, repeating). A delta applied while `isFlushing` breaks the dedup-to-one-rerun guarantee across the flush boundary — the review found no guard exists, so the sync client is the guard.
2. **Apply + rebase is one synchronous unit.** Snapshot swap, tx-group apply, and pending replay run as a single synchronous block outside any flush. No `flush()` calls from inside it (re-entrancy corrupts `isFlushing`), no awaiting mid-replay (peeks would observe intermediate `synced ⊕ pending` states — the scheduler has no topological ordering to hide them).
3. **Top-level field reference swaps, always.** `fields` apply set-by-path with a fresh top-level reference per touched field — the reconcile snapshot diff is shallow, an in-place deep mutation under the same ref is invisible. Mandatory, not stylistic.
4. **`cleared` writes `undefined`, never deletes.** Removed keys slip the renderer's snapshot diff by design — which is why the wire says `cleared` instead of carrying delete semantics.

Duplicate deltas (overlapping channel projections, replay overlap) are safe by the same layer: apply goes through equality-checked sets, so an identical field value produces no second notify. At-least-once + idempotent receiver, validated down to the reactivity layer.

### Reason codes

| code | name | surfaces |
|---|---|---|
| 4000 | malformed | close |
| 4001 | unsupported-protocol | rejected, close |
| 4002 | too-large | close |
| 4003 | hello-timeout | close |
| 4100 | unauthorized | rejected, close |
| 4101 | auth-expired | auth, close |
| 4102 | forbidden | nosub, result.error |
| 4200 | unknown-channel | nosub |
| 4201 | bad-args | nosub, result.error |
| 4202 | revoked | nosub |
| 4300 | unknown-call | result.error |
| 4301 | call-failed | result.error (app throw: permission/check/run) |
| 4400 | superseded | close — newer connection presented the same clientID (MQTT 0x8E session-taken-over; the multi-tab split-brain guard: a 4400'd leader re-runs Web Locks election instead of reconnecting) |
| 4500 | shutting-down | close — reconnect normally, any node answers |
| 4501 | try-other-server | rejected, close — honor `redirect` |
| 4502 | slow-consumer | close |
| 4503 | rate-limited | rejected, close — honor `retryAfter` |

Codes are terminal-state instructions, not prose: 4001/4100-without-callback/4102-at-hello → `failed`; 4500/4502 → normal backoff; 4501 → redirect; 4503 → `retryAfter`; 4400 → re-elect.

## 3. Client Connection State Machine

Owned by the leader tab. Followers mirror state over BroadcastChannel and never open sockets — the protocol sees exactly one connection per clientID, and any node answers any reconnect (no sticky sessions). **[Superseded 2026-06-14: v1 is independent-clients, each tab with its own clientID, not leader/follower. This connection-ownership model is deferred to a measured need. See plan.md Multi-tab.]**

```
connecting ──welcome──▶ connected ◀──welcome── reconnecting ──30s──▶ offline
    │                       │                       ▲                   │
 rejected(fatal)         close/                  retry fails        retry (15-30s,
    │                  heartbeat miss               │              online event)
    ▼                       └──────────────────────▶┘                   │
  failed ◀──────────────── rejected(fatal) ─────────────────────────────┘
```

- **connecting** — first connection of a session (or recovery from `failed` after new auth). No positions assumed.
- **connected** — welcome received. Per-channel catch-up/live runs inside this state (each channel independently in snapshot-buffering, tail-replay, or live — the boot state machine from the plan, per channel).
- **reconnecting** — the blip tier. Entered on close, error, or heartbeat dead-man (no frame for `heartbeat × 2`). Retries on full-jitter exponential backoff: `delay = random(0, min(30s, 500ms × 2^attempt))` (AWS full jitter — the thundering-herd answer the plan requires). Attempt counter resets on a welcome that survives 30s. `rejected.retryAfter` overrides the computed delay. `navigator.onLine === false` parks the timer until the `online` event; `online` and `visibilitychange → visible` short-circuit to an immediate attempt.
- **offline** — the outage tier, entered after 30s of failed reconnection (Pusher's ~30s unavailable precedent). Same retry loop, capped at the 30s ceiling. The distinction is consumer-facing, not mechanical: this is where UI gets loud (§6).
- **failed** — terminal until app intervention: protocol version unsupported, auth refused with no auth callback registered, forbidden. The only state where disabling inputs is correct (Ably's lesson inverted: with an authCallback, auth expiry never lands here — the client fetches a fresh token and reconnects through `reconnecting`).

Two-tier presentation (research consensus: suppress blips, surface outages): the **status signal is raw truth and flips immediately**; the **root data-attributes apply smoothing** — `data-connection` holds `connected` through blips shorter than 5s (Liveblocks lostConnectionTimeout default), shows `reconnecting` from 5s, `offline` from 30s, `failed` immediately. Programmatic consumers read truth, pure-CSS consumers get smoothing free.

While `reconnecting`/`offline`: mutators keep applying optimistically and queueing to the durable outbox (inputs stay live — the research is unambiguous that disabling inputs during reconnection is wrong for implicit-save UIs). Methods reject fast with a connection error, per the plan's bimodal write contract.

## 4. Server Connection Handling

**State posture.** Per-socket: the subscription set (channel address → subscriber entry), the session, last-frame-received time. Per-clientID, durable and server-derivable (Redis in the reference implementation): the outbox watermark (one integer) and the idempotency ledger (recently applied call ids, short TTL — the watermark covers ordered outbox calls long-term, so the ledger only spans the out-of-order window, methods mostly). Nothing else — no per-client replay buffers, no mergebox, no server-held cursors (the invariant; Ably/Socket.IO recovery buffers are the named anti-pattern: in-memory, unbounded, lost on restart, hard TTL).

The ledger SHOULD cache result payloads for its TTL so a duplicate `call` id replays the original `result` instead of re-executing — the idempotent-receiver answer for retry-after-reconnect, and what makes client-side method-retry policy safe to choose later. Unknown clientID (watermark expired or never existed) → `lastCallID: 0`, replays accepted. The residual double-apply window is: server applied, client crashed before observing any ack, watermark since expired — vanishingly small against a multi-week watermark TTL, and the cheap analog of Replicache's ClientStateNotFound posture.

**Heartbeats.** Server-initiated `ping` every `welcome.heartbeat` ms (default 25s). Any client frame counts as liveness; an idle client answers `pong`. No frame within one further interval → close, the zombie is evicted (the server pays for half-open TCP, so the server detects it). Client side mirrors with the `heartbeat × 2` dead-man in §3.

**Backpressure — reset is the valve, never buffering.** Two detection points, one outcome:

- **Per-channel log collapse**: a channel's pending delta volume crosses the collapse threshold (bulk writes, migrations) → drop the log tail, emit `reset` to all subscribers, clients resnapshot. One bounded payload regardless of how far behind anyone is.
- **Per-socket saturation**: the socket's buffered bytes cross `maxBufferedBytes` (reference default 16MB) → close 4502. The client reconnects through normal resume; channels whose cursors fell out of retention get snapshots at sub time. Per-client buffering beyond the OS socket buffer never happens — a slow consumer costs a close, not memory.

Both paths terminate in the reset → snapshot machine the client already runs for storage loss and migration. No new client states for overload.

**Auth expiry and refresh.** `welcome.authExpiresIn` announces the deadline; as it approaches, `ping` frames carry the countdown (PowerSync's keepalive pattern). The client's auth callback produces a fresh token → `auth { token }` → `auth { ok: true, expiresIn }`. Subscriptions, cursors, held tx groups, and in-flight calls are untouched (Centrifugo refresh: positions survive). Refresh failure or hard expiry → close 4101; with an auth callback the client reconnects with a fresh token through `reconnecting`, without one it lands in `failed`.

**Connection takeover.** A `hello` presenting a clientID with a live connection closes the old socket 4400 (superseded). Normal during leader handoff — the dying leader's socket may linger while the new leader connects. The 4400'd side re-checks the Web Lock instead of fighting.

## 5. Resume Choreography

The reconnect sequence, end to end. No session resumes — only positions continue (all durable progress is client-held: channel cursors and outbox in IDB, or server-derivable: watermark and ledger). Any node answers.

1. **Socket opens** → `hello { protocol, clientID, auth }`.
2. **`welcome { lastCallID, heartbeat }`** (or `rejected` → §3 routing). Heartbeat timers start.
3. **Outbox trim.** Every outbox entry with numeric id ≤ `lastCallID` settled while away: delete from outbox, remove from the pending set, re-derive `synced ⊕ pending`. Their authoritative effects arrive through channel replay — no per-entry acks, the watermark came free from the ledger. Individual outcomes of trimmed entries are not re-reported (the ledger's cached results serve live retries, not archaeology); authoritative state is the report.
4. **Batched subs, first.** One array frame: `sub` per held channel, each with its stored cursor. Subs go first for fastest screen freshness.
5. **Outbox replay, immediately after** — not gated on sub completion. One array frame of remaining `call`s in seq order. Replay order against sub replay is correctness-irrelevant: `synced ⊕ pending` re-derives regardless, so the two race by design.
6. **Per channel, the server answers** one of:
   - **Tail replay**: cursor valid → missed deltas (normal `delta` frames, txid rules apply) → `live { cursor }`. The channel was stale, now ready.
   - **Snapshot**: cursor expired, epoch mismatch, or log collapsed → `snapshot` chunks → terminal chunk → `live`. The epoch rides inside the opaque cursor (`epoch:offset`, Centrifugo's server-amnesia lesson): wiped logs and restarted offsets surface as a silent snapshot, invisible to the client, which never knows the difference between "expired" and "the server lost its memory." No `reset` round trip at sub time — the server answers with the snapshot directly.
   - **`nosub`**: access revoked while away → drop channel, prune projection union.
7. **Results stream back** for replayed calls, resolving or rejecting pending entries through the standard txid rule.

**Reset-while-outbox-queued (plan hole, resolved).** A snapshot (from reset, resume, or boot) replaces only the **synced** side of the channel's docs. The pending set and outbox are untouched: shadows rebuild against the fresh synced state (first touch stashes the new confirmed version) and pending mutators replay on top. In-flight calls whose effects committed before the snapshot position are already inside the snapshot — their pending replay over it is value-identical, and the equality-checked apply path makes that a silent no-op until the `result` drops the entry. No ordering rule needed beyond the invariant already held: snapshots update synced, pending always replays, the derivation does the rest.

**Boot-from-IDB is the same machine.** Hydrate pool from the IDB snapshot, render immediately, then "reconnect" with the snapshot's stored cursors — step 4 onward, unchanged. Channels show `stale: true` until their `live` arrives.

## 6. Consumer Surface

First-class, not an afterthought: the threat model is implicit-save UIs where typing is saving. There is no Save button to gray out, so a severed link must be loud, ambient, and structurally hard to lose work under. The mechanics above make work durable (outbox in IDB, replay on reconnect); this surface makes the state legible.

### Global reactive API

Signals throughout — auto-unwrapping in templates, ambient registration in reactions. Owned by the leader, mirrored to followers over BroadcastChannel so every tab reads identically.

```js
import { sync } from '@semantic-ui/sync'

// connection — raw truth, flips immediately
sync.connection.status         // 'connecting' | 'connected' | 'reconnecting' | 'offline' | 'failed'
sync.connection.isConnected    // computed boolean
sync.connection.lastConnectedAt
sync.connection.nextRetryAt    // Date | null — drives "retrying in 3s…" countdowns
sync.connection.attempts

// writes — the implicit-save surface (Convex/Replicache lineage)
sync.writes.status             // 'idle' | 'saving' | 'saved' | 'error'
sync.writes.pending            // outbox + in-flight count — the Linear-style badge number
sync.writes.oldestPendingAt    // queue age — "unsaved for 4m" warnings
sync.writes.lastSavedAt
```

`sync.writes.status` is smoothed by default (`smooth: 1000`, Liveblocks lineage): `saved` displays at least 1s so the badge doesn't strobe under keystroke-granular mutators. `error` means a pending entry was rejected — surfaced once, ambient, never per-field (Primer's finding: per-field save indicators get misread as validation).

### Per-channel staleness

Subscription handles scope degradation to the data that is actually degraded — a stale chat panel should not dim the settings form (research: per-channel staleness keeps degradation scoped, not app-wide).

```js
const handle = subscribe('invoices', () => ({ teamID }))
handle.ready        // first live received — initial data complete (never flickers back)
handle.stale        // disconnected past grace, or reset pending — data live-but-old
handle.lastDeltaAt  // last applied frame (delta, snapshot, or live)
```

`stale` flips true when the connection leaves `connected` past the 5s grace or the channel receives `reset`, and false at the channel's next `live` — per-channel freshness through reconnect, driven by the §5 choreography. A derived per-channel pending count (pending mutators touching the channel's docs) is specified as derivable from the pending set; whether it ships on the handle awaits the bench (§8).

### Pure-CSS degradation

The framework writes two attributes on `document.documentElement` in every tab — smoothed per §3, so CSS consumers never see sub-5s blips:

```
data-connection = connected | reconnecting | offline | failed
data-sync       = idle | saving | saved | error
```

Attributes over classes: one attribute swap per transition, the enum is exhaustive, and selectors read as state-machine predicates (Liveblocks' data-status pattern). Regions declare their dependency declaratively:

```html
<section data-sync-requires="live">   <!-- meaningless without live data: presence, viewers -->
<form data-sync-requires="writes">    <!-- degrades only when writes cannot eventually apply -->
```

Shipped tokens-aware CSS encodes the policy that inputs stay live while writes queue:

```css
:root[data-connection='offline'] [data-sync-requires='live']  { opacity: .5; pointer-events: none; }
:root[data-connection='failed']  [data-sync-requires]         { opacity: .5; pointer-events: none; }
```

`live` regions degrade at `offline` (their content is the connection). `writes` regions degrade only at `failed` — the one state where queueing is a lie. In `reconnecting`/`offline`, forms keep accepting input: mutators apply optimistically, the outbox holds them durably, the ambient badge tells the truth. Disabling inputs during reconnection is the named anti-pattern.

### Lost-work guard

`beforeunload` attaches only while `sync.writes.pending > 0` and detaches at zero — dynamic registration preserves bfcache eligibility (MDN guidance), `preventDefault()` plus `returnValue` since Chrome ignores custom messages. The outbox survives the tab regardless (IDB-durable, replays next visit) — the guard exists because "I closed the tab" must not silently mean "my last keystrokes reach the server next Tuesday" (Figma's block-until-acked posture, Convex's warn-while-inflight, softened to a prompt because durability is already structural). SPA-internal navigation needs no guard — the leader and outbox outlive routes. Opt-out: `guardUnload: false`.

### Dev-mode disconnect overlay

Dev builds render a non-blocking corner overlay when the sync server drops: status, attempt count, `nextRetryAt` countdown — Vite's `server connection lost. Polling for restart...` register. It verifies liveness before clearing (a `welcome`, not a TCP connect — Vite PR #17891's lesson: confirm the server is actually serving before declaring recovery). It never blocks the page: the app keeps running on pool data, which is itself the offline-tolerance demo.

Past 10s of outage the overlay turns playable: a one-canvas paddle game against the reconnect timer, score persisted per session (the Chrome dino precedent — a dead connection in dev is a coffee-break, not a wall). Dev-only, tree-shaken from production builds, zero bytes shipped.

## 7. Protocol Evolution

**Version negotiation.** `hello.protocol` is the highest version the client speaks; the server replies `welcome.protocol` with the version it will speak (≤ client's). No overlap → `rejected 4001` with `reason` naming the supported range (Replicache's VersionNotSupported, made negotiable). One integer, no semver — breaking changes bump it, everything else rides capabilities.

**Unknown-message tolerance.** Within a major version: unknown `type` is ignored, unknown fields in known types are ignored, both sides. New server pushes degrade silently against old clients, new client fields degrade silently against old servers. Dev builds log what they drop. This is what makes capabilities cheap.

**Capability flags.** `hello.caps` / `welcome.caps`, string arrays; the intersection is active. The core message set (§2) is mandatory and never cap-gated. Capabilities are additive behaviors negotiated per connection — candidates: `encoding:msgpack` (the plan's pluggable wire encoding, exercised), `compress:permessage-deflate` policy, `redirect` (4501 handling), `result-cache` (ledger replays cached results). A capability that every implementation ends up requiring graduates into the next protocol version — caps are the staging area, the version is the contract.

**What is fixed forever** (the plan's spec/pluggable split, restated as evolution policy): cursor opacity, the catch-up/live state machine, reset-as-state, at-least-once + idempotent receiver, txid grouping. These are load-bearing for every implementation; no capability may weaken them.

## 8. Open Questions

What the spec phase must still pin — none block the conformance-suite skeleton, all block "spec complete":

1. **Canonical args beyond plain JSON** — channel args containing schema-revived types (Dates, at minimum) need a pinned serialization into the JCS channel address before two implementations exist. Likely answer: args are wire-plain by construction (schema revival happens above the address), but it must be stated, not assumed.
2. **Watermark + ledger durability policy** — concrete TTLs for the reference server, the unknown-clientID acceptance posture as a stated risk, and whether `result-cache` is core or a capability.
3. **Tx-hold timeout interactions** — the 10s default, and whether the gap-resubscribe path interacts with projection-union pruning when the missing channel was concurrently unsubscribed.
4. **Progressive snapshot paint** — strictly-atomic commit at `live` is correct, but huge-channel first boot may want chunk-progressive rendering. Decide whether boot gets a marked exception or the discipline holds everywhere (the silently-incomplete-query trap argues: holds everywhere).
5. **Per-channel pending counts** — derivable from pending set × channel membership; bench the derivation before promising it on the handle.
6. **Smoothing constants** — 5s reconnecting grace, 30s offline threshold, 1s saved smooth are research-derived defaults; validate against the Phase 0a edge-state pages (reconnect feel, reset moment) before freezing.
7. **Batch frame limits** — max array length and message size defaults for the reference server, and whether limits are cap-advertised or fixed.
8. **Revocation UX** — does `nosub 4202` prune the projection union immediately, or after a single re-auth-and-resubscribe attempt (membership churn could otherwise flicker shared docs).
9. **Heartbeat floor/ceiling** — whether clients may request a heartbeat interval at `hello` (mobile battery pressure) or the server's word is final.
10. **Conformance suite shape** — the spec promises a future non-JS server validates by running it; decide the harness (recorded wire transcripts vs live driver) alongside the spec text so the two are co-authored.

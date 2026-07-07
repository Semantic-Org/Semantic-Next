# Protocol v2 — Conformance Cases

The case catalog for the cross-transport conformance battery. [`ws-protocol.md`](ws-protocol.md) cites these ids at its load-bearing clauses; the wire-freeze implementation builds the battery against this list. This document is the skeleton — ids, the clause each case evidences, what fails without it (the red-before), and worked wire fixtures for the cases whose proof is a frame sequence. Portability is delivered here: a second implementation validates by passing this battery, not by the spec being small.

## The harness (ruled at ratification, 2026-07-07): the hybrid

**Ruled (c), delegated at 70:** vectors-as-data carry the four pure derivations (`address-vectors`, `wire-clean-frames`, `codes-table-vectors`, `freshness-disclosure`) as JSON fixture files any implementation consumes directly; a live driver carries the twenty-nine choreography cases, riding the smoke idiom (a node script, exit 0/1), pointed at every registered transport — the cross-transport battery clause verbatim. The named cost: certifying a non-JS **client** needs the counterpart server-side driver, deferred until such a client exists; a non-JS **server** certifies against the JS driver-as-client, language-neutral by the wire.

The alternatives, priced (the decision record):

**(a) Recorded wire transcripts.** Golden fixtures — JSON frame sequences with expected replies — replayed against an implementation, asserting emitted frames match modulo a declared nondeterminism map (cursors, timestamps, minted ids). *For:* the fixture is a language-neutral artifact (a Rust server runs the same files with a thin driver), diffs are reviewable in PRs, byte-identity claims (address vectors, serialize-once fan-out) are native, CI is cheap. *Against:* choreography with real timing — own-writes-before-result ordering, packed-frame boundaries under concurrent writers, backpressure valves, heartbeat dead-men, crash/restart cases — encodes one legal interleaving where the spec allows many, so transcripts either over-constrain or multiply; the nondeterminism normalization becomes its own machinery; the server-side MUSTs (per-doc serial apply, commit visibility) are not transcript-checkable at all.

**(b) Live driver.** A driver speaking the wire against any implementation through the transport seam, asserting semantics (ordering, settlement, resume outcomes) rather than bytes. *For:* timing and interleaving cases express naturally, crash/restart and valve cases are drivable, and the cross-transport requirement is native — the same battery pointed at every registered transport, the shape the existing smoke battery already proves. *Against:* the driver is a program, not data — a non-JS **server** validates against the JS driver cheaply (the driver is just a client), but certifying a non-JS **client** needs the counterpart server driver; more machinery than fixtures.

**(c) Hybrid** — the ruling above. Each case below carries a `shape` tag — `vector` (pure input → output, fixture-friendly) or `driver` (timing, state, or crash semantics) — the input that carried the ruling: the tags fall 4 vector / 29 driver across the 33 cases, and a single-shape harness would have forced the 29 into an unnatural form.

## The catalog

Gate tokens map each case to the phase-1 gate clause it evidences: `wire-freeze` (v2 ratified, wire frozen, auth frames included) · `settlement` (a coalesced-channel own-write never reverts) · `park-vocabulary` (ratified with both consumers named) · `valves-limits-states` · `battery` (the cross-transport conformance battery itself).

### Framing, addresses, transport (§1)

| id | shape | gate | asserts | red-before |
|---|---|---|---|---|
| `address-vectors` | vector | wire-freeze | `(name, args)` → canonical address, byte-for-byte, both sides — empty args, nested key ordering, number forms, unicode | v1 named JCS but shipped no vectors and no derived `collection.name` rule — two implementations could quietly disagree |
| `address-divergence-loud` | driver | wire-freeze | a frame for an unknown address while a sub is outstanding surfaces a dev-mode error naming the nearest pending sub | in the shipped tree a JCS divergence is a silently empty channel |
| `transport-frame-equivalence` | driver | battery | one choreography, byte-identical frames over ws, SSE-downstream/fetch-uplink, and the poll pair | v1 had no transport clause; equivalence was a claim, not a case |
| `wire-clean-frames` | vector | wire-freeze | no frame in any transcript carries `txid` or `spans` | v1's schema carried `txid?`/`spans?` on `delta` and `result`, required for every multi-channel transaction |

### Atomicity (§2)

| id | shape | gate | asserts | red-before |
|---|---|---|---|---|
| `atomicity-packed-frame` | driver | wire-freeze | a two-channel transaction arrives as one array frame and applies as one unit (fixture W1) | v1 ships per-channel frames + `spans` + client hold rules and a 10s timeout valve |
| `atomicity-resume-regroup` | driver | wire-freeze | at resume, tail entries sharing a transaction regroup into one frame across the resume batch | v1 resume replays per channel; regrouping did not exist |
| `atomicity-tier-scope` | driver | wire-freeze | a transaction touching a live and a coalesced channel: live frame packs alone, no cross-tier grouping, no hold | v1's `spans` implied waiting on channels that legally never emit — the review's hold-livelock |
| `snapshot-atomic-commit` | driver | wire-freeze | a torn snapshot stream discards and retries; nothing partial ever applies; commit only at `live`; a transaction fanned to a mid-snapshot subscriber is inside the snapshot or delivered after the terminal chunk, never dropped | carried forward from v1 (the checkpoint bracket) — v1 never stated the snapshot/commit ordering contract that makes queued-message discard safe |

### Settlement (§2)

| id | shape | gate | asserts | red-before |
|---|---|---|---|---|
| `settlement-own-writes-live` | driver | settlement | on a coalesced channel, the writer's own delta reaches the writing socket before its `result` (fixture W2) | in the shipped tree the coalescing window holds the delta past the result — settle drops the overlay and the confirmed write visibly reverts for up to the freshness window |
| `settlement-positions-backstop` | driver | settlement | a call settles only after `result` arrived AND every subscribed `positions` entry is passed by the channel's applied cursor | v1 settles on txid-group application, which has no answer on coalesced tiers |
| `settlement-epoch-unknown` | driver | settlement | a position from a bumped epoch compares unknown and resolves through resnapshot — the write is in the fresh snapshot | v1 has no positions; nearest analog (txid LRU) silently never resolves across an epoch |

### Auth and reauth (§2, §4)

| id | shape | gate | asserts | red-before |
|---|---|---|---|---|
| `auth-refresh-regate` | driver | wire-freeze | a successful `auth` refresh re-runs the `permission` slot per subscribed channel; a revoked channel gets `nosub 4202` | v1's refresh leaves subscriptions untouched — a refreshing client holds revoked subscriptions forever (the laundering case) |
| `auth-principal-pinned` | driver | wire-freeze | re-auth presenting a different principal closes `4103` (or fully re-gates); the session is never silently relabeled | v1 has no same-principal clause and no 4103 |
| `auth-expiry-server-owned` | driver | wire-freeze | with a non-cooperating client, the server demands via `reauth` and closes `4101` at the deadline — revocation ≤ min(`server.revoke`, `authExpiresIn`) | v1's expiry ran on client-scheduled refresh; no server-initiable demand existed |

### The park/rejection vocabulary (§6)

| id | shape | gate | asserts | red-before |
|---|---|---|---|---|
| `park-rejection-classes` | driver | park-vocabulary | an aged replay rejected `4102` and a live validation rejection `4301` both settle as rejection-parks — content and args retained, surfaced, recoverable (fixture W4) | the shipped client silently drops the overlay at the error ack; typed work evaporates |
| `park-revoked-retry-then-prune` | driver | park-vocabulary | `nosub 4202` → exactly one re-auth-and-resubscribe attempt → second 4202 → `subscription.state: 'denied'`, projection-union contribution prunes | v1 left the choreography open (its Q8); naive immediate prune flickers shared docs on transient denials |

### Ledger and watermark (§4)

| id | shape | gate | asserts | red-before |
|---|---|---|---|---|
| `ledger-rejected-advances` | driver | wire-freeze | a rejected numeric call advances `lastCallID` | v1 leaves it undefined — the non-advancing reading deadlocks the trim contract |
| `ledger-trimmed-outcome-crosscheck` | driver | park-vocabulary | reject a call, drop the socket before the result lands, reconnect: the trim cross-check surfaces the failure as a rejection-park | under v1 the entry trims as settled — committed-looking work silently reverts with no error |
| `ledger-result-replay` | driver | wire-freeze | a duplicate call id replays the cached `result`; the call body runs once | v1 staged the result cache as an optional capability — a retry against a non-caching server re-executes |

### Resume and boot (§5)

| id | shape | gate | asserts | red-before |
|---|---|---|---|---|
| `resume-cursor-on-apply` | driver | wire-freeze | kill the client between frame receive and apply; resume redelivers the unapplied data (fixture W3) | v1 never specified advance timing — advance-on-receive resumes past never-applied data, silent loss |
| `resume-queued-discard` | driver | wire-freeze | frames queued behind an in-progress snapshot discard at its commit; none apply after | v1 never stated the discard — a stale queued frame writes older values over the fresh snapshot |
| `resume-trim-pending-split` | driver | settlement | a trimmed entry's pending overlay persists until its touched channels reach `live` | v1 trims overlay and outbox together at welcome — settled work renders undone-then-redone |
| `boot-order` | driver | wire-freeze | first paint after boot includes outbox overlays: hydrate → rehydrate outbox → derive → render | v1's boot never ordered outbox rehydration before paint — reopen renders without the user's queued edits |
| `resume-bytes-choice` | driver | valves-limits-states | a resume where the tail outweighs the snapshot is answered with the snapshot | v1 left the heuristic unstated |

### Retention and epochs (§5)

| id | shape | gate | asserts | red-before |
|---|---|---|---|---|
| `retention-none-snapshot` | driver | wire-freeze | resume against a `retention: 'none'` channel answers snapshot directly — no `reset` frame appears on the wire | v1 had no retention vocabulary — a zero-log channel was not expressible, and nothing pinned its resume behavior |
| `epoch-bump-resnapshot` | driver | wire-freeze | `api.raw.bumpEpoch(target)` → every resume on affected channels answers snapshot under the new shape, for all three target shapes | v1 exposed no epoch-bump surface; reshaping migrations had no wire story |

### Limits and the code table (§2)

| id | shape | gate | asserts | red-before |
|---|---|---|---|---|
| `limits-4204` | driver | valves-limits-states | a channel-cap breach answers `nosub 4204`; an oversized call answers `result.error 4204` with the content retained client-side | 4204 has no legal answer under v1's table |
| `limits-no-silent-drop` | driver | valves-limits-states | an outbound delta the socket cannot carry converts to reset → resnapshot; no delta is ever silently dropped | nothing in v1 banned the silent size-drop |
| `codes-table-vectors` | vector | valves-limits-states | every code row: number, name, legal surfaces (names are doc vocabulary — only numbers ride the wire) — including `4203` relocating the config error off `4202`, which v2 reserves for denial | the shipped tree squats `badConfig` on 4202; v1's table had no 4103/4203/4204/4504 |

### Evolution and consumer-facing wire (§2, §7, §8)

| id | shape | gate | asserts | red-before |
|---|---|---|---|---|
| `forward-compat-ephemeral` | driver | wire-freeze | a v2 client receiving `ephemeral` frames ignores them silently (dev builds log); nothing else degrades | tolerance existed in v1 but was pinned to no named type — the reservation makes it testable |
| `freshness-disclosure` | vector | wire-freeze | every `live` frame carries `freshness` + `updatedAt` matching the channel's declared contract | v1's `live` carried only the cursor — priced staleness had no disclosure |
| `visibility-fanout-skip` | driver | valves-limits-states | a `hidden` connection is skipped in live fan-out and catches up via resubscribe on `visible` | v1 had no visibility surface |
| `actions-inflight-reject` | driver | wire-freeze | an in-flight action rejects with a connection error at drop; a manual retry replays the cached result | v1 was silent on in-flight-at-drop — a hung spinner |

## Worked wire fixtures

The red-befores whose proof is a frame sequence, shown against v1's framing. These become the battery's first fixtures.

### W1 — two-channel transaction (`atomicity-packed-frame`)

A `moveTodo` mutator moves `t1` from project A to project B; the client subscribes to both per-project channels.

v1 frames it as independent deltas carrying the grouping envelope, and the *client* reassembles:

```json
{ "type": "delta", "channel": "projects.byId?{\"id\":\"a\"}", "cursor": "3:118",
  "txid": "tx-90412", "spans": ["projects.byId?{\"id\":\"a\"}", "projects.byId?{\"id\":\"b\"}"],
  "changes": [{ "collection": "todos", "id": "t1", "op": "remove" }] }
```
```json
{ "type": "delta", "channel": "projects.byId?{\"id\":\"b\"}", "cursor": "3:47",
  "txid": "tx-90412", "spans": ["projects.byId?{\"id\":\"a\"}", "projects.byId?{\"id\":\"b\"}"],
  "changes": [{ "collection": "todos", "id": "t1", "op": "add",
                "doc": { "id": "t1", "title": "ship it", "projectID": "b" } }] }
```

The client holds frame one until frame two arrives (hold rule), with a 10s timeout valve and reset substitution for the folded-into-snapshot case — machinery the client provably cannot always run (opaque cursors cannot tell "not yet" from "already inside a snapshot").

v2 frames it as **one array frame**, no envelope, atomic by the frame boundary:

```json
[
  { "type": "delta", "channel": "projects.byId?{\"id\":\"a\"}", "cursor": "3:118",
    "changes": [{ "collection": "todos", "id": "t1", "op": "remove" }] },
  { "type": "delta", "channel": "projects.byId?{\"id\":\"b\"}", "cursor": "3:47",
    "changes": [{ "collection": "todos", "id": "t1", "op": "add",
                  "doc": { "id": "t1", "title": "ship it", "projectID": "b" } }] }
]
```

Assertions: both channels' effects visible in the same flush; no `txid`/`spans` key anywhere (`wire-clean-frames`); a mid-snapshot channel folds instead of appearing.

### W2 — coalesced-channel own-write (`settlement-own-writes-live`)

A dashboard channel `invoices.table?…` declares `freshness: '5s'`. The subscribed writer updates an invoice's status.

Under v1 semantics on the shipped tree: the channel coalesces, so the `result` arrives while the delta is still held in the coalescing window. Settle-on-result drops the pending overlay → the pool reverts to the pre-write value → up to 5s later the coalesced delta arrives and the value returns. A confirmed write visibly reverts — the hard-fail window this gate exists to kill.

Under v2, two frames on the writing socket, in this order:

```json
[ { "type": "delta", "channel": "invoices.table?{\"page\":1}", "cursor": "3:119",
    "changes": [{ "collection": "invoices", "id": "inv-7", "op": "change",
                  "fields": { "status": "approved" } }] } ]
```
```json
{ "type": "result", "id": 41, "status": "ok",
  "positions": { "invoices.table?{\"page\":1}": "3:119" } }
```

Coalescing exempts the writer's connection (identical bytes, earlier schedule — a timing exception), and settle additionally gates on the applied cursor passing `3:119`. Assertions: delta-before-result on the writing socket; other subscribers still receive the delta on the coalesced schedule; the overlay never drops early even if frame order is disturbed (the positions backstop catches it).

### W3 — crash between receive and apply (`resume-cursor-on-apply`)

The client receives a delta at cursor `3:120` and persists. Under v1's unspecified timing, an implementation may persist cursor `3:120` before the apply runs; a crash there boots from the IDB snapshot (which lacks 120's effects) and resumes `sub { cursor: "3:120" }` — the server correctly replays nothing, and 120's data is silently gone.

Under v2 the persisted cursor is always consistent with the persisted snapshot (apply-then-advance): the same crash resumes `sub { cursor: "3:119" }` and 120 is redelivered. Assertion: kill the client at every point between receive and apply; converged state is identical to the no-crash run.

### W4 — aged replay rejected (`park-rejection-classes`)

Overnight-aged outbox entry replays at reconnect; the server rejects it — permission was revoked while away:

```json
{ "type": "result", "id": 17, "status": "error",
  "error": { "code": 4102, "message": "forbidden" } }
```

The shipped client deletes the outbox entry, settles the rebase entry, and drops the overlay — the typed content evaporates with an ambient error at best. Under v2 the same frame settles a **rejection-park**: args and written paths retained on the parked surface, validation-shaped, edit-and-retry. The twin case with `4301` (a business-rule rejection of a live write) settles identically — one vocabulary, both consumers.

## What this document is not

The battery build — harness code, fixture tooling, CI wiring — belongs to the wire-freeze implementation. Cases proving *implementation* behavior that v2 newly specifies (settlement, parks, terminal states) go red only once that build starts; cases pinning already-shipped choreography (`freshness-disclosure`, `visibility-fanout-skip`, `snapshot-atomic-commit`, `transport-frame-equivalence`) can green immediately and act as regression armor. The server-side MUSTs (per-doc serial apply, commit visibility — spec §4) are deliberately absent here: they are storage/adapter conformance obligations, already pinned in the adapter suites (the xmin-horizon case), not wire cases.

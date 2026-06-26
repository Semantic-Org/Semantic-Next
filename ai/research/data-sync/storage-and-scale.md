# Storage & multi-box scale — the change-log model

Status: **design note.** Storage is an adapter seam; no production adapter is built yet. This records the scale-shape decision so the public API can be hardened around it rather than around the single-process reference.

## Where the current implementation sits

The kernel is a single-process, in-memory sync server: per-`(name, args)` shared channels (one log, one cursor, one subscriber set — no per-subscriber mergebox), serialize-once fan-out, a per-stream freshness contract (`live` / `<duration>` / `manual`), optimistic writes with replay-based rebase (`synced ⊕ pending`), a durable client outbox with at-least-once + idempotent receiver, and snapshot-at-resume / log-replay for reconnect. That subset is deliberate and good at what it is — per-box efficiency over a shared dataset. It is the **reference / dev / small-prod tier.**

It does **not** scale to many boxes by itself. The cursor (`epoch:seq`) is per-process; a write that lands on box A is invisible, from its own memory, to a subscriber on box B. **Single-box capacity numbers are per-box efficiency, not a scale claim.**

## The scale shape: a durable ordered change log as the source of truth

Multi-box push-sync reduces to one requirement: a **durable, totally-ordered change source** every box agrees on, with offsets for resume. (Gossip reinvents a log; sharded channel-ownership still needs writes to reach the owner durably; HTTP-poll still polls a durable checkpoint. A pub/sub bus is *insufficient* — at-most-once, no replay — so cursor-resume breaks on a blip. CRDT gossip is a different consistency contract for a different problem.) From that:

- Sync-server boxes become **stateless fan-out workers** that *tail* the log and hold only the in-memory materialization for their connected clients (rebuildable from a snapshot + an offset).
- **The cursor becomes the log offset** — globally ordered, durable, agreed by every box. A client's cursor is an offset; it can reconnect to *any* box and replay from there. Today's in-process `epoch:seq` is the single-box stand-in for this.
- A per-channel snapshot cache keys on `(channel, offset)` — globally valid and shareable across boxes, correct at fleet scale because the offset is per-scope-precise.

This is Meteor's oplog idea done right, and the model the modern CDC sync engines use (Electric, Zero, Convex): the database is the source of truth, sync is a read-path over its change log.

## The adapter contract this implies

The scale-correct contract is that **the adapter owns the ordered change stream + durable offsets** (the cursor comes *from* the adapter) — not the kernel computing an in-process cursor over a passive doc store, which is the current in-memory adapter's shape. Building the first log-backed adapter is what validates whether the seam is in the right place (the in-memory adapter never stressed it, because in-process the kernel legitimately *can* own the cursor). Likely first target: **Postgres logical replication** — a replication slot decoding the WAL (`pgoutput`/`wal2json`), LSN = offset, the slot's exported snapshot solving consistent-snapshot-at-offset. (The raw WAL is physical; you consume *logical decoding* of it.)

## Collection indexes — what a collection indexes (NOT the `searchIndex` channel)

**Disambiguation first, because the names collide.** A **storage index** (this note) is a backend structure declared *on a collection* — *what to index* — and is purely an acceleration. The **`searchIndex` channel** is a different thing one layer up: a client-driven *search* (personal `query/where/sort/page`, non-reactive by default — `live: false` + `refresh: 'own-writes'`), i.e. **searching from the client over a channel that is not live pub/sub** — you issue a query and get a window, you are not pushed every change. A `searchIndex` channel *runs a query that storage indexes can accelerate*, but it is a channel/query construct, not an index; the same storage indexes back it and ordinary live channels alike.

The read-path need these storage indexes serve: **a sorted or windowed channel (or a `searchIndex` query) must not fetch the whole collection and sort/page in memory.** It splits two ways:

- **Sort + keyset paging** — built in the Postgres adapter (candidate A): `ORDER BY` + `LIMIT` and a nested keyset `WHERE` reproduce the JS `compileSort` order byte-for-byte (per-key direction, the missing-class `NULLS` placement, a `COLLATE "C"` id tiebreak), so a window is O(window), never fetch-all or `OFFSET`. To be **index-backed** it wants a composite btree that mirrors the `ORDER BY` (`(k1 dir1, …, id)`); correct without one, just unseeked.
- **Text / search** — a `where` over text (prefix / containment / full-text) falls back to a JS match floor today (the SQL pushdown declines string-range and `$prefix` on collation grounds, exactly as it declines those operators in the `WHERE` pushdown). A **full-text or vector storage index** — Postgres GIN over a `tsvector`, a vector index for embeddings — is what lets that predicate **push down** instead of scanning. This is what makes a `searchIndex` channel's text query cheap, but the index is declared on the collection, not on the channel.

Both are the **same collection-level declaration** (adapter-agnostic, not per-adapter storage config):

```js
defineCollection('records', {
  indexes: [{ keys: { status: 1, dueAt: -1 } }, { keys: { title: 1 }, type: 'fulltext' }],
})
```

Realized through a new adapter-contract method **`ensureIndex(collection, spec)`**, called by the server at registration. Postgres builds a composite btree from the *same* per-key direction/`NULLS`/`COLLATE` mapping its `ORDER BY` emits (so the planner uses it for the keyset), and a GIN/`tsvector` (or vector) index for a search `type`; the in-memory adapter no-ops (it scans); a future dedicated search adapter realizes its own. One `type` field spans `btree` (sort/keyset) and `fulltext`/`vector` (text/search) — the `id` tiebreak and `COLLATE` are implied so the index matches the adapter's own ordering. Declare-explicit — an index is a write-cost choice — with a framework diagnostic when a published sort or a `searchIndex` query has no matching index, not blind auto-derivation.

**Status:** the sort/limit/keyset pushdown is built + panel-reviewed in the Postgres adapter (sync-poc); the collection-level index declaration + the `ensureIndex` seam land with **schema** (separate PR).

## The one fork: who owns the write path

- **Tail the DB's CDC** (Postgres logical replication, Mongo oplog): captures *every* writer, including services that never heard of channels. Coupled to the DB's change stream; coarse (per-row, the box filters).
- **Own the write path + a transactional outbox/log**: precise and per-scope (the layer knows each mutation's channel scope), no DB-CDC dependency — but only captures writes routed *through* the layer; out-of-band writers are invisible.

Decided by: **is the sync layer the sole writer?** For data written only through the layer (the layer as the client's sync path — e.g. conversation/workspace state), the **transactional outbox** is the idiomatic fit, and it is the same pattern the client outbox + `lastCallID` watermark already embody on the write-*in* path, applied to the change-*out* path. Where external writers exist, CDC is the catch-all. They compose: outbox for owned writes, CDC as the backstop.

## The snapshot memo, in this light

A per-channel snapshot memo (build the ordered/projected/encoded snapshot once per data-version, fan the bytes) is correct and a real per-box win. Its **fleet** cacheability depends entirely on the key being a per-scope offset: a coarse store-/collection-version key busts on any cross-tenant write to a shared collection, nullifying the per-channel precision. It is parked as a prototype until the cursor-as-offset model lands — at which point its key becomes the log offset and it caches correctly multi-box.

## Relation to other deferrals

Durable storage, cross-channel transactions (`txid`), and async authz are all deferred. The change-log model is the foundation that collapses several of these into one decision: multi-box fan-out, durable cross-box resume, and the out-of-band-writer problem are the *same* problem once the change source is a real log.

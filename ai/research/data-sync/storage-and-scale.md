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

## The one fork: who owns the write path

- **Tail the DB's CDC** (Postgres logical replication, Mongo oplog): captures *every* writer, including services that never heard of channels. Coupled to the DB's change stream; coarse (per-row, the box filters).
- **Own the write path + a transactional outbox/log**: precise and per-scope (the layer knows each mutation's channel scope), no DB-CDC dependency — but only captures writes routed *through* the layer; out-of-band writers are invisible.

Decided by: **is the sync layer the sole writer?** For data written only through the layer (the layer as the client's sync path — e.g. conversation/workspace state), the **transactional outbox** is the idiomatic fit, and it is the same pattern the client outbox + `lastCallID` watermark already embody on the write-*in* path, applied to the change-*out* path. Where external writers exist, CDC is the catch-all. They compose: outbox for owned writes, CDC as the backstop.

## The snapshot memo, in this light

A per-channel snapshot memo (build the ordered/projected/encoded snapshot once per data-version, fan the bytes) is correct and a real per-box win. Its **fleet** cacheability depends entirely on the key being a per-scope offset: a coarse store-/collection-version key busts on any cross-tenant write to a shared collection, nullifying the per-channel precision. It is parked as a prototype until the cursor-as-offset model lands — at which point its key becomes the log offset and it caches correctly multi-box.

## Relation to other deferrals

Durable storage, cross-channel transactions (`txid`), and async authz are all deferred. The change-log model is the foundation that collapses several of these into one decision: multi-box fan-out, durable cross-box resume, and the out-of-band-writer problem are the *same* problem once the change source is a real log.

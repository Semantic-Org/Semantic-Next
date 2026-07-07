# Data Sync Layer — Summary

What this layer is, why it exists for Semantic UI, and where to find the details. The corpus is ~5,500 lines. This file front-loads the vision so an agent who reads only the top is oriented, then layers in the detail and ends with a map to where each "how" lives. For the reading order and the settled-do-not-relitigate list, see `README.md` (aliased `START_HERE.md`).

**Status in one line:** the design is settled and validated by a working prototype, the packages do not exist in this repo yet, and the work is post-1.0, off the launch critical path. The corpus is the canonical reference until packages land.

## The vision

"minimongo for 2026." A reactive data layer where in-memory collections are queried locally, field-granular deltas push live over a socket, and optimistic mutations survive reload. It gives the developer experience of Meteor's data layer (find() in templates, latency compensation, no API layer between client and data) without Meteor's server economics or its mongo-and-runtime coupling.

The organizing belief: tiny realtime updates beat CRUD on every UX metric, so **the live delta path is the product**, and everything from a collaborative field edit to a live presence cursor rides it. Persistence, offline posture, and partial-sync sophistication are second-order. The enterprise workload it is sized for treats one large record (a closing file, a claim file, on the order of 150-200KB) as a single deep-tree document, so the consistency boundary is physical: one subscription, one permission boundary, one atomic write target, one conflict surface. But that record also references other collections by id (foreign keys into clients, related entities, lookup tables), and resolving those edges live is the common shape, not the exception. So the framework owns the **reactive composite publication**: a parent plus a live, permission-scoped, projected tree of the collections it references, assembled server-side so apps never hand-cascade subscriptions to stitch a record together. That is the moat. The 2026 engines took the relational turn to reassemble pre-scattered aggregates at sync speed; here the aggregate stays whole and its cross-collection edges are a first-class reactive join the framework resolves.

## Why it is a Semantic UI layer, not a generic engine

This is the part that does not transfer to another framework, and the takeaway to hold onto. The layer is built from SUI's own primitives, so it feels native in a way a bolt-on sync engine cannot:

- **The Tracker dividend.** Every template binding already runs in a Reaction, so `find()` is reactive in templates with zero framework changes. React, Svelte, and Solid have no equivalent ambient reactivity at the data boundary.
- **A synced collection is a Signal.** Synced data reuses the same `Signal` the component framework uses for `state`, so graduating local state to synced data is a prefix swap, not a rewrite.
- **The renderer already pays for field-granular updates.** The each-block reconcile and per-field deps (FGR) make a one-field delta cost one cell update, exactly the shape a live delta stream wants.
- **Shared schema and capture primitives.** The schema package is shared with component value-schemas, and `trackWrites`, the write-capture primitive, was lifted from `Signal.mutate`.

It sits as a gradient above SUI's permanent primary track (web components and signals over a CDN tag, zero server). The data stack is opt-in rungs on top, never a successor. Dependency direction is law: UI packages never import data packages, so SUI-as-UI-library still composes with any other data layer.

---

*The threads below are the orientation: what it does to components, the package architecture, what an adapter provides, how it crosses the wire, how it deploys and scales, and who it serves. Each leads with what it is. The detail layer follows them, and the final table maps every "how" to its document.*

## How it affects components

A synced collection surfaces into a component as `db.<name>`, a real `Signal` carrying the same helper surface as `state` (`get`, `push`, `toggleItemProperty`, `mutate`). The code a component already writes against local state works unchanged against synced data:

```js
state.todos.toggleItemProperty(id, 'completed')   // local
db.todos.toggleItemProperty(id, 'completed')      // synced: optimistic, durable, on the wire
```

A `subscriptions` block both provisions the data (deduped across components) and surfaces it by name in templates, with a `queries` registry as the opt-in for named subsets. The write surface is plural: direct collection writes from any JS (`Todos.update(id, { $set })`), the `db.<name>` reactive form inside a component, and named mutators when a write needs a permission gate, validation, or multiple collections in one envelope. Status (`ready`, `stale`, `lastDeltaAt`) rides the same handle. Forms fork a doc into a draft and commit only the touched paths, which is what makes concurrent edits to one record safe. The full surface is **`component-data-surface.md`**.

## The architecture

Three packages that unbundle deliberately (the lesson of Meteor, fused and unable to ship fixes past the platform, and of 2026, where Electric ships read-path only and TanStack DB ships store only):

```
@semantic-ui/schema   definition, validation, serialization — shared by component values, collections, op args
@semantic-ui/data     collections, reactive find, mutators + actions — standalone, no network
@semantic-ui/sync     protocol client: channels, cursors, delta apply, outbox, persistence
reference server      node, coordination behind a seam — one implementation of the protocol, not the protocol itself
```

`@semantic-ui/data` works alone: local collections with queries, drafts, and local persistence, no network. That is the first rung and a useful library in itself. The full design and decision record live in **`plan.md`**.

## What an adapter provides

Storage is an adapter seam behind the layer, not the system of record and not a cache over your database. An adapter persists and reads a collection's docs and supplies the ordered change stream the cursor reads from. The contract scales down and up: a memory adapter is a few functions and one Node command (the hobbyist rung), Postgres is the first real target, and an optional `watch()` function exposes a change-data-capture stream (logical replication, change streams) so external writers (migrations, triggers, other apps) flow into the same channels.

A defining choice for relational adapters: **top-level scalar keys become native typed columns, depth lives in JSONB.** A flat collection yields a table indistinguishable from hand-written SQL, so vanilla-SQL shops keep their columns, indexes, and BI queries. This is also what makes the brownfield path an afternoon rather than a migration: point the layer at a staging database, sync something you already have, write nothing through it yet. Adapter detail is in **`plan.md`** (Decision 11, External Writers) and **`storage-and-scale.md`**.

## How it goes over the wire

Each client holds an **opaque cursor** per channel marking how far it has consumed. A fresh subscription gets a snapshot, then **field-granular deltas** stream live, and an expired or collapsed cursor falls back to a fresh snapshot through a `reset` (the universal pressure valve, so storage loss, log truncation, and backpressure share one recovery path). Delivery is **at-least-once with an idempotent receiver**, so duplicates are harmless and reconnect is simply resuming from the stored cursor. Cross-channel atomicity is handled server-side — one frame per transaction per socket in live flow, the server regrouping tail frames by txid at resume, so the client holds no txid group (brief 1). Multiple tabs are simply independent clients the layer already reconciles (no leader election), and a first-class consumer surface (`sync.connection`, `sync.writes`, per-channel handles, pure-CSS connection attributes) exists because the threat model is implicit-save UIs with no Save button to gray out. The cursor is fixed forever and the delivery mechanism is pluggable (WebSocket default, with an SSE plus fetch fallback). The wire spec, message by message, is **`ws-protocol.md`**.

## Server, serverless, and scale beyond one box

The server story is a gradient, mirroring the adoption gradient:

- **No server.** Local collections run on the CDN tag with zero backend, SUI's existing story.
- **One server.** The reference node implementation, one command, for hobbyist and small-prod — no external coordination service at this tier. The current kernel is single-process and in-memory, deliberately this tier.
- **Many servers.** Stateless fan-out workers at scale.

What makes the jump possible is a **stateless-by-design protocol**: there is no session to resume, only positions to continue from. All durable progress is client-held (cursors, outbox) or server-derivable (the idempotency ledger), so there are no sticky sessions and any node answers any reconnect, a serverless-friendly posture. The one new requirement at fleet scale is a **durable, totally-ordered change log as the source of truth**: the cursor becomes the log offset, every box agrees on it, and sync nodes become stateless workers tailing it. This is Meteor's oplog idea done right and the model the modern CDC engines use, with Postgres logical replication (the LSN as offset) the likely first log-backed adapter. The one fork is who owns the write path, a transactional outbox for owned writes versus tailing the database's CDC for every writer, and the two compose. The scale model is **`storage-and-scale.md`**, the server posture **`plan.md`** Decision 9.

## Who it is for

Two scenarios hold equal constitutional standing, and every design choice answers to both: an enterprise back-office (the aggregate-document workload, 10 to 100 collaborators on one record, implicit save, weekly migrations against live operators) and a hobbyist (a weekend CDN project, one collection, minutes from empty file to two browsers syncing). Every complexity purchase must justify against one and cost the other nothing, and a soft-versus-hard failure taxonomy arbitrates what staleness or data loss is ever acceptable: soft fails are bounded, disclosed, and self-healing, while hard fails like a silent overwrite get zero budget. Both scenarios are in **`scenario.md`** and **`scenario-hobbyist.md`**.

---

*The sections below are the detail layer, the mechanisms behind the threads above, for a full read.*

## The decision record

Eleven calls from the 2026-06-09 session, all settled (full reasoning and rejected alternatives in `plan.md` and `reference-comparison.md`):

1. **Conflict model** — server-authoritative rebase for optimistic writes, no CRDTs. Rebase replays pending mutators over fresh server state.
2. **Client store** — memory-first, `Map<id, doc>` per collection, raw `Dependency` per doc and per query.
3. **Storage** — IndexedDB write-behind, lazy reconstructible snapshot plus durable outbox. No SQLite wasm.
4. **Partial sync** — channel-scoped replicas, not queries-as-subscriptions. The bounded pool keeps plain re-run viable, which keeps the client small and the boot hydrate-first.
5. **Query language** — mongo-subset selectors run locally, statically analyzable so field-intersection invalidation works.
6. **Realtime default** — tiered. Routed channels live by default, recompute channels (searchIndex) choose, `live: false` is their default.
7. **Transport** — WebSocket default, the opaque cursor is the protocol core, delivery pluggable.
8. **Invalidation routing** — write-path capture primary, CDC `watch()` the optional backstop for external writers.
9. **Server posture** — protocol-first, reference node implementation with coordination behind a seam, portable because conformance-tested not because small.
10. **Offline posture** — offline-tolerant, not offline-first. Outbox survives reload and replays. No long-offline merge for shared data.
11. **System of record** — the layer owns the write path, storage is an adapter behind it.

## The write path

Two vehicles, roughly 50/50 in production: **mutators** (isomorphic, sync, full optimistic simulation, outbox, replayed on reconnect) for latency-compensated interactions, and **actions** (server-only, async, awaited, no simulation) for business operations. Both ride a four-phase pipeline, `permission` then `schema` then `check` then `run` or `mutate`. The collection schema is the doc gate every write passes, so writes to undeclared paths are ignored and the schema is the complete write surface a reviewer can read. Privilege is ambient: raw CRUD is itself a first-class authorizable operation, because you authorize operations, not edits. `trackWrites` (shipped PR #242) is the write-capture primitive, reporting changed paths kept deliberately thin because richer data has a more authoritative downstream source. Registration is a gradient, inline config at the small rung graduating to one-file-per-operation at scale.

## Execution without fibers

Meteor's sync server CRUD was fibers suspending the stack during I/O. This design splits by what blocks: writes never await (a write is a command that buffers, then the framework applies the command log in one async transaction), and reads are the one true coloring, quarantined to async action bodies. Isolation is per-doc serial apply, an in-process queue on the reference server or `SELECT FOR UPDATE` on relational adapters where the row lock is the queue. This is the isolation contract Convex's cross-examination forced into the spec.

## The sync loop

The client invariant is **visible state = synced ⊕ pending**, server-confirmed state with unconfirmed mutators replayed on top. Downstream per channel: a snapshot, then field-granular deltas applied as top-level field swaps, with reconnect replaying the tail from the stored cursor. Upstream: optimistic apply, append to the pending set and durable outbox, send, the server runs the authoritative impl and routes deltas, the speculative version dropping when its txid applies. Rebase uses copy-on-write shadows for only the docs pending mutators touched. Aged offline replay is **park-then-verify**: outbox entries carry the base value of each path they wrote, verified against fresh state on reconnect, with review the default posture so nothing aged auto-applies. The parked surface is a product, reactive and typed and agent-legible, not an apology.

## Channels

Publications attach to collections and are shared per `(name, args)`, so 500 subscribers to one channel cost one selector match per write and one delta fanned 500 ways, with stateless nodes and no per-client view records. A write's changed fields intersect channel selector field-sets, and affected channels emit enter, leave, or field deltas. A publication can also be **composite**: a parent plus reactively-joined child publications across foreign-key edges, projected and permission-scoped as one live tree, so a record and the collections it references stay current together (the real workload's primary subscription is a composite, not a lone channel). The deeper cleave is two result shapes: a **publication** is *subscribe to a thing* (a synced, authoritative, live scope you edit, even a composite tree), a **searchIndex** is *run a query* (a `q=foo` search-results page, ranked and paged, a snapshot you re-run, non-live by default). The searchIndex verb carries the window vocabulary (`query`, `where`, `sort`, `page`) and liveness knobs (`live: false` default, `refresh`, or `live: true` recompute), with offset/numbered pagination and relevance-sort as its search-page ergonomics. Field projections are named static inclusion lists, fail-closed. Security is two gates and no third: read auth at subscribe, write auth in the operation's server half.

## Schemas, drafts, and the realtime tier

One schema in `@semantic-ui/schema` drives five consumers: wire revival, form binding, isomorphic validation, defaults, and wire privacy. Constructors author (`type: String`), string names serialize. Computed fields are stored, derived, writable, and overridable. Drafts and the `{#form}` block fork a doc, bind children by schema path, and commit touched paths only, with computed fields surfacing as form states (the autofill-trust affordance). Repeating groups commit as id-addressed path ops, never whole-array writes, because the arrays are where concurrency concentrates. A third timescale, **ephemeral collections** (presence, cursors, typing at 15-30Hz), re-prices the durable pipeline with one flag: in-memory, conflated, connection-scoped, no log or outbox.

## Validation state

The decisions read as closed because they were adversarially tested. A working prototype (sync-poc) proved the spine at 200k docs and cleared both Tier-1 spikes: rebase against the scheduler, and query re-run, where the collapse axis turned out to be sort under churn, fixed by incremental order maintenance (IVM's kernel idea without a planner). A five-lens vetting pass returned revise-then-build. A 28-amendment comparison against Zero, Supabase Realtime, and Convex flipped no architectural decision, and its rejected-attacks section is the tested armor. The five R2 design briefs are all ruled. Do not reopen a settled item without beating the rejected-attacks section in writing. See **`reference-comparison.md`** and **`vetting-report.md`**.

## Build sequence and what is not in v1

Phases gate on each other, with 0a (the DX steelman corpus) gating all API decisions: 0a steelman, 0b spikes, then `@semantic-ui/schema`, then `@semantic-ui/data` local-only, then the protocol plus reference server plus conformance suite, then the `@semantic-ui/sync` client, then the component surface. Out of v1: CRDTs, IVM, client-composed queries-as-subscriptions, SQLite/OPFS, offline-first, SSR hydration handoff. Open questions worth knowing before assuming an answer: package names, the component subscription surface (module-scope vs callParam), `isServer` elision for big action bodies, brownfield pricing, and SSR as a third hydration source.

## Where the hows live

| To understand | Read |
|---|---|
| Reading order, what is settled | `README.md` (aliased `START_HERE.md`) |
| The workloads the design serves | `scenario.md`, `scenario-hobbyist.md` |
| The full design and decision record | `plan.md` |
| The component-author surface | `component-data-surface.md` |
| Every settled ruling and the rejected-attacks armor | `reference-comparison.md` |
| The wire protocol, message by message | `ws-protocol.md` |
| Multi-box scale, the change-log model | `storage-and-scale.md` |
| Referee passes (reactivity) | `reactivity-review.md` |
| Worked API examples | `todomvc/`, `invoices-table/` |
| The grounding research and reference dossiers | `research/` |

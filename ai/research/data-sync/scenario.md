# Scenario — The Workload This Layer Exists To Serve

Status: **stipulated.** The parameters here (values marked ~) remain working assumptions, stipulated for design purposes and pending confirmation. This document is nonetheless the ground truth that benches, steelmen, referee briefs, and protocol decisions cite; when a design choice and this document disagree, this document wins or gets amended, never silently ignored.

## The Domain

Enterprise back-office software. The unit of work is a long-lived, high-value transactional record — a real-estate closing file, an insurance claim file — operated on collaboratively by staff over days to months. Many concurrent operators, strong correctness expectations, implicit save throughout. This is the workload the framework's data layer is sized for. Consumer-scale feeds, collaborative text editing, and offline field work are explicitly not it (see Out of Scope).

## The Aggregate-Document Principle

The full aggregate (on the order of ~150KB) could have been dozens of discrete collections — and in most stacks it would be, with every layer above paying the reassembly tax forever (joins, ORMs, dataloaders, cross-entity cache invalidation, composing permission policies, the N+1 industry). Instead the record is one document: the consistency boundary made physical. One fetch, one subscription (`records.byId`), one permission boundary, one atomic write target, one conflict surface.

**The simplicity is conditional — "when the stack supports it" is load-bearing.** The supports: single-doc atomicity, a schema language that scales into depth (composition across hundreds of subschemas), path-granular writes, field projections, per-field client reactivity, id-addressed array paths. Without them, the big document is the god-object anti-pattern and the industry's fear of it is rational. With them, the fear dissolves — and every mechanism in the plan is one of these columns. This is the design's moat: the 2026 engines took the relational turn (joins, IVM) to reassemble pre-scattered aggregates at sync speed; the document model deletes the problem instead.

Corollary: **relations are for crossing aggregates, not composing them.** Line-item rows inside a record need no relation machinery; record-to-client crosses aggregates and relation helpers cover it.

Costs, named: in-doc append-only logs are the bloat failure mode to police (inline email history is the tell — bounded today, structurally unbounded), the storage doc-size ceiling exists even at 100× headroom, and analytics wants flattened data — materialized blobs and ETL live outside the aggregate by design.

## Document Shape

- One major collection (`records`) dominates. Sized for a large back-office aggregate of the kind common in Meteor-era enterprise stacks: a dominant collection composing on the order of hundreds of subschemas across roughly a hundred files into a few thousand field definitions, with a couple hundred array-typed fields — arrays-of-id-bearing-subdocs are the dominant structural motif, not an edge. A representative aggregate of this class carries on the order of ~100 top-level keys (majority scalar) and a projected wire size around 150-200KB, with most of the byte mass concentrated in ~3-4 top-level subtrees (see Parameters).
- Deep subdocument arrays are the hot surfaces: itemized charges or line items, parties and contacts, related entities, and conditional requirement lists — the exception-heavy surfaces where edits concentrate. In aggregates of this class, an individual document tends to carry a couple hundred arrays of which only a small fraction (on the order of ten) are naturally id-bearing object-arrays of editable rows — most are small value-lists. The schema declares which arrays are *keyed* (the heavy-edit collaborative ones), the framework mints row ids for declared keyed arrays at insert, and id-addressing applies there; un-keyed value-lists keep whole-array semantics (common by count, rare by concurrency).
- Schema breadth is driven by jurisdictional permutation: 50 states, each with state-specific law, each major area fanning into 5-10 subpages. Conditional/variant subschemas are normal, not exceptional. (Schema-language consequence: a discriminated-variant story eventually; loose object regions in v1.)
- Several small reference collections (clients, contacts, rate/fee tables) sync whole and serve relation helpers and local queries.
- The corpus follows a power law: dozens of collections with a low median field count, the large majority small, one dominant collection, one config-blob sub-monster, then a long tail. The "one monster plus small references" assumption is the real shape, not a simplification.

## Channel Topology

- **The simplifying assumption: `records.byId` is the universal channel.** Every subpage of a record subscribes to the same per-doc channel. No per-subpage channels, no per-subpage projections.
- Role-tiered projection variants split that channel 2-3 ways (~) (staff vs restricted views of the same record), never per-subscriber. Precedent from Meteor-era publication layers: explicit `fields` projections were the norm rather than the exception, with multiple projection variants per heavily-used collection — whole-doc publication was rare.
- searchIndex channels power overview dashboards: personal args (query/where/sort/page), pageSize ~25-50 (~), covering inserts, deletes, and status changes across the collection — on refresh by default, as standing watches only under `live: true`. Args are user-personal by nature — instance sharing should be assumed low on these channels. **Dashboards are nonreactive by default** (`live: false` + `refresh: 'own-writes'`): a deliberate staleness-budget purchase per the failure taxonomy — co-editor churn arrives on interaction or refresh, the actor's own writes refresh immediately. Even a short fixed-window cache on search and permission-gated results — staleness on the order of a minute — feels like a budget operators in this class absorb without noticing, so `live: false` formalizes a tolerance that probably already exists rather than introducing one. Live windows are the opt-in for dashboards that earn the recompute economics.
- Reference collections sync via plain whole-selector channels and are queried locally (the local regime — no search channel).

## Write Pattern

- **Implicit save is the law of the hot paths.** Inputs commit through mutators `oninput`, debounced ~300ms trailing (~), typically one field path per commit (~). No save buttons. The user's mental model is "typed means saved" — every protocol and UX decision answers to this.
- Modal and complex-form flows (the trifecta: add/edit modals, multi-row editors) use drafts — fork, edit decoupled, touched-paths commit.
- Business actions (approve, finalize a transaction, generate documents) are actions: awaited, unsimulated, pending UI.
- True-realtime surfaces exist (live cursors during collaborative document review, presence, typing indicators): 15-30Hz throttled (~), ephemeral collections — conflated, connection-scoped, never logged or persisted. A collaborative review session (cursors moving while participants confer over a call) is the canonical case.
- Bulk writes happen: migrations, imports, batch status changes — from inside the ecosystem and outside it (external writers exist and are normal). See The Migration Window below — this is a named failure surface, not a footnote.

## The Migration Window

Migrations run **weekly** (~): a migration script (a `migrations/add-record-field.js` shape) updates every record in the database — thousands of docs — while some records are actively being operated on. Off-peak, but never empty. Rules:

- **Bulk writers are path-granular.** Whole-doc read-transform-writeback is the named anti-pattern: it loses the lost-update race against live operators' commits and reverts their committed work in storage. In-ecosystem migrations through `update(selector, fn)` are path-granular automatically (trackWrites emits only changed paths). Raw SQL column updates are naturally granular. App-code whole-doc save-back is contraband.
- **Batched and paced.** Small transactions (~500 docs), no cross-batch atomicity — one transaction is one atomic frame per subscriber, so a giant transaction means a giant frame and every overview channel collapsing at once; batching keeps frames bounded and the live path paced.
- **Expected impact:** detail channels (`records.byId`) receive one delta each — no storm. Overview/searchIndex channels hit log collapse and reset to snapshot, by design. The real cost is router selector-matching (docs × active channels), bounded off-peak.
- **Concurrent operation during the window is normal.** Disjoint-path merging keeps operators safe; per-path conflict evidence prevents post-migration false-conflict storms (per-doc versioning would flag every reconnecting operator). A migration rewriting the same path an operator edited conflicts honestly.
- **Schema mutations ride epochs:** a reshaping migration bumps affected channels' cursor epochs → clients reset and resnapshot under the new shape. Stale bundles that no longer validate get a reload affordance via `welcome` capabilities, not mysterious rejections.

## Read Pattern

- A given page binds ~10 of the ~100 fields (~) via `{record.some.value}` template expressions. The other ~90 fields' deltas must apply to the pool but should not re-fire that page's bindings.
- Relation helpers walk from record fields to reference collections (`{record.client.name}`) — pool-local lookups, frequent, assumed cheap.
- Dashboards render windowed search results, nonreactive by default (rows refresh on own writes and interaction). Windows that opt into `live: true` get membership churn (rows entering/leaving on status changes) and expect comprehensible motion, not maximum-frequency reshuffle.

## Concurrency Model

- **10-100 operators on the same record is the design point** (~): 10 on id:1, ten on id:2 is the everyday shape. Spread across subpages, mostly editing disjoint fields and disjoint subdoc rows. Same-field simultaneous editing is the rare case — but it happens, and silent loss is never acceptable.
- The arrays are where concurrency concentrates: two people in different line-item rows simultaneously is constant. This is why wire paths are id-addressed for schema-declared subdoc arrays — whole-array writes under concurrency are domain-fatal.
- Conflict expectations: disjoint paths merge silently (including disjoint rows of one array). Same-path concurrent writes resolve last-write-wins live, and conflict-detected on aged replay. Conflicts surface field-routed, like validation — never as ambient mystery.

## Failure Taxonomy — Soft vs Hard

Two failure categories with different budgets, treated differently everywhere:

**Soft fails — degraded service. Bounded, disclosed, self-healing.** Stale data on screen, data that doesn't replicate until reconnect/reload, delayed visibility of queued writes, dashboard lag behind detail views, detection latency on a half-open socket (while durability holds). Soft fails are purchasable currency: the design may spend them for performance, simplicity, or server economics — but every soft fail must be (a) bounded (staleness has a ceiling per surface: detail sub-second (~); dashboards 1-2s (~) for `live: true` windows, while the nonreactive default's bound is next interaction / own-write refresh, disclosed via a freshness affordance; reconnect-healed at worst), (b) disclosed when it exceeds its bound (staleness indicators, queued badges), and (c) healed by at most a reload — reset/resnapshot is the universal healer.

**Hard fails — destruction of information. Zero silent budget.** Overwritten data from another user's update, whole-array clobbers, committed work silently reverted (migration write-back, trimmed outcomes), typed content evaporating on rejection, outbox eviction without a tombstone, double-apply. Hard fails are never acceptable silently: the design must prevent them structurally (id-addressed paths, path-granular writes, idempotency ledger) or convert them into a visible, recoverable state (conflict surface, dead-letter, eviction tombstone). A hard fail may degrade to "the user must decide" — never to "nobody knew."

**The conversion principle: the architecture's job is to turn hard fails into soft fails, then bound and disclose the soft ones.** Reset converts replay corruption into resnapshot lag. Conflict detection converts silent clobber into a decision surface. The dead-letter converts lost content into recoverable content. When evaluating any future design choice or referee finding, classify first: a soft fail argues about budgets, a hard fail argues about existence.

## Failure Model and the Ownership Partition

Disconnects are routine, not exceptional: dev-server restarts (constant during development), laptop sleep, network blips, half-open sockets. The design partitions responsibility — the channel does not have to handle everything:

- **Protocol must own:** write durability ordering, watermark/ledger dedup, replay choreography, transaction framing, heartbeat-based detection, conflict evidence and outcome codes, reset/backpressure, id-addressed paths.
- **Consumer surface owns:** connection state signals and smoothing (blip vs outage tiers), queued-writes presentation, per-channel staleness, page-lifecycle guards and storage persistence, boot ordering (snapshot → outbox → pending → render), dead-letter retention of rejected content, field-routed conflict delivery.
- **App-space owns:** conflict presentation and restore affordances, region degradation policy (which UI dims or disables when disconnected), dashboard churn presentation, presence (pending an ephemeral frame type), copy and tone.

**The lost-work bar, scoped to the realistic envelope.** The actual fail points are intermittent network outages (seconds to minutes), flaky WebSocket connections (repeated drop/reconnect cycles), dev-server restarts, and same-day sleep/wake. Within that envelope the bar is firm: work is synced or queued-and-disclosed, co-editors' work is never silently overwritten, and **the common case must not cascade** — a blip stays invisible (queue, replay, merge), a minutes-long outage costs one badge and zero work, and a cycling socket must not amplify (idempotent replay, backoff+jitter, cheap cursor resubscribe, debounced state tiers — no UI flapping, no re-sub storms, no double-applies).

Beyond the envelope — days-later returns, evicted storage, another machine — the bar relaxes to best effort plus disclosure: queued work surviving a week is not promised, but where loss is detectable it is disclosed, and the hard-fail rule still holds in one direction regardless of age — a stale replay never silently destroys co-editors' newer work (parking converts it to a decision, however old). People don't expect miracles; they expect the common case not to cascade and the uncommon case not to lie.

## Canonical Load Figures

The numbers benches and referee walkthroughs cite (derived from this scenario, recompute when parameters change):

- 10 typers × 1 commit/300ms ≈ **33 calls/sec on a hot doc**, ≈ 33 delta frames/sec/subscriber, ≈ 5-10KB/s — frame rate, not bandwidth, is the watch variable. At 100 co-editors, ~330 frames/sec/subscriber.
- Channel instances per hot doc ≈ role tiers with subscribers ≈ **2-3, not 10** — detail-channel sharing economics hold.
- A 2-minute absence under hot-doc traffic ≈ 3,600 tail frames ≈ 700KB, vs the ~150-200KB full snapshot (smaller still under role projection) — **per-doc channels hold near-zero log retention and prefer snapshot-at-resume**, on size and on skipping replay-time both.
- Dashboard pressure: ~50 viewers (~) with personal args under collection-wide churn approaches recompute-debounce ceiling per instance — the searchIndex bench runs at viewers=50, never viewers=1.
- Detail-page reaction pressure: under per-doc dep granularity, ~360 reaction runs/sec/viewer at 10 typers — the figure that decides whether detail-page reads need per-field deps.

## Parameters To Confirm

| Parameter | Proposed | Confirmed |
|---|---|---|
| Input debounce | 300ms trailing, one path/commit | |
| searchIndex recompute debounce | ~300ms write-flag, separate ~1-2s emit floor | |
| Heartbeat interval | 25s (half-open detection ≈ 50s) | |
| Role-tier channels per record | 2-3 | |
| Dashboard pageSize / concurrent viewers | 25-50 / ~50 | |
| Hot-doc co-editor design point | 10 typical, 100 ceiling | |
| Replay parking threshold | conflict-evidence-driven, age as secondary signal | |
| Top-level keys per doc | ~100, majority scalar (stipulated) | |
| Leaf paths per doc | several thousand at actual fill (arrays multiply schema capacity). Depth to ~10, leaf mass concentrated around depths 4-7. Conflict map prunes to replay horizon | |
| Projected wire size, full `records.byId` | ~150-200KB, ~80% of the mass in 3-4 top-level subtrees — those keys carry the binding re-fire pressure | |
| Keyed subdoc array envelope (line items) | 50-200 rows | |
| searchIndex default liveness | `live: false`, `refresh: 'own-writes'` | |
| Ephemeral update rate (cursors/presence) | 15-30Hz throttled at source, client interpolation | |
| Migration cadence | weekly | |
| Migration batch size / pacing | ~500 docs/txn, paced | |

## Out of Scope — and the Splitting Questions

Each exclusion splits along an axis: one half maps to existing seams (recoupable), the other is genuinely a different product. The "when not to use" conversation starts with the splitting question.

| Persona | Splitting question | Recoupable half (cost) | Genuinely out |
|---|---|---|---|
| Collaborative text | Is the text surface a feature or the product? | A `type: 'crdt'` field — opaque commutative updates through the existing channel, idempotent receiver already matches CRDT semantics, ephemeral frame covers cursors (seam-priced: bundle + server merge hook) | Docs/Figma-class products where presence, undo, awareness are the product |
| Offline-first field ops | Who else edits this data while you're offline? | Worker-partitioned data: per-deployment park thresholds, `pin: true` subscribe + storage.persist, review-queue UX over the existing dead-letter (config + one component) | Shared data edited offline by multiple parties for days — unsolvable-conflict territory |
| Gigabyte scale | One artifact or a million aggregates? | Many small aggregates: search windows + lazy per-aggregate channels already serve it (free — was mislabeled, never really excluded) | Single giant artifacts (CAD, video, monolithic workspaces) — storage-first/OPFS territory |
| Consumer-scale fan-out | Are the 100k reading or writing? | Read-mostly broadcast: polling tier today, HTTP delivery binding on the pre-paid pluggable seam (cursor-core + stateless reads are CDN-shaped — Electric proved the pattern) | Write-heavy consumer scale (bidding, chat at scale) — per-user write pipelines price at business scale |
| Cross-org federation | Is one party the system of record? | The portal pattern: authoritative hub + external participants on restricted channels — projections, permission tokens, private floors, all existing (free) | Peer federation: two authorities, bidirectional rebase across trust boundaries — the EDI problem, honestly unsolved by anyone |

Recoup ledger: two free, two cheap-bounded, one seam-priced. The irrecoverable list is short and principled — and naming it keeps the glass beads honest.

# Scenario — The Workload This Layer Exists To Serve

Status: **stipulated.** The parameters here (values marked ~) remain working assumptions, stipulated for design purposes and pending confirmation. This document is nonetheless the ground truth that benches, steelmen, referee briefs, and protocol decisions cite. When a design choice and this document disagree, this document wins or gets amended, never silently ignored.

## The Domain

Shoreside operations software for a commercial fishing fleet or a processor that buys from one. The unit of work is a **trip**: one vessel's voyage from departure through landing to settlement. A trip stays open for days or weeks while the vessel is fishing, then weeks longer while the catch is offloaded, graded, attributed against quota, and settled into crew shares. It is worked by a rotating cast — ops coordinators tracking vessels at sea, tally crews and grading lines at the dock during offload, compliance staff filing to the regulator, accounting closing the settlement.

Three properties of this workload drive everything downstream.

- **The record is deep and repeating.** A trip is mostly nested lists of events, not a form. Almost all of its mass sits in a handful of repeating subtrees, and pages bind those subtrees rather than a scatter of scalars.
- **It is edited concurrently by role, and by machines.** Hardest during the hours a vessel is offloading, when tally stations, automated grading lines, and compliance are all writing the same document.
- **It is legally consequential, on a clock.** The logbook is due within ~24h of landing and the landing declaration within ~48h (~), so catch data is a regulatory filing with a deadline. A silently dropped row is a misreported landing rather than a UI annoyance, and the deadline is what makes implicit save non-negotiable.

Not this workload: capture at sea (vessels run for days outside coverage, so the e-logbook is a separate offline-first application whose data arrives here in bulk — see Write Pattern), consumer-scale feeds, and collaborative text editing. Each is priced in Out of Scope.

## The Aggregate-Document Principle

A trip could be a dozen collections — hauls, catch lines, offloads, tally lines, settlement lines, deductions, crew shares. In most stacks it would be, and every layer above pays the reassembly tax forever (joins, ORMs, dataloaders, cross-entity cache invalidation, composing permission policies, the N+1 industry). Instead the trip is one document: the consistency boundary made physical. One fetch, one subscription (`trips.byId`), one permission boundary, one atomic write target, one conflict surface.

**The simplicity is conditional — "when the stack supports it" is load-bearing.** The supports: single-doc atomicity, a schema language that scales into depth (composition across hundreds of subschemas), path-granular writes, field projections, per-field client reactivity, id-addressed array paths. Without them, the big document is the god-object anti-pattern and the industry's fear of it is rational. With them, the fear dissolves — and every mechanism in the plan is one of these columns. This is the design's moat: the 2026 engines took the relational turn (joins, IVM) to reassemble pre-scattered aggregates at sync speed, where the document model deletes the problem instead.

Corollary: **relations are for crossing aggregates, not composing them.** A catch row inside a haul needs no relation machinery. **Quota is the hard crossing** — a catch row edit draws down a per-permit, per-species, per-area balance that other vessels' trips are drawing against at the same moment, so it is a contended mutable reference rather than a static lookup, and it is the case the relations story has to answer for. Vessel and buyer are the easy crossings.

Costs, named — and the aggregate pays them by exclusion rather than by growth. The **position track is the bloat tell**: half-hourly VMS fixes over a three-week trip run to ~1,000 points, which alone would take a third of the document's wire budget, so the full track lives outside the aggregate and the trip carries per-haul positions only. The same rule sends the amendment log outside — post-filing corrections are regulator-visible amendments with an audit trail, and that trail grows without bound while the trip does not. Analytics wants flattened data regardless, so materialized blobs and ETL live outside the aggregate by design. The storage doc-size ceiling exists even at 100× headroom.

## Document Shape

- One major collection (`trips`) dominates. Its schema is assembled from many subschema files rather than authored in one place — a haul shape per gear type, a regulatory block per management area, a settlement structure per lay agreement — so composition and depth are the load-bearing schema properties.
- **The hot surface is two levels of nested id-bearing array.** `hauls[]` carries one entry per gear deployment: set and haul times, start and end position, depth, gear-specific duration (tow time for mobile gear, soak time for passive), and the gear configuration itself. Inside each haul, `catch[]` carries one row per species and disposition — FAO 3-alpha code, weight, **presentation** (whole, gutted, head-off), retained or discarded, grade. A three-week trawl trip runs **50-200 hauls and 1,000-3,000 catch rows** (~), since a mixed-fishery tow lists eight to twenty species between retained and discarded.
- The same keyed shape repeats at trip level: **offload tally lines** (one per tote or lot across a landing, 200-600 (~)), settlement lines, deductions, and the **crew manifest** — keyed rather than a value-list, because each berth carries a share fraction, advances, and deductions that accounting edits weeks after landing.
- Genuinely small value-lists (permit numbers, gear tags) keep whole-array semantics. The schema declares which arrays are *keyed*, the framework mints row ids for declared keyed arrays at insert, and id-addressing applies there. Un-keyed value-lists are common by count and rare by concurrency.
- **Schema breadth comes from gear and fishery permutation.** A trawl tow, a longline set, and a pot string share almost no fields — door spread and tow speed against hook count and bait type against pot count and escape-ring configuration — and each management area layers its own required logbook fields on top. Conditional and variant subschemas are the norm, not the exception. (Schema-language consequence: a discriminated-variant story eventually, loose object regions in v1.)
- **Two fields are derived rather than entered, and both are load-bearing.** Quota is charged in live weight while the dock records product weight, so `liveWeight = productWeight × conversionFactor[species][presentation]` against a versioned regulatory factor table. And the statistical rectangle a haul is reported in is computed from its position, not chosen. Both are stored computed fields with inputs outside the document.
- Several small reference collections sync whole and serve relation helpers and local queries: vessels, permits, buyers and processors, ports (UN/LOCODE), species codes, gear codes, the conversion-factor table, and grade and price tables. Most are coded keys carrying an authored label (`COD`, `OTB`), so the label travels with the code everywhere the UI shows one.
- Collection sizes follow a power law: one dominant collection, a config blob beside it, then a long tail of small ones. The "one monster plus small references" assumption is the shape to design for, not a simplification of something flatter.
- **The sizing target is the common case, and the tail is named.** ~60 top-level keys (majority scalar — a trip is narrow at the top with its mass in the repeating subtrees) and a projected wire size around 150-200KB for a mid-range trip of 60-80 hauls with one landing. A 200-haul trip with 3,000 catch rows projects past 400KB, which is the first place partial-sync pressure appears and the point where the haul list wants windowing rather than whole delivery (see Parameters).

## Channel Topology

- **The simplifying assumption: `trips.byId` is the universal channel.** Every subpage of a trip — hauls, catch, offload, settlement, compliance — subscribes to the same per-doc channel. No per-subpage channels, no per-subpage projections.
- Role-tiered projection variants split that channel 2-3 ways (~), never per-subscriber. The split is not cosmetic: settlement figures and crew-share math are not the dock tally role's business, so the field set differs by role and a projection is the enforcement. Projections are the expected shape, not an optimization, and whole-doc publication is the exception.
- searchIndex channels power the overview dashboards — trips at sea, landings awaiting settlement, quota utilization by permit: personal args (query/where/sort/page), pageSize ~25-50 (~), covering inserts, deletes, and status changes across the collection — on refresh by default, as standing watches only under `live: true`. Args are user-personal by nature — instance sharing should be assumed low on these channels. **Dashboards are nonreactive by default** (`live: false` + `refresh: 'own-writes'`): a deliberate staleness-budget purchase per the failure taxonomy — co-editor churn arrives on interaction or refresh, the actor's own writes refresh immediately. Even a short fixed-window cache on search and permission-gated results — staleness on the order of a minute — feels like a budget operators in this class absorb without noticing, so `live: false` probably formalizes a tolerance that already exists rather than introducing one. Live windows are the opt-in for dashboards that earn the recompute economics.
- Reference collections sync via plain whole-selector channels and are queried locally (the local regime — no search channel).

## Write Pattern

- **Implicit save is the law of the hot paths.** Tally and grading entry commits through mutators as values land, debounced ~300ms trailing (~). No save buttons — a tallyman calling weights off a scale does not stop to save, and with a filing deadline running an unsaved buffer is a compliance risk rather than an inconvenience. The user's mental model is "recorded when entered" — every protocol and UX decision answers to this.
- The natural commit unit on the hot path is **a row, not a field**: a scale event lands species, presentation, grade, weight, and tote id together. Field-at-a-time commits are the editing case, row inserts are the capture case, and both are ordinary path writes.
- Modal and complex-form flows use drafts — adding a haul, editing a settlement line, correcting a grade split. Fork, edit decoupled, touched-paths commit.
- Business actions are actions: file the logbook, submit the landing declaration, close settlement, submit a catch-certificate application. Awaited, unsimulated, pending UI.
- True-realtime surfaces exist: during an offload several tally stations work the same trip at once, and presence plus live cursors keep two people off the same row. 15-30Hz throttled (~), ephemeral collections — conflated, connection-scoped, never logged or persisted.
- **Bulk writes happen, and the standing case is the at-sea import.** A vessel returns to coverage and its e-logbook data lands in one batch, against a trip shoreside staff may already be working. Observer and electronic-monitoring records arrive the same way and are a second authority making claims about the same hauls, so reconciling the two is a real conflict surface rather than a hypothetical one. Regulatory migrations and batch status changes are the same shape. External writers exist and are normal.

## The Migration Window

Migrations are routine: reporting requirements change at season openings, at quota-year rollover, and on ad-hoc regulatory amendment, so a migration script (a `migrations/add-trip-field.js` shape) reshapes every trip in the database — thousands of docs — while some trips are actively being operated on. **The sharpest case is a conversion-factor revision**, which reprices the live weight, and therefore the quota attribution, of every open trip at once. Off-peak, but never empty. Rules:

- **Bulk writers are path-granular.** Whole-doc read-transform-writeback is the named anti-pattern: it loses the lost-update race against live operators' commits and reverts their committed work in storage. In-ecosystem migrations through `update(selector, fn)` are path-granular automatically (trackWrites emits only changed paths). Raw SQL column updates are naturally granular. App-code whole-doc save-back is contraband.
- **Batched and paced.** Small transactions (~500 docs), no cross-batch atomicity — one transaction is one atomic frame per socket, so a giant transaction means a giant frame and collapses every overview channel at once. Batching keeps frames bounded and the live path paced.
- **Expected impact:** detail channels (`trips.byId`) receive one delta each — no storm. Overview/searchIndex channels hit log collapse and reset to snapshot, by design. The real cost is router selector-matching (docs × active channels), bounded off-peak.
- **Concurrent operation during the window is normal.** Disjoint-path merging keeps operators safe, and per-path conflict evidence prevents post-migration false-conflict storms (per-doc versioning would flag every reconnecting operator). A migration rewriting the same path an operator edited conflicts honestly.
- **Schema mutations ride epochs:** a reshaping migration bumps affected channels' cursor epochs → clients reset and resnapshot under the new shape. Stale bundles that no longer validate get a reload affordance via `welcome` capabilities, not mysterious rejections.

## Read Pattern

- **A page binds one or two subtrees, not a scatter of scalars.** The haul page renders `hauls[]` as a repeating region — tens of rows by ~25 leaves — while the settlement page renders settlement lines and crew shares, and neither should re-fire on the other's deltas. Bound leaves per page therefore run to the thousands, concentrated in one subtree. This is a harder granularity problem than a form page: subtree-level deps buy nothing when every write lands inside the subtree the page is bound to, so only per-row or per-field deps help.
- Relation helpers walk from trip fields to reference collections (`{trip.vessel.name}`, `{row.species.label}`) — pool-local lookups, frequent, assumed cheap.
- Dashboards render windowed search results, nonreactive by default (rows refresh on own writes and interaction). Windows that opt into `live: true` get membership churn (trips entering and leaving as status changes) and expect comprehensible motion, not maximum-frequency reshuffle.

## Concurrency Model

- **10-100 concurrent writers on the same trip is the design point** (~), and the ceiling is not a hundred people: it is tally stations, grading lines posting weights automatically, and compliance and ops watching, while other vessels are landing elsewhere at the same time — ten on id:1 and ten on id:2 concurrently, not one hot doc in isolation. Spread across subpages, mostly writing disjoint fields and disjoint subdoc rows. Same-field simultaneous editing is the rare case — but it happens, and silent loss is never acceptable.
- The arrays are where concurrency concentrates: two tally stations entering different species rows of the same haul at the same moment is constant, not exceptional. This is why wire paths are id-addressed for schema-declared subdoc arrays — whole-array writes under concurrency are domain-fatal, and here a clobbered catch row is a misreported landing.
- Conflict expectations: disjoint paths merge silently (including disjoint rows of one array). Same-path concurrent writes resolve last-write-wins live, and conflict-detected on aged replay. Conflicts surface field-routed, like validation — never as ambient mystery. Observer-versus-logbook disagreement on the same catch row is the case that must arrive as a decision rather than a silent overwrite.

## Failure Taxonomy — Soft vs Hard

Two failure categories with different budgets, treated differently everywhere:

**Soft fails — degraded service. Bounded, disclosed, self-healing.** Stale data on screen, data that doesn't replicate until reconnect/reload, delayed visibility of queued writes, dashboard lag behind detail views, detection latency on a half-open socket (while durability holds). Soft fails are purchasable currency: the design may spend them for performance, simplicity, or server economics — but every soft fail must be (a) bounded (staleness has a ceiling per surface: detail sub-second (~); dashboards 1-2s (~) for `live: true` windows, while the nonreactive default's bound is next interaction / own-write refresh, disclosed via a freshness affordance; reconnect-healed at worst), (b) disclosed when it exceeds its bound (staleness indicators, queued badges), and (c) healed by at most a reload — reset/resnapshot is the universal healer.

**Hard fails — destruction of information. Zero silent budget.** Overwritten data from another user's update, whole-array clobbers, committed work silently reverted (migration write-back, trimmed outcomes), typed content evaporating on rejection, outbox eviction without a tombstone, double-apply. Hard fails are never acceptable silently: the design must prevent them structurally (id-addressed paths, path-granular writes, idempotency ledger) or convert them into a visible, recoverable state (conflict surface, dead-letter, eviction tombstone). A hard fail may degrade to "the user must decide" — never to "nobody knew."

**The conversion principle: the architecture's job is to turn hard fails into soft fails, then bound and disclose the soft ones.** Reset converts replay corruption into resnapshot lag. Conflict detection converts silent clobber into a decision surface. The dead-letter converts lost content into recoverable content. When evaluating any future design choice or referee finding, classify first: a soft fail argues about budgets, a hard fail argues about existence.

## Failure Model and the Ownership Partition

Disconnects are routine, not exceptional: dev-server restarts (constant during development), laptop sleep, network blips, half-open sockets. Dockside wifi is its own reliable source of blips. The design partitions responsibility — the channel does not have to handle everything:

- **Protocol must own:** write durability ordering, watermark/ledger dedup, replay choreography, transaction framing, heartbeat-based detection, conflict evidence and outcome codes, reset/backpressure, id-addressed paths.
- **Consumer surface owns:** connection state signals and smoothing (blip vs outage tiers), queued-writes presentation, per-channel staleness, page-lifecycle guards and storage persistence, boot ordering (snapshot → outbox → pending → render), dead-letter retention of rejected content, field-routed conflict delivery.
- **App-space owns:** conflict presentation and restore affordances, region degradation policy (which UI dims or disables when disconnected), dashboard churn presentation, presence (pending an ephemeral frame type), copy and tone.

**The lost-work bar, scoped to the realistic envelope.** The actual fail points are intermittent network outages (seconds to minutes), flaky WebSocket connections (repeated drop/reconnect cycles), dev-server restarts, and same-day sleep/wake. Within that envelope the bar is firm: work is synced or queued-and-disclosed, co-editors' work is never silently overwritten, and **the common case must not cascade** — a blip stays invisible (queue, replay, merge), a minutes-long outage costs one badge and zero work, and a cycling socket must not amplify (idempotent replay, backoff+jitter, cheap cursor resubscribe, debounced state tiers — no UI flapping, no re-sub storms, no double-applies).

Beyond the envelope — days-later returns, evicted storage, another machine — the bar relaxes to best effort plus disclosure: queued work surviving a week is not promised, but where loss is detectable it is disclosed, and the hard-fail rule still holds in one direction regardless of age — a stale replay never silently destroys co-editors' newer work (parking converts it to a decision, however old). People don't expect miracles, they expect the common case not to cascade and the uncommon case not to lie.

## Canonical Load Figures

The numbers benches and referee walkthroughs cite (derived from this scenario, recompute when parameters change):

- **Human tally is slow, machines are not.** A tote crosses a dockside scale every 5-15 seconds, so a station commits at ~0.1-0.2/sec. The rate comes from the grading lines posting per-tote weights automatically: eight lines running a large landing put **~30-40 commits/sec on one trip document**, ≈ 5-10KB/s, ≈ 33 delta frames/sec/subscriber. Frame rate, not bandwidth, is the watch variable. At the 100-writer ceiling, ~330 frames/sec/subscriber.
- Channel instances per hot doc ≈ role tiers with subscribers ≈ **2-3, not 10** — detail-channel sharing economics hold.
- A 2-minute absence under hot-doc traffic ≈ 3,600 tail frames ≈ 700KB, vs the ~150-200KB full snapshot (smaller still under role projection) — **per-doc channels hold near-zero log retention and prefer snapshot-at-resume**, on size and on skipping replay-time both.
- Dashboard pressure: ~50 viewers (~) with personal args under collection-wide churn approaches recompute-debounce ceiling per instance — the searchIndex bench runs at viewers=50, never viewers=1.
- Detail-page reaction pressure: a catch grid binds on the order of **1,800 leaves** (300 visible rows × ~6 fields), so under per-doc dep granularity 33 frames/sec × 1,800 bindings ≈ **60,000 reaction runs/sec/viewer** — two orders of magnitude past the form-page case. This is the figure that makes per-row and per-field deps mandatory rather than an optimization.

## Parameters To Confirm

| Parameter | Proposed | Confirmed |
|---|---|---|
| Input debounce | 300ms trailing | |
| Natural commit unit | row on capture, field on edit | |
| searchIndex recompute debounce | ~300ms write-flag, separate ~1-2s emit floor | |
| Heartbeat interval | 25s (half-open detection ≈ 50s) | |
| Role-tier channels per trip | 2-3 | |
| Dashboard pageSize / concurrent viewers | 25-50 / ~50 | |
| Hot-doc concurrent writers | 10 typical, 100 ceiling (stations + automated feeds) | |
| Replay parking threshold | conflict-evidence-driven, age as secondary signal | |
| Top-level keys per doc | ~60, majority scalar (stipulated) | |
| Leaf paths per doc | ~10,000 at full fill, since the repeating subtrees multiply schema capacity. Depth budget ~10, leaf mass expected around depths 4-7. Conflict map prunes to replay horizon | |
| Hauls per trip | 50-200 | |
| Catch rows per haul | 8-20 | |
| Offload tally lines per landing | 200-600 | |
| Projected wire size, full `trips.byId` | ~150-200KB for a mid-range trip, past 400KB at the high-haul-count tail (the first place partial-sync pressure appears). Most of the mass sits in the repeating subtrees, and those keys carry the binding re-fire pressure | |
| Regulatory filing deadlines | logbook ~24h from landing, landing declaration ~48h | |
| searchIndex default liveness | `live: false`, `refresh: 'own-writes'` | |
| Ephemeral update rate (cursors/presence) | 15-30Hz throttled at source, client interpolation | |
| Migration cadence | several per season, plus ad-hoc regulatory amendments | |
| Migration batch size / pacing | ~500 docs/txn, paced | |

## Out of Scope — and the Splitting Questions

Each exclusion splits along an axis: one half maps to existing seams (recoupable), the other is genuinely a different product. The "when not to use" conversation starts with the splitting question.

| Persona | Splitting question | Recoupable half (cost) | Genuinely out |
|---|---|---|---|
| Collaborative text | Is the text surface a feature or the product? | A `type: 'crdt'` field — opaque commutative updates through the existing channel, idempotent receiver already matches CRDT semantics, ephemeral frame covers cursors (seam-priced: bundle + server merge hook) | Docs/Figma-class products where presence, undo, awareness are the product |
| Offline-first capture | Who else edits this data while you're offline? | Worker-partitioned **subtrees** — `hauls[]` and `catch[]` belong to the vessel until it lands, while the trip header, buyer assignment, and ETA stay shoreside-owned throughout. Path granularity makes the partition real without splitting the document: per-deployment park thresholds, `pin: true` subscribe + storage.persist, review-queue UX over the existing dead-letter (config + one component) | Shared data edited offline by multiple parties for days — unsolvable-conflict territory |
| Gigabyte scale | One artifact or a million aggregates? | Many small aggregates: search windows + lazy per-aggregate channels already serve it (free — was mislabeled, never really excluded) | Single giant artifacts (CAD, video, monolithic workspaces) — storage-first/OPFS territory |
| Consumer-scale fan-out | Are the 100k reading or writing? | Read-mostly broadcast: polling tier today, HTTP delivery binding on the pre-paid pluggable seam (cursor-core + stateless reads are CDN-shaped — Electric proved the pattern) | Write-heavy consumer scale (bidding, chat at scale) — per-user write pipelines price at business scale |
| Cross-org federation | Is one party the system of record? | The portal pattern: an authoritative hub with external participants on restricted channels — the buyer seeing its own tallies, the certifier seeing chain-of-custody — projections, permission tokens, private floors, all existing (free) | Peer federation: two authorities, bidirectional rebase across trust boundaries — the EDI problem, honestly unsolved by anyone |

Recoup ledger: two free, two cheap-bounded, one seam-priced. The irrecoverable list is short and principled — and naming it keeps the glass beads honest.

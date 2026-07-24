# Reference Dossier — Convex

Deep research on Convex for the data-sync reference comparison, 2026-06-12. Spec anchors: [`scenario.md`](../scenario/scenario.md), [`scenario-hobbyist.md`](../scenario/scenario-hobbyist.md), [`plan.md`](../design/plan.md), [`ws-protocol.md`](../protocol/ws-protocol.md). Nothing here is competitive framing — every divergence resolves to adopt / reconsider / confirmed-divergence against the two scenarios.

Convex is the architectural cousin: named server functions with optimistic local pairing, a mutations/actions split that independently converged on our mutators/actions vocabulary, and the strongest production steelman of the road our spec did not take — server-evaluated queries as subscriptions.

---

## 1. Status and Adoption

- **Client**: `convex` npm 1.41.0 (verified by local install, 2026-06-12). Steady 1.x cadence since the 1.0 release.
- **Backend**: [github.com/get-convex/convex-backend](https://github.com/get-convex/convex-backend) — 11.9k stars, 736 forks, 885 releases, latest release 2026-06-09. Rust core (43%) + TypeScript (45%).
- **License**: [FSL-1.1-Apache-2.0](https://github.com/get-convex/convex-backend/blob/main/LICENSE.md) — no competing commercial use, auto-converts to Apache 2.0 two years after each release. Open-sourcing was their stated answer to lock-in pressure ([2023 year-end review](https://news.convex.dev/what-a-2023/): companies "need more access to how Convex is built and run so they retain a last-resort option to part ways with Convex the company without a complete backend rewrite").
- **Self-hosting**: supported via Docker/binaries, "includes most features of the cloud product, including the dashboard and CLI," works against SQLite/Postgres/Neon ([repo README](https://github.com/get-convex/convex-backend)). Cloud remains the recommended path and the business.
- **Commercial**: [$24M round led by a16z](https://news.convex.dev/convex-raises-24m/) (co-led Spark Capital; angels include Adam D'Angelo, Drew Houston, Theo Browne), on top of an earlier Series B. Claimed >10× growth in customers/projects/revenue over nine months at announcement. [Pricing](https://www.convex.dev/pricing): free tier 1M function calls / 0.5GB storage / 1GB egress, Professional $25/dev/month with 25M function calls, then usage-based across function calls, action GB-hours, storage, bandwidth, egress. **Reactive query re-runs are function calls** — the unit economics of their liveness are metered and visible in the bill, which is why their own presence engineering (see §3 presence) works so hard to avoid re-runs.

## 2. Architecture

From [How Convex Works](https://stack.convex.dev/how-convex-works) (Sujay Jayakar):

> "the most important thing to understand about Convex is that it's a database running in the cloud that runs client-defined API functions as transactions directly *within* the database."

Three components: a **sync worker** (WebSocket sessions), a **function runner** (V8 isolates executing user TypeScript), and the **database** — an append-only transaction log of timestamped document versions, with indexes supporting MVCC reads at any logical timestamp.

- **Storage**: the log is the source of truth. Multiple changes at one timestamp apply atomically. Indexes map a point in logical time to a consistent snapshot.
- **Write path**: mutations execute as serializable transactions under OCC. Each transaction records a begin timestamp, a precise **read set** (index ranges read), and a **write set**. A single-writer committer checks whether concurrent commits overlap the read set; conflict → deterministic re-run at a later timestamp.
- **Read path**: queries record read sets too. A **subscription manager** aggregates all active subscriptions and walks the transaction log once, intersecting log entries against read sets. Overlap → re-run the query function, push the new full result to subscribed clients.
- **Transport**: WebSocket, full-state-per-query protocol (§3 delta granularity).
- **Partial sync**: none in the replica sense — nothing is replicated to the client except current query results. The client holds a cache of (function, args) → latest result. No local store, no local query engine.
- **Conflict**: doesn't exist as a user-facing concept. Serializability means concurrent mutations are equivalent to some serial order or they retry. The cost surfaces as OCC retries and, under sustained contention, failures (§3 operational ceilings).
- **Backend coupling**: total and deliberate. Database, function runtime, and sync protocol are one system — read-set capture requires running user code inside their instrumented runtime. This is precisely the coupling our spec refuses (plan.md Decision 9: protocol-first, server as a maintenance boundary, reference Node + Redis).

### The function trio

| | query | mutation | action |
|---|---|---|---|
| determinism | required | required | none |
| side effects / fetch | forbidden | forbidden | allowed |
| transaction | consistent snapshot read | serializable read-write | none (each `ctx.runQuery`/`runMutation` is its own tx) |
| retry | safe (cached, re-run) | automatic on OCC conflict | **never** — at-most-once, caller's problem |
| runtime | V8 isolate | V8 isolate | V8 isolate or Node (`"use node"`, cold starts, 512MB) |

[Mutations](https://docs.convex.dev/functions/mutation-functions): "All database writes get committed together. If the mutation writes some data to the database, but later throws an error, no data is actually written" — and they "must be deterministic, and cannot call third party APIs."

[Actions](https://docs.convex.dev/functions/actions): "Unlike queries and mutations, actions may have side-effects and therefore can't be automatically retried by Convex when errors occur." And the consistency caveat: "Multiple runQuery / runMutations execute in separate transactions and aren't guaranteed to be consistent with each other."

**The boundary's rationale is retry-safety.** Mutations are deterministic and effect-free *so that* the system may re-run them on conflict (and roll back optimistic updates). Actions exist because the real world isn't idempotent. The [Zen of Convex](https://docs.convex.dev/understanding/zen) posture: "Use actions sparingly and incrementally," keep sync-engine functions "light, targeting completion in under 100ms," and bridge via the scheduler — mutations capture intent in the database, then `ctx.scheduler.runAfter(0, ...)` kicks the action, with database invariants preventing double-execution.

### Mapping onto our mutators/actions (convergent evolution)

Two designs arrived at the same split from different starting constraints:

| axis | Convex | ours (plan.md Write Path) |
|---|---|---|
| split rationale | determinism → automatic OCC retry + optimistic rollback | sync body → trackWrites envelope + optimistic apply + outbox replay |
| optimistic vehicle | mutation + hand-written `withOptimisticUpdate` second implementation | the same isomorphic body, simulated automatically |
| async escape hatch | action (fetch, non-determinism) | action (server-only, async, awaited) |
| offline | mutations queue in memory, resent on reconnect; actions cancelled | mutators outbox-durable across reload; actions reject fast |
| call-site truth | both promise-valued | mutators fire-and-forget sync, actions awaited |
| idempotency | requestId dedup, "mutations are idempotent" by construction | call id + per-clientID ledger (ws-protocol §2/§4) |

The deep convergence: **both designs make the realtime write vehicle deterministic/sync because a machine needs to re-run it** — their machine re-runs on OCC conflict, ours re-runs on rebase replay. Both designate the async, effectful, non-replayable work as a separate named vehicle. Where we diverge: Convex requires the optimistic implementation be written twice (see §4 — their own essay names this a hard problem), and their boundary additionally forbids reads-before-writes patterns nowhere (mutations read freely inside the tx) where ours quarantines storage reads to update callbacks (plan.md Execution Without Fibers). Their `ctx.runMutation`-from-action non-atomicity caveat is the same lesson as our "actions have nothing to rebase."

## 3. The Axes Our Spec Lives On

### Delta / field granularity

**Wire granularity is the full query result.** Verified in the [client protocol source](https://github.com/get-convex/convex-backend/blob/main/npm-packages/convex/src/browser/sync/protocol.ts): `Transition` messages carry `QueryUpdated` modifications whose `value` is the complete new result. No row diffs, no field deltas. Large transitions chunk (`TransitionChunk`) but the unit is still the whole value. Their own roadmap names the gap ([object sync engine essay](https://stack.convex.dev/object-sync-engine)):

> "Queries currently fully reexecute their JavaScript when someone writes to a row they read. Add more opportunities for incrementally updating the query result without rerunning JavaScript and pushing smaller deltas to the client."

Scenario math: a `trips.byId`-shaped query (`db.get(id)`) over our ~150-200KB aggregate (scenario.md Parameters) at 10 concurrent writers × 300ms ≈ 33 writes/sec means 33 query re-executions/sec server-side and, for every subscriber, ~33 × 170KB ≈ 5-6MB/s of full-result pushes — versus our ~5-10KB/s of field deltas (scenario.md Canonical Load Figures). Splitting the page into many narrow queries doesn't escape it: read sets are row-granular, so every narrow query reading the hot doc re-runs on every write to it. Field-granular wire deltas are not an optimization in our scenario, they are the difference between 5KB/s and 5MB/s per subscriber.

### Subscription topology + dedup

The query *is* the subscription: `AddQuery { queryId, udfPath, args, journal }` / `RemoveQuery`, versioned as a query set (`QuerySetModification` with base/new versions). Dedup is server-side by function identity: ["Convex caches query results automatically. If many clients request the same query, with the same arguments, they will receive a cached response"](https://docs.convex.dev/functions/query-functions) — the analog of our shared-per-`(name, args)` channel instances (plan.md Channels). Their [presence essay](https://stack.convex.dev/presence-with-convex) leans on exactly this: "Its cache primarily uses the function arguments as the key, so our query for all the presence data in a given room will be recomputed once per room" — recompute scales with distinct (query, args) pairs, fan-out with subscribers. Same economics shape as ours, achieved dynamically (read sets at runtime) instead of statically (selector field-set analysis at registration).

A real edge they hold: read-set invalidation covers **arbitrary handler code** — joins, auth logic, computed visibility — with precise invalidation and zero declarations. Our write-time selector routing requires statically matchable selectors, and anything beyond falls to recompute channels (write-flag + re-run + diff, plan.md Search channel mechanics), which is read-set-free re-running — a coarser cousin of their subscription manager. The price of their precision is the platform: read sets only exist because user code runs inside their instrumented runtime. That coupling is the thing plan.md Decision 9 refuses.

### Fan-out economics + backpressure

One re-execution per (query, args) per invalidation, cached result fanned to all subscribers — good sharing, same as our one-serialization-per-channel. But the fan-out unit is the full result (above), and every re-execution is a metered function call on the bill. Backpressure: nothing protocol-visible. No reset-equivalent, no slow-consumer valve in the published protocol (`FatalError` and reconnect are the blunt instruments). Transition chunking handles large payloads, not slow clients. Our reset-as-universal-valve (ws-protocol §4) has no counterpart — their server can always regenerate current state per query, so "behind" collapses to "re-run the query," which is structurally similar to our snapshot-at-resume posture but paid in compute per query rather than per channel.

### Offline posture + outbox/rebase

**In-memory only.** From [request_manager.ts](https://github.com/get-convex/convex-backend/blob/main/npm-packages/convex/src/browser/sync/request_manager.ts): the inflight map is process memory, no IndexedDB, no localStorage. On reconnect all mutations are resent — "This includes ones that have already been completed because we still want to tell the backend to transition the client past the completed timestamp" — safe because requestId-deduped idempotent. Actions are cancelled on reconnect (no idempotency guarantee). A reload loses queued mutations. That meets their persona (online-first reactive apps) and fails our implicit-save bar (scenario.md: "work is synced or queued-and-disclosed" across reloads, dev-server restarts, sleep/wake). Our durable IDB outbox (plan.md Decision 3) is load-bearing where their queue is a convenience.

**Optimistic updates are a second, hand-written implementation.** [Docs](https://docs.convex.dev/client/react/optimistic-updates): updates are "run when a mutation is initiated, rerun if the local query results change, and rolled back when a mutation completes." The developer edits cached query results imperatively via `localStore.getQuery`/`setQuery`, per mutation call site, with the sharp edge documented: "Mutating objects inside of optimistic updates will corrupt the client's internal state. Always create new objects inside of optimistic updates." Rollback-on-completion + authoritative result arriving in the same Transition is their flicker-free handoff — the same shape as our drop-pending-when-txid-applies (ws-protocol §2, result-cursor resolution), but per-query-result instead of per-doc.

The "rerun if local query results change" clause is a rebase: their optimistic layer replays update functions over fresh server results, exactly our shadow-and-replay (plan.md Sync Loop) at query-result granularity instead of doc granularity.

**Read-your-writes**: mutation promises resolve only after the client has observed a Transition past the mutation's timestamp — "We have to wait to resolve the request promise until after we transition past this timestamp so clients can read their own writes" (request_manager.ts). This is our actions-resolve-after-deltas-apply rule, independently derived. Mutations additionally execute "one at a time in a single, ordered queue" client-side ([mutation docs](https://docs.convex.dev/functions/mutation-functions)) — the ordering half of our numeric outbox sequence.

### Boot + reconnect choreography

No persistence → boot is always network-bound: connect, send the query set, server executes everything, full results stream back. No hydrate-from-disk, no render-before-network. Linear-grade instant boot is exactly what their local-first alpha chases (§4). Reconnect: `Connect { sessionId, maxObservedTimestamp }` then re-add queries and resend mutations — positions over sessions, same philosophy as our cursor resume, with the timestamp as a global cursor. One thing they have that we deliberately don't: **the whole query set advances atomically** — a `Transition` moves every subscribed query from `startVersion` to `endVersion` at one logical timestamp, so the client never renders queries at mixed snapshots. Our per-channel cursors tear at boot (channels snapshot independently; txid grouping covers live writes only, ws-protocol §2). See candidates.

### Schema + validation

[defineSchema/defineTable](https://docs.convex.dev/database/schemas) with `v` validators. **Required is the default, `v.optional()` opts out** — the inverse of our optional-by-default (plan.md Schemas). Discriminated unions ship today (`v.union` + `v.literal`) where our variants story is deferred. Enforcement is two-point: schema push validates **all existing documents** (deploy fails on violation) and runtime validates every `insert`/`replace`/`patch`. `schemaValidation: false` is the gradient's bottom rung — schemaless works, "Day 1 ease, Year 2 power" ([How Convex Works](https://stack.convex.dev/how-convex-works)), the same graduation philosophy as scenario-hobbyist's "schema arrives when the app earns it."

[Migration posture](https://stack.convex.dev/intro-to-migrations): "Convex will not let you change the type to something that doesn't conform to the data in production" and "will not let you remove a field from a schema if that field still has data in the database." The sanctioned path is union-type transitions plus online migration mutations (dual-write preferred, dual-read alternative), packaged as a migrations component. "Once a database gets large enough, many migrations can only be run asynchronously" — the same live-system migration reality our Migration Window names (scenario.md), with guardrails our spec doesn't yet have.

### Permissions

Code gates at named entry points, period — the posture our Security Posture survey already classifies Convex under (plan.md). No row-level rules engine, no allow/deny, no wire-level document edits. Auth arrives via `Authenticate` messages (token-based, versioned separately from the query set so identity changes invalidate correctly). Queries embed their own auth logic and the read set makes it reactive for free. Our two-gates design (channel permission at subscribe, operation permission at call) is the same family with the read gate hoisted to subscribe time — cheaper (auth runs once per subscription, not inside every re-run) and correspondingly less reactive (our revocation is the explicit `server.revoke` + `nosub 4202`, theirs falls out of re-execution).

### Presence / ephemeral tier

**No ephemeral tier exists — presence rides the durable database.** The [original pattern](https://stack.convex.dev/presence-with-convex): a `presence` table, heartbeat mutations every 5s, single-flighted updates, reactive queries fanning it out. The [current presence component](https://github.com/get-convex/presence) exists specifically to mitigate the cost of that choice: "It can be tricky to implement presence efficiently, without any polling and without re-running queries every time a user sends a heartbeat message" — scheduled functions arrange that "clients only receive updates when a user joins or leaves the room." Every heartbeat is still a function call and a database write into the transaction log. Nobody runs 20-30Hz cursors through this — single-flighting caps update rate at roughly one per round trip. This is the strongest external validation of our ephemeral collections tier (plan.md Ephemeral Collections): when the only pipeline is durable, presence engineering becomes cost-avoidance engineering. Their whole component is the workaround for the mispricing our `ephemeral: true` flag removes.

### Pagination / windowing

[Cursor-based](https://docs.convex.dev/database/pagination): `.paginate(paginationOpts)` returns `page` + `continueCursor` + `isDone`, `usePaginatedQuery` accumulates pages. The clever part is the **QueryJournal** (protocol.ts): "A journal is produced when a query function first executes and is re-used when a query is re-executed" — page boundaries freeze at first execution, so re-runs keep the same range and pages stay reactive without overlap or gaps. Documented consequence: "Page sizes in Convex may change!" — deletes shrink a page, inserts grow it, adjacent pages stay contiguous. This is the same wart-dissolution our plan reaches via keyset-anchored windows for routed channels (plan.md Pagination splits by layer) — both designs concluded offset windows are unsound under live writes and anchored pages to data positions instead. Their growing-page semantics is the cleanest articulation of the reactive-pagination contract in the field.

### Client bundle size + boot cost

Measured locally (esbuild bundle, minify, gzip, convex@1.41.0, 2026-06-12):

| entry | min | gzip |
|---|---|---|
| `ConvexClient` (convex/browser) | 66.1KB | **18.3KB** |
| React client + hooks (convex/react, react external) | 74.0KB | **20.9KB** |

This number matters and cuts the unexpected way: **Convex proves a queries-as-subscriptions client can be ~10× smaller than Zero's 232KB gzip.** The thin client is a structural consequence of their topology — no local query engine, no persistence layer, no rebase machinery beyond query-result patching. The replica road our spec takes puts the mongo-subset matcher, the rebase engine, and the IDB layer client-side. The CDN-rung bundle bar (scenario-hobbyist.md: "small enough to not embarrass the CDN rung") must be budgeted against the fact that the architecture we chose is the one that grows clients, and the architecture we rejected produced an 18KB one. Boot cost is the mirror image: their thin client buys nothing at boot (every load is a full network round trip per query), ours buys hydrate-from-IDB render-first boot.

### Operational ceilings

[Hard limits](https://docs.convex.dev/production/state/limits): 1MiB/document, 1024 fields/document, nesting depth 16, 8192 array elements, 16MiB read / 16MiB written / 32k documents scanned per transaction, 1s query/mutation execution, 10min actions, concurrency by deployment class (e.g. S256: 256 queries + 256 mutations concurrent). Our aggregate (~150-200KB, depth ~10, 50-200-row keyed arrays — scenario.md Parameters) fits inside the document limits, with the 1024-fields ceiling worth a precision check against several-thousand-leaf-paths fill.

**The hot document is their named pathology.** [OCC docs](https://docs.convex.dev/database/advanced/occ) promise "you never need to worry about temporary data races. We can run several retries if necessary until we succeed" — but the [error docs](https://docs.convex.dev/error) draw the ceiling: the OCC failure message reads "Documents read from or written to the table changed while this mutation was being run and on every subsequent retry," and guidance is to read narrowly, audit call rates, and "Design your data model such that it doesn't require making many writes to the same document." If a mutation is called faster than Convex can execute-and-retry it, executions fail. The sanctioned workarounds are components: **Sharded Counter** ("spreading writes over multiple documents") and **Workpool** (serialize contended work through a queue).

At our design point — 10-100 co-editors, 33-330 calls/sec against one document, mostly disjoint fields (scenario.md Concurrency Model) — read-modify-write mutations on the aggregate would conflict pairwise (read sets are row-granular: any mutation that reads the doc conflicts with any concurrent write to it, regardless of field disjointness). The retry machinery serializes them at best and sheds load at worst, and the official answer is "shard the document," which is precisely the aggregate-scattering our scenario's Aggregate-Document Principle exists to refuse. Caveat for honesty: blind `db.patch` without a prior read keeps the doc out of the read set and `patch` merges at the top-field level, so carefully-written write-only mutations could reduce conflicts — but realistic mutator bodies read for validation, and our four-phase pipeline (permission/schema/check) reads by design.

What serializability buys that our path-granular LWW gives up: mutators can enforce cross-field invariants by read-check-write with zero races, and composed writes are all-or-nothing against a consistent snapshot. Their stated position ([How Convex Works](https://stack.convex.dev/how-convex-works)):

> "We believe that any isolation level less than serializable is just too hard a programming model for developers."

> "many developers think they're getting more than they actually are from their database, and their applications have subtle latent bugs that only show up at scale."

This is the strongest argument in their corpus against our conflict model, and the adversarial review should have it verbatim. Our answer lives in the scenario, not in preference: at 10-100 co-editors on one document, serializable read-modify-write means either retry storms or sharding the aggregate, while disjoint-path merge is exactly the everyday shape (scenario.md: "disjoint paths merge silently... same-field simultaneous editing is the rare case"). But the quote exposes a real hole on our side — plan.md never states what isolation authoritative mutator bodies get when two of them interleave server-side on one doc (see candidates #1).

## 4. Rationale Archaeology

**The local-first pivot toward our territory.** The [object sync engine essay](https://stack.convex.dev/object-sync-engine) (Sujay Jayakar) is Convex describing the road to a persistent local store with local queries — the territory our spec starts in. What they name as hard, verbatim:

> "Preloading exactly the right amount of data is hard, since it's a global property based on all of the possible UI views within the app. Preloading too little will cause spinners and waterfalls, where preloading too much wastes storage and network bandwidth."

— which is our channel-scope declaration problem (plan.md Decision 4) plus our coverage checker (plan.md Client Store: the silently-incomplete-query trap, checker promoted to v1-required). They also name the dual-implementation tax of their own optimistic model: developers "implement mutations twice — once for server, once for optimistic local updates," managing schema divergence between local and server stores. And query waterfalls: "Clients currently experience a waterfall when they have one query that's dependent on the other."

The working artifact is [curvilinear](https://github.com/get-convex/curvilinear) — an alpha offline sync engine, IndexedDB local store with a projected schema, `ctx.localDb` synchronous local queries, dual-component mutations (server pointer + local callback), replay of in-progress mutations after restart, demoed as a minimal Linear clone. Status: alpha, 24 commits, 13 stars, "We have deterministic simulation testing set up but haven't exercised it and wrung out all the bugs yet." Read: the company with the best-engineered queries-as-subscriptions system is building channel-replica-flavored local-first as its next act, and its earliest design (local schema projection, synchronous local reads, mutation replay) recapitulates our plan's spine. The [Automerge integration](https://stack.convex.dev/automerge-and-convex) covers the CRDT-document flank the same way our `type: 'crdt'` seam does (scenario.md Out of Scope).

**Taxonomy essays.** [A Map of Sync](https://stack.convex.dev/a-map-of-sync) gives the 9-dimension classification (size, update rate, structure, latency, offline, concurrency, centralization, flexibility, consistency) and the Linear datapoint that validates lazy per-channel hydration: Linear "moved some data fetches to either become asynchronous or purely on-demand. This is great for performance but degrades offline functionality." On conflicts: "there's often no single algorithm that works for handling concurrent modifications for any non-trivial data structure" — their justification for server-authority, same conclusion as our Decision 1.

**Reversals and corrections, paid for in production:**
- **Closed → FSL open source** (2024): lock-in fear was suppressing enterprise adoption, their own retro says so.
- **Presence through raw reactive queries → presence component**: the durable pipeline was mispriced for ephemera, the component is the workaround (§3 presence).
- **Full-result push → roadmap deltas**: the granularity gap is acknowledged as future work in their own essay (§3 delta granularity).
- **Cloud-only → curvilinear local-first alpha**: boot latency and offline are the admitted gaps of the thin-client topology.
- **Hot-document OCC → sharded counter + workpool components**: contention workarounds shipped as first-party platform pieces, which is the system admitting the ceiling is real.

**Platform-coupling friction in the wild**: [HN discussion](https://news.ycombinator.com/item?id=40034067) frames lock-in as the standing worry ("how business locked-in would we be..."), answered by self-hosting + FSL. The friction users actually report is the inverse of ours: their floor requires adopting a database, a function runtime, a deployment system, and TypeScript end-to-end before the first checkbox syncs. The hobbyist rung (scenario-hobbyist.md: script tag, one server command, no external services) has no Convex equivalent — `npx convex dev` is excellent but it is an account-or-local-deployment, codegen, and a bundler culture. Their "Day 1 ease" is real within npm+TypeScript land and absent outside it.

## 5. Candidates Table

Pricing rule applied throughout: a candidate that needs their bundle or their dedicated service tier says so. Convex's client is small (18-21KB gzip) but every interesting server behavior (read sets, OCC, subscription manager) requires their integrated Rust backend — those are never adoptable as mechanisms, only as contracts.

| # | kind | topic | their design | spec impact | scenario anchor |
|---|---|---|---|---|---|
| 1 | **adopt** | Isolation statement for authoritative writes | "Less than serializable is too hard a programming model" — every mutation is a serializable tx, documented | plan.md Write Path / Execution Without Fibers is silent on what isolation two interleaving authoritative mutator bodies get on one doc (serial per doc? per collection? interleaved with LWW?). Adopt the *discipline*: a stated isolation contract in the spec + what invariants mutator `check`/`run` may rely on. Costs a paragraph now, an architecture fight later | 10-100 co-editors; hard-fail taxonomy — silent cross-field invariant violation is a hard fail (scenario.md Failure Taxonomy) |
| 2 | **confirmed-divergence** | Queries-as-subscriptions vs channel replicas | Server-evaluated query functions with read-set invalidation, full-result push, thin client | plan.md Decision 4 stands. At 33-330 writes/sec on the hot doc, full-result re-push is ~5-6MB/s/subscriber vs our ~5-10KB/s field deltas, and per-re-run metering makes liveness a billable event. Their own roadmap ("pushing smaller deltas to the client") points at our wire | scenario.md Canonical Load Figures — frame rate and byte mass on `trips.byId` |
| 3 | **confirmed-divergence** | OCC serializable conflicts vs path-granular LWW | Doc-granular read sets → concurrent read-modify-writes on one doc conflict pairwise; official ceiling: "design your data model such that it doesn't require making many writes to the same document," sharded-counter/workpool as sanctioned workarounds | plan.md Decision 1 + Sync Loop guarantees stand. Their model would retry-storm or shard our aggregate — sharding is the aggregate-scattering the scenario exists to refuse. Carry their isolation quote as the steelman; answer is the scenario's disjoint-path concurrency profile, plus candidate #1 closing our own isolation hole | scenario.md Concurrency Model + Aggregate-Document Principle |
| 4 | **adopt** | Schema migration guardrails | Schema push validates all existing production documents, field removal blocked while data exists, union-type transitions, dual-write/dual-read online migration doctrine, migrations packaged as a component | plan.md Schemas + Migration Window: we have epochs for wire reshaping but no validate-against-existing-data discipline and no written dual-write doctrine. Cheap to adopt at the spec level (a dev-time check + a documented pattern), no Convex machinery needed | scenario.md Migration Window — routine migrations against live operators |
| 5 | **reconsider** | Bundle budget framing | 18.3KB gzip browser client, 20.9KB with React hooks (measured) — ~10× under Zero | scenario-hobbyist.md bundle bar ("number TBD"): the thin client is a property of the topology we rejected, so our replica client (matcher + rebase + outbox + IDB) must be budgeted line-item by line-item. Zero's 232KB is not the category floor — Convex is the existence proof of a small sync client, and our CDN rung will be compared to it | hobbyist |
| 6 | **confirmed-divergence** | Durable outbox | In-memory mutation queue, resent on reconnect (requestId-idempotent), lost on reload; actions cancelled on reconnect | plan.md Decision 3/10 stands: IDB-durable outbox is the implicit-save lost-work bar. Their posture is fine for online-first apps and fails our "reload costs zero work" envelope. Their resend-completed-to-advance-watermark trick mirrors ws-protocol §5 step 3 — convergence evidence, keep | scenario.md Failure Model — implicit save, dev-restart/sleep-wake envelope |
| 7 | **confirmed-divergence** | Single isomorphic optimistic body vs dual implementation | `withOptimisticUpdate` is a second hand-written implementation per call site, with documented corruption footguns ("Always create new objects"); their own essay lists implement-twice + schema divergence under hard problems | plan.md Write Path (mutators simulate by running the same body) is validated by the cousin's own pain. Their "rerun optimistic updates when local results change" is a rebase — same mechanism as our shadow-replay, theirs at query grain, ours at doc grain | scenario.md Write Pattern — implicit save needs optimistic-by-default, not optimistic-by-ceremony; hobbyist concept count |
| 8 | **confirmed-divergence** | Ephemeral tier | Presence/typing/cursors ride the durable DB: heartbeat mutations, log writes, scheduled-function machinery to avoid re-runs; update rate capped by single-flighting; every heartbeat is billable | plan.md Ephemeral Collections validated: their presence component is a cost-avoidance workaround for a missing tier. 15-30Hz cursors are not seriously attemptable through their pipeline | scenario.md True-realtime surfaces — multi-station offloads |
| 9 | **reconsider** | Cross-query consistent snapshots | `Transition` advances the entire client query set to one logical timestamp — no torn rendering across queries, ever, including boot | Our per-channel cursors tear at boot (independent snapshots) — txid grouping (ws-protocol §2) covers live writes only. Likely resolution: accept + disclose as a bounded soft fail (one dominant channel + small reference collections makes torn boot windows narrow), but the spec should say so explicitly rather than inherit it silently | scenario.md Failure Taxonomy — classify the torn-boot window; Channel Topology (one dominant channel shrinks exposure) |
| 10 | **adopt** | Scheduler as the mutation→action bridge | Mutate-then-schedule: mutation records intent in the DB, schedules the action, DB invariants dedupe; scheduler + workpool + crons became load-bearing platform surface | plan.md Execution Without Fibers defers "durability ordering for external effects" with the idempotency key named. Convex's pattern is the production-proven answer: adopt at minimum as the documented server-side pattern, consider a minimal `schedule`/queue primitive in the reference server. Their full scheduler is platform-tier — say so | scenario.md Write Pattern — business actions (submit the landing declaration, close settlement) with external services |
| 11 | **reconsider** | searchIndex declaration + bounded scan | Schema-level `.searchIndex({ searchField, filterFields })`, BM25, prefix match on final term (typeahead-correct), reactive + transactional, hard caps: 1024 docs scanned, 16 terms, 16 filter fields | plan.md Search indexes: strong convergence (declared searchable fields, prefix default for incremental typing). Adopt their limits-honesty — declare scan/result ceilings in the searchIndex contract per engine. Their always-reactive search rides the platform's read sets; our `live: false` default is the economic divergence and stands | scenario.md Channel Topology — dashboards nonreactive by default; ~50 personal-args viewers |
| 12 | **confirmed-divergence** | Invalidation: runtime read sets vs static selectors | Read-set capture inside their function runtime gives precise invalidation for arbitrary code, no declarations | Requires owning the runtime — the exact coupling Decision 9 refuses (server = maintenance boundary, reference Node+Redis). Our split: static selector routing for the 90% + recompute channels for opaque handlers is the uncoupled equivalent. Note honestly: theirs is strictly more precise for arbitrary handler logic | scenario.md infrastructure posture + hobbyist "zero deps beyond Node" |
| 13 | **adopt** | Published operational ceilings | A single limits page: doc size, tx read/write bytes, scan counts, execution time, concurrency per tier | Our spec has thresholds scattered in prose (collapse threshold, maxBufferedBytes, parking age). Adopt the artifact: a consolidated limits table in the protocol/reference-server spec, hobbyist-defaulted. Operational honesty is also what made their hot-doc ceiling discoverable | both scenarios — disclosure discipline (soft fails "bounded, disclosed") |
| 14 | **reconsider** | Pagination journal semantics | QueryJournal freezes page boundaries at first execution; pages grow/shrink under live writes, adjacent pages stay contiguous — "Page sizes in Convex may change!" | plan.md Pagination: our keyset-anchored windows for routed channels are the same conclusion (offset unsound under live inserts). Their growing-page contract is the cleanest articulation of reactive pagination — worth stealing the *semantics statement* for our windowed-channel docs, mechanism already matches | scenario.md Read Pattern — live windows want "comprehensible motion" |
| 15 | **adopt** | Read-your-writes via observed-timestamp gating | Mutation promise resolves only after a Transition past the mutation's ts; completed mutations resent on reconnect purely to advance the transition point | ws-protocol §2 result-resolution (txid-applies) and §5 watermark trim are the same design discovered independently — adopt nothing structural, but record the convergence as validation evidence in the spec's lineage notes (three independent designs: Replicache lastMutationID, Convex ts-gating, our txid rule) | scenario.md Write Pattern — "typed means saved" requires honest settlement |
| 16 | **confirmed-divergence** | Platform coupling + adoption floor | DB + function runtime + sync protocol inseparable, FSL-licensed, self-hostable but cloud-shaped; TypeScript-only, codegen, account-or-local-deployment before first sync | plan.md Decision 9 + Adoption Gradient stand. Their open-sourcing was a reaction to lock-in fear — evidence the maintenance-boundary worry is real at enterprise. And the hobbyist rung (script tag, one file, no build) simply does not exist in their universe | hobbyist — minutes-to-first-sync with no npm; scenario.md server-ownership posture |
| 17 | **adopt** | Required-by-default schema fields (examine, then decide) | `v.optional()` is the opt-in, required the default, push-time enforcement against production data makes it true | plan.md Schemas chose optional-by-default ("required markers tend to be noise"). Convex's inverse works *because* push-time validation enforces it against real data — without that enforcement loop, required-by-default is aspiration. Re-examine once candidate #4's validate-against-data lands; if we keep optional-by-default, record why against this counterexample | scenario.md Document Shape — thousands of field definitions, wide optional variance favors optional; hobbyist favors schemaless-first |

## Sources

Primary, fetched 2026-06-12:

- https://stack.convex.dev/how-convex-works — architecture, OCC, subscription manager, isolation rationale
- https://stack.convex.dev/object-sync-engine — local-first direction, hard problems, delta roadmap
- https://stack.convex.dev/a-map-of-sync — sync taxonomy, Linear datapoint, conflict rationale
- https://stack.convex.dev/presence-with-convex — DB-backed presence, caching economics
- https://stack.convex.dev/intro-to-migrations — migration doctrine
- https://stack.convex.dev/automerge-and-convex — CRDT flank
- https://docs.convex.dev/functions/mutation-functions — mutation semantics, ordered queue
- https://docs.convex.dev/functions/actions — action semantics, runtime split, non-atomicity caveat
- https://docs.convex.dev/functions/query-functions — caching/reactivity/consistency triad
- https://docs.convex.dev/database/advanced/occ — OCC mechanics and retries
- https://docs.convex.dev/error — OCC failure guidance, hot-document advice
- https://docs.convex.dev/database/schemas — defineSchema, validators, enforcement
- https://docs.convex.dev/database/pagination — cursors, growing pages
- https://docs.convex.dev/search/text-search — searchIndex, BM25, limits
- https://docs.convex.dev/production/state/limits — hard ceilings
- https://docs.convex.dev/understanding/zen — best-practice philosophy
- https://docs.convex.dev/components — component sandbox model
- https://github.com/get-convex/convex-backend — repo stats, self-hosting, LICENSE.md (FSL-1.1-Apache-2.0)
- https://github.com/get-convex/convex-backend/blob/main/npm-packages/convex/src/browser/sync/protocol.ts — wire protocol (read raw)
- https://github.com/get-convex/convex-backend/blob/main/npm-packages/convex/src/browser/sync/request_manager.ts — mutation queue source (read raw)
- https://github.com/get-convex/curvilinear — local-first alpha
- https://github.com/get-convex/presence — presence component README (read raw)
- https://www.convex.dev/pricing — commercial dimensions
- https://news.convex.dev/convex-raises-24m/ — funding/adoption claims
- https://news.ycombinator.com/item?id=40034067 — lock-in discussion (via search)

Bundle sizes measured locally: convex@1.41.0, esbuild --bundle --minify --format=esm, gzip -9, react externalized for the react entry.

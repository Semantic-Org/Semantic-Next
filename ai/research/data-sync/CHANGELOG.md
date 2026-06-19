# data-sync spec — changelog

Spec changes made as the implementation iterated toward this proposal's goals.
Each entry records **what in the spec changed and why**. Only genuine changes are
listed — parts not yet built remain exactly as the spec describes them (still goals,
not changes). Git history is the fine-grained record; this is the human-readable index.

## 2026-06-19

- **Liveness → a single `freshness` enum.** *(plan.md — publication config.)* The split
  liveness model — publications implicitly live (invariant 6) plus a separate
  `live`/`refresh` knob set on the search verb — is unified into one per-publication
  `freshness: 'live' | '<duration>' | 'manual'` (default `'live'`). **Why:** one concept
  that reads the same everywhere beats two mental models; per-verb *defaults* can still
  differ. Capabilities like the spec's `refresh: 'own-writes'` survive as still-unbuilt
  `freshness` values — the surface changed, not the capability set.

- **Subscription handle → `{ ready, stale, state, freshness, updatedAt }`.** *(plan.md
  §handles; ws-protocol §6.)* Keeps the `ready`/`stale` booleans, **adds** a `state` enum
  (`loading｜stale｜current`) and `freshness` (the declared contract, wire-disclosed), and
  replaces the client-side `lastDeltaAt` with `updatedAt` — the **server-side** wall-clock
  of the last change, disclosed on the live frame. **Why:** `updatedAt` is absolute
  staleness ("as of 30s ago"), which a client-side last-applied time cannot express.
  Error-surfacing (a `reason` on the handle) remains an open v2 gap — *not* closed.

- **Cross-channel `txid`/`spans` → not implemented in v1, reserved.** *(ws-protocol §2,
  §7.)* No measured workload required cross-*independent*-channel atomic visibility. v1
  guarantees atomicity **within a channel/frame**; a multi-collection transaction rides a
  single channel spanning those collections, committed in one frame. **Why:** the common
  case is covered without transaction-group bookkeeping. The mechanism is retained as
  **reserved** (the wire fields are already optional, so it returns without a breaking
  change) and removed from the §7 "fixed forever" list.

- **Open question §8.4 (progressive snapshot paint) → resolved.** *(ws-protocol §8.)*
  Atomic commit at `live` by default; progressive chunk-by-chunk reveal is a marked
  exception permitted **only on a verifiably cold pool** — the snapshot carries an `order`
  and a declared `total`, and the channel has no local docs, pending, or shadows. **Why:**
  huge-channel first boot can paint progressively without the silently-incomplete-query
  trap; the declared `total` makes the Meteor-era climbing row count structurally
  impossible.

### Deferred — no change made (the spec stands)

- **Publication signature** — the implementation currently expresses the publication as
  `find(args)` + `allowed(args, context)` rather than the spec's `permission` (capability
  token) + static `filter` baseline + `handler`. This is **not** decided against: the
  token model is auditable ("what can an auditor see is a grep") and the static `filter`
  is field-set-analyzable — both worth keeping. Deferred to a dedicated security pass; the
  likely end shape is **both** (declarative tokens as the audited default, `allowed()` as
  a third-party escape hatch).

### Cost model — ratified after re-run (2026-06-19)

- **scenario.md "the real cost is router selector-matching" → fan-out, not matching.**
  Held pending a fresh stress run against the current kernel; that re-run (HEAD kernel
  `53a69ce`, v2-frozen harness, clean box) confirmed it: matching flat (~14% CPU at 6000
  channels, ×1.31 over 200→6000), the capacity knee fan-out-bound (CPU ×0.12 as orgs scale
  1→300), channel scope the dominant lever. **Scoped capacity held identical to the frozen
  baseline** (raw 1500 clients at the instant tier, knee not reached, 62% CPU @1500) — no
  regression from the large post-baseline changeset. scenario.md §"Migration Window" updated.

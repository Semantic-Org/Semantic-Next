# Data sync layer — START HERE

> Read this before `plan.md` or `scenario.md`. Those carry design intent. The decisions are
> settled, here and in `reference-comparison.md`. Agents keep reopening ground that was
> already closed because they start in the planning docs and read rulings as open questions.
> Don't.

**Status.** The design is settled. `plan.md` is the spec and carries the dated rulings,
`reference-comparison.md` is the decision record. The design is validated by a working
prototype. The packages land in this repo on a feature branch once the first robust storage
adapter is proven. Until then this corpus is the canonical design reference.

## Settled, do not relitigate

Each item is closed. The cited ruling holds the reasoning and the rejected alternatives. If
you believe one is wrong, the bar is the rejected-attacks section of `reference-comparison.md`,
which already argues the strongest form of the counter-case. Beat that, in writing, before
reopening anything.

- **Offline-tolerant, not offline-first.** Park-then-verify with per-path evidence, no
  long-offline merge for shared data. (plan Decision 10, comparison amendment 3)
- **Per-doc serial apply.** `SELECT FOR UPDATE` or an in-process queue, group-commit for hot
  docs. Not OCC, not free last-write-wins interleave. (amendment 2)
- **Write-path is the primary change feed.** CDC and `watch()` are the integration backstop
  for writes that originate outside the layer, never the primary delta source. (amendment 4)
- **Two-level cursor.** Per-channel, opaque, client-held. The cursor (gap detection) and the
  log (an economics knob, `retention: 0` is legal) are separate commitments. Single-node is
  free by mortality, multi-node is a transactional outbox plus an idempotent receiver.
  (amendments 4 and 8)
- **Shared fan-out per `(name, args)`.** Stateless nodes, no per-client view records, no
  sticky sessions. (comparison, Zero rejection 4)
- **Adoption gradient.** Local collections graduate to synced without a rewrite. The
  brownfield trial defaults to poll-and-diff `watch()`, logical replication is the production
  graduation. Top-level scalar keys become typed columns, depth lives in JSONB. (plan
  Adoption Gradient, amendment 10, Decision 11)
- **Channel-scoped pools with re-run and reconcile.** Not client-side IVM, not a thin
  server-only client. (Decision 4, amendment 22)
- **Authorize operations,** at subscribe and at call, never per-edit or per-message. (plan
  Security Posture, amendment 5)
- **The layer owns the write path, storage is an adapter behind it.** Not a cache over your
  database, not the database itself. (Decision 11)

## Read in this order

1. **`scenario.md`** — the ground-truth workload. When the design and the scenario disagree,
   the scenario wins or gets amended.
2. **`plan.md`** — the design and decision record. Carries the dated rulings inline.
3. **`reference-comparison.md`** — the 28 rulings against Zero, Supabase Realtime, and Convex,
   plus the rejected attacks (the spec's tested armor). The "what is settled and why" doc.
4. **`ws-protocol.md`** — the wire spec.
5. **`research/`** — the nine-agent grounding pass. Read only when going deep on one axis.

## The folder

- `scenario.md` / `scenario-hobbyist.md` — the ground-truth workload, and the hobbyist rung.
- `plan.md` — architecture, decision record, sync loop, channels, schemas, priors audit.
- `reference-comparison.md` — rulings, needs-bench, watch list, rejected attacks. Dossiers in
  `research/`.
- `ws-protocol.md` — the wire spec. `ws-protocol-review.md` is its referee pass.
- `reactivity-review.md` — every plan claim audited against `packages/reactivity` source.
- `vetting-report.md` — the five-lens vet of the corpus, verdict revise-then-build.
- `r2-briefs.md` — the round-2 design briefs.
- `storage-and-scale.md` — the storage shape and scale framing.
- `todomvc/`, `invoices-table/` — API steelmans, real example templates against the sync API.
- `research/` — the grounding pass: `primitives-*` (repo readers), `landscape-*` (web
  research: Meteor, 2026 engines, storage, transport), `deep-*` and `crossexam-*` (the
  reference dossiers and their adversarial reviews).

## Concept coverage map

| Concept | todomvc | invoices-table | invoice-editor (unbuilt) |
|---|---|---|---|
| Collections + schema | ✓ | ✓ | |
| Mutators (incl. multi-collection) | ✓ | ✓ | |
| Methods (awaited, pending UI) | ✓ publish/import | | |
| `subscriptions` section (provision, status handles) | ✓ | ✓ reactive args + window face | |
| `queries` section (pool reads, binding boundary) | ✓ dual declaration | — (window read via instance bridge) | settings-panel scenario (local rung) |
| Collection helpers | | ✓ summary/isOverdue | relation helpers |
| searchIndex factory + liveness tiers | | ✓ live:false, match vocab | |
| Drafts + `{#form}` | edit-on-blur only | ✓ modal, two modes | repeating groups, path-scoped |
| Connection-state surface | ✓ banner + pending | | conflict surface, dead-letter UX |
| id-addressed array paths | | | ✓ line-items editor |
| Computed/override field states (autofill-trust) | | | ✓ estimated fields + revert |
| Folder convention (`collections/[name]/`) + late attach | inline (small rung, deliberate) | ✓ one file per mutator/publication/search | |
| Ephemeral collections (presence/cursors) | | | ✓ viewers on detail |
| Field projections per role | | ✓ two publications | per-role tiers |

The unbuilt column is the invoice-editor's commission.

## Context worth keeping

In the Meteor-era architecture, redis-oplog handles oplog tailing, per-write deep-clone cost
is a known but minor tax, and the absence of fine-grained reactivity at the partial border is
the structural cost this plan targets. Linear (performance.dev breakdown) independently
rebuilt the same architecture this plan proposes: memory pool, IDB write-behind, field deltas
over WS, Redis sync state.

# Sync layer design — 2026-06-09

Everything from the DB sync layer design session, one folder.

- [`scenario.md`](scenario.md) — **the ground truth workload**: document shape, channel topology, write/read/concurrency model, ownership partition, canonical load figures, parameters awaiting confirmation. When design and scenario disagree, scenario wins or gets amended
- [`plan.md`](plan.md) — the design: architecture, decision record, sync loop, channels, schemas, drafts, priors audit, de-risking
- [`reactivity-review.md`](reactivity-review.md) — four-bucket audit of every plan claim vs packages/reactivity source, adversarially checked, plus the unaddressed-interaction permutation map
- [`ws-protocol.md`](ws-protocol.md) — the full wire spec recommendation (Fable synthesis over three research voices): framing, message schemas, connection state machine, resume choreography, consumer surface
- [`ws-protocol-review.md`](ws-protocol-review.md) — five-voice referee choir on the wire spec: invariants ×2, lost-work ×2, realistic-usage walkthrough. Six-theme revision list up top
- [`vetting-report.md`](vetting-report.md) — **the gate**: five-lens Fable vet of the complete corpus (coherence, cold read, drift, blind DX ×2 — full per-lens reports and blind-dev builds remain in the private workspace). Verdict: revise-then-build, with the ranked revision list
- [`todomvc/`](todomvc/) — API steelman: the `examples/src/todo-list/` TodoMVC rewritten against the fake sync API, templates unchanged
- [`invoices-table/`](invoices-table/) — trifecta steelman: table + searchIndex channel factory + row menu + edit/add modals, with the 0a sore-point review list. Uses inline config (correct at its scale) — the invoice-editor scenario should demonstrate the `collections/[name]/{methods,mutators}/` folder convention
- [`research/`](research/) — nine-agent research pass that grounded it
  - `primitives-*.md` — repo readers: reactivity, trackWrites, renderer, component surface, prior art
  - `landscape-*.md` — web research: Meteor retrospective, 2026 engines, client storage, transport

## Concept Coverage Map

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

Context worth keeping with the artifacts: in the Meteor-era architecture, redis-oplog handles oplog tailing, per-write deep-clone cost is a known but minor tax, and the absence of fine-grained reactivity at the partial border is the structural cost this plan targets. Linear (performance.dev breakdown) independently rebuilt the same architecture this plan proposes — memory pool, IDB write-behind, field deltas over WS, Redis sync state.

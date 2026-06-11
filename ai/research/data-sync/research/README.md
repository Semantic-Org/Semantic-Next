# Sync layer research (2026-06-09)

Nine-agent research pass for the SUI data sync layer design discussion. Five readers over repo primitives, four web researchers over the 2026 landscape. All file:line refs are working-tree on branch observe-writes, source traces not test-verified.

- [primitives-reactivity.md](primitives-reactivity.md) — Reactivity package — Signal, Reaction, Dependency, flush semantics
- [primitives-trackwrites.md](primitives-trackwrites.md) — trackWrites / mutate — mutation capture, clone/equality/id utils
- [primitives-renderer.md](primitives-renderer.md) — Renderer — each reconciliation, FGR, async block, update granularity
- [primitives-component.md](primitives-component.md) — Component/query — callParams, settings, helpers, integration surface
- [primitives-prior-art.md](primitives-prior-art.md) — Prior art in repo — existing data/persistence patterns, roadmap
- [landscape-meteor.md](landscape-meteor.md) — Meteor/minimongo retrospective — DDP, mergebox, oplog, postmortems
- [landscape-engines.md](landscape-engines.md) — 2026 sync engines — Zero, Electric, PowerSync, Instant, convergent patterns
- [landscape-storage.md](landscape-storage.md) — Client storage 2026 — IndexedDB, OPFS/SQLite, multi-tab, quotas
- [landscape-transport.md](landscape-transport.md) — Transport 2026 — WS/SSE/long-poll, resumability, protocol lessons

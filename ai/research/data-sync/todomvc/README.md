# TodoMVC with db sync — API steelman

The localStorage TodoMVC from `examples/src/todo-list/` rewritten against the sync layer. Fake API, real reading experience.

## The diff that matters

**Unchanged:** `todo-item.js`. `todo-item.html` gained `data-id` on its four interactive elements (the event-delegation hook), otherwise identical. `component.html` changed in three places: `{#if hasTodos}` became `{#if todos.length}` (deleting the `hasTodos` helper), the footer counts became named derivations (`{count activeTodos}`, `{#if count completedTodos}`) plus the publish button and share link, and the connection banner block is new. Children stay dumb, receiving docs through normal subtemplate data flow.

**Deleted from `component.js`:** `STORAGE_KEY`, `loadTodos()`, the persistence reaction with its firstRun guard, `todos: []` from defaultState, `generateID`, and every action body that mutated `state.todos`. What remains in state is UI state only (`filter`, `editingId`) — the boundary between synced data and local state falls exactly where it should.

**One import, two write vehicles.** Mutators are the realtime half — sync isomorphic bodies, optimistic apply, fire-and-forget (`Todos.toggle(data)` — effects visible now). Actions are promises to complete something on the server — async bodies, no simulation, awaited (`await Todos.publish()` returns the share URL, `Todos.import({ url })` streams todos back through the channel). The call site tells the truth about which you're holding. Both attach to the collection as namespace, share the permission → schema → check → run pipeline, and raw `insert`/`update`/`remove` are ambient-privileged inside running bodies — the public write surface is the named operations, which is the no-allow/deny stance made structural. Reads are **two stages: provision, then read**. The `subscriptions` section says what this component needs from the server, deduped with other components (`subscribe('todos.all')` returns a status handle — `ready`/`stale` — never data; the address derives from the publication, `collection.name`). The `queries` section says what reads run over the pool once data is there (`todos: () => Todos.find()`). Same name in both sections is legal and unambiguous: subscriptions never join the template data context, so `{todos}` is always the query. The flat context is queries + settings + state + instance; in JS the bags stay categorical — `subscriptions.todos.ready`, `queries.todos` — params are categories, never the things themselves. Downstream is pure JS: `completedTodos() { return queries.todos.filter(todo => todo.completed) }` — plain array methods in instance helpers, no selectors mixed into component logic or templates. Templates consume named derivations: `{count completedTodos}`. The trinity reads: subscriptions provision, queries read, instance helpers derive, state is local. The dev-mode coverage checker (selector subsumption against live channels) guards the pool-read trap.

**New files:** `todos.js` (collections + schemas + six mutators + two actions, ~105 lines, imported by both sides), `client.js` (one call), `server.js` (~15 lines).

## What each file buys

- `todos.js` — the whole data model. Mutators can be multi-collection: `add` and `delete` write Todos *and* Activity in one envelope (the audit-log shape) — collection count doesn't decide the vehicle, simulation and contract do. `publish` and `import` are the action cases: unsimulatable, awaited, return values. `publish` snapshots into a `shares` collection the client never subscribes to and returns the URL — a simulated publish would show a link that 404s until confirm, so it doesn't pretend. The client never subscribes to `activity`, so its simulated writes are invisible locally and land authoritatively on the server — a write-only collection from the client's perspective, no special casing. Validation is the same `throw` on both sides: client throw blocks the send and surfaces instantly, server throw rejects and the optimistic apply stops being replayed. `Todos.update({}, fn)` and `Todos.remove({ completed: true })` are selector-scoped multi-doc writes in one mutator.
- `client.js` — `persist: true` is the boot path: hydrate pool from IndexedDB, render, catch up from cursor, go live.
- `server.js` — infrastructure only: storage adapter + listen. The publication lives on the collection (`publications:` inline at this rung — the pub of pub/sub), so the server file is exactly the boilerplate it looks like.

## Behavior you get without writing it

- Refresh mid-session: instant boot from IndexedDB, catch-up in background
- Two tabs: same pool via leader election, zero extra sockets
- Two browsers: live field-granular updates (the realtime demo: check a box in one, watch the other)
- Kill the server, toggle a todo, restart: outbox replays
- Server rejects a mutation: the toggle visually reverts, no code for it here
- Toggling one todo re-fires only that row's checkbox binding (per-field deps through the each-block diff) — derivations like `activeTodos` re-run only inside the bindings that read them
- Publish: pending button state, awaited result, throttled server-side — the action contract visible in one handler, sitting next to one-line mutator handlers

**Connection state, demonstrated minimally:** the banner reads `sync.connection.isConnected` / `sync.connection.status` / `sync.writes.pending` — the implicit-save threat model's required surface (typed-means-saved demands queued-writes visibility). How the `sync` object reaches templates (module import returned from createComponent, shown here, vs a callParam injection) is an open 0a question the example deliberately surfaces.

## Honest seams visible in the sketch

- The two-stage split makes route-level provisioning structurally possible (a parent subscribes, leaves read the pool) — but the route-level *home* for a subscriptions block doesn't exist until the router does
- `filteredTodos()` re-runs plain `Array.filter` per re-fire — no selector registration, no field-intersection help. Deliberate at this rung (the binding boundary), and execution sharing at scale belongs to the query registry, never component memoization
- Inline single-field edit calls the mutator directly on blur — drafts/`{#form}` would be ceremony here, they're for form pages
- The esc-cancel behavior survives unchanged only because the original never wrote until focusout — an API that synced on keystroke would have broken it

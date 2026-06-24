# TodoMVC with db sync — API steelman

The localStorage TodoMVC from `examples/src/todo-list/` graduated to synced data. Fake API, real reading experience. The point this steelman makes: **upgrading a `state` value to a `db` value is a prefix swap plus one declaration, not a rewrite.**

## The upgrade, in stages

The local TodoMVC kept todos in `state.todos` and hand-rolled localStorage. Graduating to a synced `db.todos` is three stages, and only the first is in the component:

1. **In the component.** `state.todos` → `db.todos` — every call identical (`push`, `toggleItemProperty`, `setItemProperty`, `setProperty`, `filter`, `removeItem`). Delete `todos: []` from `defaultState`, delete the localStorage load and the persistence reaction, and add one block at the top:
   ```js
   const subscriptions = ({ subscribe }) => ({ todos: subscribe('todos.all') });
   ```
   `component.html` does not change. The component nets *fewer* lines — the persistence boilerplate it deletes outweighs the subscription it adds.
2. **Declare the collection.** `todos.js`: schema + one publication, imported by both sides. Schema is optional (a schemaless collection works, losing revival/forms/validation).
3. **Run a server.** `server.js`: storage adapter + `listen()`. `client.js`: one `syncClient` call with `persist: true`.

Stage 1 is the change a developer feels; stages 2–3 are the one-time cost of having a backend at all. The value moved from memory to a synced collection; nothing in the markup or logic was reshaped.

## Why the swap is real, not approximate

`db.todos` is a `Signal` whose value is the collection's docs — API-identical to the `state` array signal it replaced. It carries the same helper surface, and the id-addressed helpers (`setItemProperty`, `toggleItemProperty`, `removeItem`) map straight to keyed-array wire ops. Fine-grained DOM updates come from the existing reconcile + per-field deps over reference-stable arrays, not from new machinery — the handle just needs to know what changed, which the helpers already report. (Implementation: `component-data-surface.md`.)

## The write surface, shown three ways

- **Direct `db.todos` helpers** (this file) — `db.todos.toggleItemProperty(id, 'completed')`, `db.todos.push({ title })`. The in-component reactive sugar, identical to the local `state.todos` calls, now optimistic + durable + on the wire.
- **The collection API** — the same writes are `Todos.update(id, { $set: { completed: true } })` / `Todos.insert(...)` / `Todos.remove(id)` from any plain JS (a shared helper, startup code) where there is no `db` bag. Universal, default-open auth at this rung.
- **Named mutators** — the graduation for gated/validated/multi-collection writes. todomvc needs none; see invoices-table.

## Actions stay named

`share` and `import` are actions — async, unsimulatable, awaited (`await Todos.share()` returns a URL; a simulated share would show a link that 404s until confirm). `share`, not `publish`: the registration verbs (`publish`/`mutator`/`action`/`searchIndex`) are reserved against operation names.

## What each file buys

- `todos.js` — schema + a publication + two actions, ~50 lines. No CRUD mutators: the direct `db.todos` writes and the universal `Todos.update`/`insert`/`remove` are the write surface. (The multi-collection / audit-log mutator demonstration lives in invoices-table, the graduation steelman.)
- `client.js` — `persist: true` is the boot path: hydrate pool from IndexedDB, render, catch up from cursor, go live.
- `server.js` — infrastructure only: storage adapter + `listen()`.

## Behavior you get without writing it

- Refresh mid-session: instant boot from IndexedDB, catch-up in background
- Two tabs: same pool via leader election, zero extra sockets
- Two browsers: live field-granular updates (check a box in one, watch the other)
- Kill the server, toggle a todo, restart: the outbox replays
- Server rejects a write: the toggle visually reverts, no code for it here
- Toggling one todo re-fires only that row's binding (reconcile + per-field deps over reference-stable arrays)

**Connection state, minimally:** the banner reads `sync.connection.isConnected` / `.status` / `sync.writes.pending` — implicit-save's required surface (typed-means-saved demands queued-writes visibility). How `sync` reaches templates (import vs callParam injection) is an open 0a question the example surfaces.

## Honest seams

- `filteredTodos()` re-runs plain `Array.filter` per re-fire — fine at this rung; execution sharing at scale is the query registry's job, never component memoization
- Inline single-field edit calls `db.todos.setItemProperty` on blur — drafts/`{#form}` would be ceremony here, they're for form pages
- The esc-cancel behavior survives unchanged because the original never wrote until focusout — an API that synced on keystroke would have broken it

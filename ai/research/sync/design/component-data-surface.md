# Component Data Surface — subscriptions, the `db` handle, and the write path

The component-author half of the data layer: how synced data reaches and leaves a component. `plan.md`'s Client Store / Write Path describe the machinery; this is the surface a developer actually types, and the whole design collapses to one rule: **a synced collection behaves like a `state` signal, so graduating local state to synced data is a prefix swap, not a rewrite.**

This refines three `plan.md` sections (Client Store, Write Path, Channels) — the specific amendments are listed at the end. The two steelmans are its worked examples: `todomvc/` (a pool collection — the `db.<name>` case) and `landings-table/` (a search window + named mutators — the graduation case).

## The one idea: a synced collection is a signal

`@semantic-ui/data` reuses the same `Signal` the component framework already uses for `state`. A synced collection is surfaced into a component as `db.<name>` — a `Signal` whose value is the collection's docs, carrying the full signal helper surface (`get`, `push`, `setItemProperty`, `toggleItemProperty`, `setProperty`, `filter`, `removeItem`, `mutate`, …). Because it is API-identical to a `state` array signal, the local-to-synced upgrade is mechanical:

```js
state.todos.toggleItemProperty(id, 'completed')   // local
db.todos.toggleItemProperty(id, 'completed')      // synced — same call, now optimistic + durable + on the wire
```

`db.<name>` is a real `Signal` instance — `instanceof Signal` holds, so it composes with `reaction` / `computed` / `derive` like any signal, and it reuses the helper surface rather than reimplementing it (less shipped code, not more). Its reactivity is as fine-grained as `state`'s — the existing reconcile + `notifyField` path over reference-stable arrays — with the finer per-doc / per-query path still available through `find(selector)` / `queries`. (The wrapper cost the renderer's data context avoids by hand-rolling `Dependency` is a render-loop, one-allocation-per-key concern; `db.<name>` is one signal per collection, allocated once at subscribe, off that path.)

## Stages of upgrading a `state` value to a `db` value

There are three, and only the first is in the component:

1. **In the component: `state.x` → `db.x`, plus a `subscriptions` block.** The data calls are unchanged. Delete the `x: []` default and any hand-rolled persistence; add one declaration at the top:
   ```js
   const subscriptions = ({ subscribe }) => ({ todos: subscribe('todos.all') });
   ```
   Template, helpers, events, and write ergonomics keep their shape. (todomvc is exactly this diff, and nets *fewer* component lines, since the localStorage boilerplate it deletes outweighs the block it adds.)
2. **Declare the collection.** `Todos = collection('todos', { schema })`, imported by both sides. Schema is optional. A publication to subscribe to is the only other requirement; at the trivial rung it can be a default whole-collection publication.
3. **Run a server.** Storage adapter + `listen()`. Boilerplate, not per-feature.

Stage 1 is the upgrade a developer feels; stages 2–3 are the one-time cost of having a backend at all. Nothing in the component's logic or markup is reshaped — the value simply moves from memory to a synced collection, behind the same signal API.

## The read surface

**Subscriptions provision *and* surface.** A `subscriptions` entry both provisions the pool (deduped across components) and surfaces its data: `db.<name>` in JS, the bare name in the template (`{#each todo in todos}`). There is no separate read declaration for the common case — every subscription wants its data in the context, so the binding is automatic rather than a second line. This is the resolution of the old two-stage `subscriptions` + `queries` split: the query for the trivial read is implicit.

**`queries` is optional.** Reads that *differ* from the raw subscription — named subsets like `bigNumbers: () => Numbers.find({ $gt: 10000 })` — can be co-located in a `queries` section, which buys naming, execution sharing, and static (rather than runtime) coverage checking. The everyday read is a helper over the handle (`activeTodos() { return db.todos.get().filter(t => !t.completed) }`) and needs no section. `queries` is the registration gradient applied to reads: inline for the trivial case, the named registry when scale earns it.

**Composites read through relation helpers.** A composite publication fills the referenced pools, so an edge is a warm pool lookup, not a round trip: `author() { return Users.findOne(this.created_by_user_id) }` on the doc, `{todo.author.name}` in the template. The component sees one subscription; the multi-collection shape lives in the publication, invisible at the call site.

**Window channels surface a handle, not an array.** A searchIndex / recompute channel computes membership and meta server-side (order, `total`, `pages`) — the pool cannot reconstruct it. Its subscription surfaces the *handle*: iterable for `{#each}`, with `.total` / `.pages` / `.ready` as properties (`{landings.total}`, `{not landings.ready}`). landings-table is this case; todomvc is the pool-collection case. So "subscriptions surface their data" holds for both — the data face is an array for a pool, a window handle for a recompute channel. A **non-pushed** window (`freshness:'manual'` or the `ownWrites` default) surfaces its ranked docs from a **frozen result set on the handle (`window.docs`)** — captured at the last snapshot, replaced atomically on `refresh()`, decoupled from the shared pool and the optimistic overlay — so it does not move until `refresh()`. `live` / duration windows iterate live pool docs in rank order.

## Status rides the handle

`ready`, `stale`, `lastDeltaAt`, `error` live on the handle as signals: `db.todos.ready` in JS. In templates, because `{todos}` unwraps to the docs (the value, not the signal object), surface status through a one-line helper (`ready() { return db.todos.ready.get() }` → `{#if ready}`). This keeps `{todos}` meaning data while giving status a cohesive home on the same handle, and lets the `subscriptions` declaration stay a pure provisioning statement — you read both data and status off `db.<name>`, never a second handle.

## The write surface is plural

SUI prefers flexibility: there is no single write path, and the same write reaches the wire as a field-granular delta regardless of form.

- **The collection API is universal.** `Todos.update(idOrSelector, { $set, $unset, $push })`, `Todos.insert(doc)`, `Todos.remove(selector)` — callable from anywhere in plain JS (helpers, startup, workers), no component or `db` bag required. This is the primary surface in real codebases, since most data code is not inside a component. The modifier form is the most direct wire mapping: `{ $set }` is already path-addressed, so it *is* the delta.
  ```js
  // a shared helper, no component in sight
  Sessions.update(userID, { $set: { last_login_date: new Date() } });
  ```
- **`db.<name>` is the in-component reactive sugar** — the signal-helper surface that mirrors `state`, the reason the local-to-synced graduation is a prefix swap. Outside a component there is no `db`; you use the collection directly.
- **Named mutators are the graduation** — for writes that need a permission gate, server validation, a side effect, or multiple collections in one envelope. They ride the four-phase pipeline (permission → schema → check → mutate|run) and are called `Todos.<op>(args)`.

Authorization is orthogonal and opt-in: `update` is itself the authorizable operation (the modifier is its payload), so *authorize operations, not edits* still holds — default-open at the hobby rung, a collection/operation permission when you need one. A mutator is not required for a write to be legal.

## Registration is a gradient, and the verbs are reserved

Small collections inline their operations; real ones split across files so the collection is never a thousand-line monolith:

```js
// scale: one file per entry, folder-loaded, sealed at listen()
Landings.action('approve',    { permission, schema, async run() { … } });
Landings.publish('byId',      { … });
Landings.mutator('setStatus', { … });
Landings.searchIndex('table', { … });
```

The late-attach registrars — `.publish`, `.action`, `.mutator`, `.searchIndex` — are **reserved names**: an operation cannot be called `publish` (it would collide with the publication registrar), the same rule that already reserves CRUD verbs. todomvc's share action is `share`, not `publish`, for exactly this reason; landings-table's edit mutator is `save`, not `update`.

## The contract

`db.<name>` is defined by behavior, not mechanism. Any implementation must hold these invariants:

1. **API-compatible with a `state` signal.** The read and write helpers a component calls on `state.x` (`get`, `push`, `setItemProperty`, `toggleItemProperty`, `setProperty`, `filter`, `removeItem`, `mutate`, …) behave identically on `db.x`. This is what makes the graduation a prefix swap rather than a rewrite.
2. **Reads no coarser than `state`.** Fine-grained reactivity through the existing reconcile / `match` path — a write to one doc must not re-render the whole list, and nothing the synced handle adds may tax the plain-`state` FGR hot path (tachometer-neutral for `state` signals).
3. **Writes emit field-granular deltas.** A single-field write produces a single-field wire op (the keyed-array delta), never a whole-doc rewrite.
4. **Inbound applies don't echo.** A server delta updates local state and the UI without being re-sent.
5. **Durability per the existing model.** Optimistic apply is synchronous; the outbox commit reports through the status surface (`saving` → `saved`).

`db.<name>` is a thin real `Signal`; that settles invariants 1–2 and the mental model. What's left is wiring at the pool layer — how a local write reaches the outbox, and how the per-collection signal sits over the pool's existing store — evident enough to a fresh agent that it isn't worth prescribing here. The invariants above are the contract; the technique is the implementer's, settled against them with a benchmark.

## What this amends in `plan.md`

- **Client Store** — the two-stage `subscriptions` + `queries` split becomes `subscriptions` (provision + surface) with `queries` optional. Data surfaces from the subscription rather than requiring a paired query; the in-component reactive handle is `db.<name>`.
- **Write Path** — "synced collections expose only mutators, not raw CRUD" inverts: the collection CRUD API (`update({ $set })`, `insert`, `remove`) is first-class everywhere, `db.<name>` is its in-component reactive form, and mutators are the opt-in graduation for gated/validated/multi-collection writes.
- **Channels / Client Store** — status (`ready`/`stale`/…) is read off the data handle (`db.<name>.ready`) rather than a separate subscription handle for pool collections; recompute/window channels keep a handle whose data face is the window.

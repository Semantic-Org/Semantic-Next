# Why the per-item class doesn't react after hydration

## Short answer

Your `{#each}` block's per-item attribute Reactions never wired against
`state.activeID`. The render-time path that would have wired them is gated on
the items signal firing — and your items collection is set once and never
mutates, so the per-item bindings never get a chance to subscribe to the
external state their helper depends on.

The fix is one of:

1. Upgrade to a framework version that includes the eager-hydrate classifier
   (commit `0df8d554e`, "Bug: Hydrate each items eagerly when bindings read
   external state"). With that fix, the each block notices that the per-item
   binding reads external state via a non-framework helper (`getItemClasses`)
   and wires per-item Reactions during `hydrate` instead of deferring to the
   first items mutation.
2. If you're stuck on an older version, force the items signal to fire once
   after hydration so the deferred wire-up path runs, e.g.
   `state.items.notify()` in `onRendered`, or trigger a no-op
   `state.items.set(state.items.get())` once. This is a workaround, not the
   intended pattern.

The rest of this doc explains *why* the deferred-wire optimization exists and
*why* your shape is the precise one that breaks it — that context matters
because the same pattern keeps biting people whose data arrives at hydrate
time rather than after.

## What the each block does on hydrate

The native engine's each block (`packages/renderer/src/engines/native/blocks/each.js`)
makes a deliberate optimization at hydrate time. From `each.hydrate`:

```js
hydrate({ node, lookupExpression, ... }) {
  // Always register a dep on the collection so future mutations invalidate.
  lookupExpression(node.over);
  self.hasHydrated = true;

  // ... possibly bail and DEFER per-item wiring ...
}
```

Two things happen on hydrate:

1. The block registers a dependency on the *items collection* signal so a
   future mutation to the items array will rerun the block.
2. It does **not** wire per-item Reactions for inner content. Per-item DOM
   already exists (the server emitted it, bracketed by `<!--sui-item:v1:KEY-->`
   markers). Wiring inner Reactions is deferred to a function called
   `adoptServerItems`, which runs the first time `update` fires (i.e. the
   first time the items signal changes after hydrate).

The reason for the defer: the common case is `{#each item in items}<span>{item.name}</span>{/each}`
— the per-item binding reads only iteration-local data, the server-rendered
DOM is already correct, and there is nothing to react to at hydrate time. Wiring
N Reactions for N items at hydrate just to have them never fire is wasted work
on first paint. Defer them and pay only on the first real change.

This optimization is unsafe whenever a per-item binding reads anything outside
the iteration scope.

## Why your case breaks

Your binding looks like this:

```hbs
{#each item in items}
  <a class="{classMap getItemClasses item}">{item.title}</a>
{/each}
```

Where `getItemClasses` is a method that calls `state.activeID.get()`.

`state.activeID` is *external* to the iteration scope. The per-item attribute
binding's Reaction is the thing that needs to subscribe to it, because that
Reaction is what writes the `class` attribute back to the DOM when activeID
changes.

But on the deferred path, that per-item Reaction is never created. Walk
through what happens after hydrate:

- Hydrate runs. The block registers a dep on `items` and bails (deferring per-
  item wiring).
- You mutate `state.activeID`.
- Nothing in the each block is subscribed to `state.activeID`. The block does
  not invalidate. `update` does not run. `adoptServerItems` does not run. No
  per-item Reaction was ever wired against `state.activeID`.
- Class string stays at whatever the server rendered.

Your sanity check (`reaction(() => console.log(state.activeID.get()))`) works
because *that* reaction subscribed at creation time. The Reactions inside the
each block — the ones that would write the class attribute — were never
created.

The killer detail: the items signal's only chance to wake the per-item
bindings is to itself fire. Your items are set once from a prop. They never
mutate. So the deferred wire-up never happens.

## The framework fix (commit 0df8d554e)

The fix is a static classifier
(`packages/renderer/src/engines/native/blocks/each-content-classifier.js`)
that runs once per unique each-content AST shape (cached on AST identity, so
it's effectively free per component instance). It walks the each's content
AST and answers one question: "could any binding inside this each read
external state?"

The classifier knows about:

- Iteration-local names (`item`, `index`, `key`, `this`, plus whatever the
  user named in `as` / `,index` / `,key`)
- The framework's pure helpers (`classMap`, `classIf`, `formatDate`,
  `concat`, ... — everything in `TemplateHelpers`)
- JS reserved names (`true`, `false`, `null`, `typeof`, ...)

For each expression, every bare identifier head must resolve to one of those
sets. If anything else appears (a component method, a user-registered helper,
a state name closed over by an inline expression), the classifier returns
"not self-contained."

For your expression `{classMap getItemClasses item}`, the tokens are:

- `classMap` — pure helper, OK
- `getItemClasses` — not in the iteration scope, not in the pure-helper
  registry → classifier returns false (external reads possible)
- `item` — iteration-local, OK

The classifier returns false → `each.hydrate` calls `adoptServerItems` *now*
instead of deferring. `adoptServerItems` walks the existing DOM (matched up
to server item markers by key) and creates per-item Reactions on the
already-rendered nodes. Those Reactions subscribe to `state.activeID` on
their first run, and from that point on, mutations propagate.

There is a regression test pinning exactly your shape:
`packages/renderer/test/browser/ssr-hydration.test.js:315` — "helper-call
attribute inside each is reactive after hydration when items pre-populated".
Its docstring is a transcription of this entire failure mode — it was
discovered in production from a docs-site `inpage-menu` that wouldn't update
its active-section indicator on scroll.

## Things that won't fix it (so you can rule them out)

- Replacing `classMap` with `classIf` or string concat — same shape,
  `getItemClasses` (or whatever non-framework function you call) is still the
  external-state read.
- Using `state.activeID.peek()` instead of `.get()` — peek explicitly opts
  out of dependency tracking. You'd lose reactivity *to* activeID, not gain
  it.
- Wrapping the helper call in a parent reactive context (e.g. the component's
  `onRendered`) — that doesn't propagate down into the per-item Reactions
  because the per-item Reactions are what need to exist in the first place.
- Switching the items prop from a plain array to a Signal — the items signal
  *is* already a Signal under the hood. The issue is not the items channel,
  it's that the per-item bindings haven't been wired yet.

## Things that will fix it

- **Preferred:** upgrade to the framework version with the classifier fix.
  No code change required on your side; the classifier inspects your AST
  and sees `getItemClasses` is not a framework helper, switches to the
  eager path, and your binding starts reacting.
- **Workaround on older versions:** force the items signal to fire once
  after hydrate so the deferred wire-up runs:
  ```js
  onRendered() {
    state.items.notify();   // wakes the each block's items dep,
                            // which runs update, which calls
                            // adoptServerItems, which wires per-item
                            // Reactions on the existing DOM
  }
  ```
  This is not the intended API — the canonical fix is the classifier — but
  it works mechanically because it triggers the same `adoptServerItems` path
  that the classifier triggers eagerly.
- **Workaround that sidesteps the each entirely:** lift the
  state-dependent class to an attribute on the per-item *element* that uses
  `data-active="{is item.id state.activeID}"` and style off `[data-active]` in
  CSS, *if* you don't actually need a class. This works because the
  attribute binding still goes through the same Reaction path — but on
  versions without the fix it has the same problem. Don't do this; upgrade.

## What to actually look at first

Before assuming this is the bug, confirm:

1. The component is hydrating, not full-rendering on the client. If
   `el.shadowRoot` is missing on connect, hydration didn't run and you're
   on the fresh-render path, which always wires Reactions. Check that your
   server output includes `<template shadowrootmode="open">` and that
   nothing strips it before the browser parses it.
2. The classifier's caching is on AST identity (`WeakMap<ASTNode, boolean>`).
   If you have two components that share an AST shape but only one of them
   has an external-state helper, the one classified first wins for both —
   but in practice each `defineComponent` call produces its own AST, so this
   is unlikely to be your issue.
3. If you registered `getItemClasses` via `Template.registerHelper` *before*
   the classifier module first loaded, the classifier will see it as a pure
   helper (because `PURE_HELPERS = new Set(Object.keys(TemplateHelpers))`
   captures the registry once at module init). Define it as a component
   method or inline `createComponent` field instead — that's how the
   regression test fixture writes it, and it's the canonical pattern.

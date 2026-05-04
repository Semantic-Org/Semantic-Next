# Why the per-item class binding doesn't react

## What's happening

This is the canonical lazy-each-hydrate bug. The fact that your top-level `reaction(() => state.activeID.get())` fires correctly proves the signal itself is healthy — the loss of reactivity is local to the per-item bindings inside the `{#each}` block.

The mechanism, from `packages/renderer/src/engines/native/blocks/each.js` and `each-content-classifier.js`:

1. On the SSR-then-hydrate path, `each.hydrate` does **not** unconditionally wire per-item Reactions. Per-item wiring is expensive (item count × bindings per item — ~425ms on a 1000-item list in prior benches), so the framework defers it: when hydrate runs, it only registers a dependency on the `items` collection signal and waits for `update` to fire. `update` then calls `adoptServerItems`, which finally wires per-item Reactions onto the existing server-rendered nodes.

2. That deferral assumes per-item bindings only read **item-local** data. Your `getItemClasses(item)` helper closes over `state.activeID` — external state. The deferral assumption is broken.

3. Because `items` is set once from a prop and never mutates, the items signal never fires after hydrate. `update` never runs. `adoptServerItems` never fires. The per-item Reactions for `class="{classMap getItemClasses item}"` are **never wired**.

4. With no Reaction wired around `getItemClasses(item)`, `state.activeID.depend()` is never called inside a tracked compute. Mutations to `state.activeID` have no subscriber on those bindings to invalidate. The class string in the DOM stays at whatever the server emitted.

The reason your standalone `reaction(...)` works is that it wires its own tracked compute; the dependency is registered there. The framework's per-expression reactivity guarantee depends on the per-binding Reaction running at least once with `Scheduler.current` set — that's the only way `Dependency.depend()` becomes a no-op-no-more. The lazy each path skips that step. There is no "register without running" — the evaluation IS the witness.

This is exactly the inpage-menu bug the skill calls out: items arrived as a prop, never changed, `getItemClasses(item)` reading `state.activeID` never updated the rendered class.

## Why the classifier didn't catch it

PR #175 added `each-content-classifier.js` (`isEachContentSelfContained`) to gate this. `each.hydrate` consults it; if anything in the block resolves outside the iteration scope ∪ framework helper registry, hydrate falls through to eager `adoptServerItems` and wires per-item Reactions immediately.

In your case, the classifier walks `{classMap getItemClasses item}` and sees:
- `classMap` — in `TemplateHelpers`, pure helper allowlist, fine.
- `getItemClasses` — **not** in the registry. Not an iteration-local. Not a reserved name.

Whether the classifier currently treats this as "external → eager-wire" depends on which version of the classifier is running. The classifier is conservative by design: any identifier head that doesn't resolve to iteration-vars or `TemplateHelpers` should bail to eager wiring. If `getItemClasses` was registered via `Template.registerHelper`, it is statically indistinguishable from a component method that reads state — and the classifier deliberately treats user-registered helpers as external (the correct call, per the comment in `each-content-classifier.js`).

So one of two things is true: either the classifier is correctly bailing and something downstream is broken, or you're hitting a path the classifier doesn't trace into. The likely path-not-traced cases listed in the skill are: `{#each}` without explicit `as`, snippet/template/rerender/async/guard wrappers, or unknown identifiers — `getItemClasses` falls in the "unknown identifier" bucket which should force eager wiring.

## How to fix it (in order of preference)

**Fix 1 — Make the dependency item-local.** Best fix for clarity and perf. Move the `state.activeID` read out of the per-item helper and pass the comparison result down as item-local data, or compute it inside a `computed`/derived signal that the helper reads from a stable reference. Concretely, restructure so the helper takes `(item, activeID)` — but that still reads state at the call site. A cleaner shape: store `activeID` on the iteration via a derived `items` collection that includes per-item `isActive`, OR restructure the template to compute the active flag at the binding site:

```svelte
{#each item in items}
  <a class="{classMap (object active=(eq item.id activeID) item=true)}">
    {item.title}
  </a>
{/each}
```

This puts `activeID` directly in the per-item binding expression. `activeID` is a top-level identifier from the data context (resolved at the binding's compute). The binding still needs a per-item Reaction to register the dependency — which you'd get via fix 2.

**Fix 2 — Force the each block onto the eager hydrate path.** The classifier is the public contract for this. If it's not currently bailing on your `getItemClasses` call, file a repro — but in the meantime, you can force eagerness by structuring the each block in a way the classifier can't prove self-contained. Simplest reliable triggers: use a snippet wrapper (`{>itemRow item=item}`), drop the explicit `as` (use `{#each items}` with `{this.title}`), or wrap the contents in an `{#async}`/`{#rerender}`. Each of these is on the conservative-bail list and forces eager `adoptServerItems`.

This is a workaround, not a real fix — the classifier should be doing this for you.

**Fix 3 — Mutate `items` once after hydrate.** If you can tolerate it, calling `state.items.set(state.items.get())` after hydrate fires the items signal, triggers `update` → `adoptServerItems` → per-item Reactions wire, and reactivity is restored. This is a hack and shouldn't ship — it adds a render pass and obscures the underlying issue — but it confirms the diagnosis if you want to verify before changing template structure.

## Recommended next step

Verify which path your component is actually taking. Add a `console.log` at the top of `each.hydrate` in `packages/renderer/src/engines/native/blocks/each.js` printing the result of `isEachContentSelfContained(node)`. If it returns `true` (lazy), the classifier missed your case — that's a classifier bug worth filing, because `getItemClasses` is a user-defined name that should not resolve to anything in the safe registry. If it returns `false` (eager), but reactivity still doesn't wire, the bug is downstream of the classifier and needs a different trace.

My read is that the classifier should already be bailing here, so the most likely diagnosis is that `getItemClasses` is being treated as a known-safe helper somehow (e.g., registered through a path the classifier whitelists, or the helper name happens to match something in `TemplateHelpers`). Worth checking: `Object.keys(TemplateHelpers).includes('getItemClasses')` from a console at runtime. If true — rename. If false — file the repro.

## Key files

- `/home/jack/semantic/next/packages/renderer/src/engines/native/blocks/each.js` — `each.hydrate` gate, `adoptServerItems`
- `/home/jack/semantic/next/packages/renderer/src/engines/native/blocks/each-content-classifier.js` — `isEachContentSelfContained`, the lazy/eager gate
- `/home/jack/semantic/next/packages/renderer/src/engines/native/reactive-data.js` — `skipFirstWrite` contract; the load-bearing per-binding evaluation that registers signal deps
- `/home/jack/semantic/next/packages/renderer/test/unit/each-content-classifier.test.js` — classifier behavior tests (item-local, external, conservative-bail cases)

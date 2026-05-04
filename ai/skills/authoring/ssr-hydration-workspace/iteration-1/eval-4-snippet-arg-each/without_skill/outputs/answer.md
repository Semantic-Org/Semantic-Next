# What's happening

The framework's snippet wiring is correct here — the bug you're hitting is a stale-snapshot edge case in `each`'s post-hydration reconcile path, not a snippet-arg reactivity hole. Specifically: the **first** post-hydration in-place mutation of an item slips through silently. The second mutation onwards updates the DOM normally.

## The intended path

For your template:

```
{#each item in items}<div>{>badge label=item.name}</div>{/each}
```

Reactivity flows like this:

1. **Each block** wraps each item in a `Signal` (`itemSignal`) holding `{ item, index }`. A `Proxy` (`createItemDataProxy` in `packages/renderer/src/engines/native/blocks/each.js:129-144`) sits over the parent data and routes `data.item` lookups through `itemSignal.value`, which registers an `itemSignal` dep on whoever's reading.
2. **Snippet args** (`label=item.name`) become **lazy getters** captured by `buildSnippetProxy` (`packages/renderer/src/engines/native/blocks/template.js:67-114`). The snippet body's `{label}` reactive text-node Reaction reads `snippetData.label`, which calls the captured getter `() => evaluator.lookupExpressionValue('item.name', itemProxy)`, which goes through the each's item-proxy and registers `itemSignal` as a dep on the text node's Reaction.

So the text-node Reaction inside the snippet body **does** end up depending on the per-item `itemSignal`. The wiring is fine. The problem is whether `itemSignal.notify()` actually fires when you mutate in place.

## The bug — `propsSnapshot` is `null` after adoption

When you replace `state.items` with `state.items.set([...items])`, the items signal fires and `each.update` runs. For records whose `item` reference and index are unchanged (your case — same object, just a mutated `.name`), the equality gate inside `Signal.set` short-circuits because the wrapper `{ item, index }` looks identical by `===` (same item ref). To get around that, `each` keeps a `propsSnapshot` of each item's top-level props and shallow-compares on every reconcile to decide whether to call `itemSignal.notify()` manually:

```js
// packages/renderer/src/engines/native/blocks/each.js:396-422 (Phase 3)
if (rec.item !== item || rec.index !== i) {
  rec.itemSignal.set(getEachData(...));
  ...
  rec.propsSnapshot = createSnapshot(item);
}
else if (typeof item === 'object' && item !== null) {
  if (rec.propsSnapshot === null) {
    // "Fresh record (first reconcile after createRecord). Bindings
    //  were wired synchronously against the signal's value; there's
    //  no stale subscriber to wake."
    rec.propsSnapshot = createSnapshot(item);
  }
  else if (refreshSnapshotAndDetect(rec.propsSnapshot, item)) {
    rec.itemSignal.notify();
  }
}
```

That `propsSnapshot === null` branch assumes "no notify needed because we just wired the bindings against the current item value." That assumption is true for records produced by `createRecord` inside the same `reconcile` call (CSR, or post-hydration replacements), but it is **wrong** for records produced by `adoptServerItems` during hydration, because:

- Adoption wires Reactions at hydrate time against the item's hydration-time `.name` (`'Apple'`).
- The records are pushed with `propsSnapshot: null` (`packages/renderer/src/engines/native/blocks/each.js:583`).
- Some unspecified time later, your code mutates `items[0].name = 'Cherry'` and pushes a new array.
- `update` runs `reconcile`. Phase 3 sees `rec.item === items[0]` (still the same ref), index unchanged, and `propsSnapshot === null` — so it takes the "fresh record" branch, snapshots `{ name: 'Cherry' }` for next time, and **does not call `notify()`**.
- The badge stays showing `[Apple]`.

If you mutate again (`items[0].name = 'Date'`), `refreshSnapshotAndDetect` compares against the now-populated snapshot (`'Cherry' !== 'Date'`), fires `notify()`, and the DOM updates to `[Date]` — skipping the `'Cherry'` value entirely.

## Why the "outer reaction definitely fires" observation is consistent

Your test for "outer reaction fires" probably involves changing the array length (push, splice, swap). Those go through the `rec.item !== item || rec.index !== i` branch — `itemSignal.set(...)` runs unconditionally with a fresh wrapper object, equality gate passes (different wrapper ref), subscribers wake. That's why adding/removing/reordering items works fine after hydrate, but mutating an existing item's prop in place doesn't.

It's also worth noting that this isn't snippet-specific — any expression inside the each body that reads `item.<prop>` would hit the same bug after hydration on the first in-place mutation. The snippet is just along for the ride. But the snippet structure does suppress one of the workarounds: with bare `{item.name}` directly in the each body, the same lookup path applies and the same bug should reproduce. A test using new object refs (`items[0] = { ...items[0], name: 'Crimson' }`) like the one at `packages/renderer/test/browser/ssr-hydration.test.js:1408-1433` passes precisely because it dodges the equality gate by changing the item ref.

## Workarounds (no source change)

- Replace the item reference instead of mutating in place: `state.items.set(items.map((it, i) => i === 0 ? { ...it, name: 'Cherry' } : it))`. New ref → first branch of phase 3 → `itemSignal.set(...)` → DOM updates.
- Toggle the value back-and-forth — the first mutation populates `propsSnapshot`, the second triggers `notify()`. Not really a workaround, just an explanation of why your second mutation works.
- Use `state.items.notify()` after the in-place mutation to force the items signal to fire a second time — but this only buys you the same "phase 3 with populated snapshot" pass, so it would also need to happen after the first lost mutation, not as a fix for it.

## The fix on the framework side

`adoptServerItems` should populate `propsSnapshot` at adoption time, the same way Phase 3 does at the end of a normal reconcile. Either:

```js
// packages/renderer/src/engines/native/blocks/each.js:574-584
newRecords.push({
  ...,
  propsSnapshot: createSnapshot(item),  // not null
});
```

…or, equivalently, change the "fresh record" branch in Phase 3 to detect adoption explicitly. The first option is cleaner and matches the invariant the comment in Phase 3 already claims ("bindings were wired against the signal's value at the moment we set the snapshot").

## Files to look at

- `/home/jack/semantic/next/packages/renderer/src/engines/native/blocks/each.js` — `adoptServerItems` (line 505), `reconcile` Phase 3 (line 396-422), `createSnapshot` / `refreshSnapshotAndDetect` (lines 86-122), `createItemDataProxy` (line 129).
- `/home/jack/semantic/next/packages/renderer/src/engines/native/blocks/template.js` — `buildSnippetProxy` lazy getters (line 67), snippet hydrate branch (line 224).
- `/home/jack/semantic/next/packages/renderer/src/engines/native/blocks/each-content-classifier.js` — confirms eager hydration is forced when an each contains a `template` (snippet) node, so `adoptServerItems` is what runs during hydrate (line 189-194).
- `/home/jack/semantic/next/packages/renderer/test/browser/ssr-hydration.test.js:1408-1433` — the existing "snippet with named args inside each" test that uses a new object ref and therefore doesn't catch this.

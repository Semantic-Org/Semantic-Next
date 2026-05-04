# Why the per-item class binding doesn't react

## Diagnosis

This is the canonical "each-block lazy hydrate, content reads external state" bug. It is the exact shape of the docs-site `inpage-menu` regression that PR #175 was written to address.

### What's happening

`each.hydrate` is the only block hydrate hook in the framework that does **not** unconditionally wire per-item Reactions. It is a deliberate perf optimization: per-item Reactions cost `item count × bindings per item` to wire, so on a 1000-item list eagerly wiring on hydrate added ~425ms in a previous experiment. The lazy path defers wiring until the items signal first fires, then wires in place via `adoptServerItems`.

The deferral is correct **only when** every per-item binding depends on item-local data (the iteration variable, `index`/`key`, framework helpers like `classMap`, `activeIf`, `is`). Your binding violates that assumption:

```
{classMap getItemClasses item}
   |
   +-- getItemClasses(item) reads state.activeID.get()
                                        ^^^^^^^^^^^^^^
                                        external signal
```

### The silent-failure chain

1. SSR renders the `<a>` elements with the correct `active` class for the initial `state.activeID`. The DOM looks fine.
2. On hydrate, `each.hydrate` runs:
   - It registers a dependency on the `items` collection signal (via `lookupExpression(node.over)`).
   - It does **not** wire per-item Reactions. Instead it sets `self.hasHydrated = true` and returns. `adoptServerItems` is **not** called.
3. Because `items` is set once from a prop and never mutates, the items signal never fires.
4. Because the items signal never fires, `each.update` never runs, `adoptServerItems` never runs, and the per-item Reactions for `{classMap getItemClasses item}` are never wired.
5. When you mutate `state.activeID`, there is no Reaction subscribed to it on the per-item bindings — so nothing invalidates and nothing re-renders the class.

Your sanity-check `reaction(() => console.log(state.activeID.get()))` works because *that* Reaction is wired explicitly and registers its own dependency on `state.activeID` on first run. The framework's per-expression reactivity guarantee comes from per-binding Reactions evaluating their expressions at wire time — which is exactly what didn't happen for the items inside the `{#each}`.

This is load-bearing: there is no "register without running." `Dependency.depend()` is a no-op when `Scheduler.current` is null. The only way to register a dep on a signal is to read it inside a wired Reaction's compute callback. No wired Reaction on the per-item binding means no dep on `state.activeID`, which means no reactivity. Hydration markers being clean and the SSR'd class being correct is a red herring — it just means the server-side render of the initial state was right.

## Fix

PR #175 introduced a static analyzer at `packages/renderer/src/engines/native/blocks/each-content-classifier.js` that walks the each block's content AST and decides whether every binding's identifier head resolves to `iteration-vars ∪ pure-helper-registry ∪ reserved-names`. `each.hydrate` consults it: self-contained → keep the lazy path; anything that could read external state → eager `adoptServerItems` so per-item Reactions register their external deps now.

If the framework version you're on includes that classifier, **the fix is upstream** — `getItemClasses` reads `state.activeID`, the helper isn't in the framework's pure-helper registry (`TemplateHelpers`), the classifier returns false, and `each.hydrate` will eagerly wire. Verify by checking whether `packages/renderer/src/engines/native/blocks/each-content-classifier.js` exists in your install, and whether `each.js`'s `hydrate` function calls `isEachContentSelfContained(node)`. If both are present, the bug is something else (e.g., your each block uses no-`as` syntax — the classifier conservatively bails, but you'd then *not* see this bug because conservative bails go eager).

If you're on a version *before* the classifier shipped (or if for some reason `getItemClasses` is not visible to the analyzer — e.g., it's registered as a user helper via `Template.registerHelper` and the classifier's identifier check sees it as external — which is the *correct* call in that case), the workarounds available to you in user-land are:

1. **Inline the active check at the call site.** Move the binding into syntax the classifier can trace, or — pre-classifier — into syntax that doesn't hide the external read inside a helper:

   ```
   {#each item in items}
     <a class="{classMap (object active=(eq state.activeID item.id)) item=true}">
       {item.title}
     </a>
   {/each}
   ```

   This still reads external state, so on a pre-classifier version it still bugs out — but on a classifier version it's properly classified as external, and the helper registry recognizes `classMap` and `eq` as pure.

2. **Make the items signal fire whenever `state.activeID` changes.** Re-assigning `state.items.set(state.items.get())` after each `state.activeID` mutation forces `each.update` to run, which calls `adoptServerItems`, which wires the per-item Reactions and registers their deps on `state.activeID` going forward. This is a one-time wire — you only need to nudge once after hydrate. Ugly but mechanically correct.

3. **Force a re-mount of the each block** by wrapping it in a `{#rerender}` keyed on a version counter you bump on each `activeID` change. Throws away the per-item DOM and re-renders client-side — works but defeats hydration.

The first option is the right user-land fix on a classifier-aware version; option 2 is the diagnostic that proves the diagnosis (if mutating items once unsticks the reactivity, you've confirmed the lazy-hydrate gate is the culprit). Option 3 is a hammer.

## Why this is silent

There is no error, no warning, no DevTools breadcrumb. The SSR'd DOM is correct, the hydration markers are clean, the items array is intact, the `state.activeID` signal mutates and any *direct* reaction to it fires. Only the per-item bindings are missing their subscriptions. The lazy-hydrate optimization trades correctness for the assumption that per-item bindings are item-local — and external-state reads inside per-item bindings violate that assumption invisibly.

## Key files

- `/home/jack/semantic/next/packages/renderer/src/engines/native/blocks/each.js` — `each.hydrate`, the deferral gate, and `adoptServerItems`
- `/home/jack/semantic/next/packages/renderer/src/engines/native/blocks/each-content-classifier.js` — `isEachContentSelfContained`, the static analyzer that decides lazy vs eager
- `/home/jack/semantic/next/packages/renderer/test/unit/each-content-classifier.test.js` — coverage for item-local, external-read, and conservative-bail cases

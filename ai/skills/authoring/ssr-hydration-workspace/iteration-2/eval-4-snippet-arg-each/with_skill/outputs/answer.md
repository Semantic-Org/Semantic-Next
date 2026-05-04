# Snippet-with-args inside `{#each}` after SSR + hydrate: stale label

## Short answer

This is the **lazy each-block hydration** trap. After SSR, `each.hydrate` registered a Reaction on `items` (the collection) but **never wired the per-item Reactions** that would track `item.name`. Pushing a new array fires the outer Reaction (you see new DOM), but mutating `items[0].name` has nothing to invalidate, because the binding inside the badge snippet (`{label}` resolving to `item.name`) was never wrapped in a Reaction.

The classifier that's supposed to upgrade this case to eager wiring exists (`each-content-classifier.js`) and explicitly bails on snippet invocations — but only if it is reached and operating as documented. The symptoms you describe match exactly what happens when the bail does *not* fire (or fires but `adoptServerItems` returns false): per-item Reactions stay un-wired, external/snippet bindings lose reactivity. Worth checking your branch is on PR #175 or later — the snippet-bail test was unskipped there.

## What the framework is actually doing, step by step

1. **Server render.** `ServerRenderer` walks the AST. The each block emits its open/close markers and per-item `<!--sui-item:v1:KEY-->` markers. The snippet invocation `{>badge label=item.name}` is evaluated inline — `item.name` resolves to `"first"` and the badge's `<span>[{label}]</span>` is rendered with `label = "first"`. No JS runs in the SSR snippet path; it's pure string concatenation with markers wrapping the dynamic text node.

2. **Browser parse.** DSD inflates. You see `<span>[first]</span>` for item 0 immediately.

3. **Hydration of the each block.** `each.hydrate` (`packages/renderer/src/engines/native/blocks/each.js:646`) does two things:
   - `lookupExpression(node.over)` — registers a dep on `items`. **This is the only Reaction wired for the block at this point.** That's why pushing a new array fires reactivity (the outer Reaction sees the items signal change), and that's why `update` runs and you see new DOM.
   - Consults `isEachContentSelfContained(node)` (`each-content-classifier.js`). If true → `return` (stay lazy, no per-item Reactions). If false → call `adoptServerItems` immediately to walk the server's per-item DOM and wire per-item Reactions in place.

4. **Per-item bindings wire only in the eager path.** `adoptServerItems` walks `<!--sui-item:v1:KEY-->` markers, builds the per-item data context with the item-context proxy, and calls `hydrateInnerContent` — which calls `hydrateMarkers` against the inner ASTthat triggers the badge's snippet invocation hydrate hook. That's where `<!--sui:v1:N-->` markers around the snippet's `{label}` text get wrapped in Reactions whose compute function reads `label` through the snippet-arg proxy (`buildSnippetProxy` at `template.js:67`), which re-evaluates `item.name` against the item context's reactive data channel.

   Without that adoption pass, **none of those Reactions exist.** The text node containing `[first]` is just static text on the page; nothing is observing `item.name` to write to it.

5. **Why pushing a new array still updates the DOM but mutating `items[0].name` doesn't.** The outer Reaction on `items` is wired (step 3a). Pushing a new array → items signal fires → `each.update` runs → reconcile builds DOM for new items (and that fresh-render path *does* wire per-item Reactions for the newly-created items via the normal render flow). But the existing item 0's DOM was adopted from SSR and **its per-item Reactions never wired**, so writing `items[0].name = "second"` (or even replacing items[0] with a new object that has the same key) doesn't invalidate anything observing that text node.

## Why the snippet matters specifically

The classifier in `each-content-classifier.js` walks the per-item content AST and bails to "external" (forcing eager wiring) on cross-AST nodes — `template`, `snippet`, `rerender`, `guard`, `async` (lines 189-194 of that file). The reason: the snippet's body lives in a *separate AST*, and the classifier doesn't recurse into it. Even if your snippet's body only reads its arg, the arg expression (`label=item.name`) is evaluated inside the per-item content path against the parent scope's data context, threaded through `buildSnippetProxy`'s lazy getters — and those getters are only re-invoked when the per-binding Reactions inside the snippet's text node fire. Those Reactions only exist if per-item adoption happened. So snippet → bail to eager → adoption wires the snippet's interior bindings.

If your bug is reproducing this on a branch with the classifier in place, the most likely failure modes are:

- The classifier ran but returned `true` (treated as self-contained). Walk the AST node it was given for this each — confirm the snippet invocation appears as a `node.type === 'snippet'` (or `'template'`) child. If it's classified as something else, the bail doesn't trigger.
- The classifier returned `false` but `adoptServerItems` returned `false` (couldn't find matching `sui-item:v1:KEY` markers — key mismatch between server and client item IDs). Look at `getItemID` (`each.js:42`) — keys are stringified, server emits string keys; if your client items have e.g. numeric `id` and the SSR pass produced numeric-string keys, they should match, but a mismatch silently falls through to fresh render on `update`, not on `hydrate`. On `hydrate` failure there's no fallback render — the existing DOM stays as-is and Reactions don't wire.
- Branch predates PR #175 — `each.hydrate` doesn't consult the classifier at all and stays unconditionally lazy. The snippet-arg-in-each test was unskipped in that PR; before it, this exact case was a known silent-failure bug.

## What to check, in order

1. `git log --oneline packages/renderer/src/engines/native/blocks/each-content-classifier.js` — confirm the file exists on your branch and PR #175 is in your history.
2. In a debugger, set a breakpoint on `isEachContentSelfContained` and confirm it returns `false` for your each AST node. If true → the snippet child isn't being classified as `snippet`/`template` (parser issue, not a hydrate issue).
3. If false, breakpoint on `adoptServerItems` inside `each.hydrate` and confirm it runs and returns `true`. If it returns `false`, check your server-emitted `<!--sui-item:v1:KEY-->` keys against the client item IDs (`getItemID` output) — mismatched keys is the silent-failure mode here.
4. As a sanity check that the per-item Reactions are the missing piece: replace the snippet with inline content (`<span>[{item.name}]</span>`) and re-test. That should *also* fail under the same lazy assumption (well, no — inline content with explicit `as` and item-only reads is "self-contained" so it stays lazy and would have the same symptom — but the symptom would attribute to "lazy each, items signal never fires because we mutated items[0] in place" rather than "snippet bail didn't trigger"). To confirm it's specifically the snippet path: replace the inner content with `<span>{state.somethingExternal}</span>` — that should bail eager via the identifier check and your per-item Reactions should wire and update.

## Fixing the immediate symptom (workarounds, in order of preference)

1. **Notify the items signal after mutation.** `state.items.notify()` (or assign through a `.set` that triggers it) after `items[0].name = "second"`. This forces the outer Reaction to fire, which on the second invocation flows through `each.update`'s adoption path (which *does* try to wire per-item Reactions). This is the cheapest fix and works without any framework changes.
2. **Replace the item, don't mutate it.** `state.items[0] = { ...items[0], name: "second" }` then `notify()`, or use the array helper `state.items.set(0, { ...items[0], name: "second" })`. Same idea — gives the items signal a top-level identity change to fire on.
3. **If you can't change the mutation pattern**, the framework-level fix is what PR #175 already does: ensure your branch has the classifier and that it bails on snippet invocations. If it does and the bug still reproduces, that's a real bug — file with the AST shape and the SSR'd HTML and we can trace whether the classifier or the adoption pass is the failure point.

## Key files

- `/home/jack/semantic/next/packages/renderer/src/engines/native/blocks/each.js` — `each.hydrate` at line 646; `adoptServerItems` at line 505
- `/home/jack/semantic/next/packages/renderer/src/engines/native/blocks/each-content-classifier.js` — bail set; snippet/template at lines 189-194
- `/home/jack/semantic/next/packages/renderer/src/engines/native/blocks/template.js` — `buildSnippetProxy` at line 67; snippet hydrate path at line 220

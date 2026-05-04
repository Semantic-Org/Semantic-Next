# Why your `{#each}` per-item class binding doesn't react after hydration

## Short answer

Your `items` Signal never mutates, so the each-block's "lazy" hydration optimization is *staying* lazy — and on the lazy path no per-item Reactions are wired. The class binding has nothing watching `state.activeID` to invalidate. Your standalone `reaction(() => state.activeID.get())` works because you wired it directly; the each block never wired the equivalent for `getItemClasses`.

The fix in 90% of cases: rewrite the helper as an inline expression that the static classifier can see reads external state, or push the active state into the items themselves. The "load-bearing" fix: the classifier in `each-content-classifier.js` should be flagging this as not-self-contained, so if it isn't, that's a classifier bug worth filing — see "If the classifier should have caught this" below.

## What's actually happening

Each-block hydration in `packages/renderer/src/engines/native/blocks/each.js` has two paths:

- **Lazy** — only register a dependency on the items collection itself. Per-item bindings get no Reactions until the items signal fires for the first time, at which point `adoptServerItems` walks `<!--sui-item:v1:KEY-->` markers, reuses each item's server DOM, and wires per-item Reactions inside.
- **Eager** — call `adoptServerItems` immediately during `hydrate`, wiring per-item Reactions against the server-rendered DOM right away.

The decision is made by `isEachContentSelfContained(node)` (`packages/renderer/src/engines/native/blocks/each-content-classifier.js`):

```js
// hydrate hook in each.js
if (isEachContentSelfContained(node)) {
  return;  // lazy — defer per-item wiring to first items mutation
}
// otherwise: adoptServerItems(...)  — eager wiring
```

The classifier is a static syntactic walk of the each's content AST. A per-item expression is "self-contained" only if every bare identifier resolves to one of:

- iteration-local names (`as` name, `indexAs` name, plus implicit `this`/`index`/`key`)
- a framework-shipped helper from `TemplateHelpers` (`PURE_HELPERS = new Set(Object.keys(TemplateHelpers))` captured once at module load)
- a reserved JS keyword (`true`, `false`, `null`, ...)

Anything else — a component method, a user-registered helper, a closure that reads `state.x` — flips the block to eager.

## Where your case lands

Your binding looks like:

```
<a class="{classMap getItemClasses item}">
```

`classMap` is a framework helper (it's in `TemplateHelpers`), so it doesn't disqualify. `item` is the iteration-local name (`as item`), also fine. The bare identifier that decides this is **`getItemClasses`**.

Two scenarios — both ought to flip to eager but the symptom you describe means at least one didn't:

**Scenario A — `getItemClasses` is a component method exposed via `createComponent`'s return value.** The classifier doesn't trace data context, so `getItemClasses` resolves as "not in local scope, not in `PURE_HELPERS`, not reserved" → returns `false` → eager path runs. This *should* work. If it isn't, the issue is somewhere else (see Scenario B and the "If the classifier should have caught this" check).

**Scenario B — `getItemClasses` was added via `registerHelper(...)`.** The classifier captures `PURE_HELPERS` at module-import time:

```js
const PURE_HELPERS = new Set(Object.keys(TemplateHelpers));
```

If the helper was registered *before* `each-content-classifier.js` loaded, it lands in the snapshot and the classifier mistakes it for a pure helper → returns `true` → lazy path → never wires per-item Reactions on hydrate. Your items don't mutate, so `adoptServerItems` never runs, and the binding never gets a Reaction watching `state.activeID`. That matches your symptoms exactly.

The classifier comment is explicit about this:

> User-registered helpers (`Template.registerHelper`) are statically indistinguishable from component methods, so they fall into the "external" bucket via the identifier check. That's the correct call: a helper that reads state needs the per-binding Reaction to wire.

That comment describes the intended behavior — but it's only true if the helper is registered *after* the classifier module load. The order-of-registration footgun is real.

## How to verify which scenario you're in

Quick check from devtools after the page loads (before any items mutation):

```js
const eachStart = $0.shadowRoot.querySelector('whatever-anchors-the-each');
// Or: walk shadowRoot for sui-item:v1: comments — if they're still present
// and the markers haven't been replaced by empty text nodes, the lazy path
// won the classifier and no per-item Reactions exist.
```

If the `<!--sui-item:v1:KEY-->` comment markers are still present in the DOM after first paint, you're on the lazy path. After eager-path adoption (or any reconcile) those markers are replaced by empty text-node startMarkers.

You can also test it directly: mutate `state.items` once (e.g. `state.items.push(state.items.shift())` or just `state.items.set([...state.items.get()])`). If the active class suddenly starts updating after that, you've confirmed the lazy path was the culprit — the items mutation triggered `adoptServerItems`, which wired the per-item Reactions.

## Fixes

In rough order of how I'd reach for them:

**1. Move `active` into the items themselves.** The cleanest. Build a derived items list (or update `items[i].active` on `activeID` change) and template against `item.active` directly. Now the binding only reads iteration-local data, the lazy path is correct, and reactivity flows through the item signal as designed.

**2. Inline the binding so the classifier can see the external read.** Replace `getItemClasses item` with the expression body inline:

```
<a class="{classMap (eq state.activeID item.id) 'active' true 'item'}">
```

Now the classifier sees `state` as a bare identifier in local scope check → not local, not pure → returns `false` → eager wiring → reactive. (Confirm the spelling of `eq` in your helpers — `isEqual` may be the framework name.)

**3. Force eager wiring by adding any binding the classifier flags as external.** If you want to keep the helper, add anything else inside the each that statically reads a non-local name — even a no-op. The classifier returns `false` on the first not-self-contained node it finds, and the whole block flips to eager.

**4. Defer registration so the classifier sees the helper as external.** Avoid relying on this — it's order-of-imports magic — but if you must keep `getItemClasses` registered as a helper *and* keep the binding shape, ensure the helper is registered after `@semantic-ui/renderer`'s each-content-classifier module loads. The cleanest version of this is "don't register state-reading helpers"; treat `registerHelper` as for pure functions only, per its design intent.

## If the classifier should have caught this (Scenario A) but didn't

If `getItemClasses` is a component method (not a registered helper) and the bug still reproduces, that's a classifier miss. Things to check before filing:

- Is `getItemClasses` named exactly the same as a `TemplateHelpers` key? (Look at `packages/templating/src/template-helpers.js` — `classMap`, `classIf`, `eq`, `is`, `isNot`, `join`, etc.) A name collision would let the classifier mistake your method for a pure helper.
- Is the AST node-shape what the classifier expects? Lisp-style `{classMap getItemClasses item}` should walk fine, but if your template authoring path is producing a different node `type` than `'expression'`, the classifier's switch may bail in the wrong direction.
- Run `isEachContentSelfContained` directly against your each AST node and log the result. Cached on the AST node identity, so just call it.

## The underlying principle

Hydration trusts the server DOM and wires Reactions to it — it doesn't re-evaluate. Per-item Reactions are the wires that connect future state changes to the existing per-item DOM. The lazy path is a deliberate optimization: if every per-item binding reads only iteration-local data, the items signal firing is the *only* thing that can ever invalidate them, so deferring wiring until that fire is safe and saves work.

When a binding actually reads external state, that assumption breaks: the items signal may never fire, the wires never go in, and external mutations have nothing to invalidate. Your case is the canonical example. The classifier is the gate — if it lets the wrong shape through to the lazy path, the binding goes dark exactly the way you're describing.

## Files

- `/home/jack/semantic/next/packages/renderer/src/engines/native/blocks/each.js` — the two hydrate paths (lines ~646-687) and `adoptServerItems` (lines ~505-616)
- `/home/jack/semantic/next/packages/renderer/src/engines/native/blocks/each-content-classifier.js` — the static classifier; `PURE_HELPERS` snapshot is the load-order footgun
- `/home/jack/semantic/next/packages/templating/src/template-helpers.js` — `TemplateHelpers` and `registerHelper`

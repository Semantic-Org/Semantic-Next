# Snippet inside `{#each}` — what hydration actually wires

## Short version

Your pattern is the documented-supported case and there's a passing test for the
exact shape you described:

`packages/renderer/test/browser/ssr-hydration.test.js:1408` —
"snippet with named args inside each is reactive after hydration".

That test SSRs `{#snippet badge}<span class="b">[{label}]</span>{/snippet}{#each item in items}<div>{>badge label=item.name}</div>{/each}`,
hydrates, then mutates `items[0]` (assigning a new spread + setting the array)
and asserts the first badge updates. It passes on `test/templating` as of this
session. So the framework *is* wiring the per-item Reaction across the snippet
boundary on hydrate. If you're seeing it not update, you're hitting a variant
the rest of this answer enumerates.

Before the variants, the actual mechanism — because that's what tells you which
of the variants you're in.

---

## What hydrate does for `{#each item in items}` containing a snippet

Two things make this case work, both deliberate.

### 1. The "self-contained" classifier bails on snippet calls

`packages/renderer/src/engines/native/blocks/each-content-classifier.js`

The each block's `hydrate` hook has a fast path: if every per-item binding only
reads iteration-local data or pure framework helpers, it can skip per-item
Reaction wiring at hydrate time and lazily build them on the first items
mutation. `each.js:664` gates this on `isEachContentSelfContained(node)`.

The classifier walks the each's content AST. When it hits a `template`-type
node (which is what `{>badge ...}` compiles to — both snippets and subtemplates
share that node type), it returns `false` (line 189):

```js
case 'template':
case 'snippet':
case 'rerender':
case 'guard':
case 'async':
  return false;
```

The reasoning is in the file's preamble: snippet bodies live in a separate
AST, and the classifier doesn't trace cross-AST identifier flow. Rather than
guess wrong it bails conservative — meaning your each gets the *eager* wire
path. So `each.hydrate` calls `adoptServerItems` (`each.js:669`).

### 2. `adoptServerItems` rebuilds per-item reactivity against the existing DOM

`packages/renderer/src/engines/native/blocks/each.js:505-616`

The server emitted `<!--sui-item:v1:KEY-->` markers between the each block's
open/close markers. `extractServerItemGroups` walks `region.ownedNodes`
grouping nodes by their preceding item marker (with depth tracking so nested
`sui-block` markers from inner directives don't confuse the boundary).

For each item:

- A fresh `itemSignal` (`new Signal(eachData, { allowClone: false })`) and an
  `itemProxy` from `createItemDataProxy(parentData, itemSignal)` are created.
  `createItemDataProxy` wraps the parent data so that *any* read of an item
  field goes through `itemSignal.value` first — that's where the per-item
  reactive subscription is established (`each.js:129-144`).
- `hydrateInnerContent` walks the per-item nodes with
  `data: itemProxy, scope: itemScope`. This is where the snippet block's
  `hydrate` hook gets called.

### 3. The snippet block on the hydrate path

`packages/renderer/src/engines/native/blocks/template.js:220-240`

When `template.hydrate` runs with `data = itemProxy` (the each-item proxy)
and `kind === 'snippet'`, it calls `buildSnippetProxy(node, itemProxy, evaluator)`
to build the snippet-args overlay. Critical detail at `template.js:67-114`:

```js
if (isPlainObject(node.data)) {
  each(node.data, (expr, key) => {
    staticGetters[key] = () => evaluator.lookupExpressionValue(expr, data);
  });
}
```

The arg getters are *lazy* and close over the each-item proxy. They are not
wrapped in `Reaction.nonreactive`. So when the snippet body's `{label}` text
Reaction fires, the Reaction tracking context is active when the getter runs,
and the getter's call into `evaluator.lookupExpressionValue('item.name', itemProxy)`
walks through `itemProxy.get('item')` — which reads `itemSignal.value` and
subscribes the body's Reaction to that signal. That's the reactive bridge.

`hydrateInnerContent` is then called for the snippet body
(`template.js:228-238`) with `data: snippetData, scope` — same scope as the
each item, so when the item record is disposed, the snippet body's Reactions
go with it.

### 4. The mutation path on `items[0].name = ...; state.items.set([...items])`

When you replace the array, the items signal fires, `each.update` runs,
`reconcile` walks. For index 0 the item reference is unchanged, so the code
falls into the snapshot branch at `each.js:407-421`:

```js
else if (typeof item === 'object' && item !== null) {
  if (rec.propsSnapshot === null) {
    rec.propsSnapshot = createSnapshot(item);
  }
  else if (refreshSnapshotAndDetect(rec.propsSnapshot, item)) {
    rec.itemSignal.notify();
  }
}
```

`refreshSnapshotAndDetect` does a shallow diff of top-level item props. If
`name` changed it returns true, the snapshot is updated in place, and
`itemSignal.notify()` wakes everything subscribed to that per-item signal
— including the snippet body's `{label}` text Reaction. That Reaction
re-evaluates, the lazy `label` getter fires again, reads the current
`item.name`, and writes the new value to `textNode.data`.

That's the full chain — and the chain is exercised end-to-end by the test
at `ssr-hydration.test.js:1408`.

---

## Why your case might not be doing this

Since the framework path works for the canonical shape, the failure has to
come from a deviation. Most likely sources, ranked by how often they bite:

### A. The mutation isn't reaching `reconcile`'s phase 3

You said the outer each's reaction "definitely fires" because new items render
when added. That's good — it means the items signal *is* invalidating the each
block. But verify reconcile actually re-enters phase 3 for index 0. If you're
mutating *only* `items[0].name` without setting the items signal to a new
reference (i.e., no `state.items.set(...)` and no array helper like
`state.items.push/.splice`), the items signal never fires, no reconcile, no
snapshot diff, no per-item notify.

`state.items.push(newItem)` does both — it mutates and calls `notify()` (see
`packages/reactivity/src/signal.js:237-240`). So pushing should reach
phase 3. Pure `items[0].name = 'x'` without any signal call won't.

### B. Your each is the no-`as` form

`{#each items}<div>{>badge label=name}</div>{/each}` (no `item in`) spreads
the item's keys into the local scope. The classifier returns false at the
top of `isEachContentSelfContained` (`each-content-classifier.js:212`), so
`each.hydrate` *also* takes the eager path. No problem there. But if you're
passing `label=name` (instead of `label=item.name`), the snippet getter
evaluates `name` against the each-item proxy, which resolves it to the
*current* item's `name` field via `itemSignal.value` — same outcome.

### C. The snapshot diff is shallow

`refreshSnapshotAndDetect` only checks top-level props. If you're mutating
`items[0].nested.name` and the snippet reads `item.nested.name`, the snapshot
sees `items[0].nested === snap.nested` (same reference) and reports no change.
No `itemSignal.notify()` fires, the snippet doesn't re-evaluate. The comment
at `each.js:392-395` calls this out explicitly: "Top-level prop mutations
re-render dependent expressions; nested-object mutations slip past the shallow
check, and no documented contract relies on them."

If this is your case, the workaround is to either (a) replace `items[0]` with
a new object (`items[0] = { ...items[0], nested: { ...items[0].nested, name: 'x' } }`)
or (b) call `state.items.notify()` manually after the deep mutation.

### D. The badge is not just a text expression

If the snippet body has computed attributes or other reactive shapes, the
text-marker reactivity path I traced isn't the same as the attribute-binding
path. In particular, `{label}` as an attribute value vs as text content go
through different hydration routines (`hydrateAttributes` parallel-walk vs
`hydrateTextExpression`). Both should subscribe correctly, but if you're
seeing a discrepancy worth filing, post the snippet body verbatim.

### E. `_hydrating` flag stuck

If something throws during `hydrate` (e.g. a snippet name that resolves to
nothing, line 226 `fatal` from `template.js`), `_hydrating` may not be cleared
and subsequent `requestUpdate` calls get suppressed. Check the console for
errors at hydration time.

### F. Snippet name resolved to a subtemplate, not a snippet

`detectKind` (`template.js:121-127`) checks `self.snippets[name]` first. If
your `badge` symbol is registered as a *subtemplate* in scope (not a snippet)
because of a name collision or a ContentTemplate lookup, you take the
subtemplate branch instead — and subtemplates have a separate hydration path
with different data-flow semantics. Worth checking
`renderer.snippets['badge']` and `renderer.subTemplates['badge']` in DevTools
right after hydration.

---

## How to confirm in DevTools

If you want to verify the wire is in place after hydrate:

1. Set a breakpoint in `template.js` at line 227 (`buildSnippetProxy` call)
   inside the snippet branch of `hydrate`. Confirm it fires once per item
   with `data` being an each-item proxy (test:
   `isItemContext(data)` — exported from `each.js`).
2. Set a breakpoint in `each.js:418` (`rec.itemSignal.notify()`) and trigger
   your mutation. Confirm it fires for index 0.
3. Set a breakpoint in `reactive-data.js:219` (the textNode reaction body).
   Confirm it re-fires after step 2 and `value` is the new name.

If step 2 doesn't fire, the snapshot diff isn't seeing the change (case C, or
the mutation path doesn't reach reconcile — case A). If step 2 fires but
step 3 doesn't, the snippet body's Reaction never subscribed to that
itemSignal — would be a real framework bug, file it with a repro.

---

## File pointers

- `packages/renderer/src/engines/native/blocks/each.js` — reconcile, `adoptServerItems`, snapshot diff
- `packages/renderer/src/engines/native/blocks/each-content-classifier.js` — bails on snippets, forces eager wire
- `packages/renderer/src/engines/native/blocks/template.js` — snippet branch, `buildSnippetProxy` lazy-getter pattern
- `packages/renderer/src/engines/native/reactive-data.js:163` — `hydrateTextExpression` (firstRun subscription)
- `packages/renderer/test/browser/ssr-hydration.test.js:1408` — the canonical passing test for your exact pattern

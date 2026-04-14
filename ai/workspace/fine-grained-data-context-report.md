# Fine-Grained Reactive Data Context — Analysis & Proposal

## TL;DR

The current coarseness at these three sites is **not structural** — it's the direct
result of three different encodings of the same idea ("push child data into an
inner reactive scope"), none of which preserve per-property dep identity. The
reactivity primitives are already sufficient: top-level component state works fine
because each state property is its own `Signal`, and the `ExpressionEvaluator`
auto-`.depend()`s whenever a Signal is read through the data object
(`expression-evaluator.js:275`, `:314`, `:325`, `:351`). **Per-property granularity
is obtainable without new primitives — we only need to stop collapsing per-property
signals into one channel (each-item) and stop evaluating eagerly-then-push
(reactiveData).**

The proposed primitive — `ReactiveDataContext` — is therefore deliberately minimal:
a thin object that owns a dictionary of per-key `Signal`s and exposes (a) a Proxy
that reads like a plain object but tracks per-key deps under the hood, and (b) an
`update(source, keyMap)` method that re-evaluates author-supplied expression
functions and writes them into the per-key signals. Signal's own equality-gated
`set` provides the "only invalidate readers when my key actually changed" guarantee
for free.

Snippet args are **already fine-grained** in the current code (their lazy getters
run inside the inner per-marker Reaction, each getter reaches through to the
author's parent-data expression, and `renderer.lookupExpression` for a top-level
component skips `dataDep` because `receivesData === false`). The primitive still
gets adopted at the snippet site — but only to tighten a subtle gap around
snippets used **inside** subtemplates (where `receivesData === true` and every
inner expression currently depends on the parent subtemplate's `dataDep`).

---

## Question 1 — Is the coarseness structural?

No. Each of the three sites has a localized source:

### 1a. Each-items (`blocks/each.js`)

Every item owns ONE signal covering its whole per-item data object:

```js
// each.js:178-179
const itemSignal = new Signal(eachData, { allowClone: false });
const itemProxy = createItemDataProxy(data, itemSignal);

// each.js:97-109 — every property access through the proxy does:
get(target, prop) {
  if (typeof prop === 'symbol') { return target[prop]; }
  const itemData = itemSignal.value;   // <-- single shared .depend()
  if (prop in itemData) { return itemData[prop]; }
  return target[prop];
}
```

The Reaction running `{item.name}` and the Reaction running `{item.status}` both
subscribe to `itemSignal.dependency`. When reconcile's phase-3 loop runs
`rec.itemSignal.notify()` (each.js:356, hit whenever `typeof item === 'object'`
and the ref+index are unchanged), **both reactions invalidate**. That is the
N×M flame-chart pattern.

The `notify()` branch exists because same-ref object mutations (item
mutated in place) need a channel that bypasses `Signal`'s equality check
(`Signal.set` short-circuits on `isEqual(current, new)` — and after `allowClone:
false`, `currentValue === newItem` for in-place mutation). See invariant (e) in
the prompt — this is load-bearing.

### 1b. Subtemplate reactiveData (`blocks/template.js` → `template.js`)

`unpackNodeData` **evaluates eagerly** in the parent renderer's expression context
and returns a plain object:

```js
// template.js (block) :55-59
if (node.reactiveData) {
  each(node.reactiveData, (expr, key) => {
    templateData[key] = evaluator.lookupExpressionValue(expr, data);
  });
}
```

The returned `templateData` is then pushed through the subtemplate's lifecycle:

```js
// template.js (block) :306-307 (update branch, same-instance case)
self.currentInstance.setDataContext(templateData, { rerender: false });
self.currentInstance.render(templateData);

// template.js (templating) :745-750
else if (this.dataReplaced) {
  this.dataReplaced = false;
  this.renderer.bumpDataVersion();   // <-- fires dataDep.changed()
}
```

Inside the subtemplate, `receivesData === true`, so
`renderer.lookupExpression` (`renderer.js:196-201`) calls `this.dataDep.depend()`
for *every* inner expression:

```js
lookupExpression(expression, data) {
  if (this.receivesData) {
    this.dataDep.depend();
  }
  return this.evaluator.lookupExpressionValue(expression, data);
}
```

One `bumpDataVersion()` → every expression invalidates. That is the reactiveData
granularity gap. The `dataDep` was introduced because some derived values in
subtemplates (the `{uiClasses}` case in `ai/workspace/plans/receives-data-next-steps.md`)
are plain strings computed in the subtemplate's instance object, not signals —
so there needs to be *some* channel that invalidates them when parent data
changes. But it's used as a sledgehammer.

### 1c. Snippet args (`blocks/template.js` → `buildSnippetProxy`)

Snippet args are already lazy getters that forward through to the parent renderer:

```js
// template.js (block) :86-90
if (node.reactiveData) {
  each(node.reactiveData, (expr, key) => {
    reactiveGetters[key] = () => evaluator.lookupExpressionValue(expr, data);
  });
}
```

When `{label}` inside the snippet runs inside a Reaction, the lookup hits the
proxy's `get`, which calls `allGetters[prop]()`, which calls
`evaluator.lookupExpressionValue(exprLabel, data)`, which unwraps whatever signals
`exprLabel` reads on the parent data — registering per-signal deps on the
inner Reaction directly. **This already gives per-arg granularity for top-level
components**, because the shared renderer has `receivesData: false` and skips
`dataDep`.

The gap the evaluation prompt worries about surfaces only when the snippet is
invoked from **inside a subtemplate** whose renderer has `receivesData: true`.
Every inner-snippet Reaction then picks up a `dataDep.depend()` via
`renderer.lookupExpression`, and any `bumpDataVersion` on that subtemplate's
renderer invalidates all of them.

### Minimum change

The smallest change that makes all three sites granular:

1. **Each-item**: replace the single `itemSignal` with a per-key signal bag. The
   proxy reads key-by-key so each expression tracks only the Signal for the key
   it read.
2. **ReactiveData**: stop evaluating-and-pushing; keep one `Reaction` per key
   that writes its computed value into a per-key signal on the subtemplate's
   data object. Inner expressions naturally `.depend()` only on the keys they
   read. Drop `bumpDataVersion` from the `update` path for reactiveData-only
   changes (keep it for `data={…}` blob changes).
3. **Snippet args**: wrap each getter's evaluation in `Reaction.guard(…)` (which
   already exists, reactivity/src/reaction.js:126) **or** back the arg with a
   per-key signal for the same reason. `Reaction.guard` gives us "only invalidate
   readers when the computed value changes" using a private Dependency — exactly
   what we want per arg-key — but it's per-call overhead; reusing the per-key
   signal pattern amortizes it.

All three reductions converge on: "a bag of per-key Signals, owned by the block
instance, updated by short Reactions that re-evaluate author expressions against
the parent data context." That's the primitive.

---

## Question 2 — Shared abstraction or three mechanisms?

The lifecycle differences called out in the prompt (each-items reconcile every
parent update, subtemplates have their own render/bumpDataVersion path, snippets
are inlined) **are about where the primitive is created and destroyed, not what
it does**. The thing itself — "hold per-key computed values that invalidate
per key" — is identical.

A shared primitive works if it:

- Has no opinion about *when* its source expressions re-run. The primitive owns
  the result signals. The adoption site owns the Reaction that refreshes them.
- Exposes a plain-object-shaped `.proxy` that also falls through to a parent
  data bag for unknown keys (the snippet parent-data fallthrough invariant).
- Has a cheap `update(expressionMap, parentData)` that re-evaluates each
  author expression eagerly on parent-data changes and writes results into
  per-key signals (which do the equality-gated invalidation for us).
- Has a `dispose()` that stops any internal reactions it owns.

The three adoption sites layer distinct lifecycle on top:

| Site           | Creates            | Updates on                          | Disposes on         |
|----------------|--------------------|-------------------------------------|---------------------|
| each-items    | createRecord      | reconcile (per-item ref/index/notify)| disposeRecord      |
| subtemplate    | block `create`     | block `update` (parent render)      | block `destroy`     |
| snippet (nested)| block `create`    | parent's update reaction            | block `destroy`     |

Each site's `update` already runs inside the parent's block Reaction (`update`
hooks are called from the reaction wired in `define-block.js:135-145`), so
each site already has a natural place to push the refresh.

**Conclusion**: one primitive, three thin adoption sites. No separate machinery
needed.

---

## Question 3 — Where does it live?

Options considered:

1. **`packages/reactivity/src/reactive-context.js`** — elevates it to a first-class
   reactivity primitive. Pros: discoverable, nothing renderer-specific. Cons: the
   primitive exists *specifically* to push data from a parent reactive scope into
   a child renderer context; that coupling is a reactive-framework concept but
   a renderer idiom, and callers are all in `packages/renderer`.

2. **`packages/renderer/src/engines/native/reactive-data.js`** — already hosts
   the other "expression-position reactive binding" helpers (bindAttribute,
   bindTextExpression). Adding the primitive here expands its scope from
   *bindings* to *data-context plumbing*, which is not crazy — both are
   "reactive write-down from an expression".

3. **New file `packages/renderer/src/engines/native/reactive-context.js`** —
   clearest single-purpose home. Imported from `each.js` and `template.js`.
   Does not disturb `define-block.js` (which stays ignorant of this layer), and
   does not bloat `reactive-data.js` with an unrelated concern.

**Recommendation: option 3.** The primitive is a block-internal helper, and
`define-block.js` doesn't need to know about it. Blocks stay self-contained.
If a future engine (Lit) wants the same thing, it can either re-export the file
or duplicate — per the engine-agnostic-except-by-choice stance in CLAUDE.md.

---

## Question 4 — Reuse of existing primitives?

Scanned `packages/reactivity/src/*`:

- **`Signal.derive`** (signal.js:147) — makes one signal from another signal
  via a `computeFn`. The keyed case (N keys → N derived signals) would need N
  calls, each of which spins up its own `Reaction.create` + `WeakRef`. For
  fine-grained reactiveData on a subtemplate with 12 keys, that's 12 reactions
  running eagerly every time any source signal changes, re-running computeFn
  and `set`ing the derived signal. The per-reaction overhead (scheduler add,
  flush scheduling, dep cleanup) is real and redundant: the data flow here is
  synchronous-pull from a single parent update event, not a live chain. **Heavier
  than needed.**
- **`Signal.computed`** (signal.js:172) — same story with an explicit reaction.
- **`Reaction.guard`** (reaction.js:126) — this is the closest match. It wraps
  an expression in a private dep that only `.changed()`s when the value changes
  by `equalCheck`. For a single arg-key we'd wrap the getter:
  `get label() { return Reaction.guard(() => evaluator.lookupExpressionValue(exprLabel, data)); }`.
  **Reuse candidate for snippet args.** The downside: `Reaction.guard` creates
  a `Dependency` + `Reaction` on *every invocation*. Reading `label` inside a
  per-marker Reaction creates fresh machinery each render cycle. For stable
  snippet instances that re-render often, the allocation noise is
  non-trivial — and we can cache it per-key by reusing one Signal-per-key.
- **`Signal` itself (with `equalityFunction`)** — this is the machinery. Signal's
  equality-gated `set()` is exactly "write-down; only invalidate subscribers
  when the per-key value actually changed". One Signal per key + a shared
  reaction that refreshes them = the whole primitive.

**Conclusion**: the primitive is a *composition* of existing bits, not new
reactivity machinery. It's `{ key: Signal }` + a Proxy + one refresh reaction.
No new class in `@semantic-ui/reactivity`.

One other existing mechanism worth noting: the **evaluator auto-unwraps Signals
read through the data object** (`expression-evaluator.js:275`, `:314`, `:325`, `:351`).
This is the reason putting per-key Signals *into* the data object works end-to-end
with zero renderer changes — the evaluator already handles signals-in-data.

---

## Proposal: `ReactiveDataContext`

### Name and shape

A **class** that owns a per-key Signal bag and exposes a Proxy over it. Not a
function — it has lifecycle (`update`, `dispose`). Not a plain object — the
invariants (signal-per-key identity across updates, fallthrough to parent) are
shape rules that a class enforces.

### File location

`packages/renderer/src/engines/native/reactive-context.js` (new file).

### API surface

```js
import { Signal } from '@semantic-ui/reactivity';

/**
 * ReactiveDataContext — per-key signal bag with plain-object read ergonomics.
 *
 * Used by blocks that inject computed per-key data into a child rendering
 * context (each-items, subtemplate reactiveData, snippet args). Inner
 * expressions reading `.proxy.foo` register a dep on that key's signal only,
 * not on a block-wide channel.
 *
 * Parameters
 * ----------
 * parent : object
 *     Plain-object data context to fall through to for unknown keys. Inner
 *     expressions reading `{parentState}` when `parentState` isn't declared as
 *     a context key work by reading through to `parent`. Required.
 *
 * options.signalOptions : object (optional)
 *     Forwarded to each per-key Signal constructor. Default `{ allowClone: false }`
 *     — we don't want to deep-clone every computed value on every read.
 *
 * options.registerItemContext : boolean (optional)
 *     When true, the proxy is registered with `isItemContext` (each-items flag
 *     consumed by template.js `unpackNodeData`). Default false.
 *
 * Public surface
 * --------------
 * .proxy : Proxy
 *     Read like a plain object. Unknown keys fall through to `parent`. Known
 *     keys register a Signal dep on the current Reaction.
 *
 * .setKey(key, value) : void
 *     Write-through. Creates the per-key Signal on first write. Subsequent
 *     writes fire the Signal's equality-gated set — subscribers only
 *     invalidate if the value changed by `isEqual`.
 *
 * .notifyKey(key) : void
 *     Force-invalidate subscribers of one key. Used for same-ref mutation in
 *     place — the each-item "item mutated, ref unchanged" case (current
 *     `itemSignal.notify()` equivalent, but per-key).
 *
 * .has(key) : boolean
 * .keys() : string[]
 * .dispose() : void
 *     Clear all per-key signals. Subscribers' Reactions already cleanup on
 *     scope dispose; this method is a belt-and-braces for any long-lived
 *     Reactions that somehow outlive their scope.
 *
 * Implementation sketch
 * ---------------------
 * this.signals = new Map()    // key -> Signal
 * this.parent = parent
 * this.proxy = new Proxy(parent, {
 *   get(target, prop) {
 *     if (typeof prop === 'symbol') return target[prop]
 *     const sig = this.signals.get(prop)
 *     if (sig !== undefined) return sig.value   // registers per-key dep
 *     return target[prop]                        // fallthrough
 *   },
 *   has(target, prop) {
 *     return this.signals.has(prop) || (prop in target)
 *   },
 *   ownKeys(target) {
 *     return [...new Set([...this.signals.keys(), ...Reflect.ownKeys(target)])]
 *   },
 *   getOwnPropertyDescriptor(target, prop) {
 *     if (this.signals.has(prop)) {
 *       return { configurable: true, enumerable: true, value: this.signals.get(prop).peek() }
 *     }
 *     return Object.getOwnPropertyDescriptor(target, prop)
 *   },
 * })
 */
```

### Pseudocode for the primitive

```js
// packages/renderer/src/engines/native/reactive-context.js
import { Signal } from '@semantic-ui/reactivity';

const itemContextProxies = new WeakSet();
export function isItemContext(data) {
  return data != null && itemContextProxies.has(data);
}

export class ReactiveDataContext {
  constructor(parent, { signalOptions = { allowClone: false }, registerItemContext = false } = {}) {
    this.parent = parent;
    this.signals = new Map();
    this.signalOptions = signalOptions;

    const signals = this.signals;
    this.proxy = new Proxy(parent, {
      get(target, prop) {
        if (typeof prop === 'symbol') { return target[prop]; }
        const sig = signals.get(prop);
        if (sig !== undefined) { return sig.value; }
        return target[prop];
      },
      has(target, prop) {
        return signals.has(prop) || (prop in target);
      },
      ownKeys(target) {
        const own = Reflect.ownKeys(target);
        const out = [...signals.keys()];
        for (const k of own) { if (!signals.has(k)) { out.push(k); } }
        return out;
      },
      getOwnPropertyDescriptor(target, prop) {
        if (signals.has(prop)) {
          return { configurable: true, enumerable: true, value: signals.get(prop).peek() };
        }
        return Object.getOwnPropertyDescriptor(target, prop);
      },
    });

    if (registerItemContext) { itemContextProxies.add(this.proxy); }
  }

  setKey(key, value) {
    let sig = this.signals.get(key);
    if (sig === undefined) {
      sig = new Signal(value, this.signalOptions);
      this.signals.set(key, sig);
    }
    else {
      sig.set(value);   // equality-gated; only notifies if !isEqual
    }
  }

  notifyKey(key) {
    const sig = this.signals.get(key);
    if (sig !== undefined) { sig.notify(); }
  }

  // Bulk replace: used by each-items when whole item object swaps.
  // Existing keys that are no longer present keep their last-seen value
  // (caller-provided policy via `clearMissing: true` if required).
  replace(obj, { clearMissing = false } = {}) {
    for (const key in obj) { this.setKey(key, obj[key]); }
    if (clearMissing) {
      for (const key of this.signals.keys()) {
        if (!(key in obj)) { this.signals.get(key).set(undefined); }
      }
    }
  }

  has(key) { return this.signals.has(key); }
  keys() { return [...this.signals.keys()]; }

  dispose() {
    // Subscribers clean themselves up on Reaction.stop(). This method is
    // a future-proof hook in case we later add owned Reactions (e.g. for
    // blob-data subscriptions — see Q5(d) below).
    this.signals.clear();
  }
}
```

### Adoption site 1 — each-items (`blocks/each.js`)

Replace the single `itemSignal` + `createItemDataProxy` with a `ReactiveDataContext`
per record. `getEachData(...)` already produces the per-key dictionary (just
spread `item` + add `index`).

```js
// createRecord, replacing lines ~175-200
function createRecord({ key, item, index, collectionType, node, data, scope, renderAST, isSVG }) {
  const eachData = getEachData(item, index, collectionType, node);
  const itemScope = scope.child();

  const ctx = new ReactiveDataContext(data, {
    registerItemContext: true,
  });
  ctx.replace(eachData);

  const fragment = renderAST({ ast: node.content, data: ctx.proxy, scope: itemScope, isSVG });
  const startMarker = document.createTextNode('');
  const endMarker = document.createTextNode('');
  fragment.insertBefore(startMarker, fragment.firstChild);
  fragment.appendChild(endMarker);

  return { key, item, index, ctx, startMarker, endMarker, fragment, scope: itemScope, isElse: false };
}

// reconcile phase 3, replacing lines 347-358
for (let i = 0; i < newRecords.length; i++) {
  const rec = newRecords[i];
  const item = items[i];
  if (rec.item !== item || rec.index !== i) {
    // Ref/index changed. Replace keys — replace() writes per-key, so only the
    // keys whose values actually changed invalidate their subscribers.
    rec.ctx.replace(getEachData(item, i, collectionType, node), { clearMissing: false });
    rec.item = item;
    rec.index = i;
  }
  else if (typeof item === 'object') {
    // Same ref, same index — the object may have been mutated in place. We
    // can't tell which keys changed from here; fall back to notifying every
    // key (equivalent to current `itemSignal.notify()`). Authors who want
    // finer granularity should use Signal-based item properties at the source
    // — the evaluator auto-unwraps Signals-in-data already.
    //
    // NOTE: this preserves invariant (e). Callers relying on mutation-in-
    // place see the same coarseness they see today — for that one item.
    // Importantly, OTHER items' per-key signals are untouched, and within
    // this item's keys, equality-gated set on `replace()` above would have
    // been cheaper if we could detect the change — but we can't without
    // reading the previous value. Leave notify-all as the mutation fallback.
    rec.ctx.replace(getEachData(item, i, collectionType, node));
    // (no explicit notifyKey — replace has no mechanism to pick up in-place
    // mutation because the item object *is* the source. notifyAll is still
    // available via: for (const k of rec.ctx.keys()) rec.ctx.notifyKey(k))
    for (const k of rec.ctx.keys()) { rec.ctx.notifyKey(k); }
  }
}

// disposeRecord — drop reference to itemSignal, call ctx.dispose()
function disposeRecord(record) {
  record.scope.dispose();
  record.ctx.dispose();
  disposeRecordDOM(record);
}
```

**Correctness note for each-items**: Before, `itemSignal.notify()` after reconcile
invalidated every expression in the item. With this change, `replace()` only
invalidates keys whose values materially changed. For a filter-keystroke that
drops half the list but leaves survivors unchanged, phase-3 skips survivors
entirely because their `rec.item === item` and `rec.index === i`; no signals
fire. **This is the filter-keystroke win.** For the same-ref mutation fallback
case (invariant e), we still notify all keys of that one item — no worse than
today, and strictly better for every other item.

### Adoption site 2 — subtemplate `reactiveData` (`blocks/template.js`)

The subtemplate's own data object becomes the home for per-key signals. We stop
calling `bumpDataVersion` for reactiveData-only changes. We keep the child's
`data` object in place and overlay per-key signals onto it so the child's
evaluator unwraps them naturally.

```js
// create — owned per-block
create({ renderer }) {
  return {
    evaluator: renderer.evaluator,
    subTemplates: renderer.subTemplates,
    snippets: renderer.snippets,
    parentTemplate: renderer.template,
    dataDep: renderer.dataDep,
    kind: null,
    currentTemplateID: null,
    currentInstance: null,
    reactiveCtx: null,   // ReactiveDataContext for reactiveData keys
    blobData: null,      // last value of data={…} blob, if used
  };
}

// unpackNodeData becomes a two-part push:
//   (a) blob part (static data + string data) — assigned directly into the
//       subtemplate's data. Changes to the blob still use the dataDep
//       sledgehammer, matching today's semantics for data={…}.
//   (b) reactive part — written to the reactiveCtx. The subtemplate's
//       `data` object has the reactiveCtx.signals layered on via Proxy.

function applyReactiveData(node, parentData, evaluator, ctx) {
  if (!node.reactiveData) { return; }
  each(node.reactiveData, (expr, key) => {
    ctx.setKey(key, evaluator.lookupExpressionValue(expr, parentData));
  });
}

function unpackBlobData(node, parentData, evaluator) {
  if (!node.data) { return {}; }
  if (isString(node.data)) {
    const v = evaluator.lookupExpressionValue(node.data, parentData);
    return isPlainObject(v) ? { ...v } : {};
  }
  if (isPlainObject(node.data)) {
    const out = {};
    const inItemCtx = isItemContext(parentData);
    each(node.data, (expr, key) => {
      out[key] = inItemCtx
        ? evaluator.lookupExpressionValue(expr, parentData)
        : Reaction.nonreactive(() => evaluator.lookupExpressionValue(expr, parentData));
    });
    return out;
  }
  return {};
}

// render
render({ node, data, region, scope, renderAST, self, isSVG }) {
  const kind = detectKind({ node, data, self });
  if (kind === null) { return; }

  if (kind === 'snippet') { /* see site 3 */ return; }

  // Subtemplate
  const { template, templateName } = resolveSubtemplate(node.name, data, self);
  if (!template) { return; }

  const blob = unpackBlobData(node, data, self.evaluator);
  self.blobData = blob;

  self.currentTemplateID = template.id;
  self.currentInstance = cloneInstance({ template, templateName, templateData: blob, self });

  // Build reactiveCtx on TOP of the subtemplate's own data object. The
  // subtemplate's `data` is the parent it falls through to; per-key signals
  // overlay those entries. We also re-use the subtemplate's `data` object
  // identity — the evaluator has already been constructed pointing at it.
  self.reactiveCtx = new ReactiveDataContext(self.currentInstance.data);
  applyReactiveData(node, data, self.evaluator, self.reactiveCtx);

  // Replace the renderer's data reference with the proxy so inner reads
  // see per-key signals. The subtemplate's renderer was constructed with
  // `data: this.overlaySettingsSignals(this.getDataContext())` at
  // template.js:286 — we swap that for the proxy here.
  self.currentInstance.renderer.data = self.reactiveCtx.proxy;
  self.currentInstance.renderer.evaluator.setData(self.reactiveCtx.proxy);

  const fragment = self.currentInstance.render();
  region.setContent(fragment);
  attachToRenderRoot(self.currentInstance, region, self);
}

// update
update({ node, data, region, self }) {
  if (self.kind === 'snippet') { return; }

  const { template, templateName } = resolveSubtemplate(node.name, data, self);
  if (!template) { clearInstance(self, region); return; }

  if (template.id !== self.currentTemplateID) {
    // Template swap — tear down, recreate (render path above).
    if (self.currentInstance) { self.currentInstance.onDestroyed(); }
    self.reactiveCtx?.dispose();
    // ... re-run the render-path equivalent
    return;
  }

  // Same instance — the hot path.
  //
  // 1. Blob data (data={…} or data=expr): if it changed, push through
  //    setDataContext + bumpDataVersion as today. This keeps the "whole blob"
  //    semantics of verbose data.
  const newBlob = unpackBlobData(node, data, self.evaluator);
  const blobChanged = !isEqual(self.blobData, newBlob);
  if (blobChanged) {
    self.blobData = newBlob;
    self.currentInstance.setDataContext(newBlob, { rerender: false });
    // setDataContext sets dataReplaced; render() will call bumpDataVersion.
    self.currentInstance.render();
  }

  // 2. ReactiveData — per-key. No bumpDataVersion. Only keys whose values
  //    materially changed invalidate their readers.
  applyReactiveData(node, data, self.evaluator, self.reactiveCtx);

  // If neither changed, this update is a no-op — the parent block Reaction
  // firing doesn't mean anything changed for this subtemplate.
}

// destroy
destroy({ self }) {
  if (self.currentInstance) {
    self.currentInstance.onDestroyed();
    self.currentInstance = null;
  }
  self.reactiveCtx?.dispose();
  self.reactiveCtx = null;
}
```

**Correctness note for reactiveData**: `applyReactiveData` walks `node.reactiveData`
OUTSIDE any inner Reaction (it runs directly under the parent block Reaction).
It reads parent signals via `evaluator.lookupExpressionValue` — those reads
register on the parent block Reaction, so when parent signals change, the parent
block's Reaction invalidates and `update` re-runs, which re-calls `applyReactiveData`.
The per-key `setKey` is equality-gated, so only *materially changed keys* fire
their child-side Signals. Inner child expressions only `.depend()` on the keys
they read. **This is the fine-grained granularity.**

One subtle point: `receivesData: true` on the subtemplate's renderer currently
gates the `dataDep.depend()` inside `lookupExpression` — that channel still
exists for the blob-data case. With this change, *reactiveData-only changes
don't touch it*, so per-key granularity is honored. Blob-data changes still
use the sledgehammer (by design — that matches the existing test
`verbose data=expression re-evaluates all expressions`).

### Adoption site 3 — snippet args (`blocks/template.js::buildSnippetProxy`)

For top-level components, snippet args are already per-signal-granular (see
Q1c). To close the gap when snippets are nested inside subtemplates, back each
arg with a `ReactiveDataContext` signal:

```js
// Replace buildSnippetProxy
function buildSnippetReactiveCtx(node, parentData, evaluator, scope) {
  const ctx = new ReactiveDataContext(parentData);

  // Static string/object data: evaluate once, write once. Not refreshed.
  if (node.data) {
    if (isString(node.data)) {
      const evaluated = evaluator.lookupExpressionValue(node.data, parentData);
      if (isPlainObject(evaluated)) {
        for (const key in evaluated) { ctx.setKey(key, evaluated[key]); }
      }
    }
    else if (isPlainObject(node.data)) {
      each(node.data, (expr, key) => {
        ctx.setKey(key, evaluator.lookupExpressionValue(expr, parentData));
      });
    }
  }

  // Reactive args: one small Reaction per key that re-evaluates against
  // parent data and writes into the per-key signal. The scope (parent
  // block's scope) owns it so it tears down on unmount.
  if (node.reactiveData) {
    each(node.reactiveData, (expr, key) => {
      scope.track(Reaction.create(() => {
        ctx.setKey(key, evaluator.lookupExpressionValue(expr, parentData));
      }));
    });
  }

  return ctx;
}

// render (snippet branch)
if (kind === 'snippet') {
  const snippet = resolveSnippet(node.name, data, self);
  if (!snippet) { fatal('Snippet name resolved to a missing snippet'); }
  const ctx = buildSnippetReactiveCtx(node, data, self.evaluator, scope);
  self.snippetCtx = ctx;
  const fragment = renderAST({ ast: snippet.content, data: ctx.proxy, scope, isSVG });
  region.setContent(fragment);
  return;
}

// destroy
destroy({ self }) {
  self.snippetCtx?.dispose();
  // ... existing subtemplate destroy
}
```

**Key difference from today's `buildSnippetProxy`**: today's proxy runs the getter
*inside the inner Reaction* — so the inner Reaction picks up every parent signal
the expression reads. In the nested-subtemplate case, it also picks up
`dataDep` via `renderer.lookupExpression`. With per-key signals, the inner
Reaction only picks up the one `ReactiveDataContext` Signal for the key it
read, AND the short refresh Reaction picks up parent signals. Layering like
that breaks the dataDep pollution.

**Parent fallthrough (invariant)**: `ctx.proxy` falls through to `parentData`
for unknown keys via the Proxy's `get` handler. Reads of `{parentState}` from
inside the snippet flow through and register directly against parent Signals.
Same behavior as today.

---

## Question 5 — Correctness hazards

### (a) Late-declared properties

An inner expression reads `ctx.proxy.latecomer` where `latecomer` is not declared
as a key at proxy creation. The `get` handler hits `signals.get('latecomer') ===
undefined`, falls through to `parent['latecomer']`. If the parent later gains
`latecomer`, the Reaction picked up *whatever signal the parent read for that
key*; so the read is still reactive through the parent signal.

If the key is *subsequently* declared via `setKey`, the next parent update's
invocation of `update` → `applyReactiveData` / `buildSnippetReactiveCtx` will
`setKey('latecomer', ...)`. That creates a brand-new `Signal`. Readers that
picked up the *parent's* signal don't transparently move to the new signal.
**This is a quiet correctness bug risk.**

Mitigations:
- For each-items: `getEachData` produces a stable key set (spread of `item` +
  `index`). `item` is author-provided. Items gaining keys across updates are
  an edge case but possible. Solution: on `replace()`, if a new key appears
  for the first time, we need to *force-invalidate* any reader that was
  reading through to the parent for that key. Since we can't enumerate which
  reactions read `proxy.latecomer`, the practical answer is **call
  `bumpDataVersion` on the owning renderer when new keys appear** — a
  once-per-key-lifetime cost, not a once-per-update cost.
- For reactiveData / snippet args: the template author declares the key set
  in the template source. The key set is static across renders. Non-issue.

**Recommendation**: add `ReactiveDataContext.ensureKey(key, initialValue)` that
the each-adoption-site calls before `setKey` and that bumps the owning renderer's
`dataDep` exactly once per new key. Subtemplate and snippet sites don't need it.

### (b) Conditional reads (ternary, `isDev`, etc.)

An expression reads `ctx.proxy.a` when a condition is true and `ctx.proxy.b`
when false. The inner Reaction tracks only the signal it actually read this
time. On re-run it re-tracks. This is standard reactivity — works fine.

The only concern is Signal-dep leakage from a previous branch. Reaction's
`run()` (reaction.js:66-70) clears its dependency set at the start of every
run: `dep.cleanUp(this); this.dependencies.clear();`. Old branch deps are
dropped. **No action needed.**

### (c) Nested blocks — `{#each}` inside `{#if}` inside `{>snippet}`

Three layers of data context:

1. `>snippet` wraps parent in `snippetCtx.proxy` (ReactiveDataContext overlay).
2. `{#if}` doesn't introduce a new data layer — it reuses the parent data.
3. `{#each}` wraps snippetCtx.proxy in `itemCtx.proxy` (per-item ReactiveDataContext
   with `snippetCtx.proxy` as its parent).

Reading `ctx.proxy.item.name` inside the `each` body:
- `itemCtx.proxy.item` → hits `signals.get('item')` → registers per-key dep.
- If `item` isn't declared in `itemCtx` (maybe the author wrote `{item.name}`
  and `itemCtx` declares flat keys via `{...item, index}`), the read of `name`
  goes through the spread and hits the per-key signal for `name`.
- For `{parentSnippetArg}`, fallthrough hits `snippetCtx.proxy`, which registers
  on `snippetCtx`'s per-key signal for that arg.

Each layer is an independent `ReactiveDataContext` with its own per-key signals;
reads cross layers via proxy fallthrough; each layer registers only the key
the expression actually reads. **No cross-layer invalidation.** This is already
better than the current status (where `each`'s `itemSignal.notify()` and
subtemplate's `dataDep.changed()` both broadcast coarsely).

Invariant (3): snippets parent-data fallthrough — preserved, via the Proxy's
`get` handler returning `target[prop]` (where target = parent).

Invariant (4): `isItemContext(data)` → `itemContextProxies.has(data)`. Moved into
`reactive-context.js` (or each.js re-exports it). The `registerItemContext: true`
flag on the each-site adoption keeps the WeakSet registration. **Preserved.**

### (d) Spread / computed property access

**Spread** (`{>snippet ...data}`): the compiler currently compiles `...data`
into `node.data = 'data'` (string-expr form), not into individual keys. Treated
by `unpackBlobData` as the blob path — equality-gated whole-blob pushdown.
Individual spread keys are not discoverable at template compile time because the
expression isn't a literal object; `unpackBlobData` resolves to a plain object,
and only *that* object's keys are available. Proposal falls through to blob
semantics here, matching today.

**`Object.keys(data)` inside a child expression**: the proxy's `ownKeys` returns
`[...signals.keys(), ...Reflect.ownKeys(parent)]`. For each-items the spread of
`item` into `eachData` means all item keys appear as signal keys. For reactiveData
the declared arg keys appear. For keys that only live on the parent (fallthrough
case), they appear via `Reflect.ownKeys(parent)`. **Works.**

**Dynamic key access** (`data[dynamicKey]`): the inner Reaction reads
`proxy[dynamicKey]`, which hits the Proxy `get`. If `signals.has(dynamicKey)`,
returns the signal value (registers per-key dep). If not, falls through. The
Reaction still tracks correctly; **no correctness issue**, but if `dynamicKey`
itself is signal-driven, the read pattern is "read dynamicKey, then read
proxy[thatValue]" — the Reaction picks up deps on both. Fine.

### (e) Mutation in place

The prompt calls this out as load-bearing. Today's mechanism:
```js
// each.js:355-357
else if (typeof item === 'object') {
  rec.itemSignal.notify();
}
```

Under the proposal, the equivalent is `for (const k of rec.ctx.keys())
rec.ctx.notifyKey(k);` in the same branch. This **preserves invariant (e)**:
a same-ref item that gets mutated in place still broadcasts to all its own
inner expressions. The only cost is a loop-of-notify instead of one notify —
for N keys per item it's N `Dependency.changed()` calls, each walking its
subscribers once. For items with 3-10 keys and inner expressions that read
only a subset of those keys, the broadcast is still smaller than today
(today hits every expression, not every key).

An important bonus: **other items** in the each are unaffected. Today's
setup was already per-item (because each record has its own `itemSignal`),
but sibling items' per-expression invalidations aren't a real risk today —
the real current pain is within *each surviving item* doing N re-evaluations.

### Summary — five correctness sub-points

| Hazard | Resolution |
|--------|------------|
| (a) Late-declared keys | `ensureKey(key)` bumps parent `dataDep` once per new key for each-items; reactiveData/snippet args have static key sets so N/A. |
| (b) Conditional reads | Works — Reaction's per-run dep-cleanup handles branch switches. |
| (c) Nested blocks | Each layer is an independent ReactiveDataContext; proxy fallthrough preserves snippet parent-data invariant; `isItemContext` still works. |
| (d) Spread / computed | Spread falls through to blob semantics (today's behavior). Dynamic key access tracks correctly via Proxy. `ownKeys` surfaces both own signals and parent keys. |
| (e) In-place mutation | `ctx.notifyKey(k)` loop replaces today's single `itemSignal.notify()`. Same sibling-item isolation; within-item broadcast shape unchanged. |

---

## Test coverage changes

- `subtree-spurious.test.js` — the `it.skip` on `reactiveData per-key
  granularity` becomes `it`. Should pass on the proposal.
- `snippet args per-key granularity` is already passing (not `.skip`-marked
  in the current source); the proposal's snippet-site change preserves this
  for top-level components AND fixes the nested-subtemplate case (currently
  not tested; **add a test**: "snippet inside subtemplate whose reactiveData
  arg changed — sibling snippet args don't re-evaluate").
- `per-item granularity inside a single each` — the second test
  (`re-rendering each list should not re-evaluate per-item static expressions
  in untouched items`) currently passes by virtue of same-ref same-index
  short-circuit at each.js:350, but the general claim ("changing one item's
  data doesn't invalidate a sibling item's static expressions") becomes
  strictly tighter with per-key signals. Add a regression test: "mutating
  `items[0].name` in place, then calling `.items.notify()`, should invalidate
  item 0's name expression but not its status expression."
- Invariant tests — `sibling expressions in flat template` stays green. The
  flat-component path doesn't go through `ReactiveDataContext`; state-Signal
  deps continue to route per-signal.

---

## Why not introduce a new reactivity primitive?

A tempting alternative: add `Signal.scope({ keys })` or `ReactiveRecord` to
`@semantic-ui/reactivity`. Rejected because:

1. The behavior is fully expressible as N Signals + a Proxy. Adding a
   reactivity primitive would be new API surface for zero reactivity semantic
   gain.
2. The Proxy half is renderer-specific — it depends on
   `ExpressionEvaluator`-style data lookup (the evaluator unwraps Signals-in-data
   implicitly). A generic reactivity primitive would either have to reach
   into evaluator behavior or expose a signal-unwrapping contract that the
   evaluator already provides.
3. The reactivity package is deliberately lean — `Signal`, `Reaction`,
   `Dependency`, `Scheduler`. Keeping `ReactiveDataContext` in the renderer
   preserves that separation.

---

## Minimum disturbance to `defineBlock`

Blocks stay self-contained modules. The primitive is imported from
`./reactive-context.js` by `each.js` and `template.js`. `define-block.js`
does not know about it. The 9-key `bag` shape passed to hook callbacks
stays untouched — the `self.reactiveCtx` / `self.snippetCtx` fields live on
the block's own state object, which `create()` already owns.

The `isItemContext` helper moves from `each.js` to `reactive-context.js` (or
`each.js` re-exports it) so both producers (each) and consumers (template.js
`unpackBlobData`) reach for the same symbol.

---

## Summary

- No new reactivity primitive.
- One small renderer-local class (`ReactiveDataContext`) composing existing
  `Signal` and `Proxy`.
- Adoption at three sites replaces: (a) single-signal-per-item in each,
  (b) eager-eval-then-push in subtemplate reactiveData, (c) lazy-getter proxy
  in snippet args (with minor tightening for nested cases).
- Preserves every invariant in the prompt (keyed reconciliation, hydration,
  snippet parent-data fallthrough, `isItemContext` consumers, in-place
  mutation semantics).
- Turns the currently-skipped `reactiveData per-key granularity` test green.
- Eliminates the N×M flame-chart pattern on each-item updates.
- Drops `bumpDataVersion` from the subtemplate-reactiveData path — it stays
  for the blob-data path (which is documented to be coarse by design).

The size of the change, line-for-line, is a wash: `each.js` loses
`createItemDataProxy` and the single-signal handling; `template.js` loses
`unpackNodeData`'s eager-eval path; a new ~80-line file appears at
`reactive-context.js`. Net ~0, with measurably better expression-evaluation
counts on filter/update benchmarks.

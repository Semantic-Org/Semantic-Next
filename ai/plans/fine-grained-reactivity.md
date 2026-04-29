# Fine-Grained Reactive Data Context

## Goal

Eliminate the shared "any property change invalidates every expression" coarseness at the three data-context push sites in the native renderer: `{#each}` per-item data, subtemplate `reactiveData=`, and snippet args. A template author who reads `{item.name}` and `{item.status}` in the same each item should see only the `name` binding re-evaluate when item data's name changes — not both.

Flat component templates already achieve this because each `state.X` is its own `Signal`. The three block-level sites collapse to coarse invalidation via either a whole-context `Signal` (each items), eager-eval-then-push with `bumpDataVersion` (subtemplate reactiveData), or `dataDep`-coupled lazy getters (snippet args inside subtemplates). This plan introduces a shared primitive — **`ReactiveDataContext`** — that fixes all three with one composition of existing `Signal` + `Proxy` + per-key `Reaction`.

## Design / Implementation

### The primitive

A class `ReactiveDataContext` living at `packages/renderer/src/engines/native/reactive-context.js`. Owns a per-key bag of framework-internal `Signal`s (`safety: 'none'` — see Open Questions) and exposes a `Proxy` that reads like a plain object but registers per-key dependencies under the hood. Plain-object-shaped proxy means the `ExpressionEvaluator`'s existing auto-unwrap-of-Signals-in-data behavior works end-to-end with zero evaluator changes.

```js
import { Signal } from '@semantic-ui/reactivity';

const itemContextProxies = new WeakSet();
export function isItemContext(data) {
  return data != null && itemContextProxies.has(data);
}

export class ReactiveDataContext {
  constructor(parent, { registerItemContext = false } = {}) {
    this.parent = parent;
    this.signals = new Map();
    const signals = this.signals;
    this.proxy = new Proxy(parent, {
      get(target, prop) {
        if (typeof prop === 'symbol') return target[prop];
        const sig = signals.get(prop);
        if (sig !== undefined) return sig.value;    // registers per-key dep
        return target[prop];                        // fallthrough to parent
      },
      has(target, prop) {
        return signals.has(prop) || (prop in target);
      },
      ownKeys(target) {
        const own = Reflect.ownKeys(target);
        const out = [...signals.keys()];
        for (const k of own) { if (!signals.has(k)) out.push(k); }
        return out;
      },
      getOwnPropertyDescriptor(target, prop) {
        if (signals.has(prop)) {
          return { configurable: true, enumerable: true, value: signals.get(prop).peek() };
        }
        return Object.getOwnPropertyDescriptor(target, prop);
      },
    });
    if (registerItemContext) itemContextProxies.add(this.proxy);
  }

  setKey(key, value) {
    let sig = this.signals.get(key);
    if (sig === undefined) {
      sig = new Signal(value, { safety: 'none' });
      this.signals.set(key, sig);
    } else {
      sig.set(value);                               // under 'none', always notifies
    }
  }

  notifyKey(key) {
    const sig = this.signals.get(key);
    if (sig !== undefined) sig.notify();
  }

  replace(obj, { clearMissing = false } = {}) {
    for (const key in obj) this.setKey(key, obj[key]);
    if (clearMissing) {
      for (const k of this.signals.keys()) {
        if (!(k in obj)) this.signals.get(k).set(undefined);
      }
    }
  }

  has(key) { return this.signals.has(key); }
  keys() { return [...this.signals.keys()]; }
  dispose() { this.signals.clear(); }
}
```

### Adoption site 1 — each-items (`blocks/each.js`)

Replace the single `itemSignal` + `createItemDataProxy` with a `ReactiveDataContext` per record. `getEachData` already returns the flat per-key dictionary.

```js
function createRecord({ key, item, index, collectionType, node, data, scope, renderAST, isSVG }) {
  const eachData = getEachData(item, index, collectionType, node);
  const itemScope = scope.child();
  const ctx = new ReactiveDataContext(data, { registerItemContext: true });
  ctx.replace(eachData);

  const fragment = renderAST({ ast: node.content, data: ctx.proxy, scope: itemScope, isSVG });
  const startMarker = document.createTextNode('');
  const endMarker = document.createTextNode('');
  fragment.insertBefore(startMarker, fragment.firstChild);
  fragment.appendChild(endMarker);
  return { key, item, index, ctx, startMarker, endMarker, fragment, scope: itemScope, isElse: false, fresh: true };
}

// reconcile phase 3
for (let i = 0; i < newRecords.length; i++) {
  const rec = newRecords[i];
  const item = items[i];
  if (rec.item !== item || rec.index !== i) {
    rec.ctx.replace(getEachData(item, i, collectionType, node));
    rec.item = item;
    rec.index = i;
  } else if (typeof item === 'object' && !rec.fresh) {
    for (const k of rec.ctx.keys()) rec.ctx.notifyKey(k);   // invariant-(e) in-place mutation
  }
  rec.fresh = false;
}
```

Preserves the recent `fresh` flag (prevents phantom-`flushTask`). Drops `itemSignal` and `createItemDataProxy` entirely.

### Adoption site 2 — subtemplate `reactiveData` (`blocks/template.js`)

One `Reaction` per reactiveData key, each pushing its own refresh into `setKey`. Stop calling `bumpDataVersion` for reactiveData-only changes; keep it for `data={...}` blob changes (the existing `verbose data=expression re-evaluates all expressions` test asserts this is coarse by design).

```js
function setupReactiveSubtemplate({ node, data, scope: reactionScope, self, region }) {
  const blob = unpackBlobData(node, data, self.evaluator);                          // static blob, one shot
  self.blobData = blob;
  self.currentInstance = cloneInstance({ template, templateName, templateData: blob, self });
  self.reactiveCtx = new ReactiveDataContext(self.currentInstance.data);

  // Seed initial values for every reactiveData key.
  if (node.reactiveData) {
    each(node.reactiveData, (expr, key) => {
      self.reactiveCtx.setKey(key, self.evaluator.lookupExpressionValue(expr, data));
    });
  }

  // Swap the subtemplate's data reference to the proxy so inner expressions
  // read per-key signals via evaluator auto-unwrap.
  self.currentInstance.renderer.data = self.reactiveCtx.proxy;
  self.currentInstance.renderer.evaluator.setData(self.reactiveCtx.proxy);

  // One Reaction per reactiveData key — only the changed key's expression
  // re-evaluates when a source signal changes.
  if (node.reactiveData) {
    each(node.reactiveData, (expr, key) => {
      reactionScope.reaction(region.anchor, (comp) => {
        const value = self.evaluator.lookupExpressionValue(expr, data);
        if (comp.firstRun) return;                                                  // seeded above
        self.reactiveCtx.setKey(key, value);
      }, { message: `subtemplate-arg:${key}` });
    });
  }

  const fragment = self.currentInstance.render();
  region.setContent(fragment);
  attachToRenderRoot(self.currentInstance, region, self);
}
```

`update` no longer re-calls `setDataContext` for reactiveData-only changes. Blob data still flows through `setDataContext` + `bumpDataVersion` unchanged.

### Adoption site 3 — snippet args (`blocks/template.js::buildSnippetProxy`)

Same pattern — `ReactiveDataContext` on top of parent data, one per-key Reaction for reactiveData args.

```js
function buildSnippetReactiveCtx(node, parentData, evaluator, reactionScope) {
  const ctx = new ReactiveDataContext(parentData);

  // Static data (one-shot, no refresh Reaction needed)
  if (node.data) {
    if (isString(node.data)) {
      const evaluated = evaluator.lookupExpressionValue(node.data, parentData);
      if (isPlainObject(evaluated)) {
        for (const key in evaluated) ctx.setKey(key, evaluated[key]);
      }
    } else if (isPlainObject(node.data)) {
      each(node.data, (expr, key) => {
        ctx.setKey(key, Reaction.nonreactive(() => evaluator.lookupExpressionValue(expr, parentData)));
      });
    }
  }

  // Reactive args — one Reaction per key pushing into ctx
  if (node.reactiveData) {
    each(node.reactiveData, (expr, key) => {
      reactionScope.reaction(/* anchor */ null, (comp) => {
        const value = evaluator.lookupExpressionValue(expr, parentData);
        if (comp.firstRun) ctx.setKey(key, value);
        else ctx.setKey(key, value);                                                // same call, clearer intent
      }, { message: `snippet-arg:${key}` });
    });
  }

  return ctx;
}
```

### Tests that flip

- `subtree-spurious.test.js: reactiveData per-key granularity` — currently `it.skip`. Flip to `it`. Must pass.
- `subtree-spurious.test.js: snippet args per-key granularity` — currently `it.skip` with a note about the pre-existing zero-reactivity failure mode. Needs investigation (see Open Question 1) before this becomes a pass-gate for the plan.

Additional tests to add:

- Mutating `items[0].name` in place, then calling `ctx.notifyKey('name')` on record 0, should invalidate item 0's name expression but not item 0's status expression, and not touch sibling items' expressions at all.
- Snippet inside a subtemplate — changing one snippet arg should not re-evaluate inner expressions reading the other arg (the nested-receivesData case agent flagged).

### Flame-chart gate

Re-run the `/perf/hydrated` filter-keystroke scenario via Chrome DevTools. Before: every surviving item's bindings re-evaluate (N × M). After: only item bindings whose per-property signal changed should re-evaluate. If index-only-shift items still re-run (because `index` is a key), consider excluding `index` from per-key invalidation or just accepting that as out of scope (templates rarely read `index` in an each body).

### Why not a new reactivity primitive?

A tempting alternative is `Signal.scope({ keys })` or `ReactiveRecord` in `@semantic-ui/reactivity`. Rejected because:

1. The behavior is fully expressible as N `Signal`s + a `Proxy`. A new primitive would be API surface for zero new reactivity semantic.
2. The Proxy half is renderer-specific — it depends on `ExpressionEvaluator`'s auto-unwrap-Signals-in-data contract, which the reactivity package doesn't provide.
3. The reactivity package stays lean (`Signal`, `Reaction`, `Dependency`, `Scheduler`). `ReactiveDataContext` is renderer-internal composition, not new reactivity surface.

## Correctness hazards

### Late-declared keys

Per-key signals are created on first `setKey`. A reader that previously fell through to the parent for a key keeps its dependency on the parent's signal, not on the freshly-created per-key signal. Each-items can hit this because the key set comes from `getEachData`'s spread of `item` (author-provided). Mitigation: `ReactiveDataContext.ensureKey(key)` bumps the owning renderer's `dataDep` exactly once per new key — once-per-key-lifetime, not once-per-update. Subtemplate reactiveData and snippet args have static template-source-declared key sets and don't need it.

### Conditional reads

`{condition ? ctx.proxy.a : ctx.proxy.b}` works without special handling. `Reaction.run()` clears its dependency set at the start of every run, so old-branch deps drop on re-run. Standard reactivity.

### Nested blocks (each inside if inside snippet)

Three layers of `ReactiveDataContext` stack via Proxy fallthrough: a snippet's ctx wraps the parent renderer's data; `{#each}`'s ctx wraps the snippet's proxy; `{#if}` reuses its parent without introducing a layer. Reading `proxy.foo` registers a per-key dep at the layer that owns `foo`; reading a key not in the current layer falls through to the next. **No cross-layer invalidation.** Strictly tighter than today's `itemSignal.notify()` and `dataDep.changed()` broadcasts.

### Spread and dynamic key access

`{>snippet ...data}` compiles into the blob path (`node.data = 'data'`), not individual keys — it routes through `unpackBlobData` and equality-gates the whole blob, matching today's semantics. `{data[dynamicKey]}` reads through the Proxy `get` correctly: if `dynamicKey` resolves to a known signal key the Reaction registers a per-key dep; otherwise it falls through to the parent. `Object.keys(data)` returns own signal keys union parent keys via the Proxy's `ownKeys` trap.

### In-place mutation (invariant e)

`ctx.notifyKey(k)` for every key replaces today's single `itemSignal.notify()` for the same-ref mutation case. For an item with N keys and inner expressions reading a subset, broadcast cost is per-key — only readers of mutated keys re-fire, not every expression. Sibling items remain isolated. Net: same isolation as today, finer granularity within the mutated item.

## Open Questions

1. **Snippet args granularity gap is bounded to nested-in-subtemplate.** Top-level snippet args are already per-signal-granular — the lazy getter runs inside the inner Reaction and reaches through to parent expressions, and `lookupExpression` skips `dataDep` because the parent renderer has `receivesData: false`. The `it.skip`-marked test failure surfaces only when a snippet is invoked inside a subtemplate, where `receivesData: true` adds `dataDep.depend()` to every inner snippet-arg Reaction. The plan's snippet-site adoption layers a per-key signal between parent and inner Reaction so subtemplate `dataDep` pollution stops at the layer boundary.

2. ~~**`ensureKey` / one-time coarse bump on new keys**~~ — Resolved: keep `ensureKey`. For each-items the per-key set is `getEachData`'s spread of `item` plus `index`, and `item` is author-provided — items can gain keys across updates. When a new key first appears for a record, `setKey` creates a fresh per-key signal, but readers that previously fell through to the parent for that key don't transparently re-subscribe. `ReactiveDataContext.ensureKey(key)` bumps the owning renderer's `dataDep` exactly once per new key — a once-per-key-lifetime cost, not once-per-update. Subtemplate reactiveData and snippet args have static template-source-declared key sets and don't need it.

3. **Subtemplate `renderer.data` swap safety** — setupReactiveSubtemplate mutates `currentInstance.renderer.data` and calls `evaluator.setData(ctx.proxy)`. Audit who else holds references to `currentInstance.data` — `overlaySettingsSignals`, `getDataContext`, anything reachable via `template.element` — that could break if the reference changes. If any holder is invalidated by the swap, thread the proxy through construction instead of mutating post-hoc.

4. **Hydration path integration** — Plan 09's `adoptServerItems` creates per-item `itemSignal` + `createItemDataProxy` directly. With this plan, adoption creates `new ReactiveDataContext(data)` + `ctx.replace(eachData)` instead. Straightforward substitution but worth a code read to confirm `hydrateInnerContent` called from within adoption sees the right data context. Not a design question — an implementation sanity check.

## Dependencies

- **[Signal Performance](signal-performance.md)** — lands first. The `safety` preset system this plan uses (`safety: 'none'` for internal per-key Signals) arrives with signal-performance. The migration-audit gating work that plan describes is orthogonal to this one, but the preset API needs to be in place before `ReactiveDataContext` is written against it.
- **Snippet zero-reactivity investigation** (open question 1) — blocks session 3 (snippet-site adoption) but not session 1 (each-site) or session 2 (subtemplate-site).

## Sessions (estimated)

1. **Land the primitive + each-site adoption** (~2-3h pair). Write `reactive-context.js` with the full class; migrate `blocks/each.js` to use it; drop `itemSignal` / `createItemDataProxy`; run renderer tests green; flame-chart verify filter-keystroke cost drops.
2. **Subtemplate-site adoption** (~2h pair). Investigate open question 3 (renderer.data swap safety), implement `setupReactiveSubtemplate`, remove the coarse `bumpDataVersion` for reactiveData-only changes; flip `reactiveData per-key granularity` test to passing.
3. **Snippet-site adoption + zero-reactivity investigation** (~1-2h pair). Resolve open question 1 first, then adopt ReactiveDataContext for snippet args; flip `snippet args per-key granularity` test to passing; add the new tests.
4. **Hydration-path integration sanity** (~30m pair). Audit Plan 09's `adoptServerItems`; substitute ReactiveDataContext; re-run the adoption Node-identity test to confirm preservation.

## Status

Initial scope — design decisions locked (primitive shape, Signal-per-key, per-key Reactions, safety preset, plan ordering). Needs open question 1 resolved before session 3; questions 2-4 can be resolved in-session.

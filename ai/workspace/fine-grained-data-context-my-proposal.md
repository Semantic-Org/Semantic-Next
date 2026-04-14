# Fine-Grained Reactive Data Context — My Proposal

> Written before the fresh-take agent's report returns, so my design is captured
> without knowing the agent's framing. Compare against `fine-grained-data-context-report.md`
> once it lands.

## Q1: Is the coarseness necessary, or an artifact?

**Artifact.** The reactivity primitives already support per-property granularity — `Dependency.depend()` / `Dependency.changed()` is exactly what you'd use to invalidate one specific property subscriber set without touching others. The three sites collapse to coarse because:

- `each.js`: `itemSignal` wraps the *whole* eachData object in one Signal. Any property change fires the whole Signal.
- `template.js` subtemplates: `unpackNodeData` produces a plain object and pushes it via `setDataContext`, which sets `dataReplaced = true`. `Template.render` then calls `renderer.bumpDataVersion()` → one coarse `dataDep.changed()` that invalidates every Reaction reading via the subtemplate renderer.
- `template.js` snippets: `buildSnippetProxy` looks fine-grained, but each getter call routes through `evaluator.lookupExpressionValue` which (via `renderer.lookupExpression` on `receivesData=true` renderers) registers `dataDep.depend()`. Same `dataDep` fires for every parent change.

The minimum change: stop reaching for `bumpDataVersion` / whole-Signal wrappers, and route all three sites through a per-property Dependency scheme that lives at the "push boundary" (parent's value → child scope).

## Q2: Shared abstraction or per-site?

**Shared.** The three sites look different at the surface but have the same structure:

1. A parent reactive scope evaluates some expressions (eagerly or lazily) to produce a value set `{ k1: v1, k2: v2, ... }`.
2. That value set is handed to a child rendering as its data context.
3. When a parent expression re-evaluates to a new value, the child should re-evaluate only the child inner expressions that actually read that key.

The differences — each-items going through `reconcile`, subtemplates having `Template.setDataContext`, snippets inlining without a lifecycle — are about *when* step (1) fires and *how often* step (3) runs. None of them require a different primitive. They require different wiring around the same primitive.

## Q3: Minimum-surface introduction

**New file: `packages/renderer/src/engines/native/reactive-scope.js`.** Exports `createReactiveScope`. Imported by `blocks/each.js` and `blocks/template.js`. Does not touch `define-block.js`, does not modify the reactivity package. Does require a narrow addition to `Template.setDataContext` / `Template.render` to opt out of the `bumpDataVersion` cascade when a reactive proxy is passed — that change lives in `packages/templating/src/template.js`.

Block decomposition is untouched. Each affected block imports the primitive and rewires its internals.

## Q4: Existing pattern reuse?

The closest existing pattern is `createItemDataProxy` in `each.js` — it already has the "proxy + fallthrough to parent" shape. The primitive I'm proposing is essentially its generalization, with `itemSignal.value` replaced by per-property `Dependency` allocation.

`Signal.derive` / `Signal.computed` are not useful here — they produce a single Signal whose value depends on other Signals. We want the inverse: N fine-grained Dependencies that fire independently.

`Reaction.guard` is useful for a related case (skipping re-runs when a key expression's value hasn't changed) but doesn't solve the child-side dep-registration problem.

## Q5: Correctness hazards

### (a) Late-declared properties

Problem: inner expression reads `data.foo` when `foo` isn't in values yet. Falls through to parent data. Parent later adds `foo` via `scope.update({ foo: 'x' })`. Reaction never subscribed to our `foo` Dep because at read time `foo` wasn't in our scope.

Mitigation: on any `get(prop)` or `has(prop)` from inside a Reaction, **always** register a Dep on that key — even if the value isn't currently in `values`. `update` fires Deps for newly-added keys, not just changed keys.

### (b) Conditional reads

Standard reactive behavior. Reaction runs branch A → deps on A's keys. B changes → no invalidation. This is correct — if A's keys didn't change, the expression's output didn't change either, so not re-running is fine.

No special handling needed.

### (c) Nested blocks

`{#each}` inside `{#if}` inside `{>snippet}`: each layer creates its own reactive scope with the previous layer's scope as `parentData`. Property lookups chain through Proxy fallthrough. A write at any layer fires only that layer's Dep for that property; outer layers with the same property name would need to also fire (shadowing convention), which comes naturally from the get-trap's `if (prop in values)` check.

### (d) Spread / computed access

- Spread (`...data`): unpacks to individual keys at compile time (or at AST process time). Each key becomes a scope entry. Works.
- Dynamic key (`this[keyName]`): Proxy.get is called with the resolved key. Reaction tracks that specific key. Works.
- `Object.keys(data)`: Proxy.ownKeys is called. It doesn't trigger per-key gets, so no deps register. If the set of keys changes later, Reactions that called `ownKeys` wouldn't re-fire. Low-priority hazard — add a meta-Dep fired on any key add/remove if this proves to matter.

### (e) In-place mutation (same-ref same-index)

Current `each.js` reconcile handles this with `itemSignal.notify()` — forces all subscribers to re-run because we can't tell what changed. Per-property scheme: expose a `notifyAll()` that fires every known Dep. Equivalent fallback behavior for this edge case only.

Arguably better: at in-place-mutation time, the scheme could diff old vs new values per accessed key and fire only changed ones — but this requires keeping a shadow copy of the last-seen values, which is memory overhead for the common no-mutation case. Not worth it.

## The Primitive

```js
// packages/renderer/src/engines/native/reactive-scope.js
import { Dependency } from '@semantic-ui/reactivity';

/**
 * Creates a reactive data context with fine-grained per-property
 * Dependency tracking. Child reactions that read a specific property
 * subscribe only to that property's Dep; writes fire only the
 * specific property's Dep.
 *
 * @param parentData — optional parent scope object for fallthrough reads
 *   (e.g., snippet reading a non-arg property from the enclosing template)
 * @param seed — initial property values (e.g., initial item data for each,
 *   snapshot of reactiveData for subtemplates/snippets)
 * @returns { proxy, update, notify, notifyAll, dispose }
 */
export function createReactiveScope(parentData, seed = {}) {
  const values = { ...seed };
  const deps = new Map();  // prop → Dependency, allocated lazily
  let disposed = false;

  const trackDep = (prop) => {
    let dep = deps.get(prop);
    if (!dep) {
      dep = new Dependency();
      deps.set(prop, dep);
    }
    dep.depend();
  };

  const proxy = new Proxy(values, {
    get(target, prop) {
      if (typeof prop === 'symbol') { return target[prop]; }
      if (disposed) { return parentData?.[prop]; }
      trackDep(prop);  // always register — covers the late-declared case
      if (prop in values) { return values[prop]; }
      return parentData?.[prop];
    },
    has(target, prop) {
      if (disposed) { return parentData != null && prop in parentData; }
      trackDep(prop);  // `prop in data` inside a Reaction should also re-run if prop appears later
      return (prop in values) || (parentData != null && prop in parentData);
    },
    ownKeys() {
      const parentKeys = parentData ? Reflect.ownKeys(parentData) : [];
      return [...new Set([...Object.keys(values), ...parentKeys])];
    },
    getOwnPropertyDescriptor(target, prop) {
      if (prop in values) {
        return { configurable: true, enumerable: true, value: values[prop], writable: false };
      }
      if (parentData != null) {
        return Object.getOwnPropertyDescriptor(parentData, prop);
      }
      return undefined;
    },
  });

  return {
    proxy,

    /**
     * Replace the set of values. Fires Deps only for keys whose value
     * changed (Object.is) AND for keys that were added/removed.
     */
    update(newValues) {
      if (disposed) { return; }
      for (const key in newValues) {
        if (!Object.is(values[key], newValues[key])) {
          values[key] = newValues[key];
          const dep = deps.get(key);
          if (dep) { dep.changed(); }
        }
      }
      for (const key of Object.keys(values)) {
        if (!(key in newValues)) {
          delete values[key];
          const dep = deps.get(key);
          if (dep) { dep.changed(); }
        }
      }
    },

    /**
     * Fire a specific property's Dep without changing its value.
     * Used when the underlying value object is mutated in place and
     * the mutation is detected by the caller.
     */
    notify(prop) {
      const dep = deps.get(prop);
      if (dep) { dep.changed(); }
    },

    /**
     * Fire every allocated Dep. Fallback for cases where we know the
     * data "changed somehow" but can't identify which properties —
     * e.g., each-item's same-ref in-place-mutation case that currently
     * calls itemSignal.notify().
     */
    notifyAll() {
      for (const dep of deps.values()) { dep.changed(); }
    },

    dispose() {
      disposed = true;
      deps.clear();
    },
  };
}
```

## Adoption — each items

```js
// blocks/each.js
import { createReactiveScope } from '../reactive-scope.js';

// Replace createItemDataProxy:
function createItemDataContext(parentData, initialEachData) {
  const scope = createReactiveScope(parentData, initialEachData);
  itemContextProxies.add(scope.proxy);
  return scope;  // ItemRecord stores .scope, not .itemSignal
}

// In reconcile (existing logic, per-record update branch):
if (existing.item !== item || existing.index !== i) {
  existing.scope.update(getEachData(item, i, collectionType, node));
}
else if (typeof item === 'object') {
  existing.scope.notifyAll();  // same-ref in-place mutation
}

// In createRecord:
const scope = createItemDataContext(data, getEachData(item, index, collectionType, node));
// ... record.scope = scope  (in place of record.itemSignal)
// ... data passed to renderAST for the item becomes scope.proxy
```

## Adoption — subtemplate reactiveData

```js
// blocks/template.js
import { createReactiveScope } from '../reactive-scope.js';

// Subtemplate branch changes:
//
//   render/hydrate: build the reactive scope ONCE, hand its proxy to
//   the subtemplate instance as its data context. Also wire ONE
//   Reaction per reactiveData key in the parent's reactionScope —
//   each pushes the new value into scope.update({ [key]: value })
//   when its own expression re-evaluates.
//
//   update: do NOT rebuild templateData and do NOT call setDataContext.
//   The per-key Reactions already keep the scope in sync. Only
//   template-name changes or structural node swaps still need the
//   existing instance-recreation path.

function setupReactiveSubtemplate({ node, data, scope: reactionScope, self, region }) {
  const initial = evaluateStaticData(node, data, self.evaluator);  // the `data=` blob bits
  const scope = createReactiveScope(data, initial);
  self.templateScope = scope;

  // Wire one Reaction per reactiveData key.
  if (node.reactiveData) {
    each(node.reactiveData, (expr, key) => {
      reactionScope.reaction(region.anchor, (comp) => {
        const value = self.evaluator.lookupExpressionValue(expr, data);
        if (comp.firstRun) { return; }  // initial value already in scope
        scope.update({ [key]: value });
      }, { message: `subtemplate-arg:${key}` });
    });
  }

  // Clone the template with the proxy as its data context.
  self.currentInstance = cloneInstance({
    template,
    templateName,
    templateData: scope.proxy,  // ← proxy, not flat object
    self,
  });
  // ...
}
```

One narrow templating change: `Template.setDataContext` must treat a proxy-marked object specially (don't mark `dataReplaced`, don't trigger `bumpDataVersion`). Tag the proxy with a sentinel symbol:

```js
// reactive-scope.js
export const REACTIVE_SCOPE = Symbol.for('sui.reactiveScope');

// Inside createReactiveScope:
Object.defineProperty(proxy, REACTIVE_SCOPE, { value: true, enumerable: false });

// packages/templating/src/template.js setDataContext:
setDataContext(newData, { rerender = true } = {}) {
  if (newData && newData[REACTIVE_SCOPE]) {
    // Reactive proxy — per-property Deps handle invalidation, no
    // coarse bumpDataVersion needed.
    this.data = newData;
    return;
  }
  // ... existing path
}
```

## Adoption — snippet args

```js
// blocks/template.js  (snippet branch)

function setupSnippetContext({ node, data, scope: reactionScope, self, region }) {
  const initial = {};
  if (node.data && isPlainObject(node.data)) {
    each(node.data, (expr, key) => {
      initial[key] = Reaction.nonreactive(() => self.evaluator.lookupExpressionValue(expr, data));
    });
  }
  if (node.reactiveData) {
    each(node.reactiveData, (expr, key) => {
      initial[key] = self.evaluator.lookupExpressionValue(expr, data);
    });
  }

  const scope = createReactiveScope(data, initial);

  // Per-key Reactions for reactiveData only — static data doesn't update.
  if (node.reactiveData) {
    each(node.reactiveData, (expr, key) => {
      reactionScope.reaction(region.anchor, (comp) => {
        const value = self.evaluator.lookupExpressionValue(expr, data);
        if (comp.firstRun) { return; }
        scope.update({ [key]: value });
      }, { message: `snippet-arg:${key}` });
    });
  }

  return scope.proxy;  // handed to renderAST as the snippet's data context
}
```

## Tests That Flip From Skipped To Passing

- `reactiveData per-key granularity` in `subtree-spurious.test.js`
- `snippet args per-key granularity` in same file

New test to add:

```js
it('changing one each-item property should not re-evaluate per-item expressions reading a different property', async () => {
  // Component with items: [{ id, name, status }]; template renders
  // `{item.name}` and `{item.status}` separately with spy counters;
  // assert that mutating only .name doesn't re-evaluate the .status
  // expression.
});
```

## Risks and Open Questions

1. **`Template.setDataContext` sentinel path**: the narrow change to opt out of `bumpDataVersion` for reactive proxies. Risk: any existing code that depends on `bumpDataVersion` firing on every subtemplate data update would break. Mitigation: audit all callers; the current callers I've traced are `template.js` subtemplate update branch and the hydrate path — both migrate to the proxy.

2. **`each.js` `isItemContext` / `itemContextProxies` semantics**: currently used to decide whether to reactively evaluate subtemplate data inside each. If we change the item data context to a reactive scope with per-prop Deps, do we still need the WeakSet? Yes, probably — the decision "this is inside an each, so read reactively" is separate from per-prop tracking. Keep the WeakSet, same semantics.

3. **Initial-snapshot evaluation must happen inside a parent reaction**: the first read of each reactiveData expression (for the initial value) needs to establish *source* dependencies on parent signals. Otherwise the per-key Reactions I wire wouldn't know when to re-fire. Confirm: the wiring code runs inside `render`/`update` hooks which are already inside a `scope.reaction`, so the initial `self.evaluator.lookupExpressionValue(expr, data)` call tracks source signals on that reaction. When the source signal changes, the outer block reaction fires and... wait, that would rebuild the whole subtemplate.

   Fix: wire per-key Reactions for each reactiveData key explicitly (via `reactionScope.reaction`), and wrap the initial snapshot in `Reaction.nonreactive` to prevent the outer block reaction from subscribing to source signals. The per-key reactions are the only things that should track the source.

4. **Memory**: one Dependency per accessed property per scope instance. For a 1000-item each with 5 reactive bindings per item = 5000 Deps. Each Dep is a Set. This is similar to the current scheme (one Signal per item × all its subscribers). Not materially worse.

## Summary of the Primitive's Shape

```
createReactiveScope(parentData, seed) → {
  proxy,              // Proxy<Object> — hand to child rendering as data context
  update(newValues),  // Parent pushes new values; fires Deps for changed keys only
  notify(prop),       // Parent fires one specific Dep (for in-place mutation)
  notifyAll(),        // Fallback: fire every allocated Dep
  dispose(),          // Release Deps and stop tracking
}
```

Three sites. One primitive. Per-property invalidation by construction. Narrow templating-layer change to honor the proxy instead of bumping dataVersion.

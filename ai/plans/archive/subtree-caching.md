# Subtree Caching Evaluation — Analysis

## Question 1: Is Caching Subtrees Necessary?

### What the cache actually prevents

When `renderContent` hits a cached subtree, it calls `cachedRender(data)` which does two things: (1) mutates the LitRenderer's `this.data` via `updateData`, (2) bumps `dataVersion`, and (3) returns `this.litTemplate` — the *same object* returned by the previous `html` tagged template call.

When it misses, it creates a new `LitRenderer` and calls `render()`, which runs `readAST()` to walk the entire subtree AST and produce a *new* `html` tagged template result with new directive invocations.

### The real costs of directive recreation

On a cache miss:

1. **AST traversal** — `readAST` walks every node, calling `evaluateExpression`, `evaluateConditional`, etc. This is pure JS overhead: string parsing, `getExpressionArray`, `evaluateJavascript` with `new Function()` + `with` + Proxy. The `new Function` calls in particular are expensive — they're JIT-hostile and allocate closures. But this only happens during AST reading, not reactivity.

2. **New directive instances** — Every `reactiveData()`, `reactiveConditional()`, `reactiveEach()` call produces a new Lit directive. Lit's `directive()` factory creates a `DirectiveResult` which, when committed to the DOM, instantiates the `AsyncDirective` subclass. Each directive's `render()` method then calls `Reaction.create()`.

3. **New Reaction objects** — Each `Reaction.create()` allocates a Reaction, runs the callback once (the first run), which walks dependencies via `Dependency.depend()`, adding the reaction to each dependency's subscriber set. For a template with N expressions, that's N reactions, each subscribing to their signals.

4. **Old reactions don't automatically clean up during re-render** — This is the critical point. When a parent structural directive (rerender, conditional) calls `this.setValue(content)` with a new `TemplateResult`, Lit will disconnect the old directive instances, which calls `disconnected()` on each, which calls `reaction.stop()`. So old reactions *do* get cleaned up — but only after the new ones are created. There's a transient period where both old and new reactions exist.

### What Lit actually does with a new TemplateResult

Here's where things get subtle. Lit's `html` tagged template literal uses the *strings array identity* (the frozen template strings object) as a cache key. Two calls to `` html`<div>${x}</div>` `` with the same template literal return `TemplateResult` objects that share the same strings reference, so Lit recognizes them as the same template and only diffs the expression values.

But `LitRenderer.render()` constructs `this.html` and `this.html.raw` dynamically by concatenating strings during AST traversal. Each call to `render()` on a *new* LitRenderer creates a *new* `this.html` array. Even if the content is identical, the array *identity* differs. Lit will see this as an entirely different template and **destroy the old DOM, create new DOM from scratch**. This is catastrophic.

Returning `this.litTemplate` from the *same* LitRenderer instance (the cached path) returns the *same* TemplateResult, so Lit recognizes it and only patches expressions. This is cheap.

### The verdict

**The cache is absolutely necessary, but for a reason the architecture doesn't make obvious.** The primary win isn't avoiding Reaction allocation — it's avoiding DOM destruction. Without the cache, every parent re-render creates a new `html` array with a different identity, causing Lit to tear down and rebuild the entire subtree DOM. With the cache, the same `litTemplate` object is returned, and Lit patches in place.

However, the current implementation has a fundamental tension: the cache returns a stale `litTemplate` and relies on `dataVersion` (a Signal) to notify downstream directives that data changed. This works for Signal-backed expressions but fails for plain data — which is exactly Problem 2 from the evaluation.

### The contrarian take

The cache is solving a problem the architecture created. The dynamic construction of `html` template arrays is the root cause. If instead the AST were compiled ahead of time to produce a *static* tagged template literal (like Svelte or Solid's compilation step), the strings array identity would be stable, Lit would naturally diff expressions, and no subtree cache would be needed. The cache is a runtime band-aid for the lack of a compile-time optimization.

That said, a compile step is a major architectural change. Given the current runtime-interpreted AST approach, the cache is the correct local fix. But it should be understood as debt, not design.

---

## Question 2: Is the Cache Keying Strategy Sound?

### How keys are generated

```js
static getID({ ast, key, isSVG } = {}) {
    return (key !== undefined)
      ? hashCode({ ast, key })
      : hashCode({ ast });
}
```

`hashCode` serializes the input via `JSON.stringify` and runs FNV-1a over the string. The AST is an array of objects (the parsed template nodes).

### Collision analysis

**Problem 1: AST identity is structural, not positional.** Two `{#if}` branches with identical content ASTs produce the same hash. Consider:

```
{#if conditionA}
  <span>{name}</span>
{/if}
{#if conditionB}
  <span>{name}</span>
{/if}
```

Both `{#if}` blocks have content ASTs that serialize to the same JSON. They'll get the same `contentID`. The first one that renders will populate the cache; the second will get a cache hit and **reuse the first's LitRenderer**, which means they'll share `dataVersion`, share Reaction lifecycle, and data updates to one will affect the other. This is a bug.

**Problem 2: Snippets.** The evaluation prompt mentions snippets as a concern. Snippets are defined once (`{#snippet name}...{/snippet}`) and invoked potentially multiple times (`{>name data1=x}` and `{>name data2=y}`). In `evaluateSnippet`, the content AST is `snippet.content` — the same object every time. Different invocations with different data will hash to the same `contentID` and collide.

**Problem 3: Each loop keys.** For `{#each}`, the key is derived from the item via `getItemID`. The hash is `hashCode({ ast, key })`. If two items have the same key (same `id`, `_id`, etc.) or if items are primitive strings that happen to repeat, they'll collide. The code does have a fallback to `indexOrKey` but this can change as items are filtered/reordered, causing cache thrashing.

**Problem 4: Hash collisions in FNV-1a.** FNV-1a produces a 32-bit hash. With birthday paradox, collision probability reaches 50% at ~77k entries. For large component trees this is unlikely but not impossible. More concerning is that `JSON.stringify` is not order-stable for objects — property enumeration order can vary, making *false misses* possible where identical ASTs hash differently.

**Problem 5: No parent scoping.** The `renderTrees` dictionary is per-LitRenderer instance, so keys are scoped to a parent subtree. This provides some natural namespacing. But within a single LitRenderer, any two calls to `renderContent` with the same AST structure will collide.

### The fix

The keying should include a positional index or invocation-site identifier. Since `renderContent` is called from specific positions in `readAST`, the call order is deterministic within a render pass. A monotonically increasing counter per render, appended to the hash, would disambiguate structurally identical subtrees:

```js
renderContent({ ast, data, key, isSVG = this.isSVG } = {}) {
    const callIndex = this._renderCallIndex = (this._renderCallIndex || 0) + 1;
    const contentID = LitRenderer.getID({ ast, key, isSVG, callIndex });
    // ...
}
```

Reset `_renderCallIndex` at the start of `render()`. This preserves structural caching across re-renders (same call order = same index) while preventing same-AST collisions.

---

## Question 3: How Should Data Updates Propagate to Cached Subtrees?

### The current mechanism

When data changes, `cachedRender(data)` calls `updateData(data)` which mutates `this.data` in place, then `bumpDataVersion()` which increments a Signal (`this.dataVersion`). Directives read `this.dataVersion.get()` at the top of their value closures:

```js
// In evaluateExpression, asDirective path:
literalValue: () => {
    this.dataVersion.get(); // track dataVersion as dependency
    return this.lookupTokenValue(expression, this.data);
},
```

So when `dataVersion` changes, any Reaction that called `dataVersion.get()` will re-run. This includes `reactive-data` directives.

### What works

**Signal-backed expressions** — If `{count}` resolves to a Signal, the directive's Reaction tracks both `dataVersion` AND the Signal's own Dependency. Either trigger will re-run the reaction. This is redundant but correct.

**`dataVersion` as a catch-all** — For expressions that resolve to plain data (non-Signal values in the data context), the Reaction only depends on `dataVersion`. When the parent bumps it, the directive re-evaluates the expression against the (already mutated) `this.data`, picks up the new value, and calls `this.setValue()`. This should work — in theory.

### What doesn't work

**Problem: Structural directives don't read `dataVersion`.** Look at `reactive-each`:

```js
render(eachCondition, settings = {}) {
    this.eachCondition = eachCondition;
    if (this.reaction) {
        return noChange; // <-- short circuits, never reads dataVersion
    }
    // ...
    this.reaction = Reaction.create((computation) => {
        this.items = this.getItems(this.eachCondition);
        // getItems() calls this.eachCondition.over()
        // over() calls this.evaluateExpression(value, data)
        // which for the directive-less path doesn't read dataVersion
    });
}
```

The `over()` function was created at AST-read time with a closure over `data` — but `data` was a local variable that gets reassigned in `evaluateEach`. After the first render, `this.eachCondition.over` is a closure that calls `this.evaluateExpression(value, data)` where `data` is the renderer's `this.data` reference (it's reassigned: `data = { ...this.data, ...eachData }`). However, the expression evaluation for the `over` expression goes through `lookupTokenValue` which does `this.getDeepDataValue(data, token)`. If the collection is a Signal, the `.get()` call tracks it and the each correctly re-fires. If it's plain data, nothing tracks it.

And here's the critical issue: `dataVersion` is never read in the over/content evaluation path for structural directives. The `dataVersion.get()` call only exists in `evaluateExpression` with `asDirective: true`, which is the `reactive-data` leaf path. Structural directives go through different code paths (`evaluateConditional`, `evaluateEach`, `evaluateRerender`, `evaluateAsync`) that call `evaluateExpression` or `lookupTokenValue` *without* `asDirective: true`, so `dataVersion` is never tracked.

This means: **when a cached subtree gets `bumpDataVersion()`, only `reactive-data` directives re-fire. Structural directives (each, conditional) backed by plain data are completely blind to the change.** This is the root cause of Problem 2 from the evaluation.

**Problem: `reactive-rerender` always re-renders its content, creating new subtrees.** When the rerender directive fires:

```js
if (!computation.firstRun) {
    this.setValue(this.condition.content());
}
```

`this.condition.content()` calls `this.renderContent({ ast: value, data })`. Because the subtree cache exists, this returns `cachedRender(data)` — which returns the stale `litTemplate`. But the rerender directive then calls `this.setValue(litTemplate)`, which tells Lit "here's new content for this part." If the litTemplate identity hasn't changed (it hasn't — it's the same object), Lit says "no change" and doesn't update the DOM. This is correct for the cached case.

But if the content contains an `{#async}` whose promise resolved between re-renders, the async directive already called `this.setValue()` on its own part. The rerender re-triggering doesn't destroy the async — it reuses the cached subtree. So async state *should* be preserved through rerender cycles... unless the `data` object changed enough to cause Lit to see a different template structure.

Wait — let me re-examine Problem 1. The `{#async formatCode as result}` inside `{#rerender darkMode}`: when `darkMode` changes, the rerender reaction fires, calls `this.condition.content()`, which calls `renderContent()`, hits the cache, returns the same litTemplate. The rerender directive calls `this.setValue(litTemplate)`. Lit receives the same TemplateResult object reference. For Lit, same reference = `noChange`? Actually no — `setValue` on an AsyncDirective's Part will commit the value. If it's the same TemplateResult *reference*, Lit's `_commitTemplateResult` checks if the existing `ChildPart._$committedValue` has the same `_$template`. If yes, it updates expressions in place. If no, it rebuilds.

The cached litTemplate from `cachedRender` is the same *object reference*, so Lit should see it as identical and patch in place. The async directive should survive.

But wait — `bumpDataVersion()` was called. The async directive's reaction depends on `dataVersion` through its `expression()` call in the reaction: `this.asyncCondition.expression()` calls `this.evaluateExpression(value, data)` which, for the non-directive path, calls `this.lookupTokenValue` and then `this.evaluateJavascript`. If the `with` Proxy reads `dataVersion`... no, `dataVersion` is on the LitRenderer, not in the data context.

Actually, looking at the async directive's `watchChanges`:

```js
this.reaction = Reaction.create((computation) => {
    const expressionResult = this.asyncCondition.expression();
    this.handleExpressionResult(expressionResult, this.asyncCondition);
    // ...
});
```

`this.asyncCondition.expression()` was defined in `evaluateAsync` as:
```js
if (key == 'expression') {
    return () => this.evaluateExpression(value, data);
}
```

This calls `evaluateExpression` **without** `asDirective: true`. So it goes through the non-directive path which calls `this.lookupExpressionValue(expression, this.data)` — note it reads `this.data`, NOT the `data` closure (because line 399 uses `this.data`). Wait, let me re-read:

```js
evaluateExpression(expression, data = this.data, ...) {
    if (typeof expression === 'string') {
        if (asDirective) { ... }
        else {
            this.dataVersion.get(); // <-- this IS here for the non-directive path too
            return this.lookupExpressionValue(expression, this.data);
        }
    }
}
```

Line 398: `this.dataVersion.get()` — YES, it's also in the non-directive path. So the async directive's reaction DOES track `dataVersion`. When `dataVersion` bumps, the async reaction re-fires, re-evaluates the expression, and calls `handleExpressionResult` which resets state to 'loading' and re-resolves the promise.

**This is the actual cause of Problem 1.** When `darkMode` changes, `bumpDataVersion()` fires, the async's reaction re-runs, which calls `handleExpressionResult` that sets `this.state = 'loading'` and `this.resolvedValue = null` (line 64-66). The promise re-resolves eventually, but there's a flash of loading/empty state in between. The async directive doesn't differentiate between "my specific expression's inputs changed" and "some unrelated data somewhere changed."

### The correct mechanism

The fundamental issue is that `dataVersion` is a blunt instrument — it's a single counter that means "something changed" without specifying *what* changed. Every directive that tracks it re-fires on every data change, regardless of relevance.

A correct solution needs to solve three distinct problems:

**For plain-data leaf expressions (`reactive-data`):** `dataVersion` works here because these are cheap to re-evaluate. The directive reads the expression, gets the (possibly new) value, and only calls `setValue` if it changed. The overhead is the expression evaluation, not DOM work.

**For structural directives with plain-data conditions:** The `dataVersion` approach should work here too, but it currently doesn't because the directives short-circuit with `return noChange` when they already have a reaction. The fix is to make the structural directives also read `dataVersion.get()` inside their reactions:

```js
// reactive-each, inside the reaction callback:
this.reaction = Reaction.create((computation) => {
    // Track data version for plain-data updates
    // (the renderer's dataVersion signal)
    this.eachCondition.dataVersion?.get();

    this.items = this.getItems(this.eachCondition);
    // ...
});
```

This requires passing `dataVersion` through the directive arguments.

**For async directives that shouldn't re-fire on irrelevant changes:** This is the hard one. The async directive needs to distinguish between "my expression's dependencies changed" and "unrelated data changed." Two options:

1. **Guard the async expression** — Use `Reaction.guard` around the expression evaluation, so the outer reaction only re-fires if the *result* of the expression changed:

```js
Reaction.guard(() => this.asyncCondition.expression());
```

If `formatCode` returns the same promise reference when `darkMode` changes, the guard prevents re-fire. But promises are usually new objects each call, so this may not help.

2. **Don't track dataVersion in async expressions** — The async directive's expression should be evaluated in a `Reaction.nonreactive` context for `dataVersion`, only tracking the actual Signal dependencies of its expression. This means async blocks backed by plain data won't update on data changes, but that's arguably correct — if you want reactivity, use Signals.

3. **Fine-grained data versioning** — Instead of one global `dataVersion` counter, create per-key versioning. When `updateData` changes key `darkMode`, only bump a version for `darkMode`. Directives that read `darkMode` would track that specific version. This is essentially reimplementing Signals for the data context — which raises the question of why not just make all data context values Signals.

### My recommendation

The cleanest path is option 3 taken to its logical conclusion: **make the settings proxy produce Signals for all settings, not just shadow signals for tracking.** Currently, the settings proxy in `createSettingsProxy` creates shadow Signals that are read via `.get()` for tracking but return the raw property value. If instead the data context itself contained Signals for settings (not just state), the existing reactivity system would handle everything — no `dataVersion` needed. Structural directives would naturally re-fire when their conditions' Signals change, and async directives would only re-fire when their specific dependencies change.

The `dataVersion` signal should be removed entirely. It's a manual reactivity bypass that works around the fact that settings values aren't fully reactive. Making them fully reactive eliminates the entire class of "plain data doesn't update" bugs while also eliminating the "unrelated data causes unnecessary re-fires" problem.

For the transition, the minimum viable fix is:
1. Pass `dataVersion` to structural directives so they track it in their reactions
2. Wrap the async directive's expression evaluation in `Reaction.guard` to prevent re-fire when the expression result hasn't changed
3. Fix the keying strategy to include positional information

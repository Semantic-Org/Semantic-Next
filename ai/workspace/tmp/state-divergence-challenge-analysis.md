# State Divergence During Hydration: Analysis

## Executive Summary

The core problem is a timing gap: `initialize()` mutates state before hydration Reactions exist, so those Reactions never learn that state diverged from the server-rendered DOM. The `firstRun` skip then cements the stale server DOM as "correct." This is a correctness bug masquerading as a performance optimization. The fix is straightforward once the each-loop data context issue is understood separately.

---

## Question 1: The tension between "trust server" and "state can diverge"

### The problem, precisely stated

The `firstRun` skip is based on an invariant: **the server-rendered DOM is a faithful projection of the client's initial state.** This invariant holds for the common case (same `defaultState`, same template, same expression evaluation). But it breaks in at least three legitimate scenarios:

1. **Environment guards** (`isClient`/`isServer`) — the most obvious case. Server runs one code path, client runs another.
2. **Runtime-dependent initialization** — component reads `window.location`, `localStorage`, device capabilities, etc. during `initialize()`.
3. **Async timing** — a parent component's `initialize()` passes derived data that differs from the server's computation.

The current code treats all three as edge cases to suppress. They are not. They are fundamental to the server/client boundary. Every SSR framework has to handle them.

### How other frameworks handle this

**Lit (with `@lit-labs/ssr`):** Lit does not skip DOM writes during hydration. When `LitElement.update()` runs on the client, it diffs the entire template result against the server DOM using Lit's part system. If a value changed, the DOM updates. There is no "firstRun skip" concept — Lit's hydration explicitly checks each part's committed value against the new value. This is correct by default, at the cost of doing string comparisons during hydration.

**Svelte:** Svelte's hydration (`claim_*` functions) walks the server DOM and assigns ownership of existing nodes to client-side blocks. But when a reactive statement runs, it writes to the DOM unconditionally. There is no "skip first write" optimization. Svelte relies on the browser short-circuiting no-op `textContent` assignments (which it does — setting `textNode.data` to the same string is a no-op at the layout/paint level).

**Solid:** Solid's hydration is the closest analogue. Solid also uses signals and fine-grained reactivity. During hydration, Solid calls `createEffect` which runs immediately and evaluates expressions to register dependencies. But Solid explicitly checks whether the hydrated value matches by comparing against `node.data`. If it differs, it writes. If it matches, it skips (an actual value comparison, not a blanket `firstRun` skip).

### The fundamental error

The `firstRun` skip conflates two distinct concerns:

1. **Dependency registration** — the Reaction must evaluate all expressions to learn which Signals it depends on.
2. **DOM reconciliation** — the Reaction must decide whether the DOM needs updating.

The current code handles (1) correctly but completely abandons (2). It doesn't check whether the value changed — it assumes it didn't. This is the bug.

### What the fix should be

Replace the blanket `firstRun` skip with a **value comparison**:

```js
// hydrateTextExpression
scope.track(Reaction.create((comp) => {
    if (!comp.firstRun && !textNode.isConnected) {
        comp.stop();
        return;
    }
    const value = this.eval(exprNode.value, data);
    const stringValue = String(value ?? '');
    if (comp.firstRun && stringValue === textNode.data) { return; }
    textNode.data = stringValue;
}));
```

Cost: one string comparison per hydrated text expression on first run. This is negligible — `String(value)` is already computed, and `===` on strings is O(1) amortized (V8 internalizes short strings). For the common case (server and client agree), behavior is identical. For the divergent case, correctness is restored.

But this alone doesn't fix the problem, because the text node's content IS the server value — the `firstRun` evaluation reads the current signal value ('client'), but the text node contains 'server'. The comparison `'client' === 'server'` is false, so it would correctly write. **This is the right fix for text expressions.**

For attributes, the same pattern applies — compare the computed attribute value against `element.getAttribute(attrName)`.

---

## Question 2: Why removing firstRun skip breaks each loops

### The each-loop hydration architecture

Looking at `hydrateEach()` (lines 1445-1482):

```js
hydrateEach({ node, data, scope, region }) {
    scope.track(Reaction.create((comp) => {
        const rawItems = this.eval(node.over, data) || [];
        // ...
        if (comp.firstRun) {
            return; // server content is correct
        }
        // ... full re-render of entire list
    }));
}
```

The each-loop hydration does NOT hydrate individual items. It evaluates the list expression to register the dependency, then skips. On subsequent runs, it does a full re-render of the entire list. This is an intentional simplification — the server content is assumed correct, and the full diffing/keyed-update logic of `createEach()` is not replicated for hydration.

But the inner content of each items IS hydrated. Look at `hydrateBlockDirective()` (lines 1248-1301):

```js
const contentAST = this.getServerRenderedAST(node, data);
if (contentAST && ownedNodes.length > 0) {
    const innerScope = scope.child();
    region.childScopes.push(innerScope);
    this.hydrateInnerContent(ownedNodes, contentAST, data, innerScope);
}
```

And `getServerRenderedAST()` for `each` returns `null` (line 1394: `default: return null; // each handled separately (per-item data)`).

**So for each blocks, `contentAST` is null, meaning `hydrateInnerContent` is never called.** The inner markers of each items are NOT hydrated at all. They're left as inert server-rendered text.

Wait — let me re-examine. The code at line 1292-1301 checks `if (contentAST && ownedNodes.length > 0)`. For each blocks, `contentAST` is null, so the inner hydration is skipped entirely. The ownedNodes are placed back but no Reactions are wired for the inner expressions.

This means: **each-loop items have no reactive bindings after hydration.** They rely entirely on the `hydrateEach` Reaction to re-render the full list when the collection signal changes. The inner text/attribute expressions in each items are dead — they won't update if only a property of an item changes (unless the list signal itself fires).

### Why removing the firstRun skip broke things

The evaluation prompt says "a naive fix (removing firstRun skip) was tested and broke each-loop hydration." Here's why:

When the `firstRun` skip is removed from `hydrateTextExpression`, the text expressions inside each-loop items would try to write to the DOM on their first evaluation. But those text expressions are hydrated via `hydrateInnerContent` which passes the **parent data context** — not per-item data. So an expression like `{name}` inside `{#each items as item}` would evaluate against the parent data context, where `name` either doesn't exist (producing `undefined`/`''`) or refers to a completely different value.

Actually wait — I just established that for each blocks, `getServerRenderedAST` returns null, so `hydrateInnerContent` is never called. So inner text expressions in each items would NOT be hydrated at all, and removing the `firstRun` skip would have no effect on them.

Let me reconsider. The `hydrateBlockDirective` method collects `ownedNodes` between the opening and closing block markers. For each blocks:
- `contentAST` is null → inner hydration is skipped
- The `ownedNodes` are still placed back via lines 1297-1300
- `hydrateEach()` is called with the region

So the each items' DOM is preserved but not wired. The issue with removing `firstRun` skip would be in the **outer** text expressions or attribute bindings that happen to be evaluated during hydration of the surrounding content. If there's a text expression **before** the each block that references something set in `initialize()`, removing `firstRun` would fix that expression. The each block itself would still work because its internal behavior is unchanged.

**But here's the real scenario that breaks:** If the `firstRun` skip is removed globally (including in `hydrateTextExpression` as called from `hydrateInnerContent` for other block types like conditionals), then for `if` blocks that contain each loops, the inner hydration would try to process the each items' text expressions with the wrong data context.

Actually, the most likely explanation is simpler: the naive fix removed the `firstRun` skip from `bindTextExpression` (the non-hydration path) as well as the hydration path, or it removed it from `hydrateTextExpression` which is called for text expressions at all levels. When `hydrateInnerContent` is called for conditional blocks, it recursively calls `hydrateMarkers`, which finds text expression comments inside the conditional's content. If those text expressions are inside a nested each, they're still found by the comment walker (because the walker processes ALL comments in the container). The blockDepth tracking at lines 999-1024 should skip inner comments inside nested blocks...

Let me re-read the blockDepth logic:

```js
let blockDepth = 0;
while ((comment = commentWalker.nextNode())) {
    const text = comment.data;
    if (text.startsWith('/sui-block:')) {
        blockDepth--;
        continue;
    }
    if (blockDepth > 0) {
        continue;
    }
    if (text.startsWith(BLOCK_MARKER)) {
        // ...
        blockDepth++;
    }
}
```

This tracks block nesting and skips inner markers. So inner each-item text expressions should be skipped. The blockDepth handling looks correct for preventing double-processing of nested content.

### Revised hypothesis

The most likely reason the naive fix broke each loops is that the fix was applied to `hydrateEach` itself — removing its `firstRun` skip caused it to immediately re-render the entire list on first run, discarding the server DOM. Since `hydrateEach` does a complete teardown-and-rebuild on non-firstRun, removing the skip would cause it to discard server DOM and re-render with `readAST`, losing any not-yet-hydrated content and potentially causing layout shift.

Alternatively, the issue could be in the each-loop's inner expression hydration through `hydrateInnerContent` when called from a parent block. If a conditional wraps an each, the conditional's inner hydration would process the each as a block directive via `hydrateBlockDirective`. The each's `hydrateEach` has its own `firstRun` skip. But if the naive fix removed ALL firstRun skips, the each would try to re-render on first run, which wouldn't have proper per-item data contexts set up.

### The real answer

The `firstRun` skip in `hydrateEach` is fundamentally different from the `firstRun` skip in `hydrateTextExpression`. In `hydrateEach`, the skip prevents a full list re-render (expensive, destructive). In `hydrateTextExpression`, the skip prevents a `textNode.data = value` assignment (cheap, idempotent). **These should not be conflated.** The fix for text expressions (compare and write if different) should NOT be applied to `hydrateEach` — the each block needs a completely different hydration strategy.

---

## Question 3: Detect divergence via value comparison

### The approach

For text expressions:
```js
const stringValue = String(value ?? '');
if (comp.firstRun && stringValue === textNode.data) { return; }
textNode.data = stringValue;
```

For single-expression attributes:
```js
const stringValue = /* computed string */;
if (comp.firstRun && stringValue === element.getAttribute(attrName)) { return; }
element.setAttribute(attrName, stringValue);
```

For multi-expression attributes:
```js
// Compute the full concatenated value, then compare
if (comp.firstRun && value === element.getAttribute(attrName)) { return; }
element.setAttribute(attrName, value);
```

### Costs

1. **String comparison** — O(n) where n is value length, but browser engines optimize short-string comparison aggressively. Most template values are short (class names, text content, attribute values). Cost: negligible.

2. **String coercion** — `String(value ?? '')` for text, already needed for `textNode.data` assignment. No additional cost.

3. **getAttribute() call** — one DOM property access per hydrated attribute per first run. These are fast — `getAttribute` on an element already in memory is essentially a hash lookup.

4. **Total overhead** — For a component with 50 hydrated expressions, this adds ~50 string comparisons on first hydration. Measured in microseconds. The `requestAnimationFrame` deferral in `connectedCallback` already costs more.

### The performance argument is weak

The evaluation prompt mentions "textNode.data = sameValue and setAttribute(name, sameValue) are browser no-ops." This is correct. Browsers check whether the value actually changed before triggering layout/paint. So even **without** the comparison, just removing the `firstRun` skip and always writing would have negligible performance cost for the common case.

The only scenario where the comparison adds value over "always write" is when the expression evaluation itself is expensive (e.g., calling a helper function with side effects). But the expression is ALREADY evaluated for dependency registration — the value is already computed. The only difference is whether we assign it to the DOM.

**My recommendation:** Don't bother with the comparison. Just remove the `firstRun` skip for text expressions and attribute bindings. Always write. The browser handles idempotent writes efficiently. The comparison adds code complexity for zero meaningful performance benefit.

The one exception: `unsafeHTML` hydration, where the "write" involves parsing HTML and replacing nodes. There, the `firstRun` skip (or a comparison) is genuinely valuable because the write is expensive. Keep it for unsafeHTML.

### The each-loop exception

For each loops, as discussed above, the `firstRun` skip serves a different purpose — it prevents destructive re-rendering. This should stay, but should be augmented with proper per-item hydration wiring (see Question 4 for whether that's worth doing now).

---

## Question 4: Should initialize() effects be "server-equivalent" or "client mutations"?

### The architectural question

This is the deepest question. It asks: what is the contract between server and client in this framework?

Two mental models:

**Model A: Server-equivalent.** `initialize()` runs identically on server and client. Any `isClient` guards are the developer's fault — they should use `onCreated` or `onRendered` for client-only logic. The hydration system can assume server DOM matches post-`initialize()` state.

**Model B: Client mutation.** `initialize()` is the first client lifecycle hook. It can legitimately diverge from server state. The hydration system must reconcile.

### What the code tells us

The framework passes `isClient` and `isServer` as first-class parameters to `createComponent`:

```js
// template.js, _buildCallParams (line 849)
isServer: Template.isServer,
isClient: !Template.isServer,
```

The conditional hydration already handles `{#if isClient}` blocks with branch mismatch detection (renderer.js lines 1306-1334, with a special case for `isClient`/`isServer` that suppresses the dev warning). This means the framework explicitly supports environment-conditional rendering.

The evaluation prompt's test case uses `if (isClient) { state.label.set('client'); }` in `initialize()`. This is a natural pattern — "initialize default server state, override on client." Telling developers not to do this would be fighting the API design.

### My position: Client mutation (Model B)

`initialize()` MUST be treated as a potential source of client/server divergence. Arguments:

1. **The API design invites it.** `isClient` is a first-class parameter. Mutation methods are available during `initialize()`. The framework offers no alternative hook that fires after hydration wiring.

2. **Other frameworks agree.** React's `useState` initial value can differ from server. Solid's `createSignal` initial value can differ. Both frameworks handle this through their reconciliation/hydration systems, not by telling developers to avoid it.

3. **The workaround is worse.** If developers can't mutate state in `initialize()`, they'd use `onCreated` or `onRendered`, which fire AFTER hydration. This creates a visible flash (server text → client text) that's worse UX than correct hydration.

4. **The fix is cheap.** As shown in Question 3, removing the `firstRun` skip for text and attribute bindings has negligible cost.

### What "Model B" means for the implementation

The hydration system should:

1. **Remove the `firstRun` skip for text expressions and simple attribute bindings.** Always write the evaluated value. Browser idempotency handles the common case.

2. **Keep the `firstRun` skip for each loops.** Each-loop hydration is a different problem (structural, not value-based). The current approach of deferring to full re-render on change is correct for now.

3. **Keep the `firstRun` skip for unsafeHTML.** The write is expensive (HTML parsing + node replacement).

4. **Keep the conditional branch mismatch detection.** It's already correct — it detects divergence and re-renders the branch.

5. **Consider wiring per-item Reactions in each-loop hydration.** Currently, each-item inner expressions are dead after hydration. This is a separate correctness issue that should be tracked but isn't blocking the state-divergence fix.

---

## The Overengineering / Underengineering Assessment

### Overengineered

The **reference DOM approach in `hydrateAttributes`** is over-complicated. It rebuilds the HTML string from the AST, parses it into a reference DOM, then walks both trees in parallel to find attribute marker positions. This is O(n) in DOM size for every hydration. A simpler approach: during server rendering, embed attribute marker IDs as data attributes (e.g., `data-sui-attr="3,7"`) so the client can find them directly. Or better: the server renderer already produces markers in comments — extend the marker system to handle attributes without a reference DOM.

However, this is a separate concern from the state divergence bug. The reference DOM approach works correctly; it's just more expensive than necessary.

### Underengineered

1. **Each-loop hydration doesn't wire inner Reactions.** Items are inert after hydration. If an item property changes without the collection signal firing, the DOM won't update. This is a correctness gap, not just an optimization miss. It's acknowledged by the `getServerRenderedAST` returning null for each, but it means each-loop items are essentially static until the next full re-render.

2. **No hydration mismatch detection for text/attributes.** The conditional branch mismatch detection (lines 1306-1334) is good, but there's no equivalent for text or attribute divergence. In development mode, the framework should warn when hydrated values don't match server DOM. Every major framework does this (React's hydration warnings, Svelte's hydration validation, Solid's dev-mode checks).

3. **The `requestAnimationFrame` deferral in `connectedCallback` delays ALL hydration.** This means the component is interactive-but-stale for one frame. If `initialize()` changes state, the user sees server content for one frame, then it snaps to client content. The rAF deferral is a performance choice (let the browser paint first), but it exacerbates the state divergence issue by widening the window where stale content is visible.

---

## Concrete Recommendation

The minimal, correct fix is:

**In `hydrateTextExpression`** (renderer.js ~line 1236-1244):
```js
scope.track(Reaction.create((comp) => {
    if (!comp.firstRun && !textNode.isConnected) {
        comp.stop();
        return;
    }
    const value = this.eval(exprNode.value, data);
    // Always write — browser short-circuits if value hasn't changed.
    // This handles state divergence from initialize() correctly.
    textNode.data = value ?? '';
}));
```

**In `hydrateAttributes`** for single-expression attributes (renderer.js ~line 1119-1141):
```js
scope.track(Reaction.create((comp) => {
    if (!comp.firstRun && !element.isConnected) {
        comp.stop();
        return;
    }
    const value = this.eval(singleEntry.node.value, data);
    // Always write — no firstRun skip needed.
    if (isIfDefined && inArray(value, ['', undefined, null, false, 0])) {
        element.removeAttribute(attrName);
    }
    else {
        const strValue = (isArray(value) || isPlainObject(value))
            ? JSON.stringify(value)
            : String(value ?? '');
        element.setAttribute(attrName, strValue);
    }
    if (inArray(attrName, ['checked', 'selected'])) {
        element[attrName] = Boolean(value);
    }
    if (inArray(attrName, ['value'])) {
        element[attrName] = value ?? '';
    }
}));
```

**In `hydrateAttributes`** for property bindings (~line 1088-1098):
```js
scope.track(Reaction.create((comp) => {
    if (!comp.firstRun && !element.isConnected) {
        comp.stop();
        return;
    }
    const value = this.evaluator.lookupTokenValue(expr.node.value, data);
    // Always write — no firstRun skip needed.
    element[realAttrName] = value;
}));
```

**In `hydrateAttributes`** for multi-expression attributes (~line 1144-1169):
Remove the special firstRun branch entirely. Always compute and write.

**Leave unchanged:**
- `hydrateEach` firstRun skip (structural, not value-based)
- `hydrateTextExpression` unsafeHTML firstRun skip (expensive write)
- `hydrateAsync` firstRun handling (different semantics)
- `hydrateRerender` firstRun handling (different semantics)

This is the minimum change that restores correctness for the state divergence case while preserving the performance characteristics of each-loop and unsafeHTML hydration.

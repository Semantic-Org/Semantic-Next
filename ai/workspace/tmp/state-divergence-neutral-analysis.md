# State Divergence During Hydration: Neutral Analysis

## Code State Evaluated

- `packages/renderer/src/engines/native/renderer.js` (full file, 1615 lines)
- `packages/component/src/engines/native/base.js` (full file, 330 lines)
- `packages/templating/src/template.js` (full file, 1141 lines)
- `packages/reactivity/src/signal.js` (full file, 336 lines)
- `packages/reactivity/src/reaction.js` (full file, 136 lines)
- `packages/reactivity/src/dependency.js` (full file, 40 lines)
- `packages/reactivity/src/scheduler.js` (full file, 74 lines)
- `packages/renderer/src/engines/native/dynamic-region.js` (full file, 39 lines)

---

## Question 1: How should the hydration system handle the tension between "trust server DOM" and "state may have diverged"?

### The Core Tension

The `firstRun` skip is not a single pattern but appears in four distinct places, each with slightly different semantics:

1. **`hydrateTextExpression`** (renderer.js:1236-1244) — Evaluates expression to register Signal dependencies, then `return`s before `textNode.data = value`. The evaluated value is discarded.

2. **`hydrateAttributes` single-expression** (renderer.js:1119-1141) — Evaluates expression to register deps, then `return`s before `setAttribute`. Same pattern.

3. **`hydrateAttributes` multi-expression** (renderer.js:1144-1170) — Evaluates all expression parts individually to register deps, then `return`s before building the concatenated value string.

4. **`hydrateAttributes` property binding** (renderer.js:1088-1096) — Evaluates token to register deps, then `return`s before setting `element[realAttrName]`.

5. **`hydrateEach`** (renderer.js:1445-1482) — Evaluates `node.over` to register deps on the collection Signal, then `return`s without wiring per-item Reactions or adopting existing DOM nodes into an item map.

The "trust server" assumption is valid **only when the server state and client state are identical at the moment Reactions are wired**. The evaluation prompt describes a case where they diverge: `initialize()` runs at step 3 of `Template.initialize()`, mutating `state.label` from `'server'` to `'client'`. The Renderer is created at step 4 (template.js:267-273). `hydrateMarkers()` runs after that (base.js:132-137).

The timing chain is:

```
Template constructor → createReactiveState() → state.label = Signal('server')
Template.clone()    → (constructor runs above, but NOT initialize())
...
hydrate() calls prototypeTemplate.clone({ data }) → Template constructor runs
... but clone() returns a new Template — it does NOT call initialize()

Actually, examining more carefully:

base.js:113  this.template = prototypeTemplate.clone({ data, element, renderRoot })
             → Template constructor (template.js:44-104): createReactiveState() runs
             → But initialize() is NOT called in constructor

base.js:119  this.template._isHydrating = true
base.js:120  this.component = this.template.instance  // {} — empty, not yet initialized

Wait — there's no explicit initialize() call in hydrate(). Let me re-read.
```

Looking again at `hydrate()` in base.js:104-147:

```js
hydrate(prototypeTemplate) {
    const data = this.getData();
    this.template = prototypeTemplate.clone({ data, element: this, renderRoot: this.renderRoot });
    this.template._isHydrating = true;
    this.component = this.template.instance;
    this.dataContext = this.template.getDataContext();
    // ... build entries, hydrateMarkers ...
}
```

And `Template.clone()` (template.js:415-439) calls `new Template(templateSettings)`. The constructor (template.js:44-104) does:
- `this.state = this.createReactiveState(defaultState, data)` (line 84)
- Sets various properties
- If `renderRoot` is provided, calls `this.attach(renderRoot)` (line 102-103)

And `attach()` (template.js:325-347) calls `this.initialize()` if `!this.initialized`.

So the clone **does** receive `renderRoot` (from the `hydrate()` call on line 113), which means `attach()` is called, which means `initialize()` IS called during `clone()`.

Let me trace the full initialization order inside `Template.initialize()` (template.js:175-323):

1. `createComponent()` is called (line 185-187) — user factory runs, returns `{ initialize() {...} }`
2. `instance.initialize()` is called (line 189-191) — user's init hook runs, **can mutate state**
3. Renderer is created (line 267-273) — `this.renderer = new RendererClass({ data: this.overlaySettingsSignals(this.getDataContext()), ... })`

At step 2, `state.label.set('client')` fires. This:
- Sets `this.currentValue = 'client'` (signal.js:112)
- Calls `this.dependency.changed(this.context)` (signal.js:114)
- `changed()` calls `subscriber.invalidate()` on all subscribers (dependency.js:28)
- But there are **no subscribers** yet — the Renderer doesn't exist, so no Reactions have been created that read `state.label`

The Signal's `currentValue` is now `'client'`. When `getDataContext()` is called at step 3, it returns `{ ...this.state, ... }` where `this.state.label` is the Signal object itself (not its value). The Renderer stores this data object.

Then `hydrateMarkers()` runs. For the text expression `{label}`:

```js
// hydrateTextExpression, renderer.js:1236-1244
scope.track(Reaction.create((comp) => {
    if (!comp.firstRun && !textNode.isConnected) { comp.stop(); return; }
    const value = this.eval(exprNode.value, data);  // evaluates {label} → reads Signal → gets 'client'
    if (comp.firstRun) { return; }  // ← SKIPS the DOM write
    textNode.data = value ?? '';
}));
```

The Reaction runs synchronously on creation (`Reaction.create` calls `reaction.boundRun()` — reaction.js:8-9). During this first run:
- `this.eval(exprNode.value, data)` reads `state.label`, which calls `signal.dependency.depend()`, registering this Reaction as a subscriber
- The return value is `'client'` (the Signal's current value)
- `comp.firstRun` is `true`, so `textNode.data` is NOT set — it remains `'server'`
- After `this.callback(this)` completes, `this.firstRun = false` (reaction.js:68)

Now the Reaction is subscribed to `state.label`. But the Signal's value is already `'client'` and won't change again, so `dependency.changed()` will never fire for this Signal. The Reaction never re-runs. The text node permanently shows `'server'`.

### Analysis

The fundamental issue is a **temporal gap**: state mutations in `initialize()` happen before Reactions exist, so the notifications are lost. The `firstRun` skip then compounds this by refusing to reconcile on the assumption that server and client agree.

The system already handles structural divergence for `{#if}` blocks — `hydrateBlockDirective` (renderer.js:1303-1335) compares `serverBranchIndex` with `clientBranch.matchIndex` and re-renders on mismatch. This shows the codebase already acknowledges that server/client can diverge. But no equivalent mechanism exists for text/attribute expressions.

**How should it handle this tension?** There are three viable approaches:

**A. Compare-and-patch on firstRun.** During the first Reaction run, evaluate the expression and compare the result against the existing DOM value. If they differ, write to DOM. If they match, skip (the current optimization). This preserves the performance benefit in the common case (no divergence) while handling the divergence case correctly.

**B. Defer `firstRun` skip to after flush.** Instead of skipping on `comp.firstRun`, evaluate and write unconditionally. For text nodes, `textNode.data = sameValue` is a browser no-op when the value hasn't changed (the browser checks internally). For attributes, `setAttribute(name, sameValue)` is also essentially free. The cost is evaluating the expression and converting to string, not the DOM write itself. This is the simplest approach but has implications for each-loops (see Q2).

**C. Replay missed notifications.** After `hydrateMarkers()` completes, check each Signal in the data context to see if its value differs from what the server would have rendered. If so, fire `dependency.changed()` to trigger the subscribed Reactions. This is complex and fragile because determining "what the server would have rendered" requires knowledge of the original `defaultState`.

Approach A is the best balance. It preserves the optimization, handles divergence, and is localized to the hydration code path.

---

## Question 2: Is the each-loop data context the reason removing `firstRun` skip breaks each loops?

### The hydrateEach Implementation

Looking at `hydrateEach` (renderer.js:1445-1482):

```js
hydrateEach({ node, data, scope, region }) {
    scope.track(Reaction.create((comp) => {
        // ...
        const rawItems = this.eval(node.over, data) || [];
        const collectionType = this.getCollectionType(rawItems);
        const items = (collectionType === 'object') ? arrayFromObject(rawItems) : rawItems;

        if (comp.firstRun) {
            return; // server content is correct
        }
        // ... full re-render of list ...
    }));
}
```

On `firstRun`, it evaluates `node.over` (the collection expression) to register dependencies on the collection Signal, then returns. It does **not**:
- Create per-item data contexts
- Wire per-item Reactions
- Adopt the server-rendered DOM nodes into an `itemMap` for reconciliation

The server-rendered DOM nodes are inside `region.ownedNodes` (set during `hydrateBlockDirective` at renderer.js:1287). The inner content was hydrated by `hydrateInnerContent` (renderer.js:1296), which passes the **parent data context** (`data`), not per-item data:

```js
// hydrateBlockDirective, renderer.js:1293-1296
if (contentAST && ownedNodes.length > 0) {
    const innerScope = scope.child();
    region.childScopes.push(innerScope);
    this.hydrateInnerContent(ownedNodes, contentAST, data, innerScope);
```

But wait — `getServerRenderedAST` for `'each'` returns `null` (renderer.js:1394):

```js
case 'each':
    return null; // each handled separately (per-item data)
```

So `contentAST` is `null`, and the `if (contentAST && ownedNodes.length > 0)` check on line 1293 is `false`. **The inner content of each-loops is NOT hydrated at all during the block directive processing.** The server-rendered text nodes sit there inert, with no Reactions wired to them.

This means:
1. Each-loop items have no reactive bindings after hydration
2. When the collection Signal changes, `hydrateEach`'s Reaction fires (it's no longer `firstRun`), and it does a full re-render of the entire list from scratch

### Why Removing firstRun Skip Breaks Each Loops

Now, the question is about removing the `firstRun` skip from `hydrateTextExpression` and `hydrateAttributes`. The each-loop inner content is **not hydrated** (as shown above — `getServerRenderedAST` returns `null` for `'each'`). So removing the text expression `firstRun` skip should not directly affect each-loop inner content, because those Reactions are never created.

However, the hypothesis in the evaluation prompt suggests that `hydrateInnerContent` passes the parent data context. Let me re-examine: since `contentAST` is `null` for each, `hydrateInnerContent` is never called for each-loop content. The each-loop DOM is left as static server HTML.

**But there could be an indirect issue.** If the `firstRun` skip removal was tested broadly (not just in `hydrateTextExpression` but also by removing the skip in `hydrateEach` itself), then the each-loop Reaction would try to do a full re-render on first run. Looking at the non-firstRun path in `hydrateEach`:

```js
if (isEmpty(items) && node.elseContent) { ... }
else {
    const fragment = document.createDocumentFragment();
    const listScope = scope.child();
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const eachData = this.getEachData(item, i, collectionType, node);
        const itemSignal = new Signal(eachData);
        const itemProxy = this.createItemDataProxy(data, itemSignal);
        const itemScope = listScope.child();
        const itemFragment = this.readAST({ ast: node.content, data: itemProxy, scope: itemScope });
        fragment.append(itemFragment);
    }
    region.setContent(fragment, listScope);
}
```

This would do a full `readAST` → render, creating new DOM from scratch. `region.setContent` calls `region.clear()` first, which removes the server DOM. This would work correctly for the each content itself, but it's wasteful — it throws away perfectly good server DOM and re-renders.

The more likely scenario for breakage: if the test involved removing the `firstRun` skip in `hydrateTextExpression` while each-loop inner content WAS somehow being hydrated (perhaps in an earlier version of the code, or via a different path), then text expressions inside each items would evaluate `{name}` or `{index}` against the parent data context rather than a per-item proxy, producing wrong values.

**In the current code**, the each-loop content is not individually hydrated, so this specific issue cannot occur. The `firstRun` skip in `hydrateTextExpression` and `hydrateAttributes` can be conditionally removed (compare-and-patch) without affecting each-loops, because each-loop inner content never goes through those hydration paths.

The `firstRun` skip in `hydrateEach` itself serves a different purpose: it prevents a wasteful full re-render of the list when the server content is already correct.

### Summary

The hypothesis is plausible for an earlier code state but does not match the current implementation. In the current code, `getServerRenderedAST` returns `null` for each-loops, so their inner content is never passed through `hydrateInnerContent` or `hydrateTextExpression`. The `firstRun` skip in `hydrateEach` prevents a different problem (wasteful full list re-render), not a data context mismatch.

---

## Question 3: Can we detect value divergence and write only when different? What are the costs?

### Feasibility

Yes, this is straightforward for text expressions and single-expression attributes. The approach:

**Text expressions** (`hydrateTextExpression`, renderer.js:1236-1244):

```js
scope.track(Reaction.create((comp) => {
    if (!comp.firstRun && !textNode.isConnected) { comp.stop(); return; }
    const value = this.eval(exprNode.value, data);
    if (comp.firstRun) {
        // Compare against server DOM — only write on divergence
        const rendered = String(value ?? '');
        if (textNode.data !== rendered) {
            textNode.data = rendered;
        }
        return;
    }
    textNode.data = value ?? '';
}));
```

**Single-expression attributes** (`hydrateAttributes`, renderer.js:1119-1141):

```js
const value = this.eval(singleEntry.node.value, data);
if (comp.firstRun) {
    // Compare against server DOM
    const strValue = String(value ?? '');
    if (element.getAttribute(attrName) !== strValue) {
        element.setAttribute(attrName, strValue);
    }
    return;
}
```

**Multi-expression attributes** (renderer.js:1144-1170): Same pattern — build the concatenated string, compare with `getAttribute`, write only if different.

**Property bindings** (renderer.js:1088-1096): Compare `element[realAttrName]` with the evaluated value.

### Costs

1. **String conversion on firstRun.** For text expressions, `String(value ?? '')` is needed to compare against `textNode.data`. This is a trivial cost — a single `String()` call.

2. **getAttribute on firstRun.** For attributes, `element.getAttribute(attrName)` requires reading the DOM attribute. This is a very fast operation (the attribute is already parsed into the DOM tree).

3. **No additional Reaction runs.** The compare-and-patch happens within the existing firstRun execution. It does not schedule additional microtasks or Reaction flushes.

4. **False positives from serialization differences.** If the server serializes a value differently than the client (e.g., `"true"` vs `true`, or floating-point formatting), the comparison might trigger unnecessary writes. However, both server and client use the same expression evaluator and `String()` conversion, so this is unlikely.

5. **unsafeHTML text expressions.** For `unsafeHTML` (renderer.js:1191-1207), comparing server DOM against client evaluation is harder because the server output is a DOM tree, not a string. A DOM comparison would be expensive and fragile. The current `firstRun` skip for unsafeHTML should be preserved unless there's a compelling reason to handle divergence there.

6. **The text node splitting logic.** In `hydrateTextExpression` (renderer.js:1213-1234), the code already evaluates `this.eval(exprNode.value, data)` on line 1217 to compute `serverValue` for the split logic:

    ```js
    const serverValue = String(this.eval(exprNode.value, data) ?? '');
    ```

    This evaluation happens **outside** the Reaction, in the setup code. It reads the Signal (getting `'client'`) and uses it to determine the split point. But the text node contains `'server'` from the server render. If the values differ, the split logic could produce incorrect results — `fullText.startsWith(serverValue)` might be `false` when it should be `true` (the server wrote `'server'` but `serverValue` is `'client'`).

    This is actually a **pre-existing bug** in the text splitting logic. When the Signal value has diverged, the `serverValue` used for splitting is the client's current value, not the server's original value. This could cause incorrect text node splitting when static text follows a dynamic expression.

### Recommendation

The compare-and-patch approach is low-cost and handles the divergence case correctly. The main cost is the `String()` conversion and comparison on firstRun, which is negligible compared to the Reaction creation and expression evaluation costs already being paid.

The text node splitting bug (point 6 above) should be addressed separately — it's an issue regardless of whether the firstRun skip is modified.

---

## Question 4: Should `initialize()` be considered "server-equivalent" or a "client-side mutation"?

### What the Code Currently Assumes

The code currently treats `initialize()` as **server-equivalent** — it assumes the server ran `initialize()` and produced DOM that reflects its effects. The `firstRun` skip in all hydration Reactions is predicated on this assumption.

However, this assumption is incorrect for two reasons:

**1. The ServerRenderer does not run `initialize()`.** Looking at the server rendering path: the ServerRenderer receives `data` from `getDataContext()` which includes the state Signals. But `getDataContext()` is called from `Template.initialize()` at step 4 (template.js:268), which is after `instance.initialize()` at step 3. So when the server renders, it does use post-initialize state. But this only works if `createComponent` + `initialize` ran during server template initialization too.

Actually, `Template.initialize()` is the same on server and client — step 1-4 happen identically. So if the server template ran `initialize()`, the server `state.label` Signal would also be `'client'`, and the server would render `"client"`. In that case, there would be no divergence.

The divergence only occurs when `initialize()` behaves **differently** on server vs client, typically via `isClient`/`isServer` guards:

```js
initialize() {
    if (isClient) {
        state.label.set('client');
    }
}
```

The server skips the `if (isClient)` branch, renders `"server"`. The client enters it, sets `'client'`, but hydration trusts the server DOM.

**2. The `isClient`/`isServer` pattern is a first-class use case.** The template system explicitly provides `isClient` and `isServer` as call params (template.js:298-299):

```js
isServer: Template.isServer,
isClient: !Template.isServer,
```

This is not an edge case — it's a deliberately supported pattern for environment-specific initialization. The hydration system should expect that `initialize()` running with `isClient: true` may produce different state than the server render where `isClient` was `false`.

### The Conditional Hydration Precedent

The `{#if}` hydration already treats server/client divergence as expected:

```js
// renderer.js:1306-1334
const clientBranch = this.getBranch(node, data);
const serverBranchIndex = serverMeta.branchIndex;
const hasMismatch = serverBranchIndex !== undefined
    && serverBranchIndex !== clientBranch.matchIndex;

if (hasMismatch) {
    const isEnvironmentGuard = node.condition === 'isClient' || node.condition === 'isServer';
    if (isDevelopment && !isEnvironmentGuard) {
        console.warn(/* ... */);
    }
    // Re-render with client branch immediately
```

This code explicitly checks for `isClient`/`isServer` conditions and suppresses the warning for them. It treats environment-dependent rendering as a normal, expected case. This is the right model.

### Classification

`initialize()` should be classified as follows:

- **If `initialize()` mutates state unconditionally** (no `isClient`/`isServer` guard): The server also ran this mutation, so the server DOM reflects it. The hydration system can trust the server DOM. This is the "server-equivalent" case.

- **If `initialize()` mutates state conditionally** (with `isClient`/`isServer` guard): The server did NOT run this mutation, so the server DOM does NOT reflect it. The hydration system must detect and apply the divergence. This is the "client-side mutation" case.

The hydration system currently handles neither case differently — it blindly trusts the server DOM. For the unconditional case, this works by accident (server and client agree). For the conditional case, it produces a silent bug.

### Recommendation

`initialize()` should be treated as **potentially divergent from server state**. The hydration system should not assume server DOM matches client state. Instead, it should compare evaluated values against server DOM on firstRun and write when they differ (the compare-and-patch from Q3). This handles both cases correctly:

- When server and client agree: comparison finds equality, no write (preserves optimization)
- When they diverge: comparison finds difference, writes correct value (fixes the bug)

This is architecturally consistent with how `{#if}` hydration already handles divergence.

---

## Additional Finding: Text Node Splitting Bug

During the analysis, I identified a pre-existing issue in `hydrateTextExpression` that compounds the divergence problem.

At renderer.js:1213-1228:

```js
const nextNode = comment.nextSibling;
let textNode;
if (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
    const serverValue = String(this.eval(exprNode.value, data) ?? '');
    const fullText = nextNode.data;

    if (fullText.length > serverValue.length && fullText.startsWith(serverValue)) {
        nextNode.splitText(serverValue.length);
        textNode = nextNode;
    }
    else {
        textNode = nextNode;
    }
    comment.remove();
}
```

The `this.eval(exprNode.value, data)` call on line 1217 evaluates the expression using the **current client state**, not the original server state. When state has diverged:

- `serverValue` = `'client'` (current Signal value)
- `fullText` = `'server'` (what the server actually rendered into the DOM)
- `fullText.startsWith('client')` = `false`
- The split logic falls through to `textNode = nextNode`, which is correct by accident (no split needed)

But consider a case where the server rendered `"client-side"` and the client state diverged to `"client"`:
- `serverValue` = `'client'`
- `fullText` = `'client-side'`
- `fullText.startsWith('client')` = `true`
- `splitText(6)` splits at "client" | "-side"
- The text node now contains `"client"` and the remainder `"-side"` is a separate text node

This would be incorrect if the full text was `"client-side"` as a single value, but it happens to produce the right result if the expression value was indeed `"client"` followed by static text `"-side"`.

The real concern is the opposite direction: server renders `"short"` but client evaluates to `"shortText"`:
- `serverValue` = `'shortText'` (10 chars)
- `fullText` = `'short'` (5 chars)
- `fullText.length > serverValue.length` is `false`
- Falls through to `textNode = nextNode`, which takes the whole text node

This means if there was static text after the expression in the template (e.g., `{label} more text`), the static text that the browser merged into the same text node would be included in the reactive text node, and then overwritten on the next Reaction run.

This splitting logic is fragile when server and client values differ. A compare-and-patch approach in the Reaction (Q3) would need to be paired with fixing this splitting logic to use the actual DOM text content rather than the evaluated expression value as the split boundary.

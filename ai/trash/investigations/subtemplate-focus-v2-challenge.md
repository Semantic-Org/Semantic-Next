# Subtemplate Focus v2: Why DOM Preservation and Data Flow Are In Tension

## The Two Tests

**File:** `packages/renderer/test/browser/subtree-caching.test.js`, describe "16. Subtemplate inside each"

| Test | Status | What it proves |
|------|--------|----------------|
| "should preserve focus on the CHANGED item after toggle" | **FAILS** | When item A's data changes, item A's subtemplate DOM is destroyed and recreated (focus lost) |
| "should update sibling subtemplate that reads shared state" | **PASSES** | Footer subtemplate's `getRemaining` function reads `todos.get()`, which is a reactive signal access inside the packed closure — the `watchChanges` reaction tracks it |

## Root Cause: Exact Mechanism

### The Destruction Sequence

When `todos.setProperty('a', 'completed', true)` fires:

1. **reactive-each** detects the signal change, calls `renderItems()`
2. Item `'a'` fails the `isEqual(snapshot, item)` check → `getTemplate()` runs
3. `getTemplate` calls `eachCondition.content(templateData, 'a')` → `renderContent({ast, data, key: 'a'})`
4. `renderContent` finds the cached LitRenderer subtree for key `'a'`, calls `cachedRender(data)`
5. `cachedRender` updates `this.data` on the subtree LitRenderer, bumps `dataVersion`, returns same `litTemplate`
6. Lit's `repeat()` receives this `litTemplate` for item `'a'`. Since the template strings identity matches (`_cachedStrings`), Lit takes the **update path** — diffs expressions, calls `directive.update()` on each
7. The `renderTemplate` directive's `render()` is called with the same packed closures (same expression values)
8. **`maybeCreateTemplate()` calls `template.clone()`** — a NEW Template instance with `rendered = false`
9. `renderTemplate()` calls `this.template.render()` → since `rendered = false`, calls `this.renderer.render()`
10. `renderer.render()` creates a **new** `_cachedStrings` array (new LitRenderer, never rendered before)
11. Lit sees different template strings → **replaces entire DOM range** → focus destroyed

### Why the Guard Was Disabled

Lines 105-109 of `render-template.js`:
```js
// TODO: guard against unnecessary re-cloning when only data changes
// Currently disabled — packed data closures are stale after guard
// if (this.template && this.templateID === template.id) {
//   return;
// }
```

The guard prevents re-cloning, but introduces a different problem. Here's why:

**With the guard enabled**, step 8 above returns early (no re-clone). The existing Template is reused. `renderTemplate()` calls `this.template.setDataContext(dataContext)` and then `this.template.render()`. The Template's renderer has `_cachedStrings` from the first render, so Lit preserves DOM. Focus is preserved.

**But** there's a second update path: `cachedRender` (step 5) bumped `dataVersion` on the parent subtree. This should trigger data flow through the packed closures in the `watchChanges` reaction. However, the packed closures for static data (`todo=todo`) are wrapped in `Reaction.nonreactive()`:

```js
// getPackedValue with reactive: false (the default for static data)
return () => Reaction.nonreactive(() => getValue(expression));
```

Inside `Reaction.nonreactive()`, `this.dataVersion.get()` does NOT create a reactive dependency. The `watchChanges` reaction has no tracked dependencies for non-reactive packed data. **It never re-runs after the first time.**

So with the guard enabled: focus is preserved, but non-reactive data changes don't propagate to the subtemplate. The "stale packed data closures" comment refers to exactly this: the closures exist but the reaction that reads them has no trigger to fire.

**The tension:** Without the guard, data flows (via re-clone + full render) but DOM is destroyed. With the guard, DOM is preserved but data doesn't flow (reaction has no dependencies).

### Why Test 3 Passes Regardless

The footer test uses `getRemaining=getRemaining` where `getRemaining` is:
```js
getRemaining: () => todos.get().filter(t => !t.completed).length
```

This is packed as a non-reactive closure. But the footer's `renderTemplate` directive DID get its `render()` called (it's NOT inside the `{#each}`, so it goes through a different path). On that re-render, `maybeCreateTemplate()` re-clones the Template, which gets the fresh data including the updated `getRemaining` function. The footer renders fresh DOM, which correctly shows `2 items left`. The footer doesn't have focus, so DOM destruction is invisible.

## The Real Question: Can We Have Both?

### What "Both" Requires

1. The existing Template instance must persist across data updates (no re-clone) — preserves DOM, focus, scroll, animations
2. The packed data closures must deliver updated values to the subtemplate — preserves data flow

### Why This Is Solvable

The packed closures for `todo=todo` close over `this` (the parent subtree's LitRenderer) and evaluate against `this.data`. When `cachedRender` runs, it calls `updateData(data)` which **mutates `this.data` in place**. So the closures already resolve to the correct updated values when called — the problem is just that nothing TRIGGERS the call.

From `evaluateExpression` (non-directive, non-asDirective mode):
```js
this.dataVersion.get();  // reads parent LitRenderer's dataVersion
return this.lookupExpressionValue(expression, this.data);  // uses this.data, not the captured parameter
```

The `this.data` on the parent LitRenderer is updated. The closures read from it. They would return the right values if invoked. The only missing piece is a reactive trigger.

## Proposed Architecture

### The Fix: Two Changes

**Change 1: Enable the guard + add `dataVersion` tracking**

Pass the parent LitRenderer's `dataVersion` signal to the `renderTemplate` directive. Have the `watchChanges` reaction track it explicitly. This gives the reaction a reactive dependency that fires when the parent's data changes.

**Change 2: Add the reaction-guard pattern (like every other directive)**

When `render()` is re-called by Lit (because the parent did a full re-render), update `this.data` but return `noChange` if a reaction already exists. Let the reaction handle updates.

### Concrete Implementation

**In `renderer.js` — `evaluateSubTemplate`:**
```js
evaluateSubTemplate(node, data = {}) {
    const templateData = this.getPackedNodeData(node, data);
    return renderTemplate({
      subTemplates: this.subTemplates,
      templateName: node.name,
      getTemplate: () => this.evaluateExpression(node.name, data),
      data: templateData,
      parentTemplate: this.template,
      dataVersion: this.dataVersion,  // NEW: pass parent's dataVersion signal
    });
}
```

**In `render-template.js`:**
```js
render({ getTemplate, templateName, subTemplates, data, parentTemplate, dataVersion }) {
    this.parentTemplate = parentTemplate;
    this.getTemplate = getTemplate;
    this.subTemplates = subTemplates;
    this.data = data;
    this.parentDataVersion = dataVersion;  // NEW: store reference
    this.ast = null;

    // Reuse existing reaction — like every other directive
    if (this.reaction) {
      return noChange;
    }

    if (isClient) {
      this.watchChanges();
    }

    this.maybeCreateTemplate();

    if (!this.template || this.template?.ast.length == 0) {
      return nothing;
    }
    return this.renderTemplate();
}

watchChanges() {
    this.reaction = Reaction.create((reaction) => {
      this.maybeCreateTemplate();

      // Track parent data version — fires when cachedRender bumps it
      if (this.parentDataVersion) {
        this.parentDataVersion.get();
      }

      const dataContext = this.unpackData(this.data);

      if (!this.isConnected) {
        reaction.stop();
        return;
      }

      if (reaction.firstRun) {
        return;
      }

      const template = this.template;
      if (!template || template?.ast.length == 0) {
        return;
      }

      reaction.addContext({
        message: `template ${template?.templateName} data context`,
        dataContext: dataContext,
        template: template,
      });

      const html = this.renderTemplate(dataContext);
      this.setValue(html);
    });
}

maybeCreateTemplate() {
    let templateName;
    let template;

    const templateOrName = this.getTemplate();
    if (isString(templateOrName)) {
      templateName = templateOrName;
      template = this.subTemplates[templateName];
    }
    else if (templateOrName instanceof Template) {
      template = templateOrName;
      templateName = template.templateName;
    }

    if (!template) {
      return false;
    }

    // Guard: reuse existing Template when same definition
    if (this.template && this.templateID === template.id) {
      return;
    }

    // Only clone on first create or when template definition changes
    if (this.template) {
      this.template.onDestroyed();
    }
    this.templateID = template.id;
    this.template = template.clone({
      templateName,
      subTemplates: this.subTemplates,
      data: this.unpackData(this.data),
    });
}
```

### How This Solves Both Tests

**Test 2 ("preserve focus on CHANGED item"):**
1. Item 'a' changes, `cachedRender` bumps parent `dataVersion`
2. `renderTemplate` directive's `watchChanges` reaction fires (tracks `parentDataVersion`)
3. `maybeCreateTemplate()` — guard matches, returns early (no re-clone)
4. `unpackData(this.data)` — closures evaluate against parent's updated `this.data` → returns fresh values
5. `renderTemplate(dataContext)` → calls `template.setDataContext(dataContext)` → `template.render()`
6. `Template.render()` calls `renderer.render()` (because `setDataContext` set `rendered = false`)
7. `renderer.render()` uses existing `_cachedStrings` → Lit preserves DOM → **focus preserved**

**Test 3 ("update sibling subtemplate with shared state"):**
1. Item 'a' changes, reactive-each re-renders items
2. Footer's parent subtree (the main component's LitRenderer) may or may not re-render
3. If it does: the directive's `render()` is called, but returns `noChange` (reaction exists)
4. The reaction tracks `parentDataVersion` which fires on any data change
5. Footer's packed closure for `getRemaining` evaluates the function, which calls `todos.get()` — a reactive signal
6. The reaction also tracks `todos` directly (through the closure evaluation)
7. `renderTemplate` renders with updated data → **footer shows correct count**

### Why `parentDataVersion` Is the Right Signal

- It fires exactly when the parent's data context changes (via `cachedRender` → `bumpDataVersion`)
- It's already an existing mechanism — no new signal infrastructure needed
- It doesn't fire for unrelated changes (scoped to the parent LitRenderer subtree)
- It provides the minimal reactive dependency: "something in my parent's data changed, re-evaluate my packed closures"

## Risk Analysis

### What could break?

1. **Over-triggering**: `dataVersion` bumps for ANY data change in the parent, not just the specific property the subtemplate uses. A parent with 10 data fields changing independently would trigger 10 reaction runs even if only 1 field matters to the subtemplate. This is acceptable because:
   - The subtemplate's `renderTemplate` → `Template.render()` → `renderer.render()` uses `_cachedStrings`, so Lit only patches changed expressions
   - The per-reaction cost is a data evaluation + AST walk, not DOM creation
   - This matches how `reactiveData` directives work (they track `dataVersion` too)

2. **Template definition changes**: When `{>dynamicExpr}` resolves to a DIFFERENT template, the guard correctly allows re-cloning. The `templateID` check handles this.

3. **State preservation**: With the guard enabled, the Template instance persists. Its `createComponent` runs once. Subsequent renders update data but don't re-initialize state. This is the CORRECT behavior — it matches how every other framework's components work.

4. **Event re-binding**: `attachTemplate()` is called in `renderTemplate()`. It calls `this.template.attach(renderRoot, ...)`. Inside `Template.attach()`, if `renderRoot` is already set, it returns early. Events are NOT re-bound. This is correct — the Template's event bindings persist.

5. **Reaction leak**: The current code creates a new reaction every time `render()` is called. The `if (this.reaction) return noChange` guard fixes this leak — exactly the same pattern used by all other directives.

## Alternative Approaches Considered

### A: Make all subtemplate packed data reactive
Change `getPackedNodeData` to use `{ reactive: true }` for subtemplates. This would make the existing `watchChanges` reaction track `dataVersion` through the closure evaluation chain.

**Rejected:** Changes the semantics of non-reactive data globally. Could cause performance issues in templates with many expressions. The `Reaction.nonreactive()` wrapping exists for a reason — to prevent cascading reactive dependencies in contexts that should be static.

### B: Re-clone but reuse `_cachedStrings`
Clone the Template but transfer the previous renderer's `_cachedStrings` to the new one.

**Rejected:** Re-cloning destroys Template state, events, and lifecycle. The goal isn't just DOM preservation — it's Template instance preservation. A Template with its own `createComponent` state should not be recreated on every data change.

### C: Use `cachedRender` on the subtemplate's internal LitRenderer
Instead of calling `Template.render()`, directly call `template.renderer.cachedRender(data)`.

**Considered but nuanced:** This bypasses `setDataContext` and `Template.render()` lifecycle. Could work but requires careful handling of the `rendered` flag and `onRendered`/`onUpdated` callbacks. The proposed approach is simpler — it uses the existing `Template.render()` path but ensures `_cachedStrings` is reused because the renderer instance persists.

### D: Separate the reaction from `render()` entirely
Make the directive pure-synchronous (no reaction) and rely entirely on Lit re-calling `render()` when parent data changes.

**Rejected:** This doesn't handle the `cachedRender` path where the parent subtree returns the same `litTemplate` without re-invoking directive `render()`. The reaction is necessary for the cached-subtree update path.

## Key Files

| File | What to change |
|------|---------------|
| `packages/renderer/src/lit/directives/render-template.js` | Enable guard, add reaction-guard pattern, track `parentDataVersion` |
| `packages/renderer/src/lit/renderer.js` | Pass `this.dataVersion` in `evaluateSubTemplate` |

## Confidence Assessment

**High confidence** that enabling the guard + `parentDataVersion` tracking satisfies both tests. The mechanism is well-understood and matches the existing reactive architecture. The main risk is edge cases in Template lifecycle (state initialization timing, event binding), but those should be caught by the existing test suite (tests 1 and 3 in section 16, plus the broader subtree-caching tests).

The `parentDataVersion` approach is the minimum viable change. It doesn't alter the packed-closure semantics, doesn't change how other directives work, and reuses the existing `dataVersion` signal infrastructure.

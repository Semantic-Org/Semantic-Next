# Subtemplate Focus Preservation: Architectural Analysis

## The Failing Test

**File:** `packages/renderer/test/browser/subtree-caching.test.js`
**Test:** "16. Subtemplate inside each" -> "should not destroy subtemplate DOM when sibling item data changes"

### Immediate Failure

The test uses `waitForUpdate(el)` (line 727) but only defines `flush(el)` as its helper. The function `waitForUpdate` is defined in sibling test files (e.g., `subtree-rerender.test.js:15`) but was never imported or defined in this file. Fixing that is trivial.

### Deeper Failure (the architectural bug)

Even after fixing the missing function, **the test will still fail** because of how the `renderTemplate` directive handles reactive updates. Focus will be lost on the second item's input when the first item is toggled.

---

## Two Rendering Paths

The renderer has two distinct paths for rendering template content:

### Path 1: `renderContent` (snippets, conditionals, each content)

```
evaluateSnippet / evaluateConditional / evaluateEach
  -> this.renderContent({ ast, data, key })
    -> LitRenderer subtree cache (WeakRef-based)
    -> cachedRender(data): returns SAME this.litTemplate
    -> bumpDataVersion(): signals update in-place via reactiveData directives
```

**Key property:** `cachedRender()` returns the **same** `TemplateResult` object. Lit's diff algorithm sees the same template identity and patches only changed expression bindings. DOM nodes are preserved. Focus is preserved.

### Path 2: `renderTemplate` (subtemplates via `{>templateName}`)

```
evaluateSubTemplate
  -> renderTemplate directive (AsyncDirective)
    -> maybeCreateTemplate(): template.clone() -> NEW Template instance
    -> Template.render(): creates NEW TemplateResult
    -> setValue(html): lit replaces entire DOM range
```

**Key property:** Every reactive update creates a **new** `Template` clone and a **new** `TemplateResult`. Lit sees a different template and replaces the entire DOM. All DOM state is destroyed.

---

## Root Cause Analysis

### The `maybeCreateTemplate` problem

In `render-template.js:82-112`, `maybeCreateTemplate()` is called:
1. On initial render (line 29)
2. On **every** reaction re-run (line 40)

It always calls `template.clone()` with no guard:

```js
maybeCreateTemplate() {
    const templateOrName = this.getTemplate();
    // ...find template...
    this.template = template.clone({  // ALWAYS clones, never reuses
      templateName,
      subTemplates: this.subTemplates,
      data: this.unpackData(this.data),
    });
}
```

There is no check like "if I already have a template from the same definition, reuse it." Every call creates a fresh Template with a fresh LitRenderer, which means `rendered = false`, which means `render()` creates a new `TemplateResult`.

### The `setDataContext` -> `rendered = false` cascade

In `renderTemplate()` (line 73-79):
```js
renderTemplate(dataContext) {
    this.attachTemplate();
    this.template.setDataContext(dataContext);  // sets rendered = false
    return this.template.render();              // renders fresh TemplateResult
}
```

`setDataContext` (template.js:129-134) sets `this.rendered = false`, which forces `Template.render()` to call `this.renderer.render()` (a full AST walk producing a new TemplateResult) instead of returning the cached html.

### Why the snapshot optimization doesn't fully help

The each directive's item snapshot optimization (`reactive-each.js:114`) DOES prevent unchanged items from re-rendering. So in the test, toggling item `a` returns `noChange` for items `b` and `c`, correctly preserving their DOM.

**However**, there's a second update path: the `renderTemplate` directive has its own reaction (`watchChanges`, line 38-70). The data expressions are packed as functions that read `dataVersion`. When the each re-renders item `a`'s cached subtree via `cachedRender(data)`, it bumps `dataVersion`. This triggers ALL `renderTemplate` reactions in ALL items (because they all read from packed data functions that ultimately read the same renderer's `dataVersion`).

So even though the each directive correctly skips item `b`, the `renderTemplate` directive INSIDE item `b` may still fire its own reaction if the `dataVersion` signal propagates.

Wait -- actually, each item gets its own cached subtree (keyed by `eachKey`), each with its own `LitRenderer` and its own `dataVersion` signal. So the `dataVersion` bump for item `a`'s subtree should NOT affect item `b`'s subtree. The snapshot optimization is the correct protection layer here.

**The real concern is when an item DOES change**: item `a`'s subtemplate gets fully destroyed and recreated. If focus were on item `a`'s input, it would be lost. This is the fundamental difference from how snippets work.

---

## Is the Two-Path Architecture Right?

### Why subtemplates are different from snippets

**Snippets** are AST fragments that share the parent's rendering context. They're essentially inlined content -- same LitRenderer, same data context, same `dataVersion` signal. `renderContent` with the subtree cache gives them DOM stability for free.

**Subtemplates** are independent `Template` instances with their own:
- State (via `createComponent`)
- Event handlers
- Lifecycle hooks (`onCreated`, `onDestroyed`, etc.)
- CSS stylesheets
- LitRenderer instance

This independence is the reason subtemplates go through `renderTemplate` instead of `renderContent`. A snippet is a "view fragment"; a subtemplate is a "component instance."

### The design tension

The current architecture gives subtemplates **strong encapsulation** at the cost of **DOM stability**. Every data change to a subtemplate destroys and recreates the entire component instance, which is the nuclear option.

Compare with how frameworks like Svelte or React handle this:
- React components re-render by calling the render function and diffing the virtual DOM. Component identity is preserved.
- Svelte compiles reactive updates to surgical DOM mutations. Component instances persist.

In this framework, the Template `clone()` -> `render()` path is more like unmounting and remounting a React component. The Template instance, its state, its event bindings -- all get recreated.

### Should subtemplates benefit from the same caching?

**No, not the same mechanism.** `renderContent`'s subtree cache works because snippets are stateless AST fragments. A snippet doesn't have its own state or lifecycle. You can safely reuse its LitRenderer and just update the data.

A subtemplate HAS state. If you cached the Template instance and reused it across data changes, you'd need to:
1. Update its data context without destroying it
2. Re-render its LitRenderer (ideally via `cachedRender`, not `render`)
3. Preserve its event bindings and lifecycle

### The fix should be in `renderTemplate` itself

The directive should **reuse the existing Template instance** when only data changes. Specifically:

1. `maybeCreateTemplate()` should check if the template definition (by id or AST) is the same as the current one. If so, skip the clone.
2. On reactive updates, instead of creating a new Template, update the existing one's data and use `cachedRender`-style rendering (return the same TemplateResult, let `dataVersion` bumps handle expression updates).

Here's the conceptual fix for `render-template.js`:

```js
maybeCreateTemplate() {
    const templateOrName = this.getTemplate();
    // ...resolve template...

    // Guard: reuse existing template if same definition
    if (this.template && this.templateID === template.id) {
        return; // template definition hasn't changed, reuse existing instance
    }

    // Only clone when template definition actually changes
    if (this.template) {
        this.template.onDestroyed(); // clean up old instance
    }
    this.templateID = template.id;
    this.template = template.clone({
        templateName,
        subTemplates: this.subTemplates,
        data: this.unpackData(this.data),
    });
}
```

And the reactive update path should update data without re-rendering:

```js
watchChanges() {
    this.reaction = Reaction.create((reaction) => {
        this.maybeCreateTemplate();
        const dataContext = this.unpackData(this.data);

        if (reaction.firstRun || !this.isConnected) {
            // ...existing guards...
            return;
        }

        // Update data on existing template's renderer (like cachedRender does)
        this.template.renderer.setData({
            ...this.template.getDataContext(),
            ...dataContext,
        });
        this.template.renderer.bumpDataVersion();

        // Return the SAME litTemplate -- DOM is patched in-place
        this.setValue(this.template.renderer.litTemplate);
    });
}
```

This way:
- Template instance persists across data changes (state preserved, events preserved)
- LitRenderer reuses the same TemplateResult (DOM preserved, focus preserved)
- Only when the template DEFINITION changes (e.g., dynamic `{>getTemplate}`) does the clone happen

---

## Summary

| Aspect | renderContent (snippets) | renderTemplate (subtemplates) |
|--------|------------------------|------------------------------|
| Subtree cache | Yes (WeakRef-based) | No |
| Reuses TemplateResult | Yes (cachedRender) | No (always fresh render) |
| DOM preserved on data change | Yes | No -- destroyed and recreated |
| Has own state/lifecycle | No | Yes |
| Focus preserved | Yes | No |

**The two-path architecture is fundamentally correct** -- subtemplates need their own Template instance because they have state, events, and lifecycle. But the update mechanism within `renderTemplate` is too aggressive. It destroys what it should preserve.

The fix is not to merge the two paths, but to make `renderTemplate` smarter about reuse: preserve the Template instance when only data changes, and use the existing renderer's cached template for DOM stability.

### Immediate action items

1. **Fix test:** Add `waitForUpdate` helper to the test file (or replace with `flush`)
2. **Fix `maybeCreateTemplate`:** Guard against re-cloning when template definition hasn't changed
3. **Fix reactive update path:** Update data on existing Template/LitRenderer instead of creating new ones
4. **Validate:** The todo-list example (`docs/src/examples/framework/todo-list/`) uses exactly this pattern -- `{#each todo in getVisibleTodos}{>todoItem todo=todo}{/each}` -- and would benefit from this fix

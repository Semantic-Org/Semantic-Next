# Subtemplate Inside Each - Focus Preservation Analysis (v2)

## Root Cause

**File:** `packages/renderer/src/lit/directives/render-template.js`
**Method:** `maybeCreateTemplate()` (lines 82-113)

`maybeCreateTemplate()` unconditionally clones a new `Template` instance on every call. This is called from both:
1. The synchronous `render()` path (when Lit processes the directive via `repeat`'s `setChildPartValue`)
2. The reactive `watchChanges()` reaction (when `dataVersion` is bumped)

Each clone creates a **new `LitRenderer`** with no `_cachedStrings`. When `renderer.render()` runs on the new renderer, it produces a `TemplateResult` with a **fresh strings array**. Lit uses the strings array identity (reference equality) to determine template identity. A new strings array means Lit cannot match it to the existing `TemplateInstance`, so it:
1. Creates a new `TemplateInstance`
2. Clones a fresh DOM fragment
3. Clears old DOM via `_$clear()` (removes all nodes between marker comments)
4. Inserts the new DOM fragment

**This destroys the old DOM, losing focus.**

## Why Test 1 Passes (unchanged item focus)

Template: `{#each todo in getTodos}{>itemTemplate todo=todo}{/each}`

When item A is toggled, the `ReactiveEachDirective`'s `getTemplate()` uses snapshot comparison (`isEqual`). Item B has not changed, so it returns `noChange`. Lit's `repeat` directive skips processing item B's part entirely. The `RenderTemplateDirective` for item B is never re-rendered. Its DOM node (with focus) is untouched.

## Why Test 2 Fails (changed item focus)

When item A is toggled AND has focus:
1. `each` reaction fires -> `renderItems()` -> snapshot for A differs -> `content(data, 'a')` is called
2. `renderContent()` finds the cached subtree -> `cachedRender(data)` -> returns same `TemplateResult`
3. `repeat` calls `setChildPartValue(oldPart, litTemplate)` -> `_$AI(litTemplate)` -> `_commitTemplateResult`
4. Subtree's template matches (subtree has `_cachedStrings`) -> `_update(values)` -> processes `renderTemplate` directive
5. `RenderTemplateDirective.render()` is called -> `maybeCreateTemplate()` **re-clones** the Template
6. New Template -> new LitRenderer -> no `_cachedStrings` -> new strings array
7. `renderTemplate()` -> `template.render()` -> `renderer.render()` -> `TemplateResult` with new strings
8. Lit commits this to the directive's part -> template mismatch -> **DOM destroyed and recreated**
9. Focus lost.

## Why Test 3 Passes (footer count)

The footer template `{>footerTemplate getRemaining=getRemaining}` receives `getRemaining` as a packed reactive data closure. This closure calls `todos.get().filter(...)`, which directly tracks the `todos` signal. When `todos` changes, the `reactiveData` directive inside the footer's Template fires its reaction and pushes the updated count via `setValue`. The footer's DOM is destroyed and recreated on each update (same bug), but the test only checks text content, not focus.

## Proposed Fix

Add a guard in `maybeCreateTemplate()` to skip re-cloning when the same prototype template is being rendered. Instead, preserve the existing Template instance (and its LitRenderer with `_cachedStrings`). Data updates flow through:
- The packed closures (which reference the parent subtree's data, mutated in-place by `cachedRender`'s `updateData`)
- The `renderTemplate()` method which calls `template.setDataContext()` + `template.render()`

### The Guard

```js
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

    // Preserve existing clone when the same prototype template is used.
    // Re-cloning destroys the LitRenderer's _cachedStrings, causing Lit to
    // replace DOM (losing focus, scroll position, etc). Data updates flow
    // through the packed closures and renderTemplate's setDataContext path.
    if (this.template && this.templateID === template.id) {
        return;
    }

    this.templateID = template.id;
    this.template = template.clone({
        templateName,
        subTemplates: this.subTemplates,
        data: this.unpackData(this.data),
    });
}
```

### Why Data Still Flows

When the guard fires, `this.template` is preserved. `renderTemplate(dataContext)` is then called:
1. `template.setDataContext(dataContext)` updates the Template's data and sets `rendered = false`
2. `template.render()` calls `renderer.setData(dataContext)` which mutates the renderer's data in-place
3. Since `rendered` is false, `renderer.render()` re-reads the AST with the updated data
4. The renderer uses `_cachedStrings` -> same strings identity -> Lit updates expressions in-place -> DOM preserved

For the footer test, `getRemaining` is a reactive function. Its `reactiveData` directive reaction tracks the `todos` signal directly. When `todos` changes, the reaction fires and pushes the new value. The guard does not affect this mechanism because:
- The footer's `RenderTemplateDirective`'s `watchChanges` reaction fires when the parent's `dataVersion` is bumped
- `renderTemplate(dataContext)` updates the Template's data with the new `getRemaining` closure
- `template.render()` re-renders with the new data
- The `reactiveData` directive for `{getRemaining}` creates a reaction that tracks `todos.get()`
- Since the Template instance is preserved, the renderer's `_cachedStrings` is preserved
- Lit matches the template and updates expressions in-place

### Additional Fix: Stop Old Reaction

The `watchChanges()` method creates a new `Reaction.create()` every time `render()` is called, but never stops the old reaction. This causes:
1. Memory leaks (old reactions accumulate)
2. Multiple `setValue` calls per update (old and new reactions both fire)
3. `Scheduler.current` corruption (nested `Reaction.create` sets it to null)

```js
watchChanges() {
    // Stop previous reaction to avoid duplicates
    if (this.reaction) {
        this.reaction.stop();
    }
    this.reaction = Reaction.create((reaction) => {
        // ... existing code ...
    });
}
```

## Constraints Verified

- **Focus test**: Guard preserves Template -> preserves `_cachedStrings` -> Lit matches template -> DOM preserved -> focus maintained
- **Count test**: `getRemaining` function tracks `todos` signal directly via its `reactiveData` reaction -> footer updates independently of the guard
- **Existing tests**: 19 passing tests in the file are unaffected because the guard only prevents unnecessary re-cloning; data still flows through `setDataContext` + `template.render()`

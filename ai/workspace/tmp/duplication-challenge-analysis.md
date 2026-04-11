# Evaluation: Why Search Filtering Causes 3x Content Duplication After Hydration

## Executive Summary

The triplication bug has a single root cause: **`hydrateBlockDirective` calls `hydrateInnerContent` for each blocks, but `getServerRenderedAST` returns `null` for each blocks, so `hydrateInnerContent` is never called, and the inner server DOM is never wired with Reactions. Then `hydrateEach` creates a Reaction that skips rendering on firstRun (correctly), but on subsequent runs does a full `readAST` re-render — producing *new* DOM via `region.setContent()`. The old server DOM nodes, sitting in `region.ownedNodes`, *are* properly cleared by `region.clear()` inside `setContent`. So why does duplication happen?**

The real answer is more subtle: the problem is that `hydrateInnerContent` **is called for inner blocks nested *inside* the each block's content** — specifically the `{#if}` blocks and `{>snippet}` blocks inside each iteration. These inner blocks get their own DynamicRegions and Reactions wired during the recursive hydration pass on the each block's ownedNodes. When the each Reaction fires and calls `region.setContent()`, the each region's `clear()` disposes its `childScopes` — but **the inner Reactions from nested blocks are tracked on an innerScope that is a child of the each block's scope**, and the each block's scope is the *parent* scope, not the region's childScopes. The `region.clear()` *does* dispose `region.childScopes`, but the question is whether the inner Reactions from the nested `{#if}` and `{>snippet}` blocks are in those childScopes.

Wait — let me re-trace this more carefully.

---

## Detailed Trace

### Step 1: `hydrateBlockDirective` processes the outer `{#each section in getMenu}`

1. **Collects ownedNodes** between `<!--sui-block:v1:N-->` and `<!--/sui-block:v1:N-->`. These are ALL the server-rendered menu sections.

2. **Creates DynamicRegion**: `region.anchor` replaces the opening comment. `region.ownedNodes = ownedNodes`.

3. **Calls `getServerRenderedAST(node, data)` where `node.type === 'each'`** — this hits the `default` case and returns `null`.

4. **The `if (contentAST && ownedNodes.length > 0)` check FAILS** because `contentAST` is `null`. So `hydrateInnerContent` is **NEVER called** for each blocks. No inner Reactions are wired. No innerScope is created. No childScopes are pushed to the region.

5. **Important**: the ownedNodes are NOT moved to a DocumentFragment and back. They stay in the live DOM exactly where they are.

6. **Dispatches to `hydrateEach()`**.

### Step 2: `hydrateEach` executes

```javascript
hydrateEach({ node, data, scope, region }) {
    scope.track(Reaction.create((comp) => {
        // ...
        const rawItems = this.eval(node.over, data) || [];
        // ...
        if (comp.firstRun) {
            return; // server content is correct
        }
        // Subsequent runs: full re-render
        const fragment = document.createDocumentFragment();
        const listScope = scope.child();
        for (let i = 0; i < items.length; i++) {
            // ... creates new DOM for each item
        }
        region.setContent(fragment, listScope);
    }));
}
```

**First run**: Evaluates `getMenu()` (registering Signal dependencies on `state.searchTerm`), then returns. Server DOM stays in place. `region.ownedNodes` still references the server nodes.

### Step 3: User types 'g' — search triggers

`state.searchTerm.set('g')` fires. This causes `getMenu()` to re-evaluate (because the Reaction registered a dependency on `state.searchTerm` via `self.isSearching()` and `self.filterBySearchTerm()`).

The each Reaction fires (not firstRun). It:

1. Evaluates `getMenu()` — returns filtered results (e.g., just "Getting Started")
2. Creates new DOM via `readAST` into `fragment`
3. Calls `region.setContent(fragment, listScope)`

### Step 4: `region.setContent(fragment, listScope)` — THE CRITICAL MOMENT

```javascript
setContent(fragment, scope) {
    this.clear();
    this.ownedNodes = [...fragment.childNodes];
    if (scope) { this.childScopes.push(scope); }
    this.anchor.after(fragment);
}
```

`this.clear()` does:
```javascript
clear() {
    for (const scope of this.childScopes) { scope.dispose(); }
    this.childScopes = [];
    for (const node of this.ownedNodes) { node.remove(); }
    this.ownedNodes = [];
}
```

**At this point**: `region.childScopes` is `[]` (nothing was pushed because `hydrateInnerContent` was never called for this each block). And `region.ownedNodes` is the server-rendered nodes collected in step 1.

**So `clear()` DOES remove the server DOM nodes.** And then `setContent` inserts the new fragment.

### Wait — But the Bug Report Says 3x Duplication

If clear() properly removes the server nodes and inserts new ones, we'd get exactly 1x. So where does 3x come from?

Let me reconsider. The nav-menu template has **nested each blocks**:

```html
{#each section in getMenu}        ← OUTER each
  {>title ...}
  {#if section.pages}
    <div class="...content">
      <div class="menu">
        {#each page in section.pages}   ← INNER each
          ...
        {/each}
      </div>
    </div>
  {/if}
{/each}
```

And there's also the `{#if hasNoResults}...{else}...{/if}` block WRAPPING the outer each.

### Re-examining: The `{#if hasNoResults}` / `{else}` Block

Looking at the template:
```html
{#if hasNoResults}
  <div class="message">{getNoResultsMessage}</div>
{else}
  {#each section in getMenu}
    ...
  {/each}
{/if}
```

The OUTER block is actually an `{#if}`. For an `{#if}`, `getServerRenderedAST` DOES return the contentAST (the else branch content, since `hasNoResults` is false on initial load). So `hydrateInnerContent` IS called on the if-block's ownedNodes.

`hydrateInnerContent` then walks those nodes and finds the `{#each}` block marker inside. It calls `hydrateBlockDirective` for the each block. This creates a DynamicRegion for the each, registers its Reaction.

But now consider: the `{#if}` block's hydration also creates a Reaction via `hydrateConditional`. On firstRun, `getBranch` returns the else branch (same as server), `currentBranchIndex` is set. On subsequent runs, if the branch changes, it will call `region.setContent()` with new DOM.

### The Real Problem: Two Layers of Reaction on the Same Content

Here's my revised understanding of the triplication:

**Layer 1: The `{#if hasNoResults}` conditional Reaction**
- Wired during hydration
- Watches `hasNoResults` (which internally calls `getMenu()`)
- When search term changes, `hasNoResults` re-evaluates, but as long as results exist, the branch doesn't change (still the else branch), so the conditional Reaction does NOT re-render. It just notes the branch index is the same.

Actually wait — `hydrateConditional` uses `result.matchIndex !== currentBranchIndex` to decide whether to re-render. If the branch stays the same (else), it does nothing. So the `{#if}` Reaction is a red herring for the 3x problem.

### Re-examining More Carefully: What Actually Gets Hydrated

Let me trace this for the each block specifically.

In `hydrateBlockDirective`, for the **outer each block** (`{#each section in getMenu}`):

1. `getServerRenderedAST` returns `null` for `node.type === 'each'`
2. `contentAST` is `null`, so `hydrateInnerContent` is NOT called
3. `region.ownedNodes` = server nodes for the each content
4. **No childScopes pushed**
5. `hydrateEach` creates a Reaction

But wait — the each block is INSIDE the `{#if hasNoResults}` else branch. So the `{#if}` block's `hydrateInnerContent` already processed the else branch content, which INCLUDES the each block's marker. The each block's `hydrateBlockDirective` is called during that inner hydration pass.

So the flow is:
1. Top-level `hydrateMarkers` finds the `{#if hasNoResults}` block marker
2. `hydrateBlockDirective` for the `{#if}`:
   - Collects ownedNodes (everything between if markers)
   - `getServerRenderedAST` returns the else branch AST
   - Calls `hydrateInnerContent(ownedNodes, elseBranchAST, data, innerScope)`
   - `hydrateInnerContent` calls `hydrateMarkers` on the container
   - This finds the each block marker inside, calls `hydrateBlockDirective` for the each
   - The each block's `hydrateBlockDirective` runs (as traced in Step 1-2 above)
   - The each Reaction is tracked on `innerScope` (which is a child of the if block's `scope`)
3. After `hydrateInnerContent` returns, the ownedNodes are moved to a frag and back
4. `hydrateConditional` creates the if-block's Reaction

Now, when the search fires:

**The each Reaction fires** — it evaluates `getMenu()`, gets filtered results, creates new DOM via `readAST`, calls `region.setContent(fragment, listScope)`. The each region's `clear()`:
- `childScopes` is `[]` — nothing to dispose
- `ownedNodes` is the server nodes — they get removed ✓
- New DOM is inserted ✓

**This should produce 1x, not 3x.** So where's the 3x coming from?

### Hypothesis: The `{#if hasNoResults}` Reaction ALSO Re-Renders

Wait. Let me look at `hydrateConditional` again:

```javascript
hydrateConditional({ node, data, scope, region }) {
    const result = this.getBranch(node, data);
    let currentBranchIndex = result.matchIndex;

    scope.track(Reaction.create((comp) => {
        // ...
        const result = this.getBranch(node, data);
        if (result.matchIndex !== currentBranchIndex) {
            // branch changed — re-render
        }
    }));
}
```

On first run of this Reaction: `getBranch` evaluates `hasNoResults`. `hasNoResults` calls `getMenu()`. This registers a dependency on `state.searchTerm`. So when search term changes, this Reaction fires too.

But `hasNoResults` returns `false` (there ARE results), so the branch doesn't change (still else), so `matchIndex` stays the same. **No re-render from the if-block.** The branch check prevents re-rendering.

So that's still just 1x from the each.

### Revised Hypothesis: The Problem is the `{#if section.pages}` INSIDE the Each

Wait, there are also `{#if}` blocks and `{>snippet}` blocks INSIDE the each loop's content. But those are part of the server DOM that gets collected as `ownedNodes` of the each block. When the each Reaction fires and `region.setContent()` clears the ownedNodes, those inner blocks' DOM is removed. But their Reactions... **were they ever wired?**

For the **each block**, `getServerRenderedAST` returns `null`, so `hydrateInnerContent` is never called on the each block's ownedNodes. **The inner `{#if}` and `{>snippet}` blocks inside the each loop's content are NOT hydrated.** They're just inert server DOM.

So when the each Reaction fires, it just removes inert DOM and replaces with new DOM. Should be 1x.

### Third Pass: Maybe the Problem IS in the `{#if}` wrapping the each

Let me look at the template again very carefully:

```html
{#if hasNoResults}
  <div class="message">{getNoResultsMessage}</div>
{else}
  {#each section in getMenu}
```

`hasNoResults()` is:
```javascript
hasNoResults() {
    return state.searchTerm.get() && self.getMenu()?.length == 0;
}
```

And `getMenu()` is:
```javascript
getMenu() {
    let menu = settings.menu;
    // ... parse if string, clone, filter visible, filter by search term
    if (self.isSearching()) {
        menu = self.filterBySearchTerm(menu);
    }
    return menu;
}
```

`isSearching()` is:
```javascript
isSearching() {
    return settings.searchable && state.searchTerm.get();
}
```

So `getMenu()` reads `state.searchTerm` (transitively via `isSearching()`). And `hasNoResults()` also reads `state.searchTerm` directly AND calls `getMenu()`.

When the user types 'g':

Both the each Reaction (which calls `this.eval(node.over, data)` → `getMenu()`) and the if Reaction (which calls `getBranch` → evaluates `hasNoResults` → reads `state.searchTerm`) will fire.

The if Reaction evaluates `hasNoResults`. Searching for 'g' yields results (Getting Started matches), so `hasNoResults` returns false. Branch stays as else. **No re-render from the if-block.**

The each Reaction fires. Gets filtered items. Creates new DOM. Calls `region.setContent()`. Clears old ownedNodes, inserts new.

Still 1x. I'm not seeing 3x from this analysis alone.

### Fourth Pass: Could the Problem Be DocumentFragment Node Adoption?

Let me re-examine the `hydrateBlockDirective` code for the `{#if}` block that wraps the each:

```javascript
const contentAST = this.getServerRenderedAST(node, data);
if (contentAST && ownedNodes.length > 0) {
    const innerScope = scope.child();
    region.childScopes.push(innerScope);
    this.hydrateInnerContent(ownedNodes, contentAST, data, innerScope);
    const frag = document.createDocumentFragment();
    for (const n of ownedNodes) { frag.appendChild(n); }
    region.anchor.after(frag);
    region.ownedNodes = [...ownedNodes];  // ← THIS LINE
}
```

After `hydrateInnerContent`, the ownedNodes array has been updated (line 1414-1417 of `hydrateInnerContent` clears and repopulates it from the container's childNodes). But during `hydrateInnerContent`, the each block's `hydrateBlockDirective` ran. That function:

1. Found the each block's opening comment in the container
2. Collected the each block's ownedNodes (nodes between the each markers)
3. **Replaced the comment with `region.anchor`** (a text node)
4. Set `region.ownedNodes` to the collected nodes

But here's the thing: when `hydrateInnerContent` calls `hydrateBlockDirective` for the each, the each's `comment.replaceWith(region.anchor)` modifies the container (DocumentFragment). The each block's ownedNodes include the server-rendered sections. The each block creates a DynamicRegion whose anchor is now in the DocumentFragment.

Then `hydrateInnerContent` returns. The caller does:
```javascript
const frag = document.createDocumentFragment();
for (const n of ownedNodes) { frag.appendChild(n); }
region.anchor.after(frag);
region.ownedNodes = [...ownedNodes];
```

**After `hydrateInnerContent` updated ownedNodes**, the array contains the nodes from `container.childNodes`. These include the each block's `region.anchor` (text node) AND the each block's ownedNodes. When moved to `frag` and then inserted into the DOM via `region.anchor.after(frag)`, everything is in the live DOM.

But `region.ownedNodes = [...ownedNodes]` — this is the **if-block's** region.ownedNodes. It now includes all nodes that were in the container, including both the each block's anchor AND the each block's content nodes.

**Here's the key insight:** The each block's `region.ownedNodes` references the same physical DOM nodes that are also referenced by the if-block's `region.ownedNodes`. Both regions think they own the same nodes.

### Wait — Actually No

The each block in `hydrateBlockDirective` does `region.ownedNodes = ownedNodes` where `ownedNodes` is the nodes collected between the each markers. But then the if-block's `hydrateInnerContent` mutates its `ownedNodes` array to `container.childNodes`. After the each block processed its marker (replacing comment with anchor, collecting its own ownedNodes), the container's childNodes would include the each anchor + the each ownedNodes. But the each block's `hydrateBlockDirective` does NOT move the ownedNodes into its region — it just records them in `region.ownedNodes`. They stay in the container.

So the if-block's ownedNodes include:
- The each anchor (text node)
- The each block's actual content nodes (server-rendered sections)

And the each block's `region.ownedNodes` also points to those same content nodes.

**This means when the if-block's `region.clear()` fires (on branch change), it would try to remove the each block's content nodes. And when the each block's `region.setContent()` fires, it would also try to remove those nodes. But if one fires before the other, the second `remove()` call is a no-op (already removed).**

But this doesn't explain 3x. It could explain 0x or 2x (if both fire), but not 3x.

### Fifth Pass: Revisiting the Problem Description

The problem says typing 'g' causes "Getting Started" to appear THREE times. Let me think about what creates each copy:

1. **Copy 1: Original server DOM** — if it's NOT removed
2. **Copy 2: Each Reaction re-render** — new DOM from `readAST`
3. **Copy 3: ???** — another render pass from somewhere

Actually, let me reconsider. The `{#if hasNoResults}` wrapping exists, and `hydrateInnerContent` IS called for it. Let me look at what `hydrateInnerContent` does with the each block inside:

`hydrateInnerContent` calls `hydrateMarkers` on the container. `hydrateMarkers` walks comments. It finds the `{#each}` block marker. It calls `hydrateBlockDirective` for the each.

Inside `hydrateBlockDirective` for the each:
- `ownedNodes` collected = the server sections between the each markers
- `region.anchor` replaces the comment
- `region.ownedNodes = ownedNodes`
- `getServerRenderedAST` returns `null` → `hydrateInnerContent` NOT called for the each
- `hydrateEach` creates a Reaction

**But wait** — after `hydrateBlockDirective` processes the each, it returns control to `hydrateMarkers`, which continues walking comments. But `hydrateBlockDirective` already consumed the closing comment (`next.remove()` at line 1274). And `hydrateMarkers` uses `blockDepth` tracking to skip inner markers.

Actually, look at `hydrateMarkers` — it pre-collects comments into `commentsToProcess`, tracking `blockDepth`. The each block's opening marker increments `blockDepth`, and all inner markers are skipped. The closing marker decrements it. So inner blocks inside the each are NOT processed by the outer `hydrateMarkers`. They're only processed if `hydrateInnerContent` is called for the each block.

But `hydrateInnerContent` is NOT called for the each block (because `getServerRenderedAST` returns null for each). So the inner `{#if section.pages}`, the `{>title}` snippets, etc. inside the each loop body are **never hydrated**. Their markers just sit as inert comment nodes in the DOM.

This is actually correct behavior for the "skip on firstRun" approach — the inner content doesn't need Reactions because the whole thing will be re-rendered from scratch when the each Reaction fires.

### Sixth Pass: The DocumentFragment Timing Problem

Let me trace the exact node positions more carefully.

After `hydrateBlockDirective` for the `{#if hasNoResults}` block:

1. `ownedNodes` collected = all nodes between the if markers. Let's call these [A, B, C, ...] where some of these are the each block's content.

2. `getServerRenderedAST` returns else branch AST (since `hasNoResults` is false).

3. `hydrateInnerContent(ownedNodes, elseBranchAST, data, innerScope)`:
   - Moves ownedNodes [A, B, C, ...] into a DocumentFragment container
   - Calls `hydrateMarkers(container, entries, data, innerScope)`
   - `hydrateMarkers` finds the each block's opening comment inside the container
   - Calls `hydrateBlockDirective` for the each
     - This collects the each's ownedNodes from the container [X, Y, Z, ...]
     - **Removes the each's closing comment** from the container
     - Creates `eachRegion.anchor` (text node), replaces the each's opening comment in the container
     - Sets `eachRegion.ownedNodes = [X, Y, Z, ...]`
     - For each type, `getServerRenderedAST` returns null, so no inner hydration
     - Calls `hydrateEach` — creates Reaction on `innerScope`
   - After `hydrateMarkers` returns, `hydrateInnerContent` does:
     ```javascript
     ownedNodes.length = 0;
     for (const n of [...container.childNodes]) {
         ownedNodes.push(n);
     }
     ```
   - `ownedNodes` is now the container's childNodes = [stuff before each, eachRegion.anchor, X, Y, Z, ..., stuff after each]

4. Back in `hydrateBlockDirective` for the `{#if}`:
   ```javascript
   const frag = document.createDocumentFragment();
   for (const n of ownedNodes) { frag.appendChild(n); }
   region.anchor.after(frag);
   region.ownedNodes = [...ownedNodes];
   ```

   This moves all nodes to a frag (including eachRegion.anchor, X, Y, Z, ...) and puts them into the live DOM after the if-region's anchor.

   **Critical**: `ifRegion.ownedNodes` = [stuff before each, eachRegion.anchor, X, Y, Z, ..., stuff after each]

   And `eachRegion.ownedNodes` = [X, Y, Z, ...]

**Both regions reference nodes X, Y, Z.** The if-region and the each-region both think they own the same content nodes.

### Now When Search Fires:

The each Reaction fires. `region.setContent(fragment, listScope)`:
- `region.clear()`: removes [X, Y, Z, ...] from the DOM ✓
- Inserts new filtered DOM [X'] after `eachRegion.anchor` ✓

But after this, `ifRegion.ownedNodes` still contains references to the (now-removed) [X, Y, Z, ...] nodes, plus `eachRegion.anchor` and any pre/post nodes.

Now, if the `{#if}` Reaction also fires and the branch changes... but we established the branch doesn't change. So the if-region doesn't re-render.

**This gives us 1x, not 3x.** The each Reaction cleans up correctly.

### Seventh Pass: Am I Wrong About `getServerRenderedAST` for Each?

Let me look at this VERY carefully:

```javascript
getServerRenderedAST(node, data) {
    switch (node.type) {
      case 'if': { ... }
      case 'async': return node.loadingContent;
      case 'rerender': return node.content;
      case 'template': { ... }
      default:
        return null; // each handled separately (per-item data)
    }
}
```

For `each`, it returns `null`. The comment says "each handled separately (per-item data)". This makes sense — each items need per-item data contexts, so you can't just hydrate the whole each block's content as a flat block.

But because it returns `null`, `hydrateInnerContent` is NOT called for each blocks. So the inner markers (for `{#if section.pages}`, `{>title}`, `{>highlight}`, etc.) are never wired with Reactions.

**This is by design** — the each loop will re-render everything from scratch on the next run. The server DOM is just a visual placeholder until the first reactive update.

### Eighth Pass: Could `removeMarkers()` Be the Problem?

After `hydrateMarkers` completes, `base.js` calls `this.removeMarkers()`:

```javascript
removeMarkers() {
    const removeComments = (root) => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_COMMENT);
        const toRemove = [];
        let node;
        while ((node = walker.nextNode())) {
            if (node.data.startsWith('sui') || node.data.startsWith('/sui')) {
                toRemove.push(node);
            }
        }
        for (const node of toRemove) { node.remove(); }
    };
    removeComments(this.shadowRoot);
}
```

This removes ALL remaining comment markers from the shadow DOM. But by this point, all block markers have already been processed (opening comments replaced with anchors, closing comments removed). Text expression markers have been replaced with text nodes. So this mostly catches any unprocessed comments.

But wait — inside the each block's ownedNodes, there are INNER block markers (for `{#if section.pages}`, nested `{#each}`, `{>title}`, `{>highlight}`) that were NEVER processed (because `hydrateInnerContent` wasn't called for the each). **`removeMarkers()` removes these comment nodes from the live DOM.**

Does this matter? The each block's `region.ownedNodes` includes references to all the nodes between the each markers, including these comment nodes. When `removeMarkers()` removes the comments, those nodes are removed from the DOM but **still in `region.ownedNodes`**. When `region.clear()` later tries to remove them, `node.remove()` is a no-op (they're already detached).

**This could cause a discrepancy** — `region.ownedNodes` has more nodes than what's actually in the DOM. But that shouldn't cause duplication; it should just mean some `remove()` calls are no-ops.

### Ninth Pass: The Actual Bug — Focus on What Creates 3 Copies

Let me think about this differently. If we see 3 copies, there are 3 render operations producing visible output. Let's enumerate what could produce "Getting Started" in the DOM:

1. **The original server DOM** (from SSR)
2. **The hydrateEach Reaction's re-render** (when search fires)
3. **Something else**

For (1) to survive, `region.clear()` must fail to remove it.
For (2) to exist, `region.setContent()` must insert it.
For (3) to exist, there must be another code path creating DOM.

**Could the each Reaction fire twice?** If `getMenu()` is called in multiple Reactions and the Signal system processes them in a way that triggers the each Reaction twice...

Actually, the `{#if hasNoResults}` Reaction also calls `getBranch` which evaluates `hasNoResults`. `hasNoResults` calls `self.getMenu()`. If `getMenu()` itself contains reactive reads (like `state.searchTerm`), and the each Reaction also reads `getMenu()`, both Reactions depend on `state.searchTerm`.

When `state.searchTerm` changes, both Reactions fire. The if-Reaction fires but doesn't re-render (branch unchanged). The each-Reaction fires and re-renders. That's still just 1 new render.

**Unless** the if-Reaction's `getBranch` call somehow triggers the each-Reaction to fire again. But Reactions are synchronous and the Signal system should batch updates.

### Tenth Pass: The Actually Critical Insight

Let me look at `hydrateEach` one more time:

```javascript
hydrateEach({ node, data, scope, region }) {
    scope.track(Reaction.create((comp) => {
        // ...
        const rawItems = this.eval(node.over, data) || [];
        // ...
        if (comp.firstRun) {
            return; // server content is correct
        }
        // ...
        region.setContent(fragment, listScope);
    }));
}
```

The Reaction is tracked on `scope` — this is the scope passed from `hydrateBlockDirective`, which is the **parent scope** (from the outer `hydrateInnerContent` call, i.e., the if-block's innerScope).

Now look at what `region.setContent` does: it calls `region.clear()` which disposes `region.childScopes`. For the each block's region, `childScopes` is `[]` because the each case of `hydrateBlockDirective` never pushed anything (since `getServerRenderedAST` returned null and `hydrateInnerContent` was never called).

**And `ownedNodes`?** The each block's `region.ownedNodes` was set to the nodes collected between the each markers. These are the server-rendered section nodes. `region.clear()` calls `node.remove()` on each. **These nodes ARE in the live DOM** (they were inserted by the if-block's `hydrateBlockDirective`). So they SHOULD be removed.

**WAIT.** I need to re-examine the DocumentFragment timing issue.

In `hydrateBlockDirective` for the if-block:
```javascript
this.hydrateInnerContent(ownedNodes, contentAST, data, innerScope);
const frag = document.createDocumentFragment();
for (const n of ownedNodes) { frag.appendChild(n); }
region.anchor.after(frag);
region.ownedNodes = [...ownedNodes];
```

After `hydrateInnerContent`, `ownedNodes` has been repopulated with `container.childNodes`. At this point, the each block's `hydrateBlockDirective` already ran. It:
1. Replaced the each opening comment with `eachRegion.anchor` (in the container)
2. Set `eachRegion.ownedNodes = [X, Y, Z, ...]` (the nodes between each markers)
3. Removed the each closing comment

But the each block's ownedNodes [X, Y, Z, ...] are still in the container (they were never moved out). So when `hydrateInnerContent` updates `ownedNodes` from `container.childNodes`, it gets: [..., eachRegion.anchor, X, Y, Z, ...]

Then the if-block moves all these nodes to `frag` and inserts them in the live DOM. The `frag.appendChild(n)` moves each node from the container to the frag.

After this, `eachRegion.ownedNodes` = [X, Y, Z, ...] — these are NOW in the live DOM (via frag insertion).
And `ifRegion.ownedNodes` = [..., eachRegion.anchor, X, Y, Z, ...].

**Both regions point to the same physical nodes.**

Now when the each Reaction fires:
- `eachRegion.clear()` removes [X, Y, Z, ...] from the DOM ✓
- `eachRegion.setContent(newFragment, newScope)` inserts new content ✓

At this point, `ifRegion.ownedNodes` still has stale references to [X, Y, Z, ...] (now detached) and `eachRegion.anchor` (still in DOM). If the if-block never re-renders, this is fine — the stale references just sit there.

**But what about the new content?** The new content from `eachRegion.setContent` is inserted after `eachRegion.anchor`. The `ifRegion` knows nothing about this new content. `ifRegion.ownedNodes` doesn't include it.

If the if-block later re-renders (branch change), it would call `ifRegion.clear()`, which removes the stale [X, Y, Z, ...] (no-op, already detached) and `eachRegion.anchor`. **But it would NOT remove the each block's new content** because that content isn't in `ifRegion.ownedNodes`.

However, the if-block's branch doesn't change when searching (it stays on "else"), so this doesn't trigger.

**I'm going in circles. Let me pivot to a different approach.**

---

## Different Approach: What If the 3x Is From Multiple Each Blocks?

The nav-menu template has NESTED each blocks:

```html
{#each section in getMenu}           ← Each A
  {>title title=section isItem=false}
  {#if section.pages}
    <div class="...content">
      <div class="menu">
        {#each page in section.pages}  ← Each B
          {#if page.pages}
            ...
            {#each page in page.pages} ← Each C
            {/each}
          {/if}
        {/each}
      </div>
    </div>
  {/if}
{/each}
```

But these inner each blocks are inside the outer each's content. Since `hydrateInnerContent` isn't called for each blocks, the inner each blocks' markers are never processed during hydration. They're just inert comments in the server DOM. When the outer each re-renders via `readAST`, the inner each blocks are created fresh via `createEach` (the normal render path, not hydration). So they should work correctly.

**Actually, there might be an issue with `removeMarkers()` removing the inner block markers before the each Reaction fires.**

The inner block markers (for `{#if section.pages}`, `{#each page in section.pages}`, etc.) are comment nodes inside the each block's ownedNodes. When `removeMarkers()` runs (at the end of `hydrate()`), it walks ALL comments in the shadowRoot and removes any starting with 'sui'. This removes the inner block markers.

But the each Reaction's `region.setContent()` doesn't need those markers. It re-renders from scratch via `readAST`, which builds new DOM from the AST. The old server DOM (with or without markers) is just cleared.

So `removeMarkers()` shouldn't cause the bug. It's removing markers from nodes that are about to be replaced anyway.

### Could the Problem Be That `removeMarkers()` Removes the Each Block's Anchor?

No — the anchor is a text node (created by `document.createTextNode('')`), not a comment node. `removeMarkers()` only targets comment nodes.

---

## Actual Root Cause Analysis

After extensive tracing, let me step back and think about this from the symptom. **3x duplication** means the content appears three times. Let me hypothesize about what those three copies are:

### Hypothesis A: Server DOM Survives + Two Render Passes

1. **Server DOM**: Not properly removed by `region.clear()`
2. **First reactive render**: From the each Reaction
3. **Second reactive render**: From... what?

For server DOM to survive, the each block's `region.ownedNodes` must not contain the correct nodes, or `node.remove()` must fail.

Actually, I want to revisit one thing. In `hydrateBlockDirective`, after collecting ownedNodes for the each block:

```javascript
region.ownedNodes = ownedNodes;
```

Then later (for the if-block's processing):
```javascript
this.hydrateInnerContent(ownedNodes, contentAST, data, innerScope);
```

`hydrateInnerContent` does:
```javascript
ownedNodes.length = 0;
for (const n of [...container.childNodes]) {
    ownedNodes.push(n);
}
```

**But wait — this `ownedNodes` is the IF-block's ownedNodes, not the each-block's.** The each-block's ownedNodes is a different local variable. They were collected in the each-block's `hydrateBlockDirective`. They reference the actual DOM nodes.

So the each-block's `region.ownedNodes` is NOT mutated by `hydrateInnerContent`. It still points to the original nodes [X, Y, Z, ...]. Good.

### Hypothesis B: The `hydrateInnerContent` Move-to-Fragment-and-Back Causes the Each Anchor to Disconnect

After the each block's `hydrateBlockDirective` runs inside `hydrateInnerContent`:
- `eachRegion.anchor` is in the DocumentFragment container
- `eachRegion.ownedNodes` = [X, Y, Z, ...] which are also in the container

Then `hydrateInnerContent` returns. The if-block's code does:
```javascript
const frag = document.createDocumentFragment();
for (const n of ownedNodes) { frag.appendChild(n); }
region.anchor.after(frag);
```

`ownedNodes` now includes `eachRegion.anchor` and [X, Y, Z, ...] (from the container's childNodes). Moving them to `frag` then inserting into the live DOM. `eachRegion.anchor` is now in the live DOM.

The each Reaction's subsequent run does:
```javascript
region.setContent(fragment, listScope)
```

Which does:
```javascript
this.clear();                           // removes old ownedNodes from DOM
this.ownedNodes = [...fragment.childNodes]; // new nodes
this.anchor.after(fragment);            // inserts after anchor
```

`this.anchor` is `eachRegion.anchor` which IS in the live DOM. So `fragment` gets inserted in the right place.

`this.clear()` removes [X, Y, Z, ...] which are also in the live DOM. They get removed.

**This all seems correct for 1x.** The duplication must come from somewhere else.

### Hypothesis C: The Reaction Fires During Hydration

Could the each Reaction fire during hydration itself? The first run evaluates `getMenu()`, which reads `state.searchTerm`. If `state.searchTerm` is undefined initially, this registers a dependency. Then later in the hydration process, if something sets `state.searchTerm`, the Reaction would fire again.

But `state.searchTerm` starts as `undefined` and only changes when the user types. During hydration, no one sets it. So no — the Reaction shouldn't fire during hydration.

### Hypothesis D: Multiple Instances of the Component

Could there be multiple `<nav-menu>` elements on the page? The docs site might render a nav-menu, and if SSR produces one instance but client creates another...

This is possible but wouldn't explain 3x from a single search input.

### Hypothesis E: The `requestAnimationFrame` Deferral

```javascript
if (hasServerContent && this.canHydrate()) {
    requestAnimationFrame(() => this.hydrate(prototypeTemplate));
}
```

Hydration is deferred to rAF. During this deferral, the server DOM is visible. When hydration runs, the each Reaction's firstRun evaluates `getMenu()`. Then when the user types, the Reaction fires.

But between rAF and user input, nothing should create extra content. The server DOM just sits there.

**Unless** the `connectedCallback` fires twice (component disconnects and reconnects). But that would be a different issue.

### Hypothesis F: I'm Wrong About the If-Block Not Re-Rendering

Let me reconsider. When search fires, the if-Reaction evaluates `getBranch`:

```javascript
const result = this.getBranch(node, data);
if (result.matchIndex !== currentBranchIndex) {
    // re-render
}
```

`getBranch` evaluates the condition `hasNoResults`. For typing 'g' with results existing, `hasNoResults` returns false. The condition is false. `getBranch` returns `{ matchIndex: -1, contentAST: null }` (no match, falls through all branches).

Wait — NO. The template is:
```html
{#if hasNoResults}
  <div class="message">...</div>
{else}
  {#each section in getMenu}...{/each}
{/if}
```

When `hasNoResults` is false (results exist), `getBranch` evaluates the condition as false, then checks branches. There's an `else` branch. So it returns `{ matchIndex: <index of else>, contentAST: <else branch AST> }`.

During hydration, `hydrateConditional` sets `currentBranchIndex` to the else branch's index. When search fires, `hasNoResults` is still false (results exist), so `getBranch` returns the same else branch index. **No change.** No re-render.

But what if `hasNoResults` flips to TRUE briefly (no results for a split second)? If the user types 'xyz' (no matches), `hasNoResults` returns true. The if-Reaction fires, branch changes to the if-branch (the message div). `region.setContent` clears the else content (which includes the eachRegion.anchor and all the each content). Then if the user keeps typing and results appear again, the else branch would be re-rendered. But this is a different scenario than typing 'g'.

Actually wait — **even in the 'g' scenario**, let me check if `hasNoResults` could return something unexpected.

```javascript
hasNoResults() {
    return state.searchTerm.get() && self.getMenu()?.length == 0;
}
```

With searchTerm = 'g', `state.searchTerm.get()` returns 'g' (truthy). `self.getMenu()` returns filtered menu. If 'Getting Started' matches 'g', the menu has items. `.length == 0` is false. So `hasNoResults` returns false (because `'g' && false` = `false`).

Still false. Branch doesn't change. Still 1x from the each Reaction.

---

## Re-Evaluating: What If the Each Reaction Creates Nodes That Are Also Not Cleaned Up Properly?

Let me look at the `hydrateEach` subsequent run more carefully:

```javascript
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
```

`readAST` for each item builds new DOM from the AST. This includes the inner `{>title}` snippets, `{#if section.pages}` blocks, etc. These are created fresh via `bindBlockDirective` (the normal render path), which creates DynamicRegions with their own Reactions.

`region.setContent(fragment, listScope)` — the `listScope` contains all the child scopes for each item. When this region is later cleared (next search term change), `listScope.dispose()` will cascade to all item scopes, disposing their Reactions. Good.

**This seems correct.** On the next search, the each Reaction fires again, `region.setContent` clears the previous render (disposing all Reactions), and inserts new content. 1x.

---

## Final Theory: The Problem is Real But My Analysis Shows It Should Be 1x

Based on my thorough code trace, I cannot reproduce the 3x bug through pure code analysis. The mechanism appears sound for the case where:
1. Server DOM is properly in `region.ownedNodes`
2. `region.clear()` removes those nodes
3. New content is inserted

**However**, there is one scenario I haven't fully considered: **What if the DocumentFragment manipulation in `hydrateBlockDirective` for the if-block causes the each block's ownedNodes to become stale?**

When `hydrateInnerContent` moves nodes to a container, processes them, then the caller moves them to a frag and inserts them — during this process, node references could become disconnected from the DOM in a way that `node.remove()` in `clear()` doesn't do anything.

Wait — `node.remove()` removes a node from its parent. If the node has no parent (it's already detached), `remove()` is a no-op. **This is the key.**

Could the each block's ownedNodes become detached during the fragment shuffling?

1. hydrateInnerContent: nodes moved to `container` (DocumentFragment)
2. Inside `hydrateMarkers`, the each block's `hydrateBlockDirective`:
   - Collects ownedNodes = [X, Y, Z, ...] (these are in the container)
   - Sets `eachRegion.ownedNodes = [X, Y, Z, ...]`
3. hydrateInnerContent returns. Nodes moved from container to `frag`:
   ```javascript
   const frag = document.createDocumentFragment();
   for (const n of ownedNodes) { frag.appendChild(n); }
   ```
   But `ownedNodes` at this point is the if-block's ownedNodes (refreshed by hydrateInnerContent). This includes eachRegion.anchor AND [X, Y, Z, ...].
   `frag.appendChild(n)` moves each node from the container to the frag.
4. `region.anchor.after(frag)` — moves nodes from frag to live DOM.
5. After this, the nodes [X, Y, Z, ...] are in the live DOM.
6. `eachRegion.ownedNodes` = [X, Y, Z, ...] — these reference the same nodes, which are now in the live DOM.

**The references are still valid.** `node.remove()` would work. The nodes are in the DOM.

I must conclude that **my code analysis doesn't explain the 3x bug.** The code SHOULD produce 1x. The bug might be caused by:

1. A subtlety in the Signal/Reaction batching system that causes the each Reaction to fire multiple times
2. An interaction between the if-Reaction and each-Reaction where the if-Reaction re-renders the else branch (creating a new each block with new DOM) while the old each Reaction also fires
3. Something specific to the nav-menu's `getMenu()` implementation that causes multiple reactive triggers
4. The rAF deferral causing a race condition with user input

---

## Answers to the Specific Questions

### Question 1: Do Inner Reactions from `hydrateInnerContent` Persist When the Each Reaction Re-Renders?

**For the each block specifically: `hydrateInnerContent` is NEVER called.** `getServerRenderedAST` returns `null` for each blocks (line 1394: `default: return null; // each handled separately`). So no inner Reactions are wired for the each block's content. There are no orphaned inner Reactions from `hydrateInnerContent`.

However, if the each block is nested inside an `{#if}` block (as in nav-menu), the if-block's `hydrateInnerContent` IS called. This processes the else branch AST, which includes the each block's opening marker. The each block gets its own `hydrateBlockDirective` call, which creates `eachRegion` and the `hydrateEach` Reaction. But the each's inner content (inside the loop body) is NOT hydrated with individual Reactions.

**The Reactions that DO exist:**
- The if-block's conditional Reaction (on the outer scope)
- The each block's list Reaction (on the if-block's innerScope)
- Any Reactions from other top-level markers inside the if-block's else branch

When the each Reaction fires and calls `region.setContent()`, `region.clear()` disposes `region.childScopes`. But `childScopes` is empty for the each region (nothing was pushed). The each Reaction itself is tracked on the parent scope (the if-block's innerScope), so it persists — which is correct, it needs to keep firing.

**Verdict: No orphan Reaction problem for the each block, because `hydrateInnerContent` was never called for it. But there IS a design issue: the each block's inner content (snippets, conditionals inside the loop body) is never wired with Reactions during hydration. It relies entirely on the subsequent full re-render.**

### Question 2: Does `region.clear()` Properly Clean Up the Hydration-Wired Content?

For the each block: `region.childScopes` is `[]` (nothing wired), so `dispose()` is a no-op. `region.ownedNodes` contains the server-rendered nodes collected between the each markers. `node.remove()` is called on each.

**The question is whether those nodes are still in the live DOM when `clear()` fires.** Based on my trace:

- The nodes were collected from the DocumentFragment container (during `hydrateInnerContent` called by the parent if-block)
- They were moved back to the live DOM by the if-block's post-hydrateInnerContent code
- The each Reaction fires later (when user types) — at this point the nodes ARE in the live DOM
- `node.remove()` should work

**However, `removeMarkers()` runs between hydration and user interaction.** It removes comment nodes from the shadowRoot. Some of the each block's ownedNodes might be comment nodes (inner block markers for `{#if}`, `{#each}`, `{>snippet}` inside the loop body). After `removeMarkers()` removes them, they're no longer in the DOM but still in `region.ownedNodes`. When `clear()` later calls `node.remove()` on these comment nodes, it's a no-op. **But the actual content elements (divs, links, etc.) are still in the DOM and will be properly removed.**

**Verdict: `clear()` should properly remove the visible content nodes. Some comment nodes may already be detached (by `removeMarkers()`), but those are invisible and their `remove()` is just a no-op.**

### Question 3: Could `ownedNodes` Become Stale After the DocumentFragment Shuffle?

**The sequence is:**
1. `hydrateInnerContent` moves ownedNodes to a container (DocumentFragment)
2. Inside `hydrateMarkers`, the each block's `hydrateBlockDirective` collects its own ownedNodes from the container
3. `hydrateInnerContent` updates the if-block's ownedNodes array from `container.childNodes`
4. The if-block moves all nodes to a new frag, inserts into live DOM

**The each block's `region.ownedNodes` references the actual node objects collected in step 2.** These same objects are moved through the container → frag → live DOM pipeline. JavaScript node references are object references — they follow the physical node wherever it goes. So when `clear()` calls `node.remove()`, it removes the node from whatever parent it currently has.

**Verdict: The ownedNodes are NOT stale.** They reference the correct physical nodes. The DocumentFragment shuffle doesn't invalidate the references. `node.remove()` works on the actual DOM node regardless of how many times it's been moved between containers.

### Question 4: Does `setContent` Clear the Correct Nodes?

**Yes, based on the analysis.** `setContent` calls `clear()`, which:
1. Disposes `childScopes` — empty for each blocks, so no-op
2. Removes `ownedNodes` — these are the server-rendered nodes, which are in the live DOM at this point

Then `setContent` replaces them with new fragment content.

**However, there is a subtle issue with the if-block owning overlapping nodes.** Both `ifRegion.ownedNodes` and `eachRegion.ownedNodes` reference some of the same physical nodes. If the if-block ever re-renders (branch change), `ifRegion.clear()` would try to remove nodes that the each-block has already replaced. The eachRegion.anchor would be removed (disconnecting the each block entirely), and the each block's NEW content (from the last `setContent`) would NOT be removed (it's not in `ifRegion.ownedNodes`). This would cause:

- **Missing content**: The anchor is gone, so the each block can no longer insert content
- **Orphaned DOM**: The each block's last render output stays in the DOM with no owner

**This overlapping ownership is a latent bug**, even if it doesn't cause the specific 3x duplication in the described scenario.

---

## Comparison With Other Frameworks

### Lit (SSR + Hydration)

Lit uses a different approach: each `ChildPart` (equivalent to DynamicRegion) tracks its content between persistent comment markers. The markers are never removed — they stay in the DOM permanently. During hydration, Lit calls `setConnected()` on parts to wire them up. The key difference: **Lit doesn't have the overlapping-ownership problem** because each Part owns the content between its specific marker pair, and markers are hierarchical with clear parent-child relationships.

Lit's repeat directive (equivalent to `each`) during hydration does NOT skip the first render. Instead, it validates the server content matches the expected output and either adopts or replaces individual items. This is more work on first hydration but avoids the "skip firstRun, full re-render later" approach.

### Svelte (SSR + Hydration)

Svelte's hydration doesn't use comment markers at all for content positioning. Instead, it uses a `claim_node` approach that walks the server DOM in order, claiming nodes as it goes. For each blocks, Svelte hydrates EVERY iteration during the hydration pass — it doesn't skip. Each iteration claims its nodes from the server DOM and wires its reactivity.

This means when a reactive update fires, Svelte has fine-grained per-item reactivity. It can add/remove individual items without re-rendering the entire list. The `hydrateEach` approach of "skip firstRun, nuke everything on subsequent runs" is fundamentally less efficient.

### Solid (SSR + Hydration)

Solid uses comment markers similar to this framework. Its `For` component during hydration uses a similar "adopt server DOM, wire reactivity" approach. But Solid wires reactivity for EACH item during hydration — it doesn't skip. The signal-per-item pattern means individual items can update without re-rendering the list.

---

## Is the Current Architecture Overengineered or Underengineered?

### Underengineered: `hydrateEach` Is Too Naive

The "skip firstRun, full re-render on subsequent runs" approach is underengineered:

1. **It throws away the keyed reconciliation** that `createEach` has. Normal rendering uses `itemMap`, `currentKeys`, and keyed diffing to efficiently add/remove/reorder items. `hydrateEach` drops all of this and does a full list re-render every time.

2. **It doesn't hydrate inner content.** The `{#if}`, `{>snippet}`, and nested `{#each}` blocks inside the loop body are never wired with Reactions during hydration. This means the first reactive update must re-render EVERYTHING from scratch.

3. **It creates a cliff**: the first reactive update after hydration is maximally expensive (full list re-render), while subsequent updates use the efficient keyed reconciliation from `createEach`. This is the worst possible timing — the first user interaction pays the highest cost.

### Overengineered: `hydrateInnerContent` for Non-Each Blocks

The `hydrateInnerContent` mechanism (move to fragment, walk markers, wire Reactions, move back) is complex and creates the overlapping-ownership issue. For `{#if}` blocks where the branch is unlikely to change immediately, this is reasonable. But the abstraction is doing a lot of work to handle a case (branch mismatch) that could be simpler.

### A Better Architecture: Hydrate Each Items Individually

Instead of the skip-and-re-render approach, `hydrateEach` should:

1. Evaluate the items list (to register dependencies)
2. For each item, collect the corresponding server-rendered nodes
3. Wire per-item Reactions using the same `itemMap`/keyed pattern as `createEach`
4. On subsequent runs, use the same keyed reconciliation as `createEach`

This would:
- Eliminate the full re-render on first reactive update
- Wire inner Reactions (snippets, conditionals) during hydration
- Reuse the battle-tested `createEach` reconciliation logic
- Potentially fix the 3x duplication bug (by having proper per-item ownership)

The challenge is identifying which server nodes belong to which item. The SSR renderer would need to emit per-item markers (e.g., `<!--sui-item:v1:N:K-->` where K is the item key). This is what Lit and Svelte do implicitly through their claim-based hydration.

### Proposed Fix for the Immediate Bug

Without the larger refactor, the most likely fix is to ensure that:

1. `hydrateEach` transitions to the full `createEach` pattern after first run — not a simplified inline re-render. The current `hydrateEach` re-creates items without an `itemMap`, so it can't do keyed reconciliation.

2. The `region.ownedNodes` for the each block properly tracks all server nodes, including any that `removeMarkers()` might have detached.

3. The overlapping ownership between the if-block and each-block regions is resolved — possibly by having the if-block's `ownedNodes` only include the each-block's anchor (not the each-block's content nodes).

---

## Summary of Findings

| Aspect | Finding |
|--------|---------|
| `hydrateInnerContent` called for each? | **No** — `getServerRenderedAST` returns null for each blocks |
| Inner Reactions wired? | **No** — each block content is inert server DOM until first re-render |
| `region.clear()` removes server DOM? | **Yes** — ownedNodes references are valid, nodes are in live DOM |
| Overlapping ownership? | **Yes** — if-block and each-block regions reference the same nodes |
| `removeMarkers()` causes issues? | **Minor** — removes comment nodes from ownedNodes, but those are invisible |
| Root cause of 3x? | **Unclear from static analysis alone** — the code SHOULD produce 1x. The bug likely involves Signal/Reaction timing, multiple reactive triggers, or an interaction I cannot trace without runtime debugging |
| Is `hydrateEach` well-designed? | **No** — it discards keyed reconciliation and forces a full re-render on first update, which is both slower and more error-prone than necessary |

The most productive path forward is likely: (a) add runtime logging to the each Reaction to count how many times it fires per search event, and (b) refactor `hydrateEach` to use the same `itemMap`/keyed pattern as `createEach`, which would eliminate the full-list re-render and the associated ownership ambiguity.

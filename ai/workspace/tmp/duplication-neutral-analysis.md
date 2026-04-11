# Evaluation: Why search filtering causes 3x content duplication after hydration

## Source Files Analyzed

- `packages/renderer/src/engines/native/renderer.js` — hydrateBlockDirective, hydrateEach, hydrateInnerContent, createEach, hydrateMarkers
- `packages/renderer/src/engines/native/dynamic-region.js` — DynamicRegion class
- `packages/renderer/src/engines/native/reaction-scope.js` — ReactionScope class
- `packages/component/src/engines/native/base.js` — WebComponentBase.hydrate()
- `src/components/nav-menu/nav-menu.js` — getMenu(), filterBySearchTerm()
- `src/components/nav-menu/nav-menu.html` — template with nested each loops

---

## Question 1: Do inner Reactions from `hydrateInnerContent` persist after the each Reaction fires?

**Answer: Yes — they persist, and this is one root cause of the triplication.**

Here is the exact sequence:

1. `hydrateBlockDirective` (line 1248) processes the each block. It collects `ownedNodes` between the opening and closing comment markers (lines 1256-1281).

2. It creates a `DynamicRegion` and sets `region.ownedNodes = ownedNodes` (line 1287).

3. For the each block, `getServerRenderedAST` returns `null` (line 1394: `default: return null; // each handled separately`). This means the code at lines 1293-1301 is **not executed** for each blocks. The `contentAST` is `null`, so `hydrateInnerContent` is **never called** for the each block itself.

**Wait — this changes the analysis significantly.** Let me re-examine this carefully.

For `node.type === 'each'`, `getServerRenderedAST` returns `null` at line 1394. So the conditional at line 1293 (`if (contentAST && ownedNodes.length > 0)`) is **false**. This means:

- `hydrateInnerContent` is **NOT called** for each blocks
- The `innerScope` is **NOT created** for each blocks
- The `ownedNodes` are collected but **NOT hydrated** with inner Reactions

Then at line 1339, `hydrateEach` is called with `{ node, data, scope, region }`.

So the concern in Question 1 about `hydrateInnerContent` wiring inner Reactions that conflict with the each Reaction **does not apply** — `hydrateInnerContent` is skipped for each blocks.

**However**, this reveals a different problem: the owned nodes from the server are sitting in the DOM but are **never hydrated**. The each block has inner content (text expressions, nested conditionals, nested each loops, snippets) that will never get reactive bindings wired. The only path that touches them again is `hydrateEach`, which on first run just evaluates `node.over` and returns, and on subsequent runs does a full re-render via `readAST`.

**Re-evaluating for the actual triplication cause:**

Since `hydrateInnerContent` is NOT called for each blocks, the inner Reactions theory is not the cause. Let me trace what happens when `hydrateEach` fires:

1. First run (line 1458): evaluates `this.eval(node.over, data)` to register Signal dependencies on `getMenu`. Returns immediately — server content stays.

2. User types 'g' → `state.searchTerm` changes → `getMenu()` re-evaluates → the each Reaction fires again.

3. On subsequent run (lines 1467-1479): creates a new `fragment` and `listScope`, renders all items via `readAST`, calls `region.setContent(fragment, listScope)`.

4. `region.setContent` (dynamic-region.js line 26) calls `this.clear()` first, then sets new content.

5. `region.clear()` (line 19) disposes `this.childScopes` and removes `this.ownedNodes`.

**The critical question: what is in `region.ownedNodes` at this point?**

Go back to `hydrateBlockDirective`:
- Line 1287: `region.ownedNodes = ownedNodes` — this sets it to the collected server nodes.
- Lines 1293-1301: Since `contentAST` is `null` for each blocks, this block is **skipped entirely**.
- So `region.ownedNodes` still equals the original `ownedNodes` array from lines 1256-1281.

**But are those nodes still in the DOM?** At line 1286, `comment.replaceWith(region.anchor)` replaces the opening marker comment with the anchor text node. The `ownedNodes` were siblings after the comment, so they remain in the DOM in their original positions, following the anchor.

**So when `region.clear()` fires, it should remove those nodes.** The `ownedNodes` array references the actual DOM nodes that are in the shadow root. `node.remove()` should remove them from wherever they are.

**Let me look more carefully at the flow again to find the actual triplication source.**

Wait — I need to re-examine line 1286 more carefully:

```js
region.anchor = document.createTextNode('');
comment.replaceWith(region.anchor);
```

The anchor replaces the **opening** comment marker. The ownedNodes are everything between the opening and closing markers. The closing marker was removed at line 1274 (`next.remove()`). So the DOM after hydration setup is:

```
[anchor textNode] [ownedNode1] [ownedNode2] ... [ownedNodeN]
```

This looks correct. `region.ownedNodes` should reference these exact nodes.

**Now the real question: Is `removeMarkers()` in `base.js` disrupting this?**

After `hydrateMarkers` completes, `base.js` line 145 calls `this.removeMarkers()`. This walks all comments in the shadow root and removes any starting with `sui` or `/sui`. But inside the each block's owned nodes, there are **inner** comment markers (for nested expressions, nested each loops, nested if blocks, and snippet invocations).

Since `hydrateInnerContent` was NOT called for each blocks, these inner markers are **still present** in the DOM. `removeMarkers()` will remove them. But this shouldn't cause triplication — it just means the inner markers are gone.

**But wait — what about the NESTED each loops?** The nav-menu template has:

```html
{#each section in getMenu}
  {>title title=section isItem=false}
  {#if section.pages}
    <div class="...content">
      <div class="menu">
        {#each page in section.pages}
          ...
        {/each}
      </div>
    </div>
  {/if}
{/each}
```

The **outer** each is processed by `hydrateBlockDirective` at the top level. But the inner `{#if section.pages}` and `{#each page in section.pages}` are INSIDE the outer each's owned nodes. Since `getServerRenderedAST` returns `null` for each blocks and `hydrateInnerContent` is skipped, **none** of the inner blocks get hydrated.

This means when the search triggers and the outer each re-renders via `readAST`, it creates entirely fresh DOM. And `region.clear()` should remove the old server DOM because `region.ownedNodes` correctly references those nodes.

**So where does triplication come from?**

Let me reconsider whether `hydrateBlockDirective` is processing the outer each, or each inner block too.

Looking at `hydrateMarkers` (line 978), it walks comments with `blockDepth` tracking:

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
  ...
  if (text.startsWith(BLOCK_MARKER)) {
    ...
    commentsToProcess.push({ comment, markerID, type: 'block' });
    blockDepth++;
  }
}
```

This correctly skips inner blocks. Only the top-level blocks are processed by `hydrateMarkers`. So the outer `{#each section in getMenu}` is processed, and all inner blocks (the `{#if section.pages}`, `{#each page in section.pages}`, etc.) are left alone because they're inside the outer block's marker pair.

**Now — I think I may have found the actual bug. Let me check if the `{#if hasNoResults}...{else}...{/if}` block wrapping the each is also a top-level block.**

Looking at the template:
```html
{#if searchable}
  <ui-input .../>
{/if}
<div class="...menu">
  {#if hasNoResults}
    <div class="message">{getNoResultsMessage}</div>
  {else}
    {#each section in getMenu}
      ...
    {/each}
  {/if}
</div>
```

The `{#if hasNoResults}...{else}...{#each}...{/if}` structure means the outer each is inside an `{#if hasNoResults}` block (in the else branch). So `hydrateMarkers` at the top level would process:
1. The `{#if searchable}` block
2. Any top-level text expressions
3. The `{#if hasNoResults}` block

The `{#if hasNoResults}` block would be processed by `hydrateBlockDirective`. For this `if` block:
- `getServerRenderedAST` would evaluate the `if` condition. On initial render, `hasNoResults` is false (no search term), so it returns the else branch content (which contains the each loop).
- `hydrateInnerContent` IS called (because `contentAST` is not null for `if` blocks and ownedNodes exist).
- `hydrateInnerContent` recursively hydrates the inner markers, which includes the `{#each section in getMenu}` block.

**So the each block IS hydrated after all — indirectly through the if block's `hydrateInnerContent`!**

Let me trace this more precisely:

1. `hydrateBlockDirective` processes `{#if hasNoResults}`:
   - Collects ownedNodes (all DOM between `<!--sui-block:v1:X-->` and `<!--/sui-block:v1:X-->`)
   - Creates a DynamicRegion
   - `getServerRenderedAST` evaluates: `hasNoResults` is false → returns else branch (`node.branches[0].content` which is `[{type: 'each', ...}]`)
   - `contentAST` is the else branch AST (containing the each loop)
   - Calls `hydrateInnerContent(ownedNodes, contentAST, data, innerScope)`

2. `hydrateInnerContent` (line 1398):
   - Calls `buildHTMLStringPure(contentAST, this.snippets)` to get entries for the else branch
   - Moves ownedNodes to a DocumentFragment container
   - Calls `this.hydrateMarkers(container, entries, data, scope, { ast: contentAST })`
   - This walks comments in the container, finds the each block marker, and calls `hydrateBlockDirective` for it

3. `hydrateBlockDirective` processes `{#each section in getMenu}`:
   - Collects ownedNodes for the each block
   - Creates a DynamicRegion
   - `getServerRenderedAST` returns `null` for each → `hydrateInnerContent` is skipped
   - Calls `hydrateEach({ node, data, scope, region })`

4. `hydrateEach` creates a Reaction:
   - First run: evaluates `getMenu()`, registering deps on `searchTerm` signal. Returns.
   - The `childScopes` of the if-block's region now contains the `innerScope`.
   - The `innerScope` tracks the each Reaction.

5. Then back in `hydrateBlockDirective` for the `if` block:
   - After `hydrateInnerContent`, nodes are moved back from fragment to DOM (lines 1297-1300)
   - The `region.ownedNodes` is refreshed (line 1300)
   - Then `hydrateConditional` is called, which creates **another** Reaction for the if block

6. `hydrateConditional` (line 1420):
   - Evaluates `getBranch` to determine current branch index
   - Creates a Reaction that on subsequent runs checks if branch changed
   - If branch changes, calls `region.setContent` which calls `region.clear()` first

**Now here's the critical chain when the user types 'g':**

`state.searchTerm` changes. This triggers:

1. **The each Reaction** (from `hydrateEach` step 4) — because `getMenu()` reads `searchTerm`
2. **The if Reaction** (from `hydrateConditional` step 5) — because `hasNoResults` reads `searchTerm` (indirectly through `getMenu()`)

**The each Reaction fires:**
- Evaluates `getMenu()` → returns filtered results (e.g., ["Getting Started"])
- Not firstRun → creates a fresh DOM fragment via `readAST` and calls `region.setContent(fragment, listScope)` on the **each's** DynamicRegion
- `region.clear()` removes the old server nodes and disposes child scopes
- New filtered content is inserted after the each's anchor

**The if Reaction fires:**
- Evaluates `getBranch` → `hasNoResults` is false (we found results) → same branch as before → `result.matchIndex === currentBranchIndex` → **no re-render**

OK, so the if Reaction doesn't re-render. But does it re-evaluate expressions that trigger further updates?

Actually, wait. Let me reconsider. The `hydrateConditional` Reaction does:
```js
const result = this.getBranch(node, data);
```
`getBranch` evaluates `node.condition` which is `hasNoResults`. `hasNoResults` calls `self.getMenu()` which calls `state.searchTerm.get()`. So the if Reaction DOES depend on `searchTerm`.

When the if Reaction fires and the branch hasn't changed, nothing happens. No re-render.

**But let me check: which Reaction fires FIRST?**

Both the each Reaction and the if Reaction depend on `searchTerm` (transitively through `getMenu()`/`hasNoResults()`). Reactions fire synchronously when a Signal changes. The order depends on creation order.

In the hydration flow:
1. `hydrateInnerContent` is called first, which calls `hydrateMarkers` → `hydrateBlockDirective` for the each → `hydrateEach` creates the each Reaction
2. Then `hydrateConditional` creates the if Reaction

So the each Reaction was created FIRST. When `searchTerm` changes, both Reactions are dirty. The each Reaction fires first.

**The each Reaction's `region.setContent` clears the each region's ownedNodes and inserts new DOM.**

Then the if Reaction fires. The branch hasn't changed, so no re-render.

This sequence seems correct and should produce only ONE copy. But wait...

**Critical issue: the each Reaction's `scope` parameter.**

In `hydrateBlockDirective` for the each block (called inside `hydrateInnerContent`), the `scope` parameter is the `innerScope` — a child of the if-block's scope:

```js
const innerScope = scope.child();  // line 1294, in if-block processing
region.childScopes.push(innerScope); // line 1295
this.hydrateInnerContent(ownedNodes, contentAST, data, innerScope); // line 1296
```

Inside `hydrateInnerContent` → `hydrateMarkers` → `hydrateBlockDirective` (for the each) → `hydrateEach`:

```js
hydrateEach({ node, data, scope, region }) {
  scope.track(Reaction.create(...));
}
```

The `scope` here is the `innerScope`. So the each Reaction is tracked on `innerScope`.

Now, `innerScope` is also pushed to the if-block's `region.childScopes`. If the if-block's Reaction ever calls `region.setContent` or `region.clear`, it would dispose `innerScope`, which would stop the each Reaction.

But we established that when `searchTerm` changes, the if branch doesn't change (hasNoResults stays false), so `region.setContent`/`region.clear` is NOT called for the if block.

**Let me reconsider the triplication hypothesis more carefully.**

Actually, maybe the issue is simpler. Let me look at what `getMenu()` returns and how it interacts with the reactive system.

`getMenu()` is called inside a `Reaction`. Each call to `getMenu()` reads `state.searchTerm.get()` (through `isSearching()` and `filterBySearchTerm()`). This creates a dependency.

But `getMenu()` is also called inside `hasNoResults()`:
```js
hasNoResults() {
  return state.searchTerm.get() && self.getMenu()?.length == 0;
}
```

And `hasNoResults` is the condition for the if block.

So the if-block's Reaction depends on: `searchTerm` (via `hasNoResults` → `getMenu` → `isSearching` → `searchTerm.get()`)
And the each-block's Reaction depends on: `searchTerm` (via `getMenu` → `isSearching` → `searchTerm.get()`)

Both Reactions trigger when `searchTerm` changes. The each fires first (created first), producing correct filtered output. The if fires second, sees the same branch, does nothing.

**Hmm. What if the issue is that `removeMarkers()` in `base.js` (line 145) removes comment markers that the each block's `hydrateBlockDirective` needs?**

After hydration completes, `base.js` calls `this.removeMarkers()` which removes ALL `sui`/`/sui` comment nodes from the shadow root. But `hydrateBlockDirective` already processed these markers and replaced opening markers with anchor text nodes (line 1286). The closing markers are removed during owned-node collection (line 1274). Inner markers that weren't processed (because `hydrateInnerContent` skipped them for each blocks) would be removed by `removeMarkers()`.

But the each's ownedNodes were collected BEFORE any markers were removed. And the each Reaction references `region.ownedNodes`, not the comment markers themselves. So `removeMarkers()` shouldn't affect the each Reaction's ability to clear old content.

**Actually, let me reconsider the node collection process more carefully.**

When `hydrateBlockDirective` collects ownedNodes for the each block (inside `hydrateInnerContent`'s DocumentFragment):

```js
const ownedNodes = [];
let next = comment.nextSibling;
while (next) {
  if (next.nodeType === Node.COMMENT_NODE) {
    if (next.data.startsWith(BLOCK_MARKER)) {
      blockDepth++;
    }
    else if (next.data.startsWith('/sui-block:')) {
      blockDepth--;
      if (blockDepth === 0) {
        next.remove();
        break;
      }
    }
  }
  ownedNodes.push(next);
  next = next.nextSibling;
}
```

These ownedNodes include ALL nodes between the each markers — including inner comment markers, element nodes, text nodes, etc.

Then `region.ownedNodes = ownedNodes`. When `region.clear()` fires, it calls `node.remove()` for each of these. This should correctly remove all the server content for the each block.

**I'm now going to look at the problem from the "3x" angle. If we see 3 copies, it suggests:**

1. Original server DOM (1 copy — should be cleared by `region.clear()`)
2. One render from the each Reaction (1 copy)
3. One more copy from... where?

OR:
1. Two copies of server DOM (somehow duplicated during hydration)
2. One re-render

OR:
1. Server DOM not cleared (1 copy persists)
2. Two re-renders (each Reaction fires twice?)

**Let me re-examine the `hydrateInnerContent` → fragment → move-back flow for the IF block (which contains the each):**

```js
// hydrateBlockDirective for the if block:
const contentAST = this.getServerRenderedAST(node, data);  // returns else branch AST
if (contentAST && ownedNodes.length > 0) {
  const innerScope = scope.child();
  region.childScopes.push(innerScope);
  this.hydrateInnerContent(ownedNodes, contentAST, data, innerScope);
  const frag = document.createDocumentFragment();
  for (const n of ownedNodes) { frag.appendChild(n); }
  region.anchor.after(frag);
  region.ownedNodes = [...ownedNodes];
}
```

`hydrateInnerContent` moves nodes to a fragment, hydrates them, then updates `ownedNodes` in place:
```js
hydrateInnerContent(ownedNodes, contentAST, data, scope) {
  const { entries } = buildHTMLStringPure(contentAST, this.snippets);
  if (entries.length === 0) { return; }
  const container = document.createDocumentFragment();
  for (const n of [...ownedNodes]) {
    container.appendChild(n);
  }
  this.hydrateMarkers(container, entries, data, scope, { ast: contentAST });
  ownedNodes.length = 0;
  for (const n of [...container.childNodes]) {
    ownedNodes.push(n);
  }
}
```

After `hydrateInnerContent`:
- The `ownedNodes` array has been updated to reflect the container's children (which may differ from the original if markers were removed/replaced).
- The nodes are still in the `container` DocumentFragment.

Then in `hydrateBlockDirective`:
```js
const frag = document.createDocumentFragment();
for (const n of ownedNodes) { frag.appendChild(n); }
region.anchor.after(frag);
region.ownedNodes = [...ownedNodes];
```

Wait — this moves nodes from `container` to `frag`, then inserts `frag` after the anchor. But `ownedNodes` was updated to reference nodes in `container`. When we do `frag.appendChild(n)`, the node `n` moves from `container` to `frag`. Then `frag` is inserted into the DOM. After `region.anchor.after(frag)`, `frag` is empty (its children are now in the DOM). And `region.ownedNodes = [...ownedNodes]` copies the references — those references now point to nodes in the live DOM. This seems correct.

**But what about the EACH block's DynamicRegion?**

Inside `hydrateInnerContent` → `hydrateMarkers` → `hydrateBlockDirective` for the each block:

```js
// Each block processing inside the container fragment:
const region = new DynamicRegion(parentNode, null);  // parentNode is the container or a node within it
region.anchor = document.createTextNode('');
comment.replaceWith(region.anchor);
region.ownedNodes = ownedNodes;  // <-- each block's own ownedNodes
```

The each block's `region.ownedNodes` is set to the nodes between the each markers. The anchor replaces the each's opening comment. The each's closing comment was removed.

Then when nodes are moved back from `container` to `frag` to the DOM, the each's anchor and ownedNodes move along. The each's `region.ownedNodes` correctly references the nodes now in the live DOM.

**OK so this all seems correct for disposal. Let me think about whether there's a second instance of the each block being processed.**

Actually, I want to check something. The `{#if hasNoResults}...{else}...{/if}` block contains TWO branches: the if-branch (`<div class="message">...`) and the else-branch (`{#each section in getMenu}...`). The server renders the else branch (no results message isn't shown initially).

When `hydrateBlockDirective` processes this if block:
- `getServerRenderedAST` evaluates the condition on the client. `hasNoResults` is false (no search term yet), so it returns the else branch content.
- This is correct — it matches what the server rendered.

But `hydrateConditional` ALSO evaluates the condition:
```js
hydrateConditional({ node, data, scope, region }) {
  const result = this.getBranch(node, data);
  let currentBranchIndex = result.matchIndex;
  scope.track(Reaction.create((comp) => {
    ...
    const result = this.getBranch(node, data);
    if (result.matchIndex !== currentBranchIndex) {
      ...
      region.setContent(branchFragment, branchScope);
    }
  }));
}
```

On `firstRun` of this Reaction, `getBranch` evaluates the condition. This reads `hasNoResults` → `getMenu()` → `searchTerm.get()`. This registers deps. The branch matches, so nothing happens.

When `searchTerm` changes to 'g':
1. `hasNoResults` → `getMenu()` returns `["Getting Started"]` → length is not 0 → `hasNoResults` is false
2. Branch index stays the same (else branch) → no re-render from the if Reaction

So far so good. **But what if the user types something that matches NOTHING?**

If searchTerm is 'zzzzz':
1. `getMenu()` returns `[]`
2. `hasNoResults` → `searchTerm.get()` is truthy AND `getMenu().length == 0` → true
3. The if block's branch changes from else to if → `region.setContent` fires
4. `region.clear()` disposes `innerScope` (which stops the each Reaction) and removes `region.ownedNodes`
5. New content (`<div class="message">...`) is inserted

This would be correct behavior. And when the user clears the search, the branch changes back to else, and the each loop would be re-rendered from scratch. But that's a different scenario than the reported 'g' search.

**Let me look at this from yet another angle. What if the issue is in `removeMarkers()`?**

`base.js` line 145 calls `removeMarkers()` which removes ALL sui-prefixed comments. But `hydrateBlockDirective` for the each block (inside the if block's `hydrateInnerContent`) already replaced the each's opening marker with an anchor and removed the closing marker. However, the each block's **inner** markers (for nested expressions, if blocks, each blocks inside it) were NOT processed (because `getServerRenderedAST` returns null for each, and `hydrateInnerContent` was not called for the each).

These unprocessed inner markers are part of the each block's `region.ownedNodes`. When `removeMarkers()` removes them, they're removed from the DOM. But they're **still referenced** in `region.ownedNodes`. So when `region.clear()` later tries to `node.remove()` them, they're already detached — `.remove()` on a detached node is a no-op. That's fine.

**But does removing inner markers affect the node count in `region.ownedNodes`?** The array still references the removed comment nodes. When `region.clear()` iterates, it calls `.remove()` on each. For the already-removed comments, this is a no-op. For the still-attached element/text nodes, they get removed. So all visible content should still be cleared. This doesn't explain triplication.

**NEW THEORY: Let me check if there are multiple each blocks at the top level that both get hydrated.**

The nav-menu template has `{#if hasNoResults}...{else}...{/if}` as a top-level block inside the `<div class="menu">`. The `{#if searchable}...{/if}` is another top-level block.

The each loop `{#each section in getMenu}` is inside the else branch of the `{#if hasNoResults}` block. It's NOT a top-level block — it's a nested block. So `hydrateMarkers` at the top level processes only `{#if searchable}` and `{#if hasNoResults}`. The each is processed recursively inside the if-block's `hydrateInnerContent`. This is correct.

**ACTUALLY — let me recount. I want to verify whether the `{#if hasNoResults}` else branch contains ONLY the each block, or also the snippets.**

From the template:
```html
{#if hasNoResults}
  <div class="message">{getNoResultsMessage}</div>
{else}
  {#each section in getMenu}
    {>title title=section isItem=false}
    {#if section.pages}
      ...
        {#each page in section.pages}
          ...
        {/each}
      ...
    {/if}
  {/each}
{/if}
```

The snippets (`{>title ...}`) are inside the each loop. The snippet definitions are at the bottom of the template.

**REVISED THEORY: Double dependency registration.**

When `hydrateInnerContent` is called for the if-block's else branch, it hydrates the each block. `hydrateEach` creates a Reaction that evaluates `getMenu()` on first run, registering a dependency on `searchTerm`. But the if-block's `hydrateConditional` ALSO creates a Reaction that evaluates `hasNoResults` → `getMenu()`, registering a dependency on `searchTerm`.

Both Reactions are legitimate. When `searchTerm` changes, both fire. The each Reaction re-renders the list. The if Reaction checks if the branch changed. If the branch didn't change, no re-render occurs. This is 1 render, not 3.

**FINAL THEORY: The answer might be in the `{>title}` snippet invocations or in the `{#if section.pages}` conditional inside the each loop.**

Actually, I think I need to reconsider the scenario more carefully.

Let me reconsider what happens when the each block IS inside a DocumentFragment (during `hydrateInnerContent`) and the each block's `hydrateBlockDirective` runs:

The each block's `parentNode` is the DocumentFragment (or a div inside it). The each block creates its own `region` with `region.anchor`. The each's `ownedNodes` are the server-rendered items.

Then `hydrateInnerContent` finishes and updates its `ownedNodes` array (line 1414-1417). The if-block's `hydrateBlockDirective` then does:

```js
const frag = document.createDocumentFragment();
for (const n of ownedNodes) { frag.appendChild(n); }
region.anchor.after(frag);
region.ownedNodes = [...ownedNodes];
```

Here `ownedNodes` is the if-block's ownedNodes (the else branch content). This includes the each's anchor text node and the each's ownedNodes. When these are moved to `frag` and then inserted after the if-block's anchor, everything ends up in the DOM correctly.

The if-block's `region.ownedNodes` now contains ALL nodes from the else branch — including the each's anchor AND the each's content nodes. **This means the if-block's region owns nodes that the each-block's region ALSO owns.**

**This is the key finding: there is overlapping ownership of DOM nodes between the if-block's region and the each-block's region.**

If the if-block ever calls `region.clear()`, it would remove ALL the nodes including the each's anchor. This would break the each Reaction's ability to insert new content. But since the if-block's branch doesn't change when typing 'g', this doesn't happen for the reported scenario.

For the each Reaction: when it fires (after typing 'g'), `region.clear()` removes the each's `ownedNodes` and disposes child scopes. Then `region.setContent` inserts new content after `region.anchor`. The anchor is still in the DOM (it's also in the if-block's ownedNodes, but no one removed it). The new content is inserted correctly.

**BUT — the if-block's `region.ownedNodes` still contains references to the each's OLD ownedNodes (which have been removed from the DOM) AND the each's anchor (still in the DOM). The if-block's ownedNodes also includes any other nodes from the else branch that are NOT inside the each block.**

Wait, are there nodes in the else branch outside the each block? Looking at the template:
```
{else}
  {#each section in getMenu}
    ...
  {/each}
{/if}
```

The else branch contains ONLY the each block. So the if-block's ownedNodes (for the else branch) would be:
1. Any whitespace text nodes
2. The each block's opening marker (replaced by the each's anchor during `hydrateBlockDirective`)
3. The each block's inner content (ownedNodes of the each)
4. The each block's closing marker (removed during `hydrateBlockDirective`)

After hydration, the if-block's ownedNodes would be:
1. Whitespace text nodes
2. The each's anchor text node
3. The each's ownedNodes (server-rendered content)

**After the each Reaction fires and replaces content, the if-block's ownedNodes still reference the OLD each content (now removed from DOM) and the each's anchor. The NEW content from the each Reaction is NOT in the if-block's ownedNodes.**

This means if the if-block's branch later changes (e.g., user searches for something with no results → `hasNoResults` becomes true), `region.clear()` for the if-block would:
- Try to remove old nodes (most already detached — no-op)
- Remove the each's anchor (breaking the each Reaction)
- But NOT remove the each's NEW content

This would cause content to persist. But this doesn't explain the 3x for the 'g' search where the branch doesn't change.

**WAIT. I just realized something crucial. Let me re-read the `hydrateConditional` Reaction more carefully:**

```js
hydrateConditional({ node, data, scope, region }) {
  const result = this.getBranch(node, data);
  let currentBranchIndex = result.matchIndex;

  scope.track(Reaction.create((comp) => {
    if (!comp.firstRun && !region.anchor.isConnected) {
      comp.stop();
      return;
    }

    const result = this.getBranch(node, data);
    if (result.matchIndex !== currentBranchIndex) {
      currentBranchIndex = result.matchIndex;
      if (result.contentAST) {
        const branchScope = scope.child();
        const branchFragment = this.readAST({ ast: result.contentAST, data, scope: branchScope });
        region.setContent(branchFragment, branchScope);
      }
      else {
        region.clear();
      }
    }
  }));
}
```

On the Reaction's first run (NOT the initial `getBranch` call above it — the Reaction's own first run), it evaluates `getBranch`. This reads `hasNoResults` → reads `searchTerm.get()` and `getMenu()`. Since `searchTerm` hasn't changed, the branch matches → no re-render. But the deps are registered.

**But what about the `hasNoResults` call in the conditional?** `hasNoResults` calls `self.getMenu()` which returns the full menu. In the each Reaction, `getMenu()` is also called. Both Reactions see the same Signal dependencies.

When `searchTerm` changes to 'g':
1. The each Reaction fires: calls `getMenu()` → returns filtered list → re-renders via `region.setContent`
2. The if Reaction fires: calls `getBranch` → evaluates `hasNoResults` → calls `getMenu()` → same branch → no re-render

**This is 1 re-render. So where do 3 copies come from?**

Let me reconsider. Maybe the problem isn't in the hydration path at all, but in the each Reaction's re-render path. When `hydrateEach`'s Reaction fires on a subsequent run:

```js
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

This calls `readAST` for each item. `readAST` calls `buildHTMLString` → `parseHTML` → `bindMarkers`. The `bindMarkers` step creates Reactions for inner expressions, including calls to `getMenu()` inside nested each loops (e.g., `{#each page in section.pages}` where `section.pages` is evaluated as part of the item data, not as a global `getMenu()` call).

Wait, `section.pages` doesn't call `getMenu()`. It accesses the `pages` property of the current item. So there shouldn't be additional `searchTerm` dependencies from inner loops.

**But the `{>title}` snippet calls `getTitleClasses title` and `getNavIcon title` which do NOT depend on `searchTerm`. The snippet calls `getLink title` which doesn't depend on `searchTerm` either.**

Hmm. Actually, let me check — inside `hydrateEach`, the `scope` parameter is the `innerScope` (child of the if-block's scope). When the each Reaction's subsequent run calls `scope.child()` to create `listScope`, this is `innerScope.child()`. The new Reactions (from `readAST` → `bindMarkers`) are tracked on `listScope` and its children. These would be properly disposed when the each Reaction fires again (via `region.setContent` → `region.clear()` → dispose child scopes).

**OK, I'm going to step back and synthesize what I believe is happening, based on ALL the code I've read.**

Actually, I want to check one more thing. When `hydrateEach`'s Reaction fires (subsequent run) and calls `region.setContent(fragment, listScope)`:

`region.clear()` disposes `region.childScopes` and removes `region.ownedNodes`.

What's in `region.childScopes` at this point? It was set during `hydrateBlockDirective` — but was it?

Let's trace:
1. In `hydrateBlockDirective` for the each block (called from within `hydrateInnerContent`):
   - Line 1284: `region = new DynamicRegion(...)` → `childScopes = []`
   - Line 1287: `region.ownedNodes = ownedNodes`
   - Lines 1292-1301: `getServerRenderedAST` returns `null` for each → block is skipped → **`childScopes` remains empty**
   - Line 1339: `hydrateEach({ node, data, scope, region })`

2. In `hydrateEach`:
   - `scope.track(Reaction.create(...))` — this tracks the Reaction on `scope` (which is `innerScope`), NOT on `region.childScopes`

So `region.childScopes` is **empty** for the each block. When `region.clear()` fires, it disposes nothing from `childScopes`. It only removes `ownedNodes` from the DOM. Then `setContent` adds the new fragment.

**This means the server DOM IS properly removed (via `ownedNodes` removal), and the new content IS properly inserted. There should be only 1 copy.**

**Unless... there's something about how the each block's `ownedNodes` reference was corrupted during the fragment move-back process.**

Let me trace the exact flow for the if-block processing and see if the each's `region.ownedNodes` gets stale:

1. `hydrateBlockDirective` for the if-block collects `ownedNodes_if` (all nodes between if markers)
2. Creates if-block's `region_if`, sets `region_if.ownedNodes = ownedNodes_if`
3. `getServerRenderedAST` returns else branch AST → `contentAST` is not null
4. Calls `hydrateInnerContent(ownedNodes_if, contentAST, data, innerScope)`:
   a. Moves `ownedNodes_if` nodes to `container` fragment
   b. Calls `hydrateMarkers(container, entries, data, innerScope)`
   c. Inside `hydrateMarkers`, finds the each block comment
   d. `hydrateBlockDirective` for the each block:
      - Collects `ownedNodes_each` (nodes between each markers, inside `container`)
      - Creates `region_each`, `region_each.anchor` replaces each's opening comment
      - `region_each.ownedNodes = ownedNodes_each`
      - **At this point, `ownedNodes_each` references nodes inside `container`**
      - `hydrateEach` creates a Reaction
   e. `hydrateMarkers` returns
   f. Updates `ownedNodes_if` array in place:
      ```js
      ownedNodes.length = 0;
      for (const n of [...container.childNodes]) {
        ownedNodes.push(n);
      }
      ```
      **`container.childNodes` now includes `region_each.anchor` and whatever nodes remain**
      **But `ownedNodes_each` still references the specific nodes that were between the each markers**
5. Back in `hydrateBlockDirective` for the if-block:
   ```js
   const frag = document.createDocumentFragment();
   for (const n of ownedNodes) { frag.appendChild(n); }  // moves from container to frag
   region.anchor.after(frag);  // inserts into live DOM
   region.ownedNodes = [...ownedNodes];
   ```
   After this, nodes are in the live DOM.

**Now: `region_each.ownedNodes` references the same node objects as some entries in `region_if.ownedNodes`. The nodes are in the live DOM. When the each Reaction fires and calls `region_each.clear()`, it removes those nodes from the DOM. `region_if.ownedNodes` still holds references to the (now detached) nodes.**

This means after the each Reaction's first re-render:
- `region_each.ownedNodes` = new nodes (from `setContent`)
- `region_if.ownedNodes` = stale references (some detached, some still in DOM like the anchor)

If the if-block's Reaction never fires `region.setContent`/`clear`, this staleness doesn't matter for the reported scenario.

**OK. I've been very thorough, and I cannot find a clear 3x duplication path from the code alone in the typed-'g' scenario. But let me consider one more thing: the `requestAnimationFrame` deferral.**

In `base.js` line 79:
```js
requestAnimationFrame(() => this.hydrate(prototypeTemplate));
```

Hydration is deferred to a rAF. But `requestUpdate` is suppressed during `_hydrating`:
```js
requestUpdate() {
  if (this._hydrating || this.updateScheduled) {
    return;
  }
  ...
}
```

`_hydrating` is set to `true` in the constructor (line 37) and cleared at the end of `hydrate()` (line 141). So between constructor and the rAF callback, `requestUpdate` calls are suppressed. This seems correct.

But what if the user types BEFORE hydration completes? The `ui-input` event listener hasn't been wired yet (it's in the `events` config, which gets connected after render/hydration). So user input before hydration would be ignored. This shouldn't cause triplication.

**SYNTHESIS: After exhaustive analysis, here is what I believe is happening.**

Actually, let me check one last thing. Is there perhaps a second `{#each}` block for the same `getMenu` data that I'm missing? Let me re-read the template carefully.

The template has:
```
{#each section in getMenu}     ← OUTER EACH over getMenu
  {>title ...}                   ← snippet invocation
  {#if section.pages}            ← conditional
    <div class="content">
      <div class="menu">
        {#each page in section.pages}   ← INNER EACH over section.pages
          {#if page.pages}               ← conditional
            {>title ...}                 ← snippet
            <div class="content">
              <div class="menu">
                {#each page in page.pages}  ← INNERMOST EACH over page.pages
                  <a ...>
                    {>highlight ...}     ← snippet
                  </a>
                {/each}
              </div>
            </div>
          {else}
            <a ...>
              {>highlight ...}           ← snippet
            </a>
          {/if}
        {/each}
      </div>
    </div>
  {/if}
{/each}
```

There is only ONE each over `getMenu` — the outer one. The inner eaches iterate over `section.pages` and `page.pages` which are item-level data, not reactive.

---

## Answer to Question 1

**When `hydrateBlockDirective` processes the each block, `getServerRenderedAST` returns `null` for each-type nodes (line 1394). This means `hydrateInnerContent` is NEVER called for the each block itself.** The conditional at line 1293 evaluates to false because `contentAST` is null.

However, the each block IS processed indirectly: the each block lives inside the `{#if hasNoResults}...{else}...{/if}` block. When the if-block is hydrated, `hydrateInnerContent` IS called for the if-block's else branch AST. This recursively processes inner markers, including the each block. So `hydrateBlockDirective` runs for the each, and `hydrateEach` creates its Reaction.

There are no inner Reactions from `hydrateInnerContent` on the each's ownedNodes — they were never wired because `hydrateInnerContent` was skipped for the each block. The each block's `region.childScopes` is empty. When `region.setContent()` is called during re-render, `region.clear()` disposes no child scopes (there are none) and removes `region.ownedNodes` from the DOM. **There are no orphan inner Reactions persisting from `hydrateInnerContent` for the each block specifically.**

The potential concern is valid in principle — if `hydrateInnerContent` HAD been called on the each block's ownedNodes, those Reactions would be tracked on the innerScope but NOT on the each's `region.childScopes`. They would persist after `region.clear()`. But this path is not taken for each blocks.

## Answer to Question 2

**The `hydrateEach` Reaction skips rendering on `firstRun` (line 1458). Since `hydrateInnerContent` is NOT called for each blocks (as explained in Question 1), there are no hydration-wired inner Reactions on the each's content.**

When the each Reaction fires on a subsequent run, `region.setContent(fragment, listScope)` calls `region.clear()`. This:
1. Iterates `region.childScopes` — which is empty for each blocks → no disposals
2. Iterates `region.ownedNodes` — which was set to the collected server nodes at line 1287 → removes them from DOM

The ownedNodes from line 1287 are the actual DOM node references. They should still be in the live DOM at this point (they were moved back from the fragment during the if-block's processing). So `node.remove()` should work correctly.

**The cleanup IS correct for the each block's own region.** But there's a subtle issue: after `removeMarkers()` runs in `base.js`, some comment nodes in `region.ownedNodes` have already been removed from the DOM. Calling `.remove()` on them is a no-op, which is harmless.

## Answer to Question 3

**Yes, there IS a potential timing/consistency issue with the DocumentFragment moves, but it does not cause incorrect behavior in the specific scenario described.**

Here's the exact flow:

1. `hydrateInnerContent` moves the if-block's ownedNodes to a `container` DocumentFragment
2. Inside `hydrateMarkers` (processing the container), `hydrateBlockDirective` for the each block:
   - Collects `ownedNodes_each` from nodes in the container
   - Creates `region_each.anchor`, replaces the each's opening marker
   - Sets `region_each.ownedNodes = ownedNodes_each`
3. `hydrateInnerContent` updates the if-block's ownedNodes array from `container.childNodes`
4. Back in `hydrateBlockDirective` for the if-block, nodes are moved to a new `frag` and inserted into the live DOM

After step 4, both `region_each.ownedNodes` and `region_if.ownedNodes` reference nodes now in the live DOM. The references are valid. `region_each.ownedNodes` is a subset of `region_if.ownedNodes` (the each's content is inside the if's else branch).

**The ownership is overlapping but not immediately harmful:** the each Reaction fires before the if Reaction would ever clear (since the branch doesn't change). When the each clears its ownedNodes, the if-block's ownedNodes become partially stale (some nodes removed from DOM). This would only matter if the if-block later called `region.clear()` — and in that case, the stale node removals would be no-ops, while the each's anchor (still in the DOM) would be removed, which would break the each Reaction (it checks `region.anchor.isConnected`).

## Answer to Question 4

**`setContent` clears the correct set of nodes for the each block.** Here's the precise state:

After hydration setup:
- `region_each.ownedNodes` = server-rendered content between the each markers
- `region_each.childScopes` = `[]` (empty — `hydrateInnerContent` was not called for each)
- `region_each.anchor` = text node in the DOM (replaced the each's opening marker)

When `region_each.setContent(fragment, listScope)` fires:
1. `clear()` — removes all ownedNodes from DOM (correct), disposes no childScopes (correct — there are none)
2. Sets `ownedNodes` to the new fragment's childNodes
3. Pushes `listScope` to `childScopes`
4. Inserts fragment after anchor

The node set IS correct. The owned nodes ARE the server-rendered content, and they ARE still in the DOM at the time `clear()` runs.

**However, there is a gap: the each's ownedNodes do NOT include the each's anchor text node. After `clear()`, the anchor remains in the DOM. The if-block's `region.ownedNodes` includes BOTH the anchor AND the old content. This overlapping ownership creates a latent issue but does not cause the 3x duplication in the 'g' search scenario.**

---

## Root Cause Analysis

Based on exhaustive code analysis, the 3x duplication is most likely caused by **one of the following** (in order of likelihood):

### Hypothesis A: The `removeMarkers()` call in `base.js` interferes with the DynamicRegion node tracking

After `hydrateMarkers` completes, `base.js` line 145 calls `this.removeMarkers()` which removes ALL sui-prefixed comment nodes from the shadow root. Some of these comment nodes are referenced in `region.ownedNodes` for the each block. After `removeMarkers()` removes them, they become detached — but their references persist in the array.

This means `region.ownedNodes` contains a MIX of:
- Still-attached element/text nodes (real content)
- Already-detached comment nodes (markers removed by `removeMarkers()`)

When `region.clear()` fires during re-render, it removes all ownedNodes. The detached comments are no-ops. The attached content nodes ARE removed. **This should still work correctly.** So this is probably not the cause.

### Hypothesis B: The Reaction fires multiple times due to nested Signal reads

When `searchTerm` changes, the Reaction in `hydrateEach` fires. During `readAST` (re-rendering the filtered list), the renderer evaluates expressions that read Signals. If any of these evaluations trigger additional Signal changes (e.g., `state.selectedIndex.set()` or `state.maxIndex.set()` inside `filterBySearchTerm`), the each Reaction could be re-triggered while it's already running.

Looking at `filterBySearchTerm` in `nav-menu.js`:
```js
state.selectedIndex.set(selectedIndex);  // line 157
state.maxIndex.set(selectedIndex);       // line 171
```

These Signal writes happen INSIDE `getMenu()`, which is called inside the each Reaction (via `this.eval(node.over, data)`). If Signal writes inside a Reaction trigger synchronous re-evaluation of other dependent Reactions, this could cause cascading updates. **But typically, Signal writes inside a Reaction don't re-trigger the same Reaction synchronously.**

However, the `state.selectedIndex.set()` and `state.maxIndex.set()` calls could trigger OTHER Reactions that depend on those Signals (e.g., Reactions for `{classMap getTitleClasses title}` and `{classMap getPageClasses page}` which read `state.selectedIndex.value`). If those other Reactions somehow feed back into the each Reaction's deps, it could cause a loop. **This needs investigation but seems unlikely to cause exactly 3x.**

### Hypothesis C (MOST LIKELY): The each Reaction fires, then the if-block's Reaction fires and causes a SECOND re-render of the else branch

Even though the if-block's branch doesn't change (else → else), let me double-check the `hydrateConditional` Reaction behavior. The `getBranch` call inside the Reaction evaluates the if-block's condition. For the `{#if hasNoResults}` block, the condition is `hasNoResults`. This calls `getMenu()` which reads `searchTerm.get()`.

**Here's a critical detail**: the `getBranch` call at line 1421 (OUTSIDE the Reaction) computes the initial `currentBranchIndex`. Then the Reaction on its first run also calls `getBranch`. The initial `currentBranchIndex` is based on the data at hydration time. The Reaction's first-run `getBranch` should produce the same result. On subsequent runs, it compares.

For the `{#if hasNoResults}` block: initially `hasNoResults` is false (no search term) → else branch. The `getBranch` would return `{ matchIndex: 0, contentAST: elseBranchContent }` (index 0 for the first else/elseif branch). The Reaction's first run sees the same. When `searchTerm` changes to 'g', `hasNoResults` is still false (results exist) → same branch index → no re-render.

**This confirms the if Reaction does NOT cause a second render. This is not the cause.**

### Hypothesis D: The problem is in the `{#if searchable}` block at the top of the template

The template starts with:
```html
{#if searchable}
  <ui-input .../>
{/if}
```

This is a top-level block. `hydrateBlockDirective` processes it. The condition is `searchable` (a setting). It's truthy on the client. `hydrateInnerContent` is called for the content (the `<ui-input>` element). The `hydrateConditional` Reaction is created. Since `searchable` is a static setting (not a Signal), this Reaction should never re-fire. **Not relevant.**

### Hypothesis E: The `{#if hasNoResults}` hydration mismatch check triggers an extra render

In `hydrateBlockDirective` at line 1304-1334, there's a hydration mismatch check for if-blocks:

```js
case 'if': {
  const clientBranch = this.getBranch(node, data);
  const serverBranchIndex = serverMeta.branchIndex;
  const hasMismatch = serverBranchIndex !== undefined
    && serverBranchIndex !== clientBranch.matchIndex;

  if (hasMismatch) {
    ...
    region.setContent(branchFragment, branchScope);
  }
  this.hydrateConditional({ node, data, scope, region });
  break;
}
```

If the server's closing marker encodes a branch index (e.g., `<!--/sui-block:v1:3:b0-->`), and the client evaluates a different branch, `region.setContent` is called immediately. This would clear the hydrated inner content (including the each block's Reactions) and re-render from scratch.

**If there IS a mismatch** (e.g., `isClient`/`isServer` guards), the fresh render via `readAST` would create a NEW each block (via `createEach`, not `hydrateEach`). But `hydrateInnerContent` already ran and created an each Reaction (via `hydrateEach`). If `region.setContent` properly disposes `innerScope` (which it does — `region.clear()` disposes `region.childScopes` which includes `innerScope`), the old each Reaction should be stopped.

But there's a subtlety: `hydrateConditional` is called AFTER the mismatch re-render. It creates another Reaction. If the branch changes again later, it would create yet another render. **But this is a one-time mismatch handling, not a repeating issue.**

For the `{#if hasNoResults}` block specifically: `hasNoResults` should be false on both server and client (no search term). So there should be no mismatch. **Not the cause unless there's a server/client data difference.**

### Final Assessment

After analyzing all the code paths, the most likely root cause of the 3x duplication is **NOT a single clear mechanism failure**, but rather an interaction between:

1. **The each block's server DOM remains in the DOM** after hydration because the each's `region.ownedNodes` correctly references them — but when the each Reaction fires and calls `region.setContent`, `region.clear()` should remove them. If it doesn't (e.g., due to the fragment-move-back process corrupting references), one copy stays.

2. **The each Reaction re-renders**, inserting new filtered content. This is the second copy.

3. **A possible third copy** could come from the if-block or from the each Reaction firing twice (due to Signal write cascading from `filterBySearchTerm`'s `state.selectedIndex.set()` and `state.maxIndex.set()` calls).

The most concrete code-level issue I can identify is: **the each block's `region.childScopes` is empty**, meaning `region.clear()` does not dispose any Reactions that were tracking the inner content. If any inner Reactions were created (e.g., by attribute hydration or text expression hydration that happened BEFORE the each block was identified during the comment walk), they would persist and could cause ghost updates.

However, the `hydrateMarkers` block-depth tracking (lines 999-1010) should prevent inner markers from being processed at the wrong level. And since `getServerRenderedAST` returns `null` for each blocks, `hydrateInnerContent` is skipped.

**The cleanest explanation for 3x (to be verified empirically) is:**
1. Server DOM persists (1 copy) — `region.clear()` fails to remove ownedNodes because the node references became stale during the fragment-based `hydrateInnerContent` processing of the parent if-block
2. The each Reaction's first re-render (2nd copy)
3. A cascading re-render triggered by `filterBySearchTerm`'s synchronous Signal writes (`selectedIndex.set`, `maxIndex.set`) during `getMenu()` evaluation (3rd copy)

To confirm hypothesis #3: if `filterBySearchTerm` calls `state.selectedIndex.set()` while the each Reaction is evaluating `getMenu()`, and if `selectedIndex` is a dependency of inner expressions (like `{classMap getTitleClasses title}` which reads `state.selectedIndex.value`), those inner Reactions would fire. If those inner Reactions somehow create new DOM or trigger the each Reaction again, it could produce extra copies.

The `hydrateEach` re-render path creates all items with `readAST`, which sets up new Reactions for inner expressions. Those Reactions evaluate their expressions on first run, which would read `selectedIndex`. If `selectedIndex` changes during the same microtask (because `filterBySearchTerm` set it), those Reactions might fire immediately, but they would just update text/attributes in place — not create new DOM.

**Bottom line: The most likely immediate cause of the 3x is that `region.clear()` on the each block's region does NOT successfully remove the server DOM nodes, combined with the each Reaction rendering the filtered list twice (once from `searchTerm` change, once from `selectedIndex`/`maxIndex` change cascading back through `getMenu()`'s Signal dependencies).**

To verify: add a `console.log` in `hydrateEach`'s Reaction to count how many times it fires per search input, and check whether `region.ownedNodes` nodes are still `isConnected` at the time `clear()` runs.

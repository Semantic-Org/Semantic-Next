## Task: Evaluate why search filtering causes 3x content duplication after hydration

Read ALL source files listed below before answering. Evaluate the current code state — do not read git history or diffs.

### Architecture Overview

This is a web component framework with its own native DOM renderer. Components render into Shadow DOM using a reactive system based on Signals and Reactions.

**Server-side rendering (SSR):** `renderToString()` produces Declarative Shadow DOM (DSD) HTML. The server renderer walks the AST and produces an HTML string with comment markers at dynamic positions.

**Client hydration:** When a server-rendered component connects, `WebComponentBase.hydrate()` walks the existing DOM using comment markers, wiring Reactions to the existing nodes. The key principle: hydration reuses server DOM rather than creating new DOM.

### The Each Loop System

The native renderer has two paths for each loops:

**Normal render** (`createEach` in renderer.js): Creates a DynamicRegion, a Reaction that evaluates items, and per-item rendering with keyed reconciliation using an item Map.

**Hydration** (`hydrateEach` in renderer.js): Creates a Reaction that evaluates items on first run (to register Signal dependencies) but skips rendering — trusting the server content. On subsequent runs, it does a full re-render of the entire list.

### The Nav-Menu Component

`nav-menu` has a `getMenu()` method that returns the menu items. When `searchable` is true and a search term is entered, `getMenu()` filters the menu via `filterBySearchTerm()`. The template iterates over `getMenu()`:

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

The search input fires an `input` event that sets `state.searchTerm`, which triggers `getMenu()` to re-evaluate (since it reads `state.searchTerm`).

### The Hydration Path for Each Loops

In `hydrateBlockDirective`, the each block:
1. Collects owned nodes between the opening `<!--sui-block:v1:N-->` and closing `<!--/sui-block:v1:N-->` markers
2. Creates a DynamicRegion with those nodes
3. Before dispatching to `hydrateEach`, calls `hydrateInnerContent` which moves owned nodes to a DocumentFragment, walks inner markers, wires inner Reactions, then moves nodes back
4. `hydrateEach` creates a Reaction: first run evaluates items (registers deps), skips render. Subsequent runs do a full re-render via `readAST`.

### The DynamicRegion

`DynamicRegion` manages a section of DOM:
- `anchor` — persistent text node marking the region's position
- `ownedNodes[]` — DOM nodes owned by this region
- `childScopes[]` — ReactionScopes for cleanup
- `setContent(fragment, scope)` — clears old content, inserts new after anchor
- `clear()` — disposes scopes, removes owned nodes

### Concrete Problems

1. After hydration, searching (typing 'g') causes the "Getting Started" section to appear THREE times. Only one instance should render.

2. On the client-only route (no SSR), the same search works correctly — one "Getting Started" section.

3. On the SSR-only route (no hydration), the menu renders correctly (no JavaScript runs, no search possible).

4. The triplication suggests three copies of the each loop content exist: possibly the original server DOM, plus content from two separate render passes.

### Questions — Evaluate Independently

**Question 1:** When `hydrateBlockDirective` processes the each block, it calls `hydrateInnerContent` on the owned nodes BEFORE calling `hydrateEach`. `hydrateInnerContent` wires Reactions to the existing server DOM. Then `hydrateEach` creates ANOTHER Reaction for the list. When the search term changes and the each Reaction fires, does `region.setContent()` properly dispose the inner Reactions from `hydrateInnerContent`? Or do those inner Reactions persist and continue updating the (now removed) server DOM while the each Reaction creates fresh DOM?

**Question 2:** The `hydrateEach` Reaction skips rendering on `firstRun`. But `hydrateInnerContent` already wired Reactions to the server DOM. When the each Reaction fires on a subsequent run and calls `region.setContent(newFragment, newScope)`, does `region.clear()` properly clean up the hydration-wired content? Specifically, are the nodes from `hydrateInnerContent` in `region.ownedNodes`?

**Question 3:** Could there be a timing issue where the each block's owned nodes are moved to a DocumentFragment (by `hydrateInnerContent`), then moved back, but the DynamicRegion's `ownedNodes` array doesn't reflect the final state? If `ownedNodes` is stale, `region.clear()` might not remove the server DOM when new content is inserted.

**Question 4:** The `hydrateBlockDirective` code creates the DynamicRegion, runs `hydrateInnerContent`, then dispatches to `hydrateEach`. The region's `ownedNodes` is updated after `hydrateInnerContent`. But `hydrateEach` creates a Reaction whose subsequent runs call `region.setContent()`. Does `setContent` clear the correct set of nodes?

### Source Files to Read
- `packages/renderer/src/engines/native/renderer.js` — hydrateBlockDirective(), hydrateEach(), hydrateInnerContent(), createEach() (for comparison with normal render path)
- `packages/renderer/src/engines/native/dynamic-region.js` — DynamicRegion.setContent(), clear()
- `packages/renderer/src/engines/native/reaction-scope.js` — ReactionScope disposal
- `packages/component/src/engines/native/base.js` — hydrate() method
- `src/components/nav-menu/nav-menu.js` — getMenu(), filterBySearchTerm()
- `src/components/nav-menu/nav-menu.html` — template with nested each loops and snippets

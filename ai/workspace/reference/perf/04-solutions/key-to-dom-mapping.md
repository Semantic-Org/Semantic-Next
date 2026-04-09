# Key-to-DOM Mapping for Per-Item Each Hydration

## Problem Statement

The current `hydrateEach` implementation does not perform per-item hydration. On first run it evaluates the collection expression to register signal dependencies, then skips rendering entirely (trusting the server content). On any subsequent reactive change, it **re-renders the entire list from scratch** via `readAST`, discarding all server-rendered DOM:

```js
// renderer.js:1639-1675
hydrateEach({ node, data, scope, region }) {
  scope.track(Reaction.create((comp) => {
    const rawItems = this.eval(node.over, data) || [];
    // ...
    if (comp.firstRun) {
      return; // server content is correct
    }
    // Full re-render of entire list on ANY change
    const fragment = document.createDocumentFragment();
    const listScope = scope.child();
    for (let i = 0; i < items.length; i++) {
      // ... readAST per item, no reuse
    }
    region.setContent(fragment, listScope);
  }));
}
```

Compare with `createEach` (the client-render path, line 566-655), which maintains an `itemMap` keyed by `getItemID`, reuses existing DOM for unchanged items, and only creates/removes items that actually changed.

To bridge `hydrateEach` to the same per-item granularity as `createEach`, the client must map each server-rendered item's DOM nodes to its key, so it can populate `itemMap` from the existing DOM rather than starting empty.

## What getItemID Produces

Both the native and Lit renderers share the same key derivation logic:

```js
getItemID(item, indexOrKey, collectionType) {
  if (isPlainObject(item)) {
    const key = (collectionType === 'object') ? indexOrKey : undefined;
    return key || item._id || item.id || item.key || item.hash || item._hash || item.value || indexOrKey;
  }
  if (isString(item)) { return item; }
  return indexOrKey;
}
```

Key characteristics:
- For objects: prefers semantic keys (`_id`, `id`, `key`, `hash`, `_hash`, `value`) before falling back to array index
- For strings: the string itself is the key
- For primitives (numbers, booleans): falls back to array index
- Key derivation is **deterministic given the same data** -- server and client produce identical keys from the same collection

This determinism is the foundation: the client can re-derive keys from the same data without any server-side metadata.

## What Templates Produce Per Item

From the AST and real-world templates, each item's content (`node.content`) can produce:

### Single root element (common case)
```html
{#each item in items}<li>{item}</li>{/each}
```
Server output: `<!--sui-block:v1:0--><li>Alpha</li><li>Beta</li><!--/sui-block:v1:0-->`

### Single root element with nested blocks
```html
{#each item in items}
  <menu-item active={isCurrentValue value item}>
    {#if item.icon}<ui-icon icon={item.icon}></ui-icon>{/if}
    {#if item.label}<span>{item.label}</span>{/if}
  </menu-item>
{/each}
```
Still one element per item, but inner conditionals add nested block markers.

### Multi-root content per item
```html
{#each section in getMenu}
  {>title title=section}
  {#if section.pages}<div class="content">...</div>{/if}
{/each}
```
Each item produces a snippet invocation (which expands to N nodes) plus a conditional block.

### Conditional wrapping per item
```html
{#each item in items}
  {#if item.active}<b>{item.name}</b>{else}<i>{item.name}</i>{/if}
{/each}
```
Each item is a single block directive (conditional), but the actual DOM varies per item.

### Text-only content
```html
{#each item in items}{item}, {/each}
```
Each item produces a text node and a comma -- no element wrappers.

## Approach Analysis

### Approach A: Re-evaluate collection + static AST node counting

**Idea:** The client already has the data (it evaluates the collection on first run). Count how many top-level DOM nodes each item should produce by analyzing the AST statically, then slice the server-rendered `ownedNodes` accordingly.

**Why it exists as a candidate:** It requires zero server-side changes -- no extra bytes over the wire.

**Why it fails:** The AST node count is not static. A template like `{#each item in items}{#if item.active}<b>{item.name}</b>{else}<i>{item.name}</i>{/if}{/each}` produces exactly 1 node per item in this case, but the count depends on which conditional branch was taken and what the branch contains. More critically, snippet invocations (`{>badge}`) expand to an unpredictable number of DOM nodes depending on their own content and nested conditionals. Multi-root snippets with conditionals make static counting impossible without executing the template.

The only way to make this work would be to actually render each item's content (server-style, evaluating expressions) and count the resulting nodes -- but that defeats the purpose of hydration. You'd be doing 100% of the rendering work just to figure out where items start and end.

**Verdict: Rejected.** Unreliable for any template with conditionals or snippets inside each items.

### Approach B: Server-emitted per-item markers (<!--sui-item:KEY-->)

**Idea:** The server emits `<!--sui-item:KEY-->` before each item's content.

**Server change in `renderEach`:**
```js
for (let i = 0; i < items.length; i++) {
  const eachData = this.getEachData(items[i], i, collectionType, node);
  const itemData = { ...data, ...eachData };
  const key = this.getItemID(items[i], i, collectionType);
  html += `<!--sui-item:${key}-->`;
  html += this.renderNodes(node.content, itemData);
}
```

**Client hydration:** Walk the `ownedNodes` of the each block. Each `<!--sui-item:KEY-->` comment splits the flat node list into per-item groups. Build the `itemMap` directly.

**HTML size cost:**
- Per item: `<!--sui-item:KEY-->` = 16 bytes + key length
- A typical list of 50 items with `id` keys averaging 8 chars: 50 * 24 = **1,200 bytes**
- A list of 200 items: **4,800 bytes**

**Edge cases:**
- Multi-root items: handled naturally -- everything between consecutive `<!--sui-item:-->` markers belongs to one item
- Conditional content: handled -- the marker is before the block, not inside it
- Text-only items: handled -- the marker is a comment node, text nodes follow it
- Empty items (if conditional hides everything): still has the marker, item has zero content nodes
- Nested each loops: inner each loops are already wrapped in their own `<!--sui-block:v1:N-->...<!--/sui-block:v1:N-->` pairs, so inner item markers won't be confused with outer ones

**Complexity:** Low. ~5 lines added to `ServerRenderer.renderEach`. Client hydration scans linearly through siblings, splitting on item markers -- O(n) in total nodes.

**Verdict: Strong candidate.** Handles all cases, minimal server changes, linear scan on client.

### Approach C: Key list in closing marker metadata

**Idea:** Embed item count and key list in the closing block marker: `<!--/sui-block:v1:3:items:key1,key2,key3-->`, combined with static AST analysis to determine nodes-per-item.

**Why it exists:** Concentrates all metadata in one place, no per-item markers scattered through the HTML.

**Why it fails for the same reason as Approach A:** The key list alone is not enough. You still need to know how many DOM nodes each item produced to split the flat `ownedNodes` array. And as analyzed above, static AST analysis cannot determine that for templates with conditionals, snippets, or dynamic content. You'd also need to embed per-item node counts: `<!--/sui-block:v1:3:items:key1:5,key2:3,key3:7-->`.

At that point you're encoding more metadata than Approach B's per-item markers, it's harder to parse (comma-separated inside a comment), and it requires buffering the entire list before emitting the closing marker (incompatible with streaming). The per-item markers in Approach B are emitted incrementally as each item renders.

**Variant -- key list + node counts:** `<!--/sui-block:v1:3:k:id1/5,id2/3,id3/7-->` encodes key and node count per item. Parsing cost is similar. But it concentrates a potentially large string (200 items * ~12 chars = 2,400 chars) in a single comment node, which some HTML parsers handle less efficiently than distributed markers. And it's fragile: if a browser strips or reformats comments, one broken comment loses ALL item boundaries vs. only one item boundary with per-item markers.

**Verdict: Rejected.** Either requires unsolvable static node counting, or encodes more data in a harder-to-parse format than Approach B.

### Approach D: Data-attribute stamping (data-sui-key on root elements)

**Idea:** Stamp `data-sui-key="KEY"` on the first element of each item's content.

**Server change:** After rendering each item, find its first element node and add the attribute.

**Why it exists:** Attributes are more "structural" than comments -- they survive more HTML transformations and are queryable via `querySelector`.

**Why it fails:**
1. **Text-only items have no element:** `{#each item in items}{item}, {/each}` produces text nodes. There's nothing to stamp an attribute on.
2. **Multi-root items with leading text/comments:** If the first node isn't an element, the attribute must go on... where? A wrapper div would change the DOM structure, breaking CSS selectors and layout.
3. **Component root elements:** Stamping `data-sui-key` on a `<menu-item>` or `<ui-icon>` adds an observed attribute to a custom element, potentially triggering its `attributeChangedCallback` and causing unexpected behavior.
4. **Single-root but conditional:** `{#each item in items}{#if item.active}<b>{item.name}</b>{else}<i>{item.name}</i>{/if}{/each}` -- the "first element" is actually inside a block directive. The attribute would need to be stamped on the conditional's rendered output, which means the server must track item boundaries during recursive rendering.

**Verdict: Rejected.** Fails on text-only and multi-root items, interferes with custom element lifecycle.

## Recommendation: Approach B -- Per-Item Comment Markers

### Rationale

1. **Universality:** Comment markers handle every template shape -- single root, multi-root, text-only, conditional, snippet, nested blocks. They sit outside the content and don't interfere with any element's semantics.

2. **Consistency with existing patterns:** The codebase already uses paired comment markers for every block directive (`<!--sui-block:v1:N-->...<!--/sui-block:v1:N-->`). Per-item markers extend this pattern naturally: `<!--sui-item:KEY-->` sits between the block opening and closing markers, one per item. The hydration walker already knows how to scan siblings and match comments.

3. **Minimal implementation surface:**
   - Server: ~5 lines in `ServerRenderer.renderEach` to emit the marker before each item
   - Client: `hydrateEach` replaces the current "skip on first run, full re-render on change" with "scan item markers, build itemMap, transition to keyed reconciliation" -- mirroring `createEach`'s existing logic

4. **Streaming-compatible:** Markers are emitted incrementally as each item renders. No buffering required.

5. **HTML size cost is negligible:**
   - 50-item list with average 8-char keys: ~1.2 KB of markers
   - Compare to the item content itself (typically 100-500 bytes per item): markers add 5-20% overhead
   - Compresses extremely well with gzip/brotli (repetitive `<!--sui-item:` prefix)
   - The alternative (no markers, full list re-render on first change) costs far more: a 50-item list re-render means 50x `readAST` + 50x fragment creation + 50x DOM insertion. The ~1.2 KB of markers prevents that entire operation

6. **Hydration speed benefit is concrete:**
   - Without markers: first reactive change touching the collection triggers `readAST` for every item, discards all server-rendered DOM, re-creates everything. For a 50-item nav menu, that's ~50 `readAST` calls + DOM tree creation
   - With markers: `hydrateEach` builds `itemMap` from existing DOM on first run (one linear scan, O(n) in DOM nodes). Subsequent changes use keyed reconciliation -- only changed/added/removed items touch the DOM. A single item addition is 1 `readAST` call instead of 50

### Marker Format

```
<!--sui-item:KEY-->
```

Where KEY is the string output of `getItemID`. For object items this is typically `id`, `_id`, `key`, etc. For string items it's the string itself. For index-based fallback it's the numeric index.

Special characters in keys (unlikely but possible) should be escaped. Since this is inside an HTML comment, the only forbidden sequences are `--` and `>`. A simple encoding: replace `-` with `-d` and `>` with `-g` (with `-` as the escape character). This handles edge cases without adding complexity to the common path where keys are alphanumeric.

### Server-Side Changes

In `ServerRenderer.renderEach` (server.js, lines 232-257):

```js
renderEach(node, data, scope) {
  const id = scope.entryId++;
  let html = `<!--${BLOCK_MARKER}${id}-->`;

  const rawItems = this.evaluator.lookupExpressionValue(node.over, data) || [];
  const collectionType = isArray(rawItems) ? 'array' : 'object';
  const items = (collectionType === 'object') ? arrayFromObject(rawItems) : rawItems;

  if (isEmpty(items) && node.elseContent) {
    html += this.renderNodes(node.elseContent, data);
  }
  else {
    for (let i = 0; i < items.length; i++) {
      const eachData = this.getEachData(items[i], i, collectionType, node);
      const itemData = { ...data, ...eachData };
      const key = this.getItemID(items[i], i, collectionType);  // NEW
      html += `<!--sui-item:${key}-->`;                          // NEW
      const itemEvaluator = new ExpressionEvaluator({ data: itemData, helpers: this.helpers });
      const savedEvaluator = this.evaluator;
      this.evaluator = itemEvaluator;
      html += this.renderNodes(node.content, itemData);
      this.evaluator = savedEvaluator;
    }
  }

  html += `<!--/sui-block:v1:${id}-->`;
  return html;
}
```

Note: `getItemID` needs to be added to `ServerRenderer` (or extracted to a shared utility). The logic is identical to the client's `Renderer.getItemID`.

### Client Hydration Changes

Replace the current `hydrateEach` (which does full re-render on any change) with a version that:

1. On first run: scans `ownedNodes` for `<!--sui-item:KEY-->` markers, groups nodes between markers, populates `itemMap` with `{ nodes, itemSignal, scope }` per item
2. On subsequent runs: uses the same keyed reconciliation as `createEach` -- reuse existing items by key, create new ones, remove stale ones

The inner content of each item (expressions, conditionals, nested blocks) has already been hydrated by `hydrateInnerContent` during the block directive processing in `hydrateBlockDirective`. The per-item marker scanning only needs to know node boundaries, not parse inner content.

### Impact on Existing Tests

All existing hydration tests pass without modification -- the per-item markers are additional comments that the test helpers strip:
```js
function shadowHTML(el) {
  return el.shadowRoot.innerHTML
    .replace(/<!--[\s\S]*?-->/g, '')  // strips all comments including sui-item markers
    .replace(/\s+/g, ' ')
    .trim();
}
```

New tests should verify:
- Per-item hydration preserves DOM nodes when a single item is added/removed
- Keyed reconciliation works after hydration (reorder, insert, delete)
- Multi-root items are correctly grouped
- Empty list -> non-empty list transition works
- Non-empty list -> empty list (else content) works
- Nested each loops have independent item markers

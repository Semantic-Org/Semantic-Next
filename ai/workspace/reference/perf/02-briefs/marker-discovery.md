## Task: Evaluate approaches to locating dynamic binding positions in server-rendered DOM during hydration

Read all source files listed below before answering. Evaluate the current code, not git history.

### Architecture Overview

This framework renders web components on the server as HTML strings with Declarative Shadow DOM. The server embeds comment markers at dynamic positions so the client can find them during hydration:

- Text expressions: `<!--sui:v1:N-->` followed by the evaluated text value
- Block directives (if, each, async): `<!--sui-block:v1:N-->...<!--/sui-block:v1:N:bX-->`
- Attribute expressions: evaluated inline on the server (no markers in the HTML)

The server produces these markers through pure string concatenation in `ServerRenderer.renderNodes()`. No DOM is involved on the server.

On the client, hydration needs to find these markers in the live DOM and wire reactive bindings at each position. There are currently multiple DOM traversal passes:

### Current Marker Discovery Process

**Pass 1 — Attribute bindings (`hydrateAttributes`):**
Since attribute expressions are evaluated inline by the server (no markers in the HTML), the client cannot find them by scanning the real DOM. Instead, it:
1. Calls `buildHTMLString(ast)` to produce the HTML string *with* attribute markers (`__sui0__`)
2. Parses that string into a reference DOM via `template.innerHTML`
3. Walks both the reference DOM and real DOM in parallel using two TreeWalkers (SHOW_ELEMENT)
4. For each element in the reference DOM that has `__suiN__` in its attributes, wires a Reaction on the corresponding real DOM element
5. Block-owned elements must be identified and skipped to keep the walkers aligned — this requires a third TreeWalker pass to mark block-owned elements

**Pass 2 — Text and block markers (`hydrateMarkers`):**
1. TreeWalker with SHOW_COMMENT filter walks the shadow root
2. Tracks block nesting depth to process only top-level markers
3. For each comment marker, dispatches to the appropriate handler (hydrateTextExpression, hydrateBlockDirective)
4. Block handlers recursively call `hydrateInnerContent` → `hydrateMarkers` for nested content

### Empirical Measurements (1000-item card list, VM with 8 CPUs)

Total `hydrateMarkers`: ~14ms
- `hydrateAttributes`: ~8ms (reference DOM construction + parallel walk)
- Comment TreeWalker: ~2ms
- Chrome AI analysis flagged `nextNode` traversal as ~1ms / 5% of the hydration task

The shadow root contains ~8000+ DOM nodes at 1000 items. Multiple TreeWalker passes traverse overlapping portions of this tree.

### The Server-Client Asymmetry

The server knows exactly where every marker is — it placed them by walking the AST and concatenating strings. This positional knowledge is then discarded. The client must rediscover it by parsing the DOM.

The AST is available on the client (it's compiled once and shared). The `buildHTMLString` function is shared between server and client. The `entries` array produced by `buildHTMLString` describes every dynamic position with its type, AST node, and binding classification.

### Concrete Observations

1. `buildHTMLString` is called twice during hydration of a component with attribute bindings — once to build the `entries` array (cached on prototype), once inside `hydrateAttributes` to build the reference DOM string
2. The reference DOM is created via `template.innerHTML` which invokes the browser's HTML parser on a string that was just assembled from the AST — the same AST the client already has
3. The parallel walker in `hydrateAttributes` must skip block-owned elements because blocks are single comments in the reference DOM but expand to N elements in the real DOM
4. At 1000 items, most content is inside an `{#each}` block. The each block's inner content is NOT hydrated for attributes (the each handler uses a coarse teardown-and-rebuild strategy). So the 8ms `hydrateAttributes` cost is for the top-level template expressions only.

### Questions — Evaluate Independently

**Question 1:** Before proposing alternatives, explain why the current marker-based approach exists and what properties it provides. Then: the server produces markers by string concatenation, the client discovers them by DOM traversal. Map out the fundamentally different strategies for bridging this gap, with tradeoffs for each.

**Question 2:** The reference DOM in `hydrateAttributes` exists because attribute markers aren't in the server HTML. Read the code to understand exactly what information the reference DOM provides that the real DOM doesn't. What are the different ways to bridge that information gap, and what are their tradeoffs?

**Question 3:** There are multiple TreeWalker passes during hydration (element walker, comment walker, block-owned-element walker). Map out what each pass does, what information it collects, and what constraints drive the separation. What are the architectural options for this traversal work?

**Question 4:** Are there approaches from other frameworks (Solid, Svelte, Qwik, Marko) for hydration marker discovery that could inform improvements here? How do they solve the "find where to wire bindings in server-rendered DOM" problem?

### Source Files to Read
- `packages/renderer/src/engines/native/renderer.js` — Renderer: hydrateMarkers, hydrateAttributes, hydrateTextExpression, hydrateBlockDirective, hydrateInnerContent
- `packages/renderer/src/build-html-string.js` — buildHTMLString: marker format, analyzePosition, entries array structure
- `packages/renderer/src/engines/native/server.js` — ServerRenderer: renderNodes, renderExpression, marker embedding
- `packages/renderer/src/engines/native/dynamic-region.js` — DynamicRegion

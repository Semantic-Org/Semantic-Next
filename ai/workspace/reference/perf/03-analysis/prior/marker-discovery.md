# Prior View: Marker Discovery

Written before reviewing agent reports.

## My current understanding

The server produces markers via string concatenation. The client finds them via TreeWalker DOM traversal. For attribute bindings specifically, the client builds a *second* DOM from the AST's buildHTMLString output just to find where attribute markers would be, because the server evaluates attributes inline (no markers in the HTML).

The fundamental tension: the server has perfect positional knowledge (it placed every marker), but discards it. The client must rediscover it by parsing the live DOM.

## What I think the options are

**1. Status quo (TreeWalker)** — browser-native, correct, scales linearly with DOM size. Multiple passes (elements, comments, block-owned elements) traverse overlapping portions of the tree.

**2. AST-DOM lockstep walk** — instead of scanning for markers, walk the AST and the real DOM simultaneously. The AST tells you the structure, so you know "the next dynamic position is an attribute on the 3rd child element" without scanning. This is essentially what hydrateAttributes already does with the reference DOM, but using the AST directly instead of building a second DOM. The challenge is block directives — the AST has one node where the DOM has N nodes (the block's rendered content), so the walker needs to skip correctly.

**3. Server-encoded positions** — embed a compact manifest of marker positions in the DSD (e.g., as a JSON data attribute on the host element). The client reads it and jumps directly to positions. Adds bytes to the HTML payload but eliminates traversal.

**4. Single-pass walker** — consolidate the element and comment walkers into one SHOW_ALL pass that handles both types. Reduces total traversal but adds branching per node.

## Where I'm uncertain

- Whether the reference DOM for hydrateAttributes is actually necessary. The entries array from buildHTMLString already knows the binding type (attribute vs text, boolean vs quoted, property vs event) for each expression. Could we walk the real DOM's elements in order and match them against the entries by index? The block-skipping problem makes this hard — you'd need to know how many real elements correspond to each block.

- Whether server-encoded positions would be cheaper than TreeWalker. The browser's TreeWalker is native code, potentially faster than JS parsing a JSON manifest and doing indexed lookups.

- I haven't thought deeply about the WASM angle. My instinct is it's overkill for this — the bottleneck is DOM access (which WASM can't speed up because it still goes through the same DOM APIs), not JS computation.

## What I'd do today

Eliminate the reference DOM in hydrateAttributes by walking the real DOM in parallel with the entries array. The entries know the types; the DOM walk provides the elements. Block-owned elements need to be skipped, but we already do that — just without the redundant innerHTML parse.

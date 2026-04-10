Renderer Performance Review — Council Synthesis
This synthesis draws from five independent expert analyses and their cross-evaluations. The recommendations are ordered by impact on component rendering time, with attention to correctness, alignment with the upcoming safety: 'freeze' signal default, and the hydration marker work.

P0 — Critical Hot-Path Fixes
1. Fix createItemDataProxy — eliminate redundant clones and tracking in get trap
This is the single highest-impact change identified. Every property access on an each-item proxy currently triggers a full itemSignal.value read, which both deep-clones the entire each-data object and re-registers a dependency. If an expression inside an each body reads item.name, item.price, item.id, that's 3 clones of the same object in the same Reaction tick.

// Current — clones + tracks on every property access
createItemDataProxy(parentData, itemSignal) {
  return new Proxy(parentData, {
    get(target, prop) {
      if (prop === '__isItemProxy') { return true; }
      if (typeof prop === 'symbol') { return target[prop]; }
      const itemData = itemSignal.value;  // ← clone + dependency per access
      if (prop in itemData) { return itemData[prop]; }
      return target[prop];
    },
    has(target, prop) {
      if (prop === '__isItemProxy') { return true; }
      const itemData = itemSignal.peek(); // ← peek() still clones!
      return (prop in itemData) || (prop in target);
    },
  });
}
// Fixed — single dependency registration, no clone
createItemDataProxy(parentData, itemSignal) {
  return new Proxy(parentData, {
    get(target, prop) {
      if (prop === '__isItemProxy') { return true; }
      if (typeof prop === 'symbol') { return target[prop]; }
      itemSignal.depend();                    // idempotent within a Reaction
      const itemData = itemSignal.currentValue; // raw read, no clone
      if (prop in itemData) { return itemData[prop]; }
      return target[prop];
    },
    has(target, prop) {
      if (prop === '__isItemProxy') { return true; }
      const itemData = itemSignal.currentValue; // no clone, no tracking
      return (prop in itemData) || (prop in target);
    },
  });
}
Why depend() + currentValue and not peek(): The get trap must register the itemSignal as a dependency so Reactions re-evaluate when items change (reorder, update). peek() would silently break reactivity. depend() is idempotent within a single Reaction tick, so N property accesses still register only one dependency.

Why not .value: .value clones every time. When safety: 'freeze' lands, frozen values are safe to return by reference. Today, this is safe because the proxy only returns individual properties — it never exposes the container object to userland for mutation.

Impact: For a list of 100 items with 5 expressions each reading 3 properties, this eliminates ~1,500 unnecessary deep clones per render.

2. Fix Signal.peek() — should not clone
// Current
peek() {
  return this.maybeClone(this.currentValue);
}

// Fixed
peek() {
  return this.currentValue;
}
peek() exists specifically for non-tracking reads. Cloning on peek defeats its purpose. The has() trap in createItemDataProxy uses peek() on every property-name lookup during expression evaluation — this creates a deep clone just to check property existence.

When safety: 'freeze' lands, this is correct by construction (frozen values are immutable). Today, it's a behavioral change for users who mutate peek'd values, but framework-internal callers never mutate — they read.

3. Migrate each-item signal to safety: 'none'
// Current
const itemSignal = new Signal(eachData, { allowClone: false });

// Updated — signals intent for freeze rewrite
const itemSignal = new Signal(eachData, { safety: 'none' });
This is a direct mapping from the signal performance plan's "Known callsites requiring safety: 'none'" section. Even if the safety preset system hasn't fully landed, this signals the correct intent and will be a no-op migration when it does.

4. Don't create unused text node in DynamicRegion constructor
// Current — creates a text node that every caller immediately overwrites
constructor(parentNode, referenceNode) {
  // ...
  this.anchor = document.createTextNode('');
}

// Fixed
constructor(parentNode, referenceNode) {
  // ...
  this.anchor = null;
}
Every call site immediately does region.anchor = document.createTextNode('') or region.anchor = marker. The constructor's text node is immediately garbage-collected. One wasted DOM allocation per block directive.

P1 — High-Impact Structural Changes
5. Split eval() into tracked vs direct evaluation
Every expression in the renderer calls this.eval(), which unconditionally registers this.dataDep as a dependency. For top-level components, dataDep never changes — Reactions track individual Signals directly. This wastes a dependency slot in every Reaction's dependencies Set.

// Remove the current eval()
// Add two specialized methods:

evalDirect(expression, data) {
  return this.evaluator.lookupExpressionValue(expression, data);
}

evalTracked(expression, data) {
  this.dataDep.depend();
  return this.evaluator.lookupExpressionValue(expression, data);
}
Usage rule:

evalDirect — top-level component bindings, each-item content, conditionals, most expressions
evalTracked — only inside createSubtemplate and hydrateSubtemplate where setDataContext + bumpDataVersion is the update mechanism
Minimal alternative if you don't want two methods yet:

// In constructor:
this.tracksDataVersion = inheritsData && !!this.template?.parentTemplate;

eval(expression, data) {
  if (this.tracksDataVersion) this.dataDep.depend();
  return this.evaluator.lookupExpressionValue(expression, data);
}
Impact: For a component with 30 expressions, this removes 30 unnecessary dependency registrations and their cleanup costs on every reactive flush.

6. Reuse comment markers as DynamicRegion anchors
// Current — in createConditional, createEach, createAsync, createRerender, createSubtemplate:
const region = new DynamicRegion(parentNode, null);
region.anchor = document.createTextNode('');
marker.replaceWith(region.anchor);

// Fixed:
const region = new DynamicRegion(marker);
// Comment stays in the DOM — DynamicRegion.setContent uses anchor.after(fragment)
This eliminates one document.createTextNode() + one .replaceWith() DOM mutation per block directive. For a template with 15 block directives, that's 30 DOM operations saved. In an {#each} rendering 1,000 items with nested conditionals, the savings compound significantly.

Bonus: DevTools shows <!--sui-block:5--> instead of anonymous empty text nodes, making debugging dramatically easier.

Cascading simplification of DynamicRegion:

class DynamicRegion {
  constructor(anchor) {
    this.anchor = anchor;
    this.ownedNodes = [];
    this.childScopes = [];
    this.endAnchor = null;
  }
  // Remove parentNode, referenceNode, placeAnchor()
}
7. Fix DynamicRegion.clear() — endAnchor leaks into the DOM
This is an actual bug, not just a performance issue. setContent creates an endAnchor text node and inserts it after the last content node. But clear() only removes ownedNodes — it never removes endAnchor. If a conditional switches content → empty → content, the orphaned endAnchor accumulates in the DOM.

clear() {
  for (const scope of this.childScopes) { scope.dispose(); }
  this.childScopes = [];
  for (const node of this.ownedNodes) { node.remove(); }
  this.ownedNodes = [];
  if (this.endAnchor) { this.endAnchor.remove(); } // ← add this
}
8. Coalesce notifyUpdate with queueMicrotask
// Current — new macrotask per notification, no dedup
this.notifyUpdate = () => {
  setTimeout(() => {
    this.template?.onUpdated?.();
  }, 0);
};

// Fixed — coalesced microtask
this._updateScheduled = false;
this.notifyUpdate = () => {
  if (this._updateScheduled) return;
  this._updateScheduled = true;
  queueMicrotask(() => {
    this._updateScheduled = false;
    this.template?.onUpdated?.();
  });
};
queueMicrotask is faster than setTimeout(fn, 0) (no 4ms clamping, no task queue overhead), and the flag prevents redundant onUpdated calls when multiple async blocks resolve in the same tick. Alternatively, use Reaction.afterFlush if you want consistency with the reactivity scheduler.

9. Skip Reactions entirely for literal expressions
Literal expressions like {42}, {'hello'}, {true} are wrapped in Reactions despite never changing. Each one allocates a Reaction, registers it with a scope, and adds dependency management overhead — all for a value that is known at compile time.

bindTextExpression(comment, entry, data, scope) {
  const exprNode = entry.node;
  const parent = comment.parentNode;

  // Short-circuit: pure literals need no reactive overhead
  if (exprNode.literalValue != null) {
    const textNode = document.createTextNode(
      this.evaluator.lookupTokenValue(exprNode.value, data) ?? ''
    );
    parent.replaceChild(textNode, comment);
    return;
  }

  // ... existing dynamic binding code
}
Apply the same optimization to single-expression attribute bindings where singleEntry?.node.literalValue is present.

10. Replace inArray array allocations in attribute binding hot path
// Current — allocates arrays on every Reaction tick
if (inArray(attrName, ['checked', 'selected'])) { ... }
if (inArray(attrName, ['value'])) { ... }

// Fixed — module-level constants, O(1) lookup
const BOOL_ATTRS = new Set(['checked', 'selected']);
const VALUE_ATTRS = new Set(['value']);

// In Reaction:
if (BOOL_ATTRS.has(attrName)) { ... }
if (VALUE_ATTRS.has(attrName)) { ... }
Or even simpler since the sets are tiny:

if (attrName === 'checked' || attrName === 'selected') { ... }
else if (attrName === 'value') { ... }
P2 — Architectural Improvements
11. Remove __isItemProxy — thread explicit context
Replace the magic property with an explicit parameter:

readAST({ ast, data, scope, isSVG = this.isSVG, isReactiveContext = false })
When createEach calls readAST for item content, pass isReactiveContext: true. Flow this through to unpackNodeData:

unpackNodeData(node, data, { isReactiveContext = false } = {}) {
  // ...
  each(node.data, (expr, key) => {
    templateData[key] = isReactiveContext
      ? this.evaluator.lookupExpressionValue(expr, data)
      : Reaction.nonreactive(() => this.evaluator.lookupExpressionValue(expr, data));
  });
}
Then remove __isItemProxy from createItemDataProxy entirely. The Proxy becomes a clean data bridge with no framework-specific properties.

12. Cache buildHTMLString output per AST
static astStringCache = new WeakMap();

buildHTMLString(ast, isSVG) {
  const cached = Renderer.astStringCache.get(ast);
  if (cached) return cached;
  const result = buildHTMLStringPure(ast, { snippets: this.snippets, isSVG });
  Renderer.astStringCache.set(ast, result);
  return result;
}
Since ASTs are frozen prototypes compiled once per component definition, the resulting { htmlString, entries } is identical for every instance. This skips the recursive string assembly on every readAST call inside {#each} loops.

Subtlety: If snippets can vary per-renderer instance, the cache key needs to account for snippet state. If snippets are always definition-stable (compiler-hoisted), WeakMap by AST identity is safe.

13. Make buildHTMLString static / pure and extract snippet registration
static buildHTMLString(ast, options = {}) {
  return buildHTMLStringPure(ast, options);
}
Hoist snippet registration out of buildHTMLString — it's currently a side effect in a conceptually pure function. Return snippets as part of the output:

// In buildHTMLStringPure:
return { htmlString, entries, snippets };
The caller merges snippets before binding. This enables SSR to import buildHTMLString without instantiating a Renderer.

14. Eliminate inline array allocation in bindMarkers attribute collection
// Current — allocates attrsToProcess array per element
const attrsToProcess = [];
for (let i = 0; i < element.attributes.length; i++) {
  if (attr.value.includes(ATTR_MARKER_PREFIX)) {
    attrsToProcess.push({ name: attr.name, value: attr.value });
  }
}
for (const { name, value } of attrsToProcess) { /* ... */ }

// Fixed — process inline, no intermediate array
for (let i = 0; i < element.attributes.length; i++) {
  const attr = element.attributes[i];
  if (attr.value.includes(ATTR_MARKER_PREFIX)) {
    this.bindAttribute(element, attr.name, attr.value, entries, data, scope, processedAttrIDs);
  }
}
For a template with 50 elements and 20 dynamic attributes, this eliminates 50 array allocations.

15. Consider Object.create(parentData) for each-item contexts when node.as is present
When node.as is set, each-item data is a small structured object ({ [as]: item, [indexAs]: i }). For these cases, prototype-chain inheritance may be cheaper than a full Proxy:

if (node.as) {
  const eachData = Object.create(parentData);
  eachData[node.as] = item;
  eachData[node.indexAs || 'index'] = i;
  // Use eachData directly — no Proxy needed
}
This avoids Proxy trap overhead for every expression access. The parent data context is accessible via prototype chain. This is worth prototyping and benchmarking against the Proxy approach.

16. Defer visited Set creation in lookupExpressionValue
// Current — allocates Set for every top-level call
if (!visited) {
  visited = new Set();
  visited.add(expression);
}

// Fixed — only create when recursion is actually needed
if (!visited && expressionArray.length > 1) {
  visited = new Set();
}
if (visited) visited.add(expression);
For single-token expressions (the 90% case), this avoids a Set allocation entirely.

17. Use get({ clone: false }) in ExpressionEvaluator signal reads
In ExpressionEvaluator, multiple hot paths do value.get() or access value.value on Signals:

// In lookupTokenValue, getDeepDataValue, accessTokenValue, jsProxy handler:
if (value instanceof Signal) {
  return value.get({ clone: false });
}
This signals intent for the freeze migration. When freeze lands, these reads return frozen references with zero overhead. Today, it bypasses maybeClone on the read path while preserving dependency tracking.

Note: This is safe for framework-internal reads where the value flows to DOM writes (textNode.data, setAttribute) and is never mutated by the framework. It does change behavior for any userland code that somehow accesses these intermediate values and mutates them — but that pattern would already be broken by freeze.

P3 — Polish & Consolidation
18. Consolidate render/hydrate attribute binding logic
bindMarkers and hydrateAttributes repeat nearly identical attribute binding logic with small differences around first-run DOM writes. Extract shared helpers:

bindAttributeReaction({ element, attrName, parts, entries, data, scope, skipFirstWrite = false })
Hydration passes skipFirstWrite: true. This ensures optimizations land in both paths simultaneously and reduces code drift.

19. hydrateEach falls back to full list re-render
After hydration, the first reactive update to an each-loop's source signal throws away all server-rendered DOM and re-renders from scratch. The non-hydration createEach has keyed reconciliation. After the hydration first-run establishes dependencies, subsequent updates should hand off to createEach's reconciliation logic rather than doing a full teardown+rebuild.

20. evaluateRawTextNodes creates expensive object spreads in each loops
// Current
const eachData = node.as
  ? { ...data, [node.as]: item, ... }
  : { ...data, ...item, ... };

// Better — prototype inheritance
const eachData = Object.create(data);
if (node.as) {
  eachData[node.as] = item;
  eachData[node.indexAs || 'index'] = i;
} else {
  Object.assign(eachData, item);
  eachData.this = item;
  eachData[node.indexAs || 'index'] = i;
}
Summary Table
| Priority | # | Change | Impact | Effort | |----------|---|--------|--------|--------| | P0 | 1 | createItemDataProxy get: depend() + currentValue | Eliminates N×clone per each-item Reaction | 3 lines | | P0 | 2 | peek(): return currentValue directly | Eliminates clone per property-name check | 1 line | | P0 | 3 | safety: 'none' on itemSignal | Intent signal for freeze rewrite | 1 line | | P0 | 4 | DynamicRegion constructor: anchor = null | Eliminates garbage DOM node per block | 1 line | | P1 | 5 | Split eval into evalDirect/evalTracked | Removes wasted dependency slots | 10 lines | | P1 | 6 | Reuse comment markers as anchors | Eliminates 2 DOM ops per block directive | ~15 lines | | P1 | 7 | Fix endAnchor leak in clear() | Fixes DOM leak (bug) | 1 line | | P1 | 8 | Coalesce notifyUpdate with queueMicrotask | Prevents redundant onUpdated calls | 8 lines | | P1 | 9 | Skip Reactions for literal expressions | Eliminates Reaction alloc for static values | 8 lines | | P1 | 10 | inArray → Set.has / direct comparison | Eliminates array allocs in Reaction ticks | 6 lines | | P2 | 11 | Remove __isItemProxy, thread isReactiveContext | Cleans up proxy, reduces trap overhead | 20 lines | | P2 | 12 | Cache buildHTMLString per AST (WeakMap) | Skips string assembly in each loops | 10 lines | | P2 | 13 | buildHTMLString static + snippet extraction | Purity, SSR readiness | Refactor | | P2 | 14 | Inline attribute processing (no intermediate array) | Eliminates per-element array allocation | Refactor | | P2 | 15 | Object.create(parentData) for node.as each items | Eliminates Proxy overhead for common case | 15 lines | | P2 | 16 | Defer visited Set in expression evaluator | Avoids Set alloc for simple expressions | 5 lines | | P2 | 17 | get({ clone: false }) in ExpressionEvaluator | Signals freeze intent, avoids clone on read | 8 lines | | P3 | 18 | Consolidate render/hydrate binding logic | Maintainability, optimization parity | Medium | | P3 | 19 | hydrateEach → keyed reconciliation after first run | Prevents full list re-render on first update | Significant | | P3 | 20 | Object.create in evaluateRawTextNodes each loops | Avoids object spreads in loops | 8 lines |

The single biggest win is #1 + #2 combined — fixing the each-item proxy to avoid redundant cloning. This is the innermost loop of list rendering and affects every property access of every expression in every list item.

The single biggest structural win is #5 — splitting eval into tracked vs direct. It removes unnecessary dependency overhead from the most common rendering path and matches the architecture's explicit design intent that direct signal tracking is the primary reactivity mechanism.

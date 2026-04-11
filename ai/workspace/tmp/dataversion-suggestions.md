Council Synthesis: Reactivity Profile Review — dataVersion, Signal Usage, and Granularity
Why dataVersion Exists
The rendering engine has two fundamentally different reactive models coexisting:

Fine-grained Signal tracking — expressions that read Signals directly (state, settings, computed values). The Reaction automatically registers a dependency on the exact Signal it reads. When that Signal changes, only that Reaction re-evaluates.

Coarse-grained context rebinding — expressions whose inputs are plain object properties, passed down as part of a merged data context. No Signal was read, so no fine-grained dependency exists.

dataVersion (now this.dataDep, a raw Dependency) is the invalidation channel for case 2. It exists to solve one specific architectural gap:

When a parent template updates the data context of a subtemplate via setDataContext() + render(), the subtemplate's existing Reactions have no way to know that their plain-object inputs changed. bumpDataVersion() is the coarse signal that tells every subscribing Reaction: "your context may have changed — re-evaluate."

The concrete flow
Parent changes data for subtemplate
  → Template.render() (re-render path, already rendered)
    → renderer.setData(newContext)
    → renderer.bumpDataVersion()
      → this.dataDep.changed()
        → ALL Reactions that called this.dataDep.depend() are invalidated
This is necessary because setDataContext uses assignInPlace(this.data, data) — it preserves object identity and mutates contents. That's invisible to fine-grained dependency tracking unless you have a coarse dependency like dataDep.

Why raw Dependency is correct
The migration from Signal to raw Dependency (already shipped) is architecturally right. dataVersion is not state with value semantics — it's an invalidation pulse. Using Signal for this would unnecessarily involve equality checking, cloning/freezing concerns, and .get()/.set() semantics for a meaningless "value." This principle should be maintained going forward:

Signal → actual value state (something with meaningful reads/writes)
Dependency → invalidation-only channels (version bumps, tracking pulses)
Where dataVersion IS Necessary
To be explicit about the places where dataDep tracking cannot be removed:

| Context | Why it needs dataDep | |---------|----------------------| | Subtemplate expression bindings | Data comes from a parent and may be replaced wholesale via setDataContext. No individual Signal changed — dataDep is the only notification path. | | The createSubtemplate parent-side Reaction | Must re-run when parent data changes to re-evaluate template identity and recompute passed data. The explicit this.dataDep.depend() in this Reaction is correct. |

Snippets do not need their own dataDep tracking — they are inlined at render time and inherit whatever reactive context they're rendered in.

Where dataVersion is NOT Necessary
| Context | Why it doesn't need dataDep | |---------|------------------------------| | Top-level component bindings | Expressions read actual Signals (state, settings overlays). Signals provide direct fine-grained notification. | | Each-item body bindings | Each item gets its own itemSignal + Proxy. The loop Reaction tracks the collection; item Reactions track the item signal. | | Event/property bindings resolving from signalized sources | Same principle as top-level — direct dependency tracking suffices. | | Conditional/async/rerender block conditions (in top-level components) | The condition expression reads Signals directly. |

The Core Problem: eval() Unconditionally Subscribes to dataDep
This is the single most impactful issue in the current reactivity profile:

eval(expression, data) {
  this.dataDep.depend();  // ← every Reaction subscribes to this
  return this.evaluator.lookupExpressionValue(expression, data);
}
Every text binding, attribute binding, conditional, each-over expression, async expression, and rerender expression goes through this.eval(). This means every Reaction in the renderer — regardless of whether it actually needs coarse invalidation — carries dataDep in its dependency Set.

Concrete costs
Wasted dependency slot: For a component with 50 expressions, that's 50 Reactions each carrying a dependency that never fires (for top-level components).

Spurious invalidation cascade: When Template.render() is called on the re-render path:

if (!this.rendered) {
  this.html = this.renderer.render();
} else {
  this.renderer.bumpDataVersion();  // ← broadcasts to ALL subscribing Reactions
}
For web components, the Signal that changed already notified its specific Reactions. The bumpDataVersion() then also invalidates every Reaction. For a component with 50 bindings where 1 Signal changed, this turns 1 targeted re-evaluation into 50 re-evaluations. The DOM writes are skipped (good — attribute/text comparisons prevent actual DOM mutations), but the evaluation work is not.

Subtemplate amplification: Inside subtemplates, dataDep collapses the per-expression reactivity model entirely. If you pass { count: someValue } to a subtemplate with 100 bindings, updating count re-evaluates all 100 expressions. If that subtemplate contains nested subtemplates, bumpDataVersion cascades downward.

Findings and Recommendations
1. Make dataDep Tracking Selective (Highest Impact)
Problem: eval() unconditionally calls this.dataDep.depend(), subscribing every Reaction to the coarse channel.

Recommendation: Add a renderer-level flag that determines whether expressions should track dataDep:

constructor({ ..., tracksDataVersion = false }) {
  this.tracksDataVersion = tracksDataVersion;
}

eval(expression, data) {
  if (this.tracksDataVersion) {
    this.dataDep.depend();
  }
  return this.evaluator.lookupExpressionValue(expression, data);
}
Set tracksDataVersion: true only when constructing a Renderer for a subtemplate whose data comes from a parent. For top-level components and each-item bodies, it stays false.

Where explicit tracking is still needed (e.g., the createSubtemplate parent-side Reaction), call this.dataDep.depend() directly rather than relying on eval().

Expected impact: The vast majority of Reactions (~90%+) no longer subscribe to dataDep. bumpDataVersion() becomes nearly free for normal components.

2. Don't bumpDataVersion() on Every Re-render (High Impact)
Problem: Template.render() calls bumpDataVersion() unconditionally on the re-render path, even when the update was triggered by a Signal that already notified its Reactions.

Recommendation: Only bump when the data context has actually been replaced. The simplest approach: let setDataContext set a dirty flag, and only bump if dirty:

setDataContext(data, { rerender = true } = {}) {
  assignInPlace(this.data, data);
  this._dataContextDirty = true;
  if (rerender) {
    this.rendered = false;
  }
}

// In render():
if (!this.rendered) {
  this.html = this.renderer.render();
} else if (this._dataContextDirty) {
  this._dataContextDirty = false;
  this.renderer.bumpDataVersion();
}
// else: Signal-driven update — Reactions already handle it
This ensures that web component re-renders triggered by Signal changes don't broadcast unnecessary coarse invalidation. Only the subtemplate path (which calls setDataContext + render) triggers the bump.

3. Replace Each-Item itemSignal with Dependency-Backed Row Environment (High Impact)
Problem: Each-item row contexts currently use Signal(eachData, { allowClone: false }). But row contexts are binding environments, not value state. This causes:

isEqual running on synthetic row data objects on every set()
Clone/freeze semantics being applied (or explicitly bypassed) for ephemeral scope objects
The awkward same-reference mutation fallback:
else if (typeof item === 'object') {
  entry.itemSignal.notify();  // forced broadcast for mutation detection
}
Configuration coupling — the signal safety mode becomes relevant for objects that aren't really "state"
Recommendation: Replace with a raw Dependency + data store per row:

// Per row entry:
{
  nodes,
  scope,
  item,
  index,
  itemData,    // plain object — the current row context
  itemDep      // raw Dependency — the invalidation pulse
}
The item proxy becomes:

createItemDataProxy(parentData, entry) {
  return new Proxy(parentData, {
    get(target, prop) {
      if (typeof prop === 'symbol') return target[prop];
      entry.itemDep.depend();  // track at row granularity
      if (prop in entry.itemData) return entry.itemData[prop];
      return target[prop];
    },
    has(target, prop) {
      return (prop in entry.itemData) || (prop in target);
    },
  });
}
On update:

if (entry.item !== item || entry.index !== i) {
  entry.itemData = this.getEachData(item, i, collectionType, node);
  entry.item = item;
  entry.index = i;
  entry.itemDep.changed();  // simple invalidation — no isEqual, no clone
}
// With freeze-by-default: same reference = guaranteed unchanged. No notify needed.
Why this is conceptually correct: A row context in {#each} is not a stable value object — it's a binding environment. Binding environments are best invalidated by version/dependency, not deep equality. This eliminates row-context equality checks, clone/freeze concerns, and the mutation-detection fallback entirely.

4. Thread Reactive Context Explicitly, Remove __isItemProxy (Medium Impact)
Problem: __isItemProxy is a magic property on the each-item Proxy used to determine whether unpackNodeData should evaluate static data reactively or nonreactively:

templateData[key] = data.__isItemProxy
  ? this.evaluator.lookupExpressionValue(expr, data)
  : Reaction.nonreactive(() => this.evaluator.lookupExpressionValue(expr, data));
This encodes reactivity rules in the shape of a proxy object — an abstraction leak.

Recommendation: Thread context explicitly:

readAST({ ast, data, scope, isSVG, isReactiveContext = false })
When createEach calls readAST for item content, pass isReactiveContext: true. This flows into unpackNodeData:

unpackNodeData(node, data, { isReactiveContext = false } = {}) {
  // ...
  each(node.data, (expr, key) => {
    templateData[key] = isReactiveContext
      ? this.evaluator.lookupExpressionValue(expr, data)
      : Reaction.nonreactive(() => this.evaluator.lookupExpressionValue(expr, data));
  });
}
Remove the __isItemProxy getter from the Proxy entirely. The Proxy becomes a clean data bridge.

5. Add Reference-Check Guard in updateSubtemplateSettings (Medium Impact)
Problem: On every render() call, updateSubtemplateSettings pushes every default setting value through the proxy setter, which triggers signal.set() and its isEqual comparison — even when the value hasn't changed:

updateSubtemplateSettings(dataContext) {
  each(this.defaultSettings, (_, name) => {
    if (name in dataContext) {
      this.settings[name] = dataContext[name]; // → proxy set → signal.set() → isEqual
    }
  });
}
Recommendation: Guard with a cheap reference check:

updateSubtemplateSettings(dataContext) {
  each(this.defaultSettings, (_, name) => {
    if (name in dataContext && dataContext[name] !== this.settings[name]) {
      this.settings[name] = dataContext[name];
    }
  });
}
Note: this.settings[name] hits the proxy getter which calls signal.get(), but updateSubtemplateSettings is called from render(), not inside a Reaction. The dependency tracking is a no-op. The reference check prevents hitting isEqual on every render for every setting.

6. Remove Same-Reference notify() in Each Under Freeze Mode (Medium Impact)
Problem: When an item is the same reference at the same index, the current code unconditionally calls entry.itemSignal.notify():

else if (typeof item === 'object') {
  entry.itemSignal.notify();
}
This is a defensive broadcast for in-place mutation detection. With freeze-by-default, mutation of frozen objects throws — so same-reference-same-index items are guaranteed unchanged.

Recommendation: Once safety: 'freeze' lands as the default, this branch becomes:

// Same frozen reference at same position — nothing could have changed.
// No action needed.
If recommendation #3 (Dependency-backed rows) is implemented, this issue disappears entirely — the Dependency is only .changed() when data actually changes.

Interaction with Upcoming Changes
Freeze-by-default (safety: 'freeze')
Strengthens recommendation #3: If Signals become more safety-oriented by default, using Signal for ephemeral row binding contexts becomes even less appropriate. You'd either pay safety/equality overhead unnecessarily or need frequent safety: 'none' escape hatches — a smell indicating the wrong primitive.
Enables recommendation #6: Same reference = guaranteed unchanged, eliminating the defensive notify() fallback.
Doesn't change the fundamental dataVersion analysis: The coarse/fine boundary is about data flow architecture, not value protection strategy.
Hydration markers for dynamic expressions
Mostly orthogonal, but: with selective dataDep tracking, hydrated subtemplates initialize fewer dependencies per Reaction, reducing memory footprint and improving hydration speed.
Where Coarse Granularity Remains Appropriate
Not every coarse invalidation should be removed. Coarse invalidation is correct at environment boundaries:

Subtemplate data context replacement — the defining case
Conditional/rerender block subtree swaps — these create fresh scopes; the parent Reaction that decides which branch to render is legitimately coarse over its condition
Async block state transitions — naturally re-render larger regions
These are semantic region boundaries. Coarse invalidation at region granularity aligns with user expectation.

Summary: Target Architecture
| Context | Tracking model | Primitive | |---------|---------------|-----------| | Top-level component expressions | Fine-grained Signal tracking only | Signals | | Subtemplate expression bindings | Fine-grained Signals + dataDep for context rebinding | Signals + Dependency | | Each-item row bindings | Per-row Dependency (not Signal) | Dependency | | Settings | Fine-grained via shadow Signals (settingsVars) | Signals | | Invalidation pulses (dataVersion, row contexts) | Raw Dependency | Dependency |

The governing principle: Signal for actual value state. Dependency for invalidation-only scopes. Top-level expressions track direct dependencies only. Subtemplate renderers may additionally track dataDep. Each-row scopes get their own per-row Dependency. Context semantics are passed explicitly, not inferred from proxy flags.

This preserves the fine-grained model where it matters while keeping coarse invalidation only at true environment boundaries — the cleanest high-level reactivity shape the current architecture can support without a fundamentally different scope model.

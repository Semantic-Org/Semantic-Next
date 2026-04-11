# Prior View: Renderer Construction

Written before reviewing agent reports.

## My current understanding

The Renderer constructor does: assign properties, collectSnippets (AST walk), hashCode (fnv1a over JSON.stringify of AST+data+isSVG), new Signal(0) for dataVersion, new ReactionScope(), new ExpressionEvaluator (stores references), create notifyUpdate closure.

The hashCode is the dominant cost at 1.4ms because it serializes the entire AST and data context to a string before hashing. The rest is cheap object allocation.

## What I think about each piece

**hashCode** — exists because the Lit renderer uses it for subtree caching. The native renderer doesn't cache subtrees, so the id is computed but never read. However, I know from the framework author that the hash design (AST + data) was deliberate for Lit — the same AST at two call sites with different data must produce different cache entries. If the native renderer eventually implements subtree caching, it will need some form of identity. The question is whether to compute it eagerly or lazily.

**collectSnippets** — walks the top-level AST for snippet definitions. The AST is compiled once and shared, so snippets are the same across all instances. But snippets are stored as instance state on the Renderer (`this.snippets`), and the same snippet can be referenced from the AST and from subtemplates. I'm not sure if there's a case where per-instance snippet collection is necessary — e.g., if subtemplate rendering adds snippets at runtime.

**ExpressionEvaluator** — stores references to data, helpers, dataVersion. No heavy construction. Could theoretically be a set of static methods, but the instance holds mutable state (data changes via setData). The Proxy in evaluateJavascript creates a new Proxy per JS eval call, not per constructor — so the constructor cost is just storing three references.

**dataVersion Signal** — new Signal(0) is cheap (one Dependency, one clone of 0). Used by bumpDataVersion for subtree propagation. Needed before hydrateMarkers runs because the eval() method reads it.

**ReactionScope** — empty arrays. Trivially cheap.

## Where I'm uncertain

- Whether collectSnippets could be hoisted to prototype/compile time. The snippets are in the AST, which is shared. But the Renderer stores them as `this.snippets` and also receives snippets via the constructor parameter (from Template). Are these the same snippets or can they differ? If they can differ per-instance, hoisting doesn't work.

- Whether the ExpressionEvaluator provides value as an instance vs. static methods. The instance pattern means each Renderer has its own evaluator with its own data reference. If the data reference changes (via setData), only that evaluator's calls see the new data. Static methods would need the data passed per-call. The instance pattern is cleaner but costs one object allocation per Renderer.

- The notifyUpdate closure is created per-instance when it could be a method. Minor.

## What I'd do today

Replace `hashCode({ ast, data, isSVG })` with a sequential counter — `this.id = ++Renderer._nextId`. Add a comment explaining that the Lit renderer uses content hashing for subtree caching but the native renderer doesn't yet. If subtree caching is implemented later, design an ID scheme that doesn't require serializing the entire data context (maybe hash AST identity + a cheap data fingerprint like Object.keys().length).

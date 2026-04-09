## Task: Evaluate the cost of Renderer instantiation and what work it performs that may be unnecessary or deferrable

Read all source files listed below before answering. Evaluate the current code, not git history.

### Architecture Overview

This framework has a swappable rendering engine architecture. Each engine registers a `renderer` class, a `serverRenderer` class, and a `factory` function. The native engine's `Renderer` class is the client-side renderer — it takes an AST and data context, and produces DOM with reactive bindings.

A new `Renderer` instance is created every time `Template.initialize()` runs. This happens:
- Once per web component during `connectedCallback` → `clone()` → `initialize()`
- Once per subtemplate when it's first rendered or when its identity changes
- During hydration, inside the `clone()` call in `hydrate()`

The Renderer constructor does the following work:

```js
constructor({ ast, data, template, subTemplates, snippets, helpers, isSVG, inheritsData, protectedKeys }) {
  this.ast = ast || [];
  this.data = data;
  this.template = template;
  this.subTemplates = subTemplates;
  this.snippets = snippets || {};
  this.collectSnippets(this.ast);     // walks top-level AST for snippet definitions
  this.helpers = helpers || {};
  this.isSVG = isSVG;
  this.inheritsData = inheritsData;
  this.protectedKeys = protectedKeys;
  this.id = hashCode({ ast, data, isSVG });  // fnv1a hash of AST + data + isSVG
  this.dataVersion = new Signal(0);
  this.scope = new ReactionScope();
  this.evaluator = new ExpressionEvaluator({ data, helpers, dataVersion });
  this.notifyUpdate = () => { setTimeout(() => { this.template?.onUpdated?.(); }, 0); };
}
```

### Empirical Measurements

From Chrome DevTools flamechart at 1000 items:
- `hashCode` (fnv1a): 1.4ms — serializes `{ ast, data, isSVG }` to a string and hashes it
- Total Renderer construction: approximately 2-3ms (includes hashCode, Signal creation, ExpressionEvaluator creation)

The `hashCode` function comes from `@semantic-ui/utils` and uses fnv1a string hashing. The input is `JSON.stringify({ ast, data, isSVG })` — for a component with a large AST or data context, this serialization is the dominant cost.

### How this.id is used across engines

- **Lit renderer:** `this.id` is used for subtree caching — `LitRenderer.getID()` is called to key cached render trees by content hash.
- **Native renderer:** Investigate how `this.id` is used (or not) by reading the native renderer source.

### ExpressionEvaluator

Created in every Renderer constructor. Contains:
- Reference to `data` (the data context object)
- Reference to `helpers` (template helper functions)
- Reference to `dataVersion` (Signal for subtree propagation)
- Static regex patterns (compiled once on the class, shared across instances)
- Methods for expression parsing and evaluation

### Related: Template.initialize() cost

The Renderer is created inside `Template.initialize()`, which also:
- Runs `createComponent()` — the user's factory function
- Creates lifecycle closures (onCreated, onRendered, onDestroyed, etc.)
- Creates a state-watching Reaction that depends on every Signal in `this.state`
- Builds `callParams` — an object with ~20 properties including `.bind()` calls
- Calls `this.onCreated()`

### Questions — Evaluate Independently

**Question 1:** Read the Renderer constructor and trace what each piece it creates is used for downstream. What is the cost model of construction, and what are the dependencies between the pieces?

**Question 2:** `collectSnippets` walks the AST on every Renderer construction. Read the code to understand what snippets are, where they come from, and how they're used. Is this per-instance work necessary?

**Question 3:** The ExpressionEvaluator holds references to `data` and `helpers`. Both of these are also stored on the Renderer itself. Is the ExpressionEvaluator doing work in its constructor beyond storing references? Could expression evaluation be a set of static methods that take data/helpers as parameters rather than requiring an instance?

**Question 4:** `hashCode({ ast, data, isSVG })` serializes the full AST and data context to compute an ID. The Lit renderer uses this for subtree caching. Before proposing alternatives, understand *why* the hash includes both AST and data. Then evaluate: what are the different strategies for renderer identification, and what does each enable or preclude?

### Source Files to Read
- `packages/renderer/src/engines/native/renderer.js` — Renderer constructor, collectSnippets, eval, render, hydrateMarkers
- `packages/renderer/src/engines/lit/renderer.js` — LitRenderer constructor and getID (for comparison of how id is used)
- `packages/renderer/src/expression-evaluator.js` — ExpressionEvaluator constructor and methods
- `packages/renderer/src/engines/native/reaction-scope.js` — ReactionScope
- `packages/reactivity/src/signal.js` — Signal constructor
- `packages/utils/src/crypto.js` — hashCode, fnv1a
- `packages/templating/src/template.js` — Template.initialize() (where Renderer is created)

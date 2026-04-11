# Native Renderer Directive Architecture

## Goal

Decompose the native renderer's 1700-line monolith into self-contained directive modules using a `defineBranch` pattern that mirrors `defineComponent`. Each block directive type (`{#if}`, `{#each}`, `{#async}`, `{#rerender}`, `{>template}`, `{#snippet}`) becomes its own file with standardized lifecycle hooks. Hydration collapses from separate methods into an initialization mode within the same directive.

## Design

### `defineBranch` — the directive contract

Parallels `defineComponent`: a single function call with a config object. Named lifecycle hooks, each receiving the same destructured args — take what you need.

```js
export default defineBranch({
  name: 'conditional',

  create({ node }) {
    return { branchIndex: -1 };
  },

  render({ self, node, scope, region, eval: evaluate, renderAST }) {
    const result = self.getBranch();
    self.branchIndex = result.matchIndex;
    if (result.contentAST) {
      const branchScope = scope.child();
      region.setContent(renderAST(result.contentAST, branchScope), branchScope);
    }
  },

  hydrate({ self, node, serverMeta, eval: evaluate }) {
    self.branchIndex = serverMeta?.branchIndex ?? -1;
    evaluate(node.condition); // register dependencies, trust server DOM
  },

  update({ self, node, scope, region, eval: evaluate, renderAST }) {
    // default could just call this.render() for simple cases
    const result = self.getBranch();
    if (result.matchIndex !== self.branchIndex) {
      self.branchIndex = result.matchIndex;
      if (result.contentAST) {
        const branchScope = scope.child();
        region.setContent(renderAST(result.contentAST, branchScope), branchScope);
      }
      else {
        region.clear();
      }
    }
  },

  destroy({ region }) {
    region.clear();
  },
});
```

### Lifecycle hooks

| Hook | When | Inside Reaction | Purpose |
|------|------|-----------------|---------|
| `create(ctx)` | Once, before mount | No | Return `self` — per-instance state |
| `render(ctx)` | First Reaction run (client render) | Yes | Build initial DOM from AST |
| `hydrate(ctx)` | First Reaction run (server content exists) | Yes | Adopt existing DOM, register dependencies |
| `update(ctx)` | Subsequent Reaction runs | Yes | React to signal changes. Defaults to `render` if not provided |
| `destroy(ctx)` | Scope disposal | No | Cleanup |

All hooks receive the same destructured context — the SUI pattern of "here's everything, take what you need":

```
node, data, scope, region, isSVG, serverMeta, self,
eval, renderAST, lookupExpression, lookupToken,
dataDep, subTemplates, snippets, template, notifyUpdate
```

### Infrastructure (`defineBranch` implementation)

`defineBranch` returns a function the renderer calls. The function:
1. Creates `DynamicRegion` from the marker
2. Calls `create()` to build `self`
3. Builds the context bag with `self` + renderer capabilities
4. Wires a `scope.reaction` — firstRun calls `render()` or `hydrate()`, subsequent runs call `update()`
5. Wires `scope.onDispose` → `destroy()`

~30 lines of infrastructure. The directive author never touches `scope.reaction`, `DynamicRegion`, or `comp.firstRun`.

### Renderer dispatch

`bindBlockDirective` and `hydrateBlockDirective` collapse into one path:

```js
const directive = directives[node.type];
directive(ctx);
```

The hydration distinction moves inside: `region.ownedNodes.length > 0` determines whether `hydrate()` or `render()` is called on firstRun. The renderer just pre-collects `ownedNodes` and `serverMeta` from the DOM before dispatching — that collection logic stays in the renderer since it's DOM walking, not directive behavior.

### File structure

```
packages/renderer/src/engines/native/
├── renderer.js           (~400 lines — AST walk, parseHTML, marker dispatch, text/attr bindings)
├── define-branch.js      (~30 lines — the defineBranch infrastructure)
├── dynamic-region.js     (unchanged)
├── reaction-scope.js     (unchanged)
├── directives/
│   ├── conditional.js    (~60 lines)
│   ├── each.js           (~150 lines)
│   ├── async.js           (~80 lines)
│   ├── rerender.js        (~40 lines)
│   ├── subtemplate.js     (~160 lines)
│   └── snippet.js         (~60 lines)
```

### What stays in the renderer

- `readAST` / `parseHTML` / `buildHTMLString` — core pipeline
- `parseAttributeParts` / `bindAttributeExpression` — attribute bindings
- `bindTextExpression` / `hydrateTextExpression` — text bindings
- `hydrateMarkers` / `hydrateAttributes` — hydration DOM walking and marker collection
- Expression evaluator setup, data management, `setData` / `bumpDataVersion`

The renderer becomes an orchestrator — it walks the AST, collects markers, and dispatches to directives. Each directive is a self-contained lifecycle.

## Open Questions

- **Hydration inner content wiring**: the renderer currently calls `hydrateInnerContent` to recursively wire markers on server DOM inside block regions. This happens before the directive is called. Should it stay in the renderer (pre-collection) or move into each directive's `hydrate` hook? Pre-collection keeps directives simpler but means the renderer still knows about block structure. Per-directive is more self-contained but duplicates the inner-marker walking pattern.

- **Text and attribute bindings**: these aren't block directives — they're inline bindings. Should they get the same `defineBranch` treatment, or is the extracted `bindAttributeExpression` method sufficient? They're simpler (no lifecycle, no DynamicRegion) so the function approach may be fine.

## Dependencies

None. This is a pure refactor of the native renderer internals. No API changes, no new features.

## Status

Initial — design direction established through pair session, implementation details to resolve during execution.

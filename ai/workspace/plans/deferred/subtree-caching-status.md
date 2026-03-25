# Subtree Caching — Session Status

## What was accomplished

### Bug fixes (solid, ready to ship)
1. **Async `noChange`** — empty loading/error blocks return `noChange` instead of `nothing`, preventing content flash
2. **Generation counter** — stale async promises are discarded via generation tracking
3. **Empty content null check** — `loadingContent`/`errorContent` return `null` when AST is empty instead of wrapping in unnecessary renderer
4. **Settings sync for non-spec components** — `adjustPropertyFromAttribute` syncs shadow signals for components without `componentSpec` (falsy check fix + non-spec fallback)
5. **Nav-menu selectedIndex** — only resets on search term change, guards against non-URL items
6. **Async stale-while-revalidate** — preserves old resolved content while new promise is pending (only when no `{loading}` block is defined)

### Architecture changes (subtree caching)
7. **Subtree caching enabled** — `useSubtreeCache = true`
8. **Directive reaction reuse** — all directives (conditional, each, rerender, async, data) store args on `this` and reuse reactions instead of stop/recreate
9. **`dataVersion` signal** — cached subtrees bump a version signal to trigger non-reactive expression re-evaluation
10. **`bumpDataVersion` propagation** — recursively propagates through nested subtrees that inherit data
11. **Keyed each caching** — each items pass `getItemID` result as cache key to `renderContent`
12. **Rerender returns `noChange`** — rerender directive preserves subtree, signals handle updates
13. **Snippet cache bypass** — snippets use `cache: false` on `renderContent` to avoid AST collision

## Test coverage
- **62 total tests** across 5 files
- **60 passing**, 2 known failures:
  - Spurious per-item re-evaluation (optimization opportunity, not bug)
  - Attribute-driven async preservation (test 13)

### Test files
- `subtree-caching.test.js` — 16 specific edge case tests
- `subtree-each.test.js` — 12 tests (each → expression/if/snippet/async/each/rerender, reactive + non-reactive)
- `subtree-rerender.test.js` — 8 tests (rerender → expression/async/if/each, reactive + non-reactive)
- `subtree-misc.test.js` — 16 tests (if→each/async, snippet→if/each/snippet, subtemplates reactive/static/dynamic)
- `subtree-spurious.test.js` — 10 tests (spurious rendering detection)

## Known issues / next steps

### Spurious per-item re-evaluation
Root cause identified by two independent agents:
1. Lit's `repeat()` eagerly calls templateFn for ALL items before diffing
2. `cachedRender` bumps `dataVersion` unconditionally
3. `dataVersion` is a broadcast — all expressions re-fire

Fix: per-item data comparison in `ReactiveEachDirective.getTemplate()` to skip calling `content()` for unchanged items.

### Attribute-driven async (test 13)
Stale-while-revalidate works for state-driven changes but not attribute changes. The attribute path goes through a different re-render cycle.

### Visual test component
`docs/src/components/SubtreeCachingTest/` has 16+ visual tests at `/test`. Some visual tests show issues not reproduced in vitest (snippet collision in complex templates with many snippets).

### Architecture insights
- Subtree caching primarily benefits: if/async/rerender (directive state preservation)
- Snippets and subtemplates can't be cached (AST identity collision)
- Each items: caching works with keyed identity but `bumpDataVersion` does work proportional to all expressions
- The `dataVersion` signal is "forceUpdate() for subtrees" — correct but coarse
- The vanilla renderer plan's `itemSignal` pattern is the architectural ideal for per-item reactivity

### Subagent evaluations
- `ai/workspace/subtree-caching-evaluation.md` — problem brief
- `ai/workspace/spurious-evaluation-report.md` — root cause analysis
- Standard + challenge agent evaluations in task output files

## Task: Optimize expression evaluator slow paths

Read all source files listed below before answering. Follow the `improve-performance` workflow (steps 7-9: trace → implement → iterate) to produce measurable performance improvements on the slow expression groups.

### Architecture Overview

The `ExpressionEvaluator` class evaluates template expressions at render time. Every `{expression}` in a Semantic UI template calls `evaluate()`, which resolves the expression against a flat data context (merged settings + state + component return values) and a helpers object.

The evaluator handles several expression forms:

- **Simple identifiers** — `{count}`, `{label}` → direct property lookup on data
- **Dotted paths** — `{user.name}`, `{user.settings.theme}` → nested property traversal
- **JS expressions** — `{count + 1}`, `{isOpen ? "open" : "closed"}` → compiled via `new Function` with a Proxy context
- **Lisp-style helper calls** — `{classIf isActive 'active'}`, `{maybe disabled 'off' 'on'}` → parsed into token arrays, resolved right-to-left
- **Mixed Lisp + JS** — `{concat 'my ' 'friend ' (isDog ? 'simon' : 'pookie')}` → parenthesized sub-expressions are evaluated as JS, outer structure as Lisp
- **Inline literals** — `{getValue {one: 'two'} 'one'}`, `{join ['1', '2', '3'] ' and '}` → inline objects/arrays within Lisp-style calls

This is a hot path — it runs for every expression in every component on every render.

### Performance Characteristics

Benchmarks reveal a sharp performance cliff between expression types:

| Expression type | ops/sec |
|---|---|
| Simple identifier `{count}` | ~6.4M |
| Dotted path `{user.name}` | ~3.3M |
| JS expression `{count + 1}` | ~1.2M |
| JS ternary | ~930K |
| Lisp helper `{classIf isActive 'active'}` | ~430K |
| Mixed Lisp+JS with parens | ~66K |
| Inline object/array | ~70K |

The gap between simple identifiers and inline object/array expressions is roughly **100x**. The gap between pure Lisp helpers and mixed/inline expressions is roughly **6x**.

### Constraints

- Expressions are strings at evaluation time — there is no pre-compilation step in the current pipeline
- The same `ExpressionEvaluator` instance is reused across renders for a component, but the data context changes each render
- Signals in the data context must be unwrapped (`.get()` / `.value`) during evaluation
- The evaluator must handle all expression forms — it cannot reject inline objects/arrays/mixed syntax
- Test suite must pass after changes: `cd packages/renderer && npm test`

### Tools Available

- **Bench suite:** `cd packages/renderer && npm run bench` — measures ops/sec across all expression types
- **Profile script:** `cd packages/renderer && node bench/profile.js [filter]` — runs tight loops with timing, supports group filtering
- **V8 profiling:** `node --prof bench/profile.js "group"` then `node --prof-process isolate-*.log 2>/dev/null | head -80` — shows tick-level function/regex breakdown
- **Workflow docs:** `ai/skills/workflows/contributing/improve-performance.md` — full methodology

### Questions — Evaluate Independently

**Question 1:** Where does time actually go for the slow expression groups? Profile and identify the dominant costs.

**Question 2:** What optimizations would produce measurable improvement (>10% on the slow groups)? Implement them.

**Question 3:** After each optimization round, what is the new dominant cost? Does another round of optimization converge or hit diminishing returns?

### Source Files to Read

- `packages/renderer/src/expression-evaluator.js` — the evaluator implementation
- `packages/renderer/bench/expression-evaluator.bench.js` — the benchmark suite
- `packages/renderer/bench/profile.js` — the standalone profiling script
- `packages/renderer/bench/baseline/README.md` — baseline A/B instructions

### Success Criteria

- Measurable improvement on the slow expression groups (mixed Lisp+JS, inline objects, inline arrays)
- No regressions on fast paths (simple identifiers, dotted paths)
- All tests pass: `cd packages/renderer && npm test`
- Clean up isolate logs after profiling

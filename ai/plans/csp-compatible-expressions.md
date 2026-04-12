# CSP-Compatible Expression Evaluation

## Goal

Give `defineComponent` a three-level opt-in that lets SUI run in environments where runtime `eval` is blocked — strict-CSP sites, Cloudflare Workers, Deno without `--allow-eval`, and Chrome MV3 extensions — without giving up the JS-in-templates expressiveness when the environment allows it.

Today every JS-style expression (`{count + 1}`, `{foo ? 'a' : 'b'}`, `{addOne(value)}`, `{getValue {one: 'two'} 'one'}`) hits `ExpressionEvaluator.evaluateJavascript()`, which compiles `new Function('ctx', 'with(ctx){return ${code}}')`. Lisp-style expressions (`{addOne value}`, `{formatDate date 'h:mm'}`, `{concat a b}`) already bypass `new Function` — the classifier in `expression-evaluator.js:84` routes them through pure data/helper lookup. The gap is the JS branch.

## Framing: this is CSP compatibility, not security theatre

Template expression strings are developer-authored, never user-authored in normal apps. `{expr}` interpolation treats user data as *values*, not as expression source, and escapes before render. So in the typical app, the strings `new Function` compiles are the same strings the developer could have written in a `<script>` tag — no additional capability, no new escalation path. "Safe vs unsafe" is therefore the wrong framing for most of the audience.

The real axis is **CSP-compatible** vs **requires `unsafe-eval`**. Drivers in priority order:

1. **Compliance.** `unsafe-eval` in CSP is non-negotiable at most of the Fortune 500, banks, healthcare, gov. SUI literally cannot run there today.
2. **Platform mandates.** Cloudflare Workers require declaring `unsafe-eval` in wrangler; Chrome MV3 bans it outright; Deno gates it behind `--allow-eval`.
3. **Defense-in-depth.** For sites that assume XSS will eventually happen somewhere, denying `eval` cuts off the easiest escalation path. Applies even without a concrete exploit.
4. **Genuine attack surface.** Apps that accept user-authored templates (playgrounds, low-code builders, CMS template editors) — rare, but the one case where this is real security, not compliance. Template-source supply-chain tampering falls here too.

Docs should lead with compatibility, not safety. Announcements should read like *"SUI runs on Cloudflare Workers and under strict CSP when you opt in — import the no-eval evaluator and set the flag"*, not *"SUI is unsafe by default."*

## Design / Implementation

### The three levels

The `csp` param gates **JavaScript expression evaluation only** — Lisp-style expressions (`{addOne value}`, `{concat a b}`) are always available and never touch `new Function`.

```js
defineComponent({
  tagName: 'my-card',
  csp: 'loose',       // Default. new Function available. Full JS expressions. Requires unsafe-eval in CSP.
  csp: 'strict',      // No new Function. Limited JS via first-party parser. CSP-compatible.
  csp: 'lisp-only',   // No JS at all. Lisp-only. Smallest surface. Workers/MV3 friendly.
});
```

Reads as a compatibility contract — *"this component is `csp: 'strict'`"* is self-documenting in docs and review. Global default available via `ExpressionEvaluator.defaultCsp` for opt-in-everywhere.

### What each level supports

Anchored against `docs/src/examples/templates/expressions-kitchen-sink/component.html` (the canonical surface):

| Expression | Example from kitchen sink | `loose` | `strict` | `lisp-only` |
|---|---|---|---|---|
| Basic identifier | `{value}` | ✅ | ✅ | ✅ |
| Dotted path | `{user.name}` | ✅ | ✅ | ✅ |
| Lisp call | `{addOne value}` | ✅ | ✅ | ✅ |
| Lisp nested | `{titleCase concat firstName ' ' lastName}` | ✅ | ✅ | ✅ |
| Lisp with inline obj | `{classMap { one: true, two: date }}` | ✅ | ✅ | ✅ |
| Lisp with inline array | `{join ['1', '2', '3'] ' and '}` | ✅ | ✅ | ✅ |
| Lisp + JS parens | `{formatDate (getDate now) 'h:mm'}` | ✅ | ✅ | ✅ |
| Arithmetic | `{value + 2 * 5}` | ✅ | ✅ | ❌ |
| Ternary | `{isTrue ? 'yes' : 'no'}` | ✅ | ✅ | ❌ |
| Comparison | `{fruit == 'cherry' ? 'yum' : 'yuck'}` | ✅ | ✅ | ❌ |
| JS-style call | `{addOne(value + 1)}` | ✅ | ✅ | ❌ |
| JS with obj arg | `{formatDate(date, 'h:mm', { timezone: timezone })}` | ✅ | ✅ | ❌ |
| Inline ternary in Lisp | `{concat 'my' (isDog ? 'simon' : 'pookie')}` | ✅ | ✅ | ❌ |
| Assignment / `new` / `=>` / regex | (not in kitchen sink) | ✅ | ❌ | ❌ |

`strict` is the "runs the whole kitchen sink except `loose` escape hatches" line. `lisp-only` forces the user to express everything as Lisp — still expressive via helpers, but no per-expression JS.

### Framework constraints that shape this

Three hard constraints of SUI's infrastructure eliminate most of the obvious design space up front:

1. **No build step required.** Templates arrive at `defineComponent` as strings and are compiled by `TemplateCompiler` at runtime. Users can construct `Template`s dynamically. This rules out "Vue-style compile-time expression AST" as a *replacement* — any runtime-constructed template still needs a runtime parser. A compile-time AST pass can only ever be an *optimization layered on top of* a runtime-safe path, not a way to avoid writing one.

2. **Zero third-party runtime dependencies.** Every core package (`component`, `templating`, `renderer`, `reactivity`, `query`, `compiler`, `utils`) has only `@semantic-ui/*` dependencies. The whole framework is first-party. This rules out pulling in `jsep`, `expr-eval`, `jexl`, or any external parser — introducing one would break a framework-wide invariant for a feature that runs in one branch of one path in one package.

3. **Shipped bundle size is load-bearing.** Cold-eval weight against Vue/Svelte/Solid/Preact/Lit is already a contentious axis. Today's `renderer.min.js` is ~115kb. A ~2kb safe evaluator inflates that by ~1.5-2% — small but non-zero, and it would be paid by every user regardless of whether they use the feature. This rules out "always ship the safe evaluator." It must be tree-shakeable like the Lit renderer already is (`packages/renderer/src/index.js:14` — *"Lit renderer exports are NOT in this barrel — they're tree-shaking poison"*).

### Implementation: one module, runtime only

A first-party parser + evaluator lives in `packages/renderer/src/csp-evaluator.js`, **not** re-exported from `packages/renderer/src/index.js` — same tree-shaking discipline as the Lit renderer. Users opt in via `import '@semantic-ui/renderer/csp'`, which self-registers the evaluator on load. Zero bytes added to anyone who doesn't import it.

`ExpressionEvaluator.evaluateJavascript()` dispatches on `this.csp`:
- `'loose'` (default) — today's `new Function` path and `fnCache`.
- `'strict'` — routes through the registered CSP evaluator. Same Map-cache shape keyed by expression string; repeat evaluations are free. If `'strict'` is set but the evaluator isn't registered, throw a helpful error pointing at the subpath import.
- `'lisp-only'` — skip JS eval entirely; the existing Lisp path already handles identifiers, dotted paths, and Lisp-style calls.

Recursive descent over the allowlist:
- identifiers, dotted paths, bracket access
- string / number / bool / null literals
- array literals and object literals (including spread: `{...a, b: 1}`, `[...list, x]`)
- unary (`!`, `-`, `+`)
- binary (`+`, `-`, `*`, `/`, `%`, `===`, `==`, `!==`, `!=`, `<`, `>`, `<=`, `>=`, `&&`, `||`)
- optional chaining (`?.`) and nullish coalescing (`??`)
- ternary
- function calls against the data/helpers context, including spread (`fn(...args)`)

Explicitly disallowed: assignment, `new`, arrow functions, `function` keyword, loops, regex literals, tagged templates, `yield`, `await`, comma operator, `typeof` / `in` / `instanceof`, bitwise operators.

Estimated ~200-300 LOC, ~1.5-2.5kb min+gz. Fully tree-shaken out of default bundles. Tests run the full kitchen sink matrix against the CSP path for parity on the allowed subset. `Signal` unwrapping on read stays identical to the `new Function` path, so `csp: 'strict'` is a true drop-in.

**Production distribution** (from `ai/skills/workflows/contributing/improve-performance.md`, audit of 209 expressions across 29 production component templates):

| Path | Production | Today's cost |
|---|---|---|
| Simple identifier | 58% | never hits `new Function` |
| Dotted path | 21% | never hits `new Function` |
| Lisp helper | 19% | never hits `new Function` |
| **JS eval** | **2%** | `new Function` path |
| Complex Lisp | 0% | — |

Only **2% of production expression evaluations** go through `new Function`. Everything else is property lookup or Lisp — untouched by this plan. Even if the CSP evaluator were 3-5x slower warm, that's 3-5x on 2% → negligible amortized cost at render scope.

**Interaction with the default decision.** If default is `'strict'`, the CSP evaluator *must* be in the critical path — tree-shaking disappears and every user pays the ~2kb. If default stays `'loose'`, the strict path is pure opt-in bytes. Given the 2% hit rate, bundle cost likely dominates perf in the default decision — which tilts toward `'loose'`. Benchmark after implementation confirms.

### Threading

Follows `renderingEngine`'s pattern — plumbed from `defineComponent` through `Template` → engine `factory` → `new ExpressionEvaluator({ ..., csp })`. Call sites:

- `packages/component/src/define-component.js:10` — accept `csp` option.
- `packages/templating/template.js` — carry on the template instance.
- `packages/renderer/src/engines/native/renderer.js:89` — pass into `ExpressionEvaluator`.
- `packages/renderer/src/engines/native/server.js:45,240,291,331` — same (SSR inherits the setting, which is the right story for Workers).
- `packages/renderer/src/engines/lit/renderer.js:63` — same.
- `packages/renderer/src/expression-evaluator.js` — constructor accepts `csp`, `evaluateJavascript` dispatches on it.

No `TemplateCompiler` changes. AST untouched.

### Runtime behavior when an expression can't be parsed

Silent `undefined`, matching today's `try/catch` in `evaluateJavascript`. No compile-time validation, no AST walk, no separate lint. The AST stays untouched. Proper error surfacing is a separate framework-wide plan.

### Relationship to SSR / `ai/plans/native-ssr.md`

`native-ssr.md:125-132` already flags this exact constraint: `ExpressionEvaluator` + `new Function` is the reason SSR in Workers needs `unsafe-eval`. This plan is the concrete answer to that footnote — once shipped, `renderToString` in Workers runs under default CSP.

## Open Questions

1. ~~**Naming.**~~ **Decided: `csp: 'loose' | 'strict' | 'lisp-only'`.** Names the driver honestly; reads as a compatibility contract.
2. **Default.** *Decided by benchmark after implementation, not before.* Benchmark is a post-write validation step, not a pre-write gate — no throwaway prototype. Bundle cost likely dominates the decision regardless of perf results (see "Production distribution" note below).
3. ~~**Fallback behavior.**~~ **Decided.** Silent `undefined`, matching today's `evaluateJavascript` contract. Proper error surfacing is a separate framework-wide plan.
4. ~~**Exact allowlist.**~~ **Decided.** In: `?.`, `??`, spread in calls, spread in literals. Out: `typeof`, `in`, `instanceof`, bitwise, tagged templates, regex, everything in the "explicitly disallowed" list above.
5. ~~**Compile-time lint.**~~ **Decided: out of scope.** Runtime-only. AST stays untouched. `TemplateCompiler` unchanged.
6. **`{#fn handler}` interaction.** Raw function passthrough doesn't parse JS — should be transparently fine under any level. Verify during implementation (not a design decision).
7. **Docs shape.** Tentative: dedicated security guide, or a section in advanced guides. Not finalized — content surface isn't fully fleshed out yet (what platforms, what CSP directives, what example configs, what migration notes). Defer placement until content is drafted; the guide can land in whichever directory feels right when we see the shape.

## Dependencies

- None blocking. Unblocked today.
- Informs [Native SSR](native-ssr.md) — resolves the `unsafe-eval` asterisk called out there.
- Shares API-shape thinking with [Signal Performance](signal-performance.md) `safety` preset (may or may not want to share the vocabulary).

## Sessions (estimated)

To be filled when upgraded from `initial` → `scoped`. Rough shape:

1. Implement `csp: 'lisp-only'` + threading. Smallest slice, shippable independently.
2. Implement `csp: 'strict'` (CSP parser/evaluator + subpath import at `@semantic-ui/renderer/csp`) + full kitchen sink parity tests.
3. Benchmark the real implementation vs `new Function` using the existing renderer infrastructure (`packages/renderer/bench/` — vitest bench for iteration, tachometer for committed numbers per `ai/skills/workflows/contributing/improve-performance.md`). Warm path, cold path, memory.
4. Pair: review benchmark, lock default, resolve docs shape.
5. SSR verification under Workers default CSP + docs page.

## Status

**Scope: `initial` (close to `scoped`).** All design decisions locked except the default, which is pending a benchmark. Remaining path to execution:

1. Run the benchmark (session 1).
2. Pair session to review numbers and confirm default.
3. Upgrade to `scoped` and execute sessions 3-5.

Locked decisions: name (`csp: 'loose' | 'strict' | 'lisp-only'`), allowlist, runtime-only (no compile-time validation, no AST changes), silent-undefined on reject, tree-shakeable via subpath import (`@semantic-ui/renderer/csp`).

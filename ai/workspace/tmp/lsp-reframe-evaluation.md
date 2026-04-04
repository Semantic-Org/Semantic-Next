# LSP and Type Intelligence: Reframing Evaluation

## Are These the Right Questions?

The brief asks six well-formulated questions about a well-researched design. But before answering them, I want to challenge the framing of the problem itself, because I think the design documents conflate two distinct problems with very different cost/benefit profiles, and the plan's structure obscures the highest-leverage move available right now.

### The two problems are not equally hard or equally valuable

**Problem A: JS type intelligence** (settings, state, self completions in `.js` files) — This is a developer experience gap in a language developers already use, with well-understood tooling, where 66% of the problem (settings + state) is already solved and ready to ship today via `.d.ts` changes. The remaining 33% (self) has a known solution path via TS plugin.

**Problem B: Template language intelligence** (completions, diagnostics, hover in `.html` files) — This is building a language server from scratch for a custom language. It requires a parser, a scope chain, cross-file analysis, and a registry system. It is a much larger investment for a language that has zero existing tooling.

The plan puts Problem B first (Phases 1-2) and Problem A last (Phase 3). This is backwards from a value perspective. The `.d.ts` changes for settings and state are validated, zero-risk, and could ship today with no tooling infrastructure at all. They are not gated on any of this work.

### The self circularity has an unexplored pure-type path

The design documents state definitively that `self` "CANNOT be inferred" at the type level. The prototype files confirm that `NoInfer<T>` and `LooseMethods<M>` don't work. But I believe there is an unexplored path that the research document itself points to: **Vue's approach**.

Vue has the exact same structural problem — methods need `this` to include all methods, but the type of methods defines `this`. Vue solves it with `ThisType<T>`. The research document acknowledges this but doesn't explain why it was rejected for SUI.

The critical difference: Vue's circularity is on `this` (contextual typing), while SUI's circularity is on a destructured parameter `self`. `ThisType<T>` only controls what `this` means inside an object literal — it cannot control what a destructured parameter like `{ self }` contains.

**But this reveals a potential API adjustment** that could dissolve the problem entirely:

If `createComponent` used `this` instead of a destructured `self` parameter, `ThisType<T>` would work. The return object literal's `this` would be typed as the merged component instance. This would make `self` typing work in tsc, every IDE, and with zero tooling — the same mechanism Vue has proven at massive scale.

```javascript
// Current pattern (circularity via parameter):
const createComponent = ({ self, settings }) => ({
  foo() { self.bar(); },  // self is circular
  bar() { return 1; },
});

// Alternative (circularity via this, solvable with ThisType):
const createComponent = ({ settings }) => ({
  foo() { this.bar(); },  // this is typed via ThisType<M>
  bar() { return 1; },
});
```

This is a **BREAKING change** to the component authoring API and may not be desirable for other reasons (arrow functions lose `this`, explicit `self` is clearer, `this` in JS is confusing). But it should be evaluated as an option before committing to 8-12 days of TS plugin work. It is the difference between "self typing works everywhere with zero tooling" and "self typing works only in VS Code with a custom plugin that must be maintained forever."

If this path is rejected for good reasons (and there may be good reasons — the explicit `self` pattern is arguably better for readability and avoids `this` confusion in arrow functions), then the TS plugin approach is sound. But the decision should be explicit.

### The compiler modifications are underscoped

The plan describes two "opt-in" changes to the compiler: `includePositions` and `recoverable`. Having read the actual compiler code, I think this understates the work.

The `TemplateCompiler.compile()` method currently:
1. Has no position tracking on AST nodes at all — the scanner tracks `this.pos` but no node captures it
2. Calls `scanner.fatal()` which throws immediately — there is no error collection
3. Uses `optimizeAST()` at the end which merges consecutive HTML nodes, destroying position information
4. Has no concept of error recovery — after a fatal error, the scanner state is indeterminate

The `recoverable` mode needs more than just catching exceptions. The parser uses a stack-based approach (`contentStack`, `conditionStack`) and an error mid-parse can leave these stacks in an inconsistent state. True error recovery requires skip-ahead logic: "I hit a bad token, advance to the next recognizable tag boundary and continue." This is doable but it is parser work, not a flag flip.

`includePositions` is simpler — save `scanner.pos` before each tag parse — but it interacts with `optimizeAST()` which will need to either preserve positions during HTML node merging or be skipped in LSP mode.

---

## Answers to the Stated Questions

### Question 1: Is the LanguageServiceHost interception approach for `self` typing sound?

**Yes, it is technically sound.** The research is thorough and the `typescript-plugin-css-modules` pattern is well-proven. The mechanism (intercept `getScriptSnapshot`, inject JSDoc annotations, serve virtual type modules via `resolveModuleNames`) will work.

**Risks of IDE/tsc divergence:**

The risk is real but bounded. Settings and state work in both environments (pure `.d.ts`). Only `self` diverges. In practice, this means:
- tsc will not catch `self.nonExistentMethod()` errors — but it also won't report false positives
- CI type checking will be less strict than IDE checking for `self` usage only
- Developers without VS Code get no `self` intelligence

The divergence is acceptable because `self` usage is overwhelmingly internal to a single component file — you call `self.foo()` where `foo` is defined 10 lines away. It's not a cross-module type boundary where CI enforcement matters most. The risk is that a developer renames a method and misses an internal callsite — but this would also be caught by "the code doesn't work at runtime."

**Alternative the design may have overlooked:** The `ThisType<T>` approach described in my reframing section above. Also worth noting: if a future TypeScript version adds support for "infer return type first, then flow into parameters" (there are open TS issues requesting this), the circularity dissolves without any tooling. The TS plugin could be temporary scaffolding.

### Question 2: Is the phasing correct?

**No. The phasing should be reordered.**

The plan puts template intelligence (Phases 1-2) before JS intelligence (Phase 3). This is wrong for three reasons:

1. **Settings and state `.d.ts` changes are ready today.** They are validated, zero-risk, and provide immediate value to every developer in every IDE and tsc. They should ship as Phase 0, not Phase 3. This is explicitly acknowledged in the plan ("Ready to ship as `.d.ts` change today") but then buried in Phase 3 timing.

2. **JS files are where developers spend most of their time.** The `createComponent`, events, and lifecycle callbacks are where the core logic lives. Template files are primarily structural HTML with occasional expressions. Getting `settings.` and `state.` completions in `.js` files has higher daily-use value than template completions.

3. **The ComponentAnalyzer is needed for both.** Cross-file template intelligence (Phase 2) requires the ComponentAnalyzer which parses `.js` files. Building the JS analysis first (for the TS plugin) naturally produces the same data model the LSP needs. Building the LSP first means either building the ComponentAnalyzer early (duplicating Phase 2 work) or deferring the most valuable template features.

**Proposed reordering:**
- **Phase 0:** Ship `.d.ts` fixes for settings/state (1-2 days, immediate value)
- **Phase 1:** TextMate grammar + LSP scaffolding + diagnostics (the parts that don't need cross-file analysis)
- **Phase 2:** ComponentAnalyzer + TS plugin for `self` (builds the shared core)
- **Phase 3:** Cross-file template intelligence (uses ComponentAnalyzer from Phase 2)

### Question 3: Should the SpecRegistry read both `.spec.js` and `.component.js`?

**Read only `.component.js` for structural data. Read `.spec.js` only for rich metadata that `.component.js` provably lacks.**

Having read both formats in detail, here is what each provides:

The `.component.js` (compiled spec) contains everything needed for completions and diagnostics: `attributes[]`, `allowedValues{}`, `optionAttributes{}`, `propertyTypes{}`, `defaultValues{}`. This is a stable, auto-generated JSON format.

The `.spec.js` (source spec) adds: human-readable names, descriptions, usage levels, example code, and `couplesWith` relationships. These are valuable for hover information and completion sorting — but only for hover and sort, not for correctness.

**The maintenance risk of depending on `.spec.js` is real.** Source specs import shared constants (`getStates`, `getVariations`, `SIZE_VARIATION`, etc.) from `@semantic-ui/specs`. To read a `.spec.js`, the LSP would need to either:
- Execute the spec file (dangerous, requires a Node runtime in the LSP)
- Parse the imports and resolve the shared constants statically (complex, fragile)
- Bundle/transpile specs at startup (heavy)

**Recommendation:** Start with `.component.js` only. It gives you completions, diagnostics, and attribute validation — the core LSP features. Add `.spec.js` reading later as an enhancement for rich hover content. The `.component.js` format is stable, self-contained JSON that can be `import()`ed trivially.

If rich metadata from specs is desired early, consider extending the spec compiler to embed descriptions and usage levels into the `.component.js` format. This keeps the LSP simple (one file format) and pushes complexity to the build step where it belongs.

### Question 4: Is this the right time? What's the minimum viable slice?

**The minimum viable slice is 2-3 days of work and should ship now. The full LSP is premature.**

The minimum viable slice is:

1. **Ship `.d.ts` generic fixes** for settings and state inference (1 day). This is validated, ready, and provides immediate value to every developer. It works in tsc and every IDE. Zero maintenance burden.

2. **Extend the TextMate grammar** for missing syntax (`#async`, `#snippet`, `#guard`, `@event`, etc.) (1 day). This is orthogonal to the LSP, ships as a simple VS Code extension update, and dramatically improves the template editing experience through syntax highlighting alone.

3. **Generate a Custom Elements Manifest** from the compiled specs (1 day). This gives generic web component tooling (VS Code's built-in HTML support, Lit plugin, etc.) knowledge of SUI component attributes and their types. Many editors consume this format natively.

That's 3 days for significant developer experience improvement. Everything else — the full LSP, the TS plugin, the ComponentAnalyzer — is valuable but premature before 1.0. The framework API is still evolving. The spec format might change. The template syntax might get additions. Building a full language server now means maintaining it through every breaking change in a pre-1.0 framework.

**Build the full LSP when:** The framework API is stable (post-1.0 or very close to it), there are enough components to justify the investment, and developer adoption creates demand for tooling. The `.d.ts` fixes + TextMate grammar + Custom Elements Manifest provide 80% of the value for 10% of the cost.

### Question 5: Is excluding full expression type-checking the right boundary?

**Yes, this is the correct boundary.** The template expression language is fundamentally not statically analyzable in the general case. It supports:

- Lisp-style function application: `{formatDate date 'h:mm a'}`
- JavaScript evaluation via `new Function` + `with(Proxy)`: `{a + b * 2}`
- Mixed expressions: `{concat 'hi ' (isNew ? 'new' : 'old')}`
- Signal auto-unwrapping through a Proxy `get` trap
- Deep property access: `{item.nested.value}`
- Implicit function invocation (a bare token that is a function gets called with zero args)

The `with(Proxy)` pattern means any identifier could resolve to anything at runtime. The Proxy's `get` trap auto-unwraps Signals, auto-invokes zero-arg functions, and chains through deep property access. Static analysis of this would require essentially reimplementing the runtime evaluation semantics in TypeScript — which defeats the purpose.

**What the LSP should do instead (and what the design proposes) is correct:**
- Flag unknown identifiers (not in settings, state, instance, helpers, or scope chain)
- Provide completions for known names
- Show type information on hover for known names
- Leave expression-internal type checking alone

This boundary will feel complete to users because the most common errors (typos, wrong variable names) are caught, and the most common need (what methods/properties are available) is served. Users who write complex JS expressions in templates already know they're writing JavaScript — they don't expect the template engine to type-check it.

### Question 6: Are there simpler alternatives that provide 80% of the value?

**Yes, emphatically.** This is the most important question and my answer aligns with Question 4:

1. **Ship `.d.ts` generic fixes** — settings and state completions in every IDE and tsc. Zero tooling. Ready now.

2. **TextMate grammar** — Syntax highlighting for the full template language. Already partially exists. Small, well-understood work.

3. **Custom Elements Manifest (CEM)** — Generate from compiled specs. The `@custom-elements-manifest/analyzer` can be configured with a custom plugin, or you can generate the manifest directly from `.component.js` files. This gives:
   - Attribute completions for `<ui-button ...>` in VS Code's built-in HTML support
   - Attribute value completions (`size="large"`)
   - Component documentation on hover
   - Works in any editor that supports CEM (VS Code, JetBrains, etc.)

4. **JSDoc annotations on the existing `createComponent` functions** — If there are specific components where `self` typing matters most (menu, dropdown, etc.), hand-written `@typedef` / `@type` JSDoc annotations on the `createComponent` variable can provide `self` typing with zero tooling. This doesn't scale to all components, but for the 10 that exist today it's 30 minutes of work.

These four items together take 3-5 days and deliver the vast majority of the developer experience improvement. The full LSP with cross-file analysis, scope chains, and TS plugin interception is a worthwhile long-term investment — but it's an investment that should wait until the framework surface area is stable and the user base justifies the maintenance cost.

---

## Summary of Key Findings

| Finding | Impact |
|---------|--------|
| Settings + state `.d.ts` fix is ready and should ship immediately | High value, zero cost |
| `ThisType<T>` might dissolve the `self` problem if an API change to use `this` is acceptable | Could eliminate need for TS plugin entirely |
| Phasing is backwards — JS intelligence should come before template intelligence | Reorder for maximum early value |
| SpecRegistry should read only `.component.js` initially | Reduces complexity, avoids import resolution |
| Full LSP is premature for a pre-1.0 framework | Ship minimum slice now, full LSP when API stabilizes |
| CEM generation from compiled specs is a high-leverage alternative | Works in all editors, standard format |
| Compiler `recoverable` mode is more work than described | Stack-based parser needs real error recovery logic |

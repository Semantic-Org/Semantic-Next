# LSP and Type Intelligence: Independent Evaluation

## Question 1: Is the LanguageServiceHost interception approach for `self` typing sound?

### The approach is technically sound but the problem framing is wrong

The TS plugin research document is thorough and accurately describes the mechanism. The `typescript-plugin-css-modules` pattern (proxied `LanguageServiceHost` with `getScriptSnapshot` interception) genuinely changes type resolution in the IDE. Angular and Vue/Volar both use variants of this. The implementation plan -- injecting JSDoc annotations into the virtual snapshot that TS sees -- would work.

But I want to challenge the assumption that `self` typing *needs* the LanguageServiceHost interception approach at all.

### The overlooked alternative: `ThisType<T>`

The research document itself describes how Vue solves an *identical* circularity problem at the pure type level using `ThisType<T>`. In Vue's Options API, `this` inside `methods` needs to know about all methods, data, computed, and props -- but the type of `methods` is part of what defines `this`. This is structurally the same problem as SUI's `self`: `createComponent` returns methods, and those same methods need to be available on `self` inside the function body.

Vue's solution: infer each generic independently, then assemble them into a `ThisType<T>` that colors `this` for the entire options object. The key cycle-breaker is that `data()` receives a *limited* `this` that deliberately excludes data and computed.

SUI could apply the same pattern. The issue is that SUI doesn't use `this` -- it uses a destructured parameter `{ self }`. But this is a solvable problem. Two paths:

**Path A: `ThisType<T>` with a coding convention change.** If `createComponent` used `this` instead of `self`, the entire circularity evaporates. `ThisType<T>` would give `this` the full assembled instance type. This would require `createComponent` to return an object literal whose methods use `this.otherMethod()` instead of `self.otherMethod()`. This is a breaking API change, but since 1.0 hasn't shipped, it's on the table.

**Path B: Two-pass generic inference with a weaker `self`.** The prototype files test `LooseMethods<M>` and `NoInfer<T>`, both of which fail because TS tries to infer `M` from both the return type and the `self` parameter simultaneously. But there's a trick the prototypes don't try: **split `createComponent` into two type-level phases**. Define `createComponent` as taking `CallParams<St, S, Record<string, (...args: any[]) => any>>` (i.e., `self` is always typed as "an object with unknown methods that return `any`"), and then use a *separate* generic `M` inferred purely from the return type. The returned `M` flows into `events`, `onCreated`, etc. via a mapped type. `self` inside `createComponent` would have method names but `any` return types (exactly what `LooseMethods` tries to achieve). `self` in *other* callbacks (events, onCreated, etc.) would have the full `M` type since there's no circularity -- `M` is already resolved from `createComponent`'s return.

This second approach is what I'd actually recommend investigating before committing to the TS plugin path. It gives you:
- **tsc + IDE** for `self` method names in events/lifecycle (where `self` is used most in real components -- look at `button.js` and `menu.js` where events call `self.performAction()`, `self.setValue()`)
- **tsc + IDE** for `self` method names inside `createComponent` (with `any` return types -- acceptable since `self.otherMethod()` return types are rarely depended on for correctness)
- **No tooling dependency**, no IDE/tsc divergence

The prototype files never tested this split approach. They always try to make `M` fully inferred from the return *and* flow back into the parameter within the same function. The Vue research shows the answer: give the "inner" context a deliberately limited type, and give "outer" contexts the full type.

### Risk of IDE/tsc divergence

If you do go with the TS plugin, the divergence risk is real but manageable. The key question is: what happens when a developer runs `tsc --strict` in CI and `self` is `Record<string, any>`?

Answer: nothing breaks. `Record<string, any>` accepts all property access. CI won't *catch* errors on `self.nonExistent()`, but it also won't *create* false errors. The IDE shows a richer experience, CI shows a permissive one. This is the same situation as CSS modules -- `import styles from './foo.module.css'` is `any` under tsc but fully typed in the IDE.

The risk materializes if a developer writes code that *depends* on `self` being narrowly typed for correctness (e.g., pattern matching on method return types). But looking at the actual component code (button, input, menu), `self` is used exclusively for method calls: `self.performAction()`, `self.setValue(value)`, `self.getForm()`. The return types are consumed immediately, not stored in typed variables. The permissive `any` in CI is practically harmless.

**Verdict: Sound but premature. Exhaust pure type-level approaches first. The TS plugin is a valid fallback.**

---

## Question 2: Is the phasing correct?

### No. JS intelligence should come first.

The plan puts template intelligence (Phases 1-2) before JS intelligence (Phase 3). This is backwards for three reasons:

**1. JS intelligence is the higher-value, lower-cost deliverable.** The `.d.ts` changes for settings and state are "validated and ready to ship today" (the plan's own words). This is Phase 0 work that gives immediate value in `.js` files where developers spend most of their time. The `self` typing (whether via pure types or TS plugin) is the next-highest-value JS feature and depends only on the ComponentAnalyzer, not the full LSP infrastructure.

**2. Template intelligence depends on JS intelligence.** The most useful template completions -- the flat data context (settings + state + instance methods) -- require the ComponentAnalyzer, which is the core of JS intelligence. Without it, template completions are limited to spec attributes and built-in helpers, which is useful but shallow. The plan acknowledges this by putting "cross-file template intelligence" in Phase 2, *after* the ComponentAnalyzer is built. But the ComponentAnalyzer is fundamentally a JS analysis tool.

**3. The framework is JS-first in practice.** Developers write `defineComponent()` in JS, debug in JS, and only touch templates for layout. Looking at the actual components: `menu.js` is 98 lines of JS logic; `menu.html` would be comparatively simple markup. The pain point that the plan identifies -- "zero completions for `self.`, `settings.`, `state.`" -- is a JS problem. Solving it first maximizes developer impact per unit of effort.

**Recommended phasing:**

- **Phase 0** (1-2d): Ship `.d.ts` generic fixes for settings/state. This is pure type work, zero tooling needed. Immediate value.
- **Phase 1** (3-5d): ComponentAnalyzer + TS plugin (or pure type solution) for `self`. This establishes the shared core that everything else builds on.
- **Phase 2** (2-3d): tmLanguage extension + basic template diagnostics (compiler recoverable mode). Low-hanging fruit that doesn't need the full LSP.
- **Phase 3** (5-8d): Full template LSP with completions, hover, go-to-definition.

This reordering front-loads value delivery. After Phase 0, every SUI developer immediately gets settings/state completions. After Phase 1, they get `self` completions too. Phases 2-3 add template intelligence incrementally.

---

## Question 3: Should the LSP read both `.spec.js` and `.component.js`?

### Read only `.component.js` at first. Add `.spec.js` lazily for hover/docs.

The design proposes reading both formats and merging them into a `SpecInfo` structure. This is correct in principle but creates a maintenance coupling that's unnecessary for the MVP.

**What `.component.js` gives you (sufficient for completions):**
- `attributes[]` -- all valid attributes for a component
- `allowedValues{}` -- valid values per attribute
- `optionAttributes{}` -- bare-word attributes like `primary`, `large`
- `propertyTypes{}` -- type per attribute
- `defaultValues{}` -- defaults

This is everything needed for the most important completion scenarios: `<ui-button |>` (attribute names), `size="|"` (attribute values), `<ui-button |>` (option attributes). The compiled spec is the stable contract -- it's auto-generated, has a simple JSON-like structure, and is already consumed at runtime.

**What `.spec.js` adds (needed only for hover/docs):**
- `description` -- human-readable text for hover
- `usageLevel` -- sort order for completions
- `exampleCode` -- inline examples
- `couplesWith` -- related components
- Per-option `name` and `description` -- enriched hover on attribute values

The source spec is valuable for documentation quality but introduces risk: it's the authoring format, written by hand, uses JS imports (`getStates()`, `getVariations()`, `addOptionExamples()`), and requires *executing* those helper functions to resolve the actual data. The SpecReader does this at build time, but an LSP would need to either:
1. Execute the spec JS (fragile, needs the full import graph)
2. Parse the AST and statically evaluate the helper calls (complex)
3. Read the already-compiled `.component.js` and separately parse the raw spec for descriptions (duplicated reading)

**Recommendation:** Start with `.component.js` only. It's a static JSON export, trivially parseable, and gives you 90% of completion value. Add `.spec.js` reading later specifically for hover enrichment, using approach (3) -- read the raw file and extract string literals for descriptions using AST analysis. Don't try to evaluate the helper imports.

The `usageLevel` data from `.spec.js` is genuinely useful for sorting completions (Level 1 attributes like `emphasis` and `size` above Level 5 like `social`). But you can approximate this without reading `.spec.js` by using the section ordering in `.component.js` -- `types` before `variations` before `settings` -- as a proxy for importance.

**Maintenance risk:** The `.spec.js` format is still evolving (the shared constants like `getStates()`, `getVariations()` are clearly patterns being refined). Coupling the LSP to the internal structure of `.spec.js` means every refactor of the spec authoring format potentially breaks the LSP's hover information. The `.component.js` format, being a flat JSON-like export, is much more stable.

---

## Question 4: Is this the right time? What's the minimum viable slice?

### The minimum viable slice is shockingly small and should be done now.

The 20-30 day estimate is for the full vision. But the value curve is extremely front-loaded:

**Day 1-2: Ship `.d.ts` generic fixes.** Zero new tooling. Immediate settings/state completions in every IDE and tsc. This alone solves 40% of the stated problem ("zero completions for `settings.`, `state.`"). This should be done regardless of whether the full LSP is built.

**Day 3-5: TextMate grammar extension.** The existing `sui.tmlanguage.json` is already working for basics. Adding `#async`, `#snippet`, `#guard`, `@event`, `{>slot}` is straightforward pattern work. Ships as a standalone VS Code extension with no runtime dependencies. Visual improvement in template files.

**Day 6-8: TS plugin or pure type solution for `self`.** Solves the remaining 30% of the JS typing problem. At this point, JS files have full intelligence for settings, state, and self.

That's 8 days to solve 70% of the stated problem. The remaining 30% (template completions, hover, go-to-definition) is where the 15-22 additional days go. That work is valuable but less urgent.

**Should it be done now, pre-1.0?** Yes, for three reasons:

1. **The `.d.ts` changes cost almost nothing** and improve the development experience for the team building the remaining 70+ components. This is a force multiplier.

2. **The tmLanguage grammar is editor-agnostic** and improves readability for everyone who touches `.html` files. It's foundational work that doesn't become stale.

3. **The ComponentAnalyzer design benefits from being built while the framework is still young.** It establishes what the "contract" between component files and tooling looks like. If you wait until post-1.0, the analysis patterns may be harder to retrofit.

The full template LSP (completions, hover, go-to-def) can wait. It's the most expensive phase and its value depends on having a critical mass of components with specs.

---

## Question 5: Is excluding full expression type-checking the right boundary?

### Yes. This is the correct boundary, and it's not a gap users will feel.

The template expression language is a hybrid. It supports:
- Lisp-style: `{formatDate date 'h:mm a'}` -- function application by juxtaposition
- JS-style: `{a + b * 2}` -- standard operators
- Mixed: `{concat 'hi ' (isNew ? 'new' : 'old')}` -- Lisp wrapping JS
- Runtime resolution: `new Function` + `with(Proxy)` with automatic Signal unwrapping

Type-checking this would require building a type inference engine for a language that doesn't have a formal type system. The expressions are intentionally dynamic -- they run through a Proxy that auto-unwraps Signals and auto-invokes zero-arg functions. The `evaluateJavascript` method literally uses `new Function('ctx', 'with (ctx) { return ${code}; }')`. You cannot statically type `with` blocks.

What the LSP *can* do -- and what the design correctly identifies -- is:
1. **Name resolution**: Does `{getActiveIndex}` exist in the data context? This catches typos.
2. **Scope awareness**: Is `{item}` valid here? Only if we're inside an `{#each ... as item}`.
3. **Spec validation**: Is `primary` a valid option attribute for `ui-button`? Yes.

These three checks catch the vast majority of real template errors. Looking at actual templates:

`input.html`: `{ui}`, `{classMap getStateClasses}`, `{type}`, `{placeholder}`, `{disabled}`, `{name}`, `{value}`, `{icon}`, `{isClearable}`, `{getIcon}`, `{label}`. Every expression is a simple name lookup. Zero arithmetic, zero complex expressions.

`button.html`: `{badge}`, `{ui}`, `{href}`, `{icon}`, `{iconAfter}`, `{iconOnly}`, `{animated}`. Same pattern -- all simple lookups. The `{not iconAfter}` pattern is a helper call, which can be validated by checking that `not` exists in the HelperRegistry and `iconAfter` exists in the data context.

Users won't feel the gap because real template expressions are almost exclusively simple name lookups and helper calls. The rare complex expression (like `{count + 1}` or `{isNew ? 'new' : 'old'}`) is still validated at the name level (does `count` exist? does `isNew` exist?).

The one place this boundary *could* feel incomplete is in `{#if}` conditions. Developers might write `{#if items.length > 0}` and expect the LSP to know that `items` is an array. But even here, name resolution ("does `items` exist?") catches the most common error (typo), and the runtime Proxy handles the rest gracefully.

---

## Question 6: Are there simpler alternatives to a full LSP?

### Yes, and they should be pursued as a progressive strategy, not an alternative.

The question frames this as "80% of the value without a full LSP." Let me enumerate what you get from each layer:

**Layer 1: Pure `.d.ts` changes (0 new tooling, 1-2 days)**
- Settings completions in JS: `settings.` shows all setting names with types
- State completions in JS: `state.` shows all state keys as `Signal<T>`
- Works in tsc, VS Code, JetBrains, vim with coc.nvim, etc.
- **Value: 40% of the total problem**

**Layer 2: Extended tmLanguage (standalone grammar file, 2-3 days)**
- Syntax highlighting for all template constructs
- No runtime, no server, no dependencies
- Ships in any editor that supports TextMate grammars (VS Code, Sublime, JetBrains via plugin)
- **Value: 10% of the total problem** (readability, not intelligence)

**Layer 3: Custom Elements Manifest (generated JSON, 1-2 days)**
- Standard `custom-elements.json` format
- Consumed by VS Code's built-in HTML language features, JetBrains, Storybook
- Gives attribute completions for `<ui-button ...>` in plain HTML files
- Doesn't help inside SUI templates (which aren't processed by VS Code's HTML server)
- **Value: 15% of the total problem** (but only for external consumers, not for SUI component authors)

**Layer 4: TS plugin for `self` (VS Code plugin, 3-5 days)**
- Completes `self.` in JS files
- IDE-only, but the most painful gap for component authors
- **Value: 20% of the total problem**

**Layer 5: Full template LSP (5-15 days)**
- Completions, hover, diagnostics, go-to-definition in `.html` files
- The only way to get intelligence inside the custom template language
- **Value: 15% of the total problem** (most template errors are caught at runtime quickly)

Layers 1-3 give you ~65% of the value with ~5 days of work and zero server infrastructure. Layer 4 adds another 20% for the component authoring audience. Layer 5 is the long tail.

**The Custom Elements Manifest deserves specific attention.** It's standard, well-supported, and gives external consumers of SUI components (people writing `<ui-button>` in their own HTML) attribute completions for free. The `.component.js` format is already 90% of what CEM needs -- a simple script could convert it. This serves a different audience than the LSP (downstream users vs. SUI contributors) but is arguably more important for adoption.

**My recommendation:** Ship Layers 1-3 now (5-7 days total). This is the right "minimum viable slice." Evaluate whether Layer 4 (TS plugin) is needed or whether the pure type approach from Question 1 can solve `self` without tooling. Defer Layer 5 (full template LSP) until after more components are built and the template patterns stabilize further.

---

## Cross-cutting observations

### The ComponentAnalyzer is overscoped

The TDD proposes the ComponentAnalyzer as a shared module that parses JS to AST using TypeScript's compiler API, walks the AST to find `defineComponent`, extracts `createComponent` return shapes, traces imports, resolves specs, etc. This is a significant piece of static analysis infrastructure.

But looking at the actual component files, the patterns are remarkably consistent:

```javascript
const createComponent = ({ self, settings, state, ... }) => ({
  methodName() { ... },
  otherMethod() { ... },
});
```

Every component follows this exact structure. The return is always an object literal with method definitions. You could extract method names with a *regex* (`/(\w+)\s*\(.*?\)\s*{/g` on the return object) and get correct results for every existing component. The full TS AST analysis is buying correctness against patterns that don't exist in practice.

Similarly, `defaultState` and `defaultSettings` are always simple object literals:
```javascript
const defaultState = { focused: false };
```

A regex or simple AST parse can extract these reliably. The framework's conventions are tight enough that lightweight analysis works.

I'd recommend starting with regex-based extraction (fast, no TS dependency) and only upgrading to full AST analysis when a concrete case demands it. The TS compiler API adds ~20MB of dependencies and significantly complicates the build.

### The compiler changes are well-scoped but `recoverable` needs care

Adding `includePositions` to `compile()` is straightforward -- the StringScanner already tracks `this.pos`. The change is purely additive.

`recoverable: true` is more subtle. The current `fatal()` method in StringScanner does two things: logs a rich error with context lines, and throws. Making it push to an error array instead of throwing means the parser must be able to *continue* after the error. Looking at the compiler code, the control flow after `fatal()` varies:

- In `ELSEIF`: `fatal()` is called but there's no `break`, so control falls through (this is already a soft bug -- after `fatal()` throws, it doesn't matter, but in recoverable mode, it would continue into the next case)
- In `ELSE`: has a `break` after `fatal()` in some branches
- In `CLOSE_IF`: `fatal()` is called, no `break`

For recoverable mode to work correctly, every call site that invokes `fatal()` needs a `break` or `continue` to prevent cascading errors. This is a small but important detail the design should call out explicitly.

### The HelperRegistry should be auto-generated, not hand-maintained

The design says "Populated at build time -- generated from the source file." But `template-helpers.js` is a plain JS file with functions that have varying signatures. To generate the registry, you'd need to either:
1. Parse the JSDoc (none exists currently)
2. Use TS compiler API to infer parameter types (the file is JS, so types are guesses)
3. Hand-write the registry

Option 3 is what will actually happen, and it means ~50 helper entries that must be kept in sync with the source. This is maintainable but should be acknowledged as ongoing cost. Adding JSDoc to `template-helpers.js` would both improve the source documentation and enable auto-generation.

### The plan doesn't address the `{ui}` magic variable

Looking at `button.html`: `<div class="{ui}button">`. The `{ui}` expression is a computed class string from active spec attributes. It's not a variable in the data context -- it's synthesized by the component framework from the spec. The LSP needs to know about this special name; otherwise it will flag `{ui}` as "unknown identifier" in every single template file. This should be documented as a known special case in the HelperRegistry or ComponentModel.

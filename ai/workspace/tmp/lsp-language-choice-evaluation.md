# LSP Language Choice Evaluation

Evaluation based on the current state of `packages/lsp/` and the source files it consumes.

---

## Question 1: What language should the LSP server be written in?

**Recommendation: JavaScript (the current choice), with TypeScript adoption deferred until the broader project adopts it.**

### Analysis by criterion

**Startup latency.** The LSP launches via `node bin/sui-lsp.js`. Node cold-start to first message is ~50-80ms on modern hardware. The dominant startup cost is `specRegistry.scan()`, which globs for `*.component.js` files and JSON-parses each one — currently ~14 specs, growing to ~80. At 80 files, this is still sub-100ms of synchronous I/O. The TypeScript import (`import ts from 'typescript'`) is lazy (only triggered when `analyzeComponent` is called), so it does not block `onInitialize`. A Rust or Go binary would start faster (~5-15ms), but the difference is invisible because LSP startup happens once per editor session and the protocol handshake itself introduces latency.

**Completion response time.** The hot path is `onCompletion` → `getCompletionContext` (string scanning, ~0.01ms) → one of the completion functions. `getExpressionCompletions` reads from the pre-built `componentModels` cache and iterates the `helpers` object. `getAttributeCompletions` reads from `specRegistry.specs`. None of these do I/O or heavy computation. For a component with 30 attributes and 50 option attributes, this builds ~80 completion items by iterating two arrays and a Map. Response time is well under 1ms. The only potentially slow path is `validateTemplate`, which dynamically imports `@semantic-ui/compiler` and runs the compiler — but that compiler is designed to run in the browser at sub-1ms for templates of 10-60 lines, so this is also negligible. There is no scenario where JavaScript is a bottleneck on these workloads.

**Memory usage.** Node baseline is ~30-40MB. The spec registry at 80 components will hold perhaps 200KB of structured data. The helper registry is a static object. Component models are small Maps. TypeScript's `ts` module adds ~20MB when loaded but is only needed on-demand. Total steady-state for this LSP will be ~50-70MB. A Rust implementation might use 5-15MB, but 50-70MB is unremarkable for a long-running editor process. VS Code itself uses 300MB+. This is not a meaningful concern.

**Maintainability.** The existing code is 514 lines of server logic, 400 lines of component analysis, 163 lines of spec registry, and 285 lines of helper definitions — roughly 1,360 lines total. This is a small, focused codebase. The patterns are straightforward: string scanning, Map lookups, object iteration, AST walking. JavaScript is the natural fit because:
- The template compiler it calls is JavaScript.
- The component files it parses are JavaScript.
- The spec files are JavaScript modules with JSON-compatible content.
- The monorepo build system, testing infrastructure (vitest), and package tooling are all JavaScript.

**Ecosystem fit.** The `vscode-languageserver` npm package is the canonical LSP implementation library. It is maintained by Microsoft, used by every major JS/TS-based LSP (Svelte, Vue/Volar, Astro, Tailwind CSS, ESLint, Prettier), and provides correct protocol handling including incremental text sync, cancellation, and progress. The Go and Rust LSP libraries exist but are less mature and less used for framework-specific tools. Using `vscode-languageserver` means the LSP gets protocol correctness for free.

**Contributor accessibility.** Semantic UI is a web component framework. Its users and contributors write JavaScript. Every contributor who can write a component can read and modify the LSP. Requiring Rust or Go knowledge would restrict the contributor pool to a small fraction of the community. This is the decisive factor for an open-source project.

### Why not TypeScript?

The brief mentions TypeScript as an option. The current implementation is plain JavaScript, consistent with the rest of the monorepo (`packages/*/src/*.js`). Converting to TypeScript would add a build step for a single package, introduce a `.ts` → `.js` compilation dependency, and diverge from the project's conventions. If the project later adopts TypeScript broadly, the LSP can follow. For now, JSDoc annotations (if needed) provide the same documentation benefit without the compilation cost.

---

## Question 2: How does the existing JS template compiler affect language choice?

**It effectively locks the choice to JavaScript unless there is an overwhelming reason to accept the rewrite cost.**

The template compiler (`packages/compiler/src/template-compiler.js`, 881 lines) and its `StringScanner` (243 lines) are runtime dependencies. The LSP server already uses them directly:

```js
const { TemplateCompiler } = await import('@semantic-ui/compiler');
const compiler = new TemplateCompiler(text);
compiler.compile(undefined, { recoverable: true });
```

This is a clean, zero-friction integration. The compiler runs in-process, returns errors synchronously, and the LSP can access internal state (like `compiler.errors` and `compiler.snippets`) directly.

If the LSP were written in Rust or Go:
- **Rewrite option:** The compiler would need to be ported line-by-line. The `StringScanner` uses `rest()` (string slicing), `consume()` (regex matching), and `consumeUntil()` (regex search) — these translate to Rust, but the regex patterns use JavaScript-specific syntax and the `TemplateCompiler` relies on JavaScript's dynamic regex construction (`new RegExp(pattern)`). A Rust port would need to replicate the exact parsing behavior including edge cases around nested braces, boolean attribute detection, and SVG handling. This is 1,100+ lines of careful porting with a high surface area for divergence bugs.
- **FFI/subprocess option:** The Rust LSP could shell out to a Node process or use `napi-rs` to call JavaScript. This negates the performance advantage, adds IPC latency on every validation, and creates a dual-runtime deployment burden (users need both the Rust binary and Node installed).
- **WASM option:** The compiler could be compiled to WASM and called from Rust. This is technically possible but adds extreme build complexity for no user-facing benefit.

The compiler is not a bottleneck. It processes 60-line templates in under 1ms. The `recoverable: true` mode already exists for LSP use, producing structured error arrays with positions. There is nothing to gain from rewriting it.

---

## Question 3: TypeScript compiler API for JS parsing — alternatives and impact

**The `typescript` dependency is the right parser for this use case, but the 20MB cost is real and worth acknowledging.**

### What the analyzer actually does

`component-analyzer.js` uses TypeScript purely as a parser — `ts.createSourceFile()` with no type checking, no program creation, no project resolution. It walks the AST to:
1. Find `import` declarations and resolve template/spec paths.
2. Find `defineComponent({...})` call expressions.
3. Extract property names and values from object literals (tagName, createComponent, defaultState, defaultSettings, events, subTemplates).
4. Unwrap arrow functions and parenthesized expressions to find the return value of `createComponent`.
5. Infer types from literal values (string, number, boolean, null, array, object, function).

This is structural extraction — it needs to parse valid JavaScript into an AST and walk it. It does not need type inference, flow analysis, or module resolution.

### Alternatives

| Parser | Size | Parse speed | AST fidelity | Notes |
|--------|------|-------------|--------------|-------|
| `typescript` (current) | ~20MB | ~10ms for 150-line file | Full TS/JS AST | Battle-tested, exact JS semantics |
| `acorn` | ~200KB | ~2ms for 150-line file | ESTree AST | Industry standard, used by Rollup/Vite/ESLint |
| `@babel/parser` | ~2MB | ~3ms for 150-line file | Babel AST (superset of ESTree) | Handles all syntax proposals |
| `oxc-parser` (WASM) | ~4MB WASM | ~0.5ms for 150-line file | ESTree-compatible | Rust-based, fastest option |
| `tree-sitter` | ~5MB + grammar | ~1ms for 150-line file | CST (concrete syntax tree) | Incremental, error-tolerant |

**`acorn` is the strongest alternative.** It is 100x smaller than TypeScript, parses all standard ES2024 syntax, produces an ESTree AST, and is the parser used by Rollup, Vite, and ESLint. The component analyzer's AST walking would need to be rewritten from TypeScript's AST node types to ESTree node types, but the logic is structurally identical:
- `ts.isCallExpression(node)` → `node.type === 'CallExpression'`
- `ts.isIdentifier(callee) && callee.text === 'defineComponent'` → `callee.type === 'Identifier' && callee.name === 'defineComponent'`
- `ts.isObjectLiteralExpression(options)` → `options.type === 'ObjectExpression'`

The migration is mechanical — roughly 1:1 line replacement across 400 lines.

**Does this affect the language decision?** No. The parser choice is orthogonal to the language choice. If the LSP stays in JavaScript (recommended), switching from `typescript` to `acorn` is a clean internal refactor that reduces the install footprint from ~20MB to ~200KB. This is worth doing regardless of any other decision. If the LSP were written in Rust, it would use `oxc_parser` or `swc_ecma_parser` natively — but that is a separate decision path with much larger implications.

### Recommendation

Switch to `acorn` for JS parsing. The 20MB `typescript` dependency is disproportionate for a package that uses exactly one function (`ts.createSourceFile`) with no type checking. The acorn rewrite is mechanical and testable against the existing test suite (which covers button, input, menu, and divider components).

---

## Question 4: Contributor accessibility and language choice

**This is the single most important factor and it decisively favors JavaScript.**

Semantic UI is a UI framework for web developers. The contributor profile is:
- Frontend developers who write HTML, CSS, and JavaScript daily.
- Framework users who author components using `defineComponent()`, templates, and specs.
- Open source contributors who file issues about template parsing edge cases, missing completions, or incorrect hover info.

These contributors can:
- Read `server.js` and understand `getCompletionContext()` (string scanning with brace counting).
- Read `component-analyzer.js` and understand how it extracts method names from `createComponent`.
- Read `spec-registry.js` and understand how it indexes JSON files.
- Read `helper-registry.js` and add a new helper entry.
- Write a test in vitest to reproduce a bug.

If the LSP were written in Rust:
- ~95% of contributors could not read the code.
- Bug reports about completions would become "works for me" dead ends because contributors cannot trace the logic.
- Adding a new helper signature (currently: add 4 lines to a JS object literal) would require a Rust build toolchain.
- The LSP would become a black box maintained by 1-2 people, creating a bus factor problem.

If the LSP were written in Go:
- Better than Rust for readability, but still a second language in a JavaScript monorepo.
- Go's string handling and JSON parsing are fine but not meaningfully better than JavaScript for this workload.
- Deployment complexity increases (users need Go binary distribution or prebuilt binaries for each platform).

The LSP is not a standalone tool like Biome or deno — it is a framework-specific editor extension that needs to evolve in lockstep with the template language, the component API, and the spec system. Every breaking change in `defineComponent()` needs a corresponding update in `component-analyzer.js`. Every new template block type needs a corresponding update in `getBlockCompletions()`. The people making those framework changes need to be the same people who can update the LSP.

---

## Question 5: What do production framework LSPs use, and what pattern does this LSP fall into?

### Framework-specific LSPs (template/component languages)

| LSP | Language | Why |
|-----|----------|-----|
| **Svelte Language Server** | TypeScript | Svelte is a TS-first project; the compiler is TS; the LSP wraps the compiler |
| **Vue/Volar** | TypeScript | Vue SFCs require deep integration with TS language service for `<script lang="ts">` |
| **Astro Language Server** | TypeScript | Astro is TS-first; uses Volar framework internally |
| **Angular Language Service** | TypeScript | Ships as part of `@angular/language-service`; deep TS integration |
| **Tailwind CSS IntelliSense** | TypeScript | Tailwind is a TS project; LSP reads `tailwind.config.ts` |
| **Lit Analyzer** | TypeScript | Lit is a TS project; analyzes TS type annotations on elements |
| **Emmet Language Server** | TypeScript | Abbreviation expansion logic is all JS/TS |

**Pattern:** Every framework-specific LSP is written in the same language as its framework. None of them use Rust, Go, or any non-JS language. This is because they need to call the framework's own compiler/parser/resolver, and the framework is JavaScript/TypeScript.

### General-purpose language tools

| Tool | Language | Why |
|------|----------|-----|
| **Biome** | Rust | Replaces ESLint+Prettier; processes millions of lines per second; performance is the product |
| **oxlint** | Rust | Linter competing on speed; same rationale as Biome |
| **rust-analyzer** | Rust | LSP for Rust; the compiler is Rust; natural fit |
| **gopls** | Go | LSP for Go; the compiler is Go; natural fit |
| **deno** | Rust | Full runtime + bundler + linter + LSP; Rust is justified by the scope |
| **typescript-language-server** | TypeScript | Wraps `tsserver`; the compiler is TS |

**Pattern:** General-purpose tools use Rust/Go when (a) they process arbitrary codebases of unbounded size, (b) performance is the competitive differentiator, or (c) they are the language server for the language they are written in.

### Where does this LSP fall?

This LSP falls squarely in the "framework-specific" category:
- It processes framework-specific files (SUI templates, SUI component definitions, SUI specs).
- It calls the framework's own compiler (`@semantic-ui/compiler`).
- It understands framework-specific concepts (settings, state, createComponent, subtemplates, spec-driven attributes).
- Template files are 10-60 lines. Component files are 30-150 lines. There is no "million-line codebase" scaling concern.
- The LSP will never process arbitrary JavaScript — it only cares about `defineComponent()` call sites and `.html` templates.

By every precedent, this should be written in the framework's language. JavaScript.

---

## Question 6: Does the Rust/WASM dual-compilation possibility change the calculus?

**No. It is premature and the economics do not justify it.**

### The argument for Rust/WASM

The template compiler runs in two contexts:
1. **Browser runtime** (current): `TemplateCompiler.compile()` is called lazily when a component first renders. It produces an AST that the renderer walks to build DOM.
2. **LSP** (new): The same compiler runs in Node to produce diagnostics.

If the compiler were written in Rust, it could compile to:
- A native binary linked into a Rust LSP server (fast).
- A WASM module loaded by the browser runtime (fast, smaller than JS for compute-heavy code).

### Why it does not change the decision

**The compiler is not a performance bottleneck.** The brief states templates are 10-60 lines and compile in sub-1ms. The `StringScanner` does character-by-character scanning with regex matching — this is I/O-free string processing. Even a 10x speedup (generous for WASM vs. JS on this workload) would save ~0.9ms per compilation. Users cannot perceive this.

**WASM has overhead that can negate gains for small inputs.** WASM module instantiation, memory allocation for string transfer (JS strings must be copied into WASM linear memory and results copied back), and the inability to share JS objects across the boundary all add constant overhead. For a 60-line template, the marshaling cost may exceed the compute savings. WASM wins on large, compute-heavy workloads (image processing, cryptography, physics simulation) — not on parsing a few dozen lines of HTML-like markup.

**The compiler is tightly coupled to the framework's JS runtime.** The `TemplateCompiler` produces an AST that is consumed by `packages/templating/` and `packages/renderer/`, both JavaScript. The AST nodes reference JavaScript values (strings, numbers, booleans, arrays, objects). A Rust compiler producing the same AST would need to serialize it to JSON and deserialize in JS, adding latency and complexity. Alternatively, the renderer would also need to be ported to Rust/WASM, creating a cascading rewrite.

**The maintenance burden is severe.** A Rust port of the compiler means:
- Two implementations to keep in sync as the template language evolves (new block types, new expression syntax, new preprocessing rules).
- A Rust build toolchain added to the monorepo (cargo, wasm-pack, wasm-opt).
- WASM binary distribution in the npm package (adds ~100-500KB to the browser bundle).
- Contributors who change the template language must update both implementations.
- Edge-case divergence bugs that only appear in one implementation.

**The project is pre-1.0 with ~14/80 components built.** The template language is still evolving — the `recoverable` mode was recently added for LSP support, and `{#guard}` was added as a new block type. This is exactly the wrong time to freeze the compiler into a second language. The cost of dual maintenance during rapid iteration is much higher than any marginal performance gain.

### When would Rust/WASM make sense?

If all of the following became true simultaneously:
1. The template language is frozen (no new syntax for 12+ months).
2. Template compilation becomes a measurable bottleneck (templates grow to 500+ lines, or compilation happens in a hot loop).
3. The project has Rust contributors willing to maintain the port.
4. The WASM module size is acceptable for the CDN bundle budget.

None of these conditions are met today or likely to be met in the next year.

---

## Summary

| Question | Answer |
|----------|--------|
| Language choice | **JavaScript** — matches the framework, the ecosystem, the contributors, and every precedent |
| Compiler reuse | Direct `import` integration, zero-friction; any other language adds FFI/subprocess/rewrite cost |
| JS parser | Switch from `typescript` (~20MB) to `acorn` (~200KB); mechanical refactor, same test coverage |
| Contributor access | Decisive factor; Rust/Go would create a black box in a community-maintained project |
| Industry precedent | Every framework-specific LSP uses the framework's language; Rust is for general-purpose tools |
| Rust/WASM compiler | Premature; no bottleneck exists, the language is still evolving, and WASM overhead may negate gains on small templates |

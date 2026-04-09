## Task: Evaluate implementation language choice for a framework-specific Language Server

Read all source files listed below before answering.

### Context

Semantic UI is a web component framework with a custom template language. The project is building a Language Server Protocol (LSP) implementation that provides completions, diagnostics, hover, and go-to-definition for both template files (.html with custom expression syntax) and component JavaScript files.

The LSP needs to:
1. Parse template files using an existing compiler (written in JS, ~830 lines)
2. Parse component .js files to extract method names, settings, state, and event handlers from `defineComponent()` calls
3. Index component spec files (JSON-like) for HTML attribute completions
4. Maintain a registry of ~50 built-in template helper signatures
5. Detect cursor context in template files (inside expression, HTML attribute, block structure, etc.)
6. Serve completions, diagnostics, and hover via the LSP protocol

The template compiler already exists in JavaScript as a published package. Component specs are JSON-serializable build artifacts. The framework is pre-1.0 with ~14 components built and ~80 planned.

### Key Technical Facts

- Template files are typically 10-60 lines
- Component JS files are typically 30-150 lines
- The template compiler uses a StringScanner (character-by-character) and regex-based tag detection
- Component analysis requires parsing JS to extract object literal properties from `defineComponent()` calls
- The spec registry indexes ~80 JSON files at startup
- The project is an npm monorepo; all packages are ESM JavaScript
- The framework targets web developers who use VS Code, Neovim, Helix, Zed, and other LSP-capable editors
- The LSP server will be published as an npm package (`@semantic-ui/lsp`) with a CLI binary (`sui-lsp --stdio`)

### Questions — Evaluate Independently

**Question 1:** What language should the LSP server be written in? Consider JavaScript/TypeScript, Rust, Go, or any other option. Evaluate based on: startup latency, completion response time, memory usage, maintainability, ecosystem fit, and contributor accessibility.

**Question 2:** The template compiler already exists in JavaScript. If the LSP is written in a different language, the compiler would need to be either rewritten or called via FFI/subprocess. How does this affect the language choice?

**Question 3:** Component JS file analysis currently uses TypeScript's compiler API (`ts.createSourceFile`) for AST parsing. This is a ~20MB dependency with non-trivial startup cost. Are there lighter alternatives, and does the parser choice affect the language decision?

**Question 4:** For an open-source UI framework, how important is it that contributors can read and modify the LSP code? How does language choice affect the contributor pool?

**Question 5:** What do production framework-specific LSPs (Svelte, Vue/Volar, Astro, Angular, Tailwind) use, and why? What do general-purpose language tools (Biome, oxlint, rust-analyzer, deno) use, and why? Is there a pattern in which category this LSP falls into?

**Question 6:** The template compiler is currently ~830 lines of JS using a character-by-character scanner. It runs in the browser at runtime (lazy AST compilation, sub-1ms for typical templates). If rewritten in Rust, it could compile to both a native binary (for the LSP) and WASM (for the browser runtime). Does the potential for a shared Rust/WASM compiler change the calculus, or is it premature?

### Source Files to Read

- `packages/compiler/src/template-compiler.js` — the existing template compiler
- `packages/compiler/src/string-scanner.js` — the character-by-character scanner
- `src/primitives/button/button.js` — canonical component file (what the analyzer parses)
- `src/primitives/button/button.html` — canonical template file (what the LSP serves)
- `src/primitives/button/specs/button.component.js` — compiled spec (what the registry indexes)

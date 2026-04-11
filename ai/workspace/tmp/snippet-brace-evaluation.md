## Task: LSP snippet insertText with literal braces in a brace-delimited template language

Read all source files listed below before answering.

### Context

An LSP language server provides block completions for a template language where `{` and `}` are the expression delimiters. Example template syntax:

```html
{#if condition}
  content
{/if}

{#each item in items}
  {item.name}
{/each}
```

The LSP returns completion items with `insertTextFormat: 2` (Snippet) so that placeholder tab stops work. The consumer is `@codemirror/lsp-client` which converts LSP snippets to CM6 snippets.

### The Conflict

LSP snippet syntax uses `${1:placeholder}` where `{` and `}` are metacharacters. The template language's closing tags (`{/if}`, `{/each}`) contain literal `{` and `}` characters that collide with snippet syntax.

### What Needs to Happen

When the user types `{#` and selects "if" from completions, the editor should produce:

```
{#if condition}
  
{/if}
```

With the cursor selecting "condition" as a tab stop, and `{/if}` inserted as literal text.

The `{#` is already in the document when the completion fires. The completion replaces from the word position after `#`.

### Questions — Evaluate Independently

**Question 1:** What is the correct LSP snippet escaping for literal braces? How does the LSP snippet specification (from `vscode-languageserver-protocol`) define escaping of `{`, `}`, `\`, and `$` in insertText when insertTextFormat is Snippet?

**Question 2:** How does `@codemirror/lsp-client` transform LSP snippet text into CM6 snippet format? Read the actual conversion code — does it handle escaped braces? What does CM6's own snippet format expect for literal braces?

**Question 3:** Given the answers above, what should the `insertText` value be for an "if" block completion that produces `{#if condition}\n{/if}` with "condition" as a placeholder? Show the exact string.

### Source Files to Read

- `/home/jack/semantic/next/node_modules/@codemirror/lsp-client/src/completion.ts` — how LSP completions are converted to CM6
- `/home/jack/semantic/next/node_modules/@codemirror/autocomplete/src/snippet.ts` — CM6 snippet parsing and brace handling
- `/home/jack/semantic/next/tools/lsp/src/language-service.js` lines 288-296 — current block completion insertText values

# TextMate Grammar Injection Fix for Semantic UI VS Code Extension

## Root Cause Analysis

There are **three compounding problems** preventing the grammar from producing visible highlighting. Each one alone would be sufficient to cause total failure.

### Problem 1: `injectTo` includes `text.html.basic` (dead target)

VS Code ships two HTML grammars:

| scopeName | File | `language` field |
|---|---|---|
| `text.html.basic` | `html.tmLanguage.json` | *(none)* |
| `text.html.derivative` | `html-derivative.tmLanguage.json` | `"html"` |

Only `text.html.derivative` is bound to the `html` language identifier. When a user opens an `.html` file, VS Code activates the **derivative** grammar, which internally includes rules from `text.html.basic`. But grammar injection via `injectTo` targets the **root grammar** applied to the file, not grammars it includes.

This means `injectTo: ["text.html.basic"]` is a dead target -- no file ever has `text.html.basic` as its root grammar. The current config lists both, so `text.html.derivative` is technically present, but Problem 2 makes it moot.

**Fix:** Use `"injectTo": ["text.html.derivative"]` only.

### Problem 2: `injectionSelector` targets the wrong scope

The grammar file has:
```json
"injectionSelector": "L:text.html"
```

This selector tells the TextMate engine: "inject my patterns wherever the scope `text.html` is active." But the root scope of the HTML grammar is `text.html.derivative`, not `text.html`. TextMate scope selectors match **exact prefixes** in the scope stack, so `text.html` would match `text.html.derivative`... but only if `text.html` actually appears as a standalone scope in the scope stack. It does not. The scope stack for body text in an HTML file is:

```
text.html.derivative
```

The selector `L:text.html` is looking for a scope that is exactly `text.html` or starts with `text.html ` (space), which is an ancestor scope. Since the root scope is `text.html.derivative` (a single dotted identifier, not a nested scope), this actually does match via TextMate's dotted scope prefix matching. However, the combination with Problem 3 ensures nothing is visible.

For clarity and to match the Angular convention, use:
```json
"injectionSelector": "L:text.html -comment"
```

**Angular's working grammar uses exactly:** `"injectionSelector": "L:text.html -comment"`

### Problem 3 (The Real Killer): `{` conflicts with the HTML grammar's own tokenization

This is the most subtle and damaging issue. The HTML grammar already tokenizes `{` characters in attribute values and (critically) **does not leave text content between tags as an untokenized region where arbitrary patterns can freely match**.

When an injection grammar tries to match `\{` in the body content of an HTML document, the TextMate engine processes patterns in a specific priority order. The `L:` prefix in the injection selector means "left priority" -- the injection's patterns are tried **before** the host grammar's patterns at the same scope level.

However, the real issue is simpler: **the `sui-expressions` pattern's `begin`/`end` regex is too greedy and conflicts with HTML attribute contexts**. The pattern:

```json
"begin": "(\\{\\{|\\{(?!\\{))",
"end": "(\\}\\}|\\}(?!\\}))"
```

This will attempt to match `{` inside HTML attribute values like `class="{ui} button"`, `style="width: {w}px"`, etc. Since TextMate is a line-oriented regex engine, a `begin` pattern that matches a bare `{` will interfere with the HTML grammar's own attribute parsing. When the injection fires inside an attribute string scope, the `end` pattern `\}` can consume the closing `}` before the HTML grammar gets to parse the closing quote, corrupting the entire tokenization from that point forward. VS Code's TextMate engine handles this by **silently falling back** to the non-injected grammar when the injection produces degenerate results.

But there's an even more fundamental issue: **in the plain text content between HTML tags, there is no special scope assigned** -- the text sits at the root `text.html.derivative` scope. The injection patterns *should* match here. The fact that they don't produce visible changes means the **scope names being assigned don't map to any theme colors**.

### Problem 3b: Scope names don't map to theme colors

This is likely the final missing piece. The grammar assigns scopes like:
- `punctuation.definition.template-expression.begin.sui`
- `meta.template.expression.sui`
- `keyword.control.block.sui`
- `variable.parameter.sui`

VS Code themes colorize based on **standard TextMate scope conventions**. Custom scope names like `*.sui` will only be colorized if:
1. The theme explicitly includes rules for them, OR
2. They use standard prefixes that themes already target

Scopes like `keyword.control.block.sui` **should** work because themes target `keyword.control`. But `punctuation.definition.template-expression.begin.sui` is non-standard and many themes won't have a rule for it.

The `meta.*` scopes are particularly problematic -- most themes assign **no color** to `meta.*` scopes, treating them as transparent grouping scopes. So `meta.template.expression.sui` is invisible.

## How Working Extensions Solve This

### Approach A: Define a new language (Handlebars, Jinja, Svelte)

Handlebars, Jinja, and Svelte all register a **new language** (e.g., `handlebars`, `jinja-html`, `svelte`) with its own file extensions. Their grammar has `scopeName: "text.html.handlebars"` and includes `text.html.basic` to get HTML support, then layers template patterns on top with higher priority.

**Pros:** Full control over tokenization. No conflicts.
**Cons:** Users must associate `.html` files with the new language, or use different file extensions.

### Approach B: Grammar injection (Angular)

Angular's VS Code extension injects `{{ }}` interpolation into `text.html.derivative` and it **works**. Here is their exact setup:

**package.json:**
```json
{
  "scopeName": "template.ng",
  "path": "./syntaxes/template.json",
  "injectTo": ["text.html.derivative", "source.ts"],
  "embeddedLanguages": {
    "text.html": "html",
    "source.css": "css",
    "expression.ng": "javascript"
  }
}
```

**template.json:**
```json
{
  "scopeName": "template.ng",
  "injectionSelector": "L:text.html -comment",
  "patterns": [
    { "include": "#interpolation" }
  ],
  "repository": {
    "interpolation": {
      "begin": "{{",
      "beginCaptures": {
        "0": { "name": "punctuation.definition.block.ts" }
      },
      "end": "}}",
      "endCaptures": {
        "0": { "name": "punctuation.definition.block.ts" }
      },
      "contentName": "expression.ng",
      "patterns": [
        { "include": "expression.ng" }
      ]
    }
  }
}
```

Key observations:
- `injectionSelector: "L:text.html -comment"` -- injects into HTML but not inside comments
- Scopes use **standard names** like `punctuation.definition.block.ts` that themes already colorize
- Angular separates control-flow blocks (`@if`, `@for`) into a **second injection grammar** (`template.blocks.ng`) with a more restrictive injection selector: `L:text.html -comment -expression.ng -meta.tag -source.css -source.js`

## The Fix

### Step 1: Fix `package.json`

```json
"grammars": [
  {
    "scopeName": "source.sui.template",
    "path": "./sui.tmlanguage.json",
    "injectTo": ["text.html.derivative"]
  }
]
```

Changes:
- Remove `text.html.basic` from `injectTo` (dead target)
- Rename scopeName to `source.sui.template` (clearer intent; `source.sui` sounds like a standalone language)

### Step 2: Fix `sui.tmlanguage.json`

The injection selector and scope names need to be fixed:

```json
{
  "scopeName": "source.sui.template",
  "injectionSelector": "L:text.html -comment -source.css -source.js",
  "patterns": [...]
}
```

Key changes to the injection selector:
- `L:text.html` -- matches both `text.html.basic` and `text.html.derivative` via prefix matching
- `-comment` -- don't inject inside HTML comments
- `-source.css` -- don't inject inside `<style>` blocks
- `-source.js` -- don't inject inside `<script>` blocks

### Step 3: Fix scope names to use standard conventions

Replace non-standard scope names with ones that themes already colorize:

| Current scope | Fixed scope | Why |
|---|---|---|
| `punctuation.definition.template-expression.begin.sui` | `punctuation.definition.block.begin.sui` | Standard punctuation prefix |
| `punctuation.definition.template-expression.end.sui` | `punctuation.definition.block.end.sui` | Standard punctuation prefix |
| `meta.template.expression.sui` | `meta.embedded.expression.sui` | `meta.embedded` has theme support |
| `keyword.control.block.sui` | `keyword.control.sui` | Simplify -- `keyword.control` is universally themed |
| `variable.parameter.sui` | `variable.other.readwrite.sui` | `variable.parameter` may not be themed in all contexts |

### Step 4: Exclude attribute-value contexts from expression matching

The `sui-expressions` pattern must NOT fire inside HTML attribute string scopes (e.g., `class="{ui}"`), because the HTML grammar already owns those regions. Add exclusions to the injection selector or restructure the patterns.

Angular solves this by having its injection selector exclude `-meta.tag`, which prevents injection inside HTML tag definitions entirely. For SUI, where expressions appear in attribute values, this is a problem -- we'd need a separate approach for attribute contexts.

**Recommended approach for v1:** Exclude `meta.tag` from the injection selector:

```json
"injectionSelector": "L:text.html -comment -source.css -source.js -meta.tag"
```

This means SUI expressions in attributes (e.g., `class="{ui} button"`) won't be highlighted by this injection grammar. That's acceptable for v1. Attribute-value highlighting requires a separate, more targeted injection grammar (like Angular's separate `expression.ng` grammar).

## Revised Grammar Files

### `package.json` (contributes.grammars section)

```json
"grammars": [
  {
    "scopeName": "source.sui.template",
    "path": "./sui.tmlanguage.json",
    "injectTo": ["text.html.derivative"]
  }
]
```

### `sui.tmlanguage.json` (key structural changes)

```json
{
  "scopeName": "source.sui.template",
  "injectionSelector": "L:text.html -comment -source.css -source.js",
  "patterns": [
    { "include": "#control-structures" },
    { "include": "#sui-expressions" }
  ],
  "repository": {
    "sui-expressions": {
      "patterns": [
        {
          "name": "meta.embedded.expression.sui",
          "begin": "\\{(?!\\{)",
          "beginCaptures": {
            "0": { "name": "punctuation.definition.block.begin.sui" }
          },
          "end": "\\}(?!\\})",
          "endCaptures": {
            "0": { "name": "punctuation.definition.block.end.sui" }
          },
          "patterns": [
            { "include": "#expression-content" }
          ]
        }
      ]
    }
  }
}
```

Note: The `event-attributes` pattern (`@click=`) should be moved to a separate injection grammar that targets `meta.tag` scope specifically, since event attributes only appear inside HTML tags.

## Verification Steps

After applying changes:

1. **Rebuild the .vsix** and reinstall in VS Code
2. Open an `.html` file containing SUI expressions like `{#if condition}...{/if}` and `{name}`
3. Use **Developer: Inspect Editor Tokens and Scopes** (Ctrl+Shift+P) to verify:
   - Place cursor on `{` -- should show `punctuation.definition.block.begin.sui`
   - Place cursor on `#if` -- should show `keyword.control.sui`
   - Place cursor on a variable name -- should show `variable.other.readwrite.sui`
4. If no scopes appear from the injection, check **Developer: Toggle Developer Tools** console for grammar errors
5. Verify that `<style>` and `<script>` blocks are NOT affected by the injection

## Summary

The three problems are:
1. **`text.html.basic` in `injectTo`** -- dead target, only `text.html.derivative` is bound to `html` files
2. **`injectionSelector` not excluding embedded languages** -- causes conflicts with CSS/JS in `<style>`/`<script>` tags
3. **Non-standard scope names** -- themes don't colorize `meta.template.expression.sui` or other custom deep scope names; use standard TextMate conventions that existing themes already target

The Angular extension proves that injection of `{{ }}` into HTML works. Follow their pattern: target `text.html.derivative`, use `L:text.html -comment` as the injection selector, and use standard scope names.

---
title: API Reference Authoring Guide
description: Guide for creating API reference pages with consistent header hierarchy, method signatures, parameter tables, and usage patterns across all packages.
keywords: [API reference, documentation, header hierarchy, method signatures, parameters, code examples]
audience: contributing
skill: docs-page-api-reference
---

# API Reference Authoring Guide

> **Skill:** `sui:docs-page-api-reference`
> **Purpose:** Guide for creating API reference pages with consistent header hierarchy, method signatures, parameter tables, and usage patterns

---

## Overview

API reference pages document the technical interface of Semantic UI packages. They focus on **what** functions/methods do and **how** to call them, not conceptual explanations of **why** or **when** to use them (that belongs in guides).

### API Packages

This guide applies to all API documentation across packages:

| Package | Path | Notes |
|---------|------|-------|
| Components | `docs/src/pages/docs/api/component/` | Component definition, utilities, base class |
| Template Helpers | `docs/src/pages/docs/api/helpers/` | Built-in template helpers (arrays, comparison, CSS, etc.) |
| Reactivity | `docs/src/pages/docs/api/reactivity/` | Signal, Reaction, Scheduler, Dependency, reactive helpers |
| Query | `docs/src/pages/docs/api/query/` | DOM manipulation library, chainable methods |
| Utils | `docs/src/pages/docs/api/utils/` | Standalone utility functions |
| Template Compiler | `docs/src/pages/docs/api/templating/` | Template compiler, AST, String Scanner |
| Renderer | `docs/src/pages/docs/api/renderer/` | Lit Renderer, Lit Directives |

Each package may have conventions specific to its domain (e.g., Query methods are chainable, Utils functions are standalone), but the header hierarchy and documentation structure remain consistent.

### Key Principles

1. **Precision over explanation** - Exact signatures, types, and return values
2. **Scannable structure** - Consistent patterns readers can skim
3. **Code-forward** - More examples, fewer words
4. **Cross-reference guides** - Link to conceptual docs, don't duplicate them

---

## Page Structure

### Frontmatter

```yaml
---
layout: '@layouts/Guide.astro'
pageType: 'API Reference'
title: Package - Topic        # e.g., "Query - Dimensions", "Query - Content"
icon: icon-name               # Lucide icon name
description: API reference for [specific functionality]
---
```

### Import Statement

```javascript
import PlaygroundExample from '@components/PlaygroundExample/PlaygroundExample.astro';
```

### Opening Line

One sentence describing the scope of this API page. No marketing language.

```markdown
Get and set form values, text content, and HTML content.
```

---

## Header Hierarchy (Critical)

API docs use a **strict header hierarchy** that generates consistent in-page navigation:

```
## Grouping               ← H2: Grouping header (main nav item)
### methodName            ← H3: Method names (nested under group)
#### Parameters           ← H4: Section types
#### Returns
#### Usage
#### Example
##### Get                 ← H5: Sub-sections (usage variants, options tables)
```

**Rules:**
- **H2 for grouping headers** - Group related methods (e.g., "Text Content", "HTML Content", "Slots")
- **H3 for method/function names** - These appear nested in nav under their group
- **H4 for standard sections** - Parameters, Returns, Usage, Example
- **H5 for sub-sections** - Usage variants (Get/Set, Standard/Shadow DOM), options tables
- **Never use H1** - Reserved for page title
- **Never skip levels** - No H3 → H5 without H4

**Standard H4 Sections (in order):**
1. `#### Parameters` - if method takes arguments
2. `#### Returns` - always present
3. `#### Usage` - copy-pasteable code snippets with H5 subheaders
4. `#### Example` - PlaygroundExample only (never inline code)

---

## Method/Function Documentation Pattern

Each method follows this consistent structure:

### 1. Grouping Header (H2)

Group related methods under a parent header:

```markdown
## Text Content
```

Common groupings: `Form Values`, `Text Content`, `HTML Content`, `Slots`, `HTML Attributes`, `Data Attributes`

### 2. Method Name (H3)

```markdown
### text
```

### 3. Function Signature

Immediately after the method name, show the signature as a code block. **Always include semicolons.**

```markdown
### text

\`\`\`javascript
$('selector').text();
$('selector').text(content);
\`\`\`
```

### 4. Brief Description

One sentence explaining what it does. Integrate comparisons naturally rather than using callout blocks.

```markdown
Gets or sets the text content of elements.
```

```markdown
Gets the text content of immediate text node children only. Use `text()` when you need all nested text content recursively.
```

### 5. Parameters Section (H4)

```markdown
#### Parameters

| Name    | Type   | Description           |
|---------|--------|-----------------------|
| content | string | The text to set       |
```

### 6. Options Section (H5, when needed)

When parameters include an options object, document under Parameters:

```markdown
#### Parameters

| Name    | Type   | Description              |
|---------|--------|--------------------------|
| options | object | Optional configuration   |

##### Options

| Name          | Type    | Default | Description                    |
|---------------|---------|---------|--------------------------------|
| separator     | string  | ', '    | The separator between words    |
```

### 7. Returns Section (H4)

For getter/setter methods, use bullet points:

```markdown
#### Returns

- **Getting**: Combined text content of all matched elements
- **Setting**: [Query object](/docs/api/query/constructor#the-query-object) (for chaining)
```

### 8. Usage Section (H4)

Copy-pasteable code snippets. **Use H5 subheaders to separate variants** - never use comments in a single code block.

```markdown
#### Usage

##### Get

\`\`\`javascript
const buttonText = $('button').text();
\`\`\`

##### Set

\`\`\`javascript
$('button').text('Click me!');
\`\`\`
```

For HTML context, use a separate block with title:

```markdown
#### Usage

\`\`\`html title="page.html"
<p>Hello <span>world</span></p>
\`\`\`

\`\`\`javascript
$('p').text();     // "Hello world"
$('p').textNode(); // "Hello "
\`\`\`
```

### 9. Example Section (H4)

**PlaygroundExample only.** Never duplicate with inline code - Usage already provides copy-pasteable snippets.

```markdown
#### Example

<PlaygroundExample id="query-text" direction="horizontal"></PlaygroundExample>
```

---

## Usage Section Patterns

### Getter/Setter Methods

```markdown
#### Usage

##### Get

\`\`\`javascript
const value = $('input').val();
\`\`\`

##### Set

\`\`\`javascript
$('input').val('New value');
\`\`\`
```

### Standard vs Shadow DOM

```markdown
#### Usage

##### Standard

\`\`\`javascript
$('div').find('p').addClass('highlight');
\`\`\`

##### Shadow DOM

\`\`\`javascript
$$('my-component').find('p').addClass('highlight');
\`\`\`
```

### Multiple Variants

```markdown
#### Usage

##### Default Slot

\`\`\`javascript
$(myComponent).getSlot();
\`\`\`

##### Named Slot

\`\`\`javascript
$(myComponent).getSlot('header');
\`\`\`

##### From Slot Element

\`\`\`javascript
$$(myComponent).find('slot[name="header"]').getSlot();
\`\`\`
```

---

## Notes and Callouts

Use sparingly. Prefer integrating information into the description sentence.

### When to Use Callouts

- Performance warnings
- Security considerations
- Common mistakes to avoid

### Format

```markdown
> **Boolean Attributes** Use this for boolean attributes where `checked="false"` would still be truthy.
```

### When NOT to Use Callouts

- Method comparisons (integrate into description instead)
- Basic usage tips (put in Usage section)
- Aliases (mention in description: "Also available as `value()`")

---

## Canonical Reference Docs

Read these before writing API docs to understand the format:

| Doc | Path | Demonstrates |
|-----|------|--------------|
| Query - Content | `docs/src/pages/docs/api/query/content.mdx` | Complete pattern with Usage H5 subheaders |
| Query - Attributes | `docs/src/pages/docs/api/query/attributes.mdx` | Groupings, PlaygroundExample only in Example |
| Query - Dimensions | `docs/src/pages/docs/api/query/dimensions.mdx` | Clean H2/H3/H4 hierarchy |

---

## Writing Standards

### Conciseness

- No "This method allows you to..." - just say what it does
- No "You can use this to..." - the usage examples show that
- Remove hedging words: "various", "specific", "certain"
- Load `sui:docs-slop-identification` for anti-patterns

### Code Style

- **Always include semicolons** in signature blocks and examples
- **Separate code blocks** with H5 subheaders, never comments in one block
- **HTML context** goes in separate `html title="page.html"` block

### Technical Accuracy

- Verify all type signatures against source code
- Test code examples mentally or actually run them
- Cross-reference with existing tests for edge case behavior

### Cross-References

- Link to related guide pages for conceptual context
- Link to other API methods when referencing them
- Use format: `[Query object](/docs/api/query/constructor#the-query-object)`

Load `sui:docs-good-writing` for writing pattern reference.

---

## Quality Checklist

Before completing an API doc page:

- [ ] Title follows `Package - Topic` format (e.g., "Query - Content")
- [ ] Header hierarchy is correct (H2=groupings, H3=methods, H4=sections, H5=variants)
- [ ] All signature code blocks have semicolons
- [ ] Parameter tables include types and descriptions
- [ ] Usage section has H5 subheaders for variants (not comments in one block)
- [ ] Example section has PlaygroundExample only (no inline code duplication)
- [ ] Code examples are syntactically correct
- [ ] No marketing language or unnecessary adjectives
- [ ] Cross-references to guides where conceptual context is needed

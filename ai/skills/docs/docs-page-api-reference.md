---
title: API Reference Authoring Guide
description: How to write API reference pages with consistent structure — header hierarchy that drives navigation, method signatures, parameter tables, and usage patterns. Load when creating or editing pages in docs/src/pages/docs/api/.
keywords: [API reference, documentation, header hierarchy, method signatures, parameters, code examples]
audience: docs
skill: docs-page-api-reference
type: skill
---

# API Reference Authoring Guide

> **Skill:** `docs-page-api-reference`
> **Purpose:** How to write API reference pages with consistent header hierarchy, method signatures, parameter tables, and usage patterns

**Golden rule: precision over explanation.** API docs answer "what is the exact signature, what are the types, what does it return." Conceptual explanations belong in guides — link to them, don't duplicate them.

---

## Overview

API reference pages document the technical interface of Semantic UI packages.

| Package | Path |
|---------|------|
| Components | `docs/src/pages/docs/api/component/` |
| Template Helpers | `docs/src/pages/docs/api/helpers/` |
| Reactivity | `docs/src/pages/docs/api/reactivity/` |
| Query | `docs/src/pages/docs/api/query/` |
| Utils | `docs/src/pages/docs/api/utils/` |
| Template Compiler | `docs/src/pages/docs/api/templating/` |
| Renderer | `docs/src/pages/docs/api/renderer/` |
| Specs | `docs/src/pages/docs/api/specs/` |

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

One sentence describing the scope. No marketing language.

```markdown
Get and set form values, text content, and HTML content.
```

---

## Header Hierarchy

The navigation system (`/docs/src/helpers/navigation.js`) auto-generates in-page menus from headings. This makes header levels a mechanical API, not just visual organization — the wrong level means a method appears in the wrong place in the nav (or doesn't appear at all).

```
## Grouping               ← H2: Main nav item (e.g., "Text Content")
### methodName            ← H3: Nested under group in nav
#### Parameters           ← H4: Not in nav — internal method sections
#### Returns
#### Usage
#### Example
##### Get                 ← H5: Not in nav — usage variants
```

**Why this specific hierarchy:**
- **H2 groups related methods** so the nav doesn't list 30 flat method names. Without grouping, readers can't find anything.
- **H3 for method names** because they nest under H2 groups in the nav tree. If you use H2 for a method name, it becomes a top-level nav item with no group context.
- **H4 for Parameters/Returns/Usage/Example** because these shouldn't appear in nav — they're internal structure of each method's documentation.
- **H5 for usage variants** (Get/Set, Standard/Shadow DOM) to separate code blocks without polluting the nav.
- **H1 is reserved** for the page title (rendered from frontmatter). Using H1 in content creates a second page title.
- **Don't skip levels** (e.g., H3 → H5) because it breaks the nav tree's parent-child relationships and produces inconsistent indentation.

**Standard H4 sections, in order:**
1. `#### Parameters` — if method takes arguments
2. `#### Returns` — always present
3. `#### Usage` — copy-pasteable code snippets, with H5 subheaders for variants
4. `#### Example` — PlaygroundExample only

---

## Method Documentation Pattern

### 1. Grouping Header (H2)

```markdown
## Text Content
```

Common groupings: `Form Values`, `Text Content`, `HTML Content`, `Slots`, `HTML Attributes`, `Data Attributes`

### 2. Method Name + Signature (H3)

Immediately after the method name, show the signature as a code block with semicolons. Semicolons are the project-wide convention enforced by the formatter — omitting them in docs creates a visual mismatch with the source code readers will encounter.

```markdown
### text

\`\`\`javascript
$('selector').text();
$('selector').text(content);
\`\`\`
```

### 3. Brief Description

One sentence. Integrate comparisons into the description rather than using callout blocks — callouts break the scannable rhythm.

```markdown
Gets or sets the text content of elements.
```

```markdown
Gets the text content of immediate text node children only. Use `text()` when you need all nested text content recursively.
```

### 4. Parameters (H4)

```markdown
#### Parameters

| Name    | Type   | Description           |
|---------|--------|-----------------------|
| content | string | The text to set       |
```

When parameters include an options object:

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

### 5. Returns (H4)

For getter/setter methods, use bullet points:

```markdown
#### Returns

- **Getting**: Combined text content of all matched elements
- **Setting**: [Query object](/docs/api/query/constructor#the-query-object) (for chaining)
```

### 6. Usage (H4)

Use H5 subheaders to separate variants. Putting multiple variants in one code block separated by comments makes them harder to scan and impossible to copy individually.

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

For HTML context, use a separate block:

```markdown
\`\`\`html title="page.html"
<p>Hello <span>world</span></p>
\`\`\`

\`\`\`javascript
$('p').text();     // "Hello world"
$('p').textNode(); // "Hello "
\`\`\`
```

### 7. Example (H4)

PlaygroundExample only. The Usage section already has copy-pasteable code — the Example section adds interactivity, not more code.

```markdown
#### Example

<PlaygroundExample id="query-text" direction="horizontal"></PlaygroundExample>
```

---

## Callouts

Use sparingly. Prefer integrating information into the description sentence.

**Use callouts for:** Performance warnings, security considerations, common mistakes that cause silent bugs.

**Don't use callouts for:** Method comparisons (integrate into description), basic usage tips (put in Usage section), aliases (mention in description: "Also available as `value()`").

```markdown
> **Boolean Attributes** Use this for boolean attributes where `checked="false"` would still be truthy.
```

---

## Canonical References

Read one of these before writing your first API doc page to internalize the format:

| Doc | Path | Demonstrates |
|-----|------|--------------|
| Query - Content | `docs/src/pages/docs/api/query/content.mdx` | Complete pattern with Usage H5 subheaders |
| Query - Attributes | `docs/src/pages/docs/api/query/attributes.mdx` | Groupings, PlaygroundExample only in Example |
| Query - Dimensions | `docs/src/pages/docs/api/query/dimensions.mdx` | Clean H2/H3/H4 hierarchy |

---

## Quick Reference

```
Frontmatter:   layout: '@layouts/Guide.astro', pageType: 'API Reference'
Title format:  Package - Topic (e.g., "Query - Content")
Opening:       One sentence, no marketing

Header levels:
  H2  → Method group (nav item)
  H3  → Method name (nested in nav)
  H4  → Parameters | Returns | Usage | Example (not in nav)
  H5  → Usage variants: Get/Set, Standard/Shadow DOM (not in nav)

Each method:
  H3 name → signature block → one-sentence description →
  Parameters table → Returns → Usage with H5 variants →
  PlaygroundExample

Code style:    Semicolons in all code blocks
Usage blocks:  H5 subheaders for variants, not comments
Example:       PlaygroundExample only, no inline code
```

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Authoring Standards** | `use_skill: docs-authoring-standards` | Heading hierarchy, frontmatter, code blocks |
| **Writing Docs** | `use_skill: docs-writing` | Prose quality, anti-patterns |
| **Guide Pages** | `use_skill: docs-page-guide` | Conceptual docs — where explanations belong |
| **Doc Paths** | `use_skill: docs-paths` | Deriving URLs and anchor links for cross-references |

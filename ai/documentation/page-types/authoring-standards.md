# Documentation Authoring Standards

> Last Updated: 2026-01-07

**For:** AI agents creating any prose page in Semantic UI documentation
**Scope:** Structural requirements that apply to ALL page types (gateway, guide, API reference)
**Related:** [Guide Writing](./guide.md) • [Gateway Writing](./gateway.md) • [API Reference](./api-reference.md)

---

## Heading Hierarchy

The navigation system (`/docs/src/helpers/navigation.js`) auto-generates in-page menus from headings.

### Required Structure

| Level | Usage | Navigation |
|-------|-------|------------|
| `##` | Main sections | Top-level menu items |
| `###` | Subsections | Nested menu items |
| `#` | **Never use** | Reserved for page title |
| `####` | **Avoid** | Not used in navigation |

### Example

```markdown
---
title: Feature Name
---

## Main Concept
### Basic Usage
### Advanced Features

## Examples
### Simple Example
### Advanced Example
```

---

## Frontmatter

All documentation pages require frontmatter with layout and metadata.

### Guide Pages

```yaml
---
layout: '@layouts/Guide.astro'
title: Descriptive Title
description: Brief feature description
icon: cpu  # optional, for navigation
---
```

### API Reference Pages

```yaml
---
layout: '@layouts/Guide.astro'
pageType: 'API Reference'
title: ClassName or methodName
description: API reference for X in Semantic UI
icon: box
---
```

---

## Imports

Place imports immediately after frontmatter, before any content.

```markdown
---
layout: '@layouts/Guide.astro'
title: Feature Name
---
import PlaygroundExample from '@components/PlaygroundExample/PlaygroundExample.astro';

## First Section
```

---

## Embedding Examples

### PlaygroundExample Component

Embed interactive examples using the `PlaygroundExample` component:

```markdown
<PlaygroundExample id="example-id" direction="horizontal"></PlaygroundExample>
```

**Parameters:**
- `id` — matches folder name in `/docs/src/examples/`
- `direction` — `horizontal` (side-by-side) or `vertical` (stacked)

### Placement Strategy

```markdown
## Basic Usage

Syntax explanation and simple code.

### Simple Example

<PlaygroundExample id="feature-basic" direction="horizontal"></PlaygroundExample>

## Advanced Features

More complex syntax and patterns.

### Advanced Example

<PlaygroundExample id="feature-advanced" direction="horizontal"></PlaygroundExample>
```

### Requirements

- **Must exist**: Example must be created in `/docs/src/examples/` first
- **Must work**: No broken or non-functional examples
- **Contextual intro**: Brief explanation of what the example demonstrates

---

## Internal Links

### Link Format

```markdown
See the [Signals guide](/docs/guides/reactivity/signals) for details.
```

### When to Link

- First mention of a documented concept
- Cross-references to related features
- API method references

### When Not to Link

- Every mention of the same term
- Generic programming concepts
- External libraries (use external links)

---

## Code Blocks

### Language Tags

```markdown
```javascript
// JavaScript code
```

```sui
{#each items}
  <!-- Template syntax -->
{/each}
```

```css
.component { }
```

```bash
npm install @semantic-ui/component
```
```

### Inline Code

Use backticks for:
- Method names: `signal.get()`
- Property names: `defaultState`
- File names: `component.js`
- Tag names: `<ui-button>`

---

## Callouts

Use blockquotes for tips, warnings, and cross-references:

```markdown
> **Note:** Important information about this feature.

> See the [Reactivity Guide](/docs/guides/reactivity) for more details.
```

---

## File Locations

| Content Type | Location |
|--------------|----------|
| Guide pages | `/docs/src/pages/docs/guides/` |
| API reference | `/docs/src/pages/docs/api/` |
| Examples | `/docs/src/examples/` |
| Example metadata | `/docs/src/content/examples/` |
| Learn lessons | `/docs/src/content/lessons/` |

---

## Checklist

Before submitting any documentation page:

- [ ] Frontmatter includes layout, title, description
- [ ] Heading hierarchy uses only `##` and `###`
- [ ] Imports placed after frontmatter
- [ ] All PlaygroundExample components reference existing examples
- [ ] Internal links use correct paths
- [ ] Code blocks have language tags

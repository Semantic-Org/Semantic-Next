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

### In-Page Menu

Headers auto-generate a fixed navigation menu on the right side of the page. Readers use this to scan and jump to content quickly.

**Design for scanning:**
- Headers are keywords, not sentences
- Keep H2s under 25 characters, H3s under 30
- Plan the hierarchy before writing

**Maintain rhythm:**
- Flat structures (`## A`, `## B`, `## C`) are valid when sections are short or parallel
- Nested structures help when sections are long or have distinct sub-topics
- Many consecutive flat H2s can feel like a list rather than a document
- If most sections have sub-items, an orphaned section without any stands out awkwardly
- Be flexible but intentional about depth choices

**Bad:** Long headers, unbalanced depth
```
## The Web Component Problem
### What This Solves
### Framework Compatibility
## Defining Components
## Templating Without String Manipulation
## Styling That Actually Scopes
## Events Without Boilerplate
```

**Good:** Scannable keywords, consistent rhythm
```
## Sources of Reactivity
### Reactive Data
### Non-Reactive Data
## Component Reactivity
### State Reactivity
### Settings Reactivity
## Advanced Use
### Exposing Reactivity
### Reducing Reactivity
```

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

## Writing Quality

Avoid common AI writing patterns that reduce clarity. See [Slop Identification Guide](./quality/slop-identification.md) for comprehensive patterns.

### Quick Reference

| Pattern | Example | Fix |
|---------|---------|-----|
| Marketing adjectives | "powerful", "flexible", "robust", "seamless" | Delete |
| Hedging words | "various", "specific", "certain", "particular" | Delete or be specific |
| Em dash overuse | "feature—which is important—lets you" | Use commas or separate sentences |
| "Note that..." | "Note that the compiler..." | "The compiler..." |
| Verbose intros | "In this section, we will explore..." | Delete, start with content |
| Concluding summaries | Paragraphs restating obvious benefits | Delete entirely |

### Principles

- **Delete over rewrite**: Removing 3 problems beats rewriting and adding 2 new ones
- **Let features speak**: Don't tell readers something is powerful, show what it does
- **1-2 sentence paragraphs**: Dense prose loses readers
- **Code after brief explanation**: Don't over-explain before showing

---

## Checklist

Before submitting any documentation page:

- [ ] Frontmatter includes layout, title, description
- [ ] Heading hierarchy uses only `##` and `###`
- [ ] Imports placed after frontmatter
- [ ] All PlaygroundExample components reference existing examples
- [ ] Internal links use correct paths
- [ ] Code blocks have language tags

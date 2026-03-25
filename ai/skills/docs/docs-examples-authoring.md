---
title: Examples System Guide
description: How to create documentation examples for Semantic UI — example types, metadata schema, file organization, and the playground system. Load when creating or editing examples in docs/src/examples/.
keywords: [examples, metadata, playground, design tokens, component examples, code patterns, validation]
audience: docs
skill: docs-examples-authoring
type: skill
---

# Semantic UI Examples System Guide

> **Skill:** `docs-examples-authoring`
> **Purpose:** How to create documentation examples — types, metadata, file organization, and the playground system

**Golden rule: would this example feel at home in official React, Vue, or Svelte docs?** If it needs a paragraph to explain the interaction, the interaction is wrong. If the code has helper functions and reset logic, it's too complex. The example IS the explanation.

---

## Philosophy

### The Four Pillars

1. **Immediately obvious interaction** — User knows what to do without reading instructions
2. **Code like a koan** — Minimal lines, the essence of the concept, nothing extra
3. **Sharp but minimal design** — Clean visuals that serve the teaching, not impress
4. **Aha moment front and center** — The key insight is the entire example

| Quality | Bad | Good |
|---------|-----|------|
| Interaction | "Click 'Iterate Items' to see each() in action" | Button labeled "Next" that obviously advances |
| Code | 37 lines with helper functions and reset logic | 7 lines showing the one thing |
| Design | Multiple colored borders, animations, transforms | Border, background change on state |
| Teaching | Shows 3 variations of similar thing | Shows the one essential thing clearly |

### Anti-Patterns

```html
<!-- ❌ Redundant description paragraph -->
<p>This example demonstrates how to use .filter() to filter elements</p>

<!-- ❌ Raw <button> elements (breaks dark mode, not dogfooding) -->
<button class="submit">Click</button>

<!-- ✅ Just the example content, use ui-button -->
<ui-button class="submit">Click</ui-button>
```

### Real Patterns Over Demos

Show things developers actually build:
- ✅ Wizard stepper, ping/pong communication, nested box highlighting
- ❌ Abstract "Item A, Item B, Item C" with "Process Items" button

---

## Example Types

`exampleType` controls **playground injection behavior**, not file structure.

| Type | Injections | Primary file | Use case |
|---|---|---|---|
| `component` | SUI core (`semantic-ui.js` + `.css`), error interceptor, auto-generated `page.html` wrapper | `component.js` | Any example needing SUI framework context |
| `log` | Console interceptor (`log.js/css`), error interceptor, basic SUI | `index.js` | Pure package API demos, utility functions |
| `page` | **None** — requires manual `<html>`, `<head>`, `<body>` | `page.html` | CDN usage, external integrations only |
| `folder` | Same as `component` | All files equally | Multi-component systems |

**Script load order** (component type): `page.css` → error interceptor → `component.js` → `page.js`

**Auto-generated `page.html`**: If you don't provide one, the system generates a wrapper containing your component's tag. Provide a custom `page.html` when you need attributes, slot content, or multiple instances.

### Decision Guide

```
Interactive UI component?
├── Multi-component system → folder
└── Standard component → component

Package API demo?
└── Reactivity/Utils/Query → log

Standalone page / CDN demo?
└── page (manual setup, no injections)
```

---

## Metadata Schema

The authoritative schema is in `docs/src/content/config.js`. Metadata files live in `/docs/src/content/examples/` (flat — no nesting).

### Required Fields

```yaml
---
title: 'Query .focus()'           # Display name
exampleType: 'component'          # component | log | page | folder
subcategory: 'DOM Manipulation'   # Must exist in menus.js subCategorySortOrder
description: 'Sets keyboard focus on elements'  # Completes the title — see copywriting rules below
tags: ['query', 'focus', 'dom']   # Search/filtering
---
```

### Optional Fields

```yaml
id: 'query-focus'                 # Override auto-generated ID (from tokenized title)
category: 'Query'                 # Top-level grouping
shortTitle: 'focus()'             # Compact menu name
hidden: true                      # Hide from navigation
selectedFile: 'component.html'    # Default active tab (defaults to component.js)
fold: false                       # Code folding behavior
tip: 'Unlike blur(), focus can bubble with focusin'  # Non-obvious insight
additionalPageFiles: ['demo.js']  # Extra files grouped with page files
```

### ID Resolution

1. If `id` field exists → use that value
2. Otherwise → auto-generated from `title` (tokenized: spaces → hyphens, lowercase)

The resolved ID **must match the example's folder name exactly**. Routing breaks silently if they don't match.

### Metadata Copywriting

**Descriptions** complete the title — they don't repeat it:
```yaml
# ✅ Completes the thought
title: 'Query .focus()'
description: 'Sets keyboard focus on elements'

# ❌ Redundant
title: 'Query .focus()'
description: 'Demonstrates using .focus() to focus elements'
```

**Tips** add non-obvious framework-specific insight, or are omitted entirely:
```yaml
# ✅ Non-obvious detail
tip: 'Unlike remove(), detached elements can be reattached with events intact'

# ❌ States the obvious
tip: 'Use addClass() to add CSS classes to elements'
```

Verify framework-specific claims in source code (`/packages/{package}/src/`) before writing tips.

---

## File Organization

### Two Required Locations

Every example needs files in **two places**:

```
/docs/src/examples/{category}/{subcategory}/{example-id}/   ← code files
/docs/src/content/examples/{example-id}.mdx                 ← metadata (flat)
```

Both are required. The example won't render without both.

### File Discovery

The playground uses regex to find examples at any nesting depth:

```javascript
// From playground.js
let deepPath = `${basePath}.*/${contentID}/${subFolder}`;
let shallowPath = `${basePath}${contentID}/${subFolder}`;
```

This means folder organization is flexible — the system matches on the **final folder name** matching the ID. Organize logically:

```
docs/src/examples/
├── component/loader/           → ID: 'loader'
├── utils/strings/utils-capitalize/  → ID: 'utils-capitalize'
├── query/visibility/query-is-in-view/  → ID: 'query-is-in-view'
└── reactivity/introduction/signals/  → ID: 'signals'
```

### File Patterns by Type

**Component examples:**
```
component.js       # Component definition (required)
component.html     # Template
component.css      # Styles
page.html          # Demo page (auto-generated if missing)
page.css           # Demo styling
page.js            # Demo interactions
```

**Log examples:**
```
index.js           # Complete demonstration code
```

**Subcomponents** use short names since they appear in REPL tabs: `row.js`, `row.html` — not `todo-item-row.js`.

### Playground Layout

- **Left panel**: Component files (`component.js/html/css`, `index.js`) — expand to fill
- **Right panel**: Page files (`page.html/css/js`) — smaller sizing

---

## CSS and HTML Rules

These are SUI-specific conventions that differ from standard web development:

**Spaced class names, not hyphenated:**
```html
<!-- ✅ --> <div class="inner scroll">
<!-- ❌ --> <div class="inner-scroll">
```

Shadow DOM scoping means class names don't need BEM-style prefixes. Use simple names: `.card`, `.header`, `.content`.

**CSS nesting with design tokens:**
```css
.container {
  border: var(--border);
  border-radius: var(--border-radius);
  padding: var(--padding);

  .header {
    color: var(--header-color);
    font-weight: var(--bold);
  }

  &.active {
    background: var(--primary-background-color);
  }
}
```

No hardcoded colors, spacing, or effects. Load the `tokens` skill for the complete token reference.

**Query variables prefixed with `$`:**
```javascript
const $button = $('.submit');
const $container = $('.container');
```

**Use `<ui-button>` in page files** — not raw `<button>`. Dogfooding the framework and ensuring dark mode compatibility.

---

## Creating an Example

1. **Read 1-3 existing examples** with the highest similarity to what you're creating. These are the canonical patterns — match their style.
2. **Create the folder** at `/docs/src/examples/{logical-path}/{example-id}/`
3. **Create the metadata** at `/docs/src/content/examples/{example-id}.mdx`
4. **Verify the ID** matches the folder name exactly
5. **Verify the subcategory** exists in `docs/src/helpers/menus.js` (`subCategorySortOrder`)
6. **Test** that the example loads at `https://dev.semantic-ui.com/examples/{id}`

Load the `docs-examples-debugging` skill if you need to debug a broken example with Chrome DevTools MCP.

---

## Quick Reference

```
Two locations required:
  Code:     docs/src/examples/{category}/{subcategory}/{id}/
  Metadata: docs/src/content/examples/{id}.mdx

ID must match folder name exactly.

Types:  component (SUI injected) | log (console) | page (bare) | folder (multi-component)
Load order: page.css → error.js → component.js → page.js

CSS: design tokens only, CSS nesting, spaced class names (not hyphenated)
JS:  $-prefixed query vars, <ui-button> in page files
```

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Design Tokens** | `use_skill: tokens` | Looking up available CSS tokens |
| **Debugging Examples** | `use_skill: docs-examples-debugging` | Example isn't rendering or behaving correctly |
| **Authoring Standards** | `use_skill: docs-authoring-standards` | Embedding examples in doc pages with PlaygroundExample |
| **Doc Paths** | `use_skill: docs-paths` | Deriving the URL for an example |

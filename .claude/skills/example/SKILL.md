---
name: example
description: Create interactive playground examples. Use when creating examples in docs/src/examples/, writing component demos, or adding PlaygroundExample content for API docs.
---

# Example Authoring Skill

## The Four Pillars (Memorize These)

1. **Immediately obvious interaction** - User knows what to do without instructions
2. **Code like a koan** - Minimal lines, essence of concept, nothing extra
3. **Sharp but minimal design** - Clean visuals that serve teaching, not impress
4. **Aha moment front and center** - The key insight IS the example

## Critical Rules

- **NO redundant `<p>` descriptions** - Metadata shows in page chrome already
- **Use `<ui-button>` not `<button>`** - Dogfood the framework, dark mode works
- **Real patterns** - Wizard steppers, not "Item A, Item B, Item C"
- **Parallel structure** - Related methods (closest/closestAll) use identical HTML/CSS

## Required Context

Read before creating examples:

1. `ai/documentation/example/example-authoring.md` - Start with "Example Philosophy" section
2. `ai/documentation/example/example-self-critique.md` - Quality checklist
3. `ai/guides/css/tokens/token-usage.md` - Design tokens for CSS

## Output Locations

- Code files: `docs/src/examples/{category}/{subcategory}/{example-id}/`
- Metadata: `docs/src/content/examples/{example-id}.mdx`

## Good Example Anatomy

```html
<!-- HTML: Just the content, no description paragraph -->
<div class="box">Content</div>
<br>
<ui-button class="action">Do Thing</ui-button>
<p>Result: <span class="output">0</span></p>
```

```javascript
// JS: The koan - minimal, obvious
import { $ } from '@semantic-ui/query';

$('.action').on('click', () => {
  const result = $('.box').someMethod();
  $('.output').text(result);
});
```

```css
/* CSS: Design tokens, nesting, minimal */
.box {
  padding: var(--16px);
  border: var(--border);
  border-radius: var(--border-radius);

  &.active {
    background: var(--green-background);
  }
}
```

# Use Semantic UI Components

> Skill for using Semantic UI's official web components to build websites.

---

## When This Skill Loads

Before generating code, gather context:

1. **Detect codebase first**:
   - If **SUI source repo** (packages/, docs/, specs in this repo): assume Query and SUI style guide — skip preference questions below
   - If **React/Vue/Angular/Svelte** project: note that `/sui:integrate` provides framework-specific patterns

2. **Check MCP availability** — If Semantic UI MCP tools are available (`list_components`, `get_component`), use them for live spec access. If not, recommend the user install the Semantic UI MCP plugin.

3. **Ask CSS preference** (unless SUI repo) — "SUI style guide, your own CSS, or Tailwind?" For deep customization, see `/sui:style`.

4. **Ask Query preference** (unless SUI repo) — "Use SUI's Query library (`$`, `$$`) or vanilla JS?"
   - **Query**: jQuery-like syntax, shadow DOM piercing with `$$`, convenient `.settings()` and `.component()` methods
   - **Vanilla JS**: Standard DOM APIs, no extra dependency
   - Use the chosen approach in all code examples

**Scope**: This skill covers using SUI's shipped components. For CSS customization see `/sui:style`. For framework integration and SSR see `/sui:integrate`.

---

## Specs Are the Source of Truth

Every SUI component is defined by a JSON spec. The spec is the authoritative API reference.

**Access specs via MCP:**
- `list_components` — see all available components
- `get_component` — get full spec for a component
- `search` — find components by keyword

**Spec fields:**

| Field | Meaning |
|-------|---------|
| `tagName` | Exact element name — use as-is, never infer |
| `content` | Content areas (supports attribute, class, and slot syntax) |
| `types` | Mutually exclusive behavioral variants — pick one |
| `states` | Runtime states: `disabled`, `loading`, `active`, etc. |
| `variations` | Visual options — combine freely |
| `settings` | Configurable properties with types and defaults |
| `events` | Custom events the component emits |
| `methods` | Methods available on the component instance |

**Golden rule: If it's not in the spec, don't use it.**

### Plural Container Inheritance

Plural containers (`<ui-buttons>`, `<ui-cards>`) cascade variations to children — but only those defined in the spec:

```html
<ui-buttons size="small" color="blue">
  <ui-button>One</ui-button>  <!-- inherits small, blue -->
  <ui-button>Two</ui-button>  <!-- inherits small, blue -->
</ui-buttons>
```

Check these spec fields for plural behavior:

| Field | Meaning |
|-------|---------|
| `pluralTagName` | Container element name |
| `pluralSharedVariations` | Variations that cascade to children |
| `pluralOnlyVariations` | Variations only valid on container (e.g., `equal-width`, `stackable`) |

```html
<!-- equal-width is plural-only — doesn't exist on individual buttons -->
<ui-buttons equal-width="three">
  <ui-button>One</ui-button>
  <ui-button>Two</ui-button>
  <ui-button>Three</ui-button>
</ui-buttons>
```

---

## SUI-Specific Syntax

These patterns are unique to SUI — standard HTML/web component knowledge doesn't cover them.

### Three Attribute Dialects

All equivalent ways to set variations:

```html
<ui-button size="large">   <!-- verbose: attribute="value" -->
<ui-button large>          <!-- concise: value as attribute -->
<ui-button class="large">  <!-- classic: CSS class (v2 compatibility) -->
```

### Three Content Syntaxes

For fields in the spec's `content` section:

```html
<ui-card header="Title">                     <!-- attribute: strings only -->
<ui-card><div class="header">Rich HTML</div> <!-- class: rich content -->
<ui-card><div slot="header">Rich HTML</div>  <!-- slot: web standard -->
```

Use **attribute** for simple strings, **class** or **slot** for rich HTML content.

### Value Fuzzing

SUI normalizes value formats — these are all equivalent:

```html
<ui-button icon="right arrow">   <!-- spaces -->
<ui-button icon="arrow-right">   <!-- kebab-case -->
<ui-button icon="right-arrow">   <!-- reversed kebab -->
```

### Compound Aliases

When multiple attributes share option values, disambiguate with compound form:

```html
<ui-segment size-small>    <!-- size="small" -->
<ui-segment padding-small> <!-- padding="small" -->
```

Order is flexible: `small-size` also works.

---

## Passing Functions and Complex Data

Standard attributes handle strings and numbers. For functions or complex objects:

### With Query

```js
// settings() — component already in DOM
$('ui-dropdown').settings({
  onChange: (value) => handleChange(value),
  items: [{ text: 'One', value: 1 }, { text: 'Two', value: 2 }]
});

// initialize() — before DOM insertion or batch setup
$('ui-modal').initialize({ closeable: false });

// Access component instance for methods
$('ui-modal').component().show();
```

### With Vanilla JS

```js
// Set properties directly
const dropdown = document.querySelector('ui-dropdown');
dropdown.onChange = (value) => handleChange(value);
dropdown.items = [{ text: 'One', value: 1 }, { text: 'Two', value: 2 }];

// Access component instance
const modal = document.querySelector('ui-modal');
modal.component.show();
```

Query's `.component()` method and vanilla's `.component` property access the same underlying instance.

### When to Use Each

- **Direct properties / `settings()`** — component already in page
- **`initialize()`** — setup before insertion, or batch configuration across many components
- **JSON in attributes** — `items='[{"text":"One"}]'` works but is verbose; prefer JS for complex data

---

## Standard Web Patterns

These work exactly as you'd expect — no SUI-specific knowledge needed:

**Events** — Check spec's `events` array for available events:
```js
// Query
$('ui-modal').on('show', (e) => console.log(e.detail));

// Vanilla
document.querySelector('ui-modal').addEventListener('show', (e) => {
  console.log(e.detail);
});
```

**Methods** — Check spec's `methods` array, call on component instance:
```js
$('ui-modal').component().show();
// or
document.querySelector('ui-modal').component.show();
```

**Slots** — Standard web component slots:
```html
<ui-card>
  <div slot="header">Title</div>
  <div slot="description">Content here</div>
</ui-card>
```

**Properties** — Attributes reflect as properties:
```js
element.disabled = true;
element.size = 'large';
```

**Theming** — Components auto-adapt to light/dark mode:
```html
<html light>  <!-- light theme -->
<html dark>   <!-- dark theme -->
```

---

## Quick Reference

```html
<!-- Get spec first, then use exact tagName -->
<ui-button primary large>Click</ui-button>
<ui-card header="Title" image="/photo.jpg"></ui-card>

<!-- Plural containers with inheritance -->
<ui-buttons size="small">
  <ui-button>A</ui-button>
  <ui-button>B</ui-button>
</ui-buttons>

<!-- Rich content via slots -->
<ui-card>
  <img slot="image" src="/photo.jpg" />
  <div slot="header"><strong>Bold</strong> Title</div>
</ui-card>
```

```js
// Pass complex data
$('ui-dropdown').settings({ items: [...], onChange: fn });

// Call methods
$('ui-modal').component().show();

// Listen to events
$('ui-menu').on('change', (e) => console.log(e.detail.value));
```

**Always check the spec. If it's not in the spec, don't use it.**

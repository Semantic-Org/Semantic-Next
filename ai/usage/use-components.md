---
title: Use Semantic UI Components
description: Guide for using SUI's published web components to build websites. Covers component discovery, attributes, slots, events, and responsive patterns.
keywords: [web components, custom elements, ui-button, ui-card, shadow DOM, attributes, slots, query, specs]
audience: usage
skill: use-components
---

# Use Semantic UI Components

> **Skill:** `sui:use-components`
> **Purpose:** Guide for using SUI's published web components to build websites
> **Last Updated:** 2026-03-04

---

## What Are SUI Components?

Semantic UI ships a library of **standard web components** — custom HTML elements like `<ui-button>`, `<ui-card>`, `<ui-modal>`. They use Shadow DOM for style encapsulation, are reactive to attribute changes, and auto-adapt to light/dark themes. Their API is defined by JSON specs that describe every valid attribute, content area, event, and method.

---

## When This Skill Loads

Before generating code, gather context:

1. **Detect codebase first**:
   - If **SUI source repo** (packages/, docs/, specs in this repo): assume Query and SUI style guide (nested CSS, container queries, design tokens) — skip preference questions below
   - If **React/Vue/Angular/Svelte** project: note that framework integration patterns are available

2. **Ask CSS preference** (unless SUI repo) — "SUI style guide, your own CSS, or Tailwind?" For deep customization, see `sui:style-components`.

3. **Ask Query preference** (unless SUI repo) — "Use SUI's Query library (`$`, `$$`) or vanilla JS?"
   - **Query**: jQuery-like `$`, plus `$$` which matches recursively through shadow DOM roots and slot projections
   - **Vanilla JS**: Standard DOM APIs, no extra dependency
   - Use the chosen approach in all code examples

---

## Discovering Syntax from Specs

Every SUI component is defined by a JSON spec. The spec is the authoritative API reference.

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
| `usageLevel` | Commonality (1 = common, 5 = rare/specialized) — higher levels are valid but use sparingly |

**Option values** are always the canonical verbose form (what goes after `=`). Colliding values are automatically disambiguated — see Compound Aliases.

**Option flags:**

| Flag | Meaning |
|------|---------|
| `compoundAliases` | Concise form requires `value-attribute` compound (e.g. `"very"` on compact → `very-compact`) |
| `prefixCompound` | Compound uses `attribute-value` order instead (e.g. `text-centered` instead of `centered-text`) |

**Spec hints**: When a content field name matches a component (e.g., `icon` in button), check that component's spec for exhaustive options via `couplesWith`.

**Golden rule: If it's not in the spec, don't use it.**

### Accessing Specs via MCP

If Semantic UI MCP tools are available, use them for live spec access:

- `list_components` — discover all available components and their tag names
- `get_component` — retrieve a component's full spec (attributes, events, methods, etc.)
- `search` — find components by keyword when you don't know the exact name

If MCP tools are not available, fetch specs via `https://next.semantic-ui.com/llms.txt` for content URLs.

### Tag Naming Conventions

Tag names are defined in each spec's `tagName` field. Do not infer tag names.

- Top-level components use `ui-` prefix: `ui-button`, `ui-modal`, `ui-card`
- Plural containers use `ui-` prefix: `ui-buttons`, `ui-cards`
- Subcomponents often omit the prefix: `menu-item`, `form-field`

Always retrieve the tag name from the spec:

```json
{ "tagName": "ui-menu" }        // Use <ui-menu>
{ "tagName": "menu-item" }      // Use <menu-item>, not <ui-menu-item>
```

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

Child attributes override inherited plural variations (like English: "three large buttons, but the first one is blue").

---

## SUI-Specific Syntax

These patterns are unique to SUI — standard HTML/web component knowledge doesn't cover them.

**Write markup that reads as natural English.** Order attributes like adjectives in speech — size before color before type:

```html
<ui-button small blue primary>  <!-- "small blue primary button" ✓ -->
<ui-button primary small blue>  <!-- less natural ✗ -->
```

### Three Attribute Dialects

All equivalent ways to set variations:

```html
<ui-button large>          <!-- concise (preferred) — reads like natural language -->
<ui-button size="large">   <!-- verbose — useful for disambiguation -->
<ui-button class="large">  <!-- classic — easier CSS selectors (.large vs [large]) -->
```

**Concise** is preferred because it reads naturally. **Verbose** helps when attributes share values (see Compound Aliases). **Classic** is rarely used but simplifies CSS when you need to target variations externally.

### Three Content Syntaxes

For fields in the spec's `content` section:

```html
<ui-card header="Title">                     <!-- attribute: strings only -->
<ui-card><div class="header">Rich HTML</div> <!-- class: rich content -->
<ui-card><div slot="header">Rich HTML</div>  <!-- slot: web standard -->
```

Use **attribute** for simple strings, **class** or **slot** for rich HTML content.

### Boolean Attributes

Boolean attributes can be explicitly set to false using the string `"false"`:

```html
<!-- Checked by default, explicitly unchecked -->
<ui-checkbox checked="false"></ui-checkbox>

<!-- Closeable modal vs non-closeable -->
<ui-modal closeable="true">...</ui-modal>
<ui-modal closeable="false">...</ui-modal>
```

This differs from standard HTML boolean attributes where presence alone means true.

### Value Fuzzing

SUI normalizes value formats — these are all equivalent (prefer natural language form):

```html
<ui-button icon="right arrow">   <!-- spaces (preferred — reads naturally) -->
<ui-button icon="arrow-right">   <!-- kebab-case -->
<ui-button icon="right-arrow">   <!-- reversed kebab -->
```

### Compound Aliases

**Spec values are always the canonical verbose form** — what goes after `=`. The concise compound form is derived, never stored.

When a value like `"subtle"` appears in multiple attributes (e.g. `styled` and `positive`), you must disambiguate in concise form:

```html
<ui-button subtle>            <!-- sets styled="subtle" (styled owns the bare form) -->
<ui-button subtle-positive>   <!-- sets positive="subtle" -->
<ui-button subtle-warning>    <!-- sets warning="subtle" -->
```

In verbose form, the attribute name removes ambiguity — just use the raw value:

```html
<ui-button positive="subtle">  <!-- no compound needed -->
<ui-button styled="subtle">    <!-- also fine -->
```

When any value in an attribute collides, **all sibling values** also support compound form for consistency:

```html
<!-- "left" and "right" collide between floated and attached -->
<!-- so ALL attached values support compounds, even non-colliding ones -->
<ui-button top-attached>       <!-- works (compound) -->
<ui-button top>                <!-- also works (bare, no collision) -->
<ui-button left-attached>      <!-- required (bare "left" is ambiguous) -->
```

Some values use `compoundAliases` for readability even without collision — the compound form is the only concise option:

```html
<ui-button very-compact>       <!-- compact="very" — "very" alone reads unnaturally -->
<ui-button clickable-disabled> <!-- disabled="clickable" -->
<ui-button vertical-animated>  <!-- animated="vertical" -->
```

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

| Method | When | What it does |
|--------|------|--------------|
| `settings()` | Component in DOM | Sets properties immediately |
| `initialize()` | Before DOM ready | Waits for DOM ready, then sets properties |
| Direct properties | Component in DOM | Same as `settings()`, vanilla JS style |

### Form Values

Get and set values on form components:

```js
// Query syntax
$('ui-input').val()              // Get value
$('ui-input').val('new value')   // Set value

// Vanilla JS
document.querySelector('ui-input').value
```

**Debugging**: Use `$('ui-component').dataContext()` or `el.dataContext` to inspect the component's flattened template context (state + data + methods).

---

## Standard Web Patterns

These behave like standard web components — Query just provides convenient syntax:

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

// setAttribute works too
element.setAttribute('size', 'large');
```

**Theming** — Components auto-adapt to light/dark mode. Set on `<html>` for page-wide, or on any container/component to override:
```html
<html dark>                    <!-- page-wide dark theme -->
<div light>                    <!-- light section within dark page -->
<ui-card dark>                 <!-- force dark on single component -->
```

Equivalent syntaxes: `dark`, `class="dark"`, `theme="dark"` — use whichever fits your styling approach.

---

## Query Essentials

The `$` function provides DOM selection and manipulation:

```js
$('ui-button')                   // Select elements
$('ui-modal').component()        // Get component instance
$('ui-button').on('click', fn)   // Bind events
$('ui-button').attr('disabled', true)  // Set attributes
```

### Shadow DOM Piercing

The `$$` function queries across Shadow DOM boundaries:

```js
$$('ui-dropdown .item')  // Finds .item inside dropdown's shadow root
```

This is an advanced pattern. Only use `$$` when you understand a component's internal shadow DOM structure — typically for custom components you've authored.

---

## Common Patterns

Examples using components with known specs. For other components, retrieve the spec first.

### Modal with Trigger

```html
<ui-button id="open-btn">Open Modal</ui-button>

<ui-modal id="my-modal" large>
  <h2>Title</h2>
  <p>Modal content here.</p>
  <ui-buttons>
    <ui-button>Cancel</ui-button>
    <ui-button primary>Confirm</ui-button>
  </ui-buttons>
</ui-modal>

<script>
$('#open-btn').on('click', () => {
  $('#my-modal').component().show();
});
</script>
```

### Navigation Menu

```html
<ui-menu>
  <menu-item icon="home" active>Home</menu-item>
  <menu-item icon="user">Profile</menu-item>
  <menu-item icon="settings">Settings</menu-item>
</ui-menu>

<!-- Selection menu with event -->
<ui-menu selection id="nav">
  <menu-item value="home">Home</menu-item>
  <menu-item value="about">About</menu-item>
</ui-menu>

<script>
$('#nav').on('change', (e) => {
  console.log('Selected:', e.detail.value);
});
</script>
```

---

## Quick Reference

```html
<!-- Get spec first, then use exact tagName -->
<ui-button large primary>Click</ui-button>
<ui-card header="Title" image="/photo.jpg"></ui-card>

<!-- Compound aliases — disambiguate colliding values -->
<ui-button subtle>             <!-- styled="subtle" (owner) -->
<ui-button subtle-positive>    <!-- positive="subtle" (compound) -->
<ui-button very-compact>       <!-- compact="very" (readability) -->

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

// Form values
$('ui-input').val()              // get
$('ui-input').val('new value')   // set
```

**Always check the spec. If it's not in the spec, don't use it.**

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Style Components** | `sui:style-components` | Customizing CSS, theming, design tokens, `::part()` styling |
| **Design Tokens** | `sui:design-tokens` | Looking up available design tokens for colors, spacing, effects |
| **Use Icons** | `sui:use-icons` | Creating custom icon sets for `<ui-icon>` |

---
title: Semantic UI Web Components Layout Context
description: Reference guide for generating layouts using Semantic UI Web Components, covering markup syntax, JavaScript interaction, theming, and spec-driven development patterns.
keywords: [web components, layout, markup, attributes, theming, specs, query]
audience: ui
type: doc
---

# Semantic UI Web Components — Layout Context

Reference for generating layouts using Semantic UI Web Components.

## Core Concepts

Semantic UI components are Web Components with a declarative, attribute-based API. Each component is defined by a **spec JSON file** that serves as the source of truth for its capabilities.

### Tag Naming

Tag names are defined in each spec's `tagName` field. Do not infer tag names.

- Top-level components use `ui-` prefix: `ui-button`, `ui-modal`, `ui-card`
- Plural containers use `ui-` prefix: `ui-buttons`, `ui-cards`
- Subcomponents often omit the prefix: `menu-item`, `form-field`

Always retrieve the tag name from the spec:

```json
{ "tagName": "ui-menu" }        // Use <ui-menu>
{ "tagName": "menu-item" }      // Use <menu-item>, not <ui-menu-item>
```

## Reading Spec Files

Each spec JSON defines a component's full API:

| Section | Purpose |
|---------|---------|
| `tagName` | HTML element name (use exactly as specified) |
| `content` | Slots and content attributes (icon, image, header, etc.) |
| `types` | Behavioral variations — **mutually exclusive** (pick one) |
| `states` | Runtime states (disabled, loading, active, hover) |
| `variations` | Visual variations — **stackable** (combine freely) |
| `settings` | Configurable properties with types and defaults |
| `events` | Custom events the component emits |
| `methods` | Methods available directly on the element |

For plural components, additional sections apply:

| Section | Purpose |
|---------|---------|
| `pluralTagName` | Group element name |
| `pluralOnlyTypes` | Types only available on the container |
| `pluralOnlyVariations` | Variations only available on the container |
| `pluralSharedVariations` | Variations that propagate to children |

## Markup Syntax

### Boolean Shorthand

Attribute values can be written as boolean attributes:

```html
<!-- These are equivalent -->
<ui-button size="large" color="red">Click</ui-button>
<ui-button large red>Click</ui-button>

<!-- Mixing both styles -->
<ui-button large emphasis="primary" red>Click</ui-button>
```

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

### Attribute-Property Reflection

All attributes are reflected as element properties:

```javascript
// These are equivalent
element.getAttribute('disabled')
element.disabled

// Setting works both ways
element.setAttribute('size', 'large');
element.size = 'large';
```

### Slots

Named content areas use the `slot` attribute:

```html
<ui-card>
  <div slot="header">Title</div>
  <div slot="subheader">Subtitle</div>
  <div slot="description">Body content here.</div>
</ui-card>
```

Some content supports multiple syntaxes (check spec `content` section):

```html
<!-- Attribute shorthand -->
<ui-card header="Title" subheader="Subtitle"></ui-card>

<!-- Slot syntax (for rich content) -->
<ui-card>
  <div slot="header"><strong>Rich</strong> Title</div>
</ui-card>
```

### Compound Aliases

When attributes share option values, disambiguate with compound form:

```html
<!-- If both 'size' and 'padding' have 'small' as an option -->
<ui-segment size-small>    <!-- size="small" -->
<ui-segment padding-small> <!-- padding="small" -->

<!-- Order is flexible -->
<ui-button animated-vertical>
<ui-button vertical-animated>
<!-- Both resolve to animated="vertical" -->
```

### Plural Containers

Group components with their plural container:

```html
<ui-buttons>
  <ui-button>One</ui-button>
  <ui-button>Two</ui-button>
  <ui-button>Three</ui-button>
</ui-buttons>

<!-- Variations on container affect children -->
<ui-buttons size="small" color="blue">
  <ui-button>All Small Blue</ui-button>
  <ui-button>All Small Blue</ui-button>
</ui-buttons>

<!-- Plural-only variations -->
<ui-cards count="three" stackable>
  <ui-card>...</ui-card>
  <ui-card>...</ui-card>
  <ui-card>...</ui-card>
</ui-cards>
```

## JavaScript Interaction

### Component Instance

Access the component instance for imperative control:

```javascript
// Via query
const modal = $('ui-modal').component();

// Via element property
const modal = document.querySelector('ui-modal').component;

// Call methods
modal.show();
modal.hide();
```

Some components expose methods directly on the element when listed in the spec's `methods` section:

```javascript
// If spec defines methods, they may be available directly
element.show();
element.hide();

// Check spec for available methods
```

### Form Values

Get and set values on form components:

```javascript
// Query syntax
$('selector').val()              // Get value
$('selector').val('new value')   // Set value

// Element method
element.value()
```

### Configuration

Configure components with settings:

```javascript
// Before DOM insertion — use initialize()
const dropdown = $('<ui-dropdown>').initialize({
  searchable: true,
  placeholder: 'Select...'
});
$('body').append(dropdown);

// After DOM insertion — use settings()
$('ui-dropdown').settings({
  searchable: true,
  placeholder: 'Select...'
});
```

### Events

Bind events using query or standard DOM:

```javascript
// Query syntax
$('ui-modal').on('show', (e) => {
  console.log('Modal opening');
});

$('ui-modal').on('hidden', (e) => {
  console.log('Modal closed');
});

// Standard DOM
document.querySelector('ui-modal').addEventListener('visible', handler);
```

## Theming

Components automatically adapt to light/dark mode. Colors, backgrounds, and contrast adjust without additional markup.

### Setting Theme

Apply theme at the root level:

```html
<html light>
<html dark>

<!-- Or with class -->
<body class="light theme">
<body class="dark theme">
```

### Automatic Behavior

- Theme is detected from system preference by default
- All color tokens auto-adapt (no component changes needed)
- Override per-section by applying theme attribute to any container

```html
<body light>
  <main>Light content</main>
  <aside dark>Dark sidebar</aside>
</body>
```

## Common Patterns

Examples using components with known specs. For other components, request the spec first.

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

### Card Grid

```html
<ui-cards count="three" stackable>
  <ui-card image="/photo1.jpg">
    <div slot="header">Card One</div>
    <div slot="description">Description text.</div>
  </ui-card>
  <ui-card image="/photo2.jpg">
    <div slot="header">Card Two</div>
    <div slot="description">Description text.</div>
  </ui-card>
  <ui-card image="/photo3.jpg">
    <div slot="header">Card Three</div>
    <div slot="description">Description text.</div>
  </ui-card>
</ui-cards>
```

### Button Groups

```html
<!-- Action buttons -->
<ui-buttons>
  <ui-button primary>Save</ui-button>
  <ui-button>Cancel</ui-button>
</ui-buttons>

<!-- Icon toolbar -->
<ui-buttons size="small">
  <ui-button icon="bold" icon-only></ui-button>
  <ui-button icon="italic" icon-only></ui-button>
  <ui-button icon="underline" icon-only></ui-button>
</ui-buttons>

<!-- Equal width -->
<ui-buttons equal-width="three">
  <ui-button>One</ui-button>
  <ui-button>Two</ui-button>
  <ui-button>Three</ui-button>
</ui-buttons>
```

### Navigation Menu

```html
<ui-menu>
  <menu-item icon="home" active>Home</menu-item>
  <menu-item icon="user">Profile</menu-item>
  <menu-item icon="settings">Settings</menu-item>
</ui-menu>

<!-- Vertical menu -->
<ui-menu vertical>
  <menu-item>Dashboard</menu-item>
  <menu-item>Reports</menu-item>
  <menu-item>Analytics</menu-item>
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

### Content Dividers

```html
<!-- Basic divider -->
<ui-divider></ui-divider>

<!-- With text -->
<ui-divider text="Or"></ui-divider>

<!-- Styled -->
<ui-divider styled="fade" text="Section"></ui-divider>

<!-- With icon -->
<ui-divider icon="star"></ui-divider>
```

## Query Essentials

The `$` function provides DOM manipulation:

```javascript
// Selection
$('ui-button')           // Select elements
$('ui-modal').first()    // First match

// Component access
$('ui-modal').component()       // Get component instance

// Events
$('ui-button').on('click', handler)
$('ui-modal').on('show', handler)
$('ui-menu').on('change', handler)

// Attributes
$('ui-button').attr('disabled', true)
$('ui-button').removeAttr('disabled')

// Visibility
$('.content').show()
$('.content').hide()
```

### Shadow DOM Piercing

The `$$` function queries across Shadow DOM boundaries:

```javascript
$$('ui-dropdown .item')  // Finds .item inside dropdown's shadow root
```

This is an advanced pattern. Only use `$$` when you understand a component's internal shadow DOM structure — typically for custom components you've authored.

## Spec-Driven Development

When generating layouts:

1. **Request the spec** for each component you need
2. **Use exact tag names** from `tagName` field — never infer them
3. **Check `content`** for available slots and content attributes
4. **Check `types`** for behavioral variants (mutually exclusive)
5. **Check `variations`** for visual options (can be combined)
6. **Check `states`** for interactive states (disabled, loading)
7. **Check `events`** for available lifecycle hooks
8. **Check `methods`** for imperative control
9. **Check `settings`** for configurable properties
10. **Check plural sections** when grouping components

The spec is authoritative — if an attribute, option, or tag name isn't in the spec, don't use it.

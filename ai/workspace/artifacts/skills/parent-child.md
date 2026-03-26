---
title: Parent-Child Coordination in UI Primitives
description: Toolkit of approaches for building composite UI primitives with parent-child coordination, including Light DOM, configuration-driven, Shadow DOM, and template patterns.
keywords: [parent-child, coordination, Light DOM, Shadow DOM, CSS variables, templates, composition]
audience: framework
skill: parent-child
type: doc
---

# Parent-Child Coordination in UI Primitives: A Toolkit Approach

> **For:** AI agents building composite UI primitives (menu, table, tabs, etc.)
> **Prerequisites:** [Mental Model](/ai/framework/mental-model.md) • [Creating Components](/ai/framework/creating-components.md)
> **Related:** [Best Practices](/ai/framework/best-practices.md) • [CSS Implementation](/ai/contributing/workflows/implement-primitive-css.md)
> **Last Updated:** 2025-11-05

---

## Table of Contents

- [Introduction](#introduction)
- [The Toolkit: Available Approaches](#the-toolkit-available-approaches)
- [Pattern Selection Guide](#pattern-selection-guide)
- [Pattern 1: Light DOM + pageCSS](#pattern-1-light-dom--pagecss)
- [Pattern 2: Configuration-Driven](#pattern-2-configuration-driven)
- [Pattern 3: Shadow DOM + CSS Variables](#pattern-3-shadow-dom--css-variables)
- [Pattern 4: Template-as-Settings](#pattern-4-template-as-settings)
- [Pattern 5: Client-Only Coordination](#pattern-5-client-only-coordination)
- [CSS Cascade in Shadow DOM](#css-cascade-in-shadow-dom)
- [Multi-Pattern Components](#multi-pattern-components)
- [Component Examples](#component-examples)
- [Decision Framework](#decision-framework)

---

## Introduction

### The Challenge

Many UI primitives require parent-child coordination:
- **Menu**: Parent tracks active item, children receive clicks
- **Table**: Columns must align, rows need selection state
- **Tabs**: Parent manages active tab, panels show/hide accordingly
- **Accordion**: Parent handles expand/collapse, sections respond

### Why Multiple Approaches?

Unlike React/Vue where composition is straightforward, web components face unique constraints:

1. **Shadow DOM boundaries** prevent normal CSS cascade
2. **SSR isolation** means components render independently
3. **:slotted() limitations** can't reach into child internals
4. **Performance** concerns with 5000+ global CSS variables

**The solution:** A toolkit of patterns, each solving different constraints. Choose the approach (or combination) that fits your component's needs.

### Philosophy

**There is no single "correct" pattern.** Modern Semantic UI components use the approach that best balances:
- SEO requirements
- Encapsulation needs
- Coordination complexity
- SSR compatibility
- Developer experience

Some components use multiple approaches simultaneously (like menu offering both `items` configuration and slotted composition).

**Semantic UI's unique feature:** Primitives support three dialects—`<ui-divider vertical>` (attribute), `divider.direction = "vertical"` (property), and `<ui-divider class="vertical">` (class)—all mapping to the same styling via the `{ui}` template variable. This is why components use class-based CSS (`.vertical.divider`) rather than `:host([vertical])`.

---

## The Toolkit: Available Approaches

### Quick Reference Matrix

| Pattern | Encapsulation | SSR | Coordination | Setup | Best For |
|---------|--------------|-----|--------------|-------|----------|
| **Light DOM + pageCSS** | None | ✅ | Full CSS | Low | Semantic HTML, SEO |
| **Configuration** | Full | ✅ | Parent controls | Medium | Data-driven structure |
| **Shadow + CSS vars** | Full | ✅ | Limited | Medium | Encapsulation + theming |
| **Template-as-settings** | Full | ✅ | Parent renders | High | Custom rendering |
| **Client-only** | Full | ❌ | Full JS | Medium | Complex interactive |

**Note:** pageCSS = Stylesheet attached to document (not shadow DOM) for styling light DOM content.

### When to Use Which

**Light DOM + pageCSS:**
- Basic table (semantic `<table>` with `<tr>`, `<td>`)
- Simple lists needing SEO
- Components where encapsulation isn't important
- Trade-off: FOUC acceptable (brief unstyled flash before JS loads)

**Configuration (items/rows/columns):**
- Menu with predictable structure
- Data table with uniform rows
- Components where users provide data, not markup

**Shadow DOM + CSS vars:**
- Menu needing click handling + encapsulation
- Components with complex internal styling
- When theme inheritance matters

**Template-as-settings:**
- Data table with custom row rendering
- Complex components needing user-defined templates
- When configuration alone isn't flexible enough

**Client-only:**
- Panels with drag/resize (complex algorithms)
- Interactive components where SSR makes no sense
- Components requiring deep coordination

---

## Pattern Selection Guide

### Decision Tree

```
What are your requirements?

Is semantic HTML structure critical for SEO/accessibility?
├─ YES → Use Light DOM + pageCSS
│   └─ Example: Basic table with <thead>, <tbody>, <tr>, <td>
│
└─ NO → Need encapsulation?
    │
    ├─ NO → Still use Light DOM + pageCSS (simpler)
    │
    └─ YES → What's the primary use case?
        │
        ├─ Structured, predictable data
        │   └─ Use Configuration pattern
        │       └─ Add Template-as-settings if customization needed
        │
        ├─ Need composition + theming
        │   └─ Use Shadow DOM + CSS vars
        │       └─ Consider hybrid: Configuration + Slot fallback
        │
        └─ Complex interactive coordination
            └─ Use Client-only pattern
                └─ Document SSR limitation
```

### Requirement Checklist

**Choose Light DOM if ANY apply:**
- ✅ Need SEO (search engines read content)
- ✅ Semantic HTML important for accessibility
- ✅ Don't need style encapsulation
- ✅ Want simplest possible implementation
- ✅ Brief FOUC acceptable (or can mitigate with critical CSS)

**Choose Configuration if:**
- ✅ Data-driven (arrays of items/rows)
- ✅ Structure is predictable
- ✅ Want parent to control everything
- ✅ SSR required

**Choose Shadow DOM + CSS vars if:**
- ✅ Need style encapsulation
- ✅ Want composition pattern (slotted children)
- ✅ Parent needs to influence child styling
- ✅ SSR required

**Choose Template-as-settings if:**
- ✅ Configuration too rigid
- ✅ Users need custom rendering
- ✅ Parent still needs control
- ✅ SSR required

**Choose Client-only if:**
- ✅ Requires complex JavaScript coordination
- ✅ Interactive-only (no static rendering makes sense)
- ✅ SSR not important for this component

---

## Pattern 1: Light DOM + pageCSS

### Overview

Components render into light DOM (no shadow boundary), styled via a stylesheet attached to the document using `pageCSS`.

### When to Use

- **Basic table**: Semantic `<table>` structure, column alignment automatic
- **Simple lists**: SEO-critical content
- **Presentational wrappers**: When encapsulation isn't needed

### How It Works

```javascript
// component.js
import { defineComponent } from '@semantic-ui/component';
import pageCSS from './table-page.css?raw';

const Table = defineComponent({
  tagName: 'ui-table',
  template: `<table><slot></slot></table>`,
  pageCSS,  // Attaches to document, not shadow DOM
});
```

```css
/* table-page.css - Normal CSS, no shadow boundary */
ui-table {
  display: block;
  margin: var(--table-margin);
}

ui-table table {
  width: 100%;
  border-collapse: collapse;
}

ui-table tr {
  border-bottom: 1px solid var(--border-color);
}

ui-table td,
ui-table th {
  padding: var(--table-cell-padding);
  text-align: left;
}

/* Attribute-based variations */
ui-table[striped] tbody tr:nth-child(even) {
  background: var(--subtle-background);
}

ui-table[bordered] {
  border: 1px solid var(--border-color);
}
```

```html
<!-- Usage: Standard semantic HTML -->
<ui-table striped bordered>
  <thead>
    <tr>
      <th>Name</th>
      <th>Age</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Alice</td>
      <td>30</td>
    </tr>
    <tr>
      <td>Bob</td>
      <td>25</td>
    </tr>
  </tbody>
</ui-table>
```

### Advantages

- ✅ **Column alignment automatic** (native table algorithm)
- ✅ **Normal CSS cascade** (no shadow boundary)
- ✅ **SEO friendly** (semantic HTML visible to search engines)
- ✅ **SSR compatible** (renders correct HTML)
- ✅ **Simple implementation** (minimal JavaScript)
- ✅ **Accessible by default** (semantic elements)

### Limitations

- ❌ **No style encapsulation** (global CSS can interfere)
- ❌ **No composition benefits** (can't control internal structure)
- ❌ **User HTML must be correct** (can't fix invalid markup)
- ⚠️ **FOUC risk** (Flash of Unstyled Content) - pageCSS attaches when JavaScript runs, content may render unstyled briefly until component initializes

### Understanding FOUC Trade-off

**Why Light DOM has FOUC:**

pageCSS attaches to document when JavaScript runs. Content renders immediately (good for SSR/SEO), but styles apply slightly later, causing a brief unstyled flash.

**Mitigation strategy:**

Users can pre-load styles in `<head>` to eliminate FOUC:
```html
<link rel="stylesheet" href="semantic-ui/table-page.css">
```

The framework's hash-based deduplication detects pre-loaded styles and skips re-attaching them. *(See Implementation Notes appendix for details)*

**Progressive optimization:**
1. **Simple default**: Use component, accept brief flash
2. **Zero-FOUC**: Pre-load styles for above-fold content
3. **No duplication**: Framework prevents double-loading

**Architectural decision:**

For basic presentational components (table, list), Semantic UI uses Light DOM + pageCSS because:
- ✅ Semantic HTML structure for SEO/accessibility
- ✅ Native browser features (table column alignment)
- ✅ Simple implementation (no shadow boundary coordination)
- ✅ Optional FOUC elimination via pre-loading
- ⚠️ Brief flash in default usage (acceptable trade-off)

### Best Practices

1. **Use semantic HTML** - Let users provide proper structure
2. **Attribute-based variations** - `striped`, `bordered`, `compact`
3. **Validate in documentation** - Show correct usage examples
4. **CSS specificity** - Use `ui-table td` to avoid conflicts
5. **Design tokens** - Reference global tokens for consistency

---

## Pattern 2: Configuration-Driven

### Overview

Parent component accepts data as configuration (items, rows, columns) and renders children internally. No composition needed.

### When to Use

- **Menu with items**: Predictable structure (icon, label, value)
- **Data table**: Uniform rows from data
- **Any data-driven component**: When structure is consistent

### How It Works

```javascript
// menu.js
const defaultSettings = {
  items: [],  // Array of {label, value, icon, href}
  value: '',
};

const createComponent = ({ settings }) => ({
  isValueActive(activeValue, item) {
    if (item.active) {
      return true;
    }
    return activeValue == (item.value || item.href);
  }
});
```

```html
<!-- menu.html -->
<div class="{ui}menu" part="menu">
  {#each item in items}
    <menu-item
      active={isValueActive value item}
      href={item.href}
      value={item.value}
    >
      {#if item.icon}
        <ui-icon icon={item.icon}></ui-icon>
      {/if}
      <span class="label">{item.label}</span>
    </menu-item>
  {/each}
</div>
```

```javascript
// Usage
const menu = document.querySelector('ui-menu');
menu.settings({
  items: [
    { label: 'Home', value: 'home', icon: 'home' },
    { label: 'Settings', value: 'settings', icon: 'cog' },
    { label: 'Logout', value: 'logout', icon: 'sign-out' }
  ],
  value: 'home'  // Active item
});
```

### Advantages

- ✅ **Full control** - Parent renders everything
- ✅ **Consistent structure** - Guaranteed valid markup
- ✅ **Easy state management** - All state in one place
- ✅ **SSR compatible** - Renders with initial data
- ✅ **No coordination needed** - Parent owns children

### Limitations

- ❌ **Less flexible** - Fixed structure
- ❌ **Complex content harder** - Everything via configuration
- ❌ **No custom markup** - Users can't provide own HTML

### Best Practices

1. **Clear schema** - Document item structure
2. **Sensible defaults** - Make common cases easy
3. **Consider slots** - For truly custom content (see Pattern 3)
4. **Events** - Dispatch change/select events
5. **Template-as-settings** - For customization (see Pattern 4)

---

## Pattern 3: Shadow DOM + CSS Variables

### Overview

Parent and children both use Shadow DOM. Coordination via CSS custom properties (which inherit across boundaries) and attributes (updated via `$$()` queries).

### When to Use

- **Menu with composition**: Support both `items` and slotted `<menu-item>`
- **Components needing encapsulation**: Scoped styles important
- **Parent influences child styling**: Theming across children

### How It Works

**The Hybrid Pattern:**
```html
<!-- menu.html - Support both modes -->
<div class="{ui}menu" part="menu">
  {#each item in items}
    <!-- Configuration mode: parent renders -->
    <menu-item {...item.props}>
  {else}
    <!-- Composition mode: user provides -->
    {>slot}
  {/each}
</div>
```

**CSS Variables for Styling:**
```css
/* menu.css - Parent sets variables for children */
.selection.menu ::slotted(*),
.selection.menu menu-item {
  --menu-item-padding: var(--menu-selection-item-padding);
  --menu-item-border-radius: var(--menu-selection-item-border-radius);
  --menu-item-hover-background: var(--menu-selection-item-hover-background);
}
```

```css
/* menu-item.css - Child references variables */
.item {
  padding: var(--menu-item-padding);
  border-radius: var(--menu-item-border-radius);
}

.item:hover {
  background: var(--menu-item-hover-background);
}
```

**Attributes for State:**
```javascript
// Parent coordinates state via attributes
selectValue(value) {
  const $items = $$(el).find('menu-item');
  const $item = $items.filter(`[value="${value}"]`).first();

  if ($item.exists()) {
    $items.removeAttr('active');
    $item.attr('active', '');
  }
}
```

**Events for Communication:**
```javascript
// Parent listens for child events
const events = {
  'deep click menu-item'({ self, value }) {
    if (value !== undefined) {
      self.setValue(value);
    }
  }
};
```

### Advantages

- ✅ **Style encapsulation** - Scoped CSS per component
- ✅ **Composition support** - Users can slot children
- ✅ **Theme coordination** - CSS vars inherit naturally
- ✅ **SSR compatible** - Initial attributes work
- ✅ **Flexible** - Configuration OR composition

### Limitations

- ⚠️ **Limited styling control** - Can only pass CSS var values
- ⚠️ **Can't change structure** - Only styling, not markup
- ⚠️ **Deep nesting complexity** - See CSS Cascade section
- ❌ **:slotted() + ::part() don't combine** - Can't reach child internals

### Best Practices

1. **Hybrid items/slot** - Support both modes
2. **CSS vars for theming** - Set on `::slotted(*)` AND direct children
3. **Attributes for state** - Use `$$()` to query and update
4. **Events for interaction** - Use `deep` keyword for shadow crossing
5. **exportparts** - Let users style child parts

### Implementation Example

Menu implements this pattern in `src/primitives/menu/`:
- `menu.html` uses `{#each items}{else}{>slot}` for hybrid support
- `menu.js` manages state via `$$()` queries and attributes
- `menu-bundle.css` sets CSS variables for child theming

---

## Pattern 4: Template-as-Settings

### Overview

Configuration-driven, but users can provide custom rendering templates as component settings. Parent renders using the user's template.

### When to Use

- **Data table with custom rows**: Users need complex cell rendering
- **Flexible customization**: Configuration too rigid, composition too loose
- **Parent maintains control**: But users customize presentation

### How It Works

```javascript
// Define custom template
const UserRowTemplate = defineComponent({
  template: `
    <tr class="user-row">
      <td><img src="{avatar}" /></td>
      <td><strong>{name}</strong></td>
      <td>{email}</td>
      <td><ui-button size="small">Edit</ui-button></td>
    </tr>
  `
});

// Configure table with custom template
$('ui-data-table').settings({
  columns: ['Avatar', 'Name', 'Email', 'Actions'],
  rows: [
    { avatar: '/alice.jpg', name: 'Alice', email: 'alice@example.com' },
    { avatar: '/bob.jpg', name: 'Bob', email: 'bob@example.com' }
  ],
  rowTemplate: UserRowTemplate  // Custom rendering
});
```

```html
<!-- data-table.html - Parent renders with user template -->
<table>
  <thead>
    {#each column in columns}
      <th>{column}</th>
    {/each}
  </thead>
  <tbody>
    {#each row in rows}
      {>template name=rowTemplate data=row}
    {/each}
  </tbody>
</table>
```

### Advantages

- ✅ **Configuration control** - Parent manages structure
- ✅ **User customization** - Flexible rendering
- ✅ **Type safety** - Template validates at definition
- ✅ **Encapsulation** - Each template has scope
- ✅ **SSR compatible** - Renders with template

### Limitations

- ❌ **More complex API** - Users must understand templates
- ❌ **Higher learning curve** - Beyond simple configuration
- ⚠️ **Documentation needed** - Show template patterns

### Best Practices

1. **Provide default template** - For common cases
2. **Document template API** - Show available data
3. **Example templates** - Give copy-paste starting points
4. **See subtemplates example** - `docs/src/examples/templates/subtemplates-as-settings/`

---

## Pattern 5: Client-Only Coordination

### Overview

Full JavaScript coordination using `findChildren()`, `findParent()`, direct method calls. No SSR support—these components require JavaScript to function.

### When to Use

- **Panels with drag/resize**: Complex interactive algorithms
- **Dynamic layout management**: Calculations require DOM measurements
- **Components where static rendering makes no sense**: Must be interactive

### How It Works

```javascript
// panels.js (Parent)
const createComponent = ({ $$, el }) => ({
  panels: [],  // Store child references

  addPanels() {
    // Discover children (client-side only)
    let $childPanelGroups = $(el).find('ui-panels');
    let $childPanelGroupPanels = $childPanelGroups.find('ui-panel');
    let $allPanels = $(el).find('ui-panel');
    let $panels = $allPanels.not($childPanelGroupPanels);
    self.panels = $panels.get();
  },

  resizePanels(index, delta) {
    // Complex algorithm coordinating multiple children
    // 300+ lines of calculations
  }
});

const events = {
  'resizeStart ui-panel'({ self, event, data }) {
    if (inArray(event.target, self.panels)) {
      self.setGroupCalculations();
      self.setDragStartCalculations(event.target, data);
    }
  }
};

const onCreated = ({ self }) => {
  self.addPanels();  // Only works client-side
};
```

```javascript
// panel.js (Child)
const createComponent = ({ findParent, dispatchEvent }) => ({
  minimize() {
    const panels = findParent('uiPanels');
    const index = panels.getPanelIndex(el);
    // Parent handles complex redistribution algorithm
    panels.setPanelMinimized(index);
  },

  startResize(event) {
    // Notify parent
    dispatchEvent('resizeStart', {
      initialSize: self.getCurrentFlex(),
      startPosition: self.getPointerPosition(event)
    });
  }
});
```

### Advantages

- ✅ **Full coordination** - No limitations
- ✅ **Direct method calls** - Clean APIs
- ✅ **Complex algorithms** - Can do anything
- ✅ **findChildren/findParent** - Easy traversal

### Limitations

- ❌ **No SSR** - Must render client-side
- ❌ **Requires JavaScript** - Doesn't degrade
- ⚠️ **Document limitation** - Tell users it's client-only

### Best Practices

1. **Document SSR limitation** - Clear in docs
2. **Progressive enhancement** - If possible, basic version works static
3. **Clear APIs** - Public methods for coordination
4. **Events for simple notifications** - `dispatchEvent` for updates
5. **findParent for complex operations** - When multi-child coordination needed

### When This Is Acceptable

Some components are inherently client-only:
- **Panels**: Drag/resize makes no sense static
- **Complex interactive**: Developer tools, admin interfaces
- **Niche use cases**: Where JS requirement is understood

Fundamental primitives (menu, table, tabs) should NOT use this pattern—they must work in SSR.

---

## CSS Cascade in Shadow DOM

### The Challenge

**Only relevant for Pattern 3 (Shadow DOM + CSS vars).**

When using Shadow DOM, each component redefines CSS variables at its shadow root:

```css
/* child-theme.css */
:host {
  --child-padding: 0.5rem;  /* Redefines at boundary */
}
```

This blocks cascade from parent, causing problems for deeply nested components (menu > menu > menu).

### The Solution: Selective Inherit

**95% of variables**: Use explicit defaults
```css
/* Most variables in theme files */
:host {
  --button-padding: 0.5rem;
  --button-color: var(--text-color);
  --button-border-radius: var(--border-radius);
}
```

**5% of variables**: Use inherit for cascade-needed vars
```css
/* Variables that must cascade (rare) */
:host {
  --menu-item-padding: inherit;  /* Allows parent control */
  --menu-item-color: inherit;
}

/* Definition file needs fallback when using inherit */
.item {
  padding: var(--menu-item-padding, 0.5rem);
  color: var(--menu-item-color, inherit);
}
```

### Critical Rules

1. **Definition files NEVER have hardcoded values**
   ```css
   /* ❌ WRONG */
   .button {
     padding: var(--button-padding, 0.5rem);
   }

   /* ✅ CORRECT */
   .button {
     padding: var(--button-padding);
   }
   ```

2. **Theme files provide all defaults**
   ```css
   /* ✅ CORRECT - Theme has explicit value */
   :host {
     --button-padding: 0.5rem;
   }

   /* ✅ ALSO CORRECT - Theme uses inherit */
   :host {
     --button-padding: inherit;
   }
   /* But then definition needs fallback: var(--button-padding, 0.5rem) */
   ```

3. **Use inherit sparingly** (1-5% of variables)
   - Only for variables parent needs to control
   - Example: padding/colors in themed components
   - Not for structural variables (widths, gaps)

### When Variables Need Cascade

**Likely cascade-needed:**
- `--cell-padding` (table type controls spacing)
- `--item-background` (parent theme applies)
- `--border-color` (consistent theming)

**Likely component-specific:**
- `--cell-min-width` (structural constraint)
- `--row-height` (layout property)
- `--menu-gap` (internal spacing)

### Deep Nesting Pattern

For 3+ level nesting, each level passes variables:

```css
/* Level 1: ui-table */
::slotted(ui-table-body) {
  --cell-padding: var(--table-cell-padding);
}

/* Level 2: ui-table-body */
::slotted(ui-table-row) {
  --cell-padding: var(--cell-padding, var(--default-cell-padding));
}

/* Level 3: ui-table-row */
::slotted(ui-table-cell) {
  --cell-padding: var(--cell-padding, 0.5rem);
}

/* Level 4: ui-table-cell (uses it) */
.cell {
  padding: var(--cell-padding);
}
```

### Override Slot Pattern (Alternative)

```css
/* child-theme.css */
:host {
  --child-padding-default: 0.5rem;
  --child-padding: var(--child-padding-override, var(--child-padding-default));
}

/* parent.css */
::slotted(child) {
  --child-padding-override: 1rem;
}

/* child-definition.css */
.element {
  padding: var(--child-padding);  /* Always resolves */
}
```

### Why This Matters

**Problem avoided with other patterns:**
- Light DOM: Normal CSS cascade, no problem
- Configuration: Parent renders, no coordination needed
- Client-only: JavaScript handles everything

**Only affects:** Shadow DOM composition mode, which should be rare anyway.

---

## Multi-Pattern Components

### Supporting Multiple Approaches

Components can (and should) support multiple patterns simultaneously:

### Example: Menu

```javascript
// menu.js supports TWO patterns

// Pattern 2: Configuration
const defaultSettings = {
  items: [],  // Data-driven mode
};

// Pattern 3: Composition
const template = `
  <div class="{ui}menu">
    {#each item in items}
      <menu-item {...item}>  <!-- Configuration renders -->
    {else}
      {>slot}  <!-- Composition fallback -->
    {/each}
  </div>
`;
```

**Usage modes:**

```html
<!-- Mode 1: Configuration (easy) -->
<ui-menu></ui-menu>
<script>
  $('ui-menu').settings({
    items: [{label: 'Home', value: 'home'}]
  });
</script>

<!-- Mode 2: Composition (flexible) -->
<ui-menu>
  <menu-item value="home">
    <ui-icon icon="home"></ui-icon>
    Home
  </menu-item>
  <menu-item value="settings">
    <ui-icon icon="cog"></ui-icon>
    Settings
  </menu-item>
</ui-menu>
```

### Example: Table (Split Implementation)

```javascript
// ui-table: Pattern 1 (Light DOM)
// For basic semantic tables
const Table = defineComponent({
  tagName: 'ui-table',
  template: `<table><slot></slot></table>`,
  pageCSS,  // Styles semantic HTML
});

// ui-data-table: Pattern 2 + 4 (Config + Templates)
// For feature-rich data tables
const UIDataTable = defineComponent({
  tagName: 'ui-data-table',
  defaultSettings: {
    columns: [],
    rows: [],
    rowTemplate: null,  // Optional custom template
  },
  template: `...renders rows internally...`
});
```

### Benefits of Multi-Pattern

- ✅ **Easy for simple cases** (configuration)
- ✅ **Flexible for complex cases** (composition)
- ✅ **Users choose** based on their needs
- ✅ **Same component** for both use cases

### When to Split vs Combine

**Combine patterns** (like menu):
- Patterns complementary
- Same coordination needs
- Users might want both in one app

**Split patterns** (like table):
- Different use cases entirely
- Different coordination needs
- Clear basic vs advanced split

---

## Component Examples

### Menu: Shadow DOM + CSS vars (Hybrid)

**Patterns:** Configuration + Composition (Shadow DOM)

**Why:**
- Needs encapsulation for click handling
- Both `items` and slotted `<menu-item>` supported
- CSS vars for theming variations (selection, vertical)

**Files:**
- `src/primitives/menu/menu.js` - Hybrid pattern
- `src/primitives/menu/menu.html` - {#each items}{else}{>slot}
- `src/primitives/menu/menu-bundle.css` - CSS vars for children

**Coordination:**
- Styling: CSS variables (`--menu-item-padding`)
- State: Attributes via `$$()` queries (`active`)
- Interaction: Events (`deep click menu-item`)

---

### Table: Split Implementation

**Basic Table - Pattern 1 (Light DOM):**
- For semantic HTML, SEO critical
- Normal CSS cascade
- Column alignment automatic
- `ui-table` with pageCSS

**Data Table - Pattern 2 + 4 (Config + Templates):**
- For sorting, filtering, pagination
- Configuration-driven with optional templates
- Client-side features
- `ui-data-table` with full control

**Why split:**
- Different use cases
- Basic needs SEO (light DOM)
- Data needs features (shadow DOM + config)

---

### Tabs: Shadow DOM + CSS vars

**Patterns:** Hybrid Configuration + Composition

**Challenges:**
- Distant siblings (tab-list and tab-panels separate)
- Need coordination across DOM distance
- Must support both data and composition

**Solution:**
- Value-based matching between tabs and panels
- CSS vars for theming
- Shadow DOM for encapsulation

---

### Panels: Client-Only

**Pattern:** Pattern 5 (Full coordination)

**Why:**
- Complex resize algorithms (300+ lines)
- Drag interactions
- Dynamic calculations
- SSR makes no sense for interactive resizing

**Acceptable because:**
- Niche component
- Interactive-only use case
- Users understand it requires JavaScript

---

## Decision Framework

### Step 1: Assess Requirements

**Questions to ask:**

1. **Is this a fundamental primitive?** (menu, table, tabs, accordion)
   - YES → Must support SSR
   - NO → Can consider client-only

2. **Is semantic HTML critical?** (SEO, accessibility)
   - YES → Use Light DOM + pageCSS
   - NO → Continue evaluation

3. **Is the structure predictable/data-driven?**
   - YES → Configuration pattern
   - NO → Need composition support

4. **Do you need style encapsulation?**
   - YES → Shadow DOM required
   - NO → Light DOM simpler

5. **How complex is coordination?**
   - Simple (active state) → CSS vars + attributes
   - Complex (algorithms) → Consider client-only OR configuration

### Step 2: Choose Primary Pattern

Based on answers above, select the primary approach:

- **Light DOM + pageCSS** → Simplest, SEO critical
- **Configuration** → Data-driven, parent controls
- **Shadow DOM + CSS vars** → Encapsulation + composition
- **Template-as-settings** → Configuration + customization
- **Client-only** → Complex coordination, SSR not needed

### Step 3: Consider Secondary Patterns

Can you support multiple approaches?

- **Hybrid items/slot** → Configuration AND composition
- **Split components** → Basic (light DOM) + Advanced (shadow DOM)
- **Template option** → Configuration + custom templates

### Step 4: Implementation Checklist

**For Light DOM + pageCSS:**
- [ ] Create component with `pageCSS` property
- [ ] Write normal CSS selectors (`ui-component td`)
- [ ] Use attribute variations (`[striped]`, `[bordered]`)
- [ ] Document semantic HTML usage

**For Configuration:**
- [ ] Define `defaultSettings` with items/rows/columns
- [ ] Render children in template (`{#each item in items}`)
- [ ] Dispatch events for interactions
- [ ] Consider slot fallback for flexibility

**For Shadow DOM + CSS vars:**
- [ ] Define theme variables (inherit if cascade-needed)
- [ ] Parent sets vars on `::slotted(*)` and direct children
- [ ] Child references vars in definition
- [ ] Use `$$()` for state coordination
- [ ] Events with `deep` keyword

**For Template-as-settings:**
- [ ] Define default template
- [ ] Accept custom template in settings
- [ ] Use `{>template name=userTemplate data=item}`
- [ ] Document template data API
- [ ] Provide example templates

**For Client-only:**
- [ ] Use `findChildren()`/`findParent()`
- [ ] Direct method calls for coordination
- [ ] Implement in `onCreated` or `onRendered`
- [ ] Document SSR limitation clearly

---

## Common Anti-Patterns

### ❌ Don't: Use Shadow DOM for SEO-Critical Content

```html
<!-- WRONG: Shadow DOM hides semantic HTML from search engines -->
<ui-table>
  #shadow-root
    <table>
      <tr><td>Product data...</td></tr>
    </table>
</ui-table>
```

**Why:** Search engines can't index content inside shadow DOM. Use Light DOM + pageCSS instead.

**Correct:** Light DOM for semantic HTML
```html
<ui-table>
  <table>
    <thead><tr><th>Product</th></tr></thead>
    <tbody><tr><td>Product data...</td></tr></tbody>
  </table>
</ui-table>
```

---

### ❌ Don't: Use Light DOM When Style Isolation is Critical

```html
<!-- WRONG: Global CSS can break component styling -->
<style>
  table { border: 10px solid red !important; }
</style>
<ui-table><!-- Will inherit the red border --></ui-table>
```

**Why:** Light DOM has no encapsulation. User styles can break components.

**Correct:** Use Shadow DOM or Configuration pattern when styling needs isolation.

---

### ❌ Don't: Use Client-Only for Fundamental Primitives

```javascript
// WRONG: Menu that requires JavaScript to render
const Menu = defineComponent({
  onCreated({ $$, el }) {
    // Build menu structure via DOM manipulation
    const items = self.getItems();
    items.forEach(item => {
      const menuItem = document.createElement('menu-item');
      el.appendChild(menuItem);
    });
  }
});
```

**Why:** Menu, table, tabs, accordion must work in SSR. Users expect these to function without JavaScript.

**Correct:** Use Configuration or Light DOM patterns for fundamental primitives.

---

### ❌ Don't: Force Composition When Configuration Works Better

```html
<!-- WRONG: Complex manual structure for simple data -->
<ui-table>
  <ui-table-header>
    <ui-table-row>
      <ui-table-cell>Name</ui-table-cell>
      <ui-table-cell>Age</ui-table-cell>
    </ui-table-row>
  </ui-table-header>
  <ui-table-body>
    <!-- Repeat for every row... -->
  </ui-table-body>
</ui-table>
```

**Why:** Composition is verbose for uniform data. Harder to coordinate, harder to use.

**Correct:** Use Configuration pattern
```javascript
$('ui-data-table').settings({
  columns: ['Name', 'Age'],
  rows: [['Alice', 30], ['Bob', 25]]
});
```

---

### ❌ Don't: Mix Patterns Without Clear Benefit

```javascript
// WRONG: Hybrid everything "just in case"
const Button = defineComponent({
  defaultSettings: {
    items: [],  // Configuration
  },
  template: `
    {#each item in items}
      <ui-button {...item}>
    {else}
      {>slot}  // Also composition
    {/if}
  `,
  pageCSS,  // Also light DOM styles
  css,      // Also shadow DOM styles
});
```

**Why:** Unnecessary complexity. Each pattern has maintenance cost.

**Correct:** Choose the pattern that fits your use case. Only combine when there's clear user benefit (like menu supporting both items and slotted children).

---

### ❌ Don't: Use CSS Variables for Structural Coordination

```css
/* WRONG: Trying to control layout via inherited variables */
.parent ::slotted(child) {
  --child-display: flex;
  --child-flex-direction: column;
}

/* child.css */
.child {
  display: var(--child-display);
  flex-direction: var(--child-flex-direction);
}
```

**Why:** CSS variables are for values, not architectural decisions. Structure should be in configuration or controlled directly.

**Correct:** Use Configuration pattern
```javascript
settings.orientation = 'vertical';  // Parent controls structure
```

Or use the standard `{ui}` class pattern:
```html
<!-- Template: {ui} populated from spec attributes -->
<div class="{ui}divider">
  <!-- vertical class added automatically -->
</div>
```

```css
/* CSS targets generated classes */
.vertical.divider {
  flex-direction: column;
}
```

**Note:** Semantic UI primitives support three dialects (attribute, property, class) which all map to the same class via the `{ui}` template variable. This is why you target classes like `.vertical.divider`, not `:host([vertical])`.

---

## Summary: The Complete Toolkit

Semantic UI provides **five coordination patterns** for different needs:

1. **Light DOM + pageCSS** → Semantic HTML, SEO, simple
2. **Configuration** → Data-driven, predictable structure
3. **Shadow DOM + CSS vars** → Encapsulation + theming
4. **Template-as-settings** → Configuration + customization
5. **Client-only** → Complex coordination, no SSR

**Key principles:**

- ✅ **No single correct pattern** - Choose based on requirements
- ✅ **Multiple patterns can coexist** - Menu uses config + composition
- ✅ **Light DOM when possible** - Simplest, most compatible
- ✅ **Configuration over composition** - Easier coordination
- ✅ **SSR for fundamentals** - Basic components must work static
- ✅ **Client-only is acceptable** - For truly interactive components

**When in doubt:**
- Start with Light DOM if no encapsulation needed
- Use Configuration if structure is predictable
- Add composition support if flexibility needed
- Consider split implementation for basic vs advanced

---

**Related Documentation:**
- [Mental Model - Component Communication](/ai/framework/mental-model.md#component-communication-architecture)
- [CSS Implementation Workflow](/ai/contributing/workflows/implement-primitive-css.md)
- [Component Authoring Best Practices](/ai/framework/best-practices.md)
- [Template-as-Settings Example](/docs/src/examples/templates/subtemplates-as-settings/)

---

## Appendix: Implementation Notes

### pageCSS Deduplication System

For agents implementing components with pageCSS, understanding the deduplication mechanism:

**How `adoptStylesheet` works** (`packages/utils/src/css.js`):

```javascript
export const adoptStylesheet = (css, adoptedElement, { hash = hashCode(css) }) => {
  // Check if stylesheet already adopted
  if (adoptedElement.cssHashes?.includes(hash)) {
    return; // Skip - already present
  }

  // Track this hash
  adoptedElement.cssHashes.push(hash);

  // Reuse cached stylesheet or create new
  let stylesheet = document.cachedStylesheets?.[hash]
    || new CSSStyleSheet();

  if (!document.cachedStylesheets?.[hash]) {
    stylesheet.replaceSync(css);
    document.cachedStylesheets[hash] = stylesheet;
  }

  // Adopt stylesheet (uses Constructable Stylesheets API)
  adoptedElement.adoptedStyleSheets = [
    ...adoptedElement.adoptedStyleSheets,
    stylesheet
  ];
};
```

**Key mechanisms:**

1. **Hash-based tracking**: Each stylesheet gets a hash from its content
2. **cssHashes array**: Tracks which hashes are adopted to prevent duplicates
3. **Global cache**: Reuses CSSStyleSheet instances across components
4. **Constructable Stylesheets**: Modern API for efficient style injection

**Future enhancement (planned):**

On framework initialization, scan existing page styles via CSSOM and populate `document.cssHashes` with their content hashes. When components try to adopt pageCSS, the hash check will detect pre-loaded styles and skip attachment, eliminating FOUC with zero duplication.

**Implementation:**
```javascript
// Future: One-time scan on framework init
function initializeStyleHashes() {
  document.cssHashes = [];
  Array.from(document.styleSheets).forEach(sheet => {
    try {
      const cssText = Array.from(sheet.cssRules)
        .map(rule => rule.cssText)
        .join('\n');
      const hash = hashCode(cssText);
      document.cssHashes.push(hash);
    } catch (e) {
      // CORS-protected stylesheet, skip
    }
  });
}
```

This makes pre-loading styles seamless—users add `<link>` tags, framework detects them automatically.

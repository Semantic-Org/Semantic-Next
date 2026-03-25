---
title: Component Composition Patterns
description: Three patterns for structuring parent-child web components in Semantic UI — configuration+composition hybrid, template-as-settings, and client-only coordination — plus cross-cutting techniques for CSS vars theming, pageCSS, deep events, and attribute-based state.
keywords: [composition, parent-child, slots, items, hybrid, subtemplate, template-as-settings, findParent, findChild, pageCSS, deep events, CSS variables, slotted, coordination, panels, menu, table]
audience: authoring
skill: component-composition
type: skill
---

# Component Composition Patterns

> **Skill:** `component-composition`
> **Purpose:** How to structure parent-child component relationships — when to use configuration, slots, passed templates, or imperative coordination.
> **Last Updated:** 2026-03-04

---

**Golden rule: Prefer the configuration+composition hybrid. Only go client-only when SSR is impossible.**

The hybrid pattern (`{#each items}{else}{>slot}{/each}`) handles the vast majority of parent-child relationships. Template-as-settings handles custom rendering. Client-only coordination is the escape hatch for complex interactive behaviors like drag-to-resize.

---

## Decision Tree

```
I need a parent-child component relationship.
│
├─ Is the child structure predictable and data-driven?
│  └─ YES → Pattern 1: Configuration+Composition Hybrid
│     (parent renders from `items` array, falls back to slotted children)
│
├─ Do consumers need to customize how repeated items render?
│  └─ YES → Pattern 2: Template-as-Settings
│     (consumer passes a subtemplate via settings, parent iterates with it)
│
├─ Is the coordination too complex for declarative patterns?
│  (drag-to-resize, panel minimization, shared layout calculations)
│  └─ YES → Pattern 3: Client-Only Coordination
│     (findParent + dispatchEvent + imperative DOM)
│
└─ Does the component need SSR?
   └─ YES → Avoid Pattern 3 for fundamental primitives.
      Patterns 1 and 2 work with SSR. Pattern 3 requires isClient guards.
```

---

## Pattern 1: Configuration+Composition Hybrid

The parent renders from data when an `items` setting is provided, and falls back to slotted children when it is not. This is the default pattern for SUI primitives.

### The Template

The core is a single `{#each}...{else}...{/each}` block:

```html
<!-- menu.html -->
<div class="{ui}menu" part="menu">
  {#each item in items}
    <menu-item
      active={isValueActive value item}
      href={item.href}
      value={item.value}
      exportparts="item"
    >
      {#if item.icon}
        <ui-icon part="item-icon" icon={item.icon}></ui-icon>
      {/if}
      <span part="item-label" class="label">{item.label}</span>
      {#if item.badge}
        <ui-label part="item-badge" outline badge>
          {item.badge}
        </ui-label>
      {/if}
    </menu-item>
  {else}
    {>slot}
  {/each}
</div>
```

*Source: `src/primitives/menu/menu.html`*

**How it works:**
- When `items` is set (via settings or attributes), the parent owns the render — it creates `<menu-item>` elements from data.
- When `items` is empty/unset, `{else}` activates and the `{>slot}` renders whatever children the consumer placed inside the tag.
- Both paths produce the same child elements (`<menu-item>`), so events and styling work identically.

### The Component (Condensed)

```js
// menu.js — key patterns only (see full source for imports/spec)
const createComponent = ({ settings, self, $$, el, dispatchEvent, isServer }) => ({
  setValue(value) {
    settings.value = value;
    dispatchEvent('change', { value });
    self.selectValue(value);
  },
  selectValue(value) {
    if (isServer) return;
    const $items = $$(el).find('menu-item');   // $$ pierces shadow boundaries
    $items.removeAttr('active');
    $items.eq(findIndex($items.val(), value)).attr('active', '');
  },
});

const events = {
  'deep click menu-item'({ self, value }) {   // deep pierces child shadow DOM
    if (value !== undefined) self.setValue(value);
  },
};
```

*Source: `src/primitives/menu/menu.js`*

Three cross-cutting techniques appear here (detailed in [Cross-Cutting Techniques](#cross-cutting-techniques) below):
- **`$$`** for querying across shadow boundaries
- **`deep` events** for hearing clicks inside child shadow DOMs
- **Attribute-based state** — parent sets `active` attribute, child CSS reacts

### When to Use

Use the hybrid when:
- The child structure is regular (list of items, tabs, steps)
- Each child has the same shape (label, value, icon, badge, etc.)
- Consumers may want either data-driven or markup-driven usage
- SSR is important (configuration path renders on the server)

```html
<!-- Configuration path — data-driven, SSR-friendly -->
<ui-menu items='[{"label": "Home", "value": "home"}, {"label": "About", "value": "about"}]'></ui-menu>

<!-- Composition path — markup-driven, slot-based -->
<ui-menu>
  <menu-item value="home">Home</menu-item>
  <menu-item value="about">About</menu-item>
</ui-menu>
```

---

## Pattern 2: Template-as-Settings

When consumers need to control *how* repeated items render — not just *what* data they contain — expose a subtemplate as a setting. The parent iterates, but the consumer provides the rendering logic.

### The Component and Template

```js
// component.js — the key is rowTemplate: new Template() as default
import { Template } from '@semantic-ui/templating';

const defaultSettings = {
  rowTemplate: new Template(),  // empty default, overridden at runtime
  headers: [],
  rows: [],
};

defineComponent({ tagName: 'dynamic-table', template, css, defaultSettings });
```

```html
<!-- component.html — parent iterates, consumer's template renders each row -->
<table>
  <thead>
    <tr>{#each header in headers}<th>{header}</th>{/each}</tr>
  </thead>
  <tbody>
    {#each rows as row}
      {> template name=rowTemplate data=row}
    {/each}
  </tbody>
</table>
```

*Source: `docs/src/examples/templates/subtemplates-as-settings/component.js`, `component.html`*

### The Row Subtemplate

```js
// row.js — no tagName, this is a subtemplate
export const Row = defineComponent({
  template: `<tr>
    <td>{concat firstName ' ' lastName}</td>
    <td>{id}</td><td>{age}</td><td>{gender}</td>
  </tr>`,
  css,
});
```

*Source: `docs/src/examples/templates/subtemplates-as-settings/row.js`*

### Consumer Swaps Templates at Runtime

```js
// page.js — swap between entirely different row templates
import { Row } from './row.js';
import { Row2 } from './row2.js';

$('dynamic-table').settings({ headers: ['Name', 'ID', 'Age', 'Gender'], rowTemplate: Row });

// later — switch to a different view
$('dynamic-table').settings({ headers: ['Name', 'Occupation', 'Hobby'], rowTemplate: Row2 });
```

*Source: `docs/src/examples/templates/subtemplates-as-settings/page.js`*

### When to Use

Use template-as-settings when:
- The parent owns iteration but the consumer owns item rendering
- Different consumers need different visual representations of the same data
- The item shape varies across use cases (e.g., summary view vs. stats view)

```
❌ WRONG — hardcoding multiple row layouts inside the parent component
✅ RIGHT — letting the consumer pass the row template as a setting
```

---

## Pattern 3: Client-Only Coordination

When the parent-child relationship involves complex imperative logic — drag-to-resize, panel minimization, layout calculations — use `findParent`/`findChild`/`findChildren` with custom events.

### Child Calls Parent

```js
// panel.js — child accesses parent coordinator
const createComponent = ({ el, self, findParent, settings, dispatchEvent, $ }) => ({
  getPanels() {
    return findParent('uiPanels');  // camelCase name, NOT tag name
  },
  minimize() {
    const panels = self.getPanels();
    settings.minimized = true;
    const index = panels.getPanelIndex(el);
    panels.setPanelMinimized(index);
  },
  startResize(event) {
    self.resizing.set(true);
    dispatchEvent('resizeStart', {
      initialSize: self.getCurrentFlex(),
      direction: settings.direction,
      startPosition: self.getPointerPosition(event),
    });
  },
});
```

*Source: `src/components/panels/panel.js`*

**`findParent('uiPanels')`** — the argument is the **camelCase component name**, not the tag name.

### Parent Listens via Event Delegation

```js
// panels.js — parent delegates on child custom events
const events = {
  'rendered ui-panel'({ self, event }) {
    if (inArray(event.target, self.panels)) {
      self.setPanelRendered(event.target);
    }
  },
  'resizeStart ui-panel'({ self, event, data }) {
    if (inArray(event.target, self.panels)) {
      self.setGroupCalculations();
      self.setDragStartCalculations(event.target, data);
    }
  },
  'resizeDrag ui-panel'({ self, event, data }) {
    if (inArray(event.target, self.panels)) {
      requestAnimationFrame(() => {
        self.setPointerCalculations(event.target, data);
        self.resizePanels(self.cache.resizeIndex, self.cache.resizeDelta);
        self.setEndPointerCalculations();
      });
    }
  },
};
```

*Source: `src/components/panels/panels.js`*

The parent's template is just a slot — all structure is consumer-provided:

```html
<!-- panels.html -->
<div class="{direction} panels" part="panels">{>slot}</div>
```

### Parent Discovers Children Imperatively

```js
// panels.js — parent finds direct children, excluding nested panel groups
addPanels() {
  let $childPanelGroups = $(el).find('ui-panels');
  let $childPanelGroupPanels = $childPanelGroups.find('ui-panel');
  let $allPanels = $(el).find('ui-panel');
  self.panels = $allPanels.not($childPanelGroupPanels).get();
},
```

*Source: `src/components/panels/panels.js`*

When `<ui-panels>` can nest other `<ui-panels>`, the parent must exclude grandchildren.

### SSR Limitation

**Pattern 3 does not work during SSR.** Guard all imperative coordination with `isServer`:

```js
// ❌ WRONG — crashes during SSR
const onRendered = ({ self }) => { self.getPanels().recalculate(); };

// ✅ RIGHT
const onRendered = ({ self, isServer }) => {
  if (isServer) return;
  self.getPanels().recalculate();
};
```

### When to Use

Use client-only coordination when:
- The parent-child relationship involves imperative DOM operations (resize, drag, scroll sync)
- Layout calculations require measuring rendered dimensions
- The interaction model is too complex for declarative data flow
- SSR is not required for the component's fundamental rendering

---

## Cross-Cutting Techniques

These techniques appear across all three patterns. They are not separate patterns — they are tools you reach for within whichever pattern you choose.

### CSS Variables for Parent-to-Child Theming

Parent sets CSS custom properties on children; children reference them in their own stylesheets. This works across Shadow DOM because CSS variables inherit.

```css
/* selection.css — parent type sets vars on both render paths */
.selection.menu {
  ::slotted(*),
  menu-item {
    --menu-item-padding: var(--menu-selection-item-padding);
    --menu-item-border-radius: var(--menu-selection-item-border-radius);
    --menu-item-color: var(--menu-selection-item-color);
    --menu-item-hover-background: var(--menu-selection-item-hover-background);
    --menu-item-active-background: var(--menu-selection-item-active-background);
  }
}
```

*Source: `src/primitives/menu/css/definition/types/selection.css`*

Target both `::slotted(*)` (composition path) and the child tag directly (configuration path). The child reads `var(--menu-item-padding)` in its own CSS.

```css
/* ❌ WRONG — parent styles child internals directly */
.selection.menu menu-item .label { padding: 8px; }

/* ✅ RIGHT — parent sets CSS vars, child reads them */
.selection.menu menu-item { --menu-item-padding: 8px; }
```

### pageCSS for Document-Scope CSS

`pageCSS` injects styles into the **document** (once per component definition, not per instance). Use it for CSS that Shadow DOM cannot express:

- **`::slotted()` depth** — `::slotted()` only targets direct slot children. `pageCSS` reaches any light DOM depth.
- **CSS Houdini `@property`** — `@property` declarations don't work inside Shadow DOM. Required for dynamic container breakpoints where typed `<length>` properties enable `@container style()` queries (see `card-page.css`, `card/css/definition/variations/stackable.css`).

```js
import pageCSS from './menu-page.css?raw';
defineComponent({ tagName: 'ui-menu', css, pageCSS, ... });
```

```css
/* ❌ WRONG — ::slotted() cannot target descendants */
::slotted(tr td) { padding: var(--cell-padding); }

/* ✅ RIGHT — pageCSS targets any light DOM depth */
ui-table tr td { padding: var(--cell-padding); }

/* ❌ WRONG — @property inside Shadow DOM (silently ignored) */
@property --flag { syntax: "<length>"; inherits: true; initial-value: 1px; }

/* ✅ RIGHT — @property in pageCSS (document scope) */
/* Then @container style(--flag: 0) works in shadow DOM css */
```

### `deep` Events for Shadow-Piercing Interaction

Without `deep`, event handlers only hear events from the component's own Shadow DOM. With `deep`, clicks inside child Shadow DOMs pierce through:

```js
'deep click menu-item'({ self, value }) { ... }  // hears clicks inside menu-item's shadow root
```

*Source: `src/primitives/menu/menu.js`* | For full event DSL coverage, see `component-events`.

### `$$()` for Attribute-Based State Coordination

Parent queries children with `$$` across shadow boundaries, then sets attributes. Children style themselves via attribute selectors in their own CSS — the parent never reaches into child internals.

```js
// menu.js — selectValue sets active attribute on the matching child
const $items = $$(el).find('menu-item');
$items.removeAttr('active');
$items.eq(findIndex($items.val(), value)).attr('active', '');
```

```js
// ❌ WRONG — reaching into child shadow DOM to toggle classes
$$('menu-item').find('.inner').toggleClass('active');

// ✅ RIGHT — set attributes on the child element, child CSS reacts
$$('menu-item').removeAttr('active');
$$('menu-item').eq(index).attr('active', '');
```

---

## Common Mistakes

### Picking client-only when hybrid would work

```js
// ❌ WRONG — imperative coordination for a simple list
const createComponent = ({ findChild }) => ({
  setActive(index) {
    findChild('menuItem', index).activate();
  },
});

// ✅ RIGHT — data-driven: set value, template reacts
const createComponent = ({ settings }) => ({
  setActive(value) {
    settings.value = value;
  },
});
```

### Forgetting both paths in the hybrid template

```html
<!-- ❌ WRONG — only handles configuration, no slot fallback -->
{#each item in items}
  <menu-item>{item.label}</menu-item>
{/each}

<!-- ✅ RIGHT — hybrid handles both paths -->
{#each item in items}
  <menu-item>{item.label}</menu-item>
{else}
  {>slot}
{/each}
```

### Using findParent with the tag name

```js
// ❌ WRONG — tag name
findParent('ui-panels')

// ✅ RIGHT — camelCase component name
findParent('uiPanels')
```

### Missing SSR guard on client-only coordination

```js
// ❌ WRONG — crashes during SSR
selectValue(value) { $$(el).find('menu-item').removeAttr('active'); }

// ✅ RIGHT — guard with isServer
selectValue(value) {
  if (isServer) return;
  $$(el).find('menu-item').removeAttr('active');
}
```

---

## Quick Reference

| Pattern | Skeleton | SSR? |
|---------|----------|------|
| **Hybrid** | `{#each items}...{else}{>slot}{/each}` | Yes |
| **Template-as-settings** | `defaultSettings: { rowTemplate: new Template() }` + `{> template name=rowTemplate data=row}` | Yes |
| **Client-only** | `findParent('uiPanels')` + `dispatchEvent()` + event delegation | No |

| Technique | What it does | When |
|-----------|-------------|------|
| CSS vars on `::slotted(*)`/child tag | Parent themes child | Type/variation styling |
| `pageCSS` | Document-level styles | `::slotted()` depth limitation |
| `deep` event modifier | Hear events from child shadow DOMs | Click/pointer on nested components |
| `$$().attr()` | Set attributes across shadow boundaries | Active state, selection |

---

## Related Skills

| Skill | Use when... |
|-------|-------------|
| `component-authoring` | Building a component from scratch — file structure, createComponent, lifecycle |
| `component-events` | Event DSL details — `deep`, `global`, delegation syntax |
| `component-css` | Shadow DOM CSS patterns, `::slotted()`, CSS layers |
| `component-patterns` | Race conditions, cleanup, async reactions, drag patterns |
| `mental-model` | Core framework concepts — Template abstraction, reactivity, specs |

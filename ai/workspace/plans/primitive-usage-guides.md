# Primitive Usage Guide Pages

## Context

Primitive docs currently have tabs for **Definition** (singular/plural) and **Spec**. These are exhaustive, spec-driven pages. Missing is a **Usage** tab — a scrollable, editorial page where developers learn how to use the component. This is where the bulk of time will be spent.

The definition page is the visual catalog ("review every variation one by one"). The usage page is the learning surface ("how do I use this component").

### Design Decisions

- **Usage tab is the landing tab** — `tabs[0]`, where new users start
- **Single scrollable page** with a jump menu (rail nav) — not sub-tabs
- **80% auto-generated** from the spec (imports, settings table, events, basic examples)
- **20% authored** via MDX body — editorial content, custom previews, design guidance
- **Default template** handles most primitives; odd-ducks (icon, input) can override sections or go fully custom
- **Exposed via MCP** for agent consumption — same content, rendered as markdown
- **CSS tab is separate** — the CSS theming surface is deep enough to warrant its own tab
- **Definition and spec tabs unchanged** — they work well as-is

### Tab Structure

```
tabs: ['usage', 'singular', 'plural', 'css', 'spec']
```

| Tab | Purpose | Content Source |
|-----|---------|---------------|
| **Usage** | Learn the component — progressive, editorial | Auto-generated scaffold + authored MDX body |
| **Definition** (singular) | Visual catalog — every type/state/variation rendered | Auto-generated from `getDefinition()` |
| **Definition** (plural) | Visual catalog for plural component | Auto-generated from `getDefinition({ plural })` |
| **CSS** | Theming reference — variables, parts, layers, tokens | Auto-extracted from CSS + authored guidance |
| **Spec** | Raw machine-readable spec viewer | Auto-generated from spec object |

---

## Architecture

### Content Layer

The existing MDX content entries (`docs/src/content/primitives/button.mdx`) gain two roles:

1. **Frontmatter** — already defines tabs, specName, etc. Add `usage` to tabs array.
2. **MDX body** — currently empty. Becomes the authored editorial content for the usage tab.

```yaml
# button.mdx
id: 'button'
title: 'Button'
specName: 'ButtonSpec'
tabs: ['usage', 'singular', 'plural', 'spec']
description: 'A button indicates a possible user action'
tags: ['web-component']
```

MDX body contains authored sections that slot into the auto-generated scaffold. Sections use standard markdown headings that the template can identify and position.

### Component Structure

```
docs/src/components/
├── SpecDefinition.astro      # existing — definition tab renderer
├── SpecViewer.astro           # existing — spec tab renderer
├── UsageGuide.astro           # NEW — usage tab orchestrator
├── usage/                     # NEW — auto-generated section components
│   ├── UsageHero.astro        #   hero example + description
│   ├── UsageImports.astro     #   import snippets per framework
│   ├── UsageSettingsTable.astro  # settings reference table
│   ├── UsageEventsTable.astro    # events reference table
│   └── UsageCSSReference.astro   # CSS variables and ::part() reference
```

### Route Handler Changes

`docs/src/pages/ui/primitives/[...slug].astro`:

```astro
---
// ... existing imports ...
import UsageGuide from '@components/UsageGuide.astro';

const displayedTab = tab || data.tabs[0]; // now defaults to 'usage'
const usageDisplayed = (displayedTab === 'usage');

// For usage tab, render the MDX body
let Content;
if (usageDisplayed) {
  const rendered = await entry.render();
  Content = rendered.Content;
}

// Rail menu changes per tab
let railMenu = [];
if (definitionDisplayed) {
  railMenu = componentSpec.getDefinitionMenu({ plural });
} else if (usageDisplayed) {
  railMenu = getUsageMenu(spec, { hasContent: !!entry.body });
}
---
<Definition ...>
  {usageDisplayed && (
    <UsageGuide
      spec={spec}
      componentName={componentName}
      name={data.title}
    >
      <Content />
    </UsageGuide>
  )}
  {definitionDisplayed && (
    <SpecDefinition ... />
  )}
  {displayedTab === 'spec' && (
    <SpecViewer spec={spec} />
  )}
</Definition>
```

---

## Usage Tab Sections (Default Template)

The `UsageGuide.astro` component renders sections in this order. Each section is auto-generated from the spec unless the MDX body provides an override.

### 1. Hero / Getting Started
- Component description
- Simplest possible example (tag + default content)
- Source: spec `tagName`, `description`

### 2. Import / Setup
- HTML: just use the tag, no import needed
- ES module: `import { UIButton } from '@semantic-ui/core'`
- React/Vue/Angular: framework-specific wrapper patterns
- Source: spec `tagName`, `exportName`

### 3. Authored Content (slot)
- The MDX body renders here — editorial prose, custom preview components, composition patterns, design guidance
- For primitives with no MDX body, this section is omitted
- For odd-ducks like icon, this is the bulk of the page

### 4. Types Overview
- Brief overview of available types with one example each
- Links to definition tab for exhaustive visual catalog
- Source: spec `types`, filtered by `usageLevel`

### 5. Common Variations
- Key variations grouped by `usageLevel` (1-2 shown, 3+ mentioned)
- Links to definition tab for full gallery
- Source: spec `variations`

### 6. Settings Reference Table
- Auto-generated table: name, attribute, type, default, description
- Source: spec `settings`

### 7. Events Reference Table
- Auto-generated table: event name, description, arguments
- Source: spec `events`

### 8. Accessibility
- Keyboard interactions (if defined)
- ARIA roles auto-applied
- Source: partially auto-generated, partially authored

---

## Jump Menu (Rail Nav)

The usage tab rail menu is built from the section structure:

```javascript
function getUsageMenu(spec, { hasContent }) {
  const menu = [
    { text: 'Getting Started', id: 'getting-started' },
    { text: 'Import', id: 'import' },
  ];
  if (hasContent) {
    // Parse MDX headings for authored sections
    // and insert them here
  }
  if (spec.types?.length) {
    menu.push({ text: 'Types', id: 'types' });
  }
  if (spec.variations?.length) {
    menu.push({ text: 'Variations', id: 'variations' });
  }
  if (spec.settings?.length) {
    menu.push({ text: 'Settings', id: 'settings' });
  }
  if (spec.events?.length) {
    menu.push({ text: 'Events', id: 'events' });
  }
  menu.push({ text: 'CSS', id: 'css' });
  return menu;
}
```

---

## MCP Exposure

The usage guide should be accessible to agents through the existing MCP infrastructure.

### Option A: Flag on `get_component`
```
get_component('button', { guide: true })
```
Returns the spec + rendered markdown of the usage guide. The auto-generated sections render as markdown tables and code blocks. The authored MDX body is included as raw markdown.

### Option B: Through `get_user_doc`
```
get_user_doc('ui/primitives/button/usage')
```
Follows the existing pattern for user docs. The usage guide is just another user doc, scoped to a component.

**Recommendation**: Option B — it's consistent with how all other guides are accessed. The spec stays lean via `get_component`, and agents who want the editorial guide pull it separately. An agent generating a button doesn't need the usage guide; an agent building a page layout might.

---

## CSS Tab

The CSS theming surface is deep enough to warrant its own tab. Button alone has 77 CSS files across two parallel trees (`theme/` variables and `definition/` structural CSS), organized by the same categories as the spec.

### Auto-Extraction from CSS Layers

The barrel file `css/theme/button-theme.css` is a complete index:

```css
@import url('./types/emphasis-variables.css') layer(button.theme.types.emphasis);
@import url('./states/hover-variables.css') layer(button.theme.states.hover);
@import url('./variations/sizing-variables.css') layer(button.theme.variations.sizing);
```

Each line gives us:
1. **Layer name** → maps 1:1 to the spec entry (e.g., `button.theme.types.emphasis`)
2. **File path** → the variables file to parse
3. **Category** → types / states / variations / content (from the layer name)

Parsing each imported file extracts every `--button-*` variable with its default value. Since defaults reference design tokens (`var(--primary-color)`, `var(--hover-lightness)`), we can show the token chain.

This means the CSS variable catalog is **fully auto-generated** — no manual authoring needed. The data can be organized per spec section, so the CSS tab mirrors the definition tab's structure but shows theming variables instead of visual examples.

### CSS Tab Sections

1. **Overview** — brief intro to the theming model (variables override at `:host`, layers control cascade)
2. **Per-section variable tables** — auto-generated from barrel file parsing:
   - Types (emphasis, styled, link, toggle, animated, ...)
   - States (hover, focus, pressed, active, disabled, loading)
   - Variations (sizing, colored, compact, attached, ...)
   - Content (icon, badge, label, ...)
3. **`::part()` reference** — exposed shadow DOM parts (extractable from the component template)
4. **Theming patterns** (authored) — how to override variables at component/container/instance scope, the OKLCH color manipulation pattern, dark mode behavior

### Variable Table Format (per section)

| Variable | Default | Token | Description |
|----------|---------|-------|-------------|
| `--button-primary-color` | `var(--primary-color)` | `--primary-color` | Base color for primary emphasis |
| `--button-primary-color-hover` | `oklch(from ... calc(l + var(--hover-lightness)) ...)` | `--hover-lightness` | Hover state derived via OKLCH |

### Build-Time Extraction

A build script or Astro integration parses each primitive's barrel CSS file at build time:

```javascript
// Pseudocode
function extractThemeVariables(componentName) {
  const barrelPath = `src/primitives/${componentName}/css/theme/${componentName}-theme.css`;
  const barrel = readFile(barrelPath);
  const sections = {};

  for (const { url, layer } of parseImports(barrel)) {
    const vars = parseCSSVariables(readFile(resolve(url)));
    const category = layer.split('.')[2]; // 'types', 'states', etc.
    const name = layer.split('.')[3];     // 'emphasis', 'hover', etc.
    sections[category] ??= {};
    sections[category][name] = vars;
  }

  return sections;
}
```

### Theme Spec Build Step

The CSS variable extraction should be part of the existing spec build pipeline. Just as `button.spec.js` compiles to `button.spec.json` and `button.component.js`, the CSS barrel file compiles to a theme spec:

```
src/primitives/button/specs/
├── button.spec.js          # source spec (authored)
├── button.spec.json        # compiled spec (auto-generated)
├── button.component.js     # runtime componentSpec (auto-generated)
├── button.theme.json       # NEW: compiled CSS variables (auto-generated)
```

The theme spec is structured by the same categories as the component spec. Variables store their **inheritance tree** (which variables they depend on), not raw CSS values. This reveals the override points without exposing implementation details like OKLCH color math.

```json
{
  "types": {
    "emphasis": {
      "layer": "button.theme.types.emphasis",
      "variables": {
        "--button-primary-color": {
          "inherits": ["--primary-color"]
        },
        "--button-primary-color-hover": {
          "inherits": ["--button-primary-color", "--hover-lightness"]
        },
        "--button-primary-text-color": {
          "inherits": ["--button-inverted-text-color"]
        },
        "--button-primary-box-shadow": {
          "inherits": ["--button-colored-box-shadow"]
        }
      }
    }
  },
  "states": {
    "hover": {
      "layer": "button.theme.states.hover",
      "variables": { ... }
    }
  },
  "variations": {
    "sizing": {
      "layer": "button.theme.variations.sizing",
      "variables": {
        "--button-mini": { "inherits": ["--mini"] },
        "--button-small": { "inherits": ["--small"] },
        "--button-medium": { "value": "inherit" },
        "--button-large": { "inherits": ["--large"] }
      }
    }
  }
}
```

**Why inheritance trees, not resolved values:**
- An agent or themer needs to know the override point, not the color math
- `"inherits": ["--button-primary-color", "--hover-lightness"]` tells you: override the inputs, the derived state follows automatically
- Reveals the layering: global tokens (`--primary-color`) → component tokens (`--button-primary-color`) → derived states (`--button-primary-color-hover`)
- Variables with `"value": "inherit"` have no token dependency (they use CSS `inherit`)
- Keeps the theme spec compact — no verbose OKLCH/calc expressions
```

This serves three consumers:
1. **Docs CSS tab** — auto-generates the variable reference tables
2. **MCP/agents** — `get_component('button', { theme: true })` or a dedicated endpoint
3. **Tooling** — IDE autocomplete, linters, etc. can consume the JSON

The build script parses the barrel file (`button-theme.css`), follows each `@import`, extracts `--button-*` variable declarations from each target file, and writes the structured JSON.

### Relation to Definition Tab

The definition tab shows each variation rendered visually. The CSS tab shows the same variations but from the theming perspective — which variables control the appearance, what tokens they derive from, how to override them. A "View CSS" link from each definition example to the corresponding CSS tab section would tie them together.

---

## Odd-Duck Handling

Components like `icon` have usage guides that don't follow the standard template:

- Icon sets, rendering modes (mask, image, font)
- Creating custom icons
- `couplesWith` story (how icons work inside other components)

### Approach: MDX Body Dominance

If the MDX body is substantial, the auto-generated sections become secondary. The component can control this via frontmatter:

```yaml
# icon.mdx
guide: custom  # skip default template, render MDX body as full page
```

Or more granularly:
```yaml
# icon.mdx
guideSections:
  hero: true        # still auto-generate hero
  imports: true     # still auto-generate imports
  types: false      # skip — covered in authored content
  variations: false # skip — covered in authored content
  settings: true    # still auto-generate settings table
  events: true      # still auto-generate events table
```

**Simpler approach**: The default template checks if the MDX body contains headings that match auto-generated section names. If the authored content has a `## Types` section, the auto-generated types section is skipped. Convention over configuration.

---

## Implementation Phases

### Phase 1: Usage Tab Infrastructure
- [ ] Add `UsageGuide.astro` component with auto-generated sections
- [ ] Update route handler to support `usage` tab
- [ ] Build `getUsageMenu()` for rail navigation
- [ ] Add `usage` to tab arrays in content entries
- [ ] Build auto-generated section components (hero, imports, settings table, events table)

### Phase 2: Usage Tab Default Template Polish
- [ ] Settings table component with proper formatting
- [ ] Events table component
- [ ] Types overview with `usageLevel` filtering
- [ ] Variations overview with grouping
- [ ] Framework import snippets (HTML, React, Vue, Angular)

### Phase 3: CSS Tab + Theme Spec
- [ ] Build barrel CSS parser (extract `@import` lines, follow paths, parse `--*` declarations)
- [ ] Add theme spec generation to existing spec build pipeline (`button.theme.json`)
- [ ] Build `CSSReference.astro` component consuming theme spec JSON
- [ ] Extract `::part()` names from component templates
- [ ] Add `css` to tab arrays in content entries
- [ ] Update route handler to support `css` tab
- [ ] Build `getCSSMenu()` for rail navigation (mirrors spec categories)
- [ ] Cross-link definition tab examples to CSS tab sections
- [ ] Expose theme spec via MCP (flag on `get_component` or dedicated endpoint)

### Phase 4: Authored Content
- [ ] Write editorial content for key primitives (button, input, menu)
- [ ] Build custom usage guide for icon
- [ ] Add MDX heading detection for section override logic
- [ ] Write CSS theming guidance (OKLCH patterns, override strategies)

### Phase 5: MCP Integration
- [ ] Expose usage guides via `get_user_doc` endpoint
- [ ] Expose CSS reference as structured data via MCP (for agents doing theming)
- [ ] Auto-generate markdown from the same template for agent consumption
- [ ] Test agent workflow: spec for generation, guide for design decisions

---

## Open Questions

1. **Framework snippets** — How much framework integration detail? Just import, or full usage pattern per framework?
2. **Settings table scope** — Include all spec sections (types, states, variations) as a flat attribute table, or just `settings` and `events`?
3. **Content entry format** — Single MDX file with body, or separate file per tab (`button/usage.mdx`)?
4. **Existing definition page as default** — Should `usage` immediately become `tabs[0]`, or wait until content is authored?
5. **CSS tab editorial split** — How much theming guidance goes on the CSS tab vs the existing `style-components` context doc?
6. **`::part()` extraction** — Parse from component HTML template at build time, or maintain a list in the spec?

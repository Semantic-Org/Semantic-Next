# Semantic UI: The Unified Architecture

> A document capturing how specs, CSS, tooling, and runtime form a single coherent system.

## The Core Insight

Semantic UI isn't a component library with documentation. It's a **single source of truth** (the spec) that manifests in multiple forms:

- JavaScript runtime configuration
- CSS file structure
- CSS layer names (queryable at runtime)
- HTML examples
- Documentation
- AI/MCP tooling
- TypeScript types

Every access pattern uses the same structure. Learn the spec, and you can navigate any layer.

## The Spec as Contract

A spec like `button.spec.js` defines:

```javascript
{
  name: 'Button',
  tagName: 'ui-button',
  types: ['emphasis', 'styled', 'link', ...],
  states: ['hover', 'active', 'disabled', ...],
  variations: ['size', 'color', 'compact', ...],
  // ...
}
```

This is **not documentation** - it's a **contract** that drives everything else.

## Four Manifestations, One Structure

### 1. Runtime Configuration (`.component.js`)

Generated from the spec, consumed by `defineComponent()`:

```javascript
// button.component.js (generated)
{
  optionAttributes: {
    "large": "size",      // large → size variation
    "red": "color",       // red → color variation
    "primary": "emphasis" // primary → emphasis type
  },
  variations: ["size", "color", "compact", ...],
  states: ["hover", "active", "disabled", ...],
  // ...
}
```

The component uses this to:
- Validate attributes
- Map shorthand to canonical form (`large` → `size="large"`)
- Generate CSS classes
- Support all three dialects (standard, classic, verbose)

### 2. CSS File Structure

The file tree mirrors the spec exactly:

```
css/theme/
├── content/
│   └── button-variables.css      # Base component tokens
├── types/
│   ├── emphasis-variables.css    # spec.types[].attribute
│   ├── styled-variables.css
│   └── link-variables.css
├── states/
│   ├── hover-variables.css       # spec.states[].attribute
│   ├── active-variables.css
│   └── disabled-variables.css
└── variations/
    ├── size-variables.css        # spec.variations[].attribute
    ├── color-variables.css
    └── compact-variables.css
```

**The spec attribute name IS the filename.** No mapping table needed.

### 3. CSS Layer Names

Every CSS file is imported into a named layer:

```css
@import url('./types/emphasis-variables.css') layer(button.theme.types.emphasis);
@import url('./states/hover-variables.css') layer(button.theme.states.hover);
@import url('./variations/size-variables.css') layer(button.theme.variations.size);
```

Layer naming convention: `{component}.{definition|theme}.{category}.{attribute}`

**These names survive compilation.** In the browser, you can query the CSSOM by layer name to extract CSS for any spec attribute.

### 4. HTML Examples

SpecReader generates HTML from the spec:

```javascript
reader.getDefinition()
// Returns structured examples:
{
  types: [{
    title: 'Emphasis',
    examples: [{
      code: '<ui-button primary>Confirm</ui-button>',
      components: [{
        componentName: 'ui-button',
        attributes: { emphasis: 'primary' },
        attributeString: ' primary',
        html: 'Confirm'
      }]
    }]
  }]
}
```

The HTML is derived from the spec. The spec is the source of truth.

## The Query Loop

Given any HTML, you can trace back to the CSS that controls it:

```
<ui-button large red>
        │
        ▼
┌─────────────────────────────────────┐
│  Parse: attributes = [large, red]   │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│  componentSpec.optionAttributes:    │
│    large → size                     │
│    red → color                      │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│  componentSpec.variations:          │
│    includes 'size' ✓                │
│    includes 'color' ✓               │
│  category = 'variations'            │
└─────────────────────────────────────┘
        │
        ├──────────────────────────────────┐
        ▼                                  ▼
┌─────────────────────┐    ┌─────────────────────────────┐
│  SERVER-SIDE:       │    │  CLIENT-SIDE:               │
│  Read file:         │    │  Query CSSOM:               │
│  css/theme/         │    │  layer(button.theme.        │
│    variations/      │    │    variations.size)         │
│    size-variables   │    │  layer(button.theme.        │
│    .css             │    │    variations.color)        │
└─────────────────────┘    └─────────────────────────────┘
        │                                  │
        └──────────────┬───────────────────┘
                       ▼
        ┌─────────────────────────────┐
        │  Result: CSS custom         │
        │  properties that control    │
        │  this element               │
        └─────────────────────────────┘
```

## Access Patterns

| Context | Query Method | Structure Source |
|---------|--------------|------------------|
| Build/Server | File path | `css/theme/{category}/{attribute}-variables.css` |
| Browser/Runtime | CSSOM | `layer({component}.theme.{category}.{attribute})` |
| MCP/AI | Tool call | Uses spec + file path or CSSOM |
| Docs | SpecReader | `getDefinition()` → examples → attributes |
| DevTools | Element inspection | Tag name → spec → layer query |

All five methods use the same underlying structure. The spec is the Rosetta Stone.

## The Descriptivist Foundation

The specs aren't invented - they're derived from **empirical research** across the JavaScript UI ecosystem:

- Material UI, Chakra, Radix, Mantine, Ant Design, Vuetify, etc.
- Document what patterns **actually exist** across successful implementations
- Find convergent patterns → codify as spec
- Usage levels reflect **observed frequency**, not opinion

This is descriptive linguistics applied to UI components. The spec documents the industry's consensus API.

Open UI (W3C) attempted this but produced sparse, incomplete documentation. Semantic UI's research is comprehensive and actionable.

## Why This Matters

### For Users
- Natural language attributes (`<ui-button large primary>`)
- Predictable theming (spec attribute = CSS file = layer name)
- No specificity wars (layers control cascade)
- Three dialects, same behavior (standard, classic, verbose)

### For AI/Tooling
- Specs are machine-readable contracts
- HTML → CSS query is mechanical, not heuristic
- MCP tools can answer "what controls this?" definitively
- Devtools can introspect theming at runtime

### For Maintainers
- Single source of truth (change spec, everything follows)
- Generated files are derived, not maintained
- Research-backed decisions (not "I think buttons should...")
- Extensible without breaking conventions

### For the Ecosystem
- Reference implementation of industry patterns
- Specs could inform future web standards
- Pattern research methodology is reproducible
- Framework-agnostic utilities (reactivity, query, templating)

## The Tooling Vision

Because the architecture is uniform, tooling becomes trivial:

### MCP Tool: `get_theming_css`
```
Input: <ui-button large red>Submit</ui-button>
Output: CSS variables for size + color variations
```

### VS Code Extension
Hover over any Semantic UI element → see theming variables in tooltip

### Browser DevTools Panel
Inspect element → "Theming" tab shows:
- Which CSS variables control this element
- Current values
- Global token references
- Override suggestions

### Docs "Customize" Tab
Every example has a tab showing:
- Relevant CSS variables
- How to override them
- Which global tokens they reference

### CLI Tool
```bash
sui theme ./my-page.html
# Outputs all theming CSS for every SUI component in the file
```

All of these are thin wrappers around the same query: **spec attribute → CSS**.

## Historical Context

The original Semantic UI (2013-2018) pioneered natural language CSS classes and comprehensive theming. But it was jQuery-based, documentation was separate from implementation, and the maintenance burden fell on one person.

This rewrite (2023-present) preserves the philosophy while fixing the architecture:

| Classic SUI | Next SUI |
|-------------|----------|
| jQuery | Web Components + Signals |
| LESS variables | CSS Custom Properties |
| Manual documentation | Spec-generated docs |
| Tribal knowledge | Externalized in specs |
| Maintainer-dependent | Self-documenting architecture |

The goal: a framework that can be maintained by anyone who understands the spec system, not just the original author.

## Summary

Semantic UI's architecture is a single idea expressed consistently:

> **The spec is the source of truth. Everything else is a view.**

- Runtime config: view of spec
- CSS file structure: view of spec
- CSS layer names: view of spec
- HTML examples: view of spec
- Documentation: view of spec
- TypeScript types: view of spec
- AI tooling: queries against spec

Learn the spec structure once, navigate the entire system forever.

This isn't over-engineering - it's the minimum complexity required to make theming, documentation, and tooling all work correctly without manual synchronization. The alternative is drift, inconsistency, and maintenance burden.

Three years of architecture so that everything else is trivial.

# Semantic UI Usage Skills - Outline

**Author**: Claude (Orchestrator)
**Date**: 2025-01-09
**Status**: Phase 1 Complete - Ready for Authoring

---

## Overview

Three skills for using Semantic UI official components in websites:

| Skill | Command | Purpose |
|-------|---------|---------|
| Use Semantic UI | `/sui:use` | Core component usage |
| Style Semantic UI | `/sui:style` | CSS customization & theming |
| Integrate Semantic UI | `/sui:integrate` | Framework integration & SSR |

**Target Audience**: AI agents helping end users build websites with SUI components. NOT for authoring custom components - this is about USING the shipped first-party UI framework.

**Core Principle**: LLMs already know web standards (HTML, DOM, events, slots, CSS variables). This skill covers ONLY what's SUI-specific.

---

## Skill 1: Use Semantic UI (`/sui:use`)

### Archetype: Hybrid (Procedural + Conceptual)

### Total Target: ~1100-1350 words

---

### Preamble (~150-200 words)

**Instructions when skill is invoked:**

1. **Detect codebase first**:
   - If **SUI source repo** (this repo): assume Query and SUI style guide — skip preference questions
   - If **React/Vue/Angular/Svelte**: note that `/sui:integrate` provides framework-specific guidance
2. **Check MCP availability** - Recommend Semantic UI MCP plugin if not detected (enables live spec access via `list_components`, `get_component`)
3. **Ask CSS preference** (unless SUI repo) - "SUI style guide, your own CSS, or Tailwind?" (for deep customization see `/sui:style`)
4. **Ask Query preference** (unless SUI repo) - "Use SUI's Query library or vanilla JS?"
   - **Query** (`$`, `$$`): jQuery-like convenience, shadow DOM piercing with `$$`, `.component()` for instance access, `.settings()` for configuration
   - **Vanilla JS**: Standard `querySelector`, `addEventListener`, direct property access - works fine, no extra dependency
   - Skill examples will use chosen approach

**Scope statement**: This skill covers using SUI's official components. For CSS customization see `/sui:style`. For framework integration and SSR see `/sui:integrate`.

---

### Section 1: Specs Are the Source of Truth (~400-500 words)

THE core concept that differentiates SUI.

**Key points:**
- Every component is defined by a JSON spec
- MCP tools: `list_components`, `get_component`, `search`
- **Golden rule: If it's not in the spec, don't use it**

**Spec field reference:**

| Field | Meaning |
|-------|---------|
| `tagName` | Exact element name - use as-is, never infer |
| `content` | Slots and content attributes (supports 3 syntaxes) |
| `types` | Mutually exclusive variants (pick one) |
| `states` | Runtime states (disabled, loading, active) |
| `variations` | Stackable visual options (combine freely) |
| `settings` | Properties with types and defaults |
| `events` | Custom events emitted |
| `methods` | Imperative methods available |

**Plural container inheritance:**

Plural containers (`<ui-buttons>`, `<ui-cards>`) apply variations that cascade to children - but only those defined in spec:

```html
<ui-buttons size="small" color="blue">
  <ui-button>One</ui-button>  <!-- inherits small, blue -->
  <ui-button>Two</ui-button>  <!-- inherits small, blue -->
</ui-buttons>
```

| Spec Field | Meaning |
|------------|---------|
| `pluralSharedVariations` | Applied on parent, inherited by children |
| `pluralOnlyVariations` | Only valid on parent (e.g., `equal-width`, `stackable`) |
| `pluralSharedTypes` | Types that can be set on parent |

```html
<!-- equal-width is plural-only -->
<ui-buttons equal-width="three">
  <ui-button>One</ui-button>
  <ui-button>Two</ui-button>
  <ui-button>Three</ui-button>
</ui-buttons>
```

One minimal example showing spec → markup translation.

---

### Section 2: SUI-Specific Syntax (~300-400 words)

Patterns unique to SUI that differ from standard HTML/web components.

**Three attribute dialects** - all equivalent:
```html
<ui-button size="large">   <!-- verbose: attribute="value" -->
<ui-button large>          <!-- concise: just the value -->
<ui-button class="large">  <!-- classic: CSS class (v2 compat) -->
```

**Three content syntaxes** - for spec's `content` fields:
```html
<ui-card header="Title">                     <!-- attribute (strings only) -->
<ui-card><div class="header">Rich HTML</div> <!-- class (rich content) -->
<ui-card><div slot="header">Rich HTML</div>  <!-- slot (web component standard) -->
```

Use **attribute** for simple strings, **class** or **slot** for rich HTML.

**Value fuzzing** - flexible value formats:
```html
<ui-button icon="right arrow">   <!-- spaces -->
<ui-button icon="arrow-right">   <!-- kebab -->
<ui-button icon="right-arrow">   <!-- reversed kebab -->
<!-- All resolve to the same canonical value -->
```

**Compound aliases** - disambiguate when attributes share option values:
```html
<ui-segment size-small>    <!-- size="small" -->
<ui-segment padding-small> <!-- padding="small" -->
<!-- Order flexible: small-size also works -->
```

---

### Section 3: Functions and Complex Data (~200-250 words)

Standard attributes handle strings/numbers. For functions or complex objects:

**With Query:**
```js
// settings() - after component is in DOM
$('ui-dropdown').settings({
  onChange: (value) => handleChange(value),
  items: [{ text: 'One', value: 1 }]
});

// initialize() - before/during DOM insertion
$('ui-modal').initialize({ closeable: false });

// Access component instance for methods
$('ui-modal').component().show();
```

**With vanilla JS:**
```js
// Set properties directly on element
const dropdown = document.querySelector('ui-dropdown');
dropdown.onChange = (value) => handleChange(value);
dropdown.items = [{ text: 'One', value: 1 }];

// Access component instance (.component property on element)
const modal = document.querySelector('ui-modal');
modal.component.show();
```

**Note:** Query's `.component()` method and vanilla's `.component` property access the same thing - Query just wraps `el.component`.

**When to use each:**
- `settings()` / direct properties - component already in page
- `initialize()` - setting up before insertion, batch configuration
- JSON in attributes - `items='[{"text":"One"}]'` works but verbose

---

### Section 4: Everything Else is Web Standards (~100-150 words)

Quick pointers - standard web patterns apply:

- **Events**: Check spec's `events` array
  - Query: `$('ui-modal').on('show', handler)`
  - Vanilla: `element.addEventListener('show', handler)`
  - Data in `event.detail`
- **Methods**: Check spec's `methods` array → call on `$().component()` or `el.component`
- **Slots**: Standard `<div slot="name">` syntax
- **Properties**: Attributes reflect as properties (`el.disabled = true`)
- **Theming**: Set `<html dark>` or `<html light>` - components auto-adapt

---

### Explicitly Excluded

- Creating custom components → different skill
- Deep CSS token system → `/sui:style`
- Framework wrappers, SSR → `/sui:integrate`
- Template syntax internals
- Reactivity system internals

---

## Skill 2: Style Semantic UI (`/sui:style`)

### Archetype: Conceptual
### Status: Outline only (future work)

1. **CSS Override Strategies** - CSS variables on instances/containers, `::part()`
2. **Design Token System** - `--standard-*`, `--inverted-*`, em-based sizing, color scales
3. **Theming** - Light/dark mode, automatic adaptation, style queries
4. **CSS Style Guide Patterns** - Nesting, container queries, state management
5. **Tailwind Integration** - TailwindPlugin, font-size considerations
6. **Shadow DOM Considerations** - What can/cannot be styled externally

---

## Skill 3: Integrate Semantic UI (`/sui:integrate`)

### Archetype: Procedural
### Status: Outline only (future work)

1. **Installation & Setup** - NPM, CDN, import patterns
2. **Framework Integration** - React 19+, Vue, Angular, Svelte, Lit specifics
3. **Wrapper Patterns** - When to wrap vs use directly
4. **Server-Side Rendering** - Lit SSR, `isClient`/`isServer`, slot limitations
5. **Common Gotchas** - Event bubbling, boolean attributes, serialization

---

## Next Steps

1. ✅ Phase 0: Scoping complete
2. ✅ Phase 1: Estimation complete
3. → Phase 2: Create skeleton document
4. Phase 3: Parallel subagent authoring
5. Phase 4: Review and finalize

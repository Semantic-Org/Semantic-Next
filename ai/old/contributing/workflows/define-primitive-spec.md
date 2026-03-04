---
title: Define Primitive Spec
description: Comprehensive guide for authoring valid primitive spec JavaScript modules that define component APIs, behaviors, variations, and documentation in Semantic UI.
keywords: [specs, primitives, JavaScript, API design, types, variations, states, documentation, shared terms]
audience: contributing
type: workflow
---

# Define Primitive Spec

**Purpose**: Guide AI agents to author complete, valid primitive spec `.spec.js` modules for Semantic UI primitives

## Overview

A primitive spec is a **JavaScript module** that exports a pure data object defining everything about a UI primitive: its API, behaviors, variations, and documentation. The build system transforms this source into generated outputs (`.spec.json` for tooling, `.component.js` for runtime). The `.spec.js` file is the single source of truth.

### File Pipeline

```
button.spec.js          ← You author this (JavaScript module)
    ↓ npm run build:ui-deps
button.spec.json         ← Generated: machine-readable JSON snapshot
button.component.js      ← Generated: optimized runtime spec for defineComponent
buttons.component.js     ← Generated: plural variant (if supportsPlural)
```

**Always edit `.spec.js` files. Never edit generated `.spec.json` or `.component.js` files.**

## Core Principles

1. **Be Exhaustive**: Machines should always be explicit and thorough. Include all fields even if they could be inferred.
2. **Types vs Variations**: Types are mutually EXCLUSIVE (pick one), Variations are mutually INCLUSIVE (stack many)
3. **Imperative Descriptions**: Use imperative mood without the noun ("be emphasized" not "button can be emphasized")
4. **Progressive Disclosure**: Use usage levels 1-5 to indicate feature commonality
5. **Dual Content Patterns**: Support both attribute and slot patterns when content can work either way
6. **Title Case Names**: All `name` fields must use Title Case (e.g., "Primary", "Top Attached", "Very Padded")
7. **Use Shared Terms**: Import reusable constants from `@semantic-ui/specs` instead of duplicating standard patterns

## Critical Rules

⚠️ **NEVER add fields to the spec that are not explicitly documented in this guide.** Only use the exact fields shown in the examples and field reference below. Do not invent new fields like `valueAttribute`, `defaultState`, `required`, or any other fields that seem logical but aren't documented here. The spec system has a precise schema - follow it exactly.

### Three Dialects — You Don't Need to Choose

Semantic UI automatically supports three attribute dialects from a single spec. You do **not** need to add separate boolean attribute definitions or decide between concise vs verbose syntax — the spec system generates support for all three:

```html
<!-- Standard: concise boolean attributes -->
<ui-button primary large>

<!-- Verbose: explicit attribute=value -->
<ui-button emphasis="primary" size="large">

<!-- Classic: class-based -->
<ui-button class="primary large">
```

The build system generates a reverse lookup map (`optionAttributes`) from your spec's `options` arrays that makes this work automatically. When you define `emphasis` with option `primary`, all three forms resolve to `emphasis="primary"` at runtime. **Just define the options correctly and the dialects take care of themselves.**

## JavaScript Formatting Conventions

Specs are JavaScript modules that export pure data. They must be JSON-serializable (no functions, dates, or regexes), but being JavaScript gives you:
- **Imports** from `@semantic-ui/specs` for shared terms
- **Template literals** for clean HTML examples (no escaping)
- **Computed values** like `COLOR_OPTIONS.map(...)` for generated examples

```javascript
// Single quotes for JavaScript strings
import { SIZE_VARIATION, getStates } from '@semantic-ui/specs';

export default {
  name: 'Button',
  tagName: 'ui-button',

  // Template literals for HTML examples (double quotes for HTML attributes)
  exampleCode: `<ui-button icon="pause">Pause</ui-button>`,
};
```

**Rules**:
- Single quotes for JS strings: `'Button'`, `'ui-button'`
- Double quotes for HTML attributes inside template literals: `icon="pause"`
- Template literals for multi-line HTML
- No string escaping needed

## Complete Spec Structure

```javascript
export default {
  // SECTION 1: Core Metadata (Required)
  uiType: 'element',
  name: 'ComponentName',
  description: 'A component that does something specific',
  tagName: 'ui-component-name',
  exportName: 'UIComponentName',

  // SECTION 2: Component Behavior (Required, can be empty arrays)
  content: [],
  types: [],
  states: [],
  variations: [],
  settings: [],
  events: [],

  // SECTION 3: Plural Support (Optional)
  supportsPlural: false,
  pluralName: 'ComponentNames',
  pluralTagName: 'ui-component-names',
  pluralExportName: 'UIComponentNames',
  pluralDescription: 'Components can exist together as a group',
  pluralContent: [],
  pluralSharedTypes: [],
  pluralSharedVariations: [],
  pluralSharedStates: [],
  pluralOnlyTypes: [],
  pluralOnlyVariations: [],

  // SECTION 4: Examples (Required for docs)
  examples: {
    defaultAttributes: {},
    defaultContent: '',
    defaultPluralContent: '',
  },
};
```

## Shared Terms System

The `@semantic-ui/specs` package provides reusable constants for standard patterns. **Always prefer shared terms over hand-writing standard options.**

### Available Constants

**Options** (arrays of option objects):
```javascript
SIZE_OPTIONS          // mini, tiny, small, medium, large, big, huge, massive
COLOR_OPTIONS         // red, orange, yellow, olive, green, teal, blue, violet, purple, pink, brown, grey, slate
FLOATED_OPTIONS       // left-floated, right-floated
ATTACHED_OPTIONS      // top-attached, attached, bottom-attached, left-attached, right-attached
COMPACT_OPTIONS       // compact, very-compact
PADDED_OPTIONS        // padded, very-padded
HORIZONTAL_ALIGNED_OPTIONS  // left-aligned, center-aligned, right-aligned
VERTICAL_ALIGNED_OPTIONS    // top-aligned, middle-aligned, bottom-aligned
EMPHASIS_OPTIONS      // primary, secondary, tertiary
```

**States** (complete state definitions):
```javascript
HOVER_STATE, FOCUS_STATE, ACTIVE_STATE, LOADING_STATE, PRESSED_STATE, DISABLED_STATE
```

**Types** (complete type definitions):
```javascript
EMPHASIS_TYPE
```

**Variations** (complete variation definitions):
```javascript
SIZE_VARIATION, FLUID_VARIATION, COMPACT_VARIATION, PADDED_VARIATION,
COLORED_VARIATION, FLOATED_VARIATION, ATTACHED_VARIATION,
HORIZONTAL_ALIGNED_VARIATION, VERTICAL_ALIGNED_VARIATION,
CIRCULAR_VARIATION, SPACING_VARIATION
```

### Helper Functions

**`getStates(stateNames)`** - Get multiple state constants by name:
```javascript
import { getStates } from '@semantic-ui/specs';

states: getStates(['hover', 'focus', 'active', 'disabled', 'loading']),
// Returns: [HOVER_STATE, FOCUS_STATE, ACTIVE_STATE, DISABLED_STATE, LOADING_STATE]
```

**`getVariations(variationNames)`** - Get multiple variation constants by name:
```javascript
import { getVariations } from '@semantic-ui/specs';

variations: [
  ...getVariations(['size', 'fluid', 'compact']),
  // Custom variations after...
],
```

**`modifyVariation(variation, overrides)`** - Override properties on a shared variation:
```javascript
import { ATTACHED_VARIATION, ATTACHED_OPTIONS, modifyVariation, addOptionExamples } from '@semantic-ui/specs';

modifyVariation(ATTACHED_VARIATION, {
  usageLevel: 3,
  options: addOptionExamples(ATTACHED_OPTIONS, {
    'top-attached': `
      <ui-button top-attached>Top Action</ui-button>
      <ui-segment bottom-attached>Content below</ui-segment>
    `,
  }),
}),
```

**`addOptionExamples(options, customExamples)`** - Add component-specific examples to shared options:
```javascript
import { COLOR_OPTIONS, addOptionExamples } from '@semantic-ui/specs';

options: addOptionExamples(COLOR_OPTIONS, {
  red: `<ui-button red>Red Button</ui-button>`,
  blue: `<ui-button blue>Blue Button</ui-button>`,
}),
```

**`filterVariationOptions(variation, filter)`** - Filter to a subset of options:
```javascript
import { SIZE_VARIATION, filterVariationOptions } from '@semantic-ui/specs';

// Filter to subset of sizes
filterVariationOptions(SIZE_VARIATION, ['small', 'medium', 'large']),

// Or filter by function
filterVariationOptions(SIZE_VARIATION, opt => opt.value !== 'massive'),
```

**`withUsageLevel(item, usageLevel)`** - Override usage level on any item:
```javascript
import { FLUID_VARIATION, withUsageLevel } from '@semantic-ui/specs';

withUsageLevel(FLUID_VARIATION, 2),
```

## Section Details

### Core Metadata

Always required, follows strict naming conventions:

```javascript
{
  uiType: 'element',           // Always 'element' for now (legacy field)
  name: 'Button',              // PascalCase singular name
  description: 'A button indicates a possible user action',  // One-line purpose
  tagName: 'ui-button',        // Always ui-[kebab-case-name]
  exportName: 'UIButton',      // Always UI[PascalName]
}
```

**⚠️ NAME FIELD CONVENTION**: All `name` fields throughout the spec MUST use Title Case:
- ✅ "Primary", "Secondary", "Loading", "Top Attached"
- ❌ "primary", "secondary", "loading", "top attached"
- For multi-word names: ✅ "Very Padded", "Left Floated", "Equal Width"
- Component names: ✅ "Button", "Modal", "Dropdown"

### Content Section

Defines slots, content areas, and attributes that control component content:

**Important**: All feature descriptions (content, types, states, variations) should use imperative mood WITHOUT the component noun. For example:
- ✅ "be emphasized"
- ❌ "A button can be emphasized"
- ✅ "include an icon"
- ❌ "A button can include an icon"

```javascript
content: [
  {
    name: 'Icon',
    attribute: 'icon',                // HTML attribute name (kebab-case)
    slot: 'icon',                     // Optional: slot name if slottable
    includeAttributeClass: true,      // Add attribute as CSS class
    couplesWith: ['ui-icon'],         // Components this works with
    description: 'include an icon',   // Imperative mood, no noun
    usageLevel: 1,                    // 1-5 (1=essential, 5=rare)
    exampleCode: `<ui-button icon="pause">Pause</ui-button>`,
  },
  {
    name: 'Label',
    attribute: 'label',
    description: 'include a label',
    exampleCode: `<ui-input label="Email"></ui-input>`,
  },
],
```

`exampleCode` can also be an array of strings for multiple examples:
```javascript
{
  name: 'Image',
  attribute: 'image',
  description: 'include an image',
  exampleCode: [
    `<ui-button>
      <img src="/images/avatar/small/jenny.jpg" />
      Add Jenny
    </ui-button>`,
    `<ui-button>
      <ui-image src="/images/avatar/small/dima.jpg"></ui-image>
      Add Dima
    </ui-button>`,
  ],
},
```

**When to use Content**:
- Component accepts structured content areas (header, footer, icon, label)
- Content can be provided via attribute OR slot
- Content couples with other components

### Types Section

Mutually EXCLUSIVE behavioral variations (component can only be ONE type):

**⚠️ Value Format Rule**: Semantic UI supports two-way attribute lookup where `<ui-segment very-padded>` equals `<ui-segment padded="very-padded">`. Therefore, option values must be the full hyphenated form:
- ✅ `value: 'very-padded'`
- ❌ `value: 'very'`

```javascript
types: [
  // Using a shared type constant
  EMPHASIS_TYPE,

  // Custom type
  {
    name: 'Styled',
    attribute: 'styled',
    description: 'be styled to fit into a layout',
    usageLevel: 1,
    includeAttributeClass: true,      // When group + individual styling needed
    separateExamples: false,          // Show all options in one example
    options: [
      {
        name: 'Subtle',
        value: 'subtle',
        description: 'be styled to be de-emphasized',
      },
      {
        name: 'Flat',
        value: 'flat',
        description: 'be styled to appear flat',
      },
      {
        name: 'Outline',
        value: 'outline',
        description: 'be styled to appear outlined',
      },
      {
        name: 'Ghost',
        value: 'ghost',
        description: 'only show styling when hovered',
      },
    ],
  },

  // Boolean type (no options)
  {
    name: 'Link',
    attribute: 'link',
    description: 'be formatted as a page link',
    usageLevel: 1,
  },

  // Type with compound aliases for disambiguation
  {
    name: 'Animated',
    attribute: 'animated',
    description: 'animate to show hidden content',
    includeAttributeClass: true,
    compoundAliases: true,    // Forces vertical-animated instead of bare vertical
    usageLevel: 3,
    options: [
      {
        name: 'Horizontal',
        value: 'horizontal',
        description: 'animate hidden content horizontally',
        exampleCode: `
          <ui-button animated>
            <span slot="visible">Hover Me</span>
            <span slot="hidden">Hidden</span>
          </ui-button>
        `,
      },
      {
        name: 'Vertical',
        value: 'vertical',
        description: 'animate hidden content vertically',
      },
    ],
  },
],
```

**When to use Types**:
- Component has mutually exclusive modes (primary vs secondary)
- Different behavioral patterns (solid vs outline)
- Core identity changes (search input vs password input)

### States Section

Runtime states that change over time during component lifecycle. **Prefer `getStates()` for standard states:**

```javascript
import { getStates } from '@semantic-ui/specs';

// Standard approach - use shared state constants
states: getStates(['hover', 'pressed', 'focus', 'active', 'disabled', 'loading']),
```

For custom states or when you need to modify standard ones:

```javascript
import { getStates, withUsageLevel } from '@semantic-ui/specs';

states: [
  // Shared states with modified usage levels
  ...getStates(['disabled', 'loading']).map(state => withUsageLevel(state, 1)),

  // Custom state
  {
    name: 'Open',
    attribute: 'open',
    description: 'be opened',
  },
],
```

**Available shared states**: `hover`, `focus`, `active`, `disabled`, `loading`, `pressed`

**Standard States** (most components should consider):
- hover, focus, active, disabled, loading
- pressed (for buttons)
- checked (for checkboxes)
- selected (for selectable items)
- expanded/collapsed (for expandable content)

### Variations Section

Mutually INCLUSIVE visual/layout modifications (can stack multiple). **Prefer shared variations via `getVariations()` and spread into custom ones:**

```javascript
import {
  ATTACHED_VARIATION,
  ATTACHED_OPTIONS,
  COLOR_OPTIONS,
  getVariations,
  modifyVariation,
  addOptionExamples,
} from '@semantic-ui/specs';

variations: [
  // Spread shared variations
  ...getVariations(['floated', 'fluid', 'compact', 'size', 'circular']),

  // Shared variation with component-specific examples
  modifyVariation(ATTACHED_VARIATION, {
    options: addOptionExamples(ATTACHED_OPTIONS, {
      'top-attached': `
        <ui-button top-attached>Top Action</ui-button>
        <ui-segment bottom-attached>Content below</ui-segment>
      `,
      'bottom-attached': `
        <ui-segment top-attached>Content above</ui-segment>
        <ui-button bottom-attached>Bottom Action</ui-button>
      `,
    }),
  }),

  // Custom variation with options
  {
    name: 'Colored',
    attribute: 'color',
    includeAttributeClass: true,
    description: 'be colored',
    usageLevel: 3,
    separateExamples: true,
    // Use computed values for generated examples
    singularExampleCode: [
      COLOR_OPTIONS.map(c => `<ui-button ${c.value}>${c.name}</ui-button>`).join('\n'),
    ],
    options: COLOR_OPTIONS,
  },

  // Custom boolean variation (no options)
  {
    name: 'Transparent',
    attribute: 'transparent',
    usageLevel: 2,
    description: 'appear transparent',
  },
],
```

**Common Variations to Consider**:
- Size (mini → massive) — `SIZE_VARIATION`
- Color (standard palette) — `COLORED_VARIATION`
- Fluid (full width) — `FLUID_VARIATION`
- Floated (left/right) — `FLOATED_VARIATION`
- Aligned (horizontal/vertical) — `HORIZONTAL_ALIGNED_VARIATION`, `VERTICAL_ALIGNED_VARIATION`
- Attached (top/bottom/left/right) — `ATTACHED_VARIATION`
- Compact (reduced padding) — `COMPACT_VARIATION`
- Padded (increased padding) — `PADDED_VARIATION`
- Circular — `CIRCULAR_VARIATION`

### Settings Section

Component configuration with types and defaults:

```javascript
settings: [
  {
    name: 'Icon Only',
    type: 'boolean',                 // boolean, string, number, object, array
    attribute: 'icon-only',          // HTML attribute (kebab-case)
    defaultValue: false,             // Required for non-strings
    description: 'Enable to remove spacing for text',
    exampleCode: `<ui-button icon="pause" icon-only></ui-button>`,
  },
  {
    name: 'Href',
    type: 'string',
    attribute: 'href',
    description: 'link to a webpage',
  },
  {
    name: 'Debounce Interval',
    type: 'number',
    attribute: 'debounce-interval',
    defaultValue: 150,
    description: 'specify the input debounce interval in milliseconds',
  },
],
```

**Settings vs Other Sections**:
- Settings are configuration values with specific types
- Settings have defaults (unlike variations/types)
- Settings are often programmatic (href, name, value)

### Events Section

Custom events dispatched by the component:

```javascript
events: [
  {
    eventName: 'change',
    description: 'occurs after the value changes',
    arguments: [                     // Optional: event detail structure
      {
        name: 'value',
        description: 'the updated value',
      },
      {
        name: 'oldValue',
        description: 'the previous value',
      },
    ],
  },
  {
    eventName: 'show',
    description: 'occurs after the component becomes visible',
  },
],
```

**Common Events**:
- change (for form inputs)
- show/hide (for visibility)
- open/close (for toggleable content)
- select/deselect (for selectable items)
- complete (for processes)

### Plural Support

When component supports collections:

```javascript
{
  supportsPlural: true,
  pluralName: 'Buttons',
  pluralTagName: 'ui-buttons',
  pluralExportName: 'UIButtons',
  pluralDescription: 'Buttons can exist together as a group',

  // Content specific to plural
  pluralContent: [
    {
      name: 'Conditional',
      description: 'show a conditional choice',
      exampleCode: `
        <ui-buttons>
          <ui-button>Cancel</ui-button>
          <span class="conditional">or</span>
          <ui-button primary>Save</ui-button>
        </ui-buttons>
      `,
    },
  ],

  // Inherit from singular (attribute names from singular types/variations)
  pluralSharedTypes: ['styled', 'icon'],
  pluralSharedVariations: [
    'size',       // Group of large buttons makes sense
    'floated',    // Group floated left makes sense
    'compact',    // Group with compact spacing makes sense
    'color',      // Group of red buttons makes sense
    'styled',     // Group with same styling makes sense
    'attached',   // Group attached to content makes sense
  ],
  pluralSharedStates: [],       // States rarely shared

  // Unique to plural
  pluralOnlyTypes: [
    {
      name: 'Vertical',
      attribute: 'vertical',
      description: 'be arranged vertically',
      usageLevel: 3,
    },
  ],

  pluralOnlyVariations: [
    {
      name: 'Separate',
      attribute: 'separate',
      description: 'have separated items',
    },
    {
      name: 'Equal Width',
      attribute: 'equal-width',
      description: 'have the same width for each button',
      includeAttributeClass: true,
      usageLevel: 3,
      options: [
        {
          name: 'Two',
          value: 'two',
          description: 'have two items evenly split',
          exampleCode: `
            <ui-buttons equal-width="two">
              <ui-button>One</ui-button>
              <ui-button>Two</ui-button>
            </ui-buttons>
          `,
        },
        { name: 'Three', value: 'three', description: 'have three items evenly split' },
        { name: 'Four', value: 'four', description: 'have four items evenly split' },
      ],
    },
  ],
}
```

### Examples Section

Default content for documentation:

```javascript
examples: {
  // Default attributes to apply in all examples
  defaultAttributes: {
    icon: 'check-circle',        // Icons always need a glyph to display
  },

  // Default inner content for examples
  defaultContent: 'Click Me',

  // Default content when showing plural examples
  defaultPluralContent: `
    <ui-button>One</ui-button>
    <ui-button>Two</ui-button>
    <ui-button>Three</ui-button>
  `,
},
```

## Usage Levels Guide

Assign `usageLevel` (1-5) to indicate feature commonality:

1. **Level 1 - Essential**: Core features users need immediately
   - Primary types (emphasis)
   - Common variations (size, fluid)
   - Basic states (disabled)

2. **Level 2 - Common**: Frequently used but not essential
   - Secondary types
   - Color variations
   - Floated/aligned variations

3. **Level 3 - Advanced**: Specific use cases
   - Animation options
   - Attached variations
   - Specialized behaviors

4. **Level 4 - Specialized**: Edge cases
   - Complex compound behaviors
   - Platform-specific features

5. **Level 5 - Rare**: Rarely used
   - Experimental features
   - Legacy support options

## Description Templates

Use these patterns for consistent descriptions:

### States
- "be [state]" — "be hovered", "be focused", "be activated"
- "have [feature]" — "have interactions disabled"
- "indicate [status]" — "indicate it is loading"

### Types & Variations
- "appear [visual]" — "appear small", "appear attached"
- "be [identity]" — "be emphasized", "be colored"
- "use [approach]" — "use a solid color", "use no background"
- "take [dimension]" — "take the width of its container"
- "show [behavior]" — "show buttons in a vertical stack"
- "match [pattern]" — "match the brand colors of Facebook"
- "vary in [property]" — "vary in size"

### Options Within
- Size: "appear [intensity] [size]" — "appear extremely small"
- Position: "appear attached to the [position]"
- Behavior: "allow [behavior] but appear [state]"

## Field Requirements

### Valid Fields Only

**IMPORTANT**: Only use fields that are explicitly shown in this guide. The complete list of valid fields for each section is:

**Core Metadata**: `uiType`, `name`, `description`, `tagName`, `exportName`, `examples`

**Feature Sections** (content/types/states/variations):
- `name`, `attribute`, `description`, `usageLevel`
- `includeAttributeClass` (optional boolean — see explanation below)
- `compoundAliases` (optional boolean — for disambiguation)
- `options` (array for multi-value features)
- `exampleCode` (optional — string or array of strings)
- `singularExampleCode` (optional — array of strings, used for custom singular examples)
- `separateExamples` (types/variations only — boolean)
- `couplesWith` (content only — array of tag names)
- `slot` (content only — string)

**Settings Section**: `name`, `type`, `attribute`, `defaultValue`, `description`, `exampleCode`

**Events Section**: `eventName`, `description`, `arguments`

**Event Arguments**: `name`, `description`

**Plural Support**: `supportsPlural`, `pluralName`, `pluralTagName`, `pluralExportName`, `pluralDescription`, `pluralContent`, `pluralSharedTypes`, `pluralSharedVariations`, `pluralSharedStates`, `pluralOnlyTypes`, `pluralOnlyVariations`

**Do NOT add**: Fields like `valueAttribute`, `required`, `defaultState`, `validation`, or any other fields not listed above.

### Understanding includeAttributeClass

⚠️ **ONLY use `includeAttributeClass` on features WITH options.** Boolean attributes (no options) automatically add their attribute name as a class.

**How boolean attributes work (NO includeAttributeClass needed):**
- `<ui-segment raised>` → automatically adds `.raised` class
- `<ui-segment circular>` → automatically adds `.circular` class

**How options work:**
- WITHOUT `includeAttributeClass`: Only adds the value → `.red`, `.blue`
- WITH `includeAttributeClass`: Adds both attribute AND value → `.colored.red`, `.colored.blue`

**When to use includeAttributeClass:**
- ✅ Feature has `options` array AND options share common CSS rules
- ✅ You want to write `.colored { /* shared styles */ }` plus `.red { /* specific */ }`
- ✅ The variation group has unified styling patterns

**When to omit includeAttributeClass:**
- ❌ Boolean attribute (no options) — it's automatic
- ❌ Options are completely independent with no shared styles
- ❌ You only need individual option classes (`.red`, `.blue`)

**Example:**
```css
/* Boolean (no includeAttributeClass needed) */
.raised { box-shadow: 0 2px 4px rgba(0,0,0,0.1); }

/* Options WITH includeAttributeClass: true */
.colored {
  /* Shared rules for ALL colored variations */
  border-width: 2px;
  font-weight: bold;
}
.red { background: red; }
.blue { background: blue; }

/* HTML: <ui-segment colored="red"> → class="colored red segment" */
```

### Understanding compoundAliases

Use `compoundAliases: true` when an option value would be ambiguous as a standalone boolean attribute. This forces the shortform to always include the attribute name for clarity.

Without `compoundAliases`, the three-dialect system would allow `<ui-button vertical>` as shorthand for `animated="vertical"`. But "vertical" on a button is ambiguous — is it a vertical animation or a vertical layout? With `compoundAliases: true`, the bare shortform is removed and only the compound form works:

```javascript
{
  name: 'Animated',
  attribute: 'animated',
  compoundAliases: true,
  options: [
    { name: 'Horizontal', value: 'horizontal' },
    { name: 'Vertical', value: 'vertical' },
    { name: 'Fade', value: 'fade' },
  ],
}
```

```html
<!-- ❌ Without compoundAliases, this would be valid but ambiguous -->
<ui-button vertical>

<!-- ✅ With compoundAliases, users must write the compound form -->
<ui-button vertical-animated>
<ui-button fade-animated>

<!-- Verbose form always works regardless -->
<ui-button animated="vertical">
```

The system generates `{value}-{attribute}` compounds by default (e.g., `vertical-animated`). The bare value (`vertical`) is removed from `optionAttributes` so it can't be used as a standalone shortform.

**When to use**: The option values are common words that could plausibly mean something else on the component. The `compact` variation also uses this — `very-compact` is clearer than a bare `very`.

**CSS is not affected**: `compoundAliases` only changes which HTML boolean attributes are recognized. The generated CSS classes are always `.animated.vertical.button` regardless of whether the HTML uses `vertical-animated` or `animated="vertical"`.

### Always Include (Machines)
- Explicit `value` fields even when matching lowercase name
- Empty arrays for unused sections (not null/undefined)
- `defaultValue` for all settings
- `usageLevel` for all content/types/variations (default to 1 if unsure)
- Complete `exampleCode` for any complex usage

## Complete Example: Button Spec

This shows how a real spec uses shared terms, template literals, and computed values:

```javascript
import {
  COLOR_OPTIONS,
  ATTACHED_OPTIONS,
  ATTACHED_VARIATION,
  addOptionExamples,
  getStates,
  getVariations,
  modifyVariation,
} from '@semantic-ui/specs';

export default {
  uiType: 'element',
  name: 'Button',
  description: 'A button indicates a possible user action.',
  tagName: 'ui-button',
  exportName: 'UIButton',
  examples: {
    defaultPluralContent: `
      <ui-button>One</ui-button>
      <ui-button>Two</ui-button>
      <ui-button>Three</ui-button>
    `,
  },

  content: [
    {
      name: 'Icon',
      includeAttributeClass: true,
      attribute: 'icon',
      couplesWith: ['ui-icon'],
      description: 'include an icon',
      exampleCode: `<ui-button icon="pause">Pause</ui-button>`,
    },
  ],

  types: [
    {
      name: 'Emphasis',
      attribute: 'emphasis',
      description: 'be emphasized in a layout',
      usageLevel: 1,
      includeAttributeClass: true,
      separateExamples: true,
      options: [
        {
          name: 'Primary',
          value: 'primary',
          description: 'be emphasized as the first action that should be taken',
          exampleCode: `
            <ui-button primary>Confirm</ui-button>
            <ui-button>Cancel</ui-button>
          `,
        },
        {
          name: 'Secondary',
          value: 'secondary',
          description: 'be emphasized as a secondary option',
        },
      ],
    },
  ],

  // Shared states via helper
  states: getStates(['hover', 'pressed', 'focus', 'active', 'disabled', 'loading']),

  variations: [
    // Shared variations via helper
    ...getVariations(['floated', 'fluid', 'compact', 'size', 'circular']),

    // Shared variation with custom examples
    modifyVariation(ATTACHED_VARIATION, {
      options: addOptionExamples(ATTACHED_OPTIONS, {
        'top-attached': `
          <ui-button top-attached>Top Action</ui-button>
          <ui-segment bottom-attached>Content below</ui-segment>
        `,
      }),
    }),

    // Custom variation using shared options
    {
      name: 'Colored',
      attribute: 'color',
      includeAttributeClass: true,
      description: 'be colored',
      usageLevel: 3,
      options: COLOR_OPTIONS,
    },
  ],

  settings: [
    {
      name: 'Icon Only',
      type: 'boolean',
      attribute: 'icon-only',
      defaultValue: false,
      description: 'Enable to remove spacing for text',
    },
  ],

  // Plural support
  supportsPlural: true,
  pluralName: 'Buttons',
  pluralTagName: 'ui-buttons',
  pluralExportName: 'UIButtons',
  pluralDescription: 'Buttons can exist together as a group',
  pluralSharedTypes: ['styled', 'icon'],
  pluralSharedVariations: ['size', 'floated', 'compact', 'color', 'styled', 'attached'],
};
```

## Validation Checklist

Before completing a spec, verify:

1. ✓ File is a `.spec.js` module with `export default { ... }`
2. ✓ All imports are from `@semantic-ui/specs`
3. ✓ Exported object is pure data (JSON-serializable, no functions/dates/regexes)
4. ✓ All required metadata fields present (uiType, name, description, tagName, exportName)
5. ✓ Naming conventions followed (tagName: `ui-*`, exportName: `UI*`)
6. ✓ **All `name` fields use Title Case** (e.g., "Primary", "Top Attached", "Very Padded")
7. ✓ Types are mutually exclusive options
8. ✓ Variations are stackable attributes
9. ✓ States represent temporal changes
10. ✓ Descriptions use imperative mood without the noun
11. ✓ Usage levels assigned (1-5)
12. ✓ `includeAttributeClass` ONLY on features with options (never on boolean attributes)
13. ✓ Option values use full hyphenated form (e.g., "very-padded" not "very")
14. ✓ Shared terms used where available (sizes, colors, states, etc.)
15. ✓ Template literals used for HTML examples (no escaped quotes)
16. ✓ Plural sections only share obvious visual variations
17. ✓ Example content provided for documentation
18. ✓ Events include all dispatched CustomEvents

## Quick Reference

| Section | Purpose | Mutually Exclusive |
|---------|---------|------------------|
| `types` | Core behaviors | Yes |
| `variations` | Visual modifications | No |
| `states` | Runtime changes | No |
| `settings` | Configuration | No |
| `content` | Slots/attributes | No |
| `events` | Custom events | No |

## Common Patterns

### Form Components
```javascript
{
  settings: [
    { name: 'Name', type: 'string', attribute: 'name', description: 'specify the form field name' },
    { name: 'Value', type: 'string', attribute: 'value', description: 'specify a value to store' },
    { name: 'Type', type: 'string', attribute: 'type', defaultValue: 'text', description: 'specify the html input type' },
  ],
  events: [
    { eventName: 'change', description: 'occurs after the value changes', arguments: [{ name: 'value', description: 'the updated value' }] },
  ],
}
```

### Container Components
```javascript
{
  content: [
    { name: 'Header', attribute: 'header', slot: 'header', description: 'include a header' },
    { name: 'Content', slot: 'content', description: 'include content' },
    { name: 'Footer', attribute: 'footer', slot: 'footer', description: 'include a footer' },
  ],
}
```

### Interactive Components
```javascript
{
  states: [
    { name: 'Open', attribute: 'open', description: 'be opened' },
    { name: 'Closed', attribute: 'closed', description: 'be closed' },
  ],
  events: [
    { eventName: 'open', description: 'occurs when the component opens' },
    { eventName: 'close', description: 'occurs when the component closes' },
    { eventName: 'toggle', description: 'occurs when the component toggles' },
  ],
}
```

## Building After Changes

After creating or editing a `.spec.js` file, regenerate the outputs:

```bash
npm run build:ui-deps
```

This generates the `.spec.json` and `.component.js` files from your source. The build validates that your spec is pure data — it will throw if you accidentally include functions or non-serializable values.

## Final Notes

- Specs are contracts — they define what a component CAN do, not HOW it does it
- Always edit `.spec.js` source files, never generated `.spec.json` or `.component.js`
- Use shared terms from `@semantic-ui/specs` for standard patterns (sizes, colors, states)
- Use template literals for clean HTML examples
- When in doubt, look at `button.spec.js`, `input.spec.js`, and `segment.spec.js` as exemplars
- Types are exclusive, Variations are inclusive
- States change over time, Variations/Types are generally static

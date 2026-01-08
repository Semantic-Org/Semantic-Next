---
title: Define Primitive Spec
description: Comprehensive guide for authoring valid primitive spec JSON files that define component APIs, behaviors, variations, and documentation in Semantic UI.
keywords: [specs, primitives, JSON, API design, types, variations, states, documentation]
audience: contributing
type: workflow
---

# Define Primitive Spec

**Purpose**: Guide AI agents to author complete, valid primitive spec JSON files for Semantic UI primitives

## Overview

A primitive spec is a declarative JSON contract that defines everything about a UI primitive: its API, behaviors, variations, and documentation. This spec drives primitive generation, TypeScript definitions, and documentation - it is the single source of truth.

## Core Principles

1. **Be Exhaustive**: Machines should always be explicit and thorough. Include all fields even if they could be inferred.
2. **Types vs Variations**: Types are mutually EXCLUSIVE (pick one), Variations are mutually INCLUSIVE (stack many)
3. **Imperative Descriptions**: Use imperative mood without the noun ("be emphasized" not "button can be emphasized")
4. **Progressive Disclosure**: Use usage levels 1-5 to indicate feature commonality
5. **Dual Content Patterns**: Support both attribute and slot patterns when content can work either way
6. **Title Case Names**: All `name` fields must use Title Case (e.g., "Primary", "Top Attached", "Very Padded")

## Critical Rules

⚠️ **NEVER add fields to the spec JSON that are not explicitly documented in this guide.** Only use the exact fields shown in the examples and field reference below. Do not invent new fields like `valueAttribute`, `defaultState`, `required`, or any other fields that seem logical but aren't documented here. The spec system has a precise schema - follow it exactly.

## Complete Spec Structure

```json
{
  // SECTION 1: Core Metadata (Required)
  "uiType": "element",
  "name": "ComponentName",
  "description": "A component that does something specific",  // Main description can include noun
  "tagName": "ui-component-name",
  "exportName": "UIComponentName",

  // SECTION 2: Component Behavior (Required, can be empty arrays)
  "content": [],
  "types": [],
  "states": [],
  "variations": [],
  "settings": [],
  "events": [],

  // SECTION 3: Plural Support (Optional)
  "supportsPlural": false,
  "pluralName": "ComponentNames",
  "pluralTagName": "ui-component-names",
  "pluralExportName": "UIComponentNames",
  "pluralDescription": "Components can exist together as a group",
  "pluralContent": [],
  "pluralSharedTypes": [],
  "pluralSharedVariations": [],
  "pluralSharedStates": [],
  "pluralOnlyTypes": [],
  "pluralOnlyVariations": [],

  // SECTION 4: Examples (Required for docs)
  "examples": {
    "defaultAttributes": {},
    "defaultContent": "",
    "defaultPluralContent": ""
  }
}
```

## Section Details

### Core Metadata

Always required, follows strict naming conventions:

```json
{
  "uiType": "element",  // Always "element" for now (legacy field)
  "name": "Button",     // PascalCase singular name
  "description": "A button indicates a possible user action",  // One-line purpose (main description can include noun)
  "tagName": "ui-button",  // Always ui-[kebab-case-name]
  "exportName": "UIButton"  // Always UI[PascalName]
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

```json
"content": [
  {
    "name": "Icon",
    "attribute": "icon",  // HTML attribute name (kebab-case)
    "slot": "icon",  // Optional: slot name if slottable
    "includeAttributeClass": true,  // Add attribute as CSS class
    "couplesWith": ["ui-icon"],  // Components this works with
    "description": "include an icon",  // Imperative mood, no noun
    "usageLevel": 1,  // 1-5 (1=essential, 5=rare)
    "exampleCode": "<ui-button icon=\"pause\">Pause</ui-button>"
  },
  {
    "name": "Label",
    "attribute": "label",
    "description": "include a label",
    "exampleCode": "<ui-input label=\"Email\"></ui-input>"
  }
]
```

**When to use Content**:
- Component accepts structured content areas (header, footer, icon, label)
- Content can be provided via attribute OR slot
- Content couples with other components

### Types Section

Mutually EXCLUSIVE behavioral variations (component can only be ONE type):

**⚠️ Value Format Rule**: Semantic UI supports two-way attribute lookup where `<ui-segment very-padded>` equals `<ui-segment padded="very-padded">`. Therefore, option values must be the full hyphenated form:
- ✅ `"value": "very-padded"`
- ❌ `"value": "very"`

```json
"types": [
  {
    "name": "Emphasis",
    "attribute": "emphasis",
    "description": "be emphasized in a layout",
    "usageLevel": 1,
    "includeAttributeClass": true,  // When group + individual styling needed
    "separateExamples": true,  // Show each option separately in docs
    "options": [
      {
        "name": "Primary",
        "value": "primary",  // Always be explicit for machines
        "description": "be emphasized as the first action",
        "exampleCode": "<ui-button primary>Save</ui-button>"
      },
      {
        "name": "Secondary",
        "value": "secondary",
        "description": "be emphasized as a secondary option"
      }
    ]
  },
  {
    "name": "Styled",
    "attribute": "styled",
    "description": "be styled to fit into a layout",
    "usageLevel": 1,
    "options": [
      {
        "name": "Solid",
        "value": "solid",
        "description": "use a solid color"
      },
      {
        "name": "Outline",
        "value": "outline",
        "description": "use no background"
      },
      {
        "name": "Ghost",
        "value": "ghost",
        "description": "only show styling when hovered"
      }
    ]
  }
]
```

**When to use Types**:
- Component has mutually exclusive modes (primary vs secondary)
- Different behavioral patterns (solid vs outline)
- Core identity changes (search input vs password input)

### States Section

Runtime states that change over time during component lifecycle:

```json
"states": [
  {
    "name": "Hover",
    "attribute": "hover",
    "description": "be hovered"
  },
  {
    "name": "Focus",
    "attribute": "focus",
    "description": "be focused by the keyboard"
  },
  {
    "name": "Active",
    "attribute": "active",
    "description": "be activated"
  },
  {
    "name": "Disabled",
    "attribute": "disabled",
    "includeAttributeClass": true,  // Often needs class for styling
    "description": "have interactions disabled",
    "options": [  // Some states have variations
      {
        "name": "Disabled",
        "value": "disabled",
        "description": "disable interactions"
      },
      {
        "name": "Clickable Disabled",
        "value": "clickable-disabled",
        "description": "allow interactions but appear disabled"
      }
    ]
  },
  {
    "name": "Loading",
    "attribute": "loading",
    "description": "indicate it is loading content"
  }
]
```

**Standard States** (most components should consider):
- hover, focus, active, disabled, loading
- pressed (for buttons)
- checked (for checkboxes)
- selected (for selectable items)
- expanded/collapsed (for expandable content)

### Variations Section

Mutually INCLUSIVE visual/layout modifications (can stack multiple):

**⚠️ Value Format Rule**: Same as Types - option values must be the full hyphenated form (e.g., `"very-compact"` not `"very"`).

```json
"variations": [
  {
    "name": "Size",
    "attribute": "size",
    "usageLevel": 1,
    "description": "vary in size",
    "separateExamples": true,  // Show each size separately
    "options": [
      {
        "name": "Mini",
        "value": "mini",
        "description": "appear extremely small"
      },
      {
        "name": "Tiny",
        "value": "tiny",
        "description": "appear very small"
      },
      {
        "name": "Small",
        "value": "small",
        "description": "appear small"
      },
      {
        "name": "Medium",
        "value": "medium",
        "description": "appear normal sized"
      },
      {
        "name": "Large",
        "value": "large",
        "description": "appear larger than normal"
      },
      {
        "name": "Big",
        "value": "big",
        "description": "appear much larger than normal"
      },
      {
        "name": "Huge",
        "value": "huge",
        "description": "appear very much larger than normal"
      },
      {
        "name": "Massive",
        "value": "massive",
        "description": "appear extremely larger than normal"
      }
    ]
  },
  {
    "name": "Colored",
    "attribute": "color",
    "includeAttributeClass": true,
    "description": "be colored",
    "usageLevel": 2,
    "options": [
      {"name": "Red", "value": "red", "description": "be red"},
      {"name": "Orange", "value": "orange", "description": "be orange"},
      {"name": "Yellow", "value": "yellow", "description": "be yellow"},
      {"name": "Olive", "value": "olive", "description": "be olive"},
      {"name": "Green", "value": "green", "description": "be green"},
      {"name": "Teal", "value": "teal", "description": "be teal"},
      {"name": "Blue", "value": "blue", "description": "be blue"},
      {"name": "Violet", "value": "violet", "description": "be violet"},
      {"name": "Purple", "value": "purple", "description": "be purple"},
      {"name": "Pink", "value": "pink", "description": "be pink"},
      {"name": "Brown", "value": "brown", "description": "be brown"},
      {"name": "Grey", "value": "grey", "description": "be grey"},
      {"name": "Black", "value": "black", "description": "be black"}
    ]
  },
  {
    "name": "Fluid",
    "attribute": "fluid",
    "usageLevel": 1,
    "description": "take the width of its container"
  },
  {
    "name": "Attached",
    "attribute": "attached",
    "description": "attach to other content",
    "usageLevel": 2,
    "includeAttributeClass": true,
    "options": [
      {
        "name": "Top Attached",
        "value": ["top-attached"],  // Array for compound classes
        "description": "appear attached to the top of other content"
      },
      {
        "name": "Attached",
        "value": "attached",
        "description": "attach to content above and below"
      },
      {
        "name": "Bottom Attached",
        "value": "bottom-attached",
        "description": "attach to the bottom"
      },
      {
        "name": "Left Attached",
        "value": "left-attached",
        "description": "attach to the left"
      },
      {
        "name": "Right Attached",
        "value": "right-attached",
        "description": "attach to the right"
      }
    ]
  }
]
```

**Common Variations to Consider**:
- Size (mini → massive)
- Color (standard palette)
- Fluid (full width)
- Floated (left/right)
- Aligned (top/middle/bottom or left/center/right)
- Attached (top/bottom/left/right)
- Compact (reduced padding)
- Inverted (for dark backgrounds)

### Settings Section

Component configuration with types and defaults:

```json
"settings": [
  {
    "name": "Icon Only",
    "type": "boolean",  // boolean, string, number, object, array
    "attribute": "icon-only",  // HTML attribute (kebab-case)
    "defaultValue": false,  // Required for non-strings
    "description": "remove spacing for text"
  },
  {
    "name": "Href",
    "type": "string",
    "attribute": "href",
    "description": "link to a webpage"
  },
  {
    "name": "Debounce Interval",
    "type": "number",
    "attribute": "debounce-interval",
    "defaultValue": 150,
    "description": "specify the input debounce interval in milliseconds"
  }
]
```

**Settings vs Other Sections**:
- Settings are configuration values with specific types
- Settings have defaults (unlike variations/types)
- Settings are often programmatic (href, name, value)

### Events Section

Custom events dispatched by the component:

```json
"events": [
  {
    "eventName": "change",
    "description": "occurs after the value changes",
    "arguments": [  // Optional: event detail structure
      {
        "name": "value",
        "description": "the updated value"
      },
      {
        "name": "oldValue",
        "description": "the previous value"
      }
    ]
  },
  {
    "eventName": "show",
    "description": "occurs after the component becomes visible"
  },
  {
    "eventName": "hide",
    "description": "occurs when the component begins to hide"
  }
]
```

**Common Events**:
- change (for form inputs)
- show/hide (for visibility)
- open/close (for toggleable content)
- select/deselect (for selectable items)
- complete (for processes)

### Plural Support

When component supports collections:

```json
{
  "supportsPlural": true,
  "pluralName": "Buttons",
  "pluralTagName": "ui-buttons",
  "pluralExportName": "UIButtons",
  "pluralDescription": "Buttons can exist together as a group",

  // Content specific to plural
  "pluralContent": [
    {
      "name": "Or",
      "attribute": "or",
      "slot": "or",
      "description": "show a conditional choice between buttons"
    }
  ],

  // Inherit from singular (only obvious visual variations)
  "pluralSharedTypes": [],  // Types rarely shared (mutually exclusive)
  "pluralSharedVariations": [
    "size",      // Group of large buttons makes sense
    "color",     // Group of red buttons makes sense
    "floated",   // Group floated left makes sense
    "compact",   // Group with compact spacing makes sense
    "styled"     // Group with same styling makes sense
  ],
  "pluralSharedStates": [],  // States rarely shared

  // Unique to plural
  "pluralOnlyTypes": [
    {
      "name": "Vertical",
      "attribute": "vertical",
      "description": "show buttons in a vertical stack",
      "usageLevel": 3
    }
  ],
  "pluralOnlyVariations": [
    {
      "name": "Equal Width",
      "attribute": "equal-width",
      "description": "have the same width for each button",
      "usageLevel": 3,
      "options": [
        {"name": "Two", "value": "two", "description": "have two items evenly split"},
        {"name": "Three", "value": "three", "description": "have three items evenly split"},
        {"name": "Four", "value": "four", "description": "have four items evenly split"},
        {"name": "Five", "value": "five", "description": "have five items evenly split"}
      ]
    },
    {
      "name": "Stackable",
      "attribute": "stackable",
      "description": "automatically stack rows to a single column on mobile",
      "usageLevel": 3
    }
  ]
}
```

### Examples Section

Default content for documentation:

```json
"examples": {
  // Default attributes to apply in all examples
  "defaultAttributes": {
    "icon": "check-circle"  // Icons always need a glyph to display
  },

  // Default inner content for examples
  "defaultContent": "Click Me",

  // Default content when showing plural examples
  "defaultPluralContent": "<ui-button>One</ui-button>\n<ui-button>Two</ui-button>\n<ui-button>Three</ui-button>"
}
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

```json
{
  "name": "Size",
  "usageLevel": 1,  // Essential feature
  "description": "vary in size"
}

{
  "name": "Animated",
  "usageLevel": 3,  // Advanced feature
  "description": "animate to show hidden content"
}

## Description Templates

Use these patterns for consistent descriptions:

### States
- "be [state]" - "be hovered", "be focused", "be activated"
- "have [feature]" - "have interactions disabled"
- "indicate [status]" - "indicate it is loading"

### Types & Variations
- "appear [visual]" - "appear small", "appear attached"
- "be [identity]" - "be emphasized", "be colored"
- "use [approach]" - "use a solid color", "use no background"
- "take [dimension]" - "take the width of its container"
- "show [behavior]" - "show buttons in a vertical stack"
- "match [pattern]" - "match the brand colors of Facebook"

### Options Within
- Size: "appear [intensity] [size]" - "appear extremely small"
- Position: "appear attached to the [position]"
- Behavior: "allow [behavior] but appear [state]"

## Field Requirements

### Valid Fields Only

**IMPORTANT**: Only use fields that are explicitly shown in this guide. The complete list of valid fields for each section is:

**Core Metadata**: `uiType`, `name`, `description`, `tagName`, `exportName`, `examples`

**Feature Sections** (content/types/states/variations):
- `name`, `attribute`, `description`, `usageLevel`
- `includeAttributeClass` (optional boolean - see explanation below)
- `options` (array for multi-value features)
- `exampleCode` (optional)
- `couplesWith` (content only)
- `slot` (content only)
- `separateExamples` (types/variations only)

**Settings Section**: `name`, `type`, `attribute`, `defaultValue`, `description`

**Events Section**: `name`, `description`, `arguments`

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
- ❌ Boolean attribute (no options) - it's automatic
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

### Always Include (Machines)
- Explicit `value` fields even when matching lowercase name
- Empty arrays for unused sections (not null/undefined)
- `defaultValue` for all settings
- `usageLevel` for all content/types/variations (default to 1 if unsure)
- Complete `exampleCode` for any complex usage

### Can Omit (Humans)
- `value` when it matches lowercase name
- Empty sections
- `usageLevel` when it's level 1
- `exampleCode` for simple cases

## Validation Checklist

Before completing a spec, verify:

1. ✓ All required fields present
2. ✓ Naming conventions followed (tagName: ui-*, exportName: UI*)
3. ✓ **All `name` fields use Title Case** (e.g., "Primary", "Top Attached", "Very Padded")
4. ✓ Types are mutually exclusive options
5. ✓ Variations are stackable attributes
6. ✓ States represent temporal changes
7. ✓ Descriptions use imperative mood without the noun
8. ✓ Usage levels assigned (1-5)
9. ✓ `includeAttributeClass` ONLY on features with options (never on boolean attributes)
10. ✓ Option values use full hyphenated form (e.g., "very-padded" not "very")
11. ✓ Plural sections only share obvious visual variations
12. ✓ Example content provided for documentation
13. ✓ Events include all dispatched CustomEvents

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

### Standard Sizes
```json
"options": [
  {"name": "Mini", "value": "mini", "description": "appear extremely small"},
  {"name": "Tiny", "value": "tiny", "description": "appear very small"},
  {"name": "Small", "value": "small", "description": "appear small"},
  {"name": "Medium", "value": "medium", "description": "appear normal sized"},
  {"name": "Large", "value": "large", "description": "appear larger than normal"},
  {"name": "Big", "value": "big", "description": "appear much larger than normal"},
  {"name": "Huge", "value": "huge", "description": "appear very much larger than normal"},
  {"name": "Massive", "value": "massive", "description": "appear extremely larger than normal"}
]
```

### Standard Colors
```json
"options": [
  {"name": "Red", "value": "red", "description": "be red"},
  {"name": "Orange", "value": "orange", "description": "be orange"},
  {"name": "Yellow", "value": "yellow", "description": "be yellow"},
  {"name": "Olive", "value": "olive", "description": "be olive"},
  {"name": "Green", "value": "green", "description": "be green"},
  {"name": "Teal", "value": "teal", "description": "be teal"},
  {"name": "Blue", "value": "blue", "description": "be blue"},
  {"name": "Violet", "value": "violet", "description": "be violet"},
  {"name": "Purple", "value": "purple", "description": "be purple"},
  {"name": "Pink", "value": "pink", "description": "be pink"},
  {"name": "Brown", "value": "brown", "description": "be brown"},
  {"name": "Grey", "value": "grey", "description": "be grey"},
  {"name": "Black", "value": "black", "description": "be black"}
]
```

### Form Components
```json
{
  "settings": [
    {"name": "Name", "type": "string", "attribute": "name"},
    {"name": "Value", "type": "string", "attribute": "value"},
    {"name": "Required", "type": "boolean", "attribute": "required", "defaultValue": false}
  ],
  "events": [
    {"eventName": "change", "arguments": [{"name": "value"}]},
    {"eventName": "input", "arguments": [{"name": "value"}]}
  ]
}
```

### Container Components
```json
{
  "content": [
    {"name": "Header", "attribute": "header", "slot": "header"},
    {"name": "Content", "slot": "content"},
    {"name": "Footer", "attribute": "footer", "slot": "footer"}
  ]
}
```

### Interactive Components
```json
{
  "states": [
    {"name": "Open", "attribute": "open"},
    {"name": "Closed", "attribute": "closed"}
  ],
  "events": [
    {"eventName": "open"},
    {"eventName": "close"},
    {"eventName": "toggle"}
  ]
}
```

## Final Notes

- Specs are contracts - they define what a component CAN do, not HOW it does it
- Be exhaustive when machine-authoring - include all fields
- Follow patterns from existing components for consistency
- When in doubt, look at button.json, input.json, and modal.json as exemplars
- Remember: Types are exclusive, Variations are inclusive
- States change over time, Variations/Types are generally static

This guide ensures AI agents create complete, valid, and consistent component specs that integrate seamlessly with the Semantic UI framework.
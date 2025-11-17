# Semantic UI Specs Package Guide

> Last Updated: 2025-11-14

**For AI agents working with Semantic UI's `@semantic-ui/specs` package**

## Overview

The `@semantic-ui/specs` package is the **declarative metadata backbone** of Semantic UI that defines component APIs, behaviors, and documentation through JavaScript specification files. It serves as a single source of truth that drives component creation, attribute validation, documentation generation, and TypeScript definitions across the entire framework.

**Key Concept**: Specs are **not code** - they are **component contracts** written as pure data in JavaScript modules. The framework reads these specs to configure actual component implementations.

## Package Structure

```
@semantic-ui/specs
├── SpecReader           ← Core class that processes spec files
├── Shared Terms         ← Reusable constants (shared-terms.js)
├── Helper Functions     ← Spec composition utilities
├── Spec Files          ← JavaScript source: src/primitives/*/specs/*.spec.js
├── Generated JSON       ← Machine-readable: *.spec.json (for LLMs/tooling)
├── Component Specs      ← Runtime metadata: *.component.js
└── Build Pipeline       ← Transforms specs into multiple output formats
```

**Main Exports**:
```javascript
import { SpecReader } from '@semantic-ui/specs';

// Shared terms and helpers
import {
  SIZE_OPTIONS,
  COLOR_OPTIONS,
  SIZE_VARIATION,
  FLUID_VARIATION,
  getStates,
  getVariations,
  addOptionExamples,
  filterVariationOptions,
  modifyVariation,
} from '@semantic-ui/specs';
```

## Mental Model: The Spec Transformation Pipeline

Understanding specs requires thinking about the data transformation pipeline:

```
Component Definition (button.spec.js)
    ↓ Build System
Generated JSON (button.spec.json) for LLMs/tooling
Generated Runtime (button.component.js) for defineComponent
    ↓ SpecReader.getWebComponentSpec()
Component Runtime Metadata
    ↓ defineComponent({ componentSpec })
Web Component Configuration
    ↓ WebComponentBase.getProperties()
Property Definitions & Attribute Mapping
```

**Parallel Pipeline for Documentation**:
```
Component Definition (button.spec.js)
    ↓ SpecReader.getDefinition()
Documentation Objects with Examples
    ↓ Template System
Rendered Documentation Pages
```

## Spec File Format

### Source Files (.spec.js)

Specs are written as **JavaScript modules** that export pure data objects. This provides:
- Template literals for clean HTML (no escaping)
- Ability to import and reuse shared constants
- Better developer experience with syntax highlighting
- Still JSON-serializable (validated at build time)

**File Naming**: `{component}.spec.js` (e.g., `button.spec.js`, `segment.spec.js`)

### JavaScript Formatting Conventions

```javascript
// Single quotes for JavaScript strings
import { SIZE_VARIATION } from '@semantic-ui/specs';

export default {
  name: 'Button',
  tagName: 'ui-button',

  // Template literals for HTML examples
  exampleCode: `<ui-button icon="pause">Pause</ui-button>`,

  // Double quotes for HTML attributes (inside template literals)
  content: [
    {
      name: 'Icon',
      exampleCode: `<ui-button icon="search" placeholder="Search..."></ui-button>`,
    },
  ],
};
```

**Rules**:
- Single quotes for JS strings: `'Button'`, `'ui-button'`
- Double quotes for HTML attributes: `icon="pause"`, `class="ui button"`
- Template literals for multi-line HTML
- No string escaping needed

### Core Component Definition

Every spec file exports a complete component contract:

```javascript
export default {
  uiType: 'element',              // Component category
  name: 'Button',                 // Display name
  description: 'A button indicates a possible user action',
  tagName: 'ui-button',           // HTML tag name
  exportName: 'UIButton',         // JavaScript export name

  // Plural (collection) support
  supportsPlural: true,
  pluralName: 'Buttons',
  pluralTagName: 'ui-buttons',
  pluralExportName: 'UIButtons',
  pluralDescription: 'Buttons can exist together as a group',

  // Component sections
  content: [...],      // Slots and content areas
  types: [...],        // Behavioral variations (emphasis, styled)
  states: [...],       // Runtime states (hover, active, disabled)
  variations: [...],   // Visual variations (size, color, attached)
  settings: [...],     // Configurable properties with defaults
  events: [...],       // Custom events emitted

  // Plural-specific sections
  pluralContent: [...],           // Collection-only slots
  pluralOnlyTypes: [...],         // Collection-only behaviors
  pluralOnlyVariations: [...],   // Collection-only variations
  pluralSharedTypes: [],         // Which types inherit to collection
  pluralSharedVariations: [],    // Which variations inherit to collection

  // Examples for documentation
  examples: {
    defaultContent: '<span>Click Me</span>',
    defaultPluralContent: `
      <ui-button>One</ui-button>
      <ui-button>Two</ui-button>
    `,
    defaultAttributes: { primary: true },
  },
};
```

### Generated Files

The build system generates two files from each `.spec.js`:

1. **`{component}.spec.json`** - Machine-readable snapshot for LLMs and tooling
2. **`{component}.component.js`** - Optimized runtime spec for `defineComponent()`

**Important**: Never edit generated files directly. Always edit the source `.spec.js` files.

## Shared Terms System

To promote consistency and reduce duplication, common spec patterns are defined as reusable constants in `/packages/specs/src/shared-terms.js`.

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

**States** (state definitions):
```javascript
HOVER_STATE
FOCUS_STATE
ACTIVE_STATE
LOADING_STATE
PRESSED_STATE
DISABLED_STATE
```

**Types** (type definitions):
```javascript
EMPHASIS_TYPE
```

**Variations** (variation definitions):
```javascript
SIZE_VARIATION
FLUID_VARIATION
COMPACT_VARIATION
PADDED_VARIATION
COLORED_VARIATION
FLOATED_VARIATION
ATTACHED_VARIATION
HORIZONTAL_ALIGNED_VARIATION
VERTICAL_ALIGNED_VARIATION
CIRCULAR_VARIATION
```

### Helper Functions

**`getStates(stateNames)`** - Get multiple state constants:
```javascript
import { getStates } from '@semantic-ui/specs';

states: getStates(['hover', 'focus', 'active', 'disabled'])
// Returns: [HOVER_STATE, FOCUS_STATE, ACTIVE_STATE, DISABLED_STATE]
```

**`getVariations(variationNames)`** - Get multiple variation constants:
```javascript
import { getVariations } from '@semantic-ui/specs';

variations: [
  ...getVariations(['size', 'fluid', 'compact']),
  // Custom variations...
]
```

**`addOptionExamples(options, customExamples)`** - Add custom examples to shared options:
```javascript
import { ATTACHED_OPTIONS, addOptionExamples } from '@semantic-ui/specs';

options: addOptionExamples(ATTACHED_OPTIONS, {
  'top-attached': `
    <ui-button top-attached>Top Action</ui-button>
    <ui-segment bottom-attached>Content below</ui-segment>
  `,
  'bottom-attached': `
    <ui-segment top-attached>Content above</ui-segment>
    <ui-button bottom-attached>Bottom Action</ui-button>
  `,
})
```

**`filterVariationOptions(variation, filter)`** - Filter options by array or function:
```javascript
import { SIZE_VARIATION, filterVariationOptions } from '@semantic-ui/specs';

// Filter to subset of sizes
variations: [
  filterVariationOptions(SIZE_VARIATION, ['tiny', 'small', 'medium', 'large', 'big']),
]

// Or filter by function
filterVariationOptions(SIZE_VARIATION, opt => opt.value !== 'massive')
```

**`modifyVariation(variation, overrides)`** - Modify variation properties:
```javascript
import { ATTACHED_VARIATION, modifyVariation } from '@semantic-ui/specs';

variations: [
  modifyVariation(ATTACHED_VARIATION, {
    usageLevel: 3,
    options: addOptionExamples(ATTACHED_OPTIONS, { /* custom */ }),
  }),
]
```

**`withUsageLevel(item, usageLevel)`** - Override usage level:
```javascript
import { FLUID_VARIATION, withUsageLevel } from '@semantic-ui/specs';

variations: [
  withUsageLevel(FLUID_VARIATION, 2),  // Change from default usage level
]
```

### Example: Using Shared Terms

```javascript
import {
  SIZE_VARIATION,
  FLUID_VARIATION,
  COLORED_VARIATION,
  getStates,
  getVariations,
  modifyVariation,
  addOptionExamples,
} from '@semantic-ui/specs';

export default {
  name: 'Button',
  tagName: 'ui-button',

  // Use shared states
  states: getStates(['hover', 'pressed', 'focus', 'active', 'disabled', 'loading']),

  // Use shared variations
  variations: [
    ...getVariations(['size', 'fluid', 'compact']),

    // Customize shared variation with component-specific examples
    modifyVariation(COLORED_VARIATION, {
      options: addOptionExamples(COLOR_OPTIONS, {
        red: `<ui-button red>Red Button</ui-button>`,
        blue: `<ui-button blue>Blue Button</ui-button>`,
      }),
    }),

    // Mix with custom variations
    {
      name: 'Circular',
      attribute: 'circular',
      description: 'be rounded like a circle',
    },
  ],
};
```

## Spec Section Types Explained

### Content (Slots and Composition)
```javascript
{
  name: 'Icon',
  attribute: 'icon',              // Attribute that controls this content
  slot: 'icon',                   // Slot name (if using slots)
  couplesWith: ['ui-icon'],       // Related components
  description: 'include an icon',
  exampleCode: `<ui-button icon="pause">Pause</ui-button>`,
}
```

### Types (Core Behavioral Variations)
```javascript
{
  name: 'Emphasis',
  attribute: 'emphasis',          // Property name in component
  description: 'be emphasized in a layout',
  usageLevel: 1,                  // 1-5 (common to advanced)
  includeAttributeClass: true,    // Add attribute as CSS class
  separateExamples: true,         // Show each option separately in docs
  options: [
    {
      name: 'Primary',
      value: 'primary',            // Actual attribute value
      description: 'First action that should be taken',
      exampleCode: `<ui-button primary>Confirm</ui-button>`,
    },
    {
      name: 'Secondary',
      value: 'secondary',
      description: 'Secondary option',
    },
  ],
}
```

### States (Runtime Component States)
```javascript
{
  name: 'Disabled',
  attribute: 'disabled',
  includeAttributeClass: true,
  description: 'have interactions disabled',
  options: [
    {
      name: 'Disabled',
      value: 'disabled',
      description: 'disable interactions',
    },
    {
      name: 'Clickable Disabled',
      value: 'clickable-disabled',
      description: 'allow interactions but appear disabled',
    },
  ],
}
```

### Variations (Visual/Layout Modifications)
```javascript
{
  name: 'Size',
  attribute: 'size',
  usageLevel: 1,
  description: 'vary in size',
  options: [
    { name: 'Mini', value: 'mini', description: 'appear extremely small' },
    { name: 'Small', value: 'small', description: 'appear small' },
    { name: 'Medium', value: 'medium', description: 'appear normal sized' },
    { name: 'Large', value: 'large', description: 'appear larger than normal' },
  ],
}
```

### Settings (Component Configuration)
```javascript
{
  name: 'Icon Only',
  type: 'boolean',                // Data type
  attribute: 'icon-only',         // HTML attribute name
  defaultValue: false,            // Default value
  description: 'Enable to remove spacing for text',
}
```

### Usage Levels

Each spec property has a `usageLevel` (1-5) that enables progressive disclosure in documentation. This follows a **descriptive linguistics approach**: combining empirical observation (what patterns exist) with editorial judgment (how frequently users will need them).

Usage levels indicate how frequently users will need a feature:
- **1**: Essential, standard features - used in most implementations (80%+ of users)
- **2**: Common variations - frequently needed (40-80% of users)
- **3**: Advanced features - for specific use cases (15-40% of users)
- **4**: Specialized features - for edge cases (5-15% of users)
- **5**: Expert-level features - rarely needed (<5% of users)

Usage levels control documentation visibility (progressive disclosure) and should reflect expected usage frequency, not research adoption percentages.

## SpecReader API

### Creating a SpecReader Instance

```javascript
import { SpecReader } from '@semantic-ui/specs';
import buttonSpec from './button.spec.json';  // Generated JSON

// For singular component
const reader = new SpecReader(buttonSpec);

// For plural/collection component
const pluralReader = new SpecReader(buttonSpec, { plural: true });

// With specific dialect (attribute style)
const verboseReader = new SpecReader(buttonSpec, { dialect: 'verbose' });
```

### Generating Component Metadata

```javascript
// Generate optimized runtime spec for defineComponent
const componentSpec = reader.getWebComponentSpec();

// Result structure:
{
  tagName: 'ui-button',
  attributes: ['icon', 'emphasis', 'styled', ...],
  optionAttributes: {              // Reverse mapping for value→attribute
    'primary': 'emphasis',
    'secondary': 'emphasis',
    'solid': 'styled',
    'outline': 'styled',
  },
  propertyTypes: {                 // Type definitions
    'icon': 'string',
    'emphasis': 'string',
    'disabled': 'boolean',
  },
  allowedValues: {                 // Valid values per attribute
    'emphasis': ['primary', 'secondary'],
    'styled': ['solid', 'outline', 'ghost'],
  },
  defaultValues: {                 // Default settings
    'iconOnly': false,
    'iconAfter': false,
  },
  attributeClasses: ['icon', 'disabled'],  // Attributes that become CSS classes
}
```

### Generating Documentation

```javascript
// Get complete definition with examples
const definition = reader.getDefinition();

// Result structure:
{
  content: [...],     // Content examples with code
  types: [...],       // Type examples with code
  states: [...],      // State examples with code
  variations: [...],  // Variation examples with code
  settings: [...],    // Settings documentation
}

// Generate navigation menu for documentation
const menu = reader.getDefinitionMenu();

// Get ordered examples for display
const examples = reader.getOrderedExamples();
```

### Attribute Dialect Support

SpecReader supports three attribute dialects for flexibility:

```javascript
// Standard dialect (modifier-based)
reader.getCodeFromModifiers('large primary');
// Result: <ui-button large primary>Click Me</ui-button>

// Verbose dialect (explicit attributes)
const verboseReader = new SpecReader(spec, { dialect: 'verbose' });
verboseReader.getCodeFromModifiers('large primary');
// Result: <ui-button size="large" emphasis="primary">Click Me</ui-button>

// Classic dialect (class-based)
const classicReader = new SpecReader(spec, { dialect: 'classic' });
classicReader.getCodeFromModifiers('large primary');
// Result: <ui-button class="large primary">Click Me</ui-button>
```

## Integration with Component System

### How Specs Drive Component Definition

When a spec is provided to `defineComponent`, it **automatically configures the entire web component** - properties, attributes, types, defaults, and validation:

```javascript
// 1. Import the generated component spec
import componentSpec from './specs/button.component.js';

// 2. Pass to defineComponent - spec drives EVERYTHING
export const UIButton = defineComponent({
  tagName: 'ui-button',
  componentSpec,  // ← This configures the entire component API

  // You only need to provide the implementation
  template,  // How to render
  css,       // How to style
  createComponent,  // Behavior methods
  defaultState,     // Internal reactive state
});
```

### What the Spec Automatically Provides

When you pass `componentSpec` to `defineComponent`, it automatically:

1. **Creates Web Component Properties** - All attributes, types, states, variations, and settings become reactive properties
2. **Sets Up Type Conversion** - Handles string → boolean, string → number based on `propertyTypes`
3. **Enables Attribute Aliases** - Maps `primary` → `emphasis="primary"` via `optionAttributes`
4. **Provides Default Values** - Sets defaults for all settings from `defaultValues`
5. **Generates CSS Classes** - Creates the `ui` class string from current attributes
6. **Validates Allowed Values** - Ensures attributes only accept values from `allowedValues`

### How WebComponentBase Uses the Spec

```javascript
// In web-component.js
static getProperties({ componentSpec }) {
  const properties = {};

  // 1. Create properties for all spec attributes
  componentSpec.attributes.forEach(attr => {
    properties[kebabToCamel(attr)] = {
      type: componentSpec.propertyTypes[attr],
      converter: ..., // Based on type
      hasChanged: ... // Custom equality
    };
  });

  // 2. Handle option attributes (value → category mapping)
  Object.entries(componentSpec.optionAttributes).forEach(([value, category]) => {
    // <ui-button primary> creates a property that sets emphasis="primary"
    properties[value] = {
      type: String,
      noAccessor: true,
      alias: true
    };
  });

  // 3. Apply defaults from spec
  Object.entries(componentSpec.defaultValues).forEach(([name, value]) => {
    // Set default values for properties
  });

  return properties;
}
```

### Runtime Attribute Processing & Dialect Support

**Specs are REQUIRED to support all three dialects**. The `adjustPropertyFromAttribute` helper uses the spec's `optionAttributes` for bidirectional lookup:

```javascript
// Given spec optionAttributes:
{
  'primary': 'emphasis',
  'secondary': 'emphasis',
  'solid': 'styled'
}

// ALL THREE DIALECTS work automatically:

// 1. Standard dialect (concise boolean attributes)
<ui-button primary solid large>

// 2. Verbose dialect (explicit attributes)
<ui-button emphasis="primary" styled="solid" size="large">

// 3. Classic dialect (class-based)
<ui-button class="primary solid large">
```

The spec enables this through:
- **Forward lookup**: `primary` → finds `emphasis` attribute
- **Reverse lookup**: `emphasis="primary"` → validates `primary` is allowed
- **Class parsing**: Splits classes and checks each against `optionAttributes`

### CSS Class Generation from Spec

The spec drives the `ui` class string generation:

```javascript
// In template, {ui} is automatically populated:
template: `<button class="{ui} button">...</button>`

// Given current attributes:
<ui-button primary large fluid>

// The spec generates:
ui = 'primary large fluid '  // Based on current attribute values
```

### Why Use Specs with defineComponent?

1. **Zero Boilerplate** - No need to manually define properties, types, or converters
2. **Dialect Support** - Specs are REQUIRED to support all three HTML dialects (standard, verbose, classic)
3. **Automatic Validation** - The spec enforces allowed values and types
4. **Bidirectional Lookup** - `optionAttributes` enables both value→attribute and attribute→value mapping
5. **Documentation Sync** - The same spec drives both runtime and docs
6. **Single Source of Truth** - One spec defines the entire component API

## Build Pipeline Integration

### Spec Generation Process

The build system (`/internal-packages/scripts/src/build-ui-deps.js`) processes specs:

```javascript
// 1. Find all .spec.js source files
const specJsFiles = await glob('src/primitives/**/specs/*.spec.js');

// 2. For each spec, load and validate
await asyncEach(specJsFiles, async (entryPath) => {
  // Load JS module with cache busting for watch mode
  const specModule = await import(`${pathToFileURL(entryPath).href}?t=${Date.now()}`);
  const spec = specModule.default;

  // Validate JS specs are pure data (JSON-serializable)
  validateSpec(spec, entryPath);

  // Generate JSON snapshot for machine readability (LLMs, tooling)
  const jsonPath = entryPath.replace('.spec.js', '.spec.json');
  const jsonContent = `${JSON.stringify(spec, null, 2)}\n`;
  writeFileSync(jsonPath, jsonContent);

  // Generate component spec JS
  const reader = new SpecReader(spec);
  const componentSpec = reader.getWebComponentSpec();
  const componentJSPath = entryPath.replace('.spec.js', '.component.js');
  writeFileSync(componentJSPath, `export default ${JSON.stringify(componentSpec, null, 2)};\n`);

  // Generate plural variant if supported
  if (spec.supportsPlural) {
    const pluralReader = new SpecReader(spec, { plural: true });
    const pluralSpec = pluralReader.getWebComponentSpec();
    const pluralName = spec.pluralTagName.replace('ui-', '');
    writeFileSync(`${pluralName}.component.js`, `export default ${JSON.stringify(pluralSpec, null, 2)};\n`);
  }
});
```

### Spec Validation

The `validateSpec()` function ensures specs are pure data:

```javascript
// Checks for:
// - Required fields (uiType, name, description, tagName, exportName)
// - JSON-serializability
// - No functions, dates, or regexes
// - All values are primitives, arrays, or plain objects

validateSpec(spec, entryPath);
// Throws if spec is invalid
```

### Output Locations

| File Type | Location | Purpose | Source |
|-----------|----------|---------|--------|
| Source spec JS | `src/primitives/[comp]/specs/[comp].spec.js` | Human-editable definition | Manual |
| Generated spec JSON | `src/primitives/[comp]/specs/[comp].spec.json` | Machine-readable snapshot | Generated |
| Generated component spec | `src/primitives/[comp]/specs/[comp].component.js` | Runtime metadata | Generated |
| Spec exports | `src/primitives/[comp]/specs.js` | Barrel file for imports | Manual |

### Watch Mode

The build script includes watch mode with proper cache busting:

```javascript
// Cache-busting query parameter forces module reload
const specModule = await import(`${pathToFileURL(entryPath).href}?t=${Date.now()}`);

// This ensures changes to .spec.js files trigger regeneration
// Without cache busting, Node.js would return cached module
```

## Plural Component Inheritance

Plural components inherit selectively from their singular counterparts:

```javascript
// Spec defines what plural components inherit
{
  pluralSharedTypes: [],          // Shared behavioral types
  pluralSharedVariations: [       // Shared visual variations
    'size',
    'floated',
    'color',
    'styled'
  ],
  pluralSharedStates: [],         // Shared states

  pluralOnlyTypes: [              // Exclusive to plural
    {
      name: 'vertical',
      attribute: 'vertical',
      description: 'Show buttons in a vertical stack'
    }
  ]
}

// SpecReader filters based on plural mode
if (plural) {
  // Only includes attributes listed in pluralShared* arrays
  const allowedVariations = spec.pluralSharedVariations;
  variations = variations.filter(v =>
    allowedVariations.includes(v.attribute)
  );
}
```

## Documentation Generation Pattern

```javascript
// In Astro documentation pages
import { SpecReader } from '@semantic-ui/specs';
import * as Specs from '@semantic-ui/core/specs';

// Get generated JSON spec
const spec = Specs.ButtonSpec;

// Create reader
const reader = new SpecReader(spec);

// Generate documentation data
const definition = reader.getDefinition();
const menu = reader.getDefinitionMenu();

// Render examples
definition.types.forEach(type => {
  type.examples.forEach(example => {
    // Render example.code as HTML
    // Show example.components for breakdown
  });
});
```

## Key Patterns and Best Practices

### When Modifying Specs

1. **Edit .spec.js, not generated files** - Always modify the source `.spec.js` files, never `.spec.json` or `.component.js`
2. **Run build after changes** - Use `npm run build:ui-deps` to regenerate
3. **Consider plural impact** - Changes affect both singular and plural components
4. **Use template literals** - Clean HTML without escaping
5. **Import shared terms** - Reuse constants instead of duplicating
6. **Set appropriate usage levels** - Use 1-5 scale for progressive disclosure
7. **Validate changes** - Build system validates specs are pure data

### Spec Design Principles

1. **Declarative over Imperative** - Describe what, not how
2. **Single Source of Truth** - All component metadata in one place
3. **Documentation as Configuration** - Examples are part of the spec
4. **Progressive Complexity** - Usage levels enable graduated learning
5. **Dialect Flexibility** - Support multiple attribute syntaxes
6. **DRY with Shared Terms** - Reuse constants and helpers

### Common Spec Patterns

```javascript
// Boolean attribute with CSS class
{
  name: 'Disabled',
  attribute: 'disabled',
  includeAttributeClass: true,  // Adds .disabled class
  description: 'disable interactions'
}

// Enumeration with shared options
import { SIZE_VARIATION } from '@semantic-ui/specs';

variations: [
  SIZE_VARIATION,  // Reuse shared size scale
]

// Enumeration with filtered options
import { SIZE_VARIATION, filterVariationOptions } from '@semantic-ui/specs';

variations: [
  filterVariationOptions(SIZE_VARIATION, ['small', 'medium', 'large']),
]

// Complex option with custom examples
import { ATTACHED_VARIATION, addOptionExamples } from '@semantic-ui/specs';

variations: [
  modifyVariation(ATTACHED_VARIATION, {
    options: addOptionExamples(ATTACHED_OPTIONS, {
      'top-attached': `<ui-button top-attached>Action</ui-button>`,
    }),
  }),
]
```

## Integration with Framework Packages

### With Component Package

```javascript
// Component uses spec for configuration
import { defineComponent } from '@semantic-ui/component';
import componentSpec from './specs/button.component.js';

defineComponent({
  componentSpec,  // Drives property definitions
  // ...
});
```

### With Templating Package

```javascript
// Templates can access spec-defined properties
const template = `
  {#if primary}        <!-- Spec-defined type -->
    <div class="primary-emphasis">
  {/if}

  {#if size === 'large'}  <!-- Spec-defined variation -->
    <div class="large-content">
  {/if}
`;
```

### With Reactivity Package

```javascript
// Spec properties become reactive
createComponent({ state, settings }) {
  // Spec-defined settings are reactive
  reaction(() => {
    if (settings.emphasis === 'primary') {
      // React to spec-defined property changes
    }
  });
}
```

### With Utils Package

```javascript
// SpecReader uses utils extensively
import {
  capitalize,
  mapObject,
  reverseKeys,
  filterObject
} from '@semantic-ui/utils';

// Generates reverse mappings for fast lookup
const optionAttributes = reverseKeys(allowedValues);
```

## Performance Considerations

1. **Compile-time Processing** - Specs are processed at build time, not runtime
2. **Shared AST** - Component specs are shared across all instances
3. **Optimized Lookups** - `optionAttributes` provides O(1) attribute resolution
4. **Minimal Runtime Overhead** - Generated specs contain only necessary data
5. **Cache Busting** - Watch mode uses timestamps to force module reload

## Common Use Cases

1. **Adding a New Component Variation**
   - Edit the `.spec.js` file
   - Add to appropriate section (types/variations/states)
   - Include example code with template literals
   - Consider using shared terms
   - Rebuild with `npm run build:ui-deps`

2. **Creating Documentation**
   - Use SpecReader to generate examples
   - Filter by usage level for progressive disclosure
   - Generate navigation menus automatically

3. **Validating Component Usage**
   - Check `allowedValues` for valid options
   - Use `propertyTypes` for type validation
   - Reference `defaultValues` for initialization

4. **TypeScript Generation**
   - Specs drive TypeScript definition generation
   - Ensures types match runtime behavior
   - Single source of truth for typing

## Migration from JSON to JavaScript

**Note**: This system was recently migrated from JSON source files to JavaScript. The key changes:

1. **Source format**: `.json` → `.spec.js` (JavaScript modules)
2. **Generated JSON**: `.spec.json` is now a generated file, not the source
3. **File naming**: Dot-style (`.component.js`) instead of dash-style (`-component.js`)
4. **Shared terms**: New system for reusable constants and helpers
5. **Template literals**: Clean HTML without escaping

Old JSON specs are no longer supported. All specs must be JavaScript modules that export pure data.

## Key Principles

1. **Specs Define Contracts** - They describe what components can do, not how
2. **Multiple Output Formats** - One spec generates runtime, docs, and types
3. **Declarative Configuration** - JavaScript specs with pure data avoid code duplication
4. **Progressive Disclosure** - Usage levels support graduated learning
5. **Dialect Flexibility** - Multiple attribute styles for developer preference
6. **Build-Time Optimization** - Heavy processing happens during build
7. **Component Inheritance** - Plural components selectively inherit from singular
8. **Shared Terms** - Reusable constants promote consistency
9. **Pure Data** - Specs must be JSON-serializable (validated at build time)

This spec system provides a powerful foundation for maintaining consistency across component implementation, documentation, and typing while enabling flexible component APIs and supporting multiple developer preferences.

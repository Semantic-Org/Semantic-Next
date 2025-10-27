# Semantic UI Specs Package Guide

**For AI agents working with Semantic UI's `@semantic-ui/specs` package**

## Overview

The `@semantic-ui/specs` package is the **declarative metadata backbone** of Semantic UI that defines component APIs, behaviors, and documentation through JSON specifications. It serves as a single source of truth that drives component creation, attribute validation, documentation generation, and TypeScript definitions across the entire framework.

**Key Concept**: Specs are **not code** - they are **component contracts** that describe what a component can do, what attributes it accepts, and how it should behave. The framework reads these specs to configure actual component implementations.

## Package Structure

```
@semantic-ui/specs
├── SpecReader       ← Core class that processes spec JSON files
├── Spec Files       ← JSON definitions in src/primitives/*/specs/*.json
├── Component Specs  ← Generated runtime metadata for components
└── Build Pipeline   ← Transforms specs into multiple output formats
```

**Main Export**:
```javascript
import { SpecReader } from '@semantic-ui/specs';
```

## Mental Model: The Spec Transformation Pipeline

Understanding specs requires thinking about the data transformation pipeline:

```
Component Definition (button.json)
    ↓ SpecReader.getWebComponentSpec()
Component Runtime Metadata (button-component.js)
    ↓ defineComponent({ componentSpec })
Web Component Configuration
    ↓ WebComponentBase.getProperties()
Property Definitions & Attribute Mapping
```

**Parallel Pipeline for Documentation**:
```
Component Definition (button.json)
    ↓ SpecReader.getDefinition()
Documentation Objects with Examples
    ↓ Template System
Rendered Documentation Pages
```

## Spec JSON Structure

### Core Component Definition

Every spec file defines a complete component contract:

```json
{
  "uiType": "element",              // Component category
  "name": "Button",                 // Display name
  "description": "A button indicates a possible user action",
  "tagName": "ui-button",           // HTML tag name
  "exportName": "UIButton",         // JavaScript export name

  // Plural (collection) support
  "supportsPlural": true,
  "pluralName": "Buttons",
  "pluralTagName": "ui-buttons",
  "pluralExportName": "UIButtons",
  "pluralDescription": "Buttons can exist together as a group",

  // Component sections
  "content": [...],      // Slots and content areas
  "types": [...],        // Behavioral variations (emphasis, styled)
  "states": [...],       // Runtime states (hover, active, disabled)
  "variations": [...],   // Visual variations (size, color, attached)
  "settings": [...],     // Configurable properties with defaults
  "events": [...],       // Custom events emitted

  // Plural-specific sections
  "pluralContent": [...],           // Collection-only slots
  "pluralOnlyTypes": [...],         // Collection-only behaviors
  "pluralOnlyVariations": [...],   // Collection-only variations
  "pluralSharedTypes": [],         // Which types inherit to collection
  "pluralSharedVariations": [],    // Which variations inherit to collection

  // Examples for documentation
  "examples": {
    "defaultContent": "<span>Click Me</span>",
    "defaultPluralContent": "<ui-button>One</ui-button>\n<ui-button>Two</ui-button>",
    "defaultAttributes": { "primary": true }
  }
}
```

### Spec Section Types Explained

#### Content (Slots and Composition)
```json
{
  "name": "Icon",
  "attribute": "icon",              // Attribute that controls this content
  "slot": "icon",                  // Slot name (if using slots)
  "couplesWith": ["ui-icon"],     // Related components
  "description": "include an icon",
  "exampleCode": "<ui-button icon=\"pause\">Pause</ui-button>"
}
```

#### Types (Core Behavioral Variations)
```json
{
  "name": "Emphasis",
  "attribute": "emphasis",         // Property name in component
  "description": "be emphasized in a layout",
  "usageLevel": 1,                // 1-5 (common to advanced)
  "includeAttributeClass": true,   // Add attribute as CSS class
  "separateExamples": true,        // Show each option separately in docs
  "options": [
    {
      "name": "Primary",
      "value": "primary",          // Actual attribute value
      "description": "First action that should be taken",
      "exampleCode": "<ui-button primary>Confirm</ui-button>"
    },
    {
      "name": "Secondary",
      "value": "secondary",
      "description": "Secondary option"
    }
  ]
}
```

#### States (Runtime Component States)
```json
{
  "name": "Disabled",
  "attribute": "disabled",
  "includeAttributeClass": true,
  "description": "have interactions disabled",
  "options": [
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
}
```

#### Variations (Visual/Layout Modifications)
```json
{
  "name": "Size",
  "attribute": "size",
  "usageLevel": 1,
  "description": "vary in size",
  "options": [
    { "name": "Mini", "value": "mini", "description": "appear extremely small" },
    { "name": "Small", "value": "small", "description": "appear small" },
    { "name": "Medium", "value": "medium", "description": "appear normal sized" },
    { "name": "Large", "value": "large", "description": "appear larger than normal" }
  ]
}
```

#### Settings (Component Configuration)
```json
{
  "name": "Icon Only",
  "type": "boolean",               // Data type
  "attribute": "icon-only",        // HTML attribute name
  "defaultValue": false,           // Default value
  "description": "Enable to remove spacing for text"
}
```

### Usage Levels

Each spec property has a `usageLevel` (1-5) that enables progressive disclosure:
- **1**: Essential, common features shown by default
- **2**: Frequently used variations
- **3**: Advanced features for specific use cases
- **4**: Specialized features for edge cases
- **5**: Rarely used, expert-level features

## SpecReader API

### Creating a SpecReader Instance

```javascript
import { SpecReader } from '@semantic-ui/specs';
import buttonSpec from './button.json';

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
  tagName: "ui-button",
  attributes: ["icon", "emphasis", "styled", ...],
  optionAttributes: {              // Reverse mapping for value->attribute
    "primary": "emphasis",
    "secondary": "emphasis",
    "solid": "styled",
    "outline": "styled"
  },
  propertyTypes: {                  // Type definitions
    "icon": "string",
    "emphasis": "string",
    "disabled": "boolean"
  },
  allowedValues: {                  // Valid values per attribute
    "emphasis": ["primary", "secondary"],
    "styled": ["solid", "outline", "ghost"]
  },
  defaultValues: {                  // Default settings
    "iconOnly": false,
    "iconAfter": false
  },
  attributeClasses: ["icon", "disabled"]  // Attributes that become CSS classes
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
  settings: [...]     // Settings documentation
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
import buttonSpec from './specs/button-component.js';

// 2. Pass to defineComponent - spec drives EVERYTHING
export const UIButton = defineComponent({
  tagName: 'ui-button',
  componentSpec: buttonSpec,  // ← This configures the entire component API

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
  "primary": "emphasis",
  "secondary": "emphasis",
  "solid": "styled"
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
ui = "primary large fluid "  // Based on current attribute values
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
// 1. Read JSON spec files
const specFiles = glob('src/primitives/*/specs/*.json');

// 2. For each spec, generate singular and plural component specs
specFiles.forEach(specFile => {
  const spec = JSON.parse(readFile(specFile));

  // Generate singular component spec
  const reader = new SpecReader(spec);
  const componentSpec = reader.getWebComponentSpec();
  writeFile(`${name}-component.js`, componentSpec);

  // Generate plural component spec if supported
  if (spec.supportsPlural) {
    const pluralReader = new SpecReader(spec, { plural: true });
    const pluralSpec = pluralReader.getWebComponentSpec();
    writeFile(`${pluralName}-component.js`, pluralSpec);
  }
});
```

### Output Locations

| File Type | Location | Purpose |
|-----------|----------|---------|
| Source spec JSON | `src/primitives/[comp]/specs/[comp].json` | Human-editable definition |
| Generated component spec | `src/primitives/[comp]/specs/[comp]-component.js` | Runtime metadata |
| Spec exports | `src/specs/specs.js` | Raw spec exports |
| Component spec exports | `src/specs/component-specs.js` | Component metadata exports |

## Plural Component Inheritance

Plural components inherit selectively from their singular counterparts:

```javascript
// Spec defines what plural components inherit
{
  "pluralSharedTypes": [],          // Shared behavioral types
  "pluralSharedVariations": [       // Shared visual variations
    "size",
    "floated",
    "color",
    "styled"
  ],
  "pluralSharedStates": [],         // Shared states

  "pluralOnlyTypes": [              // Exclusive to plural
    {
      "name": "vertical",
      "attribute": "vertical",
      "description": "Show buttons in a vertical stack"
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

// Get raw spec
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

1. **Edit JSON, not generated files** - Always modify the source `.json` files
2. **Run build after changes** - Use `npm run build:ui-deps` to regenerate
3. **Consider plural impact** - Changes affect both singular and plural components
4. **Document with examples** - Include `exampleCode` for complex features
5. **Set appropriate usage levels** - Use 1-5 scale for progressive disclosure

### Spec Design Principles

1. **Declarative over Imperative** - Describe what, not how
2. **Single Source of Truth** - All component metadata in one place
3. **Documentation as Configuration** - Examples are part of the spec
4. **Progressive Complexity** - Usage levels enable graduated learning
5. **Dialect Flexibility** - Support multiple attribute syntaxes

### Common Spec Patterns

```json
// Boolean attribute with CSS class
{
  "name": "Disabled",
  "attribute": "disabled",
  "includeAttributeClass": true,  // Adds .disabled class
  "description": "disable interactions"
}

// Enumeration with options
{
  "name": "Size",
  "attribute": "size",
  "options": [
    { "value": "small", "description": "..." },
    { "value": "large", "description": "..." }
  ]
}

// Complex option with multiple values
{
  "name": "Animated",
  "options": [
    {
      "value": ["horizontal-animated"],  // Array of classes
      "exampleCode": "<ui-button animated>..."
    }
  ]
}
```

## Integration with Framework Packages

### With Component Package

```javascript
// Component uses spec for configuration
import { defineComponent } from '@semantic-ui/component';
import componentSpec from './specs/button-component.js';

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

## Common Use Cases

1. **Adding a New Component Variation**
   - Edit the spec JSON file
   - Add to appropriate section (types/variations/states)
   - Include example code
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

## Key Principles

1. **Specs Define Contracts** - They describe what components can do, not how
2. **Multiple Output Formats** - One spec generates runtime, docs, and types
3. **Declarative Configuration** - JSON specs avoid code duplication
4. **Progressive Disclosure** - Usage levels support graduated learning
5. **Dialect Flexibility** - Multiple attribute styles for developer preference
6. **Build-Time Optimization** - Heavy processing happens during build
7. **Component Inheritance** - Plural components selectively inherit from singular

This spec system provides a powerful foundation for maintaining consistency across component implementation, documentation, and typing while enabling flexible component APIs and supporting multiple developer preferences.
---
title: Scaffold New Primitive
description: Workflow for creating the complete file structure for a new UI primitive in Semantic UI, including specs, CSS, templates, and framework integration points.
keywords: [scaffolding, primitives, file structure, specs, CSS architecture, barrel files]
audience: contributing
type: workflow
workflow: primitive-scaffold
---

# Scaffold New Primitive

> **Skill:** `sui:primitive-scaffold`
> **Purpose:** Create the complete file structure for a new UI primitive in Semantic UI

## Lifecycle Context

This is the **first step** in creating a new primitive.
- **Before**: Decision to create a new primitive
- **After**: `primitive-refine.md` (define and author the spec), then `primitive-write-css.md` (implement CSS)
- **Reference**: Load `sui:component-specs` skill for spec format details

## Overview

UI primitives (or "primitives") in Semantic UI are spec-driven components that live in `/src/primitives/` and are powered by **JavaScript specifications** (`.spec.js` files) that define their entire API. This workflow creates the minimal file structure and integration points for a new primitive that can then be incrementally developed.

> **Note**: Specs are authored as `.spec.js` files (JavaScript modules), not JSON. The build system generates `.spec.json` snapshots for tooling.

**Key Principle**: Start with an empty spec stub and minimal implementation, allowing incremental feature addition through the spec authoring workflow.

## Deciding on Plural Support

Before scaffolding, determine if the primitive should support plural forms:

**Components that typically support plural:**
- **Collections of interactive elements**: buttons, cards, items, fields
- **Layout groups**: segments, columns, rows
- **Navigation groups**: menu items, tabs, steps

**Components that typically DON'T support plural:**
- **Structural elements**: divider, rail, container, modal
- **Single-instance elements**: loader, dimmer, progress
- **Content separators**: header, footer, sidebar

**Decision criteria:**
- Does it make semantic sense to have multiple grouped together?
- Would the group have different behavior than individuals?
- Would users naturally expect a plural version?

Examples:
- ✅ `ui-buttons` makes sense - a group of buttons
- ❌ `ui-dividers` doesn't make sense - dividers separate, they don't group
- ✅ `ui-cards` makes sense - a collection of cards
- ❌ `ui-modals` doesn't make sense - modals are singular overlays

## Primitive Structure

```
src/primitives/[primitive-name]/
├── specs/
│   ├── [primitive-name].spec.js       # Primitive spec source (you author this)
│   ├── [primitive-name].spec.json     # Auto-generated JSON snapshot
│   ├── [primitive-name].component.js  # Auto-generated component spec
│   └── [plural-name].component.js     # Auto-generated if plural supported
├── css/
│   ├── [primitive-name].css           # Main CSS bundle import
│   ├── [primitive-name]-theme.css     # Theme layer barrel
│   ├── [primitive-name]-definition.css # Definition layer barrel
│   ├── theme/
│   │   └── [primitive-name]-theme.css # Theme variables stub
│   └── definition/
│       └── [primitive-name].css       # Base primitive styles
├── [primitive-name].js              # Primitive implementation
├── [primitive-name].html            # Primitive template
├── index.js                         # Barrel export
├── specs.js                         # Spec barrel export
└── [primitive-name]-bundle.css     # Auto-generated CSS bundle
```

## Step-by-Step Process

### Step 1: Create Spec Stub

Create `/src/primitives/[primitive-name]/specs/[primitive-name].spec.js`:

```javascript
// Primitive spec stub - expand via primitive-refine workflow
export default {
  uiType: 'element',
  name: '[PrimitiveName]',
  description: '[Brief description of primitive purpose]',
  tagName: 'ui-[primitive-name]',
  exportName: 'UI[PrimitiveName]',
  content: [],
  types: [],
  states: [],
  variations: [],
  settings: [],
  events: [],
  supportsPlural: false,
  examples: {
    defaultAttributes: {},
    defaultContent: '',
    defaultPluralContent: '',
  },
};
```

**Naming Conventions**:
- `name`: PascalCase (e.g., "Button", "Table", "Modal")
- `tagName`: Always `ui-[kebab-case]`
- `exportName`: Always `UI[PascalName]`

### Step 2: Create HTML Template

Create `/src/primitives/[primitive-name]/[primitive-name].html`:

```html
<div class="{ui}[primitive-name]">
  <slot></slot>
</div>
```

**Critical**: No space between `{ui}` and primitive name

### Step 3: Create JavaScript Primitive

Create `/src/primitives/[primitive-name]/[primitive-name].js`:

```javascript
import { defineComponent } from '@semantic-ui/component';

import css from './[primitive-name]-bundle.css?raw';
import template from './[primitive-name].html?raw';
import componentSpec from './specs/[primitive-name]-component.js';

const createComponent = ({ $ }) => ({});

const UI[PrimitiveName] = defineComponent({
  tagName: 'ui-[primitive-name]',
  componentSpec,
  template,
  css,
  createComponent,
});

export { UI[PrimitiveName] };
```

**Important**:
- Import from `[primitive-name]-component.js` (auto-generated), NOT the JSON directly
- Always include `createComponent` even if empty
- Export using destructuring: `export { UI[PrimitiveName] }`

### Step 4: Create CSS Structure

#### 4a. Create Directory Structure
```bash
mkdir -p /src/primitives/[primitive-name]/css/definition/{content,states,types,variations}
mkdir -p /src/primitives/[primitive-name]/css/theme/{content,states,types,variations}
```

**Note**: Only add `plural` directories if `supportsPlural: true`:
```bash
mkdir -p /src/primitives/[primitive-name]/css/definition/plural
mkdir -p /src/primitives/[primitive-name]/css/theme/plural
```

#### 4b. Main CSS Bundle
Create `/src/primitives/[primitive-name]/css/[primitive-name].css`:

```css
@import url('./definition/[primitive-name]-definition.css');
@import url('./theme/[primitive-name]-theme.css');
```

**Important**: No layer declarations in this file (esbuild handles them from barrels)

#### 4c. Definition Barrel
Create `/src/primitives/[primitive-name]/css/definition/[primitive-name]-definition.css`:

```css
/* Content */
@import url('./content/[primitive-name].css') layer([primitive-name].definition.content.[primitive-name]);

/* Group (only if supportsPlural: true) */
/* @import url('./plural/[plural-name].css') layer([primitive-name].definition.plural); */

/* States */
/* Example: @import url('./states/state.css') layer([primitive-name].definition.states.state); */

/* Types */
/* Example: @import url('./types/type.css') layer([primitive-name].definition.types.type); */

/* Variations */
/* Example: @import url('./variations/variation.css') layer([primitive-name].definition.variations.variation); */
```

#### 4d. Theme Barrel
Create `/src/primitives/[primitive-name]/css/theme/[primitive-name]-theme.css`:

```css
/*******************************
            [Primitive]
*******************************/

/* Content */
@import url('./content/[primitive-name]-variables.css') layer([primitive-name].theme.content.[primitive-name]);

/* Group (only if supportsPlural: true) */
/* @import url('./plural/[plural-name]-variables.css') layer([primitive-name].theme.plural); */

/* Types */
/* Example: @import url('./types/type-variables.css') layer([primitive-name].theme.types.type); */

/* States */
/* Example: @import url('./states/state-variables.css') layer([primitive-name].theme.states.state); */

/* Variations */
/* Example: @import url('./variations/variation-variables.css') layer([primitive-name].theme.variations.variation); */
```

#### 4e. Content Stub Files
Create `/src/primitives/[primitive-name]/css/definition/content/[primitive-name].css`:

```css
/*******************************
            [Primitive]
*******************************/

:host {
  /* Host styles will be added here */
}

.[primitive-name] {
  /* Base [primitive-name] styles will be added here */
}
```

Create `/src/primitives/[primitive-name]/css/theme/content/[primitive-name]-variables.css`:

```css
/*******************************
         [Primitive] Variables
*******************************/

:host {
  /* Theme variables will be added here */
}
```

### Step 5: Create Barrel Files

#### 5a. Primitive Export
Create `/src/primitives/[primitive-name]/index.js`:

```javascript
export { UI[PrimitiveName] } from './[primitive-name].js';
```

#### 5b. Spec Export
Create `/src/primitives/[primitive-name]/specs.js`:

```javascript
export { default as [PrimitiveName]Spec } from './specs/[primitive-name].js';
export { default as [PrimitiveName]ComponentSpec } from './specs/[primitive-name]-component.js';
```

### Step 6: Update Framework Exports

#### 6a. Update Primitives Index
Edit `/src/primitives/index.js`:

```javascript
// Add in alphabetical order
export { UI[PrimitiveName] } from './[primitive-name]/index.js';
```

#### 6b. Update Spec Barrels
Edit `/src/specs/specs.js`:

```javascript
// [PrimitiveName]
export { [PrimitiveName]ComponentSpec, [PrimitiveName]Spec } from '../primitives/[primitive-name]/specs.js';
```

Edit `/src/specs/component-specs.js`:

```javascript
export { [PrimitiveName]ComponentSpec } from '../primitives/[primitive-name]/specs.js';
```

#### 6c. Update Package.json Exports
Add to `package.json` exports field (maintain alphabetical order):

```json
"./[primitive-name]": {
  "import": "./src/primitives/[primitive-name]/index.js",
  "browser": "./dist/cdn/[primitive-name].min.js",
  "bundled": "./dist/bundle/[primitive-name].min.js",
  "default": "./src/primitives/[primitive-name]/index.js"
}
```

### Step 7: Create Documentation

Create `/docs/src/content/primitives/[primitive-name].mdx`:

```mdx
---
id: '[primitive-name]'
title: '[PrimitiveName]'
specName: '[PrimitiveName]Spec'
tabs: ['singular', 'spec']
description: '[Primitive description matching spec]'
tags: ['web-component']
---
```

**Note**: Add `'plural'` to tabs array if `supportsPlural: true`

### Step 8: Update Astro Component Registry

Edit `/docs/src/components/UIComponent.astro`:

1. Add import:
```javascript
import {
  // ... existing imports
  UI[PrimitiveName],
} from '@semantic-ui/core';
```

2. Add rendering case (maintain alphabetical order):
```jsx
{name === 'UI[PrimitiveName]' && (
  <UI[PrimitiveName] {...attributes} client:load>
    <slot />
  </UI[PrimitiveName]>
)}
```

## Build and Verification

**IMPORTANT FOR AI AGENTS:** Do not run the build command. The user will handle the build process.

For human users, after scaffolding run:

```bash
npm run build:ui-deps
```

This will:
- Generate `[component-name].js` and `[component-name]-component.js` from the spec
- Bundle CSS into `[component-name]-bundle.css`
- Make the component available for use

## Next Steps

After scaffolding:

1. **Refine the spec** - Use `primitive-refine.md` workflow to define types, variations, states, etc.
2. **Implement CSS** - Use `primitive-write-css.md` workflow for styling
3. **Add behavior** - Implement `createComponent` methods and events
4. **Create examples** - Add example code to spec and documentation

## Plural Support Pattern

When a primitive supports plural forms (like button/buttons, card/cards), follow this additional structure:

### Step 1: Update Spec for Plural

Update `/src/primitives/[primitive-name]/specs/[primitive-name].spec.js`:

```javascript
export default {
  // ... existing fields ...
  supportsPlural: true,
  pluralName: '[PluralName]',
  pluralTagName: 'ui-[plural-name]',
  pluralExportName: 'UI[PluralName]',
  pluralDescription: '[PluralName] can exist together as a group',
  pluralContent: [],
  pluralSharedTypes: [],
  pluralSharedVariations: [],
  pluralSharedStates: [],
  pluralOnlyTypes: [],
  pluralOnlyVariations: [],
};
```

### Step 2: Create Plural Structure

```
src/primitives/[primitive-name]/
├── plural/
│   ├── [plural-name].js
│   └── [plural-name].html
└── ... (existing files)
```

### Step 3: Create Plural Template

Create `/src/primitives/[primitive-name]/plural/[plural-name].html`:

```html
<div class="{{ui}} [plural-name]">
  {{>slot}}
</div>
```

**Critical**: Plural templates use `{{ui}}` with double curly braces and spaces

### Step 4: Create Plural Component

Create `/src/primitives/[primitive-name]/plural/[plural-name].js`:

```javascript
import { defineComponent } from '@semantic-ui/component';

import css from '../[primitive-name]-bundle.css?raw';
import componentSpec from '../specs/[plural-name]-component.js';
import template from './[plural-name].html?raw';

export const UI[PluralName] = defineComponent({
  tagName: 'ui-[plural-name]',
  singularTag: 'ui-[primitive-name]',
  plural: true,
  componentSpec,
  template,
  css,
});
```

**Important Differences from Singular**:
- Imports CSS from parent directory (`../[primitive-name]-bundle.css`)
- Imports plural component spec (`[plural-name]-component.js`)
- Adds `plural: true`
- Adds `singularTag: 'ui-[primitive-name]'`
- No `createComponent` function needed

### Step 5: Update Index Export

Edit `/src/primitives/[primitive-name]/index.js`:

```javascript
export { UI[PrimitiveName] } from './[primitive-name].js';
export { UI[PluralName] } from './plural/[plural-name].js';
```

### Step 6: Update Primitives Index

Edit `/src/primitives/index.js`:

```javascript
// Add both singular and plural exports
export { UI[PrimitiveName], UI[PluralName] } from './[primitive-name]/index.js';
```

### Step 7: Update Documentation

Edit `/docs/src/content/primitives/[primitive-name].mdx`:

```mdx
---
id: '[primitive-name]'
title: '[PrimitiveName]'
specName: '[PrimitiveName]Spec'
tabs: ['singular', 'plural', 'spec']  # Add 'plural' to tabs
description: '[Primitive description matching spec]'
tags: ['web-component']
---
```

### Step 8: Update Astro Registry for Plural

Add both to `/docs/src/components/UIComponent.astro`:

```javascript
import {
  // ... existing imports
  UI[PrimitiveName],
  UI[PluralName],
} from '@semantic-ui/core';
```

Add rendering cases for both:

```jsx
{name === 'UI[PrimitiveName]' && (
  <UI[PrimitiveName] {...attributes} client:load>
    <slot />
  </UI[PrimitiveName]>
)}
{name === 'UI[PluralName]' && (
  <UI[PluralName] {...attributes} client:load>
    <slot />
  </UI[PluralName]>
)}

### Component with Settings

For components with configurable properties, add to the `.spec.js`:

```javascript
settings: [
  {
    name: 'Value',
    type: 'string',
    attribute: 'value',
    description: 'The component value',
  },
],
```

## Validation Checklist

- [ ] Spec `.spec.js` is valid and follows naming conventions
- [ ] Component imports from `-component.js` not `.json`
- [ ] CSS directory structure created with all folders
- [ ] CSS barrel files created in correct locations (definition/ and theme/)
- [ ] CSS layer names match component name and follow pattern
- [ ] Content stub files created (content/[name].css and content/[name]-variables.css)
- [ ] Main CSS bundle imports barrel files (no layers)
- [ ] All JS barrel files updated
- [ ] Package.json exports added
- [ ] MDX documentation created
- [ ] Astro registry updated

## Common Mistakes to Avoid

1. **Importing spec JSON directly** - Always import from generated `-component.js`
2. **Space in template class** - Must be `{ui}component` not `{ui} component`
3. **Missing createComponent** - Even if empty, it's required
4. **Wrong export syntax** - Use `export { UIComponent }` not `export default`
5. **Forgetting barrel updates** - Must update all export points
6. **CSS layer in wrong place** - Layers go in barrel files, not main CSS or individual files
7. **Missing CSS barrel files** - Need both definition and theme barrels
8. **Creating implementation files** - Only create stub files and barrels during scaffolding
9. **Using specific names in comments** - Use generic "state", "type", "variation" placeholders

## Decision Tree

```
Need a new component?
├── Will it have declarative attributes/variations?
│   ├── YES → Use this workflow (spec-driven in /src/primitives/)
│   └── NO → Create simple component in /src/components/
└── Is it extending an existing component?
    └── Consider composition or enhancement instead
```

This workflow ensures consistent structure for all spec-driven components, enabling the framework's build tools to properly process and bundle them.

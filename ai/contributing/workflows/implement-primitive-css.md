---
title: Implement Primitive CSS
description: Detailed workflow for implementing CSS for spec-defined primitive features, covering shadow DOM boundaries, content vs context separation, and token verification.
keywords: [CSS, primitives, shadow DOM, tokens, definition, theme, variations, states]
audience: contributing
type: workflow
---

# Implement Primitive CSS

**Purpose**: Implement CSS for primitive features defined in specs
**Target Audience**: LLMs with empty context windows implementing CSS without visual access
**Prerequisite**: Primitive spec JSON exists with the feature defined
**Related Guides**:
- `/ai/contributing/specs.md` - Understanding spec structure
- `/ai/contributing/workflows/define-primitive-spec.md` - Adding new content to a spec or writing a new spec
- `/ai/framework/design-tokens.md` - Design token usage and verification
- `/ai/contributing/token-architecture.md` - Token system architecture
- `/ai/framework/mental-model.md` - Shadow DOM and component architecture

## Critical Architecture: Shadow DOM Boundaries

**Understanding this FIRST is essential for correct CSS implementation.**

### Component Structure
```
Light DOM (Page)
├── <ui-button> (web component element)
│   └── Shadow DOM (button's isolated scope)
│       ├── button-bundle.css (loaded here)
│       ├── <div class="button">...</div> (template content)
│       └── <slot> (projected content)
│
└── <ui-buttons> (plural web component)
    └── Shadow DOM (buttons' isolated scope)
        ├── button-bundle.css (SAME bundle loaded here too)
        ├── <div class="buttons">...</div>
        └── <slot> → <ui-button>...</ui-button> (slotted children)
```

### Key Rules
1. **CSS cannot penetrate shadow boundaries** - `.buttons .button` won't work across components
2. **CSS variables inherit through shadow boundaries** - This is how plural affects children
3. **One bundle serves both components** - `button-bundle.css` loaded in both shadow DOMs
4. **All CSS files live in one location** - `/src/primitives/button/css/` for both singular and plural

### The {ui} Pattern

The `{ui}` template variable is populated by the component system from spec attributes:
- Boolean attributes add their name as class: `<ui-button primary>` → `class="primary button"`
- Enum attributes add their value as class: `<ui-button size="large">` → `class="large button"`
- Multiple attributes combine: `<ui-button primary large>` → `class="primary large button"`

**IMPORTANT**: Your CSS selectors like `.primary.button` target these spec-generated classes. If the spec doesn't have `includeAttributeClass: true`, the class won't be added!

## Locating Component Specs

**When given instructions like "add X to Y component" or "implement Z for component Y":**

1. **Find the spec file first** - Always locate and read the component's spec before implementing:
   ```bash
   # Standard location for component specs:
   /src/primitives/[component-name]/specs/[component-name].json

   # Examples:
   /src/primitives/button/specs/button.json
   /src/primitives/card/specs/card.json
   /src/primitives/modal/specs/modal.json
   ```

2. **Verify the feature exists in spec**:
   - If feature exists → Proceed with CSS implementation
   - If feature missing → Stop! Add to spec first (see Author Component Spec guide)
   - Never implement CSS for features not defined in the spec

3. **Check both singular and plural sections** - Features can be in:
   - Singular sections: `types[]`, `variations[]`, `states[]`, `content[]`
   - Plural sections: `pluralContent[]`, `pluralOnlyTypes[]`, `pluralOnlyVariations[]`
   - Shared features: `pluralSharedTypes[]`, `pluralSharedVariations[]`

## Workflow Selection Decision Tree

**START HERE**: Read the spec to identify what you're implementing:

```
Is the feature in the spec?
├── NO → Stop. Add to spec first. See "Author Component Spec" Guide.
└── YES → What section is it in?
    ├── content[] → Use Workflow A: Content Implementation
    ├── states[] → Use Workflow B: State Implementation
    ├── types[] or pluralOnlyTypes[] → Use Workflow C: Type Implementation
    ├── variations[] or pluralOnlyVariations[] → Use Workflow D: Variation Implementation
    └── settings[] → No CSS needed (component behavior only)
```

## Core Principles

### Content vs Context Separation

**Purpose**: The file separation creates clear CSS layers where you can immediately understand what rules affect each part of the component definition.

**Content Files** (`content/*.css`):
- Style the intrinsic properties of elements themselves
- Answer: "What does this element look like?"
- Examples: Text weight, icon size, padding around content
- Test: If removing a type/variation would break the element's basic appearance, it belongs in content

**Type/Variation Files** (`types/*.css`, `variations/*.css`):
- Style contextual layouts and behaviors
- Answer: "How do elements arrange/behave in this mode?"
- Examples: Flexbox layouts, element positioning, conditional display
- Test: If it only changes arrangement or behavior, it belongs in types/variations

### Template Control Philosophy

**When you control the HTML template, leverage it**:
- Prefer real HTML elements over CSS pseudo-elements (`:before`, `:after`)
- Pseudo-elements are workarounds for when you can't modify markup
- Real elements are more maintainable, debuggable, and flexible
- Example: Use `<div class="line">` instead of `::before` for divider lines

### Token Usage Decision Tree

**ALWAYS ask the user when uncertain about token selection**:

```
Need a CSS value?
├── Is there an existing system token that fits?
│   ├── YES → Use it (e.g., var(--border-color), var(--text-color))
│   ├── NO → Ask user: "What token should I use for [purpose]?"
│   └── UNCERTAIN → Ask user: "Should I use var(--token-a) or var(--token-b) for [purpose]?"
└── Component-specific value needed?
    ├── YES → Create variable in theme file (rare)
    └── NO → Never create redundant aliases
```

**Example interaction**:
```
AI: "For the divider line color, should I use var(--border-color) or var(--subtle-border-color)?"
User: "Use var(--border-color)"
```

### Computed Classes vs Spec Attributes

**Clear distinction**:
- **`{ui}` placeholder**: Automatically adds classes from spec attributes
  - Examples: `vertical`, `hidden`, `spacing="large"` → `.vertical`, `.hidden`, `.large`
  - Never manually add these in component methods

- **Component methods**: For logic-based or computed classes
  - Examples: Content triggers layout, state determines appearance
  - Use `classMap` with methods like `getDividerClasses()`

### File Responsibility Principle

**Each file has ONE clear responsibility**:

```css
/* ✅ GOOD: text.css - Only styles text element */
.divider {
  .text {
    font-weight: var(--divider-text-font-weight);
    text-transform: var(--divider-text-transform);
  }
}

/* ❌ BAD: text.css - Mixing layout concerns */
.divider {
  &.horizontal {
    display: flex;  /* This belongs in types/horizontal.css */
  }

  .text {
    font-weight: bold;
  }
}
```

**Benefits**:
- Clear debugging: Know exactly which file affects what
- Clean overrides: Layers cascade predictably
- Easy maintenance: Changes are localized

### Spec-Driven Development
**The spec is the source of truth**. Always:
1. Check spec location FIRST
2. Look for existing CSS (may be in wrong location)
3. If location is wrong, MOVE files don't recreate
4. Preserve existing CSS rules unless they conflict with spec

### CSS Requirements
**All component CSS must use nested syntax**. This is mandatory for:
- Better maintainability and readability
- Reduced selector repetition
- Clear hierarchical structure
- Modern CSS best practices

## Pre-Implementation Checks

### Step 1: Verify Spec Configuration

**Critical**: If your CSS will use class selectors like `.primary.button`, the spec MUST have `includeAttributeClass: true`:

```json
{
  "attribute": "primary",
  "includeAttributeClass": true  // ← REQUIRED for .primary CSS selector
}
```

Without this, the class won't be added to `{ui}` and your selectors won't match.

### Step 2: Read Component HTML Template

Check `/src/primitives/[component]/[component].html` to understand:
- What elements exist (`.button`, `.icon`, etc.)
- What slots are available (`<slot name="content">`)
- Template snippets (`{> header}` vs `{>slot header}`)

### Step 3: Understand Template Patterns

- `{> snippetName}` = Template snippet → Target with `.snippetName`
- `{>slot name}` = Slot → Target with `::slotted()`
- `{ui}` = Spec-generated classes → Target with `.primary.button` etc.

## CSS Implementation Process & Component Integration

### Understanding the CSS → Component Flow

**How CSS is consumed by components:**

1. **Build Process** (`npm run build:ui-deps`):
   - Bundles all CSS imports into `[component]-bundle.css`
   - Preserves layer structure with source comments

2. **Component Import**:
   ```javascript
   // In button.js
   import css from './button-bundle.css?raw';  // Import as raw string
   import componentSpec from './specs/button-component.js';

   export const UIButton = defineComponent({
     tagName: 'ui-button',
     css,  // CSS attached to shadow DOM
     componentSpec,  // Drives {ui} class generation
   });
   ```

3. **Runtime Application**:
   - CSS is injected into component's shadow DOM
   - Applies to elements within the template
   - `{ui}` is replaced with spec-derived classes

### General CSS Writing Process

For ANY feature implementation:

#### Step 1: Understand What You're Styling
1. **Read the spec** to understand the feature's purpose
2. **Read the HTML template** to see available elements/classes
3. **Check if CSS already exists** (may need moving)
4. **Identify if singular or plural** (affects targeting strategy)
5. **For plural**: Check child's theme file for `inherit` usage

#### Step 2: Determine Selector Strategy

**For singular components:**
```css
/* Component root with nested elements */
:host {
  /* The web component itself */

  &([disabled]) {
    /* Component with attribute */
  }
}

.button {
  /* Direct element styling */

  .icon {
    /* Child element styling */
  }
}

/* User content */
::slotted(.custom) {
  /* Slotted content with class */
}
```

**For plural components affecting children:**
```css
.variations.buttons {
  /* Override child's CSS variables at its shadow root */
  ::slotted(ui-button) {
    --button-medium: var(--button-mini);  /* Forces value at child's shadow root */
    --button-padding: var(--4px);         /* Child will use these values */
  }
}
```

**Finding which variables to use**:
1. Check child's theme files: `button/css/theme/`
2. Check child's definition files: `button/css/definition/`
3. Look for variables being used like `var(--button-medium)`
4. Override those same variables in your plural CSS

#### Step 3: Write Semantic CSS

**Structure your CSS with clear sections** - see Comment Formatting Guidelines below.

#### Step 4: Use Appropriate Values

**Decision tree for values:**
```
Does it need to scale with size variations?
├── YES → Use var(--Npx) tokens
└── NO → Should it use a design token?
    ├── YES → Verify token exists in /src/css/tokens/
    └── NO → Use fixed value or create component variable
```

#### Step 5: Test Shadow DOM Isolation

**Verify your CSS works within shadow DOM:**
- CSS only affects elements within the component's template
- External styles cannot penetrate into the component
- Component styles cannot leak out

## CSS Comment Formatting Guidelines

### Main Section Headers

Use the dashed box pattern for major sections within a file:

```css
/*-------------------
       Sizing
--------------------*/
.mini.button { }
.small.button { }
.large.button { }

/*-------------------
     Emphasis
--------------------*/
.primary.button { }
.secondary.button { }
```

### Subsection Headers

Use simple comments for subsections or specific states:

```css
/*-------------------
     Emphasis
--------------------*/

/* Primary */
.primary.button {
  background: var(--button-primary-background);
}

/* Secondary */
.secondary.button {
  background: var(--button-secondary-background);
}

/* Plural Sizing */
.mini.buttons {
  --button-medium: var(--button-mini);
}
```

### What NOT to Comment

**Avoid explanatory comments** unless they would appear in professional open source libraries:

```css
/* ❌ BAD - Obvious explanation */
.button {
  /* This makes the button blue */
  background: blue;
  /* This adds spacing inside the button */
  padding: 10px;
}

/* ✅ GOOD - Only structural comments */
.button {
  background: var(--button-background);
  padding: var(--button-padding);
}
```

### When to Add Technical Comments

Only add technical comments for:
- Non-obvious browser workarounds
- Performance optimizations
- Critical implementation notes

```css
/* ✅ GOOD - Technical necessity */
.attached.buttons {
  /* Prevents double borders between buttons */
  ::slotted(ui-button:not(:first-child)) {
    margin-left: -1px;
  }
}

/* ✅ GOOD - Browser workaround */
.button {
  /* Safari requires explicit z-index for stacking context */
  position: relative;
  z-index: 0;
}
```

### File Structure Example

```css
/*-------------------
       Fluid
--------------------*/
.fluid.button {
  width: 100%;
  display: block;
}

/*-------------------
      Attached
--------------------*/

/* Singular */
.attached.button {
  margin: 0;
  border-radius: 0;
}

/* Plural */
.attached.buttons {
  display: inline-flex;

  ::slotted(ui-button:first-child) {
    border-radius: var(--border-radius) 0 0 var(--border-radius);
  }

  ::slotted(ui-button:last-child) {
    border-radius: 0 var(--border-radius) var(--border-radius) 0;
  }
}

/*-------------------
   Vertical Attached
--------------------*/
.attached.vertical.buttons {
  flex-direction: column;
}
```

### Summary

- **Main headers**: Dashed boxes for primary features
- **Subheaders**: Simple comments for variants/states
- **No tutorials**: Don't explain what CSS properties do
- **Technical only**: Comment only when necessary for implementation understanding
- **Clean code**: Let the code structure and naming be self-documenting

## Workflow A: Content Implementation

**When to use**: Feature is in `content[]` section of spec

### Step 1: Understand the Content Pattern
Content can be used three ways:
- **Attribute**: `<ui-card header="Title">`
- **Slot**: `<div slot="header">Title</div>`
- **Class**: `<div class="header">Title</div>`

### Step 2: Create CSS Files
Location: `/css/definition/content/[attribute-name].css`

```css
/* Triple selector pattern for content */
:host {
  ::slotted(.header),  /* Slotted content with class */
  .header {            /* Template-generated wrapper */
    color: var(--card-header-color);
    font-size: var(--card-header-font-size);
  }

  /* If coupling with component */
  ::slotted(ui-icon),
  .icon ui-icon {
    font-size: var(--icon-size);
  }
}
```

Create theme file: `/css/theme/content/[attribute-name]-variables.css`
```css
:host {
  --card-header-color: var(--text-color);
  --card-header-font-size: var(--large);
}
```

### Step 3: Update Barrel Files
Add to `/css/definition/[component]-definition.css`:
```css
@import url('./content/[attribute-name].css') layer([component].definition.content.[attribute-name]);
```

Add to `/css/theme/[component]-theme.css`:
```css
@import url('./content/[attribute-name]-variables.css') layer([component].theme.content.[attribute-name]);
```

## Workflow B: State Implementation

**When to use**: Feature is in `states[]` section of spec
**What is a state** A state is how a component might change over time, like disabled, hover, active, pressed (:active), etc.

### Step 1: Identify State Type
- **Pseudo-state**: `:hover`, `:focus`, `:active`
- **Attribute state**: `[disabled]`, `[loading]`
- **Class state**: `.active`, `.selected`

### Step 2: Create CSS Files
Location: `/css/definition/states/[attribute-name].css`

```css
/* Pseudo-state example */
.button {
  @media (pointer: fine) {
    &:hover {
      background-color: var(--button-hover-background);
    }
  }

  /* Attribute state example */
  &[disabled],
  &.disabled {
    opacity: var(--button-disabled-opacity);
    cursor: not-allowed;
  }
}

/* For web component hosts */
:host([disabled]) {
  pointer-events: none;
}
```

Create theme file: `/css/theme/states/[attribute-name]-variables.css`

### Step 3: Update Barrel Files
Same pattern as Workflow A, using `states` instead of `content`

## Workflow C: Type Implementation

**When to use**: Feature is in `types[]` or `pluralOnlyTypes[]` section
**What is a type**: Types are mutually exclusive forms of a component.

### Step 1: Determine Type Structure
Check if type has `options[]` in spec:
- **With options**: All options go in ONE file
- **Boolean**: Single state implementation

### Step 2: Create CSS Files
Location: `/css/definition/types/[attribute-name].css`

**Example with options (emphasis type):**
```css
/*-------------------
     Emphasis
--------------------*/

/* Primary */
.primary.button {
  background-color: var(--button-primary-color);
  color: var(--button-primary-text-color);
}

/* Secondary */
.secondary.button {
  background-color: var(--button-secondary-color);
  color: var(--button-secondary-text-color);
}
```

**For pluralOnlyTypes:**
```css
/*-------------------
     Vertical
--------------------*/
.vertical.buttons {
  flex-direction: column;

  ::slotted(ui-button) {
    width: 100%;
  }
}
```

### Step 3: Update Barrel Files
Follow same pattern with `types` section

## Workflow D: Variation Implementation

**When to use**: Feature is in `variations[]` or `pluralOnlyVariations[]` section

### Step 1: Check Variation Type
- **Boolean variation**: Single attribute (e.g., `fluid`)
- **Options variation**: Multiple values (e.g., `size` with mini/small/large)
- **Plural-only**: Only applies to collection

### Step 2: Create CSS Files
Location: `/css/definition/variations/[attribute-name].css`

**Boolean example (singular):**
```css
.fluid.button {
  width: 100%;
  display: block;
}
```

**Options example with plural inheritance (all in ONE file):**
```css
/*-------------------
       Sizing
--------------------*/

/* Singular */
.mini.button {
  font-size: var(--button-mini);
}
.small.button {
  font-size: var(--button-small);
}
.large.button {
  font-size: var(--button-large);
}

/* Plural */
.mini.buttons {
  ::slotted(ui-button) {
    --button-medium: var(--button-mini);
  }
}
.small.buttons {
  ::slotted(ui-button) {
    --button-medium: var(--button-small);
  }
}
```

**Why the difference?**
- `.mini.button` targets an element INSIDE ui-button's shadow DOM
- `.mini.buttons` is OUTSIDE child components
- Child components have their own CSS variables at their shadow root
- Parent variables only inherit if child explicitly uses `inherit`

**PluralOnly example:**
```css
/*-------------------
      Separate
--------------------*/
.separate.buttons {
  box-shadow: none;
}

.separate.buttons ::slotted(ui-button) {
  margin-right: var(--button-separate-spacing);
}

.separate.buttons ::slotted(ui-button:last-child) {
  margin-right: 0;
}
```

### Step 3: Update Barrel Files
Follow same pattern with `variations` section

## Variation Stacking Checklist

**Variations are mutually inclusive** - they can be combined. After implementing a variation, run through this checklist:

### Step 1: Identify Potential Interference
Look at other variations in the spec and ask:
- Do any affect the same CSS properties I just used?
- Would combining them create visual conflicts?

Examples:
- `fluid` (width: 100%) + `inline` (display: inline-block) = conflict
- `attached` (margin: 0) + `separate` (margin: spacing) = conflict
- `vertical` (flex-direction) + horizontal spacing = needs adjustment

### Step 2: Evaluate Common Usage
For each potential conflict, ask:
- Is this combination likely to be used?
- Does the combination make semantic sense?

Examples:
- `vertical separate` buttons = **common** (stacked with spacing)
- `fluid attached` buttons = **common** (full-width connected group)
- `inline fluid` = **uncommon/nonsensical** (inline can't be full width)

### Step 3: Add Resolution Rules (If Needed)
Only for common, sensible combinations that conflict:

```css
/* In the variation file */
.separate.vertical.buttons {
  ::slotted(ui-button) {
    --button-horizontal-margin: 0;  /* Override horizontal */
    --button-vertical-margin: var(--button-separate-spacing);  /* Apply vertical */
  }
}
```

### Step 4: Skip Nonsensical Combinations
Don't write defensive CSS for illogical combinations. Let CSS cascade handle it naturally.

## Critical Implementation Details

### File Naming Convention
**ALWAYS**: File name = spec attribute name exactly
- Spec: `"attribute": "emphasis"` → File: `emphasis.css`
- Spec: `"attribute": "equal-width"` → File: `equal-width.css`

### Layer Naming Convention
```css
@layer [component].definition.[section].[attribute-name]
```
- Section matches spec structure: `types`, `variations`, `states`, `content`
- No plural markers in layer names

### Barrel File Updates (MANDATORY)

After creating files, update BOTH:

**In `/css/definition/[component]-definition.css`:**
```css
@import url('./[section]/[attribute-name].css') layer([component].definition.[section].[attribute-name]);
```

**In `/css/theme/[component]-theme.css`:**
```css
@import url('./[section]/[attribute-name]-variables.css') layer([component].theme.[section].[attribute-name]);
```

### CSS Variable Token Usage

**ALWAYS verify tokens exist** - Read `/ai/framework/design-tokens.md` for verification workflow

**Critical: Variable Scope in Theme Files**

When defining CSS variables in theme files, only reference variables that exist in the current scope:

```css
/* ❌ WRONG - References variable from another file */
:host {
  --button-group-attached-top: var(--button-group-button-border-radius) var(--button-group-button-border-radius) 0 0;
  /* ERROR: --button-group-button-border-radius is defined elsewhere, not available here */
}

/* ✅ CORRECT - References globally available token */
:host {
  --button-group-attached-top: var(--border-radius) var(--border-radius) 0 0;
  /* Works: --border-radius is a global token from /src/css/tokens/ */
}
```

**Rule**: In theme files, you can only reference:
1. Variables defined in the same `:host` block
2. Global tokens from `/src/css/tokens/`
3. Nothing else - variables from other files are not in scope

**Decision framework:**
- **Use `var(--Npx)` tokens**: When value should scale with `font-size`
  - Padding inside buttons that should scale with text
  - Icon spacing proportional to font size
  - Any dimension maintaining proportion with size variations

- **Use fixed `px` values**: When spacing should remain constant
  - Gaps between separate components
  - Border widths (typically 1px regardless of size)
  - Minimum spacing requirements

- **Use system tokens**: When available in `/src/css/tokens/`
  - `var(--spacing)` for standard spacing
  - `var(--text-color)` for text colors
  - `var(--border-radius)` for consistent rounding

- **Create component variables**: In theme files for component-specific values
  - Define in theme `-variables.css` files
  - Reference in definition CSS files
  - **Ask before creating new variables** - almost always unnecessary

### File Discovery Process

**To check if CSS already exists:**
```bash
# You know the folder structure from spec section
# For a variation named "separate":
ls /src/primitives/button/css/variations/separate.css

# If it exists but is in wrong folder (e.g., types/):
mv /src/primitives/button/css/types/separate.css /src/primitives/button/css/variations/
# Update barrel file imports accordingly
```

### Decision Process for CSS Values

**When you need a value:**
1. Check if existing token works: `/src/css/tokens/`
2. Check if component already has a variable for it
3. If variation-specific, define in variation's theme file
4. **Almost never create new global or component base variables**

### Import Format in Barrel Files

Always match existing patterns:
```css
@import url('./content/label.css') layer(button.definition.content.label);
```

### Plural Component Patterns - Critical Process

**FUNDAMENTAL LIMITATION: `::slotted()` cannot chain with `::part()`**

```css
/* ❌ INVALID CSS - This will NOT work */
.separate.buttons ::slotted(ui-button)::part(button) { }
```

This means you CANNOT directly style elements inside slotted components' shadow DOM. You MUST use CSS variables instead.

## Step-by-Step Process for Plural Variations

### Step 1: Understand the Style Cascade
Before writing any CSS, map out what styles are already applied:

1. **Base component styles** - What does a single `ui-button` look like?
2. **Plural default styles** - How does `ui-buttons` modify children by default?
3. **Your variation's goal** - What should change with this variation?

Example for "separate" variation:
- Base: Individual buttons have full border-radius, margins
- Plural default: Buttons connect (modified radius? removed margins?)
- Separate goal: Restore independent appearance with spacing

### Step 2: Identify What Needs Modification
List the CSS properties that need to change:
- Spacing between buttons? → margins
- Visual connection? → border-radius, box-shadow
- Layout? → flex properties

### Step 3: Determine Implementation Strategy

**Decision Tree:**
```
Can you achieve the effect by styling the plural container only?
├── YES → Style .variation.buttons directly
└── NO → Need to affect child components
    │
    ├── Can you use ::slotted(ui-button) for spacing/layout?
    │   └── YES → Use ::slotted() for margins, display, etc.
    │
    └── Need to style INSIDE child's shadow DOM?
        └── MUST use CSS variables (see Step 4)
```

### Step 4: Find Available CSS Variables

**Think through the cascade** to find variables:

1. **Identify the cascade path for your component:**
   - Singular button: `content/button.css` → your variation
   - Plural buttons: `plural/buttons.css` → your variation

2. **Check those specific files for variables:**
   ```bash
   # Check the relevant theme files in cascade order
   cat src/primitives/button/css/theme/content/button-variables.css
   cat src/primitives/button/css/theme/plural/buttons-variables.css
   ```

3. **Look for variables being used in definition files:**
   ```bash
   # See what variables are actually consumed
   grep "var(--button" src/primitives/button/css/definition/content/button.css
   ```

4. **Override those variables in your CSS:**
   - Most variables DO NOT use `inherit` - just override directly
   - Set them on `::slotted(ui-button)` to force values at child's root

### Critical Pattern: Variable Preservation in Plural Components

**Before implementing any plural variation, understand this fundamental pattern:**

When plural components modify child variables (like resetting `--button-border-radius: 0` to connect buttons), they destroy access to the original value. But variations often need that original value to selectively restore it (like attached buttons needing selective corners).

**The preservation pattern solves this:**

1. **Plural theme preserves the original** before any modifications:
   ```css
   /* In /css/theme/plural/buttons-variables.css */
   --button-group-button-border-radius: var(--border-radius);  /* Preserve original */
   ```

2. **Plural definition modifies the actual variable**:
   ```css
   /* In /css/definition/plural/buttons.css */
   .buttons ::slotted(ui-button) {
     --button-border-radius: 0;  /* Reset for connected appearance */
   }
   ```

3. **Variations reference the PRESERVED copy**:
   ```css
   /* In /css/theme/variations/attached-variables.css */
   /* ✅ CORRECT - Uses preserved value */
   --button-group-attached-top: var(--button-group-button-border-radius) var(--button-group-button-border-radius) 0 0;

   /* ❌ WRONG - Would get 0 because plural already reset it */
   --button-group-attached-top: var(--button-border-radius) var(--button-border-radius) 0 0;
   ```

**Decision process when implementing plural variations:**
```
Need to use a child variable that plural modifies?
├── Check if preserved copy exists (e.g., --button-group-button-border-radius)
│   ├── YES → Use the preserved copy in your theme variables
│   └── NO → Cannot implement correctly - this is an architectural issue
└── Apply your variation by setting the ACTUAL variable (--button-border-radius)
```

**Common preserved variables you'll encounter:**
- `--button-group-button-border-radius` preserves `--button-border-radius`
- Similar patterns exist for spacing, sizing, and other modified properties
- Look in plural theme files to find these preservation variables

**Key insight**: The plural component must "photograph" original values before modifying them. Your variations work from these photographs, not from the modified reality.

### Step 5: Implement Using CSS Variables

**Pattern for plural variations affecting children:**

```css
/* Variation modifies container and children */
.separate.buttons {
  box-shadow: none;  /* Remove group styling */
}

/* Set variables and properties on slotted children */
.separate.buttons ::slotted(ui-button) {
  /* These variables cascade into child's shadow DOM */
  --button-horizontal-margin: var(--button-separate-spacing);
  --button-border-radius: var(--border-radius);

  /* Can also set layout properties on the element itself */
  margin-right: var(--button-separate-spacing);
}

/* Handle pseudo-classes with complete selectors */
.separate.buttons ::slotted(ui-button:last-child) {
  margin-right: 0;
}
```

### Step 6: Verify Variable Usage
Ensure your variables will be consumed correctly:

1. **Check child's definition files** - Confirm it uses `var(--button-property)`
2. **Verify variable names match exactly** - CSS variables are case-sensitive
3. **If child doesn't use that variable** - Find alternative variables it does use

## Common Patterns for Plural Variations

### Pattern 1: Spacing/Separation
```css
.variation.buttons {
  ::slotted(ui-button) {
    /* Set margin directly on slotted elements */
    margin-right: var(--spacing);

    /* Override child's internal margins via variables */
    --button-horizontal-margin: var(--spacing);
  }
}
```

### Pattern 2: Size Inheritance
```css
.mini.buttons {
  ::slotted(ui-button) {
    /* Override child's size variable */
    --button-medium: var(--button-mini);
  }
}
```

### Pattern 3: Restore Independence
```css
.separate.buttons {
  ::slotted(ui-button) {
    /* Restore full border radius */
    --button-border-radius: var(--border-radius);

    /* Ensure proper margins */
    --button-vertical-margin: 0;
    --button-horizontal-margin: var(--spacing);
  }
}
```

### Pattern 4: Conditional Application
```css
/* Combine with other variations */
.separate.vertical.buttons {
  ::slotted(ui-button) {
    --button-horizontal-margin: 0;
    --button-vertical-margin: var(--spacing);
  }
}
```

### Pattern 5: Applying Preserved Variables
```css
/* When using the preservation pattern, always set the actual variable */
.attached.buttons {
  ::slotted(ui-button) {
    /* ✅ CORRECT - Set the variable the component actually uses */
    --button-border-radius: var(--button-group-attached-none);
  }
}

.top-attached.buttons {
  ::slotted(ui-button:first-child) {
    /* ✅ CORRECT - Apply to the working variable */
    --button-border-radius: var(--button-group-attached-top-left);

    /* ❌ WRONG - Don't set the preservation variable */
    --button-group-button-border-radius: var(--button-group-attached-top-left);
  }
}
```

**Key Rule**: Preservation variables (like `--button-group-button-border-radius`) are for DEFINING your variation values. The actual component variable (like `--button-border-radius`) is what you SET on children.

## Troubleshooting Plural Variations

### Problem: Styles aren't applying to child components

**Diagnosis Steps:**
1. **Check shadow DOM boundaries** - Remember you can't penetrate shadow DOM with selectors
2. **Verify ::slotted() syntax** - Must use complete selectors, not nested
3. **Verify variable names** - Check child's CSS files for exact variable usage
4. **Check specificity** - Other styles might be overriding

### Problem: Variables aren't inheriting

**Common Causes:**
1. **Child doesn't use that variable** - Check child's CSS files
2. **Variable name mismatch** - Verify exact variable names
3. **Missing inherit** - Child might not have `inherit` for that variable
4. **Wrong scope** - Setting variable on wrong element

**Debug Process:**
```bash
# Step 1: Check what variables the child actually uses
grep "--button" src/primitives/button/css/definition/
grep "--button" src/primitives/button/css/theme/
```

```css
/* Step 2: Verify your variable is being set correctly */
.variation.buttons {
  ::slotted(ui-button) {
    /* Ensure you're setting the right variable */
    --button-property: value;  /* The actual variable used by child */
  }
}

/* Step 3: Check cascade order
   - Verify no other rules override your variable
   - Check specificity of selectors
   - Ensure variation CSS loads after base CSS */
```

### Problem: Can't style specific parts of child

**Remember the fundamental limitation:**
```css
/* ❌ THIS IS IMPOSSIBLE */
.parent ::slotted(child)::part(element) { }
.parent ::slotted(child) .internal-class { }
```

**Solution: Find or create appropriate CSS variables**
1. Check if a variable exists for what you need
2. If not, you may need to modify the child component to expose variables
3. Consider if the styling belongs at the child level instead

## Best Practices for Plural Variations

1. **Start with the cascade** - Understand what's already applied before adding styles
2. **Use semantic variable names** - `--button-separate-spacing` not `--spacing`
3. **Document your approach** - Comment why you're using certain variables
4. **Test combinations** - Verify your variation works with other variations
5. **Check both orientations** - Many plural components support vertical/horizontal

## Quick Reference: Shadow DOM CSS Limitations

| What You Want | Valid Approach | Invalid Approach |
|--------------|----------------|------------------|
| Space between children | `::slotted(ui-button) { margin: X; }` | `.buttons > ui-button { margin: X; }` |
| Child's internal style | `::slotted(ui-button) { --var: X; }` | `::slotted(ui-button)::part(button)` |
| Conditional styling | `::slotted(ui-button:is(:first-child))` | `::slotted(ui-button:first-child)` |
| Deep descendants | Use CSS variables only | Any selector trying to pierce shadow |

**Key Rules for CSS Variable Inheritance**:
1. Child components have their own CSS variables defined at their shadow root
2. Parent variables only inherit if child explicitly uses `inherit` for that variable
3. Use `::slotted(ui-button)` to force override variables at the child's shadow root
4. Always check the child's theme file to see if it uses `inherit`
5. Variables cascade through shadow boundaries, selectors do not

## Edge Cases and Corrections

### Finding Existing CSS in Wrong Location

**When implementing a feature that already has CSS:**

1. Search for existing files: `find /css -name "*[attribute]*"`
2. If in wrong folder per spec:
   - MOVE files (preserve CSS rules)
   - Update imports in barrel files
   - Fix layer names to match new location
3. Never duplicate CSS - always move existing

### Component vs Element Selectors

**Know your DOM structure:**
- `ui-buttons` contains slotted `ui-button` components
- Use `> ui-button` to target child web components
- Use `.button` for elements inside button's shadow DOM
- Use `::slotted()` for slotted content with classes

## Validation Checklist

Before completing implementation:
- [ ] File name matches spec attribute exactly
- [ ] File location matches spec section (types/variations/states/content)
- [ ] Layer name follows pattern: `[component].definition.[section].[attribute]`
- [ ] Both barrel files updated with imports
- [ ] Theme variables file created (even if empty)
- [ ] CSS tokens verified to exist in `/src/css/tokens/`
- [ ] Existing CSS preserved if found in wrong location
- [ ] Correct selectors for component structure (web components vs elements)

## Important: Build and Testing

**Agents should NOT run build commands or npm scripts**. The CSS implementation is complete when files are created/updated correctly. The user will:
- Run builds when needed
- Test the implementation visually
- Provide feedback for adjustments

Do not run `npm run build`, `npm test`, or other commands unless explicitly requested by the user.

## Visual Verification (User Responsibility)

**IMPORTANT**: After implementation, visual verification is the **user's responsibility**:

1. **Agent completes CSS implementation** following spec requirements
2. **User verifies visually** by:
   - Running the development server
   - Testing the component in browser
   - Checking different states and variations
   - Verifying responsive behavior
3. **User provides feedback** if adjustments needed
4. **Agent makes corrections** based on user feedback

The agent cannot visually verify styling - this requires human evaluation of:
- Correct appearance and layout
- Proper spacing and alignment
- Color and theme application
- Interactive state transitions
- Cross-browser compatibility

## Common Mistakes to Avoid

1. **Creating new tokens without verifying** - Always check `/src/css/tokens/` first
2. **Using `.button` to target child components** - They're `ui-button` web components
3. **Forgetting theme variables file** - Always create, even if empty with `:host { }`
4. **Not updating barrel files** - Both definition and theme need imports
5. **Ignoring existing CSS** - Always check expected location first, move if found elsewhere
6. **Wrong folder for pluralOnly** - Still goes in `/src/primitives/button/css/`, same location
7. **Missing option variations** - All options go in ONE file named after the attribute
8. **Using wrong selectors for content** - Check if template uses `{> name}` or `{>slot name}`
9. **Not using nested CSS** - All component CSS must use nested syntax
10. **Expecting ::slotted() nesting** - Must use complete selectors like `::slotted(ui-button:last-child)`
11. **Missing `includeAttributeClass` in spec** - Required for `.attribute-name` CSS selectors
12. **Creating unnecessary variables** - Almost always use existing tokens or variables
13. **Using out-of-scope variables in theme definitions** - Theme files can only reference variables in the same `:host` block or global tokens
14. **Setting preservation variables instead of actual variables** - Apply to `--button-border-radius`, not `--button-group-button-border-radius`
15. **Not checking for preserved variables** - When plural modifies a variable, look for its preserved copy before implementing variations

## Quick Reference: Spec Section to CSS Folder

| Spec Section | CSS Location | Example |
|-------------|--------------|---------|
| `content[]` | `/css/definition/content/` | `header.css` |
| `types[]` | `/css/definition/types/` | `emphasis.css` |
| `states[]` | `/css/definition/states/` | `hover.css` |
| `variations[]` | `/css/definition/variations/` | `size.css` |
| `pluralOnlyTypes[]` | `/css/definition/types/` | `vertical.css` |
| `pluralOnlyVariations[]` | `/css/definition/variations/` | `separate.css` |
| `settings[]` | No CSS files | Component behavior only |

## Summary: Key Decisions for LLM Implementation

### File Organization
- **All files** go in `/src/primitives/[component]/css/`
- **One bundle** serves both singular and plural components
- **File names** match spec attribute exactly
- **Theme files** always created, even if empty: `:host { /* No variables */ }`

### Shadow DOM Strategy
- **Singular CSS** targets elements inside component's shadow DOM
- **Plural CSS** uses variables to affect child components
- **Variables inherit**, selectors don't penetrate shadow boundaries
- **::slotted()** requires complete selectors, no nesting

### Variable Discovery
- **Think cascade**: Check files in order they're applied
- **Look in theme/definition** folders for existing variables
- **Override directly** - rarely need `inherit`
- **Ask before creating** new variables

### Variation Stacking
- **Check for conflicts** with other variations
- **Handle common combinations** only
- **Let cascade handle** nonsensical combinations
- **Place rules** in the primary variation's file

### Import Pattern
```css
@import url('./[section]/[file].css') layer([component].definition.[section].[attribute]);
```

---

**For additional context on specific patterns**, consult:
- `/ai/framework/design-tokens.md` - Token system and usage
- `/ai/contributing/specs.md` - Spec structure and processing
- `/ai/framework/creating-components.md` - Component architecture
- `/ai/contributing/token-architecture.md` - Token system deep dive
- `/ai/framework/mental-model.md` - Shadow DOM architecture details

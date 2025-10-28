# Spec to CSS Implementation Workflow

**Purpose**: Implement CSS for component features defined in specs
**Prerequisite**: Component spec JSON exists with the feature defined
**Related Guides**:
- `/ai/packages/specs.md` - Understanding spec structure
- `/ai/workflows/author-component-spec.md - Adding new content to a spec or writing a new spec
- `/ai/guides/css-token-guide.md` - Design token usage and verification
- `/ai/guides/css-token-architecture.md` - Token system architecture

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

## Critical: Understanding Component Structure & Shadow DOM

**MANDATORY FIRST STEP**: Before writing any CSS, understand the component's DOM structure:

### Important: Spec Requirements for CSS Class Selectors

If your CSS uses class selectors like `.equal-width.buttons` or `.primary.button`, the spec MUST have `includeAttributeClass: true` for that attribute:

```json
{
  "name": "Equal Width",
  "attribute": "equal-width",
  "includeAttributeClass": true,  // ← REQUIRED for .equal-width CSS selector
  "options": [...]
}
```

**Without `includeAttributeClass: true`:**
- The attribute exists on the element: `<ui-buttons equal-width="three">`
- But NO class is added to `{ui}` template variable
- Your `.equal-width` CSS selectors won't match anything

**Always check the spec** to ensure `includeAttributeClass` is present when implementing CSS that uses class selectors for attributes.

### Step 1: Review Component HTML Template
Read the component's `.html` file to understand:
- What elements exist in the shadow DOM
- What slots are available
- What classes are used on elements
- How `{ui}` populates (component adds spec attributes as classes)

Example: `/src/primitives/button/button.html`
```html
<div class="{ui}button">  <!-- {ui} adds spec-based classes like "primary large" -->
  {> content}              <!-- Template snippets -->
</div>
```

### Step 2: Understand Shadow DOM Implications

**Your CSS is applied INSIDE the component's shadow DOM:**
- You CAN target: Elements within the template (`.button`, `.header`)
- You CAN target: Slotted content with `::slotted(selector)`
- You CANNOT target: Internal elements of child web components

**For plural components styling child components:**
```css
/* WRONG - Can't penetrate child's shadow DOM */
.mini.buttons .button { font-size: small; }

/* RIGHT - Use CSS variables that inherit through shadow DOM */
.mini.buttons {
  --button-medium: var(--button-mini);  /* Child component uses this variable */
}
```

### Step 3: Identify Targeting Strategy

**Singular component (e.g., ui-button):**
- Target elements in its template directly: `.button`, `.icon`
- Use `:host` for the component element itself
- Use `::slotted()` for user-provided content

**Plural component (e.g., ui-buttons):**
- Can target direct children: `.buttons > ui-button`
- MUST use CSS variables to affect child component internals
- Variables penetrate shadow boundaries, selectors do not

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
  /* Strategy 1: If child has --var: inherit; in its theme */
  --button-medium: var(--button-mini);  /* Works because child uses inherit */

  /* Strategy 2: Override child's shadow root variables directly */
  ::slotted(ui-button) {
    --button-different-var: value;  /* Overrides var at child's shadow root */
  }
}
```

#### Step 3: Write Semantic CSS

**Structure your CSS with clear sections:**
```css
/*-------------------
    Feature Name
--------------------*/

/* Base styles with nested modifiers */
.feature.element {
  property: var(--component-variable);

  /* State modifications */
  &:hover {
    property: var(--component-hover-variable);
  }

  /* Nested elements */
  .child {
    property: value;
  }

  /* Attribute variations */
  &[disabled] {
    opacity: 0.5;
  }
}
```

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
/*--------------
    Primary
---------------*/
.primary.button {
  background-color: var(--button-primary-color);
  color: var(--button-primary-text-color);
}

/*--------------
   Secondary
---------------*/
.secondary.button {
  background-color: var(--button-secondary-color);
  color: var(--button-secondary-text-color);
}
```

**For pluralOnlyTypes:**
```css
/*--------------
    Vertical
    (Plural)
---------------*/
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
/* Singular component - direct styling */
.mini.button {
  font-size: var(--button-mini);
}
.small.button {
  font-size: var(--button-small);
}
.large.button {
  font-size: var(--button-large);
}

/* Plural component - CSS variable strategies using nesting */
.mini.buttons {
  /* Strategy 1: Works IF child defines --button-medium: inherit; */
  --button-medium: var(--button-mini);

  /* Strategy 2: Direct override at child's shadow root */
  ::slotted(ui-button) {
    --button-medium: var(--button-mini);  /* Forces value at child level */
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

  ::slotted(ui-button) {
    margin-right: var(--button-separate-spacing);

    &:is(:last-child) {
      margin-right: 0;
    }
  }
}
```

### Step 3: Update Barrel Files
Follow same pattern with `variations` section

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

**ALWAYS verify tokens exist** - Read `/ai/guides/css-token-guide.md` for verification workflow

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

### Plural Component Patterns - Critical Process

**FUNDAMENTAL LIMITATIONS:**

#### 1. `::slotted()` cannot chain with `::part()`
```css
/* ❌ INVALID CSS - This will NOT work */
.separate.buttons ::slotted(ui-button)::part(button) { }
```

#### 2. Cannot nest selectors inside `::slotted()` with nested CSS
```css
/* ❌ WRONG - Nesting breaks ::slotted() */
.separate.buttons {
  ::slotted(ui-button) {
    &:is(:last-child) { }  /* This WILL NOT work */
    &:hover { }            /* This WILL NOT work */
  }
}

/* ✅ CORRECT - Complete selector in ::slotted() */
.separate.buttons {
  ::slotted(ui-button:is(:last-child)) { }
  ::slotted(ui-button:hover) { }
}
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
When you need to style inside child components:

1. **Check the child's theme file** for variables it uses:
   ```bash
   # Look for CSS variables in the child component
   grep -r "--button" src/primitives/button/css/theme/
   ```

2. **Look for `inherit` usage** - Variables using inherit can be set on parent:
   ```css
   /* In button's theme file */
   --button-medium: inherit;  /* Can be overridden by parent */
   ```

3. **Common variable patterns** to look for:
   - `--[component]-[property]` (e.g., `--button-border-radius`)
   - `--[component]-[size]` (e.g., `--button-medium`)
   - `--[component]-[state]-[property]` (e.g., `--button-hover-background`)

### Step 5: Implement Using CSS Variables

**Pattern for plural variations affecting children:**

```css
/* Variation modifies container and children with nesting */
.separate.buttons {
  box-shadow: none;  /* Remove group styling */

  /* Use ::slotted() to set variables on child components */
  ::slotted(ui-button) {
    /* These variables cascade into child's shadow DOM */
    --button-horizontal-margin: var(--button-separate-spacing);
    --button-border-radius: var(--border-radius);

    /* Can also set layout properties on the element itself */
    margin-right: var(--button-separate-spacing);

    /* Handle last-child, first-child, etc. */
    &:is(:last-child) {
      margin-right: 0;
    }
  }
}
```

### Step 6: Test Variable Inheritance
Verify that your variables are actually being used:

1. **Inspect in browser** - Check if variables are applied
2. **Check child's CSS** - Ensure it uses `var(--button-property)`
3. **If not working** - Child might not use that variable, find alternatives

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

## Troubleshooting Plural Variations

### Problem: Styles aren't applying to child components

**Diagnosis Steps:**
1. **Check shadow DOM boundaries** - Remember you can't penetrate shadow DOM with selectors
2. **Verify ::slotted() syntax** - Must use `:is()` for pseudo-classes
3. **Inspect CSS variables** - Are they defined and used in child?
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
```

```css
/* Step 2: Try setting variable directly on ::slotted() */
.variation.buttons {
  ::slotted(ui-button) {
    --button-property: value !important;  /* Test with !important */
  }
}

/* Step 3: Check browser DevTools
   - Inspect the ui-button element
   - Look at computed styles
   - Check CSS variables tab
   - Verify inheritance chain */
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

### The {ui} Class Pattern

The `{ui}` template variable is populated by the component system:
- Boolean attributes add their name as class
- Enum attributes add their value as class
- Example: `<ui-button primary large>` → `class="primary large button"`

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
3. **Forgetting theme variables file** - Always create, even if empty
4. **Not updating barrel files** - Both definition and theme need imports
5. **Ignoring existing CSS** - Always search first, move if needed
6. **Wrong folder for pluralOnly** - They still follow spec section (types/variations)
7. **Missing option variations** - All options go in ONE file, not separate files
8. **Using wrong selectors for content** - Use triple pattern for flexibility
9. **Not using nested CSS** - All component CSS must use nested syntax
10. **Flat selectors in plural components** - Use nesting to show relationships clearly
11. **Missing `includeAttributeClass` in spec** - Required for `.attribute-name` CSS selectors
12. **Nesting inside `::slotted()`** - Cannot split selector, must be complete in parentheses

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

---

**For additional context on specific patterns**, consult:
- `/ai/guides/css-token-guide.md` - Token system and usage
- `/ai/packages/specs.md` - Spec structure and processing
- `/ai/guides/component-generation-instructions.md` - Component architecture
- `/ai/guides/css-token-architecture.md` - Token system deep dive

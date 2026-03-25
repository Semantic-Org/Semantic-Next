---
title: Port Classic Semantic UI Primitive
description: Workflow for analyzing and thoughtfully porting classic Semantic UI components to modern web components using shadow DOM, slots, and CSS custom properties.
keywords: [porting, migration, classic, web components, shadow DOM, slots, modernization]
audience: contributing
type: workflow
---

# Port Classic Semantic UI Primitive

> Last Updated: 2024-11-03

**Purpose**: Port a component from classic Semantic UI to the new web component framework
**Target**: LLMs working with the Semantic UI author to modernize components
**Prerequisites**:
- Scaffolded primitive exists (see `scaffold-primitive.md`)
- Understanding of both classic Semantic UI and new framework architecture

**Related Workflows**:
- `scaffold-primitive.md` - For initial primitive setup
- `define-primitive-spec.md` - For spec authoring patterns
- `implement-primitive-css.md` - For CSS implementation patterns

## Overview

This workflow guides the process of analyzing classic Semantic UI components and thoughtfully porting them to the new web component framework. Rather than direct translation, this involves reimagining components with modern web standards, slots, CSS custom properties, and shadow DOM while preserving the semantic intent.

**Key Principle**: The original CSS is inspiration, not truth. We're building for the modern web platform.

## Phase 1: Setup & Research

### Step 1: Scaffold Component Structure

Create the basic component structure:
1. Follow `scaffold-primitive.md` workflow
2. Creates file structure and stubs
3. Updates barrel files

### Step 2: Research Modern Patterns

Understand the current landscape:
1. **Run pattern research**: Follow `research-component-patterns.md` workflow
   - Creates comprehensive report in `ai/research/[component]/`
   - Documents patterns across all major frameworks
   - Provides usage levels (1-5) based on adoption

### Step 3: Locate Classic Component Documentation

Classic Semantic UI components are documented at predictable URLs based on their type:
- Elements: `https://semantic-ui.com/elements/[name].html`
- Collections: `https://semantic-ui.com/collections/[name].html`
- Views: `https://semantic-ui.com/views/[name].html`
- Modules: `https://semantic-ui.com/modules/[name].html`
- Behaviors: `https://semantic-ui.com/behaviors/[name].html`

### Step 4: Collect Canonical Examples

Store in `/ai/research/[component]/` directory:

1. **Documentation Examples** (`original-html.md`):
   - All types with their HTML structure
   - All variations with class patterns
   - All states if applicable
   - Content patterns and combinations
   - Interactive examples if relevant

   **Known Issue**: WebFetch may not extract actual HTML code from docs pages. You may need to:
   - Infer patterns from descriptions
   - Check GitHub examples directly
   - Use knowledge of classic Semantic UI patterns

2. **Source LESS/CSS** from GitHub:
   - Main definition: `https://github.com/Semantic-Org/Semantic-UI/blob/master/src/definitions/[type]/[name].less`
   - Variables: `https://github.com/Semantic-Org/Semantic-UI/blob/master/src/themes/default/[type]/[name].variables`
   - Store as `original-definition.less` and `original-variables.less`

   **Note**: Raw GitHub URLs work well with WebFetch for source code

### Step 3: Enumerate All Features

Create a comprehensive feature analysis (`feature-analysis.md`) organizing by:

- **Types**: Mutually exclusive forms
  - Note which could be content-driven instead
  - Flag any that are really just visual styles

- **Variations**: Combinable modifications
  - Group related booleans that could unify (fitted/section → spacing)
  - Remove `inverted` (theme tokens handle this automatically)
  - Note which map to standard scales

- **States**: Interactive or time-based conditions
  - Usually preserved as-is

- **Content**: Slottable or attribute-based content areas
  - Consider if content should drive component behavior
  - Identify coupling with other components

- **Missing in Classic**: What designers actually want
  - Modern visual treatments (gradients, shadows, blur)
  - Patterns from other modern frameworks

## Phase 2: Spec Planning

### Step 1: Review with Framework Author

**Use Interactive One-by-One Review Process**:

Present each feature individually with a simple decision format:
```
Feature: [Name]
Classic: [How it worked in old SUI]
Purpose: [What it does]
My perspective: [AI observation about modern usage]
Modernization: [Any improvement opportunities]

Include?
- y = Yes, include it
- n = No, skip it
- d = Discuss first
```

**Key Considerations During Review**:

1. **Automatic Eliminations**:
   - `inverted` variations - Theme tokens handle this automatically
   - Features that duplicate native web platform capabilities
   - Purely presentational features better handled by utility classes

2. **Standardization Opportunities**:
   - Use existing Semantic UI scales (mini→massive) for sizing
   - Replace multiple boolean variations with unified attributes (e.g., `fitted`/`section` → `spacing`)
   - Follow established patterns like `styled` for visual variants

3. **Concise Syntax Implications**:
   - Consider if concise syntax creates ambiguity
   - Example: `<ui-divider large>` - is it size or spacing?
   - Primary "size" attribute gets concise by default

4. **AI Perspective Guidelines**:
   - Think like a descriptive linguist studying actual usage
   - Focus on what designers actually implement, not what CSS provides
   - Example: Nobody uses CSS `dotted` borders in production

2. **Usage Levels**:
   Each included feature gets a `usageLevel` field (1-5):
   - `1` - Essential: Core functionality, implement first
   - `2` - Common: Frequently used, implement second
   - `3` - Advanced: Specific use cases, implement third
   - `4` - Specialized: Edge cases, implement if time permits
   - `5` - Rare: Rarely used, lowest priority

3. **Modernization Opportunities**:
   - **Content-driven behavior**: Can content presence trigger layout/behavior?
   - **Unify variations**: Can multiple booleans become one scaled attribute?
   - **Leverage patterns**: Use `styled` for visual variants (see button)
   - **Simplify with tokens**: Can theme tokens eliminate variations?
   - **Designer reality**: What do designers actually implement (not CSS spec)?

### Step 2: Update Component Spec

Add agreed features to `/src/primitives/[name]/specs/[name].json`:

```json
{
  "content": [
    {
      "name": "Text",
      "attribute": "text",
      "description": "include centered text",
      "usageLevel": 1,
      "exampleCode": "<ui-divider text=\"Or\"></ui-divider>"
    }
  ],
  "types": [
    {
      "name": "Styled",
      "attribute": "styled",
      "description": "be styled with different visual treatments",
      "usageLevel": 2,
      "options": [
        {"name": "Solid", "value": "solid", "description": "use a solid line"},
        {"name": "Fade", "value": "fade", "description": "fade from transparent at edges"}
      ]
    }
  ],
  "variations": [
    {
      "name": "Spacing",
      "attribute": "spacing",
      "description": "adjust vertical spacing",
      "usageLevel": 1,
      "options": [
        {"name": "Mini", "value": "mini", "description": "appear with minimal spacing"},
        {"name": "Large", "value": "large", "description": "appear with large spacing"}
      ]
    }
  ]
}
```

**Important Spec Considerations**:
- Follow the `define-primitive-spec.md` workflow for proper field names
- Always validate cross-references (icon names, component couplings)
- Use standard scales where applicable (mini→massive)
- Consider concise syntax implications for primary attributes
- Set appropriate `usageLevel` based on review (1-5)
- Remove `includeAttributeClass` for boolean attributes (automatic)

**Validation Steps**:
```bash
# Verify icon glyphs exist
grep '"tag"' /src/primitives/icon/specs/icon.json

# Check patterns in other components
grep -A5 '"styled"' /src/primitives/button/specs/button.json

# Verify scale patterns
grep -E "mini|tiny|small|medium|large|big|huge|massive" /src/primitives/*/specs/*.json
```

## Phase 3: CSS Implementation

### Step 1: Implementation Order

Process features by `usageLevel`:
1. First: All level 1 (Essential) features
2. Second: All level 2 (Common) features
3. Third: All level 3 (Advanced) features
4. Fourth: All level 4 (Specialized) features if time permits
5. Last: All level 5 (Rare) features if needed

Within each level, implement in this order:
1. Content structure
2. Types
3. States
4. Variations

### Step 2: CSS Porting Strategy

For each feature being ported:

1. **Analyze Original Intent**:
   - What visual problem did it solve?
   - What were the design relationships?
   - What edge cases did it handle?

2. **Reimagine for Web Components**:
   - Will content presence change the implementation?
   - Which variations become CSS custom property scales?
   - Does this need explicit types or smart defaults?
   - What visual effects do designers actually use?

3. **Convert Variables**:
   ```less
   // Old LESS variable
   @dividerMargin: 1rem 0rem;

   // New CSS custom property
   --divider-margin: 1rem 0rem;
   ```

4. **Adapt to Token System**:
   - Use `var(--Npx)` for scalable spacing
   - Use system color tokens
   - Use standardized sizing tokens
   - Create component-specific variables sparingly

5. **Handle Plural Patterns** (if applicable):
   - Singular targets internal shadow DOM
   - Plural uses CSS variables for inheritance
   - Consider preservation pattern for modified values

### Step 3: File Creation Pattern

For each feature, create paired files:

**Theme Variables** (`/css/theme/[section]/[name]-variables.css`):
```css
:host {
  /* Variables for this specific feature */
  --divider-spacing-large: var(--large-spacing);
  --divider-fade-gradient: linear-gradient(to right, transparent, var(--standard-15), transparent);
}
```

**Definition Styles** (`/css/definition/[section]/[name].css`):
```css
/* Feature implementation using variables */
.large.divider {
  margin: var(--divider-spacing-large) 0;
}

.fade.divider {
  background: var(--divider-fade-gradient);
  border: none;
```

### Step 4: Update Barrel Files

Add imports to both barrel files maintaining alphabetical order:

**Definition barrel**:
```css
@import url('./[section]/[name].css') layer([component].definition.[section].[name]);
```

**Theme barrel**:
```css
@import url('./[section]/[name]-variables.css') layer([component].theme.[section].[name]);
```

## Phase 4: Validation

### Step 1: Technical Validation

For each implemented feature:
- [ ] Files in correct directories per spec section
- [ ] Variables properly scoped in `:host`
- [ ] Nested CSS syntax used throughout
- [ ] Tokens verified to exist
- [ ] Barrel files updated
- [ ] No style leakage from shadow DOM

### Step 2: Visual Validation (User Responsibility)

The framework author will:
1. Run development server
2. Test component visually
3. Verify responsive behavior
4. Check variation combinations
5. Test in different contexts
6. Provide feedback for adjustments

### Step 3: Iteration

Based on feedback:
1. Adjust CSS implementation
2. Modify variables for better customization
3. Handle edge cases discovered
4. Document any limitations

## Common Patterns in Porting

### Classic Pattern → Modern Pattern

1. **Nested Elements → Slots**:
   ```html
   <!-- Old -->
   <div class="ui header divider">
     <i class="tag icon"></i>
     Description
   </div>

   <!-- New -->
   <ui-divider>
     <ui-icon name="tag" slot="icon"></ui-icon>
     <span slot="content">Description</span>
   </ui-divider>
   ```

2. **Class Modifiers → Attributes**:
   ```html
   <!-- Old -->
   <div class="ui horizontal inverted fitted divider">

   <!-- New -->
   <ui-divider horizontal inverted fitted>
   ```

3. **Global CSS → Scoped Variables**:
   ```css
   /* Old - Global CSS */
   .ui.inverted.divider {
     color: white;
   }

   /* New - Shadow DOM + Variables */
   .inverted.divider {
     color: var(--divider-inverted-color);
   }
   ```

## Decision Trees

### Should This Feature Be Included?

```
Is it frequently used in real applications?
├── NO → Is it solving a real problem?
│   ├── YES → Mark as "specialized"
│   └── NO → Exclude from spec
└── YES → Is there a better modern approach?
    ├── YES → Reimagine with new approach
    └── NO → Port with minimal changes
```

### How Should This Be Implemented?

```
Can slots handle this better than classes?
├── YES → Use named slots in template
└── NO → Does it need to penetrate shadow DOM?
    ├── YES → Use CSS custom properties
    └── NO → Use standard CSS in definition
```

## Example Migration: Content-Driven Component

### Classic → Modern Decision Process

When porting, look for opportunities to:

1. **Let content drive behavior**
   - Classic: Explicit type modifiers
   - Modern: Presence of attributes triggers behavior
   - Example: Content presence could trigger layout changes

2. **Unify related variations**
   - Classic: Multiple boolean flags
   - Modern: Single attribute with scale
   - Example: Size-related booleans → unified scale attribute

3. **Remove theme-specific variations**
   - Classic: `inverted` variations everywhere
   - Modern: Automatic via theme tokens
   - Decision: Always remove `inverted`

4. **Add modern visual treatments**
   - Classic: Limited to CSS border styles
   - Modern: What designers actually create (gradients, shadows)
   - Decision: Use `styled` pattern for visual variants

### Modernized Result:

```css
/* Theme Variables */
:host {
  --divider-horizontal-margin: 1rem 0rem;
  --divider-horizontal-padding: 0rem 2rem;
}

/* Definition */
.horizontal.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: var(--divider-horizontal-margin);

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--divider-border-color);
  }

  ::slotted([slot="content"]) {
    padding: var(--divider-horizontal-padding);
  }
}
```

## Artifacts Organization

Store research materials for reference:

```
/ai/research/[component]/
├── pattern-research.md       # Modern pattern analysis (if completed)
├── url-verification.md       # URL tracking from research
├── original-html.md          # All examples from classic docs
├── original-definition.less  # Source LESS from classic
├── original-variables.less   # Source variables from classic
├── feature-analysis.md       # Enumerated features analysis
├── migration-decisions.md    # What to include/exclude
├── spec-decisions.md         # Decisions from research evaluation
└── implementation-notes.md   # Lessons learned during implementation
```

## Common Pitfalls

1. **Over-literal translation** - Reimagine for modern web, don't just copy
2. **Missing shadow DOM boundaries** - Remember CSS can't penetrate
3. **Forgetting usageLevel** - Always prioritize by usage level (1-5)
4. **Creating too many variables** - Use existing tokens when possible
5. **Not leveraging slots** - Prefer slots over complex class patterns
6. **Ignoring combination effects** - Test variations together
7. **Not eliminating inverted** - Theme tokens handle this automatically
8. **Missing standardization opportunities** - Use existing scales (mini→massive)
9. **Implementing CSS borders as-is** - Designers don't use CSS `dotted`/`dashed`
10. **Not validating cross-references** - Check icon names, attribute patterns exist


## Success Criteria

A successful port:
- Preserves the semantic intent of the original
- Leverages modern web platform features
- Simplifies where possible
- Provides better customization through variables
- Works correctly in shadow DOM
- Maintains visual consistency with design system
- Documents what was excluded and why

## Next Steps

After successfully porting a component:
1. Document lessons learned in artifacts
2. Update this workflow with new patterns discovered
3. Consider if patterns apply to other components
4. Share insights in agent guestbook if significant

---

This workflow will evolve as we learn from porting actual components. The key is thoughtful modernization, not mechanical translation.
---
title: Write Primitive CSS
description: Workflow for implementing CSS for spec-defined primitive features, covering file structure, definition/theme separation, shadow DOM boundaries, and plural component patterns.
keywords: [CSS, primitives, shadow DOM, tokens, definition, theme, variations, states, layers]
audience: contributing
type: workflow
workflow: primitive-write-css
---

# Write Primitive CSS

> **Skill:** `sui:primitive-write-css`
> **Purpose:** Implement CSS for primitive features defined in `.spec.js` files

## Lifecycle Context

This is typically the **third step** in creating a primitive, after scaffolding and spec authoring.
- **Before**: Spec must exist with the feature defined (`primitive-refine.md`)
- **Reference**: Load `sui:component-specs` skill for spec format, `sui:component-css` or `sui:design-tokens` for token details

## How It Works

Every primitive has one CSS bundle that serves both its singular and plural components. The CSS is organized into paired files — **definition** (rules) and **theme** (variables) — grouped by spec section.

```
src/primitives/button/css/
├── button.css                          ← Root: imports definition + theme barrels
├── definition/
│   ├── button-definition.css           ← Barrel: imports all definition files with layers
│   ├── content/
│   │   ├── button.css                  ← Base element styles
│   │   └── icon.css                    ← Icon content styles
│   ├── types/
│   │   ├── emphasis.css                ← Primary/secondary (all options in one file)
│   │   └── styled.css                  ← Subtle/flat/outline/ghost
│   ├── states/
│   │   ├── hover.css
│   │   ├── disabled.css
│   │   └── loading.css
│   ├── variations/
│   │   ├── sizing.css                  ← All sizes in one file
│   │   ├── colored.css
│   │   └── compact.css
│   └── plural/
│       └── buttons.css                 ← Group container + child overrides
└── theme/
    ├── button-theme.css                ← Barrel: imports all theme files with layers
    ├── content/
    │   ├── button-variables.css        ← Base variable definitions
    │   └── icon-variables.css
    ├── types/
    │   └── emphasis-variables.css
    ├── states/
    │   └── hover-variables.css
    ├── variations/
    │   └── sizing-variables.css
    └── plural/
        └── buttons-variables.css
```

### What Goes Where

| File Type | Contains | Example |
|-----------|----------|---------|
| **Definition** (`definition/*.css`) | CSS rules, selectors, layout | `.primary.button { background: var(--button-primary-color); }` |
| **Theme** (`theme/*-variables.css`) | CSS variable definitions on `:host` | `--button-primary-color: oklch(0.55 0.2 260);` |

Definition files reference variables. Theme files define them. This separation lets themes change values without touching rules.

### The {ui} Pattern

Templates use `{ui}` as a placeholder that the component system fills with classes from spec attributes:

```html
<!-- Template -->
<div class="{ui}button">...</div>

<!-- <ui-button primary large> renders as: -->
<div class="primary large button">...</div>
```

Your CSS targets these spec-generated classes: `.primary.button`, `.large.button`, etc.

**Important**: If a spec feature with options needs its attribute name as a class (e.g., `.colored.red` not just `.red`), the spec must have `includeAttributeClass: true`. Boolean attributes (no options) automatically add their name as a class.

### includeAttributeClass and CSS Selectors

When a spec feature has options, you need to understand how `includeAttributeClass` changes what classes are generated — this directly affects your CSS selectors.

**Without `includeAttributeClass`** — only the option value becomes a class:
```html
<!-- animated="vertical" → class="vertical button" -->
```
```css
/* You can only target individual options */
.vertical.button { }
```

**With `includeAttributeClass: true`** — the attribute name is ALSO added as a class:
```html
<!-- animated="vertical" → class="animated vertical button" -->
```
```css
/* You can target ALL animated buttons with shared styles */
.animated.button { overflow: hidden; position: relative; }

/* AND target specific options */
.animated.vertical.button { /* vertical-specific rules */ }
.animated.fade.button { /* fade-specific rules */ }
```

This is essential when options share common CSS. Here's the real animated button pattern:

```css
/* css/definition/types/animated.css */

/* Shared across ALL animated options */
.button {
  &.animated {
    position: relative;
    overflow: hidden;
    z-index: var(--button-animated-z-index);

    > .content {
      display: inline-block;
      will-change: transform, opacity;
    }

    /* Default (horizontal) animation */
    > .visible.content { right: 0%; }
    > .hidden.content { right: -100%; }

    &:hover {
      > .visible.content { right: 200%; }
      > .hidden.content { right: 0%; }
    }
  }
}

/* Vertical option overrides shared base */
.button {
  &.animated.vertical {
    > .visible.content { transform: translateY(0%); }
    &:hover > .visible.content { transform: translateY(200%); }
  }

  /* Fade option overrides shared base */
  &.animated.fade {
    > .visible.content { opacity: 1; }
    > .hidden.content { opacity: 0; }
    &:hover {
      > .visible.content { opacity: 0; }
      > .hidden.content { opacity: 1; }
    }
  }
}
```

**Note on `compoundAliases`**: The animated spec also has `compoundAliases: true`, which means users write `<ui-button vertical-animated>` instead of just `<ui-button vertical>`. This is a spec-level concern for HTML disambiguation — it does **not** affect CSS. The generated classes are still `.animated.vertical.button` regardless of how the HTML attribute was written. See the `sui:component-specs` skill for details.

## Before You Start

### 1. Read the Spec

Always read the `.spec.js` first. The spec tells you:
- What section the feature is in (content, types, states, variations)
- Whether it has options (multiple values) or is boolean
- Whether `includeAttributeClass` is set
- What the attribute name is (this becomes your filename)

```bash
# Spec location:
src/primitives/[component]/specs/[component].spec.js
```

### 2. Read the HTML Template

Check what elements exist and what slots are available:

```bash
# Template location:
src/primitives/[component]/[component].html
```

### 3. Route to the Right Section

```
What spec section is the feature in?
├── content[]              → Style a content element (icon, label, header)
├── types[]                → Style mutually exclusive modes (emphasis, styled)
├── states[]               → Style runtime states (hover, disabled, loading)
├── variations[]           → Style stackable modifiers (size, color, fluid)
├── pluralOnlyTypes[]      → Style in types/ (targets plural container)
├── pluralOnlyVariations[] → Style in variations/ (targets plural container)
└── settings[]             → No CSS needed (component behavior only)
```

## Implementing a Feature

This is the same process for any feature type. The only thing that changes is the folder.

### Step 1: Create the Definition File

**Location**: `css/definition/[section]/[attribute-name].css`

**File name must match the spec attribute exactly.** If the spec says `attribute: 'emphasis'`, the file is `emphasis.css`.

For features with options, **all options go in one file**:

```css
/* css/definition/types/emphasis.css */

/*-------------------
     Primary
--------------------*/
.primary.button {
  background-color: var(--button-primary-color);
  color: var(--button-primary-text-color);
}

/*-------------------
     Secondary
--------------------*/
.secondary.button {
  background-color: var(--button-secondary-color);
  color: var(--button-secondary-text-color);
}
```

For boolean features (no options):

```css
/* css/definition/variations/fluid.css */
.fluid.button {
  width: 100%;
  display: block;
}
```

**All CSS must use nested syntax**:
```css
/* Nesting for states */
.button {
  @media (pointer: fine) {
    &:hover {
      background-color: var(--button-hover-background);
    }
  }
}

/* Nesting for host */
:host {
  &([disabled]) {
    pointer-events: none;
  }
}
```

### Step 2: Create the Theme File

**Location**: `css/theme/[section]/[attribute-name]-variables.css`

Define CSS variables on `:host`:

```css
/* css/theme/types/emphasis-variables.css */
:host {
  --button-primary-color: var(--primary-color);
  --button-primary-text-color: var(--white);
  --button-primary-color-hover: var(--primary-color-hover);

  --button-secondary-color: var(--secondary-color);
  --button-secondary-text-color: var(--white);
}
```

**Variable scoping rule**: Theme files can only reference:
1. Variables defined in the same `:host` block
2. Global tokens from `/src/css/tokens/`
3. Nothing else — variables from other theme files are not in scope

### Step 3: Add to Barrel Files

Add imports to **both** barrel files. Order doesn't strictly matter, but keep sections grouped logically.

**Definition barrel** (`css/definition/[component]-definition.css`):
```css
@import url('./types/emphasis.css') layer(button.definition.types.emphasis);
```

**Theme barrel** (`css/theme/[component]-theme.css`):
```css
@import url('./types/emphasis-variables.css') layer(button.theme.types.emphasis);
```

**Layer naming pattern**: `[component].[definition|theme].[section].[attribute-name]`

### That's It

For most features, this three-step process is all you need:
1. Write rules in definition file
2. Define variables in theme file
3. Add imports to barrel files

## CSS Values: What to Use

```
Need a CSS value?
├── System token exists? (check /src/css/tokens/)
│   └── YES → Use it: var(--border-color), var(--text-color), var(--border-radius)
├── Should scale with font-size? (padding, spacing proportional to text)
│   └── YES → Use relative tokens: var(--Npx) like var(--3px), var(--12px)
├── Component-specific value needed?
│   └── Define in theme file, ask user if uncertain
└── Fixed value? (borders, minimum sizes)
    └── Use fixed px values
```

**When uncertain about which token to use, ask the user.** Don't guess or create redundant variables.

## Selector Reference

### Singular Components

```css
/* Component host */
:host { }
:host([disabled]) { }

/* Template elements (inside shadow DOM) */
.button { }
.button .icon { }

/* Slotted content (user-provided) */
::slotted(.header) { }
::slotted(ui-icon) { }
```

### Plural Components

Plural components can't style inside child shadow DOMs with selectors. Use CSS variables instead.

```css
/* Container styling */
.buttons {
  display: inline-flex;
}

/* Affect children via ::slotted + CSS variables */
.buttons ::slotted(ui-button) {
  --button-border-radius: 0;      /* Override child's variable */
  --button-horizontal-margin: 0;
  margin: 0;
}

/* Target specific children */
.buttons ::slotted(ui-button:is(:first-child)) {
  --button-border-radius: var(--border-radius) 0 0 var(--border-radius);
}
```

**Why this works**: CSS variables inherit through shadow boundaries even though selectors can't penetrate them. Setting `--button-border-radius` on the slotted `ui-button` element makes that value available inside button's shadow DOM.

```css
/* ❌ IMPOSSIBLE — selectors can't pierce shadow DOM */
.buttons ::slotted(ui-button)::part(button) { }
.buttons > ui-button .button { }

/* ✅ CORRECT — variables inherit through shadow boundaries */
.buttons ::slotted(ui-button) {
  --button-border-radius: 0;
}
```

### Plural Variations That Affect Children

When a plural variation needs to change child appearance (e.g., sizing all buttons in a group):

```css
/* css/definition/variations/sizing.css */

/* Singular */
.mini.button { font-size: var(--button-mini); }
.small.button { font-size: var(--button-small); }
.large.button { font-size: var(--button-large); }

/* Plural — override the child's default size variable */
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

**To find which variables to override**: Read the child component's theme files to see what variables it defines, then override those on `::slotted()`.

### Variable Preservation in Plural Components

When plural components modify a child variable (e.g., `--button-border-radius: 0` to connect buttons), the original value is lost. The **preservation pattern** saves it:

```css
/* theme/plural/buttons-variables.css — save original before modifying */
:host {
  --button-group-button-border-radius: var(--border-radius);
}

/* definition/plural/buttons.css — modify the actual variable */
.buttons ::slotted(ui-button) {
  --button-border-radius: 0;
}

/* definition/variations/attached.css — reference the preserved copy */
.top-attached.buttons ::slotted(ui-button:is(:first-child)) {
  --button-border-radius: var(--button-group-button-border-radius) var(--button-group-button-border-radius) 0 0;
}
```

**Rule**: Read from preservation variables, write to actual variables.

## Comment Formatting

```css
/*-------------------
     Section Name
--------------------*/

/* Subsection */
.primary.button { }

/* Subsection */
.secondary.button { }
```

Only add technical comments for non-obvious browser workarounds or critical implementation notes. Don't explain what CSS properties do.

## Variation Stacking

Variations are combinable. After implementing one, check if it conflicts with others:

1. **Do any other variations affect the same CSS properties?**
2. **Is the combination likely to be used?** (e.g., `vertical separate` buttons = common)
3. **If yes to both**: Add resolution rules in the primary variation's file
4. **If the combination is nonsensical**: Skip it, let cascade handle it

```css
/* Handle common combination: separate + vertical */
.separate.vertical.buttons {
  ::slotted(ui-button) {
    --button-horizontal-margin: 0;
    --button-vertical-margin: var(--button-separate-spacing);
  }
}
```

## Checklist

Before completing implementation:

- [ ] File name matches spec `attribute` exactly
- [ ] File location matches spec section (`types/`, `variations/`, `states/`, `content/`)
- [ ] Both definition and theme files created (theme can be empty `:host {}`)
- [ ] Both barrel files updated with correct layer names
- [ ] Layer name follows `[component].[definition|theme].[section].[attribute]`
- [ ] Nested CSS syntax used throughout
- [ ] CSS tokens verified to exist in `/src/css/tokens/`
- [ ] `includeAttributeClass` checked in spec for features with options
- [ ] Variation stacking conflicts considered

## Common Mistakes

1. **Missing `includeAttributeClass` in spec** — If you need `.colored.red` (both attribute and value as classes), the spec must have `includeAttributeClass: true`
2. **Importing spec JSON directly** — Components import from generated `.component.js`, not `.spec.json`
3. **Trying to pierce shadow DOM with selectors** — Use CSS variables on `::slotted()` instead
4. **Referencing out-of-scope variables in theme files** — Theme files can only see their own `:host` block and global tokens
5. **Creating unnecessary variables** — Use existing tokens first, ask before creating new ones
6. **Not using nested CSS** — All component CSS must use nested syntax
7. **Splitting options across files** — All options for one attribute go in ONE file
8. **Setting preservation variables on children** — Read from `--button-group-button-border-radius`, write to `--button-border-radius`

## Build

After creating CSS files, the user runs:

```bash
npm run build:ui-deps
```

This bundles all CSS imports into `[component]-bundle.css`, which is loaded into the component's shadow DOM. **Agents should not run build commands unless explicitly asked.**

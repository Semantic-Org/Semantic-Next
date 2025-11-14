# Code Formatting Guide

> Last Updated: 2025-11-14

**Purpose**: Code formatting standards and comment hierarchy
**Audience**: All developers

## Formatting Rules

All code formatting follows `/dprint.json`:

- 2-space indentation (no tabs)
- 120 character line width
- Single quotes preferred
- Always use semicolons
- Always use braces
- Sorted imports (case-insensitive)
- Trailing commas only on multi-line structures

**When in doubt**: Run the formatter or match existing code style.

> **Note**: CSS files are not formatted by dprint. Follow CSS nesting patterns from the CSS guide.

## Comment Hierarchy

For large CSS files, config files, and organized code files, use three-level comment hierarchy:

### Level 1: Major Sections

```css
/*******************************
            Groups
*******************************/
```

**Use for**: File headers, major functional groups (every 50-100+ lines)

### Level 2: Sub-sections

```css
/*-------------------
      Or Buttons
--------------------*/
```

**Use for**: Related content within major sections (every 20-50 lines)

### Level 3: Minor Divisions

```css
/* Types */
```

**Use for**: Small logical groupings (5-15 lines)

## Comment Guidelines

- **Use title case, not all caps**: `/* Primary Button */` not `/* PRIMARY BUTTON */`
- **Don't overuse comments** - only where they provide value as breadcrumbs
- Use simple, concise comments: `/* Remove duplicates from an array */`
- Consider how Vue, Vite, Svelte use comments - minimal and purposeful
- Match existing style in the file you're editing

## Application

**CSS Files** (`src/css/`, `src/primitives/*/css/`):
- Level 1: Theme sections, major groups
- Level 2: Variations, states, components
- Level 3: Types, small divisions

**Config Files** (build configurations):
- Level 1: Configuration domains
- Level 2: Specific tools, features
- Level 3: Options, flags

**Large Files** (>200 lines):
- Level 1: Major functional areas
- Level 2: Sub-features, groupings
- Level 3: Implementation details

## Best Practices

✅ **DO:**
- Use consistent spacing
- Center-align Level 1 and Level 2 headers
- Keep headers concise (2-4 words)
- Match indentation to code

❌ **DON'T:**
- Mix comment styles in one file
- Over-use Level 1 headers
- Skip levels (Level 1 → Level 3)
- Use for tiny sections (< 5 lines)

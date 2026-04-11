# Plan: Sizing System Redesign

## Overview

Reorganize and consolidate the sizing/spacing/padding/margin token system with clear separation between:
- **rem-based tokens** (fixed to root, layout rhythm)
- **em-based tokens** (scales with component)

## Phase 1: Inventory Existing System

**Create scratch file:** `ai/workspace/memory/sizing-inventory.md`

Document all existing groupings from:
- `src/css/tokens/global/sizing.css`
- `src/css/tokens/global/spacing.css`
- `src/css/tokens/computed/em-sizing.css`
- `src/css/tokens/computed/layout.css` (padding/margin sections)

For each grouping, record:
- Group name
- Token names
- Values/formulas
- Unit type (rem/em/px/unitless)
- Purpose

---

## Phase 2: Extract to Scratch Files

Move each logical grouping to: `ai/workspace/memory/sizing/[groupname].css`

Proposed groupings:
1. `base-values.css` - unitless base numbers (--size-3xs-base, --em-size, etc.)
2. `size-scale-rem.css` - --size-{scale} tokens (rem)
3. `size-scale-em.css` - --size-{scale}-em tokens (em)
4. `size-aliases.css` - --3xs, --micro, --relative-micro, etc.
5. `pixel-values-rem.css` - --1px through --64px (rem)
6. `pixel-values-em.css` - --relative-1px through --relative-64px (em)
7. `spacing-scale.css` - --spacing-{scale} tokens
8. `padding-scale.css` - --padding-{scale} tokens
9. `margin-scale.css` - --margin-{scale} tokens
10. `layout-utilities.css` - --horizontally-padded, --centered, etc.

**After extraction:**
- Remove extracted rules from src/css files
- Delete any now-empty files

---

## Phase 3: Design New System

**Create:** `ai/workspace/memory/sizing-new-system.css`

Requirements:
1. **Base values** (unitless) - foundation for calculations
2. **Spacing scale (rem)** - layout rhythm, fixed to root
   - Used for: gaps between layout elements, section spacing
   - `--spacing-{3xs→3xl}` + natural language aliases
   - Structural aliases: `--spacing-section`, `--spacing-page`
3. **Padding scale (em)** - component internal, scales
   - Uses spacing progression but em units
   - `--padding-{3xs→3xl}` + natural language aliases
4. **Margin scale (rem)** - document flow
   - Aliases spacing (same values)
   - `--margin-{3xs→3xl}` + natural language aliases
5. **Size scale (rem + em)** - component sizing
   - `--size-{3xs→3xl}` (rem)
   - `--size-{3xs→3xl}-em` (em)
   - Short aliases: `--3xs`, `--relative-3xs`, etc.
6. **Pixel values (rem + em)** - exact measurements
   - `--{n}px` (rem)
   - `--relative-{n}px` (em)

Key decisions:
- Medium (--m) always equals 1rem or 1em (14px at default)
- Padding uses em (scales with component)
- Spacing/margin use rem (fixed layout rhythm)
- Remove `-none` tokens (just use `0`)

---

## Phase 4: Implement New System

Move sections from `sizing-new-system.css` to src/css files:

| Section | Destination |
|---------|-------------|
| Base config (font-size, em-size, unitless bases) | `src/css/tokens/global/sizing.css` |
| Spacing, padding, margin scales + aliases | `src/css/tokens/computed/spacing.css` |
| Size scale, pixel utilities, short aliases | `src/css/tokens/computed/sizing.css` |

**File changes:**
- Rename `em-sizing.css` → `sizing.css` (in computed/)
- Move padding/margin from `layout.css` → `spacing.css`
- Update barrel file: `src/css/tokens/index.css`

---

## Phase 5: Verify Completeness

Compare new system against extracted files in `ai/workspace/memory/sizing/`:

For each old grouping, verify:
- [ ] Functionality preserved or intentionally removed
- [ ] No missing tokens that were in use
- [ ] Unit types correct (rem vs em)
- [ ] Aliases work correctly

Document any gaps or intentional removals.

Discuss findings with user before finalizing.

---

## Files Affected

**Read/Extract from:**
- `src/css/tokens/global/sizing.css`
- `src/css/tokens/global/spacing.css`
- `src/css/tokens/computed/em-sizing.css`
- `src/css/tokens/computed/layout.css`

**Create:**
- `ai/workspace/memory/sizing-inventory.md`
- `ai/workspace/memory/sizing/*.css` (extracted groupings)
- `ai/workspace/memory/sizing-new-system.css`

**Modify:**
- Source files above (remove old, add new)
- `src/css/tokens/index.css` (if needed)

---

## Checkpoints

1. [ ] Inventory complete
2. [ ] Extraction complete
3. [ ] New system designed
4. [ ] New system implemented in src/css
5. [ ] Comparison complete, gaps documented
6. [ ] User approval

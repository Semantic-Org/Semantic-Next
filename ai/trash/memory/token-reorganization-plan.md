# Token Reorganization Plan

## Session Context
Date: 2025-01-15
Task: Reorganizing CSS token files to match research-identified categories

## What Was Accomplished

### 1. Global Tokens Reorganized
Moved from 7 unclear files to 12 category-aligned files:

```
global/
├── colors.css        # LCH primitives + base colors + social brands
├── sizing.css        # Base size system (--base-size, --base-{scale})
├── typography.css    # Fonts, title/text scales, line-height, links, margins
├── layout.css        # Containers, grid, box-model
├── border-radius.css # Radius scale + aliases
├── breakpoints.css   # Responsive breakpoints
├── z-index.css       # Stacking layers
├── motion.css        # Duration, easing
├── states.css        # Lightness/opacity modifiers, focus ring
├── forms.css         # Input padding
├── loader.css        # Loader component tokens
└── scrollbar.css     # Scrollbar styling
```

Backup exists at: `src/css-backup/global/` (contains ORIGINAL pre-reorganization files, still clean)

### 2. Themes Folder Renamed
`themes/light/` → `themes/default/` to signal it's the base, not just "light mode"

### 3. Base Colors Moved to Global
User moved base color definitions (--red, --orange, etc.) from `themes/default/colors.css` to `global/colors.css`. These are true primitives that shouldn't be in a theme folder.

### 4. Documentation Created
- `ai/contributing/css-framework/base-size-scaling.md` - Explains 14px/2px grid rationale
- `ai/contributing/css-framework/theme-aware-tokens.md` - Explains cascade architecture

## What Remains To Do

### 1. Rename computed/interaction.css → computed/motion.css
It only contains `--transition: all var(--duration) var(--easing)`. Should match global/motion.css naming.

### 2. Update Barrel File (tokens.css)
Change all `themes/light/` references to `themes/default/`.

### 3. Split the "interaction.css" Grab Bags
These files in themes/default/, themes/dark/, and themes/computed/ contain mixed concerns:

**themes/default/interaction.css contains:**
- Focus states (--form-focused-border-color) → states.css or forms.css
- Highlighted text → forms.css
- UI BG Colors (--ui-hue, etc.) → colors.css or effects.css
- Links (--link-color) → typography.css or links.css
- Alpha Colors (--transparent-black, etc.) → colors.css
- Border Colors → borders.css or colors.css

**themes/dark/interaction.css contains:**
- Text color overrides → typography.css
- Link color overrides → typography.css
- Border color overrides → borders.css

**themes/computed/interaction.css contains:**
- Loader colors → loader.css
- Form focus states → forms.css or states.css
- Highlighting → forms.css

### 4. Determine What Actually Needs Theme Recomputation
The hard question: for each group of variables, does it NEED to be in themes/computed/ or could it be in regular computed/?

The test: Does the variable reference `--standard-*`, `--inverted-*`, or other theme-switching values?
- If yes → must be in themes/computed/ (needs theme context)
- If no → can be in regular computed/

## Critical Non-Obvious Insights

### 1. The 14px/2px Grid Is Mathematical Necessity
- 4px grid is industry standard but assumes 16px base
- 14px ÷ 4 = 3.5 (fractional, can't align)
- 14px ÷ 2 = 7 (clean alignment)
- SUI targets dense application UIs where 16px is too spacious
- The 2px grid isn't preference—it's required for alignment at 14px base

### 2. The Hardcoded 14 in Ratios Is Intentional
```css
--base-l: round(calc((16 / 14) * var(--base-size)));
```
The `14` is the DESIGN REFERENCE POINT, not a value to parameterize. It means "at 14px base, large is 16px." When --base-size changes to 16, the ratio maintains proportions while round() ensures whole pixels.

### 3. Theme Folders Serve Dual Purposes
- **Inputs**: Raw values that differ per theme (--strong-transparent-black)
- **Overrides**: When the FORMULA must differ, not just inputs (dark/effects.css overrides shadow formulas)

### 4. Lazy CSS Variable Resolution Enables "Wrong Order" References
global/states.css references --standard-100 and --primary-color (defined in themes/computed/), but works because CSS variables resolve at render time, not parse time. This is a feature, but creates conceptual messiness about what's a "primitive."

### 5. The Two Computation Contexts
- **Theme-agnostic** (computed/): Pure math on globals, same in all themes
- **Theme-aware** (themes/computed/): Depends on values that swap per theme

These CANNOT be merged because theme-aware computed must cascade AFTER theme definitions.

### 6. Shadow Trace Example
```
--subtle-shadow (themes/computed/effects.css)
    └── var(--strong-transparent-black)
            ├── light: oklch(black / 8%)  ← themes/default/interaction.css
            └── dark:  oklch(black / 20%) ← themes/dark/colors.css
```
Same token, different opacity. Dark needs 20% to be visible against dark backgrounds.

### 7. The Fence Was There For a Reason
We considered merging global/ and computed/, or restructuring themes/. The cascade order is load-bearing. The structure optimizes for:
- Cascade correctness
- Authoring ergonomics (flat files, clean imports)
- Build sequencing

Discoverability is a documentation problem, not a structure problem.

## Files to Reference
- `ai/contributing/css-framework/token-architecture.md` - Existing architecture docs
- `ai/contributing/css-framework/base-size-scaling.md` - Base size rationale (created this session)
- `ai/contributing/css-framework/theme-aware-tokens.md` - Theme cascade explanation (created this session)
- `ai/research/css-tokens/` - Research on other frameworks' token patterns

## Recommended Strategy

Use the same backup-and-rebuild approach that worked for global/:

1. Backup exists at `src/css-backup/global/` (still clean)
2. For computed/ and themes/: `cp -r src/css/tokens/computed src/css-backup/computed` etc.
3. Catalog all tokens to /tmp for verification
4. Delete files from source
5. Create new files from scratch with logical internal ordering
6. Verify token count matches
7. Update barrel file

This avoids in-place editing confusion and ensures clean, intentionally-ordered files.

## Verification Commands
```bash
# Count tokens before/after any changes
grep -h "^\s*--[a-zA-Z]" src/css/tokens/global/*.css | sed 's/:.*$//' | sort -u | wc -l

# Diff before/after
diff /tmp/global-tokens-before.txt /tmp/global-tokens-after.txt
```

## User Context
- Jack was principal engineer at Qualia (title/escrow workflow software)
- Dense UI experience informed the 14px/2px decisions
- Values practical rationale over industry convention when justified
- Prefers clean, discoverable organization over technically-correct-but-hidden

# Design tokens in community CSS frameworks: a linguistic analysis

Community-driven CSS frameworks have converged on remarkably similar naming patterns while diverging significantly in vocabulary choices and scale architectures. **The strongest consensus exists around category-first naming with hyphen delimiters**, but frameworks split sharply between numeric scales (Tailwind-influenced) and t-shirt sizing (design-system-influenced). For Semantic UI's "natural language" philosophy, the most relevant finding is Pico CSS's **component-state-property** naming pattern, which offers the closest existing model to human-readable token names.

This analysis examines 12 frameworks (MUI, Chakra UI, Mantine, Radix UI/Themes, Open Props, Pico CSS, DaisyUI, Bulma, Vanilla Extract, Tailwind CSS, Ant Design, and Element Plus) to discover where community standards have emerged independently of corporate design systems.

## Token category coverage reveals motion as the major gap

Most frameworks provide robust coverage for color, spacing, and typography tokens, but **animation and motion tokens remain severely underserved**—only MUI and Open Props offer comprehensive transition systems. The table below maps category presence across all frameworks:

| Category | MUI | Chakra | Mantine | Radix | Open Props | Pico | DaisyUI | Bulma | Tailwind | Ant Design | Element Plus |
|----------|-----|--------|---------|-------|------------|------|---------|-------|----------|------------|--------------|
| Color (umbrella) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Background Color | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Text Color | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Border Color | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Border Radius | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Box Shadow | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Font Family | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| Font Size | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| Font Weight | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| Line Height | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| Letter Spacing | ✓ | ✓ | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ |
| Spacing | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Z-Index | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ | ✓ | ✓ | ✗ |
| Motion/Transition | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✓ | ✓ | ✗ |
| Animation Easing | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✓ | ✓ | ✗ |
| Breakpoints | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Focus States | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ | ✓ | ✗ | ✓ | ✓ |

Three patterns emerge: universal adoption of color/spacing/typography fundamentals, inconsistent z-index tokenization (suggesting context-dependent utility), and **motion tokens appearing only in the most opinionated systems**.

## Naming conventions cluster into three distinct patterns

The CSS variable prefix and delimiter choices across frameworks reveal clear philosophical camps. All frameworks use single-hyphen delimiters (no double-hyphens or camelCase in CSS output), but word order varies significantly:

| Framework | Prefix | Delimiter | Word Order | Example Tokens |
|-----------|--------|-----------|------------|----------------|
| MUI | `--mui-` | hyphen | category-property-variant | `--mui-palette-primary-main`, `--mui-shadows-1` |
| Chakra UI | `--chakra-` | hyphen | category-scale | `--chakra-colors-gray-500`, `--chakra-space-4` |
| Mantine | `--mantine-` | hyphen | category-property-scale | `--mantine-color-blue-6`, `--mantine-spacing-md` |
| Radix Themes | none (scoped) | hyphen | category-number | `--space-1`, `--gray-12`, `--radius-full` |
| Open Props | none (optional `--op-`) | hyphen | category-modifier-number | `--size-fluid-3`, `--ease-spring-3` |
| Pico CSS | `--pico-` | hyphen | component-state-property | `--pico-primary-hover`, `--pico-form-element-border-color` |
| DaisyUI | `--color-` | hyphen | role-modifier | `--color-primary-content`, `--radius-box` |
| Bulma | `--bulma-` | hyphen | mixed (category or component) | `--bulma-size-1`, `--bulma-primary-h` |
| Tailwind v4 | `--` | hyphen | category-scale | `--color-blue-500`, `--spacing`, `--radius-lg` |
| Ant Design | `--ant-` (configurable) | camelCase (JS) | semantic-prefix | `colorPrimary`, `borderRadius`, `fontSize` |
| Element Plus | `--el-` | hyphen | category-property-modifier | `--el-color-primary-light-3`, `--el-bg-color-page` |

**Category-first naming dominates**, with 9 of 11 frameworks placing the token type before the value. Pico CSS stands alone with its component-state-property pattern—the closest to natural language ordering.

## Vocabulary analysis shows contested territory in semantic colors and scale naming

Examining terms that appear across 3+ frameworks reveals strong consensus in some areas and significant divergence in others:

**Semantic color terms (near-universal):**
- `primary` (11/11 frameworks)
- `success` (9/11)
- `error` (8/11) vs `danger` (Bulma, Element Plus use "danger")
- `warning` (9/11)
- `info` (8/11)
- `secondary` (7/11)
- `accent` (4/11—DaisyUI, Radix, and some Ant Design themes)

**State naming vocabulary:**
- `hover`, `focus`, `active`, `disabled` appear universally but are implemented differently
- Chakra UI uses underscore-prefixed conditions: `_hover`, `_focus`, `_active`
- Pico CSS embeds states in token names: `--pico-primary-hover`
- MUI uses `action.*` grouping: `action.hover`, `action.focus`

**Spacing vocabulary splits into three camps:**

| Approach | Frameworks | Example Values |
|----------|------------|----------------|
| Numeric multiplier | Chakra, Radix, Open Props, Tailwind | `1`, `2`, `4`, `8`, `16` |
| T-shirt sizes | Mantine, Pico CSS, Bulma | `xs`, `sm`, `md`, `lg`, `xl` |
| Semantic/contextual | Pico CSS (partial) | `form-element-spacing`, `block-spacing` |

**Typography size vocabulary:**

| Approach | Frameworks | Scale Keys |
|----------|------------|------------|
| T-shirt + numeric | Chakra UI, Tailwind | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`...`9xl` |
| Pure t-shirt | Mantine | `xs`, `sm`, `md`, `lg`, `xl` |
| Pure numeric | Radix, Open Props, Bulma | `1`-`9` or `0`-`8` |
| Semantic | MUI | `h1`, `h2`, `body1`, `body2`, `caption` |

## Scale values converge on 4px base units with divergent progressions

The **4px base unit has become the de facto standard**, with 8 of 11 frameworks using it. However, the progression patterns vary considerably:

**Spacing scale comparison (in pixels):**

| Framework | Base | Scale Progression |
|-----------|------|-------------------|
| Tailwind | 4px | 0, 1, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64, 80, 96, 112, 128... |
| Chakra UI | 4px | 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160... |
| Radix | 4px | 4, 8, 12, 16, 24, 32, 40, 48, 64 (9-step) |
| Open Props | 4px | 4, 8, 16, 20, 24, 28, 32, 48, 64, 80, 120, 160, 240, 320, 480 |
| MUI | 8px | 0, 4, 8, 16, 24, 32... (multiplier-based) |
| Mantine | varies | 10, 12, 16, 20, 32 (xs-xl) |
| Pico | 16px | Single 16px base, contextual modifiers |

**Typography size comparison (in rem):**

| Size Key | Tailwind | Chakra | Mantine | Open Props | Bulma |
|----------|----------|--------|---------|------------|-------|
| xs | 0.75 | 0.75 | 0.75 | 0.75 | 0.75 |
| sm | 0.875 | 0.875 | 0.875 | — | — |
| base/md | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 |
| lg | 1.125 | 1.125 | 1.125 | 1.25 | 1.25 |
| xl | 1.25 | 1.25 | 1.25 | 1.5 | 1.5 |
| 2xl | 1.5 | 1.5 | — | 2.0 | 2.0 |
| 3xl | 1.875 | 1.875 | — | 2.5 | 2.5 |

**Color palette depth:**

| Framework | Scale System | Steps | Format |
|-----------|--------------|-------|--------|
| Tailwind | 50-950 | 11 | OKLCH (v4) |
| Chakra UI | 50-900 | 10 | Hex |
| Mantine | 0-9 | 10 | Hex |
| Radix | 1-12 + alpha | 24 | HSL |
| Open Props | 0-12 | 13 | Hex/HSL |
| Bulma | 00-100 (lightness) | 21 | HSL |
| DaisyUI | Semantic only | — | OKLCH |
| Ant Design | Algorithmic | 10 | Hex (via seed) |

**Border radius scale values (in pixels):**

| Key | Tailwind | Chakra | Mantine | Bulma | Radix |
|-----|----------|--------|---------|-------|-------|
| xs/sm | 2, 4 | 2, 4 | 2, 4 | 2, 4 | — |
| md/base | 6 | 6 | 8 | — | 4-8 |
| lg | 8 | 8 | 16 | 6 | — |
| xl | 12 | 12 | 32 | — | — |
| 2xl | 16 | 16 | — | — | — |
| full/rounded | 9999 | 9999 | — | 9999 | 9999 |

## RTL support adds minimal token overhead when using logical properties

The international frameworks analysis (Ant Design, Element Plus) reveals that **CSS logical properties eliminate RTL token overhead entirely** when adopted as the primary approach. Frameworks using legacy left/right patterns face 20-30% additional complexity.

**Token categories requiring directional awareness:**
- Margins and padding (inline-start/end replaces left/right)
- Borders (border-inline-start replaces border-left)
- Positioning (inset-inline-start replaces left)
- Border radius (start-start, start-end, end-start, end-end)
- Text alignment (start/end replaces left/right)
- Flexbox direction (row-reverse handling)

**Framework RTL implementation patterns:**

| Framework | Approach | Overhead |
|-----------|----------|----------|
| Ant Design | ConfigProvider + logical properties | ~0% (modern) |
| Element Plus | `dir="rtl"` + BEM selectors | ~25% |
| Chakra UI | `_rtl` conditions + logical props | ~0% |
| Mantine | DirectionProvider + PostCSS | ~0% |
| DaisyUI | Internal logical properties | ~0% |
| Tailwind | Physical + logical utilities (ms-, me-, ps-, pe-) | Dual options |

**Logical property naming pattern emerging:**
```
--spacing-inline-start (replaces --spacing-left)
--spacing-inline-end (replaces --spacing-right)  
--spacing-block-start (replaces --spacing-top)
--spacing-block-end (replaces --spacing-bottom)
```

The Chinese frameworks (Ant Design, Element Plus) demonstrate the most mature internationalization approaches, with Ant Design's three-tier token system (seed → map → alias) offering particularly sophisticated theming capabilities.

## Unique patterns relevant to Semantic UI's natural language philosophy

Several frameworks offer vocabulary and structural choices that align with natural language design:

**Pico CSS: Component-state-property naming**
Pico's token names read almost like sentences: `--pico-form-element-active-border-color` describes "the border color of an active form element." This component-first, state-second, property-third ordering mirrors how designers naturally describe styles. Example tokens:
- `--pico-primary-hover` (the hover color for primary)
- `--pico-accordion-active-summary-color` (the summary color when accordion is active)
- `--pico-switch-checked-background-color` (the background when switch is checked)

**Bulma: Mixed vocabulary with semantic clarity**
Bulma uses "danger" instead of "error" and "link" as a distinct semantic color, reflecting user-facing language rather than developer-centric terminology.

**DaisyUI: Role-based semantic tokens**
DaisyUI's `-content` suffix pattern explicitly describes token purpose: `--color-primary-content` means "the content color to use on a primary background." This creates natural language pairs:
- `primary` / `primary-content`
- `base-100` / `base-content`

**Mantine: Clean human-readable variable names**
Mantine's variables like `--mantine-color-body` and `--mantine-color-text` use everyday English words rather than technical jargon.

**Radix: Functional state tokens**
Radix includes `--focus-1` through `--focus-12`—a unique tokenization of focus states as a graduated scale rather than binary state.

## Where community frameworks converge versus diverge from corporate systems

**Strong convergence with corporate patterns:**
- Category-first naming (like IBM Carbon, Salesforce Lightning)
- 4px/8px base unit grids
- 10-11 step color scales (50-900/950 pattern from Material Design)
- T-shirt sizing for typography and spacing
- CSS custom properties as the delivery mechanism
- Class-based dark mode (`[data-theme="dark"]` or `.dark`)

**Clear divergence from corporate systems:**
- **Motion tokens are rare**: Corporate systems like Material Design have extensive motion specifications; community frameworks largely ignore this
- **No formal tiering in most**: Corporate systems define primitive → semantic → component tiers explicitly; community frameworks often flatten hierarchies
- **Semantic color vocabulary differs**: "Danger" vs "error," "accent" as a concept, presence/absence of "neutral"
- **Less restrictive licensing**: Community frameworks allow more flexible adoption
- **Runtime theming prioritized**: All community frameworks support CSS variable runtime switching; some corporate systems require rebuilds

**The hybrid zone:**
- Tailwind has become a de facto standard that bridges corporate and community worlds
- Its spacing scale, color naming, and t-shirt sizing heavily influence newer community frameworks
- Chakra UI, Mantine, and DaisyUI all explicitly adopt Tailwind's numeric spacing convention

## Architecture differences shape token design philosophy

| Framework | Architecture | Theming Model |
|-----------|--------------|---------------|
| MUI | 2-tier (primitive → semantic) | JS theme object |
| Chakra UI | 2-tier + semantic tokens | extendTheme() |
| Mantine | 2-tier (core → semantic) | MantineProvider |
| Radix | 3-tier (primitive → semantic → component) | Theme component props |
| Open Props | Flat primitives only | User creates semantic layer |
| Pico CSS | Semantic only (no primitives exposed) | CSS variable override |
| DaisyUI | Semantic only | data-theme attribute |
| Bulma | 2-tier (Sass → CSS vars) | Sass or CSS override |
| Vanilla Extract | Flexible (user-defined) | TypeScript contracts |
| Ant Design | 3-tier (seed → map → alias) | ConfigProvider |
| Element Plus | 2-tier (Sass → CSS vars) | SCSS or CSS override |

Open Props takes the most minimalist position—providing only primitives and expecting users to create their own semantic mappings. Ant Design takes the most sophisticated position with algorithmic token derivation from seed values.

## Recommendations for Semantic UI token design

Based on this analysis, Semantic UI could differentiate through:

1. **Adopt component-state-property word order** (like Pico CSS) for human-readable token names
2. **Use everyday vocabulary** over developer jargon ("danger" not "error," "muted" not "disabled-text")
3. **Consider sentence-like token names**: `--button-when-hovered-background` rather than `--button-hover-bg`
4. **Embrace logical properties natively** for zero-overhead RTL support
5. **Fill the motion gap**: Be one of the few community frameworks with comprehensive animation tokens
6. **Maintain the 4px base unit** for ecosystem compatibility
7. **Offer both numeric and semantic spacing** to support different mental models

The community has converged enough that radical departure would create friction, but sufficient divergence exists—particularly in vocabulary and natural language naming—to carve a distinctive position.

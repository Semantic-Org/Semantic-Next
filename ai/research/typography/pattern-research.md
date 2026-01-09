# Component Pattern Research: Text / Typography

> Last Modified: 2025-11-10

## Research Summary
- Frameworks surveyed: 6
- Date: 2025-11-10
- Unique patterns identified: 70+
- Component type: Text / Typography for textual content rendering and formatting

## Component Definition Consensus

Across all surveyed frameworks, Text/Typography components serve as **textual content presentation systems** with varying philosophical approaches:

1. **Semantic HTML Foundation**: All frameworks emphasize proper semantic HTML (h1-h6, p, span) as the foundation
2. **Visual Hierarchy**: Providing clear typographic scales from large display headings to small caption text
3. **Style Control**: Supporting font size, weight, color, alignment, and other text properties
4. **Theme Integration**: Deep integration with design systems and design tokens
5. **Flexibility Spectrum**: Ranging from primitive styling components (Chakra, Mantine) to feature-rich interactive components (Ant Design) to pure utility examples (shadcn/ui)

The mental models vary significantly:
- **Compositional** (Ant Design): Typography.Title, Typography.Text, Typography.Paragraph sub-components
- **Dual-component** (Mantine, Chakra): Separate Text and Heading/Title components
- **Single-component** (MUI): One Typography component with variant-based styling
- **Class-based** (Semantic UI): CSS classes on semantic HTML elements
- **Utility-first** (shadcn/ui): Copy-paste Tailwind CSS patterns, not components

## Terminology Variations

### Component Names
- **Typography** (3 frameworks) - Ant Design (container), MUI (component), Mantine (layout helper)
- **Text** (4 frameworks) - Chakra UI, Mantine, Ant Design (sub-component), Semantic UI (docs reference)
- **Heading/Title** (4 frameworks) - Chakra UI (Heading), Mantine (Title), Semantic UI (Header), MUI (h1-h6 variants)
- **Paragraph** (2 frameworks) - Ant Design (sub-component), MUI (prop)

### Prop/Class Names

**Font Size:**
- `size` prop (3 frameworks) - Heading size, Title size/order, Typography variant
- `fontSize` prop (2 frameworks) - Direct size control
- `text-{size}` classes (2 frameworks) - Tailwind utilities, Semantic UI size classes

**Font Weight:**
- `fontWeight` / `fw` props (3 frameworks)
- `strong` boolean (1 framework - Ant Design)
- `font-{weight}` classes (2 frameworks)

**Color:**
- `color` / `c` props (4 frameworks) - Theme-aware color selection
- `type` prop (2 frameworks) - Ant Design, MUI (semantic color variants)
- `{color}` classes (1 framework) - Semantic UI

**Text Variants:**
- `variant` prop (1 framework) - MUI with 13 predefined variants
- `type` prop (1 framework) - Ant Design (secondary/success/warning/danger)
- Size classes (1 framework) - Semantic UI (huge/large/medium/small/tiny)

## Pattern Inventory

### Content Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Paragraph text | Block-level text content | 6/6 (100%) | Level 1 (Universal) | All frameworks |
| Headings (h1-h6) | Semantic heading hierarchy | 6/6 (100%) | Level 1 (Universal) | All frameworks |
| Inline text styles | Bold, italic, underline, etc. | 5/6 (83%) | Level 1 (Universal) | Ant, Chakra (via as), Semantic UI (partial), shadcn/ui, MUI (via sx) |
| Code/monospace | Inline code display | 4/6 (67%) | Level 2 (Common) | Ant, Chakra (via as), shadcn/ui, MUI (via sx) |
| Sub-headers | Secondary descriptive text | 2/6 (33%) | Level 4 (Occasional) | Ant, Semantic UI |
| Links in text | Anchor elements | 2/6 (33%) | Level 4 (Occasional) | Ant (Typography.Link), MUI (via component prop) |

### Type Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Display text | Large headlines (h1-h3 size) | 6/6 (100%) | Level 1 (Universal) | All frameworks |
| Body text | Standard paragraph text | 6/6 (100%) | Level 1 (Universal) | All frameworks |
| Caption/small | Small helper text | 6/6 (100%) | Level 1 (Universal) | All frameworks |
| Label text | Form labels, UI labels | 5/6 (83%) | Level 1 (Universal) | All except Semantic UI Header |
| Subtitle text | Secondary headings | 2/6 (33%) | Level 4 (Occasional) | MUI, Ant (via sub header) |
| Lead text | Intro paragraphs | 2/6 (33%) | Level 4 (Occasional) | shadcn/ui, MUI (via variant) |
| Overline text | Category labels | 1/6 (17%) | Level 5 (Rare) | MUI only |

### State Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Muted/secondary | De-emphasized text | 6/6 (100%) | Level 1 (Universal) | All frameworks |
| Disabled | Inactive text state | 3/6 (50%) | Level 3 (Moderate) | Ant, Semantic UI, MUI (via sx) |
| Error/danger | Error messages | 5/6 (83%) | Level 1 (Universal) | Ant, Chakra, Mantine, MUI, Semantic UI (via color) |
| Success | Success messages | 4/6 (67%) | Level 2 (Common) | Ant, Chakra, Mantine, MUI (via sx) |
| Warning | Warning messages | 3/6 (50%) | Level 3 (Moderate) | Ant, Chakra, Mantine |

### Variation Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Font size control | Size variations | 6/6 (100%) | Level 1 (Universal) | All frameworks |
| Font weight control | Weight variations | 6/6 (100%) | Level 1 (Universal) | All frameworks |
| Color variants | Theme colors | 6/6 (100%) | Level 1 (Universal) | All frameworks |
| Text alignment | left/center/right/justify | 6/6 (100%) | Level 1 (Universal) | All frameworks |
| Text truncation | Single-line ellipsis | 5/6 (83%) | Level 1 (Universal) | Ant, Chakra, Mantine, MUI, shadcn/ui (via utility) |
| Line clamping | Multi-line truncation | 4/6 (67%) | Level 2 (Common) | Ant, Chakra, Mantine, MUI (via sx) |
| Copyable text | Click-to-copy | 1/6 (17%) | Level 5 (Rare) | Ant Design only |
| Editable text | Inline editing | 1/6 (17%) | Level 5 (Rare) | Ant Design only |
| Keyboard display | Kbd key styling | 2/6 (33%) | Level 4 (Occasional) | Ant (keyboard prop), Chakra/MUI (via as/component) |
| Gradient text | Gradient color fills | 1/6 (17%) | Level 5 (Rare) | Mantine only |
| Line height control | Leading/spacing | 4/6 (67%) | Level 2 (Common) | Chakra, MUI, shadcn/ui, Mantine (via theme) |
| Letter spacing | Tracking | 4/6 (67%) | Level 2 (Common) | Chakra, MUI, shadcn/ui, Mantine (via style) |
| Text transform | uppercase/lowercase/capitalize | 4/6 (67%) | Level 2 (Common) | Chakra, MUI (via sx), shadcn/ui, Mantine |
| Polymorphic rendering | Custom element via prop | 3/6 (50%) | Level 3 (Moderate) | Chakra (`as`), Mantine (`component`), MUI (`component`) |

## Notable Patterns

### Highly Adopted (Level 1-2)

These patterns represent clear consensus across the ecosystem:

1. **Semantic HTML Foundation** (100%) - All frameworks use proper h1-h6, p, span elements
2. **Typographic Scale** (100%) - Clear font size hierarchy from display to caption text
3. **Font Weight Variations** (100%) - Support for normal, semibold, bold weights
4. **Color Integration** (100%) - Theme-aware colors with muted/secondary variants
5. **Text Alignment** (100%) - Standard left/center/right/justify support
6. **Single-line Truncation** (83%) - Ellipsis for overflow text
7. **Multi-line Clamping** (67%) - Line limiting with ellipsis (via -webkit-line-clamp or similar)
8. **Line Height & Letter Spacing** (67%) - Typographic refinement controls
9. **Text Transforms** (67%) - Case conversion utilities

### Emerging Patterns (Level 3-4)

These patterns show growing adoption and may become standard:

1. **Polymorphic Rendering** (50%) - `as` or `component` prop to change HTML element while keeping styles
2. **Sub-headers/Descriptions** (33%) - Built-in support for secondary descriptive text
3. **Keyboard Display Styling** (33%) - Special styling for keyboard shortcuts
4. **Label Variants** (33%) - Dedicated UI label patterns (button text, overline)
5. **Disabled State** (50%) - Visual disabled appearance for text

### Unique Innovations (Level 5)

Framework-specific features that may indicate future trends:

1. **Comprehensive Interactive Features** (Ant Design)
   - **Copyable**: Async copy, custom MIME types (text/plain, text/html), custom icons/tooltips
   - **Editable**: Inline editing with maxLength, autoSize, custom triggers, lifecycle hooks
   - **Ellipsis**: Bidirectional expand/collapse (v5.16.0+), controlled state, render function symbols

2. **Gradient Text** (Mantine)
   - Native `variant="gradient"` with `gradient={{ from, to, deg }}` configuration
   - Theme integration via `theme.defaultGradient`
   - First-class feature, not a workaround

3. **Inherit Prop** (Mantine)
   - Forces text to adopt parent styles instead of defaults
   - Critical for inline highlighting: `<Title><Text span inherit c="blue">highlight</Text></Title>`
   - Solves common composition problem

4. **Directional Truncation** (Mantine)
   - `truncate="start"` or `truncate="end"`
   - Useful for file paths where beginning matters more

5. **Global Variant Mapping** (MUI)
   - Configure default HTML elements per variant in theme
   - Prevents multiple h1 elements while using h1 visual style
   - SEO and accessibility consideration

6. **Icon/Image Headers** (Semantic UI)
   - First-class icon/image integration with special emphasis modes
   - Circular image variant for avatars
   - `icon header` class for emphasized presentations

7. **Attached Headers** (Semantic UI)
   - Top/middle/bottom attached to connect with segments
   - Creates cohesive card-like layouts
   - Demonstrates layout-aware design

8. **Responsive Fluid Typography** (MUI, shadcn/ui)
   - CSS `clamp()` for viewport-based scaling
   - No JavaScript or media queries needed
   - MUI: h1 scales 2.5rem-3.5em, h2 scales 1.5rem-2.25rem

9. **Text Balance** (shadcn/ui)
   - CSS `text-wrap: balance` for optimal line wrapping
   - Prevents orphan words in headings
   - Modern CSS feature demonstration

10. **Scroll Margin for Anchors** (shadcn/ui)
    - `scroll-m-20` on all headings
    - Prevents content hiding under fixed headers
    - Accessibility and UX consideration

## Sophisticated Design Patterns

Beyond feature presence, certain patterns reveal evidence of deep user testing and non-obvious problem-solving:

### 1. Ant Design's Bidirectional Ellipsis with Render Functions

**What it does:** The `ellipsis` prop supports both `expandable: true` (one-way expand) and `expandable: 'collapsible'` (bidirectional expand/collapse, v5.16.0+). The `symbol` can be a render function that receives the expanded state: `symbol: (expanded) => expanded ? 'Show less' : 'Show more'`.

**Why it's sophisticated:** Most implementations only support one-way expansion—you can show more but not collapse back. The non-obvious insight is that once users expand long content, they often want to hide it again to reduce cognitive load. The render function pattern for symbols is elegant: instead of two separate props (`expandSymbol` and `collapseSymbol`), one function adapts based on state, reducing API surface while increasing power.

**Evidence of design maturity:**
- The `defaultExpanded` and `expanded` props (v5.16.0+) enable both controlled and uncontrolled patterns
- The `onExpand` callback receives `{ expanded: boolean }` for state synchronization
- Async copy operations return Promises, integrating with modern async/await patterns
- The feature evolution (boolean → 'collapsible' string) shows iterative refinement based on real usage

### 2. Mantine's Inherit Prop for Inline Composition

**What it does:** The `inherit` prop forces Text to adopt parent typography styles instead of applying its own defaults. Example: `<Title order={3}><Text span inherit c="blue">highlight</Text> text</Title>` makes the blue text match the title's size and weight.

**Why it's sophisticated:** This solves a non-obvious composition problem. When highlighting text inline within a heading, you want the color to change but the size/weight to match the parent. Without `inherit`, you'd need to manually match font size, weight, line height, etc.—error-prone and breaks when parent styles change. The prop name `inherit` clearly communicates its CSS-like behavior.

**Evidence of design maturity:**
- Pairs with the `span` shorthand prop for clean syntax
- Works with any parent typography component (Title, Text with custom size)
- The `component` prop enables polymorphic rendering while inheriting stays orthogonal
- Documentation explicitly shows the inline highlighting use case, indicating they observed this pattern in user code

### 3. MUI's Global Variant Mapping for Semantic HTML

**What it does:** The `variantMapping` theme configuration lets you set the default HTML element for each Typography variant globally. Example: map all h1-h6 variants to render as `<h2>` elements, preventing multiple `<h1>` tags on the page while still using h1/h2/h3/h4 visual styles freely.

**Why it's sophisticated:** This solves the conflict between visual design (which may want multiple "h1-sized" headings) and semantic HTML/SEO (which should have only one `<h1>` per page). The problem is subtle: designers think in terms of visual hierarchy, but developers must maintain document outline. Most frameworks force choosing between visual consistency and semantic correctness. MUI separates these concerns: `variant` controls appearance, `variantMapping` and `component` control semantics.

**Evidence of design maturity:**
- The separation of `variant` (visual) from `component` (semantic) is architectural sophistication
- Global configuration prevents repetition (`component="h2"` on every usage)
- The feature isn't prominently marketed but solves a real accessibility/SEO problem
- Theme-level configuration enables design system consistency across entire application
- Works seamlessly with the polymorphic `component` prop for per-instance overrides

## Pattern Correlations

### When Polymorphic Rendering exists → Multiple component types avoided
- 3 frameworks with polymorphic rendering avoid separate Text/Heading/Paragraph components
- Pattern: Single flexible component > multiple specialized components

### When Interactive Features exist → Enterprise focus evident
- Ant Design has copyable/editable AND success/warning/danger types
- Correlation: Feature-rich components target enterprise applications

### When Design Tokens exist → Color props use tokens
- All 6 frameworks with theming use token-based colors, not hardcoded values
- Pattern: `color="primary"` or `c="dimmed"` > `color="#FF0000"`

### When Utility-first approach exists → No component API
- shadcn/ui uses pure Tailwind > no props or configuration
- Trade-off: Flexibility and transparency vs abstraction and consistency

### When Dual-component approach exists → Semantic separation
- Mantine (Text/Title), Chakra (Text/Heading) separate inline vs block semantics
- Both use this to provide focused APIs per component type

## Implementation Notes

### Component Architecture Patterns

Frameworks cluster into distinct architectural approaches:

**1. Compositional Sub-components**
- **Ant Design**: Typography.Title, Typography.Text, Typography.Paragraph, Typography.Link
- Benefit: Clear purpose, focused APIs, tree-shakeable
- Trade-off: More imports, larger API surface

**2. Dual-component System**
- **Mantine**: Text (inline/paragraph) + Title (headings with order prop)
- **Chakra UI**: Text (body) + Heading (h1-h6 with as prop)
- Benefit: Semantic clarity, each component optimized for its use case
- Trade-off: Need to know which component to use when

**3. Single Variant-based Component**
- **MUI**: One Typography component with 13 variants
- Benefit: One API to learn, consistent prop surface
- Trade-off: Larger bundle if only using subset of variants

**4. Class-based Styling**
- **Semantic UI**: HTML elements + CSS classes (ui header, ui huge header, etc.)
- Benefit: No JavaScript overhead, pure CSS
- Trade-off: No prop-based configuration, jQuery dependency

**5. Utility Example Collection**
- **shadcn/ui**: Copy-paste Tailwind utility patterns
- Benefit: Full control, no dependencies, transparent
- Trade-off: Manual consistency, verbose classNames

### Prop Naming Conventions

**Verbose vs Terse:**
- Verbose: `fontWeight`, `fontSize`, `textAlign` (Chakra, MUI)
- Terse: `fw`, `fs`, `ta`, `c` (Mantine)
- Middle ground: `size`, `weight`, `align`, `color` (mixed)

**Boolean Modifiers:**
- Ant Design: `strong`, `italic`, `underline`, `delete`, `mark`, `code`, `keyboard`
- Benefit: Clean inline composition, no nesting needed
- Example: `<Text strong italic>Bold italic text</Text>`

**Object Configuration:**
- Ant Design: `copyable={object}`, `editable={object}`, `ellipsis={object}`
- Pattern: Boolean for simple, object for advanced
- Example: `copyable` or `copyable={{ text, icon, tooltips }}`

### Polymorphic Rendering Strategies

**`as` Prop** (Chakra UI):
```tsx
<Text as="b">Bold text</Text>
<Text as="kbd">Ctrl+C</Text>
```

**`component` Prop** (Mantine, MUI):
```tsx
<Text component="a" href="#">Link text</Text>
<Typography component="h2" variant="h1">Visual h1, semantic h2</Typography>
```

**`span` Shorthand** (Mantine):
```tsx
<Text span>Inline text</Text>  // Shorthand for component="span"
```

### Interactive Feature Patterns

**Copyable** (Ant Design only):
- Basic: `copyable={true}`
- Custom text: `copyable={{ text: 'different content' }}`
- Async: `copyable={{ text: () => Promise.resolve('async') }}`
- MIME types: `copyable={{ format: 'text/html' }}`

**Editable** (Ant Design only):
- Basic: `editable={{ onChange: handleChange }}`
- Controlled: `editable={{ editing, onStart, onEnd, onChange }}`
- Constraints: `editable={{ maxLength: 100, autoSize: { minRows, maxRows } }}`
- Triggers: `editable={{ triggerType: ['icon', 'text'] }}`

**Ellipsis** (Multiple frameworks, varying sophistication):
- Ant: Expandable, collapsible, tooltip, suffix, render function symbols
- Chakra v2: `isTruncated`, `noOfLines={n}`
- Chakra v3: `truncate`, `lineClamp={n}`
- Mantine: `truncate="end"` or `truncate="start"`, `lineClamp={n}`
- MUI: `noWrap` (single-line)

## Framework-Specific Highlights

### Ant Design
- **Approach**: Compositional sub-components with enterprise features
- **Unique**: Copyable, editable, bidirectional ellipsis, keyboard prop
- **Philosophy**: Feature-complete, developer productivity, enterprise-ready

### Chakra UI
- **Approach**: Primitive components with comprehensive style props
- **Unique**: Polymorphic `as` prop, color opacity syntax (`red.300/40`), colorPalette virtual colors
- **Philosophy**: Composable primitives, responsive-first, runtime theming

### Mantine
- **Approach**: Dual-component with prop shorthands and theme integration
- **Unique**: Gradient text, inherit prop, directional truncation, order vs size separation (Title)
- **Philosophy**: Clean API, developer experience, theme-first

### MUI
- **Approach**: Single component with Material Design variant system
- **Unique**: 13 predefined variants, global variant mapping, fluid typography with clamp()
- **Philosophy**: Material Design compliance, accessibility, comprehensive theming

### Semantic UI
- **Approach**: Class-based jQuery framework with semantic HTML
- **Unique**: Dual header system (page vs content, rem vs em), attached headers, icon emphasis, inverted colors
- **Philosophy**: Semantic naming, layout-aware, composition via classes

### shadcn/ui
- **Approach**: Copy-paste utility examples, not components
- **Unique**: Text balance, scroll margins for anchors, arbitrary Tailwind variants, design tokens
- **Philosophy**: Transparency, full control, Tailwind mastery, copy > install

## Key Takeaways

### Universal Requirements
Every framework provides:
1. Semantic HTML elements (h1-h6, p, span)
2. Typographic scale (display → body → caption)
3. Font size and weight control
4. Color integration with design system
5. Text alignment options

### Differentiation Points
Frameworks distinguish themselves through:
1. **Architecture**: Sub-components vs dual-component vs single-component vs classes vs utilities
2. **Interactive Features**: Ant Design unique with copyable/editable
3. **Prop Philosophy**: Verbose vs terse naming
4. **Polymorphism**: `as` vs `component` prop vs no polymorphism
5. **Specialized Features**: Gradient text, inherit prop, variant mapping
6. **Framework Type**: React component vs jQuery classes vs utility examples

### Design Decisions for New Implementations

When building a typography system, critical decisions include:

1. **Architecture**: Single component, dual-component, or compositional sub-components?
2. **Naming**: Verbose (`fontWeight`) or terse (`fw`) props?
3. **Polymorphism**: Support `as` or `component` prop for HTML flexibility?
4. **Interactive**: Include copyable/editable or keep purely presentational?
5. **Truncation**: Single-line only, or multi-line clamping too?
6. **Advanced Typography**: Line height, letter spacing, text transform as props or CSS-only?
7. **Design Tokens**: Color names (`primary`) or direct values (`#FF0000`)?
8. **Special Features**: Gradient text? Inherit prop? Keyboard styling?
9. **Semantic HTML**: Enforce proper h1-h6 usage or allow flexibility?
10. **Theme Integration**: Deep theme coupling or standalone component?

The research shows three viable philosophical approaches:

**Enterprise Feature-Rich** (Ant Design model):
- Compositional sub-components
- Interactive features (copy, edit)
- Comprehensive prop APIs
- Target: Large applications, enterprise users

**Flexible Primitives** (Chakra/Mantine model):
- Style props without opinions
- Polymorphic rendering
- Developer composes features
- Target: Diverse use cases, full control

**Utility-First** (shadcn/ui model):
- No component abstraction
- Pure Tailwind CSS
- Copy-paste patterns
- Target: Tailwind users, transparency seekers

No single approach is "correct"—successful frameworks make different trade-offs based on their philosophy and target users.

## Raw Data

Individual framework reports available at:
- `ai/research/typography/ant-design/usage-patterns.md`
- `ai/research/typography/chakra-ui/usage-patterns.md`
- `ai/research/typography/mantine/usage-patterns.md`
- `ai/research/typography/mui/usage-patterns.md`
- `ai/research/typography/semantic-ui/usage-patterns.md`
- `ai/research/typography/shadcn-ui/usage-patterns.md`

# Component Pattern Research: Grid

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 9 (includes Chakra UI with both Grid and SimpleGrid)
- Date: 2025-11-05
- Unique patterns identified: 45+
- Research coverage: Ant Design, Chakra UI (Grid + SimpleGrid), Mantine, MUI (Grid v1 + Grid v2), Nuxt UI, PrimeFlex, Semantic UI Classic, Vuetify

## Component Definition Consensus

Grid systems across frameworks solve the fundamental problem of **responsive two-dimensional layout organization**. They provide structured ways to arrange content in rows and columns with:

- **Consistent spacing** through gutter/gap systems
- **Responsive behavior** adapting to viewport or container size
- **Predictable proportions** through column-based sizing
- **Flexible alignment** for both horizontal and vertical positioning

**Mental Models:**
- **Container/Item Hierarchy**: Most frameworks use a two-level system (container → items or row → columns)
- **Column Units**: Content spans a fixed number of units (12, 16, or 24) or uses flexible/auto sizing
- **Automatic Wrapping**: Columns exceeding the maximum wrap to new rows automatically

## Terminology Variations

### Component Names
- **Grid System**: "Grid" (8 frameworks), "SimpleGrid" (Chakra), "PageGrid" (Nuxt)
- **Container**: "Grid" (most), "Row" (Ant Design, Semantic UI), "Container" (Vuetify, MUI)
- **Item/Column**: "Col" (Ant, Mantine, Vuetify, MUI), "GridItem" (Chakra), "Column" (Semantic UI), children (SimpleGrid, Nuxt, PrimeFlex)

### Implementation Approach
- **CSS Grid**: Chakra Grid, MUI Grid v2
- **Flexbox**: Ant Design, Mantine, MUI Grid v1, Semantic UI, Vuetify, PrimeFlex
- **CSS Utility Classes**: PrimeFlex (CSS-only), Semantic UI (CSS classes), Nuxt UI (Tailwind)
- **Component Props**: Ant, Chakra, Mantine, MUI, Vuetify (Vue/React components)

### Column Count Systems
- **12-column**: MUI, Mantine, Vuetify, PrimeFlex (7/9 = 78%)
- **16-column**: Semantic UI Classic (1/9 = 11%)
- **24-column**: Ant Design (1/9 = 11%)
- **Variable**: Mantine allows custom column counts

### Spacing Terminology
- **Gutter**: Ant Design, Mantine, Vuetify, PrimeFlex
- **Gap**: Chakra, MUI, Mantine, Nuxt UI
- **Spacing**: MUI, Mantine, Vuetify

## Pattern Inventory

### Layout Foundation Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Row/Column system | Container and item/column hierarchy | 9/9 (100%) | Level 1 | All |
| Flexbox based | Uses CSS flexbox for layout | 7/9 (78%) | Level 1 | Ant, Mantine, MUI v1, PrimeFlex, Semantic, Vuetify, Nuxt* |
| CSS Grid based | Uses CSS Grid Layout | 3/9 (33%) | Level 3 | Chakra Grid, MUI v2, Nuxt UI |
| 12-column system | Default 12-column grid | 7/9 (78%) | Level 1 | Chakra*, Mantine, MUI, Nuxt*, PrimeFlex, Semantic*, Vuetify |
| 16-column system | 16-column grid (more granular) | 1/9 (11%) | Level 5 | Semantic UI |
| 24-column system | 24-column grid (finest granularity) | 1/9 (11%) | Level 5 | Ant Design |
| Automatic wrapping | Columns wrap when exceeding max | 9/9 (100%) | Level 1 | All |
| Container wrapper | Dedicated container component | 5/9 (56%) | Level 2 | Ant (Row), MUI, Semantic, Vuetify, Nuxt |
| Nested grids | Grids within grid items/columns | 9/9 (100%) | Level 1 | All |

*Note: Chakra supports custom columns via templateColumns, Nuxt uses Tailwind (12-col default), Semantic uses 16-col

### Responsive Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Breakpoint support | Named responsive breakpoints | 9/9 (100%) | Level 1 | All |
| Responsive sizing props | Props/classes per breakpoint | 9/9 (100%) | Level 1 | All |
| Mobile-first approach | Base styles for mobile, override up | 8/9 (89%) | Level 1 | All except Semantic (has mobile-specific) |
| Responsive gutter/gap | Spacing varies by breakpoint | 8/9 (89%) | Level 1 | All except Nuxt* |
| Auto-responsive columns | Automatically adjusts column count | 3/9 (33%) | Level 3 | Chakra SimpleGrid, Nuxt UI, PrimeFlex (via minChildWidth/auto-fit) |
| Stackable/collapse | Columns stack on mobile | 7/9 (78%) | Level 1 | Ant, Chakra, Mantine, MUI, Vuetify, Semantic, Nuxt (all via responsive props) |
| Device-specific visibility | Show/hide at breakpoints | 5/9 (56%) | Level 2 | Ant (span=0), Semantic (.only), others (responsive hiding) |
| Container queries | Respond to container vs viewport | 1/9 (11%) | Level 5 | Mantine |

*Note: Nuxt UI uses fixed gap-8, customizable via theme

### Spacing Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Gutter/gap control | Control spacing between columns | 9/9 (100%) | Level 1 | All |
| Horizontal spacing | Control column gaps separately | 6/9 (67%) | Level 2 | Ant, Chakra, MUI v2, Mantine, PrimeFlex, Vuetify |
| Vertical spacing | Control row gaps separately | 6/9 (67%) | Level 2 | Ant, Chakra, MUI v2, Mantine, PrimeFlex, Vuetify |
| No gutter option | Remove all spacing | 7/9 (78%) | Level 1 | Ant (gutter=0), Chakra (gap=0), Mantine (gutter=0), MUI (spacing=0), PrimeFlex (.grid-nogutter), Semantic (.grid.nogutter), Vuetify (no-gutters) |
| Responsive spacing | Spacing varies by breakpoint | 8/9 (89%) | Level 1 | All except Nuxt* |
| Dense spacing | Reduced spacing variant | 2/9 (22%) | Level 4 | Vuetify (dense), MUI (spacing={1}) |
| Relaxed spacing | Increased spacing variant | 1/9 (11%) | Level 5 | Semantic UI (.relaxed, .very.relaxed) |
| Padded variant | Preserve edge gutters | 1/9 (11%) | Level 5 | Semantic UI (.padded) |
| Theme-based spacing | Spacing uses design tokens | 6/9 (67%) | Level 2 | Chakra, Mantine, MUI, Vuetify, PrimeFlex, Nuxt |

*Nuxt UI has fixed gap-8, customizable via theme config

### Alignment Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Horizontal alignment | justify-content control | 9/9 (100%) | Level 1 | All |
| Vertical alignment | align-items control | 9/9 (100%) | Level 1 | All |
| Content alignment | align-content for multi-row | 5/9 (56%) | Level 2 | Chakra, MUI, PrimeFlex, Semantic, Vuetify |
| Self alignment | Individual item alignment | 5/9 (56%) | Level 2 | Chakra, MUI, PrimeFlex, Semantic, Vuetify |
| Responsive alignment | Alignment varies by breakpoint | 6/9 (67%) | Level 2 | Ant, Chakra, Mantine, MUI, PrimeFlex, Vuetify |
| Centered helper | Shortcut for centering content | 4/9 (44%) | Level 3 | Chakra (center), Semantic (.centered), MUI (justify/align), Vuetify (align/justify) |
| Floated positioning | Float items left/right | 1/9 (11%) | Level 5 | Semantic UI (.left.floated, .right.floated) |
| Stretch rows | Items fill row height | 3/9 (33%) | Level 3 | Chakra (stretch), Semantic (.stretched), Vuetify (default) |

### Sizing Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Fixed column spans | Specific column width (1-12/16/24) | 9/9 (100%) | Level 1 | All |
| Responsive spans | Different spans per breakpoint | 9/9 (100%) | Level 1 | All |
| Auto-width columns | Content-based sizing | 8/9 (89%) | Level 1 | All except Nuxt* |
| Flex grow/auto | Fill available space | 7/9 (78%) | Level 1 | Ant (flex), Chakra (auto), Mantine (auto), MUI (xs=true/auto), Semantic (.equal.width), PrimeFlex (.col), Vuetify (no cols) |
| Offset columns | Left margin/gap for positioning | 7/9 (78%) | Level 1 | Ant, Chakra, Mantine, MUI v2, PrimeFlex, Semantic, Vuetify |
| Equal width | All columns same width | 5/9 (56%) | Level 2 | Chakra SimpleGrid, Mantine (span=auto), MUI (xs), Semantic (.equal.width), Vuetify (no cols) |
| Min child width | Auto-fit with minimum width | 2/9 (22%) | Level 4 | Chakra SimpleGrid, PrimeFlex (via CSS) |
| Content-fit | Size to content width | 2/9 (22%) | Level 4 | Mantine (span="content"), Chakra (fit-content) |
| Custom column count | Change from default (12/16/24) | 2/9 (22%) | Level 4 | Mantine (columns prop), Chakra (templateColumns) |

*Nuxt uses Tailwind col-span utilities on children

### Advanced Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Column ordering | Change visual order | 7/9 (78%) | Level 1 | Ant (order/push/pull), Chakra (order), Mantine (order), MUI (order - v2 only), PrimeFlex (flex-order), Semantic (order), Vuetify (order) |
| Responsive ordering | Order changes by breakpoint | 6/9 (67%) | Level 2 | Ant, Chakra, Mantine, MUI v2, PrimeFlex, Vuetify |
| Column spanning (CSS Grid) | Span multiple columns | 2/9 (22%) | Level 4 | Chakra Grid (colSpan), Nuxt UI (col-span on children) |
| Row spanning (CSS Grid) | Span multiple rows | 2/9 (22%) | Level 4 | Chakra Grid (rowSpan), Nuxt UI (row-span on children) |
| Grid template areas | Named grid regions | 1/9 (11%) | Level 5 | Chakra Grid |
| Explicit positioning | Grid line placement | 1/9 (11%) | Level 5 | Chakra Grid (colStart/colEnd/rowStart/rowEnd) |
| Auto-flow control | Grid auto-placement | 1/9 (11%) | Level 5 | Chakra Grid (autoFlow/autoRows/autoColumns) |
| Grow behavior | Force columns to expand | 1/9 (11%) | Level 5 | Mantine (grow prop) |
| Wrap control | Enable/disable wrapping | 2/9 (22%) | Level 4 | Ant (wrap prop), MUI (wrap prop) |
| Direction control | Row/column direction | 3/9 (33%) | Level 3 | Chakra (direction), MUI (direction), PrimeFlex (flex-direction) |
| Visual decoration | Borders/dividers between items | 2/9 (22%) | Level 4 | Semantic (.celled, .divided, .vertically.divided) |
| Color variations | Colored rows/columns | 1/9 (11%) | Level 5 | Semantic UI (13 named colors) |
| Fluid container | Full-width container | 3/9 (33%) | Level 3 | MUI (no maxWidth), Vuetify (fluid), Semantic (default) |
| Fill height | Stretch to viewport height | 1/9 (11%) | Level 5 | Vuetify (fill-height) |
| Programmatic breakpoints | Access breakpoint in code | 2/9 (22%) | Level 4 | Ant (useBreakpoint), Vuetify ($vuetify.breakpoint) |
| Bento-style layouts | Asymmetric card grids | 1/9 (11%) | Level 5 | Nuxt UI (via col-span utilities) |

## Notable Patterns

### Highly Adopted (Level 1-2)

**Universal Patterns (100% adoption):**
- **Row/Column Hierarchy**: All frameworks use a container → item structure
- **Breakpoint System**: Responsive behavior is fundamental to all grid systems
- **Fixed Column Spans**: Percentage-based column widths (1-12, 1-16, or 1-24)
- **Horizontal/Vertical Alignment**: Flexbox/Grid alignment controls
- **Nested Grids**: All support grid subdivision for complex layouts
- **Gutter/Gap Control**: Spacing between columns is configurable in all

**Nearly Universal (78-89%):**
- **Flexbox Foundation**: Most frameworks build on flexbox (78%)
- **12-Column System**: Industry standard column count (78%)
- **Mobile-First Responsive**: Base styles for mobile, override upward (89%)
- **Responsive Spacing**: Gutter/gap varies by breakpoint (89%)
- **Auto-Width Columns**: Content-based or flex-grow sizing (89%)
- **Column Offsets**: Left margin/gap for positioning (78%)
- **Column Ordering**: Visual reordering via order prop/class (78%)

### Emerging Patterns (Level 3-4)

**Moderate Adoption (33-67%):**
- **CSS Grid Based**: Modern implementations use CSS Grid (33%)
- **Auto-Responsive Columns**: Columns adjust count automatically (33%)
- **Horizontal/Vertical Spacing**: Separate X/Y gap control (67%)
- **Content Alignment**: align-content for wrapped rows (56%)
- **Theme-Based Spacing**: Design token integration (67%)
- **Responsive Alignment**: Alignment varies by breakpoint (67%)
- **Equal Width Columns**: Automatic even distribution (56%)
- **Direction Control**: Row/column flex direction (33%)

**Occasional Patterns (22-39%):**
- **Min Child Width**: Auto-fit with minimum (22%)
- **Content-Fit Sizing**: Size to content width (22%)
- **Custom Column Count**: Configurable beyond default (22%)
- **Column/Row Spanning**: CSS Grid span features (22%)
- **Dense Spacing**: Reduced spacing variant (22%)
- **Responsive Ordering**: Order changes by breakpoint (67% - borders on Level 2)
- **Wrap Control**: Disable automatic wrapping (22%)
- **Visual Decoration**: Borders/dividers (22%)
- **Programmatic Breakpoints**: JS access to breakpoints (22%)

### Unique Innovations (Level 5)

**Rare But Innovative (11%):**

**Ant Design:**
- **24-Column System**: Finer granularity than standard 12-column (unique)
- **Flex Prop Versatility**: Accepts CSS flex shorthand strings or numbers (unique approach)
- **useBreakpoint Hook**: React hook for programmatic breakpoint access

**Chakra UI:**
- **Grid Template Areas**: Named region layout (CSS Grid native feature)
- **Explicit Positioning**: Grid line control (colStart/colEnd)
- **Auto-Flow Control**: Grid auto-placement behavior
- **SimpleGrid Component**: Simplified equal-column wrapper (unique API)

**Semantic UI:**
- **16-Column System**: Alternative to 12-column standard (unique)
- **Stackable Innovation**: Simple class handles mobile stacking
- **Doubling Pattern**: Automatic column doubling at smaller breakpoints
- **Visual Decorations**: .celled, .divided, .internally.celled (unique)
- **Color Variations**: 13 named color options for rows/columns
- **Relaxed Spacing**: .relaxed and .very.relaxed modifiers
- **Padded Variant**: Preserve edge gutters (.padded)
- **Floated Positioning**: .left.floated, .right.floated classes

**Mantine:**
- **Container Queries**: Respond to container width vs viewport (cutting-edge)
- **Content Span**: span="content" for fit-content sizing (unique)
- **Grow Behavior**: Force all columns to expand (grow prop)
- **Custom Column Count**: Configurable via columns prop

**Vuetify:**
- **Fill Height**: Container stretches to viewport height
- **Programmatic Breakpoints**: $vuetify.breakpoint for conditional rendering

**Nuxt UI:**
- **Bento-Style Support**: Asymmetric card grids via col-span utilities
- **Minimal API**: Only one prop (as) - composition over configuration

**PrimeFlex:**
- **CSS Utility Approach**: Pure CSS library, not components (unique in this set)
- **Negative Margins**: Explicit support with dash prefix

**MUI:**
- **Dual Implementation**: Both Grid v1 (flexbox) and Grid v2 (CSS Grid)
- **Container/Item Pattern**: Explicit container and item boolean props

## Pattern Correlations

**When Flexbox-based → Likely has:**
- 12-column system (6/7 = 86%)
- Offset support (6/7 = 86%)
- Column ordering (6/7 = 86%)
- Auto-width columns (7/7 = 100%)
- No row/column spanning (5/7 = 71%)

**When CSS Grid-based → Likely has:**
- Column/row spanning (2/3 = 67%)
- Template areas support (1/3 = 33%)
- Explicit positioning (1/3 = 33%)
- Auto-flow control (1/3 = 33%)

**When Component-based (React/Vue) → Likely has:**
- Props for all configuration (8/8 = 100%)
- Responsive object notation (8/8 = 100%)
- Theme integration (6/8 = 75%)
- Programmatic breakpoint access (2/8 = 25%)

**When CSS Class-based → Likely has:**
- Responsive class prefixes (3/3 = 100%)
- Utility-first approach (2/3 = 67%)
- Explicit row elements required (2/3 = 67%)

**When Auto-responsive (minChildWidth) → Excludes:**
- Fixed column span requirements (3/3 = 100%)
- Explicit responsive props unnecessary (3/3 = 100%)

**When Offset support → Likely has:**
- Column ordering (6/7 = 86%)
- Responsive sizing (7/7 = 100%)
- 12-column or similar system (7/7 = 100%)

## Implementation Notes

### Column Count Systems

**12-Column Dominance:**
The 12-column system has become the de facto standard (78% adoption) because:
- Divisible by 2, 3, 4, 6 (common layout proportions)
- Bootstrap popularized this approach
- Aligns with Material Design specifications
- Frameworks: Mantine, MUI, Vuetify, PrimeFlex, Chakra (default), Nuxt (via Tailwind)

**Alternative Systems:**
- **24-column** (Ant Design): Offers finer granularity, divisible by 2, 3, 4, 6, 8, 12
- **16-column** (Semantic UI): Divisible by 2, 4, 8 - different from mainstream
- **Custom** (Mantine, Chakra): Allow developers to choose column count

### Flexbox vs CSS Grid

**Flexbox-based (78%):**
- **Pros**: Excellent browser support, familiar mental model, simpler for 1D layouts
- **Cons**: Row/column spanning requires complex calculations, no template areas
- **Best for**: Traditional responsive layouts, cards, simple grids

**CSS Grid-based (33%):**
- **Pros**: Native 2D layout, spanning, template areas, explicit positioning
- **Cons**: More complex API, newer browser requirements
- **Best for**: Complex asymmetric layouts, dashboards, bento-style grids

**Hybrid Approach:**
MUI offers both Grid v1 (flexbox) and Grid v2 (CSS Grid), acknowledging trade-offs.

### Responsive Strategies

**Mobile-First (89%):**
- Base styles apply to smallest screens
- Larger breakpoints override via min-width media queries
- Easier to progressively enhance

**Explicit Breakpoints:**
- Each breakpoint gets dedicated prop/class
- Clear which styles apply at which size
- More verbose but explicit

**Auto-Responsive (33%):**
- Single prop determines behavior (e.g., minChildWidth)
- Automatic column count adjustment
- Less control but simpler API

### Spacing Approaches

**Fixed Scale (67%):**
- Theme-based spacing tokens (xs, sm, md, lg, xl)
- Consistent across application
- Easier to maintain design system

**Arbitrary Values:**
- Accept pixel/rem values directly
- Maximum flexibility
- Risk of inconsistency

**Responsive Spacing (89%):**
- Nearly universal pattern
- Spacing adapts to screen size
- Maintains visual hierarchy across devices

### Component vs Utility Patterns

**Component-Based (6/9 = 67%):**
- Props control all behavior
- Type-safe in TypeScript
- Framework-specific
- Examples: Ant, Chakra, Mantine, MUI, Vuetify

**Utility-Based (3/9 = 33%):**
- CSS classes for styling
- Framework-agnostic CSS
- More verbose HTML/JSX
- Examples: PrimeFlex, Semantic UI, Nuxt UI (Tailwind)

**Hybrid Approach:**
Some frameworks (Semantic) offer both component and utility approaches.

### Naming Conventions

**Prop/Class Names:**
- **Span**: Ant (span), Mantine (span), MUI (xs/sm/md/lg/xl), Vuetify (cols), Chakra (colSpan)
- **Gutter**: Ant (gutter), Mantine (gutter), Vuetify (no-gutters), Semantic (nogutter)
- **Gap**: Chakra (gap), MUI (spacing), PrimeFlex (gap-N), Nuxt (gap-8)
- **Offset**: Ant (offset), Mantine (offset), MUI (xsOffset), Vuetify (offset), PrimeFlex (col-offset)

**Alignment Terms:**
- **justify**: Horizontal alignment (start, center, end, space-between, etc.)
- **align**: Vertical alignment (start, center, end, stretch, baseline)
- **Place**: Shorthand for both (Chakra placeContent, placeItems)

### Breakpoint Standards

**Common Breakpoint Names:**
- **xs**: <600px (MUI, Vuetify), <576px (Ant), <480px (Chakra)
- **sm**: 600px+ (MUI, Vuetify), 576px+ (Ant), 480px+ (Chakra), 640px+ (Tailwind/Nuxt)
- **md**: 768px+ (most), 960px+ (Vuetify), 900px+ (MUI)
- **lg**: 992px+ (Ant), 1024px+ (Chakra, Tailwind), 1200px+ (MUI), 1264px+ (Vuetify)
- **xl**: 1200px+ (Ant), 1280px+ (Chakra), 1536px+ (MUI, Tailwind), 1904px+ (Vuetify)

**Variation**: No universal standard, frameworks use similar but not identical breakpoints.

### Accessibility Considerations

**Visual Reordering:**
- Order prop changes visual position, not DOM order
- Screen readers follow DOM order
- Consider accessibility implications when reordering

**Responsive Visibility:**
- span={0} (Ant), display utilities (others)
- Ensure content isn't hidden from screen readers inappropriately

**Semantic HTML:**
- Most grids render as <div> elements
- Not inherently semantic
- Developers should add appropriate semantic elements inside grid items

## Migration Considerations

**Bootstrap → Modern Framework:**
- Familiar 12-column system in most frameworks
- .container → Container component or <div className="grid">
- .row → Row component or wrapper
- .col-* → Column component with span prop or .col-* class

**From CSS Grid → Framework Grid:**
- Chakra Grid, MUI v2 closest to native CSS Grid
- Template areas only in Chakra
- Most frameworks use flexbox instead

**From Flexbox → CSS Grid Framework:**
- Spanning features not available in flexbox-based grids
- Need to change mental model for 2D layouts

**Cross-Framework:**
- API differs significantly between frameworks
- Breakpoint values not standardized
- Spacing scales vary (theme-dependent)
- Component vs utility approach differs

## Future Trends

**Container Queries (1/9 currently):**
- Mantine already supports
- Modern CSS feature gaining traction
- More modular, component-centric responsive design

**CSS Grid Adoption:**
- 33% currently using CSS Grid
- Flexbox still dominant for grid systems
- Hybrid approaches emerging (MUI)

**Auto-Responsive Patterns:**
- minChildWidth pattern (Chakra SimpleGrid)
- Reduces need for explicit breakpoints
- Simpler API for common use cases

**Design Token Integration:**
- 67% already integrate with theme systems
- Consistent spacing scales
- Better design system adherence

## Raw Data References

Individual framework research reports available at:
- `ai/research/grid/ant-design/usage-patterns.md`
- `ai/research/grid/chakra-ui-grid/usage-patterns.md`
- `ai/research/grid/chakra-ui-simplegrid/usage-patterns.md`
- `ai/research/grid/mantine/usage-patterns.md`
- `ai/research/grid/mui/usage-patterns.md`
- `ai/research/grid/nuxt-ui/usage-patterns.md`
- `ai/research/grid/primereact/usage-patterns.md` (PrimeFlex CSS library)
- `ai/research/grid/semantic-ui-classic/usage-patterns.md`
- `ai/research/grid/vuetify/usage-patterns.md`

## Research Methodology

All research conducted on 2025-11-05 through:
1. Direct documentation access via WebFetch where available
2. Web search for supplementary information
3. Community resources (Stack Overflow, tutorials) when needed
4. Cross-verification across multiple sources
5. Code example extraction from official documentation

Frameworks surveyed represent major players across React, Vue, and CSS utility ecosystems, providing comprehensive cross-framework pattern analysis.

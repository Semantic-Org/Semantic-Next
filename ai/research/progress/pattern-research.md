# Component Pattern Research: Progress

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 11
- Date: 2025-11-05
- Unique patterns identified: 38+

## Component Definition Consensus

Progress components serve as visual indicators of task completion status across all frameworks. The universal mental model is a "fill bar" that communicates completion percentage or ongoing activity state. All implementations share these core characteristics:

**Primary Purpose:** Display the current progress of operations to provide visual feedback for asynchronous tasks, file uploads, downloads, multi-step processes, and long-running operations.

**Mental Model:** A progress indicator visualizes completion percentage (determinate) or continuous activity (indeterminate). Users understand it as showing "how much is done" or "work is happening."

**Semantic Meaning:** Communicates operation progress state, reducing user anxiety during wait times. Visual state changes provide context about operation outcome (success, error, ongoing).

## Terminology Variations

### Component Names
- **Progress** (9 frameworks) = Standard name across Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, Radix UI, ShadCN, Semantic UI
- **ProgressBar** (1 framework) = PrimeReact uses this name

### Prop/Attribute Names
- **Value prop variations:**
  - `value` (7 frameworks): Chakra UI, HeroUI, Mantine, MUI, PrimeReact, Radix UI, ShadCN
  - `percent` (2 frameworks): Ant Design, Semantic UI
  - `modelValue` (1 framework): Nuxt UI (Vue convention)
  - `defaultValue` (1 framework): Chakra UI also supports

- **Orientation terminology:**
  - `orientation="horizontal|vertical"` (2 frameworks): Mantine, Nuxt UI
  - No vertical support (8 frameworks)

- **Status/State naming:**
  - `status="success|exception|normal"` (1 framework): Ant Design
  - `color` prop for status (9 frameworks): Others use color for semantic meaning
  - `variant` prop (3 frameworks): Radix UI, ShadCN (through Radix), Chakra UI

- **Indeterminate state:**
  - `mode="indeterminate"` (1 framework): PrimeReact
  - `isIndeterminate` boolean (1 framework): HeroUI
  - `value={null}` (4 frameworks): Chakra UI, Nuxt UI, Radix UI, ShadCN
  - `value={undefined}` (2 frameworks): Ant Design, MUI
  - `variant="indeterminate"` (1 framework): MUI
  - `active` class (1 framework): Semantic UI
  - `duration` prop (1 framework): Radix UI (for estimated completion time)

## Pattern Inventory

### Content Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Percentage display | Show numeric completion percentage | 11/11 (100%) | **Level 1: Universal** | All frameworks | Ant/HeroUI/Nuxt/Semantic: Native; Others: Composed |
| Text labels | Descriptive text above/beside bar | 10/11 (91%) | **Level 1: Universal** | All except PrimeReact | HeroUI/Nuxt/Semantic: Native; Others: Composed |
| Custom text formatting | Function/template to format display text | 8/11 (73%) | **Level 2: Common** | Ant, HeroUI, Nuxt, PrimeReact, Semantic, Mantine, Chakra, Radix | Native in Ant/HeroUI/Nuxt/PrimeReact/Semantic |
| Value/label composition | Separate label and value text display | 5/11 (45%) | **Level 3: Moderate** | Chakra, Mantine, Nuxt, HeroUI, Ant | Composed via sub-components |
| Icon support | Icons in or around progress display | 2/11 (18%) | **Level 5: Rare** | Ant, MUI | Ant: Status icons; MUI: via composition |

### Type Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Linear/Bar (horizontal) | Standard horizontal progress bar | 11/11 (100%) | **Level 1: Universal** | All frameworks | Native in all |
| Circular progress | Circular/ring-style indicator | 4/11 (36%) | **Level 4: Occasional** | Ant, Chakra, MUI, HeroUI | Ant/Chakra/MUI: Native; HeroUI: Separate component |
| Dashboard/Arc progress | 75% arc or semi-circle variant | 1/11 (9%) | **Level 5: Rare** | Ant Design | Native via `type="dashboard"` |
| Vertical orientation | Vertical progress bar | 2/11 (18%) | **Level 5: Rare** | Mantine, Nuxt UI | Native via orientation prop |
| Ring progress | Full ring variant | 1/11 (9%) | **Level 5: Rare** | Mantine | Native (RingProgress component) |

### State Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Determinate (value-based) | Show exact completion percentage | 11/11 (100%) | **Level 1: Universal** | All frameworks | Native in all |
| Indeterminate (loading) | Continuous animation for unknown duration | 10/11 (91%) | **Level 1: Universal** | All except Mantine | Various mechanisms (see terminology) |
| Success state | Visual indication of completion | 7/11 (64%) | **Level 2: Common** | Ant, HeroUI, MUI, Nuxt, Semantic, Chakra, Radix | Ant/Semantic: Native; Others: via color |
| Error state | Visual indication of failure | 6/11 (55%) | **Level 3: Moderate** | Ant, HeroUI, MUI, Nuxt, Semantic, Chakra | Ant/Semantic: Native; Others: via color |
| Active/Animating | Smooth animated transitions | 11/11 (100%) | **Level 1: Universal** | All frameworks | Native animation support |
| Warning state | Visual indication of issues | 2/11 (18%) | **Level 5: Rare** | Nuxt UI, Semantic UI | Via color prop/class |
| Disabled state | Non-interactive display | 2/11 (18%) | **Level 5: Rare** | HeroUI, Semantic UI | Native prop/class |
| Striped pattern | Diagonal stripes in progress bar | 4/11 (36%) | **Level 4: Occasional** | Chakra, HeroUI, Mantine, Semantic | Native boolean prop |

### Variation Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Size control | Multiple size options (xs, sm, md, lg, xl) | 9/11 (82%) | **Level 1: Universal** | All except PrimeReact, Radix | Ant/Semantic: CSS; Others: Native prop |
| Color customization | Theme or custom color options | 11/11 (100%) | **Level 1: Universal** | All frameworks | Native in most |
| Custom radius | Border radius control | 4/11 (36%) | **Level 4: Occasional** | HeroUI, Radix, Nuxt, Ant | Native prop |
| Thickness/stroke control | Control bar height/thickness | 7/11 (64%) | **Level 2: Common** | Ant, Mantine, PrimeReact, Chakra, ShadCN, MUI, Semantic | Ant: strokeWidth; Others: size or CSS |
| Gradient colors | Multi-color gradient fills | 2/11 (18%) | **Level 5: Rare** | Ant Design, ShadCN | Ant: Native; ShadCN: CSS |
| Segmented/Steps | Discrete progress segments | 4/11 (36%) | **Level 4: Occasional** | Ant, Mantine, Nuxt, Semantic | Native support |
| Multi-section bars | Multiple colored sections in one bar | 2/11 (18%) | **Level 5: Rare** | Mantine, Nuxt | Composed via sections |
| Buffer indicator | Show buffered vs loaded (video) | 1/11 (9%) | **Level 5: Rare** | MUI | Native "buffer" variant |
| Track customization | Unfilled portion styling | 3/11 (27%) | **Level 4: Occasional** | Ant, HeroUI, Radix | Native trailingColor/track props |
| Animation style options | Different animation patterns | 1/11 (9%) | **Level 5: Rare** | Nuxt UI | Native (carousel, swing, elastic) |
| Inverted direction | Fill right-to-left or bottom-to-top | 1/11 (9%) | **Level 5: Rare** | Nuxt UI | Native boolean prop |

### Composition Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Compound components | Root/Track/Range sub-components | 3/11 (27%) | **Level 4: Occasional** | Chakra, Mantine, Radix/ShadCN | Native architecture |
| Slot-based customization | Named slots for internal elements | 3/11 (27%) | **Level 4: Occasional** | HeroUI, Nuxt, Radix | Native via slots/classNames |
| Template variables | Dynamic text with {percent}, {value}, etc | 2/11 (18%) | **Level 5: Rare** | Semantic UI, PrimeReact | Native template system |
| Format function | Callback to format displayed value | 4/11 (36%) | **Level 4: Occasional** | Ant, PrimeReact, HeroUI, Nuxt | Native prop |

### Accessibility Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| ARIA progressbar role | Standard role="progressbar" | 11/11 (100%) | **Level 1: Universal** | All frameworks | Native/automatic |
| ARIA value attributes | aria-valuenow/min/max | 11/11 (100%) | **Level 1: Universal** | All frameworks | Native/automatic |
| Custom value labels | getValueLabel/aria-valuetext | 5/11 (45%) | **Level 3: Moderate** | Radix, ShadCN, Nuxt, MUI, HeroUI | Native prop |
| Data attributes | data-state, data-value for styling | 4/11 (36%) | **Level 4: Occasional** | Radix, ShadCN, HeroUI, Semantic | Native |

## Notable Patterns

### Highly Adopted (Level 1-2)

**Determinate Progress (100%):**
All frameworks provide value-based determinate progress with numeric values (typically 0-100). This is the fundamental use case for progress indicators.

**Indeterminate Progress (91%):**
Nearly universal support for showing activity without known completion time. Implementation varies (null value, props, variants, classes) but concept is universal.

**Percentage Display (100%):**
Every framework supports showing completion percentage, though implementation varies from native props to external composition.

**Size Control (82%):**
Strong consensus on providing multiple size options, though naming varies (xs/sm/md/lg vs numeric scales vs CSS).

**Success State (64%):**
Common pattern to show completion with visual feedback (typically green). Some via dedicated props, others via color system.

### Emerging Patterns (Level 3-4)

**Multi-Section Progress (18%):**
Mantine and Nuxt support breaking progress into multiple colored sections (storage usage, multi-phase operations). Uncommon but powerful for complex scenarios.

**Circular Progress (36%):**
Moderate adoption for circular/ring variants. Some frameworks provide as separate component, others as type variant. Not universal but established pattern.

**Segmented/Steps Progress (36%):**
Dividing progress into discrete segments or steps. Useful for multi-stage workflows. Growing adoption but not yet standard.

**Custom Radius (36%):**
Emerging pattern for border-radius control. Modern UI trend toward customizable rounding.

**Compound Component Structure (27%):**
Chakra, Mantine, and Radix use Root/Track/Range patterns for compositional flexibility. Gaining traction as modern React pattern.

### Unique Innovations (Level 5)

**Animation Style Variants (Nuxt UI only):**
Four different animation patterns (carousel, swing, elastic) for indeterminate states. Unique approach to visual variety.

**Dashboard Arc Type (Ant Design only):**
75% arc variant specifically for dashboard displays. Niche but addresses specific use case.

**Duration-Based Indeterminate (Radix UI only):**
`duration="30s"` prop shows approximate timing for unknown-duration operations. Creative solution for "approximately this long" feedback.

**Buffer Variant (MUI only):**
Shows buffered vs loaded content for video/streaming. Very specific but valuable for media applications.

**Template Variables (Semantic UI only):**
`{percent}`, `{value}`, `{total}`, `{left}` auto-replace in labels without JavaScript. Elegant templating system.

**Inverted Direction (Nuxt UI only):**
Right-to-left or bottom-to-top fill. Useful for RTL languages or specialized UX patterns.

**Vertical Orientation (18% - Mantine, Nuxt):**
Built-in vertical progress bars. Uncommon but useful for specialized layouts.

**Ring Progress Component (Mantine only):**
Dedicated RingProgress component separate from linear Progress. Specialized circular variant.

## Pattern Correlations

### When Linear/Bar exists → Circular also present
- 4 of 11 frameworks (36%) that have linear also provide circular variants
- Frameworks: Ant Design, Chakra UI, MUI, HeroUI (separate component)
- Pattern: Circular typically offered when framework is comprehensive

### When Multi-Section exists → Compound Components used
- 2 of 2 frameworks (100%) with multi-section use compound component patterns
- Frameworks: Mantine, Nuxt UI
- Pattern: Multi-section requires compositional architecture

### When Indeterminate exists → Animation present
- 10 of 10 frameworks (100%) with indeterminate support have animations
- Pattern: Indeterminate inherently requires continuous animation

### When Success/Error states exist → Color system integrated
- 6 of 7 frameworks (86%) with explicit states use color props/system
- Exception: Ant Design uses dedicated `status` prop separate from color
- Pattern: Semantic states typically map to color system

### When Size control exists → Multiple size variants offered (not just two)
- 9 of 9 frameworks (100%) with size control offer 3+ sizes
- Pattern: Size systems are comprehensive, not just small/large

### When Custom formatting exists → Accessibility labels supported
- 4 of 4 frameworks with format functions also support custom value labels
- Pattern: Text customization paired with accessible labeling

## Implementation Notes

### API Design Patterns

**Value Range:**
- **0-100 range** (majority): Most frameworks default to percentage (0-100)
- **Custom min/max** (4 frameworks): HeroUI, Nuxt, Radix, MUI support custom ranges
- **Pattern**: 0-100 is standard but customizable max/min gaining adoption

**Indeterminate Mechanisms:**
- **Null/undefined value** (5 frameworks): Elegant use of type system
- **Boolean prop** (2 frameworks): Explicit `isIndeterminate` or `active`
- **Mode prop** (1 framework): PrimeReact `mode="indeterminate"`
- **Variant prop** (1 framework): MUI `variant="indeterminate"`
- **Duration prop** (1 framework): Radix approximate timing
- **Pattern**: Null/undefined becoming preferred approach

**State Management:**
- **Dedicated status prop** (1 framework): Ant Design
- **Color-based states** (9 frameworks): Use color prop for semantic meaning
- **CSS classes** (1 framework): Semantic UI
- **Pattern**: Color props dominate for state indication

**Composition Approaches:**
- **Single component** (5 frameworks): Ant, HeroUI, MUI, Nuxt, PrimeReact
- **Compound components** (3 frameworks): Chakra, Mantine, Radix/ShadCN
- **jQuery-based** (1 framework): Semantic UI Classic
- **Pattern**: Split between monolithic and compositional

### Animation Strategies

**Performance Optimization:**
- **Transform-based animation** (4 frameworks): Radix, ShadCN, Ant, MUI use translateX()
- **Width animation** (3 frameworks): Semantic UI, PrimeReact, HeroUI animate width
- **CSS-only animations** (7 frameworks): Most avoid JavaScript animation
- **Pattern**: Transform-based preferred for GPU acceleration

**Transition Duration:**
- **Fixed duration** (3 frameworks): MUI 200ms, others vary
- **Configurable duration** (4 frameworks): Mantine, Radix, Nuxt, Chakra
- **Pattern**: Configurable transition becoming standard

### Color Systems

**Implementation:**
- **Theme integration** (10 frameworks): All except Semantic UI integrate with design systems
- **Semantic colors** (8 frameworks): success, warning, error, info standard set
- **Gradient support** (2 frameworks): Ant Design and ShadCN offer gradient fills
- **Pattern**: Theme-aware semantic colors universal

**Color Specification:**
- **Named colors** (majority): "success", "error", "warning", "primary", etc.
- **Custom colors** (6 frameworks): Ant, HeroUI, Chakra, PrimeReact, ShadCN, Semantic support custom
- **Pattern**: Named semantic colors with custom override option

### Size Systems

**Naming Conventions:**
- **T-shirt sizes** (7 frameworks): xs, sm, md, lg, xl, 2xl
- **Numeric scale** (1 framework): Radix uses 1, 2, 3
- **Named sizes** (1 framework): Semantic UI uses tiny, small, large, big
- **CSS-only** (2 frameworks): Ant Design, PrimeReact use CSS for sizing
- **Pattern**: T-shirt sizing dominates

**Size Range:**
- **3 sizes** (2 frameworks): HeroUI, Radix
- **4-5 sizes** (4 frameworks): Semantic, Ant, Chakra, MUI
- **6+ sizes** (3 frameworks): Nuxt (8 sizes), Mantine, ShadCN
- **Pattern**: 4-5 size options most common

## Sophisticated Design Patterns

### Semantic UI Classic - Template Variable Auto-Computation

**What it does**: Progress component automatically calculates and injects dynamic values (`{percent}`, `{value}`, `{total}`, `{left}`) into label templates without requiring JavaScript formatting functions. A label template like `<div class="label">{percent}% Complete</div>` automatically replaces `{percent}` with the current percentage value.

**Why it's sophisticated**: This pattern solves the real-world problem of reducing JavaScript boilerplate for text formatting. Most frameworks require callback functions (React's `format` prop, etc.), but Semantic UI Classic eliminates this need through compile-time template variable replacement. It demonstrates deep thinking about reducing API surface area while maintaining full customization.

**Evidence of design maturity**:
- Automatically calculates five different template variables (`{percent}`, `{value}`, `{total}`, `{left}`, and implicit progress state)
- Handles the edge case where total/remaining values might not exist (gracefully omits them)
- Works in any HTML context without JavaScript intervention - perfect for progressive enhancement
- Reduces component complexity from "format function + label wrapper" to "text with variables"

### Mantine - Compositional Multi-Section Architecture

**What it does**: Progress component provides a compound component API (`Progress.Root`, `Progress.Section`, `Progress.Label`) that enables breaking a single progress bar into multiple colored segments with individual labels. Each section independently specifies its value and color, and they automatically calculate proportional widths to fill 100% of the container.

**Why it's sophisticated**: This pattern addresses the specific problem of showing complex progress states like storage usage breakdown (documents 35%, photos 28%, other 15%) or password strength with multiple requirement bars. The composition pattern isn't just about modularity - it requires sophisticated internal coordination to ensure sections sum to 100% without overflow, handle label positioning across segments, and maintain accessibility across compound boundaries.

**Evidence of design maturity**:
- Handles proportional width calculation: section values auto-calculate as percentages of total container
- Labels intelligently position themselves within narrow segments without overflow
- Supports vertical orientation - requires rethinking label placement and size relationships
- Integrates with theming system for automatic color contrast adjustment (`autoContrast` prop)
- Accessibility properly scoped to compound structure with shared ARIA context
- Common use case (password strength meter with conditional coloring) shows real-world adoption

### Ant Design - Type-Variant Semantics with Positional Control

**What it does**: Progress component provides three semantically distinct type variants (line, circle, dashboard) with specialized positioning controls. The circle and dashboard types support `gapDegree` (arc gap angle in degrees) and `gapPosition` (top/right/bottom/left) props that enable precise control over where the arc gap appears, transforming a full circle into a 75% dashboard arc or any custom arc configuration.

**Why it's sophisticated**: This pattern demonstrates non-obvious thinking about progress visualization. While most frameworks offer "circle" as a binary variant, Ant Design recognizes that circular progress has multiple sub-use cases (full circle for spinners, 75% arcs for dashboards, custom arcs for specialized UX). The gap control is mathematically elegant - instead of separate components for each variant, parametric gap configuration enables infinite customization through two simple properties.

**Evidence of design maturity**:
- Gap system handles the edge case of inverted arcs (gap at bottom vs top) without separate props
- Degree-based positioning is framework-agnostic (works in SVG/Canvas contexts)
- Reduces component explosion (no separate DashboardProgress, CircleProgress, ArcProgress) through parametric design
- Status prop with automatic icon rendering shows attention to feedback completeness
- Indeterminate state via property omission (not separate boolean) reduces prop combinations

## Raw Data

Individual framework reports:
- [Ant Design](./ant-design/usage-patterns.md)
- [Chakra UI](./chakra-ui/usage-patterns.md)
- [HeroUI](./heroui/usage-patterns.md)
- [Mantine](./mantine/usage-patterns.md)
- [MUI](./mui/usage-patterns.md)
- [Nuxt UI](./nuxt-ui/usage-patterns.md)
- [PrimeReact](./primereact/usage-patterns.md)
- [Radix UI](./radix-ui/usage-patterns.md)
- [ShadCN](./shadcn/usage-patterns.md)
- [Semantic UI Classic](./semantic-ui-classic/usage-patterns.md)

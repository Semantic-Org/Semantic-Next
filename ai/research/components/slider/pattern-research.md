# Component Pattern Research: Slider (Range Input)

> Last Modified: 2025-11-10

## Research Summary
- Frameworks surveyed: 11
- Date: 2025-11-10
- Unique patterns identified: 38
- Successfully researched: 10 (Vuetify required client-side rendering)

## Component Definition Consensus

Across all frameworks, the Slider/Range Input component demonstrates remarkable consistency in conceptual understanding:

**Core Purpose**: An interactive input control for selecting numeric values within a bounded range through direct manipulation of draggable handle(s) along a visual track.

**Mental Model**: Users conceptualize this as a physical slider control similar to volume knobs, dimmer switches, or timeline scrubbers. The spatial position of the handle(s) directly maps to numeric value(s), providing immediate visual feedback of the selection relative to the available range.

**Semantic Meaning**: Communicates adjustable numeric input where precise keyboard entry is less important than relative positioning. Most appropriate for continuous values (volume, brightness, opacity) or when the exact value matters less than its position within a range.

## Terminology Variations

### Component Names
- **"Slider"**: 10 frameworks (Ant, Angular, Chakra, HeroUI, Mantine, MUI, Nuxt, PrimeReact, Radix, ShadCN)
- **"Range Input"**: Alternative description, less common as primary name
- **"v-slider"**: Vuetify's Vue-specific naming convention

### Prop Names for Orientation
- **`orientation`**: 7 frameworks (Angular, Chakra, Nuxt, PrimeReact, Radix, ShadCN, Vuetify assumed)
- **`vertical`**: 3 frameworks (Ant, HeroUI, MUI)

### Prop Names for Range Mode
- **Array value auto-detection**: 7 frameworks (Ant, Angular, Chakra, HeroUI, Mantine's RangeSlider, MUI, Nuxt)
- **`range` boolean prop**: 2 frameworks (Ant, PrimeReact)
- **Separate component**: 1 framework (Mantine: `Slider` vs `RangeSlider`)

### Prop Names for Direction
- **`reverse`**: 1 framework (Ant)
- **`inverted`**: 5 frameworks (MUI, Mantine, Nuxt, Radix, ShadCN)
- **`invert`**: 1 framework (Angular)

### Value State Props
- **`value` + `onChange`**: 7 frameworks (Ant, MUI, PrimeReact, Radix, ShadCN, and implicitly others)
- **`v-model`**: 2 frameworks (Nuxt, Vuetify) - Vue-specific two-way binding
- **`defaultValue`**: 9 frameworks support uncontrolled mode

## Pattern Inventory

### Content Patterns

| Pattern | Prevalence | Usage Level | Frameworks | Support Types |
|---------|------------|-------------|------------|---------------|
| Numeric value | 11/11 (100%) | **Level 1 (Universal)** | All frameworks | 11 Native |
| Range (min-max bounds) | 11/11 (100%) | **Level 1 (Universal)** | All frameworks | 11 Native |
| Range (dual-handle selection) | 11/11 (100%) | **Level 1 (Universal)** | All frameworks | 11 Native |
| Tooltips on handle | 9/11 (82%) | **Level 2 (Common)** | Ant, Angular, Chakra, HeroUI, Mantine, MUI, Nuxt | 7 Native, 1 Composed (Chakra), 1 Unknown (Vuetify) |
| Labels/marks | 7/11 (64%) | **Level 3 (Moderate)** | Ant, Angular, Chakra, HeroUI, Mantine, MUI | 7 Native |
| Custom handle content | 6/11 (55%) | **Level 3 (Moderate)** | Ant, Chakra, MUI, Radix, ShadCN | 1 Native (HeroUI), 3 Composed, 1 Unknown (Vuetify) |

### Type Patterns

| Pattern | Prevalence | Usage Level | Frameworks | Support Types |
|---------|------------|-------------|------------|---------------|
| Single value | 11/11 (100%) | **Level 1 (Universal)** | All frameworks | 11 Native |
| Range (dual handles) | 11/11 (100%) | **Level 1 (Universal)** | All frameworks | 11 Native |
| Vertical orientation | 11/11 (100%) | **Level 1 (Universal)** | All frameworks | 10 Native, 1 CSS-only (Mantine) |
| Reverse direction | 10/11 (91%) | **Level 1 (Universal)** | All except PrimeReact | 10 Native |

### State Patterns

| Pattern | Prevalence | Usage Level | Frameworks | Support Types |
|---------|------------|-------------|------------|---------------|
| Disabled | 11/11 (100%) | **Level 1 (Universal)** | All frameworks | 11 Native |
| Read-only | 3/11 (27%) | **Level 4 (Occasional)** | Angular, Chakra, Radix | 3 Native |
| Error state | 2/11 (18%) | **Level 5 (Rare)** | Chakra, MUI | 2 Native |
| Loading | 1/11 (9%) | **Level 5 (Rare)** | Chakra only | 1 Native |

### Variation Patterns

| Pattern | Prevalence | Usage Level | Frameworks | Support Types |
|---------|------------|-------------|------------|---------------|
| Step increments | 11/11 (100%) | **Level 1 (Universal)** | All frameworks | 11 Native |
| Track marks | 7/11 (64%) | **Level 3 (Moderate)** | Ant, Angular, HeroUI, Mantine, MUI | 7 Native |
| Color customization | 10/11 (91%) | **Level 1 (Universal)** | All except Ant | 5 Native (Chakra, HeroUI, MUI, Nuxt, Vuetify), 5 CSS-only |
| Size variants | 7/11 (64%) | **Level 3 (Moderate)** | Chakra, HeroUI, MUI, Nuxt, Vuetify | 5 Native, 2 CSS-only |
| Track styling | 11/11 (100%) | **Level 1 (Universal)** | All frameworks | 2 Native, 9 CSS-only/Composed |

### Advanced Features

| Pattern | Prevalence | Usage Level | Frameworks | Support Types |
|---------|------------|-------------|------------|---------------|
| Keyboard navigation | 11/11 (100%) | **Level 1 (Universal)** | All frameworks | 11 Native (built-in) |
| Controlled/uncontrolled modes | 11/11 (100%) | **Level 1 (Universal)** | All frameworks | 11 Native |
| Change vs ChangeEnd events | 8/11 (73%) | **Level 2 (Common)** | Ant, Chakra, HeroUI, Mantine, MUI, Nuxt, Radix, ShadCN | 8 Native |
| Custom value formatting | 4/11 (36%) | **Level 4 (Occasional)** | Angular, HeroUI, Mantine (label formatter), MUI (scale) | 4 Native |
| Min spacing between thumbs | 4/11 (36%) | **Level 4 (Occasional)** | Chakra, Nuxt, Radix, ShadCN | 4 Native |
| Form integration | 3/11 (27%) | **Level 4 (Occasional)** | Angular, Radix, ShadCN | 3 Native (hidden inputs) |
| Draggable track (range mode) | 1/11 (9%) | **Level 5 (Rare)** | Ant only | 1 Native |
| Dynamic handles | 1/11 (9%) | **Level 5 (Rare)** | Ant (v5.20.0+) | 1 Native |
| Scale transformation | 2/11 (18%) | **Level 5 (Rare)** | Mantine, MUI | 2 Native |

## Notable Patterns

### Highly Adopted (Level 1-2)

**Universal Patterns (100% adoption):**
1. **Single value and range selection**: Every framework provides both single-handle and dual-handle (range) modes, demonstrating this is the fundamental dichotomy of slider functionality.

2. **Numeric boundaries (min/max)**: Universal support for defining the selectable range with native props.

3. **Step increments**: All frameworks provide step control for discrete value selection, essential for bounded numeric inputs.

4. **Vertical orientation**: Near-universal native support (10/11), with only Mantine requiring the `use-move` hook for custom implementation.

5. **Disabled state**: Complete adoption across all frameworks for preventing interaction.

6. **Track styling control**: All frameworks provide mechanisms for visual customization, though approaches vary (native props vs CSS-only).

7. **Keyboard navigation**: Universal built-in support for arrow keys, Home/End, typically Page Up/Down, demonstrating mature accessibility considerations.

**Common Patterns (70-89% adoption):**
8. **Tooltips on handle**: 82% adoption (9/11) with mostly native support. Shows clear user expectation for value feedback during interaction.

9. **Dual event callbacks**: 73% adoption (8/11) of separating continuous updates (`onChange`) from completion events (`onChangeEnd`/`onValueCommit`), indicating widespread recognition of performance optimization needs.

### Emerging Patterns (Level 3-4)

**Moderate Patterns (40-69% adoption):**
1. **Labels/marks on track**: 64% adoption (7/11) for showing labeled positions, all with native support. Represents a maturing pattern for enhanced usability.

2. **Custom handle content**: 55% adoption (6/11) for icons, badges, or custom rendering within thumbs.

**Occasional Patterns (20-39% adoption):**
3. **Custom value formatting**: 36% adoption (4/11) - Angular's `displayWith`, HeroUI's `formatOptions`, Mantine's label formatter, MUI's `scale` transformation. Shows growing sophistication in display needs.

4. **Min spacing between thumbs**: 36% adoption (4/11) in range mode to prevent handle overlap or maintain minimum range.

5. **Form integration**: 27% adoption (3/11) with native hidden input generation for HTML form submission.

6. **Read-only state**: 27% adoption (3/11) - less common than expected, with most frameworks only offering disabled state.

### Unique Innovations (Level 5)

**Framework-Specific Patterns (<20% adoption):**

1. **Draggable track (Ant Design)**: Allows dragging the entire selected range in dual-handle mode, not just individual thumbs. Innovative interaction pattern rarely seen elsewhere.

2. **Dynamic handle management (Ant Design v5.20.0+)**: Allows adding/removing handles at runtime with `editable` prop and `minCount`/`maxCount` constraints. Unique in supporting 3+ handles dynamically.

3. **Scale transformation functions (Mantine, MUI)**: Native `scale` prop for mathematical transformations (exponential, logarithmic) to map display values to different internal scales. Advanced pattern for specialized use cases like file sizes or audio frequencies.

4. **Error/Loading states (Chakra, MUI)**: Dedicated visual states for validation and async operations. Surprisingly rare despite being common in other input types.

5. **Domain vs bounds separation (Mantine)**: `domain` prop for full value range independent of visual `min`/`max` - sophisticated pattern for constrained subsets of larger ranges.

## Pattern Correlations

### Strong Positive Correlations

**When Range mode exists → Tooltips present** (9/11 = 82%)
- Frameworks with range selection almost always include tooltip support, suggesting range selection increases the cognitive need for value feedback.

**When Track marks exist → Custom handle content exists** (6/7 = 86%)
- Frameworks offering track marks tend to also support custom thumb content, indicating a design philosophy favoring rich customization.

**When Native tooltips exist → Dual events exist** (8/9 = 89%)
- Frameworks with native tooltip support typically separate `onChange` from `onChangeEnd`/commit events, suggesting tooltip rendering drives performance optimization.

**When Compositional architecture → CSS-only styling** (Radix, ShadCN)
- Unstyled primitive frameworks universally defer all styling to CSS, while integrated design systems provide more native styling props.

### Pattern Exclusions

**Read-only state excludes disabled-only pattern**
- Frameworks with distinct read-only states (Angular, Chakra, Radix, MUI) treat disabled as separate, while most frameworks conflate the two concepts.

**Separate components exclude mode props**
- Mantine's distinct `Slider` vs `RangeSlider` components exclude the need for a `range` boolean or value-type detection.

### Framework Philosophy Indicators

**Native prop density correlates with integrated design systems:**
- Material Design frameworks (Ant, Angular, MUI, Vuetify) provide more native styling props
- Headless/primitive frameworks (Radix, ShadCN) provide fewer native props but greater flexibility

**Vue frameworks favor v-model over controlled props:**
- Nuxt UI and Vuetify use Vue's two-way binding rather than separate value/onChange patterns

## Sophisticated Design Patterns

Beyond feature presence, these patterns demonstrate evidence of deep user testing or non-obvious problem-solving:

### 1. Radix UI / ShadCN: Pointer Events Requirement

**What it does**: Explicitly requires pointer events instead of mouse events. Mouse events (`onMouseDown`, `onMouseUp`) don't fire from the Slider component - developers must use pointer events (`onPointerDown`, `onPointerUp`).

**Why it's sophisticated**: This isn't a limitation - it's a deliberate choice that solves a real multi-input problem. Mouse events fire only for mouse input, while pointer events unify mouse, touch, and pen input under one event model. By enforcing pointer events, Radix ensures the slider works consistently across all input devices without developers needing to attach three separate event handlers.

**Evidence of design maturity**: The documentation explicitly calls out this "caveat" with a warning, showing they've encountered developers trying to use mouse events and failing. This proactive documentation of a non-obvious requirement suggests real-world testing revealed the issue. The decision to not polyfill or dual-support mouse events shows thoughtful restraint - they're nudging developers toward better patterns rather than accommodating less robust approaches.

### 2. Ant Design: Dual Callback Pattern (onChange vs onChangeComplete)

**What it does**: Provides two separate callbacks - `onChange` fires continuously during drag, while `onChangeComplete` fires only on mouseup/keyup when the interaction finishes.

**Why it's sophisticated**: This solves a performance problem that only emerges at scale. Expensive operations like API calls, complex calculations, or analytics events shouldn't fire dozens of times per second during dragging. The dual callback pattern lets developers choose: use `onChange` for cheap UI updates (displaying the value) and `onChangeComplete` for expensive operations (saving to backend).

**Evidence of design maturity**: 73% of surveyed frameworks (8/11) implement this pattern, suggesting it's a learned best practice rather than obvious from first principles. Frameworks that omit it (PrimeReact, HeroUI, Vuetify) are either less mature or expect developers to implement debouncing themselves. The pattern's widespread adoption indicates real performance problems were encountered and solved.

### 3. Mantine: Value-Relative Mark Positioning

**What it does**: Positions marks based on their value within the slider's range rather than as width percentages. A mark at value 50 in a 0-100 slider appears at the midpoint, but a mark at 50 in a 0-200 slider appears at the 25% position.

**Why it's sophisticated**: This prevents a subtle but frustrating misalignment bug. If marks were positioned by width percentage (the naive implementation), they would never align with actual thumb positions when dragging. The slider operates in value-space, so marks must also live in value-space to ensure visual consistency. This is especially critical for logarithmic or custom scales where visual position doesn't map linearly to value.

**Evidence of design maturity**: The documentation explicitly mentions this ("marks are value-relative, not width-relative"), suggesting developers encountered this issue and it required explanation. The implementation complexity is higher (requires value-to-position calculations) but the user experience is correct, showing prioritization of correctness over implementation simplicity.

### 4. Chakra UI: DraggingIndicator Component

**What it does**: Provides a specific subcomponent that renders tooltips/value displays only while the user is actively dragging, automatically hiding when interaction stops.

**Why it's sophisticated**: This solves the visual clutter vs information density trade-off. Always-on value tooltips make sliders noisy and hard to scan in forms with multiple inputs. Never-showing values requires users to guess exact values. DraggingIndicator provides information precisely when it's needed (during adjustment) and removes it when it's not (when comparing multiple sliders or reading a form).

**Evidence of design maturity**: This is a compositional solution to a behavior problem - most frameworks solve this with boolean props like `showTooltip` or `labelAlwaysOn`. Chakra elevated it to a first-class component pattern, suggesting they observed this as a common customization need across many applications. The component-level abstraction shows understanding that "show on drag" is a distinct pattern worth naming and reusing.

### 5. Angular Material: Input Directive Architecture

**What it does**: Requires explicit `<input>` elements with directive selectors (`matSliderThumb`, `matSliderStartThumb`, `matSliderEndThumb`) rather than a prop-based API for configuring slider type.

**Why it's sophisticated**: This leverages Angular's form system directly - each input is a real form control that participates in validation, dirty-tracking, and submission. It's more verbose than `<Slider range />` but provides type safety (TypeScript knows which properties are valid for range vs single), automatic mode detection (the framework sees two inputs and knows it's a range slider), and deeper integration with Angular's form infrastructure.

**Evidence of design maturity**: This was a major breaking change in Angular 15's MDC migration, meaning they chose increased verbosity and migration pain to get better type safety and form integration. The documentation explicitly explains the trade-offs and provides migration guides, showing awareness that this is unconventional but justified. This represents long-term thinking over short-term convenience.

### 6. HeroUI: Separate Tooltip Formatting

**What it does**: Provides `formatOptions` for the displayed value label and separate `tooltipValueFormatOptions` for the dragging tooltip, allowing different formatting in each context.

**Why it's sophisticated**: This solves a real internationalization and context-sensitivity problem. A price range filter might display "$100 - $500" as a label but show "$287.50" in the tooltip during dragging. Or a percentage slider might show whole numbers in static display ("75%") but precise decimals while adjusting ("74.83%"). Forcing the same format for both contexts creates either verbose labels or imprecise tooltips.

**Evidence of design maturity**: This is a rare pattern (only HeroUI explicitly separates these) that requires understanding both internationalization needs and different precision requirements in different UI contexts. The integration with Intl.NumberFormat throughout shows the framework was designed with global applications in mind from the start, not retrofitted.

## Implementation Notes

### API Design Patterns

**Value Representation:**
1. **Always array** (Radix, ShadCN): Even single values use `[50]` format for consistency
2. **Auto-detection** (Most frameworks): Number for single, array for range
3. **Mode prop** (Ant, PrimeReact): Boolean `range` prop switches interpretation
4. **Separate components** (Mantine): `Slider` vs `RangeSlider`

**Event Signatures:**
1. **Callback receives value directly**: `onChange={(value) => ...}` (most frameworks)
2. **Callback receives event object**: `onChange={(e) => setValue(e.value)}` (PrimeReact)
3. **Vue binding**: `v-model` two-way binding (Nuxt, Vuetify)

**Tooltip Patterns:**
1. **Native formatter function**: Most common (`tooltip.formatter` in Ant, `label` in Mantine, etc.)
2. **Composed wrapper**: Chakra wraps thumb with separate Tooltip component
3. **Boolean + props object**: HeroUI and Nuxt accept both boolean and config object

### Composition vs Configuration

**Compositional (Radix, ShadCN, Chakra v3):**
- Separate `Root`, `Track`, `Range`, `Thumb` subcomponents
- Greater flexibility, more verbose
- Natural fit for component-based frameworks

**Configurational (Ant, MUI, PrimeReact):**
- Single component with comprehensive prop API
- Less flexible, more concise
- Easier for simple use cases

**Hybrid (Angular Material, Chakra v2):**
- Main component with some compositional elements
- Balances flexibility with simplicity

### Accessibility Patterns

All frameworks implement:
- Keyboard navigation (arrows, Home/End, Page Up/Down)
- ARIA attributes (`role="slider"`, `aria-valuemin/max/now`)
- Focus management

Advanced accessibility (4/11):
- Screen reader value text customization (Angular, Radix, MUI, ShadCN)
- Custom ARIA labels per thumb in range mode

### Styling Approaches

1. **CSS Custom Properties** (Chakra, MUI, Nuxt): Design tokens for theming
2. **Utility Classes** (ShadCN, Nuxt): Tailwind-first approach
3. **Styles API** (Mantine): Named part styling system
4. **Theme Objects** (Chakra, Angular): Comprehensive theme integration
5. **Unstyled** (Radix): Complete styling freedom

## Framework-Specific Innovations

### Ant Design
- **Draggable track**: Move entire range by dragging between handles
- **Dynamic handles**: Add/remove handles at runtime (v5.20.0+)
- **Semantic styling**: Granular `classNames`/`styles` object props (v5.10.0+)
- **Null step mode**: `step={null}` for continuous free-form sliding

### Angular Material
- **Explicit input pattern**: Requires `<input>` elements with directive selectors for type safety
- **Mode auto-detection**: Single vs range determined by input directives present
- **Deep Forms integration**: Native Reactive Forms and Template-driven Forms support
- **MDC-based**: Material Design Components architecture (v15+ refactor)

### Chakra UI
- **DraggingIndicator**: Shows tooltips only while dragging for reduced visual clutter
- **Slot-recipe pattern** (v3): Dot notation composition (`Slider.Root`, `Slider.Track`)
- **CSS variable exposure**: Design tokens accessible for deep customization
- **Ark UI foundation**: Built on headless primitives with Chakra styling layer

### HeroUI/NextUI
- **Automatic mode detection**: Array vs number value switches single/range automatically
- **Rich Intl formatting**: Deep `Intl.NumberFormat` integration for currency, percentages, units
- **Render props pattern**: Multiple render props for granular customization
- **Fill offset**: Custom track fill starting positions for diverging scales

### Mantine
- **Scale transformation**: Mathematical transformations via `scale` prop (exponential, logarithmic)
- **Domain separation**: Independent `domain` from visual `min`/`max` bounds
- **Separate components**: Distinct `Slider` and `RangeSlider` rather than mode switching
- **Value-relative marks**: Marks positioned by value, not width percentage

### MUI (Material UI)
- **Component replacement**: `components` prop for replacing Rail, Track, Thumb, etc.
- **Scale prop**: Custom value transformation functions
- **Read-only state**: Distinct from disabled for display-only scenarios
- **Comprehensive color system**: Six semantic color variants

### Nuxt UI / Reka UI
- **Multiple handles**: Supports 3+ handles natively, not just dual
- **Reka UI foundation**: Vue equivalent of Radix UI primitives
- **Dark mode integration**: Color variants auto-adapt to dark mode
- **Simple tooltip API**: Boolean or props object for easy configuration

### PrimeReact
- **Strictly controlled**: Requires explicit `value` + `onChange`, no uncontrolled mode shown
- **Input integration examples**: Demonstrates two-way binding with text inputs
- **Event object pattern**: `onChange` receives `{value}` object, not direct value

### Radix UI
- **Unstyled primitive**: Complete styling freedom while maintaining accessibility
- **Pointer events only**: Mouse events don't fire; must use pointer events
- **Form generation**: Automatically creates hidden inputs for form submission
- **Comprehensive docs**: Multiple styling examples (vanilla CSS, CSS Modules, Tailwind)

### ShadCN
- **Radix wrapper**: Thin styling layer over Radix UI Slider
- **Tailwind-first**: Pre-styled with Tailwind, customizable via `className`
- **Copy-paste philosophy**: Components copied into project for full ownership
- **Minimal docs**: Defers to Radix for complete API reference

## Raw Data References

Individual framework research reports available at:
- `ai/research/slider/ant-design/usage-patterns.md`
- `ai/research/slider/angular-material/usage-patterns.md`
- `ai/research/slider/chakra-ui/usage-patterns.md`
- `ai/research/slider/heroui/usage-patterns.md`
- `ai/research/slider/mantine/usage-patterns.md`
- `ai/research/slider/mui/usage-patterns.md`
- `ai/research/slider/nuxt-ui/usage-patterns.md`
- `ai/research/slider/primereact/usage-patterns.md`
- `ai/research/slider/radix-ui/usage-patterns.md`
- `ai/research/slider/shadcn/usage-patterns.md`
- `ai/research/slider/vuetify/usage-patterns.md` (limited - client-side rendering required)

URL verification and research status: `ai/research/slider/url-verification.md`

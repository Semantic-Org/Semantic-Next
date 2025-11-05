# Component Pattern Research: Progress Bar

> Last Modified: 2025-11-05

## Research Summary
- Frameworks surveyed: 9 (Ant Design, Chakra UI, HeroUI, Mantine, MUI, Nuxt UI, PrimeReact, Semantic UI, Vuetify)
- Date: 2025-11-05
- Unique patterns identified: 45+

## Component Definition Consensus

Across all frameworks, the progress bar component serves a universal purpose: **providing visual feedback for task completion status through a horizontal or circular indicator**. The component communicates process advancement, reduces perceived wait time, and provides users with measurable feedback during operations like file uploads, data loading, multi-step processes, and system operations.

**Common Mental Model**: A bar or circle that progressively fills from empty to complete (0% to 100%), with two fundamental modes:
1. **Determinate**: Known progress percentage with measurable completion
2. **Indeterminate**: Unknown duration with continuous animation indicating active work

**Semantic Meaning**: Communicates "how far along" an operation is and manages user expectations during waiting periods. Progress indicators are status displays, not interactive controls—they're meant to be observed, not manipulated by users.

## Terminology Variations

### Component Names
- **Progress** (6 frameworks): Ant Design, Chakra UI, HeroUI, Mantine, MUI (partial), Nuxt UI
- **ProgressBar** (2 frameworks): PrimeReact, Semantic UI
- **LinearProgress/CircularProgress** (1 framework): MUI (separate components)
- **v-progress-linear/v-progress-circular** (1 framework): Vuetify (separate components)

### Prop/Attribute Terminology
- **Value/Percentage**: `percent` (Ant Design) = `value` (all others)
- **Indeterminate State**: `isIndeterminate` (HeroUI, Semantic UI v2) = `value={null}` (Chakra, Nuxt) = `indeterminate` (Vuetify) = `mode="indeterminate"` (PrimeReact)
- **Striped Pattern**: `striped` (most) = `hasStripe` (Chakra v2) = `isStriped` (HeroUI)
- **Animation**: `animated` (most) = `isAnimated` (Chakra v2, Vuetify)
- **Orientation**: `type` (Ant Design) = `orientation` (Mantine, Nuxt, Vuetify)

## Pattern Inventory

### Type Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Linear/Bar (Horizontal) | Horizontal progress bar filling left-to-right | 9/9 (100%) | Level 1 (Universal) | All frameworks | Native |
| Circular/Radial | Circular progress indicator with arc completion | 6/9 (67%) | Level 2 (Common) | Ant Design, Chakra UI, MUI, Vuetify, (Semantic UI has partial support) | Native (separate component in some) |
| Determinate | Progress with known percentage/value (0-100) | 9/9 (100%) | Level 1 (Universal) | All frameworks | Native via `value`/`percent` prop |
| Indeterminate | Unknown progress with continuous animation | 9/9 (100%) | Level 1 (Universal) | All frameworks | Native (various prop patterns) |
| Dashboard/Arc | Half-circle (180°) gauge-style indicator | 1/9 (11%) | Level 5 (Rare) | Ant Design only | Native via `type="dashboard"` |
| Vertical | Vertical progress bar filling bottom-to-top | 3/9 (33%) | Level 4 (Occasional) | Mantine, Nuxt UI, Vuetify | Native via `orientation="vertical"` |

### Content Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Percentage/Value Display | Show numeric progress value (e.g., "75%") | 9/9 (100%) | Level 1 (Universal) | All frameworks | Native or Composed |
| Custom Label Text | Descriptive labels above/beside bar | 9/9 (100%) | Level 1 (Universal) | All frameworks | Native or Composed |
| Custom Format Function | Custom rendering of progress text/content | 7/9 (78%) | Level 2 (Common) | Ant Design, Chakra UI, HeroUI, Mantine, Nuxt UI, PrimeReact, Semantic UI | Native via `format`/`formatOptions`/slot |
| Step Labels | Text labels for multi-step processes | 2/9 (22%) | Level 4 (Occasional) | Nuxt UI, Semantic UI | Native (array of strings) |
| Icon Support | Icons within or alongside progress | 0/9 (0%) | N/A | None | Must be externally composed |

### State Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Active/Loading | Animated state indicating ongoing work | 9/9 (100%) | Level 1 (Universal) | All frameworks | Native (indeterminate mode) |
| Success State | Visual indication of completion | 4/9 (44%) | Level 3 (Moderate) | Ant Design, Semantic UI (via status prop) | Native via `status="success"` |
| Error/Exception | Indicates failure or problem | 3/9 (33%) | Level 4 (Occasional) | Ant Design, Semantic UI (via status prop) | Native via `status="exception"` |
| Warning State | Signals issues or slow progress | 2/9 (22%) | Level 4 (Occasional) | Semantic UI (via status) | Native via `status="warning"` |
| Disabled State | Non-interactive/paused appearance | 3/9 (33%) | Level 4 (Occasional) | HeroUI, Semantic UI, Vuetify | Native via `isDisabled`/`disabled` |

### Variation Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Size Options | Predefined size variants (xs/sm/md/lg/xl) | 8/9 (89%) | Level 1 (Universal) | All except PrimeReact | Native via `size` prop |
| Custom Height/Thickness | Manual height control | 9/9 (100%) | Level 1 (Universal) | All frameworks | Native via `strokeWidth`/`size`/`style` |
| Color Options | Semantic or theme-based colors | 9/9 (100%) | Level 1 (Universal) | All frameworks | Native via `color`/`strokeColor` |
| Gradient Colors | Multi-color gradient fills | 1/9 (11%) | Level 5 (Rare) | Ant Design only | Native via gradient object |
| Striped Pattern | Diagonal stripe overlay effect | 7/9 (78%) | Level 2 (Common) | Ant Design, Chakra UI, HeroUI, Mantine, Semantic UI, Vuetify (partial), Nuxt UI (via animation) | Native via `striped` prop |
| Animated Stripes | Moving stripe animation | 6/9 (67%) | Level 2 (Common) | Ant Design, Chakra UI, HeroUI, Mantine, Semantic UI, Vuetify | Native via `animated` + `striped` |
| Border Radius Control | Rounded corners customization | 4/9 (44%) | Level 3 (Moderate) | Chakra UI, HeroUI, Mantine, Semantic UI | Native via `radius` prop |
| Multi-Segment/Sections | Multiple colored segments in single bar | 3/9 (33%) | Level 4 (Occasional) | Ant Design (success segment), Mantine (compound), Semantic UI | Native via compound components |
| Buffer Progress | Show buffered/cached content ahead | 2/9 (22%) | Level 4 (Occasional) | MUI, Vuetify | Native via `buffer-value` prop |
| Steps/Discrete Segments | Progress as discrete steps rather than continuous | 2/9 (22%) | Level 4 (Occasional) | Ant Design, Semantic UI | Native via `steps` prop |
| Inverted Direction | Fill direction reversal (RTL or bottom-up) | 2/9 (22%) | Level 4 (Occasional) | Nuxt UI, Semantic UI | Native via `inverted` prop |

### Animation Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| Smooth Value Transitions | Animated width changes on value update | 9/9 (100%) | Level 1 (Universal) | All frameworks | Native (automatic CSS transitions) |
| Indeterminate Animation | Continuous animation for unknown progress | 9/9 (100%) | Level 1 (Universal) | All frameworks | Native |
| Animation Duration Control | Customize transition timing | 3/9 (33%) | Level 4 (Occasional) | Mantine, Nuxt UI, PrimeReact | Native via `transitionDuration` |
| Multiple Animation Styles | Different indeterminate animation patterns | 1/9 (11%) | Level 5 (Rare) | Nuxt UI (4 styles: carousel, swing, elastic) | Native via `animation` prop |
| Disable Animation | Turn off animations (accessibility) | 2/9 (22%) | Level 4 (Occasional) | HeroUI, Mantine | Native via `disableAnimation` |

### Accessibility Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| ARIA Role (progressbar) | Semantic role attribute | 9/9 (100%) | Level 1 (Universal) | All frameworks | Native (automatic) |
| ARIA Value Attributes | aria-valuenow/min/max attributes | 9/9 (100%) | Level 1 (Universal) | All frameworks | Native (automatic) |
| ARIA Label Support | aria-label for screen readers | 9/9 (100%) | Level 1 (Universal) | All frameworks | Native via prop or attribute |
| Custom Value Text | Screen reader-friendly value descriptions | 2/9 (22%) | Level 4 (Occasional) | HeroUI, Nuxt UI | Native via `getValueText` prop |
| Auto-Contrast Labels | Automatic label contrast adjustment | 1/9 (11%) | Level 5 (Rare) | Mantine only | Native via `autoContrast` prop |

### Integration Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Method |
|---------|-------------|------------|-------------|------------|----------------|
| File Upload Progress | Track upload completion | 9/9 (100%) | Level 1 (Universal) | All (documented pattern) | Application-level |
| Multi-Step Process | Wizard/form progression tracking | 9/9 (100%) | Level 1 (Universal) | All (documented pattern) | Application-level |
| Data Loading | Async operation feedback | 9/9 (100%) | Level 1 (Universal) | All (documented pattern) | Application-level |
| Password Strength | Visual password quality indicator | 2/9 (22%) | Level 4 (Occasional) | Mantine, Semantic UI | Application-level (documented) |
| Storage/Disk Usage | Multi-segment capacity display | 2/9 (22%) | Level 4 (Occasional) | Mantine, Semantic UI | Application-level (documented) |

## Notable Patterns

### Highly Adopted (Level 1-2)

**Universal Patterns (100% adoption):**
- Linear/horizontal progress bar with determinate values
- Indeterminate/animated state for unknown progress
- Percentage/value display capabilities
- ARIA accessibility attributes (role, value, label)
- Smooth value transition animations
- Color customization options
- Custom height/thickness control

**Common Patterns (67-89% adoption):**
- Circular/radial progress indicators (67%)
- Predefined size variants (89%)
- Striped visual pattern (78%)
- Custom formatting functions (78%)

### Emerging Patterns (Level 3-4)

**Moderate Adoption (40-69%):**
- Success state indication (44%)
- Border radius control (44%)

**Occasional Adoption (20-39%):**
- Multi-segment/sectioned progress (33%)
- Error/exception states (33%)
- Disabled states (33%)
- Vertical orientation (33%)
- Custom animation duration (33%)
- Buffer progress (22%)
- Step labels for workflows (22%)
- Discrete step segments (22%)
- Inverted fill direction (22%)
- Custom screen reader value text (22%)
- Animated stripe movement (22%)

### Unique Innovations (Level 5)

**Framework-Specific Patterns (<20%):**
- **Ant Design**: Dashboard/arc (180°) progress variant; gradient color support; success segment overlay
- **Nuxt UI**: Four animation styles for indeterminate state (carousel, carousel-inverse, swing, elastic); step labels via array
- **Mantine**: Auto-contrast for multi-segment labels; compound component API for complex layouts
- **MUI**: Query variant (reverse animation for LinearProgress); buffer progress for streaming

## Pattern Correlations

**When Circular Progress exists:**
- Typically a separate component (4/6 frameworks: MUI, Vuetify split components)
- 67% support both linear and circular (6/9 frameworks)

**When Striped Pattern exists:**
- 86% also support animated stripes (6/7 frameworks)
- Requires both `striped` and `animated` props to enable animation

**When Multi-Segment Support exists:**
- 100% use compound component pattern (3/3: Ant Design success segment, Mantine Progress.Root/Section, Semantic UI)
- Often paired with storage/capacity use cases

**When Indeterminate State exists:**
- 100% provide continuous animation (9/9 frameworks)
- Two API approaches: boolean flag (56%) vs null value (44%)
- Animation customization rare (only Nuxt UI provides style variants)

**When Size Variants exist:**
- 100% include xs/sm/md/lg sizing scale (8/8 frameworks with size variants)
- Size typically controls height/thickness for linear, diameter for circular

**Success/Error States correlation:**
- When success state exists (4/9), error state exists in 75% (3/4: Ant Design, Semantic UI)
- Typically implemented via `status` prop with semantic values

## Implementation Notes

### API Design Patterns

**Value Control:**
- Numeric `value` prop (0-100) is universal standard
- `percent` prop (Ant Design) is semantic equivalent
- Min/max range customization rare (only Chakra UI, HeroUI support custom ranges)

**Indeterminate State API:**
1. **Boolean flag approach** (5 frameworks): `indeterminate={true}`, `isIndeterminate={true}`, `mode="indeterminate"`
2. **Null value approach** (2 frameworks): `value={null}` triggers indeterminate (Chakra UI, Nuxt UI)
3. **Active status approach** (1 framework): `status="active"` (Semantic UI)

**Compound Components:**
- 3 frameworks use compound/composition API for advanced layouts:
  - **Chakra UI v3**: Progress.Root/Track/Range/Label
  - **Mantine**: Progress.Root/Section/Label
  - **Semantic UI**: Progress with nested bar/label

**Color API:**
- Semantic colors (primary/secondary/success/error) most common
- Theme color keys (string references) in 7/9 frameworks
- Direct CSS color values supported in 4/9 frameworks
- Gradient objects rare (Ant Design only)

**Size Control:**
- Predefined size scale (xs/sm/md/lg/xl) in 8/9 frameworks
- Numeric pixel values for custom sizing in 7/9 frameworks
- `strokeWidth` for circular, `size`/`height` for linear

### Architectural Observations

**Component Separation:**
- **Unified component** (6 frameworks): Single component with `type` or `orientation` prop
- **Split components** (3 frameworks): Separate linear and circular components (MUI, Vuetify split; Chakra has ProgressCircle as separate)

**Framework Philosophy:**
- **Minimalist** (PrimeReact): Simple API, rely on CSS customization
- **Comprehensive** (Ant Design, Semantic UI): Rich state/variant props built-in
- **Compositional** (Chakra v3, Mantine): Compound components for flexibility
- **Functional** (Nuxt UI): Vue-centric with v-model binding and slots

**Accessibility-First:**
- All frameworks provide ARIA role and attributes automatically
- Only 2 frameworks (HeroUI, Nuxt UI) provide `getValueText` for custom screen reader messages
- Auto-contrast for multi-segment labels unique to Mantine

**Animation Philosophy:**
- Most frameworks: single indeterminate animation style
- Nuxt UI: multiple animation styles as first-class variants
- Disable animation option rare (HeroUI, Mantine for reduced-motion)

## Raw Data References

Individual framework research reports available at:
- `ai/research/progress-bar/ant-design/usage-patterns.md`
- `ai/research/progress-bar/chakra-ui/usage-patterns.md`
- `ai/research/progress-bar/heroui/usage-patterns.md`
- `ai/research/progress-bar/mantine/usage-patterns.md`
- `ai/research/progress-bar/mui/usage-patterns.md`
- `ai/research/progress-bar/nuxt-ui/usage-patterns.md`
- `ai/research/progress-bar/primereact/usage-patterns.md`
- `ai/research/progress-bar/semantic-ui-classic/usage-patterns.md`
- `ai/research/progress-bar/vuetify/usage-patterns.md`

## Research Methodology

This descriptive research surveyed 9 modern UI frameworks' progress bar implementations through:
1. Direct documentation analysis
2. Code example extraction
3. Pattern classification (Native/Composed/CSS-only)
4. Quantitative prevalence calculation
5. Cross-framework terminology mapping

All findings represent actual implementations as of November 2025.

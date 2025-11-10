# Component Pattern Research: Timeline

> Last Modified: 2025-11-10

## Research Summary
- Frameworks surveyed: 5
- Date: 2025-11-10
- Unique patterns identified: 25

## Component Definition Consensus

Timeline components across all surveyed frameworks serve a consistent purpose: **displaying chronological sequences of events with visual markers and connectors**. The mental model is universally that of a vertical (or occasionally horizontal) chain of discrete events where each has:
- A visual indicator (dot/marker/bullet)
- Primary content (title, description)
- Optional supplementary content (timestamps, metadata)
- Connecting lines showing sequential relationships

All frameworks position Timeline as suitable for: workflow tracking, process steps, activity feeds, project milestones, event histories, and order/status tracking.

## Terminology Variations

### Component Names
- "Timeline" - Universal (5/5 frameworks)

### Subcomponent Names
- "Timeline.Item" (Ant Design, Mantine) = "TimelineItem" (MUI) = items array (Ant Design modern, Nuxt UI, PrimeReact)
- "TimelineDot" (MUI) = "bullet" prop (Mantine) = "dot" prop (Ant Design) = "marker" prop (PrimeReact) = "icon/avatar" prop (Nuxt UI)
- "TimelineConnector" (MUI) = connecting line (implicit in all others)

### Layout Terminology
- "mode" (Ant Design) = "align" (MUI, PrimeReact, Nuxt UI)
- "alternate" (Ant Design, MUI, PrimeReact, Nuxt UI) = not supported (Mantine)
- "orientation" (Nuxt UI) = "layout" (PrimeReact) = vertical-only default (others)

### API Patterns
- **Composition-based**: Ant Design (legacy), MUI, Mantine
- **Array-based**: Ant Design (modern), Nuxt UI, PrimeReact
- **Function props**: PrimeReact (content, marker, opposite)
- **Slot-based**: Nuxt UI (Vue slots)

## Pattern Inventory

### Content Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Text content | Display text titles and descriptions | 5/5 (100%) | Level 1 | All frameworks |
| Icon support | Custom icons in timeline markers | 5/5 (100%) | Level 1 | All frameworks |
| Custom content | Arbitrary React/Vue components in content | 5/5 (100%) | Level 1 | All frameworks |
| Timestamps | Date/time display for events | 5/5 (100%) | Level 1 | All frameworks |
| Descriptions | Multi-line detailed event information | 5/5 (100%) | Level 1 | All frameworks |
| Avatar support | User avatars as markers | 1/5 (20%) | Level 5 | Nuxt UI only |

### Type Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Vertical layout | Top-to-bottom chronological flow | 5/5 (100%) | Level 1 | All frameworks (default) |
| Horizontal layout | Left-to-right timeline progression | 2/5 (40%) | Level 3 | Nuxt UI, PrimeReact |
| Alternate layout | Zigzag left-right event positioning | 4/5 (80%) | Level 2 | Ant Design, MUI, Nuxt UI (CSS), PrimeReact |
| Left/Right alignment | Content positioned on single side | 5/5 (100%) | Level 1 | All frameworks |

### State Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Pending state | Indicates incomplete/ongoing events | 3/5 (60%) | Level 3 | Ant Design (native), MUI (composed), PrimeReact (composed) |
| Loading state | Shows loading/processing status | 3/5 (60%) | Level 3 | Ant Design (native), MUI (composed), PrimeReact (composed) |
| Error state | Visualizes errors or warnings | 3/5 (60%) | Level 3 | Ant Design (color), MUI (color), PrimeReact (marker) |
| Success state | Indicates completed/successful events | 4/5 (80%) | Level 2 | Ant Design, Mantine, MUI, PrimeReact |
| Active/Progress tracking | Highlights current or completed items | 3/5 (60%) | Level 3 | Ant Design (pending), Mantine (active prop), Nuxt UI (v-model) |

### Variation Patterns
| Pattern | Description | Prevalence | Usage Level | Frameworks |
|---------|-------------|------------|-------------|------------|
| Color options | Semantic or theme-based colors | 5/5 (100%) | Level 1 | All frameworks |
| Dot/Marker variants | Customizable indicator styles | 5/5 (100%) | Level 1 | All frameworks |
| Connector styles | Line style customization (solid/dashed) | 2/5 (40%) | Level 3 | Mantine (native), PrimeReact (CSS), others CSS-only |
| Size options | Predefined size variations | 2/5 (40%) | Level 3 | Mantine (bulletSize/lineWidth), Nuxt UI (9 sizes) |
| Position control | Layout and alignment control | 5/5 (100%) | Level 1 | All frameworks |
| Reverse ordering | Reverse chronological display | 2/5 (40%) | Level 3 | Ant Design (reverse prop), Nuxt UI (reverse prop) |

## Notable Patterns

### Highly Adopted (Level 1 - Universal 90%+)
These patterns represent clear consensus across the UI framework ecosystem:

- **Text content with flexible composition**: All frameworks support rich text content with full HTML/component composition
- **Icon markers**: Universal support for custom icons in timeline indicators, though implementation varies (prop-based vs composed)
- **Custom content flexibility**: Complete freedom to render arbitrary components in timeline content areas
- **Timestamps and descriptions**: Universal pattern of pairing events with temporal metadata
- **Vertical layout as default**: All frameworks default to vertical chronological flow
- **Color theming**: Semantic color support integrated with framework theme systems
- **Customizable markers**: All frameworks allow full customization of the visual indicator
- **Position/Alignment control**: Universal support for controlling where content appears relative to the timeline line

### Emerging Patterns (Level 2-3 - Common to Moderate 40-89%)
These patterns show moderate adoption, suggesting evolving best practices:

- **Alternate layout (80%, Level 2)**: Strong adoption of zigzag/alternating layouts for visual balance, except Mantine
- **Success state indication (80%, Level 2)**: Most frameworks provide ways to show completion/success status
- **Pending/Loading/Error states (60%, Level 3)**: Three-fifths of frameworks support workflow status indicators, though implementation varies (native vs composed)
- **Active item tracking (60%, Level 3)**: Several frameworks track which timeline item is current/active
- **Horizontal layout (40%, Level 3)**: Limited adoption; only Nuxt UI and PrimeReact support native horizontal timelines
- **Connector style control (40%, Level 3)**: Some frameworks allow solid/dashed line variations
- **Size variations (40%, Level 3)**: Mixed support for predefined size options
- **Reverse ordering (40%, Level 3)**: Some frameworks allow chronological reversal

### Unique Innovations (Level 5 - Rare <20%)
Framework-specific features potentially ahead of the curve:

- **Avatar markers (Nuxt UI)**: Native avatar integration as timeline indicators, not just icons
- **v-model active state (Nuxt UI)**: Reactive two-way binding for active item tracking
- **Opposite content pattern (MUI, PrimeReact)**: Dedicated API for displaying supplementary content on the opposite side of the timeline
- **Modern items array API (Ant Design v5.2.0+)**: Shift from composition to array-based configuration for performance
- **Nine size increments (Nuxt UI)**: Extremely granular size control (3xs to 3xl)
- **Dynamic slot naming (Nuxt UI)**: Per-item slot customization via slot property
- **Pending prop customization (Ant Design)**: Ghost node with custom content and loading indicator

## Pattern Correlations

### Strong Positive Correlations
When these patterns appear, related patterns often follow:

- **Alternate layout → Left/Right positioning**: When frameworks support alternate (4/4 also support explicit left/right)
- **Horizontal layout → Alternate support**: Both horizontal-supporting frameworks (Nuxt UI, PrimeReact) also support alternate
- **Array-based API → Size variations**: Frameworks using items arrays (Ant Design modern, Nuxt UI) more likely to have size props
- **State support → Color semantics**: Frameworks with pending/error/success states (3/3) use semantic color mapping
- **Custom markers → Theme integration**: All frameworks (5/5) with custom markers integrate with their theme systems

### Implementation Philosophy Clusters

**Composition-First Frameworks** (MUI, Mantine):
- Deep component nesting (Timeline > Item > Separator > Dot > Connector)
- Granular control over visual structure
- More verbose but maximally flexible
- Limited native state support (favor composition)

**Configuration-First Frameworks** (Ant Design modern, Nuxt UI, PrimeReact):
- Items as data arrays
- Function props or templates for rendering
- More concise usage patterns
- Better TypeScript/tooling support
- Native state management props

**Hybrid Approach** (Ant Design):
- Supports both legacy composition and modern array API
- Backward compatibility while evolving toward configuration
- Demonstrates ecosystem migration pattern

## Implementation Notes

### API Design Patterns

**Marker Customization Approaches:**
1. **Prop-based** (Ant Design: `dot`, Mantine: `bullet`, Nuxt UI: `icon`/`avatar`)
2. **Composed subcomponent** (MUI: `<TimelineDot>`)
3. **Function prop** (PrimeReact: `marker={(item) => JSX}`)
4. **Slot-based** (Nuxt UI: `#custom-indicator`)

**Content Structure Approaches:**
1. **Children composition** (MUI, Mantine, Ant Design legacy)
2. **Items array with properties** (Ant Design modern, Nuxt UI)
3. **Function prop templates** (PrimeReact)
4. **Slot-based templating** (Nuxt UI)

**Layout Control Approaches:**
1. **mode prop** (Ant Design: `left`/`right`/`alternate`)
2. **align prop** (MUI, PrimeReact: `left`/`right`/`alternate`)
3. **orientation + align** (Nuxt UI: `orientation="horizontal"` + `align="left"`)
4. **layout + align** (PrimeReact: `layout="horizontal"` + `align="top"`)

### Naming Conventions

**Component naming:**
- PascalCase subcomponents: `Timeline.Item` (React frameworks)
- Prefix patterns: `UTimeline` (Nuxt UI with framework prefix)

**Prop naming:**
- `mode` vs `align` for positioning (split evenly)
- `orientation` vs `layout` for direction (2 frameworks each)
- `color` universal for semantic colors
- `pending` vs `active` vs `v-model` for state tracking

**Value conventions:**
- `left`/`right`/`alternate` for positioning (universal where supported)
- `vertical`/`horizontal` for orientation (universal where supported)
- `primary`/`secondary`/`success`/`error` for semantic colors (mostly consistent)
- `solid`/`dashed`/`outlined` for visual styles (where supported)

### TypeScript Support

All frameworks surveyed provide TypeScript types:
- **Ant Design**: `TimelineItemProps` interface, backward-compatible types
- **Mantine**: Full prop typing with strict composition rules
- **MUI**: Comprehensive types for all subcomponents
- **Nuxt UI**: Vue 3 + TypeScript with composables
- **PrimeReact**: Function prop types for template rendering

### Accessibility Patterns

- **Semantic HTML**: PrimeReact uses `<ol>` elements; others use divs with ARIA
- **List semantics**: Timeline represents ordered sequences (chronological/logical)
- **Keyboard navigation**: Not required (passive display component)
- **Screen reader support**: Proper labeling and structure in all frameworks

### Styling Approaches

1. **CSS-in-JS** (MUI, Ant Design): Theme integration via styled components
2. **CSS Modules** (Mantine): Styles API with CSS variables
3. **Utility-first** (Nuxt UI): Tailwind CSS classes
4. **Traditional CSS** (PrimeReact): CSS classes with theming system

## Raw Data

Individual framework research reports are stored in:
- `ai/research/timeline/ant-design/usage-patterns.md`
- `ai/research/timeline/mantine/usage-patterns.md`
- `ai/research/timeline/mui/usage-patterns.md`
- `ai/research/timeline/nuxt-ui/usage-patterns.md`
- `ai/research/timeline/primereact/usage-patterns.md`

URL verification and research tracking:
- `ai/research/timeline/url-verification.md`

## Key Insights for Implementation

### Essential Patterns (Must Have)
Based on Level 1 universal adoption:
- Vertical layout with visual markers and connectors
- Text content with full composition support
- Icon/custom marker support
- Timestamp and description capabilities
- Color theming integration
- Left/Right position control

### Recommended Patterns (Should Have)
Based on Level 2 strong adoption (70-89%):
- Alternate/zigzag layout mode
- Success state indication

### Optional Patterns (Nice to Have)
Based on Level 3 moderate adoption (40-69%):
- Pending/Loading/Error state support
- Active item tracking/highlighting
- Horizontal orientation
- Connector style variations (solid/dashed)
- Size variation options
- Reverse chronological ordering

### Innovative Patterns (Differentiation)
Based on Level 5 unique implementations:
- Avatar integration as markers
- Reactive state binding (v-model pattern)
- Opposite content dedicated API
- Dynamic slot naming for per-item customization
- Granular size control (9+ sizes)

## Pattern Decision Framework

When implementing Timeline for Semantic UI:

1. **API Style Decision**: Choose between composition-first (more flexible, verbose) vs configuration-first (more concise, data-driven)

2. **State Management**: Decide on native state support vs composition-only approach based on primary use cases

3. **Layout Flexibility**: Determine whether horizontal orientation is a requirement based on target use cases

4. **Marker Customization**: Select prop-based, slot-based, or subcomponent approach based on framework patterns

5. **Content Structure**: Align with Vue/React component patterns in Semantic UI ecosystem

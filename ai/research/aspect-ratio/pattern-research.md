# Component Pattern Research: Aspect Ratio

> Last Modified: 2025-11-05
> Last Reviewed: 2025-11-06 (by Agent - E&O verification)

## Research Summary
- Frameworks surveyed: 4
- Date: 2025-11-05
- Unique patterns identified: 15+

## Component Definition Consensus

Aspect Ratio components maintain consistent width-to-height proportions for content, preventing layout shifts and ensuring visual consistency. Universal mental model: "container that enforces dimensional proportions."

**Primary Purpose:** Constrain content to maintain a specific aspect ratio regardless of container size, commonly used for responsive media (images, videos, embeds) to prevent layout shifts and content distortion.

**Mental Model:** A wrapper container that enforces a proportional relationship between width and height, automatically scaling content while maintaining the specified ratio.

**Semantic meaning:** Represents dimensional consistency and proportional scaling, communicating that wrapped content maintains a specific width-to-height relationship across all viewport sizes.

## Terminology Variations

- **Aspect Ratio** (4 frameworks) = ShadCN, Chakra UI, Radix UI, Mantine
- **AspectRatio** (4 frameworks) = All use single-word component naming

Note: Aspect Ratio is a specialized layout utility not universally provided across all UI frameworks. Only frameworks with comprehensive layout component systems typically include it.

## Pattern Inventory

### Content Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Image content | Images maintaining aspect ratio | 4/4 (100%) | **Level 1: Universal** | All | Composed |
| Video embeds | YouTube/Vimeo iframe embedding | 4/4 (100%) | **Level 1: Universal** | All | Composed |
| Map embeds | Google Maps iframe embedding | 2/4 (50%) | **Level 3: Frequent** | Chakra UI, Mantine | Composed |
| Custom content | Any child content type supported | 4/4 (100%) | **Level 1: Universal** | All | Composed |
| Text content | Text or React elements as children | 4/4 (100%) | **Level 1: Universal** | All | Composed |

### API Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Ratio prop | Numeric ratio value (e.g., 16/9) | 4/4 (100%) | **Level 1: Universal** | All | Native |
| Mathematical expression | Division syntax (16/9, 1080/720) | 4/4 (100%) | **Level 1: Universal** | All | Native |
| Default ratio | Fallback when ratio not specified | 2/4 (50%) | **Level 3: Frequent** | ShadCN, Radix UI | Native |
| Preset ratio tokens | Named ratio values (square, wide, etc.) | 1/4 (25%) | **Level 4: Occasional** | Chakra UI (v3) | Native |
| Responsive ratios | Different ratios per breakpoint | 1/4 (25%) | **Level 4: Occasional** | Chakra UI | Native |

### Composition Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Children composition | Content passed as children | 4/4 (100%) | **Level 1: Universal** | All | Composed |
| asChild prop | Merge props with child element | 2/4 (50%) | **Level 3: Frequent** | ShadCN, Radix UI | Native |
| Single root component | No sub-components | 4/4 (100%) | **Level 1: Universal** | All | Native |
| Zero config children | Children auto-fill container | 4/4 (100%) | **Level 1: Universal** | All | Native |

### Styling Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Unstyled/headless | No default styling | 2/4 (50%) | **Level 3: Frequent** | ShadCN, Radix UI | Native |
| CSS class support | className prop for custom styles | 4/4 (100%) | **Level 1: Universal** | All | Native |
| Style props system | Framework-specific style utilities | 2/4 (50%) | **Level 3: Frequent** | Chakra UI, Mantine | Native |
| Tailwind integration | Direct Tailwind class usage | 1/4 (25%) | **Level 4: Occasional** | ShadCN | CSS-only |
| Object-fit control | Control how content fills ratio | 4/4 (100%) | **Level 1: Universal** | All | CSS-only (on children) |

### Constraint Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Max-width constraint | Limit maximum container width | 2/4 (50%) | **Level 3: Frequent** | Chakra UI, Mantine | Native |
| Width control | Explicit width setting | 2/4 (50%) | **Level 3: Frequent** | Chakra UI, Mantine | Native |
| Margin/spacing | Built-in spacing utilities | 2/4 (50%) | **Level 3: Frequent** | Chakra UI, Mantine | Native |
| Flex integration | Behavior in flex containers | 1/4 (25%) | **Level 4: Occasional** | Mantine | Native |

### Layout Context Patterns

| Pattern | Description | Prevalence | Usage Level | Frameworks | Support Type |
|---------|-------------|------------|-------------|------------|--------------|
| Regular containers | Works in standard block contexts | 4/4 (100%) | **Level 1: Universal** | All | Native |
| Flex containers | Special handling for flex contexts | 1/4 (25%) | **Level 4: Occasional** | Mantine | Native |
| Responsive scaling | Auto-scales with container | 4/4 (100%) | **Level 1: Universal** | All | Native |

## Notable Patterns

### Universal (100%)
- Single `ratio` prop accepting numeric values
- Mathematical expression support (16/9, 4/3)
- Children composition pattern
- Image content support
- Custom content flexibility
- CSS class customization
- Responsive by default

### Common Ratio Values
All frameworks demonstrate these common aspect ratios:
- **16/9** (1.777...): Widescreen video, modern displays
- **4/3** (1.333...): Classic TV, standard photos
- **1/1** (1.0): Perfect square, avatars
- **21/9** (2.333...): Ultrawide, cinema
- **3/2** (1.5): Classic photography
- **1.618/1**: Golden ratio (Chakra UI v3)

## Feature Comparison Matrix

| Feature                 | Chakra UI | Mantine | Radix UI | Shadcn | Notes                               |
|-------------------------|:---------:|:-------:|:--------:|:------:|-------------------------------------|
| **Core**                |           |         |          |        |                                     |
| `<AspectRatio>` Component | ✅        | ✅      | ✅       | ✅     | Universal component name            |
| `ratio` Prop            | ✅        | ✅      | ✅       | ✅     | Universal support for numeric ratio |
| **Composition**         |           |         |          |        |                                     |
| `asChild` Prop          | ❌        | ❌      | ✅       | ✅     | Headless framework feature          |
| **Sizing & Constraints**  |           |         |          |        |                                     |
| `max-width` Prop        | ✅        | ✅      | ❌       | ❌     | `maxW` (Chakra), `maw` (Mantine)    |
| `width` Prop            | ✅        | ✅      | ❌       | ❌     | `w` (Chakra), `w` (Mantine)         |
| Spacing Props (`m`, `p`)  | ✅        | ✅      | ❌       | ❌     | Part of style system integration    |
| **Styling**             |           |         |          |        |                                     |
| Style Prop System       | ✅        | ✅      | ❌       | ❌     | Chakra & Mantine specific           |
| Unstyled / Headless     | ❌        | ❌      | ✅       | ✅     | Radix & Shadcn philosophy           |

### Architectural Approaches

**Headless Primitive (Radix UI, ShadCN):**
- Zero default styling
- Minimal API (ratio, asChild only)
- Maximum flexibility
- Copy-paste approach (ShadCN)
- Tiny bundle size (1.71 kB)

**Style System Integration (Chakra UI, Mantine):**
- Framework style props
- Theme integration
- Built-in spacing/sizing utilities
- Responsive value support (Chakra)
- Preset token system (Chakra v3)

### Implementation Methods

**CSS-Based Ratio Enforcement:**
All frameworks use CSS-based techniques:
- Modern: Native CSS `aspect-ratio` property
- Fallback: Padding-bottom percentage trick
- No JavaScript calculations needed
- Automatic responsive behavior

### ShadCN Specializations
- Based on Radix UI v1.1.7
- Copy-paste component model
- Primary example: Next.js Image integration
- Tailwind-first styling approach
- Dark mode via Tailwind variants
- Minimal documentation, defers to Radix

### Chakra UI Specializations
- Preset ratio tokens (v3): square, landscape, portrait, wide, ultrawide, golden
- Responsive ratios via ResponsiveValue<number>
- Part of @chakra-ui/layout package
- v2 has more detailed documentation than v3
- maxW prop for width constraints
- Full Chakra Box prop support

### Radix UI Specializations
- Purest headless primitive (1.71 kB gzipped)
- Only 2 props: ratio, asChild
- Framework-agnostic styling
- Single responsibility design
- GitHub source available
- Live documentation demos
- Comprehensive examples (CSS, Tailwind)

### Mantine Specializations
- Flex container awareness (documented edge case)
- `maw` (max-width) Mantine prop
- Full style props system integration
- Theme-based spacing values
- TypeScript in @mantine/core
- Live interactive examples
- Version 8.3.6

## Implementation Notes

### Installation

**ShadCN:**
```bash
pnpm dlx shadcn@latest add aspect-ratio
```
- Copies component to project
- Includes Radix UI dependency

**Chakra UI:**
```jsx
import { AspectRatio } from '@chakra-ui/react'
```
- Package: @chakra-ui/layout (v2)
- Part of main bundle

**Radix UI:**
```bash
npm install @radix-ui/react-aspect-ratio
```
- Standalone primitive package
- Version 1.1.7

**Mantine:**
```jsx
import { AspectRatio } from '@mantine/core'
```
- Part of @mantine/core
- Version 8.3.6

### Basic Usage Comparison

**ShadCN:**
```jsx
<AspectRatio ratio={16 / 9} className="bg-muted">
  <Image src="..." alt="..." fill />
</AspectRatio>
```

**Chakra UI:**
```jsx
<AspectRatio ratio={16/9} maxW='560px'>
  <iframe src="..." />
</AspectRatio>
```

**Radix UI:**
```jsx
<AspectRatio.Root ratio={16 / 9}>
  <img src="..." alt="..." />
</AspectRatio.Root>
```

**Mantine:**
```jsx
<AspectRatio ratio={16/9} maw={300} mx="auto">
  <img src="..." alt="..." />
</AspectRatio>
```

### Styling Approach Comparison

**Headless (Radix, ShadCN):**
- No opinions on styling
- className for all customization
- Container and children styled separately
- Tailwind/CSS Modules/CSS-in-JS agnostic

**Style Props (Chakra, Mantine):**
- Framework-specific utilities
- maxW/maw for max-width
- mx/my for margins
- Responsive value objects (Chakra)
- Theme token integration

### Children Handling

All frameworks:
- Children automatically fill aspect ratio container
- No special props needed on children
- object-fit controlled via CSS on child elements
- Standard React children composition

### Edge Cases

**Flex Containers (Mantine):**
Explicitly documented behavior requiring `flex` or `width` props:
```jsx
<div style={{ display: 'flex' }}>
  <AspectRatio ratio={1} flex="0 0 100px">
    <Image src="..." />
  </AspectRatio>
</div>
```

**Responsive Ratios (Chakra UI):**
Different ratios at different breakpoints:
```jsx
<AspectRatio ratio={{ base: 1, md: 16/9, lg: 21/9 }}>
  {/* content */}
</AspectRatio>
```

## Accessibility Considerations

### Common Patterns Across Frameworks

**Semantic Child Responsibility:**
- Container doesn't add ARIA attributes
- Accessibility handled by child content
- Images require alt text
- Iframes require title attributes

**Example:**
```jsx
<AspectRatio ratio={16/9}>
  <iframe
    src="..."
    title="Descriptive title"  // Required for a11y
  />
</AspectRatio>

<AspectRatio ratio={4/3}>
  <img
    src="..."
    alt="Descriptive text"  // Required for a11y
  />
</AspectRatio>
```

### No Built-in Accessibility Features
All frameworks document that:
- Component is a layout utility
- Does not add interactive behavior
- Does not require keyboard navigation
- Screen reader support via semantic children
- ARIA props pass through to underlying element

## Design Philosophy Differences

### Radix UI / ShadCN
- **Philosophy**: Headless, unstyled primitives
- **Approach**: Minimal API, maximum flexibility
- **Styling**: Completely external (CSS/Tailwind)
- **Bundle**: Tiny (1.71 kB)
- **Audience**: Design system builders

### Chakra UI
- **Philosophy**: Complete component system
- **Approach**: Style props integration
- **Styling**: Theme-based with responsive values
- **Bundle**: Part of larger ecosystem
- **Audience**: Rapid application development

### Mantine
- **Philosophy**: Full-featured component library
- **Approach**: Style system with edge case handling
- **Styling**: Mantine style props + CSS-in-JS
- **Bundle**: Part of core package
- **Audience**: Modern React applications

## Limited Ecosystem Observation

Aspect Ratio components are specialized layout utilities not provided by all UI frameworks. They are typically found in:
- Comprehensive component libraries
- Layout-focused frameworks
- Modern React ecosystems
- Frameworks with responsive design emphasis

Many simpler frameworks expect developers to handle aspect ratios via CSS directly.

## Use Case Consensus

All frameworks emphasize these primary use cases:
1. **Responsive images** - Prevent layout shift during load
2. **Video embeds** - YouTube, Vimeo, etc. in 16:9
3. **Map embeds** - Google Maps, Mapbox
4. **Card thumbnails** - Consistent image areas in lists
5. **Avatar containers** - Square (1:1) profile images
6. **Media galleries** - Uniform dimensions across items

## Raw Data

- [ShadCN](./shadcn/usage-patterns.md)
- [Chakra UI](./chakra-ui/usage-patterns.md)
- [Radix UI](./radix-ui/usage-patterns.md)
- [Mantine](./mantine/usage-patterns.md)

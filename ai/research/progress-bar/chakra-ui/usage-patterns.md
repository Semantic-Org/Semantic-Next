# Chakra UI - Progress Bar Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://www.chakra-ui.com/docs/components/progress
Status: ✅ Working
Version: Current (Chakra UI v3.28.1 with compound component API)
Last Verified: 2025-11-05

## Documentation Quality
Good - Clear examples with compositional patterns, though detailed prop documentation requires referencing v2 docs for comprehensive API details. V3 introduces breaking changes with compound component structure.

## Component Definition
- **Core purpose**: Displays the progress status for a task, providing visual feedback for operation completion. Supports both determinate progress (with specific values) and indeterminate loading states.
- **Mental model**: A horizontal bar that progressively fills from left to right to indicate task completion. In v3, uses a compound component pattern (Root/Track/Range) for greater compositional flexibility compared to v2's single-component approach.
- **Semantic meaning**: Communicates ongoing operation status to users, reduces perceived wait time, and provides visual confirmation that the system is actively processing. Automatically includes accessibility attributes (role="progressbar", aria-valuenow) for assistive technologies.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `value={50}`)
- **Composed**: Via composition/children (e.g., `<Component>{content}</Component>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | Progress.Label component for descriptive text labels |
| Label support | ✅ | Composed | Progress.Label as separate component in v3 compound structure |
| Value display | ✅ | Composed | Progress.ValueText component for displaying percentage/numeric values |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Linear/Bar | ✅ | Native | Primary Progress component is horizontal bar; Track/Range structure |
| Circular | ✅ | Native | Separate Progress Circle component (different component entirely) |
| Determinate | ✅ | Native | Via `value` prop (0-100 range with min/max customization) |
| Indeterminate | ✅ | Native | Set `value` to `null` or omit for animated loading state |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ✅ | Native | Primary use case with indeterminate state (value=null) |
| Success | ❌ | CSS-only | Achieved through `colorPalette` prop (e.g., "green") with manual state management |
| Error | ❌ | CSS-only | Achieved through `colorPalette` prop (e.g., "red") with manual state management |
| Disabled | ❌ | CSS-only | No explicit disabled prop; would require custom styling/opacity |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size` prop: "xs", "sm", "md" (default), "lg" |
| Color options | ✅ | Native | `colorPalette` prop (v3) / `colorScheme` (v2): "whiteAlpha", "blackAlpha", "gray", "red", "orange", "yellow", "green", "teal", "blue" (default), "cyan", "purple", "pink" |
| Striped/Animated | ✅ | Native | `striped` prop (v3) / `hasStripe` (v2) adds diagonal stripes; `animated` (v3) / `isAnimated` (v2) animates the stripes |
| Min/Max values | ✅ | Native | `min` prop (default: 0), `max` prop (default: 100) for custom ranges |

## Code Examples
```jsx
// V3 API - Basic Progress (Compound Components)
import { Progress } from "@chakra-ui/react"

<Progress.Root value={80}>
  <Progress.Track>
    <Progress.Range />
  </Progress.Track>
</Progress.Root>

// V3 - With Label and Value Text
<Progress.Root value={75}>
  <Progress.Label>Loading...</Progress.Label>
  <Progress.ValueText />
  <Progress.Track>
    <Progress.Range />
  </Progress.Track>
</Progress.Root>

// V3 - Size Variations
<Progress.Root size="xs" value={20}>
  <Progress.Track>
    <Progress.Range />
  </Progress.Track>
</Progress.Root>

<Progress.Root size="lg" value={60}>
  <Progress.Track>
    <Progress.Range />
  </Progress.Track>
</Progress.Root>

// V3 - Color Customization
<Progress.Root value={40} colorPalette="green">
  <Progress.Track>
    <Progress.Range />
  </Progress.Track>
</Progress.Root>

// V3 - Indeterminate State (Loading)
<Progress.Root value={null}>
  <Progress.Track>
    <Progress.Range />
  </Progress.Track>
</Progress.Root>

// V3 - Striped Progress
<Progress.Root value={64} striped>
  <Progress.Track>
    <Progress.Range />
  </Progress.Track>
</Progress.Root>

// V3 - Animated Stripes
<Progress.Root value={64} striped animated>
  <Progress.Track>
    <Progress.Range />
  </Progress.Track>
</Progress.Root>

// V3 - Custom Min/Max Range
<Progress.Root value={50} min={0} max={200}>
  <Progress.Track>
    <Progress.Range />
  </Progress.Track>
</Progress.Root>

// V2 API - Basic Progress (for comparison)
<Progress value={80} />

// V2 - Striped with Animation
<Progress hasStripe isAnimated value={64} />

// V2 - Size Variations
<Progress colorScheme='green' size='sm' value={20} />
<Progress colorScheme='green' size='md' value={20} />
<Progress colorScheme='green' size='lg' value={20} />
<Progress colorScheme='green' height='32px' value={20} />

// V2 - Indeterminate
<Progress size='xs' isIndeterminate />
```
[View Live](https://www.chakra-ui.com/docs/components/progress)

## Notable Features
- **Compound component architecture (v3)**: Breaking change from v2's single-component approach to compositional Root/Track/Range/Label/ValueText structure, providing greater flexibility and explicit composition
- **Migration path**: V2 to V3 involves prop renames (`hasStripe` → `striped`, `isAnimated` → `animated`, `colorScheme` → `colorPalette`) and restructuring to compound components
- **Built-in accessibility**: Automatically includes `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` attributes
- **Flexible range**: Customizable min/max values beyond standard 0-100 range
- **Striped animation**: Optional diagonal stripe pattern with CSS animation capability
- **Custom height support**: Beyond preset sizes, accepts standard style props (v2 `height` prop, v3 style customization)
- **Indeterminate by omission**: Setting value to null triggers indeterminate state (cleaner API than explicit boolean flag)
- **Theme integration**: Full integration with Chakra UI's theme system and design tokens
- **Separate circular variant**: Progress Circle is a distinct component (not a variant prop), similar to MUI's approach
- **Screen reader support**: Percentage information automatically exposed to assistive technologies

## Research Notes
- Chakra UI v3 represents a significant architectural shift with compound components, making direct migration from v2 non-trivial
- Documentation for v3 is developing; v2 documentation at https://v2.chakra-ui.com/docs/components/progress/props provides more comprehensive prop tables
- The compound component pattern (Root/Track/Range) offers more compositional control but requires more boilerplate than v2's single-component approach
- No built-in success/error/disabled states - these are achieved through color customization and manual state management
- The component follows Chakra's design philosophy of composability over monolithic components
- Striped animation uses CSS gradients and keyframe animations for performance
- Built on Ark UI's progress-linear component as the underlying primitive
- Uses CSS custom properties for theming, enabling runtime theme switching
- Unlike some libraries, Chakra separates linear and circular progress into different components rather than using a type/variant prop
- The indeterminate state implementation is cleaner than many frameworks (value=null vs isIndeterminate boolean)

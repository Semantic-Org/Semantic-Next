# Chakra UI - Progress Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://chakra-ui.com/docs/components/progress
Status: ✅ Working
Version: Latest (v3+)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Well-structured with interactive examples, clear API documentation, and multiple variations. Documentation includes both Progress and Progress Circle components with detailed composition patterns.

## Component Definition
- **Core purpose**: Display the progress status of a task, process, or operation through visual indicators (linear bars or circular gauges)
- **Mental model**: A composed component system where Progress.Root wraps Track and Range sub-components, allowing granular control over structure and styling
- **Semantic meaning**: Communicates task completion percentage to users, reducing uncertainty during long-running operations and providing clear feedback about work in progress

## Pattern Support Levels
- **Native**: Dedicated props on root component (e.g., `defaultValue={40}`, `striped`, `animated`, `colorPalette="teal"`)
- **Composed**: Via component composition with sub-components (e.g., `<Progress.Root>`, `<Progress.Track>`, `<Progress.Range>`, `<Progress.Label>`, `<Progress.ValueText>`)
- **CSS-only**: Via Chakra's theming system and CSS variables for customization

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | `<Progress.Label>` and `<Progress.ValueText>` sub-components for labels and percentage display |
| Icon support | ❌ | N/A | Not directly supported; can be composed via wrapping components |
| Custom content | ✅ | Composed | Can wrap Progress in containers with custom HTML/React elements alongside Track and Range |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Linear/Bar | ✅ | Native | Default Progress component with horizontal bars via `<Progress.Track>` and `<Progress.Range>` |
| Circular | ✅ | Native | Dedicated `<ProgressCircle>` component with circular variants using SVG-based rendering |
| Dashboard/Arc | ❌ | N/A | Arc variants not explicitly documented in standard component set |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Indeterminate | ✅ | Native | Set `value` prop to `null` or omit it to show indeterminate animated state |
| Success state | ✅ | Native | Use `colorPalette="green"` or custom colors; no explicit success class |
| Error state | ✅ | Native | Use `colorPalette="red"` for error states; requires color management via props |
| Active/animating | ✅ | Native | `animated` prop enables smooth animations on indeterminate and striped progress bars |
| Striped | ✅ | Native | `striped` prop adds striped pattern to progress bar |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size` prop with options: "xs", "sm", "md", "lg", "xl" for both linear and circular |
| Color options | ✅ | Native | `colorPalette` prop with semantic colors (teal, blue, red, green, purple, etc.) |
| Percentage display | ✅ | Composed | `<Progress.ValueText>` component displays percentage; value derived from `defaultValue` or `value` prop |
| Striped pattern | ✅ | Native | `striped` boolean prop adds diagonal stripe pattern |
| Track customization | ✅ | Composed | `<Progress.Track>` accepts flex and layout props for responsive sizing |

## Code Examples

### Basic Linear Progress Bar
```jsx
import { Progress } from "@chakra-ui/react"

const Demo = () => {
  return (
    <Progress.Root maxW="240px">
      <Progress.Track>
        <Progress.Range />
      </Progress.Track>
    </Progress.Root>
  )
}
```

### Progress with Default Value
```jsx
import { Progress } from "@chakra-ui/react"

const Demo = () => {
  return (
    <Progress.Root maxW="240px" defaultValue={40}>
      <Progress.Track>
        <Progress.Range />
      </Progress.Track>
    </Progress.Root>
  )
}
```

### Progress with Label and Value Text
```jsx
import { HStack, Progress } from "@chakra-ui/react"

const Demo = () => {
  return (
    <Progress.Root defaultValue={40} maxW="sm">
      <HStack gap="5">
        <Progress.Label>Usage</Progress.Label>
        <Progress.Track flex="1">
          <Progress.Range />
        </Progress.Track>
        <Progress.ValueText>40%</Progress.ValueText>
      </HStack>
    </Progress.Root>
  )
}
```

### Indeterminate Progress
```jsx
import { Progress } from "@chakra-ui/react"

const Demo = () => {
  return (
    <Progress.Root maxW="240px">
      <Progress.Track>
        <Progress.Range />
      </Progress.Track>
    </Progress.Root>
  )
}
```

### Striped and Animated Progress
```jsx
import { Progress } from "@chakra-ui/react"

const Demo = () => {
  return (
    <Progress.Root maxW="240px" striped animated>
      <Progress.Track>
        <Progress.Range />
      </Progress.Track>
    </Progress.Root>
  )
}
```

### Progress with Different Sizes
```jsx
import { Progress, Stack } from "@chakra-ui/react"

const Demo = () => {
  return (
    <Stack gap="4" maxW="240px">
      <Progress.Root size="xs" defaultValue={30}>
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
      <Progress.Root size="sm" defaultValue={50}>
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
      <Progress.Root size="md" defaultValue={70}>
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
      <Progress.Root size="lg" defaultValue={90}>
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
    </Stack>
  )
}
```

### Progress with Color Palette
```jsx
import { Progress, Stack } from "@chakra-ui/react"

const Demo = () => {
  return (
    <Stack gap="4" maxW="240px">
      <Progress.Root defaultValue={30} colorPalette="teal">
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
      <Progress.Root defaultValue={50} colorPalette="blue">
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
      <Progress.Root defaultValue={70} colorPalette="red">
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
    </Stack>
  )
}
```

### Basic Circular Progress
```jsx
import { ProgressCircle } from "@chakra-ui/react"

const Demo = () => {
  return (
    <ProgressCircle.Root value={75}>
      <ProgressCircle.Circle>
        <ProgressCircle.Track />
        <ProgressCircle.Range />
      </ProgressCircle.Circle>
    </ProgressCircle.Root>
  )
}
```

### Circular Progress with Value Text
```jsx
import { ProgressCircle } from "@chakra-ui/react"

const Demo = () => {
  return (
    <ProgressCircle.Root value={65}>
      <ProgressCircle.Circle>
        <ProgressCircle.Track />
        <ProgressCircle.Range />
      </ProgressCircle.Circle>
      <ProgressCircle.ValueText />
    </ProgressCircle.Root>
  )
}
```

### Circular Progress with Sizes
```jsx
import { For, HStack, ProgressCircle } from "@chakra-ui/react"

const Demo = () => {
  return (
    <HStack gap="10">
      <For each={["xs", "sm", "md", "lg", "xl"]}>
        {(size) => (
          <ProgressCircle.Root key={size} size={size} value={30}>
            <ProgressCircle.Circle>
              <ProgressCircle.Track />
              <ProgressCircle.Range strokeLinecap="round" />
            </ProgressCircle.Circle>
          </ProgressCircle.Root>
        )}
      </For>
    </HStack>
  )
}
```

### Circular Progress with Color
```jsx
import { ProgressCircle } from "@chakra-ui/react"

const Demo = () => {
  return (
    <ProgressCircle.Root size="sm" value={30} colorPalette="teal">
      <ProgressCircle.Circle>
        <ProgressCircle.Track />
        <ProgressCircle.Range strokeLinecap="round" />
      </ProgressCircle.Circle>
    </ProgressCircle.Root>
  )
}
```

[View Live](https://chakra-ui.com/docs/components/progress) *(Available on official documentation)*

## Notable Features

- **Composition-based architecture**: Unlike utility-first approaches, Chakra uses discrete sub-components (`Progress.Root`, `Progress.Track`, `Progress.Range`, `Progress.Label`, `Progress.ValueText`) for fine-grained control over structure and styling
- **Accessibility first**: Full ARIA support with semantic attributes (`aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label`) built into components
- **Dual progress types**: Separate components for linear (`Progress`) and circular (`ProgressCircle`) progress indicators, each optimized for their use case
- **Flexible sizing**: Multiple size options ("xs", "sm", "md", "lg", "xl") provide responsive scaling without custom CSS
- **Color palette integration**: Leverages Chakra's design tokens system with `colorPalette` prop for semantic and custom colors
- **Animation support**: `animated` prop enables smooth transitions on indeterminate states and striped patterns without JavaScript
- **SVG rendering for circles**: ProgressCircle uses SVG-based rendering (`strokeLinecap` and `strokeWidth` props available) for crisp circular indicators
- **Responsive composition**: Track component accepts flex and layout props for responsive horizontal/vertical layouts
- **Indeterminate state**: Set value to `null` or omit it entirely to show animated indeterminate progress
- **No JavaScript required**: All animations and state transitions handled via CSS; component is declarative and reactive

## Research Notes

- Documentation is accessible and well-maintained at chakra-ui.com
- Component API is composition-focused, requiring understanding of sub-component hierarchy
- Chakra UI v3+ uses modern component composition patterns (not older class-based variants)
- Version detection shows current stable release; examples use latest syntax with `.Root`, `.Track`, `.Range` pattern
- Both Progress and ProgressCircle components are part of Chakra's feedback component category
- ColorPalette system integrates with Chakra's design tokens, allowing theme-aware color customization
- No explicit success/error state classes like Semantic UI; state management is via props and color changes
- Striped pattern and animation are CSS-based and work together harmoniously
- Component builds on Ark UI foundations (ark-ui.com/docs/components/progress-linear and progress-circular)
- ValueText component automatically displays current value; label and value text are separately composable

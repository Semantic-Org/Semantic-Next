# Chakra UI - Progress Component

## Component Overview

The Chakra UI Progress component displays the progress status of a task, process, or operation through visual indicators. It provides both linear progress bars and circular progress gauges, supporting determinate progress (with specific percentage values) and indeterminate progress (ongoing activity without specific data).

**Core purpose**: Communicates task completion percentage to users, reducing uncertainty during long-running operations and providing clear feedback about work in progress.

**Architecture**: A composition-based component system where `Progress.Root` wraps `Track` and `Range` sub-components, allowing granular control over structure and styling. Separate `ProgressCircle` component provides circular variants.

**Common use cases**: File uploads, data loading, process workflows, form submission status, background task tracking, installation progress.

## Usage Patterns

### Basic Usage

The simplest Progress component requires wrapping Track and Range sub-components within Progress.Root:

```jsx
import { Progress } from "@chakra-ui/react"

// Basic indeterminate progress
<Progress.Root>
  <Progress.Track>
    <Progress.Range />
  </Progress.Track>
</Progress.Root>

// With default value (determinate)
<Progress.Root defaultValue={40}>
  <Progress.Track>
    <Progress.Range />
  </Progress.Track>
</Progress.Root>
```

### Variants/Styles

Chakra UI Progress supports multiple visual variations through props:

**Color Palette** (`colorPalette` prop):
- Default: "gray"
- Options: "teal", "blue", "red", "green", "orange", "yellow", "purple", "pink", "cyan", and all semantic colors
- Applied to the Progress.Range fill color via CSS custom properties

**Striped Pattern** (`striped` prop):
- Adds diagonal stripe pattern to the progress bar
- Boolean attribute, works with or without animation
- Example: `<Progress.Root striped>`

**Animation** (`animated` prop):
- Enables smooth animations on indeterminate and striped progress bars
- Works independently or combined with striped pattern
- CSS-based (no JavaScript animation required)
- Example: `<Progress.Root animated striped>`

### States

**Determinate Progress**:
- Fixed percentage value set via `defaultValue` or controlled via `value` prop
- Shows exact completion percentage
- Example: `<Progress.Root defaultValue={75}>`

**Indeterminate Progress**:
- No specific value (omit value prop or set to `null`)
- Shows ongoing activity without data about completion
- Animates continuously by default
- Example: `<Progress.Root>` (no value prop)

**Success State**:
- Use `colorPalette="green"` to indicate completion
- Or any positive semantic color (green, teal, blue)
- No explicit "success" class needed

**Error/Warning State**:
- Use `colorPalette="red"` for errors
- Use `colorPalette="orange"` or `colorPalette="yellow"` for warnings
- Purely visual distinction through color props

### Sizing Options

**Size Variants** (`size` prop):
- `xs` - Extra small, minimal height
- `sm` - Small, compact
- `md` - Medium (default)
- `lg` - Large, prominent
- `xl` - Extra large, prominent

Applied to both linear Progress and ProgressCircle components. Size affects track height (linear) or SVG dimensions (circular).

### Layout & Positioning

**Track Customization**:
- Track component accepts flex layout props: `flex`, `direction`, `gap`
- Responsive sizing via maxW, width props on Progress.Root
- Can be vertical or horizontal through flex direction
- Example: `<Progress.Track flex="1">`

**Composition with Labels**:
- Progress.Label component for identifying text
- Progress.ValueText for displaying percentage
- Use HStack/VStack for layout
- Example:
```jsx
<Progress.Root defaultValue={40}>
  <HStack gap="5">
    <Progress.Label>Usage</Progress.Label>
    <Progress.Track flex="1">
      <Progress.Range />
    </Progress.Track>
    <Progress.ValueText>40%</Progress.ValueText>
  </HStack>
</Progress.Root>
```

### Content & Structure

**Label Display**:
- `<Progress.Label>` component for progress description
- Example: "Download Progress", "File Upload", "Processing"
- Positioned relative to track via layout composition

**Value Formatting**:
- `<Progress.ValueText>` component displays numeric value
- Shows percentage automatically if no children specified
- Can display custom text: `<Progress.ValueText>{customValue}</Progress.ValueText>`
- Usually positioned alongside track for easy visibility

**Sub-component Hierarchy**:
```
Progress.Root (container, holds state)
├── Progress.Label (optional, description)
├── Progress.Track (required, visual bar)
│   └── Progress.Range (required, fill indicator)
└── Progress.ValueText (optional, percentage display)
```

### Interactive Features

**Dynamic Progress Updates**:
- Use controlled `value` prop to update progress programmatically
- Example: `<Progress.Root value={currentProgress}>`
- Updates trigger smooth CSS transitions

**Async Operation Integration**:
- Start with indeterminate state (no value)
- Switch to determinate with `value` prop once data available
- Example pattern:
```jsx
const [progress, setProgress] = useState(null)
return <Progress.Root value={progress}>...</Progress.Root>
```

### Animation & Transitions

**Built-in Animations**:
- Indeterminate state: Continuous left-to-right animation (1 second duration)
- `animated` prop: Enables smooth CSS transitions
- `striped` prop: Adds animated diagonal stripes
- CSS-based, no JavaScript animation required

**Transition Timing**:
- Default: 200ms transitions for value changes
- Applies to width changes in linear progress
- Smooth radius changes for circular progress

**Transition Easing**:
- Uses CSS ease-in-out for natural motion
- Linear animation for indeterminate state

### Integration Patterns

**File Upload Progress**:
```jsx
const [uploadProgress, setUploadProgress] = useState(0)

return (
  <Progress.Root value={uploadProgress}>
    <Progress.Track>
      <Progress.Range />
    </Progress.Track>
  </Progress.Root>
)
```

**Data Loading with Fallback**:
```jsx
const [isLoading, setIsLoading] = useState(true)

return (
  <Progress.Root value={isLoading ? null : 100}>
    <Progress.Track>
      <Progress.Range />
    </Progress.Track>
  </Progress.Root>
)
```

**Multi-step Process**:
```jsx
const totalSteps = 5
const completedSteps = 2
const progressPercentage = (completedSteps / totalSteps) * 100

return (
  <Progress.Root defaultValue={progressPercentage}>
    <Progress.Track>
      <Progress.Range />
    </Progress.Track>
  </Progress.Root>
)
```

### Accessibility Features

**ARIA Attributes**:
- `role="progressbar"` automatically applied to Progress.Root
- `aria-valuenow`: Current progress value
- `aria-valuemin`: Minimum value (0)
- `aria-valuemax`: Maximum value (100)
- `aria-label`: Optional accessible name for screen readers

**Keyboard Support**:
- No interactive keyboard support (read-only indicator)
- Accessible via screen readers for status announcements

**Color Contrast**:
- All color palettes meet WCAG contrast requirements
- Sufficient contrast between track and range for visibility
- Works in both light and dark modes

**Screen Reader Announcements**:
- Progress status announced via ARIA attributes
- Suitable for status regions that announce changes

## Key Properties/Props

### Progress.Root Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultValue` | `number` | `undefined` | Initial progress value (0-100). Omit for indeterminate state |
| `value` | `number` | `undefined` | Controlled progress value. Use for dynamic updates |
| `colorPalette` | `string` | `"gray"` | Color theme for the progress bar (teal, blue, red, green, orange, etc.) |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` | Size of the progress indicator |
| `striped` | `boolean` | `false` | Add diagonal stripe pattern to the bar |
| `animated` | `boolean` | `false` | Enable smooth animations on indeterminate/striped state |
| `min` | `number` | `0` | Minimum value for progress calculation |
| `max` | `number` | `100` | Maximum value for progress calculation |
| `aria-label` | `string` | `undefined` | Accessible name for the progress bar |
| `aria-labelledby` | `string` | `undefined` | ID of element that labels the progress |

### Progress.Track Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `flex` | `string \| number` | `undefined` | Flex value for responsive sizing (e.g., `"1"` for flex-grow: 1) |
| `width` | `string \| number` | `auto` | Fixed width of track |
| `height` | `string \| number` | `auto` | Fixed height (usually controlled by size prop) |
| `direction` | `"row" \| "column"` | `"row"` | Layout direction (row for horizontal, column for vertical) |
| `gap` | `string \| number` | `undefined` | Space between items (when used in layout) |

### Progress.Range Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `opacity` | `number` | `1` | Visual opacity of the filled area |
| `color` | `string` | Determined by `colorPalette` | Custom color override for the range |

### Progress.Label Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | `undefined` | Label text or content |
| `whiteSpace` | `string` | `"nowrap"` | Text wrapping behavior |

### Progress.ValueText Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | Auto-formatted percentage | Custom text to display instead of percentage |
| `format` | `"percent" \| "value"` | `"percent"` | How to display the value |

### ProgressCircle.Root Props (Circular Variant)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | `undefined` | Progress value (0-100) |
| `defaultValue` | `number` | `undefined` | Initial progress value |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` | Size of circular indicator |
| `colorPalette` | `string` | `"gray"` | Color theme |
| `trackColor` | `string` | Determined by palette | Track background color |
| `strokeWidth` | `number` | `2` | SVG stroke width |

### ProgressCircle.Range Props (Circular Fill)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `strokeLinecap` | `"butt" \| "round" \| "square"` | `"butt"` | SVG stroke line cap style |
| `strokeWidth` | `number` | `2` | SVG stroke width override |

## Code Examples

### Example 1: Basic Progress
```jsx
import { Progress } from "@chakra-ui/react"

export const BasicProgress = () => {
  return (
    <Progress.Root defaultValue={40} maxW="240px">
      <Progress.Track>
        <Progress.Range />
      </Progress.Track>
    </Progress.Root>
  )
}
```

### Example 2: Progress with Label and Value
```jsx
import { HStack, Progress } from "@chakra-ui/react"

export const ProgressWithLabel = () => {
  return (
    <Progress.Root defaultValue={65} maxW="sm">
      <HStack gap="5">
        <Progress.Label>Download</Progress.Label>
        <Progress.Track flex="1">
          <Progress.Range />
        </Progress.Track>
        <Progress.ValueText>65%</Progress.ValueText>
      </HStack>
    </Progress.Root>
  )
}
```

### Example 3: Indeterminate Progress
```jsx
import { Progress } from "@chakra-ui/react"

export const IndeterminateProgress = () => {
  return (
    <Progress.Root maxW="240px">
      <Progress.Track>
        <Progress.Range />
      </Progress.Track>
    </Progress.Root>
  )
}
```

### Example 4: Striped and Animated
```jsx
import { Progress } from "@chakra-ui/react"

export const StripedAnimatedProgress = () => {
  return (
    <Progress.Root
      defaultValue={45}
      maxW="240px"
      striped
      animated
    >
      <Progress.Track>
        <Progress.Range />
      </Progress.Track>
    </Progress.Root>
  )
}
```

### Example 5: Different Sizes
```jsx
import { Progress, Stack } from "@chakra-ui/react"

export const ProgressSizes = () => {
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

### Example 6: Color Variations
```jsx
import { Progress, Stack } from "@chakra-ui/react"

export const ProgressColors = () => {
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
      <Progress.Root defaultValue={70} colorPalette="green">
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
      <Progress.Root defaultValue={40} colorPalette="red">
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
    </Stack>
  )
}
```

### Example 7: Dynamic Progress with State
```jsx
import { useState } from "react"
import { Progress, Button, Stack } from "@chakra-ui/react"

export const DynamicProgress = () => {
  const [progress, setProgress] = useState(0)

  const handleStart = () => {
    setProgress(0)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 30
      })
    }, 500)
  }

  return (
    <Stack gap="4" maxW="sm">
      <Button onClick={handleStart} colorScheme="blue">
        Start Progress
      </Button>
      <Progress.Root value={progress}>
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
      <Progress.ValueText>{Math.round(progress)}%</Progress.ValueText>
    </Stack>
  )
}
```

### Example 8: Circular Progress
```jsx
import { ProgressCircle } from "@chakra-ui/react"

export const CircularProgress = () => {
  return (
    <ProgressCircle.Root value={75}>
      <ProgressCircle.Circle>
        <ProgressCircle.Track />
        <ProgressCircle.Range />
      </ProgressCircle.Circle>
      <ProgressCircle.ValueText />
    </ProgressCircle.Root>
  )
}
```

### Example 9: Circular Progress with Sizes
```jsx
import { HStack, ProgressCircle } from "@chakra-ui/react"

export const CircularProgressSizes = () => {
  return (
    <HStack gap="10">
      <ProgressCircle.Root size="xs" value={30}>
        <ProgressCircle.Circle>
          <ProgressCircle.Track />
          <ProgressCircle.Range strokeLinecap="round" />
        </ProgressCircle.Circle>
      </ProgressCircle.Root>
      <ProgressCircle.Root size="sm" value={50}>
        <ProgressCircle.Circle>
          <ProgressCircle.Track />
          <ProgressCircle.Range strokeLinecap="round" />
        </ProgressCircle.Circle>
      </ProgressCircle.Root>
      <ProgressCircle.Root size="md" value={70}>
        <ProgressCircle.Circle>
          <ProgressCircle.Track />
          <ProgressCircle.Range strokeLinecap="round" />
        </ProgressCircle.Circle>
      </ProgressCircle.Root>
      <ProgressCircle.Root size="lg" value={90}>
        <ProgressCircle.Circle>
          <ProgressCircle.Track />
          <ProgressCircle.Range strokeLinecap="round" />
        </ProgressCircle.Circle>
      </ProgressCircle.Root>
    </HStack>
  )
}
```

### Example 10: Circular with Custom Color
```jsx
import { ProgressCircle } from "@chakra-ui/react"

export const CircularProgressColor = () => {
  return (
    <ProgressCircle.Root size="md" value={65} colorPalette="teal">
      <ProgressCircle.Circle>
        <ProgressCircle.Track />
        <ProgressCircle.Range strokeLinecap="round" />
      </ProgressCircle.Circle>
      <ProgressCircle.ValueText />
    </ProgressCircle.Root>
  )
}
```

## Accessibility Notes

**ARIA Implementation**:
- Progress.Root automatically has `role="progressbar"`
- Value, min, and max automatically mapped to ARIA attributes
- Supports `aria-label` and `aria-labelledby` for accessible naming

**Screen Reader Support**:
- Current value announced via `aria-valuenow`
- Min/max range provided via ARIA attributes
- Suitable for regions marked with `aria-live` or `aria-busy`
- Progress text labels help screen reader users understand context

**Keyboard Considerations**:
- Progress is read-only, no keyboard interaction needed
- Focus can be placed on associated labels or controls
- Avoid making progress interactive (use buttons for controls instead)

**Color Accessibility**:
- Never use color alone to communicate state
- Always pair color changes with text or labels
- All color palettes meet WCAG AA contrast requirements
- Works in both light and dark modes

**Semantic HTML**:
- Uses semantic HTML with proper ARIA roles
- Supports all standard HTML attributes
- Proper heading hierarchy in adjacent labels

## Common Patterns

1. **File Upload Progress**: Show percentage and label with dynamic updates
2. **Data Loading Indication**: Use indeterminate state while loading, switch to determinate when progress data available
3. **Multi-Step Process Progress**: Calculate percentage based on completed steps (e.g., step 2 of 5 = 40%)
4. **Circular Download Indicator**: Use ProgressCircle for compact, visual feedback in limited space
5. **Color-Coded Status**: Green for success, red for error, orange for warning
6. **Animated Processing**: Use indeterminate + animated for background tasks without specific progress data
7. **Striped Determination**: Combine striped and animated for visual emphasis on important operations
8. **Responsive Layout**: Use flex props on Track for responsive sizing across different screen widths

## Related Components

- **Progress** - Linear progress bar for task status (primary component)
- **ProgressCircle** - Circular progress gauge (alternative visualization)
- **Button** - Pair with button for upload/process triggers
- **Spinner** - Use for loading states when progress data unavailable
- **Skeleton** - Use while content loads alongside progress bar
- **Alert** - Combine with alert for error/success states after completion
- **Card** - Container component for progress displays
- **HStack/VStack** - Layout components for organizing progress + labels

---

**Research completed:** 2025-11-05
**Component:** Progress
**Framework:** Chakra UI
**Documentation:** https://www.chakra-ui.com/docs/components/progress

**Notable Features:**
- Composition-based architecture with sub-components for fine-grained control
- Full ARIA support with semantic attributes for accessibility
- Dual progress types: linear Progress and circular ProgressCircle
- Flexible sizing with multiple size options
- CSS-based animations without JavaScript requirement
- SVG rendering for circular variants
- Indeterminate state support for ongoing activities

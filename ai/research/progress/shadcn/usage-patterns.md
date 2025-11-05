# ShadCN - Progress Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://ui.shadcn.com/docs/components/progress
Status: ✅ Working
Version: Current (Radix UI based)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - includes installation, API reference, code examples, and integration patterns with Radix UI documentation links.

## Component Definition
- **Core purpose**: Displays a linear progress indicator showing the completion percentage of a task. Provides visual feedback for ongoing operations and progress tracking.
- **Mental model**: Users think of Progress as a visual bar that fills from 0% to 100%, representing task completion. It's a read-only feedback component (not interactive).
- **Semantic meaning**: Communicates task completion status and expected time remaining to users. Adherence to ARIA progressbar role ensures accessibility for assistive technology.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `value={50}`)
- **Composed**: Via composition/children (e.g., custom wrapper components)
- **CSS-only**: Requires custom styling (e.g., `className="w-[60%]"`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ❌ | N/A | No native text/label support in Progress itself; add separate element |
| Icon support | ❌ | N/A | Not applicable for linear progress bars |
| Custom content | ❌ | N/A | Progress.Indicator renders only the visual fill element |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Linear/Bar | ✅ | Native | Core pattern via `<Progress value={num} />` with horizontal fill |
| Circular | ❌ | CSS-only | Not natively supported; would require custom SVG/CSS implementation |
| Dashboard/Arc | ❌ | CSS-only | Not natively supported; would require custom implementation |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Indeterminate | ✅ | Native | Via `data-state="indeterminate"` when `value` is null; indicates loading without progress |
| Success state | ❌ | CSS-only | Use `data-state="complete"` when value reaches 100%; style with custom classes |
| Error state | ❌ | CSS-only | Not built-in; implement via custom className or wrapper component |
| Active/animating | ✅ | CSS-only | Animations via CSS transitions on the Indicator element |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | CSS-only | Control height via `className="h-2"` or `className="h-4"` on Root |
| Color options | ✅ | CSS-only | Change via `className` prop using data-attributes and Tailwind utilities |
| Percentage display | ❌ | Composed | Not built-in; add text overlay or separate label element |
| Segmented/steps | ❌ | CSS-only | Not natively supported; would require custom implementation |

## Code Examples

### Basic Usage
```jsx
import { Progress } from "@/components/ui/progress"

export function ProgressDemo() {
  return <Progress value={33} />
}
```

### With Dynamic Value
```jsx
"use client"

import * as React from "react"
import { Progress } from "@/components/ui/progress"

export function ProgressWithAnimation() {
  const [progress, setProgress] = React.useState(13)

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return <Progress value={progress} className="w-[60%]" />
}
```

### With Custom Sizing
```jsx
import { Progress } from "@/components/ui/progress"

export function ProgressSizes() {
  return (
    <div className="space-y-4">
      {/* Small */}
      <Progress value={33} className="h-1" />

      {/* Default */}
      <Progress value={50} className="h-2" />

      {/* Large */}
      <Progress value={75} className="h-4" />
    </div>
  )
}
```

### With Custom Styling
```jsx
import { Progress } from "@/components/ui/progress"

export function ProgressCustom() {
  return (
    <div className="space-y-4">
      {/* Blue progress */}
      <Progress
        value={40}
        className="[&>*]:bg-blue-500"
      />

      {/* Green success state */}
      <Progress
        value={100}
        className="[&>*]:bg-green-500"
      />

      {/* Red error state */}
      <Progress
        value={60}
        className="[&>*]:bg-red-500"
      />
    </div>
  )
}
```

### Indeterminate State
```jsx
import { Progress } from "@/components/ui/progress"

export function IndeterminateProgress() {
  // When value is null, shows indeterminate state (animated without value)
  return <Progress value={null} />
}
```

### With Label
```jsx
import { Progress } from "@/components/ui/progress"

export function ProgressWithLabel() {
  const value = 65

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">Upload Progress</label>
        <span className="text-sm text-muted-foreground">{value}%</span>
      </div>
      <Progress value={value} />
    </div>
  )
}
```

### Multiple Progress Bars
```jsx
import { Progress } from "@/components/ui/progress"

export function MultipleProgress() {
  const tasks = [
    { name: "Task 1", progress: 33 },
    { name: "Task 2", progress: 66 },
    { name: "Task 3", progress: 100 },
  ]

  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <div key={task.name} className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">{task.name}</label>
            <span className="text-sm text-muted-foreground">{task.progress}%</span>
          </div>
          <Progress value={task.progress} />
        </div>
      ))}
    </div>
  )
}
```

## API Reference

### Progress.Root Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number \| null` | — | Current progress value. Use `null` for indeterminate state. |
| `max` | `number` | `100` | Maximum progress value (default 100 for percentage) |
| `getValueLabel` | `(value: number, max: number) => string` | Percentage | Custom function for accessible label text |
| `asChild` | `boolean` | `false` | Render as child element instead of div |
| `className` | `string` | — | Tailwind CSS classes for styling |

### Data Attributes

| Attribute | Values | Description |
|-----------|--------|-------------|
| `[data-state]` | `"complete" \| "indeterminate" \| "loading"` | Current progress state |
| `[data-value]` | Current value | The numeric progress value |
| `[data-max]` | Maximum value | The maximum progress value (default 100) |

### Progress.Indicator Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Merge props/behavior with passed child element |

## Component Structure

The Progress component is a wrapper around Radix UI's Progress primitives:

```jsx
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
```

## Notable Features

- **Built on Radix UI**: Leverages battle-tested accessibility primitives from Radix UI Progress
- **Transform-based animation**: Uses `transform: translateX()` for efficient CSS animations (GPU-accelerated)
- **ARIA progressbar role**: Automatically provides accessibility attributes (`aria-valuenow`, `aria-valuemin`, `aria-valuemax`)
- **Indeterminate state support**: Can display loading state without known progress percentage
- **Copy-paste model**: Like all ShadCN components, the code is copied into your project for full customization
- **Tailwind CSS integration**: Styled entirely with Tailwind utilities, no CSS files needed
- **Responsive width control**: Use Tailwind classes like `w-[60%]` to control container width

## Styling Customization

### Via className Prop
```jsx
<Progress value={50} className="h-4 [&>*]:bg-green-500" />
```

### Via CSS Variables
ShadCN uses CSS variables for theming. Modify in your global CSS:

```css
:root {
  --primary: 222.2 47.4% 11.2%;      /* Progress bar color */
  --secondary: 210 40% 96%;           /* Background color */
}

.dark {
  --primary: 210 40% 98%;
  --secondary: 217.2 32.6% 17.5%;
}
```

### Width Variants
```jsx
{/* Full width (default) */}
<Progress value={50} />

{/* Partial width */}
<Progress value={50} className="w-[60%]" />

{/* Container constrained */}
<div className="max-w-md">
  <Progress value={50} />
</div>
```

### Height Variants
```jsx
<Progress value={50} className="h-1" />    {/* Thin */}
<Progress value={50} className="h-2" />    {/* Default */}
<Progress value={50} className="h-4" />    {/* Thick */}
```

## Accessibility

### ARIA Attributes (Automatic)
- `role="progressbar"` - Identifies as progress indicator
- `aria-valuenow="50"` - Current progress value
- `aria-valuemin="0"` - Minimum value
- `aria-valuemax="100"` - Maximum value
- `aria-valuetext="50%"` - Accessible label text (customizable via `getValueLabel`)

### Screen Reader Support
```jsx
// With visible label
<div>
  <label htmlFor="upload">File Upload Progress</label>
  <Progress id="upload" value={75} />
</div>

// With aria-label
<Progress value={75} aria-label="Download progress" />

// With description
<div>
  <Progress
    value={75}
    aria-labelledby="progress-label"
    aria-describedby="progress-desc"
  />
  <div id="progress-label">File upload: 75%</div>
  <div id="progress-desc">Uploading document.pdf</div>
</div>
```

### Focus Management
- Progress bars are not interactive, so no keyboard navigation needed
- Focus remains on associated buttons (e.g., "Cancel Upload") if present

## Research Notes

- **Accessing docs**: URL is accessible and comprehensive with good integration with Radix UI documentation
- **Framework approach**: ShadCN uses copy-paste distribution model - component code is copied to your project, not installed as npm package
- **Radix UI base**: Progress is built on `@radix-ui/react-progress` primitive (2.62 kB gzipped)
- **No circular/arc support**: Radix Progress only supports linear bars natively. Circular progress would require custom SVG implementation
- **Transform for performance**: The implementation uses CSS transforms rather than width changes for better performance (GPU-accelerated)
- **Styling flexibility**: All styling done via Tailwind CSS classes; no component prop variants like size or color
- **No text labels built-in**: Text or percentage display must be added as separate elements
- **Indeterminate state**: Supported when `value` prop is null; useful for loading states where progress is unknown

## Integration Patterns

### With Loading States
```jsx
const [isLoading, setIsLoading] = React.useState(false)
const [progress, setProgress] = React.useState(0)

<Progress
  value={isLoading ? null : progress}
  aria-label={isLoading ? "Loading..." : `${progress}% complete`}
/>
```

### File Upload Progress
```jsx
<div className="space-y-2">
  <div className="flex justify-between">
    <span className="text-sm font-medium">Uploading file.pdf</span>
    <span className="text-sm text-muted-foreground">{progress}%</span>
  </div>
  <Progress value={progress} />
</div>
```

### Download Progress
```jsx
<div className="space-y-2">
  <Progress value={downloadProgress} className="h-1" />
  <p className="text-xs text-muted-foreground">
    {Math.round(downloadProgress)}% - {formatBytes(downloadedBytes)} of {formatBytes(totalBytes)}
  </p>
</div>
```

### Form Submission Progress
```jsx
const [submitProgress, setSubmitProgress] = React.useState(0)

<div className="space-y-4">
  <Progress value={submitProgress} />
  <Button disabled={isSubmitting}>
    {isSubmitting ? "Submitting..." : "Submit"}
  </Button>
</div>
```

## Limitations & Workarounds

| Limitation | Workaround |
|-----------|-----------|
| No built-in label/percentage display | Add separate `<label>` or `<span>` elements |
| No circular/arc progress | Create custom SVG component using radial progress technique |
| No striped/animated pattern | Add `animate-pulse` or custom CSS animation via className |
| No color variants prop | Use className with Tailwind utilities or data-attribute selectors |
| No step/segmented progress | Render multiple Progress components with calculated widths |
| No maximum value customization in standard usage | Pass `max` prop to Progress.Root; calculate percentages accordingly |

## Browser & Environment Support

- **React**: 16.8+ (hooks required)
- **Next.js**: Full support in App Router (component uses `"use client"`)
- **Framework**: Framework-agnostic (uses standard React/Radix UI)
- **Browsers**: All modern browsers supporting CSS transforms and flexbox
- **Accessibility**: Full ARIA support for screen readers and assistive technology
- **CSS**: Requires Tailwind CSS for styling

---

## Summary

The ShadCN Progress component provides a solid, accessible linear progress indicator built on Radix UI primitives. It's best suited for:

- **File uploads/downloads** - Track completion percentage
- **Long-running operations** - Provide visual feedback during processing
- **Loading states** - Show indeterminate progress when percentage unknown
- **Multi-step processes** - Display progress through sequential tasks

The copy-paste model means you can easily customize the styling and behavior directly in your codebase. However, for more complex progress patterns (circular, segmented, multiple tracks), you'll need to create custom implementations using SVG or additional components.

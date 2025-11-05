# HeroUI - Progress Component

## Component URL
https://www.heroui.com/docs/components/progress
Status: ✅ Working

## Documentation Quality
Excellent - Comprehensive documentation with clear examples, extensive API reference, live playground demonstrations, and practical use cases covering all major features and patterns.

## Component Definition
- **Core purpose**: Displays the advancement of any task, activity, or operation with visual progress feedback
- **Mental model**: A visual indicator showing completion percentage - users think of it as a status bar or progress bar that fills from 0% to 100%
- **Semantic meaning**: Communicates process state and completion status to users, providing visual feedback for long-running operations, file uploads, and task progression

## Usage Patterns

### Basic Usage
```jsx
import {Progress} from "@heroui/react";

export default function App() {
  return (
    <Progress aria-label="Loading..." value={60} />
  );
}
```

### Variants/Styles
| Pattern | Available | Details |
|---------|-----------|---------|
| Size options | ✅ | `sm`, `md` (default), `lg` |
| Color schemes | ✅ | `default`, `primary`, `secondary`, `success`, `warning`, `danger` |
| Radius options | ✅ | `none`, `sm`, `md`, `lg`, `full` (default) |
| Striped pattern | ✅ | `isStriped` prop for animated striped effect |
| Animation | ✅ | Enabled by default, can be disabled with `disableAnimation` |

### States
| State | Supported | Details |
|-------|-----------|---------|
| Determinate | ✅ | Standard progress with value 0-100 (or custom min/max) |
| Indeterminate | ✅ | `isIndeterminate` prop shows animated loading state without specific value |
| Disabled | ✅ | `isDisabled` prop disables interaction and visual feedback |

### Sizing Options
- **Small**: `size="sm"` - compact progress bar
- **Medium**: `size="md"` - default, balanced sizing
- **Large**: `size="lg"` - prominent progress bar with more visual impact

### Layout & Positioning
- **Label positioning**: Labels appear above progress bar by default
- **Value display**: Optional numeric value label shown on the right
- **Flex compatibility**: Works well in flex layouts and responsive designs
- **Width control**: Full-width by default, can be constrained via container width or Tailwind classes

### Content & Structure
| Element | Support | Details |
|---------|---------|---------|
| Label text | ✅ | `label` prop for descriptive text (e.g., "Loading...") |
| Value display | ✅ | `showValueLabel` prop controls numeric value display (default: true) |
| Custom label | ✅ | `valueLabel` prop overrides automatic value formatting |
| Formatting | ✅ | `formatOptions` (Intl.NumberFormat) for custom value formatting |
| Accessible labels | ✅ | `aria-label` required when label prop is not provided |

### Interactive Features
- **Dynamic value updates**: `value` prop accepts reactive/changing values for real-time progress tracking
- **Async operation support**: Indeterminate state perfect for unknown-duration operations
- **Min/Max values**: `minValue` and `maxValue` props allow custom value ranges (default: 0-100)
- **Striped animations**: `isStriped` prop adds animated stripe pattern for better visual feedback

### Animation & Transitions
- **Indeterminate animation**: Continuous smooth animation in indeterminate state
- **Striped animation**: Animated stripe pattern when `isStriped` is enabled
- **Disable animations**: `disableAnimation` prop removes all transitions for reduced-motion accessibility
- **Smooth updates**: Value changes animate smoothly from one percentage to another

### Integration Patterns
| Pattern | Example |
|---------|---------|
| File uploads | Track upload percentage in real-time |
| Form submission | Show progress through multi-step forms |
| Data loading | Display loading state while fetching data |
| Task completion | Show overall task progress with estimated time |
| Indeterminate loading | Use when duration is unknown (API calls, background tasks) |

### Accessibility Features
- **ARIA compliance**: Implements proper `progressbar` role
- **Aria attributes**: Exposes `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext`
- **Labeling**: Support for both `label` prop and `aria-label` attribute
- **Screen reader support**: Full screen reader compatibility for progress values and status
- **Internationalization**: Supports Intl.NumberFormat for locale-specific formatting
- **Reduced motion**: `disableAnimation` prop respects reduced-motion preferences
- **Built on React Aria**: Foundation ensures comprehensive accessibility compliance

## Key Properties/Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | - | Current progress value (0-100 or custom range) |
| `minValue` | `number` | `0` | Minimum progress value |
| `maxValue` | `number` | `100` | Maximum progress value |
| `label` | `ReactNode` | - | Descriptive label text displayed above progress bar |
| `aria-label` | `string` | - | Required when label prop is not provided for accessibility |
| `size` | `"sm"` \| `"md"` \| `"lg"` | `"md"` | Progress bar size |
| `color` | `"default"` \| `"primary"` \| `"secondary"` \| `"success"` \| `"warning"` \| `"danger"` | `"default"` | Color scheme |
| `radius` | `"none"` \| `"sm"` \| `"md"` \| `"lg"` \| `"full"` | `"full"` | Border radius of progress bar |
| `isIndeterminate` | `boolean` | `false` | Shows animated indeterminate state (unknown progress) |
| `isStriped` | `boolean` | `false` | Adds animated striped pattern to indicator |
| `isDisabled` | `boolean` | `false` | Disables the progress component |
| `disableAnimation` | `boolean` | `false` | Removes animation effects (respects prefers-reduced-motion) |
| `showValueLabel` | `boolean` | `true` | Shows numeric value label (percentage) |
| `valueLabel` | `ReactNode` | - | Custom text/content for value display |
| `formatOptions` | `Intl.NumberFormat` | - | Options for formatting displayed values |
| `className` | `string` | - | Additional Tailwind CSS classes |

## Code Examples

### Example 1: Basic Determinate Progress
```jsx
import {Progress} from "@heroui/react";

export default function App() {
  return (
    <Progress
      aria-label="Loading..."
      value={60}
    />
  );
}
```

### Example 2: With Label and Color
```jsx
import {Progress} from "@heroui/react";

export default function App() {
  return (
    <Progress
      label="Installing..."
      value={45}
      color="primary"
    />
  );
}
```

### Example 3: Indeterminate State
```jsx
import {Progress} from "@heroui/react";

export default function App() {
  return (
    <Progress
      label="Uploading file..."
      isIndeterminate
    />
  );
}
```

### Example 4: Striped Animated Progress
```jsx
import {Progress} from "@heroui/react";

export default function App() {
  return (
    <Progress
      label="Downloading..."
      value={75}
      isStriped
      color="success"
    />
  );
}
```

### Example 5: Custom Value Formatting
```jsx
import {Progress} from "@heroui/react";

export default function App() {
  return (
    <Progress
      label="Download speed"
      value={65}
      valueLabel="65 MB/s"
      formatOptions={{ style: "decimal", maximumFractionDigits: 1 }}
      color="warning"
    />
  );
}
```

### Example 6: Size Variations
```jsx
import {Progress} from "@heroui/react";

export default function App() {
  return (
    <div className="flex flex-col gap-4">
      <Progress size="sm" aria-label="Small progress" value={30} />
      <Progress size="md" aria-label="Medium progress" value={50} />
      <Progress size="lg" aria-label="Large progress" value={70} />
    </div>
  );
}
```

### Example 7: Color Variants
```jsx
import {Progress} from "@heroui/react";

export default function App() {
  return (
    <div className="flex flex-col gap-4">
      <Progress label="Default" color="default" value={20} />
      <Progress label="Primary" color="primary" value={40} />
      <Progress label="Secondary" color="secondary" value={60} />
      <Progress label="Success" color="success" value={80} />
      <Progress label="Warning" color="warning" value={100} />
    </div>
  );
}
```

### Example 8: Disabled State
```jsx
import {Progress} from "@heroui/react";

export default function App() {
  return (
    <Progress
      label="Operation paused"
      value={50}
      isDisabled
    />
  );
}
```

### Example 9: No Animation
```jsx
import {Progress} from "@heroui/react";

export default function App() {
  return (
    <Progress
      label="Respects reduced motion"
      value={75}
      disableAnimation
    />
  );
}
```

### Example 10: Dynamic Progress Tracking
```jsx
import {Progress} from "@heroui/react";
import {useState} from "react";

export default function App() {
  const [progress, setProgress] = useState(0);

  const handleStart = () => {
    let value = 0;
    const interval = setInterval(() => {
      value += Math.random() * 30;
      if (value >= 100) {
        value = 100;
        clearInterval(interval);
      }
      setProgress(value);
    }, 500);
  };

  return (
    <div className="flex flex-col gap-4">
      <Progress
        label="Upload progress"
        value={progress}
        color={progress === 100 ? "success" : "primary"}
      />
      <button onClick={handleStart}>Start</button>
    </div>
  );
}
```

## Accessibility Notes
- **Always provide labels**: Use either the `label` prop or `aria-label` attribute (aria-label required when label is absent)
- **Semantic roles**: Component properly implements the ARIA `progressbar` role
- **Value exposure**: All progress values are exposed via ARIA attributes for assistive technologies
- **Screen reader announcements**: Progress changes are announced with value updates
- **Respects motion preferences**: Use `disableAnimation` prop to honor prefers-reduced-motion media query
- **Percentage formatting**: Automatic localized percentage formatting via Intl.NumberFormat
- **Color accessibility**: Colors are not the only visual indicator - text labels and value display provide backup information

## Customization Options

### Slot-Based Styling
The component provides several customizable slots for advanced styling:
- `base`: Main container wrapper
- `labelWrapper`: Groups label and value text
- `label`: Label text area
- `value`: Value display area
- `track`: Background/container of the progress indicator
- `indicator`: Filled progress bar itself

### Tailwind Integration
```jsx
<Progress
  className="max-w-md"
  label="Customized"
  value={60}
/>
```

### Data Attributes
- `data-indeterminate`: Present when in indeterminate state
- `data-disabled`: Present when disabled

## Common Patterns
- **File uploads**: Show percentage complete with striped animation
- **Multi-step forms**: Display overall completion across steps
- **Background tasks**: Use indeterminate state while operation duration is unknown
- **Time-based operations**: Track progress percentage as task completes
- **Status indicators**: Combine color changes with progress value (red for errors, yellow for warnings, green for success)
- **Real-time monitoring**: Update progress dynamically as data arrives or tasks complete
- **Download/upload tracking**: Display file transfer speed and estimated completion time

## Related Components
- **Spinner**: For indefinite loading without progress tracking
- **Skeleton**: For content placeholders while loading
- **Card**: Often wraps progress elements in application layouts
- **Button**: Can trigger operations that show progress
- **Steps**: Alternative for sequential multi-step processes with explicit state

## Notes & Observations
- **React Aria Foundation**: Built on React Aria's `useProgressBar` hook ensuring accessibility compliance
- **Server Component Compatible**: Works with Next.js Server Components
- **Tailwind-First**: Leverages Tailwind CSS for styling and layout control
- **Minimal Surface Area**: Simple, focused API with sensible defaults
- **Smooth Animations**: Default animations enhance user perception of progress
- **Flexible Formatting**: Supports custom value display and internationalization
- **Production Ready**: Stable API and comprehensive documentation
- **Part of HeroUI**: Integrates seamlessly with other HeroUI components

---

Research completed: **2025-11-05**
Component: **Progress**
Framework: **HeroUI**
Documentation: https://www.heroui.com/docs/components/progress

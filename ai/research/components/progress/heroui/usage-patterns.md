# HeroUI - Progress Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://www.heroui.com/docs/components/progress
Status: ✅ Working
Version: HeroUI v2.8.0
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Excellent documentation with clear examples, complete API reference, accessibility integration, and customization options. Includes both linear progress and references to circular variant.

## Component Definition
- **Core purpose**: Visualizes the advancement of any activity with a visual indicator showing completion status. Enables users to understand progress in data loading, file uploads, form completion, or any time-bound operation.
- **Mental model**: A linear (or circular) progress indicator that shows "how much is done" as a percentage. Users think of it as a visual representation of completion status with optional text labels.
- **Semantic meaning**: Communicates task progression and completion status. Linear variant emphasizes forward motion and sequential progress. Indicates system is active and working (especially in indeterminate mode).

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `value={60}`)
- **Composed**: Via composition/children (e.g., custom content in slots)
- **CSS-only**: Requires custom styling (e.g., custom colors via classNames)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text label | ✅ | Native | `label` prop accepts ReactNode for descriptive text above progress bar |
| Value display | ✅ | Native | `showValueLabel` prop displays numeric percentage or custom `valueLabel` text |
| Custom formatting | ✅ | Native | `formatOptions` prop controls value display (currency, percentage, custom locales) |
| Icon support | ❌ | N/A | Not native, would require custom content in slots |
| Custom content | ✅ | Composed | Via `classNames` prop to customize individual slots (label, value, indicator, track) |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Linear/Bar | ✅ | Native | Default horizontal progress bar with configurable fill percentage |
| Circular | ✅ | Native (separate) | CircularProgress is a distinct component in HeroUI library |
| Dashboard/Arc | ❌ | N/A | Not shown in documentation; CircularProgress may support this |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Determinate | ✅ | Native | `value` prop (0-100) shows specific progress percentage |
| Indeterminate | ✅ | Native | `isIndeterminate` prop shows continuous animation for unknown duration operations |
| Disabled | ✅ | Native | `isDisabled` prop disables component, sets `data-disabled` attribute |
| Active/animating | ✅ | Native | Default animated fill, disable with `disableAnimation` prop |
| Striped | ✅ | Native | `isStriped` prop applies striped pattern to indicator bar |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size` prop: `sm`, `md` (default), `lg` |
| Color options | ✅ | Native | `color` prop: `default`, `primary`, `secondary`, `success`, `warning`, `danger` |
| Percentage display | ✅ | Native | `showValueLabel` controls display; `formatOptions` controls formatting |
| Custom formatting | ✅ | Native | `formatOptions` with Intl.NumberFormat API (currency, percentage, locales) |
| Border radius | ✅ | Native | `radius` prop: `none`, `sm`, `md`, `lg`, `full` (full is default) |
| Min/Max values | ✅ | Native | `minValue` and `maxValue` props customize range (default 0-100) |

## Code Examples

### Basic Usage
```jsx
import {Progress} from "@heroui/react";

export default function App() {
  return <Progress aria-label="Loading..." value={60} className="max-w-md" />;
}
```
[View Live](https://heroui.com/docs/components/progress#basic) *(if available)*

### Sizes
```jsx
import {Progress} from "@heroui/react";

export default function App() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <Progress aria-label="Loading..." size="sm" value={30} />
      <Progress aria-label="Loading..." size="md" value={40} />
      <Progress aria-label="Loading..." size="lg" value={50} />
    </div>
  );
}
```

### Colors
```jsx
import {Progress} from "@heroui/react";

export default function App() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <Progress aria-label="Loading..." color="default" value={70} />
      <Progress aria-label="Loading..." color="primary" value={70} />
      <Progress aria-label="Loading..." color="secondary" value={70} />
      <Progress aria-label="Loading..." color="success" value={70} />
      <Progress aria-label="Loading..." color="warning" value={70} />
      <Progress aria-label="Loading..." color="danger" value={70} />
    </div>
  );
}
```

### Indeterminate State
```jsx
import {Progress} from "@heroui/react";

export default function App() {
  return <Progress isIndeterminate aria-label="Loading..." className="max-w-md" size="sm" />;
}
```

### Striped Pattern
```jsx
import {Progress} from "@heroui/react";

export default function App() {
  return (
    <Progress
      isStriped
      aria-label="Loading..."
      className="max-w-md"
      color="secondary"
      value={60}
    />
  );
}
```

### With Label
```jsx
import {Progress} from "@heroui/react";

export default function App() {
  return <Progress className="max-w-md" label="Loading..." value={55} />;
}
```

### Dynamic Value Updates
```jsx
import {Progress} from "@heroui/react";

export default function App() {
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setValue((v) => (v >= 100 ? 0 : v + 10));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Progress
      aria-label="Downloading..."
      className="max-w-md"
      color="success"
      showValueLabel={true}
      size="md"
      value={value}
    />
  );
}
```

### Value Formatting with Currency
```jsx
import {Progress} from "@heroui/react";

export default function App() {
  return (
    <Progress
      className="max-w-md"
      color="warning"
      formatOptions={{style: "currency", currency: "ARS"}}
      label="Monthly expenses"
      maxValue={10000}
      showValueLabel={true}
      size="sm"
      value={4000}
    />
  );
}
```

### Custom Styles with Tailwind
```jsx
import {Progress} from "@heroui/react";

export default function App() {
  return (
    <Progress
      classNames={{
        base: "max-w-md",
        track: "drop-shadow-md border border-default",
        indicator: "bg-linear-to-r from-pink-500 to-yellow-500",
        label: "tracking-wider font-medium text-default-600",
        value: "text-foreground/60",
      }}
      label="Lose weight"
      radius="sm"
      showValueLabel={true}
      size="sm"
      value={65}
    />
  );
}
```

## Notable Features

### 1. Indeterminate Progress
- Shows continuous animation when duration of operation is unknown
- Different from determinate mode which shows specific percentage
- Common pattern for loading states and data fetching
- Mental model: "Something is happening, but we don't know how long it will take"

### 2. Internationalization Support
- `formatOptions` prop accepts Intl.NumberFormat API options
- Supports currency formatting, percentage display, locale-specific number formats
- Enables display of progress as currency spent, items completed, etc.
- Example: Show "$4,000/$10,000" instead of "40%"

### 3. Striped Pattern
- Visual variation that adds animated texture to progress indicator
- Creates sense of motion and activity
- Can be combined with colors for additional visual differentiation

### 4. Slot-Based Customization
- Provides `classNames` prop for granular control of internal elements
- Customizable slots: `base`, `labelWrapper`, `label`, `track`, `value`, `indicator`
- Enables brand-specific styling without overriding entire component
- Supports Tailwind CSS utilities

### 5. Label and Value Display
- `label` prop for descriptive text (e.g., "Downloading...")
- `showValueLabel` toggle for numeric percentage/value display
- `valueLabel` prop for custom display text (overrides auto-formatting)
- Flexible composition of progress context

### 6. Value Range Customization
- `minValue` and `maxValue` props customize the 0-100 range
- Enables non-percentage displays (0-50, 0-10000, etc.)
- Works with `formatOptions` for context-specific formatting

### 7. Accessibility Features
- Built-in ARIA attributes: `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext`
- Semantic HTML structure for screen reader compatibility
- Support for indeterminate state via `aria-busy`-like semantics
- `aria-label` prop for contextual information

### 8. Data Attributes for CSS Styling
- `data-indeterminate` - Set when in indeterminate mode
- `data-disabled` - Set when disabled
- Enables CSS-based styling hooks without JavaScript

## Research Notes

### Documentation Access
The HeroUI Progress component documentation is comprehensive and well-organized at `https://heroui.com/docs/components/progress`. Page is fully accessible and current as of HeroUI v2.8.0.

### Circular Progress Separate Component
Investigation confirmed that CircularProgress is a separate, distinct component in HeroUI. The Progress component specifically implements linear/bar-style progress visualization. This differs from frameworks that provide both variants in a single component.

### Framework-Specific Patterns
HeroUI's Progress follows React conventions:
- State updates via `value` prop (controlled component pattern)
- Uses React hooks for dynamic updates
- Integrates with Tailwind CSS via `classNames` prop
- Follows HeroUI's design token system (colors, sizes, radius options)

### Comparison with Button Component
Similar to Button, Progress uses:
- Color orthogonality (semantic colors separated from variants)
- Size constraints (only 3 options: sm, md, lg)
- Customizable radius as first-class prop
- Slot-based composition for styling
- Data attributes for CSS state hooks

### Key Design Decisions
1. **Linear Only**: Progress component handles linear progress exclusively; circular progress delegated to separate component. This maintains component focus and prevents API bloat.

2. **Percentage-First API**: Default `value` prop assumes 0-100 range with percentage formatting. This is the most common use case and kept simple.

3. **Internationalization Built-In**: Rather than requiring custom formatters, `formatOptions` hook into browser's Intl API. This enables international formatting out of box.

4. **Indeterminate as First-Class State**: Rather than workaround with animations, `isIndeterminate` prop explicitly handles unknown-duration operations. Common pattern in loading states.

5. **Striped as Optional Enhancement**: Rather than separate Striped variant, `isStriped` boolean allows combining with any color/size. Reduces variant explosion.

### Potential Improvements (Framework Learning)
1. **Segmented Progress**: No pattern shown for step-based progress (Step 1 of 5) or discrete progress bars
2. **Label Position Control**: Label always above bar; no option for side labels or inside bar
3. **Custom Track Background**: `classNames` allows indicator customization but not granular track background control
4. **Progress Segments**: No support for multi-stage progress (buffered, downloaded, etc. in video players)
5. **Animation Control**: `disableAnimation` disables all animations; no fine-grained control over speed or easing
6. **Determinate to Indeterminate Transition**: Documentation doesn't show pattern for switching modes during operation
7. **Success/Error States**: No built-in state for completed (success) or failed progress

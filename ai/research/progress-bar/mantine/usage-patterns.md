# Mantine - Progress Component

> Last Modified: 2025-11-05

## Component URL
[https://mantine.dev/core/progress/](https://mantine.dev/core/progress/)
Status: ✅ Working
Version: @mantine/core v8.3.6
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - well-structured with multiple examples, compound component API, accessibility details, and clear prop documentation. Excellent coverage of simple and complex progress patterns.

## Component Overview

The Mantine Progress component provides a flexible, theme-integrated progress bar for displaying task completion status. It supports both simple single-value progress bars and complex multi-segment layouts with labels. The component uses a compound API pattern for compositional flexibility while maintaining simplicity for basic use cases.

**Core purpose**: Provides user feedback for task completion status through visual indicators. Displays progress as a horizontal or vertical bar with support for multiple segments, colors, animations, and labels.

**Mental model**: A filled bar representing numeric progress from 0 to 100, with optional segmentation for breaking down progress into labeled parts (e.g., storage usage, password strength).

**Semantic meaning**: Communicates task completion percentage to users. Can indicate system loading, file upload progress, form completion, or any process with measurable completion state.

## Pattern Support Levels

- **Native**: Dedicated prop/API (e.g., `value={50}`, `color="cyan"`, `size="lg"`)
- **Composed**: Via composition/children (e.g., `<Progress.Root>`, `<Progress.Section>`, `<Progress.Label>`)
- **CSS-only**: Requires custom styling (e.g., custom radius, transitions via `transitionDuration` prop)

## Usage Patterns

### Content Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | `<Progress.Label>` component for labels within segments |
| Icon support | ❌ | - | No native icon support; icons must be added outside component |
| Custom content | ✅ | Composed | Compound component pattern allows full flexibility with `Progress.Root`, `Progress.Section`, `Progress.Label` |

### Type Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Linear/Bar | ✅ | Native | Default horizontal bar layout with `value` prop (0-100) |
| Circular | ❌ | - | Not supported; only linear and vertical variants |
| Dashboard/Arc | ❌ | - | Not supported |

### State Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Indeterminate | ❌ | - | All progress requires explicit `value` (0-100 numeric) |
| Success state | ❌ | CSS-only | No built-in success state; achieved via `value={100}` with success color |
| Error state | ❌ | CSS-only | No built-in error state; use `color="red"` for error indication |
| Active/animating | ✅ | Native | `animated` boolean prop enables animated fill effect; `transitionDuration` prop (milliseconds) for smooth width transitions |

### Sizing Options

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Predefined sizes | ✅ | Native | `size` prop: xs (4px), sm (8px), md (12px), lg (16px), xl (20px) |
| Custom sizes | ✅ | Native | `size` prop accepts pixel numbers for custom height |
| Height/Thickness | ✅ | Native | Controls bar vertical height/thickness via size |

### Variation Patterns

| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size` prop: xs, sm, md, lg, xl (controls bar height/thickness) |
| Color options | ✅ | Native | `color` prop: all Mantine theme colors (cyan, pink, orange, red, teal, lime, yellow, etc.) |
| Percentage display | ✅ | Composed | No built-in percentage label; use `<Progress.Label>` to display text |
| Segmented/steps | ✅ | Composed | `<Progress.Root>` with multiple `<Progress.Section>` components for multi-segment bars |
| Striped effect | ✅ | Native | `striped` boolean prop adds diagonal stripe pattern to progress bar |
| Animated stripes | ✅ | Native | `animated` boolean prop for animated stripe movement |
| Radius | ✅ | Native | `radius` prop controls border-radius (xs, sm, md, lg, xl) |
| Orientation | ✅ | Native | `orientation` prop supports "horizontal" (default) or "vertical" layouts |

## Key Properties/Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | - | Progress value from 0 to 100 (required for simple Progress) |
| `color` | `MantineColor` | `theme.primaryColor` | Progress bar color - accepts theme color keys or CSS color values |
| `size` | `MantineSize \| number` | `'md'` | Bar height/thickness - predefined (xs-xl) or pixel value |
| `striped` | `boolean` | `false` | Adds diagonal stripe pattern to progress bar |
| `animated` | `boolean` | `false` | Animates the striped pattern movement when `striped` is true |
| `transitionDuration` | `number` | `200` | Duration of width transition animation in milliseconds |
| `radius` | `MantineRadius` | `'sm'` | Border-radius of the bar - xs, sm, md, lg, xl |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction of progress bar |
| `label` | `React.ReactNode` | - | Optional label text displayed inside progress bar (Progress component only) |
| `autoContrast` | `boolean` | `false` | Automatically adjusts label color for sufficient contrast |
| `classNames` | `Record<'root' \| 'section' \| 'label', string>` | - | CSS class names for inner elements via Styles API |
| `styles` | `Record<'root' \| 'section' \| 'label', CSSProperties>` | - | Inline styles for inner elements via Styles API |

## Code Examples

### Basic Usage

#### Minimal Example
```jsx
import { Progress } from '@mantine/core';

function Demo() {
  return <Progress value={50} />;
}
```

By default, renders a horizontal progress bar at 50% completion with medium size and theme's primary color.

#### With Color
```jsx
import { Progress } from '@mantine/core';

function Demo() {
  return (
    <>
      <Progress value={25} color="red" />
      <Progress value={50} color="orange" />
      <Progress value={75} color="yellow" />
      <Progress value={100} color="teal" />
    </>
  );
}
```

#### With Size Variants
```jsx
import { Progress } from '@mantine/core';

function Demo() {
  return (
    <>
      <Progress value={60} size="xs" />
      <Progress value={60} size="sm" />
      <Progress value={60} size="md" />
      <Progress value={60} size="lg" />
      <Progress value={60} size="xl" />
    </>
  );
}
```

#### With Custom Sizes
```jsx
import { Progress } from '@mantine/core';

function Demo() {
  return (
    <>
      <Progress value={60} size={4} />
      <Progress value={60} size={8} />
      <Progress value={60} size={16} />
      <Progress value={60} size={32} />
    </>
  );
}
```

### Interactive Features

#### Animated Width Transition
```jsx
import { useState } from 'react';
import { Button, Progress } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState(50);

  return (
    <>
      <Progress value={value} size="lg" transitionDuration={200} />
      <Button onClick={() => setValue(Math.random() * 100)} mt="md">
        Set random value
      </Button>
    </>
  );
}
```

#### Dynamic Progress Update
```jsx
import { useState, useEffect } from 'react';
import { Progress } from '@mantine/core';

function FileUploadProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 10 : 100));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <Progress value={progress} size="md" transitionDuration={300} />;
}
```

### Animation & Transitions

#### Striped Progress Bar
```jsx
import { Progress } from '@mantine/core';

function Demo() {
  return (
    <>
      <Progress value={75} striped size="lg" />
      <Progress value={50} striped size="lg" />
      <Progress value={25} striped size="lg" />
    </>
  );
}
```

#### Animated Striped Pattern
```jsx
import { Progress } from '@mantine/core';

function Demo() {
  return (
    <>
      <Progress value={75} animated size="lg" />
      <Progress value={50} animated size="lg" />
      <Progress value={25} animated size="lg" />
    </>
  );
}
```

#### Custom Transition Duration
```jsx
import { useState } from 'react';
import { Progress, Slider } from '@mantine/core';

function Demo() {
  const [value, setValue] = useState(50);

  return (
    <>
      <Progress value={value} transitionDuration={1000} size="lg" />
      <Slider value={value} onChange={setValue} mt="md" />
    </>
  );
}
```

### Layout & Positioning

#### Vertical Orientation
```jsx
import { Progress, Group } from '@mantine/core';

function Demo() {
  return (
    <Group>
      <Progress value={80} orientation="vertical" h={200} />
      <Progress value={60} color="orange" size="xl"
                orientation="vertical" h={200} animated />
      <Progress value={40} color="cyan"
                orientation="vertical" h={200} striped />
    </Group>
  );
}
```

#### Progress with Labels (Simple)
```jsx
import { Progress, Stack, Text } from '@mantine/core';

function Demo() {
  return (
    <Stack gap={0}>
      <Text size="sm" fw={500}>Upload progress: 45%</Text>
      <Progress value={45} size="lg" mt={4} />
    </Stack>
  );
}
```

#### Radius Options
```jsx
import { Progress, Stack } from '@mantine/core';

function Demo() {
  return (
    <Stack>
      <Progress value={60} radius="xs" size="lg" />
      <Progress value={60} radius="sm" size="lg" />
      <Progress value={60} radius="md" size="lg" />
      <Progress value={60} radius="lg" size="lg" />
      <Progress value={60} radius="xl" size="lg" />
    </Stack>
  );
}
```

### Content & Structure

#### Multi-Section Compound Component
```jsx
import { Progress } from '@mantine/core';

function Demo() {
  return (
    <Progress.Root size="xl">
      <Progress.Section value={35} color="cyan">
        <Progress.Label>Documents</Progress.Label>
      </Progress.Section>
      <Progress.Section value={28} color="pink">
        <Progress.Label>Photos</Progress.Label>
      </Progress.Section>
      <Progress.Section value={15} color="orange">
        <Progress.Label>Other</Progress.Label>
      </Progress.Section>
    </Progress.Root>
  );
}
```

#### Multi-Section Vertical
```jsx
import { Progress } from '@mantine/core';

function Demo() {
  return (
    <Progress.Root size="xl" autoContrast orientation="vertical" h={200}>
      <Progress.Section value={40} color="lime.4">
        <Progress.Label>Documents</Progress.Label>
      </Progress.Section>
      <Progress.Section value={20} color="yellow.4">
        <Progress.Label>Apps</Progress.Label>
      </Progress.Section>
      <Progress.Section value={20} color="cyan.7">
        <Progress.Label>Other</Progress.Label>
      </Progress.Section>
    </Progress.Root>
  );
}
```

#### Multi-Section with Tooltips
```jsx
import { Progress, Tooltip } from '@mantine/core';

function Demo() {
  return (
    <Progress.Root size={40}>
      <Tooltip label="Documents – 33Gb">
        <Progress.Section value={33} color="cyan">
          <Progress.Label>Documents</Progress.Label>
        </Progress.Section>
      </Tooltip>

      <Tooltip label="Photos – 28Gb">
        <Progress.Section value={28} color="pink">
          <Progress.Label>Photos</Progress.Label>
        </Progress.Section>
      </Tooltip>

      <Tooltip label="Other – 15Gb">
        <Progress.Section value={15} color="orange">
          <Progress.Label>Other</Progress.Label>
        </Progress.Section>
      </Tooltip>
    </Progress.Root>
  );
}
```

### Integration Patterns

#### Upload Progress Example
```jsx
import { useState } from 'react';
import { Progress, Button, Group, Text, Stack } from '@mantine/core';

function FileUploadProgress() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          return 100;
        }
        return prev + Math.random() * 30;
      });
    }, 500);
  };

  return (
    <Stack>
      <Progress value={Math.min(progress, 100)}
               size="md" transitionDuration={200} />
      <Text size="sm" c="dimmed">
        {Math.round(Math.min(progress, 100))}% uploaded
      </Text>
      <Button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload File'}
      </Button>
    </Stack>
  );
}
```

#### Password Strength Meter
```jsx
import { useState } from 'react';
import { Group, PasswordInput, Progress } from '@mantine/core';

const requirements = [
  { re: /[0-9]/, label: 'Includes number' },
  { re: /[a-z]/, label: 'Includes lowercase letter' },
  { re: /[A-Z]/, label: 'Includes uppercase letter' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
];

function getStrength(password: string) {
  if (password.length < 5) return 10;
  let multiplier = password.length > 5 ? 0 : 1;
  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) multiplier += 1;
  });
  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

function getStrengthColor(strength: number) {
  switch (true) {
    case strength < 30: return 'red';
    case strength < 50: return 'orange';
    case strength < 70: return 'yellow';
    default: return 'teal';
  }
}

function Demo() {
  const [value, setValue] = useState('');
  const strength = getStrength(value);
  const color = getStrengthColor(strength);

  return (
    <div>
      <PasswordInput
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        placeholder="Enter password"
        label="Enter password"
      />

      <Group grow gap={5} mt="xs">
        <Progress size="xs" color={color}
                  value={value.length > 0 ? 100 : 0} transitionDuration={0} />
        <Progress size="xs" color={color} transitionDuration={0}
                  value={strength < 30 ? 0 : 100} />
        <Progress size="xs" color={color} transitionDuration={0}
                  value={strength < 50 ? 0 : 100} />
        <Progress size="xs" color={color} transitionDuration={0}
                  value={strength < 70 ? 0 : 100} />
      </Group>
    </div>
  );
}
```

#### Multi-Step Process Progress
```jsx
import { Progress, Stack, Text } from '@mantine/core';

function MultiStepProgress() {
  const steps = [
    { label: 'Upload', completed: true },
    { label: 'Processing', completed: true },
    { label: 'Optimization', completed: false },
    { label: 'Publishing', completed: false },
  ];

  const completedSteps = steps.filter(s => s.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  return (
    <Stack>
      <Progress value={progress} animated size="lg" />
      <Text size="sm" c="dimmed">
        Step {completedSteps} of {steps.length}: {steps[completedSteps]?.label || 'Complete'}
      </Text>
    </Stack>
  );
}
```

#### Storage Usage Display
```jsx
import { Progress } from '@mantine/core';

function StorageUsage() {
  const used = 256;  // GB
  const total = 512; // GB
  const percentage = (used / total) * 100;

  return (
    <Progress.Root size="lg">
      <Progress.Section value={percentage} color="blue">
        <Progress.Label>{used}GB used</Progress.Label>
      </Progress.Section>
      <Progress.Section value={100 - percentage} color="gray.2">
        <Progress.Label>{total - used}GB free</Progress.Label>
      </Progress.Section>
    </Progress.Root>
  );
}
```

## Accessibility Features

### ARIA Attributes

The Progress component automatically includes:

```jsx
<div
  role="progressbar"
  aria-valuenow={value}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label="Progress"
>
```

### Basic Accessibility Example

```jsx
import { Progress } from '@mantine/core';

function AccessibleProgress() {
  return (
    <Progress
      value={65}
      aria-label="File upload progress"
    />
  );
}
```

### With Accessible Label

```jsx
import { Progress, Stack, Text } from '@mantine/core';

function AccessibleProgressWithLabel() {
  const value = 75;

  return (
    <Stack>
      <Text id="progress-label" size="sm" fw={500}>
        Form completion: {value}%
      </Text>
      <Progress
        value={value}
        aria-labelledby="progress-label"
      />
    </Stack>
  );
}
```

### Screen Reader Announcements

```jsx
import { useState } from 'react';
import { Progress, Stack, Text, Button, VisuallyHidden } from '@mantine/core';

function AnnouncedProgress() {
  const [progress, setProgress] = useState(0);

  const handleStart = () => {
    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setProgress(current);
      if (current >= 100) clearInterval(interval);
    }, 500);
  };

  return (
    <Stack>
      <Progress value={progress} />
      <Button onClick={handleStart}>Start Process</Button>

      {/* Screen reader announcement */}
      <VisuallyHidden>
        <div role="status" aria-live="polite">
          Process is {progress}% complete
        </div>
      </VisuallyHidden>
    </Stack>
  );
}
```

### Auto-Contrast for Labels

```jsx
import { Progress } from '@mantine/core';

function Demo() {
  return (
    <Progress.Root size="xl" autoContrast>
      <Progress.Section value={40} color="lime.4">
        <Progress.Label>Documents</Progress.Label>
      </Progress.Section>
      <Progress.Section value={30} color="yellow.4">
        <Progress.Label>Media</Progress.Label>
      </Progress.Section>
      <Progress.Section value={30} color="cyan.7">
        <Progress.Label>Other</Progress.Label>
      </Progress.Section>
    </Progress.Root>
  );
}
```

## Accessibility Notes

1. **ARIA Attributes**: Component includes `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`
2. **Labels**: Always provide accessible labels via `aria-label` or `aria-labelledby` attributes or accompanying text
3. **Screen Reader Support**: Labels within `<Progress.Label>` are announced to screen readers
4. **Auto-Contrast**: Use `autoContrast` prop to ensure label text is readable against varying background colors
5. **Status Announcements**: For dynamic progress updates, use `aria-live="polite"` on surrounding container or screen reader status region

## Common Patterns

1. **File Upload Progress**: Real-time feedback on upload completion with percentage display
2. **Form Completion**: Multi-step form progress showing number of completed sections
3. **Password Strength**: Visual indicator of password security using color-coded progress bars
4. **Storage Usage**: Multi-segment bar showing used vs. available storage
5. **Task Processing**: Background task progress with status text and animated indicators
6. **Loading States**: Determinate loading progress with transitioned width changes
7. **Multi-Segment Breakdown**: Stacked progress showing composition of a whole (disk usage, budget allocation)

## Related Components

- **Button** - Can be combined with progress for actions that trigger progress tracking
- **Loader** - For indeterminate loading states (use when duration is unknown)
- **Tooltip** - Enhances multi-segment progress with hover information
- **Group** - Layout helper for arranging multiple progress bars
- **Stack** - Vertical arrangement of progress bars and labels
- **Text** - Accompanying labels and descriptions for progress context
- **LoadingOverlay** - Full-page loading overlay with progress indication

## Notable Features

- **Compound Component API**: `Progress`, `Progress.Root`, `Progress.Section`, and `Progress.Label` provide flexible composition for simple and complex layouts
- **Multi-Segment Support**: Multiple colored sections can be stacked horizontally to show breakdown of progress (storage usage, form progress)
- **Dual Orientation**: Both horizontal (default) and vertical layouts via `orientation` prop
- **Animation Support**: Built-in `animated` prop and smooth `transitionDuration` for professional visual feedback
- **Accessibility**: Includes `role="progressbar"`, `aria-valuenow`, `aria-valuemin` (0), `aria-valuemax` (100), and `aria-label` support
- **Auto-Contrast**: `autoContrast` prop for automatic label contrast adjustment based on background
- **Styles API**: Customizable inner elements via `classNames` prop for root, section, and label
- **Size Variants**: xs through xl sizing for different contexts (from xs for inline indicators to xl for prominent displays)
- **Striped Effect**: Boolean `striped` prop available for visual variety
- **Theme Integration**: Deep integration with Mantine's theming system - all theme colors automatically available

## Research Notes

- Documentation is clear and comprehensive with good example coverage
- Mantine's compound component pattern (`Progress.Root`, `Progress.Section`, `Progress.Label`) provides a clean API for both simple and complex use cases
- Component is well-integrated with Mantine's theming system - all theme colors automatically available
- No built-in indeterminate/loading state - progress must always have explicit numeric value (0-100)
- Accessibility support is solid with proper ARIA attributes out of the box
- Common use case demonstrated: password strength meter shows pattern of using multiple segmented bars with conditional coloring
- Vertical orientation less common but well-supported for specialized layouts
- Animation and transition duration props allow for smooth state changes, important for UX feedback
- The `transitionDuration` prop is critical for smooth visual transitions when progress value changes dynamically
- Striped and animated effects work well together for visual emphasis on active processes
- Multi-section bars are ideal for showing composition (e.g., storage usage breakdown by category)

---

Research completed: 2025-11-05
Component: Progress (Progress Bar)
Framework: Mantine
Documentation: https://mantine.dev/core/progress/

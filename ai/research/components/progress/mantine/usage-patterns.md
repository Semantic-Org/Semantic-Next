# Mantine - Progress Usage Patterns

> Last Modified: 2025-11-05

## Component URL
[https://mantine.dev/core/progress/](https://mantine.dev/core/progress/)
Status: ✅ Working
Version: @mantine/core v8.3.6
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - well-structured with multiple examples, compound component API, accessibility details, and clear prop documentation.

## Component Definition
- **Core purpose**: Provides user feedback for task completion status through visual indicators. Displays progress as a horizontal or vertical bar with support for multiple segments, colors, animations, and labels.
- **Mental model**: A filled bar representing numeric progress from 0 to 100, with optional segmentation for breaking down progress into labeled parts (e.g., storage usage, password strength).
- **Semantic meaning**: Communicates task completion percentage to users. Can indicate system loading, file upload progress, form completion, or any process with measurable completion state.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `value={50}`, `color="cyan"`, `size="lg"`)
- **Composed**: Via composition/children (e.g., `<Progress.Root>`, `<Progress.Section>`, `<Progress.Label>`)
- **CSS-only**: Requires custom styling (e.g., custom radius, transitions via `transitionDuration` prop)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | `<Progress.Label>` component for labels within segments |
| Icon support | ❌ | - | No native icon support; icons must be added outside component |
| Custom content | ✅ | Composed | Compound component pattern allows full flexibility with `Progress.Root`, `Progress.Section`, `Progress.Label` |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Linear/Bar | ✅ | Native | Default horizontal bar layout with `value` prop (0-100) |
| Circular | ❌ | - | Not supported; only linear and vertical variants |
| Dashboard/Arc | ❌ | - | Not supported |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Indeterminate | ❌ | - | All progress requires explicit `value` (0-100 numeric) |
| Success state | ❌ | CSS-only | No built-in success state; achieved via `value={100}` with success color |
| Error state | ❌ | CSS-only | No built-in error state; use `color="red"` for error indication |
| Active/animating | ✅ | Native | `animated` boolean prop enables animated fill effect; `transitionDuration` prop (milliseconds) for smooth width transitions |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | `size` prop: xs, sm, md, lg, xl (controls bar height/thickness) |
| Color options | ✅ | Native | `color` prop: all Mantine theme colors (cyan, pink, orange, red, teal, lime, yellow, etc.) |
| Percentage display | ✅ | Composed | No built-in percentage label; use `<Progress.Label>` to display text |
| Segmented/steps | ✅ | Composed | `<Progress.Root>` with multiple `<Progress.Section>` components for multi-segment bars |

## Code Examples

### Basic Progress Bar
```tsx
import { Progress } from '@mantine/core';

function Demo() {
  return <Progress value={50} />;
}
```

### Multi-Section Compound Component
```tsx
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

### Vertical Orientation
```tsx
import { Progress, Group } from '@mantine/core';

function Demo() {
  return (
    <Group>
      <Progress value={80} orientation="vertical" h={200} />
      <Progress value={60} color="orange" size="xl"
                orientation="vertical" h={200} animated />

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
    </Group>
  );
}
```

### Animated Width Transition
```tsx
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

### With Tooltips (Multi-Section)
```tsx
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

### Password Strength Example
```tsx
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

## Research Notes

- Documentation is clear and comprehensive with good example coverage
- Mantine's compound component pattern (`Progress.Root`, `Progress.Section`, `Progress.Label`) provides a clean API for both simple and complex use cases
- Component is well-integrated with Mantine's theming system - all theme colors automatically available
- No built-in indeterminate/loading state - progress must always have explicit numeric value (0-100)
- Accessibility support is solid with proper ARIA attributes out of the box
- Common use case demonstrated: password strength meter shows pattern of using multiple segmented bars with conditional coloring
- Vertical orientation less common but well-supported for specialized layouts
- Animation and transition duration props allow for smooth state changes, important for UX feedback

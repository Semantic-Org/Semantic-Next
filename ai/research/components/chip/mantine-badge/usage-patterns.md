# Mantine - Badge Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://mantine.dev/core/badge/
Status: ✅ Working
Version: v8.3.6
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Excellent documentation with clear examples covering all variants, sizes, sections, polymorphic usage, gradient implementation, and advanced theming patterns.

## Component Definition
- **Core purpose**: Displays small labeled indicators or tags for categorization, status display, or content labeling
- **Mental model**: A non-interactive visual label that highlights information, status, or metadata about associated content
- **Semantic meaning**: Communicates supplementary information, status indicators, counts, or categorical labels in a compact visual format

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `color="blue"`, `variant="outline"`)
- **Composed**: Via composition/children (e.g., `<Badge>{content}</Badge>`)
- **CSS-only**: Requires custom styling (e.g., Styles API for granular control)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | Children prop accepts text content directly |
| Icons | ✅ | Native | `leftSection` and `rightSection` props for icons or elements |
| Avatars/Images | ✅ | Native | Via `leftSection`/`rightSection` props (accepts any element) |
| Close/Remove button | ❌ | CSS-only | Not natively supported, would require custom implementation in sections |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Selectable/Active | ❌ | N/A | Badge is display-only, not an interactive control |
| Disabled | ❌ | N/A | Not applicable to display component |
| Loading | ❌ | N/A | Not documented |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Color options | ✅ | Native | `color` prop accepts theme colors, customizable via theme |
| Size options | ✅ | Native | `xs`, `sm`, `md`, `lg`, `xl` sizes |
| Visual variants | ✅ | Native | `filled`, `light`, `outline`, `dot`, `transparent`, `default`, `white`, `gradient` |
| Bordered/Borderless | ✅ | Native | `outline` variant has border, others borderless by default |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Clickable | ✅ | Native | Polymorphic `component` prop allows rendering as anchor or Link |
| Closable/Removable | ❌ | CSS-only | Not natively supported |
| onClick handler | ✅ | Native | Standard React onClick when rendered as interactive element |
| onClose handler | ❌ | N/A | Not applicable |

## Layout Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Full width | ✅ | Native | `fullWidth` prop expands to parent container width |
| Circular | ✅ | Native | `circle` prop reduces horizontal padding for circular badges (common for counts) |
| Icon sections | ✅ | Native | `leftSection` and `rightSection` for icons/elements |

## Code Examples

### Basic Usage
```jsx
import { Badge } from '@mantine/core';

function Demo() {
  return <Badge color="blue">Badge</Badge>;
}
```

### All Variants
```jsx
import { Badge, Stack } from '@mantine/core';

function Demo() {
  return (
    <Stack>
      <Badge variant="filled">Filled</Badge>
      <Badge variant="light">Light</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="dot">Dot</Badge>
      <Badge variant="transparent">Transparent</Badge>
      <Badge variant="default">Default</Badge>
      <Badge variant="white">White</Badge>
    </Stack>
  );
}
```

### Gradient Badge
```jsx
import { Badge } from '@mantine/core';

function Demo() {
  return (
    <Badge
      size="xl"
      variant="gradient"
      gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
    >
      Gradient badge
    </Badge>
  );
}
```

### Circle Badges (Multiple Sizes)
```jsx
import { Badge, Group } from '@mantine/core';

function Demo() {
  return (
    <Group>
      <Badge size="xs" circle>1</Badge>
      <Badge size="sm" circle>7</Badge>
      <Badge size="md" circle>9</Badge>
      <Badge size="lg" circle>3</Badge>
      <Badge size="xl" circle>8</Badge>
    </Group>
  );
}
```

### Left and Right Sections
```jsx
import { Badge, Group } from '@mantine/core';
import { IconAt } from '@tabler/icons-react';

function Demo() {
  const icon = <IconAt size={12} />;
  return (
    <Group>
      <Badge leftSection={icon}>With left section</Badge>
      <Badge rightSection={icon}>With right section</Badge>
    </Group>
  );
}
```

### Full Width Badge
```jsx
import { Badge } from '@mantine/core';

function Demo() {
  return <Badge fullWidth>Full width badge</Badge>;
}
```

### Auto Contrast
```jsx
import { Badge, Group } from '@mantine/core';

function Demo() {
  return (
    <Group>
      <Badge size="lg" color="lime.4">Default</Badge>
      <Badge autoContrast size="lg" color="lime.4">Auto contrast</Badge>
    </Group>
  );
}
```

### Polymorphic Component (as anchor)
```jsx
import { Badge } from '@mantine/core';

function Demo() {
  return (
    <Badge component="a" href="https://mantine.dev">
      Link badge
    </Badge>
  );
}
```

### Polymorphic with Next.js Link
```jsx
import Link from 'next/link';
import { Badge } from '@mantine/core';

function Demo() {
  return (
    <Badge component={Link} href="/">
      Next.js Link badge
    </Badge>
  );
}
```

### Custom Variant Colors
```jsx
import { IconPhoto, IconFingerprint, IconError404 } from '@tabler/icons-react';
import {
  Badge,
  Group,
  MantineProvider,
  defaultVariantColorsResolver,
  VariantColorsResolver,
  parseThemeColor,
  rgba,
  darken,
} from '@mantine/core';

const variantColorResolver: VariantColorsResolver = (input) => {
  const defaultResolvedColors = defaultVariantColorsResolver(input);
  const parsedColor = parseThemeColor({
    color: input.color || input.theme.primaryColor,
    theme: input.theme,
  });

  // Custom lime filled variant
  if (parsedColor.isThemeColor && parsedColor.color === 'lime' && input.variant === 'filled') {
    return {
      ...defaultResolvedColors,
      color: 'var(--mantine-color-black)',
      hoverColor: 'var(--mantine-color-black)',
    };
  }

  // Custom light variant with border
  if (input.variant === 'light') {
    return {
      background: rgba(parsedColor.value, 0.1),
      hover: rgba(parsedColor.value, 0.15),
      border: `1px solid ${parsedColor.value}`,
      color: darken(parsedColor.value, 0.1),
    };
  }

  // Custom danger variant
  if (input.variant === 'danger') {
    return {
      background: 'var(--mantine-color-red-9)',
      hover: 'var(--mantine-color-red-8)',
      color: 'var(--mantine-color-white)',
      border: 'none',
    };
  }

  return defaultResolvedColors;
};

function Demo() {
  return (
    <MantineProvider theme={{ variantColorResolver }}>
      <Group>
        <Badge color="lime.4" variant="filled">Lime filled</Badge>
        <Badge color="orange" variant="light">Orange light</Badge>
        <Badge variant="danger">Danger</Badge>
      </Group>
    </MantineProvider>
  );
}
```

## Notable Features

### Extensive Variant System
- 8 distinct visual variants: filled, light, outline, dot, transparent, default, white, gradient
- Each variant serves specific visual hierarchy needs
- Dot variant provides minimalist indicator style
- White variant designed for dark backgrounds
- Gradient variant with full directional control (from, to, deg)

### Polymorphic Component Architecture
- Can render as any HTML element via `component` prop
- Seamless integration with routing libraries (Next.js Link, React Router)
- Maintains TypeScript type safety across transformations
- Enables interactive badges (links) without losing badge styling

### Flexible Content Sections
- `leftSection` and `rightSection` props accept any React elements
- Commonly used for icons, avatars, or custom indicators
- Sections properly spaced and aligned automatically
- Enables complex badge compositions without custom CSS

### Circle Badge Pattern
- `circle` prop reduces horizontal padding for balanced circular shape
- Particularly useful for numeric indicators (notification counts, etc.)
- Works across all size variants
- Common pattern for badges with 1-2 characters

### Auto Contrast Feature
- `autoContrast` prop automatically adjusts text color for readability
- Ensures WCAG compliance without manual color management
- Particularly useful with light background colors (lime, yellow, etc.)
- Applies to filled variant only

### Full Width Support
- `fullWidth` prop expands badge to parent container width
- Useful for badges in flex/grid layouts
- Maintains vertical sizing from size prop

### Theme Integration
- Deep integration with Mantine's theming system
- `variantColorResolver` enables custom variant creation
- Custom color schemes via theme configuration
- Consistent sizing across component library

### Gradient Control
- Gradient variant accepts `from`, `to`, and `deg` properties
- Full control over gradient direction and colors
- More sophisticated than basic linear-gradient support
- Integrates with theme color system

### Radius Customization
- `radius` prop accepts theme size tokens (xs, sm, md, lg, xl)
- Consistent with Mantine's design system
- Enables brand-specific styling

### Styles API System
- Granular control over internal elements
- Targets: root, section, label
- Supports both className and inline styles
- Enables deep customization without losing component behavior

## Research Notes

- Badge is fundamentally a **display component**, not an interactive control
- Clear separation from Chip: Badge = label/indicator, Chip = selection input
- No native close/dismiss functionality (use leftSection/rightSection for custom implementation)
- Polymorphic component pattern enables interactive badges when needed
- The dot variant is unique - provides minimalist status indicator
- Circle badge pattern is explicitly supported and commonly used for counts
- Gradient implementation is more sophisticated than typical CSS gradient support
- Auto contrast demonstrates commitment to accessibility
- No disabled or loading states (not applicable to display component)
- Left/right sections are more flexible than icon-specific props (accept any element)
- Custom variant creation via variantColorResolver is powerful but advanced
- Full width pattern useful for responsive layouts
- Version v8.3.6 indicates mature, actively maintained component
- Full TypeScript support with proper polymorphic typing
- Package: @mantine/core
- Documentation emphasizes visual hierarchy through variant selection
- The component focuses on information display, not user input

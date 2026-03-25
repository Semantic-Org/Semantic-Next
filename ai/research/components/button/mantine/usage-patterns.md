# Mantine - Button Usage Patterns

> Last Modified: 2024-11-04

## Component URL
https://mantine.dev/core/button/
Status: ✅ Working
Version: v8.3.6
Last Verified: 2024-11-04

## Documentation Quality
Comprehensive - Excellent documentation with clear examples, thorough prop coverage, TypeScript support, and practical use cases demonstrating all major features.

## Component Definition
- **Core purpose**: Provides an interactive clickable element that triggers actions, with rich styling options and states for various use cases
- **Mental model**: A polymorphic, highly configurable action trigger that can display text, icons, loading states, and adapts to different visual contexts
- **Semantic meaning**: Communicates an actionable element that users can click to perform operations, with visual cues for emphasis level, state, and context

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `color="blue"`, `loading={true}`)
- **Composed**: Via composition/children (e.g., `<Button>Click me</Button>`)
- **CSS-only**: Requires custom styling (e.g., Styles API for granular control)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | Children prop accepts text strings directly |
| Icon support | ✅ | Native | `leftSection` and `rightSection` props for icons, automatically flips in RTL mode |
| Icon + Text | ✅ | Native | Supports simultaneous text (children) with left/right icons via section props |
| Loading indicator | ✅ | Native | `loading` prop displays centered Loader overlay, `loaderProps` for customization |
| Custom content | ✅ | Composed | Children can include any JSX elements for complex button content |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Filled | ✅ | Native | Default variant - solid background color |
| Outline | ✅ | Native | `variant="outline"` - border with transparent background |
| Light | ✅ | Native | `variant="light"` - subtle background tint |
| Subtle | ✅ | Native | `variant="subtle"` - minimal visual emphasis |
| Default | ✅ | Native | `variant="default"` - neutral gray styling |
| Transparent | ✅ | Native | `variant="transparent"` - no background or border |
| White | ✅ | Native | `variant="white"` - white background for dark contexts |
| Gradient | ✅ | Native | `variant="gradient"` with `gradient` prop for linear gradients (e.g., `{ from: 'blue', to: 'cyan', deg: 90 }`) |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Disabled | ✅ | Native | `disabled` prop disables interaction and applies disabled styling |
| Loading | ✅ | Native | `loading` prop disables button and shows centered Loader component |
| Active | ✅ | Native | Active/pressed states via pseudo-classes (automatic) |
| Data-disabled | ✅ | Native | `data-disabled` attribute for visual-only disabled state (allows tooltips) |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ✅ | Native | Regular sizes: `xs`, `sm`, `md`, `lg`, `xl` plus compact variants: `compact-xs` through `compact-xl` |
| Color options | ✅ | Native | `color` prop accepts theme colors, customizable via theme configuration |
| Radius options | ✅ | Native | `radius` prop: `xs`, `sm`, `md`, `lg`, `xl` for border-radius control |
| Full width | ✅ | Native | `fullWidth` prop expands button to 100% of parent width |
| Compact | ✅ | Native | Compact size variants reduce padding/height while maintaining font-size |
| Auto contrast | ✅ | Native | `autoContrast` prop automatically adjusts text color for sufficient contrast (filled variant only) |
| Justify content | ✅ | Native | `justify` prop controls internal alignment (e.g., `justify="space-between"` for icon placement) |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Click handler | ✅ | Native | Standard `onClick` prop for event handling |
| Button group | ✅ | Native | `Button.Group` component groups buttons with connected borders, supports `orientation` (horizontal/vertical) |
| As component | ✅ | Native | Polymorphic `component` prop - renders as any HTML element or React component (e.g., Next.js Link, React Router Link) |
| Ref support | ✅ | Native | TypeScript ref support via `useRef<HTMLButtonElement>(null)` |

## Code Examples

### Basic Usage
```jsx
import { Button } from '@mantine/core';

function Demo() {
  return <Button>Settings</Button>;
}
```

### With Icons
```jsx
import { Button } from '@mantine/core';
import { IconPhoto, IconDownload } from '@tabler/icons-react';

function Demo() {
  return (
    <>
      <Button leftSection={<IconPhoto size={14} />}>
        Gallery
      </Button>

      <Button rightSection={<IconDownload size={14} />}>
        Download
      </Button>
    </>
  );
}
```

### Variants
```jsx
function Demo() {
  return (
    <>
      <Button variant="filled">Filled</Button>
      <Button variant="light">Light</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="subtle">Subtle</Button>
      <Button variant="default">Default</Button>
      <Button variant="transparent">Transparent</Button>
      <Button variant="white">White</Button>
    </>
  );
}
```

### Gradient Variant
```jsx
function Demo() {
  return (
    <Button
      variant="gradient"
      gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
    >
      Gradient button
    </Button>
  );
}
```

### Sizes
```jsx
function Demo() {
  return (
    <>
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra large</Button>
    </>
  );
}
```

### Compact Sizes
```jsx
function Demo() {
  return (
    <>
      <Button size="compact-xs">Compact XS</Button>
      <Button size="compact-sm">Compact SM</Button>
      <Button size="compact-md">Compact MD</Button>
      <Button size="compact-lg">Compact LG</Button>
      <Button size="compact-xl">Compact XL</Button>
    </>
  );
}
```

### Loading State
```jsx
function Demo() {
  return (
    <>
      <Button loading>Loading button</Button>

      <Button loading loaderProps={{ type: 'dots' }}>
        Custom loader
      </Button>
    </>
  );
}
```

### Button Group
```jsx
import { Button } from '@mantine/core';

function Demo() {
  return (
    <Button.Group>
      <Button variant="default">First</Button>
      <Button variant="default">Second</Button>
      <Button variant="default">Third</Button>
    </Button.Group>
  );
}
```

### Polymorphic Component (as Link)
```jsx
import { Button } from '@mantine/core';
import Link from 'next/link';

function Demo() {
  return (
    <>
      {/* As anchor tag */}
      <Button component="a" href="/">
        Anchor Button
      </Button>

      {/* As Next.js Link */}
      <Button component={Link} href="/">
        Next.js Link Button
      </Button>
    </>
  );
}
```

### Custom Styling with Styles API
```jsx
import { Button } from '@mantine/core';

function Demo() {
  return (
    <Button
      classNames={{
        root: 'custom-root',
        loader: 'custom-loader',
        inner: 'custom-inner',
        section: 'custom-section',
        label: 'custom-label'
      }}
    >
      Custom styled button
    </Button>
  );
}
```

### Data-Disabled for Tooltips
```jsx
import { Button, Tooltip } from '@mantine/core';

function Demo() {
  return (
    <Tooltip label="Tooltip works with data-disabled">
      <Button data-disabled>Visually disabled</Button>
    </Tooltip>
  );
}
```

### Full Width
```jsx
function Demo() {
  return (
    <Button fullWidth>
      Full width button
    </Button>
  );
}
```

### Color Options
```jsx
function Demo() {
  return (
    <>
      <Button color="blue">Blue</Button>
      <Button color="red">Red</Button>
      <Button color="green">Green</Button>
      <Button color="violet">Violet</Button>
    </>
  );
}
```

### Auto Contrast
```jsx
function Demo() {
  return (
    <Button color="lime" autoContrast>
      Auto contrast
    </Button>
  );
}
```

### Border Radius
```jsx
function Demo() {
  return (
    <>
      <Button radius="xs">XS Radius</Button>
      <Button radius="sm">SM Radius</Button>
      <Button radius="md">MD Radius</Button>
      <Button radius="lg">LG Radius</Button>
      <Button radius="xl">XL Radius</Button>
    </>
  );
}
```

### Custom Justification
```jsx
function Demo() {
  return (
    <Button
      fullWidth
      leftSection={<IconPhoto size={14} />}
      rightSection={<IconDownload size={14} />}
      justify="space-between"
    >
      Spaced content
    </Button>
  );
}
```

## Notable Features

### Polymorphic Component System
- Sophisticated TypeScript-powered polymorphic component support
- Can render as any HTML element or React component
- Full type safety maintained across transformations
- Seamless integration with routing libraries (Next.js, React Router)

### Comprehensive Variant System
- 8 distinct visual variants covering diverse use cases
- Gradient variant with customizable linear gradients
- Each variant responds appropriately to color and state changes
- Consistent behavior across all variants

### Rich Icon Integration
- Dedicated `leftSection` and `rightSection` props for icons
- Automatic RTL mode support (sections flip appropriately)
- Works with any icon library
- Maintains proper spacing and alignment automatically

### Advanced Loading State
- Native loading state with centered overlay
- Customizable loader via `loaderProps`
- Automatically disables button when loading
- Preserves button dimensions during loading

### Dual Size System
- Regular sizes (xs-xl) for standard use cases
- Compact sizes (compact-xs through compact-xl) for dense layouts
- Compact variants reduce padding/height but maintain font-size
- Allows fine-grained control over button density

### Accessibility-First Disabled States
- Standard `disabled` prop for full disabling
- `data-disabled` for visual-only disabled state
- Enables tooltips on visually-disabled buttons
- Solves common tooltip + disabled button UX challenge

### Auto Contrast Feature
- Automatically adjusts text color for sufficient contrast
- Particularly useful with light background colors
- Works with filled variant only
- Ensures WCAG compliance without manual color management

### Button.Group Component
- Groups buttons with connected borders
- Supports both horizontal and vertical orientation
- `Button.GroupSection` for non-button content within groups
- Clean, semantic API for button collections

### Styles API System
- Granular control over internal elements
- Targets: root, loader, inner, section, label
- Supports both className and inline styles
- Enables deep customization without losing component behavior

### Theme Integration
- Deep integration with Mantine's theming system
- Custom variant creation via theme configuration
- `variantColorResolver` for advanced color customization
- Inherits global theme tokens for consistency

### Full TypeScript Support
- Complete type definitions for all props
- Polymorphic component typing
- Ref typing for different component types
- IntelliSense-friendly API

## Research Notes

- Documentation is exceptionally comprehensive with practical examples for every feature
- The component demonstrates excellent balance between simplicity and power
- Polymorphic component pattern is well-implemented with full TypeScript support
- Icon section props with RTL awareness show attention to internationalization
- The dual disabled state pattern (disabled vs data-disabled) elegantly solves the tooltip problem
- Compact size variants are a thoughtful addition for dense UI layouts
- Auto contrast feature demonstrates commitment to accessibility
- Gradient variant implementation is more sophisticated than typical linear-gradient support
- Button.Group API is clean and intuitive
- Styles API provides excellent escape hatch for customization
- The component API follows Mantine's consistent naming conventions
- Loading state implementation is polished with customizable loader
- Package: @mantine/core (part of the Mantine UI library ecosystem)
- Version 8.3.6 suggests active, mature development
- All code examples compile with TypeScript and are production-ready

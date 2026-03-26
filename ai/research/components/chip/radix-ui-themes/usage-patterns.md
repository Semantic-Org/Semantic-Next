# Radix UI Themes - Badge Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://www.radix-ui.com/themes/docs/components/badge
Status: ✅ Working
Version: Current (Radix UI Themes)
Last Verified: 2025-11-05

## Documentation Quality
Comprehensive - Well-organized documentation with clear prop definitions, visual examples, and theme integration details.

## Component Definition
- **Core purpose**: Display status indicators, labels, or categorical markers as compact, inline visual elements.
- **Mental model**: A stylized span element that serves as a standalone label component for communicating status, categories, or contextual information without interactive behavior.
- **Semantic meaning**: Communicates non-interactive information such as status (Active/Inactive), categories (React/TypeScript), or state indicators (New/Draft/Published). Not an overlay/notification badge like in some frameworks.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `color="blue"`)
- **Composed**: Via composition/children (e.g., `<Badge>{content}</Badge>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Text content | ✅ | Composed | Primary usage - text content via children |
| Icons | ✅ | Composed | Can include icons as children alongside text |
| Avatars/Images | ✅ | Composed | Can include small images/avatars as children |
| Close/Remove button | ❌ | Not supported | Badge is purely presentational; no interactive elements |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Selectable/Active | ❌ | Not supported | Purely presentational component |
| Disabled | ❌ | Not applicable | No interactive states |
| Loading | ❌ | Not supported | Static display only |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Color options | ✅ | Native | Full theme color palette: blue, green, red, amber, indigo, cyan, crimson, gray, etc. |
| Size options | ✅ | Native | Three sizes: `size="1"` (compact), `size="2"` (default), `size="3"` (large) |
| Visual variants | ✅ | Native | Four variants: `solid`, `soft` (default), `surface`, `outline` |
| Bordered/Borderless | ✅ | Native | `outline` variant provides border; others are borderless |

## Interactive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Clickable | ✅ | Composed | Can use `asChild` to render on clickable elements like `<a>` or `<button>` |
| Closable/Removable | ❌ | Not supported | No built-in close functionality |
| onClick handler | ✅ | Composed | Via `asChild` pattern with clickable element |
| onClose handler | ❌ | Not supported | No close mechanism |

## Code Examples
```jsx
// Basic usage
import { Badge } from '@radix-ui/themes';

<Badge>Default</Badge>

// With color and variant
<Badge color="blue" variant="soft">In progress</Badge>
<Badge color="green" variant="solid">Complete</Badge>
<Badge color="orange" variant="outline">In review</Badge>

// Size variants
<Badge size="1" color="indigo">Small</Badge>
<Badge size="2" color="indigo">Medium</Badge>
<Badge size="3" color="indigo">Large</Badge>

// All visual variants
<Badge variant="solid" color="indigo">Solid</Badge>
<Badge variant="soft" color="indigo">Soft</Badge>
<Badge variant="surface" color="indigo">Surface</Badge>
<Badge variant="outline" color="indigo">Outline</Badge>

// High contrast mode for accessibility
<Badge color="gray" variant="soft" highContrast>High Contrast</Badge>

// Radius customization
<Badge radius="none">Sharp corners</Badge>
<Badge radius="small">Slightly rounded</Badge>
<Badge radius="medium">Moderately rounded</Badge>
<Badge radius="large">Highly rounded</Badge>
<Badge radius="full">Pill shape</Badge>

// AsChild pattern - render on custom element
<Badge color="red" asChild>
  <a href="/urgent">Urgent Update</a>
</Badge>

// With margin props for spacing
<Badge m="2" color="blue">Margin all sides</Badge>
<Badge mx="4" my="2" color="green">Horizontal & vertical</Badge>

// Combining multiple props
<Badge
  variant="solid"
  color="crimson"
  size="3"
  highContrast
  radius="full"
>
  Important
</Badge>

// Practical use cases
import { Flex, Card, Text, Badge } from '@radix-ui/themes';

// Status indicator
<Card>
  <Flex justify="between" align="center">
    <Text>User Account</Text>
    <Badge color="green" variant="soft">Active</Badge>
  </Flex>
</Card>

// Multiple status badges
<Flex gap="2">
  <Badge color="blue">Draft</Badge>
  <Badge color="amber">Pending</Badge>
  <Badge color="green">Published</Badge>
  <Badge color="red">Archived</Badge>
</Flex>

// Category labels
<Flex gap="2" wrap="wrap">
  <Badge variant="surface" color="indigo">React</Badge>
  <Badge variant="surface" color="purple">TypeScript</Badge>
  <Badge variant="surface" color="cyan">CSS</Badge>
</Flex>
```

[View Live Examples](https://www.radix-ui.com/themes/docs/components/badge)

## Notable Features
- **Comprehensive variant system**: Four visual styles (solid, soft, surface, outline) separate visual treatment from semantic meaning
- **Theme integration**: Deep integration with Radix Themes 12-step color system, supporting automatic dark mode and accessible contrast ratios
- **High contrast mode**: First-class `highContrast` prop for enhanced accessibility, works with all variants and colors
- **Responsive sizing**: Numeric size scale (1-3) provides consistent scaling across component library
- **AsChild composition**: Polymorphic rendering via `asChild` prop allows Badge styling on custom elements while preserving semantics
- **Radius customization**: Per-component border-radius override (none/small/medium/large/full) independent of theme defaults
- **Layout integration**: Built-in margin props (m, mx, my, mt, mb, ml, mr) for spacing control
- **Base element**: Built on semantic `<span>` element
- **No Tag component**: Radix Themes provides Badge only (no separate Tag component) - Badge covers all compact labeling use cases

## Additional Props & API Details

### Core Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'solid' \| 'soft' \| 'surface' \| 'outline'` | `'soft'` | Visual style variant |
| `size` | `'1' \| '2' \| '3'` | `'2'` | Component size scale |
| `color` | `ThemeColor` | - | Theme accent color (blue, green, red, etc.) |
| `highContrast` | `boolean` | `false` | Enhanced contrast mode for accessibility |
| `radius` | `'none' \| 'small' \| 'medium' \| 'large' \| 'full'` | - | Border radius override |
| `asChild` | `boolean` | `false` | Render on child element via Slot composition |
| Margin props | Various | - | `m`, `mx`, `my`, `mt`, `mb`, `ml`, `mr` for spacing |

### Variant Behavior
| Variant | Background | Border | Text | Best For |
|---------|------------|--------|------|----------|
| **solid** | Fully filled | None | High contrast | Maximum visibility, primary status |
| **soft** | Subtle tint | None | Medium contrast | Default choice, gentle emphasis |
| **surface** | Elevated | Shadow/Border | Medium contrast | Card-like separation, elevated context |
| **outline** | Minimal | Visible border | Color-matched | Lightweight, understated indicators |

## Research Notes
- **Documentation access**: Successfully fetched via web API
- **Framework specificity**: Radix UI Themes is React-specific, requires React 16.8+ with hooks
- **Design system approach**: Badge is tightly integrated with Radix Themes provider and color system, not a standalone primitive
- **Semantic considerations**: Called "Badge" but functions as both badge and tag (no separate Tag component in Radix Themes)
- **Breaking changes**: Size scale was revised in recent versions - size 2 became smaller, size 3 was added
- **Composition philosophy**: Follows Radix Primitives composition pattern via `asChild`, enabling polymorphic behavior
- **CSS architecture**: Uses CSS custom properties and design tokens for runtime theming
- **Accessibility**: High-contrast mode and accessible color contrast ratios built-in
- **No overlay mode**: Unlike some frameworks (e.g., Ant Design), Radix Badge is standalone only, not a notification overlay wrapper

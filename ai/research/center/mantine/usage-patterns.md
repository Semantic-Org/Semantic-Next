# Mantine - Center Usage Patterns

## Component URL
https://mantine.dev/core/center/
Status: ✅ Working
Version: v8.3.6 (Mantine Core)
Last Verified: 2025-11-05

## Documentation Quality
Good - Concise documentation with clear examples showing basic and advanced usage. Covers the essential use cases with practical code examples. Documentation is focused and to-the-point without excessive detail.

## Component Definition
- **Core purpose**: A layout utility component that centers content both vertically and horizontally within its container. Simplifies the common task of center alignment without requiring manual flexbox or CSS Grid configuration.
- **Mental model**: A wrapper component that automatically applies centering styles to its container. Users think of it as "wrap my content in Center and it will be centered." Acts as a semantic centering primitive.
- **Semantic meaning**: Communicates intentional centered layout. Visually creates a focal point by positioning content at the geometric center of its container space.

## Pattern Support Levels
- **Native**: Component-specific props (`inline`, `maw`, `h`, `bg`, `component`)
- **Composed**: Content via children composition
- **CSS-only**: Additional styling through Mantine's style props system

## Content Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Children composition | ✅ | Composed | All content passed as children - accepts any React nodes |
| Text content | ✅ | Composed | Text can be direct children or wrapped in elements |
| Icon support | ✅ | Composed | Icons demonstrated in examples (IconArrowLeft) |
| Media support | ✅ | Composed | Accepts any React component/element as children |
| Custom content | ✅ | Composed | No restrictions on child content - fully composable |

## Type Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Block centering | ✅ | Native (default) | Default behavior - renders as `div` element |
| Inline centering | ✅ | Native | `inline` prop for inline element centering |
| Polymorphic element | ✅ | Native | `component` prop allows changing root element (e.g., `button`) |

## State Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Loading | ❌ | - | No dedicated loading state |
| Disabled | ❌ | - | No dedicated disabled state (use via polymorphic element) |
| Interactive states | ⚠️ | Composed | Available when used with polymorphic `component` prop |

## Variation Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Size options | ❌ | - | No predefined size variants |
| Spacing control | ✅ | Native | `maw` (max-width), `h` (height) props for dimension control |
| Visual styles | ✅ | Native | `bg` prop for background color |
| Color options | ✅ | Native | Via `bg` prop using Mantine color variables |
| Alignment | ✅ | Native (implicit) | Centers both horizontally and vertically by default |

## Layout & Dimension Props
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Maximum width | ✅ | Native | `maw` prop (e.g., `maw={400}`) |
| Height control | ✅ | Native | `h` prop (e.g., `h={100}`) |
| Width control | ⚠️ | CSS-only | Via Mantine style props, not dedicated prop |
| Min/max dimensions | ⚠️ | CSS-only | Via Mantine style props system |

## Code Examples

### Basic Centered Content
```tsx
import { Center, Box } from '@mantine/core';

function Demo() {
  return (
    <Center maw={400} h={100} bg="var(--mantine-color-gray-light)">
      <Box bg="var(--mantine-color-blue-light)">
        All elements inside Center are centered
      </Box>
    </Center>
  );
}
```

### Inline Centering with Icons
```tsx
import { Center, Anchor, Box } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';

function Demo() {
  return (
    <Anchor href="https://mantine.dev" target="_blank">
      <Center inline>
        <IconArrowLeft size={12} />
        <Box ml={5}>Back to Mantine website</Box>
      </Center>
    </Anchor>
  );
}
```

### Polymorphic Usage
```tsx
import { Center } from '@mantine/core';

function Demo() {
  return <Center component="button">Centered Button</Center>;
}
```

## Props/API Documentation

### Component Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `component` | React component or HTML element | `'div'` | Root element type (polymorphic) |
| `inline` | boolean | `false` | If true, renders as inline element with inline centering |
| `maw` | number \| string | - | Maximum width of the container |
| `h` | number \| string | - | Height of the container |
| `bg` | string | - | Background color (supports Mantine color variables) |
| `children` | ReactNode | - | Content to be centered |

### Style Props
Inherits all Mantine style props system (margin, padding, etc.)

## Variants and Composition Patterns

### Component Variants
- **Block Center** (default): Standard block-level centering container
- **Inline Center**: Inline element centering via `inline` prop

### Composition Patterns
1. **Simple Wrapper**: Wrap any content for automatic centering
2. **Nested Composition**: Center can contain complex component trees
3. **Icon + Text**: Common pattern for centering icon-text combinations
4. **Polymorphic Forms**: Can be transformed into interactive elements (button, link, etc.)

### Usage with Other Components
- Demonstrated with `Box`, `Anchor`, and Tabler icons
- Works with any Mantine or React component as children
- Can be used within other layout components

## Styling Approaches

### Built-in Styling
- Uses Mantine's style props system (`maw`, `h`, `bg`)
- Supports Mantine CSS variables (e.g., `var(--mantine-color-gray-light)`)
- Inherits Mantine's theming system

### Customization
- All Mantine style props available (margin, padding, borders, etc.)
- Can override with custom styles via `className` or `style` props
- Polymorphic nature allows element-specific styling

### Implementation Details
- Likely uses CSS flexbox for centering (align-items: center, justify-content: center)
- Inline variant probably uses inline-flex display

## Accessibility Patterns

### Accessibility Features
- No dedicated accessibility props documented
- Polymorphic behavior allows semantic HTML (e.g., `component="button"` with proper button semantics)
- No ARIA attributes mentioned in documentation

### Considerations
- Purely presentational component - accessibility depends on content
- When used polymorphically, inherits semantics of chosen element
- No keyboard interaction (unless using interactive polymorphic element)

## Notable Features

### Polymorphic Component Architecture
- Implements Mantine's polymorphic component pattern
- Requires special TypeScript handling: `createPolymorphicComponent` for wrapped versions
- Props don't extend HTML element props by default - need explicit typing
- Enables semantic HTML flexibility while maintaining centering behavior

### Inline Centering
- Dedicated `inline` prop for inline-level centering
- Useful for centering within text flow or inline contexts
- Different from block-level default behavior

### Mantine Integration
- Fully integrated with Mantine's design system
- Uses Mantine color variables and theming
- Supports all Mantine style props for consistency
- Part of the core layout utilities

### Simplicity of API
- Minimal API surface - focused on single responsibility
- No complex configuration - just wrap and center
- Style props provide escape hatch for customization without API bloat

## Research Notes

### Documentation Characteristics
- Very concise documentation focused on practical examples
- Three main examples cover the primary use cases effectively
- Minimal prose, maximum code demonstration
- Links to polymorphic component documentation for advanced TypeScript usage

### Framework Approach
- Center is positioned as a layout utility, not a general-purpose component
- Part of a larger layout primitives system in Mantine
- Emphasizes composition over configuration
- Polymorphic pattern is a key Mantine architectural feature

### TypeScript Considerations
- Documentation explicitly mentions TypeScript implications of polymorphism
- Warns that props don't automatically extend based on `component` prop
- Provides guidance on preserving polymorphic types when wrapping

### Version Information
- Documentation shows version v8.3.6
- Part of `@mantine/core` package
- Current version as of verification date (2025-11-05)

### Comparison to Other Frameworks
- Similar simplicity to Chakra UI's Center component
- Mantine's inline prop is distinctive
- Polymorphic pattern is more prominent in Mantine's architecture
- Less opinionated than some frameworks - pure utility component

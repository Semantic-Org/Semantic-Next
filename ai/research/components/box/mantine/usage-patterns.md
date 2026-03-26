# Mantine - Box Usage Patterns

> Last Modified: 2025-11-05

## Component URL
https://mantine.dev/core/box/
Status: ✅ Working
Version: v8.3.6 (Current)
Last Verified: 2025-11-05

## Documentation Quality
Minimal - The documentation is very brief, providing only a single code example. Most details about Box must be inferred from general Mantine documentation about style props and polymorphic components.

## Component Definition
- **Core purpose**: Serves as the foundational building block for all Mantine components, providing a flexible container with theme-aware styling and polymorphic rendering capabilities. It's essentially a styled primitive that can transform into any HTML element while maintaining access to the Mantine theme system.
- **Mental model**: Think of Box as a "universal styled element" - it's not a specific UI pattern, but rather a utility component that lets you quickly create styled elements without writing CSS. It's the lowest-level abstraction in Mantine's component hierarchy.
- **Semantic meaning**: Box has no inherent semantic meaning - its semantics are determined by the `component` prop. It's a styling utility first, semantic element second.

## Pattern Support Levels
- **Native**: Dedicated prop/API (e.g., `padding="4"`)
- **Composed**: Via composition/children (e.g., `<Box>{content}</Box>`)
- **CSS-only**: Requires custom styling (e.g., `style={{ ... }}`)

## Styling Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Spacing props | ✅ | Native | Full margin/padding support: `m`, `mt`, `mb`, `ml`, `mr`, `ms`, `me`, `mx`, `my`, `p`, `pt`, `pb`, `pl`, `pr`, `ps`, `pe`, `px`, `py`. Accepts theme tokens (xs, sm, md, lg, xl) or direct values |
| Color props | ✅ | Native | Background (`bg`) and text color (`c`). Accepts theme color tokens (e.g., `blue.5`) or direct values (hex, rgba) |
| Layout props | ✅ | Native | `display`, `flex` props available. Width/height via dimension props |
| Flexbox props | ⚠️ | Native (limited) | Only `flex` prop available for flex shorthand. No dedicated props for justify-content, align-items, gap, direction, or wrap |
| Grid props | ❌ | CSS-only | No native grid props. Must use `style` prop or CSS |
| Position props | ✅ | Native | Full positioning support: `pos`, `top`, `left`, `bottom`, `right`, `inset` |
| Border props | ✅ | Native | Border (`bd`) and border-radius (`bdrs`) props |
| Typography props | ✅ | Native | Comprehensive: `ff`, `fz`, `fw`, `lts`, `ta`, `lh`, `fs`, `tt`, `td` |

## Polymorphism Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Element type control | ✅ | Native | `component` prop allows rendering as any HTML element (string) or React component |
| Component wrapping | ✅ | Native | Can wrap any React component (router links, custom components) while maintaining type safety |

## Responsive Patterns
| Pattern | Present | Support | Details |
|---------|---------|---------|---------|
| Responsive props | ✅ | Native | Object syntax with breakpoints: `{ base, xs, sm, md, lg, xl }`. Applies to all style props |
| Mobile-first | ✅ | Native | `base` key represents mobile default, larger breakpoints applied via media queries |

## Code Examples
```tsx
// Primary usage example - Basic Box with styling and polymorphism
import { Box } from '@mantine/core';

function Demo() {
  return (
    <Box bg="red.5" my="xl" component="a" href="/">
      My component
    </Box>
  );
}
```
[View Live](https://mantine.dev/core/box/)

```tsx
// Responsive sizing example
<Box
  w={{ base: 200, sm: 400, lg: 500 }}
  p={{ base: 'sm', md: 'lg' }}
>
  Responsive content
</Box>
```

```tsx
// Comprehensive spacing example
<Box
  m="md"        // margin all sides
  mx="lg"       // margin horizontal (overrides m for x-axis)
  py="xl"       // padding vertical
  px="sm"       // padding horizontal
>
  Spaced content
</Box>
```

```tsx
// Typography styling
<Box
  ff="monospace"      // font-family
  fz="lg"            // font-size (theme token)
  fw={700}           // font-weight (direct value)
  ta="center"        // text-align
  c="blue.6"         // color (theme token)
>
  Styled text
</Box>
```

```tsx
// Positioning example
<Box
  pos="absolute"     // position
  top={20}           // top offset
  left={0}           // left offset
  w="100%"           // width
  bg="white"         // background
  opacity={0.9}      // opacity
>
  Positioned overlay
</Box>
```

```tsx
// Custom component polymorphism
import { Link } from 'react-router-dom';

<Box component={Link} to="/about" p="md" bg="gray.1">
  Router link styled as Box
</Box>
```

```tsx
// Direct style prop for custom CSS
<Box
  style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  }}
>
  Grid layout content
</Box>
```

## Notable Features

- **Universal Foundation**: Box is the base component for ALL Mantine components, meaning every Mantine component inherits these styling capabilities
- **Theme Integration**: All style props automatically connect to the Mantine theme system (colors, spacing, fonts)
- **Type Safety**: Full TypeScript support with generic type arguments (`<Box<'input'> />`) for proper prop inference
- **Minimal Abstraction**: Very thin wrapper around native elements - adds styling convenience without heavy abstractions
- **Direct Value Support**: Props accept both theme tokens (`"md"`) and direct CSS values (`"16px"`, `#EDFEFF`, `2rem`)
- **Limited Flexbox/Grid**: Unlike some utility-based systems, Mantine Box doesn't provide comprehensive flex/grid props - only basic `flex` and `display` props are available

## Research Notes

- The official Box documentation is surprisingly minimal - just one example. This appears intentional, as Box is meant to be a simple foundational primitive
- Most Box capabilities must be discovered through the general "Style Props" documentation rather than component-specific docs
- No dedicated flexbox utility props (justify, align, gap, etc.) - developers must use the `style` prop or use dedicated layout components (Flex, Grid) for complex layouts
- The polymorphic pattern is well-documented separately, showing Box can transform into links, buttons, or any custom component
- Responsive props use object notation rather than array notation (unlike some other systems)
- All spacing-related props use the same theme key (`theme.spacing`), providing consistency
- The component is designed for quick prototyping and simple layouts, not as a complete CSS-in-JS solution
- Documentation assumes familiarity with CSS properties - prop names are abbreviations (e.g., `bg` = background, `c` = color, `bd` = border)

## Implementation Details

**Style Props System**:
- Props are applied to the root element only (not nested elements)
- For nested element styling, Mantine's Styles API must be used instead
- Theme token resolution happens at runtime
- Responsive values generate media query CSS automatically

**Polymorphic Implementation**:
- Default element is typically `div`
- `component` prop accepts string (HTML element name) or React component reference
- All HTML attributes pass through to the underlying element
- TypeScript inference maintains type safety for element-specific props

**Value Resolution**:
1. Theme tokens (e.g., `"md"`) → resolved from theme object
2. Numeric values (e.g., `16`) → converted to `rem` units
3. String with units (e.g., `"20px"`) → used directly
4. CSS keywords (e.g., `"auto"`) → used directly

**Responsive Breakpoints**:
- `base`: Mobile default (no media query)
- `xs`: 36em (576px)
- `sm`: 48em (768px)
- `md`: 62em (992px)
- `lg`: 75em (1200px)
- `xl`: 88em (1408px)

## Comparison with Other Frameworks

**vs Chakra UI Box**: Mantine Box is more minimal - Chakra provides more comprehensive flexbox/grid props. Mantine pushes developers toward dedicated Flex/Grid components for complex layouts.

**vs MUI Box**: Similar concept, but MUI's `sx` prop provides more comprehensive styling capabilities. Mantine separates concerns more clearly between style props and custom styling.

**vs Tailwind/Utility-First**: Box provides programmatic prop-based styling rather than class-based styling. Less comprehensive than Tailwind's utility classes but more type-safe and theme-integrated.

## Common Use Cases

1. **Quick Prototyping**: Rapidly create styled elements without writing CSS files
2. **Theme-Aware Wrappers**: Container elements that need to respect design system tokens
3. **Polymorphic Links**: Transform links into styled containers (`<Box component="a">`)
4. **Responsive Containers**: Simple containers with breakpoint-based styling
5. **Spacing Utilities**: Add margins/padding using theme tokens
6. **Custom Component Styling**: Wrap third-party components with Mantine theming
7. **Absolute Positioning**: Overlays, modals, tooltips with positioned containers
8. **Typography Containers**: Text blocks with custom font styling

## Anti-Patterns to Avoid

- **Overuse for Complex Layouts**: Use dedicated Flex/Grid components instead of Box with inline styles for complex layouts
- **Replacing Semantic Components**: Don't use Box when semantic components exist (Button, Card, etc.)
- **CSS-in-JS Substitute**: Box is not a complete CSS-in-JS solution - for complex styling needs, use Mantine's Styles API
- **Excessive Nesting**: Deep nesting of Box components can indicate need for custom component abstraction
